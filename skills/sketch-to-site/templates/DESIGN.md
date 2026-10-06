# Design System: <Tên dự án>

> Khoá ở **Cổng 3** ngày <dd/mm/yyyy>. Sửa sau ngày này thì ghi vào `DECISIONS.md` và cập nhật bảng *Lịch sử* cuối file.
> Viết theo khuôn ngữ nghĩa của `stitch-design-taste`: **tên mô tả + giá trị chính xác + vai trò**. Viết *"Than chì (#18181B), chữ chính"*, đừng chỉ viết *"chữ tối"*.

## 0. Bản đọc thiết kế
**Đọc là:** <loại sản phẩm> cho <người dùng>, trên <thiết bị>, giọng <…>, nghiêng về <họ phong cách>.
**Concept:** <tên> *(`CONCEPT.md`, chốt ở Cổng 2)* · **Họ phong cách:** <tên, từ `style-catalogue.md`> · **Mã trộn:** <… | không> · **Mức bám tham chiếu:** <…>
**Dial:** VARIANCE <n> · MOTION <n> · DENSITY <n> · **Nền:** <sáng | tối> · **Nền thứ hai:** <không | theo cài đặt máy, người dùng xin ở Cổng 2>

## 1. Không khí
<2–3 câu gợi hình: cảm giác, mật độ, nhịp. Ví dụ: "Sáng, thoáng như một phòng trưng bày kiến trúc; bố cục lệch tự tin; chuyển động nặng và chậm.">

## 2. Màu và vai trò
> Nguồn: `site/assets/themes.json` *(màu gốc của từng theme)* → `site/assets/themes.css` *(sinh bởi `scripts/themes.mjs`, không sửa tay)*. Bảng dưới chép màu gốc; vai dẫn xuất *(hover, nhấn, nền nhạt, viền control, vòng focus, liên kết)* xem ở `site/_system.html`. Tên biến giữ nguyên như `CONCEPT.md` mục 3.

| Vai | Biến | <theme 1> | <theme 2> | Dùng cho |
|---|---|---|---|---|
| Nền | `--bg` | #… | #… | Nền trang |
| Mặt thẻ | `--surface` | … | … | Thẻ, panel, ô nhập |
| Chữ chính | `--ink` | … | … | Tiêu đề, chữ thân |
| Chữ phụ | `--muted` | … | … | Mô tả, metadata, placeholder |
| Đường kẻ | `--line` | … | … | Viền 1px trang trí. Viền control dùng `--line-strong` *(dẫn xuất)* |
| **Chính** | `--primary` · `--on-primary` | … | … | Nút chính, một nút mỗi màn |
| Nhấn | `--accent` · `--on-accent` | … | … | Đang chọn, tab đang mở |
| Nguy hiểm | `--destructive` · `--on-destructive` | … | … | Xoá, huỷ việc gì, thu hồi, đặt lại: ở **mọi** chỗ, cả nút mở lẫn nút xác nhận |
| Báo *(tuỳ chọn)* | `--success` · `--warning` · `--info` | … | … | Chỉ để báo trạng thái, luôn kèm chữ hoặc icon |

**Kết quả `themes.mjs`:** <dòng cuối: n theme · n cặp · 0 không đạt · n sát ngưỡng> · **Cặp sát ngưỡng:** <… hoặc không có> · **Đã chỉnh:** <dòng "đã chỉnh" nếu có>

## 2b. Theme
| Theme | Chế độ | Mặc định cho | Khác theme đầu ở đâu |
|---|---|---|---|
| `<light>` | sáng | máy để chế độ sáng | theme đầu |
| `<dark>` *(chỉ khi người dùng xin chế độ tối; không thì bỏ dòng)* | tối | máy để chế độ tối | <…> |

**Thêm theme:** thêm một mục vào `themes.json` → chạy `themes.mjs` → `qa_init.py --update` in dòng cần thêm vào `qa.config.json`. Không sửa `theme.js`.

## 3. Chữ
| Vai | Font | Trọng lượng | Biến cỡ | Leading | Tracking |
|---|---|---|---|---|---|
| Hiển thị | … | … | `--text-4xl` | `--leading-tight` | … |
| Tiêu đề section | … | … | `--text-2xl` | … | … |
| Thân | … | 400 | `--text-base` | `--leading-normal` | 0 |
| Số liệu / mono | … | … | … | … | … |

**Thang:** tỉ lệ <1.2 | 1.25 | 1.333> · chữ hiển thị lớn nhất <n>px = <x> lần chữ thân *(≥ 2,5; `_system.html` in số này)* · biến `--text-xs … --text-4xl` ở `tokens.css`.
**Đã kiểm dấu tiếng Việt:** `preflight.py --font "<…>"` → <kết quả>

## 4. Hình khối
- **Bo góc:** `--radius-sm` <…> · `--radius` <…> · `--radius-lg` <…> *(một hệ; pill cho phần tương tác thì ghi luật)*
- **Bóng theo độ cao:** `--shadow-1` thẻ đứng yên · `--shadow-2` menu, popover · `--shadow-3` thẻ đang nổi, thanh dính · `--shadow-4` hộp thoại, toast
- **Lớp:** `--z-sticky` · `--z-dropdown` · `--z-overlay` · `--z-modal` · `--z-toast`
- **Viền:** <…> · **Icon:** <Phosphor Regular | …>, nét <…>
- **Thang khoảng cách:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

## 5. Component · 8 trạng thái
Mọi component có mặt trên `site/_system.html`, đủ các trạng thái áp dụng được. Ô không áp dụng ghi `·`.

| Component | Mặc định | Hover | Focus | Nhấn | Tắt | Đang tải | Lỗi | Đang chọn |
|---|---|---|---|---|---|---|---|---|
| Nút chính | `--primary` | `--primary-hover` | vòng `--ring` 2px | `--primary-pressed` | `--disabled-opacity` | spinner, chữ giữ độ đậm | · | · |
| Nút nguy hiểm | `--destructive` | `--destructive-hover` | vòng `--ring` | `--destructive-pressed` | … | … | · | · |
| Ô nhập | viền `--line-strong` | … | vòng `--ring` | · | … | · | viền `--destructive`, chữ `--danger-text` dưới ô | · |
| Tab, mục menu | … | `--hover` | … | `--pressed` | … | · | · | `--selected` |
| <component đặc trưng> | … | … | … | … | … | … | … | … |

**Đang tải** không mượn kiểu của **Tắt** *(mờ đi đọc thành "không làm được")*. **Vùng dữ liệu:** đang tải <…> · rỗng <…> · lỗi <…>

## 6. Bố cục
<lưới, max-width, cách thu về một cột dưới 768px, nhịp section>

## 7. Chuyển động
`--dur-fast` <…> · `--dur-base` <…> · `--dur-slow` <…> · `--ease-out` <…> · `--ease-emphasis` <…>. Chỉ animate `transform`, `opacity`. Cái gì chuyển động và vì sao: <…>. Nhánh `prefers-reduced-motion`: thời lượng về 0 *(`tokens.css`)*.

## 8. Cấm riêng của dự án
- <ví dụ: không dùng từ "Chi nhánh" (glossary) · không đỏ cho giá · …>

## 9. Sơ đồ trang
> Dự án có bản đồ *(`sketch-to-map`)*: màn, vùng, tab, chỗ đặt, lối tắt và menu theo vai ở `map/MAP.md`, không chép lại. Bảng dưới chỉ ghi section và dữ liệu của các màn đã dựng.

| Bề mặt | Trang / màn | Section theo thứ tự | Hành động chính | Dữ liệu cần |
|---|---|---|---|---|

**App:** tab *(3–5)* · màn đi sâu từ màn nào · luồng toàn màn. **Nhiều bề mặt:** luồng xuyên bề mặt:
| Hành động | Ở bề mặt | Thấy thay đổi ở | Dữ liệu đổi |
|---|---|---|---|

## 10. Bề mặt và nền tảng *(bỏ mục này nếu chỉ có một website)*
| Bề mặt | Người dùng · thiết bị | Nền tảng | Mật độ | Khác phần chung ở đâu |
|---|---|---|---|---|
| <admin web> | <nhân viên, máy tính cả ngày> | Web | D 7 | <bảng dày, sidebar> |
| <app khách> | <khách, điện thoại> | iOS · Android | D 5 | <tab bar, vùng chạm 44/48, font nền tảng> |

- **Kích thước app** ghi theo pt *(iOS)* / dp *(Android)*; trong prototype 1 CSS px = 1 pt = 1 dp.
- **Lưu ý cho đội dựng app thật** *(tra `search.py --stack <swiftui | jetpack-compose | react-native | flutter>`)*: <…>

## 11. Biểu đồ *(bỏ mục này nếu không có dashboard)*
- Màu chuỗi `--chart-1 … --chart-n` *(`themes.json`, khoá `chart`; mỗi màu ≥ 3:1 trên `--surface`)*. Không dùng màu chính hay màu báo cho chuỗi dữ liệu.
- Trục, lưới: `--line` · nhãn trục: `--muted` · tooltip: nền `--ink`, chữ `--bg`.
- Nhãn hạng mục nằm trên hình, không chỉ trong `aria-label`. Mỗi biểu đồ có `<figcaption>` hoặc bảng số tóm tắt *(`rules-and-conflicts.md` D.7)*.

## Lịch sử
| Ngày | Đổi gì | Vì sao |
|---|---|---|
