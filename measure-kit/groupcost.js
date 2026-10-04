// Chi phí của một nhóm lượt: phí lượt (0,1 × ngữ cảnh lúc vào + output×5/3) và phần nội dung lượt đó nạp vào, mang tới cuối (d × (1,25 + 0,1 × số lượt còn lại)).
// node groupcost.js <a.jsonl> "tên:1,2,5-9" "tên:…" …
const fs = require('fs');
const [f, ...groups] = process.argv.slice(2);
const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const T = [], by = new Map();
for (const o of L) {
  if (o.type !== 'assistant' || !o.message) continue;
  const m = o.message, u = m.usage || {};
  let t = by.get(m.id);
  if (!t) { t = { ctx: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), out: 0 }; by.set(m.id, t); T.push(t); }
  for (const c of m.content || []) t.out += c.type === 'tool_use' ? JSON.stringify(c.input).length : c.type === 'text' ? c.text.length : 0;
}
const N = T.length;
const parse = s => s.split(',').flatMap(x => { const [a, b] = x.split('-').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]; });
for (const g of groups) {
  const [name, list] = g.split(':'); const ks = parse(list);
  let fee = 0, carry = 0;
  for (const k of ks) {
    const t = T[k - 1], d = k < N ? Math.max(0, T[k].ctx - t.ctx) : 0;
    fee += 0.1 * t.ctx + 5 * t.out / 3;
    carry += d * (1.25 + 0.1 * (N - k - 1));
  }
  console.log(`${name.padEnd(28)} ${String(ks.length).padStart(3)} lượt · phí lượt ${Math.round(fee / 1000)}k · nội dung mang theo ${Math.round(carry / 1000)}k · cộng ${Math.round((fee + carry) / 1000)}k`);
}
