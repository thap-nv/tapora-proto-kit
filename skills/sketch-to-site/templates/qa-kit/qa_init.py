# Cài bộ kiểm vào một prototype: chép script vào <prototype>/_qa/, sinh qa.config.json và bộ kiểm khói cho từng trang.
#   python <skill sketch-to-site>/templates/qa-kit/qa_init.py <thư-mục-prototype> [--site site] [--update]
# <thư-mục-prototype> là thư mục chứa site/ (các trang .html, kể cả trong thư mục con như site/admin/, site/app/). Sau khi cài:
#   python _qa/handover.py run          lần chạy đầu, lấy mốc
#   python _qa/handover.py promote _qa/handover/<ngày-giờ>
#   python _qa/quick.py --note "..."    sau mỗi lần sửa
# --update: chép đè script của bộ kiểm bằng bản trong skill; không đụng qa.config.json, mốc, ledger. File bước giữ nguyên, trừ "query" cố định
#   trùng qa-query của trang (bản cài cũ chép vào) thì bỏ, để run.mjs đọc thẻ của trang.
# Bộ khói: trang web ở 1440, 768, 390, chụp hết trang theo từng màn; màn app ở 1440 (khung máy) và 390. Trang cần tham số mới có nội dung (chi tiết theo ?id=)
# khai báo mẫu bằng <meta name="qa-query" content="?id=..."> trong <head>: run.mjs đọc thẻ này ở mỗi lần chạy, không chép vào file bước.
# Site có nền tối thì tự thêm theme light và dark.
# Có site/assets/themes.json: mỗi theme trong đó là một theme của bộ kiểm (theme mặc định sáng đứng đầu, không tham số).
# Có site/_system.html: bộ khói của nó kiểm thêm component mẫu đã thay và mọi cặp màu đạt ngưỡng.
# Trang có trạng thái theo tham số (giờ, ngày…): <meta name="qa-states" content="?gio=7:00 | ?thu=2">, bộ khói đo và chụp màn đầu từng trạng thái.
# Trang nạp store.js: thêm bộ du-lieu-rong-<trang> (?data=empty) và du-lieu-dai-<trang> (?data=stress).
# _qa/.kit-source ghi thư mục skill đã cài bộ kiểm, để bộ kiểm gọi đúng preflight.py của bản skill đó.
import argparse, filecmp, html as html_lib, json, os, re, shutil, sys
sys.stdout.reconfigure(encoding='utf-8')
KIT = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(os.path.dirname(KIT))
# Tham số dùng chung của khuôn, không phải dữ liệu của trang: không cần mẫu
SHARED_PARAMS = {'theme', 'platform', 'reset', 'state', 'data'}
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
# Trang design system sống (site/_system.html, khuôn templates/system.html): còn component mẫu thì FAIL; có cặp màu dưới ngưỡng
# hoặc thiếu biến token thì FAIL. Chạy ở mọi theme, nên mọi theme đều được đo đủ cặp
SYSTEM_STEPS = [
    {'name': 'system-demo', 'wait': 100, 'check': "document.querySelector('[data-system-demo]') ? "
     "'FAIL: còn component mẫu (data-system-demo): thay bằng component thật của dự án' : 'PASS'"},
    {'name': 'system-pairs', 'wait': 100, 'check': "(() => { const bad = [...document.querySelectorAll('[data-pair][data-verdict=\"khong\"]')]"
     ".map(e => e.dataset.pair); const miss = ((document.querySelector('[data-sys-missing]') || {}).textContent || '').trim(); "
     "return bad.length ? 'FAIL: ' + bad.length + ' cặp dưới ngưỡng: ' + bad.slice(0, 6).join(', ') : miss ? 'FAIL: thiếu biến ' + miss "
     ": 'PASS ' + document.querySelectorAll('[data-pair]').length + ' cặp'; })()"},
]


def theme_names(site):
    # site/assets/themes.json (scripts/themes.mjs): theme mặc định cho máy sáng đứng đầu, không tham số; theme khác ép bằng ?theme=<tên>
    p = os.path.join(site, 'assets', 'themes.json')
    if not os.path.exists(p):
        return None
    data = json.load(open(p, encoding='utf-8'))
    names = list((data.get('themes') or {}).keys())
    first = (data.get('default') or {}).get('light') or (names[0] if names else None)
    if not first:
        return None
    return {n: ('' if n == first else f'?theme={n}') for n in [first] + [n for n in names if n != first]}


def uses_store(html):
    return bool(re.search(r'<script\b[^>]*\bsrc\s*=\s*["\'][^"\']*store\.js', html, re.I))


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


# _system chụp hết trang: ở 390 trang này cao tới 28 màn (đo ba skill sửa), 16 màn cắt mất phần lớn mục Component
SYSTEM_SLICES = 'all'


def qa_query(html):
    # <meta name="qa-query" content="?id=bx">: tham số mẫu cho bộ khói của trang
    for tag in re.findall(r'<meta\b[^>]*>', html, re.I):
        if re.search(r'name\s*=\s*["\']qa-query["\']', tag, re.I):
            m = re.search(r'content\s*=\s*["\']([^"\']*)["\']', tag, re.I)
            if m and m.group(1).strip():
                # Thuộc tính HTML viết & thành &amp;: giải ra, không thì bộ khói đọc thành tham số "amp;…"
                return '?' + html_lib.unescape(m.group(1).strip()).lstrip('?')
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


KIT_FILES = ['run.mjs', 'launch.mjs', 'browser.mjs', 'run_all.py', 'qalib.py', 'quick.py', 'handover.py', 'breaktest.py', 'compare.py', 'probes.js', 'qadiff.py', 'deep.mjs']
# Lõi màu dùng chung nằm ở templates/ của skill (bảng concept, themes.mjs, _system.html cùng dùng), không ở qa-kit/
SHARED_FILES = [('color.js', os.path.join(SKILL, 'templates', 'color.js'))]
GITIGNORE = '# Kết quả chạy, sinh lại được. last-green/ nên commit để cả nhóm dùng chung một mốc\nhandover/\ncurrent/\n.quick-run/\n.recheck/\n.tdd/\n.thumbs/\n__pycache__/\n.kit-source\n'

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

for f, src in [(f, os.path.join(KIT, f)) for f in KIT_FILES] + SHARED_FILES:
    dst = os.path.join(qa, f)
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
    cfg = json.load(open(cfg_path, encoding='utf-8'))
    tn = theme_names(site) or {}
    miss = [n for n in tn if n not in cfg.get('themes', {})]
    if miss:
        print('themes.json có theme chưa khai trong qa.config.json: ' + ', '.join(miss) + '. Thêm vào "themes": '
              + ', '.join(f'"{n}": "{tn[n] or "?theme=" + n}"' for n in miss))
    # Bộ cài trước bản này chép qa-query vào steps-smoke-*.json: trùng thẻ meta thì bỏ để run.mjs đọc thẻ của trang, khác thì báo
    for p in cfg.get('pages', []):
        sf, hf = os.path.join(qa, f'steps-smoke-{p.replace("/", "-")}.json'), os.path.join(site, p + '.html')
        if not (os.path.exists(sf) and os.path.exists(hf)):
            continue
        st = json.load(open(sf, encoding='utf-8'))
        view = (st.get('steps') or [{}])[0]
        if p == '_system' and view.get('slices') in (8, 16):
            n = view['slices']
            view['slices'] = SYSTEM_SLICES; json.dump(st, open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'{os.path.basename(sf)}: chụp hết trang ({n} màn cắt mất phần dưới của _system)')
        elif p != '_system' and view.get('slices') and 'states' not in st:
            st['states'] = True; json.dump(st, open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'{os.path.basename(sf)}: thêm "states" (đo và chụp màn đầu mỗi trạng thái của <meta name="qa-states">)')
        if 'query' not in st:
            continue
        q = qa_query(open(hf, encoding='utf-8', errors='ignore').read())
        if st['query'] == q:
            del st['query']; json.dump(st, open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'bỏ "query" cố định trong {os.path.basename(sf)}: bộ khói đọc qa-query của trang ở mỗi lần chạy')
        else:
            print(f'{os.path.basename(sf)} ghi "query": "{st["query"]}" khác qa-query của trang ("{q}"): '
                  f'xoá khoá "query" để dùng qa-query của trang, hoặc giữ nếu cố ý')
    if os.path.exists(os.path.join(site, '_system.html')) and '_system' not in cfg.get('pages', []):
        print('Có site/_system.html mà qa.config.json chưa có trang _system: thêm "_system" vào "pages", các bộ smoke-_system-<khổ> vào "suites", '
              'và _qa/steps-smoke-_system.json với các bước system-demo, system-pairs (chép từ SYSTEM_STEPS trong qa_init.py).')
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
            # Bộ khói: mở trang, chụp ảnh. Bộ chạy tự ghi lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung của mọi bước.
            # Trang web chụp hết trang theo từng màn (<key>.jpg, <key>-2.jpg, …, tối đa 8): chỉ màn đầu thì phần dưới không ai xem.
            # Màn app chụp khung máy nên một ảnh là đủ
            # Trang web còn đo và chụp màn đầu của từng trạng thái khai ở <meta name="qa-states"> (run.mjs, "states"). _system dài hơn trang
            # thường (bảng màu, thang chữ, component, hai trường hợp khó) nên chụp hết trang: đo 4.5, 8 màn cắt mất component ở 390; 16 màn vẫn cắt
            view = {'name': 'view', 'wait': 600, 'check': 'document.title', 'shot': key, 'jpeg': True}
            if not app:
                view['slices'] = SYSTEM_SLICES if p == '_system' else 8
            steps = {'steps': [view]}
            if not app and p != '_system':
                steps['states'] = True
            if app:
                steps['steps'].append({'name': 'tap-targets', 'wait': 100, 'check': TAP_CHECK})
            if p == '_system':
                steps['steps'] += SYSTEM_STEPS
            # Không chép qa-query vào file bước: run.mjs đọc thẻ meta của trang ở mỗi lần chạy
            json.dump(steps, open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        if not qa_query(html) and url_params(html):
            need_query.append((p, key, url_params(html)))
        # Kịch bản dữ liệu (store.js ?data=): danh sách rỗng ở khổ rộng, dữ liệu dài ở khổ điện thoại
        if uses_store(html):
            for scen, data, size in (('rong', 'empty', 'mobile' if app else 'desktop'), ('dai', 'stress', 'mobile')):
                k2 = f'du-lieu-{scen}-{key}'
                suites.append([k2, p, k2, size])
                sf2 = os.path.join(qa, f'steps-{k2}.json')
                if not os.path.exists(sf2):
                    json.dump({'query_add': 'data=' + data,
                               'steps': [{'name': 'view', 'wait': 600, 'check': 'document.title', 'shot': k2, 'jpeg': True}]},
                              open(sf2, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # Nền tối: CSS có prefers-color-scheme: dark, [data-theme="dark"] hoặc lớp dark: của Tailwind (mặc định theo prefers-color-scheme).
    # run.mjs ép prefers-color-scheme theo ?theme= nên ảnh không đi theo máy đang chạy
    src = read_site(site)
    text = '\n'.join(src.values())
    dark_media = re.search(r'prefers-color-scheme\s*:\s*dark', text) or re.search(r'class="[^"]*\bdark:[a-z]', text)
    dark_attr = re.search(r'data-theme\s*=\s*["\']?dark', text)
    themes = theme_names(site) or ({'light': '?theme=light', 'dark': '?theme=dark'} if (dark_media or dark_attr) else {'default': ''})
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
              f'hoặc "không tìm thấy". Thêm <meta name="qa-query" content="?{names[0]}=<mã có trong data.js>"> vào <head> của trang: '
              f'lần chạy sau bộ khói tự đọc thẻ đó, không sửa file bước.')

# Skill đã cài bộ kiểm này: qalib.find_preflight() dùng preflight.py của đúng bản này trước các bản cài ở chỗ khác
open(os.path.join(qa, '.kit-source'), 'w', encoding='utf-8').write(SKILL)
gi = os.path.join(qa, '.gitignore')
if not os.path.exists(gi):
    open(gi, 'w', encoding='utf-8').write(GITIGNORE); print('tạo _qa/.gitignore')
else:
    for entry in ('.kit-source', '.tdd/'):                    # dòng thêm ở các bản sau: .gitignore cũ chưa có
        old = open(gi, encoding='utf-8').read()
        if entry not in old.split('\n'):
            open(gi, 'a', encoding='utf-8').write(('' if not old or old.endswith('\n') else '\n') + entry + '\n'); print(f'thêm {entry} vào _qa/.gitignore')

try:
    rel = os.path.relpath(proto)
except ValueError:  # Windows: prototype khác ổ đĩa với thư mục đang đứng, relpath lỗi; in đường dẫn đầy đủ
    rel = proto
print(f'\nXong. Từ {rel}:\n  python _qa/handover.py run\n  python _qa/handover.py promote _qa/handover/<ngày-giờ>\n'
      '"preflight_kind" là "site" (site giới thiệu); web app thì đổi thành "app". Thêm bộ kiểm riêng vào "suites".')
