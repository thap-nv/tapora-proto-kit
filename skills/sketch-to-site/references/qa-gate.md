# Tự kiểm — B4 (phải qua trước Cổng 4)

> **Nói "đã xong" thì phải có số thật dán kèm.** Không dựa vào "đã rà mắt".

---

## 1. Kiểm cơ giới — `preflight.py`

```bash
python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-hoặc-file.html>            # kiểm
python <skills>/sketch-to-site/scripts/preflight.py <…> --kind app                      # web app: bỏ luật chỉ dành cho site giới thiệu
python <skills>/sketch-to-site/scripts/preflight.py --font "Be Vietnam Pro" "Outfit"    # tra dấu tiếng Việt
python <skills>/sketch-to-site/scripts/preflight.py <thư-mục> --save <file.json>         # lưu mốc; --compare <file.json> chỉ báo lỗi mới
```

| Mã | Mức | Bắt gì |
|---|---|---|
| `P01` | LỖI | Emoji trong chữ hiển thị hoặc `alt` |
| `P02` | LỖI | Gạch dài `—` `–` trong chữ hiển thị |
| `P03` | LỖI | `h-screen` / `height:100vh` |
| `P04` | LỖI | `addEventListener('scroll'…)` |
| `P05` | LỖI | `#000000` / `#000` / `rgb(0,0,0)` |
| `P06` | LỖI | Lorem ipsum · John/Jane Doe · Nguyễn Văn A · Acme · Nexus |
| `P07` | LỖI | Font Google không có subset `vietnamese` *(tra dữ liệu `ui-ux-pro-max`)*, hoặc có mà dấu khó đọc *(danh sách `VI_FONT_ISSUES` trong `preflight.py`, đã chụp xác nhận: Big Shoulders, Big Shoulders Stencil, Intel One Mono, Vina Sans; Xanh Mono chỉ cảnh báo)* |
| `P08` | LỖI | `<img>` thiếu `alt` |
| `P09` | LỖI | Có animation/transition mà **không** có `prefers-reduced-motion` |
| `P10` | LỖI | Thiếu `<html lang>` hoặc thẻ `viewport` |
| `P11` | CẢNH BÁO | Eyebrow *(`uppercase` + `tracking-`)* vượt ⌈số section / 3⌉. Bỏ qua khi `--kind app` và ở màn app mobile |
| `P12` | CẢNH BÁO | Sáo ngữ: *Nâng tầm, Liền mạch, Đột phá, Elevate, Seamless, Unleash…* |
| `P13` | CẢNH BÁO | `href="#"` trơn |
| `P14` | CẢNH BÁO | `z-[9999]` / `z-index: 9999` |
| `P15` | CẢNH BÁO | Font không tra được trong dữ liệu *(Fontshare, font tự host)*. Kiểm tay |
| `P16` | CẢNH BÁO | Màn app *(`<html data-surface="app">`)*: viewport thiếu `viewport-fit=cover` |
| `P17` | CẢNH BÁO | Màn app chặn phóng to *(`user-scalable=no`, `maximum-scale=1`)* |
| `P18` | CẢNH BÁO | `data-clip-ok` không ghi lý do *(viết `data-clip-ok="<lý do>"`)* |
| `P19` | CẢNH BÁO | `var(--x)` không có giá trị dự phòng mà trang *(kể cả CSS/JS nạp kèm)* không định nghĩa `--x`. Bỏ qua trang nạp `tokens.js` *(bảng concept)* |
| `P20` | CẢNH BÁO | Màu viết cứng trong `<style>` hay file `.css` *(không tính `tokens.css`, `themes.css`, định nghĩa biến, giá trị dự phòng)*; lớp màu thô của Tailwind *(`bg-zinc-100`, `text-[#333]`)*. Cố ý thì ghi `/* color-ok: <lý do> */` cùng dòng |
| `P21` | LỖI | `themes.css` cũ hơn `themes.json` *(đã sửa json mà chưa chạy `themes.mjs`)* |

Thoát mã `1` khi còn **LỖI**. Cảnh báo thì phải **đọc từng dòng** rồi sửa, hoặc ghi lý do giữ vào `DECISIONS.md`.

**Phạm vi đọc:** trang HTML **và** CSS/JS cục bộ mà trang nạp *(`<link rel=stylesheet>`, `<script src>`)*. File dùng chung chỉ báo một lần. **Không đọc** chữ do JS sinh lúc chạy *(ví dụ emoji nằm trong chuỗi JS rồi `innerHTML` ra)*. Phần đó phải soát bằng ảnh chụp ở mục 2.

⚠️ **Script đã được thử trên trang cố ý làm hỏng** *(`--selftest`: 18/18 mã kêu trên trang hỏng · im trên trang sạch, kể cả `data-clip-ok` có lý do và selector `[data-clip-ok]` trong CSS · `--kind app` bỏ P11 · CSS nạp kèm báo đúng một lần · màn app kêu P16, P17 và không kêu P11 · `--compare` bỏ qua dòng xê dịch, bắt đúng lỗi mới · P21 kêu khi băm lệch, im khi khớp · P19 bỏ qua trang nạp tokens.js)*. Selftest cũng đã được **bẻ thử**: tắt một phép kiểm thì selftest phải trả mã 1. Sửa script thì chạy lại `--selftest`.

---

## 2. Kiểm hiển thị — chụp 3 khổ

**Bộ kiểm tự chụp** *(B4: `scripts/qa-check.py`, tức `qa_init.py` rồi `handover.py run`)*:
- Trang web ở 1440, 768, 390, **hết trang theo từng màn**: `<trang>.jpg`, `<trang>-2.jpg`, … tối đa 8 ảnh *(bước `slices` của `run.mjs`)*; màn app ở 1440 *(khung máy)* và 390, một ảnh.
- Chụp ở **mọi theme** trong `qa.config.json`, ảnh ở `_qa/handover/<ngày-giờ>/<theme>/<bộ>/`.
- Nền sáng/tối theo `?theme=` của từng theme, không theo máy đang chạy: bộ chạy ép `prefers-color-scheme` theo tham số đó.

Mỗi bước, bộ chạy tự đo:
- **tràn ngang** của cả trang, kèm tối đa ba phần tử gây ra *(phần tử đầu tiên vượt mép phải mà cha còn trong khung, ví dụ `div.ph tới 1600px`)*;
- **chữ tràn hoặc bị cắt trong khung**: chữ tràn khỏi hộp của nó *(ô bảng bị ép, nút hẹp)*; hộp tràn khỏi khối cha không cắt *(cột lưới `1fr` giãn theo chữ quá to, flex item không co, ảnh `aspect-ratio` giãn theo hàng: `tràn khỏi khối cha <cha> Npx`; phần tử định vị tuyệt đối, có `transform` hay lề âm thì bỏ qua)*; hoặc chữ hay nút bị khung `overflow:hidden` cắt mất một phần *(bảng rộng hơn khung bo góc)*.
  - Phép đo tràn ngang không thấy lỗi này, vì phần tràn nằm trong khung.
  - Cố ý *(tràn lề, marquee, slide ló)* thì gắn `data-clip-ok="<lý do>"` vào khung, ví dụ `data-clip-ok="marquee chạy ngang"`. Thiếu lý do thì preflight báo P18. **Không** gắn cho chỗ tràn không cố ý *(mục 6)*.
- **tương phản trên nền thật** *(`probes.js`)*: mọi chữ và placeholder đang hiện. Phép đo trộn các lớp nền trong suốt, lấy mẫu dải chuyển, theo cả lớp anh em nằm dưới chữ *(dải màu đầu app)*. Ngưỡng 4,5:1, chữ lớn 3:1. Điểm nằm trên ảnh thì bỏ, không đoán. Chữ nằm trên lớp `pointer-events:none` mà bị đo nhầm nền: gắn `data-contrast-bg="<selector lớp đó>"` vào chữ hoặc khung *(chữ vẫn được đo)*;
- **màu theo ý định**: nút nhãn nguy hiểm tô màu chính, nút đồng ý tô màu nguy hiểm, cùng nhãn nguy hiểm mà hai màu. Nhãn nguy hiểm: *xoá, gỡ, thu hồi, từ chối, vô hiệu hoá, chấm dứt, khoá tài khoản, đặt lại, khôi phục mặc định, huỷ + việc gì*. "Huỷ", "Huỷ bỏ" của hộp thoại là thoát ra; xoá hay đặt lại bộ lọc, ô tìm kiếm, lựa chọn không làm mất dữ liệu: không tính. "Đặt lại" chỉ là nhãn nguy hiểm khi đi với thứ bị mất dữ liệu *(đặt lại dữ liệu, cài đặt, mặc định, tất cả)*. "Đặt lại mật khẩu" và đặt hàng lại *("Đặt lại" trơn, "đặt lại đơn, lịch…")* không tính. Nhãn đồng ý: *lưu, xác nhận, đồng ý, tiếp tục, gửi, duyệt, thanh toán, đặt, tạo, thêm*. Hai danh sách chép ở `templates/qa-kit/probes.js`: sửa một chỗ thì sửa cả hai.

**Lượt kiểm sâu** *(chỉ `handover.py run`; `templates/qa-kit/deep.mjs`)*: chạy ở bộ khói khổ desktop của mỗi trang; dự án không có bộ khói thì bộ khổ desktop đầu tiên của trang. `handover.py` in dòng `Lượt sâu: n bộ (…)`, hoặc `Lượt sâu không chạy: <lý do>`.
- **trạng thái:** chữ của từng control khi di chuột và khi focus bằng bàn phím phải đạt ngưỡng;
- **bàn phím:** Tab tới được mọi control trong vòng Tab *(có hộp thoại modal thì chỉ xét trong hộp thoại)* · widget nhiều mục có đường vào bằng bàn phím · widget khai roving tabindex thì phím mũi tên phải chạy · control tự dựng mang trạng thái đổi được bằng Enter hoặc Space;
- **tương tác:** bấm thật từng control hứa trạng thái *(`aria-pressed`, `aria-expanded`, `aria-checked`, `aria-selected`, `aria-sort`, role switch, tab, option)*: phải đổi thứ gì đó, và khi thuộc tính trạng thái đổi thì control phải nhìn khác;
- `data-demo-state="<trạng thái>"`: phần tử vẽ một trạng thái tĩnh *(trang `_system.html`)*, không phải control thật; lượt sâu không bấm thử. **Không** gắn lên control thật để né *(mục 6)*.

**Độ chặt:** như chữ bị cắt, chỉ chặn lỗi **mới** so với mốc. Chưa có mốc thì mọi dòng là lỗi: sửa về 0. Mốc do bộ kiểm cũ ghi *(chưa đo mục đó, chưa có lượt sâu)* thì dòng là **nợ cũ**: in ra mà không chặn; `handover-check` hỏi người dùng sửa hay nhận vào mốc. Bộ mới *(trang mới thêm vào dự án đã có mốc)* mang dòng đã có ở bộ khác trong mốc *(component dùng chung)* thì dòng đó cũng là nợ cũ. Lỗi console của lượt sâu được so với mốc như các phép đo khác. Nợ cũ in gộp: mỗi mục một dòng, kèm `×n` khi gặp ở nhiều bước, khổ, theme.

Ảnh `site/_system.html` cho Cổng 3 do `scripts/system-check.mjs` chụp *(B2)*. Lệnh dưới đây chỉ dùng khi **không chạy được** lệnh đó hay bộ kiểm, để chụp tay.

**Playwright** *(nếu có)*:
```bash
npx playwright screenshot --viewport-size=1440,900 --full-page "file:///<đường-dẫn>/index.html" _qa/1440.png
npx playwright screenshot --viewport-size=768,1024  --full-page "file:///<…>" _qa/768.png
npx playwright screenshot --viewport-size=390,844   --full-page "file:///<…>" _qa/390.png
```

**Edge/Chrome headless** *(Windows, không cần cài thêm)*:
```bash
msedge --headless=new --disable-gpu --hide-scrollbars --screenshot="<abs>\_qa\1440.png" --window-size=1440,900 "file:///<abs>/index.html"
```
Chỉ dùng cho khổ từ 500 trở lên. Dưới đó trình duyệt vẫn dàn trang ở khoảng 496px rồi cắt ảnh, nên ảnh "390" trông như tràn ngang dù trang không tràn. Khổ 390 chụp bằng Playwright ở trên, hoặc bằng `templates/qa-kit/run.mjs` *(đặt khổ qua CDP)*.

Chụp tay `site/_system.html` *(khi `system-check.mjs` không chạy được)*: dùng đúng lệnh này, mỗi theme một ảnh, thêm `?theme=<tên>` vào địa chỉ, ghi ảnh vào `_shots/system/`, không vào `_qa/`.

**Mở từng ảnh ra xem** *(công cụ Read đọc được ảnh)*, soát:
- [ ] Không tràn ngang ở 390
- [ ] Màn đầu *(site giới thiệu)*: tiêu đề ≤ 2 dòng, CTA thấy được mà không cần cuộn ở 1440×900
- [ ] Menu desktop một dòng, cao ≤ 80px
- [ ] Chữ không dính nhau, không bị cắt dấu tiếng Việt ở chữ hoa
- [ ] Nhãn nút một dòng ở desktop
- [ ] Ở 768: bảng và lưới không bị ép cột, chữ không đè nhau
- [ ] Nền sáng và nền tối đều đọc được, nếu có cả hai: xem ảnh trong thư mục của **từng** theme

**Lỗi console:** Playwright thì bắt `page.on('console')`, còn không thì mở DevTools. Phải **0 lỗi**.

---

## 3. Kiểm UX — `laws-of-ux-checklist` (12 điểm)

Chạy trên **từng trang**, đọc code thật, mỗi điểm ✅/❌ kèm `file:dòng` làm bằng chứng.

| # | Điểm | Luật |
|---|---|---|
| 1 | Hành động chính nổi nhất | Fitts · Von Restorff |
| 2 | ≤ 7 lựa chọn thấy cùng lúc | Hick · Miller |
| 3 | Thứ liên quan đứng gần nhau | Proximity · Common Region |
| 4 | Phản hồi ≤ 400ms *(skeleton, cập nhật lạc quan)* | Doherty |
| 5 | Theo quy ước quen thuộc | Jakob |
| 6 | Có hover/focus | Aesthetic-Usability |
| 7 | Luồng nhiều bước có tiến độ | Goal-Gradient · Zeigarnik |
| 8 | Vùng chạm ≥ 44px | Fitts |
| 9 | Có trạng thái rỗng | Peak-End |
| 10 | Thông tin chia cụm | Chunking · Cognitive Load |
| 11 | Thứ bậc rõ | Selective Attention · Prägnanz |
| 12 | Giấu độ phức tạp *(mặc định thông minh)* | Tesler · Occam |

**Kết luận:** 12/12 → giao · 10–11 → giao kèm ghi chú · 7–9 → sửa trước · ≤ 6 → chặn.

**Soát sâu `laws-of-ux-review`** *(đủ 30 luật, thang 0–60, xếp hạng A–F)* là một lựa chọn ở Cổng 4, **không** chạy trong B4. Gắn *(Khuyến nghị)* khi sản phẩm là **web app** hoặc có trang chỉ đạt **7–9/12**. Luật đầy đủ ở `references/b3-b4.md`, Cổng 4. Review cần `laws-of-ux/references/ux-laws-complete.md`, nên ba skill `laws-of-ux*` phải đi cùng nhau.

---

## 4. Soát gu — theo loại sản phẩm

### Site giới thiệu · E-commerce · Portfolio *(rút từ `design-taste-frontend` §14)*
- [ ] Bản đọc thiết kế và dial ghi trong `DESIGN.md`
- [ ] Khoá một nền · một màu nhấn · một hệ bo góc
- [ ] Màn đầu ≤ 4 phần tử chữ, không có dải trust/giá/tagline dưới CTA
- [ ] Không có 2 section cùng họ bố cục; zigzag ≤ 2 liên tiếp; 8 section thì ≥ 4 họ bố cục
- [ ] Bento: N nội dung = N ô, ≥ 2 ô có ảnh/nền khác
- [ ] Mỗi ý định CTA một nhãn duy nhất trên toàn trang
- [ ] Danh sách > 5 mục dùng component khác `<ul>` kẻ dòng
- [ ] Trích dẫn ≤ 3 dòng, có tên + vai trò
- [ ] Chuyển động giải thích được bằng một câu; nhịp khai báo ≥ 5 thì trang **thật sự** chuyển động
- [ ] Đọc lại **mọi chuỗi chữ**: không câu gượng, không ẩn dụ sai, không giọng "AI cố tỏ ra sâu sắc"

### Web app · công cụ vận hành
- [ ] Mỗi màn **một** hành động chính
- [ ] Bảng: cột số căn phải, `tabular-nums`, có lọc/sắp, dòng rỗng có hướng dẫn
- [ ] Phím tắt cho thao tác lặp *(ghi trong `kbd`)*
- [ ] Trạng thái đang tải / rỗng / lỗi ở **mọi** vùng dữ liệu
- [ ] Dữ liệu xuyên trang *(`rules-and-conflicts.md` D.5)*: tạo hoặc sửa ở một trang thì trang khác và số tổng hợp đổi theo · F5 không mất · `?reset` về dữ liệu mẫu
- [ ] Không trang trí nền, không bento trang trí, không marquee
- [ ] Phân quyền: vai không có quyền thì **không thấy** màn, không chỉ bị ẩn nút *(thử mở thẳng URL)*
- [ ] Số tự đặt được gắn nhãn minh hoạ
- [ ] Dashboard theo `rules-and-conflicts.md` D.7: một con số dẫn, màu chuỗi `--chart-n`, nhãn hạng mục trên hình
- [ ] Câu chữ theo A.5: nút là động từ + kết quả, hộp thoại xác nhận nhắc lại hành động, lỗi nói cách sửa, trạng thái rỗng có hành động đầu tiên

### App mobile *(luật đủ ở `mobile-app.md`)*
- [ ] Bước `tap-targets` của bộ khói **PASS** ở khổ 390 trên mọi màn và mọi nền tảng đang làm
- [ ] 3–5 tab; mỗi màn **một** hành động chính, nằm ở nửa dưới màn
- [ ] Màn đi sâu có nút quay lại; luồng toàn màn có *Huỷ* hoặc *Đóng*; sheet đóng được bằng nút, bấm nền mờ, `Esc`
- [ ] Đúng quy ước nền tảng: thanh trên, quay lại, thanh tab, danh sách, nút chính *(`mobile-app.md` mục 2)*. Làm cả hai thì xem **cả hai** ở trang tổng quan
- [ ] Không hover-only; chữ thân ≥ 16px; ô nhập đúng `type`/`inputmode`
- [ ] Ảnh 1440 *(khung máy)*: không phần nào lọt dưới thanh trạng thái, Dynamic Island hay thanh home
- [ ] Hệ thống nhiều bề mặt: đi hết từng dòng của bảng **luồng xuyên bề mặt**, bên kia thấy thay đổi

---

## 5. Báo cáo ở Cổng 4 — khuôn

```markdown
**Kiểm cơ giới:** 0 lỗi · n cảnh báo (đã xử: …)
**Hiển thị:** 1440 ✅ · 768 ✅ · 390 ✅ — ảnh ở `_qa/`
**Đo trên trang:** tương phản 0 · ý định 0 · sâu 0 *(trạng thái, bàn phím, tương tác)* · nợ cũ n *(nếu có)*
**UX 12 điểm:** Trang chủ 12/12 · Sản phẩm 11/12 (❌ #7: …)
**Review độc lập:** n vấn đề (chặn nghiệm thu · nên sửa · nhỏ), đã sửa n, đưa lên cổng n · hoặc: không có review độc lập
**Còn chờ:** 4 ảnh thật (…) · 2 số minh hoạ (…)
```

---

## 6. Lỗi kiểm: tìm nguyên nhân gốc, không làm im

> Rút từ `superpowers` *(systematic-debugging, verification-before-completion)*, nguồn ở `THIRD_PARTY_LICENSES.md`. Dùng ở B4 của `sketch-to-site`, B4 của `evolve-site`, bước kiểm nhanh của `tweak-site`.

**Trước khi sửa, tìm nguyên nhân:**
1. Đọc đủ lỗi: bộ, bước, khổ, theme, dòng báo. Có ảnh của bước đó thì mở ra xem.
2. Tái hiện riêng bộ đó: `python _qa/run_all.py _qa/.recheck <tên bộ>`, hoặc mở trang ở đúng khổ và theme. Không tái hiện được thì chưa sửa gì: chạy lại lần nữa để loại nhiễu, ghi lại.
3. Tìm chỗ gây ra: file vừa đổi *(`python _qa/quick.py --dry`, dòng nhật ký)* giao với trang có lỗi. So với trang cùng loại đang chạy đúng.
4. Nêu **một** giả thuyết bằng một câu *(ví dụ "bảng tràn vì cột Ghi chú thiếu `min-width: 0`")*, thử thay đổi nhỏ nhất để kiểm giả thuyết đó.
5. Sửa ở gốc, chạy lại đúng lệnh đã báo lỗi.

**Cấm làm im bộ kiểm.** Mỗi cách dưới đây làm lỗi biến khỏi báo cáo mà vẫn còn trên màn:

| Cách làm im | Làm thay |
|---|---|
| Gắn `data-clip-ok` *(dù có ghi lý do)* cho chỗ tràn không cố ý | Sửa chỗ tràn: `min-width: 0`, cho xuống dòng, bảng cuộn ngang trong khung |
| Thêm `overflow: hidden`, `truncate` hay `line-clamp` để che chữ người dùng cần đọc | Cho chữ đủ chỗ, hoặc đổi bố cục |
| Sửa `check` cho khớp giá trị sai, hay xoá bước kiểm | Sửa trang cho ra giá trị đúng. Bước kiểm sai thật thì nói ra, sửa bước kèm lý do |
| Thêm vào `noisy` một bước không tự đổi giữa các lần chạy | Tìm vì sao giá trị đổi |
| Đổi khổ, theme hay `query` của bộ để né lỗi | Sửa ở đúng khổ, theme đó |
| Bọc code bằng `try {} catch {}` rỗng cho hết lỗi console | Sửa lỗi gốc |
| Gắn `data-demo-state` lên control thật | Sửa control cho đổi trạng thái thật và nhìn khác |
| Hạ opacity, làm chữ to lên chỉ để qua ngưỡng tương phản; tô nút nguy hiểm thành xám cho khỏi bị bắt | Sửa màu gốc trong `themes.json`, hoặc đổi nền dưới chữ |
| Gắn `data-contrast-bg` chỉ tới lớp không nằm dưới chữ | Chỉ tới đúng lớp nằm dưới; không có lớp nào thì sửa màu |

**Ba lần sửa chưa xong thì dừng.** Báo người dùng: lỗi gì, đã thử ba cách nào, giả thuyết còn lại. Lỗi thường nằm ở bố cục hay dữ liệu, không ở chỗ đang vá.

**Nói "đã sửa", "đã qua" thì kèm bằng chứng:** dòng kết quả của lần chạy **sau** khi sửa. Không dùng kết quả lần trước, không viết "chắc là được".

---

## 7. Review bằng góc nhìn mới

> Dùng ở B4 bước 5 của `sketch-to-site`, khi có công cụ tạo subagent và phiên cho phép. Người dựng tự soát thường sót đúng chỗ đã sót lúc dựng. Rút từ `superpowers` *(requesting-code-review)*, và cách nhìn của agent `design-critic` trong `plugin87/ux-ui-agent-skills`.
>
> Gọi subagent loại chỉ đọc *(`subagent_type: "Explore"`: khởi đầu nhẹ hơn `general-purpose` khoảng 14k token, đọc và chạy lệnh đủ cho việc này)* và **chờ kết quả**, không chạy nền: review về sau khi đã bàn giao là bỏ phí, còn sửa file trong lúc review chạy thì review đọc bản cũ. Thay `{danh sách ảnh}` bằng phần *Ảnh* mà `scripts/qa-check.py` vừa in.

```text
Bạn review prototype {tên dự án} trước khi nghiệm thu, như một giám đốc thiết kế nhận bản của người khác. Bạn không dựng nó. Chỉ đọc, không sửa file nào. Mặc định bản này chưa đạt cho tới khi ảnh chứng minh ngược lại; qua bộ kiểm không phải bằng chứng về gu.

Đọc: {thư mục prototype}/CONCEPT.md, {thư mục prototype}/DESIGN.md (sơ đồ trang ở mục 9), {thư mục prototype}/DECISIONS.md (phạm vi ở Cổng 3, giả định ở B1; thứ đã khoá ở một cổng thì chỉ nêu, không đề xuất đổi), mã nguồn trong {thư mục prototype}/site/ (để dẫn file:dòng), và {skills}/sketch-to-site/references/qa-gate.md mục 4.

Mã nguồn đọc bằng grep -n hay đọc đúng đoạn cần dẫn, không in cả file ra.

Xem trước khi nói: ảnh của lần chạy mới nhất trong {thư mục prototype}/_qa/handover/, trang web chụp hết trang theo từng màn (<trang>.jpg, <trang>-2.jpg, …):
{danh sách ảnh}
Mở trong một lượt mọi ảnh 1440 và 390 ở mọi theme, cả trang _system ở 1440; mở 768 khi trang có bảng hay lưới nhiều cột. Khổ hay theme nào chưa có ảnh thì ghi vào mục Không đánh giá được, không đoán.

Soát theo thứ tự:
1. Điểm nhìn đầu: mỗi màn có một chỗ mắt dừng trước; không bốn thẻ bằng nhau.
2. Chữ: chữ hiển thị đủ lớn so với chữ thân (≥ 2,5 lần), độ đậm có vai; dòng thân không quá 75 ký tự.
3. Khoảng cách: trong nhóm chặt hơn giữa nhóm; không một khoảng cho mọi thứ.
4. Màu: màu nhấn đúng chỗ, không rải khắp; hành động nguy hiểm mang màu nguy hiểm ở mọi chỗ.
5. Độ nổi, bo góc: bóng theo độ cao thật của lớp, không một bóng cho mọi thứ.
6. Nội dung: không chữ giữ chỗ; số liệu như người dùng thật có; trạng thái rỗng nói cách lấp đầy.
7. Chịu tải: chuỗi dài, danh sách rỗng, một mục, bốn mươi mục, số chín chữ số (ảnh của bộ du-lieu-rong, du-lieu-dai nếu có). Xem khổ 390 trước khi khen khổ 1440.
8. Tương tác thật: đối chiếu dòng "sâu" trong kết quả handover; control nào trông bấm được mà không làm gì.
9. Câu chữ: nút bắt đầu bằng động từ; lỗi nói cách sửa; không giọng "AI cố tỏ ra sâu sắc".
10. Concept còn nguyên: Ý, ẩn dụ, khoảnh khắc đọc lần hai, tương tác đặc trưng thấy ở những trang nào, mất ở trang nào.

Mỗi vấn đề phải có bằng chứng: file:dòng, một số đo của bộ kiểm, hoặc một chỗ cụ thể trên một ảnh cụ thể (trang, khổ, theme). "Trông chung chung" không phải một vấn đề.

Trả về:
KẾT LUẬN: chặn · làm lại · giao
Ba lý do một giám đốc thiết kế sẽ trả bản này về (kết luận giao thì ghi "không có").
Bảng: # · Mức (Chặn nghiệm thu · Nên sửa · Nhỏ) · Vấn đề · Bằng chứng · Cách sửa.
Điểm làm tốt: tối đa hai.
Không đánh giá được: những gì chưa xem được, và vì sao.
Đừng đẩy mức lên để tỏ ra kỹ: mọi vấn đề đều Nhỏ thì nói thẳng là giao được.
```
