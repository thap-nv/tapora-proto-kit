# Sinh đề r8-map-lon: r7-map/sample cộng một phụ lục dữ liệu xuất từ Excel, để tổng tài liệu vượt ngưỡng đọc nguyên
# của sketch-to-map (300 KB) mà đáp án vẫn là r7-map/key.json (phụ lục không sinh chức năng nào).
#   python mk-r8.py            ghi r8-map-lon/sample/ (xoá bản cũ), in cỡ từng tài liệu và tổng
# Seed cố định: chạy lại ra đúng từng byte. Mã học viên SX-nnnn, mã biên lai BL-nnnnnn là mã của dữ liệu, không phải hệ mã yêu cầu.
import os, random, shutil, sys

sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'r7-map', 'sample')
OUT = os.path.join(HERE, 'r8-map-lon', 'sample')
R = random.Random(20261006)

HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý']
DEM = ['Minh', 'Gia', 'Bảo', 'Ngọc', 'Thanh', 'Hoài', 'Khánh', 'Anh', 'Phương', 'Đức', 'Quỳnh', 'Hải', 'Thảo', 'Tuấn']
TEN = ['An', 'Bình', 'Châu', 'Dũng', 'Giang', 'Hà', 'Khôi', 'Linh', 'My', 'Nam', 'Nhi', 'Phúc', 'Quân', 'Tâm', 'Thư', 'Vy', 'Long', 'Hân', 'Khang', 'Ngân']
CAP = ['Làm quen nước', 'Cơ bản 1', 'Cơ bản 2', 'Nâng cao']
HLV = ['Trần Văn Hùng', 'Lê Thị Mai', 'Phạm Quốc Bảo', 'Ngô Thanh Tùng', 'Đỗ Thu Hằng']
GIO = ['17:00', '17:45', '18:30', '7:00', '8:00', '9:00']
THU = ['thứ Hai · thứ Tư', 'thứ Ba · thứ Năm', 'thứ Bảy · Chủ nhật']
GOI = [(8, 960000), (12, 1380000), (24, 2640000)]

name = lambda: f'{R.choice(HO)} {R.choice(DEM)} {R.choice(TEN)}'
phone = lambda: '09' + ''.join(R.choice('0123456789') for _ in range(8))
money = lambda n: f'{n:,}'.replace(',', '.') + ' ₫'
day = lambda m: f'{R.randint(1, 28):02d}/{m:02d}/2026'

def table(head, rows):
    return '\n'.join(['| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)] + ['| ' + ' | '.join(map(str, r)) + ' |' for r in rows])

lops = [f'{c} · {t} · {g}' for c in CAP for t in THU for g in GIO[:4]]
students = []
for i in range(1, 751):
    students.append((f'SX-{i:04d}', name(), f'{R.randint(1, 28):02d}/{R.randint(1, 12):02d}/{R.randint(2012, 2021)}', name(), phone(),
                     R.choice(lops), R.randint(0, 24), day(R.randint(10, 12))))
pays = []
for i in range(1, 1051):
    n, p = R.choice(GOI)
    pays.append((day(R.randint(4, 9)), f'BL-{260000 + i:06d}', R.choice(students)[0], f'Gói {n} buổi', money(p), R.choice(['Tiền mặt', 'Chuyển khoản']), R.choice(['Lễ tân ca sáng', 'Lễ tân ca chiều'])))
pays.sort(key=lambda r: (r[0][3:5], r[0][:2]))
diem = []
for i in range(1, 951):
    s = R.choice(students)
    diem.append((day(9), s[5], s[0], R.choice(['Có mặt'] * 8 + ['Vắng có phép', 'Vắng không phép']), R.choice(HLV)))
diem.sort(key=lambda r: r[0][:2])

md = '\n\n'.join([
    '# Phụ lục dữ liệu hiện tại · Trung tâm bơi Sóng Xanh',
    '> Xuất từ file Excel đang dùng ở quầy ngày 01/10/2026, gửi kèm để làm dữ liệu mẫu cho prototype. Đây là dữ liệu, không phải yêu cầu: không thêm hay đổi chức năng nào so với các tài liệu yêu cầu.',
    '## D. Danh sách học viên đang học (750 em)',
    table(['Mã học viên', 'Họ tên', 'Ngày sinh', 'Phụ huynh', 'SĐT phụ huynh', 'Lớp', 'Buổi còn lại', 'Hạn gói'], students),
    '## E. Lịch sử thu tiền tháng 4–9/2026 (1.050 khoản)',
    table(['Ngày', 'Mã biên lai', 'Học viên', 'Gói', 'Số tiền', 'Hình thức', 'Người thu'], pays),
    '## F. Điểm danh tháng 9/2026 (trích 950 dòng)',
    table(['Ngày', 'Lớp', 'Học viên', 'Trạng thái', 'HLV'], diem),
]) + '\n'

if os.path.exists(OUT):
    shutil.rmtree(OUT)
shutil.copytree(SRC, OUT)
with open(os.path.join(OUT, 'docs', 'yeu-cau', 'PHU-LUC-DU-LIEU-SONG-XANH.md'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(md)
tot = 0
for fn in sorted(os.listdir(os.path.join(OUT, 'docs', 'yeu-cau'))):
    n = os.path.getsize(os.path.join(OUT, 'docs', 'yeu-cau', fn)); tot += n
    print(f'{n // 1024:5d} KB  {fn}')
print(f'{tot // 1024:5d} KB  tổng · ngưỡng đọc nguyên của sketch-to-map 300 KB (292 KiB)')
