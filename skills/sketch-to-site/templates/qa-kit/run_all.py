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
# Mỗi bộ chạy trong một hồ sơ trình duyệt mới: localStorage trống lúc bắt đầu bộ. File tải xuống (nút xuất) nằm trong hồ sơ đó
# và bị xoá khi bộ chạy xong, không rơi vào thư mục Downloads của máy; bước kiểm tính năng xuất bằng giao diện (toast, trạng thái).
import hashlib, json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, 'qa.config.json'), encoding='utf-8'))
SITE = os.path.normpath(os.path.join(HERE, '..', CFG.get('site', 'site')))
SIZES = {k: tuple(str(x) for x in v) for k, v in CFG.get('sizes', {'desktop': [1440, 900, 0], 'tablet': [768, 1024, 0], 'mobile': [390, 844, 1]}).items()}
SUITES = [(s[0], s[1], s[2], SIZES[s[3]]) for s in CFG['suites']]
# Bộ tự đổi theme (tên bắt đầu bằng tiền tố này) không chạy lại khi đã ép theme bằng QA_QUERY
THEME_PREFIX = CFG.get('theme_switch_prefix', 'theme-')


def node_cmd():
    # Node 20 cần cờ --experimental-websocket; Node 22 trở lên có sẵn WebSocket
    try:
        major = int(subprocess.run(['node', '-p', 'process.versions.node.split(".")[0]'], capture_output=True, text=True).stdout.strip())
    except Exception:
        major = 20
    return ['node'] + (['--experimental-websocket'] if major < 22 else [])


NODE = node_cmd()


def run(s, out, deep=False):
    name, page, steps, size = s
    sf = os.path.join(HERE, 'steps-' + steps + '.json')
    if not os.path.exists(sf):
        return name, None
    od = os.path.join(out, name)
    os.makedirs(od, exist_ok=True)
    # Không đặt CDP_PORT: run.mjs để hệ điều hành chọn cổng gỡ lỗi cho từng bộ, nên không bao giờ trùng cổng với bộ khác (CDP_PORT chỉ là ép tay, tuỳ chọn)
    env = dict(os.environ)
    # Lượt kiểm sâu (deep.mjs): handover.py bật, qalib.py chọn bộ (DEEP_SUITES: mỗi trang một bộ khổ desktop); ở đây chỉ nhận quyết định
    env['QA_DEEP'] = '1' if deep else ''
    r = subprocess.run(NODE + [os.path.join(HERE, 'run.mjs'), os.path.join(SITE, page + '.html'), sf, od] + list(size), capture_output=True, text=True, encoding='utf-8', env=env)
    try:
        rep = json.loads(r.stdout)
    except Exception:
        return name, {'crash': (r.stderr or r.stdout)[:400]}
    json.dump(rep, open(os.path.join(od, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    steps_def = json.load(open(sf, encoding='utf-8'))['steps']
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
    return name, {'steps': sum(1 for x in rep if x['step'] not in ('load', 'deep')), 'errors': errs, 'overflow': over, 'cut': cut,
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
    with ThreadPoolExecutor(4) as ex:
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
