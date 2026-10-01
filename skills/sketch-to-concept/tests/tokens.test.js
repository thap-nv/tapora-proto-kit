// Kiểm các hàm thuần của templates/tokens.js. Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../templates/tokens.js');

const DATA = {
  concepts: [
    {
      id: 'a',
      colors: { light: { background: '#FFFFFF', foreground: '#18181B', primary: '#0F766E', 'on-primary': '#FFFFFF' },
                dark: { background: '#0B0C0E', foreground: '#EDEDEF', primary: '#2DD4BF', 'on-primary': '#0B0C0E' } },
      fontFamily: { display: 'Newsreader', body: 'Be Vietnam Pro' },
      shape: { radius: { sm: '6px', md: '10px' }, shadow: '0 1px 2px rgba(0,0,0,.08)', texture: 'none' },
    },
    {
      id: 'b',
      colors: { light: { background: '#F4F4F0', foreground: '#111111', primary: '#E61919', 'on-primary': '#FFFFFF' } },
      fontFamily: { display: 'Anybody', body: 'Be Vietnam Pro', mono: 'JetBrains Mono' },
      fontWeights: { mono: '400' },
      shape: { radius: { sm: '0px', md: '0px' }, shadow: 'none', texture: 'grid' },
    },
  ],
};

test('hexToRgb đọc mã 3 và 6 ký tự', () => {
  assert.deepEqual(T.hexToRgb('#abc'), [170, 187, 204]);
  assert.deepEqual(T.hexToRgb('#0F766E'), [15, 118, 110]);
});

test('hexToRgb báo lỗi với mã không hợp lệ', () => {
  assert.throws(() => T.hexToRgb('zzz'), /mã màu/);
  assert.throws(() => T.hexToRgb('#12345'), /mã màu/);
});

test('contrast khớp các cặp đã biết của WCAG', () => {
  assert.equal(Math.round(T.contrast('#000000', '#FFFFFF') * 100) / 100, 21);
  assert.equal(T.contrast('#FFFFFF', '#FFFFFF'), 1);
  assert.equal(Math.floor(T.contrast('#767676', '#FFFFFF') * 100) / 100, 4.54);
  assert.equal(T.contrast('#767676', '#FFFFFF'), T.contrast('#FFFFFF', '#767676'));
});

test('grade không làm tròn lên ngưỡng', () => {
  assert.equal(T.grade(7), 'AAA');
  assert.equal(T.grade(4.5), 'AA');
  assert.equal(T.grade(4.4999), 'AA chữ lớn');
  assert.equal(T.grade(3), 'AA chữ lớn');
  assert.equal(T.grade(2.99), 'Không đạt');
});

test('checkPairs chỉ đo cặp có đủ hai màu, số cắt xuống 2 chữ số, kèm ngưỡng và mức', () => {
  const rows = T.checkPairs({ background: '#FFFFFF', foreground: '#767676', primary: '#0F766E' });
  assert.deepEqual(rows, [{ fg: 'foreground', bg: 'background', label: 'Chữ chính trên nền', ratio: 4.54, grade: 'AA', need: 4.5, verdict: 'sat' }]);
});

test('checkPairs không vỡ khi một màu không đọc được; rgba() trong suốt thì trộn lên trắng rồi đo', () => {
  assert.deepEqual(T.checkPairs({ background: 'không-phải-màu', foreground: '#18181B' }),
    [{ fg: 'foreground', bg: 'background', label: 'Chữ chính trên nền', ratio: null, grade: 'Không đo được (màu không đọc được)', need: 4.5, verdict: 'khong' }]);
  assert.equal(typeof T.checkPairs({ background: 'rgba(255,255,255,.9)', foreground: '#18181B' })[0].ratio, 'number');
});

test('parseMix đọc mã trộn, không phân biệt hoa thường và thứ tự', () => {
  assert.deepEqual(T.parseMix('mau:B chu:A nut:A'), { mau: 'b', chu: 'a', nut: 'a' });
  assert.deepEqual(T.parseMix('  NUT:c   mau:a '), { nut: 'c', mau: 'a' });
  assert.deepEqual(T.parseMix(''), {});
  assert.deepEqual(T.parseMix(null), {});
  assert.deepEqual(T.parseMix('mau:b x:y chu'), { mau: 'b' });
});

test('formatMix viết theo thứ tự cố định, bỏ phần thiếu', () => {
  assert.equal(T.formatMix({ nut: 'a', mau: 'b', chu: 'a' }), 'mau:B chu:A nut:A');
  assert.equal(T.formatMix({ chu: 'c' }), 'chu:C');
  assert.equal(T.formatMix(T.parseMix('chu:b mau:c')), 'mau:C chu:B');
});

test('mã trộn có lớp man: màn và ý lấy từ concept nào', () => {
  assert.deepEqual(T.parseMix('man:C mau:B'), { man: 'c', mau: 'b' });
  assert.equal(T.formatMix({ nut: 'a', chu: 'a', mau: 'b', man: 'c' }), 'man:C mau:B chu:A nut:A');
});

test('resolve lấy từng lớp từ concept mà mã trộn chỉ định', () => {
  const plain = T.resolve(DATA, 'a');
  assert.equal(plain.colors.light.primary, '#0F766E');
  const mixed = T.resolve(DATA, 'a', { mau: 'b' });
  assert.equal(mixed.colors.light.primary, '#E61919');
  assert.equal(mixed.fontFamily.display, 'Newsreader');
  assert.equal(mixed.shape.radius.md, '10px');
  const all = T.resolve(DATA, 'a', { chu: 'b', nut: 'b' });
  assert.equal(all.colors.light.primary, '#0F766E');
  assert.equal(all.fontFamily.display, 'Anybody');
  assert.equal(all.fontWeights.mono, '400');
  assert.equal(all.shape.radius.md, '0px');
  assert.equal(all.id, 'a');
});

test('resolve báo lỗi khi concept không có', () => {
  assert.throws(() => T.resolve(DATA, 'x'), /Không có concept "x"/);
  assert.throws(() => T.resolve(DATA, 'a', { mau: 'z' }), /Không có concept "z"/);
});

test('varName đổi vai trò colors.csv sang tên biến chung của kit (rules-and-conflicts D.2, app.css)', () => {
  assert.equal(T.varName('background'), 'bg');
  assert.equal(T.varName('card'), 'surface');
  assert.equal(T.varName('foreground'), 'ink');
  assert.equal(T.varName('muted-foreground'), 'muted');
  assert.equal(T.varName('muted'), 'muted-bg');
  assert.equal(T.varName('border'), 'line');
  assert.equal(T.varName('accent'), 'accent');
  assert.equal(T.varName('primary'), 'primary');
  assert.equal(T.varName('on-primary'), 'on-primary');
});

test('cssText sinh token sáng, tối theo quy ước theme.js, tên biến theo kit', () => {
  const css = T.cssText(T.resolve(DATA, 'a'));
  assert.match(css, /^:root\{[^}]*--bg:#FFFFFF;/);
  assert.match(css, /--ink:#18181B;/);
  assert.match(css, /--on-primary:#FFFFFF;/);
  assert.doesNotMatch(css, /--background:|--foreground:/);
  assert.match(css, /--font-display:"Newsreader", system-ui, sans-serif;/);
  assert.match(css, /--font-body:"Be Vietnam Pro", system-ui, sans-serif;/);
  assert.match(css, /--brand-font:"Be Vietnam Pro", system-ui, sans-serif;/);
  assert.match(css, /--radius-md:10px;/);
  assert.match(css, /--radius:10px;/);
  assert.match(css, /--shadow:0 1px 2px rgba\(0,0,0,\.08\);/);
  assert.match(css, /--texture:none;/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)\{:root:not\(\[data-theme="light"\]\)\{[^}]*--bg:#0B0C0E;/);
  assert.match(css, /:root\[data-theme="dark"\]\{[^}]*--primary:#2DD4BF;/);
});

test('thân chữ system-ui: theo font nền tảng, không sinh --brand-font, không nạp từ Google', () => {
  const plat = { id: 'p', colors: { light: { background: '#FFFFFF' } }, fontFamily: { display: 'Newsreader', body: 'system-ui' }, shape: {} };
  const css = T.cssText(plat);
  assert.match(css, /--font-body:var\(--app-font, system-ui, sans-serif\);/);
  assert.doesNotMatch(css, /--brand-font/);
  assert.equal(T.fontsHref(plat), 'https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&display=swap');
});

test('chất nền grain: data URI không có dấu % chưa mã hoá', () => {
  const css = T.cssText({ colors: { light: { background: '#FFFFFF' } }, shape: { texture: 'grain' } });
  const uri = /--texture:url\("([^"]*)"\)/.exec(css)[1];
  assert.doesNotMatch(uri, /%(?![0-9A-Fa-f]{2})/);
});

test('validate báo dữ liệu concept sai quy ước', () => {
  assert.deepEqual(T.validate(DATA), []);
  assert.deepEqual(T.validate({}), ['concepts.js chưa có mảng concepts.']);
  const bad = { concepts: [{ id: 'A', colors: { light: {} } }, { id: 'b' }, { id: 'b', colors: { dark: {} } }] };
  assert.deepEqual(T.validate(bad), [
    'Concept "A": id chỉ gồm chữ thường a-z, số và dấu gạch ngang.',
    'Concept "b": thiếu colors.light hoặc colors.dark.',
    'Concept "b" bị trùng id.',
  ]);
});

test('cssText bỏ khối tối khi concept chỉ có một bảng màu', () => {
  const css = T.cssText(T.resolve(DATA, 'b'));
  assert.doesNotMatch(css, /data-theme="dark"/);
  assert.match(css, /--font-mono:"JetBrains Mono", ui-monospace, monospace;/);
  assert.match(css, /--texture:repeating-linear-gradient/);
});

test('cssText gói token vào một vùng khi có scope, nền tối vẫn theo data-theme của trang', () => {
  const css = T.cssText(T.resolve(DATA, 'a'), '#tile-a');
  assert.match(css, /^#tile-a\{[^}]*--bg:#FFFFFF;/);
  assert.match(css, /:root:not\(\[data-theme="light"\]\) #tile-a\{[^}]*--bg:#0B0C0E;/);
  assert.match(css, /:root\[data-theme="dark"\] #tile-a\{/);
  assert.doesNotMatch(css, /:root\{/);
});

test('diffAxes đếm trục khác nhau giữa từng cặp, bắt buộc khác khung', () => {
  const axes = (nen, chatNen, chu, yTuong, khoanhKhac, khung) => ({ nen, chatNen, chu, yTuong, khoanhKhac, khung });
  const data = { concepts: [
    { id: 'a', axes: axes('Sáng tinh', 'Giấy', 'Serif biên tập', 'Hồ sơ lưu trữ', 'Con số khổng lồ', 'Lưới biên tập 12 cột') },
    { id: 'b', axes: axes('Tối sâu', 'Lưới kỹ thuật', 'Grotesk tinh', 'Hồ sơ lưu trữ', 'Con số khổng lồ', 'Bảng thông số hai cột') },
    { id: 'c', axes: axes('sáng tinh ', 'Giấy', 'Display cá tính', 'Hành trình', 'Con số khổng lồ', 'lưới biên tập 12 cột') },
  ] };
  assert.deepEqual(T.diffAxes(data), [
    { a: 'a', b: 'b', differ: ['nen', 'chatNen', 'chu', 'khung'], ok: true },
    { a: 'a', b: 'c', differ: ['chu', 'yTuong'], ok: false },
    { a: 'b', b: 'c', differ: ['nen', 'chatNen', 'chu', 'yTuong', 'khung'], ok: true },
  ]);
});

test('diffAxes: đủ 3 trục mà chung khung vẫn chưa đạt', () => {
  const data = { concepts: [
    { id: 'a', axes: { nen: '1', chatNen: '1', chu: '1', yTuong: '1', khoanhKhac: '1', khung: 'x' } },
    { id: 'b', axes: { nen: '2', chatNen: '2', chu: '2', yTuong: '2', khoanhKhac: '2', khung: 'x' } },
  ] };
  assert.equal(T.diffAxes(data)[0].ok, false);
});

test('fontsHref gộp font trùng, hợp các độ đậm, dùng độ đậm khai báo', () => {
  assert.equal(T.fontsHref(T.resolve(DATA, 'b')),
    'https://fonts.googleapis.com/css2?family=Anybody:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
  const same = { fontFamily: { display: 'Lexend', body: 'Lexend' }, fontWeights: { display: '700', body: '400;500' } };
  assert.equal(T.fontsHref(same), 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700&display=swap');
});

// Bảng màu đủ màu gốc: concept A của khuôn concepts.js
const FULL = { background: '#F3F4F1', foreground: '#1F2A24', card: '#FFFFFF', 'card-foreground': '#1F2A24', muted: '#E6E8E3', 'muted-foreground': '#56615A',
  border: '#D5D9D2', primary: '#1F2A24', 'on-primary': '#F3F4F1', accent: '#B3261E', 'on-accent': '#FFFFFF', destructive: '#B3261E', 'on-destructive': '#FFFFFF', ring: '#B3261E' };
const FULL_DARK = { ...FULL, background: '#121714', foreground: '#E7EBE6', card: '#1A201C', 'card-foreground': '#E7EBE6', muted: '#232A25', 'muted-foreground': '#A3ADA6',
  border: '#2E3631', primary: '#E7EBE6', 'on-primary': '#121714', accent: '#E0574D', 'on-accent': '#121714', destructive: '#E0574D', 'on-destructive': '#121714', ring: '#E0574D' };

test('checkPairs đo được màu oklch, kèm ngưỡng và mức sát', () => {
  const rows = T.checkPairs({ background: '#FFFFFF', foreground: '#18181B', primary: 'oklch(0.58 0.19 38)', 'on-primary': '#FFFFFF' });
  const btn = rows.find(r => r.fg === 'on-primary');
  assert.deepEqual([btn.ratio, btn.grade, btn.need, btn.verdict], [4.66, 'AA', 4.5, 'sat']);
});

test('checkPairs: concept đủ màu gốc thì đo thêm cặp của vai dẫn xuất', () => {
  const rows = T.checkPairs(FULL, 'light');
  for (const k of ['primary-hover', 'line-strong', 'ring', 'hover', 'danger-soft']) assert.ok(rows.some(r => r.fg === k || r.bg === k), k);
  assert.ok(rows.every(r => typeof r.ratio === 'number' && r.grade && r.verdict));
  assert.ok(rows.length >= 20);
});

test('cssText xuất vai dẫn xuất và color-scheme cho từng nền, không khai trùng biến', () => {
  const css = T.cssText(T.resolve({ concepts: [{ id: 'a', colors: { light: FULL, dark: FULL_DARK } }] }, 'a'));
  assert.match(css, /^:root\{--bg:#F3F4F1;[^}]*color-scheme:light;--theme-mode:"light";[^}]*--primary-hover:#[0-9A-F]{6};/);
  assert.match(css, /:root\[data-theme="dark"\]\{[^}]*color-scheme:dark;[^}]*--line-strong:#[0-9A-F]{6};/);
  const root = /^:root\{([^}]*)\}/.exec(css)[1];
  const names = root.match(/--[\w-]+(?=:)/g);
  assert.equal(names.length, new Set(names).size, 'khai trùng biến trong :root');
});

test('validate báo màu không đọc được', () => {
  assert.deepEqual(T.validate({ concepts: [{ id: 'a', colors: { light: { background: 'xanh' } } }] }),
    ['Concept "a": màu background không đọc được ("xanh").']);
});
