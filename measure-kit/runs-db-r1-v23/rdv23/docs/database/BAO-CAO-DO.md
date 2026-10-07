# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (N-01 → N-20)

Bảng, cột, cột `note`, `Ref`, chỉ mục ở `schema.dbml`; ý nghĩa cột ở `DATA-DICTIONARY.md`; câu hỏi cho BA ở `CAU-HOI-BA.md` (Q-03 → Q-19). Không vẽ ERD HTML, không gọi subagent soát độc lập (theo quy tắc lần đo).

## Từng nhu cầu

| Mã | Kết quả |
|---|---|
| N-01 | đã áp: `invoice_lines.unit_price` (bảng mới `invoice_lines`: `invoice_id`, `service_id`, `quantity`, `unit_price` — giá chép lúc khám); `services.price` thêm `CHECK >= 0` |
| N-02 | đã áp: `appointments.ends_at` (+ `CHECK ends_at > starts_at`, `EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE status <> 'cancelled'`, SQL trong `Note`; cần `btree_gist`); thời lượng cho dòng cũ → Q-16 |
| N-03 | đã áp: bảng mới `patient_guardianships` (`guardian_person_id`→`people`, `ward_patient_id`→`patients`, `starts_on`, `ends_on`); lễ tân đồng thời là bệnh nhân đã đúng sẵn do R-02 (một `people`, hai dòng vai); đã hỏi thêm: Q-18 |
| N-04 | đã áp: `patients.record_code` + unique **một phần** `(organization_id, record_code) WHERE deleted_at IS NULL` (trong `Note`); đã hỏi thêm: Q-09 (mã tái cấp nhầm người) |
| N-05 | đã áp: bảng mới `appointment_deposits` (`appointment_id` unique, `amount`, `received_on`); đã hỏi thêm: Q-10 (hoàn, khấu trừ cọc) |
| N-06 | đã áp: bảng mới `internal_notes` (ba khóa ngoại rỗng được `appointment_id` · `patient_id` · `invoice_id` + `CHECK num_nonnulls(...) = 1`, không dùng `*_type` + `*_id`); đã hỏi thêm: Q-13 |
| N-07 | đã áp: bảng mới `patient_allergies` (`substance`, `severity` enum `allergy_severity`), chỉ mục tra ngược `(organization_id, lower(substance))`; đã hỏi thêm: Q-11 (chất nhập tự do) |
| N-08 | đã áp: bảng mới `specialties` (dòng dữ liệu, quản trị viên thêm/bớt bằng `is_active`) + bảng nối `doctor_specialties` có chỉ mục tra ngược theo chuyên khoa |
| N-09 | đã áp: `appointment_status` thêm `confirmed`, `arrived`, `no_show` (giữ `done` từ v1.0); máy trạng thái ghi ở `Note` của `appointments`; đã hỏi: Q-08 (N-09 thiếu trạng thái hoàn thành, hai chuyển giả định) |
| N-10 | không làm: không lưu số lần khám hoàn thành (giá trị suy ra) — đếm `appointments.status = 'done'` theo `patient_id`, chỉ mục `(organization_id, patient_id, starts_at)`; ghi ở từ điển mục 4 |
| N-11 | đã áp: `services.code` + unique `(organization_id, code)` |
| N-12 | đã áp: `invoices.appointment_id` thêm UNIQUE (tra theo lịch hẹn), tra theo bệnh nhân qua `appointments (organization_id, patient_id, starts_at)` rồi `invoices.appointment_id`; `appointments.id`, `invoices.id`, `payments.id` đổi sang `uuidv7()` (Q-15); chỉ mục dẫn đầu `organization_id` |
| N-13 | đã áp: mọi khóa ngoại chuỗi bệnh nhân → lịch hẹn → hóa đơn → thanh toán là `restrict`; ẩn = `patients.deleted_at`; tự hủy lịch hẹn tương lai bằng trigger `AFTER UPDATE OF deleted_at` (đặc tả trong `Note` của `patients`); đã hỏi thêm: Q-14 (không phân biệt hủy do ẩn với tự hủy, R-12) |
| N-14 | đã hỏi: Q-07 (trái R-09 — không thêm cột lưu mật khẩu); đã dựng bảng thay thế `password_reset_tokens` (liên kết đặt lại một lần, chỉ lưu băm) theo giả định 🔴 A |
| N-15 | đã áp: bảng mới `patient_insurances` (`patient_id` khóa ngoại kèm UNIQUE, `card_number`, `insurer_name`, `valid_until`) |
| N-16 | đã hỏi: Q-03 (mâu thuẫn R-04, CHẶN) — chưa dựng bảng nối bác sĩ–lịch hẹn, `appointments.doctor_id` giữ nguyên |
| N-17 | đã hỏi: Q-04 (CHẶN — chưa có thực thể ca phẫu thuật, phòng mổ, giờ kết thúc) — chưa dựng bảng |
| N-18 | đã hỏi: Q-05 (CHẶN — chưa có gói trị liệu; số còn lại là giá trị suy ra) — chưa dựng cột, bảng |
| N-19 | không làm: ba bảng `appointments_hn/_hcm/_dn` — danh sách chi nhánh là dòng dữ liệu (`clinics`); báo cáo theo chi nhánh dùng `appointments.clinic_id` + chỉ mục `(organization_id, clinic_id, starts_at)`, cần nữa thì phân vùng theo `starts_at`; đã hỏi: Q-17 |
| N-20 | đã hỏi: Q-06 (CHẶN — sinh trắc của trẻ em, giữ vô thời hạn, "mọi lễ tân xem" trái R-10) — chưa dựng cột, bảng |

Tổng: đã áp 13 (N-01 → N-09, N-11 → N-13, N-15) · đã hỏi và chưa dựng 5 (N-14 phần lưu mật khẩu, N-16, N-17, N-18, N-20) · không làm 2 (N-10, N-19). Một số dòng "đã áp" kèm câu không chặn đã hỏi thêm (Q-08 → Q-19).

## Sửa ngoài 20 nhu cầu (do bộ soát bắt được)

- Khóa ngoại ghép `(organization_id, …)` cho `appointments` → `clinics` · `patients` · `doctors` và `payments` → `invoices` (thêm unique `(organization_id, id)` ở bốn bảng cha) — gỡ 2 WARN khóa ngoại thiếu chỉ mục dẫn đầu và nợ cũ trên các khóa ngoại của `appointments`; còn lại khóa ngoại đơn → Q-19.
- Thêm chỉ mục `doctors(clinic_id)`, `users(person_id)`, `appointment_services(service_id)` (nợ cũ trên phần vừa sửa).
- Miễn trừ `DB-INT-08` cho `password_reset_tokens.token_hash` (tra theo mã trước khi biết tổ chức) và `DB-IDX-12` cho `patients.person_id` (cố ý unique đầy đủ, R-03), cả hai có lý do trong `schema-lint.json`.

## Kết quả kiểm cuối của skill

Lệnh: `check.py docs/database --brief --requirements 1-yeu-cau --update-dictionary` — thoát 0.

- Cú pháp: đạt, cả hai parser nhận (`dbml-renderer` và `dbml2sql`).
- Số: 22 bảng · 130 cột · 4 enum · 14 giá trị enum · 46 ref · 30 index (từ 13 bảng · 72 cột · 3 enum).
- Phát hiện mới: ERROR 0 · WARN 0 · INFO 5 (`DB-IDX-01` 2 cột `created_by` kiểm toán · `DB-IDX-04` 1 · `DB-INT-07` `patient_insurances.card_number` chưa UNIQUE — chủ đích, nhiều người dùng chung thẻ · `DB-SCL-05` `invoice_lines` chưa ghi hạn lưu — theo hạn lưu hóa đơn, Q-12). Nợ cũ ngoài phần vừa sửa: 14 (WARN 1: `people.email` chưa unique; còn lại INFO) — để lại.
- Miễn trừ: 2, đều có lý do.
- Thay đổi so với bản trước: phá vỡ 30 · chạm dữ liệu đã có 8 · bảng +9 −0.
- Từ điển: 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ · cột nghiệp vụ thiếu `note`: 0.
- Truy vết: 0 định danh chưa có chỗ chứa · 3 đã hỏi hay cố ý không dựng (`appointments_hn`, `_hcm`, `_dn`, Q-17) · 0 bảng không có nguồn · 0 mã chết.

### Soát tay B8 (8 rule liên quan thay đổi)

| Rule | Kết luận | Bằng chứng |
|---|---|---|
| DB-INT-12 Khóa ngoại ghép giữ cùng tenant | **Vi phạm một phần** | chuỗi lịch hẹn → bệnh nhân/bác sĩ/phòng khám và thanh toán → hóa đơn đã ghép; 9 bảng khác (cả bảng mới) giữ khóa ngoại đơn — nợ có chủ đích, ghi Q-19 |
| DB-INT-15 Ma trận cưỡng chế rule | Đạt | `DATA-DICTIONARY.md` mục 6 — 10 rule, mỗi rule có cơ chế và rủi ro còn lại |
| DB-MOD-11 Tiền: sổ cái chỉ thêm | Đạt có điều kiện | `payments` giữ nguyên (hoàn tiền là dòng âm, không sửa dòng); `appointment_deposits` chưa có hoàn cọc — Q-10; `invoice_lines` bất biến sau phát hành (ghi ở `Note`, chưa có trigger chặn UPDATE) |
| DB-MOD-14 Mô hình đa tenant | Đạt | một schema, `organization_id` ở mọi bảng nghiệp vụ, chỉ mục dẫn đầu bằng nó; ba bảng con (`appointment_services`, `invoice_lines`, `doctor_specialties`) suy tenant qua bảng cha, khai trong `global_tables` và `Note` |
| DB-SEC-01 Phân loại dữ liệu | Đạt một phần | từ điển mục 5 phân loại cột mới của v1.1; cột của bảng cũ (`people.phone`, `email`, `birth_date`) chưa phân loại; hạn lưu chưa chốt — Q-12 |
| DB-EVO-02 Expand–contract | Không áp dụng | không đổi tên hay bỏ cột nào; mọi thay đổi là thêm. Riêng đổi mặc định `uuidv7()` và đổi khóa ngoại sang khóa ghép là thay đổi phá vỡ nhưng cộng thêm ràng buộc, không đổi kiểu cột |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | Không áp dụng cho schema; ghi cho migration | 4 khóa ngoại ghép mới, 2 CHECK mới (`services.price`, `appointments.ends_at`), `EXCLUDE` và cột `NOT NULL` trên bảng đã có dòng — phải `NOT VALID` → `VALIDATE` khi áp lên dữ liệu thật |
| DB-EVO-08 Backfill chia lô | Không áp dụng cho schema; ghi cho migration | backfill `appointments.ends_at`, `patients.record_code`, `services.code`, `invoice_lines` cho hóa đơn cũ (giá hiện hành, có thể lệch giá lúc khám) — Q-16; `appointments` cỡ L nên chia lô theo `id` |

## Điều chưa chắc

- N-02: `EXCLUDE` loại lịch `cancelled` nhưng vẫn giữ chỗ cho `no_show`; chưa có đáp án BA về việc đó.
- N-09/Q-08: giữ `done` ngoài danh sách của N-09 và thêm hai chuyển trạng thái là suy luận.
- Q-06/Q-07: viện dẫn Nghị định 13/2023/NĐ-CP là 🔴 A, BA cần xác nhận với pháp chế.
- Chưa chạy SQL thật trên PostgreSQL (`dbml2sql` chỉ xác nhận cú pháp); `uuidv7()` cần PostgreSQL 18 (Q-15).
