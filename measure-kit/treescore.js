#!/usr/bin/env node
// Chấm bài thử tìm (tree test): node treescore.js <viec.json> <kết-quả> … [--json]
//   viec.json: { "tasks": [ { "id": "T1", "role": "…", "say": "…", "expect": ["Q3.4.8"], "tier": 2 } ] }
//   kết-quả: mỗi file là câu trả lời của một người thử: một mảng JSON
//     [{ "viec": "T1", "duong": ["Q3", "Q3.4", "Q3.4.8"], "quay_lai": 0, "chac": "cao" }]
//     hoặc văn bản có chứa mảng đó (lấy khối [ … ] đầu tiên).
// Thành công: mã cuối của "duong" nằm trong "expect". Gần đúng: mã cuối là cha của một mã trong "expect"
//   (ví dụ dừng ở tab mà nút cần bấm nằm trong tab đó). Đi thẳng: thành công và quay_lai = 0.
// In: mỗi việc một dòng, rồi tổng và theo tầng. Ngưỡng tham khảo: thành công ≥ 80 %, đi thẳng ≥ 60 %.
'use strict';
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const files = args.filter(a => a !== '--json');
if (files.length < 2) { console.error('Cách gọi: node treescore.js <viec.json> <kết-quả> … [--json]'); process.exit(2); }

const { tasks } = JSON.parse(fs.readFileSync(files[0], 'utf8'));
const read = f => {
  const t = fs.readFileSync(f, 'utf8');
  const i = t.indexOf('['), j = t.lastIndexOf(']');
  if (i < 0 || j < i) throw new Error(`${f}: không thấy mảng JSON`);
  return JSON.parse(t.slice(i, j + 1));
};
const runs = files.slice(1).map(f => ({ name: path.basename(f).replace(/\.[^.]+$/, ''), ans: read(f) }));
const isAncestor = (a, b) => b.startsWith(a + '.') || (b.length > a.length && b.startsWith(a) && /^[a-z]$/.test(b.slice(a.length)));

const rows = []; let S = 0, D = 0, N = 0, G = 0; const tier = {};
for (const t of tasks) {
  const r = { id: t.id, say: t.say, tier: t.tier, s: 0, d: 0, g: 0, n: 0, finals: [] };
  for (const run of runs) {
    const a = run.ans.find(x => x.viec === t.id);
    if (!a) { r.finals.push(`${run.name}:—`); r.n++; continue; }
    const duong = (a.duong || []).map(String);
    const last = duong[duong.length - 1] || '';
    const ok = t.expect.includes(last);
    const near = !ok && t.expect.some(e => isAncestor(last, e));
    r.n++; if (ok) { r.s++; if (!a.quay_lai) r.d++; } else if (near) r.g++;
    r.finals.push(`${run.name}:${last}${a.quay_lai ? `↩${a.quay_lai}` : ''}${ok ? '' : near ? '~' : '✗'}`);
  }
  S += r.s; D += r.d; G += r.g; N += r.n;
  const b = tier[t.tier] = tier[t.tier] || [0, 0, 0]; b[0] += r.s; b[1] += r.d; b[2] += r.n;
  rows.push(r);
}
const pc = (a, b) => (b ? Math.round(100 * a / b) : 0) + ' %';
if (JSON_OUT) { console.log(JSON.stringify({ thanhCong: S, diThang: D, ganDung: G, tong: N, rows, tier }, null, 1)); process.exit(0); }
console.log(`${tasks.length} việc × ${runs.length} người thử (${runs.map(r => r.name).join(', ')})`);
for (const r of rows) console.log(`${r.id.padEnd(4)} đúng ${r.s}/${r.n} · thẳng ${r.d}/${r.n}${r.g ? ` · gần ${r.g}` : ''}  ${r.finals.join('  ')}  · ${r.say.slice(0, 70)}`);
console.log(`Thành công ${S}/${N} (${pc(S, N)}) · đi thẳng ${D}/${N} (${pc(D, N)}) · gần đúng ${G}`);
console.log('Theo tầng: ' + Object.entries(tier).map(([k, [s, d, n]]) => `T${k} đúng ${pc(s, n)}, thẳng ${pc(d, n)}`).join(' · '));
console.log('Ký hiệu: ↩n quay lại n lần · ~ dừng ở cha của nút đúng · ✗ sai chỗ');
