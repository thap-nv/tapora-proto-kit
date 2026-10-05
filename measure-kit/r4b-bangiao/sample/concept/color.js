// Lõi màu dùng chung của kit: đọc màu CSS, trộn lớp trong suốt, đo tương phản WCAG, sinh vai dẫn xuất của một theme.
// Mẫu từ sketch-to-site/templates/color.js. Chạy trong trình duyệt (window.ColorKit) và trong Node (require).
// Dùng ở: sketch-to-concept/templates/tokens.js (bảng concept) · scripts/themes.mjs (sinh themes.css) ·
// templates/system.html (trang design system) · templates/qa-kit/probes.js (đo trên trang thật).
// SEEDS, DERIVED, PAIRS là hợp đồng chung: đổi thì đổi cả rules-and-conflicts.md D.2 và khuôn DESIGN.md mục 2.
(function (root) {
  const clamp01 = v => Math.min(1, Math.max(0, v));
  // Vượt ngưỡng chưa tới 0,3 là "sát ngưỡng": một lớp phủ hay một bước hover là rớt
  const NEAR = 0.3;
  const NAMED = { transparent: [0, 0, 0, 0], white: [255, 255, 255, 1], black: [0, 0, 0, 1] };
  const num = (s, scale) => { s = String(s).trim(); return s.endsWith('%') ? parseFloat(s) / 100 * scale : parseFloat(s); };
  const encode = x => 255 * clamp01(x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  const decode = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };

  function parseHex(s) {
    const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s);
    if (!m) return null;
    let h = m[1];
    if (h.length <= 4) h = h.replace(/./g, c => c + c);
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).concat(h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1);
  }

  // Tham số của hàm màu, cả hai cú pháp: "0.5 0.1 40 / .5" và "12, 34, 56, .5"
  function args(body) {
    const [main, alpha] = body.split('/');
    const p = main.trim().split(/[\s,]+/).filter(Boolean);
    if (alpha !== undefined) p.push(alpha.trim());
    return p;
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return [0, 8, 4].map(n => 255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  }

  // OKLab → sRGB tuyến tính (Björn Ottosson)
  function linFromOklab(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }

  function rgbToOklab(rgb) {
    const [R, G, B] = rgb.slice(0, 3).map(decode);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }

  let ctx = null;
  // Dạng màu công thức không đọc (color-mix, display-p3, tên màu khác): trình duyệt đổi giúp qua canvas. Trong Node thì trả null
  function canvasParse(s) {
    if (typeof document === 'undefined') return null;
    if (!ctx) { const cv = document.createElement('canvas'); cv.width = cv.height = 1; ctx = cv.getContext('2d', { willReadFrequently: true }); }
    ctx.fillStyle = '#010203';
    ctx.fillStyle = s;
    if (ctx.fillStyle === '#010203') return null; // chuỗi không phải màu: fillStyle giữ giá trị cũ
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  }

  function parse(input) {
    if (Array.isArray(input)) return input.length === 3 ? input.concat(1) : input.slice(0, 4);
    const s = String(input == null ? '' : input).trim().toLowerCase();
    if (!s) return null;
    if (NAMED[s]) return NAMED[s].slice();
    if (s[0] === '#') return parseHex(s);
    const m = /^(rgba?|hsla?|oklch|oklab|color)\((.*)\)$/.exec(s);
    if (!m) return canvasParse(s);
    const fn = m[1], p = args(m[2]);
    if (fn === 'color') { if (p[0] !== 'srgb') return canvasParse(s); p.shift(); }
    if (p.length < 3 || p.slice(0, 3).includes('none')) return canvasParse(s);
    const alpha = p[3] === undefined ? 1 : clamp01(num(p[3], 1));
    const pct = x => String(x).trim().endsWith('%') ? num(x, 1) : num(x, 1) / 100;
    let rgb;
    if (fn === 'color') rgb = p.slice(0, 3).map(x => clamp01(num(x, 1)) * 255);
    else if (fn.startsWith('rgb')) rgb = p.slice(0, 3).map(x => Math.min(255, Math.max(0, num(x, 255))));
    else if (fn.startsWith('hsl')) rgb = hslToRgb(parseFloat(p[0]), pct(p[1]), pct(p[2]));
    else if (fn === 'oklch') {
      // Ngoài gam sRGB thì cắt từng kênh, như Chrome vẽ: oklch(0.58 0.19 38) ra #D24100
      const L = num(p[0], 1), Cc = Math.max(0, num(p[1], 0.4)), H = (parseFloat(p[2]) || 0) * Math.PI / 180;
      rgb = linFromOklab(L, Cc * Math.cos(H), Cc * Math.sin(H)).map(encode);
    } else rgb = linFromOklab(num(p[0], 1), num(p[1], 0.4), num(p[2], 0.4)).map(encode);
    return rgb.some(v => Number.isNaN(v)) ? null : rgb.concat(alpha);
  }

  function must(c) {
    const v = parse(c);
    if (!v) throw new Error(`Không đọc được màu "${c}"`);
    return v;
  }

  const toHex = c => '#' + must(c).slice(0, 3).map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
  const rgba = (c, a) => { const [r, g, b] = must(c); return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`; };

  function toOklch(c) {
    const [L, a, b] = rgbToOklab(must(c));
    let H = Math.atan2(b, a) * 180 / Math.PI;
    if (H < 0) H += 360;
    return [L, Math.hypot(a, b), H];
  }

  // Màu sinh ra (hover, nền nhạt…): ngoài gam thì giảm độ bão hoà tới khi vào gam, giữ độ sáng và sắc độ
  function fromOklch(L, Cc, H) {
    const ab = c => [c * Math.cos(H * Math.PI / 180), c * Math.sin(H * Math.PI / 180)];
    for (let c = Cc; c >= 0; c -= 0.004) {
      const lin = linFromOklab(L, ...ab(c));
      if (lin.every(x => x >= -1e-4 && x <= 1 + 1e-4)) return lin.map(encode);
    }
    return linFromOklab(L, 0, 0).map(encode);
  }

  function over(top, bottom) {
    const t = must(top), b = must(bottom), a = t[3], oa = a + b[3] * (1 - a);
    if (!oa) return [0, 0, 0, 0];
    return [0, 1, 2].map(i => (t[i] * a + b[i] * b[3] * (1 - a)) / oa).concat(oa);
  }

  function luminance(c) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const [r, g, b] = must(c);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  // Nền trong suốt thì trộn lên backdrop (mặc định trắng); chữ trong suốt thì trộn lên nền
  function contrast(fg, bg, backdrop) {
    let b = must(bg);
    if (b[3] < 1) b = over(b, backdrop || '#FFFFFF');
    let f = must(fg);
    if (f[3] < 1) f = over(f, b);
    const x = luminance(f), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  function deltaE(a, b) {
    const A = rgbToOklab(must(a)), B = rgbToOklab(must(b));
    return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
  }

  // Không làm tròn lên: 4,499 là chưa đạt AA
  function grade(r) {
    if (r >= 7) return 'AAA';
    if (r >= 4.5) return 'AA';
    if (r >= 3) return 'AA chữ lớn';
    return 'Không đạt';
  }
  const verdict = (r, need) => r < need ? 'khong' : r < need + NEAR ? 'sat' : 'dat';
  const needFor = (px, weight) => (px >= 24 || (px >= 18.66 && weight >= 700)) ? 3 : 4.5;

  function shiftL(c, dL) { const [L, Cc, H] = toOklch(c); return toHex(fromOklch(clamp01(L + dL), Cc, H)); }
  // Hover và nhấn của một nền có chữ nằm trên: đi về phía tăng tương phản với chữ đó
  const deriveState = (fill, onFill, step) => shiftL(fill, (luminance(onFill) > luminance(fill) ? -1 : 1) * step);
  // Trộn trong OKLab; t là phần của b
  function mix(a, b, t) {
    const A = rgbToOklab(must(a)), B = rgbToOklab(must(b));
    return toHex(linFromOklab(...A.map((v, i) => v + (B[i] - v) * t)).map(encode));
  }
  // Đẩy màu ra xa nền (tối đi trên nền sáng, sáng lên trên nền tối) tới khi vượt ngưỡng + NEAR với mọi nền
  function ensure(color, bgs, need) {
    const target = need + NEAR, lightBg = luminance(bgs[0]) > 0.18;
    let c = toHex(color);
    for (let i = 0; i < 60 && bgs.some(b => contrast(c, b) < target); i++) c = shiftL(c, lightBg ? -0.02 : 0.02);
    return c;
  }

  const SEEDS = ['bg', 'surface', 'ink', 'muted', 'line', 'primary', 'on-primary', 'accent', 'on-accent', 'destructive', 'on-destructive'];
  const OPTIONAL = ['success', 'warning', 'info', 'ring', 'muted-bg'];
  const DERIVED = ['primary-hover', 'primary-pressed', 'accent-hover', 'accent-pressed', 'destructive-hover', 'destructive-pressed',
    'hover', 'pressed', 'selected', 'primary-soft', 'muted-bg', 'card-foreground', 'line-strong', 'ring', 'link',
    'success', 'success-soft', 'warning', 'warning-soft', 'info', 'info-soft', 'danger-text', 'danger-soft', 'scrim'];
  // Màu báo mặc định khi theme không khai: [sáng, tối]
  const STATUS = {
    success: ['oklch(0.52 0.13 150)', 'oklch(0.80 0.13 150)'],
    warning: ['oklch(0.56 0.12 70)', 'oklch(0.84 0.12 85)'],
    info: ['oklch(0.52 0.12 250)', 'oklch(0.80 0.10 250)'],
  };

  function deriveTheme(seeds, mode, overrides) {
    const s = Object.assign({}, seeds);
    const lacks = SEEDS.filter(k => !s[k]);
    if (lacks.length) throw new Error(`Thiếu màu gốc: ${lacks.join(', ')}`);
    for (const k of SEEDS.concat(OPTIONAL)) if (s[k] && !parse(s[k])) throw new Error(`Không đọc được màu ${k}: "${s[k]}"`);
    const dark = mode === 'dark', soft = dark ? 0.80 : 0.88, notes = [], out = {};
    for (const k of SEEDS) out[k] = s[k];
    for (const k of ['primary', 'accent', 'destructive']) {
      out[`${k}-hover`] = deriveState(s[k], s[`on-${k}`], 0.05);
      out[`${k}-pressed`] = deriveState(s[k], s[`on-${k}`], 0.10);
    }
    out.hover = rgba(s.ink, 0.06);
    out.pressed = rgba(s.ink, 0.10);
    out.selected = mix(s.accent, s.surface, dark ? 0.80 : 0.86);
    out['primary-soft'] = mix(s.primary, s.bg, soft);
    out['muted-bg'] = s['muted-bg'] || mix(s.ink, s.surface, dark ? 0.90 : 0.95);
    out['card-foreground'] = s.ink;
    // Chỉnh màu cho đủ tương phản; màu do người dùng chọn mà bị chỉnh thì ghi chú để themes.mjs in ra
    const fit = (name, from, bgs, need, given) => {
      const v = ensure(from, bgs, need);
      if (given && toHex(from) !== v) notes.push(`${name}: ${toHex(from)} → ${v} để đạt ${need + NEAR}:1`);
      return v;
    };
    const surfaces = [s.bg, s.surface];
    out['line-strong'] = fit('line-strong', s.line, surfaces, 3, false);
    out.ring = fit('ring', s.ring || s.accent, surfaces, 3, !!s.ring);
    out.link = fit('link', s.primary, surfaces, 4.5, false);
    for (const k of ['success', 'warning', 'info']) {
      const seed = s[k] || STATUS[k][dark ? 1 : 0];
      out[`${k}-soft`] = mix(seed, s.bg, soft);
      out[k] = fit(k, seed, [out[`${k}-soft`], s.surface, s.bg], 4.5, !!s[k]);
    }
    out['danger-soft'] = mix(s.destructive, s.bg, soft);
    out['danger-text'] = fit('danger-text', s.destructive, [out['danger-soft'], s.surface, s.bg], 4.5, false);
    out.scrim = rgba(luminance(s.ink) < luminance(s.bg) ? s.ink : s.bg, dark ? 0.65 : 0.45);
    for (const [k, v] of Object.entries(overrides || {})) out[k] = v;
    return { vars: out, notes };
  }

  // [chữ, nền, ngưỡng, nhãn, lớp dưới]: có lớp dưới khi nền là lớp phủ trong suốt (hover, pressed) nằm trên --surface
  const PAIRS = [
    ['ink', 'bg', 4.5, 'Chữ chính trên nền'],
    ['ink', 'surface', 4.5, 'Chữ chính trên thẻ'],
    ['muted', 'bg', 4.5, 'Chữ phụ trên nền'],
    ['muted', 'surface', 4.5, 'Chữ phụ, placeholder trên thẻ và ô nhập'],
    ['on-primary', 'primary', 4.5, 'Chữ trên nút chính'],
    ['on-primary', 'primary-hover', 4.5, 'Chữ trên nút chính khi di chuột'],
    ['on-primary', 'primary-pressed', 4.5, 'Chữ trên nút chính khi nhấn'],
    ['on-accent', 'accent', 4.5, 'Chữ trên màu nhấn'],
    ['on-accent', 'accent-hover', 4.5, 'Chữ trên màu nhấn khi di chuột'],
    ['on-destructive', 'destructive', 4.5, 'Chữ trên nút nguy hiểm'],
    ['on-destructive', 'destructive-hover', 4.5, 'Chữ trên nút nguy hiểm khi di chuột'],
    ['link', 'bg', 4.5, 'Liên kết trên nền'],
    ['link', 'surface', 4.5, 'Liên kết trên thẻ'],
    ['ink', 'selected', 4.5, 'Chữ trên mục đang chọn'],
    ['ink', 'primary-soft', 4.5, 'Chữ trên nền nhạt của màu chính'],
    ['ink', 'muted-bg', 4.5, 'Chữ trên nền phụ'],
    ['ink', 'hover', 4.5, 'Chữ trên hàng đang di chuột', 'surface'],
    ['ink', 'pressed', 4.5, 'Chữ trên hàng đang nhấn', 'surface'],
    ['success', 'success-soft', 4.5, 'Chữ báo thành công trên nền nhạt'],
    ['warning', 'warning-soft', 4.5, 'Chữ cảnh báo trên nền nhạt'],
    ['info', 'info-soft', 4.5, 'Chữ thông tin trên nền nhạt'],
    ['danger-text', 'danger-soft', 4.5, 'Chữ lỗi trên nền nhạt'],
    ['line-strong', 'bg', 3, 'Viền ô nhập, control trên nền'],
    ['line-strong', 'surface', 3, 'Viền ô nhập, control trên thẻ'],
    ['ring', 'bg', 3, 'Vòng focus trên nền'],
    ['ring', 'surface', 3, 'Vòng focus trên thẻ'],
  ];

  function measure(vars, pairs) {
    return (pairs || PAIRS).filter(([f, b, , , u]) => vars[f] && vars[b] && (!u || vars[u])).map(([fg, bg, need, label, under]) => {
      const r = contrast(vars[fg], under ? over(vars[bg], vars[under]) : vars[bg]);
      return { fg, bg, under: under || null, need, label, ratio: Math.floor(r * 100) / 100, verdict: verdict(r, need) };
    });
  }

  const api = { NEAR, SEEDS, OPTIONAL, DERIVED, PAIRS, parse, toHex, rgba, toOklch, over, luminance, contrast, deltaE,
    grade, verdict, needFor, shiftL, deriveState, mix, ensure, deriveTheme, measure };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ColorKit = api;
})(typeof window !== 'undefined' ? window : this);
