#!/usr/bin/env node
// Kiểm B2 và chuẩn bị ảnh Cổng 3 của sketch-to-site trong một lệnh:
//   node <skills>/sketch-to-site/scripts/system-check.mjs <thư-mục-prototype> [--site site]
// 1. scripts/themes.mjs: tính vai dẫn xuất, đo mọi cặp ở mọi theme, ghi themes.css. Có cặp không đạt thì in cặp đó rồi dừng (thoát 1).
// 2. scripts/preflight.py <site>/: dòng tổng, rồi từng dòng LỖI và CẢNH BÁO (chỉ LỖI và cảnh báo P19, P20 làm lệnh chưa sạch).
// 3. <site>/_system.html ở mọi theme của themes.json, đo trên trang render (templates/qa-kit/run.mjs):
//    1440 và 390: lỗi console, tràn ngang (kèm phần tử gây ra), chữ tràn hoặc bị cắt trong khung (kể cả hộp tràn khỏi khối cha),
//    tương phản trên nền thật, màu theo ý định;
//    1440: còn component mẫu (data-system-demo) không, cặp màu trên trang. Chụp ở 1440 vào <thư-mục-prototype>/_shots/system/:
//    <theme>-1440.png, <theme>-1440-2.png, … (từng màn, để soát) và <theme>-1440-full.png (cả trang, để trình ở Cổng 3).
// In ngắn: mỗi phần một dòng số, tối đa 8 dòng chi tiết. Thoát 0 khi sạch, 1 khi còn mục cần sửa, 4 khi không có trình duyệt.
// Ảnh không ghi vào _qa/: thư mục đó là của bộ kiểm, cài ở B4 (scripts/qa-check.py).
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const S2S = resolve(HERE, '..');
const RUN = join(S2S, 'templates', 'qa-kit', 'run.mjs');
const { startBrowser } = await import(pathToFileURL(join(dirname(RUN), 'browser.mjs')).href);
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const MAX = 8;

const argv = process.argv.slice(2);
let siteName = 'site';
const pos = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === '--site') siteName = argv[++i]; else pos.push(argv[i]); }
if (pos.length !== 1) { console.error('Cách dùng: node system-check.mjs <thư-mục-prototype> [--site site]'); process.exit(2); }
const proto = resolve(pos[0]);
const site = join(proto, siteName);
const rel = p => relative(proto, p).replace(/\\/g, '/');
const shortPaths = s => s.split(proto + '\\').join('').split(proto + '/').join('').replace(/\\/g, '/');
const problems = [];
const say = (head, details = []) => {
  console.log(head);
  for (const d of details.slice(0, MAX)) console.log('  ' + d);
  if (details.length > MAX) console.log(`  … còn ${details.length - MAX} dòng`);
};

if (!existsSync(join(site, '_system.html'))) {
  console.log(`Chưa có ${siteName}/_system.html: chép <skills>/sketch-to-site/templates/system.html thành ${siteName}/_system.html rồi chạy lại.`);
  process.exit(1);
}

// 1. themes.mjs
const th = spawnSync(process.execPath, [join(HERE, 'themes.mjs'), proto, '--site', siteName], { encoding: 'utf8' });
const thLines = (th.stdout + th.stderr).split(/\r?\n/);
const thTail = [...thLines].reverse().find(l => /theme · \d+ cặp/.test(l)) || thLines.filter(Boolean).slice(-1)[0] || '';
const pairLines = thLines.filter(l => /^ {2}(KHÔNG|SÁT)/.test(l)).map(l => l.trim().replace(/^KHÔNG\s+/, 'KHÔNG ĐẠT ').replace(/^SÁT\s+/, 'SÁT '));
say(`themes.mjs: ${shortPaths(thTail.trim())}`, th.status === 0 ? pairLines : pairLines.length ? pairLines : thLines.filter(Boolean).slice(0, MAX));
if (th.status !== 0) {
  console.log('Kết luận: CÒN cặp màu không đạt: sửa màu gốc trong themes.json rồi chạy lại lệnh này (chưa đo _system.html).');
  process.exit(1);
}

// 2. preflight.py
// cwd là thư mục prototype: preflight in đường dẫn tương đối theo thư mục đang đứng, nên dòng lỗi ra site/<file>:<dòng>
const pf = spawnSync(PYTHON, [join(HERE, 'preflight.py'), site], { cwd: proto, encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
const pfLines = (pf.stdout || '').split(/\r?\n/);
const pfTail = ([...pfLines].reverse().find(l => /\d+ file · \d+ lỗi/.test(l)) || (pf.stderr || '').trim().split(/\r?\n/).pop() || '').replace(/ · kiểu kiểm: \w+$/, '');
// In mọi dòng LỖI và CẢNH BÁO, kể cả cảnh báo không chặn (P13 href="#"…): đo 4.5, chỉ in con số nên agent phải chạy riêng preflight.py để biết là gì
const pfShow = pfLines.filter(l => /\s(LỖI|CẢNH BÁO)\s/.test(l)).map(l => shortPaths(l.trim()).replace(/\s{2,}/g, '  '));
const pfBad = pfShow.filter(l => /\sLỖI\s/.test(l) || /\sP(19|20)\s/.test(l));
say(`preflight ${siteName}/: ${pfTail}`, pfShow);
if (pf.status !== 0 || pfBad.length) problems.push('preflight');

// 3. _system.html ở mọi theme: thứ tự và tham số như qa_init.py (theme mặc định sáng đứng đầu, không tham số)
const tj = JSON.parse(readFileSync(join(site, 'assets', 'themes.json'), 'utf8'));
const names = Object.keys(tj.themes || {});
const first = (tj.default || {}).light || names[0];
const themes = [first, ...names.filter(n => n !== first)].map(n => [n, n === first ? '' : `?theme=${n}`]);
const outDir = join(proto, '_shots', 'system');
mkdirSync(outDir, { recursive: true });
// Dấu của ảnh lần chạy trước: lần chạy sau chỉ báo màn nào đổi, để chỉ mở lại màn đó (đo 4.5: mở lại cả 10–11 màn sau mỗi đợt sửa nhỏ)
const SHOT = /^[\w-]+-1440(-\d+|-full)?\.png$/;
const digest = f => createHash('sha1').update(readFileSync(join(outDir, f))).digest('hex');
const before = new Map(readdirSync(outDir).filter(f => SHOT.test(f)).map(f => [f, digest(f)]));
for (const f of before.keys()) rmSync(join(outDir, f));
const work = mkdtempSync(join(tmpdir(), 'system-check-'));
// Giống SYSTEM_STEPS của qa_init.py: component mẫu còn lại, cặp màu dưới ngưỡng, biến token thiếu
const STATE = `JSON.stringify({demo:document.querySelectorAll('[data-system-demo]').length,pairs:document.querySelectorAll('[data-pair]').length,`
  + `khong:[...document.querySelectorAll('[data-pair][data-verdict="khong"]')].map(e=>e.dataset.pair),`
  + `missing:((document.querySelector('[data-sys-missing]')||{}).textContent||'').trim()})`;

const runPage = (name, query, steps, w, h, mobile) => new Promise(done => {
  const sf = join(work, `${name}.json`);
  writeFileSync(sf, JSON.stringify({ query, steps }));
  const p = spawn(process.execPath, [RUN, join(site, '_system.html'), sf, outDir, String(w), String(h), mobile ? '1' : '0'], { stdio: ['ignore', 'pipe', 'pipe'], env: runEnv });
  let out = '', err = '';
  p.stdout.on('data', d => { out += d; });
  p.stderr.on('data', d => { err += d; });
  p.on('close', code => done({ code, out, err }));
});

// Một trình duyệt chung cho cả lệnh (browser.mjs), mỗi lần run.mjs một ngữ cảnh riêng; không mở được thì mỗi lần tự mở như cũ.
// Mỗi theme hai lần chạy song song (1440 và 390), lần lượt từng theme: máy yếu không phải chạy 2 × số theme cùng lúc
const browser = await startBrowser().catch(() => null);
const runEnv = { ...process.env, ...(browser ? { QA_CDP: browser.url } : {}) };
const results = [];
for (const [n, q] of themes) {
  const pair = await Promise.all([
    runPage(`${n}-1440`, q, [
      { name: 'view', wait: 600, check: STATE, shot: `${n}-1440`, slices: 12 },
      { name: 'full', wait: 50, shot: `${n}-1440-full`, full: true }], 1440, 900, false),
    runPage(`${n}-390`, q, [{ name: 'view', wait: 600 }], 390, 844, true)]);
  results.push([n, 1440, pair[0]], [n, 390, pair[1]]);
}
if (browser) await browser.close();
for (const [n, w, r] of results) {
  if (r.code === 4) { console.log((r.err || '').trim()); rmSync(work, { recursive: true, force: true }); process.exit(4); }
  let rep;
  try { rep = JSON.parse(r.out); } catch { rep = null; }
  if (r.code !== 0 || !rep) {
    say(`_system ${n} ${w}: LỖI CHẠY`, (r.err || r.out).trim().split(/\r?\n/).slice(-3));
    problems.push(`${n} ${w}`);
    continue;
  }
  const view = rep.find(s => s.step === 'view') || {};
  const d = view.dims || { sw: 0, cw: 0, cut: [], contrast: [], intent: [] };
  const consoleErrs = rep.flatMap(s => s.errors || []);
  const over = d.sw > d.cw ? [`tràn ngang: trang rộng ${d.sw}px trong khung ${d.cw}px${(d.wide || []).length ? ', do ' + d.wide.join(', ') : ''}`] : [];
  const counts = [['console', consoleErrs.length], ['tràn ngang', over.length], ['trong khung', d.cut.length], ['tương phản', d.contrast.length], ['ý định', d.intent.length]];
  const details = [...consoleErrs.map(e => 'console: ' + e.slice(0, 160)), ...over, ...d.cut.map(x => 'trong khung: ' + x),
    ...d.contrast.map(x => 'tương phản: ' + x), ...d.intent.map(x => 'ý định: ' + x)];
  let tail = '';
  if (w === 1440) {
    let s = {};
    try { s = JSON.parse(view.check); } catch {}
    const ok = (s.pairs || 0) - (s.khong || []).length;
    tail = ` · component mẫu ${s.demo ?? '?'} · cặp ${ok}/${s.pairs ?? '?'}`;
    if (s.demo) details.push('component mẫu: còn khối data-system-demo của khuôn; thay bằng component thật của dự án');
    if ((s.khong || []).length) details.push('cặp dưới ngưỡng trên trang: ' + s.khong.slice(0, 6).join(', '));
    if (s.missing) details.push('thiếu biến token: ' + s.missing);
    if (s.demo || (s.khong || []).length || s.missing) problems.push(`${n} ${w} system`);
  }
  if (counts.some(([, c]) => c)) problems.push(`${n} ${w}`);
  say(`_system ${n} ${w}: ${counts.map(([k, c]) => `${k} ${c}`).join(' · ')}${tail}`, details);
}
rmSync(work, { recursive: true, force: true });

const shots = readdirSync(outDir);
// Màn thứ mấy: <theme>-1440.png là màn 1, <theme>-1440-<n>.png là màn n
const nth = f => +((/-1440-(\d+)\.png$/.exec(f) || [, 1])[1]);
// Thư mục tuyệt đối và tên từng ảnh, để mở thẳng bằng Read không cần ls; kèm màn nào đổi so với lần chạy trước
console.log('Ảnh (mở cùng một lượt):');
console.log(`  thư mục: ${resolve(outDir).replace(/\\/g, '/')}/`);
const changed = [];
for (const [n] of themes) {
  const slices = shots.filter(f => new RegExp(`^${n}-1440(-\\d+)?\\.png$`).test(f)).sort((a, b) => nth(a) - nth(b));
  console.log(`  ${n}: ${slices.join(', ') || '(không có)'} · cả trang: ${n}-1440-full.png`);
  changed.push(...slices.filter(f => before.get(f) !== digest(f)));
}
if (!before.size) console.log('  lần chạy đầu: mở mọi màn');
else console.log(changed.length ? `  đổi so với lần chạy trước (chỉ cần mở lại các màn này): ${changed.join(', ')}` : '  không màn nào đổi so với lần chạy trước');
console.log(problems.length
  ? `Kết luận: CÒN ${problems.length} mục: sửa ở gốc (references/qa-gate.md mục 6) rồi chạy lại lệnh này.`
  : 'Kết luận: SẠCH. Trình ở Cổng 3 ảnh cả trang của mỗi theme và dòng themes.mjs ở trên.');
process.exit(problems.length ? 1 : 0);
