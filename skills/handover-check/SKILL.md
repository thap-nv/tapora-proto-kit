---
name: handover-check
description: >-
  Kiểm tổng một lần trước khi bàn giao, gửi link hay commit prototype, sau nhiều lần sửa bằng tweak-site hoặc evolve-site. Chạy đủ bộ kiểm ở mọi theme, so với mốc bàn giao trước, gán từng khác biệt cho một lần sửa trong nhật ký, soát UX 12 điểm trên các màn đã đụng, cập nhật tài liệu một lần, rồi hỏi nghiệm thu và nâng mốc. Chỉ báo lỗi, không tự sửa mã prototype. KHÔNG dùng để kiểm sau từng lần sửa (đó là lệnh kiểm nhanh của tweak-site). Gọi khi người dùng nói "kiểm trước bàn giao", "kiểm tổng", "chạy lại kiểm tra trước khi bàn giao".
---

# Handover Check · Kiểm tổng trước bàn giao

> **v1.1 (29/09/2026)** · B7: soát danh sách sửa theo `sketch-to-site/references/rules-and-conflicts.md` mục F trước khi sửa.
> **v1.0 (28/09/2026)** · Đi cùng `tweak-site` và `evolve-site`. Mỗi lần sửa chỉ kiểm nhanh các bộ bị ảnh hưởng; skill này bắt phần còn lại một lần: lỗi lan sang trang mà lần kiểm nhanh không chạy, theme thứ hai, UX, tài liệu.
> Lệnh dưới đây là của bộ kiểm trong `<skills>/sketch-to-site/templates/qa-kit/` (`<skills>` là thư mục cha của thư mục chứa SKILL.md này). Chạy từ thư mục prototype, tức thư mục chứa `_qa/`. Dự án ghi lệnh riêng trong `AGENTS.md` hoặc `CLAUDE.md` thì theo đó.

## 1. Mốc và nhật ký

| Thứ | Ở đâu | Ai ghi |
|---|---|---|
| Mốc bàn giao | `_qa/last-green/` (kết quả từng bộ, từng theme, kèm băm từng file) | `handover.py promote`, chỉ sau khi người dùng chốt |
| Mốc cuốn chiếu | `_qa/current/` | `quick.py` sau mỗi lần sửa chạy sạch |
| Nhật ký lần sửa | `_qa/current/ledger.jsonl`, mỗi lần sửa một dòng: ghi chú, file đổi, `check` đổi | `quick.py --note` |

Khác biệt giữa lần chạy tổng và `last-green` chỉ hợp lệ khi **gán được** cho một dòng nhật ký. Không gán được là lỗi lan, hoặc là sửa mà không chạy kiểm nhanh.

## 2. Quy trình

### B0 · Dự án chưa có bộ kiểm *(chỉ lần đầu)*
Không thấy `_qa/handover.py`:
1. `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype>`. Lệnh chép script vào `_qa/`, sinh `qa.config.json` (mỗi trang một bộ khói ở 1440, 768, 390; màn app ở 1440 và 390) và `_qa/.gitignore`.
2. Đọc `qa.config.json` cùng người dùng:
   - web app thì `preflight_kind` là `app`;
   - site có nền tối thì lệnh đã tự thêm theme `light` và `dark`; theme khác thì khai báo ở `themes`, mỗi theme kèm tham số URL bật nó, theme đầu là mặc định;
   - lệnh in CẢNH BÁO cho trang đọc tham số URL mà chưa có mẫu: thêm `<meta name="qa-query">` theo dòng đó;
   - bước tự đổi giá trị giữa các lần chạy (đồng hồ, số ngẫu nhiên) ghi vào `noisy`.
3. Chạy B3. Chưa có mốc nên mọi thứ là "bộ mới"; tràn ngang được liệt kê để người dùng xác nhận là cố ý.
4. Qua cổng như bình thường. Chốt thì `promote` thành mốc đầu.
5. Thêm khối lệnh kiểm vào `AGENTS.md` hoặc `CLAUDE.md` của dự án, theo mẫu `<skills>/sketch-to-site/templates/AGENTS-qa.md`.

Bộ kiểm khói chỉ bắt lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung, và chụp ảnh. Kiểm hành vi (bấm, lọc, phân quyền) thì viết thêm file `_qa/steps-<tên>.json` rồi khai báo ở `suites`.

### B1 · Đọc nhật ký *(không chạy gì)*
- `_qa/current/ledger.jsonl`, và các dòng trong `FEATURE-DECISIONS.md` từ lần bàn giao trước.
- Rút ra: màn nào đã đụng · dòng nào ghi *chưa có bước kiểm* · màn trong ảnh Hub có đổi không · có tính năng thêm hay bỏ không.

### B2 · Việc làm đổi site, làm TRƯỚC khi chạy tổng
`promote` từ chối nếu site đổi sau lần chạy, nên mọi thay đổi file phải xong ở bước này:
- Thêm bước kiểm cho các dòng *chưa có bước kiểm*. Bộ nào sinh từ script `gen_*.py` thì sửa script rồi sinh lại.
- Màn trong ảnh Hub đổi *(ảnh khai báo ở `thumbs` trong `qa.config.json`)* → `python _qa/handover.py thumbs` rồi mở từng ảnh ra xem.
- Tính năng thêm hay bỏ → cập nhật trang tổng quan hoặc bảng đối chiếu yêu cầu của prototype, nếu dự án có.
- Sau bước này, nếu có đổi file → `python _qa/quick.py --note "handover: <việc>"`.

### B3 · Chạy tổng
`python _qa/handover.py run`, chạy nền vì mất nhiều phút. Lệnh chạy preflight và mọi bộ ở mọi theme khai báo trong `qa.config.json`, chụp ảnh ở mọi theme. Kết quả nằm trong `_qa/handover/<ngày-giờ>/`.

### B4 · Đọc kết quả

| Mục trong kết quả | Làm gì |
|---|---|
| **Lỗi**: console, FAIL, im lặng, tràn ngang mới, chữ tràn hoặc bị cắt mới trong khung, preflight | Lỗi thật. Ghi lại, tìm lần sửa gây ra, **không tự sửa** |
| **Khác biệt đã gán** cho một lần sửa | Đọc lướt: giá trị mới có khớp ghi chú của lần sửa đó không. Không khớp → coi như chưa gán |
| **Khác biệt không gán được** | Chạy lại riêng bộ đó một lần để loại nhiễu: `python _qa/run_all.py _qa/.recheck <tên bộ>`. Còn lệch → lỗi lan. Tìm lần sửa gây ra: file đổi của trang đó giao với nhật ký. Nếu các lần sửa đã commit riêng thì chạy bộ đó trên commit cũ bằng `git worktree` |
| **File không có trong ledger** | Có người sửa ngoài quy trình. Xem `git diff` của file đó rồi xếp vào một trong hai loại trên |
| **Bộ mất** | Bộ có ở mốc mà lần này không chạy. Hỏi vì sao trước khi chốt |

### B5 · UX 12 điểm, một lần
Bảng ở `evolve-site/references/regression-qa.md`, nhóm F. Chấm trên các màn đã đụng từ lần bàn giao trước, **trừ** màn đã chấm trong một đợt `evolve-site` Cấp 2–3. Mỗi điểm ✅ hoặc ❌, kèm `file:dòng`. Kết quả 7–9/12: đưa vào danh sách cần sửa.

Màn app mobile *(`<html data-surface="app">`)*: soát thêm mục *App mobile* ở `sketch-to-site/references/qa-gate.md` mục 4 trên các màn đó. Hệ thống nhiều bề mặt: đi lại mọi dòng của bảng luồng xuyên bề mặt có dính tới màn đã đụng.

### B6 · Tài liệu, một lần
- `DESIGN.md`: số chỗ gọi component dùng chung, **đếm bằng `grep`**; token mới đã duyệt mà chưa ghi.
- `_qa/QA.md`: **một** mục "Bàn giao <ngày>" gồm:
  - thư mục chạy;
  - bảng số cho từng theme: bộ, bước, console, FAIL, tràn, cắt, `check` đổi;
  - danh sách lần sửa lấy từ nhật ký, mỗi lần kèm các `check` đổi;
  - kết quả UX;
  - lỗi còn lại.

### 🛑 Cổng · Nghiệm thu bàn giao
Báo cáo bằng số thật: dòng tổng của từng theme, số lần sửa, số khác biệt đã gán và chưa gán, lỗi kèm lần sửa gây ra, UX, link mở `index.html`. Hỏi bằng `AskUserQuestion`:
- Không có lỗi: **Chốt bàn giao (Khuyến nghị)** · **Sửa trước** *(nói điểm cần sửa)*.
- Có lỗi: **Sửa lỗi rồi kiểm lại (Khuyến nghị)** *(liệt kê)* · **Chốt, để lỗi lại** *(ghi vào QA.md là lỗi đã biết)*.

Không có công cụ `AskUserQuestion` *(ví dụ Codex)*: viết câu hỏi và các lựa chọn đánh số ra tin nhắn. Hỏi xong thì **kết thúc lượt**. Im lặng không phải đồng ý.

### B7 · Sau khi người dùng trả lời
- Ghi lời người dùng **nguyên văn** vào `DECISIONS.md`, bảng "Lặp lại sau nghiệm thu".
- **Chốt** → `python _qa/handover.py promote _qa/handover/<ngày-giờ>`. Lần chạy đó thành mốc bàn giao mới, nhật ký chuyển vào thư mục chạy, `current` làm lại từ đầu.
- **Sửa** → soát danh sách theo `sketch-to-site/references/rules-and-conflicts.md` mục F, sửa bằng `tweak-site` hoặc `evolve-site` tuỳ cấp, rồi quay lại **B3** (chạy tổng lại, vì `promote` cần một lần chạy khớp với file hiện tại).
- Không tự commit. Có thể gợi ý commit sau khi promote.
- Thư mục `_qa/handover/` cũ hơn lần vừa chốt có thể xoá cho nhẹ đĩa. Hỏi người dùng trước khi xoá.
