// Đếm các chỗ có thể sửa trong một lần chạy sketch-to-map. node fixes-map.js <a.jsonl> …
// Đánh số lượt như turns.js (mỗi message id của agent là một lượt).
// 1 tài liệu yêu cầu: mỗi file đọc nguyên hay một phần, ở lượt nào, số lần · tài liệu skill đọc nguyên / một phần · đọc mã skill
// 2 lệnh của skill: sources.py, map.mjs check (--brief, --shots), visible (--treetest), merge, slice · tự dò tài liệu (node -e, script tự viết)
// 3 ảnh mở trước cổng: số ảnh, ở lượt nào · subagent: loại, mô tả
// 4 lượt có từ 2 lệnh · lượt chỉ 1 lệnh · 5 Write lại features.js hay layout.js (ghi lại cả file) và số Edit
// 6 /x/… · lỗi không thấy file · 7 kết quả bị cắt giữa, kết quả lỗi · 8 lượt mất cache
const fs = require('fs'), path = require('path');
const { inSkills } = require('./paths');
const norm = s => String(s || '').replace(/\\/g, '/');
// Lệnh có biến (S="<skills>…" hay K=…/map.mjs;): thay biến bằng giá trị (như fixes-edit.js)
const expand = cmd => {
  const v = {};
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const cmdOf = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(norm(c.input.command)) : '';
const fileOf = c => norm((c.input || {}).file_path);
const writes = c => c.name === 'Write' || c.name === 'Edit';

function load(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(), res = new Map();
  for (const o of L) {
    if (o.type === 'user' && Array.isArray(o.message?.content)) for (const c of o.message.content) if (c.type === 'tool_result')
      res.set(c.tool_use_id, { err: !!c.is_error, text: typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join('') });
    if (o.type !== 'assistant' || !o.message) continue;
    let t = byId.get(o.message.id);
    if (!t) { t = { u: o.message.usage || {}, calls: [] }; byId.set(o.message.id, t); turns.push(t); }
    if (o.message.usage) t.u = o.message.usage;
    for (const c of o.message.content || []) if (c.type === 'tool_use') t.calls.push(c);
  }
  return { turns, res };
}

for (const f of process.argv.slice(2)) {
  const { turns: T, res } = load(f);
  const calls = T.flatMap((t, i) => t.calls.map(c => Object.assign(c, { turn: i + 1 })));
  const text = c => (res.get(c.id) || {}).text || '';
  const list = a => a.length ? `${a.length} (lượt ${[...new Set(a.map(c => c.turn))].join(',')})` : '0';
  let meta = ''; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  console.log(`\n== ${meta || path.basename(f)} · ${T.length} lượt · ${calls.length} lệnh gọi công cụ`);

  // 1 Tài liệu yêu cầu (bản chữ map/_src/ hay bản gốc docs/): Read nguyên hay có offset/limit; lệnh sed/head/cat/grep trên chúng
  const src = {};
  for (const c of calls) {
    const p = fileOf(c);
    if (c.name === 'Read' && /\/(map\/_src|docs\/yeu-cau)\//.test(p)) {
      const k = p.split('/').slice(-2).join('/'); (src[k] = src[k] || { full: [], part: [], cmd: [] })[c.input.offset || c.input.limit ? 'part' : 'full'].push(c.turn);
    }
    for (const m of new Set([...cmdOf(c).matchAll(/((?:map\/_src|docs\/yeu-cau)\/[\w.-]+)/g)].map(m => m[1].split('/').slice(-2).join('/'))))
      if (!/sources\.py/.test(cmdOf(c))) (src[m] = src[m] || { full: [], part: [], cmd: [] }).cmd.push(c.turn);
  }
  console.log('  1 tài liệu yêu cầu (Read nguyên ở lượt · Read một phần · lệnh in hay tìm):');
  for (const [k, v] of Object.entries(src).sort()) console.log(`     ${k}: nguyên ${v.full.join(',') || '-'} · một phần ${v.part.join(',') || '-'} · lệnh ${v.cmd.join(',') || '-'}`);
  const docs = {};
  for (const c of calls) if (c.name === 'Read' && inSkills(fileOf(c)) && /\.md$/.test(fileOf(c))) {
    const k = fileOf(c).split('/skills/')[1]; (docs[k] = docs[k] || []).push(`${c.turn}${c.input.offset || c.input.limit ? 'p' : ''}`);
  }
  console.log(`     tài liệu skill Read (p = một phần): ${Object.entries(docs).map(([k, v]) => `${k} ${v.join(',')}`).join(' · ') || '-'}`);
  const code = calls.filter(c => c.name === 'Read' && inSkills(fileOf(c)) && /\.(py|mjs|js|html)$/.test(fileOf(c))
    || /\b(sed|grep|head|tail|cat|awk)\b(?:(?!&&)[^;\n])*?skills\/sketch-to-map\/(scripts|templates)\/[\w.-]+\.(py|mjs|js|html)\b/.test(cmdOf(c)));
  console.log(`     đọc mã hay khuôn của skill (script, map-shell.html, *.example.js): ${list(code)} · ${Math.round(code.reduce((n, c) => n + text(c).length, 0) / 100) / 10}k ký tự${code.length ? ': ' + code.map(c => path.basename(fileOf(c) || (/[\w.-]+\.(py|mjs|js|html)\b/.exec(cmdOf(c)) || [''])[0])).join(', ') : ''}`);

  // 2 Lệnh của skill
  const runs = re => calls.filter(c => re.test(cmdOf(c)));
  const mj = sub => new RegExp(`map\\.mjs"?\\s+${sub}\\b`);
  const chk = runs(mj('check'));
  console.log(`  2 sources.py ${list(runs(/\bpython3?\b[^;\n|]*sources\.py/))} · check ${list(chk)} (--brief ${chk.filter(c => /--brief/.test(cmdOf(c))).length}, --shots ${chk.filter(c => /--shots/.test(cmdOf(c))).length}) · visible ${list(runs(mj('visible')))} (--treetest ${runs(mj('visible')).filter(c => /--treetest/.test(cmdOf(c))).length}) · merge ${list(runs(mj('merge')))} · slice ${list(runs(mj('slice')))}`);
  const selfScan = calls.filter(c => /\bnode\s+-e\b|\bpython3?\s+-c\b/.test(cmdOf(c)) || writes(c) && /\.(mjs|js|py)$/.test(fileOf(c)) && !/\/map\/(features|layout)\.js$|\/map\/parts\//.test(fileOf(c)));
  console.log(`     tự dò hay tự viết script (node -e, python -c, file .js/.py ngoài features.js, layout.js, parts/): ${list(selfScan)}`);
  const exits = chk.map(c => `${c.turn}:${/→ (\d+) chặn/.exec(text(c))?.[1] ?? '?'} chặn`);
  console.log(`     số mục chặn sau mỗi lần check: ${exits.join(' · ') || '-'}`);

  // 3 Ảnh và subagent
  const pngs = calls.filter(c => c.name === 'Read' && /\.(png|jpe?g)$/i.test(fileOf(c)));
  const agents = calls.filter(c => c.name === 'Agent' || c.name === 'Task');
  console.log(`  3 ảnh mở: ${list(pngs)}${pngs.length ? ': ' + pngs.map(c => path.basename(fileOf(c))).join(', ') : ''} · subagent: ${agents.map(c => `${c.input.subagent_type || 'general-purpose'} "${c.input.description || ''}" (lượt ${c.turn}${c.input.run_in_background ? ', chạy nền' : ''})`).join(' · ') || '0'}`);

  // 4–5
  console.log(`  4 lượt có từ 2 lệnh: ${T.filter(t => t.calls.length > 1).length}/${T.length} · lượt chỉ 1 lệnh: ${T.filter(t => t.calls.length === 1).length} · ToolSearch đứng riêng: ${T.filter(t => t.calls.length === 1 && t.calls[0].name === 'ToolSearch').length}`);
  const w = re => calls.filter(c => c.name === 'Write' && re.test(fileOf(c))), e = re => calls.filter(c => c.name === 'Edit' && re.test(fileOf(c)));
  const denied = calls.filter(c => writes(c) && /has not been read|must read|Read it first/i.test(text(c)));
  console.log(`  5 features.js: Write ${list(w(/\/map\/features\.js$/))}, Edit ${list(e(/\/map\/features\.js$/))} · layout.js: Write ${list(w(/\/map\/layout\.js$/))}, Edit ${list(e(/\/map\/layout\.js$/))} · DECISIONS.md: ${list(calls.filter(c => writes(c) && /DECISIONS\.md$/.test(fileOf(c))))} · bị từ chối vì chưa Read ${list(denied)}`);

  // 6–8
  const posix = calls.filter(c => /(^|[\s"'=])\/[a-z]\//.test(cmdOf(c)));
  const pathErr = calls.filter(c => /\b(node|python3?|cp|ls|cat)\b/.test(cmdOf(c)) && /Cannot find module|No such file|can't open file|ENOENT|cannot find the path/i.test(text(c)));
  console.log(`  6 lệnh dùng /x/…: ${list(posix)} · lỗi không thấy file: ${list(pathErr)}`);
  const cut = calls.filter(c => /characters truncated/.test(text(c))), errs = calls.filter(c => (res.get(c.id) || {}).err);
  console.log(`  7 kết quả bị cắt giữa: ${list(cut)} · kết quả lỗi (mã khác 0): ${list(errs)}`);
  const misses = [];
  for (let i = 1; i < T.length; i++) {
    const p = T[i - 1].u, u = T[i].u, exp = (p.cache_read_input_tokens || 0) + (p.cache_creation_input_tokens || 0);
    if ((u.cache_read_input_tokens || 0) < exp - 20000) misses.push({ turn: i + 1, lost: exp - (u.cache_read_input_tokens || 0) });
  }
  const missCost = misses.reduce((s, m) => s + m.lost * (1.25 - 0.1), 0);
  console.log(`  8 mất cache ở lượt: ${misses.map(m => `${m.turn} (${Math.round(m.lost / 1000)}k)`).join(', ') || '-'}${missCost ? ` · tốn thêm ≈ ${Math.round(missCost / 1000)}k` : ''} · lượt 1 đọc cache ${Math.round((T[0]?.u.cache_read_input_tokens || 0) / 1000)}k`);
}
