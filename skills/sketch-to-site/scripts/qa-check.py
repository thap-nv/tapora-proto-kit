# Kiểm tổng trong một lệnh: B4 của sketch-to-site, B3 của handover-check.
#   python <skills>/sketch-to-site/scripts/qa-check.py <thư-mục-prototype> [--site site]
# 1. Bộ kiểm: chưa có _qa/qa.config.json thì cài mới (templates/qa-kit/qa_init.py), kể cả khi thư mục _qa/ đã có sẵn;
#    có rồi thì chép đè script bằng bản của kit (qa_init.py --update). In dòng cấu hình và các CẢNH BÁO của qa_init.py.
# 2. python _qa/handover.py run: preflight, mọi bộ ở mọi theme (trang web chụp hết trang theo từng màn), lượt kiểm sâu, so với mốc.
#    In các dòng số và kết luận; mỗi danh sách tối đa 15 dòng, đủ danh sách ở handover.json của lần chạy.
# 3. Liệt kê ảnh của lần chạy theo theme và bộ, để mở cùng một lượt.
# Thoát 0 khi sạch, 1 khi còn lỗi (theo handover.py), 2 khi thiếu thư mục trang, 4 khi không có trình duyệt.
import argparse, os, re, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
QA_INIT = os.path.join(os.path.dirname(HERE), 'templates', 'qa-kit', 'qa_init.py')
MAX = 15
ENV = dict(os.environ, PYTHONIOENCODING='utf-8')
NOTE = ('CẢNH BÁO', 'themes.json có theme chưa khai', 'Có site/_system.html mà', 'Nền tối bật bằng', 'màn app mobile')

ap = argparse.ArgumentParser()
ap.add_argument('prototype')
ap.add_argument('--site', default='site')
a = ap.parse_args()
proto = os.path.abspath(a.prototype)
fwd = lambda p: p.replace('\\', '/')

# 1. Cài hoặc cập nhật bộ kiểm. Quyết theo qa.config.json, không theo thư mục _qa/: thư mục đó có thể chỉ chứa ảnh chụp tay
fresh = not os.path.exists(os.path.join(proto, '_qa', 'qa.config.json'))
init = subprocess.run([sys.executable, QA_INIT, proto, '--site', a.site] + ([] if fresh else ['--update']),
                      capture_output=True, text=True, encoding='utf-8', env=ENV)
lines = (init.stdout + init.stderr).splitlines()
if init.returncode != 0:
    print('\n'.join(lines[-MAX:]))
    sys.exit(2)
if fresh:
    made = next((l for l in lines if l.startswith('tạo qa.config.json: ')), '')
    print('Bộ kiểm: cài mới · ' + made[len('tạo qa.config.json: '):])
else:
    print(f'Bộ kiểm: đã có, cập nhật script ({sum(l.startswith("chép đè") for l in lines)} file chép đè; qa.config.json, file bước, mốc giữ nguyên)')
for l in lines:
    if l.startswith(NOTE):
        print('  ' + l)

# 2. handover.py run
run = subprocess.run([sys.executable, os.path.join('_qa', 'handover.py'), 'run'], cwd=proto,
                     capture_output=True, text=True, encoding='utf-8', env=ENV)
out = (run.stdout + run.stderr).splitlines()
browser = next((l for l in out if 'Không tìm thấy Edge' in l), None)
if browser:
    print(browser.strip())
    sys.exit(4)
run_dir = next((fwd(l.split(': ', 1)[1]) for l in out if l.startswith('Thư mục chạy: ')), '')
detail = []


def flush():
    # Dòng thụt lề thuộc dòng tiêu đề đứng trên nó (Lỗi, Nợ cũ, File đổi…): in tối đa MAX dòng
    for l in detail[:MAX]:
        print(l)
    if len(detail) > MAX:
        print(f'  … còn {len(detail) - MAX} dòng: đủ ở {run_dir}/handover.json')
    detail.clear()


for l in out:
    if not l.strip():
        continue
    if l.startswith('  '):
        detail.append(l)
        continue
    flush()
    if l.startswith('Thư mục chạy'):
        l = fwd(l)
    elif l.startswith('preflight:'):
        l = re.sub(r'  \([^)]*preflight\.py\)$', '', l)  # bỏ đường dẫn tới preflight.py
    print(l)
flush()

# 3. Ảnh của lần chạy: <thư mục chạy>/<theme>/<bộ>/<ảnh>. In đường dẫn tuyệt đối của thư mục và tên từng ảnh theo thứ tự màn, lát kèm
#    tiêu đề trong lát, bằng shot_lines của bộ kiểm trong dự án (vừa cập nhật ở bước 1), để mở thẳng đúng ảnh bằng Read.
#    Đo 4.5: in dải "index-2.jpg … index.jpg" nên cả hai lần B4 phải thêm một lượt ls; đo ba skill sửa: không nói lát nào chứa gì, mở nhầm lát.
root = os.path.join(proto, run_dir) if run_dir else ''
if root and os.path.isdir(root):
    sys.path.insert(0, os.path.join(proto, '_qa'))
    import run_all
    dirs = [f'{th}/{suite}' for th in sorted(d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d)))
            for suite in sorted(os.listdir(os.path.join(root, th))) if os.path.isdir(os.path.join(root, th, suite))]
    for l in run_all.shot_lines(root, dirs):
        print(l)
sys.exit(run.returncode)
