// Kiểm tài liệu phát hành nói đúng quy trình mới: README, manifest plugin, CHANGELOG,
// và luật frontmatter mà README "Maintaining this repository" đặt ra cho mọi skill.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SKILLS = path.resolve(__dirname, '..', '..');
const REPO = path.resolve(SKILLS, '..');
const read = f => fs.readFileSync(path.join(REPO, f), 'utf8');

test('README giới thiệu sketch-to-concept và quy trình 4 cổng', () => {
  const md = read('README.md');
  assert.match(md, /^\| `sketch-to-concept` \|/m);
  for (const old of [/5 decision gates/, /Answer the 5 gates/, /builds 3 directions/]) assert.doesNotMatch(md, old);
  assert.match(md, /sketch-to-concept[\s\S]*──►[\s\S]*sketch-to-site/, 'sơ đồ How the pieces fit');
  assert.match(md, /`sketch-to-concept` §1/, 'Maintaining: luật dừng chép ở hai nơi');
  assert.match(md, /node --test skills\/sketch-to-concept\/tests\//, 'Maintaining: lệnh test');
});

test('manifest plugin nói về bước concept, bỏ "five decision gates"', () => {
  const codex = JSON.parse(read('.codex-plugin/plugin.json'));
  assert.doesNotMatch(codex.interface.longDescription, /five decision gates/);
  assert.match(codex.interface.longDescription, /sketch-to-concept/);
  assert.ok(codex.interface.defaultPrompt.some(p => /concept/i.test(p)));
  assert.match(JSON.parse(read('.claude-plugin/plugin.json')).description, /concept/i);
});

test('CHANGELOG ghi phiên bản mới của hai skill', () => {
  const md = read('CHANGELOG.md');
  const unreleased = md.split(/^## /m).find(s => s.startsWith('Unreleased'));
  assert.match(unreleased, /`sketch-to-concept` 1\.0/);
  assert.match(unreleased, /`sketch-to-site` 4\.0/);
});

test('mọi SKILL.md: name trùng thư mục, description tối đa 1.024 ký tự', () => {
  for (const dir of fs.readdirSync(SKILLS)) {
    const f = path.join(SKILLS, dir, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(f, 'utf8'));
    assert.ok(fm, `${dir}: thiếu frontmatter`);
    assert.match(fm[1], new RegExp(`^name: ${dir}\\s*$`, 'm'), `${dir}: name`);
    const desc = /^description:\s*(?:>-?\s*\n)?([\s\S]*?)(?=^\S[\w-]*:|$(?![\s\S]))/m.exec(fm[1]);
    const text = desc[1].replace(/\s+/g, ' ').trim();
    assert.ok(text.length <= 1024, `${dir}: description dài ${text.length}`);
  }
});
