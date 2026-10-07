# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`.

## 0. Thay đổi so với bản trước

<!-- db-schema-design:changes:start -->
> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối; số bảng/cột lấy ở dòng đếm dưới đây, không gõ lại ở phần viết tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **21 bảng · 130 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 8 | 0 | 0 |
| cột | 4 | 0 | 0 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 0 |
| index | 3 | 0 | 0 |

Phân loại: **phá vỡ 1** · **dữ liệu 4** · index 2 · cộng thêm 12 · ghi chú bảng đổi 10

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 1:
- index `services(organization_id, `lower(code)`)` thêm UNIQUE

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 4:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointment_services.unit_price` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (8): `guardianships`, `appointment_deposits`, `internal_notes`, `allergens`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived`
- `appointment_status` thêm giá trị `confirmed`
- `appointment_status` thêm giá trị `no_show`

## Bảng mới (8)

### `guardianships`

Quan hệ bảo hộ giữa hai người: ai bảo hộ ai, từ ngày nào (N-03). Một dòng một giai đoạn; đổi người bảo hộ = đóng dòng cũ (ends_on) và thêm dòng mới, lịch sử giữ nguyên.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ — bất kỳ ai trong people: bác sĩ, nhân viên hay phụ huynh không có vai nào khác (N-03). |
| `ward_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người được bảo hộ — bệnh nhân nhỏ tuổi (N-03). |
| `starts_on` | `date` | No |  |  | Ngày bắt đầu bảo hộ (N-03). |
| `ends_on` | `date` | Yes |  |  | Ngày kết thúc bảo hộ; trống = còn hiệu lực. 🔴 A — thêm cho pha kết thúc, N-03 chỉ nêu ngày bắt đầu (Q-12). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn (N-05).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | Lịch hẹn nhận cọc; mỗi lịch hẹn tối đa một khoản cọc (N-05). |
| `amount` | `numeric(12,2)` | No |  |  | Số tiền cọc, lớn hơn 0 (N-05). |
| `received_on` | `date` | No |  |  | Ngày nhận cọc (N-05). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `internal_notes`

Ghi chú nội bộ gắn vào một lịch hẹn, một bệnh nhân hoặc một hóa đơn (N-06). Ba khóa ngoại thật thay cặp loại + id.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:cascade |  | Lịch hẹn được ghi chú; đúng một trong ba cột đích có giá trị (N-06). |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:cascade |  | Bệnh nhân được ghi chú; đúng một trong ba cột đích có giá trị (N-06). |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:cascade |  | Hóa đơn được ghi chú; đúng một trong ba cột đích có giá trị (N-06). |
| `author_user_id` | `uuid` | No | FK → users.id xóa:restrict |  | Tài khoản nhân viên viết ghi chú (N-06). |
| `body` | `text` | No |  |  | Nội dung ghi chú nội bộ, chỉ nhân viên xem (N-06). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |
| `deleted_at` | `timestamptz` | Yes |  |  | thời điểm ẩn (xóa mềm); trống = còn hiệu lực |

### `allergens`

Danh mục chất gây dị ứng: một chất một dòng để tra bệnh nhân theo chất không lệch chính tả (N-07). Ai được thêm chất: 🔴 A, Q-16.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(160)` | No |  |  | Tên chất gây dị ứng, duy nhất trong tổ chức, so không phân biệt hoa thường (N-07). |
| `is_active` | `boolean` | No |  | `true` | false = ngưng chọn cho dòng mới; dòng bệnh nhân cũ vẫn trỏ được (🔴 A, Q-16). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `patient_allergies`

Dị ứng của bệnh nhân — nhiều dòng mỗi bệnh nhân, một dòng mỗi chất (N-07).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade |  | khóa ngoại tới `patients` |
| `allergen_id` | `uuid` | No | FK → allergens.id xóa:restrict |  | khóa ngoại tới `allergens` |
| `severity` | `allergy_severity` | No |  |  | Mức độ dị ứng: nhẹ hoặc nặng (N-07). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `specialties`

Danh mục chuyên khoa do quản trị viên thêm, bớt trên màn hình quản trị — dòng dữ liệu, không phải enum (N-08).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa, duy nhất trong tổ chức, so không phân biệt hoa thường (N-08). |
| `is_active` | `boolean` | No |  | `true` | Quản trị viên bớt chuyên khoa = false; dòng giữ lại để gán cũ không gãy (🔴 A) (N-08). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `doctor_specialties`

Bác sĩ thuộc chuyên khoa — một bác sĩ nhiều chuyên khoa (N-08). Tìm bác sĩ theo chuyên khoa: index (specialty_id).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:cascade |  | khóa ngoại tới `doctors` |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | khóa ngoại tới `specialties` |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân, quan hệ 1–0..1 (N-15). Đổi thẻ = ghi đè, không giữ thẻ cũ (🔴 A, Q-17).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade, UNIQUE |  | Bệnh nhân sở hữu hồ sơ bảo hiểm; mỗi bệnh nhân tối đa một (N-15). |
| `card_number` | `varchar(40)` | No |  |  | Số thẻ bảo hiểm — dữ liệu cá nhân, quyền đọc theo R-10 (N-15). |
| `insurer_name` | `varchar(160)` | No |  |  | Nhà bảo hiểm (N-15). |
| `valid_until` | `date` | No |  |  | Hạn dùng thẻ (N-15). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

## Cột mới trên bảng đã có (4)

> Cột mới của bảng cũ chỉ cần ở đây — không phải thêm vào bảng cột viết tay của bảng đó.

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(20)` | No |  |  | Mã hồ sơ bệnh nhân. Duy nhất trong tổ chức giữa các hồ sơ chưa ẩn, so không phân biệt hoa thường (🔴 A); hồ sơ đã ẩn nhả mã để cấp lại cho người khác (N-04). |
| `services` | `code` | `varchar(20)` | No |  |  | Mã dịch vụ, ví dụ KHAM-TQ. Duy nhất trong mỗi tổ chức, so không phân biệt hoa thường (🔴 A); hai tổ chức dùng trùng mã được (N-11). |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc lịch hẹn, lớn hơn starts_at. Khoảng [starts_at, ends_at) dùng cho EXCLUDE chống trùng lịch bác sĩ (N-02). |
| `appointment_services` | `unit_price` | `numeric(12,2)` | No |  |  | Đơn giá chép từ services.price lúc ghi nhận dịch vụ đã thực hiện; bảng giá đổi sau đó không ảnh hưởng. Hóa đơn in theo cột này (N-01). |

<!-- db-schema-design:changes:end -->


**v1.1 (07/10)** — áp nhu cầu dữ liệu giai đoạn 2 `N-01 → N-20` (`1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md`). Phần chưa dựng và mọi giả định 🔴 A: `CAU-HOI-BA.md` (`Q-03 → Q-19`). Năm nhu cầu **chưa dựng** chờ BA: N-14 (`Q-03`), N-16 (`Q-04`), N-17 (`Q-05`), N-18 (`Q-06`), N-20 (`Q-07`). Số bảng, cột và danh sách thay đổi ở khối máy sinh dưới.

Migration: cột mới NOT NULL trên bảng đã có dữ liệu (`appointments.ends_at`, `appointment_services.unit_price`, `patients.record_code`, `services.code`) điền trước rồi mới bật ràng buộc — quy tắc điền ở `Q-09`. EXCLUDE ở `appointments` và `guardianships` cần `CREATE EXTENSION btree_gist`.

## 1. Kiến trúc và nhóm bảng

Bốn vùng *(số bảng: khối máy sinh ở mục 0)*: **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`, `specialties`, `doctor_specialties`) · **Tiền** (`services`, `invoices`, `payments`, `appointment_deposits`) · **Hồ sơ bệnh nhân** (`allergens`, `patient_allergies`, `patient_insurances`, `internal_notes`) · cộng `organizations` làm tenant.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ đóng 07/10 — N-02: `appointments.ends_at`; điền dữ liệu cũ ở `Q-09` |
| Q-03 → Q-19 | Câu hỏi của lượt v1.1 | `CAU-HOI-BA.md` |

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
| Tổng tiền hóa đơn | cộng `quantity × appointment_services.unit_price` các dòng của lịch hẹn (N-01) | tránh lệch khi giá đổi |
| Số lần khám đã hoàn thành của bệnh nhân (N-10) | đếm `appointments` có `status = 'done'` theo `patient_id` — index `(patient_id, starts_at)` | không lệch khi lịch hẹn đổi trạng thái; định nghĩa "hoàn thành" ở `Q-08` |
| Số buổi còn lại của gói trị liệu (N-18) | chưa có nguồn — chưa dựng | `Q-06` |
