// Token của concept: đổi dữ liệu trong concepts.js thành CSS variables, đo tương phản (cả vai dẫn xuất), đọc mã trộn. Cần color.js.
// Mẫu từ sketch-to-concept/templates/tokens.js. Chép nguyên vào concept/tokens.js, không sửa.
// Mã trộn: "man:A mau:B chu:A nut:A" = màn và ý của A, màu của B, chữ của A, nút và hình khối của A.
(function (root) {
  // Lõi màu dùng chung (sketch-to-site/templates/color.js). Trình duyệt: nạp color.js TRƯỚC tokens.js.
  // Node: tìm color.js cạnh file này (concept/color.js), hoặc ở khuôn của sketch-to-site khi chạy trong repo
  const CK = (() => {
    if (typeof module === 'object' && module.exports) {
      const path = require('path');
      for (const p of ['color.js', path.join('..', '..', 'sketch-to-site', 'templates', 'color.js')]) {
        try { return require(path.join(__dirname, p)); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
      }
      throw new Error('tokens.js cần color.js cùng thư mục: chép từ sketch-to-site/templates/color.js');
    }
    return root.ColorKit || null;
  })();
  const LAYERS = ['man', 'mau', 'chu', 'nut'];
  // Trục so giữa các concept (plan mục 3.4): cần khác nhau ở >= 3 trục, và khung bố cục phải khác
  const AXES = ['nen', 'chatNen', 'chu', 'yTuong', 'khoanhKhac', 'khung'];
  // Ba trục Hình: luật của cặp dùng chung một màn (concept chỉ đổi lớp Hình với concept nó mượn màn, hoặc hai concept cùng mượn một màn)
  const HINH_AXES = ['nen', 'chatNen', 'chu'];
  // Lý do cho mọi lựa chọn Hình (concept-method.md mục 5.4): màu, chữ, bo góc và bóng, chất nền
  const WHY = ['mau', 'chu', 'hinh', 'chatNen'];
  // Màn mà concept hiện trên đó: màn của chính nó, hoặc màn của concept nó mượn (screen)
  const screenOf = c => (c && c.screen) || (c && c.id);
  // Bề mặt (hệ nhiều bề mặt): màn chính <id>.html là key '', mỗi bề mặt khác một màn <id>-<key>.html. Không khai thì chỉ có màn chính
  const surfaces = data => (Array.isArray(data && data.surfaces) && data.surfaces.length
    ? data.surfaces.map(s => ({ key: String((s && s.key) || ''), label: String((s && s.label) || ''), width: +(s && s.width) === 390 ? 390 : 1440 }))
    : [{ key: '', label: '', width: 1440 }]);
  // Tên file màn (không đuôi) của một màn ở một bề mặt
  const pageOf = (screen, key) => (key ? `${screen}-${key}` : String(screen));
  // Cặp chữ/nền cần đo. Vai trò màu theo cột của ui-ux-pro-max/data/colors.csv, viết kebab-case
  const PAIRS = [
    ['foreground', 'background', 'Chữ chính trên nền'],
    ['muted-foreground', 'background', 'Chữ phụ trên nền'],
    ['card-foreground', 'card', 'Chữ trên thẻ'],
    ['on-primary', 'primary', 'Chữ trên nút chính'],
    ['on-secondary', 'secondary', 'Chữ trên nút phụ'],
    ['on-accent', 'accent', 'Chữ trên màu nhấn'],
    ['on-destructive', 'destructive', 'Chữ trên nền lỗi'],
  ];
  // Tên biến CSS: 5 vai trò theo hợp đồng chung của kit (rules-and-conflicts.md D.2, templates/mobile/app.css đọc đúng các tên này),
  // "muted" của colors.csv là nền phụ nên đổi thành --muted-bg, vì --muted của kit là chữ phụ. Vai trò khác giữ tên của colors.csv.
  const VARS = { background: 'bg', card: 'surface', foreground: 'ink', 'muted-foreground': 'muted', muted: 'muted-bg', border: 'line' };
  const varName = role => VARS[role] || role;
  const PLATFORM = 'system-ui'; // giá trị font nghĩa là "font nền tảng"; preflight.py coi đây là họ font chung, không báo P15
  // Chất nền dùng qua background-image: var(--texture); background-size: var(--texture-size)
  const TEXTURES = {
    none: ['none', 'auto'],
    grid: ['repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px 24px)', 'auto'],
    dots: ['radial-gradient(var(--line) 1px, transparent 1.5px)', '16px 16px'],
    grain: ["url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")", '160px 160px'],
  };

  function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) throw new Error(`Không phải mã màu hex: "${hex}"`);
    const h = m[1].length === 3 ? m[1].replace(/./g, c => c + c) : m[1];
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  }

  // Đọc được mọi dạng màu CSS (hex, rgb, hsl, oklch, oklab); màu trong suốt trộn lên trắng
  const contrast = (a, b) => CK.contrast(a, b);

  // Không làm tròn lên: 4,499 là chưa đạt AA
  function grade(ratio) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA chữ lớn';
    return 'Không đạt';
  }

  // Vai trò màu của concept (cột colors.csv) → màu gốc của theme (tên biến chung của kit), để tính vai dẫn xuất như scripts/themes.mjs
  const SEED_OF = { bg: 'background', surface: 'card', ink: 'foreground', muted: 'muted-foreground', line: 'border', 'muted-bg': 'muted' };
  function derived(colors, mode) {
    if (!CK || !colors) return null;
    const s = {};
    for (const k of CK.SEEDS.concat(CK.OPTIONAL)) { const v = colors[SEED_OF[k] || k]; if (v) s[k] = v; }
    if (!s.surface && s.bg) s.surface = s.bg;
    if (CK.SEEDS.some(k => !s[k])) return null;
    let vars;
    try { vars = CK.deriveTheme(s, mode).vars; } catch (e) { return null; }
    // Vai concept đã khai (ring, card-foreground, muted…) thì CSS dùng giá trị của concept: đo đúng giá trị đó
    for (const role of Object.keys(colors)) { const k = varName(role); if (k in vars) vars[k] = colors[role]; }
    return vars;
  }

  function checkPairs(colors, mode) {
    const base = PAIRS.filter(([fg, bg]) => colors[fg] && colors[bg]).map(([fg, bg, label]) => {
      try {
        const r = contrast(colors[fg], colors[bg]);
        return { fg, bg, label, ratio: Math.floor(r * 100) / 100, grade: grade(r), need: 4.5, verdict: CK.verdict(r, 4.5) };
      } catch (e) {
        return { fg, bg, label, ratio: null, grade: 'Không đo được (màu không đọc được)', need: 4.5, verdict: 'khong' };
      }
    });
    const vars = derived(colors, mode || 'light');
    if (!vars) return base;
    const isDerived = k => k && CK.DERIVED.includes(k);
    return base.concat(CK.measure(vars).filter(r => isDerived(r.fg) || isDerived(r.bg) || isDerived(r.under))
      .map(r => ({ fg: r.fg, bg: r.bg, label: r.label, ratio: r.ratio, grade: grade(r.ratio), need: r.need, verdict: r.verdict })));
  }

  function parseMix(str) {
    const mix = {};
    for (const part of String(str || '').trim().split(/\s+/)) {
      const m = /^(man|mau|chu|nut):([a-z0-9-]+)$/i.exec(part);
      if (m) mix[m[1].toLowerCase()] = m[2].toLowerCase();
    }
    return mix;
  }

  function formatMix(mix) {
    return LAYERS.filter(k => mix[k]).map(k => `${k}:${mix[k].toUpperCase()}`).join(' ');
  }

  function resolve(data, id, mix) {
    const find = i => {
      const c = data.concepts.find(x => x.id === i);
      if (!c) throw new Error(`Không có concept "${i}"`);
      return c;
    };
    const out = Object.assign({}, find(id));
    mix = mix || {};
    if (mix.mau) out.colors = find(mix.mau).colors;
    if (mix.chu) { const c = find(mix.chu); out.fontFamily = c.fontFamily; out.fontWeights = c.fontWeights; }
    if (mix.nut) out.shape = find(mix.nut).shape;
    return out;
  }

  const decl = obj => Object.keys(obj).map(k => `--${k}:${obj[k]};`).join('');
  const colorDecl = colors => Object.keys(colors).map(k => `--${varName(k)}:${colors[k]};`).join('');

  // scope: gói token vào một vùng (bảng concept đặt nhiều concept cạnh nhau); bỏ trống thì là :root (màn then chốt)
  function cssText(c, scope) {
    const ff = c.fontFamily || {};
    const fonts = {};
    for (const role of ['display', 'body', 'mono']) {
      if (!ff[role]) continue;
      // 'system-ui' = font nền tảng: màn app theo --app-font của app.css (SF Pro, Roboto), trang web theo font hệ thống
      fonts[`font-${role}`] = ff[role] === PLATFORM ? 'var(--app-font, system-ui, sans-serif)'
        : `"${ff[role]}", ${role === 'mono' ? 'ui-monospace, monospace' : 'system-ui, sans-serif'}`;
    }
    // app.css đọc --brand-font trước, không có mới dùng --app-font. Thân chữ theo nền tảng thì không đặt --brand-font
    if (ff.body && ff.body !== PLATFORM) fonts['brand-font'] = fonts['font-body'];
    const s = c.shape || {};
    const shape = {};
    for (const k of Object.keys(s.radius || {})) shape[`radius-${k}`] = s.radius[k];
    if (s.radius && s.radius.md) shape.radius = s.radius.md; // --radius của D.2
    if (s.shadow) shape.shadow = s.shadow;
    if (s.borderWidth) shape['border-width'] = s.borderWidth;
    const [tex, size] = TEXTURES[s.texture || 'none'] || [s.texture, 'auto'];
    shape.texture = tex;
    shape['texture-size'] = size;
    // Mỗi khối nền: color-scheme (ô nhập, thanh cuộn theo nền), --theme-mode (bộ kiểm, theme.js) và vai dẫn xuất chưa khai
    const themeExtra = (colors, mode) => {
      const head = `color-scheme:${mode};--theme-mode:"${mode}";`;
      const v = derived(colors, mode);
      if (!v) return head;
      const have = new Set(Object.keys(colors).map(varName));
      return head + CK.DERIVED.filter(k => !have.has(k)).map(k => `--${k}:${v[k]};`).join('');
    };
    const { light, dark } = c.colors;
    const sel = scope ? ` ${scope}` : '';
    let css = `${scope || ':root'}{${colorDecl(light || dark)}${themeExtra(light || dark, light ? 'light' : 'dark')}${decl(fonts)}${decl(shape)}}`;
    if (light && dark) {
      const d = colorDecl(dark) + themeExtra(dark, 'dark');
      css += `@media (prefers-color-scheme: dark){:root:not([data-theme="light"])${sel}{${d}}}:root[data-theme="dark"]${sel}{${d}}`;
    }
    return css;
  }

  // Kiểm dữ liệu trước khi dựng bảng: id dùng trong mã trộn, tên file màn, selector CSS nên chỉ gồm a-z, 0-9, dấu gạch ngang
  function validate(data) {
    if (!data || !Array.isArray(data.concepts)) return ['concepts.js chưa có mảng concepts.'];
    const out = [];
    const seen = new Set();
    // Vòng là số nguyên từ 1: bảng đọc round thiếu hay 0 thành vòng 1, nên vòng 0 sẽ hiện sai chỗ
    const posInt = v => typeof v !== 'boolean' && Number.isInteger(+v) && +v >= 1;
    if (data.rounds !== undefined && !Array.isArray(data.rounds)) out.push('CONCEPTS.rounds phải là mảng, mỗi vòng một dòng { n, note }.');
    const list = Array.isArray(data.rounds) ? data.rounds : [];
    for (const r of list) if (!posInt(r && r.n)) out.push(`CONCEPTS.rounds: n phải là số nguyên từ 1 (đang là "${r && r.n}").`);
    const rounds = new Set([1].concat(list.map(r => +(r && r.n))));
    if (data.surfaces !== undefined && !Array.isArray(data.surfaces)) out.push('CONCEPTS.surfaces phải là mảng, mỗi bề mặt một dòng { key, label, width }.');
    else if (data.surfaces) {
      const keys = data.surfaces.map(s => (s && s.key) || '');
      if (keys.filter(k => k === '').length !== 1) out.push("CONCEPTS.surfaces: cần đúng một bề mặt key '' (màn chính <id>.html).");
      keys.forEach((k, i) => {
        const s = data.surfaces[i] || {};
        if (!/^[a-z0-9-]*$/.test(k)) out.push(`CONCEPTS.surfaces: key "${k}" chỉ gồm chữ thường a-z, số và dấu gạch ngang.`);
        if (!String(s.label || '').trim()) out.push(`CONCEPTS.surfaces: bề mặt "${k}" thiếu label.`);
        if (k && keys.indexOf(k) !== i) out.push(`CONCEPTS.surfaces: key "${k}" bị trùng.`);
        if (s.width !== undefined && ![1440, 390].includes(+s.width)) out.push(`CONCEPTS.surfaces: width của "${k}" là 1440 hoặc 390.`);
      });
    }
    let recs = 0;
    for (const c of data.concepts) {
      const id = String(c && c.id);
      if (!/^[a-z0-9-]+$/.test(id)) out.push(`Concept "${id}": id chỉ gồm chữ thường a-z, số và dấu gạch ngang.`);
      if (!c || !c.colors || !(c.colors.light || c.colors.dark)) out.push(`Concept "${id}": thiếu colors.light hoặc colors.dark.`);
      for (const m of ['light', 'dark']) for (const [role, v] of Object.entries((c && c.colors && c.colors[m]) || {})) {
        if (CK && !CK.parse(v)) out.push(`Concept "${id}": màu ${role} không đọc được ("${v}").`);
      }
      if (seen.has(id)) out.push(`Concept "${id}" bị trùng id.`);
      seen.add(id);
      if (c && c.screen !== undefined) {
        const s = data.concepts.find(x => x && x.id === c.screen);
        if (c.screen === c.id) out.push(`Concept "${id}": screen không trỏ về chính nó.`);
        else if (!s) out.push(`Concept "${id}": screen "${c.screen}" không phải id của concept nào.`);
        else if (s.screen) out.push(`Concept "${id}": screen phải trỏ tới concept có màn riêng; "${c.screen}" cũng đang mượn màn.`);
      }
      if (c && c.round !== undefined && !posInt(c.round)) out.push(`Concept "${id}": round phải là số nguyên từ 1 (đang là "${c.round}").`);
      else if (c && c.round !== undefined && !rounds.has(+c.round)) out.push(`Concept "${id}": vòng ${c.round} chưa có trong CONCEPTS.rounds.`);
      // Chuỗi 'false' vẫn là giá trị đúng trong JS: chỉ nhận true hoặc false
      if (c && c.recommended !== undefined && typeof c.recommended !== 'boolean') out.push(`Concept "${id}": recommended phải là true hoặc false, không đặt trong ngoặc.`);
      if (c && c.recommended === true) recs++;
    }
    if (recs > 1) out.push(`Có ${recs} concept gắn recommended: chỉ một concept được khuyến nghị.`);
    return out;
  }

  // Cảnh báo không chặn: lựa chọn Hình chưa có lý do từ nội dung
  function lint(data) {
    const out = [];
    for (const c of (data && data.concepts) || []) {
      const why = (c && c.why) || {};
      const miss = WHY.filter(k => !String(why[k] || '').trim());
      if (miss.length) out.push({ id: c.id, kind: 'why', text: `Concept "${c.id}": thiếu lý do Hình ở ${miss.join(', ')}.` });
    }
    return out;
  }

  function diffAxes(data) {
    const norm = v => String(v || '').trim().toLowerCase();
    const cs = data.concepts;
    const out = [];
    for (let i = 0; i < cs.length; i++) {
      for (let j = i + 1; j < cs.length; j++) {
        const differ = AXES.filter(k => norm(cs[i].axes && cs[i].axes[k]) !== norm(cs[j].axes && cs[j].axes[k]));
        const shared = screenOf(cs[i]) === screenOf(cs[j]);
        const ok = shared ? differ.filter(k => HINH_AXES.includes(k)).length >= 2 : differ.length >= 3 && differ.includes('khung');
        out.push({ a: cs[i].id, b: cs[j].id, differ, shared, ok });
      }
    }
    return out;
  }

  function fontsHref(c) {
    const ff = c.fontFamily || {};
    const fw = c.fontWeights || {};
    const fams = new Map();
    for (const role of ['display', 'body', 'mono']) {
      if (!ff[role] || ff[role] === PLATFORM) continue;
      const set = fams.get(ff[role]) || new Set();
      String(fw[role] || '400;500;600;700').split(';').forEach(w => set.add(+w));
      fams.set(ff[role], set);
    }
    if (!fams.size) return '';
    const parts = [...fams].map(([name, set]) => `family=${name.replace(/ /g, '+')}:wght@${[...set].sort((a, b) => a - b).join(';')}`);
    return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
  }

  // Ghi token và link font của một concept vào trang (màn then chốt)
  function apply(doc, data, id, mix) {
    if (!CK) console.error('tokens.js: chưa có window.ColorKit. Nạp color.js trước tokens.js.');
    const c = resolve(data, id, mix);
    let style = doc.getElementById('concept-tokens');
    if (!style) { style = doc.createElement('style'); style.id = 'concept-tokens'; doc.head.appendChild(style); }
    style.textContent = cssText(c);
    const href = fontsHref(c);
    if (href) {
      let link = doc.getElementById('concept-fonts');
      if (!link) { link = doc.createElement('link'); link.id = 'concept-fonts'; link.rel = 'stylesheet'; doc.head.appendChild(link); }
      link.href = href;
    }
    doc.documentElement.dataset.concept = id;
    return c;
  }

  const api = { AXES, HINH_AXES, WHY, PLATFORM, varName, screenOf, surfaces, pageOf, hexToRgb, contrast, grade, checkPairs, parseMix, formatMix, resolve, cssText, validate, lint, diffAxes, fontsHref, apply };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ConceptTokens = api;

  // Màn then chốt nạp <script src="tokens.js" data-concept="a"> trong <head>: tự áp token của concept đó.
  // ?mix=mau:B chu:A nut:A thì lấy từng lớp theo mã trộn (lớp man do bảng concept chọn file màn).
  const me = typeof document !== 'undefined' && document.currentScript;
  if (me && me.dataset.concept) {
    if (!root.CONCEPTS) console.error('tokens.js: chưa có window.CONCEPTS. Nạp concepts.js trước tokens.js.');
    else apply(document, root.CONCEPTS, me.dataset.concept, parseMix(new URLSearchParams(location.search).get('mix')));
  }
})(typeof window !== 'undefined' ? window : this);
