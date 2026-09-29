# Kho họ phong cách — dùng ở `sketch-to-concept` (A2, A3, Cổng 2)

> Kho này là **giàn giáo**, không phải thực đơn bắt buộc. Có brand, concept hay dữ liệu thật thì thiết kế mọc từ đó; kho chỉ giúp đặt tên và đưa lựa chọn cho người dùng.
> **Dial** ghi theo thứ tự **V/M/D**: `DESIGN_VARIANCE` (1 đối xứng → 10 phá lưới) · `MOTION_INTENSITY` (1 tĩnh → 10 điện ảnh) · `VISUAL_DENSITY` (1 phòng tranh → 10 buồng lái). Định nghĩa đủ ở `design-taste-frontend` §7.
> **Font** trong bảng đều đã kiểm là **có subset `vietnamese`** trên Google Fonts, trừ chỗ ghi ⚠️. Kiểm lại bằng `scripts/preflight.py --font "<tên>"`.
> **App mobile:** họ phong cách chỉ quyết **token** *(màu, chữ, bo góc, không khí, ảnh)*. Phần bố cục của họ *(màn đầu, section, bento, marquee)* không áp cho màn app; theo `mobile-app.md` mục 5.

---

## Chọn họ cho 3 concept

1. Lấy **loại sản phẩm** (Cổng 1) → cột *Hợp với*.
2. Lấy **từ khoá không khí** của người dùng và của tham chiếu → cột *Nhận diện qua từ*.
3. Họ hợp nhất là nguồn của **concept A** *(`sketch-to-concept/references/concept-method.md` mục 3)*. Concept B và C có thể thuộc họ khác. Concept khuyến nghị đặt đầu, ghi *(Khuyến nghị)*, và lý do khuyến nghị phải nêu được bằng **dữ kiện của dự án**, không phải bằng gu.
4. Ở Cổng 2, `preview` mỗi lựa chọn viết theo khuôn 5 dòng: **Ý** · **Màu** · **Chữ** · **Màn then chốt** · **Giống kiểu**.

---

## 12 họ phong cách

### 1. Hiện đại tối giản
- **Nhận diện qua từ:** hiện đại, tối giản, sạch, gọn, Notion, Linear, Vercel
- **Hợp với:** SaaS, công cụ, dịch vụ chuyên nghiệp, site doanh nghiệp nhỏ
- **Dial:** 5/3/3
- **Màu:** nền trắng hoặc trắng ngà; chữ than chì `#111`–`#2F3437`; **một** màu nhấn; pastel nhạt cho tag
- **Chữ:** Geist / Be Vietnam Pro / Inter Tight + Geist Mono cho số liệu
- **Bố cục:** lưới bento phẳng, viền 1px `#EAEAEA`, bo 8–12px, khoảng trắng lớn, `kbd` cho phím tắt
- **Chuyển động:** hiện dần khi cuộn 600ms, `scale(.98)` khi bấm
- **Cấm riêng:** đổ bóng đậm, gradient, nền màu lớn, bo `rounded-full` cho thẻ
- **Đọc sâu:** `minimalist-ui` (toàn bộ)

### 2. Editorial · Tạp chí
- **Nhận diện qua từ:** tạp chí, biên tập, kể chuyện, blog, báo, văn hoá, sang trọng kín đáo
- **Hợp với:** blog, truyền thông, bất động sản, du lịch, văn hoá
- **Dial:** 6/4/3
- **Màu:** giấy ấm và mực; tránh bộ *kem + đồng thau + nâu espresso* nếu brand không nêu *(xem `design-taste-frontend` §4.2)*
- **Chữ:** serif hiển thị Newsreader / Playfair Display / Cormorant Garamond + sans Be Vietnam Pro. ⚠️ **Instrument Serif không có dấu tiếng Việt**
- **Bố cục:** lưới bất đối xứng, cột chữ ≤ 65ch, ảnh tràn lề, chú thích dưới ảnh
- **Chuyển động:** ít, chỉ để dẫn nhịp đọc
- **Đọc sâu:** `minimalist-ui` §3 · `high-end-visual-design` §3.A *Editorial Luxury*

### 3. SaaS · Công nghệ cao cấp
- **Nhận diện qua từ:** công nghệ, AI, startup, Linear-tier, Apple-like, cao cấp, kính mờ
- **Hợp với:** landing sản phẩm số, nền tảng, API
- **Dial:** 7/6/4
- **Màu:** hai lối: *đen OLED `#050505` + quầng màu rất nhẹ* hoặc *trắng bạc + bóng khuếch tán*. **Không** dùng kiểu lười *nền xanh đen `#0D1117` + neon xanh/tím*
- **Chữ:** Geist / Plus Jakarta Sans / Space Grotesk, tracking âm cho tiêu đề
- **Bố cục:** bento bất đối xứng, **vỏ lồng hai lớp** (double-bezel), nút pill kèm icon lồng trong vòng tròn, thanh menu nổi dạng đảo
- **Chuyển động:** `cubic-bezier(0.32,0.72,0,1)`, hiện lên kèm blur, menu hiện so le
- **Đọc sâu:** `high-end-visual-design` §3–§5 · `design-taste-frontend` §5

### 4. E-commerce hàng hiệu · Luxury
- **Nhận diện qua từ:** hàng hiệu, cao cấp, thời trang, mỹ phẩm, trang sức, boutique, xa xỉ
- **Hợp với:** thời trang, làm đẹp, nội thất, rượu, đồng hồ, khách sạn
- **Dial:** 7/5/3
- **Màu:** **xoay vòng**, đừng mặc định kem + đồng: *Lạnh sang* (bạc, chrome, khói) · *Rừng* (xanh sâu, xương, hổ phách) · *Đen và da bò* · *Cobalt và kem* · *Đơn sắc + một điểm rực*
- **Chữ:** serif sắc Bodoni-kiểu ⚠️ *(Bodoni Moda không có dấu Việt → dùng Playfair Display / Noto Serif Display)* + sans mảnh Be Vietnam Pro
- **Bố cục:** ảnh sản phẩm là nhân vật, khoảng trắng rất rộng, lưới sản phẩm thưa, thông số gom thành cụm, **không** kẻ dòng mọi hàng
- **Chuyển động:** chậm và nặng; zoom ảnh khi rê chuột trong khung `overflow-hidden`
- **Cấm riêng:** badge *"Giảm 50%"* đỏ chói, đếm ngược giả, nhãn đè lên ảnh
- **Đọc sâu:** `design-taste-frontend` §4.2 *(luật cấm bảng màu mặc định)*, §4.9 *(bảng thông số)*

### 5. E-commerce đại chúng · Tối ưu chuyển đổi
- **Nhận diện qua từ:** bán hàng, khuyến mãi, chuyển đổi, Shopee/Tiki-like, nhiều sản phẩm, giá tốt
- **Hợp với:** bán lẻ nhiều SKU, F&B, dịch vụ đặt chỗ
- **Dial:** 5/4/6
- **Màu:** một màu thương hiệu mạnh + trung tính; màu ngữ nghĩa rõ cho giá, còn hàng, giảm giá
- **Chữ:** Be Vietnam Pro / Plus Jakarta Sans, số giá dùng `tabular-nums`
- **Bố cục:** tìm kiếm nổi bật, lọc theo facet, thẻ sản phẩm đồng đều, **nút CTA thẳng hàng đáy thẻ**, chứng thực xã hội có thật
- **Chuyển động:** phản hồi thêm vào giỏ, skeleton khi tải
- **Đọc sâu:** `ui-ux-pro-max` style *Conversion-Optimized*, *Social Proof-Focused* · `laws-of-ux` Hick, Fitts

### 6. Awwwards · Trải nghiệm điện ảnh
- **Nhận diện qua từ:** ấn tượng, wow, agency, ra mắt, Awwwards, cuộn kể chuyện, điện ảnh
- **Hợp với:** trang ra mắt, agency, sự kiện, thương hiệu kể chuyện
- **Dial:** 9/9/3
- **Màu:** tự do theo ý tưởng, nhưng **một** màu nhấn và **một** nền cho cả trang
- **Chữ:** Unbounded / Bricolage Grotesque / Anybody, cỡ lớn, H1 ≤ 2–3 dòng *(container rộng)*
- **Bố cục:** AIDA *(Chú ý → Quan tâm → Mong muốn → Hành động)*, section như chương phim `py-32+`, bento không hở ô (`grid-flow-dense`)
- **Chuyển động:** GSAP ScrollTrigger: ghim, xếp chồng thẻ, cuộn ngang, chữ hiện dần theo cuộn. **Bắt buộc** có bản tĩnh cho `reduced-motion`
- **Cấm riêng:** nhãn *"SECTION 01"*, gợi ý *"Cuộn để khám phá"*
- **Đọc sâu:** `gpt-taste` (toàn bộ) · `design-taste-frontend` §5.A–C

### 7. Cyberpunk · Neon tương lai
- **Nhận diện qua từ:** cyberpunk, neon, tương lai, game, hacker, sci-fi, HUD
- **Hợp với:** game, esports, sản phẩm crypto, sự kiện công nghệ, âm nhạc điện tử
- **Dial:** 8/7/6
- **Cách hiểu cần hỏi:** neon đêm mưa · HUD quân sự · glitch Y2K
- **Màu:** nền tối có chủ đích *(không phải `#0D1117` + neon lười)*; cặp **cam/xanh lục lam ấm** kiểu Ash Thorp hoặc **một** neon trên đen than; đỏ cảnh báo `#FF2A2A`
- **Chữ:** Chakra Petch / Saira / Exo 2 cho tiêu đề + JetBrains Mono / Space Mono / VT323 cho số liệu. ⚠️ **Orbitron và Rajdhani không có dấu Việt**
- **Bố cục:** lưới kỹ thuật, khung ngoặc ASCII `[ … ]`, góc vuông, dữ liệu dày dạng mono, đường quét CRT **chỉ trên lớp cố định**
- **Chuyển động:** nhấp nháy tín hiệu, gõ chữ, lệch RGB **tiết chế**; tắt hết khi `reduced-motion`
- **Đọc sâu:** `industrial-brutalist-ui` §2.2 *Tactical Telemetry* · `ui-ux-pro-max` style *Cyberpunk UI*, *HUD / Sci-Fi FUI*

### 8. Brutalist · Swiss công nghiệp
- **Nhận diện qua từ:** brutalist, thô, Swiss, bản vẽ kỹ thuật, poster, công nghiệp
- **Hợp với:** studio thiết kế, kiến trúc, thời trang đường phố, portfolio cá tính
- **Dial:** 8/3/6
- **Màu:** giấy mờ `#F4F4F0` + mực than + **một** đỏ hàng không `#E61919`
- **Chữ:** sans nặng cỡ khổng lồ, chữ hoa, tracking âm, leading 0.85–0.95 *(Archivo Black ⚠️ không có dấu Việt → dùng Anybody / Epilogue ExtraBold / Montserrat Black)*
- **Bố cục:** lưới lộ đường kẻ `gap:1px`, **không bo góc**, số khổng lồ tràn khung, mật độ hai cực
- **Chuyển động:** gần như không
- **Đọc sâu:** `industrial-brutalist-ui` §2.1, §3, §5 · `ui-ux-pro-max` style *Neubrutalism*

### 9. Mềm mại · Thân thiện
- **Nhận diện qua từ:** thân thiện, vui, gần gũi, trẻ em, giáo dục, sức khoẻ, cộng đồng
- **Hợp với:** giáo dục, sức khoẻ, gia đình, cộng đồng, app tiêu dùng
- **Dial:** 6/5/4
- **Màu:** nền sáng, 1 màu chính ấm, pastel phụ, bóng khuếch tán rất mềm
- **Chữ:** Be Vietnam Pro / Lexend *(dễ đọc)* / Plus Jakarta Sans, cỡ thân chữ ≥ 16px
- **Bố cục:** thẻ bo 16–24px, minh hoạ **thật** hoặc ảnh người thật, CTA to và rõ
- **Chuyển động:** nảy lò xo nhẹ, phản hồi vui khi hoàn thành
- **Đọc sâu:** `high-end-visual-design` §3.A *Soft Structuralism* · `ui-ux-pro-max` style *Claymorphism*

### 10. Tin cậy · Dịch vụ công · Tài chính–Y tế
- **Nhận diện qua từ:** tin cậy, chính phủ, ngân hàng, bảo hiểm, bệnh viện, pháp lý, người lớn tuổi
- **Hợp với:** dịch vụ công, tài chính, y tế, pháp lý
- **Dial:** 3/2/5
- **Màu:** trung tính lạnh + một màu thương hiệu trầm; màu ngữ nghĩa theo chuẩn; **AAA** cho chữ thân nếu người dùng lớn tuổi
- **Chữ:** Inter / Public Sans / Be Vietnam Pro. Họ này **được** dùng Inter
- **Bố cục:** thẳng hàng, dự đoán được, form nhãn ở trên, lỗi ở dưới, không phá lưới
- **Chuyển động:** chỉ để phản hồi
- **Đọc sâu:** `design-taste-frontend` §1.A dòng *trust-first*, §2.A *(GOV.UK, USWDS, Carbon)*

### 11. Công cụ vận hành · Dashboard dày dữ liệu
- **Nhận diện qua từ:** quản lý, vận hành, admin, dashboard, nội bộ, nhân viên, bảng biểu
- **Hợp với:** web app nội bộ, CRM, lịch, kho, điều phối. Loại sản phẩm = **Web app** *(SKILL.md mục 5)*
- **Dial:** 4/3/8
- **Màu:** nền trung tính, **màu dành cho trạng thái** *(đúng giờ, trễ, lỗi, chờ)*, không trang trí
- **Chữ:** Be Vietnam Pro / Inter / IBM Plex Sans + mono cho **mọi con số**, `tabular-nums`
- **Bố cục:** lưới 12 cột, bảng có lọc/sắp/xuất, thanh lệnh `/` hoặc `Ctrl+K`, kẻ 1px thay cho thẻ, trạng thái rỗng/lỗi/đang tải đầy đủ
- **Chuyển động:** ≤ 200ms, chỉ để phản hồi
- **Icon:** Lucide **được phép** *(nét rõ, quen thuộc)*; Phosphor Regular cũng hợp
- **Đọc sâu:** `ui-ux-pro-max` style *Data-Dense Dashboard*, *Real-Time Monitoring* · `laws-of-ux` Hick, Fitts, Doherty, Tesler

### 12. Portfolio sáng tạo
- **Nhận diện qua từ:** portfolio, hồ sơ năng lực, studio, cá nhân, nhiếp ảnh, kiến trúc sư
- **Hợp với:** cá nhân, studio nhỏ, freelancer
- **Dial:** 8/7/3
- **Màu:** gần đơn sắc, **để tác phẩm tạo màu**
- **Chữ:** sans hiển thị cá tính (Bricolage Grotesque / Epilogue), **tránh** mặc định serif chỉ vì "sáng tạo" *(`design-taste-frontend` §4.1)*
- **Bố cục:** tác phẩm chiếm chỗ, lưới masonry hoặc cuộn ngang, trang dự án kể quy trình
- **Cấm riêng:** dải *"THƯƠNG HIỆU. CHUYỂN ĐỘNG. KHÔNG GIAN."* cuối màn đầu, dải giờ/thành phố/thời tiết
- **Đọc sâu:** `design-taste-frontend` §1.B, §9.F

---

## Động cơ biến thể — làm 3 concept khác nhau

Dùng ở hai chỗ:
- **Giữa 3 concept** *(A2)*: mỗi cặp khác nhau **≥ 3 trục**, trong đó **bắt buộc có khung bố cục** *(các trục màn đầu, hệ section; web app và app dùng trục riêng bên dưới)*. Ghi vào `axes` của `concepts.js`; bảng concept tự đếm và cảnh báo.
- **Vòng biến thể** *(Cổng 2, khi người dùng phân vân)*: 2 bản của cùng một concept, giữ màu và chữ, khác nhau ở các trục **bố cục**: kiến trúc màn đầu, cỡ màn đầu, hệ section *(web app, app: trục riêng bên dưới)*.

| Trục | Lựa chọn *(chọn 1)* |
|---|---|
| **Nền** | Sáng tinh · Tối sâu · Khối màu đặc · Trung tính trầm |
| **Chất nền** | Lưới/chấm kỹ thuật · Nền trơn có chiều sâu gradient nhẹ · Ảnh tràn điện ảnh · Giấy/vật liệu |
| **Kiến trúc màn đầu** | Căn giữa tối giản · Chia đôi lệch · Chữ khổng lồ có ảnh chèn giữa dòng · Lệch kiểu biên tập · Ảnh làm chủ, chữ tiết chế |
| **Cỡ màn đầu** | Khổng lồ · Vừa · Mini tối giản |
| **Hệ section** | Bento nhịp modul · Khối biên tập xen kẽ · Kể chuyện kiểu poster · Nhịp theo gallery · Lưới Swiss |
| **Tính cách chữ** | Grotesk sạch · Grotesk tinh · Display cá tính · Nén khối · Serif biên tập + sans · Sans Swiss thứ bậc mạnh |
| **Trục ý tưởng** | Hiện vật quý · Hành trình · Dụng cụ chính xác · Hệ sống · Sân khấu · Hồ sơ lưu trữ |
| **Khoảnh khắc đọc lần hai** *(đúng 1)* | Tràn lề có chủ đích · Một con số/dấu câu khổng lồ làm cấu trúc · Đổi chất liệu một lần · Ghi chú dọc lề · Cắt cận ảnh mang màu brand |

**Luật xếp ba concept:** A = **hợp nhất**, đúng khuôn của họ phong cách · B = **cân bằng**, một điểm lạ · C = **táo bạo**, đẩy tới mép mà vẫn đúng brief.

**Web app / công cụ vận hành:** thay các trục *màn đầu / hệ section / khoảnh khắc đọc lần hai* bằng: **Điều hướng** *(sidebar · top bar · thanh lệnh)* · **Mật độ** *(thoáng · vừa · dày)* · **Trục tổ chức màn chính** *(theo thời gian · theo người · theo việc · theo địa điểm)*.

**App mobile:** luật bố cục web không áp cho màn app *(`mobile-app.md` mục 5)*. Thay các trục *màn đầu / cỡ màn đầu / hệ section / khoảnh khắc đọc lần hai* bằng các trục dưới, ba concept khác nhau trên ≥ 3 trục:

| Trục | Lựa chọn *(chọn 1)* |
|---|---|
| **Tổ chức màn gốc** | Theo danh mục · Theo thói quen *(món quen, dùng gần đây lên đầu)* · Theo thời gian · Theo trạng thái · Theo địa điểm |
| **Cách bày nội dung chính** | Danh sách dòng, ảnh nhỏ · Lưới 2 cột, ảnh lớn · Thẻ lớn một cột · Chữ là chính, ảnh phụ |
| **Đầu màn gốc** | Tiêu đề lớn của nền tảng · Khối màu thương hiệu đặc · Ô tìm kiếm là chính · Thẻ tóm tắt *(đơn đang chạy, số dư)* |
| **Lối vào hành động chính** | Nút đáy cố định · Nút tạo mới của nền tảng *(`+` trên thanh ở iOS, FAB ở Android)* · Một chạm từ thẻ đầu màn · Mở sheet tại chỗ |
| **Điểm nhấn** *(đúng 1 mỗi màn)* | Ảnh sản phẩm · Con số chính · Thẻ trạng thái · Giá hoặc nhãn có kiểu riêng |

- **Không phải trục biến thể:** thanh tab, nút quay lại, vùng chạm, sheet. Cả ba concept theo quy ước nền tảng *(`mobile-app.md` mục 2)*.
- **Hệ thống nhiều bề mặt:** mỗi concept chọn trục cho từng bề mặt *(admin theo trục web app, app theo trục trên)*. Bảng so sánh có một dòng cho mỗi bề mặt, và một dòng cho vai dùng cả hai bề mặt *(ví dụ chủ quán xem quầy trên điện thoại)*.
