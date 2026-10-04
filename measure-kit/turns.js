// Liệt kê từng lượt: ngữ cảnh lúc vào, phần thêm sau lượt (kết quả công cụ + chữ đã viết), chi phí phía vào ước của lượt, lệnh gọi.
// node turns.js <a.jsonl> [width]
const fs = require('fs');
const { short: shortPath } = require('./paths');
const f = process.argv[2], W = +process.argv[3] || 150;
const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const turns = [], byId = new Map(), resLen = new Map();
for (const o of L) {
  if (o.type === 'user' && Array.isArray(o.message?.content)) for (const c of o.message.content) if (c.type === 'tool_result') {
    const t = typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.type === 'image' ? '[img]'.padEnd(6000) : (x.text || '')).join('');
    resLen.set(c.tool_use_id, { n: t.length, err: !!c.is_error, img: (c.content || []).some?.(x => x.type === 'image') });
  }
  if (o.type !== 'assistant' || !o.message) continue;
  const m = o.message, u = m.usage || {};
  let t = byId.get(m.id);
  if (!t) { t = { ctx: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), cw: u.cache_creation_input_tokens || 0, calls: [], out: 0, ts: o.timestamp }; byId.set(m.id, t); turns.push(t); }
  for (const c of m.content || []) {
    if (c.type === 'tool_use') { t.calls.push(c); t.out += JSON.stringify(c.input).length; }
    if (c.type === 'text') t.out += c.text.length;
  }
}
const T = turns.length, short = s => shortPath(s).replace(/\s+/g, ' ');
const desc = c => {
  const i = c.input || {};
  if (c.name === 'Bash' || c.name === 'PowerShell') return `${c.name[0]}: ${short(String(i.command))}`;
  if (c.name === 'Read') return `Read ${short(String(i.file_path))}${i.offset ? ` @${i.offset}` : ''}${i.limit ? `+${i.limit}` : ''}`;
  if (c.name === 'Write') return `Write ${short(String(i.file_path))} (${(i.content || '').length} ký tự)`;
  if (c.name === 'Edit') return `Edit ${short(String(i.file_path))} (${(i.new_string || '').length})`;
  if (c.name === 'Agent' || c.name === 'Task') return `Agent ${i.description || ''}`;
  if (c.name === 'ToolSearch') return `ToolSearch ${i.query}`;
  if (c.name === 'WebSearch') return `WebSearch ${i.query}`;
  return c.name;
};
let tot = 0;
console.log(` #   vào(k) thêm(k) chi phí(k) out  lệnh`);
for (let k = 0; k < T; k++) {
  const t = turns[k], d = k < T - 1 ? Math.max(0, turns[k + 1].ctx - t.ctx) : 0;
  const cost = 0.1 * t.ctx + 1.25 * t.cw + 5 * t.out / 3; tot += cost;
  const calls = t.calls.map(c => { const r = resLen.get(c.id) || {}; return `${desc(c).slice(0, W)} → ${r.img ? 'ảnh' : Math.round((r.n || 0) / 100) / 10 + 'k ký tự'}${r.err ? ' LỖI' : ''}`; });
  console.log(`${String(k + 1).padStart(2)} ${String(Math.round(t.ctx / 1000)).padStart(6)} ${String(Math.round(d / 1000)).padStart(6)} ${String(Math.round(cost / 1000)).padStart(8)} ${String(Math.round(t.out / 1000)).padStart(4)}k ${calls[0] || '(chữ)'}`);
  for (const c of calls.slice(1)) console.log(' '.repeat(36) + c);
}
console.log(`tổng ước (0,1×ngữ cảnh + 1,25×ghi cache + 5×out/3): ${(tot / 1e6).toFixed(2)}M`);
