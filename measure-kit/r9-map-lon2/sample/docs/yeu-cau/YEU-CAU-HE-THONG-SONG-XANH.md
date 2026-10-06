# SÓNG XANH — YÊU CẦU HỆ THỐNG MỚI v1

> Ngày: 2026-09-18 · Người viết: BA · Đầu vào: phỏng vấn chủ trung tâm (`PV-1`, `PV-2`), quan sát quầy lễ tân hai buổi chiều, file Excel quản lý học viên năm 2025–2026.
> Đầu ra kế tiếp: `USE-CASE-SONG-XANH.md`, `BUSINESS-RULES-SONG-XANH.md`.
> ⏱ File này là bản tổng quan đầu tiên. Các quyết định chốt sau ngày 18/09 nằm ở `XUNG-DOT-SONG-XANH.md`; file này **không** sửa theo.

## Quy ước

| Tiền tố | Nghĩa |
|---|---|
| `YC-nn` | Nhu cầu nêu trong file này |
| `NF-nn` | Yêu cầu phi chức năng |
| `PV-n` | Buổi phỏng vấn |

**Mức độ tin cậy:** 🟢 **C** chủ trung tâm nói trực tiếp · 🟡 **I** BA suy ra từ quan sát hay dữ liệu · 🔴 **A** giả định làm việc.

---

## 1. Bối cảnh

Trung tâm bơi Sóng Xanh có một cơ sở ở quận Bình Thạnh: một bể 25 m sáu làn và một bể trẻ em. Trung tâm dạy bơi cho trẻ từ 4 đến 15 tuổi, khoảng 420 học viên đang học, 9 huấn luyện viên (HLV) và 3 lễ tân chia ca.

Hiện nay mọi thứ chạy bằng một file Excel dùng chung và nhóm Zalo:
- Lễ tân ghi học viên, gói học và tiền thu vào Excel. Cuối ngày đối chiếu tiền mặt bằng tay.
- HLV điểm danh trên giấy, cuối tuần lễ tân nhập lại vào Excel. Số buổi còn lại của từng bé thường sai lệch 1–2 buổi.
- Phụ huynh hỏi lịch, hỏi số buổi còn lại, báo nghỉ qua Zalo của lễ tân. Lễ tân trả lời trung bình 60–80 tin nhắn mỗi ngày.
- Chủ trung tâm không xem được doanh thu theo tháng khi chưa có kế toán tổng hợp.

## 2. Mục tiêu

1. Lễ tân thao tác ở **một chỗ**: hồ sơ, xếp lớp, gói học, thu tiền, lịch. 🟢 C
2. Số buổi còn lại **luôn đúng** vì điểm danh cập nhật ngay. 🟢 C
3. Phụ huynh tự xem lịch, số buổi còn lại và báo nghỉ trên app, bớt tin nhắn Zalo. 🟢 C
4. Chủ trung tâm xem doanh thu và chuyên cần theo tháng mà không cần chờ kế toán. 🟢 C

## 3. Bề mặt

| Bề mặt | Ai dùng | Thiết bị |
|---|---|---|
| **Web quản trị** | Quản lý trung tâm, lễ tân, HLV | Máy tính ở quầy; HLV dùng máy tính bảng ở thành bể |
| **App phụ huynh** | Phụ huynh | Điện thoại iOS và Android |

Học viên không có tài khoản riêng. 🟢 C

## 4. Nhu cầu

### 4.1. Học viên và lớp

| Mã | Nhu cầu | TC |
|---|---|:---:|
| YC-01 | Lưu hồ sơ học viên và phụ huynh; tìm nhanh theo tên, mã hoặc số điện thoại phụ huynh | 🟢 C |
| YC-02 | Quản lý khoá học theo cấp độ và mở lớp theo khung giờ cố định, gán HLV phụ trách | 🟢 C |
| YC-03 | Xếp học viên vào lớp đúng cấp độ, biết lớp nào còn chỗ | 🟢 C |
| YC-04 | Xem lịch toàn trung tâm theo ngày và theo tuần: lớp nào, làn nào, HLV nào | 🟢 C |
| YC-05 | Cho khách mới **học thử** trước khi mua gói | 🟢 C |

### 4.2. Lịch, điểm danh

| Mã | Nhu cầu | TC |
|---|---|:---:|
| YC-06 | HLV điểm danh ngay tại bể, số buổi còn lại tự trừ | 🟢 C |
| YC-07 | Phụ huynh **tự đổi lịch** học của con trên app khi bận | 🟡 I |
| YC-08 | Phụ huynh báo nghỉ trên app; báo trước **24 giờ** thì không mất buổi | 🟢 C |

### 4.3. Gói học, thanh toán

| Mã | Nhu cầu | TC |
|---|---|:---:|
| YC-09 | **Tạm dừng gói** khi bé ốm dài ngày hoặc cả nhà đi du lịch, không mất buổi đã đóng | 🟢 C |
| YC-10 | Bán gói, thu tiền mặt hoặc chuyển khoản, in biên lai có mã | 🟢 C |
| YC-11 | Phụ huynh xem số buổi còn lại, hạn dùng gói và các lần đã đóng tiền | 🟢 C |

### 4.4. Thông báo, báo cáo, quản trị

| Mã | Nhu cầu | TC |
|---|---|:---:|
| YC-12 | Gửi thông báo cho phụ huynh theo lớp hoặc cho cả trung tâm (nghỉ lễ, đổi giờ) | 🟢 C |
| YC-13 | Báo cáo doanh thu và chuyên cần theo tháng | 🟢 C |
| YC-14 | Tài khoản riêng cho từng nhân viên; lễ tân không xem doanh thu; quản lý quyết định huỷ buổi khi bể có sự cố | 🟢 C |

## 5. Yêu cầu phi chức năng

| Mã | Yêu cầu |
|---|---|
| NF-01 | Trang web quản trị mở trong dưới 2 giây trên đường truyền cáp quang của trung tâm |
| NF-02 | App chạy trên iOS 15 trở lên và Android 10 trở lên |
| NF-03 | Dữ liệu sao lưu tự động mỗi ngày, giữ 30 bản |
| NF-04 | Giao diện tiếng Việt; số tiền dạng `1.200.000 ₫`, ngày dạng `thứ Hai, 23/09` |
| NF-05 | Phụ huynh đăng nhập app bằng số điện thoại và mã OTP, không cần mật khẩu |

## 6. Ngoài phạm vi đã biết

- Bán đồ bơi, kính bơi tại quầy: vẫn ghi sổ riêng.
- Tính lương HLV: kế toán làm trên phần mềm kế toán hiện có.

---

## Phụ lục A — Bảng giá tham khảo năm 2026

| Cấp độ | Gói 8 buổi *(hạn 2 tháng)* | Gói 12 buổi *(hạn 3 tháng)* | Gói 24 buổi *(hạn 6 tháng)* |
|---|---:|---:|---:|
| Làm quen nước *(4–6 tuổi)* | 1.280.000 ₫ | 1.800.000 ₫ | 3.360.000 ₫ |
| Cơ bản | 1.200.000 ₫ | 1.680.000 ₫ | 3.120.000 ₫ |
| Nâng cao | 1.440.000 ₫ | 2.040.000 ₫ | 3.840.000 ₫ |

Ghi chú của chủ trung tâm (`PV-2`): giá đổi khoảng hai lần một năm, và mỗi đợt khai giảng hè có giá riêng. **Quản lý tự sửa bảng giá trên hệ thống** khi có đợt giá mới, không phải nhờ người làm phần mềm. Giá mới chỉ áp cho gói bán từ ngày sửa trở đi; gói đã bán giữ giá cũ.
