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
- **Khai báo:** `Cấp 2 · cờ: L, T, C · vì thêm lớp phủ (sheet ở điện thoại, hộp thoại ở máy tính) thay hành vi hai nút giữ bánh; quy tắc mới (mẻ đã hết không chọn được, tên và ít nhất một bánh bắt buộc, tin nhắn soạn từ lựa chọn); component mới; sửa site.css dùng chung cho index.html và _system.html` · nâng cấp giữa chừng: `không`
- **Màn hình liên quan:** `site/index.html` *(màn đầu; section Bốn lần mở cửa lò)* · `site/_system.html` *(component mới)*
- **Nguồn yêu cầu:** dự án không có tài liệu yêu cầu *(`docs/` chỉ có prototype; `DECISIONS.md`: "không có tài liệu chức năng")*: **nguồn là câu lệnh**. Tính năng phục vụ việc chính "đặt giữ bánh qua Zalo" của brief *(`DECISIONS.md` mục Việc chính)*. Không trái quyết định cũ: `DECISIONS.md` dòng *Giữ bánh qua Zalo (B1)* ghi form giữ bánh trên web "ra khỏi phạm vi site tĩnh" vì cần nơi nhận đơn; hộp này không nhận đơn, chỉ soạn tin nhắn rồi mở Zalo, việc giữ vẫn xảy ra trong Zalo.
- **Mốc trước khi sửa:** `_qa/truoc/` *(`run_all.py`: smoke-index, smoke-_system ở 1440, 768, 390)* · QA: `0` lỗi có sẵn *(6 bộ: console 0, tràn 0, cắt 0, tương phản 0, ý định 0, FAIL 0)* · trạng thái QA: mặc định 8:40 + 5 trạng thái giờ (`qa-states`) · mốc cuốn chiếu `_qa/current/` khớp file hiện tại *(`quick.py --dry`: "File đổi từ lần kiểm trước: không")*
- **Lời miễn hỏi:** không có.
- **Câu lệnh (nguyên văn):** "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."

---

### 🛑 Cổng 1 · Vị trí & Lối vào — **không hỏi: câu lệnh đã chỉ định** *(SKILL.md mục 1.4)*
| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | Hai nút giữ bánh đang có: Giữ bánh qua Zalo ở màn đầu · Giữ bánh mẻ X qua Zalo trong panel mẻ. Nhãn giữ nguyên | "lối vào là chính các nút giữ bánh đang có" |
| Lối vào phụ (Command Bar/Phím tắt) | không | "không cần phím tắt hay lối vào nhanh" |
| Phân quyền / Đối tượng *(cờ Q)* | Site không có vai, mọi khách thấy. Cờ Q không bật | "khách nào cũng thấy" |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | Không thêm, đổi hay bỏ trường: hộp đọc `BATCHES`, `PRODUCTS` và trạng thái mẻ sẵn có. Cờ D không bật | · |
| Quy tắc cũ → mới *(cờ L)* | Cũ: hai nút mở thẳng `zalo.me/0909123456`. Mới: mở hộp; mẻ đã hết thì tắt; bấm từ panel mẻ thì chọn sẵn mẻ đó; tên và ít nhất một bánh là bắt buộc; nút chính chép tin nhắn soạn từ lựa chọn rồi mở Zalo 0909 123 456 | "Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456." |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | Không áp: dự án không có tài liệu yêu cầu | · |
| Token / component mới *(cờ T)* | Cấp 2: hỏi ở Cổng 2 | · |

**Chỗ câu lệnh chưa nói, dựng theo quy tắc sẵn có của prototype** *(đưa lên Cổng 3 để chốt)*:
- Bấm từ màn đầu: chọn sẵn mẻ sớm nhất chưa hết *(8:40 → 9:30; 11:00 → 9:30 còn bánh ở quầy)*.
- Bấm từ panel của mẻ đã hết: chọn sẵn mẻ mà nút trong panel đang ghi *(mẻ kế còn bánh, theo `target()` sẵn có)*.
- Hôm nay không còn mẻ nào *(hết sạch, sau 19:00, thứ Hai lò nghỉ)*: bốn mẻ của ngày làm kế đều chọn được, nhãn "Sáng mai", "Chiều thứ Ba", theo quy tắc "nút giữ bánh trỏ mẻ 6:00 hôm sau" ở `DESIGN.md` mục 5.
- Tin nhắn giữ khuôn câu mẫu của panel mẻ, kèm giờ tới lấy *(giờ ra lò, hoặc giờ hiện tại nếu mẻ đã ra lò, cộng 15 phút, tròn 5 phút: cùng công thức `message()` sẵn có)*.
- Số lượng mỗi loại 0 đến 99; tiệm chưa nói giới hạn.
- Chép bị chặn: không tự mở Zalo; báo dưới nút chính *(cạnh chỗ chép)*, cuộn tới tin nhắn để chép tay, hiện nút viền Mở Zalo. Trình duyệt chặn cửa sổ mới: báo đã chép, hiện nút Mở Zalo.
- Mở lại hộp giữ tên và số bánh đã nhập; mẻ chọn lại theo nút vừa bấm.

---

### 🛑 Cổng 2 · Phương án hiển thị — **không hỏi: câu lệnh đã chỉ định**
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án A | Sheet trượt từ đáy | Ngón cái với tới nút chính ở đáy *(Fitts)*, thấy một phần trang nền; trên máy tính rộng quá thì dòng chữ dài, nút xa | Dùng dưới 768px |
| Phương án B | Hộp thoại giữa màn | Tập trung, quen thuộc trên máy tính *(Jakob)*; trên điện thoại nút chính lơ lửng giữa màn, bàn phím che | Dùng từ 768px |
| Phương án kết hợp | Sheet dưới 768px, hộp thoại từ 768px | Mỗi khổ dùng mẫu quen của nó | ✓ |

**Đáp án (nguyên văn):** "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn". Mốc chia là 768px, cùng mốc sẵn có của site *(đầu trang rút gọn, nút giãn ngang)*; khổ tablet 768 là hộp thoại.

**Token / component mới *(cờ T)*:** không màu, không font, không token mới. Component mới: `.hold` *(sheet và hộp thoại, một `<dialog>`)*, `.pick-opt` *(ô chọn mẻ)*, `.qty` *(ô chọn số lượng)*, `.input` *(ô nhập tên)*, `.field-err` *(lời báo lỗi)*, `.btn-icon` *(nút đóng)*; icon Phosphor `x`, `minus`, `plus`. Người dùng duyệt nguyên văn: "được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font". Ô chọn mẻ, ô nhập tên và nút đóng không có tên trong ngoặc; hiểu là nằm trong "component mới" vì câu lệnh đòi "chọn mẻ", "nhập tên" trong hộp *(đưa lên Cổng 3)*.

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp
- **Các file đã sửa / tạo mới:**
  * `site/index.html` *(sửa: nút màn đầu và nút panel mẻ thành nút mở hộp `data-hold`; thêm `<dialog>` hộp giữ bánh; script hộp; toast dùng chung hàm `say()`)*
  * `site/assets/site.css` *(sửa: khối Hộp giữ bánh, dòng 184–266)*
  * `site/_system.html` *(sửa: mục Hộp giữ bánh với 4 khung mẫu đứng yên; chú thích mục Nút)*
  * `DESIGN.md` *(sửa: mục 4 icon, mục 5 sáu component + trạng thái đang chép của nút chính, vùng dữ liệu, chỗ dùng, mục 9, Lịch sử)*
  * `FEATURE-DECISIONS.md` *(khối này)*
  * `_qa/steps-giu-banh.json` *(mới: 16 bước, 14 bước có `check`)*
  * `_qa/qa.config.json` *(sửa: thêm bộ `tinh-nang-giu-banh-1440`, `tinh-nang-giu-banh-390`)*
- **Kết quả tự kiểm hồi quy (Regression QA):**
  * So với mốc: `0` lỗi mới · `0` lỗi cũ · nợ cũ: không có
  * Console Errors: `0`
  * Responsive (1440 & 390): `Đạt`. 390 là sheet sát đáy rộng hết màn, 1440 là hộp thoại giữa màn *(bước `sheet-hay-hop-thoai`)*; tràn mới 0, cắt mới 0. Ở 1440×900 thân hộp cuộn khoảng một dòng mới thấy hết tin nhắn sẽ chép
  * Thoát hiểm 2 chiều (Esc & Click ngoài): `Đạt`, cả nút X; focus về nút đã mở *(bước `thoat-esc`, `thoat-backdrop`, `thoat-nut-dong`)*
  * 5 trạng thái: `Đủ`. Bình thường · hover, nhấn, focus-visible ở ô mẻ, nút số lượng, ô nhập, nút X · đang chép *(`aria-busy`, vòng quay)* · rỗng *(tin nhắn hiện `[số bánh]`, `[tên bạn]`; hôm nay hết mẻ thì giữ cho ngày làm kế)* · lỗi *(thiếu tên, thiếu bánh báo dưới ô; chép bị chặn báo dưới nút chính)*
  * UX 12 điểm: `12/12`
  * Phân quyền hai chiều: không áp *(site không có vai; "khách nào cũng thấy")*; hai lối vào đều mở được hộp *(bước `mo-tu-man-dau`, `mo-tu-khung-me`)*
  * Hồi quy theo cờ: cờ C trên `2` trang dùng `site.css` *(index, _system: 6 bộ khói ĐẠT)*
  * Trạng thái QA: bộ tính năng trước khi dựng `FAIL 14` / 14 bước có check *(1440 và 390)* → sau `FAIL 0`, `im lặng 0` · bẻ thử: không có bước phủ định *(không có vai)*
  * Ghi chú prototype đã cập nhật: `DESIGN.md` *(chỗ dùng đếm bằng `grep`)*
  * Lệnh kiểm cuối: `quick · 3 file đổi · 8 bộ (dark) · 59 bước · preflight: 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site · console 0 · FAIL 0 · im lặng 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT, đã lưu mốc current`
  * Sửa sau khi xem ảnh: lời báo chép bị chặn nằm trong khối tin nhắn, bị thân hộp cuộn khuất ở 1440 → chuyển xuống dưới nút chính và cuộn tới tin nhắn; tên và giá chung dòng; hộp thoại cao `min(100dvh - 48px, 54rem)`

**Quyết định nghiệm thu (nguyên văn):** *(chờ người dùng)*
*(Chốt tích hợp · Sửa thêm · Đổi phương án (Cấp 2–3))*
