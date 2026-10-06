# M0–M1 · Nguồn và kiểm kê chức năng · sketch-to-map

> **Lượt vào M1** *(một lượt, các lệnh gọi cùng lúc)*: `Read` file này, `CONCEPT.md`, `DECISIONS.md` · Bash lệnh M0 ở mục 1 *(cũng ghi ở bảng lối vào của SKILL.md)*.
> **Lượt của M1:** `Read` mọi bản chữ trong một lượt *(mục 2)* → `Write` `map/features.js` và Bash `check` **cùng một lượt** *(mục 8)* → sửa mọi mục chặn và chạy lại cùng một lượt → sang M2.
> Không đọc mã của `sources.py` hay `map.mjs`: cách gọi, kết quả, mã thoát ghi đủ ở đây. Không tự viết script dò tài liệu, không dò bằng `node -e`.

---

## 1. M0 · Nguồn

```bash
python <skills>/sketch-to-map/scripts/sources.py <thư-mục-tài-liệu> <thư-mục-prototype>
```

Ghi vào `<thư-mục-prototype>/map/`: `_src/D1.txt…` *(mỗi tài liệu thành chữ, số dòng cố định; `.docx`, `.xlsx`, `.html`, `.pdf` cũng vậy)*, `sources.json` *(mục lục từng tài liệu: tiêu đề, cấp, dòng đầu–cuối)*, `ids.json` *(hệ mã tự dò, chỗ định nghĩa, mức Must…, mục bị loại)*, `states.json` *(Enum và bước chuyển của `schema.dbml`)*.

In: mỗi tài liệu một dòng · bộ BA nhận ra được · hệ mã · mã của dữ liệu *(mã học viên trong phụ lục: không phải hệ mã)* · mục **Quy ước** *(đọc trước)* · trạng thái và bước chuyển · mục dài nhất · **Cách đọc** · file cần chuyển tay. Thoát `1` khi có file đọc không được *(dòng `CẦN CHUYỂN TAY`: nhờ người dùng lưu thành `.md` hay `.txt` cạnh file gốc, rồi chạy lại)*.

Trỏ nguồn trong `features.js` bằng **mã** *(`UC-04`, `BR-LH-02`)* hay **dải dòng** của bản chữ *(`D2:120-140`)*, không chép đoạn tài liệu.

Đọc nguyên: bản in của lệnh là đủ, không đọc `sources.json`, `ids.json`, `states.json`. Chia worker: chỉ đọc mục lục trong `sources.json` *(mục 6)*. Mục tài liệu nào chưa có chức năng trỏ tới thì lần `check` đầu liệt kê, kèm dải dòng để ghi `skip`.

## 2. Cách đọc theo cỡ

- **`Cách đọc: đọc nguyên trong một lượt`** *(≤ 300 KB)*: `Read` mọi file `map/_src/D*.txt` mà dòng đó liệt kê, **trong một lượt**. Đo mốc cũ *(48 KB, đọc nguyên)*: sót 1/43 chức năng; đọc lướt hay đọc từng mục không bớt sót mà thêm lượt.
- **`Cách đọc: chia worker`** *(> 300 KB)*: mục 6.

## 3. Thế nào là một chức năng

Một **việc người dùng làm**: động từ + đối tượng, theo lời của người dùng *(Bán gói, Dời buổi học, Xuất báo cáo doanh thu)*. Tên là nhãn trên màn: không chứa mã.

Kể cả việc **chỉ được ngụ ý**. Soát từng chỗ dưới, vì sót nằm ở đây chứ không ở use case:

| Chỗ hay giấu việc | Thành chức năng khi |
|---|---|
| Quy tắc nghiệp vụ | Quy tắc cần một thao tác mà không use case nào có bước đó *(một phụ huynh nhiều con → chọn con đang xem)* |
| Ma trận quyền | Ô quyền cho một vai làm việc không có trong use case *(xuất Excel chỉ Quản lý)* |
| Ca biên, luồng lỗi | Ca biên cần người làm gì đó *(dạy thay, sửa sau khi đã lưu)* |
| Việc tự động | Có cấu hình *(nhắc lịch trước bao lâu)*: việc cấu hình là chức năng; việc chạy tự động ghi `roles: []` |
| Báo cáo, xuất file, nhật ký | Có người xem hay tải |
| Thao tác hàng loạt | Làm nhiều đối tượng một lần *(huỷ mọi buổi khi bể sự cố)* |
| Biến thể theo vai | Cùng việc mà vai khác phạm vi khác: **một** chức năng, ghi các vai và phạm vi trong `spec` |
| Phụ lục, tổng quan | Việc nhắc ở tổng quan mà đặc tả nằm ở tài liệu khác: một chức năng, `src` trỏ cả hai |
| Quyết định (`XD-`) | Quyết định đè đoạn cũ: theo quyết định, `spec` ghi *"theo XD-02"* |
| `schema.dbml` | Bước chuyển trạng thái ghi trong note: mục 5 |

**Không** là chức năng: một trường, một màn, một quy tắc chỉ ràng buộc việc đã có *(ghi vào `spec`)*. Một việc mang hai tên ở hai tài liệu thì là **một** chức năng; `check` cảnh báo khi hai tên có động từ đồng nghĩa và cùng đối tượng.

## 4. Hai nhánh

**Có bộ BA** *(`sources.py` in dòng `Bộ BA:`)*:
- Xương sống là danh sách UC. UC bị loại *(⛔, Won't)* không cần chức năng.
- Quy tắc qua **4 câu sàng lọc** *(rút từ `requirements-to-flow` §1.3–1.4 của một dự án thật)*: quy tắc có **đổi vai** · **sinh trạng thái mới** · **đổi dòng tiền** · **cần màn hay popup riêng** không? Trúng một câu thì thành chức năng, trạng thái hay popup; không trúng thì gộp vào `spec` của chức năng nó ràng buộc.
- Ca biên lọc 3 tầng: luồng chính · ngoại lệ nghiệp vụ *(vẽ khi trúng 4 câu)* · ca vi mô *(chỉ ghi `notes`)*.
- Phạm vi lấy từ file ưu tiên, **không xếp lại**: ngoài giai đoạn đầu thì `status: 'hoan'` *(vẫn có trong bản đồ)*; Won't không thành chức năng.
- Hai đoạn mâu thuẫn mà không có quyết định nào đè: không tự chọn. Ghi vào `notes` của chức năng *(`"mâu thuẫn: D3:40 với D5:12"`)*; câu hỏi ở Cổng Bản đồ.

**Tài liệu thô** *(dòng `Tài liệu thô`)*: với mỗi đối tượng chính, soát danh mục chỗ hay thiếu *(rút từ `requirements-gap-auditor`)*: tạo · sửa · xoá hay lưu trữ · danh sách, tìm, lọc · xem chi tiết · từng bước chuyển trạng thái · ai được làm gì · thông báo · báo cáo, xuất · thao tác hàng loạt · cấu hình. Chỗ thiếu thành chức năng `evidence: 'suy'` *(người dùng xác nhận ở cổng)*, hay câu hỏi.

## 5. Soát riêng: bước chuyển và ngoại lệ chồng ngoại lệ

Hai chỗ duy nhất đo được là sót *(mốc cũ r7-map sót đúng một bước chuyển chỉ có trong schema; một prototype thật sót 3 nhánh ngoại lệ chồng ngoại lệ)*:
- Mỗi **bước chuyển** trong `states.json` *(dòng `Trạng thái: … bước chuyển`)* phải có chức năng đưa đối tượng tới trạng thái đích: ghi `states: ['<enum>.<trạng thái đích>']` vào chức năng đó. Chưa có chức năng nào làm bước đó thì **thêm** chức năng.
- Mỗi **nhóm trạng thái** có bảng dùng *(enum tên `trang_thai…`, `status`)* phải có chức năng hiện nó *(danh sách lọc theo trạng thái, nhãn trạng thái)*: `states: ['<enum>']`.
- Mỗi **nhánh rẽ của nhánh rẽ** *(3b của 3a, ngoại lệ có cờ riêng)* phải thành chức năng, trạng thái, hay `notes` của chức năng cha. Không bỏ im.

## 6. Vượt ngưỡng: chia worker theo module

1. Từ mục lục *(`map/sources.json`, `docs[].toc`)* và hệ mã, chia **module theo đối tượng** *(học viên, lớp, lịch, gói…)*, không theo chương tài liệu. Mỗi module một danh sách dải dòng cần đọc *(mục của UC, quy tắc, ca biên thuộc đối tượng đó)*.
2. Mỗi module một worker *(Agent `general-purpose`)*, **tối đa 4 cùng lúc**, gọi rồi chờ kết quả. Prompt:

```text
Kiểm kê chức năng cho module <mã-module> (<tên>) của dự án <tên dự án>.
Đọc đúng các dải dòng này, không đọc file khác: <map/_src/D2.txt dòng 120-260>, <map/_src/D4.txt dòng 30-80>, …
Đọc luật ở <skills>/sketch-to-map/references/m1-kiem-ke.md mục 3, 4, 5, 7 (chỉ các mục đó).
Ghi <thư-mục-prototype>/map/parts/<mã-module>.js đúng định dạng mục 7 (PART, không đánh mã F-).
Trả về đúng một dòng: "<mã-module>: n chức năng, k suy, h hoãn, m câu hỏi".
```

3. Gộp và kiểm trong **một** lệnh: `node <skills>/sketch-to-map/scripts/map.mjs merge <thư-mục-prototype> && node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype>` *(`merge` đánh mã `F-01…` theo thứ tự file, ghi `map/features.js` mỗi chức năng một dòng; đã có `layout.js` thì không gộp, thoát 2)*. Mục chặn sửa thẳng trong `features.js`, không gọi lại worker. Mục tài liệu không sinh việc *(phụ lục dữ liệu, giới thiệu)* ghi `skip`.

## 7. Định dạng

`map/features.js` *(khuôn có chú thích: `<skills>/sketch-to-map/templates/features.js`; ví dụ đủ: `features.example.js`)*. Mỗi chức năng **một dòng**, `spec` khoảng 200 ký tự; chi tiết thì trỏ nguồn:

```js
window.FEATURES = {
  project: 'Tên dự án',
  features: [
    { id: 'F-01', name: 'Đặt lịch hẹn', module: 'lich-hen', src: ['UC-01', 'BR-LH-02'], roles: ['le-tan'], freq: 'ngay', evidence: 'ro', status: 'pham-vi', spec: 'Chọn bệnh nhân, dịch vụ, ghế, giờ; ghế đã có hẹn thì không chọn được.' },
    { id: 'F-05', name: 'Tiếp nhận bệnh nhân đến khám', module: 'lich-hen', src: ['UC-04'], roles: ['le-tan'], freq: 'ngay', evidence: 'ro', status: 'pham-vi', states: ['trang_thai_hen.da_toi'], spec: '…' },
    { id: 'F-14', name: 'Ghi nợ cho bệnh nhân quen', module: 'thu-tien', src: ['D3:88-95'], roles: ['le-tan'], freq: 'tuan', evidence: 'suy', status: 'pham-vi', spec: '…', notes: 'mâu thuẫn: D3:90 với D5:12; câu hỏi mở OQ-02' },
    { id: 'F-21', name: 'Đặt lịch qua app', module: 'lich-hen', src: ['UC-09', 'S-02'], roles: ['benh-nhan'], freq: 'tuan', evidence: 'ro', status: 'hoan', spec: '…' },
  ],
  skip: [
    { src: 'D1:2-5', why: 'Giới thiệu chung, không có việc' },
  ],
};
```

| Trường | Giá trị |
|---|---|
| `id` | `F-01`… *(worker không ghi: `merge` đánh)* |
| `name` | Việc theo lời người dùng, không mã tham chiếu |
| `module` | Mã module *(chữ thường, gạch ngang)* |
| `src` | Mã gốc hay dải dòng `D2:120-140`; Must thì ghi cả mã Must *(`M-02`)* |
| `roles` | Mã vai làm việc này *(chữ thường, gạch ngang; dùng lại ở `layout.js`)*; `[]` khi hệ thống tự làm |
| `freq` | `ngay` · `tuan` · `hiem` |
| `evidence` | `ro` *(tài liệu nói rõ)* · `suy` *(suy ra; hỏi ở cổng)* |
| `status` | `pham-vi` · `hoan` *(ngoài đợt này: vẫn có chỗ trong bản đồ, có trang chờ)* |
| `states` | Tuỳ: `'<enum>'` *(hiện trạng thái)*, `'<enum>.<giá trị>'` *(đưa tới trạng thái đó)* |
| `notes` | Tuỳ: ca vi mô, mâu thuẫn chờ hỏi |
| `skip` | Mục tài liệu cấp 2–3 không sinh việc nào, kèm lý do *(Bối cảnh, Mục tiêu, Actor, Câu hỏi mở…)* |

Phần của worker `map/parts/<module>.js`: `window.PART = { module: '<mã>', features: [ { name, src, roles, freq, evidence, status, states?, spec } ], skip: [ { src, why } ] };`

## 8. Kiểm: một lệnh

```bash
node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype>
```

In: dòng **Kiểm kê** *(số chức năng, phạm vi, hoãn, suy, module, vai)* · dòng **Nguồn** *(UC, Must, bước chuyển, nhóm trạng thái, mục tài liệu: mỗi loại kèm số thiếu)* · `CHẶN` *(tối đa 40 dòng)* · `CẢNH BÁO` *(tối đa 15 dòng; đủ ở `map/check.json`)*. Chưa có `layout.js` thì chỉ kiểm kê. Thoát `0` sạch · `1` còn mục chặn · `2` không đọc được `features.js`.

| Nhãn | Mức | Nghĩa và cách sửa |
|---|---|---|
| `[dữ liệu]` | chặn | Sai định dạng mục 7 |
| `[kiem-ke]` UC, Must | chặn | Chưa chức năng nào trỏ tới: thêm *(hoãn nếu ngoài đợt)*; không sinh việc thì ghi `skip` kèm lý do |
| `[kiem-ke]` bước chuyển, nhóm trạng thái | chặn | Mục 5 |
| `[kiem-ke]` mục `Dn:a-b` | chặn | Mục tài liệu chưa có chức năng trỏ vào trong dải của nó: thêm chức năng, trỏ `src` vào đó, hay ghi `skip` *(chốt chặn rẻ: mục bị bỏ quên thì hiện ra ở đây)* |
| `[kiem-ke]` cùng việc, nguồn lạ | cảnh báo | Gộp hay đặt tên phân biệt · sửa mã gõ sai |

`Write` `features.js` và lệnh này gọi **cùng một lượt**. Sửa mọi mục chặn bằng các `Edit` và chạy lại, cũng trong một lượt. Sạch thì sang M2: `Read <skills>/sketch-to-map/references/m2-bo-cuc.md` và chạy `map.mjs check <thư-mục-prototype> --brief` *(mỗi chức năng một dòng theo module: đầu vào của M2, không phải đọc lại `features.js`)*, cùng một lượt.
