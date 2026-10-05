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
- **Khai báo:** `Cấp 2 · cờ: L, T, C · vì thêm lớp phủ mới (hộp giữ bánh: sheet ở điện thoại, hộp thoại ở máy tính); đổi quy tắc (tên và ít nhất một bánh bắt buộc, mẻ đã hết không chọn được, nút giữ bánh mở hộp thay vì mở Zalo); thêm component chưa có trong DNA; sửa site.css dùng chung cho 2 trang` · nâng cấp giữa chừng: `không`
- **Cờ không bật:** Q *(site không có vai; câu lệnh: "khách nào cũng thấy")* · D *(không thêm, đổi hay bỏ trường; lựa chọn trong hộp chỉ sống trong trang, không lưu)* · Y *(có trong nguồn, xem dưới)*
- **Màn hình liên quan:** `site/index.html` *(màn đầu, panel mẻ)* · `site/_system.html` *(component mới)*
- **Nguồn yêu cầu:** brief ở `DECISIONS.md` Cổng 1, việc chính 3 "giữ bánh qua Zalo" *(người dùng nói)* · `DECISIONS.md` Giả định B1, dòng "Giữ bánh qua Zalo": nhánh "khách điền form giữ bánh trên web (tên, số lượng, mẻ)". Bản này vẫn gửi qua Zalo, không cần nơi nhận đơn, nên không ra khỏi phạm vi site tĩnh · quy tắc chi tiết: câu lệnh 05/10/2026
- **Mốc trước khi sửa:** mốc cuốn chiếu `_qa/current/` *(`quick.py --dry`: 0 file đổi từ lần kiểm trước, không chạy lại)* · ảnh 1440, 768, 390 của `index` và `_system` ở `_qa/truoc/` *(6 bộ: console 0 · FAIL 0 · tràn 0 · cắt 0 · tương phản 0 · ý định 0)*
- **Lời miễn hỏi *(nếu có, nguyên văn)*:** không có
- **Câu lệnh (nguyên văn):** "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."

---

### 🛑 Cổng 1 · Vị trí & Lối vào
Không dừng hỏi: câu lệnh đã chỉ định tường minh cả ba câu và câu của cờ L *(SKILL.md mục 1.4)*.

| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | Hai nút giữ bánh đang có: nút chính màn đầu và nút trong panel mẻ | "lối vào là chính các nút giữ bánh đang có" |
| Lối vào phụ (Command Bar/Phím tắt) | Không *(site không có thanh lệnh hay phím tắt)* | "không cần phím tắt hay lối vào nhanh" |
| Phân quyền / Đối tượng *(cờ Q)* | Mọi khách *(site không có vai)* | "khách nào cũng thấy" |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | không bật | · |
| Quy tắc cũ → mới *(cờ L)* | Cũ: nút giữ bánh mở thẳng `zalo.me/0909123456`, khách tự sửa tin nhắn mẫu. Mới: nút mở hộp; mẻ đã hết không chọn được; bấm từ panel thì chọn sẵn mẻ; tên và ít nhất một bánh bắt buộc; nút chính chép tin nhắn soạn từ lựa chọn rồi mở Zalo | "mở hộp giữ bánh thay vì mở Zalo ngay" · "mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó" · "Tên và ít nhất một bánh là bắt buộc" · "chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456" |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | không bật | · |

**Cách hiểu, giữ quy tắc sẵn có** *(không phải quy tắc mới; nêu lại ở Cổng 3)*:
- "Chọn sẵn mẻ đó" = mẻ mà nút trong panel đang ghi. Panel của mẻ đã hết vốn ghi mẻ kế *(hàm `target()`: "mẻ đã hết thì trỏ mẻ kế còn trong ngày, hết cả ngày thì mẻ 6:00 hôm sau")*, nên hộp chọn sẵn mẻ kế đó, không chọn mẻ đã hết.
- Nút màn đầu chọn sẵn mẻ mà trang mở sẵn ở panel *(mẻ đang nướng, còn bánh hoặc chưa vào lò sớm nhất)*.
- Hết cả bốn mẻ trong ngày *(sau giờ hết mẻ cuối, sau 19:00)*: thêm một lựa chọn "6:00 sáng mai" *(Chủ nhật: "sáng thứ Ba")*, như nút giữ bánh hiện nay. Thứ Hai lò nghỉ: bốn mẻ chọn được, giữ cho thứ Ba, như panel hiện nay.
- Giờ tới lấy trong tin nhắn: công thức sẵn có của tin nhắn mẫu *(15 phút sau giờ ra lò hoặc giờ hiện tại, làm tròn 5 phút)*.

---

### 🛑 Cổng 2 · Phương án hiển thị
Không dừng hỏi: câu lệnh đã chỉ định phương án và câu của cờ T.

| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án A | Sheet trượt từ đáy ở mọi khổ | Ngón cái với tới nút chính ở điện thoại; trên 1440 sheet rộng hết màn, mắt phải đi xa | · |
| Phương án B | Hộp thoại giữa màn ở mọi khổ | Tập trung, quen ở máy tính; ở 390 nút chính nằm giữa màn, xa ngón cái | · |
| Phương án kết hợp | Một `<dialog>`: dưới 768px là sheet trượt từ đáy, từ 768px là hộp thoại giữa màn | Đúng thói quen từng thiết bị *(Jakob)*, nút chính ở vùng ngón cái trên điện thoại *(Fitts)* | ✅ |

**Đáp án (nguyên văn):** "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn"

**Token / component mới *(cờ T)*:** không thêm token, màu, font. Component mới dựng từ token sẵn có, vào `site/assets/site.css` và `site/_system.html`, ghi `DESIGN.md` mục 5: `.sheet` *(sheet ở điện thoại, hộp thoại ở máy tính)* · `.qty` *(ô chọn số lượng)* · `.choice` *(ô chọn mẻ)* · `.field` *(ô nhập tên kèm lỗi)*. Người dùng duyệt nguyên văn: "được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font." *(Ô chọn mẻ và ô nhập tên không có trong ngoặc nhưng hộp cần chúng theo chính câu lệnh "chọn mẻ", "nhập tên"; hiểu là cùng lời duyệt, nêu lại ở Cổng 3.)*

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp *(trình 05/10/2026)*
- **Các file đã sửa / tạo mới:**
  * `site/index.html` *(hai lối vào `[data-hold]`, `<dialog class="sheet">`, script hộp; tách `pickup()` dùng chung cho tin nhắn mẫu cũ và tin nhắn của hộp, kết quả tin nhắn mẫu không đổi)*
  * `site/assets/site.css` *(component `.sheet`, `.btn-icon`, `.hold-status`, `.choice`, `.hold-items`, `.qty`, `.field`, `.field-err`; khoá cuộn `html:has(.sheet[open])`)*
  * `site/_system.html` *(mục Hộp giữ bánh: 2 hộp mẫu đủ trạng thái)*
  * `_qa/steps-giu-banh.json` *(mới, 29 bước)* · `_qa/qa.config.json` *(thêm bộ `tinh-nang-giu-banh-1440`, `tinh-nang-giu-banh-390`)*
  * `DESIGN.md` *(mục 4 icon, mục 5, mục 9, Lịch sử)* · `BUILD-LOG.md` *(dòng Trang chủ: dấu a4b9175450, preflight 0 lỗi)* · `FEATURE-DECISIONS.md`
  * `_qa/run_all.py`, `_qa/quick.py`, `_qa/handover.py`: `qa_init.py --update` ở B1 chép đè bằng bản của kit đang dùng
- **Kết quả tự kiểm hồi quy:**
  * So với mốc *(quick.py, mốc cuốn chiếu)*: `0` lỗi mới · `0` lỗi QA cũ · lần 1: `4 file đổi · 8 bộ (dark) · 81 bước · preflight 2 file 0 lỗi 0 cảnh báo · console 0 · FAIL 0 · im lặng 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT` · lần 2 *(sau khi thêm 2 bước nhóm A)*: `1 file đổi · 2 bộ · 58 bước · … → ĐẠT`
  * Console Errors: `0`
  * Responsive: 1440 hộp thoại giữa màn rộng 576px, 390 sheet sát đáy rộng hết màn, nút chính trong khung nhìn ở cả hai *(bước `bo-cuc-theo-kho`)*; bộ khói 768 vẫn sạch · `Đạt`
  * Thoát hiểm 2 chiều (Esc, bấm nền, nút X; focus về đúng nút đã mở, kể cả nút trong panel): `Đạt`
  * 5 trạng thái: mặc định · hover/nhấn/focus *(CSS)* · đang chép *(`aria-busy` + `.spin`)* · rỗng *(khung tin nhắn hướng dẫn)* · lỗi *(thiếu tên, thiếu bánh, chép bị chặn)*: `Đủ`
  * UX 12 điểm: `12/12`
  * Phân quyền hai chiều: site không có vai; "khách nào cũng thấy": cả hai lối vào mở hộp *(bước `mo-tu-man-dau`, `mo-tu-khung-me`)*, không vai nào cần chặn
  * Hồi quy theo cờ: cờ C trên `2/2` trang nạp `site.css` *(index, _system)*, 0 lỗi mới
  * Trạng thái QA: trước 6 bộ · 27 bước → sau 8 bộ · 85 bước · bộ tính năng thấy đỏ trước khi dựng `FAIL 24` *(bằng số bước có check)* `im lặng 0` → xanh `FAIL 0 im lặng 0` · bẻ thử `phu-dinh-thieu-khong-chep`: 1 chỗ bẻ, kêu ✓ ở 1440 và 390, trả lại im ✓
  * Ghi chú prototype đã cập nhật: `DESIGN.md`, `BUILD-LOG.md`
- **Giả định đưa lên cổng:** tối đa 20 mỗi loại bánh · tên và số lượng giữ lại khi đóng rồi mở lại hộp trong cùng trang, mất khi tải lại *(không lưu)* · chép bị chặn thì không tự mở Zalo, hiện nút Mở Zalo · chép được thì mở Zalo và vẫn hiện nút "Zalo chưa mở? Mở Zalo" · không có JS thì hai nút vẫn mở thẳng Zalo như cũ
- **Nợ cũ, không tự sửa:** `BUILD-LOG.md` chưa ghi dấu sau lần `tweak-site` thêm nút Gọi *(f7885bf4bf, đã ghi kèm vào dòng)* · `DESIGN.md` mục 4 chưa có icon `phone` của lần đó

**Quyết định nghiệm thu (nguyên văn):** *(chờ người dùng)*
