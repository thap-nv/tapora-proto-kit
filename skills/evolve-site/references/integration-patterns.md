# UI Integration Patterns · Mẫu tích hợp tính năng mới

> Khi thêm một tính năng vào UI hiện hữu, việc chọn **hình thức hiển thị (container pattern)** quyết định 80% thành bại của trải nghiệm người dùng (UX).

---

## 1. Bảng ma trận chọn mẫu tích hợp

| Mẫu tích hợp | Khi nào nên dùng | Khi nào KHÔNG nên dùng | Tác động nhận thức (Cognitive Load) |
|---|---|---|---|
| **Inline Row / Tại chỗ** | Hành động tức thời, chỉnh sửa 1-2 trường, bật/tắt cờ | Form dài > 3 trường, tác vụ cần đối soát phức tạp | Rất thấp (không mất ngữ cảnh) |
| **Drawer (Slide-over)** | Xem chi tiết đối tượng, form 4–10 trường, log lịch sử, bộ lọc nâng cao | Xác nhận hành động phá hủy, thông báo khẩn cấp | Thấp - Trung bình (vẫn nhìn thấy trang nền) |
| **Modal Dialog** | Xác nhận hành động nhạy cảm (xoá, chuyển quyền), form ngắn tập trung (< 5 trường) | Luồng công việc kéo dài, xem bảng dữ liệu lớn | Cao (chặn toàn bộ tương tác nền) |
| **Expandable Panel** | Chi tiết phân cấp (Master-Detail), cây thư mục, xem nhanh dòng dữ liệu | Khi bảng quá nhiều cột gây tràn màn hình | Thấp |
| **Trang con độc lập (Sub-page)** | Module nghiệp vụ mới, quy trình wizard > 4 bước, báo cáo tổng hợp | Thao tác phụ diễn ra thường xuyên | Rất cao (rời khỏi trang làm việc hiện tại) |

---

## 2. Chi tiết từng mẫu tích hợp

### Mẫu 1: Drawer (Slide-over) — Lựa chọn vàng cho Web App & Dashboard
- **Cấu trúc:** Panel trượt từ mép phải màn hình ra (chiều rộng 400px–640px), có backdrop mờ phía sau.
- **Ưu điểm UX:**
  * Giúp người dùng không bị "mất phương hướng" vì vẫn nhìn thấy danh sách dữ liệu bên dưới qua lớp mờ.
  * Tận dụng chiều cao màn hình để cuộn form thoải mái mà không bị gò bó như modal.
- **Quy chuẩn kỹ thuật:**
  * Header có tiêu đề rõ ràng + nút đóng `X`.
  * Footer ghim cố định ở đáy (pinned footer) chứa nút Lưu (Primary) và Huỷ (Ghost).
  * Phím `Esc` hoặc bấm ra ngoài lớp backdrop phải đóng drawer ngay lập tức.

### Mẫu 2: Modal Dialog — Tác vụ tập trung & Xác nhận
- **Cấu trúc:** Hộp thoại nổi giữa màn hình, chiều rộng chuẩn (Small: 400px, Medium: 520px, Large: 720px).
- **Quy chuẩn UX:**
  * Chỉ dùng cho các tác vụ cần sự tập trung 100% (ví dụ: *"Huỷ đơn hàng #1024? Thao tác này không hoàn tác được."*).
  * Nút hành động chính phải dùng đúng từ ngữ chỉ hành động (Ví dụ: `[Huỷ đơn hàng]`, `[Xoá bản ghi]`), **không dùng nhãn chung chung** như `[Đồng ý]` hoặc `[OK]`.
  * Nếu là hành động phá huỷ/nguy hiểm: Nút Primary phải mang màu đỏ cảnh báo (`var(--danger)`).

### Mẫu 3: Inline Row Action — Thao tác tại chỗ
- **Cấu trúc:** Nút hành động trực tiếp trên từng hàng của bảng hoặc thẻ.
- **Quy chuẩn UX:**
  * Nếu mỗi hàng có > 3 hành động: Gom vào menu ngữ cảnh dropdown ba chấm (`...`).
  * Trạng thái phản hồi: Sau khi bấm, dòng dữ liệu phải có hiệu ứng cập nhật ngay (ví dụ: chuyển màu nhạt dần, hiện tick xanh hoặc badge mới trong 1-2 giây) để tạo cảm giác phản hồi nhanh (Doherty Threshold).

### Mẫu 4: Màn hình mới (New Sub-page)
- **Cấu trúc:** Một file HTML riêng biệt trong cùng thư mục (ví dụ `bao-cao.html` bên cạnh `index.html`).
- **Quy chuẩn UX:**
  * Bắt buộc có Breadcrumb hoặc nút quay lại rõ ràng: `← Quay lại [Tên trang trước]`.
  * Khung layout chính (Header, Sidebar, User profile) phải giống hệt các trang còn lại.
  * Thêm lối vào ở menu **mọi trang** *(hoặc nơi sinh menu chung)*, rồi đánh dấu trạng thái Active trên trang mới. Đếm bằng `grep`: số trang có lối vào = số trang có menu.
  * Trang mới có giới hạn vai thì **chặn ở chính trang đó**, không chỉ ẩn mục menu *(xem `regression-qa.md` nhóm G)*.

