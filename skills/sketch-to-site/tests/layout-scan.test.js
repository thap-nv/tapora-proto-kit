// Kiểm phần quét bố cục của preflight.py (P22–P26, chỉ số của sketch-to-map; rút từ measure-kit/flowscan.js, đo trên một prototype thật 28 trang:
// bắt đủ 17 lối tắt hành động đá đi không đường về và 1 chỗ tự chuyển trang). Không cần trình duyệt.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PREFLIGHT = path.resolve(__dirname, '..', 'scripts', 'preflight.py');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const page = body => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T</title></head>
<body><nav><a href="index.html">Hôm nay</a> <a href="lich.html">Lịch</a></nav><main>${body}</main></body></html>`;

// Prototype mẫu: hồ sơ có lối tắt "Đổi buổi" sang lịch; lịch không có đường về
function site(t, pages) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const [f, body] of Object.entries(pages)) fs.writeFileSync(path.join(dir, f), page(body));
  const r = spawnSync(PYTHON, [PREFLIGHT, dir, '--kind', 'app'], { encoding: 'utf8', env });
  return { r, codes: (r.stdout.match(/ P2[2-6] /g) || []).map(s => s.trim()) };
}
const LICH = '<h1>Lịch</h1><p>Lưới buổi học tuần này.</p>';

test('P22: lối tắt hành động sang trang không có đường về thì LỖI; sửa thành ngăn trượt trên trang đó thì hết', t => {
  const bad = site(t, { 'ho-so.html': '<h1>Hồ sơ</h1><a href="lich.html?id=7">Đổi buổi</a>', 'lich.html': LICH, 'index.html': '<h1>Hôm nay</h1>' });
  assert.equal(bad.r.status, 1, bad.r.stdout);
  assert.deepEqual(bad.codes, ['P22']);
  assert.match(bad.r.stdout, /«Đổi buổi» đá sang lich\.html/);
  const fixed = site(t, { 'ho-so.html': '<h1>Hồ sơ</h1><button type="button" data-mo="ngan-truot" aria-controls="doi-buoi">Đổi buổi</button><aside id="doi-buoi" hidden>Chọn buổi mới</aside>',
    'lich.html': LICH, 'index.html': '<h1>Hôm nay</h1>' });
  assert.deepEqual(fixed.codes, []);
  assert.equal(fixed.r.status, 0, fixed.r.stdout);
});

test('P22 im khi: trang đích có Quay lại, liên kết mang ?from=, nằm trong menu, chữ không phải hành động', t => {
  const r = site(t, {
    'ho-so.html': '<h1>Hồ sơ</h1><a href="lich.html?from=ho-so">Đổi buổi</a> <a href="thu.html">Thu tiền</a> <a href="lich.html">Xem lịch</a>',
    'lich.html': LICH, 'thu.html': '<a href="ho-so.html" onclick="history.back();return false">Quay lại</a><h1>Thu tiền</h1>', 'index.html': '<h1>Hôm nay</h1>',
  });
  assert.deepEqual(r.codes, []);
});

test('P23: tự chuyển trang sau khi làm xong thì LỖI; đổi tham số trên chính trang hay ghi nav-ok thì im', t => {
  const r = site(t, { 'khach.html': `<h1>Khách</h1><button id="b">Chuyển thành học viên</button><script>
document.getElementById('b').onclick = () => { location.href = 'ho-so.html?moi=1'; };
function loc() { location.href = '?trang=2'; }
function vai(v) { location.assign('hom-nay-' + v + '.html'); // nav-ok: chọn vai ở trang lối vào
}</script>`, 'ho-so.html': '<h1>Hồ sơ</h1>', 'index.html': '<h1>Hôm nay</h1>', 'lich.html': LICH });
  assert.deepEqual(r.codes, ['P23']);
  assert.match(r.r.stdout, /khach\.html:\d+ +P23/);
});

test('P24 chỉ cảnh báo (trang có thể ẩn mã lúc chạy); P25 hai nhãn cho một việc; P26 ô số điện thoại chỉ nhận 0…', t => {
  const r = site(t, {
    'ho-so.html': '<h1>Hồ sơ</h1><p>Theo BR-HV-03, mỗi lần xem một con.</p><button>Đổi buổi học</button><input type="tel" maxlength="10">',
    'lich.html': '<h1>Lịch</h1><button>Dời buổi học</button>', 'index.html': '<h1>Hôm nay</h1>',
  });
  assert.equal(r.r.status, 0, r.r.stdout);
  assert.deepEqual(r.codes.sort(), ['P24', 'P25', 'P26']);
  assert.match(r.r.stdout, /P25 +CẢNH BÁO .*«Đổi buổi học».*«Dời buổi học»/);
});

test('_system.html (trang mẫu component) không bị quét lối tắt', t => {
  const r = site(t, { '_system.html': '<h1>Hệ thống</h1><a href="lich.html">Thêm học viên</a>', 'lich.html': LICH, 'index.html': '<h1>Hôm nay</h1>' });
  assert.deepEqual(r.codes, []);
});
