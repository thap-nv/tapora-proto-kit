Đo đường **chia worker** của `sketch-to-map` 1.0 trên đề `r9-map-lon2` (một lần chạy), để xem các chỗ sửa của đường này có hiệu lực không. Trả lời tôi bằng tiếng Việt.

## Bối cảnh

- Bộ đo ở `measure-kit/` trên nhánh `measure`, worktree `W:/Dummy/[Tool] Working/tapora-measure`. Chạy mọi lệnh từ gốc worktree đó. Đọc trước README, phần *sketch-to-map: đề r9-map-lon2*, rồi phần *Đường chia worker: `rml1`, `rml2`* và *Đo lần ba trên r8*.
- Đề `r9-map-lon2` = r7-map + phụ lục dữ liệu 328 KB + hai tài liệu yêu cầu dài (tiêu chí nghiệm thu, kịch bản kiểm thử): phần yêu cầu thật 424 KB, vượt 300 KB. Đáp án vẫn `r7-map/key.json`: 43 chức năng, 18 bẫy, không thêm chức năng (N1–N4 không được dựng, K41–K43 hoãn).
- Mốc để so (đường worker lần đầu, bản `230a7d1`, đề r8 khi phần thật chỉ 48 KB nhưng bị chia worker): agent chính 19–21 lượt, 0,51–0,52M; 7 worker 0,75M và 0,92M; tổng 1,31–1,47M; 21–22 phút; kiểm kê 84–87 chức năng, 15–20 suy. Sau đó đã sửa 6 chỗ ở đường worker (bản `e183b41`), chưa đo lại khi thật sự chia worker:
  1. prompt worker nói Read bằng offset/limit, mọi dải một lượt;
  2. agent chính ghi `parts/_chung.js` (skip cho mục dùng chung) cùng lượt gọi worker;
  3. `Read` `features.js` trước khi `Edit` sau `merge`;
  4. phân chia sở hữu chức năng để không trùng; `merge` in cặp nghi trùng;
  5. khối cổng in đủ mâu thuẫn và ghi chú;
  6. tối đa 4 worker tổng cộng.
- Bản skill đo: nhánh `feat/sketch-to-map` trên origin, commit **sau** `c646c87`, phải có câu *"Ghi `features.js`, `layout.js` bằng `Write`, không bằng heredoc trong Bash"* ở SKILL.md. Người dùng commit và push trước khi đo; nếu chưa, dừng và báo. Ghi lại hash đã đo.
- Máy: Windows này (Node 20.19.5, Python 3.14, Opus 5.5). **Không** chạy trên cloud: worker là subagent con của subagent.
- Quyền: chỉ đo và báo; không sửa skill, không commit, không push. Nhánh `measure` công khai: trước khi lưu transcript thay tên dự án thật (nếu có) bằng "dự án thật" (lệnh ở bước 5).

## 0. Chuẩn bị (một lượt)

- `bash measure-kit/cloud-setup.sh feat/sketch-to-map`: phải ra `Sẵn sàng`. Ghi dòng `SKILLS=… RUNS=…`; mọi lệnh script đo sau đó tự đặt hai biến này trong chính lệnh.
- Kiểm bản đo, ghi hash: `git -C <worktree moi> rev-parse --short HEAD`; `grep -c "không bằng heredoc" <SKILLS>/sketch-to-map/SKILL.md` ≥ 1; `grep -c data_codes <SKILLS>/sketch-to-map/scripts/sources.py` ≥ 1. Thiếu thì dừng, báo tôi push.
- Kiểm đề:
  - nếu thiếu `measure-kit/r9-map-lon2/sample`: `python measure-kit/mk-r8.py` rồi `python measure-kit/mk-r9.py`;
  - `md5sum measure-kit/r9-map-lon2/sample/docs/yeu-cau/TIEU-CHI-NGHIEM-THU-SONG-XANH.md` phải là `2e9ef63cf0fbaf284c0a515ceb22a325`, `KICH-BAN-KIEM-THU-SONG-XANH.md` phải là `a0ca096137c7838c1a346af04d287532`; khác thì chạy lại `mk-r9.py` và kiểm lại;
  - `node measure-kit/mapscore.js --selfcheck measure-kit/r7-map/key.json measure-kit/r9-map-lon2/sample/docs` phải in `Không có chỗ cần sửa.`
  - Chạy thử `sources.py` trên **bản sao** (không phải thư mục chạy) để biết nó in "chia worker" và số module; không dùng bản sao để đo.

## 1. Thư mục chạy

Chép `measure-kit/r9-map-lon2/sample/` vào `<RUNS>/rlb1/`. **Không** chép `key.json`.

## 2. Chạy

Một subagent `general-purpose`, chạy nền, model mặc định. Prompt giống các lần trước, thay `<SKILLS>` và `<DIR>`. Ghi lại prompt đã gửi. Đừng đoán kết quả khi subagent chưa báo xong.

```text
Dùng skill sketch-to-map: đọc <SKILLS>/sketch-to-map/SKILL.md và làm theo, cho prototype ở <DIR>. Tài liệu yêu cầu của dự án nằm ở <DIR>/docs/yeu-cau/. CONCEPT.md và DECISIONS.md đã có Cổng 1 và Cổng 2. Làm tới Cổng Bản đồ. Phiên này không có công cụ hỏi người dùng: tới cổng thì trình bày, viết câu hỏi ra, ghi khối cổng vào DECISIONS.md, rồi dừng và báo: dòng Kiểm kê, dòng Chỉ số bố cục, đường dẫn map/MAP.md.
```

Transcript của subagent nằm ở thư mục `subagents/` của phiên này (`agent-<id>.jsonl`, `.meta.json`). Worker và người thử nhãn là subagent con: `.meta.json` có `parentAgentId` là lần chạy.

## 3. Chấm và đo

1. **Độ phủ:** `node measure-kit/mapscore.js measure-kit/r7-map/key.json <DIR>`. Soát tay **mọi** mục *Trượt* và *Cần soát tay* (tìm trong `map/features.js` theo `src`, `spec`): tách nhỏ hay gộp tính là có, như K13, K17, K19, K27, K32 ở các lần trước; ghi lý do từng mục đổi. Soát cả *Ngoài đáp án*: hai tài liệu mới nói chi tiết, nên xem có chức năng thật sự thừa (suy từ kịch bản) hay chỉ là tách nhỏ.
2. **Bố cục:** `node <SKILLS>/sketch-to-map/scripts/map.mjs check <DIR>`. Ghi dòng Kiểm kê, Nguồn, Chỉ số bố cục.
3. **Chi phí:** `node measure-kit/phase-map.js <transcript> --list`, `node measure-kit/fixes-map.js <transcript>`, `node measure-kit/times.js <transcript>`. `phase-map.js` tự cộng subagent con. Ghi riêng: agent chính, từng worker, người thử nhãn, tổng.
4. **Đường chia worker** (đọc kỹ):
   - `fixes-map.js` mục 9: số worker, nhiều nhất bao nhiêu một lượt (≤ 4), tổng cộng ≤ 4 không, có chạy nền không;
   - `fixes-map.js` mục 1 trên agent chính: không Read nguyên bản chữ của hai tài liệu dài (trong `sources.py` là `D3.txt` và `D5.txt`) và không đọc phụ lục dữ liệu (`D4.txt`);
   - chạy `fixes-map.js` trên **từng worker**: mỗi worker chỉ đọc dải dòng của module mình. Script bỏ sót `sed`/`awk` trên tên file trần sau khi `cd` vào `_src/`: nếu cần, soát tay;
   - prompt worker của agent chính có câu Read offset/limit một lượt không; mỗi worker mất mấy lượt (mốc cũ: 4 lượt khi có câu đó, 6–11 khi không);
   - `parts/_chung.js` có được ghi trước `merge` không; `merge` và `check` có cùng một lệnh không; `Read features.js` trước `Edit` sau `merge` không (có bị từ chối không);
   - phụ lục dữ liệu có bị `sources.py` bỏ sẵn (không cần ghi `skip`) không; `<DIR>/map/ids.json` có `"data_codes": {"SX": 750}`, không có `SX` trong `systems`;
   - hai tài liệu dài có bị worker coi là nguồn **chức năng mới** không (đếm chức năng suy, so 15–20 của mốc cũ);
   - dòng "chia worker" của `sources.py` in 761,5 KB: ghi lại nguyên văn và xem agent có hiểu sai không (phần thật là 424 KB).

## 4. Mục tiêu

| | Mục tiêu |
|---|---|
| Độ phủ | ≥ 42/43, bắt K16, không dựng N1–N4, K41–K43 hoãn |
| Đường worker | ≤ 4 worker một lượt và tổng; agent chính không đọc nguyên hai tài liệu dài; mỗi worker chỉ đọc dải của module mình; `merge && check` một lệnh; `check` cuối 0 chặn |
| Chi phí | chưa có mục tiêu, ghi làm mốc: lượt, token (chính + worker + người thử), thời gian. So với mốc 1,31–1,47M và 21–22 phút, và với đọc nguyên r8 (0,40–0,56M, 5–8 phút) để thấy giá của 424 KB yêu cầu thật |

## 5. Lưu, ngay sau khi chấm

- **Transcript** vào `measure-kit/transcripts/map-do-lai-4/`: của lần chạy và mọi subagent con, kèm `.meta.json`. Lọc tên dự án thật rồi nén: `sed 's/Bơi Đạt/dự án thật/g' agent-<id>.jsonl | gzip -9 > …/agent-<id>.jsonl.gz`. Kiểm lại bằng `gunzip -c … | grep -c 'Bơi Đạt'`, phải ra 0.
- **Kết quả** vào `measure-kit/runs-map/rlb1/`: `map/features.js`, `map/layout.js`, `map/MAP.md`, `map/treetest.md`, `map/ids.json`, `map/parts/`, `DECISIONS.md`.
- **README:** thêm phần *sketch-to-map: đường chia worker trên r9-map-lon2 (đo <ngày>)* ngay sau phần *đề r9-map-lon2*. Viết theo cách của các phần trước: bảng (mốc `rml1`, `rml2` và `rlb1`), theo bước, soát từng chỗ sửa của đường worker, đọc kết quả, đề xuất bước tiếp (chưa sửa skill) kèm số đo và ước lượng tiết kiệm.
- **`measure-kit/memory-note.md`:** 5–10 dòng tóm tắt để gộp vào memory.
- **Ghi tiến độ:** thêm một khối ngắn vào `W:/Dummy/[Tool] Working/tapora-proto-kit/plans/2026-10-05-sketch-to-map.md`, cuối phần *Thứ tự làm* (file này nằm ngoài git).

## 6. Báo lại

Bảng số (chính, từng worker, người thử, tổng; lượt; thời gian), từng chỗ sửa của đường worker có hiệu lực hay không, độ phủ sau soát tay, và các đề xuất kèm ước lượng. Một lần chạy có dao động 15–25 %: nói rõ chênh nào dưới ngưỡng đó. Không sửa skill khi chưa hỏi tôi.
