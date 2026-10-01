// Kiểm tài liệu của sketch-to-concept: frontmatter, mọi đường dẫn nhắc tới đều có thật, khuôn CONCEPT.md đủ mục.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SKILL = path.resolve(__dirname, '..');
const SKILLS = path.resolve(SKILL, '..');
const REPO = path.resolve(SKILLS, '..');
const read = f => fs.readFileSync(f, 'utf8');

// Đường dẫn trong `…`: <skills>/x/y, sketch-to-site/…, hoặc templates/ references/ của chính skill. Bỏ đường dẫn còn chỗ điền <…>
function paths(md, base) {
  const out = new Set();
  for (const m of md.matchAll(/`([^`\s]+)`/g)) {
    let p = m[1].replace(/[),.:;]+$/, '');
    if (/^<skills>\//.test(p)) p = path.join(SKILLS, p.slice('<skills>/'.length));
    else if (/^(sketch-to-site|ui-ux-pro-max|huashu-design|sketch-to-concept)\//.test(p)) p = path.join(SKILLS, p);
    else if (/^(templates|references|scripts|tests)\//.test(p)) p = path.join(base, p);
    else continue;
    if (!/[<>*]/.test(p)) out.add(p);
  }
  return [...out];
}

test('SKILL.md có frontmatter đúng quy ước', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(md.replace(/\r\n/g, '\n'));
  assert.ok(fm, 'thiếu frontmatter');
  assert.match(fm[1], /^name: sketch-to-concept$/m);
  const desc = fm[1].replace(/^name:.*$/m, '').replace(/^description:\s*>-?\s*/m, '').replace(/\s+/g, ' ').trim();
  assert.ok(desc.length > 0 && desc.length <= 1024, `description dài ${desc.length}`);
  assert.match(desc, /^Dùng khi/);
});

test('mọi đường dẫn trong SKILL.md và concept-method.md đều có thật', () => {
  for (const f of ['SKILL.md', 'references/concept-method.md', 'references/subagent-prompts.md']) {
    const missing = paths(read(path.join(SKILL, f)), SKILL).filter(p => !fs.existsSync(p));
    assert.deepEqual(missing.map(p => path.relative(REPO, p)), [], `${f} trỏ tới file không có`);
  }
});

test('SKILL.md nhắc đủ các khuôn của skill', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  for (const f of ['templates/concept-board.html', 'templates/concepts.js', 'templates/tokens.js', 'templates/key-screen.html', 'templates/CONCEPT.md', 'references/concept-method.md']) {
    assert.ok(md.includes(f), `SKILL.md chưa nhắc ${f}`);
  }
  assert.ok(md.includes('<skills>/sketch-to-site/templates/color.js'), 'SKILL.md chưa dặn chép color.js');
});

test('SKILL.md chỉ có Cổng 1 và Cổng 2, dừng ở cả hai', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  assert.match(md, /🛑 Cổng 1/);
  assert.match(md, /🛑 Cổng 2/);
  assert.doesNotMatch(md, /Cổng [5-9]/);
});

test('SKILL.md dặn đổi KEY của theme.js, để nền đã chọn không lan sang bảng khác', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  assert.match(md, /`<skills>\/sketch-to-site\/templates\/theme\.js` \| `concept\/theme\.js`[^\n]*`KEY`/);
});

test('khuôn CONCEPT.md đủ các mục mà sketch-to-site B0 đọc', () => {
  const md = read(path.join(SKILL, 'templates', 'CONCEPT.md'));
  for (const h of ['## 0. Brief concept', '## 1. Concept đã chọn', '## 2. Dụng', '## 3. Hình', '## 4. Đã khoá và còn mở', '## 5. Trộn', '## 6. Concept không chọn']) {
    assert.ok(md.includes(h), `thiếu mục "${h}"`);
  }
});

test('lệnh lấy khối CSS ghi trong SKILL.md chạy được trên thư mục concept', t => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  const m = /`(node -e "[^`]+")`/.exec(md);
  assert.ok(m, 'SKILL.md chưa có lệnh node -e để lấy khối CSS');
  const os = require('node:os');
  const { execSync } = require('node:child_process');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'concept-cmd-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'concept'));
  for (const f of ['concepts.js', 'tokens.js']) fs.copyFileSync(path.join(SKILL, 'templates', f), path.join(dir, 'concept', f));
  fs.copyFileSync(path.join(SKILL, '..', 'sketch-to-site', 'templates', 'color.js'), path.join(dir, 'concept', 'color.js'));
  const cmd = m[1].replace('<id>', 'a').replace('<mã trộn>', 'mau:B');
  const out = execSync(cmd, { cwd: dir, encoding: 'utf8' });
  assert.match(out, /^:root\{--bg:#14110F;/, 'màu phải lấy từ concept B theo mã trộn');
  assert.match(out, /--font-display:"Newsreader"/, 'chữ vẫn của concept A');
});

test('concept-method.md ghi nguồn, THIRD_PARTY_LICENSES.md có dòng cho phần rút gọn', () => {
  const md = read(path.join(SKILL, 'references', 'concept-method.md'));
  assert.match(md, /brandkit/);
  assert.match(md, /huashu-design/);
  const lic = read(path.join(REPO, 'THIRD_PARTY_LICENSES.md'));
  assert.match(lic, /sketch-to-concept/);
});

test('A3: dựng song song bằng subagent có đường tuần tự, review bằng góc nhìn mới trước Cổng 2', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  const a3 = md.slice(md.indexOf('### A3 · Dựng 3 concept'), md.indexOf('### 🛑 Cổng 2'));
  assert.match(a3, /`references\/subagent-prompts\.md` mục 1/);
  assert.match(a3, /`references\/subagent-prompts\.md` mục 2/);
  assert.match(a3, /dựng tuần tự/);
  const p = read(path.join(SKILL, 'references', 'subagent-prompts.md'));
  const one = p.slice(p.indexOf('## 1. Dựng một concept'), p.indexOf('## 2.'));
  assert.match(one, /không đọc và không đoán/);
  assert.match(one, /Không sửa concepts\.js, index\.html, tokens\.js/);
  assert.match(one, /Trả về đúng các phần sau/);
  const two = p.slice(p.indexOf('## 2. Review các concept bằng góc nhìn mới'));
  assert.match(two, /Chỉ đọc, không sửa file nào/);
  assert.match(two, /bỏ qua vì ngoài phạm vi/);
});

test('sửa sau review: đường subagent không để concepts.js lộ concept khác; mỗi subagent ghi file riêng', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  const a3 = md.slice(md.indexOf('### A3 · Dựng 3 concept'), md.indexOf('### 🛑 Cổng 2'));
  assert.match(a3, /đường subagent[^\n]*chỉ ghi brief và nội dung dùng chung/);
  const p = read(path.join(SKILL, 'references', 'subagent-prompts.md'));
  const one = p.slice(p.indexOf('## 1. Dựng một concept'), p.indexOf('## 2.'));
  assert.match(one, /\{thư mục prototype\}\/concept\/\{id\}\.concept\.js/);
  assert.match(one, /CONCEPTS\.concepts\.push/);
  assert.match(one, /sau concepts\.js, trước tokens\.js/);
  assert.match(one, /khoá không đặt trong ngoặc kép/);
  assert.match(one, /Dự án có app/);
  assert.match(p, /xoá các file \{id\}\.concept\.js/);
});
