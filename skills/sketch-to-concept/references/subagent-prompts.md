# Prompt cho subagent — dùng ở A3

> Chỉ dùng khi môi trường có công cụ tạo subagent **và** phiên cho phép. Không có thì làm tuần tự theo SKILL.md, A3.
> Điền mọi chỗ `{…}` trước khi gửi. **Không** dán thông tin của hai concept kia vào prompt dựng: mục đích là để ba bản không nhìn nhau mà tụ về một lối.
> Rút từ `superpowers` *(dispatching-parallel-agents, requesting-code-review)* và `huashu-design` *(ba bản độc lập)*. Nguồn ở `THIRD_PARTY_LICENSES.md`.

## 1. Dựng một concept

Gửi ba prompt cùng lúc, mỗi concept một prompt.

```text
Bạn dựng MỘT concept cho bảng concept của dự án {tên dự án}. Hai concept khác do người khác dựng; bạn không đọc và không đoán chúng.

Đọc trước:
- {thư mục prototype}/concept/concepts.js: brief và content, chưa có concept nào. Màn của bạn dùng đúng content này.
- {skills}/sketch-to-concept/references/concept-method.md: mục 2 (tìm Ý), 5 (Hình), 6 (Dụng).
- {skills}/sketch-to-site/SKILL.md: mục 3 và 6 (chống AI-slop, dữ liệu thật, ảnh).
- {skills}/sketch-to-concept/templates/key-screen.html: giữ nguyên <head>, chỉ đổi data-concept.

Phần giao cho bạn:
- id: {a | b | c} · nguồn: {hợp nhất | chuẩn thật: tên sản phẩm đã kiểm bằng WebSearch | lăng kính studio: tên và lý do}
- họ phong cách: {tên trong style-catalogue.md} · dial: {V/M/D}
- trục: nền {…} · chất nền {…} · tính cách chữ {…} · trục ý tưởng {…} · khoảnh khắc đọc lần hai {…} · khung bố cục {…}
- màn then chốt: {màn} · tương tác đặc trưng phải bấm được: {…}

Dự án có app: dựng màn theo {skills}/sketch-to-site/templates/mobile/screen.html, giữ khối <head> token như key-screen.html; app.css và app.js đã có sẵn trong concept/. Dự án nhiều bề mặt: dựng màn then chốt của mọi bề mặt.

Làm:
1. Ghi khối dữ liệu của concept vào {thư mục prototype}/concept/{id}.concept.js, dạng CONCEPTS.concepts.push({ … }); theo khuôn concepts.js: id, name, source, family, dial, idea, metaphor, formFrom, signature, axes, colors, fontFamily, fontWeights, shape. Viết khoá không đặt trong ngoặc kép (fontFamily: { display: '…' }) để preflight kiểm được font. Mọi màu viết hex.
2. Viết {thư mục prototype}/concept/{id}.html theo key-screen.html, đúng khung bố cục đã giao. Trong <head>, thêm <script src="{id}.concept.js"></script> sau concepts.js, trước tokens.js.
3. Chạy: python {skills}/sketch-to-site/scripts/preflight.py {thư mục prototype}/concept/{id}.html. Phải 0 lỗi.
4. Không sửa concepts.js, index.html, tokens.js, theme.js, và không đụng file của concept khác.

Trả về đúng các phần sau, theo thứ tự:
1. Đường dẫn file {id}.concept.js và {id}.html đã ghi.
2. Câu "form đến từ đâu trong nội dung".
3. Dòng kết quả cuối của preflight.
4. Chỗ bạn không chắc, nếu có.
```

Agent chính nhận ba bản trả về: ghép ba khối vào `concept/concepts.js`, rồi xoá các file {id}.concept.js và dòng nạp chúng trong {id}.html *(để lại thì bảng báo trùng id)*. Mở `concept/index.html` kiểm mục **So trục**. Hai concept chung khung hay dưới 3 trục khác nhau thì gửi lại prompt cho **một** concept, kèm trục phải đổi.

## 2. Review các concept bằng góc nhìn mới

Gửi cho một subagent **chưa tham gia dựng**, sau khi đã chụp ảnh ở A3.

```text
Bạn review bảng concept của dự án {tên dự án}. Bạn không dựng các concept này. Chỉ đọc, không sửa file nào.

Đọc:
- {thư mục prototype}/concept/concepts.js (brief, content, ba concept) và ảnh trong {thư mục prototype}/concept/shots/.
- {skills}/sketch-to-concept/references/concept-method.md: mục 4 (ba concept khác nhau thật) và mục 7 (chấm lớp Ý).

Với từng concept, trả về:
1. Điểm lớp Ý 1-10 theo thang ở mục 7, kèm một câu lý do. Trả lời thẳng câu "đổi tên sản phẩm thì concept còn đứng được không".
2. Tối đa 3 vấn đề cụ thể, mỗi vấn đề chỉ vào chỗ trên ảnh hoặc dòng trong concepts.js: sáo ngữ hay AI-slop, form không đến từ nội dung, tương tác đặc trưng không phục vụ việc chính, trục khai trong axes không khớp màn thật.
3. Concept này giống concept nào quá mức, nếu có (chung khung, chỉ khác màu).

Cuối cùng: danh sách những gì bạn đã cân nhắc mà bỏ qua vì ngoài phạm vi, mỗi dòng một lý do.
```

Agent chính: concept nào ≤ 5/10 thì làm lại concept đó *(gửi lại prompt mục 1)*. Vấn đề không sửa thì nêu lý do ở Cổng 2. Concept làm lại thì gửi lại prompt mục 2 cho riêng concept đó.
