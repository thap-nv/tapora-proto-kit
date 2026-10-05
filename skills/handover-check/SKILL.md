---
name: handover-check
description: >-
  Kiểm tổng một lần trước khi bàn giao, gửi link hay commit prototype, sau nhiều lần sửa bằng tweak-site hoặc evolve-site. Chạy đủ bộ kiểm ở mọi theme, so với mốc bàn giao trước, gán từng khác biệt cho một lần sửa trong nhật ký, soát UX 12 điểm trên các màn đã đụng, cập nhật tài liệu một lần, rồi hỏi nghiệm thu và nâng mốc. Chỉ báo lỗi, không tự sửa mã prototype. KHÔNG dùng để kiểm sau từng lần sửa (đó là lệnh kiểm nhanh của tweak-site). Gọi khi người dùng nói "kiểm trước bàn giao", "kiểm tổng", "chạy lại kiểm tra trước khi bàn giao".
---

# Handover Check · Kiểm tổng trước bàn giao

> **v1.3 (05/10/2026)** · Ít lượt: B1 đọc nhật ký bằng một lệnh `handover.py ledger`; B3 chạy tổng bằng một lệnh `qa-check.py` *(cài hoặc cập nhật bộ kiểm, chạy tổng, in kết quả gọn và tên từng ảnh)*; bảng UX và luật sửa in đúng mục. Lịch sử phiên bản ở `CHANGELOG.md` của kit.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này. Trên Windows, đường dẫn đưa cho `node` và `python` viết có ổ đĩa và gạch xuôi (`W:/…`), không viết kiểu Git Bash `/w/…`: hai chương trình này không đọc được. Lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh: console Windows (cp1252) dừng giữa chừng với `UnicodeEncodeError`.
> Lệnh dưới đây là của bộ kiểm trong `<skills>/sketch-to-site/templates/qa-kit/`. Lệnh `python _qa/…` chạy từ thư mục prototype, tức thư mục chứa `_qa/`. Dự án ghi lệnh riêng trong `AGENTS.md` hoặc `CLAUDE.md` thì theo đó.

## 1. Mốc và nhật ký

| Thứ | Ở đâu | Ai ghi |
|---|---|---|
| Mốc bàn giao | `_qa/last-green/` (kết quả từng bộ, từng theme, kèm băm từng file) | `handover.py promote`, chỉ sau khi người dùng chốt |
| Mốc cuốn chiếu | `_qa/current/` | `quick.py` sau mỗi lần sửa chạy sạch |
| Nhật ký lần sửa | `_qa/current/ledger.jsonl`, mỗi lần sửa một dòng: ghi chú, file đổi, `check` đổi | `quick.py --note` |

Khác biệt giữa lần chạy tổng và `last-green` chỉ hợp lệ khi **gán được** cho một dòng nhật ký. Không gán được là lỗi lan, hoặc là sửa mà không chạy kiểm nhanh.

**Ít lượt.** Mỗi lượt đọc lại cả ngữ cảnh. Lệnh và lần đọc **không phụ thuộc nhau** thì gọi chung một lượt; ảnh cần xem thì mở mọi ảnh trong một lượt; tài liệu của skill khác in bằng lệnh `sed` ghi ở bước dùng nó, không đọc cả file. Không đọc mã của script để biết cách dùng: cách gọi, kết quả và mã thoát ghi ở đây.

## 2. Quy trình

### B0 · Dự án chưa có bộ kiểm *(chỉ lần đầu)*
Thấy `_qa/handover.py` rồi thì sang B1 *(lệnh của B1 cập nhật script)*.

Không thấy `_qa/handover.py`:
1. Sang thẳng B3. `qa-check.py` thấy chưa có `_qa/qa.config.json` thì cài bộ kiểm *(`qa_init.py`: chép script vào `_qa/`, sinh `qa.config.json` với mỗi trang một bộ khói ở 1440, 768, 390, màn app ở 1440 và 390, và `_qa/.gitignore`)* rồi chạy tổng.
2. Đọc dòng cấu hình và các CẢNH BÁO lệnh in, sửa `qa.config.json` cùng người dùng:
   - web app thì `preflight_kind` là `app`;
   - site có `site/assets/themes.json` thì lệnh đã lấy theme từ đó; theme thêm sau đó thì `--update` in dòng cần thêm vào `themes`;
   - site có nền tối thì lệnh đã tự thêm theme `light` và `dark`; theme khác thì khai báo ở `themes`, mỗi theme kèm tham số URL bật nó, theme đầu là mặc định;
   - CẢNH BÁO cho trang đọc tham số URL mà chưa có mẫu: thêm `<meta name="qa-query">` theo dòng đó;
   - bước tự đổi giá trị giữa các lần chạy (đồng hồ, số ngẫu nhiên) ghi vào `noisy`.
3. Đã sửa cấu hình hay trang thì chạy lại B3. Chưa có mốc nên mọi thứ là "bộ mới"; tràn ngang được liệt kê để người dùng xác nhận là cố ý.
4. Qua cổng như bình thường. Chốt thì `promote` thành mốc đầu.
5. Thêm khối lệnh kiểm vào `AGENTS.md` hoặc `CLAUDE.md` của dự án, theo mẫu `<skills>/sketch-to-site/templates/AGENTS-qa.md`.

Bộ kiểm khói chỉ bắt lỗi console, tràn ngang, chữ tràn hoặc bị cắt trong khung, và chụp ảnh. Kiểm hành vi (bấm, lọc, phân quyền) thì viết thêm file `_qa/steps-<tên>.json` *(định dạng ở phần chú thích đầu `_qa/run_all.py`)* rồi khai báo ở `suites`.

### B1 · Đọc nhật ký *(không chạy trình duyệt)*
Một lượt: `Read` `FEATURE-DECISIONS.md`, cùng lúc với lệnh:
```bash
python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update; cd <thư-mục-prototype> && python _qa/handover.py ledger
```
- `--update` chép đè script của bộ kiểm bằng bản của kit đang dùng, không đụng cấu hình, file bước, mốc, nhật ký.
- `ledger` in mỗi lần sửa từ lần bàn giao trước một dòng *(giờ, ghi chú, file, số `check` đổi)*, rồi trang sửa trực tiếp, trang chỉ đổi qua file dùng chung, ảnh Hub có trang đã đụng, và file đổi sau lần kiểm nhanh cuối mà chưa vào nhật ký. Dòng `Ảnh Hub` luôn có: không khai báo `thumbs` thì B2 không có ảnh Hub để chụp, khỏi mở `qa.config.json`. Đừng đọc `ledger.jsonl`: nó giữ cả giá trị từng `check`, có thể rất dài.

Rút ra, cùng các dòng của `FEATURE-DECISIONS.md` từ lần bàn giao trước: màn nào đã đụng · dòng nào ghi *chưa có bước kiểm* · màn trong ảnh Hub có đổi không · có tính năng thêm hay bỏ không. File chưa vào nhật ký là sửa ngoài quy trình: xử ở B4.

### B2 · Việc làm đổi site, làm TRƯỚC khi chạy tổng
`promote` từ chối nếu site đổi sau lần chạy, nên mọi thay đổi file phải xong ở bước này:
- Thêm bước kiểm cho các dòng *chưa có bước kiểm*. Bộ nào sinh từ script `gen_*.py` thì sửa script rồi sinh lại.
- Màn trong ảnh Hub đổi *(dòng `Ảnh Hub có trang đã đụng` của `ledger`; ảnh khai báo ở `thumbs` trong `qa.config.json`)* → `python _qa/handover.py thumbs`, rồi mở mọi ảnh lệnh in trong một lượt.
- Tính năng thêm hay bỏ → cập nhật trang tổng quan hoặc bảng đối chiếu yêu cầu của prototype, nếu dự án có.
- Sau bước này, nếu có đổi file → `python _qa/quick.py --note "handover: <việc>"`.

### B3 · Chạy tổng
`python <skills>/sketch-to-site/scripts/qa-check.py <thư-mục-prototype>` *(thêm `--site <thư-mục>` khi trang không nằm ở `site/`)*. Lệnh:
- cài bộ kiểm khi chưa có `_qa/qa.config.json` *(B0)*; có rồi thì chạy `qa_init.py --update`;
- chạy `python _qa/handover.py run`: preflight và mọi bộ ở mọi theme khai báo trong `qa.config.json`, lượt kiểm sâu, chụp ảnh ở mọi theme, so với `_qa/last-green/`, gán từng khác biệt cho một dòng nhật ký. Kết quả nằm trong `_qa/handover/<ngày-giờ>/` *(dòng `Thư mục chạy`)*;
- in dòng số theo theme, mỗi danh sách tối đa 15 dòng *(đủ danh sách ở `handover.json` của thư mục chạy)*, kết luận, rồi thư mục ảnh và tên từng ảnh.

Thoát 0 khi sạch, 1 khi còn lỗi hay khác biệt không gán được, 2 khi thiếu thư mục trang, 4 khi không có trình duyệt. Lệnh mất nhiều phút: gọi với thời gian chờ dài nhất công cụ cho phép *(Claude Code: `timeout` 600000)*. Vẫn hết giờ thì chạy nền và chờ báo xong, không thăm dò.

### B4 · Đọc kết quả

| Mục trong kết quả | Làm gì |
|---|---|
| **Lỗi**: console, FAIL, im lặng, tràn ngang mới, chữ tràn hoặc bị cắt mới trong khung, preflight | Lỗi thật. Ghi lại, tìm lần sửa gây ra, **không tự sửa** |
| **Tương phản, ý định, sâu** mới *(trạng thái, bàn phím, tương tác)* | Lỗi thật, như dòng Lỗi. Tìm lần sửa gây ra, **không tự sửa** |
| **Nợ cũ** | Có từ trước khi kit đo mục này, hoặc bộ mới mang lỗi đã có ở bộ khác trong mốc. Không chặn `promote`. Kết quả đã gộp: mỗi mục một dòng, `×n` khi gặp ở nhiều bước, khổ, theme *(đủ danh sách trong `handover.json`)*. Liệt kê theo nhóm ở cổng và hỏi |
| **Lượt sâu** | Dòng `Lượt sâu: n bộ (…)` nói bộ nào đã kiểm sâu. Có dòng `Lượt sâu không chạy` thì nêu lý do ở cổng: khi đó `sâu mới 0` không có nghĩa là sạch |
| **Khác biệt đã gán** cho một lần sửa | Đọc lướt: giá trị mới có khớp ghi chú của lần sửa đó không. Không khớp → coi như chưa gán |
| **Khác biệt không gán được** | Chạy lại riêng bộ đó một lần để loại nhiễu: `python _qa/run_all.py _qa/.recheck <tên bộ>`. Còn lệch → lỗi lan. Tìm lần sửa gây ra: file đổi của trang đó giao với nhật ký. Nếu các lần sửa đã commit riêng thì chạy bộ đó trên commit cũ bằng `git worktree` |
| **File không có trong ledger** | Có người sửa ngoài quy trình. Xem `git diff` của file đó rồi xếp vào một trong hai loại trên |
| **Bộ mất** | Bộ có ở mốc mà lần này không chạy. Hỏi vì sao trước khi chốt |

Mọi mục đều in kể cả khi bằng 0: `nợ cũ n` ở dòng của từng theme, các dòng `Bộ mới`, `Bộ có trong last-green mà lần này không chạy`, `Khác biệt KHÔNG gán được`, `Nợ cũ`, `Lỗi`. Bảng số của B6 lấy từ đó, không cần mở `handover.json`. Danh sách bị cắt ở 15 dòng: phần còn lại tìm trong `handover.json` của thư mục chạy bằng `grep`, chỉ khi cần cho một mục cụ thể.

### B5 · UX 12 điểm, một lần
Chấm gì, theo từng dòng nhật ký từ lần bàn giao trước *(ghi chú bắt đầu bằng `tweak:` hay `evolve:`; cấp của đợt `evolve-site` ở `FEATURE-DECISIONS.md`)*:
- phần của mọi lần `tweak` và của đợt `evolve-site` Cấp 0–1 *(hai skill này dồn UX sang đây)*, kể cả khi trang chứa nó sau đó có đợt `evolve-site`: đợt đó chỉ soát phần của nó;
- phần của đợt `evolve-site` Cấp 2–3: bỏ, đã chấm ở Cổng 3 của đợt đó;
- không chấm `_system.html`: trang design system, không phải màn của khách.

Không còn phần nào phải chấm thì ghi lý do vào `QA.md`, không in bảng. Còn thì in bảng: `sed -n '/^### Nhóm F/,/^### Nhóm G/p' <skills>/evolve-site/references/regression-qa.md`. Mỗi điểm ✅ hoặc ❌, kèm `file:dòng` *(tìm bằng `grep -n`, không in cả file)*. Kết quả 7–9/12: đưa vào danh sách cần sửa. Ảnh của màn đã đụng: lát có tiêu đề trong ngoặc của khối đó *(danh sách ảnh của B3 ghi tiêu đề h1–h3 bắt đầu trong từng lát)*, mở mọi ảnh cần trong một lượt.

Màn app mobile *(`<html data-surface="app">`)*: soát thêm mục *App mobile* ở `sketch-to-site/references/qa-gate.md` mục 4 *(in: `sed -n '/^### App mobile/,/^## 5\./p' <skills>/sketch-to-site/references/qa-gate.md`)* trên các màn đó. Hệ thống nhiều bề mặt: đi lại mọi dòng của bảng luồng xuyên bề mặt có dính tới màn đã đụng.

### B6 · Tài liệu, một lần
- `DESIGN.md`: số chỗ gọi component dùng chung, **đếm bằng `grep`**; token mới đã duyệt mà chưa ghi.
- `_qa/QA.md`: **một** mục "Bàn giao <ngày>" gồm:
  - thư mục chạy;
  - bảng số cho từng theme: bộ, bước, console, FAIL, tràn, cắt, tương phản, ý định, sâu, `check` đổi, nợ cũ;
  - danh sách lần sửa lấy từ nhật ký, mỗi lần kèm các `check` đổi;
  - kết quả UX;
  - lỗi còn lại.

### 🛑 Cổng · Nghiệm thu bàn giao
Báo cáo bằng số thật: dòng tổng của từng theme, số lần sửa, số khác biệt đã gán và chưa gán, lỗi kèm lần sửa gây ra, UX, link mở `index.html`. Hỏi bằng `AskUserQuestion`:
- Không có lỗi: **Chốt bàn giao (Khuyến nghị)** · **Sửa trước** *(nói điểm cần sửa)*.
- Có lỗi: **Sửa lỗi rồi kiểm lại (Khuyến nghị)** *(liệt kê)* · **Chốt, để lỗi lại** *(ghi vào QA.md là lỗi đã biết)*.
- Có **nợ cũ**: hỏi thêm một câu trong cùng lượt: **Nhận nợ cũ vào mốc** *(promote; lần sau chỉ chặn lỗi mới)* · **Sửa trước** *(liệt kê theo nhóm: tương phản, ý định, trạng thái, bàn phím, tương tác, console lượt sâu)*.

Không có công cụ `AskUserQuestion` *(ví dụ Codex)*: viết câu hỏi và các lựa chọn đánh số ra tin nhắn. Hỏi xong thì **kết thúc lượt**. Im lặng không phải đồng ý.

### B7 · Sau khi người dùng trả lời
- **Nhận nợ cũ** → ghi vào mục "Bàn giao <ngày>" của `QA.md` là nợ đã nhận, kèm số mục từng nhóm.
- Ghi lời người dùng **nguyên văn** vào `DECISIONS.md`, bảng "Lặp lại sau nghiệm thu".
- **Chốt** → `python _qa/handover.py promote _qa/handover/<ngày-giờ>`. Lần chạy đó thành mốc bàn giao mới, nhật ký chuyển vào thư mục chạy, `current` làm lại từ đầu.
- **Sửa** → soát danh sách theo `sketch-to-site/references/rules-and-conflicts.md` mục F *(in: `sed -n '/^## F\./,$p' <skills>/sketch-to-site/references/rules-and-conflicts.md`)*, sửa bằng `tweak-site` hoặc `evolve-site` tuỳ cấp, rồi quay lại **B3** (chạy tổng lại, vì `promote` cần một lần chạy khớp với file hiện tại).
- Không tự commit. Có thể gợi ý commit sau khi promote.
- Thư mục `_qa/handover/` cũ hơn lần vừa chốt có thể xoá cho nhẹ đĩa. Hỏi người dùng trước khi xoá.
