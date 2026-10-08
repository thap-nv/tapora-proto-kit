// Trang lối vào của prototype nhiều bề mặt (sketch-to-site 4.7, references/trang-loi-vao.md): ảnh xem trước khai báo bằng
// <img data-shot> trên site/index.html, bộ kiểm tự chụp (handover.py thumbs, qa-check.py), theme.js đổi ảnh theo theme.
// Trước 4.7 kit chỉ có một dòng về trang này; một prototype thật 28 trang ra trang lối vào là danh sách link, còn bộ kiểm
// đã có lệnh chụp ảnh từ một dự án trước mà tài liệu không nhắc tới.
// Phần lớn test thay _qa/run.mjs bằng bản giả (không cần trình duyệt); test chụp thật và theme.js cần Edge hoặc Chrome.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const S2S = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(S2S, f), 'utf8').replace(/\r\n/g, '\n');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const QA_INIT = path.join(S2S, 'templates', 'qa-kit', 'qa_init.py');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const NO_BROWSER = /Không tìm thấy Edge/;

function section(md, start, end) {
  const i = md.indexOf(start);
  assert.ok(i >= 0, `không thấy "${start}"`);
  const j = md.indexOf(end, i + start.length);
  return md.slice(i, j < 0 ? undefined : j);
}
function sed(expr, text) {
  const ranges = expr.split(';').map(r => /^\/(.+?)\/,(?:\/(.+?)\/|\$)p$/.exec(r.trim())).map(m => ({ a: new RegExp(m[1]), b: m[2] && new RegExp(m[2]), on: false }));
  const out = [];
  for (const line of text.split('\n')) {
    let hit = false;
    for (const r of ranges) {
      if (r.on) { hit = true; if (r.b && r.b.test(line)) r.on = false; }
      else if (r.a.test(line)) { hit = true; r.on = true; }
    }
    if (hit) out.push(line);
  }
  return out.join('\n');
}
const heads = s => s.split('\n').filter(l => /^## /.test(l)).map(l => l.split(' ').slice(0, 2).join(' '));
// Cỡ ảnh JPEG đọc từ khối SOF
const jpgSize = f => {
  const b = fs.readFileSync(f);
  for (let i = 2; i + 9 < b.length;) {
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xC3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};

// ---- handover.py thumbs với run.mjs giả: ghi ảnh giả, ghi lại tham số của từng lần gọi ----
const STUB = `import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
const [file, stepsFile, outdir, w, h, mobile] = process.argv.slice(2);
if (process.env.STUB_NO_BROWSER) { console.error('Không tìm thấy Edge, Chrome hay Chromium. Đặt biến QA_BROWSER.'); process.exit(4); }
const steps = JSON.parse(readFileSync(stepsFile, 'utf8'));
const shot = steps.steps.at(-1).shot;
mkdirSync(outdir, { recursive: true });
writeFileSync(join(outdir, shot + '.jpg'), 'jpg');
appendFileSync(process.env.STUB_LOG, JSON.stringify({ file: file.replace(/\\\\/g, '/'), steps: stepsFile.replace(/\\\\/g, '/'), shot, query: steps.query ?? null, theme: process.env.QA_QUERY, w, h, mobile }) + '\\n');
console.log(JSON.stringify([{ step: 'load', errors: [], check: null, dims: null }, { step: 'xem-truoc', errors: [], check: null, dims: null }]));
`;
const IMGS = `<img src="assets/shots/quan-tri.jpg" data-shot="quan-tri" data-shot-page="admin/tong-quan.html?vai=ke-toan" alt="Trang quản trị: tổng quan">
<img src="assets/shots/khach.jpg" data-shot="khach" data-shot-page="khach.html" data-shot-size="mobile" alt="App khách: trang chủ">`;
const page = (title, css, body = '') => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="${css}"></head><body><main><h1>${title}</h1>${body}</main></body></html>`;

function entry(t, { imgs = IMGS, extra = '', thumbs } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loivao-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const site = path.join(dir, 'site');
  fs.mkdirSync(path.join(site, 'admin'), { recursive: true });
  fs.mkdirSync(path.join(site, 'assets'));
  fs.writeFileSync(path.join(site, 'assets', 'site.css'), 'body{margin:0;font-family:system-ui}\n');
  fs.writeFileSync(path.join(site, 'admin', 'tong-quan.html'), page('Tổng quan', '../assets/site.css'));
  fs.writeFileSync(path.join(site, 'khach.html'), page('Trang chủ khách', 'assets/site.css'));
  fs.writeFileSync(path.join(site, 'index.html'), page('Lối vào', 'assets/site.css', imgs + extra));
  const init = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8', env });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  const cfgFile = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  cfg.themes = { light: '', dark: '?theme=dark' };
  if (thumbs) cfg.thumbs = thumbs;
  fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2));
  fs.writeFileSync(path.join(dir, '_qa', 'run.mjs'), STUB);
  const log = path.join(dir, 'stub.log');
  fs.writeFileSync(log, '');
  const py = (args, extraEnv = {}) => spawnSync(PYTHON, [path.join('_qa', 'handover.py'), ...args], { cwd: dir, encoding: 'utf8', env: { ...env, STUB_LOG: log, ...extraEnv } });
  const calls = () => fs.readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
  return { dir, site, py, calls };
}
// Đổi giờ sửa của file: "sửa" đặt giờ tới tương lai; xong lượt chụp thì trả về quá khứ, để ảnh vừa chụp không còn cũ hơn nó
const at = (f, s) => { const x = Date.now() / 1000 + s; fs.utimesSync(f, x, x); };

test('handover.py thumbs: đọc <img data-shot> của trang lối vào, mỗi theme một ảnh, tham số trang qua file bước, khổ mobile', t => {
  const { site, py, calls } = entry(t);
  const r = py(['thumbs']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ảnh lối vào: 4 mới chụp · 0 còn mới · console 0 · trang lối vào \d+ KB$/m);
  assert.match(r.stdout, /^ {2}site\/assets\/shots\/quan-tri-dark\.jpg · console 0$/m);
  for (const f of ['quan-tri.jpg', 'quan-tri-dark.jpg', 'khach.jpg', 'khach-dark.jpg']) assert.ok(fs.existsSync(path.join(site, 'assets', 'shots', f)), f);
  const c = calls();
  assert.equal(c.length, 4);
  for (const x of c.filter(x => x.shot === 'quan-tri')) {
    assert.match(x.file, /site\/admin\/tong-quan\.html$/);
    assert.equal(x.query, '?vai=ke-toan', 'run.mjs không nhận "trang.html?x" làm tên file: tham số đi qua khoá query của file bước');
    assert.deepEqual([x.w, x.h, x.mobile], ['1440', '900', '0']);
  }
  for (const x of c.filter(x => x.shot === 'khach')) {
    assert.equal(x.query, null, 'trang không có tham số: để qa-query của trang được dùng');
    assert.deepEqual([x.w, x.h, x.mobile], ['390', '844', '1']);
  }
  assert.deepEqual(c.map(x => x.theme).sort(), ['', '', '?theme=dark', '?theme=dark']);
});

test('handover.py thumbs: chỉ chụp ảnh thiếu hay cũ hơn trang nguồn, file trang nạp, hay khai báo; --all chụp lại hết', t => {
  const { site, py, calls } = entry(t);
  assert.equal(py(['thumbs']).status, 0);
  const again = py(['thumbs']);
  assert.match(again.stdout, /^Ảnh lối vào: 0 mới chụp · 4 còn mới · /m);
  assert.equal(calls().length, 4, 'ảnh còn mới thì không gọi trình duyệt');
  const tq = path.join(site, 'admin', 'tong-quan.html'), css = path.join(site, 'assets', 'site.css');
  at(tq, 60);
  assert.match(py(['thumbs']).stdout, /^Ảnh lối vào: 2 mới chụp · 2 còn mới · /m);
  at(tq, -3600);
  at(css, 60);
  assert.match(py(['thumbs']).stdout, /^Ảnh lối vào: 4 mới chụp · 0 còn mới · /m, 'CSS dùng chung đổi thì mọi ảnh của trang nạp nó đều cũ');
  at(css, -3600);
  // Đổi khai báo (khổ) thì ảnh đó cũ; sửa chỗ khác của trang lối vào thì không
  const idx = path.join(site, 'index.html');
  fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace('data-shot-size="mobile"', 'data-shot-size="desktop"').replace('<h1>', '<h1 class="x">'));
  assert.match(py(['thumbs']).stdout, /^Ảnh lối vào: 2 mới chụp · 2 còn mới · /m);
  assert.deepEqual(calls().slice(-2).map(x => [x.shot, x.w]), [['khach', '1440'], ['khach', '1440']]);
  assert.match(py(['thumbs', '--all']).stdout, /^Ảnh lối vào: 4 mới chụp · 0 còn mới · /m);
});

test('handover.py thumbs: khai báo sai thì cảnh báo và bỏ qua ảnh đó; trang lối vào quá 20 KB thì nhắc gọn lại', t => {
  const imgs = `<img src="assets/shots/quan-tri.jpg" data-shot="quan-tri" data-shot-page="admin/khong-co.html" alt="a">
<img src="assets/anh/khach.jpg" data-shot="khach" data-shot-page="khach.html" alt="b">
<img src="assets/shots/sai.jpg" data-shot="Sai Ten" data-shot-page="khach.html" alt="c">
<img src="assets/shots/to.jpg" data-shot="to" data-shot-page="khach.html" data-shot-size="tivi" alt="d">
<img src="assets/shots/khach.jpg" data-shot="khach" data-shot-page="admin/tong-quan.html" alt="e">
<img src="assets/shots/thieu.jpg" data-shot="thieu" alt="f">`;
  const { py, calls } = entry(t, { imgs, extra: `<p>${'Chữ dài. '.repeat(2600)}</p>` });
  const r = py(['thumbs']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào quan-tri: không có site\/admin\/khong-co\.html, bỏ qua$/m);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào khach: src là assets\/anh\/khach\.jpg, ảnh ghi vào assets\/shots\/khach\.jpg$/m);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào "Sai Ten": tên chỉ gồm a-z, 0-9 và dấu gạch ngang, bỏ qua$/m);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào to: khổ "tivi" không có trong "sizes" của qa\.config\.json \(desktop, tablet, mobile\), bỏ qua$/m);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào khach: trùng tên với một ảnh trước, bỏ qua$/m);
  assert.match(r.stdout, /^CẢNH BÁO ảnh lối vào thieu: thiếu data-shot-page, bỏ qua$/m);
  assert.match(r.stdout, /^Ảnh lối vào: 2 mới chụp · 0 còn mới · console 0 · trang lối vào \d+ KB \(quá 20 KB: gọn lại\)$/m);
  assert.deepEqual([...new Set(calls().map(x => x.shot))], ['khach']);
});

test('handover.py thumbs: không có trình duyệt thì in một dòng và thoát 4, không sập', t => {
  const { py } = entry(t);
  const r = py(['thumbs'], { STUB_NO_BROWSER: '1' });
  assert.equal(r.status, 4, r.stdout + r.stderr);
  assert.match(r.stdout, /^Không tìm thấy Edge/m);
  assert.doesNotMatch(r.stdout + r.stderr, /Traceback/);
});

test('handover.py thumbs: "thumbs" khai trong qa.config.json (dự án cũ) vẫn chụp; không khai gì thì nói rõ', t => {
  const { dir, site, py } = entry(t, { imgs: '', thumbs: { dir: 'assets/shots', items: [['khach', 'thumb-khach', 'desktop']] } });
  fs.writeFileSync(path.join(dir, '_qa', 'steps-thumb-khach.json'), JSON.stringify({ steps: [{ name: 'home', wait: 600, shot: 'khach-cu', jpeg: true }] }));
  const r = py(['thumbs']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ảnh lối vào: 2 mới chụp · 0 còn mới · /m);
  for (const f of ['khach-cu.jpg', 'khach-cu-dark.jpg']) assert.ok(fs.existsSync(path.join(site, 'assets', 'shots', f)), f);
  const cfgFile = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  cfg.thumbs.items = [];
  fs.writeFileSync(cfgFile, JSON.stringify(cfg));
  const none = py(['thumbs']);
  assert.equal(none.status, 0);
  assert.match(none.stdout, /^Ảnh lối vào: không khai báo \(data-shot trên site\/index\.html hay "thumbs" trong qa\.config\.json\)/m);
});

test('handover.py ledger: ảnh khai báo bằng data-shot có trang đã đụng thì nêu, qa-check tự chụp lại', t => {
  const { dir, py } = entry(t);
  assert.equal(spawnSync(PYTHON, ['-c', "import sys, os; sys.path.insert(0, '_qa'); import qalib as Q; Q.save_json(os.path.join(Q.CUR, 'manifest.json'), Q.manifest())"], { cwd: dir, encoding: 'utf8', env }).status, 0);
  fs.writeFileSync(path.join(dir, '_qa', 'current', 'ledger.jsonl'),
    JSON.stringify({ time: '2026-10-08T09:00:00', note: 'evolve: thêm cột', files: ['site/admin/tong-quan.html'], suites: [], changed: [], lost: [], new: [] }) + '\n');
  const r = py(['ledger']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ảnh lối vào có trang đã đụng: admin\/tong-quan \(qa-check tự chụp lại\)$/m);
});

test('quick.py: ảnh lối vào còn thiếu (bề mặt mới của evolve-site) thì chụp trước khi đo; ảnh chỉ cũ thì để qa-check của handover-check', t => {
  const { dir, site, calls } = entry(t);
  assert.equal(spawnSync(PYTHON, ['-c', "import sys, os; sys.path.insert(0, '_qa'); import qalib as Q; Q.save_json(os.path.join(Q.CUR, 'manifest.json'), Q.manifest())"], { cwd: dir, encoding: 'utf8', env }).status, 0);
  const quick = note => spawnSync(PYTHON, [path.join('_qa', 'quick.py'), '--note', note], { cwd: dir, encoding: 'utf8', env: { ...env, STUB_LOG: path.join(dir, 'stub.log') } });
  const first = quick('evolve: thêm hai bề mặt');
  assert.match(first.stdout, /^Ảnh lối vào: 4 mới chụp · 0 còn mới · /m, first.stdout + first.stderr);
  assert.ok(first.stdout.indexOf('Ảnh lối vào:') < first.stdout.indexOf('File đổi từ lần kiểm trước:'), 'chụp trước khi tính file đổi');
  assert.equal(calls().filter(x => x.steps.includes('/.thumbs/')).length, 4, 'chỉ đếm lần chụp ảnh lối vào, không đếm bộ khói');
  at(path.join(site, 'admin', 'tong-quan.html'), 60);
  const again = quick('tweak: đổi nhãn ở tổng quan');
  assert.doesNotMatch(again.stdout, /^Ảnh lối vào/m, 'ảnh chỉ cũ: kiểm nhanh không chụp lại');
});

// ---- Chụp thật qua qa-check.py (cần trình duyệt) ----
test('qa-check.py: có data-shot thì chụp trước khi kiểm, chỉ in dòng tổng; ảnh web 1440×900', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loivao-qa-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const site = path.join(dir, 'site');
  fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(site, 'assets', 'site.css'), 'body{margin:0;font-family:system-ui;color:#1a1a1a;background:#fff}img{display:block;width:480px;max-width:100%;height:auto}\n');
  fs.writeFileSync(path.join(site, 'khach.html'), page('Trang chủ khách', 'assets/site.css', '<p>Đơn đang chạy: 2.</p>'));
  fs.writeFileSync(path.join(site, 'index.html'), page('Lối vào', 'assets/site.css',
    '<img src="assets/shots/khach.jpg" data-shot="khach" data-shot-page="khach.html" alt="App khách: trang chủ">'));
  const r = spawnSync(PYTHON, [path.join(S2S, 'scripts', 'qa-check.py'), dir], { encoding: 'utf8', timeout: 300000, env });
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.match(r.stdout, /^Ảnh lối vào: 1 mới chụp · 0 còn mới · console 0 · trang lối vào \d+ KB$/m);
  assert.doesNotMatch(r.stdout, /^ {2}site\/assets\/shots\//m, 'dòng từng ảnh không in ở qa-check');
  assert.doesNotMatch(r.stdout, /đổi trong lúc chạy/, 'chụp xong rồi mới chạy handover');
  assert.ok(r.stdout.indexOf('Ảnh lối vào:') < r.stdout.indexOf('Thư mục chạy:'), r.stdout);
  assert.deepEqual(jpgSize(path.join(site, 'assets', 'shots', 'khach.jpg')), [1440, 900]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

// ---- theme.js đổi ảnh xem trước theo theme (cần trình duyệt) ----
const RUN = path.join(S2S, 'templates', 'qa-kit', 'run.mjs');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
test('theme.js: img[data-shot] theo theme đang mở (<tên>-<theme>.jpg); theme mặc định sáng giữ src gốc; thiếu ảnh của theme thì về ảnh gốc', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loivao-th-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const site = path.join(dir, 'site');
  fs.mkdirSync(path.join(site, 'assets', 'shots'), { recursive: true });
  const tpl = JSON.parse(read('templates/themes.json'));
  tpl.themes.dark = { mode: 'dark', seeds: { bg: '#0B0C0E', surface: '#141518', ink: '#EDEDEF', muted: '#A1A1AA', line: '#2A2B30',
    primary: '#2DD4BF', 'on-primary': '#0B0C0E', accent: '#2DD4BF', 'on-accent': '#0B0C0E', destructive: '#F97066', 'on-destructive': '#0B0C0E' }, overrides: {} };
  tpl.default.dark = 'dark';
  tpl.themes.nau = JSON.parse(JSON.stringify(tpl.themes.light));
  fs.writeFileSync(path.join(site, 'assets', 'themes.json'), JSON.stringify(tpl));
  assert.equal(spawnSync(process.execPath, [path.join(S2S, 'scripts', 'themes.mjs'), dir], { encoding: 'utf8' }).status, 0);
  fs.copyFileSync(path.join(S2S, 'templates', 'theme.js'), path.join(site, 'assets', 'theme.js'));
  for (const f of ['x.jpg', 'x-dark.jpg']) fs.writeFileSync(path.join(site, 'assets', 'shots', f), PNG);
  fs.writeFileSync(path.join(site, 'index.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>T</title>
<script src="assets/theme.js"></script><link rel="stylesheet" href="assets/themes.css"></head>
<body><img src="assets/shots/x.jpg" data-shot="x" data-shot-page="a.html" alt="x"></body></html>`);
  const sf = path.join(dir, 'steps.json');
  const SRC = `document.querySelector('img').getAttribute('src')`;
  fs.writeFileSync(sf, JSON.stringify({ query: '?theme=dark', steps: [
    { name: 'toi', wait: 300, check: SRC },
    { name: 'sang', js: "theme.set('light')", wait: 300, check: SRC },
    { name: 'nau', js: "theme.set('nau')", wait: 600, check: SRC },
  ] }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, RUN, path.join(site, 'index.html'), sf, path.join(dir, 'out')], { encoding: 'utf8', timeout: 90000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const v = Object.fromEntries(JSON.parse(r.stdout).map(s => [s.step, s.check]));
  assert.equal(v.toi, 'assets/shots/x-dark.jpg');
  assert.equal(v.sang, 'assets/shots/x.jpg');
  assert.equal(v.nau, 'assets/shots/x.jpg', 'chưa có x-nau.jpg thì về ảnh gốc, không để ảnh vỡ');
});

// ---- Tài liệu: luật ở một file, mỗi giai đoạn in đúng mục trong lượt đã có, Cổng 3 có câu riêng ----
const LV = () => read('references/trang-loi-vao.md');
const sedOn = (md, file) => [...md.matchAll(new RegExp(`sed -n '([^']+)' <skills>/sketch-to-site/references/${file.replace('.', '\\.')}`, 'g'))].map(m => m[1]);

test('trang-loi-vao.md: 6 mục, sáu câu và ba kiểu, ngắn để in theo mục', () => {
  const md = LV();
  assert.deepEqual(heads(md), ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.']);
  for (const k of ['Trình diễn', 'Theo vai', 'Hành trình']) assert.match(section(md, '## 2.', '## 3.'), new RegExp(`\\*\\*${k}\\*\\*`));
  assert.match(section(md, '## 4.', '## 5.'), /data-shot="<tên>" data-shot-page="<trang>/);
  assert.match(section(md, '## 4.', '## 5.'), /[Kk]hông đọc mã `handover\.py`/);
  assert.ok(md.length <= 6000, `trang-loi-vao.md dài ${md.length} ký tự`);
});

test('mỗi giai đoạn in đúng mục của trang-loi-vao.md: B2 mục 1, 2, 5 · B3 mục 1, 3, 4 · B4 mục 6; mỗi lần in ≤ 3000 ký tự', () => {
  const md = LV();
  // Mỗi mục nhận ra bằng một dòng của thân mục (khoảng sed in cả dòng tiêu đề kết thúc, như các lệnh in khác của kit)
  const BODY = { 1: '**Đây là gì:**', 2: '| **Trình diễn** |', 3: '**Mặc concept đã chốt**', 4: 'data-shot-size="desktop|mobile"', 5: 'Câu **Trang lối vào**', 6: '- [ ] Đủ sáu câu' };
  const check = (doc, want) => {
    const calls = sedOn(doc, 'trang-loi-vao.md');
    assert.equal(calls.length, 1, `một lệnh in trang-loi-vao.md, thấy ${calls.length}`);
    const out = sed(calls[0], md);
    for (const [n, line] of Object.entries(BODY)) assert.equal(out.includes(line), want.includes(+n), `mục ${n}`);
    assert.ok(out.length > 200 && out.length <= 3000, `in ${out.length} ký tự`);
  };
  check(section(read('references/b0-b2.md'), '### B2', '### 🛑 Cổng 3'), [1, 2, 5]);
  check(section(read('references/b3-b4.md'), '### B3', '### B4'), [1, 3, 4]);
  check(section(read('references/b3-b4.md'), '### B4', '1. **Kiểm một lệnh**'), [6]);
});

test('Cổng 3 có câu Trang lối vào; khuôn DECISIONS, DESIGN, BUILD-LOG và mobile-app.md trỏ tới trang lối vào', () => {
  const gate = section(read('references/b0-b2.md'), '### 🛑 Cổng 3', '\n---');
  assert.match(gate, /^4\. \*\*Trang lối vào\*\*/m);
  assert.match(section(read('templates/DECISIONS.md'), '## 🛑 Cổng 3', '## '), /^\*\*Trang lối vào \(nguyên văn\):\*\*/m);
  assert.match(section(read('templates/DESIGN.md'), '## 9. Sơ đồ trang', '## 10.'), /^\| Lối vào /m);
  assert.match(read('templates/BUILD-LOG.md'), /[Tt]rang lối vào[^\n]*dòng cuối/);
  assert.match(read('references/mobile-app.md'), /index\.html +# [^\n]*trang-loi-vao\.md/);
  assert.match(section(read('references/qa-gate.md'), '## 7.', '\n## 8.'), /^12\. Trang lối vào/m);
});
