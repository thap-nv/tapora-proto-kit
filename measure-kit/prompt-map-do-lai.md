Đo lại `sketch-to-map` 1.0 sau các chỗ sửa, và đo lần đầu đường **chia worker**. Trả lời tôi bằng tiếng Việt.

## Bối cảnh

- Bộ đo ở `measure-kit/` trên nhánh `measure`, worktree `W:/Dummy/[Tool] Working/tapora-measure`. Chạy mọi lệnh từ gốc worktree đó.
- Lần đo trước (README, phần *Bản mới 1.0*, hai lần `rmm1`, `rmm2` trên đề `r7-map`): độ phủ 43/43, bẫy 18/18, mọi chỉ số bố cục chặn đạt; nhưng 18–19 lượt và 0,62M quy đổi trừ mất cache, trượt mục tiêu ≤ 15 lượt và ≤ 0,5M. Lượt thừa đã sửa sau đó (chưa đo lại):
  1. lệnh M0 ghi ngay ở bảng lối vào của SKILL.md, nên chạy được ở lượt vào;
  2. `Write` `features.js` hay `layout.js` và lệnh `check` gọi cùng một lượt;
  3. khối Cổng Bản đồ của `DECISIONS.md` in sẵn ở SKILL.md mục 3;
  4. `check --shots` sạch in khối *Trình ở cổng* (chức năng suy, ghi chú, module theo thứ tự dựng), nên không cần đọc `MAP.md`;
  5. danh sách CHẶN in tới 40 dòng;
  6. `m1-kiem-ke.md` nói bản in M0 là đủ khi đọc nguyên, ví dụ có sẵn `suy`, `notes`, `hoan`.
- Đường chia worker (tài liệu trên 300 KB) chưa đo lần nào. Đề `r8-map-lon` (README, phần *đề r8-map-lon*) là `r7-map` cộng một phụ lục dữ liệu 328 KB, chấm bằng cùng đáp án `r7-map/key.json`. Lúc soạn đề đã sửa thêm `sources.py`: mã học viên của phụ lục là `data_codes`, không phải hệ mã.
- Bản đo: nhánh `feat/sketch-to-map` trên origin, commit **sau** `f1c0882` (có cả chỗ sửa `data_codes`). Ghi lại hash đã đo.
- Máy: Windows này, như `rmm1`, `rmm2` (Node 20.19.5, Python 3.14, model Opus 5.5). **Không** chạy trên cloud: đường chia worker cần subagent gọi được subagent, cloud không cho.
- Quyền:
  - Chỉ đo và báo. Không sửa skill.
  - Không commit, không push: người dùng tự commit.
  - Nhánh `measure` công khai. Trước khi lưu transcript, thay tên dự án thật (nếu có) bằng "dự án thật" (lệnh ở bước 5).

## 0. Chuẩn bị (một lượt)

- `bash measure-kit/cloud-setup.sh feat/sketch-to-map`: phải ra `Sẵn sàng`. Ghi dòng `SKILLS=… RUNS=…` nó in; mọi lệnh chạy script đo sau đó tự đặt hai biến này trong chính lệnh.
- Kiểm bản đo có đủ chỗ sửa, ghi hash:
  - `git -C <worktree moi> rev-parse --short HEAD`;
  - `grep -c data_codes <SKILLS>/sketch-to-map/scripts/sources.py` phải ≥ 1;
  - `grep -c gateBlock <SKILLS>/sketch-to-map/scripts/map.mjs` phải ≥ 1.
  
  Thiếu thì dừng, báo tôi push bản mới.
- Kiểm đề:
  - `md5sum measure-kit/r8-map-lon/sample/docs/yeu-cau/PHU-LUC-DU-LIEU-SONG-XANH.md` phải là `4996dc5df50625c284306716ba13a0ad`. Khác thì chạy `python measure-kit/mk-r8.py` rồi kiểm lại.
  - `node measure-kit/mapscore.js --selfcheck measure-kit/r7-map/key.json measure-kit/r8-map-lon/sample/docs` phải in `Không có chỗ cần sửa.`

## 1. Thư mục chạy

Chép `measure-kit/r7-map/sample/` vào `<RUNS>/rmm3/`, `<RUNS>/rmm4/`; chép `measure-kit/r8-map-lon/sample/` vào `<RUNS>/rml1/`, `<RUNS>/rml2/`. **Không** chép `key.json`.

## 2. Chạy

Bốn subagent `general-purpose`, chạy nền, model mặc định, chia **hai đợt** (mỗi lần `rml` tự gọi tới 4 worker, chạy cả bốn cùng lúc dễ chạm giới hạn subagent của phiên):
- đợt 1: `rmm3` và `rml1`, song song;
- đợt 2, sau khi cả hai báo xong: `rmm4` và `rml2`.

Prompt giống hệt lần trước, chỉ thay `<SKILLS>` và `<DIR>`. Ghi lại prompt đã gửi. Đừng đoán kết quả khi subagent chưa báo xong.

```text
Dùng skill sketch-to-map: đọc <SKILLS>/sketch-to-map/SKILL.md và làm theo, cho prototype ở <DIR>. Tài liệu yêu cầu của dự án nằm ở <DIR>/docs/yeu-cau/. CONCEPT.md và DECISIONS.md đã có Cổng 1 và Cổng 2. Làm tới Cổng Bản đồ. Phiên này không có công cụ hỏi người dùng: tới cổng thì trình bày, viết câu hỏi ra, ghi khối cổng vào DECISIONS.md, rồi dừng và báo: dòng Kiểm kê, dòng Chỉ số bố cục, đường dẫn map/MAP.md.
```

Transcript của subagent nằm ở thư mục `subagents/` của phiên này (`agent-<id>.jsonl`, `.meta.json`). Worker và người thử nhãn là subagent con: `.meta.json` có `parentAgentId` của lần chạy.

## 3. Chấm và đo, mỗi lần chạy

Đặt `SKILLS`, `RUNS` trong từng lệnh.

1. **Độ phủ:** `node measure-kit/mapscore.js measure-kit/r7-map/key.json <DIR>`.
   - Script khớp theo tên, nên soát tay **mọi** mục *Trượt* và *Cần soát tay*: tìm trong `map/features.js` theo `src` và `spec`.
   - Lần trước 6 mục bị báo trượt đều có thật: tách nhỏ hay gộp, như K13, K17, K19, K27, K32. Xem cách chấm ở README phần *Bản mới 1.0*.
   - Ghi số đã soát tay, kèm lý do từng mục đổi.
2. **Bố cục:** `node <SKILLS>/sketch-to-map/scripts/map.mjs check <DIR>`. Ghi dòng Kiểm kê, Nguồn, Chỉ số bố cục.
3. **Chi phí:** `node measure-kit/phase-map.js <transcript> --list`, `node measure-kit/fixes-map.js <transcript>`, `node measure-kit/times.js <transcript>`.
   - `phase-map.js` tự cộng subagent con (worker, người thử nhãn).
   - `fixes-map.js` mục 9 soát từng chỗ sửa: M0 cùng lượt với Read `m1-kiem-ke.md`; Write và check cùng lượt; không tra khuôn `DECISIONS`, không đọc `MAP.md`, `check.json`, `sources.json`, `ids.json`/`states.json`, `*.example.js`. Ở lần `rml`, `sources.json` được phép đọc: chia worker cần mục lục.
4. **Riêng `rml1`, `rml2`** (đường chia worker):
   - `fixes-map.js` mục 9: số worker, nhiều nhất bao nhiêu một lượt (≤ 4), có chạy nền không.
   - `fixes-map.js` mục 1: agent chính có Read nguyên bản chữ của phụ lục (`D3.txt`) không.
   - Chạy `fixes-map.js` trên **từng worker**: mục 1 cho biết worker đọc dải dòng nào. Mỗi worker phải chỉ đọc dải của module mình.
   - `merge` và `check` có gọi cùng một lệnh không.
   - Ba mục của phụ lục có trong `skip` không.
   - `<DIR>/map/ids.json` có `"data_codes": {"SX": 750}` và không có `SX` trong `systems`.
   - So độ phủ với `rmm3`, `rmm4`: đọc theo phần có sót hơn đọc nguyên không, sót ở kiểu bẫy nào.

## 4. Mục tiêu

| | Mục tiêu |
|---|---|
| `rmm3`, `rmm4` | ≤ 15 lượt và ≤ 0,5M quy đổi trừ mất cache · mục 9 của `fixes-map.js` sạch · độ phủ 43/43, bắt K16, không dựng N1–N4, K41–K43 hoãn · `check` cuối 0 chặn |
| `rml1`, `rml2` | độ phủ ≥ 42/43 và bắt K16 · ≤ 4 worker một lượt · agent chính không đọc nguyên phụ lục · lượt, token (chính + worker + người thử) và thời gian: chưa có mục tiêu, ghi để làm mốc |

## 5. Lưu, ngay sau khi chấm

- **Transcript** vào `measure-kit/transcripts/map-do-lai/`: của lần chạy và mọi subagent con, kèm `.meta.json`. Lọc tên dự án thật rồi nén `gzip -9`: `sed 's/Bơi Đạt/dự án thật/g' agent-<id>.jsonl | gzip -9 > …/agent-<id>.jsonl.gz`. Kiểm lại bằng `gunzip -c … | grep -c 'Bơi Đạt'`, phải ra 0.
- **Kết quả từng lần** vào `measure-kit/runs-map/<lần>/`: `map/features.js`, `map/layout.js`, `map/MAP.md`, `map/treetest.md`, `DECISIONS.md`. Lần `rml` thêm `map/parts/` và `map/ids.json`.
- **README:** thêm phần *sketch-to-map: đo lại sau sửa và đường chia worker (đo <ngày>)* ngay sau phần *đề r8-map-lon*. Viết theo cách của phần *Bản mới 1.0*:
  - bảng so `rmm1`, `rmm2` với `rmm3`, `rmm4`;
  - bảng `rml1`, `rml2`;
  - theo bước;
  - soát từng việc;
  - đọc kết quả;
  - đề xuất bước tiếp (chưa sửa skill), mỗi đề xuất kèm số đo và ước lượng tiết kiệm.
- **`measure-kit/memory-note.md`:** 5–10 dòng tóm tắt để gộp vào memory.
- **Ghi tiến độ:** thêm một khối ngắn vào `W:/Dummy/[Tool] Working/tapora-proto-kit/plans/2026-10-05-sketch-to-map.md`, cuối phần *Thứ tự làm*. File này nằm ngoài git.

## 6. Báo lại

Bảng số, từng chỗ sửa có hiệu lực hay không, đường chia worker chạy ra sao, và các đề xuất bước tiếp kèm ước lượng. Không sửa skill khi chưa hỏi tôi.
