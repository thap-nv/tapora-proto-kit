// Kiểm tài liệu của sketch-to-site 4.5 sau đợt giảm token: SKILL.md chỉ giữ luật chung và lối vào; các bước ở hai file theo giai đoạn;
// mỗi giai đoạn vào bằng một lượt; luật đọc bằng lệnh in đúng mục; kiểm một lệnh; review B4 chỉ đọc và chờ kết quả.
// Đo trước 4.5 (04/10/2026, đề Lò Bánh Củi Cô Ba, hai lần mỗi giai đoạn): B0–B2 1,5–1,95M token quy đổi, B3–B4 1,6–2,0M cộng review
// 0,73–0,96M; 59–69 lượt mỗi giai đoạn, 75–85 % lượt một lệnh; SKILL.md 32,9k ký tự đọc nguyên ở lượt 1 cả bốn lần.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const S2S = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(S2S, f), 'utf8').replace(/\r\n/g, '\n');
const SKILL = () => read('SKILL.md');
const R1 = () => read('references/b0-b2.md');
const R2 = () => read('references/b3-b4.md');
function section(md, start, end) {
  const i = md.indexOf(start);
  assert.ok(i >= 0, `không thấy "${start}"`);
  const j = md.indexOf(end, i + start.length);
  return md.slice(i, j < 0 ? undefined : j);
}

// Chạy giả lệnh `sed -n '/a/,/b/p;/c/,$p'` trên một file: mỗi khoảng bắt đầu ở dòng khớp a, hết ở dòng khớp b (gồm dòng đó)
function sed(expr, text) {
  const ranges = expr.split(';').map(r => /^\/(.+?)\/,(?:\/(.+?)\/|\$)p$/.exec(r.trim())).map(m => ({ a: new RegExp(m[1]), b: m[2] && new RegExp(m[2]), on: false }));
  const out = [];
  for (const line of text.split('\n')) {
    let hit = false;
    for (const r of ranges) {
      if (r.on) { hit = true; if (r.b && r.b.test(line)) r.on = false; }
      else if (r.a.test(line)) { hit = true; r.on = true; }
    }
    if (hit) out.push(line);
  }
  return out.join('\n');
}
const sedExpr = (md, file) => {
  const m = new RegExp(`sed -n '([^']+)' "?[^"\\n]*${file.replace('.', '\\.')}`).exec(md);
  assert.ok(m, `thiếu lệnh sed in ${file}`);
  return m[1];
};
const heads = s => s.split('\n').filter(l => /^#{2,3} /.test(l)).map(l => l.split(' ').slice(0, 2).join(' '));

test('SKILL.md chỉ giữ luật chung và lối vào: ≤ 18 000 ký tự, đủ mục 0–9, một ghi chú phiên bản, mục 9 trỏ sang phu-thuoc.md', () => {
  const md = SKILL();
  assert.ok(md.length <= 18000, `SKILL.md dài ${md.length} ký tự`);
  assert.deepEqual(md.split('\n').filter(l => /^## \d\. /.test(l)).map(l => l.slice(0, 5)), ['## 0.', '## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.', '## 7.', '## 8.', '## 9.']);
  assert.deepEqual(md.split('\n').filter(l => l.startsWith('> **v')).map(l => l.slice(0, 10)), ['> **v4.6 ('], 'lịch sử phiên bản ở CHANGELOG');
  assert.doesNotMatch(md, /^### B[0-4] · /m, 'các bước ở references/b0-b2.md và b3-b4.md');
  assert.match(section(md, '## 9.', '\n## '), /`references\/phu-thuoc\.md`/);
  assert.ok(fs.existsSync(path.join(S2S, 'references', 'phu-thuoc.md')));
});

test('lối vào: mỗi giai đoạn vào bằng một lượt, Read file giai đoạn cùng file dự án và một lệnh', () => {
  const s4 = section(SKILL(), '## 4.', '\n## 5.');
  assert.match(s4, /\*\*Lối vào\.\*\*[^\n]*một lượt/);
  const row1 = s4.split('\n').find(l => l.startsWith('| Có `CONCEPT.md`, chưa có đáp án Cổng 3'));
  for (const f of ['`references/b0-b2.md`', '`CONCEPT.md`', '`DECISIONS.md`', 'lệnh 1']) assert.ok(row1.includes(f), `dòng giai đoạn 1 thiếu ${f}`);
  const row2 = s4.split('\n').find(l => l.startsWith('| Cổng 3 đã có đáp án'));
  for (const f of ['`references/b3-b4.md`', '`DESIGN.md`', '`BUILD-LOG.md`', 'người dùng vừa trả lời', 'lệnh 2']) assert.ok(row2.includes(f), `dòng giai đoạn 2 thiếu ${f}`);
  // Lệnh 1 chép mọi khuôn của B2 trong một lệnh cp
  assert.match(s4, /cp "\$S\/templates\/themes\.json" "\$S\/templates\/tokens\.css" "\$S\/templates\/color\.js" "\$S\/templates\/theme\.js" "\$P\/site\/assets\/" && cp "\$S\/templates\/system\.html" "\$P\/site\/_system\.html"/);
  // Mỗi file giai đoạn nói khi nào đọc nó
  assert.match(R1(), /^> Đọc khi `DECISIONS\.md` chưa có đáp án Cổng 3/m);
  assert.match(R2(), /^> Đọc khi Cổng 3 đã có đáp án, hoặc thư mục prototype có `BUILD-LOG\.md`/m);
});

test('ít lượt: lệnh độc lập chung một lượt, mọi ảnh một lượt, Read bản chép trước khi sửa, không đọc mã script', () => {
  const s4 = section(SKILL(), '## 4.', '\n## 5.');
  assert.match(s4, /\*\*không phụ thuộc nhau\*\* thì gọi chung một lượt/);
  assert.match(s4, /Mở \*\*mọi ảnh\*\*[^\n]*\*\*một\*\* lượt/);
  assert.match(s4, /`Read` bản chép rồi mới sửa/);
  assert.match(s4, /Không đọc mã của script để biết cách dùng/);
  assert.match(s4, /`scripts\/system-check\.mjs`[^\n]*`scripts\/qa-check\.py`/);
});

test('lệnh 1 (B2) in đúng mục A, B, D.2 của rules-and-conflicts.md: không in C, D.1, D.3–D.7, E, F', () => {
  const out = sed(sedExpr(section(SKILL(), 'Lệnh 1', 'Lệnh 2'), 'rules-and-conflicts.md'), read('references/rules-and-conflicts.md'));
  const h = heads(out);
  for (const x of ['### A.1', '### A.5', '## B.', '### D.2']) assert.ok(h.includes(x), `thiếu ${x}`);
  for (const x of ['### D.1', '### D.4', '### D.5', '## E.', '## F.']) assert.ok(!h.includes(x), `thừa ${x}`);
  assert.doesNotMatch(out, /^\| Mâu thuẫn|^1\. \*\*/m, 'không in thân mục C, F');
  assert.ok(out.length < 9000, `in ${out.length} ký tự`);
});

test('lệnh 2 (B3) in đúng mục A, B, D.1–D.4, E: không in C, D.5–D.7, F', () => {
  const out = sed(sedExpr(section(SKILL(), 'Lệnh 2', '**Ít lượt.**'), 'rules-and-conflicts.md'), read('references/rules-and-conflicts.md'));
  const h = heads(out);
  for (const x of ['### A.1', '## B.', '### D.1', '### D.2', '### D.3', '### D.4', '## E.']) assert.ok(h.includes(x), `thiếu ${x}`);
  for (const x of ['### D.6', '### D.7']) assert.ok(!h.includes(x), `thừa ${x}`);
  assert.doesNotMatch(out, /\?data=empty/, 'không in thân D.5');
  assert.ok(out.length < 12000, `in ${out.length} ký tự`);
});

test('B4 in đúng phần của qa-gate.md mà B4 dùng: danh sách soát ảnh, mục 3, 4, 5, 7; không in mục 1, 6 và phần đo của mục 2', () => {
  const out = sed(sedExpr(section(R2(), '### B4 · Tự kiểm', '1. **Kiểm một lệnh**'), 'qa-gate.md'), read('references/qa-gate.md'));
  assert.match(out, /^\*\*Mở từng ảnh ra xem\*\*/m);
  for (const x of ['## 3.', '## 4.', '## 5.', '## 7.']) assert.ok(heads(out).includes(x), `thiếu ${x}`);
  assert.doesNotMatch(out, /`P01`|\*\*Lượt kiểm sâu\*\*|Cấm làm im bộ kiểm/);
  assert.ok(out.length < 9000, `in ${out.length} ký tự`);
});

test('b0-b2.md: B1 thử concept trên _system.html, không dựng trang thử; B2 và Cổng 3 dùng system-check.mjs', () => {
  const md = R1();
  for (const h of ['### B0 · Nhận concept', '### B1 · Đọc đủ yêu cầu và thử concept', '### B2 · Design system', '### 🛑 Cổng 3 · ']) assert.ok(md.includes(h), h);
  const b1 = section(md, '### B1 ·', '### B2');
  assert.match(b1, /\*\*Thử trên `site\/_system\.html`, không dựng trang thử riêng:\*\*/);
  assert.match(b1, /Không viết file bước, không tự gọi `run\.mjs`/);
  const b2 = section(md, '### B2 ·', '### 🛑 Cổng 3');
  assert.ok(b2.includes('node <skills>/sketch-to-site/scripts/system-check.mjs <thư-mục-prototype>'));
  assert.match(b2, /Read` \*\*cùng lúc\*\* các bản chép sẽ sửa/);
  assert.match(b2, /mở \*\*mọi ảnh từng màn\*\* trong \*\*một\*\* lượt/);
  assert.match(section(md, '### 🛑 Cổng 3', '\n1. '), /`_shots\/system\/<theme>-1440-full\.png`/);
  assert.doesNotMatch(md, /msedge|--screenshot|playwright screenshot/i, 'chụp tay chỉ ở qa-gate.md mục 2, khi lệnh kiểm không chạy được');
});

test('b3-b4.md: lối vào lại một lượt; B4 kiểm bằng qa-check.py; review là Explore và chờ kết quả', () => {
  const md = R2();
  for (const h of ['### B0 · Làm tiếp', '### B3 · Dựng đầy đủ', '### B4 · Tự kiểm', '### 🛑 Cổng 4 · Nghiệm thu']) assert.ok(md.includes(h), h);
  assert.match(section(md, '### B0 · Làm tiếp', '### B3'), /Đừng đọc lại các file đó, đừng `cat` chúng/);
  // Đo 4.5: lượt vào thiếu file để dựng, cả hai lần B3 tốn thêm 1–3 lượt đọc _system.html, CSS dùng chung, concept/<id>.html và đầu script
  const row = SKILL().split('\n').find(l => l.startsWith('| Cổng 3 đã có đáp án'));
  for (const f of ['`references/b3-b4.md`', '`site/_system.html`', '`site/assets/site.css`']) assert.ok(row.includes(f), `lượt vào B3 thiếu ${f}`);
  const l2 = section(SKILL(), 'Lệnh 2', '**Ít lượt.**');
  assert.match(l2, /cat "\$P\/concept\/\$id\.html"/);
  assert.match(l2, /ls "\$P\/site" "\$P\/site\/assets"/);
  // id lấy từ dòng "**Concept:** <id>" của CONCEPT.md: khuôn của sketch-to-concept phải giữ đúng dạng đó
  assert.match(fs.readFileSync(path.join(S2S, '..', 'sketch-to-concept', 'templates', 'CONCEPT.md'), 'utf8'), /\*\*Concept:\*\* <id/);
  assert.match(section(md, '### B0 · Làm tiếp', '### B3'), /đừng đọc mã của `preflight\.py` hay `qa-check\.py`/);
  assert.ok(section(md, '### B3 ·', '### B4').includes('python <skills>/sketch-to-site/scripts/preflight.py <thư-mục-prototype>/site/<trang>.html'));
  const b4 = section(md, '### B4 · Tự kiểm', '### 🛑 Cổng 4');
  assert.ok(b4.includes('python <skills>/sketch-to-site/scripts/qa-check.py <thư-mục-prototype>'));
  assert.match(b4, /Đừng tự viết bộ cuộn hay bộ chụp thêm/);
  assert.match(b4, /\*\*Mở ảnh trong một lượt\*\*/);
  assert.match(b4, /`subagent_type: "Explore"`/);
  assert.match(b4, /\*\*chờ kết quả\*\* \*\(không chạy nền\)\*/);
  const s7 = section(read('references/qa-gate.md'), '## 7. Review bằng góc nhìn mới', '\n## 8.');
  assert.match(s7, /`subagent_type: "Explore"`/);
  assert.match(s7, /\{danh sách ảnh\}/);
  assert.match(s7, /grep -n/);
});

test('lệnh kiểm ghi trong tài liệu khớp cách dùng ở đầu script, script có thật', () => {
  for (const [f, cmd] of [['scripts/system-check.mjs', 'node <skills>/sketch-to-site/scripts/system-check.mjs <thư-mục-prototype>'],
    ['scripts/qa-check.py', 'python <skills>/sketch-to-site/scripts/qa-check.py <thư-mục-prototype>']]) {
    const head = read(f).split('\n').slice(0, 4).join('\n');
    assert.ok(head.includes(cmd), `${f}: đầu file chưa ghi "${cmd}"`);
  }
});
