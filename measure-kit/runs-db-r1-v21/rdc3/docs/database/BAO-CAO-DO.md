# BÁO CÁO ĐO — áp N-01 → N-20 vào schema (v1.0 → v1.1)

Skill: `requirements-to-erd` (bản cũ, 4 bước). Bỏ Bước 4 (không có `schema.html`) và không gọi subagent soát, theo yêu cầu của lần đo. BA vắng mặt: chỗ cần hỏi ghi ở `CAU-HOI-BA.md` (Q-03 → Q-15), đi tiếp bằng giả định, **không dựng bảng cho câu chưa có đáp án**.

## Từng nhu cầu

| Mã | Kết quả |
|---|---|
| N-01 | đã áp: `appointment_services.unit_price` (NOT NULL, giá chốt sao từ `services.price`). Tổng hóa đơn vẫn là giá trị suy ra. Thời điểm chốt và hóa đơn cũ: hỏi Q-03 |
| N-02 | đã áp: `appointments.ends_at` (NOT NULL) + `CHECK (ends_at > starts_at)` + `EXCLUDE USING gist (doctor_id, tstzrange(starts_at, ends_at, '[)')) WHERE status <> 'cancelled'` (SQL trong Note, DBML không viết được). Độ dài lịch cũ và lịch vắng mặt có nhả giờ: hỏi Q-04 |
| N-03 | đã áp: bảng `guardianships` (`guardian_person_id` → `people.id`, `patient_id` → `patients.id`, `started_on`). Một người nhiều vai đã được `people` phủ từ v1.0. Ngày kết thúc bảo hộ: hỏi Q-05 |
| N-04 | đã áp: `patients.patient_code` (NOT NULL) + chỉ mục duy nhất **một phần** `(organization_id, patient_code) WHERE deleted_at IS NULL` (SQL trong Note) để mã hồ sơ ẩn được cấp lại. Cách cấp mã và khôi phục hồ sơ ẩn: hỏi Q-06 |
| N-05 | đã áp: `appointments.deposit_amount` + `appointments.deposit_received_on` (nullable, CHECK cùng null và số tiền > 0). Hoàn, trừ, mất cọc: hỏi Q-07 |
| N-06 | đã áp: bảng `internal_notes` — ba khóa ngoại thật `appointment_id` / `patient_id` / `invoice_id` + `CHECK (num_nonnulls(...) = 1)`; `body`, `created_by` → `users.id` |
| N-07 | đã áp: `allergens` (danh mục, duy nhất `(organization_id, lower(name))`) + `patient_allergies` (PK `(patient_id, allergen_id)`, `severity` enum `allergy_severity` `mild`/`severe`, chỉ mục ngược `(allergen_id, patient_id)` để tra theo chất) |
| N-08 | đã áp: `specialties` (bảng dữ liệu, `is_active`, không phải enum) + `doctor_specialties` (N-N, PK `(doctor_id, specialty_id)`, chỉ mục ngược) |
| N-09 | đã áp: enum `appointment_status` thêm `confirmed` `arrived` `no_show`, **giữ `done`**. Các cạnh chuyển đã chốt ghi ở Note, **chưa cưỡng chế ở CSDL**. `arrived` so với `done`, hủy từ `confirmed` (R-12): hỏi Q-08 |
| N-10 | đã áp: giá trị suy ra, **không thêm cột** — `COUNT(appointments WHERE patient_id = … AND status = 'done')`, ghi ở Note `patients` và mục 4 từ điển. Đếm trạng thái nào phụ thuộc Q-08 |
| N-11 | đã áp: `services.code` (NOT NULL) + duy nhất `(organization_id, code)` (`uq_services_org_code`). Mã cho dịch vụ hiện có: hỏi Q-09 |
| N-12 | đã áp: `invoices.appointment_id` thêm `unique` (R-08 một lịch hẹn một hóa đơn; chỉ mục tra theo lịch hẹn). Tra theo bệnh nhân đi qua `appointments (patient_id, starts_at)` rồi chỉ mục đó — **không thêm `patient_id` vào `invoices`** (bản sao có thể lệch) |
| N-13 | đã áp: ẩn hồ sơ = `patients.deleted_at`, mọi khóa ngoại về `patients` giữ RESTRICT, không cascade nên hóa đơn và thanh toán còn nguyên. Tự hủy lịch hẹn tương lai khi ẩn: trigger hoặc ứng dụng, ghi ở Note và từ điển mục 5 (DBML không diễn đạt được) |
| N-14 | không làm: trái R-09 đã chốt (*mật khẩu không bao giờ lưu nguyên văn*); lưu đọc được là mở lộ mật khẩu mọi bác sĩ khi lộ CSDL. Hướng thay (quản trị viên bấm đặt lại, mật khẩu tạm hoặc liên kết dùng một lần) chờ BA: Q-10 |
| N-15 | đã áp: bảng `patient_insurances`, `patient_id` **unique** (1 – 0..1), `policy_number` · `insurer_name` · `expires_on` đều NOT NULL (giả định: cả ba là nội dung bắt buộc của hồ sơ) |
| N-16 | đã hỏi: Q-11 — mâu thuẫn R-04 (*đúng một bác sĩ mỗi lịch hẹn*, đã chốt). Chưa dựng; nếu duyệt thì cần `appointment_doctors` và ràng buộc N-02 phải chuyển sang đó |
| N-17 | đã hỏi: Q-12 — requirement chưa có phẫu thuật hay phòng mổ, `appointments` không gắn phòng; chưa có bảng để đặt ràng buộc loại trừ |
| N-18 | đã hỏi: Q-13 — requirement chưa có gói trị liệu. Phần "lưu số còn lại trên hồ sơ" **không làm** vì là giá trị suy ra (cột đếm lệch khi lịch đổi), ghi ở từ điển mục 4 |
| N-19 | không làm: tách `appointments` theo chi nhánh làm hỏng FK từ `invoices`, hỏng ràng buộc không trùng giờ N-02 và buộc UNION khi báo cáo cả tổ chức. Đã có chỉ mục `(organization_id, clinic_id, starts_at)` cho báo cáo theo chi nhánh; cần thì phân vùng bên trong một bảng logic |
| N-20 | đã hỏi: Q-14 — ảnh khuôn mặt nhận diện là sinh trắc học, của trẻ em; "giữ vô thời hạn, mọi lễ tân xem" trái nguyên tắc quyền tối thiểu và R-10. Không thêm cột ảnh nào |

**Tổng:** 14 đã áp (N-01 → N-13, N-15) · 4 đã hỏi, chưa dựng (N-16, N-17, N-18, N-20) · 2 không làm (N-14, N-19).

Thêm một câu không thuộc nhu cầu nào: **Q-15** — R-10 (lễ tân chỉ thấy phòng khám của mình) vẫn chưa cưỡng chế được vì `users` không có `clinic_id` và bệnh nhân không thuộc phòng khám nào; bảng mới `internal_notes` · `patient_allergies` · `patient_insurances` · `guardianships` thừa hưởng khoảng trống này. Đây là nợ từ v1.0.

## Kết quả kiểm cuối của skill

Skill bản này chỉ có **một cổng kiểm**: cú pháp DBML bằng parser chặt.

```
npx -y @softwaretechnik/dbml-renderer -i docs/database/schema.dbml -o <đường dẫn tạm ngoài project>.svg
→ exit 0   (chạy ba lần, lần cuối sau khi file DBML đã hoàn tất)
```

Các kiểm tay thay cho phần skill này không có:

- 20 bảng trong `schema.dbml` (13 cũ + 7 mới); đủ 7 bảng mới trong bản dựng SVG tạm.
- Mọi mã `Q-nn` nhắc trong `schema.dbml` và `DATA-DICTIONARY.md` đều có mục trong `CAU-HOI-BA.md` (Q-03 → Q-15; không mã nào treo). `Q-01`, `Q-02` ở từ điển mục 2.
- Mọi cột mới và bảng mới đều có trong từ điển (script đối chiếu tên cột giữa DBML và từ điển, không còn cột mới nào thiếu).
- Không có file SVG hay HTML nào được ghi vào project; SVG tạm chỉ nằm ở thư mục scratchpad.

**Giới hạn của lần kiểm:** parser chỉ kiểm cú pháp. Nó **không** kiểm: các ràng buộc viết bằng SQL trong `Note` (EXCLUDE, CHECK, chỉ mục một phần) chạy được trên PostgreSQL; thứ tự chuyển dữ liệu ở từ điển mục 6; hai điều kiện cũ (kiểm trùng giờ, trùng hóa đơn) có thật trên dữ liệu hiện có. Bản skill này không có `check.py`, không soát quy tắc rule kho (khóa ngoại thiếu chỉ mục, kiểu dữ liệu…). `checks { }` trong DBML bị parser từ chối nên các CHECK nằm ở `Note`; mệnh đề `WHERE` của chỉ mục một phần cũng chỉ nằm ở `Note`, không phải ở dòng `indexes`, nên nguồn máy đọc **không tự mang** hai ràng buộc quan trọng nhất của N-02 và N-04.
