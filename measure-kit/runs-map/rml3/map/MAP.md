# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-18, hlv, ≈ 11,1 giây), việc hằng ngày xa nhất 4 bước (F-33, le-tan, ≈ 13,8 giây) · (5) màn dày nhất ho-so 6 chức năng, 3 tab · (4) nhóm menu dài nhất 5 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Hôm nay | Hôm nay · *Học viên và lớp:* Học viên · Lớp · Lịch trung tâm · Đổi lịch · *Tiền:* Gói học · Hoàn tiền · *Trung tâm:* Thông báo · Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan | Tổng quan · *Học viên và lớp:* Học viên · Lớp · Lịch trung tâm · Điểm danh · *Tiền:* Gói học · Hoàn tiền · Báo cáo · *Trung tâm:* Thông báo · Khoá học và mở lớp · Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lịch dạy · Lớp · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Trang chủ | Trang chủ · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Nhân viên và cài đặt · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-56` | T1 chính | trang | Đăng nhập | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05 |
| Đổi mật khẩu tạm `F-57` *suy* | T2 phụ | hộp thoại | Đổi mật khẩu lần đầu | Quản lý, Lễ tân, Huấn luyện viên | UC-12 |

### Hôm nay · `hom-nay-lt` · `admin/hom-nay-lt.html`

Vai: Lễ tân · module Học viên

- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch của phụ huynh · Xem danh sách cần gọi mời gia hạn
- Dải **Việc nhanh**: Bán gói học và thu tiền · Tìm học viên · Đăng ký học viên mới · Xếp học viên vào lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-30` | T1 chính | ngăn trượt | Việc nhanh | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-09, M-05, YC-10 |
| Đăng ký học viên mới `F-01` | T2 phụ | ngăn trượt | Việc nhanh | Lễ tân | UC-01, BR-HV-01, BR-HV-02, BR-HV-04, M-01, YC-01 |
| Tìm học viên `F-02` | T2 phụ | tại chỗ | Việc nhanh | Quản lý, Lễ tân, Huấn luyện viên | D4:150-151, M-01, YC-01 |
| Xếp học viên vào lớp `F-13` | T2 phụ | ngăn trượt | Việc nhanh | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Xử lý yêu cầu đổi lịch của phụ huynh `F-23` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân | XD-02, M-06 |
| Xem danh sách cần gọi mời gia hạn `F-36` | T2 phụ | ngăn trượt | Cần xử lý hôm nay | Lễ tân | BR-TT-06, S-02 |

### Tổng quan · `hom-nay-ql` · `admin/hom-nay-ql.html`

Vai: Quản lý · module Báo cáo

- Dải **Số liệu tháng**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần
- Dải **Cần xử lý hôm nay**: Duyệt hoặc từ chối hoàn tiền
- Dải **Việc nhanh**: Gửi thông báo cho phụ huynh · Huỷ các buổi khi bể có sự cố

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo doanh thu `F-64` | T1 chính | tại chỗ | Số liệu tháng | Quản lý | UC-11, BR-QT-03, D4:116, S-01 |
| Duyệt hoặc từ chối hoàn tiền `F-39` | T2 phụ | hộp thoại | Cần xử lý hôm nay | Quản lý | BR-TT-08, BR-QT-04 |
| Gửi thông báo cho phụ huynh `F-43` | T2 phụ | ngăn trượt | Việc nhanh | Quản lý, Lễ tân | UC-10, BR-TB-01, BR-TB-03, BR-TB-04, M-09, YC-12 |
| Xem báo cáo chuyên cần `F-63` | T2 phụ | tại chỗ | Số liệu tháng | Quản lý, Lễ tân | UC-11, S-01, D4:115, YC-13 |

Lối tắt: Huỷ các buổi khi bể có sự cố *(ngăn trượt)*

### Buổi dạy hôm nay · `hom-nay-hlv` · `admin/hom-nay-hlv.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi hôm nay**: Điểm danh buổi học
- Dải **Việc nhanh**: Tìm học viên · Sửa điểm danh sau khi lưu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-02` | T2 phụ | tại chỗ | Việc nhanh | Quản lý, Lễ tân, Huấn luyện viên | D4:150-151, M-01, YC-01 |

Lối tắt: Điểm danh buổi học *(ngăn trượt)* · Sửa điểm danh sau khi lưu *(ngăn trượt)*

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-02` | T1 chính | tại chỗ | Tìm và lọc | Quản lý, Lễ tân, Huấn luyện viên | D4:150-151, M-01, YC-01 |
| Đăng ký học viên mới `F-01` | T2 phụ | ngăn trượt | Công cụ | Lễ tân | UC-01, BR-HV-01, BR-HV-02, BR-HV-04, M-01, YC-01 |
| Đặt buổi học thử `F-07` | T2 phụ | ngăn trượt | Công cụ | Lễ tân | BR-LH-06, S-03, YC-05 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Thông tin · Gói học · Thanh toán

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-03` | T1 chính | trang | Đầu hồ sơ | Quản lý, Lễ tân, Huấn luyện viên | D4:105, UC-01, BR-QT-02, OQ-03 |
| Sửa hồ sơ học viên và phụ huynh `F-04` | T2 phụ | ngăn trượt | Đầu hồ sơ | Quản lý, Lễ tân | D4:106, BR-HV-02 |
| Xem lại các lần đóng tiền và biên lai `F-32` | T2 phụ | tại chỗ | tab Thanh toán | Lễ tân, Quản lý | UC-02, D4:180 |
| Xem gói học của học viên `F-33` | T2 phụ | tại chỗ | tab Gói học | Lễ tân, Quản lý, Huấn luyện viên | BR-TT-01, BR-TT-04 |
| Cho học viên ngừng học `F-05` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05 |
| Ghi chú vào hồ sơ học viên và báo quản lý `F-06` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân | A-08, OQ-01 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Bảo lưu gói học *(hộp thoại)* · Đổi một buổi sang lớp khác *(ngăn trượt)* · Chuyển học viên sang lớp cố định khác *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lớp và chỗ còn trống `F-12` | T1 chính | tại chỗ | Bảng lớp | Quản lý, Lễ tân | UC-04, YC-03, M-02 |
| Xếp học viên vào lớp `F-13` | T2 phụ | ngăn trượt | Bảng lớp | Lễ tân, Quản lý | UC-04, BR-LH-03, A-01, A-06, M-02 |
| Đưa học viên vào danh sách chờ `F-15` | T2 phụ | hộp thoại | Bảng lớp | Lễ tân | BR-LH-04, UC-04 |
| Cho xếp xuống một bậc cấp độ `F-14` | T3 hiếm | hộp thoại | Bảng lớp | Quản lý | BR-LH-03 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Khoá học và lớp · vào từ Lớp (tìm và chọn một bản ghi) · tab: Học viên · Danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem học viên của lớp `F-18` | T1 chính | tại chỗ | tab Học viên | Huấn luyện viên, Lễ tân, Quản lý | BR-QT-02, D4:105 |
| Xem danh sách chờ và gọi phụ huynh `F-16` | T2 phụ | tại chỗ | tab Danh sách chờ | Lễ tân | BR-LH-04 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-09` **hoãn** | T3 hiếm | hộp thoại | Đầu lớp | Huấn luyện viên | S-04 |
| Cho học viên rời khỏi lớp `F-17` | T3 hiếm | hộp thoại | tab Học viên | Lễ tân, Quản lý | BR-QT-04 |

### Lịch trung tâm · `lich` · `admin/lich.html`

Vai: Lễ tân, Quản lý · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm theo ngày và tuần `F-19` | T1 chính | tại chỗ | Lưới lịch | Quản lý, Lễ tân | YC-04, D4:109, M-03 |
| Xem lịch dạy `F-20` | T2 phụ | tại chỗ | Lưới lịch | Huấn luyện viên, Quản lý, Lễ tân | D4:110, UC-05 |
| Xếp học bù cho buổi vắng có phép `F-24` *suy* | T2 phụ | ngăn trượt | Lưới lịch | Lễ tân | D8:104, D8:112 |
| Huỷ các buổi khi bể có sự cố `F-26` | T3 hiếm | ngăn trượt | Lưới lịch | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03 |
| Cử HLV dạy thay `F-27` | T3 hiếm | hộp thoại | Lưới lịch | Quản lý | A-02 |

### Lịch dạy · `lich-day` · `admin/lich-day.html`

Vai: Huấn luyện viên · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch dạy `F-20` | T1 chính | tại chỗ | Lịch dạy | Huấn luyện viên, Quản lý, Lễ tân | D4:110, UC-05 |
| Ghi cấp độ gợi ý sau buổi học thử `F-08` | T2 phụ | ngăn trượt | Buổi học thử | Huấn luyện viên | BR-LH-06 |

### Đổi lịch · `doi-lich` · `admin/doi-lich.html`

Vai: Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch của phụ huynh `F-23` | T1 chính | ngăn trượt | Yêu cầu chờ xử lý | Lễ tân | XD-02, M-06 |
| Đổi một buổi sang lớp khác `F-21` | T2 phụ | ngăn trượt | Đổi lịch | Lễ tân | UC-08, BR-LI-02, M-03, A-07, OQ-02 |
| Chuyển học viên sang lớp cố định khác `F-22` | T2 phụ | ngăn trượt | Đổi lịch | Lễ tân | UC-08, BR-LI-02, A-07, OQ-02 |

### Điểm danh · `diem-danh` · `admin/diem-danh.html`

Vai: Quản lý, Huấn luyện viên · module Điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-28` | T1 chính | ngăn trượt | Danh sách buổi | Huấn luyện viên, Quản lý | UC-05, BR-DD-01, BR-DD-03, BR-DD-02, A-05, A-10, M-04, YC-06 |
| Sửa điểm danh sau khi lưu `F-29` | T2 phụ | ngăn trượt | Danh sách buổi | Huấn luyện viên, Quản lý | BR-DD-05, BR-QT-04, D4:254 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền · tab: Gói đang dùng · Cần gọi gia hạn

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-30` | T1 chính | ngăn trượt | tab Gói đang dùng | Lễ tân, Quản lý | UC-02, BR-TT-01, BR-TT-02, BR-TT-03, A-09, M-05, YC-10 |
| Xác nhận chuyển khoản đã về `F-31` | T2 phụ | tại chỗ | tab Gói đang dùng | Lễ tân | UC-02 |
| Bảo lưu gói học `F-34` | T2 phụ | hộp thoại | tab Gói đang dùng | Lễ tân, Quản lý | UC-09, BR-TT-05, M-07, YC-09 |
| Xem danh sách cần gọi mời gia hạn `F-36` | T2 phụ | tại chỗ | tab Cần gọi gia hạn | Lễ tân | BR-TT-06, S-02 |
| Ghi kết quả cuộc gọi mời gia hạn `F-37` | T2 phụ | hộp thoại | tab Cần gọi gia hạn | Lễ tân | BR-TT-06, D8:182-187 |
| Áp mã khuyến mãi khi bán gói `F-42` **hoãn** | T3 hiếm | hộp thoại | tab Gói đang dùng | Lễ tân | CO-01 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Lập đề nghị hoàn tiền `F-38` | T1 chính | ngăn trượt | Đề nghị hoàn tiền | Lễ tân | BR-TT-08, D8:196-205 |
| Duyệt hoặc từ chối hoàn tiền `F-39` | T2 phụ | hộp thoại | Đề nghị hoàn tiền | Quản lý | BR-TT-08, BR-QT-04 |
| Ghi ngày đã chi hoàn tiền `F-40` | T2 phụ | hộp thoại | Đề nghị hoàn tiền | Lễ tân | BR-TT-08 |

### Thông báo · `gui-thong-bao` · `admin/gui-thong-bao.html`

Vai: Lễ tân, Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-43` | T1 chính | ngăn trượt | Soạn thông báo | Quản lý, Lễ tân | UC-10, BR-TB-01, BR-TB-03, BR-TB-04, M-09, YC-12 |
| Gửi SMS cho phụ huynh chưa cài app `F-45` **hoãn** | T3 hiếm | hộp thoại | Soạn thông báo | Quản lý, Lễ tân | CO-02, BR-TB-01 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Lễ tân, Quản lý · module Báo cáo · tab: Chuyên cần · Doanh thu · Gói đang bảo lưu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-63` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, D4:115, YC-13 |
| Xem báo cáo doanh thu `F-64` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, BR-QT-03, D4:116, S-01 |
| Xem các gói đang bảo lưu `F-35` | T3 hiếm | tại chỗ | tab Gói đang bảo lưu | Quản lý | UC-09 |
| Xuất báo cáo ra Excel `F-65` | T3 hiếm | hộp thoại | tab Doanh thu | Quản lý | D4:117 |

### Khoá học và mở lớp · `khoa-hoc-lop` · `admin/khoa-hoc-lop.html`

Vai: Quản lý · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Mở lớp `F-11` | T1 chính | ngăn trượt | Lớp | Quản lý | UC-03, BR-LH-02, BR-LI-01, M-02 |
| Tạo khoá học `F-10` | T2 phụ | ngăn trượt | Khoá học | Quản lý | UC-03, BR-LH-01, BR-LH-05, XD-03, YC-02 |

### Nhân viên · `tai-khoan` · `admin/tai-khoan.html`

Vai: Quản lý · module Nhân viên và cài đặt

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm và sửa tài khoản nhân viên `F-58` | T1 chính | ngăn trượt | Nhân viên | Quản lý | UC-12, BR-QT-01, M-08, YC-14 |
| Gán lớp cho HLV `F-59` | T2 phụ | ngăn trượt | Nhân viên | Quản lý | UC-12, BR-QT-02 |
| Khoá tài khoản nhân viên nghỉ việc `F-60` | T3 hiếm | hộp thoại | Nhân viên | Quản lý | UC-12 |
| Mở khoá tài khoản bị khoá `F-61` | T3 hiếm | hộp thoại | Nhân viên | Quản lý | UC-12, BR-QT-05 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Nhân viên và cài đặt

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra cứu nhật ký thao tác `F-62` | T1 chính | tại chỗ | Nhật ký | Quản lý | BR-QT-04, M-08 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Nhân viên và cài đặt · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Khai báo ngày nghỉ lễ `F-25` | T3 hiếm | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D8:78-81 |
| Sửa bảng giá gói `F-41` | T3 hiếm | tại chỗ | tab Bảng giá | Quản lý | D7:98-106, BR-TT-03 |
| Cấu hình nhắc lịch tự động `F-44` | T3 hiếm | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, D8:224-229 |

## App phụ huynh

### Đăng nhập · `ph-dang-nhap` · `app/ph-dang-nhap.html`

Vai: Phụ huynh · module App phụ huynh · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại `F-46` | T1 chính | trang | Đăng nhập | Phụ huynh | NF-05, UC-06 |

### Trang chủ · `ph-trang-chu` · `app/ph-trang-chu.html`

Vai: Phụ huynh · module App phụ huynh

- Dải **Con đang xem**: Chọn con đang xem
- Dải **Buổi sắp tới**: Xem buổi học sắp tới của con · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Yêu cầu của bạn**: Xem trạng thái yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem buổi học sắp tới của con `F-48` | T1 chính | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, M-06, YC-11 |
| Chọn con đang xem `F-47` | T2 phụ | sheet | Con đang xem | Phụ huynh | BR-HV-03 |
| Báo nghỉ một buổi `F-51` | T2 phụ | sheet | Buổi sắp tới | Phụ huynh | UC-07, XD-01, BR-DD-04, A-04, M-06, YC-08 |
| Gửi yêu cầu đổi lịch `F-52` | T2 phụ | sheet | Buổi sắp tới | Phụ huynh | XD-02, M-06 |
| Xem trạng thái yêu cầu đổi lịch `F-53` | T2 phụ | tại chỗ | Yêu cầu của bạn | Phụ huynh | XD-02 |

### Gói học · `ph-goi` · `app/ph-goi.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn gói của con `F-49` | T1 chính | tại chỗ | Số buổi còn lại | Phụ huynh | UC-06 |
| Xem lịch sử đóng tiền `F-50` | T2 phụ | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, YC-11 |

### Thông báo · `ph-thong-bao` · `app/ph-thong-bao.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo của trung tâm `F-54` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-09 |

### Tài khoản · `ph-tai-khoan` · `app/ph-tai-khoan.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem đánh giá tiến bộ của con `F-55` **hoãn** | T3 hiếm | tại chỗ | Tiến bộ của con | Phụ huynh | S-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới đến học thử rồi đăng ký:** Đặt buổi học thử → Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh xin đổi lịch trên app:** Xử lý yêu cầu đổi lịch của phụ huynh → Đổi một buổi sang lớp khác
- **Lễ tân · Gọi mời gia hạn:** Xem danh sách cần gọi mời gia hạn → Ghi kết quả cuộc gọi mời gia hạn → Bán gói học và thu tiền
- **Quản lý · Bể sự cố đột xuất:** Huỷ các buổi khi bể có sự cố → Gửi thông báo cho phụ huynh
- **Quản lý · Có HLV mới:** Thêm và sửa tài khoản nhân viên → Gán lớp cho HLV
- **Huấn luyện viên · Một buổi dạy:** Xem lịch dạy → Điểm danh buổi học → Sửa điểm danh sau khi lưu
- **Phụ huynh · Con ốm, báo nghỉ:** Đăng nhập app bằng số điện thoại → Chọn con đang xem → Xem buổi học sắp tới của con → Báo nghỉ một buổi

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh dắt con đến lần đầu, muốn cho bé học bơi. | Đăng ký học viên mới `F-01` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Một phụ huynh đến quầy đóng tiền cho con học tiếp. | Bán gói học và thu tiền `F-30` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Phụ huynh nhắn rằng chiều thứ Tư bé bận, xin học vào hôm khác. | Đổi một buổi sang lớp khác `F-21` | 2 · ≈ 5,4 giây |
| 4 | Lễ tân | Đầu ca sáng, xem phụ huynh nào đã nhờ đổi buổi qua app để trả lời. | Xử lý yêu cầu đổi lịch của phụ huynh `F-23` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Có bé chỉ còn một buổi, cần nhắc phụ huynh học tiếp. | Xem danh sách cần gọi mời gia hạn `F-36` | 1 · ≈ 2,7 giây |
| 6 | Lễ tân | Lớp Cơ bản tối thứ Ba đã đầy mà vẫn có một bé muốn vào. | Đưa học viên vào danh sách chờ `F-15` | 2 · ≈ 5,4 giây |
| 7 | Quản lý | Cuối tháng, chủ trung tâm muốn biết tháng này thu được bao nhiêu. | Xem báo cáo doanh thu `F-64` | 1 · ≈ 2,7 giây |
| 8 | Quản lý | Sáng thứ Hai, muốn nhìn cả tuần xem làn nào còn trống. | Xem lịch toàn trung tâm theo ngày và tuần `F-19` | 2 · ≈ 5,4 giây |
| 9 | Huấn luyện viên | Đến giờ dạy 17:30, tay ướt, cần ghi bé nào đến, bé nào nghỉ. | Điểm danh buổi học `F-28` | 1 · ≈ 2,7 giây |
| 10 | Phụ huynh | Sáng nay bé sốt, chiều có buổi bơi. | Báo nghỉ một buổi `F-51` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 9 | 1 |  |
| Nhân viên và cài đặt `quan-tri` | — | 7 | 0 |  |
| Khoá học và lớp `lop-hoc` | hoc-vien | 9 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 13 | 1 |  |
| Lịch và buổi học `lich-buoi` | lop-hoc | 9 | 0 |  |
| Điểm danh `diem-danh` | lich-buoi, goi-hoc | 2 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lich-buoi | 3 | 1 |  |
| App phụ huynh `app-phu-huynh` | lich-buoi, goi-hoc, thong-bao | 10 | 1 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Ghi nhận xét kỹ năng cuối cấp độ `F-09` · Chi tiết lớp
- Áp mã khuyến mãi khi bán gói `F-42` · Gói học
- Gửi SMS cho phụ huynh chưa cài app `F-45` · Thông báo
- Xem đánh giá tiến bộ của con `F-55` · Tài khoản

## Chức năng suy ra, người dùng xác nhận ở cổng (2)

- Xếp học bù cho buổi vắng có phép `F-24`: Buổi vắng có phép được xếp học một buổi bù ở lớp cùng cấp độ; trạng thái chuyển từ vắng có phép sang đã học bù.
- Đổi mật khẩu tạm `F-57`: Nhân viên mới nhận mật khẩu tạm qua SMS nên cần đổi sang mật khẩu riêng.
