Một lần đo riêng bản **2.3** của `db-schema-design` trên đề `db-r1` (lượt cập nhật). Không chạy bản cũ; so với số đã có: trung bình 3 lần bản cũ (0,60M · 9,4 phút · 23 lượt), 2.0 (1,26M · 17,2 · 40), 2.1 (`rdn1`: 0,835M · 13,4 · 33), 2.2 (`rdv22`: 0,56M · 17,8 · 19, D12 rơi). Mục tiêu giữ như `PROMPT-DO-2.md`: token và phút ≤ 75 % trung bình cũ, ≤ 14 lượt, 15/15 và 5/5.

Khác với `PROMPT-DO-3.md`, chỉ ở chỗ:
- Bản đo: `<SP>/v23/db-schema-design` chép từ `.claude/skills/db-schema-design/` (bản 2.3, 140 test, bỏ `__pycache__`).
- Thư mục chạy `<SP>/rdv23`; prompt chạy **nguyên văn** bước 4 của `PROMPT-DO-2.md`, thay `<SK>` = `<SP>/v23`, `<skill>` = `db-schema-design`, `<DIR>` = `<SP>/rdv23`.
- Ghi riêng thêm: D12 có lấy lại không; khối "NỢ CŨ TRÊN PHẦN VỪA SỬA" có hiện và agent xử lý thế nào; `schema-lint.json` viết trước hay sau `promote`, có dùng `--suggest-config`, `rebaseline` không; tốc độ ra chữ (ký tự/giây) để đọc số phút.
- Ghi kết quả: README mục *db-schema-design 2.3: đo một lần*, `CHANGELOG.md` (cả `.claude` và `.agents`), `transcripts/db-r1-v23/`, `runs-db-r1-v23/rdv23/`. Không sửa skill, không commit.
