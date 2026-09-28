# Nạp tham chiếu của người dùng — B2

> Mục tiêu: biến input của người dùng (concept, design system, ảnh, URL, brand, codebase) thành **`REFERENCE-READ.md`**, một bản đọc máy và người đều kiểm được. Mọi thứ trích ra phải có **nguồn** *(file, số dòng, vùng ảnh)*. Thứ đoán thì ghi là **đoán**.

---

## 1. Mức bám — hỏi ở Cổng 1, áp suốt quy trình

| Mức | Nghĩa | Hệ quả |
|---|---|---|
| **Bám sát 100 %** | Tham chiếu là luật | Token, bố cục, chữ viết giữ nguyên. Cổng 2 chỉ hỏi phần tham chiếu **bỏ trống**. Cổng 3: ba hướng chỉ khác ở phần bỏ trống, hoặc bỏ qua nếu tham chiếu đã đủ *(ghi lý do vào `DECISIONS.md`)* |
| **Làm nền, được biến tấu** | Giữ ngôn ngữ, được đổi chi tiết | Giữ bảng màu, chữ, bo góc. Bố cục và chuyển động được đề xuất. Cổng 2 hỏi **cách hiểu** |
| **Chỉ lấy cảm hứng** | Lấy không khí, không lấy token | Trích **không khí và 3–5 đặc điểm nhận diện**. Chạy Cổng 2 như bình thường |

Không rõ mức bám thì **hỏi**, đừng đoán. Sai mức bám là sai toàn bộ phần sau.

---

## 2. Đọc theo loại input

### 2.1 `DESIGN.md` · file token · design system *(JSON, CSS variables, Tailwind config, Figma Tokens)*
- Trích nguyên: màu *(tên + hex + vai trò)*, font *(họ, trọng lượng, thang cỡ)*, bo góc, khoảng cách, bóng, chuyển động, component.
- Kiểm: font có **dấu tiếng Việt** không *(`scripts/preflight.py --font`)* · màu chữ trên nền có **đạt AA** không. Không đạt thì **đừng sửa ngầm**, đưa lên Cổng 2: *"Token X không đạt AA trên nền Y — giữ, hay đổi sang Z?"*
- Có hệ thống chính thức *(Material, Fluent, Carbon, Polaris, shadcn…)* thì dùng **gói chính thức**, không chép CSS tay *(`design-taste-frontend` §2.A)*.

### 2.2 File concept *(Claude Design `.dc.html`, Figma export, PDF, slide)*
- Đọc **toàn bộ**, kể cả ghi chú và phần *quyết định*. Concept nhiều lớp thì lớp sau **ghi đè** lớp trước. Tìm bảng quyết định (C0, Q1…) và coi đó là luật.
- Tách thành 3 cột: **đã chốt** *(luật)* · **đề xuất** *(được biến tấu)* · **bỏ ngỏ** *(đưa lên cổng)*.
- Concept mâu thuẫn với tài liệu yêu cầu thì **dừng và hỏi**. Không tự chọn bên nào.

### 2.3 Ảnh chụp · mockup · moodboard
Đọc ảnh **như đọc đặc tả**, không liếc qua:

| Nhóm | Trích gì |
|---|---|
| **Chữ** | Nguyên văn chữ đọc được: tiêu đề, phụ đề, nhãn CTA, menu |
| **Chữ viết** | Tỉ lệ cỡ các cấp · trọng lượng · số dòng · cảm giác leading/tracking · serif hay sans · chữ êm hay gắt |
| **Khoảng cách** | Tiêu đề→phụ đề · chữ→nút · giữa các thẻ · lề section · padding thẻ · nhịp chung *(ước theo bội số 4/8)* |
| **Nút · component** | Hình · bo góc · đặc hay viền · icon · thứ bậc chính/phụ · thẻ · badge · đường kẻ · bóng |
| **Màu** | Nền · mặt thẻ · nhấn · chữ theo cấp · viền · sắc bóng · xử lý ảnh · mức gradient |
| **Bố cục** | Lưới · thứ tự section · mật độ · mô-típ lặp lại tạo nên ngôn ngữ |

- Màu ước từ ảnh thì ghi **"ước từ ảnh, ±"**. Muốn hex chính xác thì đo bằng script *(Pillow)* trên vùng ảnh, và ghi toạ độ vùng đã đo.
- Chữ nhỏ quá không đọc được thì ghi **"không đọc được"**. Không bịa.

### 2.4 URL
1. Chụp trang ở 1440 và 390 *(lệnh ở `qa-gate.md` mục 2)*, rồi đọc ảnh như mục 2.3.
2. Đọc mã nguồn để lấy token thật: CSS variables, `font-family`, link Google Fonts, cấu hình Tailwind.
3. **Không** sao chép logo, ảnh hay chữ của site người khác vào sản phẩm, trừ khi đó là brand của chính người dùng.

### 2.5 Tên thương hiệu có thật
- **Kiểm chứng sự thật trước** bằng `WebSearch`: có tồn tại không, sản phẩm mới nhất là gì. Đừng dựa vào trí nhớ.
- Lấy logo, ảnh sản phẩm, màu, font từ **nguồn chính thức** *(site chính, press kit)*. Làm theo `huashu-design/references/brand-asset-protocol.md`.
- Chỉ **tên chủ đề** (cà phê, bơi lội, thời trang) thì không phải brand. Đừng đi tìm logo.

### 2.6 Codebase hoặc site cũ của người dùng
- Soát theo `redesign-existing-projects` mục *Design Audit* và `design-taste-frontend` §11.B: token, cấu trúc thông tin, nội dung, thứ cần giữ, thứ nên bỏ.
- Skill này làm **mới từ đầu**, nhưng **không tự đổi** cấu trúc URL, nhãn menu chính, tên trường form hay logo nếu người dùng chưa đồng ý *(`design-taste-frontend` §11.F)*.

---

## 3. Khuôn `REFERENCE-READ.md`

```markdown
# Bản đọc tham chiếu — <dự án>
**Ngày:** <dd/mm/yyyy> · **Mức bám:** <bám sát | làm nền | cảm hứng> · **Nguồn:** <danh sách file/URL>

## 1. Đã chốt (luật)
| Mục | Giá trị | Nguồn |
|---|---|---|

## 2. Token trích được
| Token | Giá trị | Vai trò | Nguồn | Chắc chắn? |
|---|---|---|---|---|

## 3. Đặc điểm nhận diện (3–5 cái — thứ làm nên "chất" của tham chiếu)

## 4. Bỏ ngỏ — đưa lên Cổng 2

## 5. Mâu thuẫn — trong tham chiếu, hoặc với tài liệu yêu cầu

## 6. Không đạt sàn (AA, dấu tiếng Việt, hiệu năng) — cần người dùng quyết
```

---

## 4. Chống trôi khi dựng *(B4, B6)*

Lỗi hay gặp: tham chiếu đẹp, dựng ra lại thành khuôn chung. Khi dựng:
- **Không** gộp các section đặc trưng thành hàng lặp giống nhau.
- **Không** nén khoảng trắng rộng thành bố cục chật.
- **Không** thay chữ viết mạnh bằng thứ bậc nhạt nhẽo.
- Chỗ tham chiếu không nói rõ thì giải theo thứ tự: giữ ngôn ngữ nhìn thấy → giữ logic bố cục và khoảng cách → giữ họ component → giữ không khí → chỉ khi đó mới chọn cách dễ dựng nhất.
- Xong mỗi trang, đặt ảnh chụp bản dựng **cạnh** tham chiếu và ghi 3 chỗ lệch lớn nhất. Lệch **có chủ đích** thì ghi lý do. Lệch **không có chủ đích** thì sửa.
