# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (db-schema-design, đường `update.md`)

BA vắng mặt: câu cần hỏi ghi ở `CAU-HOI-BA.md` (Q-03 → Q-17), đi tiếp bằng giả định 🔴 A, không dựng bảng cho câu CHẶN. Không vẽ ERD HTML, không gọi subagent soát.

## 1. Từng nhu cầu

- N-01 — đã áp: `invoice_lines.unit_price` (bảng mới `invoice_lines`; chép từ `services.price` lúc lập hóa đơn). Q-17 không chặn.
- N-02 — đã áp: `appointments.ends_at` + `ex_appointments_doctor_no_overlap` (EXCLUDE gist trong Note) + index `appointments(doctor_id, starts_at)`. Q-03 không chặn.
- N-03 — đã áp: `patient_guardianships.patient_id`, `guardian_person_id`, `started_on`, `ended_on` (bảng mới); một người nhiều vai đã có sẵn từ `people`.
- N-04 — đã áp: `patients.record_code` + `uq_patients_org_record_code` (unique một phần `WHERE deleted_at IS NULL`, trong Note). Q-14 không chặn.
- N-05 — đã áp: `appointment_deposits.amount`, `received_on`, `appointment_id` UNIQUE (bảng mới). Q-11 không chặn.
- N-06 — đã áp: `internal_notes.appointment_id` / `patient_id` / `invoice_id` + `body`, `created_by` (bảng mới; CHECK `num_nonnulls = 1` trong Note).
- N-07 — đã áp: `patient_allergies.substance`, `severity` (bảng mới + enum `allergy_severity`; index tra ngược `(organization_id, lower(substance), patient_id)`). Q-13, Q-16 không chặn.
- N-08 — đã áp: `specialties.name`, `is_active` + `doctor_specialties.doctor_id`, `specialty_id` (hai bảng mới). Q-15 không chặn.
- N-09 — đã áp một phần: `appointments.status` thêm `confirmed`, `arrived`, `no_show`, giữ `done`; đã hỏi: Q-09 (CHẶN phần trigger chuyển trạng thái — N-09 không có "đã xác nhận → đã hủy" mà R-12 và N-13 cần), Q-10.
- N-10 — không làm: giá trị suy ra (DB-REQ-06), đếm `appointments.status = 'done'` khi hiển thị, không thêm cột; "hoàn thành" chờ Q-10.
- N-11 — đã áp: `services.code` + unique `(organization_id, lower(code))`.
- N-12 — đã áp: `invoices.appointment_id` UNIQUE (một lịch hẹn một hóa đơn, R-08); tra theo bệnh nhân qua `appointments(patient_id, starts_at)`, không lặp `patient_id` ở hóa đơn; cả hai khai ở `access_patterns` AP-01, AP-02.
- N-13 — đã áp: `patients.deleted_at` (có sẵn) + trigger `trg_patients_hide_cancel_future` (Note); không `Ref` nào xóa dây chuyền, mọi `Ref` mới `restrict`. Hệ quả chưa chốt: Q-09, Q-11.
- N-14 — đã hỏi: Q-05 (CHẶN) — không dựng cột mật khẩu đọc được, trái R-09.
- N-15 — đã áp: `patient_insurances.patient_id` UNIQUE, `insurer_name`, `insurance_number`, `expires_on` (bảng mới). Q-16 không chặn.
- N-16 — đã hỏi: Q-04 (CHẶN) — mâu thuẫn R-04, và đụng EXCLUDE của N-02.
- N-17 — đã hỏi: Q-06 (CHẶN) — chưa có thực thể ca phẫu thuật.
- N-18 — đã hỏi: Q-07 (CHẶN) — chưa có thực thể gói trị liệu; không lưu cột đếm.
- N-19 — không làm: tách bảng theo chi nhánh; mục tiêu thật (báo cáo từng chi nhánh nhanh) đạt bằng index `(organization_id, clinic_id, starts_at)` sẵn có, cỡ ≈ 730.000 dòng/năm (Q-01 chưa đo). Q-12 không chặn.
- N-20 — đã hỏi: Q-08 (CHẶN) — ảnh khuôn mặt trẻ em, giữ vô thời hạn, mọi lễ tân xem được.

Tổng 20: đã áp 13 (trong đó N-09 một phần) · đã hỏi và chưa dựng 5 (N-14, N-16, N-17, N-18, N-20) · không làm 2 (N-10, N-19). Câu hỏi: 15 (6 CHẶN: Q-04 → Q-09; 9 không chặn).

## 2. Kết quả kiểm cuối của skill

`check.py docs/database --brief --requirements 1-yeu-cau` (lần 3, đủ hai parser) thoát 0:

```
1 cú pháp: ✓ cả hai parser nhận (dbml-renderer + dbml2sql)
2 rule · dialect postgresql · MỚI ERROR 0 · WARN 0 · INFO 5 · nợ cũ ERROR 0 · WARN 32 · INFO 9
ℹ access pattern: 6 đủ
5b truy vết: 3 định danh chưa có chỗ chứa · 0 câu tự nhận "chưa có chỗ chứa" · 0 bảng không có nguồn · 0 mã chết
Số: 21 bảng · 123 cột · 4 enum · 14 giá trị enum · 45 ref · 23 index
Cú pháp: đạt
Phát hiện mới: ERROR 0 · WARN 0 · INFO 5 (nợ cũ 41)
Thay đổi: phá vỡ 2 · dữ liệu 3 · bảng +8 −0
```

Sau khi viết từ điển, chạy lại `check.py … --skip-syntax --dictionary DATA-DICTIONARY.md`: thoát 0, cùng số, thêm dòng `5 từ điển: 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ · 0 mục nói tới bảng đã bỏ`; `dict_update.py` chạy lại ra file y hệt.

Số so với v1.0: 13 → 21 bảng · 72 → 123 cột · 3 → 4 enum · 9 → 14 giá trị enum · 24 → 45 ref · 8 → 23 index. Nợ cũ 52 → 41, chủ yếu do cấu hình chứ không do sửa nợ: `DB-IDX-01` 14 → 4 (khai `tenant_column` gộp các FK `organization_id` thành một INFO tổng hợp; thêm hai index `appointments(doctor_id, starts_at)` và unique `invoices(appointment_id)`), `DB-SCL-01` hết do khai `volumes`.

Năm INFO mới: `DB-INT-07` `patient_insurances.insurance_number` (trông như khóa nghiệp vụ nhưng chưa UNIQUE — N-15 không đòi duy nhất, gia đình có thể dùng chung thẻ) · `DB-IDX-01` `internal_notes.created_by` (cột kiểm toán, `users` không xóa cứng) · `DB-IDX-01` tổng hợp FK `organization_id` · `DB-MOD-18` `invoice_lines` (không `created_at`) · `DB-SCL-02` `appointment_services` (bảng cũ, không có `organization_id`; hiện ra vì lượt này khai `tenant_column`). Không miễn trừ nào (`waivers` rỗng).

"3 định danh chưa có chỗ chứa" là ba tên bảng `appointments_hn`, `appointments_hcm`, `appointments_dn` của N-19, cố ý không tạo (Note của `appointments` nói rõ).

### Soát tay B8 — 8 rule liên quan thay đổi (`rules.py --manual B8 --changed`)

| Rule | Kết luận | Bằng chứng |
|---|---|---|
| DB-SEC-06 Hạn lưu và xóa thật | **Vi phạm** (có chủ đích, chờ Q-16) | `patient_allergies`, `patient_insurances` chưa có hạn lưu, chưa có `purged_at`; Note ghi "Q-16" |
| DB-EVO-02 Expand–contract | Đạt | 5 thay đổi chạm dữ liệu cũ đều có đường nhiều bước: thêm cột cho phép rỗng → điền → `NOT NULL`; enum `ADD VALUE`; unique `CONCURRENTLY` — Note các bảng và `DATA-DICTIONARY.md` mục 6 |
| DB-INT-12 FK ghép giữ cùng tenant | **Vi phạm** (nợ kế thừa v1.0, chưa sửa) | 8 bảng mới nối cha bằng FK đơn cạnh `organization_id` riêng nên dòng tenant A có thể trỏ patient tenant B; v1.0 cùng kiểu (24 ref đơn). Sửa cần unique `(organization_id, id)` ở các bảng cha rồi đổi cả `Ref` cũ — nên làm lượt riêng hoặc dùng RLS |
| DB-MOD-11 Tiền chỉ thêm | **Vi phạm một phần** | `appointment_deposits` sửa tại chỗ, chưa có dòng hoàn hay trừ cọc (Q-11); `invoice_lines` Note nói không sửa sau khi lập nhưng CSDL chưa cưỡng chế (chưa có trigger chặn UPDATE) |
| DB-MOD-14 Mô hình đa tenant | Đạt | cả 8 bảng mới có `organization_id uuid not null` + `Ref` tới `organizations`; `tenant_column` khai trong `schema-lint.json` |
| DB-SEC-01 Phân loại dữ liệu từng cột | **Vi phạm một phần** | `patient_allergies`, `patient_insurances` có dòng "Phân loại" ở Note; chưa phân loại `internal_notes.body` (văn bản tự do, có thể chứa chi tiết bệnh), `patient_guardianships`, `appointment_deposits`; `invoice_lines`, `specialties`, `doctor_specialties` không chứa dữ liệu cá nhân mới. Phát hiện sau lần kiểm thứ ba nên chưa sửa |
| DB-SEC-05 Quyền xem riêng, log truy cập | **Vi phạm** (chờ Q-16, Q-08) | chưa có `access_logs`; quyền xem dị ứng và bảo hiểm chưa tách khỏi quyền thao tác |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | Không áp dụng | bảng mới rỗng; `appointments` cỡ M, dưới ngưỡng L nên khóa ngắn (Note viết `ADD CONSTRAINT … CHECK` thẳng, đổi sang `NOT VALID` + `VALIDATE` nếu bảng lớn hơn); EXCLUDE không có `NOT VALID` |

## 3. Lệch khỏi đường của skill và chỗ chưa chắc

- Đọc thêm ngoài `update.md`: `dbml-conventions.md` (mục khuôn `schema-lint.json`, vì chưa có file), `indexing-access-patterns.md` (đầu file, khuôn access pattern), `dbml_lint.py` 40 dòng `score_pattern` (vì AP-05 báo "một phần" — nguyên nhân: cột biểu thức trong index mang dấu huyền, `eq` phải viết `` `lower(substance)` ``). `rules.py --show` bốn rule trước khi viết.
- `check.py` đủ hai parser chạy 3 lần (đúng trần); thêm hai lần `--skip-syntax` sau khi chỉ sửa từ điển.
- Chưa chắc: (1) N-01 chọn `invoice_lines` (giá chép lúc lập hóa đơn) thay vì thêm giá vào `appointment_services` — đúng nếu hóa đơn lập ngay khi khám xong (Q-17); (2) N-09 giữ `done` cạnh `arrived`; (3) Q-16 để không chặn dù DB-REQ-09 nói thiếu hạn lưu thì chặn — lý do nêu ngay trong câu; (4) N-05 tách bảng thay vì hai cột trên `appointments`.
