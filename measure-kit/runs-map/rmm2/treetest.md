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
      - [A1.2.3] Nút: Ghi báo nghỉ thay phụ huynh
    - [A1.3] Cần xử lý hôm nay
      - [A1.3.1] Nút: Xử lý yêu cầu đổi lịch
      - [A1.3.2] Nút: Xác nhận tiền chuyển khoản đã về
      - [A1.3.3] Nút: Gọi mời gia hạn
  - [A2] Lịch tuần
    - [A2.1] Thanh công cụ
      - [A2.1.1] Menu …: Huỷ buổi học do trung tâm
    - [A2.2] Lưới làn × giờ
      - [A2.2.1] Trên dòng: Xem lớp: sĩ số, học viên, danh sách chờ
      - [A2.2.2] Xem lịch tuần toàn trung tâm
    - [A2.3] (bấm một dòng) → Buổi học
      - [A2.3.1] Đầu buổi
        - [A2.3.1.1] Nút: Xếp buổi học bù
      - [A2.3.2] Danh sách học viên
        - [A2.3.2.1] Trên dòng: Ghi báo nghỉ thay phụ huynh
  - [A3] Học viên
    - [A3.1] Thanh công cụ
      - [A3.1.1] Nút: Đăng ký học viên mới
      - [A3.1.2] Nút: Đặt buổi học thử
    - [A3.2] Tìm và lọc
      - [A3.2.1] Nút chính: Tìm học viên
    - [A3.3] Bảng học viên
      - [A3.3.1] Trên dòng: Cho học viên ngừng học
    - [A3.4] (bấm một dòng) → Hồ sơ học viên
      - [A3.4.1] Đầu hồ sơ
        - [A3.4.1.1] Xem hồ sơ học viên
        - [A3.4.1.2] Menu …: Sửa hồ sơ học viên và phụ huynh
        - [A3.4.1.3] Nút: Xếp học viên vào lớp
        - [A3.4.1.4] Nút: Đổi lịch học
        - [A3.4.1.5] Nút chính: Bán gói học và thu tiền
        - [A3.4.1.6] Trên dòng: Áp mã khuyến mãi khi bán gói (giai đoạn sau)
      - [A3.4.2] Tab Gói học
      - [A3.4.3] Tab Lịch học
      - [A3.4.4] Tab Đóng tiền
      - [A3.4.5] Nút: Bảo lưu gói học
  - [A4] Lớp
    - [A4.1] Bảng lớp
      - [A4.1.1] Xem lớp: sĩ số, học viên, danh sách chờ
    - [A4.2] (bấm một dòng) → Chi tiết lớp
      - [A4.2.1] Tab Học viên
        - [A4.2.1.1] Nút: Xếp học viên vào lớp
        - [A4.2.1.2] Trên dòng: Xoá học viên khỏi lớp
      - [A4.2.2] Tab Danh sách chờ
        - [A4.2.2.1] Nút: Đưa học viên vào danh sách chờ
        - [A4.2.2.2] Trên dòng: Gọi học viên trong danh sách chờ khi lớp có chỗ
      - [A4.2.3] Tab Buổi học
- Nhóm Gói và tiền
  - [A5] Gói học
    - [A5.1] Thanh công cụ
      - [A5.1.1] Nút: Bán gói học và thu tiền
    - [A5.2] Tab Tất cả gói
      - [A5.2.1] Xem danh sách gói học theo trạng thái
      - [A5.2.2] Trên dòng: Bảo lưu gói học
    - [A5.3] Tab Cần gia hạn
      - [A5.3.1] Nút: Gọi mời gia hạn
  - [A6] Thu chi
    - [A6.1] Tab Thu trong ngày
      - [A6.1.1] Trên dòng: Xác nhận tiền chuyển khoản đã về
      - [A6.1.2] Đối chiếu tiền thu cuối ngày
    - [A6.2] Tab Hoàn tiền
      - [A6.2.1] Nút: Lập đề nghị hoàn tiền
      - [A6.2.2] Trên dòng: Ghi ngày đã chi hoàn tiền
- Nhóm Phụ huynh
  - [A7] Yêu cầu đổi lịch
    - [A7.1] Danh sách yêu cầu
      - [A7.1.1] Nút chính: Xử lý yêu cầu đổi lịch
  - [A8] Thông báo
    - [A8.1] Thanh công cụ
      - [A8.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [A8.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
- Nhóm Báo cáo
  - [A9] Báo cáo
    - [A9.1] Tab Chuyên cần
      - [A9.1.1] Xem báo cáo chuyên cần
    - [A9.2] Tab Doanh thu

## Web quản trị · vai Quản lý
- Nhóm Hằng ngày
  - [B1] Tổng quan
    - [B1.1] Cần chú ý
      - [B1.1.1] Nút chính: Xem cảnh báo vận hành
      - [B1.1.2] Nút: Duyệt đề nghị hoàn tiền
    - [B1.2] Tháng này
      - [B1.2.1] Nút: Xem báo cáo chuyên cần
      - [B1.2.2] Nút: Xem báo cáo doanh thu
    - [B1.3] Việc nhanh
      - [B1.3.1] Nút: Phân HLV dạy thay
      - [B1.3.2] Nút: Gửi thông báo cho phụ huynh
  - [B2] Lịch tuần
    - [B2.1] Thanh công cụ
      - [B2.1.1] Menu …: Huỷ buổi học do trung tâm
      - [B2.1.2] Nút: Phân HLV dạy thay
    - [B2.2] Lưới làn × giờ
      - [B2.2.1] Trên dòng: Xem lớp: sĩ số, học viên, danh sách chờ
      - [B2.2.2] Xem lịch tuần toàn trung tâm
    - [B2.3] (bấm một dòng) → Buổi học
      - [B2.3.1] Danh sách học viên
        - [B2.3.1.1] Nút chính: Điểm danh buổi học
        - [B2.3.1.2] Trên dòng: Sửa điểm danh
  - [B3] Học viên
    - [B3.1] Thanh công cụ
      - [B3.1.1] Nút: Đăng ký học viên mới
    - [B3.2] Tìm và lọc
      - [B3.2.1] Nút chính: Tìm học viên
    - [B3.3] Bảng học viên
      - [B3.3.1] Trên dòng: Cho học viên ngừng học
    - [B3.4] (bấm một dòng) → Hồ sơ học viên
      - [B3.4.1] Đầu hồ sơ
        - [B3.4.1.1] Xem hồ sơ học viên
        - [B3.4.1.2] Menu …: Sửa hồ sơ học viên và phụ huynh
        - [B3.4.1.3] Nút: Xếp học viên vào lớp
        - [B3.4.1.4] Nút: Đổi lịch học
        - [B3.4.1.5] Nút chính: Bán gói học và thu tiền
      - [B3.4.2] Tab Gói học
      - [B3.4.3] Tab Lịch học
      - [B3.4.4] Tab Đóng tiền
      - [B3.4.5] Nút: Bảo lưu gói học
  - [B4] Lớp
    - [B4.1] Thanh công cụ
      - [B4.1.1] Menu …: Tạo khoá học
      - [B4.1.2] Nút: Mở lớp
    - [B4.2] Bảng lớp
      - [B4.2.1] Xem lớp: sĩ số, học viên, danh sách chờ
    - [B4.3] (bấm một dòng) → Chi tiết lớp
      - [B4.3.1] Tab Học viên
        - [B4.3.1.1] Nút: Xếp học viên vào lớp
        - [B4.3.1.2] Trên dòng: Xoá học viên khỏi lớp
      - [B4.3.2] Tab Danh sách chờ
      - [B4.3.3] Tab Buổi học
- Nhóm Gói và tiền
  - [B5] Gói học
    - [B5.1] Thanh công cụ
      - [B5.1.1] Nút: Bán gói học và thu tiền
    - [B5.2] Tab Tất cả gói
      - [B5.2.1] Xem danh sách gói học theo trạng thái
      - [B5.2.2] Trên dòng: Bảo lưu gói học
    - [B5.3] Tab Cần gia hạn
  - [B6] Thu chi
    - [B6.1] Tab Thu trong ngày
    - [B6.2] Tab Hoàn tiền
      - [B6.2.1] Trên dòng: Duyệt đề nghị hoàn tiền
- Nhóm Phụ huynh
  - [B7] Yêu cầu đổi lịch
  - [B8] Thông báo
    - [B8.1] Thanh công cụ
      - [B8.1.1] Nút chính: Gửi thông báo cho phụ huynh
      - [B8.1.2] Menu …: Gửi SMS cho phụ huynh chưa cài app (giai đoạn sau)
- Nhóm Quản trị
  - [B9] Báo cáo
    - [B9.1] Khoảng thời gian
      - [B9.1.1] Menu …: Xuất báo cáo ra Excel
    - [B9.2] Tab Chuyên cần
      - [B9.2.1] Xem báo cáo chuyên cần
    - [B9.3] Tab Doanh thu
      - [B9.3.1] Xem báo cáo doanh thu
  - [B10] Nhân viên
    - [B10.1] Thanh công cụ
      - [B10.1.1] Nút chính: Thêm, sửa tài khoản nhân viên
    - [B10.2] Bảng nhân viên
      - [B10.2.1] Trên dòng: Khoá, mở khoá tài khoản nhân viên
  - [B11] Nhật ký thao tác
    - [B11.1] Bảng nhật ký
      - [B11.1.1] Tra cứu nhật ký thao tác
  - [B12] Cài đặt
    - [B12.1] Tab Bảng giá
      - [B12.1.1] Nút: Sửa bảng giá gói học
    - [B12.2] Tab Ngày nghỉ lễ
      - [B12.2.1] Nút: Khai báo ngày nghỉ lễ
    - [B12.3] Tab Nhắc lịch
      - [B12.3.1] Nút: Cài đặt nhắc lịch tự động

## Web quản trị · vai HLV
- [C1] Buổi dạy hôm nay
  - [C1.1] Buổi đang dạy
    - [C1.1.1] Nút chính: Điểm danh buổi học
    - [C1.1.2] Trên dòng: Ghi cấp độ gợi ý sau buổi học thử
  - [C1.2] Các buổi hôm nay
    - [C1.2.1] Nút: Xem lịch dạy của tôi
    - [C1.2.2] Trên dòng: Sửa điểm danh
- [C2] Lớp
  - [C2.1] Bảng lớp
    - [C2.1.1] Xem lớp: sĩ số, học viên, danh sách chờ
  - [C2.2] (bấm một dòng) → Chi tiết lớp
    - [C2.2.1] Tab Học viên
      - [C2.2.1.1] Trên dòng: Ghi nhận xét kỹ năng cuối cấp độ (giai đoạn sau)
    - [C2.2.2] Tab Danh sách chờ
    - [C2.2.3] Tab Buổi học
- [C3] Học viên
  - [C3.1] Tìm và lọc
    - [C3.1.1] Nút chính: Tìm học viên
  - [C3.2] (bấm một dòng) → Hồ sơ học viên
    - [C3.2.1] Đầu hồ sơ
      - [C3.2.1.1] Xem hồ sơ học viên
    - [C3.2.2] Tab Gói học
    - [C3.2.3] Tab Lịch học
    - [C3.2.4] Tab Đóng tiền

## App phụ huynh · vai Phụ huynh
- [D1] Lịch học
  - [D1.1] Con đang xem
    - [D1.1.1] Nút: Chọn con đang xem
  - [D1.2] Buổi sắp tới
    - [D1.2.1] Nút chính: Xem lịch học của con
    - [D1.2.2] Trên dòng: Báo nghỉ một buổi
    - [D1.2.3] Trên dòng: Gửi yêu cầu đổi lịch
  - [D1.3] Số buổi còn lại
    - [D1.3.1] Nút: Xem gói học và số buổi còn lại
- [D2] Gói học
  - [D2.1] Số buổi còn lại
    - [D2.1.1] Nút chính: Xem gói học và số buổi còn lại
  - [D2.2] Lịch sử đóng tiền
    - [D2.2.1] Nút: Xem lịch sử đóng tiền
  - [D2.3] Nhận xét của HLV
    - [D2.3.1] Nút: Xem nhận xét tiến bộ của con (giai đoạn sau)
- [D3] Thông báo
  - [D3.1] Danh sách thông báo
    - [D3.1.1] Nút chính: Xem thông báo
- [D4] Tài khoản
  - [D4.1] Cài đặt thông báo
    - [D4.1.1] Nút: Tắt thông báo không khẩn

## Việc

T1 · vai Lễ tân · Một mẹ dẫn bé 5 tuổi tới quầy, muốn cho bé học bơi; nhà chưa có ai học ở trung tâm.
T2 · vai Lễ tân · Anh Minh tới quầy đóng thêm 12 buổi cho con, bé đang học lớp Cơ bản.
T3 · vai Lễ tân · Chị Lan gọi điện: bé Na sốt, chiều nay không tới bể được.
T4 · vai Lễ tân · Sáng nay ba phụ huynh nhờ chuyển con sang hôm khác qua app, chưa ai được trả lời.
T5 · vai Lễ tân · Mẹ bé Bin chuyển khoản hôm qua, giờ tiền đã vào tài khoản trung tâm.
T6 · vai Lễ tân · Mẹ bé Tôm gọi hỏi lớp Cơ bản tối thứ Ba còn nhận thêm bé không.
T7 · vai HLV · Lớp 17:30 vừa bắt đầu, các bé đã xuống nước; thầy cần ghi lại bé nào tới.
T8 · vai Quản lý · 7 giờ sáng, thầy Hùng nhắn bị sốt, hôm nay không dạy được.
T9 · vai Phụ huynh · Bé Su ốm từ sáng, mẹ muốn cho trung tâm biết chiều nay bé không tới.
T10 · vai Phụ huynh · Bố muốn biết bao giờ thì phải đóng tiền tiếp cho con.
