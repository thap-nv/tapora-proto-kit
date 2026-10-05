Đo mốc cũ cho `sketch-to-map`: quy trình hiện tại (`sketch-to-site` B1 đọc đủ tài liệu, rồi lập sơ đồ trang) bắt được bao nhiêu chức năng của đề `r7-map`. Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Bộ đo ở `measure-kit/` trên nhánh `measure`. Đề và đáp án: `measure-kit/README.md`, mục *sketch-to-map: đề đo r7-map*.
- Skill đo ở commit `66e55cb` (`main`, bản 1.5.0, chưa có `sketch-to-map`).
- Mốc này chỉ đo phần đọc yêu cầu và lập sơ đồ trang. Không làm design system: phần đó không đổi giữa bản cũ và bản mới.
- Quyền:
  - Chỉ đo và báo. Không sửa skill.
  - Được commit và push, nhưng chỉ thư mục `measure-kit/`, và chỉ lên nhánh `measure`. Không mở PR, không push nhánh khác.
  - Commit message không có dòng ghi công Claude. Kiểm bằng `git log -1 --format=%B` trước khi push.
  - Đo trên cloud thì máy bị xoá khi hết phiên: thứ gì chưa push là mất.

0. Chuẩn bị, một lệnh: `bash measure-kit/cloud-setup.sh 66e55cb`. Phải ra `Sẵn sàng`. Ghi lại dòng `SKILLS=… RUNS=…` nó in; mọi lệnh chạy script đo sau đó tự đặt hai biến này trong chính lệnh.
   - Soát đáp án: `node measure-kit/mapscore.js --selfcheck measure-kit/r7-map/key.json measure-kit/r7-map/sample/docs` phải in `Không có chỗ cần sửa.`

1. Chép `measure-kit/r7-map/sample/` vào `<RUNS>/rm0a/`. **Không** chép `key.json`: agent được đo không được thấy đáp án.

2. Chạy một subagent `general-purpose`, chạy nền, model mặc định, với prompt dưới đây. Chỉ thay `<SKILLS>` và `<DIR>` (= `<RUNS>/rm0a`). Ghi lại prompt đã gửi. Đừng đoán kết quả khi subagent chưa báo xong.

   ```text
   Dùng skill sketch-to-site: đọc <SKILLS>/sketch-to-site/SKILL.md và làm theo, cho prototype ở <DIR>. Tài liệu yêu cầu của dự án nằm ở <DIR>/docs/yeu-cau/. CONCEPT.md và DECISIONS.md đã có Cổng 1 và Cổng 2. Làm B0 và B1 đúng như skill. Ở B2 chỉ làm hai việc: "Lập sơ đồ trang" (ghi vào DESIGN.md mục 9, theo khuôn <SKILLS>/sketch-to-site/templates/DESIGN.md) và "Đề xuất phạm vi lần này". Không làm design system, không chạy system-check.mjs, không hỏi Cổng 3. Xong thì dừng và báo: số trang hay màn trong sơ đồ, đường dẫn DESIGN.md.
   ```

3. Chấm và đo, đặt `SKILLS`, `RUNS` trong từng lệnh:
   - `node measure-kit/mapscore.js measure-kit/r7-map/key.json <DIR>`: chấm văn bản của `DESIGN.md`. Soát tay từng dòng *Cần soát tay*, và đọc mục 9 để xem có chức năng nào được dựng mà script chưa nhận ra (ghi rõ nếu sửa số).
   - `parts2.js`, `turns.js`, `times.js` trên transcript của subagent.
   - **Cớ đọc thiếu:** tìm trong transcript những chỗ agent bỏ qua hay đọc lướt một tài liệu hoặc một mục (ví dụ "chỉ là giới thiệu", "đọc nhanh", "bỏ qua phụ lục", đọc `head` hay một phần file). Chép **nguyên văn** từng câu, kèm số lượt. Đây là đầu vào cho bảng cớ của `sketch-to-map`.
   - Ghi lại tài liệu nào được đọc nguyên, đọc một phần, hay không đọc.

4. Lưu, ngay sau khi chấm:
   - Transcript `agent-<id>.jsonl` nén `gzip -9`, kèm `.meta.json`, vào `measure-kit/transcripts/map-moc-cu/`.
   - `DESIGN.md` và `DECISIONS.md` của lần chạy vào `measure-kit/runs-map/rm0a/`.
   - Thêm kết quả vào `measure-kit/README.md`, mục *sketch-to-map: đề đo r7-map*, phần *Mốc cũ*: commit đã đo, máy chạy, lượt, token quy đổi, dòng tổng của `mapscore.js`, các mục trượt theo kiểu bẫy, cớ đọc thiếu.
   - Commit (chỉ `measure-kit/`) rồi push lên `measure`.
