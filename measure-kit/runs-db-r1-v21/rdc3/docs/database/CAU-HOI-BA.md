# CÂU HỎI CẦN BA CHỐT — lượt cập nhật schema v1.1

> Sinh ra khi áp `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20) vào `schema.dbml`. BA vắng mặt nên mỗi câu có **giả định tạm** và schema chạy theo giả định đó; chỗ nào chưa có đáp án thì **chưa dựng bảng**.
> `Q-01` (cỡ dữ liệu) và `Q-02` (độ dài lịch hẹn) nằm ở `DATA-DICTIONARY.md` mục 2 — `Q-02` được trả lời một phần bởi N-02 (có giờ kết thúc), phần còn lại là `Q-04` dưới đây.

| Mã | Chủ đề | Nhu cầu | Trạng thái |
|---|---|---|---|
| Q-03 | Chốt giá lúc nào | N-01 | mở · schema chạy theo giả định |
| Q-04 | Độ dài lịch hẹn cũ, lịch vắng mặt có nhả giờ | N-02 | mở · schema chạy theo giả định |
| Q-05 | Bảo hộ kết thúc khi nào, bao nhiêu người | N-03 | mở · schema chạy theo giả định |
| Q-06 | Cách cấp mã hồ sơ, khôi phục hồ sơ đã ẩn | N-04 | mở · schema chạy theo giả định |
| Q-07 | Tiền cọc: hoàn, trừ, mất | N-05 | mở · schema chạy theo giả định |
| Q-08 | Trạng thái lịch hẹn: `đã đến` so với `done`, các cạnh chuyển | N-09 | mở · schema chạy theo giả định |
| Q-09 | Mã cho dịch vụ hiện có | N-11 | mở · schema chạy theo giả định |
| Q-10 | Quên mật khẩu — hướng thay cho "lưu mật khẩu" | N-14 | mở · **chưa dựng gì** |
| Q-11 | Ca khám nhóm mâu thuẫn R-04 | N-16 | mở · **chưa dựng** |
| Q-12 | Phẫu thuật và phòng mổ chưa có trong requirement | N-17 | mở · **chưa dựng** |
| Q-13 | Gói trị liệu chưa có trong requirement | N-18 | mở · **chưa dựng** |
| Q-14 | Ảnh khuôn mặt: sinh trắc học, trẻ em, vô thời hạn, mọi lễ tân | N-20 | mở · **chưa dựng** |
| Q-15 | Phạm vi "chỉ thấy phòng khám của mình" cho dữ liệu gắn bệnh nhân | R-10 + N-06/07/15 | mở · nợ từ v1.0 |

---

## Q-03 — Giá được chốt vào thời điểm nào, và hóa đơn cũ lấy giá nào?

- **Nguồn:** N-01 (*hóa đơn in đúng giá lúc khám, dù bảng giá đổi sau đó*); R-07 (giá hiện hành ở `services.price`).
- **Câu hỏi:** "Giá lúc khám" là giá tại lúc **thêm dịch vụ vào lịch hẹn** (lúc đặt) hay giá tại **ngày khám thật**? Nếu bảng giá đổi giữa hai ngày đó, khách trả giá nào? Với lịch hẹn và hóa đơn đã tồn tại trước v1.1, hệ thống chỉ còn giá hiện hành — lấy giá đó làm giá chốt có được không?
- **Hệ quả:** chọn *lúc đặt* → `appointment_services.unit_price` ghi một lần khi thêm dòng và không đổi. Chọn *lúc khám* → phải ghi lại giá khi lịch chuyển sang `arrived`/`done`, và dòng đặt trước chỉ mang giá tạm. Hóa đơn cũ: nếu giá đã đổi trong quá khứ thì giá chốt lấy từ `services.price` là **sai và không có dữ liệu để sửa**.
- **Giả định tạm (đang dùng trong schema):** chốt khi thêm dòng; dòng cũ lấy `services.price` hiện hành lúc chuyển dữ liệu.

## Q-04 — Lịch hẹn cũ kéo dài bao lâu; lịch vắng mặt có nhả giờ không?

- **Nguồn:** N-02 (*không cho một bác sĩ có hai lịch hẹn trùng thời gian; mỗi lịch có giờ bắt đầu và giờ kết thúc*); `Q-02` cũ.
- **Câu hỏi:** (a) Mọi lịch hẹn hiện có chỉ có `starts_at`; `ends_at` NOT NULL cần giá trị — dùng thời lượng nào cho dữ liệu cũ (cố định, theo dịch vụ, lấy từ nguồn khác)? (b) Lịch hẹn **mới**: thời lượng nhập tay hay suy ra từ dịch vụ (`services` chưa có thời lượng)? (c) Lịch `no_show` (vắng mặt) còn chiếm giờ của bác sĩ không, hay giờ đó nhận được lịch khác?
- **Hệ quả:** (a) Nếu dữ liệu cũ đã có hai lịch trùng giờ cùng bác sĩ thì **không thêm được** ràng buộc loại trừ — phải dọn trước, mà dọn là quyết định nghiệp vụ. (c) Chọn *nhả giờ* thì điều kiện `WHERE status <> 'cancelled'` của ràng buộc phải thêm `no_show`.
- **Giả định tạm:** dữ liệu cũ điền 30 phút (**chưa chạy, chỉ là tham số**); chỉ `cancelled` nhả giờ.

## Q-05 — Bảo hộ kết thúc khi nào? Nhiều người bảo hộ cùng lúc?

- **Nguồn:** N-03 (*ai bảo hộ ai, từ ngày nào*) — chỉ nêu ngày **bắt đầu**.
- **Câu hỏi:** Bệnh nhân đủ 18 tuổi hay đổi người giám hộ thì quan hệ cũ có cần lưu với ngày kết thúc không? Một bệnh nhân có thể có nhiều người bảo hộ cùng lúc (cha và mẹ) không? Người bảo hộ có quyền đặt lịch hoặc xem hồ sơ thay không (kéo theo quyền, không chỉ dữ liệu)?
- **Hệ quả:** không có ngày kết thúc thì không trả lời được "ai là người bảo hộ **hiện tại**". Có thì thêm `ended_on` (cột nullable, thêm sau không phá dữ liệu) và nếu chỉ một người tại một thời điểm thì thêm ràng buộc loại trừ theo khoảng ngày.
- **Giả định tạm:** chỉ ghi ngày bắt đầu; nhiều người bảo hộ đồng thời được; chưa gắn quyền.

## Q-06 — Mã hồ sơ: ai cấp, hồ sơ cũ thế nào, khôi phục hồ sơ đã ẩn

- **Nguồn:** N-04 (*mã duy nhất trong tổ chức; mã của hồ sơ đã ẩn được cấp lại cho người khác*).
- **Câu hỏi:** (a) Định dạng mã và ai cấp — hệ thống sinh tuần tự theo tổ chức hay lễ tân nhập? (b) Hồ sơ hiện có chưa có mã: sinh theo thứ tự nào? (c) Khi **khôi phục** một hồ sơ đã ẩn mà mã của nó đã cấp cho người khác thì làm gì (cấp mã mới? chặn?). (d) Có chấp nhận rủi ro mã cấp lại — thẻ giấy, kết quả cũ, tin nhắn ghi mã cũ sẽ trỏ nhầm sang **người khác**?
- **Hệ quả:** ràng buộc duy nhất chỉ áp cho hồ sơ chưa ẩn (chỉ mục một phần), nên khôi phục hồ sơ có mã đã bị cấp lại sẽ **vi phạm ràng buộc** nếu không có quy tắc. Rủi ro (d) là rủi ro nhầm bệnh nhân.
- **Giả định tạm:** hệ thống sinh; hồ sơ cũ sinh theo `created_at`; khôi phục thì cấp mã mới nếu mã cũ đã bị dùng.

## Q-07 — Tiền cọc: hoàn, trừ vào hóa đơn, hay mất?

- **Nguồn:** N-05 (*kèm một khoản đặt cọc bằng tiền, ghi ngày nhận cọc*); R-08 (thanh toán gắn hóa đơn, hoàn tiền là dòng số âm); R-12 (hủy trước 2 tiếng không tính phí).
- **Câu hỏi:** Chỉ một khoản cọc hay nhiều đợt? Khi hủy sớm (không phí) có hoàn cọc không? Hủy muộn hoặc vắng mặt thì cọc mất? Khám xong thì cọc trừ vào hóa đơn — ghi như một dòng `payments` hay trừ riêng? Cọc nhận bằng phương thức nào, ai nhận?
- **Hệ quả:** hiện cọc là hai cột trên `appointments`, chỉ **biết đã nhận bao nhiêu**, không theo dõi được số tiền đã đi đâu. Nếu cần theo dõi hoàn/trừ thì phải tách bảng khoản cọc nối với `payments` — nếu không, tiền cọc là khoản tiền không có sổ.
- **Giả định tạm:** một khoản, chưa mô hình hóa hoàn hay trừ.

## Q-08 — Trạng thái lịch hẹn: `đã đến` có phải `done`? Các cạnh chuyển còn thiếu

- **Nguồn:** N-09; R-08 (*hóa đơn cho lịch hẹn **đã khám***); N-10 (*số lần khám đã hoàn thành*); R-12 (hủy trước 2 tiếng).
- **Câu hỏi:**
  1. N-09 liệt kê *đã đặt · đã xác nhận · đã đến · vắng mặt · đã hủy*, **không có "đã khám xong"**, nhưng v1.0 có `done` và R-08, N-10 cần nó. `đã đến` (`arrived`) là trạng thái riêng trước khi khám xong, hay `đã đến` thay cho `done`?
  2. Từ `confirmed` chỉ đi được `arrived` hoặc `no_show` — vậy lịch **đã xác nhận mà bệnh nhân gọi hủy** (R-12 cho phép) thì sao? Theo đúng chữ N-09 là không hủy được.
  3. Từ `booked` có sang thẳng `arrived` hoặc `no_show` không? Từ `arrived` đi đâu? `no_show`, `cancelled`, `done` có quay lại được không?
- **Hệ quả:** quyết định N-10 đếm trạng thái nào, hóa đơn được tạo ở trạng thái nào, và CSDL cưỡng chế được các cạnh chuyển (bảng cạnh hợp lệ + trigger) hay không — hiện chưa cưỡng chế vì danh sách cạnh chưa đủ.
- **Giả định tạm:** enum có cả 6 giá trị (`done` giữ nguyên, thêm `confirmed` `arrived` `no_show`); N-10 đếm `done`; chưa cưỡng chế chuyển trạng thái ở CSDL.

## Q-09 — Mã cho các dịch vụ hiện có

- **Nguồn:** N-11 (*mã dịch vụ duy nhất trong mỗi tổ chức*); `services` v1.0 không có cột mã.
- **Câu hỏi:** Dịch vụ hiện có sẽ nhận mã gì và ai đặt? Mã phân biệt hoa/thường không (`KHAM-TQ` và `kham-tq` là một hay hai)?
- **Hệ quả:** cột `code` NOT NULL buộc phải có mã cho mọi dòng cũ trước khi đặt ràng buộc.
- **Giả định tạm:** mã chuẩn hóa chữ hoa, bỏ khoảng trắng đầu cuối; dịch vụ cũ do vận hành cung cấp bảng mã, chưa sinh tự động.

## Q-10 — Bác sĩ quên mật khẩu: dùng hướng nào thay cho "ghi lại mật khẩu"?

- **Nguồn:** N-14 (*hệ thống ghi lại mật khẩu để quản trị viên đọc cho bác sĩ*) so với R-09 (**mật khẩu không bao giờ lưu nguyên văn**, đã chốt).
- **Câu hỏi:** N-14 trái trực tiếp R-09 nên **không được đưa vào schema**. Mục đích gốc là hỗ trợ bác sĩ quên mật khẩu — BA có chấp nhận hướng: quản trị viên bấm "đặt lại", hệ thống gửi liên kết dùng một lần có hạn hoặc cấp mật khẩu tạm buộc đổi ở lần đăng nhập đầu, và ghi nhật ký việc ai đã đặt lại cho ai?
- **Hệ quả của việc lưu đọc được:** lộ CSDL là lộ mật khẩu của mọi bác sĩ, mà người dùng hay dùng lại mật khẩu ở dịch vụ khác; quản trị viên đọc được mật khẩu nghĩa là hành động nhân danh bác sĩ không còn quy được cho ai.
- **Giả định tạm:** không lưu; chưa dựng bảng đặt lại mật khẩu cho tới khi BA chọn hướng.

## Q-11 — Ca khám nhóm có từ hai bác sĩ mâu thuẫn R-04

- **Nguồn:** N-16 so với R-04 (*mỗi lịch hẹn có đúng **một** bác sĩ phụ trách*, đã chốt) và N-02 (không trùng giờ của bác sĩ).
- **Câu hỏi:** R-04 có được sửa không? Ca nhóm là một **loại** lịch hẹn riêng hay mọi lịch hẹn đều có thể nhiều bác sĩ? Có bác sĩ chính không? Ca nhóm có chiếm giờ của từng bác sĩ (tức chặn họ nhận lịch khác)? Doanh thu theo bác sĩ (R-11) chia thế nào?
- **Hệ quả nếu được duyệt:** `appointments.doctor_id NOT NULL` không còn đúng — cần bảng người tham gia (`appointment_doctors`: lịch hẹn, bác sĩ, vai) và ràng buộc N-02 phải chuyển sang bảng đó (lặp khoảng thời gian hoặc dùng trigger); báo cáo R-11 đổi cách đếm.
- **Giả định tạm:** giữ R-04; không dựng gì.

## Q-12 — Phẫu thuật và phòng mổ chưa tồn tại trong requirement

- **Nguồn:** N-17; R-06 chỉ có *phòng khám bệnh* và `appointments` **không gắn phòng**; không có R nào nói về phẫu thuật.
- **Câu hỏi:** Ca phẫu thuật là một loại lịch hẹn hay thực thể riêng (đội mổ, thời lượng, chuẩn bị, dọn phòng)? Phòng mổ là một loại `rooms` hay danh mục riêng? Ca đã hủy có chiếm phòng không? Có thời gian đệm giữa hai ca? Lịch hẹn khám thường có cần gắn phòng và chặn trùng phòng không?
- **Hệ quả:** ràng buộc "không hai ca cùng phòng cùng giờ" cần bảng có `room_id` và khoảng thời gian — chưa có bảng nào như vậy; dựng tạm sẽ phải đoán cả thực thể lẫn quy tắc.
- **Giả định tạm:** không dựng.

## Q-13 — Gói trị liệu chưa tồn tại trong requirement

- **Nguồn:** N-18; R-07 chỉ có dịch vụ tính theo số lượng, không có gói bán trước.
- **Câu hỏi:** Gói trị liệu là gì: bán trước N buổi cho một bệnh nhân, có hạn dùng không, mua khi nào, có hoàn tiền phần chưa dùng không? Mỗi buổi điều trị là một lịch hẹn? Một gói dùng cho nhiều dịch vụ?
- **Hệ quả:** "số buổi còn lại" là **giá trị suy ra** (số buổi đã mua − số buổi đã dùng); cột đếm trên hồ sơ bệnh nhân sẽ **lệch** mỗi khi lịch hẹn bị hủy, sửa hoặc đổi trạng thái. Hệ thống sẽ cung cấp số này bằng phép tính từ bảng gói và bảng buổi dùng, chứ không lưu cột đếm — chỉ cân nhắc cột đếm có trigger nếu đo thấy phép tính chậm.
- **Giả định tạm:** không dựng.

## Q-14 — Ảnh khuôn mặt để nhận diện: sinh trắc học, trẻ em, giữ vô thời hạn, mọi lễ tân xem

- **Nguồn:** N-20; R-10 (lễ tân chỉ thấy dữ liệu phòng khám của mình); N-03 (bảo hộ trẻ nhỏ).
- **Câu hỏi:**
  1. Ảnh dùng để **nhận diện** là dữ liệu sinh trắc học, cộng với dữ liệu của **trẻ em** và dữ liệu sức khỏe — thuộc nhóm dữ liệu cá nhân nhạy cảm (Nghị định 13/2023/NĐ-CP; cần pháp chế xác nhận). Căn cứ xử lý là gì, ai đồng ý thay trẻ (người bảo hộ ở N-03)?
  2. Lưu **ảnh gốc** hay chỉ **vector đặc trưng** (vector không dựng lại được khuôn mặt)?
  3. "Giữ vô thời hạn": khi bệnh nhân rút lại đồng ý, hoặc hồ sơ bị ẩn (N-13), ảnh có bị xóa không?
  4. "Mọi lễ tân đều xem được" trái nguyên tắc quyền tối thiểu và R-10; ai thực sự cần xem — chỉ chức năng nhận diện chạy nền, hay con người?
  5. Lưu ở đâu (kho đối tượng mã hóa, CSDL chỉ giữ tham chiếu) và có nhật ký ai truy cập không?
- **Hệ quả:** dựng đúng theo chữ N-20 là **thiết kế sẵn một điểm vi phạm** (giữ vô hạn + mở cho mọi lễ tân + dữ liệu trẻ em). Phần này cần đánh giá tác động xử lý dữ liệu trước khi có bảng.
- **Giả định tạm:** không dựng; không cột ảnh nào được thêm vào `patients` hay `people`.

## Q-15 — "Lễ tân chỉ thấy phòng khám của mình" áp thế nào cho dữ liệu gắn bệnh nhân?

- **Nguồn:** R-10; `users` v1.0 **không có `clinic_id`** (nợ từ v1.0, lượt này không sửa); bảng mới gắn với bệnh nhân nhưng bệnh nhân **không thuộc một phòng khám**: `internal_notes` (N-06), `patient_allergies` (N-07), `patient_insurances` (N-15), `guardianships` (N-03).
- **Câu hỏi:** Lễ tân thuộc phòng khám nào (cần cột hoặc bảng gán)? Lễ tân thấy bệnh nhân nào: chỉ người từng có lịch ở phòng khám của mình, hay mọi bệnh nhân của tổ chức? Ghi chú, dị ứng, bảo hộ, bảo hiểm theo cùng quy tắc đó? Riêng **dị ứng**, an toàn người bệnh có đòi hiện xuyên phòng khám không?
- **Hệ quả:** nếu theo "từng có lịch ở phòng khám của mình" thì mọi truy vấn trên các bảng mới phải nối qua `appointments`, và lễ tân phòng khám mới **không thấy dị ứng** của bệnh nhân từng khám nơi khác — xung đột an toàn với riêng tư. Nếu theo toàn tổ chức thì R-10 chỉ còn áp cho lịch hẹn và hóa đơn.
- **Giả định tạm:** các bảng mới chỉ mang `organization_id`; phạm vi theo phòng khám chưa được cưỡng chế.
