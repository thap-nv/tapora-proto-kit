# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 2 bước (F-03, le-tan, ≈ 8,4 giây), việc hằng ngày xa nhất 2 bước (F-03, le-tan, ≈ 8,4 giây) · (5) màn dày nhất lich 7 chức năng, 0 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Hôm nay | *Hằng ngày:* Hôm nay · Lịch · Học viên · Lớp · *Tiền:* Gói và thu tiền · Gọi mời gia hạn · Hoàn tiền · *Thông báo và báo cáo:* Thông báo · Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch · Điểm danh · *Học viên và lớp:* Học viên · Lớp · Khoá học và lớp mở · *Tiền:* Gói và thu tiền · Gọi mời gia hạn · Hoàn tiền · *Thông báo và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Điểm danh · Lịch · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-67` | T1 chính | trang |  | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05, YC-14 |

### Hôm nay · `hom-nay` · `admin/hom-nay.html`

Vai: Lễ tân · module Lịch và buổi học

- Dải **Việc nhanh**: Bán gói học và thu tiền · Đăng ký học viên mới · Xếp học viên vào lớp · Tìm học viên
- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch của phụ huynh · Xác nhận chuyển khoản đã về

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-38` | T1 chính | ngăn trượt | Việc nhanh | Lễ tân, Quản lý | UC-02, M-05, BR-TT-01, BR-TT-02, BR-TT-03, A-09, D8:136-180 |
| Đăng ký học viên mới `F-01` | T2 phụ | ngăn trượt | Việc nhanh | Lễ tân, Quản lý | UC-01, M-01, BR-HV-01, BR-HV-02, BR-HV-04 |
| Tìm học viên `F-02` | T2 phụ | tại chỗ | Việc nhanh | Lễ tân, Quản lý, Huấn luyện viên | YC-01, M-01, D4:135-136 |
| Xếp học viên vào lớp `F-11` | T2 phụ | ngăn trượt | Việc nhanh | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, A-01, A-06, D8:61-74 |
| Xử lý yêu cầu đổi lịch của phụ huynh `F-21` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân, Quản lý | XD-02, M-06, D8:118-132 |
| Xác nhận chuyển khoản đã về `F-39` | T2 phụ | tại chỗ | Cần xử lý hôm nay | Lễ tân, Quản lý | UC-02 |

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo

- Dải **Cần duyệt**: Duyệt hoặc từ chối đề nghị hoàn tiền
- Dải **Số của tháng**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Duyệt hoặc từ chối đề nghị hoàn tiền `F-49` | T1 chính | ngăn trượt | Cần duyệt | Quản lý | BR-TT-08, BR-QT-04 |
| Xem báo cáo chuyên cần `F-60` | T2 phụ | tại chỗ | Số của tháng | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-61` | T2 phụ | tại chỗ | Số của tháng | Quản lý | UC-11, S-01, BR-QT-03 |

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi dạy hôm nay**: Điểm danh buổi học
- Dải **Học thử cần ghi**: Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Ghi cấp độ gợi ý sau buổi học thử `F-07` | T2 phụ | hộp thoại | Học thử cần ghi | Huấn luyện viên | BR-LH-06 |

Lối tắt: Điểm danh buổi học *(trang; về: Lưu điểm danh xong thì về Buổi dạy hôm nay, báo đã lưu; có nút Quay lại giữ nguyên danh sách)*

### Điểm danh · `diem-danh` · `admin/diem-danh.html`

Vai: Huấn luyện viên, Quản lý · module Điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-30` | T1 chính | trang | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | UC-05, M-04, BR-DD-01, A-05, A-10, D8:99-116 |
| Sửa điểm danh đã lưu `F-31` | T4 ngữ cảnh | hộp thoại | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04 |

### Lịch · `lich` · `admin/lich.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm theo ngày và tuần `F-16` | T1 chính | tại chỗ | Lưới làn và giờ | Lễ tân, Quản lý | YC-04, D4:99-121, D8:78-97 |
| Xem lịch dạy của mình `F-17` | T2 phụ | tại chỗ | Lưới làn và giờ | Huấn luyện viên | D4:99-121, BR-QT-02 |
| Đổi một buổi sang lớp khác `F-18` | T2 phụ | ngăn trượt | Ngăn chi tiết buổi | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02, XD-02 |
| Xử lý yêu cầu đổi lịch của phụ huynh `F-21` | T2 phụ | ngăn trượt | Ngăn chi tiết buổi | Lễ tân, Quản lý | XD-02, M-06, D8:118-132 |
| Chọn HLV dạy thay `F-25` | T3 hiếm | hộp thoại | Ngăn chi tiết buổi | Quản lý | A-02, BR-TB-03 |
| Huỷ buổi học khi bể có sự cố `F-26` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03, D8:83-97 |
| Chuyển học viên sang lớp cố định khác `F-19` | T4 ngữ cảnh | ngăn trượt | Ngăn chi tiết buổi | Lễ tân, Quản lý | UC-08, A-07, OQ-02 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-02` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, Huấn luyện viên | YC-01, M-01, D4:135-136 |
| Đặt buổi học thử `F-06` | T3 hiếm | ngăn trượt | Tìm và lọc | Lễ tân, Quản lý | S-03, BR-LH-06, YC-05 |
| Ghi nhận xét tiến bộ cuối cấp độ `F-69` **hoãn** | T3 hiếm | ngăn trượt | Bảng học viên | Huấn luyện viên | S-04 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)*

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Thông tin · Gói và đóng tiền · Lịch học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-03` | T1 chính | trang | Đầu hồ sơ | Lễ tân, Quản lý, Huấn luyện viên | D4:99-121, D4:124-152, BR-QT-02, D8:19-34 |
| Sửa hồ sơ học viên và ghi chú sức khoẻ `F-04` | T2 phụ | ngăn trượt | tab Thông tin | Lễ tân, Quản lý | D4:99-121, BR-HV-04, D8:11-17 |
| Cho học viên ngừng học `F-05` | T4 ngữ cảnh | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05 |
| Xếp buổi học bù cho buổi vắng có phép `F-20` | T4 ngữ cảnh | ngăn trượt | tab Lịch học | Lễ tân, Quản lý | D8:99-116 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Bảo lưu gói học *(hộp thoại)* · Đổi một buổi sang lớp khác *(ngăn trượt)* · Chuyển học viên sang lớp cố định khác *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-11` | T1 chính | ngăn trượt | Danh sách lớp và chỗ trống | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, A-01, A-06, D8:61-74 |
| Xem danh sách chờ để gọi phụ huynh khi lớp có chỗ `F-13` | T2 phụ | tại chỗ | Ngăn danh sách chờ | Lễ tân, Quản lý | BR-LH-04 |
| Cho học viên vào danh sách chờ của lớp `F-12` | T4 ngữ cảnh | hộp thoại | Ngăn danh sách chờ | Lễ tân, Quản lý | BR-LH-04, M-02, A-01 |
| Cho học viên rời lớp `F-14` | T4 ngữ cảnh | hộp thoại | Danh sách lớp và chỗ trống | Lễ tân, Quản lý | BR-QT-04, D8:61-65 |
| Cho phép xếp học viên xuống một cấp độ `F-15` | T4 ngữ cảnh | hộp thoại | Danh sách lớp và chỗ trống | Quản lý | BR-LH-03 |

### Khoá học và lớp mở · `khoa-hoc` · `admin/khoa-hoc.html`

Vai: Quản lý · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Mở lớp `F-10` | T1 chính | ngăn trượt | Danh sách lớp đã mở | Quản lý | UC-03, BR-LH-02, D8:51-59 |
| Tạo khoá học `F-09` | T2 phụ | hộp thoại | Danh sách khoá | Quản lý | UC-03, M-02, BR-LH-01, BR-LH-05, XD-03, D8:38-49 |

### Gói và thu tiền · `goi-thu-tien` · `admin/goi-thu-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-38` | T1 chính | ngăn trượt | Thu hôm nay | Lễ tân, Quản lý | UC-02, M-05, BR-TT-01, BR-TT-02, BR-TT-03, A-09, D8:136-180 |
| Xác nhận chuyển khoản đã về `F-39` | T2 phụ | tại chỗ | Chờ xác nhận tiền | Lễ tân, Quản lý | UC-02 |
| Đối chiếu tiền thu cuối ngày `F-40` | T2 phụ | tại chỗ | Thu hôm nay | Lễ tân, Quản lý | M-05, D7:19-28 |
| Xem danh sách gói đang bảo lưu `F-42` | T2 phụ | tại chỗ | Gói đang bảo lưu | Quản lý | UC-09 |
| Bảo lưu gói học `F-41` | T3 hiếm | hộp thoại | Gói đang bảo lưu | Lễ tân, Quản lý | UC-09, M-07, BR-TT-05, D8:165-170 |
| Nhập mã khuyến mãi khi bán gói `F-53` **hoãn** | T3 hiếm | hộp thoại | Thu hôm nay | Lễ tân, Quản lý | CO-01 |

### Gọi mời gia hạn · `gia-han` · `admin/gia-han.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách học viên sắp hết buổi để gọi mời gia hạn `F-46` | T1 chính | tại chỗ | Học viên sắp hết buổi | Lễ tân, Quản lý | S-02, BR-TT-06 |
| Ghi kết quả cuộc gọi mời gia hạn `F-47` | T2 phụ | hộp thoại | Học viên sắp hết buổi | Lễ tân, Quản lý | BR-TT-06, D8:182-187 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách đề nghị hoàn tiền `F-51` | T1 chính | tại chỗ | Danh sách đề nghị | Lễ tân, Quản lý | BR-TT-08 |
| Lập đề nghị hoàn tiền `F-48` | T2 phụ | ngăn trượt | Danh sách đề nghị | Lễ tân | BR-TT-08, A-08, OQ-01, D8:189-205 |
| Duyệt hoặc từ chối đề nghị hoàn tiền `F-49` | T4 ngữ cảnh | hộp thoại | Danh sách đề nghị | Quản lý | BR-TT-08, BR-QT-04 |
| Ghi ngày đã chi hoàn tiền `F-50` | T4 ngữ cảnh | hộp thoại | Danh sách đề nghị | Lễ tân | BR-TT-08 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Lễ tân, Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-54` | T1 chính | ngăn trượt | Soạn và gửi | Quản lý, Lễ tân | UC-10, M-09, BR-TB-01, BR-TB-03, BR-TB-04, D8:209-222 |
| Gửi SMS cho phụ huynh chưa cài app `F-59` **hoãn** | T3 hiếm | hộp thoại | Soạn và gửi | Lễ tân, Quản lý | CO-02 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-60` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-61` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, S-01, BR-QT-03 |
| Xuất báo cáo ra file Excel `F-62` | T3 hiếm | hộp thoại | tab Doanh thu | Quản lý | D4:99-121 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-66` | T1 chính | tại chỗ | Bảng nhật ký | Quản lý | M-08, BR-QT-04, D8:247-255 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Quản trị · tab: Nhân viên · Bảng giá · Nhắc lịch · Ngày nghỉ lễ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Quản lý ngày nghỉ lễ `F-29` *suy* | T3 hiếm | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D8:78-81 |
| Sửa bảng giá gói `F-45` | T3 hiếm | ngăn trượt | tab Bảng giá | Quản lý | D7:98-106, BR-TT-03, D8:136-143 |
| Cấu hình nhắc lịch `F-56` | T3 hiếm | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, D8:224-229 |
| Thêm nhân viên và gán vai `F-63` | T3 hiếm | ngăn trượt | tab Nhân viên | Quản lý | UC-12, M-08, BR-QT-01, BR-QT-05, D8:233-245 |
| Gán lớp cho HLV `F-64` | T4 ngữ cảnh | ngăn trượt | tab Nhân viên | Quản lý | UC-12, BR-QT-02 |
| Khoá hoặc mở khoá tài khoản nhân viên `F-65` | T4 ngữ cảnh | hộp thoại | tab Nhân viên | Quản lý | UC-12, BR-QT-05 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại và mã OTP `F-68` | T1 chính | trang |  | Phụ huynh | NF-05 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Điểm danh

- Dải **Buổi sắp tới**: Xem lịch học của con
- Dải **Việc nhanh**: Báo nghỉ một buổi · Gửi yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học của con `F-35` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, M-06 |
| Chọn con đang xem `F-08` | T2 phụ | tại chỗ | Chọn con | Phụ huynh | BR-HV-03 |
| Gửi yêu cầu đổi lịch `F-22` | T2 phụ | sheet | Việc nhanh | Phụ huynh | XD-02, M-06, YC-07 |
| Xem trạng thái yêu cầu đổi lịch `F-23` | T2 phụ | tại chỗ | Yêu cầu đổi lịch | Phụ huynh | XD-02 |
| Báo nghỉ một buổi `F-34` | T2 phụ | sheet | Việc nhanh | Phụ huynh | UC-07, M-06, BR-DD-03, BR-DD-04, A-04, XD-01 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn gói `F-36` | T1 chính | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06, YC-11 |
| Xem lịch sử đóng tiền và biên lai `F-37` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo `F-57` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-06 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bật tắt thông báo `F-58` *suy* | T3 hiếm | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04 |
| Xem đánh giá tiến bộ của con `F-70` **hoãn** | T3 hiếm | tại chỗ | Tiến bộ của con | Phụ huynh | S-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới tới mua gói:** Tìm học viên → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh xin dời buổi qua app:** Xử lý yêu cầu đổi lịch của phụ huynh → Đổi một buổi sang lớp khác
- **Quản lý · Cuối tháng xem số và duyệt hoàn tiền:** Duyệt hoặc từ chối đề nghị hoàn tiền → Xem báo cáo doanh thu → Xem báo cáo chuyên cần
- **Huấn luyện viên · Điểm danh một buổi:** Điểm danh buổi học → Sửa điểm danh đã lưu
- **Phụ huynh · Bé ốm, báo nghỉ rồi xin buổi khác:** Xem lịch học của con → Báo nghỉ một buổi → Gửi yêu cầu đổi lịch → Xem trạng thái yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Phụ huynh đưa tiền mặt mua gói 12 buổi cho bé đã có hồ sơ. | Bán gói học và thu tiền `F-38` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Một bé mới đến, phụ huynh chưa từng tới trung tâm. | Đăng ký học viên mới `F-01` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Bé vừa mua gói, cần chọn lớp Cơ bản chiều thứ Ba cho bé. | Xếp học viên vào lớp `F-11` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Một phụ huynh nhắn qua app xin dời buổi thứ Tư sang tuần sau. | Xử lý yêu cầu đổi lịch của phụ huynh `F-21` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Bơm lọc hỏng lúc 14:00, các buổi chiều nay không thể bơi. | Huỷ buổi học khi bể có sự cố `F-26` | 3 · ≈ 8,1 giây |
| 6 | Huấn luyện viên | Buổi 17:30 bắt đầu, có bé có mặt và có bé vắng. | Điểm danh buổi học `F-30` | 1 · ≈ 2,7 giây |
| 7 | Phụ huynh | Bé ốm sáng nay, chiều có buổi học. | Báo nghỉ một buổi `F-34` | 1 · ≈ 2,7 giây |
| 8 | Phụ huynh | Muốn biết con còn mấy buổi. | Xem số buổi còn lại và hạn gói `F-36` | 2 · ≈ 5,4 giây |
| 9 | Quản lý | Cuối tháng, chủ trung tâm muốn biết tháng này thu được bao nhiêu. | Xem báo cáo doanh thu `F-61` | 1 · ≈ 2,7 giây |
| 10 | Quản lý | Lễ tân báo có một đề nghị hoàn tiền đang chờ quyết định. | Duyệt hoặc từ chối đề nghị hoàn tiền `F-49` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 10 | 2 |  |
| Khoá học và lớp `lop-hoc` | hoc-vien | 7 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 18 | 1 |  |
| Lịch và buổi học `lich` | lop-hoc | 14 | 0 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 6 | 0 |  |
| Thông báo `thong-bao` | lich | 6 | 1 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |
| Quản trị `quan-tri` | — | 6 | 0 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Nhập mã khuyến mãi khi bán gói `F-53` · Gói và thu tiền
- Gửi SMS cho phụ huynh chưa cài app `F-59` · Thông báo
- Ghi nhận xét tiến bộ cuối cấp độ `F-69` · Học viên
- Xem đánh giá tiến bộ của con `F-70` · Tài khoản

## Chức năng suy ra, người dùng xác nhận ở cổng (2)

- Quản lý ngày nghỉ lễ `F-29`: Thêm, sửa danh sách ngày nghỉ lễ của trung tâm để hệ thống không sinh buổi vào ngày đó. Tài liệu có bảng và quy tắc nhưng không nói ai nhập.
- Bật tắt thông báo `F-58`: Quy tắc nói phụ huynh không tắt được thông báo khẩn, tức các thông báo khác tắt được. Quy tắc còn là suy luận (BR-TB-04).

## Hệ thống tự làm

- Báo quản lý khi yêu cầu đổi lịch quá 24 giờ chưa xử lý `F-24`: Hệ thống tự báo quản lý khi yêu cầu chờ quá 24 giờ.
- Báo quản lý ngay khi lễ tân huỷ buổi `F-27`: Quản lý nhận thông báo ngay khi buổi bị huỷ để biết.
- Tự sinh buổi học theo khung giờ của lớp `F-28`: Sinh buổi từ ngày khai giảng tới hết đợt; ngày lễ không sinh buổi, buổi rơi vào ngày lễ dời sang tuần sau.
- Tự ghi vắng không phép lúc 23:00 `F-32`: Học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép.
- Tự trừ buổi còn lại và đếm lần vắng có phép `F-33`: Có mặt và vắng không phép trừ một buổi; vắng có phép không trừ; từ lần thứ 4 mỗi gói tính như vắng không phép.
- Tự chuyển gói sang hết buổi hoặc hết hạn `F-43`: Gói hết buổi hoặc hết hạn thì học viên không vào lớp được tới khi mua gói mới.
- Tự sinh lại buổi khi hết bảo lưu `F-44`: Hết bảo lưu thì hệ thống sinh lại buổi theo lịch cũ.
- Tự cộng thêm một buổi khi trung tâm huỷ buổi `F-52`: Buổi do trung tâm huỷ không trừ buổi và gói được cộng thêm một buổi.
- Tự gửi nhắc lịch trước giờ học `F-55`: Tự nhắc phụ huynh trước giờ học 2 tiếng.
