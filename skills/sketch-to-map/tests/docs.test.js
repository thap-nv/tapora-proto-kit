// Kiểm tài liệu của sketch-to-map và chỗ nối sang sketch-to-concept, sketch-to-site, evolve-site, handover-check.
// Chạy: node --test skills/sketch-to-map/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SKILLS = path.resolve(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(SKILLS, f), 'utf8');
const section = (md, from, to) => { const i = md.indexOf(from); assert.ok(i >= 0, `thiếu ${from}`); const j = md.indexOf(to, i + from.length); return md.slice(i, j < 0 ? undefined : j); };

test('SKILL.md là bộ định tuyến: ≤ 12 000 ký tự, một ghi chú phiên bản, lối vào mỗi dòng một lượt, không có bước M1–M2', () => {
  const md = read('sketch-to-map/SKILL.md');
  assert.ok(md.length <= 12000, `SKILL.md dài ${md.length} ký tự`);
  assert.deepEqual(md.split('\n').filter(l => l.startsWith('> **v')).map(l => l.split(' (')[0]), ['> **v1.0']);
  assert.match(md, /`W:\/…`[^\n]*`\/w\/…`/);
  const rows = section(md, '**Lối vào.**', '**Ít lượt.**').split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| Thư mục') && !l.startsWith('|---'));
  assert.equal(rows.length, 4);
  assert.match(rows[0], /`Read` `references\/m1-kiem-ke\.md`, `CONCEPT\.md`, `DECISIONS\.md` · lệnh M0/);
  assert.match(rows[0], /lệnh M0: `python <skills>\/sketch-to-map\/scripts\/sources\.py <thư-mục-tài-liệu> <thư-mục-prototype>`/, 'lượt vào chạy được M0 mà chưa đọc m1-kiem-ke.md');
  assert.match(section(md, '**Ít lượt.**', '\n---'), /Ghi file và lệnh kiểm cũng \*\*cùng một lượt\*\*/);
  assert.match(read('sketch-to-map/references/m1-kiem-ke.md'), /`Write` `map\/features\.js` và Bash `check` \*\*cùng một lượt\*\*/);
  assert.match(read('sketch-to-map/references/m2-bo-cuc.md'), /`Write` `map\/layout\.js`[^\n]*\*\*cùng một lượt\*\*/);
  assert.match(rows[1], /`Read` `references\/m2-bo-cuc\.md` · `node [^`]*map\.mjs check [^`]*--brief`/);
  assert.match(section(md, '**Ít lượt.**', '\n---'), /\*\*Không đọc mã\*\*[^\n]*`sources\.py`, `map\.mjs`/);
  assert.doesNotMatch(md, /^### M[0-2] · /m, 'các bước ở references/m1-kiem-ke.md và m2-bo-cuc.md');
});

test('Cổng Bản đồ: mời bấm thử, hỏi bốn câu một lượt, ghi khối ngay lượt hỏi, Khó thì sửa trước khi duyệt', () => {
  const g = section(read('sketch-to-map/SKILL.md'), '## 3. 🛑 Cổng Bản đồ', '\n## 4.');
  assert.match(g, /\*\*Mời người dùng bấm thử\*\*/);
  for (const q of ['1. **Bản đồ:** Duyệt *(Khuyến nghị)*', '2. **Chức năng suy ra**', '3. **Đợt đầu dựng gì:**', '4. **Mâu thuẫn**']) assert.ok(g.includes(q), q);
  assert.match(g, /\*\*ngay lượt hỏi\*\*/);
  assert.match(g, /```markdown\n## 🛑 Cổng Bản đồ — <dd\/mm\/yyyy>/,'khối DECISIONS in sẵn ở cổng, không phải tra khuôn của sketch-to-site');
  assert.match(g, /khối \*\*Trình ở cổng\*\*/);
  assert.match(g, /chấm \*\*Khó\*\*/);
  assert.match(g, /Câu \*Phạm vi\* ở Cổng 3 của `sketch-to-site` coi như đã có đáp án/);
  assert.match(read('sketch-to-site/templates/DECISIONS.md'), /^## 🛑 Cổng Bản đồ — <dd\/mm\/yyyy> \*\(sketch-to-map/m);
});

test('bảng cớ khi bố cục rút từ lỗi đo được: lối tắt đá đi, màn gánh quá nhiều, nhóm theo đợt, đọc lướt, chạm trần', () => {
  const t = section(read('sketch-to-map/SKILL.md'), '## 6. Cớ hay gặp khi bố cục', '\n## ');
  const rows = t.split('\n').filter(l => l.startsWith('| "'));
  assert.ok(rows.length >= 8, `chỉ có ${rows.length} cớ`);
  for (const k of ['sang trang kia', 'hồ sơ', 'Giai đoạn 2', 'đọc lướt', 'chạm trần']) assert.ok(rows.some(r => r.includes(k)), k);
});

test('m2-bo-cuc.md: lượt vào, luật kèm căn cứ, định dạng layout.js, một lệnh kiểm có --shots và visible --treetest, soát nhãn không chặn', () => {
  const md = read('sketch-to-map/references/m2-bo-cuc.md');
  assert.match(md, /^> \*\*Lượt vào M2\*\*/m);
  for (const h of ['### 2.1 ', '### 2.2 ', '### 2.3 ', '### 2.4 ', '### 2.5 ', '### 2.6 ', '### 2.7 ', '### 2.8 ']) assert.ok(md.includes(h), h);
  for (const law of ['Mental Model', 'Hick', 'Miller', 'Nielsen #3', 'WCAG 3.2.4', 'Cognitive Load', 'KLM']) assert.ok(md.includes(law), law);
  assert.match(md, /```js\nwindow\.LAYOUT = \{/);
  assert.match(md, /map\.mjs check <thư-mục-prototype> --shots; node [^\n]*map\.mjs visible <thư-mục-prototype> --treetest/);
  assert.match(md, /`subagent_type: "Explore"`/);
  assert.match(section(md, '## 5. Soát nhãn', '## 6.'), /Không có ngưỡng chặn/);
  // Mỗi nhãn chặn của map.mjs check có dòng trong bảng
  const tbl = section(md, '| Nhãn | Mức |', '\n\n');
  for (const tag of ['`[dữ liệu]`', '`[1]`', '`[12]`', '`[7]`', '`[2]`', '`[tới]`', '`[hành trình]`', '`[3]`', '`[6]`', '`[Ctrl+K]`', '`[khung]`']) assert.ok(tbl.includes(tag), tag);
});

test('m1-kiem-ke.md trỏ sang M2 bằng một lượt: Read m2-bo-cuc.md và check --brief', () => {
  const md = read('sketch-to-map/references/m1-kiem-ke.md');
  assert.match(md, /^> \*\*Lượt vào M1\*\*/m);
  assert.match(section(md, '## 8. Kiểm: một lệnh', '\n## '), /`Read <skills>\/sketch-to-map\/references\/m2-bo-cuc\.md`[^\n]*`map\.mjs check <thư-mục-prototype> --brief`[^\n]*cùng một lượt/);
});

test('m1 mục 6, chia worker: tối đa 4 worker một đợt, _chung.js ghi skip mục chung, giao chủ, prompt đọc một lượt, Read features.js trước Edit', () => {
  // Đo rml1, rml2 (06/10): 7 worker hai đợt; worker không được dặn đọc một lượt thì 6–11 lượt và tự viết script đếm;
  // 20–21 mục chung chặn sau merge; Edit features.js bị từ chối; 3–6 cặp trùng giữa worker
  const md = read('sketch-to-map/references/m1-kiem-ke.md');
  const s6 = section(md, '## 6. ', '\n## 7.');
  assert.match(s6, /\*\*Tối đa 4 worker, gọi một đợt\*\*/);
  assert.match(s6, /`map\/parts\/_chung\.js`[^\n]*`skip`[^\n]*window\.PART = \{ features: \[\], skip: \[/);
  assert.match(s6, /\*\*Giao chủ:\*\*/);
  const prompt = section(s6, '```text', '\n```');
  assert.match(prompt, /^Lượt 1, mọi lệnh Read trong một lượt, không Grep, không Bash:/m);
  assert.match(prompt, /^Giao chủ: /m);
  assert.match(prompt, /^Lượt 3: [^\n]*đếm trên danh sách vừa viết; không chạy script/m);
  // Dải dòng của luật ghi trong prompt phải trúng đầu mục thật: sửa m1-kiem-ke.md thì sửa cả số ở đây
  const lines = md.split('\n');
  const rng = [...prompt.matchAll(/offset (\d+) limit (\d+) \(mục [^)]+\)/g)].map(m => [+m[1], +m[2]]);
  assert.equal(rng.length, 2, 'hai dải luật: mục 3–5 và mục 7');
  assert.match(lines[rng[0][0] - 1], /^## 3\. /);
  assert.match(lines[rng[0][0] + rng[0][1] - 1], /^## 6\. /, 'dải mục 3–5 dừng ngay trước mục 6');
  assert.match(lines[rng[1][0] - 1], /^## 7\. /);
  assert.match(lines[rng[1][0] + rng[1][1] - 1], /^## 8\. /, 'dải mục 7 dừng ngay trước mục 8');
  assert.match(s6, /cặp nghi trùng/);
  assert.match(s6, /`Read` `map\/features\.js`[^\n]*`Edit` bị từ chối/);
  assert.match(s6, /Sửa bằng `Edit`, không bằng script/);
  assert.match(section(md, '## 4. ', '\n## 5.'), /mâu thuẫn: D\d+:\d+ «[^»]+» với D\d+:\d+ «[^»]+»/, 'mâu thuẫn kèm trích ngắn hai bên');
});

test('sketch-to-concept: brief đếm Quy mô; bàn giao sang sketch-to-map khi đủ ngưỡng', () => {
  assert.match(read('sketch-to-concept/references/vong-dau.md'), /7\. \*\*Scale\*\*[^\n]*`sketch-to-map` threshold/);
  assert.match(section(read('sketch-to-concept/SKILL.md'), '### Handover', '\n---'), /`sketch-to-map`[^\n]*\*\*new session\*\*/);
  assert.match(read('sketch-to-site/templates/DECISIONS.md'), /^\| Quy mô \*\(/m);
});

test('sketch-to-site: lối vào gửi dự án lớn sang sketch-to-map; B1 đọc MAP.md; Cổng 3 bỏ câu Phạm vi; B3 dựng theo slice, gắn data-feature, data-mo', () => {
  const s4 = section(read('sketch-to-site/SKILL.md'), '## 4.', '\n## 5.');
  assert.match(s4, /^\| Có `CONCEPT\.md`, chưa có `map\/features\.js`[^\n]*`sketch-to-map` trước/m);
  const b02 = read('sketch-to-site/references/b0-b2.md');
  assert.match(section(b02, '### B1 ', '### B2'), /\*\*Có bản đồ\*\*[^\n]*\*\*không đọc lại cả tài liệu\*\*/);
  assert.match(section(b02, '### 🛑 Cổng 3', '\n---'), /\*\*Có bản đồ thì bỏ câu này:\*\*/);
  const b3 = section(read('sketch-to-site/references/b3-b4.md'), '### B3 · Dựng đầy đủ', '### B4');
  assert.match(b3, /map\.mjs slice <thư-mục-prototype> <màn>/);
  assert.match(b3, /`data-feature="F-07"`/);
  assert.match(b3, /`data-mo="<kiểu đã khai>"`/);
  assert.match(b3, /\*\*Lối tắt dựng đúng kiểu đã khai:\*\*/);
  assert.match(b3, /Chức năng \*\*hoãn\*\*/);
  assert.match(read('sketch-to-site/templates/BUILD-LOG.md'), /\| Chức năng \*\(mã trong bản đồ, nếu có\)\* \|/);
});

test('evolve-site và handover-check dùng bản đồ: tra trước, ghi tính năng mới vào bản đồ, kiểm độ phủ, đọc dòng Bố cục và Độ phủ', () => {
  const b1 = read('evolve-site/references/b1-b2.md');
  assert.match(b1, /\*\*Có bản đồ\*\*[\s\S]*map\.mjs check <thư-mục-prototype>/);
  assert.match(b1, /\*\*Lối tắt mở tại chỗ\*\*/);
  assert.match(read('evolve-site/SKILL.md'), /\[ -f "\$P\/map\/features\.js" \] && \{ echo "== bản đồ";/);
  assert.match(read('evolve-site/references/b3-b4.md'), /map\.mjs coverage \./);
  const h = read('handover-check/SKILL.md');
  assert.match(h, /^\| \*\*Bố cục\*\* \|/m);
  assert.match(h, /^\| \*\*Độ phủ\*\*/m);
});
