Đo `sketch-to-map` 1.0 trên đề `r7-map`, tới Cổng Bản đồ, để so với mốc cũ `rm0a` (`prompt-map-moc-cu.md`). Trả lời tôi bằng tiếng Việt.

Bối cảnh:
- Bộ đo ở `measure-kit/` trên nhánh `measure`. Đề và đáp án: `measure-kit/README.md`, mục *sketch-to-map: đề đo r7-map*.
- Lần đo 06/10/2026 chạy trên **bản chụp** thư mục `skills/` của nhánh `feat/sketch-to-map` khi chưa commit (trên `66e55cb`), mã băm `2ca520e44dfb` (`find skills -type f | sort | xargs sha1sum | sha1sum`), chép vào `<scratchpad>/wt/moi/tapora-proto-kit/skills` để `paths.js` in `<skills:moi>`. Đo lại về sau thì dùng commit của bản đó và `cloud-setup.sh <commit>`.
- Chỉ đo và báo. Không sửa skill. Commit và push chỉ thư mục `measure-kit/`, chỉ lên nhánh `measure`, không dòng ghi công Claude.
- Nhánh `measure` công khai: trước khi lưu transcript, thay tên dự án thật (nếu tài liệu skill của bản đo còn nhắc) bằng chữ trung tính.

1. Chép `measure-kit/r7-map/sample/` vào `<RUNS>/rmm1/` và `<RUNS>/rmm2/`. **Không** chép `key.json`.

2. Chạy hai subagent `general-purpose`, chạy nền, song song, model mặc định, mỗi lần một thư mục. Chỉ thay `<SKILLS>` và `<DIR>`:

   ```text
   Dùng skill sketch-to-map: đọc <SKILLS>/sketch-to-map/SKILL.md và làm theo, cho prototype ở <DIR>. Tài liệu yêu cầu của dự án nằm ở <DIR>/docs/yeu-cau/. CONCEPT.md và DECISIONS.md đã có Cổng 1 và Cổng 2. Làm tới Cổng Bản đồ. Phiên này không có công cụ hỏi người dùng: tới cổng thì trình bày, viết câu hỏi ra, ghi khối cổng vào DECISIONS.md, rồi dừng và báo: dòng Kiểm kê, dòng Chỉ số bố cục, đường dẫn map/MAP.md.
   ```

3. Chấm và đo, đặt `SKILLS`, `RUNS` trong từng lệnh:
   - `node measure-kit/mapscore.js measure-kit/r7-map/key.json <DIR>`: chấm dữ liệu `map/features.js`. Soát tay mục trượt và *cần soát tay*; chức năng ngoài đáp án có thể là tách nhỏ hợp lệ. Mục tiêu: ≥ 42/43, bắt K16, không dựng N1–N4, K41–K43 hoãn.
   - Dòng chỉ số bố cục của `map.mjs check <DIR>` (chạy lại bằng bản đo), so với mốc cũ trên giấy (README, phần *Mốc cũ trên giấy*).
   - `phase-map.js --list`, `fixes-map.js`, `turns.js`, `times.js` trên transcript. Mục tiêu: tới cổng ≤ 15 lượt và ≤ 0,5M quy đổi; 0 lần đọc mã script; ≤ 1 ảnh mở trước cổng.

4. Lưu transcript (nén `gzip -9`, kèm `.meta.json` và transcript của subagent con) vào `measure-kit/transcripts/map-moi/`; `map/features.js`, `map/layout.js`, `map/MAP.md`, `DECISIONS.md` của từng lần vào `measure-kit/runs-map/<lần>/`; kết quả vào README, mục *sketch-to-map: đề đo r7-map*, phần *Bản mới 1.0*.
