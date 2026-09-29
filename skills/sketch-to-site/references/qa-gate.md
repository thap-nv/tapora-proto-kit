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
| `P07` | LỖI | Font Google không có subset `vietnamese` *(tra dữ liệu `ui-ux-pro-max`)* |
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

Thoát mã `1` khi còn **LỖI**. Cảnh báo thì phải **đọc từng dòng** rồi sửa, hoặc ghi lý do giữ vào `DECISIONS.md`.

**Phạm vi đọc:** trang HTML **và** CSS/JS cục bộ mà trang nạp *(`<link rel=stylesheet>`, `<script src>`)*. File dùng chung chỉ báo một lần. **Không đọc** chữ do JS sinh lúc chạy *(ví dụ emoji nằm trong chuỗi JS rồi `innerHTML` ra)*. Phần đó phải soát bằng ảnh chụp ở mục 2.

⚠️ **Script đã được thử trên trang cố ý làm hỏng** *(`--selftest`: 16/16 mã kêu trên trang hỏng · im trên trang sạch, kể cả `data-clip-ok` có lý do và selector `[data-clip-ok]` trong CSS · `--kind app` bỏ P11 · CSS nạp kèm báo đúng một lần · màn app kêu P16, P17 và không kêu P11 · `--compare` bỏ qua dòng xê dịch, bắt đúng lỗi mới)*. Selftest cũng đã được **bẻ thử**: tắt một phép kiểm thì selftest phải trả mã 1. Sửa script thì chạy lại `--selftest`.

---

## 2. Kiểm hiển thị — chụp 3 khổ

**Bộ kiểm tự chụp** *(B4: `qa_init.py` rồi `handover.py run`)*:
- Trang web ở 1440, 768, 390; màn app ở 1440 *(khung máy)* và 390.
- Chụp ở **mọi theme** trong `qa.config.json`, ảnh ở `_qa/handover/<ngày-giờ>/<theme>/<bộ>/`.
- Nền sáng/tối theo `?theme=` của từng theme, không theo máy đang chạy: bộ chạy ép `prefers-color-scheme` theo tham số đó.

Mỗi bước, bộ chạy tự đo:
- **tràn ngang** của cả trang;
- **chữ tràn hoặc bị cắt trong khung**: chữ tràn khỏi hộp của nó *(ô bảng bị ép, nút hẹp)*, hoặc chữ hay nút bị khung `overflow:hidden` cắt mất một phần *(bảng rộng hơn khung bo góc)*.
  - Phép đo tràn ngang không thấy lỗi này, vì phần tràn nằm trong khung.
  - Cố ý *(tràn lề, marquee, slide ló)* thì gắn `data-clip-ok="<lý do>"` vào khung, ví dụ `data-clip-ok="marquee chạy ngang"`. Thiếu lý do thì preflight báo P18. **Không** gắn cho chỗ tràn không cố ý *(mục 6)*.

Lệnh dưới đây chỉ dùng khi **không chạy được bộ kiểm**, để chụp tay.

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

**Soát sâu `laws-of-ux-review`** *(đủ 30 luật, thang 0–60, xếp hạng A–F)* là một lựa chọn ở Cổng 4, **không** chạy trong B4. Gắn *(Khuyến nghị)* khi sản phẩm là **web app** hoặc có trang chỉ đạt **7–9/12**. Luật đầy đủ ở SKILL.md, Cổng 4. Review cần `laws-of-ux/references/ux-laws-complete.md`, nên ba skill `laws-of-ux*` phải đi cùng nhau.

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

**Ba lần sửa chưa xong thì dừng.** Báo người dùng: lỗi gì, đã thử ba cách nào, giả thuyết còn lại. Lỗi thường nằm ở bố cục hay dữ liệu, không ở chỗ đang vá.

**Nói "đã sửa", "đã qua" thì kèm bằng chứng:** dòng kết quả của lần chạy **sau** khi sửa. Không dùng kết quả lần trước, không viết "chắc là được".

---

## 7. Review bằng góc nhìn mới

> Dùng ở B4 bước 5 của `sketch-to-site`, khi có công cụ tạo subagent và phiên cho phép. Người dựng tự soát thường sót đúng chỗ đã sót lúc dựng. Rút từ `superpowers` *(requesting-code-review)*.

```text
Bạn review prototype {tên dự án} trước khi nghiệm thu. Bạn không dựng nó. Chỉ đọc, không sửa file nào.

Đọc: {thư mục prototype}/CONCEPT.md, {thư mục prototype}/DESIGN.md (sơ đồ trang ở mục 9), {thư mục prototype}/DECISIONS.md (phạm vi ở Cổng 3; thứ đã khoá ở một cổng thì chỉ nêu, không đề xuất đổi), mã nguồn trong {thư mục prototype}/site/ (để dẫn file:dòng), ảnh chụp mới nhất trong {thư mục prototype}/_qa/handover/, và {skills}/sketch-to-site/references/qa-gate.md mục 4.

Trả về:
1. Concept còn nguyên không: Ý, ẩn dụ, khoảnh khắc đọc lần hai, tương tác đặc trưng thấy ở những trang nào, mất ở trang nào.
2. Soát gu theo qa-gate.md mục 4: mỗi vấn đề chỉ vào trang, khổ, và chỗ trên ảnh hoặc file:dòng.
3. Chỗ trông giống khuôn chung, không thuộc về sản phẩm này.

Xếp mọi vấn đề theo mức: Chặn nghiệm thu · Nên sửa · Nhỏ. Cuối cùng: danh sách những gì đã cân nhắc mà bỏ qua, mỗi dòng một lý do.
```
