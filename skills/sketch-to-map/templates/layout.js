// Bố cục của bản đồ (M2). Khuôn từ sketch-to-map/templates/layout.js: chép thành map/layout.js rồi điền. Ví dụ đủ: layout.example.js.
// - Nạp bằng <script> ở khung bấm thử (map/index.html), không fetch: trang mở từ file:// không đọc được file cạnh nó.
// - Mã (id): chữ thường a-z, số, gạch ngang. Mã chức năng F-01… lấy từ features.js. Chữ người dùng đọc (name, zones, tabs, bands, label) theo
//   ngôn ngữ của người dùng và KHÔNG chứa mã tham chiếu (UC-, BR-, F-…): map.mjs check chặn.
// - Kiểm: node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype>. Luật và lý do từng ngưỡng: references/m2-bo-cuc.md.
window.LAYOUT = {
  // Bề mặt. kind: web · app. dir: thư mục trang khi dựng (site/<dir>/<màn>.html). ctrlK: true khi bề mặt web có tìm chung Ctrl+K
  // (bắt buộc khi có việc T3).
  surfaces: [
    // { id: 'web', name: '', kind: 'web', dir: 'admin', ctrlK: true },
  ],
  // Vai. Một vai dùng một bề mặt (người dùng cả web và app thì khai hai vai). home: màn trang chủ của vai, có dải việc (bands).
  roles: [
    // { id: '', name: '', surface: 'web', home: '' },
  ],
  // Module: nhóm chức năng theo đối tượng, khớp module trong features.js. depends: module phải dựng trước (một chiều, không vòng).
  // dot: đợt dựng, điền sau Cổng Bản đồ (1 là đợt đầu).
  modules: [
    // { id: '', name: '', depends: [], dot: null },
  ],
  // Màn. roles: vai mở được màn. parent: màn mẹ (bấm một dòng thì sang màn này); pick: true khi tới màn phải tìm và chọn một bản ghi.
  // zones: các vùng theo thứ tự; tabs: tab theo thứ tự (tab đầu mở sẵn). bands: chỉ ở trang chủ, mỗi dải một tên và các mã chức năng:
  // mục của dải phải đặt trên chính màn đó (place) hay có lối tắt từ màn đó (shortcuts). entry: true cho màn vào trước trang chủ (đăng nhập).
  // file: chỉ khai khi khác <dir>/<id>.html.
  screens: [
    // { id: '', name: '', surface: 'web', module: '', roles: [], zones: [], tabs: [], parent: '', pick: true, bands: [{ name: '', items: [] }] },
  ],
  // Menu. Mỗi vai ở đúng một menu; vai cùng việc có thể chung menu. Nhóm đặt theo việc của người dùng, KHÔNG theo đợt phát hành
  // (GĐ2, Phase 2, Sắp ra mắt…: chặn). name: '' cho nhóm không tên. Web: tới 5 mục là thanh trên, 6–9 sidebar phẳng, từ 10 thì 3–6 nhóm
  // có tên; ≤ 7 mục mỗi nhóm. App: 3–5 tab.
  nav: [
    // { roles: [], groups: [{ name: '', items: [] }] },
  ],
  // Chỗ đặt: mỗi chức năng một dòng (chức năng có ở hai bề mặt thì một mảng hai chỗ).
  //   screen · zone hay tab (tuỳ) · tier: 1 chính (tối đa 1 mỗi màn, ≤ 3 bước từ trang chủ) · 2 phụ (≤ 5 nhìn thấy mỗi màn) ·
  //   3 hiếm (menu …, Cài đặt, luôn có trong Ctrl+K) · 4 ngữ cảnh (trên dòng, hàng loạt, theo trạng thái)
  //   mo: tai-cho · ngan-truot · hop-thoai · sheet (app) · trang (chức năng là nội dung của chính màn đó)
  place: {
    // 'F-01': { screen: '', zone: '', tier: 1, mo: 'hop-thoai' },
  },
  // Lối tắt: nút ở màn from mở chức năng to. Mở TRÊN from: hop-thoai (ngắn) · ngan-truot (vừa, cần nhìn dữ liệu của from) · sheet (app).
  // mo: trang chỉ khi chức năng dài nhiều bước, và bắt buộc khai ve: cách về from (Quay lại giữ trạng thái, xong tự về kèm thông báo).
  // label: chỉ khai khi khác tên chức năng (một việc một nhãn trên mọi màn).
  shortcuts: [
    // { from: '', to: 'F-01', mo: 'hop-thoai' },
    // { from: '', to: 'F-02', mo: 'trang', ve: '' },
  ],
  // Hành trình theo vai, 1–3 mỗi vai: các chức năng theo thứ tự làm. Bước mà vai không tới được: chặn.
  flows: [
    // { role: '', name: '', steps: [] },
  ],
  // 5–10 việc hằng ngày để người dùng bấm thử ở Cổng Bản đồ, nói bằng lời của người dùng, không dùng nhãn trên màn.
  tasks: [
    // { role: '', say: '', feature: 'F-01' },
  ],
};
