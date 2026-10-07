# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. v1.1 (07/10/2026) áp nhu cầu giai đoạn 2 `N-01`…`N-13`, `N-15`; `N-14`, `N-16`…`N-20` chưa dựng — xem `CAU-HOI-BA.md`.

## 0. Thay đổi so với bản trước

<!-- db-schema-design:changes:start -->
> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối; số bảng/cột lấy ở dòng đếm dưới đây, không gõ lại ở phần viết tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **21 bảng · 127 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 8 | 0 | 0 |
| cột | 3 | 0 | 0 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 0 |
| index | 2 | 0 | 0 |

Phân loại: **phá vỡ 2** · **dữ liệu 3** · index 0 · cộng thêm 12 · ghi chú bảng đổi 8

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 2:
- index `services(organization_id, code)` thêm UNIQUE
- index `invoices(appointment_id)` thêm UNIQUE

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 3:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (8): `specialties`, `doctor_specialties`, `invoice_lines`, `guardianships`, `appointment_deposits`, `internal_notes`, `patient_allergies`, `patient_insurances`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived`
- `appointment_status` thêm giá trị `confirmed`
- `appointment_status` thêm giá trị `no_show`

## Bảng mới (8)

### `specialties`

Danh mục chuyên khoa theo tổ chức, quản trị viên tự thêm hoặc bớt (N-08): là dòng dữ liệu, không phải enum. Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa do quản trị viên nhập trên màn hình quản trị |
| `is_active` | `boolean` | No |  | `true` | Bớt chuyên khoa khỏi danh sách = false; chỉ xóa dòng khi chưa bác sĩ nào dùng |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `doctor_specialties`

Bảng nối bác sĩ - chuyên khoa: một bác sĩ thuộc nhiều chuyên khoa (N-08). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:restrict |  | khóa ngoại tới `doctors` |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | khóa ngoại tới `specialties` |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `invoice_lines`

Dòng chi tiết hóa đơn, chép giá và tên dịch vụ lúc lập hóa đơn (N-01, DB-MOD-08). Sinh từ appointment_services khi phát hành hóa đơn; sau đó không đọc lại services. Chỉ thêm, không sửa: sai thì lập d…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `bigint` | No | PK |  | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `invoice_id` | `uuid` | No | FK → invoices.id xóa:restrict |  | khóa ngoại tới `invoices` |
| `service_id` | `uuid` | No | FK → services.id xóa:restrict |  | khóa ngoại tới `services` |
| `service_name` | `varchar(160)` | No |  |  | Snapshot tên dịch vụ lúc lập hóa đơn |
| `unit_price` | `numeric(12,2)` | No |  |  | Snapshot đơn giá lúc lập hóa đơn (N-01); đổi bảng giá sau đó không ảnh hưởng |
| `quantity` | `smallint` | No |  | `1` | Số lượng dịch vụ trên dòng, lớn hơn 0 |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `guardianships`

Quan hệ bảo hộ giữa hai dòng people: ai bảo hộ ai, từ ngày nào (N-03, DB-MOD-01). CHECK (guardian_person_id <> ward_person_id). Một người được bảo hộ có thể có nhiều người bảo hộ cùng lúc. Phân loại:…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ — bất kỳ ai trong people (bác sĩ, lễ tân, người nhà) |
| `ward_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người được bảo hộ (bệnh nhân nhỏ tuổi) |
| `started_on` | `date` | No |  |  | Bảo hộ từ ngày nào (N-03) |
| `ended_on` | `date` | Yes |  |  | Null = còn hiệu lực. CHECK (ended_on IS NULL OR ended_on >= started_on) |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `appointment_deposits`

Khoản đặt cọc kèm lịch hẹn (N-05). Chưa gắn với hóa đơn hay thanh toán: cọc được trừ vào hóa đơn hoặc hoàn khi hủy thế nào đang hỏi ở Q-11. Nguồn: N-05.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | Tối đa một khoản cọc cho một lịch hẹn (giả định, N-05 viết "một khoản") |
| `amount` | `numeric(12,2)` | No |  |  | Số tiền cọc |
| `received_on` | `date` | No |  |  | Ngày nhận cọc |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `internal_notes`

Ghi chú nội bộ của nhân viên, gắn đúng một trong ba đối tượng (N-06, DB-MOD-06): CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:restrict |  | khóa ngoại tới `appointments` |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:restrict |  | khóa ngoại tới `patients` |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:restrict |  | khóa ngoại tới `invoices` |
| `body` | `text` | No |  |  | Nội dung ghi chú tự do của nhân viên |
| `created_by_user_id` | `uuid` | No | FK → users.id xóa:restrict |  | Nhân viên ghi chú |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_allergies`

Dị ứng của bệnh nhân, nhiều dòng cho một bệnh nhân (N-07, DB-MOD-20). Phân loại: nhạy cảm (sức khỏe) — lễ tân và bác sĩ xem; hạn lưu theo hồ sơ bệnh nhân (Q-12).

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | khóa ngoại tới `patients` |
| `substance` | `varchar(160)` | No |  |  | Tên chất gây dị ứng, nhập tự do (Q-12). Tra theo lower(substance) |
| `severity` | `allergy_severity` | No |  |  | Mức độ nhẹ hoặc nặng |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân, quan hệ 1 - 0..1 (N-15, DB-INT-14). Gia hạn thẻ ghi đè dòng này, không giữ lịch sử (giả định). Nguồn: N-15.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict, UNIQUE |  | Unique: mỗi bệnh nhân tối đa một hồ sơ bảo hiểm (N-15) |
| `card_number` | `varchar(40)` | No |  |  | Số thẻ bảo hiểm — dữ liệu cá nhân |
| `insurer_name` | `varchar(160)` | No |  |  | Nhà bảo hiểm |
| `expires_on` | `date` | No |  |  | Hạn dùng của thẻ |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

## Cột mới trên bảng đã có (3)

> Cột mới của bảng cũ chỉ cần ở đây — không phải thêm vào bảng cột viết tay của bảng đó.

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(30)` | No |  |  | Mã hồ sơ bệnh nhân (N-04). Duy nhất trong tổ chức trong số hồ sơ chưa ẩn; mã của hồ sơ đã ẩn được cấp lại. Dữ liệu cũ: sinh mã rồi mới đặt NOT NULL. |
| `services` | `code` | `varchar(40)` | No |  |  | Mã dịch vụ, ví dụ KHAM-TQ (N-11). Duy nhất trong tổ chức; hai tổ chức dùng chung mã được. Dữ liệu cũ: sinh mã rồi mới đặt NOT NULL. |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc lịch hẹn (N-02), khoảng giờ nửa mở [starts_at, ends_at). Dữ liệu cũ chỉ có giờ bắt đầu: điền ends_at theo thời lượng mặc định rồi mới đặt NOT NULL (Q-09). |

<!-- db-schema-design:changes:end -->

## 1. Kiến trúc và nhóm bảng

3 vùng (số bảng, cột ở dòng đếm của mục 0): **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`, `patient_insurances`, `patient_allergies`, `specialties`, `doctor_specialties`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`, `appointment_deposits`, `internal_notes`) · **Tiền** (`services`, `invoices`, `invoice_lines`, `payments`) · cộng `organizations` làm tenant.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ đóng — N-02 thêm `appointments.ends_at` cho từng lịch hẹn; thời lượng cho lịch cũ còn lại ở Q-09 |
| Q-03 → Q-07 | `N-14` mật khẩu · `N-20` ảnh khuôn mặt · `N-16` ca nhóm · `N-17` phòng mổ · `N-18` buổi còn lại | **CHẶN** — chưa dựng bảng, xem `CAU-HOI-BA.md` |
| Q-08 → Q-14 | trạng thái lịch hẹn · giờ kết thúc lịch cũ · mã hồ sơ cấp lại · vòng đời cọc · chất dị ứng · bảng theo chi nhánh · hủy do ẩn hồ sơ | 🔴 A — đã dựng theo giả định, xem `CAU-HOI-BA.md` |

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
| Tổng tiền hóa đơn | cộng `unit_price * quantity` của `invoice_lines` | giá đã chép lúc lập hóa đơn nên không đổi khi `services.price` đổi (N-01); bản cũ của dòng này tính từ `appointment_services` theo giá hiện hành, sai khi giá đổi |
| Số lần khám đã hoàn thành của bệnh nhân | `count(*)` từ `appointments` có `patient_id = ?` và `status = 'done'` | một nguồn sự thật; dùng index `(patient_id, starts_at)` có sẵn (N-10) |
| Số buổi điều trị còn lại của gói | không lưu; sẽ tính từ tổng buổi của gói trừ số buổi đã dùng | chưa có thực thể gói, `Q-07` đang chặn (N-18) |
| Hóa đơn của một bệnh nhân | `patients` → `appointments` → `invoices`, không lưu `patient_id` thứ hai trên hóa đơn | một nguồn, tránh lệch giữa hóa đơn và lịch hẹn (N-12) |

## 5. Ràng buộc ghi ở `Note` (DBML không biểu diễn được)

| Bảng | Ràng buộc | Nhu cầu |
|---|---|---|
| `appointments` | `CHECK (ends_at > starts_at)` · `EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'cancelled')`, cần `btree_gist` | N-02 |
| `appointments` | máy trạng thái: `booked → confirmed \| cancelled` · `confirmed → arrived \| no_show` · `arrived → done` (giả định, `Q-08`) | N-09 |
| `patients` | `CREATE UNIQUE INDEX uq_patients_org_record_code ON patients (organization_id, record_code) WHERE deleted_at IS NULL` | N-04 |
| `invoice_lines` | `CHECK (unit_price >= 0)` · `CHECK (quantity > 0)` | N-01 |
| `guardianships` | `CHECK (guardian_person_id <> ward_person_id)` · `CHECK (ended_on IS NULL OR ended_on >= started_on)` | N-03 |
| `appointment_deposits` | `CHECK (amount > 0)` | N-05 |
| `internal_notes` | `CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)` | N-06 |
| `patients` | ẩn hồ sơ = `deleted_at`; lịch hẹn tương lai chuyển `cancelled` trong cùng giao dịch; hóa đơn, thanh toán giữ nguyên | N-13 |
