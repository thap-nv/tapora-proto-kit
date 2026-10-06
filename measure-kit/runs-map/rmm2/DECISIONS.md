# Nhật ký quyết định — Sóng Xanh

> Mỗi cổng một khối, Cổng 1–2 do `sketch-to-concept` ghi, Cổng 3–4 do `sketch-to-site` ghi. **Đáp án ghi nguyên văn** lời người dùng. Cổng bị bỏ qua thì vẫn ghi: ai cho phép bỏ qua, và nguyên văn câu cho phép.

## 🛑 Cổng 1 · Brief concept — 29/09/2026 *(sketch-to-concept)*
| Câu hỏi | Đáp án (nguyên văn) | Ghi chú |
|---|---|---|
| Loại sản phẩm *(nhiều bề mặt: liệt kê từng bề mặt)* | "Web quản trị cho quản lý, lễ tân, HLV và app cho phụ huynh." | Hệ thống nhiều bề mặt |
| Nền tảng app *(nếu có app)* | "Cả iOS và Android." | |
| Người dùng chính + thiết bị | "Lễ tân ngồi máy tính cả ngày, HLV cầm máy tính bảng ở bể, phụ huynh dùng điện thoại." | |
| Tham chiếu + mức bám | "Không có tham chiếu." | |
| Khác biệt · Định hướng *(nếu brief còn trống)* | "Trong, mát, ngăn nắp." | |

## 🛑 Cổng 2 · Concept — 30/09/2026 *(sketch-to-concept)*
| Vòng | Concept | Nguồn | Ý *(một câu)* | Họ phong cách | Màn then chốt · khung |
|---|---|---|---|---|---|
| 1 | a | hợp nhất | Sổ tay quầy | Biên tập tối giản | Danh sách học viên · bảng |
| 1 | b *(Khuyến nghị)* | hợp nhất | Mỗi lớp là một làn bơi | Công cụ vận hành | Lịch tuần · lưới làn × giờ |
| 1 | c | lăng kính studio: thể thao | Đồng hồ bấm giờ | Kỹ thuật tối | Lịch ngày · vòng thời gian |
**Bảng:** `concept/index.html` · **Chấm lớp Ý** *(review độc lập)*: a 6/10 · b 7/10 · c 6/10
**Đáp án concept (nguyên văn):** "Chọn B, làn bơi."
**Mã trộn (nếu có):** không
**Nền:** một nền sáng · **Nhịp:** như concept

## 🛑 Cổng Bản đồ — 06/10/2026 *(sketch-to-map, dự án lớn)*
**Lúc trình:** Kiểm kê: 62 chức năng (58 phạm vi · 4 hoãn · 5 suy) · 10 module · 4 vai · Chỉ số bố cục: (1) lối tắt đá đi không đường về 0 · (12) vai thiếu trang chủ 0, nhóm menu theo đợt 0 · (7) mã lộ 0 · (2) T1 xa nhất 3 bước (F-26, quan-ly, ≈ 11,1 giây), việc hằng ngày xa nhất 3 bước (F-12, le-tan, ≈ 11,1 giây) · (5) màn dày nhất ho-so 6 chức năng, 3 tab · (4) nhóm menu dài nhất 4 · (6) việc mang nhiều nhãn 0 · Soát nhãn: 10/10 việc tới đúng nút · 5 lần quay lại · nhãn đã sửa: thêm Bán gói học và thu tiền vào Quầy hôm nay và thanh công cụ Gói học · chuyển Xác nhận tiền chuyển khoản đã về sang Thu chi · Phân HLV dạy thay lên thanh công cụ Lịch tuần · vùng "Gói hiện tại" của app đổi thành "Số buổi còn lại"
**Nguồn:** 7 tài liệu · 12 UC (0 thiếu) · 9 Must (0 thiếu) · 1 bước chuyển (0 thiếu) · 7 nhóm trạng thái (0 thiếu) · 55 mục (0 chưa có chức năng)
**Câu hỏi và lựa chọn** *(ghi ngay lượt hỏi; 5 câu nên hỏi hai lượt, câu mâu thuẫn trước: lượt 1 là 4a, 4b, 1, 2; lượt 2 là 3)*:
1. Bản đồ: Duyệt *(Khuyến nghị)* · Sửa nhóm hay điều hướng · Đổi chỗ, đổi tầng vài chức năng · Thiếu hay thừa chức năng
2. Chức năng suy ra *(Khai báo ngày nghỉ lễ F-19 · Ghi báo nghỉ thay phụ huynh F-30 · Đối chiếu tiền thu cuối ngày F-43 · Tắt thông báo không khẩn F-49 · Đổi mật khẩu F-59)*: Giữ cả *(Khuyến nghị)* · Bỏ cả · Chọn từng cái
3. Đợt đầu: Gói Must của GĐ1: Học viên, Tài khoản, Lớp, Lịch, Gói học, Điểm danh, Thông báo *(Khuyến nghị)* · Toàn bộ phạm vi GĐ1: 7 module trên cộng Học thử, Báo cáo · Một module thử 2–3 màn: Lịch *(Lịch tuần, Buổi học, Yêu cầu đổi lịch; lớp và học viên là dữ liệu mẫu)*
4a. Mâu thuẫn, báo nghỉ khi buổi đã bắt đầu *(D3:284 tiền điều kiện UC-07 "buổi chưa bắt đầu" với D2:31 A-04 "app vẫn nhận báo nghỉ")*: Theo A-04: app vẫn nhận, ghi vắng không phép, nói rõ buổi bị trừ *(Khuyến nghị)* · Theo UC-07: buổi đã bắt đầu thì app không cho báo nghỉ
4b. Mâu thuẫn, HLV dạy thay *(D2:29 A-02 "lớp vẫn thuộc HLV cũ" với D1:99 BR-QT-02 "HLV chỉ thấy lớp mình phụ trách")*: HLV dạy thay thấy buổi được giao và học viên của buổi đó trong ngày, điểm danh được *(Khuyến nghị)* · Quản lý điểm danh thay cho buổi dạy thay · Giao tạm cả lớp cho HLV dạy thay trong ngày đó
**Đáp án bản đồ (nguyên văn):** *(chờ người dùng)*
**Chức năng suy ra (nguyên văn):** *(chờ người dùng)*
**Đợt đầu (nguyên văn):** *(chờ người dùng)* · module đợt 1: *(chờ)*
**Mâu thuẫn (nguyên văn, mỗi câu một dòng):** *(chờ người dùng)*
**Bấm thử** *(kết quả người dùng dán; việc Khó và chỗ đã sửa)*: *(chờ người dùng)*
