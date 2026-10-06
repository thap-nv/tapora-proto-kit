window.LAYOUT = {
  surfaces: [
    { id: 'web', name: 'Web quản trị', kind: 'web', dir: 'admin', ctrlK: true },
    { id: 'app', name: 'App phụ huynh', kind: 'app', dir: 'app' },
  ],
  roles: [
    { id: 'quan-ly', name: 'Quản lý', surface: 'web', home: 'tong-quan' },
    { id: 'le-tan', name: 'Lễ tân', surface: 'web', home: 'quay-hom-nay' },
    { id: 'hlv', name: 'Huấn luyện viên', surface: 'web', home: 'buoi-day' },
    { id: 'phu-huynh', name: 'Phụ huynh', surface: 'app', home: 'app-lich-hoc' },
  ],
  modules: [
    { id: 'hoc-vien', name: 'Học viên', depends: [] },
    { id: 'quan-tri', name: 'Quản trị', depends: [] },
    { id: 'goi-hoc', name: 'Gói học và thu tiền', depends: ['hoc-vien'] },
    { id: 'lop', name: 'Khoá học và lớp', depends: ['hoc-vien', 'quan-tri', 'goi-hoc'] },
    { id: 'lich', name: 'Lịch và buổi học', depends: ['lop', 'goi-hoc'] },
    { id: 'diem-danh', name: 'Điểm danh', depends: ['lich', 'goi-hoc'] },
    { id: 'thong-bao', name: 'Thông báo', depends: ['hoc-vien', 'lop', 'lich'] },
    { id: 'bao-cao', name: 'Báo cáo', depends: ['diem-danh', 'goi-hoc'] },
  ],
  screens: [
    // Trang chủ theo vai
    { id: 'quay-hom-nay', name: 'Quầy hôm nay', surface: 'web', module: 'lich', roles: ['le-tan'],
      bands: [
        { name: 'Việc nhanh', items: ['F-24', 'F-07', 'F-50', 'F-34'] },
        { name: 'Bé hết buổi có lớp hôm nay', items: ['F-09'] },
        { name: 'Chờ xử lý', items: ['F-36', 'F-08'] },
        { name: 'Sắp hết buổi cần gọi', items: ['F-16', 'F-17'] },
      ] },
    { id: 'tong-quan', name: 'Tổng quan', surface: 'web', module: 'bao-cao', roles: ['quan-ly'],
      bands: [
        { name: 'Cần duyệt', items: ['F-19', 'F-48'] },
        { name: 'Hôm nay ở bể', items: ['F-40', 'F-41'] },
        { name: 'Tháng này', items: ['F-01', 'F-02'] },
        { name: 'Việc nhanh', items: ['F-65'] },
      ] },
    { id: 'buoi-day', name: 'Buổi dạy hôm nay', surface: 'web', module: 'diem-danh', roles: ['hlv'],
      bands: [
        { name: 'Buổi đang dạy', items: ['F-04', 'F-51'] },
        { name: 'Lịch dạy tuần này', items: ['F-31'] },
        { name: 'Buổi đã dạy', items: ['F-05'] },
      ] },
    { id: 'app-lich-hoc', name: 'Lịch học', surface: 'app', module: 'lich', roles: ['phu-huynh'],
      bands: [
        { name: 'Con đang xem', items: ['F-29'] },
        { name: 'Buổi sắp tới', items: ['F-32', 'F-33', 'F-35'] },
        { name: 'Buổi đã học', items: ['F-54'] },
      ] },

    // Đăng nhập
    { id: 'dang-nhap', name: 'Đăng nhập', surface: 'web', module: 'quan-tri', roles: ['quan-ly', 'le-tan', 'hlv'], entry: true, zones: ['Ô đăng nhập'] },
    { id: 'app-dang-nhap', name: 'Đăng nhập', surface: 'app', module: 'quan-tri', roles: ['phu-huynh'], entry: true, zones: ['Ô đăng nhập'] },

    // Lịch
    { id: 'lich', name: 'Lịch trung tâm', surface: 'web', module: 'lich', roles: ['quan-ly', 'le-tan'], zones: ['Thanh công cụ', 'Lưới làn và giờ'] },
    { id: 'buoi-hoc', name: 'Buổi học', surface: 'web', module: 'lich', roles: ['quan-ly', 'le-tan'], parent: 'lich', pick: true, zones: ['Đầu buổi', 'Học viên của buổi'] },
    { id: 'yeu-cau-doi-lich', name: 'Yêu cầu đổi lịch', surface: 'web', module: 'lich', roles: ['le-tan', 'quan-ly'], zones: ['Lọc theo trạng thái', 'Danh sách yêu cầu'] },

    // Học viên
    { id: 'hoc-vien', name: 'Học viên', surface: 'web', module: 'hoc-vien', roles: ['le-tan', 'quan-ly', 'hlv'], zones: ['Tìm và lọc', 'Bảng học viên'] },
    { id: 'ho-so-hoc-vien', name: 'Hồ sơ học viên', surface: 'web', module: 'hoc-vien', roles: ['le-tan', 'quan-ly', 'hlv'], parent: 'hoc-vien', pick: true,
      zones: ['Đầu hồ sơ'], tabs: ['Gói học', 'Đóng tiền', 'Buổi đã học'] },

    // Lớp
    { id: 'lop', name: 'Lớp', surface: 'web', module: 'lop', roles: ['le-tan', 'quan-ly', 'hlv'], zones: ['Lọc', 'Bảng lớp'] },
    { id: 'lop-chi-tiet', name: 'Chi tiết lớp', surface: 'web', module: 'lop', roles: ['le-tan', 'quan-ly', 'hlv'], parent: 'lop', pick: true,
      zones: ['Đầu lớp'], tabs: ['Học viên đang học', 'Danh sách chờ'] },
    { id: 'khoa-hoc', name: 'Khoá học', surface: 'web', module: 'lop', roles: ['quan-ly'], zones: ['Danh sách khoá học'] },

    // Gói và tiền
    { id: 'thu-tien', name: 'Thu tiền', surface: 'web', module: 'goi-hoc', roles: ['le-tan', 'quan-ly'], zones: ['Bán gói', 'Bé hết buổi có lớp hôm nay', 'Chuyển khoản chờ xác nhận'] },
    { id: 'goi-hoc', name: 'Gói học', surface: 'web', module: 'goi-hoc', roles: ['le-tan', 'quan-ly'], tabs: ['Theo trạng thái', 'Sắp hết buổi'] },
    { id: 'hoan-tien', name: 'Hoàn tiền', surface: 'web', module: 'goi-hoc', roles: ['quan-ly', 'le-tan'], zones: ['Thanh công cụ', 'Danh sách đề nghị'] },
    { id: 'bang-gia', name: 'Bảng giá', surface: 'web', module: 'goi-hoc', roles: ['quan-ly'], tabs: ['Bảng giá', 'Mã khuyến mãi'] },

    // Thông báo, báo cáo
    { id: 'thong-bao', name: 'Thông báo', surface: 'web', module: 'thong-bao', roles: ['quan-ly', 'le-tan'], zones: ['Thanh công cụ', 'Thông báo đã gửi'] },
    { id: 'nhac-lich', name: 'Nhắc lịch tự động', surface: 'web', module: 'thong-bao', roles: ['quan-ly'], zones: ['Cài đặt nhắc'] },
    { id: 'bao-cao', name: 'Báo cáo', surface: 'web', module: 'bao-cao', roles: ['quan-ly', 'le-tan'], zones: ['Chọn khoảng thời gian'], tabs: ['Chuyên cần', 'Doanh thu'] },

    // Cài đặt
    { id: 'ngay-nghi-le', name: 'Ngày nghỉ lễ', surface: 'web', module: 'lich', roles: ['quan-ly', 'le-tan'], zones: ['Danh sách ngày nghỉ'] },
    { id: 'nhan-vien', name: 'Nhân viên', surface: 'web', module: 'quan-tri', roles: ['quan-ly'], zones: ['Thanh công cụ', 'Bảng nhân viên'] },
    { id: 'nhat-ky', name: 'Nhật ký thao tác', surface: 'web', module: 'quan-tri', roles: ['quan-ly'], zones: ['Lọc', 'Bảng nhật ký'] },
    { id: 'tai-khoan', name: 'Tài khoản của tôi', surface: 'web', module: 'quan-tri', roles: ['quan-ly', 'le-tan', 'hlv'], zones: ['Thông tin tài khoản'] },

    // App phụ huynh
    { id: 'app-goi-hoc', name: 'Gói học', surface: 'app', module: 'goi-hoc', roles: ['phu-huynh'], zones: ['Gói đang dùng', 'Các lần đóng tiền'] },
    { id: 'app-thong-bao', name: 'Thông báo', surface: 'app', module: 'thong-bao', roles: ['phu-huynh'], zones: ['Danh sách thông báo'] },
    { id: 'app-tai-khoan', name: 'Tài khoản', surface: 'app', module: 'thong-bao', roles: ['phu-huynh'], zones: ['Cài đặt thông báo'] },
  ],
  nav: [
    { roles: ['quan-ly'], groups: [
      { name: 'Hằng ngày', items: ['tong-quan', 'lich', 'yeu-cau-doi-lich'] },
      { name: 'Học viên và lớp', items: ['hoc-vien', 'lop'] },
      { name: 'Gói và tiền', items: ['thu-tien', 'goi-hoc', 'hoan-tien'] },
      { name: 'Thông báo và báo cáo', items: ['thong-bao', 'bao-cao'] },
      { name: 'Cài đặt', items: ['khoa-hoc', 'bang-gia', 'ngay-nghi-le', 'nhac-lich', 'nhan-vien', 'nhat-ky', 'tai-khoan'] },
    ] },
    { roles: ['le-tan'], groups: [
      { name: 'Hằng ngày', items: ['quay-hom-nay', 'lich', 'yeu-cau-doi-lich'] },
      { name: 'Học viên và lớp', items: ['hoc-vien', 'lop'] },
      { name: 'Gói và tiền', items: ['thu-tien', 'goi-hoc', 'hoan-tien'] },
      { name: 'Thông báo và báo cáo', items: ['thong-bao', 'bao-cao'] },
      { name: 'Cài đặt', items: ['ngay-nghi-le', 'tai-khoan'] },
    ] },
    { roles: ['hlv'], groups: [{ name: '', items: ['buoi-day', 'hoc-vien', 'lop', 'tai-khoan'] }] },
    { roles: ['phu-huynh'], groups: [{ name: '', items: ['app-lich-hoc', 'app-goi-hoc', 'app-thong-bao', 'app-tai-khoan'] }] },
  ],
  place: {
    // bao-cao
    'F-01': [{ screen: 'bao-cao', tab: 'Chuyên cần', tier: 2, mo: 'tai-cho' }, { screen: 'tong-quan', zone: 'Tháng này', tier: 2, mo: 'tai-cho' }],
    'F-02': [{ screen: 'bao-cao', tab: 'Doanh thu', tier: 2, mo: 'tai-cho' }, { screen: 'tong-quan', zone: 'Tháng này', tier: 2, mo: 'tai-cho' }],
    'F-03': { screen: 'bao-cao', zone: 'Chọn khoảng thời gian', tier: 3, mo: 'tai-cho' },
    // diem-danh
    'F-04': [{ screen: 'buoi-day', zone: 'Buổi đang dạy', tier: 1, mo: 'tai-cho' }, { screen: 'buoi-hoc', zone: 'Học viên của buổi', tier: 2, mo: 'tai-cho' }],
    'F-05': [{ screen: 'buoi-day', zone: 'Buổi đã dạy', tier: 4, mo: 'ngan-truot' }, { screen: 'buoi-hoc', zone: 'Học viên của buổi', tier: 4, mo: 'ngan-truot' }],
    // goi-hoc
    'F-07': { screen: 'thu-tien', zone: 'Bán gói', tier: 1, mo: 'tai-cho' },
    'F-08': { screen: 'thu-tien', zone: 'Chuyển khoản chờ xác nhận', tier: 2, mo: 'hop-thoai' },
    'F-09': { screen: 'thu-tien', zone: 'Bé hết buổi có lớp hôm nay', tier: 2, mo: 'tai-cho' },
    'F-11': { screen: 'ho-so-hoc-vien', tab: 'Gói học', tier: 4, mo: 'ngan-truot' },
    'F-13': { screen: 'goi-hoc', tab: 'Theo trạng thái', tier: 2, mo: 'tai-cho' },
    'F-14': [{ screen: 'ho-so-hoc-vien', tab: 'Gói học', tier: 2, mo: 'tai-cho' }, { screen: 'app-goi-hoc', zone: 'Gói đang dùng', tier: 2, mo: 'tai-cho' }],
    'F-15': [{ screen: 'ho-so-hoc-vien', tab: 'Đóng tiền', tier: 2, mo: 'tai-cho' }, { screen: 'app-goi-hoc', zone: 'Các lần đóng tiền', tier: 2, mo: 'tai-cho' }],
    'F-16': [{ screen: 'quay-hom-nay', zone: 'Sắp hết buổi cần gọi', tier: 2, mo: 'tai-cho' }, { screen: 'goi-hoc', tab: 'Sắp hết buổi', tier: 2, mo: 'tai-cho' }],
    'F-17': { screen: 'quay-hom-nay', zone: 'Sắp hết buổi cần gọi', tier: 4, mo: 'hop-thoai' },
    'F-18': { screen: 'hoan-tien', zone: 'Thanh công cụ', tier: 2, mo: 'ngan-truot' },
    'F-19': { screen: 'hoan-tien', zone: 'Danh sách đề nghị', tier: 1, mo: 'hop-thoai' },
    'F-20': { screen: 'hoan-tien', zone: 'Danh sách đề nghị', tier: 4, mo: 'hop-thoai' },
    'F-21': { screen: 'bang-gia', tab: 'Bảng giá', tier: 2, mo: 'tai-cho' },
    'F-22': { screen: 'thu-tien', zone: 'Bán gói', tier: 2, mo: 'tai-cho' },
    'F-23': { screen: 'bang-gia', tab: 'Mã khuyến mãi', tier: 2, mo: 'ngan-truot' },
    // hoc-vien
    'F-24': { screen: 'hoc-vien', zone: 'Tìm và lọc', tier: 2, mo: 'ngan-truot' },
    'F-25': { screen: 'hoc-vien', zone: 'Tìm và lọc', tier: 1, mo: 'tai-cho' },
    'F-26': { screen: 'ho-so-hoc-vien', zone: 'Đầu hồ sơ', tier: 2, mo: 'tai-cho' },
    'F-27': { screen: 'ho-so-hoc-vien', zone: 'Đầu hồ sơ', tier: 2, mo: 'ngan-truot' },
    'F-28': { screen: 'ho-so-hoc-vien', zone: 'Đầu hồ sơ', tier: 3, mo: 'hop-thoai' },
    'F-29': { screen: 'app-lich-hoc', zone: 'Con đang xem', tier: 2, mo: 'tai-cho' },
    // lich
    'F-30': { screen: 'lich', zone: 'Lưới làn và giờ', tier: 1, mo: 'tai-cho' },
    'F-31': [{ screen: 'buoi-day', zone: 'Lịch dạy tuần này', tier: 2, mo: 'tai-cho' }, { screen: 'lich', zone: 'Thanh công cụ', tier: 2, mo: 'tai-cho' }],
    'F-32': { screen: 'app-lich-hoc', zone: 'Buổi sắp tới', tier: 2, mo: 'tai-cho' },
    'F-33': { screen: 'app-lich-hoc', zone: 'Buổi sắp tới', tier: 4, mo: 'sheet' },
    'F-34': { screen: 'quay-hom-nay', zone: 'Việc nhanh', tier: 2, mo: 'hop-thoai' },
    'F-35': { screen: 'app-lich-hoc', zone: 'Buổi sắp tới', tier: 4, mo: 'sheet' },
    'F-36': { screen: 'yeu-cau-doi-lich', zone: 'Danh sách yêu cầu', tier: 1, mo: 'ngan-truot' },
    'F-37': { screen: 'buoi-hoc', zone: 'Học viên của buổi', tier: 4, mo: 'ngan-truot' },
    'F-38': { screen: 'lop-chi-tiet', tab: 'Học viên đang học', tier: 4, mo: 'ngan-truot' },
    'F-39': { screen: 'buoi-hoc', zone: 'Học viên của buổi', tier: 4, mo: 'ngan-truot' },
    'F-40': { screen: 'lich', zone: 'Thanh công cụ', tier: 2, mo: 'ngan-truot' },
    'F-41': { screen: 'lich', zone: 'Thanh công cụ', tier: 3, mo: 'hop-thoai' },
    'F-43': { screen: 'ngay-nghi-le', zone: 'Danh sách ngày nghỉ', tier: 2, mo: 'tai-cho' },
    // lop
    'F-44': { screen: 'khoa-hoc', zone: 'Danh sách khoá học', tier: 2, mo: 'tai-cho' },
    'F-45': { screen: 'lop', zone: 'Lọc', tier: 3, mo: 'ngan-truot' },
    'F-46': { screen: 'lop', zone: 'Bảng lớp', tier: 1, mo: 'tai-cho' },
    'F-47': { screen: 'lop-chi-tiet', zone: 'Đầu lớp', tier: 1, mo: 'ngan-truot' },
    'F-48': { screen: 'lop-chi-tiet', zone: 'Đầu lớp', tier: 4, mo: 'hop-thoai' },
    'F-49': { screen: 'lop-chi-tiet', tab: 'Danh sách chờ', tier: 2, mo: 'tai-cho' },
    'F-50': { screen: 'hoc-vien', zone: 'Tìm và lọc', tier: 2, mo: 'ngan-truot' },
    'F-51': { screen: 'buoi-day', zone: 'Buổi đang dạy', tier: 4, mo: 'hop-thoai' },
    'F-53': { screen: 'lop-chi-tiet', tab: 'Học viên đang học', tier: 4, mo: 'ngan-truot' },
    'F-54': { screen: 'app-lich-hoc', zone: 'Buổi đã học', tier: 4, mo: 'sheet' },
    // quan-tri
    'F-55': { screen: 'nhan-vien', zone: 'Thanh công cụ', tier: 2, mo: 'ngan-truot' },
    'F-56': { screen: 'nhan-vien', zone: 'Bảng nhân viên', tier: 4, mo: 'ngan-truot' },
    'F-57': { screen: 'nhan-vien', zone: 'Bảng nhân viên', tier: 2, mo: 'tai-cho' },
    'F-58': { screen: 'nhan-vien', zone: 'Bảng nhân viên', tier: 4, mo: 'ngan-truot' },
    'F-59': { screen: 'nhan-vien', zone: 'Bảng nhân viên', tier: 4, mo: 'hop-thoai' },
    'F-60': { screen: 'nhan-vien', zone: 'Bảng nhân viên', tier: 4, mo: 'hop-thoai' },
    'F-61': { screen: 'dang-nhap', zone: 'Ô đăng nhập', tier: 1, mo: 'tai-cho' },
    'F-62': { screen: 'tai-khoan', zone: 'Thông tin tài khoản', tier: 2, mo: 'hop-thoai' },
    'F-63': { screen: 'nhat-ky', zone: 'Bảng nhật ký', tier: 2, mo: 'tai-cho' },
    'F-64': { screen: 'app-dang-nhap', zone: 'Ô đăng nhập', tier: 1, mo: 'tai-cho' },
    // thong-bao
    'F-65': { screen: 'thong-bao', zone: 'Thanh công cụ', tier: 1, mo: 'ngan-truot' },
    'F-66': { screen: 'thong-bao', zone: 'Thông báo đã gửi', tier: 2, mo: 'tai-cho' },
    'F-67': { screen: 'app-thong-bao', zone: 'Danh sách thông báo', tier: 2, mo: 'tai-cho' },
    'F-68': { screen: 'app-tai-khoan', zone: 'Cài đặt thông báo', tier: 2, mo: 'tai-cho' },
    'F-69': { screen: 'nhac-lich', zone: 'Cài đặt nhắc', tier: 2, mo: 'tai-cho' },
    'F-71': { screen: 'thong-bao', zone: 'Thanh công cụ', tier: 2, mo: 'ngan-truot' },
  },
  shortcuts: [
    // Quầy hôm nay: việc của lễ tân mở ngay trên trang chủ
    { from: 'quay-hom-nay', to: 'F-24', mo: 'ngan-truot' },
    { from: 'quay-hom-nay', to: 'F-07', mo: 'ngan-truot' },
    { from: 'quay-hom-nay', to: 'F-50', mo: 'ngan-truot' },
    { from: 'quay-hom-nay', to: 'F-09', mo: 'ngan-truot' },
    { from: 'quay-hom-nay', to: 'F-36', mo: 'ngan-truot' },
    { from: 'quay-hom-nay', to: 'F-08', mo: 'hop-thoai' },
    // Tổng quan của quản lý
    { from: 'tong-quan', to: 'F-19', mo: 'hop-thoai' },
    { from: 'tong-quan', to: 'F-48', mo: 'hop-thoai' },
    { from: 'tong-quan', to: 'F-40', mo: 'ngan-truot' },
    { from: 'tong-quan', to: 'F-41', mo: 'hop-thoai' },
    { from: 'tong-quan', to: 'F-65', mo: 'ngan-truot' },
    // Hồ sơ học viên: việc trên một bé mở tại hồ sơ, không đá sang màn khác
    { from: 'ho-so-hoc-vien', to: 'F-07', mo: 'ngan-truot' },
    { from: 'ho-so-hoc-vien', to: 'F-47', mo: 'ngan-truot' },
    { from: 'ho-so-hoc-vien', to: 'F-37', mo: 'ngan-truot' },
    { from: 'ho-so-hoc-vien', to: 'F-38', mo: 'ngan-truot' },
    { from: 'ho-so-hoc-vien', to: 'F-34', mo: 'hop-thoai' },
    { from: 'ho-so-hoc-vien', to: 'F-18', mo: 'ngan-truot' },
    // Xử lý yêu cầu đổi lịch bằng đổi một buổi ngay tại danh sách yêu cầu
    { from: 'yeu-cau-doi-lich', to: 'F-37', mo: 'ngan-truot' },
  ],
  flows: [
    { role: 'le-tan', name: 'Bé mới tới quầy đăng ký học', steps: ['F-24', 'F-07', 'F-47'] },
    { role: 'le-tan', name: 'Phụ huynh xin đổi buổi trên app', steps: ['F-36', 'F-37'] },
    { role: 'le-tan', name: 'Gọi mời gia hạn gói', steps: ['F-16', 'F-17', 'F-07'] },
    { role: 'quan-ly', name: 'Mở lớp đầu đợt', steps: ['F-44', 'F-45', 'F-46'] },
    { role: 'quan-ly', name: 'Bể có sự cố', steps: ['F-41', 'F-65'] },
    { role: 'quan-ly', name: 'Xem số cuối tháng', steps: ['F-01', 'F-02', 'F-03'] },
    { role: 'hlv', name: 'Dạy một buổi ở bể', steps: ['F-31', 'F-04', 'F-51'] },
    { role: 'phu-huynh', name: 'Con ốm, báo nghỉ', steps: ['F-64', 'F-29', 'F-32', 'F-33'] },
    { role: 'phu-huynh', name: 'Xem con còn bao nhiêu buổi', steps: ['F-29', 'F-14', 'F-15'] },
  ],
  tasks: [
    { role: 'le-tan', say: 'Một phụ huynh dắt bé 5 tuổi tới quầy, muốn cho bé đi học bơi từ tuần sau.', feature: 'F-24' },
    { role: 'le-tan', say: 'Phụ huynh của một bé đang học tới quầy, muốn đóng thêm 12 buổi bằng tiền mặt.', feature: 'F-07' },
    { role: 'le-tan', say: 'Kế toán nhắn: khoản chuyển khoản sáng nay của một phụ huynh đã về tài khoản.', feature: 'F-08' },
    { role: 'le-tan', say: 'Sáng nay có phụ huynh nhờ qua app chuyển con sang chiều thứ Năm tuần này.', feature: 'F-36' },
    { role: 'le-tan', say: 'Một bà nội gọi điện: cháu bị sốt, chiều nay không đi bơi được.', feature: 'F-34' },
    { role: 'le-tan', say: 'Một phụ huynh hỏi lớp Cơ bản tối thứ Ba còn nhận thêm bé không.', feature: 'F-46' },
    { role: 'hlv', say: 'Lớp 17 giờ vừa xuống nước, bạn đứng ở thành bể và cần ghi bé nào tới, bé nào không.', feature: 'F-04' },
    { role: 'quan-ly', say: 'Bạn muốn biết chiều nay bể có những lớp nào, ai dạy lớp nào.', feature: 'F-30' },
    { role: 'phu-huynh', say: 'Bạn muốn biết con còn mấy buổi nữa thì phải đóng tiền tiếp.', feature: 'F-14' },
    { role: 'phu-huynh', say: 'Con bị ốm, bạn muốn báo trung tâm là thứ Bảy này con nghỉ.', feature: 'F-33' },
  ],
};
