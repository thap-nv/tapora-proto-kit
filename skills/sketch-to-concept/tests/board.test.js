// Kiểm bảng concept và màn then chốt trong trình duyệt thật (Edge/Chrome headless, qua run.mjs của sketch-to-site),
// và kiểm preflight trên thư mục concept dựng từ khuôn. Không có trình duyệt thì các test trình duyệt tự bỏ qua.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SKILL = path.resolve(__dirname, '..');
const S2S = path.resolve(SKILL, '..', 'sketch-to-site');
const RUN = path.join(S2S, 'templates', 'qa-kit', 'run.mjs');
const PREFLIGHT = path.join(S2S, 'scripts', 'preflight.py');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

// Mọi thư mục tạm của file test này; xoá hết khi chạy xong
const made = [];
const tmpdir = prefix => { const d = fs.mkdtempSync(path.join(os.tmpdir(), prefix)); made.push(d); return d; };
test.after(() => { for (const d of made) fs.rmSync(d, { recursive: true, force: true }); });

// Dựng thư mục concept/ đúng như SKILL.md hướng dẫn: chép khuôn, mỗi concept một màn then chốt
function fixture(extraData = '') {
  const dir = tmpdir('concept-');
  const t = f => path.join(SKILL, 'templates', f);
  fs.copyFileSync(t('concept-board.html'), path.join(dir, 'index.html'));
  fs.writeFileSync(path.join(dir, 'concepts.js'), fs.readFileSync(t('concepts.js'), 'utf8') + extraData);
  fs.copyFileSync(t('tokens.js'), path.join(dir, 'tokens.js'));
  fs.copyFileSync(path.join(S2S, 'templates', 'theme.js'), path.join(dir, 'theme.js'));
  const screen = fs.readFileSync(t('key-screen.html'), 'utf8');
  for (const id of ['a', 'b', 'c']) fs.writeFileSync(path.join(dir, `${id}.html`), screen.replace('data-concept="a"', `data-concept="${id}"`));
  return dir;
}

let noBrowser = false;
// Trả về báo cáo của run.mjs; null khi máy không có trình duyệt
function run(dir, file, steps, { w = 1440, h = 900, query = '' } = {}) {
  if (noBrowser) return null;
  const sf = path.join(os.tmpdir(), `steps-${process.pid}-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(sf, JSON.stringify({ query, steps }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, RUN, path.join(dir, file), sf, tmpdir('concept-shots-'), String(w), String(h)],
    { encoding: 'utf8', timeout: 90000 });
  fs.rmSync(sf, { force: true });
  if (r.status === 4) { noBrowser = true; return null; }
  assert.equal(r.status, 0, `run.mjs thoát mã ${r.status}: ${r.stderr}`);
  return JSON.parse(r.stdout);
}
const step = (report, name) => report.find(s => s.step === name);
const noErrors = report => assert.deepEqual(report.flatMap(s => s.errors), []);

test('bảng concept mở bằng file:// không lỗi, đủ 3 tile, có dải báo dữ liệu mẫu', t => {
  const r = run(fixture(), 'index.html', [{ name: 'tiles', check: `JSON.stringify({
    tiles: document.querySelectorAll('[data-tile]').length,
    banner: !!document.querySelector('[data-example-banner]'),
    screens: [...document.querySelectorAll('iframe[data-screen]')].map(f => f.getAttribute('src').split('?')[0]),
    title: document.title })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'tiles').check);
  assert.equal(v.tiles, 3);
  assert.equal(v.banner, true);
  assert.deepEqual(v.screens, ['a.html', 'b.html', 'c.html']);
  assert.match(v.title, /Bảng concept/);
});

test('mỗi tile mang token của concept mình, bảng tương phản có số và mức', t => {
  const r = run(fixture(), 'index.html', [{ name: 'tokens', check: `(() => {
    const cs = window.CONCEPTS.concepts;
    const v = (id, k) => getComputedStyle(document.querySelector('[data-tile="' + id + '"]')).getPropertyValue(k).trim().toUpperCase();
    const own = cs.every(c => v(c.id, '--primary') === (c.colors.light || c.colors.dark).primary.toUpperCase());
    const rows = [...document.querySelectorAll('[data-tile] [data-contrast]')];
    const okRows = rows.length >= 6 && rows.every(e => /^\\d+,\\d{2}:1$/.test(e.querySelector('[data-ratio]').textContent.trim())
      && ['AAA', 'AA', 'AA chữ lớn', 'Không đạt'].includes(e.dataset.grade));
    return JSON.stringify({ own, okRows, n: rows.length });
  })()` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'tokens').check);
  assert.equal(v.own, true);
  assert.equal(v.okRows, true, `hàng tương phản: ${v.n}`);
});

test('bấm nền tối: tile theo bảng màu tối, màn xem trước nhận ?theme=dark', t => {
  const r = run(fixture(), 'index.html', [{ name: 'dark', js: `document.querySelector('[data-set-theme="dark"]').click()`, check: `(() => {
    const a = window.CONCEPTS.concepts.find(c => c.id === 'a');
    const bg = getComputedStyle(document.querySelector('[data-tile="a"]')).getPropertyValue('--bg').trim().toUpperCase();
    return JSON.stringify({ theme: document.documentElement.dataset.theme, bg, want: a.colors.dark.background.toUpperCase(),
      src: document.querySelector('iframe[data-screen="a"]').getAttribute('src') });
  })()` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'dark').check);
  assert.equal(v.theme, 'dark');
  assert.equal(v.bg, v.want);
  assert.match(v.src, /theme=dark/);
});

test('khung Trộn in mã trộn và mở màn xem trước với mã đó', t => {
  const r = run(fixture(), 'index.html', [{ name: 'mix', js: `(() => {
    const set = (k, v) => { const s = document.querySelector('[data-mix="' + k + '"]'); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); };
    set('man', 'a'); set('mau', 'b'); set('chu', 'a'); set('nut', 'c');
  })()`, check: `JSON.stringify({ code: document.querySelector('[data-mix-code]').textContent.trim(),
    src: decodeURIComponent(document.querySelector('iframe[data-mix-preview]').getAttribute('src')) })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'mix').check);
  assert.equal(v.code, 'man:A mau:B chu:A nut:C');
  assert.match(v.src, /^a\.html\?/);
  assert.match(v.src, /mix=man:A mau:B chu:A nut:C/);
});

test('màn then chốt tự áp token của concept, nhận mã trộn và nạp font', t => {
  const r = run(fixture(), 'a.html', [{ name: 'screen', check: `(() => {
    const cs = window.CONCEPTS.concepts, f = id => cs.find(c => c.id === id);
    const v = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const link = document.getElementById('concept-fonts');
    return JSON.stringify({ concept: document.documentElement.dataset.concept,
      primary: v('--primary').toUpperCase() === (f('b').colors.light || f('b').colors.dark).primary.toUpperCase(),
      radius: v('--radius-md') === f('c').shape.radius.md,
      font: !!link && link.href.includes(f('a').fontFamily.display.replace(/ /g, '+')) });
  })()` }], { query: '?mix=mau:B%20chu:A%20nut:C' });
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'screen').check), { concept: 'a', primary: true, radius: true, font: true });
});

test('màn then chốt theo ?theme=dark', t => {
  const r = run(fixture(), 'a.html', [{ name: 'dark', check: `(() => {
    const a = window.CONCEPTS.concepts.find(c => c.id === 'a');
    return getComputedStyle(document.body).backgroundColor + ' | ' + a.colors.dark.background;
  })()` }], { query: '?theme=dark' });
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const [css, hex] = step(r, 'dark').check.split(' | ');
  const [R, G, B] = hex.match(/[0-9a-f]{2}/gi).map(x => parseInt(x, 16));
  assert.equal(css, `rgb(${R}, ${G}, ${B})`);
});

test('bảng so trục: dữ liệu mẫu đạt, concept chung khung thì hiện cảnh báo', t => {
  const good = run(fixture(), 'index.html', [{ name: 'axes', check: `JSON.stringify({ rows: document.querySelectorAll('[data-axes-row]').length,
    warn: document.querySelectorAll('[data-axes-warning]').length })` }]);
  if (!good) return t.skip('không có trình duyệt');
  noErrors(good);
  assert.deepEqual(JSON.parse(step(good, 'axes').check), { rows: 6, warn: 0 });
  const bad = run(fixture('\nCONCEPTS.concepts[2].axes = Object.assign({}, CONCEPTS.concepts[0].axes);\n'), 'index.html',
    [{ name: 'axes', check: `document.querySelector('[data-axes-warning]') ? document.querySelector('[data-axes-warning]').textContent : ''` }]);
  assert.match(step(bad, 'axes').check, /A và C/);
});

test('bảng concept ở khổ 390 không tràn ngang, chữ không bị cắt', t => {
  const r = run(fixture(), 'index.html', [{ name: 'mobile' }], { w: 390, h: 844 });
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  for (const s of r) {
    assert.ok(s.dims === null || s.dims.sw <= s.dims.cw, `${s.step}: tràn ngang ${JSON.stringify(s.dims)}`);
    assert.deepEqual(s.dims ? s.dims.cut : [], []);
  }
});

test('màn then chốt của app: khuôn mobile nhận token của concept qua tên biến chung (app.css)', t => {
  // Dựng đúng như SKILL.md A3 hướng dẫn: màn theo mobile/screen.html, <head> token lấy của key-screen.html
  const dir = fixture();
  const mobile = path.join(S2S, 'templates', 'mobile');
  fs.copyFileSync(path.join(mobile, 'app.css'), path.join(dir, 'app.css'));
  fs.copyFileSync(path.join(mobile, 'app.js'), path.join(dir, 'app.js'));
  const screen = fs.readFileSync(path.join(mobile, 'screen.html'), 'utf8')
    .replace('<link rel="stylesheet" href="../assets/tokens.css">\n<script src="../assets/tw.js"></script>\n<script src="../assets/theme.js"></script>',
      '<script src="theme.js"></script>\n<script src="concepts.js"></script>\n<script src="tokens.js" data-concept="c"></script>')
    .replace('../assets/app.css', 'app.css').replace('../assets/app.js', 'app.js')
    .replace(/<script src="\.\.\/assets\/data\.js"><\/script>[\s\S]*?store\.on\(draw\);[\s\S]*?<\/script>/, '');
  assert.ok(screen.includes('data-concept="c"') && !screen.includes('../assets/'), 'khuôn mobile đã đổi, cập nhật test');
  fs.writeFileSync(path.join(dir, 'app-c.html'), screen);
  const r = run(dir, 'app-c.html', [{ name: 'app', check: `(() => {
    const c = window.CONCEPTS.concepts.find(x => x.id === 'c');
    const cs = getComputedStyle(document.body);
    return JSON.stringify({ bg: cs.backgroundColor, want: c.colors.light.background, font: cs.fontFamily,
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toUpperCase(), wantAccent: c.colors.light.accent });
  })()` }], { w: 390, h: 844 });
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'app').check);
  const [R, G, B] = v.want.match(/[0-9a-f]{2}/gi).map(x => parseInt(x, 16));
  assert.equal(v.bg, `rgb(${R}, ${G}, ${B})`);
  assert.match(v.font, /^"Be Vietnam Pro"/);
  assert.equal(v.accent, v.wantAccent);
});

test('thiếu concepts.js: bảng báo rõ file thiếu, không ném lỗi', t => {
  const dir = fixture();
  fs.rmSync(path.join(dir, 'concepts.js'));
  const r = run(dir, 'index.html', [{ name: 'missing', check: `JSON.stringify({ err: (document.querySelector('[data-board-error]') || {}).textContent || '',
    tiles: document.querySelectorAll('[data-tile]').length, rest: getComputedStyle(document.querySelector('main')).display })` }]);
  if (!r) return t.skip('không có trình duyệt');
  assert.deepEqual(r.flatMap(s => s.errors).filter(e => !e.startsWith('LOG ')), [], 'chỉ được có lỗi tải file, không có lỗi JS');
  const v = JSON.parse(step(r, 'missing').check);
  assert.match(v.err, /concepts\.js/);
  assert.equal(v.tiles, 0);
  assert.equal(v.rest, 'none', 'phần còn lại của bảng phải ẩn khi không dựng được');
});

test('id concept sai quy ước: bảng báo lỗi, không chèn HTML từ dữ liệu', t => {
  const r = run(fixture(`\nCONCEPTS.concepts[2].id = 'c"><b id="inj">x</b>';\n`), 'index.html', [{ name: 'bad', check: `JSON.stringify({
    err: (document.querySelector('[data-board-error]') || {}).textContent || '', inj: !!document.getElementById('inj'),
    tiles: document.querySelectorAll('[data-tile]').length })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'bad').check);
  assert.match(v.err, /id chỉ gồm chữ thường/);
  assert.equal(v.inj, false);
  assert.equal(v.tiles, 0);
});

test('concept dùng font nền tảng: bảng ghi rõ, preflight không cảnh báo', t => {
  const dir = fixture("\nObject.assign(CONCEPTS.concepts[0], { fontFamily: { display: 'Newsreader', body: 'system-ui' } });\n");
  const pf = spawnSync(PYTHON, [PREFLIGHT, dir], { encoding: 'utf8' });
  assert.equal(pf.status, 0, pf.stdout);
  assert.match(pf.stdout, /0 lỗi · 0 cảnh báo/);
  const r = run(dir, 'index.html', [{ name: 'label', check: `document.querySelector('[data-tile="a"] .spec h3').textContent` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.match(step(r, 'label').check, /font nền tảng/);
});

test('đường subagent: màn then chốt nhận concept từ file riêng {id}.concept.js', t => {
  const dir = fixture();
  const ctx = { window: {} };
  require('node:vm').runInNewContext(fs.readFileSync(path.join(SKILL, 'templates', 'concepts.js'), 'utf8'), ctx);
  const data = ctx.window.CONCEPTS;
  const a = data.concepts.find(c => c.id === 'a');
  fs.writeFileSync(path.join(dir, 'concepts.js'), `window.CONCEPTS = ${JSON.stringify({ project: data.project, brief: data.brief, content: data.content, concepts: [] })};\n`);
  fs.writeFileSync(path.join(dir, 'a.concept.js'), `CONCEPTS.concepts.push(${JSON.stringify(a)});\n`);
  const html = fs.readFileSync(path.join(dir, 'a.html'), 'utf8').replace('<script src="concepts.js"></script>', '<script src="concepts.js"></script>\n<script src="a.concept.js"></script>');
  fs.writeFileSync(path.join(dir, 'a.html'), html);
  const r = run(dir, 'a.html', [{ name: 'part', check: `getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.equal(step(r, 'part').check.toUpperCase(), a.colors.light.primary.toUpperCase());
});

test('preflight: thư mục concept dựng từ khuôn không có lỗi, không có cảnh báo', () => {
  const r = spawnSync(PYTHON, [PREFLIGHT, fixture()], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /0 lỗi · 0 cảnh báo/, r.stdout);
});

test('preflight bắt font thiếu dấu tiếng Việt khai trong concepts.js', () => {
  const dir = fixture("\nObject.assign(CONCEPTS.concepts[0], { fontFamily: { display: 'Outfit', body: 'Be Vietnam Pro' } });\n");
  const r = spawnSync(PYTHON, [PREFLIGHT, dir], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /P07[^\n]*Outfit|Outfit[^\n]*P07/);
});
