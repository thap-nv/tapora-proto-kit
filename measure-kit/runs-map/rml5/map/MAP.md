# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-03, le-tan, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-03, le-tan, ≈ 11,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 4 tab · (4) nhóm menu dài nhất 5 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Hôm nay | *Hằng ngày:* Hôm nay · Học viên · Lớp học · Lịch · Gói học và thu tiền · *Tiền, thông báo, báo cáo:* Hoàn tiền · Thông báo · Báo cáo | sidebar phẳng |
| Quản lý `quan-ly` | Web quản trị | Tổng quan hôm nay | *Hằng ngày:* Tổng quan hôm nay · Lịch · Điểm danh · *Học viên và lớp:* Học viên · Lớp học · *Gói và tiền:* Gói học và thu tiền · Hoàn tiền · Bảng giá · *Thông báo và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Nhật ký thao tác · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Điểm danh · Lịch · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Trang chủ | Trang chủ · Gói và đóng tiền · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-53` | T1 chính | tại chỗ | Đăng nhập | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05, M-08 |

### Hôm nay · `hom-nay-le-tan` · `admin/hom-nay-le-tan.html`

Vai: Lễ tân · module Lịch và buổi học

- Dải **Cần xử lý hôm nay**: Xử lý yêu cầu đổi lịch của phụ huynh · Gọi mời gia hạn học viên sắp hết buổi
- Dải **Việc nhanh ở quầy**: Đăng ký học viên mới · Bán gói học và thu tiền · Xếp học viên vào lớp · Đặt buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch của phụ huynh `F-16` | T1 chính | ngăn trượt | Cần xử lý hôm nay | Lễ tân | XD-02, M-06, D6:21-25, D8:118-132 |
| Gọi mời gia hạn học viên sắp hết buổi `F-31` | T2 phụ | tại chỗ | Cần xử lý hôm nay | Lễ tân | BR-TT-06, S-02, D8:182-187 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Đặt buổi học thử *(ngăn trượt)*

### Tổng quan hôm nay · `hom-nay-quan-ly` · `admin/hom-nay-quan-ly.html`

Vai: Quản lý · module Lịch và buổi học

- Dải **Cần xem hôm nay**: Xem danh sách gói đang bảo lưu
- Dải **Việc nhanh**: Huỷ buổi khi bể có sự cố · Xem báo cáo doanh thu · Gửi thông báo cho phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách gói đang bảo lưu `F-30` | T2 phụ | tại chỗ | Cần xem hôm nay | Quản lý | UC-09, D4:331 |

Lối tắt: Huỷ buổi khi bể có sự cố *(hộp thoại)* · Xem báo cáo doanh thu *(ngăn trượt)* · Gửi thông báo cho phụ huynh *(ngăn trượt)*

### Buổi dạy hôm nay · `hom-nay-hlv` · `admin/hom-nay-hlv.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Các buổi hôm nay**: Xem lịch toàn trung tâm và lịch dạy
- Dải **Việc nhanh ở bể**: Điểm danh buổi học · Ghi cấp độ gợi ý sau buổi học thử

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm và lịch dạy `F-14` | T2 phụ | tại chỗ | Các buổi hôm nay | Quản lý, Lễ tân, Huấn luyện viên | YC-04, M-03, D4:109-110 |

Lối tắt: Điểm danh buổi học *(ngăn trượt)* · Ghi cấp độ gợi ý sau buổi học thử *(hộp thoại)*

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-02` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, Huấn luyện viên | UC-01, M-01, YC-01, D4:151 |
| Đăng ký học viên mới `F-01` | T2 phụ | ngăn trượt | Bảng học viên | Lễ tân, Quản lý | UC-01, M-01, BR-HV-01, BR-HV-02, BR-HV-04 |
| Đặt buổi học thử `F-06` | T2 phụ | ngăn trượt | Bảng học viên | Lễ tân | BR-LH-06, S-03, YC-05 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Buổi học · Gói học · Thanh toán · Nhận xét

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-03` | T1 chính | tại chỗ | Đầu hồ sơ | Lễ tân, Quản lý, Huấn luyện viên | UC-01, M-01, D4:150, D4:105 |
| Sửa hồ sơ học viên `F-04` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D4:106, M-01 |
| Đổi lịch học `F-15` | T2 phụ | ngăn trượt | tab Buổi học | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02, A-07 |
| Xem lần đóng tiền và biên lai của học viên `F-28` | T2 phụ | tại chỗ | tab Thanh toán | Lễ tân, Quản lý | UC-02, D4:180 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-59` **hoãn** | T2 phụ | ngăn trượt | tab Nhận xét | Huấn luyện viên | S-04 |
| Cho học viên nghỉ hẳn `F-05` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05, D8:19-23 |

### Lớp học · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý · module Khoá học và lớp · tab: Các lớp · Danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-11` | T1 chính | ngăn trượt | tab Các lớp | Lễ tân, Quản lý | UC-04, M-02, BR-LH-03, A-01, A-06 |
| Mở lớp `F-09` | T2 phụ | ngăn trượt | Bảng lớp và chỗ trống | Quản lý | UC-03, M-02, BR-LH-02, BR-LI-01 |
| Xem danh sách lớp và chỗ trống `F-10` | T2 phụ | tại chỗ | tab Các lớp | Lễ tân, Quản lý | UC-04, M-02, YC-03 |
| Xem danh sách chờ của lớp và gọi phụ huynh `F-12` | T2 phụ | tại chỗ | tab Danh sách chờ | Lễ tân | BR-LH-04, M-02, D8:61-65 |
| Tạo khoá học `F-08` | T3 hiếm | ngăn trượt | Bảng lớp và chỗ trống | Quản lý | UC-03, M-02, BR-LH-01, BR-LH-05, D6:27-31 |
| Cho học viên rời lớp `F-13` *suy* | T3 hiếm | hộp thoại | tab Các lớp | Lễ tân, Quản lý | BR-QT-04, D8:61-65 |

### Lịch · `lich` · `admin/lich.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm và lịch dạy `F-14` | T1 chính | tại chỗ | Lưới lịch theo làn và giờ | Quản lý, Lễ tân, Huấn luyện viên | YC-04, M-03, D4:109-110 |
| Đổi lịch học `F-15` | T2 phụ | ngăn trượt | Lưới lịch theo làn và giờ | Lễ tân, Quản lý | UC-08, M-03, BR-LI-02, A-07 |
| Xếp học bù cho buổi vắng có phép `F-20` *suy* | T2 phụ | ngăn trượt | Lưới lịch theo làn và giờ | Lễ tân | D8:99-105 |
| Cho HLV dạy thay `F-17` | T3 hiếm | hộp thoại | Thanh công cụ | Quản lý | A-02, D8:94 |
| Huỷ buổi khi bể có sự cố `F-18` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, D6:32-36 |

### Điểm danh · `diem-danh` · `admin/diem-danh.html`

Vai: Quản lý, Huấn luyện viên · module Điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-22` | T1 chính | tại chỗ | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | UC-05, M-04, BR-DD-01, BR-DD-03, BR-DD-04, A-05, D7:57-64 |
| Ghi cấp độ gợi ý sau buổi học thử `F-07` | T2 phụ | hộp thoại | Danh sách học viên của buổi | Huấn luyện viên | BR-LH-06, D8:33 |
| Sửa điểm danh sau khi lưu `F-23` | T2 phụ | hộp thoại | Danh sách học viên của buổi | Huấn luyện viên, Quản lý | BR-DD-05, M-04 |
| Lưu tạm điểm danh khi mất mạng `F-24` | T2 phụ | tại chỗ | Danh sách học viên của buổi | Huấn luyện viên | A-10 |

### Gói học và thu tiền · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học và tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-26` | T1 chính | ngăn trượt | Bảng gói học | Lễ tân, Quản lý | UC-02, M-05, BR-TT-01, BR-TT-02, BR-TT-03, A-09 |
| Xác nhận chuyển khoản đã về `F-27` | T2 phụ | tại chỗ | Chờ xác nhận tiền | Lễ tân | UC-02, M-05 |
| Bảo lưu gói học `F-29` | T2 phụ | hộp thoại | Bảng gói học | Lễ tân, Quản lý | UC-09, M-07, BR-TT-05 |
| Nhập mã khuyến mãi khi bán gói `F-61` **hoãn** | T3 hiếm | hộp thoại | Bảng gói học | Lễ tân | CO-01 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Lập đề nghị hoàn tiền `F-32` | T1 chính | ngăn trượt | Bảng đề nghị hoàn tiền | Lễ tân | BR-TT-08, A-08 |
| Duyệt hoặc từ chối hoàn tiền `F-33` | T2 phụ | hộp thoại | Bảng đề nghị hoàn tiền | Quản lý | BR-TT-08 |
| Ghi ngày đã chi hoàn tiền `F-34` | T2 phụ | hộp thoại | Bảng đề nghị hoàn tiền | Lễ tân | BR-TT-08 |

### Bảng giá · `bang-gia` · `admin/bang-gia.html`

Vai: Quản lý · module Gói học và tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Sửa bảng giá gói `F-35` | T1 chính | tại chỗ | Bảng giá hiện hành | Quản lý | D7:98-106, BR-TT-03 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Lễ tân, Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-46` | T1 chính | ngăn trượt | Thông báo đã gửi | Quản lý, Lễ tân | UC-10, M-09, YC-12, BR-TB-01 |
| Gửi SMS cho phụ huynh chưa cài app `F-62` **hoãn** | T3 hiếm | hộp thoại | Thông báo đã gửi | Quản lý, Lễ tân | CO-02, BR-TB-01 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Lễ tân, Quản lý · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-50` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, D4:115 |
| Xem báo cáo doanh thu `F-51` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, S-01, BR-QT-03 |
| Xuất báo cáo ra Excel `F-52` | T3 hiếm | hộp thoại | Số liệu | Quản lý | D4:117 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm nhân viên và gán vai `F-54` | T1 chính | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, M-08, BR-QT-01 |
| Gán lớp cho HLV `F-55` | T2 phụ | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, BR-QT-02 |
| Khoá tài khoản nhân viên nghỉ việc `F-56` | T3 hiếm | hộp thoại | Bảng nhân viên | Quản lý | UC-12 |
| Mở khoá tài khoản nhân viên `F-57` | T3 hiếm | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tra nhật ký thao tác `F-58` | T1 chính | tại chỗ | Bảng nhật ký | Quản lý | BR-QT-04, M-08, D8:247-254 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý · module Quản trị · tab: Nhắc lịch · Ngày nghỉ lễ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cấu hình nhắc lịch tự động `F-47` | T1 chính | tại chỗ | tab Nhắc lịch | Quản lý | BR-TB-02, M-09, D8:224-229 |
| Sửa danh sách ngày nghỉ lễ `F-19` *suy* | T2 phụ | tại chỗ | tab Ngày nghỉ lễ | Quản lý | BR-LI-04, D8:78-81 |

## App phụ huynh

### Đăng nhập · `dang-nhap-app` · `app/dang-nhap-app.html`

Vai: Phụ huynh · module App phụ huynh · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng mã OTP `F-38` | T1 chính | tại chỗ | Số điện thoại và mã xác nhận | Phụ huynh | NF-05, UC-06, D8:14 |

### Trang chủ · `trang-chu` · `app/trang-chu.html`

Vai: Phụ huynh · module App phụ huynh

- Dải **Buổi sắp tới của con**: Xem lịch, số buổi còn lại và hạn gói của con · Xem trạng thái yêu cầu đổi lịch
- Dải **Việc nhanh**: Báo nghỉ một buổi · Gửi yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch, số buổi còn lại và hạn gói của con `F-40` | T1 chính | tại chỗ | Buổi sắp tới của con | Phụ huynh | UC-06, M-06, YC-11 |
| Chọn con đang xem `F-39` | T2 phụ | tại chỗ | Buổi sắp tới của con | Phụ huynh | BR-HV-03, M-06 |
| Báo nghỉ một buổi `F-42` | T2 phụ | sheet | Buổi sắp tới của con | Phụ huynh | UC-07, M-06, XD-01, BR-DD-04, A-04 |
| Gửi yêu cầu đổi lịch `F-43` | T2 phụ | sheet | Buổi sắp tới của con | Phụ huynh | XD-02, M-06 |
| Xem trạng thái yêu cầu đổi lịch `F-44` | T2 phụ | tại chỗ | Buổi sắp tới của con | Phụ huynh | XD-02, M-06 |

### Gói và đóng tiền · `goi-cua-con` · `app/goi-cua-con.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch sử đóng tiền của con `F-41` | T1 chính | tại chỗ | Lịch sử đóng tiền | Phụ huynh | UC-06, M-06 |

### Thông báo · `thong-bao-app` · `app/thong-bao-app.html`

Vai: Phụ huynh · module App phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đọc thông báo trong app `F-45` | T1 chính | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, M-09, BR-TB-04 |

### Tài khoản · `tai-khoan` · `app/tai-khoan.html`

Vai: Phụ huynh · module App phụ huynh · tab: Thông tin · Nhận xét của con

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem nhận xét tiến bộ của con `F-60` **hoãn** | T2 phụ | tại chỗ | tab Nhận xét của con | Phụ huynh | S-04 |

## Hành trình theo vai

- **Lễ tân · Khách mới đến mua gói và xếp lớp:** Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh xin đổi buổi:** Xử lý yêu cầu đổi lịch của phụ huynh → Đổi lịch học
- **Quản lý · Mở đợt lớp mới:** Tạo khoá học → Mở lớp → Gửi thông báo cho phụ huynh
- **Quản lý · Cuối tháng xem số liệu:** Xem báo cáo chuyên cần → Xem báo cáo doanh thu → Xuất báo cáo ra Excel
- **Huấn luyện viên · Buổi dạy hôm nay:** Xem lịch toàn trung tâm và lịch dạy → Điểm danh buổi học → Lưu tạm điểm danh khi mất mạng
- **Phụ huynh · Con ốm xin nghỉ:** Chọn con đang xem → Xem lịch, số buổi còn lại và hạn gói của con → Báo nghỉ một buổi
- **Phụ huynh · Xin đổi buổi học:** Gửi yêu cầu đổi lịch → Xem trạng thái yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh dắt con đến học lần đầu, muốn mua gói 12 buổi. | Bán gói học và thu tiền `F-26` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Chị phụ huynh gọi báo bé không đi được tuần này, nhờ chuyển sang lớp ngày thứ Bảy. | Đổi lịch học `F-15` | 2 · ≈ 5,4 giây |
| 3 | Lễ tân | Đầu giờ chiều, kiểm tra có phụ huynh nào xin đổi buổi mà chưa ai trả lời. | Xử lý yêu cầu đổi lịch của phụ huynh `F-16` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Một lớp vừa có chỗ trống, cần biết gọi phụ huynh nào trước. | Xem danh sách chờ của lớp và gọi phụ huynh `F-12` | 3 · ≈ 8,1 giây |
| 5 | Quản lý | Cuối tháng chủ trung tâm muốn biết đã thu được bao nhiêu tiền. | Xem báo cáo doanh thu `F-51` | 1 · ≈ 2,7 giây |
| 6 | Quản lý | Bơm lọc hỏng, bể đóng cửa cả buổi chiều, mọi lớp trong khoảng đó phải nghỉ. | Huỷ buổi khi bể có sự cố `F-18` | 1 · ≈ 2,7 giây |
| 7 | Huấn luyện viên | Buổi 17:30 vừa bắt đầu, cần ghi lại bé nào có mặt, bé nào vắng. | Điểm danh buổi học `F-22` | 1 · ≈ 2,7 giây |
| 8 | Huấn luyện viên | Sáng đến bể, cần biết hôm nay mình dạy những lớp nào, giờ nào. | Xem lịch toàn trung tâm và lịch dạy `F-14` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Bé bị sốt sáng nay, muốn xin nghỉ buổi chiều. | Báo nghỉ một buổi `F-42` | 1 · ≈ 2,7 giây |
| 10 | Phụ huynh | Muốn biết con còn bao nhiêu buổi và gói hết hạn khi nào. | Xem lịch, số buổi còn lại và hạn gói của con `F-40` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Quản trị `quan-tri` | — | 6 | 0 |  |
| Học viên `hoc-vien` | quan-tri | 8 | 1 |  |
| Khoá học và lớp `lop` | hoc-vien | 6 | 0 |  |
| Lịch và buổi học `lich` | lop | 8 | 0 |  |
| Gói học và tiền `goi-tien` | hoc-vien | 13 | 1 |  |
| Điểm danh `diem-danh` | lich, goi-tien | 4 | 0 |  |
| Thông báo `thong-bao` | lich | 5 | 1 |  |
| App phụ huynh `app-phu-huynh` | lich, diem-danh, goi-tien, thong-bao | 9 | 1 |  |
| Báo cáo `bao-cao` | diem-danh, goi-tien | 3 | 0 |  |

## Hoãn (4)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Ghi nhận xét kỹ năng cuối cấp độ `F-59` · Hồ sơ học viên
- Xem nhận xét tiến bộ của con `F-60` · Tài khoản
- Nhập mã khuyến mãi khi bán gói `F-61` · Gói học và thu tiền
- Gửi SMS cho phụ huynh chưa cài app `F-62` · Thông báo

## Chức năng suy ra, người dùng xác nhận ở cổng (3)

- Cho học viên rời lớp `F-13`: Xoá học viên khỏi lớp, ghi nhật ký; chỉ BR-QT-04 và enum nhắc, không có luồng riêng.
- Sửa danh sách ngày nghỉ lễ `F-19`: Ngày lễ không sinh buổi, buổi trùng ngày lễ dời sang tuần sau; có bảng ngày nghỉ lễ nhưng không use case nào nói ai sửa.
- Xếp học bù cho buổi vắng có phép `F-20`: Vắng có phép thành đã học bù khi học viên được xếp học một buổi bù ở lớp cùng cấp độ; chỉ có trong schema, không use case, không nói ai làm.

## Hệ thống tự làm

- Sinh buổi học theo khung giờ lớp `F-21`: Hệ thống tự sinh buổi từ khai giảng tới hết đợt, bỏ ngày lễ.
- Chốt vắng không phép cuối ngày `F-25`: Lúc 23:00 học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép.
- Cộng bù buổi khi trung tâm huỷ `F-36`: Buổi trung tâm huỷ không trừ buổi, gói được cộng thêm một buổi.
- Đánh dấu gói hết buổi hay hết hạn `F-37`: Gói hết buổi hay hết hạn thì học viên không vào lớp được tới khi mua gói mới.
- Gửi nhắc lịch tự động `F-48`: Tự gửi cho phụ huynh trước giờ học 2 tiếng.
- Gửi thông báo khẩn khi huỷ buổi hay đổi HLV `F-49`: Gửi ngay, không theo khung giờ; phụ huynh của mọi buổi bị huỷ nhận thông báo; quản lý nhận thông báo khi lễ tân huỷ.
