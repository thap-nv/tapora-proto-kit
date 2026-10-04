// Chụp bảng concept và các màn then chốt ở bộ khổ cố định, in mỗi ảnh một dòng kết quả đo.
// node <skills>/sketch-to-concept/scripts/shots.mjs <thư-mục-concept> [--round <n>] [file.html ...]
//   Mặc định: index.html ở 1440; màn của mọi concept trong concepts.js (<id>.html và <id>-<bề mặt>.html) ở 1440 và 390.
//   Concept chỉ đổi lớp Hình (screen): chụp màn của concept nó mượn với Hình của nó, tên ảnh mang id của nó.
//   --round <n>: chỉ chụp concept của vòng n (và bảng). Có liệt kê file thì chỉ chụp các file đó.
//   Vòng n không có concept nào: thoát 2. Concept không có file màn (của nó, hoặc màn nó mượn): một dòng lỗi.
//   Không đọc được concepts.js: chụp mọi file .html trong thư mục như cũ; có --round thì thoát 2.
//   Ảnh ghi vào <thư-mục-concept>/shots/<tên>-<khổ>.png, chỉ khung đầu (không chụp cả trang).
//   Màn có phần tử [data-signature] (khối của tương tác đặc trưng): cuộn tới và chụp riêng khối đó, <tên>-<khổ>-sig.png.
//   QA_QUERY="?theme=dark": chụp nền tối, tên ảnh thêm đuôi -dark. Chỉ dùng khi người dùng đã xin chế độ tối.
// Dùng run.mjs của sketch-to-site (CDP): khổ 390 là khổ thật. Edge/Chrome headless với --window-size không thu cửa sổ
// dưới khoảng 500px, nên ảnh "390" chụp cách đó thật ra là trang rộng hơn bị cắt.
// Mỗi dòng: tràn ngang, chữ tràn hoặc bị cắt, tương phản dưới ngưỡng, màu sai ý định, lỗi console; kèm tối đa 3 chi tiết.
// Dòng 1440 của màn riêng (không phải màn mượn) ghi thêm "dài: …" khi màn vượt ngân sách: quá 25% trang ngoài khung đầu và khối
// chữ ký, hoặc file quá 10 KB. Chỉ báo, dòng vẫn OK.
// Dòng của index.html thêm trạng thái của bảng: lỗi dữ liệu, dải dữ liệu mẫu, cảnh báo So trục, cặp màu chưa đạt,
// concept thiếu lý do Hình, và số concept qua mấy vòng.
// Thoát 0 khi mọi ảnh OK, 1 khi có dòng lỗi, 4 khi không có trình duyệt, 2 khi sai tham số.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN = join(HERE, '..', '..', 'sketch-to-site', 'templates', 'qa-kit', 'run.mjs');
const args = process.argv.slice(2);
const ri = args.indexOf('--round');
const roundArg = ri >= 0 ? +args[ri + 1] : null;
if (ri >= 0) args.splice(ri, 2);
const [dirArg, ...only] = args;
if (!dirArg || !existsSync(dirArg) || (ri >= 0 && !(roundArg > 0))) { console.error('Cách dùng: node shots.mjs <thư-mục-concept> [--round <n>] [file.html ...]'); process.exit(2); }
const dir = resolve(dirArg);
const SIZES = { 1440: ['1440', '900', '0'], 390: ['390', '844', '1'] };
const htmlFiles = readdirSync(dir).filter(f => f.endsWith('.html')).sort();

// Dữ liệu concept, nếu đọc được: màn nào của concept nào, concept nào chỉ đổi Hình, ở vòng nào
function loadConcepts() {
  try {
    // window là chính ngữ cảnh, như trình duyệt và lệnh node -e của Cổng 2: concepts.js viết CONCEPTS.concepts.push(...) vẫn chạy
    const ctx = {};
    ctx.window = ctx;
    vm.runInNewContext(readFileSync(join(dir, 'concepts.js'), 'utf8'), ctx);
    const D = ctx.CONCEPTS;
    return D && Array.isArray(D.concepts) && D.concepts.length ? D : null;
  } catch { return null; }
}
const D = loadConcepts();
if (roundArg !== null && !D) {
  console.error('--round cần đọc được concept trong concepts.js: file có lỗi cú pháp, hoặc chưa có concept nào. Sửa concepts.js rồi chạy lại.');
  process.exit(2);
}
// File màn của một concept: <id>.html và <id>-<bề mặt>.html (ab.html không phải màn của a).
// Id cũng có thể chứa gạch ngang: file thuộc về id dài nhất khớp với nó (a-2.html là màn của a-2, không phải màn phụ của a)
const ids = D ? D.concepts.map(c => String(c.id)) : [];
const matches = (id, f) => f === `${id}.html` || f.startsWith(`${id}-`);
const ownerOf = f => ids.filter(id => matches(id, f)).sort((a, b) => b.length - a.length)[0];
const filesOf = id => htmlFiles.filter(f => matches(id, f) && ownerOf(f) === id);
const both = file => [1440, 390].map(w => ({ file, w }));

let jobs;
// Concept không có file màn nào (thiếu <id>.html, hoặc màn nó mượn): thành dòng lỗi, không im lặng bỏ qua
const missing = [];
if (only.length) jobs = only.flatMap(f => (f === 'index.html' ? [{ file: f, w: 1440 }] : both(f)));
else if (D) {
  jobs = [{ file: 'index.html', w: 1440 }];
  const inRound = D.concepts.filter(c => roundArg === null || +(c.round || 1) === roundArg);
  if (roundArg !== null && !inRound.length) {
    console.error(`Không có concept nào ở vòng ${roundArg}. Concept của vòng mới phải ghi round: ${roundArg} trong concepts.js.`);
    process.exit(2);
  }
  for (const c of inRound) {
    const screen = c.screen || c.id;
    if (!filesOf(screen).length) missing.push(`${c.id}: không thấy màn ${screen}.html trong thư mục concept`);
    if (!c.screen) { for (const f of filesOf(c.id)) jobs.push(...both(f)); continue; }
    const up = String(c.id).toUpperCase();
    const query = '?mix=' + encodeURIComponent(`man:${String(c.screen).toUpperCase()} mau:${up} chu:${up} nut:${up}`);
    for (const f of filesOf(c.screen)) for (const j of both(f)) jobs.push({ ...j, as: c.id + f.slice(c.screen.length, -5), query });
  }
} else jobs = htmlFiles.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)))
  .flatMap(f => (f === 'index.html' ? [{ file: f, w: 1440 }] : both(f)));
const dark = /[?&]theme=dark(&|$)/.test(process.env.QA_QUERY || '');
const shotsDir = join(dir, 'shots');
mkdirSync(shotsDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'concept-shots-'));
const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];

// Trạng thái bảng concept, đọc từ DOM mà concept-board.html dựng ra
const BOARD_CHECK = `JSON.stringify({
  error: [...document.querySelectorAll('[data-board-error]:not([hidden]) li')].map(e => e.textContent.trim()),
  example: !!document.querySelector('[data-example-banner]'),
  axes: [...document.querySelectorAll('[data-axes-warning]')].map(e => e.textContent.trim()),
  pairs: [...document.querySelectorAll('[data-tile] li[data-contrast][data-verdict="khong"]')]
    .map(e => (e.closest('[data-tile]').getAttribute('data-tile') || '').toUpperCase() + ': ' + e.textContent.replace(/\\s+/g, ' ').trim()),
  why: [...document.querySelectorAll('[data-card-warning="why"]')].map(e => e.closest('[data-card]').getAttribute('data-card').toUpperCase()),
  count: ((window.CONCEPTS || {}).concepts || []).length,
  rounds: new Set(((window.CONCEPTS || {}).concepts || []).map(c => +(c.round || 1))).size,
})`;
const SIG = '[data-signature]';
// Ngân sách màn then chốt (SKILL.md A3 bước 4): khung đầu + khối tương tác đặc trưng. Phần trang ngoài hai vùng đó không ảnh nào chụp tới
const BUDGET = { share: 0.25, kb: 10 };
const LENGTH_CHECK = `(() => { const s = document.querySelector('${SIG}'), r = s && s.getBoundingClientRect();
  const H = document.documentElement.scrollHeight, vh = innerHeight, top = r ? r.top + scrollY : 0, bot = r ? top + r.height : 0;
  const cover = vh + (r ? r.height : 0) - (r ? Math.max(0, Math.min(vh, bot) - Math.max(0, top)) : 0);
  return JSON.stringify({ H, out: Math.max(0, H - cover) }); })()`;

function runOne({ file, w, as, query }) {
  const name = `${as || basename(file, '.html')}-${w}${dark ? '-dark' : ''}`;
  const steps = join(tmp, `${name}.json`);
  const list = file === 'index.html'
    ? [{ name: 'chup', shot: name, check: BOARD_CHECK }]
    : [{ name: 'chup', shot: name, ...(w === 1440 && !as ? { check: LENGTH_CHECK } : {}) },
       { name: 'sig', js: `document.querySelector('${SIG}')?.scrollIntoView({ block: 'start' })`, wait: 300, shot: `${name}-sig`, clip: SIG }];
  writeFileSync(steps, JSON.stringify({ ...(query ? { query } : {}), steps: list }));
  return new Promise(done => {
    const p = spawn(process.execPath, [...flags, RUN, join(dir, file), steps, shotsDir, ...SIZES[w]], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => done({ file, w, as, name, code, out, err }));
  });
}

// Tóm một báo cáo run.mjs thành một dòng và vài chi tiết
function summarize({ file, w, as, name, code, out, err }) {
  const head = as ? `${as} (màn ${file}) ${w}` : `${file} ${w}`;
  if (code !== 0) return { bad: true, text: `${head}: run.mjs thoát mã ${code}: ${err.trim().split('\n').slice(-2).join(' | ')}` };
  const report = JSON.parse(out);
  const step = report.find(s => s.step === 'chup') || {};
  const d = step.dims || {};
  // Màn chưa gắn data-signature: run.mjs báo không thấy khung clip; đó là một dòng cần sửa, không phải lỗi console
  const noSig = report.some(s => (s.errors || []).some(e => e.includes(`khung clip ${SIG}`)));
  const errors = report.flatMap(s => s.errors || []).filter(e => !e.includes(`khung clip ${SIG}`));
  const parts = [], details = [];
  let tail = '';
  if (file === 'index.html') {
    let b = {};
    try { b = JSON.parse(step.check || '{}'); } catch {}
    const board = [['error', 'lỗi dữ liệu'], ['axes', 'So trục'], ['pairs', 'cặp màu chưa đạt'], ['why', 'thiếu lý do Hình']];
    if (b.example) parts.push('dữ liệu mẫu');
    for (const [key, label] of board) {
      const list = b[key] || [];
      if (list.length) { parts.push(`${label} ${list.length}`); details.push(...list.slice(0, 3).map(x => `  ${label}: ${x}`)); }
    }
    if (b.count) tail = ` · ${b.count} concept, ${b.rounds} vòng`;
  } else {
    if (noSig) parts.push('chưa gắn data-signature');
    // Báo, không chặn: cắt màn sau khi đã viết tốn thêm một lần Edit. Ghi để lần viết sau ngắn hơn
    let len = null;
    try { len = JSON.parse(step.check || 'null'); } catch {}
    if (len && len.H) {
      const share = len.out / len.H, kb = Math.round(statSync(join(dir, file)).size / 1024);
      if (share > BUDGET.share || kb > BUDGET.kb) tail = ` · dài: ${Math.round(share * 100)}% trang ngoài khung đầu và khối chữ ký, ${kb} KB (ngân sách ${BUDGET.share * 100}%, ${BUDGET.kb} KB)`;
    }
  }
  if (d.sw > d.cw) parts.push(`tràn ngang +${d.sw - d.cw}px`);
  for (const [key, label] of [['cut', 'chữ tràn/cắt'], ['contrast', 'tương phản'], ['intent', 'màu sai ý định']]) {
    const list = Array.isArray(d[key]) ? d[key] : [];
    if (list.length) { parts.push(`${label} ${list.length}`); details.push(...list.slice(0, 3).map(x => `  ${label}: ${typeof x === 'string' ? x : JSON.stringify(x)}`)); }
  }
  if (errors.length) { parts.push(`lỗi console ${errors.length}`); details.push(...errors.slice(0, 3).map(x => `  lỗi: ${x}`)); }
  if (!step.dims) parts.push('không đo được bố cục');
  const outFiles = [`shots/${name}.png`, ...(file === 'index.html' || noSig ? [] : [`shots/${name}-sig.png`])];
  return { bad: parts.length > 0, text: `${head}: ${parts.length ? parts.join(' · ') : 'OK'}${tail} → ${outFiles.join(' · ')}` + (details.length ? '\n' + details.join('\n') : '') };
}

// Chạy song song tối đa 3 trình duyệt: mỗi lần run.mjs tự chọn cổng trống và hồ sơ riêng
const results = new Array(jobs.length);
let next = 0;
await Promise.all(Array.from({ length: Math.min(3, jobs.length) }, async () => {
  while (next < jobs.length) { const i = next++; results[i] = await runOne(jobs[i]); }
}));
rmSync(tmp, { recursive: true, force: true });
if (results.some(r => r.code === 4)) { console.error('Không tìm thấy Edge, Chrome hay Chromium. Đặt biến QA_BROWSER.'); process.exit(4); }
const lines = results.map(summarize).concat(missing.map(text => ({ bad: true, text })));
console.log(lines.map(l => l.text).join('\n'));
process.exit(lines.some(l => l.bad) ? 1 : 0);
