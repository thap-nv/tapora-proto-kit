# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. Điểm cần BA chốt: `CAU-HOI-BA.md`.

## 0. Thay đổi so với bản trước (v1.0 → v1.1, 2026-10-07)

Nguồn: `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` — 20 nhu cầu N-01 → N-20. **14 nhu cầu đã áp** (N-01 → N-13, N-15; N-10 áp dưới dạng giá trị suy ra, không thêm cột), **4 nhu cầu chờ BA** (N-16, N-17, N-18, N-20 — không dựng bảng), **2 nhu cầu không làm** (N-14 trái R-09, N-19 tách bảng theo chi nhánh). Ánh xạ từng mã xem `BAO-CAO-DO.md`.

**Bảng mới (7):** `guardianships` (N-03) · `specialties` · `doctor_specialties` (N-08) · `allergens` · `patient_allergies` (N-07) · `patient_insurances` (N-15) · `internal_notes` (N-06).

**Cột mới trên bảng cũ:**

| Bảng | Cột mới | Nhu cầu |
|---|---|---|
| `patients` | `patient_code` (NOT NULL; duy nhất một phần, chỉ giữa hồ sơ chưa ẩn) | N-04 |
| `services` | `code` (NOT NULL; duy nhất theo tổ chức) | N-11 |
| `appointments` | `ends_at` (NOT NULL) · `deposit_amount` · `deposit_received_on` | N-02 · N-05 |
| `appointment_services` | `unit_price` (NOT NULL) — giá chốt | N-01 |

**Thay đổi kiểu và ràng buộc trên cột cũ:**

| Chỗ | Trước | Sau | Nhu cầu |
|---|---|---|---|
| Enum `appointment_status` | `booked` `done` `cancelled` | thêm `confirmed` `arrived` `no_show` — **giữ `done`** | N-09 |
| `invoices.appointment_id` | FK thường | FK + `unique` (một lịch hẹn tối đa một hóa đơn, đúng R-08; đồng thời là chỉ mục tra theo lịch hẹn) | N-12 |

**Ràng buộc viết bằng SQL, không nằm trong DBML** (mục 5): không trùng giờ bác sĩ (EXCLUDE) · `ends_at > starts_at` · tiền cọc · mã hồ sơ duy nhất một phần · đúng một đối tượng cho ghi chú nội bộ.

**Không đổi:** `organizations`, `clinics`, `people`, `doctors`, `users`, `rooms`, `doctor_schedules`, `payments`. `invoices` ngoài cột `unique`.

## 1. Kiến trúc và nhóm bảng

20 bảng · 5 vùng: **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`, `patient_insurances`) · **Chuyên môn và hồ sơ y tế** (`specialties`, `doctor_specialties`, `allergens`, `patient_allergies`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`) · **Tiền** (`services`, `invoices`, `payments`) · **Phụ trợ** (`internal_notes`) · cộng `organizations` làm tenant.

Quyết định đáng chú ý của lượt này:

- **Một bảng `appointments` cho cả ba chi nhánh** (N-19 không làm): tách bảng theo chi nhánh làm hỏng khóa ngoại từ `invoices`, hỏng ràng buộc không trùng giờ (N-02) vì lịch của một bác sĩ có thể nằm ở hai bảng, và buộc `UNION` mỗi khi báo cáo cả tổ chức. Báo cáo theo chi nhánh đã có chỉ mục `(organization_id, clinic_id, starts_at)`; nếu bảng lớn thì phân vùng theo `clinic_id` hoặc theo tháng *bên trong* một bảng logic.
- **Giá chốt nằm ở dòng dịch vụ**, không phải ở hóa đơn: `appointment_services.unit_price`. Hóa đơn không lưu tổng (mục 4).
- **Ghi chú nội bộ dùng ba khóa ngoại thật** (`appointment_id`, `patient_id`, `invoice_id`, đúng một cột có giá trị) thay vì cặp `object_type` + `object_id`, để CSDL giữ được toàn vẹn tham chiếu.
- **Chuyên khoa và chất gây dị ứng là bảng dữ liệu**, không phải enum, vì danh sách thay đổi bằng thao tác quản trị chứ không bằng phát hành.
- **Ẩn hồ sơ = `patients.deleted_at`**, không xóa dòng, không cascade: hóa đơn, thanh toán, lịch hẹn cũ còn nguyên để kế toán đối chiếu (N-13).

## 2. Điểm mù cần chốt

Chi tiết từng câu (nguồn · hệ quả · giả định tạm) ở [`CAU-HOI-BA.md`](CAU-HOI-BA.md).

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? | một phần trả lời: N-02 cho giờ kết thúc; phần dữ liệu cũ chuyển sang Q-04 |
| Q-03 | Giá chốt vào lúc đặt hay lúc khám; hóa đơn cũ lấy giá nào | mở (N-01) |
| Q-04 | Thời lượng lịch hẹn cũ để điền `ends_at`; lịch vắng mặt có nhả giờ | mở (N-02) |
| Q-05 | Bảo hộ kết thúc khi nào, nhiều người bảo hộ cùng lúc | mở (N-03) |
| Q-06 | Cấp mã hồ sơ, mã cho hồ sơ cũ, khôi phục hồ sơ ẩn | mở (N-04) |
| Q-07 | Tiền cọc: hoàn, trừ vào hóa đơn, mất | mở (N-05) |
| Q-08 | `đã đến` so với `done`; các cạnh chuyển trạng thái còn thiếu | mở (N-09) |
| Q-09 | Mã cho dịch vụ hiện có | mở (N-11) |
| Q-10 | Hướng thay cho "ghi lại mật khẩu" | mở — **N-14 không làm** |
| Q-11 | Ca khám nhóm mâu thuẫn R-04 | mở — **chưa dựng** (N-16) |
| Q-12 | Phẫu thuật, phòng mổ chưa có trong requirement | mở — **chưa dựng** (N-17) |
| Q-13 | Gói trị liệu chưa có trong requirement | mở — **chưa dựng** (N-18) |
| Q-14 | Ảnh khuôn mặt: sinh trắc học, trẻ em, vô thời hạn, mọi lễ tân | mở — **chưa dựng** (N-20) |
| Q-15 | Phạm vi theo phòng khám cho dữ liệu gắn bệnh nhân (R-10) | mở — nợ từ v1.0 |

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
| **`ends_at`** *(mới)* | `timestamptz` | No | `CHECK (ends_at > starts_at)`; tham gia ràng buộc EXCLUDE (mục 5) | | Giờ kết thúc — nền cho "bác sĩ không trùng giờ" (N-02). Khoảng nửa mở `[starts_at, ends_at)` |
| `status` | `appointment_status` | No | | `booked` | Trạng thái: `booked` · `confirmed` · `arrived` · `no_show` · `cancelled` · `done` |
| **`deposit_amount`** *(mới)* | `numeric(12,2)` | Yes | `CHECK > 0` khi có; cùng null với `deposit_received_on` | | Tiền đặt cọc; null = không cọc (N-05) |
| **`deposit_received_on`** *(mới)* | `date` | Yes | cùng null với `deposit_amount` | | Ngày nhận cọc (N-05) |

Chuyển trạng thái đã chốt từ N-09: `booked` → `confirmed` hoặc `cancelled`; `confirmed` → `arrived` hoặc `no_show`. Các cạnh còn lại chờ `Q-08`, **chưa cưỡng chế** ở CSDL.

### 3.3 `patients` — hồ sơ bệnh nhân *(cột mới)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`patient_code`** *(mới)* | `varchar(20)` | No | UNIQUE một phần `(organization_id, patient_code) WHERE deleted_at IS NULL` | | Mã hồ sơ (N-04). Mã của hồ sơ đã ẩn **được cấp lại** — ràng buộc duy nhất chỉ tính hồ sơ chưa ẩn |

`deleted_at` (đã có từ v1.0) nay là cờ **ẩn hồ sơ** (N-13). Ẩn không xóa dòng nào ở `appointments`, `invoices`, `payments`; lịch hẹn tương lai ở `booked`/`confirmed` chuyển `cancelled` trong cùng transaction.

### 3.4 `services` · `appointment_services` · `invoices` *(cột mới hoặc đổi)*

| Bảng | Cột | Kiểu | Nullable | Khóa / Constraint | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `services` | **`code`** *(mới)* | `varchar(40)` | No | UNIQUE `(organization_id, code)` | Mã dịch vụ (N-11), ví dụ `KHAM-TQ`. Hai tổ chức dùng cùng mã được |
| `appointment_services` | **`unit_price`** *(mới)* | `numeric(12,2)` | No | | Giá một đơn vị **chốt lúc khám** (N-01), sao từ `services.price`; không đổi theo bảng giá. Thời điểm chốt: `Q-03` |
| `invoices` | `appointment_id` | `uuid` | No | FK → appointments.id, **UNIQUE** *(mới)* | Một lịch hẹn tối đa một hóa đơn (R-08); cũng là chỉ mục tra theo lịch hẹn (N-12) |

Tra hóa đơn **theo bệnh nhân** (N-12): `invoices` nối `appointments` qua `appointment_id`, lọc `appointments.patient_id` bằng chỉ mục `(patient_id, starts_at)`. Hai bước đều theo khóa nên nhanh ở hàng triệu hóa đơn; **không** thêm `patient_id` vào `invoices`.

### 3.5 `guardianships` — bảo hộ (N-03)

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `guardian_person_id` | `uuid` | No | FK → people.id | | Người bảo hộ — bất kỳ người nào (lễ tân, bác sĩ, phụ huynh) |
| `patient_id` | `uuid` | No | FK → patients.id | | Bệnh nhân được bảo hộ |
| `started_on` | `date` | No | | | Bảo hộ từ ngày nào |
| `created_at` | `timestamptz` | No | | `now()` | Ngày tạo bản ghi |

Duy nhất `(patient_id, guardian_person_id, started_on)`. Chỉ mục `(guardian_person_id)`. Một người vừa là lễ tân vừa là bệnh nhân vừa là bác sĩ **đã được R-02 phủ** (một `people`, nhiều vai) — bảng này chỉ thêm quan hệ giữa hai người. Chưa có ngày kết thúc: `Q-05`.

### 3.6 `specialties` · `doctor_specialties` — chuyên khoa (N-08)

| Bảng | Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `specialties` | `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| | `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| | `name` | `varchar(120)` | No | UNIQUE `(organization_id, lower(name))` | | Tên chuyên khoa |
| | `is_active` | `boolean` | No | | `true` | "Bớt" chuyên khoa = `false`; bác sĩ đã gắn giữ liên kết lịch sử |
| | `created_at` | `timestamptz` | No | | `now()` | |
| `doctor_specialties` | `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| | `doctor_id` | `uuid` | No | PK (1/2), FK → doctors.id | | Bác sĩ |
| | `specialty_id` | `uuid` | No | PK (2/2), FK → specialties.id | | Chuyên khoa |
| | `created_at` | `timestamptz` | No | | `now()` | |

Chỉ mục ngược `(specialty_id, doctor_id)` để tìm bác sĩ theo chuyên khoa.

### 3.7 `allergens` · `patient_allergies` — dị ứng (N-07)

| Bảng | Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `allergens` | `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| | `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| | `name` | `varchar(160)` | No | UNIQUE `(organization_id, lower(name))` | | Tên chất gây dị ứng |
| | `created_at` | `timestamptz` | No | | `now()` | |
| `patient_allergies` | `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| | `patient_id` | `uuid` | No | PK (1/2), FK → patients.id | | Bệnh nhân |
| | `allergen_id` | `uuid` | No | PK (2/2), FK → allergens.id | | Chất gây dị ứng |
| | `severity` | `allergy_severity` | No | | | `mild` (nhẹ) · `severe` (nặng) |
| | `created_at` | `timestamptz` | No | | `now()` | |

Chỉ mục ngược `(allergen_id, patient_id)` để lễ tân tra bệnh nhân theo chất. Mỗi cặp bệnh nhân–chất tối đa một dòng.

### 3.8 `patient_insurances` — bảo hiểm (N-15)

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | **UNIQUE**, FK → patients.id | | Tối đa một hồ sơ bảo hiểm mỗi bệnh nhân (quan hệ 1 – 0..1) |
| `policy_number` | `varchar(40)` | No | | | Số thẻ |
| `insurer_name` | `varchar(160)` | No | | | Nhà bảo hiểm (tên, chưa có danh mục — chưa có yêu cầu thống kê theo nhà bảo hiểm) |
| `expires_on` | `date` | No | | | Hạn dùng |
| `created_at` / `updated_at` | `timestamptz` | No | | `now()` | |

### 3.9 `internal_notes` — ghi chú nội bộ (N-06)

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `appointment_id` | `uuid` | Yes | FK → appointments.id | | Ghi chú gắn lịch hẹn |
| `patient_id` | `uuid` | Yes | FK → patients.id | | Ghi chú gắn bệnh nhân |
| `invoice_id` | `uuid` | Yes | FK → invoices.id | | Ghi chú gắn hóa đơn |
| `body` | `text` | No | | | Nội dung |
| `created_by` | `uuid` | No | FK → users.id | | Nhân viên viết |
| `created_at` | `timestamptz` | No | | `now()` | |

`CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)` — đúng một đối tượng. Ba chỉ mục `(<khóa>, created_at)`, nên là chỉ mục một phần `WHERE <khóa> IS NOT NULL`. Phạm vi xem theo phòng khám: `Q-15`.

### 3.10 Các bảng còn lại

`organizations` · `clinics` · `users` · `doctors` · `rooms` · `doctor_schedules` · `payments`: không đổi so với v1.0. Xem `schema.dbml` — mỗi bảng có `Note` ghi nguồn requirement.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | `SUM(quantity × unit_price)` của `appointment_services` thuộc lịch hẹn | Không còn vì "giá đổi" (đã chốt bằng `unit_price`) mà vì tránh con số thứ hai có thể lệch khỏi các dòng |
| Tổng số lần khám đã hoàn thành của bệnh nhân (N-10) | `COUNT(appointments WHERE patient_id = … AND status = 'done')` | Cột đếm lệch mỗi khi lịch hẹn bị sửa, hủy hoặc đổi trạng thái. Đếm theo `done` là giả định chờ `Q-08` |
| Số buổi điều trị còn lại của gói (N-18) | số buổi đã mua − số buổi đã dùng | Cột đếm trên hồ sơ bệnh nhân lệch khi lịch hẹn đổi; gói chưa dựng, chờ `Q-13` |
| Bệnh nhân của một hóa đơn (N-12) | `invoices → appointments.patient_id` | Cột `patient_id` trên `invoices` là bản sao có thể lệch khỏi lịch hẹn; chỉ mục hiện có đã đủ nhanh |

## 5. Ràng buộc viết bằng SQL (DBML không diễn đạt được)

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- N-04: mã hồ sơ duy nhất chỉ giữa các hồ sơ chưa ẩn → mã đã ẩn được cấp lại
CREATE UNIQUE INDEX uq_patients_org_code_active
  ON patients (organization_id, patient_code) WHERE deleted_at IS NULL;

-- N-02: giờ kết thúc sau giờ bắt đầu; một bác sĩ không có hai lịch trùng giờ (lịch hủy không chiếm giờ)
ALTER TABLE appointments ADD CONSTRAINT ck_appointments_time_order CHECK (ends_at > starts_at);
ALTER TABLE appointments ADD CONSTRAINT ex_appointments_doctor_no_overlap
  EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
  WHERE (status <> 'cancelled');

-- N-05: cọc có cả số tiền và ngày, hoặc không có gì; số tiền dương
ALTER TABLE appointments ADD CONSTRAINT ck_appointments_deposit
  CHECK ((deposit_amount IS NULL) = (deposit_received_on IS NULL)
         AND (deposit_amount IS NULL OR deposit_amount > 0));

-- N-06: ghi chú gắn đúng một đối tượng
ALTER TABLE internal_notes ADD CONSTRAINT ck_internal_notes_one_target
  CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1);
```

Không viết được thành ràng buộc khai báo, cần trigger hoặc dịch vụ ứng dụng trong cùng transaction:

- **N-13:** khi đặt `patients.deleted_at`, lịch hẹn tương lai (`starts_at > now()`, `status` `booked` hoặc `confirmed`) chuyển `cancelled`.
- **N-03:** `guardianships.guardian_person_id` khác `person_id` của bệnh nhân được bảo hộ (so sánh hai bảng).
- **N-09:** chỉ cho các cạnh chuyển trạng thái đã duyệt — chờ `Q-08` để có danh sách đủ.

## 6. Thứ tự chuyển dữ liệu từ v1.0

1. `appointments.ends_at`: thêm cột nullable → điền theo `Q-04` → **kiểm không có hai lịch trùng giờ cùng bác sĩ** → `SET NOT NULL` → thêm hai ràng buộc.
2. `patients.patient_code`: thêm nullable → sinh mã theo `Q-06` → `SET NOT NULL` → tạo chỉ mục duy nhất một phần.
3. `services.code`: thêm nullable → điền theo `Q-09` → `SET NOT NULL` → chỉ mục duy nhất.
4. `appointment_services.unit_price`: thêm nullable → điền từ `services.price` hiện hành (giả định `Q-03`) → `SET NOT NULL`.
5. `invoices.appointment_id`: kiểm không có lịch hẹn nào có hai hóa đơn trước khi thêm `unique`.
6. Enum `appointment_status`: `ALTER TYPE … ADD VALUE` ba giá trị; dòng cũ giữ `done`. Giá trị mới không dùng được trong cùng transaction với lệnh thêm nó.

## 7. Nhu cầu chưa dựng

| Nhu cầu | Lý do chưa dựng | Mã |
|---|---|---|
| N-14 | Trái R-09 (mật khẩu không lưu nguyên văn) — **không làm**, hỏi hướng thay | Q-10 |
| N-16 | Mâu thuẫn R-04 (đúng một bác sĩ mỗi lịch hẹn) | Q-11 |
| N-17 | Requirement chưa có phẫu thuật hay phòng mổ; lịch hẹn không gắn phòng | Q-12 |
| N-18 | Requirement chưa có gói trị liệu; số còn lại là giá trị suy ra | Q-13 |
| N-20 | Sinh trắc học và dữ liệu trẻ em; "vô thời hạn, mọi lễ tân xem" cần đánh giá | Q-14 |
| N-19 | **Không làm**: một bảng `appointments` cho mọi chi nhánh (mục 1) | — |
