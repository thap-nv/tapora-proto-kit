// Kiểm evolve-site 1.9, tweak-site 1.3, handover-check 1.3 sau đợt chuyển cách giảm token của sketch-to-concept và sketch-to-site:
// SKILL.md của evolve-site chỉ giữ luật chung và lối vào, các bước ở hai file theo giai đoạn; mỗi giai đoạn vào bằng một lượt;
// tài liệu của skill khác in bằng lệnh sed đúng mục; kiểm và chụp bằng một lệnh (quick.py --shots, run_all.py, qa-check.py);
// nhật ký đọc bằng handover.py ledger. Lịch sử phiên bản ở CHANGELOG.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SKILLS = path.resolve(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(SKILLS, f), 'utf8').replace(/\r\n/g, '\n');
const EVO = () => read('evolve-site/SKILL.md');
const E1 = () => read('evolve-site/references/b1-b2.md');
const E2 = () => read('evolve-site/references/b3-b4.md');
const TWEAK = () => read('tweak-site/SKILL.md');
const HAND = () => read('handover-check/SKILL.md');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const QA_INIT = path.join(SKILLS, 'sketch-to-site', 'templates', 'qa-kit', 'qa_init.py');

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
// Mọi lệnh `sed -n '<biểu thức>' <skills>/<skill>/references/<file>` trong một tài liệu
const sedCalls = md => [...md.matchAll(/sed -n '([^']+)' <skills>\/([a-z-]+\/references\/[a-z0-9-]+\.md)/g)].map(m => ({ expr: m[1], file: m[2] }));

test('evolve-site SKILL.md chỉ giữ luật chung và lối vào: ≤ 18 000 ký tự, mục 0–5, một ghi chú phiên bản, không có bước B1–B4', () => {
  const md = EVO();
  assert.ok(md.length <= 18000, `SKILL.md dài ${md.length} ký tự`);
  assert.deepEqual(md.split('\n').filter(l => /^## \d\. /.test(l)).map(l => l.slice(0, 5)), ['## 0.', '## 1.', '## 2.', '## 3.', '## 4.', '## 5.']);
  assert.deepEqual(md.split('\n').filter(l => l.startsWith('> **v')).map(l => l.split(' (')[0]), ['> **v1.11'], 'lịch sử phiên bản ở CHANGELOG');
  assert.doesNotMatch(md, /^### (B[1-4] · |🛑 Cổng)/m, 'các bước ở references/b1-b2.md và b3-b4.md');
  for (const h of ['### 1.1 ', '### 1.2 ', '### 1.3 ', '### 1.4 ']) assert.ok(md.includes(h), `thiếu ${h}: tweak-site và các bước trỏ về mục 1`);
  assert.match(md, /`W:\/…`[^\n]*`\/w\/…`/);
  for (const h of ['### B1 · ', '### 🛑 Cổng 1 · ', '### B2 · ', '### 🛑 Cổng 2 · ']) assert.ok(E1().includes(h), `b1-b2.md thiếu ${h}`);
  for (const h of ['### Làm tiếp', '### B3 · ', '### B4 · ', '### 🛑 Cổng 3 · ']) assert.ok(E2().includes(h), `b3-b4.md thiếu ${h}`);
});

test('evolve-site: mỗi giai đoạn vào bằng một lượt, Read file giai đoạn cùng file dự án và một lệnh', () => {
  const s3 = section(EVO(), '## 3.', '\n## 4.');
  assert.match(s3, /\*\*Lối vào\.\*\*[^\n]*một lượt/);
  const row1 = s3.split('\n').find(l => l.startsWith('| Yêu cầu mới'));
  for (const f of ['`references/b1-b2.md`', '`DESIGN.md`', '`FEATURE-DECISIONS.md`', 'lệnh 1']) assert.ok(row1.includes(f), `dòng giai đoạn 1 thiếu ${f}`);
  const row2 = s3.split('\n').find(l => l.startsWith('| Cổng của cấp đã có đáp án'));
  for (const f of ['`references/b3-b4.md`', '`BUILD-LOG.md`', 'người dùng vừa trả lời', 'mọi file sẽ sửa', 'lệnh 2']) assert.ok(row2.includes(f), `dòng giai đoạn 2 thiếu ${f}`);
  assert.match(E1(), /^> Đọc khi có yêu cầu mới/m);
  assert.match(E2(), /^> Đọc khi cổng của cấp đã có đáp án/m);
  // Lệnh 1: cập nhật bộ kiểm, xem file đổi, in DNA; grep tài liệu yêu cầu không thấy gì thì không thoát 1 (kết quả lỗi bị cắt giữa chừng)
  const l1 = section(s3, 'Lệnh 1', 'Lệnh 2');
  assert.ok(l1.includes('qa_init.py" "$P" --update') && l1.includes('python _qa/quick.py --dry'));
  for (const s of ['== file', '== token', '== icon']) assert.ok(l1.includes(s), `lệnh 1 thiếu ${s}`);
  assert.match(l1, /\{ grep -rniE "<từ khoá>\|<tên màn>"[^\n]*\|\| echo "[^"]+"; \} \| head -\d+/);
  // Lệnh 2: in phần chú thích đầu run_all.py (định dạng file bước), không đọc mã
  assert.ok(section(s3, 'Lệnh 2', '**Ít lượt.**').includes(`sed -n '/^#/!q;p' "$P/_qa/run_all.py"`));
});

test('evolve-site: ít lượt, ảnh lấy từ quick.py --shots và run_all.py, không tự dựng bộ chụp', () => {
  const s3 = section(EVO(), '**Ít lượt.**', '\n---');
  assert.match(s3, /\*\*không phụ thuộc nhau\*\* thì gọi chung một lượt/);
  assert.match(s3, /Mở \*\*mọi ảnh\*\*[^\n]*\*\*một\*\* lượt/);
  assert.match(s3, /Không đọc mã của script để biết cách dùng/);
  assert.match(s3, /`quick\.py --shots` và `run_all\.py`/);
  assert.match(section(E1(), '- **Mốc trước khi sửa**', '* **Lỗi có sẵn'), /`python _qa\/run_all\.py _qa\/truoc smoke-<trang>`/);
  const b4 = section(E2(), '### B4 · ', '### 🛑 Cổng 3');
  assert.ok(b4.includes('python _qa/quick.py --note "evolve: <tính năng> · màn: <các màn đã đụng>" --shots'));
  assert.match(b4, /\*\*Mở ảnh trong một lượt\*\*/);
  assert.match(section(E2(), '### B3 · ', '### B4'), /"shot": "<tên>", "jpeg": true/);
  for (const md of [E1(), E2()]) assert.doesNotMatch(md, /msedge|--screenshot|playwright/i);
});

test('evolve-site B4 in đúng nhóm của regression-qa.md theo cấp: không in mục 2; dự án dùng handover-check thì bỏ bảng UX', () => {
  const calls = sedCalls(section(E2(), '### B4 · ', '**Lệnh kiểm**')).filter(c => c.file.endsWith('regression-qa.md'));
  assert.equal(calls.length, 2);
  const text = read('evolve-site/references/regression-qa.md');
  const [full, noUx] = calls.map(c => sed(c.expr, text));
  for (const out of [full, noUx]) {
    for (const g of ['A', 'B', 'C', 'D', 'E', 'G']) assert.match(out, new RegExp(`^### Nhóm ${g}:`, 'm'), `thiếu nhóm ${g}`);
    assert.match(out, /^## 3\. Cho QA lớn theo tính năng/m);
    assert.doesNotMatch(out, /^## 2\.|--save/m, 'không in mục 2: lệnh mốc đã ghi ở b1-b2.md và b3-b4.md');
  }
  assert.match(full, /^\| 1 \| Hành động chính nổi nhất/m);
  assert.doesNotMatch(noUx, /^\| 1 \| Hành động chính nổi nhất/m);
});

test('mọi lệnh sed trong tài liệu ba skill in ra nội dung có thật, không in cả file', () => {
  const docs = { 'evolve-site/references/b3-b4.md': E2(), 'evolve-site/references/b1-b2.md': E1(), 'evolve-site/SKILL.md': EVO(), 'tweak-site/SKILL.md': TWEAK(), 'handover-check/SKILL.md': HAND() };
  let n = 0;
  for (const [name, md] of Object.entries(docs)) {
    for (const c of sedCalls(md)) {
      const text = read(c.file);
      const out = sed(c.expr, text);
      assert.ok(out.trim().length > 200, `${name}: sed '${c.expr}' trên ${c.file} không in gì`);
      assert.ok(out.length < text.length, `${name}: sed '${c.expr}' in cả ${c.file}`);
      n++;
    }
  }
  assert.ok(n >= 8, `chỉ thấy ${n} lệnh sed`);
});

test('tweak-site 1.3: một ghi chú phiên bản; tìm, đọc, sửa, kiểm mỗi việc một lượt; Cấp 1 kiểm và chụp bằng quick.py --shots', () => {
  const md = TWEAK();
  assert.deepEqual(md.split('\n').filter(l => l.startsWith('> **v')).map(l => l.slice(0, 10)), ['> **v1.5 (']);
  assert.match(md, /`W:\/…`[^\n]*`\/w\/…`/);
  const s3 = section(md, '## 3. Quy trình', '## 4.');
  assert.match(s3, /\*\*không phụ thuộc nhau\*\* thì gọi chung một lượt/);
  assert.match(section(s3, '2. **Tìm**', '3. **Đọc**'), /python _qa\/quick\.py --dry/);
  assert.match(section(s3, '3. **Đọc**', '4. **Sửa**'), /`Read` mọi file sẽ sửa[^\n]*`FEATURE-DECISIONS\.md`/);
  assert.match(section(s3, '4. **Sửa**', '5. **'), /mọi chỗ sửa gọi cùng lúc/);
  const check = section(s3, '5. **Kiểm nhanh**', '6. **');
  assert.match(check, /Cấp 1 thêm `--shots`/);
  assert.match(check, /Thoát 0 khi sạch[^\n]*1 khi còn lỗi/);
  assert.match(section(s3, '6. **Cấp 1: xem một ảnh**', '7. **'), /danh sách `--shots` in ra, cùng lượt với dòng nhật ký/);
  assert.match(section(md, '## 4.', '\n## '), /tự viết bộ chụp/);
});

test('handover-check 1.3: B1 đọc nhật ký bằng handover.py ledger; B3 chạy tổng bằng qa-check.py; UX in đúng nhóm F', () => {
  const md = HAND();
  assert.deepEqual(md.split('\n').filter(l => l.startsWith('> **v')).map(l => l.slice(0, 10)), ['> **v1.5 (']);
  assert.match(md, /`W:\/…`[^\n]*`\/w\/…`/);
  assert.match(section(md, '## 1.', '## 2.'), /\*\*Ít lượt\.\*\*/);
  const b1 = section(md, '### B1 ·', '### B2');
  assert.ok(b1.includes('python _qa/handover.py ledger'));
  assert.match(b1, /Đừng đọc `ledger\.jsonl`/);
  const b3 = section(md, '### B3 ·', '### B4');
  assert.ok(b3.includes('python <skills>/sketch-to-site/scripts/qa-check.py <thư-mục-prototype>'));
  assert.match(b3, /mỗi danh sách tối đa 15 dòng/);
  assert.match(b3, /`timeout` 600000/);
  assert.match(section(md, '### B0 ·', '### B1'), /Sang thẳng B3/);
  const ux = sedCalls(section(md, '### B5 ·', '### B6')).find(c => c.file === 'evolve-site/references/regression-qa.md');
  const table = sed(ux.expr, read(ux.file));
  assert.equal((table.match(/^\| (\d+) \|/gm) || []).length, 12, 'bảng UX đủ 12 điểm');
  assert.doesNotMatch(table, /Chặn đúng/, 'không in thân nhóm G');
});

test('lệnh ghi trong tài liệu khớp phần đầu của script: quick.py --shots, handover.py ledger, run_all.py in tên ảnh, qa-check.py cho handover-check', () => {
  const head = f => read(f).split('\n').filter(l => l.startsWith('#')).join('\n');
  assert.match(head('sketch-to-site/templates/qa-kit/quick.py'), /--shots/);
  assert.match(head('sketch-to-site/templates/qa-kit/handover.py'), /python _qa\/handover\.py ledger/);
  assert.match(head('sketch-to-site/templates/qa-kit/handover.py'), /python _qa\/handover\.py usage <lớp>/);
  assert.match(head('sketch-to-site/templates/qa-kit/run_all.py'), /tên từng ảnh/);
  assert.match(read('sketch-to-site/scripts/qa-check.py').split('\n')[0], /handover-check/);
});

function prototype(t, pages = ['index']) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'edit-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'site', 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'site', 'assets', 'site.css'), 'h1{color:#1a1a1a}\n');
  for (const p of pages) fs.writeFileSync(path.join(dir, 'site', p + '.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${p}</title><link rel="stylesheet" href="assets/site.css"></head><body><main><h1>Trang ${p}</h1><p>Nội dung mẫu.</p></main></body></html>`);
  const init = spawnSync(PYTHON, [QA_INIT, dir], { cwd: dir, encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  return dir;
}

test('run_all.shot_lines: đường dẫn tuyệt đối, ảnh theo thứ tự màn và số trong tên, bỏ thư mục không có ảnh', t => {
  const dir = prototype(t);
  const od = path.join(dir, 'o', 'smoke-index-1440');
  fs.mkdirSync(od, { recursive: true });
  for (const f of ['index-2.jpg', 'index.jpg', 'index-10.jpg', 'index@gio_11_00.jpg', 'index@gio_5_00.jpg', 'ghi-chu.txt']) fs.writeFileSync(path.join(od, f), '');
  const r = spawnSync(PYTHON, ['-c', "import sys; sys.path.insert(0, '_qa'); import run_all; print('\\n'.join(run_all.shot_lines('o', ['smoke-index-1440', 'khong-co'])))"], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const lines = r.stdout.trim().split(/\r?\n/);
  assert.equal(lines[0], 'Ảnh (mở cùng một lượt):');
  assert.match(lines[1], /^  thư mục: \S.*\/o\/$/);
  assert.ok(path.isAbsolute(lines[1].slice('  thư mục: '.length)), 'đường dẫn tuyệt đối');
  assert.equal(lines[2], '  smoke-index-1440: index.jpg, index-2.jpg, index-10.jpg, index@gio_5_00.jpg, index@gio_11_00.jpg');
  assert.equal(lines.length, 3);
});

// Đo ba skill sửa (05/10/2026): 4 trên 6 lần bản mới mở nhầm lát (dải chân trang) vì danh sách không nói lát nào chứa gì;
// evolve mở lại 7–17 ảnh sau vòng sửa dù chỉ vài ảnh đổi
test('run_all.shot_lines: tên lát kèm tiêu đề trong lát (slices.json); có dấu lần chụp trước thì nêu ảnh nào đổi', t => {
  const dir = prototype(t);
  const od = path.join(dir, 'o', 'smoke-index-390');
  fs.mkdirSync(od, { recursive: true });
  for (const [f, x] of [['index.jpg', 'a'], ['index-2.jpg', 'b'], ['index-3.jpg', 'c']]) fs.writeFileSync(path.join(od, f), x);
  fs.writeFileSync(path.join(od, 'slices.json'), JSON.stringify({ 'index.jpg': ['Bốn lần mở cửa lò'], 'index-3.jpg': ['Nội quy cạnh lò', 'Mở 5:30 đến 19:00'] }));
  const lines = before => {
    const r = spawnSync(PYTHON, ['-c', `import sys; sys.path.insert(0, '_qa'); import run_all; print('\\n'.join(run_all.shot_lines('o', ['smoke-index-390'], ${before})))`], { cwd: dir, encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout.trim().split(/\r?\n/);
  };
  const plain = lines('None');
  assert.equal(plain[2], '  smoke-index-390: index.jpg (Bốn lần mở cửa lò), index-2.jpg, index-3.jpg (Nội quy cạnh lò · Mở 5:30 đến 19:00)');
  assert.equal(plain.length, 3, 'không có dấu lần trước thì không nói gì về ảnh đổi');
  assert.match(lines('{}').at(-1), /^  chưa có ảnh của lần chụp trước để so: mở các ảnh cần xem$/);
  // Dấu lấy bằng shot_digests trước khi chụp lại: index.jpg đổi nội dung, index-2.jpg giữ, index-3.jpg mới
  const prev = "run_all.shot_digests('o')";
  fs.rmSync(path.join(od, 'index-3.jpg'));
  const snap = spawnSync(PYTHON, ['-c', `import sys, json; sys.path.insert(0, '_qa'); import run_all; print(json.dumps(${prev}))`], { cwd: dir, encoding: 'utf8' });
  assert.equal(snap.status, 0, snap.stderr);
  assert.deepEqual(Object.keys(JSON.parse(snap.stdout)).sort(), ['smoke-index-390/index-2.jpg', 'smoke-index-390/index.jpg']);
  fs.writeFileSync(path.join(od, 'index.jpg'), 'a2');
  fs.writeFileSync(path.join(od, 'index-3.jpg'), 'c');
  assert.equal(lines(snap.stdout.trim()).at(-1), '  đổi so với lần chụp trước (chỉ cần mở lại các ảnh này): smoke-index-390/index.jpg, smoke-index-390/index-3.jpg');
  assert.equal(lines(`{'smoke-index-390/index.jpg': '', 'smoke-index-390/index-2.jpg': '', 'smoke-index-390/index-3.jpg': ''}`).at(-1), '  mọi ảnh đều đổi so với lần chụp trước');
  fs.writeFileSync(path.join(od, 'index.jpg'), 'a');
  const same = spawnSync(PYTHON, ['-c', `import sys, json; sys.path.insert(0, '_qa'); import run_all; print(json.dumps(${prev}))`], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  assert.equal(lines(same).at(-1), '  không ảnh nào đổi so với lần chụp trước');
});

test('handover.py ledger: mỗi lần sửa một dòng, trang sửa trực tiếp và trang chỉ đổi qua CSS dùng chung, file chưa vào nhật ký', t => {
  const dir = prototype(t, ['index', 'dat-lich']);
  const py = (...a) => spawnSync(PYTHON, a, { cwd: dir, encoding: 'utf8' });
  assert.match(py(path.join('_qa', 'handover.py'), 'ledger').stdout, /Chưa có mốc _qa\/current\//);
  assert.equal(py('-c', "import sys, os; sys.path.insert(0, '_qa'); import qalib as Q; Q.save_json(os.path.join(Q.CUR, 'manifest.json'), Q.manifest())").status, 0);
  const long = 'x'.repeat(300);
  fs.writeFileSync(path.join(dir, '_qa', 'current', 'ledger.jsonl'), [
    { time: '2026-10-05T09:00:00', note: 'tweak: đổi nhãn nút', files: ['site/index.html'], suites: ['smoke-index-1440', 'smoke-index-390'], changed: [['default', 'smoke-index-1440', 'view', long, long]], lost: [], new: [] },
    { time: '2026-10-05T10:00:00', note: 'evolve: khoảng cách tiêu đề · chưa có bước kiểm', files: ['site/assets/site.css'], suites: ['smoke-index-1440', 'smoke-dat-lich-1440'], changed: [], lost: [], new: [['default', 'smoke-dat-lich-1440', 'moi']] },
  ].map(e => JSON.stringify(e)).join('\n') + '\n');
  fs.appendFileSync(path.join(dir, 'site', 'dat-lich.html'), '\n');
  const r = py(path.join('_qa', 'handover.py'), 'ledger');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Nhật ký từ lần bàn giao trước[^\n]*: 2 lần sửa$/m);
  assert.match(r.stdout, /^  1\. 2026-10-05T09:00:00 · tweak: đổi nhãn nút · file: site\/index\.html · check đổi 1$/m);
  assert.match(r.stdout, /^  2\. [^\n]*chưa có bước kiểm · file: site\/assets\/site\.css · check đổi 0 · bước mới 1$/m);
  assert.match(r.stdout, /^Trang sửa trực tiếp: index$/m);
  assert.match(r.stdout, /^Trang chỉ đổi qua file dùng chung: dat-lich$/m);
  assert.match(r.stdout, /^File đổi sau lần kiểm nhanh cuối, chưa vào nhật ký: site\/dat-lich\.html$/m);
  assert.doesNotMatch(r.stdout, /xxxxxxxxxx/, 'không in giá trị check');
  // Không khai ảnh lối vào vẫn in dòng Ảnh lối vào (đo ba skill sửa: cả hai lần handover mở qa.config.json chỉ để biết điều này)
  assert.match(r.stdout, /^Ảnh lối vào: không khai báo \(data-shot trên site\/index\.html hay "thumbs" trong qa\.config\.json\), B2 không có ảnh lối vào để xem lại$/m);
  // Đo lại sau 54b403a: handover tốn một lượt find cả dự án để biết có trang tổng quan cần cập nhật ở B2 không
  assert.match(r.stdout, /^Trang tổng quan app: không có \(site\/app\/index\.html\), B2 không có trang tổng quan để cập nhật$/m);
  fs.mkdirSync(path.join(dir, 'site', 'app'));
  fs.writeFileSync(path.join(dir, 'site', 'app', 'index.html'), '<!doctype html><title>app</title>');
  assert.match(py(path.join('_qa', 'handover.py'), 'ledger').stdout, /^Trang tổng quan app: site\/app\/index\.html \(tính năng thêm hay bỏ thì cập nhật ở B2\)$/m);
});

// Đo lại sau 54b403a: handover đếm chỗ dùng bằng grep -o 'field-err', khớp cả luật CSS trong <style> của _system.html,
// nên ra 3 thay vì 2 và để DESIGN.md sai; hai lượt đếm và một lượt đếm lại
test('handover.py usage: đếm lớp trong thuộc tính class của từng trang, cả khuôn trong <script>, bỏ <style> và chú thích', t => {
  const dir = prototype(t, ['index', 'dat-lich']);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), [
    '<!doctype html><html lang="vi"><head><style>.field-err{color:red} a[class="btn"]{color:blue}</style></head><body>',
    '<!-- <p class="field-err">mẫu cũ</p> -->',
    '<p class="field-err">a</p><p class=\'hint field-err\'>b</p><a class="btn btn-ghost">x</a><a class="btn-ghost btn-sm">y</a>',
    '<script>const t = `<button class="btn btn-ghost" data-x>${1}</button>`; el.classList.add("field-err");</script></body></html>'].join('\n'));
  const usage = (...a) => spawnSync(PYTHON, [path.join('_qa', 'handover.py'), 'usage', ...a], { cwd: dir, encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  const r = usage('.field-err', 'btn-ghost', 'btn', 'khong-co');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Chỗ dùng \(lớp trong thuộc tính class, cả khuôn trong <script>; bỏ <style> và chú thích\):$/m);
  assert.match(r.stdout, /^ {2}index: \.field-err 2 · \.btn-ghost 3 · \.btn 2 · \.khong-co 0$/m);
  assert.match(r.stdout, /^ {2}dat-lich: \.field-err 0 · \.btn-ghost 0 · \.btn 0 · \.khong-co 0$/m);
  assert.equal(usage().status, 2, 'không nêu lớp nào thì báo cách gọi');
});

test('quick.py --shots: chụp các bộ bị ảnh hưởng, in thư mục và tên từng ảnh ngay trên dòng kết quả cuối', t => {
  const dir = prototype(t);
  const py = (...a) => spawnSync(PYTHON, a, { cwd: dir, encoding: 'utf8', timeout: 300000 });
  const first = py(path.join('_qa', 'handover.py'), 'run');
  if (/Không tìm thấy Edge/.test(first.stdout + first.stderr)) return t.skip('không có trình duyệt');
  assert.equal(py(path.join('_qa', 'handover.py'), 'promote', /Thư mục chạy: (\S+)/.exec(first.stdout)[1]).status, 0);
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), fs.readFileSync(path.join(dir, 'site', 'index.html'), 'utf8').replace('Nội dung mẫu.', 'Nội dung đã sửa.'));
  const q = py(path.join('_qa', 'quick.py'), '--note', 'tweak: sửa câu mẫu', '--shots');
  assert.equal(q.status, 0, q.stdout + q.stderr);
  const lines = q.stdout.trim().split(/\r?\n/);
  const at = lines.indexOf('Ảnh (mở cùng một lượt):');
  assert.ok(at > 0, q.stdout);
  assert.match(lines[at + 1], /^  thư mục: \S.*\/_qa\/\.quick-run\/$/);
  for (const px of ['1440', '768', '390']) assert.ok(lines.some(l => l.startsWith(`  default/smoke-index-${px}: index.jpg`)), `thiếu ảnh khổ ${px}\n${q.stdout}`);
  assert.ok(lines.includes('  chưa có ảnh của lần chụp trước để so: mở các ảnh cần xem'), q.stdout);
  // Dòng cuối luôn có nợ cũ, kể cả khi bằng 0 (đo ba skill sửa: handover-check đọc handover.json chỉ để chắc nợ cũ bằng 0)
  assert.match(lines[lines.length - 1], /^quick · 1 file đổi · [^\n]* · nợ cũ 0 → ĐẠT, đã lưu mốc current$/);
  const shot = path.join(dir, '_qa', '.quick-run', 'default', 'smoke-index-390', 'index.jpg');
  assert.ok(fs.statSync(shot).size > 1000, 'ảnh có thật');
  // Sửa chỉ đụng khổ 390: lần --shots sau chỉ nêu ảnh 390 là đổi; ảnh 1440 và 768 giữ nguyên từng byte
  fs.appendFileSync(path.join(dir, 'site', 'assets', 'site.css'), '@media (max-width:500px){h1{color:#5a1e00}}\n');
  const q3 = py(path.join('_qa', 'quick.py'), '--note', 'tweak: màu tiêu đề ở điện thoại', '--shots');
  assert.equal(q3.status, 0, q3.stdout + q3.stderr);
  assert.ok(q3.stdout.split(/\r?\n/).includes('  đổi so với lần chụp trước (chỉ cần mở lại các ảnh này): default/smoke-index-390/index.jpg'), q3.stdout);
  // Không --shots thì không chụp, không in danh sách ảnh
  fs.writeFileSync(path.join(dir, 'site', 'index.html'), fs.readFileSync(path.join(dir, 'site', 'index.html'), 'utf8').replace('đã sửa', 'sửa lần hai'));
  const q2 = py(path.join('_qa', 'quick.py'), '--note', 'tweak: sửa lần hai');
  assert.equal(q2.status, 0, q2.stdout);
  assert.doesNotMatch(q2.stdout, /Ảnh \(mở cùng một lượt\)/);
});

// Đo ba skill sửa (05/10/2026): bẻ thử bằng python tự viết tốn 30–90k mỗi lần evolve (in tiếng Việt ra cp1252 hỏng giữa chừng, bẻ 0 chỗ mà tưởng đạt)
test('breaktest.py: tạm thay chuỗi, chạy bộ, trả file lại đúng từng byte rồi chạy lại; báo bắt được hay không; bẻ 0 chỗ thì không chạy', t => {
  const dir = prototype(t);
  assert.ok(fs.existsSync(path.join(dir, '_qa', 'breaktest.py')), 'qa_init.py chép breaktest.py');
  const cfgf = path.join(dir, '_qa', 'qa.config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgf, 'utf8'));
  cfg.suites.push(['tinh-nang-an-1440', 'index', 'tinh-nang-an', 'desktop']);
  fs.writeFileSync(cfgf, JSON.stringify(cfg, null, 1));
  fs.writeFileSync(path.join(dir, '_qa', 'steps-tinh-nang-an.json'), JSON.stringify({ steps: [
    { name: 'phu-dinh-an-nut-xoa', check: "document.querySelector('#xoa') ? 'FAIL: khách thấy nút Xoá' : 'PASS'" }] }));
  const page = path.join(dir, 'site', 'index.html');
  const orig = fs.readFileSync(page);
  const bt = (...a) => {
    const x = spawnSync(PYTHON, [path.join('_qa', 'breaktest.py'), ...a], { cwd: dir, encoding: 'utf8', timeout: 300000 });
    return { ...x, stdout: x.stdout.replace(/\r\n/g, '\n') };
  };

  const zero = bt('tinh-nang-an', 'site/index.html', 'không có chuỗi này', 'x');
  assert.equal(zero.status, 2, zero.stdout + zero.stderr);
  assert.match(zero.stdout, /^Bẻ 0 chỗ trong site\/index\.html: chuỗi cũ không có trong file\. Không chạy\.$/m);
  assert.ok(fs.readFileSync(page).equals(orig));
  assert.equal(bt('khong-co-bo', 'site/index.html', 'Nội dung mẫu.', 'x').status, 2);

  const r = bt('tinh-nang-an', 'site/index.html', '<p>Nội dung mẫu.</p>', '<p>Nội dung mẫu.</p><button id="xoa">Xoá</button>');
  if (/Không tìm thấy Edge/.test(r.stdout + r.stderr)) return t.skip('không có trình duyệt');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^Bẻ 1 chỗ trong site\/index\.html$/m);
  assert.match(r.stdout, /^Khi bẻ:\n {2}tinh-nang-an-1440: 1 bước · [^\n]*FAIL 1 \['phu-dinh-an-nut-xoa'\]/m);
  assert.match(r.stdout, /^Sau khi trả lại \(file khớp bản gốc\):\n {2}tinh-nang-an-1440: 1 bước · [^\n]*FAIL 0 /m);
  assert.match(r.stdout, /^Kết luận: BẮT ĐƯỢC · khi bẻ FAIL 1 \(phu-dinh-an-nut-xoa\), trả lại FAIL 0$/m);
  assert.ok(fs.readFileSync(page).equals(orig), 'file trả lại đúng từng byte');

  const miss = bt('tinh-nang-an', 'site/index.html', 'Nội dung mẫu.', 'Nội dung khác.');
  assert.equal(miss.status, 1, miss.stdout + miss.stderr);
  assert.match(miss.stdout, /^Kết luận: KHÔNG BẮT ĐƯỢC · khi bẻ FAIL 0: bước phủ định không canh chỗ vừa bẻ$/m);
  assert.ok(fs.readFileSync(page).equals(orig));
});

// Sáu chỗ sửa sau lần đo ba skill sửa (05/10/2026)
test('tweak-site: chưa có FEATURE-DECISIONS.md thì tạo từ khuôn trong lượt tìm; grep chỉ trong thư mục trang; chọn lát theo tiêu đề', () => {
  const s3 = section(TWEAK(), '## 3. Quy trình', '## 4.');
  const find = section(s3, '2. **Tìm**', '3. **');
  assert.match(find, /`grep -rn "<chuỗi>" <thư-mục-trang>`/);
  assert.match(find, /không quét `concept\/`/);
  // Cả 4 lần tweak đo được phải tra khuôn ở evolve-site (rtm2 cat cả hai SKILL.md, 29k)
  const mk = "[ -f FEATURE-DECISIONS.md ] || sed '/^## Tính năng/,$d' <skills>/evolve-site/templates/FEATURE-DECISIONS.md > FEATURE-DECISIONS.md";
  assert.ok(find.includes(mk), 'lệnh tạo FEATURE-DECISIONS.md');
  const head = read('evolve-site/templates/FEATURE-DECISIONS.md').split(/^## Tính năng/m)[0];
  assert.match(head, /^## Nhật ký thay đổi nhỏ$/m);
  assert.match(head, /^\| <dd\/mm\/yyyy> \|/m);
  assert.match(section(s3, '8. **Ghi một dòng**', '9. **'), /thay dòng mẫu `<dd\/mm\/yyyy>`/);
  assert.match(section(s3, '6. **Cấp 1: xem một ảnh**', '7. **'), /lát có tiêu đề của khối vừa sửa trong ngoặc/);
});

test('evolve-site B4: bẻ thử bằng breaktest.py, sau vòng sửa chỉ mở ảnh đổi; regression-qa mục 3 dùng cùng lệnh', () => {
  const b4 = section(E2(), '### B4', '### 🛑 Cổng 3');
  assert.match(b4, /python _qa\/breaktest\.py <bộ của tính năng> <file> "<chuỗi cũ>" "<chuỗi mới>"/);
  assert.match(b4, /đổi so với lần chụp trước/);
  assert.match(b4, /tiêu đề trong ngoặc/);
  assert.match(section(read('evolve-site/references/regression-qa.md'), '## 3.', '\n\nKhông thêm'), /python _qa\/breaktest\.py/);
});

test('handover-check: dòng Ảnh lối vào luôn có ở ledger; nợ cũ, bộ mới, bộ mất đọc từ kết quả, không mở handover.json; chọn lát theo tiêu đề', () => {
  const md = HAND();
  assert.match(section(md, '### B1', '### B2'), /[Dd]òng `Ảnh lối vào` luôn có/);
  const b4 = section(md, '### B4', '### B5');
  assert.match(b4, /`nợ cũ n` ở dòng của từng theme/);
  assert.match(b4, /không cần mở `handover\.json`/);
  assert.match(section(md, '### B5', '### B6'), /tiêu đề trong ngoặc/);
});

// Đo ba skill sửa: "trừ màn đã chấm trong evolve Cấp 2–3" đọc được hai cách với site một trang. Bản cũ bỏ cả phần của lần tweak
// (trang chủ đã chấm trong đợt evolve sau đó), bản mới chấm phần đó; một lần tốn 35k để tra qa-gate.md xem có chấm _system không
test('handover-check B5: chấm phần của mọi lần tweak, bỏ phần evolve Cấp 2–3 đã chấm ở Cổng 3, không chấm _system.html', () => {
  const b5 = section(HAND(), '### B5', '### B6');
  assert.match(b5, /phần của mọi lần `tweak`[^\n]*kể cả khi trang chứa nó sau đó có đợt `evolve-site`/);
  assert.match(b5, /phần của đợt `evolve-site` Cấp 2–3: bỏ, đã chấm ở Cổng 3/);
  assert.match(b5, /không chấm `_system\.html`/);
  assert.doesNotMatch(b5, /\*\*trừ\*\* màn đã chấm/);
  // tweak-site hứa dồn UX sang handover-check: lời hứa đó phải còn
  assert.match(section(TWEAK(), '## 4. Không làm ở đây', '## 5.'), /UX 12 điểm/);
});

// Năm chỗ sửa sau lần đo lại (05/10/2026, rts1 · res1 · rhs1)
test('handover-check: B0 không ls, B2 không find, B6 ghi bù DESIGN.md cho lần tweak và đếm chỗ dùng bằng handover.py usage', () => {
  const md = HAND();
  assert.match(section(md, '### B0', '### B1'), /[Kk]hông cần `ls`/);
  const b2 = section(md, '### B2', '### B3');
  assert.match(b2, /dòng `Trang tổng quan app` của `ledger`/);
  assert.match(b2, /[Kk]hông đi tìm bằng `find`/);
  const b6 = section(md, '### B6', '### 🛑 Cổng');
  assert.ok(b6.includes('python _qa/handover.py usage <lớp>'), 'B6 đếm bằng handover.py usage');
  assert.match(b6, /[Đđ]ừng `grep -o` tên lớp/);
  // rhs1 tốn hai lượt (24k) tra tweak-site để biết việc ghi bù DESIGN.md có thuộc B6 không
  assert.match(b6, /dòng `tweak:`[^\n]*icon mới[^\n]*sơ đồ trang[^\n]*số chỗ gọi/);
  assert.match(section(TWEAK(), '## 4. Không làm ở đây', '## 5.'), /cập nhật `DESIGN\.md` \*\(icon mới, sơ đồ trang, số chỗ gọi\)\*/);
});

test('tweak-site: thêm thành phần cạnh thành phần có sẵn thì đọc CSS của trang trong lượt đọc', () => {
  // Cả 3 lần tweak bản mới đọc 2–3 lượt: cờ C chỉ lộ ra khi xem CSS, rồi thêm một lượt Read để Edit được
  const read3 = section(section(TWEAK(), '## 3. Quy trình', '## 4.'), '3. **Đọc**', '4. **Sửa**');
  assert.match(read3, /cạnh một thành phần có sẵn[^\n]*CSS dùng chung của trang/);
  assert.match(read3, /cờ C/);
});

test('evolve-site: lệnh 1 tìm nguồn yêu cầu cả trong DECISIONS.md, CONCEPT.md của prototype; Cổng 2 đã chỉ định thì bỏ ma trận', () => {
  // Cả 3 lần evolve bản mới grep tài liệu với --exclude-dir=prototypes, không thấy nguồn, phải đọc nguyên DECISIONS.md
  const l1 = section(section(EVO(), '## 3.', '\n## 4.'), 'Lệnh 1', '```bash');
  assert.match(l1, /`\$P\/DECISIONS\.md`, `\$P\/CONCEPT\.md`/);
  assert.match(l1, /đừng `--exclude-dir` cả thư mục prototype/);
  const b2 = section(E1(), '### B2', '### 🛑 Cổng 2');
  assert.match(b2, /\*\*Cổng 2 đã chỉ định tường minh\*\*/);
  const calls = sedCalls(b2).filter(c => c.file.endsWith('integration-patterns.md'));
  assert.equal(calls.length, 2, 'in mục 2 (web) hoặc mục 3 (app) của integration-patterns.md');
  assert.ok(b2.includes("sed -n '/^## Tính năng/,$p' <skills>/evolve-site/templates/FEATURE-DECISIONS.md"), 'in khuôn khối tính năng');
  assert.match(b2, /lượt vào 2/);
});

test('bốn SKILL.md dựng và sửa site, cùng AGENTS-qa.md, ghi PYTHONIOENCODING=utf-8 cho lệnh python in tiếng Việt; AGENTS-qa.md có breaktest.py', () => {
  for (const f of ['evolve-site/SKILL.md', 'tweak-site/SKILL.md', 'handover-check/SKILL.md', 'sketch-to-site/SKILL.md', 'sketch-to-site/templates/AGENTS-qa.md']) {
    assert.match(read(f), /PYTHONIOENCODING=utf-8/, f);
  }
  assert.match(read('sketch-to-site/templates/AGENTS-qa.md'), /python _qa\/breaktest\.py/);
  assert.ok(EVO().length <= 18000);
});

test('CHANGELOG 1.5.0 ghi phiên bản mới của ba skill và các lệnh mới', () => {
  const latest = fs.readFileSync(path.join(SKILLS, '..', 'CHANGELOG.md'), 'utf8').split(/^## /m).find(s => s.startsWith('1.5.0 ('));
  assert.ok(latest, 'CHANGELOG thiếu mục 1.5.0');
  for (const s of ['`evolve-site` 1.9', '`tweak-site` 1.3', '`handover-check` 1.3', 'references/b1-b2.md', 'quick.py --shots', 'handover.py ledger', 'evolve-site` 1.1–1.3',
    'breaktest.py', '"slices": "all"', 'slices.json', 'PYTHONIOENCODING=utf-8', 'handover.py usage', 'Trang tổng quan app']) {
    assert.ok(latest.includes(s), `CHANGELOG 1.5.0 thiếu ${s}`);
  }
});
