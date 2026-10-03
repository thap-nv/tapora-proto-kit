# Phương pháp làm concept — dùng ở A2, A3 và Cổng 2

> Rút gọn và viết lại từ `huashu-design` *(mục Thiết kế hướng, `huashu-design/references/design-styles.md`, `huashu-design/references/critique-guide.md`, `huashu-design/references/tweaks-system.md`)* và `brandkit` của taste-skill *(Core principle, Brand strategy first, Tagline style, Color discipline, Logo concept methods)*. Nguồn và license ở `THIRD_PARTY_LICENSES.md`.
> Chỗ nào đụng luật của kit thì luật kit thắng *(`sketch-to-site` mục 2)*.

---

## 1. Ba lớp của một concept

| Lớp | Là gì | Kiểm bằng câu hỏi |
|---|---|---|
| **Ý** | Một câu ý tưởng + một ẩn dụ, gắn với điểm khác biệt của sản phẩm | Đổi tên sản phẩm thì concept còn đứng được không? Còn đứng được thì đó là khuôn, chưa phải ý |
| **Hình** | Màu theo vai trò, cặp chữ tiếng Việt, bo góc, bóng, chất nền, nền, nhịp | Nêu được một câu *"vì sao màu này"* bằng dữ kiện của dự án không? |
| **Dụng** | Một màn then chốt dựng thật, một tương tác đặc trưng bấm được | Tương tác đó có làm việc chính nhanh hơn hay rõ hơn không, hay chỉ để đẹp? |

Thiếu lớp nào thì concept hỏng ở lớp đó: có Hình mà không Ý là *"đẹp mà chung chung"*; có Ý mà không Dụng là *"hay mà không dùng được"*.

---

## 2. Tìm Ý

### 2.1 Năm câu cốt lõi *(theo `brandkit`, Core principle)*
1. Sản phẩm này tồn tại để làm gì, cho ai?
2. Ẩn dụ cốt lõi là gì?
3. Ẩn dụ hiện lên ở đâu trên màn then chốt và trong tương tác đặc trưng?
4. Nó co giãn thế nào sang màn khó: bảng dày, form dài, trạng thái rỗng và lỗi?
5. Vì sao nó là của riêng sản phẩm này?

### 2.2 Từ ngành tới ẩn dụ *(theo `brandkit`, Brand strategy first; 3 dòng cuối là của kit)*
Đừng chọn biểu tượng ngẫu nhiên. Đi từ ý cốt lõi của ngành, rồi lọc bằng dòng **Khác biệt** của brief.

| Ngành | Ý cốt lõi | Logic biểu tượng |
|---|---|---|
| Công cụ cho lập trình viên | dựng, tốc độ, chính xác, kiểm soát | con trỏ, khung, giàn giáo, lưới |
| Trợ lý AI | giao việc, hiểu, rõ ràng | tia, quỹ đạo, tín hiệu, lối đi, nút mạng |
| Bảo mật | bảo vệ, canh chừng, ranh giới | khiên, mắt, con dấu, lõi được che |
| Game, giải trí có thưởng | may rủi, phần thưởng, căng thẳng | xúc xắc, viên đá, lá bài, cúp |
| Giọng nói | âm thanh, nhịp, mệnh lệnh | sóng âm, micro, quả cầu, đường lời |
| Tuân thủ, pháp lý | tin cậy, trật tự, luật | con dấu, huy hiệu, văn bản, khiên |
| Drone, robot | bay, điều khiển, tầm nhìn | cánh, tâm ngắm, đường bay, vùng |
| Hàng hiệu, biên tập | gu, chất liệu, nghi thức, tiết chế | monogram, dấu, giấy, dập nổi |
| Năng suất | tập trung, đà, rõ ràng | lối đi, dấu tích, khối, lịch |
| Ăn uống, đặt món | vị, mùa, tay nghề, nhịp quán | nguyên liệu, lịch mùa, phiếu order, bếp |
| Giáo dục | tiến bộ, tò mò, kiên nhẫn | bậc thang, bản đồ, sổ tay, huy hiệu |
| Y tế, tài chính | an toàn, minh bạch, đúng hạn | biểu đồ, phiếu, dấu xác nhận, dòng thời gian |

### 2.3 Năm câu tìm form *(theo `huashu-design`, quy trình bước 3)*
Trả lời cho màn then chốt của **mỗi** concept, trước khi dựng:
1. **Vai trò:** màn này làm gì trong luồng *(mở đầu, làm việc, chuyển tiếp, chốt)*?
2. **Khoảng cách nhìn:** điện thoại cầm tay, laptop, màn quầy treo xa? Quyết cỡ chữ và mật độ.
3. **Nhiệt độ thị giác:** tĩnh, hào hứng, lạnh, uy quyền, dịu? Quyết màu và nhịp.
4. **Sức chứa:** phác 3 bố cục nhanh, nội dung thật có vừa không?
5. **Mô-típ thị giác:** thứ gì chỉ nội dung này mới có? Một thành phần, một cấu trúc hay một ẩn dụ mà chủ đề khác không có. Đó là hạt giống của form.

**Trước khi dựng**, viết câu 5 thành một câu **"form đến từ đâu trong nội dung"** vào `formFrom` của `concepts.js`: lớp Ý được chấm trên câu này *(mục 7)*. Không viết được câu này tức là đang dùng khuôn: quay lại câu 5. Dựng xong, kiểm màn có mang đúng mô-típ đó không.

### 2.4 Câu Ý *(theo `brandkit`, Tagline style)*
Ngắn, cụ thể, nói được bằng lời thường. *"Mỗi lô hạt là một trang sổ tay của người rang"* được. *"Nâng tầm trải nghiệm cà phê"* không được: sáo ngữ, và đổi sang sản phẩm nào cũng đúng.

---

## 3. Ba nguồn cho ba concept *(theo `huashu-design`, Thiết kế hướng · Phase 4)*

Mỗi concept đi từ một nguồn khác nhau, để ba bản không tụ về cùng một lối. Kit **không** dùng nguồn thứ tư của `huashu-design` là bốc ngẫu nhiên theo giây *(`rules-and-conflicts.md` dòng 13)*.

| Concept | Nguồn | Cách làm |
|---|---|---|
| **A · hợp nhất** | Họ phong cách hợp nhất trong `sketch-to-site/references/style-catalogue.md` + dữ liệu `ui-ux-pro-max` | Theo luật của họ. Là concept an toàn, nhưng vẫn phải có Ý riêng |
| **B · chuẩn thật** | Một sản phẩm **có thật**, thiết kế xuất sắc, cùng lĩnh vực | Kiểm bằng `WebSearch` là nó có thật và trông như bạn nghĩ. Mượn **cách giải** *(cách bày số liệu, nhịp đọc, cách dẫn tới hành động)*, **không** chép giao diện, logo, ảnh hay chữ *(`reference-intake.md` 2.4)*. Cần gợi ý thì xem 20 phong cách web có tham chiếu thật ở `huashu-design/references/design-styles.md` |
| **C · lăng kính studio** | *"Không giới hạn ngân sách, studio hay nhà thiết kế nào hợp nhất với sản phẩm này?"* | Ghi tên và lý do. Mượn **cách nghĩ** của họ *(ví dụ: một ý thị giác đẩy tới cùng)*, không mô phỏng tác phẩm cụ thể |

Người dùng đã nêu phong cách thì 3 concept là **3 cách hiểu** của phong cách đó, vẫn đi từ ba nguồn trên. Một từ có nhiều nghĩa:
- *Cyberpunk* → neon đêm mưa *(Blade Runner)* · HUD quân sự *(bảng đo, lưới, đỏ cảnh báo)* · glitch Y2K *(RGB lệch, pixel)*
- *Hàng hiệu* → tối giản xa xỉ *(khoảng trắng, serif mảnh)* · tạp chí thời trang *(ảnh tràn, chữ lớn)* · lạnh kim loại *(bạc, khói, sắc)*
- *Hiện đại* → Linear/Vercel *(chữ sắc, nền trơn)* · Apple *(sản phẩm làm nhân vật, trắng rộng)* · Notion *(ấm, phẳng, như văn bản)*

---

## 4. Ba concept phải khác nhau thật

So trên 6 trục, ghi vào `axes` của `concepts.js`. Bảng concept tự đếm và hiện cảnh báo khi một cặp chưa đạt.

| Trục *(khoá trong `axes`)* | Lựa chọn gợi ý *(`style-catalogue.md`, Động cơ biến thể)* |
|---|---|
| Nền *(`nen`)* | Sáng tinh · Tối sâu · Khối màu đặc · Trung tính trầm |
| Chất nền *(`chatNen`)* | Lưới hoặc chấm kỹ thuật · Nền trơn có chiều sâu · Ảnh tràn · Giấy, vật liệu |
| Tính cách chữ *(`chu`)* | Grotesk sạch · Grotesk tinh · Display cá tính · Nén khối · Serif biên tập + sans · Sans Swiss thứ bậc mạnh |
| Trục ý tưởng *(`yTuong`)* | Hiện vật quý · Hành trình · Dụng cụ chính xác · Hệ sống · Sân khấu · Hồ sơ lưu trữ |
| Khoảnh khắc đọc lần hai *(`khoanhKhac`)* | Tràn lề có chủ đích · Một con số khổng lồ làm cấu trúc · Đổi chất liệu một lần · Ghi chú dọc lề · Cắt cận ảnh mang màu brand |
| Khung bố cục *(`khung`)* | Web giới thiệu: kiến trúc màn đầu + hệ section · Web app: điều hướng + trục tổ chức màn chính · App: tổ chức màn gốc + cách bày nội dung chính |

**Luật:** mỗi cặp khác nhau **≥ 3 trục**, trong đó **bắt buộc có khung bố cục**. `huashu-design` thử mù: ba bản chung khung, chỉ đổi màu và chữ, bị nhận ra ngay là "thay áo".

**Xếp:** A hợp nhất → B cân bằng → C táo bạo. Không để cả ba cùng rơi vào *"nền trắng ngà + khoảng trắng + một màu nhấn"*: đó là lối thất bại hay gặp nhất.

---

## 5. Hình

### 5.1 Giao thức màu 3 bước *(theo `huashu-design/references/design-styles.md`)*

| Bước | Làm gì |
|---|---|
| **1. Lấy mẫu** | Màu chính lấy từ 3 nguồn, không tự nghĩ ra: brand có sẵn *(logo, màu đã định)* · ảnh thật của nội dung · ký ức văn hoá của chủ đề *(lá, hoa, quả của cây cà phê; màu mực của sổ tay…)* |
| **2. Thu gọn** | 2–3 màu có sắc + một dải trung tính. Hai màu có sắc lệch nhau ≥ 60° sắc độ hoặc ≥ 0,3 độ sáng *(oklch)* |
| **3. Nêu lý do** | Một câu *"vì sao là màu này"*. Không viết được tức là đang chép công thức |

**Độ bão hoà theo diện tích** *(oklch chroma)*: nền lớn 0,01–0,04 · màu chính 0,08–0,15 · điểm nhấn nhỏ *(nút, link)* 0,15–0,22. Trên 0,25 phủ cả mảng chỉ hợp với phong cách cố ý "điện tử".

**Kỷ luật màu** *(theo `brandkit`)*: một bảng chủ đạo; màu nhấn lặp lại ở mọi chỗ cần hành động; một màu nhấn đủ gánh cả hệ; không cầu vồng; không quầng tím xanh kiểu AI.

**Dữ liệu `ui-ux-pro-max/data/colors.csv`** *(192 loại sản phẩm, mỗi dòng một bảng màu theo vai trò)* chỉ là điểm xuất phát cho concept A:
- Đó là **mặc định của ngành** *(SaaS = xanh tin cậy + cam)*, đúng thứ bước 3 bắt phải nêu lý do.
- Có ô `#000000` cho chữ trên màu nhấn: đổi sang off-black, không thì preflight báo P05.
- Tên cột của file này chính là tên vai trò trong `concepts.js`, viết kebab-case. `tokens.js` đổi 5 vai trò sang tên biến chung của kit *(background → `--bg`, card → `--surface`, foreground → `--ink`, muted-foreground → `--muted`, border → `--line`; muted → `--muted-bg`)*, để `sketch-to-site` và khuôn app đọc thẳng được.

**Mọi màu viết mã hex**, để bảng concept đo được tương phản. Mọi cặp chữ và nền phải **≥ AA**.

### 5.2 Chữ
- Tra cặp chữ: `python <skills>/ui-ux-pro-max/scripts/search.py "<không khí>" --domain typography -n 5`.
- **Kiểm dấu tiếng Việt từng font**: `python <skills>/sketch-to-site/scripts/preflight.py --font "<tên>"`. Khai font trong `fontFamily: { … }` của `concepts.js` để preflight bắt lỗi P07.
- Font trong `huashu-design` là font Latin và font Trung: phải kiểm như trên trước khi dùng.
- Chữ hiển thị thường *(Inter, Roboto)* cho display thì bảng không nói được gì. Ngoại lệ: họ *Tin cậy* và *Công cụ vận hành*.

### 5.3 App: danh sách phải khoá *(theo `imagegen-frontend-mobile`, App design bible)*
**Font app** theo `sketch-to-site/references/rules-and-conflicts.md` dòng 16: có font thương hiệu thì dùng cho mọi bề mặt, không có thì theo font nền tảng. Concept muốn thân chữ theo nền tảng thì khai `body: 'system-ui'` *(chữ hiển thị vẫn được dùng font riêng)*; `tokens.js` khi đó không sinh `--brand-font`, và `app.css` dùng `--app-font` *(SF Pro, Roboto)*.

Nền tảng · khung máy · logic bảng màu · tính cách chữ · thang cỡ chữ · hệ khoảng cách · logic bo góc · kiểu icon · cách dùng ảnh · độ đậm chất nền · mô hình điều hướng · cách bày thẻ và danh sách · kiểu nút · kiểu bóng. Ghi vào `CONCEPT.md` mục 3 để màn thứ 3, thứ 4 không trôi thành app khác.

---

## 6. Dụng

| Loại sản phẩm | Màn then chốt |
|---|---|
| Site giới thiệu · e-commerce · portfolio | Màn đầu + 1 section đặc trưng |
| Web app · công cụ vận hành | Màn làm việc chính: loại màn chiếm nhiều nhất khi đếm tên chức năng, thường là bảng có lọc |
| App mobile | Màn gốc của tab chính, trên khuôn `sketch-to-site/templates/mobile/` |
| Nhiều bề mặt | Màn then chốt của **mỗi** bề mặt *(ví dụ dashboard admin + trang chủ app)* |

**Tương tác đặc trưng:** một thao tác bấm được, phục vụ **việc chính** trong brief, mang ẩn dụ của concept. Ví dụ với nhà rang: kéo thanh thời gian trên đường nhiệt *(Sổ tay rang)*, bấm một thông số để xem hương vị đổi *(Phiếu thông số)*. Không tính: hiệu ứng rê chuột, chuyển động trang trí.

---

## 7. Chấm lớp Ý: trên dữ liệu trước khi dựng, soát trên ảnh sau khi dựng *(theo `huashu-design/references/critique-guide.md` mục 0)*

| Điểm | Mức |
|---|---|
| 9–10 | Có một ý mọc từ nội dung của người dùng, mô-típ không thay được |
| 7–8 | Có ý rõ; mô-típ liên quan tới nội dung, nhưng chủ đề gần giống cũng dùng tạm được |
| 5–6 | Chỉ có phong cách, không có ý: đẹp nhưng không nói gì |
| 3–4 | Khuôn chung thay áo |
| 1–2 | Chọn sai cả phong cách, chỉ là trang trí chồng lên nhau |

**Trên dữ liệu** *(khối của concept trong `concepts.js`: `idea`, `metaphor`, `formFrom`, `signature`)*, hỏi lần lượt:
- Nói được ý của concept trong một câu không?
- Đổi tên sản phẩm, concept còn đứng được không? Còn thì tối đa **5**.
- `formFrom` có chỉ vào một mô-típ riêng của nội dung không *(mục 2.3, câu 5)*?
- Tương tác đặc trưng có phục vụ việc chính và mang ẩn dụ không?

**Trên ảnh** *(sau khi dựng)*:
- Che hết chữ và logo, còn nhận ra chủ đề không?
- Màn có mang đúng mô-típ đã ghi ở `formFrom` không?

**Làm lại:** trên dữ liệu, concept ≤ 5 thì sửa ý trong `concepts.js` theo hướng sửa của người chấm *(sửa chữ rẻ hơn dựng lại màn)*, rồi dựng; không chấm lại trên dữ liệu, lần soát trên ảnh sẽ kiểm. Trên ảnh, màn đánh mất ý thì làm lại concept đó **tối đa một lần**. Vẫn ≤ 5 thì thôi làm lại: trình ở Cổng 2 kèm điểm và lý do, người dùng quyết giữ hay bỏ. Tay nghề tốt không cứu được một concept không có ý; làm lại nhiều vòng cũng không.

---

## 8. Monogram cho brand hư cấu *(theo `brandkit`, Logo concept methods)*

Dự án chưa có logo mà màn then chốt cần một dấu nhận diện: tự dựng monogram *(`sketch-to-site` mục 6 cho phép)*, kết hợp tối đa 2 cách:
- **Chữ đầu + ý nghĩa:** chữ cái đầu cắt, gấp hay chừa khoảng âm để mang ẩn dụ.
- **Hành động của sản phẩm:** rang thành đường nhiệt, giao thành lối đi, bảo vệ thành ranh giới.
- **Ghép ẩn dụ:** hai ý gộp thành một dấu gọn, đọc ra được.
- **Khoảng âm:** mũi tên ẩn, lõi được che, chữ khoét.
- **Hình học dựng:** tròn, chéo, lưới, khối modul, đường quỹ đạo.

Tránh: tia sét chung chung, con vật ngẫu nhiên, huy hiệu xa xỉ giả, chép dấu nổi tiếng, biểu tượng rối.
