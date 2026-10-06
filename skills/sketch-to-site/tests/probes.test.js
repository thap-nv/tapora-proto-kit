// Kiểm phép đo trong trang (qa-kit/probes.js) qua run.mjs thật trên Edge/Chrome headless. Không có trình duyệt thì bỏ qua.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const RUN = path.resolve(__dirname, '..', 'templates', 'qa-kit', 'run.mjs');
const HEAD = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T</title>';

// Chạy một trang qua run.mjs; trả báo cáo, hoặc null khi máy không có trình duyệt
function page(t, body, steps, { query = '', env = {}, errors = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'probes-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'index.html'), HEAD + body);
  const sf = path.join(dir, 'steps.json');
  fs.writeFileSync(sf, JSON.stringify({ query, steps: steps || [{ name: 'view', check: 'document.title' }] }));
  const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
  const r = spawnSync(process.execPath, [...flags, RUN, path.join(dir, 'index.html'), sf, path.join(dir, 'out')],
    { encoding: 'utf8', timeout: 180000, env: { ...process.env, ...env } });
  if (r.status === 4) return null;
  assert.equal(r.status, 0, r.stderr);
  const rep = JSON.parse(r.stdout);
  if (!errors) assert.deepEqual(rep.flatMap(s => s.errors), [], 'lỗi console hoặc lỗi đo');
  return rep;
}
const dims = (rep, step = 'view') => rep.find(s => s.step === step).dims;

test('tương phản trên nền thật: chip trắng trong suốt phủ khối cam bị bắt, màu oklch không báo giả, placeholder được đo', t => {
  const r = page(t, `<style>
    :root{--canvas:oklch(0.985 0.002 60);--muted:oklch(0.5 0.01 60);--brand:oklch(0.58 0.19 38)}
    body{margin:0;background:var(--canvas);font:16px/1.5 system-ui}
    .muted{color:var(--muted)} .hero{background:var(--brand);color:#fff;padding:24px}
    .chip{background:rgba(255,255,255,.12);color:#fff;padding:4px 8px;display:inline-block}
    .q{background:#fff;color:#111;border:1px solid #767676} .q::placeholder{color:#9A9A9A}
  </style></head><body><p class="muted">Chữ phụ trên nền oklch</p>
  <div class="hero"><span class="chip">Điện lạnh</span><p class="lead">Đặt thợ trong 30 phút</p></div>
  <input class="q" placeholder="Tìm đơn"></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(c.some(x => /^span\.chip "Điện lạnh" 3\.9\d<4\.5 \(#FFFFFF trên #D7581F\)$/.test(x)), c.join(' | '));
  assert.ok(c.some(x => /^input\.q placeholder "Tìm đơn" 2\.\d\d<4\.5/.test(x)), c.join(' | '));
  assert.ok(!c.some(x => /muted|lead/.test(x)), c.join(' | '));
});

test('lớp anh em nằm dưới chữ: đo theo dải màu thật; data-contrast-bg chỉ lớp nằm dưới khi trình duyệt không trả về', t => {
  const band = 'position:absolute;left:0;right:0;top:0;height:60px;background:#0F766E';
  const r = page(t, `<style>body{margin:0;font:16px/24px system-ui} .app{position:relative;background:#fff;height:130px}
    .t{position:relative;color:#fff;margin:0;padding:12px} .low{position:relative;color:#E6F4F1;margin:0;padding:24px}</style></head><body>
  <div class="app"><div style="${band}"></div><p class="t">Xin chào Minh</p><p class="low">Chữ nhạt trên nền trắng</p></div>
  <div class="app"><div class="band2" style="${band};pointer-events:none"></div><p class="t" data-contrast-bg=".band2">Có gợi ý lớp dưới</p></div>
  <div class="app"><div style="${band};pointer-events:none"></div><p class="t">Không gợi ý</p></div></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(c.some(x => x.includes('Chữ nhạt trên nền trắng')), c.join(' | '));
  assert.ok(!c.some(x => x.includes('Xin chào Minh') || x.includes('Có gợi ý lớp dưới')), c.join(' | '));
  assert.ok(c.some(x => x.includes('Không gợi ý')), 'lớp pointer-events:none không có gợi ý thì đo trên nền tổ tiên');
});

test('chữ trên ảnh: bỏ điểm nằm trên ảnh, không đo nhầm trên nền trắng', t => {
  const img = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='10' height='10' fill='white'/></svg>";
  const r = page(t, `</head><body><div style="position:relative;width:320px;height:160px">
    <img src="${img}" alt="" style="position:absolute;inset:0;width:100%;height:100%">
    <p style="position:relative;color:#fff;margin:0;padding:20px">Trên ảnh</p></div></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  assert.ok(!dims(r).contrast.some(x => x.includes('Trên ảnh')), dims(r).contrast.join(' | '));
});

// ---- Báo giả của phép đo tương phản (review cuối 1.2.0, R14, R15). Mỗi trang có một chữ nhạt thật làm đối chứng ----
const FAINT = '<p style="color:#CCCCCC;margin:0;padding:8px">Chữ nhạt thật</p>';
const faint = c => assert.ok(c.some(x => x.includes('Chữ nhạt thật')), 'chữ nhạt thật vẫn phải bị bắt: ' + c.join(' | '));

test('chữ gradient (background-clip:text, chữ trong suốt): không đo, không báo 1.00', t => {
  const r = page(t, `<style>body{margin:0;background:#fff;font:16px/1.5 system-ui}
    .g{background:linear-gradient(90deg,#0F766E,#0F766E);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:32px;margin:0}
    .o{color:#fff;-webkit-text-fill-color:transparent;-webkit-text-stroke:1px #0F766E;font-size:32px;margin:0}
  </style></head><body><h1 class="g">Chữ gradient</h1><h2 class="o">Chữ viền</h2>${FAINT}</body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(!c.some(x => x.includes('Chữ gradient') || x.includes('Chữ viền')), c.join(' | '));
  faint(c);
});

test('toast đang chuyển opacity lúc đo: không báo theo độ mờ giữa chừng', t => {
  const r = page(t, `<style>body{margin:0;background:#fff;font:16px/1.5 system-ui}
    .toast{position:fixed;left:24px;bottom:24px;background:#18181B;color:#fff;padding:12px;opacity:0;transition:opacity 12s linear}
    .toast.on{opacity:1}
  </style></head><body>${FAINT}<div class="toast" id="toast"><span>Đã lưu thay đổi</span></div></body></html>`,
  [{ name: 'view', js: "document.getElementById('toast').classList.add('on')", wait: 300 }]);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(!c.some(x => x.includes('Đã lưu thay đổi')), c.join(' | '));
  faint(c);
});

test('lớp phủ trong suốt trên ảnh nền (gradient, url): bỏ điểm, không đo trên nền trắng', t => {
  const img = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='white'/%3E%3C/svg%3E";
  const r = page(t, `<style>body{margin:0;background:#fff;font:16px/1.5 system-ui}
    .hero{background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url("${img}");background-size:cover;height:240px;padding:24px}
    .hero p{color:#fff;margin:0}
  </style></head><body><div class="hero"><p>Đặt lịch khám ngay hôm nay</p></div>${FAINT}</body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(!c.some(x => x.includes('Đặt lịch khám')), c.join(' | '));
  faint(c);
});

test('dải màu lớp anh em (absolute inset-0) dưới màn đầu: không đo nhầm trên nền trắng của tổ tiên', t => {
  const r = page(t, `<style>body{margin:0;background:#fff;font:16px/1.5 system-ui}
    .sec{position:relative;isolation:isolate;padding:40px} .band{position:absolute;inset:0;z-index:-10;background:#0F766E}
    .sec h2{color:#fff;margin:0} .spacer{height:1400px}
  </style></head><body><section class="sec"><div class="band"></div><h2>Dải trên màn đầu</h2></section><div class="spacer"></div>
  <section class="sec"><div class="band"></div><h2>Dải dưới màn đầu</h2></section>${FAINT}</body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).contrast;
  assert.ok(!c.some(x => x.includes('Dải trên màn đầu') || x.includes('Dải dưới màn đầu')), c.join(' | '));
  faint(c);
});

test('màu theo ý định với nhãn tiếng Việt: "Huỷ", "Huỷ bỏ" không nguy hiểm; "Huỷ đơn", "Xoá…" tô màu chính thì bắt', t => {
  const r = page(t, `<style>:root{--primary:#0F766E;--destructive:#B42318}
    button{font:16px system-ui;padding:8px 12px;margin:4px;border:0}
    .p{background:var(--primary);color:#fff} .d{background:var(--destructive);color:#fff} .n{background:transparent;color:#18181B;border:1px solid #767676}
  </style></head><body>
  <button class="p">Xoá khách hàng</button><button class="p">Huỷ đơn</button><button class="n">Huỷ</button><button class="p">Huỷ bỏ</button>
  <button class="d">Lưu thay đổi</button><button class="d">Đặt lại dữ liệu</button>
  <button class="d">Xoá tệp</button><button class="p">Xoá tệp</button>
  <a href="?loc=" style="color:var(--primary)">Xoá bộ lọc</a><button class="p">Đặt lại bộ lọc</button></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const i = dims(r).intent;
  const has = s => i.some(x => x.includes(s));
  assert.ok(!has('"xoá bộ lọc"') && !has('"đặt lại bộ lọc"'), 'xoá, đặt lại bộ lọc không phải hành động nguy hiểm: ' + i.join(' | '));
  assert.ok(has('"xoá khách hàng": nhãn nguy hiểm mà tô màu chính'), i.join(' | '));
  assert.ok(has('"huỷ đơn": nhãn nguy hiểm mà tô màu chính'), i.join(' | '));
  assert.ok(has('"lưu thay đổi": nhãn đồng ý mà tô màu nguy hiểm'), i.join(' | '));
  assert.ok(has('"xoá tệp": cùng nhãn nguy hiểm mà hai màu khác nhau'), i.join(' | '));
  assert.ok(!has('"huỷ"') && !has('"huỷ bỏ"') && !has('"đặt lại dữ liệu"'), i.join(' | '));
});

test('màu theo ý định: "Đặt lại mật khẩu", "Đặt lại" (đặt hàng lại), "Đặt lại đơn" tô màu chính không bị bắt; "Đặt lại dữ liệu" thì có', t => {
  const r = page(t, `<style>:root{--primary:#0F766E;--destructive:#B42318}
    button{font:16px system-ui;padding:8px 12px;margin:4px;border:0} .p{background:var(--primary);color:#fff}
  </style></head><body>
  <button class="p">Đặt lại mật khẩu</button><button class="p">Đặt lại</button><button class="p">Đặt lại đơn</button>
  <button class="p">Đặt lại lịch hẹn</button><button class="p">Reset password</button><button class="p">Đặt lại dữ liệu</button></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const i = dims(r).intent;
  const has = s => i.some(x => x.includes(s));
  for (const l of ['"đặt lại mật khẩu"', '"đặt lại"', '"đặt lại đơn"', '"đặt lại lịch hẹn"', '"reset password"']) assert.ok(!has(l), l + ': ' + i.join(' | '));
  assert.ok(has('"đặt lại dữ liệu": nhãn nguy hiểm mà tô màu chính'), i.join(' | '));
});

test('màu theo ý định: "Đặt lại" trơn tô màu nguy hiểm không bị coi là nhãn đồng ý; "Đặt lịch" tô màu nguy hiểm thì vẫn bị bắt', t => {
  const r = page(t, `<style>:root{--primary:#0F766E;--destructive:#B42318}
    button{font:16px system-ui;padding:8px 12px;margin:4px;border:0} .d{background:var(--destructive);color:#fff}
  </style></head><body>
  <button class="d">Đặt lại</button><button class="d">Đặt lịch</button></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const i = dims(r).intent;
  const has = s => i.some(x => x.includes(s));
  assert.ok(!has('"đặt lại"'), '"Đặt lại" trơn mơ hồ, không phải nhãn đồng ý: ' + i.join(' | '));
  assert.ok(has('"đặt lịch": nhãn đồng ý mà tô màu nguy hiểm'), i.join(' | '));
});

test('theme theo tên: run.mjs đặt prefers-color-scheme theo --theme-mode của theme đang bật', t => {
  const body = `<script>document.documentElement.dataset.theme = new URLSearchParams(location.search).get('theme') || ''</script>
  <style>:root[data-theme="toi"]{--theme-mode:"dark";color-scheme:dark}</style></head><body><p>X</p></body></html>`;
  const steps = [{ name: 'm', check: "matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'" }];
  const dark = page(t, body, steps, { query: '?theme=toi' });
  if (!dark) return t.skip('không có trình duyệt');
  assert.equal(dark.find(s => s.step === 'm').check, 'dark');
  assert.equal(page(t, body, steps).find(s => s.step === 'm').check, 'light');
});

test('lượt kiểm sâu: hover và focus hạ tương phản, mũi tên chết, phím chết, bấm không đổi gì, đổi mà nhìn không khác', t => {
  const r = page(t, `<style>
    button{font:16px system-ui;padding:8px 12px;margin:4px;border:1px solid #767676;background:#fff;color:#18181B}
    .h{background:#0F766E;color:#fff;border:0} .h:hover{background:#5EEAD4}
    .f:focus-visible{background:#FDE68A;color:#fff;outline:2px solid #18181B}
    [role=tab],[role=switch],[role=button]{display:inline-block;padding:8px;border:1px solid #767676;font:16px system-ui}
  </style></head><body>
  <button class="h">Lưu</button><button class="f">Xem thêm</button>
  <div role="tablist" id="dead" aria-label="Chết"><div role="tab" tabindex="0" aria-selected="true">Một</div><div role="tab" tabindex="-1" aria-selected="false">Hai</div></div>
  <div role="tablist" id="live" aria-label="Sống"><div role="tab" tabindex="0" aria-selected="true">Ba</div><div role="tab" tabindex="-1" aria-selected="false">Bốn</div></div>
  <div role="button" tabindex="0" aria-pressed="false" id="custom" onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')">Ghim</div>
  <button aria-pressed="false" id="deadtoggle">Theo dõi</button>
  <div role="switch" tabindex="0" aria-checked="false" id="blind" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')">Nền tối</div>
  <button aria-pressed="false" data-demo-state="pressed">Mẫu</button>
  <script>
    document.getElementById('live').addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown') return;
      const tabs = [...e.currentTarget.querySelectorAll('[role=tab]')];
      const n = tabs[(tabs.indexOf(document.activeElement) + 1) % tabs.length];
      tabs.forEach(x => { x.tabIndex = -1; x.setAttribute('aria-selected', 'false'); });
      n.tabIndex = 0; n.setAttribute('aria-selected', 'true'); n.focus();
    });
  </script></body></html>`, null, { env: { QA_DEEP: '1' } });
  if (!r) return t.skip('không có trình duyệt');
  const d = r.find(s => s.step === 'deep').deep;
  const all = JSON.stringify(d);
  assert.ok(d.states.some(x => x.startsWith('hover button.h "Lưu"')), all);
  assert.ok(d.states.some(x => x.startsWith('focus button.f "Xem thêm"')), all);
  assert.ok(d.keyboard.some(x => x.includes('phím mũi tên không chạy trong div#dead')), all);
  assert.ok(!d.keyboard.some(x => x.includes('div#live')), all);
  assert.ok(d.keyboard.some(x => x.startsWith('Enter và Space không đổi trạng thái của div#custom')), all);
  assert.ok(d.interactive.some(x => x.startsWith('bấm mà không đổi gì button#deadtoggle')), all);
  assert.ok(d.interactive.some(x => x.startsWith('đổi trạng thái mà nhìn không khác div#blind')), all);
  assert.ok(!all.includes('"mẫu"'), 'data-demo-state không được bấm thử');
});

test('lượt kiểm sâu: lối tắt mở tại chỗ phải ở lại trang, mở lớp phủ, Esc đóng, focus về nút mở', t => {
  const r = page(t, `<style>body{font:16px system-ui} button{padding:8px;border:1px solid #767676;background:#fff;color:#18181B}
    [role=dialog]{display:none;position:fixed;inset:40px;background:#fff;border:1px solid #767676;padding:16px} [role=dialog].open{display:block}
    .drawer{position:fixed;top:0;right:0;width:300px;height:100%;background:#fff;transform:translateX(100%)} .drawer.open{transform:none}</style></head><body>
  <button id="good" data-modal-open="dlg">Đổi buổi</button>
  <button id="away" data-mo="ngan-truot" onclick="location.href='about:blank'">Bán khoá</button>
  <button id="dud" data-mo="hop-thoai">Xếp lịch</button>
  <button id="sticky" data-modal-open="dlg2">Thu tiền</button>
  <button id="lost" data-modal-open="dlg3">Ghi chú</button>
  <button id="slide" data-mo="ngan-truot" data-modal-open="drw">Chi tiết</button>
  <div role="dialog" aria-modal="true" id="dlg"><button>Đóng</button></div>
  <div role="dialog" aria-modal="true" id="dlg2"><p>Không đóng bằng Esc</p></div>
  <div role="dialog" aria-modal="true" id="dlg3"><button>Đóng</button></div>
  <aside class="drawer" id="drw" aria-label="Chi tiết"><button>Đóng</button></aside>
  <script>
    let opener = null;
    document.addEventListener('click', e => { const o = e.target.closest('[data-modal-open]'); if (!o) return; opener = o;
      const d = document.getElementById(o.dataset.modalOpen); d.classList.add('open'); (d.querySelector('button') || d).focus(); });
    document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; const d = document.querySelector('.open'); if (!d || d.id === 'dlg2') return;
      d.classList.remove('open'); if (d.id !== 'dlg3') opener.focus(); });
  </script></body></html>`, null, { env: { QA_DEEP: '1' } });
  if (!r) return t.skip('không có trình duyệt');
  const s = r.find(x => x.step === 'deep').deep.shortcuts, all = s.join(' | ');
  assert.ok(s.some(x => x.startsWith('lối tắt sang trang khác button#away')), all);
  assert.ok(s.some(x => x.startsWith('bấm lối tắt mà không mở gì trên trang button#dud')), all);
  assert.ok(s.some(x => x.startsWith('Esc không đóng button#sticky')), all);
  assert.ok(s.some(x => x.startsWith('đóng xong focus không về nút mở button#lost')), all);
  assert.ok(!/button#(good|slide)/.test(all), 'hộp thoại và ngăn trượt đúng luật không bị báo: ' + all);
  assert.equal(s.length, 4, all);
});

test('lượt kiểm sâu: liên kết trong <details> đang đóng không bị báo "không Tab tới được"', t => {
  const r = page(t, `<style>body{font:16px system-ui}</style></head><body>
  <details><summary>Câu hỏi thường gặp</summary><p>Xem <a href="#chinh-sach">liên kết</a></p></details>
  <a href="#tiep">Đi tiếp</a></body></html>`, null, { env: { QA_DEEP: '1' } });
  if (!r) return t.skip('không có trình duyệt');
  const d = r.find(s => s.step === 'deep').deep;
  assert.ok(!d.keyboard.some(x => x.includes('liên kết')), JSON.stringify(d.keyboard));
});

test('lượt kiểm sâu: nút hiện mật khẩu đổi icon con (ph-eye ↔ ph-eye-slash) không bị báo "nhìn không khác"', t => {
  const r = page(t, `<style>body{font:16px system-ui} button{padding:8px;border:1px solid #767676;background:#fff;color:#18181B}
    .ph{font-style:normal;display:inline-block;width:20px} .ph-eye::before{content:"o"} .ph-eye-slash::before{content:"ø"}</style></head><body>
  <input type="password" aria-label="Mật khẩu" value="bimat123">
  <button type="button" id="eye" aria-label="Hiện mật khẩu" aria-pressed="false"><i class="ph ph-eye"></i></button>
  <script>document.getElementById('eye').addEventListener('click', e => {
    const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true', i = b.querySelector('i');
    b.setAttribute('aria-pressed', String(on)); i.classList.toggle('ph-eye', !on); i.classList.toggle('ph-eye-slash', on);
  });</script></body></html>`, null, { env: { QA_DEEP: '1' } });
  if (!r) return t.skip('không có trình duyệt');
  const d = r.find(s => s.step === 'deep').deep;
  assert.ok(!d.interactive.some(x => x.includes('button#eye')), JSON.stringify(d.interactive));
});

test('lượt kiểm sâu: lỗi lúc tải không ghi lại ở bước deep; lỗi trùng trong lượt sâu chỉ ghi một lần', t => {
  const r = page(t, `</head><body><script>console.error('lỗi lúc tải')</script>
  <button aria-pressed="false" onclick="console.error('lỗi khi bấm')">Một</button>
  <button aria-pressed="false" onclick="console.error('lỗi khi bấm')">Hai</button></body></html>`, null, { env: { QA_DEEP: '1' }, errors: true });
  if (!r) return t.skip('không có trình duyệt');
  assert.deepEqual(r.find(s => s.step === 'load').errors, ['ERR lỗi lúc tải']);
  assert.deepEqual(r.find(s => s.step === 'deep').errors, ['ERR lỗi khi bấm']);
});

test('không bật QA_DEEP thì báo cáo không có bước deep', t => {
  const r = page(t, '</head><body><button aria-pressed="false">X</button></body></html>');
  if (!r) return t.skip('không có trình duyệt');
  assert.equal(r.find(s => s.step === 'deep'), undefined);
});

test('lượt kiểm sâu: trang hơn 150 control Tab được thì không báo "không Tab tới được" khi vòng Tab chạm trần mà chưa quay vòng', t => {
  const buttons = Array.from({ length: 160 }, (_, i) => `<button style="font:14px system-ui;padding:0 4px;margin:1px">Nút ${i + 1}</button>`).join('');
  const r = page(t, `</head><body>${buttons}</body></html>`, null, { env: { QA_DEEP: '1' } });
  if (!r) return t.skip('không có trình duyệt');
  const d = r.find(s => s.step === 'deep').deep;
  assert.ok(!d.keyboard.some(x => x.startsWith('không Tab tới được')), JSON.stringify(d.keyboard.slice(0, 3)));
});

// Bố cục trên trang đã render (chỉ số của sketch-to-map). codes chặn như tương phản (qadiff); layout chỉ cảnh báo.
// Đo trên một prototype thật (05/10/2026): trang ẩn mã lúc chạy bằng JS nên đọc mã nguồn thì báo giả; đo trên trang đã render mới đúng.
test('codes: mã tham chiếu trong chữ đang hiện bị bắt; mã đã ẩn, mã của dữ liệu (mã học viên) và chữ trong script thì im', t => {
  const r = page(t, `</head><body><p>Lớp đủ sĩ số không nhận thêm (UC-12).</p><p>Ghi chú BR-HV-03 cho phụ huynh</p>
  <span hidden>XD-04</span><p>Mã học viên SX-0412</p><button title="Theo OQ-01">Lưu</button>
  <script>const nguon = 'UC-99';</script></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const c = dims(r).codes;
  assert.equal(c.length, 3, JSON.stringify(c));
  assert.ok(c.some(x => x.includes('UC-12')) && c.some(x => x.includes('BR-HV-03')) && c.some(x => x.includes('OQ-01')), JSON.stringify(c));
});

test('codes: mã do JS bỏ đi lúc tải thì không bị bắt', t => {
  const r = page(t, `</head><body><p id="p">Ngưỡng tạm (OQ-01)</p>
  <script>const p = document.getElementById('p'); p.textContent = p.textContent.replace(/\\s*\\(OQ-\\d+\\)/, '');</script></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  assert.deepEqual(dims(r).codes, []);
});

test('layout: hơn một nút chính nhìn thấy, nhóm menu hơn 7 mục, hơn 5 tab, khung viền dày lồng nhau thì cảnh báo; hộp thoại mở chỉ đếm trong hộp', t => {
  const items = n => Array.from({ length: n }, (_, i) => `<li><a href="#m${i}">Mục ${i + 1}</a></li>`).join('');
  const tabs = n => Array.from({ length: n }, (_, i) => `<button role="tab" aria-selected="${i === 0}">Tab ${i + 1}</button>`).join('');
  const css = `<style>:root{--primary:#1d4ed8;--on-primary:#fff}body{font:16px system-ui;margin:0}.p{background:var(--primary);color:var(--on-primary);border:0;padding:8px 12px}
    .s{background:#fff;color:#111;border:1px solid #767676;padding:8px 12px}.box{border:2px solid #333;padding:8px;margin:4px}</style></head>`;
  const r = page(t, `${css}<body><nav><ul>${items(9)}</ul></nav><div role="tablist">${tabs(6)}</div>
    <button class="p">Lưu</button><button class="p">Gửi</button><button class="p">Duyệt</button><button class="s">Huỷ</button>
    <div class="box"><div class="box"><div class="box"><p>Khung lồng</p></div></div></div></body></html>`);
  if (!r) return t.skip('không có trình duyệt');
  const l = dims(r).layout.join('\n');
  assert.match(l, /3 nút chính/);
  assert.match(l, /9 mục/);
  assert.match(l, /6 tab/);
  assert.match(l, /viền dày/);
  assert.match(l, /lồng 3 lớp/);
  const ok = page(t, `${css}<body><button class="p">Lưu</button><button class="p">Gửi</button>
    <dialog id="d"><button class="p">Xác nhận</button><button class="s">Huỷ</button></dialog><script>document.getElementById('d').showModal()</script></body></html>`);
  assert.ok(!ok.find(s => s.step === 'view').dims.layout.some(x => /nút chính/.test(x)), JSON.stringify(ok.find(s => s.step === 'view').dims.layout));
});
