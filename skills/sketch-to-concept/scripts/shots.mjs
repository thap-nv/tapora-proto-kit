// Chụp bảng concept và các màn then chốt ở bộ khổ cố định, in mỗi ảnh một dòng kết quả đo.
// node <skills>/sketch-to-concept/scripts/shots.mjs <thư-mục-concept> [file.html ...]
//   Mặc định: index.html ở 1440; mọi file .html khác trong thư mục (a.html, b.html, a-hlv.html…) ở 1440 và 390.
//   Ảnh ghi vào <thư-mục-concept>/shots/<tên>-<khổ>.png, chỉ khung đầu (không chụp cả trang).
//   Màn có phần tử [data-signature] (khối của tương tác đặc trưng): cuộn tới và chụp riêng khối đó, <tên>-<khổ>-sig.png.
//   QA_QUERY="?theme=dark": chụp nền tối, tên ảnh thêm đuôi -dark.
// Dùng run.mjs của sketch-to-site (CDP): khổ 390 là khổ thật. Edge/Chrome headless với --window-size không thu cửa sổ
// dưới khoảng 500px, nên ảnh "390" chụp cách đó thật ra là trang rộng hơn bị cắt.
// Mỗi dòng: tràn ngang, chữ tràn hoặc bị cắt, tương phản dưới ngưỡng, màu sai ý định, lỗi console; kèm tối đa 3 chi tiết.
// Dòng của index.html thêm trạng thái của bảng: lỗi dữ liệu, dải dữ liệu mẫu, cảnh báo So trục, cặp màu dưới AA trên tile.
// Thoát 0 khi mọi ảnh OK, 1 khi có dòng lỗi, 4 khi không có trình duyệt, 2 khi sai tham số.
import { spawn } from 'node:child_process';
import { readdirSync, writeFileSync, mkdirSync, rmSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN = join(HERE, '..', '..', 'sketch-to-site', 'templates', 'qa-kit', 'run.mjs');
const [dirArg, ...only] = process.argv.slice(2);
if (!dirArg || !existsSync(dirArg)) { console.error('Cách dùng: node shots.mjs <thư-mục-concept> [file.html ...]'); process.exit(2); }
const dir = resolve(dirArg);
const SIZES = { 1440: ['1440', '900', '0'], 390: ['390', '844', '1'] };
const files = only.length ? only : readdirSync(dir).filter(f => f.endsWith('.html')).sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
const jobs = files.flatMap(f => (f === 'index.html' ? [1440] : [1440, 390]).map(w => ({ file: f, w })));
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
  pairs: [...document.querySelectorAll('[data-tile] li[data-contrast][data-grade="Không đạt"]')]
    .map(e => (e.closest('[data-tile]').getAttribute('data-tile') || '').toUpperCase() + ': ' + e.textContent.replace(/\\s+/g, ' ').trim()),
})`;
const SIG = '[data-signature]';

function runOne({ file, w }) {
  const name = `${basename(file, '.html')}-${w}${dark ? '-dark' : ''}`;
  const steps = join(tmp, `${name}.json`);
  const list = file === 'index.html'
    ? [{ name: 'chup', shot: name, check: BOARD_CHECK }]
    : [{ name: 'chup', shot: name },
       { name: 'sig', js: `document.querySelector('${SIG}')?.scrollIntoView({ block: 'start' })`, wait: 300, shot: `${name}-sig`, clip: SIG }];
  writeFileSync(steps, JSON.stringify({ steps: list }));
  return new Promise(done => {
    const p = spawn(process.execPath, [...flags, RUN, join(dir, file), steps, shotsDir, ...SIZES[w]], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => done({ file, w, name, code, out, err }));
  });
}

// Tóm một báo cáo run.mjs thành một dòng và vài chi tiết
function summarize({ file, w, name, code, out, err }) {
  const head = `${file} ${w}`;
  if (code !== 0) return { bad: true, text: `${head}: run.mjs thoát mã ${code}: ${err.trim().split('\n').slice(-2).join(' | ')}` };
  const report = JSON.parse(out);
  const step = report.find(s => s.step === 'chup') || {};
  const d = step.dims || {};
  // Màn chưa gắn data-signature: run.mjs báo không thấy khung clip; đó là một dòng cần sửa, không phải lỗi console
  const noSig = report.some(s => (s.errors || []).some(e => e.includes(`khung clip ${SIG}`)));
  const errors = report.flatMap(s => s.errors || []).filter(e => !e.includes(`khung clip ${SIG}`));
  const parts = [], details = [];
  if (file === 'index.html') {
    let b = {};
    try { b = JSON.parse(step.check || '{}'); } catch {}
    const board = [['error', 'lỗi dữ liệu'], ['axes', 'So trục'], ['pairs', 'cặp màu dưới AA']];
    if (b.example) parts.push('dữ liệu mẫu');
    for (const [key, label] of board) {
      const list = b[key] || [];
      if (list.length) { parts.push(`${label} ${list.length}`); details.push(...list.slice(0, 3).map(x => `  ${label}: ${x}`)); }
    }
  } else if (noSig) parts.push('chưa gắn data-signature');
  if (d.sw > d.cw) parts.push(`tràn ngang +${d.sw - d.cw}px`);
  for (const [key, label] of [['cut', 'chữ tràn/cắt'], ['contrast', 'tương phản'], ['intent', 'màu sai ý định']]) {
    const list = Array.isArray(d[key]) ? d[key] : [];
    if (list.length) { parts.push(`${label} ${list.length}`); details.push(...list.slice(0, 3).map(x => `  ${label}: ${typeof x === 'string' ? x : JSON.stringify(x)}`)); }
  }
  if (errors.length) { parts.push(`lỗi console ${errors.length}`); details.push(...errors.slice(0, 3).map(x => `  lỗi: ${x}`)); }
  if (!step.dims) parts.push('không đo được bố cục');
  const outFiles = [`shots/${name}.png`, ...(file === 'index.html' || noSig ? [] : [`shots/${name}-sig.png`])];
  return { bad: parts.length > 0, text: `${head}: ${parts.length ? parts.join(' · ') : 'OK'} → ${outFiles.join(' · ')}` + (details.length ? '\n' + details.join('\n') : '') };
}

// Chạy song song tối đa 3 trình duyệt: mỗi lần run.mjs tự chọn cổng trống và hồ sơ riêng
const results = new Array(jobs.length);
let next = 0;
await Promise.all(Array.from({ length: Math.min(3, jobs.length) }, async () => {
  while (next < jobs.length) { const i = next++; results[i] = await runOne(jobs[i]); }
}));
rmSync(tmp, { recursive: true, force: true });
if (results.some(r => r.code === 4)) { console.error('Không tìm thấy Edge, Chrome hay Chromium. Đặt biến QA_BROWSER.'); process.exit(4); }
const lines = results.map(summarize);
console.log(lines.map(l => l.text).join('\n'));
process.exit(lines.some(l => l.bad) ? 1 : 0);
