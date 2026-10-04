Đo mốc nền chi phí token của skill sketch-to-site, trước khi áp các mẫu tiết kiệm đã chứng minh ở sketch-to-concept. Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Pilot sketch-to-concept 1.4 đã xong. Vòng 1 giảm từ 1,07–1,28M xuống 0,52–0,65M token quy đổi (không tính lượt mất cache), vòng 2 từ 0,45–0,51M xuống 0,28–0,39M. Chi tiết ở memory `token-rollout-plan`.
- Phiên này chỉ dựng thư mục bắt đầu, viết script đếm, đo mốc nền và đề xuất. Không sửa skill khi tôi chưa đồng ý. Không commit.
- Đọc trước:
  - `C:/Users/thapnv/.claude/projects/w--Dummy--Tool--Working-tapora-proto-kit/measure-kit/README.md`: các script đo, prompt đo của sketch-to-concept, mục "Lưu ý khi chạy" (cache 5 phút của subagent, kết quả lỗi bị cắt giữa, đường dẫn `W:/`).
  - `skills/sketch-to-site/SKILL.md` §4: B0–B4, Cổng 3 và Cổng 4.

1. Kiểm trạng thái:
   - `git status`: bản 1.4 của sketch-to-concept đã commit chưa. Chưa thì hỏi tôi trước khi làm tiếp.
   - `node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/` qua hết (296 test).

2. Dựng thư mục bắt đầu cố định `measure-kit/r2-chosen/sample`. Phần này không tính vào số đo.
   - Chép `measure-kit/r1-board/sample` sang.
   - Làm phần chốt Cổng 2 của sketch-to-concept (SKILL.md, "Gate 2", đoạn "Once chosen") với lời người dùng: "Chọn C. Một nền như concept. Nhịp như concept." Việc cần làm: ghi `DECISIONS.md`, viết `CONCEPT.md` theo `templates/CONCEPT.md`, khối CSS mục 3 lấy bằng lệnh `cssText` ghi trong SKILL.md.
   - Kiểm: `CONCEPT.md` đủ mục, không còn chỗ trống `<…>`; khối CSS mục 3 khớp kết quả lệnh. Xong thì giữ nguyên, không sửa nữa.

3. Viết hai script đếm trong `measure-kit/`, không đặt trong repo. Dùng lại `parts2.js`, `attrib.js`, `turns.js`, `times.js`, `dump.js`.
   - `phase-site.js`: chia token quy đổi, số lượt và thời gian theo B0, B1, B2, Cổng 3, B3, B4, Cổng 4. Nhận ra bước qua file đọc/ghi và lệnh chạy: `themes.mjs` và `DESIGN.md` là B2, `BUILD-LOG.md` là B3, `handover.py` và `qa_init` là B4…
   - `fixes-site.js` đếm các chỗ có thể sửa:
     - mỗi file tài liệu được đọc nguyên mấy lần và dài bao nhiêu (SKILL.md, từng file `references/`);
     - số lần chạy `preflight.py`, `themes.mjs`, `handover.py run`;
     - số ảnh được mở;
     - lượt có từ 2 lệnh trở lên;
     - `cat` file sẽ sửa;
     - lỗi đường dẫn `/w/…`;
     - kết quả bị cắt giữa (`characters truncated`);
     - subagent review ở B4: loại agent và chi phí;
     - lượt mất cache và phần tốn thêm, như dòng cuối của `fixes.js`.
   - Chạy thử hai script trên transcript thật đầu tiên của bước 4, sửa cho đúng rồi mới lấy số.

4. Pha 1, từ B0 đến Cổng 3: chạy 2 lần song song, mỗi lần một subagent general-purpose chạy nền, model mặc định. Mỗi lần chép `measure-kit/r2-chosen/sample` vào `<DIR>/docs/prototypes/sample`, `<DIR>` là một thư mục trong scratchpad của phiên này. Không chạy thẳng trên bản gốc. Đừng đoán kết quả khi subagent chưa báo xong.

   ```text
   Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
   Chạy skill sketch-to-site: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-site/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
   Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang. Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Concept đã chốt ở Cổng 2: `CONCEPT.md`, `DECISIONS.md`, `concept/`.
   Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
   Làm B0 → B1 → B2 rồi dừng ở Cổng 3: viết câu hỏi Cổng 3 ra trong câu trả lời cuối. Không dựng trang. Bạn không hỏi được người dùng.
   Câu trả lời cuối: (1) câu hỏi Cổng 3, gọn; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

5. Dựng thư mục cố định `measure-kit/r3-gate3/sample`:
   - Chép kết quả của một lần pha 1: lần có `themes.mjs` qua và Cổng 3 gọn hơn. Ghi lý do chọn vào README.
   - Cổng 3 của lần đó có câu 3 (concept gãy) thì thêm câu trả lời "Giữ concept, chấp nhận ngoại lệ ở màn đó" vào lời người dùng của prompt pha 2, và ghi nguyên văn vào README.

6. Pha 2, từ B3 đến Cổng 4: chạy 2 lần song song, cách làm như bước 4, chép từ `r3-gate3`.

   ```text
   Đây là một lần chạy đo đạc. Hãy làm đúng theo skill như một lần chạy thật, không tự rút gọn hay tối ưu.
   Chạy skill sketch-to-site: đọc và làm theo `W:/Dummy/[Tool] Working/tapora-proto-kit/skills/sketch-to-site/SKILL.md`. `<skills>` = `W:/Dummy/[Tool] Working/tapora-proto-kit/skills`. Không gọi skill qua công cụ Skill.
   Dự án: "Lò Bánh Củi Cô Ba", tiệm bánh mì nhỏ ở Đà Lạt, site giới thiệu một trang. Thư mục prototype (tuyệt đối): `<DIR>/docs/prototypes/sample`. Đã xong B0–B2; Cổng 3 đang mở.
   Lời người dùng vừa trả lời ở Cổng 3 (nguyên văn): "Duyệt design system và sơ đồ trang. Phạm vi: 1 trang chủ."
   Chỉ ghi file trong `<DIR>`. Không sửa repo tapora-proto-kit.
   Làm B3 → B4 rồi dừng ở Cổng 4: viết câu hỏi Cổng 4 ra trong câu trả lời cuối. Bạn không hỏi được người dùng.
   Câu trả lời cuối: (1) câu hỏi Cổng 4, kèm số thật; (2) file đã tạo hoặc đã sửa; (3) có dùng subagent không, vì sao; (4) bước tốn lượt hoặc vấp, mỗi bước một dòng.
   ```

7. Khi đủ 4 lần:
   - Chạy `parts2.js` (kèm subagent review của mỗi lần pha 2, tìm qua `parentAgentId` trong `.meta.json`), `attrib.js`, `phase-site.js`, `fixes-site.js`, `turns.js`, `times.js`.
   - Lập một bảng mỗi pha: lượt, token quy đổi (số thô và số đã trừ lượt mất cache), thời gian, chi phí từng bước.
   - Chỉ ra 3–5 chỗ tốn nhất, mỗi chỗ kèm lượt cụ thể trong transcript.
   - Đọc mục (4) trong báo cáo của từng agent.
   - Soát chất lượng: mở ảnh `_system.html` 1440 của mỗi lần pha 1 và ảnh trang chủ 1440 của mỗi lần pha 2. Concept C còn thấy được không. Chỉ mở ảnh, không dựng lại.

8. Đề xuất cách áp các mẫu của sketch-to-concept. Xếp theo token tiết kiệm, ước tính từ số đo của bước 7, không đoán. Mỗi việc ghi ước tính và độ chắc chắn. Nói rõ việc nào không đáng làm. Các mẫu cần xét:
   - tài liệu cho agent bằng tiếng Anh: SKILL.md 40k ký tự, `references/` khoảng 80k;
   - tách SKILL.md theo giai đoạn (B0–B2 kèm Cổng 3; B3–B4 kèm Cổng 4), như `vong-dau.md` và `vong-moi.md`;
   - lệnh `sed` in đúng mục cần đọc của `qa-gate.md` và `rules-and-conflicts.md`, thay cho đọc cả file;
   - lệnh độc lập gộp một lượt: một lệnh `cp` cho mọi khuôn, Read khuôn sẽ điền ngay trong lượt đó;
   - script kiểm một lệnh: B2 gồm `themes.mjs`, preflight và chụp `_system.html`; B4 gồm `qa_init --update` và `handover.py run`. Kết quả ngắn, chỉ có thông tin thì thoát 0 để kết quả không bị cắt giữa;
   - agent review B4 dùng loại chỉ đọc (`Explore`);
   - làm tiếp từ `BUILD-LOG.md` trong một lượt.

9. Ghi vào `measure-kit/README.md` một mục mới cho sketch-to-site: thư mục bắt đầu, prompt nguyên văn, bảng mốc nền, mã transcript. Cập nhật memory `token-rollout-plan`. Rồi hỏi tôi muốn làm gì tiếp.
