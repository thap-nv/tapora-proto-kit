# Bản đồ chức năng · Sóng Xanh

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-04, quan-ly, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-04, quan-ly, ≈ 11,1 giây) · (5) màn dày nhất ho-so-hoc-vien 6 chức năng, 3 tab · (4) nhóm menu dài nhất 7 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Quản lý `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch trung tâm · Yêu cầu đổi lịch · *Học viên và lớp:* Học viên · Lớp · *Gói và tiền:* Thu tiền · Gói học · Hoàn tiền · *Thông báo và báo cáo:* Thông báo · Báo cáo · *Cài đặt:* Khoá học · Bảng giá · Ngày nghỉ lễ · Nhắc lịch tự động · Nhân viên · Nhật ký thao tác · Tài khoản của tôi | sidebar có nhóm, tìm chung, Ctrl+K |
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch trung tâm · Yêu cầu đổi lịch · *Học viên và lớp:* Học viên · Lớp · *Gói và tiền:* Thu tiền · Gói học · Hoàn tiền · *Thông báo và báo cáo:* Thông báo · Báo cáo · *Cài đặt:* Ngày nghỉ lễ · Tài khoản của tôi | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Học viên · Lớp · Tài khoản của tôi | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Lịch học | Lịch học · Gói học · Thông báo · Tài khoản | 4 tab dưới |

## Web quản trị

### Quầy hôm nay · `quay-hom-nay` · `admin/quay-hom-nay.html`

Vai: Lễ tân · module Lịch và buổi học

- Dải **Việc nhanh**: Đăng ký học viên mới · Bán gói học và thu tiền · Đặt buổi học thử · Ghi báo nghỉ thay phụ huynh
- Dải **Bé hết buổi có lớp hôm nay**: Gia hạn gói tại quầy khi bé hết buổi, hết hạn
- Dải **Chờ xử lý**: Xử lý yêu cầu đổi lịch · Xác nhận tiền chuyển khoản đã về
- Dải **Sắp hết buổi cần gọi**: Xem danh sách học viên sắp hết buổi · Ghi kết quả cuộc gọi mời gia hạn

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách học viên sắp hết buổi `F-16` | T2 phụ | tại chỗ | Sắp hết buổi cần gọi | Lễ tân | S-02, BR-TT-06, D3:391-465 |
| Ghi báo nghỉ thay phụ huynh `F-34` *suy* | T2 phụ | hộp thoại | Việc nhanh | Lễ tân | XD-01, UC-07, D8:18, D7:39 |
| Ghi kết quả cuộc gọi mời gia hạn `F-17` | T4 ngữ cảnh | hộp thoại | Sắp hết buổi cần gọi | Lễ tân | BR-TT-06, S-02, D10:182-187 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói học và thu tiền *(ngăn trượt)* · Đặt buổi học thử *(ngăn trượt)* · Gia hạn gói tại quầy khi bé hết buổi, hết hạn *(ngăn trượt)* · Xử lý yêu cầu đổi lịch *(ngăn trượt)* · Xác nhận tiền chuyển khoản đã về *(hộp thoại)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý · module Báo cáo

- Dải **Cần duyệt**: Duyệt hoặc từ chối đề nghị hoàn tiền · Cho phép xếp học viên xuống một bậc
- Dải **Hôm nay ở bể**: Phân công HLV dạy thay · Huỷ hàng loạt buổi khi bể sự cố
- Dải **Tháng này**: Xem báo cáo chuyên cần · Xem báo cáo doanh thu
- Dải **Việc nhanh**: Gửi thông báo cho phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-01` | T2 phụ | tại chỗ | Tháng này | Quản lý, Lễ tân | UC-11, S-01, YC-13, D6:115, D6:390, D3:1003-1077 |
| Xem báo cáo doanh thu `F-02` | T2 phụ | tại chỗ | Tháng này | Quản lý | UC-11, S-01, YC-13, BR-QT-03, D6:116, D3:1079-1153 |

Lối tắt: Duyệt hoặc từ chối đề nghị hoàn tiền *(hộp thoại)* · Cho phép xếp học viên xuống một bậc *(hộp thoại)* · Phân công HLV dạy thay *(ngăn trượt)* · Huỷ hàng loạt buổi khi bể sự cố *(hộp thoại)* · Gửi thông báo cho phụ huynh *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-day` · `admin/buoi-day.html`

Vai: Huấn luyện viên · module Điểm danh

- Dải **Buổi đang dạy**: Điểm danh buổi học · Ghi cấp độ gợi ý sau buổi học thử
- Dải **Lịch dạy tuần này**: Xem lịch dạy
- Dải **Buổi đã dạy**: Sửa điểm danh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-04` | T1 chính | tại chỗ | Buổi đang dạy | Huấn luyện viên, Quản lý | UC-05, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, M-04, D6:111, D6:228-254, D5:1537-1611 |
| Xem lịch dạy `F-31` | T2 phụ | tại chỗ | Lịch dạy tuần này | Huấn luyện viên, Quản lý, Lễ tân | BR-QT-02, M-03, D6:110, UC-05, D5:851-925 |
| Sửa điểm danh `F-05` | T4 ngữ cảnh | ngăn trượt | Buổi đã dạy | Huấn luyện viên, Quản lý | BR-DD-05, UC-05, M-04, D6:254, D5:1613-1687, D10:114-115 |
| Ghi cấp độ gợi ý sau buổi học thử `F-51` | T4 ngữ cảnh | hộp thoại | Buổi đang dạy | Huấn luyện viên | BR-LH-06, D10:33 |

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-61` | T1 chính | tại chỗ | Ô đăng nhập | Quản lý, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-05, UC-12 |

### Lịch trung tâm · `lich` · `admin/lich.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch toàn trung tâm `F-30` | T1 chính | tại chỗ | Lưới làn và giờ | Quản lý, Lễ tân | YC-04, M-03, D6:109, D5:775-849, D10:83-97 |
| Xem lịch dạy `F-31` | T2 phụ | tại chỗ | Thanh công cụ | Huấn luyện viên, Quản lý, Lễ tân | BR-QT-02, M-03, D6:110, UC-05, D5:851-925 |
| Phân công HLV dạy thay `F-40` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | A-02, BR-TT-07, BR-TB-03, M-03, D5:1307-1381, D10:94 |
| Huỷ hàng loạt buổi khi bể sự cố `F-41` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý | A-03, XD-04, BR-TT-07, BR-TB-03, YC-14, M-03, D5:1231-1305, D10:86, D10:96 |

### Buổi học · `buoi-hoc` · `admin/buoi-hoc.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học · vào từ Lịch trung tâm (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-04` | T2 phụ | tại chỗ | Học viên của buổi | Huấn luyện viên, Quản lý | UC-05, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, M-04, D6:111, D6:228-254, D5:1537-1611 |
| Sửa điểm danh `F-05` | T4 ngữ cảnh | ngăn trượt | Học viên của buổi | Huấn luyện viên, Quản lý | BR-DD-05, UC-05, M-04, D6:254, D5:1613-1687, D10:114-115 |
| Đổi lịch một buổi `F-37` | T4 ngữ cảnh | ngăn trượt | Học viên của buổi | Lễ tân | UC-08, BR-LI-02, M-03, D6:299-324, D5:927-1001 |
| Xếp buổi học bù `F-39` | T4 ngữ cảnh | ngăn trượt | Học viên của buổi | Lễ tân | D5:1155-1229, D10:104, D10:112, BR-DD-03 |

### Yêu cầu đổi lịch · `yeu-cau-doi-lich` · `admin/yeu-cau-doi-lich.html`

Vai: Lễ tân, Quản lý · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xử lý yêu cầu đổi lịch `F-36` | T1 chính | ngăn trượt | Danh sách yêu cầu | Lễ tân | XD-02, M-03, M-06, D5:1079-1153, D10:118-132 |

Lối tắt: Đổi lịch một buổi *(ngăn trượt)*

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm kiếm và danh sách học viên `F-25` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý, Huấn luyện viên | UC-01, M-01, YC-01, D5:87-161 |
| Đăng ký học viên mới `F-24` | T2 phụ | ngăn trượt | Tìm và lọc | Lễ tân, Quản lý | UC-01, M-01, YC-01, BR-HV-01, BR-HV-02, BR-HV-04, D5:11-85 |
| Đặt buổi học thử `F-50` | T2 phụ | ngăn trượt | Tìm và lọc | Lễ tân, Quản lý | BR-LH-06, YC-05, S-03, D10:19-23, D5:697-771 |

### Hồ sơ học viên · `ho-so-hoc-vien` · `admin/ho-so-hoc-vien.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Học viên · vào từ Học viên (tìm và chọn một bản ghi) · tab: Gói học · Đóng tiền · Buổi đã học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn dùng của gói `F-14` | T2 phụ | tại chỗ | tab Gói học | Phụ huynh, Lễ tân, Quản lý | UC-06, M-06, YC-11, BR-TT-01, BR-TT-07, D3:163-237 |
| Xem lịch sử đóng tiền và biên lai `F-15` | T2 phụ | tại chỗ | tab Đóng tiền | Phụ huynh, Lễ tân, Quản lý | UC-06, UC-02, M-06, M-05, YC-11, D3:87-161, D10:172-180 |
| Xem hồ sơ học viên `F-26` | T2 phụ | tại chỗ | Đầu hồ sơ | Lễ tân, Quản lý, Huấn luyện viên | UC-01, M-01, D6:105, D5:163-237 |
| Sửa hồ sơ học viên `F-27` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý | D6:106, BR-HV-02, BR-HV-04 |
| Chuyển học viên sang ngừng học `F-28` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý | BR-HV-05, D10:19-23 |
| Bảo lưu gói học `F-11` | T4 ngữ cảnh | ngăn trượt | tab Gói học | Lễ tân, Quản lý | UC-09, M-07, YC-09, BR-TT-05, D3:239-313, D10:165-170 |

Lối tắt: Bán gói học và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Đổi lịch một buổi *(ngăn trượt)* · Chuyển lớp cố định *(ngăn trượt)* · Ghi báo nghỉ thay phụ huynh *(hộp thoại)* · Lập đề nghị hoàn tiền *(ngăn trượt)*

### Lớp · `lop` · `admin/lop.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách lớp và chỗ trống `F-46` | T1 chính | tại chỗ | Bảng lớp | Lễ tân, Quản lý, Huấn luyện viên | UC-04, M-02, YC-03, BR-LH-05, D6:209, D5:469-543 |
| Mở lớp `F-45` | T3 hiếm | ngăn trượt | Lọc | Quản lý | UC-03, M-02, YC-02, BR-LH-02, D5:393-467 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Lễ tân, Quản lý, Huấn luyện viên · module Khoá học và lớp · vào từ Lớp (tìm và chọn một bản ghi) · tab: Học viên đang học · Danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xếp học viên vào lớp `F-47` | T1 chính | ngăn trượt | Đầu lớp | Lễ tân, Quản lý | UC-04, M-02, YC-03, BR-LH-03, BR-LH-04, BR-HV-04, A-01, A-06, D5:545-619 |
| Danh sách chờ của lớp `F-49` | T2 phụ | tại chỗ | tab Danh sách chờ | Lễ tân, Quản lý | BR-LH-04, M-02, D6:188, D10:61-74, D5:621-695 |
| Chuyển lớp cố định `F-38` | T4 ngữ cảnh | ngăn trượt | tab Học viên đang học | Lễ tân | UC-08, BR-LI-02, A-07, OQ-02, M-03, D6:299-324, D5:927-1001 |
| Cho phép xếp học viên xuống một bậc `F-48` *suy* | T4 ngữ cảnh | hộp thoại | Đầu lớp | Quản lý | BR-LH-03 |
| Ghi nhận xét tiến bộ cuối cấp độ `F-53` **hoãn** | T4 ngữ cảnh | ngăn trượt | tab Học viên đang học | Huấn luyện viên | S-04, D3:1539-1613 |

### Khoá học · `khoa-hoc` · `admin/khoa-hoc.html`

Vai: Quản lý · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Quản lý khoá học `F-44` | T2 phụ | tại chỗ | Danh sách khoá học | Quản lý | UC-03, M-02, YC-02, BR-LH-01, BR-LH-05, XD-03, D5:317-391 |

### Thu tiền · `thu-tien` · `admin/thu-tien.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói học và thu tiền `F-07` | T1 chính | tại chỗ | Bán gói | Lễ tân, Quản lý | UC-02, M-05, YC-10, BR-TT-01, BR-TT-02, BR-TT-03, A-09, D3:11-85 |
| Xác nhận tiền chuyển khoản đã về `F-08` | T2 phụ | hộp thoại | Chuyển khoản chờ xác nhận | Lễ tân, Quản lý | UC-02, M-05, D6:176 |
| Gia hạn gói tại quầy khi bé hết buổi, hết hạn `F-09` | T2 phụ | tại chỗ | Bé hết buổi có lớp hôm nay | Lễ tân, Quản lý | A-05, BR-TT-04, UC-02, M-05, D3:315-389 |
| Áp mã khuyến mãi khi bán gói `F-22` **hoãn** | T2 phụ | tại chỗ | Bán gói | Lễ tân, Quản lý | CO-01, D3:619-693 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Lễ tân, Quản lý · module Gói học và thu tiền · tab: Theo trạng thái · Sắp hết buổi

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách gói học theo trạng thái `F-13` | T2 phụ | tại chỗ | tab Theo trạng thái | Quản lý, Lễ tân | UC-09, M-07, D6:331, D10:145-163 |
| Xem danh sách học viên sắp hết buổi `F-16` | T2 phụ | tại chỗ | tab Sắp hết buổi | Lễ tân | S-02, BR-TT-06, D3:391-465 |

### Hoàn tiền · `hoan-tien` · `admin/hoan-tien.html`

Vai: Quản lý, Lễ tân · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Duyệt hoặc từ chối đề nghị hoàn tiền `F-19` | T1 chính | hộp thoại | Danh sách đề nghị | Quản lý | BR-TT-08, D3:467-541, D10:189-201 |
| Lập đề nghị hoàn tiền `F-18` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-TT-08, A-08, D3:467-541, D10:189-205 |
| Ghi ngày đã chi hoàn tiền `F-20` | T4 ngữ cảnh | hộp thoại | Danh sách đề nghị | Lễ tân | BR-TT-08, D10:196-205 |

### Bảng giá · `bang-gia` · `admin/bang-gia.html`

Vai: Quản lý · module Gói học và thu tiền · tab: Bảng giá · Mã khuyến mãi

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Sửa bảng giá gói học `F-21` | T2 phụ | tại chỗ | tab Bảng giá | Quản lý | BR-TT-03, D9:98-106, D3:543-617, D10:136-143 |
| Tạo mã khuyến mãi `F-23` **hoãn** *suy* | T2 phụ | ngăn trượt | tab Mã khuyến mãi | Quản lý | CO-01 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-65` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | UC-10, M-09, YC-12, BR-TB-01, BR-TB-03, D6:114, D3:697-771 |
| Xem thông báo đã gửi `F-66` *suy* | T2 phụ | tại chỗ | Thông báo đã gửi | Quản lý, Lễ tân | UC-10, D10:209-222 |
| Gửi SMS cho phụ huynh chưa cài app `F-71` **hoãn** | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý, Lễ tân | CO-02, D3:925-999 |

### Nhắc lịch tự động · `nhac-lich` · `admin/nhac-lich.html`

Vai: Quản lý · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Cấu hình nhắc lịch tự động `F-69` | T2 phụ | tại chỗ | Cài đặt nhắc | Quản lý | BR-TB-02, M-09, D3:849-923, D10:224-229 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý, Lễ tân · module Báo cáo · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-01` | T2 phụ | tại chỗ | tab Chuyên cần | Quản lý, Lễ tân | UC-11, S-01, YC-13, D6:115, D6:390, D3:1003-1077 |
| Xem báo cáo doanh thu `F-02` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý | UC-11, S-01, YC-13, BR-QT-03, D6:116, D3:1079-1153 |
| Xuất báo cáo ra Excel `F-03` | T3 hiếm | tại chỗ | Chọn khoảng thời gian | Quản lý | D6:117, YC-13, D3:1155-1229 |

### Ngày nghỉ lễ · `ngay-nghi-le` · `admin/ngay-nghi-le.html`

Vai: Quản lý, Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Quản lý ngày nghỉ lễ `F-43` | T2 phụ | tại chỗ | Danh sách ngày nghỉ | Quản lý, Lễ tân | BR-LI-04, M-03, D3:1461-1536, D10:78-81 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm nhân viên `F-55` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý | UC-12, M-08, YC-14, BR-QT-01, D6:118, D3:1233-1307, D10:239-245 |
| Xem danh sách nhân viên `F-57` *suy* | T2 phụ | tại chỗ | Bảng nhân viên | Quản lý | UC-12, D3:1233-1307 |
| Gán lớp phụ trách cho HLV `F-56` | T4 ngữ cảnh | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, BR-QT-02, M-08 |
| Sửa thông tin nhân viên `F-58` *suy* | T4 ngữ cảnh | ngăn trượt | Bảng nhân viên | Quản lý | UC-12, D3:1245 |
| Khoá tài khoản nhân viên `F-59` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, D6:411, D10:244 |
| Mở khoá tài khoản nhân viên `F-60` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý | UC-12, BR-QT-05, D6:412, D10:244 |

### Nhật ký thao tác · `nhat-ky` · `admin/nhat-ky.html`

Vai: Quản lý · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem nhật ký thao tác `F-63` | T2 phụ | tại chỗ | Bảng nhật ký | Quản lý | BR-QT-04, M-08, D3:1309-1383, D10:247-255 |

### Tài khoản của tôi · `tai-khoan` · `admin/tai-khoan.html`

Vai: Quản lý, Lễ tân, Huấn luyện viên · module Quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đổi mật khẩu `F-62` *suy* | T2 phụ | hộp thoại | Thông tin tài khoản | Quản lý, Lễ tân, Huấn luyện viên | UC-12, BR-QT-05 |

## App phụ huynh

### Lịch học · `app-lich-hoc` · `app/app-lich-hoc.html`

Vai: Phụ huynh · module Lịch và buổi học

- Dải **Con đang xem**: Chọn con đang xem trên app
- Dải **Buổi sắp tới**: Xem lịch học của con · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Buổi đã học**: Xem đánh giá tiến bộ của con

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Chọn con đang xem trên app `F-29` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03, D5:239-313 |
| Xem lịch học của con `F-32` | T2 phụ | tại chỗ | Buổi sắp tới | Phụ huynh | UC-06, M-06, D6:256-275, D5:1383-1457 |
| Báo nghỉ một buổi `F-33` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | UC-07, XD-01, BR-DD-03, BR-DD-04, A-04, YC-08, M-06, D6:277-297, D5:1459-1533 |
| Gửi yêu cầu đổi lịch `F-35` | T4 ngữ cảnh | sheet | Buổi sắp tới | Phụ huynh | XD-02, YC-07, BR-LI-03, M-06, D5:1003-1077, D10:118-132 |
| Xem đánh giá tiến bộ của con `F-54` **hoãn** | T4 ngữ cảnh | sheet | Buổi đã học | Phụ huynh | S-04, D3:1539-1613 |

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại và OTP `F-64` | T1 chính | tại chỗ | Ô đăng nhập | Phụ huynh | NF-05, UC-06, D3:1385-1460 |

### Gói học · `app-goi-hoc` · `app/app-goi-hoc.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem số buổi còn lại và hạn dùng của gói `F-14` | T2 phụ | tại chỗ | Gói đang dùng | Phụ huynh, Lễ tân, Quản lý | UC-06, M-06, YC-11, BR-TT-01, BR-TT-07, D3:163-237 |
| Xem lịch sử đóng tiền và biên lai `F-15` | T2 phụ | tại chỗ | Các lần đóng tiền | Phụ huynh, Lễ tân, Quản lý | UC-06, UC-02, M-06, M-05, YC-11, D3:87-161, D10:172-180 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo trên app `F-67` | T2 phụ | tại chỗ | Danh sách thông báo | Phụ huynh | UC-10, D6:356, D3:773-847, D10:218-222 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bật, tắt nhận thông báo `F-68` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04 |

## Hành trình theo vai

- **Lễ tân · Bé mới tới quầy đăng ký học:** Đăng ký học viên mới → Bán gói học và thu tiền → Xếp học viên vào lớp
- **Lễ tân · Phụ huynh xin đổi buổi trên app:** Xử lý yêu cầu đổi lịch → Đổi lịch một buổi
- **Lễ tân · Gọi mời gia hạn gói:** Xem danh sách học viên sắp hết buổi → Ghi kết quả cuộc gọi mời gia hạn → Bán gói học và thu tiền
- **Quản lý · Mở lớp đầu đợt:** Quản lý khoá học → Mở lớp → Xem danh sách lớp và chỗ trống
- **Quản lý · Bể có sự cố:** Huỷ hàng loạt buổi khi bể sự cố → Gửi thông báo cho phụ huynh
- **Quản lý · Xem số cuối tháng:** Xem báo cáo chuyên cần → Xem báo cáo doanh thu → Xuất báo cáo ra Excel
- **Huấn luyện viên · Dạy một buổi ở bể:** Xem lịch dạy → Điểm danh buổi học → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Con ốm, báo nghỉ:** Đăng nhập app bằng số điện thoại và OTP → Chọn con đang xem trên app → Xem lịch học của con → Báo nghỉ một buổi
- **Phụ huynh · Xem con còn bao nhiêu buổi:** Chọn con đang xem trên app → Xem số buổi còn lại và hạn dùng của gói → Xem lịch sử đóng tiền và biên lai

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một phụ huynh dắt bé 5 tuổi tới quầy, muốn cho bé đi học bơi từ tuần sau. | Đăng ký học viên mới `F-24` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Phụ huynh của một bé đang học tới quầy, muốn đóng thêm 12 buổi bằng tiền mặt. | Bán gói học và thu tiền `F-07` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Kế toán nhắn: khoản chuyển khoản sáng nay của một phụ huynh đã về tài khoản. | Xác nhận tiền chuyển khoản đã về `F-08` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Sáng nay có phụ huynh nhờ qua app chuyển con sang chiều thứ Năm tuần này. | Xử lý yêu cầu đổi lịch `F-36` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Một bà nội gọi điện: cháu bị sốt, chiều nay không đi bơi được. | Ghi báo nghỉ thay phụ huynh `F-34` | 1 · ≈ 2,7 giây |
| 6 | Lễ tân | Một phụ huynh hỏi lớp Cơ bản tối thứ Ba còn nhận thêm bé không. | Xem danh sách lớp và chỗ trống `F-46` | 2 · ≈ 5,4 giây |
| 7 | Huấn luyện viên | Lớp 17 giờ vừa xuống nước, bạn đứng ở thành bể và cần ghi bé nào tới, bé nào không. | Điểm danh buổi học `F-04` | 1 · ≈ 2,7 giây |
| 8 | Quản lý | Bạn muốn biết chiều nay bể có những lớp nào, ai dạy lớp nào. | Xem lịch toàn trung tâm `F-30` | 2 · ≈ 5,4 giây |
| 9 | Phụ huynh | Bạn muốn biết con còn mấy buổi nữa thì phải đóng tiền tiếp. | Xem số buổi còn lại và hạn dùng của gói `F-14` | 2 · ≈ 5,4 giây |
| 10 | Phụ huynh | Con bị ốm, bạn muốn báo trung tâm là thứ Bảy này con nghỉ. | Báo nghỉ một buổi `F-33` | 2 · ≈ 5,4 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên `hoc-vien` | — | 6 | 0 |  |
| Quản trị `quan-tri` | — | 10 | 0 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien | 17 | 2 |  |
| Khoá học và lớp `lop` | hoc-vien, quan-tri, goi-hoc | 11 | 2 |  |
| Lịch và buổi học `lich` | lop, goi-hoc | 14 | 0 |  |
| Điểm danh `diem-danh` | lich, goi-hoc | 3 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lop, lich | 7 | 1 |  |
| Báo cáo `bao-cao` | diem-danh, goi-hoc | 3 | 0 |  |

## Hoãn (5)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-22` · Thu tiền
- Tạo mã khuyến mãi `F-23` · Bảng giá
- Ghi nhận xét tiến bộ cuối cấp độ `F-53` · Chi tiết lớp
- Xem đánh giá tiến bộ của con `F-54` · Lịch học
- Gửi SMS cho phụ huynh chưa cài app `F-71` · Thông báo

## Chức năng suy ra, người dùng xác nhận ở cổng (9)

- Tạo mã khuyến mãi `F-23`: Mã cần có chỗ tạo: quản lý đặt mã, mức giảm, thời gian dùng cho một đợt khuyến mãi. Tài liệu chưa nói ai tạo và giảm thế nào; để giai đoạn 2.
- Ghi báo nghỉ thay phụ huynh `F-34`: Phụ huynh gọi điện hay báo ở quầy: lễ tân chọn học viên, buổi, ghi báo nghỉ; cùng quy tắc như báo trên app (trước 2 giờ theo XD-01, tối đa 3 lần vắng có phép mỗi gói).
- Cho phép xếp học viên xuống một bậc `F-48`: Lớp thấp hơn cấp độ của bé một bậc chỉ xếp được khi quản lý cho phép; lễ tân xếp thì cần quản lý duyệt; thấp hơn hai bậc hay cao hơn cấp độ thì chặn.
- Dọn hồ sơ học thử quá 60 ngày `F-52`: Bé học thử mà không mua gói thì hồ sơ học thử chỉ giữ 60 ngày; hệ thống tự xử lý hồ sơ quá hạn mỗi ngày.
- Xem danh sách nhân viên `F-57`: Danh sách nhân viên: họ tên, số điện thoại, vai, lớp phụ trách (HLV), đang hoạt động hay bị khoá; lọc theo vai và trạng thái khoá.
- Sửa thông tin nhân viên `F-58`: Sửa họ tên, số điện thoại (không trùng), đổi vai của nhân viên; giá trị cũ được giữ để đối chiếu.
- Đổi mật khẩu `F-62`: Lần đầu đăng nhập bằng mật khẩu tạm nhận qua SMS thì đặt mật khẩu mới, tối thiểu 8 ký tự; về sau đổi lại được.
- Xem thông báo đã gửi `F-66`: Danh sách thông báo đã gửi và đang hẹn giờ: tiêu đề, người gửi, nhóm nhận, giờ gửi, cờ khẩn, số phụ huynh đã đọc; huỷ thông báo hẹn giờ chưa tới giờ gửi.
- Bật, tắt nhận thông báo `F-68`: Phụ huynh tắt hay bật nhận thông báo thường trên app; thông báo khẩn (huỷ buổi) luôn được gửi, không tắt được.

## Hệ thống tự làm

- Chốt điểm danh cuối ngày `F-06`: 23:00 mỗi ngày, học viên chưa có trạng thái trong buổi đã qua được ghi vắng không phép và bị trừ một buổi (BR-DD-03).
- Tự đánh dấu gói hết buổi, hết hạn `F-10`: Dùng hết buổi (kể cả buổi cộng thêm) thì gói sang hết buổi; qua ngày hết hạn thì sang hết hạn. Gói ở hai trạng thái này chặn học viên vào lớp tới khi mua gói mới; nhãn trên danh sách điểm danh do điểm danh lo.
- Tự mở lại gói khi hết bảo lưu `F-12`: Hết số ngày bảo lưu, gói về đang dùng và buổi học được sinh lại theo lịch cũ (phần sinh buổi do lịch lo). Lớp cũ đã đủ sĩ số thì lễ tân xếp lớp khác (UC-04).
- Sinh buổi học tự động `F-42`: Khi mở lớp, hệ thống sinh buổi theo khung giờ của lớp từ ngày khai giảng tới hết đợt, học viên của buổi ở trạng thái chưa điểm danh. Ngày trong danh sách nghỉ lễ không sinh buổi; buổi rơi vào ngày lễ dời sang tuần sau.
- Dọn hồ sơ học thử quá 60 ngày `F-52`: Bé học thử mà không mua gói thì hồ sơ học thử chỉ giữ 60 ngày; hệ thống tự xử lý hồ sơ quá hạn mỗi ngày.
- Gửi nhắc lịch trước giờ học `F-70`: Khi việc nhắc đang bật, hệ thống gửi tin nhắc theo mẫu cho phụ huynh của từng buổi học, trước giờ học 2 tiếng; tin nằm trong mục Thông báo của app.
