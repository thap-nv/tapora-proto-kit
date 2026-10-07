# YÊU CẦU HỆ THỐNG ĐẶT LỊCH — CHUỖI PHÒNG KHÁM ĐA KHOA (đã chốt)

> Tài liệu này là requirement **đã chốt** của giai đoạn 1; schema hiện có (`docs/database/schema.dbml` v1.0) thực hiện nó. Nhu cầu dữ liệu mới của giai đoạn 2 ở `NHU-CAU-DU-LIEU-MOI.md`.

| Mã | Nội dung |
|---|---|
| R-01 | Một tổ chức có nhiều phòng khám (chi nhánh). Dữ liệu của tổ chức này không bao giờ hiện cho tổ chức khác. |
| R-02 | Một người (bệnh nhân, bác sĩ, nhân viên) chỉ có **một** hồ sơ danh tính; tên và số điện thoại sửa ở một chỗ. |
| R-03 | Bệnh nhân đặt lịch khám qua lễ tân; mỗi bệnh nhân có tối đa một hồ sơ bệnh nhân trong một tổ chức. |
| R-04 | **Mỗi lịch hẹn có đúng một bác sĩ phụ trách.** |
| R-05 | Mỗi bác sĩ thuộc một phòng khám chính và có ca làm việc cố định theo thứ trong tuần. |
| R-06 | Mỗi phòng khám có nhiều phòng khám bệnh (rooms), tên phòng không trùng trong cùng một phòng khám. |
| R-07 | Danh mục dịch vụ có giá hiện hành; một lịch hẹn có thể gồm nhiều dịch vụ với số lượng. |
| R-08 | Mỗi lịch hẹn đã khám có một hóa đơn; hóa đơn có thể được thanh toán nhiều lần; hoàn tiền là dòng thanh toán mới mang số âm. |
| R-09 | Nhân viên và bác sĩ đăng nhập bằng email và mật khẩu; mật khẩu không bao giờ lưu nguyên văn. |
| R-10 | Lễ tân chỉ thấy dữ liệu phòng khám của mình; quản trị viên thấy toàn tổ chức. |
| R-11 | Báo cáo doanh thu theo ngày, theo phòng khám, theo bác sĩ. |
| R-12 | Bệnh nhân hủy lịch trước giờ hẹn 2 tiếng thì không tính phí. |
