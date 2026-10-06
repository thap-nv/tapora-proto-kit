# M2 · Bố cục, kiểm bố cục, soát nhãn · sketch-to-map

> **Lượt vào M2** *(cuối M1, một lượt)*: `Read` file này · Bash `map.mjs check <thư-mục-prototype> --brief`. Bản in `--brief` là đầu vào: không đọc lại `features.js`, không đọc mã của `map.mjs`.
> **Lượt của M2:** `Write` `map/layout.js` *(file mới, theo mục 3; không chép khuôn)* và lệnh kiểm *(mục 4)* **cùng một lượt** → sửa **mọi** mục chặn bằng các `Edit` và chạy lại lệnh kiểm, cùng một lượt → soát nhãn và mở một ảnh **cùng lượt** *(mục 5, 6)* → Cổng Bản đồ *(SKILL.md)*: khối `DECISIONS.md` và mọi thứ cần trình đã có trong SKILL.md và khối **Trình ở cổng** của lệnh kiểm.

---

## 1. Đọc bản in `--brief`

`Vai: le-tan 9 · bac-si 5 · …` *(số chức năng mỗi vai)*, rồi mỗi module một khối `== <module> (n)`, mỗi chức năng một dòng: `F-07 ngày · le-tan,quan-ly · Tìm bệnh nhân · suy · hoãn`. Đủ để đặt chỗ: tần suất cho tầng, vai cho màn và menu, hoãn cho trang chờ. Cần `spec` của một chức năng thì `grep "F-07" map/features.js`, không đọc cả file.

## 2. Luật bố cục

Mỗi luật ghi căn cứ trong ngoặc. Lý do đo được: một prototype thật 28 trang qua đủ Cổng 4, có **17 lối tắt đá người dùng sang trang khác mà không có đường về**, hồ sơ học viên gánh 10 use case với 21 nút chính, việc hằng ngày *Bán khoá* không có lối vào, menu có nhóm *"Giai đoạn 2"*, 8 vai chung một menu. Review theo từng trang chấm nó 57,8/60: lỗi bố cục chỉ thấy ở mức luồng.

### 2.1 Nhóm theo đối tượng và việc *(Mental Model · Jakob)*
- Module là **đối tượng** người dùng làm việc với *(học viên, lớp, lịch, gói)*, không theo chương tài liệu, **không theo đợt phát hành**. Chức năng hoãn nằm trong module và nhóm menu của việc đó; khung bấm thử và prototype gắn nhãn *giai đoạn sau*.
- Có `schema.dbml`: lấy nhóm miền làm gợi ý; **bảng trục** *(đối tượng nhiều quan hệ nhất)* là mục menu cấp 1; cấu hình, danh mục, nhật ký vào Cài đặt *(rút từ `requirements-to-erd` §4.2 của một dự án thật)*.
- `depends` một chiều *(module dùng dữ liệu của module nào)*: thứ tự dựng theo đó. `dot` để trống tới Cổng Bản đồ.

### 2.2 Vai và trang chủ theo việc *(Serial Position · Pareto · `data-dashboard` §2)*
- Một vai dùng một bề mặt; người dùng cả web và app thì khai hai vai.
- **Mỗi vai có trang chủ theo việc của mình:** 3–5 việc chính và mục cần xử lý hôm nay, xếp theo **dải** *(`bands`)*, không lưới thẻ bằng nhau; tối đa 6 khối. Vai cùng việc dùng chung menu được, nhưng vai khác việc thì khác trang chủ.
- Mục trên dải phải **đặt trên chính trang chủ** *(`place`)* hay có **lối tắt** từ đó: bấm mục trên dải mà bị đá sang màn khác là lỗi chỉ số 1.

### 2.3 Tầng hiển thị *(Hick · Choice Overload · Tesler · Pareto)*

| Tầng | Là gì | Ngưỡng | Thường cho |
|---|---|---|---|
| T1 chính | Hành động chính của màn | 1 mỗi màn · ≤ 3 bước từ trang chủ của vai *(chặn)* | Việc `ngay` cốt lõi |
| T2 phụ | Nút, vùng nhìn thấy ngay | ≤ 5 mỗi màn | Việc `ngay`, `tuan` |
| T3 hiếm | Menu `…`, Cài đặt | Web bật `ctrlK` *(T3 luôn tìm được bằng Ctrl+K)* | Việc `hiem`, cấu hình |
| T4 ngữ cảnh | Trên dòng, thao tác hàng loạt, nút theo trạng thái | — | Việc trên một bản ghi |

Màn quá **6 chức năng** hay **5 tab**: tách màn, đẩy xuống T3–T4, hay đưa việc vào ngăn trượt. Không gom mọi việc của một đối tượng vào hồ sơ của nó *(prototype đã đo: hồ sơ 10 use case, 7 tab)*.

### 2.4 Kiểu điều hướng *(Miller · Chunking · Jakob)*
- Web: tới 5 mục cấp 1 là thanh trên · 6–9 sidebar phẳng · từ 10 thì sidebar **3–6 nhóm có tên**, ≤ 7 mục mỗi nhóm, kèm tìm chung và Ctrl+K.
- App: 3–5 tab; việc phụ vào tab Tài khoản.
- Sâu từ 3 cấp thì có breadcrumb. Mỗi màn có link riêng; màn chọn một bản ghi *(`pick: true`)* nhận `?id=`.

### 2.5 Chỗ đặt và lối tắt: mở tại chỗ *(luật của người dùng · Nielsen #3 user control)*

`mo` của mỗi chỗ đặt, theo `<skills>/evolve-site/references/integration-patterns.md`:

| `mo` | Khi |
|---|---|
| `tai-cho` | Bật tắt, sửa 1–2 trường, xem ngay trên màn |
| `hop-thoai` | Form ngắn dưới 5 trường, xác nhận việc không đảo ngược |
| `ngan-truot` | Form 4–10 trường, xem chi tiết, cần nhìn dữ liệu của màn nền |
| `sheet` | Như hai dòng trên, nhưng trên app |
| `trang` | Chức năng là nội dung chính của chính màn đó, hay luồng dài nhiều bước |

- **Lối tắt** là nút ở màn A mở chức năng B đặt ở màn khác. **Mở B trên A**: hộp thoại khi B ngắn, ngăn trượt khi B vừa và cần nhìn dữ liệu của A, sheet trên app. Xong hay huỷ thì **về đúng chỗ ở A**, và A tự cập nhật.
- Chỉ mở **trang** khi B dài nhiều bước. Khi đó bắt buộc khai `ve`: *Quay lại* giữ trạng thái của A, xong thì tự về A kèm thông báo.
- Xong việc thì **ở lại**, báo kết quả kèm liên kết mở tiếp; không tự chuyển trang *(prototype đã đo: chuyển khách tiềm năng xong thì nhảy sang hồ sơ)*.

### 2.6 Một việc một nhãn, dễ nhận ra *(Jakob · Nielsen #4, #6 · WCAG 3.2.4 · Working Memory)*
- Một việc **một nhãn** trên mọi màn, cùng hành động nằm cùng chỗ *(prototype đã đo: Đổi buổi · Dời buổi)*. Khai `label` của lối tắt chỉ khi buộc phải khác tên chức năng.
- **Không mã tham chiếu** *(UC-, BR-, F-…)* trên chữ giao diện *(chặn)*. Nhãn dùng từ của người dùng.
- Không bắt nhớ mã từ màn này sang màn khác; mặc định và tự điền thay cho thêm ô nhập; gợi ý ngay tại chỗ *(Paradox of the Active User)*.

### 2.7 Chống nhồi, để nội dung nổi *(Cognitive Load · Aesthetic-Usability · Prägnanz · Goal-Gradient)*
Luật cho B3 của `sketch-to-site`; ghi vào `zones` hay `spec` khi nó đổi chỗ đặt: hiện dần *(tóm tắt → ngăn chi tiết → trang đầy đủ)* · form trên 10 trường thì chia nhóm hay bước, từ 3 bước có chỉ báo bước · bảng trên 7 cột thì chọn cột hiện · **viền mảnh, ít khung lồng** *(phản hồi sau prototype đã đo: người xem nhìn đường nét hơn nội dung)*.

### 2.8 Hành trình và việc bấm thử
- `flows`: 1–3 hành trình mỗi vai, các chức năng theo thứ tự làm. Bước mà vai không tới được: chặn.
- `tasks`: **5–10 việc hằng ngày**, ưu tiên `ngay`, mỗi vai chính ít nhất một việc. Nói bằng **tình huống của người dùng**, không dùng nhãn trên màn *(viết "Bệnh nhân gọi xin dời hẹn sang tuần sau", không viết "Dời lịch hẹn")*: chép nhãn vào câu việc thì soát nhãn và bấm thử không còn đo gì.

## 3. Định dạng `map/layout.js`

Khuôn có chú thích: `<skills>/sketch-to-map/templates/layout.js`; ví dụ đủ, sạch với `check`: `layout.example.js`. Mã *(id)* viết chữ thường, số, gạch ngang. Rút gọn từ ví dụ *(lược các màn `lich`, `thu-tien`, `bao-cao`… mà menu và chỗ đặt nhắc tới)*:

```js
window.LAYOUT = {
  surfaces: [{ id: 'web', name: 'Web phòng khám', kind: 'web', dir: 'admin', ctrlK: true }, { id: 'app', name: 'App bệnh nhân', kind: 'app', dir: 'app' }],
  roles: [{ id: 'le-tan', name: 'Lễ tân', surface: 'web', home: 'hom-nay' }],
  modules: [{ id: 'benh-nhan', name: 'Bệnh nhân', depends: [] }, { id: 'lich-hen', name: 'Lịch hẹn', depends: ['benh-nhan'] }],
  screens: [
    { id: 'hom-nay', name: 'Hôm nay', surface: 'web', module: 'lich-hen', roles: ['le-tan'],
      bands: [{ name: 'Bệnh nhân sắp tới', items: ['F-05'] }, { name: 'Việc nhanh', items: ['F-01', 'F-12'] }] },
    { id: 'benh-nhan', name: 'Bệnh nhân', surface: 'web', module: 'benh-nhan', roles: ['le-tan'], zones: ['Tìm và lọc', 'Bảng bệnh nhân'] },
    { id: 'ho-so', name: 'Hồ sơ bệnh nhân', surface: 'web', module: 'benh-nhan', roles: ['le-tan'], parent: 'benh-nhan', pick: true,
      zones: ['Đầu hồ sơ'], tabs: ['Lịch sử khám', 'Thanh toán'] },
  ],
  nav: [{ roles: ['le-tan'], groups: [{ name: '', items: ['hom-nay', 'lich', 'benh-nhan', 'thu-tien'] }] }],
  place: {
    'F-01': { screen: 'lich', zone: 'Thanh công cụ', tier: 1, mo: 'hop-thoai' },
    'F-05': { screen: 'hom-nay', zone: 'Bệnh nhân sắp tới', tier: 1, mo: 'tai-cho' },
    'F-15': [{ screen: 'bao-cao', tier: 2, mo: 'trang' }, { screen: 'tong-quan', zone: 'Doanh thu hôm nay', tier: 2, mo: 'tai-cho' }],
  },
  shortcuts: [
    { from: 'hom-nay', to: 'F-01', mo: 'hop-thoai' },
    { from: 'ca-kham', to: 'F-09', mo: 'trang', ve: 'Lưu phiếu xong thì về Ca khám hôm nay, báo đã lưu; có nút Quay lại' },
  ],
  flows: [{ role: 'le-tan', name: 'Khách mới tới khám lần đầu', steps: ['F-06', 'F-01', 'F-05', 'F-12'] }],
  tasks: [{ role: 'le-tan', say: 'Một bệnh nhân gọi xin hẹn khám răng chiều thứ Sáu.', feature: 'F-01' }],
};
```

| Khoá | Trường |
|---|---|
| `surfaces` | `id` · `name` · `kind` *(`web` · `app`)* · `dir` *(thư mục trang khi dựng: `site/<dir>/<màn>.html`)* · `ctrlK` |
| `roles` | `id` *(khớp `roles` trong `features.js`)* · `name` · `surface` · `home` *(màn trang chủ)* |
| `modules` | `id` *(khớp `module` trong `features.js`)* · `name` · `depends` · `dot` *(điền sau cổng)* |
| `screens` | `id` · `name` · `surface` · `module` · `roles` · tuỳ: `zones`, `tabs` *(tab đầu mở sẵn)*, `bands` *(chỉ ở trang chủ)*, `parent` *(bấm một dòng ở màn đó thì sang màn này)*, `pick: true` *(tới màn phải tìm và chọn một bản ghi)*, `entry: true` *(màn vào trước trang chủ, như đăng nhập)*, `file` *(chỉ khi khác `<dir>/<id>.html`)* |
| `nav` | Mỗi menu: `roles`, `groups: [{ name, items: [mã màn] }]`. Mỗi vai đúng một menu; `name: ''` cho nhóm không tên |
| `place` | Mỗi chức năng có vai một dòng: `screen` · `zone` hay `tab` · `tier` 1–4 · `mo`. Có ở hai bề mặt thì một mảng hai chỗ. Chức năng hệ thống tự làm *(`roles: []`)* không cần chỗ |
| `shortcuts` | `from` *(màn)* · `to` *(mã chức năng)* · `mo` *(`hop-thoai` · `ngan-truot` · `sheet` · `trang`)* · `ve` *(bắt buộc khi `trang`)* · `label` *(tuỳ)* |
| `flows` · `tasks` | Mục 2.8 |

## 4. Kiểm: một lệnh

```bash
node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype> --shots; node <skills>/sketch-to-map/scripts/map.mjs visible <thư-mục-prototype> --treetest
```

Phần `check` in: dòng **Kiểm kê**, **Nguồn**, **Bố cục** *(bề mặt, màn, lối tắt, hành trình, việc)* · `CHẶN` · `CẢNH BÁO` *(mỗi danh sách tối đa 15 dòng; đủ ở `map/check.json`)* · dòng **Chỉ số bố cục** · ảnh *(mục 6)*. Sinh `map/MAP.md` và khung bấm thử `map/index.html` mỗi lần chạy: không sửa tay hai file đó. Thoát `0` sạch · `1` còn mục chặn *(chưa chụp ảnh)* · `2` dữ liệu không đọc được · `4` không có Edge hay Chrome. Phần `visible --treetest`: mục 5.

| Nhãn | Mức | Nghĩa · cách sửa |
|---|---|---|
| `[dữ liệu]` | chặn | Sai định dạng mục 3, mã không khớp, chức năng có vai mà chưa có `place`. Chưa sạch mục này thì chưa tính chỉ số |
| `[1]` | chặn | Lối tắt `mo: 'trang'` không có `ve` · mục trên dải trang chủ không đặt trên trang chủ, không có lối tắt. Mở trên màn đó, hay khai `ve` *(2.5)* |
| `[12]` | chặn | Vai chưa có trang chủ, trang chủ chưa có dải · nhóm menu đặt theo đợt phát hành *(GĐ2, Phase 2, Sắp ra mắt…)* *(2.1, 2.2)* |
| `[7]` | chặn | Mã tham chiếu trong tên chức năng, màn, vùng, tab, dải, nhóm, nhãn lối tắt |
| `[2]` | chặn · cảnh báo | T1 quá 3 bước hay không tới được: chặn. Việc `ngay` khác quá 3 bước: cảnh báo. Dòng ghi đường đi và giây ước tính |
| `[tới]` | chặn · cảnh báo | Chức năng trong phạm vi mà vai của nó không tới được: chặn. Chức năng hoãn, màn không vai nào tới được: cảnh báo |
| `[hành trình]` · `[việc]` | chặn · cảnh báo | Bước hay việc mà vai không tới được: chặn. Vai chưa có hành trình, số việc ngoài 5–10: cảnh báo |
| `[3]` · `[4]` · `[5]` | cảnh báo | Hơn 1 T1 một màn · hơn 5 T2, nhóm menu hơn 7 mục, app hơn 5 tab, từ 10 mục mà chưa 3 nhóm có tên · màn hơn 6 chức năng hay 5 tab |
| `[6]` | cảnh báo | Một việc nhiều nhãn · một nhãn cho hai việc |
| `[Ctrl+K]` · `[kiểu mở]` | cảnh báo | Web có T3 mà chưa bật `ctrlK` · `hop-thoai`, `ngan-truot` trên app, `sheet` trên web |
| `[khung]` | cảnh báo | Khung bấm thử lỗi khi chụp: lỗi của khuôn kit, báo lại, không sửa `map/index.html` |

**Số bước** tính từ trang chủ của vai: bấm menu, bấm một dòng sang màn con, bấm lối tắt, bấm mở chức năng đều là một bước; T3 và T4 thêm một bước; tab không phải tab đầu thêm một bước. Giây ước theo KLM *(Card, Moran, Newell)*: 2,7 giây mỗi bước, cộng 3 giây cho mỗi lần tìm và chọn một bản ghi.

**Dòng chỉ số bố cục** *(trình ở cổng nguyên văn)*: `(1)` lối tắt đá đi · `(12)` vai thiếu trang chủ, nhóm menu theo đợt · `(7)` mã lộ · `(2)` T1 xa nhất, việc hằng ngày xa nhất · `(5)` màn dày nhất · `(4)` nhóm menu dài nhất · `(6)` việc nhiều nhãn. Chỉ số 3, 4, 8 *(viền dày, khung lồng)*, 9, 11 đo lại trên trang đã dựng ở B4 của `sketch-to-site`; chỉ số 1, 6, 7 cũng quét lại trên mã trang *(`qa-gate.md` P22–P26)*.

Sửa mọi mục chặn trong **một** lượt rồi chạy lại. Cảnh báo: sửa, hay giữ và nêu lý do ở cổng *(mục "chỗ đặt đáng bàn")*.

## 5. Soát nhãn *(không chặn)*

`visible --treetest` ghi `map/treetest.md` *(hướng dẫn người thử, cây chỉ có nhãn, các việc; không có đáp án)* và in đáp án mỗi việc một dòng: `T1 · le-tan → Đặt lịch hẹn`.

Có công cụ tạo subagent: một người thử loại chỉ đọc *(`subagent_type: "Explore"`)*, gọi rồi **chờ kết quả**, cùng lượt với lệnh mở ảnh ở mục 6. Prompt:

```text
Đọc <thư-mục-prototype>/map/treetest.md và làm đúng như file đó viết. Không đọc file nào khác. Trả về đúng các dòng mà file yêu cầu.
```

Đối chiếu nút dừng của mỗi dòng với đáp án. Việc **dừng sai nút**, **quay lại** từ 1 lần, **bỏ cuộc** hay *chắc thấp*: xem lại nhãn của nhánh người thử đi lạc, hay chỗ đặt của việc đó. Sửa thì chạy lại lệnh kiểm mục 4, không thử lại. Ghi một dòng cho cổng: `Soát nhãn: x/y việc tới đúng nút · n lần quay lại · nhãn đã sửa: …`.

Không có ngưỡng chặn: người thử là mô hình, đọc được cả cây một lúc, nên số đo chạm trần *(mốc cũ trên đề đo: tới đúng 100 %, đi thẳng 87 %; prototype thật: 100 %, 93 %)*. Bước này chỉ bắt nhãn mơ hồ. Không có công cụ tạo subagent thì bỏ, ghi *không soát nhãn*.

## 6. Ảnh và khung bấm thử

`check --shots` chạy khi không còn mục chặn: in khối **Trình ở cổng** *(chức năng suy, ghi chú có mâu thuẫn và câu hỏi mở, module theo thứ tự dựng kèm số Must)*, rồi chụp trang chủ của mỗi vai trên khung bấm thử ở 1440 *(vai trên app thêm 390)* vào `map/_shots/`, rồi in dòng `Mở một ảnh: <đường dẫn>` *(vai có nhiều việc hằng ngày nhất)*. Chỉ mở **ảnh đó**, cùng lượt với người thử ở mục 5; ảnh còn lại để trình ở cổng. Soát: menu và dải trang chủ đọc được, nhãn không bị cắt. Dòng `Khung bấm thử: …` là lỗi của khuôn, báo lại cho kit.

Khung `map/index.html` là khung xám, không dùng token của concept: chuyển vai, menu thật, trang chủ của vai, vùng và tab của màn, menu `…`, Ctrl+K, lối tắt mở đúng kiểu đã khai, trang chờ cho màn hoãn, mục lục chức năng, và danh sách **Bấm thử việc hằng ngày** *(người dùng chấm Dễ · Được · Khó, rồi Chép kết quả dán vào cuộc trò chuyện)*. Sạch thì sang Cổng Bản đồ.
