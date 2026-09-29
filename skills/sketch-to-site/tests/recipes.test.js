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
