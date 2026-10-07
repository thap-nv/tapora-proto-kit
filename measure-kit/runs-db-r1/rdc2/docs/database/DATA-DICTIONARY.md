# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml` (v1.1, 07/10/2026). Câu hỏi chờ BA: `CAU-HOI-BA.md`.

## 0. Thay đổi so với bản trước (v1.0 → v1.1)

Áp 20 nhu cầu `N-01 → N-20` của `NHU-CAU-DU-LIEU-MOI.md`. Kết quả: **13 bảng → 19 bảng** (6 bảng mới), **6 cột mới** trên bảng có sẵn, **3 giá trị enum mới + 1 enum mới**, **5 ràng buộc/chỉ mục chỉ viết được ở migration** vì DBML không biểu diễn được (mục 5). Ba nhu cầu **không làm**: `N-10` (giá trị suy ra, tính khi đọc), `N-14` (trái `R-09`), `N-19` (tách bảng theo chi nhánh). Bốn nhu cầu **chờ BA**, chưa dựng bảng: `N-16`, `N-17`, `N-18`, `N-20`.

| Nhu cầu | Thay đổi | Ghi chú |
|---|---|---|
| N-01 | `appointment_services.unit_price` (mới, snapshot giá) | Sửa lại mục 4: tổng tiền tính từ `unit_price`, không từ `services.price`. `Q-10` |
| N-02 | `appointments.ends_at` (mới) + ràng buộc `EXCLUDE` chống trùng giờ bác sĩ | Đóng `Q-02`. Dữ liệu cũ: `Q-09`. Vỡ nếu `Q-03` được duyệt |
| N-03 | Bảng mới `guardianships` | Phần "lễ tân đồng thời là bệnh nhân" schema cũ đã đáp ứng, không đổi. `Q-13` |
| N-04 | `patients.record_code` (mới) + chỉ mục unique **bộ phận** `WHERE deleted_at IS NULL` | `Q-12` |
| N-05 | `appointments.deposit_amount`, `appointments.deposit_received_on` (mới) | `Q-11` |
| N-06 | Bảng mới `internal_notes` (ba khóa ngoại + `CHECK` đúng một) | Không dùng cặp (loại, id) đa hình |
| N-07 | Bảng mới `patient_allergies` + enum mới `allergy_severity` | Chỉ mục `lower(substance_name)` để tra theo chất |
| N-08 | Bảng mới `specialties` + `doctor_specialties` | Bảng, không phải enum: quản trị viên đổi lúc chạy |
| N-09 | `appointment_status` thêm `confirmed`, `arrived`, `no_show`; giữ `done` | Còn thiếu cặp chuyển trạng thái: `Q-08` |
| N-10 | **Không lưu** — giá trị suy ra (mục 4) | Phụ thuộc `Q-08` (đếm `done` hay `arrived`) |
| N-11 | `services.code` (mới) + unique `(organization_id, code)` | Dịch vụ cũ gán mã tạm (mục 6) |
| N-12 | `invoices.appointment_id` thành UNIQUE (kiêm chỉ mục) | Tra theo bệnh nhân đi qua `appointments(patient_id, starts_at)` |
| N-13 | Ba khóa ngoại chuỗi `patients ← appointments ← invoices ← payments` đặt rõ `ON DELETE RESTRICT` | Ẩn = `deleted_at`, hủy lịch tương lai trong cùng giao dịch |
| N-14 | **Không làm** | Trái `R-09`. Đề xuất thay thế: `Q-07` |
| N-15 | Bảng mới `patient_insurances` (`patient_id` UNIQUE) | Quan hệ 0..1 |
| N-16 | **Chờ BA** | Trái `R-04`: `Q-03` |
| N-17 | **Chờ BA** | Chưa có phẫu thuật/phòng mổ trong mô hình: `Q-04` |
| N-18 | **Chờ BA** | Chưa có gói trị liệu; số buổi còn lại là giá trị suy ra: `Q-05` |
| N-19 | **Không làm** | Tách bảng theo chi nhánh |
| N-20 | **Chờ BA** | Sinh trắc học, trẻ em, vô thời hạn, xung đột `R-10`: `Q-06` |

## 1. Kiến trúc và nhóm bảng

19 bảng · 5 vùng cộng `organizations` làm tenant: **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`) · **Hồ sơ bệnh nhân** (`patient_allergies`, `patient_insurances`, `internal_notes`) · **Chuyên khoa** (`specialties`, `doctor_specialties`) · **Tiền** (`services`, `invoices`, `payments`).

*(v1.0 ghi "12 bảng" nhưng liệt kê 12 bảng không tính `organizations` — thực tế là 13.)*

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày (~730.000 dòng/năm) — chưa đo | 🔴 A — giả định, chưa xác nhận |
| ~~Q-02~~ | ~~Lịch hẹn kéo dài bao lâu?~~ | ✅ Đóng bởi N-02: mỗi lịch hẹn có `starts_at` + `ends_at`. Dữ liệu cũ: `Q-09` |
| Q-03 | Ca khám nhóm (N-16) trái `R-04` "đúng một bác sĩ" | mở — **chặn dựng bảng** |
| Q-04 | Phẫu thuật, phòng mổ (N-17) chưa có trong mô hình | mở — **chặn dựng bảng** |
| Q-05 | Gói trị liệu, số buổi còn lại (N-18) chưa có trong mô hình | mở — **chặn dựng bảng** |
| Q-06 | Ảnh khuôn mặt, trẻ em, vô thời hạn (N-20) | mở — **chặn dựng bảng** |
| Q-07 | Lưu mật khẩu đọc được (N-14) trái `R-09`; đề xuất đặt lại mật khẩu | mở — không làm, chờ xác nhận đề xuất |
| Q-08 | Vòng đời trạng thái lịch hẹn còn thiếu (N-09) | mở — 🔴 A: `arrived → done` |
| Q-09 | `ends_at` dữ liệu cũ; trạng thái nào nhả giờ (N-02) | mở — 🔴 A: +30 phút; `cancelled`, `no_show` nhả giờ |
| Q-10 | Chốt giá lúc nào; giá lịch sử dữ liệu cũ (N-01) | mở — 🔴 A: giá hiện hành |
| Q-11 | Đặt cọc: trừ hóa đơn, hoàn, doanh thu (N-05) | mở — 🔴 A: chỉ ghi nhận số tiền và ngày |
| Q-12 | Cấp lại mã hồ sơ đã ẩn (N-04) | mở — 🔴 A: unique bộ phận |
| Q-13 | Quan hệ bảo hộ có kết thúc, nhiều người (N-03) | mở — 🔴 A: chỉ `started_on` |

**Giả định nhỏ đã dùng, không hỏi riêng** (🔴 A, đổi được bằng một migration nhỏ): `N-07` tên chất nhập tự do, chưa có danh mục chất chuẩn · `N-15` cả ba trường thẻ bảo hiểm bắt buộc · `N-08` bớt chuyên khoa = `is_active = false` · `N-06` ghi chú không sửa, không xóa (chỉ `created_at`) · `N-05` ngày nhận cọc là `date` (một múi giờ vận hành).

## 3. Data Dictionary — các bảng cốt lõi

### 3.1 `people` — danh tính *(không đổi)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `full_name` | `varchar(160)` | No | | | Họ tên |
| `phone` | `varchar(20)` | Yes | | | Số điện thoại |
| `email` | `varchar(160)` | Yes | | | Email |
| `birth_date` | `date` | Yes | | | Ngày sinh |
| `deleted_at` | `timestamptz` | Yes | | | Xóa mềm |

### 3.2 `patients` — hồ sơ bệnh nhân *(đổi: N-04, N-13)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `person_id` | `uuid` | No | UNIQUE, FK 1-1 → people.id | | Danh tính. UNIQUE tính cả hồ sơ đã ẩn: người quay lại thì khôi phục hồ sơ cũ |
| **`record_code`** | `varchar(30)` | No | **UNIQUE bộ phận `(organization_id, record_code) WHERE deleted_at IS NULL`** | | **Mã hồ sơ.** Duy nhất trong tổ chức giữa các hồ sơ chưa ẩn; mã của hồ sơ đã ẩn được cấp lại |
| `created_at` | `timestamptz` | No | | `now()` | |
| `deleted_at` | `timestamptz` | Yes | | | Ẩn hồ sơ (N-13). Cùng giao dịch: hủy lịch hẹn tương lai. **Không xóa dòng** |

### 3.3 `appointments` — lịch hẹn *(đổi: N-02, N-05, N-09)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `clinic_id` | `uuid` | No | FK → clinics.id | | Phòng khám |
| `patient_id` | `uuid` | No | FK → patients.id, `ON DELETE RESTRICT` | | Bệnh nhân |
| `doctor_id` | `uuid` | No | FK → doctors.id; `EXCLUDE` chống trùng giờ | | Bác sĩ phụ trách (đúng một — R-04) |
| `starts_at` | `timestamptz` | No | | | Giờ bắt đầu |
| **`ends_at`** | `timestamptz` | No | `CHECK (ends_at > starts_at)` | | **Giờ kết thúc.** Khoảng `[starts_at, ends_at)` nửa mở |
| `status` | `appointment_status` | No | | `booked` | Trạng thái — xem 3.13 |
| **`deposit_amount`** | `numeric(12,2)` | Yes | `CHECK > 0`; cùng null với `deposit_received_on` | | **Tiền đặt cọc.** Null = không đặt cọc |
| **`deposit_received_on`** | `date` | Yes | | | **Ngày nhận cọc** |

Chỉ mục: `(organization_id, clinic_id, starts_at)` · `(patient_id, starts_at)` · gist của ràng buộc `ex_appointments_doctor_no_overlap` (mục 5).

### 3.4 `appointment_services` — dịch vụ của lịch hẹn *(đổi: N-01)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `appointment_id` | `uuid` | No | PK (cùng `service_id`), FK → appointments.id | | Lịch hẹn |
| `service_id` | `uuid` | No | PK, FK → services.id | | Dịch vụ |
| `quantity` | `smallint` | No | | `1` | Số lượng |
| **`unit_price`** | `numeric(12,2)` | No | | | **Giá một đơn vị tại thời điểm khám** — chép từ `services.price`, **không đổi theo bảng giá**. Dòng khóa từ khi có hóa đơn |

### 3.5 `services` — danh mục dịch vụ *(đổi: N-11)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| **`code`** | `varchar(40)` | No | **UNIQUE `(organization_id, code)`** | | **Mã dịch vụ**, ví dụ `KHAM-TQ`. Hai tổ chức dùng chung một mã được |
| `name` | `varchar(160)` | No | | | Tên |
| `price` | `numeric(12,2)` | No | | | Giá **hiện hành**; giá đã áp cho lần khám nằm ở `appointment_services.unit_price` |
| `is_active` | `boolean` | No | | `true` | Ngưng dịch vụ (không xóa nên unique đầy đủ là đủ) |

### 3.6 `invoices` — hóa đơn *(đổi: N-12)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `appointment_id` | `uuid` | No | **UNIQUE**, FK 1-1 → appointments.id, `ON DELETE RESTRICT` | | Lịch hẹn của hóa đơn. Mỗi lịch hẹn một hóa đơn (R-08); UNIQUE cũng là chỉ mục tra theo lịch hẹn |
| `issued_at` | `timestamptz` | No | | `now()` | Ngày lập |

### 3.7 `guardianships` — quan hệ bảo hộ *(mới: N-03)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `guardian_person_id` | `uuid` | No | FK → people.id; index | | Người bảo hộ — bất kỳ người nào (bác sĩ, nhân viên, người nhà) |
| `patient_id` | `uuid` | No | FK → patients.id | | Bệnh nhân được bảo hộ |
| `started_on` | `date` | No | UNIQUE `(patient_id, guardian_person_id, started_on)` | | Từ ngày nào |
| `created_at` | `timestamptz` | No | | `now()` | |

### 3.8 `patient_allergies` — dị ứng *(mới: N-07)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | FK → patients.id; UNIQUE `(patient_id, lower(substance_name))` | | Bệnh nhân |
| `substance_name` | `varchar(160)` | No | index `(organization_id, lower(substance_name))` | | Tên chất gây dị ứng — tra theo chất dùng chỉ mục này |
| `severity` | `allergy_severity` | No | | | `mild` nhẹ · `severe` nặng |
| `created_at` · `updated_at` | `timestamptz` | No | | `now()` | |

### 3.9 `patient_insurances` — hồ sơ bảo hiểm *(mới: N-15)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `patient_id` | `uuid` | No | **UNIQUE**, FK 1-1 → patients.id | | Tối đa một hồ sơ bảo hiểm mỗi bệnh nhân (quan hệ 0..1) |
| `card_number` | `varchar(40)` | No | | | Số thẻ |
| `insurer_name` | `varchar(160)` | No | | | Nhà bảo hiểm |
| `expires_on` | `date` | No | | | Hạn dùng |
| `created_at` · `updated_at` | `timestamptz` | No | | `now()` | |

### 3.10 `specialties` — chuyên khoa *(mới: N-08)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `name` | `varchar(120)` | No | UNIQUE `(organization_id, name)` | | Tên chuyên khoa |
| `is_active` | `boolean` | No | | `true` | Bớt chuyên khoa = `false` |
| `created_at` | `timestamptz` | No | | `now()` | |

### 3.11 `doctor_specialties` — bác sĩ ↔ chuyên khoa *(mới: N-08)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `doctor_id` | `uuid` | No | PK (cùng `specialty_id`), FK → doctors.id | | Bác sĩ |
| `specialty_id` | `uuid` | No | PK, FK → specialties.id; index | | Chuyên khoa |
| `created_at` | `timestamptz` | No | | `now()` | |

### 3.12 `internal_notes` — ghi chú nội bộ *(mới: N-06)*

| Cột | Kiểu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | Định danh |
| `organization_id` | `uuid` | No | FK → organizations.id | | Tenant |
| `appointment_id` | `uuid` | Yes | FK → appointments.id; index | | Đối tượng 1 |
| `patient_id` | `uuid` | Yes | FK → patients.id; index | | Đối tượng 2 |
| `invoice_id` | `uuid` | Yes | FK → invoices.id; index | | Đối tượng 3 |
| `body` | `text` | No | | | Nội dung |
| `created_by` | `uuid` | No | FK → users.id | | Người ghi |
| `created_at` | `timestamptz` | No | | `now()` | |

Ràng buộc: `CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)` — đúng một đối tượng.

### 3.13 `appointment_status` — vòng đời lịch hẹn *(đổi: N-09)*

| Giá trị | Nghĩa | Chuyển được sang | Nguồn |
| :--- | :--- | :--- | :--- |
| `booked` | Đã đặt | `confirmed`, `cancelled` | N-09 |
| `confirmed` | Đã xác nhận (**mới**) | `arrived`, `no_show` | N-09 |
| `arrived` | Đã đến (**mới**) | `done` | 🔴 A — N-09 không nói; `Q-08` |
| `no_show` | Vắng mặt (**mới**) | — | N-09 |
| `done` | Đã khám xong (giữ từ v1.0) | — | R-08, N-10; N-09 không nhắc — `Q-08` |
| `cancelled` | Đã hủy | — | N-09 |

Chuyển trạng thái do tầng ứng dụng kiểm. `confirmed → cancelled` N-09 **không** cho phép nhưng R-12 gợi ý cần — `Q-08`.

### 3.14 Các bảng còn lại

`organizations`, `clinics`, `doctors`, `users`, `rooms`, `doctor_schedules`, `payments` — không đổi cột; xem `schema.dbml`, mỗi bảng có `Note` ghi nguồn requirement. `payments.invoice_id` thêm `ON DELETE RESTRICT`.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | `Σ appointment_services.quantity × unit_price` của lịch hẹn | Tính từ **snapshot `unit_price`**, không từ `services.price`. *(v1.0 ghi "tránh lệch khi giá đổi" nhưng chưa có snapshot nên thực tế lệch — đã sửa, N-01.)* Dòng dịch vụ khóa từ khi có hóa đơn |
| Tổng số lần khám đã hoàn thành của bệnh nhân (N-10) | `COUNT(*)` `appointments` có `patient_id = ?` và `status = 'done'` | Bộ đếm lưu sẵn lệch khi lịch bị hủy/đổi trạng thái; một bệnh nhân chỉ vài trăm lịch nên đếm trực tiếp qua `(patient_id, starts_at)` đủ nhanh. Đổi thành `arrived` nếu `Q-08` quyết vậy |
| Số buổi trị liệu còn lại (N-18) | gói đã mua − buổi đã dùng | **Không có cột** trên `patients`; lưu sẵn sẽ lệch khi hủy/hoàn và ghi đè nhau khi hai lễ tân cùng trừ. Chờ `Q-05` |
| Hóa đơn của một bệnh nhân (N-12) | `appointments(patient_id, starts_at)` → `invoices.appointment_id` | Không chép `patient_id` vào `invoices` — hai nguồn sự thật cho một sự kiện |
| Chi nhánh của một lịch hẹn (N-19) | `appointments.clinic_id` | Không tách bảng theo chi nhánh |

## 5. Ràng buộc chỉ có trong migration (DBML không biểu diễn được)

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- N-02: một bác sĩ không có hai lịch hẹn trùng giờ
ALTER TABLE appointments ADD CONSTRAINT ck_appointments_time_order CHECK (ends_at > starts_at);
ALTER TABLE appointments ADD CONSTRAINT ex_appointments_doctor_no_overlap
  EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
  WHERE (status NOT IN ('cancelled', 'no_show'));

-- N-04: mã hồ sơ duy nhất trong tổ chức, chỉ giữa hồ sơ chưa ẩn
CREATE UNIQUE INDEX ux_patients_org_record_code_alive
  ON patients (organization_id, record_code) WHERE deleted_at IS NULL;

-- N-05: cọc cùng có hoặc cùng không
ALTER TABLE appointments ADD CONSTRAINT ck_appointments_deposit
  CHECK ((deposit_amount IS NULL AND deposit_received_on IS NULL)
      OR (deposit_amount > 0 AND deposit_received_on IS NOT NULL));

-- N-06: ghi chú gắn đúng một đối tượng
ALTER TABLE internal_notes ADD CONSTRAINT ck_internal_notes_one_target
  CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1);
```

## 6. Thứ tự migration cho dữ liệu hiện có

Bốn cột `NOT NULL` mới không có giá trị cho dòng cũ — thêm **nullable → điền → `SET NOT NULL`**:

| Cột | Điền bằng | Rủi ro |
|---|---|---|
| `appointments.ends_at` | `starts_at + 30 phút` (`Q-09`) | Giờ giả có thể tạo trùng giờ ảo. **Chạy truy vấn tìm cặp trùng trước khi thêm `EXCLUDE`**, nếu không migration thất bại |
| `appointment_services.unit_price` | `services.price` hiện hành (`Q-10`) | v1.0 không lưu lịch sử giá — hóa đơn cũ đã qua đổi giá sẽ in sai |
| `patients.record_code` | tuần tự theo `created_at` trong từng tổ chức (`Q-12`) | Client có thể đã có mã giấy |
| `services.code` | mã tạm `SV-<số thứ tự>` | Client sửa lại cho khớp quy ước (ví dụ `KHAM-TQ`) |

Thêm `invoices.appointment_id UNIQUE`: kiểm trước không có lịch hẹn nào đã có hai hóa đơn.
