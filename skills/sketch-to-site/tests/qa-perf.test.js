// Kiểm phần hiệu năng của bộ kiểm (plugin 1.7.3, bài học 10/10/2026 trên dự án 63 trang, 2 theme): ghi ảnh ra thư mục tạm rồi mới chuyển
// vào _qa/handover/, bỏ ảnh của lần chạy cũ, chạy tăng dần theo last-green, theme theo trang, số luồng, canh RAM, hạ ưu tiên, ước lượng
// và checklist (--dry), loại thư mục ảnh khỏi watcher của VS Code (qa_init.py), watchdog rg (chỉ đếm trong test).
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
require('./shared-browser')();

const S2S = path.resolve(__dirname, '..');
const QA_INIT = path.join(S2S, 'templates', 'qa-kit', 'qa_init.py');
const QA_CHECK = path.join(S2S, 'scripts', 'qa-check.py');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const NO_BROWSER = /Không tìm thấy Edge/;

function tmp(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 }));
  return dir;
}
const page = (title, body = '') => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body><h1>${title}</h1>${body}</body></html>`;
const py = (args, opts = {}) => spawnSync(PYTHON, args, { encoding: 'utf8', timeout: 300000, ...opts, env: { ...env, ...(opts.env || {}) } });

// Dự án nhỏ: site/a.html, site/b.html, bộ kiểm cài sẵn. Mọi lần chạy dùng thư mục tạm riêng (QA_TMP) để đếm được qa-run-*
function project(t, pages = ['a', 'b']) {
  const dir = tmp(t, 'qaperf-');
  fs.mkdirSync(path.join(dir, 'site'));
  for (const p of pages) fs.writeFileSync(path.join(dir, 'site', `${p}.html`), page(`Trang ${p}`));
  const r = py([QA_INIT, dir]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const qaTmp = path.join(dir, '.tmp');
  fs.mkdirSync(qaTmp);
  const run = (args = [], extra = {}) => py([path.join('_qa', 'handover.py'), 'run', ...args], { cwd: dir, env: { QA_TMP: qaTmp, ...extra } });
  const lastRun = () => fs.readdirSync(path.join(dir, '_qa', 'handover')).filter(d => /^\d{8}-\d{4}$/.test(d)).sort().pop();
  const promote = () => {
    const r = py([path.join('_qa', 'handover.py'), 'promote', path.join('_qa', 'handover', lastRun())], { cwd: dir });
    assert.equal(r.status, 0, r.stdout + r.stderr);
  };
  return { dir, qaTmp, run, lastRun, promote };
}
const files = (root) => { const out = []; const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else out.push(path.relative(root, p).replace(/\\/g, '/')); } }; walk(root); return out.sort(); };

// ---- qa_init.py: .vscode/settings.json ----
test('qa_init.py gộp thư mục ảnh của bộ kiểm vào files.watcherExclude và search.exclude của workspace; lần hai không đổi gì; JSONC thì không ghi', t => {
  const ws = tmp(t, 'qavs-');
  fs.mkdirSync(path.join(ws, '.git'));
  fs.mkdirSync(path.join(ws, '.vscode'));
  fs.mkdirSync(path.join(ws, 'docs', 'p', 'site'), { recursive: true });
  fs.writeFileSync(path.join(ws, '.vscode', 'settings.json'), '{"editor.fontSize": 14, "files.watcherExclude": {"**/node_modules/**": true}}');
  fs.writeFileSync(path.join(ws, 'docs', 'p', 'site', 'a.html'), page('a'));
  const proto = path.join(ws, 'docs', 'p');
  const r = py([QA_INIT, proto]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^đã thêm 16 mẫu vào .*\.vscode\/settings\.json: mở lại cửa sổ VS Code/m);
  const cfg = JSON.parse(fs.readFileSync(path.join(ws, '.vscode', 'settings.json'), 'utf8'));
  assert.equal(cfg['editor.fontSize'], 14);
  assert.equal(cfg['files.watcherExclude']['**/node_modules/**'], true);
  for (const k of ['files.watcherExclude', 'search.exclude']) for (const p of ['**/_qa/handover/**', '**/_qa/.thumbs/**', '**/_shots/**']) assert.equal(cfg[k][p], true, `${k} thiếu ${p}`);
  // Không tạo .vscode trong thư mục prototype: workspace là thư mục có .git
  assert.ok(!fs.existsSync(path.join(proto, '.vscode')));
  const again = py([QA_INIT, proto, '--update']);
  assert.doesNotMatch(again.stdout, /đã thêm/);
  fs.writeFileSync(path.join(ws, '.vscode', 'settings.json'), '{\n  // chú thích\n  "a": 1\n}');
  const jsonc = py([QA_INIT, proto, '--update']);
  assert.match(jsonc.stdout, /có chú thích hay lỗi cú pháp, không tự sửa/);
  assert.match(jsonc.stdout, /"\*\*\/_qa\/handover\/\*\*": true/);
  assert.match(fs.readFileSync(path.join(ws, '.vscode', 'settings.json'), 'utf8'), /chú thích/);
  // qa-check.py in dòng đó và mẫu cần dán
  const qc = py([QA_CHECK, proto, '--dry']);
  assert.match(qc.stdout, /^ {2}.*có chú thích hay lỗi cú pháp/m);
  assert.match(qc.stdout, /^ {2}\s+"\*\*\/_qa\/handover\/\*\*": true/m);
  // .gitignore của bộ kiểm có qa-check.log
  assert.match(fs.readFileSync(path.join(proto, '_qa', '.gitignore'), 'utf8'), /^qa-check\.log$/m);
});

// ---- handover.py run: thư mục tạm, dọn, tăng dần ----
test('handover.py run ghi ra thư mục tạm rồi chuyển vào _qa/handover/ khi xong; qa-run-* dở quá 2 giờ bị dọn, mới thì giữ; lần chạy cũ bị bỏ ảnh, lần dở bị xoá', t => {
  const P = project(t);
  const old3h = new Date(Date.now() - 3 * 3600e3);
  for (const [n, stale] of [['qa-run-cu', true], ['qa-run-moi', false], ['qa-run-khong-manifest', true]]) {
    const d = path.join(P.qaTmp, n);
    fs.mkdirSync(path.join(d, 'default'), { recursive: true });
    if (n !== 'qa-run-khong-manifest') fs.writeFileSync(path.join(d, 'manifest.json'), '{}');
    fs.writeFileSync(path.join(d, 'default', 'x.json'), '{}');
    if (stale) for (const p of [d, path.join(d, 'default'), path.join(d, 'default', 'x.json'), path.join(d, 'manifest.json')]) { try { fs.utimesSync(p, old3h, old3h); } catch {} }
  }
  // Ba lần chạy cũ hoàn chỉnh (handover.json) và một lần dở
  const H = path.join(P.dir, '_qa', 'handover');
  for (const d of ['20260101-0000', '20260101-0001', '20260101-0002', '20260101-0003']) {
    const s = path.join(H, d, 'default', 'smoke-a-1440');
    fs.mkdirSync(s, { recursive: true });
    fs.writeFileSync(path.join(s, 'report.json'), '[]');
    fs.writeFileSync(path.join(s, 'a.jpg'), Buffer.alloc(2048));
    fs.writeFileSync(path.join(s, 'slices.json'), '{}');
    fs.writeFileSync(path.join(H, d, 'manifest.json'), '{}');
    if (d !== '20260101-0000') fs.writeFileSync(path.join(H, d, 'handover.json'), '{}');
  }
  const r = P.run();
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Dọn: 1 lần chạy cũ bỏ ảnh, 0 MB · 1 lần chạy dở xoá$/m);
  assert.match(r.stdout, /^Ước lượng: 6 bộ chạy · 0 lấy lại từ last-green · ~\d+ phút với \d+ luồng · ~6 ảnh$/m);
  assert.match(r.stdout, /^Thư mục chạy: _qa[\\/]handover[\\/]\d{8}-\d{4}$/m);
  // Thư mục tạm: lần chạy này không còn, lần dở cũ bị dọn, lần dở mới và thư mục không phải của bộ kiểm giữ
  assert.deepEqual(fs.readdirSync(P.qaTmp).sort(), ['qa-run-khong-manifest', 'qa-run-moi']);
  assert.ok(!fs.existsSync(path.join(H, '20260101-0000')), 'lần chạy dở phải bị xoá');
  assert.deepEqual(files(path.join(H, '20260101-0001')), ['default/smoke-a-1440/report.json', 'handover.json', 'manifest.json']);
  assert.ok(fs.existsSync(path.join(H, '20260101-0003', 'default', 'smoke-a-1440', 'a.jpg')));
  assert.ok(fs.existsSync(path.join(H, '20260101-0002', 'default', 'smoke-a-1440', 'a.jpg')));
  const run = path.join(H, P.lastRun());
  assert.ok(fs.existsSync(path.join(run, 'default', 'smoke-a-1440', 'a.jpg')));
  assert.ok(fs.existsSync(path.join(run, 'handover.json')));
  const hj = JSON.parse(fs.readFileSync(path.join(run, 'handover.json'), 'utf8'));
  assert.equal(hj.timing.runs, 6);
  assert.ok(hj.timing.seconds > 0);
});

test('handover.py run có last-green thì chỉ chạy bộ của trang đổi, lấy lại bộ khác từ mốc không ảnh; --full, đổi qa.config.json hay mã bộ kiểm thì chạy hết', t => {
  const P = project(t);
  const first = P.run();
  if (NO_BROWSER.test(first.stdout + first.stderr)) return t.skip('không có trình duyệt');
  assert.equal(first.status, 0, first.stdout + first.stderr);
  assert.doesNotMatch(first.stdout, /Lấy lại từ last-green/);
  P.promote();
  // Đổi thân trang, giữ <title>: bộ khói check document.title, đổi title là "check đổi" không gán được (đúng, nhưng không phải điều test này xem)
  fs.writeFileSync(path.join(P.dir, 'site', 'b.html'), page('Trang b', '<p>Thêm một đoạn.</p>'));
  const r = P.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ước lượng: 3 bộ chạy · 3 lấy lại từ last-green/m);
  assert.match(r.stdout, /^Lấy lại từ last-green \(không đổi\): 3 bộ · bộ lấy lại không có ảnh mới$/m);
  assert.match(r.stdout, /^default: 6 bộ · 6 bước/m);
  assert.match(r.stdout, /^Bộ có trong last-green mà lần này không chạy: không$/m);
  assert.match(r.stdout, /^Kết luận: SẠCH/m);
  const run = path.join(P.dir, '_qa', 'handover', P.lastRun());
  assert.deepEqual(files(run).filter(f => f.startsWith('default/smoke-a')), ['default/smoke-a-1440/report.json', 'default/smoke-a-390/report.json', 'default/smoke-a-768/report.json']);
  assert.ok(fs.existsSync(path.join(run, 'default', 'smoke-b-390', 'b.jpg')));
  const hj = JSON.parse(fs.readFileSync(path.join(run, 'handover.json'), 'utf8'));
  assert.deepEqual(hj.reused, ['default/smoke-a-1440', 'default/smoke-a-390', 'default/smoke-a-768']);
  assert.equal(hj.timing.runs, 3);
  // Ước lượng lần sau lấy số đo của lần này
  // qa-check.py chỉ liệt kê ảnh của bộ đã chạy
  P.promote();
  fs.writeFileSync(path.join(P.dir, 'site', 'b.html'), page('Trang b', '<p>Thêm hai đoạn.</p>'));
  const qc = py([QA_CHECK, P.dir], { env: { QA_TMP: P.qaTmp } });
  assert.equal(qc.status, 0, qc.stdout + qc.stderr);
  assert.match(qc.stdout, /^Lấy lại từ last-green \(không đổi\): 3 bộ/m);
  assert.match(qc.stdout, /^ {2}default\/smoke-b-1440: b\.jpg/m);
  assert.doesNotMatch(qc.stdout, /smoke-a-1440:/);
  // --full
  const full = P.run(['--full']);
  assert.match(full.stdout, /^Lấy lại từ last-green \(không đổi\): 0 bộ \(--full\)$/m);
  // Đổi cấu hình: mọi bộ chạy (qa.config.json nằm trong manifest)
  P.promote();
  const cfgPath = path.join(P.dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  cfg.noisy = [['smoke-a-1440', 'khong-co']];
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 1));
  const c = P.run();
  assert.match(c.stdout, /^Ước lượng: 6 bộ chạy · 0 lấy lại/m, c.stdout);
  // Đổi mã bộ kiểm chạy trong trang: mọi bộ chạy
  P.promote();
  fs.appendFileSync(path.join(P.dir, '_qa', 'probes.js'), '\n// đổi\n');
  const k = P.run();
  assert.match(k.stdout, /^Ước lượng: 6 bộ chạy · 0 lấy lại/m, k.stdout);
  // Không đổi gì: mọi bộ lấy lại, vẫn in đủ dòng số, không mở ảnh nào
  P.promote();
  const none = P.run();
  assert.equal(none.status, 0, none.stdout + none.stderr);
  assert.match(none.stdout, /^Ước lượng: 0 bộ chạy · 6 lấy lại/m);
  assert.match(none.stdout, /^default: 6 bộ · 6 bước/m);
});

test('page_themes: trang khai theme riêng chỉ chạy ở theme đó, không thành bộ mất; quick.py cũng theo', t => {
  const P = project(t);
  const cfgPath = path.join(P.dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  cfg.themes = { light: '', dark: '?theme=dark' };
  cfg.page_themes = { b: ['light'], 'khong-co': ['dark', 'la'] };
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 1));
  const r = P.run();
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ước lượng: 9 bộ chạy/m);
  assert.match(r.stdout, /^light: 6 bộ/m);
  assert.match(r.stdout, /^dark: 3 bộ/m);
  const run = path.join(P.dir, '_qa', 'handover', P.lastRun());
  assert.deepEqual(fs.readdirSync(path.join(run, 'dark')).sort(), ['smoke-a-1440', 'smoke-a-390', 'smoke-a-768']);
  P.promote();
  const again = P.run();
  assert.match(again.stdout, /^Bộ có trong last-green mà lần này không chạy: không$/m);
  assert.match(again.stdout, /^Ước lượng: 0 bộ chạy · 9 lấy lại/m);
  // Theme khai mà không có trong "themes": --update cảnh báo
  const u = py([QA_INIT, P.dir, '--update']);
  assert.match(u.stdout, /CẢNH BÁO page_themes "khong-co": theme la không có trong "themes"/);
  // quick.py --all ở hai theme: không chạy dark/b
  const q = py([path.join('_qa', 'quick.py'), '--note', 'x', '--all', '--themes', 'light,dark'], { cwd: P.dir });
  assert.equal(q.status, 0, q.stdout + q.stderr);
  assert.match(q.stdout, /quick · 0 file đổi · 9 bộ \(light \+ dark\)/);
  assert.deepEqual(fs.readdirSync(path.join(P.dir, '_qa', '.quick-run', 'dark')).sort(), ['smoke-a-1440', 'smoke-a-390', 'smoke-a-768']);
});

// ---- luồng, RAM, ưu tiên ----
test('QA_WORKERS=1 và "workers": 1 thì các bộ chạy nối tiếp', t => {
  const P = project(t, ['a']);
  const sf = path.join(P.dir, '_qa', 'steps-smoke-a.json');
  fs.writeFileSync(sf, JSON.stringify({ steps: [{ name: 'dau', check: 'Date.now()' }, { name: 'cuoi', wait: 1500, check: 'Date.now()' }] }));
  const spans = (out) => {
    const dirs = ['smoke-a-1440', 'smoke-a-390'].map(n => JSON.parse(fs.readFileSync(path.join(out, n, 'report.json'), 'utf8')));
    return dirs.map(rep => ['dau', 'cuoi'].map(s => rep.find(x => x.step === s).check));
  };
  const serial = ([a, b]) => a[1] <= b[0] || b[1] <= a[0];
  const r = py([path.join('_qa', 'run_all.py'), path.join('_qa', '.recheck')], { cwd: P.dir, env: { QA_WORKERS: '1' } });
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(serial(spans(path.join(P.dir, '_qa', '.recheck'))), 'QA_WORKERS=1 mà hai bộ chạy chồng');
  const cfgPath = path.join(P.dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  cfg.workers = 1;
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 1));
  const r2 = py([path.join('_qa', 'run_all.py'), path.join('_qa', '.recheck2')], { cwd: P.dir });
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.ok(serial(spans(path.join(P.dir, '_qa', '.recheck2'))), '"workers": 1 mà hai bộ chạy chồng');
  // Mặc định: song song (bộ khói 1440 và 390 chồng nhau)
  const r3 = py([path.join('_qa', 'run_all.py'), path.join('_qa', '.recheck3')], { cwd: P.dir, env: { QA_WORKERS: '4' } });
  assert.equal(r3.status, 0, r3.stdout + r3.stderr);
  assert.ok(!serial(spans(path.join(P.dir, '_qa', '.recheck3'))), 'QA_WORKERS=4 mà hai bộ chạy nối tiếp');
});

test('RAM trống dưới ngưỡng quá QA_MEM_WAIT giây: dừng với một dòng "máy thiếu bộ nhớ, k bộ chưa chạy", không có bộ lỗi chạy rỗng; free_mem_mb đo được', t => {
  const P = project(t, ['a']);
  const r = P.run([], { QA_MIN_FREE_MB: '99999999', QA_MEM_WAIT: '1' });
  if (NO_BROWSER.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^Tạm nghỉ: RAM trống \d+ MB dưới ngưỡng 99999999 MB/m);
  assert.equal((r.stdout.match(/máy thiếu bộ nhớ, 3 bộ chưa chạy/g) || []).length, 1, r.stdout);
  assert.doesNotMatch(r.stdout, /LỖI CHẠY/);
  const m = py(['-c', 'import sys; sys.path.insert(0, "_qa"); import run_all; print(run_all.free_mem_mb())'], { cwd: P.dir });
  if (process.platform === 'win32' || process.platform === 'linux') assert.match(m.stdout, /^\(\d+, \d+\)/, m.stdout + m.stderr);
});

test('tiến trình Python của bộ kiểm chạy ở ưu tiên thấp (Windows: BelowNormal; POSIX: nice 10); QA_PRIORITY=normal giữ mức thường', t => {
  const P = project(t, ['a']);
  const code = process.platform === 'win32'
    ? 'import sys, ctypes; sys.path.insert(0, "_qa"); import run_all; k = ctypes.windll.kernel32; k.GetCurrentProcess.restype = ctypes.c_void_p; print(k.GetPriorityClass(ctypes.c_void_p(k.GetCurrentProcess())))'
    : 'import sys, os; sys.path.insert(0, "_qa"); import run_all; print(os.nice(0))';
  const low = py(['-c', code], { cwd: P.dir });
  assert.equal(low.status, 0, low.stderr);
  if (process.platform === 'win32') assert.equal(low.stdout.trim(), '16384'); else assert.ok(+low.stdout.trim() >= 10, low.stdout);
  const normal = py(['-c', code], { cwd: P.dir, env: { QA_PRIORITY: 'normal' } });
  if (process.platform === 'win32') assert.equal(normal.stdout.trim(), '32', 'QA_PRIORITY=normal phải giữ Normal (32)');
});

// ---- --dry, watchdog ----
test('handover.py run --dry và qa-check.py --dry: ước lượng và checklist, không mở trình duyệt; watchdog rg chế độ dry chỉ đếm', t => {
  const P = project(t);
  const r = P.run(['--dry'], { QA_CDP: 'http://127.0.0.1:1' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Ước lượng: 6 bộ chạy · 0 lấy lại từ last-green · ~\d+ phút với \d+ luồng · ~6 ảnh$/m);
  assert.match(r.stdout, /^Checklist trước khi chạy:$/m);
  assert.match(r.stdout, /^ {2}hồ sơ trình duyệt sót \(cdp-\* trong thư mục tạm\): \d+/m);
  assert.match(r.stdout, /^ {2}lần chạy dở trong thư mục tạm: 0$/m);
  assert.match(r.stdout, /^ {2}từ 8 phút: chạy nền ngay từ đầu/m);
  assert.ok(!fs.existsSync(path.join(P.dir, '_qa', 'handover')), '--dry không được tạo thư mục chạy');
  const qc = py([QA_CHECK, P.dir, '--dry'], { env: { QA_CDP: 'http://127.0.0.1:1' } });
  assert.equal(qc.status, 0, qc.stdout + qc.stderr);
  assert.match(qc.stdout, /^Bộ kiểm: đã có, cập nhật script/m);
  assert.match(qc.stdout, /^Ước lượng: 6 bộ chạy/m);
  assert.match(qc.stdout, /^ {2}từ 8 phút: chạy nền/m);
  assert.doesNotMatch(qc.stdout, /Thư mục chạy/);
  // Ước lượng dài: từ 8 phút thì nhắc chạy nền (ép số đo của lần trước: 1 lượt = 1 giờ)
  const H = path.join(P.dir, '_qa', 'handover', '20260101-0001');
  fs.mkdirSync(H, { recursive: true });
  fs.writeFileSync(path.join(H, 'handover.json'), JSON.stringify({ timing: { seconds: 3600, runs: 1, workers: 1 } }));
  const long = P.run(['--dry'], { QA_CDP: 'http://127.0.0.1:1', QA_WORKERS: '1' });
  assert.match(long.stdout, /^Ước lượng: 6 bộ chạy · 0 lấy lại từ last-green · ~360 phút với 1 luồng · ~6 ảnh · quá 8 phút: chạy nền ngay từ đầu/m);
  fs.rmSync(path.join(P.dir, '_qa', 'handover'), { recursive: true, force: true });
  if (process.platform !== 'win32') return;
  const w = P.run([], { QA_RG_WATCHDOG: 'dry' });
  if (NO_BROWSER.test(w.stdout + w.stderr)) return t.skip('không có trình duyệt');
  assert.equal(w.status, 0, w.stdout + w.stderr);
  assert.match(w.stdout, /^Watchdog rg: \d+ sẽ dừng \(dry\)$/m);
});
