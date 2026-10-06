// Chi phí theo bước của sketch-to-map. node phase-map.js <a.jsonl> … [--list]
// Mỗi lượt (một message id) thuộc một bước; bước chỉ tăng (sửa ở bước kiểm vẫn là bước kiểm). Dấu hiệu trong lệnh gọi của lượt:
//   vào           mặc định từ đầu: đọc SKILL.md, m1-kiem-ke.md, CONCEPT.md, DECISIONS.md
//   M0            chạy sources.py
//   M1            Read tài liệu (map/_src/, docs/) · ghi map/features.js hay map/parts/ · map.mjs merge · Agent khi chưa có layout.js (worker)
//   M2            Read m2-bo-cuc.md · map.mjs check --brief · ghi map/layout.js lần đầu
//   kiểm bố cục   map.mjs check sau khi đã có layout.js (không --brief) · visible --treetest · Agent sau khi đã có layout.js (soát nhãn)
//                 · Read ảnh map/_shots/ · sửa layout.js hay features.js sau lần check đầu có layout.js
//   cổng          ghi DECISIONS.md có "Cổng Bản đồ" · lượt cuối (chữ, hay chỉ SubagentHandback)
// Chi phí lượt, lượt mất cache và thời gian: như phase-edit.js. Subagent con (worker, người thử) tính riêng từ .meta.json cùng thư mục.
const fs = require('fs'), path = require('path');
const { short } = require('./paths');
const args = process.argv.slice(2), list = args.includes('--list');
const S = ['vào', 'M0', 'M1', 'M2', 'kiểm bố cục', 'cổng'];

function load(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(); let lastUser = null, lastTs = null;
  for (const o of L) {
    const ts = o.timestamp ? Date.parse(o.timestamp) : null; if (ts) lastTs = ts;
    if (o.type === 'user') lastUser = ts;
    if (o.type !== 'assistant' || !o.message) continue;
    const m = o.message; let t = byId.get(m.id);
    if (!t) { t = { id: m.id, u: m.usage || {}, calls: [], out: 0, req: lastUser }; byId.set(m.id, t); turns.push(t); }
    if (m.usage) t.u = m.usage;
    for (const c of m.content || []) {
      if (c.type === 'tool_use') { t.calls.push(c); t.out += JSON.stringify(c.input).length; }
      if (c.type === 'text') t.out += c.text.length;
    }
  }
  turns.forEach((t, i) => {
    const u = t.u, n = turns[i + 1];
    t.cost = (u.input_tokens || 0) + 1.25 * (u.cache_creation_input_tokens || 0) + 0.1 * (u.cache_read_input_tokens || 0) + 5 * t.out / 3;
    t.ms = (n && n.req ? n.req : lastTs) - t.req;
    const p = turns[i - 1];
    if (p) {
      const exp = (p.u.cache_read_input_tokens || 0) + (p.u.cache_creation_input_tokens || 0), cr = u.cache_read_input_tokens || 0;
      t.miss = cr < exp - 20000 ? (exp - cr) * (1.25 - 0.1) : 0;
    } else t.miss = 0;
  });
  return turns;
}

const P = c => String((c.input || {}).file_path || '').replace(/\\/g, '/');
// Lệnh có biến (S="<skills>…" hay K=…/map.mjs;): thay biến bằng giá trị trước khi so dấu hiệu (như phase-edit.js)
const expand = cmd => {
  const v = {};
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const CMD = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(String(c.input.command || '').replace(/\\/g, '/')) : '';
const writes = c => c.name === 'Write' || c.name === 'Edit';
const mapjs = (cmd, sub) => new RegExp(`map\\.mjs"?\\s+${sub}\\b`).test(cmd);
const isAgent = c => c.name === 'Agent' || c.name === 'Task';

function mark(c, st) {
  const p = P(c), cmd = CMD(c);
  if (writes(c) && /\/DECISIONS\.md$/.test(p) && /Cổng Bản đồ/.test((c.input.content || '') + (c.input.new_string || ''))) return 5;
  if (/Cổng Bản đồ/.test(cmd) && /DECISIONS\.md/.test(cmd)) return 5;
  if (st.layout && (mapjs(cmd, 'check') && !/--brief/.test(cmd) || mapjs(cmd, 'visible') || isAgent(c))) return 4;
  if (c.name === 'Read' && /\/map\/_shots\/.*\.png$/i.test(p)) return 4;
  if (st.checked && writes(c) && /\/map\/(layout|features)\.js$/.test(p)) return 4;
  if (c.name === 'Read' && /sketch-to-map\/references\/m2-bo-cuc\.md$/.test(p) || mapjs(cmd, 'check') && /--brief/.test(cmd)) return 3;
  if (writes(c) && /\/map\/layout\.js$/.test(p)) return 3;
  if (c.name === 'Read' && /\/(map\/_src|docs)\//.test(p) || writes(c) && /\/map\/(features\.js|parts\/)/.test(p) || mapjs(cmd, 'merge') || !st.layout && isAgent(c)) return 2;
  if (/\bsources\.py\b/.test(cmd) && /\bpython3?\b/.test(cmd)) return 1;
  return -1;
}
const ranges = a => a.reduce((r, x) => { const l = r[r.length - 1]; if (l && x === l[1] + 1) l[1] = x; else r.push([x, x]); return r; }, []).map(([x, y]) => x === y ? `${x}` : `${x}–${y}`).join(',');

for (const f of args.filter(a => !a.startsWith('--'))) {
  const turns = load(f);
  const st = { layout: false, checked: false };
  let cur = 0;
  turns.forEach((t, i) => {
    const m = Math.max(-1, ...t.calls.map(c => mark(c, st)));
    if (m > cur) cur = m;
    if (i === turns.length - 1 && t.calls.every(c => c.name === 'SubagentHandback')) cur = S.length - 1;
    t.step = cur;
    if (t.calls.some(c => writes(c) && /\/map\/layout\.js$/.test(P(c)))) st.layout = true;
    if (st.layout && t.calls.some(c => mapjs(CMD(c), 'check') && !/--brief/.test(CMD(c)))) st.checked = true;
  });
  const agg = S.map(() => ({ n: 0, cost: 0, miss: 0, ms: 0, at: [] }));
  turns.forEach((t, i) => { const a = agg[t.step]; a.n++; a.cost += t.cost; a.miss += t.miss; a.ms += t.ms; a.at.push(i + 1); });
  const dir = path.dirname(f), me = path.basename(f).replace(/^agent-|\.jsonl$/g, ''); const kids = [];
  for (const m of fs.readdirSync(dir).filter(x => x.endsWith('.meta.json'))) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, m), 'utf8')); } catch { continue; }
    if (j.parentAgentId !== me) continue;
    const kt = load(path.join(dir, m.replace(/\.meta\.json$/, '.jsonl')));
    kids.push({ type: j.agentType, desc: j.description, n: kt.length, cost: kt.reduce((s, t) => s + t.cost, 0) });
  }
  let desc = ''; try { desc = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  const tot = turns.reduce((s, t) => s + t.cost, 0), miss = turns.reduce((s, t) => s + t.miss, 0), ms = turns.reduce((s, t) => s + t.ms, 0);
  const k = x => String(Math.round(x / 1000)).padStart(5) + 'k', mn = x => (x / 60000).toFixed(1).padStart(5) + ' phút';
  console.log(`\n== ${desc || me} · sketch-to-map · ${turns.length} lượt · ${(tot / 1e6).toFixed(2)}M quy đổi (out 3 ký tự/token)${miss ? ` · trừ lượt mất cache ${((tot - miss) / 1e6).toFixed(2)}M` : ''} · ${mn(ms).trim()}`);
  console.log(`  bước          lượt  quy đổi  mất cache   thời gian  lượt số`);
  agg.forEach((a, s) => { if (a.n) console.log(`  ${S[s].padEnd(12)} ${String(a.n).padStart(4)} ${k(a.cost)} ${a.miss ? k(a.miss) : '      -'}  ${mn(a.ms)}  ${ranges(a.at)}`); });
  for (const x of kids) console.log(`  + subagent ${x.type} "${x.desc}": ${x.n} lượt · ${k(x.cost).trim()}`);
  if (kids.length) console.log(`  tổng kể cả subagent: ${((tot + kids.reduce((s, x) => s + x.cost, 0)) / 1e6).toFixed(2)}M`);
  if (list) turns.forEach((t, i) => {
    const what = t.calls.map(c => c.name === 'Bash' || c.name === 'PowerShell' ? c.name[0] + ':' + short(CMD(c)).replace(/\s+/g, ' ').slice(0, 80) : c.name + ' ' + P(c).split('/').slice(-2).join('/')).join(' | ');
    console.log(`  ${String(i + 1).padStart(2)} ${S[t.step].padEnd(12)} ${k(t.cost)} ${t.miss ? 'MẤT CACHE ' : ''}${what || '(chữ)'}`);
  });
}
