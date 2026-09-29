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
  const unreleased = md.split(/^## /m)[1]; // mục mới nhất, ngay dưới tiêu đề
  for (const v of ['`sketch-to-concept` 1.1', '`sketch-to-site` 4.1', '`evolve-site` 1.7', '`tweak-site` 1.1', '`handover-check` 1.1']) {
    assert.ok(unreleased.includes(v), `CHANGELOG thiếu ${v}`);
  }
  assert.match(unreleased, /superpowers/);
});

test('README và CHANGELOG nói về QA_LOAD_TIMEOUT của run.mjs', () => {
  assert.ok(read('README.md').includes('QA_LOAD_TIMEOUT'), 'README thiếu QA_LOAD_TIMEOUT');
  const unreleased = read('CHANGELOG.md').split(/^## /m)[1];
  assert.ok(unreleased.includes('QA_LOAD_TIMEOUT'), 'CHANGELOG thiếu QA_LOAD_TIMEOUT');
});

test('ghi nguồn superpowers, README chạy test ở cả hai thư mục, SKILL.md có ghi chú phiên bản mới', () => {
  const lic = read('THIRD_PARTY_LICENSES.md');
  assert.ok(lic.includes('| [obra/superpowers](https://github.com/obra/superpowers) | © 2025 Jesse Vincent |'), 'thiếu dòng ghi nguồn superpowers');
  assert.ok(read('README.md').includes('node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/'), 'README thiếu lệnh test hai thư mục');
  for (const [f, v] of [['sketch-to-site', 'v4.1'], ['sketch-to-concept', 'v1.1'], ['evolve-site', 'v1.7'], ['tweak-site', 'v1.1'], ['handover-check', 'v1.1']]) {
    assert.ok(read(`skills/${f}/SKILL.md`).split('\n').some(l => l.startsWith(`> **${v} (`)), `${f} thiếu ghi chú ${v}`);
  }
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

test('phát hành 1.1.0: hai manifest cùng phiên bản, CHANGELOG có mục 1.1.0 ở đầu', () => {
  for (const f of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) assert.equal(JSON.parse(read(f)).version, '1.1.0', f);
  assert.ok(read('CHANGELOG.md').split(/^## /m)[1].startsWith('1.1.0 ('), 'mục đầu của CHANGELOG phải là 1.1.0');
});
