// Kiểm các điểm giữ chi phí token và thời gian của sketch-to-concept (v1.3), rút từ đo ba lần chạy thật:
// chấm lớp Ý trên dữ liệu trước khi dựng màn, làm lại tối đa một lần, mặc định một agent dựng tuần tự,
// chép khuôn mà không mở, chỉ đọc đúng mục cần đọc, một lệnh chụp cho bộ ảnh cố định.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SKILL = path.resolve(__dirname, '..');
const S2S = path.resolve(SKILL, '..', 'sketch-to-site');
const read = f => fs.readFileSync(path.join(SKILL, f), 'utf8');
const section = (md, from, to) => {
  const i = md.indexOf(from);
  assert.ok(i >= 0, `không thấy "${from}"`);
  const j = to ? md.indexOf(to, i + from.length) : -1;
  return md.slice(i, j < 0 ? undefined : j);
};
// A1–A3 ở references/vong-dau.md (đo 1.4 sau đợt sửa cuối: vòng 2 đọc cả SKILL.md 28k ký tự, mà 16k là phần chỉ vòng đầu dùng)
const R1 = () => read('references/vong-dau.md');
const A2 = () => section(R1(), '### A2 · ', '### A3 · ');
const A3 = () => section(R1(), '### A3 · ', '### Short paths');
const PROMPT1 = () => section(read('references/subagent-prompts.md'), '## 1. Build one concept', '## 2. ');
// Lệnh in đúng mục 3 và 6 của sketch-to-site/SKILL.md, thay cho đọc cả file (31k ký tự để lấy 2,5k)
const SECTIONS_CMD = "sed -n '/^## 3\\./,/^## 4\\./p;/^## 6\\./,/^## 7\\./p'";

test('tokens.js: chất nền grid và dots chỉ dùng biến mà khuôn có xuất', () => {
  const T = require('../templates/tokens.js');
  for (const texture of ['grid', 'dots']) {
    const css = T.cssText({ colors: { light: { background: '#FFFFFF', foreground: '#111111', border: '#DDDDDD' } }, shape: { texture } });
    const defined = new Set([...css.matchAll(/--([\w-]+):/g)].map(m => m[1]));
    const missing = [...css.matchAll(/var\(--([\w-]+)\)/g)].map(m => m[1]).filter(v => !defined.has(v));
    assert.deepEqual(missing, [], `${texture}: dùng biến không có trong CSS`);
  }
});

test('A3: khuôn không sửa thì chép bằng cp, không mở ra đọc', () => {
  const a3 = A3();
  assert.match(a3, /copied with `cp`/);
  assert.match(a3, /not opened/);
});

test('A3: mặc định một agent dựng tuần tự; subagent dựng chỉ khi người dùng xin song song, tối đa 3', () => {
  const a3 = A3();
  assert.match(a3, /[Bb]y default one agent writes \*\*the three screens in one turn\*\*/);
  assert.match(a3, /user asks for parallel builds/);
  assert.match(a3, /at most 3 subagents/);
});

test('A3: chấm lớp Ý trên dữ liệu concepts.js trước khi dựng màn', () => {
  const a3 = A3();
  const score = a3.search(/\*\*Score the idea layer on the data\*\*/);
  const build = a3.search(/\*\*Build the key screens\*\*/);
  assert.ok(score > 0, 'A3 thiếu bước chấm lớp Ý trên dữ liệu');
  assert.ok(build > score, 'chấm lớp Ý phải đứng trước bước dựng màn');
  const two = section(read('references/subagent-prompts.md'), '## 2. ');
  assert.match(two, /do not open images/, 'chấm trên dữ liệu thì người chấm không cần ảnh');
  // Chạy nền rồi chờ thì agent kết thúc lượt, bị gọi lại và phải nạp lại cả ngữ cảnh
  assert.match(a3.slice(score, build), /in the foreground and wait for the result, not in the background/);
});

test('chấm trên dữ liệu một lần: sửa theo hướng sửa, không chấm lại, lần soát trên ảnh sẽ kiểm', () => {
  assert.match(A3(), /do not re-score on the data/);
  assert.match(section(read('references/concept-method.md'), '## 7. ', '## 8. '), /do not re-score on the data/);
  const two = section(read('references/subagent-prompts.md'), '## 2. ');
  assert.doesNotMatch(two, /resend the §2 prompt/, 'không chấm lại trên dữ liệu');
  assert.match(two, /Answer briefly/, 'người chấm trả lời gọn: bớt thời gian chờ');
});

test('A3: tương tác đặc trưng gắn data-signature để shots.mjs chụp riêng khối đó', () => {
  assert.match(A3(), /`data-signature`/);
  assert.match(read('templates/key-screen.html'), /data-signature/);
});

test('A2: kết quả tra lệch ngành thì bỏ qua, không tra lại', () => {
  assert.match(A2(), /off-industry result is ignored; do not search again/);
});

test('làm lại tối đa một lần sau khi dựng, rồi trình ở Cổng 2 kèm điểm', () => {
  assert.match(A3(), /at most once/);
  const m7 = section(read('references/concept-method.md'), '## 7. ', '## 8. ');
  assert.match(m7, /at most once/);
  assert.match(m7, /Gate 2/);
  assert.doesNotMatch(m7, /until Gate 2 opens|before opening Gate 2/, 'luật cũ không giới hạn số vòng làm lại');
});

test('mục 3 và 6 của sketch-to-site đọc bằng lệnh in đúng hai mục', () => {
  assert.ok(R1().includes(SECTIONS_CMD), 'vong-dau.md chưa có lệnh in mục 3 và 6');
  assert.ok(PROMPT1().includes(SECTIONS_CMD), 'prompt dựng chưa có lệnh in mục 3 và 6');
  // Lệnh bám theo tiêu đề: làm như sed để chắc hai mục còn đó, đúng nội dung, và nhỏ
  const lines = fs.readFileSync(path.join(S2S, 'SKILL.md'), 'utf8').split(/\r?\n/);
  let on = false; const picked = [];
  for (const l of lines) {
    if (/^## [36]\./.test(l)) on = true;
    if (on) picked.push(l);
    if (on && /^## [47]\./.test(l)) on = false;
  }
  const text = picked.join('\n');
  assert.match(text, /^## 3\. Nguyên tắc cốt lõi/m);
  assert.match(text, /Chống AI-slop/);
  assert.match(text, /^## 6\. Ảnh và tài sản/m);
  assert.ok(text.length < 6000, `hai mục dài ${text.length} ký tự`);
});

test('prompt dựng: không mở tokens.js, color.js; subagent dừng giữa chừng thì tạo subagent mới', () => {
  assert.match(PROMPT1(), /Do not open tokens\.js, color\.js/);
  assert.match(read('references/subagent-prompts.md'), /stopped midway[^\n]*new subagent/);
});

test('A2: tra màu một lần cho concept A; kiểm dấu tiếng Việt của font vẫn bắt buộc', () => {
  const a2 = A2();
  assert.doesNotMatch(a2, /run it separately for each concept's family/);
  assert.match(a2, /\(once,/);
  assert.match(a2, /preflight\.py --font/);
});

test('Bàn giao: đề xuất mở phiên mới trước khi dựng prototype', () => {
  assert.match(section(read('SKILL.md'), '### Handover', '## 4. '), /new session/);
});

test('A3 tự kiểm và chụp bằng một lệnh check.mjs --shots (chạy shots.mjs), không trỏ sang lệnh chụp tay của qa-gate.md', () => {
  const a3 = A3();
  assert.match(a3, /`node <skills>\/sketch-to-concept\/scripts\/check\.mjs concept\/ --shots`/);
  assert.match(a3, /`shots\.mjs`/);
  assert.doesNotMatch(a3, /qa-gate\.md/);
});

// Dựng thư mục concept/ từ khuôn như A3 bước 1. sample=false: bỏ cờ example, như dữ liệu của dự án thật
function fixture({ sample = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'concept-shots-'));
  const t = f => path.join(SKILL, 'templates', f);
  fs.copyFileSync(t('concept-board.html'), path.join(dir, 'index.html'));
  fs.copyFileSync(t('tokens.js'), path.join(dir, 'tokens.js'));
  const data = fs.readFileSync(t('concepts.example.js'), 'utf8');
  assert.match(data, /^\s*example: true,\r?\n/m);
  fs.writeFileSync(path.join(dir, 'concepts.js'), sample ? data : data.replace(/^\s*example: true,\r?\n/m, ''));
  for (const f of ['color.js', 'theme.js']) fs.copyFileSync(path.join(S2S, 'templates', f), path.join(dir, f));
  const screen = fs.readFileSync(t('key-screen.html'), 'utf8');
  for (const id of ['a', 'b', 'c']) fs.writeFileSync(path.join(dir, `${id}.html`), screen.replace('data-concept="a"', `data-concept="${id}"`));
  return dir;
}
const pngWidth = f => fs.readFileSync(f).readUInt32BE(16);

test('shots.mjs: bảng ở 1440, mỗi màn ở 1440 và 390 thật, mỗi ảnh một dòng kết quả', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.ok([0, 1].includes(r.status), `shots.mjs thoát mã ${r.status}: ${r.stderr}`);
  const shots = fs.readdirSync(path.join(dir, 'shots')).sort();
  assert.deepEqual(shots, ['a-1440-sig.png', 'a-1440.png', 'a-390-sig.png', 'a-390.png', 'b-1440-sig.png', 'b-1440.png', 'b-390-sig.png', 'b-390.png',
    'c-1440-sig.png', 'c-1440.png', 'c-390-sig.png', 'c-390.png', 'index-1440.png']);
  assert.equal(pngWidth(path.join(dir, 'shots', 'a-390.png')), 390, 'ảnh 390 phải rộng đúng 390px');
  assert.equal(pngWidth(path.join(dir, 'shots', 'index-1440.png')), 1440);
  for (const name of ['index.html 1440', 'a.html 1440', 'a.html 390', 'c.html 390']) {
    assert.match(r.stdout, new RegExp(`^${name.replace('.', '\\.')}: `, 'm'), `thiếu dòng "${name}"`);
  }
  // Placeholder của ô nhập trên tile theo token của concept, không theo màu mặc định #757575 của trình duyệt
  assert.match(r.stdout, /^index\.html 1440: OK · 3 concept, 1 vòng → shots\/index-1440\.png$/m, 'khuôn sạch: bảng concept không có lỗi');
  assert.match(r.stdout, /^a\.html 390: OK → shots\/a-390\.png · shots\/a-390-sig\.png$/m, 'màn có data-signature: chụp thêm khối đó');
});

// Màu điểm ảnh ở hàng đầu của một PNG 8-bit RGB/RGBA (chỉ cần hàng 0: các bộ lọc không cần hàng trên)
function firstRowPixel(file, x) {
  const zlib = require('node:zlib');
  const b = fs.readFileSync(file);
  const w = b.readUInt32BE(16), type = b[25], bpp = type === 6 ? 4 : 3;
  const idat = [];
  for (let o = 8; o < b.length;) {
    const len = b.readUInt32BE(o), kind = b.toString('ascii', o + 4, o + 8);
    if (kind === 'IDAT') idat.push(b.subarray(o + 8, o + 8 + len));
    o += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat)), filter = raw[0], row = Buffer.from(raw.subarray(1, 1 + w * bpp));
  for (let i = bpp; i < row.length; i++) {
    const left = row[i - bpp];
    if (filter === 1 || filter === 4) row[i] = (row[i] + left) & 255;
    else if (filter === 3) row[i] = (row[i] + (left >> 1)) & 255;
  }
  return [...row.subarray(x * bpp, x * bpp + 3)];
}

test('shots.mjs: khối data-signature nằm dưới khung đầu vẫn được chụp đúng vùng', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const page = fs.readFileSync(path.join(dir, 'a.html'), 'utf8')
    .replace(' data-signature>', '>')
    .replace('</main>', '<div style="height:1600px"></div><div data-signature style="height:300px;background:#FF0000"></div></main>');
  fs.writeFileSync(path.join(dir, 'a.html'), page);
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, 'a.html'], { encoding: 'utf8', timeout: 120000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  for (const w of [1440, 390]) {
    const f = path.join(dir, 'shots', `a-${w}-sig.png`);
    assert.ok(fs.existsSync(f), `thiếu ${f}: ${r.stdout}`);
    assert.deepEqual(firstRowPixel(f, 5), [255, 0, 0], `a-${w}-sig.png phải bắt đầu ở khối đỏ`);
  }
});

test('shots.mjs: dòng của bảng báo dữ liệu mẫu, cảnh báo So trục và tương phản dưới AA của bảng', t => {
  const dir = fixture({ sample: true });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  // Ba concept chung khung: bảng phải cảnh báo ở mục So trục
  const f = path.join(dir, 'concepts.js');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8') + "\nfor (const c of CONCEPTS.concepts) c.axes = Object.assign({}, CONCEPTS.concepts[0].axes);\n");
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, 'index.html'], { encoding: 'utf8', timeout: 120000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, `có lỗi thì thoát 1: ${r.stdout}${r.stderr}`);
  const line = r.stdout.split('\n').find(l => l.startsWith('index.html 1440: '));
  assert.match(line, /dữ liệu mẫu/);
  assert.match(line, /So trục 3/);
  assert.match(r.stdout, /So trục: A và B mới khác nhau ở 0 trục/);
});

test('shots.mjs --round 2: chỉ chụp vòng 2; concept chỉ đổi Hình chụp trên màn nó mượn, kể cả màn phụ; bỏ file trùng tiền tố', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.copyFileSync(path.join(dir, 'b.html'), path.join(dir, 'b-hlv.html'));   // b có màn phụ
  fs.copyFileSync(path.join(dir, 'a.html'), path.join(dir, 'ab.html'));      // không phải màn của a
  fs.appendFileSync(path.join(dir, 'concepts.js'), `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'màu ấm hơn' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[1])), { id: 'd', name: 'Than lạnh', round: 2, screen: 'b',
  recommended: false, axes: Object.assign({}, CONCEPTS.concepts[1].axes, { nen: 'Sáng tinh', chatNen: 'Giấy' }), colors: { light: CONCEPTS.concepts[0].colors.light } }));
`);
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, '--round', '2'], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'shots')).sort(), ['d-1440-sig.png', 'd-1440.png', 'd-390-sig.png', 'd-390.png',
    'd-hlv-1440-sig.png', 'd-hlv-1440.png', 'd-hlv-390-sig.png', 'd-hlv-390.png', 'index-1440.png']);
  assert.match(r.stdout, /^d \(màn b\.html\) 390: OK → shots\/d-390\.png · shots\/d-390-sig\.png$/m);
  assert.match(r.stdout, /^d-hlv \(màn b-hlv\.html\) 1440: OK → /m);
  assert.match(r.stdout, /^index\.html 1440: OK · 4 concept, 2 vòng → /m);
});

test('shots.mjs không cờ: chụp mọi concept có trong concepts.js, bỏ file html không thuộc concept nào', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.copyFileSync(path.join(dir, 'a.html'), path.join(dir, 'nhap.html'));
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.ok(!fs.readdirSync(path.join(dir, 'shots')).some(f => f.startsWith('nhap-')), 'nhap.html không phải màn của concept nào');
});

test('shots.mjs: dòng của bảng báo concept thiếu lý do Hình', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.appendFileSync(path.join(dir, 'concepts.js'), '\ndelete CONCEPTS.concepts[1].why;\n');
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, 'index.html'], { encoding: 'utf8', timeout: 120000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^index\.html 1440: thiếu lý do Hình 1 · 3 concept, 1 vòng → /m);
  assert.match(r.stdout, /^  thiếu lý do Hình: B$/m);
});

test('shots.mjs --round: vòng không có concept nào thì báo sai tham số; concept thiếu file màn thì có dòng lỗi', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const shots = (...a) => spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, ...a], { encoding: 'utf8', timeout: 240000 });
  const empty = shots('--round', '5');
  if (empty.status === 4) return t.skip('không có trình duyệt');
  assert.equal(empty.status, 2, empty.stdout + empty.stderr);
  assert.match(empty.stderr, /vòng 5/);
  fs.appendFileSync(path.join(dir, 'concepts.js'), `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'x' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[2])), { id: 'e', round: 2 }));
`);
  const r = shots('--round', '2');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^e: không thấy màn e\.html/m);
});

// Mục nhỏ còn lại sau review 1.4
test('shots.mjs: id có gạch ngang không làm nhận nhầm màn (a-2.html là màn của a-2, không phải màn phụ của a)', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.copyFileSync(path.join(dir, 'c.html'), path.join(dir, 'a-2.html'));
  fs.appendFileSync(path.join(dir, 'concepts.js'), `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'bố cục khác' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[2])), { id: 'a-2', name: 'Bản hai', round: 2, recommended: false }));
`);
  const shots = (...a) => spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, ...a], { encoding: 'utf8', timeout: 240000 });
  const one = shots('--round', '1');
  if (one.status === 4) return t.skip('không có trình duyệt');
  assert.ok(!fs.readdirSync(path.join(dir, 'shots')).some(f => f.startsWith('a-2-')), `vòng 1 chụp cả a-2.html:\n${one.stdout}`);
  fs.rmSync(path.join(dir, 'shots'), { recursive: true, force: true });
  shots('--round', '2');
  assert.deepEqual(fs.readdirSync(path.join(dir, 'shots')).filter(f => !f.startsWith('index')).sort(),
    ['a-2-1440-sig.png', 'a-2-1440.png', 'a-2-390-sig.png', 'a-2-390.png']);
});

test('shots.mjs --round: concepts.js không đọc được thì báo sai tham số, không chụp mọi file', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'concepts.js'), 'window.CONCEPTS = { concepts: [\n');
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, '--round', '2'], { encoding: 'utf8', timeout: 60000 });
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stderr, /concepts\.js/);
  assert.equal(fs.existsSync(path.join(dir, 'shots')), false, 'không được chụp gì');
});

// scripts/check.mjs: kiểm bản nháp concepts.js trong một lệnh (dữ liệu, tương phản, lý do Hình, So trục, độ lệch màu, font tiếng Việt).
// Đo vòng 2 ở 1.4: agent mất 5–8 lượt cho node -e, --font, preflight riêng lẻ trước khi dựng hay chụp
const CHECK = path.join(SKILL, 'scripts', 'check.mjs');
const check = (dir, ...a) => spawnSync(process.execPath, [CHECK, dir, ...a], { encoding: 'utf8', timeout: 60000 });

test('check.mjs: bản nháp sạch thì mỗi concept một dòng OK, font có dấu tiếng Việt, thoát 0', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const r = check(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  for (const id of ['a', 'b', 'c']) assert.match(r.stdout, new RegExp(`^${id}: OK$`, 'm'));
  assert.match(r.stdout, /^Font: [^\n]*Newsreader VI/m);
  assert.match(r.stdout, /^→ 0 lỗi · 0 lưu ý$/m);
});

test('check.mjs: báo tương phản, thiếu lý do Hình, concept gần nhau, font thiếu dấu tiếng Việt; thoát 1', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.appendFileSync(path.join(dir, 'concepts.js'), `
CONCEPTS.concepts[0].colors.light['on-primary'] = CONCEPTS.concepts[0].colors.light.primary;
delete CONCEPTS.concepts[1].why.chu;
CONCEPTS.concepts[2].fontFamily.display = 'Outfit';
CONCEPTS.concepts[2].axes = Object.assign({}, CONCEPTS.concepts[0].axes);
`);
  const r = check(dir);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^a: [^\n]*tương phản: Chữ trên nút chính 1,00:1 cần 4,5/m);
  assert.match(r.stdout, /^a: [^\n]*gần C \(khác 0 trục, chung khung\)/m);
  assert.match(r.stdout, /^b: thiếu lý do Hình \(chu\)$/m);
  assert.match(r.stdout, /^Font: [^\n]*Outfit KHÔNG có dấu tiếng Việt/m);
  assert.match(r.stdout, /^→ [1-9]\d* lỗi · \d+ lưu ý$/m);
});

test('check.mjs: hai màu có sắc quá gần (dưới 60° và dưới 0,3 độ sáng) là lưu ý, không chặn', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.appendFileSync(path.join(dir, 'concepts.js'), "\nCONCEPTS.concepts[0].colors.light.primary = '#9C2A1E'; CONCEPTS.concepts[0].colors.light.accent = '#B3261E';\n");
  const r = check(dir);
  assert.match(r.stdout, /^a: lưu ý màu: primary\/accent lệch \d+°, độ sáng lệch 0,\d\d \(cần ≥ 60° hoặc ≥ 0,3\)/m, r.stdout);
  assert.doesNotMatch(r.stdout, /^a: [^\n]*tương phản/m, 'đổi màu trong test không được làm hỏng tương phản');
  assert.equal(r.status, 0, r.stdout);
});

test('check.mjs --round 2: chỉ báo concept của vòng 2; concepts.js hỏng thì thoát 2', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.appendFileSync(path.join(dir, 'concepts.js'), `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'màu ấm hơn' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[1])), { id: 'd', name: 'Than lạnh', round: 2, screen: 'b',
  recommended: false, axes: Object.assign({}, CONCEPTS.concepts[1].axes, { nen: 'Sáng tinh', chatNen: 'Giấy' }), colors: { light: CONCEPTS.concepts[0].colors.light } }));
`);
  const r = check(dir, '--round', '2');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^d: OK$/m);
  assert.doesNotMatch(r.stdout, /^[abc]: /m);
  assert.equal(check(dir, '--round', '5').status, 2);
  fs.writeFileSync(path.join(dir, 'concepts.js'), 'window.CONCEPTS = { concepts: [\n');
  const bad = check(dir);
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /concepts\.js/);
});

// Ngân sách màn then chốt: khung đầu + khối tương tác đặc trưng. Ba lần chạy ở 1.4 viết màn 12–20 KB, 21–51% trang nằm ngoài
// khung đầu và khối chữ ký: không ảnh nào chụp tới, mà vẫn tốn output (×5) và nằm lại trong ngữ cảnh
test('shots.mjs: màn dài quá ngân sách thì dòng 1440 ghi thêm độ dài, vẫn OK; màn ngắn và màn mượn không ghi', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const filler = Array.from({ length: 14 }, (_, i) => `<section style="min-height:420px;padding:40px"><h2>Phần ${i + 1}</h2><p>${'Nội dung phụ không ai chụp tới. '.repeat(12)}</p></section>`).join('\n');
  const a = fs.readFileSync(path.join(dir, 'a.html'), 'utf8');
  fs.writeFileSync(path.join(dir, 'a.html'), a.replace('</body>', filler + '\n</body>'));
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', 'shots.mjs'), dir, 'a.html', 'b.html'], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.match(r.stdout, /^a\.html 1440: OK · dài: \d+% trang ngoài khung đầu và khối chữ ký, \d+ KB \(ngân sách 25%, 10 KB\) → /m, r.stdout);
  assert.doesNotMatch(r.stdout, /^a\.html 390: [^\n]*dài:/m, 'chỉ đo ở 1440');
  assert.match(r.stdout, /^b\.html 1440: OK → /m);
});

// Đo 1.4 sau 5 đề xuất (vòng 1: 54 lượt): giá theo lượt × ngữ cảnh, lượt cuối mang 150–200k token.
// A1–A2 mất 28 lượt, 8 lượt đọc mã để biết điều tài liệu chưa nói; tự kiểm 13 lượt, mỗi lần xem ảnh và sửa một concept một lượt.
test('lượt: SKILL.md dặn gộp việc độc lập vào một lượt; A2, A3 bước 1 và 5, vòng mới ghi cụ thể', () => {
  const md = read('SKILL.md');
  assert.match(section(md, '## 3. Process', '### Start'), /\*\*Turns cost more than text\.\*\*[^\n]*one turn/);
  assert.match(A2(), /one turn[^\n]*--vi-fonts/, 'A2: in mục lục, 20 phong cách, search.py, mọi lần tra font gộp lượt');
  const a3 = A3();
  const step1 = section(a3, '1. **Copy the templates**', '2. **Write');
  assert.ok(step1.includes(SECTIONS_CMD), 'A3 bước 1: in mục 3 và 6 của sketch-to-site cùng lượt chép khuôn');
  assert.match(step1, /same turn/);
  const step5 = section(a3, '5. **Self-check**');
  assert.match(step5, /all images of every concept in one turn/);
  assert.match(step5, /every fix in one turn/);
  // Mục 2 không còn bắt in mục 3 và 6 trước A3: đọc sớm thì mọi lượt sau mang theo
  assert.doesNotMatch(section(md, '## 2. ', '## 3. '), /Read both before A3/);
  const v6 = section(read('references/vong-moi.md'), '6. **Self-check**', '7. ');
  assert.match(v6, /one turn/);
});

test('tự kiểm một lệnh: A3 bước 5 và vòng mới dùng check.mjs --shots (dữ liệu, preflight, ảnh)', () => {
  assert.match(section(A3(), '5. **Self-check**'), /`node <skills>\/sketch-to-concept\/scripts\/check\.mjs concept\/ --shots`/);
  const v6 = section(read('references/vong-moi.md'), '6. **Self-check**', '7. ');
  assert.match(v6, /`node <skills>\/sketch-to-concept\/scripts\/check\.mjs concept\/ --round <n> --shots`/);
  assert.match(v6, /P07/);
});

test('check.mjs --shots: kiểm dữ liệu, chạy preflight trên thư mục rồi chụp; một dòng tổng cho cả ba', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const r = spawnSync(process.execPath, [CHECK, dir, '--shots'], { encoding: 'utf8', timeout: 300000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = r.stdout;
  const at = s => { const i = out.search(s); assert.ok(i >= 0, `thiếu ${s}\n${out}`); return i; };
  const data = at(/^a: OK$/m), pre = at(/^Preflight: [^\n]*0 lỗi/m), shot = at(/^index\.html 1440: OK/m), total = at(/^→ 0 lỗi · 0 lưu ý$/m);
  assert.ok(data < pre && pre < shot && shot < total, 'thứ tự: dữ liệu, preflight, ảnh, dòng tổng');
  assert.equal((out.match(/^→ /gm) || []).length, 1, 'chỉ một dòng tổng');
  assert.ok(fs.existsSync(path.join(dir, 'shots', 'c-390.png')));
});

test('check.mjs --shots: preflight hay ảnh có lỗi thì cộng vào dòng tổng và thoát 1', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  // Gạch nối dài giữa hai giờ là lỗi P02 của preflight
  const a = path.join(dir, 'a.html');
  fs.writeFileSync(a, fs.readFileSync(a, 'utf8').replace('</main>', '<p>Mở 5:30 – 19:00</p></main>'));
  const r = spawnSync(process.execPath, [CHECK, dir, '--shots'], { encoding: 'utf8', timeout: 300000 });
  if (r.status === 4) return t.skip('không có trình duyệt');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^Preflight: [^\n]*[1-9]\d* lỗi/m);
  assert.match(r.stdout, /^  [^\n]*P02/m, 'in dòng lỗi của preflight, thụt lề');
  assert.match(r.stdout, /^→ [1-9]\d* lỗi/m);
});

// Agent đã đọc mã để biết những điều này: shots.mjs và probes.js (màu sai ý định), tokens.js (cặp tương phản, vai font)
test('tài liệu nói thứ agent từng phải đọc mã để biết: màu sai ý định, cặp màu được đo, ba vai font, tra font nhiều lần một lệnh', () => {
  assert.match(section(A3(), '5. **Self-check**'), /wrong action colour[^\n]*`--primary`[^\n]*`--destructive`/);
  const m51 = section(read('references/concept-method.md'), '### 5.1', '### 5.2');
  const T = require('../templates/tokens.js');
  const src = read('templates/tokens.js');
  const fgs = [...new Set([...section(src, 'const PAIRS = [', '];').matchAll(/\['([\w-]+)', '([\w-]+)'/g)].map(m => m[1]))];
  for (const fg of fgs) assert.ok(m51.includes(`\`${fg}\``), `§5.1 thiếu cặp có ${fg}`);
  assert.match(m51, /hover[^\n]*focus ring|focus ring[^\n]*hover/);
  const m52 = section(read('references/concept-method.md'), '### 5.2', '### 5.3');
  assert.match(m52, /`fontFamily` has three roles: `display`, `body`, `mono`/);
  assert.match(read('scripts/check.mjs'), /\['display', 'body', 'mono'\]/, 'check.mjs đọc đúng ba vai font');
  assert.ok(T.cssText, 'tokens.js nạp được');
  for (const [f, s] of [['SKILL.md A2', A2()], ['concept-method.md §5.2', m52], ['vong-moi.md', read('references/vong-moi.md')]]) {
    assert.match(s, /repeat `--vi-fonts[ `]/, `${f} chưa nói lặp --vi-fonts trong một lệnh`);
  }
  assert.match(m52, /no match[^\n]*other kinds/i);
});

// Đo 1.4 sau gộp lượt (bốn lần chạy): còn mất lượt ở search.py bị cắt, WebSearch phải nạp riêng, mở ảnh của màn đang hỏng,
// vòng mới cat 30KB file rồi vẫn phải Read lại để Edit; 3/4 lần gặp font có dấu đọc sai mà bộ kiểm vẫn cho qua
test('A2: search.py --design-system in qua bộ lọc chỉ lấy màu và chữ; bộ lọc bám đúng tiêu đề trong kết quả', () => {
  const a2 = A2();
  const m = /--design-system[^`]*\| sed -n '\/([^/]+)\/,\/([^/]+)\/p'/.exec(a2);
  assert.ok(m, 'A2 thiếu bộ lọc cho kết quả --design-system');
  const py = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  const r = spawnSync(py, [path.join(SKILL, '..', 'ui-ux-pro-max', 'scripts', 'search.py'), 'bakery landing warm', '--design-system'],
    { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(r.status, 0, r.stderr);
  const lines = r.stdout.split(/\r?\n/);
  const from = lines.findIndex(l => l.includes(m[1])), to = lines.findIndex((l, i) => i > from && l.includes(m[2]));
  assert.ok(from >= 0 && to > from, `không thấy tiêu đề ${m[1]} hoặc ${m[2]} trong kết quả search.py`);
  const kept = lines.slice(from, to + 1).join('\n');
  assert.match(kept, /Primary:\s+#[0-9A-F]{6}/i);
  assert.match(kept, /TYPOGRAPHY/);
  assert.ok(kept.length < r.stdout.length / 2, `bộ lọc giữ ${kept.length}/${r.stdout.length} ký tự`);
});

test('A1: WebSearch là công cụ hoãn nạp thì nạp bằng ToolSearch ngay lúc kiểm công cụ, cùng lượt', () => {
  const start = section(read('SKILL.md'), '### Start', '### Re-entry');
  assert.match(start, /`WebSearch`[^\n]*`ToolSearch`[^\n]*same turn/);
});

test('A3 bước 5: dòng có lỗi console hay lỗi dữ liệu thì sửa và chạy lại trước khi mở ảnh của màn đó', () => {
  assert.match(section(A3(), '5. **Self-check**'), /`lỗi console`[^\n]*`lỗi dữ liệu`[^\n]*before opening/);
});

test('vòng mới: concepts.js và DECISIONS.md đọc bằng Read từ đầu (bước sau Edit cả hai), không cat', () => {
  const v = read('references/vong-moi.md');
  assert.match(v, /`concept\/concepts\.js` and `DECISIONS\.md` with `Read`/);
  assert.match(v, /do not `cat` them/);
});

test('font dấu khó đọc: check.mjs báo lỗi cho font trong danh sách, lưu ý cho font khó đọc nhẹ', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.appendFileSync(path.join(dir, 'concepts.js'), "\nCONCEPTS.concepts[0].fontFamily.display = 'Big Shoulders Stencil';\nCONCEPTS.concepts[1].fontFamily.mono = 'Xanh Mono';\n");
  const r = check(dir);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  const font = r.stdout.split(/\r?\n/).find(l => l.startsWith('Font: '));
  assert.match(font, /Big Shoulders Stencil dấu khó đọc: /);
  assert.match(font, /Xanh Mono lưu ý: /);
  assert.match(r.stdout, /^→ 1 lỗi · 1 lưu ý$/m);
});

test('tài liệu: soát dấu tiếng Việt của chữ lớn trên ảnh; §5.2 nói có font đủ dấu mà dấu đọc sai', () => {
  assert.match(section(A3(), '5. **Self-check**'), /check the idea layer on the images[^\n]*ả[^\n]*à/);
  const m52 = section(read('references/concept-method.md'), '### 5.2', '### 5.3');
  assert.match(m52, /marks that read wrong[^\n]*Big Shoulders Stencil/);
});

// Đo 1.4 sau đợt sửa cuối (bốn lần chạy, 2 mỗi vòng): còn tốn ở chỗ nối các bước, không ở một bước nào riêng.
// Vòng 1: lần 30 lượt viết ba màn ba lượt, sửa ý hai lượt, in prompt chấm một lượt riêng, đọc mẫu để biết dạng content.
// Vòng 2: cả hai lần đọc cả SKILL.md, đọc vong-moi.md một lượt rồi mới biết đọc gì, grep màn mượn thêm 1–2 lượt.
test('SKILL.md ngắn: A1–A3 ở references/vong-dau.md; lượt đầu vòng 1 đọc vong-dau.md và concept-method.md cùng lượt kiểm công cụ', () => {
  const md = read('SKILL.md');
  assert.ok(!md.includes('### A1 · ') && !md.includes('### A3 · '), 'SKILL.md còn A1 hay A3');
  assert.ok(md.length < 17000, `SKILL.md dài ${md.length} ký tự`);
  const start = section(md, '### Start', '### Re-entry');
  assert.match(start, /`references\/vong-dau\.md`[^\n]*`references\/concept-method\.md`[^\n]*same turn/);
  for (const h of ['### A1 · ', '### 🛑 Gate 1', '### A2 · ', '### A3 · ', '### Short paths']) assert.ok(R1().includes(h), `vong-dau.md thiếu ${h}`);
});

test('A3: lệnh kiểm bản nháp in luôn prompt chấm §2; sau điểm, sửa ý và viết ba màn trong một lượt', () => {
  const a3 = A3();
  const m = /`node <skills>\/sketch-to-concept\/scripts\/check\.mjs concept\/; (sed -n '[^']+') <skills>\/sketch-to-concept\/references\/subagent-prompts\.md`/.exec(a3);
  assert.ok(m, 'A3 bước 2: check.mjs và prompt §2 chung một lệnh');
  // Như sed: in từ tiêu đề §2 tới hết file
  const lines = read('references/subagent-prompts.md').split(/\r?\n/);
  const from = lines.findIndex(l => /^## 2\./.test(l));
  assert.ok(from > 0 && /\/\^## 2\\.\/,\$p/.test(m[1]), m[1]);
  assert.match(lines.slice(from).join('\n'), /Review the concepts with fresh eyes/);
  assert.match(section(a3, '3. **Score the idea layer', '4. **Build'), /next turn[^\n]*fix[^\n]*write[^\n]*screens/);
  assert.doesNotMatch(a3, /reread only the brief and that concept's block/);
});

test('vào lại: một lượt Read vong-moi.md, concepts.js, DECISIONS.md và một lệnh chép khuôn, in mục concept-method, mục lục họ, bản đồ vai', () => {
  const re = section(read('SKILL.md'), '### Re-entry', '### 🛑 Gate 2');
  assert.match(re, /`references\/vong-moi\.md`, `concept\/concepts\.js` and `DECISIONS\.md` with `Read`/);
  const cmd = /```bash\r?\n([^\n]+)\r?\n```/.exec(re);
  assert.ok(cmd, 'Lối vào lại thiếu lệnh');
  const c = cmd[1];
  assert.match(c, /cp "\$S\/sketch-to-concept\/templates\/concept-board\.html" concept\/index\.html/);
  assert.match(c, /"\$S\/sketch-to-concept\/templates\/tokens\.js" "\$S\/sketch-to-site\/templates\/color\.js" concept\//);
  assert.ok(c.includes(String.raw`grep -E '^### |^- \*\*(Cue words|Dial):' "$S/sketch-to-site/references/style-catalogue.md"`), c);
  assert.match(c, /node "\$S\/sketch-to-concept\/scripts\/roles\.mjs" concept\//);
  // Mốc của sed phải là tiêu đề có thật của concept-method.md
  const sed = /sed -n '([^']+)' "\$S\/sketch-to-concept\/references\/concept-method\.md"/.exec(c);
  assert.ok(sed, 'lệnh thiếu sed in mục concept-method.md');
  const cm = read('references/concept-method.md').split(/\r?\n/);
  for (const m of sed[1].matchAll(/\/\^([^/]+)\//g)) assert.ok(cm.some(l => new RegExp('^' + m[1]).test(l)), `không có tiêu đề ^${m[1]}`);
  assert.ok(fs.existsSync(path.join(SKILL, 'scripts', 'roles.mjs')));
});

test('vòng mới: vai màu và độ đậm của màn mượn lấy từ roles.mjs; font của vai phải có độ đậm màn dùng (đậm giả)', () => {
  const v = read('references/vong-moi.md');
  assert.match(v, /roles\.mjs/);
  assert.doesNotMatch(v, /\| sort \| uniq -c/, 'không còn lệnh grep đếm vai');
  assert.match(v, /đậm giả/);
  assert.match(A3(), /đậm giả/, 'A3 nói check.mjs báo đậm giả');
});

test('font: tài liệu dẫn in đủ danh sách theo loại (không từ khoá) rồi chọn theo tên; không còn nói không khớp thì thoát 1', () => {
  const m52 = section(read('references/concept-method.md'), '### 5.2', '### 5.3');
  for (const [f, s] of [['vong-dau.md A2', A2()], ['concept-method.md §5.2', m52], ['vong-moi.md', read('references/vong-moi.md')]]) {
    assert.match(s, /--vi-fonts <kind>`[^\n]*no keyword[^\n]*every/, `${f} chưa dẫn in đủ danh sách`);
  }
  assert.doesNotMatch(m52, /exits 1/);
  assert.match(m52, /no bold weight|without a weight of 600/);
});

test('khuôn concepts.js ghi dạng giá trị của content và fontWeights', () => {
  const src = read('templates/concepts.js');
  assert.match(src, /content:[^\n]*\{\r?\n\s*\/\/[^\n]*one string/);
  assert.match(src, /fontWeights: \{[^\n]*\/\/[^\n]*'400;700'/);
});

// Đo 1.4 sau đợt sửa thứ tư (bốn lần chạy, 2 mỗi vòng): mỗi chỗ còn lại tốn một lượt, hay một ngữ cảnh lớn hơn cần.
// Agent chấm general-purpose khởi đầu ở 37k ngữ cảnh, Explore ở 23k, đọc cùng nội dung (0,08M so với 0,05–0,06M).
// Vòng 1: một lần chép concepts.js và key-screen.html rồi đọc chúng ở một lượt riêng.
// Vòng 2: một lần chạy check --round riêng rồi mới --shots; một lần chạy thêm --font chỉ để biết độ đậm.
test('A3: agent chấm là loại chỉ đọc (Explore) khi môi trường có', () => {
  assert.match(section(A3(), '3. **Score the idea layer', '4. **Build'), /read-only agent type[^\n]*Explore/);
  assert.match(section(read('references/subagent-prompts.md'), '## 2. '), /read-only agent type[^\n]*Explore/);
});

test('A3 bước 1: khuôn sẽ điền đọc bằng Read từ templates/ cùng lượt với lệnh cp, không chép trước', () => {
  const one = section(A3(), '1. **Copy the templates**', '2. **Write');
  assert.match(one, /same turn[^\n]*`Read`[^\n]*`templates\/concepts\.js`[^\n]*`templates\/key-screen\.html`[^\n]*`DECISIONS\.md`/);
  assert.match(one, /\| `templates\/concepts\.js` \| [^\n]*not copied/);
  assert.match(one, /\| `templates\/key-screen\.html` \| [^\n]*not copied/);
});

test('vòng mới chỉ đổi dữ liệu: kiểm bản nháp bằng luôn lệnh --shots, không chạy check --round riêng', () => {
  const v = read('references/vong-moi.md');
  assert.match(v, /[Dd]ata-only[^\n]*straight[^\n]*`node <skills>\/sketch-to-concept\/scripts\/check\.mjs concept\/ --round <n> --shots`/);
});

test('font trong danh sách --vi-fonts không kèm [ ] là có độ đậm từ 600: không cần --font để biết độ đậm', () => {
  const m52 = section(read('references/concept-method.md'), '### 5.2', '### 5.3');
  for (const [f, s] of [['vong-moi.md', read('references/vong-moi.md')], ['concept-method.md §5.2', m52]]) {
    assert.match(s, /without `\[ \]`[^\n]*600[^\n]*no `--font`/, f);
  }
});
