# BÁO CÁO ĐO — lượt cập nhật schema v1.0 → v1.1 (N-01 … N-20)

Mỗi nhu cầu một dòng. Câu hỏi đầy đủ (nguồn, hệ quả, hướng) ở `CAU-HOI-BA.md`; năm câu `Q-03` → `Q-07` là CHẶN, phần đó chưa dựng bảng nào.

| Mã | Kết quả |
|---|---|
| N-01 | đã áp: `invoice_lines` (`service_name`, `unit_price`, `quantity` chép lúc lập hóa đơn); `appointment_services` và `services.price` không còn là nguồn giá của hóa đơn đã lập |
| N-02 | đã áp: `appointments.ends_at` (NOT NULL) + CHECK `ends_at > starts_at` + `EXCLUDE USING gist (doctor_id, tstzrange(starts_at, ends_at))` bỏ lịch `cancelled`, ghi ở Note, cần `btree_gist`; đã hỏi: Q-09 (giờ kết thúc của lịch cũ) |
| N-03 | đã áp: `guardianships` (`guardian_person_id`, `ward_person_id`, `started_on`, `ended_on`); lễ tân là bệnh nhân hay bác sĩ là người bảo hộ dùng chung dòng `people`, không thêm cột |
| N-04 | đã áp: `patients.record_code` + unique một phần `(organization_id, record_code) WHERE deleted_at IS NULL` ghi ở Note; đã hỏi: Q-10 (mã cấp lại làm mờ đối chiếu của kế toán) |
| N-05 | đã áp: `appointment_deposits` (`appointment_id` unique, `amount`, `received_on`); đã hỏi: Q-11 (cọc trừ vào hóa đơn hay hoàn khi hủy) |
| N-06 | đã áp: `internal_notes` (`appointment_id`, `patient_id`, `invoice_id` rỗng được + CHECK đúng một, `body`, `created_by_user_id`) |
| N-07 | đã áp: `patient_allergies` (`substance`, `severity`) + enum `allergy_severity` + index `(organization_id, lower(substance))`; đã hỏi: Q-12 (nhập tự do hay danh mục, hạn lưu) |
| N-08 | đã áp: `specialties` (`name`, `is_active`, unique `lower(name)` theo tổ chức) + `doctor_specialties` (bảng nối, pk `(doctor_id, specialty_id)`) |
| N-09 | đã áp: `appointment_status` thêm `confirmed`, `arrived`, `no_show` (giữ `done`); máy chuyển trạng thái ghi ở Note `appointments`; đã hỏi: Q-08 (`done` với `arrived`, hủy từ `confirmed`) |
| N-10 | không làm: lưu cột — là giá trị suy ra; tính `count(*)` từ `appointments` có `status = 'done'` qua index `(patient_id, starts_at)` có sẵn, ghi ở từ điển mục 4 |
| N-11 | đã áp: `services.code` + unique `(organization_id, code)` |
| N-12 | đã áp: `invoices` unique index `(appointment_id)`; tra theo bệnh nhân qua `patients` → `appointments (patient_id, starts_at)` → `invoices`, không lưu `patient_id` thứ hai; khai AP-01, AP-02 |
| N-13 | đã áp: không cần cột mới — `patients.deleted_at` có sẵn, khóa ngoại tới lịch hẹn, hóa đơn, thanh toán không cascade, bảng mới đều `delete: restrict`; quy tắc tự hủy lịch tương lai ghi ở Note `patients`; đã hỏi: Q-14 (phân biệt hủy do hệ thống khi tính phí R-12) |
| N-14 | không làm: lưu mật khẩu đọc được — trái R-09 và DB-SEC-04; đã hỏi: Q-03 (CHẶN, đề xuất mã đặt lại dùng một lần) |
| N-15 | đã áp: `patient_insurances` (`patient_id` unique, `card_number`, `insurer_name`, `expires_on`) |
| N-16 | đã hỏi: Q-05 (CHẶN — mâu thuẫn R-04 "đúng một bác sĩ"; chưa dựng bảng) |
| N-17 | đã hỏi: Q-06 (CHẶN — chưa có thực thể ca mổ, phòng mổ, giờ kết thúc; chưa dựng bảng) |
| N-18 | không làm: lưu số buổi còn lại (giá trị suy ra, lệch khi lịch hẹn đổi); đã hỏi: Q-07 (CHẶN — chưa có thực thể gói trị liệu) |
| N-19 | không làm: `appointments_hn`, `appointments_hcm`, `appointments_dn` — chi nhánh là dòng trong `clinics`, index `(organization_id, clinic_id, starts_at)` đã có; đã hỏi: Q-13 |
| N-20 | đã hỏi: Q-04 (CHẶN — sinh trắc trẻ em, giữ vô thời hạn, mọi lễ tân xem; chưa dựng bảng) |

Tổng: đã áp 13 nhu cầu (N-01 → N-09, N-11, N-12, N-13, N-15 — N-13 không thêm cột) · không làm 4 (N-10, N-14, N-18, N-19) · chỉ hỏi 3 (N-16, N-17, N-20). Sổ câu hỏi: `Q-03` → `Q-14`, 5 CHẶN, 7 không chặn.

---

## Kết quả kiểm cuối (`check.py docs/database --brief --requirements 1-yeu-cau --update-dictionary`, thoát 0)

- Cú pháp: đạt cả hai parser (`dbml-renderer` + `dbml2sql`).
- Số: 21 bảng · 127 cột · 4 enum · 14 giá trị enum · 45 ref · 23 index (bản trước 13 bảng · 72 cột · 3 enum).
- Phát hiện mới: **ERROR 0 · WARN 0 · INFO 4** — `DB-INT-07` `patient_insurances.card_number` (N-15 không đòi unique số thẻ, để nguyên) · `DB-SCL-03` ×2 `invoices`, `invoice_lines` (index dẫn đầu bằng khóa cha uuid, nhất quán với `payments` cũ) · `DB-TYP-03` 1 cột `increment` ở `invoice_lines` (migration thật dùng `GENERATED ... AS IDENTITY`). Không có miễn trừ nào.
- Nợ cũ: ERROR 0 · WARN 36 · INFO 16 — để nguyên. Khối "nợ cũ trên phần vừa sửa": 1 mục `DB-INT-05` `invoices.appointment_id` — để lại có lý do ở cuối `CAU-HOI-BA.md`.
- Thay đổi so với bản trước: bảng +8 · phá vỡ 2 (unique `services(organization_id, code)` do N-11 · unique `invoices(appointment_id)` do N-12 và R-08) · chạm dữ liệu có sẵn 3 (`patients.record_code`, `services.code`, `appointments.ends_at` NOT NULL — cần backfill theo expand–contract trước khi áp).
- Truy vết: 0 định danh chưa có chỗ chứa · 3 cố ý không dựng (`appointments_hn`, `appointments_hcm`, `appointments_dn`, ở Q-13) · 0 bảng không nguồn · 0 mã chết.
- Từ điển: +8 bảng, +3 cột trên bảng cũ, 0 cột thiếu note; phần viết tay cập nhật mục 1, 2, 4 và thêm mục 5 (ràng buộc ghi ở Note).
- Số lần chạy: `check.py` 4 lần (mốc, sau khi viết, sau khi sửa phát hiện, lần cuối sau chỉnh từ điển) — vượt trần 3 lần của `update.md` một lần vì phải `rebaseline` sau khi đổi cấu hình và sửa thêm note cột; ngoài ra `promote` 1, `rebaseline` 1, `dict_update.py` 1.

### Soát tay ở B8 — 7 rule liên quan thay đổi

| Rule | Kết luận | Bằng chứng |
|---|---|---|
| DB-EVO-02 Expand–contract | Đạt | ba cột NOT NULL mới trên bảng có dữ liệu (`record_code`, `code`, `ends_at`) ghi đường thêm rỗng được → điền → NOT NULL ở note cột; không đổi tên hay bỏ cột nào |
| DB-INT-12 Khóa ngoại ghép giữ cùng tenant | Vi phạm (có chủ đích, nợ chung) | bảng mới mang `organization_id` nhưng khóa ngoại đơn như bảng cũ; làm đúng cần `unique (organization_id, id)` ở bảng cha cũ — đề xuất ở cuối `CAU-HOI-BA.md` |
| DB-MOD-11 Tiền: sổ cái chỉ thêm | Đạt | `payments` không đổi, hoàn tiền vẫn là dòng âm (R-08); `invoice_lines` chỉ thêm, sai thì bù trừ; `appointment_deposits` chưa có đường hoàn nên hoàn cọc để Q-11 |
| DB-MOD-14 Mô hình đa tenant | Đạt | cả 8 bảng mới có `organization_id` (một schema, cột tenant mọi bảng) |
| DB-SEC-01 Phân loại dữ liệu | Đạt | mỗi bảng mới ghi "Phân loại" ở Note: `patient_allergies` nhạy cảm (sức khỏe) · `patient_insurances`, `guardianships` cá nhân · `internal_notes` nội bộ, coi nhạy cảm khi phân quyền · `invoice_lines`, `appointment_deposits` tài chính; ảnh khuôn mặt không dựng (Q-04) |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | Đạt | Note `appointments` ghi CHECK qua `NOT VALID` → `VALIDATE` → `SET NOT NULL`; `EXCLUDE` không có `NOT VALID` nên ghi cửa sổ bảo trì; unique tạo bằng `CONCURRENTLY` |
| DB-EVO-08 Backfill chia lô | Đạt | Note `appointments` (bảng cỡ L) ghi điền `ends_at` theo lô vài nghìn dòng; `patients` (M) và `services` (S) chạy một lượt được |

### Việc để BA, một dòng mỗi việc

- Nợ cũ đề xuất gộp một đợt riêng: `DB-INT-05` (23 `Ref` cũ chưa khai `delete:`) · `DB-IDX-01` (5 khóa ngoại cũ thiếu index, gồm `appointments.doctor_id`, `appointments.clinic_id`) · `DB-INT-14` (2 `Ref` `-` ở `patients.person_id`, `doctors.person_id`) · `DB-IDX-12` (`patients.person_id` unique trên bảng xóa mềm) · `DB-INT-07` (`people.email`) · `DB-TYP-01` (khóa uuidv4 ở `appointments`, `invoices`, `payments`).
- Thêm đề xuất ngoài 20 nhu cầu: `cancelled_at` và `cancel_reason` cho `appointments` (R-12 chưa cưỡng chế được, Q-14).
