# CÂU HỎI CHO BA — lượt cập nhật schema v1.1 (N-01 → N-20)

> Mã `Q-01`, `Q-02` nằm ở `DATA-DICTIONARY.md` mục 2; sổ này bắt đầu từ `Q-03`. Lượt này BA vắng mặt: câu **CHẶN** chưa dựng bảng nào; câu **không chặn** đã đi tiếp với giả định 🔴 A ghi tại chỗ trong `schema.dbml`.

| Mã | Nhu cầu | Loại | CHẶN / không chặn |
|---|---|---|---|
| Q-03 | N-16 ca khám nhóm | mâu thuẫn | **CHẶN** |
| Q-04 | N-17 phòng mổ không trùng giờ | thiếu · không cưỡng chế được | **CHẶN** |
| Q-05 | N-18 số buổi điều trị còn lại | thiếu · đòi lưu giá trị suy ra | **CHẶN** |
| Q-06 | N-20 ảnh khuôn mặt | trái quy định | **CHẶN** |
| Q-07 | N-14 ghi lại mật khẩu | mâu thuẫn · ra lệnh giải pháp | không chặn |
| Q-08 | N-19 bảng lịch hẹn riêng từng chi nhánh | ra lệnh giải pháp · cản mở rộng | không chặn |
| Q-09 | N-09 trạng thái lịch hẹn | mơ hồ | không chặn |
| Q-10 | N-02 giờ kết thúc, dữ liệu cũ | dị thường dữ liệu | không chặn |
| Q-11 | N-04 cấp lại mã · N-13 hóa đơn còn lại | mâu thuẫn | không chặn |
| Q-12 | N-04, N-11 khuôn mã | thiếu | không chặn |
| Q-13 | N-05 đặt cọc | thiếu (vòng đời) | không chặn |
| Q-14 | N-13 tự hủy · R-12 phí hủy | thiếu | không chặn |
| Q-15 | N-03 bảo hộ | mơ hồ | không chặn |
| Q-16 | N-15 bảo hiểm | thiếu (lịch sử) | không chặn |
| Q-17 | N-12 hóa đơn theo lịch hẹn | dị thường dữ liệu | không chặn |
| Q-18 | N-07 dị ứng | mơ hồ · dữ liệu sức khỏe | không chặn |

---

## Câu CHẶN

**Q-03 · mâu thuẫn · CHẶN** — N-16, ca khám nhóm
- Nguồn: `YEU-CAU-PHONG-KHAM.md` R-04 — "Mỗi lịch hẹn có đúng một bác sĩ phụ trách." đối với `NHU-CAU-DU-LIEU-MOI.md` N-16 — "Ca khám nhóm … có từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn."
- Hệ quả nếu giữ nguyên: `appointments.doctor_id` là một cột bắt buộc, chứa được một bác sĩ. Bác sĩ thứ hai không bị chặn trùng giờ (N-02) và không có doanh thu theo bác sĩ (R-11).
- Hướng: (a) giữ R-04 cho mọi lịch hẹn, ca nhóm là loại lịch hẹn riêng có bảng bác sĩ tham gia · (b) sửa R-04 thành một bác sĩ chính cộng các bác sĩ cùng phụ trách, `doctor_id` giữ làm bác sĩ chính · (c) bỏ `doctor_id`, mọi lịch hẹn đi qua bảng bác sĩ phụ trách, lịch thường có một dòng. Ví dụ: ca tư vấn gia đình 09:00–10:00 có bác sĩ A và B, thu 500.000 đ: ghi hết cho A, hay chia 250.000 đ cho mỗi người?
- Cần chốt: chọn (a), (b) hay (c); doanh thu theo bác sĩ của ca nhóm tính thế nào; bác sĩ thứ hai có bị chặn trùng giờ không.

**Q-04 · thiếu · CHẶN** — N-17, hai ca phẫu thuật cùng phòng mổ
- Nguồn: N-17 — "Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau." Requirement đã chốt (R-01 → R-12) không có "ca phẫu thuật" hay "phòng mổ"; R-06 chỉ có phòng khám bệnh (`rooms`); `appointments` không có `room_id`.
- Hệ quả nếu giữ nguyên: không biết ràng buộc theo thực thể nào và theo khoảng giờ nào, nên không viết được ràng buộc chống chồng lấn ở CSDL; kiểm ở ứng dụng thì hai giao dịch đồng thời cùng qua được.
- Hướng: (a) ca phẫu thuật là một loại lịch hẹn (đã có bệnh nhân, bác sĩ, hóa đơn), thêm phòng · (b) thực thể riêng cho ca phẫu thuật, phòng mổ là danh mục riêng tách khỏi `rooms` · (c) phòng mổ là một phòng trong `rooms` có loại. Ví dụ: ca A 08:00–10:30 và ca B 10:00–12:00 cùng phòng mổ 1 thì chặn; ca B 10:30–12:00 thì sao, cần khoảng dọn phòng không?
- Cần chốt: ca phẫu thuật có là lịch hẹn không; phòng mổ có phải một dòng `rooms` không; giờ kết thúc là dự kiến hay thực tế; khoảng nghỉ giữa hai ca.

**Q-05 · thiếu · đòi lưu giá trị suy ra · CHẶN** — N-18, số buổi điều trị còn lại
- Nguồn: N-18 — "Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân". Không có "gói trị liệu" trong R-01 → R-12 hay schema: `services` chỉ có giá hiện hành; `appointment_services.quantity` không nói tổng số buổi, hạn dùng hay gói đã mua.
- Hệ quả nếu lưu thẳng cột `số còn lại` lên hồ sơ: lệch ngay khi một lịch hẹn bị hủy hoặc hoàn tác, hay hai lễ tân cùng trừ; và không rõ trừ lúc nào (đã đặt, đã đến hay hoàn thành). Số còn lại mặc định tính ra từ tổng buổi trừ số buổi đã dùng, không lưu.
- Hướng: (a) gói là dịch vụ có số buổi, bán thành "gói đã mua" (tổng buổi, hạn dùng), mỗi lịch hẹn dùng gói ghi một dòng tiêu thụ; số còn lại = tổng trừ số dòng, tính khi xem · (b) vẫn lưu số còn lại nhưng kèm sổ ghi từng lần trừ để đối chiếu và sửa lệch.
- Cần chốt: gói trị liệu là gì và bán qua hóa đơn nào; có hạn dùng không; buổi bị trừ ở trạng thái lịch hẹn nào; hủy lịch có hoàn buổi không; một bệnh nhân có nhiều gói cùng lúc không.

**Q-06 · trái quy định · CHẶN** — N-20, ảnh khuôn mặt bệnh nhân
- Nguồn: N-20 — "Lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) để nhận diện khi đến khám; giữ vô thời hạn; mọi lễ tân đều xem được." Đối chiếu R-10 — "Lễ tân chỉ thấy dữ liệu phòng khám của mình."
- Hệ quả nếu giữ nguyên: ảnh dùng để nhận diện là dữ liệu sinh trắc gắn với hồ sơ y tế, của cả trẻ em; giữ vô thời hạn và mọi lễ tân xem được (kể cả lễ tân phòng khám khác, nếu "mọi" hiểu theo nghĩa rộng) là mức rủi ro cao nhất: nếu lộ thì không rút lại được. Quy định bảo vệ dữ liệu cá nhân (ví dụ Nghị định 13/2023/NĐ-CP của Việt Nam coi dữ liệu sinh trắc và sức khỏe là nhạy cảm) đòi mục đích, đồng ý rõ ràng — của người bảo hộ với trẻ em —, hạn lưu và đường xóa. Cần người phụ trách pháp lý xác nhận.
- Hướng: (a) không lưu ảnh, lễ tân xác nhận bằng mã hồ sơ, ngày sinh, giấy tờ · (b) lưu ảnh có điều kiện: đồng ý ghi nhận (trẻ em: của người bảo hộ, dùng quan hệ bảo hộ N-03), mục đích chỉ để nhận diện, hạn lưu cụ thể, xem theo vai và ghi lại mỗi lần xem, xóa thật khi rút đồng ý · (c) lưu mẫu đặc trưng khuôn mặt thay vì ảnh, không dựng lại được khuôn mặt. Ví dụ: lễ tân ở Hà Nội mở ảnh bệnh nhân khám ở Đà Nẵng: được hay không?
- Cần chốt: có lưu không; thu tối thiểu gì; hạn lưu; vai nào xem và theo phạm vi nào (đối chiếu R-10); đồng ý của người bảo hộ; cách xóa thật.

---

## Câu không chặn

**Q-07 · mâu thuẫn · ra lệnh giải pháp · không chặn** — N-14, ghi lại mật khẩu
- Nguồn: N-14 — "hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ" đối với R-09 — "mật khẩu không bao giờ lưu nguyên văn."
- Giả định 🔴 A: R-09 thắng. N-14 viết lại thành nhu cầu "bác sĩ quên mật khẩu được trợ giúp lấy lại quyền vào": quản trị viên phát liên kết đặt lại dùng một lần có hạn (`password_reset_tokens`, chỉ lưu bản băm của mã). Không có cột nào lưu mật khẩu đọc được.
- Hệ quả nếu sai: nếu BA vẫn muốn đọc được mật khẩu thì phải sửa R-09 trước; khi đó mọi mật khẩu bác sĩ lộ theo mỗi lần rò CSDL và quản trị viên có thể đăng nhập thay bác sĩ.

**Q-08 · ra lệnh giải pháp · cản mở rộng · không chặn** — N-19, bảng lịch hẹn riêng từng chi nhánh (`appointments_hn`, `appointments_hcm`, `appointments_dn`)
- Giả định 🔴 A: nhu cầu thật là báo cáo từng chi nhánh chạy nhanh. Thỏa bằng index `(organization_id, clinic_id, starts_at)` có sẵn trên một bảng `appointments` (`clinic_id` đã phân biệt chi nhánh). Không dựng ba bảng: thêm chi nhánh thứ tư phải đổi lược đồ và mọi truy vấn; báo cáo toàn chuỗi (R-11) phải nối ba bảng; khóa ngoại từ `invoices` chỉ trỏ được một bảng. Cỡ dữ liệu ở Q-01 (~2.000 lịch/ngày, khoảng 730 nghìn dòng mỗi năm) chưa đòi phân vùng; nếu cần thì phân vùng theo tháng, không theo chi nhánh.
- Hệ quả nếu sai: nếu báo cáo chi nhánh vẫn chậm thì cần số đo thật (cỡ bảng, truy vấn chậm) trước khi tách.

**Q-09 · mơ hồ · không chặn** — N-09, trạng thái lịch hẹn
- Nguồn: N-09 liệt kê năm trạng thái (đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy), không có "đã khám xong"; schema v1.0 có `done`, R-08 nói "lịch hẹn đã khám có một hóa đơn", N-10 đếm "lần khám đã hoàn thành".
- Giả định 🔴 A: giữ `done`, thêm `confirmed`, `arrived`, `no_show` (sáu giá trị); chuyển theo N-09 cộng `arrived → done`. N-09 không cho `confirmed → cancelled` và `booked → no_show`, làm đúng nguyên văn.
- Hệ quả nếu sai: bệnh nhân đã xác nhận rồi hủy (R-12 nói hủy trước giờ hẹn 2 tiếng) không có đường hợp lệ; nếu `done` bị bỏ khỏi N-09 thật sự thì hóa đơn (R-08) và số lần khám (N-10) không còn trạng thái để dựa vào.

**Q-10 · dị thường dữ liệu · không chặn** — N-02, giờ kết thúc và dữ liệu cũ (đóng `Q-02`)
- Giả định 🔴 A: `appointments.ends_at` bắt buộc; lịch hẹn cũ điền `starts_at` cộng một thời lượng mặc định do BA chốt (chưa có dữ liệu thời lượng nào để đo); lịch `cancelled` không giữ chỗ, các trạng thái khác (kể cả `no_show`) giữ chỗ.
- Hệ quả nếu sai: thời lượng mặc định sai làm lịch cũ trùng giả hoặc sót trùng thật; nếu dữ liệu cũ đã có cặp trùng sẵn thì ràng buộc không thêm được, phải rà và sửa trước khi chạy migration.

**Q-11 · mâu thuẫn · không chặn** — N-04 cấp lại mã hồ sơ đã ẩn, N-13 hóa đơn người đã ẩn còn đó
- Nguồn: N-04 — "mã của hồ sơ đã ẩn được cấp lại cho người khác"; N-13 — "hóa đơn và thanh toán của người đó vẫn phải còn để kế toán đối chiếu."
- Giả định 🔴 A: làm đúng N-04 (unique một phần trên hồ sơ chưa ẩn). Hệ quả: hóa đơn cũ của người đã ẩn mang cùng mã hồ sơ với người mới; đối chiếu theo mã sẽ lẫn hai người.
- Hướng: (a) kế toán và báo cáo luôn đối chiếu theo định danh nội bộ, mã hồ sơ chỉ để hiển thị · (b) hóa đơn chép mã và tên tại lúc phát hành · (c) không tái dùng mã. Ví dụ: `HS-0102` của ông A bị ẩn tháng 3, cấp lại cho bà B tháng 5; tháng 8 kế toán tìm `HS-0102` ra hóa đơn của cả hai người.
- Cần chốt: kế toán đối chiếu bằng gì.

**Q-12 · thiếu · không chặn** — N-04, N-11, khuôn mã hồ sơ và mã dịch vụ
- Giả định 🔴 A: `patients.record_code` (≤ 30 ký tự) và `services.code` (≤ 40 ký tự) là chuỗi do ứng dụng cấp; dữ liệu cũ được cấp mã khi chuyển; mã dịch vụ phân biệt hoa thường, ứng dụng chuẩn hóa in hoa.
- Hệ quả nếu sai: khuôn mã khác (độ dài, ký tự) thì đổi kiểu cột; không chuẩn hóa thì `kham-tq` và `KHAM-TQ` thành hai dịch vụ.

**Q-13 · thiếu · không chặn** — N-05, vòng đời khoản đặt cọc
- Nguồn: N-05 — "đặt cọc bằng tiền, ghi ngày nhận cọc." Không nói cọc đi đâu sau đó: trừ vào hóa đơn, hoàn lại, hay giữ khi vắng mặt; R-12 chỉ nói phí hủy muộn.
- Giả định 🔴 A: một lịch hẹn tối đa một khoản cọc; chỉ ghi số tiền và ngày nhận (`appointment_deposits`), không ghi phương thức thu, chưa có xử lý cọc.
- Hệ quả nếu sai: khi cần trừ hay hoàn cọc phải thêm bảng giải quyết cọc (hoàn là dòng mới mang số âm, như R-08); báo cáo doanh thu (R-11) chưa tính cọc; cho nhiều đợt cọc thì bỏ ràng buộc unique.

**Q-14 · thiếu · không chặn** — N-13 tự hủy lịch tương lai, R-12 phí hủy
- Nguồn: N-13 — "lịch hẹn tương lai của người đó thì tự hủy"; R-12 — "hủy lịch trước giờ hẹn 2 tiếng thì không tính phí." `appointments` không có giờ hủy hay lý do hủy.
- Giả định 🔴 A: tự hủy chỉ đặt `status = cancelled`; chưa thêm cột giờ hủy hay lý do hủy cho tới khi chốt cách tính phí.
- Hệ quả nếu sai: R-12 không đo được từ dữ liệu; lịch bị hệ thống tự hủy khi ẩn bệnh nhân không phân biệt được với lịch bệnh nhân hủy sát giờ, có thể bị tính phí nhầm.

**Q-15 · mơ hồ · không chặn** — N-03, quan hệ bảo hộ
- Giả định 🔴 A: cả hai đầu là `people` (người bảo hộ không bắt buộc là bác sĩ hay bệnh nhân); có `ended_on` để kết thúc; không có loại quan hệ (cha, mẹ, giám hộ pháp lý); không cưỡng chế người được bảo hộ là bệnh nhân hay nhỏ tuổi; một người được nhiều người bảo hộ cùng lúc.
- Hệ quả nếu sai: lọc "bệnh nhân nhỏ tuổi" phải so `birth_date`; cần loại quan hệ thì thêm cột sau.

**Q-16 · thiếu · không chặn** — N-15, hồ sơ bảo hiểm
- Giả định 🔴 A: bắt buộc đủ số thẻ, nhà bảo hiểm, hạn dùng; nhà bảo hiểm là chuỗi tự do; gia hạn hoặc đổi thẻ thì sửa tại chỗ, không giữ lịch sử thẻ cũ.
- Hệ quả nếu sai: hóa đơn cũ dùng thẻ cũ không truy lại được; "Bảo Việt" và "Bao Viet" là hai nhà bảo hiểm khi thống kê; thẻ không có hạn không nhập được.
- Chưa dựng unique cho `card_number`: nhu cầu không nói hai bệnh nhân (ví dụ cùng một thẻ gia đình) có được dùng chung một số thẻ không; bộ soát báo INFO `DB-INT-07`, để lại có chủ đích.

**Q-17 · dị thường dữ liệu · không chặn** — N-12, hóa đơn tra theo lịch hẹn
- Nguồn: R-08 — "Mỗi lịch hẹn đã khám có một hóa đơn", nhưng v1.0 `invoices.appointment_id` không unique.
- Giả định 🔴 A: R-08 hiểu là tối đa một; thêm unique `invoices(appointment_id)`, cũng là index tra theo lịch hẹn của N-12. Tra theo bệnh nhân đi qua `appointments (patient_id, starts_at)` rồi `invoices (appointment_id)`, không chép `patient_id` sang hóa đơn.
- Hệ quả nếu sai: dữ liệu cũ có lịch hẹn hai hóa đơn thì không tạo được index unique, phải rà trước; hóa đơn hủy hay phát hành lại cần mở thì bỏ unique và thêm trạng thái hóa đơn.
- Kèm theo: `invoices.appointment_id` v1.0 khai khóa ngoại không ghi hành vi xóa; v1.1 khai rõ `restrict` vì N-13 đòi hóa đơn còn lại khi ẩn bệnh nhân (cùng hành vi mặc định, không đổi dữ liệu). `invoice_lines` giữ cùng hạn lưu với hóa đơn (chứng từ kế toán, số năm chưa chốt, 🔴 A: không xóa).

**Q-18 · mơ hồ · dữ liệu sức khỏe · không chặn** — N-07, dị ứng
- Giả định 🔴 A: chất gây dị ứng là danh mục theo tổ chức (`allergens`) để tra theo chất không sót vì chính tả; mức độ chỉ hai giá trị nhẹ/nặng; hạn lưu bằng vòng đời hồ sơ bệnh nhân; xem được bởi vai đã xem được hồ sơ bệnh nhân đó (lễ tân cùng phòng khám, theo R-10).
- Chưa dựng: nhật ký ai đã xem dữ liệu dị ứng (N-07 không đòi); hạn lưu và đường xóa thật khi hồ sơ bệnh nhân hết hạn giữ (hiện chỉ ẩn bằng `deleted_at`).
- Hệ quả nếu sai: chưa rõ ai được thêm chất mới vào danh mục (lễ tân hay quản trị viên); mức "trung bình" bị ép vào nhẹ hoặc nặng; nếu cho gõ tự do thì tra "penicillin" sót bệnh nhân ghi "penicilin".
