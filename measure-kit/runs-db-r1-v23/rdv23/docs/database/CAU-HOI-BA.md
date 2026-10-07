# CÂU HỎI CHO BA — lượt cập nhật schema v1.1 (N-01 → N-20)

> Phát sinh khi áp `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` vào `schema.dbml`. Mã bắt đầu từ Q-03 (Q-01, Q-02 nằm ở mục 2 của `DATA-DICTIONARY.md`). **Câu CHẶN: phần tương ứng chưa dựng bảng nào** — chờ đáp án. Câu không chặn: schema đã dựng với giả định 🔴 A ghi tại chỗ.

| Mã | Nhu cầu | Loại | CHẶN / không chặn |
|---|---|---|---|
| Q-03 | N-16 ca khám nhóm nhiều bác sĩ | mâu thuẫn (R-04) | CHẶN |
| Q-04 | N-17 phòng mổ không trùng giờ | thiếu · không cưỡng chế được | CHẶN |
| Q-05 | N-18 số buổi còn lại của gói trị liệu | thiếu · lưu giá trị suy ra | CHẶN |
| Q-06 | N-20 ảnh khuôn mặt bệnh nhân | trái quy định | CHẶN |
| Q-07 | N-14 ghi lại mật khẩu bác sĩ | trái quy định (R-09) · ra lệnh giải pháp | CHẶN phần lưu mật khẩu; phần thay thế đã dựng |
| Q-08 | N-09 trạng thái lịch hẹn | mâu thuẫn · mơ hồ | không chặn |
| Q-09 | N-04 cấp lại mã hồ sơ đã ẩn | dị thường dữ liệu | không chặn |
| Q-10 | N-05 đặt cọc | thiếu | không chặn |
| Q-11 | N-07 chất gây dị ứng nhập tự do | cản mở rộng · dị thường dữ liệu | không chặn |
| Q-12 | N-06 · N-07 · N-15 dữ liệu sức khỏe, thẻ bảo hiểm | trái quy định (giữ bao lâu, ai xem) | không chặn |
| Q-13 | N-06 ghi chú nội bộ | thiếu | không chặn |
| Q-14 | N-13 + R-12 giờ hủy và lý do hủy | thiếu | không chặn |
| Q-15 | Khóa chính uuidv7 | cản mở rộng | không chặn |
| Q-16 | Dữ liệu hiện có khi áp v1.1 | dị thường dữ liệu | không chặn |
| Q-17 | N-19 bảng lịch hẹn theo chi nhánh | ra lệnh giải pháp | không chặn |
| Q-18 | N-03 quan hệ bảo hộ | mơ hồ | không chặn |
| Q-19 | Khóa ngoại ghép giữ cùng tổ chức (nợ kế thừa v1.0) | cản mở rộng | không chặn |

---

## Câu CHẶN

**Q-03 · mâu thuẫn · CHẶN** — N-16 ca khám nhóm
Nguồn: `YEU-CAU-PHONG-KHAM.md` R-04 — "Mỗi lịch hẹn có đúng một bác sĩ phụ trách." · `NHU-CAU-DU-LIEU-MOI.md` N-16 — "Ca khám nhóm (tư vấn gia đình) có từ hai bác sĩ trở lên cùng phụ trách một lịch hẹn."
Hệ quả nếu giữ nguyên: `appointments.doctor_id` bắt buộc đúng một bác sĩ, và chặn trùng giờ của N-02 chỉ nhìn bác sĩ đó. Hai nhu cầu không cùng đúng được; **không dựng bảng nối bác sĩ–lịch hẹn**, không đổi `doctor_id`.
Hướng (a) giữ R-04: ca nhóm là nhiều lịch hẹn, mỗi bác sĩ một lịch, cùng giờ (2 bác sĩ x 90 phút = 2 lịch hẹn, 2 hóa đơn) · (b) sửa R-04 thành "một bác sĩ chính + các bác sĩ cùng tham gia", thêm bảng nối; khi đó N-02 phải áp cho cả bác sĩ tham gia (bác sĩ B có ca 10:00–10:30 thì không nhận ca nhóm 10:00–11:30) và báo cáo doanh thu theo bác sĩ (R-11) phải nói ca nhóm 900.000 đ chia thế nào · (c) ca nhóm là loại lịch hẹn riêng, R-04 chỉ áp cho lịch hẹn thường.
Cần chốt: chọn hướng nào, và tiền của ca nhóm tính cho ai.

**Q-04 · thiếu · CHẶN** — N-17 phòng mổ không trùng giờ
Nguồn: N-17 — "Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau." · R-06 — "Mỗi phòng khám có nhiều phòng khám bệnh (rooms)"; `appointments` không có cột phòng.
Hệ quả nếu giữ nguyên: requirement không có thực thể *ca phẫu thuật*, không có *phòng mổ*, ca phẫu thuật chưa có giờ bắt đầu hay kết thúc; không có gì để cưỡng chế "không trùng". **Không dựng bảng nào.**
Hướng (a) ca phẫu thuật là một lịch hẹn loại đặc biệt, thêm phòng vào lịch hẹn · (b) bảng ca phẫu thuật riêng (có nhiều bác sĩ, nhiều dịch vụ, ekip) · phòng mổ là một dòng của `rooms` hay bảng riêng. Tình huống số: ca A 08:00–10:00 và ca B 10:00–12:00 cùng phòng mổ — hợp lệ không? Nếu phòng cần dọn 30 phút sau mỗi ca thì ca B chỉ được bắt đầu từ 10:30. Ca đã hủy có giữ phòng không?
Cần chốt: ca phẫu thuật là gì, có giờ kết thúc không, thời gian dọn phòng, phòng mổ nằm ở đâu. Có đáp án thì dùng đúng khuôn của N-02 (phòng + khoảng thời gian, `EXCLUDE USING gist`).

**Q-05 · thiếu · CHẶN** — N-18 số buổi điều trị còn lại
Nguồn: N-18 — "Lưu số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân để lễ tân nhìn thấy ngay."
Hệ quả nếu giữ nguyên: (1) requirement không có *gói trị liệu* hay *buổi điều trị* — không có nguồn để tính; (2) "số còn lại" là giá trị suy ra: lưu một con số sẽ lệch khi buổi bị hủy, bị đổi bác sĩ, hoàn gói (gói 10 buổi, đã trừ 4, bệnh nhân hủy buổi thứ 4 muộn: số lưu ghi 6, thực tế 7). **Không dựng cột lưu số còn lại và không dựng bảng gói.**
Hướng: số còn lại = tổng buổi của gói − số buổi đã dùng, tính ra khi hiển thị (đủ nhanh vì mỗi bệnh nhân có vài gói); cần lưu thì kèm cách đồng bộ.
Cần chốt: gói là gì (dịch vụ có N buổi? mua một lần? giá? hạn dùng?), buổi nào bị trừ (đã đến hay đã khám xong), hủy hoặc vắng có trừ không, gói có chuyển nhượng hay hoàn tiền không.

**Q-06 · trái quy định · CHẶN** — N-20 ảnh khuôn mặt bệnh nhân
Nguồn: N-20 — "Lưu ảnh khuôn mặt bệnh nhân (kể cả trẻ em) để nhận diện khi đến khám; giữ vô thời hạn; mọi lễ tân đều xem được." · R-10 — "Lễ tân chỉ thấy dữ liệu phòng khám của mình".
Hệ quả nếu giữ nguyên: ảnh khuôn mặt là dữ liệu sinh trắc, của trẻ em, gắn với dữ liệu sức khỏe; mục đích "nhận diện khi đến khám" chưa đủ lý do để thu và giữ mãi; "mọi lễ tân xem được" trái R-10 và nguyên tắc thu tối thiểu; giữ vô thời hạn thì không có đường xóa. Ví dụ ở Việt Nam, Nghị định 13/2023/NĐ-CP xếp dữ liệu sinh trắc và dữ liệu sức khỏe vào dữ liệu cá nhân nhạy cảm, dữ liệu trẻ em có quy định riêng — 🔴 A, BA xác nhận với pháp chế của khách. **Không dựng bảng hay cột lưu ảnh.**
Hướng (a) không lưu ảnh: nhận diện bằng mã hồ sơ, số điện thoại, giấy tờ của người bảo hộ · (b) lưu ảnh với một mục đích duy nhất, có bản ghi đồng ý của bệnh nhân hoặc người bảo hộ, hạn lưu (ví dụ 24 tháng kể từ lần khám cuối), chỉ lễ tân phòng khám của mình và quản trị viên xem, kho lưu mã hóa, rút đồng ý thì xóa thật · (c) lưu mẫu đặc trưng khuôn mặt thay ảnh — vẫn là dữ liệu sinh trắc, không bớt nghĩa vụ.
Cần chốt: có thu ảnh không; nếu có thì mục đích, ai đồng ý (với trẻ em), giữ bao lâu, ai xem, xóa thế nào.

**Q-07 · trái quy định · CHẶN phần lưu mật khẩu** — N-14 ghi lại mật khẩu bác sĩ
Nguồn: N-14 — "hệ thống ghi lại mật khẩu để quản trị viên đọc cho họ." · R-09 — "mật khẩu không bao giờ lưu nguyên văn."
Hệ quả nếu giữ nguyên: hai câu loại trừ nhau; mật khẩu đọc lại được thì quản trị viên và bất kỳ ai lấy được CSDL đều dùng được tài khoản bác sĩ (có quyền xem hồ sơ bệnh nhân), và bác sĩ dùng chung mật khẩu ở chỗ khác bị lộ theo. **`users.password_hash` giữ nguyên, không thêm cột mật khẩu.**
Đã làm thay (giả định 🔴 A — nhu cầu thật là "bác sĩ quên thì có người hỗ trợ"): bảng `password_reset_tokens` — quản trị viên hoặc chính bác sĩ yêu cầu một liên kết đặt lại dùng một lần, hết hạn; chỉ lưu bản băm của mã. Quản trị viên không bao giờ thấy mật khẩu.
Hệ quả nếu sai: nếu BA vẫn muốn quản trị viên đọc được mật khẩu thì phải sửa R-09 trước và có quyết định bảo mật bằng văn bản; skill này không dựng cột đó.

## Câu không chặn

**Q-08 · mâu thuẫn · không chặn** — N-09 trạng thái lịch hẹn
Nguồn: N-09 liệt kê *đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy* — không có *hoàn thành*; nhưng R-08 — "Mỗi lịch hẹn đã khám có một hóa đơn" và N-10 — "tổng số lần khám đã hoàn thành" cần một trạng thái *đã khám xong*. N-09 mới nêu 4 chuyển trạng thái.
Giả định 🔴 A: giữ `done` từ v1.0 làm trạng thái sau `arrived`; thêm hai chuyển chưa nói: `confirmed → cancelled` (R-12 cho hủy sát giờ) và `arrived → done`. Chuyển khác (ví dụ `booked → arrived` cho khách không hẹn trước) chưa cho phép.
Hệ quả nếu sai: nếu "đã đến" đã là hoàn thành thì bỏ `done`, N-10 và R-08 đọc `arrived` (đổi giá trị enum, dữ liệu cũ `done` đổi sang `arrived`).

**Q-09 · dị thường dữ liệu · không chặn** — N-04 cấp lại mã hồ sơ đã ẩn
Đã dựng theo yêu cầu: `patients.record_code` unique **một phần** (chỉ hồ sơ chưa ẩn), mã của hồ sơ ẩn dùng lại được.
Tình huống số: mã `BN-000123` của ông A bị ẩn tháng 3; tháng 5 cấp `BN-000123` cho bà B. Phiếu giấy, ảnh chụp, tin nhắn cũ ghi `BN-000123` giờ trỏ nhầm người; nếu ông A quay lại thì khôi phục được hồ sơ nhưng phải đổi mã mới.
Hướng (a) giữ như đã dựng · (b) không tái cấp: unique đầy đủ trên `(organization_id, record_code)` — một dòng sửa trong DBML. Đây là chính sách của phòng khám nên không gắn khuyến nghị.
Cần chốt: (a) hay (b), và hồ sơ khôi phục thì cấp mã mới hay giữ mã cũ nếu còn trống.

**Q-10 · thiếu · không chặn** — N-05 đặt cọc
Đã dựng `appointment_deposits` (tối đa một khoản cọc cho mỗi lịch hẹn: số tiền, ngày nhận), tách khỏi `payments` vì `payments` gắn hóa đơn mà hóa đơn chỉ có sau khi khám.
Chưa có (giả định 🔴 A: chưa cần): cọc trừ vào hóa đơn thế nào; hoàn cọc khi hủy (R-12 hủy trước 2 giờ thì không tính phí — cọc có trả lại không); lịch hẹn tự hủy vì ẩn bệnh nhân (N-13) có cọc thì sao; cọc tính doanh thu ngày nhận hay ngày khám (R-11); có cần ghi hình thức nhận (tiền mặt, thẻ, chuyển khoản).
Hệ quả nếu sai: thêm cột hoặc bảng hoàn, khấu trừ; hoàn tiền sẽ là dòng mới (không sửa số tiền đã nhận).

**Q-11 · cản mở rộng · không chặn** — N-07 tên chất gây dị ứng
Giả định 🔴 A: nhập tự do, tra theo `lower(substance)` (`patient_allergies`).
Hệ quả nếu sai: "Penicillin", "penixilin", "Peni" là ba dòng khác nhau, tra ngược theo chất sót bệnh nhân — với dị ứng thuốc là rủi ro an toàn.
Khuyến nghị (đây là câu thiết kế hệ thống): bảng danh mục chất `allergens` (quản trị viên thêm, lễ tân chọn) và `patient_allergies.allergen_id`; ghi chú tự do cho chất chưa có trong danh mục. Chưa dựng vì chưa ai nói quản trị viên sẽ quản danh mục này.

**Q-12 · trái quy định · không chặn** — dữ liệu sức khỏe và thẻ bảo hiểm (N-06 · N-07 · N-15)
Ghi chú nội bộ, dị ứng, số thẻ bảo hiểm là dữ liệu sức khỏe hoặc dữ liệu cá nhân. Mục đích và ai xem đã rõ từ nhu cầu (lễ tân, nhân viên); **thiếu: giữ bao lâu và xóa thế nào.**
Giả định 🔴 A: giữ cùng thời hạn lưu hồ sơ bệnh nhân (theo quy định về hồ sơ bệnh án); khi xóa theo yêu cầu thì ẩn danh hóa `people` và giữ hóa đơn, thanh toán cho kế toán; dị ứng và bảo hiểm xóa cascade cùng bệnh nhân.
Hệ quả nếu sai: thêm cột phân loại, việc nền xóa theo hạn, bảng ghi nhật ký người xem.

**Q-13 · thiếu · không chặn** — N-06 ghi chú nội bộ
Giả định 🔴 A: ghi chú ghi một lần, không sửa hay xóa (sửa = ghi chú mới); không lưu "ai đã xem".
Chưa rõ: ghi chú gắn **bệnh nhân** (bệnh nhân không thuộc một phòng khám cụ thể) — lễ tân phòng khám khác có thấy không, khi R-10 nói lễ tân chỉ thấy dữ liệu phòng khám của mình?
Hệ quả nếu sai: thêm `clinic_id` vào ghi chú để cưỡng chế phạm vi xem; thêm `edited_at` hoặc xóa mềm.

**Q-14 · thiếu · không chặn** — N-13 tự hủy lịch hẹn và R-12 phí hủy
Nguồn: R-12 — "Bệnh nhân hủy lịch trước giờ hẹn 2 tiếng thì không tính phí." · N-13 — "lịch hẹn tương lai của người đó thì tự hủy."
`appointments` chỉ có `status`; không có giờ hủy và lý do hủy, nên R-12 (so giờ hủy với giờ hẹn) không tính được từ dữ liệu, và lịch hủy do ẩn bệnh nhân không phân biệt được với bệnh nhân tự hủy sát giờ.
Giả định 🔴 A: chưa thêm cột; N-13 chỉ đổi `status` sang `cancelled`.
Hệ quả nếu sai: thêm `cancelled_at` và lý do hủy (bệnh nhân hủy · phòng khám hủy · ẩn hồ sơ); quyết định có phí hủy hay không khi hệ thống tự hủy.

**Q-15 · cản mở rộng · không chặn** — khóa chính `uuidv7()`
Ba bảng lớn (`appointments`, `invoices`, `payments`) đổi mặc định khóa chính từ `gen_random_uuid()` sang `uuidv7()` (UUIDv4 chèn rải làm chỉ mục chia trang liên tục; hàng triệu hóa đơn theo N-12). `uuidv7()` có sẵn từ PostgreSQL 18.
Giả định 🔴 A: dùng PostgreSQL 18 trở lên. Hệ quả nếu sai: bản thấp hơn thì bỏ mặc định và để ứng dụng sinh UUIDv7; dòng cũ không đổi.

**Q-16 · dị thường dữ liệu · không chặn** — dữ liệu hiện có khi áp v1.1
Các cột `NOT NULL` mới cần giá trị cho dòng cũ: `appointments.ends_at` (Q-02 cũ — thời lượng chưa biết), `patients.record_code`, `services.code`; `invoices.appointment_id` thêm unique (kiểm có hóa đơn trùng lịch hẹn không); hóa đơn đã phát hành chưa có `invoice_lines` — chép từ `appointment_services` nhân `services.price` **hiện hành**, nên hóa đơn cũ nào mà giá đã đổi sẽ lệch (giá lúc khám đã mất, không khôi phục được).
Giả định 🔴 A: thêm cột nullable → điền → `SET NOT NULL`; `ends_at` cũ = `starts_at` + thời lượng mặc định do vận hành nêu; `record_code` và `code` sinh theo quy ước vận hành nêu.
Hệ quả nếu sai: hóa đơn cũ in sai giá nếu giá từng đổi; cần BA chấp nhận hoặc cung cấp bảng giá lịch sử.

**Q-17 · ra lệnh giải pháp · không chặn** — N-19 `appointments_hn` · `appointments_hcm` · `appointments_dn`
Nhu cầu thật: báo cáo từng chi nhánh chạy nhanh. **Không tách bảng** (danh sách chi nhánh là dòng dữ liệu, `clinics`; thêm chi nhánh thứ tư không được phải tạo bảng và sửa code): đã có `appointments.clinic_id` và chỉ mục `(organization_id, clinic_id, starts_at)`. Với ~2.000 lịch hẹn mỗi ngày (Q-01, chưa đo) ≈ 730 nghìn dòng mỗi năm, truy vấn theo chi nhánh và ngày chỉ đọc một khoảng chỉ mục nhỏ.
Hệ quả nếu sai: nếu một chi nhánh lớn gấp bội và báo cáo vẫn chậm thì phân vùng theo khoảng `starts_at` (không theo chi nhánh), hoặc bảng tổng hợp theo ngày.
Cần chốt: chấp nhận cách thay thế này; hoặc cho con số báo cáo cần chạy trong bao lâu.

**Q-18 · mơ hồ · không chặn** — N-03 quan hệ bảo hộ
Đã dựng `patient_guardianships` (người bảo hộ trỏ `people`, bệnh nhân được bảo hộ trỏ `patients`, từ ngày, đến ngày). Giả định 🔴 A: một bệnh nhân có nhiều người bảo hộ cùng lúc được; không ép bệnh nhân dưới 18 tuổi (ngày sinh có thể trống); hết bảo hộ ghi `ends_on`, không xóa dòng. "Một nhân viên lễ tân đồng thời là bệnh nhân" đã đúng sẵn từ R-02 (một `people`, hai dòng vai), không cần bảng mới.
Hệ quả nếu sai: thêm CHECK tuổi qua trigger, hoặc unique "một người bảo hộ chính".

**Q-19 · cản mở rộng · không chặn** — khóa ngoại ghép giữ cùng tổ chức (DB-INT-12)
Khóa ngoại đơn `appointments.patient_id → patients.id` không ngăn lịch hẹn của tổ chức A trỏ tới bệnh nhân của tổ chức B (R-01: dữ liệu tổ chức này không bao giờ hiện cho tổ chức khác). Lượt này đã đổi sang khóa ngoại ghép `(organization_id, …)` cho **lịch hẹn → phòng khám · bệnh nhân · bác sĩ** và **thanh toán → hóa đơn**.
Giả định 🔴 A: các bảng còn lại (cả cũ lẫn bảng mới của v1.1: `invoices`, `invoice_lines`, `appointment_deposits`, `internal_notes`, `patient_allergies`, `patient_insurances`, `patient_guardianships`, `password_reset_tokens`, `doctor_schedules`) giữ khóa ngoại đơn; tầng ứng dụng và chính sách RLS lọc theo tổ chức.
Hệ quả nếu sai: một lỗi ứng dụng có thể ghi chéo tổ chức mà CSDL không chặn; muốn đóng hẳn thì thêm unique `(organization_id, id)` ở các bảng cha còn lại và đổi các `Ref` — là thay đổi phá vỡ, nên làm trước khi dữ liệu lớn.
