# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.1)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`.

## 0. Thay đổi so với bản trước

<!-- db-schema-design:changes:start -->
> Khối này do `dict_update.py` sinh từ DBML — đừng sửa tay, chạy lại lệnh khi schema đổi. Lập luận và quyết định viết ngoài khối; số bảng/cột lấy ở dòng đếm dưới đây, không gõ lại ở phần viết tay.

**Thay đổi so với bản trước** (last-green.dbml → schema.dbml)

13 bảng · 72 cột · 3 enum → **23 bảng · 136 cột · 4 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 10 | 0 | 0 |
| cột | 3 | 0 | 0 |
| enum | 1 | 0 | 0 |
| giá trị enum | 3 | 0 | 0 |
| ref | 0 | 0 | 1 |
| index | 2 | 0 | 0 |

Phân loại: **phá vỡ 3** · **dữ liệu 3** · index 0 · cộng thêm 14 · ghi chú bảng đổi 7

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 3:
- index `services(organization_id, code)` thêm UNIQUE
- index `invoices(appointment_id)` thêm UNIQUE
- ref `invoices(appointment_id) → appointments` hành vi xóa — → restrict

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 3:
- cột `patients.record_code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `services.code` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `appointments.ends_at` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước

Bảng mới (10): `invoice_lines`, `guardianships`, `appointment_deposits`, `internal_notes`, `allergens`, `patient_allergies`, `specialties`, `doctor_specialties`, `patient_insurances`, `password_reset_tokens`

### Enum thêm hay thêm giá trị

- enum mới `allergy_severity`: `mild`, `severe`
- `appointment_status` thêm giá trị `arrived`
- `appointment_status` thêm giá trị `confirmed`
- `appointment_status` thêm giá trị `no_show`

## Bảng mới (10)

### `invoice_lines`

Dòng chi tiết hóa đơn, mỗi dịch vụ một dòng (khóa chính ghép, không cần id riêng). Giá lấy từ dòng này, không lấy từ services. Hạn lưu: cùng hóa đơn, tức chứng từ kế toán, không xóa (số năm chưa chốt…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `invoice_id` | `uuid` | No | FK → invoices.id xóa:restrict |  | khóa ngoại tới `invoices` |
| `service_id` | `uuid` | No | FK → services.id xóa:restrict |  | khóa ngoại tới `services` |
| `quantity` | `smallint` | No | CHECK quantity > 0 | `1` | Số lượng, chép từ appointment_services lúc phát hành hóa đơn. |
| `unit_price` | `numeric(12,2)` | No | CHECK unit_price >= 0 |  | Đơn giá chép (snapshot) từ services.price tại thời điểm phát hành hóa đơn; đổi bảng giá sau đó không làm đổi dòng này (N-01). Không sửa sau khi hóa đơn đã phát hành. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `guardianships`

Quan hệ bảo hộ giữa hai người, có ngày bắt đầu và kết thúc. Ràng buộc: CHECK (guardian_person_id <> ward_person_id). Phân loại: dữ liệu cá nhân, liên quan người nhỏ tuổi; chỉ vai xem được hồ sơ bệnh …

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `guardian_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người bảo hộ (people.id). Có thể là bác sĩ, lễ tân, hay bất kỳ ai; không cần là bệnh nhân. |
| `ward_person_id` | `uuid` | No | FK → people.id xóa:restrict |  | Người được bảo hộ (people.id), thường là bệnh nhân nhỏ tuổi. Không cưỡng chế tuổi hay phải là bệnh nhân (Q-15). |
| `started_on` | `date` | No |  |  | Ngày quan hệ bảo hộ bắt đầu (N-03: từ ngày nào). |
| `ended_on` | `date` | Yes |  |  | Ngày kết thúc bảo hộ; rỗng = còn hiệu lực. CHECK (ended_on IS NULL OR ended_on >= started_on). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `appointment_deposits`

Khoản đặt cọc của một lịch hẹn. Chỉ ghi nhận đã nhận; trừ cọc vào hóa đơn, hoàn hay giữ cọc chưa dựng, chờ chốt (Q-13); khi dựng, hoàn cọc là dòng mới mang số âm, không sửa số tiền cũ. Phân loại: dữ …

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | No | FK → appointments.id xóa:restrict, UNIQUE |  | Lịch hẹn nhận cọc; mỗi lịch hẹn tối đa một khoản cọc (N-05). |
| `amount` | `numeric(12,2)` | No | CHECK amount > 0 |  | Số tiền đặt cọc. |
| `received_on` | `date` | No |  |  | Ngày nhận cọc (N-05). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `internal_notes`

Ghi chú nội bộ của nhân viên, gắn đúng một đối tượng: lịch hẹn, bệnh nhân hoặc hóa đơn (N-06). Không dùng cặp *_type + *_id.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `appointment_id` | `uuid` | Yes | FK → appointments.id xóa:restrict |  | Ghi chú gắn lịch hẹn; đúng một trong ba cột appointment_id, patient_id, invoice_id có giá trị. |
| `patient_id` | `uuid` | Yes | FK → patients.id xóa:restrict |  | Ghi chú gắn bệnh nhân. |
| `invoice_id` | `uuid` | Yes | FK → invoices.id xóa:restrict |  | Ghi chú gắn hóa đơn. |
| `author_user_id` | `uuid` | No | FK → users.id xóa:restrict |  | Tài khoản nhân viên viết ghi chú. |
| `body` | `text` | No |  |  | Nội dung ghi chú nội bộ. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `allergens`

Danh mục chất gây dị ứng theo tổ chức, để tra bệnh nhân theo chất không sót vì chính tả (N-07, Q-18). Nguồn: N-07.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chất gây dị ứng, duy nhất trong tổ chức không phân biệt hoa thường. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_allergies`

Dị ứng của bệnh nhân, nhiều dòng cho một bệnh nhân. Index (allergen_id, patient_id) cho chiều tra ngược: bệnh nhân nào dị ứng chất này. Phân loại: dữ liệu sức khỏe (nhạy cảm), giữ cùng vòng đời hồ sơ…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict |  | khóa ngoại tới `patients` |
| `allergen_id` | `uuid` | No | FK → allergens.id xóa:restrict |  | khóa ngoại tới `allergens` |
| `severity` | `allergy_severity` | No |  |  | Mức độ: nhẹ (mild) hoặc nặng (severe) theo N-07. Chưa có mức trung bình (Q-18). |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `specialties`

Danh mục chuyên khoa do quản trị viên thêm hoặc bớt trên màn hình quản trị, là dòng dữ liệu, không phải enum (N-08). Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `name` | `varchar(120)` | No |  |  | Tên chuyên khoa, duy nhất trong tổ chức không phân biệt hoa thường. |
| `is_active` | `boolean` | No |  | `true` | Quản trị viên bớt chuyên khoa = đặt false; giữ dòng để bác sĩ cũ còn tham chiếu được. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `doctor_specialties`

Bảng nối bác sĩ với chuyên khoa: một bác sĩ nhiều chuyên khoa, một chuyên khoa nhiều bác sĩ. Nguồn: N-08.

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `doctor_id` | `uuid` | No | FK → doctors.id xóa:restrict |  | khóa ngoại tới `doctors` |
| `specialty_id` | `uuid` | No | FK → specialties.id xóa:restrict |  | khóa ngoại tới `specialties` |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

### `patient_insurances`

Hồ sơ bảo hiểm của bệnh nhân, quan hệ 1–1 tùy chọn. Gia hạn thì sửa tại chỗ, không giữ lịch sử thẻ cũ (Q-16). Phân loại: dữ liệu cá nhân (số thẻ); chỉ vai xem được hồ sơ bệnh nhân mới xem. Nguồn: N-1…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `patient_id` | `uuid` | No | FK → patients.id xóa:restrict, UNIQUE |  | Mỗi bệnh nhân tối đa một hồ sơ bảo hiểm (N-15). |
| `card_number` | `varchar(40)` | No |  |  | Số thẻ bảo hiểm. Dữ liệu cá nhân, chỉ vai xem được hồ sơ bệnh nhân mới xem. |
| `insurer_name` | `varchar(160)` | No |  |  | Nhà bảo hiểm, chuỗi tự do (Q-16). |
| `expires_on` | `date` | No |  |  | Hạn dùng thẻ. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |
| `updated_at` | `timestamptz` | No |  | `now()` | thời điểm sửa gần nhất |

### `password_reset_tokens`

Liên kết đặt lại mật khẩu dùng một lần, thay cho việc lưu mật khẩu đọc được (N-14, Q-07). Quản trị viên phát liên kết cho bác sĩ quên mật khẩu. Dọn dòng đã hết hạn định kỳ. Phân loại: bí mật xác thực…

| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | PK | `gen_random_uuid()` | định danh |
| `organization_id` | `uuid` | No | FK → organizations.id xóa:restrict |  | khóa phạm vi (tenant) |
| `user_id` | `uuid` | No | FK → users.id xóa:restrict |  | khóa ngoại tới `users` |
| `token_hash` | `varchar(128)` | No | UNIQUE |  | Bản băm của mã đặt lại gửi qua liên kết; không lưu mã gốc. Tra theo liên kết khi chưa biết tổ chức nên unique toàn cục. |
| `expires_at` | `timestamptz` | No |  |  | Hết hạn của liên kết. |
| `used_at` | `timestamptz` | Yes |  |  | Rỗng = chưa dùng; có giá trị = liên kết đã dùng một lần. |
| `created_at` | `timestamptz` | No |  | `now()` | thời điểm tạo dòng |

## Cột mới trên bảng đã có (3)

> Cột mới của bảng cũ chỉ cần ở đây — không phải thêm vào bảng cột viết tay của bảng đó.

| Bảng | Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | `record_code` | `varchar(30)` | No |  |  | Mã hồ sơ bệnh nhân, duy nhất trong tổ chức trong số hồ sơ chưa ẩn; mã của hồ sơ đã ẩn được cấp lại (N-04). Ứng dụng cấp mã; dữ liệu cũ được cấp mã khi chuyển (Q-12). |
| `services` | `code` | `varchar(40)` | No |  |  | Mã dịch vụ, ví dụ KHAM-TQ; duy nhất trong tổ chức, hai tổ chức dùng trùng mã được (N-11). So sánh phân biệt hoa thường, ứng dụng chuẩn hóa in hoa (Q-12). |
| `appointments` | `ends_at` | `timestamptz` | No |  |  | Giờ kết thúc lịch hẹn (N-02). Một bác sĩ không có hai lịch hẹn (chưa hủy) trùng khoảng starts_at đến ends_at. Lịch hẹn cũ được điền theo thời lượng mặc định do BA chốt (Q-10). |

<!-- db-schema-design:changes:end -->

### 0b. Ràng buộc và quy tắc của v1.1 nằm trong `Note` (máy không sinh)

| Nhu cầu | Ràng buộc / quy tắc | Chỗ ghi |
| :--- | :--- | :--- |
| N-02 | `CHECK (ends_at > starts_at)` và `EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'cancelled')` — cần extension `btree_gist`; chuyển dữ liệu cũ theo thứ tự thêm cột rỗng được, điền, rà trùng, `SET NOT NULL`, thêm ràng buộc | Note `appointments` |
| N-04 | `CREATE UNIQUE INDEX patients_org_record_code_uq ON patients (organization_id, record_code) WHERE deleted_at IS NULL` — hồ sơ đã ẩn nhả mã | Note `patients` |
| N-09 | Máy chuyển trạng thái: `booked → confirmed \| cancelled` · `confirmed → arrived \| no_show` · `arrived → done` (🔴 A) · `done`, `cancelled`, `no_show` là cuối; cưỡng chế ở ứng dụng hoặc trigger | Note `appointments` |
| N-06 | `CHECK (num_nonnulls(appointment_id, patient_id, invoice_id) = 1)` — đúng một đối tượng được gắn | Note `internal_notes` |
| N-03 | `CHECK (guardian_person_id <> ward_person_id)`, `CHECK (ended_on IS NULL OR ended_on >= started_on)` | Note và cột `guardianships` |
| N-13 | Ẩn bệnh nhân = `patients.deleted_at`; mọi khóa ngoại mới tới `patients`, `appointments`, `invoices` là `restrict`; lịch hẹn tương lai chuyển `cancelled` ở ứng dụng (Q-14) | Note `patients` |
| N-14 | Không có cột lưu mật khẩu đọc được; quên mật khẩu đặt lại bằng liên kết một lần (`password_reset_tokens`, chỉ lưu bản băm) | Note `users`, `password_reset_tokens` |

Câu còn treo và giả định 🔴 A của lượt này: `CAU-HOI-BA.md` (Q-03 → Q-18). Bốn nhu cầu chờ BA chưa có bảng: N-16 (Q-03) · N-17 (Q-04) · N-18 (Q-05) · N-20 (Q-06).

## 1. Kiến trúc và nhóm bảng

3 vùng cộng tenant: **Danh tính** (`people`, `patients`, `doctors`, `users`, `guardianships`, `patient_allergies`, `allergens`, `patient_insurances`, `password_reset_tokens`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`, `specialties`, `doctor_specialties`, `internal_notes`) · **Tiền** (`services`, `invoices`, `invoice_lines`, `payments`, `appointment_deposits`) · cộng `organizations` làm tenant. Số bảng, cột lấy ở dòng đếm của mục 0.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | ✅ đóng ở v1.1: N-02 thêm `appointments.ends_at`; cách điền dữ liệu cũ hỏi ở Q-10 |
| Q-03 → Q-18 | Câu hỏi của lượt v1.1 (N-01 → N-20): Q-03 → Q-06 **CHẶN** (N-16, N-17, N-18, N-20), Q-07 → Q-18 không chặn | chờ BA — xem `CAU-HOI-BA.md` |

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
| Tổng tiền hóa đơn | cộng `quantity x unit_price` của `invoice_lines` (giá đã chép lúc phát hành, N-01) | tránh lệch; không tính từ `services.price` vì giá hiện hành đổi theo bảng giá |
| Số lần khám đã hoàn thành của bệnh nhân (N-10) | đếm `appointments` có `status = done` của bệnh nhân, qua index `(patient_id, starts_at)` | một bản lưu sẽ lệch khi lịch hẹn bị hủy hay sửa trạng thái |
| Số đã thanh toán, số còn nợ của hóa đơn | cộng `payments.amount` (kể cả dòng hoàn tiền âm) | hoàn tiền là dòng mới, không sửa số cũ (R-08) |
| Số buổi điều trị còn lại (N-18) | chưa tính được: chưa có thực thể gói trị liệu | chờ Q-05; mặc định tính ra, không lưu |
