---
name: tweak-site
description: >-
  Sửa nhỏ prototype HTML có sẵn mà không đi cổng quyết định: Cấp 0 (câu chữ, khoảng cách, màu hay icon theo token sẵn có, style của trạng thái đã có) hoặc Cấp 1 cục bộ (thêm, sửa, bỏ một thành phần trong một màn, theo tiền lệ của trang). Không hỏi, không chạy mốc trước, kiểm nhanh chỉ các bộ bị ảnh hưởng, ghi một dòng nhật ký. Dính cờ quyền, dữ liệu, logic, yêu cầu hay token mới thì chuyển sang evolve-site. Kiểm đủ trước bàn giao dùng handover-check. KHÔNG dùng cho màn mới, lớp phủ mới, luồng nhiều bước. Gọi khi người dùng nói "sửa nhỏ", "chỉnh nhanh", "sửa chữ".
---

# Tweak Site · Sửa nhỏ prototype có sẵn

> **v1.3 (05/10/2026)** · Ít lượt: tìm, đọc, sửa, kiểm, mỗi việc gói trong một lượt *(mục 3)*. Cấp 1 kiểm và chụp bằng một lệnh `quick.py --shots`, không tự dựng bộ chụp. Lịch sử phiên bản ở `CHANGELOG.md` của kit.
> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này. Trên Windows, đường dẫn đưa cho `node` và `python` viết có ổ đĩa và gạch xuôi (`W:/…`), không viết kiểu Git Bash `/w/…`: hai chương trình này không đọc được. Lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh: console Windows (cp1252) dừng giữa chừng với `UnicodeEncodeError`.

## 1. Có nhận việc này không

Nhận khi **mọi** điều sau đúng. Một điều sai → nói ngay một dòng rồi làm theo `evolve-site`:

| # | Điều kiện | Sai thì là |
|---|---|---|
| 1 | Chỉ đổi cách hiển thị (Cấp 0), hoặc thêm, sửa, bỏ **một** thành phần trong **một** màn (Cấp 1) | Lớp phủ, luồng con, màn mới: Cấp 2–3 |
| 2 | Cấp 1: câu lệnh nói chỗ đặt, hoặc trang có thành phần cùng loại để theo | Phân vân vị trí: Cấp 2 |
| 3 | Không đổi ai thấy, ai làm được gì | cờ Q |
| 4 | Không thêm, đổi, bỏ trường của dữ liệu dùng chung (`data.js`, store) | cờ D |
| 5 | Không đổi quy tắc: validation, điều kiện bật tắt, công thức ra số, chuyển trạng thái. *Sửa cho khớp lại quy tắc đã ghi trong nguồn yêu cầu thì vẫn nhận, ghi nguồn* | cờ L |
| 6 | Có trong nguồn yêu cầu, hoặc chỉ là sửa hiển thị của thứ đã có | cờ Y |
| 7 | Dựng được bằng token, component, icon sẵn có | cờ T |

**Cờ C (sửa file dùng chung như CSS chung, `core.js`) vẫn nhận:** lệnh kiểm nhanh tự chạy mọi trang nạp file đó.

Người dùng gọi thẳng `/evolve-site` cho một việc lọt bảng trên thì `evolve-site` tự chuyển sang đây (mục 1.3 của nó), trừ khi người dùng nói "đi đủ cổng".

## 2. Luật không bỏ

- Màu, chữ, bo góc, khoảng cách lấy từ token. Không mã màu mới. Icon đúng bộ đang dùng. Đổi giá trị một token màu *(Cấp 0)*: sửa `site/assets/themes.json` rồi chạy `node <skills>/sketch-to-site/scripts/themes.mjs <thư-mục-prototype>`. Lệnh không ghi file vì có cặp dưới ngưỡng thì chuyển `evolve-site` *(cờ T)*.
- Theo quy ước viết mã và danh sách cấm của dự án (`AGENTS.md`, `DESIGN.md` mục cấm). Chỉ tra đúng mục cần bằng `grep -n`, không đọc lại cả `DESIGN.md`.
- Viết trọn: không `// ...`, không "phần còn lại tương tự".
- Lỗi có sẵn gặp trên đường: không tự sửa, nêu trong báo cáo.
- Người dùng đưa một danh sách sửa: soát từng mục theo `<skills>/sketch-to-site/references/rules-and-conflicts.md` mục F *(in: `sed -n '/^## F\./,$p' <skills>/sketch-to-site/references/rules-and-conflicts.md`)* trước khi làm. Mục nào lộ cờ thì chuyển `evolve-site` như mục 1. Mục chưa rõ thì hỏi, gộp một lượt, trước khi làm: đây là ngoại lệ duy nhất của "không hỏi" ở skill này.

## 3. Quy trình

Mỗi lượt đọc lại cả ngữ cảnh, nên một lần sửa nhỏ gói trong khoảng năm lượt: tìm · đọc · sửa · kiểm · xem ảnh và ghi nhật ký. Lệnh và lần đọc **không phụ thuộc nhau** thì gọi chung một lượt *(nhiều lệnh gọi trong cùng một tin nhắn)*. Không đọc mã của script để biết cách dùng: cách gọi, kết quả và mã thoát ghi ở dưới.

1. **Khai báo**, là câu đầu tiên của lượt:
   `tweak · Cấp <0|1> · cờ: <không|C> · vì <một dòng>`
   Đang sửa mà lộ cờ khác hoặc phạm vi to hơn → dừng ở chỗ ngắt sạch, khai báo lại, chuyển `evolve-site`.
2. **Tìm**, cùng lượt với khai báo: `grep -rn "<chuỗi>" <thư-mục-trang>` *(chỉ thư mục trang, không quét `concept/` hay `_qa/`: kết quả ở đó chiếm hết chỗ)*. Lần kiểm đầu của phiên, gọi cùng lượt lệnh cập nhật bộ kiểm, xem file đổi, và tạo `FEATURE-DECISIONS.md` khi dự án chưa có:
   `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update; cd <thư-mục-prototype> && python _qa/quick.py --dry; [ -f FEATURE-DECISIONS.md ] || sed '/^## Tính năng/,$d' <skills>/evolve-site/templates/FEATURE-DECISIONS.md > FEATURE-DECISIONS.md`
   - `--update` chép đè script của bộ kiểm bằng bản của kit đang dùng, không đụng cấu hình, file bước, mốc.
   - `--dry` in file đã đổi từ lần kiểm sạch cuối và bộ sẽ chạy. Có file không phải của lần sửa này thì chạy `python _qa/quick.py --note "trước tweak: file đổi ngoài quy trình"` trước khi sửa, để dòng nhật ký của lần này chỉ mang thay đổi của nó.
   - Lệnh cuối chỉ chạy khi thư mục prototype chưa có `FEATURE-DECISIONS.md` *(dự án bàn giao trước khi có file này)*: chép phần đầu và bảng *Nhật ký thay đổi nhỏ* của khuôn, không chép khối tính năng.
3. **Đọc**, một lượt: `Read` mọi file sẽ sửa *(đoạn quanh dòng `grep` tìm được, kèm thành phần cùng loại gần nhất để theo)* và `FEATURE-DECISIONS.md`. Edit từ chối file chưa đọc. Không quét cả dự án.
   - Thêm hay chuyển thành phần cạnh một thành phần có sẵn: `Read` luôn file CSS dùng chung của trang trong lượt này *(cả file; file quá dài thì đoạn quanh luật của khối chứa)*. Hàng nút, khoảng cách, căn lề của khối nằm ở đó, và cờ C thường lộ ra ở đây. Đọc xong mới thấy cờ C thì khai báo lại ở lượt sửa.
4. **Sửa**, một lượt: mọi chỗ sửa gọi cùng lúc.
5. **Kiểm nhanh** bằng lệnh của dự án (`AGENTS.md` hoặc `CLAUDE.md`, mục kiểm thử). Với bộ kiểm của `sketch-to-site`, chạy từ thư mục prototype *(thư mục chứa `_qa/`)*:
   `python _qa/quick.py --note "tweak: <một dòng: sửa gì, ở đâu>"`, Cấp 1 thêm `--shots`.
   - Lệnh chạy preflight và các bộ của trang nạp file đã đổi *(đổi `.css` thì thêm mọi theme)*, so với mốc cuốn chiếu `_qa/current/`. `--shots` chụp ảnh các bộ đó và in thư mục cùng tên từng ảnh. Dòng cuối: `quick · … → ĐẠT` hoặc `CHƯA ĐẠT`. Thoát 0 khi sạch *(lệnh tự nâng mốc và ghi nhật ký)*, 1 khi còn lỗi, 2 khi dự án chưa có mốc.
   - `ĐẠT` → xong. `CHƯA ĐẠT` → tìm nguyên nhân gốc, sửa ở gốc rồi chạy lại *(`<skills>/sketch-to-site/references/qa-gate.md` mục 6, in: `sed -n '/^## 6\./,/^## 7\./p'`; không làm im bộ kiểm)*. Lỗi nằm ngoài chỗ vừa sửa và có từ trước → không sửa, báo.
   - Dòng `tương phản mới` hay `ý định mới`: lỗi của lần sửa này, sửa ở gốc. Dòng `nợ cũ`: có từ trước, không chặn, không tự sửa; nêu trong báo cáo.
   - Mỗi dòng `đổi check` phải giải thích được bằng chính thay đổi vừa làm. Không giải thích được là lỗi lan: sửa.
   - Dự án chưa có `_qa/quick.py`: chạy `python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-site>/<trang>.html` *(dòng cuối: `1 file · n lỗi · n cảnh báo`; thoát 1 khi còn lỗi)* cho lần sửa này, rồi đề xuất cài bộ kiểm *(`handover-check`, B0)*. Không tự cài giữa một lần sửa nhỏ. Khi đó Cấp 1 không có ảnh: ghi *chưa xem ảnh* vào báo cáo.
6. **Cấp 1: xem một ảnh** trong danh sách `--shots` in ra, cùng lượt với dòng nhật ký ở bước 8. Lấy khổ chính của trang *(màn app mobile hay trang cho điện thoại: 390; trang quản trị: 1440)*, ảnh có chỗ sửa: lát có tiêu đề của khối vừa sửa trong ngoặc *(danh sách ghi tiêu đề h1–h3 bắt đầu trong từng lát; lát không có ngoặc là phần tiếp của lát trước)*. Không mở đủ khổ. Màn app làm cả iOS và Android: sửa phần chung thì xem ảnh của nền tảng mặc định; sửa phần chỉ của một nền tảng thì chạy bước 5 kèm `--themes <theme-mặc-định>,android` và xem đúng nền tảng đó.
7. **Sửa lỗi người dùng báo** mà không bước kiểm nào bắt được: ghi *chưa có bước kiểm* vào dòng nhật ký, để `handover-check` thêm bước.
8. **Ghi một dòng** vào bảng *Nhật ký thay đổi nhỏ* của `FEATURE-DECISIONS.md`: ngày · khai báo · `file:dòng` · thay đổi · nguồn yêu cầu *(mã, hoặc "câu lệnh")* · kết quả kiểm nhanh · lời người dùng **nguyên văn**. File vừa tạo từ khuôn ở bước 2 thì thay dòng mẫu `<dd/mm/yyyy>` bằng dòng này, và tên dự án vào tiêu đề. Không viết mục mới trong `QA.md`.
9. **Báo cáo, không hỏi**: dòng khai báo, `file:dòng` đã sửa, dòng kết quả cuối của lệnh kiểm nhanh, từng `check` đổi kèm lý do, lỗi có sẵn nếu gặp, link mở trang. Người dùng muốn chỉnh thì nói tiếp.

## 4. Không làm ở đây

Mốc trước khi sửa · 3 khổ màn hình · UX 12 điểm · bộ kiểm mới và bẻ thử · mục `QA.md` · chụp lại ảnh Hub · cập nhật `DESIGN.md` *(icon mới, sơ đồ trang, số chỗ gọi)* · tự viết bộ chụp, gọi riêng `run.mjs`, Edge `--screenshot` hay Playwright. Những việc kiểm nặng thuộc `handover-check`.
