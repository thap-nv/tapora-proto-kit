# CÂU HỎI CHỜ BA — phòng khám đa khoa chuỗi

> Điểm cần chốt phát sinh khi áp `NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20) vào `schema.dbml` v1.1. Mã `Q-nn` bắt đầu từ **Q-03** vì `Q-01` · `Q-02` đã nằm ở `DATA-DICTIONARY.md` mục 2.
>
> Quy tắc: câu nào chưa có đáp án thì **chưa dựng bảng** cho nó. Cột *Trong schema v1.1* nói rõ hiện đã làm gì và chưa làm gì.

## Tổng hợp

| Mã | Nhu cầu | Câu hỏi ngắn | Giả định tạm đang dùng | Trong schema v1.1 |
|---|---|---|---|---|
| Q-03 | N-16 | Ca khám nhóm (≥2 bác sĩ) mâu thuẫn R-04 (đúng một bác sĩ) — bên nào thắng? | R-04 giữ nguyên | Chưa dựng gì |
| Q-04 | N-18 | "Gói trị liệu" là gì? Chưa có trong R-01 → R-12 | Không có gói; không lưu số buổi còn lại | Chưa dựng gì |
| Q-05 | N-09 | Các đường chuyển trạng thái còn thiếu; `done` còn dùng không? | Giữ `done`; chưa chặn đường chuyển nào ở CSDL | Enum đã đổi; chưa có bảng chuyển trạng thái |
| Q-06 | N-14 | Lưu mật khẩu đọc được trái R-09 — đổi sang cơ chế đặt lại? | Không lưu mật khẩu; N-14 không làm | `users.password_hash` giữ nguyên |
| Q-07 | N-04 | Định dạng và cách sinh mã hồ sơ; cấp lại mã hồ sơ đã ẩn có chấp nhận rủi ro đối chiếu? | Cấp lại theo N-04; mã hồ sơ cũ sinh tự động | Đã áp (unique một phần) |
| Q-08 | N-13 × R-12 | Lịch tương lai tự hủy khi ẩn bệnh nhân có tính phí hủy muộn không? Phí hủy lưu ở đâu? | Không tính phí; chưa có chỗ lưu phí | Đã thêm `cancelled_at`, `cancel_reason` |
| Q-09 | N-17 | Ca phẫu thuật là gì trong mô hình? Phòng mổ có là `rooms` không? | Chưa mô hình hóa | Chưa dựng gì |
| Q-10 | N-03 | Bảo hộ có ngày kết thúc / loại quan hệ / nhiều người cùng lúc không? | Chỉ `starts_on`; nhiều người bảo hộ được | Đã áp (`guardianships`) |
| Q-11 | N-20 | Ảnh khuôn mặt (sinh trắc học, cả trẻ em): đồng ý, thời hạn, ai xem | Không lưu ảnh | Chưa dựng gì |
| Q-12 | N-02 | Thời lượng lịch hẹn cũ để điền `ends_at`; `ends_at` ai nhập? | 30 phút cho dữ liệu cũ | Đã áp (`ends_at`) |
| Q-13 | N-05 | Tiền cọc có trừ vào hóa đơn / hoàn khi hủy / tính doanh thu không? | Chỉ ghi nhận, nằm ngoài `payments` | Đã áp (2 cột trên `appointments`) |

---

## Q-03 — Ca khám nhóm mâu thuẫn "đúng một bác sĩ" (N-16 × R-04)

- **Nguồn:** N-16 *"Ca khám nhóm có từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn"*; R-04 *"Mỗi lịch hẹn có đúng một bác sĩ phụ trách"* (đã chốt).
- **Câu hỏi:** hai yêu cầu không cùng đúng. R-04 sửa thành "một hoặc nhiều", hay ca khám nhóm là một loại lịch hẹn riêng?
- **Phương án:**
  - A. Sửa R-04 thành *≥ 1 bác sĩ*: thêm bảng nối `appointment_doctors`, `appointments.doctor_id` bỏ hoặc thành "bác sĩ chính".
  - B. Giữ R-04 cho khám thường, ca nhóm là loại lịch hẹn riêng có bảng nối riêng.
- **Hệ quả cho thiết kế:**
  - Ràng buộc không trùng lịch của N-02 hiện đặt trên `appointments.doctor_id`; nếu một lịch có nhiều bác sĩ thì phải dời sang bảng nối (mỗi bác sĩ một dòng, kèm khoảng thời gian).
  - Báo cáo doanh thu theo bác sĩ (R-11): một hóa đơn của ca nhóm chia cho các bác sĩ thế nào? Chưa có quy tắc.
  - Tiền thù lao / "ai phụ trách" khác "ai có mặt" — cần biết vai (chính, phụ).
- **Giả định tạm:** R-04 vẫn đúng; `appointments.doctor_id` là một bác sĩ. **Chưa dựng bảng.**

## Q-04 — "Gói trị liệu" chưa tồn tại trong yêu cầu (N-18)

- **Nguồn:** N-18 *"Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân"*. R-01 → R-12 không có khái niệm gói, buổi điều trị, hay mua trước.
- **Câu hỏi:**
  1. Gói là gì: bệnh nhân mua một lần N buổi? Có giá, có hạn dùng không?
  2. Một buổi bị trừ khi nào: lúc lịch hẹn `arrived`, hay `done`? Vắng mặt có trừ không? Hủy / hoàn tiền thì cộng lại không?
  3. Gói gắn với bệnh nhân, với hóa đơn, hay với dịch vụ?
- **Hệ quả cho thiết kế:** *số buổi còn lại* = tổng buổi của gói − số buổi đã dùng, là **giá trị suy ra**. Lưu thành cột trên `patients` sẽ lệch ngay khi một lịch hẹn đổi trạng thái hoặc có hoàn tiền, và không có cách tự sửa. Khi có thực thể gói, hiển thị "còn lại" bằng truy vấn / view; chỉ lưu thành cột (cache) nếu đo được là chậm.
- **Giả định tạm:** không có gói; **không thêm cột nào** vào `patients`. **Chưa dựng bảng.**

## Q-05 — Đường chuyển trạng thái lịch hẹn còn thiếu (N-09)

- **Nguồn:** N-09 chỉ nêu bốn đường: `booked → confirmed`, `booked → cancelled`, `confirmed → arrived`, `confirmed → no_show`.
- **Câu hỏi (không nêu = cấm, hay chỉ chưa nói tới?):**
  1. `arrived → done` có đúng không? Schema v1.0 có `done`; N-10 (số lần khám hoàn thành) và R-08 (lịch hẹn đã khám có hóa đơn) cần nó. N-09 không liệt kê `done`.
  2. `confirmed → cancelled` có cho không? (Bệnh nhân đã xác nhận nhưng gọi hủy — R-12 nói tới hủy trước giờ hẹn 2 tiếng, ngầm cho phép.)
  3. `booked → no_show`, `booked → arrived` (đến mà chưa xác nhận) có cho không?
  4. Trạng thái cuối nào là cuối thật (`done`, `no_show`, `cancelled`)? Có mở lại được không?
- **Hệ quả cho thiết kế:** nếu muốn CSDL **chặn** chuyển trạng thái sai thì cần bảng `appointment_status_transitions` (+ trigger) hoặc bảng nhật ký; hiện chưa dựng vì ma trận chưa đủ. Nếu chỉ ứng dụng chặn thì không cần thêm gì.
- **Giả định tạm:** giữ `done` như một trạng thái riêng, sau `arrived`; ứng dụng chặn đường chuyển; CSDL chưa chặn.

## Q-06 — Lưu mật khẩu đọc được (N-14 × R-09)

- **Nguồn:** N-14 *"hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ"*; R-09 *"mật khẩu không bao giờ lưu nguyên văn"* (đã chốt).
- **Quyết định đã đưa vào schema: không làm N-14.** Hai điều không cùng đúng và R-09 là yêu cầu đã chốt. Lưu mật khẩu đọc được (hoặc mã hóa hai chiều) nghĩa là rò CSDL một lần là lộ mọi tài khoản bác sĩ — dữ liệu y tế đứng sau các tài khoản đó; quản trị viên đọc được mật khẩu cũng làm mất khả năng truy vết "ai đã đăng nhập bằng tài khoản này"; nhiều người dùng lại cùng mật khẩu ở nơi khác.
- **Câu hỏi:** nhu cầu thật là *hỗ trợ khi bác sĩ quên mật khẩu*. Chọn cách đáp ứng nào?
  - A. Quản trị viên bấm "đặt lại": hệ thống sinh mật khẩu tạm dùng một lần, bắt đổi ngay (cần cột `users.must_change_password`).
  - B. Gửi liên kết đặt lại có hạn dùng qua email (cần bảng `password_reset_tokens`: lưu **băm** của mã, hạn dùng, đã dùng chưa).
- **Giả định tạm:** chưa chọn A hay B nên **chưa thêm cột / bảng** nào. `users.password_hash` giữ nguyên.

## Q-07 — Mã hồ sơ bệnh nhân: định dạng và việc cấp lại mã (N-04)

- **Nguồn:** N-04 *"mã hồ sơ duy nhất trong tổ chức … mã của hồ sơ đã ẩn được cấp lại cho người khác"*; N-13 *"khi ẩn bệnh nhân, hóa đơn và thanh toán vẫn phải còn để kế toán đối chiếu"*.
- **Đã áp:** `patients.record_code`, unique **một phần** `(organization_id, record_code) WHERE deleted_at IS NULL` — hồ sơ ẩn không giữ mã.
- **Rủi ro cần BA chấp nhận:**
  1. Kế toán đối chiếu hóa đơn của bệnh nhân đã ẩn (N-13). Nếu họ tra bằng **mã hồ sơ**, hai người khác nhau (một đã ẩn, một đang dùng) có thể cùng mã và lẫn nhau. Báo cáo / màn tra cứu phải khóa theo `patients.id`, không theo mã.
  2. Khôi phục hồ sơ đã ẩn mà mã đã cấp cho người khác sẽ vi phạm unique → buộc cấp mã mới.
- **Câu hỏi:**
  1. Định dạng mã (số tăng dần theo tổ chức? có tiền tố phòng khám? nhập tay?) và sinh ở đâu (sequence theo tổ chức / ứng dụng)?
  2. Hồ sơ hiện có (đã tồn tại trước v1.1) đánh mã theo quy tắc nào?
  3. Có giữ yêu cầu "cấp lại mã" không, hay chuyển sang unique toàn bảng (đổi một dòng DDL)?
- **Giả định tạm:** cấp lại mã theo N-04; mã cho hồ sơ cũ sinh tự động (ví dụ `BN-000001`…) lúc chuyển dữ liệu.

## Q-08 — Tự hủy lịch khi ẩn bệnh nhân có tính phí hủy muộn không? (N-13 × R-12)

- **Nguồn:** N-13 *"lịch hẹn tương lai của người đó thì tự hủy"*; R-12 *"hủy trước giờ hẹn 2 tiếng thì không tính phí"* — nghĩa là hủy muộn hơn thì tính phí.
- **Khoảng trống có từ v1.0:** schema v1.0 không có `cancelled_at`, nên R-12 không tính ra được; cũng chưa có chỗ ghi *khoản phí hủy*.
- **Đã áp:** `appointments.cancelled_at` + `appointments.cancel_reason` (`by_patient` · `by_clinic` · `patient_hidden`) — đủ để biết hủy lúc nào và do ai, nên R-12 chỉ áp cho `by_patient`.
- **Câu hỏi:**
  1. Hủy do hệ thống (ẩn bệnh nhân) và hủy do phòng khám có được miễn phí không? (đang giả định có.)
  2. Phí hủy muộn của R-12 ghi ở đâu: một dòng hóa đơn, một khoản `payments`, hay chỉ cảnh báo? Mức phí bao nhiêu?
  3. Tập giá trị `cancel_reason` đã đủ chưa?
- **Giả định tạm:** `patient_hidden` và `by_clinic` không tính phí; **chưa có bảng / cột lưu phí hủy**.

## Q-09 — Ca phẫu thuật và phòng mổ (N-17)

- **Nguồn:** N-17 *"Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau"*. R-01 → R-12 không có phẫu thuật; `rooms` (R-06) là *phòng khám bệnh* và `appointments` **không** tham chiếu `rooms`.
- **Câu hỏi:**
  1. Ca phẫu thuật là một **loại lịch hẹn** (cùng bệnh nhân, bác sĩ, hóa đơn) hay một thực thể riêng?
  2. Phòng mổ là một dòng của `rooms` (thêm loại phòng) hay danh mục riêng?
  3. Ê-kíp có nhiều người (liên quan Q-03)? Cần thời gian dọn / chuẩn bị giữa hai ca không?
  4. Phẫu thuật có hóa đơn, dịch vụ, đặt cọc như lịch khám không?
- **Hệ quả cho thiết kế:** cách chặn trùng giống N-02 (`EXCLUDE … (room_id WITH =, tstzrange(...) WITH &&)`), nhưng cột `room_id` phải nằm ở bảng đúng — chưa biết là bảng nào. Làm bây giờ là đoán.
- **Giả định tạm:** chưa mô hình hóa. **Chưa dựng bảng.**

## Q-10 — Quan hệ bảo hộ: kết thúc và loại quan hệ (N-03)

- **Nguồn:** N-03 *"ghi được quan hệ bảo hộ (ai bảo hộ ai, từ ngày nào)"*.
- **Đã áp:** `guardianships(patient_id, guardian_person_id, starts_on)`, unique theo `(patient_id, guardian_person_id)`; người bảo hộ trỏ về `people` nên bác sĩ hay lễ tân đều làm người bảo hộ được.
- **Câu hỏi:**
  1. Bảo hộ có kết thúc không (đủ 18 tuổi, đổi người giám hộ)? Cần biết "hiện còn bảo hộ" hay chỉ cần lịch sử?
  2. Có cần loại quan hệ (cha / mẹ / người giám hộ pháp lý) và ai có quyền ký đồng ý không?
  3. Một bệnh nhân nhiều người bảo hộ cùng lúc có hợp lệ không?
- **Giả định tạm:** không có ngày kết thúc (nếu cần: thêm `ended_on date`, đổi unique thành `(patient_id, guardian_person_id, starts_on)`); không phân loại; nhiều người cùng lúc được.

## Q-11 — Ảnh khuôn mặt bệnh nhân, kể cả trẻ em (N-20)

- **Nguồn:** N-20 *"lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) để nhận diện … giữ vô thời hạn; mọi lễ tân đều xem được"*; R-10 *"lễ tân chỉ thấy dữ liệu phòng khám của mình"*.
- **Vì sao chưa làm:** đây là dữ liệu sinh trắc học gắn với dữ liệu sức khỏe, của cả trẻ em — nhóm dữ liệu cá nhân nhạy cảm theo pháp luật về bảo vệ dữ liệu cá nhân (ví dụ Nghị định 13/2023/NĐ-CP; cần pháp chế đối chiếu). Ba chi tiết của N-20 đều ngược hướng bảo vệ: *vô thời hạn*, *mọi lễ tân*, *trẻ em*. Chưa có đáp án thì chưa nên có bảng.
- **Câu hỏi:**
  1. Mục đích: **so khớp khuôn mặt tự động** (cần đặc trưng khuôn mặt — nặng hơn nhiều) hay chỉ **hiển thị ảnh** để lễ tân đối chiếu khi bệnh nhân đến?
  2. Căn cứ đồng ý: ai đồng ý (với trẻ em: người bảo hộ trong `guardianships`), đồng ý ghi ở đâu, rút lại thì xóa thế nào?
  3. Thời hạn lưu: "vô thời hạn" có chấp nhận được khi bệnh nhân ngừng khám, hoặc đã ẩn hồ sơ (N-13)?
  4. Ai xem: *mọi lễ tân* của mọi phòng khám mâu thuẫn R-10 (chỉ phòng khám của mình). Chọn phạm vi nào; có ghi nhật ký mỗi lần xem không?
  5. Nơi lưu: ảnh để ở kho tệp mã hóa, CSDL chỉ giữ khóa tham chiếu — BA / đội kỹ thuật xác nhận.
- **Giả định tạm:** không lưu ảnh. **Chưa dựng bảng.**

## Q-12 — Thời lượng lịch hẹn cũ và nguồn của `ends_at` (N-02)

- **Nguồn:** N-02 *"mỗi lịch hẹn có giờ bắt đầu và giờ kết thúc"*; `Q-02` (DATA-DICTIONARY) hỏi đúng chuyện này và nay đã có đáp án về cấu trúc.
- **Đã áp:** `appointments.ends_at NOT NULL`; ràng buộc loại trừ chống trùng lịch bác sĩ (DATA-DICTIONARY mục 5).
- **Câu hỏi:**
  1. Lịch hẹn **đang có** chỉ có `starts_at`. Thời lượng mặc định để điền `ends_at` cho dòng cũ là bao nhiêu? Nếu dữ liệu cũ đã có hai lịch trùng của một bác sĩ, ràng buộc mới sẽ **từ chối** việc chuyển dữ liệu — cần danh sách các cặp trùng để phòng khám xử lý trước.
  2. Từ nay `ends_at` do lễ tân nhập tay hay suy từ dịch vụ (cần `services.duration_minutes`)?
  3. Hai ca liền kề (ca này kết thúc đúng giờ ca kia bắt đầu) có hợp lệ không? (đang cho phép.) Cần khoảng nghỉ giữa hai ca không?
- **Giả định tạm:** 30 phút cho dữ liệu cũ; liền kề được; `ends_at` nhập tay. Con số 30 phút là **giả định**, không có nguồn.

## Q-13 — Tiền đặt cọc và dòng tiền (N-05)

- **Nguồn:** N-05 *"Lịch hẹn có thể kèm một khoản đặt cọc bằng tiền, ghi ngày nhận cọc"*.
- **Đã áp:** `appointments.deposit_amount` + `appointments.deposit_received_on` (một cọc một lịch hẹn).
- **Câu hỏi:**
  1. Cọc có **trừ vào hóa đơn** khi khám xong không? Có **hoàn** khi hủy (R-12) không?
  2. Cọc tính vào **doanh thu** ngày nhận cọc hay ngày khám (R-11)?
  3. Một lịch hẹn có thể có nhiều khoản cọc (cọc thêm) không?
- **Hệ quả cho thiết kế:** cọc nằm trên `appointments` nên **không** nằm trong `payments`; báo cáo doanh thu đọc từ `payments` sẽ không thấy cọc. Nếu cọc phải trừ / hoàn như tiền thật thì nó nên là một dòng ở sổ tiền (`payments` hiện bắt buộc `invoice_id`, hóa đơn lại chỉ có sau khi khám) hoặc một bảng riêng — đổi cấu trúc.
- **Giả định tạm:** cọc chỉ ghi nhận; một khoản mỗi lịch hẹn; chưa nối với hóa đơn.
