# DNA Extractor · Hướng dẫn hấp thụ thiết kế hiện hữu

> Nguyên tắc: **"Đọc kỹ trước khi gõ phím"**. Khi thêm tính năng vào một trang web có sẵn, bước đầu tiên là trích xuất bộ gen (DNA) của hệ thống để đảm bảo 100% tính nhất quán.

---

## 1. Trích xuất Token thị giác (Visual Tokens)

Mở file HTML chính hoặc file CSS dùng chung, kiểm tra khối `:root` hoặc `tailwind.config`:

### A. Bảng màu (Color Palette)
- **Màu nền (Backgrounds):** Nền chính (`--bg`), nền thẻ/bề mặt (`--surface`), nền header/sidebar.
- **Màu chữ (Ink / Typography):** Chữ chính (`--ink`, `--text`), chữ phụ/mờ (`--muted`), chữ viền (`--line`, `--border`).
- **Màu nhấn (Accent / Brand):** Mã màu hành động chính (`--accent`, `--primary`).
- **Màu trạng thái (Semantics):** Thành công (xanh lá), Cảnh báo (hổ phách/vàng), Lỗi/Nguy hiểm (đỏ).
*Luật:* Không bao giờ dùng mã HEX mới nếu nó chưa từng xuất hiện trong hệ thống token.

### B. Typography & Font chữ
- **Bộ font chính:** Tra thẻ `<link href="...fonts.googleapis.com">` hoặc font-family trong CSS.
- **Quy ước chữ số:** Hệ thống có dùng font monospace hoặc `tabular-nums` cho số liệu không?
- **Quy ước kích thước & độ đậm:**
  * Tiêu đề mục: thường là `text-base font-semibold` hoặc `text-lg`.
  * Nhãn form: thường là `text-xs font-medium text-muted uppercase tracking-wider` hoặc `text-sm font-medium`.
  * Nội dung: thường là `text-sm` (đối với dashboard/web app) hoặc `text-base` (đối với landing page).

### C. Bo góc (Border Radius) & Khoảng cách (Spacing)
- Hệ thống đang dùng loại bo góc nào?
  * `rounded-none` (phong cách Brutalist / Bảng điều khiển công nghiệp)
  * `rounded-md` / `rounded-lg` (8px–12px: Tiêu chuẩn ứng dụng hiện đại)
  * `rounded-2xl` / `rounded-3xl` (Mềm mại, phong cách tiêu dùng/consumer app)
*Luật:* Tính năng mới phải dùng đúng hệ bo góc đó. Tuyệt đối không nhét thẻ bo tròn mềm vào một trang đang vuông vức.

### D. Nền tối, thuật ngữ, số liệu
- Site có **nền tối** không *(`data-theme="dark"`, `prefers-color-scheme`, lớp `.dark`)*? Có thì phần mới phải có màu cho cả hai nền, lấy từ token.
- **Thuật ngữ:** dự án có glossary *(thường ở `CLAUDE.md`, README hoặc tài liệu yêu cầu)* thì nhãn mới dùng đúng từ đó. Ví dụ glossary chốt *Khách hàng* thì nhãn mới không viết *Người mua*, dù hai từ cùng nghĩa.
- **Số liệu:** số tóm tắt đang được tính bằng hàm nào? Tính năng mới gọi lại đúng hàm đó, không gõ số tay.

---

## 2. Trích xuất Bộ Icon (Iconography)

Tìm thẻ `<script>` hoặc `<link>` nạp icon trong `<head>`:
- **Phosphor Icons:** `<i class="ph ph-plus"></i>` hoặc `<i class="ph-bold ph-gear"></i>`.
- **Lucide Icons:** `<i data-lucide="plus"></i>` hoặc SVG inline.
- **FontAwesome / Tabler / SVG nội bộ:** Xem các icon bên cạnh đang viết như thế nào.
*Luật:* Chỉ sử dụng **duy nhất một thư viện icon** đã có sẵn. Đang dùng Phosphor thì tuyệt đối không copy icon Lucide vào.

---

## 3. Trích xuất Hợp đồng Dữ liệu (Data Contract & State)

Kiểm tra các file JS trong thư mục `assets/` hoặc script ở cuối trang:
- **Nguồn dữ liệu:** Dữ liệu nằm ở đâu? (Biến toàn cục `window.DATA`, `localStorage`, hay gọi API giả lập?).
- **Các hàm Helper nghiệp vụ:** Hệ thống đã có những hàm tiện ích nào?
  * Ví dụ: một hàm `today()` đã gộp nhiều nguồn và lọc theo ngữ cảnh đang xem, `store.get()`, `formatMoney()`.
  * Việc tự ý gọi dữ liệu thô thay cho helper có thể dính bẫy nghiệp vụ mà ghi chú của prototype đã cảnh báo. Ví dụ thường gặp: mảng dữ liệu *hôm nay* thiếu khung giờ đang diễn ra vì khung đó được tách sang nguồn khác, chỉ helper mới gộp lại.
- **Nguyên tắc ghi đè:**
  * Khi tính năng mới cần thêm trường dữ liệu: Thêm trường mới kèm giá trị mặc định an toàn.
  * Không bao giờ xoá hoặc sửa kiểu dữ liệu của các trường đang được trang khác sử dụng. Yêu cầu buộc phải đổi hoặc bỏ thì đó là **cờ D** *(`SKILL.md` mục 1.2)*: hỏi trước, được duyệt thì sửa **mọi** chỗ đọc trường đó.

---

## 4. Trích xuất Mẫu Tương tác (Interaction Patterns)

Quan sát các thành phần tương tác đã chạy mượt trên trang:
- **Tab switching:** Đang dùng thuộc tính gì? (`data-tab-target`, `data-tab`, hay event listener riêng?).
- **Modal / Popup:** Đang dùng class ẩn/hiện nào? (`hidden`, `opacity-0 pointer-events-none`, `show`?).
- **Toast thông báo:** Hệ thống có hàm `showToast(msg, type)` chưa? Nếu có, hãy gọi lại hàm đó thay vì tự tạo container thông báo mới.
- **Thanh lệnh nhanh (Command Bar):** Nếu trang có thanh tìm kiếm `/` hoặc phím tắt `Ctrl+K`, hãy thêm action mới vào danh mục lệnh của thanh đó.

