// Kiểm phần kiểm kê (M1) của map.mjs check và lệnh merge. Nguồn (map/sources.json, ids.json, states.json) dựng tay cho khớp cặp ví dụ
// templates/features.example.js + layout.example.js, đúng định dạng sources.py ghi. Chạy: node --test skills/sketch-to-map/tests/
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
const run = (...args) => spawnSync(process.execPath, [MAP, ...args], { encoding: 'utf8', timeout: 60000 });
const tmp = (t, prefix) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), prefix)); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };

// D1 đặc tả use case: Giới thiệu (2–5, có trong skip), Quy ước (6–8, tự bỏ qua), UC-01…UC-15 mỗi mục 3 dòng từ dòng 9, UC-16 bị loại.
// D2 quy tắc: Lịch hẹn (2–4), Thanh toán (5–8). Must: UC-01, UC-09. Schema: trang_thai_hen, bước chuyển da_dat → da_toi.
function sourced(t, { F, L } = example()) {
  const dir = tmp(t, 'map-inv-');
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify(F)};`);
  fs.writeFileSync(path.join(dir, 'map', 'layout.js'), `window.LAYOUT = ${JSON.stringify(L)};`);
  const uc = Array.from({ length: 16 }, (_, i) => ({ id: `UC-${String(i + 1).padStart(2, '0')}`, start: 9 + i * 3 }));
  const toc1 = [{ title: 'Đặc tả use case', level: 1, start: 1, end: 60 }, { title: 'Giới thiệu', level: 2, start: 2, end: 5 }, { title: 'Quy ước', level: 2, start: 6, end: 8 },
    ...uc.map(u => ({ title: `${u.id} · việc ${u.id}`, level: 2, start: u.start, end: u.start + 2 }))];
  const toc2 = [{ title: 'Quy tắc', level: 1, start: 1, end: 8 }, { title: 'Lịch hẹn', level: 2, start: 2, end: 4 }, { title: 'Thanh toán', level: 2, start: 5, end: 8 }];
  const docs = [{ id: 'D1', path: 'USE-CASE-DEMO.md', kind: 'md', ba: 'USE-CASE', toc: toc1, conventions: [toc1[2]] },
    { id: 'D2', path: 'BUSINESS-RULES-DEMO.md', kind: 'md', ba: 'BUSINESS-RULES', toc: toc2, conventions: [] },
    { id: 'D3', path: 'schema.dbml', kind: 'dbml', ba: 'schema.dbml', toc: [{ title: 'Enum trang_thai_hen', level: 2, start: 1, end: 6 }], conventions: [] }];
  const ids = Object.fromEntries(uc.map(u => [u.id, { def: `D1:${u.start}`, refs: [] }]));
  ids['UC-01'].priority = ids['UC-09'].priority = 'Must';
  ids['UC-16'].dropped = true;
  Object.assign(ids, { 'BR-LH-02': { def: 'D2:3', refs: [] }, 'BR-LH-05': { def: 'D2:4', refs: [] }, 'BR-TT-02': { def: 'D2:6', refs: [] }, 'BR-TT-04': { def: 'D2:7', refs: [] } });
  const w = (f, o) => fs.writeFileSync(path.join(dir, 'map', f), JSON.stringify(o));
  w('sources.json', { docs, total: 30000, recommend: 'doc-nguyen' });
  w('ids.json', { systems: { UC: {}, BR: {} }, ids });
  w('states.json', { enums: { trang_thai_hen: { values: ['da_dat', 'da_toi', 'lo_hen', 'da_huy'], used_by: ['lich_hen.trang_thai'] } },
    transitions: [{ enum: 'trang_thai_hen', from: 'da_dat', to: 'da_toi', src: 'D3:3' }] });
  return dir;
}
function check(t, data) {
  const dir = sourced(t, data);
  const r = run('check', dir);
  return { r, out: r.stdout + r.stderr, json: JSON.parse(fs.readFileSync(path.join(dir, 'map', 'check.json'), 'utf8')) };
}
const inv = json => json.block.filter(b => b.metric === 'kiem-ke').map(b => b.msg).join('\n');

test('kiểm kê: cặp ví dụ khớp nguồn thì sạch; dòng kiểm kê đếm UC, Must, bước chuyển, nhóm trạng thái, mục', t => {
  const { r, out } = check(t);
  assert.equal(r.status, 0, out);
  assert.match(out, /15 UC \(0 thiếu\) · 2 Must \(0 thiếu\) · 1 bước chuyển \(0 thiếu\) · 1 nhóm trạng thái \(0 thiếu\) · \d+ mục \(0 chưa có chức năng\)/);
});

test('kiểm kê: bỏ một UC khỏi mọi src thì chặn, nêu mã; UC bị loại thì không cần chức năng', t => {
  const d = example();
  for (const f of d.F.features) f.src = f.src.filter(s => s !== 'UC-12');
  for (const f of d.F.features.filter(f => !f.src.length)) f.src = ['D2:5'];
  const { r, out, json } = check(t, d);
  assert.equal(r.status, 1, out);
  assert.match(inv(json), /UC-12/);
  assert.doesNotMatch(inv(json), /UC-16/);
});

test('kiểm kê: Must không có chức năng trỏ tới thì chặn', t => {
  const d = example();
  d.F.features.find(f => f.id === 'F-12').src = ['BR-TT-02'];
  const { r, json } = check(t, d);
  assert.equal(r.status, 1);
  assert.match(inv(json), /Must UC-09/);
});

test('kiểm kê: dải dòng trùm chỗ định nghĩa của mã thì coi như trỏ tới mã đó', t => {
  const d = example();
  d.F.features.find(f => f.id === 'F-12').src = ['D1:33-35'];
  const { r, out } = check(t, d);
  assert.equal(r.status, 0, out);
});

test('kiểm kê: bước chuyển trạng thái không có chức năng đưa tới thì chặn (mốc cũ r7-map sót đúng chỗ này); nhóm trạng thái không ai hiện thì chặn', t => {
  const d = example();
  delete d.F.features.find(f => f.id === 'F-05').states;
  const { r, json } = check(t, d);
  assert.equal(r.status, 1);
  assert.match(inv(json), /trang_thai_hen: da_dat → da_toi/);
  const e = example();
  for (const f of e.F.features) delete f.states;
  assert.match(inv(check(t, e).json), /trang_thai_hen \(lich_hen\.trang_thai\)/);
});

test('kiểm kê: mục cấp 2–3 không có chức năng trỏ tới và không có trong skip thì chặn; mục Quy ước tự bỏ qua', t => {
  const d = example();
  d.F.skip = [];
  const { r, json } = check(t, d);
  assert.equal(r.status, 1);
  assert.match(inv(json), /D1:2-5 Giới thiệu/);
  assert.doesNotMatch(inv(json), /Quy ước/);
});

test('kiểm kê: hai chức năng cùng việc (động từ đồng nghĩa, cùng đối tượng) thì cảnh báo; mã nguồn lạ thì cảnh báo', t => {
  const d = example();
  d.F.features.find(f => f.id === 'F-04').name = 'Đổi lịch hẹn';
  d.F.features.find(f => f.id === 'F-06').src.push('UC-99');
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  const w = json.warn.filter(x => x.metric === 'kiem-ke').map(x => x.msg).join('\n');
  assert.match(w, /F-03 "Dời lịch hẹn".*F-04 "Đổi lịch hẹn"/);
  assert.match(w, /UC-99/);
});

test('kiểm kê: tên này là phần đầu của tên kia (bỏ từ nối), chung một vai, thì cảnh báo cùng việc; biến thể theo vai thì không', t => {
  // Đo rml2 (06/10): 6 cặp trùng giữa worker, luật động từ đồng nghĩa chỉ bắt 1; 5 cặp còn lại có tên này là phần đầu của tên kia
  const d = example();
  d.F.features.find(f => f.id === 'F-21').name = 'Đăng nhập app bằng số điện thoại và mã OTP';
  const { r, json, out } = check(t, d);
  assert.equal(r.status, 0, out);
  const w = json.warn.filter(x => x.metric === 'kiem-ke').map(x => x.msg).join('\n');
  assert.match(w, /F-21 "Đăng nhập app bằng số điện thoại và mã OTP".*F-25 "Đăng nhập app bằng số điện thoại"|F-25 "Đăng nhập app bằng số điện thoại".*F-21/);
  assert.doesNotMatch(w, /F-20/, '"Đặt lịch hẹn" của lễ tân và "Đặt lịch hẹn trên app" của bệnh nhân là biến thể theo vai, không chung vai');
});

test('kiểm kê: mục của tài liệu đánh dấu data (phụ lục dữ liệu) không cần chức năng hay skip', t => {
  const dir = sourced(t);
  const f = path.join(dir, 'map', 'sources.json');
  const src = JSON.parse(fs.readFileSync(f, 'utf8'));
  src.docs.push({ id: 'D4', path: 'PHU-LUC.md', kind: 'md', ba: null, data: true, conventions: [], toc: [{ title: 'Phụ lục', level: 1, start: 1, end: 90 }, { title: 'Danh sách học sinh', level: 2, start: 2, end: 40 }, { title: 'Thu tiền', level: 2, start: 41, end: 90 }] });
  fs.writeFileSync(f, JSON.stringify(src));
  const r = run('check', dir);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /· \d+ mục \(0 chưa có chức năng\)/);
  src.docs[3].data = false;
  fs.writeFileSync(f, JSON.stringify(src));
  assert.match(run('check', dir).stdout, /mục D4:2-40 Danh sách học sinh: chưa có chức năng/, 'đối chứng: không đánh dấu data thì vẫn chặn');
});

test('kiểm kê: chưa chạy sources.py thì chỉ kiểm dữ liệu, nói rõ', t => {
  const dir = tmp(t, 'map-nosrc-');
  fs.mkdirSync(path.join(dir, 'map'));
  fs.writeFileSync(path.join(dir, 'map', 'features.js'), `window.FEATURES = ${JSON.stringify(example().F)};`);
  const r = run('check', dir);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /chưa có map\/sources\.json/);
});

test('merge: gộp map/parts/*.js thành features.js, mã F-01… theo thứ tự phần, mỗi chức năng một dòng; đã có layout.js thì không gộp', t => {
  const dir = tmp(t, 'map-merge-');
  fs.mkdirSync(path.join(dir, 'map', 'parts'), { recursive: true });
  const f = (name, extra = {}) => ({ name, src: ['UC-01'], roles: ['le-tan'], freq: 'ngay', evidence: 'ro', status: 'pham-vi', spec: 'Mô tả.', ...extra });
  fs.writeFileSync(path.join(dir, 'map', 'parts', 'b-thu-tien.js'), `window.PART = ${JSON.stringify({ module: 'thu-tien', features: [f('Thu tiền')], skip: [{ src: 'D2:1-4', why: 'Giới thiệu' }] })};`);
  fs.writeFileSync(path.join(dir, 'map', 'parts', 'a-lich-hen.js'), `window.PART = ${JSON.stringify({ module: 'lich-hen', features: [f('Đặt lịch hẹn'), f('Dời lịch hẹn', { states: ['trang_thai_hen.da_doi'] })] })};`);
  const r = run('merge', dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /3 chức năng từ 2 phần/);
  const txt = fs.readFileSync(path.join(dir, 'map', 'features.js'), 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(txt, ctx);
  const F = JSON.parse(JSON.stringify(ctx.window.FEATURES));   // mảng của vm khác realm: deepEqual không so được trực tiếp
  assert.deepEqual(F.features.map(x => `${x.id} ${x.module} ${x.name}`), ['F-01 lich-hen Đặt lịch hẹn', 'F-02 lich-hen Dời lịch hẹn', 'F-03 thu-tien Thu tiền']);
  assert.deepEqual(F.skip, [{ src: 'D2:1-4', why: 'Giới thiệu' }]);
  assert.equal(txt.split('\n').filter(l => /^\s*\{ id: 'F-\d+'/.test(l)).length, 3);
  assert.equal(run('check', dir).status, 0);
  fs.writeFileSync(path.join(dir, 'map', 'layout.js'), 'window.LAYOUT = {};');
  assert.equal(run('merge', dir).status, 2);
});

test('merge: phần chỉ có skip (parts/_chung.js) gộp được; in cặp nghi trùng giữa các phần và dặn Read features.js trước khi Edit', t => {
  // Đo rml1, rml2 (06/10): 3 và 6 cặp trùng giữa worker phải dò bằng grep; Edit features.js bị từ chối vì file do merge ghi chưa được Read
  const dir = tmp(t, 'map-merge-dup-');
  fs.mkdirSync(path.join(dir, 'map', 'parts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'map', 'ids.json'), JSON.stringify({ systems: {}, ids: { 'M-01': { def: 'D2:3', priority: 'Must' }, 'UC-06': { def: 'D1:9' }, 'NF-05': { def: 'D3:4' } } }));
  const f = (name, src, roles) => ({ name, src, roles, freq: 'tuan', evidence: 'ro', status: 'pham-vi', spec: 'Mô tả.' });
  const part = (file, o) => fs.writeFileSync(path.join(dir, 'map', 'parts', file), `window.PART = ${JSON.stringify(o)};`);
  part('_chung.js', { features: [], skip: [{ src: 'D1:1-8', why: 'Tóm tắt, mục lục' }] });
  part('goi.js', { module: 'goi', features: [
    f('Xem buổi học sắp tới', ['UC-06', 'M-01'], ['phu-huynh']),
    f('Chọn con đang xem', ['M-01'], ['phu-huynh']),
    f('Xem gói học còn lại', ['M-01'], ['phu-huynh']),
  ] });
  part('hoc-vien.js', { module: 'hoc-vien', features: [
    f('Chọn con đang xem trên app', ['BR-HV-03', 'M-01'], ['phu-huynh']),
    f('Đăng nhập app bằng mã OTP', ['NF-05'], ['phu-huynh']),
  ] });
  part('lich.js', { module: 'lich', features: [
    f('Xem lịch học của con', ['UC-06'], ['phu-huynh']),
    f('Xem lịch dạy', ['M-01'], ['hlv']),
  ] });
  part('quan-tri.js', { module: 'quan-tri', features: [f('Đăng nhập app phụ huynh bằng OTP', ['NF-05'], ['phu-huynh'])] });
  const r = run('merge', dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /8 chức năng từ 5 phần.* 1 mục skip/);
  const sus = r.stdout.slice(r.stdout.indexOf('Nghi trùng'));
  assert.match(sus, /^Nghi trùng giữa các phần \(3\)/m);
  assert.match(sus, /F-01 "Xem buổi học sắp tới" \(goi\) ↔ F-06 "Xem lịch học của con" \(lich\): chung UC-06/, 'chung mã, chung vai, cùng động từ');
  assert.match(sus, /F-02 "Chọn con đang xem" \(goi\) ↔ F-04 "Chọn con đang xem trên app" \(hoc-vien\): tên này là phần đầu của tên kia/);
  assert.match(sus, /F-05 "Đăng nhập app bằng mã OTP" \(hoc-vien\) ↔ F-08 "Đăng nhập app phụ huynh bằng OTP" \(quan-tri\): chung NF-05/);
  assert.doesNotMatch(sus, /F-03|F-07/, 'chung mỗi mã Must, hay khác vai: không nghi');
  assert.match(r.stdout, /Read map\/features\.js trước khi Edit/);
});

test('merge: tên dự án lấy từ project của một phần (parts/_chung.js), không ghi rỗng', t => {
  // Đo rlb1 (06/10): merge ghi project: '' nên agent phải Edit tay một lần
  const dir = tmp(t, 'map-merge-proj-');
  fs.mkdirSync(path.join(dir, 'map', 'parts'), { recursive: true });
  const part = (file, o) => fs.writeFileSync(path.join(dir, 'map', 'parts', file), `window.PART = ${JSON.stringify(o)};`);
  part('_chung.js', { project: 'Sóng Xanh', features: [], skip: [{ src: 'D1:1-8', why: 'Tóm tắt' }] });
  part('lich.js', { module: 'lich', features: [{ name: 'Xem lịch', src: ['UC-01'], roles: ['le-tan'], freq: 'ngay', evidence: 'ro', status: 'pham-vi', spec: 'Mô tả.' }] });
  assert.equal(run('merge', dir).status, 0);
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(dir, 'map', 'features.js'), 'utf8'), ctx);
  assert.equal(ctx.window.FEATURES.project, 'Sóng Xanh');
});
