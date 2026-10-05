# QA — Lò Bánh Củi Cô Ba

> Mỗi lần bàn giao một mục, do `handover-check` ghi. Mốc bàn giao: `_qa/last-green/`. Mốc đầu: `_qa/handover/20261005-1317` *(sketch-to-site Cổng 4, 05/10/2026; `DECISIONS.md`)*.

## Bàn giao 05/10/2026 *(chờ nghiệm thu, chưa promote)*

**Thư mục chạy:** `_qa/handover/20261005-1555` *(`python _qa/handover.py run`; script cập nhật trước bằng `qa_init.py --update`: chép đè `run_all.py`, `quick.py`, `handover.py`)*
**Lời người dùng:** "Kiểm tổng trước khi gửi link cho khách."
**Preflight:** 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site

| Theme | Bộ | Bước | Console | FAIL | Im lặng | Tràn | Cắt | Tương phản | Ý định | Sâu | `check` đổi | Nợ cũ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `dark` *(theme duy nhất)* | 8 | 59 | 0 | 0 | 0 | 0 mới | 0 mới | 0 mới | 0 mới | 0 mới | 0 | 0 |

- **Lượt sâu:** 2 bộ *(smoke-_system-1440, smoke-index-1440)*; không có dòng "Lượt sâu không chạy".
- **Bộ mới** *(chưa có trong `last-green`)*: `dark/tinh-nang-giu-banh-1440`, `dark/tinh-nang-giu-banh-390`, từ lần sửa [2] *(thêm `_qa/steps-giu-banh.json`)*. **Bộ mất:** 0.
- **File đổi từ lần bàn giao trước (4):** `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html`; cả 4 có trong ledger. File ngoài ledger: 0.
- **Khác biệt so với `last-green`:** đã gán 0 · không gán được 0 *(không bộ cũ nào đổi giá trị `check`)*.

### Lần sửa từ lần bàn giao trước *(`_qa/current/ledger.jsonl`)*
| # | Lúc | Ghi chú | File | `check` đổi |
|---|---|---|---|---|
| 1 | 05/10 14:52 | tweak: thêm nút Gọi 0909 123 456 cạnh Xem đường đi ở khối giờ mở (`index.html`), hàng nút `.info-cta` (`site.css`) | 2 | 0 |
| 2 | 05/10 15:16 | evolve: hộp giữ bánh · màn: index (màn đầu, panel mẻ, hộp giữ bánh mới), _system (Nút, Hộp giữ bánh) | 4 | 0 |
| 3 | 05/10 15:20 | evolve: hộp giữ bánh, sửa sau ảnh (lời báo chép xuống dưới nút chính, tên và giá chung dòng, hộp thoại cao hơn) | 3 | 0 |

### UX 12 điểm
Không chấm lại ở lần này:
- **Trang chủ** *(`site/index.html`, gồm khối giờ mở của lần sửa [1] và hộp giữ bánh)*: đã chấm **12/12** trong đợt `evolve-site` Cấp 2 *Hộp giữ bánh* *(`FEATURE-DECISIONS.md`, Cổng 3)*, chấm sau cả lần sửa [1] và [3].
- **`site/_system.html`:** trang design system, không phải màn của khách; ngoài phạm vi chấm UX *(phạm vi Cổng 3: "1 trang chủ"; Cổng 4 chỉ chấm Trang chủ)*.
- Màn app mobile: không có. Bảng luồng xuyên bề mặt: không có *(một bề mặt web)*.

### Tài liệu *(B6)*
- `DESIGN.md`: thêm icon `phone` *(mục 4)*; chỗ dùng `.btn-ghost`, `.info-cta` đếm bằng `grep` *(mục 5)*; khối giờ mở có nút Gọi *(mục 9)*; sửa đếm `.field-err` ở `_system.html` 3 → 2; một dòng *Lịch sử*. Không có token mới.

### Lỗi còn lại
- Bộ kiểm: **0 lỗi**.
- Ghi chú, không phải lỗi bộ kiểm: mẫu khối giờ mở trong `site/_system.html:364-373` vẫn một nút Xem đường đi *(`style="margin-top:20px"`)*, chưa có hàng `.info-cta` và nút Gọi như `site/index.html:111-114`. Không tự sửa.
