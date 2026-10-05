// Đếm các chỗ có thể sửa trong một lần chạy tweak-site, evolve-site hay handover-check. node fixes-edit.js <a.jsonl> …
// Đánh số lượt như turns.js (mỗi message id của agent là một lượt). Cùng cách đếm với fixes-site.js ở các dòng 1, 4–7, 9.
// 1 tài liệu skill đọc nguyên / một phần, đọc mã skill, file dự án Read từ 2 lần
// 2 lệnh của bộ kiểm: qa_init, quick.py (--dry, --note có hay không --shots), run_all.py theo thư mục ra, handover.py (run, ledger, thumbs, promote), qa-check.py, preflight.py, themes.mjs
// 3 tự chụp (trình duyệt --screenshot, playwright, gọi thẳng run.mjs, tự viết script) · ảnh mở: số ảnh, số lượt có ảnh, nhiều nhất một lượt
// 4 lượt có từ 2 lệnh · 5 cat file sẽ sửa, Write bị từ chối · 6 /x/… · 7 kết quả bị cắt giữa, kết quả lỗi
// 8 ledger.jsonl đọc nguyên · 9 lượt mất cache · 10 ba lượt đầu (lượt vào có gom một lượt không) · ghi file
// 11 sáu chỗ sửa sau lần đo bản cũ/mới (54b403a): breaktest.py hay bẻ thử tự viết, UnicodeEncodeError, đọc handover.json/qa.config.json,
//    tra khuôn FEATURE-DECISIONS, grep -r ngoài thư mục trang, ảnh mở sau mỗi lần --shots so với dòng ảnh đổi, ảnh mở kèm nhãn lát
const fs = require('fs'), path = require('path');
const { SKILLS, inSkills } = require('./paths');
const norm = s => String(s || '').replace(/\\/g, '/');
const expand = cmd => {
  const v = {};
  for (const m of cmd.matchAll(/\b([A-Za-z_]\w*)=(?:"([^"]+)"|(?!\$\()([^\s;&|"'()]+))/g)) v[m[1]] = (m[2] ?? m[3]).replace(/\$\{?(\w+)\}?/g, (a, k) => v[k] || a);
  return cmd.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (a, k) => v[k] || a);
};
const cmdOf = c => c.name === 'Bash' || c.name === 'PowerShell' ? expand(norm(c.input.command)) : '';
const fileOf = c => norm((c.input || {}).file_path);
const writes = c => c.name === 'Write' || c.name === 'Edit';
const conv = u => (u.input_tokens || 0) + 1.25 * (u.cache_creation_input_tokens || 0) + 0.1 * (u.cache_read_input_tokens || 0);

function load(f) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const turns = [], byId = new Map(), res = new Map(); let prompt = '';
  for (const o of L) {
    if (o.type === 'user' && !prompt) { const c = o.message?.content; prompt = typeof c === 'string' ? c : (c || []).map(x => x.text || '').join(''); }
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
  return { turns, res, prompt };
}

for (const f of process.argv.slice(2)) {
  const { turns: T, res, prompt } = load(f);
  const calls = T.flatMap((t, i) => t.calls.map(c => Object.assign(c, { turn: i + 1 })));
  const text = c => (res.get(c.id) || {}).text || '';
  const skill = (/Chạy skill ([\w-]+)/.exec(prompt) || [])[1] || '?';
  const arm = (/\/(cu|moi)\/tapora-proto-kit\/skills/.exec(prompt) || [])[1] || '?';
  let meta = ''; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  console.log(`\n== ${meta || path.basename(f)} · ${skill} · bản ${arm} · ${T.length} lượt · ${calls.length} lệnh gọi công cụ`);
  const list = a => a.length ? `${a.length} (lượt ${[...new Set(a.map(c => c.turn))].join(',')})` : '0';

  // 1 Tài liệu skill. Cỡ file đọc từ chính worktree của lần chạy (chạy script trước khi gỡ worktree)
  const docs = new Map();
  const size = (root, rel) => { for (const f of [`${root}/skills/${rel}`, `${SKILLS}/${rel}`]) { try { return fs.readFileSync(f, 'utf8').length; } catch {} } return 0; };
  // Đường dẫn có dấu cách (W:/Dummy/[Tool] Working/…) cắt mất phần gốc trong lệnh: khi đó lấy cỡ ở SKILLS (paths.js)
  const doc = (root, rel) => { if (!docs.has(rel)) docs.set(rel, { size: size(root, rel), full: [], part: [], chars: 0 }); return docs.get(rel); };
  for (const c of calls) {
    if (c.name === 'Read' && inSkills(fileOf(c))) {
      const [root, rel] = fileOf(c).split('/skills/'); if (!/\.(md|csv)$/.test(rel)) continue;
      const d = doc(root, rel); (c.input.offset || c.input.limit ? d.part : d.full).push(c.turn); d.chars += text(c).length;
      continue;
    }
    const cmd = cmdOf(c); if (!cmd) continue;
    for (const m of new Set([...cmd.matchAll(/([^\s"';]*?)\/skills\/([\w-]+\/(?:[\w-]+\/)*[\w.-]+\.(?:md|csv))/g)].map(m => m[1] + '|' + m[2]))) {
      const [root, rel] = m.split('|');
      const d = doc(root, rel), esc = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      (new RegExp(`\\bcat\\s+("[^"]*${esc}"|\\S*${esc})`).test(cmd) ? d.full : d.part).push(c.turn); d.chars += text(c).length;
    }
  }
  console.log(`  1 tài liệu skill (cỡ file · đọc nguyên ở lượt · đọc một phần ở lượt · ký tự vào ngữ cảnh):`);
  for (const [rel, d] of [...docs].sort((a, b) => b[1].chars - a[1].chars))
    console.log(`     ${String(Math.round(d.size / 100) / 10).padStart(5)}k  nguyên ${d.full.length ? d.full.join(',') : '-'}  ·  một phần ${d.part.length ? d.part.join(',') : '-'}  ·  ${Math.round(d.chars / 100) / 10}k  ${rel}`);
  const codeRe = /\b(sed|grep|head|tail|cat|awk|wc)\b(?:(?!&&)[^;\n])*?(skills\/[^\s"';]+|_qa\/[\w.-]+)\.(py|mjs|js)\b/;
  const code = calls.filter(c => c.name === 'Read' && /\.(py|mjs|js)$/.test(fileOf(c)) && (inSkills(fileOf(c)) || /\/_qa\//.test(fileOf(c))) || codeRe.test(cmdOf(c)));
  // Lệnh 2 của evolve-site 1.9 in phần chú thích đầu run_all.py: đúng cách skill dạy, đếm riêng
  // Lệnh `sed -n '/^#/!q;p'` có dấu ; trong ngoặc nên codeRe không bắt được: tìm trên mọi lệnh
  const head = calls.filter(c => /sed -n '\/\^#\/!q;p'[^;&|]*run_all\.py/.test(cmdOf(c)));
  console.log(`     đọc mã skill hay bộ kiểm (script, qa-kit, _qa/*.py): ${list(code.filter(c => !head.includes(c)))} · ${Math.round(code.filter(c => !head.includes(c)).reduce((n, c) => n + text(c).length, 0) / 100) / 10}k ký tự · in đầu run_all.py theo lệnh 2: ${list(head)}`);
  const proj = {};
  for (const c of calls) if (c.name === 'Read' && !inSkills(fileOf(c)) && !/\.(png|jpe?g)$/i.test(fileOf(c))) {
    const k = fileOf(c).split('/sample/')[1] || path.basename(fileOf(c)); (proj[k] = proj[k] || []).push(c.turn);
  }
  console.log(`     file dự án Read từ 2 lần: ${Object.entries(proj).filter(([, v]) => v.length > 1).map(([k, v]) => `${k} (lượt ${v.join(',')})`).join(' · ') || '-'}`);

  // 2 Lệnh của bộ kiểm (chạy thật: chương trình và script trong cùng một đoạn lệnh)
  const exec = (bin, file) => new RegExp(`\\b${bin}\\b(?:(?!&&)[^;\\n|])*${file}`);
  const runs = re => calls.filter(c => re.test(cmdOf(c)));
  const q = runs(exec('python3?', 'quick\\.py'));
  const qDry = q.filter(c => /--dry/.test(cmdOf(c))), qNote = q.filter(c => /--note/.test(cmdOf(c))), qShots = qNote.filter(c => /--shots/.test(cmdOf(c)));
  const ra = runs(exec('python3?', 'run_all\\.py'));
  const raBy = {}; for (const c of ra) { const m = /run_all\.py"?\s+"?([^\s"]+)/.exec(cmdOf(c)); const k = m ? m[1].replace(/^.*_qa\//, '') : '?'; (raBy[k] = raBy[k] || []).push(c); }
  const pf = runs(exec('python3?', 'preflight\\.py'));
  console.log(`  2 qa_init ${list(runs(exec('python3?', 'qa_init\\.py')))} · quick --dry ${list(qDry)} · quick --note ${list(qNote)} (kèm --shots ${qShots.length}) · run_all ${Object.entries(raBy).map(([k, v]) => `${k} ${list(v)}`).join(', ') || '0'}`);
  console.log(`     handover.py run ${list(runs(exec('python3?', 'handover\\.py\\s+run')))} · ledger ${list(runs(exec('python3?', 'handover\\.py\\s+ledger')))} · thumbs ${list(runs(exec('python3?', 'handover\\.py\\s+thumbs')))} · promote ${list(runs(exec('python3?', 'handover\\.py\\s+promote')))} · qa-check.py ${list(runs(exec('python3?', 'qa-check\\.py')))} · preflight ${list(pf)} (--save/--compare ${pf.filter(c => /--save|--compare/.test(cmdOf(c))).length}) · themes.mjs ${list(runs(exec('node', 'themes\\.mjs')))}`);

  // 3 Tự chụp và ảnh mở
  const selfShot = calls.filter(c => [/(msedge|chrome|chromium)(?:(?!&&)[^;\n|])*--screenshot/i, /playwright/i, exec('node', 'run\\.mjs')].some(re => re.test(cmdOf(c))));
  const harness = calls.filter(c => writes(c) && /\.(mjs|js|py)$/.test(fileOf(c)) && !/\/site\//.test(fileOf(c)));
  const pngs = calls.filter(c => c.name === 'Read' && /\.(png|jpe?g)$/i.test(fileOf(c)));
  const perTurn = {}; for (const c of pngs) perTurn[c.turn] = (perTurn[c.turn] || 0) + 1;
  console.log(`  3 tự chụp: ${list(selfShot)} · tự viết script ngoài site/: ${harness.length ? harness.map(c => `${path.basename(fileOf(c))} (lượt ${c.turn})`).join(' · ') : '0'} · ảnh mở ${pngs.length} ở ${Object.keys(perTurn).length} lượt (nhiều nhất ${Math.max(0, ...Object.values(perTurn))} một lượt)`);
  console.log(`  4 lượt có từ 2 lệnh: ${T.filter(t => t.calls.length > 1).length}/${T.length} · lượt chỉ 1 lệnh: ${T.filter(t => t.calls.length === 1).length} · ToolSearch đứng riêng: ${T.filter(t => t.calls.length === 1 && t.calls[0].name === 'ToolSearch').length}`);

  // 5 cat file sẽ sửa; Write bị từ chối
  const key = x => norm(x).replace(/"/g, '').replace(/^\/([a-z])\//, '$1:/').toLowerCase();
  const edited = calls.filter(writes).map(c => ({ file: key(fileOf(c)), turn: c.turn }));
  const catted = calls.flatMap(c => [...cmdOf(c).matchAll(/\bcat\s+("[^"]+"|[^\s|;&><]+)/g)].map(m => ({ file: key(m[1]), name: path.basename(m[1].replace(/"/g, '')), turn: c.turn })));
  const catEdit = catted.filter(x => edited.some(e => e.file === x.file && e.turn >= x.turn));
  const denied = calls.filter(c => writes(c) && /has not been read|must read|Read it first/i.test(text(c)));
  console.log(`  5 cat file sẽ sửa: ${catEdit.length ? catEdit.map(x => `${x.name} (lượt ${x.turn})`).join(' · ') : '0'} · mọi cat: ${catted.length} · Write/Edit bị từ chối vì chưa Read: ${list(denied)}`);

  // 6–7
  const posix = calls.filter(c => /(^|[\s"'=])\/[a-z]\//.test(cmdOf(c)));
  const pathErr = calls.filter(c => /\b(node|python3?|cp|ls|cat)\b/.test(cmdOf(c)) && /Cannot find module|No such file|can't open file|ENOENT|cannot find the path/i.test(text(c)));
  console.log(`  6 lệnh dùng /x/…: ${list(posix)} · lỗi không thấy file: ${list(pathErr)}`);
  const cut = calls.filter(c => /characters truncated/.test(text(c))), errs = calls.filter(c => (res.get(c.id) || {}).err);
  console.log(`  7 kết quả bị cắt giữa: ${list(cut)} · kết quả lỗi (mã khác 0): ${list(errs)}`);

  // 8 ledger.jsonl đọc nguyên (handover-check 1.3 in gọn bằng handover.py ledger)
  const led = calls.filter(c => c.name === 'Read' && /ledger\.jsonl$/.test(fileOf(c)) || /\b(cat|head|tail|type)\b[^;\n|]*ledger\.jsonl/.test(cmdOf(c)));
  console.log(`  8 ledger.jsonl đọc nguyên: ${list(led)} · ${Math.round(led.reduce((n, c) => n + text(c).length, 0) / 100) / 10}k ký tự`);

  // 9 lượt mất cache
  const misses = [];
  for (let i = 1; i < T.length; i++) {
    const p = T[i - 1].u, u = T[i].u, exp = (p.cache_read_input_tokens || 0) + (p.cache_creation_input_tokens || 0);
    if ((u.cache_read_input_tokens || 0) < exp - 20000) misses.push({ turn: i + 1, lost: exp - (u.cache_read_input_tokens || 0) });
  }
  const missCost = misses.reduce((s, m) => s + m.lost * (1.25 - 0.1), 0);
  console.log(`  9 mất cache ở lượt: ${misses.map(m => `${m.turn} (${Math.round(m.lost / 1000)}k)`).join(', ') || '-'}${missCost ? ` · tốn thêm ≈ ${Math.round(missCost / 1000)}k` : ''} · lượt 1 đọc cache ${Math.round((T[0]?.u.cache_read_input_tokens || 0) / 1000)}k`);

  // 11 sáu chỗ sửa sau lần đo bản cũ/mới (54b403a): bẻ thử một lệnh, ảnh đổi, nhãn lát, mục bằng 0, khuôn FEATURE-DECISIONS, grep, mã hoá
  const bt = runs(exec('python3?', 'breaktest\\.py'));
  const selfBreak = calls.filter(c => /\.bak\b/.test(cmdOf(c)) && /site\//.test(cmdOf(c)));
  // Lỗi thật của python (dạng "UnicodeEncodeError: 'charmap' codec…"), không tính chữ nhắc lỗi này trong tài liệu skill vừa đọc
  const enc = calls.filter(c => c.name !== 'Read' && /UnicodeEncodeError: |'charmap' codec can't/.test(text(c)));
  console.log(`  11 breaktest.py ${list(bt)} · bẻ thử tự viết (.bak cạnh site/) ${list(selfBreak)} · UnicodeEncodeError ${list(enc)}`);
  // Đọc file mà kết quả lệnh đã in đủ: Read, hay lệnh nhắc tới file đó mà không phải gọi script của bộ kiểm
  const readOf = re => calls.filter(c => c.name === 'Read' && re.test(fileOf(c)) || !/(qa-check|handover|quick|run_all|qa_init)\.py\b/.test(cmdOf(c)) && re.test(cmdOf(c)));
  const mk = calls.filter(c => /sed '\/\^## Tính năng\/,\$d'/.test(cmdOf(c)));
  const tpl = calls.filter(c => !mk.includes(c) && (c.name === 'Read' && /templates\/FEATURE-DECISIONS\.md$/.test(fileOf(c))
    || /tapora-proto-kit\/skills/.test(cmdOf(c)) && /FEATURE-DECISIONS/.test(cmdOf(c)) && /\b(grep|sed|cat|head)\b/.test(cmdOf(c))));
  // grep -r ngoài thư mục trang: đoạn lệnh có grep đệ quy mà không nhắc site, không chạy trong thư mục skills
  // (xét từng đoạn: lượt tìm của tweak-site gói grep cùng qa_init của <skills> trong một lệnh)
  const gOut = calls.filter(c => cmdOf(c).split(/;|&&|\|/).some(s => /\bgrep\b/.test(s) && /\s-\w*[rR]/.test(s) && !/site/.test(s) && !/tapora-proto-kit\/skills/.test(s)));
  console.log(`     đọc handover.json ${list(readOf(/handover\.json/))} · qa.config.json ${list(readOf(/qa\.config\.json/))} · tra khuôn FEATURE-DECISIONS ${list(tpl)} · tạo từ khuôn bằng sed ${list(mk)} · grep -r ngoài thư mục trang ${list(gOut)}`);
  // Nhãn lát lấy từ danh sách ảnh trong kết quả (quick --shots, run_all, qa-check): "<thư mục>/<ảnh>" → tiêu đề trong ngoặc
  const shotCalls = calls.filter(c => exec('python3?', 'quick\\.py').test(cmdOf(c)) && /--shots/.test(cmdOf(c)) || exec('python3?', '(run_all|qa-check)\\.py').test(cmdOf(c)));
  const label = {}, rows = [];
  const tail = (x, n) => fileOf(x).split('/').slice(-n).join('/');
  shotCalls.forEach((c, i) => {
    const out = text(c);
    for (const m of out.matchAll(/^ {2}([^:\n]+): (.+)$/gm)) {
      for (const f of m[2].split(/, (?=[\w@.-]+\.(?:jpg|png))/)) {
        const x = /^([\w@.-]+\.(?:jpg|png))(?: \((.*)\))?$/.exec(f.trim());
        if (x) label[`${m[1]}/${x[1]}`] = x[2] || '';
      }
    }
    if (!/quick\.py/.test(cmdOf(c))) return;
    // Ảnh mở sau lần --shots này, tới lần chụp kế: so với dòng "đổi so với lần chụp trước"
    const ch = /^ {2}đổi so với lần chụp trước \(chỉ cần mở lại các ảnh này\): (.+)$/m.exec(out);
    const state = ch ? ch[1].split(', ') : /không ảnh nào đổi/.test(out) ? [] : /mọi ảnh đều đổi/.test(out) ? 'mọi' : /chưa có ảnh của lần chụp trước/.test(out) ? 'đầu' : null;
    const next = shotCalls[i + 1];
    const opened = calls.filter(x => x.turn > c.turn && (!next || x.turn <= next.turn) && x.name === 'Read' && /\.(png|jpe?g)$/i.test(fileOf(x)));
    const extra = Array.isArray(state) ? opened.filter(x => !state.includes(tail(x, 3))).length : 0;
    rows.push(`lượt ${c.turn}: ${state === null ? '(không có dòng so ảnh)' : state === 'đầu' ? 'lần chụp đầu' : state === 'mọi' ? 'mọi ảnh đổi' : `đổi ${state.length}`} → mở ${opened.length}${extra ? ` (ngoài danh sách đổi ${extra})` : ''}`);
  });
  const lab = x => tail(x, 3) in label ? label[tail(x, 3)] : tail(x, 2) in label ? label[tail(x, 2)] : null;
  console.log(`     ảnh sau mỗi lần --shots: ${rows.join(' · ') || '-'}`);
  console.log(`     ảnh mở kèm nhãn lát: ${pngs.slice(0, 16).map(x => `${x.turn}:${path.basename(fileOf(x))}${lab(x) === null ? '' : ` (${lab(x) || '—'})`}`).join(' · ') || '-'}${pngs.length > 16 ? ' …' : ''}`);

  // 10 ba lượt đầu: lượt vào có gom đọc tài liệu, file dự án và lệnh vào một lượt không
  const brief = c => c.name === 'Bash' || c.name === 'PowerShell' ? c.name[0] + ':' + (cmdOf(c).match(/\b(qa_init|quick|handover|run_all|qa-check|preflight|grep|sed|find|ls|cat)\b/g) || ['…']).slice(0, 4).join('+') : `${c.name} ${path.basename(fileOf(c))}`;
  console.log(`  10 ba lượt đầu: ${T.slice(0, 3).map((t, i) => `[${i + 1}] ${t.calls.map(brief).join(', ') || '(chữ)'}`).join(' · ')}`);
  const wr = {}; for (const c of calls.filter(writes)) { const k = fileOf(c).split('/sample/')[1] || path.basename(fileOf(c)); (wr[k] = wr[k] || []).push(`${c.name[0]}${c.turn}`); }
  console.log(`  ghi file: ${Object.entries(wr).map(([k, v]) => `${k} ${v.join(',')}`).join(' · ') || '-'}`);
  const kids = [], dir = path.dirname(f), me = path.basename(f).replace(/^agent-|\.jsonl$/g, '');
  for (const m of fs.readdirSync(dir).filter(x => x.endsWith('.meta.json'))) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, m), 'utf8')); } catch { continue; }
    if (j.parentAgentId !== me) continue;
    const k = load(path.join(dir, m.replace(/\.meta\.json$/, '.jsonl'))).turns;
    kids.push(`${j.agentType} "${j.description}" ${k.length} lượt, ${(k.reduce((s, t) => s + conv(t.u) + 5 * t.out / 3, 0) / 1e6).toFixed(3)}M`);
  }
  if (kids.length) console.log(`  subagent con: ${kids.join(' · ')}`);
}
