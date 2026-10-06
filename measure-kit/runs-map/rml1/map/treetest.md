# Bài thử tìm (soát nhãn)

Bạn là người dùng phần mềm này lần đầu: chưa được hướng dẫn, quen làm trên giấy, Excel và Zalo. Bên dưới là cây điều hướng: chỉ có nhãn,
đúng như trên màn hình. "→" nghĩa là bấm vào thì sang màn khác; "(bấm một dòng)" là bấm một dòng của danh sách.

Với mỗi việc: bắt đầu từ menu của đúng vai ghi ở việc. Chọn như người dùng thật: nhìn các nhãn ở mức đang thấy, chọn một, rồi mới nhìn
mức bên dưới; đừng dò cả cây tìm chữ giống câu việc. Mở ra thấy sai chỗ thì ghi "quay lại" rồi đi nhánh khác. Dừng ở nút bạn sẽ bấm.
Không tìm được thì ghi "bỏ cuộc". Không đọc file nào khác.

Trả về đúng các dòng này, mỗi việc một dòng, không viết gì khác:
`T1 · <nhãn> › <nhãn> › … › <nút dừng> · quay lại <số lần> · chắc cao|vừa|thấp`

## Cây

## Web quản trị · vai Lễ tân
- Nhóm Hằng ngày
  - [A1] Quầy hôm nay
    - [A1.1] Việc ở quầy
      - [A1.1.1] Nút: Tìm học viên
      - [A1.1.2] Nút: Đăng ký học viên mới
      - [A1.1.3] Nút: Bán gói học và thu tiền
      - [A1.1.4] Nút: Báo nghỉ thay phụ huynh tại quầy
    - [A1.2] Yêu cầu đổi lịch chờ xử lý
      - [A1.2.1] Nút: Xem yêu cầu đổi lịch chờ xử lý
      - [A1.2.2] Trên dòng: Đổi lịch một buổi học
      - [A1.2.3] Trên dòng: Từ chối yêu cầu đổi lịch
    - [A1.3] Chờ xác nhận chuyển khoản
      - [A1.3.1] Nút: Xác nhận tiền chuyển khoản đã về
    - [A1.4] Sắp hết buổi, cần gọi
      - [A1.4.1] Nút: Xem danh sách học viên sắp hết buổi
      - [A1.4.2] Trên dòng: Ghi kết quả cuộc gọi mời gia hạn
    - [A1.5] Cuối ngày
      - [A1.5.1] Nút: Đối chiếu khoản thu trong ngày
  - [A2] Lịch tuần
    - [A2.1] Thanh công cụ
      - [A2.1.1] Menu …: Huỷ hàng loạt buổi học khi bể sự cố
    - [A2.2] Ngăn chi tiết lớp
      - [A2.2.1] Trên dòng: Xếp buổi học bù cho buổi vắng có phép
    - [A2.3] Tab Theo làn
      - [A2.3.1] Nút chính: Xem lịch toàn trung tâm
    - [A2.4] Tab Theo HLV
      - [A2.4.1] Nút: Xem lịch dạy
    - [A2.5] Nút: Xem danh sách học viên của lớp
  - [A3] Học viên
    - [A3.1] Thanh công cụ
      - [A3.1.1] Nút chính: Đăng ký học viên mới
      - [A3.1.2] Nút: Đặt buổi học thử
    - [A3.2] Tìm và lọc
      - [A3.2.1] Nút: Tìm học viên
    - [A3.3] Bảng học viên
      - [A3.3.1] Trên dòng: Chuyển bé học thử thành học viên chính thức
    - [A3.4] (bấm một dòng) → Hồ sơ học viên
      - [A3.4.1] Đầu hồ sơ
        - [A3.4.1.1] Nút: Xem hồ sơ học viên
        - [A3.4.1.2] Nút: Sửa hồ sơ học viên
        - [A3.4.1.3] Menu …: Sửa hồ sơ phụ huynh
        - [A3.4.1.4] Menu …: Chuyển học viên sang ngừng học
      - [A3.4.2] Tab Gói và thu tiền
        - [A3.4.2.1] Nút: Xem gói học và các lần đóng tiền của học viên
      - [A3.4.3] Tab Lịch và điểm danh
        - [A3.4.3.1] Trên dòng: Báo nghỉ thay phụ huynh tại quầy
      - [A3.4.4] Nút: Bán gói học và thu tiền
      - [A3.4.5] Nút: Xếp học viên vào lớp
      - [A3.4.6] Nút: Đổi lịch một buổi học
      - [A3.4.7] Nút: Chuyển học viên sang lớp khác
      - [A3.4.8] Nút: Bảo lưu gói học
      - [A3.4.9] Nút: Xếp buổi học bù cho buổi vắng có phép
      - [A3.4.10] Nút: Lập đề nghị hoàn tiền
  - [A4] Lớp
    - [A4.1] Bảng lớp
      - [A4.1.1] Nút: Xem danh sách lớp
    - [A4.2] (bấm một dòng) → Chi tiết lớp
      - [A4.2.1] Đầu lớp
        - [A4.2.1.1] Nút chính: Xếp học viên vào lớp
      - [A4.2.2] Học viên trong lớp
        - [A4.2.2.1] Trên dòng: Chuyển học viên lên cấp độ cao hơn
        - [A4.2.2.2] Nút: Xem danh sách học viên của lớp
        - [A4.2.2.3] Trên dòng: Chuyển học viên sang lớp khác
      - [A4.2.3] Danh sách chờ
        - [A4.2.3.1] Trên dòng: Đưa học viên vào danh sách chờ
        - [A4.2.3.2] Trên dòng: Gọi phụ huynh theo danh sách chờ
      - [A4.2.4] Nút: Xem hồ sơ học viên
- Nhóm Tiền
  - [A5] Gói và thu tiền
    - [A5.1] Thanh công cụ
      - [A5.1.1] Nút chính: Bán gói học và thu tiền
      - [A5.1.2] Trên dòng: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
    - [A5.2] Tab Gói học
      - [A5.2.1] Trên dòng: Xác nhận tiền chuyển khoản đã về
      - [A5.2.2] Nút: Xem danh sách gói học theo trạng thái
      - [A5.2.3] Trên dòng: Bảo lưu gói học
    - [A5.3] Tab Khoản thu hôm nay
      - [A5.3.1] Nút: Đối chiếu khoản thu trong ngày
  - [A6] Hoàn tiền
    - [A6.1] Thanh công cụ
      - [A6.1.1] Nút: Lập đề nghị hoàn tiền
    - [A6.2] Đề nghị hoàn tiền
      - [A6.2.1] Trên dòng: Ghi ngày đã chi tiền hoàn
      - [A6.2.2] Nút: Theo dõi đề nghị hoàn tiền
- Nhóm Liên lạc và báo cáo
  - [A7] Thông báo
    - [A7.1] Thanh công cụ
      - [A7.1.1] Nút chính: Gửi thông báo cho phụ huynh
    - [A7.2] Thông báo đã gửi
      - [A7.2.1] Nút: Xem thông báo đã gửi
  - [A8] Báo cáo
    - [A8.1] Tab Chuyên cần
      - [A8.1.1] Nút: Xem báo cáo chuyên cần
    - [A8.2] Tab Doanh thu
- Nhóm Cá nhân
  - [A9] Tài khoản của tôi
    - [A9.1] Mật khẩu
      - [A9.1.1] Nút: Đổi mật khẩu

## Web quản trị · vai Quản lý
- Nhóm Hằng ngày
  - [B1] Tổng quan
    - [B1.1] Cần duyệt
      - [B1.1.1] Nút: Duyệt xếp học viên xuống lớp thấp hơn một bậc
      - [B1.1.2] Nút: Duyệt đề nghị hoàn tiền
    - [B1.2] Báo nội bộ
      - [B1.2.1] Nút: Xem thông báo nội bộ
      - [B1.2.2] Nút: Phân công HLV dạy thay
    - [B1.3] Tháng này
      - [B1.3.1] Nút: Xem báo cáo doanh thu
      - [B1.3.2] Nút: Xem báo cáo chuyên cần
    - [B1.4] Lớp đông, nhiều bé chờ
      - [B1.4.1] Nút: Mở lớp
  - [B2] Lịch tuần
    - [B2.1] Thanh công cụ
      - [B2.1.1] Menu …: Huỷ hàng loạt buổi học khi bể sự cố
    - [B2.2] Ngăn chi tiết lớp
      - [B2.2.1] Trên dòng: Xếp buổi học bù cho buổi vắng có phép
      - [B2.2.2] Trên dòng: Phân công HLV dạy thay
      - [B2.2.3] Trên dòng: Huỷ buổi học khi không có người dạy thay
    - [B2.3] Tab Theo làn
      - [B2.3.1] Nút chính: Xem lịch toàn trung tâm
    - [B2.4] Tab Theo HLV
      - [B2.4.1] Nút: Xem lịch dạy
    - [B2.5] Nút: Xem danh sách học viên của lớp
    - [B2.6] Nút: Điểm danh buổi học
    - [B2.7] Nút: Sửa điểm danh đã lưu
  - [B3] Học viên
    - [B3.1] Thanh công cụ
      - [B3.1.1] Nút chính: Đăng ký học viên mới
    - [B3.2] Tìm và lọc
      - [B3.2.1] Nút: Tìm học viên
    - [B3.3] (bấm một dòng) → Hồ sơ học viên
      - [B3.3.1] Đầu hồ sơ
        - [B3.3.1.1] Nút: Xem hồ sơ học viên
        - [B3.3.1.2] Nút: Sửa hồ sơ học viên
        - [B3.3.1.3] Menu …: Sửa hồ sơ phụ huynh
        - [B3.3.1.4] Menu …: Chuyển học viên sang ngừng học
      - [B3.3.2] Tab Gói và thu tiền
        - [B3.3.2.1] Nút: Xem gói học và các lần đóng tiền của học viên
      - [B3.3.3] Tab Lịch và điểm danh
      - [B3.3.4] Nút: Bán gói học và thu tiền
      - [B3.3.5] Nút: Xếp học viên vào lớp
      - [B3.3.6] Nút: Chuyển học viên sang lớp khác
      - [B3.3.7] Nút: Bảo lưu gói học
      - [B3.3.8] Nút: Xếp buổi học bù cho buổi vắng có phép
  - [B4] Lớp
    - [B4.1] Thanh công cụ
      - [B4.1.1] Menu …: Tạo khoá học
      - [B4.1.2] Nút chính: Mở lớp
    - [B4.2] Bảng lớp
      - [B4.2.1] Nút: Xem danh sách lớp
    - [B4.3] (bấm một dòng) → Chi tiết lớp
      - [B4.3.1] Đầu lớp
        - [B4.3.1.1] Nút chính: Xếp học viên vào lớp
      - [B4.3.2] Học viên trong lớp
        - [B4.3.2.1] Nút: Xem danh sách học viên của lớp
        - [B4.3.2.2] Trên dòng: Chuyển học viên sang lớp khác
      - [B4.3.3] Danh sách chờ
        - [B4.3.3.1] Trên dòng: Đưa học viên vào danh sách chờ
        - [B4.3.3.2] Trên dòng: Gọi phụ huynh theo danh sách chờ
      - [B4.3.4] Nút: Xem hồ sơ học viên
- Nhóm Tiền
  - [B5] Gói và thu tiền
    - [B5.1] Thanh công cụ
      - [B5.1.1] Nút chính: Bán gói học và thu tiền
      - [B5.1.2] Trên dòng: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
    - [B5.2] Tab Gói học
      - [B5.2.1] Trên dòng: Xác nhận tiền chuyển khoản đã về
      - [B5.2.2] Nút: Xem danh sách gói học theo trạng thái
      - [B5.2.3] Trên dòng: Bảo lưu gói học
    - [B5.3] Tab Khoản thu hôm nay
      - [B5.3.1] Nút: Đối chiếu khoản thu trong ngày
  - [B6] Hoàn tiền
    - [B6.1] Đề nghị hoàn tiền
      - [B6.1.1] Trên dòng: Duyệt đề nghị hoàn tiền
      - [B6.1.2] Nút: Theo dõi đề nghị hoàn tiền
- Nhóm Liên lạc và báo cáo
  - [B7] Thông báo
    - [B7.1] Thanh công cụ
      - [B7.1.1] Nút chính: Gửi thông báo cho phụ huynh
    - [B7.2] Thông báo đã gửi
      - [B7.2.1] Nút: Xem thông báo đã gửi
  - [B8] Báo cáo
    - [B8.1] Thanh công cụ
      - [B8.1.1] Nút: Xuất báo cáo ra file Excel
    - [B8.2] Tab Chuyên cần
      - [B8.2.1] Nút: Xem báo cáo chuyên cần
    - [B8.3] Tab Doanh thu
      - [B8.3.1] Nút: Xem báo cáo doanh thu
- Nhóm Quản trị
  - [B9] Nhân viên
    - [B9.1] Thanh công cụ
      - [B9.1.1] Nút chính: Thêm tài khoản nhân viên
    - [B9.2] Bảng nhân viên
      - [B9.2.1] Trên dòng: Sửa thông tin và lớp phụ trách của nhân viên
      - [B9.2.2] Trên dòng: Khoá tài khoản nhân viên
      - [B9.2.3] Trên dòng: Mở khoá tài khoản nhân viên
  - [B10] Nhật ký thao tác
    - [B10.1] Tìm và lọc
      - [B10.1.1] Nút: Tra cứu nhật ký thao tác
  - [B11] Cài đặt
    - [B11.1] Tab Bảng giá
      - [B11.1.1] Nút: Cấu hình bảng giá gói học
    - [B11.2] Tab Ngày nghỉ lễ
      - [B11.2.1] Nút: Quản lý danh sách ngày nghỉ lễ
    - [B11.3] Tab Nhắc lịch
      - [B11.3.1] Nút: Cấu hình nhắc lịch
  - [B12] Tài khoản của tôi
    - [B12.1] Mật khẩu
      - [B12.1.1] Nút: Đổi mật khẩu

## Web quản trị · vai Huấn luyện viên
- [C1] Buổi dạy hôm nay
  - [C1.1] Buổi đang dạy
    - [C1.1.1] Nút chính: Điểm danh buổi học
  - [C1.2] Các buổi còn lại hôm nay
    - [C1.2.1] Nút: Xem lịch dạy
  - [C1.3] Học thử cần ghi cấp độ
    - [C1.3.1] Nút: Ghi cấp độ gợi ý sau buổi học thử
- [C2] Lịch dạy của tôi
  - [C2.1] Tuần của tôi
    - [C2.1.1] Trên dòng: Sửa điểm danh đã lưu
    - [C2.1.2] Nút chính: Xem lịch dạy
- [C3] Lớp
  - [C3.1] (bấm một dòng) → Chi tiết lớp
    - [C3.1.1] Học viên trong lớp
      - [C3.1.1.1] Nút: Xem danh sách học viên của lớp
    - [C3.1.2] Nút: Xem hồ sơ học viên
- [C4] Học viên
  - [C4.1] Tìm và lọc
    - [C4.1.1] Nút: Tìm học viên
  - [C4.2] Bảng học viên
    - [C4.2.1] Trên dòng: Ghi nhận xét tiến bộ cuối cấp độ (giai đoạn sau)
  - [C4.3] (bấm một dòng) → Hồ sơ học viên
    - [C4.3.1] Đầu hồ sơ
      - [C4.3.1.1] Nút: Xem hồ sơ học viên
    - [C4.3.2] Tab Gói và thu tiền
    - [C4.3.3] Tab Lịch và điểm danh
- [C5] Tài khoản của tôi
  - [C5.1] Mật khẩu
    - [C5.1.1] Nút: Đổi mật khẩu

## App phụ huynh · vai Phụ huynh
- [D1] Lịch học
  - [D1.1] Con đang xem
    - [D1.1.1] Nút: Chọn con đang xem trên app
  - [D1.2] Buổi sắp tới
    - [D1.2.1] Nút chính: Xem lịch học của con
    - [D1.2.2] Trên dòng: Báo nghỉ một buổi học
    - [D1.2.3] Trên dòng: Gửi yêu cầu đổi lịch
  - [D1.3] Số buổi còn lại
    - [D1.3.1] Nút: Xem gói học và số buổi còn lại trên app
  - [D1.4] Yêu cầu đổi lịch
    - [D1.4.1] Nút: Theo dõi yêu cầu đổi lịch
- [D2] Buổi và gói
  - [D2.1] Gói đang dùng
    - [D2.1.1] Nút chính: Xem gói học và số buổi còn lại trên app
  - [D2.2] Buổi đã học
    - [D2.2.1] Nút: Xem các buổi đã học của con
  - [D2.3] Lịch sử đóng tiền
    - [D2.3.1] Nút: Xem lịch sử đóng tiền trên app
- [D3] Thông báo
  - [D3.1] Hộp thông báo
    - [D3.1.1] Nút chính: Đọc thông báo trong app
- [D4] Tài khoản
  - [D4.1] Con của tôi
    - [D4.1.1] Nút: Xem nhận xét tiến bộ trên app (giai đoạn sau)
  - [D4.2] Cài đặt thông báo
    - [D4.2.1] Nút: Cài đặt nhận thông báo

## Việc

T1 · vai Lễ tân · Một phụ huynh dắt bé 6 tuổi tới quầy, muốn cho bé học bơi; trung tâm chưa có thông tin gì về bé.
T2 · vai Lễ tân · Mẹ bé Minh Anh tới quầy, muốn đóng tiền cho 12 buổi tiếp theo.
T3 · vai Lễ tân · Sáng nay có phụ huynh nhắn qua app xin cho con học lớp tối thứ Sáu thay cho lớp thứ Năm; xử lý tin đó.
T4 · vai Lễ tân · Một phụ huynh gọi điện: bé bị sốt, chiều nay không tới được.
T5 · vai Lễ tân · Kế toán nhắn: tài khoản ngân hàng của trung tâm vừa nhận 1.380.000 ₫ của mẹ bé An.
T6 · vai Huấn luyện viên · Lớp 17:00 vừa xuống nước; ghi lại bé nào tới, bé nào không.
T7 · vai Quản lý · Cuối tháng, chủ trung tâm muốn biết tháng này thu được bao nhiêu.
T8 · vai Quản lý · Bể nhỏ hỏng máy lọc, mọi lớp chiều nay phải nghỉ.
T9 · vai Phụ huynh · Bé nhà bạn bị cảm; bạn muốn trung tâm biết thứ Năm này bé không tới.
T10 · vai Phụ huynh · Bạn muốn biết với số tiền đã đóng, con còn học được mấy lần nữa.
