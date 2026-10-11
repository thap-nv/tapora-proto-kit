# Kiểm tổng trước bàn giao (skill handover-check). Chạy từ thư mục prototype (thư mục chứa _qa/):
#   python _qa/handover.py run [--themes <theme1>,<theme2>] [--full] [--dry]
#       preflight + mọi bộ ở mọi theme trong qa.config.json (chụp ảnh ở mọi theme; trang khai "page_themes" chỉ ở theme của nó),
#       lượt kiểm sâu (trạng thái, bàn phím, tương tác) ở bộ khói khổ desktop của mỗi trang (dự án không có bộ khói: bộ khổ desktop
#       đầu tiên của trang), vào _qa/handover/<ngày-giờ>/, so với _qa/last-green/, gán từng khác biệt cho một dòng trong _qa/current/ledger.jsonl.
#       Có last-green: chỉ chạy bộ có trang, file nạp, file bước, cấu hình hay mã bộ kiểm đổi so với mốc; bộ khác lấy lại report của mốc
#       (dòng "Lấy lại từ last-green", không có ảnh mới). --full chạy mọi bộ. Lần chạy ghi ra thư mục tạm của máy, chỉ chuyển vào
#       _qa/handover/ khi xong; đầu mỗi lần chạy, lần chạy cũ bị bỏ ảnh (giữ 2 lần gần nhất, giữ mọi report), lần chạy dở bị xoá.
#       --dry: in ước lượng (số bộ, phút, ảnh) và checklist trước lệnh dài rồi thoát, không mở trình duyệt. Dòng ước lượng in cả khi chạy thật.
#       Thoát mã 1 khi có lỗi hoặc có khác biệt không gán được. Nợ cũ in gộp, mỗi mục một dòng; handover.json giữ đủ danh sách.
#       QA_RG_WATCHDOG=1 (Windows): mỗi 15 giây dừng rg.exe của VS Code sống quá 20 giây, chỉ rg, in một dòng tổng ở cuối; =dry chỉ đếm.
#   python _qa/handover.py promote _qa/handover/<ngày-giờ>
#       sau khi người dùng chốt: lần chạy đó thành last-green, current làm lại từ đó, ledger chuyển vào thư mục chạy.
#   python _qa/handover.py thumbs [--all | --missing]
#       chụp ảnh lối vào, mỗi theme một ảnh: <img data-shot> trên site/index.html (sketch-to-site references/trang-loi-vao.md mục 4)
#       và "thumbs" trong qa.config.json (dự án cũ). Chỉ chụp ảnh thiếu, hay cũ hơn trang nguồn, file trang nạp, khai báo; --all chụp
#       lại hết; --missing chỉ chụp ảnh thiếu. qa-check.py tự gọi lệnh này TRƯỚC run, quick.py gọi --missing (bề mặt mới của evolve-site).
#       Thoát 4 khi không có trình duyệt, 1 khi có ảnh không chụp được.
#   python _qa/handover.py ledger
#       in gọn nhật ký từ lần bàn giao trước (mỗi lần sửa một dòng), trang sửa trực tiếp và trang chỉ đổi qua file dùng chung,
#       ảnh lối vào có trang đã đụng, trang tổng quan app, file đổi sau lần kiểm nhanh cuối mà chưa vào nhật ký. Không chạy trình duyệt.
#   python _qa/handover.py usage <lớp> [<lớp> …]
#       số chỗ dùng từng lớp ở mỗi trang (B6: số chỗ gọi component trong DESIGN.md): đếm lớp trong thuộc tính class,
#       cả khuôn HTML trong <script>; bỏ <style> và chú thích, nên luật CSS cùng tên không bị đếm.
import argparse, datetime, json, math, os, re, shutil, subprocess, sys, tempfile, threading, time
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import qalib as Q


def read_ledger():
    p = os.path.join(Q.CUR, 'ledger.jsonl')
    if not os.path.exists(p):
        return []
    return [json.loads(l) for l in open(p, encoding='utf-8') if l.strip()]


RUN_DIR = re.compile(r'^\d{8}-\d{4}$')
KEEP_RUNS = 2            # lần chạy hoàn chỉnh gần nhất còn giữ ảnh; lần cũ hơn chỉ giữ report, manifest, handover.json, ledger
TMP_PREFIX = 'qa-run-'   # thư mục tạm của một lần chạy (ghi ở ngoài workspace để VS Code không quét từng ảnh)
IMG_EXT = ('.jpg', '.png')
PER_RUN_SEC = 36.0       # giây cho một lượt bộ ở một luồng khi chưa có số đo (dự án 63 trang, 10/10/2026: 598 lượt, 90 phút, 4 luồng)
LONG_MIN = 8             # từ đây trở lên: chạy nền


def prune_runs():
    # Đo 10/10/2026: tám lần chạy cũ không ai dọn là 17 nghìn file, 664 MB, thứ làm rg của VS Code quét chậm. Thư mục chạy là lịch sử
    # (promote chuyển ledger.jsonl vào đó) nên chỉ bỏ ảnh, giữ report; lần chạy dở (không có handover.json) thì xoá hẳn
    root = os.path.join(Q.HERE, 'handover')
    if not os.path.isdir(root):
        return
    dirs = sorted((d for d in os.listdir(root) if RUN_DIR.match(d) and os.path.isdir(os.path.join(root, d))), reverse=True)
    complete, gone = [], 0
    for d in dirs:
        p = os.path.join(root, d)
        if os.path.exists(os.path.join(p, 'handover.json')):
            complete.append(p)
        else:
            shutil.rmtree(p, ignore_errors=True); gone += 1
    stripped, size = 0, 0
    for p in complete[KEEP_RUNS:]:
        n = 0
        for base, _, files in os.walk(p):
            for f in files:
                if f.endswith(IMG_EXT) or f == 'slices.json':
                    fp = os.path.join(base, f)
                    try:
                        size += os.path.getsize(fp); os.remove(fp); n += 1
                    except OSError:
                        pass
        stripped += bool(n)
    if stripped or gone:
        print('Dọn: ' + ' · '.join(([f'{stripped} lần chạy cũ bỏ ảnh, {size // 2**20} MB'] if stripped else []) + ([f'{gone} lần chạy dở xoá'] if gone else [])))


def tmp_root():
    return os.environ.get('QA_TMP') or tempfile.gettempdir()


def leftover_tmp():
    # Thư mục qa-run-* còn trong thư mục tạm: lần chạy bị giết giữa chừng (có manifest.json là của bộ kiểm)
    try:
        return [os.path.join(tmp_root(), n) for n in os.listdir(tmp_root()) if n.startswith(TMP_PREFIX)
                and os.path.exists(os.path.join(tmp_root(), n, 'manifest.json'))]
    except OSError:
        return []


def clean_tmp():
    # Xoá lần chạy dở trong thư mục tạm khi không có gì ghi vào quá 2 giờ (mtime của riêng thư mục gốc không thấy ghi trong thư mục con;
    # lần chạy khác đang chạy vẫn ghi nên còn)
    for p in leftover_tmp():
        try:
            newest = max(os.path.getmtime(os.path.join(b, f)) for b, _, fs in os.walk(p) for f in fs)
        except ValueError:
            newest = os.path.getmtime(p)
        if time.time() - newest > 2 * 3600:
            shutil.rmtree(p, ignore_errors=True)


def last_timing():
    # Số đo của lần chạy gần nhất có chạy thật (handover.json "timing": giây quanh run_suites, số lượt, số luồng), và thư mục của nó
    root = os.path.join(Q.HERE, 'handover')
    if not os.path.isdir(root):
        return None, None
    for d in sorted((d for d in os.listdir(root) if RUN_DIR.match(d)), reverse=True):
        hj = Q.load_json(os.path.join(root, d, 'handover.json')) or {}
        t = hj.get('timing') or {}
        if t.get('runs'):
            return t, os.path.join(root, d)
    return None, None


def estimate(to_run):
    # (phút, ảnh): thời gian theo số đo của lần trước, không có thì PER_RUN_SEC; ảnh đếm ở lần chạy trước, bộ chưa có thì đếm bước "shot"
    t, d = last_timing()
    per = t['seconds'] * t.get('workers', Q.run_all.WORKERS) / t['runs'] if t else PER_RUN_SEC
    minutes = len(to_run) * per / Q.run_all.WORKERS / 60
    shots = 0
    key_of = {s[0]: s[2] for s in Q.run_all.SUITES}
    for th, name in to_run:
        p = os.path.join(d, th, name) if d else ''
        n = sum(1 for f in os.listdir(p) if f.endswith(IMG_EXT)) if p and os.path.isdir(p) else 0
        if not n:
            st = Q.load_json(os.path.join(Q.HERE, f'steps-{key_of.get(name)}.json')) or {}
            n = sum(1 for x in st.get('steps') or [] if x.get('shot'))
        shots += n
    return minutes, shots


def count_rg():
    if sys.platform != 'win32':
        return 0
    try:
        r = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq rg.exe', '/NH'], capture_output=True, text=True, timeout=15)
        return sum(1 for l in r.stdout.splitlines() if l.lower().startswith('rg.exe'))
    except Exception:
        return 0


def count_profiles():
    try:
        return sum(1 for n in os.listdir(tempfile.gettempdir()) if re.match(r'^cdp-(dl-)?[A-Za-z0-9]{6}$', n))
    except OSError:
        return 0


# Watchdog rg (QA_RG_WATCHDOG=1, chỉ Windows): mỗi 15 giây dừng rg.exe con của Code.exe sống quá 20 giây. Chỉ rg: giết cả conhost mồ côi
# từng kéo node của bộ kiểm chết theo (599 bộ rỗng trong 4 phút, 10/10/2026). Lưới an toàn; cách chữa là ghi ảnh ra thư mục tạm và
# loại thư mục ảnh khỏi watcher (qa_init.py)
# QA_RG_WATCHDOG=dry: chỉ đếm, không dừng (xem watchdog sẽ dừng gì; bộ test dùng)
RG_PS = ("$all = Get-CimInstance Win32_Process; $code = @($all | Where-Object Name -eq 'Code.exe' | ForEach-Object ProcessId); "
         "$n = 0; foreach ($p in $all) { if ($p.Name -eq 'rg.exe' -and $code -contains $p.ParentProcessId -and $p.CreationDate "
         "-and ((Get-Date) - $p.CreationDate).TotalSeconds -gt 20) { if (%s) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }; $n++ } }; $n")


def rg_watchdog(stop, killed):
    while not stop.is_set():
        try:
            r = subprocess.run(['powershell', '-NoProfile', '-NonInteractive', '-Command', RG_PS % ('$false' if os.environ.get('QA_RG_WATCHDOG') == 'dry' else '$true')], capture_output=True, text=True, timeout=30)
            killed[0] += int((r.stdout or '0').strip().splitlines()[-1] or 0)
        except Exception:
            pass
        stop.wait(15)


def cmd_run(a):
    themes = [t for t in (a.themes or ','.join(Q.THEMES)).split(',') if t]
    if not a.dry:
        prune_runs(); clean_tmp()
    start = Q.manifest()
    green = Q.load_json(os.path.join(Q.GREEN, 'manifest.json'))
    # Chạy tăng dần: có last-green thì chỉ chạy bộ của trang nạp file đã đổi (affected_suites, như quick.py), bộ có file bước đổi,
    # bộ mốc chưa có, và bộ sâu mà report của mốc chưa có lượt sâu; đổi cấu hình hay mã bộ kiểm thì mọi bộ. Còn lại lấy lại report của mốc.
    # Đo 10/10/2026: bốn lần 90 phút trong một ngày dù mỗi đợt sửa vài file
    pairs = Q.suite_pairs(Q.SUITE_NAMES, themes)
    all_pairs = {(th, s[0]) for th, s in pairs}
    if green is None or a.full:
        to_run = set(all_pairs)
    else:
        changed = Q.changed_files(green, start)
        try:
            names = set(Q.affected_suites(changed))
        except FileNotFoundError as e:
            print(f'CẢNH BÁO: không đọc được {e.filename}: trang trong qa.config.json đã mất? Chạy mọi bộ.')
            names = set(Q.SUITE_NAMES)
        to_run = set()
        for th, name in all_pairs:
            rep = Q.load_json(os.path.join(Q.GREEN, th, name, 'report.json'))
            if name in names or rep is None or (name in Q.DEEP_SUITES and not any(x.get('step') == 'deep' for x in rep)):
                to_run.add((th, name))
    reused_pairs = sorted(all_pairs - to_run)
    minutes, shots = estimate(to_run)
    print(f'Ước lượng: {len(to_run)} bộ chạy · {len(reused_pairs)} lấy lại từ last-green · ~{max(1, round(minutes))} phút với {Q.run_all.WORKERS} luồng · ~{shots} ảnh'
          + (f' · quá {LONG_MIN} phút: chạy nền ngay từ đầu, log ra file, chờ báo xong' if minutes >= LONG_MIN else ''))
    if a.dry:
        # Checklist trước lệnh dài: thứ lần chạy trước để lại làm lần này đứt (đo 10/10/2026: 718 rg, 28 trình duyệt sót, thư mục dở)
        rg, prof, left = count_rg(), count_profiles(), leftover_tmp()
        print('Checklist trước khi chạy:')
        if sys.platform == 'win32':
            print(f'  rg.exe đang chạy: {rg}' + (' (VS Code quét file; nhiều và không giảm sau vài giây thì taskkill /IM rg.exe /F, cân nhắc QA_RG_WATCHDOG=1)' if rg > 24 else ''))
        print(f'  hồ sơ trình duyệt sót (cdp-* trong thư mục tạm): {prof}' + (' (lần mở trình duyệt sau tự dọn hồ sơ quá 2 giờ)' if prof else ''))
        print(f'  lần chạy dở trong thư mục tạm: {len(left)}' + (' (tự xoá khi quá 2 giờ không ghi)' if left else ''))
        print(f'  từ {LONG_MIN} phút: chạy nền ngay từ đầu, kết quả ra file log, chờ báo xong rồi đọc file; không gọi thường rồi đợi hết giờ')
        print('  qa_init.py vừa báo đã thêm mẫu vào .vscode/settings.json: mở lại cửa sổ VS Code trước khi chạy')
        return
    ts = datetime.datetime.now().strftime('%Y%m%d-%H%M')
    final = os.path.join(Q.HERE, 'handover', ts)
    # Ghi ra thư mục tạm của máy, chuyển vào _qa/handover/ khi xong: mỗi file ghi vào workspace là một cụm rg của VS Code (đo 10/10/2026:
    # 25 459 rg trong một lần chạy 3 100 ảnh); lần chạy bị giết không để lại thư mục dở trong workspace
    out = tempfile.mkdtemp(prefix=TMP_PREFIX, dir=os.environ.get('QA_TMP') or None)
    Q.save_json(os.path.join(out, 'manifest.json'), start)
    pf_ok, pf_line = Q.preflight()
    stop, killed = threading.Event(), [0]
    dog = sys.platform == 'win32' and os.environ.get('QA_RG_WATCHDOG') in ('1', 'dry')
    dog_thread = threading.Thread(target=rg_watchdog, args=(stop, killed), daemon=True) if dog else None
    if dog_thread:
        dog_thread.start()
    t0 = time.time()
    res = Q.run_suites(Q.SUITE_NAMES, out, themes, shots=True, deep=True, only=to_run)
    timing = {'seconds': round(time.time() - t0, 1), 'runs': len(to_run), 'workers': Q.run_all.WORKERS}
    stop.set()
    if dog_thread:
        dog_thread.join(40)  # đợi lệnh PowerShell cuối xong: tiến trình con còn giữ thư mục làm việc thì bên gọi không xoá được
    for th, name in reused_pairs:
        r = Q.reuse_report(th, name, out)
        if r is not None:
            res[(th, name)] = r
    if Q.manifest() != start:
        print('CẢNH BÁO: file của site hoặc bộ kiểm đổi trong lúc chạy. Chạy lại.')
    os.makedirs(os.path.dirname(final), exist_ok=True)
    shutil.rmtree(final, ignore_errors=True)
    shutil.move(out, final)
    out = final

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
    per_theme = {th: {'suites': 0, 'steps': 0, 'errors': 0, 'fails': 0, 'silent': 0, 'over': 0, 'cut': 0, 'contrast': 0, 'intent': 0, 'codes': 0, 'deep': 0, 'changed': 0} for th in themes}
    lay_reports = []
    new_suites, lost_suites, debt, debt_rows = [], [], [], []
    oom = 0
    for (th, name), r in sorted(res.items()):
        t = per_theme[th]
        if 'crash' in r:
            if r['crash'] == Q.run_all.OOM_MSG:
                oom += 1
            else:
                bad.append(f'LỖI CHẠY {th}/{name}: {r["crash"][:200]}')
            continue
        rep = Q.load_json(os.path.join(out, th, name, 'report.json'))
        base = Q.load_json(os.path.join(Q.GREEN, th, name, 'report.json'))
        lay_reports.append((f'{th}/{name}', rep))
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
        for key, lab in (('contrast', 'tương phản'), ('intent', 'ý định'), ('codes', 'mã lộ'), ('states', 'trạng thái'), ('keyboard', 'bàn phím'), ('interactive', 'tương tác'), ('shortcuts', 'lối tắt'),
                         (Q.qadiff.DEEP_ERRORS, 'console lượt sâu')):
            new = d[key + '_new']
            t[key if key in ('contrast', 'intent', 'codes') else 'deep'] += len(new)
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
                if (th, name) not in res and th in Q.suite_themes(name):
                    lost_suites.append(f'{th}/{name}')

    if oom:
        bad.append(f'{Q.run_all.OOM_MSG}, {oom} bộ chưa chạy: đóng bớt chương trình hay đặt QA_WORKERS nhỏ hơn rồi chạy lại')
    if killed[0] or dog:
        print(f'Watchdog rg: {killed[0]} ' + ('sẽ dừng (dry)' if os.environ.get('QA_RG_WATCHDOG') == 'dry' else 'đã dừng'))
    print(f'Thư mục chạy: {os.path.relpath(out, Q.ROOT)}')
    print(f'preflight: {pf_line}' + (f'  ({Q.shown(Q.PREFLIGHT)})' if Q.PREFLIGHT else ''))
    if green is not None:
        print(f'Lấy lại từ last-green (không đổi): {len(reused_pairs)} bộ' + (' · bộ lấy lại không có ảnh mới' if reused_pairs else '') + (' (--full)' if a.full else ''))
    # Nợ cũ của từng theme đếm theo mục đã gộp, như dòng Nợ cũ bên dưới: QA.md cần cột này cho từng theme
    for th, t in per_theme.items():
        nd = Q.debt_count(Q.group_debt([x for x in debt_rows if x[0] == th]))
        print(f'{th}: {t["suites"]} bộ · {t["steps"]} bước · console {t["errors"]} · FAIL {t["fails"]} · im lặng {t["silent"]} · '
              f'tràn mới {t["over"]} · cắt mới {t["cut"]} · tương phản mới {t["contrast"]} · ý định mới {t["intent"]} · mã lộ mới {t["codes"]} · sâu mới {t["deep"]} · check đổi so với last-green {t["changed"]} · nợ cũ {nd}')
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
        # Bộ mới, bộ mất, nợ cũ in cả khi trống: thiếu dòng thì người đọc phải mở handover.json để chắc là 0
        print('\nBộ mới (chưa có trong last-green):', ', '.join(new_suites) if new_suites else 'không')
        print('Bộ có trong last-green mà lần này không chạy:', ', '.join(lost_suites) if lost_suites else 'không')
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
    else:
        print('\nNợ cũ (0): không có')
    print(f'\nLỗi ({len(bad)}):')
    for line in bad:
        print('  ' + line)
    if any(t['cut'] for t in per_theme.values()):
        print('Chữ tràn hoặc bị cắt trong khung: xem ảnh của bước đó. Cố ý (tràn lề, marquee, slide ló) thì gắn data-clip-ok="<lý do>" vào khung. Không cố ý thì sửa ở gốc, đừng làm im.')
    # Bố cục trên trang đã render (chỉ số 3, 4, 8 của sketch-to-map): cảnh báo, không chặn promote; in cả khi trống như nợ cũ
    lay = Q.layout_warnings(lay_reports)
    print(f'\nBố cục ({len(lay)}, cảnh báo, không chặn)' + (': một nút chính mỗi màn, nhóm menu tối đa 7 mục, tối đa 5 tab, viền mảnh' if lay else ': không có'))
    for line, where in lay[:15]:
        print(f'  {line} · {where}')
    if len(lay) > 15:
        print(f'  … còn {len(lay) - 15} dòng: đủ ở handover.json')
    Q.save_json(os.path.join(out, 'handover.json'), {'preflight': [pf_ok, pf_line], 'themes': per_theme, 'bad': bad,
                                                      'unattributed': unattributed, 'debt': debt, 'new_suites': new_suites, 'lost_suites': lost_suites,
                                                      'deep_suites': deep_ran, 'layout': [{'line': l, 'where': w} for l, w in lay],
                                                      'reused': [f'{th}/{n}' for th, n in reused_pairs], 'timing': timing, 'rg_killed': killed[0]})
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


SHOT_NAME = re.compile(r'^[a-z0-9-]+$')
ENTRY_KB = 20  # ngân sách trang lối vào (trang-loi-vao.md mục 3): vượt thì nhắc, không chặn
THUMBS = os.path.join(Q.HERE, '.thumbs')  # file bước sinh từ data-shot (giữ lại: ngày sửa của nó cho biết khai báo đổi), out/ là ảnh tạm


class _ShotTags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.found = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img' and 'data-shot' in a:
            self.found.append(a)
    handle_startendtag = handle_starttag


def shots_dir():
    return (Q.CFG.get('thumbs') or {}).get('dir', 'assets/shots')


def config_shots(warn):
    # Dự án cũ: "thumbs": {"dir": "assets/shots", "items": [[trang, khoá file bước, khổ], ...]}; bước cuối của file bước có "shot"
    out = []
    for page, steps, size in (Q.CFG.get('thumbs') or {}).get('items', []):
        sf = os.path.join(Q.HERE, 'steps-' + steps + '.json')
        if not os.path.exists(sf) or not os.path.exists(os.path.join(Q.SITE, page + '.html')):
            warn(f'{steps}: không có _qa/steps-{steps}.json hay {Q.SITE_REL}{page}.html, bỏ qua'); continue
        shot = json.load(open(sf, encoding='utf-8'))['steps'][-1].get('shot')
        if not shot:
            warn(f'{steps}: bước cuối của _qa/steps-{steps}.json không có "shot", bỏ qua'); continue
        out.append({'shot': shot, 'page': page, 'sf': sf, 'size': size})
    return out


def entry_shots(warn, write=True):
    # Trang lối vào: <img src="assets/shots/<tên>.jpg" data-shot="<tên>" data-shot-page="<trang>[?tham số]" data-shot-size="desktop|mobile">.
    # run.mjs không nhận "trang.html?x" làm tên file: tham số đi qua khoá query của file bước. Khổ ghi cả vào file bước để đổi khổ là đổi file
    f = os.path.join(Q.SITE, 'index.html')
    if not os.path.exists(f):
        return []
    p = _ShotTags()
    p.feed(open(f, encoding='utf-8', errors='ignore').read())
    out, seen = [], set()
    for a in p.found:
        name, target, size = (a.get('data-shot') or '').strip(), (a.get('data-shot-page') or '').strip(), (a.get('data-shot-size') or 'desktop').strip()
        if not SHOT_NAME.match(name):
            warn(f'"{name}": tên chỉ gồm a-z, 0-9 và dấu gạch ngang, bỏ qua'); continue
        if name in seen:
            warn(f'{name}: trùng tên với một ảnh trước, bỏ qua'); continue
        if not target:
            warn(f'{name}: thiếu data-shot-page, bỏ qua'); continue
        rel, _, q = target.partition('?')
        rel = os.path.normpath(rel).replace('\\', '/')
        if not rel.endswith('.html') or not os.path.exists(os.path.join(Q.SITE, rel)):
            warn(f'{name}: không có {Q.SITE_REL}{rel}, bỏ qua'); continue
        if size not in Q.run_all.SIZES:
            warn(f'{name}: khổ "{size}" không có trong "sizes" của qa.config.json ({", ".join(Q.run_all.SIZES)}), bỏ qua'); continue
        want = f'{shots_dir()}/{name}.jpg'
        if (a.get('src') or '') != want:
            warn(f'{name}: src là {a.get("src") or "(trống)"}, ảnh ghi vào {want}')
        seen.add(name)
        sf = os.path.join(THUMBS, f'steps-{name}.json')
        if write:
            body = {**({'query': '?' + q} if q else {}), 'size': size, 'steps': [{'name': 'xem-truoc', 'wait': 800, 'shot': name, 'jpeg': True}]}
            text = json.dumps(body, ensure_ascii=False)
            if not os.path.exists(sf) or open(sf, encoding='utf-8').read() != text:
                os.makedirs(THUMBS, exist_ok=True)
                open(sf, 'w', encoding='utf-8').write(text)
        out.append({'shot': name, 'page': rel[:-len('.html')], 'sf': sf, 'size': size})
    return out


def stale(dst, it):
    # Ảnh cũ khi trang nguồn, file trang nạp (CSS, JS, data.js…) hay file bước mới hơn ảnh
    if not os.path.exists(dst):
        return True
    t = os.path.getmtime(dst)
    deps = [os.path.join(Q.SITE, d[len(Q.SITE_REL):]) for d in Q.page_deps(it['page'])] + [it['sf']]
    return any(os.path.exists(p) and os.path.getmtime(p) > t for p in deps)


def shoot(job):
    it, th, q, dst = job
    od = os.path.join(THUMBS, 'out', th, it['shot'])
    env = dict(os.environ, QA_QUERY=q, QA_NOSHOT='')
    r = subprocess.run(Q.run_all.NODE + [os.path.join(Q.HERE, 'run.mjs'), os.path.join(Q.SITE, it['page'] + '.html'), it['sf'], od] + list(Q.run_all.SIZES[it['size']]),
                       capture_output=True, text=True, encoding='utf-8', env=env)
    if r.returncode == 4:
        return None, next((l for l in r.stderr.splitlines() if 'Không tìm thấy Edge' in l), 'Không tìm thấy Edge, Chrome hay Chromium.'), True
    try:
        errs = sum(len(x['errors']) for x in json.loads(r.stdout))
    except Exception:
        return None, f'{it["shot"]} ({th}): run.mjs lỗi: {((r.stderr or r.stdout).strip().splitlines() or ["không có kết quả"])[-1][:200]}', False
    src = os.path.join(od, it['shot'] + '.jpg')
    if not os.path.exists(src):
        return None, f'{it["shot"]} ({th}): không có ảnh {it["shot"]}.jpg (bước cuối của file bước cần "shot" và "jpeg": true)', False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(src, dst)
    return errs, None, False


def cmd_thumbs(a):
    warns = []
    items = config_shots(warns.append) + entry_shots(warns.append)
    for w in warns:
        print('CẢNH BÁO ảnh lối vào ' + w)
    if not items:
        print('Ảnh lối vào: không khai báo (data-shot trên site/index.html hay "thumbs" trong qa.config.json). Không có gì để chụp.'); return
    jobs, fresh = [], 0
    for it in items:
        for th, q in Q.THEMES.items():
            dst = os.path.join(Q.SITE, shots_dir(), it['shot'] + ('' if th == Q.DEFAULT_THEME else '-' + th) + '.jpg')
            if a.all or (not os.path.exists(dst) if a.missing else stale(dst, it)):
                jobs.append((it, th, q, dst))
            else:
                fresh += 1
    shutil.rmtree(os.path.join(THUMBS, 'out'), ignore_errors=True)
    with Q.shared_browser(), ThreadPoolExecutor(Q.run_all.WORKERS) as ex:
        res = list(ex.map(shoot, jobs))
    shutil.rmtree(os.path.join(THUMBS, 'out'), ignore_errors=True)
    nob = next((err for _, err, no in res if no), None)
    if nob:
        print(nob); sys.exit(4)
    done = [(job, e) for job, (e, err, _) in zip(jobs, res) if err is None]
    bad = [err for _, err, _ in res if err]
    for (it, th, q, dst), e in done:
        print(f'  {os.path.relpath(dst, Q.ROOT).replace(os.sep, "/")} · console {e}')
    for err in bad:
        print('LỖI ảnh lối vào ' + err)
    line = f'Ảnh lối vào: {len(done)} mới chụp · {fresh} còn mới · console {sum(e for _, e in done)}'
    idx = os.path.join(Q.SITE, 'index.html')
    if os.path.exists(idx):
        kb = math.ceil(os.path.getsize(idx) / 1024)
        line += f' · trang lối vào {kb} KB' + (f' (quá {ENTRY_KB} KB: gọn lại)' if kb > ENTRY_KB else '')
    print(line)
    sys.exit(1 if bad else 0)


def cmd_ledger(a):
    # B1 của handover-check: các lần sửa từ lần bàn giao trước, mỗi lần một dòng (ledger.jsonl giữ cả giá trị check, có thể rất dài),
    # trang đã đụng, ảnh lối vào có trang đã đụng, file đổi sau lần kiểm nhanh cuối mà chưa vào nhật ký. Không chạy trình duyệt.
    led = read_ledger()
    page_of = {s[0]: s[1] for s in Q.run_all.SUITES}
    print(f'Nhật ký từ lần bàn giao trước (_qa/current/ledger.jsonl): {len(led)} lần sửa')
    direct, shared = [], []
    for i, e in enumerate(led, 1):
        files = e.get('files') or []
        print(f'  {i}. {e.get("time", "")} · {e.get("note") or "(không ghi chú)"} · file: {", ".join(files) or "không"} · check đổi {len(e.get("changed") or [])}'
              + (f' · bước mới {len(e["new"])}' if e.get('new') else '') + (f' · bước mất {len(e["lost"])}' if e.get('lost') else ''))
        for f in files:
            p = f[len(Q.SITE_REL):-len('.html')] if f.startswith(Q.SITE_REL) and f.endswith('.html') else None
            if p in Q.PAGES and p not in direct:
                direct.append(p)
        for n in e.get('suites') or []:
            p = page_of.get(n)
            if p and p not in shared:
                shared.append(p)
    shared = [p for p in shared if p not in direct]
    print('Trang sửa trực tiếp:', ', '.join(direct) if direct else 'không')
    print('Trang chỉ đổi qua file dùng chung:', ', '.join(shared) if shared else 'không')
    quiet = lambda s: None
    thumbs = list(dict.fromkeys(it['page'] for it in config_shots(quiet) + entry_shots(quiet, write=False)))
    if thumbs:
        hit = [p for p in thumbs if p in direct + shared]
        print('Ảnh lối vào có trang đã đụng:', ', '.join(hit) + ' (qa-check tự chụp lại)' if hit else 'không')
    else:
        # In cả khi không khai báo: không có dòng này thì handover-check mở qa.config.json chỉ để biết B2 không có gì để xem
        print('Ảnh lối vào: không khai báo (data-shot trên site/index.html hay "thumbs" trong qa.config.json), B2 không có ảnh lối vào để xem lại')
    # Trang tổng quan của prototype có app (sketch-to-site dựng ở site/app/index.html). In cả khi không có:
    # đo lại sau 54b403a, handover tốn một lượt find cả dự án chỉ để biết điều này
    ov = Q.SITE_REL + 'app/index.html'
    if os.path.exists(os.path.join(Q.SITE, 'app', 'index.html')):
        print(f'Trang tổng quan app: {ov} (tính năng thêm hay bỏ thì cập nhật ở B2)')
    else:
        print(f'Trang tổng quan app: không có ({ov}), B2 không có trang tổng quan để cập nhật')
    cur = Q.load_json(os.path.join(Q.CUR, 'manifest.json'))
    if cur is None:
        print('Chưa có mốc _qa/current/: dự án chưa promote lần nào.')
    else:
        out = Q.changed_files(cur, Q.manifest())
        print('File đổi sau lần kiểm nhanh cuối, chưa vào nhật ký:', ', '.join(out) if out else 'không')


def cmd_usage(a):
    # B6 của handover-check: số chỗ gọi component. grep -o tên lớp khớp cả luật CSS trong <style> (đo lại sau 54b403a:
    # _system.html ra 3 .field-err thay vì 2). Ở đây chỉ đếm lớp trong thuộc tính class, kể cả khuôn HTML viết trong <script>
    names = [n.lstrip('.') for n in a.cls if n.lstrip('.')]
    if not names:
        print('Cách gọi: python _qa/handover.py usage <lớp> [<lớp> …]'); sys.exit(2)
    print('Chỗ dùng (lớp trong thuộc tính class, cả khuôn trong <script>; bỏ <style> và chú thích):')
    for p in Q.PAGES:
        f = os.path.join(Q.SITE, p + '.html')
        if not os.path.exists(f):
            print(f'  {p}: không thấy {Q.SITE_REL}{p}.html'); continue
        html = open(f, encoding='utf-8', errors='ignore').read()
        html = re.sub(r'<style\b.*?</style>|<!--.*?-->', '', html, flags=re.S | re.I)
        tokens = [t for m in re.finditer(r'(?<![\w-])class\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', html) for t in (m.group(1) or m.group(2) or '').split()]
        print(f'  {p}: ' + ' · '.join(f'.{n} {tokens.count(n)}' for n in names))


ap = argparse.ArgumentParser()
sub = ap.add_subparsers(dest='cmd', required=True)
p = sub.add_parser('run'); p.add_argument('--themes', default=''); p.add_argument('--full', action='store_true'); p.add_argument('--dry', action='store_true'); p.set_defaults(f=cmd_run)
p = sub.add_parser('ledger'); p.set_defaults(f=cmd_ledger)
p = sub.add_parser('usage'); p.add_argument('cls', nargs='*'); p.set_defaults(f=cmd_usage)
p = sub.add_parser('promote'); p.add_argument('dir'); p.set_defaults(f=cmd_promote)
p = sub.add_parser('thumbs'); p.add_argument('--all', action='store_true'); p.add_argument('--missing', action='store_true'); p.set_defaults(f=cmd_thumbs)
a = ap.parse_args()
a.f(a)
