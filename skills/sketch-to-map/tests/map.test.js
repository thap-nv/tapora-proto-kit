// Kiểm map.mjs: check (dữ liệu, chỉ số bố cục chặn và cảnh báo, MAP.md), --brief, visible, slice.
// Mỗi chỉ số chặn có một test làm trượt nó, dựng từ cặp ví dụ templates/features.example.js + layout.example.js (sạch).
// Chạy: node --test skills/sketch-to-map/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const SKILL = path.resolve(__dirname, '..');
const MAP = path.join(SKILL, 'scripts', 'map.mjs');
const load = (f, key) => { const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(SKILL, 'templates', f), 'utf8'), ctx); return JSON.parse(JSON.stringify(ctx.window[key])); };
const example = () => ({ F: load('features.example.js', 'FEATURES'), L: load('layout.example.js', 'LAYOUT') });

// Thư mục prototype tạm có map/features.js và map/layout.js; trả đường dẫn thư mục prototype
function proto(t, { F, L } = example()) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'map-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify(F, null, 1)};\n`);
  if (L) fs.writeFileSync(path.join(dir, 'map', 'layout.js'), `window.LAYOUT = ${JSON.stringify(L, null, 1)};\n`);
  return dir;
}
const run = (...args) => spawnSync(process.execPath, [MAP, ...args], { encoding: 'utf8', timeout: 60000 });
function check(t, data, ...flags) {
  const dir = proto(t, data);
  const r = run('check', dir, ...flags);
  const jf = path.join(dir, 'map', 'check.json');
  const json = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : null;
  return { r, out: r.stdout + r.stderr, json, dir };
}
const blocks = (json, metric) => json.block.filter(b => b.metric === metric);
const warns = (json, metric) => json.warn.filter(b => b.metric === metric);

test('cặp ví dụ: check sạch, thoát 0, sinh MAP.md và check.json, in dòng chỉ số', t => {
  const { r, out, json, dir } = check(t);
  assert.equal(r.status, 0, out);
  assert.deepEqual(json.block, [], JSON.stringify(json.block));
  assert.deepEqual(json.warn, [], JSON.stringify(json.warn));
  assert.match(out, /Chỉ số bố cục:/);
  assert.match(out, /0 chặn · 0 cảnh báo/);
  const md = fs.readFileSync(path.join(dir, 'map', 'MAP.md'), 'utf8');
  for (const s of ['Hôm nay', 'Ca khám hôm nay', 'Đặt lịch hẹn', 'Tích điểm thành viên', 'Khách mới tới khám lần đầu']) assert.ok(md.includes(s), s);
  assert.match(md, /Hoãn/);
});

test('chỉ số 1: lối tắt mở trang mà không khai ve thì chặn, nêu đủ từ đâu tới chức năng nào', t => {
  const d = example();
  d.L.shortcuts.push({ from: 'ho-so', to: 'F-12', mo: 'trang' });
  d.L.shortcuts = d.L.shortcuts.filter(s => !(s.from === 'ho-so' && s.to === 'F-12' && s.mo === 'ngan-truot'));
  const { r, out, json } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.equal(blocks(json, 1).length, 1);
  assert.match(out, /ho-so → F-12/);
  // Khai ve thì hết lỗi
  const d2 = example();
  d2.L.shortcuts.find(s => s.from === 'ho-so' && s.to === 'F-12').mo = 'trang';
  d2.L.shortcuts.find(s => s.from === 'ho-so' && s.to === 'F-12').ve = 'Thu xong về hồ sơ, giữ tab đang mở';
  assert.equal(check(t, d2).r.status, 0);
});

test('chỉ số 1: mục trên trang chủ không đặt ở trang chủ và không có lối tắt thì chặn (bấm là đá đi)', t => {
  const d = example();
  d.L.shortcuts = d.L.shortcuts.filter(s => !(s.from === 'hom-nay' && s.to === 'F-06'));
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.match(blocks(json, 1).map(b => b.msg).join('\n'), /hom-nay → F-06/);
});

test('chỉ số 12: nhóm menu đặt theo đợt phát hành thì chặn', t => {
  const d = example();
  d.L.nav[2].groups = [{ name: '', items: ['tong-quan', 'lich', 'benh-nhan', 'thu-tien'] }, { name: 'Giai đoạn 2', items: ['bao-cao', 'cai-dat'] }];
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.equal(blocks(json, 12).length, 1);
  assert.match(out, /Giai đoạn 2/);
  for (const name of ['GĐ2', 'Phase 2', 'Sắp ra mắt', 'Đợt 2']) {
    const e = example();
    e.L.nav[2].groups = [{ name: '', items: ['tong-quan', 'lich', 'benh-nhan', 'thu-tien'] }, { name, items: ['bao-cao', 'cai-dat'] }];
    assert.equal(check(t, e).r.status, 1, name);
  }
});

test('chỉ số 12: vai không có trang chủ, hay trang chủ không có dải việc, thì chặn', t => {
  const d = example();
  delete d.L.roles.find(x => x.id === 'bac-si').home;
  const a = check(t, d);
  assert.equal(a.r.status, 1, a.out);
  assert.match(blocks(a.json, 12).map(b => b.msg).join('\n'), /bac-si/);
  const e = example();
  delete e.L.screens.find(s => s.id === 'ca-kham').bands;
  delete e.L.shortcuts.find(s => s.from === 'ca-kham').from;
  e.L.shortcuts = e.L.shortcuts.filter(s => s.from);
  const b = check(t, e);
  assert.equal(b.r.status, 1, b.out);
  assert.match(blocks(b.json, 12).map(x => x.msg).join('\n'), /ca-kham/);
});

test('chỉ số 2: việc T1 sâu 4 bước thì chặn, in đường đi và thời gian ước', t => {
  const d = example();
  // Thu tiền chuyển vào một màn con của hồ sơ, bỏ mọi lối tắt: Bệnh nhân → Hồ sơ → Hoá đơn → mở = 4 bước
  d.L.screens.push({ id: 'hoa-don', name: 'Hoá đơn', surface: 'web', module: 'thu-tien', roles: ['le-tan', 'quan-ly'], parent: 'ho-so' });
  d.L.place['F-12'] = { screen: 'hoa-don', tier: 1, mo: 'ngan-truot' };
  d.L.shortcuts = d.L.shortcuts.filter(s => s.to !== 'F-12');
  d.L.screens.find(s => s.id === 'hom-nay').bands[1].items = ['F-01', 'F-06'];
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  const b = blocks(json, 2);
  assert.equal(b.length, 1, JSON.stringify(json.block));
  assert.match(b[0].msg, /F-12.*le-tan.*4 bước/);
  assert.match(out, /benh-nhan → ho-so → hoa-don/);
  assert.match(out, /giây/);
});

test('chỉ số 5: một màn 10 chức năng, 7 tab thì cảnh báo, không chặn', t => {
  const d = example();
  const hs = d.L.screens.find(s => s.id === 'ho-so');
  hs.tabs = [...hs.tabs, 'Ảnh chụp', 'Đơn thuốc', 'Hợp đồng', 'Ghi chú'];
  // Hồ sơ có sẵn 4 chức năng; thêm 6 thành 10
  for (const id of ['F-03', 'F-04', 'F-11', 'F-12', 'F-13', 'F-16']) d.L.place[id] = { screen: 'ho-so', tier: 4, mo: 'hop-thoai' };
  d.L.shortcuts = d.L.shortcuts.filter(s => s.to !== 'F-12' || s.from === 'ho-so');
  d.L.screens.find(s => s.id === 'hom-nay').bands[1].items = ['F-01', 'F-06'];
  d.L.screens.find(s => s.id === 'tong-quan').bands = [{ name: 'Doanh thu hôm nay', items: ['F-15'] }];
  d.L.shortcuts = d.L.shortcuts.filter(s => s.to !== 'F-13');
  d.L.tasks = d.L.tasks.filter(x => x.feature !== 'F-12');
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  const w = warns(json, 5).map(x => x.msg).join('\n');
  assert.match(w, /ho-so.*10 chức năng/);
  assert.match(w, /ho-so.*7 tab/);
});

test('chỉ số 4: nhóm menu quá 7 mục thì cảnh báo; tab app quá 5 thì cảnh báo', t => {
  const d = example();
  const extra = ['m1', 'm2', 'm3'].map(id => ({ id, name: `Màn ${id}`, surface: 'web', module: 'quan-tri', roles: ['quan-ly'] }));
  d.L.screens.push(...extra);
  d.L.nav[2].groups[0].items.push('m1', 'm2', 'm3');
  const apps = ['a1', 'a2', 'a3'].map(id => ({ id, name: `Tab ${id}`, surface: 'app', module: 'quan-tri', roles: ['benh-nhan'] }));
  d.L.screens.push(...apps);
  d.L.nav[3].groups[0].items.push('a1', 'a2', 'a3');
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  const w = warns(json, 4).map(x => x.msg).join('\n');
  assert.match(w, /quan-ly.*9 mục/);
  assert.match(w, /benh-nhan.*6 tab/);
});

test('chỉ số 6: cùng một việc mang hai nhãn ở hai lối tắt thì cảnh báo', t => {
  const d = example();
  d.L.shortcuts.find(s => s.from === 'phieu-kham' && s.to === 'F-01').label = 'Hẹn tái khám';
  d.L.shortcuts.find(s => s.from === 'ho-so' && s.to === 'F-01').label = 'Đặt hẹn';
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  assert.match(warns(json, 6).map(x => x.msg).join('\n'), /F-01.*Hẹn tái khám.*Đặt hẹn|F-01.*Đặt hẹn.*Hẹn tái khám/);
});

test('chỉ số 7: mã tham chiếu lộ ra nhãn thì chặn', t => {
  const d = example();
  d.F.features.find(f => f.id === 'F-01').name = 'Đặt lịch hẹn (UC-01)';
  d.L.screens.find(s => s.id === 'lich').zones[0] = 'Thanh công cụ BR-LH-02';
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.equal(blocks(json, 7).length, 2, JSON.stringify(json.block));
});

test('hành trình gãy: bước mà vai không tới được thì chặn', t => {
  const d = example();
  d.L.flows[0].steps.push('F-09');   // Phiếu khám chỉ bác sĩ vào được
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.match(blocks(json, 'hanh-trinh').map(b => b.msg).join('\n'), /Khách mới tới khám lần đầu.*F-09/);
});

test('việc bấm thử mà vai không tới được thì chặn', t => {
  const d = example();
  d.L.tasks.push({ role: 'le-tan', say: 'Bạn xem doanh thu tháng.', feature: 'F-15' });
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.match(blocks(json, 'viec').map(b => b.msg).join('\n'), /le-tan.*F-15/);
});

test('dữ liệu: chức năng thiếu chỗ đặt, chỗ đặt trỏ màn lạ, mã trùng, module lạ, phụ thuộc vòng thì chặn', t => {
  const cases = [
    [d => { delete d.L.place['F-22']; }, /F-22/],
    [d => { d.L.place['F-22'].screen = 'khong-co'; }, /khong-co/],
    [d => { d.F.features.push({ ...d.F.features[0] }); }, /F-01.*trùng/],
    [d => { d.F.features[0].module = 'la'; }, /la/],
    [d => { d.L.modules.find(m => m.id === 'benh-nhan').depends = ['kham']; }, /vòng/],
    [d => { d.F.features[1].freq = 'thang'; }, /freq/],
  ];
  for (const [mutate, re] of cases) {
    const d = example();
    mutate(d);
    const { r, json, out } = check(t, d);
    assert.equal(r.status, 1, `${re}: ${out}`);
    assert.match(blocks(json, 'du-lieu').map(b => b.msg).join('\n'), re);
  }
});

test('T3 trên bề mặt web chưa bật Ctrl+K thì cảnh báo', t => {
  const d = example();
  delete d.L.surfaces[0].ctrlK;
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  assert.equal(warns(json, 'ctrl-k').length, 1);
});

test('chưa có layout.js: chỉ kiểm kê, không báo lỗi bố cục', t => {
  const d = example();
  delete d.L;
  const { r, out } = check(t, { F: d.F });
  assert.equal(r.status, 0, out);
  assert.match(out, /Chưa có layout\.js/);
  assert.match(out, /25 chức năng/);
});

test('--brief: mỗi chức năng một dòng theo module, không in spec', t => {
  const { r, out } = check(t, example(), '--brief');
  assert.equal(r.status, 0, out);
  const F = example().F.features;
  for (const f of F) assert.ok(out.includes(`${f.id} `) && out.includes(f.name), f.id);
  assert.ok(!out.includes(F[0].spec));
  assert.match(out, /F-14.*suy/);
  assert.match(out, /F-23.*hoãn/);
});

test('visible: cây chỉ có nhãn, không lộ mã chức năng, nút đánh số để chấm', t => {
  const dir = proto(t);
  const r = run('visible', dir);
  assert.equal(r.status, 0, r.stderr);
  assert.doesNotMatch(r.stdout, /F-\d/);
  assert.match(r.stdout, /Lễ tân/);
  assert.match(r.stdout, /\[[A-Z]+\d+(\.\d+)*\] /);
  for (const s of ['Hôm nay', 'Thu tiền và in hoá đơn', 'Dời lịch hẹn', 'Cài đặt']) assert.ok(r.stdout.includes(s), s);
});

test('check --shots khi sạch in khối Trình ở cổng: chức năng suy, ghi chú, module theo thứ tự dựng; còn mục chặn thì không in', t => {
  const data = example();
  data.F.features.find(f => f.id === 'F-07').notes = 'mâu thuẫn: D3:40 với D5:12';
  const { out } = check(t, data, '--shots');
  assert.match(out, /^Trình ở cổng:$/m);
  const suy = data.F.features.filter(f => f.evidence === 'suy');
  assert.ok(suy.length, 'ví dụ cần có chức năng suy');
  for (const f of suy) assert.ok(out.includes(`${f.id} ${f.name}`), f.id);
  assert.match(out, /^ {2}Ghi chú \(1: 1 mâu thuẫn, 0 câu hỏi mở\):\n {4}F-07 [^:]+: mâu thuẫn: D3:40 với D5:12$/m);
  assert.match(out, /^ {2}Module theo thứ tự dựng: Bệnh nhân \(\d+ chức năng · 0 Must · \d+ hoãn\) → /m);
  const bad = example();
  bad.L.shortcuts.push({ from: 'hom-nay', to: 'F-02', mo: 'trang' });
  assert.doesNotMatch(check(t, bad, '--shots').out, /Trình ở cổng/);
});

test('check --shots: nhiều ghi chú thì mâu thuẫn in trước và đủ, chỉ câu hỏi mở bị cắt', t => {
  // Đo rml1, rml2 (06/10): 43 ghi chú, khối in 20 rồi "… còn 23", agent phải grep features.js tìm mâu thuẫn (2 lượt)
  const data = example();
  data.F.features.forEach((f, i) => { f.notes = `câu hỏi mở số ${i + 1}`; });
  const last = data.F.features.slice(-3);
  last.forEach((f, i) => { f.notes = `mâu thuẫn: D1:${40 + i} «giữ chỗ» với D1:${50 + i} «nhả chỗ»`; });
  const n = data.F.features.length;
  const { out } = check(t, data, '--shots');
  assert.match(out, new RegExp(`^ {2}Ghi chú \\(${n}: 3 mâu thuẫn, ${n - 3} câu hỏi mở\\):$`, 'm'));
  const block = out.slice(out.indexOf('  Ghi chú ('), out.indexOf('  Module theo thứ tự dựng'));
  for (const f of last) assert.ok(block.includes(`${f.id} ${f.name}: mâu thuẫn: `), `thiếu mâu thuẫn ${f.id}`);
  assert.ok(block.indexOf('mâu thuẫn: ') < block.indexOf('câu hỏi mở số 1'), 'mâu thuẫn in trước câu hỏi mở');
  assert.match(block, /… còn \d+ câu hỏi mở: xem map\/features\.js/);
});

test('visible --treetest: bài soát nhãn ở map/treetest.md không có đáp án; đáp án chỉ in cho agent chính', t => {
  const dir = proto(t);
  const r = run('visible', dir, '--treetest');
  assert.equal(r.status, 0, r.stderr);
  const md = fs.readFileSync(path.join(dir, 'map', 'treetest.md'), 'utf8');
  const { L } = example();
  assert.doesNotMatch(md, /F-\d/);
  for (const x of L.tasks) assert.ok(md.includes(x.say), x.say);
  assert.match(md, /^T1 · vai Lễ tân · /m);
  assert.match(md, /quay lại <số lần>/);
  assert.doesNotMatch(r.stdout, /\[A1\]/, 'không in cây cho agent chính');
  assert.match(r.stdout, /T1 · le-tan → Đặt lịch hẹn/);
  const noTasks = example();
  noTasks.L.tasks = [];
  assert.equal(run('visible', proto(t, noTasks), '--treetest').status, 2);
});

test('slice: in một màn cho B3: chức năng kèm spec, tầng, kiểu mở, lối tắt đi và tới', t => {
  const dir = proto(t);
  const r = run('slice', dir, 'ho-so');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Hồ sơ bệnh nhân/);
  assert.match(r.stdout, /F-10.*Lập kế hoạch điều trị/);
  assert.ok(r.stdout.includes(example().F.features.find(f => f.id === 'F-10').spec));
  assert.match(r.stdout, /F-12.*ngan-truot/);   // lối tắt đi từ hồ sơ
  assert.match(r.stdout, /F-24.*hoãn/);
  const bad = run('slice', dir, 'khong-co');
  assert.equal(bad.status, 2);
});

test('cỡ dự án thật (150 chức năng, 11 vai, 12 module): check sạch, dưới 3 giây', t => {
  const { build } = require('./big-fixture.js');
  const t0 = Date.now();
  const { r, out, json } = check(t, build());
  assert.equal(r.status, 0, out);
  assert.deepEqual(json.block, []);
  assert.ok(Date.now() - t0 < 3000, `${Date.now() - t0} ms`);
});

test('khuôn rỗng features.js và layout.js: đọc được, check chạy hết không vỡ', t => {
  const { r, out } = check(t, { F: load('features.js', 'FEATURES'), L: load('layout.js', 'LAYOUT') });
  assert.ok([0, 1].includes(r.status), out);
  assert.match(out, /0 chức năng/);
  assert.match(out, /→ \d+ chặn/);
});

test('sai tham số hay không đọc được features.js thì thoát 2', t => {
  assert.equal(run('check').status, 2);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'map-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  assert.equal(run('check', dir).status, 2);
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), 'window.FEATURES = {');
  assert.equal(run('check', dir).status, 2);
});

// coverage: trang đã dựng của sketch-to-site (site/<dir>/<màn>.html) phải gắn data-feature cho mọi chức năng đặt trên màn đó và mọi
// lối tắt đi từ màn đó. Màn chưa dựng (dựng theo đợt) chỉ được đếm, không chặn. Mã lạ (gõ sai) thì chặn.
function built(t, pages) {
  const dir = proto(t);
  fs.mkdirSync(path.join(dir, 'site', 'admin'), { recursive: true });
  const page = ids => `<!doctype html><html lang="vi"><body>${ids.map(([id, mo]) => `<button data-feature="${id}"${mo ? ` data-mo="${mo}"` : ''}>${id}</button>`).join('')}</body></html>`;
  for (const [f, ids] of Object.entries(pages)) fs.writeFileSync(path.join(dir, 'site', 'admin', f), page(ids));
  return dir;
}
const HOM_NAY = [['F-05'], ['F-01', 'hop-thoai'], ['F-06', 'ngan-truot'], ['F-12', 'ngan-truot']];
const LICH = [['F-01'], ['F-02'], ['F-03'], ['F-04']];

test('coverage: đủ data-feature trên màn đã dựng thì thoát 0, đếm màn chưa dựng', t => {
  const r = run('coverage', built(t, { 'hom-nay.html': HOM_NAY, 'lich.html': LICH }));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  // Có trên trang: F-01…F-05 đặt ở hai màn đã dựng, F-06 và F-12 mở bằng lối tắt (ngăn trượt) ngay trên Hôm nay
  assert.match(r.stdout, /^Độ phủ: 7\/25 chức năng có trên trang đã dựng · 2 màn đã dựng · 18 chức năng ở 12 màn chưa dựng · 0 thiếu · 0 mã lạ/m);
});

test('coverage: gỡ một data-feature thì thoát 1 và nêu mã, màn, file; mã lạ cũng chặn', t => {
  const r = run('coverage', built(t, { 'hom-nay.html': HOM_NAY, 'lich.html': LICH.filter(([id]) => id !== 'F-03') }));
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /F-03 "Dời lịch hẹn" · màn lich · site\/admin\/lich\.html/);
  const odd = run('coverage', built(t, { 'hom-nay.html': [...HOM_NAY, ['F-99']], 'lich.html': LICH }));
  assert.equal(odd.status, 1, odd.stdout);
  assert.match(odd.stdout, /F-99.*site\/admin\/hom-nay\.html/);
});

test('coverage: lối tắt thiếu data-feature thì chặn; có mà thiếu data-mo đúng kiểu thì chỉ cảnh báo', t => {
  const miss = run('coverage', built(t, { 'hom-nay.html': HOM_NAY.filter(([id]) => id !== 'F-06'), 'lich.html': LICH }));
  assert.equal(miss.status, 1, miss.stdout);
  assert.match(miss.stdout, /lối tắt hom-nay → F-06/);
  const mo = run('coverage', built(t, { 'hom-nay.html': HOM_NAY.map(([id, m]) => [id, id === 'F-06' ? 'trang' : m]), 'lich.html': LICH }));
  assert.equal(mo.status, 0, mo.stdout);
  assert.match(mo.stdout, /F-06.*data-mo="ngan-truot"/);
});
