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
- **Khai báo:** `Cấp 2 · cờ: L, T, C · vì nút giữ bánh đổi sang mở lớp phủ mới (sheet trên điện thoại, hộp thoại trên máy tính) có quy tắc kiểm tên và số bánh, khoá mẻ đã hết; cần component chưa có trong DNA (sheet, hộp thoại, ô chọn số lượng, ô nhập, ô chọn mẻ); sửa site.css dùng chung cho index.html và _system.html` · nâng cấp giữa chừng: `không`
- **Màn hình liên quan:** `site/index.html` *(màn đầu, section Bốn lần mở cửa lò)* · `site/_system.html` *(component mới)*
- **Nguồn yêu cầu:** `DECISIONS.md` Cổng 1, brief dòng 3 *"Việc chính: xem mẻ sắp ra lò · xem giờ mở và đường đi · giữ bánh qua Zalo"*; `DECISIONS.md` Giả định B1 dòng *Giữ bánh qua Zalo*, cột *Giá phải trả nếu sai*: *"Tiệm muốn khách điền form giữ bánh trên web (tên, số lượng, mẻ)"*. Hộp vẫn giữ bánh qua Zalo, không thêm nơi nhận đơn, nên không trái nguồn: cờ Y không bật.
- **Mốc trước khi sửa:** mốc cuốn chiếu `_qa/current/` *(`--dry`: không file đổi ngoài quy trình)* · ảnh mốc `_qa/truoc/` *(`run_all.py`, smoke-index và smoke-_system ở 1440, 768, 390)* · QA: `0` lỗi có sẵn · trạng thái QA: `6 bộ khói · 27 bước`
- **Lời miễn hỏi *(nếu có, nguyên văn)*:** không có

---

### 🛑 Cổng 1 · Vị trí & Lối vào · **không hỏi: câu lệnh đã chỉ định tường minh** *(SKILL.md mục 1.4)*
| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | Hai nút giữ bánh đang có | "lối vào là chính các nút giữ bánh đang có" · "Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay." |
| Lối vào phụ (Command Bar/Phím tắt) | Không | "không cần phím tắt hay lối vào nhanh" |
| Phân quyền / Đối tượng *(cờ Q)* | Không bật: site không có vai | "khách nào cũng thấy" |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | Không bật: chỉ đọc `PRODUCTS`, `BATCHES`, `states`, `target()` sẵn có; không lưu gì | · |
| Quy tắc cũ → mới *(cờ L)* | Cũ: nút giữ bánh mở thẳng `zalo.me/0909123456`. Mới: mở hộp; mẻ đã hết khoá; bấm từ khung mẻ chọn sẵn mẻ đó; tên và ít nhất một bánh bắt buộc; nút chính chép tin nhắn rồi mở Zalo | "mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó" · "Tên và ít nhất một bánh là bắt buộc." · "Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456." |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | Không bật *(nguồn ở trên)* | · |
| Token / component mới *(cờ T, chỉ ở Cấp 1; Cấp 2–3 hỏi ở Cổng 2)* | · | · |

**Suy từ quy tắc sẵn có, không hỏi** *(đưa lên Cổng 3)*: khung của mẻ đã hết chọn sẵn mẻ mà nút của khung đó đang trỏ tới *(`target()`: mẻ kế còn trong ngày)* · màn đầu chọn sẵn mẻ mà panel mở mặc định *(đang nướng, rồi còn bánh, rồi chưa vào lò)* · thứ Hai lò nghỉ: bốn mẻ thứ Ba · hết cả bốn mẻ hôm nay: bốn mẻ của ngày mở cửa kế *(như `target()` trỏ mẻ 6:00 hôm sau)*.

---

### 🛑 Cổng 2 · Phương án hiển thị · **không hỏi: câu lệnh đã chỉ định tường minh**
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án kết hợp | Dưới 768px: sheet trượt từ đáy · từ 768px: hộp thoại giữa màn *(mốc 768px theo `DESIGN.md` mục 6)* | Sheet: ngón cái với tới nút chính ở đáy, thấy mép trang nền phía trên · hộp thoại: tập trung, không kéo dài theo bề ngang 1440 | ✅ |

**Đáp án (nguyên văn):** "trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn"

**Token / component mới *(cờ T)*:** không thêm token, màu hay font. Component mới dựng bằng token sẵn có: sheet và hộp thoại `.hold`, ô chọn mẻ `.pick`, ô chọn số lượng `.qty`, ô nhập `.input`, lỗi trường `.field-err`, dòng trạng thái chép `.hold-status`. Người dùng duyệt nguyên văn: "được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp
- **Các file đã sửa / tạo mới:**
  * `site/index.html` *(sửa: 2 nút giữ bánh thành lối vào `data-hold`, `<dialog>` hộp giữ bánh, script hộp, toast dùng chung)*
  * `site/assets/site.css` *(sửa: khối "Hộp giữ bánh", 0 mã hex)*
  * `site/_system.html` *(sửa: mục "Hộp giữ bánh · sheet và hộp thoại", CSS cục bộ của khung trình bày)*
  * `_qa/steps-giu-banh.json` *(mới: 21 bước)* · `_qa/qa.config.json` *(sửa: bộ `tinh-nang-giu-banh-1440`, `tinh-nang-giu-banh-390`)*
  * `DESIGN.md` *(sửa: mục 4, 5, 7, 9, Lịch sử)* · `FEATURE-DECISIONS.md` *(khối này)*
- **Kết quả tự kiểm hồi quy (Regression QA):**
  * So với mốc: `0` lỗi mới · `0` lỗi cũ
  * Console Errors: `0`
  * Responsive (1440 & 390): `Đạt` *(390: sheet sát đáy rộng hết màn; 1440: hộp thoại giữa màn 576px; 768 chạy bộ khói)*
  * Thoát hiểm 2 chiều (Esc & Click ngoài): `Đạt` *(cộng nút Đóng; focus về đúng nút đã mở; khoá focus `:modal`)*
  * 5 trạng thái (Normal, Hover, Loading, Empty, Error): `Đủ`
  * UX 12 điểm: `12/12`
  * Phân quyền hai chiều: `không áp (không có vai; "khách nào cũng thấy")` · lối vào: `2/2` nút giữ bánh
  * Hồi quy theo cờ: cờ C trên `2` trang dùng `site.css` *(index, _system: bộ khói 1440, 768, 390, 0 lỗi mới)*
  * Bỏ tính năng: không áp
  * Trạng thái QA: trước `6 bộ · 27 bước` → sau `8 bộ · 69 bước` · đỏ trước khi dựng `FAIL 20/20` → xanh `FAIL 0/21` · bẻ thử: chặn khi thiếu tên hoặc bánh `kêu ✓` *(lần đầu không kêu, đã sửa bước)*, khoá mẻ đã hết `kêu ✓`, không mở Zalo khi chép bị chặn `kêu ✓`
  * Dòng cuối lệnh kiểm: `quick · 3 file đổi · 8 bộ (dark) · 69 bước · preflight: 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site · console 0 · FAIL 0 · im lặng 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 · nợ cũ 0 → ĐẠT, đã lưu mốc current`
  * Ghi chú prototype đã cập nhật: `DESIGN.md`
- **Đã hỏi:** Chốt tích hợp *(Khuyến nghị)* · Chỉnh sửa chi tiết *(nói rõ điểm cần sửa)* · Đổi phương án bố cục *(về Cổng 2)*. Không có `AskUserQuestion` *(phiên chạy như subagent)*: câu hỏi viết ra rồi dừng.

**Quyết định nghiệm thu (nguyên văn):** *(chờ người dùng)*
