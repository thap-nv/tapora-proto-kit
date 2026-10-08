# Trang lối vào · sketch-to-site

> Prototype có từ 2 bề mặt, hoặc một bề mặt mà từ 2 vai thấy menu khác nhau: `site/index.html` là **trang lối vào** của prototype, cho người mở link lần đầu và cho đội dùng hằng ngày, không phải trang của sản phẩm. Còn lại thì `index.html` là trang chủ của sản phẩm và file này không áp dụng.
> In đúng mục, trong lượt đã có: B2 mục 1, 2, 5 *(cùng lượt `system-check.mjs` đầu tiên)* · B3 mục 1, 3, 4 *(khi tới dòng cuối của `BUILD-LOG.md`)* · B4 mục 6 *(lệnh in đầu B4)*.

## 1. Sáu câu trang phải trả lời

Kiểu nào cũng đủ sáu câu; kiểu chỉ quyết câu nào dẫn đầu, câu nào xuống thấp hay gọn thành một dòng.

1. **Đây là gì:** tên dự án, một câu làm gì cho ai, nhãn *Prototype* và ngày demo.
2. **Có những bề mặt nào:** mỗi bề mặt một ảnh chụp thật màn then chốt *(mục 4)*, thiết bị, ai dùng, nút mở.
3. **Vào bằng vai nào** *(chỉ khi có phân quyền)*: người cụ thể và vai, mở thẳng trang chủ của vai.
4. **Kịch bản demo:** đánh số, ghi vai, bấm là tới đúng màn bắt đầu với đúng vai.
5. **Cần biết khi xem:** số minh hoạ, giả định chờ xác nhận, ngoài phạm vi, cách chạy.
6. **Công cụ:** đặt lại dữ liệu demo, đổi theme, bật mã tham chiếu cho BA *(nếu dự án có)*, link `_system.html`.

## 2. Ba kiểu

| Kiểu | Hợp khi | Màn đầu dẫn bằng | Bẫy |
|---|---|---|---|
| **Trình diễn** | Trình khách, lãnh đạo; 2–4 bề mặt | Tên và một câu; câu chuyện ngắn về một bản ghi *(đơn, buổi học)* đi qua các bề mặt; ảnh lớn từng bề mặt, cỡ theo thiết bị | Ảnh to mà không nói bắt đầu từ đâu; câu chuyện quá 3 dòng |
| **Theo vai** | Đội dùng hằng ngày; từ 5 vai, hay phân quyền chặt | Ô người và vai nhóm theo bề mặt, bấm là vào trang chủ của vai; ảnh nhỏ cạnh tên bề mặt; công cụ thấy ngay | Thành danh sách link trơn: không ảnh, không câu 1, mọi ô cùng trọng lượng |
| **Hành trình** | Giá trị nằm ở luồng xuyên bề mặt *(đặt, nhận, làm, thanh toán)* | Một dải 3–6 bước của luồng chính; mỗi bước có ảnh màn ở bề mặt đó, vai, nút mở đúng bước | Bước mở sai trạng thái; dải vỡ ở 390 |

Phác bố cục *(điền tên thật khi trình ở Cổng 3)*:

```
Trình diễn               Theo vai                    Hành trình
[Tên · một câu][chuyện]  [Tên · một câu]  [Công cụ]  [Tên · luồng chính một câu]
[ảnh A lớn ][ảnh B][C ]  [A ảnh nhỏ] [người·vai]…    [1 ảnh]→[2 ảnh]→[3 ảnh]→[4]
[Kịch bản theo bề mặt ]  [B ảnh nhỏ] [người·vai]…    [Bề mặt · vai · mở] […]
[Cần biết] [Công cụ   ]  [Kịch bản] [Cần biết]       [Kịch bản][Cần biết][Công cụ]
```

## 3. Luật dựng
- **Mặc concept đã chốt** *(sau trộn)*: token, font, yếu tố đặc trưng của `CONCEPT.md`; họ bố cục theo họ phong cách. Không dùng vỏ của app *(sidebar, thanh tab)*.
- **Một thứ dẫn đầu**, theo kiểu đã chốt ở Cổng 3; tối đa một nút chính; không ba thẻ bằng nhau *(ảnh bề mặt to nhỏ theo thiết bị)*. Không dựng màn giả bằng `div`: ảnh là ảnh chụp thật.
- **Dựng sau cùng**, dòng cuối của `BUILD-LOG.md`: link kịch bản và ảnh cần màn thật. Viết trang và chạy `preflight.py` trong **cùng một tin nhắn**.
- **Ngân sách ≤ 20 KB** *(dòng `Ảnh lối vào` của `qa-check.py` in cỡ trang và nhắc khi vượt)*. Dùng lại `store.js` *(`?reset` đặt lại dữ liệu)* và `theme.js` *(`theme.set`)*, không viết lại.
- Kịch bản và chọn vai mở bằng tham số URL *(`?vai=…`, `?id=…`)*; chọn vai mà tự chuyển trang thì ghi `// nav-ok: chọn vai` *(P23)*.
- **Có bản đồ:** vai và trang chủ của vai lấy từ `map/layout.js`; bề mặt hoãn là một thẻ *giai đoạn sau*, không ảnh.

## 4. Ảnh xem trước
- Khai trên thẻ ảnh, bộ kiểm tự chụp: `<img src="assets/shots/<tên>.jpg" data-shot="<tên>" data-shot-page="<trang>[?tham số]" data-shot-size="desktop|mobile" alt="<bề mặt>: <màn>">`.
  - `<tên>`: a-z, 0-9, gạch ngang. `data-shot-page` tính từ `site/`, ví dụ `admin/tong-quan.html?vai=ke-toan`.
  - `desktop` *(mặc định)* chụp màn đầu ở 1440×900; `mobile` chụp ở 390×844, trang lối vào tự vẽ khung máy bằng CSS.
- `qa-check.py` chụp ảnh **thiếu hay cũ** *(trang nguồn, file nó nạp, hay khai báo mới hơn ảnh)* ở mọi theme, trước khi kiểm, rồi in một dòng `Ảnh lối vào: n mới chụp · n còn mới · console n · trang lối vào n KB`. Lúc dựng chưa có ảnh là bình thường.
- Theme khác theme mặc định dùng `<tên>-<theme>.jpg`; `theme.js` tự đổi. Không mở ảnh trong `assets/shots/`: ảnh trang `index` của lần kiểm đã cho thấy chúng.
- Không đọc mã `handover.py`, không tự chụp, không gọi `run.mjs` hay `handover.py thumbs` riêng.

## 5. Câu hỏi ở Cổng 3
- Câu **Trang lối vào**: 2–3 kiểu hợp dự án; kiểu khuyến nghị đứng đầu, ghi *(Khuyến nghị)* và lý do từ brief *(người xem chính, số vai, luồng xuyên bề mặt)*.
- `preview` của mỗi lựa chọn: phác bố cục ≤ 8 dòng, điền tên bề mặt, vai và kịch bản thật của dự án.
- Ghi câu hỏi, các lựa chọn và đáp án nguyên văn vào dòng `Trang lối vào` của khối Cổng 3 *(`DECISIONS.md`)* ngay lượt hỏi. `DESIGN.md` mục 9 có dòng `Lối vào`: kiểu và các phần theo thứ tự.

## 6. Soát ở B4
- [ ] Đủ sáu câu *(mục 1)*; câu 3 khi có phân quyền
- [ ] Ảnh 1440, màn đầu: biết đây là gì và bắt đầu từ đâu; dẫn đầu đúng kiểu đã chốt ở Cổng 3
- [ ] Một nút chính; không ba thẻ bằng nhau; mặc concept, không mượn vỏ app
- [ ] Ảnh xem trước là ảnh thật, đúng theme, không vỡ ở 390
- [ ] Mỗi kịch bản và mỗi ô vai mở đúng màn với đúng vai *(bấm thử, hay đọc `href`)*
- [ ] Dòng `Ảnh lối vào`: console 0, không quá 20 KB
