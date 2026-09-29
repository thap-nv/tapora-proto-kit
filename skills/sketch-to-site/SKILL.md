---
name: sketch-to-site
description: >-
  Thiết kế TỪ ĐẦU thành prototype HTML tương tác cấp studio: website (landing, site giới thiệu, e-commerce, portfolio), web app / công cụ vận hành, app mobile iOS/Android, hoặc hệ thống nhiều bề mặt (ví dụ admin web + app cho khách, chung thương hiệu và dữ liệu). Quy trình 7 bước với 5 CỔNG QUYẾT ĐỊNH bắt buộc dừng lại hỏi người dùng (định hình dự án · phong cách · chọn 1 trong 3 hướng · khoá design system · nghiệm thu). Nhận concept, design system, DESIGN.md, ảnh chụp, URL hoặc thương hiệu làm tham chiếu. Gộp ui-ux-pro-max, huashu-design, design-taste-frontend, laws-of-ux và các skill phong cách. KHÔNG dùng để sửa prototype đã có (evolve-site, redesign-existing-projects), chấm điểm UX trang có sẵn (laws-of-ux-review), làm slide/video. Gọi khi người dùng nói "thiết kế website", "thiết kế app", "làm prototype app mobile", "thiết kế hệ thống admin và app", "làm prototype giao diện", "dựng prototype từ đầu".
---

# Sketch to Site · Thiết kế website và app từ đầu

> **v3.1 (29/09/2026)** · Bộ kiểm: tự có khổ 768, bắt chữ tràn hoặc bị cắt trong khung, chụp ảnh ở mọi theme, nền sáng/tối theo `?theme=` chứ không theo máy chạy kiểm *(`templates/theme.js`)*, màn cần tham số khai báo mẫu bằng `qa-query`. Trục biến thể riêng cho app. Cổng 1 giữ ≤ 4 câu một lượt.
> **v3.0 (29/09/2026)** · Thêm **app mobile iOS/Android** và **hệ thống nhiều bề mặt** *(admin web + app)*: Cổng 1 hỏi bề mặt và nền tảng, luật ở `references/mobile-app.md`, khuôn ở `templates/mobile/`. B6 dựng dữ liệu dùng chung bằng `templates/store.js` *(mục D.5)*. Skill tham chiếu được đọc theo đường dẫn, không gọi qua công cụ Skill.
> **v2.2 (28/09/2026)** · B7 cài bộ kiểm dùng lại được *(`templates/qa-kit/`)*, làm mốc cho `tweak-site`, `evolve-site`, `handover-check`. Đường dẫn tính từ thư mục skill, cài dạng plugin vẫn chạy.
> **v2 (23/09/2026)** · đổi tên từ `huashu-pro-max` ngày 24/09.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này (`.claude/skills/`, `~/.codex/skills/`, hoặc thư mục cài plugin).
> **Skill tham chiếu:** `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `full-output-enforcement` đã tắt tự kích hoạt. Đọc chúng như tài liệu: mở `<skills>/<tên>/SKILL.md` bằng công cụ đọc file, không gọi qua công cụ Skill. Cần một mục *(ví dụ `design-taste-frontend` §4.7)* thì tìm dòng tiêu đề của mục đó *(`grep -n "^#.* 4\.7 "`)* rồi chỉ đọc đoạn ấy: `design-taste-frontend` dài khoảng 87 KB.
> Việc của skill: **đưa người dùng tới một thiết kế là của họ**, không phải của mô hình. Mô hình lo phần tay nghề: token, bố cục, tương tác, tự kiểm. Phong cách, hướng thiết kế và nghiệm thu là quyền của con người, và skill **dừng lại để hỏi** đúng ở những chỗ đó.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Website / web app **chưa có giao diện**, hoặc có nhưng được phép **làm lại từ đầu** | ✅ Skill này |
| **App mobile** iOS/Android, hoặc **hệ thống nhiều bề mặt** *(admin web + app cho khách)* làm từ đầu | ✅ Skill này, đọc thêm `references/mobile-app.md` sau Cổng 1 |
| Thêm tính năng, màn hay bề mặt mới vào prototype **đã có** | `evolve-site` |
| Có **concept, design system, ảnh chụp, URL tham khảo** và muốn một site mới dựa trên đó | ✅ Skill này, bước 2 *(nạp tham chiếu)* |
| Nâng cấp site **đang chạy**, giữ nguyên cấu trúc và code | `redesign-existing-projects` |
| Chấm điểm UX một trang có sẵn | `laws-of-ux-review` (0–60) · `laws-of-ux-checklist` (12 điểm) |
| Infographic tĩnh | `huashu-design` |

---

## 1. LUẬT DỪNG — đọc trước mọi thứ khác

**Cổng (🛑)** là chỗ chỉ con người được quyết. Tới cổng thì:

1. **Trình bày** thứ cần quyết, bằng thứ nhìn thấy được: bảng so sánh, preview, ảnh chụp bản dựng. Đừng hỏi mở kiểu *"bạn thích phong cách nào?"*.
2. **Hỏi** bằng công cụ `AskUserQuestion`: tối đa 4 câu một lượt, mỗi câu 2–4 lựa chọn. Nếu có khuyến nghị thì đặt lựa chọn đó **đầu tiên** và thêm *"(Khuyến nghị)"*. Với lựa chọn thẩm mỹ, gắn `preview` *(mô tả ngắn hoặc ASCII bố cục)*.
3. **Dừng.** Không có công cụ hỏi thì viết câu hỏi ra rồi **kết thúc lượt**. **Không tự chọn thay**, kể cả ở chế độ tự động, auto mode hay phiên không người trực. Đây là quyết định chỉ người dùng làm được, nên dừng lại không bị coi là tắc việc.
4. **Ghi** đáp án vào `DECISIONS.md` *(mẫu ở `templates/DECISIONS.md`)*: cổng, câu hỏi, đáp án **nguyên văn**, ngày.

**Chỉ được qua cổng mà không hỏi khi:**
- Người dùng **nói rõ trong phiên này** là bỏ qua **đúng cổng đó** *("tự chọn phong cách đi", "không cần 3 hướng", "làm luôn")*. Ghi nguyên văn vào `DECISIONS.md`.
- Đáp án **đã có trong input**: người dùng đã nêu, hoặc tài liệu tham chiếu đã chốt. Ghi nguồn. Khi đó chỉ hỏi *cách hiểu* nếu một từ có nhiều nghĩa *(xem Cổng 2)*.
- Đang **lặp lại trong hướng đã chọn** (sửa chữ, đổi ảnh, sửa lỗi). Không cần mở lại cổng.

**Đừng:**
- Hỏi thứ suy ra được từ bối cảnh. Cổng chỉ hỏi thứ **làm thay đổi đầu ra**.
- Hỏi trước khi có gì để xem. Không bắt chọn hướng khi chưa dựng 3 bản thật.
- Gom câu của cổng sau vào cổng trước cho đỡ một lượt.
- Coi im lặng là đồng ý. Người dùng không trả lời thì nhắc lại câu hỏi.

---

## 2. Thứ tự ưu tiên khi các luật đụng nhau

Các skill nguồn **mâu thuẫn nhau thật**: skill này cấm Lucide mà skill kia dùng Lucide; skill này ép eyebrow ở mọi tiêu đề còn skill kia giới hạn 1/3 số section; skill này chuộng serif Instrument, skill kia cấm. Đụng nhau thì xử theo thứ tự:

1. **Sàn không thương lượng**: tương phản WCAG AA, bàn phím và focus, `prefers-reduced-motion`, không tràn ngang, font có đủ dấu **tiếng Việt**, hiệu năng *(chỉ animate `transform`/`opacity`)*.
2. **Input của người dùng**: brand, design system, concept đã duyệt, câu trả lời ở các cổng.
3. **Luật riêng của họ phong cách đã chọn** ở Cổng 2 *(`references/style-catalogue.md`)*.
4. **Nền chung** của skill này *(`references/rules-and-conflicts.md` mục A)*.

Bảng xử từng cặp mâu thuẫn cụ thể ở `references/rules-and-conflicts.md` mục C.

---

## 3. Nguyên tắc cốt lõi

- **Thiết kế mọc ra từ bối cảnh, không từ kho phong cách.** Có tài liệu yêu cầu, dữ liệu thật, brand thì bắt đầu từ đó. Kho phong cách chỉ là giàn giáo khi không có gì.
- **Chống AI-slop** *(danh sách đủ: `rules-and-conflicts.md` mục B)*: không gradient tím, không emoji làm icon, không `Lorem ipsum`/`John Doe`/`Acme`, không *“Nâng tầm”, “Liền mạch”, “Đột phá”*, không 3 thẻ bằng nhau, không màn hình sản phẩm giả dựng bằng `div`.
- **Dữ liệu thật theo nghiệp vụ tiếng Việt**: tên người Việt, `150.000 ₫`, `thứ Hai, 23/09`, số liệu lẻ tự nhiên. Số tự đặt thì **gắn nhãn minh hoạ**, đừng để trông như số thật.
- **Placeholder trung thực hơn cố làm cho có.** Không có ảnh thì để khung ghi rõ *"Ảnh: bể bơi trong nhà, 1600×1000"*, **đừng** tự vẽ SVG người hay vật.
- **Mỗi màn hình đúng MỘT hành động chính.**
- **Prototype phải "sống"**: tab, modal, lọc, toast, trạng thái *đang tải / rỗng / lỗi*.
- **Viết đủ, không cắt** *(`full-output-enforcement`)*: cấm `// ...`, `// phần còn lại tương tự`, cấm bỏ khung. Sắp hết độ dài thì dừng ở chỗ ngắt sạch và ghi `[TẠM DỪNG — xong X/Y. Gõ "tiếp" để làm: <phần kế>]`.

---

## 4. Quy trình 7 bước · 5 cổng

```
B1 Đọc bối cảnh ─► 🛑1 Định hình dự án ─► B2 Nạp tham chiếu ─► B3 Tra design intelligence
   ─► 🛑2 Phong cách ─► B4 Dựng 3 hướng ─► 🛑3 Chọn hướng ─► B5 Design system + sơ đồ trang
   ─► 🛑4 Duyệt design system ─► B6 Dựng đầy đủ ─► B7 Tự kiểm ─► 🛑5 Nghiệm thu
```

### B1 · Đọc bối cảnh *(không hỏi)*

- Quét dự án: tài liệu yêu cầu, brief, glossary, prototype cũ, `DESIGN.md`, token, logo, font, `CLAUDE.md`. Dự án có quy ước thư mục hay quy tắc prototype thì **theo quy ước đó**.
- Kiểm công cụ đang có: `AskUserQuestion` · công cụ sinh ảnh · Playwright hoặc `msedge`/`chrome` headless để chụp màn hình · `WebFetch`.
- Viết nháp **Bản đọc thiết kế** một dòng, chưa công bố: *"Đọc là: <loại sản phẩm> cho <người dùng>, trên <thiết bị>, giọng <…>, nghiêng về <họ phong cách>."*

### 🛑 Cổng 1 · Định hình dự án

Hỏi **gộp một lượt**, bỏ câu nào đã biết:

| Câu | Lựa chọn gợi ý |
|---|---|
| **Loại sản phẩm?** Câu này quyết bộ luật áp dụng *(mục 5)* | Site giới thiệu / landing · E-commerce · Web app / công cụ vận hành · Portfolio / editorial · **App mobile** · **Hệ thống nhiều bề mặt** *(nêu từng bề mặt, ví dụ admin web + app cho khách)* |
| **Nền tảng app?** *(chỉ hỏi khi có app)* | iOS · Android · Cả hai *(một bộ màn, đổi qua lại được)* |
| **Người dùng chính và thiết bị?** *(hệ thống: hỏi cho từng bề mặt)* | Khách lướt điện thoại · Khách mua trên desktop · Nhân viên dùng máy tính cả ngày · Trộn *(nêu tỉ lệ)* |
| **Phạm vi lần này?** | 1 trang chủ · Trang chủ + 2–4 trang con · Toàn bộ luồng *(liệt kê)* |
| **Tham chiếu có sẵn và mức bám?** | Bám sát 100 % · Làm nền, được biến tấu · Chỉ lấy cảm hứng · Không có, tự đề xuất |

Có tham chiếu thì xin luôn trong câu hỏi: file concept/design system, ảnh chụp, URL, logo, màu, font, **và thứ cấm dùng**.

**Tối đa 4 câu, mỗi câu tối đa 4 lựa chọn** *(giới hạn của `AskUserQuestion`)*:
- Câu loại sản phẩm: đưa 3–4 loại gần nhất với Bản đọc thiết kế ở B1. Loại khác thì người dùng gõ ở *Other*.
- Có app thì bảng thành 5 câu. Input đã nói là app hay hệ thống *(thường là vậy)*: bỏ câu loại sản phẩm, hỏi nền tảng.
- Chưa biết loại: hỏi 4 câu kia trước. Người dùng chọn App mobile hoặc Hệ thống nhiều bề mặt thì hỏi nền tảng ở một lượt ngắn ngay sau. Lượt đó vẫn thuộc Cổng 1; ghi cả hai lượt vào `DECISIONS.md`.

**Có app** *(App mobile, hoặc hệ thống có app)*: đọc `references/mobile-app.md` ngay sau cổng này. Luật trong đó đè luật bố cục web khi đụng nhau, và áp ở mọi bước sau.

### B2 · Nạp tham chiếu *(nếu có)*

Làm theo `references/reference-intake.md`. Mỗi loại input có cách đọc riêng: `DESIGN.md`/token · file concept *(`.dc.html`, Figma, PDF)* · ảnh chụp · URL · tên thương hiệu · codebase. Kết quả là `REFERENCE-READ.md`: token trích được, quyết định concept đã chốt, **chỗ không chắc**, và mâu thuẫn trong chính tham chiếu *(đưa lên Cổng 2)*.

- Bám **100 %**: token và bố cục của tham chiếu là luật. Cổng 2 chỉ hỏi phần tham chiếu **bỏ trống**.
- Tham chiếu là **thương hiệu có thật**: kiểm chứng trước bằng `WebSearch`, lấy logo và ảnh từ nguồn chính thức, **không** đoán theo trí nhớ *(giao thức ở `huashu-design/references/brand-asset-protocol.md`)*.

### B3 · Tra design intelligence

```bash
python <skills>/ui-ux-pro-max/scripts/search.py "<ngành> <loại sản phẩm> <từ khoá không khí>" --design-system --variance <V> --density <D> --motion <M>
python <skills>/ui-ux-pro-max/scripts/search.py "<từ khoá>" --domain style -n 5
python <skills>/ui-ux-pro-max/scripts/search.py "<từ khoá>" --domain typography -n 5
```

- Giá trị V/M/D ban đầu lấy từ bảng preset trong `style-catalogue.md`.
- **Lọc font tiếng Việt ngay ở bước này**: `python <skills>/sketch-to-site/scripts/preflight.py --font "<Tên font>"`. Script tra cột `Subsets` của `ui-ux-pro-max/data/google-fonts.csv`. Satoshi, Cabinet Grotesk, Clash *(Fontshare)* và **Outfit, Instrument Serif, Syne, DM Sans, Sora, Orbitron** *(Google)* **không có dấu tiếng Việt**.
- Có app: tra thêm luật iOS/Android bằng `--domain web` và `--domain ux` *(`mobile-app.md` mục 8)*. `--design-system` viết cho landing page: với app chỉ lấy bảng màu làm gợi ý, bỏ phần Pattern và checklist của nó *(lý do ở mục 8)*.
- Chọn ra **3 họ phong cách** hợp nhất với Bản đọc thiết kế để đưa lên Cổng 2.

### 🛑 Cổng 2 · Phong cách sản phẩm

Đây là cổng người dùng định hình **cảm giác** của sản phẩm: hiện đại tối giản, e-commerce hàng hiệu, cyberpunk… Hỏi **3 câu trong một lượt**:

1. **Họ phong cách**: 3 họ từ `references/style-catalogue.md`, **xếp theo độ hợp**, mỗi lựa chọn có `preview` gồm không khí · màu · chữ · bố cục · chuyển động · một thương hiệu tương tự. Muốn họ khác thì người dùng chọn *Other*; lúc đó đưa ra danh sách đủ 12 họ.
2. **Nền sáng hay tối**: Sáng · Tối · Theo hệ thống *(cả hai)*. Họ phong cách đã khoá nền thì bỏ câu này.
3. **Nhịp**: preset của họ đã chọn · tĩnh hơn · sống động hơn. Viết bằng lời, đừng đưa con số dial ra.

**Người dùng đã tự nêu phong cách** thì không hỏi lại họ đó, nhưng **hỏi cách hiểu**, vì một từ có nhiều nghĩa. Ví dụ:
- *Cyberpunk* → neon đêm mưa *(Blade Runner)* · HUD quân sự *(bảng đo, lưới, đỏ cảnh báo)* · glitch Y2K *(RGB lệch, pixel)*
- *Hàng hiệu* → tối giản xa xỉ *(khoảng trắng, serif mảnh)* · tạp chí thời trang *(ảnh tràn, chữ lớn)* · lạnh kim loại *(bạc, khói, sắc)*
- *Hiện đại* → Linear/Vercel *(chữ sắc, nền trơn)* · Apple *(sản phẩm làm nhân vật, trắng rộng)* · Notion *(ấm, phẳng, như văn bản)*

### B4 · Dựng 3 hướng

- Dùng **động cơ biến thể** *(`style-catalogue.md` mục cuối)*: ba hướng **đều trong họ đã chọn** nhưng phải khác nhau trên **ít nhất 3 trục**: nền · kiến trúc màn đầu · hệ section · tính cách chữ · trục ý tưởng. Xếp từ **an toàn** → **táo bạo**.
- Mỗi hướng là **một file HTML thật** gồm màn đầu và 1 section/màn chủ chốt, dùng dữ liệu thật. Không phải mô tả chữ, không phải wireframe xám.
- Chụp mỗi hướng ở **1440 px và 390 px** *(lệnh chụp ở `references/qa-gate.md`)*.
- **App:** mỗi hướng là 1–2 màn chủ chốt dựng trên khuôn `templates/mobile/`; ảnh 1440 là khung máy. Trục màn đầu và section ở trên không áp cho app: dùng trục của app *(`style-catalogue.md`, cuối mục Động cơ biến thể; web app cũng có trục riêng ở đó)*.
- **Hệ thống nhiều bề mặt:** mỗi hướng dựng màn chủ chốt của **mọi** bề mặt, mỗi bề mặt theo trục của loại nó *(`mobile-app.md` mục 6)*.
- Tạo `directions/index.html` đặt ba hướng cạnh nhau, kèm **bảng so sánh**: không khí · điểm mạnh · rủi ro · hợp với ai.

### 🛑 Cổng 3 · Chọn hướng

Hỏi: **A · B · C · Trộn**. Chọn *Trộn* thì hỏi tiếp lấy **gì từ hướng nào** *(ví dụ: màn đầu của A, bảng màu của C)*. Trình bày xong thì **dừng**.

### B5 · Design system + sơ đồ trang

- Viết `DESIGN.md` theo `templates/DESIGN.md`, rút từ hướng đã chọn: màu *(tên vai trò + hex + bản tối)*, chữ *(đã kiểm tiếng Việt)*, **một hệ bo góc**, **một bộ icon**, thang khoảng cách, chuyển động, trạng thái component, và **danh sách cấm riêng** của dự án.
- Lập **sơ đồ trang**: danh sách trang/màn, các section theo thứ tự, hành động chính của từng màn, nội dung và dữ liệu mỗi section cần.
- Có app: sơ đồ màn ghi thêm **tab** và **ngăn xếp** *(màn nào đi sâu từ màn nào)*. Hệ thống nhiều bề mặt: chia sơ đồ theo bề mặt, kèm bảng **luồng xuyên bề mặt**. Phần riêng của từng bề mặt ghi ở `DESIGN.md` mục 10.

### 🛑 Cổng 4 · Duyệt design system và sơ đồ trang

Đây là **cổng cuối trước bước tốn công nhất**. Tóm tắt `DESIGN.md` trong ≤ 15 dòng kèm dải màu và cặp chữ, đưa sơ đồ trang, rồi hỏi: **Duyệt** · **Sửa token** *(nói rõ sửa gì)* · **Sửa sơ đồ trang** · **Quay lại Cổng 3**.

### B6 · Dựng đầy đủ

Yêu cầu kỹ thuật ở `references/rules-and-conflicts.md` mục D. Tóm tắt:

- Một file HTML mỗi trang, hoặc một SPA nhẹ. **Token là CSS variables**, định nghĩa ở `:root` và ghi đè cho nền tối. `tailwind.config` đọc lại chính các token đó.
- **Có cả nền sáng và tối** *(Cổng 2)*: chép `templates/theme.js` vào `assets/`, nạp trong `<head>` mọi trang. `?theme=dark` ép nền tối cho cả phiên, để demo và để bộ kiểm chụp đúng nền *(D.2)*.
- Font lấy từ Google Fonts, **đã kiểm tiếng Việt**. Icon mặc định là **Phosphor** *(Lucide được phép khi họ phong cách là *công cụ vận hành*)*. **Không emoji.**
- JS thuần: tab `data-tab-target`, modal/drawer `data-modal-open`/`-close` + `Esc` + khoá focus, lọc bảng, toast, trạng thái *đang tải / rỗng / lỗi*.
- **Dữ liệu dùng chung** khi là web app hoặc có từ 2 trang cùng đọc một loại dữ liệu: dữ liệu mẫu ở `assets/data.js`, mọi trang đọc ghi qua `assets/store.js` chép từ `templates/store.js` *(mục D.5)*. Tạo đơn ở trang này thì trang khác thấy, F5 không mất, `?reset` về dữ liệu mẫu. Trang đọc tham số URL *(chi tiết theo `?id=`)* khai báo mẫu cho bộ kiểm: `<meta name="qa-query" content="?id=<mã có trong data.js>">`.
- Chuyển động **theo dial của họ phong cách**. Cuộn thì dùng `IntersectionObserver`, **cấm** `addEventListener('scroll')`. Mọi chuyển động gói trong `prefers-reduced-motion`. GSAP *(qua cdnjs)* chỉ khi nhịp ≥ 8.
- Bộ luật bố cục theo **loại sản phẩm** ở Cổng 1 *(mục 5)*.
- **App:** chép `templates/mobile/app.css`, `app.js` và `templates/theme.js` vào `site/assets/`; màn gốc tab theo `screen.html`, màn đi sâu theo `detail.html`, trang tổng quan `site/app/index.html` theo `overview.html`. Token tách ra `assets/tokens.css` + `assets/tw.js` để mọi bề mặt dùng chung *(`mobile-app.md` mục 1)*.

### B7 · Tự kiểm *(phải qua hết rồi mới được mở Cổng 5)*

Chi tiết ở `references/qa-gate.md`:

1. `python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-site>`: bắt emoji, gạch dài trong chữ hiển thị, `h-screen`, lắng nghe scroll, `#000000`, Lorem/John Doe/Acme, font thiếu dấu tiếng Việt, ảnh thiếu `alt`, eyebrow vượt trần. **Phải 0 lỗi.**
2. **Cài bộ kiểm rồi chạy** *(lần đầu)*:
   - `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype>`. Lệnh chép script vào `_qa/`, sinh `qa.config.json` với một bộ khói cho mỗi trang ở 1440, 768, 390 *(màn app: 1440 và 390)*. Site có nền tối thì lệnh tự thêm theme `light` và `dark`.
   - Lệnh in **CẢNH BÁO** khi trang đọc tham số URL mà chưa có `qa-query`: thêm mẫu theo đúng dòng cảnh báo, nếu không bộ khói chỉ chụp được màn "không tìm thấy".
   - Sửa cấu hình: web app thì `preflight_kind` là `app`; theme khác thì khai báo ở `themes`.
   - Có app: lệnh tự thêm bước `tap-targets` cho màn app. Làm cả iOS và Android thì thêm `"android": "?platform=android"` vào `themes`.
   - `python _qa/handover.py run`: bắt lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung; chụp ảnh từng trang ở mọi theme vào `_qa/handover/<ngày-giờ>/<theme>/`.
   - Mở ảnh ra xem theo `qa-gate.md` mục 2: màn đầu nằm trọn trong khung, menu desktop một dòng, bảng ở 768 không bị ép cột.
   - Không chạy được trình duyệt headless thì chụp tay theo `qa-gate.md` mục 2.
3. **`laws-of-ux-checklist`** 12 điểm trên từng trang. Mỗi dòng ghi ✅ hoặc ❌ **kèm dòng code làm bằng chứng**.
4. **Soát gu** theo loại sản phẩm *(`qa-gate.md` mục 4)*.

Có lỗi thì sửa rồi chạy lại. **Không** mang lỗi đã biết vào Cổng 5.

### 🛑 Cổng 5 · Nghiệm thu

Báo **số thật**: preflight *(n lỗi · n cảnh báo)*, UX *(n/12 mỗi trang)*, ảnh chụp 3 cỡ màn hình, danh sách placeholder ảnh còn chờ, và các số minh hoạ tự đặt. Rồi hỏi: **Chốt** · **Sửa theo danh sách** · **Chạy `laws-of-ux-review` đầy đủ (0–60)** · **Đổi hướng** *(về Cổng 3)*.

**Khi nào khuyến nghị `laws-of-ux-review`:** đưa lựa chọn này lên **đầu** và gắn *(Khuyến nghị)* nếu có **ít nhất một** điều kiện sau:
- Loại sản phẩm là **web app / công cụ vận hành**. Review có 4 luật mà checklist 12 điểm không phủ, và cả 4 nặng ký với người dùng cả ngày: **Paradox of the Active User** *(không ai đọc hướng dẫn → gợi ý ngay tại chỗ)* · **Postel's Law** *(nhận SĐT có dấu cách, ngày nhiều định dạng)* · **Mental Model** *(khớp thói quen cũ, ví dụ Excel)* · **Working Memory** *(không bắt nhớ mã từ màn này sang màn khác)*.
- Có trang chỉ đạt **7–9/12** ở checklist.

Ngoài hai trường hợp đó *(site giới thiệu đạt 10–12/12)*: vẫn đưa lựa chọn, nhưng **không** gắn khuyến nghị. **Chốt** đứng đầu. Review chấm **từng trang** và dài, nên chạy **một lần trước khi giao**, không chạy ở mỗi lượt sửa.

---

## 5. Bộ luật theo loại sản phẩm

**App mobile** có bộ luật riêng ở `references/mobile-app.md` *(điều hướng, chạm, iOS và Android, phong cách)*. Hệ thống nhiều bề mặt: mỗi bề mặt theo bộ luật của loại của nó. Website và web app theo bảng dưới.

| | **Site giới thiệu · E-commerce · Portfolio** | **Web app · công cụ vận hành** |
|---|---|---|
| Mục tiêu | Ấn tượng đầu, chuyển đổi | Làm việc nhanh, ít lỗi, dùng cả ngày |
| Luật bố cục | `design-taste-frontend` §4.7 *(màn đầu vừa khung, ≤ 4 phần tử chữ, eyebrow ≤ 1/3 số section, không lặp họ bố cục, bento đúng số ô, mỗi ý định CTA một nhãn)* | Mật độ theo dial D 6–8 · bảng có lọc/sắp · phím tắt · trạng thái đủ · **Jakob's Law**: đi theo quy ước quen thuộc |
| Chuyển động | Theo họ phong cách, có thể tới nhịp điện ảnh | M ≤ 4. Chuyển động chỉ để **phản hồi** và **chuyển trạng thái** |
| Không áp dụng | — | AIDA, màn đầu kiểu hero, marquee, bento trang trí, ảnh nền điện ảnh |
| Số liệu | Ít, có chọn lọc, không bịa độ chính xác | Dày, **tabular-nums**, căn phải cột số |
| Kiểm UX | 12 điểm + soát gu marketing | 12 điểm + Fitts · Hick · Doherty *(phản hồi ≤ 400 ms)* · Tesler |

---

## 6. Ảnh và tài sản

Theo thứ tự:
1. Ảnh **thật** của người dùng hoặc của brand.
2. **Công cụ sinh ảnh**, nếu phiên có: mỗi section một ảnh riêng, đúng tỉ lệ khung, **chỉ ảnh chụp hoặc minh hoạ: không chữ, không nút, không khung giao diện** *(chữ nằm trong ảnh thì `preflight.py` không kiểm được)*.
3. `https://picsum.photos/seed/<mô-tả-section>/<w>/<h>`: **chỉ** cho site giới thiệu hoặc e-commerce ở giai đoạn 3 hướng.
4. **Khung placeholder trung thực**, ghi rõ nội dung và cỡ ảnh. Cuối bàn giao liệt kê *"Cần ảnh thật ở: …"*.

**Cấm:** SVG tự vẽ người/cảnh/sản phẩm · màn hình sản phẩm giả bằng `div` đặt trong màn đầu · tường logo toàn chữ trơn *(dùng Simple Icons, hoặc tự dựng monogram cho brand hư cấu)*.

---

## 7. Thư mục đầu ra

Mặc định `docs/prototypes/<slug>/`. Dự án có quy ước khác thì theo dự án.

```
<slug>/
├── DECISIONS.md          # nhật ký 5 cổng — đáp án nguyên văn
├── REFERENCE-READ.md     # (nếu có tham chiếu) token + quyết định trích được
├── DESIGN.md             # design system đã khoá ở Cổng 4
├── directions/           # 3 hướng + index.html so sánh + ảnh chụp
├── site/                 # bản dựng đầy đủ; có app hoặc nhiều bề mặt: assets/ dùng chung, admin/, app/ (mobile-app.md mục 1)
└── _qa/                  # bộ kiểm: script, qa.config.json, steps-*.json, mốc last-green/, ảnh chụp, QA.md
```

---

## 8. Bàn giao

- Link Markdown tới `site/index.html` và `DESIGN.md`. Lệnh mở: `Start-Process "<đường-dẫn>"` (Windows) · `open` (macOS) · `xdg-open` (Linux).
- Ba dòng: hướng đã chọn · kết quả kiểm *(số thật)* · việc còn chờ *(ảnh thật, số minh hoạ cần thay)*.
- Có app: link thêm tới `site/app/index.html` *(trang tổng quan)*, cách mở trên điện thoại thật và danh sách **cần làm ở app thật** *(`mobile-app.md` mục 7, 9)*.
- Người dùng chốt ở Cổng 5 → `python _qa/handover.py promote _qa/handover/<ngày-giờ>` để lấy **mốc bàn giao đầu**. Chạy lại `run` trước nếu đã sửa sau lần chạy đó.
- Thêm khối lệnh kiểm vào `AGENTS.md` hoặc `CLAUDE.md` của dự án *(mẫu `templates/AGENTS-qa.md`)*. Từ đó: sửa nhỏ dùng `tweak-site`, thêm tính năng dùng `evolve-site`, trước khi bàn giao lại dùng `handover-check`.
- Người dùng muốn **chia sẻ** cho người khác xem thì đề xuất đăng thành Artifact.

---

## 9. Phụ thuộc — chép sang dự án khác thì chép kèm

Kiểm nhanh: `python <skills>/sketch-to-site/scripts/preflight.py --deps` *(liệt kê skill thiếu theo mức; thoát mã 1 nếu thiếu mức 🔴)*. Script tìm skill ở thư mục cạnh `sketch-to-site`, ở `.claude/skills`, `.agents/skills`, `.codex/skills` của dự án và của thư mục người dùng, và trong plugin đã cài.
Gói `tapora-proto-kit` đã kèm mọi skill trong bảng. `huashu-design` trong gói là bản rút gọn, đã bỏ slide, animation, video và âm thanh.
Danh sách này **đo bằng grep** mọi tên skill xuất hiện trong thư mục `sketch-to-site/` (28/09): 13 skill. Thêm một chỗ trỏ tới skill mới thì **thêm dòng ở đây và ở `DEPS` trong `preflight.py`**.

| Mức | Skill | Dùng ở | Thiếu thì sao |
|---|---|---|---|
| 🔴 **Bắt buộc** | `ui-ux-pro-max` | B3 *(script tra token)* · `preflight.py` P07 *(dữ liệu font, kiểm dấu tiếng Việt)* | **Hỏng**: B3 không chạy, P07 thành P15, `--selftest` trả mã 1 |
| 🟠 **Nên chép** | `laws-of-ux-checklist` | B7 bước 3 | Nhẹ: 12 điểm đã chép sẵn vào `qa-gate.md` mục 3 |
| 🟠 | `laws-of-ux-review` | Cổng 5 | Mất lựa chọn soát sâu 0–60 |
| 🟠 | `laws-of-ux` | Cổng 5, qua `laws-of-ux-review` | Review **không chạy được**: nó đọc `laws-of-ux/references/ux-laws-complete.md`. **Luôn chép cả ba `laws-of-ux*` cùng nhau** |
| 🟠 | `design-taste-frontend` | Site giới thiệu: luật bố cục §4.7, dấu hiệu AI §9, soát §14 · stack React §3 · soát site cũ §11 | Mất bản đầy đủ của luật bố cục. Bản tóm tắt ở `qa-gate.md` mục 4 vẫn dùng được |
| 🟠 | `huashu-design` | B2 khi tham chiếu là **thương hiệu có thật** *(`references/brand-asset-protocol.md`)* · kho 60 phong cách *(`references/design-styles.md`)* | Mất giao thức lấy logo/ảnh từ nguồn chính thức. Bản trong gói *(~0,3 MB)* giữ quy trình 3 hướng, giao thức tài sản thương hiệu, thư viện phong cách, khung thiết bị, `fetch_images.py`, `verify.py`; đã bỏ nhạc, âm thanh, video, slide *(31 MB)* |
| 🟡 **Theo phong cách** | `high-end-visual-design` | Họ *SaaS cao cấp* · *Hàng hiệu* · *Mềm mại* | Mất phần đọc sâu. Luật chính đã có trong `style-catalogue.md` |
| 🟡 | `minimalist-ui` | Họ *Tối giản* · *Editorial* | như trên |
| 🟡 | `industrial-brutalist-ui` | Họ *Brutalist* · *Cyberpunk* | như trên |
| 🟡 | `gpt-taste` | Họ *Awwwards* | như trên |
| ⚪ **Tuỳ chọn** *(đã nhúng sẵn)* | `stitch-design-taste` | B5: khuôn `DESIGN.md` *(cách viết tên + mã màu + vai trò)*. Skill gốc viết cho **Google Stitch**; các luật còn lại đã thua ở bảng mâu thuẫn dòng 2, 3, 4, 6, 9 | Không sao, khuôn ở `templates/DESIGN.md` |
| ⚪ | `redesign-existing-projects` | B2 khi tham chiếu là site cũ · điều hướng *(mục 0)* | Mất danh sách soát đầy đủ |
| ⚪ | `full-output-enforcement` | B6 | Không sao, luật đã ở mục 3 |

**Không phải skill mà vẫn cần:** Python 3 *(`preflight.py` và `ui-ux-pro-max` chỉ dùng thư viện chuẩn)* · Playwright **hoặc** Edge/Chrome headless để chụp màn hình · mạng *(Google Fonts, Tailwind CDN, Phosphor)* · công cụ `AskUserQuestion` cho các cổng *(không có thì viết câu hỏi ra và kết thúc lượt)* · `WebSearch`/`WebFetch` khi tham chiếu là brand hoặc URL.
