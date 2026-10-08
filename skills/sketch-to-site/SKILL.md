---
name: sketch-to-site
description: >-
  Dựng TỪ ĐẦU prototype HTML tương tác cấp studio: website (landing, site giới thiệu, e-commerce, portfolio), web app / công cụ vận hành, app mobile iOS/Android, hoặc hệ thống nhiều bề mặt (ví dụ admin web + app cho khách, chung thương hiệu và dữ liệu). Nhận CONCEPT.md đã chốt ở sketch-to-concept; dự án chưa có concept thì chạy sketch-to-concept trước. Nhận design system, DESIGN.md, ảnh chụp, URL hoặc thương hiệu làm tham chiếu. Gộp ui-ux-pro-max, huashu-design, design-taste-frontend, laws-of-ux và các skill phong cách. KHÔNG dùng để sửa prototype đã có (evolve-site, redesign-existing-projects), chấm điểm UX trang có sẵn (laws-of-ux-review), làm slide/video, hay khi người dùng chỉ muốn lên concept (sketch-to-concept). Gọi khi người dùng nói "thiết kế website", "thiết kế app", "làm prototype app mobile", "thiết kế hệ thống admin và app", "làm prototype giao diện", "dựng prototype từ đầu".
---

# Sketch to Site · Thiết kế website và app từ đầu

> **v4.7 (08/10/2026)** · Nhiều bề mặt hay nhiều vai: trang lối vào theo `references/trang-loi-vao.md`, kiểu chốt ở Cổng 3, ảnh do `qa-check.py` chụp. Các bước ở `references/b0-b2.md`, `references/b3-b4.md`, mỗi giai đoạn vào bằng một lượt; kiểm một lệnh: `scripts/system-check.mjs` *(B2)*, `scripts/qa-check.py` *(B4)*. Lịch sử phiên bản ở `CHANGELOG.md` của kit.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này (`.claude/skills/`, `~/.codex/skills/`, hoặc thư mục cài plugin). Trên Windows, đường dẫn đưa cho `node` và `python` viết có ổ đĩa và gạch xuôi (`W:/…`), không viết kiểu Git Bash `/w/…`: hai chương trình này không đọc được. Lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh: console Windows (cp1252) dừng giữa chừng với `UnicodeEncodeError`.
> **Skill tham chiếu:** `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `full-output-enforcement` đã tắt tự kích hoạt. Đọc chúng như tài liệu: mở `<skills>/<tên>/SKILL.md` bằng công cụ đọc file, không gọi qua công cụ Skill. Cần một mục *(ví dụ `design-taste-frontend` §4.7)* thì tìm dòng tiêu đề của mục đó *(`grep -n "^#.* 4\.7 "`)* rồi chỉ đọc đoạn ấy: `design-taste-frontend` dài khoảng 87 KB.
> Việc của skill: **đưa người dùng tới một thiết kế là của họ**, không phải của mô hình. Mô hình lo phần tay nghề: token, bố cục, tương tác, tự kiểm. Concept, phong cách và nghiệm thu là quyền của con người, và skill **dừng lại để hỏi** đúng ở những chỗ đó.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Website / web app **chưa có giao diện**, hoặc có nhưng được phép **làm lại từ đầu** | ✅ Skill này. Chưa có `CONCEPT.md` thì `sketch-to-concept` chạy trước *(B0)* |
| **App mobile** iOS/Android, hoặc **hệ thống nhiều bề mặt** *(admin web + app cho khách)* làm từ đầu | ✅ Skill này, đọc thêm `references/mobile-app.md` |
| Chỉ muốn **lên concept**, chọn phong cách trước, trình khách khi chưa có yêu cầu chi tiết | `sketch-to-concept` |
| Nhiều tài liệu, chức năng, vai hay bề mặt *(ngưỡng ở `sketch-to-map` mục 0)* | `sketch-to-map` sau Phần A *(bản đồ chức năng, menu theo vai, đợt dựng)*, rồi skill này |
| Thêm tính năng, màn hay bề mặt mới vào prototype **đã có** | `evolve-site` |
| Có **concept, design system, ảnh chụp, URL tham khảo** và muốn một site mới dựa trên đó | ✅ Skill này. Tham chiếu được nạp ở `sketch-to-concept` A2 |
| Nâng cấp site **đang chạy**, giữ nguyên cấu trúc và code | `redesign-existing-projects` |
| Chấm điểm UX một trang có sẵn | `laws-of-ux-review` (0–60) · `laws-of-ux-checklist` (12 điểm) |
| Infographic tĩnh | `huashu-design` |

---

## 1. LUẬT DỪNG — đọc trước mọi thứ khác

> Chép rút gọn ở `sketch-to-concept` và `sketch-to-map` mục 1: sửa thì sửa cả ba.

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
**Cớ hay gặp để bỏ cổng, và sự thật** *(rút từ `superpowers` writing-skills và brainstorming; khối này giống hệt ở `sketch-to-site`, `sketch-to-concept` và `sketch-to-map`, test giữ ba bản khớp nhau)*:

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
[Dự án lớn · sketch-to-map: kiểm kê ─► bố cục ─► 🛑 Cổng Bản đồ ─► map/]
B0 Nhận concept ─► B1 Đọc đủ yêu cầu + thử concept ─► B2 Design system + sơ đồ trang
   ─► 🛑3 Duyệt ─► B3 Dựng đầy đủ ─► B4 Tự kiểm ─► 🛑4 Nghiệm thu
```

Các bước nằm ở hai file theo giai đoạn: `references/b0-b2.md` *(B0, B1, B2, 🛑 Cổng 3)* và `references/b3-b4.md` *(B0 khi làm tiếp, B3, B4, 🛑 Cổng 4)*. Mỗi giai đoạn chỉ đọc file của nó.

**Lối vào.** Nhìn thư mục prototype, chọn đúng một dòng. Lượt kế tiếp làm **cả cột Lượt vào trong một lượt**: các lệnh `Read` và lệnh Bash gọi cùng lúc.

| Thư mục prototype | Làm | Lượt vào |
|---|---|---|
| Chưa có `CONCEPT.md` | Phần A trước, trong cùng phiên: đọc `<skills>/sketch-to-concept/SKILL.md`. Xong Cổng 2 thì quay lại đây | |
| Dự án làm dở theo quy trình trước v4.0 *(`DECISIONS.md` ghi một hướng được chọn trong 3 hướng dựng thử)* | Coi hướng đó là concept đã chốt: viết `CONCEPT.md` từ hướng đó theo `<skills>/sketch-to-concept/templates/CONCEPT.md`, không bắt người dùng làm lại Phần A. Rồi theo dòng dưới | |
| Có `CONCEPT.md`, chưa có `map/features.js`, dòng **Quy mô** ở Cổng 1 đủ ngưỡng `sketch-to-map` | `sketch-to-map` trước, phiên mới *(`<skills>/sketch-to-map/SKILL.md`)*. Người dùng không muốn thì ghi nguyên văn vào `DECISIONS.md`, theo dòng dưới | |
| Có `CONCEPT.md`, chưa có đáp án Cổng 3 | B0 → B1 → B2 → 🛑 Cổng 3 | `Read` `references/b0-b2.md`, `CONCEPT.md`, `DECISIONS.md` *(có bản đồ thì thêm `map/MAP.md`)* · lệnh 1 |
| Cổng 3 đã có đáp án *(trong `DECISIONS.md`, hay người dùng vừa trả lời)*, hoặc có `BUILD-LOG.md` | B3 → B4 → 🛑 Cổng 4 | `Read` `references/b3-b4.md`, `CONCEPT.md`, `DECISIONS.md`, `DESIGN.md`, `BUILD-LOG.md` *(chưa có thì khuôn `<skills>/sketch-to-site/templates/BUILD-LOG.md`)*, `site/_system.html` và `site/assets/site.css` *(CSS component dùng chung; tên khác thì đọc file mà `_system.html` nạp)* · lệnh 2 |

Lệnh 1 chép khuôn của B2 *(dùng nguyên hoặc sẽ điền)*, in luật mà B2 dùng *(`rules-and-conflicts.md` mục A, B, D.2)* và danh sách họ phong cách:

```bash
S="<skills>/sketch-to-site"; P="<thư-mục-prototype>"; mkdir -p "$P/site/assets" && cp "$S/templates/themes.json" "$S/templates/tokens.css" "$S/templates/color.js" "$S/templates/theme.js" "$P/site/assets/" && cp "$S/templates/system.html" "$P/site/_system.html"; sed -n '/^### A\.1/,/^## C\./p;/^### D\.2/,/^### D\.3/p' "$S/references/rules-and-conflicts.md"; grep '^### ' "$S/references/style-catalogue.md"
```

Lệnh 2 in luật mà B3 dùng *(mục A, B, D.1–D.4, E)*, màn then chốt của concept *(`concept/<id>.html`, id ở `CONCEPT.md` mục 1)*, danh sách file đã có trong `site/` và tên mọi token *(giá trị ở `DESIGN.md`)*:

```bash
S="<skills>/sketch-to-site"; P="<thư-mục-prototype>"; sed -n '/^### A\.1/,/^## C\./p;/^### D\.1/,/^### D\.5/p;/^## E\./,/^## F\./p' "$S/references/rules-and-conflicts.md"; id=$(sed -n 's/.*\*\*Concept:\*\* *\([a-z0-9-]*\).*/\1/p' "$P/CONCEPT.md" | head -1); [ -f "$P/concept/$id.html" ] && { echo "== concept/$id.html"; cat "$P/concept/$id.html"; }; ls "$P/site" "$P/site/assets"; echo "== token"; grep -oh -- '--[a-z][a-z0-9-]*:' "$P/site/assets/tokens.css" "$P/site/assets/themes.css" | sort -u | tr '\n' ' '
```

**Ít lượt.** Mỗi lượt đọc lại cả ngữ cảnh, nên cuối một giai đoạn mỗi lượt tốn 25–35k token. Đo ở bản 4.4: 59–69 lượt mỗi giai đoạn, 75–85 % lượt chỉ có một lệnh gọi.
- Lệnh và lần đọc **không phụ thuộc nhau** thì gọi chung một lượt *(nhiều lệnh gọi trong cùng một tin nhắn)*: đọc nhiều file một lượt; mọi chỗ sửa sau một lần kiểm làm trong một lượt, rồi chạy lại.
- Mở **mọi ảnh** mà lệnh kiểm liệt kê trong **một** lượt, không mỗi lượt một hai ảnh.
- File đã chép từ khuôn thì `Read` bản chép rồi mới sửa *(Write và Edit từ chối file chưa đọc)*. Khuôn chỉ để làm theo *(`templates/DESIGN.md`, `templates/BUILD-LOG.md`)* thì đọc ở thư mục skill rồi viết file mới, không chép.
- Đọc `references/` bằng lệnh in đúng mục mà file giai đoạn ghi, không đọc cả file. Không đọc mã của script để biết cách dùng, kể cả phần đầu: cách gọi, kết quả và mã thoát đã ghi đủ trong file giai đoạn.
- Kiểm bằng hai lệnh một lần: `scripts/system-check.mjs` *(B2, ảnh Cổng 3)* và `scripts/qa-check.py` *(B4)*. Không tự viết bộ chụp hay bộ cuộn, không gọi riêng `run.mjs`, Edge `--screenshot` hay Playwright.

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
├── DECISIONS.md          # nhật ký các cổng qua ba skill: đáp án nguyên văn
├── REFERENCE-READ.md     # (nếu có tham chiếu) token + quyết định trích được
├── CONCEPT.md            # concept chốt ở Cổng 2 (sketch-to-concept): nguồn token tới Cổng 3
├── concept/              # bảng concept: index.html, concepts.js (mọi vòng), tokens.js, màn then chốt của mọi vòng, ảnh chụp
├── map/                  # (dự án lớn) bản đồ của sketch-to-map: features.js, layout.js, MAP.md, khung bấm thử index.html
├── DESIGN.md             # design system đã khoá ở Cổng 3
├── BUILD-LOG.md          # sổ tiến độ dựng ở B3 (và các đợt evolve-site Cấp 3)
├── _shots/system/        # ảnh _system.html của lệnh kiểm B2 (scripts/system-check.mjs): từng màn và cả trang, trình ở Cổng 3
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

Bảng skill phụ thuộc và lệnh kiểm `python <skills>/sketch-to-site/scripts/preflight.py --deps`: `references/phu-thuoc.md`.
