Một lần đo riêng bản **2.5** của `db-schema-design` trên đề `db-r1` (lượt cập nhật). Không chạy bản cũ; so với số đã có: trung bình 3 lần bản cũ (0,60M · 9,4 phút · 23 lượt), 2.4 (`rdv24`: 0,68M · 12,7 · 25, 15/15 + 5/5, phá vỡ trên bảng cũ 3, không truy được 0). Mục tiêu giữ như `PROMPT-DO-5.md`: token và phút ≤ 75 % trung bình cũ, ≤ 14 lượt, 15/15 và 5/5, phá vỡ trên bảng cũ ≤ 5, không truy được ≤ 3, D12 đạt.

Khác với `PROMPT-DO-5.md`, chỉ ở chỗ:
- Bản đo: `<SP>/v25/db-schema-design` chép từ `.claude/skills/db-schema-design/` (bản 2.5, 146 test, bỏ `__pycache__`).
- Thư mục chạy `<SP>/rdv25`; prompt chạy **nguyên văn** bước 4 của `PROMPT-DO-2.md`, thay `<SK>` = `<SP>/v25`, `<skill>` = `db-schema-design`, `<DIR>` = `<SP>/rdv25`.
- Ghi riêng thêm: có dùng `--suggest-config --requirements` không, `schema-lint.json` ghi mấy lần; có Grep `references/` tìm cú pháp không; còn vòng sửa qua lại giữa `DB-SCL-03` và `DB-IDX-01` không; `check.py` kiểm mấy lần; lượt mất cache nếu có.
- Ghi kết quả: README mục *db-schema-design 2.5: đo một lần*, `CHANGELOG.md` (cả `.claude` và `.agents`), `transcripts/db-r1-v25/`, `runs-db-r1-v25/rdv25/`. Không sửa skill, không commit.
