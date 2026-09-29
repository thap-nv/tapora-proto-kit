---
name: sketch-to-concept
description: >-
  Dùng khi cần chốt concept thiết kế (ý tưởng, phong cách, một màn then chốt) TRƯỚC khi dựng prototype website, web app, app mobile iOS/Android hay hệ thống nhiều bề mặt: người dùng nói "lên concept", "định hướng thiết kế", "style tile", "moodboard", "concept để trình khách", "chọn phong cách trước", kể cả khi chưa có tài liệu yêu cầu chi tiết; hoặc khi sketch-to-site bắt đầu một dự án chưa có CONCEPT.md. KHÔNG dùng khi prototype đã có (evolve-site), sửa nhỏ (tweak-site), chấm UX trang có sẵn (laws-of-ux-review).
---

# Sketch to Concept · Chốt concept trước khi dựng prototype

> **v1.1 (29/09/2026)** · Luật dừng có bảng cớ bỏ cổng. A3: dựng 3 concept bằng 3 subagent song song khi có, chấm lớp Ý bằng một subagent chưa tham gia dựng *(`references/subagent-prompts.md`)*.
> **v1.0 (29/09/2026)** · Phần A của quy trình hai phần. Phần B là `sketch-to-site`, đọc `CONCEPT.md` mà skill này viết ra.
> **Đường dẫn:** `<skills>` là thư mục cha của thư mục chứa SKILL.md này. Skill tham chiếu đọc theo đường dẫn, không gọi qua công cụ Skill *(quy ước ở đầu `sketch-to-site`)*.
> Việc của skill: đưa người dùng tới một concept **là của họ**. Người không làm thiết kế khó tả concept, nhưng phản ứng tốt với phương án nhìn thấy được. Vì vậy skill dựng 3 concept thật, rồi **dừng lại** để người dùng chọn.

---

## 0. Concept gồm ba lớp

| Lớp | Là gì | Trả lời cho |
|---|---|---|
| **Ý** | Một câu ý tưởng + ẩn dụ, gắn với **điểm khác biệt** của sản phẩm | độc đáo |
| **Hình** | Màu theo vai trò, cặp chữ tiếng Việt, bo góc, bóng, chất nền, nền, nhịp | đẹp |
| **Dụng** | **Một màn then chốt** dựng thật bằng nội dung thật, có **một tương tác đặc trưng** bấm được | dùng được |

Phương pháp cho từng lớp: `references/concept-method.md`.

---

## 1. Luật dừng *(cùng luật với `sketch-to-site` mục 1: sửa thì sửa cả hai)*

**Cổng (🛑)** là chỗ chỉ con người được quyết. Tới cổng thì:
1. **Trình bày** bằng thứ nhìn thấy được: bảng concept, ảnh chụp. Đừng hỏi mở kiểu *"bạn thích phong cách nào?"*.
2. **Hỏi** bằng `AskUserQuestion`: tối đa 4 câu một lượt, mỗi câu 2–4 lựa chọn; lựa chọn khuyến nghị đứng **đầu** và ghi *"(Khuyến nghị)"*; lựa chọn thẩm mỹ gắn `preview`.
3. **Dừng.** Không có công cụ hỏi thì viết câu hỏi ra rồi **kết thúc lượt**. **Không tự chọn thay**, kể cả ở chế độ tự động hay phiên không người trực.
4. **Ghi** đáp án **nguyên văn** vào `DECISIONS.md` *(khuôn `<skills>/sketch-to-site/templates/DECISIONS.md`)*.

**Chỉ được qua cổng mà không hỏi khi:** người dùng nói rõ **trong phiên này** là bỏ qua đúng cổng đó *(ghi nguyên văn)* · đáp án **đã có trong input** *(ghi nguồn)*.

<!-- luat-dung:co:bat-dau -->
**Cớ hay gặp để bỏ cổng, và sự thật** *(rút từ `superpowers` writing-skills và brainstorming; khối này giống hệt ở `sketch-to-site` và `sketch-to-concept`, test giữ hai bản khớp nhau)*:

| Cớ | Sự thật |
|---|---|
| "Đang chạy tự động, không ai trực, cứ chọn khuyến nghị cho nhanh" | Cổng là quyết định chỉ người dùng làm được. Dừng ở cổng không bị coi là tắc việc |
| "Phương án khuyến nghị rõ ràng tốt nhất, hỏi chỉ tốn một lượt" | Khuyến nghị đứng đầu và ghi *(Khuyến nghị)*. Chọn vẫn là việc của người dùng |
| "Người dùng giục: nhanh lên, gấp lắm" | Câu giục không phải lời bỏ cổng. Hỏi gọn hơn, gộp câu trong cùng cổng, không bỏ hỏi |
| "Người dùng đã duyệt ý tưởng, coi như duyệt luôn bản dựng" | Một lần duyệt chỉ áp cho **đúng thứ đã trình**. Thứ người dùng chưa xem thì chưa được duyệt |
| "Hỏi trước cho đỡ mất lượt, dựng sau" | Không hỏi khi chưa có gì để xem. Dựng bảng hay bản dựng trước, hỏi sau |
| "Chỉ là sửa nhỏ sau nghiệm thu, đổi luôn token hay concept" | Đổi thứ đã khoá ở cổng nào là mở lại cổng đó |
| "Người dùng chưa trả lời, chắc là đồng ý" | Im lặng không phải đồng ý. Nhắc lại câu hỏi |

Người dùng trả lời *Tuỳ bạn* cho một câu hỏi ở cổng: đó là lời giao quyết định cho câu đó. Chọn lựa chọn khuyến nghị; câu không có khuyến nghị thì chọn lựa chọn đầu, nêu lý do một dòng. Ghi nguyên văn vào `DECISIONS.md`, không hỏi lại câu đó.

**Dấu hiệu phải dừng lại:** thấy mình nghĩ *"để mình chọn luôn"*, *"chắc họ sẽ chọn A"*, *"hỏi thì mất công"*, *"trả lời sau cũng được"*, hay định viết *"tôi đã chọn … cho bạn"* khi người dùng chưa giao câu đó. Gặp một trong số đó: trình bày, hỏi, rồi kết thúc lượt.
<!-- luat-dung:co:ket-thuc -->

---

## 2. Sàn và thứ tự ưu tiên

- **Sàn không thương lượng**, áp cho cả bảng lẫn màn then chốt: tương phản WCAG AA · bàn phím và focus · `prefers-reduced-motion` · không tràn ngang · font có dấu **tiếng Việt** · chỉ animate `transform`/`opacity`.
- Chống AI-slop, dữ liệu thật tiếng Việt, placeholder trung thực, ảnh: theo `sketch-to-site` mục 3 và 6. **Đọc hai mục đó trước khi dựng A3.**
- Luật của skill nguồn *(`huashu-design`, `brandkit`, họ phong cách)* đụng luật kit thì luật kit thắng, theo `sketch-to-site` mục 2.

---

## 3. Quy trình · 2 cổng

```
A1 Đọc lõi ─► 🛑1 Brief concept ─► A2 Nạp tham chiếu + tra ─► A3 Dựng 3 concept ─► 🛑2 Chọn concept ─► Bàn giao
```

Số cổng đánh **liên tục** với `sketch-to-site` *(Cổng 3 và 4 ở đó)*, cùng ghi vào một `DECISIONS.md`.

### A1 · Đọc lõi *(không hỏi)*

- **Đọc:** lời người dùng · tài liệu yêu cầu, **chỉ** mục lục, phần tổng quan hay mục tiêu, persona, và **tên** các chức năng · tham chiếu brand *(logo, màu, `DESIGN.md`)*.
- **Không đọc** đặc tả từng chức năng, trường dữ liệu, quy tắc nghiệp vụ. Phần đó để `sketch-to-site` B1, sau khi concept đã chốt.
- **Đếm loại màn** từ tên chức năng: bảng, form, chi tiết, giới thiệu… Loại chiếm nhiều nhất quyết màn then chốt *(A3)*.
- **Kiểm công cụ:** `AskUserQuestion` · Edge/Chrome headless để chụp · `WebSearch` *(cần cho concept B)* · công cụ sinh ảnh.
- Viết **Brief concept**, mỗi dòng ghi nguồn *(người dùng nói · tài liệu, mục/dòng · đoán)*:
  1. **Sản phẩm:** loại · nền tảng · các bề mặt
  2. **Cho ai:** người dùng chính · thiết bị · hoàn cảnh dùng
  3. **Việc chính:** 1–3 việc · loại màn chiếm nhiều nhất *(số đếm được)*
  4. **Khác biệt:** điều làm sản phẩm khác đối thủ
  5. **Định hướng:** 3 từ · thích · ghét hoặc cấm
  6. **Ràng buộc:** brand, màu hay font bắt buộc, tham chiếu và mức bám

### 🛑 Cổng 1 · Brief concept

Trình brief *(echo-back)*, rồi hỏi **chỉ những dòng trống hoặc đoán**, gộp một lượt:

| Câu | Lựa chọn gợi ý |
|---|---|
| **Loại sản phẩm?** | Site giới thiệu / landing · E-commerce · Web app / công cụ vận hành · Portfolio · **App mobile** · **Hệ thống nhiều bề mặt** *(nêu từng bề mặt)* |
| **Nền tảng app?** *(chỉ khi có app)* | iOS · Android · Cả hai |
| **Người dùng chính và thiết bị?** | Khách lướt điện thoại · Khách mua trên desktop · Nhân viên dùng máy tính cả ngày · Trộn |
| **Tham chiếu và mức bám?** | Bám sát 100 % · Làm nền, được biến tấu · Chỉ lấy cảm hứng · Không có *(`<skills>/sketch-to-site/references/reference-intake.md` mục 1)* |
| **Khác biệt?** · **Định hướng?** | Đưa 3 phương án suy từ brief, người dùng chọn hoặc gõ ở *Other*. **Đừng** bắt người dùng tự viết concept |

- Tối đa 4 câu một lượt. Có app và chưa biết nền tảng thì hỏi nền tảng ở một lượt ngắn ngay sau, vẫn thuộc Cổng 1.
- **Không** hỏi phạm vi *(bao nhiêu trang)*: câu đó ở Cổng 3 của `sketch-to-site`, cùng sơ đồ trang.
- Có app: đọc `<skills>/sketch-to-site/references/mobile-app.md` ngay sau cổng này.

### A2 · Nạp tham chiếu và tra

1. **Tham chiếu** *(nếu có)*: làm theo `<skills>/sketch-to-site/references/reference-intake.md` → `REFERENCE-READ.md`. Tham chiếu là **thương hiệu có thật** thì kiểm bằng `WebSearch` và lấy tài sản từ nguồn chính thức *(`<skills>/huashu-design/references/brand-asset-protocol.md`)*.
2. **Tra:**
   ```bash
   python <skills>/ui-ux-pro-max/scripts/search.py "<ngành> <loại sản phẩm> <từ khoá không khí>" --design-system --variance <V> --density <D> --motion <M>
   python <skills>/ui-ux-pro-max/scripts/search.py "<từ khoá>" --domain style -n 5
   python <skills>/ui-ux-pro-max/scripts/search.py "<từ khoá>" --domain typography -n 5
   python <skills>/sketch-to-site/scripts/preflight.py --font "<Tên font>" "<Tên font>"
   ```
   Giá trị V/M/D ban đầu lấy từ dòng **Dial** của họ phong cách trong `style-catalogue.md`; chạy riêng cho họ của từng concept.
   Satoshi, Cabinet Grotesk, Clash *(Fontshare)* và Outfit, Instrument Serif, Syne, DM Sans, Sora, Orbitron, Bodoni Moda, Archivo Black, Rajdhani *(Google)* **không có dấu tiếng Việt**. Có app: `--design-system` viết cho landing page, chỉ lấy bảng màu làm gợi ý *(`mobile-app.md` mục 8)*.
3. **Chọn 3 concept** theo `references/concept-method.md`:
   - mỗi concept một nguồn: **A hợp nhất** *(`<skills>/sketch-to-site/references/style-catalogue.md`)* · **B chuẩn thật** · **C lăng kính studio** *(mục 3)*. Không bốc ngẫu nhiên;
   - Ý mọc từ dòng **Khác biệt**, trả lời 5 câu tìm form *(mục 2)*;
   - mỗi cặp khác nhau **≥ 3 trục**, **bắt buộc khác khung bố cục** *(mục 4)*;
   - màu theo giao thức 3 bước *(mục 5.1)*; xếp hợp nhất → cân bằng → táo bạo.
   - Mức bám **100 %**: chỉ dựng **một** concept từ tham chiếu *(mục 3.1 dưới)*.

### A3 · Dựng 3 concept

1. **Chép khuôn** vào `<thư-mục-prototype>/concept/`:

   | Khuôn | Thành |
   |---|---|
   | `templates/concept-board.html` | `concept/index.html` *(không sửa)* |
   | `templates/concepts.js` | `concept/concepts.js` |
   | `templates/tokens.js` | `concept/tokens.js` *(không sửa)* |
   | `templates/key-screen.html` | `concept/a.html`, `b.html`, `c.html` *(đổi `data-concept`)* |
   | `<skills>/sketch-to-site/templates/theme.js` | `concept/theme.js`: đổi `KEY` thành `<slug>-concept`, để nền sáng/tối chọn ở bảng này không lan sang bảng của dự án khác cũng mở bằng `file://` |
   | `<skills>/sketch-to-site/templates/mobile/app.css`, `app.js` *(chỉ khi có app)* | `concept/app.css`, `concept/app.js`. Màn app dựng theo `mobile/screen.html` nhưng lấy `<head>` token của `key-screen.html`; `tokens.js` xuất đúng tên biến mà `app.css` đọc *(`--bg`, `--ink`, `--accent`, `--brand-font`…)* |

2. **Viết `concept/concepts.js`:** thay **toàn bộ** dữ liệu mẫu *(nhà rang Hạt Mây)* bằng brief, nội dung dùng chung và 3 concept của dự án. **Xoá `example: true`**. Đi đường subagent *(bước 3)* thì lúc này chỉ ghi brief và nội dung dùng chung, để `concepts: []`: mỗi subagent ghi concept của mình ra file riêng, agent chính ghép sau. `id` chỉ gồm chữ thường a-z, số, dấu gạch ngang. Mọi màu viết hex; font khai trong `fontFamily: { … }`. App muốn thân chữ theo font nền tảng *(SF Pro, Roboto)* thì ghi `body: 'system-ui'`. Bảng tự kiểm dữ liệu và báo lỗi nếu sai quy ước.
3. **Dựng 3 concept** *(dữ liệu trong `concepts.js` và màn then chốt; `concept-method.md` mục 6)*:
   - **ai dựng:** có công cụ tạo subagent **và** phiên cho phép thì 3 subagent **song song**, mỗi subagent một concept, theo prompt ở `references/subagent-prompts.md` mục 1. Mỗi subagent chỉ nhận brief, nội dung dùng chung và phần giao của concept mình *(nguồn, họ phong cách, trục đã chọn ở A2)*, không thấy hai concept kia: tránh ba bản tụ về một lối. Agent chính ghép ba khối vào `concepts.js` rồi xoá các file `{id}.concept.js` và dòng nạp chúng trong `{id}.html` *(prompt mục 1)*. Không có công cụ đó thì **dựng tuần tự**: trước mỗi concept chỉ đọc lại brief và phần giao của concept đó, chưa mở màn của concept khác cho tới khi xong cả ba;
   - **cùng một màn, cùng nội dung** *(`CONCEPTS.content`)*: người dùng so concept, không so nội dung;
   - **khác khung bố cục**, đúng như `axes.khung` đã khai;
   - tương tác đặc trưng **bấm được**;
   - thay `<body>` của khuôn bằng màn thật, viết nội dung thẳng vào HTML, giữ nguyên `<head>`;
   - app: dựng trên `<skills>/sketch-to-site/templates/mobile/screen.html`; nhiều bề mặt: mỗi concept dựng màn then chốt của **mọi** bề mặt.
4. **Tự kiểm**, xong hết mới mở Cổng 2:
   - `python <skills>/sketch-to-site/scripts/preflight.py concept/` → **0 lỗi**;
   - mở `concept/index.html`: không còn dải *dữ liệu mẫu*; mục **So trục** không có cảnh báo; mọi dòng tương phản ≥ AA;
   - chụp `index.html` và từng màn ở 1440 và 390 vào `concept/shots/` *(lệnh ở `<skills>/sketch-to-site/references/qa-gate.md` mục 2)*, rồi **mở ảnh ra xem**;
   - **chấm lớp Ý bằng góc nhìn mới:** có công cụ tạo subagent và phiên cho phép thì giao cho một subagent **chưa tham gia dựng**, prompt ở `references/subagent-prompts.md` mục 2; không có thì tự chấm theo `concept-method.md` mục 7. Concept nào ≤ 5/10 thì làm lại concept đó. Ghi điểm và ai chấm vào `DECISIONS.md` *(Cổng 2)*.

### 🛑 Cổng 2 · Chọn concept

Trình link `concept/index.html` và ảnh chụp, rồi hỏi **một lượt**:
1. **Concept:** A *(Khuyến nghị)* · B · C · Trộn. `preview` mỗi lựa chọn 5 dòng: **Ý** · **Màu** · **Chữ** · **Màn then chốt** · **Giống kiểu**. Lý do khuyến nghị nêu bằng dữ kiện của brief.
2. **Nền:** Sáng · Tối · Theo hệ thống *(concept đã khoá nền thì bỏ câu này)*.
3. **Nhịp:** Như concept · Tĩnh hơn · Sống động hơn. Viết bằng lời, không đưa số dial.

- Chọn **Trộn**: xin **mã trộn** từ khung *Trộn* trên bảng *(ví dụ `man:A mau:B chu:A nut:A`)*, hoặc hỏi tiếp lấy lớp nào từ concept nào.
- Người dùng **còn phân vân** giữa hai bản: làm **một vòng biến thể**, 2 bản của concept được nghiêng về, khác nhau ở trục bố cục *(`style-catalogue.md`, Động cơ biến thể)*, rồi hỏi lại.
- Chốt xong: ghi `DECISIONS.md`, viết `CONCEPT.md` ở thư mục prototype theo `templates/CONCEPT.md`. Khối CSS cho mục 3 lấy bằng lệnh sau, chạy ở thư mục prototype *(thay `<id>` và `<mã trộn>`; không trộn thì để chuỗi rỗng)*: `node -e "global.window = global; require('./concept/concepts.js'); const T = require('./concept/tokens.js'); console.log(T.cssText(T.resolve(CONCEPTS, '<id>', T.parseMix('<mã trộn>'))))"`

### 3.1 Trường hợp rút gọn
- **Bám 100 % tham chiếu:** dựng **một** concept từ tham chiếu. Cổng 2 hỏi *Duyệt · Sửa (nói rõ sửa gì)*.
- **Người dùng đã có concept rõ:** dựng concept đó + 1–2 concept đối chiếu.
- **Người dùng nói bỏ qua concept** *(rõ trong phiên)*: dựng concept khuyến nghị, ghi nguyên văn câu cho phép vào `DECISIONS.md`, đi tiếp.

### Bàn giao
- Link Markdown tới `concept/index.html` và `CONCEPT.md`.
- Được gọi từ `sketch-to-site`: đi tiếp **B0** của nó ngay. Người dùng gọi riêng: hỏi có dựng prototype luôn không *(→ `sketch-to-site`)*.
- Muốn trình khách: đề xuất đăng `concept/` thành Artifact *(`sketch-to-site` mục 8)*.

---

## 4. Thư mục đầu ra

Mặc định `docs/prototypes/<slug>/`, dự án có quy ước khác thì theo dự án.

```
<slug>/
├── DECISIONS.md        # Cổng 1–2 ở đây, Cổng 3–4 do sketch-to-site ghi tiếp
├── REFERENCE-READ.md   # nếu có tham chiếu
├── CONCEPT.md          # concept đã chốt: nguồn token cho tới Cổng 3
└── concept/            # index.html, concepts.js, tokens.js, theme.js, a/b/c.html, shots/
```

---

## 5. Lỗi hay gặp

| Lỗi | Sửa |
|---|---|
| Ba concept chung một khung, chỉ đổi màu và chữ | Khác khung là bắt buộc. Bảng concept báo ở mục **So trục** |
| Concept A dùng nguyên bảng màu của `colors.csv` | Chỉ là điểm xuất phát. Đi đủ giao thức 3 bước, và đổi `#000000` *(P05)* |
| Đọc hết đặc tả trước khi có concept | A1 chỉ đọc lõi. Đặc tả để `sketch-to-site` B1 |
| Còn `example: true` hay chữ mẫu *Hạt Mây* | Thay toàn bộ `concepts.js`. Bảng hiện dải cảnh báo khi còn dữ liệu mẫu |
| Hỏi *"bạn thích phong cách nào?"* trước khi có bảng | Hỏi phong cách chỉ ở Cổng 2, trên bảng đã dựng |
| Concept B chép giao diện sản phẩm làm chuẩn | Chỉ mượn cách giải. Câu *"form đến từ đâu"* phải chỉ vào nội dung của dự án |
| Font không có dấu tiếng Việt | Kiểm từng font bằng `preflight.py --font`; khai trong `fontFamily` để P07 bắt |
| Màn then chốt là hero trong khi sản phẩm chủ yếu là bảng | Chọn màn then chốt theo loại màn đếm được ở A1 |

---

## 6. Phụ thuộc

| Mức | Skill | Dùng ở | Thiếu thì sao |
|---|---|---|---|
| 🔴 **Bắt buộc** | `sketch-to-site` | Khuôn `DECISIONS.md`, `theme.js`, `sketch-to-site/templates/mobile/` · `reference-intake.md`, `style-catalogue.md`, `mobile-app.md`, `qa-gate.md` · `preflight.py` · `qa-kit/run.mjs` cho test | **Hỏng**: không kiểm font, không có kho phong cách |
| 🔴 | `ui-ux-pro-max` | A2 tra màu và chữ · dữ liệu font cho `preflight.py` | **Hỏng**: không tra được, P07 thành P15 |
| 🟠 **Nên chép** | `huashu-design` | Concept B *(`design-styles.md`)* · brand có thật *(`brand-asset-protocol.md`)* · tự chấm *(`critique-guide.md`)* | Nhẹ: phần cốt lõi đã rút vào `references/concept-method.md` |

**Không phải skill mà vẫn cần:** Python 3 · Node 20+ và Edge/Chrome để chụp và chạy test *(`node --test <skills>/sketch-to-concept/tests/`)* · mạng *(Google Fonts, Tailwind CDN)* · `WebSearch` cho concept B · công cụ tạo subagent *(tuỳ chọn, A3)*.
