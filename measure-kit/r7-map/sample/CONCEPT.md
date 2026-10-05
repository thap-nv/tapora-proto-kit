# Concept — Sóng Xanh

> Chốt ở **Cổng 2** ngày 30/09/2026. Bảng so sánh: `concept/index.html` *(thư mục đo giả lập: không kèm bảng concept và màn then chốt)*.
> **Nguồn token:** trước Cổng 3, file này là nguồn. Từ Cổng 3 *(`sketch-to-site`)*, `DESIGN.md` là nguồn; file này giữ nguyên làm lịch sử, không sửa nữa.

## 0. Brief concept
| Dòng | Nội dung | Nguồn *(người dùng nói · tài liệu, mục/dòng · đoán)* |
|---|---|---|
| Sản phẩm | Hệ thống nhiều bề mặt · Web quản trị *(Quản lý, Lễ tân, HLV)* · App phụ huynh iOS và Android | người dùng nói · `YEU-CAU-HE-THONG-SONG-XANH.md` mục 3 |
| Cho ai | Lễ tân ở quầy, máy tính, cả ngày · HLV dùng máy tính bảng ở thành bể, tay ướt · phụ huynh trên điện thoại, lúc đưa đón con | tài liệu mục 1, 3 |
| Việc chính | Xếp lớp và lịch · điểm danh tại bể · bán gói và thu tiền · loại màn chiếm nhiều nhất: bảng và danh sách, 7/12 use case | `USE-CASE-SONG-XANH.md` mục 2 *(đếm tên)* |
| Khác biệt | Số buổi còn lại luôn đúng, phụ huynh tự xem mà không phải nhắn lễ tân | tài liệu mục 2 |
| Định hướng | trong · mát · ngăn nắp · thích: rõ số, nhìn là biết lớp nào còn chỗ · ghét: rối, nhiều màu | người dùng nói |
| Ràng buộc | Logo sóng màu xanh nước biển của trung tâm; không có font bắt buộc | người dùng nói |

## 1. Concept đã chọn
- **Tên:** Làn bơi · **Concept:** b · **Vòng:** 1 · **Nguồn:** hợp nhất
- **Ý:** Mỗi lớp là một làn bơi: nhìn lịch là thấy làn nào đang có ai, còn bao nhiêu chỗ.
- **Ẩn dụ:** làn bơi và dây phao · **Trục ý tưởng:** chỗ trống trong làn · **Khoảnh khắc đọc lần hai:** vạch chia làn chính là đường kẻ của bảng lịch
- **Form đến từ đâu trong nội dung:** bể 25 m sáu làn của trung tâm, lớp gắn với bể và làn (`schema.dbml`, bảng `lop`).
- **Họ phong cách:** Công cụ vận hành · **Dial:** VARIANCE 3 · MOTION 3 · DENSITY 7
- **Nền:** sáng · **Nền thứ hai:** không · **Nhịp:** như concept
- **Tự chấm lớp Ý:** 7/10 · ẩn dụ gắn với dữ liệu thật của trung tâm, nhưng chỉ lộ rõ ở màn lịch

## 2. Dụng
- **Màn then chốt:** Lịch tuần của trung tâm · file `concept/b.html` · **Khung bố cục:** thanh bên trái, lưới lịch theo làn và giờ, ngăn chi tiết bên phải
- **Tương tác đặc trưng:** bấm một ô lớp trong lưới lịch → ngăn bên phải mở danh sách học viên và số chỗ còn trống · **Phục vụ việc chính nào:** xếp lớp và lịch

## 3. Hình: token đã khoá
**Màu**
| Vai trò | Biến CSS | Màu | Dùng cho | Tương phản |
|---|---|---|---|---|
| background | `--bg` | `#F3F7F9` | Nền trang | |
| foreground | `--ink` | `#0E2A35` | Chữ chính | trên nền 13,9:1 |
| card · card-foreground | `--surface` · `--card-foreground` | `#FFFFFF` · `#0E2A35` | Thẻ, panel | 15,0:1 |
| muted · muted-foreground | `--muted-bg` · `--muted` | `#E4EEF2` · `#4A6570` | Nền phụ · chữ phụ | trên nền 5,8:1 |
| border | `--line` | `#C7D7DE` | Đường kẻ 1px | |
| primary · on-primary | `--primary` · `--on-primary` | `#0A6A86` · `#FFFFFF` | Nút chính | 6,1:1 |
| accent · on-accent | `--accent` · `--on-accent` | `#F0B43C` · `#1F1A0E` | Nhấn, đang chọn | 9,3:1 |
| destructive · on-destructive | `--destructive` · `--on-destructive` | `#B42318` · `#FFFFFF` | Lỗi | 6,6:1 |
| ring | `--ring` | `#0A6A86` | Vòng focus | |

**Lý do màu:** xanh nước bể lấy từ logo của trung tâm; vàng phao làn bơi làm màu nhấn cho ô đang chọn.

**Chữ**
| Vai | Font | Độ đậm | Đã kiểm dấu tiếng Việt |
|---|---|---|---|
| Hiển thị | Lexend | 600 | `preflight.py --font` → OK |
| Thân | Inter | 400, 500, 600 | OK |
| Số liệu / mono | JetBrains Mono | 500 | OK |

**Hình khối:** bo góc sm 4px · md 8px · lg 12px · bóng 1 bậc nhẹ cho ngăn trượt · viền 1px `--line` · chất nền none

**App:** phụ huynh dùng tab dưới; chữ thân 16px; vùng chạm 44 (iOS) và 48 (Android).

**Khối CSS**:
```css
:root{--bg:#F3F7F9;--ink:#0E2A35;--surface:#FFFFFF;--card-foreground:#0E2A35;--muted-bg:#E4EEF2;--muted:#4A6570;--line:#C7D7DE;--primary:#0A6A86;--on-primary:#FFFFFF;--accent:#F0B43C;--on-accent:#1F1A0E;--destructive:#B42318;--on-destructive:#FFFFFF;--ring:#0A6A86;--font-display:"Lexend",sans-serif;--font-body:"Inter",sans-serif;--font-mono:"JetBrains Mono",monospace;--radius-sm:4px;--radius:8px;--radius-lg:12px;--shadow:0 4px 16px rgba(14,42,53,.10);--texture:none}
```

## 4. Đã khoá và còn mở
| Đã khoá *(Phần B không tự đổi)* | Còn mở *(Phần B quyết, hỏi ở Cổng 3 nếu cần)* |
|---|---|
| Màu, chữ, hình khối ở mục 3 · Ý và ẩn dụ · tương tác đặc trưng · khung của màn then chốt | Bố cục các màn còn lại · điều hướng của web và app · mật độ từng bề mặt · component chưa có trên bảng |

## 5. Trộn
**Mã trộn:** không trộn · **Người dùng nói (nguyên văn):** "Chọn B, làn bơi."

## 6. Concept không chọn
| Vòng | Concept | Ý | Vì sao không chọn *(nguyên văn nếu người dùng nói)* |
|---|---|---|---|
| 1 | a | Sổ tay quầy: mọi thứ là một trang sổ | "Giống Excel quá." |
| 1 | c | Đồng hồ bấm giờ: lịch là các vòng thời gian | "Đẹp nhưng lễ tân khó đọc." |
