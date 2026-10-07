# CÂU HỎI CHO BA — lượt cập nhật schema v1.1 (nhu cầu N-01 → N-20)

> Mã `Q-nn` bắt đầu từ `Q-03` (`Q-01`, `Q-02` đã ở `DATA-DICTIONARY.md` mục 2). BA vắng mặt trong lượt này: câu **CHẶN** = phần đó **chưa dựng bảng nào**; câu **không chặn** = đã dựng theo giả định 🔴 A ghi ngay dưới câu hỏi.

| Mã | Nhu cầu | Loại | Mức |
|---|---|---|---|
| Q-03 | N-14 | trái quy định | CHẶN |
| Q-04 | N-20 | trái quy định | CHẶN |
| Q-05 | N-16 | mâu thuẫn | CHẶN |
| Q-06 | N-17 | thiếu | CHẶN |
| Q-07 | N-18 | thiếu · lưu giá trị suy ra | CHẶN |
| Q-08 | N-09 | mâu thuẫn | không chặn |
| Q-09 | N-02 | thiếu | không chặn |
| Q-10 | N-04 | mâu thuẫn | không chặn |
| Q-11 | N-05 | thiếu | không chặn |
| Q-12 | N-07 | cản mở rộng | không chặn |
| Q-13 | N-19 | ra lệnh giải pháp | không chặn |
| Q-14 | N-13 | thiếu | không chặn |

---

## Câu CHẶN

**Q-03 · trái quy định · CHẶN** — N-14, bác sĩ quên mật khẩu
- Nguồn: `NHU-CAU-DU-LIEU-MOI.md` N-14 — "hệ thống **ghi lại mật khẩu** để quản trị viên đọc cho họ" · `YEU-CAU-PHONG-KHAM.md` R-09 — "mật khẩu **không bao giờ** lưu nguyên văn".
- Hệ quả nếu giữ nguyên: lộ CSDL hay bản sao lưu là lộ mật khẩu thật của mọi bác sĩ, kể cả mật khẩu họ dùng lại ở nơi khác; quản trị viên đọc được mật khẩu nên không còn chứng minh "ai đăng nhập" (DB-SEC-04).
- Hướng: (a) quản trị viên phát **mã đặt lại dùng một lần** (lưu bản băm, hết hạn sau 15 phút) rồi đọc mã đó cho bác sĩ, bác sĩ tự đặt mật khẩu mới · (b) bác sĩ tự đặt lại qua email · (c) hệ thống sinh mật khẩu tạm dùng một lần, bắt đổi ngay lần đầu.
- Khuyến nghị (thiết kế hệ thống): (a) — đúng hình thức "quản trị viên đọc cho họ" mà không lưu mật khẩu; cần một bảng mã đặt lại (`user_id`, `token_hash`, `expires_at`, `used_at`, `issued_by_user_id`).
- Cần chốt: bỏ yêu cầu lưu mật khẩu và chọn hướng thay thế. Không cột nào được thêm cho N-14.

**Q-04 · trái quy định · CHẶN** — N-20, ảnh khuôn mặt bệnh nhân
- Nguồn: N-20 — "ảnh khuôn mặt bệnh nhân (**kể cả trẻ em**) … **giữ vô thời hạn**; **mọi lễ tân** đều xem được".
- Hệ quả nếu giữ nguyên: dữ liệu sinh trắc của trẻ em, không hạn lưu, quyền xem rộng nhất có thể; không có đường xóa khi người bảo hộ rút đồng ý. Quy định bảo vệ dữ liệu cá nhân (ví dụ Nghị định 13/2023/NĐ-CP) xếp sinh trắc và sức khỏe vào dữ liệu nhạy cảm — cần pháp lý xác nhận (DB-REQ-09).
- Hướng: (a) không lưu ảnh, nhận diện bằng mã hồ sơ và giấy tờ · (b) thu tối thiểu: chỉ ảnh bệnh nhân đã có đồng ý (trẻ em: người bảo hộ đồng ý, tra qua `guardianships`), hạn lưu theo hồ sơ (ví dụ 12 tháng sau lần khám cuối), chỉ lễ tân phòng khám của bệnh nhân xem và mỗi lần xem có nhật ký, có thao tác xóa thật · (c) giữ nguyên yêu cầu.
- Cần chốt: mục đích nhận diện, ai xem, giữ bao lâu, xóa thế nào, đồng ý của người bảo hộ. Chưa dựng bảng ảnh.

**Q-05 · mâu thuẫn · CHẶN** — N-16, ca khám nhóm nhiều bác sĩ
- Nguồn: R-04 — "mỗi lịch hẹn có **đúng một** bác sĩ phụ trách" · N-16 — "**từ hai bác sĩ trở lên** cùng phụ trách một lịch hẹn".
- Hệ quả nếu giữ nguyên: `appointments.doctor_id` chỉ chứa được một người; thêm bảng nối mà không chốt thì ràng buộc N-02 chỉ canh bác sĩ chính — bác sĩ thứ hai vẫn bị đặt chồng giờ; báo cáo doanh thu theo bác sĩ (R-11) không biết chia ai.
- Hướng: (a) sửa R-04 thành "một bác sĩ chính + các bác sĩ cùng tham gia" ở bảng nối riêng; ví dụ ca tư vấn gia đình 60 phút, phí 600.000 đ, bác sĩ A chính, B tham gia: doanh thu ghi 600.000 đ cho A, hay 300.000/300.000? · (b) giữ R-04, ca nhóm là hai lịch hẹn cùng giờ, mỗi lịch một bác sĩ, nối bằng mã nhóm: khi đó 600.000 đ thành hai hóa đơn hay một? · (c) hướng khác.
- Cần chốt: hướng; cách chia doanh thu cho bác sĩ; bác sĩ tham gia có bị chặn trùng giờ như bác sĩ chính không. Chưa dựng bảng; `doctor_id` giữ nguyên.

**Q-06 · thiếu · CHẶN** — N-17, ca phẫu thuật và phòng mổ
- Nguồn: N-17 — "không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau" · `YEU-CAU-PHONG-KHAM.md` không có "phẫu thuật" hay "phòng mổ"; R-06 `rooms` là phòng khám bệnh, không có loại phòng.
- Hệ quả nếu giữ nguyên: không có thực thể ca mổ, không có giờ bắt đầu/kết thúc của ca mổ nên không cưỡng chế được "không trùng" (DB-REQ-01).
- Hướng: (a) ca mổ là một loại lịch hẹn: thêm loại lịch hẹn và phòng cho lịch hẹn, `rooms` có loại (khám, mổ) · (b) bảng `surgeries` riêng (bệnh nhân, bác sĩ mổ chính và phụ, phòng mổ, bắt đầu, kết thúc, trạng thái).
- Cần chốt: ca mổ có giống lịch hẹn (có hóa đơn, trạng thái N-09) không; phòng mổ là `rooms` thêm loại hay danh mục riêng; nhiều bác sĩ trong một ca; thời gian dọn phòng sau ca có chặn không. Chưa dựng bảng.

**Q-07 · thiếu · lưu giá trị suy ra · CHẶN** — N-18, số buổi điều trị còn lại
- Nguồn: N-18 — "**lưu** số buổi điều trị còn lại của gói trị liệu trên hồ sơ bệnh nhân" · R-01 → R-12 không có "gói trị liệu" (không bán, không hạn, không quy tắc trừ buổi).
- Hệ quả nếu lưu cột `patients.remaining_sessions`: lệch khi lịch hẹn bị hủy, sửa hay hai lễ tân cùng cập nhật; không có số buổi ban đầu để đối chiếu (DB-REQ-06). Số còn lại = tổng buổi của gói − số lịch hẹn `done` dùng gói, **tính ra** khi hiển thị.
- Hướng: dựng thực thể gói (tên, số buổi, giá, hạn dùng) và việc bệnh nhân mua gói, rồi (a) lịch hẹn gắn với gói đã mua · (b) bảng riêng ghi từng buổi dùng.
- Cần chốt: gói có hạn không; lịch hẹn `no_show` hay `cancelled` có trừ buổi không; hoàn tiền phần gói chưa dùng. Chưa dựng bảng nào, không thêm cột nào.

---

## Câu không chặn — đã dựng theo giả định

**Q-08 · mâu thuẫn · không chặn** — N-09, trạng thái lịch hẹn
- Giả định 🔴 A: giữ `done` (R-08 "lịch hẹn đã khám", N-10 "khám đã hoàn thành") và thêm `confirmed`, `arrived`, `no_show`; bước `arrived → done` thêm vào vì N-09 không liệt kê trạng thái hoàn thành. Chỉ cho các bước N-09 nêu: `booked → confirmed | cancelled`, `confirmed → arrived | no_show`. `confirmed → cancelled` chưa cho, dù R-12 cho bệnh nhân hủy trước giờ hẹn 2 tiếng.
- Nếu sai: nếu "đã đến" chính là hoàn thành thì `done` thừa và N-10, R-08 phải đọc `arrived`; nếu lịch đã xác nhận vẫn phải hủy được thì phải mở bước `confirmed → cancelled`.

**Q-09 · thiếu · không chặn** — N-02, lịch hẹn cũ chưa có giờ kết thúc
- Giả định 🔴 A: `appointments.ends_at` NOT NULL; lịch hẹn cũ điền `ends_at` theo thời lượng mặc định khi chuyển dữ liệu. N-02 trả lời `Q-02` của từ điển (thời lượng lịch hẹn): lưu giờ kết thúc từng lịch hẹn.
- Hướng (vận hành, không khuyến nghị): (a) thời lượng cố định cho dữ liệu cũ, ví dụ lịch 09:00 → kết thúc 09:30 · (b) `ends_at` rỗng được cho lịch cũ, ràng buộc chỉ áp từ lịch hẹn tạo sau ngày chuyển · (c) lấy thời lượng từ dịch vụ của lịch hẹn.
- Nếu sai: thời lượng mặc định dài hơn thật thì lịch cũ bị tính chồng giờ và migration vấp ràng buộc; ngắn hơn thì bỏ sót chồng giờ trong dữ liệu cũ.

**Q-10 · mâu thuẫn · không chặn** — N-04 và N-13, mã hồ sơ cấp lại
- Nguồn: N-04 — "mã của hồ sơ đã ẩn **được cấp lại** cho người khác" · N-13 — hóa đơn của bệnh nhân đã ẩn "vẫn phải còn để kế toán đối chiếu".
- Giả định 🔴 A: unique một phần (`WHERE deleted_at IS NULL`); khôi phục hồ sơ đã ẩn phải cấp mã mới nếu mã cũ đã có người dùng.
- Hệ quả: ví dụ mã `BN-0102` của Nguyễn A (ẩn tháng 3) cấp cho Trần B (tháng 5); kế toán tra `BN-0102` cuối năm thấy hóa đơn của hai người. Hướng (vận hành, không khuyến nghị): (a) kế toán đối chiếu theo số hóa đơn hay mã nội bộ, mã hồ sơ chỉ dùng ở quầy · (b) màn hình kế toán hiện mã kèm trạng thái ẩn và ngày ẩn · (c) không cấp lại mã của hồ sơ ẩn đã có hóa đơn.

**Q-11 · thiếu · không chặn** — N-05, vòng đời khoản đặt cọc
- Giả định 🔴 A: tối đa một khoản cọc cho một lịch hẹn (`appointment_deposits.appointment_id` unique); chưa gắn với `payments` hay hóa đơn; không ghi phương thức thu.
- Hướng (vận hành, không khuyến nghị): ví dụ cọc 200.000 đ, hóa đơn 500.000 đ: (a) hóa đơn thu thêm 300.000 đ, cọc ghi như một khoản thanh toán · (b) cọc giữ riêng, đối chiếu tay. Hủy trước giờ hẹn 2 tiếng (R-12): hoàn 200.000 đ hay giữ? Vắng mặt: giữ hay hoàn?
- Nếu sai: báo cáo doanh thu R-11 không thấy tiền cọc; hoàn và trừ cọc làm tay.

**Q-12 · cản mở rộng · không chặn** — N-07, danh mục chất gây dị ứng và hạn lưu
- Giả định 🔴 A: `patient_allergies.substance` nhập tự do, tra bằng so khớp đúng sau `lower()`; xóa dị ứng nhập nhầm là xóa dòng; hạn lưu theo hồ sơ bệnh nhân (dữ liệu sức khỏe — DB-REQ-09).
- Nếu sai: "Penicillin" và "Penicilin" là hai chất khác nhau, tra bệnh nhân theo chất sẽ bỏ sót, rủi ro an toàn bệnh nhân. Khuyến nghị (thiết kế hệ thống): bảng danh mục chất gây dị ứng do quản trị viên quản lý như `specialties` (N-08), nhập có gợi ý. Cần chốt thêm: xóa thật hay giữ lịch sử dị ứng.

**Q-13 · ra lệnh giải pháp · không chặn** — N-19, bảng lịch hẹn theo chi nhánh
- Không dựng `appointments_hn`, `appointments_hcm`, `appointments_dn` (DB-REQ-07): chi nhánh là dòng trong `clinics`; thêm chi nhánh thứ tư không phải tạo bảng; báo cáo toàn chuỗi không phải `UNION`; ràng buộc không trùng giờ bác sĩ (N-02) không canh được xuyên bảng; bác sĩ chuyển chi nhánh phải chép dòng giữa các bảng.
- Giả định 🔴 A: mục tiêu thật là báo cáo từng chi nhánh chạy nhanh. Đã có index `(organization_id, clinic_id, starts_at)`; khi bảng đủ lớn thì phân vùng theo `starts_at`. Khuyến nghị (thiết kế hệ thống): giữ một bảng.
- Nếu sai: nếu mục tiêu là tách quyền hay tách vật lý theo chi nhánh thì cần số liệu (lịch hẹn mỗi ngày mỗi chi nhánh, truy vấn nào đang chậm) để chọn phân vùng hay quyền đọc.

**Q-14 · thiếu · không chặn** — N-13 và R-12, phân biệt lịch bị hệ thống tự hủy
- Nguồn: N-13 — lịch hẹn tương lai của bệnh nhân bị ẩn "tự hủy" · R-12 — hủy trước giờ hẹn 2 tiếng thì không tính phí.
- Giả định 🔴 A: chỉ đổi `status` sang `cancelled`; hủy do ẩn hồ sơ không tính phí. Schema hiện không có `cancelled_at` hay lý do hủy nên R-12 chưa cưỡng chế được bằng dữ liệu; thêm hai cột đó không thuộc 20 nhu cầu nên chưa làm.
- Khuyến nghị (thiết kế hệ thống): thêm `cancelled_at` và `cancel_reason` (bệnh nhân · phòng khám · hệ thống do ẩn hồ sơ) ở lượt sau. Nếu sai: không phân biệt được hủy hệ thống với hủy của bệnh nhân khi tính phí.

---

## Nợ cũ để lại có lý do (không phải câu hỏi)

- `DB-INT-05` · `invoices.appointment_id` chưa khai `delete:` — nằm trong khối "nợ cũ trên phần vừa sửa" vì lượt này thêm index unique cho bảng. **Để nguyên**: mặc định `NO ACTION` của PostgreSQL đã chặn xóa dòng cha nên N-13 (hóa đơn còn khi ẩn bệnh nhân) vẫn đứng; đổi khai báo `Ref` cũ là migration chưa được BA duyệt. Đề xuất một dòng: gộp vào đợt dọn `DB-INT-05` cho cả 23 `Ref` cũ (đổi sang `Ref` rời `[delete: restrict]`).
- `DB-INT-12` · bảng mới mang `organization_id` nhưng khóa ngoại đơn, không ghép `(organization_id, id)`: nhất quán với schema cũ; làm đúng cần thêm `unique (organization_id, id)` cho bảng cha cũ. Đề xuất cùng đợt dọn nợ.
