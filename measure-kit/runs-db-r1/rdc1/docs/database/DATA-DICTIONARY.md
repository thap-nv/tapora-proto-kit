# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. Câu hỏi chờ BA: `CAU-HOI-BA.md` (Q-03 →). Bản đối chiếu từng nhu cầu N-01 → N-20: `BAO-CAO-DO.md`.

## 0. Thay đổi so với bản trước (v1.0 → v1.1)

Nguồn: `NHU-CAU-DU-LIEU-MOI.md`. **13 bảng → 20 bảng**: 7 bảng mới, 4 bảng cũ đổi cột / chỉ mục (`appointments`, `patients`, `services`, `invoices`), 1 enum đổi, 2 enum mới. Các bảng cũ còn lại chỉ đổi `Note`.

| Đối tượng | Thay đổi | Nhu cầu | Ảnh hưởng dữ liệu cũ |
|---|---|---|---|
| `invoice_items` | **Bảng mới** — dòng hóa đơn, chụp `unit_price` + `service_name` lúc lập hóa đơn | N-01 | Hóa đơn cũ chưa có dòng: xem *Chuyển dữ liệu* bước 8 |
| `appointments.ends_at` | **Cột mới** `NOT NULL` + CHECK `ends_at > starts_at` + ràng buộc loại trừ chống trùng lịch bác sĩ | N-02 | Phải điền cho mọi dòng cũ (Q-12) và kiểm trùng trước khi bật ràng buộc |
| `guardianships` | **Bảng mới** — bảo hộ: bệnh nhân, người bảo hộ (`people`), `starts_on` | N-03 | Không |
| `patients.record_code` | **Cột mới** `NOT NULL` + unique **một phần** (`WHERE deleted_at IS NULL`) | N-04 | Phải sinh mã cho hồ sơ cũ (Q-07) |
| `appointments.deposit_amount`, `deposit_received_on` | **Cột mới**, nullable, CHECK cùng NULL hoặc cùng có | N-05 | Không (NULL = không có cọc) |
| `internal_notes` | **Bảng mới** — ghi chú nội bộ, ba FK nullable + CHECK đúng một | N-06 | Không |
| `patient_allergies` + enum `allergy_severity` | **Bảng mới** + **enum mới**; chỉ mục `lower(substance_name)` để tra theo chất | N-07 | Không |
| `specialties`, `doctor_specialties` | **Hai bảng mới** — chuyên khoa là dữ liệu, không phải enum | N-08 | Không |
| `appointment_status` | **Enum đổi**: thêm `confirmed`, `arrived`, `no_show`; giữ `booked`, `done`, `cancelled` | N-09 | Dòng cũ giữ nguyên giá trị; `ALTER TYPE … ADD VALUE` |
| `patients` ← COUNT `done` | **Không thêm cột**: tổng lần khám hoàn thành là giá trị suy ra (mục 4) | N-10 | Không |
| `services.code` | **Cột mới** `NOT NULL` + unique `(organization_id, code)` | N-11 | Phải có mã cho dịch vụ cũ |
| `invoices` | **Chỉ mục mới** unique `appointment_id` (`ux_invoices_appointment`) | N-12 | Phải kiểm không có lịch hẹn nào đang có hai hóa đơn |
| `appointments.cancelled_at`, `cancel_reason` + enum `appointment_cancel_reason` | **Hai cột mới + enum mới**, nullable | N-13 | Lịch hủy cũ để trống cả hai |
| `patient_insurances` | **Bảng mới** — quan hệ 0..1 với `patients` (`patient_id` unique) | N-15 | Không |
| `users.password_hash` | **Giữ nguyên** — N-14 không làm (Q-06) | N-14 | Không |
| — | N-16 · N-17 · N-18 · N-20 chờ BA (Q-03 · Q-09 · Q-04 · Q-11); N-19 không làm | — | Không |

**Phá vỡ tương thích:** (1) câu `INSERT INTO appointments` cũ thiếu `ends_at` sẽ lỗi; (2) câu `INSERT INTO patients` thiếu `record_code` và `INSERT INTO services` thiếu `code` sẽ lỗi; (3) mã nguồn đang đọc giá hóa đơn từ `services.price` phải đổi sang `invoice_items.unit_price`.

### Chuyển dữ liệu (theo thứ tự)

1. `CREATE EXTENSION IF NOT EXISTS btree_gist;`
2. `ALTER TYPE appointment_status ADD VALUE …` cho `confirmed`, `arrived`, `no_show`. **Commit trước** rồi mới dùng giá trị mới (không dùng trong cùng giao dịch).
3. Tạo enum `appointment_cancel_reason`, `allergy_severity`.
4. `appointments`: thêm `ends_at` nullable → điền `starts_at + interval '30 minutes'` *(giả định Q-12)* → **chạy truy vấn tìm lịch trùng của cùng bác sĩ, xử lý hết** → `SET NOT NULL` → thêm CHECK và ràng buộc loại trừ (mục 5). Thêm `deposit_*`, `cancelled_at`, `cancel_reason` (nullable) và CHECK của chúng.
5. `services`: thêm `code` nullable → điền mã thật do phòng khám cung cấp (không sinh bừa — mã in ra hóa đơn) → `SET NOT NULL` → unique.
6. `patients`: thêm `record_code` nullable → sinh mã *(Q-07)* → `SET NOT NULL` → tạo unique một phần (mục 5).
7. `invoices`: kiểm `GROUP BY appointment_id HAVING COUNT(*) > 1` rỗng → tạo `ux_invoices_appointment`.
8. `invoice_items`: tạo bảng; điền cho hóa đơn cũ từ `appointment_services` JOIN `services` — **giá điền là giá HIỆN HÀNH, không phải giá lúc khám**, vì v1.0 chưa từng chụp giá. Hóa đơn lập trước ngày chuyển (`invoices.issued_at < <ngày chuyển>`) là hóa đơn có thể sai giá nếu bảng giá từng đổi — ghi ngày chuyển vào sổ vận hành để phân biệt được.
9. Tạo `specialties`, `doctor_specialties`, `guardianships`, `internal_notes`, `patient_allergies`, `patient_insurances`.

## 1. Kiến trúc và nhóm bảng

**20 bảng** · 4 vùng:

- **Danh tính** *(7)*: `people`, `patients`, `doctors`, `users`, `guardianships`, `patient_allergies`, `patient_insurances`
- **Lịch khám** *(7)*: `clinics`, `rooms`, `doctor_schedules`, `specialties`, `doctor_specialties`, `appointments`, `appointment_services`
- **Tiền** *(4)*: `services`, `invoices`, `invoice_items`, `payments`
- **Phụ trợ** *(1)*: `internal_notes` (gắn vào lịch hẹn / bệnh nhân / hóa đơn)
- cộng `organizations` làm tenant *(1)*.

> v1.0 ghi "12 bảng" trong khi file có **13** (đếm lại từ `schema.dbml`) — đã sửa ở đây.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ Đóng về cấu trúc: N-02 cho `ends_at`; phần giá trị cho dữ liệu cũ chuyển sang **Q-12** |
| Q-03 → Q-13 | Mười một câu phát sinh khi áp N-01 → N-20 | **Mở** — toàn văn ở `CAU-HOI-BA.md` |

Tóm tắt Q-03 → Q-13: Q-03 ca nhóm × R-04 · Q-04 gói trị liệu · Q-05 đường chuyển trạng thái · Q-06 mật khẩu · Q-07 mã hồ sơ cấp lại · Q-08 phí hủy tự động · Q-09 phẫu thuật · Q-10 kết thúc bảo hộ · Q-11 ảnh khuôn mặt · Q-12 thời lượng lịch cũ · Q-13 tiền cọc.

## 3. Data Dictionary — các bảng cốt lõi

Chỉ liệt kê cột **thay đổi hoặc mới** ở bảng cũ; bảng mới liệt kê đủ.

### 3.1 `people` — danh tính *(không đổi cột)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `full_name` | `varchar(160)` | No | | | Họ tên |
| `phone` | `varchar(20)` | Yes | | | Số điện thoại |
| `email` | `varchar(160)` | Yes | | | Email |
| `birth_date` | `date` | Yes | | | Ngày sinh. Tuổi / "trẻ nhỏ" tính từ đây, không lưu |
| `deleted_at` | `timestamptz` | Yes | | | Xóa mềm **danh tính**. Ẩn bệnh nhân KHÔNG đặt cột này (người đó có thể còn là bác sĩ hay lễ tân) |

Một người giữ nhiều vai cùng lúc là điều mô hình **đã cho phép** (N-03): `patients`, `doctors`, `users` cùng trỏ về một dòng `people`.

### 3.2 `appointments` — lịch hẹn

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `clinic_id` | `uuid` | No | FK → clinics.id | | Phòng khám |
| `patient_id` | `uuid` | No | FK → patients.id | | Bệnh nhân |
| `doctor_id` | `uuid` | No | FK → doctors.id | | Bác sĩ phụ trách (đúng một — R-04; N-16 chờ Q-03) |
| `starts_at` | `timestamptz` | No | | | Giờ bắt đầu |
| `ends_at` 🆕 | `timestamptz` | No | CHECK `ends_at > starts_at`; EXCLUDE (mục 5) | | Giờ kết thúc. Khoảng nửa mở `[starts_at, ends_at)` — hai ca liền kề không trùng *(N-02)* |
| `status` | `appointment_status` | No | | `booked` | Trạng thái (N-09) |
| `deposit_amount` 🆕 | `numeric(12,2)` | Yes | CHECK `> 0` khi có | | Tiền đặt cọc; NULL = không cọc *(N-05)* |
| `deposit_received_on` 🆕 | `date` | Yes | cùng NULL / cùng có với `deposit_amount` | | Ngày nhận cọc *(N-05)* |
| `cancelled_at` 🆕 | `timestamptz` | Yes | chỉ có khi `status = cancelled` | | Thời điểm hủy; R-12 so với `starts_at - 2 giờ` *(N-13)* |
| `cancel_reason` 🆕 | `appointment_cancel_reason` | Yes | cùng NULL / cùng có với `cancelled_at` | | `by_patient` · `by_clinic` · `patient_hidden` *(N-13)* |

**`appointment_status`:** `booked` → `confirmed` | `cancelled` · `confirmed` → `arrived` | `no_show` *(đã chốt ở N-09)*. Chưa chốt: `arrived` → `done`, `confirmed` → `cancelled` và trạng thái cuối — Q-05. CSDL **chưa chặn** đường chuyển; ứng dụng chặn.

**Chỉ mục:** `(organization_id, clinic_id, starts_at)` — báo cáo theo chi nhánh, **thay cho ba bảng theo chi nhánh** của N-19 · `(patient_id, starts_at)` — lịch của một bệnh nhân, bước đầu của "hóa đơn theo bệnh nhân" (N-12) và `COUNT done` (N-10) · chỉ mục gist của ràng buộc loại trừ (mục 5) — phục vụ cả truy vấn "lịch của bác sĩ trong khoảng thời gian".

### 3.3 `patients` — hồ sơ bệnh nhân

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `person_id` | `uuid` | No | FK → people.id, UNIQUE | | Danh tính (R-02, R-03) |
| `record_code` 🆕 | `varchar(32)` | No | UNIQUE một phần `(organization_id, record_code) WHERE deleted_at IS NULL` | | Mã hồ sơ *(N-04)*. Hồ sơ ẩn không giữ mã → mã được cấp lại. Rủi ro đối chiếu: Q-07 |
| `created_at` | `timestamptz` | No | | `now()` | |
| `deleted_at` | `timestamptz` | Yes | | | **Ẩn** hồ sơ *(N-04, N-13)*. Hóa đơn, thanh toán, lịch sử còn nguyên; lịch hẹn tương lai tự hủy với `cancel_reason = patient_hidden` (mục 5.4) |

Vì `person_id` là UNIQUE (R-03), người đã bị ẩn quay lại thì **khôi phục** dòng cũ (xóa `deleted_at`, cấp mã mới nếu mã cũ đã có người dùng) — không tạo dòng thứ hai.

### 3.4 `services` — danh mục dịch vụ

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `code` 🆕 | `varchar(40)` | No | UNIQUE `(organization_id, code)` | | Mã dịch vụ, ví dụ `KHAM-TQ` *(N-11)*. Hai tổ chức dùng cùng mã được |
| `price` | `numeric(12,2)` | No | | | Giá **hiện hành**. Hóa đơn đã lập không đọc cột này (N-01) |

Các cột còn lại như v1.0 (`id`, `organization_id`, `name`, `is_active`, `created_at`). Unique phân biệt hoa thường: `KHAM-TQ` và `kham-tq` là hai mã; muốn gộp thì chuẩn hóa về chữ hoa ở ứng dụng.

### 3.5 `invoices` · `invoice_items` — hóa đơn và dòng hóa đơn

`invoices`: không đổi cột. **Chỉ mục mới** `ux_invoices_appointment` UNIQUE `(appointment_id)` — một lịch hẹn một hóa đơn (R-08) và là đường tra theo lịch hẹn của N-12. Tra theo bệnh nhân: `appointments(patient_id, starts_at)` → `invoices(appointment_id)`; không chép `patient_id` sang `invoices` vì nó suy được và sẽ lệch nếu lịch hẹn đổi bệnh nhân.

`invoice_items` 🆕 *(N-01)*:

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `invoice_id` | `uuid` | No | PK (1/2), FK → invoices.id | | Hóa đơn |
| `service_id` | `uuid` | No | PK (2/2), FK → services.id | | Dịch vụ gốc (để tra cứu, không để lấy giá) |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `service_name` | `varchar(160)` | No | | | **Snapshot** tên dịch vụ lúc lập hóa đơn |
| `unit_price` | `numeric(12,2)` | No | CHECK `>= 0` | | **Snapshot** giá lúc khám. Không bao giờ cập nhật theo `services.price` |
| `quantity` | `smallint` | No | CHECK `> 0` | `1` | Số lượng |

Khóa chính `(invoice_id, service_id)` vì `appointment_services` đã có khóa `(appointment_id, service_id)` — mỗi dịch vụ một dòng, số lượng ở `quantity`. Bất biến sau khi lập.

### 3.6 `specialties` · `doctor_specialties` 🆕 *(N-08)*

| Bảng.Cột | Kiểu | Nullable | Khóa / Constraint | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- |
| `specialties.id` | `uuid` | No | PK | |
| `specialties.organization_id` | `uuid` | No | FK → organizations.id; UNIQUE `(organization_id, name)` | Tenant |
| `specialties.name` | `varchar(120)` | No | | Tên chuyên khoa |
| `specialties.is_active` | `boolean` | No | mặc định `true` | "Bớt" chuyên khoa = `false`; giữ lịch sử gán |
| `specialties.created_at` | `timestamptz` | No | mặc định `now()` | |
| `doctor_specialties.doctor_id` | `uuid` | No | PK (1/2), FK → doctors.id | |
| `doctor_specialties.specialty_id` | `uuid` | No | PK (2/2), FK → specialties.id; chỉ mục `(specialty_id)` | |
| `doctor_specialties.organization_id` | `uuid` | No | FK → organizations.id | Tenant |
| `doctor_specialties.created_at` | `timestamptz` | No | mặc định `now()` | |

Chuyên khoa là **dòng dữ liệu**, không phải `Enum`: quản trị viên thêm / bớt lúc chạy, enum thì phải sửa schema.

### 3.7 `guardianships` 🆕 *(N-03)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | FK → patients.id; UNIQUE `(patient_id, guardian_person_id)` | | Người được bảo hộ |
| `guardian_person_id` | `uuid` | No | FK → people.id; chỉ mục | | Người bảo hộ — bác sĩ, lễ tân hay người nhà đều là một dòng `people` |
| `starts_on` | `date` | No | | | Bảo hộ từ ngày |
| `created_at` | `timestamptz` | No | | `now()` | |

Không cho người tự bảo hộ chính mình: mục 5.5. Ngày kết thúc: chờ Q-10.

### 3.8 `internal_notes` 🆕 *(N-06)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `appointment_id` | `uuid` | Yes | FK → appointments.id; chỉ mục | | Đối tượng 1 |
| `patient_id` | `uuid` | Yes | FK → patients.id; chỉ mục | | Đối tượng 2 |
| `invoice_id` | `uuid` | Yes | FK → invoices.id; chỉ mục | | Đối tượng 3 |
| `body` | `text` | No | | | Nội dung ghi chú |
| `created_by` | `uuid` | No | FK → users.id | | Nhân viên viết |
| `created_at` | `timestamptz` | No | | `now()` | |

CHECK `num_nonnulls(appointment_id, patient_id, invoice_id) = 1` (mục 5.3). Chọn ba FK thật thay cho cặp `(target_type, target_id)`: cặp đó không có khóa ngoại, ghi chú sẽ mồ côi khi đối tượng bị xóa.

### 3.9 `patient_allergies` 🆕 *(N-07)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | FK → patients.id | | Bệnh nhân (một bệnh nhân nhiều dòng) |
| `substance_name` | `varchar(160)` | No | UNIQUE `(patient_id, lower(substance_name))` | | Tên chất gây dị ứng, nhập tự do |
| `severity` | `allergy_severity` | No | | | `mild` (nhẹ) · `severe` (nặng) |
| `created_at` · `updated_at` | `timestamptz` | No | | `now()` | |

Tra bệnh nhân theo chất: chỉ mục `(organization_id, lower(substance_name))`. Chính tả khác nhau vẫn là chất khác (`penicillin` ≠ `penicilin`); nếu lễ tân hay gõ sai thì thêm danh mục chất — xem mục 6, giả định G-02.

### 3.10 `patient_insurances` 🆕 *(N-15)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | FK → patients.id, **UNIQUE** | | Quan hệ **0..1**: tối đa một dòng cho một bệnh nhân |
| `card_number` | `varchar(40)` | No | | | Số thẻ |
| `insurer_name` | `varchar(160)` | No | | | Nhà bảo hiểm |
| `expires_on` | `date` | No | | | Hạn dùng |
| `created_at` · `updated_at` | `timestamptz` | No | | `now()` | |

Đổi thẻ = sửa dòng tại chỗ. Không có thẻ = không có dòng (không phải dòng rỗng).

### 3.11 Các bảng còn lại

`organizations`, `clinics`, `doctors`, `users`, `rooms`, `doctor_schedules`, `appointment_services`, `payments` — không đổi cột. Xem `schema.dbml`; mỗi bảng có `Note` ghi nguồn.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do không lưu |
|---|---|---|
| Tổng tiền hóa đơn | `SUM(invoice_items.unit_price * quantity)` | Từ v1.1 tính từ **dòng đã chụp giá** (N-01). Bản v1.0 ghi "cộng các dịch vụ của lịch hẹn" — cách đó đọc giá hiện hành và **sai** khi bảng giá đổi, nay bỏ |
| Đã thu / còn nợ của hóa đơn | `SUM(payments.amount)` (hoàn tiền là số âm) | Lưu sẽ lệch ngay khi có thanh toán / hoàn tiền mới |
| Tổng số lần khám hoàn thành của bệnh nhân | `COUNT(*) FROM appointments WHERE patient_id = ? AND status = 'done'` | *(N-10)* Bộ đếm lưu trên `patients` lệch khi trạng thái lịch hẹn bị sửa hoặc lịch bị xóa. Chỉ mục `(patient_id, starts_at)` đủ nhanh cho vài trăm lịch mỗi bệnh nhân |
| Số buổi điều trị còn lại của gói | tổng buổi của gói − buổi đã dùng | *(N-18)* Lưu cột trên `patients` sẽ lệch khi hủy / vắng / hoàn tiền. Gói chưa có trong mô hình: Q-04 |
| Thời lượng lịch hẹn | `ends_at - starts_at` | Hai cột đã đủ |
| Tuổi, "là trẻ nhỏ" | `people.birth_date` so với ngày hôm nay | Đổi mỗi ngày |
| Thẻ bảo hiểm còn hạn | `patient_insurances.expires_on >= ngày khám` | Phụ thuộc ngày so sánh |
| Bệnh nhân có được ẩn / còn hoạt động | `patients.deleted_at IS NULL` | Một cờ đủ, không thêm `is_active` |

## 5. Ràng buộc ngoài DBML (DDL)

DBML không có CHECK, EXCLUDE, unique một phần. Các ràng buộc dưới đây là **một phần của schema**; migration bắt buộc có.

### 5.1 Không trùng lịch bác sĩ *(N-02)*

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
  ADD CONSTRAINT ck_appointments_time_order CHECK (ends_at > starts_at),
  ADD CONSTRAINT ex_appointments_doctor_no_overlap
    EXCLUDE USING gist (
      doctor_id WITH =,
      tstzrange(starts_at, ends_at, '[)') WITH &&
    ) WHERE (status IN ('booked', 'confirmed', 'arrived', 'done'));
```

Lịch `cancelled` và `no_show` không giữ chỗ. Đổi trạng thái sang `booked` / `confirmed` / `arrived` / `done` mà trùng thì CSDL từ chối — ứng dụng phải bắt lỗi `23P01` (`exclusion_violation`) và báo "bác sĩ đã có lịch giờ này". Ràng buộc này nằm trên `appointments.doctor_id`; nếu Q-03 chọn nhiều bác sĩ một lịch thì dời sang bảng nối.

Kiểm dữ liệu cũ trước khi bật:

```sql
SELECT a.id, b.id AS id_trung
FROM appointments a JOIN appointments b
  ON a.doctor_id = b.doctor_id AND a.id < b.id
 AND tstzrange(a.starts_at, a.ends_at, '[)') && tstzrange(b.starts_at, b.ends_at, '[)')
WHERE a.status IN ('booked','confirmed','arrived','done')
  AND b.status IN ('booked','confirmed','arrived','done');
```

### 5.2 Mã hồ sơ duy nhất trong số hồ sơ chưa ẩn *(N-04)*

```sql
CREATE UNIQUE INDEX ux_patients_org_record_code_live
  ON patients (organization_id, record_code)
  WHERE deleted_at IS NULL;
```

`schema.dbml` **không** khai chỉ mục này trong `indexes {}` (xem `Note` của `patients`): sinh SQL từ DBML rồi chạy khối trên là đủ, không đụng tên. Nếu Q-07 chọn **không** cấp lại mã: bỏ `WHERE`, thành unique toàn bảng (khi đó khai `[unique]` trong DBML được).

### 5.3 CHECK các bảng

```sql
ALTER TABLE appointments
  ADD CONSTRAINT ck_appointments_deposit CHECK (
       (deposit_amount IS NULL AND deposit_received_on IS NULL)
    OR (deposit_amount > 0 AND deposit_received_on IS NOT NULL)),
  ADD CONSTRAINT ck_appointments_cancel CHECK (
       (cancelled_at IS NULL) = (cancel_reason IS NULL)
   AND (status = 'cancelled' OR cancelled_at IS NULL));

ALTER TABLE internal_notes
  ADD CONSTRAINT ck_internal_notes_one_target
  CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1);

ALTER TABLE invoice_items
  ADD CONSTRAINT ck_invoice_items_price CHECK (unit_price >= 0),
  ADD CONSTRAINT ck_invoice_items_qty   CHECK (quantity > 0);
```

`ck_appointments_cancel` cố ý **không** buộc "đã hủy thì phải có `cancelled_at`" — lịch hủy từ trước v1.1 không có thời điểm hủy. Dòng hủy **mới** do ứng dụng điền cả hai cột.

### 5.4 Ẩn bệnh nhân: tự hủy lịch tương lai *(N-13)*

Cùng một giao dịch với việc đặt `patients.deleted_at` (trigger hoặc ứng dụng):

```sql
UPDATE appointments
   SET status = 'cancelled', cancelled_at = now(), cancel_reason = 'patient_hidden'
 WHERE patient_id = $1            -- $1 = patients.id vừa ẩn
   AND starts_at > now()
   AND status IN ('booked', 'confirmed');
```

`invoices`, `payments`, lịch đã khám giữ nguyên. Không xóa cứng dòng `patients`: mọi FK trỏ vào là `NO ACTION`, nên xóa cứng bị chặn khi còn lịch hẹn / hóa đơn / thanh toán.

### 5.5 Không tự bảo hộ chính mình *(N-03)*

Cần tham chiếu chéo bảng nên không viết được CHECK đơn giản. Dùng trigger `BEFORE INSERT OR UPDATE ON guardianships`: từ chối nếu `guardian_person_id = (SELECT person_id FROM patients WHERE id = NEW.patient_id)`. Ghi nhận như quy tắc ứng dụng nếu không dùng trigger.

### 5.6 Cùng tổ chức giữa các bảng

Các bảng nối (`doctor_specialties`, `guardianships`, `invoice_items`, `internal_notes`) có `organization_id` riêng nhưng CSDL **không** kiểm nó khớp với `organization_id` của hai đầu. Cách chặt là FK ghép `(organization_id, id)`; hiện để ứng dụng / RLS bảo đảm (Q-01: chưa biết cỡ dữ liệu để cân nhắc).

## 6. Giả định

| Mã | Giả định | Nhu cầu | Nếu sai |
|---|---|---|---|
| G-01 | Hóa đơn được lập sau khi khám xong; chụp giá vào `invoice_items` ở thời điểm lập | N-01 | Nếu giá phải khóa từ lúc đặt lịch, chụp vào `appointment_services` thay vì (hoặc thêm vào) `invoice_items` |
| G-02 | Chất gây dị ứng nhập tự do, không có danh mục | N-07 | Thêm bảng `allergens` và đổi `substance_name` thành FK |
| G-03 | `severity` chỉ hai mức nhẹ / nặng | N-07 | `ALTER TYPE allergy_severity ADD VALUE` |
| G-04 | Hồ sơ bảo hiểm đủ ba trường mới tồn tại (cả ba NOT NULL); thẻ không hạn dùng không thuộc phạm vi | N-15 | Cho `expires_on` nullable |
| G-05 | Lịch hẹn "tương lai" khi ẩn bệnh nhân = `starts_at > now()` và đang `booked` / `confirmed` | N-13 | Đổi điều kiện ở mục 5.4 |
| G-06 | Ràng buộc không trùng theo `doctor_id`, **không** theo phòng khám: một bác sĩ không thể có hai lịch cùng giờ dù ở hai phòng khám khác nhau | N-02 | Hiếm khi sai: một người không ở hai nơi cùng lúc. Nếu có bác sĩ khám từ xa nhiều ca song song thì cần loại lịch riêng |
| G-07 | Chuyên khoa theo tổ chức (không dùng chung giữa các tổ chức) | N-08 | R-01 cấm dữ liệu chéo tổ chức |

## 7. Nợ của schema v1.0 phát hiện trong lượt này *(chưa sửa — ngoài phạm vi N-01 → N-20)*

| Mã | Phát hiện | Gợi ý |
|---|---|---|
| D-01 | `users` không có `clinic_id`, nên R-10 (*lễ tân chỉ thấy dữ liệu phòng khám của mình*) **không thực thi được từ schema** — không biết tài khoản lễ tân thuộc phòng khám nào | Thêm `users.clinic_id` (NULL = toàn tổ chức cho `admin`); cần BA xác nhận |
| D-02 | `appointment_services` không có `organization_id` trong khi `Project.Note` nói "mọi bảng nghiệp vụ mang organization_id" (ảnh hưởng RLS theo tổ chức) | Thêm cột hoặc RLS qua `appointments` |
| D-03 | Khóa ngoại chưa có chỉ mục: `doctors.clinic_id`, `users.person_id`, `appointment_services.service_id`, `appointments.clinic_id`/`doctor_id` khi đứng riêng; hầu hết `organization_id` | Xem sau khi có số đo thật (Q-01) |
| D-04 | `Q-01` cỡ dữ liệu vẫn là giả định | Đo trước khi tối ưu chỉ mục |
