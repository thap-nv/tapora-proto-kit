# Design System: Sóng Xanh

> **Chưa khoá.** Bản nháp B2 ngày 05/10/2026: mới có **mục 9 *(sơ đồ trang)*** và đề xuất phạm vi. Mục 0–8, 10, 11 điền ở phần design system của B2, rồi khoá ở **Cổng 3**. Sửa sau ngày khoá thì ghi vào `DECISIONS.md` và cập nhật bảng *Lịch sử* cuối file.
> Viết theo khuôn ngữ nghĩa của `stitch-design-taste`: **tên mô tả + giá trị chính xác + vai trò**.

## 0. Bản đọc thiết kế
*(chưa điền: phần design system của B2)*

## 1. Không khí
*(chưa điền)*

## 2. Màu và vai trò
*(chưa điền: nguồn là `CONCEPT.md` mục 3 tới khi `site/assets/themes.json` được điền)*

## 2b. Theme
*(chưa điền)*

## 3. Chữ
*(chưa điền)*

## 4. Hình khối
*(chưa điền)*

## 5. Component · 8 trạng thái
*(chưa điền)*

## 6. Bố cục
*(chưa điền)*

## 7. Chuyển động
*(chưa điền)*

## 8. Cấm riêng của dự án
*(chưa điền)*

## 9. Sơ đồ trang
> Nguồn: `docs/yeu-cau/` *(UC-01…12, BR-*, A-01…10, XD-01…04 đè các file khác, `schema.dbml`)*. Chỉ GĐ1. **26 màn:** 16 web quản trị *(A1–A16)* + 10 app phụ huynh *(P1–P10)*, thêm trang lối vào `site/index.html` và vỏ tổng quan `site/app/index.html` *(khung máy, đổi iOS/Android; không tính là màn)*. Lớp phủ *(hộp thoại, ngăn trượt, sheet)* nằm trong màn mẹ, không tính riêng.
> Vai: **QL** Quản lý · **LT** Lễ tân · **HLV** Huấn luyện viên · **PH** Phụ huynh. Quyền theo ma trận `USE-CASE` mục 4.

| Bề mặt | Trang / màn | Section theo thứ tự | Hành động chính | Dữ liệu cần |
|---|---|---|---|---|
| Chung | **Lối vào** · `index.html` | Logo sóng, tên trung tâm · hai lối: Web quản trị *(chọn vai demo QL, LT, HLV)* và App phụ huynh *(khung máy)* · gợi ý mở hai tab cạnh nhau để xem luồng xuyên bề mặt · liên kết `?reset` về dữ liệu mẫu | Mở Web quản trị | Vai demo, tên nhân viên mẫu |
| Web quản trị | **A1 · Lịch tuần** *(màn then chốt, `concept/b.html`)* · `admin/lich.html` · QL, LT; HLV thấy lịch dạy của mình | 1. Thanh công cụ: tuần trước · tuần này · tuần sau, Tuần/Ngày, lọc bể, cấp độ, HLV, chú giải *(còn chỗ, đủ sĩ số, có chờ, huỷ, dạy thay, ngày lễ)* · 2. Lưới làn × giờ: cột Làn 1–6 bể 25 m + Bể trẻ em, hàng là giờ; ô lớp ghi cấp độ, HLV, sĩ số `x/10` và vạch chỗ trống · 3. Ngăn chi tiết bên phải *(bấm ô lớp)*: lớp, HLV hoặc HLV dạy thay, bể · làn · giờ, học viên *(buổi còn lại, báo nghỉ hôm đó)*, danh sách chờ theo thứ tự · 4. Lớp phủ: **Huỷ buổi do sự cố** *(LT, QL: ngày, khoảng giờ, bể, lý do → xem trước số buổi, số học viên → huỷ và gửi thông báo khẩn, A-03, XD-04)* · **Đổi người dạy** *(QL, A-02)* · Chế độ xếp lớp `?xep=SX-0412`: ô đúng cấp độ còn chỗ sáng, ô khác mờ, cảnh báo anh chị em trùng giờ *(A-06)* | Xếp học viên vào lớp đang chọn | `lop`, `khoa_hoc` *(cấp độ, sĩ số tối đa)*, `buoi_hoc` *(trạng thái, `hlv_day_id`)*, `xep_lop` *(đang học, chờ chỗ)*, `nhan_vien`, `ngay_nghi_le`, `diem_danh` *(báo nghỉ)* |
| Web quản trị | **A2 · Việc cần xử lý** · `admin/viec.html` · QL, LT | 1. Hôm nay, đếm theo nhóm · 2. Yêu cầu đổi lịch từ app *(chờ xử lý; quá 24 giờ gắn nhãn, đã báo QL)*: Đổi lịch · Từ chối kèm lý do · 3. Chuyển khoản chờ xác nhận *(UC-02 4a)* · 4. Lớp vừa có chỗ mà còn người chờ: người chờ đầu, SĐT *(BR-LH-04)* · 5. Gọi mời gia hạn: còn ≤ 2 buổi, ghi kết quả cuộc gọi *(S-02)* · 6. Đề nghị hoàn tiền buổi bù *(BR-TT-08)*: LT theo dõi, QL duyệt hoặc từ chối, LT ghi ngày đã chi · 7. Báo nghỉ hôm nay *(chỉ đọc)* · Rỗng: "Đã xử lý hết việc hôm nay" | Xử lý yêu cầu đổi lịch đầu tiên | `yeu_cau_doi_lich`, `goi_hoc` + `thanh_toan` *(chờ xác nhận tiền)*, `xep_lop` *(chờ chỗ)*, `goi_gia_han`, `hoan_tien`, `diem_danh` |
| Web quản trị | **A3 · Học viên** · `admin/hoc-vien.html` · QL, LT; HLV chỉ học viên lớp mình | 1. Tìm theo tên, mã, SĐT phụ huynh *(ra kết quả từ ký tự thứ ba)* · 2. Lọc: trạng thái *(đang học, học thử, ngừng học)*, cấp độ, gói *(sắp hết buổi, hết hạn, bảo lưu, chờ xác nhận tiền)* · 3. Bảng: mã, họ tên, tuổi, phụ huynh · SĐT, lớp, buổi còn lại *(căn phải)*, hạn gói, trạng thái; sắp xếp, 50 dòng một trang · 4. Đang tải, rỗng, lỗi | Đăng ký học viên mới | `hoc_vien`, `phu_huynh`, `xep_lop`, `lop`, `goi_hoc` |
| Web quản trị | **A4 · Đăng ký học viên** · `admin/hoc-vien-moi.html` · QL, LT | 1. Tìm phụ huynh theo SĐT → có rồi thì hiện phụ huynh và các con đang học *(UC-01 1a)* · 2. Phụ huynh: họ tên, SĐT, quan hệ · 3. Học viên: họ tên, ngày sinh *(tính tuổi)*, giới tính, ghi chú sức khoẻ *(bắt buộc khi dưới 6 tuổi, 3a)*, loại: chính thức · học thử · 4. Học thử: chọn một buổi ở lớp còn chỗ, đúng tuổi *(S-03, BR-LH-06)* · 5. Thanh dưới: Lưu hồ sơ; lưu xong mời sang Bán gói | Lưu hồ sơ | `phu_huynh`, `hoc_vien` *(mã `SX-xxxx` sinh khi lưu)*, `lop` + `buoi_hoc` còn chỗ |
| Web quản trị | **A5 · Hồ sơ học viên** · `admin/hoc-vien-chi-tiet.html?id=SX-0412` · QL, LT; HLV xem, không sửa | 1. Đầu hồ sơ: tên, mã, tuổi, cấp độ, trạng thái, ghi chú sức khoẻ nổi rõ; phụ huynh, SĐT, anh chị em · 2. Gói hiện tại: buổi còn lại / tổng *(+ buổi bù)*, hạn dùng, vắng có phép x/3, bảo lưu, gói nối tiếp · 3. Tab: Buổi học *(đã học, sắp tới, trạng thái điểm danh)* · Thanh toán *(biên lai)* · Gọi gia hạn và ghi chú · Nhật ký · 4. Lớp phủ: **Đổi lịch** *(một buổi · chuyển lớp cố định; gợi ý lớp cùng cấp độ còn chỗ, cùng HLV lên trước)* · **Bảo lưu** *(ngày bắt đầu, số ngày ≤ 30, hạn mới)* · **Đề nghị hoàn tiền** · **Ngừng học** | Bán gói | `hoc_vien`, `phu_huynh`, `goi_hoc`, `bao_luu`, `buoi_hoc` + `diem_danh`, `thanh_toan`, `goi_gia_han`, `hoan_tien`, `nhat_ky` |
| Web quản trị | **A6 · Bán gói và thu tiền** · `admin/ban-goi.html?id=SX-0412` · QL, LT | 1. Học viên, cấp độ, gói đang có *(gói mới nối tiếp, UC-02 2a)* · 2. Chọn gói 8 · 12 · 24 buổi, giá hiện hành của cấp độ, hạn dùng · 3. Hình thức: tiền mặt · chuyển khoản *(chưa về thì lưu chờ xác nhận, 4a)* · 4. Tóm tắt, hộp thoại xác nhận · 5. Biên lai: mã, ngày, gói, số tiền, người thu, In biên lai · Bấm hai lần chỉ ghi một khoản *(A-09)* | Thu tiền và in biên lai | `bang_gia` *(hiện hành)*, `goi_hoc`, `thanh_toan` *(mã biên lai)*, `nhan_vien` |
| Web quản trị | **A7 · Lớp và khoá học** · `admin/lop.html` · QL sửa; LT xem | 1. Lọc cấp độ, ngày, giờ, HLV, còn chỗ *(UC-04 bước 1)* · 2. Bảng lớp nhóm theo khoá: lớp, cấp độ, HLV, ngày · giờ, bể · làn, sĩ số x/tối đa, số chờ · 3. Khoá học *(QL)*: tên, cấp độ, sĩ số tối đa | Mở lớp mới *(QL)* | `khoa_hoc`, `lop`, `xep_lop`, `nhan_vien` |
| Web quản trị | **A8 · Chi tiết lớp** · `admin/lop-chi-tiet.html?id=…` · QL, LT; HLV lớp mình | 1. Lớp, HLV, lịch, bể · làn, sĩ số · 2. Học viên đang học *(buổi còn lại, hạn, ghi chú sức khoẻ)* · 3. Danh sách chờ theo thứ tự đăng ký: gọi, xếp vào khi có chỗ · 4. Buổi sắp tới và đã qua *(đã điểm danh, dạy thay, huỷ)* | Xếp người chờ đầu tiên vào lớp | `lop`, `xep_lop` *(`thu_tu_cho`)*, `buoi_hoc`, `goi_hoc` |
| Web quản trị | **A9 · Mở lớp** · `admin/lop-moi.html` · QL | 1. Khoá học: chọn hoặc tạo *(tên, cấp độ, sĩ số tối đa)* · 2. HLV chính · 3. Ngày trong tuần, giờ bắt đầu *(45 phút)* · 4. Bể, làn: hàng làn thu nhỏ của khung giờ đó, chỗ trùng HLV hay làn chỉ ra lớp bị trùng *(UC-03 3a)* · 5. Khai giảng, hết đợt, xem trước số buổi sẽ sinh *(trừ ngày lễ)* | Mở lớp và sinh buổi | `khoa_hoc`, `nhan_vien`, `lop` *(kiểm trùng)*, `ngay_nghi_le` |
| Web quản trị | **A10 · Điểm danh** · `admin/diem-danh.html` · HLV *(màn đầu của HLV)*, QL · máy tính bảng ngang | 1. Buổi dạy hôm nay của tôi: giờ, lớp, bể · làn, sĩ số, đã hay chưa điểm danh · 2. Danh sách buổi đang chọn: mỗi bé một dòng lớn, ba nút *(có mặt · vắng có phép · vắng không phép)*; bé đã báo nghỉ hiện sẵn; bé hết buổi hay hết hạn khoá nút có mặt, ghi "Đưa bé ra quầy" *(A-05)*; bé học thử có ô cấp độ gợi ý · 3. Thanh dưới: Có mặt tất cả · Lưu điểm danh; dải mạng "Đã lưu trên máy, sẽ gửi khi có mạng" *(A-10)* · 4. Sửa sau khi lưu: HLV trong 24 giờ; quá 24 giờ chỉ QL, bắt ghi lý do | Lưu điểm danh | `buoi_hoc` *(hôm nay, `hlv_day_id`)*, `diem_danh`, `hoc_vien`, `goi_hoc` *(hết buổi, hết hạn)* |
| Web quản trị | **A11 · Thông báo** · `admin/thong-bao.html` · QL, LT | 1. Danh sách đã gửi và hẹn giờ: tiêu đề, người nhận, lúc gửi, khẩn, đã đọc x/y · 2. Ngăn soạn: người nhận *(cả trung tâm · lớp · cấp độ · chọn phụ huynh; đếm số người nhận)*, tiêu đề, nội dung, gửi ngay · hẹn giờ *(chỉ 7:00–21:00)*, khẩn | Gửi thông báo | `thong_bao`, `thong_bao_nguoi_nhan`, `lop`, `phu_huynh` |
| Web quản trị | **A12 · Báo cáo** · `admin/bao-cao.html` · QL; LT chỉ chuyên cần | 1. Kỳ: tháng này mặc định, chọn khoảng · 2. Tab Chuyên cần: tỉ lệ đi học theo lớp, theo HLV, số vắng không phép · 3. Tab Doanh thu *(QL)*: theo tháng, theo loại gói, theo hình thức thanh toán · 4. Xuất Excel *(QL)* | Xuất Excel gửi kế toán *(QL)* | `diem_danh`, `buoi_hoc`, `lop`, `nhan_vien`, `thanh_toan`, `goi_hoc`, `bang_gia` |
| Web quản trị | **A13 · Nhân viên** · `admin/nhan-vien.html` · QL | 1. Bảng: họ tên, SĐT, vai, lớp phụ trách, trạng thái *(hoạt động · đã khoá · khoá do sai mật khẩu)* · 2. Ngăn thêm hoặc sửa: họ tên, SĐT, vai, lớp phụ trách *(HLV)*, gửi mật khẩu tạm qua SMS · 3. Khoá tài khoản *(nghỉ việc, không xoá)* · Mở khoá | Thêm nhân viên | `nhan_vien`, `lop` *(`hlv_id`)* |
| Web quản trị | **A14 · Nhật ký thao tác** · `admin/nhat-ky.html` · QL | 1. Lọc: loại thao tác *(sửa điểm danh, duyệt hoàn tiền, tạm dừng gói, xoá khỏi lớp, huỷ buổi)*, người làm, học viên, khoảng ngày · 2. Bảng: lúc, ai, thao tác, đối tượng, trước → sau · 3. Dòng mở rộng: lý do sửa | Tìm theo học viên khi có khiếu nại | `nhat_ky`, `nhan_vien`, `hoc_vien` |
| Web quản trị | **A15 · Cài đặt** · `admin/cai-dat.html` · QL | Tab Bảng giá: cấp độ × 8/12/24 buổi, áp dụng từ ngày, lịch sử giá; giá mới chỉ áp cho gói bán từ ngày đó · Tab Ngày nghỉ lễ: buổi rơi vào ngày lễ dời sang tuần sau · Tab Nhắc lịch: bật tắt, mẫu nội dung, trước 120 phút *(BR-TB-02)* | Lưu bảng giá mới | `bang_gia`, `ngay_nghi_le`, `cau_hinh_nhac_lich` |
| Web quản trị | **A16 · Đăng nhập** · `admin/dang-nhap.html` · mọi vai | SĐT, mật khẩu *(≥ 8 ký tự)* · lỗi sai mật khẩu kèm số lần còn lại, khoá sau 5 lần *(BR-QT-05)* · prototype: chọn nhanh vai demo | Đăng nhập | `nhan_vien` *(vai, `bi_khoa`)* |
| App phụ huynh | **P1 · Lịch** *(tab 1, màn đầu)* · `app/lich.html` | 1. Thanh trên: tên con đang xem, đổi con *(sheet; từng con một, BR-HV-03)* · 2. Buổi gần nhất nổi đầu: `thứ Hai, 06/10`, giờ, lớp, HLV *(hoặc HLV dạy thay)*, bể · làn, số buổi còn lại · 3. Buổi 2 tuần tới, nhóm theo tuần; trạng thái: đã báo nghỉ *(có phép · bị trừ)*, trung tâm huỷ *(+1 buổi bù)*, dạy thay, ngày lễ · 4. Yêu cầu đổi lịch đang chờ · Rỗng *(chưa có gói, UC-06 1a)*: SĐT quầy, giờ làm việc, nút gọi | Báo nghỉ buổi gần nhất | `hoc_vien` *(con)*, `buoi_hoc`, `diem_danh`, `lop`, `nhan_vien`, `yeu_cau_doi_lich`, `goi_hoc` |
| App phụ huynh | **P2 · Chi tiết buổi** · `app/buoi.html?id=…` | 1. Ngày giờ, lớp, HLV, bể · làn, trạng thái · 2. Ảnh hưởng tới gói: báo trước 2 giờ thì không bị trừ, đã dùng x/3 lần vắng có phép · 3. Sheet **Báo nghỉ**: lý do *(ốm · bận · khác, không bắt buộc)*, nói trước có bị trừ hay không; báo muộn vẫn nhận, ghi bị trừ *(A-04)* · 4. Gửi yêu cầu đổi lịch | Báo nghỉ | `buoi_hoc`, `diem_danh`, `goi_hoc` *(`so_lan_vang_co_phep`)* |
| App phụ huynh | **P3 · Gửi yêu cầu đổi lịch** *(toàn màn)* · `app/doi-lich.html?id=…` | 1. Buổi muốn đổi *(điền sẵn)* · 2. Mong muốn: ngày hoặc khung giờ gợi ý *(chọn nhanh)*, ghi chú · 3. Lễ tân xếp lại, kết quả báo trên app *(XD-02)* | Gửi yêu cầu | `yeu_cau_doi_lich` *(mới, chờ xử lý)*, `diem_danh` |
| App phụ huynh | **P4 · Yêu cầu đổi lịch** · `app/yeu-cau.html` | Danh sách: buổi, mong muốn, trạng thái *(chờ xử lý · đã đổi: buổi mới · bị từ chối: lý do)* · rỗng | Mở buổi đã đổi | `yeu_cau_doi_lich`, `buoi_hoc` |
| App phụ huynh | **P5 · Gói học** *(tab 2)* · `app/goi-hoc.html` | 1. Đổi con · 2. Số buổi còn lại: con số lớn *(điểm nhấn của màn)*, trên tổng, + buổi bù · 3. Hạn dùng, vắng có phép x/3, bảo lưu *(từ ngày, tới ngày, hạn mới)* · 4. Gói nối tiếp, gói chờ xác nhận tiền · 5. Còn ≤ 2 buổi: nhắc gia hạn tại quầy *(không thanh toán trong app, W-01)* · 6. 3 lần đóng tiền gần nhất | Gọi quầy gia hạn *(khi còn ≤ 2 buổi)* | `goi_hoc`, `bao_luu`, `thanh_toan`, `bang_gia` |
| App phụ huynh | **P6 · Lịch sử đóng tiền** · `app/thanh-toan.html` | Danh sách: ngày, gói, số tiền, hình thức, mã biên lai · sheet Biên lai | Xem biên lai | `thanh_toan`, `goi_hoc` |
| App phụ huynh | **P7 · Thông báo** *(tab 3)* · `app/thong-bao.html` | Khẩn ghim đầu *(huỷ buổi, dạy thay)* · danh sách: tiêu đề, trích, lúc, chưa đọc · rỗng | Mở thông báo | `thong_bao`, `thong_bao_nguoi_nhan` *(`da_doc`)* |
| App phụ huynh | **P8 · Chi tiết thông báo** · `app/thong-bao-chi-tiet.html?id=…` | Tiêu đề, lúc, nội dung · nếu là huỷ buổi: buổi bị ảnh hưởng, buổi bù đã cộng, liên kết tới buổi | Xem buổi bị ảnh hưởng | `thong_bao`, `buoi_hoc` |
| App phụ huynh | **P9 · Tài khoản** *(tab 4)* · `app/tai-khoan.html` | Phụ huynh *(tên, SĐT)* · các con *(tên, mã, lớp)* · nhắc lịch trước giờ học: bật tắt; thông báo khẩn luôn bật *(BR-TB-04)* · yêu cầu đổi lịch · liên hệ quầy *(SĐT, giờ làm việc, địa chỉ)* · đăng xuất | Gọi quầy | `phu_huynh`, `hoc_vien` |
| App phụ huynh | **P10 · Đăng nhập** *(toàn màn, 2 bước)* · `app/dang-nhap.html` | 1. SĐT *(`inputmode=tel`)*; số chưa đăng ký ở quầy thì nói gọi quầy · 2. Mã OTP 6 số *(`autocomplete=one-time-code`)*, gửi lại sau 60 giây *(NF-05)* | Nhận mã · Đăng nhập | `phu_huynh.so_dien_thoai` |

**Web quản trị · điều hướng theo vai** *(thanh bên trái; thanh trên có ô tìm học viên toàn cục, người đang đăng nhập và vai)*:
- **QL:** Lịch · Việc cần xử lý · Học viên · Lớp · Điểm danh · Thông báo · Báo cáo · *Quản trị:* Nhân viên · Nhật ký · Cài đặt
- **LT:** Lịch · Việc cần xử lý · Học viên · Lớp · Thông báo · Báo cáo *(chuyên cần)*
- **HLV:** Điểm danh *(màn đầu)* · Lịch dạy *(A1 lọc lớp mình)* · Học viên lớp tôi *(A3 lọc)*
- Màn đầu sau đăng nhập: QL, LT → A1 · HLV → A10. Đi sâu: A3 → A5 → A6 · A5 → A1 `?xep=` *(xếp lớp)* · A2 → lớp phủ Đổi lịch của A5 · A7 → A8, A9.

**App:** tab *(4)*: Lịch · Gói học · Thông báo · Tài khoản.
- **Ngăn xếp:** Lịch → P2 Chi tiết buổi → P3 *(toàn màn)* · Lịch → P4 · Gói học → P6 → sheet Biên lai · Thông báo → P8 → P2 · Tài khoản → P4.
- **Luồng toàn màn** *(không thanh tab, nút Huỷ)*: P10 Đăng nhập · P3 Gửi yêu cầu đổi lịch.
- **Sheet:** Đổi con *(P1, P5)* · Báo nghỉ *(P2)* · Biên lai *(P6)*.

**Nhiều bề mặt:** luồng xuyên bề mặt:
| Hành động | Ở bề mặt | Thấy thay đổi ở | Dữ liệu đổi |
|---|---|---|---|
| Báo nghỉ một buổi | App · P2 | Admin A10 *(bé hiện sẵn vắng có phép hoặc không phép)*, A1 ngăn chi tiết, A2 mục báo nghỉ hôm nay | `diem_danh.trang_thai`, `goi_hoc.so_lan_vang_co_phep` |
| Gửi yêu cầu đổi lịch | App · P3 | Admin A2 *(chờ xử lý; quá 24 giờ báo QL)* | `yeu_cau_doi_lich` → `cho_xu_ly` |
| Đổi lịch hoặc từ chối yêu cầu | Admin · A2, A5 | App P4 *(đã đổi · bị từ chối kèm lý do)*, P1 *(buổi mới)* | `yeu_cau_doi_lich.trang_thai`, `buoi_hoc`, `diem_danh` |
| Lưu điểm danh | Admin · A10 | App P5 *(buổi còn lại giảm)*, P1 *(buổi đã học)* | `diem_danh`, số buổi còn lại của `goi_hoc` |
| Bán gói, thu tiền | Admin · A6 | App P5 *(gói mới)*, P6 *(biên lai)* | `goi_hoc`, `thanh_toan` |
| Xác nhận chuyển khoản đã về | Admin · A2 | App P5 *(gói từ chờ xác nhận sang đang dùng)* | `goi_hoc.trang_thai` |
| Xếp học viên vào lớp | Admin · A1, A8 | App P1 *(buổi sắp tới xuất hiện)* | `xep_lop`, `diem_danh` *(buổi sinh theo gói)* |
| Bảo lưu gói | Admin · A5 | App P5 *(đang bảo lưu, hạn mới)*, P1 *(không có buổi trong khoảng)* | `bao_luu`, `goi_hoc.trang_thai`, `goi_hoc.het_han` |
| Huỷ buổi do sự cố | Admin · A1 | App P7 *(thông báo khẩn)*, P1 *(buổi bị huỷ)*, P5 *(+1 buổi bù)* | `buoi_hoc.trang_thai = huy_do_trung_tam`, `goi_hoc.so_buoi_cong_them`, `thong_bao` *(khẩn)* |
| Đổi người dạy *(dạy thay)* | Admin · A1 | App P1, P2 *(tên HLV dạy thay)*, P7 | `buoi_hoc.hlv_day_id`, `thong_bao` |
| Gửi thông báo | Admin · A11 | App P7 | `thong_bao`, `thong_bao_nguoi_nhan` |
| Đọc thông báo | App · P8 | Admin A11 *(đã đọc x/y)* | `thong_bao_nguoi_nhan.da_doc` |

**Ngoài sơ đồ:** S-04 đánh giá tiến bộ, CO-01 mã khuyến mãi, CO-02 SMS *(GĐ2)* · W-01 thanh toán trong app *(không làm)* · luồng hoàn tiền khi phụ huynh tự xin nghỉ *(chờ OQ-01)*.

**Phạm vi lần này** *(đề xuất, hỏi ở Cổng 3 câu 2)*:
1. **Vòng số buổi còn lại · 10 màn** *(Khuyến nghị)*: web A1 Lịch tuần, A2 Việc cần xử lý, A5 Hồ sơ học viên, A6 Bán gói và thu tiền, A10 Điểm danh · app P1 Lịch, P2 Chi tiết buổi *(sheet Báo nghỉ)*, P3 Gửi yêu cầu đổi lịch, P5 Gói học, P7 Thông báo · kèm trang lối vào và vỏ tổng quan app. Đủ cho 10/12 luồng xuyên bề mặt ở bảng trên *(trừ gửi và đọc thông báo thường, cần A11 và P8)*. Đi trọn khác biệt của dự án *("số buổi còn lại luôn đúng, phụ huynh tự xem")*, phủ M-03…M-06 và cả hai trường hợp khó của B1.
2. **Màn then chốt mỗi bề mặt · 2 màn**: A1 Lịch tuần + P1 Lịch, kèm trang lối vào. Thấy concept trên cả hai bề mặt, chưa có luồng nào chạy.
3. **Toàn bộ 26 màn**: A1–A16 và P1–P10 như bảng trên.

## 10. Bề mặt và nền tảng
*(chưa điền: phần design system của B2. Hai bề mặt: Web quản trị · App phụ huynh iOS và Android)*

## Lịch sử
| Ngày | Đổi gì | Vì sao |
|---|---|---|
| 05/10/2026 | Bản nháp: mục 9 sơ đồ trang và đề xuất phạm vi | B2, trước phần design system |
