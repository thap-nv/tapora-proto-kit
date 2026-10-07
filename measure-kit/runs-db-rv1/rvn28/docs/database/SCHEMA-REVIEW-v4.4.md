# SOÁT SCHEMA — schema.dbml (07/10/2026)

<!-- db-schema-review:machine:start -->
## Kết quả máy

*Khối này do `report.py --review-md` sinh từ `_check/report.json`; chạy lại sẽ thay nguyên khối. Phần viết tay nằm ngoài hai dấu mốc.*

**Schema:** 56 bảng · 612 cột · 37 enum · 159 giá trị enum · 211 ref · 109 index · dialect postgresql · cú pháp đạt (hai parser)
**Mốc nợ cũ:** đã tính lại trên `last-green.dbml` (mốc do bản skill cũ ghi, không có dấu bộ soát) — "mới" dưới đây là so với mốc mới.
**Từ điển:** 0 bảng không được nhắc · 0 cột còn trong từ điển mà DBML đã bỏ · 0 mục nói tới bảng đã bỏ.

### Số liệu cấu trúc

- Ref: 211 (211 inline · 0 rời · 0 nhiều cột) · khai `delete:` ở 0
- DDL: 211 khóa ngoại trong SQL do dbml2sql sinh (DBML khai 211)
- Cách ly tenant: cột organization_id có ở 54 bảng · 38 dòng ghi chú nhắc composite/khóa ngoại ghép (34 bảng) · `Ref` nhiều cột thật: 0 ⚠ LỜI HỨA CHƯA THỰC HIỆN: DDL sinh từ DBML không có ràng buộc đó (DB-INT-12 · DB-MOD-14)
- EXCLUDE (chống chồng khoảng): class_occurrences ×3, time_slots ×1
- Cỡ bảng khai: M 11 · S 45
- Access pattern: 0 — DB-IDX-02 và DB-IDX-03 chưa chấm

### Phát hiện mới — ERROR 0 · WARN 62 · INFO 19

| Mức | Rule | Số | Ví dụ |
| :--- | :--- | ---: | :--- |
| WARN | DB-INT-05 *Mỗi khóa ngoại khai hành vi xóa, chọn theo ai sở hữu ai* | 46 | facilities.bank_account_id d568; users.role_id d581; roles.organization_id d675 … |
| WARN | DB-IDX-01 *Index cho mọi khóa ngoại* | 11 | facilities.bank_account_id d568; users.role_id d581; role_permissions.permission_id d755 … |
| WARN | DB-INT-14 *Quan hệ 1–1 cần UNIQUE* | 3 | guardianship_transfer_requests.new_guardianship_id d1231; student_evaluations.supersedes_evaluation_id d2482; ticket_reversals.drop_in_ticket_id d2654 |
| WARN | DB-INT-09 *NULL trong UNIQUE* | 2 | roles.organization_id d685; roles.organization_id d686 |

INFO: DB-IDX-01 ×10 · DB-NAM-04 ×4 · DB-INT-09 ×2 · DB-MOD-15 ×2 · DB-INT-06 ×1

### Nợ cũ — 317 (có từ bản đã duyệt; không liệt kê)

DB-INT-05 WARN ×165 · DB-IDX-01 WARN ×26 · DB-INT-14 WARN ×8 · DB-IDX-12 WARN ×5 · DB-INT-09 WARN ×3 · DB-MOD-06 WARN ×2 · DB-INT-07 WARN ×1 · DB-INT-08 WARN ×1 · DB-IDX-01 INFO ×41 · DB-MOD-18 INFO ×11 · DB-INT-10 INFO ×9 · DB-TYP-04 INFO ×6 · DB-INT-11 INFO ×5 · DB-IDX-04 INFO ×4 · DB-IDX-10 INFO ×4 · DB-INT-07 INFO ×4 · DB-MOD-09 INFO ×4 · DB-INT-02 INFO ×3 · DB-INT-09 INFO ×3 · DB-IDX-09 INFO ×2 · DB-NAM-04 INFO ×2 · DB-TYP-01 INFO ×2 · DB-IDX-07 INFO ×1 · DB-MOD-15 INFO ×1 · DB-NAM-05 INFO ×1 · DB-SCL-05 INFO ×1 · DB-TYP-03 INFO ×1 · DB-TYP-06 INFO ×1

### Nợ cũ trên phần đã đổi — 8 cần quyết định (sửa, hay ghi lý do để lại)

- DB-INT-05 users.person_id d578 — khóa ngoại chưa khai hành vi xóa
- DB-INT-05 users.facility_id d580 — khóa ngoại chưa khai hành vi xóa
- DB-INT-05 guardianships.ward_person_id d1184 — khóa ngoại chưa khai hành vi xóa
- DB-INT-05 schedule_change_requests.anchor_session_id d1840 — khóa ngoại chưa khai hành vi xóa
- DB-INT-05 free_learning_rights.origin_exam_id d2141 — khóa ngoại chưa khai hành vi xóa
- DB-INT-05 drop_in_tickets.facility_id d2587 — khóa ngoại chưa khai hành vi xóa
- DB-IDX-01 users.facility_id d580 — khóa ngoại chưa có index (JOIN và xóa dòng cha sẽ quét cả bảng)
- DB-IDX-01 schedule_change_requests.anchor_session_id d1840 — khóa ngoại chưa có index (JOIN và xóa dòng cha sẽ quét cả bảng)

### Thay đổi so với bản trước

**Thay đổi so với bản trước** (bản trước → bản này)

44 bảng · 489 cột · 35 enum → **56 bảng · 612 cột · 37 enum**

| | + | − | đổi |
| :--- | ---: | ---: | ---: |
| bảng | 12 | 0 | 0 |
| cột | 27 | 9 | 2 |
| enum | 3 | 1 | 0 |
| giá trị enum | 11 | 1 | 0 |
| ref | 16 | 1 | 0 |
| index | 10 | 5 | 0 |

Phân loại: **phá vỡ 16** · **dữ liệu 19** · index 9 · cộng thêm 54 · ghi chú bảng đổi 21

Thay đổi PHÁ VỠ (cần migration có kế hoạch) — 16:
- cột `users.role` cột bị bỏ (user_role)
- cột `users.can_check_in` cột bị bỏ (boolean)
- cột `users.can_view_face_photo` cột bị bỏ (boolean)
- index `users(person_id, role_id)` thêm UNIQUE
- cột `course_products.age_group` cột bị bỏ (age_group)
- cột `persons.age_group` cột bị bỏ (age_group)
- cột `guardianships.is_primary` cột bị bỏ (boolean)
- index `guardianships(ward_person_id)` thêm UNIQUE
- cột `prospects.age_group` cột bị bỏ (age_group)
- index `experience_sessions(student_id)` thêm UNIQUE
- index `free_learning_rights(origin_exam_id)` thêm UNIQUE
- cột `drop_in_tickets.ticket_code` cột bị bỏ (varchar(32))
- cột `monthly_ticket_uses.recorded_by` cột bị bỏ (uuid)
- giá trị enum `change_request_type.multi_session_absence` bỏ giá trị enum — mã, báo cáo, dữ liệu cũ đều có thể còn dùng _(DB-EVO-05)_
- enum `age_group` bỏ cả Enum _(DB-EVO-05)_
- … +1 dòng nữa (--json)

Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước) — 19:
- cột `users.role_id` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `monthly_ticket_uses.checked_in_by` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- cột `monthly_ticket_uses.check_in_method` NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước
- ref `facilities(bank_account_id) → bank_accounts` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `users(role_id) → roles` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `course_products(age_group_id) → age_groups` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `persons(age_group_id) → age_groups` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `guardianships(consent_confirmed_by) → users` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `students(customer_source_id) → customer_sources` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `person_face_photos(uploaded_by) → users` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `prospects(age_group_id) → age_groups` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `prospects(customer_source_id) → customer_sources` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `experience_sessions(student_id) → students` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `payment_receipts(payment_collection_id) → payment_collections` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- ref `payment_receipts(bank_account_id) → bank_accounts` FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)
- … +4 dòng nữa (--json)

Bảng mới (12): `roles`, `permissions`, `role_permissions`, `age_groups`, `customer_sources`, `certificate_types`, `bank_accounts`, `guardianship_transfer_requests`, `payment_collections`, `change_request_sessions`, `coach_certificates`, `ticket_reversals`

Phá vỡ trên bảng đã có: 16 (cột 9 · index/unique 4 · enum 2 · khóa ngoại 1)

### Truy vết requirement ↔ schema

Truy vết · 11 tài liệu · 8815 dòng
Requirement → schema: 6 định danh chưa có chỗ chứa · 4 câu tự nhận "chưa có chỗ chứa" · 2 định danh đã hỏi hay cố ý không dựng (student_source, swim_style)
  `external_coach_students` ×2 — STAKEHOLDER-BOI-DAT.md:141 — "|  | ✅ **ĐÃ GIẢI 17/09.** HLV ngoài = `persons` + hồ sơ `external_coaches`; học viên riêng"
  `ad_hoc_support` ×1 — USE-CASE-BOI-DAT.md:2742 — "| 3 | `UC-27` nhánh `2c` |  | ✅ `DQ-06`: không có tiết riêng cho người hỗ trợ — bỏ `ad_hoc"
  `age_group` ×1 — YEU-CAU-HE-THONG-MOI.md:365 — "| Khóa học trên web *(5 dòng sản phẩm)* đối chiếu mô hình `courses` | Hệ thống phân biệt đ"
  `can_check_in` ×1 — USE-CASE-BOI-DAT.md:598 — "| **Actor chính** | ACT-03 Quản lý — hoặc nhân viên có `can_check_in`, **đăng nhập web trê"
  `oversize_class` ×1 — BUSINESS-RULES-BOI-DAT.md:578 — "| BR-CC-04c | **Tối đa 1 tiết cho một HLV trong một khung giờ** — lớp 1:4 có 4 hay 5 học v"
  `student_face_photos` ×1 — STAKEHOLDER-BOI-DAT.md:136 — "|  | ✅ **ĐÃ GIẢI 17/09.** Gộp danh tính về `persons` + `guardianships`. Bảng `parents` bỏ;"
  ⟲ AS-IS-BOI-DAT-v2.md:42 — "| **Bảng giá** | Chưa có bảng giá thật. Giả định đang dùng ghi ở mục 4.1 bên dưới |"
  ⟲ USE-CASE-BOI-DAT.md:1362 — "- **1b** **Vé tháng** 12 buổi → 🔺 **06/10 (`BR-SV-13b` · `XD-56`, mở lại `XD-47`):** **định danh** —"
  ⟲ USE-CASE-BOI-DAT.md:1817 — "- Chỗ chứa chứng chỉ, ngày vào làm: chờ `requirements-to-erd` lượt 7 *(danh sách ở `CONFLICTS` mục V"
  ⟲ USE-CASE-BOI-DAT.md:2644 — "- Chỗ chứa tài khoản HLV ngoài, học viên riêng tự đăng ký: chờ `requirements-to-erd` lượt 7."
Schema → requirement: 1 bảng không có nguồn · 0 mã chết
  bảng không có nguồn: external_coaches (d2524)

### Rule soát tay liên quan thay đổi

- DB-EVO-02 Expand–contract — 35 thay đổi phá vỡ hay chạm dữ liệu cũ
- DB-INT-12 Khóa ngoại ghép để giữ cùng tenant — 12 bảng mới
- DB-INT-15 Ma trận cưỡng chế rule — có khóa ngoại mới
- DB-MOD-11 Tiền: sổ cái chỉ thêm, hoàn tiền là dòng mới — có cột tiền mới
- DB-MOD-14 Mô hình đa tenant — 12 bảng mới
- DB-SEC-01 Phân loại dữ liệu từng cột — 12 bảng mới
- DB-EVO-03 `NOT VALID` rồi `VALIDATE` — 35 thay đổi phá vỡ hay chạm dữ liệu cũ
- DB-EVO-08 Backfill chia lô — 35 thay đổi phá vỡ hay chạm dữ liệu cũ
<!-- db-schema-review:machine:end -->

## Phạm vi và đầu vào

- **Soát:** `schema.dbml` hiện tại — bản **v4.4 đang làm dở** *(56 bảng; lượt ERD 7, phiếu vòng 7)* — so với bản đã duyệt `_check/last-green.dbml` *(v4.3)*. Báo cáo kỳ trước: `SCHEMA-REVIEW-v4.3.md`. Số dòng `dNNN` ở đó là dòng của `last-green.dbml`; **ở báo cáo này `dNNN` là dòng của `schema.dbml` hiện tại**.
- **Làm gì:** `check.py docs/database --review` kèm `--dictionary` và `--requirements 1-yeu-cau`; đọc tay 12 bảng mới, các bảng đổi và DDL `_check/schema.sql` do `dbml2sql` sinh. Chỉ đọc: không `promote`, không sửa schema, từ điển, `schema-lint.json`. `check.py` tự tính lại mốc nợ cũ ở `_check/lint-baseline.json` vì mốc cũ không có dấu bộ soát.
- **Đừng so số nợ cũ với báo cáo v4.3** (335): bộ rule nay có thêm DB-INT-14 *(8 nợ cũ)* và đếm DB-IDX-01 khác. Số đo tay thì so được — xem bảng *Việc của kỳ trước*.

## Giả định và phần chưa soát được

| | |
|---|---|
| **Cỡ bảng** | Giả định A — `schema-lint.json` ước theo 1.000–1.500 học viên · ~50 HLV · 3 cơ sở · 5 năm: 45 bảng cỡ S, 11 cỡ M, không bảng nào cỡ L. Chưa ai xác nhận |
| **DB-IDX-02, DB-IDX-03** | **Chưa chấm** — `access_patterns` rỗng. Không đoán pattern |
| **Hiệu năng thực** | Không dữ liệu mẫu, không `EXPLAIN` — mọi nhận xét hiệu năng là suy từ cấu trúc |
| **Dữ liệu đã nạp?** | Giả định **chưa có dữ liệu thật** *(như báo cáo v4.3; "làm sạch thuộc giai đoạn thực thi")*. Mỗi mục ghi bước cần trước nếu thực tế đã nạp |
| **DDL** | Mọi câu "DDL sinh ra …" dựa vào `_check/schema.sql` (`dbml2sql` 10.2.0 ghim). Nếu DDL thật của dự án viết tay từ `Note` chứ không sinh từ DBML thì mục 1.1 nhẹ đi — nhưng bất kỳ công cụ nào đọc DBML vẫn ra bản sai |
| **Cú pháp · từ điển** | Đạt cả hai parser; từ điển 0 bảng thiếu, 0 cột thừa. Từ điển **không có cột mức nhạy cảm** *(1.9)* |
| **Miễn trừ** | `waivers` trong `schema-lint.json` vẫn rỗng — các đề xuất miễn của v4.3 chưa được xác nhận; báo cáo này **không ghi** miễn trừ |
| **Không làm** | Không chế độ soát độc lập bằng subagent, không vẽ ERD |

## Máy nói gì, thật ra là gì

| WARN mới | Số | Phán đoán |
|---|---:|---|
| DB-INT-05 hành vi xóa | 46 | thật, cơ học → **1.8** |
| DB-IDX-01 khóa ngoại chưa index | 11 | thật, nhỏ ở cỡ S/M → **1.8** |
| DB-INT-14 quan hệ `-` | 3 *(+8 nợ cũ)* | **dương tính giả** — đã đọc DDL cả 11 dòng → **3.1** |
| DB-INT-09 NULL trong unique | 2 | thật, một chỗ (`roles`) → **1.6** |

Máy **không bắt** ba thứ tôi tìm ra khi đọc tay và đối chiếu DDL: **unique một phần chỉ có trên giấy** *(1.1 — nặng nhất)* · mã xác thực chuyển liên kết không có bộ đếm thử *(1.3)* · khoảng tuổi chồng nhau *(1.5)*. Ngoài ra *khóa ngoại ghép chỉ trên giấy* *(1.2)* máy chỉ báo bằng dòng "LỜI HỨA CHƯA THỰC HIỆN", không thành phát hiện.

## Nhóm 1 — Sửa thẳng ở lượt kế tiếp

### 1.1 · Unique "một phần" chỉ ghi ở `note`, DDL ra unique đầy đủ — HIGH · DB-INT-15 · quy ước `dbml-conventions` *(máy không bắt)*
- **Bằng chứng:** 9 index khai `[unique]` trong khối `indexes` mà điều kiện `WHERE` chỉ nằm trong `note: 'Partial: …'`. `dbml2sql` bỏ `note` nên `_check/schema.sql` có **unique đầy đủ** — ví dụ dòng 1101 `CREATE UNIQUE INDEX "guardianships_one_customer" ON "guardianships" ("ward_person_id")`. 6 trong 9 là **mới ở v4.4**. Tám cái phá đúng kịch bản mà `Note` của chính nó cho phép:

| Index (dòng) | Điều kiện `Note` muốn | Với DDL hiện tại thì |
|---|---|---|
| `guardianships(ward_person_id)` d1193 | `WHERE ended_at IS NULL AND relationship <> 'external_coach'` | **chuyển liên kết (UC-52 12e) không chạy được**: dòng cũ `ended_at` còn đó, thêm dòng mới cho Khách hàng xin thì trùng `ward_person_id`; HLV ngoài có học viên riêng cũng đã có phụ huynh thì không thêm được |
| `guardianship_transfer_requests(student_id)` d1235 | `WHERE status = 'pending'` | một học viên **chỉ có một yêu cầu chuyển trong cả đời**; bị từ chối hay hết hạn rồi không xin lại được |
| `experience_sessions(prospect_id, class_occurrence_id)` d1507 | `WHERE student_id IS NULL` | `prospect_id NOT NULL` nên cùng một khách đặt cho **hai con** vào cùng buổi bị chặn — `Note` nói đó là hai dòng hợp lệ |
| `experience_sessions(student_id)` d1508 | `… AND status <> 'cancelled_by_center'` | buổi bị Bơi Đạt hủy vẫn chiếm "một buổi trải nghiệm", không đặt lại được |
| `free_learning_rights(origin_exam_id)` d2153 | `WHERE status IN (waiting_paid_sessions, active)` | `Note` d2141 viết hẳn *"thôi unique"* — nhưng index vừa **được thêm** `[unique]` *(máy xếp vào 16 thay đổi phá vỡ)*. BR-KT-22 (sửa kết quả thi: chưa đạt → đạt → chưa đạt) cần sinh quyền lần hai từ cùng lần thi: bị chặn |
| `free_learning_rights(student_id, swim_style_id)` d2152 | cùng điều kiện | quyền đã đóng *(passed / expired / condition_lost)* chặn quyền mới của cùng học viên × kiểu bơi — cũng là luồng BR-KT-22 |
| `sessions(makeup_for_session_id)` d2032 | `… AND status NOT IN (released, cancelled_by_center, voided_expired)` | buổi bù đã hủy vẫn chiếm chỗ — `Note` nói buổi gốc được xếp bù lại |
| `exams(session_id)` d2102 | `WHERE status = 'scheduled'` | lần thi `cancelled` / `taken` vẫn chiếm buổi |

  Cái thứ chín, `roles(organization_id, template_role)` d686, vô hại vì NULL không trùng nhau trong PostgreSQL. Cùng hệ quả nhưng không có `note: 'Partial'` nên không nằm trong 9: `guardianships(guardian_person_id, ward_person_id)` d1192 — unique đầy đủ, nên cặp *người giám hộ cũ ↔ học viên* đã `ended_at` không thể mở lại bằng dòng mới *(chuyển liên kết A → B rồi B → A)*.
- **Cách sửa** *(đúng khuôn của dự án — `class_occurrences` d1978 đã viết `CREATE UNIQUE INDEX … WHERE …` trong `Note` bảng, và `dbml_model` đọc được khuôn này)*: bỏ `[unique]` ở 9 index, giữ index thường nếu cần tra cứu, viết SQL vào `Note` của bảng:
```sql
CREATE UNIQUE INDEX guardianships_one_customer ON guardianships (ward_person_id)
  WHERE ended_at IS NULL AND relationship <> 'external_coach';
CREATE UNIQUE INDEX guardianships_pair_active ON guardianships (guardian_person_id, ward_person_id)
  WHERE ended_at IS NULL;
CREATE UNIQUE INDEX gtr_one_pending ON guardianship_transfer_requests (student_id) WHERE status = 'pending';
CREATE UNIQUE INDEX exp_booker_slot ON experience_sessions (prospect_id, class_occurrence_id) WHERE student_id IS NULL;
CREATE UNIQUE INDEX exp_student_once ON experience_sessions (student_id)
  WHERE student_id IS NOT NULL AND status <> 'cancelled_by_center';
CREATE UNIQUE INDEX frl_open_per_style ON free_learning_rights (student_id, swim_style_id)
  WHERE status IN ('waiting_paid_sessions', 'active');
CREATE UNIQUE INDEX frl_open_per_exam ON free_learning_rights (origin_exam_id)
  WHERE status IN ('waiting_paid_sessions', 'active');
CREATE UNIQUE INDEX sessions_one_makeup ON sessions (makeup_for_session_id)
  WHERE makeup_for_session_id IS NOT NULL AND status NOT IN ('released', 'cancelled_by_center', 'voided_expired');
CREATE UNIQUE INDEX exams_one_scheduled_per_session ON exams (session_id) WHERE status = 'scheduled';
```
- **An toàn khi đã có dữ liệu:** nới lỏng, không chạm dữ liệu. Nếu DDL đầy đủ đã chạy: `CREATE UNIQUE INDEX CONCURRENTLY` bản một phần rồi `DROP INDEX` bản đầy đủ. Hai index **mới thắt chặt** so với v4.3 *(`guardianships(ward_person_id)`, `experience_sessions(student_id)`)* cần kiểm trùng trước nếu dữ liệu cũ có hai người giám hộ cho một học viên: `SELECT ward_person_id, count(*) FROM guardianships WHERE ended_at IS NULL AND relationship <> 'external_coach' GROUP BY 1 HAVING count(*) > 1`.
- **Hướng xử lý:** `sửa`. Hỏi thêm một câu ở luồng UC-52 12e: chuyển lại cho người giám hộ cũ thì **mở lại dòng cũ** hay **thêm dòng mới** — chọn dòng mới thì `guardianships_pair_active` ở trên đúng; chọn mở lại thì giữ unique đầy đủ ở cặp.

### 1.2 · Khóa ngoại ghép vẫn chỉ có trên giấy — HIGH · DB-INT-12 · DB-MOD-14 · DB-INT-15 *(việc 1.3 của v4.3, rộng thêm)*
- **Bằng chứng:** `check.py` dòng 3b: 38 dòng ghi chú ở **34 bảng** nhắc composite FK *(v4.3: 28 bảng)*, `Ref` nhiều cột thật **0**, `UNIQUE (organization_id, id)` ở bảng cha **0**. Sáu bảng mới *(`role_permissions`, `guardianship_transfer_requests`, `payment_collections`, `change_request_sessions`, `coach_certificates`, `ticket_reversals`)* lặp câu *"Trùng với … composite FK giữ hai đường không lệch"* — lời hứa tăng, thực thi vẫn 0. Quy mô: **105** khóa ngoại nối hai bảng cùng có `organization_id` *(không `*_by`, không trỏ `organizations`)* tới **28 bảng cha** *(v4.3: 82 → 19)*; thêm 51 cột `*_by` trỏ `users`.
- **Hệ quả:** như v4.3 — một dòng `sessions` của tổ chức A vẫn trỏ được vào `courses` của tổ chức B và RLS giấu chỗ sai. v4.4 thêm hai chỗ nhạy: `users.(organization_id, role_id) → roles` *(một tài khoản có thể mang vai của tổ chức khác — và vai quyết quyền thao tác tiền, quyền xem ảnh)* và `role_permissions.(organization_id, role_id)`. `Note` d611–615 đã tính đúng chuyện master có `organization_id` NULL nên FK ghép không kiểm *(MATCH SIMPLE)* — đó là hành vi mong muốn, giữ.
- **Cách sửa:** (a) bảng cha `indexes { (organization_id, id) [unique] }` — 28 chỗ; (b) 105 `Ref` ghép dạng `Ref: sessions.(organization_id, course_id) > courses.(organization_id, id) [delete: restrict]`; (c) bỏ index khóa ngoại đơn mà cột ghép đã phủ. **Làm cùng 1.8** vì cùng viết lại `Ref`. Chi phí: +28 unique index, mỗi bảng con thêm một index dẫn bằng `organization_id` — chính là thứ 1.8 cần.
- **An toàn khi đã có dữ liệu:** chạm dữ liệu — `ADD CONSTRAINT … NOT VALID` rồi `VALIDATE` *(DB-EVO-03)*; chưa có dữ liệu thì thêm thẳng.
- **Hướng xử lý:** `sửa`. Đây là chỗ duy nhất mà dự án đã quyết *(cách ly ở tầng CSDL)* nhưng schema thực thi chưa tới một nửa.

### 1.3 · Mã xác thực chuyển liên kết không có bộ đếm thử — HIGH · DB-SEC *(mới ở v4.4)*
- **Bằng chứng:** `guardianship_transfer_requests` d1221: `verification_code_hash` d1227 + `code_expires_at` d1228; không cột nào đếm số lần nhập sai. BR-DK-09b / UC-52 12e: Khách hàng mới chỉ cần **mã học viên** *(`students.student_code` d1257, hệ thống tự sinh, unique theo tổ chức — nếu sinh theo dãy thì đoán được)* để mở yêu cầu; mã xác thực gửi tới người đang giữ. Mã ngắn thì băm không cứu được — kẻ có một mã học viên thử hết không gian mã trong hạn mã. Hậu quả nếu qua: chiếm quyền xem lịch học, tin nhắn và video thi của một đứa trẻ.
- **Cách sửa:** `failed_attempts smallint [not null, default: 0]` + `CHECK: failed_attempts >= 0`; khóa yêu cầu sau N lần *(N là số cần BA/Madison chọn — chưa có tham số; `MH-18` đã có "ngưỡng khóa gửi mã" của đăng nhập, nên dùng chung được hay không là câu để hỏi)*; thêm `status = 'rejected'` hoặc `locked` khi quá N. Nếu giới hạn thử đã nằm ở cổng API/bộ nhớ đệm thì `miễn` kèm lý do, nhưng ghi vào ma trận cưỡng chế.
- **An toàn khi đã có dữ liệu:** cộng thêm một cột có mặc định, không chạm dữ liệu.
- **Hướng xử lý:** `sửa`. *Chưa chắc:* độ dài mã *(schema không ghi; UC-52 gọi là "mã xác thực")* — nếu dài và có giới hạn thử ở nơi khác thì mức giảm xuống INFO.

### 1.4 · Định danh đăng nhập bằng email phân biệt hoa thường — WARN · DB-INT-08 · DB-IDX-07 *(v4.3 mục 3.2 nói: có email thì phải sửa — nay có)*
- **Bằng chứng:** `users.login_identifier` d582 `[not null, unique]`; `login_identifier_kind` d583 nhận `email` và `phone` *(BR-QT-20)*. `Lan@x.com` và `lan@x.com` là hai định danh khác nhau; `0912345678` và `+84912345678` cũng vậy. Báo cáo v4.3 đề xuất miễn *"nếu có định danh kiểu email thì cần `lower()`/`citext`"* — điều kiện ấy đã xảy ra ở v4.4.
- **Cách sửa:** thay `unique` ở cột bằng index biểu thức `` `lower(login_identifier)` [unique] `` *(`dbml_model` coi `lower(x)` là `x`, nên không sinh cảnh báo mới)*; ghi vào `Note`: SĐT chuẩn hóa một dạng *(vd E.164)* ở lớp ứng dụng trước khi ghi, `CHECK (login_identifier_kind <> 'phone' OR login_identifier ~ '^\+?[0-9]{9,15}$')`.
- **An toàn khi đã có dữ liệu:** chạm dữ liệu nhẹ — tìm trùng trước: `SELECT lower(login_identifier), count(*) FROM users GROUP BY 1 HAVING count(*) > 1`; chuẩn hóa rồi `CREATE UNIQUE INDEX CONCURRENTLY`.
- **Hướng xử lý:** `sửa`. Câu liên quan về hai nguồn *"đăng nhập"* ↔ *"hồ sơ người"* ở **2.3**.

### 1.5 · `age_groups`: khoảng tuổi chồng nhau không bị chặn — WARN · DB-INT-11 · DB-MOD-12 · DB-REQ-04 *(mới ở v4.4; cùng loại 2.1 của v4.3)*
- **Bằng chứng:** `age_groups` d1011: `min_age_years`, `max_age_years` *(khoảng [min, max))*, chỉ có `CHECK max > min` ở `Note`. BR-SV-19c cho Sếp *"tách Trẻ em 6–18 thành 6–12 và 12–18"* — thao tác sửa một dòng và thêm một dòng; nhập lệch một năm thì hai nhóm cùng nhận một người, và `UC-10` lọc cứng theo nhóm *(BR-XL-14 lọc HLV Baby, BR-KT-09a vế 4 mở quyền học free đều đọc thuộc tính của nhóm — hai nhóm trả hai kết quả khác nhau cho cùng một học viên)*.
- **Cách sửa** *(`btree_gist` đã có vì `class_occurrences`; điều kiện `is_active` vì nhóm bị ẩn được phép chồng nhóm mới — "Ẩn thay vì xóa")*:
```sql
ALTER TABLE age_groups ADD CONSTRAINT age_groups_no_overlap
  EXCLUDE USING gist (organization_id WITH =, int4range(min_age_years, max_age_years) WITH &&)
  WHERE (is_active);
```
  `int4range(min, NULL)` là khoảng không trần — khớp "NULL = không có trần". EXCLUDE **không** bắt được khoảng hở *(người 5 tuổi 11 tháng không có nhóm)*: kiểm ở lúc lưu nhóm, cùng lượt với việc chọn bốn thuộc tính.
- **An toàn khi đã có dữ liệu:** cộng thêm; bốn dòng mặc định không chồng nhau nên thêm thẳng, nếu đã có dòng tự sửa thì kiểm chồng trước.
- **Hướng xử lý:** `sửa`.

### 1.6 · `roles`: "NULL đúng một dòng" chưa được giữ — WARN · DB-INT-09 *(2 phát hiện máy)*
- **Bằng chứng:** `roles` d673: `Note` d675 viết *"organization_id NULL ĐÚNG MỘT dòng — vai mẫu master"*; `unique (organization_id, name)` d685 và `(organization_id, template_role)` d686 không chặn hai dòng NULL — hai vai master cùng tên vẫn lọt. Máy báo hai WARN.
- **Cách sửa:** `CREATE UNIQUE INDEX roles_one_master ON roles (template_role) WHERE organization_id IS NULL;` *(ghi vào `Note`; `CHECK` d709 đã buộc `organization_id IS NULL` ⇔ `template_role = 'master'`)*. Sau đó hai WARN `miễn` kèm lý do *"chỉ một dòng NULL, chặn bởi roles_one_master"*.
- **An toàn khi đã có dữ liệu:** cộng thêm.
- **Hướng xử lý:** `sửa`. Cũng xóa ngộ nhận ở d686: `note: 'Partial: WHERE template_role IS NOT NULL'` thừa — NULL không trùng nhau nên không cần.

### 1.7 · Sổ tiền "chỉ thêm" chưa cưỡng chế; hai rule đồng thời chỉ ở ứng dụng — MEDIUM · DB-MOD-11 · DB-INT-15
- **Hình dạng đúng:** hoàn là dòng mới âm *(`ticket_reversals.amount` `CHECK < 0`, `payment_receipts` d1754)*; hủy vé không xóa dòng bán; `payment_collections.collected_at` · `collected_by` chép sang từng phần chia là denormalize có chủ đích, có ghi lý do.
- **Chưa cưỡng chế:** không `REVOKE UPDATE, DELETE`, không trigger ở `Note` hay `Project Note` — "chỉ thêm" là quy ước. Hai bảng mới *(`payment_collections` d1770, `ticket_reversals` d2651)* không có luồng nào cần sửa dòng. `payment_receipts` có một luồng sửa hợp lệ *(khớp tay `course_id`, `status`, `matched_*`)*.
- **Rule chỉ giữ ở ứng dụng mà có đồng thời** *(DB-INT-15 — hạ xuống mục cần chú ý)*: (1) `monthly_ticket_uses` d2622: *"đủ `sessions_total` thì không nhận lượt"* và *"quét lại trong cùng suất không sinh dòng mới"* — hai thiết bị quét một người trong vài giây cùng đọc *"còn lượt"*, cùng ghi, ra lượt thứ 13; (2) **mỗi học viên một lần trải nghiệm** *(BR-DK-13d)*: nằm ở **hai bảng** — `experience_sessions` khi chưa có khóa, `sessions` (`bonus`, lý do học thử) khi đã có khóa — không unique nào trùm hai bảng; (3) `Σ payment_receipts.amount_received = payment_collections.amount_collected` — trong một giao dịch nên an toàn, chỉ cần ghi rõ.
- **Cách sửa:** (a) `Project Note`: `REVOKE UPDATE, DELETE ON payment_collections, ticket_reversals FROM app_user;` và `GRANT UPDATE (course_id, status, matched_by, matched_at, note) ON payment_receipts TO app_user;` *(chỉ các cột của luồng khớp tay; tên vai CSDL theo Project Note)*; (b) ghi vào `Note` hai bảng: ghi lượt vé tháng và ghi buổi trải nghiệm đều `SELECT … FOR UPDATE` dòng cha *(`drop_in_tickets`; `students`)* trong cùng giao dịch trước khi đếm; (c) lập **ma trận cưỡng chế** một trang: rule → cơ chế → ai chịu trách nhiệm.
- **An toàn khi đã có dữ liệu:** `REVOKE` và ghi chú không chạm dữ liệu; cần kiểm ứng dụng hiện có không `UPDATE` hai bảng.
- **Hướng xử lý:** `sửa`.

### 1.8 · Một lượt viết lại `Ref` và index — WARN · DB-INT-05 · DB-IDX-01 · DB-IDX-11 *(việc 1.1, 1.2, 1.4 của v4.3)*
- **Bằng chứng:** 211/211 quan hệ là `ref:` inline, **0** `delete:` *(v4.3: 166/166; 46 phát hiện mới theo cùng khuôn)*. DB-IDX-01: 11 WARN mới + 10 INFO `*_by`. Số đo tay: bảng có `organization_id` mà **không index nào dẫn đầu bằng nó**: **33/54** *(v4.3: 28/43; `check.py` nay tự báo ở dòng `tenant-fk-summary`)*; bảng có `facility_id` thiếu index dẫn đầu bằng `facility_id` hay `(organization_id, facility_id)`: **3/13**, vẫn đúng ba bảng cũ `schedule_commitments`, `external_coaches`, `exception_acknowledgements`.
- **Cách sửa:** `dbml_lint.py schema.dbml --fix DB-INT-05` in sẵn 211 dòng — **181 `restrict` · 28 `set null` · 2 `cascade`**. Duyệt tay: 181 `restrict` khớp quyết định *"không dòng nào được xóa dây chuyền"*; 28 `set null` là cột kiểm toán `*_by`; **đổi hai `cascade` của `change_request_sessions` thành `restrict`** *(`session_id` cascade làm lịch sử "khách báo nghỉ buổi nào" biến mất nếu buổi bị xóa; `schedule_change_request_id` cascade vô hại nhưng yêu cầu không xóa cứng nên `restrict` cũng đúng)*. `--fix DB-IDX-01` in `indexes { … }`; với `organization_id` dùng index **dẫn đầu bằng nó** *(vd `(organization_id, course_id)`)* thay index đơn, gộp với 1.2.
- **Nợ cũ trên phần đã đổi — 8, phải quyết định** *(sửa hay ghi lý do để lại)*: `users.person_id` d578 · `users.facility_id` d580 *(+ thiếu index)* · `guardianships.ward_person_id` d1184 · `schedule_change_requests.anchor_session_id` d1840 *(+ thiếu index)* · `free_learning_rights.origin_exam_id` d2141 · `drop_in_tickets.facility_id` d2587 — cả sáu `restrict`. **Đề xuất `sửa`** trong cùng lượt này: các cột ấy đã đổi index hoặc ghi chú ở v4.4 và cùng nằm trong lượt viết lại `Ref`, không tốn thêm. Không trộn lượt này vào lượt cập nhật theo nhu cầu *(bảng cũ chỉ đổi khi nhu cầu đòi)* — làm một lượt riêng cho cả 56 bảng để không nối dài nợ.
- **An toàn khi đã có dữ liệu:** đổi hành vi xóa không chạm dữ liệu; index bằng `CREATE INDEX CONCURRENTLY` *(DB-EVO-04)*.
- **Hướng xử lý:** `sửa`.

### 1.9 · Phân loại dữ liệu từng cột chưa có — HIGH nhưng ưu tiên thấp · DB-SEC-01
- **Bằng chứng:** `DATA-DICTIONARY.md` mục 3.14 liệt kê 12 bảng mới theo *grain / cột mang rule / use case / GĐ*, không có cột mức *(công khai · nội bộ · cá nhân · nhạy cảm)*. v4.4 thêm cột cá nhân và nhạy cảm: `drop_in_tickets.holder_person_id` *(ngày sinh, ảnh của người chỉ mua vé)*, `guardianship_transfer_requests.verification_code_hash`, `bank_accounts.account_number`, `person_face_photos.uploaded_by`.
- **Cách sửa:** thêm cột *Mức* vào từ điển, bắt đầu từ 12 bảng mới và các cột kéo theo DB-SEC-04→07 *(ảnh, mã xác thực, mã học viên)*.
- **An toàn khi đã có dữ liệu:** không chạm schema.
- **Hướng xử lý:** `sửa`, ưu tiên thấp.

## Nhóm 2 — Cần quyết định *(không tự đặt đáp án cho câu vận hành; câu thiết kế có khuyến nghị)*

### 2.1 · Ảnh khuôn mặt — vẫn chưa ai trả lời "ai đã xem", và v4.4 làm nặng thêm — **CRITICAL** · DB-REQ-09 · DB-SEC-05 · DB-SEC-06 *(2.5 của v4.3)*
- **Bằng chứng mới so với v4.3:** (1) `view_face_photo` từ **cờ trên tài khoản** thành **quyền trong ma trận vai** *(`permissions` d714, `role_permissions` d751)* mà `owner` và `super_admin` cấp được cho **vai tự tạo nào cũng được** *(BR-QT-19 vế 2: "sửa vai là cấp quyền xem ảnh khuôn mặt")*. `change_logs` ghi việc **cấp** quyền; vẫn không bảng nào ghi việc **xem** ảnh. (2) `drop_in_tickets.holder_person_id` d2589 + `person_face_photos`: người mua **vé tháng** — không là học viên, có thể mua đúng một lần — có ảnh khuôn mặt, ngày sinh, SĐT; ảnh người lớn `expires_at` NULL *(BR-QT-09b: không hết hạn)* nên **giữ vô thời hạn** dù vé đã hết hạn. (3) DQ-76 *(đã mở)*: hạn ảnh đang đọc từ `age_groups.min_age_years ≥ 18` — bảng Sếp sửa được; sửa khoảng tuổi là âm thầm đổi chính sách giữ dữ liệu sinh trắc của trẻ em.
- **Câu cần chốt** *(chính sách — nêu hướng, không gắn khuyến nghị)*:
  - *Tình huống:* anh Phúc 32 tuổi mua vé tháng 700.000đ ngày 01/10/2026, dùng hết 12 buổi 25/10, vé hết hạn 31/12/2027 *(BR-SV-20)*, không bao giờ mua khóa. Ảnh anh chụp tại quầy 01/10 giữ đến khi nào? **(a)** đến khi anh yêu cầu xóa *(như người lớn hiện nay)* **(b)** xóa sau N tháng kể từ ngày vé hết hạn nếu không có khóa **(c)** xóa cùng lúc vé hết hạn. Hệ quả: (a) giữ nguyên schema, không bao giờ tự xóa; (b)(c) cần mốc "hết hiệu lực gần nhất của người này" suy từ vé và khóa + việc nền xóa thật.
  - Cần truy được ai xem ảnh không: **(a)** không ghi **(b)** ghi mỗi lần mở ảnh ở check-in thủ công **(c)** chỉ ghi lần tải về. Hệ quả schema nếu (b)/(c): bảng chỉ-thêm `face_photo_access_logs` *(người xem, ảnh, lúc, mục đích)* + hạn lưu riêng *(DB-SCL-05)*.
  - Kho đám mây ở nước ngoài: pháp chế đánh giá theo quy định bảo vệ dữ liệu cá nhân về sinh trắc học và chuyển dữ liệu ra nước ngoài — tôi không kết luận pháp lý.
- **Câu thiết kế kèm khuyến nghị:** hạn ảnh **không nên** đọc từ khoảng tuổi của bảng Sếp sửa được. Nghiêng: một tham số đứng riêng *(ngưỡng người lớn của hạn ảnh, đặt ở `operational_parameters` cạnh #3 `child_photo_validity_months`)*, để đổi khoảng tuổi nhóm không đổi chính sách ảnh; ngưỡng đó pháp chế/BA xác nhận.
- **Hướng xử lý:** `cần quyết định` — **chặn** việc dựng bảng log, **không chặn** phần còn lại.

### 2.2 · Nhóm tuổi: `persons.age_group_id` là giá trị suy ra bị lưu — DB-REQ-06 · DB-MOD-09 · DB-REQ-04 *(mới ở v4.4; gắn với DQ-75, DQ-76 đã mở)*
- **Bằng chứng:** `persons.age_group_id` d1125, `Note` d1156: *"suy từ `birth_date` khi có; cho phép ghi đè"*. BR-SV-19b *(đã xác nhận, BA 30/09)*: **tuổi tính tại ngày đăng ký khóa**, không tính lại giữa khóa, khóa sau tính theo ngày của khóa đó. Một cột lưu ở `persons` là giá trị tại **ngày nhập hồ sơ**, không phải ngày đăng ký từng khóa. Trước v4.4 cột là enum (cũng lệch); nay thêm: nhóm tuổi là danh mục Sếp sửa được nên đổi khoảng thì mọi giá trị lưu cũ lệch theo.
- **Tình huống có số:** bé sinh 15/05/2020 nhập hồ sơ 01/2026 *(5 tuổi 8 tháng, Baby)*; mua khóa kế tiếp 07/2026 *(6 tuổi 2 tháng, Trẻ em theo BR-SV-19)*. Cột vẫn ghi Baby nếu không ai sửa; `UC-10` *"lọc cứng theo nhóm tuổi"* xếp bé vào lớp / HLV cờ Baby.
- **Hướng:** **(a)** bỏ lưu, tính từ `birth_date` tại ngày đăng ký khóa với `age_groups` — `UC-10` đọc phép tính **(b)** giữ cột, thêm việc nền cập nhật khi tròn tuổi — lệch giữa chừng, không khớp "không tính lại giữa khóa" **(c)** giữ cột nhưng **chỉ** cho người không có ngày sinh — học viên riêng của HLV ngoài chỉ khai ảnh và tên *(BR-NG-09)*, thêm `CHECK (age_group_id IS NULL OR birth_date IS NULL)`.
- **Khuyến nghị (câu thiết kế):** **(c)** — một sự thật mỗi trường hợp: có ngày sinh thì suy, không có thì khai tay. Hỏi BA: *"cho phép ghi đè"* ở d1156 là yêu cầu hay giả định của người dựng schema *(nhãn tin cậy chưa ghi)*.
- **Còn mở từ trước:** DQ-75 *(`private_only`: chỉ lớp 1:1 hay không ghép nhóm tuổi khác — AC-558, UC-55 đọc khác AS-IS)* và DQ-76 *(xem 2.1)*. Schema chịu được cả hai đáp án.
- **Hướng xử lý:** `cần quyết định`.

### 2.3 · Định danh đăng nhập và hồ sơ người là hai nguồn — DB-REQ-04 · DB-REQ-02 *(mới ở v4.4)*
- **Bằng chứng:** BR-QT-20: khách đăng nhập bằng SĐT hoặc email; *"khách tự đổi email hay SĐT đăng nhập thì xác thực bằng mã gửi tới định danh mới"*. Schema: `users.login_identifier` d582 *(kèm `kind`)* **và** `persons.phone` d1122 / `persons.email` d1123 / `phone_verified_at` d1128. Không rule nào nói đổi một thì đổi kia; `Note` d585 nói mật khẩu và mã xác thực gửi theo kênh lấy từ `persons`.
- **Tình huống có số:** chị Lan đăng ký bằng SĐT 0912 345 678 *(`login_identifier` và `persons.phone` cùng số)*. Chị đổi định danh đăng nhập sang 0987 654 321, xác thực mã thành công. `persons.phone` vẫn 0912…; tin Zalo điểm danh của bé gửi theo số nào?
- **Hướng:** **(a)** hai nơi độc lập — đăng nhập một số, liên lạc số khác **(b)** khi `kind` trùng kênh *(phone ↔ `persons.phone`, email ↔ `persons.email`)* thì một thao tác đổi cả hai, `phone_verified_at` về NULL, vào `change_logs`; `kind = username` của nhân viên không đụng `persons` **(c)** bỏ `login_identifier` của khách, tra theo `persons` — cần unique trên `persons.phone`, trái BR-DK-04 *(một SĐT dùng cho nhiều con)*.
- **Khuyến nghị (câu thiết kế):** **(b)** — giữ cột vì đăng nhập cần unique index, nhưng một thao tác đổi hai chỗ.
- **Câu vận hành đi kèm** *(không khuyến nghị)*: bố và mẹ dùng chung một SĐT; mẹ đăng ký Portal trước, bố đăng ký sau bằng cùng số — `unique` toàn cục từ chối. Hướng: bố dùng email · bố dùng số khác · hai người dùng chung một tài khoản. BR-QT-20 viết *"email đăng nhập duy nhất **trong tổ chức**"*; schema duy nhất **toàn cục** *(`Note` d582 nêu lý do — master ngoài tổ chức)*, chặt hơn rule: một khách có email trùng ở hai tổ chức sẽ không đăng ký được tổ chức thứ hai. Ở cỡ một tổ chức chưa đau.
- **Hướng xử lý:** `cần quyết định`.

### 2.4 · Làm tròn tiền hoàn vé tháng — DB-REQ-01 · DB-REQ-11 *(mới ở v4.4)*
- **Bằng chứng:** BR-GI-26: hoàn vé tháng = **giá vé ÷ 12 × số buổi chưa dùng**; `ticket_reversals.amount` d2656 `decimal(12,2)`. 700.000 ÷ 12 không chia hết.
- **Tình huống có số:** vé 700.000đ đã dùng 5 buổi, xin hoàn 7 buổi còn lại → 700.000 ÷ 12 × 7 = **408.333,33đ**. Khách nhận bao nhiêu? **(a)** 408.333đ — làm tròn xuống đồng **(b)** 408.000đ — làm tròn xuống nghìn **(c)** 408.334đ — làm tròn lên đồng. Hệ quả: `amount` lưu số nào thì báo cáo doanh thu *(BR-GI-22)* cộng đúng số đó; không có quy tắc thì mỗi nhân viên một kiểu. Schema không đổi theo đáp án. Câu **vận hành** — không gắn khuyến nghị.
- **Hướng xử lý:** `cần quyết định`.

### 2.5 · Còn mở từ báo cáo v4.3 — không đổi trong v4.4, nêu lại để khỏi rơi

| v4.3 | Trạng thái ở bản dở |
|---|---|
| 1.1 hành vi xóa | chưa làm, thêm 46 khóa ngoại → **1.8** |
| 1.2 khóa ngoại chưa index | thêm 11 WARN → **1.8** |
| 1.3 khóa ngoại ghép | chưa làm, rộng thêm → **1.2** |
| 1.4 index cho RLS | 28/43 → **33/54**; thiếu `facility_id` vẫn ba bảng → **1.8** |
| 1.5 index thừa · thiếu `[check:]` | không đổi *(DB-IDX-04 ×4, DB-IDX-10 ×4, DB-INT-10 ×9, nợ cũ)* |
| 2.1 khoảng hiệu lực | không đổi: `price_list_items`, `operational_parameters`, `schedule_commitments`, `free_learning_right_coach_shares`, `coach_availabilities` vẫn không `EXCLUDE`; thêm `age_groups` → **1.5**. Câu cần BA vẫn là tình huống giá 1.600.000 → 1.700.000 |
| 2.2 xóa mềm — đăng ký lại | không đổi *(5 unique + `deleted_at`)*. v4.4 thêm một chỗ: HLV ngoài tự đăng ký ở GĐ2 *(BR-NG-12)* — HLV ngoài đã **ngừng hợp tác** `external_coaches.deleted_at` rồi quay lại thì `person_id unique` d2526 chặn tạo hồ sơ mới |
| 2.3 NULL trong unique | `time_slots`, `price_list_items` không đổi; `roles` → **1.6** |
| 2.4 `persons.email` không unique | không đổi — nghiêng vẫn là kênh liên lạc → miễn; phần đăng nhập → **2.3** |
| 2.5 ảnh khuôn mặt | còn mở, nặng thêm → **2.1** |
| 2.6 cỡ bảng | còn mở: một câu *"không quá vài trăm nghìn buổi mỗi năm"* giữ S/M. v4.4 thêm một lý do để hỏi: `change_logs` nay là **nơi duy nhất** giữ lịch sử quyền — `role_permissions` bỏ quyền là xóa dòng *(`Note` d766)* — và **hạn lưu `change_logs` chưa định** *(DB-SCL-05 INFO)*; để cạn lịch sử là mất dấu "ai từng có quyền gì" |

## Nhóm 3 — Miễn kèm lý do *(đề xuất; chưa ghi `waivers`)*

| # | Rule | Đích | Lý do đề xuất |
|---|---|---|---|
| 3.1 | DB-INT-14 *(3 mới + 8 nợ cũ)* | 11 quan hệ `ref: -`: `students.person_id` d1254 · `coaches.person_id` d2224 · `external_coaches.person_id` d2526 · `prospects.converted_student_id` d1450 · `courses.transferred_from_course_id` d1596 · `schedule_change_requests.proposed_commitment_id` d1845 · `teaching_units.class_occurrence_id` d2371 · `teaching_journals.class_occurrence_id` d2427 · `guardianship_transfer_requests.new_guardianship_id` d1231 · `student_evaluations.supersedes_evaluation_id` d2482 · `ticket_reversals.drop_in_ticket_id` d2654 | **Dương tính giả với `dbml2sql` 10.2.0 ghim.** Đã đọc DDL cả 11 dòng: khóa ngoại đúng chiều *(vd `ALTER TABLE "students" ADD FOREIGN KEY ("person_id") REFERENCES "persons" ("id")`, dòng 3106)* và cả 11 cột có `UNIQUE`. Giữ miễn chừng nào còn ghim 10.2.0. Nếu muốn bất biến theo phiên bản: đổi `ref: -` thành `ref: >` — cột đã `unique`, không bắt buộc |
| 3.2 | DB-IDX-01 *(INFO ×10 mới)* | mọi `*_by` mới | khóa ngoại kiểm toán trỏ `users`; tài khoản vô hiệu, không xóa — như 3.1 của v4.3 |
| 3.3 | DB-NAM-04 *(INFO ×4 mới)* | `users.must_change_password` · `permissions.supports_own_classes` · `age_groups.private_only` · `age_groups.applies_swim_commitment` | tên theo ngôn ngữ nghiệp vụ đã chốt, cùng khuôn `coaches.stop_new_students` |
| 3.4 | DB-MOD-15 *(INFO ×2 mới)* | enum `session_status` d326 · `weekly_exception_type` d463 *(11 giá trị)* | code rẽ nhánh theo từng giá trị — enum đúng. `user_role` vẫn là enum nhưng nay chỉ là danh sách **vai mẫu** *(`roles.template_role`)*, vai tự tạo là dữ liệu — hợp lý |
| 3.5 | DB-INT-09 *(INFO ×2 mới)* | `new_guardianship_id` · `supersedes_evaluation_id` | unique đơn trên cột cho NULL; NULL nghĩa "chưa có" — 1–1 tùy chọn đúng chủ đích |
| 3.6 | DB-INT-06 *(INFO)* | `persons` 9/15 cột cho NULL | `persons` là danh tính chung của học viên, phụ huynh, HLV, HLV ngoài, người mua vé tháng — NULL theo vai là chủ đích, đã ghi `Note` |
| 3.7 | DB-INT-15 | `users.organization_id` NULL ⇔ vai master | v4.3 là `CHECK (role = 'master') = (organization_id IS NULL)`; v4.4 vai nằm ở bảng khác nên CHECK mất, chuyển thành kiểm ứng dụng *(`Note` d611–615)*. Chấp nhận: một tài khoản duy nhất do Madison giữ; sai thì tài khoản bị cô lập hơn là rò rỉ *(RLS ẩn dòng NULL với mọi người trừ vai `BYPASSRLS`)*. Ghi vào ma trận cưỡng chế *(1.7)* |

Các đề xuất miễn 3.2–3.10 của v4.3 *(DB-INT-08, DB-MOD-06, DB-INT-02, DB-TYP-01, DB-TYP-04, DB-MOD-09, DB-MOD-18…)* vẫn đứng nguyên, chưa ghi.

## Phản biện requirement nhìn từ dữ liệu

> `check.py --requirements 1-yeu-cau` · 11 tài liệu · 8.815 dòng · 0 mã chết.

- **Rule không cưỡng chế được bằng schema hiện có:** (1) chống lệch tenant — hứa ở `Note`, chưa ở DBML *(1.2)* · (2) *một khoảng hiệu lực duy nhất* của giá, tham số, nhóm tuổi *(2.5, 1.5)* · (3) *truy ra ai đã xem ảnh* *(2.1)* · (4) *mỗi học viên một buổi trải nghiệm* và *đủ 12 lượt vé tháng* khi có hai thiết bị cùng quét *(1.7)* · (5) bản số *"một học viên một Khách hàng"* — chỉ đúng khi 1.1 sửa xong; DDL hiện tại làm nó đúng **quá mức**, chặn luôn luồng chuyển liên kết mà chính rule đó đòi.
- **Mâu thuẫn bản số còn trong `Note`:** `portal_notifications.recipient_user_id` d1397 vẫn viết *"hai người giám hộ cùng có tài khoản → hai dòng, mỗi người đọc riêng"* — BR-DK-09b *(đã xác nhận, BA 06/10)* chỉ còn **một** Khách hàng đang liên kết mỗi học viên; hai người giám hộ cùng nhận tin chỉ còn khi một người là HLV ngoài, mà HLV ngoài không nhận tin Portal. Sửa chữ, không đổi cấu trúc.
- **Hai nguồn sự thật:** (a) `users.login_identifier` ↔ `persons.phone/email` *(2.3)* · (b) `persons.age_group_id` ↔ `persons.birth_date` + `age_groups` *(2.2)* · (c) `courses.customer_person_id` ↔ `guardianships` đang hiệu lực — cùng trả lời *"ai là Khách hàng của học viên"*; nay một học viên chỉ một Khách hàng liên kết mà khóa đã mua **giữ** khách cũ sau chuyển *(`Note` d1245, nhãn suy luận "I", chờ BA soát)* — Portal của người cũ không còn thấy khóa, người mới thấy khóa mang tên người cũ · (d) khách đặt trải nghiệm trên Portal vừa có `persons` + `users` vừa thành một dòng `prospects` *(BR-DK-13d: "người đặt vào danh sách khách tiềm năng")* với tên, SĐT chép lại, nối về tài khoản chỉ qua `prospects.created_by` — hai lần đặt của cùng một khách là một hay hai dòng `prospects` chưa có rule *(không chặn; đi tiếp với: một dòng mỗi lần đặt, dedupe ở UC-53)*.
- **Thiếu — không chặn:** danh sách đủ của `permissions` *(`Note` d734: "BA không liệt kê, phiếu C2")* — schema chứa được, nhưng ma trận phân quyền của GĐ1 là **dữ liệu khởi tạo chưa có** *(M-13)*; nó là việc phải xong trước go-live, không phải trước khi dựng schema. Quy tắc làm tròn tiền hoàn *(2.4)*.
- **Mặc định mở khi vai tự tạo:** BR-QT-16 *(BA 30/09)* — `users.facility_id` trống nghĩa *toàn tổ chức* — được chọn khi chỉ có 11 vai cố định. Từ BR-QT-19 mỗi tài khoản mang vai tự tạo, một tài khoản tạo thiếu cơ sở là đọc cả tổ chức. Không mở lại quyết định; nêu để BA biết: màn tạo tài khoản bắt chọn rõ *"toàn tổ chức"* thay vì để trống là cách rẻ nhất *(lớp giao diện, không đổi schema)*.
- **Đắt khi chạy** *(DB-REQ-08 · DB-PERF-11)*: policy `facility_scope` đi qua bảng cha ở thêm bốn bảng mới *(`change_request_sessions`, `coach_certificates`, `ticket_reversals`, `guardianship_transfer_requests`)*, và `payment_receipts` có thêm nhánh `EXISTS` qua `facilities.bank_account_id` cho khoản chưa khớp. Cỡ S chấp nhận được; **đo bằng `EXPLAIN` khi có dữ liệu mẫu**, nhất là đường đối chiếu khuôn mặt ≤ 1 giây — nay thêm tập "người mua vé tháng còn hiệu lực" *(cần suy hạn vé từ `sold_at` và tham số #1 mỗi lượt)*.
- **Truy vết:** 6 định danh "chưa có chỗ chứa" đều là cột/bảng đã bỏ hoặc đổi tên có chủ đích *(`student_face_photos`, `external_coach_students`, `ad_hoc_support`, `oversize_class`; `age_group` và `can_check_in` — hai cái cuối vừa bỏ ở v4.4 nhưng tài liệu còn nhắc: `YEU-CAU-HE-THONG-MOI.md:365`, `USE-CASE-BOI-DAT.md:598`)*. **Ba dòng `USE-CASE-BOI-DAT.md:1362`, `:1817`, `:2644` còn chữ *"chờ `requirements-to-erd` lượt 7"* nhưng v4.4 đã có chỗ chứa** — vé tháng định danh → `drop_in_tickets.holder_person_id`; chứng chỉ, ngày vào làm → `coach_certificates` · `certificate_types` · `coaches.hired_on`; tài khoản HLV ngoài, học viên riêng tự đăng ký → `roles.template_role = 'external_coach'` + `guardianships.consent_confirmed_by`. Dòng lỗi thời, việc của tài liệu. **Bảng không có nguồn:** `external_coaches` d2524 — thêm mã *(`BR-NG-12`, `UC-34`, `UC-36`)* vào `Note`; so với v4.3 *(`organizations`, `facilities`, `guardianships`, `external_coaches`)* ba bảng kia đã có nguồn.

## Rule soát tay liên quan thay đổi *(8 rule máy chọn)*

| Rule | Kết luận | Bằng chứng ngắn |
|---|---|---|
| DB-INT-12 Khóa ngoại ghép giữ cùng tenant | **Vi phạm** | 105 khóa ngoại, 0 `Ref` ghép — **1.2** |
| DB-INT-15 Ma trận cưỡng chế rule | **Vi phạm một phần** | không có ma trận; bốn rule chỉ ở ứng dụng *(kể ở 1.7, 3.7, `role_permissions.scope = own_classes` chỉ khi `supports_own_classes`)*; `Note` ghi *"kiểm ở ứng dụng"* rải rác, không ai chịu trách nhiệm — **1.7** |
| DB-MOD-11 Tiền: sổ cái chỉ thêm | **Đạt hình dạng, chưa cưỡng chế** | dòng hoàn âm, hủy không xóa dòng bán; không `REVOKE` — **1.7**. Một lưu ý: doanh thu nay cộng ba sổ khác khuôn — `payment_receipts` *(received_at)*, `drop_in_tickets` + `ticket_reversals` *(sold_at, refunded_at)*, `external_session_blocks.price_paid` *(`purchased_at` kiểu `date`, không dòng hủy hay hoàn)*; báo cáo doanh thu *(BR-GI-22)* phải đọc cả ba. Block HLV ngoài không có đường hủy — không có rule nào đòi nên không báo lỗi |
| DB-MOD-14 Mô hình đa tenant | **Đạt về mô hình, chưa thực thi hàng rào** | cột tenant ở 54/56 bảng *(`permissions` toàn hệ thống là đúng)*; hàng rào ghép — **1.2** |
| DB-SEC-01 Phân loại dữ liệu từng cột | **Vi phạm** | từ điển không có cột mức — **1.9** |
| DB-EVO-02 Expand–contract | **Không áp dụng** nếu chưa có dữ liệu; **chưa có kế hoạch** nếu đã có | 16 thay đổi phá vỡ: `users.role` → `role_id`, enum `age_group` → bảng `age_groups` *(ba cột)*, `recorded_by` → `checked_in_by`, bỏ `ticket_code`, `is_primary`; đổi tên giá trị enum `multi_session_absence` → `absence_report` là `ALTER TYPE … RENAME VALUE` — tức thì, không phải xóa rồi thêm |
| DB-EVO-03 `NOT VALID` rồi `VALIDATE` | **Không áp dụng** nếu chưa có dữ liệu | 16 khóa ngoại mới + 3 unique thắt chặt mới *(`guardianships.ward_person_id`, `experience_sessions.student_id`, `free_learning_rights.origin_exam_id` — 1.1 đã nới hai cái)* |
| DB-EVO-08 Backfill chia lô | **Không áp dụng** | cột NOT NULL mới không mặc định: `users.role_id` *(seed vai mẫu mỗi tổ chức trước rồi nối)*, `monthly_ticket_uses.checked_in_by` · `check_in_method`. Dữ liệu `users` cỡ vài chục dòng, một giao dịch đủ |

## Nhận định chung

Phần dựng thêm của v4.4 **bám requirement chặt**: cả 16 thay đổi phá vỡ truy về một quyết định BA *(XD-55→62)*, hoàn tiền vẫn là dòng mới, bảng toàn cục `permissions` đúng chỗ, `Note` nêu lý do của các lựa chọn khó đảo ngược, từ điển khớp từng bảng. 0 lỗi cứng, 0 khóa ngoại mồ côi.

Rủi ro lớn nhất vẫn là **khoảng cách giữa lời hứa và thứ DDL thực thi được** — và v4.4 làm nó rộng hơn theo hai cách: khóa ngoại ghép *(lời hứa nay ở 34 bảng, thực thi 0)* và **unique một phần chỉ ghi ở `note`** *(9 index, 8 cái chặn đúng luồng mà rule mới của v4.4 đòi — chuyển liên kết, đặt lại trải nghiệm, sửa kết quả thi)*. Cả hai đều là việc cơ học nhưng nên xong **trước** khi ai nạp dữ liệu hay sinh DDL từ file này.

Về nội dung phải hỏi BA, đáng lo nhất là **ảnh khuôn mặt** *(2.1)*: quyền xem nay cấp được cho vai tự tạo, ảnh người mua vé một lần giữ vô thời hạn, hạn ảnh trẻ em phụ thuộc bảng khoảng tuổi Sếp sửa được — mà vẫn không ghi *"ai đã xem"*.

**Nên làm trước:** (1) 1.1 — sửa 9 index, vài chục dòng `Note`, không rủi ro · (2) một lượt `Ref` cho 1.2 + 1.8 trên cả 56 bảng, kèm 1.3 · 1.4 · 1.5 · 1.6 là các sửa cộng thêm nhỏ · (3) trình BA theo thứ tự **2.1 → 2.2 → 2.3 → 2.4** · (4) khai access pattern ở B4 để chấm DB-IDX-02/03, và xác nhận cỡ bảng.
