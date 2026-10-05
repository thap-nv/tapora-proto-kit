# Nhật ký quyết định — Sóng Xanh

> Mỗi cổng một khối, Cổng 1–2 do `sketch-to-concept` ghi, Cổng 3–4 do `sketch-to-site` ghi. **Đáp án ghi nguyên văn** lời người dùng. Cổng bị bỏ qua thì vẫn ghi: ai cho phép bỏ qua, và nguyên văn câu cho phép.

## 🛑 Cổng 1 · Brief concept — 29/09/2026 *(sketch-to-concept)*
| Câu hỏi | Đáp án (nguyên văn) | Ghi chú |
|---|---|---|
| Loại sản phẩm *(nhiều bề mặt: liệt kê từng bề mặt)* | "Web quản trị cho quản lý, lễ tân, HLV và app cho phụ huynh." | Hệ thống nhiều bề mặt |
| Nền tảng app *(nếu có app)* | "Cả iOS và Android." | |
| Người dùng chính + thiết bị | "Lễ tân ngồi máy tính cả ngày, HLV cầm máy tính bảng ở bể, phụ huynh dùng điện thoại." | |
| Tham chiếu + mức bám | "Không có tham chiếu." | |
| Khác biệt · Định hướng *(nếu brief còn trống)* | "Trong, mát, ngăn nắp." | |

## 🛑 Cổng 2 · Concept — 30/09/2026 *(sketch-to-concept)*
| Vòng | Concept | Nguồn | Ý *(một câu)* | Họ phong cách | Màn then chốt · khung |
|---|---|---|---|---|---|
| 1 | a | hợp nhất | Sổ tay quầy | Biên tập tối giản | Danh sách học viên · bảng |
| 1 | b *(Khuyến nghị)* | hợp nhất | Mỗi lớp là một làn bơi | Công cụ vận hành | Lịch tuần · lưới làn × giờ |
| 1 | c | lăng kính studio: thể thao | Đồng hồ bấm giờ | Kỹ thuật tối | Lịch ngày · vòng thời gian |
**Bảng:** `concept/index.html` · **Chấm lớp Ý** *(review độc lập)*: a 6/10 · b 7/10 · c 6/10
**Đáp án concept (nguyên văn):** "Chọn B, làn bơi."
**Mã trộn (nếu có):** không
**Nền:** một nền sáng · **Nhịp:** như concept

## Giả định (B1)
> Thực tế nội dung mà tài liệu yêu cầu chưa nói. Không hỏi; Cổng 3 chỉ nêu dòng nào đổi thiết kế *(đánh dấu **◆**)*.
> **Nguồn đè:** `XUNG-DOT-SONG-XANH.md` đè mọi file khác: báo nghỉ trước **2 giờ** *(XD-01, không phải 24 giờ)* · phụ huynh **gửi yêu cầu** đổi lịch, không tự đổi *(XD-02, bỏ `BR-LI-03`)* · lớp Làm quen nước **6 bé** *(XD-03)* · **lễ tân** huỷ buổi khi bể có sự cố, quản lý nhận báo *(XD-04)*. Sơ đồ trang chỉ vẽ GĐ1 *(M-01…M-09, S-01…S-03)*.

| Giả định | Mặc định đã chọn | Giá phải trả nếu sai |
|---|---|---|
| **◆** Lưới lịch: bể 25 m có 6 làn, bể trẻ em không chia làn; mỗi làn một lớp mỗi khung giờ | Lưới 7 cột: Làn 1–6 + Bể trẻ em | Bể trẻ em chia 2 khu: thêm cột, ô hẹp hơn ở máy tính bảng |
| **◆** Giờ có lớp: thứ Hai–Sáu 16:00–20:00, thứ Bảy và Chủ nhật 7:00–11:30 và 15:00–18:00; mỗi buổi 45 phút *(`BR-LH-02`)* | Trục giờ chia 15 phút, cuộn dọc, mốc "bây giờ" | Có lớp sáng trong tuần: trục dài gấp đôi, cần nhảy nhanh tới giờ |
| **◆** Một tuần có khoảng 45 lớp × 2–3 buổi ≈ 120 buổi *(420 học viên ÷ ~9 bé một lớp; 9 HLV × 3–6 lớp)* | 7 ngày × 7 làn = 49 cột không vừa 1440: lưới làn × giờ cho một ngày, dải 7 ngày phía trên làm bộ chọn và ghi số chỗ trống từng ngày | `concept/b.html` đặt cả tuần trong một lưới: phải thu ô lớp còn mã lớp + sĩ số, chi tiết dồn sang ngăn phải |
| Danh sách học viên: ~420 đang học *(tài liệu mục 1, "khoảng")*, thêm học thử và ngừng học, tới ~600 dòng | Bảng phân trang 50 dòng, tìm từ ký tự thứ ba, lọc trạng thái, cấp độ, gói | Vài nghìn dòng: tìm phía máy chủ, không lọc tại chỗ |
| Sĩ số mỗi lớp 0–10 *(Làm quen nước 0–6)*; danh sách chờ mỗi lớp 0–8 bé | Ô lớp ghi `x/10` và vạch chỗ trống; chờ ghi số `+3 chờ` | Chờ tới hàng chục: danh sách chờ cần trang riêng thay vì nằm trong ngăn |
| Một phụ huynh có 1–3 con học ở trung tâm *(`BR-HV-03`)* | App xem từng con một, đổi con ở thanh trên bằng sheet | 4 con trở lên: sheet cuộn, vẫn dùng được |
| App: mỗi bé 2–3 buổi một tuần; màn Lịch hiện 2 tuần tới (4–6 buổi) | Buổi gần nhất nổi đầu, còn lại nhóm theo tuần | Phụ huynh muốn xem cả tháng: thêm chế độ tháng |
| Việc cần xử lý của quầy: 0–25 việc một ngày *(trước đây 60–80 tin Zalo một ngày; yêu cầu đổi lịch còn khoảng 5–15)* | Một trang chia nhóm, mỗi nhóm có đếm; rỗng: "Đã xử lý hết việc hôm nay" | Nhiều hơn 50: cần lọc và giao việc theo ca |
| Nhân viên: 14 người *(2 quản lý, 3 lễ tân, 9 HLV)* | Bảng một trang, không phân trang | · |
| Thông báo trong app: 0–30 một tháng | Danh sách, khẩn ghim đầu, chưa đọc in đậm | · |
| Biên lai mỗi học viên: 1–6 lần đóng tiền | App hiện 3 lần gần nhất, có "Xem tất cả" | · |
| Chuỗi dài nhất: tên học viên hay phụ huynh ~32 ký tự *("Tôn Nữ Hoàng Bảo Ngọc Khánh Linh")*; tên HLV ~22; ghi chú sức khoẻ tới 300 ký tự; lý do từ chối đổi lịch tới 200 | Tên xuống dòng trong thẻ, cắt một dòng có `title` trong ô lưới; ghi chú sức khoẻ hiện đủ ở hồ sơ, rút 1 dòng ở danh sách điểm danh | Tên dài hơn: ô lớp trong lưới chỉ ghi họ HLV |
| Mã học viên `SX-0001` tới `SX-9999` *(`BR-HV-01`)*; mã biên lai chưa có quy ước | Mã biên lai `BL-2610-00417` *(năm tháng + số thứ tự)*, chữ mono | Kế toán có quy ước khác: chỉ đổi chuỗi mẫu |
| Số lớn nhất: giá gói 3.840.000 ₫ *(thật, Phụ lục A)*; doanh thu tháng tới 9 chữ số *(minh hoạ, ~250.000.000 ₫)*; buổi còn lại ≤ 30 | Cột tiền căn phải, `tabular-nums`, rộng đủ `999.999.999 ₫` | · |
| **Số thật:** bảng giá, sĩ số tối đa 6/10, 6 làn, gói 8/12/24 buổi hạn 2/3/6 tháng, báo nghỉ 2 giờ, 3 lần vắng có phép, bảo lưu ≤ 30 ngày một lần, khung gửi 7:00–21:00, khoá sau 5 lần sai mật khẩu. **Số minh hoạ:** tên người, giờ các lớp, doanh thu, tỉ lệ chuyên cần, số việc chờ, mã biên lai | Số minh hoạ gắn nhãn *minh hoạ* ở báo cáo | · |
| **◆** Thu tiền không đảo ngược *(biên lai đã in)* | Hộp thoại "Thu 1.680.000 ₫ tiền mặt cho …?", nút **Thu tiền và in biên lai**; bấm hai lần chỉ ghi một khoản *(A-09)*: nút sang đang tải. Lỗi: "Chưa ghi được khoản thu vì mất kết nối. Chưa có tiền nào được ghi, bấm Thử lại." | Cần huỷ biên lai: thêm luồng huỷ có quản lý duyệt và nhật ký |
| **◆** Huỷ buổi do sự cố *(A-03)* huỷ nhiều buổi một lần và gửi thông báo khẩn ngay, không thu hồi được | Xem trước: n buổi, m học viên, m phụ huynh nhận tin; nút đỏ ghi số **Huỷ 7 buổi và báo phụ huynh**; không bắt gõ lại chữ. Lỗi: buổi nào chưa huỷ được thì liệt kê, các buổi khác giữ kết quả | Lỡ tay quá nhiều lần: thêm bước gõ số buổi để xác nhận |
| Gửi thông báo ngay không thu hồi được | Xem trước số người nhận trước khi gửi | · |
| Bảo lưu chỉ một lần mỗi gói *(`BR-TT-05`)* | Hộp thoại nêu hạn mới và "Gói này chỉ bảo lưu được một lần" | · |
| Báo nghỉ trên app: tài liệu không nói phụ huynh rút lại được không | Không rút lại trên app; muốn rút thì gọi quầy *(ghi ở sheet kết quả)*. Trước khi gửi, sheet nói rõ buổi này có bị trừ không và đã dùng mấy/3 lần | Cần rút lại: thêm nút **Rút lại báo nghỉ** tới trước giờ học |
| Lưu điểm danh sửa được 24 giờ *(`BR-DD-05`)* | Không hộp thoại xác nhận; quá 24 giờ chỉ quản lý sửa, bắt ghi lý do | · |
| UC-01 có *giới tính* nhưng `schema.dbml` không có cột | Form có trường giới tính | Bỏ trường nếu schema thắng |
| `schema.dbml` có trạng thái `da_hoc_bu` nhưng không có quy tắc học bù | Chỉ hiện trạng thái trong lịch sử buổi, không vẽ luồng xếp học bù | Có luồng học bù: thêm lớp phủ ở hồ sơ học viên |
| Phụ huynh tắt được nhắc lịch, không tắt được thông báo khẩn *(`BR-TB-04` 🟡)*; schema chưa có cột lưu lựa chọn | Công tắc nhắc lịch ở Tài khoản; dòng khẩn ghi "luôn bật" | · |
| Câu hỏi mở `OQ-01` *(hoàn tiền khi tự nghỉ)* · `OQ-02` *(lên cấp có thu chênh lệch)* · `OQ-03` *(HLV xem SĐT phụ huynh)* | Không vẽ luồng hoàn tiền tự nghỉ, chỉ ghi chú hồ sơ *(A-08)*; lên cấp giữ số buổi, không thu thêm; màn HLV ẩn SĐT phụ huynh | Chủ trung tâm chốt khác: thêm luồng hoặc thêm cột |
| HLV dùng máy tính bảng ngang ~1024 × 768, tay ướt | Màn Điểm danh vùng chạm ≥ 48, ba nút trạng thái mỗi dòng cách nhau ≥ 8 | Máy dọc 768: danh sách buổi thu thành thanh chọn trên đầu |

## 🛑 Cổng 3 · Design system, sơ đồ trang, phạm vi — *(sketch-to-site, chưa hỏi)*
**Hai trường hợp khó nhất với concept (B1):**
1. **Lưới lịch giờ cao điểm** *(A1 Lịch tuần, bảng dày nhất)*: thứ Hai 17:30, đủ 6 làn và bể trẻ em đều có lớp; một lớp 10/10 kèm 3 bé chờ, một buổi huỷ do sự cố, một buổi HLV dạy thay, tên HLV dài nhất; ở 1440 và ở máy tính bảng 1024. Câu cần trả lời: ô lớp có giữ được cấp độ, sĩ số, vạch chỗ trống và trạng thái mà không tràn, và cả tuần có vào được một lưới không.
2. **Màn Lịch của app ở 390** *(P1, màn của bề mặt khác)*: phụ huynh có 2 con, bé có tên dài nhất; buổi gần nhất bị trung tâm huỷ *(+1 buổi bù)*, một buổi đã báo nghỉ muộn *(bị trừ)*, một buổi HLV dạy thay; kèm trạng thái rỗng *(chưa có gói, UC-06 1a)*. Câu cần trả lời: ẩn dụ làn bơi *(vạch chia làn là đường kẻ của bảng lịch)* có còn đọc ra khi lưới thành danh sách một cột không. `CONCEPT.md` mục 1 tự chấm đây là chỗ yếu.

**Thử concept ở B1:** chưa thử. Lần chạy này dừng trước phần design system của B2 *(theo yêu cầu)*: `site/_system.html` chưa dựng hai trường hợp trên, chưa chạy `system-check.mjs`. Dự đoán trên giấy, chưa kiểm: giữ được ở A1 *(ẩn dụ sinh ra từ chính lưới làn)* · dễ gãy ở P1 *(một cột, không còn làn)* và ở chế độ Tuần của A1 *(49 cột)*.
**Đáp án design system và sơ đồ trang (nguyên văn):**
**Phạm vi (nguyên văn):** *(đề xuất ở `DESIGN.md` mục 9, cuối mục)*
**Chỗ concept gãy (nếu có, nguyên văn):**
**Sửa theo yêu cầu:**
