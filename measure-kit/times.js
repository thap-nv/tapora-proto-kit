// Thời gian từng lượt: lúc gửi yêu cầu (kết quả công cụ cuối của lượt trước), dòng output đầu, dòng output cuối,
// khoảng cách tới lần gửi kế (TTL cache 5 phút tính từ lần dùng cache trước).
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(); let lastUser = null;
  for (const o of L) {
    const t = o.timestamp ? Date.parse(o.timestamp) : null;
    if (o.type === 'user') lastUser = t;
    if (o.type === 'assistant' && o.message) {
      const cur = byId.get(o.message.id);
      if (!cur) { const x = { id: o.message.id, req: lastUser, first: t, last: t, u: o.message.usage || {} }; byId.set(x.id, x); turns.push(x); }
      else cur.last = t;
    }
  }
  console.log(`\n== ${f.split(/[\\/]/).pop()}`);
  const s = ms => (ms / 1000).toFixed(0).padStart(4) + 's';
  turns.forEach((x, i) => {
    const next = turns[i + 1];
    const gap = next && next.req && x.req ? next.req - x.req : null;
    console.log(`${String(i + 1).padStart(2)} nghĩ ${s(x.first - x.req)} · viết ${s(x.last - x.first)} · tới lần gửi kế ${gap == null ? '   -' : s(gap)}${gap > 300000 ? '  > 5 phút' : ''} · đọc cache ${Math.round((x.u.cache_read_input_tokens || 0) / 1000)}k ghi ${Math.round((x.u.cache_creation_input_tokens || 0) / 1000)}k`);
  });
}
