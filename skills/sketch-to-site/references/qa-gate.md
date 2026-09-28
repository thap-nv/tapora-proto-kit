# Tự kiểm — B7 (phải qua trước Cổng 5)

> **Nói "đã xong" thì phải có số thật dán kèm.** Không dựa vào "đã rà mắt".

---

## 1. Kiểm cơ giới — `preflight.py`

```bash
python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-hoặc-file.html>            # kiểm
python <skills>/sketch-to-site/scripts/preflight.py <…> --kind app                      # web app: bỏ luật chỉ dành cho site giới thiệu
python <skills>/sketch-to-site/scripts/preflight.py --font "Be Vietnam Pro" "Outfit"    # tra dấu tiếng Việt
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
| `P11` | CẢNH BÁO | Eyebrow *(`uppercase` + `tracking-`)* vượt ⌈số section / 3⌉. Bỏ qua khi `--kind app` |
| `P12` | CẢNH BÁO | Sáo ngữ: *Nâng tầm, Liền mạch, Đột phá, Elevate, Seamless, Unleash…* |
| `P13` | CẢNH BÁO | `href="#"` trơn |
| `P14` | CẢNH BÁO | `z-[9999]` / `z-index: 9999` |
| `P15` | CẢNH BÁO | Font không tra được trong dữ liệu *(Fontshare, font tự host)*. Kiểm tay |

Thoát mã `1` khi còn **LỖI**. Cảnh báo thì phải **đọc từng dòng** rồi sửa, hoặc ghi lý do giữ vào `DECISIONS.md`.

**Phạm vi đọc:** trang HTML **và** CSS/JS cục bộ mà trang nạp *(`<link rel=stylesheet>`, `<script src>`)*. File dùng chung chỉ báo một lần. **Không đọc** chữ do JS sinh lúc chạy *(ví dụ emoji nằm trong chuỗi JS rồi `innerHTML` ra)*. Phần đó phải soát bằng ảnh chụp ở mục 2.

⚠️ **Script đã được thử trên trang cố ý làm hỏng** *(`--selftest`: 15/15 mã kêu trên trang hỏng · im trên trang sạch · `--kind app` bỏ P11 · CSS nạp kèm báo đúng một lần)*. Selftest cũng đã được **bẻ thử**: tắt một phép kiểm thì selftest phải trả mã 1. Sửa script thì chạy lại `--selftest`.

---

## 2. Kiểm hiển thị — chụp 3 khổ

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
- [ ] Nền sáng và nền tối đều đọc được, nếu có cả hai *(`data-theme="dark"`)*

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

**Soát sâu `laws-of-ux-review`** *(đủ 30 luật, thang 0–60, xếp hạng A–F)* là một lựa chọn ở Cổng 5, **không** chạy trong B7. Gắn *(Khuyến nghị)* khi sản phẩm là **web app** hoặc có trang chỉ đạt **7–9/12**. Luật đầy đủ ở SKILL.md, Cổng 5. Review cần `laws-of-ux/references/ux-laws-complete.md`, nên ba skill `laws-of-ux*` phải đi cùng nhau.

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
- [ ] Không trang trí nền, không bento trang trí, không marquee
- [ ] Phân quyền: vai không có quyền thì **không thấy** màn, không chỉ bị ẩn nút *(thử mở thẳng URL)*
- [ ] Số tự đặt được gắn nhãn minh hoạ

---

## 5. Báo cáo ở Cổng 5 — khuôn

```markdown
**Kiểm cơ giới:** 0 lỗi · n cảnh báo (đã xử: …)
**Hiển thị:** 1440 ✅ · 768 ✅ · 390 ✅ — ảnh ở `_qa/`
**UX 12 điểm:** Trang chủ 12/12 · Sản phẩm 11/12 (❌ #7: …)
**Còn chờ:** 4 ảnh thật (…) · 2 số minh hoạ (…)
```
