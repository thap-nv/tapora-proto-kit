// Chi phí theo tài liệu và theo giai đoạn. Phần ngữ cảnh thêm ở lượt k: ghi cache 1,25 rồi đọc lại 0,1 ở mỗi lượt sau.
const fs = require('fs');
const f = process.argv[2];
const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const turns = [], byId = new Map();
for (const o of L) {
  if (o.type !== 'assistant' || !o.message) continue;
  const m = o.message, u = m.usage || {};
  let t = byId.get(m.id);
  if (!t) { t = { ctx: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), calls: [] }; byId.set(m.id, t); turns.push(t); }
  for (const c of m.content || []) if (c.type === 'tool_use') t.calls.push(c);
}
const T = turns.length;
const docOf = c => {
  const i = c.input || {}, s = c.name === 'Read' ? String(i.file_path || '') : String(i.command || '');
  if (!/tapora-proto-kit[\/]skills/i.test(s)) return null;
  const m = s.match(/skills[\/]([\w-]+)[\/]([\w\/.-]+\.(md|mjs|js|py|html|csv))/g);
  return m ? [...new Set(m.map(x => x.replace(/^skills[\/]/, '')))].join(' + ') : 'khác';
};
const docs = {}, phase = {}; let ph = 'A1–A2 (đọc, tra, chọn hướng)';
for (let k = 0; k < T - 1; k++) {
  const t = turns[k], d = Math.max(0, turns[k + 1].ctx - t.ctx), w = 1.25 + 0.1 * (T - k - 2);
  for (const c of t.calls) {
    const p = String((c.input || {}).file_path || '') + String((c.input || {}).command || '');
    if (c.name === 'Write' && /concepts\.js$/.test(p) && ph.startsWith('A1')) ph = 'A3 dữ liệu + chấm';
    if (c.name === 'Write' && /[abc]\.html$/.test(p) && !ph.startsWith('A3 dựng')) ph = 'A3 dựng màn';
    if (/shots\.mjs|preflight\.py concept/.test(p) && ph === 'A3 dựng màn') ph = 'A3 tự kiểm + sửa';
    if (c.name === 'Write' && /DECISIONS\.md$/.test(p) && ph !== 'A1–A2 (đọc, tra, chọn hướng)') ph = 'Cổng 2 (ghi DECISIONS, trả lời)';
  }
  phase[ph] = phase[ph] || { turns: 0, cost: 0 }; phase[ph].turns++; phase[ph].cost += 0.1 * t.ctx + 1.25 * d;
  const ds = t.calls.map(docOf).filter(Boolean);
  for (const x of ds) docs[x] = (docs[x] || { n: 0, tok: 0, cost: 0, at: [] }), docs[x].n++, docs[x].tok += d / ds.length, docs[x].cost += d * w / ds.length, docs[x].at.push(k + 1);
}
console.log(`${T} lượt; chi phí phía vào ước theo lượt (0,1 × ngữ cảnh + 1,25 × phần mới):`);
for (const [k, v] of Object.entries(phase)) console.log(`  ${k.padEnd(34)} ${String(v.turns).padStart(3)} lượt  ${Math.round(v.cost / 1000)}k`);
console.log('\nTài liệu skill: token thêm vào ngữ cảnh · chi phí kéo theo tới cuối · đọc ở lượt');
for (const [k, v] of Object.entries(docs).sort((a, b) => b[1].cost - a[1].cost)) console.log(`  ${Math.round(v.cost / 1000).toString().padStart(4)}k  ${Math.round(v.tok / 1000).toString().padStart(3)}k tok  lượt ${v.at.join(',')}  ${k.slice(0, 110)}`);
