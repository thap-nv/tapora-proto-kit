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
const A2 = () => section(read('SKILL.md'), '### A2 · ', '### A3 · ');
const A3 = () => section(read('SKILL.md'), '### A3 · ', '### 🛑 Cổng 2');
const PROMPT1 = () => section(read('references/subagent-prompts.md'), '## 1. Dựng một concept', '## 2. ');
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
  assert.match(a3, /chép bằng `cp`/);
  assert.match(a3, /không mở/);
});

test('A3: mặc định một agent dựng tuần tự; subagent dựng chỉ khi người dùng xin song song, tối đa 3', () => {
  const a3 = A3();
  assert.match(a3, /[Mm]ặc định[^\n]*dựng tuần tự/);
  assert.match(a3, /người dùng[^\n]*song song/);
  assert.match(a3, /tối đa 3 subagent/);
});

test('A3: chấm lớp Ý trên dữ liệu concepts.js trước khi dựng màn', () => {
  const a3 = A3();
  const score = a3.search(/\*\*Chấm lớp Ý trên dữ liệu\*\*/);
  const build = a3.search(/\*\*Dựng màn then chốt\*\*/);
  assert.ok(score > 0, 'A3 thiếu bước chấm lớp Ý trên dữ liệu');
  assert.ok(build > score, 'chấm lớp Ý phải đứng trước bước dựng màn');
  const two = section(read('references/subagent-prompts.md'), '## 2. ');
  assert.match(two, /không mở ảnh/, 'chấm trên dữ liệu thì người chấm không cần ảnh');
  // Chạy nền rồi chờ thì agent kết thúc lượt, bị gọi lại và phải nạp lại cả ngữ cảnh
  assert.match(a3.slice(score, build), /chờ kết quả, không chạy nền/);
});

test('chấm trên dữ liệu một lần: sửa theo hướng sửa, không chấm lại, lần soát trên ảnh sẽ kiểm', () => {
  assert.match(A3(), /không chấm lại trên dữ liệu/);
  assert.match(section(read('references/concept-method.md'), '## 7. ', '## 8. '), /không chấm lại trên dữ liệu/);
  const two = section(read('references/subagent-prompts.md'), '## 2. ');
  assert.doesNotMatch(two, /gửi lại prompt mục 2/, 'không chấm lại trên dữ liệu');
  assert.match(two, /gọn/, 'người chấm trả lời gọn: bớt thời gian chờ');
});

test('A3: tương tác đặc trưng gắn data-signature để shots.mjs chụp riêng khối đó', () => {
  assert.match(A3(), /`data-signature`/);
  assert.match(read('templates/key-screen.html'), /data-signature/);
});

test('A2: kết quả tra lệch ngành thì bỏ qua, không tra lại', () => {
  assert.match(A2(), /lệch ngành[^\n]*không tra lại/);
});

test('làm lại tối đa một lần sau khi dựng, rồi trình ở Cổng 2 kèm điểm', () => {
  assert.match(A3(), /tối đa một lần/);
  const m7 = section(read('references/concept-method.md'), '## 7. ', '## 8. ');
  assert.match(m7, /tối đa một lần/);
  assert.match(m7, /Cổng 2/);
  assert.doesNotMatch(m7, /chưa mở Cổng 2/, 'luật cũ không giới hạn số vòng làm lại');
});

test('mục 3 và 6 của sketch-to-site đọc bằng lệnh in đúng hai mục', () => {
  assert.ok(read('SKILL.md').includes(SECTIONS_CMD), 'SKILL.md chưa có lệnh in mục 3 và 6');
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
  assert.match(PROMPT1(), /Không mở tokens\.js, color\.js/);
  assert.match(read('references/subagent-prompts.md'), /dừng giữa chừng[^\n]*subagent mới/);
});

test('A2: tra màu một lần cho concept A; kiểm dấu tiếng Việt của font vẫn bắt buộc', () => {
  const a2 = A2();
  assert.doesNotMatch(a2, /chạy riêng cho họ của từng concept/);
  assert.match(a2, /một lần/);
  assert.match(a2, /preflight\.py --font/);
});

test('Bàn giao: đề xuất mở phiên mới trước khi dựng prototype', () => {
  assert.match(section(read('SKILL.md'), '### Bàn giao', '## 4. '), /phiên mới/);
});

test('A3 chụp ảnh bằng scripts/shots.mjs, không trỏ sang lệnh chụp tay của qa-gate.md', () => {
  const a3 = A3();
  assert.match(a3, /`node <skills>\/sketch-to-concept\/scripts\/shots\.mjs concept\/`/);
  assert.doesNotMatch(a3, /qa-gate\.md/);
});

// Dựng thư mục concept/ từ khuôn như A3 bước 1. sample=false: bỏ cờ example, như dữ liệu của dự án thật
function fixture({ sample = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'concept-shots-'));
  const t = f => path.join(SKILL, 'templates', f);
  fs.copyFileSync(t('concept-board.html'), path.join(dir, 'index.html'));
  fs.copyFileSync(t('tokens.js'), path.join(dir, 'tokens.js'));
  const data = fs.readFileSync(t('concepts.js'), 'utf8');
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
  assert.match(r.stdout, /^index\.html 1440: OK → shots\/index-1440\.png$/m, 'khuôn sạch: bảng concept không có lỗi');
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
