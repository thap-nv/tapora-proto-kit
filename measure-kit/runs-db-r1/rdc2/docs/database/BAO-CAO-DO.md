# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (07/10/2026)

Skill: `requirements-to-erd` (bản chép trong `scratchpad/cu/`, quy trình 4 bước). Requirement đã chốt: `1-yeu-cau/YEU-CAU-PHONG-KHAM.md` (R-01 → R-12). Nhu cầu áp: `1-yeu-cau/NHU-CAU-DU-LIEU-MOI.md` (N-01 → N-20).

## 1. Từng nhu cầu một dòng

- **N-01** — đã áp: `appointment_services.unit_price` (snapshot giá, `numeric(12,2) NOT NULL`); sửa dòng "giá trị suy ra" sai của v1.0. Chốt giá lúc nào + giá lịch sử dữ liệu cũ: đã hỏi `Q-10` (đi tiếp với giả định).
- **N-02** — đã áp: `appointments.ends_at` + `ck_appointments_time_order` + `EXCLUDE USING gist (doctor_id, tstzrange(starts_at, ends_at, '[)')) WHERE status NOT IN ('cancelled','no_show')` (viết ở `Note` và mục 5 từ điển — DBML không biểu diễn được). Dữ liệu cũ và trạng thái nhả giờ: đã hỏi `Q-09`; đóng `Q-02`.
- **N-03** — đã áp: `guardianships` (`guardian_person_id` → `people`, `patient_id` → `patients`, `started_on`); vế "lễ tân đồng thời là bệnh nhân" schema cũ đã đáp ứng nhờ `people`, không đổi gì. Ngày kết thúc/nhiều người: đã hỏi `Q-13`.
- **N-04** — đã áp: `patients.record_code` + chỉ mục unique **bộ phận** `ux_patients_org_record_code_alive` (`WHERE deleted_at IS NULL`; không đánh `unique` trong DBML vì sẽ sai ý). Rủi ro cấp lại mã với chứng từ kế toán và khôi phục hồ sơ: đã hỏi `Q-12`.
- **N-05** — đã áp: `appointments.deposit_amount` + `deposit_received_on` (`CHECK` cùng có/cùng không, số tiền > 0). Cọc trừ hóa đơn/hoàn/doanh thu: đã hỏi `Q-11`.
- **N-06** — đã áp: `internal_notes` với ba khóa ngoại thật `appointment_id` · `patient_id` · `invoice_id` + `CHECK num_nonnulls(...) = 1` (không dùng cặp loại/id đa hình).
- **N-07** — đã áp: `patient_allergies.substance_name` + `severity` (enum `allergy_severity`); chỉ mục `(organization_id, lower(substance_name))` để tra theo chất, unique `(patient_id, lower(substance_name))`.
- **N-08** — đã áp: `specialties` (`is_active`) + `doctor_specialties` (khóa chính ghép `doctor_id, specialty_id`); là bảng, không phải enum.
- **N-09** — đã áp: `appointment_status` thêm `confirmed` · `arrived` · `no_show`, giữ `done`. Cặp chuyển còn thiếu (`done` ở đâu, `confirmed → cancelled`, lý do hủy): đã hỏi `Q-08`.
- **N-10** — không làm: giá trị suy ra (`COUNT` lịch hẹn `done` của bệnh nhân), ghi ở mục 4 từ điển và `Note` của `patients`; không thêm cột bộ đếm. Phụ thuộc `Q-08`.
- **N-11** — đã áp: `services.code` + unique `(organization_id, code)` (theo tổ chức, không toàn cục).
- **N-12** — đã áp: `invoices.appointment_id` UNIQUE (kiêm chỉ mục tra theo lịch hẹn, đúng R-08 một hóa đơn/lịch); tra theo bệnh nhân đi qua `appointments(patient_id, starts_at)` đã có, không chép `patient_id` sang `invoices`.
- **N-13** — đã áp: ba khóa ngoại chuỗi `appointments.patient_id`, `invoices.appointment_id`, `payments.invoice_id` đặt rõ `ON DELETE RESTRICT`; "ẩn" = `patients.deleted_at` (đã có), hủy lịch tương lai ghi ở `Note` là việc cùng giao dịch. Lý do/phí hủy: gộp vào `Q-08`.
- **N-14** — không làm: lưu mật khẩu đọc được trái `R-09` đã chốt và mở đường cho quản trị viên đăng nhập thay bác sĩ trên dữ liệu y tế. Đề xuất đặt lại mật khẩu bằng mã dùng một lần để BA xác nhận: `Q-07`.
- **N-15** — đã áp: `patient_insurances` với `patient_id` UNIQUE (0..1), `card_number` · `insurer_name` · `expires_on`.
- **N-16** — đã hỏi: `Q-03` — trái `R-04` "đúng một bác sĩ"; kéo theo ràng buộc chống trùng giờ của N-02 không còn đúng. Chưa dựng bảng.
- **N-17** — đã hỏi: `Q-04` — phẫu thuật/phòng mổ chưa có trong mô hình; `rooms` là phòng khám bệnh và không nối vào `appointments`. Chưa dựng bảng.
- **N-18** — đã hỏi: `Q-05` — chưa có khái niệm gói trị liệu; số buổi còn lại là giá trị suy ra, **không** thêm cột vào `patients`. Chưa dựng bảng.
- **N-19** — không làm: tách `appointments_hn/hcm/dn` — chi nhánh là dòng của `clinics`, `appointments.clinic_id` + chỉ mục `(organization_id, clinic_id, starts_at)` đã phục vụ báo cáo từng chi nhánh (~2.000 lịch/ngày ≈ 730.000 dòng/năm, không cần chia); thêm chi nhánh phải sửa lược đồ; bảng tách làm hỏng `EXCLUDE` của N-02 và khóa ngoại `appointment_services`/`invoices`.
- **N-20** — đã hỏi: `Q-06` — sinh trắc học + trẻ em + "vô thời hạn" + "mọi lễ tân xem được" trái `R-10`. Chưa dựng bảng.

Tổng: **đã áp 13** (N-01 · 02 · 03 · 04 · 05 · 06 · 07 · 08 · 09 · 11 · 12 · 13 · 15) · **đã hỏi 4**, chưa dựng bảng (N-16 · 17 · 18 · 20) · **không làm 3** (N-10 · 14 · 19) · 13 + 4 + 3 = 20.

Mười một câu hỏi ghi ở `CAU-HOI-BA.md`: `Q-03` → `Q-13` (năm câu chặn dựng bảng: `Q-03` `Q-04` `Q-05` `Q-06` `Q-07`).

## 2. Kết quả kiểm cuối của skill

| Kiểm | Lệnh / cách | Kết quả |
|---|---|---|
| Cú pháp DBML (bước 3) | `npx -y @softwaretechnik/dbml-renderer -i docs/database/schema.dbml -o <tạm>.svg` | **mã thoát 0** (v1.0 gốc cũng 0; sinh SVG 162 KB rồi xóa) |
| Số bảng | đếm `Table ` trong `schema.dbml` | **19** = 13 (v1.0) + 6 mới; khớp mục 1 và mục 0 của `DATA-DICTIONARY.md` |
| Mã `Q-nn` | script đối chiếu mọi `Q-nn` trong ba file với tiêu đề `## Q-nn` của `CAU-HOI-BA.md` | **không có mã treo** |
| Cột `bảng.cột` | script đối chiếu mọi `bảng.cột` trong `schema.dbml`, từ điển, câu hỏi với cột khai báo | **không có cột lạ**; mọi bảng của schema có mặt trong từ điển |
| Cột trong bảng từ điển mục 3 | script đối chiếu cột từng bảng 3.x với `schema.dbml` | **không có cột lạ** |

**Bỏ theo yêu cầu của lần đo:** bước 4 (render `schema.html`, bộ `erd_engine.py`, tự kiểm 26 tiêu chuẩn) và việc gọi subagent soát độc lập. Bản skill này không có `check.py` hay kho rule soát — chỉ có kiểm cú pháp DBML nêu trên và hai script đối chiếu tự viết.

## 3. File đã ghi

- `docs/database/schema.dbml` — v1.1
- `docs/database/DATA-DICTIONARY.md` — v1.1 (mục 0 thay đổi, mục 3 bảng cột mới/đổi, mục 4 suy ra, mục 5 ràng buộc migration, mục 6 thứ tự migration)
- `docs/database/CAU-HOI-BA.md` — mới, `Q-03` → `Q-13`
- `docs/database/BAO-CAO-DO.md` — file này
