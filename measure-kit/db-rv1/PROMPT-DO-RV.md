Đo **db-schema-review** (soát schema có sẵn, chỉ đọc) — bản 2.7 với bản 2.8, mỗi bản **một lần**, chạy song song một cặp. Đề mới `db-rv1`: soát bản v4.4 làm dở (56 bảng) của một dự án thật, cùng tài liệu requirement. Dữ liệu dự án không nằm trong repo này; chỉ có băm sha256 các file chỉ-đọc ở `golden.json`.

## Hai bản

| | thư mục skill | thư mục chạy | nội dung |
|---|---|---|---|
| **2.7** (mốc) | `<SP>/v27p` | `<SP>/rvc27` | bản 2.7 nguyên vẹn, **chỉ thêm một sửa**: `npx` ghim `@dbml/{cli,core,parse,connector}@10.2.0` (bản 10.3.0 phát hành sáng 07/10/2026 làm cổng cú pháp báo lỗi giả trên Windows; bản 2.7 không ghim thì cả lần đo hỏng). Mọi thứ khác giống hệt |
| **2.8** | `<SP>/v28` | `<SP>/rvn28` | `.claude/skills/` hiện tại (173 test): `report.py --limit/--top` cho `--rule` và `--new`; `report.py --review-md`; `check.py --review` (tự tính lại mốc, giữ `_check/schema.sql`, số liệu cấu trúc, lời hứa composite chưa thực hiện); `db-schema-review/SKILL.md` viết lại theo luồng này; ghim `npx` như trên |

Hai thư mục chạy chép từ `<SP>/rvbase` (bản đóng băng `docs/database/` + `1-yeu-cau/` lúc 07/10/2026, băm ở `<SP>/rvbase.sha256`): `_check/` còn mốc nợ cũ do bản skill cũ ghi — đúng tình huống thật, bản 2.7 phải tự biết `rebaseline`.

## Mục tiêu (định trước khi chạy)

So 2.8 với 2.7 trên **cùng một đề**. Mỗi bản một lần nên mọi vế chỉ ghi **đạt** khi thấp hơn ≥ 25 %; thấp hơn nhưng chưa tới 25 % ghi *chưa kết luận*.

| Thước | Mục tiêu |
|---|---|
| Token quy đổi (`parts2.js`) | 2.8 ≤ 75 % của 2.7 |
| Phút (`parts2.js`) | 2.8 ≤ 75 % của 2.7 |
| Số lượt | 2.8 thấp hơn 2.7 |
| Phát hiện cốt lõi G1–G5 (`score_review.py`) | 2.8 ≥ 2.7, và **không rơi** phát hiện mà 2.7 đạt |
| Số liệu trong báo cáo đúng; không sửa file chỉ-đọc | cả hai bản |

Không có vòng sửa thứ hai; không chạy lại bản nào.

## Chuẩn bị (đã làm)

`<SP>` = `C:/Users/thapnv/AppData/Local/Temp/claude/w--Dummy--Tool--Working-B-i---t-dat-swimming-pool/d1830dc6-4f8a-405a-af86-a6a6fb4371c8/scratchpad`. `rvc27` và `rvn28` là bản chép sạch của `rvbase` (kiểm băm trước khi chạy).

## Chạy

Hai subagent `general-purpose` chạy nền, model mặc định, **cùng lúc**. Prompt chạy **nguyên văn**, thay `<SK>` và `<DIR>` theo bản; không thêm gợi ý nào về skill:

```
Bạn chạy skill soát schema CSDL `db-schema-review` trên một dự án mẫu ở <DIR>. Chỉ làm việc trong <DIR> và đọc skill ở <SK>/.

Skill: đọc <SK>/db-schema-review/SKILL.md và làm đúng như khi skill được gọi. Skill dùng scripts/ và references/ của <SK>/db-schema-design/. Mọi đường dẫn `.claude/skills/db-schema-design/` hay `.claude/skills/db-schema-review/` trong skill nghĩa là <SK>/db-schema-design/ hay <SK>/db-schema-review/. Trên Windows truyền đường dẫn dạng C:/… cho lệnh Python và npx.

Việc: soát schema <DIR>/docs/database/schema.dbml (PostgreSQL) cùng tài liệu requirement ở <DIR>/1-yeu-cau/ và từ điển <DIR>/docs/database/DATA-DICTIONARY.md. Bản đã duyệt trước đó là <DIR>/docs/database/_check/last-green.dbml, báo cáo soát của bản đó là <DIR>/docs/database/SCHEMA-REVIEW-v4.3.md.

Quy tắc của lần đo này:
- Bạn không hỏi lại tôi: coi như BA vắng mặt. Câu cần BA quyết ghi trong báo cáo, nhóm "cần quyết định".
- Chỉ đọc: không sửa schema.dbml, schema-lint.json, DATA-DICTIONARY.md, schema.html. Chỉ được ghi vào <DIR>/docs/database/_check/ và file báo cáo.
- Không dùng chế độ soát độc lập bằng subagent, không vẽ sơ đồ ERD.
- Ghi báo cáo vào <DIR>/docs/database/SCHEMA-REVIEW-v4.4.md bằng công cụ Write hay Edit, thẳng vào đúng đường dẫn này.
- Báo tôi bằng tối đa 8 dòng: điều bạn chưa chắc, file đã ghi.
```

Ghi giờ bắt đầu và kết thúc từng lần. Đừng đoán kết quả khi subagent chưa báo xong.

## Chấm và đo (sau khi cả hai báo xong)

1. Chấm: `cd measure-kit/db-rv1 && python test_score_review.py` qua hết **trước**; rồi `python score_review.py <SP>/rvc27` và `<SP>/rvn28`. Đọc cả hai báo cáo: lời nào sai sự thật (so với lệnh trong thư mục chạy), số nào gõ tay mà lệch `_check/report.json`, phát hiện nào regex tính đạt mà thực ra không (hay ngược lại). Chấm tay ghi riêng, kèm lý do.
2. Chi phí: transcript hai subagent ở `C:/Users/thapnv/.claude/projects/<dự-án>/<session-id>/subagents/agent-<id>.jsonl`. `node parts2.js <hai jsonl>` (lượt, token quy đổi, phút), `node turns.js`, `node times.js` (lượt tốn nhất, nghỉ > 5 phút). Ghi riêng: số lệnh `Bash`, số lần chạy `check.py`, số lệnh `report.py` và dòng chúng in, lệnh tự viết Python/đọc `report.json`, số lần `rules.py`, số `Read`/ký tự tài liệu skill đã đọc, báo cáo cuối dài bao nhiêu ký tự và viết bằng mấy lệnh `Write`/`Edit`.
3. Bảng một dòng mỗi bản: lượt · token · phút · G1–G5 · X1–X5 · số liệu · chỉ-đọc · độ dài báo cáo; rồi bảng so 2.8/2.7 kèm tỉ lệ; từng vế mục tiêu **đạt / chưa kết luận / không đạt**.
4. Đánh giá nói thẳng, không chỉnh số: chi phí nằm ở đâu ở mỗi bản; 2.8 có dùng `--review`, `--review-md`, `--limit` không và có theo luồng R0–R3 không; chỗ nào skill chỉ sai; phát hiện nào rơi và vì sao. Ghi rõ: **mỗi bản một lần chạy**, đề do chính người viết skill dựng, G1–G5 là kết quả soát của chính người viết nên có thể thiên về bản mới.
5. Ghi: `measure-kit/README.md` mục *db-rv1: soát schema có sẵn (07/10/2026)*; `CHANGELOG.md` của skill (mục `Đo chi phí`, cả `.claude/` và `.agents/`); chép transcript nén vào `transcripts/db-rv1/` và thư mục chạy (không kèm `_check/schema.sql`, `schema.html`) vào `runs-db-rv1/` **trừ dữ liệu dự án**: chỉ giữ `SCHEMA-REVIEW-v4.4.md` và `_check/report.json`. Không sửa skill, không commit.
