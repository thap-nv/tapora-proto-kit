# App mobile · Hệ thống nhiều bề mặt

> Đọc ngay sau Cổng 1 *(`sketch-to-concept`)* và ở B0 của `sketch-to-site` khi loại sản phẩm là **App mobile** hoặc **Hệ thống nhiều bề mặt** có app *(ví dụ admin web + app cho khách)*.
> Luật ở đây **đè** luật bố cục web của `style-catalogue.md` và `design-taste-frontend` khi hai bên đụng nhau. Sàn không thương lượng *(SKILL.md mục 2)* vẫn đứng trên cùng.

---

## 1. Cấu trúc và khuôn dựng

```
site/
├── index.html        # nhiều bề mặt: trang lối vào, link tới từng bề mặt · chỉ có app: link tới app/
├── assets/           # tokens.css · tw.js · theme.js · data.js · store.js · app.css · app.js — mọi bề mặt dùng chung
├── admin/            # bề mặt web, nếu có (luật web như cũ)
└── app/
    ├── index.html    # trang tổng quan: các màn chính trong khung máy, đổi iOS/Android
    └── <màn>.html    # mỗi màn một file
```

- **Khuôn ở `templates/mobile/`. Chép, đừng viết lại khung:**
  - `app.css`, `app.js` và `templates/theme.js` → `site/assets/`;
  - màn gốc của tab theo `screen.html`, màn đi sâu *(chi tiết, form)* theo `detail.html`;
  - `app/index.html` theo `overview.html`, sửa danh sách `SCREENS`;
  - màn đọc `?id=` giữ thẻ `<meta name="qa-query">` của `detail.html`, đổi thành một mã có thật trong `data.js`: bộ kiểm khói mở màn đó theo mẫu này.
- **Token dùng chung:** tách khối D.2 *(`rules-and-conflicts.md`)* thành `assets/tokens.css` *(CSS variables, cả nền tối)* và `assets/tw.js` *(`tailwind.config`)*. `app.css` nạp **sau** `tokens.css`.
- **Đầu mỗi màn:** `<html lang="vi" data-surface="app" data-platform="ios">`, viewport có `viewport-fit=cover`. `app.js` nạp trong `<head>`, **không** `defer`.
  - `data-surface="app"` báo cho `preflight.py` *(P16, P17; bỏ P11)* và `qa_init.py` *(bước kiểm vùng chạm)* đây là màn app.
- **Một file chạy hai kiểu**, `app.js` tự nhận:
  - màn rộng → khung máy, tự thu nhỏ cho vừa màn;
  - điện thoại → full màn hình, safe area thật;
  - trong trang tổng quan → trang tổng quan vẽ vỏ máy, màn chỉ vẽ thanh trạng thái.
- **Nền tảng:** `data-platform` là mặc định của dự án. `?platform=android` trên URL đổi cho cả phiên. Phần chỉ có ở một nền tảng: `data-only="ios"` / `data-only="android"`.
- **Dữ liệu:** `data.js` + `store.js` theo D.5, kể cả khi chỉ có app.

---

## 2. iOS và Android: khác nhau ở đâu

| Thành phần | iOS *(HIG)* | Android *(Material 3)* | Trong khuôn |
|---|---|---|---|
| Vùng chạm | 44pt | 48dp | `--tap` |
| Thanh trên | 44pt, tiêu đề giữa 17 đậm vừa. Màn gốc của tab: tiêu đề lớn 34 đậm, cuộn qua thì thu lên thanh | 64dp, tiêu đề trái 22. Màn gốc: large top app bar, tiêu đề 28 | `.app-nav` `.app-title` `.app-large-title` |
| Quay lại | Chevron + tên màn trước, màu nhấn | Mũi tên, không chữ | `.app-back` + `data-only` |
| Điều hướng chính | Tab bar 49pt, 3–5 mục, icon + nhãn 10. Tab đang chọn: màu nhấn, icon đặc | Navigation bar 80dp, 3–5 mục, nhãn 12. Tab đang chọn: viên nền 64×32 sau icon | `.app-tabs` |
| Danh sách | Nhóm bo góc, chevron ở dòng đi sâu | Phẳng, dòng 56dp, không chevron | `.app-list` `.app-row` |
| Nút chính | Rộng hết, cao 50, bo 12 | Pill cao 40–48, rộng theo chữ | `.app-btn` |
| Tạo mới | Nút `+` trên thanh trên | FAB góc dưới phải | tự dựng theo token |
| Công tắc | 51×31 | 52×32, có viền | `.app-switch` |
| Lớp phủ | Sheet có tay nắm. Xác nhận nguy hiểm: alert giữa màn | Bottom sheet bo 28. Xác nhận: dialog bo 28 | `.app-sheet` |
| Thông báo ngắn | Toast bo tròn | Snackbar bo 4, sát trên thanh dưới | `app.toast()` |
| Font | SF Pro *(`-apple-system`)*; **Inter** thay khi xem trên máy không phải Apple | Roboto | `--app-font`; font thương hiệu ở `--brand-font` |
| Icon | Phosphor Regular *(thay SF Symbols)* | Phosphor Regular *(thay Material Symbols)* | |

- Làm **một nền tảng**: theo đúng cột đó.
- Làm **cả hai**: một bộ màn duy nhất. Khác biệt đặt bằng `data-only` hoặc CSS theo `[data-platform]`, **không** tách hai bộ file.
- Có font thương hiệu *(DESIGN.md)* thì dùng cho cả hai: đặt `--brand-font` trong `tokens.css`. Đừng ghi đè `--app-font`: `app.css` nạp sau sẽ đè lại. Không có thì dùng font nền tảng *(bảng mâu thuẫn dòng 16)*.

---

## 3. Điều hướng

- **Mô hình:** 3–5 tab, mỗi tab một ngăn xếp màn. Không dùng menu hamburger làm điều hướng chính. Hơn 5 mục thì gom vào tab *Tài khoản* hoặc *Thêm*.
- **Vào sâu:** link thường. `app.js` ghi ngăn xếp và cho màn mới trượt từ phải.
- **Quay lại:** `<a class="app-back" data-back href="<màn cha>">`. Về đúng màn trước trong phiên; mở thẳng màn này thì về `href`.
- **Đổi tab:** về gốc của tab, không trượt.
- **Thanh tab** giữ trên màn đi sâu trong cùng tab. **Bỏ** ở luồng toàn màn *(thanh toán, soạn mới, onboarding)*: luồng đó có nút *Huỷ* hoặc *Đóng* thay cho nút quay lại.
- **Sheet** cho tác vụ ngắn tại chỗ *(lọc, chọn, xác nhận có tuỳ chọn)*: `data-sheet-open="<id>"`, `data-sheet-close`. Đóng được bằng nút, bấm nền mờ, `Esc`.
- **Cử chỉ:** không để cử chỉ là cách duy nhất *(vuốt để xoá phải có nút đi kèm)*. Không đè vuốt ngang của hệ thống.

---

## 4. Bố cục và chạm

- **Vùng chạm:** hộp của phần tử ≥ 44 *(iOS)* / 48 *(Android)*; phần nhìn thấy được phép nhỏ hơn. Các vùng chạm cách nhau ≥ 8.
  - Bộ kiểm khói đo tự động *(bước `tap-targets`)*. Ngoại lệ thật hiếm: gắn `data-tap-ok`, ghi lý do vào `DECISIONS.md`.
  - Trong CSS của dự án, kích thước vùng chạm viết bằng `var(--tap)` *(khuôn đặt 44 cho iOS, 48 cho Android)*, không viết cứng `44px`: số cứng đạt iOS nhưng hỏng Android.
- **Tầm ngón cái:** hành động chính ở nửa dưới màn. Hành động phá huỷ không nằm cạnh hành động hay dùng.
- **Chữ:** thân ≥ 16px *(iOS 17)*, phụ ≥ 13. Ô nhập ≥ 16px, vì Safari iOS tự phóng to khi nhỏ hơn.
- **Ô nhập:** đúng `type`, `inputmode`, `autocomplete` *(`tel`, `email`, `numeric`, `one-time-code`)* để hiện đúng bàn phím.
- **Không có hover:** mọi trạng thái thấy được mà không cần di chuột; có phản hồi `:active`.
- **Cuộn trong `.app-body`**, thanh trên và thanh tab đứng yên. Lớp phủ đặt trong `.app`. Không `100vh` *(P03)*.
- **Safe area:** dùng `var(--sat)`, `var(--sab)`, không số cứng.
- **Mật độ:** một cột. Bảng rộng thành danh sách, dòng mở ra màn chi tiết. Số liệu `tabular-nums`.

---

## 5. Phong cách

- Concept *(Cổng 2)* quyết **token**: màu, chữ thương hiệu, bo góc, không khí, cách dùng ảnh.
- Luật bố cục web của họ **không áp** cho màn app: màn đầu kiểu hero, AIDA, bento trang trí, marquee, eyebrow, ảnh nền điện ảnh.
- **Dial:** M ≤ 5, chuyển động chỉ để phản hồi và chuyển màn *(200–350 ms)*. D theo loại app: tiêu dùng 4–6, công cụ và tài chính 6–8.
- Mỗi màn **một** điểm nhấn thị giác *(ảnh sản phẩm, con số chính, thẻ trạng thái)*; phần còn lại theo hệ thống.
- **Ảnh:** theo SKILL.md mục 6. Ảnh là nội dung *(món, sản phẩm, địa điểm)* thì cần; ảnh chỉ để trang trí thì bỏ.
- **Nền tối:** theo Cổng 2. App tiêu dùng mặc định *theo hệ thống*.

---

## 6. Hệ thống nhiều bề mặt

- **Một lượt `sketch-to-concept` + `sketch-to-site` cho mọi bề mặt.** Không chạy riêng từng bề mặt: sẽ ra hai bộ token lệch nhau và hai kho dữ liệu không thấy nhau.
- **Cổng 1:** liệt kê bề mặt, người dùng của từng bề mặt, nền tảng của app.
- **Cổng 2:** một concept cho cả hệ thống. Mật độ khác nhau theo bề mặt *(admin D 6–8, app theo loại)*.
- **A3** *(`sketch-to-concept`)*: mỗi concept dựng **màn then chốt của mọi bề mặt** *(ví dụ dashboard admin + trang chủ app)*, để thấy một concept áp lên cả hệ thống ra sao.
- **B2:**
  - một `DESIGN.md`, mục 10 ghi phần riêng của từng bề mặt;
  - sơ đồ màn chia theo bề mặt;
  - bảng **luồng xuyên bề mặt**: hành động ở bề mặt A → thứ thay đổi ở bề mặt B.
- **Dữ liệu:** một `data.js` + `store.js` cho mọi bề mặt. Một trạng thái nghiệp vụ mang **cùng tên** ở mọi bề mặt.
- **Phân quyền:** mỗi bề mặt một nhóm vai *(admin: vai nội bộ; app: khách)*. Màn admin không mở được từ app.
- **Demo:** mở admin và app *(khung máy)* ở hai tab cạnh nhau. Thao tác một bên thì bên kia cập nhật ngay, vì store nghe sự kiện `storage`.
- **Kiểm luồng xuyên bề mặt** trong một bộ kiểm: bước ghi ở admin rồi `location.href = '../app/<màn>.html'`, rồi `check` bên app.

---

## 7. Mở trên điện thoại thật

- Mở `file://` trên điện thoại không thực tế. Hai cách:
  - chạy `python -m http.server 8000` trong `site/`, mở `http://<IP máy tính>:8000/app/` trên điện thoại cùng Wi-Fi;
  - đăng lên host tĩnh *(Artifact, Netlify, GitHub Pages)*.
- Dữ liệu của store gắn theo địa chỉ: điện thoại và máy tính giữ dữ liệu riêng. `?reset` về dữ liệu mẫu.

---

## 8. Tự kiểm

- **B1 · tra luật app:**
  ```bash
  python <skills>/ui-ux-pro-max/scripts/search.py "<chủ đề: tab bar, form, onboarding…>" --domain web -n 5
  python <skills>/ui-ux-pro-max/scripts/search.py "<chủ đề>" --domain ux -n 5
  ```
  Domain `web` đọc `app-interface.csv`: luật iOS/Android về chạm, điều hướng, trợ năng.
- **A2 *(`sketch-to-concept`)* · `--design-system` viết cho landing page.** Thử ngày 29/09 với truy vấn *"coffee shop ordering mobile app"*, kết quả vẫn là:
  - Pattern *Hero + Features + CTA* và checklist có hover, `cursor-pointer`;
  - font Outfit, không có dấu tiếng Việt *(Fredoka cũng hay được gợi ý, cũng không có)*;
  - `#000000` cho chữ trên màu nhấn *(P05)*.

  Với app chỉ lấy **bảng màu** làm gợi ý. Bỏ Pattern và checklist, thay bằng mục 4 và `qa-gate.md` mục 4. Font gợi ý phải qua `preflight.py --font` trước khi đưa lên Cổng 2.
- **Bộ kiểm:**
  - `qa_init.py` tự nhận màn app, thêm bước `tap-targets`, tìm trang ở cả `site/admin/` lẫn `site/app/`;
  - làm cả hai nền tảng thì thêm `"android": "?platform=android"` vào `themes`;
  - màn app chạy ở 1440 *(khung máy)* và 390 *(full màn hình, đo vùng chạm)*; trang web của hệ thống chạy thêm 768;
  - Thị trường nhiều máy Android nhỏ thì thêm khổ `"compact": [360, 780, 1]` cho các màn chính.
- **Soát tay:** `qa-gate.md` mục 4, phần *App mobile*. UX 12 điểm vẫn áp; nặng ký nhất ở app là **Fitts** *(vùng chạm, tầm ngón cái)* và **Hick** *(≤ 5 tab, một hành động chính mỗi màn)*.

---

## 9. Bàn giao cho đội dựng app thật

- Trong prototype, 1 CSS px = 1 pt *(iOS)* = 1 dp *(Android)*. `DESIGN.md` ghi kích thước theo đơn vị đó.
- Tra lưu ý theo stack của đội: `search.py "<chủ đề>" --stack swiftui` *(hoặc `jetpack-compose`, `react-native`, `flutter`)*. Ghi các điểm cần nhớ vào `DESIGN.md` mục 10.
- Prototype không phải mã app. Thứ prototype chỉ giả lập *(thông báo đẩy, quyền hệ thống, chạy nền, thanh toán thật)* thì ghi thành danh sách **cần làm ở app thật** trong báo cáo bàn giao.
