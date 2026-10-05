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
- **Khai báo:** `Cấp 2 · cờ: L, T, C · vì thêm lớp phủ (sheet ở điện thoại, hộp thoại ở máy tính) mở từ hai nút giữ bánh có sẵn; quy tắc mới (tên và ít nhất một bánh bắt buộc, mẻ đã hết không chọn được); component mới; sửa site/assets/site.css dùng chung với site/_system.html` · nâng cấp giữa chừng: `không`
- **Màn hình liên quan:** `site/index.html` *(màn đầu, panel mẻ)* · `site/_system.html` *(component mới)*
- **Nguồn yêu cầu:** brief ở `DECISIONS.md` Cổng 1, dòng 3 *"Việc chính: … giữ bánh qua Zalo"*. Không trái nguồn: Giả định B1 *"Giữ bánh qua Zalo"* chỉ loại form có **nơi nhận đơn** trên web; hộp này không gửi đi đâu, chỉ soạn tin rồi mở Zalo, nên vẫn trong phạm vi site tĩnh. Cờ Y không bật. Chi tiết quy tắc lấy từ câu lệnh.
- **Mốc trước khi sửa:** mốc cuốn chiếu `_qa/current/` *(`quick.py --dry`: 0 file đổi từ lần kiểm trước, nên không chạy kiểm trước khi sửa)* · ảnh 1440 và 390 của `index` và `_system` ở `_qa/truoc/` *(4 bộ: console 0 · tràn 0 · cắt 0 · tương phản 0 · ý định 0 · FAIL 0)*
- **Lời miễn hỏi *(nếu có, nguyên văn)*:** không có
- **Câu lệnh (nguyên văn):** "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."

---

### 🛑 Cổng 1 · Vị trí & Lối vào — không hỏi: câu lệnh đã chỉ định tường minh *(SKILL.md mục 1.4)*
| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | Hai nút giữ bánh đang có: nút *Giữ bánh qua Zalo* ở màn đầu, nút *Giữ bánh mẻ X qua Zalo* trong panel mẻ | "lối vào là chính các nút giữ bánh đang có" |
| Lối vào phụ (Command Bar/Phím tắt) | Không | "không cần phím tắt hay lối vào nhanh" |
| Phân quyền / Đối tượng *(cờ Q)* | Site không có vai; cờ Q không bật | "khách nào cũng thấy" |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | Không đổi, không bỏ trường; hộp đọc `BATCHES`, `PRODUCTS`, `states` có sẵn, không lưu gì | không áp |
| Quy tắc cũ → mới *(cờ L)* | Cũ: nút giữ bánh mở thẳng `zalo.me/0909123456`, không kiểm gì. Mới: mở hộp; mẻ đã hết không chọn được; bấm từ panel một mẻ thì chọn sẵn mẻ đó; tên và ít nhất một bánh bắt buộc; nút chính chép tin soạn từ lựa chọn rồi mở Zalo | "mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó" · "Tên và ít nhất một bánh là bắt buộc." · "chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456" |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | Không bật *(xem Nguồn yêu cầu)* | không áp |

---

### 🛑 Cổng 2 · Phương án hiển thị — không hỏi: câu lệnh đã chỉ định tường minh
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án kết hợp | Dưới 768px: sheet trượt từ đáy, rộng hết màn, đầu và chân ghim, thân cuộn. Từ 768px: hộp thoại giữa màn, rộng tối đa 36rem | Sheet trong tầm ngón cái, thấy trang nền ở trên *(Fitts)*; hộp thoại giữa màn đúng thói quen trên máy tính *(Jakob)*. Nhược: một component, hai cách đặt, phải kiểm cả hai khổ | ✅ "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn" |

**Đáp án (nguyên văn):** "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn"

**Token / component mới *(cờ T)*:** người dùng duyệt nguyên văn: "được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font". Không thêm màu, font hay token: `themes.json`, `tokens.css` không đổi. Component mới, chỉ dùng token sẵn có: `.sheet` *(sheet ở điện thoại, hộp thoại ở máy tính, một component)* · `.stepper` *(ô chọn số lượng)* · thêm ba phần con cần để làm đúng câu lệnh "chọn mẻ", "nhập tên", và nút đóng: `.pick` *(ô chọn mẻ, radio)* · `.input` *(ô nhập tên)* · `.icon-btn` *(nút đóng X)*. Ba phần này hiểu là nằm trong lời duyệt "được thêm component mới … bằng token sẵn có"; nêu lại ở Cổng 3.

---

### B3 · Kiểm trước, dựng sau
- Bộ `_qa/steps-giu-banh.json`, khai ở `suites`: `tinh-nang-giu-banh-1440` *(desktop)* · `tinh-nang-giu-banh-390` *(mobile)*.
- Đỏ trước khi dựng: `python _qa/run_all.py _qa/.tdd tinh-nang-giu-banh` → mỗi khổ `21 bước · FAIL 19 · im lặng 0` *(19 bước có `check` = 19 điều tính năng phải làm được)*.
- Xanh sau khi dựng: mỗi khổ `FAIL 0 · im lặng 0`. Thêm ở B4 bước hồi quy `chep-tin-mau-cu-van-chay` *(nút Chép tin nhắn mẫu cũ dùng chung toast)*: 22 bước mỗi khổ.
- Bước phủ định *(`phu-dinh-`)*: 0 *(không có vai bị chặn)*.

### 🛑 Cổng 3 · Nghiệm thu tích hợp *(trình 05/10/2026)*
- **Các file đã sửa / tạo mới:**
  * `site/index.html` *(hai nút giữ bánh có `data-hold`; `<dialog data-hold-box>`; script hộp giữ bánh; toast có `data-toast-text`)*
  * `site/assets/site.css` *(mục Hộp giữ bánh: `.sheet`, `.icon-btn`, `.field`, `.pick`, `.stepper`, `.input`, `.hold-status`)*
  * `site/_system.html` *(mục Hộp giữ bánh với mọi trạng thái; chú thích mục Nút; ô số lượng bấm thử được)*
  * `_qa/steps-giu-banh.json` *(mới)* · `_qa/qa.config.json` *(2 bộ)*
  * `DESIGN.md` *(mục 4, 5, 6, 7, 9, Lịch sử)* · `DECISIONS.md` *(Lặp lại sau nghiệm thu)* · `BUILD-LOG.md` *(dấu mới của `index.html`)* · `FEATURE-DECISIONS.md`
  * Ảnh: `_qa/truoc/` *(trước)* · `_qa/sau/` *(sau; hộp ở `_qa/sau/tinh-nang-giu-banh-1440/` và `-390/`: `giu-banh-mo`, `giu-banh-loi`, `giu-banh-du`, `giu-banh-chep-loi`, `giu-banh-het-ngay`, `giu-banh-da-chep`)*
- **Kết quả tự kiểm hồi quy (Regression QA):**
  * So với mốc: `0` lỗi mới · `0` lỗi cũ · `0` nợ cũ *(quick lần cuối: `2 file đổi · 8 bộ (dark) · 71 bước · preflight: 2 file · 0 lỗi · 0 cảnh báo · console 0 · FAIL 0 · im lặng 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT`)*. Lần quick đầu bắt 18 dòng *cắt mới*: giờ "15:00" tràn ô chọn mẻ 3px ở khổ 320 *(mẫu chuỗi dài nhất trên `_system.html`)*; gốc: cỡ giờ cố định 22px trong ô 66px; sửa: giờ co theo bề rộng hàng ô `clamp(1rem, 6cqi, var(--text-lg))`, như hàng cửa
  * Console Errors: `0`
  * Responsive (1440 & 390): `Đạt` *(390: sheet sát đáy, rộng hết màn; 1440: hộp giữa màn, rộng 36rem; tràn 0, cắt 0)*
  * Thoát hiểm 2 chiều (Esc & Click ngoài): `Đạt` *(nút X, Esc, bấm ra ngoài; focus về đúng nút đã mở: màn đầu và panel mẻ)* · modal *(Tab không lọt ra)* · khoá cuộn trang nền
  * 5 trạng thái (Normal, Hover, Loading, Empty, Error): `Đủ` *(đang tải: nút chính `aria-busy` + `.spin` lúc chép; rỗng: chỗ xem trước có hướng dẫn; lỗi: thiếu tên, thiếu bánh, chép bị chặn)*
  * UX 12 điểm: `12/12` *(trên hộp giữ bánh và trang chủ)*
  * Phân quyền hai chiều: không có vai bị chặn *("khách nào cũng thấy")*; không chặn oan: hai lối vào mở được ở 1440 và 390
  * Hồi quy theo cờ: cờ C trên `2` trang dùng `site.css` *(index, _system: 6 bộ khói ĐẠT)* · cờ L: bộ của tính năng *(bắt buộc tên và bánh, mẻ hết tắt, chọn sẵn mẻ)* ĐẠT
  * Trạng thái QA: trước `6 bộ · 27 bước` → sau `8 bộ · 71 bước` · bẻ thử: `0 bước phủ định`
  * Ghi chú prototype đã cập nhật: `DESIGN.md` *(component, đếm bằng `grep`: `.sheet` index 1 · _system 2; `.pick` index 1 khuôn · _system 12; `.stepper` index 1 khuôn · _system 7; `.input` 1 · 2; `.icon-btn` 1 · 2; lối vào `data-hold` 2 nút trên trang, 3 chỗ trong mã: màn đầu, panel tĩnh, khuôn panel)*
- **Chỗ tự quyết khi câu lệnh chưa nói** *(theo quy tắc sẵn có, nêu để người dùng xem)*: hôm nay không còn mẻ chọn được *(hết bánh, sau 19:00, thứ Hai)* thì hộp đưa 4 mẻ của ngày mở lò kế tiếp, chọn sẵn 6:00 *(cùng quy tắc `target()`)* · mở từ màn đầu chọn sẵn mẻ mà trang đang mở panel · panel của mẻ đã hết chọn sẵn mẻ mà nút trong panel trỏ tới · tin nhắn không ghi giờ tới lấy · tối đa 20 cái mỗi loại *(giả định)* · chép bị chặn thì báo trong hộp, không mở Zalo · không lưu tên và số lượng sau F5
- **Điểm nêu thêm:** khối Tin nhắn mẫu + nút Chép trong panel mẻ còn nguyên, giờ trùng việc với hộp · tin nhắn xem trước nằm dưới mép hộp ở 1440×900 và 390×844, phải cuộn trong hộp · ghi chú cũ: `DESIGN.md` chưa ghi icon `phone` và hàng nút `.info-cta` của lần `tweak-site` thêm nút Gọi *(không tự sửa)*

**Quyết định nghiệm thu (nguyên văn):** *(chờ người dùng)*
