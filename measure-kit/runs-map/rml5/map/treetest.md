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
  - [A1] Hôm nay
    - [A1.1] Cần xử lý hôm nay
      - [A1.1.1] Nút chính: Xử lý yêu cầu đổi lịch của phụ huynh
      - [A1.1.2] Nút: Gọi mời gia hạn học viên sắp hết buổi
    - [A1.2] Việc nhanh ở quầy
      - [A1.2.1] Nút: Đăng ký học viên mới
      - [A1.2.2] Nút: Bán gói học và thu tiền
      - [A1.2.3] Nút: Xếp học viên vào lớp
      - [A1.2.4] Nút: Đặt buổi học thử
  - [A2] Học viên
    - [A2.1] Tìm và lọc
      - [A2.1.1] Nút chính: Tìm học viên
    - [A2.2] Bảng học viên
      - [A2.2.1] Nút: Đăng ký học viên mới
      - [A2.2.2] Nút: Đặt buổi học thử
    - [A2.3] (bấm một dòng) → Hồ sơ học viên
      - [A2.3.1] Đầu hồ sơ
        - [A2.3.1.1] Nút chính: Xem hồ sơ học viên
        - [A2.3.1.2] Nút: Sửa hồ sơ học viên
        - [A2.3.1.3] Menu …: Cho học viên nghỉ hẳn
      - [A2.3.2] Tab Buổi học
        - [A2.3.2.1] Nút: Đổi lịch học
      - [A2.3.3] Tab Gói học
      - [A2.3.4] Tab Thanh toán
        - [A2.3.4.1] Nút: Xem lần đóng tiền và biên lai của học viên
      - [A2.3.5] Tab Nhận xét
  - [A3] Lớp học
    - [A3.1] Tab Các lớp
      - [A3.1.1] Nút: Xem danh sách lớp và chỗ trống
      - [A3.1.2] Nút chính: Xếp học viên vào lớp
      - [A3.1.3] Menu …: Cho học viên rời lớp
    - [A3.2] Tab Danh sách chờ
      - [A3.2.1] Nút: Xem danh sách chờ của lớp và gọi phụ huynh
  - [A4] Lịch
    - [A4.1] Thanh công cụ
      - [A4.1.1] Menu …: Huỷ buổi khi bể có sự cố
    - [A4.2] Lưới lịch theo làn và giờ
      - [A4.2.1] Nút chính: Xem lịch toàn trung tâm và lịch dạy
      - [A4.2.2] Nút: Đổi lịch học
      - [A4.2.3] Nút: Xếp học bù cho buổi vắng có phép
  - [A5] Gói học và thu tiền
    - [A5.1] Bảng gói học
      - [A5.1.1] Nút chính: Bán gói học và thu tiền
      - [A5.1.2] Nút: Bảo lưu gói học
      - [A5.1.3] Menu …: Nhập mã khuyến mãi khi bán gói (giai đoạn sau)
    - [A5.2] Chờ xác nhận tiền
      - [A5.2.1] Nút: Xác nhận chuyển khoản đã về
- Nhóm Tiền, thông báo, báo cáo
  - [A6] Hoàn tiền
    - [A6.1] Bảng đề nghị hoàn tiền
      - [A6.1.1] Nút chính: Lập đề nghị hoàn tiền
      - [A6.1.2] Nút: Ghi ngày đã chi hoàn tiền
  - [A7] Thông báo
    - [A7.1] Thông báo đã gửi
      - [A7.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [A7.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [A8] Báo cáo
    - [A8.1] Tab Chuyên cần
      - [A8.1.1] Nút chính: Xem báo cáo chuyên cần
    - [A8.2] Tab Doanh thu

## Web quản trị · vai Quản lý
- Nhóm Hằng ngày
  - [B1] Tổng quan hôm nay
    - [B1.1] Cần xem hôm nay
      - [B1.1.1] Nút: Xem danh sách gói đang bảo lưu
    - [B1.2] Việc nhanh
      - [B1.2.1] Nút: Huỷ buổi khi bể có sự cố
      - [B1.2.2] Nút: Xem báo cáo doanh thu
      - [B1.2.3] Nút: Gửi thông báo cho phụ huynh
  - [B2] Lịch
    - [B2.1] Thanh công cụ
      - [B2.1.1] Menu …: Cho HLV dạy thay
      - [B2.1.2] Menu …: Huỷ buổi khi bể có sự cố
    - [B2.2] Lưới lịch theo làn và giờ
      - [B2.2.1] Nút chính: Xem lịch toàn trung tâm và lịch dạy
      - [B2.2.2] Nút: Đổi lịch học
  - [B3] Điểm danh
    - [B3.1] Danh sách học viên của buổi
      - [B3.1.1] Nút chính: Điểm danh buổi học
      - [B3.1.2] Nút: Sửa điểm danh sau khi lưu
- Nhóm Học viên và lớp
  - [B4] Học viên
    - [B4.1] Tìm và lọc
      - [B4.1.1] Nút chính: Tìm học viên
    - [B4.2] Bảng học viên
      - [B4.2.1] Nút: Đăng ký học viên mới
    - [B4.3] (bấm một dòng) → Hồ sơ học viên
      - [B4.3.1] Đầu hồ sơ
        - [B4.3.1.1] Nút chính: Xem hồ sơ học viên
        - [B4.3.1.2] Nút: Sửa hồ sơ học viên
        - [B4.3.1.3] Menu …: Cho học viên nghỉ hẳn
      - [B4.3.2] Tab Buổi học
        - [B4.3.2.1] Nút: Đổi lịch học
      - [B4.3.3] Tab Gói học
      - [B4.3.4] Tab Thanh toán
        - [B4.3.4.1] Nút: Xem lần đóng tiền và biên lai của học viên
      - [B4.3.5] Tab Nhận xét
  - [B5] Lớp học
    - [B5.1] Bảng lớp và chỗ trống
      - [B5.1.1] Menu …: Tạo khoá học
      - [B5.1.2] Nút: Mở lớp
    - [B5.2] Tab Các lớp
      - [B5.2.1] Nút: Xem danh sách lớp và chỗ trống
      - [B5.2.2] Nút chính: Xếp học viên vào lớp
      - [B5.2.3] Menu …: Cho học viên rời lớp
    - [B5.3] Tab Danh sách chờ
- Nhóm Gói và tiền
  - [B6] Gói học và thu tiền
    - [B6.1] Bảng gói học
      - [B6.1.1] Nút chính: Bán gói học và thu tiền
      - [B6.1.2] Nút: Bảo lưu gói học
  - [B7] Hoàn tiền
    - [B7.1] Bảng đề nghị hoàn tiền
      - [B7.1.1] Nút: Duyệt hoặc từ chối hoàn tiền
  - [B8] Bảng giá
    - [B8.1] Bảng giá hiện hành
      - [B8.1.1] Nút chính: Sửa bảng giá gói
- Nhóm Thông báo và báo cáo
  - [B9] Thông báo
    - [B9.1] Thông báo đã gửi
      - [B9.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [B9.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [B10] Báo cáo
    - [B10.1] Số liệu
      - [B10.1.1] Menu …: Xuất báo cáo ra Excel
    - [B10.2] Tab Chuyên cần
      - [B10.2.1] Nút chính: Xem báo cáo chuyên cần
    - [B10.3] Tab Doanh thu
      - [B10.3.1] Nút: Xem báo cáo doanh thu
- Nhóm Quản trị
  - [B11] Nhân viên
    - [B11.1] Bảng nhân viên
      - [B11.1.1] Nút chính: Thêm nhân viên và gán vai
      - [B11.1.2] Nút: Gán lớp cho HLV
      - [B11.1.3] Menu …: Khoá tài khoản nhân viên nghỉ việc
      - [B11.1.4] Menu …: Mở khoá tài khoản nhân viên
  - [B12] Nhật ký thao tác
    - [B12.1] Bảng nhật ký
      - [B12.1.1] Nút chính: Tra nhật ký thao tác
  - [B13] Cài đặt
    - [B13.1] Tab Nhắc lịch
      - [B13.1.1] Nút chính: Cấu hình nhắc lịch tự động
    - [B13.2] Tab Ngày nghỉ lễ
      - [B13.2.1] Nút: Sửa danh sách ngày nghỉ lễ

## Web quản trị · vai Huấn luyện viên
- [C1] Buổi dạy hôm nay
  - [C1.1] Các buổi hôm nay
    - [C1.1.1] Nút: Xem lịch toàn trung tâm và lịch dạy
  - [C1.2] Việc nhanh ở bể
    - [C1.2.1] Nút: Điểm danh buổi học
    - [C1.2.2] Nút: Ghi cấp độ gợi ý sau buổi học thử
- [C2] Điểm danh
  - [C2.1] Danh sách học viên của buổi
    - [C2.1.1] Nút: Ghi cấp độ gợi ý sau buổi học thử
    - [C2.1.2] Nút chính: Điểm danh buổi học
    - [C2.1.3] Nút: Sửa điểm danh sau khi lưu
    - [C2.1.4] Nút: Lưu tạm điểm danh khi mất mạng
- [C3] Lịch
  - [C3.1] Lưới lịch theo làn và giờ
    - [C3.1.1] Nút chính: Xem lịch toàn trung tâm và lịch dạy
- [C4] Học viên
  - [C4.1] Tìm và lọc
    - [C4.1.1] Nút chính: Tìm học viên
  - [C4.2] (bấm một dòng) → Hồ sơ học viên
    - [C4.2.1] Đầu hồ sơ
      - [C4.2.1.1] Nút chính: Xem hồ sơ học viên
    - [C4.2.2] Tab Buổi học
    - [C4.2.3] Tab Gói học
    - [C4.2.4] Tab Thanh toán
    - [C4.2.5] Tab Nhận xét
      - [C4.2.5.1] Nút: Ghi nhận xét kỹ năng cuối cấp độ (giai đoạn sau)

## App phụ huynh · vai Phụ huynh
- [D1] Trang chủ
  - [D1.1] Buổi sắp tới của con
    - [D1.1.1] Nút chính: Xem lịch, số buổi còn lại và hạn gói của con
    - [D1.1.2] Nút: Xem trạng thái yêu cầu đổi lịch
  - [D1.2] Việc nhanh
    - [D1.2.1] Nút: Báo nghỉ một buổi
    - [D1.2.2] Nút: Gửi yêu cầu đổi lịch
  - [D1.3] Nút: Chọn con đang xem
- [D2] Gói và đóng tiền
  - [D2.1] Lịch sử đóng tiền
    - [D2.1.1] Nút chính: Xem lịch sử đóng tiền của con
- [D3] Thông báo
  - [D3.1] Danh sách thông báo
    - [D3.1.1] Nút chính: Đọc thông báo trong app
- [D4] Tài khoản
  - [D4.1] Tab Thông tin
  - [D4.2] Tab Nhận xét của con
    - [D4.2.1] Nút: Xem nhận xét tiến bộ của con (giai đoạn sau)

## Việc

T1 · vai Lễ tân · Một phụ huynh dắt con đến học lần đầu, muốn mua gói 12 buổi.
T2 · vai Lễ tân · Chị phụ huynh gọi báo bé không đi được tuần này, nhờ chuyển sang lớp ngày thứ Bảy.
T3 · vai Lễ tân · Đầu giờ chiều, kiểm tra có phụ huynh nào xin đổi buổi mà chưa ai trả lời.
T4 · vai Lễ tân · Một lớp vừa có chỗ trống, cần biết gọi phụ huynh nào trước.
T5 · vai Quản lý · Cuối tháng chủ trung tâm muốn biết đã thu được bao nhiêu tiền.
T6 · vai Quản lý · Bơm lọc hỏng, bể đóng cửa cả buổi chiều, mọi lớp trong khoảng đó phải nghỉ.
T7 · vai Huấn luyện viên · Buổi 17:30 vừa bắt đầu, cần ghi lại bé nào có mặt, bé nào vắng.
T8 · vai Huấn luyện viên · Sáng đến bể, cần biết hôm nay mình dạy những lớp nào, giờ nào.
T9 · vai Phụ huynh · Bé bị sốt sáng nay, muốn xin nghỉ buổi chiều.
T10 · vai Phụ huynh · Muốn biết con còn bao nhiêu buổi và gói hết hạn khi nào.
