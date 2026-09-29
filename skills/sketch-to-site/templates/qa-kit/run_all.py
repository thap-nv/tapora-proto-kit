# Chạy các bộ kiểm khai báo trong _qa/qa.config.json, mỗi bộ ra một thư mục <out>/<bộ>/ có report.json và ảnh.
# Chạy từ thư mục prototype (thư mục chứa _qa/):  python _qa/run_all.py <thư-mục-ra> [lọc]
#   ví dụ: python _qa/run_all.py _qa/.recheck             (mọi bộ)
#          python _qa/run_all.py _qa/.recheck cash        (chỉ các bộ có chữ "cash" trong tên)
# In một dòng tóm tắt mỗi bộ: số bước, lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung, bước FAIL, bước có check mà không trả giá trị.
# Bộ kiểm: [tên, trang, khoá file bước, khổ] trong "suites"; file bước là _qa/steps-<khoá>.json; khổ lấy từ "sizes".
# Bước trả chuỗi bắt đầu bằng "FAIL" là lỗi. Bộ có tên bắt đầu bằng "scan" thì mọi chuỗi khác rỗng là lỗi (bộ quét chữ).
# File bước:  {"query": "?id=XT07", "steps": [ {bước}, ... ]}   ("query" không bắt buộc, nối vào URL của trang)
#   "name"   tên bước, không trùng trong file
#   "js"     biểu thức chạy trên trang, ví dụ "document.querySelector('[data-filter]')?.click()"; "location.reload()" để thử F5
#   "wait"   số ms đợi sau "js" (mặc định 450); bước làm chuyển trang thì bộ chạy tự đợi trang mới tải xong
#   "check"  biểu thức trả 'PASS' khi đúng, chuỗi bắt đầu bằng "FAIL:" khi sai, ví dụ
#            "document.querySelectorAll('#lots li').length === 2 ? 'PASS' : 'FAIL: cần 2 lô'"; không trả gì là bước im lặng
#   "shot"   tên ảnh chụp sau bước; "jpeg": true để chụp jpg; "clip": "<css selector>" chỉ chụp khung đó, "scale" phóng ảnh clip
# Mỗi bộ chạy trong một hồ sơ trình duyệt mới: localStorage trống lúc bắt đầu bộ.
import json, os, subprocess, sys
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


def run(s, out):
    name, page, steps, size = s
    sf = os.path.join(HERE, 'steps-' + steps + '.json')
    if not os.path.exists(sf):
        return name, None
    od = os.path.join(out, name)
    os.makedirs(od, exist_ok=True)
    # Mỗi bộ một cổng gỡ lỗi riêng: trùng cổng thì bộ này điều khiển nhầm trình duyệt của bộ kia
    env = dict(os.environ, CDP_PORT=str(9300 + 3 * SUITES.index(s)))
    r = subprocess.run(NODE + [os.path.join(HERE, 'run.mjs'), os.path.join(SITE, page + '.html'), sf, od] + list(size), capture_output=True, text=True, encoding='utf-8', env=env)
    try:
        rep = json.loads(r.stdout)
    except Exception:
        return name, {'crash': (r.stderr or r.stdout)[:400]}
    json.dump(rep, open(os.path.join(od, 'report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    steps_def = json.load(open(sf, encoding='utf-8'))['steps']
    has_check = {x['name'] for x in steps_def if x.get('check')}
    errs = sum(len(x['errors']) for x in rep)
    over = sum(1 for x in rep if x['dims'] and x['dims']['sw'] > x['dims']['cw'])
    cut = sum(len(x['dims'].get('cut') or []) for x in rep if x['dims'])
    fails = [x['step'] for x in rep if isinstance(x.get('check'), str) and x['check'].startswith('FAIL')]
    # Bộ quét chữ trả chuỗi rỗng khi đạt; chuỗi khác rỗng là lỗi chữ
    if name.startswith('scan'):
        fails += [x['step'] + ': ' + x['check'] for x in rep if isinstance(x.get('check'), str) and x['check']]
    silent = [x['step'] for x in rep if x['step'] in has_check and x.get('check') is None]
    return name, {'steps': len(rep) - 1, 'errors': errs, 'overflow': over, 'cut': cut, 'fails': fails, 'silent': silent}


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
        if 'crash' in r:
            print(f'{name}: LỖI CHẠY {r["crash"]}')
        else:
            print(f'{name}: {r["steps"]} bước · console {r["errors"]} · tràn {r["overflow"]} · cắt {r["cut"]} · FAIL {len(r["fails"])} {r["fails"] or ""} · im lặng {len(r["silent"])} {r["silent"] or ""}')
    os.makedirs(out, exist_ok=True)
    json.dump(summary, open(os.path.join(out, 'summary.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
