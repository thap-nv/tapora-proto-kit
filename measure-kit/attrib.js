// Quy chi phí của mỗi lượt cho thứ làm ngữ cảnh lớn lên ở lượt đó.
// Phần ngữ cảnh thêm ở lượt t: ghi cache một lần (1,25) rồi đọc lại ở mọi lượt sau (0,1 mỗi lượt).
const fs = require('fs');
const { inSkills } = require('./paths');
const cat = (c, res) => {
  const i = c.input || {}, n = c.name;
  if (n === 'Read') {
    const p = String(i.file_path || '');
    if (/\.png$/i.test(p)) return 'ảnh mở ra xem';
    if (inSkills(p.replace(/\\/g, '/')) || /tapora-proto-kit\/skills/i.test(p)) return 'đọc tài liệu skill (Read)';
    return 'đọc file dự án (Read)';
  }
  if (n === 'Bash') {
    const cmd = String(i.command || '');
    if (/shots\.mjs/.test(cmd)) return 'chụp (shots.mjs)';
    if (/--vi-fonts|--font/.test(cmd)) return 'tra/kiểm font';
    if (/search\.py/.test(cmd)) return 'search.py';
    if (/preflight\.py/.test(cmd)) return 'preflight';
    if (/sed -n|grep|cat |head|awk/.test(cmd) && /skills/.test(cmd)) return 'in mục tài liệu (sed/grep)';
    if (/node -e/.test(cmd)) return 'node -e (đo màu, kiểm dữ liệu)';
    return 'bash khác';
  }
  if (n === 'Write') return 'viết file (Write)';
  if (n === 'Edit') return 'sửa file (Edit)';
  if (n === 'Agent' || n === 'Task') return 'gọi subagent';
  return n;
};
for (const f of process.argv.slice(2)) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = []; const byId = new Map();
  for (const o of L) {
    if (o.type !== 'assistant' || !o.message) continue;
    const m = o.message, u = m.usage || {};
    let t = byId.get(m.id);
    if (!t) { t = { ctx: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), calls: [], out: 0 }; byId.set(m.id, t); turns.push(t); }
    for (const c of m.content || []) {
      if (c.type === 'tool_use') t.calls.push(c);
      if (c.type === 'tool_use') t.out += JSON.stringify(c.input).length;
      if (c.type === 'text') t.out += c.text.length;
    }
  }
  const T = turns.length, agg = {}; let base = turns[0].ctx;
  agg['nền lúc bắt đầu (system, prompt)'] = base * (1.25 + 0.1 * (T - 1));
  for (let k = 0; k < T - 1; k++) {
    const d = Math.max(0, turns[k + 1].ctx - turns[k].ctx), w = 1.25 + 0.1 * (T - k - 2);
    const calls = turns[k].calls;
    const key = calls.length ? [...new Set(calls.map(c => cat(c)))].join(' + ') : 'chữ/suy nghĩ';
    const keys = calls.length ? calls.map(c => cat(c)) : ['chữ/suy nghĩ'];
    for (const kk of keys) agg[kk] = (agg[kk] || 0) + d * w / keys.length;
  }
  let outChars = turns.reduce((s, t) => s + t.out, 0);
  agg['output ×5 (ước, 3 ký tự/token)'] = 5 * outChars / 3;
  const tot = Object.values(agg).reduce((a, b) => a + b, 0);
  let meta = ''; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  console.log(`\n== ${meta} · ${T} lượt · ngữ cảnh ${Math.round(turns[0].ctx/1000)}k → ${Math.round(turns[T-1].ctx/1000)}k · ≈ ${(tot/1e6).toFixed(2)}M`);
  for (const [k, v] of Object.entries(agg).sort((a, b) => b[1] - a[1])) if (v / tot > 0.02) console.log(`  ${(v / tot * 100).toFixed(0).padStart(3)}%  ${(v / 1e3).toFixed(0).padStart(5)}k  ${k}`);
}
