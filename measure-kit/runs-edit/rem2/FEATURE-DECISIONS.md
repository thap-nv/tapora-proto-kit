# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | tweak · Cấp 1 · cờ: C · vì thêm một nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa; hàng nút `.info-cta` mới trong CSS chung, theo `.hero-cta` | `site/index.html:111-114` · `site/assets/site.css:175` | Bọc nút Xem đường đi và nút mới **Gọi 0909 123 456** (`.btn-ghost`, icon `ph-phone`, `tel:+84909123456`, số trong `.num`) vào `.info-cta` *(flex, xuống dòng, gap 12px, cách trên 20px)*; bỏ `.info-side .btn{margin-top:20px}` vì khoảng cách chuyển lên hàng nút | *câu lệnh* · số 0909 123 456 là nội dung thật ở `DECISIONS.md` *(người dùng nói; "nhắn hoặc gọi 0909 123 456")* | `quick · 2 file đổi · 6 bộ (dark) · 27 bước · preflight 0 lỗi · console 0 · FAIL 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT` · `0` lỗi mới | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |

---

## Tính năng: Hộp giữ bánh — Ngày: 05/10/2026

### Bối cảnh & Mục tiêu
- **Khai báo:** `Cấp 2 · cờ: L, T, C · vì hộp giữ bánh là lớp phủ trong trang (sheet ở điện thoại, hộp thoại ở máy tính); đổi hành vi hai nút giữ bánh và thêm quy tắc chọn mẻ, bắt buộc tên và bánh (L); sheet, hộp thoại, ô số lượng, ô nhập tên chưa có trong DNA (T); sửa site.css và _system.html dùng chung (C)` · nâng cấp giữa chừng: không
- **Màn hình liên quan:** `site/index.html` *(màn đầu, section Bốn lần mở cửa lò)* · `site/_system.html`
- **Nguồn yêu cầu:** dự án không có tài liệu yêu cầu *(`DECISIONS.md`: "không có tài liệu chức năng")*: **nguồn là câu lệnh**. Phục vụ việc chính "giữ bánh qua Zalo" *(`DECISIONS.md` mục 3)*. Không trái quyết định cũ: việc giữ vẫn xảy ra trong Zalo, site không nhận đơn *(`DECISIONS.md`, Giả định B1 "Giữ bánh qua Zalo")*. Cờ Y không áp.
- **Câu lệnh (nguyên văn):** "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."
- **Mốc trước khi sửa:** mốc cuốn chiếu `_qa/current/` khớp file hiện tại *(`quick.py --dry`: không file đổi)* · ảnh mốc `_qa/truoc/` *(smoke-index, smoke-_system ở 1440, 768, 390)*: console 0 · tràn 0 · cắt 0 · tương phản 0 · ý định 0 · FAIL 0
- **Lời miễn hỏi:** không có

---

### 🛑 Cổng 1 · Vị trí & Lối vào · không đi: câu lệnh đã chỉ định tường minh
| Hạng mục | Phương án | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | Nút **Giữ bánh qua Zalo** ở màn đầu và nút **Giữ bánh mẻ X qua Zalo** trong panel mẻ mở hộp thay vì mở Zalo | "lối vào là chính các nút giữ bánh đang có" |
| Lối vào phụ (Command Bar/Phím tắt) | Không | "không cần phím tắt hay lối vào nhanh" |
| Phân quyền / Đối tượng *(cờ Q)* | Không bật: site công khai, không có vai | "khách nào cũng thấy" |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | Không bật: hộp đọc `BATCHES`, `PRODUCTS`, `states`, `target()` sẵn có, không thêm hay đổi trường | · |
| Quy tắc cũ → mới *(cờ L)* | Cũ: nút giữ bánh mở Zalo ngay; panel có tin nhắn mẫu cố định "4 bánh mì que củi" + nút Chép. Mới: nút mở hộp; mẻ đã hết không chọn được; bấm từ panel thì chọn sẵn mẻ; tên và ít nhất một bánh bắt buộc; nút chính chép tin nhắn soạn từ lựa chọn rồi mở Zalo | "Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456." |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | Không bật: dự án không có tài liệu yêu cầu | · |

**Cách hiểu ở chỗ câu lệnh không nói** *(giữ quy tắc cũ của `target()` trong `index.html`; trình ở Cổng 3)*:
- Bấm từ panel của **mẻ đã hết**: chọn sẵn mẻ mà nút đó đang ghi *(mẻ kế còn trong ngày)*, vì mẻ đã hết không chọn được.
- Bấm ở **màn đầu**: chọn sẵn mẻ mà panel mở mặc định *(đang nướng, rồi còn bánh, rồi chưa vào lò)*.
- **Hôm nay hết cả bốn mẻ** *(từ 18:25, sau giờ đóng)*: hộp liệt kê bốn mẻ **ngày mai** *(Chủ nhật: thứ Ba)*, chọn sẵn 6:00, theo quy tắc cũ "hết cả ngày thì mẻ 6:00 hôm sau". **Thứ Hai lò nghỉ**: bốn mẻ thứ Ba, như nhãn nút cũ.
- **Giờ tới lấy** trong tin nhắn: công thức cũ của tin nhắn mẫu *(giờ ra lò, hoặc giờ hiện tại nếu mẻ đã ra lò, cộng 15 phút, làm tròn 5 phút)*.
- **Số lượng** mỗi loại 0 đến 99: giới hạn của ô nhập, không phải quy tắc của tiệm.
- **Chép bị trình duyệt chặn**: hộp không đóng, báo lỗi cạnh nút, hiện nút Mở Zalo để chép tay rồi mở.
- **Tin nhắn mẫu và nút Chép trong panel mẻ**: giữ nguyên *(câu lệnh không bảo bỏ)*.

---

### 🛑 Cổng 2 · Phương án hiển thị · không đi: câu lệnh đã chỉ định tường minh
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án kết hợp | Dưới 768px: sheet trượt từ đáy, rộng hết màn, cao tối đa 92dvh. Từ 768px: hộp thoại giữa màn, rộng tối đa 33rem. Một `<dialog>` mở bằng `showModal()`; mốc 768 là mốc sẵn có của site *(`DESIGN.md` mục 6)* | Ưu: sheet đặt nút chính trong vùng ngón cái *(Fitts)*, mẫu quen trên điện thoại; hộp thoại giữ tập trung một việc *(Jakob)*. Nhược: 6 trường *(mẻ, 4 số lượng, tên)*, nhiều hơn mức dưới 5 trường của mẫu modal: thân hộp cuộn được, nút chính dính ở chân hộp | ✓ |

**Đáp án (nguyên văn):** "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn"

**Token / component mới *(cờ T)*:** không thêm token, màu hay font. Component mới dựng từ token sẵn có: hộp giữ bánh `.hold` *(sheet và hộp thoại: `--surface`, `--shadow-4`, nền `--scrim`, `--radius`)* · ô chọn mẻ `.pick` · ô số lượng `.qty` · ô nhập `.input` · lời lỗi `.field-err` *(`--danger-text`)*. Người dùng duyệt nguyên văn: "được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font". Ô nhập tên và ô chọn mẻ: hiểu là phần của hộp mà câu lệnh tả *("chọn mẻ", "nhập tên")*, cùng luật token.

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp *(trình 05/10/2026, chờ đáp án)*
- **Các file đã sửa / tạo mới:**
  * `site/index.html` *(sửa: hai lối vào `data-hold`, khung `<dialog>` hộp giữ bánh, script hộp; toast dùng chung qua `showToast()`)*
  * `site/assets/site.css` *(sửa: `.hold`, `.field`, `.pick`, `.qty`, `.input`, `.field-err`, spinner của nút chính)*
  * `site/_system.html` *(sửa: mục Hộp giữ bánh đủ trạng thái; chú thích mục Nút)*
  * `_qa/steps-giu-banh.json` *(tạo: 15 bước, 12 bước kiểm điều tính năng làm, 1 bước phủ định, 2 bước chuyển giờ)*
  * `_qa/qa.config.json` *(sửa: thêm bộ `tinh-nang-giu-banh-1440`, `-768`, `-390`)*
  * `DESIGN.md` *(sửa: mục 2, 4, 5, 9, Lịch sử)* · `FEATURE-DECISIONS.md` *(khối này)*
- **Kiểm trước, dựng sau:** chưa dựng `FAIL 12 · im lặng 0` ở cả 3 khổ *(bước phủ định qua sẵn)* → dựng xong `FAIL 0 · im lặng 0` ngay lần đầu.
- **Kết quả tự kiểm hồi quy (Regression QA):**
  * So với mốc: `0` lỗi mới · `0` lỗi cũ *(mốc sạch)*. Lần kiểm đầu `cắt mới 18` *(giờ "15:00", "17:30" tràn 5–6px khỏi ô chọn mẻ ở mẫu khổ 320 của `_system.html`)*: sửa ở gốc, cỡ giờ co theo `cqi` như ô cửa vòm; kèm sửa lề 8px dưới nhãn "Bánh và số lượng" thấy trên ảnh.
  * Dòng cuối lệnh kiểm: `quick · 4 file đổi · 9 bộ (dark) · 72 bước · preflight: 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site · console 0 · FAIL 0 · im lặng 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT, đã lưu mốc current`
  * Console Errors: `0`
  * Responsive (1440 & 390, thêm 768): `Đạt` *(1440, 768: hộp thoại giữa màn rộng 33rem; 390: sheet sát đáy rộng hết màn, bước `kieu-sheet-hop-thoai` đo)*
  * Thoát hiểm 2 chiều: `Đạt` *(nút Đóng, Esc, bấm nền; focus về nút đã mở: bước `thoat-esc`, `thoat-nen`, `nut-dong`)* · khoá focus: `showModal()` làm nền trơ · khoá cuộn nền: `site.css:193`
  * 5 trạng thái: `Đủ` *(bình thường · hover/nhấn/focus · đang chép `aria-busy` + spinner · rỗng: khung tin nhắn có lời nhắn, hết cả ngày và thứ Hai có ghi chú · lỗi tại chỗ: thiếu bánh, thiếu tên, chép bị chặn)*
  * UX 12 điểm: `12/12` *(bằng chứng ở báo cáo Cổng 3; ghi chú: ở 1440×900 khung tin nhắn nằm dưới mép thân hộp, phải cuộn trong hộp)*
  * Phân quyền hai chiều: `Đạt` *(không có vai; "khách nào cũng thấy": hai lối vào mở được ở mọi giờ thử, bước 1, 4, 6, 8, 13, 15)* · không thêm trang
  * Hồi quy theo cờ: cờ C trên `2` trang dùng `site.css` *(index, _system: 6 bộ khói ở 3 khổ đạt)* · cờ L: bộ tính năng 12 bước + bẻ thử
  * Trạng thái QA: bộ tính năng trước `FAIL 12` → sau `FAIL 0` · bẻ thử *(bỏ `disabled` của mẻ đã hết, 1 chỗ)*: `kêu ✓` *(`FAIL 5`, có `phu-dinh-me-het-khong-chon`)*, trả lại: `FAIL 0`
  * Số chỗ dùng component *(`grep`)*: `.pick-opt` index 1 *(khuôn, ra 4 ô)* · _system 8 · `.qty-btn` index 2 *(khuôn, ra 8 nút)* · _system 10 · `.input` index 1 · _system 2 · `.field-err` index 2 · _system 2 · `.spin` index 1 · _system 3
- **Đáp án Cổng 3 (nguyên văn):** *chờ người dùng*
