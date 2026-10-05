Đo chi phí token của ba skill sửa prototype đã bàn giao (`tweak-site`, `evolve-site`, `handover-check`), bản cũ so với bản mới, để xem đợt chuyển cách giảm token của `sketch-to-concept` và `sketch-to-site` tiết kiệm được gì. Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Bản cũ: commit `2fbc10d` (evolve-site 1.8, tweak-site 1.2, handover-check 1.2). Bản mới: commit `70bd133` (evolve-site 1.9, tweak-site 1.3, handover-check 1.3; `quick.py --shots`, `run_all.py` in tên ảnh, `handover.py ledger`). Ba skill này chưa có mốc nền, nên lần đo này chạy cả hai bản trên cùng việc.
- Phiên này chỉ chạy đo, đếm và đề xuất. Không sửa skill khi tôi chưa đồng ý. Không commit.
- Đọc trước `W:/Dummy/[Tool] Working/tapora-proto-kit/measure-kit/README.md`: bảng script, mục "Lưu ý khi chạy" (cache 5 phút của subagent, kết quả lỗi bị cắt giữa, đường dẫn `W:/`), và mục "Ba skill sửa: bản cũ và bản mới".
- `<SP>` dưới đây là thư mục scratchpad của phiên này, viết tuyệt đối dạng `C:/Users/…/scratchpad` (không có dấu cách, không viết `/c/…`).

1. Kiểm trạng thái:
   - `git log --oneline -3` có `70bd133`; `git status` chỉ có thay đổi trong `measure-kit/`. Khác thì hỏi tôi trước khi làm tiếp.
   - `node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/` qua hết (335 test).

2. Dựng hai bản skill cố định, không tính vào số đo:
   ```bash
   git worktree add "<SP>/cu/tapora-proto-kit" 2fbc10d
   git worktree add "<SP>/moi/tapora-proto-kit" 70bd133
   ```
   Kiểm: `<SP>/cu/tapora-proto-kit/skills/evolve-site/SKILL.md` có dòng `> **v1.8 (`, bản `moi` có `> **v1.9 (`. Thư mục skills của hai bản gọi là `<SK>`: `<SP>/cu/tapora-proto-kit/skills` và `<SP>/moi/tapora-proto-kit/skills`. Tên `cu`, `moi` và đoạn `tapora-proto-kit/skills` phải giữ đúng: `paths.js`, `phase-edit.js`, `fixes-edit.js` nhận bản qua đó.

3. Cách dựng thư mục một lần chạy `<DIR>` từ một thư mục bắt đầu `<R>` (`r4-bangiao`, `r5-sau-tweak` hay `r6-sau-evolve` trong `measure-kit/`). Tên `<DIR>` bắt đầu bằng `r` và chỉ có chữ, số: `rtc1` là sửa nhỏ, bản cũ, lần 1; `rtm1` là bản mới; tương tự `re…` cho evolve, `rh…` cho handover.
   ```bash
   R="W:/Dummy/[Tool] Working/tapora-proto-kit/measure-kit/<R>"; DIR="<SP>/<tên>"; mkdir -p "$DIR/docs/prototypes" && cp -r "$R/sample" "$DIR/docs/prototypes/sample" && cp "$R/AGENTS.md" "$DIR/AGENTS.md"
   ```
   Chỉ với `r4-bangiao`: dựng lại mốc cuốn chiếu từ mốc bàn giao, vì git bỏ qua `_qa/current/` theo `_qa/.gitignore` của bộ kiểm: `rm -rf "${DIR:?}/docs/prototypes/sample/_qa/current" && cp -r "$DIR/docs/prototypes/sample/_qa/last-green" "$DIR/docs/prototypes/sample/_qa/current"`. Kiểm: `cd "$DIR/docs/prototypes/sample" && python _qa/quick.py --dry` in `File đổi từ lần kiểm trước: không`.

   Mỗi kịch bản chạy 4 lần: cũ 1 và mới 1 song song, xong rồi cũ 2 và mới 2 song song, để mỗi cặp chạy trong cùng điều kiện máy. Mỗi lần là một subagent `general-purpose` chạy nền, model mặc định. Đừng đoán kết quả khi subagent chưa báo xong. Phần đầu chung của mọi prompt chạy, thay `<SK>`, `<DIR>` và `<skill>`:

   ```text
   Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
   Chạy skill <skill>: đọc và làm theo `<SK>/<skill>/SKILL.md`. `<skills>` = `<SK>`. Không gọi skill qua công cụ Skill.
   Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang, đã bàn giao. Thư mục dự án (tuyệt đối): `<DIR>`, có `AGENTS.md`. Thư mục prototype: `<DIR>/docs/prototypes/sample`.
   Chỉ ghi file trong `<DIR>`. Không sửa `<SK>` hay repo tapora-proto-kit. Bạn không hỏi được người dùng.
   ```

4. Kịch bản T, `tweak-site`, từ `r4-bangiao`. Thêm vào sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456."
   Làm xong thì báo cáo như skill yêu cầu.
   Câu trả lời cuối: (1) báo cáo của skill; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

5. Dựng thư mục cố định `measure-kit/r5-sau-tweak` từ lần `rtm1`: lần đó phải có lệnh kiểm nhanh `ĐẠT` và dòng nhật ký trong `FEATURE-DECISIONS.md`. Không đạt thì lấy `rtm2`, rồi `rtc1`; ghi lần đã chọn và lý do vào README.
   - Chép `<DIR>/docs/prototypes/sample` sang `r5-sau-tweak/sample` và `<DIR>/AGENTS.md` sang `r5-sau-tweak/AGENTS.md`. Bỏ `_qa/__pycache__`, `_qa/.kit-source`, `_qa/.quick-run`, `_qa/.tdd`. Giữ `_qa/current/` (có `ledger.jsonl`).
   - Kiểm: `python _qa/quick.py --dry` trong bản chép in `File đổi từ lần kiểm trước: không`.

6. Kịch bản E, `evolve-site`, từ `r5-sau-tweak`. Thêm vào sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Thêm hộp giữ bánh. Bấm nút Giữ bánh qua Zalo ở màn đầu, hay nút giữ bánh trong khung của từng mẻ, thì mở hộp giữ bánh thay vì mở Zalo ngay. Trong hộp: chọn mẻ (mẻ đã hết thì không chọn được; bấm từ khung một mẻ thì chọn sẵn mẻ đó), chọn bánh và số lượng trong bốn loại bánh, nhập tên. Tên và ít nhất một bánh là bắt buộc. Nút chính Chép tin nhắn và mở Zalo: chép tin nhắn soạn từ các lựa chọn rồi mở Zalo 0909 123 456. Chỉ định cho các cổng: lối vào là chính các nút giữ bánh đang có, không cần phím tắt hay lối vào nhanh, khách nào cũng thấy; trên điện thoại là sheet trượt từ đáy, trên máy tính là hộp thoại giữa màn; được thêm component mới (sheet, hộp thoại, ô chọn số lượng) bằng token sẵn có, không thêm màu hay font."
   Làm theo skill tới Cổng 3 rồi dừng: viết câu hỏi Cổng 3 ra trong câu trả lời cuối. Cổng nào skill vẫn phải hỏi thì viết câu hỏi đó ra và dừng ở đó.
   Câu trả lời cuối: (1) câu hỏi ở cổng đã dừng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

   Lần nào dừng trước Cổng 3 *(skill vẫn hỏi Cổng 1 hay Cổng 2)*: ghi lại, không chạy tiếp lần đó, và báo tôi trước khi sang bước 7, vì số của nó không so được với các lần tới Cổng 3.

7. Dựng `measure-kit/r6-sau-evolve` từ lần `rem1`: lần đó phải tới Cổng 3, có lệnh kiểm nhanh `ĐẠT` cuối cùng. Không đạt thì lấy `rem2`, rồi `rec1`. Cách chép như bước 5, rồi ghi vào khối Cổng 3 của tính năng trong `FEATURE-DECISIONS.md` đáp án người dùng nguyên văn: "Chốt tích hợp." Kiểm `quick.py --dry` như bước 5.

8. Kịch bản H, `handover-check`, từ `r6-sau-evolve`. Thêm vào sau phần đầu:

   ```text
   Lời người dùng (nguyên văn): "Kiểm tổng trước khi gửi link cho khách."
   Làm theo skill tới cổng nghiệm thu bàn giao rồi dừng: viết câu hỏi ra trong câu trả lời cuối. Không promote.
   Câu trả lời cuối: (1) câu hỏi ở cổng, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

9. Khi đủ 12 lần, chạy script **trước khi gỡ worktree** (`fixes-edit.js` đọc cỡ tài liệu từ chính worktree của lần chạy). Transcript nằm ở `C:/Users/thapnv/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/<mã phiên này>/subagents/`.
   - `parts2.js`, `phase-edit.js` (thêm `--list` cho lần đầu tiên của mỗi kịch bản, soát cách chia bước trước khi lấy số; chia sai thì sửa script rồi mới lấy số), `fixes-edit.js`, `turns.js`, `times.js`. `groupcost.js` cho các nhóm lượt đáng chú ý.
   - Mỗi kịch bản một bảng: cũ và mới, mỗi bản hai lần: lượt, token quy đổi thô và đã trừ lượt mất cache, thời gian, chi phí theo bước. Cách đọc: mỗi bên chỉ hai lần, chênh dưới khoảng 15 % chưa nói được gì.
   - Soát từng việc của bản mới, mỗi việc ghi có hay không và ở lượt nào:
     - tweak: lượt tìm có `qa_init --update` và `quick.py --dry` cùng lượt `grep`; đọc một lượt; sửa một lượt; kiểm bằng `quick.py --note … --shots`; mở một ảnh cùng lượt ghi nhật ký; không tự chụp, không đọc mã script.
     - evolve: lượt vào 1 gồm `Read` `b1-b2.md`, file dự án và lệnh 1; ảnh mốc bằng `run_all.py _qa/truoc smoke-index`; lượt vào 2 gồm `Read` `b3-b4.md`, file sẽ sửa và lệnh 2; không đọc mã `run_all.py` ngoài phần đầu lệnh 2 in; thấy đỏ rồi xanh với `run_all.py _qa/.tdd`; B4 bằng `quick.py --shots` cùng lượt với lệnh `sed` in `regression-qa.md`; mở mọi ảnh trong một lượt; không tự chụp.
     - handover: B1 một lượt với `handover.py ledger`; không đọc `ledger.jsonl`; B3 bằng `qa-check.py`; bảng UX in bằng `sed`; không đọc mã script.
   - Chỉ ra 3–5 chỗ tốn nhất của bản mới, mỗi chỗ kèm lượt cụ thể. Đọc mục "bước tốn lượt hoặc vấp" trong báo cáo của từng agent.
   - Soát chất lượng, chỉ mở ảnh, không dựng lại: nút gọi điện ở 390 *(ảnh của `quick.py --shots` hay chụp lại bằng `python _qa/run_all.py _qa/.xem smoke-index-390`)*; hộp giữ bánh mở ở 390 và 1440 *(ảnh bước của bộ tính năng)*; báo cáo handover có gán đủ khác biệt cho hai lần sửa không. So bản cũ và bản mới: chất lượng có giảm không.

10. Lưu và ghi:
    - Transcript nén gzip cùng `.meta.json` vào `measure-kit/transcripts/edit-cu-moi/`; `FEATURE-DECISIONS.md` và ảnh chính của từng lần vào `measure-kit/runs-edit/<tên>/`.
    - Thêm kết quả vào mục "Ba skill sửa: bản cũ và bản mới" của `measure-kit/README.md`: thư mục bắt đầu đã chọn, prompt chạy nguyên văn, bảng số, soát từng việc, chất lượng, mã transcript.
    - Ghi chú tiếng Anh vào `measure-kit/memory-note.md` và cập nhật memory `token-rollout-plan`.
    - Gỡ worktree: `git worktree remove "<SP>/cu/tapora-proto-kit"` và `git worktree remove "<SP>/moi/tapora-proto-kit"`.
    - Nhắc tôi: khi commit `r5-sau-tweak` và `r6-sau-evolve`, `_qa/current/` của chúng bị `_qa/.gitignore` bỏ qua; muốn giữ thì `git add -f`.
    - Rồi đề xuất bước tiếp, xếp theo token tiết kiệm ước từ số đo, kèm độ chắc chắn, và hỏi tôi muốn làm gì.
