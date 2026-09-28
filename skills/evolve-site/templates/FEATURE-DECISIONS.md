# Nhật ký phát triển tính năng — <Tên Prototype / Dự án>

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| <dd/mm/yyyy> | Cấp 0 · cờ: không · <lý do> | `<file>` | | `<mã / trích>` · hoặc *câu lệnh* | `0` lỗi mới | *(Cấp 0: không hỏi)* |

---

## Tính năng: <Tên tính năng mới> — Ngày: <dd/mm/yyyy>

### Bối cảnh & Mục tiêu
- **Khai báo:** `Cấp <n> · cờ: <Q, D, L, Y, T, C | không> · vì <lý do>` · nâng cấp giữa chừng: `<không>` · hoặc `<lúc nào, vì sao>`
- **Màn hình liên quan:** `<tên file HTML>`
- **Nguồn yêu cầu:** `<mã hoặc trích nguồn: PRD, user story, ticket, use case, rule…>` · hoặc *không có trong yêu cầu: người dùng chốt dựng như đề xuất (cờ Y)* · hoặc *dự án không có tài liệu yêu cầu: nguồn là câu lệnh*
- **Mốc trước khi sửa:** `_qa/truoc/` · QA: `<n>` lỗi có sẵn · trạng thái QA: `<n>`
- **Lời miễn hỏi *(nếu có, nguyên văn)*:** 

---

### 🛑 Cổng 1 · Vị trí & Lối vào *(Cấp 1: 🛑1 rút gọn, chỉ điền các dòng cờ)*
| Hạng mục | Phương án đề xuất | Quyết định của người dùng (nguyên văn) |
|---|---|---|
| Lối vào chính | | |
| Lối vào phụ (Command Bar/Phím tắt) | | |
| Phân quyền / Đối tượng *(cờ Q)* | | |
| Dữ liệu: đổi hoặc bỏ trường *(cờ D)* | | |
| Quy tắc cũ → mới *(cờ L)* | | |
| Tính năng ngoài hoặc trái yêu cầu *(cờ Y)* | | |
| Token / component mới *(cờ T, chỉ ở Cấp 1; Cấp 2–3 hỏi ở Cổng 2)* | | |

---

### 🛑 Cổng 2 · Phương án hiển thị *(Cấp 1: không đi)*
| Phương án | Bố cục | Ưu/Nhược điểm | Người dùng chọn? |
|---|---|---|---|
| Phương án A | Drawer bên phải | | |
| Phương án B | Modal trung tâm | | |
| Phương án kết hợp | | | |

**Đáp án (nguyên văn):** 

**Token / component mới *(cờ T)*:** `<không có>` · hoặc `<tên + giá trị>`, người dùng duyệt nguyên văn: 

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp
- **Các file đã sửa / tạo mới:**
  * `<đường-dẫn-file-1>`
  * `<đường-dẫn-file-2>`
- **Kết quả tự kiểm hồi quy (Regression QA)** *(bước bỏ theo bảng B4 thì ghi `không áp (Cấp n)`)*:
  * So với mốc: `0` lỗi mới · `<n>` lỗi cũ không đụng *(liệt kê)*
  * Console Errors: `0`
  * Responsive (1440 & 390): `Đạt`
  * Thoát hiểm 2 chiều (Esc & Click ngoài): `Đạt`
  * 5 trạng thái (Normal, Hover, Loading, Empty, Error): `Đủ`
  * UX 12 điểm: `<n>/12`
  * Phân quyền hai chiều: `Đạt` · lối vào ở menu mọi trang *(nếu thêm trang)*: `<n>/<n>`
  * Hồi quy theo cờ: cờ D trên `<n>` trang đọc dữ liệu · cờ C trên `<n>` trang dùng chung
  * Bỏ tính năng *(nếu có)*: còn `0` chỗ gọi
  * Trạng thái QA: trước `<n>` → sau `<m>` · bẻ thử: `kêu ✓`
  * Ghi chú prototype đã cập nhật: `<file>`

**Quyết định nghiệm thu (nguyên văn):** 
*(Chốt tích hợp · Sửa thêm · Đổi vị trí (Cấp 1) · Đổi phương án (Cấp 2–3))*
