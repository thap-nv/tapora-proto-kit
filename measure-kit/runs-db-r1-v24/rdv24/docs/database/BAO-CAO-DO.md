# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (N-01 → N-20)

Thư mục: dự án mẫu phòng khám. BA vắng mặt: câu chặn ghi vào `CAU-HOI-BA.md` (Q-03 → Q-18), không dựng bảng cho câu chưa có đáp án.

## Mỗi nhu cầu một dòng

- N-01: đã áp: `invoice_lines.unit_price` (cùng `invoice_lines.quantity`, `invoice_lines.service_id`; bảng mới `invoice_lines`, khóa chính `(invoice_id, service_id)`, giá chép từ `services.price` lúc phát hành hóa đơn)
- N-02: đã áp: `appointments.ends_at` + `CHECK (ends_at > starts_at)` + `EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'cancelled')` ghi trong Note; cách điền dữ liệu cũ đã hỏi ở Q-10 (không chặn, đóng `Q-02` của từ điển)
- N-03: đã áp: `guardianships.guardian_person_id`, `guardianships.ward_person_id`, `guardianships.started_on`, `guardianships.ended_on` (bảng mới; vế "lễ tân đồng thời là bệnh nhân" không cần cột mới vì `people` đã là danh tính chung); chi tiết mơ hồ ở Q-15 (không chặn)
- N-04: đã áp: `patients.record_code` + unique một phần `(organization_id, record_code) WHERE deleted_at IS NULL` ghi trong Note; mâu thuẫn mềm với N-13 ở Q-11, khuôn mã ở Q-12 (không chặn)
- N-05: đã áp: `appointment_deposits.amount`, `appointment_deposits.received_on`, `appointment_deposits.appointment_id` unique (bảng mới); vòng đời cọc (trừ, hoàn, giữ) chưa dựng, hỏi ở Q-13 (không chặn)
- N-06: đã áp: `internal_notes.appointment_id`, `internal_notes.patient_id`, `internal_notes.invoice_id` + `CHECK (num_nonnulls(...) = 1)` ghi trong Note, kèm `internal_notes.author_user_id`, `internal_notes.body` (bảng mới, không dùng cặp `*_type + *_id`)
- N-07: đã áp: `allergens.name` + `patient_allergies.patient_id`, `patient_allergies.allergen_id`, `patient_allergies.severity` (bảng mới, enum `allergy_severity`, index tra ngược `(allergen_id, patient_id)`); giả định danh mục chất, hai mức độ, hạn lưu ở Q-18 (không chặn)
- N-08: đã áp: `specialties.name`, `specialties.is_active`, `doctor_specialties.doctor_id`, `doctor_specialties.specialty_id` (hai bảng mới, danh mục là dòng dữ liệu, bác sĩ nhiều chuyên khoa qua bảng nối)
- N-09: đã áp: `appointment_status` thêm `confirmed`, `arrived`, `no_show` (giữ `done`); máy chuyển trạng thái ghi trong Note `appointments`; N-09 thiếu `done` và `confirmed → cancelled`, hỏi ở Q-09 (không chặn)
- N-10: không làm: số lần khám hoàn thành là giá trị suy ra (DB-REQ-06), không lưu cột; đếm `appointments.status = 'done'` qua index `(patient_id, starts_at)` có sẵn; ghi ở từ điển mục 4
- N-11: đã áp: `services.code` + unique `(organization_id, code)`; khuôn mã và dữ liệu cũ ở Q-12 (không chặn)
- N-12: đã áp: `invoices.appointment_id` unique (index tra theo lịch hẹn, cũng cưỡng chế R-08); tra theo bệnh nhân đi `appointments (patient_id, starts_at)` rồi `invoices (appointment_id)`, không chép `patient_id` sang hóa đơn; hỏi ở Q-17 (không chặn)
- N-13: đã áp: `patients.deleted_at` (có sẵn) + mọi khóa ngoại mới tới `patients`, `appointments`, `invoices` là `restrict` + `invoices.appointment_id` khai rõ `restrict`; lịch hẹn tương lai tự hủy là cập nhật `appointments.status` ở ứng dụng; cột giờ hủy và phí hủy hỏi ở Q-14 (không chặn)
- N-14: không làm: lưu mật khẩu đọc được, trái R-09 và quy tắc SEC-04; thay bằng nhu cầu "quên mật khẩu được trợ giúp" → đã áp: `password_reset_tokens.token_hash`, `password_reset_tokens.expires_at`, `password_reset_tokens.used_at` (liên kết một lần, chỉ lưu bản băm); xác nhận ở Q-07 (không chặn)
- N-15: đã áp: `patient_insurances.patient_id` unique, `patient_insurances.card_number`, `patient_insurances.insurer_name`, `patient_insurances.expires_on` (bảng mới, quan hệ 1–1 tùy chọn); lịch sử thẻ ở Q-16 (không chặn)
- N-16: đã hỏi: Q-03 (CHẶN, mâu thuẫn R-04 "đúng một bác sĩ" với "từ hai bác sĩ trở lên"); chưa dựng `appointment_doctors` hay đổi `appointments.doctor_id`
- N-17: đã hỏi: Q-04 (CHẶN, requirement không có ca phẫu thuật, phòng mổ hay giờ của ca; không biết chặn trùng theo gì)
- N-18: đã hỏi: Q-05 (CHẶN, không có thực thể "gói trị liệu"; phần "lưu số còn lại" bị đặt về mặc định tính ra, không dựng cột)
- N-19: không làm: ba bảng lịch hẹn theo chi nhánh làm báo cáo toàn chuỗi (R-11) phải nối bảng và thêm chi nhánh phải đổi lược đồ; nhu cầu thật "báo cáo từng chi nhánh nhanh" đã có index `(organization_id, clinic_id, starts_at)` trên một bảng; ghi ở Q-08 (không chặn)
- N-20: đã hỏi: Q-06 (CHẶN, dữ liệu sinh trắc của cả trẻ em, giữ vô thời hạn, mọi lễ tân xem được; trái R-10 và quy định bảo vệ dữ liệu cá nhân; chưa dựng cột hay bảng ảnh)

Tổng: 14 nhu cầu đã áp (một trong số đó, N-14, thay giải pháp bằng nhu cầu gốc) · 4 chờ BA (Q-03, Q-04, Q-05, Q-06) · 2 không làm (N-10, N-19).

## Kết quả kiểm cuối (`check.py docs/database --brief --requirements 1-yeu-cau --update-dictionary`, thoát 0)

```
1 cú pháp: ✓ cả hai parser nhận (dbml-renderer + dbml2sql)
2 rule · dialect postgresql · MỚI ERROR 0 · WARN 0 · INFO 1 · nợ cũ ERROR 0 · WARN 37 · INFO 14 · miễn trừ 3
5a từ điển: +10 bảng · +3 cột trên bảng cũ · cột nghiệp vụ thiếu note: 0
5 từ điển: 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ
5b truy vết: 0 định danh chưa có chỗ chứa · 3 đã hỏi hay cố ý không dựng · 0 bảng không có nguồn · 0 mã chết
Số: 23 bảng · 136 cột · 4 enum · 14 giá trị enum · 49 ref · 25 index
Thay đổi: phá vỡ 3 · dữ liệu 3 · bảng +10 −0
```

- Phát hiện mới duy nhất còn lại: INFO `DB-INT-07` `patient_insurances.card_number` chưa unique (để lại có chủ đích, lý do ở Q-16: nhu cầu không nói hai bệnh nhân có được chung số thẻ không).
- Phá vỡ trên bảng cũ (3), mỗi cái do một nhu cầu đòi: unique `services (organization_id, code)` (N-11) · unique `invoices (appointment_id)` (N-12, cũng là R-08) · khóa ngoại `invoices.appointment_id` khai `restrict` (N-13; cùng hành vi mặc định `NO ACTION`, có thể hoàn lại nếu BA không muốn đếm là phá vỡ).
- Chạm dữ liệu cũ (3): `patients.record_code`, `services.code`, `appointments.ends_at` đều `NOT NULL` không mặc định, phải điền trước (Q-10, Q-12).
- Miễn trừ (3, đều có lý do trong `schema-lint.json`): `DB-INT-08` `password_reset_tokens.token_hash` · `DB-SCL-03` `invoice_lines` · `DB-SCL-03` `invoices.appointment_id` (cả hai chọn index dẫn đầu bằng cột cha để thỏa `DB-IDX-01`, khung kiểm hai rule xung đột nhau trên bảng cỡ L).
- Nợ cũ để nguyên (đề xuất một dòng): 23 khóa ngoại cũ chưa khai hành vi xóa (`DB-INT-05`), 5 khóa ngoại cũ thiếu index (`DB-IDX-01`), 3 khóa chính uuidv4 trên bảng L (`DB-TYP-01`), 2 quan hệ 1–1 khai bằng `-` (`DB-INT-14`: `patients.person_id`, `doctors.person_id`), 2 `DB-SCL-03`, 1 `DB-IDX-12`, 1 `DB-INT-07`, 4 INFO `DB-SCL-05`; xem `report.py docs/database --debt`.

## Soát tay B8 (8 rule liên quan thay đổi)

- DB-SEC-06 Hạn lưu và xóa thật: Vi phạm có chủ đích. Dị ứng (`patient_allergies`) và số thẻ (`patient_insurances.card_number`) chưa có hạn lưu hay đường xóa thật; bệnh nhân chỉ ẩn bằng `patients.deleted_at`. Ghi ở Q-18, Q-06. `password_reset_tokens` đạt (Note ghi dọn dòng hết hạn định kỳ).
- DB-EVO-02 Expand–contract: Đạt một phần. `appointments.ends_at` có trình tự thêm cột rỗng được → điền → `SET NOT NULL` trong Note; `patients.record_code` và `services.code` mới ghi "cấp mã khi chuyển" (Q-12), chưa có kịch bản migration đủ bước.
- DB-INT-12 Khóa ngoại ghép giữ cùng tenant: Vi phạm (nợ kế thừa). 10 bảng mới dùng khóa ngoại đơn tới `id` như v1.0; ví dụ `guardianships.ward_person_id → people.id` không ràng `organization_id`. Khóa ngoại ghép đòi thêm unique `(organization_id, id)` vào bảng gốc cũ, không làm trong lượt này; đề xuất cho lượt migration.
- DB-MOD-11 Tiền: sổ cái chỉ thêm: Đạt. `invoice_lines.unit_price` là bản chép không sửa (Note); `payments` hoàn là dòng âm (v1.0); `appointment_deposits.amount` có `check: amount > 0` và Note ghi hoàn cọc sẽ là dòng âm (dựng ở Q-13).
- DB-MOD-14 Mô hình đa tenant: Đạt. Cả 10 bảng mới có `organization_id not null` + `Ref ... [delete: restrict]`; unique theo tenant ở `patients`, `services`, `allergens`, `specialties`; ngoại lệ `token_hash` có miễn trừ.
- DB-SEC-01 Phân loại dữ liệu từng cột: Đạt. Mỗi bảng mới nhạy cảm có dòng "Phân loại" trong Note (`invoice_lines`, `guardianships`, `appointment_deposits`, `internal_notes`, `patient_insurances`, `password_reset_tokens`, `patient_allergies`); `allergens`, `specialties`, `doctor_specialties` là danh mục không nhạy cảm.
- DB-SEC-05 Dữ liệu nhạy cảm: quyền xem riêng, ghi log truy cập: Vi phạm có chủ đích. Chưa có nhật ký ai xem dị ứng hay số thẻ và chưa tách quyền xem ở tầng CSDL; N-07, N-15 không đòi; ghi ở Q-18. Ảnh khuôn mặt (N-20) chưa dựng chờ Q-06.
- DB-EVO-03 `NOT VALID` rồi `VALIDATE`: Không áp dụng cho schema; việc của kịch bản migration (chưa viết): unique bằng `CREATE UNIQUE INDEX CONCURRENTLY`, khóa ngoại và CHECK bằng `NOT VALID` rồi `VALIDATE`; `EXCLUDE` không có `NOT VALID` nên thêm trong cửa sổ bảo trì (đã ghi trong Note `appointments`).

## Điều chưa chắc

- Chọn xây `password_reset_tokens` cho N-14 là việc "viết lại giải pháp thành nhu cầu" (DB-REQ-05); nếu BA coi đó là dựng bảng cho câu chưa có đáp án thì bỏ bảng này, các phần khác không phụ thuộc.
- `appointments.ends_at` để `NOT NULL`: dữ liệu cũ cần thời lượng mặc định do BA chốt (Q-10), con số chưa có nguồn đo.
- Chọn thỏa `DB-IDX-01` (index dẫn đầu bằng khóa ngoại cha) thay vì `DB-SCL-03` (dẫn đầu bằng `organization_id`) ở `invoice_lines` và `invoices` — hai rule của bộ soát xung đột; ghi thành miễn trừ có lý do.
