Đo lại ba skill sửa prototype đã bàn giao (`tweak-site`, `evolve-site`, `handover-check`) ở bản mới nhất, sau 6 chỗ sửa và luật B5 của commit `54b403a`, để xem từng chỗ sửa có ăn không. Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Bản đo: HEAD của nhánh `measure-kit/run-4.5` (merge `417fe2a`, gồm `54b403a`). Mốc so sánh: các lần "mới" của lần đo bản cũ/mới ngày 05/10 (`rtm1`, `rtm2`, `rem1`, `rem2`, `rhm1`, `rhm2`), cùng máy, cùng prompt chạy. Số và cách đọc ở mục "Ba skill sửa: bản cũ và bản mới" của README.
- Mỗi kịch bản chạy **1 lần**. Một lần thì tổng token chỉ để tham khảo: chênh dưới khoảng 20 % chưa nói được gì. Kết quả chính là phần soát từng việc.
- Phiên này chỉ chạy đo, đếm và đề xuất. Không sửa skill khi tôi chưa đồng ý. Không commit.
- Đọc trước `W:/Dummy/[Tool] Working/tapora-proto-kit/measure-kit/README.md`: bảng script, mục "Lưu ý khi chạy", mục "Ba skill sửa: bản cũ và bản mới" và mục "Ba skill sửa: sau 6 chỗ sửa".
- `<SP>` dưới đây là thư mục scratchpad của phiên này, viết tuyệt đối dạng `C:/Users/…/scratchpad` (không có dấu cách, không viết `/c/…`).

1. Kiểm trạng thái:
   - Nhánh hiện tại là `measure-kit/run-4.5`; `git log --oneline -3` có `417fe2a` hay một commit sau nó; `git log --oneline -5` có `54b403a`. `git status` chỉ có thay đổi trong `measure-kit/`. Khác thì hỏi tôi trước khi làm tiếp.
   - `node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/` qua hết (343 test).
   - `measure-kit/r4b-bangiao`, `r5b-sau-tweak`, `r6b-sau-evolve` có đủ, kể cả `sample/_qa/current/` của `r5b` và `r6b`.

2. Dựng bản skill cố định, không tính vào số đo:
   ```bash
   git worktree add "<SP>/moi/tapora-proto-kit" HEAD
   ```
   Kiểm: `<SP>/moi/tapora-proto-kit/skills/sketch-to-site/templates/qa-kit/breaktest.py` có. `<SK>` = `<SP>/moi/tapora-proto-kit/skills`. Giữ đúng tên `moi` và đoạn `tapora-proto-kit/skills`: `paths.js`, `phase-edit.js`, `fixes-edit.js` nhận bản qua đó, và lần đo trước cũng chạy bản mới ở đường dẫn này.

3. Dựng thư mục một lần chạy `<DIR>` từ thư mục bắt đầu `<R>`. Tên `<DIR>`: `rts1` (tweak), `res1` (evolve), `rhs1` (handover).
   ```bash
   R="W:/Dummy/[Tool] Working/tapora-proto-kit/measure-kit/<R>"; DIR="<SP>/<tên>"; mkdir -p "$DIR/docs/prototypes" && cp -r "$R/sample" "$DIR/docs/prototypes/sample" && cp "$R/AGENTS.md" "$DIR/AGENTS.md"
   ```
   - `rts1` từ `r4b-bangiao`, rồi dựng lại mốc cuốn chiếu từ mốc bàn giao: `rm -rf "${DIR:?}/docs/prototypes/sample/_qa/current" && cp -r "$DIR/docs/prototypes/sample/_qa/last-green" "$DIR/docs/prototypes/sample/_qa/current"`.
   - `res1` từ `r5b-sau-tweak`, `rhs1` từ `r6b-sau-evolve`.
   - Kiểm cả ba: `cd "$DIR/docs/prototypes/sample" && python _qa/quick.py --dry` in `File đổi từ lần kiểm trước: không`; rồi xoá `_qa/__pycache__` vừa sinh.
   - Ba thư mục bắt đầu không phụ thuộc nhau, nên ba lần chạy khởi động **cùng lúc** trong một tin nhắn. Mỗi lần là một subagent `general-purpose` chạy nền, model mặc định. Đừng đoán kết quả khi subagent chưa báo xong.

4. Prompt chạy, giữ nguyên văn như lần đo trước. Phần đầu chung, thay `<SK>`, `<DIR>` và `<skill>`:

   ```text
   Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
   Chạy skill <skill>: đọc và làm theo `<SK>/<skill>/SKILL.md`. `<skills>` = `<SK>`. Không gọi skill qua công cụ Skill.
   Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang, đã bàn giao. Thư mục dự án (tuyệt đối): `<DIR>`, có `AGENTS.md`. Thư mục prototype: `<DIR>/docs/prototypes/sample`.
   Chỉ ghi file trong `<DIR>`. Không sửa `<SK>` hay repo tapora-proto-kit. Bạn không hỏi được người dùng.
   ```

   `rts1`, `tweak-site`, thêm sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456."
   Làm xong thì báo cáo như skill yêu cầu.
   Câu trả lời cuối: (1) báo cáo của skill; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

   `res1`, `evolve-site`, thêm sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."
   Làm theo skill tới Cổng 3 rồi dừng: viết câu hỏi Cổng 3 ra trong câu trả lời cuối. Cổng nào skill vẫn phải hỏi thì viết câu hỏi đó ra và dừng ở đó.
   Câu trả lời cuối: (1) câu hỏi ở cổng đã dừng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

   `rhs1`, `handover-check`, thêm sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Kiểm tổng trước khi gửi link cho khách."
   Làm theo skill tới cổng nghiệm thu bàn giao rồi dừng: viết câu hỏi ra trong câu trả lời cuối. Không promote.
   Câu trả lời cuối: (1) câu hỏi ở cổng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

   `res1` dừng trước Cổng 3 *(skill vẫn hỏi Cổng 1 hay Cổng 2)*: ghi lại, không chạy tiếp, và báo tôi, vì số của nó không so được với mốc.

5. Khi đủ 3 lần, chạy script **trước khi gỡ worktree** (`fixes-edit.js` đọc cỡ tài liệu từ worktree). Transcript ở `C:/Users/thapnv/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/<mã phiên này>/subagents/`.
   - `parts2.js`, `phase-edit.js --list` (cả ba lần: soát cách chia bước trước khi lấy số; chia sai thì sửa script rồi mới lấy số), `fixes-edit.js` (dòng 11 là phần soát sáu chỗ sửa), `turns.js`, `times.js`; `groupcost.js` cho các nhóm lượt đáng chú ý.
   - Bảng mỗi kịch bản: lần này so với hai lần "mới" của mốc (lượt, quy đổi thô và đã trừ lượt mất cache, thời gian, chi phí theo bước). Ghi `lượt 1 đọc cache` của từng lần: ba lần khởi động cùng lúc có thể cùng không đọc được cache ở lượt 1 (khoảng 26k mỗi lần); mốc `rtm1` cũng vậy, `rtm2`, `rem*`, `rhm*` thì không. Mất cache do máy chủ xoá (đọc cache tụt khi lượt trước dưới 5 phút) tính riêng như ở mốc.
   - Soát từng việc, mỗi việc ghi có hay không và ở lượt nào:
     - **tweak** `rts1`:
       - lượt tìm có `qa_init --update`, `quick.py --dry`, lệnh tạo `FEATURE-DECISIONS.md` bằng `sed '/^## Tính năng/,$d'`, và `grep -rn` chỉ trong thư mục trang;
       - không tra khuôn ở `evolve-site`, không `grep` lại;
       - đọc một lượt; sửa một lượt; kiểm bằng `quick.py --note … --shots`;
       - mở **một** ảnh, đúng lát có nhãn của khối giờ mở, cùng lượt ghi nhật ký; dòng nhật ký thay dòng mẫu `<dd/mm/yyyy>`;
       - không tự chụp, không đọc mã script.
     - **evolve** `res1`:
       - các việc của lần đo trước (lượt vào 1 và 2, ảnh mốc `run_all.py _qa/truoc`, đỏ rồi xanh với `_qa/.tdd`, B4 bằng `quick.py --shots` cùng lượt `sed` in `regression-qa.md`, không đọc mã);
       - bẻ thử bằng `breaktest.py` khi có bước phủ định, không có `.bak` tự viết;
       - sau vòng sửa chỉ mở ảnh trong dòng `đổi so với lần chụp trước` (`fixes-edit.js`: "ảnh sau mỗi lần --shots");
       - ảnh `_system` chọn theo nhãn: mục Hộp giữ bánh ở 390 có ảnh và được mở đúng lát;
       - không có `UnicodeEncodeError`.
     - **handover** `rhs1`:
       - B1 một lượt với `handover.py ledger`; không mở `qa.config.json` (dòng `Ảnh Hub` có sẵn), không đọc `ledger.jsonl`;
       - B3 bằng `qa-check.py`; không đọc `handover.json` (nợ cũ, bộ mới, bộ mất có trong kết quả);
       - B5 chấm phần của lần tweak (khối giờ mở), bỏ phần của đợt evolve Cấp 2, không chấm `_system.html`; bảng UX in bằng `sed`; mở đúng lát theo nhãn;
       - bảng của `QA.md` có cột nợ cũ lấy từ dòng theme;
       - không đọc mã script.
   - Chỉ ra 3–5 chỗ tốn nhất còn lại, mỗi chỗ kèm lượt cụ thể. Đọc mục "bước tốn lượt hoặc vấp" trong báo cáo của từng agent.
   - Soát chất lượng, chỉ mở ảnh, không dựng lại:
     - nút gọi ở 390 (ảnh của `quick.py --shots`);
     - hộp giữ bánh mở ở 390 và 1440 (ảnh bước của bộ tính năng);
     - lát `_system` 390 có mục Hộp giữ bánh;
     - báo cáo handover có gán đủ khác biệt cho các lần sửa không.

     So với mốc: chất lượng có giảm không.

6. Lưu và ghi:
   - Transcript nén gzip cùng `.meta.json` vào `measure-kit/transcripts/edit-sau-sua/`; `FEATURE-DECISIONS.md` (hay `QA.md` với `rhs1`) và ảnh chính của từng lần vào `measure-kit/runs-edit-sau-sua/<tên>/`.
   - Thêm kết quả vào mục "Ba skill sửa: sau 6 chỗ sửa" của `measure-kit/README.md`: bảng số so với mốc, soát từng việc, chất lượng, chỗ tốn còn lại, mã transcript.
   - Ghi chú tiếng Anh vào `measure-kit/memory-note.md` và cập nhật memory `token-rollout-plan`.
   - Gỡ worktree: `git worktree remove "<SP>/moi/tapora-proto-kit"`.
   - Rồi đề xuất bước tiếp, xếp theo token tiết kiệm ước từ số đo, kèm độ chắc chắn, và hỏi tôi muốn làm gì.
