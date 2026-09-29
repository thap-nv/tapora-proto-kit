// Khung app mobile: nền tảng iOS/Android, khung máy, thanh trạng thái giả, thanh tab, quay lại, bottom sheet, toast.
// Mẫu từ sketch-to-site/templates/mobile/app.js. Chép vào site/assets/app.js, đi kèm app.css.
// Nạp trong <head>, KHÔNG defer: nền tảng và khung phải được gắn trước khi trang vẽ, để không nháy giao diện sai.
(() => {
  const root = document.documentElement;
  const session = (k, v) => { try { return v === undefined ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch { return null; } };

  // Nền tảng: ?platform=android trên URL > lựa chọn đã nhớ trong phiên (link sang màn khác không mang theo tham số) > <html data-platform> > ios
  const asked = new URLSearchParams(location.search).get('platform');
  if (asked === 'ios' || asked === 'android') session('app-platform', asked);
  const kept = session('app-platform');
  root.dataset.platform = kept === 'ios' || kept === 'android' ? kept : (root.dataset.platform || 'ios');

  // Khung: nằm trong trang tổng quan → "embed" (trang tổng quan vẽ vỏ máy); màn rộng → "frame"; điện thoại thật → không gắn
  const wide = matchMedia('(min-width: 600px)');
  const setDevice = () => {
    if (window.self !== window.top) root.dataset.device = 'embed';
    else if (wide.matches) root.dataset.device = 'frame';
    else delete root.dataset.device;
  };
  setDevice();
  wide.addEventListener('change', setDevice);

  // Hướng chuyển màn do lần bấm trước để lại: push khi vào sâu, pop khi quay lại
  const enter = session('app-enter');
  if (enter) { root.dataset.enter = enter; session('app-enter', ''); }

  // Ngăn xếp màn đã đi qua trong phiên: nút quay lại về đúng màn trước, kể cả khi một màn có nhiều lối vào
  const stack = () => { try { return JSON.parse(session('app-stack')) || []; } catch { return []; } };
  const setStack = s => session('app-stack', JSON.stringify(s.slice(-20)));

  const icon = d => `<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">${d}</svg>`;
  const SIGNAL = icon('<rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/>');
  const WIFI = icon('<path d="M9 2.4c2.6 0 5 1 6.8 2.7l1.2-1.3A11.6 11.6 0 0 0 9 .6 11.6 11.6 0 0 0 1 3.8l1.2 1.3A9.8 9.8 0 0 1 9 2.4Zm0 3.6c1.6 0 3.1.6 4.2 1.7l1.3-1.3A7.8 7.8 0 0 0 9 4.2c-2.1 0-4 .8-5.5 2.2l1.3 1.3A6 6 0 0 1 9 6Zm0 3.6c.6 0 1.2.2 1.6.7L9 12l-1.6-1.7c.4-.5 1-.7 1.6-.7Z"/>');
  const BATTERY = '<svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg>';
  // Giờ đứng yên ở 9:41: ảnh chụp và bộ kiểm không đổi giữa các lần chạy
  const STATUS = `<div class="app-status" aria-hidden="true"><span>9:41</span><span class="app-status-icons">${SIGNAL}${WIFI}${BATTERY}</span></div>`;

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocus = null;
  const openSheet = (sheet, from) => {
    if (!sheet) return;
    lastFocus = from || document.activeElement;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    const first = sheet.querySelector(FOCUSABLE);
    setTimeout(() => (first || sheet).focus({ preventScroll: true }), 60);
  };
  const closeSheet = sheet => {
    if (!sheet || !sheet.classList.contains('is-open')) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  const toast = msg => {
    const app = document.querySelector('.app');
    if (!app) return;
    let t = app.querySelector('.app-toast');
    if (!t) { t = document.createElement('div'); t.className = 'app-toast'; t.setAttribute('role', 'status'); app.appendChild(t); }
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(t.hideTimer);
    t.hideTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (a && !a.target && !/^(?:[a-z]+:|#)/i.test(a.getAttribute('href'))) {
      if (a.hasAttribute('data-back')) {
        const s = stack(), prev = s.pop();
        setStack(s);
        session('app-enter', 'pop');
        if (prev) { e.preventDefault(); location.href = prev; }
      } else if (a.closest('.app-tabs')) {
        setStack([]);                              // đổi tab là về gốc của tab đó, không trượt
      } else {
        setStack([...stack(), location.href.split('#')[0]]);
        session('app-enter', 'push');
      }
    }
    const opener = e.target.closest('[data-sheet-open]');
    if (opener) openSheet(document.getElementById(opener.dataset.sheetOpen), opener);
    const closer = e.target.closest('[data-sheet-close]');
    if (closer) closeSheet(closer.closest('.app-sheet'));
    if (e.target.classList && e.target.classList.contains('app-sheet')) closeSheet(e.target);   // bấm nền mờ
  });

  document.addEventListener('keydown', e => {
    const sheet = document.querySelector('.app-sheet.is-open');
    if (!sheet) return;
    if (e.key === 'Escape') closeSheet(sheet);
    if (e.key === 'Tab') {                         // giữ focus trong sheet đang mở
      const f = [...sheet.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  const ready = () => {
    const app = document.querySelector('.app');
    if (!app) return;
    if (!app.querySelector('.app-status')) app.insertAdjacentHTML('afterbegin', STATUS);
    app.querySelectorAll('.app-sheet').forEach(s => { if (!s.classList.contains('is-open')) s.setAttribute('aria-hidden', 'true'); });
    // Tab đang chọn: <body data-tab="…"> khớp <a data-tab="…"> trong .app-tabs; icon chuyển sang bản đặc
    const tab = document.body.dataset.tab;
    app.querySelectorAll('.app-tabs [data-tab]').forEach(t => {
      if (t.dataset.tab !== tab) return;
      t.setAttribute('aria-current', 'page');
      t.querySelectorAll('i.ph').forEach(i => i.classList.replace('ph', 'ph-fill'));
    });
    // Tiêu đề lớn cuộn khuất thì hiện tiêu đề nhỏ trên thanh điều hướng
    const big = app.querySelector('.app-large-title'), nav = app.querySelector('.app-nav'), body = app.querySelector('.app-body');
    if (big && nav && body) {
      nav.classList.add('has-large');
      new IntersectionObserver(([en]) => nav.classList.toggle('is-collapsed', !en.isIntersecting), { root: body }).observe(big);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  // Chuyển màn bằng code (sau khi thêm giỏ, đặt đơn…): giữ ngăn xếp và hiệu ứng như bấm link.
  // reset: true khi bắt đầu lại một nhánh, ví dụ đặt đơn xong mở màn theo dõi đơn: quay lại sẽ về href của nút quay lại, không về giỏ
  const go = (href, { reset = false } = {}) => {
    setStack(reset ? [] : [...stack(), location.href.split('#')[0]]);
    session('app-enter', 'push');
    location.href = href;
  };

  window.app = {
    platform: root.dataset.platform,
    go,
    toast,
    openSheet: id => openSheet(document.getElementById(id)),
    closeSheet: id => closeSheet(document.getElementById(id)),
  };
})();
