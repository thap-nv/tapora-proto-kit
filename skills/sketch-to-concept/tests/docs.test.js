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
// A1–A3, Cổng 1 và đường tắt ở references/vong-dau.md; SKILL.md giữ luật dừng, lối vào, Cổng 2, bàn giao
const R1 = () => read(path.join(SKILL, 'references', 'vong-dau.md'));
const ROUND1 = () => read(path.join(SKILL, 'SKILL.md')) + '\n' + R1();

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
  for (const f of ['SKILL.md', 'references/vong-dau.md', 'references/concept-method.md', 'references/subagent-prompts.md', 'references/vong-moi.md']) {
    const missing = paths(read(path.join(SKILL, f)), SKILL).filter(p => !fs.existsSync(p));
    assert.deepEqual(missing.map(p => path.relative(REPO, p)), [], `${f} trỏ tới file không có`);
  }
});

test('SKILL.md và vong-dau.md nhắc đủ các khuôn của skill', () => {
  const md = ROUND1();
  for (const f of ['templates/concept-board.html', 'templates/concepts.js', 'templates/tokens.js', 'templates/key-screen.html', 'templates/CONCEPT.md', 'references/concept-method.md']) {
    assert.ok(md.includes(f), `SKILL.md chưa nhắc ${f}`);
  }
  assert.ok(md.includes('<skills>/sketch-to-site/templates/color.js'), 'SKILL.md chưa dặn chép color.js');
});

test('SKILL.md và vong-dau.md chỉ có Cổng 1 và Cổng 2, dừng ở cả hai', () => {
  const md = ROUND1();
  assert.match(md, /🛑 Gate 1/);
  assert.match(md, /🛑 Gate 2/);
  assert.doesNotMatch(md, /Cổng [5-9]|Gate [5-9]/);
});

test('vong-dau.md dặn đổi KEY của theme.js, để nền đã chọn không lan sang bảng khác', () => {
  const md = R1();
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
  fs.copyFileSync(path.join(SKILL, 'templates', 'concepts.example.js'), path.join(dir, 'concept', 'concepts.js'));
  fs.copyFileSync(path.join(SKILL, 'templates', 'tokens.js'), path.join(dir, 'concept', 'tokens.js'));
  fs.copyFileSync(path.join(SKILL, '..', 'sketch-to-site', 'templates', 'color.js'), path.join(dir, 'concept', 'color.js'));
  const cmd = m[1].replace('<id>', 'a').replace('<mix code>', 'mau:B');
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

test('A3: dựng song song bằng subagent có đường một agent, review bằng góc nhìn mới trước Cổng 2', () => {
  const md = R1();
  const a3 = md.slice(md.indexOf('### A3 · Build 3 concepts'), md.indexOf('### Short paths'));
  assert.match(a3, /`references\/subagent-prompts\.md` §1/);
  assert.match(a3, /`references\/subagent-prompts\.md` §2/);
  assert.match(a3, /the three screens in one turn/);
  const p = read(path.join(SKILL, 'references', 'subagent-prompts.md'));
  const one = p.slice(p.indexOf('## 1. Build one concept'), p.indexOf('## 2.'));
  assert.match(one, /you do not read or guess them/);
  assert.match(one, /Do not edit concepts\.js, index\.html, tokens\.js/);
  assert.match(one, /Return exactly these parts/);
  const two = p.slice(p.indexOf('## 2. Review the concepts with fresh eyes'));
  assert.match(two, /Read only; do not edit any file/);
  assert.match(two, /skipped as out of scope/);
});

test('sửa sau review: đường subagent không để concepts.js lộ concept khác; mỗi subagent ghi file riêng', () => {
  const md = R1();
  const a3 = md.slice(md.indexOf('### A3 · Build 3 concepts'), md.indexOf('### Short paths'));
  assert.match(a3, /subagent path[^\n]*write only the brief and shared content/);
  const p = read(path.join(SKILL, 'references', 'subagent-prompts.md'));
  const one = p.slice(p.indexOf('## 1. Build one concept'), p.indexOf('## 2.'));
  assert.match(one, /\{prototype folder\}\/concept\/\{id\}\.concept\.js/);
  assert.match(one, /CONCEPTS\.concepts\.push/);
  assert.match(one, /after concepts\.js, before tokens\.js/);
  assert.match(one, /Keys not in quotes/);
  assert.match(one, /With an app/);
  assert.match(p, /delete the \{id\}\.concept\.js files/);
});

test('khuôn concepts.js là khung trống, không mang concept mẫu; mẫu đủ trường ở concepts.example.js', () => {
  const vm = require('node:vm');
  const load = f => { const ctx = { window: {} }; vm.runInNewContext(read(path.join(SKILL, 'templates', f)), ctx); return JSON.parse(JSON.stringify(ctx.window.CONCEPTS)); };
  const blank = load('concepts.js');
  assert.deepEqual(blank.concepts, []);
  assert.equal(blank.example, undefined);
  assert.deepEqual(blank.rounds, [{ n: 1, note: '' }]);
  const src = read(path.join(SKILL, 'templates', 'concepts.js'));
  for (const font of ['Newsreader', 'Archivo', 'Bricolage', 'Be Vietnam Pro', 'Fraunces', 'Barlow', 'JetBrains', 'IBM Plex']) {
    assert.ok(!src.includes(font), `khung còn neo font ${font}`);
  }
  assert.doesNotMatch(src, /concepts\.example\.js/, 'khung không trỏ tới file mẫu');
  const ex = load('concepts.example.js');
  assert.equal(ex.example, true);
  assert.deepEqual(ex.rounds, [{ n: 1, note: '' }]);
  assert.deepEqual(ex.concepts.map(c => c.id), ['a', 'b', 'c']);
  for (const c of ex.concepts) assert.deepEqual(Object.keys(c.why).sort(), ['chatNen', 'chu', 'hinh', 'mau']);
  assert.ok(!ROUND1().includes('concepts.example.js'), 'SKILL.md và vong-dau.md không dặn mở file mẫu');
});

const between = (md, from, to) => { const i = md.indexOf(from); assert.ok(i >= 0, `không thấy "${from}"`); const j = md.indexOf(to, i + 1); return md.slice(i, j < 0 ? undefined : j); };

test('lối vào lại: đã có concept/concepts.js thì bỏ A1, A2 và đọc references/vong-moi.md', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  const entry = md.indexOf('### Re-entry'), g2 = md.indexOf('### 🛑 Gate 2');
  assert.ok(entry > 0 && entry < g2, 'Lối vào lại phải đứng trước Cổng 2');
  const sec = md.slice(entry, g2);
  assert.match(sec, /`concept\/concepts\.js`/);
  assert.match(sec, /`references\/vong-moi\.md`/);
  assert.match(sec, /new session/);
});

test('Cổng 2 câu 1: bốn lựa chọn cố định, có "Chưa hợp, làm vòng mới"', () => {
  const g2 = between(read(path.join(SKILL, 'SKILL.md')), '### 🛑 Gate 2', '### Handover');
  assert.match(g2, /Not there yet, new round/);
  assert.match(g2, /`references\/vong-moi\.md`/);
  assert.doesNotMatch(g2, /A \*\(Khuyến nghị\)\* · B · C · Trộn|A \(recommended\) · B · C · Mix/);
  assert.doesNotMatch(g2, /một vòng biến thể|a variant round/);
});

test('vong-moi.md đủ các bước của vòng mới và ba trường hợp vào lại', () => {
  const v = read(path.join(SKILL, 'references', 'vong-moi.md'));
  for (const s of ['Which layers miss', 'closest', '`screen`', 'rounds', 'verbatim', 'every concept already on the board', 'Do not touch',
    'Hướng chưa dùng', '`tweak-site`', '`evolve-site`', '`CONCEPT.md`', '--round']) assert.ok(v.includes(s), `vong-moi.md thiếu "${s}"`);
});

test('khuôn DECISIONS.md: Cổng 2 nhiều vòng, có mục Hướng chưa dùng, không gắn nguồn cố định cho ô', () => {
  const dec = read(path.join(SKILLS, 'sketch-to-site', 'templates', 'DECISIONS.md'));
  const g2 = between(dec, '## 🛑 Cổng 2', '## Giả định');
  assert.match(g2, /\| Vòng \| Concept \|/);
  assert.match(g2, /Hướng chưa dùng/);
  assert.doesNotMatch(g2, /\| A \*\(Khuyến nghị\)\* \| hợp nhất \|/);
  assert.match(read(path.join(SKILL, 'templates', 'CONCEPT.md')), /\| Vòng \| Concept \| Ý \|/);
});

test('gỡ khuôn: không còn vai gắn theo ô; rải 6–8 hướng rồi chọn; mọi lựa chọn Hình có why', () => {
  const md = ROUND1();
  const cm = read(path.join(SKILL, 'references', 'concept-method.md'));
  for (const [f, s] of [['SKILL.md', md], ['concept-method.md', cm]]) {
    assert.doesNotMatch(s, /hợp nhất → cân bằng → táo bạo|A hợp nhất → B cân bằng → C táo bạo|best-fit → balanced → bold/, `${f} còn luật xếp theo ô`);
    assert.doesNotMatch(s, /\*\*A hợp nhất\*\*|\*\*A · hợp nhất\*\*|\*\*B · chuẩn thật\*\*|\*\*C · lăng kính studio\*\*|\*\*A · best-fit\*\*/, `${f} còn gắn nguồn vào ô`);
  }
  assert.match(md, /6–8 directions/);
  assert.match(cm, /### 2\.5 Spread wide, then choose/);
  assert.match(cm, /Hướng chưa dùng/);
  assert.match(cm, /### 5\.4 A reason for every form choice/);
  for (const k of ['why.mau', 'why.chu', 'why.hinh', 'why.chatNen']) assert.ok(cm.includes(k), `concept-method.md thiếu ${k}`);
});

test('trục để mở: mục 4 ghi Ví dụ, có luật cho cặp dùng chung một màn', () => {
  const cm = read(path.join(SKILL, 'references', 'concept-method.md'));
  const m4 = between(cm, '## 4. ', '## 5. ');
  assert.match(m4, /\| Axis \*\(key in `axes`\)\* \| Examples \*\(not a list to pick from\)\* \|/);
  assert.match(m4, /sharing one screen/);
});

test('font: A2 dẫn lệnh --vi-fonts; Lỗi hay gặp ghi các thói quen đã đo', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  assert.match(between(R1(), '### A2 · ', '### A3 · '), /preflight\.py --vi-fonts/);
  const lhg = between(md, '## 5. Common mistakes', '## 6. ');
  for (const s of ['Barlow Condensed', 'Be Vietnam Pro', 'grain']) assert.ok(lhg.includes(s), `Lỗi hay gặp thiếu thói quen ${s}`);
  assert.match(lhg, /`why`/);
});

test('prompt dựng: khối dữ liệu có round và why', () => {
  const p = read(path.join(SKILL, 'references', 'subagent-prompts.md'));
  const one = between(p, '## 1. Build one concept', '## 2.');
  assert.match(one, /id, name, round, source/);
  assert.match(one, /, why\./);
});

// Sửa sau review độc lập (1.4)
test('vòng mới trên dự án dựng trước 1.4: chép lại bảng, tokens.js, color.js của kit; tự kiểm bằng preflight trước khi chụp', () => {
  const v = read(path.join(SKILL, 'references', 'vong-moi.md'));
  assert.match(v, /concept-board\.html[^\n]*concept\/index\.html/, 'vong-moi.md phải chép lại bảng của kit');
  assert.match(v, /tokens\.js[^\n]*color\.js|color\.js[^\n]*tokens\.js/, 'vong-moi.md phải chép lại tokens.js và color.js');
  const pre = v.indexOf('preflight.py'), shots = v.indexOf('shots.mjs');
  assert.ok(pre > 0 && pre < shots, 'chạy preflight.py (0 lỗi) trước shots.mjs');
  assert.match(v, /--vi-fonts|--font/, 'font mới của vòng phải qua kiểm dấu tiếng Việt');
});

test('gỡ khuôn: style-catalogue.md và SKILL.md không còn gắn nguồn hay vai vào concept A, B, C', () => {
  const sc = read(path.join(SKILLS, 'sketch-to-site', 'references', 'style-catalogue.md'));
  assert.doesNotMatch(sc, /nguồn của \*\*concept A\*\*|Luật xếp ba concept|A = \*\*hợp nhất\*\*/);
  for (const f of [path.join(SKILL, 'SKILL.md'), path.join(SKILLS, 'sketch-to-site', 'SKILL.md'), path.join(SKILLS, 'sketch-to-site', 'references', 'style-catalogue.md')]) {
    assert.doesNotMatch(read(f), /[Cc]oncept [ABC](?![\wÀ-ỹ])/, `${path.relative(SKILLS, f)} còn gắn vai vào concept A, B, C`);
  }
});

test('description: gọi được skill khi concept chưa hợp hay cần vòng mới, kể cả khi prototype đã có', () => {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(path.join(SKILL, 'SKILL.md')))[1];
  assert.match(fm, /vòng mới/);
  assert.match(fm, /chưa hợp/);
  assert.doesNotMatch(fm, /KHÔNG dùng khi prototype đã có/);
});

test('CONCEPT.md: concept chọn có thể là concept chỉ đổi Hình (màn mượn và mã trộn), không còn A | B | C', () => {
  const c = read(path.join(SKILL, 'templates', 'CONCEPT.md'));
  assert.doesNotMatch(c, /<A \| B \| C \| trộn>/);
  assert.match(c, /`screen`[^\n]*man:<SCREEN> mau:<ID> chu:<ID> nut:<ID>/);
});

// Sau Task 9 của 1.4: chế độ tối chỉ làm khi người dùng xin; vòng mới rẻ hơn; thói quen mới đo được
const loadData = f => { const ctx = { window: {} }; require('node:vm').runInNewContext(read(path.join(SKILL, 'templates', f)), ctx); return JSON.parse(JSON.stringify(ctx.window.CONCEPTS)); };

test('chế độ tối chỉ khi người dùng xin: mỗi concept một bảng màu, không tự chụp ?theme=dark, Cổng 2 khuyến nghị giữ một nền', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  assert.doesNotMatch(md, /Concept khoá nền tối thì chụp thêm/);
  assert.match(between(R1(), '### A3 · ', '### Short paths'), /\?theme=dark[^\n]*user has asked for dark mode/, 'A3 chỉ chụp nền tối khi người dùng đã xin');
  const g2 = between(md, '### 🛑 Gate 2', '### Handover');
  assert.doesNotMatch(g2, /Theo hệ thống|Follow the system/);
  assert.match(g2, /No, one background like the concept \(recommended\)/);
  assert.match(between(md, '## 5. Common mistakes', '## 6. '), /\?theme=dark/);
  for (const f of ['concepts.js', 'concepts.example.js']) {
    const src = read(path.join(SKILL, 'templates', f));
    assert.match(src, /ONE palette/, `${f}: chú thích phải nói mỗi concept một bảng màu`);
    assert.doesNotMatch(src, /Concept khoá một nền thì/);
  }
  assert.deepEqual(loadData('concepts.example.js').concepts.filter(c => c.colors.light && c.colors.dark).map(c => c.id), [], 'mẫu không có concept hai bảng màu');
  const c = read(path.join(SKILL, 'templates', 'CONCEPT.md'));
  assert.doesNotMatch(c, /theo hệ thống/);
  assert.match(c, /người dùng xin/);
});

test('vòng mới rẻ hơn: in đúng mục cần đọc, khối concept chỉ có dữ liệu viết sẵn, font của --vi-fonts không kiểm lại, chỉ mở ảnh 1440', () => {
  const v = read(path.join(SKILL, 'references', 'vong-moi.md'));
  // Lệnh sed in mục (ở lệnh của Lối vào lại trong SKILL.md): mọi mốc trong lệnh phải là tiêu đề có thật của concept-method.md
  const cm = read(path.join(SKILL, 'references', 'concept-method.md')).split(/\r?\n/);
  const sedCm = /sed -n '([^']+)' "\$S\/sketch-to-concept\/references\/concept-method\.md"/.exec(between(read(path.join(SKILL, 'SKILL.md')), '### Re-entry', '### 🛑 Gate 2'));
  assert.ok(sedCm, 'Lối vào lại phải in mục của concept-method.md bằng sed');
  for (const m of sedCm[1].matchAll(/\/\^([^/]+)\//g)) {
    const re = new RegExp('^' + m[1]);
    assert.ok(cm.some(l => re.test(l)), `không có tiêu đề khớp ^${m[1]} trong concept-method.md`);
  }
  for (const h of ['### 2.5', '## 4.', '### 5.1', '### 5.2', '### 5.4']) {
    const re = new RegExp('^' + h.replace('.', '\\.'));
    assert.ok(cm.some(l => re.test(l)), `concept-method.md mất mục ${h}`);
  }
  // Đo lại vòng 2: in DECISIONS.md bằng sed rồi vẫn phải Read lại để Edit. Đọc thẳng bằng Read một lần
  assert.doesNotMatch(v, /sed -n '[^']+' DECISIONS\.md/);
  assert.match(v, /`DECISIONS\.md` with `Read`/);
  assert.match(v, /screen: '<borrowed screen id>'/, 'vong-moi.md viết sẵn khối concept chỉ có dữ liệu');
  assert.match(v, /no `--font` check/);
  // Màn mượn dùng vai màu nào ở đâu, vai chữ đậm bao nhiêu: bản đồ của roles.mjs (bắt cả biến CSS lẫn lớp Tailwind, xem roles.test.js)
  assert.match(v, /`node <skills>\/sketch-to-concept\/scripts\/roles\.mjs concept\/ <borrowed screen id>`/, 'vong-moi.md chỉ cách xem màn mượn dùng vai nào');
  assert.match(v, /open only the 1440 image and the signature image/);
  assert.match(v, /`recommended`[^\n]*no reshoot/);
});

test('màu: đo sắc độ, độ sáng, độ bão hoà oklch bằng một lệnh của color.js (luật lệch 60° hoặc 0,3)', () => {
  const m51 = between(read(path.join(SKILL, 'references', 'concept-method.md')), '### 5.1', '### 5.2');
  const cmd = /`node -e "([^"]+)" '#…' '#…'`/.exec(m51);
  assert.ok(cmd, 'mục 5.1 phải có lệnh node -e đo oklch');
  const vm = require('node:vm'), lines = [];
  const C = require(path.join(SKILLS, 'sketch-to-site', 'templates', 'color.js'));
  vm.runInNewContext(cmd[1], { require: () => C, process: { argv: ['node', '#A8401C', '#2C3E4C'] }, console: { log: (...a) => lines.push(a.join(' ')) } });
  assert.deepEqual(lines, ['#A8401C L 0.51 C 0.15 H 38', '#2C3E4C L 0.35 C 0.03 H 242']);
});

test('Lỗi hay gặp: thói quen đo lại ở 1.4 (họ phong cách, cặp font, từ khoá ví dụ thành lựa chọn)', () => {
  const lhg = between(read(path.join(SKILL, 'SKILL.md')), '## 5. Common mistakes', '## 6. ');
  for (const s of ['Brutalist · Swiss công nghiệp', 'Fira Sans Extra Condensed', 'Alfa Slab One', '`--vi-fonts`']) assert.ok(lhg.includes(s), `Lỗi hay gặp thiếu ${s}`);
});

// Mục nhỏ còn lại sau review 1.4: chữ cũ còn sót
test('chữ cũ: không còn "bảng demo", "3 màn then chốt", "3 concepts from 3 different sources"; chú thích của mẫu khớp khung', () => {
  const readme = read(path.join(REPO, 'README.md'));
  assert.doesNotMatch(readme, /3 concepts from 3 different sources/);
  for (const [f, s] of [['README.md', readme], ['CHANGELOG.md', read(path.join(REPO, 'CHANGELOG.md'))], ['concepts.example.js', read(path.join(SKILL, 'templates', 'concepts.example.js'))]]) {
    assert.doesNotMatch(s, /demo board|bảng demo/, `${f} nhắc tới bảng demo không có thật`);
  }
  const site = read(path.join(SKILLS, 'sketch-to-site', 'SKILL.md'));
  assert.doesNotMatch(site, /3 màn then chốt/);
  assert.match(site, /Màn then chốt ở `concept\/<id>\.html`[^\n]*`screen`/, 'sơ đồ trang: concept chỉ đổi Hình thì màn đầu là màn nó mượn');
  // Dòng luật (// - … và dòng tiếp //   …) của concepts.example.js phải giống hệt khung concepts.js
  const rules = f => read(path.join(SKILL, 'templates', f)).split(/\r?\n/).filter(l => /^\/\/ ( -|  )/.test(l));
  assert.deepEqual(rules('concepts.example.js'), rules('concepts.js'));
});

// 1.4, sau khi đo token: tài liệu agent viết tiếng Anh (tiếng Việt tốn khoảng 2,5 lần token cho cùng nội dung);
// lời hỏi, tiến độ, báo cáo theo ngôn ngữ người dùng; SKILL.md chỉ giữ bản đang chạy; kiểm bản nháp một lệnh; ngân sách màn; in danh mục họ phong cách
const VI = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/gi;
const viShare = s => (s.match(VI) || []).length / (s.match(/\p{L}/gu) || []).length;

test('ngôn ngữ: tài liệu agent bằng tiếng Anh; lời hỏi và báo cáo theo ngôn ngữ người dùng', () => {
  const md = read(path.join(SKILL, 'SKILL.md'));
  assert.match(md, /\*\*Language:\*\* talk to the user in the language they write in/);
  const body = md.replace(/^---[\s\S]*?---/, '').replace(/<!-- luat-dung:co:bat-dau -->[\s\S]*?<!-- luat-dung:co:ket-thuc -->/, '');
  const docs = [['SKILL.md', body], ...['vong-dau.md', 'concept-method.md', 'vong-moi.md', 'subagent-prompts.md'].map(f => [f, read(path.join(SKILL, 'references', f))]),
    ['style-catalogue.md', read(path.join(SKILLS, 'sketch-to-site', 'references', 'style-catalogue.md'))]];
  for (const [f, s] of docs) assert.ok(viShare(s) < 0.04, `${f}: ${(viShare(s) * 100).toFixed(1)}% chữ có dấu tiếng Việt`);
  assert.match(read(path.join(SKILL, 'references', 'vong-moi.md')), /Talk to the user in their language/);
  // Mô tả skill giữ tiếng Việt: là chỗ khớp lời người dùng để gọi skill
  assert.match(/^---\r?\n([\s\S]*?)\r?\n---/.exec(md)[1], /lên concept/);
});

test('SKILL.md chỉ giữ bản đang chạy; lịch sử ở CHANGELOG', () => {
  const versions = read(path.join(SKILL, 'SKILL.md')).split(/\r?\n/).filter(l => /^> \*\*v\d/.test(l));
  assert.deepEqual(versions.length, 1, versions.join('\n'));
  assert.match(versions[0], /CHANGELOG\.md/);
  const log = read(path.join(REPO, 'CHANGELOG.md'));
  for (const v of ['`sketch-to-concept` 1.1', '`sketch-to-concept` 1.2', '`sketch-to-concept` 1.3', '`sketch-to-concept` 1.4']) assert.ok(log.includes(v), `CHANGELOG thiếu ${v}`);
});

test('check.mjs: A3 bước 2 và vòng mới kiểm bản nháp bằng một lệnh, trước khi dựng hay chụp', () => {
  const a3 = between(R1(), '### A3 · ', '### Short paths');
  const chk = a3.indexOf('scripts/check.mjs concept/'), score = a3.indexOf('**Score the idea layer on the data**');
  assert.ok(chk > 0 && chk < score, 'check.mjs chạy ngay sau khi viết concepts.js, trước khi chấm và dựng');
  const v = read(path.join(SKILL, 'references', 'vong-moi.md'));
  const vc = v.indexOf('check.mjs concept/ --round <n>'), shots = v.indexOf('shots.mjs');
  assert.ok(vc > 0 && vc < shots, 'vòng mới kiểm bản nháp trước khi chụp');
  assert.ok(fs.existsSync(path.join(SKILL, 'scripts', 'check.mjs')));
});

test('ngân sách màn then chốt: khung đầu + khối chữ ký, khoảng 10 KB, ở SKILL.md, concept-method.md mục 6 và prompt dựng', () => {
  assert.match(between(R1(), '### A3 · ', '### Short paths'), /\*\*budget:\*\* the first screen plus the signature block[^\n]*10 KB/);
  assert.match(between(read(path.join(SKILL, 'references', 'concept-method.md')), '## 6. ', '## 7. '), /\*\*Budget:\*\*[^\n]*10 KB/);
  assert.match(between(read(path.join(SKILL, 'references', 'subagent-prompts.md')), '## 1. ', '## 2. '), /budget[^\n]*10 KB/);
});

test('danh mục họ phong cách: A2 in mục lục rồi chỉ in họ đã chọn; lệnh trong tài liệu chạy đúng', () => {
  const a2 = between(R1(), '### A2 · ', '### A3 · ');
  const idx =/`grep -E '([^']+)' <skills>\/sketch-to-site\/references\/style-catalogue\.md`/.exec(a2);
  const pick = /`awk '\/\^### \(([\d|]+)\)\\\.\/\{f=1;print;next\} \/\^#\/\{f=0\} f' <skills>\/sketch-to-site\/references\/style-catalogue\.md`/.exec(a2);
  assert.ok(idx && pick, 'A2 thiếu lệnh grep mục lục hoặc lệnh awk in họ');
  const lines = read(path.join(SKILLS, 'sketch-to-site', 'references', 'style-catalogue.md')).split(/\r?\n/);
  // Mục lục: 12 họ, mỗi họ đủ tên, từ khoá, hợp với, dial
  const index = lines.filter(l => new RegExp(idx[1]).test(l));
  assert.equal(index.length, 48, `mục lục có ${index.length} dòng`);
  assert.ok(index.join('\n').length < 4000);
  // Như awk: bật khi gặp tiêu đề họ đã chọn, tắt ở tiêu đề kế tiếp
  let f = false; const out = [];
  for (const l of lines) {
    if (new RegExp(`^### (${pick[1]})\\.`).test(l)) { f = true; out.push(l); continue; }
    if (/^#/.test(l)) f = false;
    if (f) out.push(l);
  }
  assert.deepEqual(out.filter(l => l.startsWith('### ')).map(l => l.split('.')[0]), pick[1].split('|').map(n => `### ${n}`));
  assert.ok(out.some(l => /^- \*\*Colour:\*\*/.test(l)));
});

// Bốn chỗ đo được ở các lần chạy 1.4 (vòng 1 và vòng 2)
test('đường dẫn trên Windows: node và python nhận W:/…, không nhận /w/…', () => {
  const paths = read(path.join(SKILL, 'SKILL.md')).split(/\r?\n/).find(l => l.startsWith('> **Paths:**'));
  assert.match(paths, /`node`[^\n]*`python`[^\n]*`W:\/…`[^\n]*`\/w\/…`/);
  assert.match(between(read(path.join(SKILL, 'references', 'subagent-prompts.md')), '# Subagent prompts', '## 1. '), /`W:\/…`/);
  const site = read(path.join(SKILLS, 'sketch-to-site', 'SKILL.md')).split(/\r?\n/).find(l => l.startsWith('> **Đường dẫn:**'));
  assert.match(site, /`W:\/…`[^\n]*`\/w\/…`/);
});

test('khối concept chỉ có dữ liệu: ghi sẵn giá trị của source.kind và nơi lấy tên họ, dial', () => {
  const v = read(path.join(SKILL, 'references', 'vong-moi.md'));
  const kinds = /kind \(in the user's language\): ([^(\n]+?) \(/.exec(read(path.join(SKILL, 'templates', 'concepts.js')))[1];
  const block = /```js\n([\s\S]*?)```/.exec(v.replace(/\r\n/g, '\n'))[1];
  assert.ok(block.includes(kinds), `khối thiếu các giá trị kind: ${kinds}`);
  // Lệnh in tên họ và dial: chạy được trên style-catalogue.md, ra đủ 12 họ và 12 dòng Dial
  const g = /`grep -E '([^']+)' <skills>\/sketch-to-site\/references\/style-catalogue\.md`/.exec(block);
  assert.ok(g, 'khối phải có lệnh grep in tên họ và dial');
  const cat = read(path.join(SKILLS, 'sketch-to-site', 'references', 'style-catalogue.md')).split(/\r?\n/).filter(l => new RegExp(g[1]).test(l));
  assert.equal(cat.filter(l => l.startsWith('### ')).length, 12);
  assert.equal(cat.filter(l => /^- \*\*Dial:\*\* \d+\/\d+\/\d+$/.test(l)).length, 12);
  // Tên họ trong dữ liệu = tiêu đề họ bỏ số thứ tự và phần tiếng Anh in nghiêng, như khối ghi
  const names = cat.filter(l => l.startsWith('### ')).map(l => l.replace(/^### \d+\. /, '').replace(/ \*\(.*\)\*$/, ''));
  const ex = loadData('concepts.example.js').concepts;
  for (const c of ex) {
    assert.ok(names.includes(c.family), `family "${c.family}" của mẫu không phải tên họ trong mục lục`);
    assert.ok(kinds.split(' · ').includes(c.source.kind), `source.kind "${c.source.kind}" của mẫu không nằm trong ${kinds}`);
  }
  assert.match(block, /without the number and the italic English part/);
});

test('chữ cỡ lớn: cỡ bằng clamp() theo vw, nhẩm ở khổ 390 trước khi chụp; có ở A3 và prompt dựng', () => {
  const a3 = between(R1(), '### A3 · ', '### Short paths');
  const rule = a3.split(/\r?\n/).find(l => /\*\*giant type\*\*/.test(l));
  assert.ok(rule, 'A3 bước 4 thiếu luật chữ cỡ lớn');
  assert.match(rule, /`clamp\(\)`[^\n]*`vw`/);
  assert.match(rule, /390[^\n]*before shooting|before shooting[^\n]*390/);
  assert.ok(a3.indexOf('**giant type**') < a3.indexOf('5. **Self-check**'), 'luật nằm ở bước dựng, trước bước chụp');
  assert.match(between(read(path.join(SKILL, 'references', 'subagent-prompts.md')), '## 1. ', '## 2. '), /clamp\(\)[^\n]*vw[^\n]*390/);
});

test('nguồn chuẩn thật: tối đa 2 lần WebSearch, không WebFetch, bắt đầu từ 20 phong cách của huashu-design', () => {
  const cm = between(read(path.join(SKILL, 'references', 'concept-method.md')), '## 3. ', '## 4. ');
  const row = cm.split(/\r?\n/).find(l => l.startsWith('| **Real benchmark**'));
  assert.match(row, /at most 2 `WebSearch`/);
  assert.match(row, /no `WebFetch`/);
  // Lệnh awk in tên và tham chiếu của 20 phong cách web nằm ở A2 (đo sau gộp lượt: để ở concept-method.md thì phải đọc file đó
  // xong mới chạy được, nên mục lục họ và danh sách 20 phong cách tách hai lượt); hàng Real benchmark trỏ về đó
  assert.match(row, /20 web styles[^|]*vong-dau\.md`? A2/);
  const a2Awk = between(R1(), "### A2 · ", "### A3 · ");
  const awk = /`awk '\/\^## \.\*\\\(20\/\{n\+\+\} n==1 && \/\^\\\*\\\*\/\{print; getline; print\}' <skills>\/huashu-design\/references\/design-styles\.md`/.exec(a2Awk);
  assert.ok(awk, 'SKILL.md A2 thiếu lệnh awk in danh sách 20 phong cách');
  const lines = read(path.join(SKILLS, 'huashu-design', 'references', 'design-styles.md')).split(/\r?\n/);
  let n = 0; const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^## .*\(20/.test(lines[i])) n++;
    if (n === 1 && /^\*\*/.test(lines[i])) { out.push(lines[i], lines[i + 1]); i++; }
  }
  assert.equal(out.filter(l => l.startsWith('**')).length, 20);
  assert.equal(out.filter(l => l.startsWith('- ')).length, 20, 'mỗi phong cách in kèm dòng tham chiếu');
  const a2 = between(R1(), '### A2 · ', '### A3 · ');
  assert.match(a2, /at most 2 `WebSearch`[^\n]*no `WebFetch`/);
});
