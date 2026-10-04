// Kiểm lệnh scripts/themes.mjs: themes.json → themes.css, đo mọi cặp ở mọi theme. Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const C = require('../templates/color.js');

const S2S = path.resolve(__dirname, '..');
const THEMES = path.join(S2S, 'scripts', 'themes.mjs');
const TEMPLATE = path.join(S2S, 'templates', 'themes.json');
const CAM = { bg: '#FBFAF9', surface: '#FFFFFF', ink: '#2E2A27', muted: '#6E6A66', line: '#E7E4E1', primary: 'oklch(0.58 0.19 38)', 'on-primary': '#FFFFFF',
  accent: 'oklch(0.58 0.19 38)', 'on-accent': '#FFFFFF', destructive: 'oklch(0.5 0.19 22)', 'on-destructive': '#FFFFFF' };

function proto(t, json) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'themes-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'site', 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'site', 'assets', 'themes.json'), typeof json === 'string' ? json : JSON.stringify(json, null, 2));
  return dir;
}
const run = (dir, ...a) => spawnSync(process.execPath, [THEMES, dir, ...a], { encoding: 'utf8' });
const css = dir => fs.readFileSync(path.join(dir, 'site', 'assets', 'themes.css'), 'utf8');
// Khuôn chỉ có theme sáng: chế độ tối chỉ làm khi người dùng xin ở Cổng 2. Test cần nhiều theme thì thêm theme tối mẫu này
const DARK = { mode: 'dark', seeds: { bg: '#0B0C0E', surface: '#141518', ink: '#EDEDEF', muted: '#A1A1AA', line: '#2A2B30',
  primary: '#2DD4BF', 'on-primary': '#0B0C0E', accent: '#2DD4BF', 'on-accent': '#0B0C0E', destructive: '#F97066', 'on-destructive': '#0B0C0E' }, overrides: {} };
const tpl = () => {
  const t = JSON.parse(fs.readFileSync(TEMPLATE, 'utf8'));
  t.themes.dark = JSON.parse(JSON.stringify(DARK));
  t.default.dark = 'dark';
  return t;
};

test('khuôn themes.json chỉ có theme sáng, không default.dark: chế độ tối chỉ khi người dùng xin', t => {
  const raw = JSON.parse(fs.readFileSync(TEMPLATE, 'utf8'));
  assert.deepEqual(Object.keys(raw.themes), ['light']);
  assert.deepEqual(raw.default, { light: 'light' });
  assert.match(raw._ghi_chu, /người dùng xin/);
  const dir = proto(t, raw);
  const r = run(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /1 theme · 26 cặp · 0 không đạt · 0 sát ngưỡng → đã ghi/);
  assert.doesNotMatch(css(dir), /prefers-color-scheme: dark|--theme-default-dark/);
});

test('theme sáng của khuôn và theme tối mẫu của test đạt mọi cặp, không sát ngưỡng', () => {
  const t = tpl();
  assert.deepEqual(Object.keys(t.themes), ['light', 'dark']);
  for (const [name, th] of Object.entries(t.themes)) {
    const rows = C.measure(C.deriveTheme(th.seeds, th.mode).vars);
    assert.deepEqual(rows.filter(r => r.verdict !== 'dat').map(r => `${name} ${r.fg}/${r.bg} ${r.ratio}`), []);
  }
});

test('sinh themes.css đủ khối: mặc định sáng, theme theo tên, mặc định tối theo máy, danh sách theme', t => {
  const dir = proto(t, tpl());
  const r = run(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = css(dir);
  assert.match(out, /^\/\* Sinh bởi themes\.mjs từ themes\.json \(băm [0-9a-f]{10}\)\./);
  assert.match(out, /:root\{--theme-list:"light dark";--theme-default-light:"light";--theme-default-dark:"dark";\}/);
  // Khối mặc định sáng dùng :root (mọi data-theme lạ vẫn có màu); khối theo tên và khối theo máy tối thắng nhờ độ ưu tiên cao hơn
  assert.match(out, /^:root,:root\[data-theme="light"\]\{color-scheme:light;--theme-name:"light";--theme-mode:"light";--bg:#FBFBFA;/m);
  assert.match(out, /:root\[data-theme="dark"\]\{color-scheme:dark;[^}]*--primary-hover:#[0-9A-F]{6};/);
  assert.match(out, /@media \(prefers-color-scheme: dark\)\{:root:not\(\[data-theme\]\)\{color-scheme:dark;--theme-name:"dark";/);
  for (const k of C.DERIVED) assert.ok(out.includes(`--${k}:`), `thiếu --${k}`);
  assert.match(r.stdout, /2 theme · 52 cặp · 0 không đạt · 0 sát ngưỡng → đã ghi/);
});

test('--check: khớp thì 0; sửa themes.json mà chưa chạy lại thì 1', t => {
  const dir = proto(t, fs.readFileSync(TEMPLATE, 'utf8'));
  assert.equal(run(dir).status, 0);
  assert.equal(run(dir, '--check').status, 0);
  fs.appendFileSync(path.join(dir, 'site', 'assets', 'themes.json'), '\n');
  const r = run(dir, '--check');
  assert.equal(r.status, 1);
  assert.match(r.stdout, /cũ hơn themes\.json/);
});

test('cặp dưới ngưỡng: không ghi file, thoát mã 1, in rõ cặp nào', t => {
  const bad = tpl();
  bad.themes.light.seeds.primary = '#FFD54F';
  const dir = proto(t, bad);
  const r = run(dir);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /KHÔNG 1\.\d\d:1 +cần 4\.5 +Chữ trên nút chính/);
  assert.equal(fs.existsSync(path.join(dir, 'site', 'assets', 'themes.css')), false);
});

test('theme thứ ba (thương hiệu): thêm một mục là có khối riêng; màu gốc sát ngưỡng thì in SÁT', t => {
  const three = tpl();
  three.themes['cam-dat'] = { mode: 'light', seeds: CAM };
  const dir = proto(t, three);
  const r = run(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(css(dir), /--theme-list:"light dark cam-dat"/);
  assert.match(css(dir), /:root\[data-theme="cam-dat"\]\{color-scheme:light;--theme-name:"cam-dat";/);
  assert.match(r.stdout, /theme cam-dat \(sáng\)[\s\S]*SÁT +4\.66:1 +cần 4\.5 +Chữ trên nút chính/);
});

test('màu biểu đồ: sinh --chart-n và đo 3:1 trên thẻ', t => {
  const withChart = tpl();
  withChart.themes.light.chart = ['#2563EB', '#E8710A', '#EEF2FF'];
  const dir = proto(t, withChart);
  const r = run(dir);
  assert.equal(r.status, 1, 'màu biểu đồ thứ 3 gần trắng phải bị chặn');
  assert.match(r.stdout, /Màu biểu đồ 3 trên thẻ/);
});

test('đầu vào sai: tên theme sai quy ước, thiếu màu gốc, default trỏ tới theme không có → mã 2', t => {
  const a = tpl(); a.themes['Xanh Lá'] = a.themes.light;
  assert.equal(run(proto(t, a)).status, 2);
  const b = tpl(); delete b.themes.dark.seeds.ink;
  const rb = run(proto(t, b));
  assert.equal(rb.status, 2);
  assert.match(rb.stderr, /Theme "dark": Thiếu màu gốc: ink/);
  const c = tpl(); c.default.dark = 'toi';
  assert.equal(run(proto(t, c)).status, 2);
});

// ---- theme.js: chọn theme theo tên, đọc danh sách từ themes.css ----
const RUN = path.join(S2S, 'templates', 'qa-kit', 'run.mjs');
function runPage(dir, page, steps, query = '') {
  const sf = path.join(dir, `steps-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(sf, JSON.stringify({ query, steps }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, RUN, path.join(dir, page), sf, path.join(dir, 'out')], { encoding: 'utf8', timeout: 90000 });
  if (r.status === 4) return null;
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
const STATE = `JSON.stringify({ attr: document.documentElement.dataset.theme || null, get: theme.get(), list: theme.list(), mode: theme.mode(),
  bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() })`;
function themedSite(t, withCss = true, edit = x => x) {
  const three = tpl();
  three.themes['cam-dat'] = { mode: 'light', seeds: CAM };
  edit(three);
  const dir = proto(t, three);
  if (withCss) assert.equal(run(dir).status, 0);
  fs.copyFileSync(path.join(S2S, 'templates', 'theme.js'), path.join(dir, 'site', 'assets', 'theme.js'));
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>T</title>
<script src="assets/theme.js"></script>${withCss ? '<link rel="stylesheet" href="assets/themes.css">' : ''}</head><body><p>Xin chào</p></body></html>`);
  return path.join(dir, 'site');
}

test('theme.js: ?theme=<tên> ép theme thương hiệu; list và mode đọc từ themes.css', t => {
  const site = themedSite(t);
  const r = runPage(site, 'index.html', [{ name: 's', check: STATE }], '?theme=cam-dat');
  if (!r) return t.skip('không có trình duyệt');
  assert.deepEqual(JSON.parse(r.find(s => s.step === 's').check),
    { attr: 'cam-dat', get: 'cam-dat', list: ['light', 'dark', 'cam-dat'], mode: 'light', bg: '#FBFAF9' });
});

test('theme.js: không ép thì theo theme mặc định; toggle đổi giữa mặc định sáng và tối', t => {
  const site = themedSite(t);
  const r = runPage(site, 'index.html', [
    { name: 'dau', check: STATE },
    { name: 'toi', js: 'theme.toggle()', wait: 100, check: STATE },
    { name: 'sang', js: 'theme.toggle()', wait: 100, check: STATE },
  ]);
  if (!r) return t.skip('không có trình duyệt');
  const v = n => JSON.parse(r.find(s => s.step === n).check);
  assert.equal(v('dau').attr, null);
  assert.equal(v('dau').get, 'light');
  assert.equal(v('toi').attr, 'dark');
  assert.equal(v('toi').mode, 'dark');
  assert.equal(v('sang').attr, 'light');
});

test('themes.css: tên theme lạ (?theme=khong-co, theme đã đổi tên) vẫn có màu của theme mặc định sáng', t => {
  const site = themedSite(t);
  const r = runPage(site, 'index.html', [{ name: 's', check: STATE }], '?theme=khong-co');
  if (!r) return t.skip('không có trình duyệt');
  const v = JSON.parse(r.find(s => s.step === 's').check);
  assert.equal(v.attr, 'khong-co');
  assert.equal(v.bg, '#FBFBFA');
});

test('theme.js: themes.json không có default.dark thì toggle ở lại theme mặc định sáng, không đặt "dark"', t => {
  const site = themedSite(t, true, x => { delete x.default.dark; delete x.themes.dark; });
  const r = runPage(site, 'index.html', [{ name: 'doi', js: 'theme.toggle()', wait: 100, check: STATE }]);
  if (!r) return t.skip('không có trình duyệt');
  const v = JSON.parse(r.find(s => s.step === 'doi').check);
  assert.equal(v.attr, 'light');
  assert.equal(v.bg, '#FBFBFA');
});

test('theme.js: dự án cũ chưa có themes.css vẫn chạy với light/dark', t => {
  const site = themedSite(t, false);
  const r = runPage(site, 'index.html', [{ name: 's', check: STATE }], '?theme=dark');
  if (!r) return t.skip('không có trình duyệt');
  const v = JSON.parse(r.find(s => s.step === 's').check);
  assert.equal(v.attr, 'dark');
  assert.equal(v.get, 'dark');
  assert.deepEqual(v.list, []);
  assert.equal(v.mode, 'dark');
});

// ---- preflight.py P21: cùng một dấu băm ở Node (themes.mjs) và Python (preflight.py) ----
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
test('preflight P21: themes.css khớp băm của themes.json; sửa json mà chưa sinh lại thì LỖI', t => {
  const dir = proto(t, fs.readFileSync(TEMPLATE, 'utf8'));
  assert.equal(run(dir).status, 0);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), '<!doctype html><html lang="vi"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>T</title><link rel="stylesheet" href="assets/themes.css">'
    + '<style>p{color:var(--ink)}</style></head><body><p>Xin chào</p></body></html>');
  const pf = () => spawnSync(PYTHON, [path.join(S2S, 'scripts', 'preflight.py'), path.join(dir, 'site')], { encoding: 'utf8' });
  const ok = pf();
  assert.doesNotMatch(ok.stdout, /P21|P19|P20/, ok.stdout);
  fs.appendFileSync(path.join(dir, 'site', 'assets', 'themes.json'), '\n');
  const stale = pf();
  assert.equal(stale.status, 1, stale.stdout);
  assert.match(stale.stdout, /P21 +LỖI +themes\.css cũ hơn themes\.json/);
});
