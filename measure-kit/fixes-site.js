// Đếm các chỗ có thể sửa trong một lần chạy sketch-to-site. node fixes-site.js <a.jsonl> …
// Đánh số lượt như turns.js (mỗi message id của agent là một lượt).
// 1 tài liệu skill: đọc nguyên (Read không offset/limit, cat) mấy lần, ở lượt nào, dài bao nhiêu; đọc một phần (sed/awk/grep/head, Read có offset)
// 2 số lần chạy preflight.py, themes.mjs, qa_init.py, handover.py run · 3 số ảnh mở · 4 lượt có từ 2 lệnh
// 5 cat file sẽ sửa · 6 lỗi đường dẫn /w/… · 7 kết quả bị cắt giữa · 8 subagent review: loại, lượt, chi phí · 9 lượt mất cache
const fs = require('fs'), path = require('path');
const { SKILLS, inSkills } = require('./paths');
const norm = s => String(s || '').replace(/\\/g, '/');
// Lệnh có biến (S="<skills>…" hay S=<skills>; cat "$S/…"): thay biến bằng giá trị trước khi đếm
const expand = cmd => {
  const v = {};
  // có ngoặc kép (S="…") hay không (S=/đường/dẫn;); bỏ qua giá trị là $(…)
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const cmdOf = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(norm(c.input.command)) : '';
const fileOf = c => norm((c.input || {}).file_path);
const writes = c => c.name === 'Write' || c.name === 'Edit';
const conv = u => (u.input_tokens || 0) + 1.25 * (u.cache_creation_input_tokens || 0) + 0.1 * (u.cache_read_input_tokens || 0);

function load(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(), res = new Map();
  for (const o of L) {
    if (o.type === 'user' && Array.isArray(o.message?.content)) for (const c of o.message.content) if (c.type === 'tool_result')
      res.set(c.tool_use_id, { err: !!c.is_error, text: typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join('') });
    if (o.type !== 'assistant' || !o.message) continue;
    let t = byId.get(o.message.id);
    if (!t) { t = { u: o.message.usage || {}, calls: [], out: 0 }; byId.set(o.message.id, t); turns.push(t); }
    if (o.message.usage) t.u = o.message.usage;
    for (const c of o.message.content || []) {
      if (c.type === 'tool_use') { t.calls.push(c); t.out += JSON.stringify(c.input).length; }
      if (c.type === 'text') t.out += c.text.length;
    }
  }
  return { turns, res };
}

for (const f of process.argv.slice(2)) {
  const { turns: T, res } = load(f);
  const calls = T.flatMap((t, i) => t.calls.map(c => Object.assign(c, { turn: i + 1 })));
  const text = c => (res.get(c.id) || {}).text || '';
  let meta = ''; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  console.log(`\n== ${meta || path.basename(f)} · ${T.length} lượt · ${calls.length} lệnh gọi công cụ`);

  // 1 Tài liệu skill
  const docs = new Map();
  const doc = rel => { if (!docs.has(rel)) { let size = 0; try { size = fs.readFileSync(`${SKILLS}/${rel}`, 'utf8').length; } catch {} docs.set(rel, { size, full: [], part: [], chars: 0 }); } return docs.get(rel); };
  for (const c of calls) {
    if (c.name === 'Read' && inSkills(fileOf(c))) {
      const rel = fileOf(c).split('/skills/')[1]; if (!/\.(md|csv)$/.test(rel)) continue;
      const d = doc(rel); (c.input.offset || c.input.limit ? d.part : d.full).push(c.turn); d.chars += text(c).length;
      continue;
    }
    const cmd = cmdOf(c); if (!cmd) continue;
    const exp = cmd;
    const refs = [...new Set([...exp.matchAll(/skills\/([\w-]+\/(?:[\w-]+\/)*[\w.-]+\.(?:md|csv))/g)].map(m => m[1]))];
    for (const rel of refs) {
      const d = doc(rel);
      const esc = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const full = new RegExp(`\\bcat\\s+("[^"]*${esc}"|\\S*${esc})`).test(exp);
      (full ? d.full : d.part).push(c.turn); d.chars += text(c).length / refs.length;
    }
  }
  console.log(`  1 tài liệu skill (cỡ file · đọc nguyên ở lượt · đọc một phần ở lượt · ký tự vào ngữ cảnh):`);
  for (const [rel, d] of [...docs].sort((a, b) => b[1].chars - a[1].chars))
    console.log(`     ${String(Math.round(d.size / 100) / 10).padStart(5)}k  nguyên ${d.full.length ? d.full.join(',') : '-'}  ·  một phần ${d.part.length ? d.part.join(',') : '-'}  ·  ${Math.round(d.chars / 100) / 10}k  ${rel}`);
  // file dự án đọc nguyên từ 2 lần
  const proj = {};
  for (const c of calls) if (c.name === 'Read' && !inSkills(fileOf(c)) && !/\.(png|jpe?g)$/i.test(fileOf(c))) {
    const k = fileOf(c).split('/sample/')[1] || path.basename(fileOf(c)); (proj[k] = proj[k] || []).push(c.turn);
  }
  const again = Object.entries(proj).filter(([, v]) => v.length > 1);
  // đọc mã của skill (script, qa-kit) bằng sed/grep/head/cat/Read, không phải chạy nó
  const codeRe = /\b(sed|grep|head|tail|cat|awk|wc)\b(?:(?!&&)[^;\n])*?skills\/[^\s"';]+\.(py|mjs|js)\b/;
  // kể cả kiểu cd "<skills>/…/qa-kit" && sed -n … run.mjs (đường dẫn tương đối sau cd)
  const cdRe = /\bcd\s+"?[^"\n;&]*skills\/[^"\n;&]*"?\s*(&&|;)[^\n]*\b(sed|grep|head|tail|cat|awk|wc)\b[^;\n]*\.(py|mjs|js)\b/;
  const code = calls.filter(c => c.name === 'Read' && inSkills(fileOf(c)) && /\.(py|mjs|js)$/.test(fileOf(c)) || codeRe.test(cmdOf(c)) || cdRe.test(cmdOf(c)));
  const codeChars = code.reduce((n, c) => n + text(c).length, 0);
  console.log(`     đọc mã skill (script, qa-kit, khuôn .js): ${code.length} lệnh ở lượt ${[...new Set(code.map(c => c.turn))].join(',') || '-'} · ${Math.round(codeChars / 100) / 10}k ký tự`);
  console.log(`     file dự án Read từ 2 lần: ${again.map(([k, v]) => `${k} (lượt ${v.join(',')})`).join(' · ') || '-'}`);

  // 2 Lệnh kiểm
  // lần chạy thật: python/node và tên script trong cùng một đoạn lệnh (không qua ; && |), không tính grep/sed đọc mã
  const runs = re => calls.filter(c => re.test(cmdOf(c)));
  const exec = (bin, file) => new RegExp(`\\b${bin}\\b(?:(?!&&)[^;\\n|])*${file}`);
  const list = a => a.length ? `${a.length} (lượt ${[...new Set(a.map(c => c.turn))].join(',')})` : '0';
  const pf = runs(exec('python3?', 'preflight\\.py')), pfFont = pf.filter(c => /--font|--vi-fonts/.test(cmdOf(c)));
  console.log(`  2 preflight.py ${list(pf.filter(c => !pfFont.includes(c)))} · preflight --font/--vi-fonts ${list(pfFont)} · themes.mjs ${list(runs(exec('node', 'themes\\.mjs')))} · qa_init.py ${list(runs(exec('python3?', 'qa_init\\.py')))} · handover.py run ${list(runs(exec('python3?', 'handover\\.py\\s+run')))} · run.mjs ${list(runs(exec('node', 'run\\.mjs')))} · system-check.mjs ${list(runs(exec('node', 'system-check\\.mjs')))} · qa-check.py ${list(runs(exec('python3?', 'qa-check\\.py')))}`);
  // lệnh chụp: Edge/Chrome/Chromium --screenshot, node shots.mjs, playwright screenshot (run.mjs đếm riêng ở dòng 2)
  const shot = calls.filter(c => [/(msedge|chrome|chromium)(?:(?!&&)[^;\n|])*--screenshot/i, exec('node', 'shots\\.mjs'), /playwright\s+screenshot/].some(re => re.test(cmdOf(c))));
  const pngs = calls.filter(c => c.name === 'Read' && /\.(png|jpe?g)$/i.test(fileOf(c)));
  // 3–4
  console.log(`  3 lệnh chụp ${list(shot)} · ảnh mở ${list(pngs)}`);
  console.log(`  4 lượt có từ 2 lệnh: ${T.filter(t => t.calls.length > 1).length}/${T.length} · lượt chỉ 1 lệnh: ${T.filter(t => t.calls.length === 1).length} · ToolSearch đứng riêng: ${T.filter(t => t.calls.length === 1 && t.calls[0].name === 'ToolSearch').length}`);

  // 5 cat file sẽ sửa (cat rồi sau đó Write/Edit đúng file đó)
  const key = x => norm(x).replace(/"/g, '').replace(/^\/([a-z])\//, '$1:/').toLowerCase();
  const edited = calls.filter(writes).map(c => ({ file: key(fileOf(c)), turn: c.turn }));
  const catted = calls.flatMap(c => [...cmdOf(c).matchAll(/\bcat\s+("[^"]+"|[^\s|;&><]+)/g)].map(m => ({ file: key(m[1]), name: path.basename(m[1].replace(/"/g, '')), turn: c.turn })));
  const catEdit = catted.filter(x => edited.some(e => e.file === x.file && e.turn >= x.turn));
  console.log(`  5 cat file sẽ sửa: ${catEdit.length ? catEdit.map(x => `${x.name} (lượt ${x.turn})`).join(' · ') : '0'} · mọi cat: ${catted.length}`);

  // Write bị từ chối (file chưa Read) hoặc rm rồi Write lại trong 2 lượt
  const denied = calls.filter(c => writes(c) && /has not been read|must read|Read it first/i.test(text(c)));
  const rmThenWrite = calls.filter(c => /\brm\b/.test(cmdOf(c))).flatMap(c => calls
    .filter(w => w.name === 'Write' && w.turn > c.turn && w.turn <= c.turn + 2 && cmdOf(c).toLowerCase().includes(path.basename(fileOf(w)).toLowerCase()))
    .map(w => `${path.basename(fileOf(w))} (lượt ${c.turn}→${w.turn})`));
  console.log(`     Write bị từ chối vì chưa Read: ${list(denied)} · rm rồi Write lại: ${rmThenWrite.join(' · ') || '0'}`);

  // 6 đường dẫn /w/…, /c/…
  const posix = calls.filter(c => /(^|[\s"'=])\/[a-z]\//.test(cmdOf(c)));
  const pathErr = calls.filter(c => /\b(node|python3?|cp|ls|cat)\b/.test(cmdOf(c)) && /Cannot find module|No such file|can't open file|ENOENT|cannot find the path/i.test(text(c)));
  console.log(`  6 lệnh dùng /x/…: ${list(posix)} · lỗi không thấy file: ${list(pathErr)}`);

  // 7 kết quả bị cắt giữa; lỗi
  const cut = calls.filter(c => /characters truncated/.test(text(c)));
  const errs = calls.filter(c => (res.get(c.id) || {}).err);
  console.log(`  7 kết quả bị cắt giữa: ${list(cut)} · kết quả lỗi (mã khác 0): ${list(errs)}`);

  // 8 subagent: lệnh gọi trong transcript + transcript con (tìm theo parentAgentId)
  const ag = calls.filter(c => c.name === 'Agent' || c.name === 'Task');
  const dir = path.dirname(f), me = path.basename(f).replace(/^agent-|\.jsonl$/g, ''); const kids = [];
  for (const m of fs.readdirSync(dir).filter(x => x.endsWith('.meta.json'))) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, m), 'utf8')); } catch { continue; }
    if (j.parentAgentId !== me) continue;
    const k = load(path.join(dir, m.replace(/\.meta\.json$/, '.jsonl'))).turns;
    const start = k[0] ? (k[0].u.input_tokens || 0) + (k[0].u.cache_read_input_tokens || 0) + (k[0].u.cache_creation_input_tokens || 0) : 0;
    kids.push(`${j.agentType} "${j.description}" ${k.length} lượt, khởi đầu ${Math.round(start / 1000)}k, ${(k.reduce((s, t) => s + conv(t.u) + 5 * t.out / 3, 0) / 1e6).toFixed(3)}M`);
  }
  console.log(`  8 gọi subagent: ${ag.length ? ag.map(c => `${c.input.subagent_type || 'general-purpose'} ở lượt ${c.turn}`).join(' · ') : '0'} · transcript con: ${kids.join(' · ') || '-'}`);

  // 9 lượt mất cache, như dòng cuối của fixes.js
  const misses = [];
  for (let i = 1; i < T.length; i++) {
    const p = T[i - 1].u, u = T[i].u, exp = (p.cache_read_input_tokens || 0) + (p.cache_creation_input_tokens || 0);
    if ((u.cache_read_input_tokens || 0) < exp - 20000) misses.push({ turn: i + 1, lost: exp - (u.cache_read_input_tokens || 0) });
  }
  const missCost = misses.reduce((s, m) => s + m.lost * (1.25 - 0.1), 0);
  console.log(`  9 mất cache ở lượt: ${misses.map(m => `${m.turn} (${Math.round(m.lost / 1000)}k)`).join(', ') || '-'}${missCost ? ` · tốn thêm ≈ ${Math.round(missCost / 1000)}k` : ''} · lượt 1 đọc cache ${Math.round((T[0].u.cache_read_input_tokens || 0) / 1000)}k`);

  // Thêm: file viết lại nhiều lần
  const wr = {}; for (const c of calls.filter(writes)) { const k = fileOf(c).split('/sample/')[1] || path.basename(fileOf(c)); (wr[k] = wr[k] || []).push(`${c.name[0]}${c.turn}`); }
  console.log(`  ghi file: ${Object.entries(wr).map(([k, v]) => `${k} ${v.join(',')}`).join(' · ') || '-'}`);
}
