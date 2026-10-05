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

test('CHANGELOG ghi phiên bản mới của các skill', () => {
  const entries = read('CHANGELOG.md').split(/^## /m);
  const latest = entries[1];
  assert.ok(latest.includes('`sketch-to-site` 4.5'), 'CHANGELOG thiếu `sketch-to-site` 4.5');
  for (const s of ['references/b0-b2.md', 'references/b3-b4.md', 'system-check.mjs', 'qa-check.py', 'Explore', 'phu-thuoc.md']) assert.ok(latest.includes(s), `CHANGELOG 1.5.0 thiếu ${s}`);
  const v140 = entries.find(s => s.startsWith('1.4.0 ('));
  for (const v of ['`sketch-to-concept` 1.4', '`sketch-to-site` 4.4']) assert.ok(v140.includes(v), `CHANGELOG 1.4.0 thiếu ${v}`);
  for (const s of ['vong-moi.md', '--vi-fonts', 'concepts.example.js', '--round']) assert.ok(v140.includes(s), `CHANGELOG 1.4.0 thiếu ${s}`);
  const v130 = entries.find(s => s.startsWith('1.3.0 ('));
  for (const v of ['`sketch-to-concept` 1.3', '`sketch-to-site` 4.3']) assert.ok(v130.includes(v), `CHANGELOG 1.3.0 thiếu ${v}`);
  assert.match(v130, /shots\.mjs/);
  const v120 = entries.find(s => s.startsWith('1.2.0 ('));
  for (const v of ['`sketch-to-concept` 1.2', '`sketch-to-site` 4.2', '`evolve-site` 1.8', '`tweak-site` 1.2', '`handover-check` 1.2']) {
    assert.ok(v120.includes(v), `CHANGELOG 1.2.0 thiếu ${v}`);
  }
  assert.match(v120, /ux-ui-agent-skills/);
});

test('README và CHANGELOG nói về QA_LOAD_TIMEOUT của run.mjs', () => {
  assert.ok(read('README.md').includes('QA_LOAD_TIMEOUT'), 'README thiếu QA_LOAD_TIMEOUT');
  const v110 = read('CHANGELOG.md').split(/^## /m).find(s => s.startsWith('1.1.0 ('));
  assert.ok(v110.includes('QA_LOAD_TIMEOUT'), 'CHANGELOG 1.1.0 thiếu QA_LOAD_TIMEOUT');
});

test('ghi nguồn superpowers, README chạy test ở cả hai thư mục, SKILL.md có ghi chú phiên bản mới', () => {
  const lic = read('THIRD_PARTY_LICENSES.md');
  assert.ok(lic.includes('| [obra/superpowers](https://github.com/obra/superpowers) | © 2025 Jesse Vincent |'), 'thiếu dòng ghi nguồn superpowers');
  assert.ok(read('README.md').includes('node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/'), 'README thiếu lệnh test hai thư mục');
  assert.ok(lic.includes('| [plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) | © 2026 Thientan Soparat |'), 'thiếu dòng ghi nguồn ux-ui-agent-skills');
  for (const [f, v] of [['sketch-to-site', 'v4.5'], ['sketch-to-concept', 'v1.4'], ['evolve-site', 'v1.9'], ['tweak-site', 'v1.3'], ['handover-check', 'v1.3']]) {
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

test('phát hành 1.5.0: hai manifest cùng phiên bản, CHANGELOG có mục 1.5.0 ở đầu', () => {
  for (const f of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) assert.equal(JSON.parse(read(f)).version, '1.5.0', f);
  assert.ok(read('CHANGELOG.md').split(/^## /m)[1].startsWith('1.5.0 ('), 'mục đầu của CHANGELOG phải là 1.5.0');
});

test('README: lệnh chụp của bảng concept, và luật giữ tiêu đề mục 3 và 6 của sketch-to-site', () => {
  const md = read('README.md');
  assert.ok(md.includes('scripts/shots.mjs'), 'README thiếu scripts/shots.mjs');
  assert.match(md, /§3 and §6[^\n]*heading/, 'Maintaining: sketch-to-concept in mục 3 và 6 theo tiêu đề');
  assert.ok(md.includes('concepts.example.js'), 'Maintaining: dữ liệu mẫu cho test nằm ở concepts.example.js');
  assert.match(md, /rounds/);
});

test('README nói về themes.mjs, trang _system.html, phép đo trên trang và nợ cũ', () => {
  const md = read('README.md');
  for (const s of ['themes.mjs', '_system.html', 'themes.json', 'QA_DEEP', 'debt']) assert.ok(md.includes(s), `README thiếu ${s}`);
  assert.match(md, /color\.js/);
});
