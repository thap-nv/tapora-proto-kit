# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 2 bước (F-27, hlv, ≈ 8,4 giây), việc hằng ngày xa nhất 3 bước (F-03, le-tan, ≈ 11,1 giây) · (5) màn dày nhất goi-hoc 6 chức năng, 3 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hôm nay:* Tổng quan · Quầy hôm nay · Lịch tuần · *Học viên và lớp:* Học viên · Lớp · Gói học · *Liên lạc và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hôm nay:* Quầy hôm nay · Lịch tuần · *Học viên và lớp:* Học viên · Lớp · Gói học · Học thử · *Liên lạc và báo cáo:* Thông báo · Báo cáo | sidebar phẳng |
| HLV `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lớp · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, HLV · module Tài khoản và quyền · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-60` | T1 chính | tại chỗ | Đăng nhập | Quản lý, Lễ tân, HLV | BR-QT-01, BR-QT-05 |

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo

- Dải **Cần quản lý xử lý**: Xem cảnh báo cần quản lý biết · Duyệt đề nghị hoàn tiền
- Dải **Lịch hôm nay**: Phân công HLV dạy thay
- Dải **Tháng này**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem cảnh báo cần quản lý biết `F-53` | T1 chính | tại chỗ | Cần quản lý xử lý | Quản lý | XD-02, XD-04, D5:24, D5:35 |
| Duyệt đề nghị hoàn tiền `F-39` | T2 phụ | hộp thoại | Cần quản lý xử lý | Quản lý | BR-TT-08, BR-QT-04, D7:189-194 |
| Xem báo cáo chuyên cần `F-57` | T2 phụ | tại chỗ | Tháng này | Quản lý, Lễ tân | UC-11, S-01, YC-13, D3:115 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | Tháng này | Quản lý | UC-11, S-01, BR-QT-03, D3:116 |

Lối tắt: Phân công HLV dạy thay *(ngăn trượt)*

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân, Quản lý · module Lịch và buổi học

- Dải **Tìm học viên**: Tìm học viên
- Dải **Việc nhanh**: Đăng ký học viên mới · Bán gói học và thu tiền · Dời một buổi học sang lớp khác · Ghi báo nghỉ thay phụ huynh
- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch · Xác nhận chuyển khoản đã về · Xử lý danh sách chờ khi lớp có chỗ · Gọi mời gia hạn
- Dải **Cuối ca**: Đối chiếu tiền thu cuối ngày

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm học viên | Lễ tân, Quản lý, HLV | YC-01, M-01, D3:150-151 |
| Xử lý danh sách chờ khi lớp có chỗ `F-12` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân | BR-LH-04, D1:49 |
| Xử lý yêu cầu đổi lịch `F-20` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân, Quản lý | XD-02, M-03, M-06, D7:118-132 |
| Xác nhận chuyển khoản đã về `F-34` | T2 phụ | tại chỗ | Cần xử lý hôm nay | Lễ tân, Quản lý | UC-02, D3:176 |
| Gọi mời gia hạn `F-37` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân | BR-TT-06, S-02, D7:182-187 |
| Đối chiếu tiền thu cuối ngày `F-42` *suy* | T2 phụ | ngăn trượt | Cuối ca | Lễ tân | M-05, D6:24, BR-QT-03 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Dời một buổi học sang lớp khác *(ngăn trượt)* · Ghi báo nghỉ thay phụ huynh *(hộp thoại)*

### Lịch tuần · `lich` · `admin/lich.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần của trung tâm `F-16` | T1 chính | tại chỗ | Lưới làn × giờ | Quản lý, Lễ tân | YC-04, D3:109, D7:83-97 |
| Huỷ buổi vì sự cố `F-22` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03, YC-14 |
| Phân công HLV dạy thay `F-23` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | A-02, D7:94 |
| Xếp buổi học bù `F-19` | T4 ngữ cảnh | ngăn trượt | Ngăn lớp | Lễ tân | D7:104, D7:112 |
| Sửa điểm danh `F-28` | T4 ngữ cảnh | ngăn trượt | Ngăn lớp | HLV, Quản lý | BR-DD-05, BR-QT-04, D7:115 |
| Ghi báo nghỉ thay phụ huynh `F-31` *suy* | T4 ngữ cảnh | hộp thoại | Ngăn lớp | Lễ tân | XD-01, CO-02, D6:26 |

Lối tắt: Xếp học viên vào lớp *(ngăn trượt)* · Điểm danh buổi học *(trang; về: Lưu điểm danh xong thì về Lịch tuần đúng ô buổi vừa mở, báo đã lưu; nút Quay lại giữ tuần và ô đang chọn)*

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, HLV · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-01` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, HLV | YC-01, M-01, D3:150-151 |
| Đăng ký học viên mới `F-02` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý | UC-01, M-01, BR-HV-01, BR-HV-02, BR-HV-04, D7:11-17 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, HLV · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Lịch học · Gói và đóng tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-33` | T1 chính | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | UC-02, M-05, YC-10, BR-TT-01, BR-TT-02, BR-TT-03, BR-TT-04, A-05, A-09, D7:153-163 |
| Xem hồ sơ học viên `F-03` | T2 phụ | tại chỗ | Đầu hồ sơ | Lễ tân, Quản lý, HLV | UC-01, D3:105, D3:150, D7:25-34 |
| Sửa hồ sơ học viên `F-04` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D3:106, A-08 |
| Cho học viên ngừng học `F-05` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05, D7:19-23 |
| Dời một buổi học sang lớp khác `F-18` | T4 ngữ cảnh | ngăn trượt | tab Lịch học | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02 |
| Bảo lưu gói học `F-36` | T4 ngữ cảnh | hộp thoại | tab Gói và đóng tiền | Lễ tân, Quản lý | UC-09, M-07, YC-09, BR-TT-05, BR-QT-04, D7:165-170 |

Lối tắt: Xếp học viên vào lớp *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, HLV · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách lớp và chỗ trống `F-09` | T1 chính | tại chỗ | Bảng lớp | Lễ tân, Quản lý, HLV | YC-03, UC-04, BR-QT-02, OQ-03, D3:217-218 |
| Mở lớp `F-08` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-03, YC-02, BR-LH-02, BR-LI-01, D7:51-59 |
| Xếp học viên vào lớp `F-10` | T4 ngữ cảnh | ngăn trượt | Bảng lớp | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, BR-HV-04, A-01, A-06, D7:67-74 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Lễ tân, Quản lý, HLV · module Khoá học và lớp · vào từ Lớp (tìm và chọn một bản ghi) · tab: Học viên · Danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-10` | T1 chính | ngăn trượt | Đầu lớp | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, BR-HV-04, A-01, A-06, D7:67-74 |
| Đưa học viên vào danh sách chờ `F-11` | T2 phụ | hộp thoại | tab Danh sách chờ | Lễ tân, Quản lý | BR-LH-04, M-02, D7:61-65 |
| Xử lý danh sách chờ khi lớp có chỗ `F-12` | T4 ngữ cảnh | ngăn trượt | tab Danh sách chờ | Lễ tân | BR-LH-04, D1:49 |
| Xoá học viên khỏi lớp `F-13` | T4 ngữ cảnh | hộp thoại | tab Học viên | Lễ tân, Quản lý | BR-QT-04, D1:101 |
| Chuyển học viên sang lớp khác `F-14` | T4 ngữ cảnh | ngăn trượt | tab Học viên | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02, A-07, OQ-02 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền · tab: Gói học · Hoàn tiền · Khuyến mãi

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Lọc gói học theo trạng thái `F-35` | T1 chính | tại chỗ | Lọc theo trạng thái | Quản lý, Lễ tân | UC-09, D3:331, D7:145-151 |
| Áp mã khuyến mãi khi bán gói `F-45` **hoãn** | T2 phụ | tại chỗ | tab Khuyến mãi | Lễ tân | CO-01 |
| Xác nhận chuyển khoản đã về `F-34` | T4 ngữ cảnh | tại chỗ | tab Gói học | Lễ tân, Quản lý | UC-02, D3:176 |
| Lập đề nghị hoàn tiền `F-38` | T4 ngữ cảnh | hộp thoại | tab Gói học | Lễ tân | BR-TT-08, A-08, OQ-01, D7:196-205 |
| Duyệt đề nghị hoàn tiền `F-39` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Quản lý | BR-TT-08, BR-QT-04, D7:189-194 |
| Ghi ngày đã chi hoàn tiền `F-40` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Lễ tân | BR-TT-08, D1:83 |

Lối tắt: Bảo lưu gói học *(hộp thoại)* · Gọi mời gia hạn *(ngăn trượt)*

### Học thử · `hoc-thu` · `admin/hoc-thu.html`

Vai: Lễ tân · module Học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Theo dõi khách học thử chưa mua gói `F-48` *suy* | T1 chính | tại chỗ | Bảng khách học thử | Lễ tân | BR-LH-06, S-03 |
| Đặt buổi học thử `F-46` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-LH-06, S-03, YC-05 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-49` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, M-09, YC-12, BR-TB-01, BR-TB-03, D7:209-222 |
| Theo dõi thông báo đã gửi `F-50` *suy* | T2 phụ | tại chỗ | Thông báo đã gửi | Quản lý, Lễ tân | D7:214, D7:221 |
| Gửi SMS cho phụ huynh chưa cài app `F-56` **hoãn** | T3 hiếm | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | CO-02 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-57` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, YC-13, D3:115 |
| Xem báo cáo doanh thu `F-58` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, S-01, BR-QT-03, D3:116 |
| Xuất báo cáo ra Excel `F-59` | T2 phụ | hộp thoại | Thanh công cụ | Quản lý | D3:117 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Tài khoản và quyền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm tài khoản nhân viên `F-62` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-12, M-08, YC-14, BR-QT-01, BR-QT-02, D7:233-245 |
| Khoá hoặc mở khoá tài khoản nhân viên `F-63` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05, D3:411-412 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Tài khoản và quyền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-64` | T1 chính | tại chỗ | Bảng nhật ký | Quản lý | BR-QT-04, M-08, D7:247-255 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Tài khoản và quyền · tab: Khoá học · Bảng giá · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tạo khoá học `F-07` | T2 phụ | ngăn trượt | tab Khoá học | Quản lý | UC-03, M-02, BR-LH-01, BR-LH-05, XD-03, D7:38-49 |
| Quản lý ngày nghỉ lễ `F-24` *suy* | T2 phụ | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D7:78-81 |
| Sửa bảng giá `F-41` | T2 phụ | tại chỗ | tab Bảng giá | Quản lý | BR-TT-03, D6:98-106, D7:136-143 |
| Cài đặt tin nhắc lịch `F-51` | T2 phụ | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, M-09, D7:224-229 |

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: HLV · module Lịch và buổi học

- Dải **Buổi dạy trong ngày**: Xem lịch dạy của tôi
- Dải **Lớp của tôi**: Xem danh sách lớp và chỗ trống

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch dạy của tôi `F-17` | T1 chính | tại chỗ | Buổi dạy trong ngày | HLV | D3:110, UC-05, UC-03 |
| Xem danh sách lớp và chỗ trống `F-09` | T2 phụ | tại chỗ | Lớp của tôi | Lễ tân, Quản lý, HLV | YC-03, UC-04, BR-QT-02, OQ-03, D3:217-218 |

### Điểm danh buổi · `diem-danh` · `admin/diem-danh.html`

Vai: HLV, Quản lý · module Điểm danh · vào từ Buổi dạy hôm nay (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-27` | T1 chính | tại chỗ | Danh sách học viên | HLV, Quản lý | UC-05, M-04, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, D7:99-116 |
| Sửa điểm danh `F-28` | T2 phụ | tại chỗ | Đầu buổi | HLV, Quản lý | BR-DD-05, BR-QT-04, D7:115 |
| Đề xuất cho học viên lên cấp độ `F-15` *suy* | T4 ngữ cảnh | hộp thoại | Danh sách học viên | HLV | A-07, UC-08 |
| Ghi cấp độ gợi ý sau học thử `F-47` | T4 ngữ cảnh | hộp thoại | Danh sách học viên | HLV | BR-LH-06, D7:33, D7:113 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-65` **hoãn** | T4 ngữ cảnh | hộp thoại | Danh sách học viên | HLV | S-04 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Tài khoản và quyền · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại `F-61` | T1 chính | tại chỗ | Đăng nhập | Phụ huynh | NF-05, UC-06, D7:14 |

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Lịch và buổi học

- Dải **Con đang xem**: Chọn con đang xem
- Dải **Buổi sắp tới**: Xem các buổi học sắp tới · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Đã học**: Xem lịch sử đi học của con · Xem đánh giá tiến bộ của con

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem các buổi học sắp tới `F-26` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, M-06, YC-11 |
| Chọn con đang xem `F-06` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03 |
| Xem lịch sử đi học của con `F-32` | T2 phụ | tại chỗ | Đã học | Phụ huynh | UC-05, D3:233 |
| Xem đánh giá tiến bộ của con `F-66` **hoãn** | T2 phụ | tại chỗ | Đã học | Phụ huynh | S-04 |
| Gửi yêu cầu đổi lịch `F-21` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, M-06, D5:24 |
| Báo nghỉ một buổi `F-30` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | UC-07, M-06, YC-08, XD-01, BR-DD-04, A-04 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và số buổi còn lại `F-43` | T1 chính | tại chỗ | Gói đang dùng | Phụ huynh | UC-06, YC-11, M-06 |
| Xem lịch sử đóng tiền `F-44` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, D3:271, D7:172-180 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đọc thông báo của trung tâm `F-54` | T1 chính | tại chỗ | Hộp thông báo | Phụ huynh | UC-10, M-06, M-09, D3:356 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Tài khoản và quyền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cài đặt nhận thông báo `F-55` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới tới quầy cho con học:** Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh gọi xin dời một buổi:** Tìm học viên → Xem hồ sơ học viên → Dời một buổi học sang lớp khác
- **Lễ tân · Đầu ca xử lý việc tồn:** Xử lý yêu cầu đổi lịch → Xác nhận chuyển khoản đã về → Gọi mời gia hạn
- **Quản lý · Mở lớp đầu đợt:** Tạo khoá học → Mở lớp → Xem lịch tuần của trung tâm
- **Quản lý · HLV báo ốm buổi sáng:** Xem lịch tuần của trung tâm → Phân công HLV dạy thay
- **Quản lý · Cuối tháng xem số:** Xem báo cáo doanh thu → Xem báo cáo chuyên cần → Xuất báo cáo ra Excel
- **HLV · Dạy một buổi ở bể:** Xem lịch dạy của tôi → Điểm danh buổi học → Ghi cấp độ gợi ý sau học thử
- **Phụ huynh · Bé ốm, xin nghỉ buổi chiều:** Chọn con đang xem → Xem các buổi học sắp tới → Báo nghỉ một buổi
- **Phụ huynh · Xin đổi sang buổi khác:** Xem các buổi học sắp tới → Gửi yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một mẹ dẫn bé 5 tuổi tới quầy lần đầu, muốn cho bé học bơi ở trung tâm. | Đăng ký học viên mới `F-02` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Bố bé Bin vừa trả tiền gói 8 buổi cấp Cơ bản; giờ cần tìm cho bé một lớp chiều thứ Ba, thứ Năm còn chỗ. | Xếp học viên vào lớp `F-10` | 2 · ≈ 5,4 giây |
| 3 | Lễ tân | Mẹ bé Na gọi điện: thứ Tư này bé bận, xin cho bé học hôm thứ Năm thay. | Dời một buổi học sang lớp khác `F-18` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Sáng nay ngân hàng báo đã nhận khoản chuyển khoản hôm qua của nhà bé Minh. | Xác nhận chuyển khoản đã về `F-34` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Đầu ca chiều, có mấy phụ huynh nhờ đổi buổi qua app từ tối qua mà chưa ai trả lời. | Xử lý yêu cầu đổi lịch `F-20` | 1 · ≈ 2,7 giây |
| 6 | Lễ tân | Rảnh tay đầu giờ chiều, bạn muốn gọi cho các nhà sắp dùng hết buổi để mời mua tiếp. | Gọi mời gia hạn `F-37` | 1 · ≈ 2,7 giây |
| 7 | HLV | 17:30, lớp của bạn ở làn 3 vừa xuống nước; cần ghi lại bé nào tới, bé nào không. | Điểm danh buổi học `F-27` | 2 · ≈ 8,4 giây |
| 8 | Quản lý | Bạn muốn biết chiều thứ Bảy làn nào còn trống để mở thêm một lớp cho bé 4–6 tuổi. | Xem lịch tuần của trung tâm `F-16` | 2 · ≈ 5,4 giây |
| 9 | Phụ huynh | Bé nhà bạn sốt từ sáng, chiều nay không đi bơi được. | Báo nghỉ một buổi `F-30` | 2 · ≈ 5,4 giây |
| 10 | Phụ huynh | Bạn muốn biết bé còn mấy buổi nữa thì phải đóng tiền gói mới. | Xem gói học và số buổi còn lại `F-43` | 2 · ≈ 5,4 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 6 | 0 |  |
| Tài khoản và quyền `tai-khoan` | — | 5 | 0 |  |
| Khoá học và lớp `lop` | hoc-vien, tai-khoan | 9 | 0 |  |
| Lịch và buổi học `lich` | lop | 11 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien, lop, lich | 13 | 1 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 6 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lich | 8 | 1 |  |
| Học thử `hoc-thu` | lop, lich, diem-danh | 3 | 0 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |
| Đánh giá tiến bộ `danh-gia` | hoc-vien, lop | 2 | 2 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-45` · Gói học
- Gửi SMS cho phụ huynh chưa cài app `F-56` · Thông báo
- Ghi nhận xét kỹ năng cuối cấp độ `F-65` · Điểm danh buổi
- Xem đánh giá tiến bộ của con `F-66` · Lịch học

## Chức năng suy ra, người dùng xác nhận ở cổng (7)

- Đề xuất cho học viên lên cấp độ `F-15`: HLV đề xuất bé lên cấp độ cao hơn khi gói còn buổi; lễ tân thấy đề xuất để chuyển lớp, giữ số buổi còn lại.
- Quản lý ngày nghỉ lễ `F-24`: Danh sách ngày nghỉ lễ của trung tâm: ngày lễ không sinh buổi, buổi rơi vào ngày lễ dời sang tuần sau.
- Ghi báo nghỉ thay phụ huynh `F-31`: Phụ huynh gọi điện hay đến quầy báo nghỉ, lễ tân ghi thay trên hệ thống, cùng luật 2 giờ và 3 lần mỗi gói như trên app.
- Đối chiếu tiền thu cuối ngày `F-42`: Cuối ca, lễ tân xem các khoản thu trong ngày theo tiền mặt và chuyển khoản để đối chiếu với tiền trong két.
- Theo dõi khách học thử chưa mua gói `F-48`: Danh sách bé đã học thử chưa mua gói, kèm cấp độ gợi ý và số ngày còn lại trước khi hồ sơ học thử hết hạn giữ (60 ngày), để lễ tân gọi mời.
- Theo dõi thông báo đã gửi `F-50`: Thông báo đã gửi và đang hẹn giờ, số phụ huynh đã đọc; huỷ thông báo hẹn giờ chưa gửi.
- Cài đặt nhận thông báo `F-55`: Phụ huynh tắt hay bật thông báo thường; thông báo khẩn (huỷ buổi) không tắt được.

## Hệ thống tự làm

- Sinh buổi học theo khung giờ `F-25`: Hệ thống sinh buổi theo khung giờ của lớp từ khai giảng tới hết đợt, bỏ ngày lễ; ngừng sinh khi gói bảo lưu, sinh lại khi hết bảo lưu.
- Chốt điểm danh cuối ngày `F-29`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép và trừ buổi.
- Gửi nhắc lịch trước giờ học `F-52`: Hệ thống gửi tin nhắc cho phụ huynh trước giờ học 2 tiếng, theo mẫu và công tắc của quản lý.
