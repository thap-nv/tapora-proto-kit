#!/usr/bin/env node
// Sinh <site>/assets/themes.css từ <site>/assets/themes.json.
//   node <skills>/sketch-to-site/scripts/themes.mjs <thư-mục-prototype> [--site site] [--check] [--all]
// Mỗi theme khai màu gốc (seeds) và chế độ sáng/tối (mode). Lệnh tính vai dẫn xuất (hover, nhấn, nền nhạt, viền control, vòng focus,
// liên kết…) bằng templates/color.js, đo mọi cặp bắt buộc ở mọi theme rồi in kết quả:
//   cặp dưới ngưỡng: KHÔNG ghi file, thoát mã 1 · cặp vượt ngưỡng chưa tới 0,3: vẫn ghi, in SÁT để xem lại.
// --check: không ghi; thoát mã 1 khi themes.css thiếu hoặc cũ hơn themes.json (preflight.py P21 kiểm cùng dấu băm).
// --all: in mọi cặp, không chỉ cặp chưa đạt.
// Thêm theme: thêm một mục vào "themes" rồi chạy lại. Không sửa themes.css bằng tay.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const C = createRequire(import.meta.url)('../templates/color.js');
const argv = process.argv.slice(2);
const opts = { site: 'site', check: false, all: false };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--site') opts.site = argv[++i];
  else if (argv[i] === '--check') opts.check = true;
  else if (argv[i] === '--all') opts.all = true;
  else pos.push(argv[i]);
}
if (pos.length !== 1) { console.error('Cách dùng: node themes.mjs <thư-mục-prototype> [--site site] [--check] [--all]'); process.exit(2); }
const dir = join(resolve(pos[0]), opts.site, 'assets');
const src = join(dir, 'themes.json'), out = join(dir, 'themes.css');
if (!existsSync(src)) {
  console.error(`Không thấy ${src}. Chép khuôn <skills>/sketch-to-site/templates/themes.json vào đó rồi điền màu gốc.`);
  process.exit(2);
}
const text = readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
const hash = createHash('sha1').update(text, 'utf8').digest('hex').slice(0, 10);
const HEAD = `/* Sinh bởi themes.mjs từ themes.json (băm ${hash}). Không sửa tay: sửa themes.json rồi chạy lại lệnh. */`;

if (opts.check) {
  const cur = existsSync(out) ? readFileSync(out, 'utf8') : '';
  const ok = cur.startsWith(HEAD);
  console.log(ok ? `themes.css khớp themes.json (băm ${hash})`
    : `themes.css ${cur ? 'cũ hơn themes.json' : 'chưa có'}: chạy node <skills>/sketch-to-site/scripts/themes.mjs ${pos[0]}`);
  process.exit(ok ? 0 : 1);
}

let data;
try { data = JSON.parse(text); } catch (e) { console.error(`themes.json không phải JSON hợp lệ: ${e.message}`); process.exit(2); }
const themes = data.themes || {};
const names = Object.keys(themes);
const def = data.default || {};
const errs = [];
if (!names.length) errs.push('themes.json chưa có theme nào trong "themes".');
for (const n of names) {
  if (!/^[a-z0-9-]+$/.test(n)) errs.push(`Tên theme "${n}": chỉ gồm a-z, 0-9 và dấu gạch ngang.`);
  if (!['light', 'dark'].includes(themes[n] && themes[n].mode)) errs.push(`Theme "${n}": "mode" phải là "light" hoặc "dark".`);
}
// default.light: theme cho máy để chế độ sáng (sản phẩm chỉ có nền tối thì trỏ vào theme tối). default.dark: tuỳ chọn
if (!themes[def.light]) errs.push(`"default.light" phải trỏ tới một theme có trong "themes" (đang là "${def.light}").`);
if (def.dark !== undefined && !themes[def.dark]) errs.push(`"default.dark" phải trỏ tới một theme có trong "themes" (đang là "${def.dark}").`);
if (errs.length) { errs.forEach(e => console.error(e)); process.exit(2); }

const blocks = {}, report = [];
let bad = 0, near = 0, total = 0;
for (const n of names) {
  const t = themes[n];
  let res;
  try { res = C.deriveTheme(t.seeds || {}, t.mode, t.overrides); } catch (e) { console.error(`Theme "${n}": ${e.message}`); process.exit(2); }
  const vars = res.vars;
  const chart = t.chart || [];
  chart.forEach((c, i) => { vars[`chart-${i + 1}`] = C.toHex(c); });
  const pairs = C.PAIRS.concat(chart.map((_, i) => [`chart-${i + 1}`, 'surface', 3, `Màu biểu đồ ${i + 1} trên thẻ`]));
  const rows = C.measure(vars, pairs);
  bad += rows.filter(r => r.verdict === 'khong').length;
  near += rows.filter(r => r.verdict === 'sat').length;
  total += rows.length;
  report.push({ n, mode: t.mode, rows, notes: res.notes });
  blocks[n] = `color-scheme:${t.mode};--theme-name:"${n}";--theme-mode:"${t.mode}";` + Object.entries(vars).map(([k, v]) => `--${k}:${v};`).join('');
}

const LABEL = { dat: 'ĐẠT  ', sat: 'SÁT  ', khong: 'KHÔNG' };
for (const { n, mode, rows, notes } of report) {
  console.log(`\ntheme ${n} (${mode === 'dark' ? 'tối' : 'sáng'})`);
  for (const r of rows) {
    if (r.verdict === 'dat' && !opts.all) continue;
    console.log(`  ${LABEL[r.verdict]} ${r.ratio.toFixed(2)}:1  cần ${r.need}  ${r.label}  (--${r.fg} trên --${r.bg}${r.under ? ` phủ trên --${r.under}` : ''})`);
  }
  console.log(`  ${rows.filter(r => r.verdict === 'dat').length}/${rows.length} cặp đạt`);
  for (const x of notes) console.log(`  đã chỉnh ${x}`);
}
const tail = `${names.length} theme · ${total} cặp · ${bad} không đạt · ${near} sát ngưỡng`;
if (bad) {
  console.log(`\n${tail} → KHÔNG ghi themes.css. Sửa màu gốc trong themes.json rồi chạy lại.`);
  process.exit(1);
}
// Khối mặc định sáng gắn vào :root: data-theme lạ (theme đã đổi tên, theme nhớ từ prototype khác cùng file://) vẫn có màu.
// Khối theo tên và khối theo máy tối (:root:not([data-theme])) có độ ưu tiên cao hơn :root nên vẫn thắng
const css = [
  HEAD,
  `:root{--theme-list:"${names.join(' ')}";--theme-default-light:"${def.light}";${def.dark ? `--theme-default-dark:"${def.dark}";` : ''}}`,
  `:root,:root[data-theme="${def.light}"]{${blocks[def.light]}}`,
  ...names.filter(n => n !== def.light).map(n => `:root[data-theme="${n}"]{${blocks[n]}}`),
  ...(def.dark ? [`@media (prefers-color-scheme: dark){:root:not([data-theme]){${blocks[def.dark]}}}`] : []),
];
writeFileSync(out, css.join('\n') + '\n');
console.log(`\n${tail} → đã ghi ${join(opts.site, 'assets', 'themes.css')}`);
