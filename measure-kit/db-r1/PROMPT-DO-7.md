Một lần đo riêng bản **2.6** của `db-schema-design` trên đề `db-r1` (lượt cập nhật). Không chạy bản cũ; so với số đã có: trung bình 3 lần bản cũ (0,60M · 9,4 phút · 23 lượt), 2.5 (`rdv25`: 0,60M · 18,9 · 21, 15/15 + 5/5, phá vỡ trên bảng cũ 1, không truy được 0). Mục tiêu giữ như `PROMPT-DO-6.md`: token và phút ≤ 75 % trung bình cũ, ≤ 14 lượt, 15/15 và 5/5, phá vỡ trên bảng cũ ≤ 5, không truy được ≤ 3, D12 đạt.

Khác với `PROMPT-DO-6.md`, chỉ ở chỗ:
- Bản đo: `<SP>/v26/db-schema-design` chép từ `.claude/skills/db-schema-design/` (bản 2.6, 148 test, bỏ `__pycache__`).
- Thư mục chạy `<SP>/rdv26`; prompt chạy **nguyên văn** bước 4 của `PROMPT-DO-2.md`, thay `<SK>` = `<SP>/v26`, `<skill>` = `db-schema-design`, `<DIR>` = `<SP>/rdv26`.
- Ghi riêng thêm: bộ truy vết có còn báo "chưa có chỗ chứa" cho thứ đã hỏi/cố ý không dựng không; có chạy `report.py --trace`, `check.py --help` không; sổ câu hỏi viết mấy lần; có tra `rules.py --show` mấy lần và gộp mã hay không; lượt mất cache (đọc cache 0k) nếu có; ký tự/giây.
- Ghi kết quả: README mục *db-schema-design 2.6: đo một lần*, `CHANGELOG.md` (cả `.claude` và `.agents`), `transcripts/db-r1-v26/`, `runs-db-r1-v26/rdv26/`. Không sửa skill, không commit.
