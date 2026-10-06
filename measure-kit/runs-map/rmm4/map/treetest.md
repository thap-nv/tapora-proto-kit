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
    - [A1.1] Tìm học viên
      - [A1.1.1] Nút chính: Tìm học viên
      - [A1.1.2] Nút: Đăng ký học viên mới
    - [A1.2] Cần xử lý hôm nay
      - [A1.2.1] Nút: Xử lý yêu cầu đổi lịch
      - [A1.2.2] Nút: Xác nhận tiền chuyển khoản đã về
      - [A1.2.3] Nút: Gọi mời gia hạn gói
    - [A1.3] Phụ huynh gọi tới
      - [A1.3.1] Nút: Ghi báo nghỉ thay phụ huynh
      - [A1.3.2] Nút: Dời một buổi học sang lớp khác
    - [A1.4] Menu …: Đổi mật khẩu
    - [A1.5] Nút: Bán gói học và thu tiền
  - [A2] Lịch
    - [A2.1] Thanh công cụ
      - [A2.1.1] Nút: Xem lịch dạy
      - [A2.1.2] Nút: Huỷ buổi do trung tâm
    - [A2.2] Lưới làn × giờ
      - [A2.2.1] Nút chính: Xem lịch tuần của trung tâm
    - [A2.3] Ngăn lớp
      - [A2.3.1] Trên dòng: Xếp buổi học bù
    - [A2.4] Nút: Xếp học viên vào lớp
    - [A2.5] Nút: Xử lý yêu cầu đổi lịch
  - [A3] Lớp
    - [A3.1] Bảng lớp
      - [A3.1.1] Nút chính: Xem danh sách lớp và chỗ trống
    - [A3.2] (bấm một dòng) → Chi tiết lớp
      - [A3.2.1] Đầu lớp
        - [A3.2.1.1] Nút chính: Xếp học viên vào lớp
      - [A3.2.2] Học viên đang học
        - [A3.2.2.1] Trên dòng: Xoá học viên khỏi lớp
      - [A3.2.3] Hàng chờ
        - [A3.2.3.1] Nút: Đưa học viên vào danh sách chờ
        - [A3.2.3.2] Trên dòng: Gọi phụ huynh trong danh sách chờ
  - [A4] Học viên
    - [A4.1] Tìm và lọc
      - [A4.1.1] Nút chính: Tìm học viên
      - [A4.1.2] Nút: Đăng ký học viên mới
    - [A4.2] (bấm một dòng) → Hồ sơ học viên
      - [A4.2.1] Đầu hồ sơ
        - [A4.2.1.1] Nút chính: Xem hồ sơ học viên
        - [A4.2.1.2] Menu …: Sửa hồ sơ học viên
        - [A4.2.1.3] Menu …: Cho học viên ngừng học
        - [A4.2.1.4] Menu …: Chuyển lớp cố định
        - [A4.2.1.5] Nút: Dời một buổi học sang lớp khác
      - [A4.2.2] Tab Tổng quan
      - [A4.2.3] Tab Buổi học
      - [A4.2.4] Tab Gói và thanh toán
      - [A4.2.5] Nút: Bán gói học và thu tiền
      - [A4.2.6] Nút: Xếp học viên vào lớp
      - [A4.2.7] Nút: Bảo lưu gói học
      - [A4.2.8] Nút: Ghi báo nghỉ thay phụ huynh
      - [A4.2.9] Nút: Xếp buổi học bù
  - [A5] Học thử
    - [A5.1] Thanh công cụ
      - [A5.1.1] Nút chính: Đặt buổi học thử
    - [A5.2] Khách học thử
      - [A5.2.1] Nút: Xem danh sách khách học thử
    - [A5.3] Nút: Bán gói học và thu tiền
- Nhóm Gói và tiền
  - [A6] Thu tiền
    - [A6.1] Thanh công cụ
      - [A6.1.1] Nút chính: Bán gói học và thu tiền
      - [A6.1.2] Menu …: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
    - [A6.2] Chờ xác nhận chuyển khoản
      - [A6.2.1] Nút: Xác nhận tiền chuyển khoản đã về
    - [A6.3] Đối chiếu cuối ca
      - [A6.3.1] Nút: Đối chiếu tiền thu cuối ngày
  - [A7] Gói học
    - [A7.1] Bảng gói
      - [A7.1.1] Nút chính: Xem danh sách gói học theo trạng thái
      - [A7.1.2] Trên dòng: Bảo lưu gói học
      - [A7.1.3] Trên dòng: Lập đề nghị hoàn tiền
    - [A7.2] Tab Gói học
    - [A7.3] Tab Đề nghị hoàn tiền
      - [A7.3.1] Trên dòng: Ghi ngày đã chi hoàn tiền
- Nhóm Liên lạc và báo cáo
  - [A8] Thông báo
    - [A8.1] Thanh công cụ
      - [A8.1.1] Nút chính: Gửi thông báo cho phụ huynh
  - [A9] Báo cáo
    - [A9.1] Tab Chuyên cần
      - [A9.1.1] Nút chính: Xem báo cáo chuyên cần
    - [A9.2] Tab Doanh thu

## Web quản trị · vai Quản lý
- Nhóm Hằng ngày
  - [B1] Tổng quan
    - [B1.1] Cần quản lý xử lý
      - [B1.1.1] Nút chính: Xem cảnh báo cho quản lý
      - [B1.1.2] Nút: Duyệt đề nghị hoàn tiền
    - [B1.2] HLV nghỉ hôm nay
      - [B1.2.1] Nút: Phân công HLV dạy thay
    - [B1.3] Tháng này
      - [B1.3.1] Nút: Xem báo cáo chuyên cần
      - [B1.3.2] Nút: Xem báo cáo doanh thu
    - [B1.4] Menu …: Đổi mật khẩu
  - [B2] Lịch
    - [B2.1] Thanh công cụ
      - [B2.1.1] Nút: Xem lịch dạy
      - [B2.1.2] Nút: Huỷ buổi do trung tâm
    - [B2.2] Lưới làn × giờ
      - [B2.2.1] Nút chính: Xem lịch tuần của trung tâm
    - [B2.3] Ngăn lớp
      - [B2.3.1] Trên dòng: Phân công HLV dạy thay
    - [B2.4] Nút: Xếp học viên vào lớp
    - [B2.5] Nút: Sửa điểm danh
    - [B2.6] Nút: Điểm danh buổi học → Điểm danh
  - [B3] Lớp
    - [B3.1] Thanh công cụ
      - [B3.1.1] Menu …: Tạo khoá học
      - [B3.1.2] Nút: Mở lớp
    - [B3.2] Bảng lớp
      - [B3.2.1] Nút chính: Xem danh sách lớp và chỗ trống
    - [B3.3] (bấm một dòng) → Chi tiết lớp
      - [B3.3.1] Đầu lớp
        - [B3.3.1.1] Nút chính: Xếp học viên vào lớp
      - [B3.3.2] Học viên đang học
        - [B3.3.2.1] Trên dòng: Xoá học viên khỏi lớp
      - [B3.3.3] Hàng chờ
        - [B3.3.3.1] Nút: Đưa học viên vào danh sách chờ
  - [B4] Học viên
    - [B4.1] Tìm và lọc
      - [B4.1.1] Nút chính: Tìm học viên
      - [B4.1.2] Nút: Đăng ký học viên mới
    - [B4.2] (bấm một dòng) → Hồ sơ học viên
      - [B4.2.1] Đầu hồ sơ
        - [B4.2.1.1] Nút chính: Xem hồ sơ học viên
        - [B4.2.1.2] Menu …: Sửa hồ sơ học viên
        - [B4.2.1.3] Menu …: Cho học viên ngừng học
        - [B4.2.1.4] Menu …: Chuyển lớp cố định
        - [B4.2.1.5] Nút: Dời một buổi học sang lớp khác
      - [B4.2.2] Tab Tổng quan
      - [B4.2.3] Tab Buổi học
      - [B4.2.4] Tab Gói và thanh toán
      - [B4.2.5] Nút: Bán gói học và thu tiền
      - [B4.2.6] Nút: Xếp học viên vào lớp
      - [B4.2.7] Nút: Bảo lưu gói học
- Nhóm Gói và tiền
  - [B5] Thu tiền
    - [B5.1] Thanh công cụ
      - [B5.1.1] Nút chính: Bán gói học và thu tiền
      - [B5.1.2] Menu …: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
    - [B5.2] Chờ xác nhận chuyển khoản
      - [B5.2.1] Nút: Xác nhận tiền chuyển khoản đã về
    - [B5.3] Đối chiếu cuối ca
      - [B5.3.1] Nút: Đối chiếu tiền thu cuối ngày
  - [B6] Gói học
    - [B6.1] Bảng gói
      - [B6.1.1] Nút chính: Xem danh sách gói học theo trạng thái
      - [B6.1.2] Trên dòng: Bảo lưu gói học
    - [B6.2] Tab Gói học
    - [B6.3] Tab Đề nghị hoàn tiền
      - [B6.3.1] Nút: Duyệt đề nghị hoàn tiền
- Nhóm Liên lạc và báo cáo
  - [B7] Thông báo
    - [B7.1] Thanh công cụ
      - [B7.1.1] Nút chính: Gửi thông báo cho phụ huynh
  - [B8] Báo cáo
    - [B8.1] Thanh công cụ
      - [B8.1.1] Menu …: Xuất báo cáo ra Excel
    - [B8.2] Tab Chuyên cần
      - [B8.2.1] Nút chính: Xem báo cáo chuyên cần
    - [B8.3] Tab Doanh thu
      - [B8.3.1] Nút: Xem báo cáo doanh thu
- Nhóm Quản trị
  - [B9] Nhân viên
    - [B9.1] Thanh công cụ
      - [B9.1.1] Nút chính: Thêm tài khoản nhân viên
    - [B9.2] Bảng nhân viên
      - [B9.2.1] Trên dòng: Gán lớp cho HLV
      - [B9.2.2] Trên dòng: Khoá tài khoản nhân viên nghỉ việc
      - [B9.2.3] Trên dòng: Mở khoá tài khoản
  - [B10] Cài đặt
    - [B10.1] Tab Bảng giá
      - [B10.1.1] Nút: Sửa bảng giá gói
    - [B10.2] Tab Ngày nghỉ lễ
      - [B10.2.1] Nút: Cập nhật danh sách ngày nghỉ lễ
    - [B10.3] Tab Nhắc lịch
      - [B10.3.1] Nút: Cấu hình nhắc lịch
    - [B10.4] Tab Nhật ký thao tác
      - [B10.4.1] Nút: Tra cứu nhật ký thao tác

## Web quản trị · vai Huấn luyện viên
- [C1] Hôm nay
  - [C1.1] Buổi dạy hôm nay
    - [C1.1.1] Nút chính: Xem lịch dạy
  - [C1.2] Bé học thử chờ ghi cấp độ
    - [C1.2.1] Nút: Ghi cấp độ gợi ý sau buổi học thử
  - [C1.3] Menu …: Đổi mật khẩu
  - [C1.4] (bấm một dòng) → Điểm danh
    - [C1.4.1] Đầu buổi
      - [C1.4.1.1] Nút: Sửa điểm danh
    - [C1.4.2] Danh sách học viên
      - [C1.4.2.1] Điểm danh buổi học
- [C2] Lịch dạy
  - [C2.1] Tuần này
    - [C2.1.1] Nút chính: Xem lịch dạy
- [C3] Lớp
  - [C3.1] Bảng lớp
    - [C3.1.1] Nút chính: Xem danh sách lớp và chỗ trống
  - [C3.2] (bấm một dòng) → Chi tiết lớp
    - [C3.2.1] Học viên đang học
      - [C3.2.1.1] Trên dòng: Đề xuất lên cấp độ cho học viên
      - [C3.2.1.2] Trên dòng: Ghi nhận xét kỹ năng cuối cấp độ (giai đoạn sau)
- [C4] Học viên
  - [C4.1] Tìm và lọc
    - [C4.1.1] Nút chính: Tìm học viên
  - [C4.2] (bấm một dòng) → Hồ sơ học viên
    - [C4.2.1] Đầu hồ sơ
      - [C4.2.1.1] Nút chính: Xem hồ sơ học viên
    - [C4.2.2] Tab Tổng quan
    - [C4.2.3] Tab Buổi học
    - [C4.2.4] Tab Gói và thanh toán

## App phụ huynh · vai Phụ huynh
- [D1] Lịch học
  - [D1.1] Con đang xem
    - [D1.1.1] Nút: Chọn con đang xem
  - [D1.2] Buổi sắp tới
    - [D1.2.1] Nút chính: Xem lịch học sắp tới
    - [D1.2.2] Trên dòng: Báo nghỉ một buổi
    - [D1.2.3] Trên dòng: Gửi yêu cầu đổi lịch
- [D2] Gói học
  - [D2.1] Tab Gói đang dùng
    - [D2.1.1] Nút chính: Xem số buổi còn lại và hạn gói
  - [D2.2] Tab Lịch sử đóng tiền
    - [D2.2.1] Nút: Xem lịch sử đóng tiền
  - [D2.3] Tab Nhận xét của HLV
    - [D2.3.1] Nút: Xem nhận xét tiến bộ của con (giai đoạn sau)
- [D3] Thông báo
  - [D3.1] Danh sách thông báo
    - [D3.1.1] Nút chính: Đọc thông báo trong app
- [D4] Tài khoản
  - [D4.1] Cài đặt thông báo
    - [D4.1.1] Nút: Tắt bật nhận thông báo

## Việc

T1 · vai Lễ tân · Một phụ huynh mới tới quầy muốn cho bé 5 tuổi học bơi; bé chưa có hồ sơ ở trung tâm.
T2 · vai Lễ tân · Mẹ bé Minh Anh chuyển khoản tiền gói 12 buổi từ sáng, ngân hàng vừa báo tiền đã về.
T3 · vai Lễ tân · Một phụ huynh gọi điện: bé sốt, chiều nay không đi học được.
T4 · vai Lễ tân · Có ba phụ huynh nhắn qua app xin chuyển buổi học tuần này sang ngày khác.
T5 · vai Lễ tân · Bé Gia Bảo vừa mua gói, cần cho bé vào một lớp Cơ bản còn chỗ chiều thứ Ba.
T6 · vai Lễ tân · Hết ca chiều, cần khớp tiền mặt trong két với số tiền đã thu trong ca.
T7 · vai Huấn luyện viên · Lớp 17:30 vừa xuống nước, cần ghi bé nào có mặt, bé nào vắng.
T8 · vai Quản lý · Sáng nay HLV Tuấn nhắn bị ốm, các lớp của anh ấy hôm nay cần người đứng thay.
T9 · vai Phụ huynh · Bé ốm từ sáng, muốn cho trung tâm biết chiều nay bé ở nhà.
T10 · vai Phụ huynh · Định mua gói tiếp cho con, muốn biết gói đang học còn dùng được bao lâu nữa.
