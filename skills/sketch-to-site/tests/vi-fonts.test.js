// Kiểm preflight.py --vi-fonts: tra font Google có dấu tiếng Việt theo loại và từ khoá.
// Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PREFLIGHT = path.resolve(__dirname, '..', 'scripts', 'preflight.py');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const pf = (...a) => spawnSync(PYTHON, [PREFLIGHT, '--vi-fonts', ...a], { encoding: 'utf8', env });
const names = out => out.split('\n').map(l => l.trimEnd()).filter(l => l.startsWith('  ')).map(l => l.trim().split(' · ')[0]);
// Không từ khoá: mọi font của loại, nhiều tên một dòng, cách nhau " · "; font không có độ đậm từ 600 ghi kèm [độ đậm nó có]
const entries = out => out.split('\n').map(l => l.trimEnd()).filter(l => l.startsWith('  ')).flatMap(l => l.trim().split(' · '));
const bare = e => e.replace(/ \[[\d,–]+\]$/, '');

// Đo 1.4 sau đợt sửa cuối: cả 4 lần chạy đoán từ khoá font ra 0 kết quả (marker, typewriter, rough, signage, wedge…), mất 1–3 lượt.
// Không từ khoá thì in đủ tên của loại theo vần (Display 88 font khoảng 1,4k ký tự): agent chọn theo tên và nét chữ trong một lần in
test('--vi-fonts serif không từ khoá: in đủ mọi font serif có dấu, theo vần; font nào cũng qua --font', () => {
  const r = pf('serif');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const list = entries(r.stdout).map(bare);
  assert.equal(list.length, n(r), r.stdout);
  assert.ok(list.length > 60, `${list.length} font`);
  assert.deepEqual(list, [...list].sort((a, b) => a.localeCompare(b, 'en')), 'xếp theo vần');
  assert.doesNotMatch(r.stdout, /^Tiếp theo: |^Còn \d+ font/m, 'không từ khoá thì không cắt danh sách');
  const check = spawnSync(PYTHON, [PREFLIGHT, '--font', ...list], { encoding: 'utf8', env });
  assert.equal(check.status, 0, check.stdout);
  for (const l of check.stdout.split('\n').map(x => x.trimEnd()).filter(Boolean)) assert.match(l, / VI {2}Serif · độ đậm [\d,–]+$/);
});

const n = r => +r.stdout.match(/^(\d+) font/)[1];

test('--vi-fonts không từ khoá: font không có độ đậm từ 600 ghi kèm độ đậm nó có; font lỗi dấu bị bỏ, font lưu ý có dòng lưu ý', () => {
  const h = entries(pf('handwriting').stdout);
  assert.ok(h.includes('Patrick Hand [400]'), h.join(' · '));
  const s = entries(pf('sans').stdout);
  assert.ok(s.includes('Archivo'), 'font có đủ độ đậm thì chỉ ghi tên');
  const d = pf('display');
  assert.ok(!entries(d.stdout).map(bare).includes('Big Shoulders Stencil'));
  assert.match(d.stdout, /^Bỏ khỏi danh sách \(dấu khó đọc\): [^\n]*Big Shoulders Stencil/m);
  const m = pf('mono');
  assert.ok(entries(m.stdout).map(bare).includes('Xanh Mono'));
  assert.match(m.stdout, /^Lưu ý: Xanh Mono: /m);
});

// Mã thoát 1 khi không khớp làm cả lệnh gộp thành kết quả lỗi, mà kết quả lỗi bị cắt ở giữa còn khoảng 10k ký tự:
// đo vòng 1 lần B mất bảng màu của search.py chạy chung lệnh, phải chạy lại. Tra cứu không khớp không phải lỗi
test('--vi-fonts lọc theo từ khoá; không khớp vẫn thoát 0 và in 0 font; loại sai thì thoát 2', () => {
  const all = pf('sans'), some = pf('sans', 'italic');
  assert.ok(n(some) > 0 && n(some) < n(all), `${n(some)} / ${n(all)}`);
  const none = pf('mono', 'khongcotukhoanay');
  assert.equal(none.status, 0);
  assert.match(none.stdout, /^0 font Monospace/m);
  assert.equal(pf('gothic').status, 2);
});

test('--font lặp cờ được (như --vi-fonts) và ghi độ đậm của font', () => {
  const r = spawnSync(PYTHON, [PREFLIGHT, '--font', 'Archivo', '--font', 'Patrick Hand', 'Newsreader'], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /^Archivo\s+VI\s+Sans Serif · độ đậm 100–900$/m);
  assert.match(r.stdout, /^Patrick Hand\s+VI\s+Handwriting · độ đậm 400$/m);
  assert.match(r.stdout, /^Newsreader\s+VI\s+Serif · độ đậm 200–800$/m);
});

// Đo lại vòng 2: "Hand", "Grotesque" là thẻ chung, khớp gần hết font cùng loại; agent tra lại mấy lượt mới biết.
// Cách ở giữa (người dùng chọn): vẫn khớp tên hoặc thẻ, nhưng bỏ thẻ có ở từ 75 % font cùng loại trở lên
test('--vi-fonts: thẻ chung của loại bị bỏ qua, chỉ khớp tên font; có lời nhắc', () => {
  const broad = pf('sans', 'grotesque');
  assert.equal(broad.status, 0);
  assert.deepEqual(names(broad.stdout).sort(), ['Bricolage Grotesque', 'Darker Grotesque']);
  assert.match(broad.stdout, /^Lưu ý: "grotesque" là thẻ chung/m);
  assert.ok(!names(broad.stdout).some(x => /thẻ chung/.test(x)), 'lời nhắc không được đọc thành tên font');
  const none = pf('sans', 'geometric');
  assert.equal(n(none), 0, 'thẻ chung không khớp tên nào thì ra 0 font, không trả gần hết danh sách');
  assert.match(none.stdout, /^Lưu ý: "geometric" là thẻ chung/m);
  assert.doesNotMatch(pf('sans', 'italic').stdout, /thẻ chung/);
  assert.doesNotMatch(pf('sans').stdout, /thẻ chung/);
});

test('--vi-fonts: thẻ riêng vẫn lọc được (font không có chữ đó trong tên), và in thẻ riêng thay cho thẻ chung', () => {
  const r = pf('serif', 'slab');
  assert.equal(r.status, 0);
  for (const f of ['Aleo', 'Rokkitt', 'Roboto Slab']) assert.ok(names(r.stdout).includes(f), `thiếu ${f}`);
  // Dòng font chỉ in thẻ chia được danh sách: không còn chuỗi thẻ chung "classic … elegant"
  const lines = r.stdout.split('\n').filter(l => l.startsWith('  '));
  assert.ok(lines.length > 0 && lines.every(l => !/\b(classic|elegant|editorial)\b/.test(l)), lines.join('\n'));
});

// Ví dụ từ khoá trong tài liệu thành lựa chọn mặc định: Task 9 của 1.4 đo được hai lần chạy dùng đúng hai từ khoá ví dụ
test('tài liệu chỉ ghi chỗ điền "<từ khoá>", không nêu từ khoá cụ thể', () => {
  const docs = [path.resolve(__dirname, '..', 'scripts', 'preflight.py'), path.resolve(__dirname, '..', 'SKILL.md'),
    ...['SKILL.md', 'references/vong-dau.md', 'references/concept-method.md', 'references/vong-moi.md'].map(f => path.resolve(__dirname, '..', '..', 'sketch-to-concept', f))];
  for (const f of docs) {
    const s = require('node:fs').readFileSync(f, 'utf8');
    assert.deepEqual([...s.matchAll(/--vi-fonts \S+ "([^"<>]+)"/g)].map(m => m[0]), [], `${path.basename(f)} còn lệnh --vi-fonts với từ khoá cụ thể`);
    assert.deepEqual(s.match(/\b(condensed|slab|didone|oldstyle)\b/g) || [], [], `${path.basename(f)} còn nêu từ khoá làm ví dụ`);
  }
});

// Đo 1.4 sau 5 đề xuất: vòng 1 tra font 6 lượt, mỗi lượt một vòng lặp shell; 3 lần ra 0 vì đoán sai loại
// (từ khoá có ở sans mà tra trong display); một lượt đọc mã preflight.py để tìm cách in hơn 15 font
test('--vi-fonts lặp lại được trong một lệnh: mỗi nhóm một lần tra, cách nhau một dòng trống', () => {
  const r = spawnSync(PYTHON, [PREFLIGHT, '--vi-fonts', 'sans', 'italic', '--vi-fonts', 'mono'], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const heads = r.stdout.split('\n').filter(l => /^\d+ font /.test(l));
  assert.equal(heads.length, 2, r.stdout);
  assert.match(heads[0], /Sans Serif[^\n]*khớp "italic"/);
  assert.match(heads[1], /Monospace/);
  assert.match(r.stdout, /\r?\n\r?\n\d+ font Monospace/);
  const miss = spawnSync(PYTHON, [PREFLIGHT, '--vi-fonts', 'mono', '--vi-fonts', 'mono', 'khongcotukhoanay'], { encoding: 'utf8', env });
  assert.equal(miss.status, 0, 'một nhóm không khớp vẫn thoát 0');
  assert.match(miss.stdout, /^0 font Monospace/m);
});

test('--vi-fonts không khớp trong loại đã chọn thì in loại khác có khớp', () => {
  const r = pf('display', 'condensed');
  assert.equal(r.status, 0);
  const sans = n(pf('sans', 'condensed'));
  assert.match(r.stdout, new RegExp(`^Loại khác có khớp: [^\\n]*sans ${sans}\\b`, 'm'));
  assert.doesNotMatch(pf('mono', 'khongcotukhoanay').stdout, /Loại khác/);
});

test('--vi-fonts có từ khoá: in 15 font kèm độ đậm và thẻ, rồi tên của tối đa 45 font tiếp theo trên một dòng', () => {
  const r = pf('sans', 'variable');
  assert.equal(names(r.stdout).length, 15);
  for (const l of r.stdout.split('\n').filter(x => x.startsWith('  '))) assert.match(l, /^ {2}[^·]+ · độ đậm [\d,–]+ · /);
  const next = r.stdout.split('\n').find(l => l.startsWith('Tiếp theo: '));
  assert.ok(next, r.stdout);
  assert.equal(next.slice('Tiếp theo: '.length).split(' · ').length, 45);
  assert.match(r.stdout, new RegExp(`^Còn ${n(r) - 60} font: thêm từ khoá để lọc\\.$`, 'm'));
  assert.doesNotMatch(pf('mono', 'mono').stdout, /^Còn /m, 'ít font: in hết, không còn');
});

test('tài liệu nói thẻ chung (từ 75 % font cùng loại) bị bỏ qua', () => {
  const docs = [path.resolve(__dirname, '..', 'scripts', 'preflight.py'), path.resolve(__dirname, '..', 'SKILL.md'),
    ...['references/vong-dau.md', 'references/concept-method.md'].map(f => path.resolve(__dirname, '..', '..', 'sketch-to-concept', f))];
  for (const f of docs) assert.match(require('node:fs').readFileSync(f, 'utf8'), /75 %/, `${path.basename(f)} chưa nói ngưỡng thẻ chung`);
});

// Đo 1.4 sau gộp lượt: 3/4 lần chạy gặp font có subset vietnamese mà dấu đọc sai, bộ kiểm vẫn cho qua; agent mất 2 lượt dựng trang thử.
// Đã chụp xác nhận: Big Shoulders Stencil vẽ dấu hỏi gần như dấu huyền (Củi thành Cùi); Intel One Mono vỡ chữ hoa có dấu;
// Xanh Mono dùng số kiểu cổ (3 và 5 dễ lẫn) và thiếu ₫
const fontCheck = (...names) => spawnSync(PYTHON, [PREFLIGHT, '--font', ...names], { encoding: 'utf8', env });

test('font dấu khó đọc: --font báo lỗi (thoát 1) hoặc lưu ý; font thường không bị gì', () => {
  for (const f of ['Big Shoulders Stencil', 'Intel One Mono']) {
    const r = fontCheck(f);
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, new RegExp(`^${f}\\s+VI\\s+\\S[^\\n]*· dấu khó đọc: `, 'm'));
  }
  const x = fontCheck('Xanh Mono');
  assert.equal(x.status, 0, x.stdout);
  assert.match(x.stdout, /^Xanh Mono\s+VI\s+Monospace · độ đậm 400 · lưu ý: /m);
  const ok = fontCheck('Saira Stencil');
  assert.equal(ok.status, 0);
  assert.doesNotMatch(ok.stdout, /dấu khó đọc|lưu ý/);
});

// Đo 1.4 sau đợt sửa thứ tư: cả hai lần vòng 2 chọn Big Shoulders bản thường; tên tiệm cỡ nhỏ đọc "Lò Bánh Cùi", mất 35–60k mỗi lần.
// Đã chụp phóng to: bản thường vẽ dấu hỏi là một nét hẹp đứng như bản Stencil; bản Inline vẽ móc cong, khác dấu huyền
test('font dấu khó đọc: Big Shoulders bản thường bị chặn như bản Stencil; bản Inline vẫn dùng được', () => {
  const r = fontCheck('Big Shoulders');
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /^Big Shoulders\s+VI\s+\S[^\n]*· dấu khó đọc: [^\n]*Cùi/m);
  assert.equal(fontCheck('Big Shoulders Inline').status, 0);
  const d = pf('display');
  const list = entries(d.stdout).map(bare);
  assert.ok(!list.includes('Big Shoulders'), d.stdout);
  assert.ok(list.includes('Big Shoulders Inline'), d.stdout);
  assert.match(d.stdout, /^Bỏ khỏi danh sách \(dấu khó đọc\): (?:[^\n]* · )?Big Shoulders(?: · |\r?$)/m);
});

// Đo 1.4 sau đợt sửa thứ năm: cả hai lần vòng 1 chọn Vina Sans cho vai display; một lần thấy tiêu đề 36px đọc "Mì" thành "Mī"
// và đổi font sau khi chụp. Đã chụp 24–96px: chữ i là chữ I có chân ngang, dấu huyền và dấu sắc trên i dính vào chân ngang
// tới khoảng 48px (MÌ, PHÍ đọc như MI, MĪ); dấu trên các chữ khác đọc đúng
test('font dấu khó đọc: Vina Sans bị chặn (dấu trên i dính chân ngang)', () => {
  const r = fontCheck('Vina Sans');
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /^Vina Sans\s+VI\s+\S[^\n]*· dấu khó đọc: [^\n]*Mì/m);
  const d = pf('display');
  assert.ok(!entries(d.stdout).map(bare).includes('Vina Sans'), d.stdout);
  assert.match(d.stdout, /^Bỏ khỏi danh sách \(dấu khó đọc\): (?:[^\n]* · )?Vina Sans(?: · |\r?$)/m);
});

test('font dấu khó đọc: --vi-fonts bỏ font lỗi khỏi danh sách và nói đã bỏ; font lưu ý thì ghi lưu ý trên dòng của nó', () => {
  const r = pf('display', 'stencil');
  assert.ok(!names(r.stdout).includes('Big Shoulders Stencil'), r.stdout);
  assert.ok(names(r.stdout).includes('Saira Stencil'), r.stdout);
  assert.match(r.stdout, /^Bỏ khỏi danh sách \(dấu khó đọc\): [^\n]*Big Shoulders Stencil/m);
  assert.equal(n(r), names(r.stdout).length, 'số đếm ở dòng đầu không tính font đã bỏ');
  const m = pf('mono', 'xanh');
  assert.match(m.stdout, /^ {2}Xanh Mono · [^\n]*· lưu ý: /m);
});

test('font dấu khó đọc: preflight trên trang báo P07 lỗi; qa-gate.md ghi P07 gồm cả dấu đọc sai', () => {
  const fs = require('node:fs'), os = require('node:os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vi-font-issue-'));
  try {
    fs.writeFileSync(path.join(dir, 'a.html'), `<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil:wght@700&display=swap" rel="stylesheet">
<style>h1{font-family:'Big Shoulders Stencil',sans-serif}</style></head><body><h1>Lò bánh củi mở cửa</h1></body></html>`);
    const r = spawnSync(PYTHON, [PREFLIGHT, dir], { encoding: 'utf8', env });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /P07\s+LỖI\s+[^\n]*dấu khó đọc[^\n]*Big Shoulders Stencil|P07\s+LỖI\s+[^\n]*Big Shoulders Stencil[^\n]*dấu khó đọc/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  const gate = require('node:fs').readFileSync(path.resolve(__dirname, '..', 'references', 'qa-gate.md'), 'utf8');
  assert.match(gate.split(/\r?\n/).find(l => l.startsWith('| `P07`')), /dấu khó đọc/);
});
