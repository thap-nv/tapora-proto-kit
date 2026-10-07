# NHU CẦU DỮ LIỆU MỚI — giai đoạn 2 (chưa vào schema)

> Danh sách do bộ phận vận hành gửi. Mỗi dòng là **một nhu cầu cần được đáp ứng** hoặc một **yêu cầu** như người viết nêu — chưa qua phân tích dữ liệu. Schema hiện tại: `docs/database/schema.dbml` (v1.0), requirement đã chốt: `YEU-CAU-PHONG-KHAM.md` (R-01 → R-12).

| Mã | Nhu cầu |
|---|---|
| N-01 | Hóa đơn phải in đúng **giá dịch vụ lúc khám**, dù sau đó bảng giá đổi. |
| N-02 | Hệ thống **không cho một bác sĩ có hai lịch hẹn trùng thời gian**. Mỗi lịch hẹn có giờ bắt đầu và giờ kết thúc. |
| N-03 | Một nhân viên lễ tân có thể đồng thời là bệnh nhân của phòng khám; một bác sĩ có thể là người bảo hộ của bệnh nhân nhỏ tuổi. Cần ghi được quan hệ bảo hộ (ai bảo hộ ai, từ ngày nào). |
| N-04 | Mỗi bệnh nhân có **mã hồ sơ** duy nhất trong tổ chức. Hồ sơ có thể bị ẩn (xóa) khỏi danh sách; mã của hồ sơ đã ẩn **được cấp lại** cho người khác. |
| N-05 | Lịch hẹn có thể kèm một khoản **đặt cọc** bằng tiền, ghi ngày nhận cọc. |
| N-06 | Nhân viên có thể gắn **ghi chú nội bộ** vào một lịch hẹn, một bệnh nhân hoặc một hóa đơn. |
| N-07 | Một bệnh nhân có thể có **nhiều dị ứng** (tên chất, mức độ nặng/nhẹ); lễ tân tra được bệnh nhân theo từng chất gây dị ứng. |
| N-08 | **Chuyên khoa** của bác sĩ do quản trị viên tự thêm hoặc bớt trên màn hình quản trị; một bác sĩ có thể thuộc nhiều chuyên khoa. |
| N-09 | Lịch hẹn có các trạng thái: *đã đặt, đã xác nhận, đã đến, vắng mặt, đã hủy*. Từ *đã xác nhận* có thể sang *đã đến* hoặc *vắng mặt*; từ *đã đặt* có thể sang *đã xác nhận* hoặc *đã hủy*. |
| N-10 | Hồ sơ bệnh nhân hiển thị **tổng số lần khám đã hoàn thành**. |
| N-11 | **Mã dịch vụ** (ví dụ `KHAM-TQ`) duy nhất trong mỗi tổ chức; hai tổ chức khác nhau có thể dùng cùng một mã. |
| N-12 | Hóa đơn gắn với lịch hẹn; lễ tân tra cứu hóa đơn **theo lịch hẹn** và **theo bệnh nhân** phải nhanh khi có hàng triệu hóa đơn. |
| N-13 | Khi **ẩn một bệnh nhân** khỏi danh sách, hóa đơn và thanh toán của người đó vẫn phải còn để kế toán đối chiếu; lịch hẹn tương lai của người đó thì tự hủy. |
| N-14 | Bác sĩ đăng nhập cổng riêng bằng email và mật khẩu. Để hỗ trợ khi bác sĩ quên, **hệ thống ghi lại mật khẩu** để quản trị viên đọc cho họ. |
| N-15 | Mỗi bệnh nhân có **tối đa một hồ sơ bảo hiểm** (số thẻ, nhà bảo hiểm, hạn dùng). |
| N-16 | **Ca khám nhóm** (tư vấn gia đình) có **từ hai bác sĩ trở lên** cùng phụ trách một lịch hẹn. |
| N-17 | **Không cho đặt hai ca phẫu thuật vào cùng một phòng mổ vào giờ trùng nhau.** |
| N-18 | **Lưu số buổi điều trị còn lại** của gói trị liệu trên hồ sơ bệnh nhân để lễ tân nhìn thấy ngay. |
| N-19 | **Mỗi chi nhánh có bảng lịch hẹn riêng** (`appointments_hn`, `appointments_hcm`, `appointments_dn`) để báo cáo từng chi nhánh chạy nhanh. |
| N-20 | **Lưu ảnh khuôn mặt bệnh nhân** (kể cả trẻ em) để nhận diện khi đến khám; **giữ vô thời hạn**; mọi lễ tân đều xem được. |
