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
    - [A1.2] Việc nhanh
      - [A1.2.1] Nút: Đăng ký học viên mới
      - [A1.2.2] Nút: Bán gói học và thu tiền
      - [A1.2.3] Nút: Đặt buổi học thử
      - [A1.2.4] Nút: Ghi báo nghỉ thay phụ huynh
    - [A1.3] Cần xử lý
      - [A1.3.1] Nút: Xử lý yêu cầu đổi lịch
      - [A1.3.2] Nút: Xác nhận chuyển khoản đã về
    - [A1.4] Cần gọi
      - [A1.4.1] Nút: Gọi mời gia hạn
      - [A1.4.2] Nút: Gọi phụ huynh trong danh sách chờ
  - [A2] Lịch tuần
    - [A2.1] Thanh công cụ
      - [A2.1.1] Nút: Xem lịch dạy
      - [A2.1.2] Nút: Huỷ buổi do trung tâm
    - [A2.2] Lưới làn và giờ
      - [A2.2.1] Xem lịch tuần toàn trung tâm
  - [A3] Đổi lịch và học bù
    - [A3.1] Thanh công cụ
      - [A3.1.1] Nút: Đổi một buổi học
    - [A3.2] Yêu cầu từ phụ huynh
      - [A3.2.1] Nút chính: Xử lý yêu cầu đổi lịch
    - [A3.3] Buổi cần học bù
      - [A3.3.1] Nút: Xếp buổi học bù
- Nhóm Học viên và lớp
  - [A4] Học viên
    - [A4.1] Thanh công cụ
      - [A4.1.1] Nút chính: Đăng ký học viên mới
      - [A4.1.2] Nút: Đặt buổi học thử
    - [A4.2] Tìm và lọc
      - [A4.2.1] Nút: Tìm học viên
      - [A4.2.2] Nút: Theo dõi bé học thử chưa mua gói
    - [A4.3] Bảng học viên
      - [A4.3.1] Trên dòng: Cho học viên ngừng học
    - [A4.4] (bấm một dòng) → Hồ sơ học viên
      - [A4.4.1] Đầu hồ sơ
        - [A4.4.1.1] Xem hồ sơ học viên
        - [A4.4.1.2] Nút: Đổi một buổi học
        - [A4.4.1.3] Nút chính: Bán gói học và thu tiền
        - [A4.4.1.4] Trên dòng: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
      - [A4.4.2] Tab Thông tin
        - [A4.4.2.1] Nút: Sửa hồ sơ học viên và phụ huynh
      - [A4.4.3] Tab Lịch học
      - [A4.4.4] Tab Gói học
        - [A4.4.4.1] Trên dòng: Bảo lưu gói học
      - [A4.4.5] Nút: Xếp học viên vào lớp
      - [A4.4.6] Nút: Chuyển lớp cố định
  - [A5] Lớp học
    - [A5.1] Bảng lớp
      - [A5.1.1] Nút: Xem danh sách lớp và chỗ trống
      - [A5.1.2] Nút chính: Xếp học viên vào lớp
      - [A5.1.3] Trên dòng: Đưa học viên vào danh sách chờ
    - [A5.2] (bấm một dòng) → Chi tiết lớp
      - [A5.2.1] Học viên trong lớp
        - [A5.2.1.1] Trên dòng: Cho học viên rời lớp
        - [A5.2.1.2] Trên dòng: Chuyển lớp cố định
      - [A5.2.2] Danh sách chờ
        - [A5.2.2.1] Nút: Gọi phụ huynh trong danh sách chờ
  - [A6] Gói và thu tiền
    - [A6.1] Thanh công cụ
      - [A6.1.1] Nút chính: Bán gói học và thu tiền
    - [A6.2] Tab Gói học
      - [A6.2.1] Trên dòng: Xác nhận chuyển khoản đã về
      - [A6.2.2] Nút: Xem danh sách gói học theo trạng thái
      - [A6.2.3] Trên dòng: Lập đề nghị hoàn tiền
    - [A6.3] Tab Hoàn tiền
      - [A6.3.1] Trên dòng: Ghi ngày đã chi hoàn tiền
- Nhóm Liên lạc và số liệu
  - [A7] Thông báo
    - [A7.1] Thanh công cụ
      - [A7.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [A7.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [A8] Báo cáo
    - [A8.1] Tab Chuyên cần
      - [A8.1.1] Nút: Xem báo cáo chuyên cần
    - [A8.2] Tab Thu trong ngày
      - [A8.2.1] Nút: Đối chiếu tiền thu trong ngày
    - [A8.3] Tab Doanh thu

## Web quản trị · vai Quản lý
- Nhóm Hằng ngày
  - [B1] Tổng quan
    - [B1.1] Hôm nay ở bể
      - [B1.1.1] Nút: Xem lịch tuần toàn trung tâm
    - [B1.2] Cần quyết
      - [B1.2.1] Nút: Duyệt đề nghị hoàn tiền
      - [B1.2.2] Nút: Xử lý yêu cầu đổi lịch
    - [B1.3] HLV nghỉ hôm nay
      - [B1.3.1] Nút: Phân công HLV dạy thay
    - [B1.4] Số liệu tháng này
      - [B1.4.1] Nút: Xem báo cáo doanh thu
      - [B1.4.2] Nút: Xem báo cáo chuyên cần
    - [B1.5] Việc nhanh
      - [B1.5.1] Nút: Gửi thông báo cho phụ huynh
      - [B1.5.2] Nút: Huỷ buổi do trung tâm
  - [B2] Lịch tuần
    - [B2.1] Thanh công cụ
      - [B2.1.1] Nút: Xem lịch dạy
      - [B2.1.2] Nút: Huỷ buổi do trung tâm
    - [B2.2] Lưới làn và giờ
      - [B2.2.1] Xem lịch tuần toàn trung tâm
    - [B2.3] Ngăn chi tiết lớp
      - [B2.3.1] Trên dòng: Phân công HLV dạy thay
      - [B2.3.2] Trên dòng: Điểm danh buổi học
      - [B2.3.3] Trên dòng: Sửa điểm danh
  - [B3] Đổi lịch và học bù
    - [B3.1] Thanh công cụ
      - [B3.1.1] Nút: Đổi một buổi học
    - [B3.2] Yêu cầu từ phụ huynh
      - [B3.2.1] Nút chính: Xử lý yêu cầu đổi lịch
- Nhóm Học viên và lớp
  - [B4] Học viên
    - [B4.1] Thanh công cụ
      - [B4.1.1] Nút chính: Đăng ký học viên mới
    - [B4.2] Tìm và lọc
      - [B4.2.1] Nút: Tìm học viên
    - [B4.3] Bảng học viên
      - [B4.3.1] Trên dòng: Cho học viên ngừng học
    - [B4.4] (bấm một dòng) → Hồ sơ học viên
      - [B4.4.1] Đầu hồ sơ
        - [B4.4.1.1] Xem hồ sơ học viên
        - [B4.4.1.2] Nút: Đổi một buổi học
        - [B4.4.1.3] Nút chính: Bán gói học và thu tiền
        - [B4.4.1.4] Trên dòng: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
      - [B4.4.2] Tab Thông tin
        - [B4.4.2.1] Nút: Sửa hồ sơ học viên và phụ huynh
      - [B4.4.3] Tab Lịch học
      - [B4.4.4] Tab Gói học
        - [B4.4.4.1] Trên dòng: Bảo lưu gói học
      - [B4.4.5] Nút: Xếp học viên vào lớp
      - [B4.4.6] Nút: Chuyển lớp cố định
  - [B5] Lớp học
    - [B5.1] Thanh công cụ
      - [B5.1.1] Nút: Mở lớp
    - [B5.2] Bảng lớp
      - [B5.2.1] Nút: Xem danh sách lớp và chỗ trống
      - [B5.2.2] Nút chính: Xếp học viên vào lớp
    - [B5.3] (bấm một dòng) → Chi tiết lớp
      - [B5.3.1] Học viên trong lớp
        - [B5.3.1.1] Trên dòng: Cho học viên rời lớp
        - [B5.3.1.2] Trên dòng: Chuyển lớp cố định
  - [B6] Gói và thu tiền
    - [B6.1] Thanh công cụ
      - [B6.1.1] Nút chính: Bán gói học và thu tiền
    - [B6.2] Tab Gói học
      - [B6.2.1] Trên dòng: Xác nhận chuyển khoản đã về
      - [B6.2.2] Nút: Xem danh sách gói học theo trạng thái
    - [B6.3] Tab Hoàn tiền
      - [B6.3.1] Trên dòng: Duyệt đề nghị hoàn tiền
- Nhóm Liên lạc và số liệu
  - [B7] Thông báo
    - [B7.1] Thanh công cụ
      - [B7.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [B7.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
  - [B8] Báo cáo
    - [B8.1] Thanh công cụ
      - [B8.1.1] Menu …: Xuất báo cáo ra Excel
    - [B8.2] Tab Chuyên cần
      - [B8.2.1] Nút: Xem báo cáo chuyên cần
    - [B8.3] Tab Thu trong ngày
      - [B8.3.1] Nút: Đối chiếu tiền thu trong ngày
    - [B8.4] Tab Doanh thu
      - [B8.4.1] Nút: Xem báo cáo doanh thu
- Nhóm Quản trị
  - [B9] Nhân viên
    - [B9.1] Thanh công cụ
      - [B9.1.1] Nút chính: Thêm nhân viên và phân vai
    - [B9.2] Bảng nhân viên
      - [B9.2.1] Trên dòng: Khoá tài khoản nhân viên nghỉ việc
      - [B9.2.2] Trên dòng: Mở khoá tài khoản
  - [B10] Nhật ký thao tác
    - [B10.1] Bảng nhật ký
      - [B10.1.1] Nút: Tra cứu nhật ký thao tác
  - [B11] Cài đặt
    - [B11.1] Tab Bảng giá
      - [B11.1.1] Nút: Sửa bảng giá gói học
    - [B11.2] Tab Khoá học
      - [B11.2.1] Nút: Tạo khoá học
    - [B11.3] Tab Ngày nghỉ lễ
      - [B11.3.1] Nút: Cập nhật ngày nghỉ lễ
    - [B11.4] Tab Nhắc lịch
      - [B11.4.1] Nút: Cấu hình nhắc lịch

## Web quản trị · vai Huấn luyện viên
- [C1] Buổi dạy hôm nay
  - [C1.1] Buổi đang diễn ra
    - [C1.1.1] Nút chính: Điểm danh buổi học
  - [C1.2] Lịch dạy tuần này
    - [C1.2.1] Nút: Xem lịch dạy
  - [C1.3] Buổi vừa dạy
    - [C1.3.1] Trên dòng: Sửa điểm danh
  - [C1.4] Bé học thử hôm nay
    - [C1.4.1] Nút: Ghi cấp độ gợi ý sau buổi học thử
- [C2] Lớp học
  - [C2.1] Bảng lớp
    - [C2.1.1] Nút: Xem danh sách lớp và chỗ trống
  - [C2.2] (bấm một dòng) → Chi tiết lớp
    - [C2.2.1] Học viên trong lớp
      - [C2.2.1.1] Trên dòng: Đề xuất cho học viên lên cấp độ
      - [C2.2.1.2] Trên dòng: Ghi nhận xét tiến bộ cuối cấp độ (giai đoạn sau)
- [C3] Học viên
  - [C3.1] Tìm và lọc
    - [C3.1.1] Nút: Tìm học viên
  - [C3.2] (bấm một dòng) → Hồ sơ học viên
    - [C3.2.1] Đầu hồ sơ
      - [C3.2.1.1] Xem hồ sơ học viên
    - [C3.2.2] Tab Thông tin
    - [C3.2.3] Tab Lịch học
    - [C3.2.4] Tab Gói học

## App phụ huynh · vai Phụ huynh
- [D1] Lịch học
  - [D1.1] Chọn con
    - [D1.1.1] Nút: Chọn con đang xem
  - [D1.2] Buổi sắp tới
    - [D1.2.1] Nút: Xem lịch học của con
    - [D1.2.2] Nút chính: Báo nghỉ một buổi
    - [D1.2.3] Trên dòng: Gửi yêu cầu đổi lịch
  - [D1.3] Số buổi còn lại
    - [D1.3.1] Nút: Xem số buổi còn lại và hạn gói
  - [D1.4] Yêu cầu đổi lịch
    - [D1.4.1] Nút: Xem trạng thái yêu cầu đổi lịch
- [D2] Gói học
  - [D2.1] Gói đang dùng
    - [D2.1.1] Nút: Xem số buổi còn lại và hạn gói
  - [D2.2] Lịch sử đóng tiền
    - [D2.2.1] Nút: Xem lịch sử đóng tiền
  - [D2.3] Nhận xét tiến bộ
    - [D2.3.1] Nút: Xem nhận xét tiến bộ của con (giai đoạn sau)
- [D3] Thông báo
  - [D3.1] Danh sách thông báo
    - [D3.1.1] Nút: Xem thông báo
- [D4] Tài khoản
  - [D4.1] Nhận thông báo
    - [D4.1.1] Nút: Cài đặt nhận thông báo

## Việc

T1 · vai Lễ tân · Mẹ bé Minh Anh đang đứng ở quầy, muốn mua tiếp 12 buổi cho bé và trả tiền mặt.
T2 · vai Lễ tân · Một phụ huynh dẫn con 7 tuổi tới lần đầu, muốn cho bé theo học ở trung tâm.
T3 · vai Lễ tân · Bố bé Bảo Châu gọi điện: thứ Sáu này bé bận, xin cho bé học sáng thứ Bảy thay vào.
T4 · vai Lễ tân · Đầu ca chiều, ba phụ huynh đã nhắn qua app xin dời giờ học tuần này và đang chờ quầy trả lời.
T5 · vai Lễ tân · Kế toán báo khoản 1.680.000 ₫ của phụ huynh bé Gia Huy đã vào tài khoản sáng nay.
T6 · vai Lễ tân · Bơm lọc bể lớn hỏng lúc 15:00; các lớp từ 16:00 tới 19:00 chiều nay không học được.
T7 · vai Huấn luyện viên · 17:30, lớp của bạn ở làn 3 bắt đầu: chín bé tới, bé Khoa không tới.
T8 · vai Quản lý · 7 giờ sáng, HLV Tuấn nhắn bị ốm; hôm nay anh có ba lớp buổi chiều.
T9 · vai Phụ huynh · Bé Na sốt từ sáng, chiều nay không đi bơi được.
T10 · vai Phụ huynh · Tối nay bạn muốn biết gói của con còn học được tới bao giờ.
