# Concept — Lò Bánh Củi Cô Ba

> Chốt ở **Cổng 2** ngày 04/10/2026. Bảng so sánh: `concept/index.html` *(ảnh chụp ở `concept/shots/`)*.
> **Nguồn token:** trước Cổng 3, file này là nguồn. Từ Cổng 3 *(`sketch-to-site`)*, `DESIGN.md` là nguồn; file này giữ nguyên làm lịch sử, không sửa nữa.

## 0. Brief concept
| Dòng | Nội dung | Nguồn *(người dùng nói · tài liệu, mục/dòng · đoán)* |
|---|---|---|
| Sản phẩm | Site giới thiệu một trang · chỉ web · một bề mặt | người dùng nói |
| Cho ai | Khách du lịch và người địa phương ở Đà Lạt · điện thoại · lướt tìm chỗ ăn sáng | người dùng nói |
| Việc chính | Xem mẻ bánh sắp ra lò · xem giờ mở và đường đi · đặt giữ bánh qua Zalo · loại màn: giới thiệu, 1/1 màn | người dùng nói · số màn đếm từ "site giới thiệu một trang" |
| Khác biệt | Bánh nướng lò củi, 4 mẻ cố định mỗi ngày (6:00, 9:30, 15:00, 17:30), mẻ nào hết là hết | người dùng nói |
| Định hướng | Ấm, mộc, đáng tin · ghét: sến, kiểu quán cà phê sống ảo | người dùng nói |
| Ràng buộc | Chưa có logo hay màu brand · không có tham chiếu | người dùng nói |

## 1. Concept đã chọn
- **Tên:** Cửa lò mở bốn lần · **Concept:** c · **Vòng:** 1 · **Nguồn:** chuẩn thật: Lune Croissanterie *(Melbourne, site do A Friend of Mine làm; mượn cách bày luật mua và dẫn tới đặt trước, không chép giao diện, ảnh hay chữ)*
- **Ý:** Cửa lò củi chỉ mở bốn lần một ngày; trang web là cái cửa lò ấy: vòm tối, mở ra là thấy mẻ bánh.
- **Ẩn dụ:** Miệng vòm lò gạch nung củi · **Trục ý tưởng:** Sân khấu: cửa lò mở ra · **Khoảnh khắc đọc lần hai:** đổi chất liệu một lần: vòm của mẻ đang nướng chuyển từ gạch tối sang than hồng
- **Form đến từ đâu trong nội dung:** Lò củi xây vòm gạch là thứ làm nên tiệm, nên bốn mẻ thành bốn ô cửa vòm: vòm của mẻ đang nướng sáng màu than hồng, vòm đã hết tối lại, và câu "mẻ nào hết là hết" viết thẳng như nội quy treo cạnh lò.
- **Họ phong cách:** Awwwards · Trải nghiệm điện ảnh, tiết chế *(họ 6 trong `style-catalogue.md`, hạ chuyển động và mật độ)* · **Dial:** VARIANCE 7 · MOTION 4 · DENSITY 3
- **Nền:** tối, như concept · **Nền thứ hai:** không · **Nhịp:** như concept
- **Tự chấm lớp Ý:** 8/10 · che chữ vẫn ra "lò, lửa": vòm lò sáng than hồng giữa nền muội than là chỗ sáng duy nhất trên màn *(`concept-method.md` mục 7; agent chấm độc lập cũng cho 8/10)*

## 2. Dụng
- **Màn then chốt:** màn đầu + section bốn mẻ · file `concept/c.html` · **Khung bố cục:** màn đầu là một vòm lớn căn giữa ôm giờ mẻ kế, chữ tiết chế; section là hàng bốn ô cửa vòm, dưới là nội quy ba dòng
- **Tương tác đặc trưng:** bấm một ô cửa vòm để mở mẻ đó: thấy món trong khay, giá, trạng thái *(đã hết, đang nướng, chưa vào lò)* và nút giữ bánh của đúng mẻ · **Phục vụ việc chính nào:** xem mẻ bánh sắp ra lò và đặt giữ bánh qua Zalo

## 3. Hình: token đã khoá
**Màu** *(vai trò theo cột của `colors.csv`; biến CSS theo `rules-and-conflicts.md` D.2 của `sketch-to-site`, do `tokens.js` đổi)*
| Vai trò | Biến CSS | Màu *(nền của concept: tối)* | Dùng cho | Tương phản |
|---|---|---|---|---|
| background | `--bg` | `#16100C` | Nền trang | |
| foreground | `--ink` | `#F3E9DC` | Chữ chính | trên nền 15,71:1 |
| card · card-foreground | `--surface` · `--card-foreground` | `#241A14` · `#F3E9DC` | Thẻ, panel | 14,19:1 |
| muted · muted-foreground | `--muted-bg` · `--muted` | `#2E231C` · `#B8A693` | Nền phụ · chữ phụ | trên nền 8,00:1 · trên nền phụ 6,49:1 |
| border | `--line` | `#5A4638` | Đường kẻ 1px | |
| primary · on-primary | `--primary` · `--on-primary` | `#F08A3C` · `#1A0F08` | Nút chính | 7,53:1 |
| accent · on-accent | `--accent` · `--on-accent` | `#6B2D1C` · `#FFF1E4` | Nhấn, đang chọn, tab đang mở | 9,39:1 |
| destructive · on-destructive | `--destructive` · `--on-destructive` | `#F0705F` · `#1A0F08` | Lỗi | 6,44:1 |
| ring | `--ring` | `#F08A3C` | Vòng focus | trên nền 7,54:1 |

**Sang Phần B:** B2 của `sketch-to-site` chép các màu này vào `site/assets/themes.json` *(khuôn `<skills>/sketch-to-site/templates/themes.json`, một theme)*. Nền thứ hai chỉ có khi người dùng xin: B2 thêm theme thứ hai và đo mọi cặp. Đổi tên vai: background → `bg`, card → `surface`, foreground → `ink`, muted-foreground → `muted`, border → `line`, muted → `muted-bg`, vai khác giữ tên. Vai dẫn xuất *(hover, nhấn, nền nhạt, viền control, vòng focus, liên kết)* do `themes.mjs` tính và đo, không chép tay.

**Lý do màu:** Nâu đen của muội than củi làm nền; cam than hồng của lửa trong lò cho mẻ đang nướng và nút giữ bánh; đỏ gạch chịu lửa cho các vòm đang đóng.

**Chữ**
| Vai | Font | Độ đậm | Đã kiểm dấu tiếng Việt |
|---|---|---|---|
| Hiển thị | Fraunces | 400 · 600 | `preflight.py --font` → VI · Serif · độ đậm 100–900 |
| Thân | Commissioner | 400 · 500 · 600 | VI · Sans Serif · độ đậm 100–900 |
| Số liệu / mono | IBM Plex Mono | 400 · 500 | VI · Monospace · độ đậm 100–700 |

Lý do chữ: Fraunces nét tròn mềm như mép bánh nở trong lò; Commissioner chân loe nhẹ, ấm hơn grotesk mà vẫn rõ trên nền tối; IBM Plex Mono cho giờ và giá.

**Hình khối:** bo góc sm 2px · md 4px · lg 999px · bóng none · viền 1px · chất nền none. Vòm cung là miệng lò gạch; ngoài vòm thì góc gần vuông như viên gạch; không bóng, ánh sáng chỉ đến từ lòng vòm đang mở.

**Font:** `--font-display` · `--font-body` *(cũng là `--brand-font` mà `app.css` đọc)* · `--font-mono`. **Hình khối:** `--radius-sm` · `--radius` *(= md)* · `--radius-lg` · `--shadow` · `--texture`.

**Khối CSS** *(chép từ `ConceptTokens.cssText` của concept đã chọn, sau khi trộn nếu có)*:
```css
:root{--bg:#16100C;--ink:#F3E9DC;--surface:#241A14;--card-foreground:#F3E9DC;--muted-bg:#2E231C;--muted:#B8A693;--line:#5A4638;--primary:#F08A3C;--on-primary:#1A0F08;--accent:#6B2D1C;--on-accent:#FFF1E4;--destructive:#F0705F;--on-destructive:#1A0F08;--ring:#F08A3C;color-scheme:dark;--theme-mode:"dark";--primary-hover:#FE9C55;--primary-pressed:#FDB585;--accent-hover:#5C1F0E;--accent-pressed:#4D1101;--destructive-hover:#FE8371;--destructive-pressed:#FE9F90;--hover:rgba(243, 233, 220, 0.06);--pressed:rgba(243, 233, 220, 0.1);--selected:#321E16;--primary-soft:#3B2617;--line-strong:#846E5D;--link:#F08A3C;--success:#7CD591;--success-soft:#2B3123;--warning:#EEC469;--warning-soft:#3A2E1D;--info:#8CC3FC;--info-soft:#2C2F34;--danger-text:#F0705F;--danger-soft:#3B221B;--scrim:rgba(22, 16, 12, 0.65);--font-display:"Fraunces", system-ui, sans-serif;--font-body:"Commissioner", system-ui, sans-serif;--font-mono:"IBM Plex Mono", ui-monospace, monospace;--brand-font:"Commissioner", system-ui, sans-serif;--radius-sm:2px;--radius-md:4px;--radius-lg:999px;--radius:4px;--shadow:none;--border-width:1px;--texture:none;--texture-size:auto;}
```

## 4. Đã khoá và còn mở
| Đã khoá *(Phần B không tự đổi)* | Còn mở *(Phần B quyết, hỏi ở Cổng 3 nếu cần)* |
|---|---|
| Màu, chữ, hình khối ở mục 3 · Ý và ẩn dụ · tương tác đặc trưng · khung của màn then chốt | Bố cục các section còn lại *(bảng giá 4 món, giờ mở và đường đi, nội quy)* · mật độ từng section · component chưa có trên bảng · cách hiện trạng thái thật của mẻ và món của từng mẻ *(xem Giả định B1 trong `DECISIONS.md`)* |

## 5. Trộn
**Mã trộn:** không trộn · **Người dùng nói (nguyên văn):** "Chọn C. Một nền như concept. Nhịp như concept."

## 6. Concept không chọn
| Vòng | Concept | Ý | Vì sao không chọn *(nguyên văn nếu người dùng nói)* |
|---|---|---|---|
| 1 | a · Dấu giờ ra lò | Mỗi mẻ bánh rời lò mang một con dấu giờ: trang web là tờ phiếu giữ bánh, đóng dấu đúng mẻ bạn giữ | Người dùng chọn C, không nêu lý do. Khuyến nghị xếp a thứ hai; rủi ro đã nêu: vỏ kraft + dấu cao su dễ thành sáo ngữ của tiệm thủ công |
| 1 | b · Một ngày, bốn vết rạch | Một ngày của lò là thanh giờ 5:30–19:00 có bốn vết rạch; nhìn một lần biết mẻ kế còn bao xa | Người dùng chọn C, không nêu lý do. Rủi ro đã nêu: nền sáng trơn + một màu nhấn sát lối thất bại "trắng + khoảng trắng + một màu" |
