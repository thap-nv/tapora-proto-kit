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
- [A1] Hôm nay
  - [A1.1] Cần xử lý hôm nay
    - [A1.1.1] Nút: Xử lý yêu cầu đổi lịch của phụ huynh
    - [A1.1.2] Nút: Xem danh sách cần gọi mời gia hạn
  - [A1.2] Việc nhanh
    - [A1.2.1] Nút chính: Bán gói học và thu tiền
    - [A1.2.2] Nút: Tìm học viên
    - [A1.2.3] Nút: Đăng ký học viên mới
    - [A1.2.4] Nút: Xếp học viên vào lớp
- Nhóm Học viên và lớp
  - [A2] Học viên
    - [A2.1] Tìm và lọc
      - [A2.1.1] Nút chính: Tìm học viên
    - [A2.2] Công cụ
      - [A2.2.1] Nút: Đăng ký học viên mới
      - [A2.2.2] Nút: Đặt buổi học thử
    - [A2.3] (bấm một dòng) → Hồ sơ học viên
      - [A2.3.1] Đầu hồ sơ
        - [A2.3.1.1] Xem hồ sơ học viên
        - [A2.3.1.2] Nút: Sửa hồ sơ học viên và phụ huynh
        - [A2.3.1.3] Menu …: Cho học viên ngừng học
        - [A2.3.1.4] Menu …: Ghi chú vào hồ sơ học viên và báo quản lý
      - [A2.3.2] Tab Thông tin
      - [A2.3.3] Tab Gói học
        - [A2.3.3.1] Nút: Xem gói học của học viên
      - [A2.3.4] Tab Thanh toán
        - [A2.3.4.1] Nút: Xem lại các lần đóng tiền và biên lai
      - [A2.3.5] Nút: Bán gói học và thu tiền
      - [A2.3.6] Nút: Bảo lưu gói học
      - [A2.3.7] Nút: Đổi một buổi sang lớp khác
      - [A2.3.8] Nút: Chuyển học viên sang lớp cố định khác
      - [A2.3.9] Nút: Xếp học viên vào lớp
  - [A3] Lớp
    - [A3.1] Bảng lớp
      - [A3.1.1] Nút chính: Xem lớp và chỗ còn trống
      - [A3.1.2] Nút: Xếp học viên vào lớp
      - [A3.1.3] Nút: Đưa học viên vào danh sách chờ
    - [A3.2] (bấm một dòng) → Chi tiết lớp
      - [A3.2.1] Tab Học viên
        - [A3.2.1.1] Menu …: Cho học viên rời khỏi lớp
        - [A3.2.1.2] Nút chính: Xem học viên của lớp
      - [A3.2.2] Tab Danh sách chờ
        - [A3.2.2.1] Nút: Xem danh sách chờ và gọi phụ huynh
  - [A4] Lịch trung tâm
    - [A4.1] Lưới lịch
      - [A4.1.1] Nút chính: Xem lịch toàn trung tâm theo ngày và tuần
      - [A4.1.2] Nút: Xem lịch dạy
      - [A4.1.3] Nút: Xếp học bù cho buổi vắng có phép
      - [A4.1.4] Menu …: Huỷ các buổi khi bể có sự cố
  - [A5] Đổi lịch
    - [A5.1] Yêu cầu chờ xử lý
      - [A5.1.1] Nút chính: Xử lý yêu cầu đổi lịch của phụ huynh
    - [A5.2] Đổi lịch
      - [A5.2.1] Nút: Đổi một buổi sang lớp khác
      - [A5.2.2] Nút: Chuyển học viên sang lớp cố định khác
- Nhóm Tiền
  - [A6] Gói học
    - [A6.1] Tab Gói đang dùng
      - [A6.1.1] Nút chính: Bán gói học và thu tiền
      - [A6.1.2] Nút: Xác nhận chuyển khoản đã về
      - [A6.1.3] Nút: Bảo lưu gói học
      - [A6.1.4] Menu …: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
    - [A6.2] Tab Cần gọi gia hạn
      - [A6.2.1] Nút: Xem danh sách cần gọi mời gia hạn
      - [A6.2.2] Nút: Ghi kết quả cuộc gọi mời gia hạn
  - [A7] Hoàn tiền
    - [A7.1] Đề nghị hoàn tiền
      - [A7.1.1] Nút chính: Lập đề nghị hoàn tiền
      - [A7.1.2] Nút: Ghi ngày đã chi hoàn tiền
- Nhóm Trung tâm
  - [A8] Thông báo
    - [A8.1] Soạn thông báo
      - [A8.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [A8.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [A9] Báo cáo
    - [A9.1] Tab Chuyên cần
      - [A9.1.1] Nút chính: Xem báo cáo chuyên cần
    - [A9.2] Tab Doanh thu
    - [A9.3] Tab Gói đang bảo lưu

## Web quản trị · vai Quản lý
- [B1] Tổng quan
  - [B1.1] Số liệu tháng
    - [B1.1.1] Nút chính: Xem báo cáo doanh thu
    - [B1.1.2] Nút: Xem báo cáo chuyên cần
  - [B1.2] Cần xử lý hôm nay
    - [B1.2.1] Nút: Duyệt hoặc từ chối hoàn tiền
  - [B1.3] Việc nhanh
    - [B1.3.1] Nút: Gửi thông báo cho phụ huynh
    - [B1.3.2] Nút: Huỷ các buổi khi bể có sự cố
- Nhóm Học viên và lớp
  - [B2] Học viên
    - [B2.1] Tìm và lọc
      - [B2.1.1] Nút chính: Tìm học viên
    - [B2.2] (bấm một dòng) → Hồ sơ học viên
      - [B2.2.1] Đầu hồ sơ
        - [B2.2.1.1] Xem hồ sơ học viên
        - [B2.2.1.2] Nút: Sửa hồ sơ học viên và phụ huynh
        - [B2.2.1.3] Menu …: Cho học viên ngừng học
      - [B2.2.2] Tab Thông tin
      - [B2.2.3] Tab Gói học
        - [B2.2.3.1] Nút: Xem gói học của học viên
      - [B2.2.4] Tab Thanh toán
        - [B2.2.4.1] Nút: Xem lại các lần đóng tiền và biên lai
      - [B2.2.5] Nút: Bán gói học và thu tiền
      - [B2.2.6] Nút: Bảo lưu gói học
      - [B2.2.7] Nút: Xếp học viên vào lớp
  - [B3] Lớp
    - [B3.1] Bảng lớp
      - [B3.1.1] Nút chính: Xem lớp và chỗ còn trống
      - [B3.1.2] Nút: Xếp học viên vào lớp
      - [B3.1.3] Menu …: Cho xếp xuống một bậc cấp độ
    - [B3.2] (bấm một dòng) → Chi tiết lớp
      - [B3.2.1] Tab Học viên
        - [B3.2.1.1] Menu …: Cho học viên rời khỏi lớp
        - [B3.2.1.2] Nút chính: Xem học viên của lớp
      - [B3.2.2] Tab Danh sách chờ
  - [B4] Lịch trung tâm
    - [B4.1] Lưới lịch
      - [B4.1.1] Nút chính: Xem lịch toàn trung tâm theo ngày và tuần
      - [B4.1.2] Nút: Xem lịch dạy
      - [B4.1.3] Menu …: Huỷ các buổi khi bể có sự cố
      - [B4.1.4] Menu …: Cử HLV dạy thay
  - [B5] Điểm danh
    - [B5.1] Danh sách buổi
      - [B5.1.1] Nút chính: Điểm danh buổi học
      - [B5.1.2] Nút: Sửa điểm danh sau khi lưu
- Nhóm Tiền
  - [B6] Gói học
    - [B6.1] Tab Gói đang dùng
      - [B6.1.1] Nút chính: Bán gói học và thu tiền
      - [B6.1.2] Nút: Bảo lưu gói học
    - [B6.2] Tab Cần gọi gia hạn
  - [B7] Hoàn tiền
    - [B7.1] Đề nghị hoàn tiền
      - [B7.1.1] Nút: Duyệt hoặc từ chối hoàn tiền
  - [B8] Báo cáo
    - [B8.1] Tab Chuyên cần
      - [B8.1.1] Nút chính: Xem báo cáo chuyên cần
    - [B8.2] Tab Doanh thu
      - [B8.2.1] Nút: Xem báo cáo doanh thu
      - [B8.2.2] Menu …: Xuất báo cáo ra Excel
    - [B8.3] Tab Gói đang bảo lưu
      - [B8.3.1] Menu …: Xem các gói đang bảo lưu
- Nhóm Trung tâm
  - [B9] Thông báo
    - [B9.1] Soạn thông báo
      - [B9.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [B9.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [B10] Khoá học và mở lớp
    - [B10.1] Khoá học
      - [B10.1.1] Nút: Tạo khoá học
    - [B10.2] Lớp
      - [B10.2.1] Nút chính: Mở lớp
  - [B11] Nhân viên
    - [B11.1] Nhân viên
      - [B11.1.1] Nút chính: Thêm và sửa tài khoản nhân viên
      - [B11.1.2] Nút: Gán lớp cho HLV
      - [B11.1.3] Menu …: Khoá tài khoản nhân viên nghỉ việc
      - [B11.1.4] Menu …: Mở khoá tài khoản bị khoá
  - [B12] Nhật ký thao tác
    - [B12.1] Nhật ký
      - [B12.1.1] Nút chính: Tra cứu nhật ký thao tác
  - [B13] Cài đặt
    - [B13.1] Tab Bảng giá
      - [B13.1.1] Menu …: Sửa bảng giá gói
    - [B13.2] Tab Ngày nghỉ lễ
      - [B13.2.1] Menu …: Khai báo ngày nghỉ lễ
    - [B13.3] Tab Nhắc lịch
      - [B13.3.1] Menu …: Cấu hình nhắc lịch tự động

## Web quản trị · vai Huấn luyện viên
- [C1] Buổi dạy hôm nay
  - [C1.1] Buổi hôm nay
    - [C1.1.1] Nút: Điểm danh buổi học
  - [C1.2] Việc nhanh
    - [C1.2.1] Nút: Tìm học viên
    - [C1.2.2] Nút: Sửa điểm danh sau khi lưu
- [C2] Lịch dạy
  - [C2.1] Lịch dạy
    - [C2.1.1] Nút chính: Xem lịch dạy
  - [C2.2] Buổi học thử
    - [C2.2.1] Nút: Ghi cấp độ gợi ý sau buổi học thử
- [C3] Lớp
  - [C3.1] (bấm một dòng) → Chi tiết lớp
    - [C3.1.1] Đầu lớp
      - [C3.1.1.1] Menu …: Ghi nhận xét kỹ năng cuối cấp độ (giai đoạn sau)
    - [C3.1.2] Tab Học viên
      - [C3.1.2.1] Nút chính: Xem học viên của lớp
    - [C3.1.3] Tab Danh sách chờ
- [C4] Học viên
  - [C4.1] Tìm và lọc
    - [C4.1.1] Nút chính: Tìm học viên
  - [C4.2] (bấm một dòng) → Hồ sơ học viên
    - [C4.2.1] Đầu hồ sơ
      - [C4.2.1.1] Xem hồ sơ học viên
    - [C4.2.2] Tab Thông tin
    - [C4.2.3] Tab Gói học
      - [C4.2.3.1] Nút: Xem gói học của học viên
    - [C4.2.4] Tab Thanh toán

## App phụ huynh · vai Phụ huynh
- [D1] Trang chủ
  - [D1.1] Con đang xem
    - [D1.1.1] Nút: Chọn con đang xem
  - [D1.2] Buổi sắp tới
    - [D1.2.1] Nút chính: Xem buổi học sắp tới của con
    - [D1.2.2] Nút: Báo nghỉ một buổi
    - [D1.2.3] Nút: Gửi yêu cầu đổi lịch
  - [D1.3] Yêu cầu của bạn
    - [D1.3.1] Nút: Xem trạng thái yêu cầu đổi lịch
- [D2] Gói học
  - [D2.1] Số buổi còn lại
    - [D2.1.1] Nút chính: Xem số buổi còn lại và hạn gói của con
  - [D2.2] Lịch sử đóng tiền
    - [D2.2.1] Nút: Xem lịch sử đóng tiền
- [D3] Thông báo
  - [D3.1] Danh sách thông báo
    - [D3.1.1] Nút chính: Xem thông báo của trung tâm
- [D4] Tài khoản
  - [D4.1] Tiến bộ của con
    - [D4.1.1] Menu …: Xem đánh giá tiến bộ của con (giai đoạn sau)

## Việc

T1 · vai Lễ tân · Một phụ huynh dắt con đến lần đầu, muốn cho bé học bơi.
T2 · vai Lễ tân · Một phụ huynh đến quầy đóng tiền cho con học tiếp.
T3 · vai Lễ tân · Phụ huynh nhắn rằng chiều thứ Tư bé bận, xin học vào hôm khác.
T4 · vai Lễ tân · Đầu ca sáng, xem phụ huynh nào đã nhờ đổi buổi qua app để trả lời.
T5 · vai Lễ tân · Có bé chỉ còn một buổi, cần nhắc phụ huynh học tiếp.
T6 · vai Lễ tân · Lớp Cơ bản tối thứ Ba đã đầy mà vẫn có một bé muốn vào.
T7 · vai Quản lý · Cuối tháng, chủ trung tâm muốn biết tháng này thu được bao nhiêu.
T8 · vai Quản lý · Sáng thứ Hai, muốn nhìn cả tuần xem làn nào còn trống.
T9 · vai Huấn luyện viên · Đến giờ dạy 17:30, tay ướt, cần ghi bé nào đến, bé nào nghỉ.
T10 · vai Phụ huynh · Sáng nay bé sốt, chiều có buổi bơi.
