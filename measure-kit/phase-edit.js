// Chi phí theo bước của tweak-site, evolve-site, handover-check. node phase-edit.js <a.jsonl> … [--list]
// Skill nhận từ prompt ("Chạy skill tweak-site" …). Mỗi lượt (một message id) thuộc một bước, theo dấu hiệu trong lệnh gọi của lượt đó.
// tweak-site: bước theo dấu hiệu cao nhất của chính lượt (sửa rồi kiểm lại thì quay về "sửa"); lượt không có dấu hiệu theo lượt trước.
//   tìm      grep/rg trong site/ · grep/rg ngoài thư mục skills trước lần sửa đầu · qa_init.py · quick.py --dry · quick.py --note "trước tweak…"
//   đọc      Read file dự án (site/, FEATURE-DECISIONS.md, DESIGN.md, AGENTS.md) · sed -n/cat/head/tail site/ hay DESIGN.md, trước lần sửa đầu
//   sửa      Write/Edit vào site/ (hay sed -i, python, cat > vào site/)
//   kiểm     quick.py --note (không phải "trước tweak") · preflight.py · run_all.py · qa_init.py sau lần sửa (skill bản cũ chạy nó ngay trước lần kiểm)
//   ảnh      Read ảnh · lệnh chụp (run.mjs, --screenshot, playwright) · sau lần sửa: đọc run.mjs, quick.py --help (đi tìm cách chụp)
//   nhật ký  Write/Edit FEATURE-DECISIONS.md · sau lần sửa: lệnh hay Read có FEATURE-DECISIONS (tra khuôn)
//   báo cáo  lượt cuối: chữ, hoặc chỉ lệnh SubagentHandback (cả ba skill)
//   Trước dấu hiệu đầu là "vào" (đọc SKILL.md và tài liệu skill).
// evolve-site và handover-check: bước chỉ tăng (sửa ở B4 vẫn là B4).
//   evolve  B1: mặc định từ đầu (SKILL.md, b1-b2.md, DESIGN.md, dữ liệu, qa_init, quick --dry, run_all _qa/truoc, preflight --save)
//           B2 · cổng: integration-patterns.md · search.py · ghi FEATURE-DECISIONS.md có "Cổng 1" hay "Cổng 2" khi chưa sửa site/
//               (lượt chỉ có dấu hiệu B2 sau lượt vào 2, chưa sửa site/, vẫn là B2; các lượt sau vẫn là B3)
//           B3: Read references/b3-b4.md · ghi steps-*.json, qa.config.json, site/, BUILD-LOG.md · run_all.py _qa/.tdd · themes.mjs
//           B4: quick.py --note (không phải "trước evolve") · breaktest.py · regression-qa.md (sau khi đã sửa site/) · laws-of-ux · Read ảnh ngoài _qa/.tdd/ sau khi đã sửa site/
//               (ảnh _qa/.tdd/ trước B4 là gỡ lỗi bộ tính năng, vẫn là B3)
//           Cổng 3: ghi FEATURE-DECISIONS.md có "Cổng 3" khi đã vào B4 (khối tính năng ghi ở B3 có sẵn tiêu đề Cổng 3 của khuôn) · lượt cuối
//   handover B0–B1: mặc định (SKILL.md, qa_init, handover.py ledger, ledger.jsonl, FEATURE-DECISIONS.md, quick --dry)
//           B2: handover.py thumbs · ghi steps-*.json · quick.py --note "handover…"
//           B3: handover.py run · qa-check.py
//           B4: run_all.py _qa/.recheck · handover.json · git diff · compare.py · Read ảnh
//           B5: regression-qa.md · laws-of-ux · qa-gate.md
//           B6: ghi DESIGN.md hay QA.md · sau khi đã vào B5: Read DESIGN.md, lệnh nhắc DESIGN.md hay QA.md, đếm chỗ dùng (grep -c, grep -o … | wc -l)
//           Cổng: ghi DECISIONS.md · lượt cuối
// Chi phí lượt, lượt mất cache và thời gian: như phase-site.js.
const fs = require('fs'), path = require('path');
const { short } = require('./paths');
const args = process.argv.slice(2), list = args.includes('--list');
const STEPS = {
  'tweak-site': ['vào', 'tìm', 'đọc', 'sửa', 'kiểm', 'ảnh', 'nhật ký', 'báo cáo'],
  'evolve-site': ['B1', 'B2 · cổng', 'B3', 'B4', 'Cổng 3'],
  'handover-check': ['B0–B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'Cổng'],
};

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
// Lệnh có biến (S="<skills>…" hay P=/đường/dẫn;): thay biến bằng giá trị trước khi so dấu hiệu
const expand = cmd => {
  const v = {};
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const CMD = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(String(c.input.command || '').replace(/\\/g, '/')) : '';
const BODY = c => String((c.input || {}).content || (c.input || {}).new_string || '');
const writes = c => c.name === 'Write' || c.name === 'Edit';
// Chạy thật: chương trình và script trong cùng một đoạn lệnh (không qua ; && |), không tính grep/sed đọc mã
const run = (bin, file) => new RegExp(`\\b${bin}\\b(?:(?!&&)[^;\\n|])*${file}`);
const py = f => run('python3?', f);
const quickNote = cmd => py('quick\\.py').test(cmd) && /--note/.test(cmd);
const siteWrite = c => writes(c) && /\/site\//.test(P(c))
  || /\bsed\s+-i\b|\.write\(|write_text|cat\s*>/.test(CMD(c)) && /\/site\//.test(CMD(c));
// Ghi file qua Bash (cat >>, tee, python open(…,'w'|'a')): f là regex tên file, không neo
const shWrite = (cmd, f) => new RegExp(String.raw`(?:cat\s*>>?|tee(?:\s+-a)?)\s*["']?[^\s;&|"'<>]*` + f.source).test(cmd)
  || /\bpython3?\b/.test(cmd) && new RegExp(String.raw`(?:\bp\s*=\s*|open\(\s*)["'][^"']*` + f.source + `["']`).test(cmd) && /open\([^)]*['"][wa]['"]|write_text|\.write\(/.test(cmd);
// Write/Edit vào file khớp re, hay ghi qua Bash; nội dung ghi lấy từ lệnh khi ghi qua Bash
const writesTo = (c, re, f) => writes(c) && re.test(P(c)) || shWrite(CMD(c), f);
const body = c => BODY(c) || CMD(c);
const img = c => c.name === 'Read' && /\.(png|jpe?g)$/i.test(P(c));
const SHOT = /(msedge|chrome|chromium)(?:(?!&&)[^;\n|])*--screenshot|playwright\s+screenshot|\bnode\b(?:(?!&&)[^;\n|])*run\.mjs/i;

// Dấu hiệu của một lệnh gọi: chỉ số bước, -1 = không là dấu hiệu. st: trạng thái lần chạy (đã sửa site/ chưa)
const MARK = {
  'tweak-site'(c, st) {
    const p = P(c), cmd = CMD(c);
    if (writesTo(c, /FEATURE-DECISIONS\.md$/, /FEATURE-DECISIONS\.md/)) return 6;
    if (st.edited && /FEATURE-DECISIONS/.test(p + ' ' + cmd)) return 6;
    if (img(c) || SHOT.test(cmd)) return 5;
    if (st.edited && (/run\.mjs/.test(cmd) || py('quick\\.py\\s+--help').test(cmd))) return 5;
    if (quickNote(cmd) && !/trước tweak/.test(cmd) || py('preflight\\.py').test(cmd) || py('run_all\\.py').test(cmd)) return 4;
    if (st.edited && py('qa_init\\.py').test(cmd)) return 4;
    if (siteWrite(c)) return 3;
    if (!st.edited && c.name === 'Read' && /\/(site\/|FEATURE-DECISIONS\.md$|DESIGN\.md$|AGENTS\.md$|CLAUDE\.md$)/.test(p)) return 2;
    if (!st.edited && /\b(sed\s+-n|cat|head|tail)\b[^;\n|]*(site\/|DESIGN\.md)/.test(cmd)) return 2;
    if (!st.edited && /\b(grep|rg)\b/.test(cmd) && !/tapora-proto-kit\/skills/.test(cmd)) return 1;
    if (/\b(grep|rg)\b[^;\n|]*\/site\b/.test(cmd) || py('qa_init\\.py').test(cmd) || py('quick\\.py\\s+--(dry|note)').test(cmd)) return 1;
    return -1;
  },
  'evolve-site'(c, st) {
    const p = P(c), cmd = CMD(c), s = p + ' ' + cmd;
    if (writesTo(c, /FEATURE-DECISIONS\.md$/, /FEATURE-DECISIONS\.md/) && /Cổng 3/.test(body(c)) && st.edited && st.cur >= 3) return 4;
    if (quickNote(cmd) && !/trước evolve/.test(cmd) || py('breaktest\.py').test(cmd)) return 3;
    if (st.edited && (/regression-qa\.md/.test(s) || /laws-of-ux/.test(s) || img(c) && !/\/_qa\/\.tdd\//.test(p))) return 3;
    if (c.name === 'Read' && /evolve-site\/references\/b3-b4\.md$/.test(p)) return 2;
    if (writes(c) && /\/_qa\/(steps-[^\/]+\.json|qa\.config\.json)$|BUILD-LOG\.md$/.test(p) || siteWrite(c)) return 2;
    if (py('run_all\\.py').test(cmd) && /\.tdd/.test(cmd) || run('node', 'themes\\.mjs').test(cmd)) return 2;
    if (/integration-patterns\.md|search\.py/.test(s)) return 1;
    if (!st.edited && writesTo(c, /FEATURE-DECISIONS\.md$/, /FEATURE-DECISIONS\.md/) && /Cổng [12]/.test(body(c))) return 1;
    return -1;
  },
  'handover-check'(c, st) {
    const p = P(c), cmd = CMD(c), s = p + ' ' + cmd;
    if (writesTo(c, /\/DECISIONS\.md$/, /(?<![\w-])DECISIONS\.md/)) return 6;
    if (writesTo(c, /(DESIGN|QA)\.md$/, /(?:DESIGN|QA)\.md/)) return 5;
    // Chuẩn bị B6 sau khi chấm UX: đọc DESIGN.md, tìm QA.md, đếm chỗ dùng
    if (st.cur >= 4 && (/(?<![\w-])(DESIGN|QA)\.md\b/.test(s) || /\bgrep\s+-\w*c\b|\bgrep\s+-\w*o\b[^;\n]*\|\s*wc\s+-l/.test(cmd))) return 5;
    if (/regression-qa\.md|laws-of-ux|qa-gate\.md/.test(s)) return 4;
    if (py('run_all\\.py').test(cmd) && /\.recheck/.test(cmd) || /handover\.json|git\s+(-C\s+\S+\s+)?diff|compare\.py/.test(cmd) || img(c)) return 3;
    if (py('handover\\.py\\s+run').test(cmd) || py('qa-check\\.py').test(cmd)) return 2;
    if (py('handover\\.py\\s+thumbs').test(cmd) || writes(c) && /\/_qa\/steps-[^\/]+\.json$/.test(p) || quickNote(cmd)) return 1;
    return -1;
  },
};
const ranges = a => a.reduce((r, x) => { const l = r[r.length - 1]; if (l && x === l[1] + 1) l[1] = x; else r.push([x, x]); return r; }, []).map(([x, y]) => x === y ? `${x}` : `${x}–${y}`).join(',');

for (const f of args.filter(a => !a.startsWith('--'))) {
  const turns = load(f);
  let prompt = ''; for (const l of fs.readFileSync(f, 'utf8').split('\n')) { if (!l.trim()) continue; const o = JSON.parse(l); if (o.type === 'user') { const c = o.message.content; prompt = typeof c === 'string' ? c : (c || []).map(x => x.text || '').join(''); break; } }
  const skill = (/Chạy skill (tweak-site|evolve-site|handover-check)/.exec(prompt) || [])[1];
  if (!skill) { console.log(`\n== ${path.basename(f)}: không nhận ra skill trong prompt`); continue; }
  const arm = (/\/(cu|moi)\/tapora-proto-kit\/skills/.exec(prompt) || [])[1] || '?';
  const S = STEPS[skill], monotonic = skill !== 'tweak-site', last = S.length - 1, st = { edited: false };
  let cur = 0;
  turns.forEach((t, i) => {
    st.cur = cur;
    const m = Math.max(-1, ...t.calls.map(c => MARK[skill](c, st)));
    if (t.calls.some(siteWrite)) st.edited = true;
    if (monotonic) { if (m > cur) cur = m; } else if (m >= 0) cur = m;
    if (!monotonic && i === 0) cur = 0; // tweak: lượt 1 (đọc SKILL.md, có khi kèm AGENTS.md) luôn là "vào"
    // Lượt cuối: chữ, hoặc chỉ lệnh SubagentHandback (subagent nộp báo cáo qua công cụ này)
    if (i === turns.length - 1 && t.calls.every(c => c.name === 'SubagentHandback')) cur = last;
    t.step = cur;
    // evolve: lượt chỉ có dấu hiệu B2 (integration-patterns, khuôn cổng) sau lượt vào 2 mà chưa sửa site/: lượt đó là B2, bước hiện tại giữ B3
    if (skill === 'evolve-site' && cur === 2 && m === 1 && !st.edited) t.step = 1;
  });
  const agg = S.map(() => ({ n: 0, cost: 0, miss: 0, ms: 0, at: [] }));
  turns.forEach((t, i) => { const a = agg[t.step]; a.n++; a.cost += t.cost; a.miss += t.miss; a.ms += t.ms; a.at.push(i + 1); });
  // Subagent con: tìm .meta.json cùng thư mục có parentAgentId = mã của transcript này
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
  console.log(`\n== ${desc || me} · ${skill} · bản ${arm} · ${turns.length} lượt · ${(tot / 1e6).toFixed(2)}M quy đổi (out 3 ký tự/token)${miss ? ` · trừ lượt mất cache ${((tot - miss) / 1e6).toFixed(2)}M` : ''} · ${mn(ms).trim()}`);
  console.log(`  bước       lượt  quy đổi  mất cache   thời gian  lượt số`);
  agg.forEach((a, s) => { if (a.n) console.log(`  ${S[s].padEnd(9)} ${String(a.n).padStart(4)} ${k(a.cost)} ${a.miss ? k(a.miss) : '      -'}  ${mn(a.ms)}  ${ranges(a.at)}`); });
  for (const x of kids) console.log(`  + subagent ${x.type} "${x.desc}": ${x.n} lượt · ${k(x.cost).trim()}`);
  if (list) turns.forEach((t, i) => {
    const what = t.calls.map(c => c.name === 'Bash' || c.name === 'PowerShell' ? c.name[0] + ':' + short(CMD(c)).replace(/\s+/g, ' ').slice(0, 70) : c.name + ' ' + P(c).split('/').slice(-2).join('/')).join(' | ');
    console.log(`  ${String(i + 1).padStart(2)} ${S[t.step].padEnd(9)} ${k(t.cost)} ${t.miss ? 'MẤT CACHE ' : ''}${what || '(chữ)'}`);
  });
}
