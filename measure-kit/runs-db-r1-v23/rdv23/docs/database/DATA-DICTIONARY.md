# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. v1.1 (07/10/2026) áp nhu cầu giai đoạn 2 `N-01` → `N-20`; câu hỏi còn mở với BA ở `CAU-HOI-BA.md` (`Q-03` → `Q-19`). Nhu cầu **chưa dựng** vì đang chờ BA: `N-14` (phần lưu mật khẩu) · `N-16` · `N-17` · `N-18` · `N-20` — xem mục 2.

## 0. Thay đổi so với bản trước

<!-- db-schema-design:changes:start -->
> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối; số bảng/cột lấy ở dòng đếm dưới đây, không gõ lại ở phần viết tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **22 bảng · 130 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 9 | 0 | 0 |
| cột | 3 | 0 | 5 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 4 | 4 | 20 |
| index | 11 | 2 | 0 |

Phân loại: **phá vỡ 30** · **dữ liệu 8** · index 8 · cộng thêm 16 · ghi chú bảng đổi 11

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 30:
- index `clinics(organization_id, id)` thêm UNIQUE
- index `patients(organization_id, id)` thêm UNIQUE
- index `doctors(organization_id, id)` thêm UNIQUE
- index `services(organization_id, code)` thêm UNIQUE
- cột `invoices.appointment_id` thêm UNIQUE
- index `invoices(organization_id, id)` thêm UNIQUE
- ref `clinics(organization_id) → organizations` hành vi xóa — → restrict
- ref `people(organization_id) → organizations` hành vi xóa — → restrict
- ref `patients(organization_id) → organizations` hành vi xóa — → restrict
- ref `patients(person_id) → people` hành vi xóa — → restrict
- ref `doctors(organization_id) → organizations` hành vi xóa — → restrict
- ref `doctors(person_id) → people` hành vi xóa — → restrict
- ref `doctors(clinic_id) → clinics` hành vi xóa — → restrict
- ref `users(organization_id) → organizations` hành vi xóa — → restrict
- ref `users(person_id) → people` hành vi xóa — → restrict
- ref `rooms(organization_id) → organizations` hành vi xóa — → restrict
- ref `rooms(clinic_id) → clinics` hành vi xóa — → restrict
- ref `services(organization_id) → organizations` hành vi xóa — → restrict
- ref `doctor_schedules(organization_id) → organizations` hành vi xóa — → restrict
- ref `doctor_schedules(doctor_id) → doctors` hành vi xóa — → restrict
- ref `appointments(organization_id) → organizations` hành vi xóa — → restrict
- ref `appointment_services(appointment_id) → appointments` hành vi xóa — → restrict
- ref `appointment_services(service_id) → services` hành vi xóa — → restrict
- ref `invoices(organization_id) → organizations` hành vi xóa — → restrict
- ref `invoices(appointment_id) → appointments` hành vi xóa — → restrict
- ref `payments(organization_id) → organizations` hành vi xóa — → restrict
- ref `appointments(clinic_id) → clinics` bỏ khóa ngoại
- ref `appointments(patient_id) → patients` bỏ khóa ngoại
- ref `appointments(doctor_id) → doctors` bỏ khóa ngoại
- ref `payments(invoice_id) → invoices` bỏ khóa ngoại

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 8:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.price` thêm CHECK
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- ref `appointments(organization_id, clinic_id) → clinics` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `appointments(organization_id, patient_id) → patients` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `appointments(organization_id, doctor_id) → doctors` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `payments(organization_id, invoice_id) → invoices` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)

Bảng mới (9): `specialties`, `doctor_specialties`, `invoice_lines`, `appointment_deposits`, `patient_guardianships`, `internal_notes`, `patient_allergies`, `patient_insurances`, `password_reset_tokens`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived` — Đã đến (N-09)
- `appointment_status` thêm giá trị `confirmed` — Đã xác nhận (N-09)
- `appointment_status` thêm giá trị `no_show` — Vắng mặt (N-09)

## Bảng mới (9)

### `specialties`

Danh mục chuyên khoa do quản trị viên tự thêm, bớt trên màn hình quản trị — là dòng dữ liệu, không phải enum (N-08). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa, duy nhất trong tổ chức |
| `is_active` | `boolean` | No |  | `true` | Quản trị viên bớt chuyên khoa = tắt cờ này, không xóa dòng (còn bác sĩ gắn với nó) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `doctor_specialties`

Bảng nối: một bác sĩ thuộc nhiều chuyên khoa, một chuyên khoa có nhiều bác sĩ. Tenant suy qua doctors. Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:cascade |  | khóa ngoại tới `doctors` |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | khóa ngoại tới `specialties` |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `invoice_lines`

Dòng chi tiết của hóa đơn, mang giá lúc khám. Bất biến sau khi phát hành. Tenant suy qua invoices. Nguồn: N-01.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `invoice_id` | `uuid` | No | FK → invoices.id xóa:restrict |  | khóa ngoại tới `invoices` |
| `service_id` | `uuid` | No | FK → services.id xóa:restrict |  | khóa ngoại tới `services` |
| `quantity` | `smallint` | No | CHECK quantity > 0 |  | Số lượng, chép từ appointment_services lúc phát hành |
| `unit_price` | `numeric(12,2)` | No | CHECK unit_price >= 0 |  | Đơn giá SNAPSHOT: chép từ services.price tại lúc phát hành hóa đơn (lúc khám), không đổi khi bảng giá đổi (N-01) |

### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn, nhận trước khi có hóa đơn nên không nằm trong payments (payments gắn hóa đơn). Chưa có khấu trừ, hoàn cọc: xem Q-10. Nguồn: N-05.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | Lịch hẹn nhận cọc. Tối đa một khoản cọc cho mỗi lịch hẹn (N-05: "một khoản") |
| `amount` | `numeric(12,2)` | No | CHECK amount > 0 |  | Số tiền đặt cọc |
| `received_on` | `date` | No |  |  | Ngày nhận cọc (ngày theo giờ địa phương của phòng khám) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_guardianships`

Quan hệ bảo hộ giữa một người và một bệnh nhân (N-03): ai bảo hộ ai, từ ngày nào, đến ngày nào. Bảng quan hệ trên people, không đẻ thêm bảng danh tính (R-02). Nguồn: N-03.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ — một người trong people (có thể là bác sĩ, lễ tân hay người ngoài) |
| `ward_patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | Bệnh nhân được bảo hộ (nhỏ tuổi) |
| `starts_on` | `date` | No |  |  | Bảo hộ từ ngày |
| `ends_on` | `date` | Yes |  |  | Hết bảo hộ vào ngày; để trống = còn hiệu lực |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `internal_notes`

Ghi chú nội bộ của nhân viên, gắn ĐÚNG MỘT trong ba loại đối tượng: lịch hẹn, bệnh nhân, hóa đơn (N-06). Ba khóa ngoại rỗng được, không dùng cặp *_type + *_id (DB-MOD-06). Nguồn: N-06.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:restrict |  | Ghi chú gắn lịch hẹn |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:restrict |  | Ghi chú gắn bệnh nhân |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:restrict |  | Ghi chú gắn hóa đơn |
| `body` | `text` | No |  |  | Nội dung ghi chú nội bộ |
| `created_by` | `uuid` | No | FK → users.id xóa:restrict |  | Nhân viên ghi chú |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_allergies`

Dị ứng của bệnh nhân — một bệnh nhân nhiều dị ứng (N-07). Tra ngược theo chất: chỉ mục (organization_id, lower(substance)). Dữ liệu sức khỏe, xem Q-12. Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade |  | khóa ngoại tới `patients` |
| `substance` | `varchar(120)` | No |  |  | Tên chất gây dị ứng (nhập tự do, tra không phân biệt hoa thường — xem Q-11) |
| `severity` | `allergy_severity` | No |  |  | Mức độ: nhẹ hoặc nặng |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân, quan hệ 1–1 (khóa ngoại kèm unique). Đổi thẻ = ghi đè dòng này, không giữ lịch sử thẻ. Số thẻ là dữ liệu cá nhân (Q-12). Nguồn: N-15.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade, UNIQUE |  | Bệnh nhân sở hữu hồ sơ bảo hiểm. Tối đa một hồ sơ cho mỗi bệnh nhân (N-15) |
| `card_number` | `varchar(40)` | No |  |  | Số thẻ bảo hiểm |
| `insurer_name` | `varchar(120)` | No |  |  | Nhà bảo hiểm |
| `valid_until` | `date` | Yes |  |  | Hạn dùng của thẻ; để trống = không thời hạn (🔴 A) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `password_reset_tokens`

Liên kết đặt lại mật khẩu dùng một lần, thay cho việc ghi lại mật khẩu để đọc cho bác sĩ (N-14 bị từ chối vì trái R-09, xem Q-07). Dòng hết hạn hoặc đã dùng xóa bằng việc nền sau ít ngày. Nguồn: N-14…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `user_id` | `uuid` | No | FK → users.id xóa:cascade |  | Tài khoản cần đặt lại mật khẩu |
| `token_hash` | `varchar(128)` | No | UNIQUE |  | Băm của mã trong liên kết một lần; mã gốc không lưu |
| `expires_at` | `timestamptz` | No |  |  | Hết hạn của liên kết |
| `used_at` | `timestamptz` | Yes |  |  | Thời điểm đã dùng; có giá trị = liên kết hết tác dụng |
| `created_by` | `uuid` | Yes | FK → users.id xóa:set null |  | Quản trị viên yêu cầu hộ; trống = người dùng tự yêu cầu |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

## Cột mới trên bảng đã có (3)

> Cột mới của bảng cũ chỉ cần ở đây — không phải thêm vào bảng cột viết tay của bảng đó.

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(32)` | No |  |  | Mã hồ sơ bệnh nhân (N-04). Duy nhất trong tổ chức giữa các hồ sơ chưa ẩn; hồ sơ đã ẩn nhả mã, mã được cấp lại cho người khác |
| `services` | `code` | `varchar(32)` | No |  |  | Mã dịch vụ, ví dụ KHAM-TQ (N-11). Duy nhất trong tổ chức; hai tổ chức khác nhau dùng trùng mã được |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc (N-02). Phải lớn hơn starts_at; dùng để chặn bác sĩ trùng giờ |

<!-- db-schema-design:changes:end -->

## 1. Kiến trúc và nhóm bảng

Số bảng, cột lấy ở dòng đếm của khối "Thay đổi so với bản trước" phía trên. 4 vùng: **Danh tính** (`people`, `patients`, `doctors`, `users`, `patient_guardianships`, `patient_insurances`, `password_reset_tokens`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `specialties`, `doctor_specialties`, `appointments`, `appointment_services`) · **Tiền** (`services`, `invoices`, `invoice_lines`, `payments`, `appointment_deposits`) · **Thông tin lâm sàng và ghi chú** (`patient_allergies`, `internal_notes`) · cộng `organizations` làm tenant.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ đã có `appointments.ends_at` (N-02); thời lượng cho dòng cũ → Q-16 |
| Q-03 | N-16 ca khám nhóm nhiều bác sĩ trái R-04 | **CHẶN** — chưa dựng bảng |
| Q-04 | N-17 phòng mổ không trùng giờ — chưa có thực thể ca phẫu thuật | **CHẶN** — chưa dựng bảng |
| Q-05 | N-18 số buổi điều trị còn lại — chưa có gói trị liệu, và là giá trị suy ra | **CHẶN** — chưa dựng cột, bảng |
| Q-06 | N-20 ảnh khuôn mặt (sinh trắc, trẻ em, giữ vô thời hạn) | **CHẶN** — chưa dựng cột, bảng |
| Q-07 | N-14 ghi lại mật khẩu trái R-09 | **CHẶN** phần lưu mật khẩu; đã dựng `password_reset_tokens` thay thế (🔴 A) |
| Q-08 → Q-19 | Mười hai câu không chặn (trạng thái lịch hẹn, tái cấp mã hồ sơ, cọc, dị ứng tự do, thời hạn lưu, ghi chú, phí hủy, uuidv7, backfill, bảng theo chi nhánh, bảo hộ, khóa ngoại ghép) | 🔴 A — đã dựng với giả định ghi ở `CAU-HOI-BA.md` |

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
| `id` | `uuid` | No | PK | `uuidv7()` | Định danh (đổi từ `gen_random_uuid()` ở v1.1 — Q-15) |
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
| Tổng tiền hóa đơn | cộng `quantity` x `unit_price` của `invoice_lines` (giá lúc khám, N-01) | tránh lệch khi giá đổi hay dòng bị sửa |
| Số lần khám đã hoàn thành của bệnh nhân (N-10) | đếm `appointments` có `status = 'done'` theo `patient_id` | lưu một con số sẽ lệch khi lịch bị đổi trạng thái; đếm đủ nhanh nhờ chỉ mục `(organization_id, patient_id, starts_at)` |
| Số buổi điều trị còn lại (N-18) | **chưa dựng** — chờ Q-05 | giá trị suy ra; đã nêu kịch bản lệch |
| Hóa đơn của bệnh nhân (N-12) | bệnh nhân → `appointments` → `invoices.appointment_id` | không chép `patient_id` vào hóa đơn để khỏi hai nguồn |
| Bác sĩ có đang bận (N-02) | khoảng `[starts_at, ends_at)` của lịch chưa hủy | cưỡng chế bằng `EXCLUDE`, không lưu cờ bận |

## 5. Phân loại dữ liệu (DB-SEC-01) — cột mới của v1.1

| Mức | Cột | Ai xem | Hạn lưu / xóa |
|---|---|---|---|
| Nhạy cảm — sức khỏe | `patient_allergies.substance` · `severity` | lễ tân phòng khám của bệnh nhân, bác sĩ, quản trị viên | chưa chốt — Q-12 (giả định 🔴 A: theo thời hạn lưu hồ sơ bệnh nhân) |
| Nhạy cảm — sức khỏe, tự do | `internal_notes.body` | nhân viên; phạm vi theo phòng khám chưa chốt — Q-13 | như trên (Q-12) |
| Nhạy cảm — tài chính, cá nhân | `patient_insurances.card_number` · `insurer_name` · `valid_until` | lễ tân, kế toán, quản trị viên | như trên (Q-12) |
| Nhạy cảm — tài chính | `appointment_deposits.amount` · `invoice_lines.unit_price` | kế toán, quản trị viên, lễ tân tra cứu | hóa đơn giữ theo quy định kế toán; không xóa khi ẩn bệnh nhân (N-13) |
| Cá nhân | `patient_guardianships.*` (quan hệ người bảo hộ, trẻ em) | lễ tân, bác sĩ phụ trách | theo hồ sơ bệnh nhân |
| Bí mật xác thực | `password_reset_tokens.token_hash` | không ai (chỉ hệ thống so khớp) | xóa sau khi hết hạn hoặc đã dùng vài ngày |

## 6. Ma trận cưỡng chế rule (DB-INT-15) — nhu cầu giai đoạn 2

| Rule | Cơ chế | Rủi ro còn lại |
|---|---|---|
| N-02 bác sĩ không trùng lịch | `EXCLUDE USING gist` + `CHECK (ends_at > starts_at)` (SQL trong `Note` của `appointments`) | lịch sửa giờ bị chặn ở CSDL; ứng dụng phải bắt lỗi và báo lễ tân; cần `btree_gist` |
| N-04 mã hồ sơ duy nhất, nhả mã khi ẩn | unique **một phần** `WHERE deleted_at IS NULL` | khôi phục hồ sơ đã nhả mã phải cấp mã mới (Q-09) |
| N-09 máy trạng thái lịch hẹn | ứng dụng hoặc trigger `BEFORE UPDATE OF status` (đặc tả ở `Note`) | giả định hai chuyển (Q-08); chỉ ứng dụng thì hai người đổi cùng lúc có thể ghi đè nhau |
| N-13 ẩn bệnh nhân → hủy lịch tương lai | trigger `AFTER UPDATE OF deleted_at` (đặc tả ở `Note` của `patients`) | không phân biệt hủy do ẩn với bệnh nhân tự hủy — Q-14 |
| N-13 giữ hóa đơn, thanh toán | khóa ngoại `restrict` toàn chuỗi bệnh nhân → lịch hẹn → hóa đơn → thanh toán | không |
| N-06 ghi chú đúng một đối tượng | `CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)` (trong `Note`) | không |
| N-15 tối đa một bảo hiểm | `UNIQUE (patient_id)` | không |
| N-05 tối đa một cọc mỗi lịch hẹn | `UNIQUE (appointment_id)` | giả định "một khoản" nghĩa là một (Q-10) |
| N-03 người bảo hộ không là chính bệnh nhân | trigger (CHECK không nhìn sang bảng khác) | chỉ đặc tả, chưa viết hàm |
| Cùng tổ chức giữa lịch hẹn ↔ bệnh nhân, bác sĩ, phòng khám; thanh toán ↔ hóa đơn | khóa ngoại ghép `(organization_id, …)` | các bảng mới khác dùng khóa ngoại đơn — Q-19 |
