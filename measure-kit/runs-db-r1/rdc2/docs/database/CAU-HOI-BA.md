# CÂU HỎI CHO BA — lượt cập nhật schema v1.0 → v1.1 (07/10/2026)

> Phát sinh khi áp 20 nhu cầu dữ liệu `N-01 → N-20` (`1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md`) vào `schema.dbml`. BA vắng mặt trong lượt này: mỗi câu kèm **giả định tạm** đã dùng để đi tiếp. Mã bắt đầu từ `Q-03` (`Q-01`, `Q-02` ở `DATA-DICTIONARY.md` mục 2).
>
> **Câu chặn dựng bảng** — `Q-03` · `Q-04` · `Q-05` · `Q-06` · `Q-07`: chưa có bảng nào cho các câu này. Còn lại (`Q-08` → `Q-13`) schema đã dựng theo giả định tạm; đổi đáp án thì sửa phần nêu ở "Hệ quả".

| Mã | Chặn dựng bảng? | Nhu cầu | Chủ đề |
|---|---|---|---|
| Q-03 | Có | N-16 ↔ R-04 | Ca khám nhóm mâu thuẫn "đúng một bác sĩ" |
| Q-04 | Có | N-17 | Phẫu thuật và phòng mổ chưa có trong mô hình |
| Q-05 | Có | N-18 | Gói trị liệu chưa có trong mô hình |
| Q-06 | Có | N-20 | Ảnh khuôn mặt — sinh trắc học, trẻ em, vô thời hạn |
| Q-07 | Có (đề xuất thay thế) | N-14 ↔ R-09 | Lưu mật khẩu đọc được |
| Q-08 | Không | N-09 | Vòng đời trạng thái lịch hẹn còn thiếu |
| Q-09 | Không | N-02 | Giờ kết thúc dữ liệu cũ; trạng thái nào nhả giờ |
| Q-10 | Không | N-01 | Chốt giá lúc nào; giá lịch sử của dữ liệu cũ |
| Q-11 | Không | N-05 | Đặt cọc: trừ hóa đơn, hoàn, doanh thu |
| Q-12 | Không | N-04 | Cấp lại mã hồ sơ đã ẩn |
| Q-13 | Không | N-03 | Quan hệ bảo hộ: kết thúc, nhiều người |

---

## Q-03 — Ca khám nhóm có hai bác sĩ trở lên, trong khi R-04 đã chốt "đúng một bác sĩ"

- **Nguồn:** `N-16` ("từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn") **trái** `R-04` ("mỗi lịch hẹn có đúng một bác sĩ phụ trách", đã chốt) và đang được thực hiện bởi `appointments.doctor_id`.
- **Câu hỏi:** R-04 được sửa, hay N-16 hiểu là một bác sĩ chính cộng người tham gia?
  - (a) **Giữ R-04**: một bác sĩ *phụ trách* (`appointments.doctor_id`) + bảng người tham gia thêm.
  - (b) **Sửa R-04** thành "một hoặc nhiều bác sĩ": bỏ `appointments.doctor_id`, dùng bảng nối `appointment_doctors`.
  - (c) Ca nhóm là **nhiều lịch hẹn** (mỗi bác sĩ một lịch) gom bằng một mã nhóm.
- **Hệ quả:** (b) đổi cột lõi của bảng lõi — mọi báo cáo "doanh thu theo bác sĩ" (`R-11`) phải quyết hóa đơn chia cho ai. Ràng buộc chống trùng giờ của `N-02` (đang là `EXCLUDE` trên `appointments.doctor_id`) **không còn đúng** ở (a) và (b): bác sĩ tham gia cũng không được trùng giờ, mà ràng buộc loại này cần cả cột bác sĩ lẫn cột giờ nằm cùng một bảng — phải chép `starts_at`/`ends_at` sang bảng nối hoặc chọn (c).
- **Giả định tạm:** chưa dựng gì. `appointments` giữ một `doctor_id`.

## Q-04 — Phẫu thuật và phòng mổ

- **Nguồn:** `N-17`. Yêu cầu đã chốt `R-01 → R-12` **không có** phẫu thuật; `rooms` (`R-06`) là *phòng khám bệnh* và hiện **không nối vào** `appointments` (không có `room_id`).
- **Câu hỏi:**
  1. Phẫu thuật là một loại lịch hẹn hay thực thể riêng (có hồ sơ mổ, kíp mổ)?
  2. Phòng mổ là `rooms` thêm một loại phòng, hay bảng riêng?
  3. Ai tham gia ca mổ (bác sĩ mổ chính, phụ, gây mê)? — chạm `Q-03`.
  4. Ca mổ có thời lượng/giờ kết thúc, trạng thái, hóa đơn riêng không?
- **Hệ quả:** quy tắc không trùng phòng sẽ dùng đúng khuôn của `N-02` (`EXCLUDE` trên `room_id` + khoảng giờ) nhưng cần biết bảng nào mang `room_id`. Nếu phẫu thuật là lịch hẹn thì `appointments` phải thêm `room_id`; nếu riêng thì cần bảng `surgeries`.
- **Giả định tạm:** chưa dựng gì.

## Q-05 — Gói trị liệu và số buổi còn lại

- **Nguồn:** `N-18`. Mô hình hiện **không có** khái niệm gói, buổi điều trị, hay mua trước.
- **Câu hỏi:**
  1. Gói là một dịch vụ (`services`) hay đối tượng riêng (số buổi, hạn dùng, giá gói)?
  2. Mua gói qua hóa đơn nào? Gói có hạn dùng, có hoàn lại buổi chưa dùng không?
  3. Buổi bị trừ khi lịch hẹn ở trạng thái nào (`arrived` hay `done`)? Hủy hoặc vắng mặt có trừ không?
  4. Một gói dùng cho một bệnh nhân hay chia sẻ (ví dụ người bảo hộ — `Q-13`)?
- **Hệ quả:** **không lưu "số buổi còn lại" thành cột trên `patients`** — đó là giá trị suy ra (`tổng buổi đã mua − buổi đã dùng`); lưu sẵn sẽ lệch khi buổi bị hủy/đổi trạng thái/hoàn tiền, và hai lễ tân cùng trừ một lúc sẽ ghi đè nhau. Để lễ tân thấy ngay, dùng truy vấn hoặc view, không dùng cột. Cần trả lời 1–4 mới dựng được bảng gói và bảng buổi đã dùng.
- **Giả định tạm:** không thêm cột nào vào `patients`.

## Q-06 — Ảnh khuôn mặt bệnh nhân (kể cả trẻ em), giữ vô thời hạn, mọi lễ tân xem được

- **Nguồn:** `N-20`; liên quan `R-10` (lễ tân chỉ thấy dữ liệu phòng khám của mình), `R-01`.
- **Vấn đề của chính nhu cầu:**
  - Ảnh khuôn mặt dùng để **nhận diện** là dữ liệu sinh trắc học; ghép với hồ sơ khám là dữ liệu sức khỏe — hai nhóm *dữ liệu cá nhân nhạy cảm* (Nghị định 13/2023/NĐ-CP — **cần pháp chế xác nhận** điều khoản áp dụng). Với trẻ em cần sự đồng ý của cha mẹ/người giám hộ.
  - "Giữ vô thời hạn" không có mục đích lưu trữ đi kèm và không có đường xóa khi bệnh nhân rút đồng ý hoặc bị ẩn (`N-13`).
  - "Mọi lễ tân đều xem được" **mâu thuẫn `R-10`**: lễ tân chỉ được thấy phòng khám của mình.
- **Câu hỏi:**
  1. Mục đích: lễ tân đối chiếu bằng mắt, hay máy nhận diện (có lưu vector/đặc trưng khuôn mặt không)?
  2. Căn cứ đồng ý: ai đồng ý cho trẻ em; đồng ý lưu ở đâu, rút lại thế nào?
  3. Thời hạn lưu và việc xóa khi bệnh nhân bị ẩn.
  4. Phạm vi xem: theo `R-10` (lễ tân theo phòng khám) hay toàn tổ chức; có nhật ký ai đã xem?
  5. Nơi lưu: tệp ảnh nên ở kho đối tượng được mã hóa; CSDL chỉ giữ tham chiếu.
- **Hệ quả:** nếu vẫn làm, tối thiểu cần các cột/bảng cho đồng ý (ai, khi nào, phiên bản), thời hạn lưu, tham chiếu kho, nhật ký truy cập. Chưa biết 1–4 thì không dựng được.
- **Giả định tạm:** chưa dựng gì.

## Q-07 — N-14 lưu mật khẩu đọc được cho quản trị viên

- **Nguồn:** `N-14` **trái** `R-09` ("mật khẩu không bao giờ lưu nguyên văn", đã chốt). Quản trị viên đọc được mật khẩu bác sĩ = một người có thể đăng nhập thay bác sĩ trên hồ sơ y tế mà không để lại dấu vết; rò rỉ CSDL là lộ mật khẩu mà người dùng hay dùng lại ở nơi khác.
- **Nhu cầu thật phía sau:** hỗ trợ bác sĩ quên mật khẩu.
- **Đề xuất thay thế để BA xác nhận:** quản trị viên bấm "đặt lại mật khẩu" → hệ thống phát một liên kết/mã **dùng một lần, có hạn** → bác sĩ tự đặt mật khẩu mới. Dữ liệu cần: bảng `password_reset_tokens` (`user_id`, `token_hash`, `expires_at`, `used_at`, `created_by`) — chỉ lưu **băm** của mã.
- **Hệ quả:** nếu BA xác nhận thì dựng bảng trên; `users` không đổi.
- **Giả định tạm:** **không** lưu mật khẩu đọc được; chưa dựng bảng đặt lại.

## Q-08 — Vòng đời trạng thái lịch hẹn còn thiếu (N-09)

- **Nguồn:** `N-09`; `R-08` (hóa đơn cho lịch hẹn *đã khám*), `N-10` (đếm lần khám *hoàn thành*), `R-12` (hủy trước 2 giờ), `N-13` (tự hủy lịch tương lai).
- **Chỗ thiếu:**
  1. Danh sách của N-09 (*đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy*) **không có "đã khám xong"**, trong khi `done` đang tồn tại từ v1.0 và `R-08`, `N-10` cần nó. `arrived` có thay `done` không, hay `arrived → done`?
  2. `confirmed → cancelled` có được không? N-09 chỉ cho hủy từ `booked`, nhưng R-12 nói bệnh nhân hủy lịch trước giờ hẹn.
  3. `booked → arrived` / `no_show` (khách không qua bước xác nhận) có được không?
  4. Trạng thái cuối (`done`, `no_show`, `cancelled`) có mở lại không?
  5. Có cần ghi **ai hủy, lúc nào, vì sao**? Phân biệt hủy do bệnh nhân (R-12 xét giờ hủy) với hủy tự động do bệnh nhân bị ẩn (N-13, không tính phí).
- **Giả định tạm:** enum 6 giá trị `booked · confirmed · arrived · no_show · done · cancelled`; chuyển được: `booked → confirmed | cancelled`, `confirmed → arrived | no_show`, **thêm `arrived → done`** (cần để R-08/N-10 có nghĩa). Mọi cặp khác bị từ chối ở tầng ứng dụng. Chưa thêm cột `cancelled_at`/`cancel_reason`.
- **Hệ quả:** nếu `arrived` thay `done` thì `N-10` đếm `arrived`, R-08 đổi điều kiện lập hóa đơn, và dòng `done` cũ phải chuyển sang `arrived`. Nếu cần lý do hủy thì thêm cột vào `appointments`.

## Q-09 — Giờ kết thúc lịch hẹn (N-02): dữ liệu cũ và trạng thái nhả giờ

- **Nguồn:** `N-02`; đóng `Q-02` ("lịch hẹn kéo dài bao lâu?") — nay mỗi lịch hẹn có `starts_at` và `ends_at`.
- **Câu hỏi:**
  1. Lịch hẹn đã có từ v1.0 chưa có giờ kết thúc. Điền `ends_at` bằng gì (độ dài chuẩn theo dịch vụ? một độ dài chung?).
  2. Hủy chắc chắn nhả giờ. **Vắng mặt** có nhả không (nhận khách chen vào khung của người vắng)?
  3. Dữ liệu cũ có thể **đã có đặt trùng** bác sĩ; thêm ràng buộc sẽ thất bại nếu chưa xử lý — xử lý trùng cũ thế nào?
- **Giả định tạm:** điền `ends_at = starts_at + 30 phút` cho dữ liệu cũ (🔴 A); `cancelled` và `no_show` nhả giờ. Trước khi thêm `EXCLUDE`, chạy truy vấn tìm cặp trùng và đưa cho BA.
- **Hệ quả:** đổi (2) thì sửa mệnh đề `WHERE` của ràng buộc `ex_appointments_doctor_no_overlap`.

## Q-10 — Chốt "giá lúc khám" vào lúc nào, và giá lịch sử của dữ liệu cũ (N-01)

- **Nguồn:** `N-01`; mục 4 của `DATA-DICTIONARY.md` v1.0 từng ghi tổng tiền "tính từ dịch vụ, tránh lệch khi giá đổi" — thực tế **ngược lại** (lệch khi giá đổi), đã sửa ở v1.1.
- **Câu hỏi:**
  1. "Lúc khám" là lúc dịch vụ được ghi vào lịch hẹn, lúc bệnh nhân đến, hay lúc lập hóa đơn? Giữa lúc đặt và lúc khám bảng giá có thể đổi.
  2. v1.0 **không lưu lịch sử giá**, nên `unit_price` của các dòng cũ không khôi phục được đúng; điền bằng giá hiện hành thì hóa đơn cũ đã qua đổi giá sẽ in sai. Có nguồn giá cũ (hóa đơn giấy, phần mềm trước) không?
  3. Tên dịch vụ trên hóa đơn vẫn đọc từ `services.name` — đổi tên làm hóa đơn cũ in tên mới. Có cần chốt tên không?
- **Giả định tạm:** chép giá khi dịch vụ được ghi vào lịch hẹn, làm mới đúng một lần khi lịch hẹn sang `done`, khóa từ khi có hóa đơn; dòng cũ điền `services.price` hiện hành; tên không chốt.

## Q-11 — Đặt cọc: trừ vào hóa đơn, hoàn, và doanh thu (N-05)

- **Nguồn:** `N-05`; `R-08` (thanh toán/hoàn tiền gắn với hóa đơn), `R-11` (báo cáo doanh thu).
- **Câu hỏi:**
  1. Khi lập hóa đơn, cọc được tính là một khoản đã thanh toán (có dòng trong `payments`) hay trừ riêng?
  2. Lịch bị hủy/vắng mặt: hoàn cọc, giữ cọc, hay giữ một phần? Lịch hủy **không có hóa đơn**, mà hoàn tiền theo R-08 là dòng `payments` âm gắn hóa đơn — không có chỗ ghi.
  3. Cọc nhận bằng hình thức nào (tiền mặt, thẻ, chuyển khoản)?
  4. Cọc có vào doanh thu theo ngày nhận cọc không?
- **Giả định tạm:** hai cột `appointments.deposit_amount` + `deposit_received_on`, cùng null hoặc cùng có; **chưa** tham gia hóa đơn, hoàn tiền, doanh thu.
- **Hệ quả:** nếu cọc là tiền thật cần theo dõi (hoàn/trừ/doanh thu) thì phải là bảng riêng (hoặc `payments` cho phép chưa có hóa đơn), không phải hai cột.

## Q-12 — Cấp lại mã hồ sơ của hồ sơ đã ẩn (N-04)

- **Nguồn:** `N-04`; `N-13` (hóa đơn của hồ sơ ẩn còn nguyên để kế toán đối chiếu).
- **Câu hỏi:**
  1. Hóa đơn/báo cáo kế toán có in **mã hồ sơ** không? Nếu có, hai người khác nhau mang cùng mã ở hai thời điểm → đối chiếu nhầm. Chấp nhận, hay chỉ cấp lại sau một thời hạn, hay lưu mã trên chứng từ?
  2. Khôi phục hồ sơ đã ẩn khi mã đã cấp cho người khác: cấp mã mới?
  3. Mã sinh theo quy tắc nào (tuần tự theo tổ chức, tiền tố theo phòng khám)?
  4. Bệnh nhân hiện có chưa có mã — điền thế nào (client đã có mã giấy chưa)?
- **Giả định tạm:** chỉ mục unique **bộ phận** `WHERE deleted_at IS NULL`; khôi phục va mã thì cấp mã mới; dữ liệu cũ điền tuần tự theo `created_at` trong từng tổ chức; quy tắc sinh mã do ứng dụng quyết.

## Q-13 — Quan hệ bảo hộ có kết thúc, có nhiều người (N-03)

- **Nguồn:** `N-03` chỉ nêu "ai bảo hộ ai, từ ngày nào".
- **Câu hỏi:**
  1. Quan hệ bảo hộ có kết thúc không (trẻ đủ 18 tuổi, đổi người giám hộ)? Nếu có thì cần ngày kết thúc.
  2. Một bệnh nhân có nhiều người bảo hộ đồng thời không?
  3. Có phân loại (cha/mẹ/người giám hộ pháp lý) và người bảo hộ có quyền gì (đặt lịch, xem hồ sơ) không?
- **Giả định tạm:** `guardianships` chỉ có `started_on`, cho phép nhiều người, không phân loại, không có ngày kết thúc.
- **Hệ quả:** có kết thúc thì thêm `ended_on` (null = đang bảo hộ) và đổi khóa duy nhất thành "tối đa một quan hệ đang hiệu lực mỗi cặp".
