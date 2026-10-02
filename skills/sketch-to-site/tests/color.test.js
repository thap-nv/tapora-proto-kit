// Kiểm lõi màu dùng chung templates/color.js. Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../templates/color.js');

const LIGHT = { bg: '#FBFBFA', surface: '#FFFFFF', ink: '#18181B', muted: '#5F5F68', line: '#E4E4E7', primary: '#0F766E', 'on-primary': '#FFFFFF',
  accent: '#0F766E', 'on-accent': '#FFFFFF', destructive: '#B42318', 'on-destructive': '#FFFFFF' };
// Theme Cam đất của vuong-nhan: màu chính viết bằng oklch, chữ trắng trên đó chỉ vừa qua 4.5
const CAM = { bg: '#FBFAF9', surface: '#FFFFFF', ink: '#2E2A27', muted: '#6E6A66', line: '#E7E4E1', primary: 'oklch(0.58 0.19 38)', 'on-primary': '#FFFFFF',
  accent: 'oklch(0.58 0.19 38)', 'on-accent': '#FFFFFF', destructive: 'oklch(0.5 0.19 22)', 'on-destructive': '#FFFFFF' };

test('đọc đủ các dạng màu CSS mà getComputedStyle và token hay dùng', () => {
  assert.deepEqual(C.parse('#abc'), [170, 187, 204, 1]);
  assert.deepEqual(C.parse('#0F766E80').map(v => Math.round(v * 100) / 100), [15, 118, 110, 0.5]);
  assert.deepEqual(C.parse('rgb(10 20 30 / 50%)'), [10, 20, 30, 0.5]);
  assert.deepEqual(C.parse('rgba(10, 20, 30, .25)'), [10, 20, 30, 0.25]);
  assert.deepEqual(C.parse('hsl(0 100% 50%)').map(Math.round), [255, 0, 0, 1]);
  assert.deepEqual(C.parse('color(srgb 1 0 0)'), [255, 0, 0, 1]);
  assert.deepEqual(C.parse('transparent'), [0, 0, 0, 0]);
  assert.equal(C.parse('không-phải-màu'), null);
  assert.equal(C.parse(''), null);
});

test('oklch đổi ra sRGB như trình duyệt: cắt phần ngoài gam, không đọc nhầm thành rgb', () => {
  assert.equal(C.toHex('oklch(0.58 0.19 38)'), '#D24100');
  assert.equal(C.toHex('oklch(58% 0.19 38deg)'), '#D24100');
  assert.equal(C.toHex('oklab(0.628 0.225 0.126)'), '#FF0000');
  // gate của plugin đọc chuỗi này thành rgb(0.5, 0.01, 60), gần như đen: không được lặp lại lỗi đó
  assert.ok(C.luminance('oklch(0.5 0.01 60)') > 0.1);
});

test('tương phản khớp WCAG, trộn lớp trong suốt trước khi đo', () => {
  assert.equal(Math.floor(C.contrast('#767676', '#FFFFFF') * 100) / 100, 4.54);
  assert.equal(Math.round(C.contrast('#000', '#fff') * 100) / 100, 21);
  assert.equal(C.contrast('#767676', '#FFFFFF'), C.contrast('#FFFFFF', '#767676'));
  // chip trắng 12% phủ lên khối cam: đúng lỗi thật ở vuong-nhan
  assert.equal(C.toHex(C.over('rgba(255,255,255,.12)', '#D24100')), '#D7581F');
  assert.equal(C.contrast('#FFFFFF', C.over('rgba(255,255,255,.12)', '#D24100')).toFixed(2), '3.95');
  assert.throws(() => C.contrast('abc', '#fff'), /Không đọc được màu/);
});

test('mức: dưới ngưỡng, sát ngưỡng (vượt dưới 0,3), đạt; không làm tròn lên', () => {
  assert.equal(C.verdict(4.4999, 4.5), 'khong');
  assert.equal(C.verdict(4.67, 4.5), 'sat');
  assert.equal(C.verdict(4.8, 4.5), 'dat');
  assert.equal(C.verdict(3.29, 3), 'sat');
  assert.equal(C.grade(4.4999), 'AA chữ lớn');
  assert.equal(C.needFor(24, 400), 3);
  assert.equal(C.needFor(19, 700), 3);
  assert.equal(C.needFor(19, 600), 4.5);
});

test('hover và nhấn đi về phía tăng tương phản với chữ nằm trên', () => {
  assert.equal(C.deriveState('#D24100', '#FFFFFF', 0.05), '#B93A07');
  assert.ok(C.contrast('#FFFFFF', '#B93A07') > C.contrast('#FFFFFF', '#D24100'));
  assert.equal(C.deriveState('#FA8822', '#16261B', 0.05), '#FEA05B');
  assert.ok(C.contrast('#16261B', '#FEA05B') > C.contrast('#16261B', '#FA8822'));
});

test('deltaE: cùng màu bằng 0, đen và trắng cách nhau 1', () => {
  assert.equal(C.deltaE('#D24100', '#d24100'), 0);
  // oklch ngoài gam bị cắt kênh nhưng parse không làm tròn: gần bằng 0, không đúng bằng 0
  assert.ok(C.deltaE('#D24100', 'oklch(0.58 0.19 38)') < 0.002);
  assert.equal(Math.round(C.deltaE('#000', '#fff') * 100) / 100, 1);
});

test('deriveTheme: đủ vai dẫn xuất, mọi cặp của theme mẫu đạt và không sát ngưỡng', () => {
  const { vars, notes } = C.deriveTheme(LIGHT, 'light');
  for (const k of C.DERIVED) assert.ok(vars[k], `thiếu ${k}`);
  const rows = C.measure(vars);
  assert.equal(rows.length, C.PAIRS.length);
  assert.deepEqual(rows.filter(r => r.verdict !== 'dat').map(r => `${r.fg}/${r.bg} ${r.ratio}`), []);
  assert.deepEqual(notes, []);
});

test('deriveTheme: màu gốc sát ngưỡng thì báo sat; màu trạng thái người dùng chọn bị chỉnh thì có ghi chú', () => {
  const rows = C.measure(C.deriveTheme(CAM, 'light').vars);
  const btn = rows.find(r => r.fg === 'on-primary' && r.bg === 'primary');
  assert.equal(btn.ratio, 4.66);
  assert.equal(btn.verdict, 'sat');
  const { notes } = C.deriveTheme({ ...CAM, success: '#7CD591' }, 'light');
  assert.ok(notes.some(n => n.startsWith('success: #7CD591 → ')), notes.join(' | '));
});

test('deriveTheme báo thiếu màu gốc và màu không đọc được', () => {
  assert.throws(() => C.deriveTheme({ bg: '#fff' }, 'light'), /Thiếu màu gốc: surface, ink/);
  assert.throws(() => C.deriveTheme({ ...LIGHT, primary: 'xanh' }, 'light'), /Không đọc được màu primary/);
});

test('overrides ghi đè vai dẫn xuất và vẫn được đo', () => {
  const { vars } = C.deriveTheme(LIGHT, 'light', { 'primary-hover': '#5EEAD4' });
  assert.equal(vars['primary-hover'], '#5EEAD4');
  assert.equal(C.measure(vars).find(r => r.bg === 'primary-hover').verdict, 'khong');
});

test('cặp có lớp dưới: lớp phủ hover trộn lên --surface trước khi đo', () => {
  const { vars } = C.deriveTheme(LIGHT, 'light');
  const row = C.measure(vars).find(r => r.bg === 'hover');
  assert.equal(row.under, 'surface');
  assert.ok(row.ratio > 15);
});
