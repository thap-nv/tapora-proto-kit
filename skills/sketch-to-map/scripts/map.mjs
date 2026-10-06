#!/usr/bin/env node
// Bản đồ chức năng và bố cục của sketch-to-map. Đọc <thư-mục-prototype>/map/features.js và map/layout.js.
//   node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype> [--brief] [--shots]
//       Kiểm dữ liệu, kiểm kê và chỉ số bố cục; sinh map/MAP.md; chép khung bấm thử (templates/map-shell.html) thành map/index.html;
//       ghi bản đủ ra map/check.json. Chưa có layout.js thì chỉ kiểm kê.
//       In: dòng kiểm kê, dòng bố cục, mục CHẶN (tối đa 40 dòng) rồi CẢNH BÁO (tối đa 15 dòng), dòng chỉ số bố cục, dòng tổng.
//       --brief: in trước mỗi chức năng một dòng theo module (mã, tần suất, vai, tên, suy, hoãn): đầu vào để viết layout.js ở M2.
//       --shots: khi không còn mục chặn, in khối "Trình ở cổng" (chức năng suy, ghi chú, module theo thứ tự dựng kèm số Must) rồi
//       chụp trang chủ của mỗi vai trên khung bấm thử ở 1440 (vai trên app thêm 390) vào map/_shots/
//       bằng run.mjs của sketch-to-site; in đường dẫn ảnh, ảnh nên mở (một ảnh) và lỗi của khung nếu có. Thoát 4 khi không có trình duyệt.
//   node map.mjs visible <thư-mục-prototype> [--treetest]  cây chỉ có nhãn theo từng menu, nút đánh số [A1.2], không có mã chức năng.
//       --treetest: không in cây; ghi bài soát nhãn map/treetest.md (hướng dẫn người thử, cây, việc bấm thử; không có đáp án) và in
//       đáp án mỗi việc một dòng (T1 · vai → nhãn của chức năng). Thoát 2 khi layout.js chưa có tasks.
//   node map.mjs merge <thư-mục-prototype>  gộp phần của worker (map/parts/*.js, cả phần chỉ có skip) thành map/features.js; in cặp
//       nghi trùng giữa các phần. Thoát 2 khi đã có layout.js hay không đọc được một phần.
//   node map.mjs slice <thư-mục-prototype> <màn>  một màn cho B3 của sketch-to-site: chức năng kèm spec, tầng, kiểu mở, lối tắt đi và tới
//   node map.mjs coverage <thư-mục-prototype> [--site site]  độ phủ trên trang đã dựng (B4; qa-check.py tự gọi khi có map/features.js):
//       mỗi màn đã có file phải gắn data-feature cho chức năng đặt trên nó và lối tắt đi từ nó; in một dòng Độ phủ, mục THIẾU, MÃ LẠ
// Thoát 0 khi không có mục chặn, 1 khi có, 2 khi sai tham số hay không đọc được dữ liệu.
// Chỉ số bố cục và lý do của từng ngưỡng: references/m2-bo-cuc.md. Số bước tính từ trang chủ của vai: bấm menu, bấm một dòng
// sang màn con, bấm lối tắt, bấm mở chức năng đều là một bước; T3 (menu …) và T4 (trên dòng) thêm một bước; tab không phải tab đầu
// thêm một bước. Thời gian ước theo KLM: 2,7 giây mỗi bước, 3 giây mỗi lần gõ tìm để chọn một bản ghi (màn có pick).
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync, rmSync, mkdtempSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHELL = join(HERE, '..', 'templates', 'map-shell.html');
const RUN = join(HERE, '..', '..', 'sketch-to-site', 'templates', 'qa-kit', 'run.mjs');

const MAX = 15;
const STEP_S = 2.7, PICK_S = 3;
const FREQ = { ngay: 'ngày', tuan: 'tuần', hiem: 'hiếm' };
const MO = ['tai-cho', 'ngan-truot', 'hop-thoai', 'sheet', 'trang'];
const SHORT_MO = ['ngan-truot', 'hop-thoai', 'sheet', 'trang'];
const LIMIT = { t1Steps: 3, perScreen: 6, tabs: 5, group: 7, appTabs: 5, t2: 5 };
const CODE = /\b[A-Z]{1,4}-\d+/;
const norm = s => String(s).normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toLowerCase();
const RELEASE = [/(^|[^a-z])(gd|giai doan|dot|phase|release|sprint|v)\s*\d/, /(^|[^a-z])(sap ra mat|sap co|coming soon|mvp|ban sau|tuong lai)([^a-z]|$)/, /(^|[^a-z])(giai doan|dot|phien ban|gd) (sau|tiep|toi|moi)([^a-z]|$)/];
const num = x => String(Math.round(x * 10) / 10).replace('.', ',');

const usage = () => {
  console.error('Cách dùng: node map.mjs check <thư-mục-prototype> [--brief] [--shots] · visible <thư-mục-prototype> [--treetest] · slice <thư-mục-prototype> <màn>'
    + ' · coverage <thư-mục-prototype> [--site site]');
  process.exit(2);
};
const argv = process.argv.slice(2);
const si = argv.indexOf('--site');
const siteName = si >= 0 ? argv.splice(si, 2)[1] || 'site' : 'site';
const flags = new Set(argv.filter(a => a.startsWith('--')));
const [cmd, protoArg, ...rest] = argv.filter(a => !a.startsWith('--'));
if (!['check', 'visible', 'slice', 'coverage', 'merge'].includes(cmd) || !protoArg) usage();
const proto = resolve(protoArg);
const mapDir = join(proto, 'map');

function loadJs(file, key, required) {
  const p = join(mapDir, file);
  if (!existsSync(p)) {
    if (!required) return null;
    console.error(`Không thấy map/${file} trong ${proto.replace(/\\/g, '/')}.`);
    process.exit(2);
  }
  try {
    const ctx = {};
    ctx.window = ctx;
    vm.runInNewContext(readFileSync(p, 'utf8'), ctx);
    if (!ctx[key]) throw new Error(`không có window.${key}`);
    return JSON.parse(JSON.stringify(ctx[key]));
  } catch (e) {
    console.error(`Không đọc được map/${file}: ${e.message}`);
    process.exit(2);
  }
}
// merge dựng features.js từ map/parts/: chưa cần features.js, không đọc layout.js
const F = cmd === 'merge' ? { features: [] } : loadJs('features.js', 'FEATURES', true);
const L = cmd === 'merge' ? null : loadJs('layout.js', 'LAYOUT', cmd !== 'check');
const features = Array.isArray(F.features) ? F.features : [];
const fById = new Map(features.map(f => [f.id, f]));
const fname = id => (fById.get(id) || {}).name || id;
const arr = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
// Nguồn của sources.py (M0); chưa chạy thì kiểm kê chỉ kiểm dữ liệu
const readJson = f => { try { return JSON.parse(readFileSync(join(mapDir, f), 'utf8')); } catch { return null; } };
const SRC = readJson('sources.json'), IDS = readJson('ids.json'), STATES = readJson('states.json');

// ---------- Dữ liệu ----------
const block = [], warn = [];
const B = (metric, msg) => block.push({ metric, msg });
const W = (metric, msg) => warn.push({ metric, msg });

function checkFeatures() {
  if (!Array.isArray(F.features)) return B('du-lieu', 'features.js: thiếu mảng features');
  const seen = new Set();
  for (const f of features) {
    const id = f.id || '(không mã)';
    if (!/^F-\d+$/.test(f.id || '')) B('du-lieu', `${id}: mã chức năng phải dạng F-01`);
    if (seen.has(f.id)) B('du-lieu', `${id}: mã trùng`);
    seen.add(f.id);
    if (!f.name) B('du-lieu', `${id}: thiếu name`);
    if (!f.module) B('du-lieu', `${id}: thiếu module`);
    if (!Array.isArray(f.roles)) B('du-lieu', `${id}: roles phải là mảng mã vai`);
    if (!FREQ[f.freq]) B('du-lieu', `${id}: freq "${f.freq}" phải là ngay · tuan · hiem`);
    if (!['ro', 'suy'].includes(f.evidence)) B('du-lieu', `${id}: evidence "${f.evidence}" phải là ro · suy`);
    if (!['pham-vi', 'hoan'].includes(f.status)) B('du-lieu', `${id}: status "${f.status}" phải là pham-vi · hoan`);
    if (!arr(f.src).length) B('du-lieu', `${id}: thiếu src (mã gốc hay dải dòng của tài liệu)`);
    if (f.states !== undefined && !(Array.isArray(f.states) && f.states.every(s => /^[\w.]+$/.test(s)))) B('du-lieu', `${id}: states phải là mảng "enum" hay "enum.giá_trị"`);
  }
}

// ---------- Kiểm kê (M1): đối chiếu features.js với nguồn của sources.py ----------
// Chặn: UC chưa bị loại, mã Must, bước chuyển trạng thái của schema, nhóm trạng thái có bảng dùng, mục cấp 2–3 của tài liệu
// (trừ Quy ước, dbml, json) không có chức năng trỏ tới và không nằm trong skip. src trỏ tới mã khi ghi đúng mã, hay ghi dải dòng
// "D2:120-140" trùm chỗ định nghĩa của mã. Cảnh báo: mã lạ trong src, hai chức năng cùng việc (động từ đồng nghĩa, cùng đối tượng;
// hay tên này là phần đầu của tên kia, chung vai).
const SYN = [['thêm', 'tạo', 'lập'], ['đổi', 'dời', 'chuyển'], ['huỷ', 'hủy', 'xoá', 'xóa', 'gỡ'], ['sửa', 'chỉnh sửa', 'cập nhật'],
  ['bảo lưu', 'tạm dừng', 'tạm ngưng'], ['xem', 'tra cứu'], ['gửi', 'nhắn']];
// Tên này là phần đầu của tên kia sau khi bỏ từ nối ("Chọn con đang xem" · "Chọn con đang xem trên app"), chung một vai.
// Đo rml2 (06/10): 5 trong 6 cặp trùng giữa worker có dạng này; trên 8 bản kiểm kê đã đo không báo nhầm cặp nào.
// Từ nối bỏ khi còn dấu: bỏ dấu trước thì "chờ" thành "cho"
const STOP = new Set(['các', 'của', 'trên', 'cho', 'và', 'bằng', 'sang', 'một', 'những', 'đã', 'được', 'khi', 'theo', 'tại', 'trong', 'với']);
const words = name => String(name || '').toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(w => w && !STOP.has(w)).map(norm).filter(w => w.length > 1);
const prefixOf = (a, b) => { const [s, l] = a.length <= b.length ? [a, b] : [b, a]; return s.length >= 3 && l.length - s.length <= 3 && s.every((w, i) => l[i] === w); };
const shareRole = (a, b) => (arr(a.roles).length || arr(b.roles).length ? arr(a.roles).some(r => arr(b.roles).includes(r)) : true);
const verbOf = name => { const s = String(name || '').toLowerCase().normalize('NFC'); for (let g = 0; g < SYN.length; g++) for (const v of SYN[g]) if (s.startsWith(v + ' ')) return `g${g}`; return s.split(/\s+/)[0]; };
const INV = {};
function inventory() {
  if (!SRC || !IDS) return;
  const ids = IDS.ids || {};
  const at = s => { const m = /^(D\d+):(\d+)(?:-(\d+))?$/.exec(String(s).trim()); return m ? { doc: m[1], a: +m[2], b: +(m[3] || m[2]) } : null; };
  const defOf = id => (ids[id] && ids[id].def ? at(ids[id].def) : null);
  // Mỗi tham chiếu: { id } hay { doc, a, b } (dải dòng; mã thì là chỗ định nghĩa của mã)
  const refsOf = list => arr(list).map(s => at(s) || { id: String(s).trim().split(/\s+/)[0], ...(defOf(String(s).trim().split(/\s+/)[0]) || {}) });
  const fRefs = features.flatMap(f => refsOf(f.src).map(r => ({ ...r, f })));
  const sRefs = arr(F.skip).flatMap(x => refsOf(x.src));
  const hits = (refs, id) => { const d = defOf(id); return refs.some(r => r.id === id || (d && !r.id && r.doc === d.doc && r.a <= d.a && d.a <= r.b)); };
  const need = (label, list) => {
    const miss = list.filter(id => !hits(fRefs, id) && !hits(sRefs, id));
    for (const id of miss) B('kiem-ke', `${label}${id} (${ids[id].def || 'không thấy chỗ định nghĩa'}) chưa có chức năng nào trỏ tới: thêm chức năng (hoãn nếu ngoài đợt này), hay ghi vào skip kèm lý do`);
    return miss.length;
  };
  const ucs = Object.keys(ids).filter(id => /^UC-/.test(id) && ids[id].def && !ids[id].dropped);
  const musts = Object.keys(ids).filter(id => ids[id].priority === 'Must' && !ids[id].dropped);
  INV.uc = [ucs.length, need('', ucs)];
  INV.must = [musts.length, need('Must ', musts)];
  const st = new Set(features.flatMap(f => arr(f.states)));
  const tr = arr((STATES || {}).transitions);
  const trMiss = tr.filter(x => !st.has(`${x.enum}.${x.to}`));
  for (const x of trMiss) B('kiem-ke', `bước chuyển ${x.enum}: ${x.from} → ${x.to} (${x.src}) chưa có chức năng nào đưa tới: ghi states: ['${x.enum}.${x.to}'] vào chức năng làm bước đó, chưa có thì thêm`);
  INV.tr = [tr.length, trMiss.length];
  // Nhóm trạng thái: enum có bảng dùng, tên là trạng thái (trang_thai…, tinh_trang…, status, state) hay có bước chuyển.
  // Enum phân loại (cap_do, vai_tro) không bắt: đo trên r7-map, bắt cả hai chỉ thêm việc ghi mà không bắt được gì
  const trEnums = new Set(arr((STATES || {}).transitions).map(x => x.enum));
  const enums = Object.entries((STATES || {}).enums || {}).filter(([n, e]) => arr(e.used_by).length && (/trang_thai|tinh_trang|status|state/i.test(n) || trEnums.has(n)));
  const enMiss = enums.filter(([n]) => ![...st].some(s => s === n || s.startsWith(n + '.')));
  for (const [n, e] of enMiss) B('kiem-ke', `nhóm trạng thái ${n} (${arr(e.used_by).join(', ')}) chưa có chức năng nào hiện hay đổi: ghi states: ['${n}'] vào chức năng hiện trạng thái đó`);
  INV.en = [enums.length, enMiss.length];
  // Mục cấp 2–3 của tài liệu: có chức năng trỏ vào trong dải của mục, hay skip trùm mục
  let nSec = 0, secMiss = 0;
  const inSec = (refs, doc, s) => refs.some(r => r.doc === doc && r.a <= s.end && r.b >= s.start);
  const droppedAt = new Set(Object.values(ids).filter(x => x.dropped && x.def).map(x => x.def));
  for (const d of arr(SRC.docs)) {
    if (/^(dbml|json)$/.test(d.kind)) continue;
    const conv = new Set(arr(d.conventions).map(c => c.start));
    for (const s of arr(d.toc)) {
      // Bỏ qua: cấp 1 (tên tài liệu), Quy ước, mục định nghĩa một mục bị loại
      if (s.level < 2 || s.level > 3 || conv.has(s.start) || /quy ước|thuật ngữ|chú giải/i.test(s.title) || droppedAt.has(`${d.id}:${s.start}`)) continue;
      nSec++;
      if (inSec(fRefs, d.id, s) || inSec(sRefs, d.id, s)) continue;
      secMiss++;
      B('kiem-ke', `mục ${d.id}:${s.start}-${s.end} ${s.title}: chưa có chức năng trỏ tới, cũng không có trong skip (ghi { src: '${d.id}:${s.start}-${s.end}', why: '…' } nếu mục không sinh việc)`);
    }
  }
  INV.sec = [nSec, secMiss];
  for (const r of fRefs) if (r.id && !ids[r.id] && !/^D\d+:/.test(r.id)) W('kiem-ke', `${r.f.id}: nguồn "${r.id}" không có trong ids.json (gõ sai, hay mã của tài liệu khác)`);
  // Hai chức năng cùng việc
  const key = f => { const n = String(f.name || '').toLowerCase().normalize('NFC'); for (let g = 0; g < SYN.length; g++) for (const v of [...SYN[g]].sort((a, b) => b.length - a.length)) if (n.startsWith(v + ' ')) return `${g}|${n.slice(v.length).trim()}`; return `=|${n}`; };
  const seen = new Map(), warned = new Set();
  for (const f of features) {
    const k = key(f);
    if (seen.has(k)) { W('kiem-ke', `${seen.get(k).id} "${seen.get(k).name}" và ${f.id} "${f.name}" có vẻ cùng một việc: gộp, hay đặt tên phân biệt`); warned.add(`${seen.get(k).id}|${f.id}`); }
    else seen.set(k, f);
  }
  const ws = features.map(f => words(f.name));
  for (let i = 0; i < features.length; i++) for (let j = i + 1; j < features.length; j++) {
    const a = features[i], b = features[j];
    if (warned.has(`${a.id}|${b.id}`) || !shareRole(a, b) || !prefixOf(ws[i], ws[j])) continue;
    W('kiem-ke', `${a.id} "${a.name}" và ${b.id} "${b.name}" có vẻ cùng một việc (tên này là phần đầu của tên kia): gộp, hay đặt tên phân biệt`);
  }
}
const sourcesLine = () => (!SRC || !IDS ? 'Nguồn: chưa có map/sources.json, map/ids.json (chạy sources.py ở M0): chỉ kiểm dữ liệu'
  : `Nguồn: ${arr(SRC.docs).length} tài liệu · ${INV.uc[0]} UC (${INV.uc[1]} thiếu) · ${INV.must[0]} Must (${INV.must[1]} thiếu) · ${INV.tr[0]} bước chuyển (${INV.tr[1]} thiếu)`
    + ` · ${INV.en[0]} nhóm trạng thái (${INV.en[1]} thiếu) · ${INV.sec[0]} mục (${INV.sec[1]} chưa có chức năng)`);

let S, sById, rById, surfById, mById, places, menus, menuOf;
function index() {
  S = arr(L.screens);
  sById = new Map(S.map(s => [s.id, s]));
  rById = new Map(arr(L.roles).map(r => [r.id, r]));
  surfById = new Map(arr(L.surfaces).map(s => [s.id, s]));
  mById = new Map(arr(L.modules).map(m => [m.id, m]));
  places = new Map(Object.entries(L.place || {}).map(([k, v]) => [k, arr(v)]));
  menus = arr(L.nav);
  menuOf = new Map();
  for (const m of menus) for (const r of arr(m.roles)) { if (!menuOf.has(r)) menuOf.set(r, m); }
}
const parentsOf = s => arr(s.parent);
const screenFile = s => s.file || `${(surfById.get(s.surface) || {}).dir || s.surface}/${s.id}.html`;
const visibleTo = (s, r) => s && r && s.surface === r.surface && arr(s.roles).includes(r.id);

function checkLayout() {
  const dupe = (list, what) => { const seen = new Set(); for (const x of list) { if (seen.has(x.id)) B('du-lieu', `${what} ${x.id}: mã trùng`); seen.add(x.id); } };
  dupe(arr(L.surfaces), 'bề mặt'); dupe(arr(L.roles), 'vai'); dupe(arr(L.modules), 'module'); dupe(S, 'màn');
  for (const s of arr(L.surfaces)) if (!['web', 'app'].includes(s.kind)) B('du-lieu', `bề mặt ${s.id}: kind "${s.kind}" phải là web · app`);
  for (const r of arr(L.roles)) if (!surfById.has(r.surface)) B('du-lieu', `vai ${r.id}: bề mặt "${r.surface}" không có trong surfaces`);
  for (const m of arr(L.modules)) for (const d of arr(m.depends)) if (!mById.has(d)) B('du-lieu', `module ${m.id}: depends "${d}" không có trong modules`);
  // Phụ thuộc vòng
  const state = new Map();
  const visit = (id, trail) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { B('du-lieu', `module: phụ thuộc vòng ${[...trail.slice(trail.indexOf(id)), id].join(' → ')}`); return; }
    state.set(id, 1);
    for (const d of arr((mById.get(id) || {}).depends)) if (mById.has(d)) visit(d, [...trail, id]);
    state.set(id, 2);
  };
  for (const m of arr(L.modules)) visit(m.id, []);
  for (const f of features) {
    if (f.module && !mById.has(f.module)) B('du-lieu', `${f.id}: module "${f.module}" không có trong layout.js modules`);
    for (const r of arr(f.roles)) if (!rById.has(r)) B('du-lieu', `${f.id}: vai "${r}" không có trong layout.js roles`);
  }
  for (const s of S) {
    if (!surfById.has(s.surface)) B('du-lieu', `màn ${s.id}: bề mặt "${s.surface}" không có`);
    if (!mById.has(s.module)) B('du-lieu', `màn ${s.id}: module "${s.module}" không có`);
    for (const r of arr(s.roles)) {
      const role = rById.get(r);
      if (!role) B('du-lieu', `màn ${s.id}: vai "${r}" không có`);
      else if (role.surface !== s.surface) B('du-lieu', `màn ${s.id}: vai ${r} ở bề mặt ${role.surface}, màn ở ${s.surface}`);
    }
    for (const p of parentsOf(s)) if (!sById.has(p)) B('du-lieu', `màn ${s.id}: parent "${p}" không có`);
    for (const b of arr(s.bands)) for (const it of arr(b.items)) if (!fById.has(it)) B('du-lieu', `màn ${s.id}: dải "${b.name}" có "${it}" không phải mã chức năng`);
  }
  for (const m of menus) {
    for (const r of arr(m.roles)) if (!rById.has(r)) B('du-lieu', `menu: vai "${r}" không có`);
    for (const g of arr(m.groups)) for (const it of arr(g.items)) if (!sById.has(it)) B('du-lieu', `menu ${arr(m.roles).join(', ')}: "${it}" không phải mã màn`);
  }
  for (const r of arr(L.roles)) {
    const n = menus.filter(m => arr(m.roles).includes(r.id)).length;
    if (n === 0) B('du-lieu', `vai ${r.id}: không có trong menu nào của nav`);
    if (n > 1) B('du-lieu', `vai ${r.id}: có ở ${n} menu, mỗi vai một menu`);
  }
  for (const [id, ps] of places) {
    if (!fById.has(id)) { B('du-lieu', `place: "${id}" không có trong features.js`); continue; }
    for (const p of ps) {
      if (!sById.has(p.screen)) B('du-lieu', `${id}: màn "${p.screen}" không có trong screens`);
      if (![1, 2, 3, 4].includes(p.tier)) B('du-lieu', `${id}: tier "${p.tier}" phải là 1 · 2 · 3 · 4`);
      if (!MO.includes(p.mo)) B('du-lieu', `${id}: mo "${p.mo}" phải là ${MO.join(' · ')}`);
      const s = sById.get(p.screen);
      if (s && p.tab && !arr(s.tabs).includes(p.tab)) B('du-lieu', `${id}: tab "${p.tab}" không có trong tabs của màn ${s.id}`);
    }
  }
  for (const f of features) if (arr(f.roles).length && !places.has(f.id)) B('du-lieu', `${f.id} "${f.name}": chưa có chỗ đặt (place)`);
  for (const s of arr(L.shortcuts)) {
    if (!sById.has(s.from)) B('du-lieu', `lối tắt → ${s.to}: from "${s.from}" không có trong screens`);
    if (!fById.has(s.to)) B('du-lieu', `lối tắt ${s.from} → "${s.to}": không có trong features.js`);
    if (!SHORT_MO.includes(s.mo)) B('du-lieu', `lối tắt ${s.from} → ${s.to}: mo "${s.mo}" phải là ${SHORT_MO.join(' · ')}`);
  }
  for (const x of arr(L.flows)) {
    if (!rById.has(x.role)) B('du-lieu', `hành trình "${x.name}": vai "${x.role}" không có`);
    for (const st of arr(x.steps)) if (!fById.has(st)) B('du-lieu', `hành trình "${x.name}": "${st}" không có trong features.js`);
  }
  for (const x of arr(L.tasks)) {
    if (!rById.has(x.role)) B('du-lieu', `việc "${x.say}": vai "${x.role}" không có`);
    if (!fById.has(x.feature)) B('du-lieu', `việc "${x.say}": "${x.feature}" không có trong features.js`);
  }
}

// ---------- Số bước ----------
// Khoảng cách từ trang chủ của vai tới mỗi màn: { steps, picks, prev } theo thứ tự (bước, lần tìm)
function distances(r) {
  const dist = new Map();
  const better = (a, b) => !b || a.steps < b.steps || (a.steps === b.steps && a.picks < b.picks);
  const home = sById.get(r.home);
  if (visibleTo(home, r)) dist.set(home.id, { steps: 0, picks: 0, prev: null });
  for (const s of S) if (s.entry && visibleTo(s, r) && !dist.has(s.id)) dist.set(s.id, { steps: 0, picks: 0, prev: null });
  const nav = arr((menuOf.get(r.id) || {}).groups).flatMap(g => arr(g.items));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, d] of [...dist]) {
      const next = [];
      for (const n of nav) next.push([n, 0]);
      for (const c of S) if (parentsOf(c).includes(id)) next.push([c.id, c.pick ? 1 : 0]);
      for (const sc of arr(L.shortcuts)) if (sc.from === id && sc.mo === 'trang') for (const p of places.get(sc.to) || []) next.push([p.screen, 0]);
      for (const [to, pk] of next) {
        if (!visibleTo(sById.get(to), r)) continue;
        const cand = { steps: d.steps + 1, picks: d.picks + pk, prev: id };
        if (better(cand, dist.get(to))) { dist.set(to, cand); changed = true; }
      }
    }
  }
  return dist;
}
const pathTo = (dist, id) => { const out = []; for (let x = id; x; x = dist.get(x).prev) out.unshift(x); return out; };
const distCache = new Map();
const distOf = r => { if (!distCache.has(r.id)) distCache.set(r.id, distances(r)); return distCache.get(r.id); };

// Cách rẻ nhất để vai r mở chức năng f: { steps, picks, path, via } hay null
function cost(r, fid) {
  const dist = distOf(r);
  let best = null;
  const offer = c => { if (!best || c.steps < best.steps || (c.steps === best.steps && c.picks < best.picks)) best = c; };
  for (const p of places.get(fid) || []) {
    const s = sById.get(p.screen);
    const d = dist.get(p.screen);
    if (!d || !visibleTo(s, r)) continue;
    const extra = (p.mo === 'trang' ? 0 : 1) + (p.tier >= 3 ? 1 : 0) + (p.tab && arr(s.tabs).indexOf(p.tab) > 0 ? 1 : 0);
    offer({ steps: d.steps + extra, picks: d.picks, path: pathTo(dist, p.screen), via: p.mo === 'trang' ? '' : 'mở', place: p });
  }
  for (const sc of arr(L.shortcuts)) {
    if (sc.to !== fid) continue;
    const d = dist.get(sc.from);
    if (!d) continue;
    offer({ steps: d.steps + 1, picks: d.picks, path: pathTo(dist, sc.from), via: `lối tắt (${sc.mo})` });
  }
  return best;
}
const secs = c => num(c.steps * STEP_S + c.picks * PICK_S);
const showPath = c => [...c.path, ...(c.via ? [c.via] : [])].join(' → ');

// ---------- Chỉ số bố cục ----------
const M = {};
function metrics() {
  const roles = arr(L.roles);
  // (1) Lối tắt đá đi không đường về
  M.m1 = 0;
  for (const sc of arr(L.shortcuts)) if (sc.mo === 'trang' && !String(sc.ve || '').trim()) {
    M.m1++;
    B(1, `lối tắt ${sc.from} → ${sc.to} "${fname(sc.to)}" mở trang khác mà không khai ve: mở trên ${sc.from} (hop-thoai · ngan-truot · sheet), hay khai ve (Quay lại giữ trạng thái, xong tự về)`);
  }
  for (const s of S) for (const b of arr(s.bands)) for (const it of arr(b.items)) {
    const onHome = (places.get(it) || []).some(p => p.screen === s.id);
    const sc = arr(L.shortcuts).some(x => x.from === s.id && x.to === it);
    if (!onHome && !sc) { M.m1++; B(1, `${s.id} → ${it} "${fname(it)}": mục ở dải "${b.name}" không đặt trên ${s.id} và không có lối tắt, bấm là đá sang màn khác: khai shortcuts { from: '${s.id}', to: '${it}', mo }`); }
  }
  // (12) Trang chủ theo vai, menu không theo đợt phát hành
  M.m12 = { noHome: 0, release: 0 };
  for (const r of roles) {
    const h = sById.get(r.home);
    if (!r.home || !h) { M.m12.noHome++; B(12, `vai ${r.id} (${r.name}): chưa có trang chủ (home) theo việc của vai`); continue; }
    if (!visibleTo(h, r)) { M.m12.noHome++; B(12, `vai ${r.id}: trang chủ ${h.id} không thuộc bề mặt hay không mở cho vai này`); continue; }
    const items = arr(h.bands).flatMap(b => arr(b.items));
    if (!items.length) { M.m12.noHome++; B(12, `vai ${r.id}: trang chủ ${h.id} chưa có dải việc (bands): 3–5 việc chính và mục cần xử lý hôm nay`); continue; }
    if (!items.some(it => arr((fById.get(it) || {}).roles).includes(r.id))) W(12, `vai ${r.id}: dải trên trang chủ ${h.id} không có việc nào của vai này`);
  }
  for (const m of menus) for (const g of arr(m.groups)) {
    if (g.name && RELEASE.some(re => re.test(norm(g.name)))) { M.m12.release++; B(12, `menu ${arr(m.roles).join(', ')}: nhóm "${g.name}" đặt theo đợt phát hành; nhóm theo việc, mục hoãn nằm trong nhóm của việc đó và gắn nhãn`); }
    const its = arr(g.items).map(id => sById.get(id)).filter(Boolean);
    const allDeferred = its.length > 1 && its.every(s => { const fs = featuresOn(s.id); return fs.length && fs.every(f => f.status === 'hoan'); });
    if (allDeferred) W(12, `menu ${arr(m.roles).join(', ')}: nhóm "${g.name}" chỉ có màn hoãn: kiểm có phải nhóm theo đợt phát hành không`);
  }
  // (7) Mã tham chiếu trên nhãn
  M.m7 = 0;
  const label = (where, text) => { if (text && CODE.test(text)) { M.m7++; B(7, `${where}: "${text}" lộ mã tham chiếu`); } };
  for (const f of features) label(`${f.id} name`, f.name);
  for (const s of S) {
    label(`màn ${s.id}`, s.name);
    for (const z of arr(s.zones)) label(`màn ${s.id} vùng`, z);
    for (const tb of arr(s.tabs)) label(`màn ${s.id} tab`, tb);
    for (const b of arr(s.bands)) label(`màn ${s.id} dải`, b.name);
  }
  for (const m of menus) for (const g of arr(m.groups)) label(`menu ${arr(m.roles).join(', ')} nhóm`, g.name);
  for (const sc of arr(L.shortcuts)) label(`lối tắt ${sc.from} → ${sc.to}`, sc.label);
  // (2) Số bước tới việc T1 (chặn) và việc hằng ngày (cảnh báo)
  M.m2 = { t1: null, daily: null };
  const worse = (cur, c, f, r) => (!cur || c.steps > cur.steps || (c.steps === cur.steps && c.picks > cur.picks) ? { ...c, f: f.id, r: r.id } : cur);
  for (const f of features) for (const rid of arr(f.roles)) {
    const r = rById.get(rid);
    if (!r) continue;
    const ps = (places.get(f.id) || []).filter(p => (sById.get(p.screen) || {}).surface === r.surface);
    const c = cost(r, f.id);
    const isT1 = ps.some(p => p.tier === 1);
    if (!c) {
      if (!places.has(f.id)) continue;   // đã báo ở dữ liệu
      const why = ps.length ? `chỗ đặt (${ps.map(p => p.screen).join(', ')}) không mở cho vai hay không có lối vào` : `không có chỗ đặt trên bề mặt ${r.surface}`;
      if (isT1) B(2, `${f.id} "${f.name}" (T1) · vai ${rid}: không tới được: ${why}`);
      else if (f.status === 'hoan') W('toi', `${f.id} "${f.name}" (hoãn) · vai ${rid}: không tới được: ${why}`);
      else B('toi', `${f.id} "${f.name}" · vai ${rid}: không tới được: ${why}`);
      continue;
    }
    if (isT1) {
      M.m2.t1 = worse(M.m2.t1, c, f, r);
      if (c.steps > LIMIT.t1Steps) B(2, `${f.id} "${f.name}" (T1) · vai ${rid}: ${c.steps} bước, ≈ ${secs(c)} giây: ${showPath(c)} (ngưỡng ${LIMIT.t1Steps})`);
    }
    if (f.freq === 'ngay') {
      M.m2.daily = worse(M.m2.daily, c, f, r);
      if (!isT1 && c.steps > LIMIT.t1Steps) W(2, `${f.id} "${f.name}" (hằng ngày) · vai ${rid}: ${c.steps} bước, ≈ ${secs(c)} giây: ${showPath(c)}`);
    }
  }
  // (3) Một hành động chính mỗi màn · (4) lựa chọn nhìn thấy · (5) chức năng và tab mỗi màn
  M.m5 = null;
  for (const s of S) {
    const ps = [...places].flatMap(([id, list]) => list.filter(p => p.screen === s.id).map(p => ({ id, ...p })));
    const t1 = ps.filter(p => p.tier === 1), t2 = ps.filter(p => p.tier === 2);
    if (t1.length > 1) W(3, `màn ${s.id} "${s.name}": ${t1.length} việc T1 (${t1.map(p => p.id).join(', ')}): một màn một hành động chính`);
    if (t2.length > LIMIT.t2) W(4, `màn ${s.id} "${s.name}": ${t2.length} việc T2 nhìn thấy cùng lúc (ngưỡng ${LIMIT.t2}): đẩy bớt xuống T3, T4`);
    const nT = arr(s.tabs).length;
    if (!M.m5 || ps.length > M.m5.n || (ps.length === M.m5.n && nT > M.m5.tabs)) M.m5 = { screen: s.id, n: ps.length, tabs: nT };
    if (ps.length > LIMIT.perScreen) W(5, `màn ${s.id} "${s.name}": ${ps.length} chức năng (ngưỡng ${LIMIT.perScreen}): tách màn hay đẩy xuống tầng dưới`);
    if (nT > LIMIT.tabs) W(5, `màn ${s.id} "${s.name}": ${nT} tab (ngưỡng ${LIMIT.tabs})`);
  }
  M.m4 = 0;
  for (const m of menus) {
    const who = arr(m.roles).join(', ');
    const surf = surfById.get((rById.get(arr(m.roles)[0]) || {}).surface) || {};
    const total = arr(m.groups).reduce((n, g) => n + arr(g.items).length, 0);
    for (const g of arr(m.groups)) {
      M.m4 = Math.max(M.m4, arr(g.items).length);
      if (surf.kind !== 'app' && arr(g.items).length > LIMIT.group) W(4, `menu ${who}: nhóm "${g.name}" ${arr(g.items).length} mục (ngưỡng ${LIMIT.group})`);
    }
    if (surf.kind === 'app' && total > LIMIT.appTabs) W(4, `menu ${who}: ${total} tab trên app (ngưỡng ${LIMIT.appTabs}): đưa việc phụ vào tab Tài khoản`);
    if (surf.kind !== 'app' && total >= 10 && arr(m.groups).filter(g => g.name).length < 3) W(4, `menu ${who}: ${total} mục cấp 1 mà chưa chia 3–6 nhóm có tên`);
  }
  // (6) Một việc một nhãn
  M.m6 = 0;
  const byLabel = new Map();
  for (const f of features) {
    const labels = [...new Set([f.name, ...arr(L.shortcuts).filter(s => s.to === f.id && s.label).map(s => s.label)])];
    if (labels.length > 1) { M.m6++; W(6, `${f.id} "${f.name}" mang ${labels.length} nhãn: ${labels.join(' · ')}: một việc một nhãn trên mọi màn`); }
    for (const l of labels) byLabel.set(norm(l), [...(byLabel.get(norm(l)) || []), f.id]);
  }
  for (const [l, ids] of byLabel) if (new Set(ids).size > 1) { M.m6++; W(6, `nhãn "${l}" dùng cho ${[...new Set(ids)].join(', ')}: hai việc khác nhau cần nhãn khác nhau`); }
  // Ctrl+K cho T3 trên web · kiểu mở hợp bề mặt
  for (const surf of arr(L.surfaces)) {
    if (surf.kind !== 'web' || surf.ctrlK) continue;
    const n = [...places.values()].flat().filter(p => p.tier === 3 && (sById.get(p.screen) || {}).surface === surf.id).length;
    if (n) W('ctrl-k', `bề mặt ${surf.id}: ${n} việc T3 mà chưa bật ctrlK (T3 luôn tìm được bằng Ctrl+K)`);
  }
  const kindOf = id => (surfById.get((sById.get(id) || {}).surface) || {}).kind;
  const moWarn = (where, screen, mo) => {
    if (kindOf(screen) === 'app' && (mo === 'ngan-truot' || mo === 'hop-thoai')) W('mo', `${where}: "${mo}" trên app: dùng sheet hay luồng toàn màn (trang)`);
    if (kindOf(screen) === 'web' && mo === 'sheet') W('mo', `${where}: "sheet" trên web: dùng ngan-truot hay hop-thoai`);
  };
  for (const [id, ps] of places) for (const p of ps) moWarn(`${id} ở ${p.screen}`, p.screen, p.mo);
  for (const sc of arr(L.shortcuts)) moWarn(`lối tắt ${sc.from} → ${sc.to}`, sc.from, sc.mo);
  // Hành trình và việc bấm thử
  for (const x of arr(L.flows)) {
    const r = rById.get(x.role);
    if (!r) continue;
    for (const st of arr(x.steps)) if (fById.has(st) && !cost(r, st)) B('hanh-trinh', `"${x.name}" (${x.role}): bước ${st} "${fname(st)}" vai không tới được`);
  }
  for (const r of roles) if (!arr(L.flows).some(x => x.role === r.id) && features.some(f => arr(f.roles).includes(r.id))) W('hanh-trinh', `vai ${r.id}: chưa có hành trình nào (1–3 mỗi vai)`);
  M.tasks = null;
  for (const x of arr(L.tasks)) {
    const r = rById.get(x.role);
    if (!r || !fById.has(x.feature)) continue;
    const c = cost(r, x.feature);
    if (!c) { B('viec', `việc "${x.say}" · vai ${x.role} → ${x.feature} "${fname(x.feature)}": vai không tới được`); continue; }
    if (!M.tasks || c.steps > M.tasks.steps) M.tasks = { ...c, f: x.feature, r: x.role };
  }
  const nTasks = arr(L.tasks).length;
  if (nTasks < 5 || nTasks > 10) W('viec', `${nTasks} việc bấm thử (cần 5–10 việc hằng ngày theo lời người dùng)`);
  // Màn không có lối vào
  for (const s of S) if (arr(s.roles).length && !arr(s.roles).some(rid => { const r = rById.get(rid); return r && distOf(r).has(s.id); })) W('toi', `màn ${s.id} "${s.name}": không vai nào tới được (không ở menu, không có parent, không có lối tắt mở trang)`);
}
function featuresOn(sid) { return [...places].filter(([, ps]) => ps.some(p => p.screen === sid)).map(([id]) => fById.get(id)).filter(Boolean); }

function metricLine() {
  const t1 = M.m2.t1, dl = M.m2.daily;
  const step = c => (c ? `${c.steps} bước (${c.f}, ${c.r}, ≈ ${secs(c)} giây)` : '—');
  return `Chỉ số bố cục: (1) lối tắt đá đi không đường về ${M.m1} · (12) vai thiếu trang chủ ${M.m12.noHome}, nhóm menu theo đợt ${M.m12.release} · (7) mã lộ ${M.m7}`
    + ` · (2) T1 xa nhất ${step(t1)}, việc hằng ngày xa nhất ${step(dl)}`
    + ` · (5) màn dày nhất ${M.m5 ? `${M.m5.screen} ${M.m5.n} chức năng, ${M.m5.tabs} tab` : '—'} · (4) nhóm menu dài nhất ${M.m4} · (6) việc mang nhiều nhãn ${M.m6}`;
}

// ---------- MAP.md ----------
const TIER = { 1: 'T1 chính', 2: 'T2 phụ', 3: 'T3 hiếm', 4: 'T4 ngữ cảnh' };
const MO_VI = { 'tai-cho': 'tại chỗ', 'ngan-truot': 'ngăn trượt', 'hop-thoai': 'hộp thoại', sheet: 'sheet', trang: 'trang' };
function navKind(m) {
  const surf = surfById.get((rById.get(arr(m.roles)[0]) || {}).surface) || {};
  const n = arr(m.groups).reduce((k, g) => k + arr(g.items).length, 0);
  if (surf.kind === 'app') return `${n} tab dưới`;
  return n <= 5 ? 'thanh trên' : n <= 9 ? 'sidebar phẳng' : 'sidebar có nhóm, tìm chung, Ctrl+K';
}
function mapMd() {
  const out = [];
  const roleName = id => (rById.get(id) || {}).name || id;
  const sName = id => (sById.get(id) || {}).name || id;
  out.push(`# Bản đồ chức năng${F.project ? ` · ${F.project}` : ''}`, '');
  out.push('> Sinh bởi `map.mjs check` từ `map/features.js` và `map/layout.js`. Không sửa tay: sửa hai file đó rồi chạy lại. Chi tiết từng chức năng (spec, nguồn) ở `features.js`.', '');
  out.push(metricLine(), '');
  out.push('## Vai, trang chủ và menu', '', '| Vai | Bề mặt | Trang chủ | Menu | Kiểu điều hướng |', '|---|---|---|---|---|');
  for (const r of arr(L.roles)) {
    const m = menuOf.get(r.id) || {};
    const menu = arr(m.groups).map(g => (g.name ? `*${g.name}:* ` : '') + arr(g.items).map(sName).join(' · ')).join(' · ');
    out.push(`| ${r.name} \`${r.id}\` | ${(surfById.get(r.surface) || {}).name || r.surface} | ${sName(r.home)} | ${menu} | ${m.groups ? navKind(m) : ''} |`);
  }
  out.push('');
  for (const surf of arr(L.surfaces)) {
    out.push(`## ${surf.name}`, '');
    for (const s of S.filter(x => x.surface === surf.id)) {
      const mod = mById.get(s.module) || {};
      out.push(`### ${s.name} · \`${s.id}\` · \`${screenFile(s)}\``, '');
      const meta = [`Vai: ${arr(s.roles).map(roleName).join(', ')}`, `module ${mod.name || s.module}`];
      if (parentsOf(s).length) meta.push(`vào từ ${parentsOf(s).map(sName).join(', ')}${s.pick ? ' (tìm và chọn một bản ghi)' : ''}`);
      if (s.entry) meta.push('màn vào (trước trang chủ)');
      if (arr(s.tabs).length) meta.push(`tab: ${s.tabs.join(' · ')}`);
      out.push(meta.join(' · '), '');
      for (const b of arr(s.bands)) out.push(`- Dải **${b.name}**: ${arr(b.items).map(fname).join(' · ')}`);
      if (arr(s.bands).length) out.push('');
      const ps = [...places].flatMap(([id, list]) => list.filter(p => p.screen === s.id).map(p => ({ id, ...p }))).sort((a, b) => a.tier - b.tier);
      if (ps.length) {
        out.push('| Chức năng | Tầng | Mở | Vùng · tab | Vai | Nguồn |', '|---|---|---|---|---|---|');
        for (const p of ps) {
          const f = fById.get(p.id) || {};
          const tags = [f.status === 'hoan' ? '**hoãn**' : '', f.evidence === 'suy' ? '*suy*' : ''].filter(Boolean).join(' ');
          out.push(`| ${f.name} \`${p.id}\`${tags ? ' ' + tags : ''} | ${TIER[p.tier] || p.tier} | ${MO_VI[p.mo] || p.mo} | ${[p.zone, p.tab ? `tab ${p.tab}` : ''].filter(Boolean).join(' · ')} | ${arr(f.roles).map(roleName).join(', ')} | ${arr(f.src).join(', ')} |`);
        }
        out.push('');
      }
      const scs = arr(L.shortcuts).filter(x => x.from === s.id);
      if (scs.length) out.push(`Lối tắt: ${scs.map(x => `${x.label || fname(x.to)} *(${MO_VI[x.mo] || x.mo}${x.ve ? `; về: ${x.ve}` : ''})*`).join(' · ')}`, '');
    }
  }
  out.push('## Hành trình theo vai', '');
  for (const x of arr(L.flows)) out.push(`- **${roleName(x.role)} · ${x.name}:** ${arr(x.steps).map(fname).join(' → ')}`);
  out.push('', '## Việc bấm thử ở Cổng Bản đồ', '', '| # | Vai | Việc | Chức năng | Số bước |', '|---|---|---|---|---|');
  arr(L.tasks).forEach((x, i) => {
    const r = rById.get(x.role);
    const c = r && fById.has(x.feature) ? cost(r, x.feature) : null;
    out.push(`| ${i + 1} | ${roleName(x.role)} | ${x.say} | ${fname(x.feature)} \`${x.feature}\` | ${c ? `${c.steps} · ≈ ${secs(c)} giây` : 'không tới được'} |`);
  });
  out.push('', '## Module và thứ tự dựng', '', '| Module | Phụ thuộc | Chức năng | Hoãn | Đợt |', '|---|---|---|---|---|');
  for (const m of topo()) {
    const fs = features.filter(f => f.module === m.id);
    out.push(`| ${m.name} \`${m.id}\` | ${arr(m.depends).join(', ') || '—'} | ${fs.length} | ${fs.filter(f => f.status === 'hoan').length} | ${m.dot || ''} |`);
  }
  const deferred = features.filter(f => f.status === 'hoan');
  out.push('', `## Hoãn (${deferred.length})`, '', 'Có chỗ trong bản đồ và trang chờ trên prototype; dựng ở đợt sau bằng `evolve-site`.', '');
  for (const f of deferred) out.push(`- ${f.name} \`${f.id}\` · ${(places.get(f.id) || []).map(p => sName(p.screen)).join(', ')}`);
  const inferred = features.filter(f => f.evidence === 'suy');
  if (inferred.length) {
    out.push('', `## Chức năng suy ra, người dùng xác nhận ở cổng (${inferred.length})`, '');
    for (const f of inferred) out.push(`- ${f.name} \`${f.id}\`: ${f.spec || ''}`);
  }
  const auto = features.filter(f => !arr(f.roles).length);
  if (auto.length) { out.push('', '## Hệ thống tự làm', ''); for (const f of auto) out.push(`- ${f.name} \`${f.id}\`: ${f.spec || ''}`); }
  return out.join('\n') + '\n';
}
function topo() {
  const done = new Set(), out = [];
  const go = m => { if (!m || done.has(m.id)) return; done.add(m.id); for (const d of arr(m.depends)) go(mById.get(d)); out.push(m); };
  for (const m of arr(L.modules)) go(m);
  return out;
}

// ---------- Lệnh ----------
function inventoryLine() {
  const n = k => features.filter(f => f.status === k).length;
  const roles = [...new Set(features.flatMap(f => arr(f.roles)))];
  const mods = [...new Set(features.map(f => f.module).filter(Boolean))];
  return `Kiểm kê: ${features.length} chức năng (${n('pham-vi')} phạm vi · ${n('hoan')} hoãn · ${features.filter(f => f.evidence === 'suy').length} suy) · ${mods.length} module · ${roles.length} vai`;
}
function brief() {
  const roles = [...new Set(features.flatMap(f => arr(f.roles)))];
  console.log(`Vai: ${roles.map(r => `${r} ${features.filter(f => arr(f.roles).includes(r)).length}`).join(' · ')}`);
  const mods = [...new Set(features.map(f => f.module))];
  for (const m of mods) {
    const fs = features.filter(f => f.module === m);
    console.log(`== ${m} (${fs.length})`);
    for (const f of fs) console.log(`${f.id} ${FREQ[f.freq] || f.freq} · ${arr(f.roles).join(',') || 'hệ thống'} · ${f.name}${f.evidence === 'suy' ? ' · suy' : ''}${f.status === 'hoan' ? ' · hoãn' : ''}`);
  }
}
// Mục chặn phải sửa hết trong một lượt nên in tới MAX_BLOCK dòng; cảnh báo tới MAX
const MAX_BLOCK = 40;
const listOut = (title, items, max = MAX) => {
  if (!items.length) return;
  console.log(`${title} (${items.length}):`);
  const tag = m => (typeof m === 'number' ? `[${m}]` : `[${{ 'du-lieu': 'dữ liệu', 'hanh-trinh': 'hành trình', viec: 'việc', toi: 'tới', 'ctrl-k': 'Ctrl+K', mo: 'kiểu mở', khung: 'khung' }[m] || m}]`);
  for (const x of items.slice(0, max)) console.log(`  ${tag(x.metric)} ${x.msg}`);
  if (items.length > max) console.log(`  … còn ${items.length - max}: đủ ở map/check.json`);
};
// Khối trình ở Cổng Bản đồ (lần check --shots sạch): chức năng suy, ghi chú, module theo thứ tự dựng.
// Mâu thuẫn là câu hỏi ở cổng nên in trước và đủ; chỉ câu hỏi mở bị cắt (đo rml1, rml2: 43 ghi chú, cắt ở 20 thì phải grep tìm mâu thuẫn)
const MAX_NOTES = 20;
function gateBlock() {
  const ids = (IDS && IDS.ids) || {};
  const isMust = f => arr(f.src).some(s => (ids[String(s).trim().split(/\s+/)[0]] || {}).priority === 'Must');
  const inferred = features.filter(f => f.evidence === 'suy');
  console.log('Trình ở cổng:');
  console.log(`  Chức năng suy (${inferred.length}): ${inferred.map(f => `${f.id} ${f.name}`).join(' · ') || 'không có'}`);
  const notes = features.filter(f => String(f.notes || '').trim());
  const conflicts = notes.filter(f => /mâu thuẫn/i.test(f.notes)), open = notes.filter(f => !/mâu thuẫn/i.test(f.notes));
  const line = (f, n) => `    ${f.id} ${f.name}: ${String(f.notes).replace(/\s+/g, ' ').slice(0, n)}`;
  console.log(`  Ghi chú (${notes.length}: ${conflicts.length} mâu thuẫn, ${open.length} câu hỏi mở):`);
  for (const f of conflicts) console.log(line(f, 320));
  const room = Math.max(0, MAX_NOTES - conflicts.length);
  for (const f of open.slice(0, room)) console.log(line(f, 220));
  if (open.length > room) console.log(`    … còn ${open.length - room} câu hỏi mở: xem map/features.js`);
  console.log(`  Module theo thứ tự dựng: ${topo().map(m => { const fs = features.filter(f => f.module === m.id); return `${m.name} (${fs.length} chức năng · ${fs.filter(isMust).length} Must · ${fs.filter(f => f.status === 'hoan').length} hoãn)`; }).join(' → ')}`);
}

function cmdCheck() {
  checkFeatures();
  if (!block.length) inventory();
  if (flags.has('--brief')) brief();
  console.log(inventoryLine());
  console.log(sourcesLine());
  if (!L) {
    console.log('Chưa có layout.js: chỉ kiểm kê. Viết map/layout.js ở M2 rồi chạy lại.');
  } else {
    index();
    checkLayout();
    // Dữ liệu sai thì chưa tính chỉ số: số bước trên dữ liệu lỗi dễ báo sai
    if (!block.length) metrics();
    console.log(`Bố cục: ${arr(L.surfaces).length} bề mặt · ${S.length} màn · ${arr(L.shortcuts).length} lối tắt · ${arr(L.flows).length} hành trình · ${arr(L.tasks).length} việc bấm thử`);
  }
  listOut('CHẶN', block, MAX_BLOCK);
  listOut('CẢNH BÁO', warn);
  let code = block.length ? 1 : 0;
  if (L && M.m1 !== undefined) {
    console.log(metricLine());
    writeFileSync(join(mapDir, 'MAP.md'), mapMd());
    copyFileSync(SHELL, join(mapDir, 'index.html'));
    console.log('MAP.md: map/MAP.md · khung bấm thử: map/index.html · đủ chi tiết: map/check.json');
    if (flags.has('--shots')) {
      if (block.length) console.log('Ảnh: chưa chụp, còn mục chặn.');
      else { gateBlock(); code = shots() || code; }
    }
  }
  writeFileSync(join(mapDir, 'check.json'), JSON.stringify({ block, warn, metrics: M }, null, 1));
  console.log(`→ ${block.length} chặn · ${warn.length} cảnh báo`);
  process.exit(code);
}

// Chụp trang chủ của mỗi vai trên khung bấm thử. Trả 4 khi không có trình duyệt
function shots() {
  const out = join(mapDir, '_shots');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), 'map-shots-'));
  const roles = arr(L.roles).filter(r => sById.has(r.home));
  const runs = [['1440', '900', '0', roles], ['390', '844', '1', roles.filter(r => (surfById.get(r.surface) || {}).kind === 'app')]];
  const files = [], problems = [];
  for (const [w, h, mobile, rs] of runs) {
    if (!rs.length) continue;
    const steps = rs.map(r => ({ name: r.id, js: `MAP_SHELL.setRole(${JSON.stringify(r.id)}); MAP_SHELL.go(${JSON.stringify(r.home)}, { keepFocus: true })`, shot: `${r.id}-${w}` }));
    const sf = join(tmp, `steps-${w}.json`);
    writeFileSync(sf, JSON.stringify({ steps }));
    const res = spawnSync(process.execPath, [RUN, join(mapDir, 'index.html'), sf, out, w, h, mobile], { encoding: 'utf8', timeout: 180000 });
    if (res.status === 4 || /Không tìm thấy Edge/.test(res.stdout + res.stderr)) { rmSync(tmp, { recursive: true, force: true }); console.log('Ảnh: không tìm thấy Edge hay Chrome để chụp.'); return 4; }
    let rep = [];
    try { rep = JSON.parse(res.stdout); } catch { problems.push(`run.mjs ${w}: ${(res.stderr || res.stdout).trim().split(/\r?\n/)[0]}`); }
    for (const st of rep) {
      for (const e of st.errors || []) problems.push(`${st.step} ${w}: ${e}`);
      const d = st.dims;
      if (d && d.sw > d.cw) problems.push(`${st.step} ${w}: tràn ngang ${d.sw - d.cw}px`);
      for (const c of (d && d.cut) || []) problems.push(`${st.step} ${w}: chữ bị cắt ${typeof c === 'string' ? c : JSON.stringify(c)}`);
    }
    for (const s of steps) if (existsSync(join(out, s.shot + '.png'))) files.push(`map/_shots/${s.shot}.png`);
  }
  rmSync(tmp, { recursive: true, force: true });
  // Ảnh nên mở: trang chủ của vai có nhiều việc hằng ngày nhất
  const busy = [...roles].sort((a, b) => features.filter(f => f.freq === 'ngay' && arr(f.roles).includes(b.id)).length - features.filter(f => f.freq === 'ngay' && arr(f.roles).includes(a.id)).length)[0];
  console.log(`Ảnh (${files.length}): ${files.join(' · ')}`);
  if (busy) console.log(`Mở một ảnh: ${proto.replace(/\\/g, '/')}/map/_shots/${busy.id}-1440.png (vai có nhiều việc hằng ngày nhất); ảnh còn lại để trình ở cổng`);
  for (const p of problems.slice(0, MAX)) console.log(`  Khung bấm thử: ${p}`);
  if (problems.length) W('khung', `khung bấm thử có ${problems.length} lỗi khi chụp (lỗi của khuôn map-shell.html, báo lại cho kit)`);
  return 0;
}

function cmdVisible() {
  index();
  const out = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const TIER_WORD = { 1: 'Nút chính: ', 2: 'Nút: ', 3: 'Menu …: ', 4: 'Trên dòng: ' };
  menus.forEach((m, mi) => {
    const roles = arr(m.roles).map(id => rById.get(id)).filter(Boolean);
    if (!roles.length) return;
    const surf = surfById.get(roles[0].surface) || {};
    out.push(`## ${surf.name || roles[0].surface} · vai ${roles.map(r => r.name).join(', ')}`);
    const canSee = s => s && roles.some(r => visibleTo(s, r));
    const canDo = f => f && arr(f.roles).some(r => roles.some(x => x.id === r));
    const tag = f => (f.status === 'hoan' ? ' (giai đoạn sau)' : '');
    const featLine = (p, f) => `${p.mo === 'trang' ? '' : TIER_WORD[p.tier] || ''}${f.name}${tag(f)}`;
    let top = 0;
    // Nhãn của một chức năng trên màn s: đặt trên màn thì theo tầng; có lối tắt thì "Nút:", mở trang thì kèm "→ màn đích"
    const itemLine = (s, fid) => {
      const f = fById.get(fid);
      const p = (places.get(fid) || []).find(x => x.screen === s.id);
      if (p) return featLine(p, f);
      const sc = arr(L.shortcuts).find(x => x.from === s.id && x.to === fid) || {};
      const dest = sc.mo === 'trang' ? arr(places.get(fid)).map(x => (sById.get(x.screen) || {}).name).filter(Boolean)[0] : '';
      return `Nút: ${sc.label || f.name}${tag(f)}${dest ? ` → ${dest}` : ''}`;
    };
    // Một màn và mọi thứ trên nó; first là dòng của chính màn (màn con: "(bấm một dòng) → tên")
    const node = (s, id, depth, seen, first = s.name) => {
      const pad = '  '.repeat(depth);
      out.push(`${pad}- [${id}] ${first}`);
      if (seen.has(s.id)) return;
      seen = new Set([...seen, s.id]);
      let k = 0;
      const child = text => { k++; out.push(`${pad}  - [${id}.${k}] ${text}`); return `${id}.${k}`; };
      const ps = [...places].flatMap(([fid, list]) => list.filter(p => p.screen === s.id).map(p => [p, fById.get(fid)])).filter(([, f]) => canDo(f));
      const used = new Set();
      for (const b of arr(s.bands)) {
        const its = arr(b.items).filter(it => canDo(fById.get(it)));
        if (!its.length) continue;
        const bid = child(b.name);
        its.forEach((it, j) => { used.add(it); out.push(`${pad}    - [${bid}.${j + 1}] ${itemLine(s, it)}`); });
      }
      const groups = [...arr(s.zones).map(z => ['z', z]), ...arr(s.tabs).map(t => ['t', t])];
      for (const [kind, name] of groups) {
        const inG = ps.filter(([p, f]) => !used.has(f.id) && (kind === 'z' ? p.zone === name && !p.tab : p.tab === name));
        if (!inG.length && kind === 'z') continue;
        const gid = child(kind === 't' ? `Tab ${name}` : name);
        inG.forEach(([p, f], j) => { used.add(f.id); out.push(`${pad}    - [${gid}.${j + 1}] ${featLine(p, f)}`); });
      }
      for (const [p, f] of ps) if (!used.has(f.id) && !(p.mo === 'trang' && !p.zone)) { used.add(f.id); child(featLine(p, f)); }
      for (const sc of arr(L.shortcuts)) {
        if (sc.from !== s.id || used.has(sc.to) || !canDo(fById.get(sc.to))) continue;
        used.add(sc.to);
        child(itemLine(s, sc.to));
      }
      for (const c of S) if (parentsOf(c).includes(s.id) && canSee(c)) node(c, `${id}.${++k}`, depth + 1, seen, `(bấm một dòng) → ${c.name}`);
    };
    for (const g of arr(m.groups)) {
      let depth = 0;
      if (g.name) { out.push(`- Nhóm ${g.name}`); depth = 1; }
      for (const it of arr(g.items)) { const s = sById.get(it); if (canSee(s)) node(s, `${letters[mi] || 'Z' + mi}${++top}`, depth, new Set()); }
    }
    out.push('');
  });
  if (!flags.has('--treetest')) { console.log(out.join('\n')); return; }
  // Soát nhãn: bài cho người thử (subagent chỉ đọc) ở map/treetest.md, không có đáp án; đáp án in ra cho agent chính đối chiếu
  const tasks = arr(L.tasks).filter(x => rById.has(x.role) && fById.has(x.feature));
  if (!tasks.length) { console.error('Chưa có việc bấm thử (tasks) trong layout.js.'); process.exit(2); }
  const roleName = id => rById.get(id).name;
  writeFileSync(join(mapDir, 'treetest.md'), [
    '# Bài thử tìm (soát nhãn)', '',
    'Bạn là người dùng phần mềm này lần đầu: chưa được hướng dẫn, quen làm trên giấy, Excel và Zalo. Bên dưới là cây điều hướng: chỉ có nhãn,',
    'đúng như trên màn hình. "→" nghĩa là bấm vào thì sang màn khác; "(bấm một dòng)" là bấm một dòng của danh sách.', '',
    'Với mỗi việc: bắt đầu từ menu của đúng vai ghi ở việc. Chọn như người dùng thật: nhìn các nhãn ở mức đang thấy, chọn một, rồi mới nhìn',
    'mức bên dưới; đừng dò cả cây tìm chữ giống câu việc. Mở ra thấy sai chỗ thì ghi "quay lại" rồi đi nhánh khác. Dừng ở nút bạn sẽ bấm.',
    'Không tìm được thì ghi "bỏ cuộc". Không đọc file nào khác.', '',
    'Trả về đúng các dòng này, mỗi việc một dòng, không viết gì khác:',
    '`T1 · <nhãn> › <nhãn> › … › <nút dừng> · quay lại <số lần> · chắc cao|vừa|thấp`', '',
    '## Cây', '', ...out, '## Việc', '',
    ...tasks.map((x, i) => `T${i + 1} · vai ${roleName(x.role)} · ${x.say}`), ''].join('\n'));
  console.log(`Soát nhãn: map/treetest.md (${menus.length} menu, ${tasks.length} việc). Đáp án, để đối chiếu nút dừng của người thử:`);
  tasks.forEach((x, i) => {
    const labels = [...new Set([fname(x.feature), ...arr(L.shortcuts).filter(s => s.to === x.feature && s.label).map(s => s.label)])];
    console.log(`  T${i + 1} · ${x.role} → ${labels.join(' · ')}`);
  });
}

function cmdSlice() {
  index();
  const s = sById.get(rest[0]);
  if (!s) { console.error(`Không có màn "${rest[0] || ''}". Các màn: ${S.map(x => x.id).join(', ')}`); process.exit(2); }
  const surf = surfById.get(s.surface) || {};
  console.log(`Màn ${s.id} · ${s.name} · ${surf.name || s.surface} · file ${screenFile(s)}`);
  const meta = [`Vai: ${arr(s.roles).join(', ')}`, `module ${s.module}`];
  if (parentsOf(s).length) meta.push(`vào từ: ${parentsOf(s).join(', ')}${s.pick ? ' (tìm và chọn một bản ghi; màn nhận ?id=)' : ''}`);
  if (arr(L.roles).some(r => r.home === s.id)) meta.push(`trang chủ của ${arr(L.roles).filter(r => r.home === s.id).map(r => r.id).join(', ')}`);
  console.log(meta.join(' · '));
  if (arr(s.tabs).length) console.log(`Tab: ${s.tabs.join(' · ')}`);
  if (arr(s.zones).length) console.log(`Vùng: ${s.zones.join(' · ')}`);
  for (const b of arr(s.bands)) console.log(`Dải "${b.name}": ${arr(b.items).map(id => `${id} ${fname(id)}`).join(' · ')}`);
  console.log('Chức năng (gắn data-feature="<mã>" lên phần tử làm chức năng đó):');
  const ps = [...places].flatMap(([id, list]) => list.filter(p => p.screen === s.id).map(p => ({ id, ...p }))).sort((a, b) => a.tier - b.tier);
  for (const p of ps) {
    const f = fById.get(p.id) || {};
    const where = [p.zone ? `vùng ${p.zone}` : '', p.tab ? `tab ${p.tab}` : ''].filter(Boolean).join(', ');
    console.log(`  ${p.id} T${p.tier} ${p.mo}${where ? ' · ' + where : ''} · ${f.name} · ${arr(f.roles).join(',')} · ${arr(f.src).join(', ')}${f.status === 'hoan' ? ' · hoãn: dựng nút và trang chờ, không dựng chức năng' : ''}${f.evidence === 'suy' ? ' · suy' : ''}`);
    if (f.spec) console.log(`      ${f.spec}`);
  }
  const outSc = arr(L.shortcuts).filter(x => x.from === s.id);
  if (outSc.length) {
    console.log('Lối tắt trên màn này (mở đúng kiểu đã khai; xong hay huỷ thì ở lại màn này và màn tự cập nhật):');
    for (const x of outSc) console.log(`  ${x.to} ${x.label || fname(x.to)} · ${x.mo}${x.ve ? ` · về: ${x.ve}` : ''}`);
  }
  const inSc = arr(L.shortcuts).filter(x => ps.some(p => p.id === x.to) && x.from !== s.id);
  if (inSc.length) console.log(`Lối tắt tới chức năng của màn này từ màn khác: ${inSc.map(x => `${x.from} → ${x.to} (${x.mo})`).join(' · ')}`);
  const kids = S.filter(c => parentsOf(c).includes(s.id));
  if (kids.length) console.log(`Màn con: ${kids.map(c => `${c.id} (${c.name})`).join(' · ')}`);
}

// Độ phủ trên trang đã dựng (B4 của sketch-to-site, qa-check.py gọi khi có map/features.js). Màn đã dựng: có file <site>/<dir>/<màn>.html.
// Mỗi màn đã dựng phải có data-feature="<mã>" (viết nguyên văn, không sinh bằng ${…}) cho mọi chức năng đặt trên màn và mọi lối tắt đi từ
// màn; phần tử của lối tắt gắn thêm data-mo="<kiểu đã khai>" (thiếu thì chỉ cảnh báo). Mã không có trong features.js thì chặn.
function cmdCoverage() {
  index();
  const site = join(proto, siteName);
  if (!existsSync(site)) { console.error(`Không thấy thư mục trang ${siteName}/ trong ${proto.replace(/\\/g, '/')}.`); process.exit(2); }
  const tagsOf = src => [...src.matchAll(/<[a-z][^<>]*?\bdata-feature\s*=\s*["']([^"'$]+)["'][^<>]*>/gi)]
    .map(m => ({ id: m[1], mo: (m[0].match(/\bdata-mo\s*=\s*["']([^"']+)["']/i) || [])[1] || '' }));
  const builtScreens = S.filter(s => existsSync(join(site, screenFile(s))));
  const miss = [], odd = [], moWarn = [], covered = new Set(), missing = new Set();
  for (const s of builtScreens) {
    const where = `${siteName}/${screenFile(s)}`;
    const tags = tagsOf(readFileSync(join(site, screenFile(s)), 'utf8'));
    const ids = new Set(tags.map(x => x.id));
    for (const id of ids) if (!fById.has(id)) odd.push(`${id}: không có trong features.js · ${where}`);
    for (const [id, ps] of places) {
      if (!ps.some(p => p.screen === s.id) || !arr((fById.get(id) || {}).roles).length) continue;
      if (ids.has(id)) covered.add(id);
      else { missing.add(id); miss.push(`${id} "${fname(id)}" · màn ${s.id} · ${where}`); }
    }
    for (const sc of arr(L.shortcuts).filter(x => x.from === s.id)) {
      if (!ids.has(sc.to)) { missing.add(sc.to); miss.push(`lối tắt ${s.id} → ${sc.to} "${fname(sc.to)}" (${sc.mo}) · ${where}`); continue; }
      covered.add(sc.to);
      if (!tags.some(x => x.id === sc.to && x.mo === sc.mo)) moWarn.push(`lối tắt ${s.id} → ${sc.to} "${fname(sc.to)}": phần tử chưa gắn data-mo="${sc.mo}" (kiểu mở đã khai) · ${where}`);
    }
  }
  const all = features.filter(f => arr(f.roles).length);
  const later = all.filter(f => !covered.has(f.id) && !missing.has(f.id));
  console.log(`Độ phủ: ${[...covered].filter(id => !missing.has(id)).length}/${all.length} chức năng có trên trang đã dựng · ${builtScreens.length} màn đã dựng · `
    + `${later.length} chức năng ở ${S.length - builtScreens.length} màn chưa dựng · ${miss.length} thiếu · ${odd.length} mã lạ`);
  const list = (title, items) => {
    if (!items.length) return;
    console.log(`${title} (${items.length}):`);
    for (const x of items.slice(0, MAX)) console.log('  ' + x);
    if (items.length > MAX) console.log(`  … còn ${items.length - MAX}`);
  };
  list('THIẾU data-feature trên màn đã dựng', miss);
  list('MÃ LẠ', odd);
  list('CẢNH BÁO', moWarn);
  process.exit(miss.length || odd.length ? 1 : 0);
}

// Gộp phần kiểm kê của các worker (M1, tài liệu vượt ngưỡng đọc nguyên): map/parts/*.js, mỗi file
// window.PART = { module, features: [{ name, src, roles, freq, evidence, status, states?, spec }], skip: [{ src, why }] }.
// Đánh mã F-01… theo thứ tự tên file rồi thứ tự trong file; ghi map/features.js mỗi chức năng một dòng.
// Đã có layout.js thì không gộp: mã chức năng đang được bố cục dùng, sửa features.js trực tiếp.
function lit(v) {
  if (Array.isArray(v)) return `[${v.map(lit).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${lit(x)}`).join(', ')} }`;
  return typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')}'` : JSON.stringify(v);
}
function cmdMerge() {
  if (existsSync(join(mapDir, 'layout.js'))) { console.error('Đã có map/layout.js: mã chức năng đang được bố cục dùng. Sửa map/features.js trực tiếp, không gộp lại.'); process.exit(2); }
  const dir = join(mapDir, 'parts');
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.js')).sort() : [];
  if (!files.length) { console.error('Không có map/parts/*.js để gộp.'); process.exit(2); }
  const parts = files.map(f => {
    try { const ctx = {}; ctx.window = ctx; vm.runInNewContext(readFileSync(join(dir, f), 'utf8'), ctx); if (!ctx.PART) throw new Error('không có window.PART'); return { f, ...JSON.parse(JSON.stringify(ctx.PART)) }; }
    catch (e) { console.error(`Không đọc được map/parts/${f}: ${e.message}`); process.exit(2); }
  });
  const total = parts.reduce((n, p) => n + arr(p.features).length, 0);
  const pad = total >= 100 ? 3 : 2;
  const ORDER = ['id', 'name', 'module', 'src', 'roles', 'freq', 'evidence', 'status', 'states', 'spec'];
  let n = 0;
  const out = parts.flatMap(p => arr(p.features).map(f => {
    const g = { ...f, id: `F-${String(++n).padStart(pad, '0')}`, module: f.module || p.module };
    return Object.fromEntries([...ORDER.filter(k => g[k] !== undefined), ...Object.keys(g).filter(k => !ORDER.includes(k))].map(k => [k, g[k]]));
  }));
  const old = existsSync(join(mapDir, 'features.js')) ? loadJs('features.js', 'FEATURES', false) : null;
  const skip = parts.flatMap(p => arr(p.skip));
  writeFileSync(join(mapDir, 'features.js'), [
    `// Kiểm kê chức năng, gộp bởi map.mjs merge từ map/parts/ (${files.join(', ')}). Định dạng: templates/features.js của sketch-to-map.`,
    'window.FEATURES = {',
    `  project: ${lit((old && old.project) || '')},`,
    '  features: [',
    ...out.map(f => `    ${lit(f)},`),
    '  ],',
    '  skip: [',
    ...skip.map(x => `    ${lit(x)},`),
    '  ],',
    '};',
    '',
  ].join('\n'));
  console.log(`Đã gộp ${total} chức năng từ ${parts.length} phần vào map/features.js: ${parts.map(p => `${p.module || p.f} ${arr(p.features).length}`).join(' · ')} · ${skip.length} mục skip`);
  // Cặp nghi trùng giữa các phần (khác module, chung vai): tên này là phần đầu của tên kia, hay cùng động từ và chung một mã không phải Must.
  // Mã Must (M-06 "app phụ huynh") gom nhiều việc khác nhau nên không tính. Đo rml1, rml2 (06/10): bắt cả 6 cặp của rml2, 2 trong 3 của rml1
  const ids = (IDS && IDS.ids) || {};
  const codes = f => arr(f.src).map(s => String(s).trim().split(/\s+/)[0]).filter(c => CODE.test(c) && (ids[c] || {}).priority !== 'Must');
  const ws = out.map(f => words(f.name)), cs = out.map(codes);
  const sus = [];
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
    const a = out[i], b = out[j];
    if (a.module === b.module || !shareRole(a, b)) continue;
    const shared = cs[i].filter(c => cs[j].includes(c));
    const why = prefixOf(ws[i], ws[j]) ? 'tên này là phần đầu của tên kia' : shared.length && verbOf(a.name) === verbOf(b.name) ? `chung ${shared.join(', ')}` : '';
    if (why) sus.push(`  ${a.id} "${a.name}" (${a.module}) ↔ ${b.id} "${b.name}" (${b.module}): ${why}`);
  }
  if (sus.length) {
    console.log(`Nghi trùng giữa các phần (${sus.length}): cặp nào là một việc thì giữ một chức năng, gộp src, vai, spec vào nó, xoá cái kia; không phải thì để nguyên`);
    for (const l of sus.slice(0, MAX_BLOCK)) console.log(l);
    if (sus.length > MAX_BLOCK) console.log(`  … còn ${sus.length - MAX_BLOCK}`);
  } else console.log('Nghi trùng giữa các phần: không có');
  console.log('Sửa map/features.js (gộp trùng, skip, mục chặn): Read map/features.js trước khi Edit, vì file vừa do merge ghi; sửa bằng Edit, không bằng script.');
}

if (cmd === 'check') cmdCheck();
else if (cmd === 'merge') cmdMerge();
else if (cmd === 'visible') cmdVisible();
else if (cmd === 'coverage') cmdCoverage();
else cmdSlice();
