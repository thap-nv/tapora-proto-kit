# SÓNG XANH — XẾP ƯU TIÊN PHẠM VI v1

> Ngày: 2026-09-22 · Cách xếp: MoSCoW theo giá trị cho quầy lễ tân và phụ huynh, rủi ro sai số buổi, và phụ thuộc giữa các phần.
> **GĐ1** phát hành tháng 11/2026 · **GĐ2** dự kiến quý 1/2027.

## Quy ước

| Tiền tố | Nghĩa |
|---|---|
| `M-nn` | Must — phải có ở GĐ1 |
| `S-nn` | Should — nên có; ghi rõ GĐ |
| `CO-nn` | Could — có thì tốt; GĐ2 |
| `W-nn` | Won't — không làm trong năm 2026 |

---

## Summary

9 Must, 4 Should, 2 Could, 1 Won't. GĐ1 gồm mọi Must và ba Should đầu. Thứ tự trong bảng là thứ tự **cắt** khi thiếu thời gian, không phải thứ tự **xây**: Must xây theo phụ thuộc dữ liệu, học viên và lớp trước, gói và điểm danh sau.

## Bảng xếp hạng

| Mã | Hạng mục | Lý do | UC · rule | GĐ |
|---|---|---|---|:---:|
| M-01 | Hồ sơ học viên và phụ huynh, mã tự sinh, tìm nhanh | Mọi phần khác cần định danh học viên | `UC-01` `BR-HV-01/02` | GĐ1 |
| M-02 | Khoá học, lớp, xếp lớp, danh sách chờ | Lễ tân xếp lớp hằng ngày, hiện làm trên Excel | `UC-03` `UC-04` `BR-LH-04` | GĐ1 |
| M-03 | Lịch, buổi học tự sinh, đổi lịch | Gốc của điểm danh và số buổi còn lại | `UC-08` `BR-LI-01/02` `XD-02` | GĐ1 |
| M-04 | Điểm danh tại bể | Mục tiêu 2: số buổi còn lại luôn đúng | `UC-05` `BR-DD-01…05` | GĐ1 |
| M-05 | Bán gói, thu tiền, biên lai | Tiền vào; đối chiếu cuối ngày | `UC-02` `BR-TT-01/02/03` | GĐ1 |
| M-06 | App phụ huynh: lịch, số buổi còn lại, báo nghỉ, yêu cầu đổi lịch, thông báo | Mục tiêu 3: bớt tin nhắn Zalo | `UC-06` `UC-07` `XD-02` | GĐ1 |
| M-07 | Bảo lưu gói | Khiếu nại nhiều nhất năm 2025 | `UC-09` | GĐ1 |
| M-08 | Tài khoản nhân viên, phân quyền, nhật ký thao tác | Bảo vệ doanh thu và số buổi khi có khiếu nại | `UC-12` `BR-QT-01…05` | GĐ1 |
| M-09 | Thông báo cho phụ huynh, nhắc lịch tự động | Đi cùng app phụ huynh | `UC-10` `BR-TB-01…04` | GĐ1 |
| S-01 | Báo cáo chuyên cần và doanh thu | Mục tiêu 4; tạm thời kế toán vẫn tổng hợp được | `UC-11` | GĐ1 |
| S-02 | Danh sách học viên sắp hết buổi để gọi mời gia hạn | Doanh thu tái tục; hiện lễ tân lọc Excel | `BR-TT-06` | GĐ1 |
| S-03 | Học thử miễn phí | Kênh có khách mới chính, hiện ghi sổ tay | `BR-LH-06` | GĐ1 |
| S-04 | Đánh giá tiến bộ: HLV ghi nhận xét kỹ năng cuối mỗi cấp độ, phụ huynh xem trên app | Phụ huynh hỏi nhiều, nhưng HLV chưa thống nhất mẫu nhận xét | — | GĐ2 |
| CO-01 | Mã khuyến mãi khi bán gói | Đợt hè có khuyến mãi, hiện giảm tay | — | GĐ2 |
| CO-02 | Gửi SMS cho phụ huynh chưa cài app | Khoảng 15 % phụ huynh lớn tuổi chưa dùng app | `BR-TB-01` | GĐ2 |
| W-01 | Thanh toán online qua ví điện tử ngay trong app | Chi phí cổng thanh toán; quầy vẫn thu được | — | — |

## Findings

- `S-03` *(học thử)* không có use case riêng; quy tắc đủ chi tiết ở `BR-LH-06`.
- `M-06` gồm *yêu cầu đổi lịch* theo `XD-02`, không phải tự đổi lịch như `YC-07`.
