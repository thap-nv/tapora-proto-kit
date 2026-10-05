# QA — Lò Bánh Củi Cô Ba

> Mỗi lần bàn giao lại một mục, do `handover-check` ghi. Mốc bàn giao trước: `_qa/handover/20261005-1317` *(promote ở Cổng 4 của `sketch-to-site`, 6 bộ)*.

## Bàn giao 05/10/2026 *(chờ nghiệm thu)*

**Lý do chạy:** "Kiểm tổng trước khi gửi link cho khách."
**Thư mục chạy:** `_qa/handover/20261005-1548` · trước đó `qa_init.py --update` chép đè `run_all.py`, `quick.py`, `handover.py` *(cấu hình, file bước, mốc, nhật ký giữ nguyên)*.
**Preflight:** 2 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site

| Theme | Bộ | Bước | Console | FAIL | Im lặng | Tràn mới | Cắt mới | Tương phản mới | Ý định mới | Sâu mới | `check` đổi | Nợ cũ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `dark` | 8 | 59 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

- **Lượt sâu:** 2 bộ *(smoke-_system-1440, smoke-index-1440)*; không có dòng "Lượt sâu không chạy".
- **Bộ mới** *(chưa có trong `last-green`)*: `dark/tinh-nang-giu-banh-1440`, `dark/tinh-nang-giu-banh-390` *(thêm ở đợt `evolve-site` Hộp giữ bánh)*. **Bộ mất:** 0.
- **File đổi từ lần bàn giao trước (4):** `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html`. **File không có trong ledger:** 0.
- **Khác biệt so với mốc:** đã gán 0 · không gán được 0 *(không bộ nào phải chạy lại để loại nhiễu)*.

### Lần sửa từ nhật ký (`_qa/current/ledger.jsonl`, 3 dòng)
| # | Lúc | Ghi chú | File | `check` đổi |
|---|---|---|---|---|
| 1 | 05/10 14:52 | tweak: thêm nút Gọi 0909 123 456 cạnh Xem đường đi ở khối giờ mở (index.html), hàng nút `.info-cta` (site.css) | 2 | 0 |
| 2 | 05/10 15:16 | evolve: hộp giữ bánh · màn: index (màn đầu, panel mẻ, hộp giữ bánh mới), _system (Nút, Hộp giữ bánh) | 4 | 0 |
| 3 | 05/10 15:20 | evolve: hộp giữ bánh, sửa sau ảnh (lời báo chép xuống dưới nút chính, tên và giá chung dòng, hộp thoại cao hơn) | 3 | 0 |

### UX 12 điểm
Màn đã đụng từ lần bàn giao trước: `index`, `_system`. Không chấm lại:
- `index`: đã chấm **12/12** trong đợt `evolve-site` Cấp 2 *Hộp giữ bánh* *(`FEATURE-DECISIONS.md`, Cổng 3)*, chấm trên phần mới và trang chứa nó, sau lần tweak 14:52. Không file nào đổi sau đợt đó *(lần chạy này: 0 file ngoài ledger)*.
- `_system`: trang design system, màn liên quan của cùng đợt Cấp 2; dự án chưa từng chấm UX trên trang này *(Cổng 4 chỉ chấm Trang chủ)*.

Không phải app *(không có `data-surface="app"`)*, một bề mặt: không soát mục App mobile và luồng xuyên bề mặt.

### Tài liệu
- `DESIGN.md`: đếm lại chỗ dùng bằng `grep` *(sửa `_system.html` `.field-err` 3 → 2; thêm dòng Chỗ dùng nút)*; ghi phần của lần tweak còn thiếu: icon `phone` *(mục 4)*, hàng `.info-cta` *(mục 6)*, nút Gọi ở section 4 *(mục 9)*, một dòng Lịch sử. Không có token mới.

### Lỗi còn lại
Bộ kiểm: **0 lỗi**. Ghi chú soát tay, không chặn:
1. `site/_system.html:372`: mẫu khối giờ mở trên trang design system chưa theo lần tweak: chỉ một nút Xem đường đi với `style="margin-top:20px"`, không có nút Gọi, hàng `.info-cta` và icon `phone`.
2. `BUILD-LOG.md` dòng Trang chủ ghi dấu `646868ff9a`; `site/index.html` hiện là `03f3d1b030` *(đổi bởi tweak và evolve, sổ chưa ghi lại)*. Lần sau `sketch-to-site` làm tiếp sẽ đánh trang này là `chặn`.
3. Nút Gọi chưa có bước kiểm hành vi riêng *(ledger dòng 1: 0 `check` đổi)*; bộ khói vẫn đo console, tràn, cắt, tương phản trên khối đó ở 1440, 768, 390.
