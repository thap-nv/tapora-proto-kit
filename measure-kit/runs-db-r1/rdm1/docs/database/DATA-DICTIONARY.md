# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. Câu hỏi chờ BA chốt: `CAU-HOI-BA.md` (Q-03 trở đi). Bản v1.1 áp 20 nhu cầu dữ liệu của `NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20); nhu cầu nào đã áp, nhu cầu nào chờ BA: mục 1 dưới đây và `CAU-HOI-BA.md`.

## 0. Thay đổi so với bản trước

Khối dưới sinh từ `dbml_diff.py` (bản trước là `_check/last-green.dbml`, tức v1.0). Con số lấy từ lệnh, không gõ tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **21 bảng · 124 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 8 | 0 | 0 |
| cột | 4 | 0 | 1 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 3 |
| index | 7 | 0 | 0 |

Phân loại: **phá vỡ 11** · **dữ liệu 4** · index 0 · cộng thêm 12 · ghi chú bảng đổi 10

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 11:
- index `people(organization_id, id)` thêm UNIQUE
- index `patients(organization_id, id)` thêm UNIQUE
- index `doctors(organization_id, id)` thêm UNIQUE
- index `users(organization_id, id)` thêm UNIQUE
- index `services(organization_id, `lower(code)`)` thêm UNIQUE
- index `appointments(organization_id, id)` thêm UNIQUE
- cột `invoices.appointment_id` thêm UNIQUE
- index `invoices(organization_id, id)` thêm UNIQUE
- ref `appointments(patient_id) → patients` hành vi xóa — → restrict
- ref `invoices(appointment_id) → appointments` hành vi xóa — → restrict
- ref `payments(invoice_id) → invoices` hành vi xóa — → restrict

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 4:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointment_services.unit_price` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (8): `appointment_deposits`, `guardianships`, `internal_notes`, `allergens`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`

**Đọc các mục "phá vỡ" cho đúng:** sáu index `UNIQUE (organization_id, id)` trên `people`, `patients`, `doctors`, `users`, `appointments`, `invoices` luôn thỏa vì `id` đã là khóa chính; chúng chỉ làm đích cho khóa ngoại ghép của bảng mới. Ba `ref … → restrict` đổi từ `NO ACTION` sang `RESTRICT`: không đổi hành vi xóa thực tế, chỉ khai rõ ý định N-13 (hóa đơn và thanh toán không mất khi ẩn bệnh nhân). Hai mục cần kiểm dữ liệu thật: `invoices.appointment_id` UNIQUE (kiểm lịch hẹn có hai hóa đơn) và `services(organization_id, lower(code))` UNIQUE (cần mã trước). Chi tiết chuyển dữ liệu ở mục 7.

## 1. Kiến trúc và nhóm bảng

21 bảng · 4 vùng, cộng `organizations` làm tenant (20 bảng nghiệp vụ):

- **Danh tính và vai** — `people`, `patients`, `doctors`, `users`, `guardianships`. Danh tính tách khỏi vai (R-02): lễ tân đồng thời là bệnh nhân, bác sĩ đồng thời là người bảo hộ đều nằm trong cấu trúc này (N-03); `guardianships` ghi quan hệ bảo hộ.
- **Hồ sơ bệnh nhân và chuyên môn** — `allergens`, `patient_allergies`, `patient_insurances`, `specialties`, `doctor_specialties`.
- **Lịch khám** — `clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`, `internal_notes` (ghi chú gắn vào lịch hẹn, bệnh nhân hoặc hóa đơn, xếp ở đây theo đích chính).
- **Tiền** — `services`, `invoices`, `payments`, `appointment_deposits`.

Chưa dựng, chờ BA: ca khám nhiều bác sĩ (Q-04), ca phẫu thuật và phòng mổ (Q-05), gói trị liệu (Q-06), ảnh khuôn mặt (Q-07). Không dựng: ba bảng lịch hẹn theo chi nhánh (Q-14), mật khẩu đọc được (Q-03).

## 2. Điểm mù cần chốt

Từ v1.1, sổ câu hỏi ở `CAU-HOI-BA.md`. Hai mã cũ:

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận; v1.1 dùng làm căn cứ `volumes` |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | N-02 trả lời một nửa: lịch hẹn **có** giờ kết thúc, đã thêm `appointments.ends_at`. Nửa còn lại (lấy độ dài từ đâu, dữ liệu cũ) chuyển sang Q-09 |

## 3. Data Dictionary — các bảng cốt lõi

### 3.1 `people` — danh tính

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK, UNIQUE cùng `organization_id` (đích khóa ngoại ghép) | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `full_name` | `varchar(160)` | No | | | Họ tên |
| `phone` | `varchar(20)` | Yes | | | Số điện thoại |
| `email` | `varchar(160)` | Yes | | | Email |
| `birth_date` | `date` | Yes | | | Ngày sinh |
| `deleted_at` | `timestamptz` | Yes | | | Xóa mềm |

### 3.2 `appointments` — lịch hẹn

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK, UNIQUE cùng `organization_id` | `gen_random_uuid()` | Định danh |
| `clinic_id` | `uuid` | No | FK → clinics.id | | Phòng khám |
| `patient_id` | `uuid` | No | FK → patients.id (restrict) | | Bệnh nhân |
| `doctor_id` | `uuid` | No | FK → doctors.id | | Bác sĩ phụ trách (đúng một — R-04; N-16 đang chờ BA, Q-04) |
| `starts_at` | `timestamptz` | No | | | Giờ bắt đầu |
| `ends_at` | `timestamptz` | No | CHECK `ends_at > starts_at`; EXCLUDE theo bác sĩ (trong Note) | | Giờ kết thúc (N-02); khoảng nửa mở `[starts_at, ends_at)` |
| `status` | `appointment_status` | No | | `booked` | Trạng thái: `booked` → `confirmed` \| `cancelled`; `confirmed` → `arrived` \| `no_show`; `arrived` → `done` (🔴 A, Q-08). `done` có từ v1.0 và giữ nguyên |

### 3.3 Các bảng còn lại

Xem `schema.dbml` — mỗi bảng có `Note` ghi nguồn requirement. Bảng mới và bảng đổi ở v1.1 nằm ở 3.4.

### 3.4 Bảng mới và bảng đổi ở v1.1

Sinh từ `dbml_model.py --dictionary-md`; cột `Ý nghĩa nghiệp vụ` lấy từ `note` của cột trong DBML. Bảng đổi: `patients` (`record_code`), `services` (`code`), `appointment_services` (`unit_price`), `invoices` (`appointment_id` unique). Bảng mới: `appointment_deposits`, `guardianships`, `internal_notes`, `allergens`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`. Các cột có `deleted_at`, `record_code` đã nêu cách dùng ở `Note` của bảng.

#### `patients`

Hồ sơ bệnh nhân. Một người tối đa một hồ sơ bệnh nhân. Nguồn: R-02, R-03, N-04, N-10, N-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `person_id` | `uuid` | No | FK → people.id, UNIQUE |  | — |
| `record_code` | `varchar(32)` | No |  |  | Mã hồ sơ, duy nhất trong tổ chức trong số hồ sơ chưa ẩn (N-04); mã của hồ sơ đã ẩn được cấp lại |
| `created_at` | `timestamptz` | No |  | `now()` | — |
| `deleted_at` | `timestamptz` | Yes |  |  | Thời điểm ẩn hồ sơ (N-04, N-13); ẩn không làm mất hóa đơn và thanh toán |

#### `services`

Danh mục dịch vụ và giá hiện hành. Nguồn: R-07, N-11. Hai tổ chức khác nhau dùng cùng một mã được vì unique có organization_id dẫn đầu.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `code` | `varchar(40)` | No |  |  | Mã dịch vụ, ví dụ KHAM-TQ; duy nhất trong tổ chức, không phân biệt hoa thường (N-11) |
| `name` | `varchar(160)` | No |  |  | — |
| `price` | `numeric(12,2)` | No |  |  | Giá hiện hành. Giá đã tính cho từng lịch hẹn nằm ở appointment_services.unit_price (N-01) |
| `is_active` | `boolean` | No |  | `true` | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `appointment_services`

Dịch vụ được thực hiện trong một lịch hẹn. Nguồn: R-07, N-01.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `appointment_id` | `uuid` | No | FK → appointments.id |  | — |
| `service_id` | `uuid` | No | FK → services.id |  | — |
| `quantity` | `smallint` | No |  | `1` | — |
| `unit_price` | `numeric(12,2)` | No | CHECK unit_price >= 0 |  | Giá một đơn vị tại thời điểm khám, chép từ services.price lúc ghi dòng (N-01); hóa đơn in giá này |

#### `invoices`

Hóa đơn của một lịch hẹn. Nguồn: R-08, N-12, N-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | — |
| `issued_at` | `timestamptz` | No |  | `now()` | — |

#### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn, tối đa một khoản mỗi lịch hẹn (N-05). Nguồn: N-05.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → appointments.organization_id/id xóa:restrict |  | — |
| `appointment_id` | `uuid` | No | FK → appointments.organization_id/id xóa:restrict |  | — |
| `amount` | `numeric(12,2)` | No | CHECK amount > 0 |  | Số tiền cọc, đồng |
| `received_on` | `date` | No |  |  | Ngày nhận cọc, theo ngày địa phương của phòng khám |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `guardianships`

Quan hệ bảo hộ: ai bảo hộ bệnh nhân nào, từ ngày nào (N-03). Nguồn: N-03.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → patients.organization_id/id xóa:cascade FK → people.organization_id/id xóa:restrict |  | — |
| `patient_id` | `uuid` | No | FK → patients.organization_id/id xóa:cascade |  | Bệnh nhân được bảo hộ |
| `guardian_person_id` | `uuid` | No | FK → people.organization_id/id xóa:restrict |  | Người bảo hộ; là một người (people) nên có thể là bác sĩ, lễ tân hoặc bệnh nhân khác |
| `started_on` | `date` | No |  |  | Bảo hộ từ ngày (N-03) |
| `ended_on` | `date` | Yes |  |  | Ngày kết thúc bảo hộ; giả định 🔴 A, N-03 chỉ nêu ngày bắt đầu (Q-15) |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `internal_notes`

Ghi chú nội bộ gắn vào một lịch hẹn, một bệnh nhân hoặc một hóa đơn (N-06). Nguồn: N-06.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → appointments.organization_id/id xóa:cascade FK → patients.organization_id/id xóa:cascade FK → invoices.organization_id/id xóa:cascade FK → users.organization_id/id xóa:restrict |  | — |
| `appointment_id` | `uuid` | Yes | FK → appointments.organization_id/id xóa:cascade |  | Đích thứ nhất; đúng một trong ba đích có giá trị |
| `patient_id` | `uuid` | Yes | FK → patients.organization_id/id xóa:cascade |  | Đích thứ hai |
| `invoice_id` | `uuid` | Yes | FK → invoices.organization_id/id xóa:cascade |  | Đích thứ ba |
| `body` | `text` | No |  |  | Nội dung ghi chú nội bộ. Nhạy cảm: có thể chứa thông tin sức khỏe (DB-SEC-01) |
| `created_by` | `uuid` | No | FK → users.organization_id/id xóa:restrict |  | Tài khoản nhân viên ghi chú |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `allergens`

Danh mục chất gây dị ứng của tổ chức (N-07). Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `name` | `varchar(120)` | No |  |  | Tên chất gây dị ứng, ví dụ Penicillin; duy nhất trong tổ chức, không phân biệt hoa thường |
| `is_active` | `boolean` | No |  | `true` | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `patient_allergies`

Dị ứng của bệnh nhân: nhiều dị ứng mỗi bệnh nhân, mỗi chất một dòng (N-07). Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → patients.organization_id/id xóa:cascade FK → allergens.organization_id/id xóa:restrict |  | — |
| `patient_id` | `uuid` | No | FK → patients.organization_id/id xóa:cascade |  | — |
| `allergen_id` | `uuid` | No | FK → allergens.organization_id/id xóa:restrict |  | — |
| `severity` | `allergy_severity` | No |  |  | Mức độ nhẹ hoặc nặng (N-07). Nhạy cảm: dữ liệu sức khỏe |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `specialties`

Danh mục chuyên khoa do quản trị viên tự thêm hoặc bớt (N-08). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa; duy nhất trong tổ chức, không phân biệt hoa thường |
| `is_active` | `boolean` | No |  | `true` | Bớt chuyên khoa = đặt false; chuyên khoa còn bác sĩ gắn thì không xóa dòng được |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `doctor_specialties`

Bác sĩ thuộc nhiều chuyên khoa, một chuyên khoa có nhiều bác sĩ (N-08). Nguồn: N-08. Bảng nối thuần, xóa cứng theo bác sĩ.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → doctors.organization_id/id xóa:cascade FK → specialties.organization_id/id xóa:restrict |  | — |
| `doctor_id` | `uuid` | No | FK → doctors.organization_id/id xóa:cascade |  | — |
| `specialty_id` | `uuid` | No | FK → specialties.organization_id/id xóa:restrict |  | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

#### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân, tối đa một mỗi bệnh nhân (N-15). Nguồn: N-15.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict FK → patients.organization_id/id xóa:cascade |  | — |
| `patient_id` | `uuid` | No | FK → patients.organization_id/id xóa:cascade |  | — |
| `insurer_name` | `varchar(160)` | No |  |  | Tên nhà bảo hiểm, chữ tự do (chưa có danh mục) |
| `insurance_number` | `varchar(40)` | No |  |  | Số thẻ bảo hiểm y tế. Nhạy cảm: định danh gắn với sức khỏe. Không phải số thẻ thanh toán nên không thuộc phạm vi PCI; đặt tên insurance_number để khỏi lẫn |
| `valid_until` | `date` | No |  |  | Hạn dùng của thẻ |
| `created_at` | `timestamptz` | No |  | `now()` | — |
| `updated_at` | `timestamptz` | No |  | `now()` | — |

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | tổng `quantity × unit_price` của `appointment_services` thuộc lịch hẹn | `unit_price` là snapshot nên không đổi khi `services.price` đổi (N-01). Lý do ghi ở v1.0 ("tránh lệch khi giá đổi") chỉ đúng khi có snapshot; v1.0 chưa có `unit_price` nên phép cộng phải dùng giá hiện hành và sẽ trôi theo bảng giá |
| Tổng số lần khám đã hoàn thành của bệnh nhân (N-10) | `COUNT(*)` các `appointments` có `patient_id` = bệnh nhân và `status = 'done'` | Một bệnh nhân vài chục lịch hẹn; index `(patient_id, starts_at)` đủ nhanh (AP-06). Lưu thành cột sẽ lệch khi lịch hẹn bị hủy hay sửa trạng thái (DB-REQ-06). "Hoàn thành" đang hiểu là `done`; Q-08 hỏi lại |
| Số buổi điều trị còn lại (N-18) | chưa dựng — CHẶN | Cần có "gói trị liệu" trước; xem Q-06. Nếu được dựng thì suy ra bằng đếm, không lưu cột đếm |
| Hóa đơn của một bệnh nhân (N-12) | JOIN `appointments` → `invoices` | Không thêm `patient_id` vào `invoices`: join đi qua hai index sẵn có, phi chuẩn hóa chỉ khi đo thấy chậm (DB-PERF-01) |

## 5. Ma trận cưỡng chế rule (v1.1, DB-INT-15)

| Rule | Cơ chế | Lý do | Rủi ro còn lại |
|---|---|---|---|
| N-01 hóa đơn không đổi giá sau phát hành | `unit_price NOT NULL` + CHECK `>= 0` (constraint); chặn sửa sau hóa đơn: trigger **khuyến nghị**, hiện ở ứng dụng | giữ bất biến kế toán là đáng một trigger | nếu chưa có trigger, sửa dòng sau hóa đơn lọt khi hai người thao tác cùng lúc (Q-10) |
| N-02 một bác sĩ không hai lịch trùng giờ | EXCLUDE `(doctor_id, tstzrange(starts_at, ends_at))` bỏ `cancelled`, `no_show` (constraint, cần `btree_gist`) | đồng thời phải chặn ở CSDL, ứng dụng không đủ | bác sĩ phụ của N-16 không được phủ (Q-04); lịch cũ chồng nhau chặn việc tạo (Q-09) |
| N-02 giờ kết thúc sau giờ bắt đầu | CHECK `ends_at > starts_at` | nhiều cột nên ghi ở Note | không |
| N-04 mã hồ sơ duy nhất trong số hồ sơ chưa ẩn | unique index một phần `WHERE deleted_at IS NULL` | mã hồ sơ ẩn được cấp lại | khôi phục hồ sơ ẩn đụng mã đã cấp lại (Q-11) |
| N-05 tối đa một cọc mỗi lịch hẹn, số tiền dương | unique `(organization_id, appointment_id)` + CHECK `amount > 0` | N-05 nói "một khoản" | trừ và hoàn cọc chưa có chỗ (Q-13) |
| N-06 ghi chú gắn đúng một đích | CHECK `num_nonnulls(appointment_id, patient_id, invoice_id) = 1` | exclusive arc (DB-INT-13) | không |
| N-07 mỗi chất một dòng mỗi bệnh nhân; tên chất duy nhất | PK `(organization_id, patient_id, allergen_id)`; unique `(organization_id, lower(name))` | tra theo chất không vỡ vì gõ khác | danh mục chất xem Q-16 |
| N-08 tên chuyên khoa duy nhất; một bác sĩ không gắn trùng chuyên khoa | unique `(organization_id, lower(name))`; PK `(organization_id, doctor_id, specialty_id)` | | quyền thêm bớt chuyên khoa thuộc vai `admin`, kiểm ở ứng dụng |
| N-09 chuyển trạng thái hợp lệ | ứng dụng: `UPDATE … WHERE id = ? AND status = <gốc>` | cố ý không dùng trigger (DB-INT-16); so sánh-và-đặt chống ghi chồng nhau | ghi trực tiếp vào bảng ngoài ứng dụng bỏ qua máy trạng thái (Q-08) |
| N-11 mã dịch vụ duy nhất trong tổ chức | unique `(organization_id, lower(code))` | hai tổ chức cùng mã được | cần backfill mã cho dịch vụ cũ |
| N-12 và R-08 một hóa đơn mỗi lịch hẹn | unique `invoices.appointment_id` | v1.0 chưa khai; đồng thời là index tra theo lịch hẹn | cần kiểm trùng trước khi tạo |
| N-13 ẩn bệnh nhân không mất hóa đơn, thanh toán | khóa ngoại `restrict` dọc `appointments` → `invoices` → `payments`; chỉ đặt `patients.deleted_at` | | truy vấn kế toán lọc nhầm `deleted_at` sẽ không thấy hóa đơn |
| N-13 tự hủy lịch tương lai khi ẩn | ứng dụng, một giao dịch cùng việc đặt `deleted_at` | | lễ tân đặt lịch cho bệnh nhân đúng lúc đang bị ẩn có thể lọt: quét định kỳ lịch tương lai của hồ sơ ẩn (Q-08, Q-12) |
| N-15 tối đa một hồ sơ bảo hiểm | unique `(organization_id, patient_id)` | | nếu sau này nhiều thẻ thì bỏ unique |
| N-03 `ended_on` không trước `started_on` | CHECK ở Note | | hai giai đoạn bảo hộ chồng nhau và tự bảo hộ: **cố ý không giữ** vì chưa có rule nguồn (Q-15) |
| Dòng của tổ chức này không trỏ sang tổ chức khác (bảng mới) | khóa ngoại ghép `(organization_id, …)` (DB-INT-12) | R-01 | bảng cũ v1.0 vẫn khóa ngoại đơn (nợ cũ) |

## 6. Phân loại dữ liệu nhạy cảm (v1.1, DB-SEC-01)

| Cột | Mức | Ghi chú |
|---|---|---|
| `patient_allergies.allergen_id`, `severity` | nhạy cảm (sức khỏe) | ai được xem và có ghi log truy cập chưa có nguồn nêu (DB-SEC-05) |
| `patient_insurances.insurance_number`, `insurer_name`, `valid_until` | nhạy cảm (định danh bảo hiểm, sức khỏe) | không phải số thẻ thanh toán nên không thuộc PCI |
| `internal_notes.body` | nhạy cảm | văn bản tự do, có thể chứa thông tin sức khỏe; tách khỏi `notes` chung theo DB-SEC-01 |
| `appointment_deposits.amount`, `received_on` | nhạy cảm (tài chính) | |
| `guardianships.*` | cá nhân, liên quan trẻ em | |
| `patients.record_code` | cá nhân (định danh) | |
| Ảnh khuôn mặt (N-20) | sinh trắc, trẻ em | **chưa thu**, CHẶN Q-07 |
| Mọi dữ liệu của hồ sơ đã ẩn | giữ nguyên mức cũ | `deleted_at` không phải xóa thật; hạn lưu chờ Q-11 (DB-SEC-06) |

## 7. Chuyển dữ liệu v1.0 → v1.1 (expand–contract, DB-EVO-02)

Mỗi cột NOT NULL mới thêm theo ba bước: thêm cột cho phép rỗng → backfill theo lô → đặt NOT NULL (hoặc thêm CHECK `NOT VALID` rồi `VALIDATE`).

1. `patients.record_code`: sinh mã cho hồ sơ cũ theo lô, rồi tạo unique index một phần bằng `CREATE UNIQUE INDEX CONCURRENTLY`.
2. `services.code`: chưa có mã cũ; sinh từ tên rồi rà tay trước khi đặt NOT NULL.
3. `appointments.ends_at`: backfill theo hướng chốt ở Q-09. **Trước khi tạo EXCLUDE** phải đếm và dọn các cặp lịch hẹn chồng nhau của cùng bác sĩ; EXCLUDE không có `NOT VALID`. Cần `CREATE EXTENSION btree_gist`.
4. `appointment_services.unit_price`: backfill bằng `services.price` hiện hành. Hóa đơn cũ đã in khi giá từng đổi sẽ sai và không khôi phục được (Q-10).
5. `invoices.appointment_id` unique: kiểm `GROUP BY appointment_id HAVING count(*) > 1` trước.
6. Enum `appointment_status`: `ALTER TYPE … ADD VALUE` cho `confirmed`, `arrived`, `no_show`; ở PostgreSQL dưới 12 giá trị mới không dùng được trong cùng giao dịch.
7. Sáu unique `(organization_id, id)`: `CREATE UNIQUE INDEX CONCURRENTLY` rồi mới thêm khóa ngoại ghép của bảng mới.
8. DDL của index biểu thức `lower(code)` và `lower(name)`: viết `organization_id` đứng trước biểu thức; trình sinh SQL của DBML đảo thứ tự cột.
