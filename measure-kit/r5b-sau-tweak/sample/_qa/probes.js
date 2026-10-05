// Phép đo chạy trong trang cho run.mjs của bộ kiểm. Cần window.ColorKit (color.js) nạp trước.
// Mẫu từ sketch-to-site/templates/qa-kit/probes.js; qa_init.py chép vào _qa/. Sửa bản trong skill rồi chạy qa_init.py --update.
//   __qa.contrast()   chữ dưới ngưỡng WCAG AA, đo trên nền thật: trộn các lớp nền trong suốt, lấy mẫu dải chuyển, theo lớp nằm dưới chữ
//                     (cả lớp anh em như dải màu đầu app). Đo cả placeholder của ô nhập đang trống.
//   __qa.intent()     nút nhãn nguy hiểm tô màu chính · nút đồng ý tô màu nguy hiểm · cùng nhãn nguy hiểm mà hai màu
//   __qa.contrastOf() một control và chữ bên trong (lượt kiểm sâu dùng khi hover và focus)
// Bỏ qua khi đo tương phản: phần tử ẩn, aria-hidden, inert, bị khoá (disabled, aria-disabled: WCAG miễn), svg, hộp 1px (.sr-only),
// chữ trong suốt (chữ gradient background-clip:text, -webkit-text-fill-color trong suốt), phần tử đang chạy chuyển động hữu hạn (toast đang mờ dần).
// Điểm đo nằm trên ảnh, video, canvas hay ảnh nền (ở bất kỳ lớp nền nào): bỏ điểm đó, không đoán màu.
// Chữ ngoài khung nhìn mà tổ tiên có lớp absolute/fixed phủ điểm đo: không biết lớp nằm dưới, bỏ điểm đó.
// data-contrast-bg="<selector>": chữ nằm trên một lớp mà trình duyệt không trả về ở điểm đó (lớp pointer-events:none).
// Đo trên nền của lớp đó; chữ vẫn được đo, không phải cách làm im.
(function () {
  if (window.__qa) return;
  const C = window.ColorKit;
  const MAX = 12;
  const SKIP = 'svg, script, style, template, noscript, [aria-hidden="true"], [inert], :disabled, [aria-disabled="true"], [data-demo-state="disabled"]';
  const cs = e => getComputedStyle(e);
  const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '')
    + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const ownText = e => { let t = ''; for (const n of e.childNodes) if (n.nodeType === 3) t += n.nodeValue; return t.replace(/\s+/g, ' ').trim(); };
  const label = e => (e.getAttribute('aria-label') || e.textContent || e.value || '').normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

  // Selector duy nhất để lượt kiểm sâu tìm lại phần tử sau khi tải lại trang
  function sel(e) {
    if (e.id && document.querySelectorAll('#' + CSS.escape(e.id)).length === 1) return '#' + CSS.escape(e.id);
    const parts = [];
    for (let n = e; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) {
      let i = 1;
      for (let s = n.previousElementSibling; s; s = s.previousElementSibling) if (s.tagName === n.tagName) i++;
      parts.unshift(`${n.tagName.toLowerCase()}:nth-of-type(${i})`);
    }
    return 'html > ' + parts.join(' > ');
  }

  // Ẩn: display none, visibility, hộp 1px; và phần không được vẽ dù hộp khác 0 (nội dung <details> đang đóng,
  // hidden="until-found", content-visibility:hidden): checkVisibility của trình duyệt biết
  function hidden(e) {
    const s = cs(e);
    if (s.display === 'none' || s.visibility !== 'visible') return true;
    if (e.checkVisibility && !e.checkVisibility({ visibilityProperty: true })) return true;
    const r = e.getBoundingClientRect();
    return r.width < 2 || r.height < 2;
  }

  function opacity(e) { let o = 1; for (let p = e; p && p.nodeType === 1; p = p.parentElement) o *= +cs(p).opacity; return o; }

  // Tách tham số cấp ngoài cùng: "90deg, rgb(1, 2, 3) 0%, oklch(…) 100%"
  function split(s) {
    const out = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  // Màu của dải chuyển tại điểm (x, y). Dải thẳng: nội suy theo góc; radial, conic: trung bình các điểm dừng
  function gradientAt(layer, r, x, y) {
    const m = /^(?:repeating-)?(linear|radial|conic)-gradient\((.*)\)$/.exec(layer);
    if (!m) return null;
    const parts = split(m[2]);
    let ang = 180;
    const TO = { top: 0, right: 90, bottom: 180, left: 270, 'top right': 45, 'right top': 45, 'bottom right': 135, 'right bottom': 135,
      'bottom left': 225, 'left bottom': 225, 'top left': 315, 'left top': 315 };
    const deg = /^(-?[\d.]+)deg$/.exec(parts[0]), to = /^to\s+(.+)$/.exec(parts[0]);
    if (deg) { ang = +deg[1]; parts.shift(); }
    else if (to) { ang = TO[to[1].trim()] ?? 180; parts.shift(); }
    else if (m[1] !== 'linear' && !C.parse(parts[0].replace(/\s+-?[\d.]+%.*$/, ''))) parts.shift(); // "circle at top", "from 90deg"
    const stops = parts.map(p => {
      const pm = /^(.*?)\s+(-?[\d.]+)%(?:\s+-?[\d.]+%)?$/.exec(p);
      const c = C.parse(pm ? pm[1] : p);
      return c && { c, at: pm ? +pm[2] / 100 : null };
    }).filter(Boolean);
    if (!stops.length) return null;
    if (stops.length === 1) return stops[0].c;
    stops.forEach((s, i) => { if (s.at === null) s.at = i / (stops.length - 1); });
    if (m[1] !== 'linear') return [0, 1, 2, 3].map(k => stops.reduce((a, s) => a + s.c[k], 0) / stops.length);
    const a = ang * Math.PI / 180, W = r.width, H = r.height, L = Math.abs(W * Math.sin(a)) + Math.abs(H * Math.cos(a)) || 1;
    const t = Math.max(0, Math.min(1, ((x - r.left - W / 2) * Math.sin(a) - (y - r.top - H / 2) * Math.cos(a)) / L + 0.5));
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i].at) {
        const p = stops[i - 1], q = stops[i], u = q.at > p.at ? (t - p.at) / (q.at - p.at) : 0;
        return [0, 1, 2, 3].map(k => p.c[k] + (q.c[k] - p.c[k]) * u);
      }
    }
    return stops[stops.length - 1].c;
  }

  // Các lớp dưới điểm (x, y), từ trên xuống: theo thứ tự vẽ của elementsFromPoint (có cả lớp anh em nằm dưới).
  // Chữ nằm ngoài khung nhìn hay chính nó không nhận chuột: đi theo tổ tiên (danh sách gắn cờ chain).
  // Không cuộn trang để đưa chữ vào khung nhìn: phép đo không được đổi trạng thái của trang
  function layers(e, x, y) {
    const hint = e.closest('[data-contrast-bg]');
    if (hint) { const t = document.querySelector(hint.getAttribute('data-contrast-bg')); if (t) return [e, t]; }
    const inView = x >= 0 && y >= 0 && x < innerWidth && y < innerHeight;
    const list = inView ? document.elementsFromPoint(x, y) : [];
    const i = list.indexOf(e);
    if (i >= 0) return list.slice(i);
    const chain = [];
    for (let p = e; p && p.nodeType === 1; p = p.parentElement) chain.push(p);
    chain.chain = true;
    return chain;
  }

  // Đi theo tổ tiên thì không thấy lớp anh em: tổ tiên n có con absolute/fixed (không chứa chữ) phủ điểm (x, y)
  // thì không biết chữ nằm trên lớp nào (dải màu "absolute inset-0 -z-10" dưới màn đầu): bỏ điểm, như điểm trên ảnh
  function siblingLayer(n, e, x, y) {
    for (const c of n.children) {
      if (c.contains(e) || !/^(absolute|fixed)$/.test(cs(c).position) || hidden(c)) continue;
      const r = c.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
    return false;
  }

  // Nền dưới điểm: { color } hoặc { img: true } khi dưới chữ là ảnh, hay không biết lớp nằm dưới
  function bgAt(e, x, y) {
    const above = [];
    const done = base => { let c = base; for (let i = above.length - 1; i >= 0; i--) c = C.over(above[i], c); return { color: c }; };
    const list = layers(e, x, y);
    for (const n of list) {
      if (n !== e && /^(IMG|VIDEO|CANVAS|PICTURE|IFRAME|OBJECT|EMBED)$/.test(n.tagName)) return { img: true };
      if (list.chain && n !== e && siblingLayer(n, e, x, y)) return { img: true };
      const s = cs(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') {
        // Ảnh ở bất kỳ lớp nền nào (lớp phủ gradient trong suốt trên ảnh chụp): bỏ điểm
        if (/url\(|image-set\(/.test(s.backgroundImage)) return { img: true };
        const layer = split(s.backgroundImage)[0];
        const g = gradientAt(layer, n.getBoundingClientRect(), x, y);
        if (g && g[3] >= 0.999) return done(g);
        if (g) above.push(g);
      }
      const c = C.parse(s.backgroundColor);
      if (c && c[3] > 0) { if (c[3] >= 0.999) return done(c); above.push(c); }
    }
    return done([255, 255, 255, 1]);
  }

  function textBox(e) {
    const range = document.createRange();
    let box = null;
    for (const n of e.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) {
        if (!q.width || !q.height) continue;
        box = box ? { left: Math.min(box.left, q.left), right: Math.max(box.right, q.right), top: Math.min(box.top, q.top), bottom: Math.max(box.bottom, q.bottom) }
          : { left: q.left, right: q.right, top: q.top, bottom: q.bottom };
      }
    }
    return box;
  }

  // Phần tử đang chạy chuyển động hữu hạn (toast đang mờ dần, panel đang trượt): đo lúc này là đo màu giữa chừng.
  // Tính một lần cho mỗi lượt đo; chuyển động lặp vô hạn (spinner) không tính
  function moving() {
    const out = [];
    for (const a of document.getAnimations ? document.getAnimations() : []) {
      if (a.playState !== 'running' || !a.effect || !a.effect.target) continue;
      if (a.effect.getComputedTiming().iterations === Infinity) continue;
      out.push(a.effect.target);
    }
    return out;
  }

  // Chữ trong suốt (chữ gradient: background-clip:text với chữ trong suốt, chữ viền -webkit-text-fill-color:transparent):
  // màu nhìn thấy là nền hay viền của chính chữ, không phải color. Không đo
  function clearFill(s) {
    const a = v => { const c = C.parse(v); return !!c && c[3] === 0; };
    return a(s.color) || a(s.getPropertyValue('-webkit-text-fill-color'))
      || /\btext\b/.test(s.getPropertyValue('background-clip') + ' ' + s.getPropertyValue('-webkit-background-clip'));
  }

  // Một phần tử có chữ: '' khi đạt hoặc không đo được, dòng lỗi khi dưới ngưỡng. busy: kết quả moving() của lượt đo
  function measureOne(e, busy) {
    if (e.closest(SKIP) || hidden(e)) return '';
    const field = /^(INPUT|TEXTAREA)$/.test(e.tagName) && e.placeholder && !e.value;
    const txt = field ? e.placeholder.trim() : ownText(e);
    if (!txt) return '';
    if (busy && busy.some(t => t.contains(e))) return '';
    const op = opacity(e);
    if (op < 0.01) return '';
    const s = cs(e);
    if (!field && clearFill(s)) return '';
    const fg0 = C.parse(field ? getComputedStyle(e, '::placeholder').color : s.color);
    if (!fg0 || fg0[3] === 0) return '';
    const fg = fg0.slice(0, 3).concat(fg0[3] * op);
    const box = field ? e.getBoundingClientRect() : textBox(e);
    if (!box) return '';
    const need = C.needFor(parseFloat(s.fontSize), parseInt(s.fontWeight, 10) || 400);
    const y = (box.top + box.bottom) / 2;
    let worst = Infinity, wb = null;
    for (const x of [box.left + 2, (box.left + box.right) / 2, box.right - 2]) {
      const b = bgAt(e, x, y);
      if (b.img) continue;
      const f = fg[3] < 1 ? C.over(fg, b.color) : fg;
      const r = C.contrast(f, b.color);
      if (r < worst) { worst = r; wb = b.color; }
    }
    if (worst === Infinity || worst >= need) return '';
    return `${name(e)}${field ? ' placeholder' : ''} "${txt.slice(0, 24)}" ${worst.toFixed(2)}<${need} (${C.toHex(C.over(fg, wb))} trên ${C.toHex(wb)})`;
  }

  function contrast(rootSel) {
    const scope = rootSel ? document.querySelector(rootSel) : document.body;
    const out = [];
    if (!scope) return out;
    const busy = moving();
    for (const e of scope.querySelectorAll('*')) {
      if (out.length >= MAX) break;
      const r = measureOne(e, busy);
      if (r) out.push(r);
    }
    return out;
  }

  function contrastOf(s) {
    const e = document.querySelector(s);
    if (!e) return '';
    const busy = moving();
    for (const x of [e, ...e.querySelectorAll('*')]) { const r = measureOne(x, busy); if (r) return r; }
    return '';
  }

  // Nhãn nguy hiểm: xoá, gỡ, thu hồi, từ chối, vô hiệu hoá, chấm dứt, khoá tài khoản, đặt lại, khôi phục mặc định, "huỷ <việc gì>".
  // "Đặt lại" chỉ tính khi có đối tượng theo sau (đặt lại dữ liệu, cài đặt, mặc định, tất cả, toàn bộ, biểu mẫu): "Đặt lại" trơn
  // thường là đặt hàng lại. "Huỷ", "Huỷ bỏ", "Đóng" của hộp thoại là thoát ra, không phải hành động nguy hiểm. Nhãn đồng ý: lưu,
  // xác nhận, đồng ý, tiếp tục, gửi, duyệt, thanh toán, đặt, tạo, thêm. Danh sách chép ở qa-gate.md mục 2: sửa ở đây thì sửa cả ở đó
  const DESTRUCTIVE = /^(?:xoá|xóa|gỡ|thu hồi|từ chối|vô hiệu hoá|vô hiệu hóa|chấm dứt|khoá tài khoản|khóa tài khoản|khôi phục mặc định|delete|remove|revoke|reset|unsubscribe|close account)(?=\s|$)|^đặt lại\s+\S|^(?:huỷ|hủy)\s+(?!bỏ$)\S|^cancel\s+(?:subscription|order|plan|account|booking)/;
  const AFFIRM = /^(?:lưu|xác nhận|đồng ý|tiếp tục|gửi|duyệt|thanh toán|đặt(?!\s+lại$)|tạo|thêm|save|confirm|continue|submit|approve|create|add)(?=\s|$)/;
  // Không làm mất dữ liệu nên không tính là nguy hiểm: xoá hay đặt lại thứ tạm thời (bộ lọc, ô tìm kiếm, lựa chọn);
  // đặt lại mật khẩu; đặt lại đơn, lịch, món, vé… (đặt hàng, đặt lịch lại)
  const HARMLESS = /^(?:xoá|xóa|đặt lại)\s+(?:tất cả\s+)?(?:bộ lọc|lọc|tìm kiếm|từ khoá|từ khóa|lựa chọn|chọn)(?=\s|$)|^(?:clear|reset)\s+(?:all\s+)?(?:filters?|search|selection)|^đặt lại\s+(?:mật khẩu|đơn|lịch hẹn|lịch|món|hàng|vé|bàn|phòng)(?=\s|$)|^reset\s+password/;
  // Màu nhấn của control: nền đặc, không thì viền, không thì chữ; màu gần xám (độ bão hoà < 0,06) không tính
  function accent(e) {
    const s = cs(e);
    for (const [v, fill] of [[s.backgroundColor, true], [parseFloat(s.borderTopWidth) >= 1 ? s.borderTopColor : '', false], [s.color, false]]) {
      const c = C.parse(v);
      if (!c || c[3] < 0.5) continue;
      const [, ch, h] = C.toOklch(c);
      if (ch >= 0.06) return { c, h, fill };
    }
    return null;
  }

  function intent() {
    const rs = cs(document.documentElement);
    const tok = k => C.parse(rs.getPropertyValue(k).trim());
    const prim = ['--primary', '--primary-hover'].map(tok).filter(Boolean);
    const dang = ['--destructive', '--destructive-hover', '--danger-text', '--danger'].map(tok).filter(Boolean);
    const near = (c, list) => list.length ? Math.min(...list.map(x => C.deltaE(c, x))) : Infinity;
    const out = [], seen = new Map();
    for (const e of document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"], a[href]')) {
      if (out.length >= MAX) break;
      if (hidden(e) || e.closest('[aria-hidden="true"], [inert], :disabled, [data-demo-state]')) continue;
      const l = label(e);
      if (!l) continue;
      const bad = DESTRUCTIVE.test(l) && !HARMLESS.test(l), good = !bad && !HARMLESS.test(l) && AFFIRM.test(l);
      if (!bad && !good) continue;
      const a = accent(e);
      if (!a) continue;
      const dp = near(a.c, prim), dd = near(a.c, dang);
      const tag = `${name(e)} "${l.slice(0, 24)}"`;
      if (bad) {
        // Có token thì so với token; trang chưa có token: nền đặc ngoài dải đỏ (sắc độ OKLCH 0–45, 345–360) là sai ý định
        const wrong = prim.length ? dp < 0.08 && dp < dd : a.fill && !(a.h <= 45 || a.h >= 345);
        if (wrong) out.push(`${tag}: nhãn nguy hiểm mà tô màu chính (${C.toHex(a.c)})`);
        const prev = seen.get(l);
        if (prev && C.deltaE(prev, a.c) > 0.15) out.push(`${tag}: cùng nhãn nguy hiểm mà hai màu khác nhau (${C.toHex(prev)}, ${C.toHex(a.c)})`);
        if (!prev) seen.set(l, a.c);
      } else if (dang.length && dd < 0.08 && dd < dp) out.push(`${tag}: nhãn đồng ý mà tô màu nguy hiểm (${C.toHex(a.c)})`);
    }
    return out;
  }

  // ---- Lượt kiểm sâu (deep.mjs) ----
  const OFF = '[aria-hidden="true"], [inert], :disabled, [aria-disabled="true"], [data-demo-state]';
  const INTERACTIVE = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role="button"], [role="tab"], [role="switch"], '
    + '[role="checkbox"], [role="radio"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [tabindex="0"]';
  const STATE_ATTRS = ['aria-pressed', 'aria-expanded', 'aria-checked', 'aria-selected', 'aria-sort'];
  const onScreenX = e => { const r = e.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; };
  const stateOf = e => STATE_ATTRS.map(a => e.getAttribute(a)).join('|') + (e.checked === undefined ? '' : '|' + e.checked);

  // Control để đo tương phản khi hover và focus
  function targets(n) {
    const out = [];
    for (const e of document.querySelectorAll(INTERACTIVE)) {
      if (out.length >= n) break;
      if (hidden(e) || e.closest(OFF) || !onScreenX(e)) continue;
      out.push({ sel: sel(e), name: name(e) });
    }
    return out;
  }

  // Control phải nằm trong vòng Tab. Hộp thoại modal đang mở: chỉ xét bên trong (khoá focus là đúng).
  // Nhóm radio: chỉ mục đang chọn, hoặc mục đầu khi chưa chọn mục nào
  function tabbables() {
    const modal = [...document.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]')]
      .find(d => !hidden(d) && (d.tagName !== 'DIALOG' || d.matches(':modal')));
    const scope = modal || document;
    const groups = new Set(), out = [];
    for (const e of scope.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, iframe, [tabindex], [contenteditable=""], [contenteditable="true"]')) {
      if (e.tabIndex < 0 || hidden(e) || e.closest(OFF)) continue;
      if (e.type === 'radio' && e.name) {
        const checked = scope.querySelector(`input[type=radio][name="${CSS.escape(e.name)}"]:checked`);
        if (checked ? checked !== e : groups.has(e.name)) continue;
        groups.add(e.name);
      }
      out.push(e);
    }
    return out;
  }

  // Sau mỗi phím Tab: đánh dấu control đang focus; true khi quay về control đã gặp (đi hết một vòng).
  // Focus vào iframe thì Tab còn đi trong trang con: không coi là quay vòng
  function markActive() {
    const a = document.activeElement;
    if (!a || a === document.body) return false;
    if (a.tagName === 'IFRAME') { a.setAttribute('data-qa-seen', ''); return false; }
    if (a.hasAttribute('data-qa-seen')) return true;
    a.setAttribute('data-qa-seen', '');
    return false;
  }
  const unreached = () => tabbables().filter(e => !e.hasAttribute('data-qa-seen')).slice(0, MAX).map(e => `${name(e)} "${label(e).slice(0, 24)}"`);

  // Widget nhiều mục đi bằng phím mũi tên. roving: có mục tabindex="-1" hoặc dùng aria-activedescendant, tức widget hứa phím mũi tên
  const COMPOSITE = { tablist: '[role="tab"]', menu: '[role^="menuitem"]', menubar: '[role^="menuitem"]', listbox: '[role="option"]',
    radiogroup: '[role="radio"]', tree: '[role="treeitem"]', toolbar: 'button, [role="button"], a[href]' };
  const compItems = c => [...c.querySelectorAll(COMPOSITE[c.getAttribute('role')])].filter(x => !hidden(x) && !x.closest(OFF));
  function composites() {
    const out = [];
    for (const c of document.querySelectorAll(Object.keys(COMPOSITE).map(r => `[role="${r}"]`).join(', '))) {
      if (hidden(c) || c.closest(OFF)) continue;
      const items = compItems(c);
      if (items.length < 2) continue;
      const owner = c.id && document.querySelector(`[aria-controls~="${CSS.escape(c.id)}"], [aria-owns~="${CSS.escape(c.id)}"]`);
      const way = c.tabIndex >= 0 || items.some(x => x.tabIndex >= 0) || !!(owner && owner.tabIndex >= 0);
      const roving = items.some(x => x.getAttribute('tabindex') === '-1') || c.hasAttribute('aria-activedescendant');
      out.push({ sel: sel(c), name: `${name(c)} "${label(c).slice(0, 24)}" (${c.getAttribute('role')})`, orphan: !way, roving });
    }
    return out;
  }
  function compositeState(s) {
    const c = document.querySelector(s);
    if (!c) return null;
    const items = compItems(c);
    const pick = a => items.findIndex(x => x.getAttribute(a) === 'true');
    return JSON.stringify([items.indexOf(document.activeElement), c.getAttribute('aria-activedescendant'), pick('aria-selected'), pick('aria-checked')]);
  }
  function enterComposite(s) {
    const c = document.querySelector(s);
    if (!c) return null;
    const items = compItems(c);
    if (c.tabIndex >= 0 && c.hasAttribute('aria-activedescendant')) c.focus();
    else (items.find(x => x.tabIndex === 0) || items.find(x => x.getAttribute('aria-selected') === 'true') || items[0]).focus();
    return compositeState(s);
  }

  // Control tự dựng (không phải button, input…) mang trạng thái và nằm trong vòng Tab: Enter hoặc Space phải đổi trạng thái
  function customStateful(n) {
    const out = [];
    for (const e of document.querySelectorAll(STATE_ATTRS.map(a => `[${a}]`).join(', '))) {
      if (out.length >= n) break;
      if (e.matches('button, a[href], input, select, textarea, summary') || e.tabIndex < 0 || hidden(e) || e.closest(OFF)) continue;
      if (e.getAttribute('aria-selected') === 'true') continue; // tab, mục đang chọn: Enter không đổi gì là đúng
      out.push({ sel: sel(e), name: `${name(e)} "${label(e).slice(0, 24)}"` });
    }
    return out;
  }
  function focusState(s, keep) {
    const e = document.querySelector(s);
    if (!e) return null;
    if (!keep) e.focus();
    return stateOf(e);
  }

  // Control hứa trạng thái: bấm thật phải đổi thứ gì đó. Bỏ tab và mục radio đang chọn: bấm lại mục đang chọn không đổi là đúng
  function stateful(n) {
    const q = STATE_ATTRS.map(a => `[${a}]`).concat(['[role="switch"]', '[role="tab"]', '[role="option"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]']).join(', ');
    const out = [];
    for (const e of document.querySelectorAll(q)) {
      if (out.length >= n) break;
      if (e.matches('input, select, textarea') || hidden(e) || e.closest(OFF) || !onScreenX(e)) continue;
      if (e.getAttribute('aria-selected') === 'true' || (e.getAttribute('aria-checked') === 'true' && /radio/.test(e.getAttribute('role') || ''))) continue;
      out.push({ sel: sel(e), name: `${name(e)} "${label(e).slice(0, 24)}"`, state: STATE_ATTRS.filter(a => e.hasAttribute(a)).join(',') || e.getAttribute('role') });
    }
    return out;
  }

  // Ảnh chụp trạng thái để so trước và sau khi bấm: thuộc tính trạng thái của control, kiểu dáng của nó (cả ::before, ::after)
  // và 20 phần tử con, số thay đổi DOM từ lần chụp trước, focus đi đâu (focus vào chính control khi bấm không tính).
  // Phần tử con còn tính class, nội dung ::before (icon font như Phosphor: ph-eye đổi thành ph-eye-slash),
  // href của <use> và d của <path> (icon SVG đổi hình)
  const iconOf = x => [typeof x.className === 'string' ? x.className : (x.className && x.className.baseVal) || '',
    getComputedStyle(x, '::before').content,
    x.localName === 'use' ? x.getAttribute('href') || x.getAttribute('xlink:href') || '' : '',
    x.localName === 'path' ? x.getAttribute('d') || '' : ''].join(';');
  function snap(s) {
    const e = document.querySelector(s);
    if (!e) return null;
    if (!window.__qaMut) {
      window.__qaMut = { n: 0 };
      new MutationObserver(l => { window.__qaMut.n += l.length; }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    }
    const mut = window.__qaMut.n;
    window.__qaMut.n = 0;
    const look = [e, ...e.querySelectorAll('*')].slice(0, 20).map(x => {
      const y = cs(x);
      return [y.color, y.backgroundColor, y.borderColor, y.boxShadow, y.outlineStyle, y.outlineColor, y.opacity, y.transform, y.fontWeight,
        y.textDecorationLine, y.visibility, y.display, y.fill, y.stroke, x.textContent.length].join(';') + (x === e ? '' : ';' + iconOf(x));
    }).join('/') + ['::before', '::after'].map(p => { const y = getComputedStyle(e, p); return [y.content, y.transform, y.backgroundColor, y.left, y.opacity].join(';'); }).join('/');
    const a = document.activeElement;
    return { own: stateOf(e), look, mut, focus: a && a !== document.body && !e.contains(a) ? sel(a) : '' };
  }

  window.__qa = { SKIP, name, sel, label, hidden, contrast, contrastOf, intent,
    targets, tabbables, markActive, unreached, composites, compositeState, enterComposite, customStateful, focusState, stateful, snap };
})();
