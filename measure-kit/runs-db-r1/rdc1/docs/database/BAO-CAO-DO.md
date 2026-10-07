# BÁO CÁO ĐO — áp 20 nhu cầu dữ liệu (N-01 → N-20) vào schema v1.0 → v1.1

Chế độ: lượt cập nhật, BA vắng mặt. Điểm cần BA ở `CAU-HOI-BA.md` (Q-03 → Q-13). Không vẽ ERD HTML, không gọi subagent soát độc lập (theo yêu cầu của lần đo).

## 1. Từng nhu cầu

| Mã | Kết quả |
|---|---|
| N-01 | **đã áp:** `invoice_items.unit_price` (+ `service_name`) — bảng mới, snapshot lúc lập hóa đơn; dòng "Tổng tiền hóa đơn" ở mục 4 của từ điển sửa lại vì cách tính cũ đọc giá hiện hành |
| N-02 | **đã áp:** `appointments.ends_at` + `ex_appointments_doctor_no_overlap` (EXCLUDE gist, bỏ qua lịch hủy / vắng); DDL ở DATA-DICTIONARY 5.1. **đã hỏi:** Q-12 (thời lượng dữ liệu cũ) |
| N-03 | **đã áp:** `guardianships.(patient_id, guardian_person_id, starts_on)`; đa vai nhờ `people` có sẵn. **đã hỏi:** Q-10 (kết thúc bảo hộ) |
| N-04 | **đã áp:** `patients.record_code` + unique một phần `WHERE deleted_at IS NULL` (DDL 5.2). **đã hỏi:** Q-07 (rủi ro cấp lại mã khi kế toán đối chiếu; định dạng mã) |
| N-05 | **đã áp:** `appointments.deposit_amount`, `appointments.deposit_received_on`. **đã hỏi:** Q-13 (cọc có trừ hóa đơn / hoàn / vào doanh thu không) |
| N-06 | **đã áp:** `internal_notes.appointment_id` / `patient_id` / `invoice_id` (ba FK + CHECK đúng một) |
| N-07 | **đã áp:** `patient_allergies.substance_name`, `patient_allergies.severity`; chỉ mục `lower(substance_name)` để tra theo chất |
| N-08 | **đã áp:** `specialties.name` + `doctor_specialties` (bảng dữ liệu, không phải enum) |
| N-09 | **đã áp:** enum `appointment_status` thêm `confirmed`, `arrived`, `no_show`, giữ `done`. **đã hỏi:** Q-05 (đường chuyển còn thiếu; CSDL chưa chặn đường chuyển) |
| N-10 | **không làm:** không thêm cột — là giá trị suy ra `COUNT(done)`; ghi ở mục 4 từ điển và `Note` của `patients` |
| N-11 | **đã áp:** `services.code` + unique `(organization_id, code)` |
| N-12 | **đã áp:** `invoices.appointment_id` chỉ mục unique `ux_invoices_appointment`; tra theo bệnh nhân đi qua `appointments(patient_id, starts_at)` có sẵn |
| N-13 | **đã áp:** `patients.deleted_at` (có sẵn) giữ hóa đơn + thanh toán; `appointments.cancelled_at`, `appointments.cancel_reason` cho việc tự hủy (DDL 5.4). **đã hỏi:** Q-08 (có tính phí hủy muộn R-12 không) |
| N-14 | **không làm:** lưu mật khẩu đọc được trái R-09 (đã chốt) và làm lộ mọi tài khoản bác sĩ khi rò CSDL. **đã hỏi:** Q-06 (thay bằng đặt lại mật khẩu) |
| N-15 | **đã áp:** `patient_insurances.patient_id` UNIQUE + `card_number`, `insurer_name`, `expires_on` (quan hệ 0..1) |
| N-16 | **đã hỏi:** Q-03 — mâu thuẫn R-04 (đúng một bác sĩ); chưa dựng bảng |
| N-17 | **đã hỏi:** Q-09 — chưa có phẫu thuật / phòng mổ trong yêu cầu; chưa dựng bảng |
| N-18 | **đã hỏi:** Q-04 — chưa có "gói trị liệu"; số còn lại là giá trị suy ra, **không** thêm cột vào `patients` |
| N-19 | **không làm:** tách bảng theo chi nhánh làm hỏng khóa ngoại từ `invoices`, ràng buộc N-02 xuyên chi nhánh và lịch sử bệnh nhân; báo cáo chi nhánh đã có chỉ mục `(organization_id, clinic_id, starts_at)`; ~2.000 lịch / ngày chưa cần phân vùng (Q-01 chưa đo) |
| N-20 | **đã hỏi:** Q-11 — sinh trắc học của cả trẻ em, vô thời hạn, mọi lễ tân xem (trái R-10); chưa dựng bảng |

Tổng: **đã áp 13** (N-01 → N-09, N-11 → N-13, N-15) · **đã hỏi mà chưa dựng 4** (N-16 · N-17 · N-18 · N-20) · **không làm 3** (N-10 · N-14 · N-19). 13 + 4 + 3 = 20, xếp theo **kết quả chính**. Bảy dòng có thêm câu hỏi phụ nhưng vẫn xếp theo kết quả chính: N-02 · N-03 · N-04 · N-05 · N-09 · N-13 *(đã áp, kèm câu hỏi)* và N-14 *(không làm, kèm câu hỏi về cơ chế thay thế)*.

## 2. Số liệu schema

| | v1.0 | v1.1 |
|---|---|---|
| Bảng | 13 *(từ điển v1.0 ghi nhầm 12)* | 20 |
| Enum | 3 | 5 |
| Câu hỏi mở | `Q-01`, `Q-02` | `Q-01`; `Q-02` đóng; mới `Q-03` → `Q-13` (11 câu) |

## 3. Kết quả kiểm cuối của skill

Skill được giao là bản `requirements-to-erd` (4 bước, không có `check.py`). Phép kiểm cuối của nó là parser DBML chặt ở Bước 3; Bước 4 (HTML + `selfcheck.py`) bỏ theo yêu cầu.

| Phép kiểm | Kết quả |
|---|---|
| `npx @softwaretechnik/dbml-renderer -i schema.dbml` | **mã thoát 0** (đã thử parser này bắt được `Enum x { a b }` một dòng và `ref` tới bảng không có — mã thoát 1) |
| Đếm lại từ `schema.dbml` | 20 `Table`, 5 `Enum`; mọi bảng có trong từ điển; mọi mã `Q-nn` được nhắc đều có định nghĩa trong `CAU-HOI-BA.md`; mọi `Q-nn` đã định nghĩa đều được nhắc |
| Cột có trong từ điển | Mọi cột mới / đổi đều có; cột thiếu chỉ là cột bảng cũ không đổi (từ điển ghi "xem `schema.dbml`") |

Kiểm thêm (ngoài yêu cầu của skill, vì có PostgreSQL 18 trong máy):

| Phép kiểm | Kết quả |
|---|---|
| `dbml2sql --postgres` sinh DDL từ `schema.dbml` rồi nạp vào PostgreSQL 18 tạm | nạp được, 0 lỗi |
| Chạy **nguyên văn** các khối SQL ở DATA-DICTIONARY mục 5 (trích tự động từ file) | chạy được |
| 18 ca thử hành vi (trùng lịch bị chặn `23P01`, liền kề được, lịch hủy không giữ chỗ, khôi phục lịch trùng bị chặn, CHECK cọc / hủy / ghi chú, mã hồ sơ dùng lại sau khi ẩn, mã dịch vụ theo tổ chức, hóa đơn giữ giá sau khi đổi giá, hóa đơn thứ hai cho một lịch bị chặn, dị ứng không phân biệt hoa thường, bảo hiểm 0..1, tự hủy lịch tương lai khi ẩn, xóa cứng bệnh nhân bị chặn, chuyên khoa trùng cặp, bảo hộ, đếm lần khám) | **đều ra đúng kỳ vọng** |
| Chuyển dữ liệu thử v1.0 → v1.1 trên bản v1.0 có dữ liệu giả (có cặp lịch trùng sẵn) | truy vấn tìm trùng bắt được cặp; bật ràng buộc **thất bại** đúng như từ điển cảnh báo; sau khi sửa trùng thì các bước 4–8 chạy hết |

**Đã sửa trong lúc kiểm:** (1) bản đầu khai `(organization_id, record_code)` thường trong DBML khiến SQL sinh ra **trùng tên** với chỉ mục unique một phần thật — đã bỏ khỏi `indexes {}`, quy tắc nằm ở `Note` + DDL 5.2; (2) tham số `:patient_id` ở DDL 5.4 không chạy được — đổi thành `$1`.

**Chưa kiểm / hạn chế:** (a) bước 9 của chuyển dữ liệu (tạo 6 bảng mới) chỉ thử trong DB mới, không thử chồng lên DB đã chuyển; (b) `dbml2sql` đảo thứ tự cột có biểu thức — chỉ mục tra dị ứng sinh ra là `(lower(substance_name), organization_id)` thay vì `(organization_id, lower(…))`, vẫn tra được theo chất trong một tổ chức nhưng không phục vụ truy vấn chỉ có `organization_id`; (c) không soát độc lập, không có ERD HTML; (d) con số **30 phút** điền `ends_at` dữ liệu cũ và danh sách giá trị `cancel_reason` là **giả định của tôi**, không có nguồn.

## 4. Nợ cũ phát hiện (chưa sửa — ngoài N-01 → N-20)

Ở `DATA-DICTIONARY.md` mục 7: `users` không có `clinic_id` nên R-10 không thực thi được từ schema (D-01) · `appointment_services` thiếu `organization_id` (D-02) · nhiều FK chưa có chỉ mục (D-03) · cỡ dữ liệu `Q-01` vẫn chưa đo (D-04).

## 5. File đã ghi

- `docs/database/schema.dbml` (v1.1)
- `docs/database/DATA-DICTIONARY.md` (v1.1)
- `docs/database/CAU-HOI-BA.md` (mới, Q-03 → Q-13)
- `docs/database/BAO-CAO-DO.md` (file này)
