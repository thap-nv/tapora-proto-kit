# CÂU HỎI CHO BA — lượt cập nhật schema v1.1 (nhu cầu N-01 → N-20)

> Sinh từ lượt phản biện 12 rule `DB-REQ` trên `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md`. Mã `Q-nn` tiếp theo `Q-01`, `Q-02` của `DATA-DICTIONARY.md` mục 2. **CHẶN** = không dựng được phần mô hình đó nếu thiếu đáp án — chưa dựng bảng nào cho các câu này. **Không chặn** = đã đi tiếp với giả định 🔴 A ghi ở dòng giả định.
> Câu về chính sách nghiệp vụ nêu các hướng và hệ quả, không gắn khuyến nghị. Câu về thiết kế hệ thống có khuyến nghị.

| Mã | Nhu cầu | Loại | Mức |
|---|---|---|---|
| Q-03 | N-02 | mơ hồ | không chặn |
| Q-04 | N-16 (đụng R-04, N-02) | mâu thuẫn | **CHẶN** |
| Q-05 | N-14 (đụng R-09) | trái quy định | **CHẶN** |
| Q-06 | N-17 | thiếu | **CHẶN** |
| Q-07 | N-18 | thiếu | **CHẶN** |
| Q-08 | N-20 (đụng R-10) | trái quy định | **CHẶN** |
| Q-09 | N-09 (đụng R-12, N-13) | mâu thuẫn | **CHẶN** (phần trigger chuyển trạng thái) |
| Q-10 | N-09, N-10 | mơ hồ | không chặn |
| Q-11 | N-05, N-13 | thiếu | không chặn |
| Q-12 | N-19 | ra lệnh giải pháp | không chặn |
| Q-13 | N-07 | mơ hồ | không chặn |
| Q-14 | N-04 | dị thường dữ liệu | không chặn |
| Q-15 | N-08 | mơ hồ | không chặn |
| Q-16 | N-07, N-15 | trái quy định | không chặn |
| Q-17 | N-01 | mơ hồ | không chặn |

---

## Câu CHẶN

**Q-04 · mâu thuẫn · CHẶN**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:22` — "Ca khám nhóm (tư vấn gia đình) có từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn." · `YEU-CAU-PHONG-KHAM.md:10` — "Mỗi lịch hẹn có đúng một bác sĩ phụ trách."
Hệ quả nếu giữ nguyên: `appointments.doctor_id` là một cột đơn và N-02 (bác sĩ không trùng giờ) đang cưỡng chế bằng EXCLUDE ngay trên cột này; bác sĩ thứ hai của ca nhóm không được bảo vệ khỏi trùng giờ, và mọi báo cáo theo bác sĩ (R-11) chỉ thấy bác sĩ chính.
Hướng (a) R-04 giữ cho mọi ca; ca nhóm = mỗi bác sĩ một lịch hẹn cùng giờ, nối bằng mã nhóm (gia đình 3 người, 2 bác sĩ → 2 lịch hẹn, N-02 áp nguyên) · (b) R-04 đổi thành "một hoặc nhiều": thêm bảng bác sĩ–lịch hẹn kèm khoảng giờ để EXCLUDE chạy theo từng bác sĩ, `doctor_id` cũ thành bác sĩ chính hoặc bỏ · (c) `doctor_id` là bác sĩ chính, bác sĩ phụ chỉ ghi nhận, không chống trùng giờ.
Cần chốt: R-04 có đổi không; ca nhóm tính doanh thu (R-11) và tiết cho bác sĩ nào.

**Q-05 · trái quy định · CHẶN**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:20` — "hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ" · `YEU-CAU-PHONG-KHAM.md:15` — "mật khẩu không bao giờ lưu nguyên văn."
Hệ quả nếu giữ nguyên: hai câu loại trừ nhau. Lưu đọc được thì một lần lộ CSDL là lộ mật khẩu của mọi bác sĩ, mà người ta hay dùng lại mật khẩu ở chỗ khác. Chưa dựng gì; `users.password_hash` giữ nguyên.
Hướng (a) bỏ N-14, viết lại thành nhu cầu thật "bác sĩ quên mật khẩu vẫn vào được": quản trị viên bấm gửi liên kết đặt lại dùng một lần, hết hạn sau ví dụ 30 phút (thêm bảng token băm) · (b) quản trị viên đặt mật khẩu tạm, buộc đổi ở lần đăng nhập đầu (một cột trên `users`) · (c) sửa R-09 cho phép lưu đọc được.
Cần chốt: chọn (a), (b) hay (c). Khuyến nghị (thiết kế hệ thống): (a) — không ai, kể cả quản trị viên, nhìn thấy mật khẩu.

**Q-06 · thiếu · CHẶN**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:23` — "Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau."
Hệ quả nếu giữ nguyên: requirement đã chốt (R-01 → R-12) không có phẫu thuật. Không có thực thể ca phẫu thuật, không có giờ bắt đầu và kết thúc, `rooms` mô tả "phòng khám bệnh" (R-06) chưa nói phòng mổ — không có gì để so nên không cưỡng chế được "không trùng".
Hướng (a) phẫu thuật là một loại lịch hẹn, có thêm phòng (`room_id`) · (b) bảng riêng `surgeries` (bệnh nhân, bác sĩ mổ, phòng mổ, giờ bắt đầu và kết thúc, trạng thái) + EXCLUDE theo phòng · (c) để ngoài giai đoạn 2.
Cần chốt: phẫu thuật có trong phạm vi không; phòng mổ có phải một dòng của `rooms`; ca mổ do ai thực hiện; ví dụ ca 09:00–11:30 và ca 11:00–12:00 cùng phòng có bị chặn không (theo N-17 thì có).

**Q-07 · thiếu · CHẶN**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:24` — "Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân để lễ tân nhìn thấy ngay."
Hệ quả nếu giữ nguyên: requirement đã chốt không có gói trị liệu (không bán gói, không trừ buổi). Một cột đếm trên bệnh nhân sẽ lệch khi lịch hẹn bị hủy, đổi hay sửa tay (DB-REQ-06). Chưa thêm cột nào.
Hướng (a) gói là một dòng mua (bệnh nhân, dịch vụ, tổng số buổi, ngày mua, hạn dùng), mỗi lịch hẹn đã khám trừ một buổi, "còn lại" = tổng − số buổi đã trừ, tính ra khi hiển thị · (b) lưu số còn lại và trừ bằng trigger — đọc nhanh nhưng lệch nếu có ai sửa lịch hẹn ngoài đường trừ.
Cần chốt: gói bán thế nào (ví dụ gói 10 buổi giá 3.000.000 đ); buổi nào được trừ (đã đến hay đã khám xong); gói có hạn không; hoàn tiền phần buổi chưa dùng không. Khuyến nghị (thiết kế hệ thống): (a), khoảng 10 buổi mỗi gói thì tính ra không tốn.

**Q-08 · trái quy định · CHẶN**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:26` — "Lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) để nhận diện khi đến khám; giữ vô thời hạn; mọi lễ tân đều xem được." · `YEU-CAU-PHONG-KHAM.md:16` — "Lễ tân chỉ thấy dữ liệu phòng khám của mình"
Hệ quả nếu giữ nguyên: ảnh khuôn mặt dùng để nhận diện là dữ liệu sinh trắc, của cả trẻ em, giữ không hạn, mở cho mọi lễ tân kể cả chi nhánh khác (đụng R-10); lộ một lần thì không đổi lại được như mật khẩu. Chưa dựng gì.
Hướng (a) không lưu ảnh: nhận diện bằng mã hồ sơ, số điện thoại, ngày sinh · (b) lưu ảnh có đồng ý bằng văn bản (trẻ em: người bảo hộ đồng ý), có hạn lưu và xóa thật (ví dụ 12 tháng sau lần khám cuối), chỉ lễ tân phòng khám có lịch hẹn của bệnh nhân xem được, mỗi lần xem ghi log, tệp ảnh để ở kho tệp mã hóa chứ không nằm trong bảng · (c) giữ nguyên như N-20.
Cần chốt: "nhận diện" là người nhìn ảnh hay máy so khuôn mặt; ai xem; giữ bao lâu; xóa thật thế nào khi bệnh nhân yêu cầu. Khuyến nghị (thiết kế, bảo mật): (a); nếu bắt buộc phải có ảnh thì (b).

**Q-09 · mâu thuẫn · CHẶN (chỉ phần trigger chuyển trạng thái; ba giá trị enum mới đã thêm)**
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:15` — "từ đã đặt có thể sang đã xác nhận hoặc đã hủy" (không có "đã xác nhận → đã hủy") · `YEU-CAU-PHONG-KHAM.md:18` — "Bệnh nhân hủy lịch trước giờ hẹn 2 tiếng thì không tính phí." · `NHU-CAU-DU-LIEU-MOI.md:19` — "lịch hẹn tương lai của người đó thì tự hủy".
Hệ quả nếu giữ nguyên: nếu trigger cấm mọi đường không được liệt kê thì lịch đã xác nhận không hủy được — bệnh nhân gọi hủy trước 2 tiếng (R-12) hay ẩn bệnh nhân (N-13) đều bị chặn. Chưa viết trigger; `Note` của `appointments` ghi máy trạng thái và đánh dấu chờ câu này.
Hướng (a) thêm "đã xác nhận → đã hủy" · (b) giữ N-09 đúng chữ: lịch đã xác nhận chỉ đi tới "đã đến" hoặc "vắng mặt", muốn hủy phải đi qua "vắng mặt" · (c) từ "đã đặt" và "đã xác nhận" đều tới "đã hủy" được trước giờ hẹn.
Cần chốt: chọn một hướng; "đã đến", "vắng mặt", "đã hủy" có đường ra không (ví dụ bệnh nhân đã đến rồi bỏ về thì ghi gì).

---

## Câu không chặn

**Q-03 · mơ hồ · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:8` — "Mỗi lịch hẹn có giờ bắt đầu và giờ kết thúc." (đóng `Q-02` của từ điển)
Giả định 🔴 A: lịch hẹn cũ chưa có giờ kết thúc được điền `starts_at + 30 phút`; hai lịch chỉ coi là trùng khi cả hai còn giữ chỗ (đã hủy và vắng mặt không giữ); lịch liền kề (kết thúc 9:00, bắt đầu 9:00) không trùng.
Hệ quả nếu sai: lịch cũ thực tế chỉ 15 phút mà điền 30 thì lịch 9:00 và 9:15 của cùng bác sĩ thành "trùng", ràng buộc không thêm được cho tới khi nhân viên sửa tay từng cặp; cần BA cho độ dài thật hoặc cách điền.

**Q-10 · mơ hồ · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:15` (năm trạng thái, không có "đã khám xong") · `:16` — "tổng số lần khám đã hoàn thành" · `YEU-CAU-PHONG-KHAM.md:14` — "Mỗi lịch hẹn đã khám có một hóa đơn".
Giả định 🔴 A: giữ `done` của v1.0 là "đã khám xong" (đi tiếp từ "đã đến"); "đã đến" chỉ là bệnh nhân có mặt; N-10 đếm các lịch hẹn `done`, không lưu cột.
Hệ quả nếu sai: nếu "đã đến" thực ra là đã khám xong thì `done` thừa — phải bỏ `done`, đổi các dòng `done` cũ thành `arrived` và đếm N-10 theo `arrived` (một lần chuyển dữ liệu).

**Q-11 · thiếu · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:11` — "Lịch hẹn có thể kèm một khoản đặt cọc bằng tiền, ghi ngày nhận cọc." · `:19` — "lịch hẹn tương lai của người đó thì tự hủy" · `YEU-CAU-PHONG-KHAM.md:18`.
Giả định 🔴 A: chỉ ghi nhận số tiền và ngày nhận, tối đa một khoản mỗi lịch hẹn; chưa nối với `payments`, tổng hóa đơn không trừ cọc; hủy lịch không tự hoàn cọc; lịch bị hệ thống tự hủy do ẩn bệnh nhân không tính phí.
Hệ quả nếu sai: cọc 200.000 đ, hóa đơn 500.000 đ — chưa biết quầy thu 300.000 đ hay 500.000 đ; bệnh nhân hủy trước 2 tiếng thì cọc hoàn hay mất chưa có quy tắc. Cần thêm đường trừ cọc, hoàn cọc (dòng tiền mới) và có thể cho nhiều khoản cọc mỗi lịch hẹn.

**Q-12 · ra lệnh giải pháp · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:25` — "Mỗi chi nhánh có bảng lịch hẹn riêng (`appointments_hn`, `appointments_hcm`, `appointments_dn`) để báo cáo từng chi nhánh chạy nhanh."
Giả định 🔴 A: không tách bảng; nhu cầu thật là báo cáo từng chi nhánh chạy nhanh, đã có index `(organization_id, clinic_id, starts_at)`. Ước lượng theo `Q-01` (chưa đo): 2.000 lịch hẹn mỗi ngày ≈ 730.000 dòng mỗi năm, khoảng 3,7 triệu dòng sau 5 năm cho cả ba chi nhánh — một bảng chạy được; vượt chục triệu thì phân vùng theo `starts_at`. Khuyến nghị (thiết kế hệ thống): giữ một bảng.
Hệ quả nếu sai: ba bảng riêng buộc báo cáo toàn chuỗi (R-11) phải UNION ba bảng, mở chi nhánh thứ tư là thêm bảng và sửa mọi truy vấn, đổi chi nhánh của một lịch hẹn là chuyển dòng giữa hai bảng.

**Q-13 · mơ hồ · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:13` — "tên chất, mức độ nặng/nhẹ; lễ tân tra được bệnh nhân theo từng chất gây dị ứng".
Giả định 🔴 A: tên chất gõ tự do, tra không phân biệt hoa thường; mức độ chỉ hai bậc nhẹ và nặng.
Hệ quả nếu sai: "Penicillin", "Penixilin", "penicilin" là ba chất khác nhau với CSDL nên tra theo chất có thể sót bệnh nhân dị ứng. Nếu cần tra chắc chắn thì thêm danh mục chất do quản trị viên quản lý, lễ tân chọn từ danh sách; nếu cần bậc "trung bình" thì thêm giá trị enum.

**Q-14 · dị thường dữ liệu · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:10` — "mã của hồ sơ đã ẩn được cấp lại cho người khác".
Giả định 🔴 A: mã sinh ở ứng dụng; duy nhất chỉ trong số hồ sơ chưa ẩn; các bảng khác nối bằng `id`, không nối bằng mã.
Hệ quả nếu sai: phiếu in hay tin nhắn cũ ghi mã của người A, mã cấp lại cho người B thì tra mã trên giấy cũ ra nhầm người; hồ sơ bị ẩn rồi được bỏ ẩn mà mã đã có chủ mới thì đụng unique — phải cấp mã khác cho hồ sơ vừa khôi phục.

**Q-15 · mơ hồ · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:14` — "do quản trị viên tự thêm hoặc bớt trên màn hình quản trị".
Giả định 🔴 A: "bớt" = ẩn khỏi danh mục (`is_active = false`); bác sĩ đã gắn vẫn giữ dòng nối; tên chuyên khoa không trùng nhau trong tổ chức, không phân biệt hoa thường.
Hệ quả nếu sai: nếu "bớt" là xóa hẳn thì phải chốt bác sĩ đang gắn chuyên khoa đó bị gỡ theo hay hệ thống chặn không cho xóa.

**Q-16 · trái quy định · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:13` (dị ứng) · `:21` (bảo hiểm) · `YEU-CAU-PHONG-KHAM.md:16` — "Lễ tân chỉ thấy dữ liệu phòng khám của mình".
Giả định 🔴 A: dị ứng và bảo hiểm sống cùng hồ sơ bệnh nhân (ẩn theo bệnh nhân), chưa có hạn lưu hay xóa thật riêng, chưa có nhật ký truy cập; lễ tân tra theo chất chỉ thấy bệnh nhân có lịch hẹn ở phòng khám của mình (R-10). Không chặn vì mục đích và người xem đã nằm trong chính câu của N-07 và hồ sơ bệnh nhân v1.0 vốn đã giữ dữ liệu sức khỏe không hạn lưu — BA nâng lên CHẶN nếu muốn áp DB-REQ-09 chặt hơn.
Hệ quả nếu sai: bệnh nhân yêu cầu xóa dữ liệu mà không có đường xóa thật; tra dị ứng trên toàn tổ chức cho lễ tân mọi phòng khám là trái R-10; thêm hạn lưu sau này là thêm cột đánh dấu xóa thật và job xóa.

**Q-17 · mơ hồ · không chặn** · Nguồn: `NHU-CAU-DU-LIEU-MOI.md:7` — "Hóa đơn phải in đúng giá dịch vụ lúc khám, dù sau đó bảng giá đổi."
Giả định 🔴 A: hóa đơn lập ngay khi khám xong; giá chép vào `invoice_lines` ở thời điểm lập. Hóa đơn đã phát hành trước v1.1 không còn giá lịch sử nên dựng `invoice_lines` từ giá hiện hành.
Hệ quả nếu sai: nếu hóa đơn lập vài ngày sau khám và giá đổi ở giữa thì in ra giá mới, không phải giá lúc khám; khi đó phải chốt giá sớm hơn (lúc bệnh nhân đến hoặc lúc đặt lịch) và chép vào `appointment_services`. In lại hóa đơn cũ có thể ra giá khác giá đã in lúc đó.
