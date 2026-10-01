// Kiểm khuôn trang design system sống templates/system.html trên Edge/Chrome headless (qua run.mjs) và bằng preflight.py.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const S2S = path.resolve(__dirname, '..');
const T = f => path.join(S2S, 'templates', f);
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

// Dựng site đúng như B2 hướng dẫn: _system.html + color.js, theme.js, tokens.css, themes.json → themes.css
function site(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'system-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const assets = path.join(dir, 'site', 'assets');
  fs.mkdirSync(assets, { recursive: true });
  fs.copyFileSync(T('system.html'), path.join(dir, 'site', '_system.html'));
  for (const f of ['color.js', 'theme.js', 'tokens.css', 'themes.json']) fs.copyFileSync(T(f), path.join(assets, f));
  const g = spawnSync(process.execPath, [path.join(S2S, 'scripts', 'themes.mjs'), dir], { encoding: 'utf8' });
  assert.equal(g.status, 0, g.stdout + g.stderr);
  return dir;
}
function run(dir, steps, query = '') {
  const sf = path.join(dir, 'steps.json');
  fs.writeFileSync(sf, JSON.stringify({ query, steps }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, T(path.join('qa-kit', 'run.mjs')), path.join(dir, 'site', '_system.html'), sf, path.join(dir, 'out')],
    { encoding: 'utf8', timeout: 90000 });
  if (r.status === 4) return null;
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
const STATE = `JSON.stringify({ pairs: document.querySelectorAll('[data-pair]').length, khong: document.querySelectorAll('[data-verdict="khong"]').length,
  missing: document.querySelector('[data-sys-missing]').textContent.trim(), themes: document.querySelectorAll('[data-set]').length,
  demo: !!document.querySelector('[data-system-demo]'), ratio: +document.documentElement.dataset.scaleRatio, theme: document.documentElement.dataset.theme || null })`;

for (const query of ['', '?theme=dark']) {
  test(`_system.html từ khuôn ${query || '(theme mặc định)'}: đủ 26 cặp, không cặp nào dưới ngưỡng, không lỗi tương phản hay ý định trên trang`, t => {
    const r = run(site(t), [{ name: 's', check: STATE }], query);
    if (!r) return t.skip('không có trình duyệt');
    assert.deepEqual(r.flatMap(s => s.errors), []);
    const v = JSON.parse(r.find(s => s.step === 's').check);
    assert.deepEqual({ pairs: v.pairs, khong: v.khong, missing: v.missing, themes: v.themes, demo: v.demo },
      { pairs: 26, khong: 0, missing: '', themes: 2, demo: true });
    assert.ok(v.ratio >= 2.5, `chữ lớn nhất chỉ gấp ${v.ratio} lần chữ thân`);
    const d = r.find(s => s.step === 's').dims;
    assert.deepEqual([d.contrast, d.intent, d.cut], [[], [], []]);
  });
}

test('_system.html: bấm nút theme thì đổi theme và vẽ lại bảng', t => {
  const r = run(site(t), [{ name: 'dark', js: "document.querySelector('[data-set=\"dark\"]').click()", wait: 200, check: STATE }]);
  if (!r) return t.skip('không có trình duyệt');
  const v = JSON.parse(r.find(s => s.step === 'dark').check);
  assert.equal(v.theme, 'dark');
  assert.equal(v.khong, 0);
});

test('preflight: _system.html từ khuôn không lỗi, không P19, P20', t => {
  const dir = site(t);
  const r = spawnSync(PYTHON, [path.join(S2S, 'scripts', 'preflight.py'), path.join(dir, 'site')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
  assert.doesNotMatch(r.stdout, /P19|P20|P21/, r.stdout);
});
