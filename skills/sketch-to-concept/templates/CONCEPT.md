# Concept — <Tên dự án>

> Chốt ở **Cổng 2** ngày <dd/mm/yyyy>. Bảng so sánh: `concept/index.html` *(ảnh chụp ở `concept/shots/`)*.
> **Nguồn token:** trước Cổng 3, file này là nguồn. Từ Cổng 3 *(`sketch-to-site`)*, `DESIGN.md` là nguồn; file này giữ nguyên làm lịch sử, không sửa nữa.

## 0. Brief concept
| Dòng | Nội dung | Nguồn *(người dùng nói · tài liệu, mục/dòng · đoán)* |
|---|---|---|
| Sản phẩm | <loại · nền tảng · các bề mặt> | |
| Cho ai | <người dùng chính · thiết bị · hoàn cảnh dùng> | |
| Việc chính | <1–3 việc · loại màn chiếm nhiều nhất: x/y chức năng> | |
| Khác biệt | <điều làm sản phẩm khác đối thủ> | |
| Định hướng | <3 từ · thích · ghét hoặc cấm> | |
| Ràng buộc | <brand, màu hay font bắt buộc, tham chiếu và mức bám> | |

## 1. Concept đã chọn
- **Tên:** <…> · **Concept:** <A | B | C | trộn> · **Nguồn:** <hợp nhất | chuẩn thật: tên sản phẩm | lăng kính studio: tên>
- **Ý:** <một câu>
- **Ẩn dụ:** <…> · **Trục ý tưởng:** <…> · **Khoảnh khắc đọc lần hai:** <…>
- **Form đến từ đâu trong nội dung:** <một câu>
- **Họ phong cách:** <tên trong `style-catalogue.md`> · **Dial:** VARIANCE <n> · MOTION <n> · DENSITY <n>
- **Nền:** <sáng | tối | theo hệ thống> · **Nhịp:** <như concept | tĩnh hơn | sống động hơn>
- **Tự chấm lớp Ý:** <n>/10 · <một câu lý do> *(`concept-method.md` mục 7)*

## 2. Dụng
- **Màn then chốt:** <tên màn · file `concept/<id>.html`> · **Khung bố cục:** <…>
- **Tương tác đặc trưng:** <thao tác> · **Phục vụ việc chính nào:** <…>

## 3. Hình: token đã khoá
**Màu** *(vai trò theo cột của `colors.csv`; biến CSS theo `rules-and-conflicts.md` D.2 của `sketch-to-site`, do `tokens.js` đổi)*
| Vai trò | Biến CSS | Sáng | Tối | Dùng cho | Tương phản |
|---|---|---|---|---|---|
| background | `--bg` | | | Nền trang | |
| foreground | `--ink` | | | Chữ chính | trên nền <x:1> |
| card · card-foreground | `--surface` · `--card-foreground` | | | Thẻ, panel | <x:1> |
| muted · muted-foreground | `--muted-bg` · `--muted` | | | Nền phụ · chữ phụ | trên nền <x:1> |
| border | `--line` | | | Đường kẻ 1px | |
| primary · on-primary | `--primary` · `--on-primary` | | | Nút chính | <x:1> |
| accent · on-accent | `--accent` · `--on-accent` | | | Nhấn, đang chọn, tab đang mở | <x:1> |
| destructive · on-destructive | `--destructive` · `--on-destructive` | | | Lỗi | <x:1> |
| ring | `--ring` | | | Vòng focus | |

**Sang Phần B:** B2 của `sketch-to-site` chép các màu này vào `site/assets/themes.json` *(khuôn `<skills>/sketch-to-site/templates/themes.json`)*, mỗi nền một theme: background → `bg`, card → `surface`, foreground → `ink`, muted-foreground → `muted`, border → `line`, muted → `muted-bg`, vai khác giữ tên. Vai dẫn xuất *(hover, nhấn, nền nhạt, viền control, vòng focus, liên kết)* do `themes.mjs` tính và đo, không chép tay.

**Lý do màu:** <một câu, theo giao thức 3 bước>

**Chữ**
| Vai | Font | Độ đậm | Đã kiểm dấu tiếng Việt |
|---|---|---|---|
| Hiển thị | | | `preflight.py --font` → <kết quả> |
| Thân | | | |
| Số liệu / mono | | | |

**Hình khối:** bo góc sm <…> · md <…> · lg <…> · bóng <…> · viền <…> · chất nền <none | grid | dots | grain>

**App** *(bỏ nếu không có app)*: <danh sách khoá ở `concept-method.md` mục 5.3>

**Font:** `--font-display` · `--font-body` *(cũng là `--brand-font` mà `app.css` đọc)* · `--font-mono`. **Hình khối:** `--radius-sm` · `--radius` *(= md)* · `--radius-lg` · `--shadow` · `--texture`.

**Khối CSS** *(chép từ `ConceptTokens.cssText` của concept đã chọn, sau khi trộn nếu có)*:
```css
:root{ … }
```

## 4. Đã khoá và còn mở
| Đã khoá *(Phần B không tự đổi)* | Còn mở *(Phần B quyết, hỏi ở Cổng 3 nếu cần)* |
|---|---|
| Màu, chữ, hình khối ở mục 3 · Ý và ẩn dụ · tương tác đặc trưng · khung của màn then chốt | Bố cục các màn còn lại · mật độ từng bề mặt · component chưa có trên bảng · <…> |

## 5. Trộn
**Mã trộn:** <man:… mau:… chu:… nut:… | không trộn> · **Người dùng nói (nguyên văn):** <…>

## 6. Concept không chọn
| Concept | Ý | Vì sao không chọn *(nguyên văn nếu người dùng nói)* |
|---|---|---|
| | | |
