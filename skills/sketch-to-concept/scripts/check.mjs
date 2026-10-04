// Kiểm bản nháp concepts.js trong một lệnh, trước khi dựng màn hay chụp: thay cho nhiều lượt node -e, --font, preflight riêng lẻ.
// node <skills>/sketch-to-concept/scripts/check.mjs <thư-mục-concept> [--round <n>] [--shots]
//   Mỗi concept một dòng: "<id>: OK", hoặc các mục cần sửa cách nhau bằng " · ".
//   Lỗi (phải sửa): dữ liệu sai quy ước, cặp màu dưới ngưỡng, thiếu lý do Hình (why), cặp concept khác nhau chưa đủ trục,
//   font không có dấu tiếng Việt hoặc có mà dấu đọc sai, đậm giả (màn của concept, hay màn nó mượn, đặt chữ của một vai ở độ đậm
//   từ 600 mà font của vai đó không nạp độ đậm nào từ 600: font không có, hoặc fontWeights không khai; độ đậm của màn đọc bằng
//   roles.mjs). Lưu ý (không chặn): hai màu có sắc lệch dưới 60° và dưới 0,3 độ sáng (oklch), font không có trong dữ liệu Google Fonts,
//   đậm giả ở chữ không khai vai (tính là body, có thể sai vì chưa tính kế thừa).
//   --round <n>: chỉ báo concept của vòng n; So trục vẫn so với mọi concept trên bảng.
//   --shots: tự kiểm sau khi dựng màn (A3 bước 5, vòng mới bước 6), một lệnh thay cho ba: kiểm dữ liệu như trên, rồi preflight.py
//   trên thư mục, rồi shots.mjs (cùng --round). Lỗi của preflight và dòng ảnh chưa OK cộng vào dòng tổng cuối.
// Dùng tokens.js và color.js của kit, không dùng bản chép trong dự án. Font kiểm bằng preflight.py --font.
// Thoát 0 khi không có lỗi, 1 khi có lỗi, 2 khi sai tham số hoặc không đọc được concepts.js, 4 khi --shots không có trình duyệt.
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { screenRoles, weightsUsed } from './roles.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const T = require(join(HERE, '..', 'templates', 'tokens.js'));
const C = require(join(HERE, '..', '..', 'sketch-to-site', 'templates', 'color.js'));
const PREFLIGHT = join(HERE, '..', '..', 'sketch-to-site', 'scripts', 'preflight.py');
const SHOTS = join(HERE, 'shots.mjs');
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const PY_ENV = { ...process.env, PYTHONIOENCODING: 'utf-8' };

const args = process.argv.slice(2);
const si = args.indexOf('--shots');
const withShots = si >= 0;
if (withShots) args.splice(si, 1);
const ri = args.indexOf('--round');
const round = ri >= 0 ? +args[ri + 1] : null;
if (ri >= 0) args.splice(ri, 2);
const dir = args[0] && resolve(args[0]);
if (!dir || !existsSync(dir) || (ri >= 0 && !(round > 0))) {
  console.error('Cách dùng: node check.mjs <thư-mục-concept> [--round <n>] [--shots]');
  process.exit(2);
}

let D;
try {
  const ctx = {};
  ctx.window = ctx;   // như trình duyệt và lệnh node -e của Cổng 2: concepts.js viết CONCEPTS.concepts.push(...) vẫn chạy
  vm.runInNewContext(readFileSync(join(dir, 'concepts.js'), 'utf8'), ctx);
  D = ctx.CONCEPTS;
} catch (e) {
  console.error(`Không đọc được concepts.js: ${e.message}`);
  process.exit(2);
}
const invalid = T.validate(D);
if (invalid.length) {
  for (const m of invalid) console.log(`Dữ liệu: ${m}`);
  console.log(`→ ${invalid.length} lỗi · 0 lưu ý`);
  process.exit(1);
}
const cs = D.concepts.filter(c => round === null || +(c.round || 1) === round);
if (!cs.length) {
  console.error(round === null ? 'concepts.js chưa có concept nào.' : `Không có concept nào ở vòng ${round}.`);
  process.exit(2);
}

const num = (x, d = 2) => x.toFixed(d).replace('.', ',');
const L = id => String(id).toUpperCase();
const pairs = T.diffAxes(D).filter(d => !d.ok);
const lint = T.lint(D);
let errors = 0, warns = 0;

// Hai màu có sắc (oklch C >= 0,04) phải lệch >= 60° sắc độ hoặc >= 0,3 độ sáng (concept-method.md mục 5.1)
function spread(p) {
  const roles = ['primary', 'secondary', 'accent'].filter(r => p[r]);
  const seen = new Map();
  for (const r of roles) {
    const k = String(p[r]).toLowerCase();
    if (seen.has(k)) continue;
    const [l, ch, h] = C.toOklch(p[r]);
    if (ch >= 0.04) seen.set(k, { r, l, h });
  }
  const out = [], list = [...seen.values()];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j], dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)), dl = Math.abs(a.l - b.l);
    if (dh < 60 && dl < 0.3) out.push(`lưu ý màu: ${a.r}/${b.r} lệch ${Math.round(dh)}°, độ sáng lệch ${num(dl)} (cần ≥ 60° hoặc ≥ 0,3)`);
  }
  return out;
}

// Font: mỗi tên một lần, kiểm bằng preflight.py --font (dữ liệu Google Fonts của ui-ux-pro-max); dòng của font ghi cả độ đậm nó có
const fonts = [...new Set(cs.flatMap(c => ['display', 'body', 'mono'].map(k => (c.fontFamily || {})[k]).filter(f => f && f !== T.PLATFORM)))];
const fontRun = fonts.length ? spawnSync(PY, [PREFLIGHT, '--font', ...fonts], { encoding: 'utf8', env: PY_ENV }) : null;
const fontLines = fontRun && !fontRun.error && fontRun.status !== 2 ? fontRun.stdout.split(/\r?\n/) : [];
const fontLine = f => fontLines.find(x => x.startsWith(f) && /^\s/.test(x.slice(f.length))) || '';
// "100–300,500,700–900" → [100, 200, 300, 500, 700, 800, 900]
const weightsOf = f => {
  const m = /· độ đậm ([\d,–]+)/.exec(fontLine(f));
  if (!m) return null;
  return m[1].split(',').flatMap(p => { const [a, b = a] = p.split('–').map(Number); const out = []; for (let w = a; w <= b; w += 100) out.push(w); return out; });
};

// Đậm giả: màn đặt chữ của vai ở độ đậm từ 600 mà các độ đậm được nạp (fontWeights giao với độ đậm font có) đều dưới 600
const screens = new Map();
function fauxBold(c) {
  const s = c.screen || c.id, file = join(dir, `${s}.html`);
  if (!existsSync(file)) return { bad: [], note: [] };
  if (!screens.has(s)) screens.set(s, screenRoles(readFileSync(file, 'utf8')));
  const roles = screens.get(s), bad = [], note = [];
  for (const role of ['display', 'body', 'mono']) {
    const font = (c.fontFamily || {})[role], avail = font && font !== T.PLATFORM && weightsOf(font);
    if (!avail) continue;
    const declared = String((c.fontWeights || {})[role] || '400;500;600;700');
    const loaded = declared.split(';').map(Number).filter(w => avail.includes(w));
    if (Math.max(0, ...(loaded.length ? loaded : avail.slice(0, 1))) >= 600) continue;
    const used = weightsUsed(roles, role).filter(x => x.w >= 600);
    for (const explicit of [true, false]) {
      const u = used.filter(x => x.explicit === explicit);
      if (!u.length) continue;
      const ws = [...new Set(u.map(x => x.w))].sort().join(', '), where = u.slice(0, 2).map(x => x.where).join(', ');
      const msg = avail.some(w => w >= 600)
        ? `đậm giả: fontWeights.${role} "${declared}" thiếu ${ws} mà màn ${s}.html dùng (${where})`
        : `đậm giả: ${role} ${font} chỉ có độ đậm ${avail.join(', ')}, màn ${s}.html dùng ${ws} (${where}): chọn font có độ đậm đó`;
      (explicit ? bad : note).push(explicit ? msg : `lưu ý ${msg}, chữ không khai vai`);
    }
  }
  return { bad, note };
}

for (const c of cs) {
  const bad = [], note = [];
  const fb = fauxBold(c);
  bad.push(...fb.bad);
  note.push(...fb.note);
  for (const mode of ['light', 'dark']) {
    const p = c.colors[mode];
    if (!p) continue;
    const fail = T.checkPairs(p, mode).filter(r => r.verdict === 'khong');
    const tag = c.colors.light && c.colors.dark ? ` (${mode === 'dark' ? 'tối' : 'sáng'})` : '';
    if (fail.length) bad.push(`tương phản${tag}: ` + fail.slice(0, 3).map(r => `${r.label} ${r.ratio === null ? '?' : num(r.ratio)}:1 cần ${num(r.need, 1)}`).join(', ') + (fail.length > 3 ? ` và ${fail.length - 3} cặp nữa` : ''));
    note.push(...spread(p));
  }
  const w = lint.find(x => x.id === c.id);
  if (w) bad.push(`thiếu lý do Hình (${T.WHY.filter(k => !String((c.why || {})[k] || '').trim()).join(', ')})`);
  for (const d of pairs.filter(d => d.a === c.id || d.b === c.id)) {
    const other = L(d.a === c.id ? d.b : d.a);
    bad.push(d.shared
      ? `gần ${other} (chung màn, khác ${d.differ.filter(a => T.HINH_AXES.includes(a)).length} trong 3 trục Hình, cần 2)`
      : `gần ${other} (khác ${d.differ.length} trục${d.differ.includes('khung') ? '' : ', chung khung'})`);
  }
  errors += bad.length;
  warns += note.length;
  console.log(`${c.id}: ${[...bad, ...note].join(' · ') || 'OK'}`);
}

if (fonts.length) {
  const r = fontRun;
  if (r.error || r.status === 2) {
    warns++;
    console.log(`Font: không kiểm được (${r.error ? r.error.message : (r.stdout || r.stderr).trim()})`);
  } else {
    const state = f => {
      const l = fontLine(f);
      // Có subset vietnamese mà dấu đọc sai (VI_FONT_ISSUES của preflight.py): lỗi; khó đọc nhẹ: lưu ý
      const issue = /· (dấu khó đọc|lưu ý): (.*)$/.exec(l);
      if (issue) { if (issue[1] === 'dấu khó đọc') errors++; else warns++; return `${issue[1]}: ${issue[2].trim()}`; }
      if (/\sVI\s/.test(l)) return 'VI';
      if (/KHÔNG có dấu/.test(l)) { errors++; return 'KHÔNG có dấu tiếng Việt'; }
      warns++;
      return 'không có trong dữ liệu Google Fonts, kiểm tay';
    };
    console.log('Font: ' + fonts.map(f => `${f} ${state(f)}`).join(' · '));
  }
}

if (withShots) {
  // preflight.py trên cả thư mục: một dòng tổng, rồi các dòng lỗi và cảnh báo thụt lề
  const p = spawnSync(PY, [PREFLIGHT, dir], { encoding: 'utf8', env: PY_ENV });
  const out = (p.stdout || '').split(/\r?\n/).filter(l => l.trim());
  const sum = out.find(l => /^\d+ file · \d+ lỗi · \d+ cảnh báo/.test(l));
  if (p.error || !sum) {
    errors++;
    console.log(`Preflight: không chạy được (${p.error ? p.error.message : (p.stderr || p.stdout || '').trim().split('\n').slice(-1)[0]})`);
  } else {
    const [, nErr, nWarn] = sum.match(/· (\d+) lỗi · (\d+) cảnh báo/).map(Number);
    errors += nErr;
    warns += nWarn;
    const found = out.filter(l => l !== sum);
    console.log(`Preflight: ${sum.split(' · kiểu kiểm')[0]}`);
    for (const l of found.slice(0, 10)) console.log('  ' + l.replace(dir, '').replace(/^[\\/]/, ''));
    if (found.length > 10) console.log(`  … và ${found.length - 10} dòng nữa`);
  }
  // shots.mjs: mỗi ảnh một dòng như khi chạy riêng; dòng chưa OK là lỗi
  const s = spawnSync(process.execPath, [SHOTS, dir, ...(round === null ? [] : ['--round', String(round)])], { encoding: 'utf8' });
  if (s.status === 4) { console.error((s.stderr || '').trim()); process.exit(4); }
  const lines = (s.stdout || '').split(/\r?\n/).filter(l => l.trim());
  if (s.status === 2 || s.error) {
    errors++;
    console.log(`Chụp: không chạy được (${s.error ? s.error.message : (s.stderr || '').trim()})`);
  }
  for (const l of lines) console.log(l);
  errors += lines.filter(l => !/^\s/.test(l) && !/: OK\b/.test(l)).length;
}
console.log(`→ ${errors} lỗi · ${warns} lưu ý`);
process.exit(errors ? 1 : 0);
