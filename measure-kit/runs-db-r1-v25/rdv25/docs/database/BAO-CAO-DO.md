# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (07/10)

Skill `db-schema-design`, đường *Lượt cập nhật* (`references/update.md`). Bỏ ERD HTML và soát độc lập theo đề đo. Sổ câu hỏi: `docs/database/CAU-HOI-BA.md` (`Q-03 → Q-19`).

## Từng nhu cầu

- N-01 — đã áp: `appointment_services.unit_price` (giả định Q-09, Q-11)
- N-02 — đã áp: `appointments.ends_at` + CHECK + EXCLUDE gist `(doctor_id, tstzrange(starts_at, ends_at))` trong Note + index `appointments(doctor_id, starts_at)` (giả định Q-09, Q-10)
- N-03 — đã áp: `guardianships.guardian_person_id` · `guardianships.ward_person_id` · `guardianships.starts_on` · `guardianships.ends_on`; một người nhiều vai đã có sẵn (people + users + patients) (giả định Q-12)
- N-04 — đã áp: `patients.record_code` + unique một phần `(organization_id, lower(record_code)) WHERE deleted_at IS NULL` trong Note (giả định Q-13)
- N-05 — đã áp: `appointment_deposits.amount` · `appointment_deposits.received_on` (tất toán cọc chưa dựng — Q-14)
- N-06 — đã áp: `internal_notes.appointment_id` | `.patient_id` | `.invoice_id` + CHECK `num_nonnulls(...) = 1` (giả định Q-15)
- N-07 — đã áp: `allergens.name` · `patient_allergies.allergen_id` · `patient_allergies.severity` (enum `allergy_severity`) + index `(allergen_id)` (giả định Q-16)
- N-08 — đã áp: `specialties.name` · `specialties.is_active` · `doctor_specialties.(doctor_id, specialty_id)` + index `(specialty_id)`
- N-09 — đã áp: `appointments.status` — enum `appointment_status` thêm `confirmed`, `arrived`, `no_show`; máy chuyển trạng thái trong Note (mâu thuẫn với R-08, R-12, N-13 ghi Q-08)
- N-10 — không làm: giá trị suy ra (DB-REQ-06) — đếm `appointments` có `status = 'done'` theo `patient_id` qua index `(patient_id, starts_at)`; ghi ở từ điển mục 4, định nghĩa "hoàn thành" ở Q-08
- N-11 — đã áp: `services.code` + unique `(organization_id, lower(code))`
- N-12 — đã áp: index `invoices(appointment_id)`; theo bệnh nhân đi `appointments(patient_id, starts_at)` → `invoices(appointment_id)` (giả định Q-19)
- N-13 — đã áp: `patients.deleted_at` (có sẵn) + trigger tự hủy lịch hẹn tương lai ghi trong Note của `patients`; hóa đơn, thanh toán giữ nhờ khóa ngoại cũ (NO ACTION) (hủy lịch đã xác nhận: Q-08)
- N-14 — đã hỏi: Q-03 (CHẶN — trái R-09; đăng nhập email + mật khẩu đã có ở `users`)
- N-15 — đã áp: `patient_insurances.patient_id` (UNIQUE) · `.card_number` · `.insurer_name` · `.valid_until` (giả định Q-17)
- N-16 — đã hỏi: Q-04 (CHẶN — mâu thuẫn R-04)
- N-17 — đã hỏi: Q-05 (CHẶN — chưa có ca phẫu thuật, phòng mổ)
- N-18 — đã hỏi: Q-06 (CHẶN — chưa có gói trị liệu; lưu số còn lại là giá trị suy ra)
- N-19 — không làm: DB-REQ-07 — chi nhánh là dòng `clinics`, báo cáo dùng index có sẵn `appointments(organization_id, clinic_id, starts_at)`; lý do ghi Q-18
- N-20 — đã hỏi: Q-07 (CHẶN — sinh trắc trẻ em, giữ vô hạn, mọi lễ tân xem: trái R-10)

Tổng: 13 đã áp · 5 đã hỏi (CHẶN) · 2 không làm *(N-10, N-19)* = 20. Giả định 🔴 A của phần đã áp: 12 câu không chặn Q-08 → Q-19.

## Kết quả kiểm cuối

Lệnh (lần chạy thứ ba, lượt 6): `python S/check.py docs/database --brief --requirements 1-yeu-cau,docs/database --update-dictionary` → **thoát 0**.

```
1 cú pháp: ✓ cả hai parser nhận (dbml-renderer + dbml2sql)
2 rule · dialect postgresql · MỚI ERROR 0 · WARN 0 · INFO 2 · nợ cũ ERROR 0 · WARN 36 · INFO 16
── INFO (2)
 DB-INT-07  patient_insurances.card_number — trông như khóa nghiệp vụ nhưng chưa UNIQUE
 DB-SCL-03  invoices — bảng cỡ L: 1 index dẫn đầu bằng khóa ngoại (appointment_id) — chấp nhận
── NỢ CŨ TRÊN PHẦN VỪA SỬA (2)
 DB-INT-05  appointments.doctor_id — khóa ngoại chưa khai hành vi xóa
 DB-INT-05  invoices.appointment_id — khóa ngoại chưa khai hành vi xóa
ℹ access pattern: 6 đủ
5a từ điển: +8 bảng · +4 cột trên bảng cũ · khối d7–166 của DATA-DICTIONARY.md · cột nghiệp vụ thiếu note: 0
5 từ điển: 0 bảng không được nhắc · 0 cột đã bỏ còn trong từ điển · 0 mục nói tới bảng đã bỏ
5b truy vết: 1 định danh chưa có chỗ chứa (dict_update.py) · 6 đã hỏi hay cố ý không dựng · 0 bảng không có nguồn · 0 mã chết
Số: 21 bảng · 130 cột · 4 enum · 14 giá trị enum · 44 ref · 23 index
Cú pháp: đạt
Thay đổi: phá vỡ 1 · dữ liệu 4 · bảng +8 −0
Phá vỡ trên bảng cũ: 1 (index/unique 1)
```

Sau lần chạy đó chỉ sửa chữ trong `Note` (NOT VALID, phân loại `internal_notes.body`) và sổ câu hỏi; `dbml_model.py --stats` đọc lại ra cùng số: 21 bảng · 130 cột · 4 enum · 14 giá trị enum · 44 ref · 23 index.

- **INFO DB-INT-07** — để lại: N-15 không đòi số thẻ duy nhất; ghi ở Q-17.
- **INFO DB-SCL-03** — chấp nhận: index `invoices(appointment_id)` phục vụ AP-01 (N-12).
- **Nợ cũ trên phần vừa sửa (2)** — để lại có lý do ở `CAU-HOI-BA.md` mục cuối: NO ACTION đã chặn xóa cứng, đổi khóa ngoại bảng có dữ liệu là migration chưa duyệt.
- **Phá vỡ 1** — unique `services(organization_id, lower(code))`, do N-11 đòi. Lượt 4 có 3 phá vỡ khác (khai `delete: restrict` cho ba khóa ngoại cũ dưới danh nghĩa N-13); đã hoàn lại vì NO ACTION đã đủ cho N-13 — thành đề xuất dọn nợ.
- **Dữ liệu 4** — bốn cột NOT NULL trên bảng đã có dòng (`appointments.ends_at`, `appointment_services.unit_price`, `patients.record_code`, `services.code`): điền trước rồi bật ràng buộc — quy tắc điền chờ BA ở Q-09.
- **Truy vết** — `dict_update.py` là tên script trong khối máy sinh của từ điển, lọt vào vì lần chạy cuối quét cả `docs/database` để thấy sổ câu hỏi: báo nhầm, không phải nhu cầu dữ liệu.

## Soát tay B8 — 8 rule khối cổng liệt kê

| Rule | Kết luận | Bằng chứng |
|---|---|---|
| DB-SEC-06 Hạn lưu và xóa thật | **Vi phạm** | `patient_allergies` (sức khỏe), `guardianships` (trẻ em), `patient_insurances.card_number`: hạn lưu chỉ là giả định "theo hồ sơ bệnh nhân", chưa có số; đường xóa thật duy nhất là xóa cứng bệnh nhân, mà khóa ngoại cũ chặn — ghi Q-12, Q-16 |
| DB-EVO-02 Expand–contract | Đạt | Không bỏ hay đổi tên cột; 4 cột NOT NULL mới theo thứ tự thêm cột → điền → bật NOT NULL (từ điển mục 0, Q-09); giá trị enum chỉ thêm, không bỏ `done` |
| DB-INT-12 Khóa ngoại ghép giữ cùng tenant | **Vi phạm** | 8 bảng mới dùng FK đơn + `organization_id` như schema cũ; bảng cha chưa có UNIQUE `(organization_id, id)` nên dòng tổ chức A trỏ được bệnh nhân tổ chức B. Sửa phải thêm unique trên bảng cũ — để thành đề xuất |
| DB-MOD-11 Tiền: chỉ thêm, hoàn là dòng mới | Đạt | `appointment_deposits` chỉ ghi nhận cọc (CHECK `amount > 0`), hoàn/trừ cọc để dòng tất toán riêng (Q-14); `unit_price` là giá chụp, không phải sổ tiền; hoàn tiền hóa đơn vẫn là dòng âm ở `payments` (R-08) |
| DB-MOD-14 Mô hình đa tenant | Đạt | Cùng mô hình với schema cũ: một cột `organization_id` trên cả 8 bảng mới |
| DB-SEC-01 Phân loại dữ liệu từng cột | Đạt | Note ghi rõ: `patient_allergies` sức khỏe · `internal_notes.body` có thể chứa sức khỏe · `patient_insurances.card_number` cá nhân · `guardianships` dữ liệu trẻ em; còn lại là dữ liệu vận hành |
| DB-SEC-05 Quyền xem riêng, log truy cập | **Vi phạm** | `patient_allergies.allergen_id`: chỉ có quyền đọc theo R-10, chưa có quyền xem riêng hay log "ai đã xem" — N-07 cho lễ tân tra, nên quyền riêng chưa thêm; ghi Q-16 |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | Đạt | Note của `appointments` và `appointment_services` (bảng L) ghi CHECK thêm bằng `NOT VALID` rồi `VALIDATE CONSTRAINT`; EXCLUDE không có `NOT VALID` → tạo sau khi điền `ends_at`, giờ thấp điểm |

## Nợ cũ ngoài phần vừa sửa — đề xuất, chưa làm

- DB-INT-05 ×22 — khai `delete: restrict` (tenant, giao dịch) cho mọi khóa ngoại cũ trong một migration.
- DB-INT-14 ×2 — `patients.person_id`, `doctors.person_id` dùng `ref: -`: `dbml2sql` sinh khóa ngoại ngược chiều; đổi sang `>` giữ UNIQUE.
- DB-IDX-01 ×4 — thêm index cho `doctors.clinic_id`, `users.person_id`, `appointments.clinic_id`, `appointment_services.service_id`.
- DB-TYP-01 ×3 — `appointments`, `invoices`, `payments` (cỡ L) dùng UUIDv4; bảng mới không đổi, bảng cũ giữ nguyên.
- DB-SCL-02 ×1 — `appointment_services` thiếu `organization_id`.
- DB-IDX-12 ×1 — `patients.person_id` UNIQUE thường trên bảng xóa mềm.
- DB-INT-07 ×1 — `people.email` trông như khóa nhưng chưa UNIQUE.
- R-08 — `invoices.appointment_id` nên UNIQUE ("mỗi lịch hẹn đã khám có một hóa đơn"); lượt này chỉ thêm index thường vì N-12 chỉ đòi tra nhanh.
