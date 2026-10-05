# Design System: Lò Bánh Củi Cô Ba

> **Đã khoá ở Cổng 3 ngày 05/10/2026** *(bản trình viết ở B2 ngày 04/10/2026; đáp án nguyên văn ở `DECISIONS.md`)*. Sửa sau ngày khoá thì ghi vào `DECISIONS.md` và cập nhật bảng *Lịch sử* cuối file.
> Viết theo khuôn ngữ nghĩa của `stitch-design-taste`: **tên mô tả + giá trị chính xác + vai trò**.
> Trang sống: `site/_system.html` *(ảnh 1440: `_qa/cong-3/system-dark-1440.png`)*.

## 0. Bản đọc thiết kế
**Đọc là:** site giới thiệu một trang cho khách du lịch và người địa phương lướt tìm chỗ ăn sáng, trên điện thoại, giọng thẳng như nội quy cạnh lò, ấm mà không sến, nghiêng về điện ảnh tiết chế.
**Concept:** Cửa lò mở bốn lần *(`CONCEPT.md`, concept c, chốt ở Cổng 2)* · **Họ phong cách:** Awwwards · Trải nghiệm điện ảnh, tiết chế *(họ 6 trong `style-catalogue.md`, hạ chuyển động và mật độ)* · **Mã trộn:** không · **Mức bám tham chiếu:** không có tham chiếu; chuẩn thật Lune Croissanterie chỉ mượn cách bày luật mua
**Dial:** VARIANCE 7 · MOTION 4 · DENSITY 3 · **Nền:** tối · **Nền thứ hai:** không *(Cổng 2: "Một nền như concept")*

## 1. Không khí
Tối như khoảng sân trước miệng lò lúc rạng sáng; chỗ sáng duy nhất là lòng vòm đang có mẻ trong lò. Chữ ít, to, nói thẳng; mỗi màn trả lời một câu: mẻ kế mấy giờ, còn bánh không, giữ bằng cách nào. Chuyển động chậm vừa, chỉ để cửa lò nhấc lên và panel mẻ mở ra.

## 2. Màu và vai trò
> Nguồn: `site/assets/themes.json` *(màu gốc)* → `site/assets/themes.css` *(sinh bởi `scripts/themes.mjs`, không sửa tay)*. Vai dẫn xuất *(hover, nhấn, nền nhạt, viền control, vòng focus, liên kết)* xem ở `site/_system.html`. Tên biến giữ nguyên như `CONCEPT.md` mục 3.

| Vai | Biến | `dark` | Dùng cho |
|---|---|---|---|
| Nền | `--bg` | Muội than củi (#16100C) | Nền trang; vật liệu *tro nguội* của cửa đã hết |
| Mặt thẻ | `--surface` | Gạch nung sẫm (#241A14) | Panel mẻ, toast |
| Chữ chính | `--ink` | Bột mì kem (#F3E9DC) | Tiêu đề, chữ thân, viền cửa đang chọn |
| Chữ phụ | `--muted` | Vỏ bánh nguội (#B8A693) | Mô tả, nhãn trạng thái, chữ của mẻ đã hết |
| Đường kẻ | `--line` | Mạch vữa (#5A4638) | Viền 1px trang trí, viền cửa, kẻ dòng món. Viền control dùng `--line-strong` #846E5D *(dẫn xuất)* |
| Nền phụ | `--muted-bg` | Tro ấm (#2E231C) | Khung ảnh chờ, khối tin nhắn mẫu |
| **Chính** | `--primary` · `--on-primary` | Than hồng (#F08A3C) · Than đen (#1A0F08) | Nút giữ bánh *(một nút chính mỗi màn)*, vật liệu *than hồng* của vòm đang nướng, số nội quy |
| Nhấn | `--accent` · `--on-accent` | Gạch chịu lửa (#6B2D1C) · Kem sáng (#FFF1E4) | Vật liệu *gạch* của cửa đóng *(chưa vào lò, đã ra lò còn bánh, lò nghỉ, tiệm đóng)*, bậu lò 4px dưới vòm |
| Nguy hiểm | `--destructive` · `--on-destructive` | Đỏ san hô (#F0705F) · Than đen (#1A0F08) | Site không có hành động nguy hiểm. Chỉ dùng qua `--danger-text` cho lời báo lỗi |
| Báo | `--success` · `--warning` · `--info` | dẫn xuất: #7CD591 · #EEC469 · #8CC3FC | Chỉ để báo trạng thái *(đang mở, đã chép)*, luôn kèm chữ và icon |

**Kết quả `themes.mjs`:** 1 theme · 26 cặp · 0 không đạt · 0 sát ngưỡng · **Cặp sát ngưỡng:** không có · **Đã chỉnh:** không. Cặp thấp nhất: viền control `--line-strong` trên `--surface` 3,54:1 *(cần 3)*, chữ lỗi trên nền nhạt 5,02:1 *(cần 4,5)*.
**Đo trên trang render** *(`run.mjs`, 1440 và 390)*: tương phản 0 lỗi, màu theo ý định 0 lỗi, chữ tràn hay bị cắt 0, tràn ngang 0.

## 2b. Theme
| Theme | Chế độ | Mặc định cho | Khác theme đầu ở đâu |
|---|---|---|---|
| `dark` | tối | mọi máy *(`default.light` trỏ vào `dark`: sản phẩm chỉ có nền tối)* | theme đầu, duy nhất |

**Thêm theme:** thêm một mục vào `themes.json` → chạy `themes.mjs` → `qa_init.py --update` in dòng cần thêm vào `qa.config.json`. Không sửa `theme.js` *(KEY `lo-banh-cui-co-ba-theme`)*.

## 3. Chữ
| Vai | Font | Trọng lượng | Biến cỡ | Leading | Tracking |
|---|---|---|---|---|---|
| Giờ mẻ trong vòm | Fraunces | 600 | `--text-4xl` 144px, co theo vòm `min(--text-4xl, 30cqi)` *(80px ở khổ 320)* | 1 | -0,01em |
| Tiêu đề trang (H1) | Fraunces | 600 | `--text-2xl` 38px *(điện thoại)* · `--text-3xl` 56px *(≥ 768px)* | `--leading-tight` 1,1 | 0 |
| Tiêu đề section (H2) | Fraunces | 600 | `--text-xl` 28px · `--text-2xl` 38px | 1,1 | 0 |
| Tiêu đề khối (H3), tên tiệm | Fraunces | 600 | `--text-lg` 22px *(trạng thái mẻ trong panel: `--text-xl`)* | 1,1 | 0 |
| Thân | Commissioner | 400 · 500 · 600 *(nút)* | `--text-base` 17px | `--leading-normal` 1,6 | 0 |
| Nhãn trạng thái | IBM Plex Mono | 500 | `--text-xs` 13px, viết hoa | 1,4 | 0,18em |
| Giờ, giá, số điện thoại | IBM Plex Mono | 400 · 500 | theo dòng chứa nó | theo dòng | 0, `tabular-nums` |

**Thang:** lấy từ màn then chốt `concept/c.html`, gần tỉ lệ 1.333 *(13 · 14 · 17 · 22 · 28 · 38 · 56)* cộng một bậc hiển thị 144 · chữ hiển thị lớn nhất 144px = 8,47 lần chữ thân *(≥ 2,5; `_system.html` in 8.47)* · biến `--text-xs … --text-4xl` ở `tokens.css`.
**Đã kiểm dấu tiếng Việt:** `preflight.py --font "Fraunces" "Commissioner" "IBM Plex Mono"` → Fraunces VI · Serif · 100–900 · Commissioner VI · Sans Serif · 100–900 · IBM Plex Mono VI · Monospace · 100–700.

## 4. Hình khối
- **Bo góc:** `--radius-sm` 2px *(chip, liên kết)* · `--radius` 4px *(nút, khối tin nhắn, toast)* · `--radius-lg` 999px **chỉ** cho hai góc trên của vòm *(`.arch`: vòm màn đầu, ô cửa, khung ảnh mẻ)*. Ngoài vòm thì góc gần vuông như viên gạch. Không pill cho nút.
- **Bóng theo độ cao:** concept khoá *bóng none*. `--shadow-1` none *(thẻ đứng yên)* · `--shadow-2` viền 1px `--line` *(menu, popover)* · `--shadow-3` viền 1px `--line-strong` *(thanh dính)* · `--shadow-4` viền `--line-strong` + quầng màu nền 40px *(toast, hộp thoại)*. Độ cao diễn bằng mặt sáng dần `--bg` → `--surface` → `--muted-bg`.
- **Lớp:** `--z-sticky` 10 · `--z-dropdown` 20 · `--z-overlay` 30 · `--z-modal` 40 · `--z-toast` 50
- **Viền:** 1px `--line`; viền control `--line-strong`; cửa đang chọn viền ngoài 2px `--ink`; bậu lò 4px `--accent` dưới vòm và dưới hàng cửa · **Icon:** Phosphor Regular *(`@phosphor-icons/web`)*, một bộ, cỡ 1,25em cạnh chữ nút: `chat-circle-text` *(Zalo)*, `map-pin` *(đường đi)*, `copy`, `clock`, `check-circle`, `warning-circle`
- **Vật liệu của vòm** *(khoảnh khắc đọc lần hai của concept)*: `.fire` than hồng *(dải tròn `--primary-pressed` → `--primary` → `--primary` pha `--bg`; mẻ đang trong lò)* · `.brick` gạch *(`--accent`; chưa vào lò, lò nghỉ)* · `.ash` tro nguội *(`--bg`, viền `--line`, chữ `--muted`, giờ gạch ngang; đã hết)*. Chỉ ba vật liệu *(Cổng 3: "Giữ concept, chấp nhận ngoại lệ ở màn đó")*: `.ember` than còn ấm đã đề xuất ở câu 3, **không dùng**. Mẻ đã ra lò còn bánh: ô cửa `.brick` nhãn "Còn bánh"; vòm màn đầu là cửa gạch của mẻ kế, "Mẻ X còn bánh ở quầy" là dòng chữ dưới giờ *(ngoại lệ đã chấp nhận: lúc đó màn đầu không có chỗ sáng than hồng)*
- **Thang khoảng cách:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

## 5. Component · 8 trạng thái
Mọi component có mặt trên `site/_system.html`, CSS ở `site/assets/site.css` *(trang dùng đúng file này)*. Ô không áp dụng ghi `·`.

| Component | Mặc định | Hover | Focus | Nhấn | Tắt | Đang tải | Lỗi | Đang chọn |
|---|---|---|---|---|---|---|---|---|
| Nút chính `.btn-primary` | `--primary`, chữ `--on-primary` | `--primary-hover` | vòng `--ring` 2px, cách 2px | `--primary-pressed`, `scale(.98)` | · *(không có việc bị chặn)* | · *(không có việc bất đồng bộ)* | · | · |
| Nút viền `.btn-ghost` | nền trong, viền `--line-strong` | `--hover` | vòng `--ring` | `--pressed`, `scale(.98)` | · | · | · | · |
| Liên kết neo `.nav-link` | `--muted` | `--ink` trên `--hover` | vòng `--ring` | `--pressed` | · | · | · | `aria-current`: `--ink`, gạch chân 2px `--primary` |
| **Ô cửa vòm** `.door` *(tab)* | vật liệu theo trạng thái mẻ | nhấc 3px | vòng `--ring` 2px, cách 3px | nhấc 3px + `scale(.98)` | · *(mẻ đã hết vẫn mở xem được)* | · | · | nhấc 6px, viền ngoài 2px `--ink`; mở panel |
| Vòm màn đầu `.hero-arch` | vật liệu theo trạng thái trong ngày | · | · | · | · | · | · | · |
| Panel mẻ `.batch` | `--surface`, viền `--line`, mở 280ms | · | · | · | · | · | · | đã hết: `.is-gone` chữ `--muted`, tên món gạch ngang |
| Tin nhắn mẫu `.msg` + nút Chép | `--muted-bg` | theo nút | theo nút | theo nút | · | · | `--danger-text`: "Trình duyệt không cho chép…" | đã chép: `--success` |
| Toast `.toast` *(role=status)* | `--surface`, `--shadow-4`, hiện 4 giây | · | · | · | · | · | icon `--danger-text` | · |
| Chip giờ mở `.chip` | đang mở: `--success` trên `--success-soft` | · | · | · | · | · | · | đóng: `--muted` trên `--muted-bg` |
| Dòng minh hoạ `.hero-note` *(B3)* | `--muted`, `--text-sm`, dưới hàng nút màn đầu | · | · | · | · | · | · | · |
| Chân trang `.site-foot` *(B3)* | chữ `--muted` trên `--bg`, kẻ trên 1px `--line`, tên tiệm Fraunces `--ink` | · | · | · | · | · | · | · |

**Đang tải** không mượn kiểu của **Tắt**. **Vùng dữ liệu:** dữ liệu tĩnh, không tải nên không có đang tải · rỗng *(không mẻ nào trong ngày: thứ Hai, ngoài giờ)*: vòm gạch "Thứ Hai lò nghỉ · Mẻ đầu sáng thứ Ba", cửa vẫn bấm xem giờ và món · hết sạch: vòm tro "Hôm nay hết bánh · Mẻ đầu sáng mai", nút giữ bánh trỏ mẻ 6:00 hôm sau · lỗi: chỉ ở thao tác chép, báo cạnh chỗ chép.

## 6. Bố cục
- Một cột căn giữa, `max-width` 68rem *(1088px)*, lề 16px ở điện thoại, 32px từ 768px. Không lưới nhiều cột ở màn đầu *(khung concept: một vòm lớn căn giữa)*.
- **Màn đầu vừa khung:** vòm cao `min(52dvh, 32.5rem)`, rộng = cao × 0,8 và ≤ 86vw. H1 rộng tới khoảng 820px để ngắt đúng hai dòng ở 1440 *("Bốn mẻ bánh lò củi mỗi ngày." / "Mẻ nào hết là hết.")*. Màn đầu chỉ gồm vòm, H1, hàng nút, và một dòng chữ nhỏ "Giờ 8:40 thứ Bảy và trạng thái mẻ là minh hoạ" *(`.hero-note`, theo mục 8; thêm ở B3)*: tên tiệm ở đầu trang, đoạn giới thiệu chuyển xuống section cửa lò. Dự tính chiều cao: 1440×900 khoảng 785px, 390×844 khoảng 705px, nên nút giữ bánh nằm trong màn đầu *(ảnh concept `c-1440.png`: H1 3 dòng, nút dưới mép, nên sửa ở đây; B4 đo lại trên bản dựng)*.
- Hàng cửa: 4 cột bằng nhau, gap 8px *(16px từ 768px)*, rộng tối đa 36rem; chữ cửa theo bề rộng hàng *(`6cqi`)*. Panel mẻ: một cột, hai cột *(ảnh : chữ = 1 : 1,2)* khi khung `.cq` ≥ 40rem *(container query)*.
- Nội quy và giờ mở: một cột ở điện thoại, hai cột từ 768px, ngăn bằng đường kẻ `--line`.
- Dưới 768px: đầu trang chỉ còn tên tiệm *(trang ngắn, 4 section)*; nút trong panel giãn hết bề ngang.
- Nhịp section: cách nhau 80px *(điện thoại 64px)*; không section nền khác màu *(một nền)*.

## 7. Chuyển động
`--dur-fast` 150ms *(nút nhấn)* · `--dur-base` 200ms *(cửa nhấc, toast)* · `--dur-slow` 280ms *(panel mở, hiện dần)* · `--ease-out` cubic-bezier(.2, 0, 0, 1) · `--ease-emphasis` cubic-bezier(.16, 1, .3, 1). Chỉ animate `transform`, `opacity`. Cửa lò nhấc lên khi chọn để nói "cửa này đang mở"; panel trồi 10px khi đổi mẻ để thấy nội dung đã đổi; section hiện dần một lần khi cuộn tới *(IntersectionObserver)*. Không GSAP *(nhịp 4 < 8)*, không vòng lặp, không parallax. Nhánh `prefers-reduced-motion`: thời lượng về 0 *(`tokens.css`)*, `.reveal` hiện ngay.

## 8. Cấm riêng của dự án
- Không ảnh ly cà phê, góc sống ảo, đèn dây, chữ viết tay trang trí *(người dùng ghét kiểu quán cà phê sống ảo)*.
- Không lửa động, khói, tia lửa, video lò cháy: ánh lửa chỉ là dải màu tĩnh trong lòng vòm.
- Không quá một vòm `.fire` trên một màn: than hồng chỉ cho mẻ đang trong lò.
- Không gọi giờ, trạng thái mẻ, giờ hết bánh là thật khi chưa nối dữ liệu: luôn kèm nhãn *minh hoạ*.
- Không viết "đặt hàng", "đặt bánh", "mua online": tiệm **giữ bánh** qua Zalo, trả tiền tại quầy.
- Không đếm ngược từng giây: giờ mẻ kế ghi theo phút, chỉ đếm khi còn dưới 60 phút.
- Không pill, không bóng đổ cho thẻ, không thẻ bo tròn có viền màu bên trái.

## 9. Sơ đồ trang
| Bề mặt | Trang / màn | Section theo thứ tự | Hành động chính | Dữ liệu cần |
|---|---|---|---|---|
| Web | `site/index.html` *(màn then chốt: `concept/c.html`)* | 1. **Đầu trang**: tên tiệm · neo Mẻ hôm nay, Nội quy, Đường đi *(≥ 768px)* | · | Tên tiệm |
| | | 2. **Màn đầu**: vòm ôm mẻ kế *(5 trạng thái trong ngày)* · H1 "Bốn mẻ bánh lò củi mỗi ngày. Mẻ nào hết là hết." · nút Giữ bánh qua Zalo · nút Xem đường đi | **Giữ bánh qua Zalo** | Giờ hiện tại *(minh hoạ 8:40, đổi bằng `?gio=`, `?thu=`)*, lịch 4 mẻ, trạng thái mẻ *(minh hoạ)* |
| | | 3. **Bốn lần mở cửa lò** *(tương tác đặc trưng)*: đoạn giới thiệu lò củi · hàng 4 ô cửa vòm · panel mẻ: ảnh chờ, trạng thái, 4 món và giá, tin nhắn mẫu + Chép, nút Giữ bánh mẻ X qua Zalo | Giữ bánh đúng mẻ | 4 mẻ, 4 món + giá thật, món của từng mẻ *(giả định: đủ 4 món)*, câu mẫu theo mẻ |
| | | 4. **Nội quy cạnh lò · Giờ mở và đường đi**: nội quy 3 dòng · chip đang mở/đóng · giờ mở · địa chỉ · Zalo · nút Xem đường đi · ảnh chờ mặt tiền | Xem đường đi *(Google Maps)* | Giờ mở 5:30-19:00, nghỉ thứ Hai, địa chỉ, Zalo 0909 123 456 |
| | | 5. **Chân trang**: tên tiệm · địa chỉ · Zalo · dòng "giờ và trạng thái mẻ là minh hoạ" | · | như trên |

**Màn then chốt:** `concept/c.html` là màn đầu và section 3 của sơ đồ. Thứ đổi so với concept: vòm cao theo khung; đoạn giới thiệu và nhãn "Lò củi · 4 mẻ mỗi ngày" rời màn đầu; thêm tin nhắn mẫu; vòm có đủ trạng thái trong ngày *(trạng thái "còn bánh": cửa gạch của mẻ kế và một dòng chữ, Cổng 3)*.

## Lịch sử
| Ngày | Đổi gì | Vì sao |
|---|---|---|
| 04/10/2026 | Bản đầu, trình Cổng 3 | B2 |
| 05/10/2026 | Khoá. Bỏ vật liệu `.ember` *(CSS, `_system.html`)*; mẻ còn bánh dùng `.brick` | Cổng 3 câu 3: "Giữ concept, chấp nhận ngoại lệ ở màn đó" |
| 05/10/2026 | Thêm `.hero-note` và `.site-foot` vào mục 5, 6 và `_system.html` | B3: nhãn minh hoạ ở màn đầu theo mục 8; chân trang theo sơ đồ mục 9 |
