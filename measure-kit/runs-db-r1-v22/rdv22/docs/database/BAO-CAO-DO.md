# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (N-01 → N-20)

## Từng nhu cầu

- N-01 — đã áp: appointment_services.unit_price (kèm Q-09, thời điểm chép giá, không chặn)
- N-02 — đã áp: appointments.ends_at + EXCLUDE appointments_doctor_no_overlap trong Note (kèm Q-10, điền ends_at cho dữ liệu cũ, không chặn)
- N-03 — đã áp: guardianships.guardian_person_id, guardianships.ward_patient_id, guardianships.starts_on, guardianships.ends_on (lễ tân kiêm bệnh nhân dùng people + users + patients có sẵn)
- N-04 — đã áp: patients.record_code + unique một phần patients_record_code_active_uq WHERE deleted_at IS NULL (kèm Q-11, không chặn)
- N-05 — đã áp: appointment_deposits.amount, appointment_deposits.received_on (kèm Q-12, xử lý cọc khi hủy/lập hóa đơn, không chặn)
- N-06 — đã áp: internal_notes.appointment_id, internal_notes.patient_id, internal_notes.invoice_id + CHECK num_nonnulls = 1, internal_notes.body
- N-07 — đã áp: patient_allergies.substance, patient_allergies.severity (enum allergy_severity) + index patient_allergies_substance_idx (kèm Q-13, không chặn)
- N-08 — đã áp: specialties.name, specialties.is_active + doctor_specialties.doctor_id, doctor_specialties.specialty_id
- N-09 — đã hỏi: Q-03 (CHẶN phần máy chuyển trạng thái); giá trị enum đã áp: appointments.status thêm confirmed, arrived, no_show
- N-10 — không làm: giá trị suy ra, đếm appointments.status = done qua index (patient_id, starts_at), không lưu; "hoàn thành" là trạng thái nào chờ Q-03
- N-11 — đã áp: services.code + unique services_org_code_uq (organization_id, lower(code))
- N-12 — đã áp: invoices.appointment_id unique invoices_appointment_uq (organization_id, appointment_id); theo bệnh nhân qua appointments (patient_id, starts_at); AP-01, AP-02 đủ
- N-13 — đã áp: appointments.patient_id, invoices.appointment_id, payments.invoice_id chuyển delete: restrict + patients.deleted_at và trigger tự hủy lịch tương lai (Note); lịch confirmed chờ Q-03, cọc chờ Q-12
- N-14 — đã hỏi: Q-04 (CHẶN, trái R-09 đã chốt; không dựng, đề xuất liên kết đặt lại dùng một lần)
- N-15 — đã áp: patient_insurances.patient_id UNIQUE, patient_insurances.card_number, patient_insurances.insurer_name, patient_insurances.valid_until (kèm Q-13, không chặn)
- N-16 — đã hỏi: Q-05 (CHẶN, trái R-04 đã chốt; kéo theo chặn trùng giờ N-02 và doanh thu theo bác sĩ R-11)
- N-17 — đã hỏi: Q-06 (CHẶN, chưa có ca phẫu thuật, phòng mổ, lịch hẹn không gắn phòng)
- N-18 — đã hỏi: Q-07 (CHẶN, chưa có gói trị liệu; không lưu số còn lại trên patients)
- N-19 — không làm: ra lệnh giải pháp, bảng theo từng chi nhánh là danh sách cố định thành bảng; một bảng appointments + index (organization_id, clinic_id, starts_at), AP-04 đủ (ghi Q-14)
- N-20 — đã hỏi: Q-08 (CHẶN, sinh trắc trẻ em, giữ vô hạn, mọi lễ tân xem được trái R-10; không dựng)

Tổng 20: 12 áp đủ · 1 áp một phần, phần còn lại chặn (N-09, Q-03) · 5 chặn, không dựng (N-14, N-16, N-17, N-18, N-20 — Q-04 → Q-08) · 2 không làm (N-10, N-19). Sổ câu hỏi: 6 câu chặn, 6 câu không chặn (Q-03 → Q-14).

## Kết quả kiểm cuối

Lệnh: `python S/check.py docs/database --brief --requirements 1-yeu-cau --update-dictionary` — **thoát 0**.

```
1 cú pháp: ✓ cả hai parser nhận (dbml-renderer + dbml2sql)
2 rule · dialect postgresql · MỚI ERROR 0 · WARN 1 · INFO 2 · nợ cũ ERROR 0 · WARN 36 · INFO 13
── WARN (1)
 DB-SCL-03  appointments: doctor_id+starts_at d190 — bảng cỡ L: index không dẫn đầu bằng organization_id
── INFO (2)
 DB-IDX-04  guardianships.guardian_person_id — index là tiền tố của (guardian_person_id, ward_patient_id)
 DB-INT-07  patient_insurances.card_number — trông như khóa nghiệp vụ nhưng chưa UNIQUE
ℹ access pattern: 6 đủ
5a từ điển: +7 bảng · +4 cột trên bảng cũ · cột nghiệp vụ thiếu note: 0
5 từ điển: 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ · 0 mục nói tới bảng đã bỏ
5b truy vết: 0 định danh chưa có chỗ chứa · 3 đã hỏi hay cố ý không dựng · 0 bảng không có nguồn · 0 mã chết
Số: 20 bảng · 122 cột · 4 enum · 14 giá trị enum · 42 ref · 23 index
Thay đổi: phá vỡ 5 · dữ liệu 4 · bảng +7 −0
```

Xử lý phát hiện mới:

- **DB-SCL-03 WARN (giữ lại)** — `(doctor_id, starts_at)` để cột khóa ngoại đứng đầu (DB-IDX-01; sửa luôn nợ cũ `appointments.doctor_id`), cùng dáng với `(patient_id, starts_at)` của v1.0. Đổi sang `(organization_id, doctor_id, starts_at)` thì DB-IDX-01 lại bắt. Chưa có kế hoạch phân mảnh theo tổ chức (Q-01: 3 phòng khám).
- **DB-IDX-04 INFO (báo nhầm)** — index đích là unique một phần `WHERE ends_on IS NULL`, không phủ các dòng bảo hộ đã kết thúc; `(guardian_person_id)` đầy đủ vẫn cần cho khóa ngoại.
- **DB-INT-07 INFO (cố ý)** — requirement không nói một số thẻ bảo hiểm chỉ thuộc một bệnh nhân; không tự thêm rule.

Nợ cũ: 49 (mốc v1.0 có 54); không bắt buộc sửa ở lượt này.

## Soát tay B8 — 7 rule liên quan thay đổi

| Rule | Kết luận | Bằng chứng |
|---|---|---|
| DB-EVO-02 Expand–contract | Đạt | thứ tự 4 bước (mở rộng → ứng dụng mới → backfill → thu hẹp) ở `DATA-DICTIONARY.md` mục 0, phần viết tay |
| DB-INT-12 FK ghép giữ cùng tenant | **Vi phạm** | 7 bảng mới dùng FK đơn (ví dụ `internal_notes.patient_id → patients.id`) theo quy ước v1.0: nếu ứng dụng lỗi, một dòng của tổ chức A trỏ được tới bệnh nhân của tổ chức B. Đề xuất một lượt riêng sửa đồng loạt cả FK cũ lẫn mới: UNIQUE `(organization_id, id)` ở bảng cha + Ref ghép |
| DB-MOD-11 Sổ tiền chỉ thêm | Đạt | `appointment_deposits`: hoàn cọc là dòng âm, unique một phần chỉ trên dòng nhận cọc; `payments` không đổi; `unit_price` là giá chép, không phải dòng tiền |
| DB-MOD-14 Mô hình đa tenant | Đạt | 7 bảng mới đều có `organization_id` NOT NULL + FK restrict, cùng mô hình cột tenant của v1.0 |
| DB-SEC-01 Phân loại từng cột | Đạt | `DATA-DICTIONARY.md` mục 5 (sức khỏe · cá nhân · tài chính · nội bộ); phân loại nằm ở từ điển, chưa có trong `Note` của DBML |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | Đạt | bước 4: CHECK NOT NULL, FK restrict mới đều `NOT VALID` → `VALIDATE`; unique tạo `CONCURRENTLY` |
| DB-EVO-08 Backfill chia lô | Đạt | bước 3: lô khoảng 10.000 dòng theo `id`, mỗi lô một giao dịch, chạy lại được |

## Ghi chú đo

- `check.py`: 3 lần chạy (mốc · sau khi viết · sau khi sửa) + 2 lần `promote`. Lần `promote` thứ hai chạy trên schema v1.0 **chưa đổi**, sau khi thêm `schema-lint.json` (tenant, cỡ bảng), để các phát hiện có sẵn ở v1.0 theo rule tenant được tính là nợ cũ, không bị tính là lỗi mới.
- Sau lần chạy cuối chỉ sửa phần viết tay của từ điển (mục 0 thứ tự triển khai, mục 5 phân loại), không đụng schema; chưa chạy lại để kiểm phần này.
- Không vẽ `schema.html`, không gọi subagent soát độc lập (theo yêu cầu).
