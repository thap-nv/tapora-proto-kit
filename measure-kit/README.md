# Bộ đo chi phí sketch-to-concept và sketch-to-site

Phần đầu và các mốc dưới đây là của `sketch-to-concept`. Mốc nền của `sketch-to-site` ở mục cuối: *sketch-to-site: mốc nền*.

Dùng để đo một lần chạy skill `sketch-to-concept` tốn bao nhiêu lượt và token, so với các lần đo trước. Mọi lần đo dùng cùng đề bài *Lò Bánh Củi Cô Ba*, model Opus 5.5, mỗi lần chạy là một subagent `general-purpose` chạy nền.

## Trong thư mục này

| File | Làm gì |
|---|---|
| `parts2.js` | Tổng của một transcript: số lượt, phía vào (ghi cache, đọc cache), output ước tính, token quy đổi, số phút. `node parts2.js <a.jsonl> <b.jsonl> …` |
| `attrib.js` | Chia chi phí theo loại việc (đọc tài liệu, in mục, viết file, chụp, tra font…). Phần ngữ cảnh thêm ở lượt k tính 1,25 lần ghi cache cộng 0,1 lần cho mỗi lượt sau |
| `phase.js` | Chi phí theo giai đoạn (A1–A2, A3 dữ liệu, dựng màn, tự kiểm) và theo từng tài liệu skill. Cách chia giai đoạn dựa vào lệnh Write, có thể lệch: đọc kèm danh sách lượt |
| `fixes.js` | Đếm riêng các chỗ đã sửa: lỗi đường dẫn `/w/…`, đi tìm `source.kind`, số lần chụp, WebSearch/WebFetch, `--vi-fonts`, số lượt, lượt có từ 2 lệnh, `check.mjs --shots`, mục lục họ và 20 phong cách có chung lượt không, `search.py` chạy mấy lần, ToolSearch đứng riêng, `cat` file sẽ sửa, trang HTML thử font. Ba dòng cuối cho đợt sửa thứ tư: lượt đọc `vong-dau.md`, prompt chấm in chung lệnh check, lượt viết màn, lối vào lại một lượt, `roles.mjs` và grep màn, `--vi-fonts` có hay không từ khoá, số lần ra 0 font, kết quả bị cắt giữa, đậm giả. Hai dòng "đợt năm" và "check --round" cho đợt sửa thứ năm: concepts.js có Big Shoulders, trang thử viết bằng heredoc, loại agent chấm, đọc khuôn cùng lượt `cp` và số lệnh còn chép khuôn sẽ điền, `check --round` không kèm `--shots`, `preflight --font`, lượt mất cache và phần tốn thêm |
| `turns.js` | Liệt kê từng lượt: ngữ cảnh lúc vào, phần thêm sau lượt, chi phí ước của lượt, mọi lệnh gọi kèm cỡ kết quả và chữ LỖI. `node turns.js <a.jsonl> [độ rộng lệnh]` |
| `dump.js` | In đầy đủ lệnh và đầu/cuối kết quả của vài lượt. `node dump.js <a.jsonl> 4,5,21 [ký tự đầu] [ký tự cuối]` |
| `times.js` | Thời gian từng lượt: nghĩ bao lâu trước dòng output đầu, viết bao lâu, khoảng cách tới lần gửi kế (đánh dấu `> 5 phút`, tức lượt sau mất cache). Đánh số lượt như `turns.js`. `node times.js <a.jsonl> …` |
| `prompt-phien-sau.md` | Prompt của phiên đo đợt sửa thứ năm (đã dùng 04/10) |
| `r1-board/sample/` | Bảng concept vòng 1 (a, b, c; khuyến nghị c; `DECISIONS.md` chưa có vòng 2) dùng cho mọi lần đo vòng 2. **Chép ra thư mục khác rồi mới chạy**, không chạy thẳng trên bản này |
| `phase-site.js` | sketch-to-site: lượt, token quy đổi, phần mất cache và thời gian theo bước B0, B1, B2, Cổng 3 (pha 1) hoặc B0, B3, B4, Cổng 4 (pha 2), kèm subagent con. `--list` in bước của từng lượt. Cách nhận bước ghi ở đầu file |
| `fixes-site.js` | sketch-to-site: các chỗ có thể sửa (tài liệu đọc nguyên hay một phần, đọc mã script của skill, số lần chạy preflight/themes.mjs/qa_init/handover/run.mjs, chụp, ảnh mở, lượt có từ 2 lệnh, `cat` file sẽ sửa, Write bị từ chối hay `rm` rồi viết lại, `/x/…`, kết quả bị cắt, subagent review và chi phí, lượt mất cache) |
| `groupcost.js` | Chi phí của một nhóm lượt: phí lượt (0,1 × ngữ cảnh + output) và nội dung lượt đó nạp vào, mang tới cuối. `node groupcost.js <a.jsonl> "tên:1,2,5-9" …` |
| `prompt-site-moc-nen.md` | Prompt của phiên đo mốc nền sketch-to-site (đã dùng 04/10) |
| `prompt-site-sau-sua.md` | Prompt của phiên đo sketch-to-site sau 7 đề xuất (bản 4.5), cùng thư mục bắt đầu và prompt chạy như mốc nền |
| `prompt-site-cloud.md` | Như `prompt-site-sau-sua.md`, cho phiên chạy trên Claude Code cloud: bước kiểm môi trường, đường dẫn repo thay cho `W:/…`, lưu transcript và ảnh vào `measure-kit/` rồi push lên nhánh đo. Xem mục *Chạy trên cloud* |
| `paths.js` | Đường dẫn của máy chạy đo, dùng chung cho `phase-site.js`, `fixes-site.js`, `phase-edit.js`, `fixes-edit.js`, `attrib.js`, `turns.js`, `dump.js`. Mặc định là máy Windows của các mốc; máy khác đặt `SKILLS` (thư mục skills của repo) và `RUNS` (thư mục cha của các `<DIR>`). Hai worktree `…/cu/tapora-proto-kit` và `…/moi/tapora-proto-kit` hiện là `<skills:cu>`, `<skills:moi>` |
| `r2-chosen/sample/` | sketch-to-site pha 1: `r1-board` đã chốt Cổng 2 = C, một nền, nhịp như concept (`DECISIONS.md`, `CONCEPT.md`). Chép ra rồi mới chạy |
| `r3-gate3/sample/` | sketch-to-site pha 2: kết quả pha 1 lần A, Cổng 3 đang mở. Chép ra rồi mới chạy |
| `transcripts/site-4.5/` | Transcript của bốn lần đo 4.5 trên cloud (`.jsonl.gz` + `.meta.json`). Xem mục *sketch-to-site: sau 4.5 (cloud)* |
| `runs-4.5/` | Ảnh cả trang `_system.html` (pha 1), ảnh trang chủ 1440 (pha 2) và `DECISIONS.md` của bốn lần đo 4.5 |
| `transcripts/site-4.5-sua/`, `runs-4.5-sua/` | Như hai thư mục trên, cho bốn lần đo lại sau 4 chỗ sửa (05/10). Xem mục *sketch-to-site: sau 4 chỗ sửa (cloud)* |
| `transcripts/site-4.5-cuoi/`, `runs-4.5-cuoi/`, `transcripts/review-4.5/` | Bốn lần đo cuối (05/10) và các review B4 bằng `Explore`. Xem mục *sketch-to-site: đo cuối sau mọi chỗ sửa* |
| `memory-note.md` | Ghi chú tiếng Anh để chép vào memory `token-rollout-plan` |
| `phase-edit.js` | `tweak-site`, `evolve-site`, `handover-check`: lượt, token quy đổi, phần mất cache và thời gian theo bước của từng skill (skill và bản `cu`/`moi` nhận từ prompt). `--list` in bước của từng lượt. Cách nhận bước ghi ở đầu file |
| `fixes-edit.js` | Ba skill sửa: tài liệu đọc nguyên hay một phần, đọc mã script, lệnh của bộ kiểm (`quick.py` có hay không `--shots`, `run_all.py` theo thư mục ra, `handover.py ledger`, `qa-check.py`), tự chụp, ảnh mở theo lượt, `ledger.jsonl` đọc nguyên, lượt mất cache, ba lượt đầu |
| `prompt-edit-cu-moi.md` | Prompt của phiên đo ba skill sửa, bản cũ (`2fbc10d`) so với bản mới (`70bd133`). Xem mục *Ba skill sửa: bản cũ và bản mới* |
| `r4-bangiao/` | Ba skill sửa, kịch bản T: site đã bàn giao (pha 2 lần A của lần đo Windows, Cổng 4 "Chốt.", mốc bàn giao đã promote) trong `sample/`, cộng `AGENTS.md` của dự án. Chép ra rồi mới chạy |
| `r5-sau-tweak/`, `r6-sau-evolve/` | Kịch bản E và H: `r4-bangiao` sau lần tweak `rtm1`, và sau lần evolve `rem1` (đáp án Cổng 3 "Chốt tích hợp." đã ghi). `_qa/current/` bị `.gitignore` của bộ kiểm bỏ qua: commit thì `git add -f` |
| `transcripts/edit-cu-moi/`, `runs-edit/` | Transcript nén của 12 lần đo ba skill sửa, và `FEATURE-DECISIONS.md`, `QA.md`, ảnh chính của từng lần. Xem mục *Ba skill sửa: bản cũ và bản mới* |
| `prompt-edit-sau-sua.md` | Prompt của phiên đo lại ba skill sửa ở bản mới nhất (sau `54b403a`), mỗi kịch bản một lần. Xem mục *Ba skill sửa: sau 6 chỗ sửa* |
| `r4b-bangiao/`, `r5b-sau-tweak/`, `r6b-sau-evolve/` | `r4-bangiao`, `r5-sau-tweak`, `r6-sau-evolve` với bộ kiểm của `54b403a`: `qa_init.py --update` rồi `moc-lf.py`. Chép ra rồi mới chạy |
| `moc-lf.py` | Chuẩn bị thư mục bắt đầu: file bước `_qa/steps-*.json` về xuống dòng LF, và dấu `_qa/…` trong manifest của `last-green`, `current` lấy lại theo file hiện tại. Chỉ dùng cho thư mục đo |
| `transcripts/edit-sau-sua/`, `runs-edit-sau-sua/` | Transcript nén của ba lần đo lại sau `54b403a`, và `FEATURE-DECISIONS.md`, `QA.md`, ảnh chính của từng lần. Xem mục *Ba skill sửa: sau 6 chỗ sửa* |
| `r7-map/` | Đề đo của `sketch-to-map`: `sample/` là thư mục bắt đầu (Cổng 1–2 đã chốt, 7 tài liệu yêu cầu theo khuôn BA), `key.json` là đáp án. **Chép `sample/` ra rồi mới chạy; không chép `key.json`.** Xem mục *sketch-to-map: đề đo r7-map* |
| `mapscore.js` | Chấm bản đồ chức năng của một lần chạy theo đáp án: `node mapscore.js <key.json> <thư-mục-chạy hay features.js hay file .md> [--json] [--all]`. `--selfcheck <key.json> <thư-mục-tài-liệu>` soát chính đáp án |
| `prompt-map-moc-cu.md` | Prompt của phiên đo mốc cũ: `sketch-to-site` B1 ở `66e55cb` đọc đề `r7-map` và lập sơ đồ trang |
| `treetest-prompt.md`, `treescore.js` | Bài thử tìm (tree test): prompt người thử (ba vai a, b, c; subagent `Explore`, cây và việc dán vào prompt) và script chấm: `node treescore.js <viec.json> <kết-quả> …` in thành công, đi thẳng, gần đúng theo việc và theo tầng |
| `flowscan.js` | Quét mã một prototype đã dựng: mỗi trang đếm nút chính, tab, lớp phủ, ô nhập, viền dày, liên kết đá sang trang khác (tách *lối tắt hành động* với *điều hướng*), chỗ tự chuyển trang, và trang đích có đường về không. `node flowscan.js <thư-mục-site> [--json] [--all]` |
| `cloud-setup.sh` | Chuẩn bị máy cho một lần đo, trong một lệnh: kiểm node, python, trình duyệt (Linux chưa có thì cài Chromium), mạng; lấy bản skill cần đo ra worktree ở đúng commit; in dòng biến `SKILLS`, `RUNS`. `bash measure-kit/cloud-setup.sh <moi> [<cu>] [--tests]`. Xem mục *Nhánh `measure` và cách lấy bản skill* |

## Nhánh `measure` và cách lấy bản skill (từ 05/10/2026)

- Bộ đo nằm trên nhánh `measure`. Trên máy Windows, nhánh này mở ở thư mục riêng `W:/Dummy/[Tool] Working/tapora-measure` (git worktree), còn thư mục repo chính giữ nhánh tính năng, nên không phải chuyển nhánh qua lại.
- Không merge `measure` vào `main`, và không đưa code skill vào đây. Nhánh chỉ đổi khi bộ đo đổi: script, đề đo, thư mục bắt đầu, kết quả.
- **Skill đo theo commit.** Bản cần đo phải đã commit, và đo trên cloud thì phải đã push. Chạy `bash measure-kit/cloud-setup.sh <moi> [<cu>]`:
  - lệnh lấy bản đó ra worktree tạm `<tmp>/wt/moi/tapora-proto-kit` (và `…/cu/…`);
  - `paths.js` đọc đường dẫn dạng này thành `<skills:moi>`, `<skills:cu>`;
  - mọi lệnh của lần đo dùng thư mục `skills` của worktree, kể cả `node --test`;
  - ghi hash đã đo vào mục kết quả.
- Muốn xem nhanh phần chưa commit (chỉ trên máy) thì cho `SKILLS` trỏ vào thư mục repo chính. Số đo khi đó không gắn với hash nào, nên không dùng làm mốc.
- **Prompt cũ** (`prompt-site-*.md`, `prompt-edit-*.md`) được viết khi skill nằm cùng cây với `measure-kit/`, trên nhánh `measure/site-4.5`.
  - Nhánh đó đã xoá ngày 05/10. Commit cuối của nó, `4c037af`, chỉ sửa skill, và nội dung đã nằm trong `main` qua bản 1.5.0 (`61c7bbd`).
  - Dùng lại prompt cũ thì đổi `$REPO/skills` và `skills/…` thành thư mục `skills` của worktree, và đổi bước kiểm nhánh thành `measure`.
- **Cloud:**
  - Subagent không gọi được subagent con. Skill nào gọi subagent (worker và tree test của `sketch-to-map`, review B4 của `sketch-to-site`) thì mỗi lần đo là **một phiên cloud riêng**, và skill chạy trong phiên chính.
    - Cuối phiên, chép transcript của chính phiên đó (file `.jsonl` mới nhất trong `~/.claude/projects/*/`, không phải thư mục `subagents/`) vào `transcripts/…`, nén bằng `gzip -9`, rồi commit.
    - Skill không gọi subagent con thì chạy như cũ: mỗi lần đo là một subagent chạy nền.
  - So trong cùng môi trường: mốc và bản mới cùng chạy trên cloud, hoặc cùng chạy trên máy Windows.
  - Chỉ commit `measure-kit/`, và push lên `measure` sau **mỗi** lần đo, vì máy cloud bị xoá khi hết phiên. `.claude/settings.json` đã tắt dòng ghi công; vẫn kiểm lại bằng `git log -1 --format=%B`.
- **Lịch sử:** kết quả tới hết ngày 05/10 nằm trên `measure-kit/run-4.5`, nhánh này vẫn giữ trên origin để tra lại. `measure` tạo từ nhánh đó, rồi gỡ `skills/` và các file plugin.

Token quy đổi = input + 1,25 × ghi cache + 0,1 × đọc cache + 5 × output. Transcript chỉ ghi output lúc bắt đầu stream nên output ước từ số ký tự đã viết (2,5–3,5 ký tự một token); khối thinking không tính được.

Transcript của subagent nằm ở `C:/Users/thapnv/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/<session-id>/subagents/agent-<id>.jsonl`, kèm `.meta.json` (mô tả, `parentAgentId` để tìm subagent chấm điểm mà lần chạy vòng 1 gọi).

## Các mốc đã đo (04/10/2026)

| Đợt | Vòng 1: lượt | Vòng 1: token quy đổi (+ subagent chấm) | Vòng 1: phút | Vòng 2: lượt | Vòng 2: token | Vòng 2: phút |
|---|---|---|---|---|---|---|
| Trước 5 đề xuất | 59 | 1,15–1,20M (+0,08) | 21,4 | 25 | 0,46–0,48M | 10,5 |
| Sau 5 đề xuất (W:/, source.kind, clamp, WebSearch, --vi-fonts bỏ thẻ chung) | 54 | 1,01–1,06M (+0,07–0,08) | 19,0 | 26 | 0,51–0,52M | 12,5 |
| Sau gộp lượt, lần A | 19 | 0,76–0,80M (+0,08) | 23,9 | 17 | 0,51–0,52M | 12,3 |
| Sau gộp lượt, lần B | 23 | 0,60–0,64M (+0,05–0,06) | 18,9 | 16 | 0,37–0,39M | 10,2 |
| Sau đợt sửa cuối, lần A | 30 | 0,71–0,76M (+0,07–0,08) | 18,8 | 13 | 0,33–0,35M | 9,6 |
| Sau đợt sửa cuối, lần B | 18 | 0,55–0,59M (+0,05) | 19,0 | 15 | 0,35–0,36M | 10,3 |
| Sau đợt sửa thứ tư, lần A | 17 | 0,63–0,68M (+0,05–0,06); bỏ lượt mất cache: 0,52–0,57M | 17,1 | 16 | 0,42–0,43M | 13,6 |
| Sau đợt sửa thứ tư, lần B | 16 | 0,61–0,65M (+0,08); bỏ lượt mất cache: 0,50–0,55M | 19,2 | 12 | 0,32–0,33M | 10,7 |
| Sau đợt sửa thứ năm, lần A | 18 | 0,72–0,76M (+0,04–0,05, Explore); bỏ lượt mất cache: 0,61–0,65M | 21,1 | 10 | 0,28–0,29M | 11,7 |
| Sau đợt sửa thứ năm, lần B | 16 | 0,63–0,68M (+0,05–0,06, Explore); bỏ lượt mất cache: 0,52–0,57M | 19,5 | 12 | 0,38–0,39M; bỏ lượt mất cache: 0,32–0,33M | 11,8 |

Phút là thời gian thật của transcript, đã gồm subagent chấm. Bốn lần của đợt sửa cuối chạy song song cùng lúc; đợt thứ tư và đợt thứ năm cũng vậy.

Transcript của các mốc:

| Đợt | Session | Vòng 1 (chấm) | Vòng 2 |
|---|---|---|---|
| Trước 5 đề xuất | `ab45d74b-0134-4142-ae93-ea7fa927c323` | `a696f014f35cd1ef7` (`a1d94714b3df3ef32`) | `a4fcb74bf99a55bb7` |
| Sau 5 đề xuất | `5f15f542-56f9-4318-a31f-b06898db2a5a` | `ad6372e96195d1753` (`a376261657a9461e3`) | `a6a01dd97efa0b01f` |
| Sau gộp lượt A | `5f15f542-…` | `a04f25989c7be56fb` (`a4686cdfb06a67672`) | `a11b6884b45521b4a` |
| Sau gộp lượt B | `5f15f542-…` | `a6875603f1dc6bf60` (`adcba7e3f3a39a72c`) | `a789f0571846a56da` |
| Sau đợt sửa cuối A | `eebbe152-3202-4951-ac30-1902a606e2c7` | `a91f82aa301cf9e4a` (`a503ab399664e7708`) | `a61b99f3c9d81e02c` |
| Sau đợt sửa cuối B | `eebbe152-…` | `a26e827f34ba677be` (`a03e0370061bcd3ee`) | `adb33779caa201935` |
| Sau đợt sửa thứ tư A | `ff7a3629-d052-4488-9cd2-558554484b5f` | `a679b904421038eba` (`a4a06c43b5bb433e0`, Explore) | `a517fa993d3676846` |
| Sau đợt sửa thứ tư B | `ff7a3629-…` | `a5cb80a5dda13daf1` (`ab1a727032c2dfd0b`) | `a41672bcce0b930a0` |
| Sau đợt sửa thứ năm A | `1b7ac886-9cbc-4fd8-807e-45b14d24fd23` | `a610b5487c2b1cf4e` (`a01112bde9bf6bafc`, Explore) | `a6c9f8415b7680c2c` |
| Sau đợt sửa thứ năm B | `1b7ac886-…` | `a92c2e86addbea327` (`ab26b5d59708a27fc`, Explore) | `a76f577cc8ebc6c0e` |

Đợt sửa cuối của 04/10 (lệnh 20 phong cách ở A2, lọc `search.py`, nạp WebSearch cùng lượt, sửa màn lỗi console trước khi mở ảnh, vòng mới Read thay cho cat, `VI_FONT_ISSUES`), đo ngay trong ngày:
- Vòng 1 không đổi quá mức dao động: trung bình 0,65M so với 0,70M của đợt trước.
- Vòng 2 cả hai lần đều 0,33–0,36M, ngang lần rẻ của đợt trước. Ca đắt 0,51M (cat 30 KB rồi đọc lại) không lặp lại.
- Đã hết: mục lục họ chạy chung lượt với 20 phong cách, ToolSearch đứng riêng, chọn font trong `VI_FONT_ISSUES`, trang thử font.
- Còn sót:
  - `search.py` chạy lại ở lần B, lượt 4–5. Lý do mới: `--vi-fonts` thoát mã 1 khi một từ khoá không khớp font nào, kết quả gộp thành lỗi và bị cắt ở giữa, mất đúng phần màu.
  - Lần vòng 2 A vẫn `cat DECISIONS.md` một lần ở lượt 2.
- Chưa thử được: không màn nào có lỗi console.

Đợt sửa thứ tư của 04/10 (A1–A3 sang `references/vong-dau.md`, lối vào lại một lượt, `roles.mjs`, `check.mjs` báo đậm giả, `--vi-fonts` không từ khoá, ba màn viết trong một lượt), đo cùng ngày bằng `prompt-phien-sau.md`:
- Đã hết, cả 4 lần:
  - vòng 1 đọc `vong-dau.md` và `concept-method.md` ở lượt 2, cùng lượt kiểm công cụ;
  - `check.mjs` in kèm prompt chấm;
  - ba màn viết trong một lượt, chung lượt với chỗ sửa ý;
  - không mở `concepts.example.js`;
  - vòng 2 vào lại trong một lượt, không grep màn mượn, không `cat`;
  - `--vi-fonts` chỉ chạy không từ khoá, một lệnh, 0 lần ra 0 font;
  - không kết quả nào bị cắt giữa;
  - `search.py` chạy 1 lần.
- Vòng 1, số thô ngang đợt trước (trung bình 0,64M so với 0,65M). Lý do: cả hai lần đều mất cache ở lượt `check --shots` ngay sau lượt viết ba màn. Lượt viết đó nghĩ và viết 6–7 phút, quá TTL 5 phút của subagent, nên phải ghi lại khoảng 138k, tốn thêm khoảng 105–110k mỗi lần. Bỏ khoản này thì còn 0,50–0,57M.
- Vòng 2 ở 0,32–0,43M, trong mức dao động. Big Shoulders (bản thường, không Stencil) cũng đọc *Củi* thành *Cùi*. Cả hai lần vòng 2 đều chọn font này: lần A tốn khoảng 55–60k dựng trang thử rồi giữ font, lần B tốn khoảng 35k đổi sang Oswald rồi chụp lại.
- Agent chấm kiểu Explore khởi đầu ở 23k, general-purpose ở 37k (0,05–0,06M so với 0,08M), đọc cùng nội dung.
- Đậm giả: `check.mjs` không báo lần nào. Không agent nào chọn font chỉ có độ đậm dưới 600 cho vai mà màn đặt đậm.
- Chất lượng: ba màn của mỗi lần vòng 1 vẫn khác nhau rõ và khớp `axes.khung`, không giống nhau hơn đợt trước.
- Ảnh và bảng của bốn lần này nằm trong scratchpad của phiên `ff7a3629-…` (`r1a`, `r1b`, `r2a`, `r2b`), có thể bị dọn.

Đợt sửa thứ năm của 04/10 (Big Shoulders vào `VI_FONT_ISSUES`, agent chấm `Explore`, đọc khuôn cùng lượt `cp` và không chép khuôn sẽ điền, vòng chỉ đổi dữ liệu chạy thẳng `--round <n> --shots`, không `--font` chỉ để xem độ đậm), đo cùng ngày bằng `prompt-phien-sau.md`, phiên `1b7ac886-…`:
- Đã hết, cả 4 lần:
  - không lần nào chọn Big Shoulders; không trang thử font, kể cả heredoc;
  - hai lần vòng 1 đều gọi agent chấm `Explore`: khởi đầu 24k, 3 lượt, 0,04–0,06M;
  - đọc ba khuôn cùng lượt `cp` (lượt 5), 0 lệnh chép khuôn sẽ điền, không Write nào lỗi vì chưa Read;
  - vòng 2 không chạy `check --round` riêng; 0 lệnh `preflight --font`;
  - các chỗ của đợt thứ tư vẫn giữ: `vong-dau.md` và `concept-method.md` ở lượt 2, prompt chấm in kèm lệnh check, ba màn viết ở một lượt (lượt 9), vòng 2 vào lại ở lượt 2, `--vi-fonts` không từ khoá, 0 lần ra 0 font, không kết quả bị cắt.
- Vòng 2: trung bình 0,34M thô, 0,30M khi bỏ lượt mất cache (đợt trước 0,375M, gồm 35–60k cho Big Shoulders). Concept khuyến nghị của hai lần là Nunito và Phudu (chữ hoa); ảnh 1440 đọc đúng *Củi*.
- Vòng 1: số thô 0,72–0,76M và 0,63–0,68M, bỏ lượt mất cache 0,61–0,65M và 0,52–0,57M; lần B ngang đợt trước, lần A đắt hơn khoảng 0,08M vì:
  - lượt 1 không có cache (lần chạy được khởi động đầu tiên, khoảng 28k);
  - `check.mjs` báo nhầm đậm giả ở lượt 13: `roles.mjs` không đọc `style="font-family:var(--font-body)"` nên coi `<h1>` là Vina Sans 400, thêm một lượt sửa và chụp lại (khoảng 24k);
  - đổi khuyến nghị A sang C ở cuối, thêm một lượt kiểm.
- Mất cache: cả hai lần vòng 1 ở lượt 10, sau lượt 9 viết ba màn (nghĩ 319 s và 254 s, viết 147 s và 150 s; tốn thêm 107–115k). Vòng 2 B ở lượt 5, sau lượt 4 viết dữ liệu ba concept (nghĩ 401 s, tính tương phản trong đầu; tốn thêm 66k). Vòng 2 A suýt mất: lượt 3 nghĩ 279 s.
- Lượng nghĩ (đo gián tiếp bằng độ dài chữ ký thinking) ngang đợt trước: 155–227k so với 143–206k.
- Còn sót:
  - Vina Sans: cả hai lần vòng 1 chọn cho vai display; theo báo cáo của agent, dấu huyền trên *ì* thành gạch ngang (*Mì* thành *Mī*) và chữ unicase khó đọc tiếng Việt. Chưa kiểm bằng mắt.
  - Một lượt Edit đứng riêng ở vòng 2 B (agent tự vấp).
- Hai chỗ sót đã sửa cùng ngày (chưa đo lại, test 296/296): `roles.mjs` đọc `font-family` và `font-weight` trong `style` inline trước lớp và luật CSS (dựng lại đúng `<h1>` của lần A: không còn báo đậm giả); Vina Sans vào `VI_FONT_ISSUES` mức LỖI sau khi chụp 24–96px: chữ i có chân ngang, dấu huyền và dấu sắc trên i dính vào chân tới khoảng 48px (*MÌ*, *PHÍ* đọc như *MI*, *MĪ*), dấu trên chữ khác đọc đúng. Trang thử và ảnh ở scratchpad phiên `5424c332-…`, thư mục `vina/`.
- Chất lượng: ba màn của mỗi lần vòng 1 khác nhau rõ, khớp `axes.khung`, không giống nhau hơn đợt trước. Một lần vòng 1 chụp theo giờ thật (18:28) nên màn hiện "đã qua 4 mẻ" và phiếu chọn mẻ 6:00 đã qua.

## Prompt của lần chạy đo

Thay `<DIR>` bằng thư mục tuyệt đối của lần chạy (vòng 1: thư mục trống; vòng 2: thư mục đã chép `r1-board` vào `<DIR>/docs/prototypes/sample`). Giữ nguyên chữ để so được với các mốc.

Vòng 1:

```text
Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
Chạy skill sketch-to-concept: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-concept/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt. Cần một site giới thiệu một trang.
Đáp án Cổng 1 đã có sẵn (nguồn: người dùng nói): 1. Site giới thiệu một trang, chỉ web. 2. Khách du lịch và người địa phương, lướt điện thoại tìm chỗ ăn sáng. 3. Xem mẻ bánh sắp ra lò, xem giờ mở và đường đi, đặt giữ bánh qua Zalo. 4. Khác biệt: bánh nướng lò củi, 4 mẻ cố định mỗi ngày (6:00, 9:30, 15:00, 17:30), mẻ nào hết là hết. 5. Ấm, mộc, đáng tin; ghét sến, kiểu quán cà phê sống ảo. 6. Chưa có logo hay màu brand, không có tham chiếu.
Nội dung thật: bánh mì que củi 8.000đ, bánh mì đặc ruột 6.000đ, bánh sừng bò bơ Đà Lạt 22.000đ, bánh nho Bảo Lộc 18.000đ; 14 Hai Bà Trưng, Phường 1, Đà Lạt; Zalo 0909 123 456; mở 5:30 đến 19:00, nghỉ thứ Hai.
Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
Làm A1 → A2 → A3 rồi dừng ở Cổng 2: viết câu hỏi Cổng 2 ra trong câu trả lời cuối. Không dựng prototype. Bạn không hỏi được người dùng.
Câu trả lời cuối: (1) câu hỏi Cổng 2, gọn; (2) file đã tạo; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
```

Vòng 2:

```text
Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
Chạy skill sketch-to-concept: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-concept/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt. Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Thư mục này đã có bảng concept của vòng trước (`concept/concepts.js`, `DECISIONS.md`); Cổng 2 đang mở, người dùng chưa chọn concept.
Lời người dùng vừa trả lời ở Cổng 2 (nguyên văn): "chưa hợp ở Màu và Chữ, gần đúng nhất là C".
Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
Làm vòng mới theo đúng skill rồi dừng ở Cổng 2: viết câu hỏi Cổng 2 ra trong câu trả lời cuối. Không dựng prototype. Bạn không hỏi được người dùng.
Câu trả lời cuối: (1) câu hỏi Cổng 2, gọn; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
```

## Lưu ý khi chạy

- Trên Windows, `run.mjs` của qa-kit cần `--experimental-websocket` với Node 20 (shots.mjs tự thêm cờ này).
- Lệnh `rm` với biến trong đường dẫn bị chặn: viết `"${DIR:?}/…"`.
- Mỗi phía chỉ một lần chạy thì mức chênh dưới khoảng 15 % chưa nói được gì: vòng 1 đã dao động 1,07–1,37M giữa các lần chạy cùng phiên bản.
- Kết quả công cụ báo lỗi (mã thoát khác 0) bị cắt ở giữa, chỉ còn khoảng 10k ký tự; kết quả không lỗi dài 16–28k ký tự thì giữ nguyên. Khi một lần chạy làm lại một lệnh, xem lệnh trước có bị cắt không (`dump.js`, tìm `characters truncated`).
- Subagent dùng cache 5 phút; phiên chính của lần đo này dùng cache 1 giờ. Khi một lượt nghĩ và viết quá 5 phút, lượt sau mất cache (`cache_read` tụt về khoảng 22k) và phải ghi lại cả ngữ cảnh, tốn thêm 0,07–0,13M. `parts2.js` tính khoản này vào tổng, `attrib.js` thì không. Đã gặp ở các lần: Sau gộp lượt A (vòng 1 lượt 13, vòng 2 lượt 7), cả hai lần vòng 1 của đợt sửa thứ tư (lượt 11 và lượt 10), cả hai lần vòng 1 của đợt sửa thứ năm (lượt 10) và vòng 2 B của đợt đó (lượt 5). Khi so các mốc, ghi riêng khoản này; `times.js` cho biết lượt trước đó nghĩ và viết bao lâu.
- Lần chạy được khởi động đầu tiên trong phiên có thể không có cache ở lượt 1 (`đọc cache 0k`), tốn thêm khoảng 28k.
- `fixes.js` bắt nhầm vài chỗ:
  - "grep màn" đếm cả `grep -c` đứng cạnh `wc -c concept/a.html`;
  - "lỗi không thấy file" đếm cả `ls` thư mục chưa tạo;
  - "trang HTML thử" không đếm trang viết bằng heredoc trong Bash (vòng 2 A của đợt sửa thứ tư có một trang như vậy); dòng "đợt năm" đếm riêng trang heredoc;
  - "tìm kind/family" đếm cả lệnh Read `templates/concepts.js` ở A3 bước 1, việc skill yêu cầu từ đợt sửa thứ năm, nên vòng 1 luôn ra 1;
  - "màn dùng clamp(…vw)" không còn là lỗi: `vong-dau.md` yêu cầu chữ khổng lồ dùng `clamp()` theo `vw`.
- `phase.js` chỉ nhận tài liệu skill khi đường dẫn viết thẳng trong lệnh. Lệnh dùng biến (`S=…; sed … "$S/…"`) bị xếp vào "khác".

## sketch-to-site: mốc nền (04/10/2026)

Đo trước khi áp các mẫu của `sketch-to-concept`:
- Skill ở bản 4.4 (commit `8c553c0`), test 296/296.
- Cùng đề bài *Lò Bánh Củi Cô Ba*, model Opus 5.5.
- Mỗi lần chạy là một subagent `general-purpose` chạy nền.
- Chia hai pha để mỗi pha có một thư mục bắt đầu cố định. Hai lần của mỗi pha chạy song song.

### Thư mục bắt đầu

- **Pha 1** (B0 → Cổng 3) chép `r2-chosen/sample`. Đây là `r1-board/sample` sau khi làm phần chốt Cổng 2 của sketch-to-concept, với lời người dùng "Chọn C. Một nền như concept. Nhịp như concept.":
  - `DECISIONS.md` ghi đáp án;
  - `CONCEPT.md` viết theo `templates/CONCEPT.md`, đủ mục 0–6, không còn chỗ trống;
  - khối CSS mục 3 khớp kết quả lệnh `cssText` (`T.resolve(CONCEPTS, 'c', T.parseMix(''))`).

  Phần dựng này không tính vào số đo.
- **Pha 2** (B3 → Cổng 4) chép `r3-gate3/sample`, là kết quả của pha 1 lần A. Lý do chọn lần A:
  - cả hai lần đều qua `themes.mjs` (1 theme · 26 cặp · 0 không đạt · 0 sát ngưỡng) và preflight `site/` 0 lỗi;
  - Cổng 3 của lần A gọn hơn: 3 câu, một chỗ gãy (*mẻ đã ra lò, còn bánh*). Lần B tách câu 3 thành 3a, 3b và trình 6 ảnh.

  Cổng 3 của lần A có câu 3, nên lời người dùng ở prompt pha 2 thêm nguyên văn: "Giữ concept, chấp nhận ngoại lệ ở màn đó".
- `r3-gate3/sample` có sẵn `_qa/cong-3/system-dark-1440.png`, vì lần A chụp ảnh trình Cổng 3 vào `_qa/` theo lệnh chụp tay của `qa-gate.md` mục 2. Pha 2 vì vậy bắt đầu với một thư mục `_qa/` chưa có bộ kiểm.

### Prompt

Thay `<DIR>` bằng thư mục tuyệt đối của lần chạy. Thư mục bắt đầu chép vào `<DIR>/docs/prototypes/sample`.

Pha 1:

```text
Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
Chạy skill sketch-to-site: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-site/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang. Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Concept đã chốt ở Cổng 2: `CONCEPT.md`, `DECISIONS.md`, `concept/`.
Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
Làm B0 → B1 → B2 rồi dừng ở Cổng 3: viết câu hỏi Cổng 3 ra trong câu trả lời cuối. Không dựng trang. Bạn không hỏi được người dùng.
Câu trả lời cuối: (1) câu hỏi Cổng 3, gọn; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
```

Pha 2:

```text
Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
Chạy skill sketch-to-site: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-site/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang. Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Đã xong B0–B2; Cổng 3 đang mở.
Lời người dùng vừa trả lời ở Cổng 3 (nguyên văn): "Duyệt design system và sơ đồ trang. Phạm vi: 1 trang chủ. Giữ concept, chấp nhận ngoại lệ ở màn đó."
Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
Làm B3 → B4 rồi dừng ở Cổng 4: viết câu hỏi Cổng 4 ra trong câu trả lời cuối. Bạn không hỏi được người dùng.
Câu trả lời cuối: (1) câu hỏi Cổng 4, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
```

### Mốc nền

Token quy đổi thô lấy từ `parts2.js`, số theo bước lấy từ `phase-site.js` (output ước 3 ký tự một token). Phút là thời gian thật của transcript.

| Pha · lần | Lượt | Quy đổi thô | Bỏ lượt mất cache | Phút | B0 | B1 / B3 | B2 / B4 | Cổng |
|---|---|---|---|---|---|---|---|---|
| 1 · A | 59 | 1,46–1,51M | không mất | 18,3 | 4 lượt · 0,11M · 0,3' | B1 14 · 0,28M · 3,8' | B2 36 · 0,95M · 12,9' | Cổng 3: 5 · 0,15M · 1,2' |
| 1 · B | 69 | 1,90–1,97M | không mất | 24,2 | 3 · 0,09M · 0,2' | B1 20 · 0,45M · 6,0' | B2 39 · 1,17M · 16,1' | Cổng 3: 7 · 0,22M · 1,9' |
| 2 · A | 59 | 1,57–1,61M + review 0,83–0,85M | không mất | 17,9 | 4 · 0,09M · 0,5' | B3 26 · 0,63M · 8,7' | B4 28 · 0,83M · 8,0' | Cổng 4: 1 · 0,04M · 0,7' |
| 2 · B | 66 | 2,29–2,35M + review 0,95–0,96M | 1,96–2,02M + review 0,72–0,73M | 31,7 | 3 · 0,06M · 0,2' | B3 25 · 0,72M · 10,7' | B4 37 · 1,50M (bỏ mất cache: 1,16M) · 20,2' | Cổng 4: 1 · 0,04M · 0,6' |

- **Nguồn chi phí:** không lần nào có lượt nghĩ và viết quá 5 phút. Chi phí đến từ số lượt nhân ngữ cảnh:
  - ngữ cảnh tăng từ 36k lên 264–318k;
  - lượt chỉ có một lệnh: 53/59, 46/69, 45/59, 51/66.
- **Cả quy trình:** một lần chạy đủ B0 → Cổng 4 tốn khoảng 3,8–4,8M (pha 1, pha 2, review), gấp 6–8 lần vòng 1 của sketch-to-concept sau pilot.
- **Review B4:** loại `general-purpose`, prompt 3,1k ký tự, khởi đầu ở ngữ cảnh 37–38k.
  - **Lần A:** agent gọi review chạy nền rồi bàn giao trước khi review trả về, nên 0,84M không được dùng. Review còn đọc lại `index.html` và `site.css` (lượt 7–9 và 32–35) vì file đổi giữa chừng.
  - **Lần B:** agent gọi review và chờ (`run_in_background: false`). Review chạy 8,8 phút nên agent cha mất cache ở lượt 58, tốn thêm 0,33M. Đây là do TTL 5 phút của subagent; trong phiên chính TTL là 1 giờ thì không mất.
  - Lượt cuối của review lần B cũng mất cache (+0,23M) dù chỉ cách lượt trước 87 s. Chưa rõ vì sao.
- **Lượt 1 không có cache:** gặp ở cả hai lần pha 1, vì là lần khởi động đầu (xem mục *Lưu ý khi chạy*).

Chỗ tốn nhất. Chi phí tính bằng `groupcost.js`: phí lượt (0,1 × ngữ cảnh, cộng output) cộng phần nội dung lượt đó nạp vào và mang tới cuối.

1. **Vòng tự soát `_system.html` và chụp Cổng 3** ở pha 1: lần A lượt 39–53 (0,46M), lần B lượt 47–65 (0,65M). Cả hai lần vấp cùng chỗ:
   - khuôn `system.html` không nạp Tailwind nên thiếu `box-sizing:border-box`, tràn ngang ở 390 (A lượt 41–42; B mất 3 lượt);
   - luật `.sys p` của khuôn đè màu chữ của component (A lượt 52; B);
   - mẫu chữ 96px của khuôn tràn ở 390 (B);
   - không có lệnh chụp cả trang. Edge headless chỉ chụp đúng cửa sổ và máy không có PIL (A lượt 44 lỗi), nên agent tự cuộn và chụp từng đoạn bằng `run.mjs` (A lượt 45–51, B lượt 49–63). `run.mjs` lại in JSON dài, phải tự lọc.
2. **B1 tự dựng chỗ thử concept.** Skill không nói thử bằng gì và đặt ở đâu.
   - Lần A, lượt 11–21 (0,29M): viết file bước, chạy `run.mjs` ở khổ 320 và 390 trên `concept/c.html`.
   - Lần B, lượt 12–29 (0,46M): dựng trang `_thu-concept/thu.html` 10,8k ký tự, chụp 13 ảnh.
3. **Đọc mã script của skill để biết cách dùng:**
   - pha 1 A: 0,27M (lượt 15–16 `run.mjs`, 22 `themes.mjs`, 26–29 `preflight.py`, 38 `qa_init.py`);
   - pha 1 B: 0,31M (lượt 14–17, 25–26, 34–36);
   - pha 2 A: 0,25M (lượt 15, 20, 22–24);
   - pha 2 B: 0,46M (lượt 11–15 trong qa-kit, 30–32 và 36 trong `_qa/`).
4. **Lượt chỉ mở ảnh, 1–3 ảnh mỗi lượt:**
   - pha 2 A: 12 lượt, 0,43M; riêng lượt 35–39 là 5 lượt liền cho một lần chạy bộ kiểm;
   - pha 2 B: 9 lượt, 0,31M; lượt 45–51 là 7 lượt liền;
   - pha 1 B: 13 lượt, 0,44M;
   - pha 1 A: 8 lượt, 0,23M.
5. **Tài liệu đọc nguyên:**
   - SKILL.md (32,9k ký tự) đọc nguyên ở lượt 1 cả bốn lần, mang theo 0,15–0,18M;
   - `rules-and-conflicts.md` (19,2k) đọc nguyên cả bốn lần;
   - `qa-gate.md` (18k) đọc nguyên cả hai lần pha 2.

   Tài liệu ngoài SKILL.md tốn 0,24–0,34M mỗi lần.

Vấp khác, theo báo cáo của agent:
- `qa_init.py` chép nguyên `&amp;` từ thẻ `qa-query`, nên bộ khói đọc ra tham số `amp;thu` (pha 2 A).
- Preflight của Tailwind (nạp sau) xoá nền vật liệu của cửa vòm. Lần A tăng độ ưu tiên của luật CSS, lần B bỏ hẳn Tailwind.
- Bộ khói chỉ chụp màn đầu, nên cả hai lần pha 2 tự thêm bước cuộn.
- `run.mjs` chạy thẳng trên Node 20 cần `--experimental-websocket` (pha 2 B, hỏng 2 lần).
- Lệnh `print` chữ Việt của Python lỗi cp1252 (pha 2 B).
- `scroll-behavior:smooth` làm lượt kiểm sâu bấm sai chỗ, mất 6 lượt dò (pha 2 B, lượt 37–42).
- Write từ chối ghi đè khuôn vừa `cp` mà chưa Read, nên agent phải `rm` rồi viết lại (pha 1 A, lượt 35–36).
- Câu "chấp nhận ngoại lệ ở màn đó" không khớp nguyên văn lựa chọn ở Cổng 3 của lần A, nên cả hai lần pha 2 phải đối chiếu `_system.html` mới hiểu. Đây là lỗi của prompt đo, không phải của skill.

Chất lượng (chỉ mở ảnh):
- **Pha 1:** `_system.html` ở 1440 của cả hai lần mang rõ concept C: nền muội than, chữ Fraunces, vòm than hồng cho mẻ đang nướng, gạch cho mẻ đã đóng, hàng bốn cửa vòm.
- **Pha 2:** màn đầu 1440 của cả hai lần là vòm than hồng ôm "9:30", H1 Fraunces, nút giữ bánh nằm trong màn đầu. Hàng cửa có đủ tro, than, gạch.
- **Review lần A:** concept mờ ở Nội quy, Giờ mở và chân trang. Khoảnh khắc đọc lần hai chỉ thấy lúc 8:40.

Transcript (phiên `9fb766ff-5514-495b-8528-a9d7cf34d332`):

| Pha · lần | Agent | Review B4 |
|---|---|---|
| 1 · A | `a2023b726c9909d64` | – |
| 1 · B | `a1c2e3cd5af3709ad` | – |
| 2 · A | `a7a360c75239e76d2` | `a4236bcf6d8d0bd05` (general-purpose, chạy nền) |
| 2 · B | `aa8113d01c69b4f41` | `af987396c3efab555` (general-purpose, chờ) |

Thư mục và ảnh của bốn lần nằm trong scratchpad của phiên đó (`rs1a`, `rs1b`, `rs2a`, `rs2b`) và có thể bị dọn.

### Lưu ý về hai script

- `phase-site.js` nhận pha từ prompt: có "Làm B3" là pha 2.
  - **Pha 1:** agent làm B1 và B2 xen nhau, nên mỗi lượt lấy dấu hiệu của chính nó; lượt không có dấu hiệu thì theo lượt trước. Mọi lần sửa `DECISIONS.md` ở pha 1 tính là B1 (giả định, kết quả thử concept).
  - **Cổng 3:** nhận ra một phần nhờ tên ảnh mà hai lần đo đầu tự đặt (`system-…1440`, `cong-3/`). Lần sau agent đặt tên khác thì xem lại bằng `--list`.
  - **Pha 2:** bước chỉ tăng. Sửa trang sau khi chạy bộ kiểm tính là B4. Đọc `qa-gate.md` trước khi có trang tính là chuẩn bị cho B3.
- `fixes-site.js`:
  - "đọc mã skill" chỉ đếm lệnh có đường dẫn `skills/…` hoặc `cd` vào đó; đọc mã trong `_qa/` (bản chép của bộ kiểm) thì không đếm;
  - "ghi file" chỉ đếm Write và Edit, không đếm `python` hay `sed -i`.
- Dấu hiệu thêm cho bản 4.5 (đã chạy lại trên bốn transcript mốc nền, số không đổi):
  - `system-check.mjs` là B2; mở ảnh `_shots/system/…-full.png` là Cổng 3; `qa-check.py` là B4;
  - dấu hiệu B1 tắt ở lần sửa đầu vào `site/` (Write, Edit, `sed -i`, `python`), không tắt vì `cp`: bản 4.5 chép khuôn ngay ở lượt vào;
  - dòng 2 của `fixes-site.js` đếm thêm `system-check.mjs` và `qa-check.py`.
- Đường dẫn chuyển vào `paths.js`, đọc từ biến `SKILLS` và `RUNS`, để chạy được trên máy khác. Dòng 3 của `fixes-site.js` đếm thêm lệnh chụp bằng `chromium`. Cả hai đã thử trên bốn transcript mốc nền.
  - Không đặt biến: output của mọi script giống hệt trước khi sửa.
  - Đổi đường dẫn trong transcript sang dạng Linux và đặt hai biến: bước của từng lượt và mọi số đếm giữ nguyên. Chi phí lệch 1–3k, vì độ dài đường dẫn làm đổi số ký tự output và kết quả.

### Chạy trên cloud

Dùng `prompt-site-cloud.md`. Chuẩn bị trước khi dán prompt:
1. Đưa bộ đo lên GitHub: nhánh `measure/site-4.5` tách từ `perf/site-token-cost` (có `d6d7708`), thêm thư mục `measure-kit/`, không kèm `r1-board/` vì sketch-to-site không dùng. Nhánh này không merge.
2. Tạo môi trường cloud có mạng tới Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), `cdn.tailwindcss.com` và `unpkg.com`. Mức mạng mặc định có thể chặn các địa chỉ này. Cài Playwright cũng cần mạng.
3. Mở phiên trên repo `tapora-proto-kit`, nhánh `measure/site-4.5`, model Opus 5.5.

Khác mốc nền:
- Mốc nền chạy trên Windows với Edge và Node 20. Cloud chạy Linux, có thể dùng Node mới hơn và Chromium.
- Số phút không so được. Tổng token chỉ để tham khảo; chênh dưới khoảng 25 % thì chưa nói được gì.
- Transcript của phiên cloud mất khi máy bị xoá. Prompt cho phép commit và push, nhưng chỉ `measure-kit/`, và chỉ lên nhánh đo.
- Transcript lưu ở `transcripts/site-4.5/`, dạng `.jsonl.gz`. Giải nén cạnh file `.meta.json` của nó rồi mới chạy script: script tìm transcript con qua `.meta.json` và đọc `.jsonl`.

## sketch-to-site: sau 4.5 (cloud, 04/10/2026)

Đo bằng `prompt-site-cloud.md`: skill bản 4.5 (nhánh `measure/site-4.5`, có `d6d7708`), cùng thư mục bắt đầu và prompt như mốc nền. Chỉ thay `<DIR>` và đường dẫn repo. Mỗi lần chạy là một subagent `general-purpose` chạy nền; hai lần của mỗi pha chạy song song, pha 2 bắt đầu sau khi pha 1 xong.

### Môi trường

| | Mốc nền | Lần này |
|---|---|---|
| Máy | Windows, Git Bash | Claude Code cloud, Linux |
| Node · Python | 20 · 3.x (cp1252) | v22.22.0 · 3.11.15 |
| Trình duyệt | Edge | Chromium 141.0.7390.37 của Playwright (`/opt/pw-browsers`), symlink `/usr/local/bin/chromium` |
| Model | Opus 5.5 | Opus 5.5 (`claude-opus-5-5`) |
| Ngữ cảnh lúc vào lượt 1 | 36–38k | 42k (pha 1, không cache) · 34k đọc + 8k ghi (pha 2) |

Chuẩn bị máy cloud, phải làm lại ở phiên mới:
- Mức mạng phải cho `cdn.tailwindcss.com` và `unpkg.com` (mức mặc định trả 403; 31 test hỏng vì vậy).
- Kho NSS của Chromium (`~/.pki/nssdb`) có thể trống, khi đó Google Fonts lỗi `ERR_CERT_AUTHORITY_INVALID`. Thêm CA của proxy: `apt-get install -y libnss3-tools && certutil -d sql:/root/.pki/nssdb -A -t "C,," -n agent-proxy-ca -i /root/.ccr/agent-proxy-ca.crt`. Ở máy lần này, sau khi đổi mạng, kho đã có sẵn `ccr-agent-proxy-2`.
- Node 22 không nhận thư mục ở `node --test`. Chạy `node --test skills/sketch-to-concept/tests/*.test.js skills/sketch-to-site/tests/*.test.js`: 314 qua, 0 hỏng, 2 bỏ qua (hai test chỉ cho Windows), tổng 316.

### So với mốc nền

Số thô từ `parts2.js`, số theo bước từ `phase-site.js` (đã sửa, xem dưới). Không lần nào mất cache, nên cột "bỏ lượt mất cache" bằng số thô. Không so phút.

| Pha · lần | Lượt | Quy đổi thô | Bỏ lượt mất cache | B0 | B1 / B3 | B2 / B4 | Cổng | Review |
|---|---|---|---|---|---|---|---|---|
| 1 · A mốc | 59 | 1,46–1,51M | không mất | 4 · 0,11M | B1 14 · 0,28M | B2 36 · 0,95M | 5 · 0,15M | – |
| 1 · B mốc | 69 | 1,90–1,97M | không mất | 3 · 0,09M | B1 20 · 0,45M | B2 39 · 1,17M | 7 · 0,22M | – |
| **1 · A 4.5** | **15** | **0,50–0,54M** | không mất | 2 · 73k | B1 0 *(gộp vào B2)* | B2 12 · 417k | 1 · 26k | – |
| **1 · B 4.5** | **17** | **0,47–0,50M** | không mất | 2 · 75k | B1 0 | B2 14 · 366k | 1 · 38k | – |
| 2 · A mốc | 59 | 1,57–1,61M | không mất | 4 · 0,09M | B3 26 · 0,63M | B4 28 · 0,83M | 1 · 0,04M | 0,83–0,85M |
| 2 · B mốc | 66 | 2,29–2,35M | 1,96–2,02M | 3 · 0,06M | B3 25 · 0,72M | B4 37 · 1,50M | 1 · 0,04M | 0,95–0,96M |
| **2 · A 4.5** | **21** | **0,69–0,72M** | không mất | 5 · 148k | B3 5 · 185k | B4 10 · 332k | 1 · 39k | **không chạy được** |
| **2 · B 4.5** | **28** | **0,76–0,79M** | không mất | 7 · 183k | B3 5 · 156k | B4 15 · 401k | 1 · 33k | **không chạy được** |

- Pha 1 giảm 65 % và 75 %, pha 2 (không tính review) giảm 56 % và 67 % (61 % so với số bỏ mất cache của mốc B). Mức giảm vượt xa ngưỡng 25 %, nên dù khác máy vẫn kết luận được hướng: 4.5 rẻ hơn rõ. Từng con số thì chỉ để tham khảo.
- Mức giảm lớn hơn ước tính trước khi đo (pha 1 cộng thẳng tối đa 0,73–1,21M, thực tế khoảng 1,2M; pha 2 0,38–0,68M chưa tính review, thực tế 1,05–1,2M). Lý do: chi phí là số lượt nhân ngữ cảnh, nên bớt lượt và bớt nội dung nạp cùng lúc thì tiết kiệm nhân lên. Ngữ cảnh cuối còn 172–189k (pha 1) và 231–256k (pha 2), mốc nền 264–318k.
- B0 của 4.5 lớn hơn mốc: lượt vào nay gồm cả chép khuôn và in luật (mốc tính là B2/B3), pha 2 còn thêm 1–3 lượt đọc file dựng trước dấu hiệu B3 đầu tiên. So theo bước chỉ nên so tổng B0 + B1/B3.
- Review: subagent trên cloud không có công cụ Agent (công cụ của cả bốn lần chỉ có Bash, Read, Write, Edit, SubagentHandback). Hai lần pha 2 bỏ bước 5 của B4 và ghi "không có review độc lập" vào Cổng 4. Việc 7 chưa đo được; con số pha 2 ở trên không gồm review.

Chi phí theo nhóm (`groupcost.js`; phí lượt + nội dung mang tới cuối; nhóm "tài liệu khác" gồm cả file dự án đọc cùng lượt):

| Nhóm | 1 · A | 1 · B | 2 · A | 2 · B | Mốc nền |
|---|---|---|---|---|---|
| SKILL.md (lượt 1) | 34k | 41k | 42k | 50k | 0,15–0,18M |
| Lượt vào (tài liệu giai đoạn, luật in, file dự án) | 117k (2–3) | 125k (2–3) | 115k (2) | 142k (2) | tài liệu ngoài SKILL.md 0,24–0,34M |
| Đọc thêm sau lượt vào (site.css, _system.html, concept/c.html) | – | – | 113k (3–4) | 138k (3–5) | – |
| Đọc mã skill | 31k (4) | 0 | 59k (5) | 112k (6, 15, 19, 20) | 0,25–0,46M |
| Vòng tự soát `_system.html` | 164k (7–12) | 155k (9–15) | – | – | 0,46–0,65M |
| Lượt chỉ mở ảnh | 93k (10, 12) | 82k (13, 15) | 119k (13, 15) | 149k (18, 22, 25) | 0,23–0,44M |
| Vòng B4 sau lần kiểm đầu | – | – | 355k (12–20) | 431k (14–27) | – |

### Soát từng việc của 4.5

1. **Kiểm một lệnh: đã ăn.**
   - Pha 1: `system-check.mjs` chạy 3 lần mỗi lần chạy (A lượt 7, 9, 11; B lượt 10, 12, 14). Lần cuối ra `Kết luận: SẠCH` trước Cổng 3 ở cả hai. Agent tự gọi `run.mjs` 0 lần, lệnh chụp 0 (mốc: tự cuộn và chụp từng đoạn, A lượt 45–51, B lượt 49–63). Đọc mã skill 1 lệnh (A lượt 4: `head -40` của `themes.mjs` và `system-check.mjs`, để biết đặt `default` khi chỉ có theme tối) và 0 lệnh (B); mốc 10–11 lệnh. Vòng tự soát còn 0,16M (mốc 0,46–0,65M).
   - Pha 2: `qa-check.py` chạy 3 lần (A lượt 11, 14, 17) và 4 lần (B lượt 13, 16, 21, 24). Không lần nào tự viết bộ cuộn hay file bước mới; chỉ sửa `query` trong `steps-smoke-index.json`. 0 kết quả bị cắt giữa. Đọc mã skill: 1 lệnh mỗi lần (A lượt 5, B lượt 6: đầu `preflight.py`, `qa-check.py`). B còn đọc mã bộ kiểm trong `_qa/` 3 lượt (15 `deep.mjs`, 19–20 `run.mjs`) để tìm nguyên nhân lỗi (script không đếm phần này).
   - Phần "tự thêm cờ Node 20" không thử được: máy chạy Node 22.
   - Chưa ăn hết, cả hai lần pha 2:
     - `qa-check.py` chỉ in dải tên ảnh (`index-2.jpg … index.jpg`), nên phải thêm một lượt `ls` (A lượt 12, B lượt 17; khoảng 20k mỗi lần).
     - Ảnh `slices` chụp bằng `captureBeyondViewport`, không cuộn, nên section hiện dần bằng `IntersectionObserver` + `opacity` ra trống mà bộ kiểm vẫn báo SẠCH. A thấy ở lượt 13, sửa lượt 14, mở lại ảnh lượt 15. B thấy ở lượt 18, đọc `run.mjs` lượt 19–20, sửa lượt 21, mở lại ảnh lượt 22. Khoảng 0,1–0,15M mỗi lần.
2. **Gộp lượt: đã ăn.**
   - Lượt có từ 2 lệnh: 9/15, 8/17, 9/21, 5/28 (mốc 6/59, 23/69, 13/59, 15/66).
   - Lượt chỉ mở ảnh: 2, 2, 2, 3 lượt, tốn 82–149k (mốc 8–13 lượt, 0,23–0,44M).
   - Ảnh của một lần kiểm mở hết trong một lượt: pha 1 cả 10–11 ảnh từng màn ở một lượt; pha 2 lần đầu 21 ảnh ở một lượt (A lượt 13, B lượt 18). Lần mở sau chỉ mở ảnh đổi (B lượt 22: 12 ảnh; lượt 25: 1 ảnh). Không ai mở ảnh `-full.png` trước khi trình Cổng 3, chỉ nêu đường dẫn.
   - Chưa ăn hết: pha 2 B còn 23/28 lượt một lệnh, phần lớn ở vòng gỡ lỗi B4 (lượt 14–27).
   - `Read` bản chép trước khi sửa: 0 lần Write bị từ chối, 0 lần `rm` rồi viết lại.
3. **Khuôn `system.html`: ăn phần lớn.**
   - 0 vòng sửa vì tràn ngang ở 390, 0 vòng vì mẫu chữ.
   - Còn một vòng ở cả hai lần pha 1: `:where(.sys p)` vẫn đặt `color` cho mọi `<p>`, nên chữ trong vòm không thừa hưởng màu của vòm (`--on-primary` trên than hồng). Lần A lỗi 7 cặp tương phản ở lượt 7 và sửa ở lượt 8 bằng `.hero-arch p{color:inherit}`; lần B lỗi 4 cặp ở lượt 10 (`#B8A693` trên `#E88D48`, 1,07:1) và sửa ở lượt 11. Mỗi lần tốn khoảng 30–40k.
4. **B1 trên `_system.html`: đã ăn.**
   - Không trang HTML thử nào ngoài `site/`. Đọc concept (`concept/c.html`) nằm ở lượt 3, chung với lượt đọc khuôn của B2, nên B1 không còn lượt riêng (mốc 0,28–0,45M).
   - Hai trường hợp khó có trên `_system.html` và ghi trong `DECISIONS.md`: A *Thứ Hai tiệm nghỉ* và *Mẻ đã hết, khổ 390*; B *Ngày nghỉ thứ Hai* và *Mẻ đã hết, chuỗi dài nhất*.
5. **Tách SKILL.md: đã ăn.** SKILL.md đọc nguyên ở lượt 1, 17,3–17,8k ký tự (mốc 32,9k), mang theo 34–50k (mốc 0,15–0,18M). Pha 2 cả hai lần đọc bằng `cat SKILL.md; ls -R <skills>/sketch-to-site`, không bằng Read.
6. **In đúng mục: đã ăn.** `fixes-site.js` dòng 1:
   - `rules-and-conflicts.md`: nguyên 0 cả bốn lần; một phần 4,4k ký tự (pha 1), 10,3k và 13,3k (pha 2). Mốc: 19,2k nguyên cả bốn lần.
   - `qa-gate.md`: nguyên 0; một phần 8,1k (2 · A, lượt 11) và 12,2k (2 · B, lượt 13–14, in thêm mục 6 khi gỡ lỗi). Mốc: 18k nguyên cả hai lần pha 2.
   - Lối vào một lượt:
     - pha 1: lượt 2 có `Read` `b0-b2.md`, `CONCEPT.md`, `DECISIONS.md` và lệnh 1 ở cả hai lần (A thêm một `ls`). Sau đó không đọc lại, không `cat`.
     - pha 2: lượt 2 có `Read` `b3-b4.md`, `CONCEPT.md`, `DECISIONS.md`, `DESIGN.md`, `templates/BUILD-LOG.md` và lệnh 2 ở cả hai lần. Sau đó không đọc lại bốn file này. Nhưng cả hai phải đọc thêm file để dựng: A lượt 3–4, B lượt 3–5 (`site.css`, `themes.json`, `tokens.css` bằng `cat`, `_system.html`, `concept/c.html`).
7. **Review `Explore`: chưa đo được.** Subagent không gọi được subagent con trên cloud (xem trên). Không có số về ngữ cảnh khởi đầu, lượt hay chi phí của review, cũng không có khoản mất cache của agent cha khi chờ. Chất lượng review chưa so được.

Lượt mất cache: không có ở cả bốn lần. Lượt dài nhất: 126 s (2 · A lượt 5, nghĩ 116 s); không lượt nào gần 5 phút.

Khác mốc chỉ vì Linux, không tính cho hay chống 4.5:
- Không có lỗi `print` cp1252 của Python, không có lỗi `--experimental-websocket` (mốc 2 · B hỏng 2 lần vì cờ này).
- Chromium tìm được trong PATH, không vấp lệnh chụp của Edge.
- Đường dẫn không có dấu cách, nên lệnh dùng biến không ngoặc kép (`S=<skills>;`) chạy được; đó là lý do phải sửa `expand` của script.

### Chất lượng (chỉ mở ảnh)

- **Pha 1:** ảnh `lo-cui-1440-full.png` của cả hai lần mang rõ concept C: nền muội than, tiêu đề Fraunces, chữ thân Commissioner, số IBM Plex Mono; vòm than hồng ôm "9:30", vòm gạch "6:00" khi đóng cửa, hàng bốn cửa vòm có tro, than, gạch. Font tải đúng, không rơi về font hệ thống. Hai trường hợp khó có trên trang.
- **Pha 2:** màn đầu 1440 của cả hai lần là vòm than hồng ôm "9:30", H1 Fraunces hai dòng, nút "Giữ bánh qua Zalo" và "Xem đường đi" trong màn đầu; hàng cửa có tro (6:00 đã hết), than (9:30), gạch (15:00, 17:30). Hai lần giống nhau rất nhiều, vì cùng bắt đầu từ `_system.html` của `r3-gate3`.
- Hai lần hiểu câu "chấp nhận ngoại lệ ở màn đó" khác nhau: A bỏ vật liệu `.ember`, B giữ `.ember` làm ngoại lệ. Lỗi này của prompt đo, như ở mốc nền.
- Không có review để so với mốc ("làm lại", 3–5 mục Nên sửa).

### Vấp mới so với mốc (mục 4 của báo cáo agent)

- `qa-check.py` in dải tên ảnh, phải `ls` (2 · A, 2 · B).
- Ảnh `slices` không cuộn, nội dung hiện dần bằng `opacity` ra trống mà bộ kiểm báo sạch (2 · A, 2 · B).
- `qa_init.py` ghi `query` vào file bước lúc cài; sửa `qa-query` trong trang sau đó không có tác dụng (2 · A lượt 16–17; 2 · B tự thêm `query`).
- `system-check.mjs` chỉ in mã cảnh báo preflight (P13), nên 1 · A chạy riêng `preflight.py` để biết chi tiết (lượt 8).
- `system-check.mjs` chỉ chụp ảnh ở 1440; trường hợp khó ở 390 chỉ có số đo, không có ảnh (1 · B).
- Skill bắt mở lại mọi ảnh từng màn sau lần chạy sạch, dù chỉ 2 màn đổi (1 · A lượt 12, 1 · B lượt 15; khoảng 40–45k mỗi lần).
- Bộ khói chụp tối đa 8 màn, nên phần cuối `_system.html` không vào ảnh (2 · A).
- Lặp lại từ mốc: `scroll-behavior:smooth` làm lượt kiểm sâu báo 8 lỗi (2 · B lượt 14–16, 3 lượt; mốc 6 lượt); bỏ Tailwind vì preflight đè nền vòm (2 · A).

### Chỗ tốn nhất còn lại

1. **Vòng B4 sau lần kiểm đầu:** 2 · A lượt 12–20 (0,36M), 2 · B lượt 14–27 (0,43M). Gồm ảnh trống vì không cuộn, `ls` tên ảnh, `query` của file bước, `scroll-behavior:smooth`.
2. **Vòng tự soát `_system.html`:** 1 · A lượt 7–12 (0,16M), 1 · B lượt 9–15 (0,155M). Gồm vòng sửa vì `:where(.sys p)` đặt màu và lần mở lại 10–11 ảnh sau sửa nhỏ.
3. **Đọc thêm sau lượt vào ở pha 2:** 2 · A lượt 3–5, 2 · B lượt 3–6 (đọc `site.css`, `_system.html`, `concept/c.html`, đầu `preflight.py`, `qa-check.py`). Phí lượt 35–55k; nội dung thì vẫn cần.
4. **Mở ảnh ở pha 2:** 2 · A 54 ảnh trong 3 lượt (13, 15, 18), 2 · B 34 ảnh (18, 22, 25); 0,12–0,15M.
5. **Nền:** ngữ cảnh lúc vào 34–42k và SKILL.md 34–50k, mỗi lần. Phần này khó giảm thêm.

### Đề xuất bước tiếp (ước từ số đo, chưa sửa skill)

| # | Việc | Ước tiết kiệm mỗi lần chạy | Chắc chắn |
|---|---|---|---|
| 1 | `run.mjs`: bước `slices` cuộn tới từng màn trước khi chụp (để `IntersectionObserver` chạy), hoặc bộ kiểm báo phần tử `opacity:0` trong khung | pha 2: 0,1–0,15M | cao: cả hai lần pha 2 vấp, và đây là lỗi bộ kiểm báo sạch sai |
| 2 | `b3-b4.md`: thêm `site/assets/site.css`, `site/_system.html`, `concept/<id>.html` vào `Read` của lượt vào; ghi rõ không cần đọc đầu `preflight.py`, `qa-check.py` | pha 2: 40–70k | cao: cả hai lần |
| 3 | Khuôn `system.html`: `:where(.sys p)` không đặt `color` (chỉ đặt cho đoạn mô tả của trang, như `.sys-doc p`) | pha 1: 30–40k | cao: cả hai lần |
| 4 | `qa-check.py` in tên từng ảnh (đủ đường dẫn), không in dải | pha 2: khoảng 20k | cao: cả hai lần |
| 5 | `qa_init.py`/`run.mjs` đọc `qa-query` của trang lúc chạy, không đóng băng vào file bước | pha 2: 0–60k | trung bình: một lần vấp |
| 6 | Cấm `scroll-behavior:smooth` trong CSS dùng chung, hoặc `deep.mjs` tắt nó khi kiểm | pha 2: 0–65k | trung bình: một lần vấp (mốc cũng một lần) |
| 7 | `system-check.mjs` in chi tiết cảnh báo preflight | pha 1: 0–16k | thấp |

- Không đáng làm: rút gọn SKILL.md thêm (còn 34–50k mỗi lần); bỏ lần mở lại ảnh sau sửa nhỏ (40–45k nhưng dễ sót lỗi lan sang màn khác).
- Việc 7 cần đo riêng: review chỉ chạy được khi agent dựng là phiên chính, không phải subagent. Cách đo: chạy pha 2 trong phiên chính, hoặc từ phiên chính gọi agent `Explore` với prompt review của `b3-b4.md` trên `rc2a`/`rc2b`.

### Sửa script trong lần đo này

Bốn transcript mốc nền không có trên cloud. Cần chạy lại số mốc ở máy Windows để xác nhận các chỗ sửa không đổi số mốc:
- `phase-site.js`: lượt có `Read` `references/b0-b2.md` hay `b3-b4.md`, khi chưa qua bước nào, là B0. Trước đó lượt vào của pha 1 bị xếp B2 vì lệnh `cp` khuôn. Transcript mốc không có hai file này, nên số mốc không đổi.
- `phase-site.js`, `fixes-site.js`: `expand` nhận cả biến không ngoặc kép (`S=/đường/dẫn;`), bỏ qua giá trị `$(…)`. Trước đó lệnh `S=<skills>; head -40 $S/…` của 1 · A lượt 4 không được đếm là đọc mã skill. Mốc dùng `S="…"` vì đường dẫn Windows có dấu cách; nếu có lệnh không ngoặc kép thì số "đọc mã skill" của mốc có thể tăng.
- `attrib.js`: ảnh `.jpg` cũng là "ảnh mở ra xem" (bộ kiểm 4.5 chụp `.jpg`). Nếu mốc pha 2 có mở `.jpg` thì phần đó chuyển từ "đọc file dự án" sang "ảnh".
- Đếm nhầm còn để nguyên:
  - `fixes-site.js` dòng 6 "lệnh dùng /x/…" đếm cả chuỗi `'\r\n'` trong lệnh Python (sau khi đổi `\` thành `/`): 2 · A lượt 10, 17; 2 · B lượt 12, 16, 21, 24 đều là lệnh tính dấu của `BUILD-LOG.md`.
  - `attrib.js` "tra/kiểm font" và `fixes-site.js` "preflight --font" khớp cả biến CSS `var(--font-…)` trong lệnh sửa CSS (2 · B lượt 21).

### Transcript

Phiên `86d5c0dc-2566-593f-8504-e5b654a914f7` (cloud). File nằm ở `transcripts/site-4.5/agent-<id>.jsonl.gz`, kèm `.meta.json`. Không có transcript con (không có review).

| Pha · lần | Agent | Thư mục chạy | Ảnh và `DECISIONS.md` |
|---|---|---|---|
| 1 · A | `adb06ab06de563c48` | `/tmp/measure/rc1a` | `runs-4.5/rc1a/` (`lo-cui-1440-full.png`) |
| 1 · B | `a6d9a00b2ae399f91` | `/tmp/measure/rc1b` | `runs-4.5/rc1b/` |
| 2 · A | `a0e3083801b5e7949` | `/tmp/measure/rc2a` | `runs-4.5/rc2a/20261004-1755/` (trang chủ 1440, 4 màn) |
| 2 · B | `a63eed7d8700f5769` | `/tmp/measure/rc2b` | `runs-4.5/rc2b/20261004-1757/` |

Chạy lại script: `gunzip -k transcripts/site-4.5/*.gz`, rồi `SKILLS=<repo>/skills RUNS=/tmp/measure node phase-site.js transcripts/site-4.5/agent-<id>.jsonl`. Đường dẫn trong transcript là `/home/user/tapora-proto-kit/skills` và `/tmp/measure/r…`; đặt `SKILLS=/home/user/tapora-proto-kit/skills` để `<skills>` hiện đúng.

## sketch-to-site: sau 4 chỗ sửa (cloud, 05/10/2026)

Bốn chỗ sửa sau lần đo trên (gộp vào 1.5.0, commit `70cc50b` trên `measure/site-4.5`): `run.mjs` cuộn qua trang trước khi chụp `full`/`slices`; lượt vào B3 đọc thêm `site/_system.html`, `site/assets/site.css`, lệnh 2 in `concept/<id>.html` và `ls site/`, `b3-b4.md` ghi lệnh preflight từng trang; khuôn `system.html` chỉ áp chữ của trang cho tiêu đề và đoạn mô tả nằm thẳng trong `.sys`/`<section>`; `qa-check.py` in thư mục tuyệt đối và tên từng ảnh. Cùng máy, cùng thư mục bắt đầu và prompt; thư mục chạy `/tmp/measure/rd1a`, `rd1b`, `rd2a`, `rd2b`. Không lần nào mất cache.

| Pha · lần | Lượt | Quy đổi thô | Lần đo trước (4.5) | B0 | B1 / B3 | B2 / B4 | Cổng |
|---|---|---|---|---|---|---|---|
| 1 · A | 17 | 0,52–0,56M | 15 lượt · 0,50–0,54M | 2 · 73k | B1 1 · 35k *(chỉ sửa `DECISIONS.md`)* | B2 13 · 395k | 1 · 29k |
| 1 · B | 17 | 0,56–0,60M | 17 lượt · 0,47–0,50M | 2 · 76k | – | B2 13 · 455k | 2 · 44k *(lượt 8 mở ảnh cả trang để tìm chỗ tràn, thật ra là B2)* |
| 2 · A | 18 | 0,58–0,61M | 21 lượt · 0,69–0,72M | 2 · 37k | B3 5 · 247k | B4 9 · 248k | 2 · 61k |
| 2 · B | 17 | 0,55–0,57M | 28 lượt · 0,76–0,79M | 2 · 36k | B3 7 · 282k | B4 6 · 180k | 2 · 61k |

- **Pha 2:** trung bình 0,58M so với 0,74M, giảm khoảng 21 %; số lượt 17–18 so với 21–28. Dưới ngưỡng 25 % của hai lần chạy, nên tổng chỉ để tham khảo; từng chỗ sửa thì soát được trong transcript (dưới).
- **Pha 1:** 0,54M và 0,58M so với 0,52M và 0,485M: ngang, trong mức dao động. Chỗ sửa ở khuôn ăn, nhưng hai lần vấp chỗ khác (dưới).
- Review: vẫn không chạy được (subagent không có công cụ Agent); hai lần pha 2 ghi "không có review độc lập".

Soát từng chỗ sửa:
1. **Cuộn trước khi chụp: đã ăn.** Cả hai trang đều dùng `IntersectionObserver` để hiện dần (`rd2a` 4 chỗ, `rd2b` 3 chỗ, như lần trước). Không lần nào gặp section trống; ảnh `index-3.jpg` 1440 của cả hai có đủ *Nội quy cạnh lò* và *Giờ mở và đường đi* (lần trước ra trống). Không lượt nào đọc `run.mjs`, `deep.mjs` (lần trước 2 · B lượt 15, 19–20).
2. **Lượt vào B3: đã ăn.** Lượt 2 của cả hai lần có `Read` `b3-b4.md`, bốn file dự án, `site/_system.html`, `site/assets/site.css` và lệnh 2. Sau đó không đọc lại các file này, không `cat concept/c.html`; đọc mã skill 0 lệnh (lần trước 1 lệnh mỗi lần, cộng 3 lượt đọc mã bộ kiểm ở 2 · B). Lượt dựng bắt đầu ngay ở lượt 3 (lần trước: lượt 6 và 8). Còn 2 · B lượt 4 grep tên token trong `tokens.css` (44k).
   - `fixes-site.js` dòng 1 tính cả kết quả lệnh 2 (luật, `concept/c.html`, `ls`) vào `rules-and-conflicts.md`: 22,3k ký tự, trong đó phần luật vẫn khoảng 10k.
3. **Khuôn `system.html`: đã ăn.** Không lần nào lỗi tương phản vì chữ của khuôn. Lỗi tương phản của 1 · B lượt 7 (`span.t "9:30"` 2,16:1) do CSS của agent (`.door{color:inherit}` trên cửa than hồng), không do khuôn.
4. **Tên ảnh của `qa-check.py`: đã ăn.** Không lượt `ls` nào để lấy tên ảnh (lần trước 1 lượt mỗi lần). 2 · A lượt 9 có `ls _qa` nhưng để sửa `query` của file bước, không để lấy tên ảnh.

Vấp còn lại, theo transcript và báo cáo agent:
- **`system-check.mjs` báo tràn ngang mà không nêu phần tử** (cả hai lần pha 1; cùng lỗi của agent: khung ảnh vòm `aspect-ratio` giãn theo hàng lưới). 1 · A lượt 10 tự chèn script dò rồi `chromium --dump-dom` (19k); 1 · B lượt 8 mở ảnh cả trang để tìm (19k).
- **Lệnh kiểm không bắt chữ tràn khỏi khối của nó** ở khung hẹp đặt trên trang 1440 (giờ trên cửa cỡ theo `vw` đè sang cửa bên, nút xuống dòng): cả hai lần pha 1 chỉ thấy khi mở ảnh, thêm một vòng sửa, kiểm và mở lại 10–11 ảnh. 1 · B còn lỗi lấn 3px ở 320 mà bộ kiểm báo "trong khung 0".
- **Mở lại mọi ảnh sau mỗi lần chạy sạch:** 1 · B mở 10–11 ảnh 3 lần, 4 lượt chỉ mở ảnh (160k); 1 · A 2 lượt (85k).
- **`qa-query` đóng băng trong file bước:** 2 · A lần kiểm đầu có CẢNH BÁO `qa-query`, agent sửa `_qa/steps-smoke-index.json` (lượt 9–10, khoảng 45k) rồi chạy lại.
- `system-check.mjs` chỉ in mã cảnh báo preflight (P13); 1 · B chạy riêng `preflight.py` (lượt 13).
- Cổng 3 không lưu các lựa chọn đã trình, nên câu "chấp nhận ngoại lệ ở màn đó" vẫn phải suy (lỗi của prompt đo).

Chỗ tốn nhất còn lại: vòng tự soát `_system.html` (1 · A lượt 9–14, 162k; 1 · B lượt 7–16, 327k); vòng B4 sau lần kiểm đầu (2 · A lượt 9–16, 258k; 2 · B lượt 11–15, 181k); lượt vào B3 mang theo 160–173k (nội dung cần dùng); SKILL.md 39–44k.

Đề xuất tiếp (ước từ số đo):

| # | Việc | Ước tiết kiệm mỗi lần | Chắc chắn |
|---|---|---|---|
| 1 | `system-check.mjs` (và bộ kiểm B4) nêu phần tử gây tràn ngang: thẻ, lớp, cạnh phải | pha 1: khoảng 20k, có khi bớt một vòng | cao: cả hai lần pha 1 |
| 2 | Đo chữ tràn khỏi khối cha trong khung hẹp (`scrollWidth > clientWidth` của phần tử chứa chữ, không chỉ của trang) | pha 1: 0–80k (một vòng sửa, kiểm, mở ảnh) | trung bình: cả hai lần gặp, nhưng chưa rõ đo được hết |
| 3 | `qa_init.py`/`run.mjs` đọc `qa-query` của trang lúc chạy, không đóng băng vào file bước | pha 2: 0–45k | trung bình: một trong hai lần (lần đo trước cũng một lần) |
| 4 | Sau lần sửa chỉ đổi CSS của vài component, chỉ mở lại ảnh của màn có component đó | pha 1: 40–80k | thấp: dễ sót lỗi lan sang màn khác |

Transcript (phiên `86d5c0dc-…`), ảnh và `DECISIONS.md`:

| Pha · lần | Agent | Thư mục chạy | Ảnh |
|---|---|---|---|
| 1 · A | `aa1d9c2de1329ee76` | `/tmp/measure/rd1a` | `runs-4.5-sua/rd1a/dark-1440-full.png` |
| 1 · B | `a196c9ce671e2c4bf` | `/tmp/measure/rd1b` | `runs-4.5-sua/rd1b/lo-cui-1440-full.png` |
| 2 · A | `a7118861a730a4e86` | `/tmp/measure/rd2a` | `runs-4.5-sua/rd2a/20261005-0306/` |
| 2 · B | `a6b151f730a9c8899` | `/tmp/measure/rd2b` | `runs-4.5-sua/rd2b/20261005-0304/` |

File transcript ở `transcripts/site-4.5-sua/agent-<id>.jsonl.gz`, kèm `.meta.json`.

Chất lượng: pha 1 mang rõ concept C (vòm than hồng, vòm gạch, hàng bốn cửa tro/than/gạch, Fraunces), hai trường hợp khó có trên trang. Pha 2 màn đầu 1440 như lần trước: vòm "9:30", H1 hai dòng, nút "Giữ bánh mẻ 9:30 qua Zalo" trong màn đầu. Cả hai lần pha 2 hiểu "ngoại lệ ở màn đó" là bỏ `.ember`.

### Review B4 bằng agent `Explore` (đo 05/10)

Subagent trên cloud không gọi được subagent con, nên review chạy từ phiên chính: mỗi lần một agent `Explore`, prompt nguyên văn `qa-gate.md` mục 7, `{danh sách ảnh}` đúng dạng `qa-check.py` mới in. Đầu vào là kết quả hai lần đo lại pha 2 (`rd2a`, `rd2b`, lần chạy bộ kiểm mới nhất). Chạy song song, chạy nền; phiên chính không chờ nên không có khoản mất cache của agent cha.

| Review | Agent | Ngữ cảnh lượt 1 | Lượt | Quy đổi | Phút | Mốc nền (`general-purpose`) |
|---|---|---|---|---|---|---|
| `rd2a` | `a6752bcb4dedc27e9` | 32k | 20 | 0,36–0,37M | 3,9 | A: 0,83–0,85M, khởi đầu 37–38k |
| `rd2b` | `af5b7f7e8338b6173` | 32k | 17 | 0,33M | 4,0 | B: 0,95–0,96M (thêm 0,33M agent cha mất cache khi chờ 8,8 phút) |

- Giảm khoảng 60 % so với mốc nền, nhiều hơn ước tính 0,06–0,08M lúc lên kế hoạch: ngoài loại agent, prompt mới đưa sẵn danh sách ảnh và bắt đọc mã bằng `grep -n`. Review chạy dưới 4 phút, nên khi agent dựng chờ review (subagent, TTL 5 phút) sẽ không mất cache như mốc nền B, nếu vẫn dưới 5 phút.
- Chưa theo luật mở ảnh một lượt: `rd2a` mở 31 ảnh trong 8 lượt, `rd2b` 30 ảnh trong 5 lượt (một vài ảnh mỗi lượt, xen lệnh đọc mã). Không đọc lại file nào; `rd2b` lượt 11 `cat -n site.css` cả file (14,2k ký tự), `rd2a` lượt 14 đọc `index.html` 218 dòng (16,3k).

Chất lượng (so với mốc nền: kết luận "làm lại", 3–5 mục Nên sửa có ảnh và `file:dòng`):
- Cả hai kết luận **làm lại** (một vòng sửa ngắn, không chặn). `rd2a` 7 Nên sửa, 5 Nhỏ; `rd2b` 4 Nên sửa, 7 Nhỏ. Mỗi mục có `file:dòng` và ảnh cụ thể (khổ, tên ảnh, toạ độ).
- Bằng chứng đúng khi soát lại: `.num` thiếu `white-space:nowrap` (`site.css:12`/`:13`, số Zalo gãy dòng ở 390 và 768, cả hai review cùng thấy); nút màn đầu `rd2a` chỉ mở `zalo.me` trần (`index.html:50`); câu lặp "để Cô Ba để phần" (`index.html:174`); khung ảnh `aspect-ratio:auto; min-height` giãn theo cột (`rd2b` `site.css:139`).
- `rd2b` mục 1 là lỗi logic chỉ thấy qua mã: khi mẻ trước còn bánh, nút chính và panel mở sẵn trỏ mẻ chưa vào lò (`index.html:164–167`). Bộ kiểm không thấy vì chỉ chụp `?gio=8:40`.
- Thứ đã khoá ở cổng (vòm gạch giữa hai mẻ, bề rộng hàng cửa 36rem) được nêu riêng, không đề xuất đổi.
- Hai review cùng ghi ở *Không đánh giá được*: bộ khói chỉ chụp một trạng thái giờ; `slices: 8` cắt mất phần dưới `_system` (nhất là ở 390, 33–35 ô màu xếp một cột); lượt kiểm sâu chỉ chạy ở 1440; không có ảnh khổ 320 của trang thật.
- Đánh giá: tốt ngang hoặc hơn mốc nền (nhiều mục Nên sửa hơn, có một lỗi logic thật), với chưa tới nửa chi phí.

Transcript: `transcripts/review-4.5/agent-<id>.jsonl.gz`.

Gợi ý từ review, chưa làm: bộ khói chụp thêm các trạng thái mà trang khai *(ví dụ nhiều giá trị `qa-query`)*, vì cả hai review và hai lần dựng đều ghi chỉ trạng thái 8:40 được chụp; trang `_system` cần nhiều hơn 8 màn ở 390.

## sketch-to-site: đo cuối sau mọi chỗ sửa (cloud, 05/10/2026)

Skill ở commit `a8587e8` trên `measure/site-4.5` (mọi chỗ sửa gộp vào CHANGELOG 1.5.0): 4 chỗ sửa đợt trước; bộ kiểm nêu phần tử gây tràn ngang và đo hộp tràn khỏi khối cha; `run.mjs` đọc `qa-query` của trang lúc chạy; `<meta name="qa-states">` cho bộ khói đo và chụp màn đầu từng trạng thái; `_system` chụp tới 16 màn, ô màu hai cột ở 390. Test 320 qua, 2 bỏ qua (chỉ Windows), trên 322. Thư mục chạy `/tmp/measure/rf1a`, `rf1b`, `rf2a`, `rf2b`; review chạy từ phiên chính bằng agent `Explore` như lần đo review trước. Không lần nào mất cache.

| Đợt | Pha 1 · A | Pha 1 · B | Pha 2 · A | Pha 2 · B | Review A | Review B |
|---|---|---|---|---|---|---|
| Mốc nền 4.4 (Windows) | 59 lượt · 1,46–1,51M | 69 · 1,90–1,97M | 59 · 1,57–1,61M | 66 · 2,29–2,35M | 0,83–0,85M | 0,95–0,96M (+0,33M cha mất cache) |
| 4.5 lần đầu | 15 · 0,50–0,54M | 17 · 0,47–0,50M | 21 · 0,69–0,72M | 28 · 0,76–0,79M | không chạy | không chạy |
| Sau 4 chỗ sửa | 17 · 0,52–0,56M | 17 · 0,56–0,60M | 18 · 0,58–0,61M | 17 · 0,55–0,57M | 0,36–0,37M | 0,33M |
| **Cuối** | **14 · 0,49–0,52M** | **16 · 0,49–0,53M** | **16 · 0,53–0,56M** | **16 · 0,53–0,56M** | **0,44–0,45M** | **0,42–0,43M** |

- **Cả quy trình một lần** (pha 1 + pha 2 + review): khoảng 1,45–1,55M, so với 3,9–5,2M của mốc nền: giảm khoảng 65–70 %. Mức này vượt xa ngưỡng 25 %, nên dù khác máy vẫn kết luận được.
- **Pha 1:** 0,51M trung bình, ngang hai đợt trước (0,50M và 0,58M); lượt ít nhất từ trước tới giờ (14 và 16).
- **Pha 2:** 0,545M cả hai lần, thấp nhất; 16 lượt mỗi lần (mốc 59–66).
- **Review:** tăng từ 0,33–0,37M lên 0,42–0,45M vì có thêm ảnh để xem: ảnh trạng thái ở ba khổ và `_system` nhiều màn hơn (mở 36 và 55 ảnh, đợt trước 30–31). Vẫn khoảng một nửa mốc nền, chạy 3,4–4,7 phút (dưới TTL 5 phút của subagent nếu agent dựng chờ).

Soát các chỗ sửa:
1. **Phần tử gây tràn, hộp tràn khỏi khối cha: đã ăn.** Pha 1 B lượt 9: lệnh kiểm báo "trong khung" (giờ "15:00" tràn khỏi vòm hẹp trong lưới 3 cột), agent sửa ở gốc bằng `cqi` ở lượt 10. Không lần nào dựng trang dò hay mở ảnh cả trang để tìm chỗ tràn (đợt trước: 19k mỗi lần ở cả hai lần).
2. **`qa-query` đọc lúc chạy: đã ăn.** Cả hai lần pha 2 khai `qa-query` và `qa-states` trong trang, không sửa file bước nào; `qa-check.py` chạy 2 lần mỗi lần (đợt trước 4 và 2; đợt đầu 3 và 4).
3. **`qa-states`: đã ăn, và đổi chất lượng review.** Cả hai trang khai 6 trạng thái (A: 11:00, 17:10, 18:10, 18:40, 5:00, thứ Hai; B: 4:30, 11:00, 16:40, 17:50, 19:30, thứ Hai); bộ khói 30 bước. Review B thấy lỗi nút chính trỏ khác mẻ trên vòm ngay trên ảnh `index@gio_16_40.jpg` (vòm "17:30", nút "Giữ bánh mẻ 15:00"); đợt trước lỗi cùng loại chỉ thấy khi đọc mã. Review A dẫn `index@gio_18_10.jpg` (dòng phụ rớt "19:00") và `index@gio_5_00.jpg` (vòm sáng lúc tiệm chưa mở).
4. **`_system` 16 màn, ô màu hai cột: ăn một phần.** Ở 1440 `_system` chụp đủ (10 màn, đợt trước cắt ở 8). Ở 390 vẫn cắt ở màn 16, vì pha 2 bắt đầu từ `r3-gate3` có `_system.html` dựng bằng khuôn 4.4 (ô màu 180px, một cột ở 390). Khuôn mới (150px) chỉ có ở pha 1, mà `system-check.mjs` chụp ở 1440, nên chưa thấy được trên ảnh 390.

Chất lượng: pha 1 giữ concept C (vòm than hồng, gạch, tro, Fraunces), hai trường hợp khó có trên trang; pha 2 màn đầu như các đợt trước. Hai review kết luận **làm lại** (4 và 3 mục Nên sửa, 7–8 Nhỏ), có `file:dòng` và ảnh; thứ đã khoá ở cổng chỉ nêu. Lỗi chung của cả hai bản dựng mà review bắt: H1 ngắt xấu ở 390, số Zalo gãy dòng (`.num` thiếu `nowrap`), panel mẻ hai cột có cột chết dưới ảnh.

Còn lại, theo transcript và báo cáo agent:
- `system-check.mjs` chỉ in "1 cảnh báo" preflight, không in dòng nào (cả ba đợt; pha 1 A đợt này lượt 8 chạy riêng `preflight.py`).
- Mở lại mọi ảnh sau mỗi lần chạy sạch ở pha 1: 22 và 27 ảnh mỗi lần.
- Review mở ảnh rải trong 8–10 lượt, không một lượt.
- Lượt vào B3 không có `tokens.css`, `themes.json`: pha 2 B lượt 3 in thêm.
- `qa-check.py` xếp ảnh trạng thái theo chữ (`@gio_11_00` trước `@gio_5_00`).

Transcript: `transcripts/site-4.5-cuoi/` (`a001f0a3c99a5daac`, `ac98c6295a66d37e4` pha 1; `a2c5ad7e64ae0c948`, `a4266e3aa3b61800b` pha 2), review ở `transcripts/review-4.5/` (`ad345f204fd29b1c4` cho `rf2a`, `a2903d9dc45dcacde` cho `rf2b`). Ảnh và `DECISIONS.md` ở `runs-4.5-cuoi/` (pha 2 gồm cả ảnh trạng thái 1440).

Các chỗ còn lại ở trên đã sửa (commit `54fe187`, gộp vào CHANGELOG 1.5.0, test 321 qua, 2 bỏ qua, trên 323), **chưa đo lại bằng lần chạy skill**:
- `system-check.mjs` in mọi dòng cảnh báo preflight, đường dẫn tính từ thư mục prototype (`site/_system.html:91  P13  CẢNH BÁO …`).
- `system-check.mjs` in thư mục ảnh tuyệt đối và tên từng ảnh, và so ảnh với lần chạy trước: `đổi so với lần chạy trước (chỉ cần mở lại các màn này): …` hay `không màn nào đổi`. `b0-b2.md`: lần sạch đầu mở mọi màn, các lần sau chỉ mở màn đổi. Để so được, `run.mjs` cho chuyển động hữu hạn chạy xong và dừng chuyển động lặp vô hạn ở khung đầu trước khi chụp `full`/`slices` (spinner "Đang mở Zalo" của `rf1b` làm màn 5 lần nào cũng khác). Thử trên bản chép `rf1b`: chạy lại không sửa thì "không màn nào đổi"; đổi một câu thì báo đúng một màn.
- Lệnh 2 in tên mọi token (khoảng 1k ký tự trên `r3-gate3`).
- Prompt review: mở mọi ảnh trong một tin nhắn trước khi đọc mã, `_system` chỉ ở 1440.
- `qa-check.py` xếp ảnh trạng thái theo số; thử trên bản chép `rf2b`: `@gio_4_30, @gio_11_00, @gio_16_40, …`.

## sketch-to-site: sau 4.5 trên Windows, cùng máy với mốc nền (05/10/2026)

Đo skill ở HEAD của `measure/site-4.5` (`8627382`, skill như `54fe187`: mọi chỗ sửa gộp vào CHANGELOG 1.5.0, kể cả các chỗ nhỏ sau lần đo cuối trên cloud). Máy Windows của mốc nền: Node 20.19.5, Python 3.14, Edge (lệnh kiểm tự dò), Git Bash, model Opus 5.5. Test 323/323 qua, kể cả 2 test chỉ chạy trên Windows. Cùng thư mục bắt đầu (`r2-chosen`, `r3-gate3`) và prompt nguyên văn của mốc nền. Hai lần mỗi pha chạy song song, subagent `general-purpose` chạy nền. Thư mục chạy `rw1a`, `rw1b`, `rw2a`, `rw2b` trong scratchpad của phiên `29ddcf7f-01fa-4e4e-a5e5-80ea87e757fb`.

Khác các lần đo cloud ở hai chỗ:
- Cùng máy với mốc nền, nên tổng token so thẳng được; ngưỡng là 15 %, không phải 25 %.
- Trên máy này subagent gọi được subagent con. Pha 2 vì vậy chạy review `Explore` trong chính lần chạy, chờ kết quả, rồi sửa theo review. Trên cloud, review chạy riêng từ phiên chính và không có vòng sửa sau review.

Trước khi đo, chạy lại `phase-site.js` (cả `--list`), `fixes-site.js` và `attrib.js` bản trong repo trên bốn transcript mốc nền, so với bản cũ ở `~/.claude/projects/…/measure-kit/`:
- `phase-site.js` và `fixes-site.js`: giống hệt.
- `attrib.js`: chỉ khác ở hai lần pha 2, vì giờ tính ảnh `.jpg` là ảnh (khoảng 100k chuyển từ "đọc file dự án" sang "ảnh"). Tổng không đổi.
- Số mốc nền vì vậy giữ nguyên.

### Số đo

Quy đổi thô lấy từ `parts2.js`. "Bỏ mất cache" trừ phần ghi lại ngữ cảnh ở lượt mất cache (`fixes-site.js` dòng 9). Số theo bước lấy từ `phase-site.js`.

| Pha · lần | Lượt | Quy đổi thô | Bỏ mất cache | Phút | B0 | B1 / B3 | B2 / B4 | Cổng | Mốc nền 4.4 |
|---|---|---|---|---|---|---|---|---|---|
| 1 · A | 12 | 0,64–0,69M | 0,53–0,58M | 16,4 | 2 · 66k | B1 1 · 27k | B2 8 · 527k | 1 · 41k | 59 lượt · 1,46–1,51M · 18,3' |
| 1 · B | 10 | 0,59–0,63M | 0,49–0,53M | 15,2 | 2 · 67k | – | B2 7 · 505k | 1 · 37k | 69 · 1,90–1,97M · 24,2' |
| 2 · A | 19 | 1,26–1,31M + review 0,33–0,35M | 0,85–0,90M + review | 25,8 | 4 · 139k | B3 3 · 339k | B4 10 · 712k | 2 · 89k | 59 · 1,57–1,61M + review 0,83–0,85M |
| 2 · B | 15 | 1,21–1,27M + review 0,33–0,34M | 0,84–0,90M + review | 26,8 | 3 · 124k | B3 2 · 302k | B4 8 · 715k | 2 · 90k | 66 · 2,29–2,35M + 0,95–0,96M (bỏ mất cache 1,96–2,02M + 0,72–0,73M) |

- **Pha 1:** −55 % và −68 % số thô; −62 % và −73 % khi bỏ mất cache. Ngang lần đo cuối trên cloud (14 và 16 lượt, 0,49–0,53M).
- **Pha 2, kể cả review:** −50 % và −56 % khi bỏ mất cache.
  - Phần trước review (lượt vào → gọi review, cộng Cổng 4) khoảng 0,55–0,61M, ngang cloud (0,53–0,56M).
  - Vòng sửa sau review tốn 0,29–0,30M. Cloud không có vòng này.
- **Cả quy trình một lần** (pha 1 + pha 2 + review):

  | | Lần A | Lần B |
  |---|---|---|
  | Số thô | 2,23–2,35M (mốc 3,86–3,97M) → −39–44 % | 2,13–2,24M (mốc 5,14–5,28M) → −56–60 % |
  | Bỏ mất cache | 1,71–1,83M (mốc 3,86–3,97M) → −53–57 % | 1,66–1,77M (mốc 4,58–4,72M) → −61–65 % |

  Mốc nền A không có vòng sửa sau review: review chạy nền, về sau khi đã bàn giao. Mức giảm thật của A vì vậy còn lớn hơn số trên một chút.
- **Đính chính số cloud:** "cả quy trình 1,45–1,55M" ở mục đo cuối trên cloud thiếu vòng sửa sau review. Một lần chạy thật, trong phiên chính, tốn khoảng 1,7–1,8M, giảm 53–65 % so với mốc, không phải 65–70 %.

Mất cache. Mốc nền không có lượt nào quá 5 phút. Bản 4.5 ít lượt hơn nên mỗi lượt làm nhiều hơn, và cả 4 lần đều mất cache:

| Lần | Lượt mất cache | Tốn thêm | Lượt trước đó |
|---|---|---|---|
| 1 · A | 6 | 107k | lượt 5 nghĩ 472s, viết 54s |
| 1 · B | 6 | 103k | lượt 5 nghĩ 263s, viết 167s |
| 2 · A | 6 | 131k | lượt 5 dựng trang: nghĩ 431s, viết 78s |
| 2 · A | 11 | 281k | chờ review 7,0 phút |
| 2 · B | 5 | 103k | lượt 4 dựng: nghĩ 457s, viết 139s |
| 2 · B | 9 | 264k | chờ review 7,6 phút |

Cả hai loại chỉ có khi skill chạy dưới dạng subagent (TTL 5 phút). Phiên chính có TTL 1 giờ.

### Soát từng việc của 4.5

1. **Kiểm một lệnh: đã ăn.**
   - Pha 1: `system-check.mjs` chạy 2 lần mỗi lần, lần cuối `Kết luận: SẠCH` trước Cổng 3 (A lượt 10, B lượt 8). Agent tự gọi `run.mjs` 0 lần, chụp tay 0 lệnh, đọc mã skill 0 lệnh (mốc: 10–11 lệnh, 0,27–0,31M).
   - Pha 2: `qa-check.py` chạy 3 lần (A lượt 8, 13, 16) và 2 lần (B lượt 6, 11). Không tự viết bộ cuộn hay file bước, không sửa file bước, không kết quả nào bị cắt giữa, đọc mã 0 lệnh (mốc 0,25–0,46M).
   - Node 20 trên Windows: không lần nào hỏng vì thiếu `--experimental-websocket`. Đây là lần đầu phần tự thêm cờ được thử thật; cloud chạy Node 22.
2. **Gộp lượt: đã ăn.**
   - Lượt có từ 2 lệnh: 8/12, 6/10, 10/19, 9/15 (mốc 6/59, 23/69, 13/59, 15/66).
   - Lượt chỉ mở ảnh: pha 1 mỗi lần 2 lượt, 80–85k (mốc 8 và 13 lượt, 0,23M và 0,44M); pha 2 A 1 lượt, B 0, vì ảnh mở cùng lượt sửa `BUILD-LOG.md` (mốc 12 và 9 lượt, 0,43M và 0,31M).
   - Ảnh của mỗi lần kiểm đều mở trong một lượt, ở cả 4 lần và cả hai review.
3. **Khuôn `system.html`: đã ăn.** Không vòng sửa nào vì tràn ngang ở 390, vì `.sys p`/`.sys h2` đè component hay vì mẫu chữ. Vòng sửa của pha 1 là lỗi CSS và nội dung của agent:
   - danh sách nội quy giãn theo cột bên: cả hai lần (`align-content:start`);
   - in đậm giả chữ mono: B;
   - chữ mồ côi, bộ chọn số bánh vẫn hiện khi mẻ đã hết: A;
   - hàng cửa thứ Hai dính sát khay: B.
4. **B1 trên `_system.html`: đã ăn.** Không có trang HTML thử nào ngoài `site/`. Hai trường hợp khó có trên `_system.html` (khu "Trường hợp khó") và trong `DECISIONS.md` (A dòng 77, B dòng 79). Chi phí B1: A một lượt đọc `concept/c.html` (27k); B không có lượt riêng (mốc 0,28–0,46M).
5. **Tách SKILL.md: đã ăn.**
   - SKILL.md 17,9k ký tự, đọc một lần, mang theo 26–37k (mốc 32,9k ký tự, 0,15–0,18M).
   - Lối vào một lượt:
     - pha 1, lượt 2 của cả hai lần: `b0-b2.md`, `CONCEPT.md`, `DECISIONS.md` và lệnh 1;
     - pha 2, lượt 2 của cả hai lần: `b3-b4.md`, bốn file dự án (`BUILD-LOG.md` chưa có nên đọc khuôn), `_system.html`, `site.css` và lệnh 2 (có tên token).
   - Không đọc lại, không `cat` các file đó, không đọc `tokens.css` hay `themes.json`.
   - Vấp: pha 2 tốn thêm lượt 3 (A thêm lượt 4) để tìm danh sách lựa chọn câu 3 của Cổng 3 (15k và 32k). Xem đề xuất 4.
6. **In đúng mục bằng `sed`: đã ăn.**
   - `rules-and-conflicts.md` không lần nào bị đọc nguyên: pha 1 4,4k ký tự; pha 2 25k, gồm cả `concept/c.html`, `ls`, tên token của lệnh 2 và mục F (mốc 19,2k đọc nguyên mỗi lần).
   - `qa-gate.md`: 8,4k ký tự, một phần (mốc 18k đọc nguyên).
7. **Review `Explore`, chờ kết quả: đã ăn. Lần đầu đo được trong chính lần chạy.**
   - Cả hai lần gọi `Explore` chờ kết quả (`requestShape: foreground`). Kết quả về trước khi bàn giao, và agent sửa hết 4 mục Nên sửa.
   - Khởi đầu 26k (mốc 37–38k); 15 và 14 lượt; 0,33–0,35M và 0,33–0,34M (mốc 0,83–0,85M và 0,95–0,96M): giảm 60–65 %.
   - Mở ảnh trong **một** lượt (31 và 37 ảnh): chỗ sửa prompt ở `54fe187` đã ăn; cloud mở trong 5–10 lượt.
   - Review chạy 7,0 và 7,6 phút, nên agent cha mất cache khi chờ (bảng trên).

Các chỗ sửa ở `54fe187`:
- **`system-check.mjs` nêu màn đổi, B2 chỉ mở lại các màn đó: đã ăn.** A mở lại 5/10 màn (lượt 11), B 4/11 (lượt 9), đúng danh sách lệnh in. Lần đo cuối trên cloud mở lại 22 và 27 ảnh.
- **Lệnh 2 in tên token: đã ăn.** Pha 2 không đọc thêm `tokens.css`, `themes.json`.
- **Prompt review mở mọi ảnh trong một tin nhắn, `_system` chỉ ở 1440: đã ăn.**
- **Chưa thử được:**
  - dòng cảnh báo preflight trong `system-check.mjs`: cả 4 lần 0 cảnh báo;
  - xếp ảnh trạng thái theo số: cả hai trang chỉ khai giờ hai chữ số.

### Chất lượng (chỉ mở ảnh)

- **Pha 1:** `lo-cui-1440-full.png` của cả hai lần mang rõ concept C: nền muội than, Fraunces, vòm than hồng/gạch/tro, hàng bốn cửa. Hai trường hợp khó có khu riêng trên trang.
- **Pha 2:** màn đầu 1440 như mốc nền và các đợt cloud: vòm than hồng ôm "9:30", H1 hai dòng, nút giữ bánh trong màn đầu (B ghi "Giữ bánh mẻ 9:30 qua Zalo"). Cả hai hiểu "ngoại lệ ở màn đó" là bỏ `.ember`.
- **Review:** cả hai kết luận **làm lại**, 4 Nên sửa (A thêm 4 Nhỏ, B thêm 7 Nhỏ), có `file:dòng` và toạ độ trên ảnh. Mỗi review có một lỗi chỉ thấy qua mã:
  - A: nút giữ bánh mẻ hôm sau mất chữ "sáng mai" (`index.html:240`);
  - B: không có link `tel:` nào.

  Tốt ngang hoặc hơn mốc nền.
- **Lỗi lặp ở mọi lần pha 2** (cả 4 lần cloud cuối và 2 lần này): số Zalo gãy dòng (`.num` thiếu `nowrap`), H1 ngắt xấu ở 390/768, khung ảnh trong panel hai cột giãn hoặc để cột chết. `.num` đến từ `site.css` của `r3-gate3` (bản 4.4), nên ít nhất một phần là do đầu vào cố định.

### Chỗ tốn nhất còn lại (số của `groupcost.js`, không gồm phần mất cache)

1. **Vòng sửa sau review**, pha 2: A lượt 11–17, 297k; B lượt 9–13, 288k.
   - Một lượt riêng chỉ để in mục F (A 11, B 9).
   - Mở lại ảnh sau khi sửa: B lượt 12 mở lại cả 37 ảnh; A lượt 14 mở 17 ảnh, lượt 17 mở 5 ảnh.
   - A lượt 15–17: tự gây lỗi khoảng cách dấu "·" khi sửa.
2. **Dựng** (cần thiết): pha 2 A lượt 5–7 312k, B lượt 4–5 295k; viết design system ở pha 1 228–239k.
3. **Lượt vào B3** mang theo 160–186k nội dung cần dùng.
4. **Lần kiểm đầu và ảnh ở pha 2**: 170–172k, với 33–37 ảnh trong một lượt.
5. **Review đi dò `_qa/`** (`handover.json`, `report.json`, `deep.mjs`) để biết kết quả bộ kiểm: A lượt 4–9, B lượt 4–7, khoảng 50–75k và 1 phút mỗi review.

### Đề xuất bước tiếp (ước từ số đo; chưa sửa skill)

| # | Việc | Ước tiết kiệm mỗi lần chạy | Chắc chắn |
|---|---|---|---|
| 1 | Prompt review (`qa-gate.md` mục 7) kèm các dòng số của `qa-check.py` (console, FAIL, tràn, cắt, tương phản, ý định, sâu), để review không phải dò `_qa/` | 50–75k và khoảng 1 phút | cao: cả hai review đều dò, 3–6 lượt |
| 2 | `qa-check.py` nêu màn đổi so với lần chạy trước như `system-check.mjs`; bước 2 của B4 chỉ mở lại các màn đó | 20–50k | khá cao: cơ chế này đã ăn ở pha 1 (4–5 trên 10–11 ảnh) |
| 3 | In mục F (1,9k ký tự) cùng lượt gọi review, không đợi review về mới in | 25–35k (một lượt ở ngữ cảnh 250–280k) | cao: cả hai lần tốn một lượt riêng |
| 4 | Khối Cổng 3 trong `DECISIONS.md` ghi các lựa chọn đã hỏi, để lần vào lại đối được đáp án không khớp nguyên văn | 15–32k | cao, nhưng chỉ có lợi khi vào lại ở phiên mới với đáp án không nguyên văn; prompt đo luôn gặp trường hợp này |
| 5 | Lệnh 1 của pha 1 in `concept/<id>.html` như lệnh 2 | 0–27k | thấp: chỉ A tốn lượt riêng |

Cả 5 việc cộng lại khoảng 0,1–0,2M mỗi lần chạy, tức 6–10 % của 1,7–1,8M, dưới mức dao động giữa hai lần chạy. Phần token mà skill tự quyết đã tới mức lợi giảm dần.

Không đáng làm để giảm token:
- **Thêm kiểm máy cho các lỗi lặp** (số gãy dòng, H1 mồ côi, khung ảnh giãn, đậm giả, danh sách giãn trong lưới). Bắt sớm chỉ dời vòng sửa lên trước chứ không bỏ được nó: review vẫn tìm ra lỗi logic ở mỗi lần, nên vòng sửa sau review vẫn còn. Đáng làm nếu vì chất lượng.
- **Né mất cache** (lượt dựng dài, chờ review 7 phút): chỉ có khi chạy dưới dạng subagent.

### Transcript và dữ liệu

| Pha · lần | Agent | Review | Thư mục chạy | Ảnh và `DECISIONS.md` |
|---|---|---|---|---|
| 1 · A | `ae2f12f475cf539cc` | – | `rw1a` | `runs-4.5-win/rw1a/lo-cui-1440-full.png` |
| 1 · B | `addbba5d57be6865c` | – | `rw1b` | `runs-4.5-win/rw1b/lo-cui-1440-full.png` |
| 2 · A | `a2c62bc41dd58df22` | `a8c649812f5c97013` (Explore, chờ) | `rw2a` | `runs-4.5-win/rw2a/20261005-1317/` |
| 2 · B | `a7e241d76636f5e2b` | `a841ce86e65c8bb62` (Explore, chờ) | `rw2b` | `runs-4.5-win/rw2b/20261005-1317/` |

- Bản gốc nằm ở `~/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/29ddcf7f-01fa-4e4e-a5e5-80ea87e757fb/subagents/`.
- Bản nén nằm ở `transcripts/site-4.5-win/agent-<id>.jsonl.gz`, kèm `.meta.json`.
- Ảnh pha 2 gồm cả ảnh trạng thái 1440.

## Ba skill sửa: bản cũ và bản mới (đo 05/10/2026)

Đợt `70bd133` chuyển cách giảm token của `sketch-to-concept` và `sketch-to-site` sang `evolve-site` 1.9, `tweak-site` 1.3 và `handover-check` 1.3 (gộp vào CHANGELOG 1.5.0). Ba skill này chưa có mốc nền, nên phiên đo chạy cùng việc trên bản cũ (`2fbc10d`: evolve-site 1.8, tweak-site 1.2, handover-check 1.2) và bản mới, mỗi bản là một git worktree trong scratchpad của phiên đo. Prompt của phiên đo: `prompt-edit-cu-moi.md`.

### Ba kịch bản, nối tiếp nhau

| Kịch bản | Skill | Thư mục bắt đầu | Lời người dùng (rút gọn; nguyên văn ở prompt) | Dừng ở |
|---|---|---|---|---|
| T | `tweak-site` | `r4-bangiao` | Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa | Báo cáo của skill |
| E | `evolve-site` | `r5-sau-tweak` | Thêm hộp giữ bánh (sheet ở điện thoại, hộp thoại ở máy tính), các cổng chỉ định sẵn | Cổng 3 |
| H | `handover-check` | `r6-sau-evolve` | Kiểm tổng trước khi gửi link cho khách | Cổng nghiệm thu, không promote |

- Kịch bản T là Cấp 1 không cờ, có tiền lệ (nút `btn-ghost` Xem đường đi), nên đi thẳng `tweak-site`. Kịch bản E là Cấp 2 (lớp phủ). Trang chưa có lớp phủ nào nên dính cờ T; lời người dùng chỉ định sẵn lối vào, phương án hiển thị và quyền thêm component, để skill bỏ được Cổng 1 và Cổng 2 theo luật "câu lệnh đã chỉ định tường minh". Kịch bản H kiểm tổng sau hai lần sửa đó.
- `r5-sau-tweak` và `r6-sau-evolve` do phiên đo dựng từ một lần chạy bản mới (bước 5 và 7 của prompt), như `r3-gate3` dựng từ pha 1. Bản cũ ở kịch bản sau vì vậy bắt đầu từ thư mục do bản mới sửa; `qa_init.py --update` của bản cũ chép lại script bộ kiểm cũ, còn `FEATURE-DECISIONS.md` cùng khuôn ở hai bản.
- Mỗi kịch bản 4 lần, chạy theo cặp cũ và mới song song. Tổng 12 lần, ước 8–15M token quy đổi, phần lớn ở kịch bản E.

### Thư mục bắt đầu `r4-bangiao`

- `sample/` là prototype của pha 2 lần A trong lần đo Windows (`rw2a` của phiên `29ddcf7f`, skill `54fe187`): một trang chủ và `_system.html`, theme `dark`, 6 bộ khói, lần chạy tổng cuối sạch (`20261005-1317`: 27 bước, mọi mục 0).
- Đã làm thêm, không tính vào số đo:
  - ghi đáp án Cổng 4 "Chốt." vào `DECISIONS.md`;
  - `python _qa/handover.py promote _qa/handover/20261005-1317` thành mốc bàn giao đầu;
  - bỏ `_qa/handover/`, `_qa/__pycache__`, `_qa/.kit-source`;
  - `AGENTS.md` của dự án lấy từ khuôn `AGENTS-qa.md` của bản cũ (bản prototype nhận lúc bàn giao), để không gợi ý `--shots` cho bên chạy bản cũ.
- Script bộ kiểm trong `_qa/` là bản `54fe187`, giống bản cũ. `run.mjs`, `probes.js`, `color.js`, `deep.mjs` giống nhau ở cả hai bản, nên `qa_init.py --update` không làm mốc lệch.
- Git bỏ qua `_qa/current/` theo `_qa/.gitignore` của bộ kiểm. Với `r4-bangiao`, `current/` trùng `last-green/` (promote chép nguyên), nên prompt dựng lại nó sau khi chép. `r5-sau-tweak` và `r6-sau-evolve` có `current/` riêng (kèm `ledger.jsonl`): commit thì `git add -f`.

### Script

- `phase-edit.js` chia bước như sau. `tweak-site`: vào, tìm, đọc, sửa, kiểm, ảnh, nhật ký, báo cáo, theo dấu hiệu của chính lượt (sửa rồi kiểm lại thì quay về "sửa"). `evolve-site`: B1, B2 · cổng, B3, B4, Cổng 3. `handover-check`: B0–B1, B2, B3, B4, B5, B6, Cổng. Hai skill sau chỉ tăng bước. Lượt mở ảnh gộp với lượt ghi nhật ký (cách của `tweak-site` 1.3) được tính vào "nhật ký".
- Hai script đã chạy thử trên transcript giả lập của cả ba skill và trên transcript thật `a2c62bc41dd58df22` (pha 2 Windows). Phiên đo vẫn soát `--list` trên lần chạy thật đầu tiên của mỗi kịch bản trước khi lấy số.
- Sửa trong phiên đo, sau khi soát `--list` trên lần chạy thật (số dưới đây lấy bằng bản đã sửa):
  - **Lượt cuối là "báo cáo" ở cả ba skill.** Subagent giờ nộp báo cáo bằng lệnh `SubagentHandback`, không còn lượt chỉ có chữ. Lượt chỉ có lệnh đó được tính là lượt cuối.
  - **tweak:**
    - `grep` file dự án bằng đường dẫn tương đối, hay ngoài thư mục skills, trước lần sửa đầu: "tìm".
    - `sed -n`/`cat`/`head` vào `site/` hay `DESIGN.md` trước lần sửa: "đọc".
    - `qa_init.py` sau lần sửa: "kiểm", vì skill bản cũ chạy nó ngay trước lần kiểm.
    - Sau lần sửa, đọc `run.mjs` hay chạy `quick.py --help` là đi tìm cách chụp: "ảnh".
    - Sau lần sửa, lệnh có `FEATURE-DECISIONS` là tra khuôn: "nhật ký".
    - Lượt 1 luôn là "vào".
  - **evolve:**
    - Ảnh trong `_qa/.tdd/` trước B4 là gỡ lỗi bộ tính năng, vẫn tính B3.
    - Ghi khối "Cổng 3" chỉ được nhận khi đã vào B4. Khối tính năng ghi ở B3 có sẵn tiêu đề Cổng 3 của khuôn: trước khi sửa, rem1 bị tính Cổng 3 từ lượt 9.
  - **Ghi file qua Bash** (`cat >>`, `tee`, python `open(p,'w')` với `p='…'`) được nhận như Write/Edit cho `FEATURE-DECISIONS.md`, `DECISIONS.md`, `DESIGN.md`, `QA.md`. rec1 ghi khối Cổng 3 bằng `cat >>`.
  - **`paths.js`** rút gọn cả dạng `/c/Users/…` của Git Bash. rec1 viết đường dẫn theo dạng này.
  - **`fixes-edit.js`** nhận "in đầu `run_all.py` theo lệnh 2" trên mọi lệnh. Dấu `;` trong `sed -n '/^#/!q;p'` làm biểu thức dò mã không bắt được.
- `handover-check` bản cũ chạy `handover.py run` nền rồi đọc tài liệu B5 trong lúc chờ. Vì bước chỉ tăng, các lượt đọc kết quả sau đó bị tính vào B5, nên cột bước của H bản cũ chỉ gần đúng. Tổng và số lượt thì đúng.

### Phiên đo

- Phiên `ac00c53b-eae8-478b-9364-5016754d3c25`, máy Windows của các mốc (Node 20, Python 3.14, Edge, Git Bash), model Opus 5.5. Test 335/335 qua trước khi đo.
- Hai worktree: `<SP>/cu/tapora-proto-kit` (`2fbc10d`) và `<SP>/moi/tapora-proto-kit` (`70bd133`). `<SP>` là `C:/Users/thapnv/AppData/Local/Temp/claude/w--Dummy--Tool--Working-tapora-proto-kit/ac00c53b-eae8-478b-9364-5016754d3c25/scratchpad`.
- 12 lần chạy, mỗi lần là một subagent `general-purpose` chạy nền. Mỗi cặp cũ–mới khởi động cùng lúc.
- Cặp đầu của mỗi kịch bản có lượt 1 không đọc được cache (`đọc cache 0k`) ở kịch bản T (cả rtc1 và rtm1, khoảng 26k mỗi bên). Từ cặp sau, lượt 1 đọc 22k. Hai bên trong cùng cặp vì vậy vẫn so thẳng được.

### Thư mục bắt đầu đã chọn

- **`r5-sau-tweak` từ `rtm1`**: lệnh kiểm nhanh `ĐẠT` (`quick · 2 file đổi · 6 bộ (dark) · 27 bước · … → ĐẠT`), có dòng nhật ký trong `FEATURE-DECISIONS.md`. Đạt ngay lần đầu, không cần `rtm2`.
  - Lần sửa: nút "Gọi 0909 123 456" (`.btn-ghost`, `ph-phone`, `tel:+84909123456`), hàng `.info-cta` mới trong `site.css`.
  - Dự án chưa có `FEATURE-DECISIONS.md`, nên lần chạy tự tạo file từ khuôn của `evolve-site`.
  - Script bộ kiểm trong `_qa/` là bản mới, vì `qa_init.py --update` của `rtm1` đã chép đè `quick.py`, `run_all.py`, `handover.py`.
- **`r6-sau-evolve` từ `rem1`**: tới Cổng 3, lệnh kiểm nhanh cuối `quick · 3 file đổi · 8 bộ (dark) · 59 bước · … → ĐẠT`.
  - Đã ghi vào khối Cổng 3 của tính năng: `**Quyết định nghiệm thu (nguyên văn):** "Chốt tích hợp."`.
  - Bỏ `_qa/truoc/` (64 ảnh mốc của lần evolve, 3,7 MB) sau khi đo: bốn lần đo H chỉ thấy nó trong kết quả `ls`, không so với nó; handover so với `last-green/`. `FEATURE-DECISIONS.md` vẫn nhắc tới thư mục này.
- Cả hai bỏ `_qa/__pycache__`, `.kit-source`, `.quick-run`, `.tdd`, giữ `_qa/current/` kèm `ledger.jsonl`. `quick.py --dry` in `File đổi từ lần kiểm trước: không`.
- **Nhiễm từ bản mới**, như đã đoán ở trên: rec1 lượt 10 đọc đầu `quick.py` của `r5` (bản mới, có `--shots`) trước khi `qa_init --update` chép lại bản cũ. Rồi lượt 36 gọi `--shots` thì lỗi. rec2 cũng gọi `--shots` (lượt 35, 37). Mỗi lần tốn khoảng một lượt, 30k, dưới 2 % tổng.

### Prompt chạy (nguyên văn)

Phần đầu chung. `<SK>` là `<SP>/cu/tapora-proto-kit/skills` hay `<SP>/moi/tapora-proto-kit/skills`, `<DIR>` là `<SP>/<tên lần>`, cả hai viết tuyệt đối:

```text
Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
Chạy skill <skill>: đọc và làm theo `<SK>/<skill>/SKILL.md`. `<skills>` = `<SK>`. Không gọi skill qua công cụ Skill.
Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang, đã bàn giao. Thư mục dự án (tuyệt đối): `<DIR>`, có `AGENTS.md`. Thư mục prototype: `<DIR>/docs/prototypes/sample`.
Chỉ ghi file trong `<DIR>`. Không sửa `<SK>` hay repo tapora-proto-kit. Bạn không hỏi được người dùng.
```

Thêm sau phần đầu, theo kịch bản:

```text
T  Lời người dùng (nguyên văn): "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456."
   Làm xong thì báo cáo như skill yêu cầu.
   Câu trả lời cuối: (1) báo cáo của skill; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.

E  Lời người dùng (nguyên văn): "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."
   Làm theo skill tới Cổng 3 rồi dừng: viết câu hỏi Cổng 3 ra trong câu trả lời cuối. Cổng nào skill vẫn phải hỏi thì viết câu hỏi đó ra và dừng ở đó.
   Câu trả lời cuối: (1) câu hỏi ở cổng đã dừng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.

H  Lời người dùng (nguyên văn): "Kiểm tổng trước khi gửi link cho khách."
   Làm theo skill tới cổng nghiệm thu bàn giao rồi dừng: viết câu hỏi ra trong câu trả lời cuối. Không promote.
   Câu trả lời cuối: (1) câu hỏi ở cổng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.
```

(Chữ `T`, `E`, `H` và thụt đầu dòng chỉ để chia khối ở đây; prompt thật không có.)

### Số đo

- Quy đổi thô lấy từ `parts2.js`. "Bỏ mất cache" trừ phần ghi lại ngữ cảnh ở lượt mất cache (`fixes-edit.js` dòng 9).
- Số theo bước lấy từ `phase-edit.js`, dạng `lượt · quy đổi`.
- Mỗi bên chỉ hai lần. Chênh dưới khoảng 15 % chưa nói được gì.

**T · `tweak-site`** (cả 4 lần đều khai Cấp 1 · cờ C, vì phải thêm hàng nút `.info-cta` vào `site.css` dùng chung):

| Lần | Lượt | Quy đổi | Phút | vào | tìm | đọc | sửa | kiểm | ảnh | nhật ký | báo cáo |
|---|---|---|---|---|---|---|---|---|---|---|---|
| cũ 1 `rtc1` | 23 | 0,28–0,29M | 4,0 | 2 · 57k | 4 · 46k | 5 · 48k | 1 · 12k | 2 · 19k | 4 · 39k | 4 · 44k | 1 · 16k |
| mới 1 `rtm1` | 10 | 0,17M | 3,1 | 1 · 45k | 2 · 31k | 2 · 25k | 1 · 19k | 1 · 12k | 1 · 11k | 1 · 12k | 1 · 15k |
| cũ 2 `rtc2` | 20 | 0,24–0,25M | 3,6 | 1 · 19k | 4 · 59k | 2 · 20k | 1 · 15k | 2 · 21k | 8 · 80k | 1 · 12k | 1 · 16k |
| mới 2 `rtm2` | 11 | 0,15–0,16M | 3,1 | 1 · 19k | 3 · 38k | 3 · 39k | 1 · 17k | 1 · 11k | (trong nhật ký) | 1 · 13k | 1 · 17k |

- **−40 % và −37 %**, số lượt 23/20 → 10/11. Không lần nào mất cache.
- Phần giảm đến từ:
  - "ảnh": bản cũ không có lệnh chụp nên tự dựng bộ chụp (4 và 8 lượt, 39k và 80k); bản mới 0–1 lượt.
  - "vào + tìm + đọc" ít lượt hơn.

**E · `evolve-site`** (cả 4 lần đều tới Cổng 3, không hỏi Cổng 1–2, khai Cấp 2 · cờ L, T, C):

| Lần | Lượt | Quy đổi thô | Bỏ mất cache | Phút | B1 | B2 · cổng | B3 | B4 | Cổng 3 |
|---|---|---|---|---|---|---|---|---|---|
| cũ 1 `rec1` | 55 | 1,67–1,72M | 1,67–1,72M | 25,1 | 8 · 206k | 12 · 284k | 15 · 538k | 18 · 578k | 2 · 82k |
| mới 1 `rem1` | 19 | 1,04–1,10M | 0,87–0,93M | 24,1 | 2 · 44k | 1 · 31k | 9 · 663k (mất cache 170k) | 5 · 229k | 2 · 94k |
| cũ 2 `rec2` | 55 | 1,95–2,01M | 1,63–1,69M | 22,5 | 5 · 139k | 15 · 355k | 14 · 478k | 19 · 923k (mất cache 318k) | 2 · 82k |
| mới 2 `rem2` | 19 | 1,21–1,27M | 0,83–0,89M | 23,7 | 3 · 74k | 1 · 42k | 7 · 528k (mất cache 131k) | 5 · 467k (mất cache 246k) | 3 · 117k |

- **Bỏ mất cache: −47 % và −48 %. Số thô: −37 % cả hai cặp.** Số lượt 55 → 19. Thời gian không đổi (22,5–25,1 phút).
- **Trước khi dựng** (tới lượt viết file bước đầu): cũ 490k và 494k (lượt 1–20), mới 146k và 142k (lượt 1–4 và 1–5), giảm khoảng 70 %.
  - Bản cũ đọc nguyên `SKILL.md` 31,7k ký tự, đọc mã `run_all.py`/`quick.py`/`run.mjs` 3 và 6 lệnh (22,8k và 19,3k ký tự), và mỗi lệnh một lượt.
- **B4**: bản cũ 578k, và 605k khi bỏ mất cache; bản mới 229k và 221k, giảm khoảng 62 %. Bản cũ chụp `_qa/sau/` bằng `run_all.py` và mở ảnh qua 5 lượt. Bản mới dùng một lệnh `quick.py --shots`.
- **B3 (dựng)** giảm ít: cũ 478–538k, mới 371–422k (bỏ lượt vào 2 và phần mất cache).
- **Mất cache:**
  - Hai lần là do lượt dựng dài quá 5 phút, chỉ gặp khi chạy dạng subagent:
    - rem1 lượt 8: lượt 7 nghĩ 313s, viết 80s;
    - rem2 lượt 7: lượt 6 nghĩ 393s, viết 55s.
  - Hai lần là cache bị xoá phía máy chủ, không do lượt dài:
    - rec2 lượt 45: đọc cache tụt về 0 sau 15 giây;
    - rem2 lượt 13: tụt về 22k sau 89 giây.

**H · `handover-check`** (cả 4 lần dừng ở cổng nghiệm thu, kết luận SẠCH, không promote):

| Lần | Lượt | Quy đổi thô | Bỏ mất cache | Phút | B0–B1 | B3 | B5 | B6 | Cổng |
|---|---|---|---|---|---|---|---|---|---|
| cũ 1 `rhc1` | 28 | 0,37–0,39M | 0,37–0,39M | 5,2 | 7 · 80k | 1 · 21k | 15 · 188k | 4 · 70k | 1 · 19k |
| mới 1 `rhm1` | 15 | 0,22–0,23M | 0,22–0,23M | 4,6 | 4 · 61k | 1 · 9k | 7 · 92k | 2 · 39k | 1 · 19k |
| cũ 2 `rhc2` | 33 | 0,69–0,70M | 0,53–0,54M | 6,0 | 7 · 82k | – | 21 · 346k | 4 · 243k (mất cache 163k) | 1 · 21k |
| mới 2 `rhm2` | 16 | 0,23–0,24M | 0,23–0,24M | 5,3 | 5 · 70k | 1 · 9k | 7 · 94k | 2 · 39k | 1 · 19k |

- **−41 % và −56 %** (bỏ mất cache; số thô cặp 2 là −66 %). Số lượt 28/33 → 15/16.
- Mất cache ở rhc2 lượt 29 là cache bị xoá phía máy chủ: lượt 28 chỉ 24 giây.
- Không có B2 (dự án không có ảnh Hub) và B4 (không có khác biệt nào phải gán) ở cả 4 lần. Cột B của bản cũ chỉ gần đúng (xem mục Script).

**Một vòng T + E + H** (bỏ mất cache): cũ 2,36M và 2,44M, mới 1,30M và 1,25M, tức **−45 % và −49 %**. Số lượt 106/108 → 44/46.

### Soát từng việc của bản mới

**tweak-site 1.3** (`rtm1` / `rtm2`):

| Việc | rtm1 | rtm2 |
|---|---|---|
| Lượt tìm có `qa_init --update` và `quick.py --dry` cùng lượt `grep` | có, lượt 2 | có, lượt 2 |
| Đọc một lượt | **không**: lượt 4–5 (`index.html`, rồi `site.css` và khuôn `FEATURE-DECISIONS`) | **không**: lượt 5–7 (`index.html`, khuôn và hai SKILL.md, rồi `site.css`) |
| Sửa một lượt | có, lượt 6 | có, lượt 8 |
| Kiểm bằng `quick.py --note … --shots` | có, lượt 7 | có, lượt 9 |
| Mở một ảnh cùng lượt ghi nhật ký | có, lượt 8; thêm lượt 9 vì `index-5.jpg` chỉ là dải chân trang cao 30px | có, lượt 10 |
| Không tự chụp, không đọc mã script | có (0 · 0) | có (0 · 0) |

- Tìm vẫn tốn 2–3 lượt:
  - `grep … | head -40` bị các file `concept/*.html` chiếm hết dòng, phải `grep` lại (lượt 3 ở cả hai);
  - rtm2 còn tốn thêm lượt 4 để tìm `FEATURE-DECISIONS.md`.
- "Đọc một lượt" chưa ăn vì hai lý do:
  - chỉ khi đọc `index.html` mới biết phải sửa `site.css` (cờ C nhận muộn, cả 4 lần đều khai lại từ "cờ: không" sang C);
  - dự án không có `FEATURE-DECISIONS.md`, nên phải đi tìm khuôn.
- So với bản cũ:
  - rtc1 và rtc2 tự chụp bằng `run.mjs` với file bước tạm (lượt 17 và 14);
  - đọc mã `run.mjs` (lượt 16 và 12);
  - chạy `quick.py --help` để tìm cờ chụp.

**evolve-site 1.9** (`rem1` / `rem2`):

| Việc | rem1 | rem2 |
|---|---|---|
| Lượt vào 1 gồm `Read b1-b2.md`, file dự án và lệnh 1 | có, lượt 2 (kèm `README.md` của prototype, không có, lỗi vô hại) | có, lượt 2 (như rem1) |
| Ảnh mốc bằng `run_all.py _qa/truoc smoke-index` | có, lượt 4 (thêm `smoke-_system`) | có, lượt 4, lượt riêng vì chưa biết tên bộ trước khi đọc `qa.config.json` |
| Lượt vào 2 gồm `Read b3-b4.md`, file sẽ sửa và lệnh 2 | có, lượt 4; `index.html`, `site.css`, `_system.html` đã đọc ở lượt 3; đọc thêm `tokens.css` dù lệnh 2 đã in tên token | có, lượt 5 (`b3-b4.md`, `_system.html`, lệnh 2) |
| Không đọc mã `run_all.py` ngoài phần đầu lệnh 2 in | có (0 lệnh; cũ 3 và 6 lệnh) | có (0) |
| Thấy đỏ rồi xanh với `run_all.py _qa/.tdd` | có: đỏ lượt 6 (`FAIL 14`), còn 1 đỏ ở 1440 lượt 9, xanh lượt 13 | có: đỏ lượt 9 (`FAIL 12`), xanh lượt 11 ngay lần dựng đầu |
| B4 bằng `quick.py --shots` cùng lượt với `sed` in `regression-qa.md` | có, lượt 13 | có, lượt 12 |
| Mở mọi ảnh trong một lượt | **một phần**: lần kiểm đầu mở ở lượt 14; sau vòng sửa mở lại 17 ảnh ở lượt 17 | **một phần**: lượt 13 (9 ảnh), lượt 15 (7 ảnh) sau vòng sửa, lượt 18 mở 4 lát `_system` 390 không tới mục mới |
| Không tự chụp | có | có |

**handover-check 1.3** (`rhm1` / `rhm2`):

| Việc | rhm1 | rhm2 |
|---|---|---|
| B1 một lượt với `handover.py ledger` | **một phần**: `ledger` ở lượt 3 cùng `qa_init` và `FEATURE-DECISIONS.md`, nhưng B0–B1 tốn 4 lượt | **một phần**: lượt 3; B0–B1 tốn 5 lượt |
| Không đọc `ledger.jsonl` | có (cũ: cả hai đọc nguyên, 2,9k và 13k ký tự) | có |
| B3 bằng `qa-check.py` | có, lượt 5 | có, lượt 6 |
| Bảng UX in bằng `sed` | có, lượt 6 (Nhóm F) | có, lượt 7 |
| Không đọc mã script | có (cũ: 1 lệnh mỗi lần) | có |

- B0–B1 tốn thêm lượt ở cả hai lần:
  - lượt 2 `ls` và đọc `AGENTS.md` để biết đã có bộ kiểm hay chưa;
  - lượt 4 (rhm2 thêm lượt 5) đọc `qa.config.json` để chắc `thumbs.items` rỗng, vì `ledger` không in dòng "Ảnh Hub" khi rỗng.
- Bản cũ chạy `handover.py run` nền (rhc1 lượt 8, rhc2 lượt 11), đọc log 2–3 lượt, đọc `handover.json` bằng python. rhc2 ghi log ra `<SP>/rhc2-handover-run.log`, ngoài `<DIR>`, rồi xoá.

### Chỗ tốn nhất của bản mới (số của `groupcost.js`, không gồm phần mất cache)

1. **Lượt dựng của evolve và lần mất cache sau nó:**
   - rem1 lượt 7–8, 268k, cộng 170k mất cache vì lượt 7 dài 6,6 phút.
   - rem2 lượt 10–11, 175k.
   - rem2 lượt 6–7, 191k, cộng 131k mất cache: heredoc Bash ghi khối tính năng, file bước và python trong một lệnh bị lỗi `unexpected EOF`, không ghi được gì. Lượt 8 viết lại bằng Edit/Write.
   - Phần dựng là cần thiết. Phần kiểm soát được là heredoc hỏng và lượt dài quá 5 phút; lượt dài chỉ gây mất cache khi chạy dạng subagent.
2. **Vòng B4 của evolve, kiểm, xem ảnh, sửa, kiểm lại:** rem1 lượt 13–17, 264k; rem2 lượt 12–16, 238k.
   - Mở lại ảnh sau khi sửa: rem1 lượt 17, 17 ảnh; rem2 lượt 15, 7 ảnh.
   - Bẻ thử lần đầu hỏng vì python in tiếng Việt ra console cp1252: rem2 lượt 15–16, 92k. rem1 gặp cùng lỗi ở lượt 11–12, khi in report.
3. **Gỡ bước đỏ của bộ tính năng:** rem1 lượt 9–12, 131k. Bước `sheet-hay-hop-thoai` đo `clientWidth` 1440 thay vì khung `position:fixed` 1425 (trừ rãnh thanh cuộn). Một lần chạy, một lỗi do agent viết bước.
4. **Ảnh không nói lát nào chứa phần nào của trang:**
   - tweak: rtm1 lượt 9, 9k;
   - handover: rhm1 lượt 8 và rhm2 lượt 8, 13k mỗi lần; cả hai mở `index-4`/`index-5` là dải chân trang rồi mở lại `index-3`/`index-4`;
   - evolve: rem2 lượt 18, 35k, 4 lát `_system` 390 không tới mục mới, vì bộ khói 390 chỉ chụp 16 lát.
5. **`FEATURE-DECISIONS.md` không có trong dự án đã bàn giao:** cả 4 lần tweak phải tra khuôn ở `evolve-site`.
   - rtm2 lượt 4 và 6: 29k, có `cat` cả `evolve-site/SKILL.md` và `handover-check/SKILL.md`.
   - rtm1 lượt 5: một phần của 20k.
   - rtc1 lượt 19–20: 23k.

Vấp khác trong báo cáo của agent:
- **evolve:**
  - lệnh 1 `grep` tài liệu yêu cầu với `--exclude-dir=prototypes` bỏ sót `DECISIONS.md`, `CONCEPT.md` (rem1, rem2);
  - một Edit vô ích vì chuỗi cũ và mới giống nhau (rem1 lượt 9).
- **handover:**
  - `qa-check.py` không in dòng nợ cũ khi bằng 0, nên rhm1 lượt 9 và rhm2 lượt 13 đọc `handover.json` để chắc (15k);
  - đếm chỗ dùng ở B6 bằng `grep` khớp cả `data-hold-*`, `hold-*`, phải đếm lại (rhm1 lượt 11–12, 25k);
  - luật B5 "trừ màn đã chấm trong evolve Cấp 2–3" mơ hồ với site một trang (cả 4 lần).
- **Python và cp1252 trên Windows:** 5 trên 12 lần gặp `UnicodeEncodeError` khi python do agent viết in tiếng Việt: rem1, rem2, rec1, rhc1, rhc2.

### Chất lượng (chỉ mở ảnh)

- **T:**
  - Ảnh 390 của cả 4 lần: hai nút viền cùng kiểu, icon `phone`, không tràn.
  - Bản mới là ảnh `quick.py --shots`. Bản cũ chụp lại bằng `run_all.py _qa/.xem smoke-index-390`, vì agent đã xoá ảnh tự chụp.
  - rtm1 ghi cả số "Gọi 0909 123 456" nên hai nút xếp hai dòng. Ba lần kia ghi "Gọi điện", hai nút cùng một hàng.
  - Không lần nào kém hơn.
- **E**, ảnh `giu-banh-mo` 390 và 1440 của bộ tính năng:
  - Cả 4 lần đều có sheet sát đáy ở 390 và hộp thoại giữa màn ở 1440.
  - Mẻ 6:00 gạch "Đã hết" và không chọn được, mẻ 9:30 chọn sẵn.
  - Mỗi bánh có ô số lượng −/+, nút chính "Chép tin nhắn và mở Zalo" ghim ở chân.
  - Ở 390, phần dưới thân hộp khuất sau chân hộp lúc mới mở: ô tên ở rec1, rem1, rem2; khung tin nhắn ở rec2. Ở 1440×900 khung tin nhắn phải cuộn trong hộp; cả 4 lần đều tự nêu điểm này ở Cổng 3.
  - Hai bản ngang nhau.
  - Cả 4 lần đều giữ khối tin nhắn mẫu và nút Chép cũ trong panel mẻ, và hỏi thêm ở Cổng 3 (rem1, rem2, rec2) hay ghi thành điểm cần biết (rec1).
- **H:**
  - Cả 4 báo cáo ghi đủ 3 dòng nhật ký (1 tweak, 2 evolve), 0 khác biệt đã gán hay không gán được, 4 file đổi đều có trong nhật ký, 2 bộ mới của tính năng.
  - Cả 4 lần đều ghi bù phần `DESIGN.md` mà lần tweak bỏ sót (icon `phone`, hàng `.info-cta`, nút Gọi ở sơ đồ trang), và sửa số `.field-err` 3 → 2.
  - Bản mới chấm UX khối giờ mở của lần tweak với 5 ảnh. Bản cũ không mở ảnh nào và không chấm lại, với lý do trang chủ đã chấm trong đợt evolve.
  - Bản cũ nêu mẫu khối giờ mở trên `_system.html` chưa có nút Gọi; bản mới nêu hai nút lệch nhau ở 390/768.
  - Chất lượng không giảm; bản mới soát kỹ hơn ở UX.

### Đề xuất bước tiếp (ước từ số đo; chưa sửa skill)

| # | Việc | Ước tiết kiệm | Chắc chắn |
|---|---|---|---|
| 1 | Một lệnh bẻ thử của bộ kiểm (ví dụ `run_all.py _qa/.recheck <bộ> --break <file> <chuỗi cũ> <chuỗi mới>`: chép, bẻ, chạy, trả lại, in số chỗ bẻ), thay cho python agent tự viết | 30–90k mỗi lần evolve có bước phủ định | khá: rem2 92k, rec1 2 lượt; rem1 không có bước phủ định |
| 2 | `quick.py --shots` nêu ảnh đổi so với lần trước (như `system-check.mjs`), B4 chỉ mở lại các ảnh đó | 20–40k mỗi lần evolve có vòng sửa | khá cao: cơ chế đã ăn ở `sketch-to-site` pha 1 |
| 3 | Lệnh chụp in lát nào chứa `id`/tiêu đề nào (`index-4.jpg: #duong-di`), và bộ khói `_system` ở 390 đủ lát | 10–35k mỗi lần | cao: 4 trên 6 lần bản mới đoán sai lát |
| 4 | `handover.py ledger` luôn in dòng "Ảnh Hub" (cả khi rỗng); `qa-check.py` luôn in dòng nợ cũ; B0 của `handover-check` đọc `AGENTS.md` trong lượt `ledger` | 25–40k mỗi lần handover | cao: cả hai lần bản mới |
| 5 | `tweak-site`: chưa có `FEATURE-DECISIONS.md` thì tạo từ khuôn `<skills>/evolve-site/templates/FEATURE-DECISIONS.md` (phần đầu và bảng nhật ký); lệnh tìm `grep` chỉ trong `site/` (bỏ `concept/`) | 10–30k mỗi lần tweak | cao: 4 trên 4 lần tra khuôn, 3 lần `grep` lại |
| 6 | Dòng chung trong `AGENTS.md` của bộ kiểm và các file giai đoạn: python in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` | 10–30k mỗi lần gặp | khá: 5 trên 12 lần |

- Cộng lại khoảng 0,1–0,2M cho một vòng T + E + H, tức 8–15 % của 1,25–1,30M. Mức này gần ngưỡng dao động, nên phải đo cả vòng mới thấy rõ.
- Không đáng làm để giảm token:
  - **Né lượt dựng dài** (mất cache 130–170k ở cả hai lần evolve bản mới): chỉ gặp khi chạy dạng subagent; phiên chính có TTL 1 giờ.
  - **Cờ C nhận muộn ở tweak**: cần đọc trang mới biết; chỉ tốn một lượt khai báo lại.

### Transcript và dữ liệu

| Kịch bản | Lần | Agent | Thư mục chạy | Ảnh và file |
|---|---|---|---|---|
| T | cũ 1 | `ab787ecb697e5c0a3` | `rtc1` | `runs-edit/rtc1/` |
| T | mới 1 | `aa4e833296b177c33` | `rtm1` | `runs-edit/rtm1/` |
| T | cũ 2 | `aafcbfc9d40cfe7be` | `rtc2` | `runs-edit/rtc2/` |
| T | mới 2 | `aac34aea632ce7858` | `rtm2` | `runs-edit/rtm2/` |
| E | cũ 1 | `a504a1f555c4966f2` | `rec1` | `runs-edit/rec1/` |
| E | mới 1 | `a34ba1fccc7b14a1d` | `rem1` | `runs-edit/rem1/` |
| E | cũ 2 | `afb1c68eada87aee3` | `rec2` | `runs-edit/rec2/` |
| E | mới 2 | `a3851b831e98a1693` | `rem2` | `runs-edit/rem2/` |
| H | cũ 1 | `a2c82a831315f4a53` | `rhc1` | `runs-edit/rhc1/QA.md` |
| H | mới 1 | `a57290f774eed9205` | `rhm1` | `runs-edit/rhm1/QA.md` |
| H | cũ 2 | `ade370de3f12acdc1` | `rhc2` | `runs-edit/rhc2/QA.md` |
| H | mới 2 | `a69bfbbd641703733` | `rhm2` | `runs-edit/rhm2/QA.md` |

- Bản gốc nằm ở `~/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/ac00c53b-eae8-478b-9364-5016754d3c25/subagents/`. Bản nén nằm ở `transcripts/edit-cu-moi/agent-<id>.jsonl.gz`, kèm `.meta.json`.
- `runs-edit/<tên>/` của T và E có `FEATURE-DECISIONS.md` của lần đó, cộng ảnh chính:
  - T: `goi-390.jpg`;
  - E: `giu-banh-mo-390` và `giu-banh-mo-1440`;
  - H: chỉ có `QA.md`, vì `FEATURE-DECISIONS.md` của H giống `r6-sau-evolve`.
- `r5-sau-tweak/` và `r6-sau-evolve/` có `sample/_qa/current/`, mà `_qa/.gitignore` của bộ kiểm bỏ qua. Muốn giữ khi commit thì `git add -f`.

## Ba skill sửa: sau 6 chỗ sửa (đo 05/10/2026)

Commit `54b403a` (merge vào `measure-kit/run-4.5` thành `417fe2a`) làm 6 việc đề xuất ở mục trên, cộng luật B5 của `handover-check`:
- `breaktest.py`;
- `quick.py --shots` báo ảnh đổi so với lần chụp trước;
- mục bằng 0 vẫn in;
- nhãn lát (`slices.json`) và `"slices": "all"` cho `_system`;
- `tweak-site` tạo `FEATURE-DECISIONS.md` từ khuôn, `grep` chỉ thư mục trang;
- ghi chú `PYTHONIOENCODING`.

Prompt của phiên đo: `prompt-edit-sau-sua.md`. Mỗi kịch bản chạy một lần, so với các lần "mới" của mục trên. Kết quả chính là phần soát từng việc.

### Mốc lệch vì xuống dòng (sửa trong thư mục đo, chưa sửa trong bộ kiểm)

- Bộ kiểm băm nguyên byte của file trong `_qa/` (`qalib.sha`). Python trên Windows ghi `steps-*.json` bằng CRLF (`qa_init.py`, cả `--update`).
- Git ở máy đo (`core.autocrlf=input`) lưu LF. Sau một lần checkout, file thành LF mà mốc vẫn giữ dấu của bản CRLF.
- Gặp ngày 05/10 sau khi đổi nhánh: `r5-sau-tweak` và `r6-sau-evolve` báo `--dry`: `_qa/steps-smoke-_system.json, _qa/steps-smoke-index.json` dù không ai sửa. `r4-bangiao` còn sạch chỉ vì bản trên đĩa chưa bị checkout lại.
- Đã chạy `moc-lf.py` trên cả ba thư mục: file bước về LF, dấu trong `last-green/manifest.json` và `current/manifest.json` lấy lại. Nội dung kiểm không đổi.
- Dự án thật commit `_qa/last-green/` (theo `.gitignore` của bộ kiểm) sẽ gặp đúng lỗi này giữa hai máy. Hướng sửa trong bộ kiểm: băm sau khi đổi CRLF thành LF, hoặc ghi JSON bằng `newline='
'`.

### Thư mục bắt đầu `r4b`, `r5b`, `r6b`

- Chép từ `r4-bangiao`, `r5-sau-tweak`, `r6-sau-evolve`, rồi `qa_init.py <sample> --update` của `54b403a`:
  - chép đè `run.mjs`, `run_all.py`, `quick.py`, `handover.py`, thêm `breaktest.py`;
  - `steps-smoke-_system.json` từ 16 màn thành `"all"`.
- Rồi `python moc-lf.py <sample>`: dấu `_qa/run.mjs` và các file bước trong hai manifest lấy theo bản mới.
  - Không làm vậy thì `--dry` báo hai file đổi ngoài quy trình. Mỗi lần tweak và evolve tốn thêm một lần kiểm "trước tweak", và handover thấy thêm một dòng nhật ký: số đo đội lên vì cập nhật bộ kiểm, không vì skill.
  - `run.mjs` mới chỉ thêm `slices.json` và số lát, không đổi `report.json`. Kiểm trên bản chép của `r6b`: `quick.py --all` cho `59 bước · … · check đổi 0 · nợ cũ 0 → ĐẠT`.
- Kiểm cả sáu thư mục trên bản chép (`r4`, `r4b` thì dựng lại `current/` từ `last-green/` như prompt):
  - `quick.py --dry` in `File đổi từ lần kiểm trước: không`;
  - `r6`, `r6b`: `handover.py ledger` in `File đổi sau lần kiểm nhanh cuối, chưa vào nhật ký: không`;
  - từ `last-green` tới `current` chỉ còn `_qa/steps-giu-banh.json`, `site/_system.html`, `site/assets/site.css`, `site/index.html`, như bốn lần đo H đã thấy.
- `AGENTS.md` giữ như cũ (khuôn của bản cũ), để so được với mốc.
- `_qa/current/` của `r5b`, `r6b` bị `.gitignore` của bộ kiểm bỏ qua: commit thì `git add -f`. `r4b` không cần, vì prompt dựng lại `current/` từ `last-green/`.

### Script

- `fixes-edit.js` dòng 11 soát sáu chỗ sửa:
  - `breaktest.py`, hay bẻ thử tự viết (lệnh có `.bak` cạnh `site/`);
  - `UnicodeEncodeError`;
  - đọc `handover.json`, `qa.config.json`;
  - tra khuôn `FEATURE-DECISIONS` hay tạo bằng `sed`;
  - `grep -r` ngoài thư mục trang;
  - sau mỗi lần `--shots`: số ảnh đổi theo dòng so ảnh, số ảnh mở tới lần chụp kế, số ảnh mở ngoài danh sách đổi;
  - ảnh đã mở kèm nhãn lát lấy từ danh sách trong kết quả.
- Đã chạy thử trên transcript của lần đo trước:
  - rem2: bẻ thử tự viết ở lượt 15–16, `UnicodeEncodeError` ở lượt 15;
  - rhm1, rhm2: đọc `qa.config.json` ở lượt 4, `handover.json` ở lượt 9 và 13;
  - rtm1, rtm2: tra khuôn ở lượt 4–6.
- `phase-edit.js`: `breaktest.py` là dấu hiệu của B4 (evolve).

### Phiên đo

- Phiên `105ba07d-cb4e-4891-9a8b-ce003cd6670b`, cùng máy Windows với mốc (Node 20.19.5, Python 3.14, Edge, Git Bash), model Opus 5.5. HEAD `0bc2398` (sau `417fe2a`, gồm `54b403a`), test 343/343 qua trước khi đo.
- Một worktree `<SP>/moi/tapora-proto-kit` ở HEAD. `<SP>` là `C:/Users/thapnv/AppData/Local/Temp/claude/w--Dummy--Tool--Working-tapora-proto-kit/105ba07d-cb4e-4891-9a8b-ce003cd6670b/scratchpad`.
- Ba lần chạy khởi động cùng lúc, mỗi lần là một subagent `general-purpose` chạy nền, prompt chạy giữ nguyên văn như mục trên:
  - `rts1` từ `r4b-bangiao`, `current/` dựng lại từ `last-green/`;
  - `res1` từ `r5b-sau-tweak`;
  - `rhs1` từ `r6b-sau-evolve`.
- Cả ba đều có lượt 1 không đọc được cache (`đọc cache 0k`). Lượt 1 tốn 46–50k, so với 19–21k khi có cache, tức thêm khoảng 29k mỗi lần. Ở mốc chỉ `rtm1` gặp. Không lần nào mất cache giữa chừng.
- `res1` tới Cổng 3 mà không hỏi Cổng 1–2, nên so được với mốc.

### Số đo

- Quy đổi thô lấy từ `parts2.js`. "Bỏ lượt 1 lạnh" là trừ khoảng 29k.
- Số theo bước lấy từ `phase-edit.js` bản đã sửa trong phiên này (xem *Sửa script trong lần đo này*), dạng `lượt · quy đổi`.
- Mỗi kịch bản chỉ một lần chạy: chênh dưới khoảng 20 % chưa nói được gì.

**T · `tweak-site`** (khai Cấp 1 · cờ C như cả 4 lần mốc; khai lại từ "cờ: không" sau khi xem CSS):

| Lần | Lượt | Quy đổi | Lượt 1 đọc cache | Phút | vào | tìm | đọc | sửa | kiểm | ảnh | nhật ký | báo cáo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `rts1` | 9 | 0,16M | 0k | 2,9 | 1 · 46k | 1 · 14k | 3 · 43k | 1 · 15k | 1 · 10k | (trong nhật ký) | 1 · 13k | 1 · 16k |
| mốc `rtm1` | 10 | 0,17M | 0k | 3,1 | 1 · 45k | 2 · 31k | 2 · 25k | 1 · 19k | 1 · 12k | 1 · 11k | 1 · 12k | 1 · 15k |
| mốc `rtm2` | 11 | 0,15–0,16M | 22k | 3,1 | 1 · 19k | 3 · 38k | 3 · 39k | 1 · 17k | 1 · 11k | (trong nhật ký) | 1 · 13k | 1 · 17k |

- Thấp hơn `rtm1` (cũng lạnh lượt 1) 6 %. Bỏ lượt 1 lạnh thì khoảng 0,13M, so với 0,14M và 0,15–0,16M. Dưới ngưỡng.
- "Tìm" còn 1 lượt, 14k (mốc 2–3 lượt, 31–38k): không `grep` lại, không tra khuôn. "Đọc" vẫn 3 lượt.

**E · `evolve-site`** (tới Cổng 3, không hỏi Cổng 1–2, khai Cấp 2 · cờ L, T, C như mốc):

| Lần | Lượt | Quy đổi thô | Bỏ mất cache | Lượt 1 đọc cache | Phút | B1 | B2 · cổng | B3 | B4 | Cổng 3 |
|---|---|---|---|---|---|---|---|---|---|---|
| `res1` | 16 | 0,77–0,82M | 0,77–0,82M | 0k | 24,9 | 3 · 104k | 1 · 41k | 5 · 315k | 5 · 237k | 2 · 92k |
| mốc `rem1` | 19 | 1,04–1,10M | 0,87–0,93M | 22k | 24,1 | 2 · 44k | 1 · 31k | 9 · 663k (mất cache 170k) | 5 · 229k | 2 · 94k |
| mốc `rem2` | 19 | 1,21–1,27M | 0,83–0,89M | 22k | 23,7 | 3 · 74k | 1 · 42k | 7 · 528k (mất cache 131k) | 5 · 467k (mất cache 246k) | 3 · 117k |

- Bỏ mất cache và lượt 1 lạnh: khoảng 0,74–0,79M, so với 0,83–0,93M của mốc, tức thấp hơn 7–15 %, dưới ngưỡng.
- Số thô thấp hơn 26–37 % vì `res1` không mất cache. Một phần là may: lượt 8 nghĩ 196 s, viết 98 s, cách lượt 9 có 295 s, chỉ 5 s dưới TTL 5 phút.
- B2 là lượt 5 (in `integration-patterns.md` và khuôn khối tính năng), làm sau lượt vào 2.
- **B3 (dựng, bỏ lượt vào 2):** 244k, so với 371–422k của mốc. Bộ tính năng đỏ ở lượt 7 và xanh ngay lần dựng đầu (lượt 9). Mốc thì có vòng gỡ bước đỏ (rem1, 131k) và heredoc hỏng (rem2). Phần giảm này không do 6 chỗ sửa mà do dao động giữa các lần dựng.
- **B4:** 237k, ngang mốc (229k, và 221k khi bỏ mất cache). B4 lần này có thêm một việc mà mốc không có: `breaktest.py` phát hiện một bước phủ định yếu, phải sửa bước rồi bẻ lại (xem *Soát từng việc*).

**H · `handover-check`** (dừng ở cổng nghiệm thu, kết luận SẠCH, không promote):

| Lần | Lượt | Quy đổi | Lượt 1 đọc cache | Phút | B0–B1 | B3 | B5 | B6 | Cổng |
|---|---|---|---|---|---|---|---|---|---|
| `rhs1` | 15 | 0,26–0,27M | 0k | 5,0 | 4 · 87k | 1 · 9k | 1 · 13k | 8 · 125k | 1 · 26k |
| mốc `rhm1` | 15 | 0,22–0,23M | 22k | 4,6 | 4 · 61k | 1 · 9k | 3 · 37k | 6 · 94k | 1 · 19k |
| mốc `rhm2` | 16 | 0,23–0,24M | 22k | 5,3 | 5 · 70k | 1 · 9k | 2 · 27k | 7 · 107k | 1 · 19k |

- Cột B5, B6 của mốc đã tính lại bằng `phase-edit.js` bản sửa. Bảng ở mục trên ghi B5 7 lượt, B6 2 lượt.
- Bỏ lượt 1 lạnh thì khoảng 0,23–0,24M, ngang mốc.
- B5 chỉ còn 1 lượt, 13k (mốc 2–3 lượt, 27–37k).
- B6 tăng lên 8 lượt, 125k (mốc 94–107k), vì lượt 10–11 tra `tweak-site/SKILL.md` để biết việc ghi bù `DESIGN.md` có thuộc B6 không (24k).

**Một vòng T + E + H** (bỏ mất cache và lượt 1 lạnh): khoảng 1,13M, so với khoảng 1,27M và 1,25M của mốc (`rtm1` cũng trừ lượt 1 lạnh), tức thấp hơn khoảng 10 %. Mức này dưới ngưỡng của một lần chạy. Số lượt là 40, mốc 44 và 46.

### Soát từng việc

**tweak** `rts1`:

| Việc | `rts1` | mốc `rtm1` / `rtm2` |
|---|---|---|
| Lượt tìm có `qa_init --update`, `quick.py --dry`, tạo `FEATURE-DECISIONS.md` bằng `sed '/^## Tính năng/,$d'`, `grep -rn` chỉ thư mục trang | **một phần**, lượt 2. Đủ ba lệnh, nhưng `grep -rn` chạy trên cả thư mục prototype (bỏ `concept/`, `_qa/`) chứ không chỉ `site/`. Agent cố ý làm vậy để tìm `0909` trong `DECISIONS.md` mà soát cờ Y, và tìm thấy ở `DECISIONS.md:25` | không có lệnh tạo file; `grep` cả `concept/` |
| Không tra khuôn ở `evolve-site`, không `grep` lại | có | tra khuôn ở lượt 4–6; `grep` lại ở lượt 3 |
| Đọc một lượt | **không**, lượt 3–5: <br>• lượt 3 đọc `index.html`, `FEATURE-DECISIONS.md` vừa tạo, `AGENTS.md` và `grep` CSS chung; <br>• lượt 4 `grep` `.hero-cta`, `.info-side` và in mục cấm của `DESIGN.md`; cờ C lộ ra ở lượt này; <br>• lượt 5 `Read` đoạn `site.css`, vì Edit cần file đã đọc | không (2–3 lượt) |
| Sửa một lượt | có, lượt 6 | có |
| Kiểm bằng `quick.py --note … --shots` | có, lượt 7, kèm `PYTHONIOENCODING=utf-8` | có |
| Mở một ảnh, đúng lát có nhãn, cùng lượt ghi nhật ký | có, lượt 8: `smoke-index-390/index-4.jpg (Mở 5:30 đến 19:00, nghỉ thứ Hai)` | rtm1 mở thêm ở lượt 9 vì đoán sai lát |
| Dòng nhật ký thay dòng mẫu `<dd/mm/yyyy>` | có, và tiêu đề có tên dự án | — |
| Không tự chụp, không đọc mã script | có (0 · 0) | có |

**evolve** `res1`:

| Việc | `res1` |
|---|---|
| Lượt vào 1: `Read b1-b2.md`, file dự án, lệnh 1 | có, lượt 2. Kèm `README.md` của prototype; file không có nên lỗi, vô hại, như mốc |
| Ảnh mốc bằng `run_all.py _qa/truoc` | có, lượt 3 (`smoke-index` và `smoke-_system`), cùng lượt đọc 4 file sẽ sửa |
| Lượt vào 2: `Read b3-b4.md`, file sẽ sửa, lệnh 2 | có, lượt 4: `b3-b4.md`, `qa.config.json`, `steps-smoke-index.json`, lệnh 2, `cat tokens.css` |
| Đỏ rồi xanh với `_qa/.tdd` | có: đỏ ở lượt 7 (FAIL 20 ở mỗi khổ), xanh ở lượt 9 ngay lần dựng đầu |
| B4 bằng `quick.py --shots`, cùng lượt `sed` in `regression-qa.md` | có, lượt 10 |
| Không đọc mã | có. 0 lệnh; chỉ in phần đầu `run_all.py` theo lệnh 2 |
| Bẻ thử bằng `breaktest.py` khi có bước phủ định, không `.bak` tự viết | có. Lượt 11 bẻ 3 quy tắc: <br>• "khoá mẻ đã hết" bắt được, FAIL 1; <br>• "không mở Zalo khi chép bị chặn" bắt được, FAIL 2; <br>• "chặn khi thiếu" ra `KHÔNG BẮT ĐƯỢC`: trong headless việc chép bị chặn, nên hộp đứng yên giống như khi chặn đúng. Lượt 12 sửa bước, lượt 13 bẻ lại thì bắt được, FAIL 2. <br>0 lệnh `.bak`; mốc rem2 tự viết bẻ thử, tốn 92k |
| Sau vòng sửa chỉ mở ảnh trong dòng `đổi so với lần chụp trước` | có: lượt 13 báo 4 ảnh đổi, lượt 14 mở đúng 4 ảnh đó. Mốc mở lại 17 và 7 ảnh |
| Ảnh `_system` chọn theo nhãn; mục Hộp giữ bánh ở 390 có ảnh và được mở đúng lát | có. Ở 390 mục này nằm ở `_system-23` (nhãn `Hộp giữ bánh · sheet và hộp tho…`) tới `_system-26`; lượt 11 mở lát 23 và 26. Ở 1440 mở `_system-9` (nhãn có Hộp giữ bánh) và lát 10. Mốc rem2 mở 4 lát ở 390 mà không tới mục mới |
| Không `UnicodeEncodeError` | có, 0: mọi lệnh python đều đặt `PYTHONIOENCODING=utf-8`. Ở mốc, rem1 và rem2 đều gặp |

**handover** `rhs1`:

| Việc | `rhs1` | mốc `rhm1` / `rhm2` |
|---|---|---|
| B1 một lượt với `handover.py ledger` | **một phần**: `ledger` ở lượt 3, cùng `qa_init` và `FEATURE-DECISIONS.md`. B0–B1 vẫn 4 lượt: <br>• lượt 2 `ls` để biết đã có bộ kiểm chưa; <br>• lượt 4 `find` và `grep` tìm trang tổng quan, bảng đối chiếu (việc của B2) | 4–5 lượt |
| Không mở `qa.config.json` (dòng `Ảnh Hub` có sẵn) | có: lượt 3 in `Ảnh Hub: không khai báo ("thumbs" trong qa.config.json) …`. Lượt 4 chỉ `grep -n thumbs` cùng hai file khác, ra 1 dòng (`fixes-edit.js` vẫn đếm 1) | cả hai lần `cat` nguyên file ở lượt 4 |
| Không đọc `ledger.jsonl` | có | có |
| B3 bằng `qa-check.py` | có, lượt 5 | có |
| Không đọc `handover.json` (nợ cũ, bộ mới, bộ mất có trong kết quả) | có (0) | đọc ở lượt 9 và 13 |
| B5 chấm phần của lần tweak, bỏ đợt evolve Cấp 2, không chấm `_system.html` | có; `QA.md` ghi rõ phạm vi và lý do | chấm phần tweak; cả 4 lần nêu luật mơ hồ |
| Bảng UX in bằng `sed` | có, lượt 6 | có |
| Mở đúng lát theo nhãn | có. Lượt 6, cùng lượt `sed`, mở 5 ảnh: lát có nhãn khối giờ mở ở 1440, 768, 390, và lát nối tiếp ở 1440, 390 | 2 lượt, mở lại vì đoán sai lát |
| Bảng của `QA.md` có cột nợ cũ lấy từ dòng theme | có (`Nợ cũ` 0) | — |
| Không đọc mã script | có | có |

### Chất lượng (chỉ mở ảnh)

- **T** (`goi-390.jpg`): hai nút viền "Xem đường đi" và "Gọi 0909 123 456", icon `phone`, xếp hai dòng, không tràn. Giống `rtm1`, lần đó cũng ghi cả số.
- **E** (`giu-banh-mo-390`, `giu-banh-mo-1440`):
  - Ở 390 là sheet sát đáy; ở 1440 là hộp thoại giữa màn, rộng 576px.
  - Mẻ 6:00 gạch "Đã hết", mẻ 9:30 chọn sẵn. Có ô −/+ cho 4 loại bánh, ô tên, nút chính ghim ở chân hộp.
  - Lúc mới mở, khung "Tin nhắn sẽ chép" khuất dưới mép vùng cuộn ở cả 390 và 1440. Mốc cũng vậy; agent tự nêu ở Cổng 3 (điểm 8).
- **`_system` 390** (`system-390-hop.jpg`, lát 24): mục Hộp giữ bánh có ảnh, là mẫu tĩnh với 2 loại bánh, tên "Lan" và tin nhắn soạn sẵn. Ở khổ này, chữ "Đang nướng", "Chưa vào lò" trong ô mẻ xuống hai dòng, vì khung mẫu hẹp hơn hộp thật.
- **H** (`QA.md`):
  - Gán đủ 3 dòng nhật ký (1 tweak, 2 evolve): 0 khác biệt đã gán, 0 khác biệt không gán được, 0 file ngoài nhật ký, 2 bộ mới của lần [2].
  - Ghi bù vào `DESIGN.md` phần mà lần tweak bỏ sót: icon `phone`, `.info-cta`, nút Gọi ở sơ đồ trang.
  - Nêu mẫu khối giờ mở trên `_system.html:372` chưa có nút Gọi, và hai nút lệch nhau ở 390, 768.
  - **Sót một chỗ mà cả 4 lần mốc đều sửa:** `DESIGN.md` ghi `_system.html` có 3 `.field-err`, thật ra chỉ 2. Lượt 9 đếm bằng `grep -o 'field-err'`, khớp cả luật CSS trong `<style>` của `_system.html`, nên ra 3 và kết luận "khớp".
- **So với mốc:** T và E ngang mốc. `_system` 390 tốt hơn, vì ở mốc rem2 không thấy mục mới. H ngang mốc, trừ chỗ sót `.field-err`.

### Chỗ tốn nhất còn lại (số của `groupcost.js`)

1. **Lượt dựng của evolve** (`res1` lượt 6–9): 277k. Phần này cần thiết. Lượt 8 dài 295 s, sát TTL 5 phút của subagent; dài thêm 5 s là mất khoảng 150k (chỉ khi chạy dạng subagent).
2. **Lượt 3 của evolve đọc nguyên 4 file:** 128k, gồm phần mang tới cuối. Bốn file là `index.html` (19,7k ký tự), `site.css` (14k), `_system.html` (29,2k) và `DECISIONS.md` (15k).
   - `DECISIONS.md` phải đọc vì lệnh 1 `grep` tài liệu yêu cầu với `--exclude-dir=prototypes`, nên không thấy nguồn. Cả 3 lần bản mới (rem1, rem2, res1) đều gặp.
3. **Vòng sửa B4 của evolve** (lượt 12–14): 157k. Vòng này gộp hai việc:
   - sửa bước "chặn khi thiếu" mà `breaktest.py` báo không bắt được;
   - sửa UX thấy qua ảnh: focus khi mở rơi vào tiêu đề, nút thiếu chuyển tiếp khi nhấn.

   Đây là việc chất lượng, không phải phí thừa.
4. **Phần chuẩn bị B6 của handover** (`rhs1` lượt 7–12): 6 lượt, 90k.
   - Lượt 10–11 (24k) tra `tweak-site/SKILL.md` để biết việc ghi bù `DESIGN.md` sau lần tweak có thuộc B6 không.
   - Lượt 9 và 12 đếm chỗ dùng bằng `grep`; lượt 12 đếm lại `.btn-ghost`.
5. **Lượt đọc của tweak** (`rts1` lượt 4–5): 24k. Cờ C chỉ lộ ra khi xem CSS. `site.css` mới được `grep` chứ chưa `Read`, nên phải thêm một lượt `Read` trước khi Edit.

Ngoài năm chỗ trên:
- Lượt 1 lạnh ở cả ba lần, cộng lại khoảng 87k. Đây là hiện tượng của cách đo (ba subagent khởi động cùng lúc), không do skill.
- Lượt 5 của evolve (B2) đọc `integration-patterns.md` dù Cổng 2 đã chỉ định. Phí lượt 15k. Phần lớn trong 47k "mang theo" là chính lượt đó (nghĩ 170 s cho bước dựng), không phải tài liệu.

### Đề xuất bước tiếp (ước từ số đo; chưa sửa skill)

| # | Việc | Ước tiết kiệm | Chắc chắn |
|---|---|---|---|
| 1 | `handover-check` B6 nói rõ: lần tweak không cập nhật `DESIGN.md` (icon mới, sơ đồ trang, chỗ dùng), B6 ghi bù. Kèm lệnh đếm chỗ dùng chỉ trong markup, bỏ `<style>` | 25–45k mỗi lần handover có tweak; sửa luôn lỗi đếm `.field-err` | khá: rhs1 lượt 10–11 tốn 24k, đếm 2 lượt; rhm1 lượt 11–12 đếm lại, 25k |
| 2 | `handover.py ledger` in thêm dòng "bộ kiểm: đã có" và "trang tổng quan / bảng đối chiếu: không", để B0 không phải `ls`, B2 không phải `find` | 15–20k mỗi lần handover | cao: B0–B1 tốn 4–5 lượt ở cả 3 lần bản mới |
| 3 | `evolve-site` lệnh 1: `grep` nguồn yêu cầu cả `DECISIONS.md`, `CONCEPT.md` của prototype (bỏ `site/`, `concept/`, `_qa/` thay vì bỏ cả `prototypes`) | 10–20k mỗi lần evolve | cao: 3 trên 3 lần |
| 4 | `tweak-site` bước đọc: khi thêm hay sửa thành phần cạnh một thành phần có sẵn, `grep -n` luật CSS của khối chứa rồi `Read` đúng đoạn đó, trong cùng lượt đọc | 10–25k mỗi lần tweak | khá: cả 3 lần bản mới đọc mất 2–3 lượt |
| 5 | `evolve-site`: khi Cổng 2 đã chỉ định, in phần cần của `integration-patterns.md` ngay trong lượt vào 2 | 10–15k mỗi lần evolve | trung bình: B2 là một lượt riêng ở cả 3 lần, nhưng phần lớn chi phí của lượt đó là nghĩ cho bước dựng, phần này vẫn còn |

- Cộng lại khoảng 70–125k mỗi vòng T + E + H, tức 6–11 % của khoảng 1,13M. Mức này dưới ngưỡng của một lần chạy, phải đo nhiều lần mới thấy. Phần phí do ba skill sửa gây ra gần như đã hết.
- Hai việc không vì token:
  - bộ kiểm băm `steps-*.json` theo byte, nên lệch giữa CRLF và LF (mục *Mốc lệch vì xuống dòng*, chưa sửa trong bộ kiểm);
  - đếm chỗ dùng sai (đề xuất 1).

### Sửa script trong lần đo này

- **`phase-edit.js`:**
  - **handover:** khi đã vào B5 thì các lệnh sau tính là B6: đọc `DESIGN.md`, lệnh nhắc `DESIGN.md` hay `QA.md`, đếm chỗ dùng (`grep -c`, `grep -o … | wc -l`).
    - Trước đây B6 chỉ được nhận lúc ghi file, nên phần chuẩn bị B6 bị tính vào B5, ở cả mốc. Sau khi sửa: rhm1 B5 từ 7 lượt còn 3, B6 từ 2 lên 6; rhm2 B5 từ 7 còn 2, B6 từ 2 lên 7.
    - Lời chính agent ở các lượt đó xác nhận: "Next I'll gather what B6 needs", "B6: checking …".
  - **evolve:** lượt chỉ có dấu hiệu B2, đến sau lượt vào 2 mà chưa sửa `site/`, được tính là B2; các lượt sau vẫn là B3. Áp vào `res1` lượt 5. Số của rem1, rem2 không đổi.
- **`fixes-edit.js` dòng 11:**
  - `UnicodeEncodeError` chỉ đếm lỗi thật của python (`UnicodeEncodeError: …`, `'charmap' codec can't`). Trước đây script đếm cả chữ nhắc lỗi này trong `SKILL.md` vừa đọc, nên bắt nhầm lượt 1 của `rts1`.
  - `grep -r` ngoài thư mục trang giờ xét từng đoạn lệnh. Lượt tìm của tweak gói `grep` chung một lệnh với `qa_init` của `<skills>`, nên trước đây cả lệnh bị bỏ qua. Trên mốc, giờ ra rtm1 lượt 2, 3 và rtm2 lượt 2, 4, 7.

### Transcript và dữ liệu

| Kịch bản | Lần | Agent | Ảnh và file |
|---|---|---|---|
| T | `rts1` | `a7f7c40bd0d14099f` | `runs-edit-sau-sua/rts1/`: `FEATURE-DECISIONS.md`, `goi-390.jpg` |
| E | `res1` | `a490d949a495e0b8b` | `runs-edit-sau-sua/res1/`: `FEATURE-DECISIONS.md`, `giu-banh-mo-390.jpg`, `giu-banh-mo-1440.jpg`, `system-390-hop.jpg` |
| H | `rhs1` | `ae9a6ab777b91a2cd` | `runs-edit-sau-sua/rhs1/QA.md` |

- Bản gốc ở `~/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/105ba07d-cb4e-4891-9a8b-ce003cd6670b/subagents/`. Bản nén ở `transcripts/edit-sau-sua/agent-<id>.jsonl.gz`, kèm `.meta.json`.

## sketch-to-map: đề đo r7-map (soạn 05/10/2026)

Đề để đo `sketch-to-map`: skill có gom **đủ** chức năng từ một bộ tài liệu nhiều file không, và quy trình cũ (`sketch-to-site` B1 đọc đủ tài liệu rồi lập sơ đồ trang) sót bao nhiêu. Đề giả lập theo **khuôn tài liệu BA của một dự án thật** của nhóm *(use case, quy tắc nghiệp vụ, ca biên, quyết định gỡ xung đột, ưu tiên phạm vi, schema)*, nhỏ hơn bộ tài liệu thật khoảng 20 lần. Nội dung viết mới, không chép từ dự án đó.

**Dự án:** trung tâm bơi giả *Sóng Xanh*. Hệ thống nhiều bề mặt: web quản trị (Quản lý, Lễ tân, HLV) và app phụ huynh (iOS, Android).

**Thư mục bắt đầu** `r7-map/sample/`:
- `CONCEPT.md`, `DECISIONS.md`: Cổng 1–2 đã chốt *(concept b "Làn bơi")*. Không kèm bảng concept và màn then chốt.
- `docs/yeu-cau/`: 7 tài liệu, khoảng 48 KB.

| File | Nội dung |
|---|---|
| `YEU-CAU-HE-THONG-SONG-XANH.md` | Tổng quan, `YC-01…14`, `NF-01…05`, Phụ lục A bảng giá |
| `USE-CASE-SONG-XANH.md` | 12 use case `UC-01…12`, ma trận actor × UC, ma trận quyền theo chức năng (mục 4), đặc tả đủ 12 UC |
| `BUSINESS-RULES-SONG-XANH.md` | 37 quy tắc `BR-HV/LH/LI/DD/TT/TB/QT-nn` |
| `EDGE-CASES-SONG-XANH.md` | 10 ca biên `A-01…10`, 3 câu hỏi mở `OQ-01…03` |
| `XUNG-DOT-SONG-XANH.md` | 4 quyết định `XD-01…04`, đè lên đoạn trái với chúng ở file khác |
| `UU-TIEN-PHAM-VI-SONG-XANH.md` | MoSCoW: `M-01…09`, `S-01…04`, `CO-01…02`, `W-01`; GĐ1 và GĐ2 |
| `schema.dbml` | Bảng và enum trạng thái |

**Đáp án** `r7-map/key.json`: 43 chức năng mà bản đồ đúng phải có (3 cái hoãn sang GĐ2, bản đồ vẫn phải giữ với trạng thái hoãn), cộng 4 thứ **không được dựng**. 18 chức năng là **bẫy**, theo 12 kiểu chức năng dễ sót khi đọc một bộ tài liệu BA:

| Kiểu bẫy | Mục |
|---|---|
| Ngụ ý trong quy tắc nghiệp vụ | K04 chọn con trên app (`BR-HV-03`) · K09 danh sách chờ (`BR-LH-04`) · K22 sửa điểm danh (`BR-DD-05`) · K29 hoàn tiền (`BR-TT-08`) · K40 ngày nghỉ lễ (`BR-LI-04`) |
| Chỉ có trong ma trận quyền | K36 xuất báo cáo ra Excel (`USE-CASE` mục 4) |
| Chỉ có trong ca biên | K18 HLV dạy thay (`A-02`) · K27 hết buổi, gia hạn tại quầy (`A-05`) |
| Việc tự động có cấu hình | K33 cấu hình nhắc lịch (`BR-TB-02`) |
| Một việc mang hai tên | K26 *bảo lưu* (`UC-09`) = *tạm dừng gói* (`YC-09`, `BR-TT-05`): phải là **một** chức năng |
| Nằm trong phụ lục | K30 bảng giá (ghi chú dưới Phụ lục A) |
| Quản trị hiếm dùng | K38 nhật ký thao tác (`BR-QT-04`) |
| Thao tác hàng loạt | K17 huỷ mọi buổi khi bể sự cố (`A-03`, `XD-04`) |
| Biến thể theo vai | K12 lịch dạy, HLV chỉ thấy lớp mình (ma trận quyền, `BR-QT-02`) |
| Nhắc ở tổng quan, đặc tả ở tài liệu khác | K10 học thử (`YC-05` → `BR-LH-06`) |
| Quyết định XD đè đoạn cũ | K14 phụ huynh **gửi yêu cầu** đổi lịch, K15 lễ tân xử lý yêu cầu (`XD-02`); và N1 *phụ huynh tự đổi lịch* là thứ không được dựng |
| Bước chuyển trạng thái chỉ có trong schema | K16 học bù (`diem_danh.da_hoc_bu`, `buoi_bu_id`) |

Không được dựng: N1 phụ huynh tự đổi lịch (bị `XD-02` bỏ) · N2 chống thu tiền trùng (`A-09`) và N3 điểm danh khi mất mạng (`A-10`), là ca vi mô kỹ thuật, chỉ ghi chú · N4 thanh toán online (`W-01`).

**Chấm:** `node mapscore.js r7-map/key.json <thư-mục-chạy>`.
- Có `map/features.js` thì chấm dữ liệu: khớp tên chức năng. Script báo mục trượt, bẫy theo kiểu, trùng (K26), dựng thừa (N1–N4 trong phạm vi), sai trạng thái (K41–K43 phải hoãn), mục *cần soát tay* (tên không khớp mà mô tả hay mã nguồn khớp), và chức năng ngoài đáp án. Chức năng ngoài đáp án có thể là chức năng tách nhỏ hợp lệ.
- Không có thì chấm văn bản `MAP.md`, `DESIGN.md` theo từng dòng. Dùng cho mốc cũ, nơi sơ đồ trang nằm ở `DESIGN.md` mục 9.
- Khớp bằng từ khoá nên có thể lệch: luôn soát tay mục trượt và *cần soát tay* trước khi chốt số.
- `node mapscore.js --selfcheck r7-map/key.json r7-map/sample/docs`: mã nguồn của đáp án có trong tài liệu, tên mỗi mục khớp lựa chọn của nó, không mục nào khớp nhầm tên mục khác. Phải in `Không có chỗ cần sửa.` sau mỗi lần sửa đề hay đáp án.
- Đã thử trên ba kết quả giả: bản đồ đúng hết ra 43/43; bản đồ gài lỗi bắt đủ 3 mục trượt, 1 trùng, 1 dựng thừa, 1 sai trạng thái; sơ đồ trang dạng văn bản chấm theo dòng.

**Đề có thể lệch ở đâu:** tài liệu giả gọn hơn tài liệu thật, và một số bẫy cũng được nhắc ở file ưu tiên (`M-02` danh sách chờ, `M-06` yêu cầu đổi lịch, `M-08` nhật ký). Sau khi đạt trên đề này, chạy thử trên một module của dự án thật.

### Mốc cũ (đo 05/10/2026)

Prompt `prompt-map-moc-cu.md`: `sketch-to-site` ở `66e55cb` (bản 1.5.0), B0 và B1 đủ, ở B2 chỉ lập sơ đồ trang và đề xuất phạm vi. Một lần chạy `rm0a`, máy Windows (Node 20.19.5, Python 3.14), subagent `general-purpose` chạy nền, model Opus 5.5. Chuẩn bị bằng `cloud-setup.sh 66e55cb`.

| | `rm0a` |
|---|---|
| Lượt · token quy đổi · thời gian | 9 lượt · 0,31–0,33M · 7,7 phút, không lượt nào mất cache |
| Đọc tài liệu | Cả 7 file đọc **nguyên văn trong một lượt** (lượt 4, khoảng 43k ký tự), cùng `mobile-app.md`, 4 lần tra `ui-ux-pro-max` |
| Sơ đồ trang | 26 màn: 16 web quản trị, 10 app; điều hướng theo vai; 12 luồng xuyên bề mặt |
| `mapscore.js` *(đã soát tay)* | **Trúng 42/43 · bẫy 17/18** · trùng 0 · dựng thừa 0 · hoãn K41–K43 để ngoài sơ đồ, ghi GĐ2 |
| Trượt | K16 xếp buổi học bù: bước chuyển `vang_co_phep → da_hoc_bu` chỉ có trong `schema.dbml`. Màn điểm danh chỉ có ba trạng thái |
| Cớ đọc thiếu | Không có: không file nào bị bỏ hay đọc một phần. Khối thinking của transcript rỗng, chỉ soát được phần chữ |
| Phạm vi đề xuất | Khuyến nghị **10/26 màn**; 16 màn còn lại *(A3, A4, A7–A9, A11–A16, P4, P6, P8–P10)* không có chỗ nào theo dõi sau Cổng 3 |

Soát tay `mapscore.js` lần đầu: K17 bị chấm trượt dù A1 có lớp phủ *Huỷ buổi do sự cố* theo khoảng giờ; K16 bị chấm trúng vì chữ *buổi bù* (buổi cộng khi trung tâm huỷ). Đã sửa `match` của K16, K17 trong `key.json`; chấm lại khớp soát tay.

**Đọc kết quả:**
- Ở cỡ khoảng 48 KB, quy trình cũ **không** sót chức năng khi đọc và lập sơ đồ: đọc nguyên cả bộ trong một lượt, bắt 17/18 bẫy. Đề `r7-map` ở cỡ này chưa phân biệt được bản cũ và bản mới ở phần kiểm kê.
- Chỗ sót ở dự án thật nhiều khả năng nằm ở chỗ khác. Ba giả thuyết cần đo:
  1. **Quy mô:** tài liệu của dự án thật khoảng 1 MB, gấp khoảng 20 lần, không đọc nguyên trong một lượt được.
  2. **Phạm vi không được theo dõi:** sơ đồ có đủ, nhưng chỉ khoảng 40 % số màn được dựng; phần còn lại không có trạng thái nào sau Cổng 3, nên lúc bàn giao trông như thiếu.
  3. **Bước dựng:** B3 dựng theo dòng sơ đồ có thể bỏ lớp phủ, tab, mục phụ đã ghi.
- Đối chiếu thêm với một prototype thật dựng bằng `sketch-to-site` 4.x, trước đợt giảm token *(chi tiết ghi ở plan nội bộ, không đưa lên nhánh này)*:
  - ở mức use case không sót, sơ đồ và trang dựng phủ đủ 52/52;
  - ở mức nhánh rẽ cần giao diện, phủ 36/39; 3 nhánh thiếu đều là ngoại lệ chồng ngoại lệ, 2 trong số đó tài liệu tự ghi là suy ra, chưa xác nhận;
  - chỗ yếu là bố cục: một trang gánh 10 use case, việc hằng ngày không có lối vào trên menu, menu có nhóm đặt theo giai đoạn phát hành.
  Giả thuyết *sót khi đọc* chưa được xác nhận; trọng tâm nên chuyển sang bố cục.
- Bản đồ dày ở vài màn (A1 có 4 lớp phủ và một chế độ xếp lớp; A2 gom 7 loại việc), nhưng phần *tìm được và gọn* chưa đo được bằng đề này.

**Dữ liệu:** transcript `transcripts/map-moc-cu/agent-afc2df761a334005b.jsonl.gz` (+ `.meta.json`), phiên `ff1a1681-5d0f-48ae-8ce9-f4e28f9ca839`. `DESIGN.md`, `DECISIONS.md` của lần chạy ở `runs-map/rm0a/`.

### Mốc bố cục: tree test (đo 05/10/2026)

Cây chỉ có nhãn, dựng từ sơ đồ trang của `rm0a` *(menu theo vai, tab của app, tab, mục và nút của từng trang; bỏ mô tả và mã yêu cầu)*: `r7-map/treetest/rm0a-cay.md`. 10 việc viết theo lời người dùng, có tầng và nút đích: `r7-map/treetest/viec.json`. Ba người thử `Explore` (vai a, b, c của `treetest-prompt.md`), chạy song song, khoảng 30k token mỗi người.

| | `rm0a` |
|---|---|
| Thành công | **30/30 (100 %)** |
| Đi thẳng | 26/30 (87 %) |
| Quay lui | T4 *ai đã sửa điểm danh*: 2/3 người vào Điểm danh trước · T6 *trả lời yêu cầu đổi lịch*: 1/3 vào Thông báo trước · T10 *phụ huynh xin đổi buổi*: 1/3 vào yêu cầu đang chờ trước |

Đối chiếu với một prototype thật dựng bằng 4.x: cũng 100 % thành công, 93 % đi thẳng.

**Đọc kết quả:** tree test bằng mô hình **chạm trần**. Người thử đọc được cả cây, và nhãn của cả hai bản đều rõ, nên số này không phân biệt bố cục tốt với bố cục kém. Chỉ dùng như bước soát nhãn rẻ, không làm cổng chặn. Chỗ yếu của bố cục phải đo bằng số đếm được ở mức luồng (`flowscan.js`) và bằng người bấm thử ở cổng.

Kết quả từng người: `r7-map/treetest/rm0a-a.json`, `rm0a-b.json`, `rm0a-c.json`. Chấm lại: `node treescore.js r7-map/treetest/viec.json r7-map/treetest/rm0a-*.json`.

### Mốc cũ trên giấy: chỉ số bố cục của `rm0a` (tính tay 06/10/2026)

Tính từ sơ đồ trang `runs-map/rm0a/DESIGN.md` mục 9, theo định nghĩa chỉ số của `sketch-to-map` (`references/m2-bo-cuc.md`). Sơ đồ không khai kiểu mở, nên một nút sang trang khác mà không ghi đường về được tính là lối tắt đá đi.

| Chỉ số | `rm0a` |
|---|---|
| (1) Lối tắt đá đi không đường về | 3–4: A5 → A1 `?xep=` *(xếp lớp)* · A2 → lớp phủ Đổi lịch **của A5** · A5 *Bán gói* → A6 · A4 lưu xong mời sang A6 *(có thể coi là liên kết mở tiếp)* |
| (12) Vai thiếu trang chủ theo việc | 2: QL và LT vào thẳng *Lịch tuần* (màn làm việc, không có dải việc hôm nay); *Việc cần xử lý* là mục menu thứ hai. Nhóm menu theo đợt: 0 (GĐ2 để ngoài sơ đồ) |
| (2) Việc hằng ngày xa nhất | LT bán gói: Học viên → tìm và chọn → Hồ sơ → Bán gói, 3 bước + 1 lần tìm (≈ 11,1 giây) |
| (5) Màn dày nhất | A5 Hồ sơ học viên: khoảng 10 việc *(4 lớp phủ, 4 tab, Bán gói)*. A2 gom 7 loại việc |
| (4) Nhóm menu dài nhất | QL: 7 mục phẳng + nhóm Quản trị 3 |
| Theo dõi phạm vi | 16/26 màn ngoài phạm vi đề xuất không có trạng thái nào sau Cổng 3; GĐ2 nằm ngoài sơ đồ |

### Bản mới `sketch-to-map` 1.0 (đo 06/10/2026)

Prompt `prompt-map-moi.md`. Bản đo là **bản chụp** `skills/` của nhánh `feat/sketch-to-map` khi chưa commit (trên `66e55cb`), mã băm `2ca520e44dfb`. Hai lần `rmm1`, `rmm2`, chạy song song, máy Windows, subagent `general-purpose` chạy nền, model Opus 5.5; mỗi lần tự gọi một người thử `Explore` để soát nhãn. Tài liệu skill của bản chụp còn tên dự án thật ở vài chỗ; transcript đã thay bằng "dự án thật" trước khi lưu.

| | `rmm1` | `rmm2` | mốc cũ `rm0a` |
|---|---|---|---|
| Lượt · thời gian | 18 · 16,5 phút | 19 · 16,0 phút | 9 · 7,7 phút |
| Token quy đổi | 0,79M · trừ mất cache **0,62M** | 0,76M · trừ mất cache **0,62M** | 0,31–0,33M |
| Người thử nhãn (`Explore`) | 2 lượt · 31k | 2 lượt · 43k | — |
| Kiểm kê | 66 chức năng (62 phạm vi · 4 hoãn · 7 suy) · 10 module · 4 vai | 62 (58 · 4 · 5) · 10 · 4 | 26 màn, không có danh sách chức năng |
| `mapscore.js` *(đã soát tay)* | **43/43 · bẫy 18/18** | **43/43 · bẫy 18/18** | 42/43 · 17/18 |
| K16 học bù | bắt (F-19, `diem_danh.da_hoc_bu`) | bắt | trượt |
| Dựng thừa N1–N4 · hoãn K41–K43 | 0 · đúng | 0 · đúng | 0 · để ngoài sơ đồ |
| Nguồn | 12 UC · 9 Must · 1 bước chuyển · 7 nhóm trạng thái · 55 mục: 0 thiếu | như `rmm1` | — |
| `check` | lần đầu kiểm kê 8 chặn, sau đó 0; lần đầu có `layout.js`: **0 chặn, 0 cảnh báo** | kiểm kê 18 chặn rồi 0; lần đầu có `layout.js`: **0 chặn, 0 cảnh báo** | — |
| Soát nhãn | 9/10 tới đúng nút, 1 lần quay lại; sửa 2 chỗ đặt | 10/10, 5 lần quay lại; sửa 4 chỗ đặt và nhãn | 30/30 (3 người thử, cây dựng tay) |
| Ảnh mở trước cổng | 1 | 1 | — |

Soát tay `mapscore.js`: script chấm theo tên nên báo trượt K13, K19, K27, K32 ở `rmm1` và K17, K27 ở `rmm2`. Cả 6 đều có, chỉ khác tên hay gộp: K13 tách thành chuyển lớp (F-14) và dời một buổi (F-18); K19 là F-26 *Xem các buổi học sắp tới* (phụ huynh, UC-06); K32 là F-54 *Đọc thông báo của trung tâm* (UC-10); K17 là F-23 *Huỷ buổi học do trung tâm*, spec *"chọn khoảng giờ bị ảnh hưởng, huỷ mọi buổi một lần"*; K27 gộp vào điểm danh (bé hết buổi bị đánh dấu) và bán gói, cả hai trỏ A-05, giống cách mốc cũ được chấm trúng. Chức năng ngoài đáp án (10 và 15) là tách nhỏ hợp lệ hay chức năng suy (đổi mật khẩu, đối chiếu tiền cuối ngày…), hỏi ở cổng.

**Chỉ số bố cục** (dòng của lần `check` sạch cuối):

| Chỉ số | `rmm1` | `rmm2` | `rm0a` trên giấy |
|---|---|---|---|
| (1) lối tắt đá đi | 0 | 0 | 3–4 |
| (12) vai thiếu trang chủ · nhóm theo đợt | 0 · 0 | 0 · 0 | 2 · 0 |
| (7) mã lộ | 0 | 0 | — |
| (2) T1 xa nhất | 2 bước (≈ 8,4 giây) | 3 bước (≈ 11,1 giây) | — |
| (2) việc hằng ngày xa nhất | 3 bước (≈ 11,1 giây) | 3 bước (≈ 11,1 giây) | 3 bước + 1 lần tìm |
| (5) màn dày nhất | Gói học 6 chức năng, 3 tab | Hồ sơ 6 chức năng, 3 tab | Hồ sơ khoảng 10 việc, 4 tab |
| (4) nhóm menu dài nhất | 4 | 4 | 7 |
| (6) việc nhiều nhãn | 0 | 0 | — |
| Hoãn có chỗ trong bản đồ | 4/4 | 4/4 | 0 (ngoài sơ đồ) |

**Theo bước** (`phase-map.js`):

| Bước | `rmm1` lượt · quy đổi | `rmm2` lượt · quy đổi |
|---|---|---|
| vào | 3 · 70k | 2 · 64k |
| M0 | 1 · 19k | 1 · 19k |
| M1 | 5 · 191k | 4 · 165k |
| M2 | 3 · 110k | 2 · 71k |
| kiểm bố cục | 4 · 317k *(mất cache 166k)* | 7 · 350k *(mất cache 138k)* |
| cổng | 2 · 81k | 3 · 93k |

**Soát từng việc** (`fixes-map.js`):
- Đọc tài liệu: cả 7 bản chữ `map/_src/D1–D7.txt` đọc nguyên trong **một** lượt ở cả hai lần; không đọc lại, không đọc lướt.
- Đọc mã script: 0. Tự dò hay tự viết script: 0. Ảnh mở: 1. Kết quả lỗi, bị cắt, đường dẫn `/x/`: 0.
- Mất cache: một lần mỗi lần chạy (138–166k), ở lượt ngay sau lượt viết `layout.js` *(5,3–6,8 phút nghĩ và viết)*: TTL 5 phút của subagent, như các đợt đo trước. Phiên chính có TTL 1 giờ.
- Lượt thừa, cả hai lần: lệnh M0 chỉ ghi trong `m1-kiem-ke.md` nên lượt vào không chạy được nó (1 lượt) · khối Cổng Bản đồ phải tra khuôn `DECISIONS.md` của `sketch-to-site` (1 lượt) · chức năng suy, ghi chú và module phải lấy từ `MAP.md` (`rmm2` đọc `MAP.md` hai lần) · `Write` rồi chạy `check` ở lượt sau (`rmm2`, 2 lượt).
- `rmm1` còn đọc `sources.json`, `ids.json` và lục `features.example.js` tìm cách ghi `notes`, `skip`, `suy` (lượt 6–8, khoảng 120k). `rmm2` phải `grep check.json` vì danh sách chặn cắt ở 15 dòng (18 mục).

**Đọc kết quả:**
- Chất lượng đạt mọi mục tiêu: độ phủ 43/43 ở cả hai lần (mốc cũ 42/43), bắt K16, không dựng thừa, mọi chỉ số chặn đạt và tốt hơn mốc cũ trên giấy ở mọi chỉ số đếm được. Lần `check` đầu sau khi viết `layout.js` đã sạch: luật trong `m2-bo-cuc.md` đủ để viết đúng ngay.
- Chi phí **trượt mục tiêu**: 18–19 lượt và 0,62M trừ mất cache, so với mục tiêu ≤ 15 lượt và ≤ 0,5M. Gấp khoảng 2 lần mốc cũ, vì mốc cũ chỉ viết một sơ đồ trang dạng văn bản, không kiểm, không bố cục, không khung bấm thử.
- Các lượt thừa ở trên đã sửa trong skill sau lần đo (chưa đo lại): lệnh M0 ghi ngay ở bảng lối vào · `Write` và `check` cùng một lượt ở M1, M2 · khối `DECISIONS.md` in sẵn ở SKILL.md mục 3 · `check --shots` sạch in khối *Trình ở cổng* (chức năng suy, ghi chú, module theo thứ tự dựng kèm số Must) · danh sách CHẶN in tới 40 dòng · `m1-kiem-ke.md` nói bản in M0 là đủ và có ví dụ `suy`, `notes`, `hoan`. Ước bớt 4–6 lượt, khoảng 0,10–0,15M mỗi lần, tức gần mục tiêu.

**Dữ liệu:** transcript `transcripts/map-moi/agent-ac1e0076e338c5cf1.jsonl.gz` (`rmm1`), `agent-a616b6a40cb9f262b.jsonl.gz` (`rmm2`), người thử `agent-ada1eb2b208907bd7` (`rmm1`), `agent-ac8470468d08c6c55` (`rmm2`), kèm `.meta.json`; phiên `1f00601b-c0b1-4961-b82f-d0ec6ec26e54`. `features.js`, `layout.js`, `MAP.md`, `treetest.md`, `DECISIONS.md` ở `runs-map/rmm1/`, `runs-map/rmm2/`. Script mới: `phase-map.js`, `fixes-map.js` (thay biến trong lệnh như `phase-edit.js`).

## sketch-to-map: đề r8-map-lon, đường chia worker (soạn 06/10/2026)

Đề để đo đường **chia worker** của `sketch-to-map` (tài liệu vượt ngưỡng đọc nguyên 300 KB) mà vẫn chấm được bằng đáp án `r7-map/key.json`.

- `mk-r8.py` chép `r7-map/sample/` sang `r8-map-lon/sample/`, rồi thêm `docs/yeu-cau/PHU-LUC-DU-LIEU-SONG-XANH.md`: phụ lục dữ liệu xuất từ Excel (750 học viên, 1.050 khoản thu, 950 dòng điểm danh), 328 KB. Tổng 8 tài liệu, 376 KB. Seed cố định: chạy lại ra đúng từng byte (md5 của phụ lục `4996dc5df50625c284306716ba13a0ad`).
- Phụ lục là dữ liệu, không sinh chức năng nào, nên đáp án giữ nguyên 43 chức năng, 18 bẫy. Ba mục cấp 2 của phụ lục phải vào `skip`.
- `node mapscore.js --selfcheck r7-map/key.json r8-map-lon/sample/docs` in `Không có chỗ cần sửa.`
- **Giới hạn:** đề này kiểm cơ chế chia worker (agent chính chỉ đọc mục lục, worker đọc đúng dải dòng, `merge`, độ phủ khi đọc theo phần) và việc nhận ra phụ lục dữ liệu. Nó **không** tái hiện chi phí của 1 MB yêu cầu dày đặc: phần yêu cầu thật vẫn chỉ 48 KB.
- Chạy thử `sources.py` lúc soạn đề bắt được một lỗi: mã học viên `SX-0001…` ở cột đầu bảng thành hệ mã 750 định nghĩa (`ids.json` 89 KB), nên P24 sẽ báo mã học viên trên trang là mã tham chiếu lộ ra. Đã sửa trong skill: tiền tố từ 50 mã gần như chỉ nằm trong bảng là `data_codes`, không phải hệ mã (`ids.json` còn 11 KB).

Prompt đo: `prompt-map-do-lai.md`.

## sketch-to-map: đo lại sau sửa và đường chia worker (đo 06/10/2026)

Prompt `prompt-map-do-lai.md`. Bản đo: nhánh `feat/sketch-to-map` trên origin, commit **`230a7d1`**, sau `f1c0882`: có 6 chỗ sửa lượt thừa và chỗ sửa `data_codes` (`grep -c data_codes sources.py` = 8, `grep -c gateBlock map.mjs` = 2). Máy Windows như `rmm1`, `rmm2`: Node 20.19.5, Python 3.14, model Opus 5.5, phiên `82b1c6df-5dc8-4540-bc63-cbacb77d1b0b`. Bốn subagent `general-purpose` chạy nền, chia hai đợt: `rmm3` với `rml1`, rồi `rmm4` với `rml2`. `rmm3`, `rmm4` chạy trên đề `r7-map`, `rml1`, `rml2` trên `r8-map-lon`. Đề r8 đúng md5 `4996dc5d…`, `--selfcheck` sạch.

### Đường đọc nguyên: `rmm1`, `rmm2` → `rmm3`, `rmm4`

| | `rmm1` | `rmm2` | `rmm3` | `rmm4` |
|---|---|---|---|---|
| Lượt · thời gian | 18 · 16,5 phút | 19 · 16,0 phút | **11** · 15,4 phút | **10** · 14,9 phút |
| Token quy đổi | 0,79M · trừ mất cache 0,62M | 0,76M · 0,62M | 0,70M · trừ mất cache **0,48M** | 0,49M · trừ mất cache **0,42M** |
| Mất cache | 1 lần (166k) | 1 lần (138k) | 2 lần (lượt 5, 7: 219k) | 1 lần (lượt 5: 73k) |
| Người thử nhãn (`Explore`) | 2 lượt · 31k | 2 lượt · 43k | 2 lượt · 42k | 2 lượt · 42k |
| Kiểm kê | 66 (62 · 4 hoãn · 7 suy) · 10 module | 62 (58 · 4 · 5) · 10 | 68 (64 · 4 · 6) · 12 | 69 (65 · 4 · 8) · 11 |
| `mapscore.js` *(đã soát tay)* | 43/43 · bẫy 18/18 | 43/43 · 18/18 | **43/43 · 18/18** | **43/43 · 18/18** |
| K16 học bù · dựng thừa N1–N4 · hoãn K41–K43 | bắt · 0 · đúng | bắt · 0 · đúng | bắt (F-28) · 0 · đúng | bắt (F-23) · 0 · đúng |
| `check` kiểm kê đầu → lần đầu có `layout.js` | 8 chặn → 0 chặn, 0 cảnh báo | 18 chặn → 0, 0 | 19 chặn → 0 chặn, 2 cảnh báo | 19 chặn → 0 chặn, 1 cảnh báo |
| Soát nhãn | 9/10, sửa 2 chỗ | 10/10, sửa 4 | 10/10, 2 lần quay lại, sửa 2 chỗ đặt | 10/10, 1 lần quay lại, thêm 1 lối tắt |
| Mục 9 `fixes-map.js` | — | — | **sạch** | **sạch** |

Soát tay `mapscore.js`: cả hai lần báo trượt K17, như `rmm2`. Cả hai đều có thật: `rmm3` F-23 *"Chọn một buổi hay cả khoảng giờ (bể sự cố) để huỷ một lần"*, `rmm4` F-21 *"Chọn khoảng giờ hay một buổi… huỷ mọi buổi trong khoảng một lần"*. Chức năng ngoài đáp án (11 và 15) là tách nhỏ hợp lệ hay chức năng suy.

**Chỉ số bố cục** (lần `check` sạch cuối, cả hai 0 chặn · 0 cảnh báo):

| Chỉ số | `rmm3` | `rmm4` |
|---|---|---|
| (1) lối tắt đá đi · (12) vai thiếu trang chủ, nhóm theo đợt · (7) mã lộ · (6) việc nhiều nhãn | 0 · 0, 0 · 0 · 0 | 0 · 0, 0 · 0 · 0 |
| (2) T1 xa nhất · việc hằng ngày xa nhất | 3 bước (≈ 8,1 giây) · 3 bước (≈ 8,1 giây) | 3 bước (≈ 11,1 giây) · 3 bước (≈ 11,1 giây) |
| (5) màn dày nhất · (4) nhóm menu dài nhất | Hồ sơ 6 chức năng, 3 tab · 4 | Quầy hôm nay 6 chức năng · 5 |

**Theo bước** (`phase-map.js`):

| Bước | `rmm1` | `rmm2` | `rmm3` | `rmm4` |
|---|---|---|---|---|
| vào + M0 | 4 · 89k | 3 · 83k | 2 · 63k | 2 · 37k |
| M1 | 5 · 191k | 4 · 165k | 2 · 104k | 2 · 102k |
| M2 | 3 · 110k | 2 · 71k | 2 · 204k *(mất cache 75k)* | 2 · 203k *(mất cache 73k)* |
| kiểm bố cục | 4 · 317k *(166k)* | 7 · 350k *(138k)* | 3 · 262k *(144k)* | 2 · 91k |
| cổng | 2 · 81k | 3 · 93k | 2 · 66k | 2 · 61k |

**Soát từng chỗ sửa** (`fixes-map.js` mục 9, cả hai lần):
1. **M0 ở bảng lối vào: có hiệu lực.** M0 chạy ở lượt 2, cùng lượt với Read `m1-kiem-ke.md`, `CONCEPT.md`, `DECISIONS.md`. Vào + M0 tốn 2 lượt, trước đây 3–4.
2. **`Write` và `check` cùng lượt: có hiệu lực.** `features.js` ở lượt 4, `layout.js` ở lượt 6, mỗi lần một `Write` kèm `check`.
3. **Khối DECISIONS in sẵn: có hiệu lực.** Không tra khuôn của `sketch-to-site`. Cổng tốn 2 lượt (Edit `DECISIONS.md`, lượt báo).
4. **Khối *Trình ở cổng*: có hiệu lực.** Không đọc `MAP.md` lần nào; chức năng suy, ghi chú và module lấy từ bản in `check --shots`.
5. **CHẶN in tới 40 dòng: có hiệu lực.** Lần kiểm kê đầu 19 chặn, in đủ, không `grep check.json`.
6. **Bản in M0 là đủ, có ví dụ `suy`/`notes`/`hoan`: có hiệu lực.** Không đọc `sources.json`, `ids.json`, `states.json`, `*.example.js`. Chỉ `rmm3` Read `templates/features.js` (1,5k ký tự, cùng lượt đọc tài liệu, đúng chỉ dẫn của `m1-kiem-ke.md`).
- Đọc tài liệu: 7 bản chữ đọc nguyên trong **một** lượt (lượt 3). Tự dò hay tự viết script: 0 (`rmm4` sửa 3 `src` và 18 mục `skip` bằng một khối `python -` thay chuỗi, cùng lượt với `check`). Kết quả lỗi, bị cắt, `/x/`: 0. Ảnh mở: 1.
- 19 chặn của lần kiểm kê đầu đều là mục không sinh việc (tóm tắt, mục lục UC, ma trận actor, mục tiêu, ngoài phạm vi). Ghi `skip` gộp vào lượt vào M2 (Read `m2-bo-cuc.md` + `check --brief`), nên không tốn lượt riêng.
- Mất cache: ở lượt ngay sau lượt viết `features.js` (338–357 giây nghĩ và viết) và, ở `rmm3`, sau lượt viết `layout.js` (301 giây). TTL 5 phút của subagent; phiên chính có TTL 1 giờ.

### Đường chia worker: `rml1`, `rml2`

| | `rml1` | `rml2` |
|---|---|---|
| Agent chính: lượt · quy đổi · thời gian | 19 · 0,51M · 21,1 phút | 21 · 0,52M · 21,8 phút |
| Worker (`general-purpose`) | 7 · 28 lượt (4 mỗi worker) · **754k** | 7 · 57 lượt (6–11) · **916k** |
| Người thử nhãn (`Explore`) | 2 lượt · 44k | 2 lượt · 44k |
| **Tổng** | **49 lượt · 1,31M** | **80 lượt · 1,47M** |
| Mất cache | 0 | 0 |
| Worker một lượt · chạy nền · thời gian hai đợt | 4 rồi 3 · không · 286 + 309 giây | 4 rồi 3 · không · 299 + 287 giây |
| Kiểm kê | 84 (80 · 4 hoãn · **15 suy**) · 7 module | 87 (82 · 5 hoãn · **20 suy**) · 7 module |
| `merge` → sau gộp trùng | 87 → 84 (3 cặp trùng) | 93 → 87 (6 cặp, `check` chỉ cảnh báo 1) |
| `mapscore.js` *(script → đã soát tay)* | 41/43 → **43/43 · bẫy 18/18** | 40/43 → **43/43 · bẫy 18/18** |
| K16 học bù | bắt (F-05) | bắt |
| `check`: `merge && check` đầu → lần đầu có `layout.js` | 20 chặn → 0 chặn, 2 cảnh báo | 21 chặn → **5 chặn** (script gộp trùng hỏng) → 0 |
| Chỉ số bố cục | T1 và việc hằng ngày xa nhất 3 bước (≈ 11,1 giây) · Lịch tuần 6 chức năng, 2 tab · nhóm menu 5 · còn lại 0 | 3 bước (≈ 11,1 giây) · Hồ sơ 6 chức năng, 4 tab · nhóm menu 5 · còn lại 0 |
| Soát nhãn | 10/10, 0 lần quay lại | 10/10, 0 lần quay lại |
| `ids.json` | `"data_codes": {"SX": 750}`, không có `SX` trong `systems`, 11 KB | như `rml1` |
| Ba mục phụ lục trong `skip` | có (`D3:5-759`, `D3:760-1814`, `D3:1815-2768`) | có |

Soát tay `mapscore.js`:
- `rml1`: K15 tách ba (F-46 hàng chờ yêu cầu, F-47 đổi từ yêu cầu, F-48 từ chối). K27 như cách chấm `rmm1`: F-01 *"Bé hết buổi, hết hạn không chọn Có mặt được (A-05)"*, F-07 *"bán tại chỗ"*.
- `rml2`: K13 tách hai (F-44 đổi một buổi, F-63 chuyển lớp, cùng UC-08). K17 là F-53 *Huỷ các buổi khi bể sự cố* (*"huỷ mọi buổi trong khoảng đó một lần"*). K24 là F-11 *Xem các lần đóng tiền* (UC-02, UC-06) cộng biên lai ở F-08.
- Cả hai báo **trùng K26** (bảo lưu cộng *Tự mở lại / Tự kết thúc bảo lưu*). Không tính là trùng: chức năng bảo lưu đã gộp hai tên (*"còn gọi tạm dừng gói"*, *"BR-TT-05 và YC-09 gọi là tạm dừng gói"*); chức năng kia là bước tự động khi hết hạn.

**Theo bước** (`phase-map.js`, agent chính):

| Bước | `rml1` | `rml2` |
|---|---|---|
| vào | 2 · 61k | 2 · 34k |
| M0 *(gồm đọc mục lục `sources.json`)* | 2 · 27k | 3 · 43k |
| M1 *(2 lượt gọi worker, `merge && check`, `skip` cho mục chung)* | 6 · 119k · 10,6 phút | 6 · 109k · 10,5 phút |
| M2 *(gộp trùng, `layout.js`)* | 4 · 158k | 4 · 133k |
| kiểm bố cục | 3 · 86k | 4 · 138k |
| cổng | 2 · 59k | 2 · 58k |

**Soát từng việc:**
- **Agent chính không đọc nguyên phụ lục:** đúng, cả hai lần. Không Read bản chữ nào; chỉ in dòng tiêu đề của ba bảng (`sed -n '1,8p;760,764p;1815,1819p' D3.txt`, `rml2` chỉ `1,8p`) để ghi `skip`. Đọc `sources.json` một lần (được phép).
- **Worker đọc đúng dải của mình:** đúng, 14/14 worker (so dải Read hay `awk` với dải trong prompt, bằng một script nhỏ ở scratchpad). Chỉ worker `hoc-vien` của mỗi lần gộp hai dải liền nhau thành một (thừa 2–4 dòng ở chỗ nối). Không worker nào đọc D3.
- **≤ 4 worker một lượt:** đúng, 4 rồi 3. Gọi tiền cảnh trong một lượt nên vẫn chạy song song; mỗi đợt khoảng 5 phút.
- **`merge && check` một lệnh:** đúng, cả hai lần.
- **Prompt worker khác nhau giữa hai lần, và đó là chênh lệch chính:** agent chính của `rml1` tự thêm *"dùng Read với offset/limit, gọi các lần Read cùng một lượt"*; khuôn ở `m1-kiem-ke.md` mục 6 không có câu này. Worker của `rml1`: 4 lượt (Read mọi dải · Read mục 3, 4, 5, 7 của m1 · `Write` phần · trả dòng). Worker của `rml2`: `Grep` tiêu đề m1, `awk` một nhóm dải mỗi lượt, `ls parts/`, `Write`, rồi `node -e` để đếm số trả về: 6–11 lượt, cả 7 worker tự viết script đếm. Chênh 29 lượt và 162k.
- **Mục chung không ai ghi `skip`:** prompt dặn worker chỉ ghi `skip` trong dải riêng, nên lần `merge && check` đầu chặn 20–21 mục chung (tóm tắt, mục lục UC, ma trận actor, bối cảnh, mục tiêu, ngoài phạm vi, ba bảng phụ lục). Agent chính in từng mục ra xem rồi ghi `skip`: `rml1` lượt 8–11 (≈ 59k), `rml2` lượt 9–11 (≈ 45k).
- **Sửa `features.js` sau `merge`:** `rml1` Edit bị từ chối (*"File has not been read yet"*: file do `merge` ghi, agent chưa Read), rồi chèn `skip` bằng `sed -i … r skip.txt` và gộp trùng bằng `merge_dups.py` ở scratchpad. `rml2` dùng khối `python -` từ đầu; một lần regex hỏng vì `\` trong heredoc của Git Bash, nên lần `check` đầu có `layout.js` ra 5 chặn và thêm một lượt sửa (lượt 16, 64k).
- **Gộp trùng giữa worker:** 3 cặp (`rml1`: đăng nhập OTP, xem buổi sắp tới, chuyển lớp cố định) và 6 cặp (`rml2`). `check` chỉ cảnh báo 1/6 cặp của `rml2`; agent tìm số còn lại bằng `grep` trên bản in `--brief` (2 lượt, ≈ 45–50k mỗi lần).
- **Mâu thuẫn trước cổng:** khối *Trình ở cổng* in 20/43 ghi chú (*"… còn 23: xem map/features.js"*). Cả hai lần `grep "mâu thuẫn" features.js` rồi in dòng gốc để viết lựa chọn cho đúng: `rml1` lượt 16–17 (48k), `rml2` lượt 18–19 (47k). Đường đọc nguyên không cần, vì agent đã đọc tài liệu và ghi chú ít hơn 20.
- Mục 9 của `fixes-map.js`: không đọc `MAP.md`, `check.json`, `ids.json`/`states.json`, `*.example.js`; không tra khuôn DECISIONS; Write `layout.js` và `check` cùng lượt.

### Đọc kết quả

- **Sáu chỗ sửa đều có hiệu lực trên đường đọc nguyên.** Từ 18–19 lượt và 0,62M trừ mất cache xuống **10–11 lượt và 0,42–0,48M**: đạt mục tiêu ≤ 15 lượt và ≤ 0,5M ở cả hai lần, khớp ước "bớt 4–6 lượt, 0,10–0,15M". Chất lượng giữ nguyên: 43/43, 18/18, bắt K16, lần `check` đầu có `layout.js` 0 chặn (1–2 cảnh báo, sửa trong một lượt). Số thô còn dao động vì mất cache của subagent: 0,49M (`rmm4`, 1 lần) đến 0,70M (`rmm3`, 2 lần).
- Đường đọc nguyên gần chạm sàn: 10–11 lượt là vào, M0, đọc tài liệu, viết `features.js`, vào M2, viết `layout.js`, kiểm và soát nhãn, sửa sau soát nhãn, ghi cổng, báo.
- **Đường chia worker chạy đúng cơ chế ngay lần đầu.** `sources.py` chọn chia worker (376 KB > 300 KB), nhận `SX` là `data_codes`, worker đọc đúng dải, agent chính không đọc phụ lục, ≤ 4 worker một lượt, `merge && check` một lệnh, ba mục phụ lục vào `skip`.
- **Đọc theo phần không làm sót.** Cả hai lần 43/43, bẫy 18/18 sau soát tay, như đọc nguyên; không kiểu bẫy nào trượt. Nhưng kiểm kê to và ồn hơn: 84–87 chức năng (đọc nguyên 68–69), **15–20 chức năng suy** (6–8), 3–6 cặp trùng phải gộp tay, 43 ghi chú. Script chấm báo trượt nhiều hơn (41 và 40) vì worker tách nhỏ và đặt tên khác. Người dùng phải duyệt 15–20 chức năng suy ở cổng.
- **Chi phí:** agent chính 0,51–0,52M (bằng số thô của đường đọc nguyên) nhưng 19–21 lượt. Worker 0,75–0,92M. Tổng 1,31–1,47M, khoảng 3 lần `rmm3`/`rmm4`, và 21–22 phút (đọc nguyên 15 phút). Ghi làm mốc, chưa có mục tiêu.
- **Giới hạn của đề:** r8 chỉ thêm 328 KB dữ liệu, phần yêu cầu thật vẫn 48 KB. Một worker vào đã mang khoảng 37k ngữ cảnh nền, phần đọc chung chỉ 13 KB, nên chi phí worker ở đây chủ yếu là phần cố định mỗi worker, không phải phần đọc. Với 1 MB yêu cầu dày đặc, phần đọc sẽ lớn lên.

### Đề xuất bước tiếp (ước từ số đo; chưa sửa skill)

Đường chia worker (mỗi lần `rml`):
1. **Khuôn prompt worker ở `m1-kiem-ke.md` mục 6 ghi sẵn cách đọc** *(cao, chỉ sửa chữ)*: một lượt Read mọi dải bằng offset/limit, cùng lượt Read `m1-kiem-ke.md` với dải dòng cụ thể của mục 3, 4, 5, 7; lượt sau `Write` phần; dòng trả về đếm từ chính danh sách vừa viết, không chạy script. Số đo: có câu Read thì 4 lượt mỗi worker (754k), không có thì 6–11 lượt (916k). Ước: khoảng 3 lượt mỗi worker; bớt **≈ 0,16M** so với `rml2`, **≈ 50k** so với `rml1`.
2. **Agent chính ghi `skip` cho mục chung trước `merge`** *(cao, chỉ sửa chữ)*: cùng lượt gọi đợt worker đầu, `Write` `map/parts/_chung.js` = `window.PART = { features: [], skip: [...] }` cho tóm tắt, mục lục, ma trận actor, bối cảnh, mục tiêu, ngoài phạm vi, bảng dữ liệu. Agent đã có mục lục từ `sources.json`, và `merge` hiện đã gộp `skip` của mọi phần, nhận phần không có module. Số đo: 20–21 chặn, 3–4 lượt, 45–59k. Ước: bớt **2–3 lượt, 40–60k**.
3. **Sửa sau `merge` không qua Edit mù** *(trung bình)*: `m1-kiem-ke.md` mục 6 bước 3 nói rõ "Read `map/features.js` cùng lượt in các mục chặn rồi mới Edit" (khoảng 8k). Số đo: một Edit bị từ chối và hai script tự viết (`rml1`); một script hỏng vì `\` trong heredoc, thêm 5 chặn và một lượt (`rml2`, 64k). Ước: **1–2 lượt, 30–60k**, bỏ rủi ro script hỏng.
4. **Chống trùng giữa worker** *(trung bình)*: prompt worker giao chủ cho từng UC dùng chung (UC-06 phụ huynh xem, UC-08 đổi lịch hay chuyển lớp, đăng nhập OTP), không chỉ tên module; `merge` in các cặp nghi trùng (khác module, chung mã UC/BR trong `src`, tên gần nhau); luật cảnh báo trùng của `check` sót 5/6 cặp của `rml2`. Số đo: 2–3 lượt, 50–110k. Ước: **50–100k**.
5. **Khối *Trình ở cổng* in đủ mâu thuẫn** *(trung bình)*: ghi chú có "mâu thuẫn" in trước và đủ, kèm `src`; chỉ câu hỏi mở mới cắt. Worker ghi mâu thuẫn kèm trích ngắn hai bên. Số đo: 2 lượt, 47–48k mỗi lần. Ước: bớt **2 lượt, ≈ 45k**.
6. **Tổng worker ≤ 4, gộp module nhỏ** *(thấp, đo lại độ phủ trước khi giữ)*: hiện "mỗi module một worker" ra 7 worker, hai đợt khoảng 5 phút mỗi đợt. Phần cố định mỗi worker (khoảng 37k ngữ cảnh nền, lượt đầu, đọc phần chung, m1, lượt trả) khoảng 40–50k. Ước: bớt **0,12–0,15M và khoảng 5 phút**. Phạm vi mỗi worker rộng hơn có thể đổi độ phủ hay số trùng.

Cộng 1–5: agent chính khoảng 13–14 lượt và 0,32–0,37M (bớt phần lớn các lượt 8–10, 12–13, 16–17 của `rml1`; 9–11, 13–14, 16, 18–19 của `rml2`; gộp trùng vẫn cần khoảng một lượt quyết); worker khoảng 0,65–0,7M; tổng khoảng **1,0–1,1M** (nay 1,31–1,47M, −20–30 %). Thêm 6 thì khoảng 0,85–1,0M.

Đường đọc nguyên: đã đạt mục tiêu, không đề xuất sửa. Mất cache (73–219k) chỉ có ở subagent.

### Script

- `fixes-map.js` mục 1 không nhận lệnh `sed`/`awk` trên bản chữ khi lệnh `cd` vào `_src/` rồi gọi tên file trần (`sed -n '28,31p' D1.txt`): cột *lệnh* ra `-` cho agent chính của `rml1`, `rml2`, và worker đọc bằng `awk` của `rml2` không hiện dải. Soát bằng hai script ở scratchpad (so dải với prompt, tìm lệnh chạm `D3.txt`). Chưa sửa script: nên thêm vào `fixes-map.js` phần so dải đọc của worker với dải trong prompt của nó.

### Dữ liệu

- Transcript `transcripts/map-do-lai/` (22 file `.jsonl.gz` kèm `.meta.json`, đã thay tên dự án thật, kiểm `grep` ra 0): `rmm3` `agent-a6b292c25c0ba6684`, người thử `a296af428d96405ff` · `rmm4` `agent-a091675c644e39960`, người thử `a7e7758bee0bb0e94` · `rml1` `agent-aed931de4e5446702`, người thử `a98e514308774a53c`, worker `ae2a77539858b352f` (hoc-vien), `a0c082a7d50254422` (lop), `a373defa3d4eef832` (lich), `a0097ce09378d53c5` (diem-danh), `a057f2115ce950777` (goi-hoc), `af55d6fb0ebe5b31a` (thong-bao), `affae6a70655e665f` (quan-tri) · `rml2` `agent-ac91e6e198a133bdd`, người thử `a5c19c406a7282f7a`, worker `adb789dbcd809dbe2` (hoc-vien), `ae69e1309112aa11b` (lop-hoc), `a8808b2e342893cde` (lich-hoc), `a2fc3889c9f60a1b6` (diem-danh), `a43263c895230e17c` (goi-hoc), `abaf82a3fd66c7d45` (thong-bao), `ab7ff6ea8c8f14f61` (quan-tri).
- Kết quả `runs-map/rmm3/`, `rmm4/`, `rml1/`, `rml2/`: `map/features.js`, `layout.js`, `MAP.md`, `treetest.md`, `DECISIONS.md`; lần `rml` thêm `map/parts/` (7 file) và `map/ids.json`.

### Đo lại lần hai trên r8: `rml3`, `rml4` (bản `e183b41`, 06/10/2026)

Cả hai lần **không đi đường chia worker**. `sources.py` vẫn in "chia worker" (375,7 KB), nhưng agent thấy 327,7 KB là phụ lục dữ liệu D3, nên đọc nguyên 7 tài liệu yêu cầu thật (khoảng 48 KB) bằng `cat -n` trong một lượt, ghi ba mục D3 vào `skip`. Vậy các chỗ sửa của đường worker (`_chung.js`, prompt đọc một lượt, `merge` in cặp trùng…) **chưa được đo**.

| | `rml1` | `rml2` | `rml3` | `rml4` |
|---|---|---|---|---|
| Đường | worker | worker | đọc nguyên, bỏ D3 | đọc nguyên, bỏ D3 |
| Agent chính: lượt · quy đổi · thời gian | 19 · 0,51M · 21 | 21 · 0,52M · 22 | 14 · 0,49M · 8,3 | 16 · 0,48M · 7,4 |
| Tổng kể cả worker, người thử | 1,31M | 1,47M | **0,53M** | **0,52M** |
| Kiểm kê (suy) | 84 (15) | 87 (20) | 65 (2) | 67 (2) |
| Độ phủ sau soát tay | 43/43 · 18/18 | 43/43 · 18/18 | 43/43 · 18/18 | 43/43 · 18/18 |
| `check` cuối | 0 chặn | 0 chặn | 0 chặn, 3 cảnh báo | 0 chặn |

Soát tay: `rml3` báo trượt K07, K13, K17, K19, K27 và trùng K26; cả năm có (F-"Xem lớp và chỗ còn trống", đổi buổi + chuyển lớp, "Huỷ các buổi khi bể có sự cố", F-48, nhóm mời gia hạn). `rml4` chỉ K27. Cả hai bắt K16.

**Đọc kết quả:** bỏ phụ lục rồi đọc nguyên cho cùng độ phủ với **một phần ba chi phí** (0,52–0,53M so với 1,31–1,47M), kiểm kê gọn hơn (2 chức năng suy thay vì 15–20, không cặp trùng phải gộp tay), 7–8 phút thay vì 21–22. Hợp lý hơn đường worker khi phần thật dưới 300 KB.

**Đề xuất (chưa sửa):** `sources.py` tính ngưỡng 300 KB trên phần **không phải phụ lục dữ liệu** (tài liệu hay mục tự ghi là dữ liệu, bảng gần như toàn mã `data_codes`), và in "đọc nguyên (không tính phụ lục D3, 327,7 KB)". Ước: bỏ 0,8–0,95M mỗi lần cho kiểu tài liệu này. Đường worker vẫn cần đo trên đề có phần yêu cầu thật trên 300 KB (ví dụ nhân đôi `r7-map` bằng tài liệu khác), nếu muốn kiểm các chỗ sửa vừa làm.

Dữ liệu: `transcripts/map-do-lai-2/` (8 file), `runs-map/rml3/`, `runs-map/rml4/`. `rml3` agent `a3dda6951d60283fd`, `rml4` agent `a8e1a0a1e7c523f4d`.

### Đo lần ba trên r8: `rml5`, `rml6` (bản `c646c87`, 06/10/2026)

Bản `c646c87` làm đề xuất của lần trước: `sources.py` không tính phụ lục dữ liệu vào ngưỡng 300 KB. Trên r8 nó in *"đọc nguyên (48,0 KB ≤ 300,0 KB, không tính phụ lục dữ liệu D3 327,7 KB: không Read, không cần skip)"*, nên lời khuyên của script và việc agent làm khớp nhau. Hai lần chạy máy Windows, Opus 5.5, song song, một đợt (không có worker nên không cần chia đợt). Prompt như `rmm3`. Phiên da5fd00e.

| | `rml3` | `rml4` | `rml5` | `rml6` |
|---|---|---|---|---|
| Bản skill | `e183b41` | `e183b41` | `c646c87` | `c646c87` |
| Đường | tự bỏ D3 | tự bỏ D3 | script bảo bỏ D3 | script bảo bỏ D3 |
| Agent chính: lượt · quy đổi · thời gian | 14 · 0,49M · 8,3 | 16 · 0,48M · 7,4 | **11 · 0,36M · 5,1** | 15 · 0,51M · 8,0 |
| Tổng kể cả người thử nhãn | 0,53M | 0,52M | **0,40M** | 0,56M |
| Kiểm kê (suy) | 65 (2) | 67 (2) | 62 (3) | 70 (2) |
| Độ phủ sau soát tay | 43/43 · 18/18 | 43/43 · 18/18 | 43/43 · 18/18 | 43/43 · 18/18 |
| `check` cuối | 0 chặn, 3 cảnh báo | 0 chặn | 0 chặn, 0 cảnh báo | 0 chặn, 1 cảnh báo |
| Mất cache | không | không | không | không |

Soát tay: `rml5` script chấm 43/43 ngay, K26 trùng (hai chức năng bảo lưu), một "dựng thừa" N3 (F-24 *Lưu tạm điểm danh khi mất mạng*, đúng bẫy kỹ thuật vi mô; chức năng có, đáp án bảo ghi chú). `rml6` báo trượt K07, K13: K13 tách thành F-18 *Đổi một buổi sang lớp khác* + F-19 *Chuyển học viên sang lớp cố định khác* (tách hợp lệ, như các lần trước); K07 *Danh sách lớp, sĩ số và chỗ trống* không có chức năng riêng, chỗ trống nằm trong spec của F-11, sĩ số tối đa trong F-09: tính là gộp, nhưng đây là mục yếu nhất (không có việc "xem danh sách lớp"). Cả hai bắt K16 (học bù). Không dựng N1, N2, N4; K41–K43 hoãn.

**Đã hết lệch:** cả hai không đọc D3 (7 tài liệu thật 48 KB, `D3` bị bỏ khỏi vòng `cat`), `ids.json` có `data_codes: {SX: 750}` và không có `SX` trong `systems`, hai lần không có worker. Bản trước chỉ đúng nhờ agent tự thấy D3 là phụ lục; bản này script nói đúng.

**Soát từng việc (`fixes-map.js`):**
- `rml5`: Write và check cùng lượt (features lượt 6, layout lượt 8); không đọc `MAP.md`, `check.json`, `sources.json`; 1 ảnh mở trước cổng; không tự viết script dò. M0 ở lượt 2, cùng lượt với `cat m1-kiem-ke.md` bằng Bash (script đo ghi "KHÔNG" vì chỉ nhận `Read`; thực tế cùng lượt). Đọc `*.example.js` 1 lần (lượt 3).
- `rml6`: đi lệch hơn. Lượt 7 viết `features.js` bằng heredoc, lượt 8 `ls`, lượt 9 `Write` lại (hai lượt thừa, khoảng 110k); đọc `sources.json` hai lần và chạy hai `python -c` dò (lượt 5, 6); mở `m2-bo-cuc.md` ở lượt 3; chạy `check` lần đầu cho 8 chặn, rồi 1, rồi 0. Chặn đều do bố cục, không do kiểm kê.

**Đọc kết quả:** bỏ phụ lục bằng chính lời của script cho 0,40–0,56M (so 1,31–1,47M ở đường worker, `rmm3`/`rmm4` 0,42–0,48M). Chênh giữa hai lần chủ yếu do `rml6` ghi `features.js` hai lần và dò thêm bằng script; `rml5` đi sạch. Độ phủ không đổi và kiểm kê gọn (62–70 chức năng, 2–3 suy). Đây là một lần đo mỗi kiểu, dao động 15–25 % giữa các lần chạy là bình thường.

**Đề xuất (chưa sửa):**
1. SKILL.md hay `m1-kiem-ke.md` ghi một câu: "ghi `features.js` bằng `Write`, không bằng heredoc" (`rml6` hai lượt, khoảng 110k, một lần trên hai; độ chắc trung bình).
2. `sources.py` in luôn nội dung `states.json` (một dòng mỗi enum) và nói "không cần đọc `sources.json`": `rml6` đọc hai lần, `rml5` đọc `states.json` bằng `cat` 2 lượt (khoảng 30–40k; độ chắc thấp).
3. Đường worker vẫn chưa đo, và sau `c646c87` r8 không còn dùng tới nó. Muốn đo phải soạn đề có phần yêu cầu **thật** trên 300 KB (ví dụ nhân đôi `r7-map` bằng tài liệu khác), hoặc chấp nhận chưa đo vì kiểu tài liệu đó hiếm.
4. `fixes-map.js` mục 9 nhận cả `cat` bằng Bash cho `m1-kiem-ke.md` (script gap, không phải skill).

Dữ liệu: `transcripts/map-do-lai-3/` (4 file, hai lần chạy và hai người thử nhãn Explore), `runs-map/rml5/`, `runs-map/rml6/`. `rml5` agent `abd1f58f831cfd03c`, `rml6` agent `ac0c0d19f4bfa41db`.

## sketch-to-map: đề r9-map-lon2, phần yêu cầu thật trên 300 KB (soạn 06/10/2026)

Sau `c646c87`, r8 không còn vào đường chia worker (phụ lục dữ liệu không tính vào ngưỡng). Đề này đưa **phần yêu cầu thật** lên 424 KB để đường worker chạy thật, vẫn chấm bằng `r7-map/key.json`.

- `mk-r9.py` chép `r8-map-lon/sample/` (chạy `mk-r8.py` trước nếu chưa có) sang `r9-map-lon2/sample/`, rồi thêm hai tài liệu yêu cầu: `TIEU-CHI-NGHIEM-THU-SONG-XANH.md` (197 KB, 22 chức năng đầu) và `KICH-BAN-KIEM-THU-SONG-XANH.md` (189 KB, 21 chức năng sau). Mỗi chức năng một mục, 36 kịch bản (tình huống, kết quả phải thấy) từ 24 khuôn × vai, trường, ngày, số. Tổng 10 tài liệu 761 KB; không tính phụ lục dữ liệu D4: 424 KB. Seed cố định, md5 `TIEU-CHI` `2e9ef63cf0fbaf284c0a515ceb22a325`, `KICH-BAN` `a0ca096137c7838c1a346af04d287532`.
- Hai tài liệu mới **không thêm chức năng và không nhắc N1–N4** (kiểm bằng grep: 0 lần mất mạng, offline, đồng bộ, thanh toán online, bấm hai lần, tự đổi lịch). Mã `UC-`, `BR-`, `YC-`, `XD-` chỉ trỏ về tài liệu gốc, không có tiền tố mới nên `sources.py` không coi chúng là phụ lục dữ liệu. `mapscore.js --selfcheck` in `Không có chỗ cần sửa.`
- `sources.py` in "chia worker theo module (761,5 KB > 300,0 KB)", D4 là phụ lục dữ liệu bị bỏ.
- **Giới hạn:** văn bản sinh từ khuôn nên lặp cấu trúc. Đề kiểm cơ chế chia worker và chi phí đọc 424 KB yêu cầu; nó không kiểm khả năng tìm bẫy mới trong văn bản dày (mọi bẫy vẫn nằm ở 7 tài liệu gốc, tổng 48 KB). Worker có thể báo nhiều chức năng "suy" hơn vì kịch bản nói chi tiết hơn chức năng: soát kỹ phần *Ngoài đáp án*.
- Điểm lạ ở `sources.py`: dòng "chia worker" in tổng 761,5 KB chứ không phải 424 KB của phần thật; đã ghi vào prompt đo để soát, chưa sửa.

Prompt đo: `prompt-map-r9.md`.
