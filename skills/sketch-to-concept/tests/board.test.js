// Kiểm bảng concept và màn then chốt trong trình duyệt thật (Edge/Chrome headless, qua run.mjs của sketch-to-site),
// và kiểm preflight trên thư mục concept dựng từ khuôn. Không có trình duyệt thì các test trình duyệt tự bỏ qua.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
// Một trình duyệt chung cho cả file (QA_CDP), thay vì mỗi lần run.mjs một trình duyệt
require('../../sketch-to-site/tests/shared-browser')();

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
  fs.writeFileSync(path.join(dir, 'concepts.js'), fs.readFileSync(t('concepts.example.js'), 'utf8') + extraData);
  fs.copyFileSync(t('tokens.js'), path.join(dir, 'tokens.js'));
  fs.copyFileSync(path.join(S2S, 'templates', 'color.js'), path.join(dir, 'color.js'));
  fs.copyFileSync(path.join(S2S, 'templates', 'theme.js'), path.join(dir, 'theme.js'));
  const screen = fs.readFileSync(t('key-screen.html'), 'utf8');
  for (const id of ['a', 'b', 'c']) fs.writeFileSync(path.join(dir, `${id}.html`), screen.replace('data-concept="a"', `data-concept="${id}"`));
  return dir;
}

// Mẫu khai mỗi concept một bảng màu (chế độ tối chỉ khi người dùng xin). Test nền tối thêm bảng tối cho a, như dự án đã xin
const A_DARK_PALETTE = { background: '#121714', foreground: '#E7EBE6', card: '#1A201C', 'card-foreground': '#E7EBE6', muted: '#232A25', 'muted-foreground': '#A3ADA6',
  border: '#2E3631', primary: '#E7EBE6', 'on-primary': '#121714', accent: '#E0574D', 'on-accent': '#121714', destructive: '#E0574D', 'on-destructive': '#121714', ring: '#E0574D' };
const A_DARK = `\nCONCEPTS.concepts[0].colors.dark = ${JSON.stringify(A_DARK_PALETTE)};`;

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
// Ảnh chụp giả (1x1) cho các test rê chuột: bảng đọc shots/<màn>-<khổ>.png
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const shots = (dir, files) => { fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); for (const f of files) fs.writeFileSync(path.join(dir, 'shots', f), PNG); };

// Vòng 2: d chỉ đổi lớp Hình, dùng màn của b; khác b ở nền và chất nền
const ROUND2 = `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'màu ấm hơn, chữ ít cổ điển' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[1])), {
  id: 'd', name: 'Than lạnh', round: 2, screen: 'b', recommended: false,
  axes: Object.assign({}, CONCEPTS.concepts[1].axes, { nen: 'Sáng tinh', chatNen: 'Giấy' }),
  colors: { light: CONCEPTS.concepts[0].colors.light } }));
`;

test('bảng concept mở bằng file:// không lỗi, đủ 3 tile, có dải báo dữ liệu mẫu', t => {
  const r = run(fixture(), 'index.html', [{ name: 'tiles', check: `JSON.stringify({
    tiles: document.querySelectorAll('[data-tile]').length,
    banner: !!document.querySelector('[data-example-banner]'),
    menu: [...document.querySelectorAll('[data-view]')].map(b => b.dataset.view),
    title: document.title })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'tiles').check);
  assert.equal(v.tiles, 3);
  assert.equal(v.banner, true);
  assert.deepEqual(v.menu, ['a', 'b', 'c']);
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
  const r = run(fixture(A_DARK), 'index.html', [{ name: 'dark', js: `document.querySelector('[data-set-theme="dark"]').click()`, check: `(() => {
    const a = window.CONCEPTS.concepts.find(c => c.id === 'a');
    const bg = getComputedStyle(document.querySelector('[data-tile="a"]')).getPropertyValue('--bg').trim().toUpperCase();
    return JSON.stringify({ theme: document.documentElement.dataset.theme, bg, want: a.colors.dark.background.toUpperCase(),
      src: document.querySelector('iframe[data-preview]').getAttribute('src') });
  })()` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'dark').check);
  assert.equal(v.theme, 'dark');
  assert.equal(v.bg, v.want);
  assert.match(v.src, /theme=dark/);
});

test('ma trận trộn: chọn ô mỗi hàng ra mã trộn, màn lớn chuyển sang bản trộn', t => {
  const r = run(fixture(), 'index.html', [{ name: 'mix', js: `(() => {
    const pick = (k, v) => document.querySelector('input[name="mix-' + k + '"][value="' + v + '"]').click();
    pick('man', 'a'); pick('mau', 'b'); pick('chu', 'a'); pick('nut', 'c');
  })()`, check: `JSON.stringify({ code: document.querySelector('[data-mix-code]').textContent.trim(),
    src: decodeURIComponent(document.querySelector('iframe[data-preview]').getAttribute('src')),
    tab: document.querySelector('[data-tab="mix"]').getAttribute('aria-pressed'),
    caption: document.querySelector('[data-preview-caption]').textContent,
    want: 'A · ' + CONCEPTS.concepts[0].name + ': ' + CONCEPTS.concepts[0].idea })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'mix').check);
  assert.equal(v.code, 'man:A mau:B chu:A nut:C');
  assert.match(v.src, /^a\.html\?/);
  assert.match(v.src, /mix=man:A mau:B chu:A nut:C/);
  assert.equal(v.tab, 'true');
  assert.equal(v.caption, v.want, 'bản trộn: chú thích là ý của concept có màn, các lớp đã có ở Mã trộn');
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
  const r = run(fixture(A_DARK), 'a.html', [{ name: 'dark', check: `(() => {
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
    .replace('<link rel="stylesheet" href="../assets/tokens.css">\n<link rel="stylesheet" href="../assets/themes.css"><!-- dự án chưa có themes.css (trước v4.2): bỏ dòng này -->\n<script src="../assets/tw.js"></script>\n<script src="../assets/theme.js"></script>',
      '<script src="theme.js"></script>\n<script src="concepts.js"></script>\n<script src="color.js"></script>\n<script src="tokens.js" data-concept="c"></script>')
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
  require('node:vm').runInNewContext(fs.readFileSync(path.join(SKILL, 'templates', 'concepts.example.js'), 'utf8'), ctx);
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

test('concept viết màu bằng oklch: bảng đo được, có hàng của vai dẫn xuất và mức sát', t => {
  const r = run(fixture(`\nwindow.CONCEPTS.concepts[0].colors.light.primary = 'oklch(0.3 0.03 150)';`), 'index.html', [{ name: 'rows', check: `JSON.stringify({
    ratio: document.querySelector('[data-tile="a"] [data-contrast="on-primary"] [data-ratio]').textContent.trim(),
    rows: document.querySelectorAll('[data-tile="a"] [data-contrast]').length,
    verdicts: [...new Set([...document.querySelectorAll('[data-tile="a"] [data-verdict]')].map(e => e.dataset.verdict))] })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'rows').check);
  assert.match(v.ratio, /^\d+,\d{2}:1$/);
  assert.ok(v.rows >= 20, `chỉ có ${v.rows} hàng`);
  assert.ok(v.verdicts.every(x => ['dat', 'sat', 'khong'].includes(x)));
});

test('thiếu color.js: bảng báo rõ file thiếu', t => {
  const dir = fixture();
  fs.rmSync(path.join(dir, 'color.js'));
  const r = run(dir, 'index.html', [{ name: 'msg', check: `document.body.textContent.includes('color.js') ? 'PASS' : 'FAIL: không báo thiếu color.js'` }]);
  if (!r) return t.skip('không có trình duyệt');
  assert.equal(step(r, 'msg').check, 'PASS');
});

test('concept chỉ có nền tối, bảng đang ở nền sáng: số đo vai dẫn xuất theo chế độ tối của màu đang hiện', t => {
  const T = require(path.join(SKILL, 'templates', 'tokens.js'));
  const want = T.checkPairs(A_DARK_PALETTE, 'dark').map(r => `${r.fg}|${r.bg}|${r.ratio.toFixed(2).replace('.', ',')}:1`);
  const r = run(fixture(`\nCONCEPTS.concepts[0].colors = { dark: ${JSON.stringify(A_DARK_PALETTE)} };`), 'index.html', [{ name: 'rows', check: `JSON.stringify([...document.querySelectorAll('[data-tile="a"] [data-contrast]')].map(li => li.dataset.contrast + '|' + li.querySelector('[data-ratio]').textContent.trim()))` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const got = JSON.parse(step(r, 'rows').check);
  assert.ok(want.length >= 20);
  assert.deepEqual(got.map(x => x.split('|')[1]), want.map(x => x.split('|')[2]));
});

// Mỗi concept một bảng màu là mặc định: nhãn "chỉ có nền …" chỉ hiện khi bảng đang ở nền mà concept không có
test('nhãn "chỉ có nền": chỉ hiện khi nền của bảng khác nền duy nhất của concept', t => {
  const label = `JSON.stringify(['a', 'b'].map(id => (document.querySelector('[data-tile="' + id + '"]').textContent.match(/chỉ có nền \\S+/) || [''])[0]))`;
  const r = run(fixture(), 'index.html', [{ name: 'sang', js: `document.querySelector('[data-set-theme="light"]').click()`, check: label },
    { name: 'toi', js: `document.querySelector('[data-set-theme="dark"]').click()`, check: label }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'sang').check), ['', 'chỉ có nền tối']);
  assert.deepEqual(JSON.parse(step(r, 'toi').check), ['chỉ có nền sáng', '']);
});

// Cột trái giữ danh sách concept theo vòng (ảnh nhỏ), màn lớn ở cột phải; bảng tổng quan (nút ▾) đóng sẵn và chưa dựng
test('bố cục: danh sách theo vòng ở cột trái, bảng tổng quan đóng sẵn, ma trận 4 hàng, màn lớn, chi tiết và So trục gập', t => {
  const r = run(fixture(), 'index.html', [{ name: 'layout', check: `JSON.stringify({
    side: !!document.querySelector('.side [data-list] [data-card]'), menu: document.querySelector('[data-overview]').hidden,
    built: document.querySelectorAll('[data-overview] [data-ov]').length,
    rounds: [...document.querySelectorAll('[data-round]')].map(e => e.dataset.round),
    cards: [...document.querySelectorAll('[data-card]')].map(e => e.dataset.card),
    rows: [...document.querySelectorAll('[data-matrix] tbody tr')].map(tr => tr.querySelectorAll('input[type=radio]').length),
    preview: !!document.querySelector('iframe[data-preview]'),
    details: document.querySelector('[data-details]').open, axes: document.querySelector('[data-axes-block]').open,
    brief: document.querySelector('details.brief').open,
    current: document.querySelector('[data-view][aria-current="true"]').dataset.view,
    visible: [...document.querySelectorAll('[data-tile]')].filter(e => !e.hidden).map(e => e.dataset.tile),
    summary: document.querySelector('[data-summary]').textContent })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'layout').check), { side: true, menu: true, built: 0, rounds: ['1'], cards: ['a', 'b', 'c'], rows: [3, 3, 3, 3], preview: true,
    details: false, axes: false, brief: false, current: 'a', visible: ['a'], summary: '3 concept qua 1 vòng' });
});

// Đỡ phải cuộn mới thấy bản trộn: hộp Trộn thấp lại và dính trên đỉnh, brief lên hàng tiêu đề,
// chú thích một dòng ở cuối thanh Trộn (không chiếm dòng riêng trên màn lớn), bấm thì cả câu thả xuống đè lên màn lớn
test('hộp Trộn dính trên đỉnh khi cuộn; ma trận không có hàng tiêu đề riêng; brief thả xuống không đẩy bố cục; chú thích một dòng trong thanh Trộn, bấm thì thả cả câu xuống', t => {
  const pos = `({ main: Math.round(document.querySelector('main').getBoundingClientRect().top + scrollY), open: document.querySelector('details.brief').open })`;
  const at = `JSON.stringify(${pos})`;
  const cap = `(() => { const s = document.querySelector('[data-preview-caption]'), h = s.getBoundingClientRect().height;
    return { inBar: !!s.closest('.mix .bar'), open: s.parentElement.open, ws: getComputedStyle(s).whiteSpace,
      lines: Math.round(h / parseFloat(getComputedStyle(s).lineHeight)), cut: s.scrollWidth > s.clientWidth,
      box: Math.round(document.querySelector('.box.mix').getBoundingClientRect().height),
      frame: Math.round(document.querySelector('[data-frame="preview"]').getBoundingClientRect().top + scrollY) }; })()`;
  const r = run(fixture(ROUND2), 'index.html', [
    { name: 'dau', check: `JSON.stringify({ at: ${pos}, inSide: !!document.querySelector('.side .tools details.brief'),
        thead: document.querySelectorAll('[data-matrix] thead').length, mixInDock: !!document.querySelector('[data-dock] [data-tab="mix"]'),
        borrowed: document.querySelector('[data-matrix] td.none [aria-hidden="true"]').textContent,
        rowAbovePreview: document.querySelector('[data-frame="preview"]').previousElementSibling !== null, cap: ${cap} })` },
    { name: 'mo', js: `document.querySelector('details.brief summary').click()`, check: at },
    { name: 'ngoai', js: `document.querySelector('[data-matrix] th').click()`, check: at },
    // Câu thật thường dài hơn một dòng: kéo dài câu mẫu rồi mới xem
    { name: 'dai', js: `const s = document.querySelector('[data-preview-caption]'); s.textContent = s.textContent.repeat(20)`, check: `JSON.stringify(${cap})` },
    { name: 'chu', js: `document.querySelector('[data-preview-caption]').click()`, check: `JSON.stringify(${cap})` },
    { name: 'dong', js: `document.querySelector('[data-summary]').click()`, check: `JSON.stringify(${cap})` },
    // Cuộn hẳn qua chỗ hộp thu (không rơi vào khoảng trang tự trôi nốt)
    { name: 'cuon', js: `window.__want = Math.round(document.querySelector('main').getBoundingClientRect().top + scrollY) + 160; scrollTo(0, window.__want); new Promise(r => setTimeout(r, 300))`,
      check: `JSON.stringify({ y: Math.round(scrollY) - window.__want, dock: Math.round(document.querySelector('[data-dock]').getBoundingClientRect().top),
        side: Math.round(document.querySelector('.side').getBoundingClientRect().top) })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = n => JSON.parse(step(r, n).check);
  const dau = v('dau'), main = dau.at.main, { box, frame } = dau.cap;
  assert.deepEqual({ ...dau, cap: { inBar: dau.cap.inBar, open: dau.cap.open, ws: dau.cap.ws, lines: dau.cap.lines } },
    { at: { main, open: false }, inSide: true, thead: 0, mixInDock: true, borrowed: 'D màn B', rowAbovePreview: false,
      cap: { inBar: true, open: false, ws: 'nowrap', lines: 1 } });
  assert.deepEqual(v('mo'), { main, open: true }, 'mở brief không đẩy bảng xuống');
  assert.deepEqual(v('ngoai'), { main, open: false }, 'bấm ra ngoài thì brief đóng');
  assert.deepEqual(v('dai'), { inBar: true, open: false, ws: 'nowrap', lines: 1, cut: true, box, frame }, 'câu dài vẫn gọn một dòng, thanh không cao thêm');
  const chu = v('chu');
  assert.ok(chu.open && chu.ws === 'normal' && chu.lines >= 2 && !chu.cut, `bấm chú thích thì mở cả câu: ${JSON.stringify(chu)}`);
  assert.deepEqual([chu.box, chu.frame], [box, frame], 'cả câu thả xuống đè lên màn lớn, không đẩy hộp Trộn hay màn lớn');
  assert.deepEqual([v('dong').open, v('dong').lines], [false, 1], 'bấm ra ngoài thì chú thích gọn lại');
  assert.deepEqual(v('cuon'), { y: 0, dock: 0, side: 12 }, 'hộp Trộn và cột trái (công cụ + danh sách) dính');
});

// Màn nhỏ: hộp Trộn đầy đủ che nhiều màn lớn. Cuộn xuống thì hộp thu còn một dòng (4 ô của bản trộn + Đổi trộn), màn lớn không nhảy.
// Hộp thu ngay khi bắt đầu dính. Margin bù chưa cuộn qua thì giữa hộp thu và màn lớn còn hở; mỗi nấc con lăn khoảng 100px nên trang
// hiếm khi dừng đúng chỗ màn lớn chạm đáy hộp thu (bảng v7: thu sớm thì hở, thu muộn thì che header của màn lớn). Trang dừng trong
// khoảng đó thì tự trôi nốt theo hướng vừa cuộn: xuống thì tới chỗ màn lớn sát đáy hộp thu, lên thì về chỗ hộp đầy đủ.
// Đổi trộn mở ma trận đè lên màn, chọn ô vẫn mở, bấm ra ngoài thì đóng; cuộn về đầu thì hộp đầy đủ lại
test('hộp Trộn thu còn một dòng khi cuộn, không hở với màn lớn, trang không bị kéo về; Đổi trộn mở ma trận đè lên màn, bấm màn lớn thì đóng; màn lớn không nhảy', t => {
  const frame = `Math.round(document.querySelector('[data-frame="preview"]').getBoundingClientRect().top + scrollY)`;
  const state = `JSON.stringify({ y: Math.round(scrollY), anchor: getComputedStyle(document.documentElement).overflowAnchor, stuck: document.querySelector('[data-dock]').classList.contains('stuck'), frame: ${frame},
    box: Math.round(document.querySelector('.box.mix').getBoundingClientRect().height),
    matrix: getComputedStyle(document.querySelector('#mix-matrix')).display, pick: getComputedStyle(document.querySelector('[data-pick]')).display,
    open: document.querySelector('[data-pick]').getAttribute('aria-expanded'), code: document.querySelector('[data-mix-code]').textContent,
    hole: Math.round(document.querySelector('[data-frame="preview"]').getBoundingClientRect().top - document.querySelector('.box.mix').getBoundingClientRect().bottom),
    want: window.__want, from: window.__from })`;
  const tick = `new Promise(r => requestAnimationFrame(() => setTimeout(r, 50)))`;
  const settle = `new Promise(r => setTimeout(r, 1000))`;
  const at = sel => `Math.round(document.querySelector('${sel}').getBoundingClientRect().top + scrollY)`;
  const r = run(fixture(ROUND2), 'index.html', [
    { name: 'dau', check: state },
    // Vừa dính (qua mốc cũ 24px dưới đầu vùng bảng): hộp còn đầy đủ, che mép trên màn lớn, không hở
    // Một nấc xuống: dừng giữa khoảng, trang trôi nốt tới chỗ màn lớn sát đáy hộp thu
    { name: 'vua', js: `window.__from = ${at('main')} + 40; scrollTo(0, window.__from); ${settle}`, check: state },
    // Một nấc lên từ đó: lại vào khoảng giữa, trang trôi về chỗ hộp đầy đủ
    { name: 'len', js: `scrollTo(0, scrollY - 60); ${settle}`, check: state },
    { name: 'cuon', js: `window.__want = ${at('main')} + 160; scrollTo(0, window.__want); ${settle}`, check: state },
    { name: 'mo', js: `document.querySelector('[data-pick]').click()`, check: state },
    { name: 'chon', js: `document.querySelector('input[name="mix-mau"][value="b"]').click()`, check: state },
    { name: 'ngoai', js: `document.querySelector('[data-summary]').click()`, check: state },
    // Chú thích nằm trong hộp nhưng thả xuống cùng chỗ với ma trận: mở chú thích thì ma trận đóng, mở ma trận thì chú thích đóng
    { name: 'cap', js: `document.querySelector('[data-pick]').click(); document.querySelector('[data-preview-caption]').click()`,
      check: `JSON.stringify([document.querySelector('[data-pick]').getAttribute('aria-expanded'), document.querySelector('details.caption').open])` },
    { name: 'capdong', js: `document.querySelector('[data-pick]').click()`,
      check: `JSON.stringify([document.querySelector('[data-pick]').getAttribute('aria-expanded'), document.querySelector('details.caption').open])` },
    // Bấm vào màn lớn: click nằm trong iframe, trang chỉ mất focus (blur) và focus nằm ở iframe
    { name: 'man', js: `document.querySelector('[data-pick]').click(); document.querySelector('iframe[data-preview]').focus();
      dispatchEvent(new Event('blur')); new Promise(r => setTimeout(r, 50))`, check: state },
    { name: 've', js: `scrollTo(0, 0); ${tick}`, check: state }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = n => JSON.parse(step(r, n).check);
  const dau = v('dau'), cuon = v('cuon');
  assert.deepEqual([dau.stuck, dau.matrix, dau.pick], [false, 'block', 'none']);
  const vua = v('vua'), len = v('len');
  assert.ok(vua.stuck && vua.y > vua.from && vua.hole >= 0 && vua.hole <= 12, `một nấc xuống: hộp thu, trang trôi nốt, màn lớn sát đáy hộp ${JSON.stringify(vua)}`);
  assert.ok(!len.stuck && len.y < vua.y - 60 && len.hole >= 0 && len.hole <= 12, `một nấc lên: trang trôi về chỗ hộp đầy đủ ${JSON.stringify(len)}`);
  assert.deepEqual([cuon.y, cuon.stuck, cuon.matrix, cuon.pick !== 'none', cuon.open], [cuon.want, true, 'none', true, 'false'], 'hộp thu và trang không bị kéo về đầu (neo cuộn)');
  assert.ok(cuon.hole <= 12, `cuộn qua: màn lớn chui dưới hộp, không hở (${cuon.hole}px)`);
  assert.ok(cuon.box <= 60 && dau.box - cuon.box >= 80, `hộp thu: ${dau.box} → ${cuon.box}`);
  assert.ok(Math.abs(cuon.frame - dau.frame) <= 1, `màn lớn nhảy: ${dau.frame} → ${cuon.frame}`);
  assert.deepEqual([v('mo').open, v('mo').matrix], ['true', 'block']);
  assert.deepEqual([v('chon').open, v('chon').code], ['true', 'man:A mau:B chu:A nut:A'], 'chọn ô thì ma trận vẫn mở để chọn tiếp');
  assert.deepEqual([v('ngoai').open, v('ngoai').matrix], ['false', 'none'], 'bấm ra ngoài thì ma trận đóng');
  assert.deepEqual(JSON.parse(step(r, 'cap').check), ['false', true], 'mở chú thích thì ma trận đóng');
  assert.deepEqual(JSON.parse(step(r, 'capdong').check), ['true', false], 'mở ma trận thì chú thích đóng');
  assert.equal(v('man').open, 'false', 'bấm vào màn lớn (iframe) thì ma trận đóng');
  // Trên bảng thật (v7, cuộn bằng con lăn) neo cuộn của Chromium kéo trang về đầu mỗi lần hộp thu: hộp giật. Bảng mẫu không dựng lại được, nên giữ quy tắc
  assert.equal(dau.anchor, 'none', 'trang phải tắt neo cuộn (html{overflow-anchor:none})');
  assert.deepEqual([v('ve').stuck, v('ve').matrix, Math.abs(v('ve').frame - dau.frame) <= 1], [false, 'block', true]);
});

// Rê chuột (hoặc focus) lên ô của hàng Màn và ý: ảnh chụp của concept đó (shots/<màn>-<khổ>.png của shots.mjs) hiện dưới ma trận,
// thẳng cột với ô. Chưa chụp thì báo thiếu ảnh. Khoảng hở giữa các ô không tắt ảnh; sang hàng khác hoặc rời ma trận thì tắt
test('rê chuột lên hàng Màn và ý: ảnh chụp của concept hiện dưới ma trận, theo khổ đang xem; chưa chụp thì báo thiếu; rời ma trận thì tắt', t => {
  const dir = fixture(ROUND2);
  shots(dir, ['a-1440.png', 'd-1440.png', 'b-390.png']);
  const wait = `new Promise(r => setTimeout(r, 200))`;
  const over = sel => `document.querySelector('${sel}').dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); ${wait}`;
  const look = id => `JSON.stringify((() => { const p = document.querySelector('[data-peek]'), i = p.querySelector('img');
    const pr = p.getBoundingClientRect(), m = document.querySelector('#mix-matrix').getBoundingClientRect(), td = document.querySelector('td[data-shot="${id}"]').getBoundingClientRect();
    return { shown: !p.hidden, src: i.getAttribute('src'), loaded: !i.hidden && i.complete && i.naturalWidth > 0, w: Math.round(i.getBoundingClientRect().width),
      note: p.querySelector('p').textContent, below: Math.round(pr.top - m.bottom), dx: Math.round(Math.abs(pr.left + pr.width / 2 - td.left - td.width / 2)) }; })())`;
  const r = run(dir, 'index.html', [
    { name: 'a', js: over('td[data-shot="a"]'), check: look('a') },
    { name: 'c', js: over('td[data-shot="c"]'), check: look('c') },
    { name: 'd', js: over('td.none[data-shot="d"]'), check: look('d') },
    { name: 'ho', js: over('[data-matrix] tr'), check: look('d') },
    { name: 'mau', js: over('input[name="mix-mau"][value="a"]'), check: look('a') },
    // Trang headless không giữ focus của cửa sổ nên focus() không phát focusin: phát tay, như test Đổi trộn phát blur
    { name: 'hep', js: `document.querySelector('[data-set-width="390"]').click(); const i = document.querySelector('input[name="mix-man"][value="b"]');
      i.focus(); i.dispatchEvent(new FocusEvent('focusin', { bubbles: true })); ${wait}`, check: look('b') },
    { name: 'roi', js: `document.querySelector('[data-matrix]').dispatchEvent(new MouseEvent('mouseleave'))`, check: look('b') },
    { name: 'ten', check: `JSON.stringify(['a', 'c'].map(id => CONCEPTS.concepts.find(c => c.id === id).name))` }]);
  if (!r) return t.skip('không có trình duyệt');
  // Ảnh chưa chụp là một lỗi tải file trong console, đúng như mong đợi
  assert.deepEqual(r.flatMap(s => s.errors).filter(e => !e.includes('c-1440.png')), []);
  const v = n => JSON.parse(step(r, n).check), [na, nc] = v('ten');
  assert.deepEqual(v('a'), { ...v('a'), shown: true, src: 'shots/a-1440.png', loaded: true, w: 360, note: `A · ${na}` });
  assert.ok(v('a').below >= 0 && v('a').below <= 8, `ảnh nằm ngay dưới ma trận: ${v('a').below}`);
  assert.deepEqual(v('c'), { ...v('c'), shown: true, src: 'shots/c-1440.png', loaded: false, note: `C · ${nc}: chưa có ảnh chụp shots/c-1440.png` });
  assert.ok(v('c').dx <= 1, `ảnh thẳng cột với ô: lệch ${v('c').dx}px`);
  assert.deepEqual([v('d').shown, v('d').src, v('d').loaded], [true, 'shots/d-1440.png', true], 'ô màn mượn hiện ảnh của chính concept đó');
  assert.deepEqual([v('ho').shown, v('ho').src], [true, 'shots/d-1440.png'], 'khoảng hở giữa các ô không tắt ảnh');
  assert.equal(v('mau').shown, false, 'sang hàng Màu thì tắt');
  assert.deepEqual([v('hep').shown, v('hep').src, v('hep').loaded, v('hep').w], [true, 'shots/b-390.png', true, 180], 'focus bằng bàn phím cũng hiện; khổ 390 thì ảnh 390');
  assert.equal(v('roi').shown, false, 'rời ma trận thì tắt');
});

// Bỏ cột trái: nút ▾ cạnh "Concept X" mở bảng tổng quan phủ bề ngang hộp Trộn: ảnh chụp của mọi concept (shots/, theo khổ đang xem)
// theo vòng, vòng mới nhất trên cùng, kèm góp ý của vòng. Chưa chụp thì ô ghi thiếu file nào. Chọn xong thì bảng đóng, focus về nút ▾.
// Esc, bấm ra ngoài, mở chú thích thì đóng. Concept khuyến nghị: chấm xanh ở hàng Màn và ý và dòng "Khuyến nghị" ở hàng đầu
test('bảng tổng quan: nút ▾ mở ảnh chụp mọi concept theo vòng, theo khổ đang xem; chọn thì đóng và xem concept đó; Esc, bấm ra ngoài, mở chú thích thì đóng', t => {
  const dir = fixture(ROUND2);
  shots(dir, ['a-1440.png', 'b-1440.png', 'd-1440.png']);
  const wait = `new Promise(r => setTimeout(r, 300))`;
  const st = `JSON.stringify((() => { const m = document.querySelector('[data-overview]'), a = document.activeElement;
    return { open: !m.hidden, expanded: document.querySelector('[data-choose]').getAttribute('aria-expanded'),
      focus: a.dataset.view || (a.hasAttribute('data-choose') ? 'nut' : a.tagName), view: document.querySelector('[data-tab-concept]').textContent,
      tab: document.querySelector('[data-tab="concept"]').getAttribute('aria-pressed') }; })())`;
  const look = `JSON.stringify((() => { const m = document.querySelector('[data-overview]'), mr = m.getBoundingClientRect(), br = document.querySelector('.box.mix').getBoundingClientRect();
    return { rounds: [...m.querySelectorAll('[data-ov-round]')].map(e => e.dataset.ovRound), notes: m.querySelectorAll('[data-ov-note]').length,
      side: document.querySelectorAll('[data-card]').length, warn: m.querySelectorAll('[data-card-warning]').length,
      cards: [...m.querySelectorAll('[data-ov]')].map(li => { const i = li.querySelector('img');
        return li.dataset.ov + ':' + (i ? i.getAttribute('src') + (i.complete && i.naturalWidth ? '' : ' chưa nạp') : li.querySelector('.shot').textContent); }),
      tall: m.classList.contains('tall'), full: Math.abs(mr.width - br.width) <= 2 && mr.top >= br.bottom }; })())`;
  const caret = `document.querySelector('[data-choose]').click()`;
  const r = run(dir, 'index.html', [
    { name: 'dau', check: st },
    { name: 'mo', js: `${caret}; ${wait}`, check: st },
    { name: 'anh', check: look },
    { name: 'chon', js: `document.querySelector('[data-overview] [data-view="c"]').click()`, check: st },
    { name: 'dong', check: `String(document.querySelectorAll('[data-overview] *').length)` },
    { name: 'esc', js: `${caret}; document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`, check: st },
    { name: 'ngoai', js: `${caret}; document.querySelector('[data-summary]').click()`, check: st },
    { name: 'cap', js: `${caret}; document.querySelector('[data-preview-caption]').click()`,
      check: `JSON.stringify([!document.querySelector('[data-overview]').hidden, document.querySelector('details.caption').open])` },
    { name: 'hep', js: `document.querySelector('[data-set-width="390"]').click(); ${caret}; ${wait}`, check: look },
    { name: 'kn', check: `JSON.stringify({ rec: document.querySelector('[data-rec]').textContent, shown: !document.querySelector('[data-rec]').hidden,
      dots: [...document.querySelectorAll('[data-matrix] .dot')].map(d => d.closest('td').dataset.shot) })` }]);
  if (!r) return t.skip('không có trình duyệt');
  // Ảnh chưa chụp là lỗi tải file trong console, đúng như mong đợi
  assert.deepEqual(r.flatMap(s => s.errors).filter(e => !/shots\/(c-1440|[a-d]-390)\.png/.test(e)), []);
  const v = n => JSON.parse(step(r, n).check);
  assert.deepEqual([v('dau').open, v('dau').expanded, v('dau').view], [false, 'false', 'A']);
  assert.deepEqual([v('mo').open, v('mo').expanded, v('mo').focus], [true, 'true', 'a'], 'mở bảng: focus ở concept đang xem');
  assert.deepEqual(v('anh'), { rounds: ['2', '1'], notes: 1, tall: false, full: true, side: 4, warn: 0,
    cards: ['d:shots/d-1440.png', 'a:shots/a-1440.png', 'b:shots/b-1440.png', 'c:Chưa có ảnh chụp shots/c-1440.png'] },
    'vòng mới nhất trên cùng, có góp ý; ảnh của từng concept, thiếu thì ghi file; bảng phủ bề ngang hộp Trộn, nằm dưới hộp; ' +
    'thẻ ở cột trái không bị nhân đôi (shots.mjs đọc cảnh báo từ [data-card])');
  assert.equal(step(r, 'dong').check, '0', 'đóng bảng tổng quan thì xoá nội dung');
  assert.deepEqual([v('chon').open, v('chon').view, v('chon').tab, v('chon').focus], [false, 'C', 'true', 'nut'],
    'chọn concept: bảng đóng, xem concept đó, focus về nút ▾');
  assert.deepEqual([v('esc').open, v('esc').focus], [false, 'nut'], 'Esc đóng bảng, focus về nút ▾');
  assert.equal(v('ngoai').open, false, 'bấm ra ngoài thì đóng');
  assert.deepEqual(v('cap'), [false, true], 'mở chú thích thì bảng đóng');
  assert.deepEqual([v('hep').tall, v('hep').cards[0]], [true, 'd:Chưa có ảnh chụp shots/d-390.png'], 'khổ 390: ảnh 390, ô hẹp và cao');
  assert.deepEqual(v('kn'), { rec: 'Khuyến nghị: A', shown: true, dots: ['a'] });
});

// Trong trang gom thanh tab đã có tên dự án và portal: bảng mở với ?hub bỏ dòng tiêu đề, hộp Trộn nằm ngay dưới thanh tab
test('bảng trong trang gom (?hub): bỏ dòng tiêu đề, hộp Trộn sát đỉnh; công cụ ở đầu cột trái; mở riêng thì còn tên dự án', t => {
  const look = `JSON.stringify({ top: getComputedStyle(document.querySelector('header.top')).display,
    box: Math.round(document.querySelector('.box.mix').getBoundingClientRect().top),
    tools: [...document.querySelectorAll('.side .tools [data-set-theme], .side .tools [data-set-width]')].length })`;
  const hub = run(fixture(), 'index.html', [{ name: 'hub', check: look }], { query: '?hub' });
  if (!hub) return t.skip('không có trình duyệt');
  noErrors(hub);
  const one = run(fixture(), 'index.html', [{ name: 'rieng', check: look }]);
  const h = JSON.parse(step(hub, 'hub').check), o = JSON.parse(step(one, 'rieng').check);
  assert.equal(h.top, 'none');
  assert.ok(h.box <= o.box - 40, `hộp Trộn phải lên cao khi trong trang gom: ${h.box} so với ${o.box}`);
  assert.notEqual(o.top, 'none', 'mở riêng thì còn dòng tên dự án');
  assert.equal(h.tools, 4);
});

// Trong khung của trang gom (file://) trình duyệt chặn navigator.clipboard: nút Sao chép chép bằng execCommand trước,
// hỏng cả hai thì chọn sẵn mã. Kết quả hiện trên chính nút (không đè lên ma trận), câu đầy đủ ở dòng trạng thái ẩn
test('nút Sao chép: chép bằng execCommand khi clipboard bị chặn; hỏng cả hai thì chọn sẵn mã; kết quả hiện trên nút', t => {
  const read = `JSON.stringify({ status: document.querySelector('[data-copy-status]').textContent, sel: String(getSelection()),
    got: window.__copied || '', code: document.querySelector('[data-mix-code]').textContent,
    btn: document.querySelector('[data-copy]').textContent, hidden: document.querySelector('[data-copy-status]').classList.contains('sr-only') })`;
  const r = run(fixture(), 'index.html', [
    { name: 'exec', js: `(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('chặn')) } });
      document.execCommand = c => { window.__copied = c === 'copy' && document.querySelector('body > textarea[readonly]').value; return true; };
      document.querySelector('[data-copy]').click(); })()`, check: read },
    { name: 'tay', js: `(async () => { document.execCommand = () => false; window.__copied = '';
      document.querySelector('[data-copy]').click(); await new Promise(r => setTimeout(r, 50)); })()`, check: read }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const exec = JSON.parse(step(r, 'exec').check), tay = JSON.parse(step(r, 'tay').check);
  assert.deepEqual(exec, { status: 'Đã chép mã trộn.', sel: '', got: exec.code, code: 'man:A mau:A chu:A nut:A', btn: 'Đã chép', hidden: true });
  assert.match(tay.status, /chọn sẵn/);
  assert.equal(tay.sel, tay.code);
  assert.equal(tay.btn, 'Chép tay');
});

test('vòng 2: nhóm và góp ý của vòng; concept chỉ đổi Hình xem trên màn nó mượn; đổi nền giữ mã trộn', t => {
  const r = run(fixture(ROUND2), 'index.html', [
    { name: 'r2', js: `document.querySelector('[data-view="d"]').click()`, check: `JSON.stringify({
      rounds: [...document.querySelectorAll('[data-round]')].map(e => e.dataset.round),
      note: document.querySelector('[data-round="2"] [data-round-note]').textContent,
      labels: [...document.querySelectorAll('[data-card="d"] .lab')].map(e => e.textContent),
      thumb: decodeURIComponent(document.querySelector('iframe[data-screen="d"]').getAttribute('src')),
      preview: decodeURIComponent(document.querySelector('iframe[data-preview]').getAttribute('src')),
      manCells: [...document.querySelectorAll('input[name="mix-man"]')].map(i => i.value),
      mauCells: [...document.querySelectorAll('input[name="mix-mau"]')].map(i => i.value),
      tab: document.querySelector('[data-tab="concept"]').getAttribute('aria-pressed'),
      warn: document.querySelectorAll('[data-axes-warning]').length,
      summary: document.querySelector('[data-summary]').textContent })` },
    { name: 'dark', js: `document.querySelector('[data-set-theme="dark"]').click()`,
      check: `decodeURIComponent(document.querySelector('iframe[data-preview]').getAttribute('src'))` },
  ]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'r2').check);
  assert.deepEqual(v.rounds, ['1', '2']);
  assert.equal(v.note, 'Góp ý: màu ấm hơn, chữ ít cổ điển');
  assert.deepEqual(v.labels, ['màn B']);
  assert.match(v.thumb, /^b\.html\?theme=light&mix=man:B mau:D chu:D nut:D$/);
  assert.match(v.preview, /^b\.html\?theme=light&mix=man:B mau:D chu:D nut:D$/);
  assert.deepEqual(v.manCells, ['a', 'b', 'c']);
  assert.deepEqual(v.mauCells, ['a', 'b', 'c', 'd']);
  assert.equal(v.tab, 'true');
  assert.equal(v.warn, 0);
  assert.equal(v.summary, '4 concept qua 2 vòng');
  assert.match(step(r, 'dark').check, /^b\.html\?theme=dark&mix=man:B mau:D chu:D nut:D$/);
});

test('concept khuyến nghị là concept chỉ đổi Hình: bản trộn ban đầu lấy màn của concept nó mượn', t => {
  const r = run(fixture(ROUND2 + '\nCONCEPTS.concepts[0].recommended = false; CONCEPTS.concepts[3].recommended = true;\n'), 'index.html',
    [{ name: 'init', check: `JSON.stringify({ code: document.querySelector('[data-mix-code]').textContent.trim(),
      current: document.querySelector('[data-view][aria-current="true"]').dataset.view })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'init').check), { code: 'man:B mau:D chu:D nut:D', current: 'd' });
});

test('chi tiết: tương phản đạt hết thì gọn một dòng; nút "Hiện mọi cặp" mở đủ bảng', t => {
  const shown = `String([...document.querySelectorAll('[data-tile="a"] [data-contrast]')].filter(li => getComputedStyle(li).display !== 'none').length)`;
  const r = run(fixture(), 'index.html', [
    { name: 'gon', js: `document.querySelector('[data-details]').open = true`,
      check: `document.querySelector('[data-tile="a"] [data-contrast-ok]').textContent.trim() + ' | ' + ${shown}` },
    { name: 'du', js: `document.querySelector('[data-tile="a"] [data-show-all]').click()`, check: shown },
  ]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.equal(step(r, 'gon').check, 'Tất cả cặp đạt AA. | 0');
  assert.ok(+step(r, 'du').check >= 20, `chỉ hiện ${step(r, 'du').check} cặp`);
});

test('cảnh báo So trục và thiếu lý do Hình hiện thành nhãn trên thẻ', t => {
  const r = run(fixture('\nCONCEPTS.concepts[2].axes = Object.assign({}, CONCEPTS.concepts[0].axes);\ndelete CONCEPTS.concepts[1].why;\n'), 'index.html',
    [{ name: 'labels', check: `JSON.stringify({ cards: Object.fromEntries([...document.querySelectorAll('[data-card]')].map(c => [c.dataset.card,
      [...c.querySelectorAll('[data-card-warning]')].map(e => e.dataset.cardWarning + ':' + e.textContent)])),
      count: document.querySelector('[data-axes-count]').textContent })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'labels').check), { cards: { a: ['axes:gần C'], b: ['why:thiếu lý do Hình'], c: ['axes:gần A'] }, count: '· 1 cảnh báo' });
});

test('khuôn concepts.js trống: bảng mở không lỗi, báo chưa có concept', t => {
  const dir = fixture();
  fs.copyFileSync(path.join(SKILL, 'templates', 'concepts.js'), path.join(dir, 'concepts.js'));
  const r = run(dir, 'index.html', [{ name: 'empty', check: `JSON.stringify({ empty: !document.querySelector('[data-empty]').hidden,
    err: !document.querySelector('[data-board-error]').hidden, main: getComputedStyle(document.querySelector('main')).display })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'empty').check), { empty: true, err: false, main: 'none' });
});

test('concepts.js của kit cũ (không rounds, round, why) vẫn mở được, mọi concept ở vòng 1', t => {
  const r = run(fixture('\ndelete CONCEPTS.rounds; for (const c of CONCEPTS.concepts) { delete c.round; delete c.why; }\n'), 'index.html',
    [{ name: 'old', check: `JSON.stringify({ rounds: [...document.querySelectorAll('[data-round]')].map(e => e.dataset.round),
      err: !document.querySelector('[data-board-error]').hidden, cards: document.querySelectorAll('[data-card]').length })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'old').check), { rounds: ['1'], err: false, cards: 3 });
});

test('bảng nhiều vòng (9 concept) ở khổ 390: trang không tràn ngang, ma trận cuộn trong khung của nó, hộp Trộn không dính', t => {
  const more = `
CONCEPTS.rounds = [1, 2, 3].map(n => ({ n, note: n > 1 ? 'góp ý vòng ' + n : '' }));
const base = CONCEPTS.concepts.slice();
['d', 'e', 'f', 'g', 'h', 'i'].forEach((id, i) => CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(base[i % 3])),
  { id, name: 'Concept ' + id, round: i < 3 ? 2 : 3, screen: base[i % 3].id, recommended: false })));
`;
  const r = run(fixture(more), 'index.html', [{ name: 'many', check: `(() => { const s = document.querySelector('[data-matrix]').parentElement;
    return JSON.stringify({ cards: document.querySelectorAll('[data-card]').length, scrolls: s.scrollWidth > s.clientWidth,
      dock: getComputedStyle(document.querySelector('[data-dock]')).position }); })()` },
    { name: 'menu', js: `document.querySelector('[data-choose]').click()`,
      check: `JSON.stringify((r => [r.left >= 0, r.right <= innerWidth])(document.querySelector('[data-overview]').getBoundingClientRect()))` }], { w: 390, h: 844 });
  if (!r) return t.skip('không có trình duyệt');
  // Thư mục mẫu chưa có ảnh chụp: bảng tổng quan ra lỗi tải ảnh, đúng như mong đợi
  assert.deepEqual(r.flatMap(s => s.errors).filter(e => !/shots\/[a-i]-1440\.png/.test(e)), []);
  for (const s of r) assert.ok(s.dims === null || s.dims.sw <= s.dims.cw, `${s.step}: tràn ngang ${JSON.stringify(s.dims)}`);
  assert.deepEqual(JSON.parse(step(r, 'many').check), { cards: 9, scrolls: true, dock: 'static' });
  assert.deepEqual(JSON.parse(step(r, 'menu').check), [true, true], 'bảng tổng quan nằm trong màn 390');
});

test('bàn phím trong ma trận: mỗi hàng là một nhóm radio vào được bằng Tab; đổi ô (phím mũi tên phát change) cập nhật mã trộn', t => {
  const r = run(fixture(ROUND2), 'index.html', [{ name: 'keys', js: `(() => {
    const i = document.querySelector('input[name="mix-mau"][value="d"]');
    i.focus(); i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true }));
  })()`, check: `JSON.stringify({
    groups: [...new Set([...document.querySelectorAll('[data-matrix] input[type=radio]')].map(i => i.name))],
    tabbable: [...document.querySelectorAll('[data-matrix] input[type=radio]')].every(i => i.tabIndex === 0 && getComputedStyle(i).visibility !== 'hidden'),
    focused: document.activeElement.name + ':' + document.activeElement.value,
    code: document.querySelector('[data-mix-code]').textContent.trim(),
    tab: document.querySelector('[data-tab="mix"]').getAttribute('aria-pressed') })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'keys').check), { groups: ['mix-man', 'mix-mau', 'mix-chu', 'mix-nut'], tabbable: true,
    focused: 'mix-mau:d', code: 'man:A mau:D chu:A nut:A', tab: 'true' });
});

test('concept chỉ đổi Hình không ghi lớp Ý: bảng hiện Ý của concept nó mượn màn', t => {
  const r = run(fixture(ROUND2 + "\nfor (const k of ['idea', 'metaphor', 'formFrom', 'signature']) delete CONCEPTS.concepts[3][k];\n"), 'index.html', [
    { name: 'y', js: `document.querySelector('[data-view="d"]').click()`, check: `JSON.stringify({
      caption: document.querySelector('[data-preview-caption]').textContent,
      idea: document.querySelector('[data-tile="d"] .idea').textContent,
      facts: [...document.querySelectorAll('[data-tile="d"] .facts dd')].slice(0, 3).map(e => e.textContent),
      want: (b => [b.idea, b.metaphor, b.formFrom, b.signature])(CONCEPTS.concepts[1]) })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'y').check);
  assert.equal(v.caption, `D · Than lạnh: ${v.want[0]}`);
  assert.equal(v.idea, v.want[0]);
  assert.deepEqual(v.facts, v.want.slice(1));
});

// Mục nhỏ còn lại sau review 1.4
test('đổi nền giữ trạng thái gập vòng và "Hiện mọi cặp"', t => {
  const state = `JSON.stringify({ fold: document.querySelector('[data-fold="1"]').getAttribute('aria-expanded'),
    cardsHidden: document.querySelector('[data-cards="1"]').hidden,
    all: document.querySelector('[data-tile="a"] [data-show-all]').getAttribute('aria-pressed'),
    allClass: document.querySelector('[data-tile="a"] .ct').classList.contains('all') })`;
  const r = run(fixture(), 'index.html', [
    { name: 'truoc', js: `document.querySelector('[data-fold="1"]').click(); document.querySelector('[data-tile="a"] [data-show-all]').click()`, check: state },
    { name: 'sau', js: `document.querySelector('[data-set-theme="dark"]').click()`, check: state }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const want = { fold: 'false', cardsHidden: true, all: 'true', allClass: true };
  assert.deepEqual(JSON.parse(step(r, 'truoc').check), want);
  assert.deepEqual(JSON.parse(step(r, 'sau').check), want);
});

test('truy cập: aria-current ở nút xem concept; tên ô radio chỉ là lớp và concept; nút gập và nút tổng quan có aria-controls; cột tên hàng của ma trận dính', t => {
  const r = run(fixture(), 'index.html', [{ name: 'a11y', check: `JSON.stringify({
    liCurrent: document.querySelectorAll('li[data-card][aria-current]').length,
    current: [...document.querySelectorAll('[data-view][aria-current="true"]')].map(b => b.dataset.view),
    names: [...new Set([...document.querySelectorAll('[data-matrix] label.cell')].map(l => { const c = l.cloneNode(true);
      c.querySelectorAll('[aria-hidden="true"], input').forEach(e => e.remove()); return c.textContent.trim().replace(/ của [A-Z](, khuyến nghị)?$/, ''); }))],
    controls: [...document.querySelectorAll('[data-fold]')].map(b => (b.getAttribute('aria-controls') || '').split(' ').filter(Boolean)
      .every(id => document.getElementById(id)) && b.getAttribute('aria-controls').includes(document.querySelector('[data-cards="' + b.dataset.fold + '"]').id)),
    choose: (b => [b.getAttribute('aria-label'), b.getAttribute('aria-expanded'), document.getElementById(b.getAttribute('aria-controls')) === document.querySelector('[data-overview]')])(document.querySelector('[data-choose]')),
    corner: getComputedStyle(document.querySelector('[data-matrix] th[scope="row"]')).position })` }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.deepEqual(JSON.parse(step(r, 'a11y').check), { liCurrent: 0, current: ['a'], names: ['Màn và ý', 'Màu', 'Chữ', 'Nút và hình'], controls: [true], choose: ['Tổng quan concept', 'false', true], corner: 'sticky' });
});

test('thẻ Bản trộn lấy mã từ concept đang xem tới khi người dùng chọn ô; chọn rồi thì xem concept khác vẫn giữ bản trộn', t => {
  const code = `document.querySelector('[data-mix-code]').textContent.trim()`;
  const r = run(fixture(ROUND2), 'index.html', [
    { name: 'xemD', js: `document.querySelector('[data-view="d"]').click(); document.querySelector('[data-tab="mix"]').click()`, check: code },
    { name: 'chon', js: `document.querySelector('input[name="mix-mau"][value="a"]').click()`, check: code },
    { name: 'xemC', js: `document.querySelector('[data-view="c"]').click(); document.querySelector('[data-tab="mix"]').click()`, check: code }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.equal(step(r, 'xemD').check, 'man:B mau:D chu:D nut:D');
  assert.equal(step(r, 'chon').check, 'man:B mau:A chu:D nut:D');
  assert.equal(step(r, 'xemC').check, 'man:B mau:A chu:D nut:D');
});

// v7 thật: bảng chỉ hiện <id>.html, nên Cổng 2 mở thêm từng màn <id>-hlv.html ra tab riêng
test('bề mặt: bảng có nút Bề mặt khi khai từ 2 bề mặt; chọn bề mặt thì màn lớn, bản trộn và màn mượn đổi sang file của bề mặt đó', t => {
  const dir = fixture(ROUND2 + "\nCONCEPTS.surfaces = [{ key: '', label: 'Nhân viên' }, { key: 'hlv', label: 'HLV', width: 390 }];\n");
  const screen = fs.readFileSync(path.join(SKILL, 'templates', 'key-screen.html'), 'utf8');
  for (const id of ['a', 'b', 'c']) fs.writeFileSync(path.join(dir, `${id}-hlv.html`), screen.replace('data-concept="a"', `data-concept="${id}"`));
  shots(dir, ['a-hlv-390.png']);
  const state = `JSON.stringify({
    seg: [...document.querySelectorAll('[data-set-surface]')].map(b => b.textContent + ':' + b.getAttribute('aria-pressed')),
    width: document.querySelector('[data-set-width][aria-pressed="true"]').dataset.setWidth,
    preview: decodeURIComponent(document.querySelector('iframe[data-preview]').getAttribute('src')),
    open: decodeURIComponent(document.querySelector('[data-open-slot] a').getAttribute('href')),
    thumbs: [...document.querySelectorAll('iframe[data-screen]')].map(f => f.getAttribute('src').split('?')[0]) })`;
  const r = run(dir, 'index.html', [
    { name: 'dau', check: state },
    { name: 'hlv', js: `document.querySelector('[data-set-surface="hlv"]').click()`, check: state },
    // Ảnh chụp khi rê chuột theo bề mặt và khổ của bề mặt đó
    { name: 'anh', js: `document.querySelector('td[data-shot="a"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); new Promise(r => setTimeout(r, 200))`,
      check: `document.querySelector('[data-peek-img]').getAttribute('src')` },
    { name: 'tron', js: `document.querySelector('input[name="mix-mau"][value="b"]').click()`, check: state },
    { name: 'muon', js: `document.querySelector('[data-view="d"]').click()`, check: state },
    { name: 've', js: `document.querySelector('[data-set-surface=""]').click()`, check: state }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = n => JSON.parse(step(r, n).check);
  assert.deepEqual(v('dau').seg, ['Nhân viên:true', 'HLV:false']);
  assert.equal(v('dau').width, '1440');
  assert.match(v('dau').preview, /^a\.html\?theme=light$/);
  assert.deepEqual(v('hlv').seg, ['Nhân viên:false', 'HLV:true']);
  assert.equal(v('hlv').width, '390');
  assert.match(v('hlv').preview, /^a-hlv\.html\?theme=light$/);
  assert.equal(v('hlv').open, v('hlv').preview);
  assert.match(v('tron').preview, /^a-hlv\.html\?theme=light&mix=man:A mau:B chu:A nut:A$/);
  assert.match(v('muon').preview, /^b-hlv\.html\?theme=light&mix=man:B mau:D chu:D nut:D$/);
  assert.match(v('ve').preview, /^b\.html\?/);
  assert.equal(v('ve').width, '1440');
  assert.equal(step(r, 'anh').check, 'shots/a-hlv-390.png');
  for (const n of ['dau', 'hlv', 'muon']) assert.deepEqual(v(n).thumbs, ['a.html', 'b.html', 'c.html', 'b.html'], `${n}: ảnh nhỏ giữ màn chính`);

  const one = run(fixture(), 'index.html', [{ name: 'mot', check: `String(document.querySelector('[data-surface-seg]').hidden)` }]);
  noErrors(one);
  assert.equal(step(one, 'mot').check, 'true', 'một bề mặt thì không có nút Bề mặt');
});

// Nhiều portal (v7 thật: concept/quan-ly/ và concept/nguoi-dung/, Cổng 2 mở từng bảng): concept/index.html là trang gom, mỗi bảng một tab
const BOARDS_JS = "window.BOARDS = { project: 'Dự án thử', boards: [{ dir: 'quan-ly', label: 'Portal quản lý' }, { dir: 'nguoi-dung', label: 'Portal người dùng' }] };\n";
function hubFixture(boardsJs = BOARDS_JS) {
  const dir = tmpdir('concept-hub-');
  fs.copyFileSync(path.join(SKILL, 'templates', 'concept-hub.html'), path.join(dir, 'index.html'));
  if (boardsJs !== null) fs.writeFileSync(path.join(dir, 'boards.js'), boardsJs);
  for (const d of ['quan-ly', 'nguoi-dung']) fs.cpSync(fixture(), path.join(dir, d), { recursive: true });
  return dir;
}
const HUB_STATE = `JSON.stringify({
  tabs: [...document.querySelectorAll('[role="tab"]')].map(b => b.textContent + ':' + b.getAttribute('aria-selected') + ':' + b.tabIndex),
  frames: [...document.querySelectorAll('[data-panel] iframe')].map(f => f.getAttribute('src')),
  visible: [...document.querySelectorAll('[data-panel]')].filter(p => getComputedStyle(p).visibility === 'visible').map(p => p.dataset.panel),
  hash: location.hash, title: document.title, focus: document.activeElement.id,
  allow: [...document.querySelectorAll('[data-panel] iframe')].every(f => /clipboard-write/.test(f.getAttribute('allow'))),
  same: !window.__q || document.querySelector('[data-panel="quan-ly"] iframe') === window.__q })`;

test('trang gom: mỗi bảng một tab; chuyển tab giữ bảng của tab kia, không nạp lại; phím mũi tên chuyển tab', t => {
  const r = run(hubFixture(), 'index.html', [
    { name: 'dau', check: HUB_STATE },
    { name: 'sang', js: `window.__q = document.querySelector('[data-panel="quan-ly"] iframe'); document.querySelector('[data-board="nguoi-dung"]').click()`, check: HUB_STATE },
    { name: 've', js: `document.querySelector('[data-board="quan-ly"]').click()`, check: HUB_STATE },
    { name: 'phim', js: `document.querySelector('#tab-quan-ly').focus(); document.querySelector('#tab-quan-ly').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`, check: HUB_STATE }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = n => JSON.parse(step(r, n).check);
  assert.deepEqual(v('dau'), { tabs: ['Portal quản lý:true:0', 'Portal người dùng:false:-1'], frames: ['quan-ly/index.html?hub'], visible: ['quan-ly'],
    hash: '#quan-ly', title: 'Bảng concept · Dự án thử', focus: '', allow: true, same: true });
  assert.deepEqual(v('sang').frames, ['quan-ly/index.html?hub', 'nguoi-dung/index.html?hub']);
  assert.deepEqual(v('sang').visible, ['nguoi-dung']);
  assert.equal(v('sang').hash, '#nguoi-dung');
  assert.deepEqual(v('ve').visible, ['quan-ly']);
  assert.equal(v('ve').same, true, 'mở lại tab thì bảng cũ còn nguyên, không nạp lại');
  assert.deepEqual(v('phim').tabs, ['Portal quản lý:false:-1', 'Portal người dùng:true:0']);
  assert.equal(v('phim').focus, 'tab-nguoi-dung');
});

test('trang gom: thanh tab theo Nền của bảng đang mở; bỏ qua tin không đến từ khung bảng', t => {
  const theme = `document.documentElement.dataset.theme || ''`;
  const r = run(hubFixture(), 'index.html', [
    { name: 'dau', js: `new Promise(r => setTimeout(r, 300))`, check: theme },
    { name: 'la', js: `postMessage({ conceptBoardTheme: 'dark' }, '*'); new Promise(r => setTimeout(r, 100))`, check: theme }]);
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  assert.equal(step(r, 'dau').check, 'light', 'bảng báo nền sáng, thanh tab theo');
  assert.equal(step(r, 'la').check, 'light', 'tin từ chỗ khác không đổi nền');
});

test('trang gom: #<dir> trên địa chỉ mở đúng tab, chỉ nạp bảng đó; khổ 390 không tràn ngang', t => {
  const r = run(hubFixture(), 'index.html', [{ name: 'hash', check: HUB_STATE }], { w: 390, h: 844, query: '#nguoi-dung' });
  if (!r) return t.skip('không có trình duyệt');
  noErrors(r);
  const v = JSON.parse(step(r, 'hash').check);
  assert.deepEqual(v.frames, ['nguoi-dung/index.html?hub']);
  assert.deepEqual(v.visible, ['nguoi-dung']);
  for (const s of r) assert.ok(s.dims === null || s.dims.sw <= s.dims.cw, `${s.step}: tràn ngang ${JSON.stringify(s.dims)}`);
});

test('trang gom: thiếu boards.js hay dir sai quy ước thì báo rõ, không ném lỗi', t => {
  const err = `JSON.stringify({ shown: !document.querySelector('[data-hub-error]').hidden,
    items: [...document.querySelectorAll('[data-hub-error] li')].map(e => e.textContent), frames: document.querySelectorAll('iframe').length })`;
  const none = run(hubFixture(null), 'index.html', [{ name: 'err', check: err }]);
  if (!none) return t.skip('không có trình duyệt');
  assert.deepEqual(none.flatMap(s => s.errors).filter(e => !e.startsWith('LOG ')), [], 'chỉ được có lỗi tải file, không có lỗi JS');
  const a = JSON.parse(step(none, 'err').check);
  assert.equal(a.shown, true);
  assert.match(a.items[0], /Không đọc được boards\.js/);
  assert.equal(a.frames, 0);
  const bad = run(hubFixture("window.BOARDS = { boards: [{ dir: 'Quản lý', label: 'Portal quản lý' }, { dir: 'nguoi-dung', label: '' }] };\n"), 'index.html', [{ name: 'err', check: err }]);
  noErrors(bad);
  assert.deepEqual(JSON.parse(step(bad, 'err').check).items,
    ['Bảng 1: dir "Quản lý" chỉ gồm chữ thường a-z, số và dấu gạch ngang.', 'Bảng "nguoi-dung": thiếu label.']);
});

test('preflight: trang gom dựng từ khuôn không có lỗi, không có cảnh báo', () => {
  const dir = tmpdir('concept-hub-pf-');
  fs.copyFileSync(path.join(SKILL, 'templates', 'concept-hub.html'), path.join(dir, 'index.html'));
  fs.writeFileSync(path.join(dir, 'boards.js'), BOARDS_JS);
  const r = spawnSync(PYTHON, [PREFLIGHT, dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /0 lỗi · 0 cảnh báo/, r.stdout);
});
