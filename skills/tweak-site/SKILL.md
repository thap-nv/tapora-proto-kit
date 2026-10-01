---
name: tweak-site
description: >-
  Sửa nhỏ prototype HTML có sẵn mà không đi cổng quyết định: Cấp 0 (câu chữ, khoảng cách, màu hay icon theo token sẵn có, style của trạng thái đã có) hoặc Cấp 1 cục bộ (thêm, sửa, bỏ một thành phần trong một màn, theo tiền lệ của trang). Không hỏi, không chạy mốc trước, kiểm nhanh chỉ các bộ bị ảnh hưởng, ghi một dòng nhật ký. Dính cờ quyền, dữ liệu, logic, yêu cầu hay token mới thì chuyển sang evolve-site. Kiểm đủ trước bàn giao dùng handover-check. KHÔNG dùng cho màn mới, lớp phủ mới, luồng nhiều bước. Gọi khi người dùng nói "sửa nhỏ", "chỉnh nhanh", "sửa chữ".
---

# Tweak Site · Sửa nhỏ prototype có sẵn

> **Đường dẫn:** `<skills>` là thư mục chứa các skill của bộ, tức thư mục cha của thư mục chứa SKILL.md này.
>
> **v1.2 (01/10/2026)** · Đổi giá trị một màu: sửa `themes.json` rồi chạy `themes.mjs`, không sửa `themes.css`. Kiểm nhanh chặn tương phản và màu sai ý định mới; nợ cũ chỉ in ra.
> **v1.1 (29/09/2026)** · Kiểm nhanh chưa đạt: tìm nguyên nhân gốc, không làm im bộ kiểm. Danh sách sửa: soát từng mục trước khi làm.
> **v1.0 (28/09/2026)** · Đường nhẹ của `evolve-site`. Cùng luật bảo toàn, bỏ phần nghi thức: không cổng, không mốc trước, không soát UX, không viết bộ kiểm mới. Phần kiểm nặng dồn về `handover-check`, chạy một lần trước khi bàn giao.

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
- Theo quy ước viết mã và danh sách cấm của dự án (`AGENTS.md`, `DESIGN.md` mục cấm). Chỉ tra đúng mục cần, không đọc lại cả `DESIGN.md`.
- Viết trọn: không `// ...`, không "phần còn lại tương tự".
- Lỗi có sẵn gặp trên đường: không tự sửa, nêu trong báo cáo.
- Người dùng đưa một danh sách sửa: soát từng mục theo `<skills>/sketch-to-site/references/rules-and-conflicts.md` mục F trước khi làm. Mục nào lộ cờ thì chuyển `evolve-site` như mục 1. Mục chưa rõ thì hỏi, gộp một lượt, trước khi làm: đây là ngoại lệ duy nhất của "không hỏi" ở skill này.

## 3. Quy trình

1. **Khai báo**, là câu đầu tiên của lượt:
   `tweak · Cấp <0|1> · cờ: <không|C> · vì <một dòng>`
   Đang sửa mà lộ cờ khác hoặc phạm vi to hơn → dừng ở chỗ ngắt sạch, khai báo lại, chuyển `evolve-site`.
2. **Tìm chỗ sửa** bằng `grep`. Đọc đoạn quanh chỗ sửa và thành phần cùng loại gần nhất để theo. Không quét cả dự án.
3. **Sửa.**
4. **Kiểm nhanh** bằng lệnh của dự án (`AGENTS.md` hoặc `CLAUDE.md`, mục kiểm thử). Với bộ kiểm của `sketch-to-site`:
   `python _qa/quick.py --note "tweak: <một dòng: sửa gì, ở đâu>"`, chạy từ thư mục prototype (thư mục chứa `_qa/`).
   - Lần kiểm đầu của phiên: chạy `python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <thư-mục-prototype> --update` trước, để script kiểm là bản của kit đang dùng *(không đụng cấu hình, file bước, mốc)*.
   - Lệnh chọn bộ theo file đã đổi, không chụp ảnh, so với mốc cuốn chiếu `_qa/current/`.
   - `ĐẠT` → xong. `CHƯA ĐẠT` → tìm nguyên nhân gốc, sửa ở gốc rồi chạy lại *(`<skills>/sketch-to-site/references/qa-gate.md` mục 6; không làm im bộ kiểm)*. Lỗi nằm ngoài chỗ vừa sửa và có từ trước → không sửa, báo.
   - Dòng `tương phản mới` hay `ý định mới`: lỗi của lần sửa này, sửa ở gốc. Dòng `nợ cũ`: có từ trước, không chặn, không tự sửa; nêu trong báo cáo.
   - Mỗi dòng `đổi check` phải giải thích được bằng chính thay đổi vừa làm. Không giải thích được là lỗi lan: sửa.
   - Dự án chưa có `_qa/quick.py`: chạy preflight *(`<skills>/sketch-to-site/scripts/preflight.py <thư-mục-site>`)* cho lần sửa này, rồi đề xuất cài bộ kiểm *(`handover-check`, B0)*. Không tự cài giữa một lần sửa nhỏ.
5. **Cấp 1: xem một ảnh** màn vừa sửa, ở khổ chính của trang (màn app mobile hay trang cho điện thoại 390, trang quản trị 1440). Không chụp đủ khổ. Màn app làm cả iOS và Android: sửa phần chung thì xem ảnh của nền tảng mặc định; sửa phần `data-only` thì xem đúng nền tảng đó.
6. **Sửa lỗi người dùng báo** mà không bước kiểm nào bắt được: ghi *chưa có bước kiểm* vào dòng nhật ký, để `handover-check` thêm bước.
7. **Ghi một dòng** vào bảng *Nhật ký thay đổi nhỏ* của `FEATURE-DECISIONS.md`: ngày · khai báo · `file:dòng` · thay đổi · nguồn yêu cầu *(mã, hoặc "câu lệnh")* · kết quả kiểm nhanh · lời người dùng **nguyên văn**. Không viết mục mới trong `QA.md`.
8. **Báo cáo, không hỏi**: dòng khai báo, `file:dòng` đã sửa, dòng kết quả cuối của lệnh kiểm nhanh, từng `check` đổi kèm lý do, lỗi có sẵn nếu gặp, link mở trang. Người dùng muốn chỉnh thì nói tiếp.

## 4. Không làm ở đây

Mốc trước khi sửa · 3 khổ màn hình · UX 12 điểm · bộ kiểm mới và bẻ thử · mục `QA.md` · chụp lại ảnh Hub · đếm lại số chỗ gọi trong `DESIGN.md`. Những việc này thuộc `handover-check`.
