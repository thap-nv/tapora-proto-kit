// Kiểm hai skill khớp nhau sau khi tách Phần A (sketch-to-concept) khỏi sketch-to-site:
// số cổng và số bước mới, không còn chỗ trỏ theo số cũ, phụ thuộc đủ, preflight vẫn tự kiểm được.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SKILLS = path.resolve(__dirname, '..', '..');
const S2S = path.join(SKILLS, 'sketch-to-site');
const REPO = path.resolve(SKILLS, '..');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const read = f => fs.readFileSync(f, 'utf8');
// 4.5: B0–B4 nằm ở references/b0-b2.md và references/b3-b4.md; bảng phụ thuộc ở references/phu-thuoc.md
const STEPS = ['SKILL.md', 'references/b0-b2.md', 'references/b3-b4.md'];
const s2sFiles = () => ['SKILL.md', ...['references', 'templates'].flatMap(d => fs.readdirSync(path.join(S2S, d)).filter(f => f.endsWith('.md')).map(f => `${d}/${f}`)), 'scripts/preflight.py'];

test('sketch-to-site: không còn chỗ trỏ theo số bước, số cổng cũ', () => {
  const stale = [/Cổng 5/, /\bB[5-7]\b/, /directions\//, /[Dd]ựng 3 hướng/, /Chọn hướng/, /\b5 (cổng|CỔNG)\b/, /Nạp tham chiếu — B2/];
  const hits = [];
  for (const f of s2sFiles()) {
    read(path.join(S2S, f)).split('\n').forEach((line, i) => {
      for (const re of stale) if (re.test(line)) hits.push(`${f}:${i + 1}: ${re} → ${line.trim().slice(0, 90)}`);
    });
  }
  assert.deepEqual(hits, []);
});

test('sketch-to-site: mô tả và quy trình nhận CONCEPT.md, 4 cổng qua hai skill', () => {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(read(path.join(S2S, 'SKILL.md')).replace(/\r\n/g, '\n'))[1];
  const md = STEPS.map(f => read(path.join(S2S, f))).join('\n');
  assert.match(fm, /sketch-to-concept/);
  assert.match(fm, /CONCEPT\.md/);
  assert.match(read(path.join(REPO, 'CHANGELOG.md')), /`sketch-to-site` 4\.0 starts from `CONCEPT\.md`/);
  assert.match(md, /### B0 · Nhận concept/);
  assert.match(md, /### B1 · Đọc đủ yêu cầu và thử concept/);
  assert.match(md, /### 🛑 Cổng 3 · /);
  assert.match(md, /### 🛑 Cổng 4 · Nghiệm thu/);
  assert.doesNotMatch(md, /### 🛑 Cổng [12] · /, 'Cổng 1–2 đã chuyển sang sketch-to-concept');
});

test('sketch-to-site: mọi đường dẫn trong SKILL.md và hai file giai đoạn đều có thật', () => {
  const md = STEPS.map(f => read(path.join(S2S, f))).join('\n');
  const missing = [];
  for (const m of md.matchAll(/`([^`\s]+)`/g)) {
    let p = m[1].replace(/[),.:;]+$/, '');
    if (/^<skills>\//.test(p)) p = path.join(SKILLS, p.slice('<skills>/'.length));
    else if (/^(templates|references|scripts)\//.test(p)) p = path.join(S2S, p);
    else continue;
    if (!/[<>*]/.test(p) && !fs.existsSync(p)) missing.push(path.relative(REPO, p));
  }
  assert.deepEqual(missing, []);
});

test('khuôn DECISIONS.md và DESIGN.md theo 4 cổng mới', () => {
  const dec = read(path.join(S2S, 'templates', 'DECISIONS.md'));
  for (const h of ['Cổng 1 · Brief concept', 'Cổng 2 · Concept', 'Cổng 3 · Design system', 'Cổng 4 · Nghiệm thu']) assert.ok(dec.includes(h), `DECISIONS.md thiếu "${h}"`);
  const des = read(path.join(S2S, 'templates', 'DESIGN.md'));
  assert.match(des, /Cổng 3/);
  assert.match(des, /CONCEPT\.md/);
});

test('phụ thuộc: sketch-to-concept và sketch-to-map có trong bảng phu-thuoc.md và DEPS, --deps đủ 15/15', () => {
  assert.match(read(path.join(S2S, 'references', 'phu-thuoc.md')), /\| 🔴[^|]*\| `sketch-to-concept` \|/);
  assert.match(read(path.join(S2S, 'SKILL.md')), /^## 9\. [^\n]*\n\n[^\n]*`references\/phu-thuoc\.md`/m);
  assert.match(read(path.join(S2S, 'scripts', 'preflight.py')), /"sketch-to-concept", \["SKILL\.md", "templates\/concept-board\.html"\]/);
  const r = spawnSync(PYTHON, [path.join(S2S, 'scripts', 'preflight.py'), '--deps'], { encoding: 'utf8', cwd: REPO });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(read(path.join(S2S, 'references', 'phu-thuoc.md')), /\| 🟠[^|]*\| `sketch-to-map` \|/);
  assert.match(r.stdout, /15\/15 có đủ/);
});

test('preflight --selftest vẫn qua', () => {
  const r = spawnSync(PYTHON, [path.join(S2S, 'scripts', 'preflight.py'), '--selftest'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
