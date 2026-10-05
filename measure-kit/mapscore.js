#!/usr/bin/env node
// Chấm bản đồ chức năng của một lần chạy theo đáp án của một đề đo (ví dụ r7-map/key.json).
//   node mapscore.js <key.json> <kết-quả> … [--json] [--all]
//     <kết-quả>: file map/features.js (đọc thêm layout.js cùng thư mục nếu có), một hay nhiều file văn bản
//     (DESIGN.md, MAP.md…), hoặc thư mục prototype: có map/features.js thì chấm dữ liệu, không thì chấm văn bản
//     của MAP.md và DESIGN.md.
//   node mapscore.js --selfcheck <key.json> <thư-mục-tài-liệu>: soát chính đáp án (mã nguồn có trong tài liệu,
//     tên mỗi mục khớp lựa chọn của nó, mục nào khớp tên mục khác).
// Khớp: chuỗi bỏ dấu, chữ thường, chỉ giữ chữ và số. Mỗi lựa chọn trong "match" là các cụm cách nhau bằng dấu
//   cách; "_" là dấu cách trong cụm; cụm bắt đầu bằng "-" thì không được có. Cụm khớp theo ranh giới từ.
// Chấm dữ liệu: khớp tên chức năng. Không khớp tên mà khớp phần mô tả, hoặc chỉ trùng mã nguồn: vào "cần soát tay".
//   Chức năng có trạng thái hoãn (hoan, defer, GĐ2, ngoài phạm vi) không tính là dựng thừa.
// Chấm văn bản: khớp từng dòng.
// In: dòng tổng, mục trượt, bẫy theo kiểu, trùng, dựng thừa, sai trạng thái, cần soát tay, chức năng ngoài đáp án
//   (tối đa 15 dòng mỗi danh sách; --all in hết). Luôn thoát 0, trừ khi gọi sai (2).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
const flag = f => { const i = args.indexOf(f); if (i >= 0) { args.splice(i, 1); return true; } return false; };
const JSON_OUT = flag('--json');
const ALL = flag('--all');
const SELF = flag('--selfcheck');
if (args.length < 2) {
  console.error('Cách gọi: node mapscore.js <key.json> <kết-quả> … [--json] [--all]\n          node mapscore.js --selfcheck <key.json> <thư-mục-tài-liệu>');
  process.exit(2);
}

const norm = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const has = (text, phrase) => (' ' + text + ' ').includes(' ' + phrase + ' ');
function altMatch(alt, text) {
  let pos = 0;
  for (const term of alt.split(/\s+/).filter(Boolean)) {
    const neg = term[0] === '-';
    const w = norm((neg ? term.slice(1) : term).replace(/_/g, ' '));
    if (!w) continue;
    if (neg ? has(text, w) : !has(text, w)) return false;
    if (!neg) pos++;
  }
  return pos > 0;
}
const anyMatch = (alts, text) => alts.some(a => altMatch(a, text));
const ID_RE = /^[A-Z]{1,3}(-[A-Z]{2})?-\d+[a-z]?$/; // mã yêu cầu thật: UC-01, BR-LH-04, XD-02
const isDeferred = s => /\b(hoan|defer|deferred|gd 2|gd2|giai doan 2|ngoai pham vi|out of scope|khong lam|wont)\b/.test(norm(s));

const key = JSON.parse(fs.readFileSync(args[0], 'utf8'));
const TRAP = key.trapTypes || {};
const cut = (list, n = 15) => (ALL ? list : list.slice(0, n));
const more = (list, n = 15) => (!ALL && list.length > n ? `  … còn ${list.length - n} dòng (--all)` : null);

// ---------- Soát đáp án ----------
if (SELF) {
  const dir = args[1];
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(dir);
  const text = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const out = [];
  const items = [...key.features, ...(key.not || [])];
  for (const it of items) {
    for (const s of it.src || []) if (ID_RE.test(s) && !new RegExp('\\b' + s.replace(/-/g, '\\-') + '\\b').test(text)) out.push(`${it.id}: mã nguồn ${s} không có trong tài liệu`);
    if (!anyMatch(it.match, norm(it.name))) out.push(`${it.id}: tên "${it.name}" không khớp lựa chọn nào của chính nó`);
  }
  for (const a of items) for (const b of items) {
    if (a === b) continue;
    if (anyMatch(a.match, norm(b.name))) out.push(`${a.id} khớp nhầm tên của ${b.id} "${b.name}"`);
  }
  const traps = key.features.filter(f => f.trap);
  console.log(`Đáp án ${path.basename(args[0])}: ${key.features.length} chức năng (${traps.length} bẫy, ${key.features.filter(f => f.status === 'hoan').length} hoãn) · ${(key.not || []).length} thứ không dựng · ${files.length} file tài liệu`);
  const kinds = {};
  for (const f of traps) kinds[f.trap] = (kinds[f.trap] || 0) + 1;
  console.log('Bẫy theo kiểu: ' + Object.entries(kinds).map(([k, n]) => `${TRAP[k] || k} ${n}`).join(' · '));
  for (const k of Object.keys(TRAP)) if (!kinds[k]) out.push(`kiểu bẫy ${k} không có mục nào`);
  console.log(out.length ? out.map(s => '  ' + s).join('\n') : '  Không có chỗ cần sửa.');
  process.exit(0);
}

// ---------- Đọc kết quả ----------
function runJs(file) {
  const ctx = { window: {}, module: { exports: {} }, console: { log() {}, warn() {}, error() {} } };
  ctx.exports = ctx.module.exports; ctx.globalThis = ctx; ctx.self = ctx.window;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  const named = {};
  for (const n of ['FEATURES', 'MAP_FEATURES', 'features', 'LAYOUT', 'MAP_LAYOUT', 'layout', 'MAP']) {
    try { const v = vm.runInContext(`typeof ${n} !== 'undefined' ? ${n} : undefined`, ctx); if (v !== undefined) named[n] = v; } catch { /* không có */ }
  }
  return [ctx.window, ctx.module.exports, named, ctx];
}
const nameOf = f => f && (f.name || f.ten || f.title || f.label);
function arrays(roots, test) {
  const found = []; const seen = new Set();
  (function walk(v, d) {
    if (!v || typeof v !== 'object' || seen.has(v) || d > 4) return; seen.add(v);
    if (Array.isArray(v)) { if (v.length && v.every(x => x && typeof x === 'object') && v.some(test)) found.push(v); v.forEach(x => walk(x, d + 1)); return; }
    for (const k of Object.keys(v)) walk(v[k], d + 1);
  })(roots, 0);
  return found;
}
function loadData(file) {
  const feats = arrays(runJs(file), x => nameOf(x)).sort((a, b) => b.length - a.length)[0] || [];
  const modStatus = {};
  const lay = path.join(path.dirname(file), 'layout.js');
  if (fs.existsSync(lay)) {
    for (const arr of arrays(runJs(lay), x => x.id && (x.status || x.trang_thai))) for (const m of arr) if (m.id) modStatus[m.id] = m.status || m.trang_thai;
  }
  return feats.map((f, i) => ({
    id: f.id || `#${i + 1}`,
    name: String(nameOf(f)),
    n: norm(nameOf(f)),
    spec: norm([f.spec, f.mo_ta, f.desc, f.description, f.note].filter(Boolean).join(' ')),
    src: norm([].concat(f.src || f.source || f.nguon || []).join(' ')),
    status: String(f.status || f.trang_thai || modStatus[f.module] || ''),
  }));
}

const inputs = args.slice(1);
let mode, feats = [], lines = [], label;
const dirFeats = d => path.join(d, 'map', 'features.js');
if (inputs.length === 1 && fs.statSync(inputs[0]).isDirectory()) {
  const d = inputs[0];
  if (fs.existsSync(dirFeats(d))) { mode = 'data'; feats = loadData(dirFeats(d)); label = dirFeats(d); }
  else {
    const files = ['MAP.md', 'DESIGN.md'].map(f => path.join(d, f)).filter(fs.existsSync);
    if (!files.length) { console.error(`${d}: không có map/features.js, MAP.md hay DESIGN.md`); process.exit(2); }
    mode = 'text'; label = files.join(', ');
    for (const f of files) lines.push(...fs.readFileSync(f, 'utf8').split(/\r?\n/));
  }
} else if (inputs.length === 1 && inputs[0].endsWith('.js')) {
  mode = 'data'; feats = loadData(inputs[0]); label = inputs[0];
} else {
  mode = 'text'; label = inputs.join(', ');
  for (const f of inputs) lines.push(...fs.readFileSync(f, 'utf8').split(/\r?\n/));
}
const nlines = lines.map(l => ({ raw: l.trim(), n: norm(l) })).filter(l => l.n);

// ---------- Chấm ----------
const R = { hit: [], miss: [], dup: [], extra: [], wrongStatus: [], review: [], outside: [] };
const used = new Set();
for (const k of key.features) {
  const tag = k.trap ? ` · bẫy: ${TRAP[k.trap] || k.trap}` : '';
  if (mode === 'data') {
    const byName = feats.filter(f => anyMatch(k.match, f.n));
    byName.forEach(f => used.add(f));
    if (byName.length) {
      R.hit.push(k);
      if (k.one && byName.length > 1) R.dup.push(`${k.id} ${k.name} ← ${byName.map(f => `${f.id} "${f.name}"`).join(', ')}`);
      const deferredHere = byName.some(f => isDeferred(f.status));
      if (k.status === 'hoan' && !deferredHere) R.wrongStatus.push(`${k.id} ${k.name}: đáp án là hoãn, bản đồ để trong phạm vi (${byName.map(f => f.id).join(', ')})`);
      if (k.status !== 'hoan' && byName.every(f => isDeferred(f.status))) R.wrongStatus.push(`${k.id} ${k.name}: đáp án là trong phạm vi, bản đồ để hoãn (${byName.map(f => f.id).join(', ')})`);
      continue;
    }
    const bySpec = feats.filter(f => anyMatch(k.match, f.spec));
    const bySrc = feats.filter(f => (k.src || []).some(s => ID_RE.test(s) && has(f.src, norm(s))));
    R.miss.push(k);
    if (bySpec.length || bySrc.length) R.review.push(`${k.id} ${k.name}${tag}: tên không khớp; mô tả khớp ${bySpec.map(f => f.id).join(', ') || '—'} · nguồn trùng ${bySrc.map(f => f.id).join(', ') || '—'}`);
  } else {
    const ls = nlines.filter(l => anyMatch(k.match, l.n));
    if (ls.length) {
      R.hit.push(k);
      if (k.one) {
        const names = new Set(ls.map(l => k.match.find(a => altMatch(a, l.n))));
        if (names.size > 1) R.review.push(`${k.id} ${k.name}: gặp nhiều cách gọi (${[...names].join(' · ')}), soát xem có thành hai chức năng không`);
      }
    } else R.miss.push(k);
  }
}
for (const x of key.not || []) {
  if (mode === 'data') {
    const fs2 = feats.filter(f => anyMatch(x.match, f.n));
    fs2.forEach(f => used.add(f));
    const live = fs2.filter(f => !isDeferred(f.status));
    if (live.length) R.extra.push(`${x.id} ${x.name} (${x.why}) ← ${live.map(f => `${f.id} "${f.name}"`).join(', ')}`);
  } else {
    const ls = nlines.filter(l => anyMatch(x.match, l.n));
    if (ls.length) R.review.push(`${x.id} ${x.name} (không được dựng): xuất hiện ở "${ls[0].raw.slice(0, 110)}"`);
  }
}
if (mode === 'data') for (const f of feats) if (!used.has(f)) R.outside.push(`${f.id} "${f.name}"${f.status ? ` [${f.status}]` : ''}`);

const traps = key.features.filter(k => k.trap);
const trapHit = traps.filter(k => R.hit.includes(k));
const deferred = key.features.filter(k => k.status === 'hoan');
const byKind = {};
for (const k of traps) { const b = byKind[k.trap] = byKind[k.trap] || [0, 0]; b[1]++; if (R.hit.includes(k)) b[0]++; }

if (JSON_OUT) {
  console.log(JSON.stringify({
    de: key.de, ketQua: label, cheDo: mode, soChucNang: feats.length,
    trung: R.hit.length, tong: key.features.length, bayTrung: trapHit.length, bay: traps.length,
    truot: R.miss.map(k => k.id), trungLap: R.dup, dungThua: R.extra, saiTrangThai: R.wrongStatus,
    canSoatTay: R.review, ngoaiDapAn: R.outside, bayTheoKieu: byKind,
  }, null, 1));
  process.exit(0);
}

console.log(`Đề: ${key.de} · đáp án ${key.features.length} chức năng (${traps.length} bẫy, ${deferred.length} hoãn) · ${(key.not || []).length} thứ không dựng`);
console.log(`Kết quả: ${label} · ${mode === 'data' ? `dữ liệu, ${feats.length} chức năng` : `văn bản, ${nlines.length} dòng`}`);
const parts = [`Trúng ${R.hit.length}/${key.features.length}`, `bẫy ${trapHit.length}/${traps.length}`];
if (mode === 'data') parts.push(`trùng ${R.dup.length}`, `dựng thừa ${R.extra.length}`, `sai trạng thái ${R.wrongStatus.length}`);
parts.push(`cần soát tay ${R.review.length}`);
if (mode === 'data') parts.push(`ngoài đáp án ${R.outside.length}`);
console.log(parts.join(' · '));
console.log('Bẫy theo kiểu: ' + Object.entries(byKind).map(([k, [h, t]]) => `${TRAP[k] || k} ${h}/${t}`).join(' · '));
const section = (title, list) => {
  if (!list.length) return;
  console.log(`${title} (${list.length}):`);
  for (const s of cut(list)) console.log('  ' + s);
  const m = more(list); if (m) console.log(m);
};
section('Trượt', R.miss.map(k => `${k.id} ${k.name}${k.trap ? ` · bẫy: ${TRAP[k.trap] || k.trap}` : ''}${k.status === 'hoan' ? ' · hoãn' : ''} · nguồn ${(k.src || []).join(', ')}`));
section('Trùng', R.dup);
section('Dựng thừa', R.extra);
section('Sai trạng thái', R.wrongStatus);
section('Cần soát tay', R.review);
section('Ngoài đáp án (có thể là chức năng tách nhỏ hợp lệ, soát tay)', R.outside);
