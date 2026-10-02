---
name: sketch-to-site
description: >-
  Dựng TỪ ĐẦU prototype HTML tương tác cấp studio: website (landing, site giới thiệu, e-commerce, portfolio), web app / công cụ vận hành, app mobile iOS/Android, hoặc hệ thống nhiều bề mặt (ví dụ admin web + app cho khách, chung thương hiệu và dữ liệu). Nhận CONCEPT.md đã chốt ở sketch-to-concept; dự án chưa có concept thì chạy sketch-to-concept trước. Nhận design system, DESIGN.md, ảnh chụp, URL hoặc thương hiệu làm tham chiếu. Gộp ui-ux-pro-max, huashu-design, design-taste-frontend, laws-of-ux và các skill phong cách. KHÔNG dùng để sửa prototype đã có (evolve-site, redesign-existing-projects), chấm điểm UX trang có sẵn (laws-of-ux-review), làm slide/video, hay khi người dùng chỉ muốn lên concept (sketch-to-concept). Gọi khi người dùng nói "thiết kế website", "thiết kế app", "làm prototype app mobile", "thiết kế hệ thống admin và app", "làm prototype giao diện", "dựng prototype từ đầu".
---

# Sketch to Site · Thiết kế website và app từ đầu

> **v4.2 (01/10/2026)** · Design system theo theme: màu gốc ở `site/assets/themes.json`, `scripts/themes.mjs` tính vai dẫn xuất và đo mọi cặp; mọi theme là một `data-theme` *(B2, D.2)*. Trang design system sống `site/_system.html` duyệt ở Cổng 3. B1 ghi giả định *Thực tế nội dung*. Bộ kiểm đo trên trang render: tương phản và màu theo ý định ở mọi bước; khi bàn giao có thêm lượt kiểm sâu *(trạng thái, bàn phím, tương tác)*. Mốc cũ chưa đo thì ghi nợ cũ *(`qa-gate.md` mục 2)*.
> **v4.1 (29/09/2026)** · Sổ tiến độ `BUILD-LOG.md` ở B3 *(B0 làm tiếp từ sổ)*. B4: tìm nguyên nhân gốc, không làm im bộ kiểm *(`qa-gate.md` mục 6)*, review bằng góc nhìn mới *(`qa-gate.md` mục 7)*. Luật dừng có bảng cớ bỏ cổng. Cổng 4: nhận góp ý theo `rules-and-conflicts.md` mục F.
> **v4.0 (29/09/2026)** · Tách phần concept ra `sketch-to-concept`. Định hình dự án, nạp tham chiếu, tra design intelligence, chọn phong cách và dựng 3 phương án giờ là **Cổng 1–2** ở đó, trên một bảng concept nhìn thấy được. Skill này nhận `CONCEPT.md`, đọc đủ yêu cầu rồi thử concept trên màn khó *(B0–B1)*. Design system, dựng đầy đủ, tự kiểm đổi số thành B2, B3, B4; hai cổng cuối thành **Cổng 3** và **Cổng 4**.
> **v3.1 (29/09/2026)** · Bộ kiểm: tự có khổ 768, bắt chữ tràn hoặc bị cắt trong khung, chụp ảnh ở mọi theme, nền sáng/tối theo `?theme=` chứ không theo máy chạy kiểm *(`templates/theme.js`)*, màn cần tham số khai báo mẫu bằng `qa-query`. Trục biến thể riêng cho app. Câu hỏi định hình dự án giữ ≤ 4 câu một lượt.
> **v3.0 (29/09/2026)** · Thêm **app mobile iOS/Android** và **hệ thống nhiều bề mặt** *(admin web + app)*: câu hỏi định hình dự án hỏi bề mặt và nền tảng, luật ở `references/mobile-app.md`, khuôn ở `templates/mobile/`. Bước dựng đầy đủ dựng dữ liệu dùng chung bằng `templates/store.js` *(mục D.5)*. Skill tham chiếu được đọc theo đường dẫn, không gọi qua công cụ Skill.
> **v2.2 (28/09/2026)** · Bước tự kiểm cài bộ kiểm dùng lại được *(`templates/qa-kit/`)*, làm mốc cho `tweak-site`, `evolve-site`, `handover-check`. Đường dẫn tính từ thư mục skill, cài dạng plugin vẫn chạy.
> **v2 (23/09/2026)** · đổi tên từ `huashu-pro-max` ngày 24/09.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này (`.claude/skills/`, `~/.codex/skills/`, hoặc thư mục cài plugin).
> **Skill tham chiếu:** `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `full-output-enforcement` đã tắt tự kích hoạt. Đọc chúng như tài liệu: mở `<skills>/<tên>/SKILL.md` bằng công cụ đọc file, không gọi qua công cụ Skill. Cần một mục *(ví dụ `design-taste-frontend` §4.7)* thì tìm dòng tiêu đề của mục đó *(`grep -n "^#.* 4\.7 "`)* rồi chỉ đọc đoạn ấy: `design-taste-frontend` dài khoảng 87 KB.
> Việc của skill: **đưa người dùng tới một thiết kế là của họ**, không phải của mô hình. Mô hình lo phần tay nghề: token, bố cục, tương tác, tự kiểm. Concept, phong cách và nghiệm thu là quyền của con người, và skill **dừng lại để hỏi** đúng ở những chỗ đó.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Website / web app **chưa có giao diện**, hoặc có nhưng được phép **làm lại từ đầu** | ✅ Skill này. Chưa có `CONCEPT.md` thì `sketch-to-concept` chạy trước *(B0)* |
| **App mobile** iOS/Android, hoặc **hệ thống nhiều bề mặt** *(admin web + app cho khách)* làm từ đầu | ✅ Skill này, đọc thêm `references/mobile-app.md` |
| Chỉ muốn **lên concept**, chọn phong cách trước, trình khách khi chưa có yêu cầu chi tiết | `sketch-to-concept` |
| Thêm tính năng, màn hay bề mặt mới vào prototype **đã có** | `evolve-site` |
| Có **concept, design system, ảnh chụp, URL tham khảo** và muốn một site mới dựa trên đó | ✅ Skill này. Tham chiếu được nạp ở `sketch-to-concept` A2 |
| Nâng cấp site **đang chạy**, giữ nguyên cấu trúc và code | `redesign-existing-projects` |
| Chấm điểm UX một trang có sẵn | `laws-of-ux-review` (0–60) · `laws-of-ux-checklist` (12 điểm) |
| Infographic tĩnh | `huashu-design` |

---

## 1. LUẬT DỪNG — đọc trước mọi thứ khác

> Chép rút gọn ở `sketch-to-concept` mục 1: sửa thì sửa cả hai.

**Cổng (🛑)** là chỗ chỉ con người được quyết. Tới cổng thì:

1. **Trình bày** thứ cần quyết, bằng thứ nhìn thấy được: bảng so sánh, preview, ảnh chụp bản dựng. Đừng hỏi mở kiểu *"bạn thích phong cách nào?"*.
2. **Hỏi** bằng công cụ `AskUserQuestion`: tối đa 4 câu một lượt, mỗi câu 2–4 lựa chọn. Nếu có khuyến nghị thì đặt lựa chọn đó **đầu tiên** và thêm *"(Khuyến nghị)"*. Với lựa chọn thẩm mỹ, gắn `preview` *(mô tả ngắn hoặc ASCII bố cục)*.
3. **Dừng.** Không có công cụ hỏi thì viết câu hỏi ra rồi **kết thúc lượt**. **Không tự chọn thay**, kể cả ở chế độ tự động, auto mode hay phiên không người trực. Đây là quyết định chỉ người dùng làm được, nên dừng lại không bị coi là tắc việc.
4. **Ghi** đáp án vào `DECISIONS.md` *(mẫu ở `templates/DECISIONS.md`)*: cổng, câu hỏi, đáp án **nguyên văn**, ngày.

**Chỉ được qua cổng mà không hỏi khi:**
- Người dùng **nói rõ trong phiên này** là bỏ qua **đúng cổng đó** *("tự chọn phong cách đi", "không cần concept", "làm luôn")*. Ghi nguyên văn vào `DECISIONS.md`.
- Đáp án **đã có trong input**: người dùng đã nêu, hoặc tài liệu tham chiếu đã chốt. Ghi nguồn. Khi đó chỉ hỏi *cách hiểu* nếu một từ có nhiều nghĩa *(`<skills>/sketch-to-concept/references/concept-method.md` mục 3)*.
- Đang **lặp lại trong hướng đã chọn** (sửa chữ, đổi ảnh, sửa lỗi). Không cần mở lại cổng.

**Đừng:**
- Hỏi thứ suy ra được từ bối cảnh. Cổng chỉ hỏi thứ **làm thay đổi đầu ra**.
- Hỏi trước khi có gì để xem. Không bắt chọn concept khi chưa dựng bảng concept thật.
- Gom câu của cổng sau vào cổng trước cho đỡ một lượt.
- Coi im lặng là đồng ý. Người dùng không trả lời thì nhắc lại câu hỏi.

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

## 2. Thứ tự ưu tiên khi các luật đụng nhau

Các skill nguồn **mâu thuẫn nhau thật**: skill này cấm Lucide mà skill kia dùng Lucide; skill này ép eyebrow ở mọi tiêu đề còn skill kia giới hạn 1/3 số section; skill này chuộng serif Instrument, skill kia cấm. Đụng nhau thì xử theo thứ tự:

1. **Sàn không thương lượng**: tương phản WCAG AA, bàn phím và focus, `prefers-reduced-motion`, không tràn ngang, font có đủ dấu **tiếng Việt**, hiệu năng *(chỉ animate `transform`/`opacity`)*.
2. **Input của người dùng**: brand, design system, concept đã duyệt, câu trả lời ở các cổng.
3. **Luật riêng của concept đã chọn** *(`CONCEPT.md`)* và của họ phong cách của nó *(`references/style-catalogue.md`)*.
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
- **Viết đủ, không cắt** *(`full-output-enforcement`)*: cấm `// ...`, `// phần còn lại tương tự`, cấm bỏ khung. Sắp hết độ dài thì dừng ở chỗ ngắt sạch và ghi `[TẠM DỪNG — xong X/Y. Gõ "tiếp" để làm: <phần kế>]`. Ở B3 thì cập nhật `BUILD-LOG.md` cùng lúc: dòng trong chat có thể mất khi ngữ cảnh bị nén, sổ thì không.

---

## 4. Quy trình · Phần B: 5 bước · Cổng 3–4

Phần A *(Cổng 1 · Brief concept, Cổng 2 · Chọn concept)* ở `sketch-to-concept`. Số cổng đánh **liên tục** qua hai skill, cùng ghi vào một `DECISIONS.md`.

```
[Phần A · sketch-to-concept: 🛑1 Brief concept ─► 🛑2 Chọn concept ─► CONCEPT.md]
B0 Nhận concept ─► B1 Đọc đủ yêu cầu + thử concept ─► B2 Design system + sơ đồ trang
   ─► 🛑3 Duyệt ─► B3 Dựng đầy đủ ─► B4 Tự kiểm ─► 🛑4 Nghiệm thu
```

### B0 · Nhận concept *(không hỏi)*

- **Có `BUILD-LOG.md`**: đang dựng dở, không chạy lại B1–B2. Đọc `CONCEPT.md` và `DESIGN.md`, rồi:
  - còn trang trong phạm vi chưa `xong` → làm tiếp B3 theo luật làm tiếp của sổ;
  - trang trong phạm vi đã `xong` hết mà `DECISIONS.md` chưa có Cổng 4 → sang B4;
  - vẫn làm các dòng còn lại của B0 *(kiểm công cụ, đọc `references/mobile-app.md` nếu có app)*.
- **Có `CONCEPT.md`** ở thư mục prototype: đọc hết. Những gì mục 4 của nó ghi *đã khoá* thì không hỏi lại, không tự đổi.
- **Chưa có:** đọc `<skills>/sketch-to-concept/SKILL.md` và làm Phần A trước, trong cùng phiên. Xong Cổng 2 mới quay lại đây.
- **Dự án đang làm dở theo quy trình trước v4.0** *(`DECISIONS.md` đã ghi một hướng được chọn trong 3 hướng dựng thử)*: coi hướng đó là concept đã chốt. Viết `CONCEPT.md` từ hướng đó theo `<skills>/sketch-to-concept/templates/CONCEPT.md`, không bắt người dùng làm lại Phần A.
- Kiểm công cụ đang có: `AskUserQuestion` · Playwright hoặc `msedge`/`chrome` headless để chụp màn hình · `WebFetch`.
- **Có app** *(dòng Sản phẩm ở `CONCEPT.md` mục 0)*: đọc `references/mobile-app.md`. Luật trong đó đè luật bố cục web khi đụng nhau, và áp ở mọi bước sau.

### B1 · Đọc đủ yêu cầu và thử concept *(không hỏi)*

- Quét dự án, **lần này đọc đủ**: tài liệu yêu cầu *(đặc tả từng chức năng, trường dữ liệu, quy tắc nghiệp vụ, luồng lỗi)*, glossary, prototype cũ, `DESIGN.md`, token, logo, font, `CLAUDE.md`. Dự án có quy ước thư mục hay quy tắc prototype thì **theo quy ước đó**.
- Ra **danh sách màn, dữ liệu, luồng**: đầu vào cho sơ đồ trang ở B2.
- **Thực tế nội dung**, ghi vào `DECISIONS.md` mục *Giả định* *(không hỏi; Cổng 3 chỉ nêu dòng nào đổi thiết kế)*: mỗi danh sách khi rỗng, một mục, nhiều mục *(bao nhiêu)*; chuỗi dài nhất có thật *(tên công ty, địa chỉ, mã giao dịch)*; số lớn nhất; số nào thật, số nào minh hoạ; hành động nào không đảo ngược được, xác nhận bằng gì, thất bại thì người dùng đọc gì. Mỗi dòng: **giả định · mặc định đã chọn · giá phải trả nếu sai**.
- Tham chiếu: dùng lại `REFERENCE-READ.md` của Phần A. Có tham chiếu mới thì đọc theo `references/reference-intake.md`.
- **Thử concept trên 2 màn khó nhất** với concept: bảng dày nhất, form dài nhất, trạng thái rỗng và lỗi, màn của bề mặt khác. Ghi concept **giữ được ở đâu, gãy ở đâu**.
- Concept gãy thì **không tự pha loãng**. Đưa lên Cổng 3 *(câu 3)*.
- Có app: tra luật iOS/Android bằng `--domain web` và `--domain ux` *(`mobile-app.md` mục 8)*.

### B2 · Design system + sơ đồ trang

- **Màu theo theme:** chép `templates/themes.json` thành `site/assets/themes.json`, điền màu gốc từ `CONCEPT.md` mục 3 *(mỗi nền của concept là một theme; bảng đổi tên vai ở cuối mục 3 của `CONCEPT.md`)*. Chạy `node <skills>/sketch-to-site/scripts/themes.mjs <thư-mục-prototype>`. Lệnh tính vai dẫn xuất *(hover, nhấn, nền nhạt, viền control, vòng focus, liên kết, màu báo)*, đo mọi cặp ở mọi theme, rồi ghi `site/assets/themes.css`. Cặp dưới ngưỡng thì lệnh không ghi file: sửa màu gốc, không hạ ngưỡng. Cặp **SÁT** *(vượt ngưỡng chưa tới 0,3)* chỉ cần một lớp phủ hay một bước hover là rớt: nêu ở Cổng 3. Cần theme thương hiệu thứ hai thì thêm một mục vào `themes` *(mọi theme là một `data-theme`, `references/rules-and-conflicts.md` D.2)*.
- **Thang không màu:** chép `templates/tokens.css` thành `site/assets/tokens.css`. Đặt thang chữ theo họ phong cách *(chữ hiển thị ≥ 2,5 lần chữ thân)*, bóng 4 bậc theo độ cao, bo góc, chuyển động theo dial MOTION. Chép `templates/color.js` và `templates/theme.js` vào `site/assets/`. Đổi `KEY` trong `theme.js` thành slug của dự án *(như `store.js`)*, để theme đã chọn không lan sang prototype khác mở bằng `file://`.
- Viết `DESIGN.md` theo `templates/DESIGN.md`: bảng màu và dòng kết quả lấy từ `themes.mjs`, bảng 8 trạng thái cho từng component, **một bộ icon**, **danh sách cấm riêng** của dự án.
- **Trang design system sống:** chép `templates/system.html` thành `site/_system.html`. Phần token tự vẽ. Thay khối `data-system-demo` bằng component **thật** của dự án *(nút, ô nhập, bảng, thẻ, tab, thông báo, hộp thoại, component đặc trưng)*, dùng đúng CSS mà các trang sẽ dùng. Mỗi component đủ trạng thái: trạng thái tĩnh dùng `disabled`, `aria-busy`, `aria-invalid`, `aria-selected` và gắn `data-demo-state`; hover, focus, nhấn để sống. Mỗi component thêm một biến thể nội dung khó *(chuỗi dài, số lớn, rỗng)*. Chạy `preflight.py` cho `site/`: 0 lỗi, không P19, P20.
- Lập **sơ đồ trang**: danh sách trang/màn, các section theo thứ tự, hành động chính của từng màn, nội dung và dữ liệu mỗi section cần. Màn then chốt ở `concept/<id>.html` là màn đầu tiên của sơ đồ.
- Đề xuất **phạm vi lần này** để hỏi ở Cổng 3.
- Có app: sơ đồ màn ghi thêm **tab** và **ngăn xếp** *(màn nào đi sâu từ màn nào)*. Hệ thống nhiều bề mặt: chia sơ đồ theo bề mặt, kèm bảng **luồng xuyên bề mặt**. Phần riêng của từng bề mặt ghi ở `DESIGN.md` mục 10.

### 🛑 Cổng 3 · Duyệt design system, sơ đồ trang và phạm vi

Đây là **cổng cuối trước bước tốn công nhất**. Người duyệt **nhìn** design system, không đọc mô tả:
- Chụp `site/_system.html` ở khổ 1440 cho mỗi theme *(`?theme=<tên>`; lệnh chụp tay ở `references/qa-gate.md` mục 2)*, mở từng ảnh ra xem, đưa ảnh lên cổng kèm link mở trang.
- Kèm dòng cuối của `themes.mjs` *(số theme, số cặp, số sát ngưỡng)* và các cặp SÁT nếu có.
- Tóm tắt `DESIGN.md` trong ≤ 10 dòng, sơ đồ trang, kết quả thử concept ở B1, và giả định *Thực tế nội dung* nào đổi thiết kế.

Rồi hỏi **một lượt**:

1. **Design system và sơ đồ trang:** Duyệt · Sửa token *(nói rõ sửa gì; sửa ở `themes.json` hay `tokens.css` rồi chạy lại `themes.mjs`)* · Sửa sơ đồ trang · Quay lại concept *(Cổng 2)*.
2. **Phạm vi lần này:** 1 trang chủ · Trang chủ + 2–4 trang con · Toàn bộ luồng *(liệt kê)*.
3. **Chỗ concept gãy** *(chỉ hỏi khi B1 ghi có)*: Giữ concept, chấp nhận ngoại lệ ở màn X · Chỉnh token cho các màn đó · Quay lại Cổng 2.

### B3 · Dựng đầy đủ

Yêu cầu kỹ thuật ở `references/rules-and-conflicts.md` mục D. Tóm tắt:

- **Sổ tiến độ** *(`templates/BUILD-LOG.md`)*: trước trang đầu tiên, chép khuôn thành `BUILD-LOG.md` ở thư mục prototype, mỗi trang trong phạm vi đã chốt ở Cổng 3 một dòng. Dựng xong trang nào thì chạy `preflight.py` cho trang đó; được **0 lỗi** mới đổi thành `xong` và dán dòng kết quả. **Làm tiếp** *(phiên mới, ngữ cảnh bị nén, người dùng gõ "tiếp")*: đọc sổ trước tiên, xác nhận các trang `xong` theo luật làm tiếp ở đầu sổ *(**mở file thật**, chạy lại `preflight.py`; file mất hay đã bị sửa thì xử như sổ ghi)*, ghi một dòng vào *Lần tiếp tục*. Không dựng lại trang đã `xong`.
- Một file HTML mỗi trang, hoặc một SPA nhẹ. Mọi trang nạp `assets/theme.js` *(trong `<head>`, không `defer`)*, `assets/tokens.css`, `assets/themes.css` *(D.2)*. Không định nghĩa màu ở trang; `tailwind.config` đọc lại chính các token đó. Đổi màu: sửa `themes.json` rồi chạy lại `themes.mjs`, không sửa `themes.css`.
- **Theme:** `?theme=<tên>` ép một theme cho cả phiên, để demo và để bộ kiểm chụp đúng theme. Nút đổi theme gọi `theme.set('<tên>')` hoặc `theme.toggle()` *(D.2)*.
- Font lấy từ Google Fonts, **đã kiểm tiếng Việt**. Icon mặc định là **Phosphor** *(Lucide được phép khi họ phong cách là *công cụ vận hành*)*. **Không emoji.**
- JS thuần: tab `data-tab-target`, modal/drawer `data-modal-open`/`-close` + `Esc` + khoá focus, lọc bảng, toast, trạng thái *đang tải / rỗng / lỗi*.
- **Dữ liệu dùng chung** khi là web app hoặc có từ 2 trang cùng đọc một loại dữ liệu: dữ liệu mẫu ở `assets/data.js`, mọi trang đọc ghi qua `assets/store.js` chép từ `templates/store.js` *(mục D.5)*. Tạo đơn ở trang này thì trang khác thấy, F5 không mất, `?reset` về dữ liệu mẫu. Trang đọc tham số URL *(chi tiết theo `?id=`)* khai báo mẫu cho bộ kiểm: `<meta name="qa-query" content="?id=<mã có trong data.js>">`.
- **Giữ concept:** ý, ẩn dụ, khoảnh khắc đọc lần hai và tương tác đặc trưng ở `CONCEPT.md` phải còn thấy được trên bản dựng, không chỉ ở màn then chốt.
- Chuyển động **theo nhịp đã chốt** *(`CONCEPT.md` mục 1: dial và nhịp)*. Cuộn thì dùng `IntersectionObserver`, **cấm** `addEventListener('scroll')`. Mọi chuyển động gói trong `prefers-reduced-motion`. GSAP *(qua cdnjs)* chỉ khi nhịp ≥ 8.
- Bộ luật bố cục theo **loại sản phẩm** *(mục 5)*.
- **App:** chép `templates/mobile/app.css`, `app.js` và `templates/theme.js` vào `site/assets/`; màn gốc tab theo `screen.html`, màn đi sâu theo `detail.html`, trang tổng quan `site/app/index.html` theo `overview.html`. Mọi bề mặt dùng chung `assets/tokens.css`, `assets/themes.css` và `assets/tw.js` *(`mobile-app.md` mục 1)*.
- **Component mới trong lúc dựng:** thêm vào `site/_system.html` ngay, đủ trạng thái, để bộ kiểm đo nó ở mọi theme.

### B4 · Tự kiểm *(phải qua hết rồi mới được mở Cổng 4)*

Chi tiết ở `references/qa-gate.md`:

1. `python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-site>`: bắt emoji, gạch dài trong chữ hiển thị, `h-screen`, lắng nghe scroll, `#000000`, Lorem/John Doe/Acme, font thiếu dấu tiếng Việt, ảnh thiếu `alt`, eyebrow vượt trần, biến CSS chưa định nghĩa (P19), màu viết cứng (P20), `themes.css` cũ hơn `themes.json` (P21). **Phải 0 lỗi.**
2. **Cài bộ kiểm rồi chạy** *(lần đầu)*:
   - Đã có `_qa/` từ trước *(làm tiếp, dự án cũ)*: chạy `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update` trước lần kiểm đầu của phiên. Lệnh chỉ chép đè script của bộ kiểm bằng bản của kit đang dùng, không đụng `qa.config.json`, file bước, mốc.
   - `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype>`. Lệnh chép script vào `_qa/`, sinh `qa.config.json` với một bộ khói cho mỗi trang ở 1440, 768, 390 *(màn app: 1440 và 390)*. Site có nền tối thì lệnh tự thêm theme `light` và `dark`.
   - Có `site/assets/themes.json` thì mỗi theme trong đó là một theme của bộ kiểm; có `site/_system.html` thì bộ khói của nó kiểm component mẫu đã thay và mọi cặp màu đạt; trang nạp `store.js` có thêm bộ `du-lieu-rong-*` *(`?data=empty`)* và `du-lieu-dai-*` *(`?data=stress`)*.
   - Lệnh in **CẢNH BÁO** khi trang đọc tham số URL mà chưa có `qa-query`: thêm mẫu theo đúng dòng cảnh báo, nếu không bộ khói chỉ chụp được màn "không tìm thấy".
   - Sửa cấu hình: web app thì `preflight_kind` là `app`; theme khác thì khai báo ở `themes`.
   - Có app: lệnh tự thêm bước `tap-targets` cho màn app. Làm cả iOS và Android thì thêm `"android": "?platform=android"` vào `themes`.
   - `python _qa/handover.py run`: bắt lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung, **tương phản trên nền thật** và **màu theo ý định** ở mọi bước, mọi theme. Bộ khói khổ desktop của mỗi trang *(dự án không có bộ khói thì bộ khổ desktop đầu tiên của trang)* có thêm **lượt kiểm sâu**: tương phản khi hover và focus, Tab tới được mọi control, phím mũi tên của widget, bấm thật từng control hứa trạng thái. Chụp ảnh từng trang ở mọi theme vào `_qa/handover/<ngày-giờ>/<theme>/`. Lần chạy đầu chưa có mốc nên mọi dòng là lỗi: sửa về 0 trước Cổng 4 *(`references/qa-gate.md` mục 2)*.
   - Mở ảnh ra xem theo `qa-gate.md` mục 2: màn đầu nằm trọn trong khung, menu desktop một dòng, bảng ở 768 không bị ép cột.
   - Ảnh của bộ `du-lieu-rong-*` và `du-lieu-dai-*`: trạng thái rỗng có lời hướng dẫn, nội dung dài không vỡ bố cục.
   - Không chạy được trình duyệt headless thì chụp tay theo `qa-gate.md` mục 2.
3. **`laws-of-ux-checklist`** 12 điểm trên từng trang. Mỗi dòng ghi ✅ hoặc ❌ **kèm dòng code làm bằng chứng**.
4. **Soát gu** theo loại sản phẩm *(`qa-gate.md` mục 4)*, và soát **concept còn nguyên** *(B3, dòng Giữ concept)*.
5. **Review bằng góc nhìn mới** *(có công cụ tạo subagent và phiên cho phép)*: giao cho một subagent **chưa tham gia dựng**, prompt ở `references/qa-gate.md` mục 7. Soát từng vấn đề theo `references/rules-and-conflicts.md` mục F trước khi sửa: vấn đề đụng thứ đã khoá hay ngoài phạm vi thì không sửa, đưa lên Cổng 4. Còn lại: mức *Chặn nghiệm thu* và *Nên sửa* thì sửa rồi chạy lại các bước trên; mức *Nhỏ* thì liệt kê ở Cổng 4. Không có công cụ đó thì bỏ bước này và ghi *không có review độc lập* vào báo cáo Cổng 4.

Có lỗi thì tìm nguyên nhân gốc rồi sửa ở gốc, theo `references/qa-gate.md` mục 6, rồi chạy lại. **Không** mang lỗi đã biết vào Cổng 4, và **không làm im** bộ kiểm.

Sửa một trang đã ghi `xong` trong `BUILD-LOG.md` thì ghi lại cột Kiểm và dấu nội dung của dòng đó ngay trong lượt sửa *(luật ghi ở đầu sổ)*. Không ghi thì lần làm tiếp sau sẽ chặn trang đó để hỏi người dùng.

### 🛑 Cổng 4 · Nghiệm thu

Báo **số thật**: preflight *(n lỗi · n cảnh báo)*, UX *(n/12 mỗi trang)*, ảnh chụp 3 cỡ màn hình, danh sách placeholder ảnh còn chờ, và các số minh hoạ tự đặt. Rồi hỏi: **Chốt** · **Sửa theo danh sách** · **Chạy `laws-of-ux-review` đầy đủ (0–60)** · **Đổi concept** *(về Cổng 2)*.

**Khi nào khuyến nghị `laws-of-ux-review`:** đưa lựa chọn này lên **đầu** và gắn *(Khuyến nghị)* nếu có **ít nhất một** điều kiện sau:
- Loại sản phẩm là **web app / công cụ vận hành**. Review có 4 luật mà checklist 12 điểm không phủ, và cả 4 nặng ký với người dùng cả ngày: **Paradox of the Active User** *(không ai đọc hướng dẫn → gợi ý ngay tại chỗ)* · **Postel's Law** *(nhận SĐT có dấu cách, ngày nhiều định dạng)* · **Mental Model** *(khớp thói quen cũ, ví dụ Excel)* · **Working Memory** *(không bắt nhớ mã từ màn này sang màn khác)*.
- Có trang chỉ đạt **7–9/12** ở checklist.

Ngoài hai trường hợp đó *(site giới thiệu đạt 10–12/12)*: vẫn đưa lựa chọn, nhưng **không** gắn khuyến nghị. **Chốt** đứng đầu. Review chấm **từng trang** và dài, nên chạy **một lần trước khi giao**, không chạy ở mỗi lượt sửa.

Người dùng chọn **Sửa theo danh sách**: làm theo `references/rules-and-conflicts.md` mục F.

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
3. `https://picsum.photos/seed/<mô-tả-section>/<w>/<h>`: **chỉ** cho site giới thiệu hoặc e-commerce, ở bảng concept.
4. **Khung placeholder trung thực**, ghi rõ nội dung và cỡ ảnh. Cuối bàn giao liệt kê *"Cần ảnh thật ở: …"*.

**Cấm:** SVG tự vẽ người/cảnh/sản phẩm · màn hình sản phẩm giả bằng `div` đặt trong màn đầu · tường logo toàn chữ trơn *(dùng Simple Icons, hoặc tự dựng monogram cho brand hư cấu)*.

---

## 7. Thư mục đầu ra

Mặc định `docs/prototypes/<slug>/`. Dự án có quy ước khác thì theo dự án.

```
<slug>/
├── DECISIONS.md          # nhật ký 4 cổng qua hai skill: đáp án nguyên văn
├── REFERENCE-READ.md     # (nếu có tham chiếu) token + quyết định trích được
├── CONCEPT.md            # concept chốt ở Cổng 2 (sketch-to-concept): nguồn token tới Cổng 3
├── concept/              # bảng concept: index.html, concepts.js, tokens.js, 3 màn then chốt, ảnh chụp
├── DESIGN.md             # design system đã khoá ở Cổng 3
├── BUILD-LOG.md          # sổ tiến độ dựng ở B3 (và các đợt evolve-site Cấp 3)
├── site/                 # bản dựng đầy đủ; _system.html (design system sống); assets/: themes.json, themes.css, tokens.css, theme.js, color.js; có app hoặc nhiều bề mặt: admin/, app/ (mobile-app.md mục 1)
└── _qa/                  # bộ kiểm: script, qa.config.json, steps-*.json, mốc last-green/, ảnh chụp, QA.md
```

---

## 8. Bàn giao

- Link Markdown tới `site/index.html` và `DESIGN.md`. Lệnh mở: `Start-Process "<đường-dẫn>"` (Windows) · `open` (macOS) · `xdg-open` (Linux).
- Ba dòng: concept đã chọn · kết quả kiểm *(số thật)* · việc còn chờ *(ảnh thật, số minh hoạ cần thay)*.
- Có app: link thêm tới `site/app/index.html` *(trang tổng quan)*, cách mở trên điện thoại thật và danh sách **cần làm ở app thật** *(`mobile-app.md` mục 7, 9)*.
- Người dùng chốt ở Cổng 4 → `python _qa/handover.py promote _qa/handover/<ngày-giờ>` để lấy **mốc bàn giao đầu**. Chạy lại `run` trước nếu đã sửa sau lần chạy đó.
- Thêm khối lệnh kiểm vào `AGENTS.md` hoặc `CLAUDE.md` của dự án *(mẫu `templates/AGENTS-qa.md`)*. Từ đó: sửa nhỏ dùng `tweak-site`, thêm tính năng dùng `evolve-site`, trước khi bàn giao lại dùng `handover-check`.
- Người dùng muốn **chia sẻ** cho người khác xem thì đề xuất đăng thành Artifact.

---

## 9. Phụ thuộc — chép sang dự án khác thì chép kèm

Kiểm nhanh: `python <skills>/sketch-to-site/scripts/preflight.py --deps` *(liệt kê skill thiếu theo mức; thoát mã 1 nếu thiếu mức 🔴)*. Script tìm skill ở thư mục cạnh `sketch-to-site`, ở `.claude/skills`, `.agents/skills`, `.codex/skills` của dự án và của thư mục người dùng, và trong plugin đã cài.
Gói `tapora-proto-kit` đã kèm mọi skill trong bảng. `huashu-design` trong gói là bản rút gọn, đã bỏ slide, animation, video và âm thanh.
Danh sách này **đo bằng grep** mọi tên skill xuất hiện trong thư mục `sketch-to-site/` (29/09): 14 skill. Thêm một chỗ trỏ tới skill mới thì **thêm dòng ở đây và ở `DEPS` trong `preflight.py`**.

| Mức | Skill | Dùng ở | Thiếu thì sao |
|---|---|---|---|
| 🔴 **Bắt buộc** | `sketch-to-concept` | B0 *(Phần A: Cổng 1–2, `CONCEPT.md`)* | **Hỏng** khi dự án chưa có `CONCEPT.md`: không có bước lên concept |
| 🔴 | `ui-ux-pro-max` | `sketch-to-concept` A2 *(script tra token)* · B1 *(luật app)* · `preflight.py` P07 *(dữ liệu font, kiểm dấu tiếng Việt)* | **Hỏng**: không tra được, P07 thành P15, `--selftest` trả mã 1 |
| 🟠 **Nên chép** | `laws-of-ux-checklist` | B4 bước 3 | Nhẹ: 12 điểm đã chép sẵn vào `qa-gate.md` mục 3 |
| 🟠 | `laws-of-ux-review` | Cổng 4 | Mất lựa chọn soát sâu 0–60 |
| 🟠 | `laws-of-ux` | Cổng 4, qua `laws-of-ux-review` | Review **không chạy được**: nó đọc `laws-of-ux/references/ux-laws-complete.md`. **Luôn chép cả ba `laws-of-ux*` cùng nhau** |
| 🟠 | `design-taste-frontend` | Site giới thiệu: luật bố cục §4.7, dấu hiệu AI §9, soát §14 · stack React §3 · soát site cũ §11 | Mất bản đầy đủ của luật bố cục. Bản tóm tắt ở `qa-gate.md` mục 4 vẫn dùng được |
| 🟠 | `huashu-design` | `sketch-to-concept`: tham chiếu là **thương hiệu có thật** *(`huashu-design/references/brand-asset-protocol.md`)*, nguồn concept B và kho 60 phong cách *(`huashu-design/references/design-styles.md`)*, tự chấm concept | Mất giao thức lấy logo/ảnh từ nguồn chính thức. Bản trong gói *(~0,3 MB)* giữ quy trình 3 hướng, giao thức tài sản thương hiệu, thư viện phong cách, khung thiết bị, `fetch_images.py`, `verify.py`; đã bỏ nhạc, âm thanh, video, slide *(31 MB)* |
| 🟡 **Theo phong cách** | `high-end-visual-design` | Họ *SaaS cao cấp* · *Hàng hiệu* · *Mềm mại* | Mất phần đọc sâu. Luật chính đã có trong `style-catalogue.md` |
| 🟡 | `minimalist-ui` | Họ *Tối giản* · *Editorial* | như trên |
| 🟡 | `industrial-brutalist-ui` | Họ *Brutalist* · *Cyberpunk* | như trên |
| 🟡 | `gpt-taste` | Họ *Awwwards* | như trên |
| ⚪ **Tuỳ chọn** *(đã nhúng sẵn)* | `stitch-design-taste` | B2: khuôn `DESIGN.md` *(cách viết tên + mã màu + vai trò)*. Skill gốc viết cho **Google Stitch**; các luật còn lại đã thua ở bảng mâu thuẫn dòng 2, 3, 4, 6, 9 | Không sao, khuôn ở `templates/DESIGN.md` |
| ⚪ | `redesign-existing-projects` | `sketch-to-concept` A2 khi tham chiếu là site cũ · điều hướng *(mục 0)* | Mất danh sách soát đầy đủ |
| ⚪ | `full-output-enforcement` | B3 | Không sao, luật đã ở mục 3 |

**Không phải skill mà vẫn cần:** Python 3 *(`preflight.py` và `ui-ux-pro-max` chỉ dùng thư viện chuẩn)* · Playwright **hoặc** Edge/Chrome headless để chụp màn hình · mạng *(Google Fonts, Tailwind CDN, Phosphor)* · công cụ `AskUserQuestion` cho các cổng *(không có thì viết câu hỏi ra và kết thúc lượt)* · `WebSearch`/`WebFetch` khi tham chiếu là brand hoặc URL.
