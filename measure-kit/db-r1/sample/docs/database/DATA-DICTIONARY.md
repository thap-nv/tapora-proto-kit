# PHÒNG KHÁM ĐA KHOA CHUỖI — DATA DICTIONARY (v1.0)

> Từ điển dữ liệu của dự án mẫu. Nguồn máy đọc: `schema.dbml`.

## 0. Thay đổi so với bản trước

*(Bản đầu tiên — chưa có.)*

## 1. Kiến trúc và nhóm bảng

12 bảng · 3 vùng: **Danh tính** (`people`, `patients`, `doctors`, `users`) · **Lịch khám** (`clinics`, `rooms`, `doctor_schedules`, `appointments`, `appointment_services`) · **Tiền** (`services`, `invoices`, `payments`) · cộng `organizations` làm tenant.

## 2. Điểm mù cần chốt

| Mã | Câu hỏi | Trạng thái |
|---|---|---|
| Q-01 | Cỡ dữ liệu: 3 phòng khám, ~40 bác sĩ, ~2.000 lịch hẹn mỗi ngày — chưa đo | 🔴 A — giả định, chưa xác nhận |
| Q-02 | Lịch hẹn kéo dài bao lâu? Hiện chỉ có giờ bắt đầu | mở — chờ N-02 |

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
| Tổng tiền hóa đơn | cộng các dịch vụ của lịch hẹn | tránh lệch khi giá đổi |
