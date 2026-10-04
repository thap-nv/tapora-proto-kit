Đo lại skill sketch-to-site sau 7 đề xuất giảm token (bản 4.5), chạy trên Claude Code cloud, so với mốc nền đo trên máy Windows ngày 04/10. Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Bộ đo nằm ở `measure-kit/` trong repo, trên nhánh `measure/site-4.5`. Mốc nền ở `measure-kit/README.md`, mục "sketch-to-site: mốc nền". Mục đó có thư mục bắt đầu, prompt nguyên văn, bảng số, mã transcript và lưu ý về script đo. Memory `token-rollout-plan` không có trên cloud; README là đủ.
  - Pha 1 (B0 → Cổng 3): 59 và 69 lượt, 1,46–1,51M và 1,90–1,97M token quy đổi, không lượt nào mất cache.
  - Pha 2 (B3 → Cổng 4): 59 và 66 lượt, 1,57–1,61M và 2,29–2,35M (1,96–2,02M khi bỏ lượt mất cache). Cộng thêm review `general-purpose` 0,83–0,85M và 0,95–0,96M.
- Bản 4.5 làm 7 việc (`CHANGELOG.md` mục 1.5.0):
  1. Kiểm một lệnh: `scripts/system-check.mjs` cho B2 và ảnh Cổng 3; `scripts/qa-check.py` cho B4. `run.mjs` chụp được cả trang và từng màn, tự thêm cờ cho Node 20. Bộ khói chụp hết trang.
  2. Gộp lượt: lệnh độc lập gọi chung một lượt; mọi ảnh của một lần kiểm mở trong một lượt; `Read` bản chép trước khi sửa.
  3. Sửa khuôn `system.html`: thêm `border-box`, bọc chữ của trang trong `:where()`, cho mẫu chữ xuống dòng ở khổ hẹp.
  4. B1 thử concept trên `_system.html`, không dựng trang thử riêng.
  5. Tách SKILL.md theo giai đoạn: `references/b0-b2.md` và `references/b3-b4.md`. SKILL.md còn 16,6k ký tự (trước 32,9k). Lịch sử phiên bản chuyển sang CHANGELOG, bảng phụ thuộc sang `references/phu-thuoc.md`.
  6. In đúng mục cần đọc của `rules-and-conflicts.md` và `qa-gate.md` bằng `sed`.
  7. Review B4 dùng agent `Explore` và chờ kết quả.
- Ước tính trước khi đo, mỗi lần chạy: việc 1 khoảng 0,25–0,4M ở pha 1 và 0,2–0,35M ở pha 2; việc 2 khoảng 0,08–0,2M mỗi pha; việc 3 khoảng 0,15–0,25M ở pha 1; việc 4 khoảng 0,15–0,23M ở pha 1; việc 5 và 6 cộng lại khoảng 0,1–0,13M mỗi pha; việc 7 khoảng 0,06–0,08M. Việc 1, 3 và 4 cùng nhắm vào vòng B1–B2, nên không cộng thẳng được.
- Môi trường khác mốc nền. Mốc nền chạy trên Windows, với Edge, Node 20 và Git Bash; ở đây là Linux.
  - Tổng token chỉ để tham khảo. Phần đáng tin là soát từng việc ở bước 6.
  - Tổng lệch dưới khoảng 25 % so với mốc thì ghi "chưa kết luận được". Khi đó đề xuất đo lại mốc 4.4 (commit `8c553c0`) trên cloud, nhưng không tự chạy.
  - Không so số phút.
- Quyền:
  - Phiên này chỉ đo và báo. Không sửa skill khi tôi chưa đồng ý.
  - Được commit và push, nhưng chỉ thư mục `measure-kit/`, và chỉ lên nhánh `measure/site-4.5`. Không commit file nào khác, không mở PR, không push nhánh khác.
  - Commit message không ghi Claude là đồng tác giả: không có dòng `Co-Authored-By: Claude …`, không có dòng ghi công nào khác như "Generated with Claude Code". Lời dặn này thay cho hướng dẫn ghi công mặc định. Commit xong thì kiểm bằng `git log -1 --format=%B`; còn dòng ghi công thì `git commit --amend` bỏ đi trước khi push.
  - Máy cloud bị xoá khi phiên kết thúc. Thứ gì chưa push là mất.
- Lưu ý khi chạy: xem mục "Lưu ý khi chạy" của README.
  - Subagent dùng cache 5 phút. Trên cloud chưa kiểm, nên lấy lượt mất cache từ số đo, đừng giả định.
  - Kết quả lỗi dài thì bị cắt mất phần giữa.
  - Lần chạy khởi động đầu tiên trong phiên không có cache ở lượt 1.
  - Biến môi trường không giữ qua các lệnh Bash. Mỗi lệnh chạy script đo phải tự đặt biến trong chính lệnh đó: `SKILLS="$REPO/skills" RUNS=/tmp/measure node measure-kit/<script>.js …`. Hai biến này đổi đường dẫn mặc định của Windows trong `measure-kit/paths.js`.

0. Kiểm môi trường, gộp các lệnh độc lập vào một lượt. Bước nào hỏng mà không sửa được thì dừng, báo tôi, không chạy đo.
   - `REPO=$(git rev-parse --show-toplevel)`. Nhánh phải là `measure/site-4.5`, có commit `d6d7708` (`git merge-base --is-ancestor d6d7708 HEAD`), và `git status` sạch.
   - Model của phiên phải là Opus 5.5 như mốc nền. Khác thì dừng và hỏi.
   - Ghi lại `node -v` và `python3 --version`. Nếu Node từ 22 trở lên thì phần "tự thêm cờ Node 20" của việc 1 không được thử; ghi điều này vào kết luận.
   - Trình duyệt: `run.mjs` nhận `QA_BROWSER`, rồi tìm `google-chrome`, `chromium`, `chromium-browser` trong PATH.
     - Nếu chưa có thì cài Chromium của Playwright: `npx -y playwright install chromium`, thiếu thư viện hệ thống thì thêm `--with-deps`.
     - Tạo symlink tên `chromium` trỏ tới file chạy đó, đặt trong một thư mục của PATH (ví dụ `/usr/local/bin`), để subagent cũng thấy. Đừng dựa vào `export QA_BROWSER`.
     - Ghi lại trình duyệt và phiên bản.
   - Mạng: `curl -sI` tới `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro`, `https://fonts.gstatic.com`, `https://cdn.tailwindcss.com` và `https://unpkg.com`. Có địa chỉ nào bị chặn thì dừng và báo: tôi phải đổi mức mạng của môi trường cloud.
   - `python3 skills/sketch-to-site/scripts/preflight.py --deps` không được thiếu skill mức 🔴.
   - Thư mục chạy là `/tmp/measure`, nằm ngoài repo. Mỗi lần chạy là `<DIR>` = `/tmp/measure/r<tên>`; tên bắt đầu bằng `r` để script đo rút gọn được.

1. Test: `node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/` phải qua hết 316 test.
   - Test có trình duyệt đôi khi hỏng khi chạy cả bộ vì máy tải nặng. Gặp thì chạy riêng test đó; chạy riêng mà qua thì ghi lại, không coi là lỗi.
   - Nhiều test có trình duyệt cùng hỏng là lỗi môi trường: quay lại bước 0.

2. Pha 1, từ B0 đến Cổng 3: chạy 2 lần song song.
   - Mỗi lần là một subagent `general-purpose` chạy nền, model mặc định.
   - Mỗi lần chép `measure-kit/r2-chosen/sample` vào `<DIR>/docs/prototypes/sample`. Không chạy thẳng trên bản trong repo.
   - Prompt: chép nguyên văn từ README mục "sketch-to-site: mốc nền", phần Prompt, Pha 1. Chỉ thay hai thứ: `<DIR>`, và `W:/Dummy/[Tool] Working/tapora-proto-kit` thành đường dẫn tuyệt đối của `$REPO`. Ghi lại prompt đã gửi.
   - Đừng đoán kết quả khi subagent chưa báo xong.

3. Lấy transcript thật đầu tiên của bước 2 để thử hai script đo.
   - Transcript của subagent nằm ở `~/.claude/projects/<thư mục phiên>/<mã phiên>/subagents/agent-<id>.jsonl`, kèm `.meta.json`. Tìm bằng `ls -t ~/.claude/projects/*/*/subagents/*.jsonl | head`. Không thấy thì dùng `find / -name 'agent-*.jsonl' -path '*subagents*' 2>/dev/null`.
   - Chạy `phase-site.js <transcript> --list` và `fixes-site.js <transcript>`, có đặt `SKILLS` và `RUNS`. Soát cách chia bước với lệnh thật trong transcript. `<DIR>` và `<skills>` phải hiện ra trong danh sách lượt; không hiện là biến môi trường đặt sai.
   - Script đã thêm dấu hiệu cho 4.5:
     - `system-check.mjs` tính là B2;
     - mở ảnh `_shots/system/…-full.png` tính là Cổng 3;
     - `qa-check.py` tính là B4;
     - dấu hiệu B1 chỉ tắt khi có lần sửa đầu vào `site/`, không tắt vì `cp`.
   - Sai thì sửa script trước, rồi mới lấy số.
   - Bốn transcript mốc nền không có trên cloud. Nếu đã sửa script thì ghi rõ từng chỗ sửa vào README, để tôi chạy lại số mốc ở máy.

4. Pha 2, từ B3 đến Cổng 4: chạy 2 lần song song, cách làm như bước 2.
   - Chép từ `measure-kit/r3-gate3/sample`. Giữ nguyên thư mục do bản 4.4 làm ra, để B3–B4 so được trên cùng đầu vào. Thư mục này có sẵn `_qa/cong-3/` và `_system.html` của bản cũ.
   - Prompt: chép nguyên văn từ README, phần Prompt, Pha 2, kể cả câu "Giữ concept, chấp nhận ngoại lệ ở màn đó". Chỉ thay `<DIR>` và đường dẫn repo như ở bước 2.

5. Lưu dữ liệu thô. Làm ngay sau mỗi pha, không chờ cuối phiên.
   - Chép transcript của mỗi lần chạy vào `measure-kit/transcripts/site-4.5/`: file `agent-<id>.jsonl` và `.meta.json` của nó, cùng transcript của subagent review (tìm qua `parentAgentId` trong `.meta.json`).
   - Nén file `.jsonl` bằng `gzip -9`. Giữ nguyên `.meta.json`.
   - Chép ảnh dùng ở bước 7 vào `measure-kit/runs-4.5/<tên lần chạy>/`: `_shots/system/<theme>-1440-full.png` của pha 1, ảnh trang chủ 1440 trong `_qa/handover/` mới nhất của pha 2. Kèm `DECISIONS.md` của mỗi lần.
   - Commit (chỉ `measure-kit/`) rồi push lên `measure/site-4.5`. Có file trên 50 MB thì báo trước khi push.

6. Khi đủ 4 lần:
   - Chạy các script đo, lệnh nào cũng đặt `SKILLS` và `RUNS`:
     - `parts2.js`, kèm subagent review của mỗi lần pha 2;
     - `attrib.js`, `phase-site.js`, `fixes-site.js`, `turns.js`, `times.js`;
     - `groupcost.js` với các nhóm lượt như ở mốc nền: SKILL.md, tài liệu khác, đọc mã skill, vòng tự soát `_system.html`, lượt chỉ mở ảnh, review.
   - Lập một bảng mỗi pha, đặt cạnh mốc nền: lượt, token quy đổi (số thô và số đã trừ lượt mất cache), chi phí từng bước.
   - Mỗi pha chỉ có 2 lần chạy, lại khác môi trường. Chênh dưới khoảng 25 % thì chưa nói được gì.

7. Soát từng việc của 4.5, mỗi việc một dòng, có số và lượt cụ thể trong transcript. Việc nào chưa ăn thì nói vì sao, dẫn lượt. Chỗ nào khác mốc chỉ vì Linux (đường dẫn, trình duyệt, Node) thì ghi riêng, không tính cho hay chống 4.5.
   - Lối vào một lượt:
     - pha 1: lượt 2 có `Read` `b0-b2.md`, `CONCEPT.md`, `DECISIONS.md` và lệnh 1 trong cùng lượt không;
     - pha 2: lượt 2 có `Read` `b3-b4.md`, bốn file dự án và lệnh 2 cùng lượt không;
     - sau đó có đọc lại hay `cat` các file đó không.
   - Tài liệu: `rules-and-conflicts.md` và `qa-gate.md` có còn bị đọc nguyên không. Lấy cột "nguyên" và "một phần" ở dòng 1 của `fixes-site.js`. Ghi số ký tự đưa vào ngữ cảnh, so với mốc.
   - `system-check.mjs`: chạy mấy lần; lần cuối có `Kết luận: SẠCH` trước Cổng 3 không. Đếm số lần agent tự gọi `run.mjs`, số lệnh chụp (`chrome`, `chromium`, Playwright), và số lệnh đọc mã skill. Mốc nền: đọc mã 10–11 lệnh ở pha 1.
   - Khuôn `system.html`: còn vòng sửa nào vì tràn ngang ở 390, vì `.sys p` hay `.sys h2` đè component, hay vì mẫu chữ không.
   - B1: có trang HTML thử nào ngoài `site/` không; hai trường hợp khó có nằm trong `_system.html` và có ghi trong `DECISIONS.md` không.
   - Gộp lượt:
     - số lượt có từ 2 lệnh trên tổng số lượt (mốc: 6/59, 23/69, 13/59, 15/66);
     - số lượt chỉ mở ảnh, và chi phí của chúng;
     - ảnh của một lần kiểm có mở hết trong một lượt không.
   - `qa-check.py`: chạy mấy lần. Agent có tự viết thêm bộ cuộn hay file bước `steps-*.json` ngoài những file `qa_init.py` sinh không. Có lần nào kết quả bị cắt giữa không.
   - Review: loại agent; có `run_in_background` không; ngữ cảnh khởi đầu bao nhiêu; bao nhiêu lượt; chi phí bao nhiêu. Kết quả review có về trước khi bàn giao không. Agent cha có mất cache lúc chờ không: khoản này chỉ có khi chạy dưới dạng subagent, nên ghi riêng.
   - Lượt mất cache: ở lượt nào, tốn thêm bao nhiêu, lượt trước đó nghĩ và viết bao lâu (lấy từ `times.js`).

8. Soát chất lượng. Chỉ mở ảnh, không dựng lại.
   - Pha 1: ảnh `_shots/system/<theme>-1440-full.png` của mỗi lần; xem thêm vài màn trong các ảnh từng màn nếu cần.
   - Pha 2: ảnh trang chủ 1440 của mỗi lần (thư mục `_qa/handover/` mới nhất).
   - Font có tải được không: chữ trong ảnh có đúng font của concept C không, hay rơi về font hệ thống của Linux.
   - Concept C còn thấy được không. Hai trường hợp khó của B1 có trên `_system.html` không.
   - Review của agent `Explore` có tốt bằng review `general-purpose` ở mốc nền không. Mốc nền: kết luận "làm lại", 3–5 mục Nên sửa có bằng chứng ảnh và `file:dòng`. Đọc kết quả review trong transcript của agent cha (`dump.js`, lượt gọi Agent).

9. Đọc mục (4) trong báo cáo của từng agent: chỗ tốn lượt hay vấp, có chỗ nào mới so với mốc nền không.

10. Kết luận và ghi lại:
   - Mỗi việc trong 7 việc: đã ăn, chưa ăn hay phản tác dụng, kèm số đo.
   - Chỗ tốn nhất còn lại: 3–5 chỗ, mỗi chỗ kèm lượt cụ thể.
   - Đề xuất bước tiếp, xếp theo token tiết kiệm ước từ số đo, không đoán. Mỗi việc ghi ước tính và độ chắc chắn, nói rõ việc nào không đáng làm.
   - Ghi vào `measure-kit/README.md` một mục mới "sketch-to-site: sau 4.5 (cloud)". Mục này gồm:
     - môi trường: Node, Python, trình duyệt, model;
     - bảng so với mốc nền;
     - mã transcript và đường dẫn trong `transcripts/site-4.5/`;
     - các điểm ở trên.
   - Viết `measure-kit/memory-note.md`: vài dòng tiếng Anh để tôi chép vào memory `token-rollout-plan` ở máy.
   - Commit (chỉ `measure-kit/`) rồi push lên `measure/site-4.5`.
   - Rồi hỏi tôi muốn làm gì tiếp.
