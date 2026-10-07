# CÂU HỎI CẦN BA CHỐT — lượt cập nhật schema v1.1 (nhu cầu dữ liệu giai đoạn 2)

> Sinh từ bước phản biện (B2) của lượt áp `NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20) vào `schema.dbml`. BA vắng mặt trong lượt này, nên các mục **không chặn** đã đi tiếp với giả định 🔴 A ghi tại chỗ; các mục **CHẶN** chưa có bảng hay cột nào. Mã `Q-01`, `Q-02` ở `DATA-DICTIONARY.md` mục 2.
>
> Đọc trước: năm mục CHẶN (Q-03 → Q-07). Chín mục còn lại (Q-08 → Q-16) chỉ cần xác nhận hoặc đổi giả định.

| Mã | Nhu cầu | Loại | Mức |
| :--- | :--- | :--- | :--- |
| Q-03 | N-14 | mâu thuẫn R-09 · trái nguyên tắc bảo mật | **CHẶN** |
| Q-04 | N-16 | mâu thuẫn R-04 | **CHẶN** |
| Q-05 | N-17 | thiếu | **CHẶN** |
| Q-06 | N-18 | thiếu · giá trị suy ra | **CHẶN** |
| Q-07 | N-20 | trái quy định dữ liệu cá nhân | **CHẶN** |
| Q-08 | N-09 · N-10 · N-13 | thiếu · mâu thuẫn giữa các nhu cầu | không chặn |
| Q-09 | N-02 | thiếu | không chặn |
| Q-10 | N-01 | mơ hồ | không chặn |
| Q-11 | N-04 · N-13 | vòng đời · hạn lưu | không chặn |
| Q-12 | N-13 · R-12 | không cưỡng chế được | không chặn |
| Q-13 | N-05 | thiếu | không chặn |
| Q-14 | N-19 | cản mở rộng · ra lệnh giải pháp | không chặn |
| Q-15 | N-03 | thiếu | không chặn |
| Q-16 | N-07 | mơ hồ | không chặn |

---

## Mục CHẶN

### Q-03 · N-14 lưu mật khẩu đọc được · mâu thuẫn R-09 · CHẶN

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:20` — "Để hỗ trợ khi bác sĩ quên, **hệ thống ghi lại mật khẩu** để quản trị viên đọc cho họ." Đối chiếu `YEU-CAU-PHONG-KHAM.md:15` — R-09: "mật khẩu không bao giờ lưu nguyên văn."

**Vấn đề:** hai nguồn mâu thuẫn trực tiếp, và N-14 là lệnh giải pháp: nhu cầu thật là *bác sĩ quên mật khẩu thì có người giúp họ vào lại được*. Mật khẩu đọc được nằm trong CSDL sẽ lộ qua bản sao lưu, log, lỗi SQL injection; quản trị viên đọc được nghĩa là bất kỳ ai có quyền admin hoặc đọc được bản sao lưu đều đăng nhập thay được mọi bác sĩ, tức là mở được hồ sơ bệnh nhân. Mật khẩu người ta hay dùng lại ở nơi khác.

**Hệ quả nếu giữ nguyên:** thêm cột kiểu `users.password_plain` (hoặc mã hóa đảo ngược được). Vi phạm R-09 và DB-SEC-04. Skill không dựng.

**Hướng:**
- (a) Quản trị viên đặt lại: bấm "đặt lại", hệ thống sinh mật khẩu tạm dùng một lần, bắt đổi ở lần đăng nhập đầu. Ví dụ: BS Lan quên lúc 08:00, admin đặt lại lúc 08:02, BS Lan vào bằng mã tạm và đổi ngay. Cần thêm cột `users.must_change_password`.
- (b) Tự đặt lại qua email: gửi liên kết dùng một lần, hết hạn sau 30 phút. Cần bảng `password_reset_tokens(user_id, token_hash, expires_at, used_at)`.

**Khuyến nghị (câu thiết kế hệ thống):** bỏ N-14, làm (b) làm đường chính và (a) làm đường dự phòng khi bác sĩ không còn truy cập được email. Cả hai chỉ lưu băm. Lý do: không có thời điểm nào quản trị viên biết được mật khẩu.

**Cần chốt:** bỏ N-14, và chọn (a), (b) hay cả hai.

**Trạng thái:** CHẶN. Chưa thêm gì; `users.password_hash` giữ nguyên.

### Q-04 · N-16 ca khám nhóm có từ hai bác sĩ · mâu thuẫn R-04 · CHẶN

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:22` — "**Ca khám nhóm** (tư vấn gia đình) có **từ hai bác sĩ trở lên** cùng phụ trách một lịch hẹn." Đối chiếu `YEU-CAU-PHONG-KHAM.md:10` — R-04 (đã chốt): "**Mỗi lịch hẹn có đúng một bác sĩ phụ trách.**"

**Vấn đề:** một so với từ hai trở lên. Kéo theo hai chỗ khác: N-02 (không trùng giờ của một bác sĩ) hiện chỉ kiểm trên `appointments.doctor_id`, bác sĩ thứ hai không được phủ; R-11 (doanh thu theo bác sĩ) không nói chia thế nào.

**Tình huống có số:** ca tư vấn gia đình 10:00–11:00, BS Lan (nhi) và BS Minh (tâm lý), hóa đơn 600.000 đồng. BS Minh đã có lịch khác 10:30–11:00. Doanh thu theo bác sĩ: mỗi người ghi 600.000 (tổng báo cáo thành 1.200.000), chia đôi 300.000, hay theo tỷ lệ?

**Hệ quả nếu giữ nguyên:** không dựng được. Giữ R-04 thì N-16 không có chỗ chứa; theo N-16 thì `appointments.doctor_id` (cột đang chạy, có ràng buộc EXCLUDE ở N-02) đổi nghĩa (DB-EVO-06).

**Hướng:**
- (a) Giữ `appointments.doctor_id` là bác sĩ phụ trách chính, thêm bảng nối `appointment_doctors(appointment_id, doctor_id)` cho bác sĩ cùng tham gia. Chống trùng giờ cho bác sĩ phụ phải làm trên bảng nối (chép `starts_at`, `ends_at` sang để EXCLUDE được, hoặc kiểm bằng trigger).
- (b) Bỏ `doctor_id`, mọi bác sĩ vào bảng nối. Sạch hơn về mô hình nhưng là thay đổi phá vỡ cột đang chạy.

**Khuyến nghị (phần cấu trúc, câu thiết kế):** (a), vì không đổi nghĩa cột đang chạy và R-04 vẫn đúng nếu hiểu "phụ trách chính". Hai phần còn lại là chính sách vận hành nên **không gắn khuyến nghị**: bác sĩ phụ có bị chặn trùng giờ không, và doanh thu chia thế nào.

**Cần chốt:** (1) sửa R-04 thành "từ một bác sĩ trở lên" hay giữ "một phụ trách chính cộng người tham gia"; (2) bác sĩ phụ có bị chặn trùng giờ không; (3) cách chia doanh thu.

**Trạng thái:** CHẶN. `doctor_id` giữ nguyên; EXCLUDE của N-02 chỉ phủ bác sĩ chính.

### Q-05 · N-17 ca phẫu thuật và phòng mổ · thiếu · CHẶN

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:23` — "**Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau.**"

**Vấn đề:** không nguồn nào định nghĩa *ca phẫu thuật* hay *phòng mổ*. R-06 chỉ có phòng khám bệnh (`rooms`), và `appointments` không có `room_id` (v1.0 không gán phòng cho lịch hẹn). Chưa rõ: ca mổ là một loại lịch hẹn hay thực thể riêng; có bệnh nhân và bác sĩ mổ nào, kéo dài bao lâu, ai nhập giờ kết thúc; phòng mổ là một loại của `rooms` hay bảng riêng; ca mổ có chiếm giờ bác sĩ theo N-02 không.

**Hệ quả nếu giữ nguyên:** không có dữ kiện (phòng, giờ bắt đầu, giờ kết thúc) để cưỡng chế bằng EXCLUDE; kiểm ở ứng dụng sẽ lọt khi hai lễ tân đặt cùng lúc.

**Hướng:**
- (a) Ca mổ là lịch hẹn có loại `surgery` kèm `room_id`, phòng mổ là `rooms` có loại. Dùng lại cơ chế EXCLUDE. Ví dụ: phòng mổ 1 có ca 08:00–10:30 và ca 10:00–12:00 thì bị chặn.
- (b) Bảng `surgeries` riêng, đúng hơn nếu ca mổ có kíp mổ nhiều người, thời gian chuẩn bị và hồi sức. Ví dụ: phòng cần 30 phút dọn sau mỗi ca, ca 08:00–10:00 thì ca kế phải từ 10:30.

**Khuyến nghị (thiết kế):** (a) nếu ca mổ chỉ có một bác sĩ và một bệnh nhân; (b) nếu có kíp mổ hoặc thời gian dọn phòng, và khi đó nó chạm Q-04. Chưa chốt được khi chưa biết ca mổ gồm những ai.

**Cần chốt:** ca mổ có những vai nào; có thời gian dọn phòng không; ai nhập giờ kết thúc; phòng mổ có thuộc một phòng khám cụ thể không.

**Trạng thái:** CHẶN. Chưa dựng bảng nào.

### Q-06 · N-18 số buổi điều trị còn lại của gói trị liệu · thiếu · giá trị suy ra · CHẶN

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:24` — "**Lưu số buổi điều trị còn lại** của gói trị liệu trên hồ sơ bệnh nhân để lễ tân nhìn thấy ngay."

**Vấn đề:** hai chuyện. (1) *Gói trị liệu* không tồn tại trong R-01 → R-12 hay schema: ai bán, giá, bao nhiêu buổi, hạn dùng, mỗi buổi gắn với lịch hẹn nào. (2) *Số buổi còn lại* là giá trị suy ra (tổng buổi trừ buổi đã dùng); lưu trên `patients` sẽ lệch.

**Kịch bản lệch (DB-REQ-06):** gói 10 buổi, đã dùng 4, cột ghi còn 6. Lễ tân hủy lịch của buổi thứ 4 đã trừ mà quên cộng lại: cột vẫn 6 trong khi thật ra còn 7, và sai mãi tới khi ai đó sửa tay. Một bệnh nhân mua hai gói chồng nhau cũng không vừa một cột trên hồ sơ.

**Hướng:**
- (a) Bảng gói `treatment_packages(patient_id, total_sessions, price, purchased_at, expires_at)`, mỗi lịch hẹn trừ buổi trỏ vào gói; "còn lại" suy ra bằng đếm. Lễ tân vẫn thấy ngay vì một bệnh nhân chỉ có vài chục buổi.
- (b) Lưu bộ đếm kèm khai báo nguồn, cơ chế đồng bộ, độ trễ 0 — chỉ khi đo thấy (a) chậm.

**Khuyến nghị (phần lưu hay suy ra, câu thiết kế):** (a), không lưu cột đếm. Phần chính sách gói **không gắn khuyến nghị**: bán trả trước hay trả từng buổi, hạn dùng, hoàn tiền buổi chưa dùng, vắng mặt có trừ buổi không (chạm Q-08).

**Cần chốt:** gói trị liệu là gì và vòng đời của nó; một lịch hẹn trừ mấy buổi; vắng mặt có trừ không.

**Trạng thái:** CHẶN. Không thêm cột vào `patients`.

### Q-07 · N-20 ảnh khuôn mặt bệnh nhân, kể cả trẻ em · trái quy định dữ liệu cá nhân · CHẶN

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:26` — "**Lưu ảnh khuôn mặt bệnh nhân** (kể cả trẻ em) để nhận diện khi đến khám; **giữ vô thời hạn**; mọi lễ tân đều xem được."

**Vấn đề:** ảnh khuôn mặt dùng để nhận diện là dữ liệu sinh trắc, lại là của trẻ em: mức nhạy cảm cao nhất trong schema. Ba chi tiết trong câu đều ngược nguyên tắc thu tối thiểu: *vô thời hạn* (không có đường xóa thật), *mọi lễ tân* (quyền xem rộng hơn cần-biết, và còn lệch R-10: lễ tân chỉ thấy dữ liệu phòng khám của mình, nên "mọi" ở đây là mọi lễ tân của một phòng khám hay của cả chuỗi?), *kể cả trẻ em* (cần người bảo hộ đồng ý, `guardianships` của N-03 là chỗ ghi được).

**Tình huống có số:** bé 6 tuổi khám hai lần năm 2026 rồi không quay lại. Đến 2031 ảnh vẫn nằm trong hệ thống, 5 năm không ai dùng. Lễ tân phòng khám Hà Nội mở được ảnh bé khám ở HCM không?

**Hệ quả nếu giữ nguyên:** cột hoặc bảng ảnh không hạn lưu, không đường xóa, không nhật ký ai đã xem. Vi phạm DB-REQ-09, DB-SEC-05, DB-SEC-06, DB-SEC-07.

**Hướng:**
- (a) Không nhận diện bằng mặt: đối chiếu bằng mã hồ sơ, số điện thoại, ngày sinh. Không thu ảnh.
- (b) Có ảnh nhưng thu tối thiểu: hạn lưu (ví dụ xóa thật sau 24 tháng không đến khám), quyền xem tách riêng cho vai cần, ghi nhật ký mỗi lần xem, tệp ở kho đối tượng mã hóa ngoài CSDL, trẻ em có đồng ý của người bảo hộ, bệnh nhân rút lại được.
- (c) Ảnh chỉ để lễ tân nhìn đối chiếu bằng mắt, không dùng nhận diện tự động.

**Khuyến nghị (phần kỹ thuật, câu thiết kế):** nếu vẫn giữ ảnh thì tệp để ngoài CSDL, CSDL chỉ giữ khóa tham chiếu và siêu dữ liệu. Phần mục đích, hạn lưu, vai được xem là quyết định chính sách và pháp lý **không gắn khuyến nghị**.

**Cần chốt:** mục đích (nhận diện tự động hay lễ tân nhìn); hạn lưu; vai nào xem và có phạm vi theo phòng khám không; trẻ em có cần đồng ý của người bảo hộ; đường xóa khi bệnh nhân rút lại.

**Trạng thái:** CHẶN. Chưa dựng bảng ảnh.

---

## Mục không chặn — đã đi tiếp với giả định 🔴 A

### Q-08 · N-09 trạng thái lịch hẹn, N-10, N-13 · thiếu · mâu thuẫn giữa các nhu cầu

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:15` N-09 — năm trạng thái *đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy*; từ *đã xác nhận* sang *đã đến* hoặc *vắng mặt*; từ *đã đặt* sang *đã xác nhận* hoặc *đã hủy*. Cùng file: dòng 16 N-10 "tổng số lần khám **đã hoàn thành**"; dòng 19 N-13 "lịch hẹn tương lai của người đó thì **tự hủy**". `YEU-CAU-PHONG-KHAM.md:14` R-08 "lịch hẹn **đã khám**".

**Vấn đề:**
1. N-09 không có trạng thái *hoàn thành*, trong khi N-10 và R-08 cần phân biệt đã khám xong. v1.0 đang có giá trị `done` và đã có dữ liệu. *Đã đến* là đã khám xong hay mới check-in?
2. N-09 không cho đi từ *đã xác nhận* sang *đã hủy*, nhưng N-13 tự hủy mọi lịch tương lai, kể cả lịch đã xác nhận.
3. Chưa nêu: từ *đã đặt* sang *vắng mặt*; sau *đã đến* thì đi đâu.

**Tình huống có số:** BN A có lịch 09:00 ngày mai, đã xác nhận. 15:00 hôm nay lễ tân ẩn hồ sơ A (N-13). Theo N-09 lịch đó không hủy được: nó vẫn chiếm giờ bác sĩ (N-02) mà bệnh nhân không còn trong danh sách.

**Hướng:** (a) cho *đã xác nhận → đã hủy* với mọi nguồn hủy; (b) chỉ cho hủy tự động của hệ thống đi qua đường này, bệnh nhân tự hủy lịch đã xác nhận thì không; (c) N-13 không tự hủy lịch đã xác nhận mà báo lễ tân xử lý. Với ý 1: giữ `done` sau `arrived`, hay gộp *đã đến* và *hoàn thành* thành một.

**Giả định đang dùng:** giữ `done`; `arrived → done`; ứng dụng cho phép hủy tự động từ cả `booked` và `confirmed`; máy trạng thái cưỡng chế ở ứng dụng bằng `UPDATE … WHERE status = <gốc>`. Enum thêm `confirmed`, `arrived`, `no_show`; không bỏ giá trị nào.

**Cần chốt:** ý 1, ý 2 (chọn a, b hoặc c), ý 3. Câu chính sách nghiệp vụ nên **không gắn khuyến nghị**.

### Q-09 · N-02 giờ kết thúc, dữ liệu cũ, trạng thái chiếm giờ · thiếu

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:8` — "Hệ thống **không cho một bác sĩ có hai lịch hẹn trùng thời gian**. Mỗi lịch hẹn có giờ bắt đầu và giờ kết thúc." Q-02 cũ ở `DATA-DICTIONARY.md` hỏi đúng chỗ này.

**Vấn đề:** N-02 trả lời *có cần giờ kết thúc* (có, đã thêm `appointments.ends_at`), nhưng chưa nói ba điều: (1) độ dài lịch hẹn lấy từ đâu; (2) lịch hẹn cũ của v1.0 chỉ có `starts_at`, điền `ends_at` thế nào; (3) lịch nào còn chiếm giờ.

**Tình huống có số:** v1.0 từng cho BS Lan có lịch 09:00 và 09:15 cùng ngày. Nếu gán mọi lịch cũ 30 phút thì hai lịch này chồng nhau, và EXCLUDE không tạo được cho đến khi dọn. Một lịch 09:00–09:30 chuyển sang *vắng mặt* lúc 09:15, bệnh nhân vãng lai đến lúc 09:15 xin khám 09:15–09:45: có cho đặt không?

**Hướng độ dài:** (a) mọi lịch 30 phút; (b) theo dịch vụ, cần cột `services.duration_minutes`; (c) người đặt tự chọn giờ kết thúc. Đây là chính sách vận hành nên **không gắn khuyến nghị**.

**Giả định đang dùng:** `ends_at` là cột lưu, ứng dụng quyết giá trị; trùng tính **theo bác sĩ**, trên khoảng nửa mở `[starts_at, ends_at)` (09:00–09:30 và 09:30–10:00 không trùng); trạng thái `cancelled` và `no_show` **không** chiếm giờ.

**Khuyến nghị cho việc chuyển dữ liệu cũ (thiết kế):** trước khi tạo EXCLUDE, chạy truy vấn đếm cặp lịch chồng nhau của cùng bác sĩ rồi dọn; EXCLUDE trong PostgreSQL không có `NOT VALID` nên không thể thêm dần.

**Cần chốt:** hướng (a), (b) hay (c); xử lý lịch cũ chồng nhau; `no_show` có giải phóng giờ không.

### Q-10 · N-01 giá lúc khám · mơ hồ

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:7` — "Hóa đơn phải in đúng **giá dịch vụ lúc khám**, dù sau đó bảng giá đổi."

**Mơ hồ:** *lúc khám* là lúc đặt lịch hay lúc bệnh nhân đến? Tình huống có số: khám tổng quát `KHAM-TQ` giá 200.000 đồng lúc đặt (01/10), tăng 250.000 từ 05/10, bệnh nhân khám ngày 08/10: hóa đơn in 200.000 hay 250.000? Câu thứ hai: sau khi đã phát hành hóa đơn, lễ tân sửa số lượng dịch vụ của lịch hẹn thì hóa đơn có đổi không? Câu thứ ba: tên dịch vụ đổi thì hóa đơn cũ in tên cũ hay tên mới?

**Hướng chốt giá:** (a) lúc ghi dòng dịch vụ vào lịch hẹn; (b) ghi lại khi lịch hẹn sang *đã đến*; (c) khi phát hành hóa đơn.

**Giả định đang dùng:** thêm `appointment_services.unit_price` (snapshot, chép từ `services.price`); ứng dụng được cập nhật cột này tới khi lịch hẹn có hóa đơn; **khuyến nghị trigger** chặn sửa hoặc xóa dòng sau khi có hóa đơn (hóa đơn không đổi sau phát hành); tên dịch vụ **không** đóng băng. Dữ liệu cũ: backfill `unit_price` bằng `services.price` hiện hành, nên hóa đơn cũ đã in sai (nếu giá từng đổi) không khôi phục được.

**Cần chốt:** (a), (b) hay (c). Chính sách giá **không gắn khuyến nghị**; trigger là câu thiết kế, khuyến nghị đã nêu.

### Q-11 · N-04 và N-13 mã hồ sơ cấp lại, khôi phục, hạn lưu hồ sơ ẩn · vòng đời

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:10` — "mã của hồ sơ đã ẩn **được cấp lại** cho người khác"; dòng 19 — ẩn bệnh nhân thì hóa đơn và thanh toán "vẫn phải còn để kế toán đối chiếu".

**Vấn đề:**
1. *Khôi phục hồ sơ ẩn*: hồ sơ `BN-000123` ẩn tháng 3, mã cấp cho người khác tháng 5, tháng 8 muốn khôi phục thì trùng mã. Cấp mã mới cho hồ sơ khôi phục?
2. *Đối chiếu*: kế toán tra hóa đơn của người đã ẩn bằng mã `BN-000123` sẽ thấy hai người mang cùng mã. Mã có in lên hóa đơn hay giấy tờ không?
3. *Hạn lưu*: ẩn chỉ là `deleted_at`, toàn bộ tên, số điện thoại, ngày sinh, dị ứng, bảo hiểm vẫn còn. Soft delete không phải xóa thật (DB-SEC-06). Giữ bao lâu, sau đó xóa thật hay ẩn danh? Kế toán cần giữ hóa đơn bao lâu?
4. *Tạo lại hồ sơ cho cùng một người*: `patients.person_id` đang UNIQUE (v1.0, nợ cũ DB-IDX-12), nên sau khi ẩn nhầm hồ sơ của chị Lan, lễ tân không tạo được hồ sơ mới cho cùng người vì hồ sơ ẩn vẫn chiếm chỗ. Có cho tạo lại không, hay chỉ cho khôi phục?

**Giả định đang dùng:** unique mã chỉ tính hồ sơ chưa ẩn (`WHERE deleted_at IS NULL`, ghi trong Note); khôi phục thì ứng dụng cấp mã mới nếu mã cũ đã bị cấp lại; hóa đơn tham chiếu bệnh nhân bằng id, không bằng mã; hạn lưu hồ sơ ẩn: chưa có, giữ không hạn cho tới khi BA chốt; `patients.person_id` giữ UNIQUE như v1.0 (chưa đổi vì đổi là mở khả năng một người có hai hồ sơ, đụng R-03). Chưa dựng cột `purged_at` vì chưa có đáp án.

**Cần chốt:** bốn ý trên. Chính sách vận hành **không gắn khuyến nghị**.

### Q-12 · N-13 hủy tự động và R-12 phí hủy muộn · không cưỡng chế được

**Nguồn:** `YEU-CAU-PHONG-KHAM.md:18` — R-12: "Bệnh nhân hủy lịch trước giờ hẹn 2 tiếng thì không tính phí." `NHU-CAU-DU-LIEU-MOI.md:19` — N-13 tự hủy lịch tương lai khi ẩn bệnh nhân.

**Vấn đề:** R-12 ngụ ý hủy muộn hơn 2 tiếng thì bị tính phí, nhưng v1.0 không có cột thời điểm hủy lẫn phí, nên rule này chưa kiểm được bằng dữ liệu (DB-REQ-01). N-13 thêm một đường hủy mới do hệ thống làm.

**Tình huống có số:** lễ tân ẩn hồ sơ BN lúc 08:00, hệ thống tự hủy lịch 09:30 cùng ngày (còn 1 giờ 30 phút, ít hơn 2 giờ). Có tính phí không? Ai là người hủy: bệnh nhân hay hệ thống?

**Hướng:** (a) thêm `appointments.cancelled_at` và loại người hủy (bệnh nhân, phòng khám, hệ thống), phí tính khi người hủy là bệnh nhân và `starts_at − cancelled_at < 2 giờ`; (b) bảng lịch sử trạng thái `appointment_status_history`, cũng phục vụ Q-08; (c) hủy do phòng khám hoặc hệ thống không bao giờ tính phí.

**Trạng thái:** chưa dựng cột nào, vì phí bao nhiêu và ghi vào đâu chưa có đáp án. Chính sách phí **không gắn khuyến nghị**.

**Cần chốt:** phí hủy muộn là gì và ghi ở đâu; hủy tự động có tính không.

### Q-13 · N-05 số phận tiền cọc · thiếu

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:11` — "Lịch hẹn có thể kèm một khoản **đặt cọc** bằng tiền, ghi ngày nhận cọc."

**Vấn đề:** N-05 chỉ nói ghi nhận lúc nhận. Chưa nói cọc đi đâu sau đó. Tình huống có số: cọc 100.000 đồng cho lịch 09:00. (1) Khám xong, hóa đơn 400.000: bệnh nhân trả thêm 300.000 hay 400.000? (2) Hủy trước 2 tiếng (R-12): hoàn 100.000? (3) Vắng mặt: mất cọc? Mỗi trường hợp ghi vào đâu: dòng âm trong `payments`, hay sổ cái cọc riêng?

**Giả định đang dùng:** bảng `appointment_deposits`, tối đa một khoản mỗi lịch hẹn, chỉ có số tiền và ngày nhận; chưa có trừ cọc, hoàn cọc, phương thức nhận.

**Cần chốt:** ba tình huống trên; có nhiều khoản cọc cho một lịch hẹn không. Chính sách **không gắn khuyến nghị**.

### Q-14 · N-19 bảng lịch hẹn riêng cho từng chi nhánh · cản mở rộng · ra lệnh giải pháp

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:25` — "**Mỗi chi nhánh có bảng lịch hẹn riêng** (`appointments_hn`, `appointments_hcm`, `appointments_dn`) để báo cáo từng chi nhánh chạy nhanh."

**Đã đọc lại thành nhu cầu:** *báo cáo từng chi nhánh phải chạy nhanh*. Skill **không dựng** ba bảng, vì: thêm chi nhánh thứ tư là thêm bảng và sửa mọi truy vấn toàn chuỗi (DB-REQ-07); chống trùng giờ bác sĩ của N-02 không phủ được qua ba bảng (bác sĩ làm hai chi nhánh); `invoices.appointment_id` không trỏ được tới ba bảng cùng lúc.

**Số đo (từ Q-01, 🔴 A):** khoảng 2.000 lịch hẹn mỗi ngày toàn chuỗi, ba phòng khám, tức khoảng 670 mỗi ngày mỗi phòng khám, khoảng 243.000 dòng mỗi năm mỗi phòng khám. Báo cáo một phòng khám một tháng đọc khoảng 20.000 dòng qua index `(organization_id, clinic_id, starts_at)` đã có sẵn.

**Đã làm:** giữ một bảng `appointments`; khai access pattern AP-05 trong `schema-lint.json`. Phương án nới nếu đo thấy vẫn chậm: phân vùng theo tháng của `starts_at`, hoặc bảng tổng hợp theo ngày và phòng khám (DB-PERF-07).

**Khuyến nghị (câu thiết kế hệ thống):** giữ một bảng.

**Cần chốt:** BA xác nhận nhu cầu thật là "báo cáo nhanh" chứ không phải "tách dữ liệu theo chi nhánh để phân quyền" (phần phân quyền R-10 xử ở tầng quyền đọc).

### Q-15 · N-03 kết thúc bảo hộ · thiếu

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:9` — "Cần ghi được quan hệ bảo hộ (ai bảo hộ ai, **từ ngày nào**)." Chỉ có ngày bắt đầu.

**Vấn đề:** quan hệ bảo hộ có lúc kết thúc (đủ 18 tuổi, đổi người bảo hộ). Tình huống có số: bé 15 tuổi; BS Lan bảo hộ từ 01/01/2026; ba mẹ nhận lại bảo hộ từ 01/06/2026. Ghi hai dòng hay sửa một dòng? Một bệnh nhân có nhiều người bảo hộ cùng lúc không, có người bảo hộ chính không?

**Giả định đang dùng:** thêm `guardianships.ended_on` (cho phép rỗng); một bệnh nhân có nhiều người bảo hộ cùng lúc; mỗi giai đoạn một dòng. Phần "lễ tân đồng thời là bệnh nhân, bác sĩ là người bảo hộ" không cần bảng mới: `people` đã tách danh tính khỏi vai.

**Cần chốt:** ba ý trên. Chính sách **không gắn khuyến nghị**.

### Q-16 · N-07 danh mục chất gây dị ứng · mơ hồ

**Nguồn:** `NHU-CAU-DU-LIEU-MOI.md:13` — "nhiều dị ứng (**tên chất**, mức độ nặng/nhẹ); lễ tân tra được bệnh nhân **theo từng chất** gây dị ứng."

**Mơ hồ:** *tên chất* là chữ tự do hay chọn từ danh mục? Tình huống có số: lễ tân gõ "Penicillin", người khác gõ "penicilin". Nếu chữ tự do thì tra theo chất trả về hai tập bệnh nhân, và bệnh nhân dị ứng Penicillin bị sót khi tra bằng cách viết kia.

**Giả định đang dùng:** danh mục `allergens` theo tổ chức (tên duy nhất không phân biệt hoa thường), nhân viên thêm chất mới khi tra không thấy; mức độ chỉ hai giá trị `mild`, `severe` như N-07.

**Khuyến nghị (câu thiết kế hệ thống):** giữ danh mục; mọi lễ tân thêm chất mới, quản trị viên gộp chất trùng.

**Cần chốt:** ai được thêm chất vào danh mục; hai mức nhẹ/nặng đã đủ chưa hay cần mức trung bình.
