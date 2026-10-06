# SÓNG XANH — CA BIÊN v1

> Ngày: 2026-09-21 · Đầu vào: `USE-CASE-SONG-XANH.md`, `BUSINESS-RULES-SONG-XANH.md`, quan sát quầy hai buổi chiều (`QS`).

## Quy ước

| Nhãn | Nghĩa |
|:---:|---|
| **🔴 CR** | **Cần làm rõ yêu cầu** — chưa có quy tắc nào trả lời, không tự quyết được |
| **🟢 AC** | Quy tắc đã đủ rõ → **viết thẳng tiêu chí nghiệm thu** |
| **⚠️ XD** | **Xung đột giữa hai quyết định đã chốt** — phải gỡ trước |

| Tiền tố | Nghĩa |
|---|---|
| `A-nn` | Ca biên |
| `OQ-nn` | Câu hỏi mở cho chủ trung tâm |

---

## Summary

10 ca biên. Hai ca cần làm rõ (`A-07`, `A-08`), một ca đang xung đột (`A-03`, gỡ ở `XD-04`). Nhóm nguy hiểm nhất là các ca làm lệch số buổi còn lại: `A-03`, `A-05`.

## Danh sách

| Mã | Tình huống | Nhãn | Xử lý | Liên quan |
|---|---|:---:|---|---|
| A-01 | Hai lễ tân cùng xếp hai học viên khác nhau vào chỗ cuối cùng của một lớp, cùng lúc | 🟢 AC | Người lưu sau nhận báo *lớp vừa đủ sĩ số*, kèm gợi ý đưa vào danh sách chờ | `UC-04` `BR-LH-04` |
| A-02 | HLV báo nghỉ đột xuất trong ngày | 🟢 AC | Quản lý chọn một HLV khác **dạy thay** cho các buổi trong ngày của HLV đó; chỉ đổi người dạy của những buổi ấy, lớp vẫn thuộc HLV cũ. Phụ huynh nhận thông báo tên HLV dạy thay. Không có ai thay thì huỷ buổi theo `BR-TT-07` | `UC-05` `BR-TT-07` `BR-TB-03` |
| A-03 | Bể đóng cửa đột xuất vì sự cố kỹ thuật *(bơm lọc hỏng, nước đục)*, có khi cả buổi chiều | ⚠️ XD | Huỷ **tất cả** các buổi trong khoảng giờ bị ảnh hưởng một lần, không huỷ từng buổi. Mỗi buổi bị huỷ được cộng bù theo `BR-TT-07`; phụ huynh của mọi buổi đó nhận thông báo khẩn (`BR-TB-03`). Ai thực hiện: xem `XD-04` | `BR-TT-07` `BR-TB-03` `YC-14` |
| A-04 | Phụ huynh báo nghỉ khi buổi đã bắt đầu, hoặc trễ hơn thời hạn báo trước | 🟢 AC | App vẫn nhận báo nghỉ, ghi *vắng không phép*, và nói rõ buổi này **bị trừ** | `UC-07` `BR-DD-03` |
| A-05 | Bé đến lớp khi gói đã hết buổi hoặc đã hết hạn | 🟢 AC | Trên danh sách điểm danh, HLV thấy bé bị đánh dấu *hết buổi* hoặc *hết hạn*, không điểm danh có mặt được. HLV đưa bé ra quầy; lễ tân **bán gói mới ngay tại chỗ**, buổi hôm nay tính vào gói mới, rồi bé vào lớp | `UC-05` `UC-02` `BR-TT-04` |
| A-06 | Anh chị em được xếp vào hai lớp khác nhau cùng giờ | 🟢 AC | Hệ thống cảnh báo lễ tân khi xếp lớp; lễ tân vẫn lưu được nếu phụ huynh đồng ý | `UC-04` `BR-HV-03` |
| A-07 | HLV đề xuất cho bé lên cấp độ cao hơn khi gói còn buổi | 🔴 CR | Chuyển lớp giữ nguyên số buổi còn lại. Chưa rõ có thu thêm chênh lệch giá giữa hai cấp độ không → `OQ-02` | `UC-08` `BR-LH-03` |
| A-08 | Phụ huynh xin hoàn tiền các buổi còn lại vì chuyển nhà | 🔴 CR | Chưa có chính sách → `OQ-01`. Trong lúc chờ: lễ tân ghi chú vào hồ sơ, báo quản lý | `BR-TT-08` |
| A-09 | Lễ tân bấm *Thu tiền* hai lần vì mạng chậm | 🟢 AC | Chỉ một khoản thu được ghi; lần bấm thứ hai không tạo khoản mới | `UC-02` |
| A-10 | Máy tính bảng ở thành bể mất sóng lúc HLV lưu điểm danh | 🟢 AC | Điểm danh lưu tạm trên máy, tự gửi khi có mạng lại | `UC-05` |

## Câu hỏi mở

| Mã | Câu hỏi | Chặn |
|---|---|---|
| OQ-01 | Chính sách hoàn tiền khi phụ huynh tự xin nghỉ hẳn là gì: hoàn theo giá buổi, trừ phí, hay không hoàn? | `A-08` |
| OQ-02 | Lên cấp độ giữa chừng có thu thêm chênh lệch giá không? | `A-07` |
| OQ-03 | HLV có được xem số điện thoại phụ huynh của lớp mình không? | `BR-QT-02` |
