Một lần đo riêng bản **2.4** của `db-schema-design` trên đề `db-r1` (lượt cập nhật). Không chạy bản cũ; so với số đã có: trung bình 3 lần bản cũ (0,60M · 9,4 phút · 23 lượt), 2.2 (`rdv22`: 0,56M · 17,8 · 19, D12 rơi), 2.3 (`rdv23`: 0,73M · 12,7 · 22, sửa lan: 30 thay đổi phá vỡ, 15/62 không truy được). Mục tiêu giữ như `PROMPT-DO-2.md`: token và phút ≤ 75 % trung bình cũ, ≤ 14 lượt, 15/15 và 5/5. Mục tiêu thêm của 2.4: **phá vỡ trên bảng cũ ≤ 5** và **không truy được ≤ 3** (mức của 2.2) mà **D12 vẫn đạt**.

Khác với `PROMPT-DO-4.md`, chỉ ở chỗ:
- Bản đo: `<SP>/v24/db-schema-design` chép từ `.claude/skills/db-schema-design/` (bản 2.4, 142 test, bỏ `__pycache__`).
- Thư mục chạy `<SP>/rdv24`; prompt chạy **nguyên văn** bước 4 của `PROMPT-DO-2.md`, thay `<SK>` = `<SP>/v24`, `<skill>` = `db-schema-design`, `<DIR>` = `<SP>/rdv24`.
- Ghi riêng thêm: dòng "Phá vỡ trên bảng cũ" của khối cổng agent thấy bao nhiêu và có hoàn lại không; khối "NỢ CŨ TRÊN PHẦN VỪA SỬA" có mấy mục, agent xử lý thế nào; lượt mất cache (đọc cache 0k) nếu có, để tách khỏi số thô; ký tự/giây.
- Ghi kết quả: README mục *db-schema-design 2.4: đo một lần*, `CHANGELOG.md` (cả `.claude` và `.agents`), `transcripts/db-r1-v24/`, `runs-db-r1-v24/rdv24/`. Không sửa skill, không commit.
