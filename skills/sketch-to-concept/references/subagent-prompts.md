# Prompt cho subagent — dùng ở A3

> Mục 1 *(dựng)*: chỉ khi người dùng xin dựng song song trong phiên. Mặc định một agent dựng tuần tự theo SKILL.md, A3 bước 4.
> Mục 2 *(chấm lớp Ý trên dữ liệu)*: khi phiên cho tạo subagent. Không thì tự chấm theo `concept-method.md` mục 7.
> Điền mọi chỗ `{…}` trước khi gửi. **Không** dán thông tin của hai concept kia vào prompt dựng: mục đích là để ba bản không nhìn nhau mà tụ về một lối.
> Rút từ `superpowers` *(dispatching-parallel-agents, requesting-code-review)* và `huashu-design` *(ba bản độc lập)*. Nguồn ở `THIRD_PARTY_LICENSES.md`.

## 1. Dựng một concept

Gửi tối đa ba prompt cùng lúc, mỗi concept một prompt.

```text
Bạn dựng MỘT concept cho bảng concept của dự án {tên dự án}. Hai concept khác do người khác dựng; bạn không đọc và không đoán chúng.

Đọc trước, chỉ những phần sau:
- {thư mục prototype}/concept/concepts.js: brief và content, chưa có concept nào. Màn của bạn dùng đúng content này.
- {skills}/sketch-to-concept/references/concept-method.md: mục 2 (tìm Ý), 5 (Hình), 6 (Dụng), 7 (chấm lớp Ý).
- Mục 3 và 6 của {skills}/sketch-to-site/SKILL.md (chống AI-slop, dữ liệu thật, ảnh), in riêng hai mục, không đọc cả file:
  sed -n '/^## 3\./,/^## 4\./p;/^## 6\./,/^## 7\./p' "{skills}/sketch-to-site/SKILL.md"
- {skills}/sketch-to-concept/templates/key-screen.html: giữ nguyên <head>, chỉ đổi data-concept. Tên biến CSS dùng được có trong <head> đó.
Không mở tokens.js, color.js, index.html, theme.js: không cần để dựng màn.

Phần giao cho bạn:
- id: {a | b | c} · nguồn: {hợp nhất | chuẩn thật: tên sản phẩm đã kiểm bằng WebSearch | lăng kính studio: tên và lý do}
- họ phong cách: {tên trong style-catalogue.md} · dial: {V/M/D}
- trục: nền {…} · chất nền {…} · tính cách chữ {…} · trục ý tưởng {…} · khoảnh khắc đọc lần hai {…} · khung bố cục {…}
- màn then chốt: {màn} · tương tác đặc trưng phải bấm được: {…}

Dự án có app: dựng màn theo {skills}/sketch-to-site/templates/mobile/screen.html, giữ khối <head> token như key-screen.html; app.css và app.js đã có sẵn trong concept/. Dự án nhiều bề mặt: dựng màn then chốt của mọi bề mặt.

Làm:
1. Ghi khối dữ liệu của concept vào {thư mục prototype}/concept/{id}.concept.js, dạng CONCEPTS.concepts.push({ … }); theo khuôn concepts.js: id, name, source, family, dial, idea, metaphor, formFrom, signature, axes, colors, fontFamily, fontWeights, shape. Viết khoá không đặt trong ngoặc kép (fontFamily: { display: '…' }) để preflight kiểm được font. Mọi màu viết hex. Mọi font kiểm dấu tiếng Việt bằng python {skills}/sketch-to-site/scripts/preflight.py --font "<tên>".
2. Chấm lớp Ý của khối vừa ghi theo concept-method.md mục 7, phần "Trên dữ liệu". Từ 5 trở xuống thì sửa ý trong {id}.concept.js trước khi dựng màn.
3. Viết {thư mục prototype}/concept/{id}.html theo key-screen.html, đúng khung bố cục đã giao, bằng một lần Write; sửa sau đó bằng Edit. Gắn data-signature lên khối của tương tác đặc trưng. Trong <head>, thêm <script src="{id}.concept.js"></script> sau concepts.js, trước tokens.js.
4. Chạy: python {skills}/sketch-to-site/scripts/preflight.py {thư mục prototype}/concept/{id}.html. Phải 0 lỗi.
5. Chụp và đo: node {skills}/sketch-to-concept/scripts/shots.mjs {thư mục prototype}/concept {id}.html. Sửa tới khi hai dòng đều OK, rồi mở các ảnh ra xem.
6. Không sửa concepts.js, index.html, tokens.js, theme.js, và không đụng file của concept khác.

Trả về đúng các phần sau, theo thứ tự:
1. Đường dẫn file {id}.concept.js và {id}.html đã ghi.
2. Câu "form đến từ đâu trong nội dung" và điểm tự chấm lớp Ý.
3. Dòng kết quả cuối của preflight và hai dòng của shots.mjs.
4. Chỗ bạn không chắc, nếu có.
```

Agent chính nhận ba bản trả về: ghép ba khối vào `concept/concepts.js`, rồi xoá các file {id}.concept.js và dòng nạp chúng trong {id}.html *(để lại thì bảng báo trùng id)*. Mở `concept/index.html` kiểm mục **So trục**. Hai concept chung khung hay dưới 3 trục khác nhau thì gửi lại prompt cho **một** concept, kèm trục phải đổi.

Subagent dừng giữa chừng *(lỗi API, chạm giới hạn phiên)*: tạo subagent mới với prompt này, thêm một dòng "file đã có: …, làm tiếp từ bước …". Không đánh thức lại subagent cũ bằng tin nhắn: nó phải nạp lại toàn bộ ngữ cảnh đã có, đắt hơn bắt đầu mới.

## 2. Review các concept bằng góc nhìn mới, trên dữ liệu

Gửi cho một subagent **chưa tham gia viết** `concepts.js`, ở A3 bước 3, trước khi dựng màn.

```text
Bạn chấm lớp Ý các concept của dự án {tên dự án}. Bạn không viết các concept này. Chỉ đọc, không sửa file nào.

Đọc, chỉ những phần sau:
- {thư mục prototype}/concept/concepts.js: brief, content và các concept.
- {skills}/sketch-to-concept/references/concept-method.md: mục 4 (ba concept khác nhau thật) và mục 7 (chấm lớp Ý, phần "Trên dữ liệu").
Màn chưa dựng: không mở ảnh, không mở file HTML.

Trả lời gọn, mỗi concept tối đa 6 dòng. Với từng concept, trả về:
1. Điểm lớp Ý 1-10 theo thang ở mục 7, kèm một câu lý do. Trả lời thẳng câu "đổi tên sản phẩm thì concept còn đứng được không".
2. Tối đa 3 vấn đề cụ thể, mỗi vấn đề chỉ vào trường trong concepts.js (idea, metaphor, formFrom, signature, axes): sáo ngữ, form không đến từ nội dung, tương tác đặc trưng không phục vụ việc chính, trục khai không khớp ý.
3. Một hướng sửa cho concept từ 5 điểm trở xuống, một câu.
4. Concept này giống concept nào quá mức, nếu có (chung khung, chỉ khác màu).

Cuối cùng: danh sách những gì bạn đã cân nhắc mà bỏ qua vì ngoài phạm vi, mỗi dòng một lý do.
```

Agent chính: concept ≤ 5/10 thì sửa ý trong `concepts.js` theo hướng sửa, rồi dựng. Không chấm lại trên dữ liệu: lần soát trên ảnh ở A3 bước 5 sẽ kiểm. Vấn đề không sửa thì nêu lý do ở Cổng 2.
