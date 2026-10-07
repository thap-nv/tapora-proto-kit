# CÂU HỎI CHO BA — lượt cập nhật schema v2.0 (N-01 → N-20)

> Sổ câu hỏi của bước B2 (phản biện requirement). Mã `Q-nn`; `Q-01` (cỡ dữ liệu) và `Q-02` (độ dài lịch hẹn) nằm ở `DATA-DICTIONARY.md` mục 2 — `Q-02` **đóng** ở lượt này (xem `Q-14`).
> Số dòng `nguồn:dòng` là dòng trong file nguồn. `NHU-CAU` = `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md`; `YEU-CAU` = `1-yeu-cau/YEU-CAU-PHONG-KHAM.md`.
> **Lượt này BA vắng mặt**: mục **CHẶN** không được dựng bảng nào; mục không chặn đi tiếp với giả định 🔴 A đã ghi tại chỗ (cột `note`, `Note` bảng) và ở đây.

| Mã | Nhu cầu | Loại | Mức | Đã dựng gì |
| :--- | :--- | :--- | :--- | :--- |
| Q-03 | N-16 ↔ R-04 | mâu thuẫn | **CHẶN** | không dựng |
| Q-04 | N-17 | thiếu | **CHẶN** | không dựng |
| Q-05 | N-18 | thiếu · giá trị suy ra | **CHẶN** | không dựng |
| Q-06 | N-20 | trái quy định | **CHẶN** | không dựng |
| Q-07 | N-14 ↔ R-09 | trái quy định · mâu thuẫn | **CHẶN** | không dựng |
| Q-08 | N-19 | cản mở rộng · ra lệnh giải pháp | không làm — chờ BA xác nhận | không dựng |
| Q-09 | N-09 · N-10 | mơ hồ · thiếu chuyển trạng thái | không chặn | enum + máy trạng thái theo giả định |
| Q-10 | N-05 | thiếu vòng đời tiền | không chặn | `appointment_deposits` (chỉ phần đã rõ) |
| Q-11 | R-12 · N-13 | không cưỡng chế được | không chặn | chưa thêm cột |
| Q-12 | N-04 × N-13 | mâu thuẫn mềm | không chặn | `patients.patient_code` + unique một phần |
| Q-13 | N-13 | trái quy định (hạn lưu) | không chặn | chưa dựng |
| Q-14 | N-02 | thiếu | không chặn | `appointments.ends_at` + EXCLUDE |
| Q-15 | N-01 · R-08 | thiếu vòng đời | không chặn | `invoice_lines` + `invoices` unique theo lịch hẹn |
| Q-16 | N-03 | thiếu vòng đời | không chặn | `guardianships` |
| Q-17 | N-06 | thiếu | không chặn | `internal_notes` |
| Q-18 | N-07 | thiếu | không chặn | `allergens` · `patient_allergies` |
| Q-19 | N-15 | thiếu vòng đời | không chặn | `patient_insurances` |

---

## Mục CHẶN

### Q-03 · mâu thuẫn · CHẶN
**Nguồn:** `NHU-CAU:22` (N-16) — "**Ca khám nhóm** (tư vấn gia đình) có **từ hai bác sĩ trở lên** cùng phụ trách một lịch hẹn." ↔ `YEU-CAU:10` (R-04, đã chốt) — "**Mỗi lịch hẹn có đúng một bác sĩ phụ trách.**"
**Vấn đề:** hai câu không cùng đúng. Chưa rõ N-16 *sửa* R-04 hay là *ngoại lệ* của R-04. Schema v1.0 hiện thực R-04 bằng `appointments.doctor_id NOT NULL`.
**Hệ quả nếu giữ nguyên:** không dựng được cả hai. Ảnh hưởng chéo: (1) N-02 — ràng buộc chống trùng giờ đã dựng chỉ nhìn thấy bác sĩ ở `appointments.doctor_id`; (2) R-11 — doanh thu theo bác sĩ.
**Hướng (a)** giữ R-04 làm quy tắc chung: ca nhóm có một bác sĩ phụ trách chính ở `appointments.doctor_id` + các bác sĩ cùng tham gia ở bảng nối `appointment_doctors`. Chặn trùng giờ của bác sĩ tham gia cần chép khoảng giờ vào bảng nối và giữ đồng bộ bằng trigger.
**Hướng (b)** bỏ R-04: mọi lịch hẹn có 1..n bác sĩ ngang hàng ở bảng nối, bỏ `appointments.doctor_id`. Đổi cấu trúc cột đã có dữ liệu; ràng buộc chống trùng chuyển hết sang bảng nối.
**Tình huống có số:** ca tư vấn gia đình 09:00–10:00 do BS Hà (nhi) và BS Minh (tâm lý) cùng phụ trách, hóa đơn 600.000đ. Lễ tân đặt BS Minh khám người khác 09:30–10:00. Báo cáo doanh thu theo bác sĩ (R-11): 600.000đ tính cho Hà, cho cả hai (cộng 1.200.000đ), hay chia 300.000đ/300.000đ?
**Cần chốt:** (1) (a) hay (b); (2) bác sĩ tham gia có bị chặn trùng giờ như bác sĩ chính không; (3) doanh thu ca nhóm tính cho ai.
**Đang dùng:** không dựng gì cho N-16; N-02 chạy trên R-04. **Trạng thái:** mở.

### Q-04 · thiếu · CHẶN
**Nguồn:** `NHU-CAU:23` (N-17) — "**Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau.**" Trong `YEU-CAU` (R-01 → R-12) không có từ "phẫu thuật" hay "phòng mổ"; R-06 (`YEU-CAU:12`) chỉ có "phòng khám bệnh (rooms)"; `appointments` không có `room_id`.
**Vấn đề:** rule chống trùng cần ba dữ kiện chưa nguồn nào nói: *ca phẫu thuật là gì* (một loại lịch hẹn hay thực thể riêng), *phòng mổ là gì* (một loại `rooms`?), *kéo dài bao lâu*.
**Hệ quả nếu giữ nguyên:** không có cột nào để kiểm rule; kiểm ở ứng dụng sẽ lọt khi hai lễ tân đặt cùng lúc (cùng cơ chế với N-02).
**Hướng (a)** ca phẫu thuật là một loại `appointments`: thêm loại lịch hẹn và `room_id`, chống trùng bằng ràng buộc loại trừ theo `room_id` + khoảng giờ; dùng lại hóa đơn, thanh toán, trạng thái.
**Hướng (b)** bảng `surgeries` riêng: có đội mổ (phẫu thuật viên, gây mê, điều dưỡng), vòng đời riêng; chống trùng theo phòng mổ.
**Tình huống có số:** phòng mổ 1 có ca A 08:00–10:30. Đặt ca B 10:00–11:00 → chặn. Đặt ca C 10:30–12:00 → cho qua hay chặn (có 30 phút dọn phòng không)? Ca A có BS mổ chính và BS gây mê — chạm Q-03.
**Cần chốt:** (1) loại lịch hẹn hay riêng; (2) phòng mổ nằm trong `rooms` hay riêng; (3) ai nhập giờ kết thúc; (4) có khoảng đệm giữa hai ca không; (5) ai tham gia ca.
**Đang dùng:** không dựng gì cho N-17. **Trạng thái:** mở.

### Q-05 · thiếu · giá trị suy ra · CHẶN
**Nguồn:** `NHU-CAU:24` (N-18) — "**Lưu số buổi điều trị còn lại** của gói trị liệu trên hồ sơ bệnh nhân để lễ tân nhìn thấy ngay."
**Vấn đề:** (1) `YEU-CAU` không có "gói trị liệu": không có sản phẩm gói, không có việc mua gói, không có việc trừ buổi. (2) Yêu cầu nói *cột* ("lưu … trên hồ sơ"); nhu cầu thật là *lễ tân nhìn thấy ngay số buổi còn lại*. Số còn lại = số buổi đã mua − số buổi đã dùng, là giá trị suy ra (DB-REQ-06).
**Kịch bản lệch dữ liệu:** `patients.sessions_remaining = 7`. Hai lễ tân cùng ghi nhận buổi thứ 4 của bệnh nhân Hà lúc 09:00 → hai lệnh trừ chạy song song, số còn 6 thay vì 5. Buổi bị hủy sau khi đã trừ không ai cộng lại. Một bệnh nhân hai gói (vật lý trị liệu + châm cứu) thì một cột không đủ.
**Hệ quả nếu giữ nguyên:** cột trên `patients` lệch ngay ở lần đồng thời đầu tiên, và không biết gói nào hết hạn.
**Hướng thiết kế (có khuyến nghị — câu hỏi thuộc thiết kế hệ thống):** không lưu số còn lại; dựng `treatment_packages` (danh mục), `package_purchases` (bệnh nhân mua), `package_session_usages` (mỗi lịch hẹn dùng một buổi) và tính số còn lại bằng truy vấn/view hiển thị trên màn hồ sơ. Lý do: số suy ra từ sổ không bao giờ lệch.
**Câu chính sách cần chốt (không khuyến nghị):** gói là một dịch vụ hay thực thể riêng; mỗi lịch hẹn trừ 1 buổi hay theo dịch vụ; vắng mặt/hủy muộn có trừ không; gói có hạn dùng không; hoàn tiền buổi chưa dùng.
**Tình huống có số:** Hà mua gói 10 buổi 3.000.000đ (300.000đ/buổi) ngày 01/10, đã dùng 3 buổi, vắng 1 buổi, xin hoàn ngày 20/10. Hoàn 7 × 300.000 = 2.100.000đ, hay 6 × 300.000 = 1.800.000đ nếu buổi vắng bị trừ? (R-08 hoàn tiền là dòng `payments` âm, nhưng thanh toán gói không thuộc hóa đơn lịch hẹn nào.)
**Đang dùng:** không dựng gì cho N-18, **không thêm cột `sessions_remaining`**. **Trạng thái:** mở.

### Q-06 · trái quy định · CHẶN
**Nguồn:** `NHU-CAU:26` (N-20) — "**Lưu ảnh khuôn mặt bệnh nhân** (kể cả trẻ em) để nhận diện khi đến khám; **giữ vô thời hạn**; mọi lễ tân đều xem được."
**Vấn đề (DB-REQ-09, mức CRITICAL):** dữ liệu sinh trắc + trẻ em + vô thời hạn + đọc rộng.
- *Mục đích* "nhận diện khi đến khám": lễ tân đối chiếu bằng mắt, hay hệ thống tự nhận diện khuôn mặt (xử lý sinh trắc — nhạy cảm hơn nữa)?
- *Trẻ em*: cần sự đồng ý của người bảo hộ (N-03); chưa có chỗ ghi đồng ý.
- *Vô thời hạn*: trái nguyên tắc hạn lưu (DB-SEC-06); xung đột N-13 (hồ sơ đã ẩn vẫn giữ ảnh?).
- *"Mọi lễ tân đều xem được"*: trái R-10 (`YEU-CAU:16` — "Lễ tân chỉ thấy dữ liệu phòng khám của mình") và DB-SEC-05 (quyền xem tách riêng + ghi log).
- *Pháp lý*: dữ liệu sinh trắc, sức khỏe, trẻ em thường thuộc nhóm dữ liệu cá nhân nhạy cảm (ví dụ Nghị định 13/2023/NĐ-CP) — cần pháp chế của phòng khám xác nhận.
**Hệ quả nếu giữ nguyên:** bảng ảnh không hạn lưu, không log truy cập, chứa ảnh trẻ em — sửa sau khi dữ liệu đã vào là đắt, và rủi ro pháp lý đi theo dữ liệu.
**Hướng (a)** không thu ảnh: nhận diện bằng mã hồ sơ (N-04) + số điện thoại + ngày sinh. **(b)** thu ảnh với điều kiện: chỉ để lễ tân đối chiếu bằng mắt; tệp nằm ở kho đối tượng (DB-SEC-07), bảng giữ khóa tham chiếu; có đồng ý (người bảo hộ với trẻ em); có hạn lưu và xóa thật (`purged_at`); chỉ lễ tân phòng khám có lịch hẹn của bệnh nhân hôm đó xem; mỗi lần xem ghi log. **(c)** nhận diện khuôn mặt tự động (mẫu sinh trắc) — cần đánh giá tác động riêng, ngoài phạm vi lượt này.
**Đề xuất thu tối thiểu (DB-REQ-09):** (a); nếu bắt buộc phải thu ảnh thì (b).
**Cần chốt:** mục đích, ai đồng ý, hạn lưu (bao nhiêu tháng sau lần khám cuối), ai xem, ai duyệt.
**Đang dùng:** không dựng gì cho N-20. **Trạng thái:** mở.

### Q-07 · trái quy định · mâu thuẫn · CHẶN
**Nguồn:** `NHU-CAU:20` (N-14) — "Bác sĩ đăng nhập cổng riêng bằng email và mật khẩu. Để hỗ trợ khi bác sĩ quên, **hệ thống ghi lại mật khẩu** để quản trị viên đọc cho họ." ↔ `YEU-CAU:15` (R-09, đã chốt) — "mật khẩu **không bao giờ** lưu nguyên văn."
**Vấn đề:** hai nguồn mâu thuẫn trực tiếp. Ghi lại mật khẩu để đọc được nghĩa là lưu nguyên văn hoặc mã hóa có khóa giải (DB-SEC-04, CRITICAL): lộ qua bản sao lưu, log; quản trị viên biết mật khẩu của bác sĩ (người hay dùng lại mật khẩu ở nơi khác); mọi thao tác dưới tài khoản bác sĩ có thể bị chối.
**Nhu cầu thật (DB-REQ-05):** bác sĩ quên mật khẩu vẫn vào lại được nhanh.
**Tình huống:** BS Lan quên mật khẩu lúc 07:30, gọi quản trị viên Minh. **(a)** Minh bấm "đặt lại"; hệ thống gửi liên kết dùng một lần, hết hạn sau 60 phút, tới email đăng nhập của Lan. **(b)** Minh nhận mật khẩu tạm hiện một lần; Lan bị buộc đổi ở lần đăng nhập đầu. **(c)** Lan tự đặt lại bằng email, không cần quản trị viên.
**Khuyến nghị (câu hỏi thiết kế hệ thống):** (a) hoặc (c). Lý do: không ai, kể cả quản trị viên, biết mật khẩu; cần thêm bảng `password_reset_tokens(user_id, token_hash, expires_at, used_at)` — chưa dựng tới khi BA chọn.
**Cần chốt:** chọn (a)/(b)/(c) và xác nhận R-09 giữ nguyên.
**Đang dùng:** không thêm cột mật khẩu nào; `users.password_hash` giữ nguyên. **Trạng thái:** mở.

---

## Mục không làm — chờ xác nhận

### Q-08 · cản mở rộng · ra lệnh giải pháp
**Nguồn:** `NHU-CAU:25` (N-19) — "**Mỗi chi nhánh có bảng lịch hẹn riêng** (`appointments_hn`, `appointments_hcm`, `appointments_dn`) để báo cáo từng chi nhánh chạy nhanh."
**Vấn đề:** yêu cầu nói *bảng*; nhu cầu thật là *báo cáo theo chi nhánh chạy nhanh*. R-01 (`YEU-CAU:7`) — "Một tổ chức có nhiều phòng khám": chi nhánh là một dòng của `clinics`; thêm phòng khám thứ tư là thêm dòng, không thêm bảng (DB-REQ-07, DB-SCL-06).
**Số đo (từ giả định `Q-01`, chưa có dữ liệu thật):** ~2.000 lịch hẹn/ngày cho 3 phòng khám ≈ 730.000/năm ≈ 243.000/năm/phòng khám. Chỉ mục `appointments(organization_id, clinic_id, starts_at)` đã có sẵn trả lời "một phòng khám theo khoảng ngày". Cỡ này cách xa ngưỡng cần chia bảng (hàng chục triệu dòng).
**Hệ quả nếu dựng ba bảng:** (1) mọi khóa ngoại tới lịch hẹn (`invoices`, `appointment_services`, `appointment_deposits`, `internal_notes`) phải trỏ ba bảng — không còn là khóa ngoại thật; (2) ràng buộc chống trùng giờ bác sĩ (N-02) không chạy xuyên bảng, bác sĩ làm ở hai chi nhánh có thể bị đặt trùng; (3) báo cáo toàn tổ chức (R-11) phải `UNION ALL` ba bảng; (4) chi nhánh thứ tư = bảng mới + sửa mã.
**Hướng (a)** một bảng `appointments` + chỉ mục hiện có (đã làm). **(b)** nếu sau này đạt cỡ L: phân vùng LIST theo `clinic_id` hoặc RANGE theo `starts_at` — vẫn một bảng logic — và báo cáo nặng đọc từ bảng tổng hợp (DB-PERF-07). **(c)** giữ ba bảng như yêu cầu — phải chốt cách xử lý bốn hệ quả trên.
**Cần chốt:** xác nhận (a). Nếu báo cáo chi nhánh hiện chậm thật, cho biết số dòng và thời gian.
**Đang dùng:** không dựng `appointments_hn/hcm/dn`. **Trạng thái:** chờ xác nhận.

---

## Mục không chặn — đã đi tiếp với giả định 🔴 A

### Q-09 · mơ hồ · thiếu chuyển trạng thái
**Nguồn:** `NHU-CAU:15` (N-09) — "Lịch hẹn có các trạng thái: *đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy*. Từ *đã xác nhận* có thể sang *đã đến* hoặc *vắng mặt*; từ *đã đặt* có thể sang *đã xác nhận* hoặc *đã hủy*." · `NHU-CAU:16` (N-10) — "tổng số lần khám **đã hoàn thành**" · `YEU-CAU:14` (R-08) — "Mỗi lịch hẹn **đã khám** có một hóa đơn" · `YEU-CAU:18` (R-12) · `NHU-CAU:19` (N-13).
**Vấn đề:** (1) năm trạng thái không có "đã khám xong", trong khi R-08 và N-10 cần; schema v1.0 có `done`. *"Đã đến"* có phải *"đã khám xong"*? (2) Bốn mũi tên chuyển thiếu: `đã xác nhận → đã hủy` (R-12 khách hủy; N-13 ẩn hồ sơ tự hủy lịch đã xác nhận), `đã đặt → đã đến` (khách đến mà chưa xác nhận), `đã đặt → vắng mặt`.
**Hệ quả nếu giữ nguyên:** nếu "đã đến" = hoàn thành thì N-10 đếm cả người mới đến chưa khám xong; nếu không thì thiếu một trạng thái.
**Tình huống có số:** Hà có lịch 09:00 đã xác nhận hôm qua. 08:00 Hà gọi hủy: theo đúng bốn mũi tên của N-09 hệ thống phải từ chối. Hà đến lúc 09:05, lễ tân bấm "đã đến"; bác sĩ khám xong 09:40 — lúc 09:20 trạng thái là gì, hóa đơn tạo lúc nào, lượt khám này đã vào "số lần khám hoàn thành" chưa?
**Hướng (vận hành — không khuyến nghị):** (a) "đã đến" chính là "đã khám xong"; (b) thêm "đã khám xong" sau "đã đến"; (c) khác.
**Đang dùng (🔴 A):** (b) — giữ `done`, thêm `confirmed` · `arrived` · `no_show`; mở thêm hai mũi tên `confirmed → cancelled` và `arrived → done`, không mở `booked → arrived` và `booked → no_show`. Kiểm bằng trigger ghi ở `Note` của `appointments`. Nếu BA chọn (a), `done` thành giá trị thừa và PostgreSQL không bỏ được giá trị enum (DB-EVO-05): phải tạo lại enum. N-10 là giá trị suy ra, không lưu: `COUNT(appointments WHERE patient_id = ? AND status = 'done')`.
**Trạng thái:** mở.

### Q-10 · thiếu vòng đời của tiền
**Nguồn:** `NHU-CAU:11` (N-05) — "Lịch hẹn có thể kèm một khoản **đặt cọc** bằng tiền, ghi ngày nhận cọc."
**Vấn đề:** chỉ có pha "tạo". Thiếu "kết thúc/lịch sử" của khoản tiền (DB-REQ-03, DB-MOD-11). `payments` gắn với hóa đơn, mà hóa đơn chỉ có sau khi khám (R-08) — nên cọc không thể là dòng `payments`. Doanh thu theo ngày (R-11) tính cọc thế nào cũng chưa nói.
**Tình huống có số:** Hà đặt cọc 200.000đ ngày 03/10 cho lịch 10/10; hóa đơn 600.000đ.
1. Khám xong, Hà trả thêm 400.000đ (cọc trừ vào hóa đơn): doanh thu ngày 10/10 ghi 600.000đ hay 400.000đ? Cọc tính vào ngày 03/10 hay 10/10?
2. Hà hủy lúc 13:00 ngày 10/10, lịch 14:00 (muộn hơn mốc 2 tiếng của R-12): hoàn cọc, giữ cọc, hay giữ một phần?
3. Hà vắng mặt: cọc thuộc về phòng khám?
4. Hồ sơ Hà bị ẩn ngày 05/10 (N-13) → lịch 10/10 tự hủy, không ai "hủy" thật: cọc xử lý thế nào?
5. Hà đặt cọc hai lần (100.000đ + 100.000đ): cho phép không?
**Hướng (chính sách — không khuyến nghị):** (a) cọc luôn trừ vào hóa đơn, không hoàn; (b) cọc hoàn theo R-12; (c) tùy từng trường hợp. Mỗi hướng cần trạng thái khoản cọc (đã nhận / đã trừ vào hóa đơn / đã hoàn / mất) và liên kết tới `payments`.
**Đang dùng (🔴 A):** `appointment_deposits(appointment_id unique, amount > 0, received_on)` — chỉ ghi nhận khoản đã nhận, tối đa một khoản mỗi lịch hẹn; chưa có trạng thái, chưa nối `payments`. **Trạng thái:** mở.

### Q-11 · không cưỡng chế được
**Nguồn:** `YEU-CAU:18` (R-12) — "Bệnh nhân hủy lịch trước giờ hẹn 2 tiếng thì không tính phí." · `NHU-CAU:19` (N-13) · `NHU-CAU:15` (N-09).
**Vấn đề (DB-REQ-01):** rule cần biết *giờ hủy* và *ai hủy*; schema v1.0 và v2.0 chưa có `cancelled_at`. "Tính phí" cần biết phí bao nhiêu và ghi ở đâu — chưa có cột phí. Hủy do hệ thống (ẩn hồ sơ, N-13) có tính phí không?
**Tình huống có số:** lịch 14:00; Hà hủy lúc 12:30 (trễ mốc 2 tiếng 30 phút) → tính phí không, bao nhiêu? Hệ thống tự hủy lúc 13:30 vì hồ sơ Hà bị ẩn → có phí không?
**Hướng (chính sách — không khuyến nghị):** (a) có khoản phí: cần `cancelled_at`, nguồn hủy, số phí, và nơi ghi khoản phí (hóa đơn cho lịch không khám); (b) chỉ đánh dấu "hủy muộn", thu phí làm ngoài hệ thống: cần `cancelled_at` và nguồn hủy.
**Đang dùng:** chưa thêm cột nào (câu hỏi chính sách chưa có đáp án). **Trạng thái:** mở.

### Q-12 · mâu thuẫn mềm giữa N-04 và N-13
**Nguồn:** `NHU-CAU:10` (N-04) — "mã của hồ sơ đã ẩn **được cấp lại** cho người khác." · `NHU-CAU:19` (N-13) — "hóa đơn và thanh toán của người đó vẫn phải còn để kế toán đối chiếu."
**Vấn đề:** sau khi cấp lại, hai bệnh nhân khác nhau cùng mang một mã trong sổ sách; đối chiếu bằng mã trở nên nhập nhằng.
**Tình huống có số:** hồ sơ HS-000123 của Hà bị ẩn 01/10; 05/10 cấp HS-000123 cho Lan; 15/10 kế toán xuất hóa đơn tháng 9 có cột "mã hồ sơ" → HS-000123 hiện ra cho hai người. Hà quay lại 20/10: khôi phục hồ sơ cũ (phải đổi mã, vì HS-000123 giờ là của Lan) hay lập hồ sơ mới (lịch sử tách đôi)?
**Hướng (vận hành — không khuyến nghị):** (a) giữ nguyên N-04; báo cáo kế toán không dùng mã hồ sơ mà dùng `patients.id` + họ tên; (b) chép mã vào hóa đơn lúc phát hành; (c) không cấp lại mã — bỏ nửa sau của N-04, unique toàn bảng.
**Đang dùng (🔴 A):** cấp lại; unique một phần `(organization_id, patient_code) WHERE deleted_at IS NULL`; khôi phục hồ sơ ẩn phải đổi mã nếu mã đã bị cấp; người đã ẩn quay lại có thể lập hồ sơ mới — nên `patients.person_id` đổi từ unique toàn bảng thành unique một phần. **Trạng thái:** mở.

### Q-13 · hạn lưu dữ liệu cá nhân
**Nguồn:** `NHU-CAU:19` (N-13) — hóa đơn, thanh toán của hồ sơ ẩn "vẫn phải còn"; `YEU-CAU` không nêu hạn lưu cho loại dữ liệu nào.
**Vấn đề (DB-SEC-06, mức CRITICAL):** "ẩn" = đặt `deleted_at`: họ tên, số điện thoại, ngày sinh, dị ứng, bảo hiểm, ghi chú vẫn còn nguyên; xóa mềm không phải xóa thật. Chưa có hạn lưu cho hóa đơn lẫn hồ sơ.
**Tình huống có số:** hồ sơ Hà ẩn ngày 01/10/2026. Đến ngày nào được xóa thật số điện thoại và dị ứng của Hà? Hóa đơn giữ bao nhiêu năm (số năm do pháp chế/kế toán cho)?
**Hướng (chính sách — không khuyến nghị):** (a) giữ tất cả đến hết hạn lưu hóa đơn rồi xóa thật cả hồ sơ; (b) sau X năm xóa thật dữ liệu nhận diện, giữ hóa đơn với tên đã ẩn danh; (c) xóa thật theo yêu cầu của chủ thể dữ liệu, giữ phần hóa đơn bắt buộc.
**Cần chốt:** số năm cho từng loại — hóa đơn/thanh toán, hồ sơ đã ẩn, ghi chú, dị ứng, bảo hiểm.
**Đang dùng (🔴 A):** giữ vô thời hạn; chưa có cột `purged_at` hay job xóa (ghi ở `Note` của `Project`). **Trạng thái:** mở.

### Q-14 · thiếu — đóng `Q-02`
**Nguồn:** `NHU-CAU:8` (N-02) — "Hệ thống **không cho một bác sĩ có hai lịch hẹn trùng thời gian**. Mỗi lịch hẹn có giờ bắt đầu và giờ kết thúc." · `DATA-DICTIONARY.md:18` (Q-02) — "Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu".
**Đã đóng:** N-02 xác nhận lịch hẹn có giờ kết thúc → `appointments.ends_at`; `Q-02` đóng.
**Còn mở:** (1) `ends_at` do ai nhập — nhân viên chọn, hay hệ thống tính từ độ dài dịch vụ (cần thêm `services.duration_minutes`, chưa dựng); (2) các lịch hẹn v1.0 chưa có giờ kết thúc: điền bao nhiêu phút khi chuyển; (3) lịch `vắng mặt` và `đã hủy` có nhả khung giờ không.
**Tình huống có số:** BS Lan có lịch A 09:00–09:30. Đặt B 09:15–09:45 → bị chặn; đặt C 09:30–10:00 → qua; A bị hủy → đặt B được; A vắng mặt lúc 09:00 → 09:20 lễ tân có được đặt khách vãng lai 09:20–09:40 cho Lan không?
**Khuyến nghị (câu hỏi thiết kế hệ thống) cho (1):** nhân viên nhập hoặc chỉnh giờ kết thúc; ô điền sẵn theo thời lượng dịch vụ khi sau này có `services.duration_minutes`. Lý do: không cần quyết định chính sách mới, và vẫn chống trùng được ngay.
**Đang dùng (🔴 A):** `ends_at NOT NULL`, `CHECK (ends_at > starts_at)`, `EXCLUDE (doctor_id, khoảng giờ)` chỉ tính lịch `booked/confirmed/arrived/done`; `no_show` và `cancelled` nhả khung giờ; lịch cũ backfill rồi mới `SET NOT NULL`. Nếu `Q-03` chốt nhiều bác sĩ một lịch hẹn, ràng buộc phải chuyển sang bảng nối. **Trạng thái:** `Q-02` đóng; (1)–(3) mở.

### Q-15 · thiếu vòng đời hóa đơn
**Nguồn:** `NHU-CAU:7` (N-01) — "Hóa đơn phải in đúng **giá dịch vụ lúc khám**, dù sau đó bảng giá đổi." · `YEU-CAU:14` (R-08) — "Mỗi lịch hẹn đã khám có một hóa đơn".
**Vấn đề:** (1) "lúc khám" là lúc phát hành hóa đơn hay lúc đặt lịch; dịch vụ được thêm vào lịch hẹn lúc nào? (2) hóa đơn đã phát hành có sửa/hủy/lập lại không — R-08 chỉ nói hoàn tiền là `payments` âm; `unique(invoices.appointment_id)` chặn hóa đơn thứ hai; (3) chỉ giá được chốt, tên dịch vụ đổi sau này sẽ đổi chữ trên hóa đơn cũ.
**Tình huống có số:** KHAM-TQ giá 300.000đ; đặt lịch 28/09; 01/10 đổi giá 350.000đ; khám 02/10 → in 350.000đ (giả định giá chốt lúc phát hành). Phát hành rồi mới thấy nhập nhầm số lượng 2 thay vì 1: sửa hóa đơn tại chỗ, hủy rồi lập hóa đơn mới, hay giữ hóa đơn và hoàn phần chênh?
**Hướng (vận hành — không khuyến nghị):** (a) hóa đơn bất biến, sai thì hoàn tiền; (b) hóa đơn có trạng thái hủy/lập lại — bỏ unique, thêm trạng thái và liên kết hóa đơn thay thế; (c) sửa được tới khi có khoản thanh toán đầu tiên.
**Đang dùng (🔴 A):** (a). `invoice_lines(invoice_id, service_id, quantity, unit_price)` chép từ `services.price` lúc phát hành, bất biến; không lưu tổng tiền (tính từ dòng); không chép tên dịch vụ.
**Rủi ro không sửa được bằng schema:** các hóa đơn đã phát hành trước v2.0 không còn biết giá lúc đó. Backfill `invoice_lines` cho chúng chỉ có thể dùng giá hiện hành — sai nếu dịch vụ đã đổi giá. Cần BA xác nhận chấp nhận (hoặc cung cấp bảng giá cũ).
**Trạng thái:** mở.

### Q-16 · thiếu vòng đời bảo hộ
**Nguồn:** `NHU-CAU:9` (N-03) — "Cần ghi được quan hệ bảo hộ (ai bảo hộ ai, từ ngày nào)."
**Vấn đề:** chỉ có "từ ngày"; không nói "đến ngày", số người bảo hộ cùng lúc, loại quan hệ.
**Tình huống có số:** bé An (7 tuổi) có hai người bảo hộ từ 01/03/2026: mẹ (lễ tân Hoa) và bác (BS Minh). Bác Minh thôi bảo hộ 30/06/2026: xóa dòng hay ghi ngày kết thúc? An đủ 18 tuổi: tự hết hay nhân viên đóng? Người bảo hộ có được xem hồ sơ/đặt lịch thay không (chưa mô hình hóa)?
**Hướng (vận hành — không khuyến nghị):** (a) chỉ "từ ngày", kết thúc bằng xóa dòng — mất lịch sử; (b) có `valid_to`; (c) thêm loại quan hệ hoặc "người bảo hộ chính".
**Đang dùng (🔴 A):** (b) — `guardianships(guardian_person_id → people, patient_id → patients, valid_from, valid_to NULL)`, nhiều người cùng lúc, không trùng khoảng của cùng một cặp, chưa có loại quan hệ. **Trạng thái:** mở.

### Q-17 · thiếu phạm vi xem và sửa ghi chú
**Nguồn:** `NHU-CAU:12` (N-06) — "Nhân viên có thể gắn **ghi chú nội bộ** vào một lịch hẹn, một bệnh nhân hoặc một hóa đơn." · `YEU-CAU:16` (R-10) — "Lễ tân chỉ thấy dữ liệu phòng khám của mình".
**Vấn đề:** bệnh nhân không thuộc riêng một phòng khám (R-03) nên ghi chú gắn bệnh nhân có thể vượt R-10; ghi chú có thể chứa thông tin sức khỏe; chưa nói có sửa/xóa không.
**Tình huống:** lễ tân phòng khám 1 ghi vào hồ sơ Hà "hay đến muộn 15 phút". Lễ tân phòng khám 2 mở hồ sơ Hà: thấy ghi chú không? Lễ tân gõ nhầm → sửa được hay chỉ thêm ghi chú mới?
**Hướng (vận hành — không khuyến nghị):** (a) chỉ thêm, mọi nhân viên của tổ chức thấy; (b) chỉ thêm, thấy theo phòng khám nơi viết (thêm `clinic_id`); (c) sửa/xóa được (thêm `updated_at`, `deleted_at`, lịch sử).
**Đang dùng (🔴 A):** (a) về dữ liệu — `internal_notes` chỉ thêm, đúng một đối tượng gắn (CHECK), có `created_by`. **Trạng thái:** mở.

### Q-18 · thiếu quy tắc nhập dị ứng
**Nguồn:** `NHU-CAU:13` (N-07) — "Một bệnh nhân có thể có **nhiều dị ứng** (tên chất, mức độ nặng/nhẹ); lễ tân tra được bệnh nhân theo từng chất gây dị ứng."
**Vấn đề:** (1) tra theo chất chỉ chắc khi tên chất nhất quán — ai được thêm chất mới; (2) "không có dòng" mang hai nghĩa: *đã hỏi, không dị ứng* hoặc *chưa hỏi* — liên quan an toàn; (3) mức chỉ hai (nặng/nhẹ), y khoa hay có mức vừa.
**Tình huống:** Hà dị ứng Penicillin (nặng); lễ tân tìm "penicillin" thấy Hà. Lễ tân khác gõ "penicilin" — hệ thống tạo chất mới hay chỉ cho chọn từ danh sách? Lan chưa được hỏi dị ứng: màn hình hiện "không dị ứng" hay "chưa khai báo"?
**Hướng (vận hành — không khuyến nghị):** (1) danh mục do quản trị viên quản hay lễ tân thêm tại chỗ; (2) thêm mốc "đã khai báo dị ứng lúc …" trên hồ sơ; (3) giữ hai mức hay ba mức.
**Đang dùng (🔴 A):** `allergens` (danh mục theo tổ chức, tên duy nhất không phân biệt hoa/thường) + `patient_allergies` (hai mức `mild | severe`); thêm mức sau bằng `ALTER TYPE … ADD VALUE`; "không có dòng" nghĩa là chưa biết, không phải không dị ứng. **Trạng thái:** mở.

### Q-19 · thiếu vòng đời bảo hiểm
**Nguồn:** `NHU-CAU:21` (N-15) — "Mỗi bệnh nhân có **tối đa một hồ sơ bảo hiểm** (số thẻ, nhà bảo hiểm, hạn dùng)."
**Vấn đề:** "tối đa một" là một thẻ *hiện hành* hay một thẻ *mãi mãi*? Đổi thẻ ghi đè thì hóa đơn cũ không biết đã dùng thẻ nào. Số thẻ có duy nhất không? Nhà bảo hiểm là danh mục hay chữ tự do?
**Tình huống có số:** Hà có thẻ A hạn 31/12/2026; 15/12 đổi sang thẻ của nhà bảo hiểm B. Hóa đơn ngày 10/12 thanh toán qua thẻ A — có cần truy ra thẻ A không? Hai anh em An và Bình cùng ghi một số thẻ gia đình?
**Hướng (vận hành — không khuyến nghị):** (a) ghi đè, mất lịch sử; (b) giữ nhiều thẻ có hiệu lực (bỏ "tối đa một", thêm `valid_to`); (c) hóa đơn chép thẻ dùng lúc phát hành.
**Đang dùng (🔴 A):** (a) — `patient_insurances(patient_id unique, card_number, insurer_name, expires_on)`; nhà bảo hiểm chữ tự do; số thẻ không unique (miễn trừ `DB-INT-07` ghi lý do trong `schema-lint.json`). **Trạng thái:** mở.
