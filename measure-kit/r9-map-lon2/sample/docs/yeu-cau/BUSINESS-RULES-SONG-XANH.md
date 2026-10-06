# SÓNG XANH — QUY TẮC NGHIỆP VỤ v1

> Ngày: 2026-09-19 · Đầu vào: phỏng vấn `PV-1` (16/09), `PV-2` (19/09), quy trình quầy lễ tân (`SOP`), quan sát quầy (`QS`), file Excel 2025–2026 (`DATA`).
> Quyết định gỡ xung đột giữa các quy tắc, và giữa quy tắc với file khác: `XUNG-DOT-SONG-XANH.md`.

## Quy ước

| Tiền tố | Miền |
|---|---|
| `BR-HV-nn` | Học viên, phụ huynh |
| `BR-LH-nn` | Khoá học, lớp |
| `BR-LI-nn` | Lịch, buổi học |
| `BR-DD-nn` | Điểm danh |
| `BR-TT-nn` | Gói học, thanh toán |
| `BR-TB-nn` | Thông báo |
| `BR-QT-nn` | Quản trị, quyền |

**Mức độ tin cậy:**

| Ký hiệu | Nghĩa |
|:---:|---|
| 🟢 **C** | **Confirmed** — chủ trung tâm nói trực tiếp, hoặc dữ liệu xác nhận rõ |
| 🟡 **I** | **Inferred** — BA suy ra, chưa xác nhận |
| 🔴 **A** | **Assumed** — giả định làm việc |

---

## Summary

37 quy tắc trong 7 miền. Nhóm chặt nhất là gói học và điểm danh, vì hai nhóm này quyết định số buổi còn lại, chỗ phụ huynh hay khiếu nại nhất. Ba quy tắc còn 🟡 I chờ chủ trung tâm xác nhận.

## 1. Học viên, phụ huynh

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-HV-01 | Mỗi học viên có mã do hệ thống sinh, dạng `SX-0001`, không đổi và không dùng lại | `PV-1` | 🟢 C |
| BR-HV-02 | Số điện thoại phụ huynh là duy nhất. Trùng số thì gắn học viên mới vào phụ huynh có sẵn | `SOP` | 🟢 C |
| BR-HV-03 | Một phụ huynh có thể có nhiều con học ở trung tâm, mỗi con lịch và gói riêng. Trên app, phụ huynh xem **từng con một**, không trộn lịch các con | `PV-2` | 🟢 C |
| BR-HV-04 | Học viên dưới 6 tuổi phải có ghi chú sức khoẻ *(dị ứng, hen, sợ nước…)* trước khi xếp lớp | `PV-1` | 🟢 C |
| BR-HV-05 | Học viên nghỉ hẳn không xoá hồ sơ; chuyển trạng thái *ngừng học*, giữ lịch sử | `SOP` | 🟢 C |

## 2. Khoá học, lớp

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-LH-01 | Khoá học thuộc một trong ba cấp độ: Làm quen nước, Cơ bản, Nâng cao | `PV-1` | 🟢 C |
| BR-LH-02 | Lớp có một HLV chính và khung giờ cố định trong tuần, ví dụ thứ Hai, Tư, Sáu lúc 17:30, mỗi buổi 45 phút | `PV-1` | 🟢 C |
| BR-LH-03 | Chỉ xếp học viên vào lớp đúng cấp độ. Xếp xuống một bậc khi quản lý cho phép | `PV-2` | 🟢 C |
| BR-LH-04 | Lớp đủ sĩ số thì học viên vào **danh sách chờ** của lớp đó. Khi lớp có chỗ trống, lễ tân thấy danh sách chờ theo thứ tự đăng ký để gọi phụ huynh, người đăng ký trước được gọi trước | `PV-2` · `QS` | 🟢 C |
| BR-LH-05 | Sĩ số tối đa: lớp Làm quen nước 6 bé, các lớp khác 10 bé | `PV-1` | 🟢 C |
| BR-LH-06 | **Học thử:** mỗi bé được học thử một buổi miễn phí ở một lớp còn chỗ, đúng độ tuổi. Lễ tân đặt buổi học thử; sau buổi, HLV ghi cấp độ gợi ý. Phụ huynh mua gói thì bé thành học viên chính thức, giữ lại kết quả học thử. Không mua thì hồ sơ học thử giữ 60 ngày | `PV-2` | 🟢 C |

## 3. Lịch, buổi học

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-LI-01 | Buổi học sinh tự động theo khung giờ của lớp, từ ngày khai giảng tới hết đợt | `PV-1` | 🟢 C |
| BR-LI-02 | Đổi lịch chỉ sang lớp cùng cấp độ còn chỗ | `SOP` | 🟢 C |
| BR-LI-03 | Phụ huynh tự đổi lịch một buổi trên app, trước giờ học ít nhất 12 giờ | `PV-1` | 🟡 I |
| BR-LI-04 | Ngày lễ trong danh sách nghỉ lễ của trung tâm không sinh buổi; buổi rơi vào ngày lễ dời sang tuần sau | `SOP` | 🟢 C |

## 4. Điểm danh

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-DD-01 | Mỗi học viên của một buổi có đúng một trạng thái: có mặt, vắng có phép, vắng không phép | `PV-1` | 🟢 C |
| BR-DD-02 | 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi *vắng không phép* | `PV-2` | 🟢 C |
| BR-DD-03 | Vắng có phép không trừ buổi. Vắng không phép và có mặt đều trừ một buổi. Vắng có phép khi phụ huynh báo trước giờ học ít nhất 24 giờ | `PV-1` | 🟢 C |
| BR-DD-04 | Mỗi gói được tối đa 3 lần vắng có phép; từ lần thứ 4 tính như vắng không phép | `PV-2` | 🟢 C |
| BR-DD-05 | HLV sửa điểm danh của buổi mình dạy trong 24 giờ sau buổi. Quá 24 giờ chỉ quản lý sửa được, và phải ghi lý do sửa | `PV-2` | 🟢 C |

## 5. Gói học, thanh toán

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-TT-01 | Gói 8, 12, 24 buổi; hạn dùng 2, 3, 6 tháng, tính từ buổi học đầu tiên của gói | `PV-1` | 🟢 C |
| BR-TT-02 | Thu tiền mặt hoặc chuyển khoản tại quầy. Mỗi khoản thu có một biên lai mang mã riêng | `SOP` | 🟢 C |
| BR-TT-03 | Giá gói lấy theo bảng giá hiện hành *(Phụ lục A của `YEU-CAU-HE-THONG-SONG-XANH.md`)* | `PV-2` | 🟢 C |
| BR-TT-04 | Gói hết buổi hoặc hết hạn thì học viên không vào lớp được tới khi mua gói mới | `PV-1` | 🟢 C |
| BR-TT-05 | **Tạm dừng gói:** mỗi gói được tạm dừng một lần, tối đa 30 ngày. Hạn dùng cộng thêm đúng số ngày tạm dừng | `PV-2` | 🟢 C |
| BR-TT-06 | Học viên còn từ 2 buổi trở xuống được đưa vào danh sách cần gọi mời gia hạn; lễ tân gọi và ghi kết quả cuộc gọi | `PV-2` | 🟢 C |
| BR-TT-07 | Buổi do trung tâm huỷ *(bể sự cố, HLV không có người thay)* không trừ buổi, và gói được cộng thêm một buổi | `PV-1` | 🟢 C |
| BR-TT-08 | Gói đã hết hạn mà còn buổi do trung tâm huỷ chưa bù được thì quy ra tiền theo giá một buổi của gói. Lễ tân lập đề nghị hoàn tiền; quản lý duyệt hoặc từ chối; kế toán chi ngoài hệ thống, lễ tân ghi ngày đã chi | `PV-2` | 🟢 C |

## 6. Thông báo

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-TB-01 | Thông báo gửi qua app. Thông báo hẹn giờ chỉ gửi trong khung 7:00–21:00 | `PV-2` | 🟢 C |
| BR-TB-02 | Hệ thống tự gửi nhắc lịch cho phụ huynh trước giờ học 2 tiếng. Quản lý bật hoặc tắt việc nhắc, và sửa nội dung mẫu của tin nhắc | `PV-2` | 🟢 C |
| BR-TB-03 | Thông báo khẩn *(huỷ buổi)* gửi ngay, không theo khung giờ của `BR-TB-01` | `PV-1` | 🟢 C |
| BR-TB-04 | Phụ huynh không tắt được thông báo khẩn | `PV-2` | 🟡 I |

## 7. Quản trị, quyền

| Mã | Quy tắc | Nguồn | TC |
|---|---|---|:---:|
| BR-QT-01 | Ba vai đăng nhập web quản trị: Quản lý, Lễ tân, HLV. Phụ huynh chỉ dùng app | `PV-1` | 🟢 C |
| BR-QT-02 | HLV chỉ thấy các lớp mình phụ trách và học viên của các lớp đó | `PV-2` | 🟢 C |
| BR-QT-03 | Lễ tân không xem doanh thu | `PV-2` | 🟢 C |
| BR-QT-04 | Mọi lần sửa điểm danh, duyệt hoàn tiền, tạm dừng gói và xoá học viên khỏi lớp được ghi lại: ai làm, lúc nào, giá trị trước và sau. Quản lý tra cứu được khi có khiếu nại | `PV-2` | 🟢 C |
| BR-QT-05 | Mật khẩu nhân viên tối thiểu 8 ký tự. Nhập sai 5 lần liền thì khoá tài khoản | `PV-1` | 🟡 I |

## Findings

- `BR-DD-03` cho báo nghỉ trước **24 giờ**, giống `YC-08`. Quầy lễ tân thực tế nhận báo nghỉ tới sát giờ học. Đưa sang xung đột: `XD-01`.
- `BR-LI-03` *(phụ huynh tự đổi lịch)* là suy luận từ `YC-07`, chưa xác nhận. Lễ tân lo sĩ số bị phá vỡ. Đưa sang xung đột: `XD-02`.
