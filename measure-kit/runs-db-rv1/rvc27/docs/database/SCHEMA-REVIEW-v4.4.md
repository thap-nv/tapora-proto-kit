# SOÁT SCHEMA v4.4 — báo cáo chỉ đọc

> **Schema soát:** `docs/database/schema.dbml` v4.4 *(07/10/2026, lượt ERD 7 — chưa duyệt, chưa là `last-green`)* · **56 bảng · 612 cột · 37 enum · 159 giá trị enum · 211 ref · 109 index** · PostgreSQL. **Mọi số dòng `dNNN` là dòng của `schema.dbml` hiện tại.** Bản đối chiếu: `_check/last-green.dbml` (v4.3, 44 bảng) và `SCHEMA-REVIEW-v4.3.md`.
> **Soát bằng:** `db-schema-review` → `db-schema-design/scripts/check.py` *(hai parser DBML · rule tự soát · từ điển · truy vết)* + `rules.py --manual review` *(31 rule soát tay)* + đo tay bằng `dbml_model.py` + chạy thật `dbml2sql` 10.2.0 để xem DDL sinh ra. **Ngày 07/10/2026.**
> **Không sửa** `schema.dbml`, `schema-lint.json`, `DATA-DICTIONARY.md`, `schema.html`. Chỉ ghi vào `_check/` và file này. Không `promote`.

**Đầu vào cho gì.** Đầu vào cho cổng duyệt v4.4 và lượt ERD kế tiếp. Nhóm 1 là việc cơ học, làm thẳng; nhóm 2 là câu cần BA, **không tự đặt đáp án**; nhóm 3 là đề xuất miễn. Điều đáng đọc nhất: **1.1** *(máy không bắt — DDL sinh ra từ DBML trái với rule)* và **1.2** *(đường đặc quyền mới do vai thành dữ liệu)*.

## Giả định và phần chưa soát được

| | |
|---|---|
| **Cỡ bảng** | Giả định 🔴 A trong `schema-lint.json`: 1.000–1.500 học viên · ~50 HLV · 3 cơ sở · 5 năm → 56 bảng: 45 cỡ S, 11 cỡ M, 0 cỡ L. Chưa ai xác nhận *(2.10)*. `_ghi_chu` của file cấu hình còn ghi *"v4.4 ĐANG LÀM DỞ"* — cập nhật khi duyệt |
| **DB-IDX-02, DB-IDX-03** | **Chưa chấm** — `access_patterns` rỗng. Không đoán pattern |
| **Hiệu năng thực** | Không có dữ liệu mẫu, không `EXPLAIN`; nhận xét hiệu năng là suy từ cấu trúc |
| **DB-REQ-10** | Không áp dụng — lượt này không có dữ liệu mẫu để đối chiếu con số của requirement |
| **Cú pháp** | Đạt — `dbml-renderer` và `dbml2sql` đều nhận file |
| **Từ điển** | Đạt — 0 bảng không được nhắc · 0 cột thừa · 0 mục nói tới bảng đã bỏ |
| **Mốc nợ cũ** | `check.py` báo mốc do bản skill cũ ghi *(không có dấu bộ soát)*. Đã chạy `check.py rebaseline` — tính lại nợ trên `last-green.dbml`, **không đụng schema đang sửa**; bản mốc cũ lưu ở `_check/lint-baseline.before-rebaseline.json`. Số "nợ cũ" dưới đây là số sau khi tính lại |
| **Migration** | Dữ liệu chưa nạp *(làm sạch thuộc giai đoạn thực thi)* → mọi mục là thay đổi trên giấy. Mỗi mục vẫn ghi bước cần trước nếu về sau đã có dữ liệu |

## Kết quả máy

Chưa có miễn trừ nào: **mới ERROR 0 · WARN 62 · INFO 19** · nợ cũ ERROR 0 · WARN 211 · INFO 106.

| Rule | Mức | Mới | Nợ cũ | Việc |
|---|---|---:|---:|---|
| DB-INT-05 · hành vi xóa | WARN | 46 | 165 | **1.3** |
| DB-IDX-01 · FK chưa index | WARN | 11 | 26 | **1.4** |
| DB-IDX-01 · FK kiểm toán `*_by` + 1 dòng tổng hợp 33 bảng RLS | INFO | 10 | 41 | miễn *(3.1)* · **1.4** |
| DB-INT-14 · quan hệ 1–1 khai bằng `-` | WARN | 3 | 8 | **1.3** *(tự hết khi viết lại `Ref`)* |
| DB-INT-09 · NULL trong UNIQUE | WARN / INFO | 2 / 2 | 3 / 3 | **2.9** · 3.11 |
| DB-IDX-12 · unique + xóa mềm | WARN | 0 | 5 | **2.9** |
| DB-INT-07 *(1)* · DB-INT-08 *(1)* · DB-MOD-06 *(2)* | WARN | 0 | 4 | 2.9 · 3.2 · 3.3 |
| DB-INT-07 *(4)* · DB-IDX-07 *(1)* | INFO | 0 | 5 | 2.9 · **1.5** |
| INFO còn lại | INFO | 7 | 57 | nhóm 3 + 1.8 |

Máy **không bắt** được năm điều dưới đây — tìm ra bằng đo tay hoặc chạy `dbml2sql`: **1.1** *(unique "một phần" thành đầy đủ)* · **1.2** *(Ref ghép chỉ trên giấy, nay có đường đặc quyền)* · **1.6** *(bảng toàn cục không RLS)* · **2.2** *(chỗ chứa mẫu khuôn mặt)* · **2.7** *(chỗ chứa số lần nhập sai mã)*.

## So với báo cáo v4.3 — mục cũ đứng ở đâu

| v4.3 | Nội dung | Nay |
|---|---|---|
| 1.1 | 166 FK chưa khai xóa | **Còn nguyên**: 211/211 *(0 `Ref` rời, 0 `delete:`)* → **1.3** |
| 1.2 | 54 FK chưa index | **Còn**: 37 WARN *(11 mới)*; máy nay gộp phần `organization_id`/`facility_id` vào dòng tổng hợp → **1.4** |
| 1.3 | Khóa ngoại ghép chỉ trên giấy | **Còn nguyên, lớn hơn**: 82 FK / 19 bảng cha → **105 / 28**; 0 `Ref` ghép → **1.2** |
| 1.4 | Index cho RLS 28/43 bảng thiếu | **33/54** thiếu; ba bảng thiếu index cơ sở không đổi → **1.4** |
| 1.5 | Index thừa, `[check:]` | **Còn**: CHECK nằm trong `Note` ở 18 → **24 bảng** *(59 dòng)*, 0 `[check:]` → **1.8** |
| 2.1 | Khoảng hiệu lực | **Còn**, thêm `age_groups` → **2.3** |
| 2.2 · 2.3 · 2.4 | xóa mềm · NULL unique · `persons.email` | **Còn nguyên**; `roles` thêm một ca NULL → **2.9** |
| 2.5 | Ảnh khuôn mặt, không nhật ký xem | **Còn nguyên**, phạm vi rộng hơn *(vé tháng, quyền xem gán được)* → **2.1** |
| 2.6 | Cỡ bảng | **Còn** → **2.10** |
| *bảng không nguồn* | `facilities` · `guardianships` · `external_coaches` | Còn **một**: `external_coaches` → **1.8** |

## Nhóm 1 — Sửa thẳng ở lượt kế tiếp

### 1.1 · Chín unique "một phần" được khai thành unique đầy đủ — ERROR *(soát tay; máy báo 0)* · DB-IDX-12 · DB-INT-15
- **Bằng chứng:** DBML không có cú pháp index một phần, nên `indexes { col [unique, note: 'Partial: WHERE …'] }` sinh ra `CREATE UNIQUE INDEX … (col)` **không có `WHERE`**. Chạy `dbml2sql` 10.2.0 trên `schema.dbml`: **9/9 index** dưới đây ra DDL đầy đủ *(file ra: 0 dòng `WHERE` ở phần index)*. Quy ước của skill *(`dbml-conventions.md`)* là viết index một phần bằng SQL trong `Note`, không khai ở `indexes {}`.

| Bảng.cột : dòng | `Note` nói | DDL sinh ra chặn nhầm | Kết luận |
|---|---|---|---|
| `guardianships.ward_person_id` d1193 | `WHERE ended_at IS NULL AND relationship <> external_coach` | **Chuyển liên kết** (`BR-DK-09b`): dòng cũ `ended_at` còn, dòng mới cùng học viên → trùng. **Liên kết HLV ngoài** cùng một học viên đã có phụ huynh → trùng | **Chặn luồng hợp lệ** |
| `guardianship_transfer_requests.student_id` d1235 | `WHERE status = pending` | Học viên chỉ có **một yêu cầu trong suốt đời** — bị từ chối, rút, hết hạn rồi xin lại là trùng | **Chặn luồng hợp lệ** |
| `experience_sessions.student_id` d1508 | `WHERE student_id IS NOT NULL AND status <> cancelled_by_center` — *"buổi bị Bơi Đạt hủy thì đặt lại được"* | Bơi Đạt hủy buổi rồi, học viên **không đặt lại được** | **Chặn luồng hợp lệ** |
| `experience_sessions (prospect_id, class_occurrence_id)` d1507 | `WHERE student_id IS NULL` — *"một Khách hàng đặt cho HAI con vào cùng một buổi là hai dòng hợp lệ"* | `prospect_id` là `not null` (d1495) và là người **đặt**: hai con của cùng một khách vào cùng buổi → **trùng** đúng ví dụ mà `Note` cho là hợp lệ | **Chặn luồng hợp lệ** |
| `sessions.makeup_for_session_id` d2032 | `WHERE … status NOT IN (released, cancelled_by_center …)` | Buổi bù bị hủy/nhả thì **không xếp được buổi bù thứ hai** cho cùng buổi vắng | **Chặn luồng hợp lệ** |
| `free_learning_rights (student_id, swim_style_id)` d2152 | `WHERE status IN (waiting_paid_sessions, active)` | Quyền đã đóng *(`condition_lost`, `expired`)* thì **không cấp lại** cho cùng học viên × kiểu bơi | Chặn nếu quyền được cấp lại |
| `exams.session_id` d2102 | `WHERE status = scheduled` | Lần thi `cancelled`/`taken` đã chiếm buổi → không gắn lại cờ thi lên buổi đó | Chặn ở ca biên |
| `free_learning_rights.origin_exam_id` d2153 | `WHERE status IN (…)` | Một lần thi sinh tối đa một quyền *(chặt hơn `Note`)*; vướng khi sửa kết quả thi *(`BR-KT-22`)* sinh lại quyền từ cùng lần thi sau khi quyền cũ đã đóng | Chặn ở ca biên |
| `roles (organization_id, template_role)` d686 | `WHERE template_role IS NOT NULL` | `NULL` vốn "khác nhau" → tự thành một phần | Vô hại |

- **Thêm một dòng cần xác nhận:** `guardianships (guardian_person_id, ward_person_id)` d1192 unique đầy đủ trong khi quan hệ đóng bằng `ended_at` *(dòng cũ giữ làm lịch sử)* → **cùng một cặp không liên kết lại được** *(vd mẹ chuyển bé cho bố rồi xin chuyển lại)*. Nếu cho phép liên kết lại, đổi thành một phần `WHERE ended_at IS NULL`.
- **Báo cáo v4.3 cũng chưa bắt** ba mục có từ v4.0–v4.2 *(`sessions` · `exams` · `free_learning_rights`)*; sáu mục kia sinh hoặc đổi ở v4.4.
- **Cách sửa** *(làm với mọi dòng bảng trên)*: bỏ dòng khỏi `indexes {}` rồi ghi vào `Note` của bảng:
  `UNIQUE (một phần): CREATE UNIQUE INDEX guardianships_one_customer ON guardianships (ward_person_id) WHERE ended_at IS NULL AND relationship <> 'external_coach'`
  *(bộ soát đọc được dạng này — `index_lists` gộp cả index khai trong `Note`)*.
- **An toàn khi đã có dữ liệu:** bỏ unique đầy đủ là nới ràng buộc — an toàn. Thêm lại unique một phần phải kiểm trùng trước rồi `CREATE UNIQUE INDEX CONCURRENTLY` *(DB-EVO-04)*.
- **Hướng xử lý:** `sửa`.

### 1.2 · Khóa ngoại ghép chỉ có trên giấy — nay là đường đặc quyền — WARN · DB-INT-12 · DB-INT-15 · DB-MOD-14 *(v4.3 mục 1.3)*
- **Bằng chứng:** `dbml_model` đọc: **0 `Ref` ghép · 0 `UNIQUE (organization_id, id)`**; 54/56 bảng mang `organization_id`; **105 FK** không phải `*_by` nối bảng tenant với bảng tenant, trỏ tới **28 bảng cha** *(v4.3: 82 / 19)*; thêm 51 FK `*_by`. `Project Note` d170–183 và 37 chỗ trong ghi chú cột/bảng nói *"composite FK giữ hai đường không lệch"* — `dbml2sql` sinh DDL từ DBML nên **không sinh** chúng.
- **Điều mới của v4.4:** `users.role_id` d581 → `roles`. Ghi chú `users` d611–615 nói *"composite FK `(organization_id, role_id) → roles (organization_id, id)`"*, DBML không có. Kiểm tra toàn vẹn tham chiếu của PostgreSQL **bỏ qua RLS** — một dòng `users` của tổ chức A **trỏ được vào vai của tổ chức B** *(vai có quyền `view_face_photo` hay thao tác tiền)* và RLS giấu luôn chỗ sai đó. Khi vai còn là enum thì không có đường này; nay vai là dữ liệu thì thiếu khóa ghép **không chỉ là lệch dữ liệu mà là nâng quyền chéo tổ chức**. Cùng loại: `role_permissions.role_id`, `payment_receipts.bank_account_id`, `facilities.bank_account_id`.
- **Cách sửa** *(DBML ghép đã thử: cả `dbml-renderer` lẫn `dbml2sql` nhận, ra `FOREIGN KEY (organization_id, x_id) … ON DELETE RESTRICT`)*:
  ```dbml
  // 28 bảng cha:        indexes { (organization_id, id) [unique] }
  Ref: users.(organization_id, role_id) > roles.(organization_id, id) [delete: restrict]
  Ref: sessions.(organization_id, course_id) > courses.(organization_id, id) [delete: restrict]
  ```
  Làm **cùng 1.3 và 1.4** — một lượt viết lại `Ref`. Bỏ index FK đơn thừa *(cột ghép phủ cả hai; riêng đường `BYPASSRLS` của master không lọc theo tổ chức nên giữ đơn nếu cần)*. Chi phí: +28 unique index. FK `*_by` trỏ `users`: ghép hay không là quyết định riêng — gợi ý ghép *(`users.organization_id` NULL của master làm FK ghép bỏ qua, đúng ý)*.
- **An toàn khi đã có dữ liệu:** chạm dữ liệu — `ADD CONSTRAINT … NOT VALID` rồi `VALIDATE CONSTRAINT` *(DB-EVO-03)*; chưa có dữ liệu thì thêm thẳng.
- **Hướng xử lý:** `sửa` *(làm cho quyết định cách ly tầng CSDL `BR-QT-14` đúng; ưu tiên cao nhất cùng 1.1)*.

### 1.3 · 211 khóa ngoại chưa khai hành vi xóa — WARN · DB-INT-05 · DB-INT-14 *(v4.3 mục 1.1)*
- **Bằng chứng:** 211/211 ref là `ref:` inline, 0 `Ref` rời, 0 `delete:`. `dbml_lint.py --fix DB-INT-05` in sẵn 211 dòng `Ref`: **181 `restrict` · 28 `set null`** *(cột `*_by` cho NULL)* · **2 `cascade`** *(`change_request_sessions` d1892–1893)*.
- **Duyệt tay:** 181 `restrict` + 28 `set null` khớp quyết định *"đã có tiền vào thì không tự hủy"*. **Đổi hai `cascade`:** `schedule_change_request_id` giữ `cascade` được *(bảng nối thuộc yêu cầu)*; `session_id` đổi sang `restrict` vì dự án không xóa cứng buổi học *("dòng giữ lại làm vết")* — `cascade` ở đây xóa mất dấu vết yêu cầu nghỉ khi ai đó xóa buổi. Ghi chú `roles` d706 nói FK `users.role_id` là `RESTRICT` nhưng DBML chưa khai.
- **DB-INT-14 ×11** *(3 mới: `guardianship_transfer_requests.new_guardianship_id` d1231 · `student_evaluations.supersedes_evaluation_id` d2482 · `ticket_reversals.drop_in_ticket_id` d2654; 8 cũ)*: rule lo `dbml2sql` sinh FK **ngược chiều** khi khai bằng `-`. **Đã chạy thử trên cả 11: với `@dbml/cli` 10.2.0 — bản `check.py` ghim — cả 11 ra FK đúng chiều** *(vd `ALTER TABLE "students" ADD FOREIGN KEY ("person_id") REFERENCES "persons" ("id")`)*. Nghĩa là **không hỏng ở bản này** nhưng phụ thuộc phiên bản công cụ; viết lại sang `Ref: a.x > b.id [delete: …]` + `unique` ở cột — việc này nằm sẵn trong lượt viết `Ref` rời nên **không tốn thêm**. Nếu không viết lại: ghi miễn *"không tái hiện ở 10.2.0"*.
- **An toàn khi đã có dữ liệu:** đổi hành vi xóa không chạm dữ liệu hiện có.
- **Hướng xử lý:** `sửa`.

### 1.4 · FK chưa index và index cho chính sách RLS — WARN · DB-IDX-01 · DB-IDX-11 *(v4.3 mục 1.2 + 1.4)*
- **Bằng chứng:** DB-IDX-01 **37 WARN** *(26 cũ + 11 mới: `facilities.bank_account_id` d568 · `users.role_id` d581 · `role_permissions.permission_id` d755 · `course_products.age_group_id` d868 · `persons.age_group_id` d1125 · `guardianship_transfer_requests.current_guardianship_id` d1225 · `students.customer_source_id` d1261 · `prospects.age_group_id` d1448 · `prospects.customer_source_id` d1452 · `schedule_change_requests.preferred_time_slot_id` d1843 · `coach_certificates.certificate_type_id` d2252)*; 50 FK `*_by` là INFO *(3.1)*. **DB-IDX-11:** **33/54** bảng có `organization_id` không có index nào dẫn đầu bằng nó *(v4.3: 28/43)*; ba bảng có `facility_id` thiếu index dẫn đầu bằng cơ sở: `schedule_commitments` d1800 · `external_coaches` d2524 · `exception_acknowledgements` d2686. `users.role_id` nằm trên đường mọi lần đăng nhập đọc bộ quyền.
- **Cách sửa gộp với 1.2:** chỉ cần mỗi FK ghép của bảng con có index `(organization_id, cột_fk)` và bảng cha có `(organization_id, id)` là **32/33 bảng thiếu được phủ** *(đo: 14 bảng là cha, 32 là con của một FK ghép)*; còn lại **`change_logs`** cần `(organization_id, changed_at)` hoặc `(organization_id, entity_type, entity_id)`. `--fix DB-IDX-01` in sẵn phần FK đơn còn lại. Ba bảng cơ sở: `(organization_id, facility_id)`.
- **An toàn khi đã có dữ liệu:** `CREATE INDEX CONCURRENTLY` *(DB-EVO-04)*; không đổi ngữ nghĩa.
- **Hướng xử lý:** `sửa`. Cần `EXPLAIN` *(DB-PERF-10)* cho đường đối chiếu khuôn mặt ≤ 1 giây khi có dữ liệu mẫu.

### 1.5 · `users.login_identifier` không chuẩn hóa chữ hoa/thường và định dạng SĐT — WARN · DB-IDX-07 · DB-INT-08
- **Bằng chứng:** `login_identifier varchar(120) [not null, unique]` d582; `login_identifier_kind` d583 nay có `phone` và `email` *(BR-QT-20)*. Báo cáo v4.3 ghi điều kiện *"nếu có định danh kiểu email thì cần `lower()`"* — **điều kiện đã xảy ra**. `A@mail.com` và `a@mail.com` cùng qua unique; `0912345678` và `+84912345678` cũng vậy → hai tài khoản cho một người, và lộ chuyện *"đã có tài khoản"* khi khớp một dạng.
- **Cách sửa:** chuẩn hóa ở lớp ghi *(email thường hóa; SĐT về E.164)* và để CSDL giữ: `indexes { (\`lower(login_identifier)\`) [unique] }` **kèm** `CHECK: login_identifier = lower(login_identifier)`. Phạm vi toàn cục *(`DQ-15`)* giữ nguyên — đây là việc khác với 3.2.
- **An toàn khi đã có dữ liệu:** kiểm trùng trước: `SELECT lower(login_identifier), count(*) FROM users GROUP BY 1 HAVING count(*) > 1`; tạo index mới `CONCURRENTLY` rồi bỏ index cũ.
- **Hướng xử lý:** `sửa`.

### 1.6 · Bảng toàn cục không RLS: quyền ghi của vai ứng dụng — WARN · DB-SEC-02 · DB-SEC-03
- **Bằng chứng:** `permissions` d714 không có `organization_id`; `Note` d727–728: *"ứng dụng chỉ đọc, không bật RLS"* — nhưng `schema.dbml` không có `GRANT`/`REVOKE` nào *(0 kết quả)*. `organizations` d553 cũng không có policy nào được mô tả *(Project Note nói `tenant_isolation` áp "mọi bảng nghiệp vụ" và liệt kê `organizations` ngoài phạm vi lọc cơ sở)*. Hệ quả: một lỗ hổng SQL ở tổ chức A **sửa được danh mục quyền chung** của mọi tổ chức, và đọc được tên mọi tổ chức.
- **Cách sửa:** ghi vào `Note` hai dòng SQL: `REVOKE INSERT, UPDATE, DELETE ON permissions FROM app_user` *(thay đổi danh mục chỉ qua vai migration)* và `CREATE POLICY tenant_isolation ON organizations USING (id = current_setting('app.organization_id')::uuid)`.
- **An toàn khi đã có dữ liệu:** cộng thêm, không chạm dữ liệu. **Hướng xử lý:** `sửa`.

### 1.7 · Chưa phân loại dữ liệu từng cột — WARN · DB-SEC-01
- **Bằng chứng:** `schema.dbml` có 0 lần nhắc *nhạy cảm / PII / sinh trắc*; `DATA-DICTIONARY.md` có 1. Dự án giữ **sinh trắc của trẻ em** *(`person_face_photos`)*, định danh cá nhân *(`persons.birth_date` · `phone` · `email` · `zalo_user_id`)*, tài chính *(`bank_accounts.account_number`)*, bí mật xác thực *(`users.password_hash` · `guardianship_transfer_requests.verification_code_hash`)*, nhận xét nội bộ *(`student_evaluations.comment_internal`)*.
- **Cách sửa:** thêm cột *Mức nhạy cảm* vào từ điển cho từng cột `Note`/từ điển *(sinh trắc · định danh cá nhân · tài chính · xác thực · nội bộ · công khai)*, từ đó suy hạn lưu và vai được đọc. Việc ở từ điển, **không chạm CSDL**.
- **Hướng xử lý:** `sửa`.

### 1.8 · Việc nhỏ — INFO
- **DB-IDX-04** ×4 index là tiền tố của index khác: `portal_notifications.recipient_user_id` ×2 · `class_occurrences (coach_id, occurrence_date, start_time)` d1910 · `external_check_ins.external_session_block_id` d2557. **DB-IDX-10** ×4 index đơn trên `status`: `payment_receipts` · `sessions` · `free_learning_rights` · `teaching_unit_adjustments`. **DB-INT-10** ×9 cột số có biên chưa `[check:]` *(`courses.price_paid` · `drop_in_tickets.price` · `price_list_items.amount`…)*; CHECK trong `Note`: 59 dòng / 24 bảng, **0 `[check:]`** — `dbml2sql` không sinh CHECK trong `Note`, nên DDL sinh ra không có ràng buộc nào trong số đó.
- **`external_coaches` d2524** *(bảng không có nguồn)*: `Note` không trích mã `BR`/`TB`/`UC` nào. Thêm `BR-NG-01` · `BR-NG-12` · `UC-34` · `UC-36` — các mã đã dùng ở chỗ khác trong schema.
- **Hướng xử lý:** `sửa`, ưu tiên thấp.

## Nhóm 2 — Cần quyết định *(không tự đặt đáp án; lượt ERD đánh mã nối tiếp `DQ-77`)*

### 2.1 · Ảnh khuôn mặt: ai đã xem, giữ bao lâu, gồm cả người mua vé tháng — DB-REQ-09 · DB-SEC-05 · DB-SEC-06 · **CRITICAL** *(v4.3 mục 2.5, mở rộng)*
- **Bằng chứng:** `person_face_photos` d1302: không bảng nào ghi **việc đọc** ảnh; `uploaded_by` d1308 *(thêm ở v4.4)* chỉ ghi ai **tải**; `purged_at` ghi việc xóa. Ba điều **mới ở v4.4** làm vấn đề rộng ra: (1) `view_face_photo` thành **quyền gán được** cho vai tự tạo, `super_admin`/`owner` cấp *(`BR-QT-19` vế 2)* — thay đổi vai vào `change_logs`, còn mỗi lần mở ảnh thì không; (2) **người mua vé tháng** có ảnh trong hệ thống *(`BR-SV-13b`, `drop_in_tickets.holder_person_id` d2589)* mà **không phải học viên** — `expires_at` d1309 cho người lớn là NULL (*không hết hạn*, đọc từ khoảng tuổi `age_groups`), nên ảnh giữ vô thời hạn dù vé hết hạn cuối năm sau; (3) `coach_certificates` d2248 thêm một loại tệp cá nhân *(2.8)*.
- **Tình huống có số:** chị Hoa mua vé tháng 700.000đ / 12 buổi ngày 07/10/2026, quét mặt 12 lần, vé hết hạn 31/12/2027, không mua khóa. Ảnh chị còn trong hệ thống ngày 01/01/2030? Và nếu phụ huynh bé Na (6 tuổi) hỏi *"tuần trước ai đã mở ảnh con tôi"*, hệ thống có trả lời được không?
- **Câu cần chốt** *(chính sách — nêu hướng, không gắn khuyến nghị)*: (i) truy ai xem ảnh: (a) không ghi · (b) ghi mỗi lần mở ảnh ở màn check-in thủ công · (c) chỉ ghi lần tải về/xuất. (ii) ảnh người mua vé tháng chưa mua khóa: (a) giữ tới khi họ yêu cầu xóa *(hiện tại)* · (b) hết hạn cùng vé · (c) N tháng sau vé hết hạn. (iii) kho đám mây ở nước ngoài có cần pháp chế đánh giá theo quy định bảo vệ dữ liệu sinh trắc học và chuyển dữ liệu ra nước ngoài *(ví dụ Nghị định 13/2023/NĐ-CP — cần pháp chế xác nhận, tôi không kết luận pháp lý)*.
- **Hệ quả schema:** (i b/c) một bảng `face_photo_access_logs` chỉ-thêm *(người xem, ảnh, thời điểm, mục đích)* + hạn lưu riêng *(DB-SCL-05)*; (ii b/c) `expires_at` tính theo vé thay vì theo nhóm tuổi + việc dọn định kỳ.
- **Hướng xử lý:** `cần quyết` — **chặn** việc dựng bảng log, không chặn phần còn lại.

### 2.2 · Mẫu đặc trưng khuôn mặt nằm ở đâu — WARN · DB-REQ-01 · DB-SEC-06
- **Bằng chứng:** tìm *embedding · vector · template · mẫu khuôn* trong `schema.dbml`, `DATA-DICTIONARY.md` và 11 tài liệu requirement: **0 kết quả về chỗ lưu** *(hai dòng khớp từ khóa — `DOD-R4`, `TIEU-CHI` mục 4 — đều nói "mẫu khuôn mặt của anh chị em ruột", tức tập ảnh thử nghiệm, không phải cột dữ liệu)*. `Project Note` d269–275 nói đối chiếu **chạy phía máy chủ bằng một vai CSDL riêng**, trả `person_id` + độ tin cậy, ngưỡng ≤ 1 giây; `person_face_photos` chỉ giữ `storage_path` tới tệp trong kho đám mây. So 1 giây trên tệp ảnh nguyên bản không khả thi — phải có dữ liệu đặc trưng ở đâu đó.
- **Vì sao đáng chốt:** mẫu đặc trưng **cũng là dữ liệu sinh trắc**. `BR-QT-09j` chỉ định xóa vĩnh viễn ảnh *(`purged_at`)*; nếu mẫu nằm chỗ khác mà không bị xóa theo, ảnh đã xóa vẫn còn nhận diện được người. Cách ly tổ chức cũng phải phủ cả chỗ đó.
- **Hướng:** (a) bảng `face_templates (organization_id, person_id, photo_id, template …)` trong CSDL, chịu cùng `tenant_isolation`, xóa cùng `purged_at`; (b) dịch vụ nhận diện bên ngoài giữ mẫu — `Note` ghi nghĩa vụ *"xóa ảnh phải gọi xóa mẫu"* và nơi cách ly tổ chức. Câu thiết kế nên có khuyến nghị: **nghiêng (a)** nếu nhà cung cấp cho xuất mẫu *(một nơi, một vòng đời với ảnh)*; nếu là dịch vụ kín thì (b). Cần BA hỏi nhà cung cấp camera/nhận diện.
- **Hướng xử lý:** `cần quyết`.

### 2.3 · Khoảng hiệu lực chồng nhau và khoảng tuổi chồng/hở — DB-INT-11 · DB-MOD-12 · DB-REQ-04 *(v4.3 mục 2.1 + `age_groups` mới)*
- **Bằng chứng:** không đổi so v4.3: `price_list_items` d894 · `operational_parameters` d933 · `schedule_commitments` · `free_learning_right_coach_shares` · `coach_availabilities` d2285 — `effective_from` + `effective_to`, **không `EXCLUDE`** *(chỉ `time_slots` và `class_occurrences` có)*. **Mới:** `age_groups` d1011 giữ khoảng `[min_age_years, max_age_years)` sửa được, **không** chống chồng, **không** chống hở.
- **Tình huống có số:** *Gói 12 buổi* giá 1.600.000 từ 01/01; ngày 01/03 owner nhập 1.700.000 nhưng quên đóng dòng cũ; ngày 15/03 khách mua — giá nào? **Và:** Sếp tách *Trẻ em 6–18* thành 6–12 và 13–18 do gõ nhầm → em 12 tuổi 6 tháng không thuộc nhóm nào; `UC-10` lọc cứng theo nhóm nên em tự bị loại khỏi kết quả xếp lớp, không báo lỗi.
- **Hướng giá/tham số:** (a) giữ `effective_to` + `EXCLUDE USING gist (… WITH =, daterange(effective_from, effective_to) WITH &&)` · (b) bỏ `effective_to`, suy *"đến ngày dòng kế bắt đầu"* · (c) kiểm ở ứng dụng. **Hướng `age_groups`:** `EXCLUDE` chống được chồng nhưng **không chống được hở**; (b) *(bỏ `max_age_years`, mỗi nhóm kết thúc ở ranh giới nhóm kế)* chống cả hai.
- *Câu thiết kế nên có khuyến nghị:* giá và tham số **nghiêng (a)** *(giữ cách đọc, chống được hai người nhập đồng thời, tốn `btree_gist`)*; `age_groups` **nghiêng (b)**. **BA/owner quyết.**
- **Hướng xử lý:** `cần quyết`.

### 2.4 · `persons.age_group_id` lưu giá trị suy ra từ ngày sinh — DB-MOD-09 · DB-REQ-04 · DB-REQ-06 *(+ `DQ-75` `DQ-76` đang mở)*
- **Bằng chứng:** `persons.age_group_id` d1125 + `Note` d1156: *"suy từ `birth_date` khi có; cho phép ghi đè"* — **không ghi cơ chế đồng bộ** *(DB-MOD-09 đòi: nguồn sự thật, cơ chế, độ trễ chịu được)*. `BR-SV-19b` tính tuổi **tại ngày đăng ký khóa**, nghĩa là câu hỏi phụ thuộc thời điểm — một cột ở `persons` chỉ đúng tại lúc ghi.
- **Tình huống có số:** bé sinh 05/11/2023, nhập hồ sơ 07/10/2026 (2 tuổi 11 tháng) → lưu *Dưới 3 tuổi*. Ngày 12/11/2026 phụ huynh mua khóa, bé đã 3 tuổi; cột vẫn ghi *Dưới 3 tuổi* nếu không ai chạy việc cập nhật → lọc cứng HLV Baby và lớp 1:1 sai.
- **Hướng:** (a) bỏ giá trị lưu, suy lúc tìm slot / mua khóa từ `birth_date` + `age_groups`; ghi đè giữ ở cột `age_group_override_id` chỉ khi khác · (b) giữ cột, thêm việc chạy đêm và ghi cơ chế vào `Note`. Câu thiết kế → **nghiêng (a)** *(một nguồn sự thật; người không có ngày sinh dùng ghi đè — khớp `BR-NG-09`)*.
- **Thêm hai chỗ cùng gốc:** *"người lớn = 18"* nằm ở **hai nơi** — `age_groups` *(nhóm Người lớn, `min_age_years`)* và tham số #22 `adult_salutation_age` = 18 d983: đổi một nơi, nơi kia không theo; hai ngưỡng này cố ý trùng hay độc lập? *(vận hành — không khuyến nghị)*. `DQ-76` đã nêu việc hạn ảnh đọc từ ô sửa được của danh mục — Sếp đổi *Người lớn* từ 18 xuống 16 thì ảnh người 16–17 tuổi thôi hết hạn mà không ai quyết điều đó.
- **Hướng xử lý:** `cần quyết`.

### 2.5 · Hủy nhầm một vé thì làm sao — DB-REQ-03 · DB-MOD-11
- **Bằng chứng:** `ticket_reversals.drop_in_ticket_id` d2654 `unique` — *"một vé bị hủy HOẶC hoàn tối đa một lần"*; bảng chỉ-thêm, không có cột nào đánh dấu một dòng hủy là **nhầm**. Doanh thu trừ vào ngày bán *(`BR-GI-26`)*.
- **Tình huống có số:** Sale hủy vé lượt số 41 *(60.000đ)* nhầm sang vé của khách đang bơi. Hệ thống ghi một dòng `amount = -60.000`; khách vẫn trong hồ.
- **Hướng:** (a) không đảo — bán vé mới *(sổ sạch; vé 41 mãi mãi là đã hủy)* · (b) cho **hủy lần hủy**: thêm `voided_at/voided_by` ở `ticket_reversals`, đổi unique thành một phần `WHERE voided_at IS NULL`, doanh thu bỏ dòng đã void. Hệ quả: (a) báo cáo ngày đã gửi vẫn sai 60.000 và mất một vé; (b) thêm một vòng đời cho sổ cái.
- **Hướng xử lý:** `cần quyết` — câu **vận hành**, nêu hướng, không gắn khuyến nghị.

### 2.6 · Hai giả định 🟡 I đã nằm trong `Note` nhưng chưa có mã `DQ`
- **(i)** `guardianship_transfer_requests` d1245: sau khi chuyển liên kết, khóa đã mua **giữ `customer_person_id` cũ**. Tình huống: mẹ Hà mua khóa 12 buổi 1.600.000 cho bé Na hồi 09/2026; 10/2026 bố Nam xin liên kết và mẹ đồng ý. Khóa vẫn đứng tên Hà nhưng Hà **không còn thấy** khóa và hóa đơn trên Portal *(`DOD-15`)*; tin hết hạn gửi cho ai? Hướng: (a) giữ như hiện tại · (b) chuyển `customer_person_id` của khóa còn hiệu lực sang khách mới · (c) cho khách cũ xem khóa do mình mua, chỉ không xem tin mới.
- **(ii)** `coach_certificates` d2278: HLV **chưa từng có** dòng loại chứng chỉ bắt buộc thì **không bị chặn**. Tình huống: ngày go-live, *Cứu hộ* bắt buộc; HLV Nam chưa ai nhập dòng nào → vẫn nhận học viên mới. Hướng: (a) như hiện tại · (b) chặn cho tới khi nhập — ngày go-live **cả 50 HLV** bị chặn tới khi nhập xong.
- **Hướng xử lý:** `cần quyết` *(cả hai là vận hành; không khuyến nghị)*.

### 2.7 · Chỗ chứa số lần nhập sai mã xác thực — DB-REQ-01 · DB-SEC-03
- **Bằng chứng:** `AC-362` · `UC-52` nhánh `3a`: *nhập sai mã nhiều lần → khóa gửi mã (5 lần, 15 phút — đề xuất Madison 29/09, 🔴 A)*. `guardianship_transfer_requests` d1221 giữ `verification_code_hash` + `code_expires_at` nhưng **không có số lần sai** *(không `failed_attempts`, không mốc khóa)*; mã đăng ký Portal bằng SĐT/email không có bảng — `persons.phone_verified_at` d1128 chỉ ghi **kết quả**. Nếu mã ngắn *(vd 6 chữ số)* thì băm không đủ chống dò — người xin liên kết chỉ cần biết **mã học viên**, thứ khó coi là bí mật. *Độ dài mã chưa có ở requirement; đây là điều kiện, không phải kết luận.*
- **Câu thiết kế** *(nên có khuyến nghị)*: trạng thái khóa tạm giữ ở **bộ nhớ đệm** hay **bảng bền**? **Nghiêng:** bộ nhớ đệm cho rate-limit theo người gửi; **thêm `failed_attempts smallint` vào `guardianship_transfer_requests`** để một yêu cầu tự hủy sau N lần sai *(giới hạn theo yêu cầu, không chỉ theo người)*. Nếu cần truy *"ai đã bị khóa"* thì bảng bền.
- **Hướng xử lý:** `cần quyết`.

### 2.8 · Tệp chứng chỉ HLV giữ bao lâu — DB-SEC-06 *(mới ở v4.4)*
- **Bằng chứng:** `coach_certificates.storage_path` d2255 *(kho đám mây, mã hóa khi lưu — đúng DB-SEC-07)* nhưng chỉ có `deleted_at` d2259 *(xóa mềm khi nhập nhầm)*; **không** `purged_at`/`purged_by` như `person_face_photos` và `student_attachments`. Bản chụp chứng chỉ có thể mang số giấy tờ cá nhân.
- **Tình huống có số:** HLV Nam nghỉ việc 03/2026 *(`coaches.left_at`)*. Tới 10/2027 bản chụp bằng cứu hộ của anh còn nguyên.
- **Hướng:** (a) giữ tới khi HLV yêu cầu xóa · (b) xóa N tháng sau `left_at` · (c) không bao giờ xóa *(cần lý do để ghi)*. Hệ quả (a)/(b): thêm `purged_at/purged_by` + việc dọn định kỳ.
- **Hướng xử lý:** `cần quyết` — vận hành/chính sách, không khuyến nghị.

### 2.9 · Các câu cũ còn nguyên *(từ v4.3 — nội dung đã nêu đủ ở báo cáo đó)*
- **Hồ sơ đã xóa mềm — đăng ký lại thì sao** *(2.2 cũ, DB-IDX-12 ×5, không đổi)*: `students.person_id` · `students (organization_id, student_code)` · `facilities (organization_id, name)` · `prospects.converted_student_id` · `external_coaches.person_id`. Hướng (a) khôi phục hồ sơ cũ · (b) tạo hồ sơ mới *(đổi unique thành một phần)*. **Không gắn khuyến nghị** *(vận hành)*.
- **NULL trong UNIQUE** *(2.3 cũ + mới)*: `time_slots.facility_id` d776 · `price_list_items` d907 — NULL nghĩa *"áp cho tất cả"* hay *"chưa nhập"*? **Mới:** `roles (organization_id, name)` d685 — `organization_id` NULL của dòng vai mẫu master: có thể có hai dòng master trùng tên; vai `master` là **một** dòng toàn hệ thống nên nếu muốn chắc thì thêm index một phần `WHERE organization_id IS NULL` *(nghiêng miễn: một tài khoản, Madison giữ)*.
- **`persons.email` không unique** *(2.4 cũ)*: kênh liên lạc dùng chung như SĐT → miễn; định danh → unique theo tổ chức. Không đổi từ v4.3 *(đăng nhập đã có `users.login_identifier`)*.

### 2.10 · Cỡ bảng — xác nhận giả định 🔴 A *(v4.3 mục 2.6)*
- Một lời xác nhận *"không quá vài trăm nghìn buổi/năm"* là đủ để giữ S/M. Nếu `sessions`, `change_logs` hay `portal_notifications` có thể lên cỡ L thì đổi **bốn** thứ: UUIDv7 thay v4, index dẫn bằng khóa phạm vi, hạn lưu *(DB-SCL-05 — `change_logs` và `portal_notifications` hiện chưa ghi hạn lưu)*, phân vùng.
- **Hướng xử lý:** `cần quyết` *(một câu, trả lời một dòng)*.

## Nhóm 3 — Miễn kèm lý do *(đề xuất; chưa ghi `waivers` — chờ BA/lượt ERD xác nhận)*

| # | Rule | Đích | Lý do đề xuất |
|---|---|---|---|
| 3.1 | DB-IDX-01 *(INFO ×50)* | mọi `*_by` | FK kiểm toán trỏ `users`; vô hiệu/xóa mềm tài khoản, không xóa cứng |
| 3.2 | DB-INT-08 | `users.login_identifier` d582 | duy nhất **toàn cục** có chủ đích *(`DQ-15`: master không thuộc tổ chức nào)*; phần chuẩn hóa là mục **1.5**, không miễn |
| 3.3 | DB-MOD-06 | `change_logs.entity_type+entity_id` d2711 · `exception_acknowledgements` d2686 | nhật ký/ghi nhận chỉ-thêm, không JOIN theo `entity_id`. Kiểm lại: `exception_acknowledgements` có đúng là chỉ-ghi không |
| 3.4 | DB-INT-02 | `persons.zalo_user_id` d1124 | định danh ngoài — khai `non_fk_id_columns` |
| 3.5 | DB-TYP-01 | 55/56 PK `uuid` v4; `change_logs` d2711 PK `bigint` | cỡ S/M; `change_logs` chỉ-thêm, id tăng đều nên `bigint identity` hợp. Đổi sang `uuidv7()` khi có kết luận 2.10 |
| 3.6 | DB-TYP-04 *(INFO ×6)* | `courses.purchased_at/starts_at/expires_at` · `coaches.left_at` · `external_session_blocks.purchased_at` · `person_face_photos.expires_at` | kiểu `date` mà tên `_at` — là **ngày**; đổi tên kéo sửa dây chuyền tài liệu, không đáng; ghi trong từ điển |
| 3.7 | DB-MOD-09 *(INFO ×4)* | `total_sessions` ×3 · `drop_in_tickets.sessions_total` | số buổi **đã mua**, snapshot lúc bán, không suy ra. *(Khác `persons.age_group_id` — mục 2.4 — giá trị đó suy ra được từ cột khác)* |
| 3.8 | DB-MOD-15 *(INFO ×3)* | enum `user_role` · `session_status` · `weekly_exception_type` | code rẽ nhánh theo từng giá trị. `weekly_exception_type` thêm giá trị mỗi phiếu, nhưng giá trị mới luôn đi cùng code xử lý → enum đúng |
| 3.9 | DB-MOD-18 *(INFO ×11)* | `person_face_photos` · `care_contacts` · `bonus_session_grants` · `drop_in_tickets` · `change_logs`… | mỗi bảng có mốc thời điểm tương đương `created_at` *(`uploaded_at` · `contacted_at` · `granted_at` · `sold_at` · `changed_at`…)*; `change_request_sessions` là bảng nối thuần |
| 3.10 | DB-NAM-04 *(INFO ×6)* | `coaches.stop_new_students` · `prioritize_extra_classes` · `users.must_change_password` · `permissions.supports_own_classes` · `age_groups.private_only` · `applies_swim_commitment` | tên boolean theo ngôn ngữ nghiệp vụ đã chốt |
| 3.11 | DB-INT-09 *(INFO ×5)* | `prospects.converted_student_id` · `courses.transferred_from_course_id` · `schedule_change_requests.proposed_commitment_id` · `guardianship_transfer_requests.new_guardianship_id` · `student_evaluations.supersedes_evaluation_id` | unique đơn trên FK cho NULL = quan hệ 1–1 tùy chọn, đúng chủ đích |
| 3.12 | DB-INT-06 | `persons` — 9/15 cột cho NULL | bảng danh tính chung cho học viên, phụ huynh, HLV, người mua vé: mỗi vai cần một tập con. `persons.gender` bắt buộc với HLV kiểm ở ứng dụng *(d1126 đã ghi)* |
| 3.13 | DB-IDX-09 *(INFO ×2)* | `time_slots` d776 · `price_list_items` d907 — index 5 cột | bảng cấu hình cỡ S |

## Phản biện requirement nhìn từ dữ liệu

> `check.py --requirements 1-yeu-cau` · 11 tài liệu · 8.815 dòng · `requirement_code_pattern` theo không gian mã của dự án.

- **Rule không cưỡng chế được bằng schema hiện có:** (1) **chống lệch tenant** `BR-QT-14` — hứa ở `Project Note`, chưa ở DBML; nay phủ cả **vai và quyền** *(1.2)* · (2) **một học viên một Khách hàng** `BR-DK-09b` — index khai sai nên DDL chặn cả luồng chuyển liên kết *(1.1)* · (3) **buổi trải nghiệm đặt lại được, hai con cùng một buổi, buổi bù, quyền học free cấp lại** — cùng nguyên nhân *(1.1)* · (4) **một khoảng hiệu lực duy nhất** của giá, tham số, nhóm tuổi *(2.3)* · (5) **truy ai đã xem ảnh** *(2.1)* · (6) **khóa sau 5 lần sai mã** `AC-362` *(2.7)*. **Chỉ nằm ở ứng dụng, có chủ đích:** `payment_collections.amount_collected` d1774 phải bằng Σ phần chia của `payment_receipts` — `BR-GI-27`/`UC-02` ghi *"kiểm ở ứng dụng, trong cùng giao dịch"*; chấp nhận được ở cỡ này, nếu muốn cưỡng chế ở CSDL thì dùng `CONSTRAINT TRIGGER … DEFERRABLE INITIALLY DEFERRED` *(INFO)*. 59 dòng CHECK trong `Note` đều ở trạng thái *chỉ là lời hứa* cho tới khi viết migration *(1.8)*.
- **Nhu cầu dữ liệu chưa có chỗ chứa:** **mẫu đặc trưng khuôn mặt** *(2.2)* · **số lần nhập sai mã** *(2.7)* · **lần hủy vé nhầm** *(2.5)*. Máy tìm **6 định danh** còn nhắc ở tài liệu mà schema không có: `external_coach_students` · `ad_hoc_support` · `oversize_class` · `student_face_photos` *(cột/bảng đã bỏ có chủ đích từ trước)* và **hai mới do v4.4 gỡ**: `age_group` *(`YEU-CAU-HE-THONG-MOI.md:365`, enum đã thành bảng)* · **`can_check_in`** *(`USE-CASE-BOI-DAT.md:598` — tài liệu còn viết `ACT-03 … hoặc nhân viên có can_check_in`; cột đã bỏ, nay là quyền `check_in` ở `role_permissions`; sửa chữ ở tài liệu, schema đúng)*. **Bốn câu** khớp mẫu *"chờ … lượt ERD"*: `USE-CASE-BOI-DAT.md:1817` *(chỗ chứa chứng chỉ, ngày vào làm)* và `:2644` *(tài khoản HLV ngoài, học viên riêng tự đăng ký)* **đã cũ** — v4.4 đã có `coach_certificates` · `coaches.hired_on` · `users`+`roles` · `guardianships.consent_confirmed_by`; `:1362` *(vé tháng định danh — đã có `holder_person_id`)* và `AS-IS-BOI-DAT-v2.md:42` *(hiện trạng bảng giá)* là mô tả, không phải việc treo. Cập nhật ba dòng tài liệu khi chốt v4.4.
- **Bảng không có nguồn:** `external_coaches` d2524 *(1.8)*; `organizations` *(hạ tầng, miễn)*. **Mã chết:** 0.
- **Hai nguồn sự thật:** `courses.customer_person_id` ↔ liên kết giám hộ đang hiệu lực *(2.6 i)* · *"người lớn = 18"* ở `age_groups` và tham số #22 *(2.4)* · `persons.age_group_id` ↔ `persons.birth_date` *(2.4)*. Phần có chủ đích và có ghi: `payment_collections.collected_at/by` chép sang `received_at`/`matched_by` của phần chia *(DB-PERF-01 — nguồn, cơ chế, lý do đều đã nêu ở `Note` d1791)*.
- **Đắt khi chạy** *(DB-REQ-08 · DB-PERF-11)*: policy `facility_scope` cho `persons` là `EXISTS` qua `courses` / `guardianships` / `coaches` / `external_coaches` và **nay thêm `drop_in_tickets.holder_person_id`** *(vé tháng)* — năm nhánh `OR` ở mỗi lượt đọc `persons`; đường đối chiếu khuôn mặt miễn `facility_scope` nhưng vẫn qua `tenant_isolation`. **Phải đo bằng `EXPLAIN`** khi có dữ liệu mẫu.

## Soát tay 31 rule — kết quả

| Kết quả | Rule |
|---|---|
| **Đạt** | DB-MOD-01 *(danh tính tách ở `persons`)* · DB-MOD-02 *(`payment_collections` · `ticket_reversals` · `guardianship_transfer_requests` có vòng đời riêng)* · DB-MOD-08 *(giá, tài khoản nhận là snapshot)* · DB-MOD-11 *(hoàn tiền là dòng mới, `amount < 0`; ngoại lệ ghi ở 2.5)* · DB-MOD-17 *(xóa mềm ở 9 bảng, có chủ đích; còn 2.9)* · DB-PERF-01 · DB-SEC-07 *(tệp ảnh, chứng chỉ để ngoài CSDL, mã hóa khi lưu)* · DB-REQ-02 *(ngoài mục 1.1)* |
| **Vi phạm / ghi nhận** | DB-INT-12 · DB-INT-15 · DB-MOD-14 → **1.2** · DB-IDX-11 → **1.4** · DB-MOD-12 → **2.3** · DB-REQ-01 → **2.2 · 2.7** · DB-REQ-03 → **2.5 · 2.9** · DB-REQ-04 · DB-REQ-06 → **2.4 · 2.6** · DB-REQ-08 → *Đắt khi chạy* · DB-REQ-09 · DB-SEC-05 · DB-SEC-06 → **2.1 · 2.8** · DB-SEC-01 → **1.7** · DB-SEC-02 · DB-SEC-03 → **1.6** |
| **Không áp dụng** | DB-EVO-02 · 03 · 04 · 06 · 07 · 08 *(chưa có dữ liệu, chưa chạy migration; thay đổi v4.3→v4.4: **16 phá vỡ · 19 chạm dữ liệu** — chỉ đau nếu đã nạp)* · DB-REQ-10 *(không có dữ liệu mẫu)* |
| **Chưa chấm** | DB-IDX-02 · DB-IDX-03 *(chưa có access pattern)* |

## Nhận định chung

Schema v4.4 **giữ được kỷ luật quan hệ** của v4.3 *(0 ERROR máy, 0 FK mồ côi, tiền `decimal`, thời điểm `timestamptz`, từ điển khớp từng bảng và cột)* và mười hai bảng mới theo đúng khuôn: sổ cái tiền chỉ-thêm *(`ticket_reversals`, dòng hoàn)*, vai tách khỏi người, quyết định khó đảo ngược ghi lý do ở `Note`. Điểm mạnh nhất vẫn là `Note` — nó nêu cả giá của mỗi lựa chọn, kể cả những giả định 🟡 I còn chờ BA.

Rủi ro lớn nhất vẫn là **khoảng cách giữa lời hứa ở `Note` và DDL thực sinh ra**, và v4.4 làm khoảng cách đó nguy hiểm hơn ở hai chỗ: **(1.1)** chín unique "một phần" thành đầy đủ, trong đó năm cái **chặn luồng hợp lệ** *(chuyển liên kết, xin lại, đặt lại buổi trải nghiệm, đặt hai con vào một buổi, xếp lại buổi bù)* — máy không thấy được, chỉ lộ khi đọc DDL; **(1.2)** khóa ghép tenant vẫn chưa có trong DBML, và từ khi vai thành dữ liệu, thiếu nó là **đường nâng quyền chéo tổ chức**, không chỉ lệch dữ liệu. Phía chính sách dữ liệu, chỗ còn hở là **sinh trắc**: không ghi ai đã xem ảnh *(2.1)* và không rõ **mẫu đặc trưng** nằm đâu để xóa cùng ảnh *(2.2)*.

**Nên làm trước:** (1) một lượt viết lại cho **1.1 + 1.2 + 1.3 + 1.4** — cùng đụng `indexes {}` và 211 dòng quan hệ, và nên hoàn tất **trước** khi duyệt v4.4 làm `last-green` *(nếu không, 211 + 105 dòng nợ đi tiếp vào mốc mới)* · (2) trình BA theo thứ tự **2.1 → 2.2 → 2.3 → 2.4 → 2.7** *(2.1 là câu duy nhất có rủi ro pháp lý)*; 2.5, 2.6, 2.8 là câu vận hành ngắn · (3) khai access pattern ở bước B4 để chấm DB-IDX-02/03.

## Phụ lục — lệnh đã chạy và thay đổi trong `_check/`

- `check.py docs/database --dictionary DATA-DICTIONARY.md --requirements 1-yeu-cau` *(hai lần: trước và sau `rebaseline`)* · `check.py rebaseline docs/database` · `rules.py --explain _check/report.json` · `rules.py --manual review` · `report.py --rule DB-IDX-01 | DB-INT-05 | DB-INT-14 · --debt · --diff` · `dbml_lint.py --fix DB-INT-05` · `dbml_model.py --outline | --stats` và đo tay bằng `dbml_model` *(khóa ghép, index dẫn bằng `organization_id`, unique một phần, CHECK trong `Note`)* · `dbml2sql` 10.2.0 trên bản sao `schema.dbml` và trên một DBML thử khóa ghép — **cả hai ở thư mục tạm ngoài dự án**.
- **Ghi vào `_check/`:** `report.json` *(ghi đè bằng kết quả lần soát này; bản v4.3 vẫn ở `report-v4.3.json`)* · `lint-baseline.json` *(tính lại)* · `lint-baseline.before-rebaseline.json` *(bản trước khi tính lại)*. **Không** đụng `last-green.dbml`, `schema.dbml`, `schema-lint.json`, `schema.html`, `DATA-DICTIONARY.md`.
