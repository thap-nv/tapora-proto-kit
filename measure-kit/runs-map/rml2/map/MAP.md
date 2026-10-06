# Bản đồ chức năng

> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.

Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-01, quan-ly, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-01, quan-ly, ≈ 11,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 4 tab · (4) nhóm menu dài nhất 5 · (6) việc mang nhiều nhãn 0

## Vai, trang chủ và menu

| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |
|---|---|---|---|---|
| Lễ tân `le-tan` | Web quản trị | Quầy hôm nay | *Hằng ngày:* Quầy hôm nay · Lịch tuần · Học viên · Lớp học · Yêu cầu đổi lịch · *Gói và thu tiền:* Thu tiền · Gói học · *Thông báo và báo cáo:* Thông báo · Báo cáo | sidebar phẳng |
| Quản lý trung tâm `quan-ly` | Web quản trị | Tổng quan | *Hằng ngày:* Tổng quan · Lịch tuần · Học viên · Lớp học · Yêu cầu đổi lịch · *Gói và thu tiền:* Thu tiền · Gói học · *Thông báo và báo cáo:* Thông báo · Báo cáo · *Quản trị:* Nhân viên · Cài đặt | sidebar có nhóm, tìm chung, Ctrl+K |
| Huấn luyện viên `hlv` | Web quản trị | Buổi dạy hôm nay | Buổi dạy hôm nay · Lớp học · Học viên | thanh trên |
| Phụ huynh `phu-huynh` | App phụ huynh | Hôm nay | Hôm nay · Lịch học · Gói học · Thông báo · Tài khoản | 5 tab dưới |

## Web quản trị

### Đăng nhập · `dang-nhap` · `admin/dang-nhap.html`

Vai: Quản lý trung tâm, Lễ tân, Huấn luyện viên · module Báo cáo và quản trị · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập web quản trị `F-74` | T1 chính | trang | Đăng nhập | Quản lý trung tâm, Lễ tân, Huấn luyện viên | BR-QT-01, BR-QT-02, YC-14, M-08 |
| Đổi mật khẩu `F-81` *suy* | T2 phụ | tại chỗ | Đổi mật khẩu tạm | Quản lý trung tâm, Lễ tân, Huấn luyện viên | BR-QT-05, UC-12, D4:407 |

### Quầy hôm nay · `quay` · `admin/quay.html`

Vai: Lễ tân · module Học viên và phụ huynh

- Dải **Tìm học viên**: Tìm học viên
- Dải **Việc ở quầy**: Đăng ký học viên mới · Bán gói và thu tiền · Xếp học viên vào lớp · Ghi báo nghỉ thay phụ huynh tại quầy · Đặt buổi học thử
- Dải **Yêu cầu đổi lịch chờ xử lý**: Xem danh sách yêu cầu đổi lịch · Đổi một buổi học sang lớp khác · Từ chối yêu cầu đổi lịch
- Dải **Chờ xác nhận chuyển khoản**: Xác nhận tiền chuyển khoản đã về
- Dải **Sắp hết buổi**: Xem danh sách học viên sắp hết buổi · Ghi kết quả cuộc gọi mời gia hạn

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Ghi báo nghỉ thay phụ huynh tại quầy `F-05` *suy* | T2 phụ | hộp thoại | Việc ở quầy | Lễ tân | XD-01, D6:18, CO-02, D4:111 |
| Xem danh sách học viên sắp hết buổi `F-22` | T2 phụ | tại chỗ | Sắp hết buổi | Lễ tân | BR-TT-06, S-02, D1:81 |
| Tìm học viên `F-30` | T2 phụ | tại chỗ | Tìm học viên | Lễ tân, Quản lý trung tâm, Huấn luyện viên | YC-01, M-01, D4:151, D4:105 |
| Xem danh sách yêu cầu đổi lịch `F-49` | T2 phụ | tại chỗ | Yêu cầu đổi lịch chờ xử lý | Lễ tân, Quản lý trung tâm | XD-02, D8:118-131 |
| Ghi kết quả cuộc gọi mời gia hạn `F-23` | T4 ngữ cảnh | hộp thoại | Sắp hết buổi | Lễ tân | BR-TT-06, S-02, D8:182-187 |

Lối tắt: Đăng ký học viên mới *(ngăn trượt)* · Bán gói và thu tiền *(ngăn trượt)* · Xếp học viên vào lớp *(ngăn trượt)* · Đặt buổi học thử *(ngăn trượt)* · Đổi một buổi học sang lớp khác *(ngăn trượt)* · Từ chối yêu cầu đổi lịch *(hộp thoại)* · Xác nhận tiền chuyển khoản đã về *(hộp thoại)*

### Tổng quan · `tong-quan` · `admin/tong-quan.html`

Vai: Quản lý trung tâm · module Báo cáo và quản trị

- Dải **Cần chú ý**: Xem thông báo trên web quản trị · Duyệt đề nghị hoàn tiền
- Dải **Hôm nay ở bể**: Phân công HLV dạy thay · Huỷ các buổi khi bể sự cố
- Dải **Tháng này**: Xem báo cáo doanh thu · Xem báo cáo chuyên cần
- Dải **Việc nhanh**: Gửi thông báo cho phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-71` | T2 phụ | tại chỗ | Tháng này | Quản lý trung tâm, Lễ tân | UC-11, S-01, YC-13, D4:115 |
| Xem báo cáo doanh thu `F-72` | T2 phụ | tại chỗ | Tháng này | Quản lý trung tâm | UC-11, S-01, YC-13, BR-QT-03, D4:116 |
| Xem thông báo trên web quản trị `F-90` *suy* | T2 phụ | tại chỗ | Cần chú ý | Quản lý trung tâm | XD-02, XD-04, D6:24, D6:35 |

Lối tắt: Duyệt đề nghị hoàn tiền *(hộp thoại)* · Phân công HLV dạy thay *(ngăn trượt)* · Huỷ các buổi khi bể sự cố *(hộp thoại)* · Gửi thông báo cho phụ huynh *(ngăn trượt)*

### Buổi dạy hôm nay · `buoi-hom-nay` · `admin/buoi-hom-nay.html`

Vai: Huấn luyện viên · module Điểm danh và báo nghỉ

- Dải **Điểm danh buổi đang dạy**: Điểm danh buổi học · Sửa điểm danh · Ghi cấp độ gợi ý sau buổi học thử · Đề xuất học viên lên cấp độ
- Dải **Lịch dạy tuần này**: Xem lịch dạy của HLV

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-01` | T1 chính | tại chỗ | Điểm danh buổi đang dạy | Huấn luyện viên, Quản lý trung tâm | UC-05, M-04, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, D4:111, D8:99-113 |
| Xem lịch dạy của HLV `F-42` | T2 phụ | tại chỗ | Lịch dạy tuần này | Quản lý trung tâm, Lễ tân, Huấn luyện viên | D4:110, D4:27 |
| Sửa điểm danh `F-02` | T4 ngữ cảnh | tại chỗ | Điểm danh buổi đang dạy | Huấn luyện viên, Quản lý trung tâm | BR-DD-05, UC-05, M-04, D8:114-115 |
| Đề xuất học viên lên cấp độ `F-65` *suy* | T4 ngữ cảnh | hộp thoại | Điểm danh buổi đang dạy | Huấn luyện viên | A-07, BR-LH-03 |
| Ghi cấp độ gợi ý sau buổi học thử `F-67` | T4 ngữ cảnh | hộp thoại | Điểm danh buổi đang dạy | Huấn luyện viên | BR-LH-06, S-03 |

### Lịch tuần · `lich-tuan` · `admin/lich-tuan.html`

Vai: Quản lý trung tâm, Lễ tân · module Lịch và buổi học · tab: Theo làn · Theo HLV

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch tuần toàn trung tâm `F-41` | T1 chính | tại chỗ | tab Theo làn | Quản lý trung tâm, Lễ tân | D4:109, M-03 |
| Xem lịch dạy của HLV `F-42` | T2 phụ | tại chỗ | tab Theo HLV | Quản lý trung tâm, Lễ tân, Huấn luyện viên | D4:110, D4:27 |
| Xem danh sách học viên của lớp `F-62` | T2 phụ | ngăn trượt | Ngăn chi tiết lớp | Quản lý trung tâm, Lễ tân, Huấn luyện viên | UC-04, D4:105, D8:61-74 |
| Huỷ các buổi khi bể sự cố `F-53` | T3 hiếm | hộp thoại | Thanh công cụ | Lễ tân, Quản lý trung tâm | A-03, XD-04, M-03, D8:86-96 |
| Phân công HLV dạy thay `F-52` | T4 ngữ cảnh | ngăn trượt | tab Theo HLV | Quản lý trung tâm | A-02, D8:94 |

### Buổi học · `buoi-hoc` · `admin/buoi-hoc.html`

Vai: Quản lý trung tâm, Lễ tân · module Điểm danh và báo nghỉ · vào từ Lịch tuần (tìm và chọn một bản ghi)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Điểm danh buổi học `F-01` | T1 chính | tại chỗ | Điểm danh | Huấn luyện viên, Quản lý trung tâm | UC-05, M-04, YC-06, BR-DD-01, BR-DD-03, A-05, A-10, D4:111, D8:99-113 |
| Sửa điểm danh `F-02` | T4 ngữ cảnh | tại chỗ | Điểm danh | Huấn luyện viên, Quản lý trung tâm | BR-DD-05, UC-05, M-04, D8:114-115 |
| Xếp buổi học bù cho buổi vắng có phép `F-06` *suy* | T4 ngữ cảnh | ngăn trượt | Điểm danh | Lễ tân, Quản lý trung tâm | D8:104, D8:112 |

### Yêu cầu đổi lịch · `yeu-cau-doi-lich` · `admin/yeu-cau-doi-lich.html`

Vai: Quản lý trung tâm, Lễ tân · module Lịch và buổi học

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách yêu cầu đổi lịch `F-49` | T1 chính | tại chỗ | Danh sách yêu cầu | Lễ tân, Quản lý trung tâm | XD-02, D8:118-131 |
| Đổi một buổi học sang lớp khác `F-44` | T4 ngữ cảnh | ngăn trượt | Danh sách yêu cầu | Lễ tân | UC-08, BR-LI-02, XD-02, M-03 |
| Từ chối yêu cầu đổi lịch `F-50` | T4 ngữ cảnh | hộp thoại | Danh sách yêu cầu | Lễ tân | XD-02, D8:130-131 |

### Học viên · `hoc-vien` · `admin/hoc-vien.html`

Vai: Quản lý trung tâm, Lễ tân, Huấn luyện viên · module Học viên và phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tìm học viên `F-30` | T1 chính | tại chỗ | Tìm và lọc | Lễ tân, Quản lý trung tâm, Huấn luyện viên | YC-01, M-01, D4:151, D4:105 |
| Đăng ký học viên mới `F-32` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý trung tâm | UC-01, M-01, YC-01, BR-HV-01, BR-HV-02, BR-HV-04, S-03, YC-05 |
| Đặt buổi học thử `F-66` | T2 phụ | ngăn trượt | Thanh công cụ | Lễ tân | BR-LH-06, S-03, YC-05 |

### Hồ sơ học viên · `ho-so` · `admin/ho-so.html`

Vai: Quản lý trung tâm, Lễ tân, Huấn luyện viên · module Học viên và phụ huynh · vào từ Học viên (tìm và chọn một bản ghi) · tab: Gói học · Lịch và điểm danh · Đóng tiền · Phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem hồ sơ học viên `F-31` | T1 chính | tại chỗ | Đầu hồ sơ | Lễ tân, Quản lý trung tâm, Huấn luyện viên | M-01, D4:150, D4:105, BR-HV-03 |
| Xem các lần đóng tiền `F-11` | T2 phụ | tại chỗ | tab Đóng tiền | Phụ huynh, Lễ tân, Quản lý trung tâm | UC-06, UC-02, YC-11, M-05, M-06, D4:180, D4:271 |
| Xem gói học và số buổi còn lại `F-12` | T2 phụ | tại chỗ | tab Gói học | Phụ huynh, Lễ tân, Quản lý trung tâm | UC-06, UC-09, YC-11, M-06, D4:270, D4:339 |
| Sửa hồ sơ học viên `F-33` | T2 phụ | ngăn trượt | Đầu hồ sơ | Lễ tân, Quản lý trung tâm | D4:106, BR-HV-01, BR-HV-04, A-08 |
| Sửa hồ sơ phụ huynh `F-34` *suy* | T3 hiếm | ngăn trượt | tab Phụ huynh | Lễ tân, Quản lý trung tâm | YC-01, M-01, BR-HV-02, D8:11-17 |
| Chuyển học viên sang ngừng học `F-35` | T3 hiếm | hộp thoại | Đầu hồ sơ | Lễ tân, Quản lý trung tâm | BR-HV-05, D8:22 |

Lối tắt: Bán gói và thu tiền *(ngăn trượt)* · Bảo lưu gói *(hộp thoại)* · Xếp học viên vào lớp *(ngăn trượt)* · Chuyển học viên sang lớp khác *(ngăn trượt)* · Đổi một buổi học sang lớp khác *(ngăn trượt)* · Ghi báo nghỉ thay phụ huynh tại quầy *(hộp thoại)* · Xếp buổi học bù cho buổi vắng có phép *(ngăn trượt)*

### Lớp học · `lop` · `admin/lop.html`

Vai: Quản lý trung tâm, Lễ tân, Huấn luyện viên · module Khoá học và lớp

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách lớp và sĩ số `F-57` | T1 chính | tại chỗ | Bảng lớp | Quản lý trung tâm, Lễ tân | UC-04, YC-03, M-02 |
| Mở lớp `F-56` | T2 phụ | ngăn trượt | Thanh công cụ | Quản lý trung tâm | UC-03, BR-LH-02, BR-LI-01, YC-02, M-02, D8:51-59 |
| Tạo khoá học `F-55` | T3 hiếm | ngăn trượt | Thanh công cụ | Quản lý trung tâm | UC-03, BR-LH-01, BR-LH-05, XD-03, YC-02, M-02, D8:38-49 |
| Xếp học viên vào lớp `F-58` | T4 ngữ cảnh | ngăn trượt | Bảng lớp | Quản lý trung tâm, Lễ tân | UC-04, BR-LH-03, A-01, A-06, YC-03, M-02 |
| Cho phép xếp học viên xuống một bậc `F-59` *suy* | T4 ngữ cảnh | hộp thoại | Bảng lớp | Quản lý trung tâm | BR-LH-03 |
| Đưa học viên vào danh sách chờ `F-60` | T4 ngữ cảnh | hộp thoại | Bảng lớp | Quản lý trung tâm, Lễ tân | BR-LH-04, UC-04, M-02, D8:61-74 |

### Chi tiết lớp · `lop-chi-tiet` · `admin/lop-chi-tiet.html`

Vai: Quản lý trung tâm, Lễ tân, Huấn luyện viên · module Khoá học và lớp · vào từ Lớp học (tìm và chọn một bản ghi) · tab: Học viên · Danh sách chờ

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem danh sách học viên của lớp `F-62` | T1 chính | tại chỗ | tab Học viên | Quản lý trung tâm, Lễ tân, Huấn luyện viên | UC-04, D4:105, D8:61-74 |
| Gọi học viên từ danh sách chờ vào lớp `F-61` | T4 ngữ cảnh | hộp thoại | tab Danh sách chờ | Quản lý trung tâm, Lễ tân | BR-LH-04, M-02, D8:61-74 |
| Chuyển học viên sang lớp khác `F-63` | T4 ngữ cảnh | ngăn trượt | tab Học viên | Quản lý trung tâm, Lễ tân | UC-04, A-07, OQ-02, BR-LH-03, M-02, UC-08, BR-LI-02, M-03 |
| Cho học viên rời lớp `F-64` *suy* | T4 ngữ cảnh | hộp thoại | tab Học viên | Quản lý trung tâm, Lễ tân | D8:61-65, BR-LH-04 |
| Ghi nhận xét kỹ năng cuối cấp độ `F-69` **hoãn** | T4 ngữ cảnh | ngăn trượt | tab Học viên | Huấn luyện viên | S-04 |

Lối tắt: Xếp học viên vào lớp *(ngăn trượt)*

### Thu tiền · `thu-tien` · `admin/thu-tien.html`

Vai: Quản lý trung tâm, Lễ tân · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Bán gói và thu tiền `F-08` | T1 chính | ngăn trượt | Thanh công cụ | Lễ tân, Quản lý trung tâm | UC-02, M-05, BR-TT-01, BR-TT-02, BR-TT-03, YC-10, A-05, A-09, D4:153-181 |
| Đối chiếu khoản thu cuối ngày `F-10` *suy* | T2 phụ | tại chỗ | Đối chiếu cuối ngày | Lễ tân, Quản lý trung tâm | M-05, D5:29, D8:172-180 |
| Xác nhận tiền chuyển khoản đã về `F-09` | T4 ngữ cảnh | tại chỗ | Chờ xác nhận chuyển khoản | Lễ tân, Quản lý trung tâm | UC-02, M-05, D4:176 |
| Áp mã khuyến mãi khi bán gói `F-28` **hoãn** | T4 ngữ cảnh | tại chỗ | Thanh công cụ | Lễ tân, Quản lý trung tâm | CO-01, D5:38 |

### Gói học · `goi-hoc` · `admin/goi-hoc.html`

Vai: Quản lý trung tâm, Lễ tân · module Gói học và thu tiền · tab: Gói · Hoàn tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Lọc gói theo trạng thái `F-18` | T1 chính | tại chỗ | tab Gói | Quản lý trung tâm, Lễ tân | UC-09, M-07, D4:331, D8:145-151 |
| Xem danh sách đề nghị hoàn tiền `F-27` *suy* | T2 phụ | tại chỗ | tab Hoàn tiền | Quản lý trung tâm, Lễ tân | BR-TT-08, D8:189-194 |
| Bảo lưu gói `F-16` | T4 ngữ cảnh | hộp thoại | tab Gói | Lễ tân, Quản lý trung tâm | UC-09, M-07, BR-TT-05, YC-09, D4:326-347, D8:165-170 |
| Lập đề nghị hoàn tiền `F-24` | T4 ngữ cảnh | ngăn trượt | tab Gói | Lễ tân | BR-TT-08, A-08, D1:83, D8:189-205 |
| Duyệt đề nghị hoàn tiền `F-25` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Quản lý trung tâm | BR-TT-08, D1:83, D8:189-205 |
| Ghi ngày đã chi hoàn tiền `F-26` | T4 ngữ cảnh | hộp thoại | tab Hoàn tiền | Lễ tân | BR-TT-08, D1:83, D8:204 |

### Thông báo · `thong-bao` · `admin/thong-bao.html`

Vai: Quản lý trung tâm, Lễ tân · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Gửi thông báo cho phụ huynh `F-84` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý trung tâm, Lễ tân | UC-10, YC-12, M-09, BR-TB-01, BR-TB-03, D4:114, D8:209-222 |
| Xem thông báo đã gửi `F-91` *suy* | T2 phụ | tại chỗ | Đã gửi và đang hẹn giờ | Quản lý trung tâm, Lễ tân | UC-10, D8:209-222 |
| Huỷ thông báo đã hẹn giờ `F-92` *suy* | T4 ngữ cảnh | hộp thoại | Đã gửi và đang hẹn giờ | Quản lý trung tâm, Lễ tân | UC-10, BR-TB-01, D8:214 |

### Báo cáo · `bao-cao` · `admin/bao-cao.html`

Vai: Quản lý trung tâm, Lễ tân · module Báo cáo và quản trị · tab: Chuyên cần · Doanh thu

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem báo cáo chuyên cần `F-71` | T1 chính | tại chỗ | tab Chuyên cần | Quản lý trung tâm, Lễ tân | UC-11, S-01, YC-13, D4:115 |
| Xem báo cáo doanh thu `F-72` | T2 phụ | tại chỗ | tab Doanh thu | Quản lý trung tâm | UC-11, S-01, YC-13, BR-QT-03, D4:116 |
| Xuất báo cáo ra file Excel `F-73` | T3 hiếm | hộp thoại | Thanh công cụ | Quản lý trung tâm | D4:117, UC-11, S-01 |

### Nhân viên · `nhan-vien` · `admin/nhan-vien.html`

Vai: Quản lý trung tâm · module Báo cáo và quản trị

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Thêm tài khoản nhân viên `F-76` | T1 chính | ngăn trượt | Thanh công cụ | Quản lý trung tâm | UC-12, M-08, BR-QT-01, BR-QT-02, YC-14, D8:239-245 |
| Sửa tài khoản nhân viên `F-77` *suy* | T4 ngữ cảnh | ngăn trượt | Bảng nhân viên | Quản lý trung tâm | UC-12, M-08, D4:118 |
| Khoá tài khoản nhân viên nghỉ việc `F-78` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý trung tâm | UC-12, M-08, D4:411, D8:244 |
| Mở khoá tài khoản nhân viên `F-79` | T4 ngữ cảnh | hộp thoại | Bảng nhân viên | Quản lý trung tâm | UC-12, M-08, BR-QT-05, D4:412 |

### Cài đặt · `cai-dat` · `admin/cai-dat.html`

Vai: Quản lý trung tâm · module Báo cáo và quản trị · tab: Bảng giá · Ngày nghỉ lễ · Nhắc lịch · Khuyến mãi · Nhật ký thao tác

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Sửa bảng giá `F-21` | T3 hiếm | ngăn trượt | tab Bảng giá | Quản lý trung tâm | BR-TT-03, M-05, D7:98-106, D8:136-143 |
| Tạo mã khuyến mãi `F-29` **hoãn** *suy* | T3 hiếm | ngăn trượt | tab Khuyến mãi | Quản lý trung tâm | CO-01, D5:38 |
| Cập nhật danh sách ngày nghỉ lễ `F-40` *suy* | T3 hiếm | hộp thoại | tab Ngày nghỉ lễ | Quản lý trung tâm | BR-LI-04, D8:78-81 |
| Tra cứu nhật ký thao tác `F-83` | T3 hiếm | tại chỗ | tab Nhật ký thao tác | Quản lý trung tâm | BR-QT-04, M-08, D8:247-255 |
| Cấu hình nhắc lịch `F-86` | T3 hiếm | tại chỗ | tab Nhắc lịch | Quản lý trung tâm | BR-TB-02, M-09, D8:224-229 |

## App phụ huynh

### Đăng nhập · `app-dang-nhap` · `app/app-dang-nhap.html`

Vai: Phụ huynh · module Học viên và phụ huynh · màn vào (trước trang chủ)

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Đăng nhập app bằng số điện thoại `F-38` | T1 chính | trang | Số điện thoại và mã OTP | Phụ huynh | D8:14, BR-HV-02, M-06, UC-06, NF-05, D4:263, BR-QT-01 |

### Hôm nay · `app-hom-nay` · `app/app-hom-nay.html`

Vai: Phụ huynh · module Lịch và buổi học

- Dải **Con đang xem**: Chọn con đang xem trên app
- Dải **Buổi học sắp tới**: Xem lịch học của con · Báo nghỉ một buổi · Gửi yêu cầu đổi lịch
- Dải **Số buổi còn lại**: Xem gói học và số buổi còn lại

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và số buổi còn lại `F-12` | T2 phụ | tại chỗ | Số buổi còn lại | Phụ huynh, Lễ tân, Quản lý trung tâm | UC-06, UC-09, YC-11, M-06, D4:270, D4:339 |
| Chọn con đang xem trên app `F-37` | T2 phụ | tại chỗ | Con đang xem | Phụ huynh | BR-HV-03, M-06, UC-06, D4:28 |
| Xem lịch học của con `F-43` | T2 phụ | tại chỗ | Buổi học sắp tới | Phụ huynh | UC-06, M-06, D4:269, D4:275 |

Lối tắt: Báo nghỉ một buổi *(sheet)* · Gửi yêu cầu đổi lịch *(sheet)*

### Lịch học · `app-lich` · `app/app-lich.html`

Vai: Phụ huynh · module Lịch và buổi học · tab: Sắp tới · Đã học · Yêu cầu đổi lịch

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem lịch học của con `F-43` | T1 chính | tại chỗ | tab Sắp tới | Phụ huynh | UC-06, M-06, D4:269, D4:275 |
| Xem các buổi đã học của con `F-07` | T2 phụ | tại chỗ | tab Đã học | Phụ huynh | UC-05, M-06, D4:233 |
| Xem trạng thái yêu cầu đổi lịch `F-48` | T2 phụ | tại chỗ | tab Yêu cầu đổi lịch | Phụ huynh | XD-02, M-06 |
| Xem đánh giá tiến bộ của con `F-70` **hoãn** | T2 phụ | tại chỗ | tab Đã học | Phụ huynh | S-04 |
| Báo nghỉ một buổi `F-04` | T4 ngữ cảnh | sheet | tab Sắp tới | Phụ huynh | UC-07, M-06, YC-08, BR-DD-03, BR-DD-04, XD-01, A-04 |
| Gửi yêu cầu đổi lịch `F-47` | T4 ngữ cảnh | sheet | tab Sắp tới | Phụ huynh | XD-02, YC-07, M-06, D8:124-132 |

### Gói học · `app-goi` · `app/app-goi.html`

Vai: Phụ huynh · module Gói học và thu tiền

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem gói học và số buổi còn lại `F-12` | T1 chính | tại chỗ | Gói đang dùng | Phụ huynh, Lễ tân, Quản lý trung tâm | UC-06, UC-09, YC-11, M-06, D4:270, D4:339 |
| Xem các lần đóng tiền `F-11` | T2 phụ | tại chỗ | Các lần đóng tiền | Phụ huynh, Lễ tân, Quản lý trung tâm | UC-06, UC-02, YC-11, M-05, M-06, D4:180, D4:271 |

### Thông báo · `app-thong-bao` · `app/app-thong-bao.html`

Vai: Phụ huynh · module Thông báo

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Xem thông báo trên app `F-87` | T1 chính | tại chỗ | Thông báo đã nhận | Phụ huynh | UC-10, M-06, M-09, D4:356, D8:218-222 |

### Tài khoản · `app-tai-khoan` · `app/app-tai-khoan.html`

Vai: Phụ huynh · module Học viên và phụ huynh

| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |
|---|---|---|---|---|---|
| Tắt nhận thông báo trên app `F-89` *suy* | T2 phụ | tại chỗ | Cài đặt thông báo | Phụ huynh | BR-TB-04, M-09 |

## Hành trình theo vai

- **Lễ tân · Bé mới tới đăng ký học:** Đăng ký học viên mới → Xếp học viên vào lớp → Bán gói và thu tiền → Xác nhận tiền chuyển khoản đã về
- **Lễ tân · Phụ huynh xin đổi buổi trên app:** Xem danh sách yêu cầu đổi lịch → Đổi một buổi học sang lớp khác
- **Lễ tân · Mời gia hạn bé sắp hết buổi:** Xem danh sách học viên sắp hết buổi → Ghi kết quả cuộc gọi mời gia hạn → Bán gói và thu tiền
- **Quản lý trung tâm · HLV báo nghỉ đột xuất:** Xem lịch dạy của HLV → Phân công HLV dạy thay
- **Quản lý trung tâm · Bể có sự cố:** Huỷ các buổi khi bể sự cố → Xem thông báo trên web quản trị
- **Quản lý trung tâm · Cuối tháng xem kết quả:** Xem báo cáo chuyên cần → Xem báo cáo doanh thu → Xuất báo cáo ra file Excel
- **Huấn luyện viên · Dạy một ca ở bể:** Xem lịch dạy của HLV → Điểm danh buổi học → Sửa điểm danh
- **Huấn luyện viên · Bé học thử:** Điểm danh buổi học → Ghi cấp độ gợi ý sau buổi học thử
- **Phụ huynh · Bé ốm, báo nghỉ:** Chọn con đang xem trên app → Xem lịch học của con → Báo nghỉ một buổi
- **Phụ huynh · Xem con còn bao nhiêu buổi:** Chọn con đang xem trên app → Xem gói học và số buổi còn lại → Xem các lần đóng tiền
- **Phụ huynh · Xin đổi lịch:** Xem lịch học của con → Gửi yêu cầu đổi lịch → Xem trạng thái yêu cầu đổi lịch

## Việc bấm thử ở Cổng Bản đồ

| # | Vai | Việc | Chức năng | Số bước |
|---|---|---|---|---|
| 1 | Lễ tân | Một người mẹ dẫn bé gái 6 tuổi tới quầy, muốn cho bé theo học từ tuần sau. | Đăng ký học viên mới `F-32` | 1 · ≈ 2,7 giây |
| 2 | Lễ tân | Bố của một bé gọi điện: chiều nay bé sốt, không tới bể được. | Ghi báo nghỉ thay phụ huynh tại quầy `F-05` | 1 · ≈ 2,7 giây |
| 3 | Lễ tân | Một phụ huynh nhắn đã trả tiền gói học qua ngân hàng sáng nay, nhờ quầy kiểm tra giúp. | Xác nhận tiền chuyển khoản đã về `F-09` | 1 · ≈ 2,7 giây |
| 4 | Lễ tân | Trên app, một phụ huynh xin cho con học thứ Bảy thay cho thứ Năm tuần này. | Đổi một buổi học sang lớp khác `F-44` | 1 · ≈ 2,7 giây |
| 5 | Lễ tân | Hết ca chiều, bạn cần biết hôm nay quầy nhận bao nhiêu tiền mặt để bàn giao cho ca sau. | Đối chiếu khoản thu cuối ngày `F-10` | 2 · ≈ 5,4 giây |
| 6 | Huấn luyện viên | Lớp 17 giờ ở làn 3 vừa xuống nước; bạn cần ghi lại bé nào tới, bé nào không. | Điểm danh buổi học `F-01` | 1 · ≈ 2,7 giây |
| 7 | Quản lý trung tâm | Một HLV nhắn sáng nay bị ốm, chiều nay người đó có ba lớp. | Phân công HLV dạy thay `F-52` | 1 · ≈ 2,7 giây |
| 8 | Quản lý trung tâm | Chủ trung tâm hỏi tháng 9 trung tâm thu được bao nhiêu tiền. | Xem báo cáo doanh thu `F-72` | 1 · ≈ 2,7 giây |
| 9 | Phụ huynh | Con bạn bị ho, bạn muốn cho trung tâm biết thứ Năm này bé không đi học. | Báo nghỉ một buổi `F-04` | 1 · ≈ 2,7 giây |
| 10 | Phụ huynh | Bạn muốn biết con còn mấy buổi nữa thì phải đóng tiền tiếp. | Xem gói học và số buổi còn lại `F-12` | 1 · ≈ 2,7 giây |

## Module và thứ tự dựng

| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |
|---|---|---|---|---|
| Học viên và phụ huynh `hoc-vien` | — | 9 | 0 |  |
| Khoá học và lớp `lop-hoc` | hoc-vien | 16 | 2 |  |
| Gói học và thu tiền `goi-hoc` | hoc-vien, lop-hoc | 19 | 2 |  |
| Lịch và buổi học `lich-hoc` | lop-hoc, goi-hoc | 14 | 0 |  |
| Điểm danh và báo nghỉ `diem-danh` | lich-hoc, goi-hoc | 7 | 0 |  |
| Thông báo `thong-bao` | hoc-vien, lich-hoc | 10 | 1 |  |
| Báo cáo và quản trị `quan-tri` | diem-danh, goi-hoc | 12 | 0 |  |

## Hoãn (5)

Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.

- Áp mã khuyến mãi khi bán gói `F-28` · Thu tiền
- Tạo mã khuyến mãi `F-29` · Cài đặt
- Ghi nhận xét kỹ năng cuối cấp độ `F-69` · Chi tiết lớp
- Xem đánh giá tiến bộ của con `F-70` · Lịch học
- Gửi SMS cho phụ huynh chưa cài app `F-93` · 

## Chức năng suy ra, người dùng xác nhận ở cổng (20)

- Ghi báo nghỉ thay phụ huynh tại quầy `F-05`: Phụ huynh gọi điện hay nói ở quầy: lễ tân chọn bé, chọn buổi, ghi báo nghỉ theo cùng luật 2 giờ và 3 lần mỗi gói như trên app.
- Xếp buổi học bù cho buổi vắng có phép `F-06`: Chọn buổi vắng có phép của bé, xếp vào một buổi ở lớp cùng cấp độ; khi bé học buổi bù, buổi vắng chuyển sang đã học bù.
- Đối chiếu khoản thu cuối ngày `F-10`: Danh sách khoản thu trong ngày: giờ thu, người thu, tiền mặt hay chuyển khoản, mã biên lai, tổng theo hình thức, để đối chiếu tiền quầy cuối ngày.
- Xem danh sách đề nghị hoàn tiền `F-27`: Danh sách đề nghị lọc theo trạng thái: chờ duyệt, đã duyệt, từ chối, đã chi. Quản lý tìm đề nghị chờ duyệt; lễ tân tìm đề nghị đã duyệt để ghi ngày chi.
- Tạo mã khuyến mãi `F-29`: GĐ2. Tạo mã, mức giảm, thời gian dùng được. Suy từ CO-01: mã phải có người tạo; vai Quản lý theo cách bảng giá do Quản lý sửa.
- Sửa hồ sơ phụ huynh `F-34`: Sửa họ tên, SĐT, quan hệ với học viên. SĐT là duy nhất và là tài khoản đăng nhập app; đổi SĐT thì phụ huynh đăng nhập bằng số mới.
- Chuyển học viên sang đang học khi mua gói `F-36`: Học viên học thử hoặc đã ngừng học được bán gói thì hệ thống chuyển sang đang học; học lại vẫn giữ mã và lịch sử cũ.
- Cập nhật danh sách ngày nghỉ lễ `F-40`: Thêm, sửa, xoá ngày nghỉ lễ của trung tâm (ngày, tên lễ). Ngày trong danh sách không sinh buổi; buổi rơi vào ngày đó dời sang tuần sau.
- Đánh dấu buổi đã diễn ra `F-54`: Buổi dự kiến thành đã diễn ra sau giờ học. Bước chuyển chỉ có trong schema, không use case nào làm.
- Cho phép xếp học viên xuống một bậc `F-59`: Xếp bé vào lớp thấp hơn cấp độ của bé một bậc chỉ khi Quản lý cho phép; ngoài trường hợp đó chỉ xếp đúng cấp độ.
- Cho học viên rời lớp `F-64`: Bé nghỉ hẳn hay hết gói không gia hạn: xếp lớp chuyển sang đã rời, lớp có thêm chỗ trống cho danh sách chờ.
- Đề xuất học viên lên cấp độ `F-65`: HLV đề xuất bé lên cấp độ cao hơn khi gói còn buổi; lễ tân chuyển bé sang lớp cấp mới, giữ số buổi còn lại.
- Tự gỡ hồ sơ học thử quá 60 ngày `F-68`: Bé học thử không mua gói: hồ sơ học thử giữ 60 ngày, quá hạn hệ thống tự gỡ.
- Sửa tài khoản nhân viên `F-77`: Đổi họ tên, số điện thoại, vai, và lớp phụ trách của HLV khi phân công thay đổi. UC-12 chỉ có thêm, khoá, mở khoá; suy từ "quản lý tài khoản và phân quyền".
- Tự khoá tài khoản khi nhập sai mật khẩu 5 lần `F-80`: Nhân viên nhập sai mật khẩu 5 lần liền thì hệ thống khoá tài khoản; chỉ Quản lý mở khoá được.
- Đổi mật khẩu `F-81`: Nhân viên đổi mật khẩu tạm nhận qua SMS sang mật khẩu riêng, tối thiểu 8 ký tự (BR-QT-05). Suy từ "mật khẩu tạm"; tài liệu không có bước này.
- Tắt nhận thông báo trên app `F-89`: Phụ huynh tắt được thông báo thường trên app; thông báo khẩn (huỷ buổi) luôn nhận, không tắt được.
- Xem thông báo trên web quản trị `F-90`: Quản lý nhận báo ngay khi lễ tân huỷ buổi vì sự cố (theo XD-04) và khi yêu cầu đổi lịch quá 24 giờ chưa xử lý (theo XD-02).
- Xem thông báo đã gửi `F-91`: Danh sách thông báo đã gửi và đang hẹn giờ: tiêu đề, người nhận, người gửi, giờ gửi, khẩn hay không, số phụ huynh đã đọc.
- Huỷ thông báo đã hẹn giờ `F-92`: Thông báo hẹn giờ chưa tới giờ gửi thì người gửi huỷ được trước khi hệ thống gửi đi.

## Hệ thống tự làm

- Chốt điểm danh cuối ngày `F-03`: 23:00 hằng ngày hệ thống ghi vắng không phép cho bé chưa có trạng thái trong các buổi đã qua, trừ một buổi (BR-DD-03). HLV vẫn sửa được trong 24 giờ sau buổi (BR-DD-05).
- Tự kết thúc bảo lưu `F-17`: Hết số ngày bảo lưu: gói về đang dùng, hệ thống sinh lại buổi theo lịch cũ. Lớp cũ đã đủ sĩ số thì lễ tân xếp lớp khác (nhánh 4a, UC-04).
- Tự khoá gói hết buổi hoặc hết hạn `F-19`: Hạn dùng (2, 3, 6 tháng) tính từ buổi học đầu tiên của gói. Dùng hết buổi hay quá hạn: gói sang hết buổi hay hết hạn, học viên không vào lớp được tới khi mua gói mới; có gói nối tiếp thì gói đó bắt đầu.
- Tự cộng bù buổi khi trung tâm huỷ buổi `F-20`: Buổi do trung tâm huỷ (bể sự cố, HLV không có người thay) không trừ buổi, và gói được cộng thêm một buổi. Chạy khi buổi bị huỷ với lý do từ phía trung tâm, kể cả huỷ hàng loạt.
- Chuyển học viên sang đang học khi mua gói `F-36`: Học viên học thử hoặc đã ngừng học được bán gói thì hệ thống chuyển sang đang học; học lại vẫn giữ mã và lịch sử cũ.
- Sinh buổi học tự động `F-39`: Hệ thống sinh buổi theo khung giờ của lớp, từ ngày khai giảng tới hết đợt, trạng thái dự kiến. Ngày trong danh sách nghỉ lễ không sinh buổi; buổi rơi vào ngày lễ dời sang tuần sau.
- Báo quản lý yêu cầu đổi lịch quá 24 giờ `F-51`: Yêu cầu đổi lịch còn chờ xử lý quá 24 giờ thì hệ thống báo quản lý.
- Đánh dấu buổi đã diễn ra `F-54`: Buổi dự kiến thành đã diễn ra sau giờ học. Bước chuyển chỉ có trong schema, không use case nào làm.
- Tự gỡ hồ sơ học thử quá 60 ngày `F-68`: Bé học thử không mua gói: hồ sơ học thử giữ 60 ngày, quá hạn hệ thống tự gỡ.
- Tự khoá tài khoản khi nhập sai mật khẩu 5 lần `F-80`: Nhân viên nhập sai mật khẩu 5 lần liền thì hệ thống khoá tài khoản; chỉ Quản lý mở khoá được.
- Ghi nhật ký thao tác `F-82`: Hệ thống tự ghi mỗi lần sửa điểm danh, duyệt hoàn tiền, tạm dừng gói, xoá học viên khỏi lớp: nhân viên nào, lúc nào, đối tượng, giá trị trước và sau.
- Nhắc lịch học cho phụ huynh `F-85`: Hệ thống tự gửi tin nhắc qua app cho phụ huynh trước giờ học (mặc định 120 phút), theo nội dung mẫu, chỉ khi Quản lý đang bật nhắc lịch.
- Gửi thông báo khẩn khi huỷ buổi `F-88`: Khi buổi bị huỷ (từng buổi hay hàng loạt khi bể sự cố) hay có HLV dạy thay, hệ thống gửi ngay cho phụ huynh của các buổi đó, không theo khung 7:00–21:00; tin dạy thay ghi tên HLV thay.
- Gửi SMS cho phụ huynh chưa cài app `F-93`: Thông báo gửi thêm qua SMS cho phụ huynh chưa dùng app (khoảng 15 % phụ huynh lớn tuổi); GĐ2.
