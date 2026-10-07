Một lần đo riêng bản **2.2** của `db-schema-design` trên đề `db-r1` (lượt cập nhật), để xem token và thời gian. Không chạy bản cũ; so với số đã có: trung bình 3 lần bản cũ (`rdc1`, `rdc2`, `rdc3`: 0,60M · 9,4 phút · 23 lượt), bản 2.0 (2 lần: 1,26M · 17,2 phút · 40 lượt), bản 2.1 (`rdn1`: 0,835M · 13,4 phút · 33 lượt). Mục tiêu giữ như `PROMPT-DO-2.md`: token và phút ≤ 75 % trung bình cũ, ≤ 14 lượt, 15/15 và 5/5.

Khác với `PROMPT-DO-2.md`, chỉ ở chỗ:
- Bản đo: `<SP>/v22/db-schema-design` chép từ `.claude/skills/db-schema-design/` (bản 2.2, 135 test, bỏ `__pycache__`).
- Một lần chạy, thư mục `<SP>/rdv22`, một subagent `general-purpose` chạy nền, model mặc định.
- Prompt chạy: **nguyên văn** bước 4 của `PROMPT-DO-2.md`, thay `<SK>` = `<SP>/v22`, `<skill>` = `db-schema-design`, `<DIR>` = `<SP>/rdv22`.
- Chấm: `score.py` + `pg_load.py` (bộ chấm đóng băng, như lần trước). Chi phí: `parts2.js`, `turns.js`, `times.js`, `groupcost.js`; ghi riêng số lần `check.py`, có dùng `--update-dictionary` và `report.py` không, số lượt dò `report.json` bằng Python tự viết, số lệnh `Edit` lên `schema.dbml`, số lần đọc lại từ điển.
- Ghi kết quả: README mục *db-schema-design 2.2: đo một lần*, `CHANGELOG.md` (cả `.claude` và `.agents`), transcript nén ở `transcripts/db-r1-v22/`, `docs/` ở `runs-db-r1-v22/rdv22/`. Không sửa skill, không commit.
