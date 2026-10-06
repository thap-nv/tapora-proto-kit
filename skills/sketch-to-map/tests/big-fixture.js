// Dữ liệu cỡ dự án thật cho test: 150 chức năng, 11 vai, 12 module, 3 bề mặt (web quản trị, app phụ huynh, app huấn luyện viên),
// nhãn dài. Sinh bằng mã để test khung bấm thử và map.mjs ở cỡ thật mà không chép dữ liệu của khách. check trên bộ này không có mục chặn.
'use strict';

const WEB_ROLES = [
  ['quan-ly', 'Quản lý trung tâm và điều hành chung'], ['le-tan', 'Lễ tân quầy đón tiếp'], ['sale', 'Nhân viên kinh doanh khoá học'],
  ['ke-toan', 'Kế toán và thu ngân'], ['cskh', 'Chăm sóc khách hàng sau bán'], ['dieu-phoi', 'Điều phối lịch học và bể bơi'],
  ['truong-bm', 'Trưởng bộ môn huấn luyện'], ['admin', 'Quản trị hệ thống và phân quyền'],
];
const MODULES = [
  ['hoc-vien', 'Học viên và hồ sơ gia đình', ['le-tan', 'sale']],
  ['khoa-hoc', 'Khoá học, cấp độ và giáo trình', ['truong-bm']],
  ['lich', 'Lịch học, xếp lớp và học bù', ['dieu-phoi', 'le-tan']],
  ['diem-danh', 'Điểm danh và check-in tại quầy', ['le-tan']],
  ['ban-khoa', 'Bán khoá, vé lẻ và gia hạn gói', ['sale', 'le-tan']],
  ['thu-tien', 'Thu tiền, hoàn tiền và công nợ', ['ke-toan']],
  ['hlv', 'Huấn luyện viên, ca dạy và chấm công', ['truong-bm', 'dieu-phoi']],
  ['khach-tiem-nang', 'Khách hàng tiềm năng và chăm sóc', ['sale', 'cskh']],
  ['thong-bao', 'Thông báo, tin nhắn và nhắc lịch tự động', ['cskh']],
  ['bao-cao', 'Báo cáo vận hành, doanh thu và chuyên cần', ['ke-toan']],
];
const VERBS = ['Tạo mới', 'Tìm và lọc', 'Xem chi tiết', 'Sửa thông tin', 'Duyệt yêu cầu', 'Xuất danh sách ra Excel', 'Ghi chú nội bộ',
  'Đổi trạng thái hàng loạt', 'Cấu hình quy tắc', 'Xem lịch sử thay đổi', 'In phiếu', 'Gửi lại xác nhận'];
const APP = [
  ['app-ph', 'App phụ huynh và học viên', ['phu-huynh', 'Phụ huynh có nhiều con học cùng lúc'], ['hoc-vien-tu-hoc', 'Học viên người lớn tự đăng ký'],
    ['Xem lịch học sắp tới của con', 'Báo nghỉ một buổi kèm lý do', 'Xin đổi buổi sang khung giờ khác', 'Xem số buổi còn lại và hạn dùng của gói',
      'Mua thêm khoá học mới trên ứng dụng', 'Xem biên lai và lịch sử đóng tiền', 'Chọn con đang xem khi có nhiều con', 'Đọc thông báo của trung tâm',
      'Đánh giá buổi học và huấn luyện viên', 'Đổi số điện thoại đăng nhập', 'Bật tắt nhắc lịch trước giờ học', 'Xem nhận xét tiến bộ của con',
      'Đặt lịch học thử miễn phí', 'Liên hệ quầy lễ tân', 'Xem nội quy bể bơi và an toàn']],
  ['app-hlv', 'App huấn luyện viên', ['hlv', 'Huấn luyện viên đứng lớp ca sáng và ca chiều'], null,
    ['Xem ca dạy hôm nay và tuần này', 'Điểm danh học viên ngay tại bể', 'Ghi nhận xét tiến bộ sau buổi', 'Báo vắng và đề nghị người dạy thay',
      'Nhận ca dạy thay được đề nghị', 'Xem danh sách học viên và ghi chú sức khoẻ', 'Chấm công ca dạy', 'Xem bảng lương tạm tính tháng này',
      'Đọc thông báo nội bộ', 'Đổi mật khẩu đăng nhập', 'Xem giáo trình theo cấp độ', 'Báo sự cố bể bơi hay thiết bị',
      'Xem lịch nghỉ lễ của trung tâm', 'Gửi ảnh buổi học cho phụ huynh', 'Xem đánh giá của phụ huynh về buổi dạy']],
];

function build() {
  const features = [], screens = [], place = {}, shortcuts = [], nav = [], roles = [], flows = [], tasks = [];
  let n = 0;
  const fid = () => `F-${String(++n).padStart(3, '0')}`;
  const modules = [...MODULES.map(([id, name], i) => ({ id, name, depends: i ? ['hoc-vien'] : [] })), ...APP.map(([id, name]) => ({ id, name, depends: ['hoc-vien'] }))];
  for (const [id, name] of WEB_ROLES) roles.push({ id, name, surface: 'web', home: `home-${id}` });
  // Web: mỗi module một màn danh sách (menu), một màn chi tiết (bấm một dòng) và một màn cấu hình (con của danh sách); 12 chức năng
  for (const [mid, mname, owners] of MODULES) {
    const who = [...new Set([...owners, 'quan-ly'])];
    const list = `${mid}-ds`, detail = `${mid}-ct`, conf = `${mid}-ch`;
    screens.push({ id: list, name: `Danh sách ${mname.toLowerCase()}`, surface: 'web', module: mid, roles: who, zones: ['Tìm, lọc và thao tác nhanh', 'Bảng dữ liệu chính'] });
    screens.push({ id: detail, name: `Hồ sơ chi tiết: ${mname.toLowerCase()}`, surface: 'web', module: mid, roles: who, parent: list, pick: true,
      tabs: ['Thông tin chung và liên hệ', 'Lịch sử giao dịch', 'Ghi chú và nhật ký thay đổi', 'Tài liệu đính kèm'] });
    screens.push({ id: conf, name: `Cấu hình và quy tắc: ${mname.toLowerCase()}`, surface: 'web', module: mid, roles: who, parent: list });
    VERBS.forEach((v, i) => {
      const id = fid();
      features.push({ id, name: `${v} ${mname.toLowerCase()} theo đúng quy trình của trung tâm`, module: mid, src: [`UC-${n}`], roles: who,
        freq: i < 3 ? 'ngay' : i < 8 ? 'tuan' : 'hiem', evidence: i === 6 ? 'suy' : 'ro', status: i === 11 ? 'hoan' : 'pham-vi',
        spec: `Mô tả ngắn của chức năng ${n}: đủ dài để thử xuống dòng trong ngăn trượt, hộp thoại và sheet ở khổ 390.` });
      place[id] = i === 0 ? { screen: list, zone: 'Tìm, lọc và thao tác nhanh', tier: 1, mo: 'hop-thoai' }
        : i === 1 ? { screen: list, zone: 'Tìm, lọc và thao tác nhanh', tier: 2, mo: 'tai-cho' }
          : i === 2 ? { screen: detail, tier: 2, mo: 'trang' }
            : i < 6 ? { screen: detail, tab: screens.find(s => s.id === detail).tabs[i - 3], tier: 2, mo: 'ngan-truot' }
              : i < 8 ? { screen: list, zone: 'Bảng dữ liệu chính', tier: 4, mo: 'hop-thoai' }
                : { screen: conf, tier: 3, mo: i === 9 ? 'ngan-truot' : 'tai-cho' };
    });
  }
  // Trang chủ mỗi vai web: dải việc chính là lối tắt (hộp thoại) tới việc T1 của module vai đó làm
  const t1 = features.filter(f => place[f.id] && place[f.id].tier === 1);
  for (const [rid] of WEB_ROLES) {
    const mine = t1.filter(f => f.roles.includes(rid)).slice(0, 5);
    screens.push({ id: `home-${rid}`, name: 'Việc hôm nay của tôi', surface: 'web', module: 'hoc-vien', roles: [rid],
      bands: [{ name: 'Việc chính hằng ngày', items: mine.map(f => f.id) }] });
    for (const f of mine) shortcuts.push({ from: `home-${rid}`, to: f.id, mo: 'hop-thoai' });
    const lists = MODULES.filter(([, , owners]) => rid === 'quan-ly' || owners.includes(rid)).map(([mid]) => `${mid}-ds`);
    const groups = rid === 'quan-ly'
      ? [{ name: '', items: ['home-quan-ly', ...lists.slice(0, 2)] }, { name: 'Khách hàng và bán hàng', items: lists.slice(2, 5) },
        { name: 'Vận hành hằng ngày', items: lists.slice(5, 8) }, { name: 'Tài chính và báo cáo', items: lists.slice(8) }]
      : [{ name: '', items: [`home-${rid}`, ...lists] }];
    nav.push({ roles: [rid], groups });
    if (mine.length) flows.push({ role: rid, name: `Một ngày làm việc của ${rid}`, steps: mine.slice(0, 3).map(f => f.id) });
  }
  // Vai admin không làm module nào: cho quản trị phân quyền (một module riêng trên web)
  modules.push({ id: 'quan-tri', name: 'Quản trị hệ thống', depends: [] });
  screens.push({ id: 'quan-tri-ds', name: 'Tài khoản, vai và quyền truy cập', surface: 'web', module: 'quan-tri', roles: ['admin', 'quan-ly'] });
  ['Tạo tài khoản nhân viên mới', 'Khoá tài khoản khi nghỉ việc', 'Gán vai và quyền cho nhân viên'].forEach((v, i) => {
    const id = fid();
    features.push({ id, name: v, module: 'quan-tri', src: [`UC-${n}`], roles: ['admin'], freq: 'tuan', evidence: 'ro', status: 'pham-vi', spec: 'Quản trị tài khoản.' });
    place[id] = { screen: 'quan-tri-ds', tier: i ? 2 : 1, mo: 'ngan-truot' };
  });
  const adminFirst = features.find(f => f.module === 'quan-tri');
  screens.find(s => s.id === 'home-admin').bands = [{ name: 'Việc chính hằng ngày', items: [adminFirst.id] }];
  shortcuts.push({ from: 'home-admin', to: adminFirst.id, mo: 'ngan-truot' });
  nav.find(m => m.roles[0] === 'admin').groups[0].items.push('quan-tri-ds');
  flows.push({ role: 'admin', name: 'Nhân viên mới vào làm', steps: [adminFirst.id] });
  // App: 4 tab mỗi app, chức năng chia đều vào 4 tab
  const surfaces = [{ id: 'web', name: 'Web quản trị trung tâm bơi', kind: 'web', dir: 'admin', ctrlK: true }];
  for (const [aid, aname, r1, r2, names] of APP) {
    surfaces.push({ id: aid, name: aname, kind: 'app', dir: aid });
    const rs = [r1, r2].filter(Boolean);
    for (const [rid, rname] of rs) roles.push({ id: rid, name: rname, surface: aid, home: `${aid}-t1` });
    const ids = rs.map(r => r[0]);
    const tabs = ['Hôm nay', 'Lịch và buổi học', 'Thông báo', 'Tài khoản và cài đặt'];
    tabs.forEach((t, i) => screens.push({ id: `${aid}-t${i + 1}`, name: t, surface: aid, module: aid, roles: ids }));
    names.forEach((nm, i) => {
      const id = fid();
      features.push({ id, name: nm, module: aid, src: [`UC-${n}`], roles: ids, freq: i < 4 ? 'ngay' : 'tuan', evidence: 'ro', status: i === 14 ? 'hoan' : 'pham-vi',
        spec: `Việc trên app: ${nm.toLowerCase()}.` });
      place[id] = { screen: `${aid}-t${(i % 4) + 1}`, tier: i === 0 ? 1 : i < 12 ? 2 : 4, mo: i % 3 === 0 ? 'sheet' : 'tai-cho' };
    });
    const first = features.filter(f => f.module === aid);
    screens.find(s => s.id === `${aid}-t1`).bands = [{ name: 'Việc hôm nay', items: first.filter(f => place[f.id].screen === `${aid}-t1`).slice(0, 3).map(f => f.id) }];
    nav.push({ roles: ids, groups: [{ name: '', items: tabs.map((_, i) => `${aid}-t${i + 1}`) }] });
    for (const rid of ids) flows.push({ role: rid, name: `Dùng ${aname.toLowerCase()} hằng ngày`, steps: first.slice(0, 2).map(f => f.id) });
  }
  // 8 việc bấm thử: việc T1 của các vai khác nhau
  for (const f of t1.slice(0, 6)) tasks.push({ role: f.roles[0], say: `Khách tới quầy, bạn cần: ${f.name.toLowerCase()}.`, feature: f.id });
  tasks.push({ role: 'phu-huynh', say: 'Bạn muốn xem lịch học tuần này của con.', feature: features.find(f => f.module === 'app-ph').id });
  tasks.push({ role: 'hlv', say: 'Bạn xem hôm nay mình dạy những ca nào.', feature: features.find(f => f.module === 'app-hlv').id });
  return {
    F: { project: 'Trung tâm bơi cỡ lớn (dữ liệu thử)', features, skip: [] },
    L: { surfaces, roles, modules, screens, nav, place, shortcuts, flows, tasks },
  };
}

module.exports = { build };
