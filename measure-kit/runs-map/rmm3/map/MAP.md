# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-33, quan-ly, ≈ 8,1 giây), việc hằng ngày xa nhất 3 bước (F-33, quan-ly, ≈ 8,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 3 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch tuần · Đổi lịch và học bù · *Học viên và lớp:* Học viên · Lớp học · Gói và thu tiền · *Liên lạc và số liệu:* Thông báo · Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch tuần · Đổi lịch và học bù · *Học viên và lớp:* Học viên · Lớp học · Gói và thu tiền · *Liên lạc và số liệu:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lớp học · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-65` | T1 chính | tại chỗ | Form đăng nhập | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05 |

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân · module Học viên

- Dải **Tìm học viên**: Tìm học viên
- Dải **Việc nhanh**: Đăng ký học viên mới · Bán gói học và thu tiền · Đặt buổi học thử · Ghi báo nghỉ thay phụ huynh
- Dải **Cần xử lý**: Xử lý yêu cầu đổi lịch · Xác nhận chuyển khoản đã về
- Dải **Cần gọi**: Gọi mời gia hạn · Gọi phụ huynh trong danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm học viên | Lễ tân, Quản lý, Huấn luyện viên | UC-01, YC-01, M-01, D3:151, BR-QT-02 |
| Gọi phụ huynh trong danh sách chờ `F-16` | T2 phụ | tại chỗ | Cần gọi | Lễ tân | BR-LH-04, M-02 |
| Xử lý yêu cầu đổi lịch `F-31` | T2 phụ | ngăn trượt | Cần xử lý | Lễ tân, Quản lý | XD-02, UC-08, M-03 |
| Ghi báo nghỉ thay phụ huynh `F-37` *suy* | T2 phụ | hộp thoại | Việc nhanh | Lễ tân | D5:18, D6:26, D4:39 |
| Xác nhận chuyển khoản đã về `F-39` | T2 phụ | tại chỗ | Cần xử lý | Lễ tân, Quản lý | UC-02, M-05, D3:176 |
| Gọi mời gia hạn `F-43` | T2 phụ | tại chỗ | Cần gọi | Lễ tân | S-02, BR-TT-06 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Đặt buổi học thử *(ngăn trượt)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo

- Dải **Hôm nay ở bể**: Xem lịch tuần toàn trung tâm
- Dải **Cần quyết**: Duyệt đề nghị hoàn tiền · Xử lý yêu cầu đổi lịch
- Dải **HLV nghỉ hôm nay**: Phân công HLV dạy thay
- Dải **Số liệu tháng này**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần
- Dải **Việc nhanh**: Gửi thông báo cho phụ huynh · Huỷ buổi do trung tâm

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần toàn trung tâm `F-19` | T2 phụ | tại chỗ | Hôm nay ở bể | Quản lý, Lễ tân | YC-04, M-03, D3:109 |
| Xem báo cáo chuyên cần `F-57` | T2 phụ | tại chỗ | Số liệu tháng này | Quản lý, Lễ tân | UC-11, YC-13, S-01 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | Số liệu tháng này | Quản lý | UC-11, YC-13, S-01, BR-QT-03 |

Lối tắt: Duyệt đề nghị hoàn tiền *(hộp thoại)* · Xử lý yêu cầu đổi lịch *(ngăn trượt)* · Phân công HLV dạy thay *(ngăn trượt)* · Gửi thông báo cho phụ huynh *(ngăn trượt)* · Huỷ buổi do trung tâm *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi đang diễn ra**: Điểm danh buổi học
- Dải **Lịch dạy tuần này**: Xem lịch dạy
- Dải **Buổi vừa dạy**: Sửa điểm danh
- Dải **Bé học thử hôm nay**: Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-33` | T1 chính | tại chỗ | Buổi đang diễn ra | Huấn luyện viên, Quản lý | UC-05, YC-06, M-04, BR-DD-01, BR-DD-03, BR-DD-04, A-05, A-10, D3:111 |
| Ghi cấp độ gợi ý sau buổi học thử `F-08` | T2 phụ | hộp thoại | Bé học thử hôm nay | Huấn luyện viên | BR-LH-06, D7:33 |
| Xem lịch dạy `F-20` | T2 phụ | tại chỗ | Lịch dạy tuần này | Huấn luyện viên, Quản lý, Lễ tân | D3:110, D3:241, UC-03, BR-QT-02 |
| Sửa điểm danh `F-34` | T4 ngữ cảnh | ngăn trượt | Buổi vừa dạy | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04, M-04, D7:114-115 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng ký học viên mới `F-03` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-01, YC-01, M-01, BR-HV-01, BR-HV-02, BR-HV-04 |
| Tìm học viên `F-01` | T2 phụ | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, Huấn luyện viên | UC-01, YC-01, M-01, D3:151, BR-QT-02 |
| Đặt buổi học thử `F-07` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | S-03, YC-05, BR-LH-06 |
| Theo dõi bé học thử chưa mua gói `F-09` *suy* | T2 phụ | tại chỗ | Tìm và lọc | Lễ tân | BR-LH-06 |
| Cho học viên ngừng học `F-05` | T4 ngữ cảnh | hộp thoại | Bảng học viên | Lễ tân, Quản lý | BR-HV-05, A-08 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Thông tin · Lịch học · Gói học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-38` | T1 chính | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-02, YC-10, M-05, BR-TT-01, BR-TT-02, BR-TT-03, BR-LH-06, A-05, A-09 |
| Xem hồ sơ học viên `F-02` | T2 phụ | trang | Đầu hồ sơ | Lễ tân, Quản lý, Huấn luyện viên | M-01, D3:105, D3:148-151, D3:180, BR-QT-02 |
| Sửa hồ sơ học viên và phụ huynh `F-04` | T2 phụ | ngăn trượt | tab Thông tin | Lễ tân, Quản lý | D3:106, YC-01, BR-HV-02 |
| Đổi một buổi học `F-26` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02 |
| Bảo lưu gói học `F-40` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân, Quản lý | UC-09, YC-09, M-07, BR-TT-05, BR-QT-04 |
| Áp mã khuyến mãi khi bán gói `F-47` **hoãn** | T4 ngữ cảnh | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | CO-01 |

Lối tắt: Xếp học viên vào lớp *(ngăn trượt)* · Chuyển lớp cố định *(ngăn trượt)*

### Lớp học · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lớp học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-14` | T1 chính | ngăn trượt | Bảng lớp | Lễ tân, Quản lý | UC-04, YC-03, M-02, BR-LH-03, A-01, A-06 |
| Mở lớp `F-12` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-03, YC-02, M-02, BR-LH-02, BR-LI-01 |
| Xem danh sách lớp và chỗ trống `F-13` | T2 phụ | tại chỗ | Bảng lớp | Lễ tân, Quản lý, Huấn luyện viên | UC-04, YC-03, M-02, BR-QT-02 |
| Đưa học viên vào danh sách chờ `F-15` | T4 ngữ cảnh | hộp thoại | Bảng lớp | Lễ tân | BR-LH-04, M-02, A-01 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lớp học · vào từ Lớp học (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gọi phụ huynh trong danh sách chờ `F-16` | T2 phụ | tại chỗ | Danh sách chờ | Lễ tân | BR-LH-04, M-02 |
| Cho học viên rời lớp `F-17` | T4 ngữ cảnh | hộp thoại | Học viên trong lớp | Lễ tân, Quản lý | BR-QT-04 |
| Đề xuất cho học viên lên cấp độ `F-18` *suy* | T4 ngữ cảnh | hộp thoại | Học viên trong lớp | Huấn luyện viên | A-07, D3:320 |
| Chuyển lớp cố định `F-27` | T4 ngữ cảnh | ngăn trượt | Học viên trong lớp | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02, A-07 |
| Ghi nhận xét tiến bộ cuối cấp độ `F-67` **hoãn** | T4 ngữ cảnh | ngăn trượt | Học viên trong lớp | Huấn luyện viên | S-04 |

### Lịch tuần · `lich` · `admin/lich.html`

Vai: Quản lý, Lễ tân · module Lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần toàn trung tâm `F-19` | T2 phụ | trang | Lưới làn và giờ | Quản lý, Lễ tân | YC-04, M-03, D3:109 |
| Xem lịch dạy `F-20` | T2 phụ | tại chỗ | Thanh công cụ | Huấn luyện viên, Quản lý, Lễ tân | D3:110, D3:241, UC-03, BR-QT-02 |
| Huỷ buổi do trung tâm `F-23` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | A-02, A-03, XD-04, BR-TT-07, BR-TB-03, YC-14 |
| Phân công HLV dạy thay `F-24` | T4 ngữ cảnh | ngăn trượt | Ngăn chi tiết lớp | Quản lý | A-02, D7:94 |
| Điểm danh buổi học `F-33` | T4 ngữ cảnh | ngăn trượt | Ngăn chi tiết lớp | Huấn luyện viên, Quản lý | UC-05, YC-06, M-04, BR-DD-01, BR-DD-03, BR-DD-04, A-05, A-10, D3:111 |
| Sửa điểm danh `F-34` | T4 ngữ cảnh | ngăn trượt | Ngăn chi tiết lớp | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04, M-04, D7:114-115 |

### Đổi lịch và học bù · `doi-lich` · `admin/doi-lich.html`

Vai: Lễ tân, Quản lý · module Đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch `F-31` | T1 chính | ngăn trượt | Yêu cầu từ phụ huynh | Lễ tân, Quản lý | XD-02, UC-08, M-03 |
| Đổi một buổi học `F-26` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02 |
| Xếp buổi học bù `F-28` *suy* | T2 phụ | ngăn trượt | Buổi cần học bù | Lễ tân | D7:99-105, D7:112, BR-DD-03 |

### Gói và thu tiền · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền · tab: Gói học · Hoàn tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-38` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-02, YC-10, M-05, BR-TT-01, BR-TT-02, BR-TT-03, BR-LH-06, A-05, A-09 |
| Xem danh sách gói học theo trạng thái `F-41` | T2 phụ | tại chỗ | tab Gói học | Quản lý, Lễ tân | D3:331, UC-09, BR-TT-04 |
| Xác nhận chuyển khoản đã về `F-39` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân, Quản lý | UC-02, M-05, D3:176 |
| Lập đề nghị hoàn tiền `F-48` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân | BR-TT-08 |
| Duyệt đề nghị hoàn tiền `F-49` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Quản lý | BR-TT-08, BR-QT-04 |
| Ghi ngày đã chi hoàn tiền `F-50` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Lễ tân | BR-TT-08 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-51` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, YC-12, M-09, BR-TB-01, BR-TB-03 |
| Gửi SMS cho phụ huynh chưa cài app `F-56` **hoãn** | T3 hiếm | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | CO-02 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo · tab: Chuyên cần · Thu trong ngày · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-57` | T2 phụ | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, YC-13, S-01 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, YC-13, S-01, BR-QT-03 |
| Đối chiếu tiền thu trong ngày `F-60` *suy* | T2 phụ | tại chỗ | tab Thu trong ngày | Lễ tân, Quản lý | M-05, D6:24 |
| Xuất báo cáo ra Excel `F-59` | T3 hiếm | tại chỗ | Thanh công cụ | Quản lý | D3:117, S-01 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm nhân viên và phân vai `F-61` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý | UC-12, YC-14, M-08, BR-QT-01, BR-QT-02 |
| Khoá tài khoản nhân viên nghỉ việc `F-62` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, M-08 |
| Mở khoá tài khoản `F-63` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05, M-08 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-64` | T2 phụ | tại chỗ | Bảng nhật ký | Quản lý | BR-QT-04, M-08, D7:247-255 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Quản trị · tab: Bảng giá · Khoá học · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tạo khoá học `F-11` | T2 phụ | ngăn trượt | tab Khoá học | Quản lý | UC-03, YC-02, M-02, BR-LH-01, BR-LH-05, XD-03 |
| Cập nhật ngày nghỉ lễ `F-22` | T2 phụ | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D7:78-81 |
| Sửa bảng giá gói học `F-44` | T2 phụ | tại chỗ | tab Bảng giá | Quản lý | D6:98-106, BR-TT-03, D7:136-143 |
| Cấu hình nhắc lịch `F-54` | T2 phụ | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, M-09, D7:224-229 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app phụ huynh `F-66` | T1 chính | tại chỗ | Form đăng nhập | Phụ huynh | NF-05, UC-06 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Lịch

- Dải **Chọn con**: Chọn con đang xem
- Dải **Buổi sắp tới**: Xem lịch học của con · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Số buổi còn lại**: Xem số buổi còn lại và hạn gói
- Dải **Yêu cầu đổi lịch**: Xem trạng thái yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Báo nghỉ một buổi `F-36` | T1 chính | sheet | Buổi sắp tới | Phụ huynh | UC-07, YC-08, M-06, BR-DD-03, BR-DD-04, XD-01, A-04 |
| Chọn con đang xem `F-06` | T2 phụ | tại chỗ | Chọn con | Phụ huynh | BR-HV-03, M-06 |
| Xem lịch học của con `F-25` | T2 phụ | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, YC-11, M-06 |
| Xem trạng thái yêu cầu đổi lịch `F-30` | T2 phụ | tại chỗ | Yêu cầu đổi lịch | Phụ huynh | XD-02, M-06 |
| Xem số buổi còn lại và hạn gói `F-45` | T2 phụ | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06, YC-11, M-06, BR-TT-01 |
| Gửi yêu cầu đổi lịch `F-29` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, M-06 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn gói `F-45` | T2 phụ | tại chỗ | Gói đang dùng | Phụ huynh | UC-06, YC-11, M-06, BR-TT-01 |
| Xem lịch sử đóng tiền `F-46` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11, M-06, D3:180 |
| Xem nhận xét tiến bộ của con `F-68` **hoãn** | T2 phụ | tại chỗ | Nhận xét tiến bộ | Phụ huynh | S-04 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo `F-52` | T2 phụ | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-06, M-09 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cài đặt nhận thông báo `F-55` *suy* | T2 phụ | tại chỗ | Nhận thông báo | Phụ huynh | BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới đến quầy cho con học:** Tìm học viên → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh gọi xin đổi buổi:** Tìm học viên → Xem hồ sơ học viên → Đổi một buổi học
- **Lễ tân · Đầu ca chiều ở quầy:** Xác nhận chuyển khoản đã về → Xử lý yêu cầu đổi lịch → Gọi mời gia hạn
- **Quản lý · HLV báo nghỉ buổi sáng:** Xem lịch tuần toàn trung tâm → Phân công HLV dạy thay
- **Quản lý · Cuối tháng xem số:** Xem báo cáo doanh thu → Xem báo cáo chuyên cần → Xuất báo cáo ra Excel
- **Quản lý · Mở lớp cho đợt mới:** Tạo khoá học → Mở lớp
- **Huấn luyện viên · Dạy một buổi ở bể:** Xem lịch dạy → Điểm danh buổi học → Sửa điểm danh
- **Huấn luyện viên · Buổi học thử:** Điểm danh buổi học → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Bé ốm, báo nghỉ:** Chọn con đang xem → Xem lịch học của con → Báo nghỉ một buổi
- **Phụ huynh · Xin đổi buổi học:** Xem lịch học của con → Gửi yêu cầu đổi lịch → Xem trạng thái yêu cầu đổi lịch
- **Phụ huynh · Xem gói còn bao nhiêu:** Xem số buổi còn lại và hạn gói → Xem lịch sử đóng tiền

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Mẹ bé Minh Anh đang đứng ở quầy, muốn mua tiếp 12 buổi cho bé và trả tiền mặt. | Bán gói học và thu tiền `F-38` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Một phụ huynh dẫn con 7 tuổi tới lần đầu, muốn cho bé theo học ở trung tâm. | Đăng ký học viên mới `F-03` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Bố bé Bảo Châu gọi điện: thứ Sáu này bé bận, xin cho bé học sáng thứ Bảy thay vào. | Đổi một buổi học `F-26` | 2 · ≈ 5,4 giây |
| 4 | Lễ tân | Đầu ca chiều, ba phụ huynh đã nhắn qua app xin dời giờ học tuần này và đang chờ quầy trả lời. | Xử lý yêu cầu đổi lịch `F-31` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Kế toán báo khoản 1.680.000 ₫ của phụ huynh bé Gia Huy đã vào tài khoản sáng nay. | Xác nhận chuyển khoản đã về `F-39` | 1 · ≈ 2,7 giây |
| 6 | Lễ tân | Bơm lọc bể lớn hỏng lúc 15:00; các lớp từ 16:00 tới 19:00 chiều nay không học được. | Huỷ buổi do trung tâm `F-23` | 2 · ≈ 5,4 giây |
| 7 | Huấn luyện viên | 17:30, lớp của bạn ở làn 3 bắt đầu: chín bé tới, bé Khoa không tới. | Điểm danh buổi học `F-33` | 1 · ≈ 2,7 giây |
| 8 | Quản lý | 7 giờ sáng, HLV Tuấn nhắn bị ốm; hôm nay anh có ba lớp buổi chiều. | Phân công HLV dạy thay `F-24` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Bé Na sốt từ sáng, chiều nay không đi bơi được. | Báo nghỉ một buổi `F-36` | 1 · ≈ 2,7 giây |
| 10 | Phụ huynh | Tối nay bạn muốn biết gói của con còn học được tới bao giờ. | Xem số buổi còn lại và hạn gói `F-45` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Quản trị `quan-tri` | — | 6 | 0 |  |
| Học viên `hoc-vien` | — | 6 | 0 |  |
| Lớp học `lop` | hoc-vien, quan-tri | 8 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 10 | 1 |  |
| Lịch `lich` | lop | 7 | 0 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 5 | 0 |  |
| Đổi lịch `doi-lich` | lich, diem-danh | 7 | 0 |  |
| Học thử `hoc-thu` | hoc-vien, lop, lich | 4 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lop, lich | 6 | 1 |  |
| Hoàn tiền `hoan-tien` | goi-hoc, lich | 3 | 0 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 4 | 0 |  |
| Tiến bộ `tien-bo` | lop | 2 | 2 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-47` · Hồ sơ học viên
- Gửi SMS cho phụ huynh chưa cài app `F-56` · Thông báo
- Ghi nhận xét tiến bộ cuối cấp độ `F-67` · Chi tiết lớp
- Xem nhận xét tiến bộ của con `F-68` · Gói học

## Chức năng suy ra, người dùng xác nhận ở cổng (6)

- Theo dõi bé học thử chưa mua gói `F-09`: Danh sách bé đã học thử mà chưa mua gói, cấp độ gợi ý, ngày hết hạn giữ hồ sơ 60 ngày; lễ tân gọi mời mua gói.
- Đề xuất cho học viên lên cấp độ `F-18`: HLV đánh dấu bé đủ sức lên cấp cao hơn; lễ tân thấy đề xuất và chuyển lớp, giữ nguyên số buổi còn lại.
- Xếp buổi học bù `F-28`: Bé vắng có phép được xếp một buổi bù ở lớp cùng cấp độ; học xong buổi bù thì buổi vắng thành đã học bù.
- Ghi báo nghỉ thay phụ huynh `F-37`: Phụ huynh gọi điện hay đến quầy báo nghỉ (khoảng 15 % chưa dùng app): lễ tân ghi báo nghỉ cho buổi, cùng luật 2 giờ và 3 lần mỗi gói.
- Cài đặt nhận thông báo `F-55`: Phụ huynh tắt các loại thông báo thường; thông báo khẩn không tắt được.
- Đối chiếu tiền thu trong ngày `F-60`: Cuối ca: các khoản thu tiền mặt và chuyển khoản trong ngày theo người thu, để đối chiếu với tiền trong két.

## Hệ thống tự làm

- Xoá hồ sơ học thử quá 60 ngày `F-10`: Hệ thống tự xoá hồ sơ học thử không mua gói sau 60 ngày.
- Sinh buổi học tự động `F-21`: Sinh buổi theo khung giờ lớp từ ngày khai giảng tới hết đợt; ngày nghỉ lễ không sinh buổi, buổi rơi vào ngày lễ dời sang tuần sau.
- Báo quản lý yêu cầu đổi lịch quá 24 giờ `F-32`: Yêu cầu quá 24 giờ chưa xử lý thì hệ thống báo quản lý.
- Chốt điểm danh cuối ngày `F-35`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép và trừ buổi.
- Khoá gói hết buổi hay hết hạn `F-42`: Hệ thống chuyển gói sang hết buổi hay hết hạn; bé không vào lớp được tới khi mua gói mới.
- Nhắc lịch tự động `F-53`: Gửi nhắc lịch cho phụ huynh trước giờ học 2 tiếng theo mẫu, khi quản lý bật.
