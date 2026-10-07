# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v2.0)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`. Cấu hình soát: `schema-lint.json`. Câu hỏi chờ BA: `CAU-HOI-BA.md`.
> v2.0 (07/10/2026) áp nhu cầu dữ liệu giai đoạn 2 `N-01` → `N-20`; xem `BAO-CAO-DO.md` cho từng mã.

## 0. Thay đổi so với bản trước

*(Khối dưới sinh từ `dbml_diff.py last-green.dbml schema.dbml` — không viết tay.)*

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **22 bảng · 126 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 9 | 0 | 0 |
| cột | 3 | 0 | 1 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 4 |
| index | 2 | 0 | 0 |

Phân loại: **phá vỡ 6** · **dữ liệu 3** · index 0 · cộng thêm 14 · ghi chú bảng đổi 6

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 6:
- index `services(organization_id, `lower(code)`)` thêm UNIQUE
- index `invoices(appointment_id)` thêm UNIQUE
- ref `patients(person_id) → people` hành vi xóa — → restrict
- ref `appointments(patient_id) → patients` hành vi xóa — → restrict
- ref `invoices(appointment_id) → appointments` hành vi xóa — → restrict
- ref `payments(invoice_id) → invoices` hành vi xóa — → restrict

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 3:
- cột `patients.patient_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (9): `invoice_lines`, `appointment_deposits`, `guardianships`, `internal_notes`, `allergens`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`

**Điều bộ so sánh không nói, cần biết khi viết migration (viết tay):**
1. Cần extension `btree_gist` trước khi tạo hai `EXCLUDE` (`appointments`, `guardianships`).
2. `patients.person_id` **mất** unique toàn bảng, thay bằng unique một phần `WHERE deleted_at IS NULL` (nới ràng buộc, không phá dữ liệu). Hai unique một phần của `patients` chỉ có trong `Note`, DBML không biểu diễn được.
3. Ba cột NOT NULL mới (`ends_at`, `patient_code`, `code`): thêm dạng NULL → backfill theo lô → `CHECK … NOT VALID` → `VALIDATE` → `SET NOT NULL` (DB-EVO-03, DB-EVO-08). Giá trị điền cho dữ liệu cũ còn phụ thuộc `Q-14` · `Q-12`.
4. Trước khi tạo ràng buộc: tìm lịch hẹn cũ của cùng bác sĩ chồng giờ (EXCLUDE sẽ thất bại), dịch vụ trùng mã không phân biệt hoa/thường, hóa đơn trùng `appointment_id`.
5. Hóa đơn đã phát hành trước v2.0 **không thể** có giá lúc đó (`N-01` chỉ đúng từ nay): backfill `invoice_lines` dùng giá hiện hành — rủi ro ghi ở `Q-15`.
6. Ba giá trị enum `appointment_status` thêm bằng `ALTER TYPE … ADD VALUE`; giá trị `done` giữ nguyên (`Q-09`).
7. Ba trigger chưa viết: chuyển trạng thái lịch hẹn, từ chối lịch cho hồ sơ đã ẩn, hủy lịch tương lai khi ẩn hồ sơ — mô tả ở `Note` của `appointments` và `patients`.

## 1. Kiến trúc và nhóm bảng

22 bảng · 5 vùng:
- **Danh tính** *(5)*: `people` · `patients` · `doctors` · `users` · `guardianships` — một người một dòng `people`, vai ở bảng riêng; bảo hộ là quan hệ người–bệnh nhân có hiệu lực theo ngày (`N-03`).
- **Hồ sơ lâm sàng và danh mục** *(5, mới)*: `allergens` · `patient_allergies` · `patient_insurances` · `specialties` · `doctor_specialties` (`N-07` `N-08` `N-15`).
- **Lịch khám** *(6)*: `clinics` · `rooms` · `doctor_schedules` · `appointments` · `appointment_services` · `internal_notes`.
- **Tiền** *(5)*: `services` · `invoices` · `invoice_lines` · `payments` · `appointment_deposits` — `invoice_lines` là snapshot giá (`N-01`); `payments` chỉ thêm (`R-08`).
- **Tenant** *(1)*: `organizations`.

Chuỗi sổ sách giữ khi ẩn bệnh nhân (`N-13`): `patients` ← `appointments` ← `invoices` ← `payments`, mọi khóa ngoại `delete: restrict`.

## 2. Điểm mù cần chốt

Chi tiết (nguồn, hệ quả, các hướng, câu hỏi có số) ở `CAU-HOI-BA.md`.

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? | ✅ đóng — `N-02` xác nhận lịch hẹn có giờ kết thúc (`appointments.ends_at`); phần còn lại chuyển sang `Q-14` |
| Q-03 | Ca khám nhóm nhiều bác sĩ (`N-16`) mâu thuẫn `R-04` "đúng một bác sĩ" | **CHẶN** — chưa dựng |
| Q-04 | Ca phẫu thuật, phòng mổ (`N-17`) — requirement chưa định nghĩa | **CHẶN** — chưa dựng |
| Q-05 | Gói trị liệu, số buổi còn lại (`N-18`) — chưa có thực thể; giá trị suy ra | **CHẶN** — chưa dựng |
| Q-06 | Ảnh khuôn mặt, trẻ em, vô thời hạn (`N-20`) — dữ liệu sinh trắc | **CHẶN** — chưa dựng |
| Q-07 | Ghi lại mật khẩu để đọc (`N-14`) — trái `R-09` | **CHẶN** — chưa dựng |
| Q-08 | Bảng lịch hẹn riêng từng chi nhánh (`N-19`) | không làm — chờ BA xác nhận |
| Q-09 | "Đã đến" có phải "đã khám xong"; mũi tên chuyển trạng thái thiếu (`N-09` `N-10`) | 🔴 A — giữ `done`, mở thêm hai mũi tên |
| Q-10 | Số phận khoản đặt cọc: trừ hóa đơn, hoàn, mất (`N-05`) | 🔴 A — chỉ ghi nhận khoản đã nhận |
| Q-11 | Giờ hủy, phí hủy, hủy do hệ thống (`R-12` `N-13`) | mở — chưa thêm cột |
| Q-12 | Mã hồ sơ cấp lại và đối chiếu kế toán (`N-04` × `N-13`) | 🔴 A — cấp lại, unique một phần |
| Q-13 | Hạn lưu dữ liệu cá nhân của hồ sơ đã ẩn | 🔴 A — giữ vô thời hạn tới khi có đáp án |
| Q-14 | Ai nhập `ends_at`; độ dài điền cho lịch cũ; `no_show` có nhả khung giờ | 🔴 A — `no_show`/`cancelled` nhả khung giờ |
| Q-15 | Hóa đơn phát hành rồi có sửa/hủy lập lại; giá lúc phát hành | 🔴 A — hóa đơn bất biến |
| Q-16 | Bảo hộ: ngày kết thúc, số người, loại quan hệ (`N-03`) | 🔴 A — `valid_to` NULL, nhiều người |
| Q-17 | Ghi chú nội bộ: sửa/xóa, phạm vi xem theo phòng khám (`N-06`) | 🔴 A — chỉ thêm |
| Q-18 | Dị ứng: ai thêm chất mới, "chưa hỏi" khác "không dị ứng", số mức (`N-07`) | 🔴 A — danh mục sẵn, hai mức |
| Q-19 | Bảo hiểm: đổi thẻ ghi đè hay giữ lịch sử, số thẻ duy nhất (`N-15`) | 🔴 A — ghi đè |

**Giả định nhỏ không đáng một câu hỏi riêng (🔴 A):** `N-08` — bớt chuyên khoa = tắt `specialties.is_active`, bác sĩ đã gắn vẫn giữ; `N-11` — mã dịch vụ so khớp không phân biệt hoa/thường, không áp định dạng; `N-12` — không chép `patient_id` vào hóa đơn, "hóa đơn theo bệnh nhân" đi qua `appointments(patient_id, starts_at)` (cần chứng minh bằng `EXPLAIN` khi có dữ liệu cỡ thật, DB-PERF-10).

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

Lịch hẹn khám. Mỗi lịch hẹn có đúng một bác sĩ phụ trách (R-04). Nguồn: R-03, R-04, N-02, N-09, N-10, N-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `clinic_id` | `uuid` | No | FK → clinics.id |  | — |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | — |
| `doctor_id` | `uuid` | No | FK → doctors.id |  | — |
| `starts_at` | `timestamptz` | No |  |  | — |
| `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc (N-02). Cách xác định khi đặt lịch và độ dài điền cho lịch cũ: Q-14. Lịch cũ: backfill rồi mới SET NOT NULL (DB-EVO-03) |
| `status` | `appointment_status` | No |  | `booked` | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Ràng buộc nhiều cột và trigger (chỉ có ở `Note`): `CHECK (ends_at > starts_at)` · `EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status IN ('booked','confirmed','arrived','done'))` · chỉ mục `(organization_id, clinic_id, starts_at)`, `(patient_id, starts_at)`.

Giá trị `status` (`appointment_status`): `booked` đã đặt · `confirmed` đã xác nhận · `arrived` đã đến · `done` đã khám xong · `no_show` vắng mặt · `cancelled` đã hủy. Chuyển hợp lệ: `booked → confirmed | cancelled` · `confirmed → arrived | no_show | cancelled`* · `arrived → done`* · còn lại là trạng thái cuối. (*) giả định 🔴 A ngoài danh sách của `N-09` — `Q-09`.

### 3.3 `patients` — hồ sơ bệnh nhân

Hồ sơ bệnh nhân. Một người tối đa một hồ sơ bệnh nhân. Nguồn: R-02, R-03, N-04, N-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `person_id` | `uuid` | No | FK → people.id xóa:restrict |  | — |
| `patient_code` | `text` | No | CHECK char_length(patient_code) between 1 and 30 |  | Mã hồ sơ in trên giấy tờ. Duy nhất trong tổ chức CHỈ giữa các hồ sơ chưa ẩn (N-04). Cách sinh mã: ứng dụng. Hồ sơ cũ: backfill trước khi SET NOT NULL |
| `created_at` | `timestamptz` | No |  | `now()` | — |
| `deleted_at` | `timestamptz` | Yes |  |  | Ẩn hồ sơ (N-04, N-13). Không bao giờ xóa cứng hồ sơ có hóa đơn |

Unique một phần (chỉ có ở `Note`): `(organization_id, patient_code) WHERE deleted_at IS NULL` · `(person_id) WHERE deleted_at IS NULL`.

### 3.4 `services` — danh mục dịch vụ

Danh mục dịch vụ và giá hiện hành. Nguồn: R-07, N-11.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `code` | `text` | No | CHECK char_length(code) between 1 and 40 |  | Mã dịch vụ, ví dụ KHAM-TQ (N-11). Duy nhất trong tổ chức, không phân biệt hoa/thường. Dịch vụ cũ: backfill trước khi SET NOT NULL |
| `name` | `varchar(160)` | No |  |  | — |
| `price` | `numeric(12,2)` | No |  |  | — |
| `is_active` | `boolean` | No |  | `true` | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Unique: `(organization_id, lower(code))` — truy vấn tra theo mã phải dùng đúng biểu thức `lower(code)`. `price` là giá hiện hành, được ghi đè; hóa đơn không đọc giá từ đây.

### 3.5 `invoices` — hóa đơn

Hóa đơn của một lịch hẹn. Nguồn: R-08, N-01, N-12, N-13.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id |  | — |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict |  | — |
| `issued_at` | `timestamptz` | No |  | `now()` | — |

Unique: `(appointment_id)` — một lịch hẹn một hóa đơn (🔴 A, `Q-15`); đây cũng là chỉ mục của "hóa đơn theo lịch hẹn" (`N-12`).

### 3.6 `invoice_lines` — dòng hóa đơn, snapshot giá

Dòng hóa đơn: dịch vụ + số lượng + đơn giá tại thời điểm phát hành. Nguồn: N-01, R-07, R-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `invoice_id` | `uuid` | No | FK → invoices.id xóa:restrict |  | — |
| `service_id` | `uuid` | No | FK → services.id xóa:restrict |  | — |
| `quantity` | `smallint` | No | CHECK quantity > 0 |  | — |
| `unit_price` | `numeric(12,2)` | No | CHECK unit_price >= 0 |  | Giá chép từ services.price lúc phát hành hóa đơn — snapshot, không đổi theo bảng giá (N-01) |

Khóa chính ghép `(invoice_id, service_id)`; chỉ mục `(service_id)`.

### 3.7 `appointment_deposits` — đặt cọc

Khoản đặt cọc bằng tiền của một lịch hẹn: tối đa một khoản (N-05 "một khoản đặt cọc"), nên unique theo lịch hẹn. Nguồn: N-05.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict |  | — |
| `amount` | `numeric(12,2)` | No | CHECK amount > 0 |  | — |
| `received_on` | `date` | No |  |  | Ngày nhận cọc (N-05) |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Unique `(appointment_id)`. Chưa có trạng thái và chưa nối `payments` — `Q-10`.

### 3.8 `guardianships` — bảo hộ

Quan hệ bảo hộ giữa một người (people) và một bệnh nhân. Nguồn: N-03, R-02.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ — bất kỳ ai trong people (lễ tân, bác sĩ, người ngoài), không cần có vai |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | Bệnh nhân được bảo hộ |
| `valid_from` | `date` | No |  |  | Bảo hộ từ ngày (N-03) |
| `valid_to` | `date` | Yes |  |  | Ngày kết thúc bảo hộ; NULL = còn hiệu lực. 🔴 A — Q-16: N-03 chỉ nói "từ ngày nào" |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Chỉ có ở `Note`: `CHECK (valid_to IS NULL OR valid_to > valid_from)` · `EXCLUDE USING gist (patient_id WITH =, guardian_person_id WITH =, daterange(valid_from, valid_to) WITH &&)`. Chỉ mục `(patient_id, valid_from)`, `(guardian_person_id)`.

### 3.9 `internal_notes` — ghi chú nội bộ

Ghi chú nội bộ gắn vào MỘT trong ba thứ: lịch hẹn, bệnh nhân hoặc hóa đơn. Nguồn: N-06.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:cascade |  | — |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:cascade |  | — |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:cascade |  | — |
| `body` | `text` | No |  |  | NHẠY CẢM (có thể chứa thông tin sức khỏe) — DB-SEC-01 |
| `created_by` | `uuid` | No | FK → users.id xóa:restrict |  | Tài khoản nhân viên viết ghi chú |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Chỉ có ở `Note`: `CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)`. Chỉ mục `(appointment_id)`, `(patient_id, created_at)`, `(invoice_id)`.

### 3.10 `allergens` — danh mục chất gây dị ứng

Danh mục chất gây dị ứng của tổ chức. Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `name` | `varchar(160)` | No |  |  | Tên chất gây dị ứng, ví dụ Penicillin |
| `is_active` | `boolean` | No |  | `true` | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Unique `(organization_id, lower(name))`.

### 3.11 `patient_allergies` — dị ứng của bệnh nhân

Dị ứng của bệnh nhân: nhiều chất mỗi bệnh nhân, mỗi chất một mức. Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade |  | — |
| `allergen_id` | `uuid` | No | FK → allergens.id xóa:restrict |  | — |
| `severity` | `allergy_severity` | No |  |  | — |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Khóa chính ghép `(patient_id, allergen_id)`; chỉ mục `(allergen_id, patient_id)` trả lời "tra bệnh nhân theo chất". `allergy_severity`: `mild` nhẹ · `severe` nặng.

### 3.12 `specialties` — chuyên khoa

Danh mục chuyên khoa, quản trị viên tự thêm/bớt trên màn hình quản trị. Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa do quản trị viên nhập |
| `is_active` | `boolean` | No |  | `true` | Bớt chuyên khoa = tắt, không xóa: bác sĩ đã gắn vẫn giữ lịch sử (🔴 A) |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Unique `(organization_id, lower(name))`.

### 3.13 `doctor_specialties` — bác sĩ thuộc chuyên khoa

Bác sĩ thuộc nhiều chuyên khoa (nhiều–nhiều qua bảng nối). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:cascade |  | — |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | — |

Khóa chính ghép `(doctor_id, specialty_id)`; chỉ mục `(specialty_id, doctor_id)`.

### 3.14 `patient_insurances` — bảo hiểm

Hồ sơ bảo hiểm của bệnh nhân: tối đa một (N-15) nên unique theo bệnh nhân. Nguồn: N-15.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | — |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | — |
| `patient_id` | `uuid` | No | FK → patients.id xóa:cascade |  | — |
| `card_number` | `text` | No |  |  | Số thẻ bảo hiểm y tế — CÁ NHÂN/NHẠY CẢM (DB-SEC-01); KHÔNG phải thẻ thanh toán |
| `insurer_name` | `text` | No |  |  | Nhà bảo hiểm — chữ tự do (🔴 A, Q-19) |
| `expires_on` | `date` | No |  |  | Hạn dùng của thẻ |
| `created_at` | `timestamptz` | No |  | `now()` | — |

Unique `(patient_id)`.

### 3.15 Các bảng còn lại

`organizations` · `clinics` · `doctors` · `users` · `rooms` · `doctor_schedules` · `appointment_services` · `payments` — không đổi cấu trúc ở v2.0 (trừ khóa ngoại `payments.invoice_id` nay khai `delete: restrict`). Xem `schema.dbml` — mỗi bảng có `Note` ghi nguồn requirement.

## 4. Giá trị suy ra (cố ý không lưu)

| Giá trị | Tính từ | Lý do |
|---|---|---|
| Tổng tiền hóa đơn | `SUM(invoice_lines.quantity * invoice_lines.unit_price)` | không lưu để khỏi lệch với dòng hóa đơn. Từ v2.0 *không* tính từ `services.price` — giá đã chốt ở `invoice_lines.unit_price` (`N-01`) |
| Số lần khám đã hoàn thành của bệnh nhân (`N-10`) | `COUNT(*)` ở `appointments` với `patient_id = ?` và `status = 'done'` | mỗi bệnh nhân vài chục lịch hẹn, đã có chỉ mục `(patient_id, starts_at)`; một bộ đếm trên `patients` sẽ lệch khi lịch bị hủy/đổi trạng thái (DB-REQ-06). Phụ thuộc `Q-09` |
| Số buổi điều trị còn lại của gói (`N-18`) | *(chưa dựng)* — số đã mua trừ số đã dùng | không thêm cột `sessions_remaining` vào `patients`; chờ `Q-05` |
| Hóa đơn của một bệnh nhân (`N-12`) | `appointments(patient_id)` → `invoices(appointment_id)` | không chép `patient_id` vào `invoices` (DB-REQ-04) cho tới khi `EXPLAIN` trên dữ liệu cỡ thật chứng minh cần |

## 5. Ma trận cưỡng chế rule (DB-INT-15)

| Rule | Cơ chế | Lý do | Rủi ro còn lại |
|---|---|---|---|
| Một bác sĩ không có hai lịch trùng giờ (`N-02`) | constraint `EXCLUDE` trên `appointments` | hai lễ tân có thể đặt cùng lúc; kiểm ở ứng dụng sẽ lọt | đổi nếu `Q-03` cho nhiều bác sĩ một lịch hẹn; `no_show`/`cancelled` nhả khung giờ (🔴 A) |
| `ends_at > starts_at` (`N-02`) | constraint `CHECK` | — | — |
| Chuyển trạng thái lịch hẹn hợp lệ (`N-09`) | trigger `BEFORE UPDATE OF status` | cần so trạng thái cũ và mới, constraint không biểu diễn được (DB-INT-16) | ma trận có hai mũi tên giả định (`Q-09`); chưa có lịch sử đổi trạng thái |
| Hồ sơ ẩn thì lịch tương lai tự hủy (`N-13`) | trigger `AFTER UPDATE OF deleted_at` trên `patients` | bất biến nằm ở hai bảng | phí hủy chưa xác định (`Q-11`); cọc chưa có đường hoàn (`Q-10`) |
| Không đặt lịch cho hồ sơ đã ẩn (`N-13`) | trigger `BEFORE INSERT` trên `appointments`, đọc `patients` bằng `FOR SHARE` | ẩn hồ sơ chạy đồng thời với đặt lịch có thể lọt | — |
| Hóa đơn, thanh toán còn khi ẩn hồ sơ (`N-13`) | khóa ngoại `delete: restrict` dọc `patients ← appointments ← invoices ← payments`; hồ sơ chỉ ẩn, không xóa cứng | — | xóa thật dữ liệu cá nhân chưa có hạn lưu (`Q-13`) |
| Mã hồ sơ duy nhất trong tổ chức, mã của hồ sơ ẩn cấp lại được (`N-04`) | unique một phần `WHERE deleted_at IS NULL` | tái dùng mã đòi unique không tính hồ sơ đã ẩn (DB-IDX-12) | mã trùng trong sổ sách cũ (`Q-12`) |
| Mã dịch vụ duy nhất trong tổ chức (`N-11`) | unique biểu thức `(organization_id, lower(code))` | hai tổ chức dùng cùng mã được; không phân biệt hoa/thường | — |
| Hóa đơn in đúng giá lúc khám (`N-01`) | cột snapshot `invoice_lines.unit_price` + vai ứng dụng chỉ `INSERT`/`SELECT` trên `invoice_lines` và `payments` | giá chép một lần, bất biến (DB-MOD-08, DB-MOD-11) | hóa đơn cũ trước v2.0 không có giá lúc đó (`Q-15`); quyền cấp ở tầng hạ tầng, chưa viết |
| Một lịch hẹn một hóa đơn (`R-08`) | unique `invoices(appointment_id)` | — | nếu cần lập lại hóa đơn (`Q-15`) |
| Tối đa một cọc mỗi lịch hẹn (`N-05`) · một bảo hiểm mỗi bệnh nhân (`N-15`) | unique `(appointment_id)` · unique `(patient_id)` | bản số theo yêu cầu | nới được bằng bỏ unique |
| Ghi chú gắn đúng một đối tượng (`N-06`) | `CHECK (num_nonnulls(…) = 1)` thay cho cặp loại+id (DB-MOD-06) | khóa ngoại thật, không polymorphic | — |
| Không trùng khoảng bảo hộ của cùng một cặp (`N-03`) | constraint `EXCLUDE` trên `guardianships` | — | — |
| Người bảo hộ khác chính bệnh nhân (`N-03`) | **cố ý không giữ ở CSDL** — kiểm ở ứng dụng | cần JOIN sang `patients.person_id`; rủi ro thấp | một người tự bảo hộ chính mình nếu ứng dụng quên kiểm |
| Mỗi chất dị ứng một dòng cho một bệnh nhân (`N-07`) | khóa chính `(patient_id, allergen_id)` | — | — |

## 6. Phân loại dữ liệu cột mới (DB-SEC-01)

| Cột | Mức | Ghi chú |
|---|---|---|
| `patient_allergies.*` · `internal_notes.body` | nhạy cảm — sức khỏe | quyền xem riêng, ghi log truy cập (DB-SEC-05) — chưa có chính sách, thuộc `Q-17` |
| `patient_insurances.card_number` · `insurer_name` · `expires_on` | cá nhân, nhạy cảm | số thẻ phải đọc lại được nên không băm; bảo vệ bằng quyền + mã hóa lúc nghỉ (miễn trừ `DB-SEC-04` có lý do trong `schema-lint.json`) |
| `guardianships.*` | cá nhân — liên quan trẻ em | — |
| `patients.patient_code` | cá nhân — định danh | in trên giấy tờ |
| `appointment_deposits.amount` · `invoice_lines.unit_price` | tài chính nội bộ | tiền chỉ thêm (DB-MOD-11) |

## 7. Nhu cầu chưa vào schema

`N-14` (ghi lại mật khẩu) → `Q-07` · `N-16` (nhiều bác sĩ một lịch) → `Q-03` · `N-17` (ca phẫu thuật) → `Q-04` · `N-18` (số buổi còn lại của gói) → `Q-05` · `N-19` (bảng lịch hẹn theo chi nhánh) → `Q-08` · `N-20` (ảnh khuôn mặt) → `Q-06`. Không có bảng hay cột nào được dựng sẵn cho các mã này.
