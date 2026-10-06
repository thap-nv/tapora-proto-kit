# Sinh đề r9-map-lon2: r8-map-lon/sample (7 tài liệu thật 48 KB + phụ lục dữ liệu 328 KB) cộng hai tài liệu yêu cầu thật,
# dài, để PHẦN YÊU CẦU (không tính phụ lục dữ liệu) vượt ngưỡng đọc nguyên 300 KB của sketch-to-map, nên phải chia worker.
# Đáp án vẫn là r7-map/key.json: hai tài liệu mới chỉ viết tiêu chí nghiệm thu và kịch bản kiểm thử cho 43 chức năng đã có,
# không thêm chức năng, không nhắc N1–N4 (tự đổi lịch, chống thu trùng, mất mạng, thanh toán online).
#   python mk-r9.py            ghi r9-map-lon2/sample/ (xoá bản cũ), in cỡ từng tài liệu và tổng
# Seed cố định: chạy lại ra đúng từng byte. Chạy mk-r8.py trước nếu r8-map-lon/sample chưa có.
# Giới hạn: văn bản sinh từ khuôn nên lặp cấu trúc; nó kiểm cách chia worker và chi phí đọc 350 KB yêu cầu, không kiểm
# khả năng tìm bẫy mới trong văn bản dày (mọi bẫy vẫn nằm ở 7 tài liệu gốc).
import json, os, random, shutil, sys

sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'r8-map-lon', 'sample')
OUT = os.path.join(HERE, 'r9-map-lon2', 'sample')
KEY = os.path.join(HERE, 'r7-map', 'key.json')
R = random.Random(20261007)

MODULE_TEN = {'hoc-vien': 'Học viên và phụ huynh', 'lop': 'Khoá học và lớp', 'lich': 'Lịch và buổi học', 'diem-danh': 'Điểm danh',
              'goi': 'Gói học và tiền', 'thong-bao': 'Thông báo', 'bao-cao': 'Báo cáo', 'quan-tri': 'Quản trị và quyền'}
VAI = {'hoc-vien': ['lễ tân', 'quản lý', 'phụ huynh'], 'lop': ['lễ tân', 'quản lý'], 'lich': ['lễ tân', 'huấn luyện viên', 'quản lý', 'phụ huynh'],
       'diem-danh': ['huấn luyện viên', 'quản lý'], 'goi': ['lễ tân', 'quản lý', 'phụ huynh'], 'thong-bao': ['lễ tân', 'quản lý', 'phụ huynh'],
       'bao-cao': ['quản lý'], 'quan-tri': ['quản lý', 'lễ tân']}
TRUONG = {'hoc-vien': ['họ tên', 'ngày sinh', 'số điện thoại phụ huynh', 'ghi chú sức khoẻ', 'cấp độ hiện tại'],
          'lop': ['cấp độ', 'khung giờ', 'huấn luyện viên', 'bể và làn', 'sĩ số tối đa'],
          'lich': ['ngày học', 'giờ bắt đầu', 'lớp', 'huấn luyện viên', 'bể và làn'],
          'diem-danh': ['trạng thái có mặt', 'lý do vắng', 'giờ ghi', 'người ghi', 'lớp'],
          'goi': ['số buổi', 'hạn dùng', 'số tiền', 'hình thức thanh toán', 'số buổi còn lại'],
          'thong-bao': ['nội dung', 'nhóm nhận', 'thời điểm gửi', 'tiêu đề', 'kênh nhận'],
          'bao-cao': ['khoảng ngày', 'lớp', 'huấn luyện viên', 'gói học', 'cấp độ'],
          'quan-tri': ['vai trò', 'quyền', 'tên đăng nhập', 'trạng thái tài khoản', 'số điện thoại']}
NGAY = ['ngày 29/02 của năm không nhuận', 'đúng 00:00 sáng thứ Hai', 'ngày lễ đã khai trong danh sách nghỉ', 'buổi cuối của tháng',
        'giờ cao điểm 17:00 đến 19:00', 'ngay sau 23:00', 'buổi đầu tiên của gói', 'buổi cuối cùng của gói']
SO = ['0', '1', '6 (sĩ số tối đa của lớp Làm quen nước)', '10 (sĩ số tối đa của lớp khác)', '24 (gói lớn nhất)', 'âm', 'có phần thập phân', '9999']
NGUOI = ['hai lễ tân thao tác cùng lúc', 'một lễ tân mở hai tab', 'quản lý và lễ tân cùng sửa một dòng', 'huấn luyện viên đổi sang lớp khác giữa chừng']

# Khuôn kịch bản. {f} tên chức năng, {v} vai, {t} trường, {t2} trường khác, {n} ngày, {s} số, {p} nhiều người, {c} mã nguồn.
KHUON = [
    'Đường chính. Khi {v} làm "{f}" với đủ {t} và {t2} hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ {v} vừa đứng.',
    'Thiếu {t}. {v} bỏ trống {t} rồi bấm lưu: hệ thống không lưu, tô đỏ ô {t}, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.',
    'Sai khuôn dạng. {v} nhập {t} sai khuôn dạng ở "{f}": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.',
    'Giá trị biên. Với {t2} bằng {s}, "{f}" xử lý đúng theo quy tắc ở {c}: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.',
    'Ngày đặc biệt. Khi thao tác rơi vào {n}, "{f}" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.',
    'Quyền. Chỉ {v} và các vai được ma trận quyền cho phép mới thấy nút của "{f}"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.',
    'Xác nhận trước việc khó hoàn lại. Trước khi "{f}" thay đổi {t} đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.',
    'Hai người cùng làm. Khi {p} ở "{f}", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của {t} và tự chọn giữ bản của mình hay lấy bản mới.',
    'Danh sách rỗng. Khi chưa có dữ liệu nào để "{f}", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho {v}, không để bảng trắng.',
    'Dữ liệu dài. Khi {t} dài hơn chỗ hiển thị, "{f}" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.',
    'Tìm và lọc. {v} gõ một phần {t} không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "{f}".',
    'Trên điện thoại. Ở màn hẹp 390 px, "{f}" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, {t} đọc được không phải kéo ngang.',
    'Thứ tự việc. "{f}" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo {c}.',
    'Giữ lịch sử. Sau khi "{f}" đổi {t}, bản ghi giữ giá trị cũ để đối chiếu, và {v} có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.',
    'Hiển thị cho từng vai. Cùng một bản ghi của "{f}", {v} thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.',
    'Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "{f}" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như {c} trên màn hình.',
    'Lùi một bước. Trong lúc làm "{f}", {v} bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.',
    'Bàn phím. Làm được toàn bộ "{f}" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.',
    'Thời gian chờ. Khi "{f}" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.',
    'Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "{f}" thì thấy đúng từng giá trị của {t} và {t2}, không bị đổi định dạng hay múi giờ.',
    'Gộp với việc liên quan. Khi "{f}" làm đổi {t}, các màn đang hiển thị {t} cập nhật theo ở lần mở kế tiếp, không cần {v} tải lại trang bằng tay.',
    'Giải thích kết quả. Khi "{f}" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc {v} có thể làm tiếp, theo {c}.',
    'Số liệu đi kèm. Con số hiển thị trong "{f}" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.',
    'Đối chiếu với dữ liệu hiện có. Khi mở "{f}" lần đầu sau khi nhập dữ liệu cũ, {t} của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu {t2}.',
]

feats = json.load(open(KEY, encoding='utf-8'))['features']
for f in feats:
    f['mod'] = f['module']


def mo_ta(f):
    src = ', '.join(s for s in f['src'] if s[:2] in ('UC', 'BR', 'YC', 'XD', 'A-', 'M-', 'S-', 'NF', 'CO', 'W-'))
    return src or 'các tài liệu yêu cầu'


def doc(ten, fs, so_kb, intro):
    out = [f'# {ten} · Trung tâm bơi Sóng Xanh', intro, '## Quy ước',
           'Mỗi chức năng một mục. Mỗi kịch bản là một đoạn văn: tình huống, rồi kết quả phải thấy. Kịch bản không thay quy tắc: khi lệch với `BUSINESS-RULES-SONG-XANH.md`, `EDGE-CASES-SONG-XANH.md` hay `XUNG-DOT-SONG-XANH.md`, các tài liệu đó thắng. Mã `UC-`, `BR-`, `YC-`, `XD-` trỏ về tài liệu gốc.']
    mods = []
    for f in fs:
        if f['mod'] not in mods:
            mods.append(f['mod'])
    n = 0
    for m in mods:
        n += 1
        out.append(f'## {n}. {MODULE_TEN[m]}')
        for f in [x for x in fs if x['mod'] == m]:
            src = mo_ta(f)
            out.append(f'### {f["name"]}')
            out.append(f'Căn cứ: {src}. Vai liên quan: {", ".join(VAI[m])}.')
            ks = []
            while len(ks) < so_kb:
                b = KHUON[:]
                R.shuffle(b)
                ks += b
            for i, k in enumerate(ks[:so_kb], 1):
                t, t2 = R.sample(TRUONG[m], 2)
                out.append(f'{i}. ' + k.format(f=f['name'].lower(), v=R.choice(VAI[m]), t=t, t2=t2, n=R.choice(NGAY), s=R.choice(SO),
                                                p=R.choice(NGUOI), c=src.split(',')[0]))
    return '\n\n'.join(out) + '\n'


A = [f for f in feats if f['id'] <= 'K22']
B = [f for f in feats if f['id'] > 'K22']
docs = {
    'TIEU-CHI-NGHIEM-THU-SONG-XANH.md': doc('Tiêu chí nghiệm thu', A, 36,
        '> Ngày: 2026-09-26 · Viết cho nhóm kiểm thử và chủ trung tâm duyệt từng chức năng của 22 chức năng đầu (học viên, lớp, lịch, điểm danh).'),
    'KICH-BAN-KIEM-THU-SONG-XANH.md': doc('Kịch bản kiểm thử chi tiết', B, 36,
        '> Ngày: 2026-09-28 · Viết cho nhóm kiểm thử, phần 21 chức năng sau (gói học, thông báo, báo cáo, quản trị, phần mở rộng).'),
}

if not os.path.isdir(SRC):
    sys.exit('Chưa có r8-map-lon/sample: chạy mk-r8.py trước')
if os.path.exists(OUT):
    shutil.rmtree(OUT)
shutil.copytree(SRC, OUT)
for fn, txt in docs.items():
    with open(os.path.join(OUT, 'docs', 'yeu-cau', fn), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(txt)
tot = real = 0
for fn in sorted(os.listdir(os.path.join(OUT, 'docs', 'yeu-cau'))):
    n = os.path.getsize(os.path.join(OUT, 'docs', 'yeu-cau', fn)); tot += n
    if not fn.startswith('PHU-LUC'):
        real += n
    print(f'{n / 1024:7.1f} KB  {fn}')
print(f'{tot / 1024:7.1f} KB  tổng · {real / 1024:.1f} KB không tính phụ lục dữ liệu · ngưỡng đọc nguyên 300 KB')
