// Kiểm các lệnh kiểm một lệnh của 4.5: run.mjs chụp cả trang và chụp theo từng màn, tự thêm cờ cho Node 20;
// qa_init.py đọc đúng qa-query có &amp;, bộ khói chụp hết trang; scripts/system-check.mjs (B2); scripts/qa-check.py (B4).
// Đo trước 4.5 (04/10/2026, đề Lò Bánh Củi Cô Ba): mỗi lần chạy tốn 0,25–0,46M token để đọc mã run.mjs, preflight.py,
// qa_init.py rồi tự chép bước cuộn, cắt ảnh dài, gọi run.mjs thiếu cờ. Cần Python 3, Node 20+, Edge hoặc Chrome.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
// Một trình duyệt chung cho cả file (QA_CDP), thay vì mỗi lần run.mjs một trình duyệt
require('./shared-browser')();

const S2S = path.resolve(__dirname, '..');
const T = f => path.join(S2S, 'templates', f);
const RUN = T(path.join('qa-kit', 'run.mjs'));
const QA_INIT = T(path.join('qa-kit', 'qa_init.py'));
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const NO_BROWSER = /Không tìm thấy Edge/;

function tmp(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
// Cỡ ảnh PNG đọc từ khối IHDR
const pngSize = f => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const LONG = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dài</title>
<style>body{margin:0}h2{margin:0}section{height:700px;border-bottom:1px solid #ccc}</style></head><body>${'<section><h2>Khối</h2></section>'.repeat(4)}</body></html>`;

function runMjs(t, page, steps, { flags = [], w = '1440', h = '900', steps: extra = {}, env: more = {} } = {}) {
  const dir = tmp(t, 'run-');
  fs.writeFileSync(path.join(dir, 'p.html'), page);
  fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ ...extra, steps }));
  const r = spawnSync(process.execPath, [...flags, RUN, path.join(dir, 'p.html'), path.join(dir, 'steps.json'), path.join(dir, 'out'), w, h],
    { encoding: 'utf8', timeout: 90000, env: { ...process.env, ...more } });
  return { r, out: path.join(dir, 'out') };
}

test('run.mjs chạy thẳng không cần cờ --experimental-websocket (Node 20 tự thêm)', t => {
  const { r } = runMjs(t, LONG, [{ name: 'xem', check: 'document.title' }]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).find(s => s.step === 'xem').check, 'Dài');
});

test('run.mjs: "full" chụp cả trang một ảnh, "slices" chụp từng màn: <shot>, <shot>-2, …', t => {
  const { r, out } = runMjs(t, LONG, [{ name: 'ca', shot: 'ca-trang', full: true }, { name: 'man', shot: 'man', slices: 8 }]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(pngSize(path.join(out, 'ca-trang.png')), [1440, 2804]);
  // Trang cao 2804px, mỗi màn 900px: 4 ảnh, ảnh cuối là phần còn lại
  assert.deepEqual(fs.readdirSync(out).filter(f => f.startsWith('man')).sort(), ['man-2.png', 'man-3.png', 'man-4.png', 'man.png']);
  assert.deepEqual(pngSize(path.join(out, 'man.png')), [1440, 900]);
  assert.deepEqual(pngSize(path.join(out, 'man-4.png')), [1440, 104]);
  // "slices" có trần: trang dài hơn thì chỉ chụp số màn đầu
  const capped = runMjs(t, LONG, [{ name: 'man', shot: 'man', slices: 2 }]);
  assert.deepEqual(fs.readdirSync(capped.out).filter(f => f.startsWith('man')).sort(), ['man-2.png', 'man.png']);
});

// Mỗi lần chạy mở trình duyệt với hồ sơ tạm cdp-* trong thư mục tạm. Lần chạy lỗi giữa chừng hay bị giết (hết giờ, Ctrl+C) để hồ sơ lại:
// 09/10/2026 máy laptop còn 633 hồ sơ từ 01/10, khoảng 12 MB mỗi cái
test('run.mjs xoá hồ sơ tạm cả khi lỗi giữa chừng, và dọn hồ sơ cdp-* sót lại quá 2 giờ', t => {
  const temp = tmp(t, 'qa-temp-');
  const old = path.join(temp, 'cdp-AbC123'), fresh = path.join(temp, 'cdp-XyZ789'), other = path.join(temp, 'cdp-cua-cong-cu-khac');
  const t3h = new Date(Date.now() - 3 * 3600e3);
  for (const d of [old, fresh, other]) { fs.mkdirSync(d); fs.writeFileSync(path.join(d, 'Local State'), '{}'); }
  for (const d of [old, other]) fs.utimesSync(d, t3h, t3h);
  // Ảnh ghi vào thư mục con không có: lỗi ENOENT khi trình duyệt đã mở
  const { r } = runMjs(t, LONG, [{ name: 'xem', shot: 'khong-co/anh' }], { env: { QA_CDP: '', TEMP: temp, TMP: temp, TMPDIR: temp } });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /ENOENT/);
  // Còn hồ sơ mới (có thể của lần chạy khác đang chạy) và thư mục không đúng dạng tên của mkdtemp
  assert.deepEqual(fs.readdirSync(temp).filter(f => f.startsWith('cdp-')).sort(), ['cdp-XyZ789', 'cdp-cua-cong-cu-khac']);
});

// QA_BROWSERS: số trình duyệt mở cùng lúc trên cả máy, mọi lần chạy cộng lại. Bộ test mở nhiều trình duyệt song song làm laptop lag
test('run.mjs: QA_BROWSERS=1 thì hai lần chạy song song lần lượt mở trình duyệt', async t => {
  const steps = [{ name: 'dau', check: 'Date.now()' }, { name: 'cuoi', wait: 1500, check: 'Date.now()' }];
  const one = () => new Promise(done => {
    const dir = tmp(t, 'run-');
    fs.writeFileSync(path.join(dir, 'p.html'), LONG);
    fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ steps }));
    const p = spawn(process.execPath, [RUN, path.join(dir, 'p.html'), path.join(dir, 'steps.json'), path.join(dir, 'out'), '800', '600'],
      { env: { ...process.env, QA_CDP: '', QA_BROWSERS: '1' } });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => done({ code, out, err }));
  });
  const runs = await Promise.all([one(), one()]);
  if (runs.some(r => r.code === 4)) return t.skip('không có trình duyệt');
  const spans = runs.map(r => {
    assert.equal(r.code, 0, r.err);
    const rep = JSON.parse(r.out);
    return ['dau', 'cuoi'].map(s => rep.find(x => x.step === s).check);
  });
  const [a, b] = spans;
  assert.ok(a[1] <= b[0] || b[1] <= a[0], `hai trình duyệt mở cùng lúc: ${JSON.stringify(spans)}`);
});

// Một trình duyệt chung cho cả lệnh (browser.mjs): mở một lần, các lần run.mjs gắn vào qua QA_CDP, mỗi lần một ngữ cảnh riêng.
// Đo 09/10/2026: khởi động trình duyệt chiếm 1,6 của 5,2 giây-lõi mỗi lần chạy, cộng phần tạo/xoá hồ sơ 12 MB không đo được
const BROWSER_MJS = T(path.join('qa-kit', 'browser.mjs'));
const alive = async url => { try { await fetch(url + '/json/version', { signal: AbortSignal.timeout(1500) }); return true; } catch { return false; } };
// Mở browser.mjs như một tiến trình con, hồ sơ trong thư mục tạm riêng (b.temp) để đếm được; trả null khi không có trình duyệt.
// Hook tắt trình duyệt đăng ký trước khi tạo thư mục tạm, để lúc dọn thì trình duyệt tắt xong rồi mới xoá thư mục
function startBrowser(t) {
  let p, exit;
  t.after(async () => { if (p) { try { p.stdin.end(); } catch {} await exit; } });
  const temp = tmp(t, 'qa-temp-');
  return new Promise(done => {
    p = spawn(process.execPath, [BROWSER_MJS], { env: { ...process.env, TEMP: temp, TMP: temp, TMPDIR: temp }, stdio: ['pipe', 'pipe', 'pipe'] });
    exit = new Promise(r => p.on('close', r));
    let out = '', err = '';
    p.stderr.on('data', d => { err += d; });
    p.stdout.on('data', d => { out += d; if (out.includes('\n')) done({ url: out.split('\n')[0].trim(), proc: p, temp, exit }); });
    p.on('close', code => done(code === 4 ? null : { url: '', proc: p, err, temp, exit }));
  });
}

test('browser.mjs: in một dòng URL, trả lời /json/version; đóng stdin thì thoát 0, tắt trình duyệt, xoá hồ sơ', async t => {
  const b = await startBrowser(t);
  if (!b) return t.skip('không có trình duyệt');
  const temp = b.temp;
  assert.match(b.url, /^http:\/\/127\.0\.0\.1:\d+$/, b.err);
  assert.ok(await alive(b.url));
  assert.equal(fs.readdirSync(temp).filter(f => f.startsWith('cdp-')).length, 1, 'một hồ sơ cdp-* của trình duyệt chung');
  b.proc.stdin.end();
  assert.equal(await b.exit, 0);
  assert.ok(!(await alive(b.url)), 'trình duyệt còn trả lời sau khi đóng');
  assert.deepEqual(fs.readdirSync(temp).filter(f => f.startsWith('cdp-')), []);
});

test('run.mjs gắn vào trình duyệt chung (QA_CDP): mỗi lần một ngữ cảnh riêng, localStorage trống, không tạo hồ sơ cdp-*', async t => {
  const b = await startBrowser(t);
  if (!b) return t.skip('không có trình duyệt');
  const temp = tmp(t, 'qa-temp-');
  const env = { QA_CDP: b.url, TEMP: temp, TMP: temp, TMPDIR: temp };
  const one = runMjs(t, LONG, [{ name: 'ghi', js: 'localStorage.setItem("k", "1")', check: 'localStorage.getItem("k")' }], { env });
  assert.equal(one.r.status, 0, one.r.stderr);
  assert.equal(JSON.parse(one.r.stdout).find(s => s.step === 'ghi').check, '1');
  const two = runMjs(t, LONG, [{ name: 'doc', check: 'String(localStorage.getItem("k"))', shot: 'a' }], { env });
  assert.equal(two.r.status, 0, two.r.stderr);
  const rep = JSON.parse(two.r.stdout);
  assert.equal(rep.find(s => s.step === 'doc').check, 'null');
  assert.deepEqual(pngSize(path.join(two.out, 'a.png')), [1440, 900]);
  assert.deepEqual(fs.readdirSync(temp).filter(f => f.startsWith('cdp-')), [], 'lần gắn không được tạo hồ sơ hay để lại thư mục tải');
  // Trình duyệt chung chỉ còn trang about:blank ban đầu: ngữ cảnh của hai lần chạy đã huỷ
  const pages = (await (await fetch(b.url + '/json/list')).json()).filter(x => x.type === 'page');
  assert.equal(pages.length, 1, JSON.stringify(pages.map(x => x.url)));
});

test('run.mjs gắn: hai lần song song ở hai khổ, mỗi báo cáo đúng khổ của mình', async t => {
  const b = await startBrowser(t);
  if (!b) return t.skip('không có trình duyệt');
  const run = (w, h) => new Promise(done => {
    const dir = tmp(t, 'run-');
    fs.writeFileSync(path.join(dir, 'p.html'), LONG);
    fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ steps: [{ name: 'a', wait: 800, check: 'innerWidth' }, { name: 'b', wait: 800, check: 'innerWidth' }] }));
    const p = spawn(process.execPath, [RUN, path.join(dir, 'p.html'), path.join(dir, 'steps.json'), path.join(dir, 'out'), String(w), String(h)], { env: { ...process.env, QA_CDP: b.url } });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { err += d; });
    p.on('close', code => done({ code, out, err }));
  });
  const [a, m] = await Promise.all([run(1440, 900), run(390, 844)]);
  assert.equal(a.code, 0, a.err); assert.equal(m.code, 0, m.err);
  assert.deepEqual(JSON.parse(a.out).filter(s => s.dims).map(s => [s.check, s.dims.cw]), [[1440, 1440], [1440, 1440]]);
  assert.deepEqual(JSON.parse(m.out).filter(s => s.dims).map(s => [s.check, s.dims.cw]), [[390, 390], [390, 390]]);
});

test('run.mjs gắn: lỗi giữa chừng thì thoát khác 0, huỷ ngữ cảnh của mình, trình duyệt chung vẫn sống', async t => {
  const b = await startBrowser(t);
  if (!b) return t.skip('không có trình duyệt');
  const { r } = runMjs(t, LONG, [{ name: 'xem', shot: 'khong-co/anh' }], { env: { QA_CDP: b.url } });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /ENOENT/);
  assert.ok(await alive(b.url), 'trình duyệt chung bị đóng theo');
  const pages = (await (await fetch(b.url + '/json/list')).json()).filter(x => x.type === 'page');
  assert.equal(pages.length, 1, JSON.stringify(pages.map(x => x.url)));
});

test('run.mjs gắn: QA_CDP không có trình duyệt thì thoát 2 và nêu QA_CDP', t => {
  const { r } = runMjs(t, LONG, [{ name: 'xem' }], { env: { QA_CDP: 'http://127.0.0.1:1' } });
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /QA_CDP/);
});

// Đo ba skill sửa (05/10/2026): _system ở 390 cao 23 856px (28 màn) mà bộ khói chụp 16 màn và cắt ở 15 000px, nên mục Component
// ở 390 không có ảnh; agent đoán lát nào chứa phần cần xem, mở nhầm dải chân trang (4 trên 6 lần)
test('run.mjs: "slices": "all" chụp hết trang, kể cả quá 15 000px; slices.json ghi tiêu đề h1–h3 bắt đầu trong từng lát', t => {
  const TALL = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Cao</title><style>body{margin:0}h2{margin:0}section{height:900px}section:last-child{background:#d00000}</style></head>
<body>${Array.from({ length: 20 }, (_, i) => `<section><h2>Khối ${i + 1}</h2>${i === 4 ? '<h3>Mục con</h3><h3 hidden>Ẩn</h3>' : ''}</section>`).join('')}</body></html>`;
  const { r, out } = runMjs(t, TALL, [{ name: 'man', shot: 'man', slices: 'all' }]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const shots = fs.readdirSync(out).filter(f => /^man(-\d+)?\.png$/.test(f));
  assert.equal(shots.length, 20, shots.join(', '));
  // Lát cuối bắt đầu ở 17 100px, quá trần 15 000px của ảnh cả trang: vẫn có nội dung, không trống
  assert.deepEqual(pngPixel(path.join(out, 'man-20.png'), 720, 450), [208, 0, 0]);
  const labels = JSON.parse(fs.readFileSync(path.join(out, 'slices.json'), 'utf8'));
  assert.deepEqual(labels['man.png'], ['Khối 1']);
  assert.deepEqual(labels['man-5.png'], ['Khối 5', 'Mục con']);
  assert.deepEqual(labels['man-20.png'], ['Khối 20']);
});

// Điểm ảnh của PNG 8 bit RGB/RGBA không xen dòng (ảnh của run.mjs): giải nén IDAT, bỏ bộ lọc từng dòng
function pngPixel(f, x, y) {
  const b = fs.readFileSync(f), w = b.readUInt32BE(16), type = b[25], bpp = type === 6 ? 4 : 3, idat = [];
  for (let o = 8; o < b.length;) { const n = b.readUInt32BE(o), t = b.toString('latin1', o + 4, o + 8); if (t === 'IDAT') idat.push(b.subarray(o + 8, o + 8 + n)); o += 12 + n; }
  const raw = require('node:zlib').inflateSync(Buffer.concat(idat)), stride = w * bpp;
  let prev = Buffer.alloc(stride), row;
  for (let r = 0; r <= y; r++) {
    const f0 = raw[r * (stride + 1)], src = raw.subarray(r * (stride + 1) + 1, (r + 1) * (stride + 1));
    row = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c);
      row[i] = (src[i] + [0, a, up, (a + up) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? up : c][f0]) & 255;
    }
    prev = row;
  }
  return [...row.subarray(x * bpp, x * bpp + 3)];
}
// Đo 4.5: ảnh chụp hết trang không cuộn, nên section hiện dần bằng IntersectionObserver ra trống mà bộ kiểm vẫn báo sạch (cả hai lần B4)
const REVEAL = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hiện dần</title>
<style>body{margin:0;background:#fff}section{height:700px}.r{height:100%;background:#d00000;opacity:0;transition:opacity .3s}.r.in{opacity:1}</style></head>
<body>${'<section><div class="r"></div></section>'.repeat(4)}<script>const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }));
document.querySelectorAll('.r').forEach(el => io.observe(el));</script></body></html>`;

test('run.mjs: "slices" và "full" cuộn qua trang trước khi chụp: phần hiện dần khi cuộn tới có trong ảnh', t => {
  const { r, out } = runMjs(t, REVEAL, [{ name: 'man', shot: 'man', slices: 8 }, { name: 'ca', shot: 'ca', full: true }, { name: 'sau', check: 'scrollY' }]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  // Màn 3 bắt đầu ở 1800px: điểm giữa (y 2150) nằm trong section thứ tư, section mà màn đầu không thấy
  assert.deepEqual(pngPixel(path.join(out, 'man-3.png'), 720, 350), [208, 0, 0]);
  assert.deepEqual(pngPixel(path.join(out, 'ca.png'), 720, 2500), [208, 0, 0]);
  // Chụp xong trang về đúng chỗ cũ
  assert.equal(JSON.parse(r.stdout).find(s => s.step === 'sau').check, 0);
});

// Đo 4.5: qa_init.py chép qa-query vào file bước lúc cài, nên sửa thẻ meta sau đó không có tác dụng; agent phải sửa _qa/steps-smoke-*.json (2 lượt)
const QPAGE = q => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="qa-query" content="${q}"><title>T</title></head><body><script>document.title = location.search; new URLSearchParams(location.search).get('gio')</script></body></html>`;

test('qa_init.py không chép qa-query vào file bước; run.mjs đọc thẻ của trang ở mỗi lần chạy, &amp; thành & (không thành tham số amp;thu)', t => {
  const dir = tmp(t, 'qaq-');
  fs.mkdirSync(path.join(dir, 'site'));
  const page = path.join(dir, 'site', 'index.html');
  fs.writeFileSync(page, QPAGE('?gio=11:00&amp;thu=2'));
  const r = spawnSync(PYTHON, [QA_INIT, dir], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const sf = path.join(dir, '_qa', 'steps-smoke-index.json');
  assert.equal(JSON.parse(fs.readFileSync(sf, 'utf8')).query, undefined);
  const title = () => {
    const x = spawnSync(process.execPath, [RUN, page, sf, path.join(dir, 'out'), '1440', '900'], { encoding: 'utf8', timeout: 90000, env: { ...process.env, QA_NOSHOT: '1' } });
    return x.status === 4 ? null : JSON.parse(x.stdout).find(s => s.step === 'view').check;
  };
  const first = title();
  if (first === null) return t.skip('không có trình duyệt');
  assert.equal(first, '?gio=11:00&thu=2');
  // Sửa thẻ meta: lần chạy sau nhận ngay, không cần chạy lại qa_init.py hay sửa file bước
  fs.writeFileSync(page, QPAGE('?gio=8:40'));
  assert.equal(title(), '?gio=8:40');
});

test('qa_init.py --update: bỏ "query" cố định trùng qa-query của trang (bản cài cũ), báo khi khác', t => {
  const dir = tmp(t, 'qau-');
  fs.mkdirSync(path.join(dir, 'site'));
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), QPAGE('?gio=11:00'));
  fs.writeFileSync(path.join(dir, 'site', 'gio.html'), QPAGE('?gio=8:40'));
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { encoding: 'utf8', env }).status, 0);
  const sf = k => path.join(dir, '_qa', `steps-smoke-${k}.json`);
  const put = (k, q) => fs.writeFileSync(sf(k), JSON.stringify({ query: q, ...JSON.parse(fs.readFileSync(sf(k), 'utf8')) }));
  put('index', '?gio=11:00');
  put('gio', '?gio=11:00');
  const r = spawnSync(PYTHON, [QA_INIT, dir, '--update'], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(JSON.parse(fs.readFileSync(sf('index'), 'utf8')).query, undefined);
  assert.equal(JSON.parse(fs.readFileSync(sf('gio'), 'utf8')).query, '?gio=11:00');
  assert.match(r.stdout, /steps-smoke-gio\.json ghi "query": "\?gio=11:00" khác qa-query của trang \("\?gio=8:40"\)/);
});

// Đo 4.5: hàng cửa vòm (lưới 1fr, cỡ chữ theo vw) đè ra ngoài khung 320px và ảnh aspect-ratio làm trang rộng 1652px; bộ kiểm chỉ báo
// "trang rộng …px", không nêu phần tử, và không thấy hộp tràn khỏi khối cha vì chữ vẫn nằm trong hộp của nó
const SPILL = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tràn</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:sans-serif}.narrow{width:320px;padding:8px}.doors{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.door{display:flex;flex-direction:column;align-items:center;border:0;background:#6b2d1c;color:#fff;padding:8px 2px}.door .t{font-size:3.4vw;font-weight:700}
.tray{display:grid;grid-template-columns:1fr 1.2fr;gap:16px;width:900px}.ph{aspect-ratio:4/3;background:#333;height:100%}
.bleed{margin:0 -16px}.abs{position:relative}.abs span{position:absolute;left:0;width:2000px}</style></head><body>
<div class="narrow"><div class="doors"><button class="door"><span class="t">6:00</span><span>Đã hết</span></button><button class="door"><span class="t">15:00</span><span>Chưa</span></button><button class="door"><span class="t">17:30</span><span>Chưa</span></button><button class="door"><span class="t">9:30</span><span>Đang</span></button></div>
<p class="bleed">Tràn lề cố ý bằng lề âm</p></div>
<div class="tray"><div class="ph"></div><div style="height:1200px">Khay</div></div><div class="abs"><span aria-hidden="true"></span></div>
</body></html>`;

test('run.mjs: nêu phần tử gây tràn ngang trang và hộp tràn khỏi khối cha; bỏ qua lề âm và phần tử định vị tuyệt đối', t => {
  const { r } = runMjs(t, SPILL, [{ name: 's', check: '1' }]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const d = JSON.parse(r.stdout).find(s => s.step === 's').dims;
  assert.ok(d.sw > d.cw);
  assert.ok(d.wide.some(x => /^div\.ph tới \d+px$/.test(x)), JSON.stringify(d.wide));
  assert.ok(d.cut.some(x => /^button\.door "[^"]*": tràn khỏi khối cha div\.doors \d+px$/.test(x)), JSON.stringify(d.cut));
  assert.ok(d.cut.some(x => /^div\.ph "": tràn khỏi khối cha div\.tray \d+px$/.test(x)), JSON.stringify(d.cut));
  assert.ok(!d.cut.some(x => /bleed|span/.test(x)), JSON.stringify(d.cut));
  // Trang không tràn thì không đo phần tử gây tràn
  const ok = runMjs(t, LONG, [{ name: 's', check: '1' }]);
  assert.deepEqual(JSON.parse(ok.r.stdout).find(s => s.step === 's').dims.wide, []);
});

// Spinner đang quay làm ảnh mỗi lần một khác; system-check.mjs so ảnh để báo màn đổi
test('run.mjs: ảnh "slices" ổn định giữa hai lần chạy khi trang có chuyển động lặp vô hạn', t => {
  const page = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Quay</title><style>body{margin:0}.s{width:40px;height:40px;margin:40px;border:6px solid #333;border-top-color:#e60;border-radius:50%;animation:q .7s linear infinite}@keyframes q{to{transform:rotate(360deg)}}</style></head><body><div class="s"></div></body></html>`;
  const a = runMjs(t, page, [{ name: 'v', shot: 'v', slices: 1 }]);
  if (a.r.status === 4) return t.skip('không có trình duyệt');
  const b = runMjs(t, page, [{ name: 'v', wait: 1100, shot: 'v', slices: 1 }]);
  assert.ok(fs.readFileSync(path.join(a.out, 'v.png')).equals(fs.readFileSync(path.join(b.out, 'v.png'))), 'hai ảnh khác nhau');
});

test('qa_init.py: bộ khói của trang web và _system chụp hết trang theo từng màn; màn app không', t => {
  const dir = tmp(t, 'qas-');
  fs.mkdirSync(path.join(dir, 'site'));
  const page = (attrs = '') => `<!doctype html><html lang="vi"${attrs}><head><meta charset="utf-8"><title>T</title></head><body><h1>T</h1></body></html>`;
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), page());
  fs.writeFileSync(path.join(dir, 'site', '_system.html'), page());
  fs.writeFileSync(path.join(dir, 'site', 'man.html'), page(' data-surface="app"'));
  const r = spawnSync(PYTHON, [QA_INIT, dir], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const steps = k => JSON.parse(fs.readFileSync(path.join(dir, '_qa', `steps-smoke-${k}.json`), 'utf8'));
  const view = k => steps(k).steps[0];
  assert.equal(view('index').slices, 8);
  // Đo 4.5: _system 8 màn cắt mất component ở 390 (cả hai review ghi "không đánh giá được"); đo ba skill sửa: 16 màn vẫn cắt
  // (_system ở 390 cao 28 màn), nên chụp hết trang
  assert.equal(view('_system').slices, 'all');
  assert.equal(view('man').slices, undefined);
  // Trang web đo và chụp các trạng thái khai ở qa-states; _system và màn app thì không
  assert.equal(steps('index').states, true);
  assert.equal(steps('_system').states, undefined);
  assert.equal(steps('man').states, undefined);

  // --update trên bộ cài cũ: _system 8 hay 16 màn thành "all", trang web thêm "states"
  for (const n of [8, 16]) {
    for (const [k, f] of [['_system', st => { delete st.states; st.steps[0].slices = n; }], ['index', st => { delete st.states; }]]) {
      const st = steps(k); f(st); fs.writeFileSync(path.join(dir, '_qa', `steps-smoke-${k}.json`), JSON.stringify(st));
    }
    const u = spawnSync(PYTHON, [QA_INIT, dir, '--update'], { encoding: 'utf8', env });
    assert.equal(u.status, 0, u.stdout + u.stderr);
    assert.equal(view('_system').slices, 'all', `bộ cài cũ ${n} màn`);
    assert.equal(steps('index').states, true);
  }
});

// Đo 4.5: bộ khói chỉ chụp trạng thái của qa-query (8:40); lỗi ở giờ khác (nút chính trỏ sai mẻ lúc 7:00) chỉ review đọc mã mới thấy
test('run.mjs: "states" đo và chụp màn đầu từng trạng thái của qa-states, tham số trạng thái đè lên qa-query', t => {
  const page = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="qa-query" content="?gio=8:40&amp;thu=7"><meta name="qa-states" content="?gio=7:00 | ?thu=2&amp;gio=6:00"><title>T</title>
<style>body{margin:0}.w{width:2000px}</style></head><body><h1 id="h"></h1><script>const q = new URLSearchParams(location.search);
document.getElementById('h').textContent = q.get('gio') + ' ' + q.get('thu'); if (q.get('thu') === '2') document.body.insertAdjacentHTML('beforeend', '<div class="w">rộng</div>');</script></body></html>`;
  const { r, out } = runMjs(t, page, [{ name: 'view', check: "document.getElementById('h').textContent", shot: 'index', jpeg: true }], { steps: { states: true } });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const rep = JSON.parse(r.stdout);
  assert.equal(rep.find(s => s.step === 'view').check, '8:40 7');
  const a = rep.find(s => s.step === 'trạng thái ?gio=7:00'), b = rep.find(s => s.step === 'trạng thái ?thu=2&gio=6:00');
  assert.ok(a && b, rep.map(s => s.step).join(', '));
  assert.ok(a.dims.sw <= a.dims.cw);
  assert.ok(b.dims.sw > b.dims.cw, 'trạng thái thứ Hai tràn ngang: phải đo ra');
  assert.deepEqual(fs.readdirSync(out).sort(), ['index.jpg', 'index@gio_7_00.jpg', 'index@thu_2_gio_6_00.jpg']);
  // Không có "states" thì không đo thêm
  const plain = runMjs(t, page, [{ name: 'view', check: '1' }]);
  assert.deepEqual(JSON.parse(plain.r.stdout).map(s => s.step), ['load', 'view']);
});

// ---- scripts/system-check.mjs: B2 và Cổng 3 trong một lệnh ----
const DARK = { mode: 'dark', seeds: { bg: '#0B0C0E', surface: '#141518', ink: '#EDEDEF', muted: '#A1A1AA', line: '#2A2B30',
  primary: '#2DD4BF', 'on-primary': '#0B0C0E', accent: '#2DD4BF', 'on-accent': '#0B0C0E', destructive: '#F97066', 'on-destructive': '#0B0C0E' }, overrides: {} };

// Dựng thư mục prototype đúng như B2: khuôn _system.html, color.js, theme.js, tokens.css, themes.json (chưa chạy themes.mjs)
function b2(t, { dark = false, demo = true } = {}) {
  const dir = tmp(t, 'b2-');
  const assets = path.join(dir, 'site', 'assets');
  fs.mkdirSync(assets, { recursive: true });
  let sys = fs.readFileSync(T('system.html'), 'utf8');
  if (!demo) sys = sys.replace(/<div data-system-demo>[\s\S]*?\n    <\/div>\n/, '<div class="demo-row"><button type="button" class="demo-btn">Giữ bánh</button></div>\n');
  fs.writeFileSync(path.join(dir, 'site', '_system.html'), sys);
  for (const f of ['color.js', 'theme.js', 'tokens.css']) fs.copyFileSync(T(f), path.join(assets, f));
  const themes = JSON.parse(fs.readFileSync(T('themes.json'), 'utf8'));
  if (dark) { themes.themes.dark = DARK; themes.default.dark = 'dark'; }
  fs.writeFileSync(path.join(assets, 'themes.json'), JSON.stringify(themes, null, 2));
  return dir;
}
const systemCheck = dir => spawnSync(process.execPath, [path.join(S2S, 'scripts', 'system-check.mjs'), dir], { encoding: 'utf8', timeout: 240000, env });

test('system-check.mjs: themes.mjs, preflight, đo _system.html ở 1440 và 390 mọi theme, ảnh cho Cổng 3; kết quả ngắn', t => {
  const dir = b2(t, { dark: true, demo: false });
  const r = systemCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^themes\.mjs: 2 theme · 52 cặp · 0 không đạt · 0 sát ngưỡng/m);
  assert.match(r.stdout, /^preflight site\/: 1 file · 0 lỗi · 0 cảnh báo/m);
  for (const th of ['light', 'dark']) {
    assert.match(r.stdout, new RegExp(`^_system ${th} 1440: console 0 · tràn ngang 0 · trong khung 0 · tương phản 0 · ý định 0 · component mẫu 0 · cặp 26/26$`, 'm'));
    assert.match(r.stdout, new RegExp(`^_system ${th} 390: console 0 · tràn ngang 0 · trong khung 0 · tương phản 0 · ý định 0$`, 'm'));
    const shots = path.join(dir, '_shots', 'system');
    assert.ok(fs.existsSync(path.join(shots, `${th}-1440-full.png`)), `thiếu ảnh cả trang ${th}`);
    assert.deepEqual(pngSize(path.join(shots, `${th}-1440.png`)), [1440, 900]);
    assert.ok(fs.existsSync(path.join(shots, `${th}-1440-2.png`)), `thiếu màn thứ hai ${th}`);
  }
  assert.match(r.stdout, /^Ảnh \(mở cùng một lượt\):/m);
  // Thư mục tuyệt đối và tên từng ảnh (đo 4.5: in dải tên nên agent phải ls)
  assert.match(r.stdout, new RegExp(`^ {2}thư mục: ${dir.replace(/\\/g, '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_shots/system/$`, 'm'));
  assert.match(r.stdout, /^ {2}light: light-1440\.png, light-1440-2\.png[^\n]* · cả trang: light-1440-full\.png$/m);
  assert.match(r.stdout, /^ {2}lần chạy đầu: mở mọi màn$/m);
  assert.match(r.stdout, /^Kết luận: SẠCH/m);
  assert.ok(r.stdout.length < 3000, `kết quả dài ${r.stdout.length} ký tự`);
  assert.ok(!fs.existsSync(path.join(dir, '_qa')), 'không tạo _qa/: thư mục đó là của bộ kiểm ở B4');

  // Lần chạy sau: báo màn nào đổi để chỉ mở lại màn đó (đo 4.5: mở lại cả 10–11 màn sau mỗi đợt sửa nhỏ). Không sửa gì thì không màn nào đổi;
  // cảnh báo preflight không chặn (P13) in cả dòng, đường dẫn tính từ thư mục prototype
  const f = path.join(dir, 'site', '_system.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('<button type="button" class="demo-btn">Giữ bánh</button>', '<button type="button" class="demo-btn">Giữ bánh</button><a href="#" class="demo-btn">Xem</a>'));
  const again = systemCheck(dir);
  assert.match(again.stdout, /^ {2}site\/_system\.html:\d+ {2}P13 {2}CẢNH BÁO/m);
  assert.match(again.stdout, /^ {2}đổi so với lần chạy trước \(chỉ cần mở lại các màn này\): /m);
  const same = systemCheck(dir);
  assert.match(same.stdout, /^ {2}không màn nào đổi so với lần chạy trước$/m);
});

test('system-check.mjs: còn component mẫu thì báo và thoát 1; cặp màu không đạt thì dừng ngay, không ghi themes.css', t => {
  const dir = b2(t);
  const r = systemCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /component mẫu 1/);
  assert.match(r.stdout, /^Kết luận: CÒN \d+ mục/m);

  const bad = b2(t);
  const tf = path.join(bad, 'site', 'assets', 'themes.json');
  const th = JSON.parse(fs.readFileSync(tf, 'utf8'));
  th.themes[Object.keys(th.themes)[0]].seeds.muted = '#DDDDDD';
  fs.writeFileSync(tf, JSON.stringify(th));
  const r2 = systemCheck(bad);
  assert.equal(r2.status, 1, r2.stdout + r2.stderr);
  assert.match(r2.stdout, /^themes\.mjs: [^\n]*[1-9]\d* không đạt[^\n]*KHÔNG ghi/m);
  assert.match(r2.stdout, /KHÔNG ĐẠT/);
  assert.doesNotMatch(r2.stdout, /^_system /m);
  assert.ok(!fs.existsSync(path.join(bad, 'site', 'assets', 'themes.css')));
});

test('system-check.mjs: tràn ngang kèm phần tử gây ra', t => {
  const dir = b2(t, { demo: false });
  const f = path.join(dir, 'site', '_system.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('<div class="demo-row">', '<div class="x-wide" style="width:2000px;height:8px"></div><div class="demo-row">'));
  const r = systemCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /tràn ngang: trang rộng \d+px trong khung 1440px, do div\.x-wide tới \d+px/);
});

// ---- scripts/qa-check.py: B4 trong một lệnh ----
const PAGE = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Trang chủ</title></head>
<body><main><h1>Lò Bánh Củi Cô Ba</h1><p>Bốn mẻ bánh mỗi ngày.</p><button type="button">Giữ bánh</button></main></body></html>`;
const qaCheck = dir => spawnSync(PYTHON, [path.join(S2S, 'scripts', 'qa-check.py'), dir], { encoding: 'utf8', timeout: 300000, env });

test('qa-check.py: cài bộ kiểm khi chưa có, chạy handover, in gọn và liệt kê ảnh theo bộ; lần sau chỉ cập nhật', t => {
  const dir = tmp(t, 'b4-');
  fs.mkdirSync(path.join(dir, 'site'));
  // Trang cao khoảng 2 màn rưỡi ở 1440×900: bộ khói chụp 3 ảnh
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE.replace('</main>', '<div style="height:1900px"></div></main>'));
  // Thư mục _qa/ có sẵn mà chưa có bộ kiểm (ảnh Cổng 3 của bản trước): vẫn cài mới
  fs.mkdirSync(path.join(dir, '_qa', 'cong-3'), { recursive: true });
  const r = qaCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.match(r.stdout, /^Bộ kiểm: cài mới · 1 trang, 3 bộ khói/m);
  assert.match(r.stdout, /^Thư mục chạy: _qa[\\/]handover[\\/]\d{8}-\d{4}$/m);
  assert.match(r.stdout, /^default: 3 bộ · \d+ bước · console 0 · FAIL 0/m);
  assert.match(r.stdout, /^Ảnh \(mở cùng một lượt\):$/m);
  // Thư mục ảnh tuyệt đối, tên từng ảnh theo thứ tự màn (không in dải "index-2.jpg … index.jpg": đo 4.5 phải thêm một lượt ls)
  assert.match(r.stdout, new RegExp(`^ {2}thư mục: ${dir.replace(/\\/g, '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_qa/handover/\\d{8}-\\d{4}/$`, 'm'));
  // Lát kèm tiêu đề bắt đầu trong lát (đo ba skill sửa: handover mở nhầm dải chân trang ở cả hai lần bản mới)
  assert.match(r.stdout, /^ {2}default\/smoke-index-1440: index\.jpg \(Lò Bánh Củi Cô Ba\), index-2\.jpg, index-3\.jpg$/m);
  assert.doesNotMatch(r.stdout, / … /);
  assert.match(r.stdout, /^Kết luận: /m);
  assert.ok(r.stdout.length < 6000, `kết quả dài ${r.stdout.length} ký tự`);
  assert.equal(r.status, 0, r.stdout + r.stderr);

  // Lần sau, đã có mốc: nợ cũ, bộ mới, bộ mất in cả khi bằng 0 (đo ba skill sửa: cả hai lần handover đọc handover.json chỉ để chắc)
  const run1 = /^Thư mục chạy: (\S+)$/m.exec(r.stdout)[1];
  assert.equal(spawnSync(PYTHON, [path.join('_qa', 'handover.py'), 'promote', run1], { cwd: dir, encoding: 'utf8', env }).status, 0);
  const again = qaCheck(dir);
  assert.match(again.stdout, /^Bộ kiểm: đã có, cập nhật script/m);
  assert.match(again.stdout, /^default: 3 bộ · [^\n]* · check đổi so với last-green 0 · nợ cũ 0$/m);
  assert.match(again.stdout, /^Bộ mới \(chưa có trong last-green\): không$/m);
  assert.match(again.stdout, /^Bộ có trong last-green mà lần này không chạy: không$/m);
  assert.match(again.stdout, /^Nợ cũ \(0\): không có$/m);
  assert.equal(again.status, 0, again.stdout + again.stderr);
});

test('qa-check.py: lỗi in tối đa 15 dòng, phần còn lại ở handover.json; thoát 1', t => {
  const dir = tmp(t, 'b4e-');
  fs.mkdirSync(path.join(dir, 'site'));
  // 10 nút chữ tràn khung: bộ chạy báo tới 8 chỗ mỗi bước, ở 3 khổ thành khoảng 24 dòng lỗi
  const tight = Array.from({ length: 10 }, (_, i) => `<button type="button" style="width:24px;white-space:nowrap">Giữ bánh mẻ ${i}</button>`).join('');
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE.replace('</main>', `${tight}</main>`));
  const r = qaCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  const lines = r.stdout.split(/\r?\n/);
  const at = lines.findIndex(l => /^Lỗi \(\d+\):$/.test(l));
  assert.ok(at >= 0, r.stdout);
  const after = lines.slice(at + 1);
  const shown = after.slice(0, after.findIndex(l => !l.startsWith('  '))).length;
  assert.ok(shown <= 16, `in ${shown} dòng lỗi`);
  assert.match(r.stdout, /… còn \d+ dòng: đủ ở _qa[\\/]handover[\\/]\d{8}-\d{4}[\\/]handover\.json/);
  assert.match(r.stdout, /^Kết luận: CHƯA SẠCH/m);
});

// Có bản đồ (sketch-to-map): qa-check.py chạy thêm map.mjs coverage; gỡ một data-feature thì chưa sạch, thoát 1
test('qa-check.py: có map/features.js thì kiểm độ phủ; gỡ một data-feature thì thoát 1', t => {
  const dir = tmp(t, 'b4m-');
  fs.mkdirSync(path.join(dir, 'site'));
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify({ features: [
    { id: 'F-01', name: 'Giữ bánh', module: 'ban', src: ['UC-01'], roles: ['khach'], freq: 'ngay', evidence: 'ro', status: 'pham-vi', spec: 'Giữ một mẻ bánh.' }] })};`);
  fs.writeFileSync(path.join(dir, 'map', 'layout.js'), `window.LAYOUT = ${JSON.stringify({
    surfaces: [{ id: 'web', name: 'Web', kind: 'web', dir: '' }], roles: [{ id: 'khach', name: 'Khách', surface: 'web', home: 'index' }],
    modules: [{ id: 'ban', name: 'Bán', depends: [] }],
    screens: [{ id: 'index', name: 'Trang chủ', surface: 'web', module: 'ban', roles: ['khach'], file: 'index.html', bands: [{ name: 'Hôm nay', items: ['F-01'] }] }],
    nav: [{ roles: ['khach'], groups: [{ name: '', items: ['index'] }] }], place: { 'F-01': { screen: 'index', tier: 1, mo: 'tai-cho' } } })};`);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE.replace('<button type="button">', '<button type="button" data-feature="F-01">'));
  const r = qaCheck(dir);
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.match(r.stdout, /^Độ phủ: 1\/1 chức năng có trên trang đã dựng/m);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE);
  const bad = qaCheck(dir);
  assert.equal(bad.status, 1, bad.stdout);
  assert.match(bad.stdout, /^ {2}F-01 "Giữ bánh" · màn index · site\/index\.html$/m);
  assert.match(bad.stdout, /^Kết luận: CHƯA SẠCH: độ phủ/m);
});
