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
