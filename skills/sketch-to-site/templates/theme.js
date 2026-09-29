// Nền sáng hoặc tối cho mọi trang của prototype. Mặc định theo máy (prefers-color-scheme, token ở rules-and-conflicts.md D.2).
// Mẫu từ sketch-to-site/templates/theme.js. Chép vào site/assets/theme.js, nạp trong <head> của mọi trang, trước CSS vẽ và không defer,
// để không nháy nền sai: <script src="assets/theme.js"></script>
//   ?theme=light hoặc ?theme=dark: ép một nền cho cả phiên của tab (demo; bộ kiểm dùng để ảnh không đi theo máy đang chạy)
//   ?theme=system: bỏ ép, về theo máy
//   nút đổi nền: theme.toggle(); người dùng tự chọn thì nhớ cả khi mở lại
(() => {
  const KEY = 'proto-theme'; // đổi "proto" thành slug của dự án, giống KEY của store.js
  const root = document.documentElement;
  const apply = t => { if (t === 'light' || t === 'dark') root.dataset.theme = t; else delete root.dataset.theme; };
  const asked = new URLSearchParams(location.search).get('theme');
  let t = null;
  try {
    if (asked === 'light' || asked === 'dark') sessionStorage.setItem(KEY, asked);
    if (asked === 'system') { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); }
    t = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
  } catch { t = asked; } // storage bị chặn: chỉ theo tham số của lần mở này
  apply(t);
  const get = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const set = next => {
    try { sessionStorage.removeItem(KEY); localStorage.setItem(KEY, next); } catch {}
    apply(next);
  };
  window.theme = { get, set, toggle: () => set(get() === 'dark' ? 'light' : 'dark') };
})();
