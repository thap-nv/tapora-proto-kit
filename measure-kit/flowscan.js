#!/usr/bin/env node
// Quét mã một prototype đã dựng để đo chi phí thao tác và độ dày từng màn, không cần trình duyệt.
//   node flowscan.js <thư-mục-site> [--json] [--all]
// Đếm theo từng trang .html (kể cả mẫu chuỗi trong <script> của trang; file .js dùng chung đếm riêng một dòng):
//   chính   nút hay liên kết mang lớp btn-primary · tab: role="tab", data-tab, data-tab-target
//   phủ     hộp thoại, ngăn trượt: <dialog, aria-modal, class drawer, data-modal-open, BD.open(
//   nhập    <input (trừ hidden), <select, <textarea · viền dày: border 2px trở lên trong CSS của trang
//   đá đi   liên kết <a href="trang-khác.html…"> trong nội dung trang, không tính thanh điều hướng
//   tự nhảy location.href = …, location.assign/replace, kể cả trong setTimeout
//   Liên kết đá đi chia hai loại theo chữ đầu: *lối tắt hành động* (Bán, Xếp, Đổi, Dời, Ghi, Thêm, Đăng ký, Tạo, Sửa,
//   Huỷ, Gửi, Chuyển, Duyệt, Lập, Check-in, Nhập, Xử lý, Khớp, Viết, Mua) và *điều hướng* (còn lại: Về, Xem tất cả…).
// Mỗi lần đá đi kèm: chữ của liên kết, trang đích, đích có đọc tham số quay về (from, back, ve, return) hay có
//   nút quay lại (history.back, chữ "Quay lại") không. Không có thì ghi "không đường về".
// Giới hạn: quét chữ trong mã, không chạy trang. Liên kết dựng bằng hàm (không có href="….html" nguyên văn) không đếm.
'use strict';
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const ALL = args.includes('--all');
const root = args.find(a => !a.startsWith('--'));
if (!root) { console.error('Cách gọi: node flowscan.js <thư-mục-site> [--json] [--all]'); process.exit(2); }

const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(node_modules|_qa|\.)/.test(e.name)) walk(p); } else if (/\.(html|js)$/.test(e.name)) files.push(p); } })(root);
const rel = p => path.relative(root, p).replace(/\\/g, '/');
const src = Object.fromEntries(files.map(f => [rel(f), fs.readFileSync(f, 'utf8')]));
const pages = Object.keys(src).filter(f => f.endsWith('.html'));
const shared = Object.keys(src).filter(f => f.endsWith('.js'));

const count = (t, re) => (t.match(re) || []).length;
const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/\$\{[^}]*\}/g, '…').replace(/\s+/g, ' ').trim();
const ACTION = /^(Bán|Xếp|Đổi|Dời|Ghi|Thêm|Đăng ký|Tạo|Sửa|Huỷ|Hủy|Gửi|Chuyển|Duyệt|Lập|Check-in|Nhập|Xử lý|Khớp|Viết|Mua)/i;
const hasReturn = t => /get\(\s*['"](from|back|ve|return|quay)['"]\s*\)|history\.back\(|Quay lại/.test(t);
const resolve = (from, href) => path.posix.normalize(path.posix.join(path.posix.dirname(from), href.split(/[?#]/)[0]));

function scan(name, t, isPage) {
  const body = t.replace(/<!--[\s\S]*?-->/g, '');
  const nav = /<(nav|aside)\b[\s\S]*?<\/\1>/g; // điều hướng tĩnh của trang: không tính là đá đi
  const content = isPage ? body.replace(nav, '') : body;
  const css = (body.match(/<style[\s\S]*?<\/style>/g) || []).join('\n') + (isPage ? '' : '');
  const r = {
    page: name,
    chinh: count(content, /\bbtn-primary\b/g),
    tab: count(content, /role="tab"|data-tab(-target)?=/g),
    phu: count(content, /<dialog\b|aria-modal="true"|class="[^"]*\bdrawer\b|data-modal-open|BD\.open\(/g),
    nhap: count(content, /<input\b(?![^>]*type="hidden")|<select\b|<textarea\b/g),
    vien: count(isPage ? css : body, /border(-[a-z]+)?\s*:\s*[^;]*\b([2-9]|\d{2,})px\b/g),
    jumps: [], auto: [],
  };
  const aRe = /<a\b[^>]*?href="([^"#:]*?\.html[^"]*)"[^>]*>([\s\S]{0,200}?)<\/a>/g;
  let m;
  while ((m = aRe.exec(content))) {
    const target = isPage ? resolve(name, m[1].replace(/\$\{[^}]*\}/g, '')) : m[1].split(/[?#]/)[0];
    if (isPage && target === name) continue;
    const text = strip(m[2]).slice(0, 50) || '(biểu tượng)';
    r.jumps.push({ text, to: target, action: ACTION.test(text), carriesFrom: /[?&](from|back|ve|return)=/.test(m[1]) });
  }
  const autoRe = /(location\.(href|assign|replace)\s*(=|\()\s*[`'"]?([^`'";)]*))/g;
  while ((m = autoRe.exec(content))) r.auto.push((m[4] || '').replace(/\$\{[^}]*\}/g, '…').slice(0, 60));
  for (const j of r.jumps) j.ret = j.carriesFrom || (src[j.to] ? hasReturn(src[j.to]) : null);
  return r;
}

const rows = pages.map(p => scan(p, src[p], true)).sort((a, b) => a.page.localeCompare(b.page));
const sharedRows = shared.map(p => scan(p, src[p], false));
const allJumps = rows.flatMap(r => r.jumps.map(j => ({ from: r.page, ...j })));
const noRet = allJumps.filter(j => j.ret === false);
const actJumps = allJumps.filter(j => j.action);
const actNoRet = actJumps.filter(j => j.ret === false);
const autos = rows.flatMap(r => r.auto.map(a => ({ from: r.page, to: a })));

if (JSON_OUT) { console.log(JSON.stringify({ rows, sharedRows, noReturn: noRet, actionNoReturn: actNoRet, autos }, null, 1)); process.exit(0); }
console.log(`${pages.length} trang · ${shared.length} file .js dùng chung · thư mục ${root}`);
console.log('chính  tab  phủ  nhập  viền  đá đi  tắt  tự nhảy  trang');
for (const r of rows) console.log(`${String(r.chinh).padStart(5)} ${String(r.tab).padStart(4)} ${String(r.phu).padStart(4)} ${String(r.nhap).padStart(5)} ${String(r.vien).padStart(5)} ${String(r.jumps.length).padStart(6)} ${String(r.jumps.filter(j => j.action).length).padStart(4)} ${String(r.auto.length).padStart(8)}  ${r.page}`);
for (const r of sharedRows) if (r.chinh + r.tab + r.phu + r.vien + r.auto.length) console.log(`${String(r.chinh).padStart(5)} ${String(r.tab).padStart(4)} ${String(r.phu).padStart(4)} ${String(r.nhap).padStart(5)} ${String(r.vien).padStart(5)} ${'—'.padStart(6)} ${'—'.padStart(4)} ${String(r.auto.length).padStart(8)}  ${r.page} (dùng chung)`);
const sum = k => rows.reduce((n, r) => n + (Array.isArray(r[k]) ? r[k].length : r[k]), 0);
console.log(`Tổng: ${sum('chinh')} nút chính · ${sum('tab')} tab · ${sum('phu')} lớp phủ · ${sum('jumps')} liên kết đá đi (${noRet.length} không đường về) · trong đó ${actJumps.length} lối tắt hành động (${actNoRet.length} không đường về) · ${autos.length} chỗ tự nhảy`);
const list = (title, arr, fmt) => { if (!arr.length) return; console.log(`${title} (${arr.length}):`); for (const x of (ALL ? arr : arr.slice(0, 15))) console.log('  ' + fmt(x)); if (!ALL && arr.length > 15) console.log(`  … còn ${arr.length - 15} (--all)`); };
list('Lối tắt hành động đá sang trang khác mà không có đường về', actNoRet, j => `${j.from} → ${j.to} · "${j.text}"`);
if (ALL) list('Liên kết điều hướng (không tính là lỗi)', allJumps.filter(j => !j.action), j => `${j.from} → ${j.to} · "${j.text}"`);
list('Chỗ tự nhảy trang', autos, a => `${a.from} → ${a.to}`);
