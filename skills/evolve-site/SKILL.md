---
name: evolve-site
description: >-
  Mở rộng và cập nhật prototype HTML có sẵn (1 → N) — thêm, sửa hoặc bỏ tính năng, màn hình, sub-flow, tương tác nhưng BẢO TOÀN 100% Design System, Data Contract và quy ước kiến trúc của bản UI hiện hữu. Dùng cho mọi dự án và mọi dạng nguồn yêu cầu (PRD, user story, ticket, use case, business rule, brief, hoặc chỉ câu lệnh). Quy trình 5 bước với tối đa 3 CỔNG QUYẾT ĐỊNH dừng lại hỏi người dùng (vị trí lối vào · phương án tích hợp UI · nghiệm thu hồi quy); số cổng co giãn theo 4 cấp tác động và 6 cờ rủi ro (quyền · dữ liệu · logic · yêu cầu · token · dùng chung). Tích hợp full-output-enforcement, laws-of-ux-checklist, ui-ux-pro-max, design-taste-frontend. KHÔNG dùng để làm mới từ đầu (sketch-to-site), KHÔNG dùng để đại tu thẩm mỹ chung (redesign-existing-projects). Dự án có tweak-site thì Cấp 0 và Cấp 1 không cờ đi đường đó; kiểm tổng trước bàn giao dùng handover-check. Gọi khi người dùng nói "thêm tính năng", "cập nhật giao diện", "mở rộng prototype", "thiết kế thêm màn hình".
---

# Evolve Site · Mở rộng & Cập nhật Prototype có sẵn

> **v1.7 (29/09/2026)** · B3: kiểm trước, dựng sau; Cấp 3 ghi `BUILD-LOG.md`. B4: bẻ thử bước phủ định, lỗi mới tìm nguyên nhân gốc. Cổng 3: nhận góp ý theo `sketch-to-site/references/rules-and-conflicts.md` mục F.
> **v1.6 (29/09/2026)** · Màn app mobile và hệ thống nhiều bề mặt: B1 nhận màn app, B2 có mẫu tích hợp cho app, thêm bề mặt là Cấp 3. Prototype có `assets/store.js`: đổi cấu trúc bản ghi thì tăng phiên bản `KEY` *(luật 2)*. `design-taste-frontend` đọc theo đường dẫn *(mục 4)*.
>
> **v1.5 (28/09/2026)** · Bớt kiểm lặp ở việc nhỏ:
> - Cấp 0 và Cấp 1 không cờ chuyển sang `tweak-site` *(mục 1.3)*.
> - Dùng mốc cuốn chiếu thay cho chạy mốc trước khi sửa *(B1)*.
> - Cấp 1 dồn soát UX và đếm số chỗ gọi sang `handover-check` *(B4)*.
> - Cờ C để lệnh kiểm nhanh tự chọn bộ kiểm.
>
> Chỉ áp khi dự án có các thứ đó; không có thì chạy như v1.3.
>
> **v1.3 (24/09/2026)** · Skill song hành với `sketch-to-site`, **dùng chung cho mọi dự án**. v1.3 vá cơ chế co giãn cổng: **6 cờ rủi ro** chạy song song với cấp *(cấp đo kích cỡ, cờ đo rủi ro)* · **khai báo cấp và cờ** trước khi sửa · bảng **bước B4 theo cấp** · luồng **bỏ** tính năng · gỡ các ví dụ gắn với một dự án cụ thể.
> v1.2: co giãn cổng theo 4 cấp tác động. v1.1: mốc trước/sau khi sửa, phân quyền hai chiều, sàn chất lượng, đối chiếu tài liệu yêu cầu, cho QA lớn theo tính năng.
> Việc của skill: **Thêm tính năng mới vào prototype có sẵn sao cho trông như thể nó đã được thiết kế cùng ngày với bản dựng đầu tiên** (Zero Visual/Architectural Drift). Không tự ý phát minh token mới, không làm gãy dữ liệu hiện hành, và bảo đảm tính toàn vẹn của trải nghiệm người dùng.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Đã có prototype HTML, muốn **thêm, sửa hoặc bỏ** một tính năng, màn hình, flow, bộ lọc, modal, drawer; hoặc chỉnh nhỏ giao diện | ✅ **Skill này** |
| Chỉnh nhỏ **không dính cờ** *(Cấp 0, hoặc Cấp 1 chỉ có cờ C)* và dự án có `tweak-site` | `tweak-site` *(mục 1.3)* |
| Đã sửa nhiều lần, cần **kiểm tổng một lần trước khi bàn giao**, gửi link hay commit | `handover-check` |
| Website / web app **chưa có giao diện**, hoặc có nhưng được phép **làm lại từ đầu** | `sketch-to-site` |
| Prototype cũ bị lỗi thời/xấu, muốn **đại tu thẩm mỹ (facelift)** toàn bộ mà giữ nguyên code | `redesign-existing-projects` |
| Chỉ muốn **chấm điểm UX / audit độc lập** một trang đã dựng | `laws-of-ux-review` · `laws-of-ux-checklist` |

---

## 1. LUẬT DỪNG · CẤP TÁC ĐỘNG · CỜ RỦI RO

Skill này có tối đa **3 CỔNG QUYẾT ĐỊNH (🛑)**. Phải đi bao nhiêu cổng do hai thứ quyết định, cùng xác định ở B1:

- **Cấp tác động** đo **kích cỡ** thay đổi *(mục 1.1)*.
- **Cờ rủi ro** đo thứ kích cỡ không thấy: một thay đổi rất nhỏ trên màn hình vẫn có thể đổi quyền, dữ liệu hay quy tắc nghiệp vụ *(mục 1.2)*.

Đường tắt chỉ bỏ **câu hỏi**, không bỏ **luật**: bốn luật thép, sàn chất lượng và luật số liệu ở mục 2 áp cho **mọi cấp**, kể cả Cấp 0.

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
| **T · Token, component** | Cần màu, font, token, component hay mẫu tương tác mà DNA ở B1 **chưa có** | **Dựng từ thứ sẵn có** *(Khuyến nghị khi làm được)* · **Thêm mới** vào `:root` và `DESIGN.md` *(nói rõ thêm gì, giá trị nào)* | Cập nhật `DESIGN.md` |
| **C · Dùng chung** | Sửa file, component hay hàm mà **nhiều trang** cùng dùng *(menu chung, store, file dữ liệu, CSS chung)* | Không hỏi | Hồi quy trên **mọi trang dùng nó** *(đếm bằng `grep`)* |

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

1. **Trình bày trực quan:** Đưa ra phương án có thể hình dung được (vị trí trên màn hình, cấu trúc điều hướng, so sánh ưu/nhược UX, ASCII mockup hoặc preview ảnh/HTML). Tuyệt đối không hỏi chung chung kiểu *"Bạn muốn đặt nút này ở đâu?"*.
2. **Hỏi bằng công cụ `AskUserQuestion`:** Tối đa 3 câu hỏi một lượt, mỗi câu 2–4 lựa chọn. Lựa chọn hợp lý nhất luôn đặt **đầu tiên** và gắn nhãn *"(Khuyến nghị)"*. Không có công cụ này *(ví dụ Codex)*: viết câu hỏi và các lựa chọn đánh số ra tin nhắn.
3. **Dừng:** Sau khi hỏi thì **kết thúc lượt**. Không tự chọn thay, không tự động suy đoán rồi code luôn trong chế độ auto. Người dùng không trả lời thì nhắc lại câu hỏi, **không coi im lặng là đồng ý**.
4. **Ghi vào `FEATURE-DECISIONS.md`** *(mẫu ở `templates/`)*:
   * Cấp 0, và Cấp 1 không cờ: **một dòng** trong bảng *Nhật ký thay đổi nhỏ*. Cấp 1 ghi đáp án Cổng 3 **nguyên văn** ngay trong dòng đó.
   * Cấp 1 có cờ, Cấp 2, Cấp 3: **khối đầy đủ** gồm cổng, câu hỏi, lựa chọn của người dùng **nguyên văn**, ngày cập nhật. Cổng không đi thì ghi *không đi (Cấp n)*.

**Chỉ được bỏ qua cổng khi:**
- Cấp và cờ ở mục 1.1–1.2 cho phép.
- Câu lệnh đã **chỉ định tường minh** câu trả lời của cổng hay của cờ đó (Ví dụ: *"Thêm nút Xuất Excel vào góc phải trên bảng, mở modal xác nhận, chỉ quản lý thấy"*). Ghi nguyên văn chỉ định vào `FEATURE-DECISIONS.md`.

---

## 2. Bốn luật thép bảo toàn (The 4 Preservation Laws)

1. **Zero Visual Drift (Không trôi phong cách):**
   * Mọi màu sắc, font chữ, độ bo góc, khoảng cách, bóng đổ **bắt buộc lấy 100% từ `:root` hoặc `DESIGN.md` hiện hữu**.
   * Cấm tự tiện đưa mã màu HEX lạ vào code. Cấm tự chế biến CSS mới nếu không có sự phê duyệt *(cờ T: duyệt ở Cổng 2, hoặc ở 🛑1 rút gọn với Cấp 1)*.
   * Icon: Dùng **đúng bộ icon** mà prototype đang dùng (Phosphor / Lucide / Tabler). Đang dùng Phosphor thì tuyệt đối không kéo Lucide vào.
2. **Data & Contract Preservation (Bảo toàn dữ liệu):**
   * Đọc kỹ file data (ví dụ `assets/data.js`, `app.js` hoặc store toàn cục).
   * Dùng đúng các hàm helper sẵn có (ví dụ: `store.get()`, một hàm `today()` đã gộp và lọc dữ liệu theo ngữ cảnh, `formatMoney()`). Cấm đọc tắt hoặc bỏ qua logic nghiệp vụ đã đóng gói.
   * Mở rộng dữ liệu theo nguyên tắc **bổ sung trường (additive)**, không được xoá hoặc đổi tên trường cũ làm gãy các trang khác. Cần đổi hoặc bỏ trường đang dùng: đó là cờ D, hỏi trước.
   * Prototype dùng `assets/data.js` + `assets/store.js` *(khuôn `sketch-to-site/templates/store.js`)*: thêm bộ dữ liệu mới vào `SEED` là đủ, store tự bổ sung. Đổi cấu trúc bản ghi đã có *(cờ D được duyệt)* thì **tăng phiên bản trong `KEY`**, không thì trình duyệt đã mở prototype trước đó vẫn giữ dữ liệu cũ. Prototype chưa có store mà cần dữ liệu xuyên trang: đề xuất thêm theo `sketch-to-site/references/rules-and-conflicts.md` D.5, tính là cờ C.
3. **Double Exit Rule (Thoát hiểm hai chiều):**
   * Mọi modal, drawer, popup hoặc màn hình con mở ra **phải luôn có ít nhất 2 cách để thoát ra**: nút Đóng/Huỷ (`X` / `Huỷ bỏ`) VÀ bấm ra ngoài (backdrop click) hoặc nhấn phím `Esc`.
   * Khi đóng, focus bàn phím phải quay lại đúng phần tử đã kích hoạt nó.
4. **Full Output Enforcement (Viết trọn vẹn, chống nuốt code)** *(rút gọn từ `full-output-enforcement`, cùng luật với `sketch-to-site` mục 3: sửa thì sửa cả hai)*:
   * Tuyệt đối không dùng comment cắt xén kiểu `<!-- giữ nguyên code cũ -->`, `<!-- ... -->`, `// ... existing code ...`, `/* ... */`, `// TODO`. Khi sửa file lớn, dùng thao tác thay thế chính xác hoặc viết đầy đủ khối chức năng.
   * Cấm các kiểu làm tắt: chỉ viết phần đầu và phần cuối rồi bỏ đoạn giữa · viết một mẫu rồi tả bằng lời phần còn lại · **tả** code sẽ làm gì thay vì **viết** code · dùng câu né việc thay cho phần chưa làm *("cho gọn", "phần còn lại tương tự", "bạn có muốn tôi làm tiếp không?")*.
   * **Đếm trước khi dựng** số file, component và trạng thái phải thêm theo phương án đã chốt *(Cổng 2 ở Cấp 2–3; câu lệnh và câu trả lời của cờ ở Cấp 0–1)*. Dựng xong **đếm lại**. Thiếu thì làm tiếp, chưa sang B4.
   * Sắp hết độ dài thì **không nén** các phần sau cho vừa: dừng ở chỗ ngắt sạch và ghi `[TẠM DỪNG — xong X/Y. Gõ "tiếp" để làm: <phần kế>]`. Gõ "tiếp" thì làm đúng từ chỗ dừng, không tóm tắt lại. Cấp 3 thì cập nhật `BUILD-LOG.md` cùng lúc *(B3)*.

**Sàn không thương lượng** *(cùng sàn với `sketch-to-site` mục 2; áp cho mọi phần mới thêm)*:
- Chuyển động mới gói trong `prefers-reduced-motion`, chỉ animate `transform` và `opacity`.
- Modal, drawer **khoá focus** bên trong khi mở *(`Tab` không lọt ra trang nền)* và trả focus khi đóng.
- Site có nền tối thì phần mới đọc được ở **cả hai nền**, màu lấy từ token.
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

---

### B1 · Hấp thụ DNA & Lập bản đồ tác động *(không hỏi)*

- **Đợt Cấp 3 đang dựng dở** *(có `BUILD-LOG.md` với khối của đợt này còn dòng chưa `xong`)*: đọc khối đó và `FEATURE-DECISIONS.md`, không khai báo lại cấp, không hỏi lại cổng đã có đáp án, bỏ bước mốc trước khi sửa *(bộ của tính năng đang đỏ là đúng)*. Làm tiếp B3 theo luật làm tiếp của sổ.
- **Quét hệ thống hiện hữu** *(chi tiết: `references/dna-extractor.md`)*:
  * Đọc `DESIGN.md` hoặc kiểm tra `:root` trong `<style>`: bảng màu, font, radius, spacing.
  * Đọc ghi chú kiến trúc của prototype và dự án (README, file ghi chú của prototype, `CLAUDE.md`, cấu trúc `assets/`). Ghi chú có mục *bẫy* hay *đừng làm* thì đọc kỹ: đó là chỗ bản cũ đã vấp.
  * Xác định bộ icon đang nạp trong `<head>` (Phosphor, Lucide, SVG nội dòng...).
  * **Màn app mobile** *(`<html data-surface="app">`)*: đọc `sketch-to-site/references/mobile-app.md`, ghi nền tảng đang làm *(`data-platform`, theme `android` trong `_qa/qa.config.json`)*. Phần mới theo quy ước của **mọi** nền tảng đang làm.
  * **Thêm bề mặt mới** *(ví dụ app cho khách bên cạnh admin có sẵn)*: Cấp 3. Dựng theo `mobile-app.md` mục 1 và 6: token của bản cũ tách ra `assets/tokens.css` dùng chung *(cờ C)*, dữ liệu đi qua store chung, thêm bảng luồng xuyên bề mặt vào `DESIGN.md`.
  * Đọc cơ chế lưu trữ dữ liệu (LocalStorage, In-memory object `DATA`, Store pub/sub; prototype dựng bằng `sketch-to-site` từ v2.3 dùng `assets/data.js` + `assets/store.js`).
- **Đối chiếu nguồn yêu cầu**, dạng nào cũng được: PRD, user story, ticket, use case, business rule, acceptance criteria, brief thiết kế, biên bản họp. Tìm theo từ khoá **và** theo màn hình, không chỉ theo mã. Ghi lại tính năng phục vụ yêu cầu nào.
  * Không tìm thấy, hoặc thấy nó **trái** nguồn → **cờ Y**, không tự dựng.
  * Dự án **không có** tài liệu yêu cầu nào → câu lệnh của người dùng là nguồn; ghi rõ vậy ở báo cáo. Cờ Y không áp.
  * Nguồn yêu cầu có ma trận phân quyền → dùng đúng danh sách vai trong đó cho cờ Q.
- **Phân cấp, dò cờ, khai báo** theo mục 1.1–1.3.
- **Mốc trước khi sửa** *(bắt buộc ở mọi cấp, để B4 đo được lỗi **mới**)*:
  * **Dự án đã có `_qa/`**: trước lần kiểm đầu của phiên, chạy `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update` *(`<skills>` là thư mục cha của thư mục chứa SKILL.md này)*. Lệnh chép đè script của bộ kiểm bằng bản của kit đang dùng, không đụng cấu hình, file bước, mốc, nhật ký.
  * **Dự án có mốc cuốn chiếu** *(lệnh kiểm nhanh giữ kết quả lần kiểm sạch gần nhất, ví dụ `_qa/quick.py` với `_qa/current/`)*: **không chạy mốc**. Chạy `--dry` để xem file nào đã đổi từ lần kiểm trước. Nếu có file đổi mà không phải do mình, chạy kiểm nhanh một lần trước khi sửa để mốc khớp file hiện tại.
  * Không có mốc cuốn chiếu: chạy QA sẵn có của dự án, lưu kết quả vào `_qa/truoc/`. Không có script riêng thì dùng `preflight.py --save` *(`references/regression-qa.md` mục 2)*.
  * Chụp 1440 và 390 các trang sẽ bị đụng, lưu vào `_qa/truoc/`: chỉ ở **Cấp 2–3**. Cấp 0–1 không chụp trước.
  * **Lỗi có sẵn thuộc về bản cũ:** không tự sửa *(ngoài phạm vi, trái luật bảo toàn)*, chỉ liệt kê ở Cổng 3. Trừ khi **chính yêu cầu** là sửa lỗi đó.

---

### 🛑 Cổng 1 · Vị trí & Lối vào (Placement & Entry Points)

> ⚡ **Cấp 0:** bỏ cổng này. **Cấp 1:** bỏ, trừ khi có cờ cần hỏi → chỉ hỏi câu của cờ (**🛑1 rút gọn**, bảng mục 1.2) rồi sang B3. **Cấp 2–3:** đi đủ.

Mọi tính năng mới đều phải có chỗ đứng tự nhiên trong hệ thống điều hướng hiện có. Hỏi **1 lượt gồm 2-3 câu**:

| Câu hỏi | Lựa chọn gợi ý |
|---|---|
| **Lối vào chính (Primary Trigger)?** | Đặt trên Header / Action Bar trang · Nằm trong menu từng dòng của bảng (`...`) · Tab mới trong chi tiết · Nút nổi / Floating |
| **Lối vào nhanh (Fast Access)?** | Thêm lệnh vào Command Palette (`/`) · Gán phím tắt nhanh (`Ctrl+K`, `N`) · Không cần lối vào nhanh |
| **Phân quyền / Đối tượng thấy?** | Mọi vai · Chỉ một số vai *(liệt kê vai thật của dự án, lấy từ ma trận phân quyền hoặc nguồn yêu cầu)* · Theo điều kiện *(ví dụ chỉ người tạo bản ghi)* |

Có cờ Q, D, L hoặc Y: thêm câu của cờ đó *(bảng mục 1.2)*. Quá 3 câu thì hỏi hai lượt, **câu của cờ đi trước**: đáp án của cờ Y có thể làm tính năng đổi hoặc bị bỏ, khi đó câu vị trí không cần hỏi nữa.

Sau khi người dùng trả lời: Ghi nhận vào `FEATURE-DECISIONS.md`.

---

### B2 · Chọn Mẫu tích hợp (Integration Pattern)

> ⚡ **Cấp 0–1:** bỏ bước này và Cổng 2. Cần thứ DNA chưa có thì đó là cờ T, hỏi ở 🛑1 rút gọn.

Tra cứu hướng dẫn tại `references/integration-patterns.md`. **Màn app mobile** chọn từ bảng mục 3 của file đó *(sheet, màn đi sâu, luồng toàn màn, alert)*, không dùng drawer hay modal kiểu web. Chọn 2 phương án bố cục phù hợp nhất:
1. **Tại chỗ (Inline / Expandable):** Thao tác nhanh, không muốn gián đoạn việc quan sát bảng/danh sách.
2. **Ngăn trượt (Drawer / Slide-over):** Thao tác vừa phải, cần đối chiếu dữ liệu nền, form từ 4–10 trường.
3. **Hộp thoại (Modal Dialog):** Xác nhận hành động nguy hiểm, form ngắn (< 5 trường), tác vụ tập trung cao độ.
4. **Trang mới (New Screen):** Nghiệp vụ độc lập, dữ liệu dày đặc, luồng làm việc kéo dài.

Liệt kê luôn thứ tính năng cần mà **DNA ở B1 chưa có** *(component, token màu, icon, mẫu tương tác)*. Có thì bật cờ T, hỏi ở Cổng 2.

---

### 🛑 Cổng 2 · Chọn Phương án hiển thị (UI Variants)

> ⚡ **Cấp 0–1:** bỏ cổng này.

Trình bày **2 phương án bố cục khả thi** kèm phân tích UX để người dùng quyết định:

* **Phương án A:** (Ví dụ: Drawer trượt từ bên phải — giữ nguyên ngữ cảnh bảng dữ liệu phía sau).
* **Phương án B:** (Ví dụ: Modal popup chính giữa — tối đa sự tập trung, thao tác dứt điểm).
* Nêu rõ: Ưu điểm · Nhược điểm · Khuyến nghị theo quy tắc UX (Fitts, Hick, Jakob).

Người dùng chọn: **A · B · Đề xuất kết hợp**.

Cờ T bật thì hỏi thêm câu của cờ T *(bảng mục 1.2)*. Chưa được duyệt thì không thêm.

---

### B3 · Dựng tính năng (Code Implementation)

**Kiểm trước, dựng sau** *(Cấp 2–3, và Cấp 1 khi có cờ Q, D hoặc L; dự án đã có bộ kiểm `_qa/`. Rút từ `superpowers` test-driven-development)*:
1. **Viết bước kiểm trước khi viết code:** tạo `_qa/steps-<tên>.json` theo định dạng ghi ở đầu file `_qa/run_all.py` *(bản đủ ở README của kit, mục The QA kit)*. Mỗi điều tính năng phải làm được là một bước có `check`: lối vào mở được, lối thoát chạy, trạng thái rỗng và lỗi, dữ liệu còn sau F5, từng vai ở cờ Q.
   - `check` trả `'PASS'` khi đúng, trả chuỗi bắt đầu bằng `FAIL:` khi sai **và khi chưa có phần tử**. Dùng `?.` để bước không ném lỗi, ví dụ `js`: `document.querySelector('[data-export]')?.click()`, `check`: `document.querySelector('[data-export-modal]')?.open ? 'PASS' : 'FAIL: chưa mở được modal xuất'`.
   - Khai báo bộ trong `suites` của `_qa/qa.config.json`, mỗi khổ một dòng với **tên khác nhau** *(trùng tên thì kết quả khổ sau đè khổ trước mà không báo)*: `["tinh-nang-<tên>-1440", "<trang>", "<tên>", "desktop"]`, và `["tinh-nang-<tên>-390", "<trang>", "<tên>", "mobile"]` nếu tính năng có ở 390. Lệnh chạy dưới lọc theo `tinh-nang-<tên>` nên chạy cả hai.
2. **Chạy, thấy đỏ:** `python _qa/run_all.py _qa/.tdd tinh-nang-<tên>`. Dòng kết quả phải có `FAIL n` với n bằng số bước kiểm điều tính năng làm được, và `im lặng 0`. `im lặng` lớn hơn 0 là `check` viết sai: sửa `check` rồi chạy lại. Bước nào `PASS` khi chưa có code thì không kiểm được gì, **trừ bước phủ định** *(vai không được thấy nút: đúng sẵn khi tính năng chưa có)*. Bước phủ định đặt tên bắt đầu bằng `phu-dinh-`, để B4 tìm lại được trong file bước kể cả khi ngữ cảnh đã bị nén.
3. **Dựng** theo các yêu cầu dưới.
4. **Chạy lại cùng lệnh tới khi xanh:** `FAIL 0` và `im lặng 0`. Rồi mới sang B4.
5. **Bỏ tính năng:** bước kiểm khẳng định lối vào đã mất *(`check` trả `FAIL:` khi còn thấy nút, mục menu, phím tắt)*. Chạy thấy đỏ khi chưa bỏ, bỏ xong thì xanh.

Yêu cầu kỹ thuật bắt buộc khi viết code:
- **Tái sử dụng 100% token:** Gọi `var(--accent)`, `var(--surface)`, `var(--ink)`... Không viết mã màu riêng.
- **Tái sử dụng cấu trúc Component cũ:**
  * Nút bấm dùng đúng bộ class của site cũ (Primary, Secondary, Ghost, Danger).
  * Form inputs dùng đúng chiều cao, bo góc, màu viền focus.
  * Icon gọi đúng cú pháp hiện hữu (VD: `<i class="ph ph-plus"></i>`).
- **Nối vào Data Contract:**
  * Đọc và ghi dữ liệu qua store chung.
  * Nếu thêm trường mới vào `DATA`, cập nhật cả giá trị mặc định để các hàm render cũ không bị `undefined`.
- **Đủ 5 trạng thái** cho thành phần mới thêm:
  1. *Bình thường (Default)*
  2. *Hover / Active / Focus-visible*
  3. *Đang xử lý (Loading skeleton / Spinner đúng tone)*
  4. *Rỗng (Empty state có hướng dẫn)*
  5. *Lỗi (Inline validation message, không dùng `alert()`)*
- **Vị trí ở Cấp 1** *(không đi Cổng 1)*: câu lệnh không nói thì đặt theo **quy ước sẵn có của trang** *(chỗ thành phần cùng loại đang đứng)* và nói rõ ở Cổng 3. Không có tiền lệ cùng loại → nâng Cấp 2 *(mục 1.1)*.
- **Phân quyền là ràng buộc, không phải ẩn nút** *(cờ Q)*: vai không được thấy tính năng thì **chặn ở màn và dữ liệu** *(mở thẳng URL hay gọi hàm cũng bị chặn)*, không chỉ giấu nút hay mục menu.
- **Thêm trang mới (Cấp 3):** lối vào phải có ở menu **mọi trang** *(hoặc nơi sinh menu chung)*, không chỉ trên trang mới.
- **Bỏ tính năng:** bỏ sạch, gồm lối vào ở mọi nơi *(menu, thanh lệnh, phím tắt, link từ trang khác)*, code và style không còn ai dùng, trạng thái của nó trong script QA. Đếm bằng `grep`: còn **0** chỗ gọi. Dữ liệu của nó thì theo cờ D, không tự xoá.
- **Cấp 3:** ghi tiến độ vào `BUILD-LOG.md` của prototype *(khuôn `sketch-to-site/templates/BUILD-LOG.md`; chưa có thì tạo)*, một khối cho đợt này, mỗi file hay màn một dòng. Làm tiếp sau khi ngắt: đọc sổ trước, xác nhận các dòng `xong` theo luật làm tiếp ở đầu sổ *(mở file thật, chạy lại `preflight.py`; file mất hay đã bị sửa thì xử như sổ ghi)*, không làm lại dòng đã `xong`. Đợt này sửa trang đã `xong` ở bảng chính *(thêm lối vào menu mọi trang)* thì ghi lại cột Kiểm và dấu nội dung của dòng đó.

---

### B4 · Tự kiểm hồi quy (Regression QA — không hỏi)

Trước khi mở Cổng 3 *(Cấp 0: trước khi báo cáo)*, làm các bước dưới theo cấp. **Cách** kiểm từng bước ở `references/regression-qa.md`. ✓ = bắt buộc · — = bỏ.

| # | Bước | Cấp 0 | Cấp 1 | Cấp 2–3 |
|---|---|:---:|:---:|:---:|
| 1 | Tính năng cũ quanh chỗ sửa còn chạy, không bị đè z-index *(nhóm A)* | ✓ | ✓ | ✓ |
| 2 | Lối vào mở được; lối thoát `Esc` / backdrop / nút đóng chạy *(nhóm B)* | — | khi có lớp phủ hay lối vào mới | ✓ |
| 3 | Đủ 5 trạng thái cho thành phần mới *(nhóm C)* | — | ✓ | ✓ |
| 4 | Responsive 1440 và 390 *(nhóm D)* | khi đụng kích thước, bố cục | ✓ | ✓ |
| 5 | Console 0 lỗi; dữ liệu lưu đúng, F5 và chuyển trang không gãy *(nhóm E)* | ✓ | ✓ | ✓ |
| 6 | Chạy lại QA, so với mốc ở B1 *(mục 2)*: chỉ lỗi **mới** phải sửa; lỗi cũ **không tự sửa**, liệt kê ở Cổng 3. Lỗi mới: tìm nguyên nhân gốc, không làm im *(`sketch-to-site/references/qa-gate.md` mục 6)*. Có lệnh kiểm nhanh thì chạy nó kèm `--note`, không chạy mọi bộ | ✓ | ✓ | ✓ |
| 7 | Soát UX 12 điểm *(nhóm F)*: ✅/❌ kèm `file:dòng`; **7–9/12 thì sửa trước** khi mở Cổng 3 | — | trên thành phần mới *(dự án dùng `handover-check`: dồn sang đó)* | trên phần mới và trang chứa nó |
| 8 | Phân quyền hai chiều: vai không được thấy thì bị chặn, vai được thấy thì không bị chặn oan; thêm trang thì đếm lối vào ở mọi trang *(nhóm G)* | — | khi có cờ Q | ✓ |
| 9 | Bộ kiểm của tính năng *(viết ở B3, Kiểm trước, dựng sau)* chạy xanh; **bẻ thử** các bước phủ định *(mục 3)*. Dự án chưa có bộ kiểm `_qa/`: thêm trạng thái vào script QA sẵn có rồi bẻ thử | — | khi có cờ Q, D hoặc L | ✓ |
| 10 | Cập nhật ghi chú của prototype *(trang, trạng thái, số chỗ gọi component dùng chung: **đếm bằng `grep`**, không sửa số theo trí nhớ)*, và `DESIGN.md` nếu cờ T được duyệt | — | ✓ | ✓ |

**Kiểm thêm theo cờ** *(cộng vào bảng trên, ở mọi cấp)*: cờ D → bước 5 trên **mọi trang** đọc dữ liệu đó · cờ C → bước 1 và 6 trên **mọi trang dùng thứ đã sửa** *(lệnh kiểm nhanh tự chọn các trang nạp file đó; không có thì đếm bằng `grep`)* · bỏ tính năng → còn **0** chỗ gọi.

**Dự án dùng `handover-check`:** ở Cấp 1, bước 7 và phần đếm số chỗ gọi của bước 10 dồn sang lần kiểm bàn giao. Ghi tên màn đã đụng vào ghi chú của lệnh kiểm nhanh để lần đó biết cần soát ở đâu. Cấp 2–3 vẫn làm đủ ở đây, vì Cổng 3 cần số UX để chốt phương án.

---

### 🛑 Cổng 3 · Nghiệm thu tích hợp

> ⚡ **Cấp 0:** không dừng hỏi. Báo cáo gồm dòng khai báo cấp, file đã sửa, QA so mốc *(0 lỗi mới)*, link xem; ghi một dòng vào nhật ký rồi kết thúc lượt.
> **Cấp 1–3:** bắt buộc dừng lại hỏi người dùng bằng `AskUserQuestion`.

Báo cáo cho người dùng bằng **số liệu và bằng chứng thật**:
- Dòng khai báo cấp và cờ. Có nâng cấp giữa chừng thì nói lúc nào, vì sao.
- Danh sách file đã sửa / tạo mới.
- Nguồn yêu cầu của tính năng *(mã hoặc trích nguồn)*, hoặc ghi rõ **đề xuất, chưa có trong yêu cầu**, hoặc **nguồn là câu lệnh** *(dự án không có tài liệu yêu cầu)*.
- Kết quả kiểm tra hồi quy theo đúng các bước đã chạy ở bảng B4, bước bỏ thì ghi *không áp (Cấp n)*: *0 lỗi console · **0 lỗi mới** so với mốc (n lỗi cũ không đụng, liệt kê kèm) · Responsive 2 khổ đạt chuẩn · UX n/12 · phân quyền hai chiều đạt · trạng thái QA trước n → sau m*.
- Vị trí đã chọn *(Cấp 1, khi câu lệnh không nói)* và trạng thái các lối vào: *Đã nối Menu chính · Đã nối Command Palette (`/`)*.
- Ảnh chụp màn hình hoặc link mở file trực tiếp (`Start-Process` / `open`).

Hỏi:
- **Cấp 1:** **Chốt tích hợp** · **Chỉnh sửa chi tiết** *(nói rõ điểm cần sửa)* · **Đổi vị trí** *(nói chỗ mới)*.
- **Cấp 2–3:** **Chốt tích hợp** · **Chỉnh sửa chi tiết** *(nói rõ điểm cần sửa)* · **Đổi phương án bố cục** *(về Cổng 2)*.

Người dùng chọn **Chỉnh sửa chi tiết**: làm theo `sketch-to-site/references/rules-and-conflicts.md` mục F.

---

## 4. Bảng kỹ năng bổ trợ (Dependencies)

| Mức | Skill | Dùng ở | Vai trò |
|---|---|---|---|
| 🟠 **Nên dùng** | `ui-ux-pro-max` | B2, B3 | Tra cứu mẫu tương tác chuẩn (drawer, modal, form validation, filter chips) qua script `search.py`. |
| 🟠 **Nên dùng** | `design-taste-frontend` | B3 | Kiểm soát phân cấp thị giác: bảo đảm trang chỉ có 1 Primary CTA duy nhất. |
| 🟠 **Nên dùng** | `sketch-to-site` | B1, B4 | `scripts/preflight.py --save` / `--compare`: lưu mốc rồi chỉ báo lỗi **mới**, khi dự án không có script QA riêng. Script cần dữ liệu font của `ui-ux-pro-max` để kiểm dấu tiếng Việt. |
| 🟡 **Tham chiếu** | `redesign-existing-projects` | B3, B4 | Mượn danh mục kiểm tra 5 trạng thái (States Audit). |
| 🟡 **Song hành** | `tweak-site` | 1.3 | Đường nhẹ cho Cấp 0 và Cấp 1 không cờ. |
| 🟡 **Song hành** | `handover-check` | B4 | Kiểm tổng một lần trước bàn giao; nhận các bước Cấp 1 được dồn sang. |

`full-output-enforcement` và `laws-of-ux-checklist` **không cần chép kèm**: phần dùng được đã chép vào mục 2 luật 4 và `references/regression-qa.md` nhóm F.

`design-taste-frontend` là skill tham chiếu, đã tắt tự kích hoạt: mở `<skills>/design-taste-frontend/SKILL.md` bằng công cụ đọc file *(`<skills>` là thư mục cha của thư mục chứa SKILL.md này)*, không gọi qua công cụ Skill. File dài khoảng 87 KB: tìm dòng tiêu đề của mục cần *(`grep -n "^#.* 4\.7 "`)* rồi chỉ đọc đoạn ấy.

---

## 5. Thư mục và file quản lý

Mỗi đợt cập nhật / thêm tính năng ghi nhận vào:
```
<thư-mục-prototype>/
├── FEATURE-DECISIONS.md       # Nhật ký thay đổi nhỏ (Cấp 0–1) + khối cho từng tính năng (theo mẫu templates/)
├── site/ (hoặc các file .html) # Mã nguồn đã cập nhật
└── _qa/
    ├── truoc/                 # Mốc trước khi sửa: kết quả QA + ảnh chụp các trang sẽ đụng
    └── sau/                   # Kết quả QA + ảnh chụp sau khi sửa
```

Dự án có mốc cuốn chiếu thì `truoc/` và `sau/` chỉ dùng cho ảnh chụp ở Cấp 2–3. Kết quả kiểm nằm ở `_qa/current/`, cùng nhật ký các lần sửa. Mốc bàn giao nằm ở `_qa/last-green/`, và chỉ `handover-check` được ghi vào đó.
