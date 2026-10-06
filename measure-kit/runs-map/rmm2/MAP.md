# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-26, quan-ly, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-12, le-tan, ≈ 11,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 3 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch tuần · Học viên · Lớp · *Gói và tiền:* Gói học · Thu chi · *Phụ huynh:* Yêu cầu đổi lịch · Thông báo · *Báo cáo:* Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch tuần · Học viên · Lớp · *Gói và tiền:* Gói học · Thu chi · *Phụ huynh:* Yêu cầu đổi lịch · Thông báo · *Quản trị:* Báo cáo · Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| HLV `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lớp · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân · module Học viên

- Dải **Tìm học viên**: Tìm học viên
- Dải **Việc nhanh**: Đăng ký học viên mới · Bán gói học và thu tiền · Ghi báo nghỉ thay phụ huynh
- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch · Xác nhận tiền chuyển khoản đã về · Gọi mời gia hạn

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm học viên | Lễ tân, Quản lý, HLV | UC-01, YC-01, M-01 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Ghi báo nghỉ thay phụ huynh *(hộp thoại)* · Xử lý yêu cầu đổi lịch *(ngăn trượt)* · Xác nhận tiền chuyển khoản đã về *(hộp thoại)* · Gọi mời gia hạn *(ngăn trượt)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Lịch

- Dải **Cần chú ý**: Xem cảnh báo vận hành · Duyệt đề nghị hoàn tiền
- Dải **Tháng này**: Xem báo cáo chuyên cần · Xem báo cáo doanh thu
- Dải **Việc nhanh**: Phân HLV dạy thay · Gửi thông báo cho phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem cảnh báo vận hành `F-50` | T1 chính | tại chỗ | Cần chú ý | Quản lý | XD-02, XD-04 |
| Xem báo cáo chuyên cần `F-52` | T2 phụ | tại chỗ | Tháng này | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-53` | T2 phụ | tại chỗ | Tháng này | Quản lý | UC-11, BR-QT-03, S-01 |

Lối tắt: Duyệt đề nghị hoàn tiền *(hộp thoại)* · Phân HLV dạy thay *(hộp thoại)* · Gửi thông báo cho phụ huynh *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: HLV · module Điểm danh

- Dải **Buổi đang dạy**: Điểm danh buổi học · Ghi cấp độ gợi ý sau buổi học thử
- Dải **Các buổi hôm nay**: Xem lịch dạy của tôi · Sửa điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-26` | T1 chính | tại chỗ | Buổi đang dạy | HLV, Quản lý | UC-05, BR-DD-01, BR-DD-03, BR-TT-04, A-05, A-10, YC-06, M-04 |
| Xem lịch dạy của tôi `F-17` | T2 phụ | tại chỗ | Các buổi hôm nay | HLV | UC-05, D3:110, BR-QT-02 |
| Ghi cấp độ gợi ý sau buổi học thử `F-08` | T4 ngữ cảnh | tại chỗ | Buổi đang dạy | HLV | BR-LH-06, S-03 |
| Sửa điểm danh `F-27` | T4 ngữ cảnh | tại chỗ | Các buổi hôm nay | HLV, Quản lý | BR-DD-05, BR-QT-04, M-04 |

### Lịch tuần · `lich` · `admin/lich.html`

Vai: Lễ tân, Quản lý · module Lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần toàn trung tâm `F-16` | T1 chính | trang | Lưới làn × giờ | Lễ tân, Quản lý | YC-04, D3:109 |
| Phân HLV dạy thay `F-24` | T2 phụ | hộp thoại | Thanh công cụ | Quản lý | A-02 |
| Huỷ buổi học do trung tâm `F-23` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03, YC-14 |
| Xem lớp: sĩ số, học viên, danh sách chờ `F-11` | T4 ngữ cảnh | ngăn trượt | Lưới làn × giờ | Lễ tân, Quản lý, HLV | UC-04, YC-03, BR-QT-02 |

### Buổi học · `buoi-hoc` · `admin/buoi-hoc.html`

Vai: Lễ tân, Quản lý · module Điểm danh · vào từ Lịch tuần (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-26` | T1 chính | tại chỗ | Danh sách học viên | HLV, Quản lý | UC-05, BR-DD-01, BR-DD-03, BR-TT-04, A-05, A-10, YC-06, M-04 |
| Xếp buổi học bù `F-31` | T2 phụ | hộp thoại | Đầu buổi | Lễ tân | D7:104 |
| Sửa điểm danh `F-27` | T4 ngữ cảnh | hộp thoại | Danh sách học viên | HLV, Quản lý | BR-DD-05, BR-QT-04, M-04 |
| Ghi báo nghỉ thay phụ huynh `F-30` *suy* | T4 ngữ cảnh | hộp thoại | Danh sách học viên | Lễ tân | XD-01, CO-02 |

### Yêu cầu đổi lịch · `yeu-cau-doi` · `admin/yeu-cau-doi.html`

Vai: Lễ tân, Quản lý · module Lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch `F-22` | T1 chính | ngăn trượt | Danh sách yêu cầu | Lễ tân | XD-02, UC-08, M-03 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, HLV · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, HLV | UC-01, YC-01, M-01 |
| Đăng ký học viên mới `F-02` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-01, BR-HV-01, BR-HV-02, BR-HV-04, M-01 |
| Đặt buổi học thử `F-07` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-LH-06, S-03, YC-05 |
| Cho học viên ngừng học `F-05` | T4 ngữ cảnh | hộp thoại | Bảng học viên | Lễ tân, Quản lý | BR-HV-05 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, HLV · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Gói học · Lịch học · Đóng tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-32` | T1 chính | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-05, A-09, BR-LH-06, YC-10, M-05 |
| Xem hồ sơ học viên `F-03` | T2 phụ | trang | Đầu hồ sơ | Lễ tân, Quản lý, HLV | UC-01, UC-02, BR-QT-02, OQ-03, D3:105 |
| Xếp học viên vào lớp `F-12` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Đổi lịch học `F-20` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-08, BR-LI-02, XD-02, A-07, OQ-02, M-03 |
| Sửa hồ sơ học viên và phụ huynh `F-04` | T3 hiếm | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D3:106, M-01 |
| Áp mã khuyến mãi khi bán gói `F-44` **hoãn** | T4 ngữ cảnh | tại chỗ | Đầu hồ sơ | Lễ tân | CO-01 |

Lối tắt: Bảo lưu gói học *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, HLV · module Lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lớp: sĩ số, học viên, danh sách chờ `F-11` | T1 chính | trang | Bảng lớp | Lễ tân, Quản lý, HLV | UC-04, YC-03, BR-QT-02 |
| Mở lớp `F-10` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-03, BR-LH-02, BR-LI-01, YC-02, M-02 |
| Tạo khoá học `F-09` | T3 hiếm | hộp thoại | Thanh công cụ | Quản lý | UC-03, BR-LH-01, BR-LH-05, XD-03, M-02 |

### Chi tiết lớp · `chi-tiet-lop` · `admin/chi-tiet-lop.html`

Vai: Lễ tân, Quản lý, HLV · module Lớp · vào từ Lớp (tìm và chọn một bản ghi) · tab: Học viên · Danh sách chờ · Buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-12` | T2 phụ | ngăn trượt | tab Học viên | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Đưa học viên vào danh sách chờ `F-13` | T2 phụ | hộp thoại | tab Danh sách chờ | Lễ tân | BR-LH-04, UC-04 |
| Gọi học viên trong danh sách chờ khi lớp có chỗ `F-14` | T4 ngữ cảnh | tại chỗ | tab Danh sách chờ | Lễ tân | BR-LH-04, M-02 |
| Xoá học viên khỏi lớp `F-15` | T4 ngữ cảnh | hộp thoại | tab Học viên | Lễ tân, Quản lý | BR-QT-04 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-61` **hoãn** | T4 ngữ cảnh | ngăn trượt | tab Học viên | HLV | S-04 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học · tab: Tất cả gói · Cần gia hạn

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách gói học theo trạng thái `F-34` | T1 chính | trang | tab Tất cả gói | Lễ tân, Quản lý | UC-09, BR-TT-04 |
| Bán gói học và thu tiền `F-32` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-05, A-09, BR-LH-06, YC-10, M-05 |
| Gọi mời gia hạn `F-36` | T2 phụ | tại chỗ | tab Cần gia hạn | Lễ tân | BR-TT-06, S-02 |
| Bảo lưu gói học `F-35` | T4 ngữ cảnh | ngăn trượt | tab Tất cả gói | Lễ tân, Quản lý | UC-09, BR-TT-05, BR-QT-04, YC-09, M-07 |

### Thu chi · `thu-chi` · `admin/thu-chi.html`

Vai: Lễ tân, Quản lý · module Gói học · tab: Thu trong ngày · Hoàn tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đối chiếu tiền thu cuối ngày `F-43` *suy* | T1 chính | trang | tab Thu trong ngày | Lễ tân | M-05, D6:24 |
| Lập đề nghị hoàn tiền `F-37` | T2 phụ | hộp thoại | tab Hoàn tiền | Lễ tân | BR-TT-08, A-08, OQ-01 |
| Xác nhận tiền chuyển khoản đã về `F-33` | T4 ngữ cảnh | tại chỗ | tab Thu trong ngày | Lễ tân | UC-02, M-05 |
| Duyệt đề nghị hoàn tiền `F-38` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Quản lý | BR-TT-08, BR-QT-04 |
| Ghi ngày đã chi hoàn tiền `F-39` | T4 ngữ cảnh | tại chỗ | tab Hoàn tiền | Lễ tân | BR-TT-08 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Lễ tân, Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-45` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, BR-TB-01, BR-TB-03, YC-12, M-09 |
| Gửi SMS cho phụ huynh chưa cài app `F-51` **hoãn** | T3 hiếm | tại chỗ | Thanh công cụ | Quản lý, Lễ tân | CO-02 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Lễ tân, Quản lý · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-52` | T1 chính | trang | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, YC-13 |
| Xem báo cáo doanh thu `F-53` | T2 phụ | trang | tab Doanh thu | Quản lý | UC-11, BR-QT-03, S-01 |
| Xuất báo cáo ra Excel `F-54` | T3 hiếm | tại chỗ | Khoảng thời gian | Quản lý | D3:117, S-01 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Tài khoản

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm, sửa tài khoản nhân viên `F-55` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý | UC-12, BR-QT-01, BR-QT-02, YC-14, M-08 |
| Khoá, mở khoá tài khoản nhân viên `F-56` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05, M-08 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Tài khoản

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-57` | T1 chính | trang | Bảng nhật ký | Quản lý | BR-QT-04, M-08 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Tài khoản · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Khai báo ngày nghỉ lễ `F-19` *suy* | T2 phụ | hộp thoại | tab Ngày nghỉ lễ | Quản lý | BR-LI-04 |
| Sửa bảng giá gói học `F-40` | T2 phụ | ngăn trượt | tab Bảng giá | Quản lý | BR-TT-03, D6:106, M-05 |
| Cài đặt nhắc lịch tự động `F-46` | T2 phụ | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, M-09 |

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Lễ tân, Quản lý, HLV · module Tài khoản · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-58` | T1 chính | tại chỗ | Đăng nhập | Quản lý, Lễ tân, HLV | BR-QT-01, BR-QT-05 |
| Đổi mật khẩu `F-59` *suy* | T2 phụ | hộp thoại | Đăng nhập | Quản lý, Lễ tân, HLV | UC-12 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Tài khoản · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại `F-60` | T1 chính | tại chỗ | Đăng nhập | Phụ huynh | NF-05, UC-06 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Lịch

- Dải **Con đang xem**: Chọn con đang xem
- Dải **Buổi sắp tới**: Xem lịch học của con · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Số buổi còn lại**: Xem gói học và số buổi còn lại

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học của con `F-25` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, YC-11, M-06 |
| Chọn con đang xem `F-06` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03 |
| Xem gói học và số buổi còn lại `F-41` | T2 phụ | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06, YC-11, M-06 |
| Gửi yêu cầu đổi lịch `F-21` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, YC-07, M-06 |
| Báo nghỉ một buổi `F-29` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | UC-07, BR-DD-03, BR-DD-04, XD-01, A-04, YC-08, M-06 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và số buổi còn lại `F-41` | T1 chính | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06, YC-11, M-06 |
| Xem lịch sử đóng tiền `F-42` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11 |
| Xem nhận xét tiến bộ của con `F-62` **hoãn** | T2 phụ | tại chỗ | Nhận xét của HLV | Phụ huynh | S-04 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo `F-48` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-06, M-09 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Tài khoản

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tắt thông báo không khẩn `F-49` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới tới quầy cho con học:** Tìm học viên → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh xin đổi buổi qua app:** Xử lý yêu cầu đổi lịch → Đổi lịch học
- **Lễ tân · Cuối ca:** Xác nhận tiền chuyển khoản đã về → Đối chiếu tiền thu cuối ngày
- **Quản lý · Mở lớp đầu đợt:** Tạo khoá học → Mở lớp → Xem lịch tuần toàn trung tâm
- **Quản lý · Phụ huynh khiếu nại số buổi:** Tìm học viên → Xem hồ sơ học viên → Tra cứu nhật ký thao tác → Sửa điểm danh
- **Quản lý · Cuối tháng xem số:** Xem báo cáo chuyên cần → Xem báo cáo doanh thu → Xuất báo cáo ra Excel
- **HLV · Một buổi dạy ở thành bể:** Xem lịch dạy của tôi → Điểm danh buổi học → Sửa điểm danh
- **HLV · Buổi học thử:** Điểm danh buổi học → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Bé ốm, xin nghỉ:** Chọn con đang xem → Xem lịch học của con → Báo nghỉ một buổi
- **Phụ huynh · Xin sang buổi khác:** Xem lịch học của con → Gửi yêu cầu đổi lịch → Xem thông báo
- **Phụ huynh · Trước khi đóng tiền tiếp:** Xem gói học và số buổi còn lại → Xem lịch sử đóng tiền

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một mẹ dẫn bé 5 tuổi tới quầy, muốn cho bé học bơi; nhà chưa có ai học ở trung tâm. | Đăng ký học viên mới `F-02` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Anh Minh tới quầy đóng thêm 12 buổi cho con, bé đang học lớp Cơ bản. | Bán gói học và thu tiền `F-32` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Chị Lan gọi điện: bé Na sốt, chiều nay không tới bể được. | Ghi báo nghỉ thay phụ huynh `F-30` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Sáng nay ba phụ huynh nhờ chuyển con sang hôm khác qua app, chưa ai được trả lời. | Xử lý yêu cầu đổi lịch `F-22` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Mẹ bé Bin chuyển khoản hôm qua, giờ tiền đã vào tài khoản trung tâm. | Xác nhận tiền chuyển khoản đã về `F-33` | 1 · ≈ 2,7 giây |
| 6 | Lễ tân | Mẹ bé Tôm gọi hỏi lớp Cơ bản tối thứ Ba còn nhận thêm bé không. | Xem lớp: sĩ số, học viên, danh sách chờ `F-11` | 1 · ≈ 2,7 giây |
| 7 | HLV | Lớp 17:30 vừa bắt đầu, các bé đã xuống nước; thầy cần ghi lại bé nào tới. | Điểm danh buổi học `F-26` | 1 · ≈ 2,7 giây |
| 8 | Quản lý | 7 giờ sáng, thầy Hùng nhắn bị sốt, hôm nay không dạy được. | Phân HLV dạy thay `F-24` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Bé Su ốm từ sáng, mẹ muốn cho trung tâm biết chiều nay bé không tới. | Báo nghỉ một buổi `F-29` | 2 · ≈ 5,4 giây |
| 10 | Phụ huynh | Bố muốn biết bao giờ thì phải đóng tiền tiếp cho con. | Xem gói học và số buổi còn lại `F-41` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 6 | 0 |  |
| Tài khoản `tai-khoan` | — | 6 | 0 |  |
| Lớp `lop` | hoc-vien, tai-khoan | 7 | 0 |  |
| Lịch `lich` | lop | 10 | 0 |  |
| Gói học `goi-hoc` | hoc-vien, lich | 13 | 1 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 6 | 0 |  |
| Thông báo `thong-bao` | lich | 7 | 1 |  |
| Học thử `hoc-thu` | hoc-vien, lop | 2 | 0 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |
| Tiến bộ `tien-bo` | hoc-vien, lop | 2 | 2 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-44` · Hồ sơ học viên
- Gửi SMS cho phụ huynh chưa cài app `F-51` · Thông báo
- Ghi nhận xét kỹ năng cuối cấp độ `F-61` · Chi tiết lớp
- Xem nhận xét tiến bộ của con `F-62` · Gói học

## Chức năng suy ra, người dùng xác nhận ở cổng (5)

- Khai báo ngày nghỉ lễ `F-19`: Thêm, sửa danh sách ngày nghỉ lễ của trung tâm; buổi rơi vào ngày lễ tự dời sang tuần sau. Tài liệu có danh sách nhưng không nói ai khai báo.
- Ghi báo nghỉ thay phụ huynh `F-30`: Phụ huynh gọi quầy báo nghỉ (quầy vẫn nhận tới sát giờ, khoảng 15 % phụ huynh chưa dùng app): lễ tân ghi báo nghỉ cho buổi đó theo cùng luật 2 giờ và 3 lần mỗi gói.
- Đối chiếu tiền thu cuối ngày `F-43`: Cuối ca, lễ tân xem các khoản mình đã thu trong ngày theo tiền mặt và chuyển khoản để đối chiếu với tiền trong két.
- Tắt thông báo không khẩn `F-49`: Phụ huynh tắt thông báo thường hay tin nhắc lịch; thông báo khẩn không tắt được (BR-TB-04 còn 🟡 I).
- Đổi mật khẩu `F-59`: Nhân viên nhận mật khẩu tạm qua SMS thì đổi sang mật khẩu riêng ở lần đăng nhập đầu, và đổi lại khi cần.

## Hệ thống tự làm

- Sinh buổi học theo khung giờ lớp `F-18`: Hệ thống sinh buổi từ ngày khai giảng tới hết đợt; ngày nghỉ lễ không sinh, buổi rơi vào ngày lễ dời sang tuần sau.
- Chốt điểm danh cuối ngày `F-28`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép, trừ buổi.
- Gửi nhắc lịch trước giờ học `F-47`: Hệ thống tự gửi tin nhắc cho phụ huynh trước giờ học 2 tiếng khi việc nhắc đang bật.
