# QA · Lò Bánh Củi Cô Ba

## Bàn giao 05/10/2026

- **Thư mục chạy:** `_qa/handover/20261005-1823` *(`handover.py run` qua `qa-check.py`, thoát 0)*
- **Kết luận của lần chạy:** SẠCH, chờ người dùng chốt rồi promote
- **Preflight:** 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site
- **Lượt sâu:** 2 bộ *(smoke-_system-1440, smoke-index-1440)*
- **So với `last-green`:** bộ mới 2 *(dark/tinh-nang-giu-banh-1440, dark/tinh-nang-giu-banh-390, của lần sửa [2])* · bộ mất 0 · khác biệt đã gán 0 · khác biệt không gán được 0 · file ngoài nhật ký 0

### Số theo theme

| Theme | Bộ | Bước | Console | FAIL | Im lặng | Tràn mới | Cắt mới | Tương phản mới | Ý định mới | Sâu mới | `check` đổi | Nợ cũ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dark *(theme duy nhất)* | 8 | 59 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Lần sửa từ lần bàn giao trước *(`ledger`, 3 lần)*

| # | Giờ | Ghi chú | File | `check` đổi |
|---|---|---|---|---|
| 1 | 2026-10-05 14:52 | tweak: thêm nút Gọi 0909 123 456 cạnh Xem đường đi ở khối giờ mở (index.html), hàng nút .info-cta (site.css) | `site/assets/site.css`, `site/index.html` | 0 |
| 2 | 2026-10-05 15:16 | evolve: hộp giữ bánh · màn: index (màn đầu, panel mẻ, hộp giữ bánh mới), _system (Nút, Hộp giữ bánh) | `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |
| 3 | 2026-10-05 15:20 | evolve: hộp giữ bánh, sửa sau ảnh (lời báo chép xuống dưới nút chính, tên và giá chung dòng, hộp thoại cao hơn) | `site/_system.html`, `site/assets/site.css`, `site/index.html` | 0 |

### UX 12 điểm

Chấm phần của lần sửa [1] *(tweak, khối giờ mở ở `index.html`)*. Lần [2] và [3] là đợt `evolve-site` Cấp 2, đã chấm ở Cổng 3 của đợt đó *(12/12, `FEATURE-DECISIONS.md`)*. Không chấm `_system.html`. Không có màn app mobile *(không có `data-surface="app"`)*.

| # | Điểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | ✅ | Hai nút mới cùng hạng `.btn-ghost` `site/index.html:112-113`; nút chính cam Giữ bánh `.btn-primary` vẫn nổi nhất trang `site/index.html:88` |
| 2 | ≤ 7 lựa chọn | ✅ | 2 nút trong `.info-cta` `site/index.html:111-114` |
| 3 | Thứ liên quan đứng gần nhau | ✅ | Hàng nút ngay dưới địa chỉ và Zalo, gap 12px, cách trên 20px `site/assets/site.css:175` |
| 4 | Phản hồi ≤ 400 ms | ✅ không áp dụng | Link `tel:` và Google Maps mở ứng dụng ngoài, không có chờ; nút có chuyển tiếp nhấn `site/assets/site.css:39-40` |
| 5 | Theo quy ước quen thuộc | ✅ | `tel:+84909123456` kèm icon điện thoại `site/index.html:113` |
| 6 | Có hover và focus | ✅ | `.btn-ghost:hover` `site/assets/site.css:47`, `:active` `:48`, `.btn:focus-visible` `:41`, transition `:39` |
| 7 | Luồng nhiều bước có tiến độ | ✅ không áp dụng | Không có luồng nhiều bước |
| 8 | Vùng chạm ≥ 44px | ✅ | `.btn` cao tối thiểu 48px `site/assets/site.css:37`; ảnh 390 `smoke-index-390/index-4.jpg` |
| 9 | Có trạng thái rỗng | ✅ không áp dụng | Số điện thoại tĩnh, không có vùng dữ liệu |
| 10 | Thông tin chia cụm | ✅ | Khối có tiêu đề h3 `site/index.html:108`, nút gom trong `.info-cta` `site/index.html:111` |
| 11 | Thứ bậc rõ | ✅ | h3 `--text-lg` `site/assets/site.css:173` > địa chỉ > nút; ảnh `smoke-index-1440/index-3.jpg` |
| 12 | Giấu độ phức tạp | ✅ | Số điền sẵn trong `tel:`, một chạm là gọi `site/index.html:113` |

**Kết quả:** 12/12 → giao.

### Lỗi còn lại

- Bộ kiểm: **0** *(console 0, FAIL 0, im lặng 0, tràn mới 0, cắt mới 0, tương phản mới 0, ý định mới 0, sâu mới 0, nợ cũ 0)*.
- Ghi chú, không phải lỗi bộ kiểm bắt: mẫu khối giờ mở ở `site/_system.html:372` vẫn một nút Xem đường đi với `style="margin-top:20px"`, chưa có hàng `.info-cta` và nút Gọi của lần sửa [1].
- Ghi chú ảnh: ở 768 và 390 hai nút trong `.info-cta` xuống hai dòng với bề rộng theo chữ *(`smoke-index-768/index-3.jpg`, `smoke-index-390/index-4.jpg`)*; hàng nút màn đầu dưới 768px giãn hết bề ngang bằng `.btn-block-sm` `site/index.html:52`.
