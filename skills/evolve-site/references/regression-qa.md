# Regression QA · Tự kiểm hồi quy tính năng mới

> Quy tắc: **"Thêm cái mới nhưng không được làm vỡ cái cũ."**
> Trước khi mở Cổng 3 để nghiệm thu với người dùng, trợ lý bắt buộc phải hoàn thành danh mục kiểm thử hồi quy này và ghi nhận bằng chứng cụ thể.
> File này nói **cách** kiểm. Nhóm nào áp cho cấp nào, và kiểm thêm theo cờ nào: bảng B4 trong `SKILL.md`.

---

## 1. Bảng kiểm tra hồi quy 7 nhóm (Regression Checklist)

### Nhóm A: Toàn vẹn Tương tác (Interaction Integrity)
- [ ] **Nút bấm & Chức năng cũ:** Thử bấm các nút bấm, bộ lọc, tab cũ nằm cạnh tính năng mới. Chúng có còn phản hồi bình thường không?
- [ ] **Thứ tự lớp (z-index):** Modal/Drawer mới có đè lên Header/Sidebar đúng cách không? Có bị menu dropdown khác đâm xuyên qua không?
- [ ] **Khóa cuộn màn hình nền (Scroll Lock):** Khi Modal/Drawer mở ra, trang nền phía sau có bị cuộn vô ý không? (Khuyến nghị thêm `overflow-hidden` cho `body` khi mở overlay).

### Nhóm B: Trợ năng & Thoát hiểm (Accessibility & Exit Paths)
- [ ] **Luật thoát hiểm hai chiều:** 
  * Bấm nút Đóng (`X`) hoặc Huỷ: Lớp phủ biến mất mượt mà.
  * Bấm vào vùng backdrop mờ: Đóng lớp phủ.
  * Bấm phím `Esc`: Đóng lớp phủ.
- [ ] **Quản lý tiêu điểm (Focus Management):**
  * Khi mở Modal/Drawer: Tiêu điểm bàn phím tự động nhảy vào trường nhập liệu đầu tiên hoặc nút chính.
  * Khi đóng: Tiêu điểm quay lại đúng phần tử đã kích hoạt mở nó.
- [ ] **Khoá focus:** khi lớp phủ mở, `Tab` và `Shift+Tab` chỉ đi vòng bên trong nó, không lọt ra trang nền.
- [ ] **Giảm chuyển động:** chuyển động mới tắt hoặc giảm khi bật `prefers-reduced-motion`.

### Nhóm C: Kiểm tra Đủ 5 trạng thái (State Completeness)
Đối với thành phần giao diện mới được thêm vào:
1. **Default:** Trạng thái bình thường khi có dữ liệu.
2. **Hover / Active:** Các nút, dòng bảng, thẻ có hiệu ứng khi rê chuột và bấm chuột không?
3. **Loading:** Khi đang tính toán hoặc lưu dữ liệu, có trạng thái skeleton hoặc nút đổi sang spinner không?
4. **Empty State:** Khi không có dữ liệu (danh sách rỗng, tìm kiếm không thấy kết quả), có hình minh họa hoặc câu hướng dẫn thân thiện không?
5. **Error State:** Khi nhập sai form hoặc thao tác thất bại, thông báo lỗi có hiển thị tại chỗ (inline error) bằng màu cảnh báo không? (Tuyệt đối không dùng popup `alert()`).

### Nhóm D: Thích ứng màn hình (Responsive Check)
Kiểm tra trên 2 độ phân giải chuẩn:
- [ ] **Desktop 1440×900 px:** Bố cục cân đối, tận dụng không gian tốt, không bị co cụm.
- [ ] **Mobile 390×844 px:**
  * Không xuất hiện thanh cuộn ngang ngoài ý muốn (`overflow-x: hidden`).
  * Modal/Drawer trên mobile nên tự động chuyển thành Bottom Sheet (trượt từ đáy lên) hoặc chiếm toàn màn hình để dễ thao tác bằng ngón cái.
  * Chiều cao vùng bấm nút ≥ 44px (Fitts's Law).
- [ ] **Nền tối** *(nếu site có `data-theme="dark"` hoặc `prefers-color-scheme`)*: phần mới đọc được ở cả hai nền, không có màu viết cứng.

### Nhóm E: Tính toàn vẹn Dữ liệu (Data Contract Check)
- [ ] Dữ liệu mới tạo có được lưu trữ đúng chỗ không?
- [ ] Tải lại trang (F5) hoặc chuyển qua trang khác rồi quay lại, dữ liệu có bị mất hay gây lỗi `Cannot read properties of undefined` trên console không?
- [ ] Mở Console trình duyệt: **Bắt buộc 0 thông báo lỗi (0 Errors).**

### Nhóm F: Kiểm UX 12 điểm *(chép từ `laws-of-ux-checklist`, không cần mở skill gốc)*

> Bảng này **giống hệt** `sketch-to-site/references/qa-gate.md` mục 3. Sửa bảng thì sửa cả hai.

Chạy trên **phần mới thêm và trang chứa nó**, đọc code thật, mỗi điểm ✅/❌ kèm `file:dòng` làm bằng chứng.

| # | Điểm | Đạt khi | Luật |
|---|---|---|---|
| 1 | Hành động chính nổi nhất | Nút hành động chính to nhất, tương phản cao nhất, dễ với tới | Fitts · Von Restorff |
| 2 | ≤ 7 lựa chọn thấy cùng lúc | Mục menu, lựa chọn, bộ lọc hiện cùng lúc không quá 7 | Hick · Miller |
| 3 | Thứ liên quan đứng gần nhau | Khoảng cách trong nhóm chặt, giữa các nhóm rộng | Proximity · Common Region |
| 4 | Phản hồi ≤ 400 ms | Có trạng thái đang tải, skeleton hoặc cập nhật lạc quan | Doherty |
| 5 | Theo quy ước quen thuộc | Vị trí menu, mẫu form, cách bảng hoạt động đúng như người dùng đã quen | Jakob |
| 6 | Có hover và focus | Nút, link, ô nhập đều có trạng thái hover và focus, có chuyển tiếp | Aesthetic-Usability · Flow |
| 7 | Luồng nhiều bước có tiến độ | Có thanh bước, thanh tiến độ hoặc *"Bước X/Y"* | Goal-Gradient · Zeigarnik |
| 8 | Vùng chạm ≥ 44px | Nút, link, công tắc, ô chọn trên điện thoại đủ 44×44px | Fitts |
| 9 | Có trạng thái rỗng | Không để màn trắng: có lời nhắn, minh hoạ hoặc nút hành động | Peak-End |
| 10 | Thông tin chia cụm | Section có tiêu đề, danh sách được nhóm, form dài được chia đoạn | Chunking · Cognitive Load |
| 11 | Thứ bậc rõ | Tiêu đề > phụ đề > thân > chú thích, khác nhau rõ về cỡ và độ đậm | Selective Attention · Prägnanz |
| 12 | Giấu độ phức tạp | Có mặc định thông minh, tuỳ chọn nâng cao được cất đi | Tesler · Occam |

**Chỉ ✅ hoặc ❌**, không có *đạt một phần*. **Điểm không áp dụng** *(ví dụ điểm 7 khi không có luồng nhiều bước)*: đánh ✅ kèm chữ *không áp dụng*, **không** tính là ❌.

**Kết luận:** 12/12 → giao · 10–11 → giao kèm ghi chú · 7–9 → sửa trước · ≤ 6 → chặn.

### Nhóm G: Phân quyền & Lối vào (Access & Entry Points)
- [ ] **Chặn đúng:** với từng vai **không** được thấy tính năng, mở thẳng URL, màn mới hoặc gọi hàm đều bị chặn và **không lộ dữ liệu**. Chỉ giấu nút hay mục menu là **chưa đủ**.
- [ ] **Không chặn oan:** với từng vai **được** thấy, vào được bằng mọi lối vào đã chốt ở Cổng 1 *(Cấp 1: ở 🛑1 rút gọn, hoặc trong câu lệnh)*.
- [ ] **Thêm trang mới (Cấp 3):** lối vào có ở menu **mọi trang** *(hoặc nơi sinh menu chung)*. Đếm bằng `grep`: số trang có lối vào = số trang có menu.
- [ ] Dự án có QA tự động cho phân quyền thì **bẻ thử**: tạm mở quyền cho một vai không được thấy, QA phải kêu.

---

## 2. So với mốc bằng script

**Vì sao cần mốc:** prototype có sẵn thường đã mang lỗi từ trước *(một prototype thật từng mang sẵn 33 lỗi `preflight.py` trước lần sửa đầu tiên)*. Không có mốc thì sau khi sửa không phân biệt được lỗi mới với lỗi cũ, và dễ tiện tay sửa luôn lỗi cũ, tức là đụng vào code ngoài phạm vi.

1. **Trước khi sửa (B1):** chạy QA của dự án, lưu kết quả vào `_qa/truoc/`. Dự án không có script riêng thì dùng preflight của `sketch-to-site`:
   ```bash
   python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-site> [--kind app] --save <thư-mục-prototype>/_qa/truoc/preflight.json
   ```
2. **Sau khi sửa (B4):** so với mốc. Script chỉ in lỗi **mới**, khớp theo file + mã + đoạn trích *(bỏ số dòng, vì sửa file làm dòng xê dịch)*, và thoát mã 1 khi có lỗi mới:
   ```bash
   python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-site> [--kind app] --compare <thư-mục-prototype>/_qa/truoc/preflight.json
   ```
   Dự án có script QA riêng mà không có chế độ so mốc *(ví dụ một `_qa/qa.py` tự viết của dự án, chỉ in danh sách lỗi)*: lưu kết quả vào `_qa/truoc/` và `_qa/sau/`, rồi đối chiếu hai bản.
3. Kết quả phải đạt: **0 lỗi mới**. Lỗi cũ **không tự sửa**; liệt kê ở Cổng 3 để người dùng quyết.

**Mốc cuốn chiếu** *(khi dự án có, ví dụ `_qa/quick.py`)*: không chạy bước 1.
- Lệnh kiểm nhanh giữ kết quả của lần kiểm sạch gần nhất cho từng bộ, và băm từng file.
- Sau khi sửa, lệnh chỉ chạy các bộ của trang nạp file đã đổi, rồi so với kết quả đó.
- Sạch thì lệnh nâng mốc và ghi một dòng nhật ký.
- Lỗi lan sang trang mà lệnh không chạy do `handover-check` bắt, trong lần kiểm tổng trước bàn giao.
4. Có cảnh báo mới thì giải trình từng dòng ở Cổng 3.

---

## 3. Cho QA lớn theo tính năng

Dự án có script QA liệt kê các trạng thái chạy thật *(ví dụ script chạy trình duyệt headless qua từng trang, từng vai)* thì **thêm trạng thái của tính năng mới** vào đó: mở, đóng, rỗng, lỗi, và từng vai ở nhóm G. Rồi **bẻ thử**:
- Tạm làm hỏng tính năng *(xoá nút, bỏ chặn quyền)*: QA phải kêu.
- Trả lại như cũ: QA phải im.
- Kiểm **số chỗ đã bẻ > 0** trước khi đọc kết quả. Một phép bẻ không thay được gì trông giống hệt một phép thử đạt.

Không thêm thì tính năng này không được canh: lần sửa sau làm hỏng nó cũng không ai biết.
