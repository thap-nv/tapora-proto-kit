# CÂU HỎI CHO BA — schema v1.1 (nhu cầu dữ liệu giai đoạn 2)

> Sổ câu hỏi của lượt cập nhật schema 07/10. Nguồn nhu cầu: `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20); requirement đã chốt: `1-yeu-cau/YEU-CAU-PHONG-KHAM.md` (R-01 → R-12). Q-01, Q-02 ở `DATA-DICTIONARY.md` mục 2 — Q-02 (lịch hẹn dài bao lâu) đóng nhờ N-02.
>
> **CHẶN** = phần đó chưa dựng, chờ đáp án. **Không chặn** = đã dựng theo giả định 🔴 A ghi dưới; sai thì sửa như dòng "hệ quả".

| Mã | Nhu cầu | Loại | Chặn? |
|---|---|---|---|
| Q-03 | N-14 | trái quy định | **CHẶN** |
| Q-04 | N-16 | mâu thuẫn | **CHẶN** |
| Q-05 | N-17 | không cưỡng chế được | **CHẶN** |
| Q-06 | N-18 | thiếu · ra lệnh giải pháp | **CHẶN** |
| Q-07 | N-20 | trái quy định | **CHẶN** |
| Q-08 | N-09 · N-10 · N-13 | mâu thuẫn | không chặn |
| Q-09 | N-01 · N-02 · N-04 · N-11 | thiếu | không chặn |
| Q-10 | N-02 | thiếu | không chặn |
| Q-11 | N-01 | thiếu | không chặn |
| Q-12 | N-03 | thiếu | không chặn |
| Q-13 | N-04 | cản mở rộng | không chặn |
| Q-14 | N-05 | thiếu | không chặn |
| Q-15 | N-06 | thiếu | không chặn |
| Q-16 | N-07 | thiếu | không chặn |
| Q-17 | N-15 | thiếu | không chặn |
| Q-18 | N-19 | ra lệnh giải pháp | không chặn |
| Q-19 | N-12 | thiếu | không chặn |

## Câu chặn — chưa dựng bảng

**Q-03 · trái quy định · CHẶN** — N-14
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:20` — "hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ" ↔ `YEU-CAU-PHONG-KHAM.md:15` R-09 — "mật khẩu không bao giờ lưu nguyên văn".
Hệ quả nếu giữ nguyên (Q-03): lộ một bản sao CSDL là lộ mật khẩu mọi bác sĩ, kể cả nơi khác họ dùng lại mật khẩu đó; phá R-09 đã chốt. Phần "đăng nhập bằng email và mật khẩu" đã có ở `users` (role doctor), không cần thêm gì.
Hướng Q-03 *(thiết kế hệ thống — có khuyến nghị)*: (a) **khuyến nghị** — quản trị viên bấm "đặt lại", hệ thống gửi link dùng một lần, hạn 30 phút, tới email bác sĩ; cần bảng `password_reset_tokens` (user_id, token_hash, expires_at, used_at) · (b) quản trị viên đặt mật khẩu tạm, bác sĩ buộc đổi ở lần đăng nhập đầu; cần cột `users.must_change_password`.
Cần chốt: bỏ việc lưu mật khẩu đọc được; chọn (a) hay (b) — chốt xong mới dựng.

**Q-04 · mâu thuẫn · CHẶN** — N-16
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:22` — "từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn" ↔ `YEU-CAU-PHONG-KHAM.md:10` R-04 — "Mỗi lịch hẹn có đúng một bác sĩ phụ trách."
Hệ quả nếu giữ nguyên (Q-04): không ghi được bác sĩ thứ hai; thêm bảng nối mà không đổi R-04 thì có hai nguồn "bác sĩ của lịch hẹn", và chống trùng N-02 chỉ phủ `appointments.doctor_id` — ca tư vấn 9:00–10:00 (BS A chính, BS B phụ) không chặn được lịch riêng 9:30 của BS B. "Từ hai trở lên" không viết được bằng CHECK, cần trigger kiểm cuối giao dịch.
Hướng Q-04: (a) giữ `appointments.doctor_id` là bác sĩ chính (R-04 đọc lại thành "đúng một bác sĩ chính"), thêm `appointment_doctors` cho bác sĩ phụ và dời chống trùng sang một bảng lịch bận chung của bác sĩ · (b) bỏ `appointments.doctor_id`, mọi bác sĩ ở bảng nối — migration phá vỡ, mọi truy vấn và báo cáo doanh thu theo bác sĩ (R-11) viết lại.
Cần chốt: R-04 có đổi không; doanh thu ca nhóm 1 triệu đồng với hai bác sĩ tính cho ai trong báo cáo R-11 (cả hai 1 triệu · mỗi người 500 nghìn · chỉ bác sĩ chính).

**Q-05 · không cưỡng chế được · CHẶN** — N-17
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:23` — "Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau." Schema và R-01 → R-12 không có "ca phẫu thuật" lẫn "phòng mổ": `rooms` là phòng khám bệnh (R-06), `appointments` không gắn phòng.
Hệ quả nếu dựng đoán (Q-05): EXCLUDE chỉ so được cột trong cùng bảng — gắn phòng vào lịch hẹn rồi chặn trùng phòng thì chặn luôn phòng khám thường (hai bác sĩ chung phòng 201 lúc 9:00 bị từ chối), trừ khi chép loại phòng vào từng lịch hẹn.
Hướng Q-05 *(thiết kế — có khuyến nghị)*: (a) phẫu thuật là một loại lịch hẹn: `rooms.room_type` + `appointments.room_id` + loại phòng chép vào lịch hẹn để EXCLUDE chỉ lọc phòng mổ · (b) **khuyến nghị** — bảng `surgeries` riêng (operating_room_id, starts_at, ends_at, appointment_id) có EXCLUDE trên chính nó.
Cần chốt: ca phẫu thuật có thuộc một lịch hẹn và có đúng một bác sĩ (R-04) không; phòng nào là phòng mổ; khoảng chặn có gồm thời gian dọn phòng không (ví dụ ca 8:00–10:00 + 30 phút dọn → ca sau sớm nhất 10:30).

**Q-06 · thiếu · ra lệnh giải pháp · CHẶN** — N-18
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:24` — "Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân". Schema và R-01 → R-12 chưa có "gói trị liệu".
Hệ quả nếu giữ nguyên (Q-06): một con số trên `patients` lệch ngay khi sửa sai — gói 10 buổi, đã dùng 4, lưu "còn 6"; lễ tân hủy một lịch hẹn đã trừ nhầm, số vẫn 6 trong khi thật là 7 — và vô nghĩa khi bệnh nhân có hai gói cùng lúc.
Hướng Q-06 *(thiết kế — có khuyến nghị)*: (a) **khuyến nghị** — `patient_packages` (tổng buổi, hạn dùng) + bảng ghi buổi đã dùng gắn lịch hẹn; số còn lại = tổng − đã dùng, tính ra, có index nên lễ tân thấy ngay · (b) lưu số còn lại trên từng gói (không trên `patients`), đồng bộ bằng trigger cùng giao dịch.
Cần chốt *(chính sách — không khuyến nghị)*: gói gồm những gì; buổi bị trừ khi nào (đặt lịch · đến · khám xong); hủy hay vắng mặt có hoàn buổi không; gói có hạn dùng không; một bệnh nhân có nhiều gói cùng lúc không.

**Q-07 · trái quy định · CHẶN** — N-20
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:26` — "Lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) … giữ vô thời hạn; mọi lễ tân đều xem được" ↔ `YEU-CAU-PHONG-KHAM.md:16` R-10 — "Lễ tân chỉ thấy dữ liệu phòng khám của mình".
Hệ quả nếu giữ nguyên (Q-07): dữ liệu sinh trắc học (nhạy cảm theo Nghị định 13/2023/NĐ-CP và văn bản thay thế — pháp chế xác nhận bản hiện hành) của trẻ em, không có đồng ý của người bảo hộ, không hạn lưu, mở cho lễ tân mọi phòng khám — trái R-10 và trái nguyên tắc lưu theo mục đích.
Hướng Q-07: (a) không lưu ảnh, nhận diện bằng mã hồ sơ (N-04) hoặc mã QR · (b) lưu ảnh có văn bản đồng ý (trẻ em: người bảo hộ ở `guardianships` ký), hạn lưu có số (ví dụ xóa 24 tháng sau lần khám cuối), chỉ lễ tân phòng khám có lịch hẹn của bệnh nhân xem; ảnh ở kho file mã hóa, CSDL chỉ giữ khóa đối tượng · (c) chỉ lưu vector đặc trưng khuôn mặt, không lưu ảnh.
Cần chốt: mục đích, ai xem, giữ bao lâu, xóa thế nào, ai ký đồng ý cho trẻ em.

## Câu không chặn — đã dựng theo giả định

**Q-08 · mâu thuẫn · không chặn** — N-09, N-10, N-13
🔴 A (Q-08): giữ `done` ("đã khám" của R-08 — N-09 không liệt kê) với `arrived → done`; N-10 đếm `done`; `confirmed → cancelled` chỉ do hệ thống khi ẩn bệnh nhân (N-13 hủy cả lịch đã xác nhận, N-09 chỉ cho hủy từ `booked`); bệnh nhân tự hủy lịch đã xác nhận (R-12 "hủy trước giờ hẹn 2 tiếng") chưa có đường.
Hệ quả nếu sai: "đã đến" = "đã khám" thì gộp `done` vào `arrived` (đổi dữ liệu cũ, N-10 đếm `arrived`); cho bệnh nhân hủy lịch đã xác nhận thì chỉ sửa trigger trạng thái, không đổi bảng.

**Q-09 · thiếu · không chặn** — N-01, N-02, N-04, N-11
🔴 A (Q-09): dữ liệu cũ được điền trước khi bật NOT NULL — `unit_price` = giá hiện hành (giá lịch sử đã mất) · `ends_at` = `starts_at` + thời lượng mặc định BA cho · `record_code`, `services.code` sinh theo quy tắc BA cho; lịch cũ chồng nhau phải liệt kê và gỡ trước khi tạo EXCLUDE.
Hệ quả nếu sai: hóa đơn in lại của lịch hẹn cũ ra giá mới; migration dừng ở bước tạo ràng buộc.

**Q-10 · thiếu · không chặn** — N-02
🔴 A: lịch đã hủy và vắng mặt nhả chỗ bác sĩ; mọi trạng thái khác giữ chỗ.
Hệ quả nếu sai: chỉ đổi mệnh đề WHERE của EXCLUDE.

**Q-11 · thiếu · không chặn** — N-01
🔴 A: "giá lúc khám" = giá tại thời điểm dòng dịch vụ được ghi vào lịch hẹn; đặt lịch trước rồi đổi giá trước ngày khám thì nhân viên xóa và ghi lại dòng.
Hệ quả nếu sai: chốt giá lúc lập hóa đơn thì đổi thời điểm chép, không đổi cột.

**Q-12 · thiếu · không chặn** — N-03
🔴 A (Q-12): thêm `ends_on` để kết thúc bảo hộ (đủ 18 tuổi, đổi người bảo hộ); không lưu loại quan hệ (cha, mẹ, người giám hộ); dữ liệu bảo hộ của trẻ em đọc theo R-10, giữ theo hồ sơ bệnh nhân.
Hệ quả nếu sai: cần loại quan hệ thì thêm một cột; cần hạn lưu riêng thì thêm việc xóa định kỳ.

**Q-13 · cản mở rộng · không chặn** — N-04
🔴 A: làm đúng N-04 — mã hồ sơ đã ẩn cấp lại được (unique một phần, chỉ trên hồ sơ chưa ẩn).
Hệ quả: khôi phục hồ sơ đã ẩn mà mã đã cấp cho người khác thì bị từ chối; giấy tờ cũ in mã BN-0042 có thể trỏ sang người mới — muốn tránh thì không cấp lại mã (đổi thành unique thường).

**Q-14 · thiếu · không chặn** — N-05
🔴 A: chỉ ghi nhận cọc (số tiền, ngày nhận), mỗi lịch hẹn tối đa một khoản; chưa dựng tất toán.
Hệ quả nếu sai: cọc trừ vào hóa đơn, hoàn khi hủy trước 2 tiếng (R-12) hay mất khi vắng mặt / khi lịch tự hủy vì ẩn bệnh nhân (N-13) — mỗi hướng cần cột hay bảng tất toán riêng.

**Q-15 · thiếu · không chặn** — N-06
🔴 A: người viết sửa được nội dung, không giữ bản cũ; xóa là ẩn; chỉ nhân viên xem.
Hệ quả nếu sai: cần lịch sử sửa thì thêm bảng phiên bản ghi chú.

**Q-16 · thiếu · không chặn** — N-07
🔴 A (Q-16): chất gây dị ứng là danh mục (`allergens`), lễ tân và quản trị viên thêm được; mức độ hai bậc nhẹ / nặng như N-07; dị ứng là dữ liệu sức khỏe, đọc theo R-10, giữ theo hồ sơ bệnh nhân, chưa có hạn lưu bằng số, đường xóa thật hay log "ai đã xem".
Hệ quả nếu sai: thêm bậc (ví dụ "vừa") là thêm giá trị enum; nhập tự do thì mất khả năng tra theo chất; cần hạn lưu hay log truy cập thì thêm việc xóa định kỳ và bảng log đọc.

**Q-17 · thiếu · không chặn** — N-15
🔴 A (Q-17): đổi thẻ bảo hiểm thì ghi đè, không giữ thẻ cũ; `card_number` không đặt UNIQUE vì N-15 không đòi và hai nhà bảo hiểm có thể cấp trùng số.
Hệ quả nếu sai: hóa đơn cũ cần đối chiếu thẻ cũ thì chuyển sang bảng nhiều dòng có khoảng hiệu lực; cần chặn nhập trùng thì thêm unique (organization_id, insurer_name, card_number).

**Q-18 · ra lệnh giải pháp · không chặn** — N-19
🔴 A (Q-18): không tách `appointments_hn`, `appointments_hcm`, `appointments_dn`; chi nhánh là dòng `clinics`, báo cáo từng chi nhánh đi index có sẵn của `appointments` (organization_id, clinic_id, starts_at); lớn hơn nữa thì phân vùng theo tháng của starts_at.
Hệ quả nếu tách bảng: thêm chi nhánh thứ tư phải sửa code và schema; báo cáo toàn chuỗi phải UNION; khóa ngoại từ hóa đơn không trỏ được ba bảng.

**Q-19 · thiếu · không chặn** — N-12
🔴 A (Q-19): tra hóa đơn theo bệnh nhân đi qua lịch hẹn (hai lần dò index), không chép patient_id vào hóa đơn.
Hệ quả nếu sai (Q-19): cần lọc, sắp hóa đơn theo bệnh nhân trên toàn lịch sử mà không qua lịch hẹn thì thêm `invoices.patient_id` kèm FK ghép (appointment_id, patient_id) để không lệch.

## Nợ cũ trên phần vừa sửa — để lại, có lý do

- **DB-INT-05 `appointments.doctor_id`** (khóa ngoại chưa khai hành vi xóa) — để lại. Mặc định NO ACTION đã chặn xóa bác sĩ còn lịch hẹn, tương đương restrict cho N-02; đổi khóa ngoại của bảng có dữ liệu là migration BA chưa duyệt. Đề xuất: một đợt dọn nợ khai `delete: restrict` cho mọi khóa ngoại cũ cùng lúc.
- **DB-INT-05 `invoices.appointment_id`** (bảng được thêm index cho N-12) — để lại cùng lý do: NO ACTION đã chặn xóa lịch hẹn còn hóa đơn, đủ cho N-13. Cùng đợt dọn nợ trên; đợt đó nên xét luôn UNIQUE cho cột này theo R-08 ("mỗi lịch hẹn đã khám có một hóa đơn").
