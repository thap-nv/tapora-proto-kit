# SÓNG XANH — ĐẶC TẢ USE CASE & MA TRẬN ACTOR × USE CASE v1

> Ngày: 2026-09-20 · Đầu vào: `YEU-CAU-HE-THONG-SONG-XANH.md` (`YC-*`) · `BUSINESS-RULES-SONG-XANH.md` (`BR-*`) · `EDGE-CASES-SONG-XANH.md` (`A-*`).
> Đầu ra kế tiếp: tiêu chí nghiệm thu, prototype.
> ⏱ Bản 20/09. Quyết định gỡ xung đột chốt sau ngày này nằm ở `XUNG-DOT-SONG-XANH.md` (`XD-*`), **đè lên** đoạn nào trong file này trái với nó. File này chưa cập nhật theo.

## Quy ước

| Tiền tố | Nghĩa |
|---|---|
| `UC-nn` | Use case |
| `ACT-nn` | Actor người |
| `⚙` | Hệ thống tự chạy theo thời gian hay sự kiện |

**Mức độ tin cậy:** 🟢 **C** confirmed · 🟡 **I** inferred · 🔴 **A** assumed.

Bước con trong luồng đánh số kiểu Cockburn (`3a` = nhánh rẽ ở bước 3), **không** phải mã.

---

## 1. Actor

| Mã | Actor | Bề mặt | Ghi chú |
|---|---|---|---|
| ACT-01 | Quản lý trung tâm | Web quản trị | Chủ trung tâm và một quản lý ca |
| ACT-02 | Lễ tân | Web quản trị | 3 người, chia ca sáng và chiều |
| ACT-03 | Huấn luyện viên (HLV) | Web quản trị, máy tính bảng ở thành bể | 9 người, mỗi người 3–6 lớp |
| ACT-04 | Phụ huynh | App phụ huynh | Một phụ huynh có thể có nhiều con học ở trung tâm |
| ⚙ | Hệ thống | — | Sinh buổi học, gửi nhắc lịch, chốt điểm danh cuối ngày |

## 2. Danh sách use case

### A. Học viên

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-01 | Đăng ký học viên mới | ACT-02 | GĐ1 | `YC-01` | `BR-HV-01/02/04` | 🟢 C |

### B. Khoá học và lớp

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-03 | Tạo khoá học và mở lớp | ACT-01 | GĐ1 | `YC-02` | `BR-LH-01/02/05` `BR-LI-01` | 🟢 C |
| UC-04 | Xếp học viên vào lớp | ACT-02 | GĐ1 | `YC-03` | `BR-LH-03/04` · `A-01` `A-06` | 🟢 C |

### C. Lịch

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-06 | Phụ huynh xem lịch học, số buổi còn lại và các lần đóng tiền | ACT-04 | GĐ1 | `YC-11` | `BR-TT-01` | 🟢 C |
| UC-07 | Phụ huynh báo nghỉ một buổi | ACT-04 | GĐ1 | `YC-08` | `BR-DD-03/04` · `A-04` | 🟢 C |
| UC-08 | Đổi lịch học | ACT-02 | GĐ1 | `YC-07` | `BR-LI-02/03` · `A-07` | 🟡 I |

### D. Điểm danh

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-05 | Điểm danh buổi học | ACT-03 | GĐ1 | `YC-06` | `BR-DD-01/02/03/05` · `A-10` | 🟢 C |

### E. Gói học và thanh toán

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-02 | Bán gói học và thu tiền | ACT-02 | GĐ1 | `YC-10` | `BR-TT-01/02/03` · `A-09` | 🟢 C |
| UC-09 | Bảo lưu gói học | ACT-02 | GĐ1 | `YC-09` | `BR-TT-01` | 🟢 C |

### F. Thông báo

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-10 | Gửi thông báo cho phụ huynh | ACT-01 · ACT-02 | GĐ1 | `YC-12` | `BR-TB-01/03` | 🟢 C |

### G. Báo cáo và quản trị

| UC | Use case | Actor chính | GĐ | Nguồn yêu cầu | Rule · ca biên | TC |
|---|---|---|:---:|---|---|:---:|
| UC-11 | Xem báo cáo chuyên cần và doanh thu | ACT-01 | GĐ1 | `YC-13` | `BR-QT-03` | 🟢 C |
| UC-12 | Quản lý tài khoản nhân viên và phân quyền | ACT-01 | GĐ1 | `YC-14` | `BR-QT-01/02/05` | 🟢 C |

## 3. Ma trận actor × use case

**●** actor chính · **○** actor phụ, nhận kết quả hay thông báo **từ hệ thống** · **◌** tham gia **ngoài hệ thống** (gọi điện, nói trực tiếp ở quầy).

| UC | GĐ | ACT-01 | ACT-02 | ACT-03 | ACT-04 | ⚙ |
|---|:---:|:-:|:-:|:-:|:-:|:-:|
| UC-01 | GĐ1 | | ● | | ◌ | ○ |
| UC-02 | GĐ1 | | ● | | ◌ | ○ |
| UC-03 | GĐ1 | ● | | ○ | | ○ |
| UC-04 | GĐ1 | | ● | ○ | ○ | |
| UC-05 | GĐ1 | | | ● | ○ | ○ |
| UC-06 | GĐ1 | | | | ● | |
| UC-07 | GĐ1 | | ○ | ○ | ● | ○ |
| UC-08 | GĐ1 | | ● | ○ | ◌ | |
| UC-09 | GĐ1 | ○ | ● | | ◌ | ○ |
| UC-10 | GĐ1 | ● | ● | | ○ | |
| UC-11 | GĐ1 | ● | | | | |
| UC-12 | GĐ1 | ● | | | | |

## 4. Ma trận quyền theo chức năng

Đi từ buổi làm việc 19/09 với chủ trung tâm (`PV-2`): ai được làm gì trên web quản trị. **✓** được · **—** không.

| Chức năng | Quản lý | Lễ tân | HLV |
|---|:-:|:-:|:-:|
| Xem hồ sơ học viên | ✓ | ✓ | chỉ học viên lớp mình |
| Tạo, sửa hồ sơ học viên | ✓ | ✓ | — |
| Tạo khoá học, mở lớp | ✓ | — | — |
| Xếp học viên vào lớp | ✓ | ✓ | — |
| Xem lịch toàn trung tâm | ✓ | ✓ | — |
| Xem lịch dạy | ✓ | ✓ | chỉ lớp mình |
| Điểm danh | ✓ | — | ✓ |
| Bán gói, thu tiền | ✓ | ✓ | — |
| Bảo lưu gói | ✓ | ✓ | — |
| Gửi thông báo cho phụ huynh | ✓ | ✓ | — |
| Xem báo cáo chuyên cần | ✓ | ✓ | — |
| Xem báo cáo doanh thu | ✓ | — | — |
| Xuất báo cáo ra file Excel để gửi kế toán | ✓ | — | — |
| Quản lý tài khoản nhân viên | ✓ | — | — |

---

## 5. Đặc tả đầy đủ — 12 use case giai đoạn 1

### UC-01 — Đăng ký học viên mới

| | |
|---|---|
| **Actor chính** | ACT-02 Lễ tân |
| **Actor phụ** | ⚙ · ngoài hệ thống: ACT-04 Phụ huynh *(đến quầy hoặc gọi điện)* |
| **Kích hoạt** | Phụ huynh muốn cho con học |
| **Tiền điều kiện** | Lễ tân đã đăng nhập |
| **Kết quả thành công** | Học viên có hồ sơ và mã; phụ huynh có hồ sơ gắn số điện thoại |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Lễ tân tìm phụ huynh theo số điện thoại (`BR-HV-02`).
2. Không thấy → lễ tân tạo hồ sơ phụ huynh: họ tên, số điện thoại, quan hệ với học viên.
3. Lễ tân nhập học viên: họ tên, ngày sinh, giới tính, ghi chú sức khoẻ (`BR-HV-04`).
4. Hệ thống sinh mã học viên (`BR-HV-01`).
5. Lễ tân chuyển sang bán gói (`UC-02`) hoặc dừng ở đây nếu phụ huynh chưa quyết.

**Nhánh rẽ**

- **1a** Số điện thoại đã có → hệ thống hiện phụ huynh đó và các con đang học; lễ tân thêm học viên mới vào phụ huynh này, không tạo phụ huynh mới.
- **3a** Học viên dưới 6 tuổi mà bỏ trống ghi chú sức khoẻ → hệ thống không cho lưu.

**Ghi chú nghiệm thu**

- Sau khi lưu, hồ sơ học viên xem lại được ở trang chi tiết: thông tin, gói học, các buổi đã học.
- Tìm học viên theo tên, mã hoặc số điện thoại phụ huynh trả kết quả khi gõ từ ký tự thứ ba.

### UC-02 — Bán gói học và thu tiền

| | |
|---|---|
| **Actor chính** | ACT-02 Lễ tân |
| **Actor phụ** | ⚙ · ngoài hệ thống: ACT-04 Phụ huynh |
| **Kích hoạt** | Phụ huynh mua gói đầu tiên hoặc mua gói tiếp |
| **Tiền điều kiện** | Học viên đã có hồ sơ (`UC-01`) |
| **Kết quả thành công** | Gói được ghi cho học viên; khoản thu được ghi; biên lai in ra |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Lễ tân mở hồ sơ học viên, chọn *Bán gói*.
2. Hệ thống hiện các gói của cấp độ học viên kèm giá hiện hành (`BR-TT-03`).
3. Lễ tân chọn gói, chọn hình thức: tiền mặt hoặc chuyển khoản.
4. Lễ tân xác nhận đã thu đủ tiền.
5. Hệ thống ghi khoản thu, sinh mã biên lai, in biên lai (`BR-TT-02`).
6. Gói tính hạn dùng từ buổi học đầu tiên của gói (`BR-TT-01`).

**Nhánh rẽ**

- **2a** Học viên đang có gói còn buổi → gói mới nối tiếp sau gói hiện tại.
- **4a** Chuyển khoản chưa về → lễ tân lưu ở trạng thái *chờ xác nhận*; gói chưa dùng được tới khi lễ tân xác nhận tiền đã về.

**Ghi chú nghiệm thu**

- Các lần đóng tiền và biên lai xem lại được trong hồ sơ học viên, và phụ huynh thấy trên app (`UC-06`).

### UC-03 — Tạo khoá học và mở lớp

| | |
|---|---|
| **Actor chính** | ACT-01 Quản lý |
| **Actor phụ** | ⚙ · ACT-03 HLV *(thấy lớp mới trong lịch dạy của mình)* |
| **Kích hoạt** | Đầu mỗi đợt, hoặc khi một cấp độ có nhiều học viên chờ |
| **Tiền điều kiện** | — |
| **Kết quả thành công** | Lớp có HLV, khung giờ, làn bơi; buổi học được sinh |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Quản lý tạo hoặc chọn khoá học: tên, cấp độ, số buổi một tuần, sĩ số tối đa (`BR-LH-01`, `BR-LH-05`).
2. Quản lý mở lớp thuộc khoá: chọn HLV chính, các ngày trong tuần, giờ bắt đầu, bể và làn (`BR-LH-02`).
3. Hệ thống kiểm HLV và làn không trùng giờ với lớp khác.
4. Hệ thống sinh các buổi học của lớp (`BR-LI-01`).

**Nhánh rẽ**

- **3a** Trùng HLV hoặc trùng làn → hệ thống chỉ ra lớp bị trùng; quản lý đổi giờ hoặc đổi làn.

### UC-04 — Xếp học viên vào lớp

| | |
|---|---|
| **Actor chính** | ACT-02 Lễ tân |
| **Actor phụ** | ACT-03 HLV *(thấy học viên mới trong danh sách lớp)* · ACT-04 Phụ huynh *(thấy lịch trên app)* |
| **Kích hoạt** | Học viên vừa mua gói, hoặc cần đổi sang lớp khác |
| **Tiền điều kiện** | Học viên có gói còn buổi |
| **Kết quả thành công** | Học viên có tên trong lớp; buổi học của học viên được sinh theo gói |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Lễ tân mở danh sách lớp, lọc theo cấp độ, ngày và giờ.
2. Hệ thống hiện sĩ số hiện tại và số chỗ còn trống của từng lớp.
3. Lễ tân chọn lớp còn chỗ, đúng cấp độ (`BR-LH-03`).
4. Hệ thống ghi học viên vào lớp, sinh buổi học của học viên đến hết số buổi của gói.

**Nhánh rẽ**

- **3a** Lớp đã đủ sĩ số → xử lý theo `BR-LH-04`.
- **3b** Hai lễ tân xếp vào chỗ cuối cùng cùng lúc → `A-01`.
- **3c** Anh chị em trùng giờ ở hai lớp khác nhau → `A-06`.

### UC-05 — Điểm danh buổi học

| | |
|---|---|
| **Actor chính** | ACT-03 HLV |
| **Actor phụ** | ⚙ · ACT-04 Phụ huynh *(thấy buổi đã học trên app)* |
| **Kích hoạt** | Buổi học bắt đầu |
| **Tiền điều kiện** | HLV đăng nhập trên máy tính bảng ở thành bể |
| **Kết quả thành công** | Mỗi học viên của buổi có một trạng thái; số buổi còn lại cập nhật |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. HLV mở danh sách buổi dạy hôm nay, chọn buổi đang diễn ra.
2. Hệ thống hiện học viên của buổi; ai đã báo nghỉ thì hiện sẵn *vắng có phép*.
3. HLV bấm *Có mặt tất cả*, rồi đổi trạng thái của từng bé vắng (`BR-DD-01`).
4. HLV lưu. Hệ thống trừ buổi theo `BR-DD-03`.

**Nhánh rẽ**

- **2a** Có bé đến lớp mà gói đã hết buổi hoặc hết hạn → `A-05`.
- **4a** Máy tính bảng mất mạng khi lưu → `A-10`.

**Ghi chú nghiệm thu**

- Buổi chưa điểm danh tới cuối ngày được hệ thống xử lý theo `BR-DD-02`.
- Sửa điểm danh sau khi lưu: theo `BR-DD-05`.

### UC-06 — Phụ huynh xem lịch học, số buổi còn lại và các lần đóng tiền

| | |
|---|---|
| **Actor chính** | ACT-04 Phụ huynh |
| **Actor phụ** | — |
| **Kích hoạt** | Phụ huynh mở app |
| **Tiền điều kiện** | Phụ huynh đăng nhập bằng số điện thoại đã đăng ký ở quầy và mã OTP (`NF-05`) |
| **Kết quả thành công** | Phụ huynh thấy lịch, số buổi còn lại, hạn gói, các lần đóng tiền |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Phụ huynh mở app. Màn đầu là các buổi học sắp tới, buổi gần nhất ở trên.
2. Phụ huynh mở mục gói học: số buổi còn lại, hạn dùng, gói đang bảo lưu nếu có.
3. Phụ huynh mở lịch sử đóng tiền: ngày, gói, số tiền, mã biên lai.

**Nhánh rẽ**

- **1a** Chưa có gói nào → app hiện số điện thoại quầy và giờ làm việc.

### UC-07 — Phụ huynh báo nghỉ một buổi

| | |
|---|---|
| **Actor chính** | ACT-04 Phụ huynh |
| **Actor phụ** | ⚙ · ACT-02 Lễ tân, ACT-03 HLV *(thấy trên danh sách buổi)* |
| **Kích hoạt** | Bé ốm hoặc bận |
| **Tiền điều kiện** | Buổi học chưa bắt đầu |
| **Kết quả thành công** | Buổi được ghi vắng có phép, hoặc vắng không phép nếu báo muộn |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Phụ huynh chọn một buổi sắp tới, chọn *Báo nghỉ*.
2. Phụ huynh chọn lý do *(ốm, bận, khác)*, không bắt buộc.
3. Hệ thống ghi *vắng có phép* nếu đủ thời gian báo trước (`BR-DD-03`), trong giới hạn số lần (`BR-DD-04`).
4. App hiện kết quả: buổi này có bị trừ hay không.

**Nhánh rẽ**

- **3a** Báo muộn hoặc vượt số lần → `A-04`, `BR-DD-04`.

### UC-08 — Đổi lịch học

| | |
|---|---|
| **Actor chính** | ACT-02 Lễ tân |
| **Actor phụ** | ACT-03 HLV *(lớp cũ và lớp mới)* · ngoài hệ thống: ACT-04 Phụ huynh |
| **Kích hoạt** | Phụ huynh gọi điện hoặc nhắn Zalo xin đổi |
| **Tiền điều kiện** | Học viên đang học một lớp, gói còn buổi |
| **Kết quả thành công** | Một buổi được dời sang lớp khác, hoặc học viên chuyển hẳn sang lớp khác |
| **Tin cậy** | 🟡 I |

**Luồng chính**

1. Lễ tân mở hồ sơ học viên, chọn *Đổi lịch*.
2. Lễ tân chọn *Đổi một buổi* hoặc *Chuyển lớp cố định*.
3. Hệ thống gợi ý các lớp cùng cấp độ còn chỗ (`BR-LI-02`), lớp cùng HLV lên trước.
4. Lễ tân chọn lớp, xác nhận.
5. Hệ thống cập nhật buổi học; HLV hai lớp thấy thay đổi trong danh sách lớp.

**Nhánh rẽ**

- **2a** HLV đề xuất cho bé lên cấp độ cao hơn giữa chừng → `A-07`.

**Ghi chú nghiệm thu**

- Phụ huynh cũng đổi được trên app theo `BR-LI-03` *(🟡 I, chờ chủ trung tâm xác nhận)*.

### UC-09 — Bảo lưu gói học

| | |
|---|---|
| **Actor chính** | ACT-02 Lễ tân |
| **Actor phụ** | ⚙ · ACT-01 Quản lý *(thấy trong danh sách gói đang bảo lưu)* · ngoài hệ thống: ACT-04 Phụ huynh |
| **Kích hoạt** | Phụ huynh xin bảo lưu khi bé ốm dài ngày hoặc cả nhà đi xa |
| **Tiền điều kiện** | Gói đang dùng, còn buổi |
| **Kết quả thành công** | Gói ở trạng thái bảo lưu; không sinh buổi trong thời gian bảo lưu |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Lễ tân mở gói của học viên, chọn *Bảo lưu*.
2. Lễ tân chọn ngày bắt đầu và số ngày bảo lưu.
3. Hệ thống tạm ngừng sinh buổi trong khoảng đó, giữ chỗ của học viên trong lớp.
4. Hết bảo lưu, hệ thống sinh lại buổi theo lịch cũ.

**Nhánh rẽ**

- **4a** Hết bảo lưu mà lớp cũ đã đủ sĩ số → lễ tân xếp lớp khác (`UC-04`).

### UC-10 — Gửi thông báo cho phụ huynh

| | |
|---|---|
| **Actor chính** | ACT-01 Quản lý hoặc ACT-02 Lễ tân |
| **Actor phụ** | ACT-04 Phụ huynh |
| **Kích hoạt** | Nghỉ lễ, đổi giờ, sự kiện của trung tâm |
| **Tiền điều kiện** | — |
| **Kết quả thành công** | Phụ huynh nhận thông báo đẩy và đọc lại được trong mục Thông báo của app |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Người gửi chọn người nhận: cả trung tâm, theo lớp, theo cấp độ, hoặc chọn nhiều phụ huynh trong danh sách.
2. Người gửi soạn tiêu đề và nội dung.
3. Người gửi chọn gửi ngay hoặc hẹn giờ (`BR-TB-01`).
4. Hệ thống gửi thông báo đẩy; thông báo nằm trong mục Thông báo của app.

**Nhánh rẽ**

- **3a** Thông báo khẩn → `BR-TB-03`.

### UC-11 — Xem báo cáo chuyên cần và doanh thu

| | |
|---|---|
| **Actor chính** | ACT-01 Quản lý |
| **Actor phụ** | — |
| **Kích hoạt** | Cuối tháng, hoặc khi chủ trung tâm cần số |
| **Tiền điều kiện** | — |
| **Kết quả thành công** | Quản lý thấy số liệu theo khoảng thời gian đã chọn |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Quản lý chọn loại báo cáo: chuyên cần hoặc doanh thu.
2. Quản lý chọn khoảng thời gian, mặc định tháng hiện tại.
3. Chuyên cần: tỉ lệ đi học theo lớp và theo HLV, kèm số buổi vắng không phép.
4. Doanh thu: tổng thu theo tháng, theo loại gói, theo hình thức thanh toán.

**Ghi chú nghiệm thu**

- Lễ tân xem được chuyên cần nhưng không thấy doanh thu (`BR-QT-03`).

### UC-12 — Quản lý tài khoản nhân viên và phân quyền

| | |
|---|---|
| **Actor chính** | ACT-01 Quản lý |
| **Actor phụ** | — |
| **Kích hoạt** | Có nhân viên mới hoặc nhân viên nghỉ |
| **Tiền điều kiện** | — |
| **Kết quả thành công** | Nhân viên có tài khoản đúng vai |
| **Tin cậy** | 🟢 C |

**Luồng chính**

1. Quản lý thêm nhân viên: họ tên, số điện thoại, vai *(Quản lý, Lễ tân, HLV)* (`BR-QT-01`).
2. Với HLV, quản lý chọn các lớp HLV phụ trách (`BR-QT-02`).
3. Hệ thống gửi mật khẩu tạm qua SMS cho nhân viên.

**Nhánh rẽ**

- **1a** Nhân viên nghỉ việc → quản lý khoá tài khoản, không xoá, để giữ lịch sử.
- **1b** Tài khoản bị khoá do nhập sai mật khẩu (`BR-QT-05`) → quản lý mở khoá.
