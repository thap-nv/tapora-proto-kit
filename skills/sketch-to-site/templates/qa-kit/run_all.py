# Chạy các bộ kiểm khai báo trong _qa/qa.config.json, mỗi bộ ra một thư mục <out>/<bộ>/ có report.json và ảnh.
# Chạy từ thư mục prototype (thư mục chứa _qa/):  python _qa/run_all.py <thư-mục-ra> [lọc]
#   ví dụ: python _qa/run_all.py _qa/.recheck             (mọi bộ)
#          python _qa/run_all.py _qa/.recheck cash        (chỉ các bộ có chữ "cash" trong tên)
# In một dòng tóm tắt mỗi bộ: số bước, lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung, tương phản dưới ngưỡng, màu sai ý định, bước FAIL, bước có check mà không trả giá trị.
# Rồi in thư mục ảnh (đường dẫn tuyệt đối) và tên từng ảnh của các bộ vừa chạy, theo thứ tự màn: ghép thư mục với tên là mở được.
# Lát của trang dài kèm tiêu đề h1–h3 bắt đầu trong lát, trong ngoặc sau tên ảnh (slices.json của run.mjs).
# Bộ kiểm: [tên, trang, khoá file bước, khổ] trong "suites"; file bước là _qa/steps-<khoá>.json; khổ lấy từ "sizes".
# Bước trả chuỗi bắt đầu bằng "FAIL" là lỗi. Bộ có tên bắt đầu bằng "scan" thì mọi chuỗi khác rỗng là lỗi (bộ quét chữ).
# File bước:  {"query": "?id=XT07", "steps": [ {bước}, ... ]}   ("query" không bắt buộc, nối vào URL của trang)
#   "name"   tên bước, không trùng trong file
#   "js"     biểu thức chạy trên trang, ví dụ "document.querySelector('[data-filter]')?.click()"; "location.reload()" để thử F5
#   "wait"   số ms đợi sau "js" (mặc định 450); bước làm chuyển trang thì bộ chạy tự đợi trang mới tải xong
#   "check"  biểu thức trả 'PASS' khi đúng, chuỗi bắt đầu bằng "FAIL:" khi sai, ví dụ
#            "document.querySelectorAll('#lots li').length === 2 ? 'PASS' : 'FAIL: cần 2 lô'"; không trả gì là bước im lặng
#   "shot"   tên ảnh chụp sau bước; "jpeg": true để chụp jpg; "clip": "<css selector>" chỉ chụp khung đó, "scale" phóng ảnh clip
# Mỗi bộ chạy trong một ngữ cảnh trình duyệt mới: localStorage trống lúc bắt đầu bộ. File tải xuống (nút xuất) nằm trong thư mục tạm của bộ
# và bị xoá khi bộ chạy xong, không rơi vào thư mục Downloads của máy; bước kiểm tính năng xuất bằng giao diện (toast, trạng thái).
# Cả lệnh dùng chung một trình duyệt (browser.mjs, biến QA_CDP), không mở mỗi bộ một trình duyệt. QA_WORKERS=n (hay "workers" trong qa.config.json):
# số bộ chạy song song. RAM trống dưới ngưỡng (QA_MIN_FREE_MB) thì tạm nghỉ, quá QA_MEM_WAIT giây thì các bộ còn lại báo "máy thiếu bộ nhớ".
import contextlib, hashlib, json, os, re, subprocess, sys, threading, time
from concurrent.futures import ThreadPoolExecutor
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, 'qa.config.json'), encoding='utf-8'))
SITE = os.path.normpath(os.path.join(HERE, '..', CFG.get('site', 'site')))
SIZES = {k: tuple(str(x) for x in v) for k, v in CFG.get('sizes', {'desktop': [1440, 900, 0], 'tablet': [768, 1024, 0], 'mobile': [390, 844, 1]}).items()}
SUITES = [(s[0], s[1], s[2], SIZES[s[3]]) for s in CFG['suites']]
# Bộ tự đổi theme (tên bắt đầu bằng tiền tố này) không chạy lại khi đã ép theme bằng QA_QUERY
THEME_PREFIX = CFG.get('theme_switch_prefix', 'theme-')


# Hạ ưu tiên tiến trình điều phối (handover.py, quick.py, run_all.py, breaktest.py đều import file này): con (node, trình duyệt) kế thừa.
# Đo 10/10/2026: chỉ node và trình duyệt ở BelowNormal, Python chạy Normal nên phải hạ tay từ PowerShell. QA_PRIORITY=normal giữ mức thường (cùng khoá với launch.mjs)
def lower_priority():
    if os.environ.get('QA_PRIORITY') == 'normal':
        return
    try:
        if sys.platform == 'win32':
            import ctypes
            k = ctypes.windll.kernel32
            k.GetCurrentProcess.restype = ctypes.c_void_p  # handle giả -1 là 64 bit: để mặc định thì bị cắt còn 32 bit, gọi không ăn
            k.SetPriorityClass(ctypes.c_void_p(k.GetCurrentProcess()), 0x4000)  # BELOW_NORMAL_PRIORITY_CLASS
        elif os.nice(0) < 10:
            os.nice(10 - os.nice(0))
    except Exception:
        pass


lower_priority()


def _workers():
    # Số bộ chạy song song: QA_WORKERS, rồi "workers" trong qa.config.json, rồi 4 khi máy từ 8 lõi, không thì 2.
    # Không lấy lõi // 4: laptop 8 lõi còn 2 luồng, chậm gấp đôi mà vấn đề là RAM, không phải CPU; RAM thiếu thì wait_for_memory hãm
    for v in (os.environ.get('QA_WORKERS'), CFG.get('workers')):
        try:
            if v is not None and v != '' and int(v) >= 1:
                return int(v)
        except (TypeError, ValueError):
            pass
    return 4 if (os.cpu_count() or 4) >= 8 else 2


WORKERS = _workers()
OOM_MSG = 'máy thiếu bộ nhớ'
# Đặt khi máy thiếu RAM quá QA_MEM_WAIT giây: các bộ chưa chạy trả crash OOM_MSG thay vì hàng trăm bộ "lỗi chạy" rỗng (đo 10/10/2026: 582 bộ rỗng)
ABORT = threading.Event()
_mem_lock = threading.Lock()
_mem_said = [False]


def free_mem_mb():
    # (RAM trống, RAM tổng) tính bằng MB; None khi không đo được (macOS, hệ lạ). Không cần psutil
    try:
        if sys.platform == 'win32':
            import ctypes
            class S(ctypes.Structure):
                _fields_ = [('dwLength', ctypes.c_ulong), ('dwMemoryLoad', ctypes.c_ulong)] + [(n, ctypes.c_ulonglong) for n in
                            ('ullTotalPhys', 'ullAvailPhys', 'ullTotalPageFile', 'ullAvailPageFile', 'ullTotalVirtual', 'ullAvailVirtual', 'ullAvailExtendedVirtual')]
            s = S(); s.dwLength = ctypes.sizeof(S)
            if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(s)):
                return s.ullAvailPhys // 2**20, s.ullTotalPhys // 2**20
        elif os.path.exists('/proc/meminfo'):
            kv = {}
            for l in open('/proc/meminfo'):
                k, _, v = l.partition(':')
                kv[k.strip()] = int(v.split()[0])
            return kv['MemAvailable'] // 1024, kv['MemTotal'] // 1024
    except Exception:
        pass
    return None


def wait_for_memory():
    # Trước mỗi bộ: RAM trống dưới ngưỡng (QA_MIN_FREE_MB, mặc định min(4 GB, 15 % tổng)) thì tạm nghỉ, in một dòng; quá QA_MEM_WAIT giây
    # (mặc định 120) thì đặt ABORT. Trả False khi phải bỏ bộ này. Đo 10/10/2026: bộ kiểm chạy tiếp khi commit 52/52,7 GB, trình duyệt chết hàng loạt
    if ABORT.is_set():
        return False
    m = free_mem_mb()
    if m is None:
        return True
    free, total = m
    limit = int(os.environ.get('QA_MIN_FREE_MB') or min(4096, total * 15 // 100))
    if free >= limit:
        return True
    wait = float(os.environ.get('QA_MEM_WAIT') or 120)
    with _mem_lock:
        if not _mem_said[0]:
            _mem_said[0] = True
            print(f'Tạm nghỉ: RAM trống {free} MB dưới ngưỡng {limit} MB, đợi tối đa {wait:g} giây (đóng bớt chương trình, hoặc QA_WORKERS nhỏ hơn)', flush=True)
    t0 = time.time()
    while time.time() - t0 < wait:
        if ABORT.is_set():
            return False
        time.sleep(min(5, max(0.2, wait / 10)))
        m = free_mem_mb()
        if m and m[0] >= limit:
            return True
    ABORT.set()
    return False


def node_cmd():
    # Node 20 cần cờ --experimental-websocket; Node 22 trở lên có sẵn WebSocket
    try:
        major = int(subprocess.run(['node', '-p', 'process.versions.node.split(".")[0]'], capture_output=True, text=True).stdout.strip())
    except Exception:
        major = 20
    return ['node'] + (['--experimental-websocket'] if major < 22 else [])


NODE = node_cmd()


def _stop_browser(p):
    try:
        p.stdin.close()
    except Exception:
        pass
    try:
        p.wait(10)
    except Exception:
        p.kill()


@contextlib.contextmanager
def shared_browser():
    # Một trình duyệt chung cho cả lệnh (browser.mjs): mở một lần, mọi run.mjs con gắn vào qua QA_CDP, mỗi lần một ngữ cảnh riêng.
    # Mở mỗi bộ một trình duyệt thì khởi động cộng tạo/xoá hồ sơ chiếm hơn nửa CPU của một lần chạy (đo 09/10/2026).
    # Đã có QA_CDP (lệnh cha mở rồi) thì dùng lại. Không mở được (bộ kiểm cũ thiếu file, không có trình duyệt) thì chạy như cũ, run.mjs tự báo
    if os.environ.get('QA_CDP'):
        yield
        return
    bm = os.path.join(HERE, 'browser.mjs')
    p, url = None, ''
    if os.path.exists(bm):
        try:
            p = subprocess.Popen(NODE + [bm], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding='utf-8')
            box = []
            th = threading.Thread(target=lambda: box.append(p.stdout.readline()), daemon=True)
            th.start()
            th.join(20)
            url = (box[0] if box else '').strip()
        except Exception:
            url = ''
    if not url.startswith('http://'):
        if p:
            _stop_browser(p)
        yield
        return
    os.environ['QA_CDP'] = url
    try:
        yield
    finally:
        os.environ.pop('QA_CDP', None)
        _stop_browser(p)


# Lỗi vì trình duyệt chung không nối được hay tắt giữa chừng (chuỗi của run.mjs): chạy lại một lần; sau 3 lần liên tiếp thì thôi,
# trình duyệt chết hẳn không nên nhân đôi thời gian của lần chạy
BROWSER_ERR = ('Không nối được trình duyệt chung', 'Trình duyệt đóng giữa chừng')
_browser_fails = [0]


def _node(args, env):
    return subprocess.run(NODE + args, capture_output=True, text=True, encoding='utf-8', env=env)


def run(s, out, deep=False):
    name, page, steps, size = s
    sf = os.path.join(HERE, 'steps-' + steps + '.json')
    if not os.path.exists(sf):
        return name, None
    if not wait_for_memory():
        return name, {'crash': OOM_MSG}
    od = os.path.join(out, name)
    os.makedirs(od, exist_ok=True)
    # Không đặt CDP_PORT: run.mjs để hệ điều hành chọn cổng gỡ lỗi cho từng bộ, nên không bao giờ trùng cổng với bộ khác (CDP_PORT chỉ là ép tay, tuỳ chọn)
    env = dict(os.environ)
    # Lượt kiểm sâu (deep.mjs): handover.py bật, qalib.py chọn bộ (DEEP_SUITES: mỗi trang một bộ khổ desktop); ở đây chỉ nhận quyết định
    env['QA_DEEP'] = '1' if deep else ''
    args = [os.path.join(HERE, 'run.mjs'), os.path.join(SITE, page + '.html'), sf, od] + list(size)
    r = _node(args, env)
    rep = None
    try:
        rep = json.loads(r.stdout)
    except Exception:
        err = (r.stderr or r.stdout)
        if any(x in err for x in BROWSER_ERR) and _browser_fails[0] < 3 and not ABORT.is_set():
            _browser_fails[0] += 1
            r = _node(args, env)
            try:
                rep = json.loads(r.stdout)
            except Exception:
                pass
    if rep is None:
        return name, {'crash': (r.stderr or r.stdout)[:400]}
    _browser_fails[0] = 0
    json.dump(rep, open(os.path.join(od, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return name, summarize(name, rep, json.load(open(sf, encoding='utf-8'))['steps'])


def summarize(name, rep, steps_def):
    # Dòng tóm tắt của một bộ từ báo cáo: run() dùng sau khi chạy, qalib.reuse_report dùng cho báo cáo lấy lại từ mốc
    has_check = {x['name'] for x in steps_def if x.get('check')}
    # Lỗi console của lượt sâu tính vào "sâu" (handover.py so với mốc), không vào "console"
    errs = sum(len(x['errors']) for x in rep if x['step'] != 'deep')
    over = sum(1 for x in rep if x['dims'] and x['dims']['sw'] > x['dims']['cw'])
    cut = sum(len(x['dims'].get('cut') or []) for x in rep if x['dims'])
    fails = [x['step'] for x in rep if isinstance(x.get('check'), str) and x['check'].startswith('FAIL')]
    # Bộ quét chữ trả chuỗi rỗng khi đạt; chuỗi khác rỗng là lỗi chữ
    if name.startswith('scan'):
        fails += [x['step'] + ': ' + x['check'] for x in rep if isinstance(x.get('check'), str) and x['check']]
    silent = [x['step'] for x in rep if x['step'] in has_check and x.get('check') is None]
    contrast = sum(len(x['dims'].get('contrast') or []) for x in rep if x['dims'])
    intent = sum(len(x['dims'].get('intent') or []) for x in rep if x['dims'])
    ds = next((x for x in rep if x['step'] == 'deep'), None)
    dp = (ds or {}).get('deep') or {}
    deepn = sum(len(dp.get(k) or []) for k in ('states', 'keyboard', 'interactive', 'shortcuts')) + len((ds or {}).get('errors') or [])
    return {'steps': sum(1 for x in rep if x['step'] not in ('load', 'deep')), 'errors': errs, 'overflow': over, 'cut': cut,
            'contrast': contrast, 'intent': intent, 'deep': deepn, 'deep_ran': ds is not None, 'fails': fails, 'silent': silent}


def summary_line(name, r):
    # Một dòng mỗi bộ: run_all.py và breaktest.py in cùng dạng
    if 'crash' in r:
        return f'{name}: LỖI CHẠY {r["crash"]}'
    return (f'{name}: {r["steps"]} bước · console {r["errors"]} · tràn {r["overflow"]} · cắt {r["cut"]} · tương phản {r["contrast"]} · '
            f'ý định {r["intent"]}' + (f' · sâu {r["deep"]}' if r.get('deep') else '')
            + f' · FAIL {len(r["fails"])} {r["fails"] or ""} · im lặng {len(r["silent"])} {r["silent"] or ""}')


def shot_order(f):
    # Thứ tự màn: <shot>, <shot>-2, …; số trong tên xếp theo giá trị (index@gio_5_00 trước index@gio_11_00)
    nat = lambda x: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', x)]
    m = re.match(r'(.*?)(?:-(\d+))?\.(?:jpg|png)$', f)
    return (nat(m.group(1)), int(m.group(2) or 1)) if m else (nat(f), 0)


def shot_digests(root):
    # Dấu (sha1) của mọi ảnh dưới root, khoá là đường dẫn tương đối "theme/bộ/ảnh". Lấy trước khi chụp lại để biết ảnh nào đổi
    out = {}
    for base, _, files in os.walk(root):
        for f in files:
            if f.endswith(('.jpg', '.png')):
                p = os.path.join(base, f)
                out[os.path.relpath(p, root).replace(os.sep, '/')] = hashlib.sha1(open(p, 'rb').read()).hexdigest()
    return out


def shot_lines(root, dirs, before=None):
    # Ảnh của các bộ vừa chạy (dirs: thư mục con của root, ví dụ "smoke-index-390" hay "default/smoke-index-390").
    # In đường dẫn tuyệt đối của root và tên từng ảnh, để mở thẳng bằng công cụ đọc file, không cần ls. Lát của trang dài kèm tiêu đề
    # bắt đầu trong lát (slices.json của run.mjs), để chọn đúng lát cần xem.
    # before: dấu của lần chụp trước (shot_digests). Có thì thêm dòng ảnh nào đổi hay mới, để vòng sửa sau chỉ mở lại các ảnh đó
    rows, now = [], []
    for d in dirs:
        p = os.path.join(root, d)
        files = sorted((f for f in os.listdir(p) if f.endswith(('.jpg', '.png'))), key=shot_order) if os.path.isdir(p) else []
        if files:
            sp = os.path.join(p, 'slices.json')
            lab = json.load(open(sp, encoding='utf-8')) if os.path.exists(sp) else {}
            rows.append(f'  {d}: ' + ', '.join(f + (f' ({" · ".join(lab[f])})' if lab.get(f) else '') for f in files))
            now += [f'{d}/{f}' for f in files]
    if not rows:
        return []
    if before is not None:
        changed = [k for k in now if before.get(k) != hashlib.sha1(open(os.path.join(root, k), 'rb').read()).hexdigest()]
        rows.append('  chưa có ảnh của lần chụp trước để so: mở các ảnh cần xem' if not before
                    else '  không ảnh nào đổi so với lần chụp trước' if not changed
                    else '  mọi ảnh đều đổi so với lần chụp trước' if len(changed) == len(now)
                    else f'  đổi so với lần chụp trước (chỉ cần mở lại các ảnh này): {", ".join(changed)}')
    return ['Ảnh (mở cùng một lượt):', f'  thư mục: {os.path.abspath(root).replace(os.sep, "/")}/'] + rows


if __name__ == '__main__':
    out = sys.argv[1]
    flt = sys.argv[2] if len(sys.argv) > 2 else ''
    todo = [s for s in SUITES if flt in s[0]]
    if os.environ.get('QA_QUERY'):
        todo = [s for s in todo if not s[0].startswith(THEME_PREFIX)]
    with shared_browser(), ThreadPoolExecutor(WORKERS) as ex:
        res = list(ex.map(lambda s: run(s, out), todo))
    summary = {}
    for name, r in res:
        if r is None:
            continue
        summary[name] = r
        print(summary_line(name, r))
    for line in shot_lines(out, [s[0] for s in todo]):
        print(line)
    os.makedirs(out, exist_ok=True)
    json.dump(summary, open(os.path.join(out, 'summary.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
