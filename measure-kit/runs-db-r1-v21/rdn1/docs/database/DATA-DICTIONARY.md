# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. v1.1 (2026-10-07) thêm nhu cầu giai đoạn 2 `NHU-CAU-DU-LIEU-MOI.md`.

## 0. Thay đổi so với bản trước

Số bảng, cột, index, phân loại phá vỡ nằm ở khối **Thay đổi so với bản trước** cuối file — do máy sinh từ DBML, đừng sửa tay. Phần này ghi quyết định cho từng nhu cầu. Câu hỏi còn mở: `CAU-HOI-BA.md` (Q-03 → Q-17, trong đó 6 câu CHẶN).

| Nhu cầu | Kết quả | Chỗ chứa | Câu hỏi |
|---|---|---|---|
| N-01 | đã áp | bảng mới `invoice_lines` — `unit_price` chép từ `services.price` lúc lập hóa đơn | Q-17 |
| N-02 | đã áp | `appointments.ends_at` + `EXCLUDE` theo bác sĩ (viết ở `Note`); index mới `(doctor_id, starts_at)` | Q-03 |
| N-03 | đã áp | bảng mới `patient_guardianships`; một người mang nhiều vai đã có sẵn từ `people` | |
| N-04 | đã áp | `patients.record_code` + unique một phần `WHERE deleted_at IS NULL` | Q-14 |
| N-05 | đã áp | bảng mới `appointment_deposits` (`appointment_id` UNIQUE) | Q-11 |
| N-06 | đã áp | bảng mới `internal_notes` — ba FK cho phép rỗng + CHECK đúng một | |
| N-07 | đã áp | bảng mới `patient_allergies` + enum `allergy_severity`; index tra ngược theo chất | Q-13, Q-16 |
| N-08 | đã áp | bảng mới `specialties`, `doctor_specialties` | Q-15 |
| N-09 | đã áp một phần | `appointment_status` thêm `confirmed`, `arrived`, `no_show`, giữ `done`; trigger chuyển trạng thái chưa viết | Q-09, Q-10 |
| N-10 | không thêm cột | giá trị suy ra — đếm `appointments` có `status = 'done'` (mục 4) | Q-10 |
| N-11 | đã áp | `services.code` + unique `(organization_id, lower(code))` | |
| N-12 | đã áp | unique `invoices(appointment_id)`; tra theo bệnh nhân đi qua `appointments (patient_id, starts_at)` | |
| N-13 | đã áp | `patients.deleted_at` sẵn có + trigger hủy lịch tương lai (`Note`); mọi `Ref` restrict | Q-09, Q-11 |
| N-14 | chưa dựng | trái R-09 | Q-05 |
| N-15 | đã áp | bảng mới `patient_insurances` (`patient_id` UNIQUE) | Q-16 |
| N-16 | chưa dựng | mâu thuẫn R-04 | Q-04 |
| N-17 | chưa dựng | chưa có thực thể ca phẫu thuật | Q-06 |
| N-18 | chưa dựng | chưa có thực thể gói trị liệu | Q-07 |
| N-19 | không làm | không tách bảng theo chi nhánh; dùng index sẵn có, phân vùng khi lớn | Q-12 |
| N-20 | chưa dựng | dữ liệu sinh trắc của trẻ em, giữ vô thời hạn | Q-08 |

## 1. Kiến trúc và nhóm bảng

21 bảng · 3 vùng: **Danh tính và hồ sơ bệnh nhân** (`people`, `patients`, `doctors`, `users`, `patient_guardianships`, `patient_allergies`, `patient_insurances`, `specialties`, `doctor_specialties`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`, `appointment_deposits`, `internal_notes`) · **Tiền** (`services`, `invoices`, `invoice_lines`, `payments`) · cộng `organizations` làm tenant. *(Bản v1.0 ghi 12 bảng, đếm sót `organizations`: v1.0 thực có 13.)*

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo. `schema-lint.json` khai cỡ M cho các bảng giao dịch theo con số này | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | đóng bởi N-02 (lịch hẹn có `ends_at`); độ dài điền cho lịch cũ chuyển sang Q-03 |
| Q-03 → Q-17 | 15 câu của lượt v1.1 — xem `CAU-HOI-BA.md` | 6 câu CHẶN (Q-04 → Q-09) · 9 câu không chặn, đang chạy theo giả định 🔴 A |

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
| `ends_at` | `timestamptz` | No | CHECK `ends_at > starts_at`; EXCLUDE theo `doctor_id` (N-02) | | Giờ kết thúc; khoảng `[starts_at, ends_at)` nên hai lịch liền kề không trùng |
| `status` | `appointment_status` | No | | `booked` | Trạng thái: `booked` đã đặt · `confirmed` đã xác nhận · `arrived` đã đến · `no_show` vắng mặt · `cancelled` đã hủy · `done` đã khám xong (giữ từ v1.0). Lịch `cancelled` và `no_show` không giữ chỗ khi chống trùng |

### 3.3 Các bảng còn lại

Xem `schema.dbml` — mỗi bảng có `Note` ghi nguồn requirement. Bảng mới và cột mới của v1.1 có bảng cột đầy đủ ở khối cuối file.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | cộng `quantity * unit_price` của các dòng `invoice_lines` | giá đã chép lúc lập hóa đơn nên không đổi khi bảng giá đổi (N-01). *Sửa so với v1.0: không còn đọc `services.price` hiện hành* |
| Tổng số lần khám đã hoàn thành của bệnh nhân (N-10) | đếm `appointments` có `patient_id` đó và `status = 'done'` | lệch nếu lưu cột đếm khi lịch hẹn bị sửa hay hủy; mỗi bệnh nhân có ít lịch hẹn, index `(patient_id, starts_at)` đủ nhanh. Định nghĩa "hoàn thành" chờ Q-10 |
| Số buổi điều trị còn lại của gói (N-18) | tổng buổi của gói trừ số lịch hẹn đã trừ buổi | **chưa tính được**: chưa có thực thể gói — Q-07; không thêm cột đếm trên `patients` |

## 5. Giả định đang dùng (🔴 A)

| Giả định | Chạy theo | Câu hỏi |
|---|---|---|
| Lịch hẹn cũ điền `ends_at = starts_at + 30 phút`; lịch `cancelled`, `no_show` không giữ chỗ; lịch liền kề không trùng | N-02 | Q-03 |
| `done` giữ nguyên nghĩa "đã khám xong"; `arrived` chỉ là bệnh nhân có mặt | N-09, N-10 | Q-10 |
| Cọc chỉ ghi nhận, chưa nối `payments`, hóa đơn không trừ cọc | N-05 | Q-11 |
| Một bảng `appointments` cho cả chuỗi; cỡ M (~730.000 dòng mỗi năm) | N-19 | Q-12, Q-01 |
| Tên chất dị ứng gõ tự do, tra theo `lower(substance)`; hai bậc mức độ | N-07 | Q-13 |
| Mã hồ sơ sinh ở ứng dụng, cấp lại khi hồ sơ bị ẩn | N-04 | Q-14 |
| Bớt chuyên khoa = `is_active = false`, giữ dòng nối với bác sĩ | N-08 | Q-15 |
| Dị ứng, bảo hiểm: hạn lưu và quyền xem như hồ sơ bệnh nhân, chưa có nhật ký truy cập | N-07, N-15 | Q-16 |
| Hóa đơn lập ngay khi khám xong; hóa đơn cũ dựng `invoice_lines` từ giá hiện hành | N-01 | Q-17 |
| Ghi chú nội bộ chỉ thêm, không sửa; bảo hiểm sửa tại chỗ, không giữ lịch sử, cả ba trường bắt buộc | N-06, N-15 | không hỏi |

## 6. Ràng buộc viết trong `Note` (DBML không diễn đạt được)

| Tên | Bảng | Việc |
|---|---|---|
| `ck_appointments_time` | `appointments` | `ends_at > starts_at` |
| `ex_appointments_doctor_no_overlap` | `appointments` | EXCLUDE gist `(doctor_id =, tstzrange(starts_at, ends_at) &&)` khi `status NOT IN ('cancelled','no_show')`; cần `btree_gist` |
| `uq_patients_org_record_code` | `patients` | unique một phần `(organization_id, record_code) WHERE deleted_at IS NULL` |
| `trg_patients_hide_cancel_future` | `patients` | ẩn bệnh nhân thì lịch `booked`, `confirmed` tương lai chuyển `cancelled` |
| `ck_invoice_lines_values` | `invoice_lines` | `quantity > 0 AND unit_price >= 0` |
| `ck_appointment_deposits_amount` | `appointment_deposits` | `amount > 0` |
| `ck_patient_guardianships_dates` · `uq_patient_guardianships_active` | `patient_guardianships` | `ended_on >= started_on`; một cặp bệnh nhân–người bảo hộ chỉ một dòng còn hiệu lực |
| `ck_internal_notes_one_target` | `internal_notes` | đúng một trong `appointment_id`, `patient_id`, `invoice_id` có giá trị |

**Thứ tự chuyển dữ liệu cho phần chạm dữ liệu đã có:** (1) `ALTER TYPE appointment_status ADD VALUE` ba giá trị mới · (2) `services.code`, `patients.record_code`: thêm cột cho phép rỗng → điền từng dòng → `NOT NULL` → tạo unique · (3) `appointments.ends_at`: thêm cột cho phép rỗng → điền → soát các cặp lịch chồng nhau của cùng bác sĩ và sửa tay → `NOT NULL` → CHECK → EXCLUDE · (4) `invoices(appointment_id)` unique: kiểm không lịch hẹn nào có hai hóa đơn, tạo `CONCURRENTLY` · (5) hóa đơn cũ: dựng `invoice_lines` từ `appointment_services` và giá hiện hành (giá lịch sử không còn).

<!-- db-schema-design:changes:start -->
## Thay đổi so với bản trước

> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **21 bảng · 123 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 8 | 0 | 0 |
| cột | 3 | 0 | 0 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 0 |
| index | 3 | 0 | 0 |

Phân loại: **phá vỡ 2** · **dữ liệu 3** · index 1 · cộng thêm 12 · ghi chú bảng đổi 10

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 2:
- index `services(organization_id, `lower(code)`)` thêm UNIQUE
- index `invoices(appointment_id)` thêm UNIQUE

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 3:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (8): `invoice_lines`, `appointment_deposits`, `patient_guardianships`, `internal_notes`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived`
- `appointment_status` thêm giá trị `confirmed`
- `appointment_status` thêm giá trị `no_show`

## Bảng mới (8)

### `invoice_lines`

Dòng chi tiết của hóa đơn: dịch vụ, số lượng và giá TẠI LÚC KHÁM. Nguồn: N-01, R-07, R-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `invoice_id` | `uuid` | No | FK → invoices.id xóa:restrict |  | hóa đơn chứa dòng này |
| `service_id` | `uuid` | No | FK → services.id xóa:restrict |  | dịch vụ đã tính tiền |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `quantity` | `smallint` | No |  | `1` | số lượng lúc lập hóa đơn, lớn hơn 0 |
| `unit_price` | `numeric(12,2)` | No |  |  | N-01 — chép từ services.price lúc lập hóa đơn |

### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn (tối đa một khoản). Nguồn: N-05.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | lịch hẹn nhận cọc, tối đa một khoản mỗi lịch hẹn |
| `amount` | `numeric(12,2)` | No |  |  | số tiền cọc, lớn hơn 0 |
| `received_on` | `date` | No |  |  | ngày nhận cọc |
| `created_at` | `timestamptz` | No |  | `now()` | — |

### `patient_guardianships`

Quan hệ bảo hộ: người (people) bảo hộ bệnh nhân từ ngày nào, đến ngày nào. Người bảo hộ có thể là bác sĩ, lễ tân hay người chưa có vai nào. Nguồn: N-03, R-02.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | bệnh nhân được bảo hộ |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | người bảo hộ (people) |
| `started_on` | `date` | No |  |  | ngày bắt đầu bảo hộ |
| `ended_on` | `date` | Yes |  |  | ngày kết thúc; rỗng = còn đang bảo hộ |
| `created_at` | `timestamptz` | No |  | `now()` | — |

### `internal_notes`

Ghi chú nội bộ của nhân viên, gắn vào đúng MỘT trong ba đối tượng: lịch hẹn, bệnh nhân, hóa đơn (không dùng cặp loại + id). Nguồn: N-06.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:restrict |  | đối tượng được gắn — đúng một trong ba cột appointment_id, patient_id, invoice_id |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:restrict |  | đối tượng được gắn (bệnh nhân) |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:restrict |  | đối tượng được gắn (hóa đơn) |
| `created_by` | `uuid` | No | FK → users.id xóa:restrict |  | tài khoản nhân viên (users) đã viết ghi chú |
| `body` | `text` | No |  |  | nội dung ghi chú |
| `created_at` | `timestamptz` | No |  | `now()` | — |

### `patient_allergies`

Dị ứng của bệnh nhân, mỗi chất một dòng. Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | bệnh nhân bị dị ứng |
| `substance` | `varchar(160)` | No |  |  | tên chất gây dị ứng, gõ tự do |
| `severity` | `allergy_severity` | No |  |  | mức độ: nhẹ (mild) hoặc nặng (severe) |
| `created_at` | `timestamptz` | No |  | `now()` | — |

### `specialties`

Danh mục chuyên khoa do quản trị viên thêm, bớt trên màn hình quản trị — là dữ liệu, không phải enum. Bớt = is_active = false: bác sĩ đã gắn vẫn giữ dòng nối, không xóa dòng (🔴 A, Q-15). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `name` | `varchar(120)` | No |  |  | tên chuyên khoa, duy nhất theo tổ chức, không phân biệt hoa thường |
| `is_active` | `boolean` | No |  | `true` | false = đã bớt khỏi danh mục |
| `created_at` | `timestamptz` | No |  | `now()` | — |

### `doctor_specialties`

Bác sĩ thuộc chuyên khoa nào (nhiều - nhiều). Index (specialty_id) để tra ngược "bác sĩ của chuyên khoa". Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:restrict |  | bác sĩ |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | chuyên khoa của bác sĩ |

### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân — tối đa một (patient_id UNIQUE). Nguồn: N-15.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | tenant |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict, UNIQUE |  | bệnh nhân; tối đa một hồ sơ bảo hiểm |
| `insurer_name` | `varchar(160)` | No |  |  | nhà bảo hiểm |
| `insurance_number` | `varchar(40)` | No |  |  | số thẻ bảo hiểm |
| `expires_on` | `date` | No |  |  | hạn dùng của thẻ |
| `created_at` | `timestamptz` | No |  | `now()` | — |
| `updated_at` | `timestamptz` | No |  | `now()` | — |

## Cột mới trên bảng đã có (3)

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(30)` | No |  |  | N-04 — mã hồ sơ, duy nhất trong tổ chức trong số hồ sơ chưa ẩn |
| `services` | `code` | `varchar(40)` | No |  |  | N-11 — mã dịch vụ, ví dụ KHAM-TQ |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | N-02 — giờ kết thúc, sau starts_at |

<!-- db-schema-design:changes:end -->
