# Bản đồ chức năng

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-59, le-tan, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-09, le-tan, ≈ 11,1 giây) · (5) màn dày nhất lich 6 chức năng, 2 tab · (4) nhóm menu dài nhất 5 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch tuần · Học viên · Lớp · *Tiền:* Gói và thu tiền · Hoàn tiền · *Liên lạc và báo cáo:* Thông báo · Báo cáo · *Cá nhân:* Tài khoản của tôi | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch tuần · Học viên · Lớp · *Tiền:* Gói và thu tiền · Hoàn tiền · *Liên lạc và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Nhật ký thao tác · Cài đặt · Tài khoản của tôi | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lịch dạy của tôi · Lớp · Học viên · Tài khoản của tôi | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Buổi và gói · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Báo cáo và quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-76` | T1 chính | tại chỗ | Form đăng nhập | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05, D4:99-118, M-08 |

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân · module Lịch và buổi học

- Dải **Việc ở quầy**: Tìm học viên · Đăng ký học viên mới · Bán gói học và thu tiền · Báo nghỉ thay phụ huynh tại quầy
- Dải **Yêu cầu đổi lịch chờ xử lý**: Xem yêu cầu đổi lịch chờ xử lý · Đổi lịch một buổi học · Từ chối yêu cầu đổi lịch
- Dải **Chờ xác nhận chuyển khoản**: Xác nhận tiền chuyển khoản đã về
- Dải **Sắp hết buổi, cần gọi**: Xem danh sách học viên sắp hết buổi · Ghi kết quả cuộc gọi mời gia hạn
- Dải **Cuối ngày**: Đối chiếu khoản thu trong ngày

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách học viên sắp hết buổi `F-16` | T2 phụ | tại chỗ | Sắp hết buổi, cần gọi | Lễ tân | BR-TT-06, S-02 |
| Tìm học viên `F-24` | T2 phụ | tại chỗ | Việc ở quầy | Quản lý, Lễ tân, Huấn luyện viên | D4:151, YC-01, D4:105, M-01 |
| Xem yêu cầu đổi lịch chờ xử lý `F-46` | T2 phụ | tại chỗ | Yêu cầu đổi lịch chờ xử lý | Lễ tân | XD-02, D8:118-132, M-03 |
| Ghi kết quả cuộc gọi mời gia hạn `F-17` | T4 ngữ cảnh | hộp thoại | Sắp hết buổi, cần gọi | Lễ tân | BR-TT-06, S-02, D8:182-187 |
| Đổi lịch một buổi học `F-47` | T4 ngữ cảnh | ngăn trượt | Yêu cầu đổi lịch chờ xử lý | Lễ tân | UC-08, BR-LI-02, XD-02, M-03 |
| Từ chối yêu cầu đổi lịch `F-48` | T4 ngữ cảnh | hộp thoại | Yêu cầu đổi lịch chờ xử lý | Lễ tân | XD-02, D8:130-131, M-03 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Báo nghỉ thay phụ huynh tại quầy *(hộp thoại)* · Xác nhận tiền chuyển khoản đã về *(hộp thoại)* · Đối chiếu khoản thu trong ngày *(ngăn trượt)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo và quản trị

- Dải **Cần duyệt**: Duyệt xếp học viên xuống lớp thấp hơn một bậc · Duyệt đề nghị hoàn tiền
- Dải **Báo nội bộ**: Xem thông báo nội bộ · Phân công HLV dạy thay
- Dải **Tháng này**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần
- Dải **Lớp đông, nhiều bé chờ**: Mở lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Duyệt xếp học viên xuống lớp thấp hơn một bậc `F-60` *suy* | T2 phụ | hộp thoại | Cần duyệt | Quản lý | BR-LH-03, D4:108, M-02 |
| Xem báo cáo chuyên cần `F-69` | T2 phụ | tại chỗ | Tháng này | Quản lý, Lễ tân | UC-11, D4:383-385, D4:115, S-01 |
| Xem báo cáo doanh thu `F-70` | T2 phụ | tại chỗ | Tháng này | Quản lý | UC-11, D4:386, BR-QT-03, D4:116, S-01, NF-04 |
| Xem thông báo nội bộ `F-86` *suy* | T2 phụ | tại chỗ | Báo nội bộ | Quản lý | XD-04, XD-02, M-03 |

Lối tắt: Duyệt đề nghị hoàn tiền *(hộp thoại)* · Phân công HLV dạy thay *(hộp thoại)* · Mở lớp *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi đang dạy**: Điểm danh buổi học
- Dải **Các buổi còn lại hôm nay**: Xem lịch dạy
- Dải **Học thử cần ghi cấp độ**: Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-01` | T1 chính | tại chỗ | Buổi đang dạy | Huấn luyện viên, Quản lý | UC-05, BR-DD-01, BR-DD-03, BR-DD-04, XD-01, A-02, A-05, A-10, D4:111, D8:99-105, M-04 |
| Xem lịch dạy `F-40` | T2 phụ | tại chỗ | Các buổi còn lại hôm nay | Quản lý, Lễ tân, Huấn luyện viên | D4:110, D4:282, D4:316, M-03 |
| Ghi cấp độ gợi ý sau buổi học thử `F-66` | T2 phụ | hộp thoại | Học thử cần ghi cấp độ | Huấn luyện viên | BR-LH-06, S-03 |

### Lịch tuần · `lich` · `admin/lich.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học · tab: Theo làn · Theo HLV

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm `F-39` | T1 chính | tại chỗ | tab Theo làn | Quản lý, Lễ tân | D4:109, D4:282, D8:83-97, M-03 |
| Xem lịch dạy `F-40` | T2 phụ | tại chỗ | tab Theo HLV | Quản lý, Lễ tân, Huấn luyện viên | D4:110, D4:282, D4:316, M-03 |
| Huỷ hàng loạt buổi học khi bể sự cố `F-54` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03, M-03 |
| Xếp buổi học bù cho buổi vắng có phép `F-05` *suy* | T4 ngữ cảnh | hộp thoại | Ngăn chi tiết lớp | Lễ tân, Quản lý | D8:104, D8:112 |
| Phân công HLV dạy thay `F-52` | T4 ngữ cảnh | hộp thoại | Ngăn chi tiết lớp | Quản lý | A-02, D8:94, BR-TB-03, M-03 |
| Huỷ buổi học khi không có người dạy thay `F-53` | T4 ngữ cảnh | hộp thoại | Ngăn chi tiết lớp | Quản lý | A-02, BR-TT-07, D8:83-97, M-03 |

Lối tắt: Xem danh sách học viên của lớp *(ngăn trượt)* · Điểm danh buổi học *(ngăn trượt)* · Sửa điểm danh đã lưu *(ngăn trượt)*

### Lịch dạy của tôi · `lich-day` · `admin/lich-day.html`

Vai: Huấn luyện viên · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch dạy `F-40` | T1 chính | tại chỗ | Tuần của tôi | Quản lý, Lễ tân, Huấn luyện viên | D4:110, D4:282, D4:316, M-03 |
| Sửa điểm danh đã lưu `F-02` | T4 ngữ cảnh | ngăn trượt | Tuần của tôi | Huấn luyện viên, Quản lý | BR-DD-05, UC-05, D8:114-115, M-04 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng ký học viên mới `F-23` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-01, BR-HV-01, BR-HV-02, BR-HV-04, YC-01, D4:106, M-01 |
| Tìm học viên `F-24` | T2 phụ | tại chỗ | Tìm và lọc | Quản lý, Lễ tân, Huấn luyện viên | D4:151, YC-01, D4:105, M-01 |
| Đặt buổi học thử `F-65` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-LH-06, S-03 |
| Ghi nhận xét tiến bộ cuối cấp độ `F-35` **hoãn** | T4 ngữ cảnh | ngăn trượt | Bảng học viên | Huấn luyện viên | S-04 |
| Chuyển bé học thử thành học viên chính thức `F-67` | T4 ngữ cảnh | hộp thoại | Bảng học viên | Lễ tân | BR-LH-06, S-03 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Gói và thu tiền · Lịch và điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và các lần đóng tiền của học viên `F-09` | T2 phụ | tại chỗ | tab Gói và thu tiền | Lễ tân, Quản lý | UC-02, D4:178-180, D8:153-180, M-05 |
| Xem hồ sơ học viên `F-25` | T2 phụ | tại chỗ | Đầu hồ sơ | Quản lý, Lễ tân, Huấn luyện viên | D4:150, D4:105, BR-HV-05, M-01 |
| Sửa hồ sơ học viên `F-26` | T2 phụ | ngăn trượt | Đầu hồ sơ | Quản lý, Lễ tân | D4:106, BR-HV-01, BR-HV-04, M-01 |
| Sửa hồ sơ phụ huynh `F-27` *suy* | T3 hiếm | ngăn trượt | Đầu hồ sơ | Quản lý, Lễ tân | D8:11-17, BR-HV-02, D4:106, M-01 |
| Chuyển học viên sang ngừng học `F-28` | T3 hiếm | hộp thoại | Đầu hồ sơ | Quản lý, Lễ tân | BR-HV-05, D8:22, D4:106, M-01 |
| Báo nghỉ thay phụ huynh tại quầy `F-43` *suy* | T4 ngữ cảnh | hộp thoại | tab Lịch và điểm danh | Lễ tân | D6:18, UC-07, XD-01 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Đổi lịch một buổi học *(ngăn trượt)* · Chuyển học viên sang lớp khác *(ngăn trượt)* · Bảo lưu gói học *(hộp thoại)* · Xếp buổi học bù cho buổi vắng có phép *(hộp thoại)* · Lập đề nghị hoàn tiền *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Mở lớp `F-57` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý | UC-03, BR-LH-02, D4:196-202, M-02 |
| Xem danh sách lớp `F-58` | T2 phụ | tại chỗ | Bảng lớp | Quản lý, Lễ tân | UC-04, D4:217-218, D4:188, M-02 |
| Tạo khoá học `F-56` | T3 hiếm | ngăn trượt | Thanh công cụ | Quản lý | UC-03, BR-LH-01, BR-LH-05, XD-03, D8:44-49, M-02 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Khoá học và lớp · vào từ Lớp (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-59` | T1 chính | ngăn trượt | Đầu lớp | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Xem danh sách học viên của lớp `F-63` | T2 phụ | tại chỗ | Học viên trong lớp | Quản lý, Lễ tân, Huấn luyện viên | UC-04, D4:209, D4:105, M-02 |
| Chuyển học viên lên cấp độ cao hơn `F-50` | T4 ngữ cảnh | hộp thoại | Học viên trong lớp | Lễ tân | A-07, UC-08, BR-LH-03, OQ-02, M-03 |
| Đưa học viên vào danh sách chờ `F-61` | T4 ngữ cảnh | hộp thoại | Danh sách chờ | Lễ tân, Quản lý | BR-LH-04, UC-04, A-01, D8:61-74, M-02 |
| Gọi phụ huynh theo danh sách chờ `F-62` | T4 ngữ cảnh | hộp thoại | Danh sách chờ | Lễ tân, Quản lý | BR-LH-04, M-02 |
| Chuyển học viên sang lớp khác `F-64` | T4 ngữ cảnh | ngăn trượt | Học viên trong lớp | Lễ tân, Quản lý | UC-04, UC-08, D4:210, BR-LI-02, A-07, M-02, M-03 |

Lối tắt: Xem hồ sơ học viên *(ngăn trượt)*

### Gói và thu tiền · `goi-hoc` · `admin/goi-hoc.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền · tab: Gói học · Khoản thu hôm nay

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-07` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-05, A-09, YC-10, M-05 |
| Xem danh sách gói học theo trạng thái `F-10` | T2 phụ | tại chỗ | tab Gói học | Quản lý, Lễ tân | UC-09, D8:145-163, M-07 |
| Đối chiếu khoản thu trong ngày `F-11` *suy* | T2 phụ | tại chỗ | tab Khoản thu hôm nay | Lễ tân, Quản lý | M-05, BR-TT-02, D8:172-180 |
| Xác nhận tiền chuyển khoản đã về `F-08` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân, Quản lý | UC-02, D4:176, M-05 |
| Bảo lưu gói học `F-12` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân, Quản lý | UC-09, BR-TT-05, YC-09, D8:165-170, M-07 |
| Áp mã khuyến mãi khi bán gói `F-22` **hoãn** | T4 ngữ cảnh | tại chỗ | Thanh công cụ | Lễ tân, Quản lý | CO-01 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Lập đề nghị hoàn tiền `F-18` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-TT-08, A-08, D8:196-205 |
| Theo dõi đề nghị hoàn tiền `F-21` *suy* | T2 phụ | tại chỗ | Đề nghị hoàn tiền | Quản lý, Lễ tân | BR-TT-08, D8:189-194 |
| Duyệt đề nghị hoàn tiền `F-19` | T4 ngữ cảnh | hộp thoại | Đề nghị hoàn tiền | Quản lý | BR-TT-08, D8:189-205 |
| Ghi ngày đã chi tiền hoàn `F-20` | T4 ngữ cảnh | hộp thoại | Đề nghị hoàn tiền | Lễ tân | BR-TT-08, D8:204 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-80` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, YC-12, BR-TB-01, BR-TB-03, M-09, D4:114 |
| Xem thông báo đã gửi `F-81` *suy* | T2 phụ | tại chỗ | Thông báo đã gửi | Quản lý, Lễ tân | D8:209-222, UC-10, M-09 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo và quản trị · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-69` | T2 phụ | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, D4:383-385, D4:115, S-01 |
| Xem báo cáo doanh thu `F-70` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, D4:386, BR-QT-03, D4:116, S-01, NF-04 |
| Xuất báo cáo ra file Excel `F-71` | T2 phụ | hộp thoại | Thanh công cụ | Quản lý | D4:117, UC-11, S-01 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Báo cáo và quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm tài khoản nhân viên `F-72` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý | UC-12, BR-QT-01, BR-QT-02, D8:233-245, M-08 |
| Sửa thông tin và lớp phụ trách của nhân viên `F-73` *suy* | T4 ngữ cảnh | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, BR-QT-02, D8:239-245, M-08 |
| Khoá tài khoản nhân viên `F-74` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, D4:411, M-08 |
| Mở khoá tài khoản nhân viên `F-75` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, D4:412, BR-QT-05, M-08 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Báo cáo và quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-78` | T2 phụ | tại chỗ | Tìm và lọc | Quản lý | BR-QT-04, D8:247-255, M-08 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Báo cáo và quản trị · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cấu hình bảng giá gói học `F-06` | T2 phụ | tại chỗ | tab Bảng giá | Quản lý | BR-TT-03, D7:98-106, D8:136-143, M-05 |
| Quản lý danh sách ngày nghỉ lễ `F-38` *suy* | T2 phụ | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D8:78-81, M-03 |
| Cấu hình nhắc lịch `F-84` | T2 phụ | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, D8:224-229, M-09 |

### Tài khoản của tôi · `tai-khoan` · `admin/tai-khoan.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Báo cáo và quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đổi mật khẩu `F-77` *suy* | T2 phụ | hộp thoại | Mật khẩu | Quản lý, Lễ tân, Huấn luyện viên | D4:407, BR-QT-05, M-08 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Học viên · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại và mã OTP `F-30` | T1 chính | tại chỗ | Số điện thoại và mã | Phụ huynh | D4:263, NF-05, BR-QT-01, D8:14, M-06 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Lịch và buổi học

- Dải **Con đang xem**: Chọn con đang xem trên app
- Dải **Buổi sắp tới**: Xem lịch học của con · Báo nghỉ một buổi học · Gửi yêu cầu đổi lịch
- Dải **Số buổi còn lại**: Xem gói học và số buổi còn lại trên app
- Dải **Yêu cầu đổi lịch**: Theo dõi yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học của con `F-41` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, D4:269, D4:275, BR-TT-01, M-06 |
| Chọn con đang xem trên app `F-31` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03, UC-06, M-06 |
| Xem gói học và số buổi còn lại trên app `F-33` | T2 phụ | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06, D4:270, M-06 |
| Theo dõi yêu cầu đổi lịch `F-45` | T2 phụ | tại chỗ | Yêu cầu đổi lịch | Phụ huynh | XD-02, D8:118-122, M-06 |
| Báo nghỉ một buổi học `F-42` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | UC-07, XD-01, BR-DD-03, BR-DD-04, A-04, YC-08, M-06 |
| Gửi yêu cầu đổi lịch `F-44` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, YC-07, D8:118-132, M-06 |

### Buổi và gói · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và số buổi còn lại trên app `F-33` | T1 chính | tại chỗ | Gói đang dùng | Phụ huynh | UC-06, D4:270, M-06 |
| Xem các buổi đã học của con `F-04` | T2 phụ | tại chỗ | Buổi đã học | Phụ huynh | UC-05, D4:233, M-04 |
| Xem lịch sử đóng tiền trên app `F-34` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, D4:271, M-06 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đọc thông báo trong app `F-82` | T1 chính | tại chỗ | Hộp thông báo | Phụ huynh | D4:356, D4:364, M-06, M-09, D8:218-222 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem nhận xét tiến bộ trên app `F-36` **hoãn** | T2 phụ | tại chỗ | Con của tôi | Phụ huynh | S-04 |
| Cài đặt nhận thông báo `F-83` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04, M-09 |

## Hành trình theo vai

- **Lễ tân · Phụ huynh dắt bé tới đăng ký học lần đầu:** Tìm học viên → Đăng ký học viên mới → Xếp học viên vào lớp → Bán gói học và thu tiền
- **Lễ tân · Xử lý yêu cầu đổi lịch phụ huynh gửi qua app:** Xem yêu cầu đổi lịch chờ xử lý → Đổi lịch một buổi học
- **Lễ tân · Gọi mời gia hạn bé sắp hết buổi:** Xem danh sách học viên sắp hết buổi → Ghi kết quả cuộc gọi mời gia hạn → Bán gói học và thu tiền
- **Quản lý · Mở thêm lớp khi danh sách chờ dài:** Xem danh sách lớp → Mở lớp → Gọi phụ huynh theo danh sách chờ
- **Quản lý · Đầu tháng xem số liệu tháng trước:** Xem báo cáo doanh thu → Xem báo cáo chuyên cần → Xuất báo cáo ra file Excel
- **Huấn luyện viên · Một buổi dạy ở thành bể:** Xem lịch dạy → Điểm danh buổi học → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Con ốm, không đi học buổi tới:** Chọn con đang xem trên app → Xem lịch học của con → Báo nghỉ một buổi học → Xem gói học và số buổi còn lại trên app
- **Phụ huynh · Xin cho con học buổi khác trong tuần:** Xem lịch học của con → Gửi yêu cầu đổi lịch → Theo dõi yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh dắt bé 6 tuổi tới quầy, muốn cho bé học bơi; trung tâm chưa có thông tin gì về bé. | Đăng ký học viên mới `F-23` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Mẹ bé Minh Anh tới quầy, muốn đóng tiền cho 12 buổi tiếp theo. | Bán gói học và thu tiền `F-07` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Sáng nay có phụ huynh nhắn qua app xin cho con học lớp tối thứ Sáu thay cho lớp thứ Năm; xử lý tin đó. | Đổi lịch một buổi học `F-47` | 2 · ≈ 5,4 giây |
| 4 | Lễ tân | Một phụ huynh gọi điện: bé bị sốt, chiều nay không tới được. | Báo nghỉ thay phụ huynh tại quầy `F-43` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Kế toán nhắn: tài khoản ngân hàng của trung tâm vừa nhận 1.380.000 ₫ của mẹ bé An. | Xác nhận tiền chuyển khoản đã về `F-08` | 1 · ≈ 2,7 giây |
| 6 | Huấn luyện viên | Lớp 17:00 vừa xuống nước; ghi lại bé nào tới, bé nào không. | Điểm danh buổi học `F-01` | 1 · ≈ 2,7 giây |
| 7 | Quản lý | Cuối tháng, chủ trung tâm muốn biết tháng này thu được bao nhiêu. | Xem báo cáo doanh thu `F-70` | 1 · ≈ 2,7 giây |
| 8 | Quản lý | Bể nhỏ hỏng máy lọc, mọi lớp chiều nay phải nghỉ. | Huỷ hàng loạt buổi học khi bể sự cố `F-54` | 3 · ≈ 8,1 giây |
| 9 | Phụ huynh | Bé nhà bạn bị cảm; bạn muốn trung tâm biết thứ Năm này bé không tới. | Báo nghỉ một buổi học `F-42` | 2 · ≈ 5,4 giây |
| 10 | Phụ huynh | Bạn muốn biết với số tiền đã đóng, con còn học được mấy lần nữa. | Xem gói học và số buổi còn lại trên app `F-33` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 13 | 2 |  |
| Khoá học và lớp `lop` | hoc-vien | 13 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 17 | 1 |  |
| Lịch và buổi học `lich` | lop | 18 | 0 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 5 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lich | 8 | 1 |  |
| Báo cáo và quản trị `quan-tri` | diem-danh, goi-hoc | 10 | 0 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-22` · Gói và thu tiền
- Ghi nhận xét tiến bộ cuối cấp độ `F-35` · Học viên
- Xem nhận xét tiến bộ trên app `F-36` · Tài khoản
- Gửi SMS cho phụ huynh chưa cài app `F-87` · 

## Chức năng suy ra, người dùng xác nhận ở cổng (15)

- Xếp buổi học bù cho buổi vắng có phép `F-05`: Chọn một buổi vắng có phép của học viên, xếp bé vào một buổi của lớp cùng cấp độ; bé hiện trong danh sách điểm danh buổi đó, có mặt thì buổi vắng gốc chuyển đã học bù.
- Đối chiếu khoản thu trong ngày `F-11`: Danh sách khoản thu theo ngày, tách tiền mặt và chuyển khoản, tổng theo người thu, kèm mã biên lai, để đối chiếu tiền cuối ngày (lý do của M-05).
- Theo dõi đề nghị hoàn tiền `F-21`: Danh sách đề nghị hoàn tiền lọc theo trạng thái chờ duyệt, đã duyệt, từ chối, đã chi; quản lý tìm đề nghị chờ duyệt, lễ tân tìm đề nghị đã duyệt để ghi ngày chi.
- Sửa hồ sơ phụ huynh `F-27`: Sửa họ tên, số điện thoại, quan hệ của phụ huynh; số điện thoại mới trùng phụ huynh khác thì không lưu. Các con của phụ huynh vẫn gắn với hồ sơ này.
- Tự chuyển học viên sang đang học khi có gói `F-29`: Hệ thống chuyển học viên mới đăng ký hoặc đang học thử sang đang học khi học viên có gói học đầu tiên.
- Quản lý danh sách ngày nghỉ lễ `F-38`: Thêm, sửa, xoá ngày nghỉ lễ của trung tâm (ngày, tên). Buổi đã sinh rơi vào ngày lễ vừa thêm thì dời sang tuần sau.
- Báo nghỉ thay phụ huynh tại quầy `F-43`: Lễ tân ghi báo nghỉ khi phụ huynh gọi điện hay nhắn Zalo, cùng luật báo trước 2 giờ và giới hạn số lần như báo nghỉ trên app.
- Đánh dấu buổi học đã diễn ra `F-55`: Buổi dự kiến chuyển sang đã diễn ra khi qua giờ học hay khi điểm danh xong.
- Duyệt xếp học viên xuống lớp thấp hơn một bậc `F-60`: Xếp vào lớp thấp hơn cấp độ của bé một bậc chỉ khi Quản lý cho phép; thấp hơn hai bậc trở lên thì không xếp được.
- Tự xoá hồ sơ học thử quá 60 ngày `F-68`: Hồ sơ học thử không mua gói được giữ 60 ngày kể từ buổi học thử; quá hạn thì hệ thống tự xoá.
- Sửa thông tin và lớp phụ trách của nhân viên `F-73`: Đổi số điện thoại, vai, danh sách lớp phụ trách của HLV khi phân công thay đổi. UC-12 chỉ nêu thêm và khoá tài khoản; việc sửa là suy ra.
- Đổi mật khẩu `F-77`: Nhân viên đổi mật khẩu tạm nhận qua SMS thành mật khẩu riêng; mật khẩu mới tối thiểu 8 ký tự (BR-QT-05). Tài liệu không có bước này, suy từ mật khẩu tạm ở UC-12 bước 3.
- Xem thông báo đã gửi `F-81`: Danh sách thông báo đã gửi và đang chờ giờ hẹn: tiêu đề, người gửi, giờ gửi, khẩn hay không, số phụ huynh đã đọc; huỷ thông báo hẹn giờ trước khi gửi.
- Cài đặt nhận thông báo `F-83`: Phụ huynh tắt hoặc bật nhận thông báo thường như nhắc lịch; thông báo khẩn luôn nhận, không có nút tắt.
- Xem thông báo nội bộ `F-86`: Quản lý xem các báo nội bộ trên web quản trị: lễ tân vừa huỷ buổi vì sự cố, yêu cầu đổi lịch quá 24 giờ chưa xử lý.

## Hệ thống tự làm

- Tự chốt điểm danh cuối ngày `F-03`: 23:00 mỗi ngày, học viên còn chưa điểm danh trong buổi đã qua được ghi vắng không phép và trừ một buổi. Giờ chốt cố định, tài liệu không nêu việc cấu hình.
- Tự mở lại gói khi hết bảo lưu `F-13`: Hết số ngày bảo lưu, gói về đang dùng và buổi được sinh lại theo lịch cũ (sinh buổi thuộc module lịch). Lớp cũ đã đủ sĩ số thì lễ tân xếp lớp khác (UC-04, module lớp).
- Tự cập nhật hạn dùng và trạng thái gói `F-14`: Buổi học đầu tiên của gói đặt ngày bắt đầu và hết hạn (8/12/24 buổi: 2/3/6 tháng). Buổi trừ ở điểm danh về 0 hay quá hạn thì gói sang hết buổi, hết hạn; học viên không vào lớp tới khi mua gói mới. Gói nối tiếp tự dùng khi gói trước hết.
- Tự cộng buổi bù khi trung tâm huỷ buổi `F-15`: Buổi do trung tâm huỷ (bể sự cố, HLV không có người thay) không trừ buổi, gói được cộng thêm một buổi vào số buổi cộng thêm. Việc huỷ buổi thuộc module lịch.
- Tự chuyển học viên sang đang học khi có gói `F-29`: Hệ thống chuyển học viên mới đăng ký hoặc đang học thử sang đang học khi học viên có gói học đầu tiên.
- Sinh buổi học tự động `F-37`: Sinh buổi theo khung giờ của lớp, từ ngày khai giảng tới hết đợt, trạng thái dự kiến. Ngày trong danh sách nghỉ lễ không sinh buổi; buổi rơi vào ngày lễ dời sang tuần sau.
- Báo quản lý yêu cầu đổi lịch quá hạn `F-51`: Yêu cầu ở trạng thái chờ xử lý quá 24 giờ thì hệ thống báo quản lý.
- Đánh dấu buổi học đã diễn ra `F-55`: Buổi dự kiến chuyển sang đã diễn ra khi qua giờ học hay khi điểm danh xong.
- Tự xoá hồ sơ học thử quá 60 ngày `F-68`: Hồ sơ học thử không mua gói được giữ 60 ngày kể từ buổi học thử; quá hạn thì hệ thống tự xoá.
- Gửi nhắc lịch trước giờ học `F-85`: Khi nhắc lịch đang bật, hệ thống gửi thông báo đẩy cho phụ huynh trước mỗi buổi học 2 tiếng, theo mẫu nội dung quản lý đã đặt.
- Gửi SMS cho phụ huynh chưa cài app `F-87`: Phụ huynh chưa cài app (khoảng 15 %) nhận thông báo qua SMS; giai đoạn 2.
