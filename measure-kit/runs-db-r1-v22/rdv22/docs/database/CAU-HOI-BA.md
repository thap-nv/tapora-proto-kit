# CÂU HỎI CHO BA — lượt cập nhật schema v1.1 (N-01 → N-20)

> Sổ câu hỏi của lượt áp `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` vào `schema.dbml`. BA vắng mặt: câu **CHẶN** thì phần đó **chưa dựng**; câu **không chặn** thì schema đã đi tiếp với giả định 🔴 A ghi ở đây và trong `Note` của bảng. Q-01, Q-02 ở `DATA-DICTIONARY.md` mục 2.

| Mã | Nhu cầu | Loại | Chặn? |
|---|---|---|---|
| Q-03 | N-09 (kéo theo N-10, N-13, R-08, R-12) | mâu thuẫn | CHẶN — máy chuyển trạng thái |
| Q-04 | N-14 | trái quy định | CHẶN |
| Q-05 | N-16 | mâu thuẫn | CHẶN |
| Q-06 | N-17 | không cưỡng chế được | CHẶN |
| Q-07 | N-18 | thiếu | CHẶN |
| Q-08 | N-20 | trái quy định | CHẶN |
| Q-09 | N-01 | mơ hồ | không chặn |
| Q-10 | N-02 | thiếu | không chặn |
| Q-11 | N-04 | dị thường dữ liệu | không chặn |
| Q-12 | N-05 | thiếu | không chặn |
| Q-13 | N-07, N-15 | trái quy định | không chặn |
| Q-14 | N-19 | ra lệnh giải pháp | không chặn |

## Câu chặn

**Q-03 · mâu thuẫn · CHẶN** *(giá trị enum đã thêm; trigger chuyển trạng thái chưa viết đủ)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:15` — "Từ *đã xác nhận* có thể sang *đã đến* hoặc *vắng mặt*; từ *đã đặt* có thể sang *đã xác nhận* hoặc *đã hủy*." · `YEU-CAU-PHONG-KHAM.md:14` R-08 — "Mỗi lịch hẹn đã khám có một hóa đơn" · `:18` R-12 — "hủy lịch trước giờ hẹn 2 tiếng thì không tính phí" · `NHU-CAU:19` N-13 — "lịch hẹn tương lai của người đó thì tự hủy".
Hệ quả nếu giữ nguyên: (1) N-09 không có trạng thái *đã khám xong* — v1.0 có `done`, R-08 và N-10 cần nó để biết lịch nào có hóa đơn, lần khám nào đã hoàn thành; (2) lịch *đã xác nhận* không hủy được — bệnh nhân không hủy được theo R-12, N-13 không tự hủy được lịch đã xác nhận.
Hướng (a) thêm `arrived → done` và `confirmed → cancelled`: lịch 9:00 đã xác nhận, 6:30 bệnh nhân gọi hủy → `cancelled`, không phí · (b) `arrived` là trạng thái cuối nghĩa là đã khám, bỏ `done` (dữ liệu v1.0 đổi `done` → `arrived`) và hủy lịch đã xác nhận phải quay về `booked` trước · (c) giữ đúng N-09: lịch đã xác nhận chỉ kết thúc bằng *đã đến* hoặc *vắng mặt*, N-13 chỉ hủy lịch `booked`.
Cần chốt: trạng thái nào là "đã khám xong"; lịch đã xác nhận có hủy được không — bởi bệnh nhân, và bởi hệ thống khi ẩn hồ sơ.

**Q-04 · trái quy định · CHẶN** *(không dựng)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:20` — "hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ" · `YEU-CAU-PHONG-KHAM.md:15` R-09 (đã chốt) — "mật khẩu không bao giờ lưu nguyên văn".
Hệ quả nếu dựng: mật khẩu đọc lại được nghĩa là lưu nguyên văn hoặc mã hóa thuận nghịch — lộ một bản sao lưu là lộ mật khẩu của mọi bác sĩ (cả tài khoản khác họ dùng chung mật khẩu); quản trị viên biết mật khẩu nên nhật ký không còn chứng minh được ai thao tác.
Hướng (khuyến nghị (a) — câu thiết kế hệ thống): (a) đặt lại bằng liên kết dùng một lần gửi về email bác sĩ, hạn 30 phút; bảng `password_reset_tokens` chỉ lưu bản băm của mã · (b) quản trị viên bấm "đặt lại", hệ thống sinh mật khẩu tạm hiện một lần, bắt đổi ở lần đăng nhập đầu; không lưu nguyên văn.
Cần chốt: chọn (a) hay (b). Nhu cầu "hỗ trợ khi bác sĩ quên" giữ nguyên, chỉ cách làm đổi.

**Q-05 · mâu thuẫn · CHẶN** *(không dựng)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:22` — "Ca khám nhóm … có từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn" · `YEU-CAU-PHONG-KHAM.md:10` R-04 (đã chốt) — "Mỗi lịch hẹn có đúng một bác sĩ phụ trách."
Hệ quả nếu giữ cả hai: `appointments.doctor_id` không thể vừa đúng một vừa nhiều; chặn trùng giờ (N-02) chỉ xét `doctor_id` nên bác sĩ thứ hai của ca nhóm có thể bị đặt trùng; báo cáo doanh thu theo bác sĩ (R-11) không biết ghi hóa đơn cho ai.
Hướng (a) giữ R-04: ca nhóm có một bác sĩ chính ở `doctor_id` + bảng nối bác sĩ phối hợp (chép khoảng giờ để chặn trùng) — ca 1.000.000 đ hai bác sĩ: 1.000.000 đ ghi cho bác sĩ chính · (b) bỏ R-04, mọi bác sĩ ở bảng nối, doanh thu chia đều 500.000 đ mỗi người · (c) như (b) nhưng mỗi bác sĩ được ghi đủ 1.000.000 đ — tổng theo bác sĩ 2.000.000 đ, lớn hơn doanh thu thật.
Cần chốt: R-04 còn hiệu lực không; doanh thu ca nhóm ghi cho ai.

**Q-06 · không cưỡng chế được · CHẶN** *(không dựng)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:23` — "Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau." · `YEU-CAU-PHONG-KHAM.md:12` R-06 chỉ có "phòng khám bệnh (rooms)".
Hệ quả nếu dựng đoán: schema không có ca phẫu thuật, không có phòng mổ, lịch hẹn không gắn phòng — không có dữ liệu nào để chặn trùng; đoán sai thì sai cả bản số.
Hướng (khuyến nghị tùy đáp án — câu thiết kế): (a) ca mổ là một lịch hẹn: `appointments.room_id` + loại lịch hẹn, `rooms.kind` khám/mổ, EXCLUDE theo `room_id` cho lịch loại mổ — hợp nếu ca mổ đặt qua lễ tân như lịch khám · (b) bảng ca mổ riêng (phòng mổ, giờ bắt đầu–kết thúc, kíp mổ) trỏ về lịch hẹn, EXCLUDE trên bảng đó — hợp nếu ca mổ có kíp nhiều người.
Cần chốt: ai đặt ca mổ, bằng đường nào; phòng mổ có phải là một `rooms` không; thời gian dọn phòng giữa hai ca (ví dụ 30 phút) có tính vào khoảng chặn không.

**Q-07 · thiếu · CHẶN** *(không dựng; không lưu số còn lại trên `patients`)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:24` — "Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân". R-01 → R-12 không có gói trị liệu; schema không có bảng gói.
Hệ quả nếu lưu một ô trên `patients`: gói 10 buổi, đã dùng 3, ô ghi 7; lễ tân hủy một buổi đã trừ mà quên cộng lại → ô vẫn 7, đúng là 8; bệnh nhân mua hai gói thì một ô không chứa được.
Hướng (khuyến nghị — thiết kế): bảng gói bệnh nhân mua (dịch vụ, số buổi, ngày mua, hạn) + mỗi buổi là một lịch hẹn trỏ về gói; số còn lại = số buổi − số lịch hẹn của gói đã khám, tính khi mở hồ sơ (vài chục dòng mỗi bệnh nhân, có index).
Cần chốt (chính sách): gói gồm gì và có hạn không; buổi *vắng mặt* có bị trừ không; một bệnh nhân có nhiều gói cùng lúc không.

**Q-08 · trái quy định · CHẶN** *(không dựng)*
Nguồn: `NHU-CAU-DU-LIEU-MOI.md:26` — "Lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) … giữ vô thời hạn; mọi lễ tân đều xem được." · `YEU-CAU-PHONG-KHAM.md:16` R-10 — "Lễ tân chỉ thấy dữ liệu phòng khám của mình".
Hệ quả nếu dựng: ảnh dùng nhận diện là dữ liệu sinh trắc — dữ liệu cá nhân nhạy cảm (Nghị định 13/2023/NĐ-CP); trẻ em cần đồng ý của cha mẹ hoặc người giám hộ; giữ vô thời hạn trái nguyên tắc lưu theo mục đích; "mọi lễ tân" trái R-10. Lộ một lần là không thay được như mật khẩu.
Hướng (đề xuất thu tối thiểu): (a) không lưu ảnh, nhận diện bằng mã hồ sơ + số điện thoại · (b) lưu mẫu nhận diện (không lưu ảnh gốc) ở kho riêng mã hóa, kèm bản ghi đồng ý (ai đồng ý, ngày, người bảo hộ với trẻ em qua `guardianships`), chỉ lễ tân phòng khám đang tiếp nhận xem, xóa thật khi ẩn hồ sơ, khi rút đồng ý hoặc sau 24 tháng không đến khám.
Cần chốt: mục đích, ai xem, giữ bao lâu, xóa thế nào, đồng ý cho trẻ em.

## Câu không chặn — schema đã đi tiếp với giả định

**Q-09 · mơ hồ · không chặn** — 🔴 A: `appointment_services.unit_price` chép từ `services.price` khi ghi dòng, chép lại khi lịch hẹn sang `arrived`, cố định sau khi lập hóa đơn; dòng v1.0 điền bằng giá hiện hành.
Hệ quả nếu sai: nếu "giá lúc khám" nghĩa là giá lúc đặt lịch — đặt 01/10 giá 300.000 đ, khám 15/10 khi giá đã 350.000 đ — hóa đơn in 350.000 đ thay vì 300.000 đ.

**Q-10 · thiếu · không chặn** — 🔴 A: lịch v1.0 chưa có giờ kết thúc, điền `ends_at = starts_at + 10 phút` (suy từ Q-01: ~2.000 lịch/ngày ÷ ~40 bác sĩ ≈ 50 lịch, ca 8 giờ ≈ 10 phút) trước khi đặt NOT NULL và EXCLUDE; lịch `cancelled`, `no_show` nhả giờ của bác sĩ.
Hệ quả nếu sai: thời lượng thật dài hơn thì EXCLUDE bỏ sót trùng ở dữ liệu cũ; nếu lịch vắng mặt vẫn phải giữ giờ thì lịch chen vào giờ đó lại được nhận. Q-02 đóng vì N-02 đã cho giờ kết thúc.

**Q-11 · dị thường dữ liệu · không chặn** — 🔴 A: dựng đúng như viết, mã hồ sơ đã ẩn được cấp lại (unique một phần `WHERE deleted_at IS NULL`).
Hệ quả nếu sai: N-13 giữ hóa đơn của người đã ẩn cho kế toán — mã BN-0123 cấp lại cho người mới thì hai hóa đơn cùng in BN-0123 là hai người; muốn tránh thì unique đầy đủ, mã không bao giờ cấp lại.

**Q-12 · thiếu · không chặn** — 🔴 A: chỉ ghi nhận cọc (số tiền, ngày nhận), hoàn cọc là dòng âm; cọc chưa trừ vào hóa đơn, chưa vào báo cáo doanh thu R-11.
Hệ quả nếu sai (chính sách, BA chọn): cọc 200.000 đ, hóa đơn 500.000 đ — thu thêm 300.000 đ hay thu 500.000 đ rồi hoàn cọc; hủy trước 2 giờ (R-12), hủy sát giờ, vắng mặt, tự hủy khi ẩn hồ sơ (N-13) — mỗi ca hoàn cọc hay giữ cọc.

**Q-13 · trái quy định · không chặn** — 🔴 A: dị ứng (dữ liệu sức khỏe) và thẻ bảo hiểm (dữ liệu cá nhân) giữ theo hồ sơ bệnh nhân, ai xem được hồ sơ thì xem được (lễ tân theo R-10); đổi thẻ thì sửa dòng, không giữ thẻ cũ. Không chặn vì mục đích và người xem đã nêu ở N-07.
Hệ quả nếu sai: thiếu hạn lưu và đường xóa thật cho dữ liệu sức khỏe; kế toán cần thẻ cũ để đối chiếu hóa đơn bảo hiểm thì mất.

**Q-14 · ra lệnh giải pháp · không chặn** — 🔴 A: không dựng `appointments_hn`, `appointments_hcm`, `appointments_dn`; một bảng `appointments`, báo cáo chi nhánh đi index `(organization_id, clinic_id, starts_at)` (AP-04), lớn thì phân vùng theo tháng của `starts_at`.
Hệ quả nếu dựng như nhu cầu: mở chi nhánh thứ tư phải thêm bảng và sửa code; báo cáo toàn tổ chức (R-11) phải UNION ba bảng; hóa đơn, cọc, ghi chú không có FK trỏ được vào ba bảng.
