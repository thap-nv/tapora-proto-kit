// Token quy đổi = input + 1,25 × ghi cache + 0,1 × đọc cache + 5 × output.
// Transcript ghi usage lúc bắt đầu stream nên output_tokens thiếu: ước output từ nội dung đã viết (chữ, lệnh gọi công cụ), 2,5 đến 3,5 ký tự một token; khối thinking chỉ còn chữ ký nên không tính được.
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const ids = new Map(); let chars = 0, first, last;
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!l.trim()) continue; const j = JSON.parse(l);
    if (j.timestamp) { const t = Date.parse(j.timestamp); first = first ? Math.min(first, t) : t; last = last ? Math.max(last, t) : t; }
    const x = j.message; if (!x || x.role !== 'assistant') continue;
    if (x.usage) ids.set(x.id, x.usage);
    for (const c of x.content || []) chars += c.type === 'text' ? c.text.length : c.type === 'tool_use' ? JSON.stringify(c.input).length : c.type === 'thinking' ? (c.thinking || '').length : 0;
  }
  const s = { in: 0, cw: 0, cr: 0 }; for (const u of ids.values()) { s.in += u.input_tokens || 0; s.cw += u.cache_creation_input_tokens || 0; s.cr += u.cache_read_input_tokens || 0; }
  const inSide = s.in + 1.25 * s.cw + 0.1 * s.cr, outLo = chars / 3.5, outHi = chars / 2.5;
  const M = x => (x / 1e6).toFixed(2);
  const meta = f.replace(/\.jsonl$/, '.meta.json'); let desc = ''; try { desc = JSON.parse(fs.readFileSync(meta, 'utf8')).description || ''; } catch {}
  console.log(`${desc.padEnd(34).slice(0, 34)} | lượt ${String(ids.size).padStart(2)} | phía vào ${M(inSide)}M (ghi cache ${s.cw}, đọc cache ${s.cr}) | output ≈ ${Math.round(outLo / 1000)}k–${Math.round(outHi / 1000)}k | quy đổi ≈ ${M(inSide + 5 * outLo)}–${M(inSide + 5 * outHi)}M | ${((last - first) / 60000).toFixed(1)} phút`);
}
