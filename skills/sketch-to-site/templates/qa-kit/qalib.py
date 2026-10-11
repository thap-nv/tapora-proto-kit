# Hàm dùng chung cho quick.py (kiểm sau mỗi lần sửa) và handover.py (kiểm tổng trước bàn giao).
# Mốc gồm 2 thư mục, mỗi thư mục có <theme>/<bộ>/report.json và manifest.json (băm từng file):
#   _qa/last-green/  kết quả lần bàn giao gần nhất đã được người dùng chốt
#   _qa/current/     mốc cuốn chiếu: quick.py ghi đè các bộ vừa chạy sạch, kèm ledger.jsonl (mỗi lần sửa một dòng)
# Cấu hình của dự án ở _qa/qa.config.json (trang, theme, bộ kiểm, bước tự đổi giá trị, ảnh Hub).
import glob, hashlib, json, os, re, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import qadiff, run_all

HERE = run_all.HERE
ROOT = os.path.dirname(HERE)
SITE = run_all.SITE
SITE_REL = os.path.relpath(SITE, ROOT).replace('\\', '/') + '/'
CFG = run_all.CFG
CUR = os.path.join(HERE, 'current')
GREEN = os.path.join(HERE, 'last-green')
PAGES = CFG['pages']
# Theme đầu tiên là mặc định; giá trị là tham số URL bật theme đó
THEMES = CFG.get('themes') or {'default': ''}
DEFAULT_THEME = next(iter(THEMES))
SUITE_NAMES = [s[0] for s in run_all.SUITES]
# Bước tự đổi giá trị giữa 2 lần chạy dù không ai sửa gì (đồng hồ chạy thật, số ngẫu nhiên): [bộ, bước]
NOISY = {tuple(x) for x in CFG.get('noisy', [])}
# Mã của bộ kiểm chạy trong trang: đổi một file trong số này thì mọi bộ có thể đổi kết quả
KIT_CODE = ('run.mjs', 'launch.mjs', 'browser.mjs', 'probes.js', 'color.js', 'deep.mjs')
# Cấu hình cũng vào manifest: đổi khổ, theme, noisy, page_themes là mọi bộ có thể đổi kết quả (chạy tăng dần của handover.py cần biết)
CONFIG = 'qa.config.json'
# Theme theo trang: {"<trang hay tiền tố thư mục>": [theme, ...]}, khoá dài nhất thắng; trang không khớp chạy mọi theme.
# Hệ nhiều bề mặt: bề mặt chỉ dùng một theme thì không chạy theme kia (đo 10/10/2026: tích theme × bộ gần gấp đôi số lượt cần)
PAGE_THEMES = CFG.get('page_themes') or {}


def find_preflight():
    # preflight.py nằm trong skill sketch-to-site; skill có thể cài ở dự án, ở thư mục người dùng hoặc trong plugin.
    # Sau biến QA_PREFLIGHT và khoá "preflight" là skill đã cài bộ kiểm này (qa_init.py ghi vào _qa/.kit-source):
    # máy có nhiều bản skill thì dùng đúng bản đã sinh bộ kiểm, không phải bản plugin cũ tìm thấy trước
    cands = [os.environ.get('QA_PREFLIGHT'), CFG.get('preflight')]
    src = os.path.join(HERE, '.kit-source')
    if os.path.exists(src):
        cands.append(os.path.join(open(src, encoding='utf-8').read().strip(), 'scripts', 'preflight.py'))
    rel = os.path.join('sketch-to-site', 'scripts', 'preflight.py')
    d = ROOT
    while True:
        cands += [os.path.join(d, sub, rel) for sub in ('.claude/skills', '.agents/skills', '.codex/skills', 'skills')]
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    home = os.path.expanduser('~')
    cands += [os.path.join(home, sub, rel) for sub in ('.claude/skills', '.agents/skills', '.codex/skills')]
    for pat in ('.claude/plugins/cache/*/*/*/skills/sketch-to-site/scripts/preflight.py', '.codex/**/skills/sketch-to-site/scripts/preflight.py'):
        hits = glob.glob(os.path.join(glob.escape(home), pat), recursive=True)
        cands += sorted(hits, key=os.path.getmtime, reverse=True)
    return next((c for c in cands if c and os.path.isfile(c)), None)


PREFLIGHT = find_preflight()
shared_browser = run_all.shared_browser


def shown(p):
    # Đường dẫn để in: tương đối với thư mục prototype nếu nằm trong đó, không thì rút gọn thư mục người dùng thành ~
    p = os.path.abspath(p)
    home = os.path.expanduser('~')
    if p.startswith(ROOT + os.sep):
        p = os.path.relpath(p, ROOT)
    elif p.startswith(home + os.sep):
        p = '~' + p[len(home):]
    return p.replace(os.sep, '/')


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()[:16]


def manifest():
    # Mọi file của site, cộng file bước và bộ chạy: đổi một trong số đó là kết quả kiểm có thể đổi
    out = {}
    for base, _, names in os.walk(SITE):
        for n in names:
            p = os.path.join(base, n)
            out[os.path.relpath(p, ROOT).replace('\\', '/')] = sha(p)
    for n in os.listdir(HERE):
        if (n.startswith('steps-') and n.endswith('.json')) or n in KIT_CODE or n == CONFIG:
            out['_qa/' + n] = sha(os.path.join(HERE, n))
    return out


def load_json(p, default=None):
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else default


def save_json(p, data):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def changed_files(old, new):
    return sorted(k for k in set(old) | set(new) if old.get(k) != new.get(k))


def page_deps(page):
    # File mà trang nạp: chính trang, và src/href tương đối của thẻ nạp tài nguyên (không tính <a href> sang trang khác;
    # bỏ http, //, #, data:)
    html = open(os.path.join(SITE, page + '.html'), encoding='utf-8').read()
    base = os.path.dirname(page + '.html')
    tags = re.findall(r'<(?:script|link|img|source|video|audio|iframe|embed)\b[^>]*>', html, re.I)
    refs = {r for t in tags for r in re.findall(r'\s(?:src|href)="([^"?#]+)"', t) if not re.match(r'^(?:[a-z]+:|//|#)', r)}
    return {SITE_REL + page + '.html'} | {SITE_REL + os.path.normpath(os.path.join(base, r)).replace('\\', '/') for r in refs}


def affected_suites(changed):
    deps = {p: page_deps(p) for p in PAGES}
    text = {}
    for p, d in deps.items():
        text[p] = ''.join(open(os.path.join(ROOT, f), encoding='utf-8', errors='ignore').read()
                          for f in d if f.endswith(('.html', '.js', '.css')) and os.path.exists(os.path.join(ROOT, f)))
    pages, suites = set(), set()
    for f in changed:
        if f in {'_qa/' + n for n in KIT_CODE} or f == '_qa/' + CONFIG:
            return list(SUITE_NAMES)
        if f.startswith('_qa/steps-'):
            key = f[len('_qa/steps-'):-len('.json')]
            suites |= {s[0] for s in run_all.SUITES if s[2] == key}
            continue
        hit = {p for p, d in deps.items() if f in d}
        if not hit and f.startswith(SITE_REL):
            # File không nạp trực tiếp (ví dụ ảnh ghép tên trong JS): tìm thư mục của nó trong mã của trang
            folder = os.path.dirname(f)[len(SITE_REL):] + '/'
            hit = {p for p in PAGES if folder != '/' and folder in text[p]}
        pages |= hit or set(PAGES)
    suites |= {s[0] for s in run_all.SUITES if s[1] in pages}
    return [n for n in SUITE_NAMES if n in suites]


def deep_suites():
    # Lượt kiểm sâu: mỗi trang một bộ. Bộ khói (tên bắt đầu bằng smoke-) khổ desktop đầu tiên theo thứ tự trong cấu hình;
    # trang không có bộ khói (dự án đặt tên bộ bằng tay) thì bộ khổ desktop đầu tiên của trang. {trang: bộ}
    desk = run_all.SIZES.get('desktop')
    pick = {}
    for name, page, _, size in run_all.SUITES:
        if desk is None or size != desk:
            continue
        if page not in pick or (not pick[page].startswith('smoke-') and name.startswith('smoke-')):
            pick[page] = name
    return pick


DEEP_BY_PAGE = deep_suites()
DEEP_SUITES = frozenset(DEEP_BY_PAGE.values())


_theme_warned = set()


def suite_themes(name):
    # Theme mà bộ này chạy: page_themes của trang (khoá dài nhất khớp trang hay thư mục cha), không có thì mọi theme;
    # bộ tự đổi theme (theme-*) chỉ chạy ở theme mặc định. Tên bộ không có trong cấu hình: mọi theme, để bộ đã xoá vẫn thành bộ mất
    page = next((s[1] for s in run_all.SUITES if s[0] == name), None)
    out = list(THEMES)
    if page is not None and PAGE_THEMES:
        keys = [k for k in PAGE_THEMES if page == k.rstrip('/') or page.startswith(k.rstrip('/') + '/')]
        if keys:
            k = max(keys, key=len)
            want = [t for t in (PAGE_THEMES[k] or [])]
            bad = [t for t in want if t not in THEMES]
            if bad and k not in _theme_warned:
                _theme_warned.add(k)
                print(f'CẢNH BÁO page_themes "{k}": theme {", ".join(bad)} không có trong "themes" của qa.config.json, bỏ qua')
            out = [t for t in THEMES if t in want] or out
    if name.startswith(run_all.THEME_PREFIX):
        out = [t for t in out if t == DEFAULT_THEME]
    return out


def suite_pairs(names, themes):
    # [(theme, bộ)] sẽ chạy: theo thứ tự theme rồi thứ tự bộ trong cấu hình, chỉ cặp mà suite_themes cho phép
    return [(th, s) for th in themes for s in run_all.SUITES if s[0] in names and th in suite_themes(s[0])]


def reuse_report(th, name, out_root):
    # Bộ không đổi so với last-green (handover.py chạy tăng dần): chép report.json của mốc sang thư mục chạy, tóm tắt như vừa chạy.
    # Không có ảnh mới. None khi mốc thiếu report hay file bước không còn
    src = os.path.join(GREEN, th, name, 'report.json')
    key = next((s[2] for s in run_all.SUITES if s[0] == name), None)
    sf = os.path.join(HERE, f'steps-{key}.json') if key else ''
    if not (os.path.exists(src) and sf and os.path.exists(sf)):
        return None
    d = os.path.join(out_root, th, name)
    os.makedirs(d, exist_ok=True)
    shutil.copyfile(src, os.path.join(d, 'report.json'))
    rep = load_json(src)
    r = run_all.summarize(name, rep, json.load(open(sf, encoding='utf-8'))['steps'])
    r['reused'] = True
    return r


def run_suites(names, out_root, themes, shots, deep=False, only=None):
    # Theme theo bộ (suite_themes): bộ tự đổi theme chỉ ở theme mặc định, trang khai page_themes chỉ ở theme của nó. shots: chụp ảnh ở mọi theme.
    # deep: bật lượt kiểm sâu cho các bộ trong DEEP_SUITES (run_all.run chỉ nhận quyết định, không tự chọn bộ).
    # only: tập (theme, tên bộ) được chạy; cặp khác bỏ (handover.py chạy tăng dần lấy lại từ mốc)
    res = {}
    pairs = suite_pairs(names, themes)
    with shared_browser():
        for th in themes:
            os.environ['QA_QUERY'] = THEMES[th]
            os.environ['QA_NOSHOT'] = '' if shots else '1'
            todo = [s for t, s in pairs if t == th and (only is None or (th, s[0]) in only)]
            with ThreadPoolExecutor(run_all.WORKERS) as ex:
                for name, r in ex.map(lambda s: run_all.run(s, os.path.join(out_root, th), deep and s[0] in DEEP_SUITES), todo):
                    if r is not None:
                        res[(th, name)] = r
    os.environ['QA_QUERY'] = ''
    os.environ['QA_NOSHOT'] = ''
    return res


over_steps = qadiff.over_steps


def known_lines(root):
    # Mọi dòng đo có trong mốc ở root (current/ cho quick.py, last-green/ cho handover.py), mọi bộ, mọi theme.
    # Bộ mới mang dòng đã có ở bộ khác (component dùng chung) thì dòng đó là nợ cũ, không chặn
    reps = [load_json(p) for p in glob.glob(os.path.join(glob.escape(root), '*', '*', 'report.json'))]
    return qadiff.known_lines(r for r in reps if r)


def diff_report(base, rep, suite, known=frozenset()):
    # So từng bước với mốc (qadiff.py): bước mất, bước mới, check đổi, tràn ngang mới, dòng mới của từng phép đo, nợ cũ
    return qadiff.diff_report(base, rep, suite, NOISY, known)


# Nợ cũ in gộp (qadiff.py): mỗi mục (phép đo, dòng đã bỏ số) một dòng dù gặp ở nhiều bước, khổ, theme
group_debt, debt_count, debt_lines = qadiff.group_debt, qadiff.debt_count, qadiff.debt_lines


def layout_warnings(reports):
    # Cảnh báo bố cục trên trang đã render (probes.js layout: chỉ số 3, 4, 8 của sketch-to-map). Không chặn, không so mốc.
    # reports: [(theme/bộ, báo cáo)]. Trả [(dòng, chỗ đầu tiên)], mỗi dòng (đã bỏ số px) một lần
    seen = {}
    for where, rep in reports:
        for x in rep or []:
            for c in (x.get('dims') or {}).get('layout') or []:
                seen.setdefault(qadiff.norm(c), (c, f'{where} · {x["step"]}'))
    return list(seen.values())


def preflight():
    # Không tìm thấy preflight.py thì báo mà không tính là lỗi: bộ kiểm trình duyệt vẫn chạy
    if not PREFLIGHT:
        return True, 'BỎ QUA: không tìm thấy sketch-to-site/scripts/preflight.py (đặt QA_PREFLIGHT hoặc khoá "preflight" trong qa.config.json)'
    r = subprocess.run([sys.executable, PREFLIGHT, SITE, '--kind', CFG.get('preflight_kind', 'app')],
                       capture_output=True, text=True, encoding='utf-8', errors='replace', env=dict(os.environ, PYTHONIOENCODING='utf-8'))
    last = [l for l in (r.stdout or '').strip().splitlines() if l.strip()]
    return r.returncode == 0, (last[-1] if last else (r.stderr or '').strip()[:200])


def short(v, n=140):
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    s = s.replace('\n', ' ')
    return s if len(s) <= n else s[:n] + '…'


def copy_reports(src_root, dst_root, pairs):
    for th, name in pairs:
        s = os.path.join(src_root, th, name, 'report.json')
        if os.path.exists(s):
            d = os.path.join(dst_root, th, name)
            os.makedirs(d, exist_ok=True)
            shutil.copyfile(s, os.path.join(d, 'report.json'))
