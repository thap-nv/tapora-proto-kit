# Cài bộ kiểm vào một prototype: chép script vào <prototype>/_qa/, sinh qa.config.json và bộ kiểm khói cho từng trang.
#   python <skill sketch-to-site>/templates/qa-kit/qa_init.py <thư-mục-prototype> [--site site] [--update]
# <thư-mục-prototype> là thư mục chứa site/ (các trang .html). Sau khi cài:
#   python _qa/handover.py run          lần chạy đầu, lấy mốc
#   python _qa/handover.py promote _qa/handover/<ngày-giờ>
#   python _qa/quick.py --note "..."    sau mỗi lần sửa
# --update: chép đè script của bộ kiểm bằng bản trong skill; không đụng qa.config.json, file bước, mốc, ledger.
import argparse, filecmp, json, os, shutil, sys
sys.stdout.reconfigure(encoding='utf-8')
KIT = os.path.dirname(os.path.abspath(__file__))
KIT_FILES = ['run.mjs', 'run_all.py', 'qalib.py', 'quick.py', 'handover.py', 'compare.py']
GITIGNORE = '# Kết quả chạy, sinh lại được. last-green/ nên commit để cả nhóm dùng chung một mốc\nhandover/\ncurrent/\n.quick-run/\n.recheck/\n.thumbs/\n__pycache__/\n'

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
    pages = sorted(n[:-5] for n in os.listdir(site) if n.endswith('.html'))
    if not pages:
        print(f'Không có trang .html nào trong {site}.'); sys.exit(2)
    suites = []
    for p in pages:
        suites += [[f'smoke-{p}-1440', p, f'smoke-{p}', 'desktop'], [f'smoke-{p}-390', p, f'smoke-{p}', 'mobile']]
        sf = os.path.join(qa, f'steps-smoke-{p}.json')
        if not os.path.exists(sf):
            # Bộ khói: mở trang, chụp ảnh. Bộ chạy tự ghi lỗi console và tràn ngang của mọi bước
            json.dump({'steps': [{'name': 'view', 'wait': 600, 'check': 'document.title', 'shot': p, 'jpeg': True}]},
                      open(sf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    cfg = {
        'site': a.site,
        'pages': pages,
        'themes': {'default': ''},
        'sizes': {'desktop': [1440, 900, 0], 'tablet': [768, 1024, 0], 'mobile': [390, 844, 1]},
        'suites': suites,
        'noisy': [],
        'theme_switch_prefix': 'theme-',
        'preflight_kind': 'site',
        'thumbs': {'dir': 'assets/shots', 'items': []},
        'browser': '',
    }
    json.dump(cfg, open(cfg_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'tạo qa.config.json: {len(pages)} trang, {len(suites)} bộ khói (1440 và 390)')

gi = os.path.join(qa, '.gitignore')
if not os.path.exists(gi):
    open(gi, 'w', encoding='utf-8').write(GITIGNORE); print('tạo _qa/.gitignore')

rel = os.path.relpath(proto)
print(f'\nXong. Từ {rel}:\n  python _qa/handover.py run\n  python _qa/handover.py promote _qa/handover/<ngày-giờ>\n'
      '"preflight_kind" là "site" (site giới thiệu); web app thì đổi thành "app". Thêm bộ kiểm riêng vào "suites".')
