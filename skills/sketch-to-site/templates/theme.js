// Theme của prototype. Mọi theme (sáng, tối, theme thương hiệu) là một giá trị của data-theme trên <html>.
// Mẫu từ sketch-to-site/templates/theme.js. Chép vào site/assets/theme.js, nạp trong <head> của mọi trang, TRƯỚC CSS vẽ và không defer,
// để không nháy theme sai: <script src="assets/theme.js"></script>
// Danh sách theme do themes.css khai (--theme-list, sinh bởi scripts/themes.mjs từ themes.json): thêm theme không phải sửa file này.
//   ?theme=<tên>: ép theme đó cho cả phiên của tab (demo; bộ kiểm dùng để ảnh không đi theo máy đang chạy)
//   ?theme=system: bỏ ép, về theo máy (theme mặc định cho máy sáng hoặc máy tối)
//   theme.set('<tên>') · theme.toggle(): đổi giữa theme mặc định sáng và tối · theme.get() · theme.list() · theme.mode()
//   Người dùng tự chọn thì nhớ cả khi mở lại.
// Dự án chưa có themes.css (trước sketch-to-site v4.2): tên theme vẫn là "light" và "dark" như trước.
(() => {
  const KEY = 'proto-theme'; // đổi "proto" thành slug của dự án, giống KEY của store.js
  const root = document.documentElement;
  const NAME = /^[a-z0-9-]+$/;
  const apply = t => { if (t && t !== 'system' && NAME.test(t)) root.dataset.theme = t; else delete root.dataset.theme; };
  const asked = new URLSearchParams(location.search).get('theme');
  let t = null;
  try {
    if (asked && asked !== 'system' && NAME.test(asked)) sessionStorage.setItem(KEY, asked);
    if (asked === 'system') { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); }
    t = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
  } catch { t = asked; } // storage bị chặn: chỉ theo tham số của lần mở này
  apply(t);
  // Đọc biến của themes.css lúc gọi hàm: lúc file này chạy, CSS chưa nạp
  const css = k => getComputedStyle(root).getPropertyValue(k).trim().replace(/^["']|["']$/g, '');
  const dark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  const list = () => css('--theme-list').split(/\s+/).filter(Boolean);
  const get = () => root.dataset.theme || css('--theme-name') || (dark() ? 'dark' : 'light');
  const mode = () => css('--theme-mode') || (get() === 'dark' ? 'dark' : 'light');
  const set = next => {
    try { sessionStorage.removeItem(KEY); localStorage.setItem(KEY, next); } catch {}
    apply(next);
  };
  // Có themes.css mà không khai default.dark (sản phẩm chỉ có theme sáng): ở lại theme mặc định sáng, không đặt "dark" không có thật
  const toggle = () => {
    const light = css('--theme-default-light') || 'light';
    set(mode() === 'dark' ? light : (css('--theme-default-dark') || (list().length ? light : 'dark')));
  };
  window.theme = { get, set, toggle, list, mode };
})();
