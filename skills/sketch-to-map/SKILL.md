---
name: sketch-to-map
description: >-
  Dùng khi một dự án nhiều tài liệu yêu cầu, nhiều chức năng hay nhiều vai sắp được dựng prototype (web app, công cụ vận hành, app mobile, hệ thống nhiều bề mặt) và cần biết đủ chức năng, mỗi chức năng nằm ở đâu, menu và trang chủ của từng vai ra sao TRƯỚC khi dựng: người dùng nói "bản đồ chức năng", "sơ đồ chức năng", "kiểm kê chức năng", "sợ dựng thiếu chức năng", "chức năng nằm ở đâu", "sắp xếp menu", "kiến trúc thông tin", "information architecture", "dựng theo đợt", có bộ tài liệu BA (use case, quy tắc nghiệp vụ, ma trận truy vết); hoặc sketch-to-concept đã chốt concept và dòng Quy mô đủ ngưỡng; hoặc sketch-to-site bắt đầu một dự án như vậy mà chưa có map/features.js. KHÔNG dùng cho site giới thiệu nhỏ một tài liệu (sketch-to-site), lên concept (sketch-to-concept), thêm tính năng vào prototype đã có (evolve-site), chấm UX trang có sẵn (laws-of-ux-review).
---

# Sketch to Map · Bản đồ chức năng và bố cục trước khi dựng

> **v1.0 (06/10/2026)** · Lịch sử phiên bản ở `CHANGELOG.md` của kit.
> **Đường dẫn:** `<skills>` là thư mục cha của thư mục chứa SKILL.md này. Trên Windows, đường dẫn đưa cho `node` và `python` viết có ổ đĩa và gạch xuôi (`W:/…`), không viết kiểu Git Bash `/w/…`. Lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh *(script của skill đã tự đặt)*.
> **Ngôn ngữ:** nói với người dùng bằng ngôn ngữ họ viết. Chữ người dùng đọc *(tên chức năng, màn, nhãn, `DECISIONS.md`)* theo ngôn ngữ đó.
> Việc của skill: trước khi dựng, **mọi chức năng có tên, có chỗ, có lối vào ngắn**, và người dùng **bấm thử** việc hằng ngày của họ trên một khung xám. Đo trên một prototype 28 trang đã qua nghiệm thu: không thiếu use case nào, nhưng 17 lối tắt đá người dùng sang trang khác không đường về, một màn gánh 10 use case, việc hằng ngày không có lối vào. Thiếu là ở **bố cục**, không ở đọc tài liệu.

---

## 0. Có nên dùng skill này không

| Tình huống | Đi đâu |
|---|---|
| Từ **2 tài liệu yêu cầu**, hay từ **15 tên chức năng**, hay từ **2 vai**, hay **nhiều bề mặt**, chưa dựng prototype | ✅ Skill này, sau `sketch-to-concept` *(dòng **Quy mô** của brief)*, trước B2 của `sketch-to-site` |
| Dự án lớn mà dựng **theo đợt** | ✅ Skill này: bản đồ giữ mọi chức năng, chức năng ngoài đợt mang trạng thái *hoãn* |
| Site giới thiệu, landing, một tài liệu, một vai | `sketch-to-site` thẳng |
| Đã có prototype, thêm tính năng hay module hoãn | `evolve-site` *(có `map/` thì tra và cập nhật bản đồ ở đó)* |
| Chưa có `CONCEPT.md` | `sketch-to-concept` trước. Người dùng muốn lập bản đồ trước concept thì được: bỏ đọc `CONCEPT.md`, bề mặt lấy từ tài liệu |

---

## 1. Luật dừng *(cùng luật với `sketch-to-site` mục 1: sửa thì sửa cả ba skill)*

**Cổng (🛑)** là chỗ chỉ con người được quyết. Tới cổng thì:
1. **Trình bày** thứ nhìn thấy được: khung bấm thử, ảnh, dòng chỉ số. Không hỏi mở kiểu *"bạn thấy bố cục thế nào?"*.
2. **Hỏi** bằng `AskUserQuestion`: tối đa 4 câu một lượt, mỗi câu 2–4 lựa chọn; lựa chọn khuyến nghị đứng **đầu**, ghi *(Khuyến nghị)*.
3. **Dừng.** Không có công cụ hỏi thì viết câu hỏi ra rồi **kết thúc lượt**. **Không tự chọn thay**, kể cả ở chế độ tự động hay phiên không người trực.
4. **Ghi** đáp án **nguyên văn** vào `DECISIONS.md` *(khuôn `<skills>/sketch-to-site/templates/DECISIONS.md`)*.

**Chỉ qua cổng mà không hỏi khi:** người dùng nói rõ **trong phiên này** là bỏ qua đúng cổng đó *(ghi nguyên văn)* · đáp án **đã có trong input** *(ghi nguồn)*.

<!-- luat-dung:co:bat-dau -->
**Cớ hay gặp để bỏ cổng, và sự thật** *(rút từ `superpowers` writing-skills và brainstorming; khối này giống hệt ở `sketch-to-site`, `sketch-to-concept` và `sketch-to-map`, test giữ ba bản khớp nhau)*:

| Cớ | Sự thật |
|---|---|
| "Đang chạy tự động, không ai trực, cứ chọn khuyến nghị cho nhanh" | Cổng là quyết định chỉ người dùng làm được. Dừng ở cổng không bị coi là tắc việc |
| "Phương án khuyến nghị rõ ràng tốt nhất, hỏi chỉ tốn một lượt" | Khuyến nghị đứng đầu và ghi *(Khuyến nghị)*. Chọn vẫn là việc của người dùng |
| "Người dùng giục: nhanh lên, gấp lắm" | Câu giục không phải lời bỏ cổng. Hỏi gọn hơn, gộp câu trong cùng cổng, không bỏ hỏi |
| "Người dùng đã duyệt ý tưởng, coi như duyệt luôn bản dựng" | Một lần duyệt chỉ áp cho **đúng thứ đã trình**. Thứ người dùng chưa xem thì chưa được duyệt |
| "Hỏi trước cho đỡ mất lượt, dựng sau" | Không hỏi khi chưa có gì để xem. Dựng bảng hay bản dựng trước, hỏi sau |
| "Chỉ là sửa nhỏ sau nghiệm thu, đổi luôn token hay concept" | Đổi thứ đã khoá ở cổng nào là mở lại cổng đó |
| "Người dùng chưa trả lời, chắc là đồng ý" | Im lặng không phải đồng ý. Nhắc lại câu hỏi |

Người dùng trả lời *Tuỳ bạn* cho một câu hỏi ở cổng: đó là lời giao quyết định cho câu đó. Chọn lựa chọn khuyến nghị; câu không có khuyến nghị thì chọn lựa chọn đầu, nêu lý do một dòng. Ghi nguyên văn vào `DECISIONS.md`, không hỏi lại câu đó.

**Dấu hiệu phải dừng lại:** thấy mình nghĩ *"để mình chọn luôn"*, *"chắc họ sẽ chọn A"*, *"hỏi thì mất công"*, *"trả lời sau cũng được"*, hay định viết *"tôi đã chọn … cho bạn"* khi người dùng chưa giao câu đó. Gặp một trong số đó: trình bày, hỏi, rồi kết thúc lượt.
<!-- luat-dung:co:ket-thuc -->

---

## 2. Quy trình · một cổng

```
M0 Nguồn ─► M1 Kiểm kê ─► M2 Bố cục ─► Kiểm bố cục (chỉ số + soát nhãn) ─► 🛑 Cổng Bản đồ ─► sketch-to-site, phiên mới
```

Cổng **không đánh số**: số 1–4 giữ nguyên cho concept và site, để dự án đang làm dở không đọc lệch `DECISIONS.md`.

**Lối vào.** Nhìn thư mục prototype, chọn đúng một dòng. Lượt kế tiếp làm **cả cột Lượt vào trong một lượt**: các lệnh `Read` và lệnh Bash gọi cùng lúc.

| Thư mục prototype | Làm | Lượt vào |
|---|---|---|
| Chưa có `map/features.js` | M0 → M1 | `Read` `references/m1-kiem-ke.md`, `CONCEPT.md`, `DECISIONS.md` · lệnh M0: `python <skills>/sketch-to-map/scripts/sources.py <thư-mục-tài-liệu> <thư-mục-prototype>` *(thư mục tài liệu ở dòng **Quy mô** của brief hay trong lời người dùng)* |
| Có `map/features.js`, chưa có `map/layout.js` | `check` sạch phần kiểm kê → M2 | `Read` `references/m2-bo-cuc.md` · `node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype> --brief` |
| Có `map/layout.js`, `DECISIONS.md` chưa có khối Cổng Bản đồ | Kiểm lại → cổng | `Read` `references/m2-bo-cuc.md` · lệnh kiểm ở `m2-bo-cuc.md` mục 4 |
| `DECISIONS.md` có khối Cổng Bản đồ | Xong. Chuyển `sketch-to-site` *(mục 5)*. Người dùng muốn sửa bản đồ: sửa `features.js` hay `layout.js`, chạy lại lệnh kiểm, mở lại cổng | |

**Ít lượt.** Mỗi lượt đọc lại cả ngữ cảnh. Lệnh và lần đọc không phụ thuộc nhau thì gọi chung một lượt. Ghi file và lệnh kiểm cũng **cùng một lượt**: `Write` hay các `Edit`, rồi Bash `check` trong cùng tin nhắn *(các lệnh gọi chạy theo thứ tự)*. **Không đọc mã** của `sources.py`, `map.mjs`: cách gọi, kết quả, mã thoát ghi đủ ở hai file giai đoạn. **Không tự viết** script dò tài liệu, không dò bằng `node -e`. Không viết HTML: `map/index.html`, `map/MAP.md` do `check` sinh. Trước cổng chỉ mở **một** ảnh.

---

## 3. 🛑 Cổng Bản đồ

**Trình bày** *(một tin nhắn)*:
- Link `map/index.html` và `map/MAP.md`. **Mời người dùng bấm thử** danh sách *Bấm thử việc hằng ngày* trên khung trước khi trả lời: mỗi việc bắt đầu từ trang chủ của vai, chấm *Dễ · Được · Khó*, rồi *Chép kết quả* dán lại.
- Dòng **Kiểm kê**, dòng **Nguồn** và dòng **Chỉ số bố cục** của lần `check --shots` sạch, nguyên văn; dòng **Soát nhãn** *(`m2-bo-cuc.md` mục 5)*.
- Chức năng `suy`, mâu thuẫn và câu hỏi mở, module theo thứ tự dựng: khối **Trình ở cổng** của chính lần `check` đó *(không cần đọc `MAP.md`)*.
- 3–5 **chỗ đặt đáng bàn**: cảnh báo đang giữ và lý do, việc hằng ngày xa nhất, màn dày nhất.

**Hỏi một lượt:**
1. **Bản đồ:** Duyệt *(Khuyến nghị)* · Sửa nhóm hay điều hướng · Đổi chỗ, đổi tầng vài chức năng · Thiếu hay thừa chức năng.
2. **Chức năng suy ra** *(chỉ khi có)*: Giữ cả · Bỏ cả · Chọn từng cái.
3. **Đợt đầu dựng gì:** gói module theo thứ tự `depends` *(bảng Module của `MAP.md`)*: gói có các Must của giai đoạn đầu *(Khuyến nghị)* · toàn bộ phạm vi · một module thử 2–3 màn. Ghi tên module trong từng lựa chọn.
4. **Mâu thuẫn** *(chỉ khi có)*: chọn cách hiểu. Quá 4 câu thì hỏi hai lượt, câu mâu thuẫn trước.

**Ghi** khối *Cổng Bản đồ* vào `DECISIONS.md` **ngay lượt hỏi**, trước khối Cổng 3 hay cuối file; lượt sau điền đáp án nguyên văn và kết quả bấm thử người dùng dán:

```markdown
## 🛑 Cổng Bản đồ — <dd/mm/yyyy> *(sketch-to-map)*
**Lúc trình:** <dòng Kiểm kê> · <dòng Chỉ số bố cục> · <dòng Soát nhãn>
**Câu hỏi và lựa chọn:** 1. Bản đồ: … · 2. Chức năng suy ra: … · 3. Đợt đầu: … · 4. Mâu thuẫn: …
**Đáp án bản đồ (nguyên văn):** · **Chức năng suy ra:** · **Đợt đầu:** · module đợt 1: <…> · **Mâu thuẫn:**
**Bấm thử** *(kết quả người dùng dán; việc Khó và chỗ đã sửa)*:
```

- Việc người dùng chấm **Khó**: sửa chỗ đặt hay nhãn của việc đó, chạy lại lệnh kiểm, trình lại trước khi coi là duyệt.
- Duyệt: điền `dot` cho từng module theo câu 3 *(1 là đợt đầu)*, chạy `check` một lần nữa để `MAP.md` ghi đợt. Câu *Phạm vi* ở Cổng 3 của `sketch-to-site` coi như đã có đáp án.

---

## 4. Thư mục đầu ra

Trong thư mục prototype *(mặc định `docs/prototypes/<slug>/`)*:

```
map/
├── _src/D1.txt…          # mỗi tài liệu thành chữ, số dòng cố định (M0); features.js trỏ D2:120-140
├── sources.json · ids.json · states.json   # mục lục, hệ mã, trạng thái của schema (M0)
├── parts/                # phần kiểm kê của worker, _chung.js skip mục chung (chỉ khi chia worker)
├── features.js           # kiểm kê, mỗi chức năng một dòng (M1)
├── layout.js             # bố cục (M2)
├── MAP.md · index.html · check.json   # sinh bởi map.mjs check: không sửa tay
├── treetest.md           # bài soát nhãn
└── _shots/               # trang chủ mỗi vai trên khung bấm thử
```

---

## 5. Bàn giao

- Link Markdown tới `map/index.html` và `map/MAP.md`. Ba dòng: kiểm kê · chỉ số bố cục · đợt đầu.
- Bước kế là `sketch-to-site`, trong **phiên mới**: `map/`, `CONCEPT.md`, `DECISIONS.md` là đủ để làm tiếp, còn phiên này mang cả tài liệu yêu cầu trong ngữ cảnh. Ở đó B1 đọc `MAP.md` thay vì đọc lại cả tài liệu, B3 dựng từng màn theo `map.mjs slice`, B4 kiểm độ phủ và bố cục trên trang đã dựng.
- Đợt sau: `evolve-site` Cấp 3 dựng module hoãn; chỗ đặt đã có trong bản đồ.
- Người dùng muốn **chia sẻ** khung bấm thử cho người khác thì đề xuất đăng `map/` thành Artifact.

---

## 6. Cớ hay gặp khi bố cục, và sự thật

Rút từ lỗi đo được trên prototype thật đã qua nghiệm thu, và trên lần chạy không có skill này.

| Cớ | Sự thật |
|---|---|
| "Đặt nút sang trang kia cho nhanh, trang đó có form rồi" | Lối tắt mở chức năng **trên màn đang đứng**. Prototype đo được có 17 lối tắt kiểu này, không cái nào có đường về |
| "Gom hết vào hồ sơ cho đủ, tìm một chỗ là thấy" | Hồ sơ gánh 10 use case thành 21 nút chính, 7 tab. Ngưỡng 6 chức năng, 5 tab mỗi màn |
| "Thêm nhóm *Giai đoạn 2* cho dễ thấy phạm vi" | Menu nhóm theo việc. Phạm vi là nhãn trên mục, không phải nhóm: `check` chặn |
| "Các vai dùng chung một menu cho gọn" | Mỗi vai một trang chủ theo việc của vai. 8 vai chung một menu thì không vai nào thấy việc của mình trước |
| "Việc đó có trong tab của hồ sơ khách rồi" | Việc hằng ngày cần lối vào từ trang chủ trong ≤ 3 bước. Tìm khách, mở hồ sơ, mở tab là 4 bước cộng một lần tìm |
| "Xong việc thì chuyển sang trang kết quả cho tiện" | Ở lại, báo kết quả kèm liên kết mở tiếp. Tự chuyển trang làm mất chỗ đang làm |
| "Ghi mã UC lên nút cho dễ đối chiếu tài liệu" | Mã nằm ở `src` và `data-feature`, không trên chữ giao diện: `check` và B4 chặn |
| "Tài liệu dài, đọc lướt các mục chính cho nhanh" | Dưới 300 KB thì đọc nguyên trong một lượt *(mốc đo: sót 1/43)*. Vượt thì chia worker theo module, không đọc lướt |
| "Soát nhãn 100 %, review UX 57,8/60, bố cục ổn rồi" | Cả hai chạm trần trên prototype có 17 lối tắt đá đi. Thước đo là chỉ số luồng của `check` và người dùng bấm thử |
