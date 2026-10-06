// Kiểm khung bấm thử (templates/map-shell.html) trên trình duyệt thật bằng run.mjs của sketch-to-site:
// lối tắt mở đúng kiểu đã khai, lối tắt mở trang có đường về, bấm thử đếm lần bấm, Ctrl+K, mục lục; và ở cỡ dự án thật
// (tests/big-fixture.js: 150 chức năng, 11 vai, 12 module, nhãn dài) ở khổ 1440 và 390: không lỗi console, không tràn ngang,
// không chữ bị cắt, tương phản đạt. Không có Edge hay Chrome thì bỏ qua. Chạy: node --test skills/sketch-to-map/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { build } = require('./big-fixture.js');

const SKILL = path.resolve(__dirname, '..');
const MAP = path.join(SKILL, 'scripts', 'map.mjs');
const RUN = path.join(SKILL, '..', 'sketch-to-site', 'templates', 'qa-kit', 'run.mjs');
const load = (f, key) => { const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(SKILL, 'templates', f), 'utf8'), ctx); return JSON.parse(JSON.stringify(ctx.window[key])); };
const example = () => ({ F: load('features.example.js', 'FEATURES'), L: load('layout.example.js', 'LAYOUT') });

// Dựng thư mục prototype, chạy map.mjs check (chép khung thành map/index.html), rồi run.mjs với các bước
function shell(t, data, steps, [w, h, mobile] = ['1440', '900', '0']) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'map-shell-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify(data.F)};`);
  fs.writeFileSync(path.join(dir, 'map', 'layout.js'), `window.LAYOUT = ${JSON.stringify(data.L)};`);
  const c = spawnSync(process.execPath, [MAP, 'check', dir], { encoding: 'utf8' });
  assert.equal(c.status, 0, c.stdout + c.stderr);
  fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ steps }));
  const r = spawnSync(process.execPath, [RUN, path.join(dir, 'map', 'index.html'), path.join(dir, 'steps.json'), path.join(dir, 'out'), w, h, mobile], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return null;
  assert.equal(r.status, 0, r.stderr);
  return { rep: JSON.parse(r.stdout), dir };
}
const step = (rep, name) => rep.find(s => s.step === name);
// Mọi bước: không lỗi console, không tràn ngang, không chữ bị cắt hay tràn khỏi khối, tương phản đạt
function clean(rep, label = '') {
  for (const s of rep) {
    assert.deepEqual(s.errors, [], `${label} ${s.step}: ${s.errors.join(' | ')}`);
    if (!s.dims) continue;
    assert.ok(s.dims.sw <= s.dims.cw, `${label} ${s.step}: tràn ngang ${s.dims.sw} > ${s.dims.cw}`);
    assert.deepEqual(s.dims.cut, [], `${label} ${s.step}: chữ bị cắt ${JSON.stringify(s.dims.cut)}`);
    assert.deepEqual(s.dims.wide || [], [], `${label} ${s.step}: ${JSON.stringify(s.dims.wide)}`);
    assert.deepEqual(s.dims.contrast || [], [], `${label} ${s.step}: tương phản ${JSON.stringify(s.dims.contrast)}`);
  }
}
const CLOSE = "document.querySelectorAll('dialog[open]').forEach(d => d.close());";
const KIND = "(document.querySelector('dialog[open]') || { dataset: {} }).dataset.kind || null";

test('khung bấm thử: lối tắt mở đúng kiểu, xong thì ở lại màn đang đứng', t => {
  const run = shell(t, example(), [
    { name: 'trang chủ', check: "({ top: document.querySelector('.pf').classList.contains('nav-top'), bands: document.querySelectorAll('.band').length, screen: MAP_SHELL.state.screen })" },
    { name: 'hộp thoại', js: "document.querySelector('.band [data-feature=\"F-01\"]').click()", check: KIND },
    { name: 'xong', js: "document.querySelector('dialog[open] .btn-primary').click()", check: "({ screen: MAP_SHELL.state.screen, open: document.querySelectorAll('dialog[open]').length, toast: document.getElementById('toast').textContent })" },
    { name: 'ngăn trượt', js: "document.querySelector('.band [data-feature=\"F-06\"]').click()", check: KIND },
    { name: 'sheet trên app', js: `${CLOSE} MAP_SHELL.setRole('benh-nhan'); MAP_SHELL.go('app-lich'); document.querySelector('.pf-app [data-feature="F-20"]').click()`, check: KIND },
  ]);
  if (!run) return t.skip('không có trình duyệt');
  clean(run.rep);
  assert.deepEqual(step(run.rep, 'trang chủ').check, { top: true, bands: 2, screen: 'hom-nay' });
  assert.equal(step(run.rep, 'hộp thoại').check, 'hop-thoai');
  const x = step(run.rep, 'xong').check;
  assert.equal(x.screen, 'hom-nay');
  assert.equal(x.open, 0);
  assert.match(x.toast, /vẫn ở Hôm nay/);
  assert.equal(step(run.rep, 'ngăn trượt').check, 'ngan-truot');
  assert.equal(step(run.rep, 'sheet trên app').check, 'sheet');
});

test('khung bấm thử: lối tắt mở trang có thanh Quay lại kèm ve, Xong thì về màn cũ', t => {
  const run = shell(t, example(), [
    { name: 'sang trang', js: "MAP_SHELL.setRole('bac-si'); MAP_SHELL.go('ca-kham'); document.querySelector('[data-feature=\"F-09\"]').click()",
      check: "({ screen: MAP_SHELL.state.screen, bar: (document.querySelector('.backbar') || {}).textContent || '' })" },
    { name: 'về', js: "document.querySelector('.backbar .btn-primary').click()", check: "({ screen: MAP_SHELL.state.screen, bar: !!document.querySelector('.backbar'), toast: document.getElementById('toast').textContent })" },
  ]);
  if (!run) return t.skip('không có trình duyệt');
  clean(run.rep);
  const a = step(run.rep, 'sang trang').check;
  assert.equal(a.screen, 'phieu-kham');
  assert.match(a.bar, /Quay lại Ca khám hôm nay/);
  assert.match(a.bar, /Lưu phiếu xong thì về Ca khám hôm nay/);
  assert.deepEqual({ ...step(run.rep, 'về').check, toast: undefined }, { screen: 'ca-kham', bar: false, toast: undefined });
  assert.match(step(run.rep, 'về').check.toast, /đã về Ca khám hôm nay/);
});

test('khung bấm thử: hoãn có nhãn Giai đoạn sau và trang chờ; bấm thử đếm lần bấm tới chức năng; Ctrl+K; mục lục tới đúng chỗ', t => {
  const run = shell(t, example(), [
    { name: 'hoãn', js: "MAP_SHELL.setRole('le-tan'); MAP_SHELL.go('ho-so'); document.querySelector('[data-feature=\"F-24\"] button').click()",
      check: "document.querySelector('[data-feature=\"F-24\"]').textContent" },
    { name: 'bấm thử', js: "MAP_SHELL.startTask(0); document.querySelector('.band [data-feature=\"F-01\"]').click()",
      check: "document.getElementById('banner').textContent" },
    { name: 'Ctrl+K', js: `${CLOSE} document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
      const q = document.querySelector('dialog.k-palette input'); q.value = 'thu tiền và'; q.dispatchEvent(new Event('input'));
      q.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));`,
      check: `({ screen: MAP_SHELL.state.screen, kind: ${KIND} })` },
    { name: 'mục lục', js: `${CLOSE} document.getElementById('btn-index').click()`, check: "document.querySelectorAll('.ix-row').length" },
    { name: 'xem chỗ', js: "[...document.querySelectorAll('.ix-row')].find(r => r.textContent.includes('Cài nhắc hẹn tự động')).querySelector('button').click()",
      check: "({ role: MAP_SHELL.state.role, screen: MAP_SHELL.state.screen, tab: (document.querySelector('[role=tab][aria-selected=true]') || {}).textContent })" },
  ]);
  if (!run) return t.skip('không có trình duyệt');
  clean(run.rep);
  assert.match(step(run.rep, 'hoãn').check, /Giai đoạn sau/);
  assert.match(step(run.rep, 'bấm thử').check, /Đã tới nơi sau 1 lần bấm/);
  assert.deepEqual(step(run.rep, 'Ctrl+K').check, { screen: 'thu-tien', kind: 'ngan-truot' });
  assert.equal(step(run.rep, 'mục lục').check, 25);
  assert.deepEqual(step(run.rep, 'xem chỗ').check, { role: 'quan-ly', screen: 'cai-dat', tab: 'Nhắc hẹn' });
});

// Mọi trang chủ, một màn chi tiết có 4 tab, mục lục 150 chức năng, mở một ngăn trượt có chữ dài
function bigSteps(d, narrow) {
  const s = d.L.roles.map(r => ({ name: `chủ ${r.id}`, js: `${CLOSE} MAP_SHELL.setRole('${r.id}'); MAP_SHELL.go('${r.home}')`, check: 'MAP_SHELL.state.screen' }));
  s.push({ name: 'chi tiết', js: "MAP_SHELL.setRole('le-tan'); MAP_SHELL.go('hoc-vien-ct')", check: "document.querySelectorAll('[role=tab]').length" });
  s.push({ name: 'ngăn trượt', js: "document.querySelectorAll('[role=tab]')[1].click(); document.querySelector('.zone [data-mo=\"ngan-truot\"]').click()", check: KIND });
  if (narrow) s.push({ name: 'menu thu gọn', js: CLOSE, check: "({ toggle: getComputedStyle(document.querySelector('.pf-menu-toggle')).display !== 'none', nav: getComputedStyle(document.getElementById('pf-nav')).display })" });
  s.push({ name: 'mục lục', js: `${CLOSE} document.getElementById('btn-index').click()`, check: "document.querySelectorAll('.ix-row').length" });
  return s;
}

for (const [w, h, mobile] of [['1440', '900', '0'], ['390', '844', '1']]) {
  test(`khung bấm thử cỡ dự án thật ở ${w}: mọi trang chủ, chi tiết nhiều tab, ngăn trượt, mục lục sạch`, t => {
    const d = build();
    const run = shell(t, d, bigSteps(d, w === '390'), [w, h, mobile]);
    if (!run) return t.skip('không có trình duyệt');
    clean(run.rep, w);
    for (const r of d.L.roles) assert.equal(step(run.rep, `chủ ${r.id}`).check, r.home, r.id);
    assert.equal(step(run.rep, 'chi tiết').check, 4);
    assert.equal(step(run.rep, 'ngăn trượt').check, 'ngan-truot');
    assert.equal(step(run.rep, 'mục lục').check, d.F.features.length);
    if (w === '390') assert.deepEqual(step(run.rep, 'menu thu gọn').check, { toggle: true, nav: 'none' });
  });
}

test('check --shots: chụp trang chủ mỗi vai ở 1440, vai trên app thêm 390, chỉ một ảnh để mở', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'map-shots-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const d = example();
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify(d.F)};`);
  fs.writeFileSync(path.join(dir, 'map', 'layout.js'), `window.LAYOUT = ${JSON.stringify(d.L)};`);
  const r = spawnSync(process.execPath, [MAP, 'check', dir, '--shots'], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const shots = fs.readdirSync(path.join(dir, 'map', '_shots')).filter(f => f.endsWith('.png')).sort();
  assert.deepEqual(shots, ['bac-si-1440.png', 'benh-nhan-1440.png', 'benh-nhan-390.png', 'le-tan-1440.png', 'quan-ly-1440.png']);
  assert.equal((r.stdout.match(/^Mở một ảnh: /gm) || []).length, 1);
  assert.match(r.stdout, /Mở một ảnh: .*le-tan-1440\.png/);
  assert.doesNotMatch(r.stdout, /Khung bấm thử: /);
});
