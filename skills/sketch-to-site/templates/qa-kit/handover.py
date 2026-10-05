# Kiểm tổng trước bàn giao (skill handover-check). Chạy từ thư mục prototype (thư mục chứa _qa/):
#   python _qa/handover.py run [--themes <theme1>,<theme2>]
#       preflight + mọi bộ ở mọi theme trong qa.config.json (chụp ảnh ở mọi theme), lượt kiểm sâu (trạng thái, bàn phím, tương tác)
#       ở bộ khói khổ desktop của mỗi trang (dự án không có bộ khói: bộ khổ desktop đầu tiên của trang), vào _qa/handover/<ngày-giờ>/,
#       so với _qa/last-green/, gán từng khác biệt cho một dòng trong _qa/current/ledger.jsonl.
#       Thoát mã 1 khi có lỗi hoặc có khác biệt không gán được. Nợ cũ in gộp, mỗi mục một dòng; handover.json giữ đủ danh sách.
#   python _qa/handover.py promote _qa/handover/<ngày-giờ>
#       sau khi người dùng chốt: lần chạy đó thành last-green, current làm lại từ đó, ledger chuyển vào thư mục chạy.
#   python _qa/handover.py thumbs
#       chụp lại ảnh Hub khai báo ở "thumbs" trong qa.config.json, mỗi theme một ảnh. Chạy TRƯỚC run.
import argparse, datetime, json, os, shutil, subprocess, sys
import qalib as Q


def read_ledger():
    p = os.path.join(Q.CUR, 'ledger.jsonl')
    if not os.path.exists(p):
        return []
    return [json.loads(l) for l in open(p, encoding='utf-8') if l.strip()]


def cmd_run(a):
    themes = [t for t in (a.themes or ','.join(Q.THEMES)).split(',') if t]
    out = os.path.join(Q.HERE, 'handover', datetime.datetime.now().strftime('%Y%m%d-%H%M'))
    shutil.rmtree(out, ignore_errors=True)
    start = Q.manifest()
    Q.save_json(os.path.join(out, 'manifest.json'), start)
    pf_ok, pf_line = Q.preflight()
    res = Q.run_suites(Q.SUITE_NAMES, out, themes, shots=True, deep=True)
    if Q.manifest() != start:
        print('CẢNH BÁO: file của site hoặc bộ kiểm đổi trong lúc chạy. Chạy lại.')

    green = Q.load_json(os.path.join(Q.GREEN, 'manifest.json'))
    known = Q.known_lines(Q.GREEN)
    ledger = read_ledger()
    step_owner = {}
    for i, e in enumerate(ledger):
        for c in e.get('changed', []) + e.get('lost', []) + e.get('new', []):
            step_owner.setdefault((c[1], c[2]), set()).add(i)
    file_owner = {}
    for i, e in enumerate(ledger):
        for f in e.get('files', []):
            file_owner.setdefault(f, set()).add(i)

    bad, unattributed, attributed = [], [], {}
    per_theme = {th: {'suites': 0, 'steps': 0, 'errors': 0, 'fails': 0, 'silent': 0, 'over': 0, 'cut': 0, 'contrast': 0, 'intent': 0, 'deep': 0, 'changed': 0} for th in themes}
    new_suites, lost_suites, debt, debt_rows = [], [], [], []
    for (th, name), r in sorted(res.items()):
        t = per_theme[th]
        if 'crash' in r:
            bad.append(f'LỖI CHẠY {th}/{name}: {r["crash"][:200]}')
            continue
        rep = Q.load_json(os.path.join(out, th, name, 'report.json'))
        base = Q.load_json(os.path.join(Q.GREEN, th, name, 'report.json'))
        if green is not None and base is None:
            new_suites.append(f'{th}/{name}')
        d = Q.diff_report(base, rep, name, known)
        t['suites'] += 1; t['steps'] += r['steps']; t['errors'] += r['errors']; t['fails'] += len(r['fails'])
        t['silent'] += len(r['silent']); t['over'] += len(d['over_new']); t['cut'] += len(d['cut_new']); t['changed'] += len(d['changed'])
        # Lỗi console của lượt sâu không chặn vô điều kiện: so với mốc như các phép đo khác (deep_errors bên dưới)
        bad += [f'console {th}/{name} · {x["step"]}: {Q.short(x["errors"][:2], 200)}' for x in rep if x['errors'] and x['step'] != Q.qadiff.DEEP_STEP]
        bad += [f'FAIL {th}/{name} · {Q.short(f, 200)}' for f in r['fails']]
        bad += [f'im lặng {th}/{name} · {s}' for s in r['silent']]
        # Kèm phần tử gây tràn (run.mjs đo "wide"): khỏi phải tự dò
        wide = {x['step']: x['dims'].get('wide') or [] for x in rep or [] if x.get('dims')}
        bad += [f'tràn ngang {"mới " if base else "(chưa có mốc) "}{th}/{name} · {s}' + (f': do {", ".join(wide[s])}' if wide.get(s) else '') for s in d['over_new']]
        bad += [f'trong khung {"mới " if base else "(chưa có mốc) "}{th}/{name} · {s}: {c}' for s, c in d['cut_new']]
        for key, lab in (('contrast', 'tương phản'), ('intent', 'ý định'), ('states', 'trạng thái'), ('keyboard', 'bàn phím'), ('interactive', 'tương tác'),
                         (Q.qadiff.DEEP_ERRORS, 'console lượt sâu')):
            new = d[key + '_new']
            t[key if key in ('contrast', 'intent') else 'deep'] += len(new)
            bad += [f'{lab} {"mới " if base else "(chưa có mốc) "}{th}/{name} · {s}: {c}' for s, c in new]
        debt += [f'{th}/{name} · {k} · {s}: {c}' for s, k, c in d['debt']]
        debt_rows += [(th, name, s, k, c) for s, k, c in d['debt']]
        # Bước mất hay bước mới chỉ sinh ra khi file bước đổi: gán cho lần sửa đã đổi file bước đó
        steps_file = '_qa/steps-' + next(s[2] for s in Q.run_all.SUITES if s[0] == name) + '.json'
        by_file = file_owner.get(steps_file, set())
        items = [(n, set(), f'đổi check {th}/{name} · {n}: {Q.short(x)} → {Q.short(y)}') for n, x, y in d['changed']]
        items += [(n, by_file, f'mất bước {th}/{name} · {n}') for n in d['lost']]
        items += [(n, by_file, f'bước mới {th}/{name} · {n}') for n in d['new']]
        for n, extra, line in items:
            owners = step_owner.get((name, n), set()) | extra
            if owners:
                for i in owners:
                    attributed.setdefault(i, []).append(line)
            else:
                unattributed.append(line)
    if green is not None:
        for th in themes:
            gdir = os.path.join(Q.GREEN, th)
            for name in (sorted(os.listdir(gdir)) if os.path.isdir(gdir) else []):
                if (th, name) not in res:
                    lost_suites.append(f'{th}/{name}')

    print(f'Thư mục chạy: {os.path.relpath(out, Q.ROOT)}')
    print(f'preflight: {pf_line}' + (f'  ({Q.shown(Q.PREFLIGHT)})' if Q.PREFLIGHT else ''))
    for th, t in per_theme.items():
        print(f'{th}: {t["suites"]} bộ · {t["steps"]} bước · console {t["errors"]} · FAIL {t["fails"]} · im lặng {t["silent"]} · '
              f'tràn mới {t["over"]} · cắt mới {t["cut"]} · tương phản mới {t["contrast"]} · ý định mới {t["intent"]} · sâu mới {t["deep"]} · check đổi so với last-green {t["changed"]}')
    # Lượt sâu có chạy thật không: "sâu mới 0" một mình không phân biệt được "đã kiểm, sạch" với "không kiểm"
    deep_ran = [n for n in Q.SUITE_NAMES if any(r.get('deep_ran') for (th, nm), r in res.items() if nm == n)]
    deep_missed = [n for n in Q.SUITE_NAMES if n in Q.DEEP_SUITES and n not in deep_ran]
    if deep_ran:
        print(f'Lượt sâu: {len(deep_ran)} bộ ({", ".join(deep_ran)})'
              + (f'; bộ chọn mà không chạy được: {", ".join(deep_missed)}' if deep_missed else ''))
    elif 'desktop' not in Q.run_all.SIZES:
        print('Lượt sâu không chạy: "sizes" trong qa.config.json không có khổ "desktop"')
    elif not Q.DEEP_SUITES:
        print('Lượt sâu không chạy: qa.config.json không có bộ nào ở khổ desktop')
    else:
        print(f'Lượt sâu không chạy: bộ chọn cho lượt sâu không chạy được (thiếu file bước, lỗi chạy, hoặc theme đã chọn bỏ bộ đó): {", ".join(deep_missed)}')
    if green is None:
        print('Chưa có last-green: lần chạy này là mốc đầu, không có gì để so. Tràn ngang được liệt kê để xác nhận là cố ý.')
    else:
        files = Q.changed_files(green, start)
        print(f'\nFile đổi từ lần bàn giao trước ({len(files)}):')
        for f in files:
            print('  ' + f + ('' if f in file_owner else '   ← không có trong ledger (sửa mà không chạy quick.py)'))
        print(f'\nCác lần sửa trong ledger ({len(ledger)}):')
        for i, e in enumerate(ledger):
            print(f'  [{i + 1}] {e["time"]} · {e["note"]} · {len(e.get("files", []))} file · {len(e.get("changed", []))} check đổi')
            for line in attributed.get(i, [])[:30]:
                print('      ' + line)
            if len(attributed.get(i, [])) > 30:
                print(f'      … còn {len(attributed[i]) - 30} dòng')
        if new_suites:
            print('\nBộ mới (chưa có trong last-green):', ', '.join(new_suites))
        if lost_suites:
            print('Bộ có trong last-green mà lần này không chạy:', ', '.join(lost_suites))
        print(f'\nKhác biệt KHÔNG gán được cho lần sửa nào ({len(unattributed)}): cần xem từng dòng')
        for line in unattributed:
            print('  ' + line)
    # Nợ cũ gộp theo (phép đo, dòng đã bỏ số): mỗi mục một dòng dù gặp ở nhiều bước, khổ, theme. handover.json giữ đủ danh sách chưa gộp
    groups = Q.group_debt(debt_rows)
    ndebt = Q.debt_count(groups)
    if debt:
        print(f'\nNợ cũ ({ndebt}): lỗi có sẵn, không chặn promote. Last-green do bộ kiểm cũ ghi chưa đo mục này, '
              f'hoặc bộ mới mang lỗi đã có ở bộ khác trong last-green. {ndebt} mục, gặp {len(debt)} lần ở mọi bước, khổ, theme '
              '(đủ danh sách trong handover.json). Hỏi người dùng: sửa trước, hay nhận vào mốc (promote)?')
        for line in Q.debt_lines(groups):
            print(line)
    print(f'\nLỗi ({len(bad)}):')
    for line in bad:
        print('  ' + line)
    if any(t['cut'] for t in per_theme.values()):
        print('Chữ tràn hoặc bị cắt trong khung: xem ảnh của bước đó. Cố ý (tràn lề, marquee, slide ló) thì gắn data-clip-ok="<lý do>" vào khung. Không cố ý thì sửa ở gốc, đừng làm im.')
    Q.save_json(os.path.join(out, 'handover.json'), {'preflight': [pf_ok, pf_line], 'themes': per_theme, 'bad': bad,
                                                      'unattributed': unattributed, 'debt': debt, 'new_suites': new_suites, 'lost_suites': lost_suites,
                                                      'deep_suites': deep_ran})
    ok = pf_ok and not bad and not unattributed and not lost_suites
    tail = f', còn {ndebt} mục nợ cũ: hỏi người dùng sửa hay nhận vào mốc' if debt else ''
    print('\nKết luận:', f'SẠCH{tail}, chờ người dùng chốt rồi promote' if ok else 'CHƯA SẠCH, xem các mục trên')
    sys.exit(0 if ok else 1)


def cmd_promote(a):
    src = os.path.abspath(a.dir)
    m = Q.load_json(os.path.join(src, 'manifest.json'))
    if m is None:
        print('Không thấy manifest.json trong', a.dir); sys.exit(2)
    if m != Q.manifest():
        print('Site hoặc bộ kiểm đã đổi sau lần chạy này:', ', '.join(Q.changed_files(m, Q.manifest())))
        print('Chạy lại python _qa/handover.py run rồi promote thư mục mới.'); sys.exit(2)
    pairs = [(th, n) for th in Q.THEMES if os.path.isdir(os.path.join(src, th)) for n in os.listdir(os.path.join(src, th))]
    shutil.rmtree(Q.GREEN, ignore_errors=True)
    Q.copy_reports(src, Q.GREEN, pairs)
    Q.save_json(os.path.join(Q.GREEN, 'manifest.json'), m)
    led = os.path.join(Q.CUR, 'ledger.jsonl')
    if os.path.exists(led):
        shutil.move(led, os.path.join(src, 'ledger.jsonl'))
    shutil.rmtree(Q.CUR, ignore_errors=True)
    shutil.copytree(Q.GREEN, Q.CUR)
    print(f'last-green = {os.path.relpath(src, Q.ROOT)} ({len(pairs)} bộ). current làm lại từ last-green, ledger trống.')


def cmd_thumbs(a):
    # "thumbs": {"dir": "assets/shots", "items": [[trang, khoá file bước, khổ], ...]}; bước cuối của file bước có "shot"
    th_cfg = Q.CFG.get('thumbs') or {}
    items = th_cfg.get('items', [])
    if not items:
        print('qa.config.json không khai báo "thumbs". Không có gì để chụp.'); return
    tmp = os.path.join(Q.HERE, '.thumbs')
    shutil.rmtree(tmp, ignore_errors=True)
    for page, steps, size in items:
        sf = os.path.join(Q.HERE, 'steps-' + steps + '.json')
        shot = json.load(open(sf, encoding='utf-8'))['steps'][-1]['shot']
        for th, q in Q.THEMES.items():
            od = os.path.join(tmp, th)
            env = dict(os.environ, QA_QUERY=q, QA_NOSHOT='')
            r = subprocess.run(Q.run_all.NODE + [os.path.join(Q.HERE, 'run.mjs'), os.path.join(Q.SITE, page + '.html'), sf, od] + list(Q.run_all.SIZES[size]),
                               capture_output=True, text=True, encoding='utf-8', env=env)
            rep = json.loads(r.stdout)
            errs = sum(len(x['errors']) for x in rep)
            dst = os.path.join(Q.SITE, th_cfg.get('dir', 'assets/shots'), shot + ('' if th == Q.DEFAULT_THEME else '-' + th) + '.jpg')
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copyfile(os.path.join(od, shot + '.jpg'), dst)
            print(f'{os.path.relpath(dst, Q.ROOT)} · console {errs}')
    shutil.rmtree(tmp, ignore_errors=True)


ap = argparse.ArgumentParser()
sub = ap.add_subparsers(dest='cmd', required=True)
p = sub.add_parser('run'); p.add_argument('--themes', default=''); p.set_defaults(f=cmd_run)
p = sub.add_parser('promote'); p.add_argument('dir'); p.set_defaults(f=cmd_promote)
p = sub.add_parser('thumbs'); p.set_defaults(f=cmd_thumbs)
a = ap.parse_args()
a.f(a)
