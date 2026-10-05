# Luật nền · danh sách cấm · xử mâu thuẫn · yêu cầu kỹ thuật

> Thứ tự ưu tiên *(SKILL.md mục 2)*: **sàn không thương lượng** → **input người dùng** → **luật của họ phong cách** → **nền chung (file này)**.

---

## A. Nền chung — áp mọi họ phong cách

### A.1 Sàn không thương lượng
| Luật | Ngưỡng |
|---|---|
| Tương phản chữ | ≥ 4.5:1 cho chữ thân · ≥ 3:1 cho chữ lớn *(≥ 24px, hoặc ≥ 18,66px và đậm ≥ 700)* · áp cả **nút, placeholder, focus ring, chữ lỗi** · viền control và vòng focus ≥ 3:1 |
| Màu theo ý định | Nút nguy hiểm *(xoá, huỷ việc gì, thu hồi, đặt lại)* dùng `--destructive` ở **mọi** chỗ, cả nút mở lẫn nút xác nhận; không bao giờ `--primary`. Nút đồng ý không mang màu nguy hiểm |
| Bề mặt dẫn xuất | Chữ trên lớp phủ trong suốt, dải chuyển, nền nhạt cũng phải đạt ngưỡng. Đo trên nền thật *(bộ kiểm đo)*, không chỉ tin cặp token gốc |
| Vùng chạm | ≥ 44×44px, cách nhau ≥ 8px |
| Bàn phím | Mọi thứ bấm được đều tab tới được · focus ring nhìn thấy · `Esc` đóng lớp phủ · modal khoá focus |
| Chuyển động | Mọi animation có nhánh `@media (prefers-reduced-motion: reduce)` tắt về tĩnh |
| Tràn ngang | 0 ở mọi khổ từ 320px |
| Tiếng Việt | Mọi font hiển thị chữ Việt **phải có subset `vietnamese`** · `<html lang="vi">` |
| Hiệu năng | Chỉ animate `transform`/`opacity` · `backdrop-blur` chỉ ở lớp cố định · grain/noise chỉ ở pseudo-element `fixed` + `pointer-events:none` · `min-h-[100dvh]` thay `h-screen` |

### A.2 Nhất quán — khoá một lần, dùng cả trang
- **Một nền** cho cả trang, không lật sáng/tối giữa chừng *(trừ khi chủ đích và chỉ một lần)*.
- **Một màu nhấn**, độ bão hoà < 80 %, dùng giống nhau ở mọi section.
- **Một hệ bo góc** *(tất cả vuông · tất cả mềm 12–16 · pill cho phần tương tác)*. Pha trộn thì phải ghi luật trong `DESIGN.md`.
- **Một họ xám** *(ấm hoặc lạnh, không cả hai)*.
- **Một bộ icon**, một độ dày nét.
- **Một giọng văn**.
- **Mọi theme** chung một bộ tên biến; theme chỉ khác giá trị *(D.2)*.

### A.3 Trạng thái
- **Control:** 8 trạng thái: mặc định · hover · focus *(vòng `--ring` nhìn thấy)* · nhấn *(active `scale(.98)`)* · tắt · đang tải *(nếu bất đồng bộ; giữ độ đậm, thêm spinner, không mượn kiểu tắt)* · lỗi *(nếu nhận dữ liệu)* · đang chọn *(nếu chọn được)*.
- **Vùng dữ liệu:** đang tải *(skeleton đúng hình, không spinner tròn)* · rỗng *(nói cách lấp đầy)* · lỗi *(cạnh chỗ lỗi; toast chỉ cho việc thoáng qua)*.
- Control mang trạng thái *(`aria-pressed`, `aria-expanded`, `aria-selected`…)* phải **đổi thật** khi bấm, và **nhìn khác** khi trạng thái đổi. Lượt kiểm sâu bấm thử từng control.

### A.4 Form
Nhãn **ở trên** ô nhập · chữ gợi ý (tuỳ chọn) · lỗi **ở dưới** · **không** dùng placeholder thay nhãn.

### A.5 Câu chữ giao diện
> Rút từ `ux-writing` của `plugin87/ux-ui-agent-skills` *(MIT; nguồn ở `THIRD_PARTY_LICENSES.md`)*.
- Nút bắt đầu bằng động từ, nói kết quả: *Lưu thay đổi*, *Gửi yêu cầu*. Không *OK*, không *Xác nhận* trơn.
- Hộp thoại xác nhận: tiêu đề hỏi, nút trả lời bằng đúng hành động và đối tượng *("Huỷ đơn DH-1042?" · **Huỷ đơn** · Giữ đơn)*. Việc không đảo ngược được mà nặng *(xoá tài khoản)*: gõ lại tên để xác nhận.
- Thông báo lỗi: chuyện gì xảy ra · vì sao · làm gì tiếp. Không mã lỗi trơn, không đổ lỗi cho người dùng.
- Trạng thái rỗng: vùng này để làm gì · hành động đầu tiên. Không *"Không có dữ liệu"* trơn.

---

## B. Danh sách cấm (dấu hiệu AI)

**Hình ảnh:** gradient tím/xanh "công nghệ" · glow neon mặc định · `#000000` thuần · chữ gradient cho tiêu đề lớn · con trỏ chuột tự chế · kiểu lười *nền `#0D1117` + neon xanh/tím* · thẻ bo tròn có viền màu bên trái.

**Bố cục:** 3 thẻ tính năng bằng nhau · zigzag ảnh–chữ quá 2 section liên tiếp · một họ bố cục dùng lại ở 2 section · bento có ô trống · menu desktop 2 dòng · màn đầu tràn khung phải cuộn mới thấy CTA · tiêu đề trái + đoạn nhỏ trôi ở góc phải.

**Nhãn và trang trí:** nhãn đánh số *"SECTION 01"*, *"001 · Tính năng"* · eyebrow trên mọi tiêu đề *(trần 1/3 số section, với site giới thiệu)* · *"Cuộn để khám phá"* · chấm màu trang trí trước mọi dòng · nhãn phiên bản *"BETA v0.6"* ở màn đầu · dải giờ/thành phố/thời tiết · nhãn đè lên ảnh · chú thích tác giả ảnh giả.

**Nội dung:** `Lorem ipsum` · *John Doe, Nguyễn Văn A* · *Acme, Nexus* · số tròn giả *(99,99 %, 50 %)* · độ chính xác bịa *(4,1×, 48k)* không có nguồn · sáo ngữ *Nâng tầm, Liền mạch, Đột phá, Kỷ nguyên mới, Giải phóng tiềm năng, Elevate, Seamless, Unleash* · thông báo *"Oops!"*, dấu chấm than trong thông báo thành công · 2 CTA cùng ý định với nhãn khác nhau.

**Tài sản:** emoji làm icon · SVG tự vẽ người/cảnh/sản phẩm · màn hình sản phẩm giả dựng bằng `div` trong màn đầu · tường logo toàn chữ trơn · link Unsplash hỏng.

**Chữ hiển thị trên giao diện:** không dùng gạch dài `—` hoặc `–` làm dấu ngắt *(`design-taste-frontend` §9.G)*. Dùng dấu chấm, phẩy, hai chấm hoặc xuống dòng. Khoảng số dùng `-` *(`08:00-09:00`)*. **Luật này chỉ áp cho chữ trong sản phẩm**, không áp cho tài liệu.

---

## C. Mâu thuẫn giữa các skill nguồn — đã xử

| # | Mâu thuẫn | Nguồn A | Nguồn B | **Xử** |
|---|---|---|---|---|
| 1 | **Icon** | Skill này ở v1 *(tên cũ `huashu-pro-max`)*: Lucide | `high-end-visual-design`, `minimalist-ui`, `design-taste-frontend`: cấm Lucide làm mặc định | Mặc định **Phosphor** *(có sẵn ở `ui-ux-pro-max/data/phosphor-icons-upstream.json`)*. **Lucide được phép** cho họ *Công cụ vận hành* và khi dự án đã dùng Lucide |
| 2 | **Serif hiển thị** | `stitch-design-taste`: *Fraunces, Instrument Serif* | `design-taste-frontend`: **cấm** đúng hai font đó làm mặc định | Serif **chỉ** dùng cho *Editorial*, *Hàng hiệu*, hoặc khi brand nêu. **Instrument Serif bị loại** vì **không có dấu tiếng Việt**. Dùng Newsreader / Playfair Display / Cormorant Garamond / Noto Serif Display |
| 3 | **Inter** | `stitch`, `high-end`, `minimalist`: cấm | `design-taste-frontend`: cho phép với *trust-first*, *Linear-style* | Không dùng làm mặc định. **Được dùng** cho họ *Tin cậy* và *Công cụ vận hành* |
| 4 | **Font gợi ý** | `gpt-taste`, `redesign`, `stitch`: Satoshi, Cabinet Grotesk, **Outfit**, Clash | Sàn A.1: phải có dấu tiếng Việt | Satoshi/Cabinet/Clash *(Fontshare)* và **Outfit, Syne, Sora, DM Sans, Figtree, Onest, Orbitron, Rajdhani, Archivo Black, Bodoni Moda** *(Google)* **không có subset `vietnamese`** → loại khi site có chữ Việt. Thay bằng Geist, Be Vietnam Pro, Plus Jakarta Sans, Bricolage Grotesque, Unbounded, Epilogue, Chakra Petch |
| 5 | **Eyebrow** | `high-end-visual-design` §4.C: eyebrow trước mọi H1/H2 | `design-taste-frontend` §4.7: tối đa 1 trên 3 section | Theo `design-taste`: **≤ ⌈số section / 3⌉**. `preflight.py` đếm |
| 6 | **Vi chuyển động vô hạn** | `stitch-design-taste`: *mọi component đang hoạt động có vòng lặp vô hạn* | `design-taste-frontend`: chuyển động phải giải thích được bằng một câu | Theo `design-taste`. Vòng lặp chỉ cho **trạng thái thật** *(đang ghi âm, đang đồng bộ, live)* |
| 7 | **Bo góc** | `high-end`: `rounded-[2rem]` + vỏ lồng hai lớp | `minimalist-ui`: ≤ 12px · `industrial-brutalist`: 0 | Theo **họ phong cách** đã chọn. Trong một trang chỉ **một hệ** (A.2) |
| 8 | **Bóng đổ** | v1: `shadow-sm/md` | `minimalist`, `high-end`: cấm `shadow-md`, bóng < 0.05 | Bóng **nhuốm màu nền**, khuếch tán. Không bóng đen thuần. Mật độ ≥ 7 thì bỏ thẻ, dùng đường kẻ |
| 9 | **Màn đầu căn giữa** | `stitch`: cấm khi V > 4 | `gpt-taste`: *Cinematic Center (Highly Preferred)* | V ≤ 4 → được. V > 4 → chỉ khi thông điệp chính là thiết kế *(tuyên ngôn, ra mắt)*. Ghi lý do |
| 10 | **Nền trơn** | `design-taste`, `redesign`, `minimalist`: section không được trơn phẳng, thêm ảnh/grain/gradient | Họ *Công cụ vận hành*, *Tin cậy* | Áp cho site giới thiệu. **Không áp** cho web app. Trang trí nền ở web app là nhiễu |
| 11 | **Dark mode** | `design-taste` §6.C: bắt buộc hai chế độ cho trang tiêu dùng | Cổng 2 câu 2 | Mặc định **một nền**, như concept. Chế độ tối *(hay sáng, nếu concept là nền tối)* chỉ làm khi người dùng xin, ở brief hoặc Cổng 2 |
| 12 | **Ảnh** | `design-taste` §4.8: **bắt buộc** dùng công cụ sinh ảnh nếu có | `huashu-design`: ảnh thật > sinh ảnh > placeholder trung thực | Thứ tự ở SKILL.md mục 6: **ảnh thật của người dùng trước**, sinh ảnh thứ hai |
| 13 | **Ngẫu nhiên bố cục** | `gpt-taste`: *giả lập Python random* để chọn bố cục | `huashu-design`: đưa 3 hướng cho **người dùng** chọn | Không bốc ngẫu nhiên. Dùng **ba nguồn concept** và **động cơ biến thể** để 3 concept khác nhau, rồi **người dùng** chọn ở Cổng 2 *(`sketch-to-concept`)* |
| 14 | **Hỏi bao nhiêu** | `design-taste` §0.C: hỏi **đúng 1** câu, suy được thì đừng hỏi | Yêu cầu của bộ kit: dừng ở 4 cổng *(2 ở `sketch-to-concept`, 2 ở skill này)* | Hai điều cùng đúng: **4 cổng là bắt buộc**, còn **trong mỗi cổng** chỉ hỏi thứ không suy ra được |
| 15 | **Stack** | `design-taste`, `gpt-taste`: React / Next / Motion | Prototype một file mở bằng trình duyệt | Mặc định **HTML + Tailwind CDN + JS thuần**. Người dùng muốn React/Next thì hỏi ở Cổng 3 và theo `design-taste` §3 |
| 16 | **Font app mobile** | Quy ước nền tảng: SF Pro *(iOS)*, Roboto *(Android)* | Dòng 3: không dùng Inter làm mặc định | Có font thương hiệu *(đã kiểm tiếng Việt)* thì dùng cho mọi bề mặt. Không có thì font nền tảng: iOS `-apple-system`, **Inter chỉ để thay SF Pro** khi xem trên máy không phải Apple; Android Roboto. Cả hai có subset `vietnamese` |

---

## D. Yêu cầu kỹ thuật — B3

### D.1 `<head>`
```html
<html lang="vi">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title><meta name="description" content="…">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=<Font>:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/@phosphor-icons/web"></script>   <!-- hoặc lucide nếu họ phong cách cho phép -->
```

### D.2 Token: themes.json → themes.css, tokens.css → CSS variables → Tailwind
**Ba file, nạp ở mọi trang, trong `<head>`, theo thứ tự:**
```html
<script src="assets/theme.js"></script>             <!-- không defer: đặt data-theme trước khi vẽ -->
<link rel="stylesheet" href="assets/tokens.css">    <!-- thang không màu: chữ, bóng, bo góc, chuyển động, lớp -->
<link rel="stylesheet" href="assets/themes.css">    <!-- màu theo theme: sinh từ themes.json, không sửa tay -->
<script>tailwind.config={theme:{extend:{colors:{bg:'var(--bg)',surface:'var(--surface)',ink:'var(--ink)',muted:'var(--muted)',line:'var(--line)',primary:'var(--primary)','on-primary':'var(--on-primary)',accent:'var(--accent)',destructive:'var(--destructive)'},borderRadius:{sm:'var(--radius-sm)',DEFAULT:'var(--radius)',lg:'var(--radius-lg)'},fontFamily:{sans:'var(--font-body)'}}}}</script>
```

**Tên biến là hợp đồng chung của kit.** `templates/color.js` giữ danh sách (`SEEDS`, `OPTIONAL`, `DERIVED`, `PAIRS`); `templates/mobile/app.css` và khối CSS của bảng concept dùng cùng tên:
- **Màu gốc**, khai trong `themes.json` cho từng theme: `--bg --surface --ink --muted --line --primary --on-primary --accent --on-accent --destructive --on-destructive`. Tuỳ chọn: `--success --warning --info --ring --muted-bg`.
- **Vai dẫn xuất**, `themes.mjs` tính, không khai tay: `--primary-hover --primary-pressed --accent-hover --accent-pressed --destructive-hover --destructive-pressed --hover --pressed --selected --primary-soft --muted-bg --card-foreground --line-strong --ring --link --success --success-soft --warning --warning-soft --info --info-soft --danger-text --danger-soft --scrim`.
- **Thang không màu**, ở `tokens.css`: `--text-xs … --text-4xl --leading-tight --leading-normal --font-display --font-body --font-mono --brand-font --shadow-1 … --shadow-4 --shadow --radius-sm --radius --radius-lg --dur-fast --dur-base --dur-slow --ease-out --ease-in --ease-emphasis --z-sticky --z-dropdown --z-overlay --z-modal --z-toast --disabled-opacity`.
- **Biến của theme:** `--theme-list --theme-default-light --theme-default-dark` ở `:root`; `--theme-name`, `--theme-mode` và `color-scheme` trong từng khối theme.

**Theme:** mọi theme *(sáng, tối, theme thương hiệu)* là một giá trị của `data-theme` trên `<html>`, ngang hàng nhau.
- `?theme=<tên>` ép một theme cho cả phiên, để demo và để bộ kiểm chụp đúng theme. `?theme=system` bỏ ép, về theo máy.
- Không ép thì theo `default` trong `themes.json`: theme cho máy để chế độ sáng, theme cho máy để chế độ tối.
- Nút đổi theme gọi `theme.set('<tên>')` hoặc `theme.toggle()` *(đổi giữa mặc định sáng và tối)*. `theme.list()` trả danh sách theme.
- **Thêm theme:** thêm một mục vào `themes` *(tên a-z, 0-9, dấu gạch ngang; `mode` sáng hay tối; `seeds`)* → `node <skills>/sketch-to-site/scripts/themes.mjs <thư-mục-prototype>` → `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update`, lệnh này in dòng cần thêm vào `qa.config.json`.
- Vai dẫn xuất sai ý thiết kế: ghi giá trị vào `overrides` của theme đó; vẫn được đo.

Dự án làm trước v4.2 *(khối `:root` và `[data-theme="dark"]` viết tay, chưa có `themes.json`)* vẫn chạy như cũ. Muốn chuyển: chép màu gốc sang `themes.json`, chạy `themes.mjs`, thay khối viết tay bằng ba dòng nạp ở trên.

### D.3 Tương tác tối thiểu *(JS thuần, không thư viện)*
- Tab `[data-tab-target]` · modal/drawer `[data-modal-open]` `[data-modal-close]` + `Esc` + trả focus về nút mở · lọc/tìm trên bảng · toast `role="status"` · menu di động.
- Hiện dần khi cuộn: **`IntersectionObserver`**, so le bằng `--i`. **Cấm** `window.addEventListener('scroll')`.
- Nút giả lập gửi form: đang tải → thành công/lỗi. Không `alert()`.
- Link chưa có đích: `aria-disabled="true"` kèm kiểu vô hiệu, **không** `href="#"` trơn.

### D.4 Ngữ nghĩa và SEO *(site giới thiệu)*
`<header> <nav> <main> <section aria-labelledby> <footer>` · một `<h1>` · link *"Bỏ qua tới nội dung"* · `alt` mô tả thật · favicon · `og:title` `og:description` `og:image`.

### D.5 Dữ liệu dùng chung *(web app, hoặc từ 2 trang cùng đọc một loại dữ liệu)*
- Dữ liệu mẫu ở `assets/data.js`: `window.SEED = {…}`, nạp bằng `<script>`. **Không** `fetch('data.json')`: trang mở bằng `file://` thì trình duyệt chặn.
- Mọi trang đọc và ghi qua `assets/store.js`, chép từ `templates/store.js`: `store.get(k)` · `store.set(k, v)` · `store.update(k, fn)` · `store.on(fn)`. Đổi `KEY` trong file thành slug của dự án.
- Trang **không** giữ bản dữ liệu riêng. Danh sách, số đếm, tổng tiền đều tính từ store: tạo đơn ở `form.html` thì `orders.html` và số trên dashboard phải đổi theo.
- Ghi xong thì vẽ lại phần liên quan, hoặc đăng ký `store.on` để tự vẽ lại.
- Muốn demo lại từ đầu: thêm `?reset` vào URL. Ghi cách này vào báo cáo Cổng 4.
- Trang đọc tham số URL *(chi tiết theo `?id=`)*: khai báo mẫu trong `<head>` bằng `<meta name="qa-query" content="?id=<mã có trong data.js>">`. `run.mjs` đọc thẻ này ở mỗi lần chạy để bộ khói mở trang có nội dung *(sửa thẻ là lần chạy sau nhận, không sửa file bước)*; thiếu thì `qa_init.py` in CẢNH BÁO. Trang có trạng thái khác theo tham số *(giờ, ngày, giỏ rỗng)* thì khai thêm `<meta name="qa-states" content="?gio=7:00 | ?thu=2">`: bộ khói đo và chụp màn đầu từng trạng thái.
- Kiểm luồng xuyên trang trong **một** bộ kiểm: bước `js` ghi dữ liệu rồi `location.href = 'orders.html'`, `wait` ≥ 1500, rồi `check` trên trang mới. Mỗi bộ chạy với hồ sơ trình duyệt mới nên luôn bắt đầu từ dữ liệu mẫu, mốc không trôi.

**Kịch bản dữ liệu:** `?data=empty` làm rỗng mọi danh sách, `?data=stress` sinh danh sách ≥ 40 mục với chữ dài và số lớn *(muốn dữ liệu dài của riêng dự án thì khai `window.SEED_STRESS` trong `data.js`)*. Hai kịch bản không đụng dữ liệu demo. Bộ kiểm có sẵn một bộ cho mỗi kịch bản.

### D.6 Màn app mobile
Khuôn ở `templates/mobile/`, luật ở `mobile-app.md`. Khác trang web ở: `<html data-surface="app" data-platform="…">` · viewport có `viewport-fit=cover` · token nạp từ `assets/tokens.css` và `assets/tw.js` · `app.css` + `app.js` *(trong `<head>`)* · khung `.app` › `.app-nav` · `.app-body` · `.app-tabs`. Tương tác tối thiểu D.3 vẫn áp; lớp phủ dùng sheet của khuôn.

### D.7 Biểu đồ và dashboard *(khi sản phẩm có màn nhiều số)*
> Rút từ `data-dashboard` của `plugin87/ux-ui-agent-skills` *(MIT; nguồn ở `THIRD_PARTY_LICENSES.md`)*.
- Màu chuỗi lấy từ `--chart-n` *(`themes.json`, khoá `chart`)*, mỗi màu ≥ 3:1 trên `--surface`. Không dùng màu chính, màu báo cho chuỗi. Màu biểu đồ **không phải màu chữ**: chữ và nhãn trên biểu đồ dùng `--ink`, `--muted`.
- Chuỗi phân biệt bằng cả hình *(nét đứt, điểm, nhãn trực tiếp)*, không chỉ bằng màu.
- Nhãn hạng mục nằm trên hình *(dưới cột, cạnh đường)*, không chỉ trong `aria-label`. Mỗi biểu đồ có `<figcaption>` hoặc bảng số tóm tắt cho trình đọc màn hình.
- Bố cục: một con số dẫn *(to nhất)*, rồi các phần khác hình dạng nhau; không bốn thẻ bằng nhau. Trong một hàng lưới, ô thấp hơn ô bên cạnh phải lấp chỗ trống *(`grid-template-rows:auto minmax(0,1fr)`)*, không để khoảng trắng dưới đáy.
- Bảng dày trên điện thoại: bỏ cột phụ bằng media query và ghi lý do; không thu chữ dưới thang.
- Nhịp xuất hiện lệch nhau lấy từ token: `calc(var(--dur-fast) * .6 * n)`.

---

## E. Bản địa hoá tiếng Việt

- **Tiền:** `1.250.000 ₫` hoặc `1.250.000 đ`, chọn một và dùng cả site. Không `$`.
- **Ngày giờ:** `thứ Hai, 23/09/2026` · `08:30` · khoảng `08:00-09:00`.
- **Số:** dấu chấm ngăn hàng nghìn, dấu phẩy thập phân: `47,2 %`.
- **Tên người:** họ tên Việt đa dạng *(Trần Minh Khoa, Lê Thị Hồng Nhung, Phạm Gia Bảo)*, tránh *Nguyễn Văn A*. Có tiếng nước ngoài thì trộn tự nhiên.
- **Địa chỉ, SĐT:** định dạng Việt (`0905 214 387`), không dùng số thật của người thật.
- **Chữ hoa có dấu:** kiểm `leading` đủ cho dấu mũ và dấu nặng. Chữ hoa + tracking âm dễ **cắt dấu** (`Ấ`, `Ỗ`), nên chụp kiểm.
- **Độ dài:** tiếng Việt thường dài hơn tiếng Anh 20–30 %. Nhãn nút phải vừa **một dòng** ở desktop.
- **Ngôn ngữ làm việc** của dự án *(glossary, thuật ngữ cấm)* đứng trên mọi gợi ý chữ của skill này.

---

## F. Nhận góp ý và yêu cầu sửa

Dùng ở `sketch-to-site` Cổng 4 *(Sửa theo danh sách)*, `evolve-site` Cổng 3 *(Chỉnh sửa chi tiết)*, `tweak-site`, và `handover-check` *(khi người dùng chọn Sửa ở cổng nghiệm thu bàn giao)*. Rút từ `superpowers` *(receiving-code-review)*.

1. **Đọc hết danh sách trước khi sửa mục nào.** Mục nào chưa rõ thì hỏi **tất cả** mục chưa rõ trong một lượt, trước khi làm. Đừng làm xong phần rõ rồi mới hỏi phần còn lại: các mục thường dính nhau.
2. **Soát từng mục trước khi làm**, theo thứ tự ưu tiên ở mục 2 của `sketch-to-site`:
   - Trái **sàn** *(sàn không thương lượng ở `sketch-to-site` mục 2, điểm 1)*: nói rõ vì sao, đề xuất cách đạt ý người dùng mà vẫn giữ sàn. Không làm bản trái sàn.
   - Đụng thứ **đã khoá** ở một cổng *(concept, token, sơ đồ trang)*: nói rõ là mở lại cổng nào, hỏi trước khi làm.
   - Trái tài liệu yêu cầu hay glossary: dẫn chỗ trái, hỏi.
   - Còn lại: làm.
3. **Không trả lời xuôi.** Không viết *"vâng, đã sửa hết"*. Mỗi mục báo một dòng: đã làm gì, `file:dòng`, kết quả kiểm. Mục không làm thì nêu lý do.
4. **Thứ tự làm:** mục gây lỗi hay sai nghiệp vụ trước, rồi mục đơn giản, rồi mục phức tạp. Kiểm sau từng mục hoặc từng nhóm nhỏ, không dồn tới cuối.
5. **Góp ý của người thứ ba** *(khách của người dùng, đồng nghiệp)*: coi là đề xuất. Đối chiếu với yêu cầu và các quyết định đã ghi; mâu thuẫn với lời người dùng thì hỏi người dùng.
6. **Mình đã sai thì sửa**, nói ngắn đã sửa gì. Không xin lỗi dài, không bào chữa.
