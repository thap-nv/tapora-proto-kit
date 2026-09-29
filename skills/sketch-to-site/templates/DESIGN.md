# Design System: <Tên dự án>

> Khoá ở **Cổng 4** ngày <dd/mm/yyyy>. Sửa sau ngày này thì ghi vào `DECISIONS.md` và cập nhật bảng *Lịch sử* cuối file.
> Viết theo khuôn ngữ nghĩa của `stitch-design-taste`: **tên mô tả + giá trị chính xác + vai trò**. Viết *"Than chì (#18181B), chữ chính"*, đừng chỉ viết *"chữ tối"*.

## 0. Bản đọc thiết kế
**Đọc là:** <loại sản phẩm> cho <người dùng>, trên <thiết bị>, giọng <…>, nghiêng về <họ phong cách>.
**Họ phong cách:** <tên, từ `style-catalogue.md`> · **Hướng đã chọn:** <A/B/C/trộn> · **Mức bám tham chiếu:** <…>
**Dial:** VARIANCE <n> · MOTION <n> · DENSITY <n> · **Nền:** <sáng | tối | theo hệ thống>

## 1. Không khí
<2–3 câu gợi hình: cảm giác, mật độ, nhịp. Ví dụ: "Sáng, thoáng như một phòng trưng bày kiến trúc; bố cục lệch tự tin; chuyển động nặng và chậm.">

## 2. Màu và vai trò
| Tên | Sáng | Tối | Vai trò |
|---|---|---|---|
| Nền | #… | #… | Nền trang |
| Mặt thẻ | #… | #… | Thẻ, panel |
| Chữ chính | #… | #… | Tiêu đề, chữ thân |
| Chữ phụ | #… | #… | Mô tả, metadata |
| Đường kẻ | … | … | Viền 1px, phân cách |
| **Nhấn** | #… | #… | CTA, trạng thái đang chọn, focus ring |
| Thành công / Cảnh báo / Lỗi | … | … | Chỉ để báo trạng thái |

**Tương phản đã đo:** chữ chính/nền <x:1> · chữ phụ/nền <x:1> · chữ trên nút nhấn <x:1>

## 3. Chữ
| Vai | Font | Trọng lượng | Cỡ | Leading | Tracking |
|---|---|---|---|---|---|
| Hiển thị | … | … | `clamp(…)` | … | … |
| Tiêu đề section | … | … | … | … | … |
| Thân | … | 400 | 16–18px | 1.6 | 0 |
| Số liệu / mono | … | … | … | … | … |

**Đã kiểm dấu tiếng Việt:** `preflight.py --font "<…>"` → <kết quả>

## 4. Hình khối
- **Bo góc:** <một hệ, ví dụ: nút pill · thẻ 16px · ô nhập 10px>
- **Bóng:** <nhuốm màu gì, độ khuếch tán> · **Viền:** <…>
- **Icon:** <Phosphor Regular | …>, nét <…>
- **Thang khoảng cách:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

## 5. Component
- **Nút:** chính <…> · phụ <…> · chữ <…> · hover/active/focus/disabled <…>
- **Thẻ:** <khi nào dùng; mật độ cao thì thay bằng gì>
- **Ô nhập:** nhãn trên · lỗi dưới · focus ring <…>
- **Đang tải / rỗng / lỗi:** <…>
- **Component đặc trưng của dự án:** <…>

## 6. Bố cục
<lưới, max-width, cách thu về một cột dưới 768px, nhịp section>

## 7. Chuyển động
<easing, thời lượng, cái gì chuyển động và vì sao; nhánh reduced-motion>

## 8. Cấm riêng của dự án
- <ví dụ: không dùng từ "Chi nhánh" (glossary) · không đỏ cho giá · …>

## 9. Sơ đồ trang
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

## Lịch sử
| Ngày | Đổi gì | Vì sao |
|---|---|---|
