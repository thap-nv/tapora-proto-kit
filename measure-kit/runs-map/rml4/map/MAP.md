# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-03, quan-ly, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-03, quan-ly, ≈ 11,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 2 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch trung tâm · Học viên · Lớp học · *Gói và tiền:* Gói và thu tiền · Hoàn tiền · Báo cáo · *Phụ huynh:* Thông báo cho phụ huynh · *Quản trị:* Khoá học và mở lớp · Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Lễ tân `le-tan` | Web quản trị | Hôm nay | *Hằng ngày:* Hôm nay · Lịch trung tâm · Học viên · Lớp học · *Gói, tiền và phụ huynh:* Gói và thu tiền · Hoàn tiền · Thông báo cho phụ huynh · Báo cáo | sidebar phẳng |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lớp học · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo | 3 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Tài khoản và nhật ký · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-60` | T1 chính | trang |  | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05 |
| Đổi mật khẩu tạm lần đầu đăng nhập `F-67` *suy* | T2 phụ | hộp thoại |  | Quản lý, Lễ tân, Huấn luyện viên | UC-12 |

### Hôm nay · `hom-nay` · `admin/hom-nay.html`

Vai: Lễ tân · module Lịch và buổi học

- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch của phụ huynh · Xem danh sách cần gọi mời gia hạn
- Dải **Việc nhanh**: Đăng ký học viên mới · Bán gói học và thu tiền · Xếp học viên vào lớp · Tìm học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch của phụ huynh `F-22` | T1 chính | tại chỗ | Yêu cầu đổi lịch | Lễ tân | XD-02, M-06, D8:118-131 |
| Tìm học viên `F-02` | T2 phụ | tại chỗ | Tìm học viên | Lễ tân, Quản lý | YC-01, M-01 |
| Xem danh sách cần gọi mời gia hạn `F-44` | T2 phụ | tại chỗ | Cần gọi gia hạn | Lễ tân | BR-TT-06, S-02 |
| Ghi kết quả cuộc gọi mời gia hạn `F-45` | T2 phụ | hộp thoại | Cần gọi gia hạn | Lễ tân | BR-TT-06, D8:171-176 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo

- Dải **Cần quyết định**: Duyệt hoặc từ chối hoàn tiền · Chọn HLV dạy thay
- Dải **Số liệu tháng**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần
- Dải **Việc nhanh**: Gửi thông báo cho phụ huynh · Mở lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Duyệt hoặc từ chối hoàn tiền `F-47` | T1 chính | tại chỗ | Cần quyết định | Quản lý | BR-TT-08, BR-QT-04 |
| Chọn HLV dạy thay `F-27` | T2 phụ | hộp thoại | Cần quyết định | Quản lý | A-02, BR-TB-03 |
| Xem báo cáo chuyên cần `F-57` | T2 phụ | tại chỗ | Số liệu tháng | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | Số liệu tháng | Quản lý | UC-11, S-01, BR-QT-03 |

Lối tắt: Gửi thông báo cho phụ huynh *(ngăn trượt)* · Mở lớp *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi dạy hôm nay**: Xem lịch dạy · Điểm danh buổi học
- Dải **Cần bổ sung**: Sửa điểm danh đã lưu · Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-31` | T1 chính | ngăn trượt | Buổi hôm nay | Huấn luyện viên, Quản lý | UC-05, M-04, BR-DD-01, BR-DD-03, BR-DD-04, A-05, A-10, YC-06 |
| Ghi cấp độ gợi ý sau buổi học thử `F-07` | T2 phụ | hộp thoại | Buổi hôm nay | Huấn luyện viên | BR-LH-06 |
| Xem lịch dạy `F-19` | T2 phụ | tại chỗ | Buổi hôm nay | Huấn luyện viên, Quản lý, Lễ tân | UC-05, D4:110, BR-QT-02 |
| Sửa điểm danh đã lưu `F-32` | T2 phụ | ngăn trượt | Buổi đã qua | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04 |
| Đề xuất bé lên cấp độ cao hơn `F-17` | T4 ngữ cảnh | hộp thoại | Buổi hôm nay | Huấn luyện viên | A-07, UC-08 |

### Lịch trung tâm · `lich` · `admin/lich.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm `F-18` | T1 chính | tại chỗ | Lưới lịch | Quản lý, Lễ tân | YC-04, D4:109 |
| Xem lịch dạy `F-19` | T2 phụ | tại chỗ | Lưới lịch | Huấn luyện viên, Quản lý, Lễ tân | UC-05, D4:110, BR-QT-02 |
| Đổi một buổi sang lớp khác `F-20` | T2 phụ | ngăn trượt | Ngăn chi tiết lớp | Lễ tân | UC-08, M-03, BR-LI-02, XD-02 |
| Chuyển lớp cố định `F-21` | T2 phụ | ngăn trượt | Ngăn chi tiết lớp | Lễ tân | UC-08, M-03 |
| Xếp buổi học bù `F-28` | T2 phụ | ngăn trượt | Ngăn chi tiết lớp | Lễ tân | D8:99-104, BR-TT-07 |
| Huỷ buổi khi bể có sự cố `F-26` | T3 hiếm | hộp thoại | Lưới lịch | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03 |

### Điểm danh và sửa điểm danh · `diem-danh` · `admin/diem-danh.html`

Vai: Quản lý · module Điểm danh · vào từ Lịch trung tâm (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-31` | T1 chính | trang | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | UC-05, M-04, BR-DD-01, BR-DD-03, BR-DD-04, A-05, A-10, YC-06 |
| Sửa điểm danh đã lưu `F-32` | T2 phụ | tại chỗ | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Học viên và phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng ký học viên mới `F-01` | T1 chính | ngăn trượt | Bảng học viên | Lễ tân, Quản lý | UC-01, M-01, BR-HV-01, BR-HV-02, BR-HV-04, YC-01 |
| Tìm học viên `F-02` | T2 phụ | tại chỗ | Tìm và lọc | Lễ tân, Quản lý | YC-01, M-01 |
| Đặt buổi học thử `F-06` | T2 phụ | ngăn trượt | Bảng học viên | Lễ tân | BR-LH-06, S-03, YC-05 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Học viên và phụ huynh · vào từ Học viên (tìm và chọn một bản ghi) · tab: Gói học · Buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-03` | T1 chính | tại chỗ | Đầu hồ sơ | Quản lý, Lễ tân, Huấn luyện viên | UC-01, D4:105, BR-QT-02, BR-HV-03 |
| Sửa hồ sơ học viên `F-04` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D4:106, BR-HV-04 |
| Xem gói học và số buổi còn lại `F-38` | T2 phụ | tại chỗ | tab Gói học | Lễ tân, Quản lý, Huấn luyện viên | UC-06, UC-09, BR-TT-04 |
| Bảo lưu gói học `F-39` | T2 phụ | hộp thoại | tab Gói học | Lễ tân, Quản lý | UC-09, M-07, BR-TT-05, YC-09, BR-QT-04 |
| Cho học viên ngừng học `F-05` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05 |
| Ghi nhận xét tiến bộ cuối cấp độ `F-50` **hoãn** | T4 ngữ cảnh | ngăn trượt | tab Buổi học | Huấn luyện viên | S-04 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Xem lịch sử đóng tiền và in lại biên lai *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Đổi một buổi sang lớp khác *(ngăn trượt)*

### Lớp học · `lop` · `admin/lop.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-12` | T1 chính | ngăn trượt | Bảng lớp | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, A-01, A-06 |
| Xem danh sách lớp và chỗ còn trống `F-11` | T2 phụ | tại chỗ | Bảng lớp | Lễ tân, Quản lý, Huấn luyện viên | UC-04, YC-03, D4:108 |
| Đưa học viên vào danh sách chờ `F-14` | T2 phụ | hộp thoại | Bảng lớp | Lễ tân | BR-LH-04, M-02 |
| Gọi phụ huynh từ danh sách chờ `F-15` | T2 phụ | tại chỗ | Danh sách chờ | Lễ tân | BR-LH-04 |
| Xếp học viên xuống một cấp độ `F-13` | T3 hiếm | hộp thoại | Bảng lớp | Lễ tân, Quản lý | BR-LH-03 |
| Xoá học viên khỏi lớp `F-16` | T3 hiếm | hộp thoại | Bảng lớp | Lễ tân, Quản lý | BR-QT-04, D8:61-68 |

### Khoá học và mở lớp · `mo-lop` · `admin/mo-lop.html`

Vai: Quản lý · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Mở lớp `F-10` | T1 chính | ngăn trượt | Lớp | Quản lý | UC-03, M-02, BR-LH-02, YC-02 |
| Tạo khoá học `F-09` | T2 phụ | hộp thoại | Khoá học | Quản lý | UC-03, M-02, BR-LH-01, BR-LH-05, XD-03 |

### Gói và thu tiền · `goi-hoc` · `admin/goi-hoc.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-35` | T1 chính | ngăn trượt | Thu trong ngày | Lễ tân, Quản lý | UC-02, M-05, BR-TT-01, BR-TT-02, BR-TT-03, A-09, YC-10 |
| Xác nhận chuyển khoản đã về `F-36` | T2 phụ | tại chỗ | Chờ xác nhận | Lễ tân | UC-02 |
| Xem lịch sử đóng tiền và in lại biên lai `F-37` | T2 phụ | tại chỗ | Lịch sử thu | Lễ tân, Quản lý | UC-02, BR-TT-02 |
| Xem tổng thu trong ngày `F-42` *suy* | T2 phụ | tại chỗ | Thu trong ngày | Lễ tân, Quản lý | M-05, D7:23-27 |
| Áp mã khuyến mãi khi bán gói `F-49` **hoãn** | T4 ngữ cảnh | hộp thoại | Thu trong ngày | Lễ tân | CO-01 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Duyệt hoặc từ chối hoàn tiền `F-47` | T1 chính | tại chỗ | Đề nghị hoàn tiền | Quản lý | BR-TT-08, BR-QT-04 |
| Lập đề nghị hoàn tiền `F-46` | T2 phụ | hộp thoại | Đề nghị hoàn tiền | Lễ tân | BR-TT-08, A-08 |
| Ghi ngày đã chi hoàn tiền `F-48` | T2 phụ | hộp thoại | Đề nghị hoàn tiền | Lễ tân | BR-TT-08 |

### Thông báo cho phụ huynh · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-52` | T1 chính | trang | Soạn thông báo | Quản lý, Lễ tân | UC-10, M-09, BR-TB-01, BR-TB-03, YC-12 |
| Gửi SMS cho phụ huynh chưa cài app `F-53` **hoãn** | T2 phụ | tại chỗ | Soạn thông báo | Quản lý, Lễ tân | CO-02, BR-TB-01 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-57` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, S-01, BR-QT-03 |
| Xuất báo cáo ra file Excel `F-59` | T3 hiếm | tại chỗ | Chọn khoảng thời gian | Quản lý | D4:117 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Tài khoản và nhật ký

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm tài khoản nhân viên `F-62` | T1 chính | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, M-08, BR-QT-01, YC-14 |
| Chọn lớp phụ trách cho HLV `F-63` | T2 phụ | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, BR-QT-02 |
| Khoá tài khoản nhân viên nghỉ việc `F-64` | T3 hiếm | hộp thoại | Bảng nhân viên | Quản lý | UC-12 |
| Mở khoá tài khoản `F-65` | T3 hiếm | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Tài khoản và nhật ký

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra nhật ký thao tác `F-66` | T1 chính | trang | Bảng nhật ký | Quản lý | BR-QT-04, M-08 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Gói học và thu tiền · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Khai báo ngày nghỉ lễ `F-25` | T3 hiếm | hộp thoại | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D8:73-77 |
| Sửa bảng giá `F-43` | T3 hiếm | tại chỗ | tab Bảng giá | Quản lý | D7:98-106, BR-TT-03 |
| Cấu hình nhắc lịch `F-55` | T3 hiếm | ngăn trượt | tab Nhắc lịch | Quản lý | BR-TB-02, D8:223-229 |

## App phụ huynh

### Đăng nhập · `dang-nhap-app` · `app/dang-nhap-app.html`

Vai: Phụ huynh · module Tài khoản và nhật ký · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng mã OTP `F-61` | T1 chính | trang |  | Phụ huynh | NF-05, UC-06 |

### Lịch học · `lich-con` · `app/lich-con.html`

Vai: Phụ huynh · module Lịch và buổi học

- Dải **Buổi sắp tới**: Xem lịch học của con · Báo nghỉ một buổi
- Dải **Việc nhanh**: Gửi yêu cầu đổi lịch · Chọn con đang xem

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học của con `F-30` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, M-06 |
| Chọn con đang xem `F-08` | T2 phụ | tại chỗ | Chọn con | Phụ huynh | BR-HV-03 |
| Gửi yêu cầu đổi lịch `F-23` | T2 phụ | sheet | Buổi sắp tới | Phụ huynh | XD-02, M-06 |
| Báo nghỉ một buổi `F-34` | T2 phụ | sheet | Buổi sắp tới | Phụ huynh | UC-07, M-06, XD-01, A-04, BR-DD-04 |

### Gói học · `goi-con` · `app/goi-con.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học của con `F-40` | T1 chính | tại chỗ | Gói đang dùng | Phụ huynh | UC-06, M-06, YC-11 |
| Xem lịch sử đóng tiền của con `F-41` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11 |
| Xem nhận xét tiến bộ của con `F-51` **hoãn** | T2 phụ | tại chỗ | Tiến bộ của con | Phụ huynh | S-04 |

### Thông báo · `thong-bao-app` · `app/thong-bao-app.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo `F-54` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-06, BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Phụ huynh mới đến đăng ký cho con:** Tìm học viên → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Đầu ca gọi mời gia hạn:** Xem danh sách cần gọi mời gia hạn → Ghi kết quả cuộc gọi mời gia hạn → Bán gói học và thu tiền
- **Lễ tân · Xử lý yêu cầu đổi lịch từ app:** Xử lý yêu cầu đổi lịch của phụ huynh → Đổi một buổi sang lớp khác
- **Quản lý · Cuối tháng xem số liệu:** Xem báo cáo doanh thu → Xem báo cáo chuyên cần → Xuất báo cáo ra file Excel
- **Quản lý · Bể có sự cố:** Huỷ buổi khi bể có sự cố → Gửi thông báo cho phụ huynh
- **Huấn luyện viên · Dạy một buổi:** Xem lịch dạy → Điểm danh buổi học → Sửa điểm danh đã lưu
- **Phụ huynh · Con ốm, xin nghỉ buổi chiều:** Chọn con đang xem → Xem lịch học của con → Báo nghỉ một buổi
- **Phụ huynh · Xin dời buổi học:** Xem lịch học của con → Gửi yêu cầu đổi lịch → Xem thông báo

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh dắt bé đến quầy, muốn cho bé học bơi từ tuần sau, bé chưa có hồ sơ. | Đăng ký học viên mới `F-01` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Phụ huynh đưa tiền mặt, muốn mua tiếp 12 buổi cho bé đang học. | Bán gói học và thu tiền `F-35` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Lớp Cơ bản tối thứ Ba vừa có một bé nghỉ, cần biết ai đang đợi lớp đó để gọi. | Gọi phụ huynh từ danh sách chờ `F-15` | 2 · ≈ 5,4 giây |
| 4 | Lễ tân | Đầu ca, cần biết hôm nay gọi những bé nào sắp học hết số buổi. | Xem danh sách cần gọi mời gia hạn `F-44` | 1 · ≈ 2,7 giây |
| 5 | Huấn luyện viên | Buổi 17:30 bắt đầu, đang đứng ở thành bể, cần ghi bé nào đến lớp. | Điểm danh buổi học `F-31` | 1 · ≈ 2,7 giây |
| 6 | Huấn luyện viên | Sáng nay nhớ ra hôm qua ghi nhầm một bé vắng, cần sửa lại. | Sửa điểm danh đã lưu `F-32` | 1 · ≈ 2,7 giây |
| 7 | Quản lý | Bơm lọc hỏng lúc 15:00, chiều nay không bé nào xuống bể được. | Huỷ buổi khi bể có sự cố `F-26` | 3 · ≈ 8,1 giây |
| 8 | Quản lý | Chủ trung tâm hỏi tháng này thu được bao nhiêu. | Xem báo cáo doanh thu `F-58` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Bé sốt sáng nay, chiều nay không đến lớp được. | Báo nghỉ một buổi `F-34` | 1 · ≈ 2,7 giây |
| 10 | Phụ huynh | Muốn biết bé còn mấy buổi và tới khi nào thì hết hạn. | Xem gói học của con `F-40` | 2 · ≈ 5,4 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Tài khoản và nhật ký `quan-tri` | — | 8 | 0 |  |
| Học viên và phụ huynh `hoc-vien` | — | 10 | 2 |  |
| Khoá học và lớp `lop` | hoc-vien | 9 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 15 | 1 |  |
| Lịch và buổi học `lich` | lop, goi-hoc | 13 | 0 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 4 | 0 |  |
| Thông báo `thong-bao` | hoc-vien | 5 | 1 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-49` · Gói và thu tiền
- Ghi nhận xét tiến bộ cuối cấp độ `F-50` · Hồ sơ học viên
- Xem nhận xét tiến bộ của con `F-51` · Gói học
- Gửi SMS cho phụ huynh chưa cài app `F-53` · Thông báo cho phụ huynh

## Chức năng suy ra, người dùng xác nhận ở cổng (2)

- Xem tổng thu trong ngày `F-42`: Tổng tiền mặt và chuyển khoản trong ngày để đối chiếu cuối ngày. Lễ tân không xem doanh thu theo BR-QT-03, chỉ xem số thu của ca mình.
- Đổi mật khẩu tạm lần đầu đăng nhập `F-67`: Nhân viên nhận mật khẩu tạm qua SMS thì cần đổi sang mật khẩu riêng (tối thiểu 8 ký tự).

## Hệ thống tự làm

- Báo quản lý khi yêu cầu đổi lịch chờ quá 24 giờ `F-24`: Hệ thống tự báo quản lý khi yêu cầu quá 24 giờ chưa xử lý.
- Sinh buổi học tự động theo khung giờ lớp `F-29`: Hệ thống sinh buổi theo khung giờ từ ngày khai giảng tới hết đợt, bỏ ngày lễ; sinh buổi cho học viên theo gói.
- Chốt vắng không phép cuối ngày `F-33`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép.
- Gửi nhắc lịch tự động `F-56`: Hệ thống tự gửi nhắc cho phụ huynh trước giờ học 2 tiếng.
