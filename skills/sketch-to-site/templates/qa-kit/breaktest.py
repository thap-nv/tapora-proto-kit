# Bẻ thử bước phủ định của bộ kiểm tính năng trong một lệnh (evolve-site B4 bước 9, regression-qa.md mục 3).
# Chạy từ thư mục prototype (thư mục chứa _qa/):
#   python _qa/breaktest.py <lọc bộ> <file> "<chuỗi cũ>" "<chuỗi mới>"
#   ví dụ: python _qa/breaktest.py tinh-nang-giu-banh site/index.html "(gone ? ' disabled' : '')" "''"
# Lệnh tạm thay mọi chỗ <chuỗi cũ> trong <file> bằng <chuỗi mới>, chạy các bộ có <lọc bộ> trong tên, trả file lại đúng từng byte,
# rồi chạy lại các bộ đó. Bộ phải kêu khi bẻ (FAIL > 0) và im khi trả lại (FAIL 0, im lặng 0).
# In số chỗ đã bẻ, dòng của từng bộ ở hai lần chạy (như run_all.py), rồi kết luận. Bẻ 0 chỗ thì không chạy:
# một phép bẻ không thay được gì trông giống hệt một phép thử đạt.
# Thoát 0 khi bắt được và trả lại im, 1 khi không bắt được hay trả lại vẫn kêu, 2 khi sai tham số, bẻ 0 chỗ hay không có bộ nào khớp.
# Kết quả ở _qa/.recheck/breaktest/ (khi-be/, tra-lai/); bản gốc của file nằm ở đó (<tên file>.goc) cho tới khi trả lại xong.
import os, shutil, sys
from concurrent.futures import ThreadPoolExecutor
import run_all

sys.stdout.reconfigure(encoding='utf-8')
if len(sys.argv) != 5:
    print('Cách gọi: python _qa/breaktest.py <lọc bộ> <file> "<chuỗi cũ>" "<chuỗi mới>"')
    sys.exit(2)
flt, rel, old, new = sys.argv[1:]
todo = [s for s in run_all.SUITES if flt in s[0]]
if not todo:
    print(f'Không có bộ nào có "{flt}" trong tên ("suites" trong qa.config.json).')
    sys.exit(2)
path = os.path.abspath(rel)
if not os.path.isfile(path):
    print(f'Không thấy file {rel} (đường dẫn tính từ thư mục prototype).')
    sys.exit(2)
raw = open(path, 'rb').read()
text = raw.decode('utf-8')
n = text.count(old)
if n == 0:
    print(f'Bẻ 0 chỗ trong {rel}: chuỗi cũ không có trong file. Không chạy.')
    sys.exit(2)

out = os.path.join(run_all.HERE, '.recheck', 'breaktest')
shutil.rmtree(out, ignore_errors=True)
os.makedirs(out)
bak = os.path.join(out, os.path.basename(path) + '.goc')
open(bak, 'wb').write(raw)


def run_set(sub):
    with ThreadPoolExecutor(4) as ex:
        return [(name, r) for name, r in ex.map(lambda s: run_all.run(s, os.path.join(out, sub)), todo) if r is not None]


print(f'Bẻ {n} chỗ trong {rel}')
with run_all.shared_browser():
    try:
        open(path, 'wb').write(text.replace(old, new).encode('utf-8'))
        broke = run_set('khi-be')
    finally:
        open(path, 'wb').write(raw)
    same = open(path, 'rb').read() == raw
    if same:
        os.remove(bak)
    back = run_set('tra-lai')

print('Khi bẻ:')
for name, r in broke:
    print('  ' + run_all.summary_line(name, r))
print('Sau khi trả lại (file khớp bản gốc):' if same else f'Sau khi trả lại: FILE KHÁC BẢN GỐC, bản gốc ở {bak.replace(os.sep, "/")}')
for name, r in back:
    print('  ' + run_all.summary_line(name, r))

ok = lambda res: [r for _, r in res if 'crash' not in r]
steps = lambda res: list(dict.fromkeys(f.split(':')[0] for r in ok(res) for f in r['fails'] + r['silent']))
caught, loud = steps(broke), steps(back)
nb = sum(len(r['fails']) for r in ok(broke))
na = sum(len(r['fails']) + len(r['silent']) for r in ok(back))
if len(ok(broke)) < len(broke) or len(ok(back)) < len(back):
    print('Kết luận: LỖI CHẠY · xem dòng LỖI CHẠY ở trên rồi chạy lại')
    sys.exit(1)
if not same or loud:
    print(f'Kết luận: TRẢ LẠI VẪN KÊU · FAIL {na} ({", ".join(loud)}): file chưa trả đúng hay bước không ổn định giữa các lần chạy'
          if same else 'Kết luận: FILE CHƯA TRẢ LẠI ĐÚNG · chép bản gốc ở dòng trên đè lên file')
    sys.exit(1)
if not caught:
    print('Kết luận: KHÔNG BẮT ĐƯỢC · khi bẻ FAIL 0: bước phủ định không canh chỗ vừa bẻ')
    sys.exit(1)
print(f'Kết luận: BẮT ĐƯỢC · khi bẻ FAIL {nb} ({", ".join(caught)}), trả lại FAIL 0')
