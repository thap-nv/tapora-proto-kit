# Nhật ký quyết định — Lò Bánh Củi Cô Ba

> Mỗi cổng một khối, Cổng 1–2 do `sketch-to-concept` ghi, Cổng 3–4 do `sketch-to-site` ghi. **Đáp án ghi nguyên văn** lời người dùng. Cổng bị bỏ qua thì vẫn ghi: ai cho phép bỏ qua, và nguyên văn câu cho phép.

## 🛑 Cổng 1 · Brief concept — 04/10/2026 *(sketch-to-concept)*

Đáp án đã có trong input, nên qua cổng không hỏi *(SKILL.md mục 1: "đáp án đã có trong input, ghi nguồn")*. Nguồn: người dùng nói, trong lời giao việc của phiên này.

| Câu hỏi | Đáp án (nguyên văn) | Ghi chú |
|---|---|---|
| Loại sản phẩm *(nhiều bề mặt: liệt kê từng bề mặt)* | "Site giới thiệu một trang, chỉ web." | Một bề mặt. Màn then chốt: màn đầu + 1 section đặc trưng |
| Nền tảng app *(nếu có app)* | — | Không có app |
| Người dùng chính + thiết bị | "Khách du lịch và người địa phương, lướt điện thoại tìm chỗ ăn sáng." | Thiết bị chính: điện thoại |
| Tham chiếu + mức bám | "Chưa có logo hay màu brand, không có tham chiếu." | Không có `REFERENCE-READ.md` |
| Khác biệt · Định hướng *(nếu brief còn trống)* | Khác biệt: "bánh nướng lò củi, 4 mẻ cố định mỗi ngày (6:00, 9:30, 15:00, 17:30), mẻ nào hết là hết." · Định hướng: "Ấm, mộc, đáng tin; ghét sến, kiểu quán cà phê sống ảo." | Việc chính: "Xem mẻ bánh sắp ra lò, xem giờ mở và đường đi, đặt giữ bánh qua Zalo." |

**Brief concept** *(A1, mỗi dòng ghi nguồn)*:
1. **Sản phẩm:** site giới thiệu một trang · chỉ web · một bề mặt *(người dùng nói)*
2. **Cho ai:** khách du lịch và người địa phương · điện thoại · lướt tìm chỗ ăn sáng *(người dùng nói)*
3. **Việc chính:** xem mẻ sắp ra lò · xem giờ mở và đường đi · giữ bánh qua Zalo · loại màn: giới thiệu, 1/1 *(người dùng nói; số màn đếm từ "site giới thiệu một trang", không có tài liệu chức năng)*
4. **Khác biệt:** lò củi, 4 mẻ cố định 6:00 · 9:30 · 15:00 · 17:30, mẻ nào hết là hết *(người dùng nói)*
5. **Định hướng:** ấm, mộc, đáng tin · ghét sến, kiểu quán cà phê sống ảo *(người dùng nói)*
6. **Ràng buộc:** chưa có logo, màu brand; không tham chiếu *(người dùng nói)*

**Nội dung thật** *(người dùng nói)*: bánh mì que củi 8.000 ₫ · bánh mì đặc ruột 6.000 ₫ · bánh sừng bò bơ Đà Lạt 22.000 ₫ · bánh nho Bảo Lộc 18.000 ₫ · 14 Hai Bà Trưng, Phường 1, Đà Lạt · Zalo 0909 123 456 · mở 5:30 đến 19:00, nghỉ thứ Hai.

**Kiểm công cụ** *(A1)*: `AskUserQuestion` không có *(phiên chạy như subagent, không hỏi được người dùng: câu hỏi Cổng 2 viết ra rồi dừng)* · Edge và Chrome có *(chụp headless)* · `WebSearch` có · công cụ sinh ảnh không có.

## 🛑 Cổng 2 · Concept — 04/10/2026 *(sketch-to-concept)*
| Vòng | Concept | Nguồn | Ý *(một câu)* | Họ phong cách | Màn then chốt · khung |
|---|---|---|---|---|---|
| 1 | a · Dấu giờ ra lò | lăng kính studio: Rice Creative *(bao bì Marou, dấu cao su, in lụa Chợ Lớn; kiểm bằng WebSearch)* | Mỗi mẻ bánh rời lò mang một con dấu giờ; trang web là tờ phiếu giữ bánh, đóng dấu đúng mẻ bạn giữ | Brutalist · Swiss công nghiệp, bản in thủ công ấm | Một cột phiếu dọc như cuống biên nhận, màn đầu đã là phiếu giữ bánh |
| 1 | b · Một ngày, bốn vết rạch | hợp nhất: Hiện đại tối giản + ui-ux-pro-max | Một ngày của lò là thanh giờ 5:30–19:00 có bốn vết rạch; nhìn một lần biết mẻ kế còn bao xa | Hiện đại tối giản | Câu trạng thái lớn trên thanh ngày tràn mép, bảng giờ dọc theo tỉ lệ thời gian |
| 1 | c · Cửa lò mở bốn lần | chuẩn thật: Lune Croissanterie *(site của A Friend of Mine; kiểm bằng WebSearch)* | Cửa lò củi chỉ mở bốn lần một ngày; trang web là cái cửa lò ấy | Awwwards · điện ảnh, tiết chế | Một vòm lớn căn giữa ôm mẻ kế, hàng bốn ô cửa vòm + nội quy |

**Bảng:** `concept/index.html` · **Chấm lớp Ý trên dữ liệu** *(review độc lập: một subagent chưa tham gia viết, prompt `subagent-prompts.md` mục 2)*: a 7/10 · b 7/10 · c 8/10. Không concept nào ≤ 5 nên không bắt buộc sửa; vẫn sửa trong `concepts.js` theo góp ý:
- a và c chung bộ xương *(màn đầu là mẻ kế, section là hàng 4 vật, bấm vật để giữ)* → đổi khung a thành một cột phiếu giữ bánh, màn đầu đã là form.
- b: section "lưới Swiss bốn cột" làm mất tỉ lệ thời gian → đổi thành bảng giờ dọc theo tỉ lệ; sửa câu sai "nội dung chỉ có một trục".
- a: bỏ hai chi tiết bịa trong `formFrom` ("giấy gói của Cô Ba", "Cô Ba gạch trên quầy").
- c: `chatNen` mâu thuẫn với `why.chatNen` → "trơn tối"; trạng thái bịa "chưa nhóm lửa" → "chưa vào lò".
- Không sửa, nêu ở Cổng 2: a mặc vỏ kraft + dấu cao su, dễ thành sáo ngữ của tiệm thủ công; c tối + than hồng gần lối lò pizza củi và vẻ u tối sống ảo; b nền sáng trơn + một màu nhấn sát lối thất bại "trắng + khoảng trắng + một màu".

**Tự kiểm** *(A3 bước 5)*: `preflight.py concept/` 0 lỗi, 0 cảnh báo · `shots.mjs` mọi dòng OK *(bảng: 3 concept, 1 vòng; c khoá nền tối, chụp thêm `?theme=dark`)*. Đã sửa sau lần chụp đầu: gạch dài trong `b.html` *(P02)*; cột giờ của b tràn 8px; dấu giờ lớn của a che chữ tiêu đề, giá ở 390 bị xuống dòng; mốc kéo của b chưa có tay nắm, thanh ngày trắng trơn → tô màu vỏ bánh nhạt.
**Soát lớp Ý trên ảnh** *(tự chấm: che chữ còn nhận ra chủ đề không, màn có mang mô-típ `formFrom` không)*: a 7/10 *(tờ phiếu, ô dấu giờ, gạch chéo mẻ hết đều có; che chữ thì ra "phiếu, con dấu", chưa ra "bánh")* · b 7/10 *(thanh ngày màu vỏ bánh có bốn vết rạch đúng tỉ lệ; che chữ thì đọc như dòng thời gian, hơi giống ổ bánh)* · c 8/10 *(vòm lò sáng than hồng giữa nền muội than; che chữ vẫn ra "lò, lửa")*. Không concept nào ≤ 5, không làm lại.
**Khuyến nghị:** c, xếp thứ hai: a. Lý do bằng dữ kiện brief: khách lướt điện thoại tìm chỗ ăn sáng, màn đầu của c trả lời ngay "mẻ kế 9:30, còn 50 phút"; c là concept duy nhất mang đủ ba khác biệt *(lò củi, 4 mẻ cố định, hết là hết)*; nội quy ba dòng nói thẳng, hợp "đáng tin". Rủi ro: nền tối dễ trượt sang vẻ u tối "sống ảo" mà người dùng ghét. a xếp thứ hai vì đặt việc giữ bánh qua Zalo ngay màn đầu và hợp "ấm, mộc".

**Hướng chưa dùng** *(A2 rải 8 hướng; vòng sau lấy từ đây trước)*:
- Đồng hồ một vòng ngày: vòng tròn 24 giờ có 4 khấc · nền sáng, grotesk, con số khổng lồ, dụng cụ chính xác · bo tròn. Bỏ vì lịch nào cũng dùng được *(đổi tên vẫn đứng)*, b giữ ý giờ mà có vết rạch.
- Bảng giờ tàu ga Đà Lạt: bánh ra lò đúng giờ như tàu rời ga · nền tối xanh gỗ, chữ nén, bảng lật · góc vuông. Bỏ vì ga xa địa chỉ tiệm, ẩn dụ gượng, lạnh so với "ấm, mộc".
- Tấm bìa viết tay "bánh nóng": bảng giá bút lông trên bìa carton ở cửa tiệm · nền carton sáng, chữ viết tay + sans, gạch xoá mẻ hết · mép rách. Bỏ vì gần a *(cùng hiện vật giấy)*.
- Sương ngoài, ấm trong: Đà Lạt lạnh, bánh nóng · trung tính xanh sương chuyển sang nâu vỏ bánh, đổi chất liệu một lần · bo mềm. Bỏ vì ý về khí hậu, không về lò củi hay 4 mẻ; giữ màu sương cho b.
- Sổ tay của thợ lò: ghi chép từng mẻ · nền kem, serif biên tập, giấy kẻ ô, ghi chú lề · góc vuông. Bỏ vì đúng thói quen đã đo *(serif biên tập + grain + nền kem)*.

**Vòng sau:** không có, chốt ở vòng 1.
**Đáp án concept (nguyên văn):** "Chọn C. Một nền như concept. Nhịp như concept." → **c · Cửa lò mở bốn lần**, 04/10/2026 · `CONCEPT.md`
**Mã trộn (nếu có):** không trộn
**Nền:** một nền, tối như concept *(không thêm nền thứ hai)* · **Nhịp:** như concept

## Giả định (B1)
> Thực tế nội dung mà tài liệu yêu cầu chưa nói. Không hỏi; Cổng 3 chỉ nêu dòng nào đổi thiết kế.

| Giả định | Mặc định đã chọn | Giá phải trả nếu sai |
|---|---|---|
| Món của từng mẻ *(người dùng chưa nói)* | Màn concept cho mỗi mẻ ra đủ 4 món, gắn nhãn giả định | Nếu mỗi mẻ một nhóm món: section mẻ phải hiện món riêng, ô giữ bánh lọc món theo mẻ |
| Trạng thái còn/hết của mẻ | Màn concept dùng giờ minh hoạ 8:40 và trạng thái minh hoạ, gắn nhãn | Muốn trạng thái thật: cần người ở tiệm cập nhật *(bảng nhỏ hoặc nhắn Zalo)*, thêm một màn quản lý |
| Danh sách mẻ khi rỗng *(B1, sketch-to-site)* | Luôn 4 mẻ. "Rỗng" là thứ Hai nghỉ hoặc sau khi mẻ 17:30 hết: vòm lớn tắt lửa thành gạch, ghi mẻ đầu hôm sau "6:00 thứ Ba, 06/10"; chip "Hôm nay nghỉ" | Tiệm còn nghỉ lễ, Tết hay nghỉ đột xuất: cần lịch nghỉ và một dòng báo ở màn đầu |
| Trạng thái theo đồng hồ | Prototype tính "chưa vào lò / đang nướng / đã ra lò / nghỉ" từ lịch cố định và giờ máy *(Asia/Ho_Chi_Minh)*; "đã hết" là minh hoạ. Tham số `?gio=` để trình | Không đổi thiết kế; chỉ đổi nguồn dữ liệu khi có trạng thái thật |
| Thời gian nướng | Mẻ "đang nướng" từ 45 phút trước giờ ra lò *(minh hoạ: "vào lò lúc 16:45")* | Sai thì chỉ đổi chữ và mốc tính |
| Chuỗi dài nhất | Tên món "Bánh sừng bò bơ Đà Lạt" · địa chỉ "14 Hai Bà Trưng, Phường 1, Đà Lạt" · nút "Giữ bánh mẻ 17:30 qua Zalo" · giờ dài nhất "17:30" trong vòm lớn: cỡ giờ chặn theo bề rộng vòm *(27 %)*, cỡ giờ trên cửa theo bề rộng hàng cửa | Món mới tên dài hơn: xuống dòng trong khay, đã cho phép; không đổi bố cục |
| Số lớn nhất | 22.000 ₫ *(bánh sừng bò)*. Giá, giờ mẻ, giờ mở, địa chỉ, Zalo là **thật** *(người dùng nói)*; giờ hiện tại, trạng thái, giờ hết bánh, "ra lò sau N phút" là **minh hoạ**, gắn nhãn | Có món ≥ 100.000 ₫ *(bánh nguyên ổ, hộp quà)*: cột giá rộng thêm, vẫn vừa |
| Hành động không đảo ngược | Không có. "Giữ bánh" mở Zalo ngoài site *(`zalo.me/0909123456`)*; việc giữ được xác nhận trong Zalo, không trên site. Thất bại *(máy không có Zalo)*: thông báo lỗi dưới nút, kèm số và nút "Chép số Zalo" | Tiệm muốn đặt giữ ngay trên site *(form tên, số ổ, mẻ)*: thêm form, màn xác nhận và trạng thái lỗi gửi |
| Tiếng nói | Chỉ tiếng Việt | Khách du lịch nước ngoài: thêm bản tiếng Anh, chuỗi dài hơn ~30 % |

## 🛑 Cổng 3 · Design system, sơ đồ trang, phạm vi — chờ trả lời, trình 05/10/2026 *(sketch-to-site)*
**Kiểm công cụ** *(B0)*: `AskUserQuestion` không có *(phiên chạy như subagent: câu hỏi Cổng 3 viết ra rồi dừng)* · Chromium có *(lệnh kiểm chụp headless)* · `WebFetch` không cần *(không tham chiếu URL)* · không có app.
**Hai trường hợp khó** *(B1, dựng thành component thật trên `site/_system.html`)*:
1. **Màn đầu khi lò không có mẻ:** thứ Hai nghỉ, hoặc mẻ 17:30 đã hết. Kèm giờ dài nhất "17:30" trong vòm lớn.
2. **Mẻ đã hết ở khổ điện thoại, chuỗi dài nhất:** buổi chiều, hai mẻ sáng hết; hàng bốn cửa trong khung 390px, khay mẻ đã hết gạch món, nút dẫn sang mẻ kế, tên món và nút dài nhất.
**Thử concept ở B1:** giữ được ở hàng bốn cửa vòm và khay ở 390px *(sau khi cỡ giờ trên cửa theo bề rộng hàng cửa thay vì `vw`: lần chụp đầu "15:00", "17:30" tràn khỏi cửa)*, khay mẻ đã hết, vòm lớn với "17:30" *(cỡ giờ chặn theo bề rộng vòm)* · gãy ở màn đầu ngày nghỉ và sau mẻ cuối: vòm tắt lửa thành gạch `--accent`, mất chỗ sáng than hồng duy nhất mà lớp Ý dựa vào *(8/10 nhờ chỗ sáng đó)*; màn chỉ còn nâu gạch trên nâu muội, nút giữ bánh cam là chỗ sáng còn lại. Xảy ra mỗi thứ Hai và mỗi tối sau khi mẻ 17:30 hết. Không tự pha loãng: hỏi ở câu 3.
**Lệnh kiểm** `system-check.mjs`: themes.mjs 1 theme · 26 cặp · 0 không đạt · 0 sát ngưỡng · preflight 0 lỗi 0 cảnh báo · `_system` 1440 và 390: console 0, tràn ngang 0, trong khung 0, tương phản 0, ý định 0, component mẫu 0, cặp 26/26 · **SẠCH** *(lần chạy thứ ba; lần đầu tràn ngang 2532px do ảnh vòm có `aspect-ratio` trong khay hai cột, đã sửa ở `site.css`)*.
**Đáp án design system và sơ đồ trang (nguyên văn):**
**Phạm vi (nguyên văn):**
**Chỗ concept gãy (nếu có, nguyên văn):**
**Sửa theo yêu cầu:**

## 🛑 Cổng 4 · Nghiệm thu — <dd/mm/yyyy> *(sketch-to-site)*
**Số kiểm lúc trình:** preflight <…> · UX <…> · hiển thị <…>
**Đáp án (nguyên văn):**

## Cổng được bỏ qua
| Cổng | Người dùng nói (nguyên văn) | Lúc |
|---|---|---|

## Lặp lại sau nghiệm thu
| Ngày | Yêu cầu | Đã làm |
|---|---|---|

