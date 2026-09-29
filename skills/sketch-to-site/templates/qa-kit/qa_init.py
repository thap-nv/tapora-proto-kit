# Cài bộ kiểm vào một prototype: chép script vào <prototype>/_qa/, sinh qa.config.json và bộ kiểm khói cho từng trang.
#   python <skill sketch-to-site>/templates/qa-kit/qa_init.py <thư-mục-prototype> [--site site] [--update]
# <thư-mục-prototype> là thư mục chứa site/ (các trang .html, kể cả trong thư mục con như site/admin/, site/app/). Sau khi cài:
#   python _qa/handover.py run          lần chạy đầu, lấy mốc
#   python _qa/handover.py promote _qa/handover/<ngày-giờ>
#   python _qa/quick.py --note "..."    sau mỗi lần sửa
# --update: chép đè script của bộ kiểm bằng bản trong skill; không đụng qa.config.json, file bước, mốc, ledger.
# Bộ khói: trang web ở 1440, 768, 390; màn app ở 1440 (khung máy) và 390. Trang cần tham số mới có nội dung (chi tiết theo ?id=)
# khai báo mẫu bằng <meta name="qa-query" content="?id=..."> trong <head>. Site có nền tối thì tự thêm theme light và dark.
# _qa/.kit-source ghi thư mục skill đã cài bộ kiểm, để bộ kiểm gọi đúng preflight.py của bản skill đó.
import argparse, filecmp, json, os, re, shutil, sys
sys.stdout.reconfigure(encoding='utf-8')
KIT = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(os.path.dirname(KIT))
# Tham số dùng chung của khuôn, không phải dữ liệu của trang: không cần mẫu
SHARED_PARAMS = {'theme', 'platform', 'reset', 'state'}
# Màn app mobile (<html data-surface="app">): mọi phần tử bấm được phải đủ vùng chạm của nền tảng, iOS 44, Android 48.
# Chỉ đo khi chạy full màn hình như trên điện thoại; có khung máy (khổ rộng) thì khung bị thu nhỏ, đo sẽ sai.
TAP_CHECK = r"""(() => {
  const root = document.documentElement;
  if (root.dataset.device) return 'BỎ QUA: đang có khung, đo ở khổ điện thoại';
  const min = root.dataset.platform === 'android' ? 48 : 44;
  const bad = [];
  document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch]').forEach(e => {
    if (e.closest('[data-tap-ok]') || getComputedStyle(e).visibility === 'hidden') return;
    if (e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.closest('p')) return;
    const box = (e.matches('input[type=checkbox], input[type=radio]') && e.closest('label')) || e;
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (r.width < min - 0.5 || r.height < min - 0.5)
      bad.push((e.getAttribute('aria-label') || e.textContent || e.name || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  });
  return bad.length ? 'FAIL: ' + bad.length + ' vùng chạm < ' + min + 'px: ' + bad.slice(0, 6).join(' · ') : 'PASS ' + min + 'px';
})()"""


def find_pages(site):
    # Trang .html ở site/ và thư mục con (site/admin/, site/app/ khi có nhiều bề mặt); bỏ assets/ và thư mục ẩn
    pages = []
    for base, dirs, names in os.walk(site):
        dirs[:] = sorted(d for d in dirs if d != 'assets' and not d.startswith(('.', '_')))
        rel = os.path.relpath(base, site).replace('\\', '/')
        pages += [(n[:-5] if rel == '.' else f'{rel}/{n[:-5]}') for n in sorted(names) if n.endswith('.html')]
    return pages


def is_app_screen(html):
    m = re.search(r'<html\b[^>]*>', html[:4000], re.I)
    return bool(m and re.search(r'data-surface\s*=\s*["\']app["\']', m.group(0), re.I))


def qa_query(html):
    # <meta name="qa-query" content="?id=bx">: tham số mẫu cho bộ khói của trang
    for tag in re.findall(r'<meta\b[^>]*>', html, re.I):
        if re.search(r'name\s*=\s*["\']qa-query["\']', tag, re.I):
            m = re.search(r'content\s*=\s*["\']([^"\']*)["\']', tag, re.I)
            if m and m.group(1).strip():
                return '?' + m.group(1).strip().lstrip('?')
    return ''


def url_params(html):
    # Tham số trang đọc từ URL: new URLSearchParams(location.search).get('id'), hoặc qua biến giữ URLSearchParams
    names = set(re.findall(r'URLSearchParams\([^)]*\)\s*\.get\(\s*["\'](\w+)', html))
    for var in re.findall(r'(\w+)\s*=\s*new\s+URLSearchParams\(', html):
        names |= set(re.findall(r'\b' + re.escape(var) + r'\.get\(\s*["\'](\w+)', html))
    return sorted(names - SHARED_PARAMS)


def read_site(site):
    # Mọi file .html, .css, .js của site, để dò nền tối
    out = {}
    for base, _, names in os.walk(site):
        for n in names:
            if n.endswith(('.html', '.css', '.js')):
                out[os.path.join(base, n)] = open(os.path.join(base, n), encoding='utf-8', errors='ignore').read()
    return out


KIT_FILES = ['run.mjs', 'run_all.py', 'qalib.py', 'quick.py', 'handover.py', 'compare.py']
GITIGNORE = '# Kết quả chạy, sinh lại được. last-green/ nên commit để cả nhóm dùng chung một mốc\nhandover/\ncurrent/\n.quick-run/\n.recheck/\n.thumbs/\n__pycache__/\n.kit-source\n'

ap = argparse.ArgumentParser()
ap.add_argument('prototype')
ap.add_argument('--site', default='site')
ap.add_argument('--update', action='store_true')
a = ap.parse_args()

proto = os.path.abspath(a.prototype)
site = os.path.join(proto, a.site)
qa = os.path.join(proto, '_qa')
if not os.path.isdir(site) or a.site in ('.', ''):
    print(f'Không thấy thư mục trang: {site}. Trang .html phải nằm trong một thư mục con (mặc định site/); chỉ định bằng --site.')
    sys.exit(2)
os.makedirs(qa, exist_ok=True)

for f in KIT_FILES:
    src, dst = os.path.join(KIT, f), os.path.join(qa, f)
    if not os.path.exists(dst):
        shutil.copyfile(src, dst); print('chép', f)
    elif filecmp.cmp(src, dst, shallow=False):
        print('giữ', f, '(đã giống bản trong skill)')
    elif a.update:
        shutil.copyfile(src, dst); print('chép đè', f)
    else:
        print('giữ', f, '(khác bản trong skill; thêm --update để chép đè)')

cfg_path = os.path.join(qa, 'qa.config.json')
if os.path.exists(cfg_path):
    print('giữ qa.config.json')
else:
    pages = find_pages(site)
    if not pages:
        print(f'Không có trang .html nào trong {site}.'); sys.exit(2)
    suites, apps, need_query = [], [], []
    for p in pages:
        key = p.replace('/', '-')                      # trang trong thư mục con: tên bộ và tên file bước không chứa "/"
        html = open(os.path.join(site, p + '.html'), encoding='utf-8', errors='ignore').read()
        app = is_app_screen(html)
        # Màn app: 1440 là khung máy, 390 là full màn hình như trên điện thoại; 768 cũng chỉ là khung máy nên bỏ
        sizes = [('1440', 'desktop')] + ([] if app else [('768', 'tablet')]) + [('390', 'mobile')]
        suites += [[f'smoke-{key}-{px}', p, f'smoke-{key}', size] for px, size in sizes]
        if app:
            apps.append(p)
        sf = os.path.join(qa, f'steps-smoke-{key}.json')
        if not os.path.exists(sf):
            # Bộ khói: mở trang, chụp ảnh. Bộ chạy tự ghi lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung của mọi bước
            steps = {'steps': [{'name': 'view', 'wait': 600, 'check': 'document.title', 'shot': key, 'jpeg': True}]}
            if app:
                steps['steps'].append({'name': 'tap-targets', 'wait': 100, 'check': TAP_CHECK})
            q = qa_query(html)
            if q:
                steps = {'query': q, **steps}
            elif url_params(html):
                need_query.append((p, key, url_params(html)))
            json.dump(steps, open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # Nền tối: CSS có prefers-color-scheme: dark, [data-theme="dark"] hoặc lớp dark: của Tailwind (mặc định theo prefers-color-scheme).
    # run.mjs ép prefers-color-scheme theo ?theme= nên ảnh không đi theo máy đang chạy
    src = read_site(site)
    text = '\n'.join(src.values())
    dark_media = re.search(r'prefers-color-scheme\s*:\s*dark', text) or re.search(r'class="[^"]*\bdark:[a-z]', text)
    dark_attr = re.search(r'data-theme\s*=\s*["\']?dark', text)
    themes = {'light': '?theme=light', 'dark': '?theme=dark'} if (dark_media or dark_attr) else {'default': ''}
    cfg = {
        'site': a.site,
        'pages': pages,
        'themes': themes,
        'sizes': {'desktop': [1440, 900, 0], 'tablet': [768, 1024, 0], 'mobile': [390, 844, 1]},
        'suites': suites,
        'noisy': [],
        'theme_switch_prefix': 'theme-',
        'preflight_kind': 'site',
        'thumbs': {'dir': 'assets/shots', 'items': []},
        'browser': '',
    }
    json.dump(cfg, open(cfg_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'tạo qa.config.json: {len(pages)} trang, {len(suites)} bộ khói '
          f'(trang web ở 1440, 768, 390{"; màn app ở 1440 và 390" if apps else ""}) · theme: {", ".join(themes)}')
    if apps:
        print(f'{len(apps)} màn app mobile có bước kiểm vùng chạm (tap-targets). '
              'Làm cả Android thì thêm "android": "?platform=android" vào "themes".')
    loads_theme = any(re.search(r'<script\b[^>]*\bsrc\s*=\s*["\'][^"\']*theme\.js', t, re.I) for f, t in src.items() if f.endswith('.html'))
    if dark_attr and not dark_media and not loads_theme:
        print('Nền tối bật bằng data-theme nhưng chưa trang nào nạp theme.js: ?theme=dark sẽ không đổi gì. '
              'Chép templates/theme.js vào assets/ và nạp trong <head> của mọi trang.')
    for p, key, names in need_query:
        print(f'CẢNH BÁO: {p} đọc tham số {", ".join("?" + n + "=" for n in names)} mà chưa có mẫu: bộ khói chỉ chụp được trạng thái rỗng '
              f'hoặc "không tìm thấy". Thêm <meta name="qa-query" content="?{names[0]}=<mã có trong data.js>"> vào <head> của trang, '
              f'và "query": "?{names[0]}=<mã>" vào _qa/steps-smoke-{key}.json.')

# Skill đã cài bộ kiểm này: qalib.find_preflight() dùng preflight.py của đúng bản này trước các bản cài ở chỗ khác
open(os.path.join(qa, '.kit-source'), 'w', encoding='utf-8').write(SKILL)
gi = os.path.join(qa, '.gitignore')
if not os.path.exists(gi):
    open(gi, 'w', encoding='utf-8').write(GITIGNORE); print('tạo _qa/.gitignore')
else:
    old = open(gi, encoding='utf-8').read()
    if '.kit-source' not in old:
        open(gi, 'a', encoding='utf-8').write(('' if old.endswith('\n') else '\n') + '.kit-source\n'); print('thêm .kit-source vào _qa/.gitignore')

rel = os.path.relpath(proto)
print(f'\nXong. Từ {rel}:\n  python _qa/handover.py run\n  python _qa/handover.py promote _qa/handover/<ngày-giờ>\n'
      '"preflight_kind" là "site" (site giới thiệu); web app thì đổi thành "app". Thêm bộ kiểm riêng vào "suites".')
