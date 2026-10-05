---
name: evolve-site
description: >-
  Mở rộng và cập nhật prototype HTML có sẵn (1 → N) — thêm, sửa hoặc bỏ tính năng, màn hình, sub-flow, tương tác nhưng BẢO TOÀN 100% Design System, Data Contract và quy ước kiến trúc của bản UI hiện hữu. Dùng cho mọi dự án và mọi dạng nguồn yêu cầu (PRD, user story, ticket, use case, business rule, brief, hoặc chỉ câu lệnh). Quy trình 5 bước với tối đa 3 CỔNG QUYẾT ĐỊNH dừng lại hỏi người dùng (vị trí lối vào · phương án tích hợp UI · nghiệm thu hồi quy); số cổng co giãn theo 4 cấp tác động và 6 cờ rủi ro (quyền · dữ liệu · logic · yêu cầu · token · dùng chung). Tích hợp full-output-enforcement, laws-of-ux-checklist, ui-ux-pro-max, design-taste-frontend. KHÔNG dùng để làm mới từ đầu (sketch-to-site), KHÔNG dùng để đại tu thẩm mỹ chung (redesign-existing-projects). Dự án có tweak-site thì Cấp 0 và Cấp 1 không cờ đi đường đó; kiểm tổng trước bàn giao dùng handover-check. Gọi khi người dùng nói "thêm tính năng", "cập nhật giao diện", "mở rộng prototype", "thiết kế thêm màn hình".
---

# Evolve Site · Mở rộng & Cập nhật Prototype có sẵn

> **v1.9 (05/10/2026)** · Quy trình tách theo giai đoạn: `references/b1-b2.md` *(B1, Cổng 1, B2, Cổng 2)* và `references/b3-b4.md` *(B3, B4, Cổng 3)*, mỗi giai đoạn vào bằng một lượt *(mục 3)*. B4 kiểm và chụp bằng một lệnh `quick.py --shots`; ảnh mốc Cấp 2–3 bằng `run_all.py`. Lịch sử phiên bản ở `CHANGELOG.md` của kit.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này. Trên Windows, đường dẫn đưa cho `node` và `python` viết có ổ đĩa và gạch xuôi (`W:/…`), không viết kiểu Git Bash `/w/…`: hai chương trình này không đọc được. Lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh: console Windows (cp1252) dừng giữa chừng với `UnicodeEncodeError`.
> Việc của skill: thêm, sửa, bỏ tính năng trong prototype có sẵn sao cho phần mới **trông như đã thiết kế cùng ngày với bản đầu**: không tự chế token, không làm gãy dữ liệu đang chạy, không làm vỡ trải nghiệm cũ.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Đã có prototype HTML, muốn **thêm, sửa hoặc bỏ** một tính năng, màn hình, flow, bộ lọc, modal, drawer; hoặc chỉnh nhỏ giao diện | ✅ **Skill này** |
| Chỉnh nhỏ **không dính cờ** *(Cấp 0, hoặc Cấp 1 chỉ có cờ C)* và dự án có `tweak-site` | `tweak-site` *(mục 1.3)* |
| Đã sửa nhiều lần, cần **kiểm tổng một lần trước khi bàn giao**, gửi link hay commit | `handover-check` |
| Website / web app **chưa có giao diện**, hoặc có nhưng được phép **làm lại từ đầu** | `sketch-to-site` |
| Prototype cũ lỗi thời, muốn **đại tu thẩm mỹ** toàn bộ mà giữ nguyên code | `redesign-existing-projects` |
| Chỉ muốn **chấm điểm UX / audit độc lập** một trang đã dựng | `laws-of-ux-review` · `laws-of-ux-checklist` |

---

## 1. LUẬT DỪNG · CẤP TÁC ĐỘNG · CỜ RỦI RO

Skill này có tối đa **3 CỔNG QUYẾT ĐỊNH (🛑)**. Số cổng phải đi do hai thứ quyết định, cùng xác định ở B1:

- **Cấp tác động** đo **kích cỡ** thay đổi *(mục 1.1)*.
- **Cờ rủi ro** đo thứ kích cỡ không thấy: một thay đổi rất nhỏ trên màn hình vẫn có thể đổi quyền, dữ liệu hay quy tắc nghiệp vụ *(mục 1.2)*.

Đường tắt chỉ bỏ **câu hỏi**, không bỏ **luật**: bốn luật bảo toàn, sàn chất lượng và luật số liệu ở mục 2 áp cho **mọi cấp**, kể cả Cấp 0.

### 1.1 Bốn cấp tác động

> Định nghĩa **duy nhất** của cấp. Chỗ khác trong skill trỏ về đây, đừng chép lại.

| Cấp | Phạm vi | Ví dụ *(thêm · sửa · bỏ)* | Cổng |
|---|---|---|:---:|
| 🟢 **0 · Vi chỉnh** | Chỉ đổi **cách hiển thị**; không đổi hành vi, dữ liệu, quyền hay nghĩa. **Không dính cờ nào.** | Sửa lỗi chính tả, câu chữ không đổi nghĩa · chỉnh khoảng cách · đổi màu, icon sang token và bộ icon sẵn có mà **không đổi nghĩa trạng thái** · chỉnh style của trạng thái đã có *(hover, focus, disabled)* | **0** |
| 🟡 **1 · Cục bộ** | Thêm, sửa hoặc bỏ **một thành phần** trong một màn, không mở lớp mới | Thêm nút trên dòng · thêm hoặc bỏ cột · thêm bộ lọc · đổi thứ tự trường trong form | **1** *(Cổng 3)*, thêm 🛑1 rút gọn nếu có cờ cần hỏi |
| 🟠 **2 · Lớp phủ, luồng con** | Thêm, sửa hoặc bỏ lớp nổi hay luồng nhiều bước **trong trang** | Modal · drawer · popover · wizard trong trang | **3** |
| 🔴 **3 · Cấu trúc** | Thêm hoặc bỏ **trang**, đổi điều hướng chính, thêm **bề mặt** | Trang `.html` mới · tab hoặc mục menu chính · wizard tách thành trang riêng · thêm app mobile cho prototype admin có sẵn | **3**, cộng lối vào ở **mọi trang** |

**Phân cấp:**
- Phân vân giữa hai cấp → lấy **cấp cao hơn**.
- Một yêu cầu gồm nhiều việc → cả lô lấy **cấp cao nhất**, cờ gộp lại.
- Cấp 1 mà câu lệnh không nói đặt ở đâu, và trang **không có** thành phần cùng loại để theo → đó là phân vân → **Cấp 2**.

### 1.2 Sáu cờ rủi ro

| Cờ | Bật khi | Hỏi gì *(nếu câu lệnh chưa nói)* | Kiểm thêm ở B4 |
|---|---|---|---|
| **Q · Quyền** | Thay đổi quyết định **ai thấy, ai làm được** gì; hoặc thêm thao tác mà nguồn yêu cầu có giới hạn vai | Vai nào thấy, vai nào làm được *(liệt kê vai thật của dự án)* | Nhóm G hai chiều, bẻ thử |
| **D · Dữ liệu** | Thêm, đổi tên, đổi kiểu hoặc bỏ trường hay cấu trúc dữ liệu | **Thêm** trường: không hỏi. **Đổi hoặc bỏ** trường đang dùng: nêu số chỗ đọc nó *(đếm bằng `grep`)*, hỏi **Giữ trường cũ, thêm trường mới** *(Khuyến nghị)* · **Đổi và sửa mọi chỗ đọc** | Nhóm E trên **mọi trang** đọc dữ liệu đó |
| **L · Logic** | Đổi **quy tắc**: validation, điều kiện bật/tắt, công thức ra số, chuyển trạng thái. **Không bật** khi thay đổi chỉ làm prototype khớp lại quy tắc đã ghi trong nguồn yêu cầu *(ghi nguồn ở báo cáo)* | Quy tắc cũ → mới, kèm nguồn: **Xác nhận** · **Sửa** | Cho QA lớn, bẻ thử |
| **Y · Yêu cầu** | Dự án **có** nguồn yêu cầu mà không tìm thấy tính năng trong đó, hoặc thấy nó **trái** nguồn | **Dựng như đề xuất** *(ghi rõ là đề xuất, chưa phải yêu cầu)* · **Sửa cho khớp yêu cầu** · **Bỏ** | Báo cáo ghi rõ *đề xuất* |
| **T · Token, component** | Cần màu, font, token, component hay mẫu tương tác mà DNA ở B1 **chưa có** | **Dựng từ thứ sẵn có** *(Khuyến nghị khi làm được)* · **Thêm mới**: màu vào `site/assets/themes.json` rồi chạy `themes.mjs` *(dự án chưa có `themes.json`: vào `:root`)*, component vào `site/_system.html` đủ trạng thái, và ghi `DESIGN.md` *(nói rõ thêm gì, giá trị nào)* | Cập nhật `DESIGN.md` |
| **C · Dùng chung** | Sửa file, component hay hàm mà **nhiều trang** cùng dùng *(menu chung, store, file dữ liệu, CSS chung)* | Không hỏi | Hồi quy trên **mọi trang dùng nó** *(lệnh kiểm nhanh tự chọn; không có thì đếm bằng `grep`)* |

**Cờ đổi cổng thế nào:**
- Dính cờ bất kỳ → **không còn là Cấp 0**, tối thiểu Cấp 1.
- **Cấp 1** có cờ cần hỏi → dừng **một lần trước khi dựng** (**🛑1 rút gọn**): chỉ hỏi câu của cờ, không hỏi vị trí hay lối vào nhanh. Gộp vào một lượt `AskUserQuestion`. Cần quá 3 câu thì phạm vi đã quá cục bộ → **Cấp 2**.
- **Cấp 2–3**: câu của cờ Q, D, L, Y gộp vào **Cổng 1**; câu của cờ T gộp vào **Cổng 2**.

### 1.3 Khai báo cấp

Trước khi sửa bất cứ file nào, câu đầu tiên của lượt là một dòng:

```
Cấp <n> · cờ: <Q, L… | không> · vì <một dòng lý do>
```

- Đang dựng mà lộ cờ mới, hoặc phạm vi to hơn đã khai → **dừng ở chỗ ngắt sạch và khai báo lại**, rồi đi cổng của cấp mới. Không làm nốt rồi mới báo.
- **Việc nhỏ đi đường nhẹ:** khai báo ra Cấp 0, hoặc Cấp 1 không cờ *(cờ C vẫn tính là không cờ ở đây)*, và dự án có skill `tweak-site` → làm theo `tweak-site`, ghi `→ tweak-site` ở cuối dòng khai báo. Người dùng nói "đi đủ cổng" thì ở lại skill này.
- Người dùng nâng cấp được bất cứ lúc nào *("đi đủ cổng")*.
- Người dùng bảo bỏ hỏi *("làm luôn, khỏi hỏi")* → bỏ câu hỏi nhưng **không bỏ B4**; ghi nguyên văn lời miễn vào `FEATURE-DECISIONS.md`. Cờ Y bị miễn hỏi thì dựng như đề xuất và ghi rõ là đề xuất.

### 1.4 Quy tắc khi dừng ở cổng

1. **Trình bày trực quan:** phương án hình dung được *(vị trí trên màn hình, cấu trúc điều hướng, so sánh ưu nhược UX, ASCII mockup, ảnh hay HTML preview)*. Không hỏi chung chung kiểu *"Bạn muốn đặt nút này ở đâu?"*.
2. **Hỏi bằng `AskUserQuestion`:** tối đa 3 câu một lượt, mỗi câu 2–4 lựa chọn. Lựa chọn hợp lý nhất đặt **đầu tiên**, gắn *"(Khuyến nghị)"*. Không có công cụ này *(ví dụ Codex)*: viết câu hỏi và các lựa chọn đánh số ra tin nhắn.
3. **Dừng:** hỏi xong thì **kết thúc lượt**. Không tự chọn thay, không đoán rồi code luôn trong chế độ auto. Người dùng không trả lời thì nhắc lại câu hỏi, **không coi im lặng là đồng ý**.
4. **Ghi vào `FEATURE-DECISIONS.md`** *(mẫu ở `templates/`)*:
   * Cấp 0, và Cấp 1 không cờ: **một dòng** trong bảng *Nhật ký thay đổi nhỏ*. Cấp 1 ghi đáp án Cổng 3 **nguyên văn** ngay trong dòng đó.
   * Cấp 1 có cờ, Cấp 2, Cấp 3: **khối đầy đủ** gồm cổng, câu hỏi, lựa chọn của người dùng **nguyên văn**, ngày cập nhật. Cổng không đi thì ghi *không đi (Cấp n)*.

**Chỉ được bỏ qua cổng khi:**
- Cấp và cờ ở mục 1.1–1.2 cho phép.
- Câu lệnh đã **chỉ định tường minh** câu trả lời của cổng hay của cờ đó *(ví dụ "Thêm nút Xuất Excel vào góc phải trên bảng, mở modal xác nhận, chỉ quản lý thấy")*. Ghi nguyên văn chỉ định vào `FEATURE-DECISIONS.md`.

---

## 2. Bốn luật bảo toàn

1. **Không trôi phong cách:**
   * Màu, font, bo góc, khoảng cách, bóng đổ **lấy 100% từ `:root` hoặc `DESIGN.md` hiện hữu** *(dự án có `themes.json`: màu từ `themes.css`, không khai màu ở trang)*.
   * Không đưa mã màu HEX lạ vào code. Không tự chế CSS mới khi chưa được duyệt *(cờ T: duyệt ở Cổng 2, hoặc ở 🛑1 rút gọn với Cấp 1)*.
   * Icon: dùng **đúng bộ icon** prototype đang dùng (Phosphor / Lucide / Tabler). Đang dùng Phosphor thì không kéo Lucide vào.
2. **Bảo toàn dữ liệu:**
   * Đọc kỹ file dữ liệu *(ví dụ `assets/data.js`, `app.js` hoặc store toàn cục)*.
   * Dùng đúng hàm helper sẵn có *(ví dụ `store.get()`, một hàm `today()` đã gộp và lọc dữ liệu theo ngữ cảnh, `formatMoney()`)*. Không đọc tắt hay bỏ qua logic nghiệp vụ đã đóng gói.
   * Mở rộng dữ liệu theo nguyên tắc **bổ sung trường**, không xoá hay đổi tên trường cũ làm gãy trang khác. Cần đổi hoặc bỏ trường đang dùng: đó là cờ D, hỏi trước.
   * Prototype dùng `assets/data.js` + `assets/store.js` *(khuôn `sketch-to-site/templates/store.js`)*: thêm bộ dữ liệu mới vào `SEED` là đủ, store tự bổ sung. Đổi cấu trúc bản ghi đã có *(cờ D được duyệt)* thì **tăng phiên bản trong `KEY`**, không thì trình duyệt đã mở prototype trước đó vẫn giữ dữ liệu cũ. Prototype chưa có store mà cần dữ liệu xuyên trang: đề xuất thêm theo `sketch-to-site/references/rules-and-conflicts.md` D.5, tính là cờ C.
3. **Thoát hai chiều:**
   * Mọi modal, drawer, popup hay màn con mở ra **có ít nhất 2 cách thoát**: nút Đóng/Huỷ VÀ bấm ra ngoài *(backdrop)* hoặc phím `Esc`.
   * Khi đóng, focus bàn phím quay lại đúng phần tử đã mở nó.
4. **Viết trọn, không nuốt code** *(rút gọn từ `full-output-enforcement`, cùng luật với `sketch-to-site` mục 3: sửa thì sửa cả hai)*:
   * Không dùng comment cắt xén kiểu `<!-- giữ nguyên code cũ -->`, `<!-- ... -->`, `// ... existing code ...`, `/* ... */`, `// TODO`. Sửa file lớn thì dùng thao tác thay thế chính xác, hoặc viết đầy đủ khối chức năng.
   * Không làm tắt: chỉ viết phần đầu và phần cuối rồi bỏ đoạn giữa · viết một mẫu rồi tả bằng lời phần còn lại · **tả** code sẽ làm gì thay vì **viết** code · dùng câu né việc thay cho phần chưa làm *("cho gọn", "phần còn lại tương tự", "bạn có muốn tôi làm tiếp không?")*.
   * **Đếm trước khi dựng** số file, component và trạng thái phải thêm theo phương án đã chốt *(Cổng 2 ở Cấp 2–3; câu lệnh và câu trả lời của cờ ở Cấp 0–1)*. Dựng xong **đếm lại**. Thiếu thì làm tiếp, chưa sang B4.
   * Sắp hết độ dài thì **không nén** các phần sau cho vừa: dừng ở chỗ ngắt sạch và ghi `[TẠM DỪNG — xong X/Y. Gõ "tiếp" để làm: <phần kế>]`. Gõ "tiếp" thì làm đúng từ chỗ dừng, không tóm tắt lại. Cấp 3 thì cập nhật `BUILD-LOG.md` cùng lúc *(B3)*.

**Sàn không thương lượng** *(cùng sàn với `sketch-to-site` mục 2; áp cho mọi phần mới thêm)*:
- Chuyển động mới gói trong `prefers-reduced-motion`, chỉ animate `transform` và `opacity`.
- Modal, drawer **khoá focus** bên trong khi mở *(`Tab` không lọt ra trang nền)* và trả focus khi đóng.
- Phần mới đọc được ở **mọi theme** trong `qa.config.json`, màu lấy từ token *(bộ kiểm đo tương phản ở mọi theme)*.
- Chữ trên giao diện: không emoji, không gạch dài `—` `–` làm dấu ngắt, dùng đúng **thuật ngữ trong glossary** của dự án. Font mới *(nếu cờ T được duyệt)* phải có đủ glyph cho ngôn ngữ của giao diện *(tiếng Việt: đủ dấu)*.
- Tương phản đạt WCAG AA, không tràn ngang ở 390px.

**Số liệu:**
- Số tóm tắt *(tổng, đếm, phần trăm)* **tính từ dữ liệu** bằng hàm sẵn có, không gõ tay vào HTML.
- Số tự đặt **mặc định là minh hoạ**. Dự án có quy ước gắn nhãn *(chip "Số minh hoạ", thẻ mã nguồn)* thì theo quy ước đó. Đừng hứa "đã gắn nhãn hết".

---

## 3. Quy trình 5 bước · tối đa 3 cổng

```
B1 Hấp thụ DNA · phân cấp · dò cờ · khai báo · lưu mốc
 ├─ Cấp 0 ─────────────────────────────────────► B3 ─► B4 ─► báo cáo (không hỏi)
 ├─ Cấp 1 ─── [có cờ cần hỏi ─► 🛑1 rút gọn] ──► B3 ─► B4 ─► 🛑3
 └─ Cấp 2–3 ─► 🛑1 ─► B2 ─► 🛑2 ───────────────► B3 ─► B4 ─► 🛑3
```

Các bước nằm ở hai file theo giai đoạn: `references/b1-b2.md` *(B1, 🛑 Cổng 1, B2, 🛑 Cổng 2)* và `references/b3-b4.md` *(làm tiếp, B3, B4, 🛑 Cổng 3)*. Mỗi giai đoạn chỉ đọc file của nó.

**Lối vào.** Chọn đúng một dòng. Lượt kế tiếp làm **cả cột Lượt vào trong một lượt**: các lệnh `Read` và lệnh Bash gọi cùng lúc.

| Tình trạng | Làm | Lượt vào |
|---|---|---|
| Yêu cầu mới | B1 → cổng theo cấp | `Read` `references/b1-b2.md`, `DESIGN.md`, `FEATURE-DECISIONS.md` *(chưa có thì bỏ)*, ghi chú của prototype và dự án *(README của prototype, `AGENTS.md` hoặc `CLAUDE.md`)* · lệnh 1 |
| Cổng của cấp đã có đáp án *(trong `FEATURE-DECISIONS.md`, hay người dùng vừa trả lời)*, cấp không phải hỏi trước khi dựng, hoặc `BUILD-LOG.md` có khối của đợt này còn dòng chưa `xong` | B3 → B4 → 🛑 Cổng 3 | `Read` `references/b3-b4.md`, `FEATURE-DECISIONS.md`, `BUILD-LOG.md` *(Cấp 3)*, và mọi file sẽ sửa mà phiên này chưa đọc *(trang, CSS và JS dùng chung, file dữ liệu, `_qa/qa.config.json`, `site/_system.html` khi cờ T được duyệt)* · lệnh 2 |

Lệnh 1 cập nhật bộ kiểm và in file đổi từ lần kiểm sạch cuối *(khi dự án có `_qa/`)*, danh sách file của site, tên mọi token, bộ icon đang nạp, và chỗ tính năng xuất hiện trong tài liệu yêu cầu. `D` là thư mục chứa trang *(`site/` với prototype của `sketch-to-site`)*; dự án không có tài liệu yêu cầu thì bỏ lệnh `grep` cuối:

```bash
S="<skills>"; P="<thư-mục-prototype>"; D="$P/site"; [ -f "$P/_qa/qa.config.json" ] && { python "$S/sketch-to-site/templates/qa-kit/qa_init.py" "$P" --update; (cd "$P" && python _qa/quick.py --dry); }; echo "== file"; find "$D" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \) | sed "s|^$D/||" | sort | tr '\n' ' '; echo; echo "== token"; grep -rhoE --include=*.css --include=*.html -- '--[a-z][a-z0-9-]*:' "$D" | sort -u | tr '\n' ' '; echo; echo "== icon"; grep -rhoiE --include=*.html 'phosphor|lucide|tabler|font-?awesome' "$D" | sort | uniq -c; { grep -rniE "<từ khoá>|<tên màn>" "<thư-mục-tài-liệu-yêu-cầu>" || echo "không thấy trong tài liệu yêu cầu"; } | head -40
```

Lệnh 2 in định dạng file bước của bộ kiểm *(phần chú thích đầu `_qa/run_all.py`)* và tên mọi token *(giá trị ở `DESIGN.md`)*:

```bash
P="<thư-mục-prototype>"; [ -f "$P/_qa/run_all.py" ] && sed -n '/^#/!q;p' "$P/_qa/run_all.py"; echo "== token"; grep -rhoE --include=*.css -- '--[a-z][a-z0-9-]*:' "$P/site" | sort -u | tr '\n' ' '
```

**Ít lượt.** Mỗi lượt đọc lại cả ngữ cảnh, nên tốn kém nằm ở số lượt chứ không ở một lệnh dài.
- Lệnh và lần đọc **không phụ thuộc nhau** thì gọi chung một lượt *(nhiều lệnh gọi trong cùng một tin nhắn)*: đọc nhiều file một lượt; mọi chỗ sửa sau một lần kiểm làm trong một lượt, rồi chạy lại.
- Mở **mọi ảnh** cần xem trong **một** lượt, không mỗi lượt một hai ảnh.
- File sẽ sửa thì `Read` ở lượt vào, không đợi tới lúc sửa *(Edit từ chối file chưa đọc)*. Đã đọc thì đừng `cat` lại.
- Đọc `references/` bằng lệnh in đúng mục mà file giai đoạn ghi, không đọc cả file. Không đọc mã của script để biết cách dùng: cách gọi, kết quả và mã thoát ghi trong file giai đoạn; định dạng file bước do lệnh 2 in.
- Ảnh lấy từ `quick.py --shots` và `run_all.py`, hai lệnh này in sẵn thư mục và tên từng ảnh. Không tự viết bộ chụp, không gọi riêng `run.mjs`, Edge `--screenshot` hay Playwright.

---

## 4. Kỹ năng bổ trợ

| Skill | Dùng ở | Vai trò |
|---|---|---|
| `sketch-to-site` *(cần)* | B1, B3, B4 | Bộ kiểm `_qa/` *(`templates/qa-kit/`)*, `themes.mjs`, `preflight.py --save` / `--compare` khi dự án không có bộ kiểm *(cần dữ liệu font của `ui-ux-pro-max` để kiểm dấu tiếng Việt)* |
| `ui-ux-pro-max` | B2, B3 | Tra mẫu tương tác chuẩn qua `search.py` |
| `design-taste-frontend` | B3 | Phân cấp thị giác: mỗi trang đúng 1 hành động chính |
| `tweak-site` · `handover-check` | 1.3 · B4 | Đường nhẹ cho Cấp 0 và Cấp 1 không cờ · kiểm tổng trước bàn giao, nhận các bước Cấp 1 dồn sang |

`full-output-enforcement` và `laws-of-ux-checklist` **không cần chép kèm**: phần dùng được đã chép vào mục 2 luật 4 và `references/regression-qa.md` nhóm F.

`design-taste-frontend` là skill tham chiếu, đã tắt tự kích hoạt: mở `<skills>/design-taste-frontend/SKILL.md` bằng công cụ đọc file, không gọi qua công cụ Skill. File dài khoảng 87 KB: tìm dòng tiêu đề của mục cần *(`grep -n "^#.* 4\.7 "`)* rồi chỉ đọc đoạn ấy.

---

## 5. Thư mục và file quản lý

- `FEATURE-DECISIONS.md`: nhật ký thay đổi nhỏ *(Cấp 0–1)* và khối cho từng tính năng *(mẫu ở `templates/`)*. Cấp 3 thêm `BUILD-LOG.md`.
- `_qa/current/`: mốc cuốn chiếu và nhật ký các lần sửa *(`quick.py`)*. `_qa/last-green/`: mốc bàn giao, chỉ `handover-check` ghi. `_qa/.quick-run/`: kết quả và ảnh của lần kiểm nhanh gần nhất.
- `_qa/truoc/`: ảnh mốc Cấp 2–3 *(`run_all.py`)*; dự án không có mốc cuốn chiếu thì thêm kết quả QA trước khi sửa, và `_qa/sau/` cho kết quả sau khi sửa.
