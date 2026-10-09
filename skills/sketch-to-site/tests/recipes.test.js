// Chạy thật các công thức mà tài liệu kit hướng dẫn, để lệnh ghi trong tài liệu luôn chạy được.
// Cần Python 3, Node 20+, Edge hoặc Chrome; không có trình duyệt thì test chạy trình duyệt tự bỏ qua.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const S2S = path.resolve(__dirname, '..');
const REPO = path.resolve(S2S, '..', '..');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const QA_INIT = path.join(S2S, 'templates', 'qa-kit', 'qa_init.py');
const PAGE = withFeature => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Đơn hàng</title></head>
<body><main><h1>Đơn hàng</h1>${withFeature ? '<button type="button" data-export>Xuất Excel</button><dialog data-export-modal><p>Xuất 12 đơn?</p></dialog><script>document.querySelector("[data-export]").addEventListener("click", () => document.querySelector("[data-export-modal]").show());</script>' : ''}</main></body></html>`;

function prototype(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tdd-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'site'));
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(false));
  return dir;
}

test('qa_init.py không sập khi prototype nằm khác ổ đĩa với thư mục đang đứng', t => {
  const dir = prototype(t);
  if (path.parse(dir).root.toLowerCase() === path.parse(REPO).root.toLowerCase()) return t.skip('thư mục tạm cùng ổ đĩa với repo');
  const r = spawnSync(PYTHON, [QA_INIT, dir], { cwd: REPO, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /Xong\. Từ /);
});

test('kiểm trước, dựng sau: bộ của tính năng đỏ khi chưa dựng, xanh khi đã dựng', t => {
  const dir = prototype(t);
  const init = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  fs.writeFileSync(path.join(dir, '_qa', 'steps-xuat-excel.json'), JSON.stringify({ steps: [{
    name: 'mo-modal', js: "document.querySelector('[data-export]')?.click()",
    check: "document.querySelector('[data-export-modal]')?.open ? 'PASS' : 'FAIL: chưa mở được modal xuất'" }] }));
  const cfgFile = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  cfg.suites.push(['tinh-nang-xuat-excel', 'index', 'xuat-excel', 'desktop']);
  fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2));
  const run = () => spawnSync(PYTHON, [path.join('_qa', 'run_all.py'), path.join('_qa', '.tdd'), 'tinh-nang-xuat-excel'], { cwd: dir, encoding: 'utf8', timeout: 120000 });

  const red = run();
  if (/Không tìm thấy Edge/.test(red.stdout + red.stderr)) return t.skip('không có trình duyệt');
  assert.match(red.stdout, /^tinh-nang-xuat-excel: \d+ bước · .*FAIL 1 \['mo-modal'\] · im lặng 0/m);

  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(true));
  const green = run();
  assert.match(green.stdout, /^tinh-nang-xuat-excel: \d+ bước · console 0 · .*FAIL 0 +· im lặng 0/m);
});

// Một trình duyệt chung cho cả lệnh (browser.mjs qua qalib.shared_browser): run_all.py, quick.py, handover.py, breaktest.py không mở
// mỗi bộ một trình duyệt nữa. Đo 09/10/2026: khởi động cộng tạo/xoá hồ sơ chiếm hơn nửa CPU của một lần run.mjs
test('qalib.shared_browser(): trong with có QA_CDP và trình duyệt trả lời, sau with biến mất và trình duyệt tắt; thiếu browser.mjs thì vẫn vào ra êm', t => {
  const dir = prototype(t);
  const init = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  assert.ok(fs.existsSync(path.join(dir, '_qa', 'browser.mjs')), 'qa_init.py phải chép browser.mjs');
  assert.ok(fs.existsSync(path.join(dir, '_qa', 'launch.mjs')), 'qa_init.py phải chép launch.mjs');
  // Không mang QA_CDP của trình duyệt chung của file test này vào: test này kiểm chính việc mở trình duyệt
  const noCdp = { ...process.env, PYTHONIOENCODING: 'utf-8' }; delete noCdp.QA_CDP;
  const py = `
import json, os, sys, urllib.request
sys.path.insert(0, os.path.join(sys.argv[1], '_qa'))
os.chdir(sys.argv[1])
import qalib
def ping(url):
    try: urllib.request.urlopen(url + '/json/version', timeout=2); return True
    except Exception: return False
with qalib.shared_browser():
    url = os.environ.get('QA_CDP', '')
    inside = {'url': url, 'alive': ping(url) if url else None}
    with qalib.shared_browser():
        inside['nested_same'] = os.environ.get('QA_CDP') == url
print(json.dumps({'inside': inside, 'after': os.environ.get('QA_CDP'), 'alive_after': ping(url) if url else None}))
`;
  const r = spawnSync(PYTHON, ['-c', py, dir], { cwd: dir, encoding: 'utf8', timeout: 60000, env: noCdp });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const o = JSON.parse(r.stdout.trim().split('\n').pop());
  if (o.inside.url === '' && /Không tìm thấy Edge/.test(r.stderr)) return t.skip('không có trình duyệt');
  assert.match(o.inside.url, /^http:\/\/127\.0\.0\.1:\d+$/);
  assert.equal(o.inside.alive, true);
  assert.equal(o.inside.nested_same, true, 'lồng nhau phải dùng lại trình duyệt đã mở');
  assert.equal(o.after, null);
  assert.equal(o.alive_after, false, 'trình duyệt phải tắt sau with');
  // Bộ kiểm cũ chưa có browser.mjs: vẫn chạy, chỉ không dùng chung
  fs.rmSync(path.join(dir, '_qa', 'browser.mjs'));
  const r2 = spawnSync(PYTHON, ['-c', py, dir], { cwd: dir, encoding: 'utf8', timeout: 60000, env: noCdp });
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  const o2 = JSON.parse(r2.stdout.trim().split('\n').pop());
  assert.equal(o2.inside.url, '');
  assert.equal(o2.after, null);
});

test('run.mjs: bước js chuyển trang thì đợi trang mới tải xong, không sập khi đo bố cục', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nav-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const page = (title, body) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${title}</title></head><body>${body}</body></html>`;
  fs.writeFileSync(path.join(dir, 'a.html'), page('Trang A', '<h1>A</h1>'));
  fs.writeFileSync(path.join(dir, 'b.html'), page('Trang B', '<h1>B</h1>'));
  const steps = path.join(dir, 'steps.json');
  fs.writeFileSync(steps, JSON.stringify({ steps: [{ name: 'chuyen', js: "location.href = 'b.html'", wait: 1, check: 'document.title' }] }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, path.join(S2S, 'templates', 'qa-kit', 'run.mjs'), path.join(dir, 'a.html'), steps, path.join(dir, 'out')],
    { encoding: 'utf8', timeout: 90000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const s = JSON.parse(r.stdout).find(x => x.step === 'chuyen');
  assert.equal(s.check, 'Trang B');
  assert.ok(s.dims && typeof s.dims.sw === 'number', JSON.stringify(s));
});

test('run.mjs: script trong <head> tải chậm thì đợi trang tải xong rồi mới kiểm và đo, không sập', async t => {
  const http = require('node:http');
  const { spawn } = require('node:child_process');
  const server = http.createServer((req, res) => setTimeout(() => {
    res.writeHead(200, { 'content-type': 'text/javascript' });
    res.end('window.cham = 1;');
  }, 4000));
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  t.after(() => server.close());
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slow-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'a.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>A</title><script src="http://127.0.0.1:${server.address().port}/cham.js"></script></head><body><h1>A</h1></body></html>`);
  const steps = path.join(dir, 'steps.json');
  fs.writeFileSync(steps, JSON.stringify({ steps: [{ name: 'do', check: 'String(window.cham)' }] }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  // spawn bất đồng bộ: spawnSync chặn vòng sự kiện, server không trả lời được
  const r = await new Promise(res => {
    const p = spawn(process.execPath, [...flags, path.join(S2S, 'templates', 'qa-kit', 'run.mjs'), path.join(dir, 'a.html'), steps, path.join(dir, 'out')]);
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => res({ code, out, err }));
  });
  if (r.code === 4) return t.skip('không có trình duyệt');
  assert.equal(r.code, 0, r.err);
  const s = JSON.parse(r.out).find(x => x.step === 'do');
  assert.equal(s.check, '1');
  assert.ok(s.dims && typeof s.dims.sw === 'number', JSON.stringify(s));
});

// Chạy run.mjs trên một trang, trả { status, report, ms }
function runPage(t, html, steps, env = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'run-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'a.html'), html);
  fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ steps }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [...flags, path.join(S2S, 'templates', 'qa-kit', 'run.mjs'), path.join(dir, 'a.html'), path.join(dir, 'steps.json'), path.join(dir, 'out')],
    { encoding: 'utf8', timeout: 150000, env: { ...process.env, ...env } });
  let report = null;
  try { report = JSON.parse(r.stdout); } catch {}
  return { status: r.status, stderr: r.stderr, report, ms: Date.now() - t0 };
}

test('R27: không có CDP_PORT thì cổng do hệ điều hành chọn, kín hết 9300-9899 cũng chạy được', async t => {
  // Chiếm mọi cổng 9300-9899 bằng máy chủ trả 200: cổng ngẫu nhiên trong dải đó sẽ bị chốt chặn "đã có trình duyệt"
  const http = require('node:http');
  const servers = [];
  await Promise.all(Array.from({ length: 600 }, (_, k) => new Promise(res => {
    const sv = http.createServer((q, r) => { r.statusCode = 200; r.end('{}'); });
    sv.on('error', () => res());
    sv.listen(9300 + k, '127.0.0.1', () => { servers.push(sv); res(); });
  })));
  t.after(() => Promise.all(servers.map(sv => new Promise(res => sv.close(() => res())))));
  const env = { ...process.env }; delete env.CDP_PORT;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'run-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'a.html'), '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>CongOS</title></head><body><h1>A</h1></body></html>');
  fs.writeFileSync(path.join(dir, 'steps.json'), JSON.stringify({ steps: [{ name: 'view', check: 'document.title' }] }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  // spawnSync sẽ chặn vòng lặp sự kiện nên máy chủ giả không trả lời được: chạy bằng spawn bất đồng bộ
  const { spawn } = require('node:child_process');
  const r = await new Promise(res => {
    const c = spawn(process.execPath, [...flags, path.join(S2S, 'templates', 'qa-kit', 'run.mjs'), path.join(dir, 'a.html'), path.join(dir, 'steps.json'), path.join(dir, 'out')], { env });
    let out = '', err = '';
    c.stdout.on('data', d => out += d); c.stderr.on('data', d => err += d);
    c.on('close', code => res({ status: code, out, err }));
  });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.err);
  assert.equal(JSON.parse(r.out).find(s => s.step === 'view').check, 'CongOS');
});

test('review 1: bấm link # hay pushState không làm các bước sau đợi QA_LOAD_TIMEOUT, toast thoáng qua vẫn kiểm được', t => {
  // Chuyển trang trong cùng tài liệu có frameStartedLoading nhưng không có loadEventFired
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>A</title></head><body>
<a id="neo" href="#s2">Mục 2</a><button id="gui" type="button">Gửi</button><div id="toast" hidden>Đã gửi</div>
<section id="s2"><h2>Mục 2</h2></section>
<script>document.getElementById('gui').onclick = () => { toast.hidden = false; setTimeout(() => { toast.hidden = true; }, 3000); };</script></body></html>`;
  const r = runPage(t, html, [
    { name: 'neo', js: "document.getElementById('neo').click()" },
    { name: 'route', js: "history.pushState({}, '', '#dat')" },
    { name: 'gui', js: "document.getElementById('gui').click()", check: "document.getElementById('toast').hidden ? 'FAIL: không thấy toast' : 'PASS'" },
  ], { QA_LOAD_TIMEOUT: '15000' });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.report.find(x => x.step === 'gui').check, 'PASS');
  assert.ok(r.ms < 15000, `cả lần chạy mất ${r.ms} ms`);
});

test('review 3: clip vào phần tử chưa có thì báo lỗi ở bước đó, không sập cả lần chạy', t => {
  // Gặp ở pha "thấy đỏ" của evolve-site B3: bước chụp khung của tính năng chưa dựng
  const r = runPage(t, '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>A</title></head><body><h1>A</h1></body></html>', [
    { name: 'chup', check: "document.querySelector('[data-chua-co]') ? 'PASS' : 'FAIL: chưa có khung'", shot: 'khung', clip: '[data-chua-co]' },
  ]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  const s = r.report.find(x => x.step === 'chup');
  assert.equal(s.check, 'FAIL: chưa có khung');
  assert.ok(s.errors.some(e => e.includes('[data-chua-co]')), JSON.stringify(s.errors));
});

test('run.mjs: bước bấm tải xuống không lưu file vào thư mục Downloads của máy', t => {
  // Ví dụ nút "Xuất Excel" của một tính năng: mỗi lần chạy QA từng xả một file vào Downloads của người dùng
  const downloads = path.join(os.homedir(), 'Downloads');
  if (!fs.existsSync(downloads)) return t.skip('máy không có thư mục Downloads ở thư mục nhà');
  const name = `qa-kit-test-${process.pid}-${Date.now()}.txt`;
  t.after(() => fs.rmSync(path.join(downloads, name), { force: true }));
  const r = runPage(t, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>A</title></head><body><a id="tai" download="${name}" href="data:text/plain,xin%20chao">Tải</a></body></html>`, [
    { name: 'tai', js: "document.getElementById('tai').click()", wait: 1500 },
  ]);
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!fs.existsSync(path.join(downloads, name)), `file tải xuống rơi vào ${downloads}`);
});

test('qa_init.py: .gitignore của _qa bỏ qua thư mục chạy thử .tdd/, cả khi cài mới lẫn --update', t => {
  const dir = prototype(t);
  const init = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  const gi = path.join(dir, '_qa', '.gitignore');
  assert.match(fs.readFileSync(gi, 'utf8'), /^\.tdd\/$/m);
  fs.writeFileSync(gi, 'handover/\ncurrent/\n.kit-source\n');
  const upd = spawnSync(PYTHON, [QA_INIT, dir, '--update'], { cwd: dir, encoding: 'utf8' });
  assert.equal(upd.status, 0, upd.stdout + upd.stderr);
  assert.match(fs.readFileSync(gi, 'utf8'), /^\.tdd\/$/m);
});

test('qa_init.py chép color.js và probes.js vào _qa/, cả khi --update', t => {
  const dir = prototype(t);
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  for (const f of ['color.js', 'probes.js']) assert.ok(fs.existsSync(path.join(dir, '_qa', f)), f);
  fs.writeFileSync(path.join(dir, '_qa', 'color.js'), '// cũ\n');
  const up = spawnSync(PYTHON, [QA_INIT, dir, '--update'], { cwd: dir, encoding: 'utf8' });
  assert.match(up.stdout, /chép đè color\.js/);
});

test('nâng từ bộ kiểm cũ: tương phản có sẵn là nợ cũ (không chặn), lỗi thêm sau khi nhận mốc thì chặn', t => {
  const dir = prototype(t);
  const py = (...a) => spawnSync(PYTHON, a, { cwd: dir, encoding: 'utf8', timeout: 300000 });
  assert.equal(py(QA_INIT, dir).status, 0);
  const first = py(path.join('_qa', 'handover.py'), 'run');
  if (/Không tìm thấy Edge/.test(first.stdout + first.stderr)) return t.skip('không có trình duyệt');
  const runDir = () => /Thư mục chạy: (\S+)/.exec(first.stdout)[1];
  assert.equal(py(path.join('_qa', 'handover.py'), 'promote', runDir()).status, 0);
  // Giả mốc do bộ kiểm cũ ghi: bỏ contrast, intent khỏi mọi báo cáo trong last-green và current
  for (const root of ['last-green', 'current']) {
    for (const f of fs.readdirSync(path.join(dir, '_qa', root), { recursive: true }).filter(f => f.endsWith('report.json'))) {
      const p = path.join(dir, '_qa', root, f);
      const rep = JSON.parse(fs.readFileSync(p, 'utf8'));
      for (const s of rep) if (s.dims) { delete s.dims.contrast; delete s.dims.intent; }
      delete (rep.find(s => s.step === 'deep') || {}).deep;
      fs.writeFileSync(p, JSON.stringify(rep.filter(s => s.step !== 'deep')));
    }
  }
  const faint = n => `<p style="color:#BBBBBB">Chữ nhạt ${n}</p>`;
  const html = fs.readFileSync(path.join(dir, 'site', 'index.html'), 'utf8');
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), html.replace('</main>', faint(1) + '</main>'));
  const q1 = py(path.join('_qa', 'quick.py'), '--note', 'thêm chữ nhạt 1');
  assert.equal(q1.status, 0, q1.stdout);
  assert.match(q1.stdout, /Nợ cũ \(\d+\)/);
  const h = py(path.join('_qa', 'handover.py'), 'run');
  assert.equal(h.status, 0, h.stdout);
  assert.match(h.stdout, /Nợ cũ \(\d+\)[\s\S]*Chữ nhạt 1/);
  assert.match(h.stdout, /SẠCH, còn \d+ mục nợ cũ/);
  assert.equal(py(path.join('_qa', 'handover.py'), 'promote', /Thư mục chạy: (\S+)/.exec(h.stdout)[1]).status, 0);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), html.replace('</main>', faint(1) + faint(2) + '</main>'));
  const q2 = py(path.join('_qa', 'quick.py'), '--note', 'thêm chữ nhạt 2');
  assert.equal(q2.status, 1, q2.stdout);
  assert.match(q2.stdout, /tương phản mới [^\n]*Chữ nhạt 2/);
});

test('handover.py chạy lượt sâu ở bộ khói desktop; control hứa trạng thái mà bấm không đổi gì thì chặn', t => {
  const dir = prototype(t);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(false).replace('</main>', '<button type="button" aria-pressed="false">Theo dõi</button></main>'));
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  const h = spawnSync(PYTHON, [path.join('_qa', 'handover.py'), 'run'], { cwd: dir, encoding: 'utf8', timeout: 300000 });
  if (/Không tìm thấy Edge/.test(h.stdout + h.stderr)) return t.skip('không có trình duyệt');
  assert.equal(h.status, 1, h.stdout);
  assert.match(h.stdout, /tương tác \(chưa có mốc\) default\/smoke-index-1440 · deep: bấm mà không đổi gì button "theo dõi"/);
  assert.doesNotMatch(h.stdout, /smoke-index-(768|390) · deep/);
  assert.match(h.stdout, /^Lượt sâu: 1 bộ \(smoke-index-1440\)/m);
});

test('bộ đặt tên tay (không có tiền tố smoke-): lượt sâu vẫn chạy ở bộ khổ desktop đầu tiên của trang', t => {
  const dir = prototype(t);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(false).replace('</main>', '<button type="button" aria-pressed="false">Theo dõi</button></main>'));
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  const cfgFile = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  cfg.suites = [['trang-chu', 'index', 'smoke-index', 'desktop']];
  fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2));
  const h = spawnSync(PYTHON, [path.join('_qa', 'handover.py'), 'run'], { cwd: dir, encoding: 'utf8', timeout: 300000 });
  if (/Không tìm thấy Edge/.test(h.stdout + h.stderr)) return t.skip('không có trình duyệt');
  assert.match(h.stdout, /^Lượt sâu: 1 bộ \(trang-chu\)/m);
  assert.match(h.stdout, /tương tác \(chưa có mốc\) default\/trang-chu · deep: bấm mà không đổi gì button "theo dõi"/);
});

test('nâng dự án cũ: trang mới mang lỗi đã có ở trang khác là nợ cũ; lỗi console của lượt sâu khi mốc chưa có lượt sâu là nợ cũ; nợ cũ in gộp', t => {
  const dir = prototype(t);
  const py = (...a) => spawnSync(PYTHON, a, { cwd: dir, encoding: 'utf8', timeout: 300000 });
  const shared = '<p style="color:#BBBBBB">Chữ nhạt chung</p>';
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(false).replace('</main>',
    shared + `<button type="button" aria-pressed="false" onclick="console.error('lỗi khi bấm')">Theo dõi</button></main>`));
  assert.equal(py(QA_INIT, dir).status, 0);
  const first = py(path.join('_qa', 'handover.py'), 'run');
  if (/Không tìm thấy Edge/.test(first.stdout + first.stderr)) return t.skip('không có trình duyệt');
  assert.equal(py(path.join('_qa', 'handover.py'), 'promote', /Thư mục chạy: (\S+)/.exec(first.stdout)[1]).status, 0);
  // Giả mốc ghi khi bộ này chưa chạy lượt sâu (dự án nâng từ kit cũ): bỏ bước deep khỏi last-green và current
  for (const root of ['last-green', 'current']) {
    for (const f of fs.readdirSync(path.join(dir, '_qa', root), { recursive: true }).filter(f => f.endsWith('report.json'))) {
      const p = path.join(dir, '_qa', root, f);
      fs.writeFileSync(p, JSON.stringify(JSON.parse(fs.readFileSync(p, 'utf8')).filter(s => s.step !== 'deep')));
    }
  }
  // Trang mới (evolve-site) dùng chung chữ nhạt đã có trong mốc của trang chủ
  fs.writeFileSync(path.join(dir, 'site', 'gioi-thieu.html'), PAGE(false).replace('Đơn hàng</title>', 'Giới thiệu</title>').replace('</main>', shared + '</main>'));
  const cfgFile = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  cfg.pages.push('gioi-thieu');
  cfg.suites.push(['smoke-gioi-thieu-1440', 'gioi-thieu', 'smoke-gioi-thieu', 'desktop'], ['smoke-gioi-thieu-390', 'gioi-thieu', 'smoke-gioi-thieu', 'mobile']);
  fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2));
  fs.writeFileSync(path.join(dir, '_qa', 'steps-smoke-gioi-thieu.json'), JSON.stringify({ steps: [{ name: 'view', check: 'document.title' }] }));
  const h = py(path.join('_qa', 'handover.py'), 'run');
  assert.equal(h.status, 0, h.stdout);
  assert.match(h.stdout, /^Lượt sâu: 2 bộ \(smoke-index-1440, smoke-gioi-thieu-1440\)/m);
  assert.match(h.stdout, /Nợ cũ \(3\)/);
  // Chữ nhạt của trang mới gặp ở hai khổ: một dòng, ghi ×2
  assert.match(h.stdout, /tương phản \(1\):\r?\n +p "Chữ nhạt chung" [^\n]* ×2 · default\/smoke-gioi-thieu-1440 · view\r?\n/);
  assert.match(h.stdout, /tương tác \(1\):\r?\n +bấm mà không đổi gì button "theo dõi"/);
  assert.match(h.stdout, /console lượt sâu \(1\):\r?\n +ERR lỗi khi bấm · default\/smoke-index-1440 · deep\r?\n/);
  assert.match(h.stdout, /SẠCH, còn 3 mục nợ cũ/);
  const saved = JSON.parse(fs.readFileSync(path.join(dir, /Thư mục chạy: (\S+)/.exec(h.stdout)[1], 'handover.json'), 'utf8'));
  assert.equal(saved.debt.length, 4, 'handover.json giữ đủ danh sách nợ cũ chưa gộp');
});

const CAM_SEEDS = { bg: '#FBFAF9', surface: '#FFFFFF', ink: '#2E2A27', muted: '#6E6A66', line: '#E7E4E1', primary: 'oklch(0.58 0.19 38)', 'on-primary': '#FFFFFF',
  accent: 'oklch(0.58 0.19 38)', 'on-accent': '#FFFFFF', destructive: 'oklch(0.5 0.19 22)', 'on-destructive': '#FFFFFF' };
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
function withThemes(dir, extra = {}) {
  const t = readJson(path.join(S2S, 'templates', 'themes.json'));
  Object.assign(t.themes, extra);
  fs.mkdirSync(path.join(dir, 'site', 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'site', 'assets', 'themes.json'), JSON.stringify(t, null, 2));
}

test('qa_init.py: theme lấy từ themes.json, theme mặc định sáng đứng đầu không tham số', t => {
  const dir = prototype(t);
  withThemes(dir, { 'cam-dat': { mode: 'light', seeds: CAM_SEEDS } });
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  assert.deepEqual(readJson(path.join(dir, '_qa', 'qa.config.json')).themes, { light: '', 'cam-dat': '?theme=cam-dat' });
});

test('qa_init.py: trang _system có bước system-demo và system-pairs trong bộ khói', t => {
  const dir = prototype(t);
  fs.copyFileSync(path.join(S2S, 'templates', 'system.html'), path.join(dir, 'site', '_system.html'));
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  assert.deepEqual(readJson(path.join(dir, '_qa', 'steps-smoke-_system.json')).steps.map(s => s.name), ['view', 'system-demo', 'system-pairs']);
});

test('qa_init.py: trang nạp store.js có bộ dữ liệu rỗng và dữ liệu dài; ?data không bị coi là tham số thiếu mẫu', t => {
  const dir = prototype(t);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), PAGE(false).replace('</main>',
    `</main><script src="assets/data.js"></script><script src="assets/store.js"></script><script>new URLSearchParams(location.search).get('data')</script>`));
  const r = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.doesNotMatch(r.stdout, /CẢNH BÁO: index đọc tham số/);
  const cfg = readJson(path.join(dir, '_qa', 'qa.config.json'));
  assert.ok(cfg.suites.some(s => s[0] === 'du-lieu-rong-index' && s[3] === 'desktop'));
  assert.ok(cfg.suites.some(s => s[0] === 'du-lieu-dai-index' && s[3] === 'mobile'));
  // ?data= ghép sau qa-query của trang lúc chạy (run.mjs), không chép qa-query vào file bước
  for (const [k, v] of [['rong', 'data=empty'], ['dai', 'data=stress']]) {
    const st = readJson(path.join(dir, '_qa', `steps-du-lieu-${k}-index.json`));
    assert.equal(st.query_add, v);
    assert.equal(st.query, undefined);
  }
});

test('qa_init.py --update: gợi ý theme mới trong themes.json và trang _system chưa có trong cấu hình', t => {
  const dir = prototype(t);
  withThemes(dir);
  assert.equal(spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' }).status, 0);
  withThemes(dir, { 'cam-dat': { mode: 'light', seeds: CAM_SEEDS } });
  fs.copyFileSync(path.join(S2S, 'templates', 'system.html'), path.join(dir, 'site', '_system.html'));
  const up = spawnSync(PYTHON, [QA_INIT, dir, '--update'], { cwd: dir, encoding: 'utf8' });
  assert.match(up.stdout, /themes\.json có theme chưa khai trong qa\.config\.json: cam-dat/);
  assert.match(up.stdout, /"cam-dat": "\?theme=cam-dat"/);
  assert.match(up.stdout, /chưa có trang _system/);
});

test('store.js: ?data=empty làm rỗng danh sách, ?data=stress sinh dữ liệu dài; không đụng localStorage', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'store-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.copyFileSync(path.join(S2S, 'templates', 'store.js'), path.join(dir, 'store.js'));
  fs.writeFileSync(path.join(dir, 'data.js'), "window.SEED = { orders: [{ id: 'DH1', ten: 'Trần Minh Khoa', tong: 185000 }, { id: 'DH2', ten: 'Lê Thu Hà', tong: 92000 }], settings: { vat: 8 } };");
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>S</title><script src="data.js"></script><script src="store.js"></script></head><body></body></html>');
  const check = `(() => { const o = store.get('orders'); store.set('orders', []); return JSON.stringify({ n: o.length, first: o[0] || null,
    ids: new Set(o.map(x => x.id)).size, vat: store.get('settings').vat, saved: localStorage.getItem('proto:v1') }); })()`;
  const go = query => {
    const sf = path.join(dir, 'steps.json');
    fs.writeFileSync(sf, JSON.stringify({ query, steps: [{ name: 's', check }] }));
    const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
    const r = spawnSync(process.execPath, [...flags, path.join(S2S, 'templates', 'qa-kit', 'run.mjs'), path.join(dir, 'index.html'), sf, path.join(dir, 'out')], { encoding: 'utf8', timeout: 90000 });
    return r.status === 4 ? null : JSON.parse(JSON.parse(r.stdout).find(s => s.step === 's').check);
  };
  const empty = go('?data=empty');
  if (!empty) return t.skip('không có trình duyệt');
  assert.deepEqual([empty.n, empty.vat, empty.saved], [0, 8, null]);
  const stress = go('?data=stress');
  assert.ok(stress.n >= 40);
  assert.equal(stress.ids, stress.n, 'mã trùng');
  assert.match(stress.first.ten, /Miền Nam$/);
  assert.equal(stress.first.tong, 987654321);
  assert.equal(stress.saved, null);
});
