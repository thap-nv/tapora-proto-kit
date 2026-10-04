// Đo riêng 5 đề xuất trên transcript của một lần chạy (và subagent con của nó nếu đưa thêm file).
// 1 đường dẫn /w/… cho node/python và lỗi kéo theo · 2 agent đi tìm source.kind/family · 3 số lần chụp lại
// 4 WebSearch / WebFetch · 5 số lệnh tra font --vi-fonts và số từ khoá
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const L = fs.readFileSync(f, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const calls = [], res = new Map();
  for (const o of L) {
    if (o.type === 'assistant') for (const c of o.message.content || []) if (c.type === 'tool_use') calls.push(c);
    if (o.type === 'user' && Array.isArray(o.message.content)) for (const c of o.message.content) if (c.type === 'tool_result') {
      res.set(c.tool_use_id, { err: !!c.is_error, text: typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join('') });
    }
  }
  const cmd = c => c.name === 'Bash' || c.name === 'PowerShell' ? String(c.input.command || '') : '';
  const runs = calls.filter(c => /\b(node|python3?)\s+["']?\/[a-z]\//.test(cmd(c)));
  const pathErr = calls.filter(c => /\b(node|python3?)\b/.test(cmd(c)) && /Cannot find module|No such file|can't open file|ENOENT/.test((res.get(c.id) || {}).text || ''));
  const kindHunt = calls.filter(c => /kind|family/.test(cmd(c)) && /check\.mjs|tokens\.js|concepts\.example\.js|templates\/concepts\.js/.test(cmd(c))
    || c.name === 'Read' && /templates[\\/]concepts(\.example)?\.js$/.test(c.input.file_path || ''));
  const catIdx = calls.filter(c => /style-catalogue\.md/.test(cmd(c)));
  const shots = calls.filter(c => /shots\.mjs/.test(cmd(c)));
  const pngs = calls.filter(c => c.name === 'Read' && /\.png$/i.test(c.input.file_path || ''));
  const ws = calls.filter(c => c.name === 'WebSearch'), wf = calls.filter(c => c.name === 'WebFetch');
  const vf = calls.filter(c => /--vi-fonts/.test(cmd(c)));
  const vfQueries = vf.reduce((n, c) => n + (cmd(c).match(/--vi-fonts/g) || []).length, 0) + vf.filter(c => /for q in/.test(cmd(c))).reduce((n, c) => n + ((/for q in ([^;]+);/.exec(cmd(c)) || [, ''])[1].match(/"[^"]*"/g) || []).length - 1, 0);
  const clamp = calls.filter(c => (c.name === 'Write' || c.name === 'Edit') && /\.html$/.test(c.input.file_path || '') && /clamp\([^)]*vw/.test(c.input.content || c.input.new_string || ''));
  const htmlEditsAfterShot = (() => { let seen = false, n = 0; for (const c of calls) { if (/shots\.mjs/.test(cmd(c))) seen = true; else if (seen && c.name === 'Edit' && /\.html$/.test(c.input.file_path || '')) n++; } return n; })();
  // Đợt sửa thứ ba (sau gộp lượt): gom lệnh theo lượt (message id)
  const turns = new Map();
  for (const o of L) if (o.type === 'assistant') for (const c of o.message.content || []) if (c.type === 'tool_use') {
    if (!turns.has(o.message.id)) turns.set(o.message.id, []);
    turns.get(o.message.id).push(c);
  }
  const T = [...turns.values()];
  const sameTurn = T.some(t => t.some(c => /design-styles\.md/.test(cmd(c))) && t.some(c => /style-catalogue\.md/.test(cmd(c))));
  const toolSearchAlone = T.filter(t => t.length === 1 && t[0].name === 'ToolSearch').length;
  const searchPy = calls.filter(c => /search\.py/.test(cmd(c))).length;
  const verify = calls.filter(c => /check\.mjs[^\n]*--shots/.test(cmd(c))).length;
  const catEdited = calls.filter(c => /\bcat\b[^|;&]*(concepts\.js|DECISIONS\.md)/.test(cmd(c))).length;
  const testPages = calls.filter(c => c.name === 'Write' && /\.html$/.test(c.input.file_path || '') && !/[\/]concept[\/][^\/]+\.html$/.test(c.input.file_path || '')).length;
  let meta = ''; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')).description; } catch {}
  console.log(`\n== ${meta || f.split(/[\\/]/).pop()} · ${calls.length} lệnh gọi công cụ`);
  console.log(`  1 đường dẫn: lệnh node/python dùng /x/… ${runs.length} · lỗi không thấy file ${pathErr.length}`);
  console.log(`  2 tìm kind/family trong mã hay mẫu: ${kindHunt.length} · lệnh đọc style-catalogue: ${catIdx.length}`);
  console.log(`  3 chạy shots.mjs: ${shots.length} · mở ảnh: ${pngs.length} · Edit HTML sau lần chụp đầu: ${htmlEditsAfterShot} · màn dùng clamp(…vw): ${clamp.length}`);
  console.log(`  4 WebSearch: ${ws.length} · WebFetch: ${wf.length}`);
  console.log(`  5 lệnh --vi-fonts: ${vf.length} · lần tra (cả vòng lặp): ${vfQueries}`);
  console.log(`  lượt: ${T.length} · lượt có từ 2 lệnh: ${T.filter(t => t.length > 1).length} · check.mjs --shots: ${verify}`);
  console.log(`  A2: mục lục họ và 20 phong cách cùng lượt: ${sameTurn ? 'có' : 'không'} · search.py chạy ${searchPy} lần · ToolSearch đứng riêng một lượt: ${toolSearchAlone}`);
  console.log(`  cat concepts.js/DECISIONS.md: ${catEdited} · trang HTML thử ngoài concept/: ${testPages}`);
  // Đợt sửa thứ tư (04/10): A1–A3 sang vong-dau.md, lối vào lại một lượt, roles.mjs, đậm giả, --vi-fonts không từ khoá
  const turnOf = c => T.findIndex(t => t.includes(c)) + 1;
  const isRead = (c, re) => c.name === 'Read' && re.test(c.input.file_path || '');
  const vd = calls.filter(c => isRead(c, /vong-dau\.md$/)).map(turnOf);
  const vdWithCm = T.some(t => t.some(c => isRead(c, /vong-dau\.md$/)) && t.some(c => isRead(c, /concept-method\.md$/) || /concept-method\.md/.test(cmd(c))));
  const promptWithCheck = T.some(t => t.some(c => /check\.mjs/.test(cmd(c)) && /subagent-prompts\.md/.test(cmd(c))));
  const example = calls.filter(c => isRead(c, /concepts\.example\.js$/) || /concepts\.example\.js/.test(cmd(c))).length;
  const screenTurns = [...new Set(calls.filter(c => c.name === 'Write' && /[\/\\]concept[\/\\][a-z0-9-]+\.html$/.test(c.input.file_path || '') && !/index\.html$/.test(c.input.file_path || '')).map(turnOf))];
  const reentry = T.findIndex(t => t.some(c => isRead(c, /vong-moi\.md$/)) && t.some(c => /roles\.mjs/.test(cmd(c))) && t.some(c => isRead(c, /DECISIONS\.md$/))) + 1;
  const rolesRuns = calls.filter(c => /roles\.mjs/.test(cmd(c))).length;
  const grepScreen = calls.filter(c => /\bgrep\b/.test(cmd(c)) && /concept\/(?!index)[a-z0-9-]+\.html/.test(cmd(c))).length;
  const text = c => (res.get(c.id) || {}).text || '';
  const vfArgs = calls.flatMap(c => [...cmd(c).matchAll(/--vi-fonts\s+([a-z-]+)(?:\s+"([^"]*)")?/g)].map(m => m[2] || ''));
  const zero = calls.filter(c => /--vi-fonts/.test(cmd(c))).reduce((n, c) => n + (text(c).match(/^0 font /gm) || []).length, 0);
  const cut = calls.filter(c => /characters truncated/.test(text(c))).map(turnOf);
  const faux = calls.filter(c => /check\.mjs/.test(cmd(c)) && /đậm giả/.test(text(c))).length;
  console.log(`  vòng đầu: Read vong-dau.md ở lượt ${vd.join(', ') || '-'} · cùng lượt concept-method: ${vdWithCm ? 'có' : 'không'} · check.mjs in kèm prompt §2: ${promptWithCheck ? 'có' : 'không'} · đọc concepts.example.js: ${example}`);
  console.log(`  màn viết ở lượt: ${screenTurns.join(', ') || '-'} · vào lại một lượt (vong-moi + DECISIONS + roles.mjs): ${reentry ? 'lượt ' + reentry : 'không'} · roles.mjs: ${rolesRuns} · grep màn: ${grepScreen}`);
  console.log(`  --vi-fonts không từ khoá: ${vfArgs.filter(k => !k).length} · có từ khoá: ${vfArgs.filter(Boolean).length} · ra 0 font: ${zero} · kết quả bị cắt giữa ở lượt: ${cut.join(', ') || '-'} · check.mjs báo đậm giả: ${faux}`);
  // Đợt sửa thứ năm (04/10): Big Shoulders vào VI_FONT_ISSUES, agent chấm loại chỉ đọc, đọc khuôn sẽ điền cùng lượt cp (không chép),
  // vòng chỉ đổi dữ liệu chạy thẳng --shots, không --font chỉ để xem độ đậm. Kèm lượt mất cache (subagent dùng cache 5 phút)
  const fill = c => (c.input.content || c.input.new_string || '');
  const bigShoulders = calls.filter(c => (c.name === 'Write' || c.name === 'Edit') && /concepts\.js$/.test(c.input.file_path || '') && /Big Shoulders(?! (Inline|Stencil))/.test(fill(c))).length;
  const heredocPages = calls.filter(c => /cat\s*>\s*"?[^"\s]*\.html/.test(cmd(c)) && !/[\/]concept[\/][^\/"\s]+\.html/.test(cmd(c))).length;
  const scorer = calls.filter(c => c.name === 'Agent' || c.name === 'Task').map(c => c.input.subagent_type || 'general-purpose');
  const cpTurn = T.findIndex(t => t.some(c => /cp [^\n]*concept-board\.html/.test(cmd(c))));
  const tplSameTurn = cpTurn >= 0 && [/templates[\\/]concepts\.js$/, /templates[\\/]key-screen\.html$/].every(re => T[cpTurn].some(c => isRead(c, re)));
  const tplCopied = calls.filter(c => /cp [^\n]*templates\/(concepts\.js|key-screen\.html)/.test(cmd(c))).length;
  const roundCheck = calls.filter(c => /check\.mjs[^\n;&|]*--round \d+(?![^\n;&|]*--shots)/.test(cmd(c))).length;
  const fontCalls = calls.filter(c => /preflight\.py[^\n]*--font\b/.test(cmd(c))).length;
  // Lượt mất cache: cache_read tụt dưới (read + write) của lượt trước hơn 20k; đánh số lượt như turns.js (mọi tin nhắn của agent)
  const usage = [], seen = new Set();
  for (const o of L) if (o.type === 'assistant' && o.message && !seen.has(o.message.id)) { seen.add(o.message.id); usage.push(o.message.usage || {}); }
  const misses = [];
  for (let i = 1; i < usage.length; i++) {
    const p = usage[i - 1], u = usage[i], exp = (p.cache_read_input_tokens || 0) + (p.cache_creation_input_tokens || 0);
    if ((u.cache_read_input_tokens || 0) < exp - 20000) misses.push({ turn: i + 1, lost: exp - (u.cache_read_input_tokens || 0) });
  }
  const missCost = misses.reduce((s, m) => s + m.lost * (1.25 - 0.1), 0);
  console.log(`  đợt năm: concepts.js có Big Shoulders: ${bigShoulders} · trang HTML thử bằng heredoc: ${heredocPages} · agent chấm: ${scorer.join(', ') || '-'} · đọc khuôn cùng lượt cp: ${vd.length && cpTurn >= 0 ? (tplSameTurn ? 'có' : 'không') : '-'} (lệnh chép khuôn sẽ điền: ${tplCopied})`);
  console.log(`  check --round không --shots: ${roundCheck} · preflight --font: ${fontCalls} · mất cache ở lượt: ${misses.map(m => `${m.turn} (${Math.round(m.lost / 1000)}k)`).join(', ') || '-'}${missCost ? ` · tốn thêm ≈ ${Math.round(missCost / 1000)}k` : ''}`);
}
