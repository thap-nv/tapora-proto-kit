# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v2.0 (N-01 → N-20)

> Skill `db-schema-design`, lối vào *Lượt cập nhật*. BA vắng mặt: mục chặn không dựng bảng, ghi ở `CAU-HOI-BA.md` (`Q-03` → `Q-19`).
> Mốc trước khi sửa: `check.py promote` chép v1.0 làm `_check/last-green.dbml` (50 phát hiện coi là nợ cũ). **Không promote lại ở cuối** vì chưa có BA duyệt v2.0.

## 1. Từng nhu cầu

| Mã | Kết quả |
| :--- | :--- |
| N-01 | đã áp: `invoice_lines.unit_price` (+ `invoice_lines.quantity`, bảng mới `invoice_lines`) — snapshot giá lúc phát hành; hỏi thêm `Q-15` (không chặn) |
| N-02 | đã áp: `appointments.ends_at` + `CHECK (ends_at > starts_at)` + `EXCLUDE (doctor_id, khoảng giờ)` trong `Note`; hỏi thêm `Q-14` (không chặn), `Q-02` đóng |
| N-03 | đã áp: `guardianships.guardian_person_id` · `guardianships.patient_id` · `guardianships.valid_from` (+ `valid_to` 🔴 A, `Q-16`); nửa đầu (lễ tân là bệnh nhân, bác sĩ là người bảo hộ) đã được `R-02` phủ, không đổi cấu trúc |
| N-04 | đã áp: `patients.patient_code` + unique một phần `(organization_id, patient_code) WHERE deleted_at IS NULL`; `patients.person_id` đổi từ unique toàn bảng sang unique một phần; hỏi thêm `Q-12` |
| N-05 | đã áp: `appointment_deposits.amount` · `appointment_deposits.received_on` (`appointment_id` unique); số phận khoản cọc đã hỏi `Q-10` |
| N-06 | đã áp: `internal_notes.appointment_id` / `patient_id` / `invoice_id` (+ `body`, `created_by`, `CHECK` đúng một); hỏi thêm `Q-17` |
| N-07 | đã áp: `allergens.name` · `patient_allergies.allergen_id` · `patient_allergies.severity`; hỏi thêm `Q-18` |
| N-08 | đã áp: `specialties.name` · `specialties.is_active` · `doctor_specialties.doctor_id` / `specialty_id` |
| N-09 | đã áp: enum `appointment_status` thêm `confirmed` · `arrived` · `no_show`; máy trạng thái + trigger ghi ở `Note` của `appointments`; hỏi thêm `Q-09` |
| N-10 | đã áp: không thêm cột — giá trị suy ra từ `appointments.status = 'done'` (ghi ở `Note` của `patients` và từ điển mục 4); phụ thuộc `Q-09` |
| N-11 | đã áp: `services.code` + unique `(organization_id, lower(code))` |
| N-12 | đã áp: `invoices.appointment_id` unique; "theo bệnh nhân" đi qua chỉ mục có sẵn `appointments(patient_id, starts_at)` |
| N-13 | đã áp: khóa ngoại `delete: restrict` ở `patients.person_id`, `appointments.patient_id`, `invoices.appointment_id`, `payments.invoice_id`; hai trigger (hủy lịch tương lai khi ẩn, từ chối lịch cho hồ sơ đã ẩn) ghi ở `Note`; hỏi thêm `Q-11` · `Q-13` |
| N-14 | không làm: trái `R-09` ("không bao giờ lưu nguyên văn") và `DB-SEC-04`; nhu cầu thật (bác sĩ quên mật khẩu) đã hỏi ở `Q-07` kèm hướng đặt lại mật khẩu |
| N-15 | đã áp: `patient_insurances.card_number` · `insurer_name` · `expires_on` (`patient_id` unique); hỏi thêm `Q-19` |
| N-16 | đã hỏi: `Q-03` (mâu thuẫn `R-04`, CHẶN) |
| N-17 | đã hỏi: `Q-04` (requirement chưa định nghĩa ca phẫu thuật/phòng mổ, CHẶN) |
| N-18 | đã hỏi: `Q-05` (chưa có thực thể gói trị liệu; số còn lại là giá trị suy ra, không thêm cột, CHẶN) |
| N-19 | không làm: bảng riêng theo chi nhánh làm khóa ngoại tới lịch hẹn không còn thật, chống trùng giờ không chạy xuyên bảng, chi nhánh thứ tư phải sửa cấu trúc; ~243.000 lịch hẹn/năm/phòng khám đã có chỉ mục theo `(organization_id, clinic_id, starts_at)` — xin xác nhận ở `Q-08` |
| N-20 | đã hỏi: `Q-06` (sinh trắc + trẻ em + vô thời hạn + trái `R-10`, CHẶN) |

Tổng: **14 đã áp** (N-01 → N-13, N-15) · **4 đã hỏi** (N-16, N-17, N-18, N-20) · **2 không làm** (N-14, N-19).

## 2. Kết quả kiểm cuối của skill

Lệnh: `python scripts/check.py docs/database --dictionary docs/database/DATA-DICTIONARY.md --requirements 1-yeu-cau` — **thoát 0**.

```
── Trình ở cổng
Số: 22 bảng · 126 cột · 4 enum · 14 giá trị enum · 47 ref · 25 index
Cú pháp: đạt  (dbml-renderer + dbml2sql cùng nhận)
Phát hiện mới: ERROR 0 · WARN 0 · INFO 0 (nợ cũ 43)
Thay đổi: phá vỡ 6 · dữ liệu 3 · bảng +9 −0
Miễn trừ: 16 (mỗi miễn trừ có lý do trong schema-lint.json)
Từ điển: 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ
Truy vết: Schema → requirement 0 bảng không có nguồn · 0 mã chết
          Requirement → schema 3 định danh chưa có chỗ chứa: appointments_hn / _hcm / _dn (N-19, cố ý không dựng)
Access pattern: 7 đủ · 1 không có (AP-05, đã miễn trừ: index là unique một phần trong Note)
```

Nợ cũ: 50 (lúc promote) → 43. Bảy mục cũ được giải trên đường đi: `DB-INT-05` ở `patients.person_id`, `appointments.patient_id`, `invoices.appointment_id`, `payments.invoice_id` (khai `restrict` cho `N-13`); `DB-IDX-12` ở `patients.person_id` (unique một phần); `DB-IDX-01` ở `invoices.appointment_id` và `services.organization_id` (có chỉ mục mới). Không sửa các nợ cũ còn lại vì ngoài phạm vi các mã N.
Chưa chạy trên PostgreSQL thật: hai parser DBML chỉ kiểm cú pháp; các câu `EXCLUDE`, unique một phần và trigger trong `Note` chưa được chạy thử.

## 3. Soát tay B8 — 29 rule (`rules.py --manual B8`)

**14 Đạt · 3 Không áp dụng · 12 Vi phạm** (6 đã nêu thành câu hỏi · 3 nợ cũ/chưa viết · 3 chấp nhận có lý do).

| Rule | Kết luận | Bằng chứng |
| :--- | :--- | :--- |
| DB-IDX-11 | Vi phạm — chấp nhận (cỡ M) | chỉ mục bảng mới không dẫn đầu `organization_id` (ví dụ `invoice_lines (invoice_id, service_id)`); mọi truy vấn đi qua khóa cha; xét lại khi bật RLS |
| DB-INT-12 | Vi phạm — nợ cũ | mọi khóa ngoại là FK đơn, không có FK ghép `(organization_id, id)`; sửa đụng 47 ref nên không làm ở lượt này |
| DB-INT-15 | Đạt | `DATA-DICTIONARY.md` mục 5 (14 dòng rule → cơ chế → rủi ro còn lại) |
| DB-INT-16 | Đạt | 3 trigger, mỗi cái ghi sự kiện/việc/lý do ở `Note` của `appointments` (2) và `patients` (1); chưa viết mã trigger |
| DB-MOD-01 | Đạt | `guardianships.guardian_person_id → people.id`; không bảng mới nào lặp tên/SĐT |
| DB-MOD-02 | Đạt | cọc, bảo hộ, bảo hiểm, dị ứng là bảng riêng (`appointment_deposits`, `guardianships`, `patient_insurances`, `patient_allergies`) |
| DB-MOD-08 | Đạt | `invoice_lines.unit_price` chép lúc phát hành (`note` cột); tên dịch vụ chưa chốt (`Q-15`) |
| DB-MOD-11 | Đạt (quy ước) | `payments` chỉ thêm; `appointment_deposits.amount` không UPDATE — chưa cưỡng chế bằng quyền (xem DB-SEC-03) |
| DB-MOD-12 | Đạt | `guardianships.valid_from/valid_to` + `EXCLUDE`; bảng giá cố ý không có lịch sử, snapshot thay thế (`Note` của `services`) |
| DB-MOD-14 | Đạt | 9/9 bảng mới có `organization_id`; nợ cũ: `appointment_services` (baseline) |
| DB-MOD-17 | Đạt | chỉ `patients` (và `people` v1.0) xóa mềm; unique một phần cho `patient_code`, `person_id`; danh mục dùng `is_active`; chưa có view lọc `deleted_at` |
| DB-MOD-21 | Không áp dụng | không có tham số vận hành mới (mốc 2 tiếng của `R-12` chưa dựng — `Q-11`) |
| DB-NAM-07 | Vi phạm — nhẹ | ref mới và unique mới đã đặt tên `fk_`/`uq_`; chỉ mục thường chưa có tên (ví dụ `guardianships (patient_id, valid_from)`); ref và chỉ mục cũ không tên |
| DB-NAM-08 | Đạt | một khái niệm một tên: `patients`, `guardian_person_id`, `allergens`, `specialties` |
| DB-PERF-01 | Đạt | phi chuẩn hóa duy nhất là snapshot `invoice_lines.unit_price` và `organization_id` lặp ở bảng con (khai ở `Note` và `Project`); không chép `patient_id` vào `invoices` |
| DB-PERF-10 | Vi phạm — hoãn | chưa có `EXPLAIN` vì không có PostgreSQL và dữ liệu cỡ thật; phép thử ghi ở `Note` của `invoices` (~2 triệu hóa đơn); `AP-02` `AP-04` chấm đủ ở mức khai báo |
| DB-PERF-11 | Không áp dụng | chưa có chính sách RLS |
| DB-REQ-01 | Vi phạm — đã nêu | `R-12` không kiểm được vì thiếu `cancelled_at` (`Q-11`); `N-16` `N-17` `N-18` chưa có dữ liệu để kiểm (`Q-03` `Q-04` `Q-05`) |
| DB-REQ-02 | Vi phạm — đã nêu | `N-16 ↔ R-04` (`Q-03`) · `N-14 ↔ R-09` (`Q-07`) · `N-20 ↔ R-10` (`Q-06`) · `N-09 ↔ N-13/R-12` (`Q-09`) |
| DB-REQ-03 | Vi phạm — đã nêu | thiếu pha kết thúc/lịch sử: lịch hẹn (`Q-09` `Q-11`), cọc (`Q-10`), hóa đơn (`Q-15`), bảo hộ (`Q-16`), bảo hiểm (`Q-19`) |
| DB-REQ-06 | Đạt | `N-10` và `N-18` không lưu giá trị suy ra; tổng hóa đơn không lưu (từ điển mục 4) |
| DB-REQ-08 | Đạt | `N-12` đo từ `Q-01`: ~730.000 hóa đơn/năm → cỡ M, phương án nới ở `Q-08`; `N-20` "vô thời hạn" nêu ở `Q-06` `Q-13` |
| DB-REQ-09 | Vi phạm — đã nêu, không dựng | `N-20` (`Q-06`) · `N-14` (`Q-07`) · hạn lưu (`Q-13`) |
| DB-SEC-01 | Đạt | từ điển mục 6 + `note` ở cột nhạy cảm (`internal_notes.body`, `patient_allergies`, `patient_insurances.*`) |
| DB-SEC-02 | Vi phạm — nợ cũ | không có `CREATE POLICY` nào; `R-10` (phạm vi theo phòng khám) chưa mô hình hóa vì `patients` không có `clinic_id` (`Q-17`) |
| DB-SEC-03 | Vi phạm — chưa viết | chưa có DDL vai/quyền; yêu cầu chỉ `INSERT/SELECT` trên `invoice_lines`, `payments` ghi ở từ điển mục 5 |
| DB-SEC-05 | Vi phạm — đã nêu | dị ứng, ghi chú, bảo hiểm là dữ liệu sức khỏe mà chưa có quyền xem riêng và `access_logs` (`Q-17`, `Q-06`) |
| DB-SEC-06 | Vi phạm — đã nêu | chưa có hạn lưu, chưa có `purged_at` (`Q-13`) |
| DB-SEC-07 | Không áp dụng | schema không chứa tệp (ảnh khuôn mặt `N-20` chưa dựng) |

## 4. Điều chưa chắc

1. **`Q-09`**: giữ `done` song song `arrived` và tự thêm hai mũi tên (`confirmed → cancelled`, `arrived → done`) vượt danh sách của `N-09`. Hướng ngược lại (bỏ `done`) đắt vì PostgreSQL không bỏ được giá trị enum.
2. **`N-04`**: nới `patients.person_id` từ unique toàn bảng thành unique một phần là hệ quả của việc cho cấp lại mã/ẩn hồ sơ — vượt chữ của `N-04` một chút.
3. **`N-01`**: hiểu "giá lúc khám" = giá lúc phát hành hóa đơn; hóa đơn cũ trước v2.0 không thể có giá đúng lúc đó.
4. Cỡ M, SLA p95 200 ms và mọi con số tải đều là giả định `Q-01`, chưa đo; chưa chạy PostgreSQL thật cho `EXCLUDE` và trigger.
