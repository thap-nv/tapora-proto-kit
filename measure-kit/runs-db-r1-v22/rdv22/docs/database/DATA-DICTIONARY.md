# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`.

## 0. Thay đổi so với bản trước

<!-- db-schema-design:changes:start -->
> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối; số bảng/cột lấy ở dòng đếm dưới đây, không gõ lại ở phần viết tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **20 bảng · 122 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 7 | 0 | 0 |
| cột | 4 | 0 | 0 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 3 |
| index | 3 | 0 | 0 |

Phân loại: **phá vỡ 5** · **dữ liệu 4** · index 1 · cộng thêm 11 · ghi chú bảng đổi 10

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 5:
- index `services(organization_id, `lower(code)`)` thêm UNIQUE
- index `invoices(organization_id, appointment_id)` thêm UNIQUE
- ref `appointments(patient_id) → patients` hành vi xóa — → restrict
- ref `invoices(appointment_id) → appointments` hành vi xóa — → restrict
- ref `payments(invoice_id) → invoices` hành vi xóa — → restrict

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 4:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointment_services.unit_price` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (7): `guardianships`, `appointment_deposits`, `internal_notes`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived`
- `appointment_status` thêm giá trị `confirmed`
- `appointment_status` thêm giá trị `no_show`

## Bảng mới (7)

### `guardianships`

Quan hệ bảo hộ: ai bảo hộ bệnh nhân nào, từ ngày nào (N-03). Kết thúc = đặt ends_on; dòng giữ lại làm lịch sử.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ — bất kỳ người nào trong people (bác sĩ, nhân viên, người nhà) (N-03) |
| `ward_patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | Bệnh nhân được bảo hộ (N-03) |
| `starts_on` | `date` | No |  |  | Bảo hộ có hiệu lực từ ngày (N-03) |
| `ends_on` | `date` | Yes |  |  | Ngày kết thúc bảo hộ; trống = đang hiệu lực |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn (N-05). Mỗi lịch hẹn tối đa một khoản nhận cọc:

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict |  | khóa ngoại tới `appointments` |
| `amount` | `numeric(12,2)` | No |  |  | Số tiền cọc: dương = nhận cọc, âm = hoàn cọc (dòng mới, không sửa dòng cũ) (N-05) |
| `received_on` | `date` | No |  |  | Ngày nhận cọc, hoặc ngày hoàn với dòng âm (N-05) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `internal_notes`

Ghi chú nội bộ gắn vào một lịch hẹn, một bệnh nhân hoặc một hóa đơn (N-06). Ba FK thật, không dùng cặp *_type + *_id.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:restrict |  | Ghi chú gắn vào lịch hẹn; đúng một trong ba cột đích có giá trị (N-06) |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:restrict |  | Ghi chú gắn vào bệnh nhân (N-06) |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:restrict |  | Ghi chú gắn vào hóa đơn (N-06) |
| `author_user_id` | `uuid` | No | FK → users.id xóa:restrict |  | Nhân viên viết ghi chú |
| `body` | `text` | No |  |  | Nội dung ghi chú nội bộ, không hiện cho bệnh nhân |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |
| `deleted_at` | `timestamptz` | Yes |  |  | Ẩn ghi chú |

### `patient_allergies`

Dị ứng của bệnh nhân, mỗi chất một dòng (N-07). Lễ tân tra bệnh nhân theo chất qua patient_allergies_substance_idx.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade |  | khóa ngoại tới `patients` |
| `substance` | `varchar(120)` | No |  |  | Tên chất gây dị ứng, nhập tự do; tra không phân biệt hoa thường (N-07) |
| `severity` | `allergy_severity` | No |  |  | Mức độ dị ứng: nhẹ hay nặng (N-07) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `specialties`

Danh mục chuyên khoa do quản trị viên quản lý (N-08). 🔴 A: bớt = tắt is_active, không xóa dòng.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa, quản trị viên thêm trên màn hình quản trị (N-08) |
| `is_active` | `boolean` | No |  | `true` | Bớt chuyên khoa = tắt; dòng giữ lại để bác sĩ đã gắn không mất lịch sử |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `doctor_specialties`

Bác sĩ thuộc chuyên khoa nào; một bác sĩ nhiều chuyên khoa (N-08). Gỡ bác sĩ khỏi chuyên khoa = xóa dòng.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:cascade |  | khóa ngoại tới `doctors` |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | khóa ngoại tới `specialties` |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_insurances`

Hồ sơ bảo hiểm hiện hành của bệnh nhân (N-15). Đổi thẻ = sửa dòng, không giữ lịch sử thẻ cũ — 🔴 A, Q-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade, UNIQUE |  | Bệnh nhân sở hữu hồ sơ; UNIQUE = tối đa một hồ sơ bảo hiểm (N-15) |
| `card_number` | `varchar(30)` | No |  |  | Số thẻ bảo hiểm (N-15) — dữ liệu cá nhân |
| `insurer_name` | `varchar(160)` | No |  |  | Tên nhà bảo hiểm, nhập tự do (N-15) |
| `valid_until` | `date` | No |  |  | Hạn dùng của thẻ bảo hiểm (N-15) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

## Cột mới trên bảng đã có (4)

> Cột mới của bảng cũ chỉ cần ở đây — không phải thêm vào bảng cột viết tay của bảng đó.

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(20)` | No |  |  | Mã hồ sơ bệnh nhân, duy nhất trong tổ chức giữa các hồ sơ chưa ẩn; hồ sơ đã ẩn nhả mã để cấp lại cho người khác (N-04) |
| `services` | `code` | `varchar(30)` | No |  |  | Mã dịch vụ (ví dụ KHAM-TQ), duy nhất trong tổ chức, không phân biệt hoa thường; tổ chức khác dùng lại được (N-11) |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc lịch hẹn; khoảng [starts_at, ends_at) dùng để chặn bác sĩ trùng giờ (N-02) |
| `appointment_services` | `unit_price` | `numeric(12,2)` | No |  |  | Giá một đơn vị chép từ services.price lúc khám; hóa đơn in giá này, không đổi khi bảng giá đổi (N-01) |

<!-- db-schema-design:changes:end -->


**v1.1 — 07/10/2026**, lượt cập nhật giai đoạn 2 theo `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20). Nhu cầu chưa dựng và giả định 🔴 A: `CAU-HOI-BA.md` (Q-03 → Q-14). Số bảng, cột và danh sách thay đổi: khối máy sinh ngay trên.

Việc di trú dữ liệu v1.0 → v1.1: điền `services.code` cho dịch vụ cũ (N-11) · điền `appointment_services.unit_price` bằng giá hiện hành (Q-09) · điền `appointments.ends_at` (Q-10) trước khi bật EXCLUDE · điền `patients.record_code` (N-04) · soát hóa đơn trùng lịch hẹn trước khi thêm `invoices_appointment_uq` (R-08). Ba FK `appointments.patient_id`, `invoices.appointment_id`, `payments.invoice_id` chuyển sang `delete: restrict` (N-13).

Thứ tự triển khai (expand–contract) cho các thay đổi phá vỡ và chạm dữ liệu cũ mà khối trên liệt kê:

1. **Mở rộng** — tạo 7 bảng mới; thêm bốn cột `record_code`, `code`, `ends_at`, `unit_price` ở dạng **cho phép NULL**; `ALTER TYPE appointment_status ADD VALUE` ba giá trị mới (ứng dụng phải hiểu giá trị mới trước khi ghi chúng); `CREATE EXTENSION btree_gist`.
2. **Ứng dụng mới** ghi đủ các cột mới cho mọi dòng mới (bản cũ vẫn chạy được vì cột còn NULL được).
3. **Backfill chia lô** — mỗi lô khoảng 10.000 dòng theo `id`, mỗi lô một giao dịch, chạy lại được: `ends_at` (Q-10), `unit_price` (Q-09), `code`, `record_code`.
4. **Thu hẹp** — `CHECK (… IS NOT NULL) NOT VALID` rồi `VALIDATE CONSTRAINT`, sau đó `SET NOT NULL`; index unique mới (`services_org_code_uq`, `invoices_appointment_uq`, `patients_record_code_active_uq`) tạo `CONCURRENTLY`; FK đổi sang restrict tạo mới `NOT VALID` rồi `VALIDATE`, bỏ FK cũ; EXCLUDE `appointments_doctor_no_overlap` thêm sau cùng, khi đã soát hết các lịch trùng của dữ liệu cũ.

## 1. Kiến trúc và nhóm bảng

Bốn vùng: **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`, `patient_allergies`, `patient_insurances`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `specialties`, `doctor_specialties`, `appointments`, `appointment_services`) · **Tiền** (`services`, `invoices`, `payments`, `appointment_deposits`) · **Ghi chú** (`internal_notes`) · cộng `organizations` làm tenant.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ đóng — N-02 thêm `appointments.ends_at`; điền dữ liệu cũ: Q-10 |
| Q-03 → Q-14 | Câu hỏi của lượt v1.1 | xem `CAU-HOI-BA.md` — 6 câu chặn, 6 câu không chặn |

## 3. Data Dictionary — các bảng cốt lõi

### 3.1 `people` — danh tính

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `full_name` | `varchar(160)` | No | | | Họ tên |
| `phone` | `varchar(20)` | Yes | | | Số điện thoại |
| `email` | `varchar(160)` | Yes | | | Email |
| `birth_date` | `date` | Yes | | | Ngày sinh |
| `deleted_at` | `timestamptz` | Yes | | | Xóa mềm |

### 3.2 `appointments` — lịch hẹn

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `clinic_id` | `uuid` | No | FK → clinics.id | | Phòng khám |
| `patient_id` | `uuid` | No | FK → patients.id | | Bệnh nhân |
| `doctor_id` | `uuid` | No | FK → doctors.id | | Bác sĩ phụ trách (đúng một — R-04) |
| `starts_at` | `timestamptz` | No | | | Giờ bắt đầu |
| `status` | `appointment_status` | No | | `booked` | Trạng thái |

### 3.3 Các bảng còn lại

Xem `schema.dbml` — mỗi bảng có `Note` ghi nguồn requirement.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | `SUM(quantity * unit_price)` của `appointment_services` | giá đã chép lúc khám (N-01), không lệch khi bảng giá đổi |
| Số lần khám đã hoàn thành (N-10) | đếm `appointments` của bệnh nhân có `status = 'done'`, index `(patient_id, starts_at)` | số lưu sẽ lệch mỗi khi trạng thái đổi; "hoàn thành" là trạng thái nào chờ Q-03 |
| Số buổi điều trị còn lại (N-18) | chưa có nguồn — chưa có bảng gói | không lưu trên `patients`; chờ Q-07 |

## 5. Phân loại dữ liệu — bảng mới v1.1

Cột không nêu dưới đây thuộc loại **nội bộ** (định danh, khóa ngoại, thời điểm). Hạn lưu của mọi loại dưới đây theo hồ sơ bệnh nhân — 🔴 A, Q-13.

| Cột | Loại | Ai xem | Ghi chú |
|---|---|---|---|
| `patient_allergies.substance`, `patient_allergies.severity` | sức khỏe — nhạy cảm | lễ tân, bác sĩ, quản trị viên (theo R-10) | lễ tân tra theo chất (N-07) |
| `patient_insurances.card_number` | cá nhân — định danh | lễ tân, kế toán, quản trị viên | không đặt UNIQUE: requirement không nói một số thẻ chỉ thuộc một bệnh nhân |
| `patient_insurances.insurer_name`, `patient_insurances.valid_until` | cá nhân | như trên | |
| `internal_notes.body` | nội bộ — **có thể chứa thông tin sức khỏe**, xử như nhạy cảm | nhân viên theo R-10; không hiện cho bệnh nhân | |
| `guardianships.guardian_person_id`, `guardianships.ward_patient_id`, `guardianships.starts_on`, `guardianships.ends_on` | cá nhân — liên quan trẻ vị thành niên | lễ tân, quản trị viên | |
| `appointment_deposits.amount`, `appointment_deposits.received_on` | tài chính | lễ tân, kế toán | hoàn cọc là dòng mới (sổ chỉ thêm) |
| `appointment_services.unit_price`, `services.code`, `specialties.name` | nội bộ | mọi nhân viên | |
