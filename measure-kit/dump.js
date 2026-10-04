// In đầy đủ lệnh và đầu/cuối kết quả của các lượt chọn. node dump.js <a.jsonl> <lượt,lượt,…> [đầu] [cuối]
const fs = require('fs');
const { short } = require('./paths');
const [f, list, H = 700, Tl = 300] = process.argv.slice(2);
const want = new Set(String(list).split(',').map(Number));
const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const res = new Map(), order = [], byId = new Map();
for (const o of L) {
  if (o.type === 'user' && Array.isArray(o.message?.content)) for (const c of o.message.content) if (c.type === 'tool_result')
    res.set(c.tool_use_id, { err: !!c.is_error, t: typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.type === 'image' ? '[ảnh]' : (x.text || '')).join('') });
  if (o.type !== 'assistant' || !o.message) continue;
  if (!byId.has(o.message.id)) { byId.set(o.message.id, []); order.push(o.message.id); }
  for (const c of o.message.content || []) byId.get(o.message.id).push(c);
}
order.forEach((id, k) => {
  if (!want.has(k + 1)) return;
  console.log(`\n======== lượt ${k + 1}`);
  for (const c of byId.get(id)) {
    if (c.type === 'text') console.log(`[chữ] ${short(c.text).slice(0, 400)}`);
    if (c.type !== 'tool_use') continue;
    const i = c.input; const what = i.command || i.file_path || i.query || i.description || JSON.stringify(i).slice(0, 300);
    console.log(`--- ${c.name}: ${short(String(what))}${c.name === 'Edit' ? `\n    old: ${short(i.old_string).slice(0, 200)}\n    new: ${short(i.new_string).slice(0, 300)}` : ''}`);
    const r = res.get(c.id) || { t: '' };
    const t = short(r.t);
    console.log(`  => ${r.err ? 'LỖI ' : ''}${t.length} ký tự${t.length > +H + +Tl ? `\n${t.slice(0, H)}\n  […]\n${t.slice(-Tl)}` : `\n${t}`}`);
  }
});
