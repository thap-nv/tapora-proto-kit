# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-03, le-tan, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-03, le-tan, ≈ 11,1 giây) · (5) màn dày nhất quay 6 chức năng, 0 tab · (4) nhóm menu dài nhất 5 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch · Lớp · Học viên · Học thử · *Gói và tiền:* Thu tiền · Gói học · *Liên lạc và báo cáo:* Thông báo · Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch · Lớp · Học viên · *Gói và tiền:* Thu tiền · Gói học · *Liên lạc và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Hôm nay | Hôm nay · Lịch dạy · Lớp · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-60` | T1 chính | trang |  | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05 |

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân · module Lịch

- Dải **Tìm học viên**: Tìm học viên · Đăng ký học viên mới
- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch · Xác nhận tiền chuyển khoản đã về · Gọi mời gia hạn gói
- Dải **Phụ huynh gọi tới**: Ghi báo nghỉ thay phụ huynh · Dời một buổi học sang lớp khác

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm học viên | Lễ tân, Quản lý, Huấn luyện viên | YC-01, M-01, D3:150-151 |
| Xử lý yêu cầu đổi lịch `F-20` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân | XD-02, M-03 |
| Ghi báo nghỉ thay phụ huynh `F-27` *suy* | T2 phụ | hộp thoại | Phụ huynh gọi tới | Lễ tân | XD-01, D1:68-68 |
| Xác nhận tiền chuyển khoản đã về `F-29` | T2 phụ | tại chỗ | Cần xử lý hôm nay | Lễ tân, Quản lý | UC-02, D3:176-176 |
| Gọi mời gia hạn gói `F-33` | T2 phụ | tại chỗ | Cần xử lý hôm nay | Lễ tân | BR-TT-06, S-02 |
| Đổi mật khẩu `F-61` *suy* | T3 hiếm | hộp thoại |  | Quản lý, Lễ tân, Huấn luyện viên | D3:407-407 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Dời một buổi học sang lớp khác *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Lịch

- Dải **Cần quản lý xử lý**: Xem cảnh báo cho quản lý · Duyệt đề nghị hoàn tiền
- Dải **HLV nghỉ hôm nay**: Phân công HLV dạy thay
- Dải **Tháng này**: Xem báo cáo chuyên cần · Xem báo cáo doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem cảnh báo cho quản lý `F-67` | T1 chính | tại chỗ | Cần quản lý xử lý | Quản lý | XD-02, XD-04 |
| Xem báo cáo chuyên cần `F-57` | T2 phụ | tại chỗ | Tháng này | Quản lý, Lễ tân | UC-11, S-01 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | Tháng này | Quản lý | UC-11, BR-QT-03, S-01 |
| Đổi mật khẩu `F-61` *suy* | T3 hiếm | hộp thoại |  | Quản lý, Lễ tân, Huấn luyện viên | D3:407-407 |

Lối tắt: Duyệt đề nghị hoàn tiền *(ngăn trượt)* · Phân công HLV dạy thay *(ngăn trượt)*

### Hôm nay · `day-hom-nay` · `admin/day-hom-nay.html`

Vai: Huấn luyện viên · module Lịch

- Dải **Buổi dạy hôm nay**: Xem lịch dạy
- Dải **Bé học thử chờ ghi cấp độ**: Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch dạy `F-16` | T1 chính | tại chỗ | Buổi dạy hôm nay | Huấn luyện viên, Quản lý, Lễ tân | D3:110-110, D3:241-241 |
| Ghi cấp độ gợi ý sau buổi học thử `F-41` | T2 phụ | hộp thoại | Bé học thử chờ ghi cấp độ | Huấn luyện viên | BR-LH-06, D7:33-33 |
| Đổi mật khẩu `F-61` *suy* | T3 hiếm | hộp thoại |  | Quản lý, Lễ tân, Huấn luyện viên | D3:407-407 |

### Lịch · `lich-tuan` · `admin/lich-tuan.html`

Vai: Lễ tân, Quản lý · module Lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần của trung tâm `F-15` | T1 chính | tại chỗ | Lưới làn × giờ | Lễ tân, Quản lý | YC-04, D3:109-109, M-03 |
| Xem lịch dạy `F-16` | T2 phụ | tại chỗ | Thanh công cụ | Huấn luyện viên, Quản lý, Lễ tân | D3:110-110, D3:241-241 |
| Huỷ buổi do trung tâm `F-21` | T2 phụ | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, A-02, XD-04, BR-TT-07, BR-TB-03, YC-14 |
| Phân công HLV dạy thay `F-22` | T4 ngữ cảnh | ngăn trượt | Ngăn lớp | Quản lý | A-02, D7:94-94 |
| Xếp buổi học bù `F-23` *suy* | T4 ngữ cảnh | ngăn trượt | Ngăn lớp | Lễ tân | D7:99-105 |

Lối tắt: Xếp học viên vào lớp *(ngăn trượt)* · Xử lý yêu cầu đổi lịch *(ngăn trượt)* · Sửa điểm danh *(ngăn trượt)* · Điểm danh buổi học *(trang; về: Lưu điểm danh xong thì về Lịch đúng tuần và ô lớp đang chọn, báo đã lưu; có nút Quay lại giữ nguyên tuần đang xem)*

### Lịch dạy · `lich-day` · `admin/lich-day.html`

Vai: Huấn luyện viên · module Lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch dạy `F-16` | T1 chính | tại chỗ | Tuần này | Huấn luyện viên, Quản lý, Lễ tân | D3:110-110, D3:241-241 |

### Điểm danh · `diem-danh` · `admin/diem-danh.html`

Vai: Huấn luyện viên, Quản lý · module Điểm danh · vào từ Hôm nay (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-24` | T1 chính | trang | Danh sách học viên | Huấn luyện viên, Quản lý | UC-05, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, M-04 |
| Sửa điểm danh `F-25` | T2 phụ | tại chỗ | Đầu buổi | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04, M-04 |

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách lớp và chỗ trống `F-08` | T1 chính | tại chỗ | Bảng lớp | Lễ tân, Quản lý, Huấn luyện viên | UC-04, YC-03, M-02 |
| Mở lớp `F-07` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-03, BR-LH-02, BR-LI-01, M-02 |
| Tạo khoá học `F-06` | T3 hiếm | ngăn trượt | Thanh công cụ | Quản lý | UC-03, BR-LH-01, BR-LH-05, XD-03, M-02 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lớp · vào từ Lớp (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-09` | T1 chính | ngăn trượt | Đầu lớp | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Đưa học viên vào danh sách chờ `F-10` | T2 phụ | hộp thoại | Hàng chờ | Lễ tân, Quản lý | BR-LH-04, M-02 |
| Gọi phụ huynh trong danh sách chờ `F-11` | T4 ngữ cảnh | tại chỗ | Hàng chờ | Lễ tân | BR-LH-04, D7:61-74 |
| Xoá học viên khỏi lớp `F-13` | T4 ngữ cảnh | hộp thoại | Học viên đang học | Lễ tân, Quản lý | BR-QT-04 |
| Đề xuất lên cấp độ cho học viên `F-14` *suy* | T4 ngữ cảnh | hộp thoại | Học viên đang học | Huấn luyện viên | A-07, D3:320-320 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-68` **hoãn** | T4 ngữ cảnh | ngăn trượt | Học viên đang học | Huấn luyện viên | S-04 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, Huấn luyện viên | YC-01, M-01, D3:150-151 |
| Đăng ký học viên mới `F-02` | T2 phụ | ngăn trượt | Tìm và lọc | Lễ tân, Quản lý | UC-01, BR-HV-01, BR-HV-02, BR-HV-04, M-01 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Tổng quan · Buổi học · Gói và thanh toán

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-03` | T1 chính | tại chỗ | Đầu hồ sơ | Lễ tân, Quản lý, Huấn luyện viên | D3:148-151, D3:105-105, D3:178-180, OQ-03 |
| Dời một buổi học sang lớp khác `F-19` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-08, BR-LI-02, M-03 |
| Sửa hồ sơ học viên `F-04` | T3 hiếm | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D3:106-106, A-08 |
| Cho học viên ngừng học `F-05` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05 |
| Chuyển lớp cố định `F-12` | T3 hiếm | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-08, BR-LI-02, A-07, OQ-02, M-03 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Bảo lưu gói học *(hộp thoại)* · Ghi báo nghỉ thay phụ huynh *(hộp thoại)* · Xếp buổi học bù *(ngăn trượt)*

### Học thử · `hoc-thu` · `admin/hoc-thu.html`

Vai: Lễ tân · module Học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đặt buổi học thử `F-40` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân | BR-LH-06, YC-05, S-03 |
| Xem danh sách khách học thử `F-42` *suy* | T2 phụ | tại chỗ | Khách học thử | Lễ tân | BR-LH-06 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)*

### Thu tiền · `thu-tien` · `admin/thu-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-28` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-09, A-05, M-05 |
| Xác nhận tiền chuyển khoản đã về `F-29` | T2 phụ | tại chỗ | Chờ xác nhận chuyển khoản | Lễ tân, Quản lý | UC-02, D3:176-176 |
| Đối chiếu tiền thu cuối ngày `F-38` *suy* | T2 phụ | tại chỗ | Đối chiếu cuối ca | Lễ tân, Quản lý | D6:24-24, M-05 |
| Áp mã khuyến mãi khi bán gói `F-39` **hoãn** | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | CO-01 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền · tab: Gói học · Đề nghị hoàn tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách gói học theo trạng thái `F-30` | T1 chính | tại chỗ | Bảng gói | Quản lý, Lễ tân | UC-09, D7:145-163 |
| Duyệt đề nghị hoàn tiền `F-35` | T2 phụ | hộp thoại | tab Đề nghị hoàn tiền | Quản lý | BR-TT-08, BR-QT-04 |
| Bảo lưu gói học `F-31` | T4 ngữ cảnh | hộp thoại | Bảng gói | Lễ tân, Quản lý | UC-09, BR-TT-05, YC-09, BR-QT-04, M-07 |
| Lập đề nghị hoàn tiền `F-34` | T4 ngữ cảnh | hộp thoại | Bảng gói | Lễ tân | BR-TT-08, A-08, OQ-01 |
| Ghi ngày đã chi hoàn tiền `F-36` | T4 ngữ cảnh | hộp thoại | tab Đề nghị hoàn tiền | Lễ tân | BR-TT-08 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Lễ tân, Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-44` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, BR-TB-01, BR-TB-03, YC-12, M-09 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Lễ tân, Quản lý · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-57` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, BR-QT-03, S-01 |
| Xuất báo cáo ra Excel `F-59` | T3 hiếm | hộp thoại | Thanh công cụ | Quản lý | D3:117-117, S-01 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm tài khoản nhân viên `F-62` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý | UC-12, BR-QT-01, M-08 |
| Gán lớp cho HLV `F-63` | T4 ngữ cảnh | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, BR-QT-02 |
| Khoá tài khoản nhân viên nghỉ việc `F-64` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, M-08 |
| Mở khoá tài khoản `F-65` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05, M-08 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Quản trị · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch · Nhật ký thao tác

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cập nhật danh sách ngày nghỉ lễ `F-18` *suy* | T2 phụ | hộp thoại | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D7:78-81 |
| Sửa bảng giá gói `F-37` | T2 phụ | tại chỗ | tab Bảng giá | Quản lý | BR-TT-03, D6:98-106 |
| Cấu hình nhắc lịch `F-46` | T2 phụ | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, D7:224-229 |
| Tra cứu nhật ký thao tác `F-66` | T2 phụ | tại chỗ | tab Nhật ký thao tác | Quản lý | BR-QT-04, M-08 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module App phụ huynh · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại `F-48` | T1 chính | trang |  | Phụ huynh | NF-05, D3:263-263 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module App phụ huynh

- Dải **Con đang xem**: Chọn con đang xem
- Dải **Buổi sắp tới**: Xem lịch học sắp tới · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học sắp tới `F-50` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, YC-11, M-06 |
| Chọn con đang xem `F-49` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03 |
| Báo nghỉ một buổi `F-53` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | UC-07, YC-08, BR-DD-03, BR-DD-04, XD-01, A-04, M-06 |
| Gửi yêu cầu đổi lịch `F-54` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, YC-07, M-06, D4:45-45 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module App phụ huynh · tab: Gói đang dùng · Lịch sử đóng tiền · Nhận xét của HLV

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn gói `F-51` | T1 chính | tại chỗ | tab Gói đang dùng | Phụ huynh | UC-06, BR-TT-01, M-06 |
| Xem lịch sử đóng tiền `F-52` | T2 phụ | tại chỗ | tab Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11 |
| Xem nhận xét tiến bộ của con `F-69` **hoãn** | T2 phụ | tại chỗ | tab Nhận xét của HLV | Phụ huynh | S-04 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đọc thông báo trong app `F-55` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-06, M-09 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tắt bật nhận thông báo `F-56` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Phụ huynh mới đưa con tới đăng ký học:** Tìm học viên → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh gọi xin nghỉ hay xin đổi buổi:** Tìm học viên → Ghi báo nghỉ thay phụ huynh → Dời một buổi học sang lớp khác → Xử lý yêu cầu đổi lịch
- **Lễ tân · Bể có sự cố giữa buổi chiều:** Xem lịch tuần của trung tâm → Huỷ buổi do trung tâm
- **Quản lý · Đầu đợt mở lớp mới:** Tạo khoá học → Mở lớp → Xem lịch tuần của trung tâm
- **Quản lý · Buổi sáng xem việc đang chờ:** Xem cảnh báo cho quản lý → Phân công HLV dạy thay → Duyệt đề nghị hoàn tiền
- **Huấn luyện viên · Dạy một buổi ở thành bể:** Xem lịch dạy → Điểm danh buổi học → Sửa điểm danh
- **Huấn luyện viên · Sau buổi học thử:** Xem lịch dạy → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Con ốm, báo nghỉ buổi chiều:** Chọn con đang xem → Xem lịch học sắp tới → Báo nghỉ một buổi
- **Phụ huynh · Xin chuyển sang buổi khác:** Xem lịch học sắp tới → Gửi yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh mới tới quầy muốn cho bé 5 tuổi học bơi; bé chưa có hồ sơ ở trung tâm. | Đăng ký học viên mới `F-02` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Mẹ bé Minh Anh chuyển khoản tiền gói 12 buổi từ sáng, ngân hàng vừa báo tiền đã về. | Xác nhận tiền chuyển khoản đã về `F-29` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Một phụ huynh gọi điện: bé sốt, chiều nay không đi học được. | Ghi báo nghỉ thay phụ huynh `F-27` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Có ba phụ huynh nhắn qua app xin chuyển buổi học tuần này sang ngày khác. | Xử lý yêu cầu đổi lịch `F-20` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Bé Gia Bảo vừa mua gói, cần cho bé vào một lớp Cơ bản còn chỗ chiều thứ Ba. | Xếp học viên vào lớp `F-09` | 2 · ≈ 5,4 giây |
| 6 | Lễ tân | Hết ca chiều, cần khớp tiền mặt trong két với số tiền đã thu trong ca. | Đối chiếu tiền thu cuối ngày `F-38` | 2 · ≈ 5,4 giây |
| 7 | Huấn luyện viên | Lớp 17:30 vừa xuống nước, cần ghi bé nào có mặt, bé nào vắng. | Điểm danh buổi học `F-24` | 1 · ≈ 5,7 giây |
| 8 | Quản lý | Sáng nay HLV Tuấn nhắn bị ốm, các lớp của anh ấy hôm nay cần người đứng thay. | Phân công HLV dạy thay `F-22` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Bé ốm từ sáng, muốn cho trung tâm biết chiều nay bé ở nhà. | Báo nghỉ một buổi `F-53` | 2 · ≈ 5,4 giây |
| 10 | Phụ huynh | Định mua gói tiếp cho con, muốn biết gói đang học còn dùng được bao lâu nữa. | Xem số buổi còn lại và hạn gói `F-51` | 2 · ≈ 5,4 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 5 | 0 |  |
| Quản trị `quan-tri` | — | 7 | 0 |  |
| Lớp `lop` | hoc-vien, quan-tri | 9 | 0 |  |
| Lịch `lich` | lop | 10 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 12 | 1 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 4 | 0 |  |
| Học thử `hoc-thu` | lich, goi-hoc | 4 | 0 |  |
| Thông báo `thong-bao` | lop | 4 | 1 |  |
| App phụ huynh `app-phu-huynh` | lich, goi-hoc, diem-danh, thong-bao | 9 | 0 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |
| Đánh giá tiến bộ `danh-gia` | lop, app-phu-huynh | 2 | 2 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-39` · Thu tiền
- Gửi SMS cho phụ huynh chưa cài app `F-47` · 
- Ghi nhận xét kỹ năng cuối cấp độ `F-68` · Chi tiết lớp
- Xem nhận xét tiến bộ của con `F-69` · Gói học

## Chức năng suy ra, người dùng xác nhận ở cổng (8)

- Đề xuất lên cấp độ cho học viên `F-14`: HLV đề xuất bé lên cấp cao hơn khi gói còn buổi; lễ tân nhận đề xuất để chuyển lớp. Tài liệu không nói đề xuất đi qua hệ thống.
- Cập nhật danh sách ngày nghỉ lễ `F-18`: Thêm, bỏ ngày nghỉ lễ của trung tâm; buổi rơi vào ngày lễ dời sang tuần sau. Tài liệu không nói ai cập nhật danh sách.
- Xếp buổi học bù `F-23`: Buổi vắng có phép được xếp học bù ở lớp cùng cấp độ; học xong buổi bù thì buổi gốc thành đã học bù. Chỉ schema nhắc tới.
- Ghi báo nghỉ thay phụ huynh `F-27`: Phụ huynh gọi hay nhắn quầy: lễ tân ghi báo nghỉ cho một buổi, cùng luật 2 giờ và 3 lần mỗi gói như trên app. Tài liệu chỉ nói quầy đang nhận báo nghỉ.
- Đối chiếu tiền thu cuối ngày `F-38`: Tổng thu trong ca theo tiền mặt và chuyển khoản, danh sách biên lai, để đối chiếu với tiền trong két cuối ngày.
- Xem danh sách khách học thử `F-42`: Bé đã học thử chưa mua gói, kèm cấp độ gợi ý và ngày hết giữ hồ sơ (60 ngày), để lễ tân gọi mời mua gói.
- Tắt bật nhận thông báo `F-56`: Phụ huynh tắt loại thông báo thường như nhắc lịch; thông báo khẩn không tắt được. Chỉ ngụ ý từ BR-TB-04 (đang 🟡 I).
- Đổi mật khẩu `F-61`: Nhân viên đổi mật khẩu tạm nhận qua SMS ở lần đăng nhập đầu, hay tự đổi sau đó.

## Hệ thống tự làm

- Sinh buổi học tự động `F-17`: Sinh buổi theo khung giờ của lớp, từ ngày khai giảng tới hết đợt; ngày lễ không sinh buổi, buổi rơi vào ngày lễ dời sang tuần sau.
- Chốt điểm danh cuối ngày `F-26`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép, trừ một buổi.
- Cập nhật trạng thái gói tự động `F-32`: Hết bảo lưu thì sinh lại buổi theo lịch cũ; gói hết buổi hay hết hạn thì học viên không vào lớp được tới khi mua gói mới.
- Hết hạn giữ hồ sơ học thử `F-43`: Không mua gói thì hồ sơ học thử giữ 60 ngày rồi hệ thống xoá.
- Gửi nhắc lịch tự động `F-45`: Nhắc phụ huynh qua app trước giờ học 2 tiếng, theo nội dung mẫu, khi quản lý bật nhắc lịch.
- Gửi SMS cho phụ huynh chưa cài app `F-47`: Thông báo gửi thêm qua SMS cho phụ huynh chưa cài app (khoảng 15 %). GĐ2.
