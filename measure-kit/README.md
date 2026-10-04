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
| `paths.js` | Đường dẫn của máy chạy đo, dùng chung cho `phase-site.js`, `fixes-site.js`, `attrib.js`, `turns.js`, `dump.js`. Mặc định là máy Windows của các mốc; máy khác đặt `SKILLS` (thư mục skills của repo) và `RUNS` (thư mục cha của các `<DIR>`) |
| `r2-chosen/sample/` | sketch-to-site pha 1: `r1-board` đã chốt Cổng 2 = C, một nền, nhịp như concept (`DECISIONS.md`, `CONCEPT.md`). Chép ra rồi mới chạy |
| `r3-gate3/sample/` | sketch-to-site pha 2: kết quả pha 1 lần A, Cổng 3 đang mở. Chép ra rồi mới chạy |
| `transcripts/site-4.5/` | Transcript của bốn lần đo 4.5 trên cloud (`.jsonl.gz` + `.meta.json`). Xem mục *sketch-to-site: sau 4.5 (cloud)* |
| `runs-4.5/` | Ảnh cả trang `_system.html` (pha 1), ảnh trang chủ 1440 (pha 2) và `DECISIONS.md` của bốn lần đo 4.5 |
| `memory-note.md` | Ghi chú tiếng Anh để chép vào memory `token-rollout-plan` |

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
