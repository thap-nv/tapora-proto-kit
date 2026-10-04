// Chi phí theo bước của sketch-to-site: B0, B1, B2, Cổng 3 (pha 1) · B0, B3, B4, Cổng 4 (pha 2). node phase-site.js <a.jsonl> … [--list]
// Pha nhận từ prompt: có "Làm B3" là pha 2. Mỗi lượt (một message id) thuộc một bước, theo dấu hiệu trong lệnh gọi của lượt đó.
// Pha 1: agent làm B1 và B2 xen nhau, nên lượt lấy dấu hiệu cao nhất của chính nó; lượt không có dấu hiệu theo lượt trước. Trước dấu hiệu đầu là B0.
//   B1   trước lần ghi đầu vào site/: đọc concept/ (màn, concepts.js, ảnh) · chạy run.mjs hoặc chụp trên concept/ · trang HTML thử ngoài site/ và lệnh chụp nó · reference-intake.md.
//        Lúc nào cũng: Edit DECISIONS.md (giả định, kết quả thử concept; Cổng 3 ở pha 1 chưa có đáp án để ghi)
//   B2   ghi file trong site/ hoặc DESIGN.md · lệnh có site/, themes.mjs, preflight.py, khuôn B2 (themes.json, tokens.css, DESIGN.md, system.html, theme.js, color.js) · Read khuôn đó hay themes.mjs
//   Cổng 3  chụp _system.html để trình: --screenshot ở khổ 1440, hoặc ra _qa/ hay cong-3/ (cả hai lần đo đầu đặt tên vậy) · mở ảnh system-…1440 hay ảnh trong _qa/, cong-3/ · lượt cuối (câu trả lời).
//        Chụp _system.html ra chỗ khác để tự soát rồi sửa là B2.
// Bản 4.5: lượt vào có Read references/b0-b2.md (pha 1) hay b3-b4.md (pha 2) là B0, dù lệnh cùng lượt chép khuôn vào site/ hay in rules-and-conflicts.md.
// Pha 2: bước chỉ tăng B0 → B3 → B4 → Cổng 4 (sửa trang ở B4 vẫn là B4). Lối vào lại (đọc SKILL.md, CONCEPT.md, DESIGN.md) là B0.
//   B3   BUILD-LOG.md · rules-and-conflicts.md · ghi file trong site/ (Write, Edit, hay python/sed -i/cat >/cp vào site/)
//   B4   chạy qa_init.py, handover.py, run_all.py · laws-of-ux · gọi subagent · qa-gate.md khi đã có trang (đọc trước để chuẩn bị thì không tính)
//   Cổng 4  Edit/Write DECISIONS.md ghi Cổng 4 · lượt cuối
// Chi phí lượt = input + 1,25 × ghi cache + 0,1 × đọc cache + 5 × output (ước 3 ký tự một token), như parts2.js.
// Lượt mất cache: đọc cache tụt dưới (đọc + ghi) của lượt trước hơn 20k; phần tốn thêm = phần mất × (1,25 − 0,1), như fixes.js.
// Thời gian lượt = từ lần gửi của lượt tới lần gửi của lượt sau (lượt cuối: tới dòng cuối của transcript).
const fs = require('fs'), path = require('path');
const { short } = require('./paths');
const STEPS = ['B0', 'B1', 'B2', 'Cổng 3', 'B3', 'B4', 'Cổng 4'];
const args = process.argv.slice(2), list = args.includes('--list');

function load(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(); let lastUser = null, lastTs = null;
  for (const o of L) {
    const ts = o.timestamp ? Date.parse(o.timestamp) : null; if (ts) lastTs = ts;
    if (o.type === 'user') lastUser = ts;
    if (o.type !== 'assistant' || !o.message) continue;
    const m = o.message; let t = byId.get(m.id);
    if (!t) { t = { id: m.id, u: m.usage || {}, calls: [], out: 0, req: lastUser, first: ts, last: ts }; byId.set(m.id, t); turns.push(t); }
    if (m.usage) t.u = m.usage; t.last = ts;
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
// Lệnh có biến (S="<skills>…" hay S=<skills>; cat "$S/…"): thay biến bằng giá trị trước khi so dấu hiệu
const expand = cmd => {
  const v = {};
  // có ngoặc kép (S="…") hay không (S=/đường/dẫn;); bỏ qua giá trị là $(…)
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const CMD = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(String(c.input.command || '').replace(/\\/g, '/')) : '';
const BODY = c => String((c.input || {}).content || (c.input || {}).new_string || '');
const writes = c => c.name === 'Write' || c.name === 'Edit';

// Bước mà một lệnh gọi đánh dấu (chỉ số trong STEPS); -1 = không là dấu hiệu
const SHOT = /--screenshot|shots\.mjs|playwright\s+screenshot/;
function marker1(c, siteWritten) {
  const p = P(c), cmd = CMD(c), s = p + ' ' + cmd;
  if (c.name === 'SubagentHandback') return 3;
  if (/_system\.html/.test(cmd) && (SHOT.test(cmd) && /1440/.test(cmd) || /\/_qa\/|cong-?3/.test(cmd) && /run\.mjs|--screenshot/.test(cmd))) return 3;
  if (c.name === 'Read' && /\.(png|jpe?g)$/i.test(p) && (/\/(_qa|[^\/]*cong-?3)\//.test(p) || /system[^\/]*1440[^\/]*$/.test(p) || /\/_shots\/system\/[^\/]*-full\.png$/.test(p))) return 3;
  if (writes(c) && /\/site\/|DESIGN\.md$/.test(p)) return 2;
  if (/\/site\b|themes\.mjs|system-check\.mjs|preflight\.py|templates\/(themes\.json|tokens\.css|DESIGN\.md|system\.html|theme\.js|color\.js)/.test(cmd)) return 2;
  if (c.name === 'Read' && (/sketch-to-site\/(templates\/(DESIGN\.md|system\.html|themes\.json|tokens\.css|theme\.js|color\.js)|scripts\/themes\.mjs)$/.test(p) || /\/site\//.test(p))) return 2;
  if (writes(c) && /DECISIONS\.md$/.test(p)) return 1;
  if (siteWritten) return -1;
  if (c.name === 'Read' && /\/concept\//.test(p)) return 1;
  if (/\/concept\//.test(cmd) && /run\.mjs|--screenshot|shots\.mjs/.test(cmd)) return 1;
  // trang thử concept tự dựng ngoài site/ (lần đo đầu: _work/, _thu-concept/) và lệnh chụp trên nó
  if (writes(c) && /\.html$/.test(p) && !/\/site\//.test(p)) return 1;
  if (/run\.mjs|--screenshot/.test(cmd) && /\.html/.test(cmd) && !/\/site\//.test(cmd)) return 1;
  if (/reference-intake\.md/.test(s)) return 1;
  return -1;
}
// Ghi vào site/: Write/Edit, hay lệnh python/sed -i/cat >/cp có đường dẫn site/
const siteWrite = c => writes(c) && /\/site\//.test(P(c))
  || /\bsed\s+-i\b|\.write\(|write_text|cat\s*>|\bcp\b/.test(CMD(c)) && /\/site\//.test(CMD(c));
// Chạy thật: chương trình và script trong cùng một đoạn lệnh (không qua ; && |), không tính grep/sed đọc mã
const run = (bin, file) => new RegExp(`\\b${bin}\\b(?:(?!&&)[^;\\n|])*${file}`);
function marker2(c, page) {
  const p = P(c), cmd = CMD(c), s = p + ' ' + cmd;
  if (c.name === 'SubagentHandback') return 6;
  if (writes(c) && /DECISIONS\.md$/.test(p) && /🛑 Cổng 4|Số kiểm lúc trình/.test(BODY(c))) return 6;
  if (c.name === 'Agent' || c.name === 'Task') return 5;
  if ([run('python3?', 'qa_init\\.py'), run('python3?', 'handover\\.py'), run('python3?', 'run_all\\.py'), run('python3?', 'qa-check\\.py')].some(re => re.test(cmd)) || /laws-of-ux/.test(s)) return 5;
  if (/qa-gate\.md/.test(s) && page) return 5;
  if (/BUILD-LOG\.md|rules-and-conflicts\.md/.test(s)) return 4;
  if (siteWrite(c)) return 4;
  return -1;
}
const ranges = a => a.reduce((r, x) => { const l = r[r.length - 1]; if (l && x === l[1] + 1) l[1] = x; else r.push([x, x]); return r; }, []).map(([x, y]) => x === y ? `${x}` : `${x}–${y}`).join(',');

for (const f of args.filter(a => !a.startsWith('--'))) {
  const turns = load(f);
  let prompt = ''; for (const l of fs.readFileSync(f, 'utf8').split('\n')) { if (!l.trim()) continue; const o = JSON.parse(l); if (o.type === 'user') { const c = o.message.content; prompt = typeof c === 'string' ? c : (c || []).map(x => x.text || '').join(''); break; } }
  const pha2 = /Làm B3/.test(prompt);
  let cur = 0, siteWritten = false, page = false;
  turns.forEach((t, i) => {
    let m = Math.max(-1, ...t.calls.map(c => pha2 ? marker2(c, page) : marker1(c, siteWritten)));
    // Bản 4.5: lượt vào (Read references/b0-b2.md hay b3-b4.md, kèm lệnh chép khuôn hoặc in luật) là B0, khi chưa qua bước nào
    if (cur === 0 && t.calls.some(c => c.name === 'Read' && /references\/b(0-b2|3-b4)\.md$/.test(P(c)))) m = pha2 ? -1 : 0;
    if (t.calls.some(c => siteWrite(c) && /\/site\/(?!_system)[^\/\s"']+\.html/.test(P(c) + ' ' + CMD(c)))) page = true;
    // Lần sửa đầu vào site/ (Write, Edit, sed -i, python, cat >), không tính cp/mkdir: bản 4.5 chép khuôn ngay ở lượt vào
    if (t.calls.some(c => writes(c) && /\/site\//.test(P(c)) || /\bsed\s+-i\b|\.write\(|write_text|cat\s*>/.test(CMD(c)) && /\/site\//.test(CMD(c)))) siteWritten = true;
    if (pha2) { if (m > cur) cur = m; } else if (m >= 0) cur = m;
    if (i === turns.length - 1 && (!t.calls.length || m < 0)) cur = pha2 ? 6 : 3;
    t.step = cur;
  });
  const agg = STEPS.map(() => ({ n: 0, cost: 0, miss: 0, ms: 0, at: [] }));
  turns.forEach((t, i) => { const a = agg[t.step]; a.n++; a.cost += t.cost; a.miss += t.miss; a.ms += t.ms; a.at.push(i + 1); });
  // Subagent con (review B4): tìm .meta.json cùng thư mục có parentAgentId = mã của transcript này
  const dir = path.dirname(f), me = path.basename(f).replace(/^agent-|\.jsonl$/g, ''); const kids = [];
  for (const m of fs.readdirSync(dir).filter(x => x.endsWith('.meta.json'))) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, m), 'utf8')); } catch { continue; }
    if (j.parentAgentId !== me) continue;
    const kt = load(path.join(dir, m.replace(/\.meta\.json$/, '.jsonl')));
    kids.push({ type: j.agentType, desc: j.description, n: kt.length, cost: kt.reduce((s, t) => s + t.cost, 0), start: kt[0] ? (kt[0].u.input_tokens || 0) + (kt[0].u.cache_read_input_tokens || 0) + (kt[0].u.cache_creation_input_tokens || 0) : 0 });
  }
  let desc = ''; try { desc = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  const tot = turns.reduce((s, t) => s + t.cost, 0), miss = turns.reduce((s, t) => s + t.miss, 0), ms = turns.reduce((s, t) => s + t.ms, 0);
  const k = x => String(Math.round(x / 1000)).padStart(5) + 'k', mn = x => (x / 60000).toFixed(1).padStart(5) + ' phút';
  console.log(`\n== ${desc || me} · ${turns.length} lượt · ${(tot / 1e6).toFixed(2)}M quy đổi (out 3 ký tự/token)${miss ? ` · trừ lượt mất cache ${((tot - miss) / 1e6).toFixed(2)}M` : ''} · ${mn(ms).trim()}`);
  console.log(`  bước     lượt  quy đổi  mất cache   thời gian  lượt số`);
  agg.forEach((a, s) => { if (a.n) console.log(`  ${STEPS[s].padEnd(7)} ${String(a.n).padStart(4)} ${k(a.cost)} ${a.miss ? k(a.miss) : '      -'}  ${mn(a.ms)}  ${ranges(a.at)}`); });
  for (const x of kids) console.log(`  + subagent ${x.type} "${x.desc}": ${x.n} lượt · khởi đầu ${Math.round(x.start / 1000)}k · ${k(x.cost).trim()}`);
  if (list) turns.forEach((t, i) => {
    const what = t.calls.map(c => c.name === 'Bash' || c.name === 'PowerShell' ? c.name[0] + ':' + short(CMD(c)).replace(/\s+/g, ' ').slice(0, 70) : c.name + ' ' + P(c).split('/').slice(-2).join('/')).join(' | ');
    console.log(`  ${String(i + 1).padStart(2)} ${STEPS[t.step].padEnd(7)} ${k(t.cost)} ${t.miss ? 'MẤT CACHE ' : ''}${what || '(chữ)'}`);
  });
}
