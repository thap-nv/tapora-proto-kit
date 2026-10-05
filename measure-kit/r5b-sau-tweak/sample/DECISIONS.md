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
| **Trạng thái của một mẻ trong ngày** *(B1, thử trên màn)* **· đổi thiết kế** | Năm trạng thái: chưa vào lò · đang nướng · **đã ra lò, còn bánh** · đã hết · lò nghỉ. Concept chỉ vẽ ba *(đã hết, đang nướng, chưa vào lò)*; trạng thái "còn bánh" đưa lên Cổng 3 câu 3 | Nếu tiệm chỉ muốn ba trạng thái: bỏ vật liệu `.ember`, "còn bánh" chỉ còn là một dòng chữ |
| Lịch mẻ *(B1)* | Luôn 4 mẻ cố định 6:00 · 9:30 · 15:00 · 17:30, mọi ngày trừ thứ Hai | Lịch đổi theo mùa hay ngày lễ: thêm dòng "lịch hôm nay" và chỗ khai lịch |
| Danh sách rỗng *(B1)* | Không mẻ nào trong ngày *(thứ Hai, trước 5:30, sau 19:00)*: vòm gạch "Thứ Hai lò nghỉ · Mẻ đầu sáng thứ Ba". Hết sạch cả 4 mẻ: vòm tro "Hôm nay hết bánh · Mẻ đầu sáng mai" | Tiệm muốn báo nghỉ đột xuất: thêm một dòng thông báo trên vòm, cần người cập nhật |
| Số món *(B1)* | 4 món *(người dùng nói)*; bố cục chịu tới 8 món, danh sách dọc | Hơn 8 món: nhóm theo loại *(bánh mì, bánh ngọt)*, panel mẻ dài ra, có thể cần thu gọn |
| Chuỗi dài nhất *(B1, đo ở khổ 320)* | Tên món "Bánh sừng bò bơ Đà Lạt" xuống 2 dòng, giá giữ một dòng *(`white-space:nowrap`; ở concept giá "22.000 ₫" bị gãy)* · nhãn cửa "Chưa vào lò" 2 dòng trong ô 66px · nút "Giữ bánh mẻ 17:30 qua Zalo" giãn hết bề ngang · địa chỉ "14 Hai Bà Trưng, Phường 1, Đà Lạt" | Tên món thật dài hơn 30 ký tự: ô cửa và panel vẫn chịu, nhưng tin nhắn mẫu dài ra |
| Số lớn nhất *(B1)* | Giá lớn nhất 22.000 ₫; giờ dài nhất "17:30" ở 80px vừa vòm 275px *(đo B1, khổ 320, còn dư 75px)* · đếm ngược chỉ khi còn dưới 60 phút, còn lại ghi giờ | Giá lên 6 chữ số *(100.000 ₫)*: cột giá rộng thêm, vẫn một dòng |
| Số thật và số minh hoạ *(B1)* | Thật *(người dùng nói)*: 4 giờ mẻ, 4 giá, địa chỉ, Zalo 0909 123 456, giờ mở 5:30-19:00, nghỉ thứ Hai. Minh hoạ, gắn nhãn trên trang: giờ hiện tại 8:40, "ra lò sau 50 phút", trạng thái từng mẻ, giờ hết mẻ, tên khách trong tin nhắn mẫu | Có số thật thì thay, không đổi bố cục |
| Giờ hiện tại của prototype *(B1)* **· đổi thiết kế** | Mặc định giờ minh hoạ 8:40 thứ Bảy, đổi bằng `?gio=11:00&thu=2` để trình đủ năm trạng thái; không theo đồng hồ máy *(ảnh bộ kiểm không trôi theo giờ chạy)* | Muốn theo giờ thật: đổi một hàm tính mẻ kế; trạng thái còn/hết vẫn minh hoạ |
| Giữ bánh qua Zalo *(B1)* **· đổi thiết kế** | Không có hành động nào không đảo ngược được trên site: việc giữ bánh xảy ra trong Zalo, site không xác nhận được. Link `zalo.me/0909123456` không điền sẵn chữ, nên panel mẻ có **tin nhắn mẫu theo mẻ + nút Chép** *(toast "Đã chép")*. Chép bị chặn: báo cạnh chỗ chép, chép tay hoặc nhắn số. Máy không có Zalo: dòng "nhắn hoặc gọi 0909 123 456 từ điện thoại". Cạnh nút ghi: Cô Ba trả lời trên Zalo là đã giữ | Tiệm muốn khách điền form giữ bánh trên web *(tên, số lượng, mẻ)*: thêm form và nơi nhận đơn, ra khỏi phạm vi site tĩnh |
| Ảnh *(B1)* | Chưa có ảnh thật: khung chờ ghi rõ nội dung và cỡ: khay bánh mỗi mẻ 1200×900 *(4 ảnh, hoặc 1 ảnh dùng chung)*, mặt tiền tiệm 1600×1000 | Có ảnh thật tỉ lệ khác: đổi tỉ lệ khung vòm ảnh |

## 🛑 Cổng 3 · Design system, sơ đồ trang, phạm vi — trình 04/10/2026, đáp án 05/10/2026 *(sketch-to-site)*
**Thử concept ở B1** *(chạy `run.mjs` trên `concept/c.html` nguyên bản, đổi DOM sang trạng thái khó, khổ 320 và 390; ảnh ở `concept/shots/b1/`)*: hai chỗ khó nhất là **màn đầu qua mọi trạng thái trong ngày** và **hàng cửa lò khi hết sạch, khổ 320**.
- **Giữ được ở:** vòm đang nướng *(khoảnh khắc than hồng còn nguyên; "17:30" ở 80px vừa vòm 275px)* · hết sạch và thứ Hai *(vòm tro, vòm gạch đóng đúng ẩn dụ "cửa lò đóng")* · hàng 4 cửa ở 320 *(ô 66px, nhãn "Chưa vào lò" 2 dòng, không tràn)* · tương phản trên nền thật 0 lỗi, tràn ngang 0, chữ bị cắt 0.
- **Gãy ở:** trạng thái **mẻ đã ra lò, còn bánh**. Concept chỉ có ba trạng thái; từ lúc một mẻ ra lò tới khi mẻ sau vào lò *(khoảng 9:30-14:00)* vòm màn đầu là gạch tối của mẻ kế, câu khách cần nhất "có bánh ngay không" thành dòng phụ, và chỗ sáng duy nhất của trang biến mất phần lớn giờ mở cửa: trang đọc như đang đóng cửa, đúng rủi ro "u tối" đã nêu ở Cổng 2 *(ảnh `concept/shots/b1/390/hero-con-banh-1100.png`)*. Không tự pha loãng: hỏi ở câu 3.
- **Lỗi bố cục, không phải concept** *(sửa ở B3, ghi ở `DESIGN.md` mục 6)*: ở 1440×900 H1 3 dòng và nút giữ bánh nằm dưới mép màn đầu *(`concept/shots/c-1440.png`)*; giá "22.000 ₫" gãy dòng ở 320.
**Lời người dùng (nguyên văn, 05/10/2026):** "Duyệt design system và sơ đồ trang. Phạm vi: 1 trang chủ. Giữ concept, chấp nhận ngoại lệ ở màn đó."
**Đáp án design system và sơ đồ trang (nguyên văn):** "Duyệt design system và sơ đồ trang." → **Duyệt**. `DESIGN.md` khoá ngày 05/10/2026.
**Phạm vi (nguyên văn):** "Phạm vi: 1 trang chủ." → **1 trang chủ** *(`site/index.html`; `BUILD-LOG.md`)*
**Chỗ concept gãy (nếu có, nguyên văn):** "Giữ concept, chấp nhận ngoại lệ ở màn đó." → **Giữ concept, chấp nhận ngoại lệ ở màn X** *(lựa chọn 1 của câu 3)*.
Cách hiểu *(câu 3 đã trình hai bản vẽ trên `_system.html`: lựa chọn 1 giữ concept, lựa chọn 2 vật liệu `.ember`)*: chọn lựa chọn 1. Không thêm vật liệu `.ember`; khi một mẻ đã ra lò mà còn bánh, vòm màn đầu là cửa gạch của mẻ kế, "Mẻ X còn bánh ở quầy" là dòng chữ dưới giờ, ô cửa của mẻ đó dùng gạch với nhãn "Còn bánh". Ngoại lệ được chấp nhận: ở trạng thái này màn đầu không có chỗ sáng than hồng.
**Sửa theo yêu cầu:** không.
**Kiểm công cụ** *(B0 làm tiếp, 05/10/2026)*: `AskUserQuestion` không có *(phiên chạy như subagent, không hỏi được người dùng: câu hỏi Cổng 4 viết ra rồi dừng)* · công cụ tạo subagent có *(Agent, loại Explore chỉ đọc, dùng cho review ở B4)* · không có app *(`CONCEPT.md` mục 0: chỉ web)*.

## 🛑 Cổng 4 · Nghiệm thu — 05/10/2026 *(sketch-to-site; đã chốt)*
**Số kiểm lúc trình:** preflight 2 file · 0 lỗi · 0 cảnh báo · UX Trang chủ 12/12 · hiển thị 1440 ✅ 768 ✅ 390 ✅ *(qa-check `_qa/handover/20261005-1317`, theme dark: 6 bộ · 27 bước · console 0 · FAIL 0 · tràn 0 · cắt 0 · tương phản 0 · ý định 0 · sâu 0; 6 trạng thái trong ngày qua `qa-states`)*
**Review độc lập** *(subagent Explore chỉ đọc, chưa tham gia dựng; trên lần chạy 20261005-1304)*: kết luận "làm lại", 8 vấn đề · 0 chặn · 4 nên sửa *(đã sửa hết: khung ảnh vòm giãn theo cột ở panel hai cột · số và dãy giờ không gãy giữa nhóm số · H1 cân dòng ở 768 và 390 · nút giữ bánh mẻ hôm sau ghi kèm ngày)* · 4 nhỏ *(đưa lên cổng)*. Thêm 1 nhỏ tự thấy: khoảng hai bên dấu "·" trong dãy giờ chưa đều.
**Đã hỏi:** Chốt · Sửa theo danh sách *(5 mục nhỏ)* · Chạy `laws-of-ux-review` đầy đủ (0–60) · Đổi concept *(về Cổng 2)*. Không gắn khuyến nghị cho `laws-of-ux-review`: site giới thiệu, 12/12.
**Đáp án (nguyên văn):** "Chốt."
**Bàn giao** *(05/10/2026)*: `python _qa/handover.py promote _qa/handover/20261005-1317` thành mốc bàn giao đầu *(`_qa/last-green/`, 6 bộ)*; thêm khối lệnh kiểm vào `AGENTS.md` của dự án. Từ đây: sửa nhỏ dùng `tweak-site`, thêm tính năng dùng `evolve-site`, trước khi bàn giao lại dùng `handover-check`.

## Cổng được bỏ qua
| Cổng | Người dùng nói (nguyên văn) | Lúc |
|---|---|---|

## Lặp lại sau nghiệm thu
| Ngày | Yêu cầu | Đã làm |
|---|---|---|

