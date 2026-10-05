# QA · Lò Bánh Củi Cô Ba

## Bàn giao 05/10/2026

- **Thư mục chạy:** `_qa/handover/20261005-1548` *(`qa-check.py` → `handover.py run`, thoát 0)*
- **So với:** `_qa/last-green/` *(mốc bàn giao trước)*
- **Preflight:** 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site
- **Lượt sâu:** 2 bộ *(smoke-_system-1440, smoke-index-1440)*
- **Bộ mới** *(chưa có trong mốc)*: `dark/tinh-nang-giu-banh-1440`, `dark/tinh-nang-giu-banh-390` · **Bộ mất:** 0
- **Khác biệt:** đã gán 0 · không gán được 0 · file đổi ngoài nhật ký 0
- **File đổi từ lần bàn giao trước (4):** `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html`

### Số theo theme

| Theme | Bộ | Bước | Console | FAIL | Im lặng | Tràn mới | Cắt mới | Tương phản mới | Ý định mới | Sâu mới | `check` đổi | Nợ cũ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dark *(mặc định, duy nhất)* | 8 | 59 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Lần sửa từ lần bàn giao trước *(`handover.py ledger`)*

| # | Giờ | Lần sửa | File | `check` đổi |
|---|---|---|---|---|
| 1 | 05/10 14:52 | tweak: thêm nút Gọi 0909 123 456 cạnh Xem đường đi ở khối giờ mở, hàng nút `.info-cta` | `site/assets/site.css`, `site/index.html` | 0 |
| 2 | 05/10 15:16 | evolve Cấp 2: hộp giữ bánh *(màn đầu, panel mẻ, hộp mới; `_system`: Nút, Hộp giữ bánh)* | `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |
| 3 | 05/10 15:20 | evolve: hộp giữ bánh, sửa sau ảnh *(lời báo chép xuống dưới nút chính, tên và giá chung dòng, hộp thoại cao hơn)* | `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |

### UX 12 điểm

Chấm trên phần đã đụng mà chưa được chấm: **khối giờ mở và đường đi** của `site/index.html` *(lần sửa 1, nút Gọi)*. Màn đầu, panel mẻ, hộp giữ bánh và `site/_system.html` đã chấm 12/12 trong đợt `evolve-site` Cấp 2 *(`FEATURE-DECISIONS.md`, Cổng 3)*, không chấm lại. Không có màn app mobile *(không có `data-surface="app"`)*, một bề mặt.

| # | Điểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Hai nút khối giờ mở là `.btn-ghost` (`index.html:112-113`); hành động chính của trang vẫn là `.btn-primary` Giữ bánh qua Zalo (`index.html:51`) |
| 2 | ≤ 7 lựa chọn | ✅ | 2 nút trong `.info-cta` (`index.html:111-114`) |
| 3 | Thứ liên quan đứng gần nhau | ✅ | Nút Gọi chung hàng với Xem đường đi, gap 12px, ngay dưới địa chỉ và số Zalo (`site.css:175`, `index.html:109-111`) |
| 4 | Phản hồi ≤ 400 ms | ✅ | Nhấn: `scale(.98)` và đổi nền trong `--dur-fast` 150ms (`site.css:39-40`, `site.css:48`); `tel:` mở trình gọi của máy, không có tải |
| 5 | Theo quy ước quen thuộc | ✅ | Liên kết `tel:+84909123456`, icon `ph-phone` (`index.html:113`) |
| 6 | Có hover và focus | ✅ | `.btn-ghost:hover` (`site.css:47`), `.btn:focus-visible` (`site.css:41`), chuyển tiếp (`site.css:39`) |
| 7 | Luồng nhiều bước có tiến độ | ✅ | không áp dụng: một lần bấm |
| 8 | Vùng chạm ≥ 44px | ✅ | `.btn` `min-height:48px` (`site.css:37`) |
| 9 | Có trạng thái rỗng | ✅ | không áp dụng: khối tĩnh, không có vùng dữ liệu |
| 10 | Thông tin chia cụm | ✅ | Section có H2 "Nội quy cạnh lò", khối giờ mở có chip, H3, địa chỉ, hàng nút (`index.html:99`, `index.html:107-111`) |
| 11 | Thứ bậc rõ | ✅ | H3 `--text-lg` (`site.css:173`) > địa chỉ thân > chip nhỏ; ảnh `dark/smoke-index-1440/index-3.jpg` |
| 12 | Giấu độ phức tạp | ✅ | Số in sẵn trên nút, bấm một lần là gọi (`index.html:113`) |

**Kết quả:** 12/12.

**Ghi chú, không chặn:** ở 390 và 768, hàng `.info-cta` xuống dòng, hai nút rộng theo chữ nên lệch nhau *(`dark/smoke-index-390/index-4.jpg`, `dark/smoke-index-768/index-3.jpg`)*; nút Xem đường đi ở màn đầu thì giãn hết ngang dưới 768px nhờ `.btn-block-sm` (`index.html:52`, `site.css:56`). Bộ kiểm không tính là lỗi.

### Tài liệu

- `DESIGN.md`: thêm icon `phone` *(mục 4)*, nút Gọi vào khối giờ mở *(mục 9)*, đếm lại chỗ dùng bằng `grep` *(`_system.html` có 2 `.field-err`, bản trước ghi 3)*, thêm chỗ dùng nút *(`index.html`: 4 `.btn-primary`, 6 `.btn-ghost`; `_system.html`: 8, 5)*, một dòng Lịch sử. Không token mới.

### Lỗi còn lại

Không có. Console 0, FAIL 0, tràn mới 0, cắt mới 0, tương phản mới 0, ý định mới 0, sâu mới 0, nợ cũ 0.

**Nghiệm thu:** chờ người dùng *(chưa promote)*.
