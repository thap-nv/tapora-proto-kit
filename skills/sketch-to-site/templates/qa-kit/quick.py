# Kiểm nhanh sau mỗi lần sửa: preflight + chỉ các bộ bị ảnh hưởng bởi file đã đổi, không chụp ảnh, so với mốc cuốn chiếu.
# Chạy từ thư mục prototype (thư mục chứa _qa/):
#   python _qa/quick.py --note "tweak: đổi nhãn nút Đặt lịch ở trang chủ"
#   python _qa/quick.py --dry                      (chỉ in file đổi và bộ sẽ chạy)
#   python _qa/quick.py --note "..." --all         (chạy mọi bộ; dùng sau khi đổi cấu hình một bộ trong qa.config.json)
#   python _qa/quick.py --note "..." --themes <theme1>,<theme2>
# File đổi = khác băm so với _qa/current/manifest.json. Bộ bị ảnh hưởng = bộ của mọi trang nạp file đó
# (đọc từ thẻ <script>/<link>/<img> của trang), cộng bộ có file bước đổi. Đổi file .css thì chạy thêm mọi theme khác.
# Sạch (0 lỗi console, 0 FAIL, 0 bước im lặng, 0 tràn ngang mới, 0 chữ tràn hoặc bị cắt mới trong khung, preflight 0 lỗi)
# thì ghi kết quả vào _qa/current/ và thêm một dòng vào _qa/current/ledger.jsonl. Không sạch thì không ghi, thoát mã 1.
import argparse, datetime, json, os, shutil, sys
import qalib as Q

ap = argparse.ArgumentParser()
ap.add_argument('--note', default='', help='một dòng: lần sửa này làm gì (ghi vào ledger)')
ap.add_argument('--all', action='store_true')
ap.add_argument('--dry', action='store_true')
ap.add_argument('--no-save', action='store_true')
ap.add_argument('--themes', default='')
a = ap.parse_args()

old = Q.load_json(os.path.join(Q.CUR, 'manifest.json'))
if old is None:
    print('Chưa có mốc _qa/current/. Chạy: python _qa/handover.py run, rồi python _qa/handover.py promote <thư-mục-chạy>')
    sys.exit(2)
if not (a.dry or a.no_save or a.note):
    print('Thiếu --note "<lần sửa này làm gì>": dòng này vào ledger để handover.py gán khác biệt cho đúng lần sửa')
    sys.exit(2)

new = Q.manifest()
changed = Q.changed_files(old, new)
others = [t for t in Q.THEMES if t != Q.DEFAULT_THEME]
themes = [t for t in a.themes.split(',') if t] or [Q.DEFAULT_THEME] + (others if any(f.endswith('.css') for f in changed) else [])
names = list(Q.SUITE_NAMES) if a.all else Q.affected_suites(changed)
# Bộ chưa có trong mốc (bộ mới thêm vào qa.config.json) thì chạy luôn
for th in themes:
    for n in Q.SUITE_NAMES:
        if n not in names and not (th != Q.DEFAULT_THEME and n.startswith(Q.run_all.THEME_PREFIX)) and not os.path.exists(os.path.join(Q.CUR, th, n, 'report.json')):
            names.append(n)
names = [n for n in Q.SUITE_NAMES if n in names]

print('File đổi từ lần kiểm trước:', ', '.join(changed) if changed else 'không')
print('Bộ sẽ chạy:', ', '.join(names) if names else 'không', '·', ' + '.join(themes))
print('preflight:', Q.shown(Q.PREFLIGHT) if Q.PREFLIGHT else 'không tìm thấy')
if a.dry:
    sys.exit(0)

pf_ok, pf_line = Q.preflight()
out = os.path.join(Q.HERE, '.quick-run')
shutil.rmtree(out, ignore_errors=True)
res = Q.run_suites(names, out, themes, shots=False) if names else {}

tot = {'steps': 0, 'errors': 0, 'fails': 0, 'silent': 0, 'over': 0, 'cut': 0, 'changed': 0}
ledger_changed, ledger_lost, ledger_new, bad = [], [], [], []
for (th, name), r in sorted(res.items()):
    if 'crash' in r:
        bad.append(f'  LỖI CHẠY {th}/{name}: {r["crash"][:200]}')
        continue
    rep = Q.load_json(os.path.join(out, th, name, 'report.json'))
    d = Q.diff_report(Q.load_json(os.path.join(Q.CUR, th, name, 'report.json')), rep, name)
    tot['steps'] += r['steps']; tot['errors'] += r['errors']; tot['fails'] += len(r['fails'])
    tot['silent'] += len(r['silent']); tot['over'] += len(d['over_new']); tot['cut'] += len(d['cut_new']); tot['changed'] += len(d['changed'])
    if r['errors']:
        bad += [f'  console {th}/{name} · {x["step"]}: {Q.short(x["errors"][:2], 200)}' for x in rep if x['errors']]
    bad += [f'  FAIL {th}/{name} · {Q.short(f, 200)}' for f in r['fails']]
    bad += [f'  im lặng {th}/{name} · {s} (có check mà không trả giá trị)' for s in r['silent']]
    bad += [f'  tràn ngang mới {th}/{name} · {s}' for s in d['over_new']]
    bad += [f'  trong khung mới {th}/{name} · {s}: {c}' for s, c in d['cut_new']]
    for n, x, y in d['changed']:
        print(f'  đổi check {th}/{name} · {n}: {Q.short(x)} → {Q.short(y)}')
        ledger_changed.append([th, name, n, Q.short(x, 300), Q.short(y, 300)])
    ledger_lost += [[th, name, n] for n in d['lost']]
    ledger_new += [[th, name, n] for n in d['new']]
if ledger_lost:
    print('  bước mất:', ', '.join('/'.join(x) for x in ledger_lost))
if ledger_new:
    print('  bước mới:', len(ledger_new))
for line in bad:
    print(line)
if tot['cut']:
    print('Chữ tràn hoặc bị cắt trong khung: xem ảnh của bước đó. Cố ý (tràn lề, marquee, slide ló) thì gắn data-clip-ok="<lý do>" vào khung. Không cố ý thì sửa ở gốc, đừng làm im.')

clean = pf_ok and not bad and tot['errors'] == 0 and tot['fails'] == 0 and tot['silent'] == 0 and tot['over'] == 0 and tot['cut'] == 0
verdict = 'ĐẠT' if clean else 'CHƯA ĐẠT'
if clean and not a.no_save:
    Q.copy_reports(out, Q.CUR, res.keys())
    Q.save_json(os.path.join(Q.CUR, 'manifest.json'), new)
    entry = {'time': datetime.datetime.now().isoformat(timespec='seconds'), 'note': a.note, 'files': changed,
             'suites': names, 'themes': themes, 'changed': ledger_changed, 'lost': ledger_lost, 'new': ledger_new}
    with open(os.path.join(Q.CUR, 'ledger.jsonl'), 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry, ensure_ascii=False) + '\n')
    verdict += ', đã lưu mốc current'
elif not clean:
    verdict += ', chưa lưu mốc: sửa rồi chạy lại'
print(f'quick · {len(changed)} file đổi · {len(res)} bộ ({" + ".join(themes)}) · {tot["steps"]} bước · preflight: {pf_line} · '
      f'console {tot["errors"]} · FAIL {tot["fails"]} · im lặng {tot["silent"]} · tràn mới {tot["over"]} · cắt mới {tot["cut"]} · check đổi {tot["changed"]} → {verdict}')
sys.exit(0 if clean else 1)
