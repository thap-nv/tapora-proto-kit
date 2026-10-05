# QA · Lò Bánh Củi Cô Ba

## Bàn giao 05/10/2026

- **Thư mục chạy:** `_qa/handover/20261005-1554` *(`qa-check.py`, thoát 0)*
- **Preflight:** 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site
- **Lượt sâu:** 2 bộ *(smoke-_system-1440, smoke-index-1440)*
- **Bộ mới** *(chưa có trong `last-green`)*: `dark/tinh-nang-giu-banh-1440`, `dark/tinh-nang-giu-banh-390` · **Bộ mất:** 0

| Theme | Bộ | Bước | Console | FAIL | Im lặng | Tràn mới | Cắt mới | Tương phản mới | Ý định mới | Sâu mới | `check` đổi so với last-green | Nợ cũ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dark | 8 | 59 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Khác biệt đã gán: 0 · không gán được: 0 · file đổi ngoài nhật ký: 0.

### Lần sửa từ lần bàn giao trước *(nhật ký, 3 lần)*
| # | Giờ | Lần sửa | File | `check` đổi |
|---|---|---|---|---|
| 1 | 2026-10-05 14:52 | tweak: thêm nút Gọi 0909 123 456 cạnh Xem đường đi ở khối giờ mở (index.html), hàng nút `.info-cta` (site.css) | `site/assets/site.css`, `site/index.html` | 0 |
| 2 | 2026-10-05 15:16 | evolve: hộp giữ bánh · màn: index (màn đầu, panel mẻ, hộp giữ bánh mới), _system (Nút, Hộp giữ bánh) | `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |
| 3 | 2026-10-05 15:20 | evolve: hộp giữ bánh, sửa sau ảnh (lời báo chép xuống dưới nút chính, tên và giá chung dòng, hộp thoại cao hơn) | `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |

### UX 12 điểm
Chấm trên phần đã đụng mà chưa chấm: **khối giờ mở và đường đi của `index.html`** *(lần sửa 1, nút Gọi)*. Màn đầu, panel mẻ, hộp giữ bánh *(index)* và mục Nút, Hộp giữ bánh *(_system)* đã chấm 12/12 trong đợt `evolve-site` Cấp 2 *(`FEATURE-DECISIONS.md`, Cổng 3)*, không chấm lại. Không có màn app mobile *(không có `data-surface`)*.

| # | Điểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Nút Gọi là `.btn-ghost` ngang cỡ Xem đường đi `site/index.html:112-113`; không tranh với nút chính `.btn-primary` Giữ bánh `site/index.html:51`, `:88` |
| 2 | ≤ 7 lựa chọn | ✅ | 2 nút trong khối `site/index.html:111-114` |
| 3 | Thứ liên quan đứng gần nhau | ✅ | Hai nút gom trong `.info-cta` gap 12px, cách địa chỉ 20px `site/assets/site.css:175` |
| 4 | Phản hồi ≤ 400 ms | ✅ | Liên kết đi ngay, không chờ tải; nhấn `scale(.98)` `site/assets/site.css:40`, chuyển nền `--dur-fast` `site/assets/site.css:39` |
| 5 | Theo quy ước quen | ✅ | `tel:+84909123456` kèm icon `ph-phone` `site/index.html:113` |
| 6 | Có hover và focus | ✅ | `.btn-ghost:hover` `site/assets/site.css:47` · `.btn:focus-visible` `site/assets/site.css:41` · chuyển tiếp `site/assets/site.css:39` |
| 7 | Luồng nhiều bước có tiến độ | ✅ | không áp dụng |
| 8 | Vùng chạm ≥ 44px | ✅ | `.btn` `min-height:48px` `site/assets/site.css:37` *(ảnh `dark/smoke-index-390/index-4.jpg`)* |
| 9 | Có trạng thái rỗng | ✅ | không áp dụng: nội dung tĩnh |
| 10 | Thông tin chia cụm | ✅ | Tiêu đề giờ mở, địa chỉ, hàng nút, ảnh `site/index.html:108-114` |
| 11 | Thứ bậc rõ | ✅ | H2 `.sec-title` `site/index.html:99` > H3 `--text-lg` `site/assets/site.css:173` > địa chỉ `site/index.html:109` |
| 12 | Giấu độ phức tạp | ✅ | Gọi một chạm, không tuỳ chọn thêm `site/index.html:113` |

**Kết quả: 12/12.** Ghi chú *(không chặn)*: ở 390 và 768 hai nút xuống hai dòng, rộng theo chữ; nút màn đầu dưới 768px giãn hết ngang (`.btn-block-sm`), hai nút này thì không.

### Tài liệu
`DESIGN.md`: ghi bù nút Gọi *(mục 9 section 4)*, `.info-cta` *(mục 6)*, icon `phone` *(mục 4)*, một dòng Lịch sử. Chỗ dùng hộp giữ bánh đếm lại bằng `grep` *(index: 1 `dialog.hold`, 3 lối mở `data-hold`, 1 `.input`, 2 `.field-err`, 1 `.btn-icon`; _system: 4 `.hold`, 8 `.pick-opt`, 9 `.qty`, 2 `.input`, 3 `.field-err`, 2 `.btn-icon`)*: khớp. Không có token mới.

### Lỗi còn lại
Không có.
