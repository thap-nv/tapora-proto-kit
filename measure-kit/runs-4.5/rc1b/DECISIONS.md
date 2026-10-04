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
| Danh sách mẻ: rỗng · một · nhiều *(B1, sketch-to-site)* | Luôn 4 mẻ cố định. "Rỗng" = thứ Hai nghỉ hoặc ngoài 5:30-19:00: cả bốn vòm gạch, nút dẫn sang mẻ 6:00 của ngày mở kế. "Một" = chỉ còn mẻ 17:30. Mẻ kế và ngày nghỉ tính theo đồng hồ máy, giờ Đà Lạt *(UTC+7)*; ép bằng `?now=&day=` để demo | Nếu tiệm nghỉ thêm ngày lễ hay đổi giờ mẻ: cần một chỗ khai ngày nghỉ, nếu không trang báo "đang nướng" khi lò tắt |
| Món trong một mẻ: rỗng · đủ *(B1)* | Mẻ hết thì 4 món gạch ngang, không ẩn; mẻ chưa vào lò vẫn hiện 4 món | Nếu tiệm muốn báo hết từng món chứ không cả mẻ: khay cần trạng thái theo món, ô cửa không còn đủ chỗ báo |
| Chuỗi dài nhất *(B1)* | Tên món "Bánh sừng bò bơ Đà Lạt" *(22 ký tự)* · địa chỉ "14 Hai Bà Trưng, Phường 1, Đà Lạt" · nút "Giữ bánh mẻ 6:00 thứ Ba qua Zalo" · nhãn cửa "Hết lúc 8:10", "Chưa vào lò" ở ô ~80px | Tên món mới dài hơn ~30 ký tự xuống hai dòng trong khay ở 390px; nhãn cửa dài hơn "Chưa vào lò" sẽ ba dòng |
| Số lớn nhất · số nào thật *(B1)* | Lớn nhất 22.000 ₫. **Thật** *(người dùng nói)*: giá 4 món, giờ 4 mẻ, giờ mở, ngày nghỉ, địa chỉ, Zalo. **Minh hoạ**: giờ hiện tại 8:40, "hết lúc 8:10", "ra lò sau 50 phút", trạng thái từng mẻ, "mẻ 9:30 còn ít" | Số minh hoạ bị đọc như thật thì khách tới mà hết bánh: mất "đáng tin". Mỗi số minh hoạ có nhãn trên trang |
| Hành động không đảo ngược · xác nhận · thất bại *(B1)* | Trang không có hành động nào không đảo ngược: giữ bánh diễn ra trong Zalo, Cô Ba xác nhận bằng tin trả lời. Máy không có Zalo: `zalo.me` mở bản web; trang hiện số Zalo bằng chữ và nút Chép số Zalo *(toast "Đã chép số Zalo 0909 123 456.")* | Nếu muốn giữ bánh ngay trên trang *(form tên, số, giờ lấy)*: thêm form, trạng thái gửi, lỗi, và cần nơi nhận đơn |

## 🛑 Cổng 3 · Design system, sơ đồ trang, phạm vi — 04/10/2026 *(sketch-to-site)*
**Hai trường hợp khó (B1):** (1) Ngày nghỉ thứ Hai: cả bốn vòm đóng, màn đầu không còn than hồng. (2) Mẻ đã hết đang mở, cùng chuỗi dài nhất, hàng bốn cửa ở 390px. Cả hai dựng thật trên `site/_system.html` *(khối `data-hard-case`)*.
**Kiểm `system-check.mjs`:** SẠCH · themes.mjs 1 theme · 26 cặp · 0 không đạt · 0 sát ngưỡng · preflight 0 lỗi 0 cảnh báo · 1440 và 390: console 0, tràn ngang 0, chữ trong khung 0, tương phản 0, ý định 0. Lần chạy đầu bắt 4 chữ trong vòm lớn ăn màu `--muted` của trang design system *(1,07:1 trên than hồng)*: sửa ở gốc, `.lc-hero-arch p{color:inherit}` trong `app.css`.
**Thử concept ở B1:** giữ được ở vòm than hồng là chỗ sáng duy nhất; hàng bốn cửa 4 cột vẫn vừa ở 390px, không tràn, không cắt chữ; mẻ hết đọc rõ *(nền muội than, giờ gạch ngang, món gạch ngang, nút dẫn sang mẻ kế)*; ngày nghỉ đúng logic concept *(cửa lò đóng)* · gãy ở: không. Rủi ro nêu ở Cổng 3: ngày nghỉ và sau 19:00 màn đầu toàn gạch tối, chỗ ấm duy nhất là nút cam, sát vẻ u tối mà người dùng ghét.
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

