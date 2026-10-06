// Kiểm scripts/sources.py (M0): chuyển tài liệu về chữ có số dòng cố định, mục lục, tự dò hệ mã (kể cả mã theo miền), nhận bộ BA,
// trạng thái và bước chuyển trong schema.dbml, đề xuất cách đọc theo cỡ. Tài liệu mẫu sinh trong test (không dùng đề đo r7-map).
// Chạy: node --test skills/sketch-to-map/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SOURCES = path.resolve(__dirname, '..', 'scripts', 'sources.py');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

const USE_CASE = `# Đặc tả use case · Nha khoa Mộc

## Quy ước
- Mã use case UC-xx, quy tắc BR-<miền>-xx, quy tắc thanh toán theo miền TT-xx.
- Ưu tiên: Must, Should, Could.

## UC-01 · Đặt lịch hẹn
Lễ tân đặt lịch theo BR-LH-01 và BR-LH-02. Ghế đã có hẹn thì không chọn được (TT-02 không áp).

## UC-02 · Xem lịch theo ngày
Bác sĩ chỉ thấy lịch của mình (BR-LH-02).

## UC-03 · Dời và huỷ hẹn
Theo BR-LH-03. Bệnh nhân mã KH-0412 là ví dụ.

### 3a · Huỷ muộn
Huỷ trong 2 giờ thì tính lỡ hẹn (TT-01).
`;
const RULES = `# Quy tắc nghiệp vụ

| Mã | Quy tắc |
|---|---|
| BR-LH-01 | Mỗi ghế một hẹn mỗi khung giờ |
| BR-LH-02 | Bác sĩ chỉ thấy lịch của mình |
| BR-LH-03 | Dời hẹn trước 2 giờ |
| TT-01 | Huỷ muộn tính lỡ hẹn |
| TT-02 | Hoàn tiền chỉ quản lý duyệt |
| TT-03 | Trả góp theo kế hoạch điều trị |

Như TT-01 đã nêu, lỡ hẹn ba lần thì khoá đặt trên app.
`;
const SCHEMA = `// Schema mẫu
Table lich_hen {
  id uuid [pk]
  trang_thai trang_thai_hen [not null]
}
Enum trang_thai_hen {
  da_dat
  da_toi [note: 'da_dat -> da_toi khi lễ tân tiếp nhận']
  lo_hen [note: 'da_dat → lo_hen khi quá giờ 30 phút']
  da_huy
}
`;

// .docx và .xlsx tối thiểu dựng bằng zipfile của Python (đúng cách sources.py đọc)
function office(dir) {
  const py = String.raw`
import sys, zipfile, os
d = sys.argv[1]
W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
def p(text, style=None):
    s = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ''
    return f'<w:p>{s}<w:r><w:t xml:space="preserve">{text}</w:t></w:r></w:p>'
body = p('Yêu cầu hệ thống', 'Heading1') + p('YC-01 Đăng nhập bằng số điện thoại') + p('Kế hoạch', 'Heading2') + p('YC-02 và YC-03 làm sau')
row = lambda *cs: '<w:tr>' + ''.join(f'<w:tc>{p(c)}</w:tc>' for c in cs) + '</w:tr>'
body += f'<w:tbl>{row("Mã", "Nội dung")}{row("YC-01", "Đăng nhập")}{row("YC-02", "Đổi mật khẩu")}{row("YC-03", "Khoá tài khoản")}</w:tbl>'
with zipfile.ZipFile(os.path.join(d, 'YEU-CAU.docx'), 'w') as z:
    z.writestr('word/document.xml', f'<?xml version="1.0" encoding="UTF-8"?><w:document {W}><w:body>{body}</w:body></w:document>')
S = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
with zipfile.ZipFile(os.path.join(d, 'UU-TIEN-PHAM-VI.xlsx'), 'w') as z:
    z.writestr('xl/workbook.xml', f'<workbook {S} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Phạm vi" sheetId="1" r:id="rId1"/></sheets></workbook>')
    z.writestr('xl/_rels/workbook.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="x"/></Relationships>')
    z.writestr('xl/sharedStrings.xml', f'<sst {S}><si><t>Mã</t></si><si><t>Mức</t></si><si><t>UC-01</t></si><si><t>Must</t></si><si><t>UC-03</t></si><si><t>Should</t></si></sst>')
    cell = lambda r, c, i: f'<c r="{c}{r}" t="s"><v>{i}</v></c>'
    rows = ''.join(f'<row r="{r}">{cell(r, "A", a)}{cell(r, "B", b)}</row>' for r, a, b in [(1, 0, 1), (2, 2, 3), (3, 4, 5)])
    z.writestr('xl/worksheets/sheet1.xml', f'<worksheet {S}><sheetData>{rows}</sheetData></worksheet>')
`;
  const r = spawnSync(PYTHON, ['-c', py, dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}

function run(t, extra = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sources-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const docs = path.join(root, 'docs');
  fs.mkdirSync(docs);
  const files = { 'USE-CASE-DEMO.md': USE_CASE, 'BUSINESS-RULES-DEMO.md': RULES, 'schema.dbml': SCHEMA, ...extra };
  for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(docs, f), s);
  office(docs);
  const proto = path.join(root, 'proto');
  const r = spawnSync(PYTHON, [SOURCES, docs, proto], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: '' } });
  const j = f => JSON.parse(fs.readFileSync(path.join(proto, 'map', f), 'utf8'));
  return { r, out: r.stdout + r.stderr, proto, j };
}

test('sources.py: mỗi tài liệu thành map/_src/D<n>.txt có số dòng như gốc; mục lục có dải dòng; nhận bộ BA', t => {
  const { r, out, proto, j } = run(t);
  assert.equal(r.status, 0, out);
  const s = j('sources.json');
  assert.equal(s.docs.length, 5);
  const uc = s.docs.find(d => d.path.endsWith('USE-CASE-DEMO.md'));
  const txt = fs.readFileSync(path.join(proto, 'map', '_src', `${uc.id}.txt`), 'utf8');
  assert.equal(txt, USE_CASE);
  const sec = uc.toc.find(x => x.title === 'UC-03 · Dời và huỷ hẹn');
  assert.equal(sec.level, 2);
  assert.equal(USE_CASE.split('\n')[sec.start - 1], '## UC-03 · Dời và huỷ hẹn');
  assert.ok(sec.end > sec.start);
  assert.equal(uc.ba, 'USE-CASE');
  assert.equal(s.docs.find(d => d.path.endsWith('.xlsx')).ba, 'UU-TIEN-PHAM-VI');
  assert.equal(s.docs.find(d => d.path.endsWith('schema.dbml')).ba, 'schema.dbml');
  assert.deepEqual(uc.conventions.map(c => c.title), ['Quy ước']);
});

test('sources.py: đọc .docx (tiêu đề, bảng) và .xlsx (từng sheet, từng dòng)', t => {
  const { proto, j } = run(t);
  const s = j('sources.json');
  const doc = s.docs.find(d => d.path.endsWith('.docx'));
  const txt = fs.readFileSync(path.join(proto, 'map', '_src', `${doc.id}.txt`), 'utf8');
  assert.match(txt, /^# Yêu cầu hệ thống$/m);
  assert.match(txt, /^## Kế hoạch$/m);
  assert.match(txt, /^\| YC-02 \| Đổi mật khẩu \|$/m);
  const xl = s.docs.find(d => d.path.endsWith('.xlsx'));
  const xt = fs.readFileSync(path.join(proto, 'map', '_src', `${xl.id}.txt`), 'utf8');
  assert.match(xt, /^## Phạm vi$/m);
  assert.match(xt, /^\| UC-03 \| Should \|$/m);
});

test('sources.py: tự dò hệ mã, kể cả mã theo miền (TT-); mã dữ liệu (KH-0412) không thành hệ mã; ghi chỗ định nghĩa và chỗ nhắc', t => {
  const { out, j } = run(t);
  const ids = j('ids.json');
  for (const p of ['UC', 'BR', 'TT', 'YC']) assert.ok(ids.systems[p], `${p}: ${JSON.stringify(Object.keys(ids.systems))}`);
  assert.ok(!ids.systems.KH);
  assert.deepEqual(ids.systems.BR.domains, ['LH']);
  const tt1 = ids.ids['TT-01'];
  assert.match(tt1.def, /^D\d+:\d+$/);
  assert.ok(tt1.refs.length >= 2, JSON.stringify(tt1));
  assert.match(out, /^Hệ mã: .*UC \(3 định nghĩa\).*TT \(3 định nghĩa\)/m);
});

test('sources.py: trạng thái và bước chuyển trong schema.dbml (cả -> và →) vào states.json', t => {
  const { out, j } = run(t);
  const st = j('states.json');
  assert.deepEqual(st.enums.trang_thai_hen.values, ['da_dat', 'da_toi', 'lo_hen', 'da_huy']);
  assert.deepEqual(st.transitions.map(x => `${x.enum}:${x.from}>${x.to}`), ['trang_thai_hen:da_dat>da_toi', 'trang_thai_hen:da_dat>lo_hen']);
  assert.match(out, /2 bước chuyển/);
});

// Đề đo r8-map-lon: phụ lục dữ liệu xuất từ Excel có 750 mã học viên ở cột đầu bảng; quy tắc nhắc định dạng "dạng SX-0001".
// Trước khi sửa, SX thành hệ mã 750 định nghĩa: ids.json 89 KB và P24 báo mã học viên hiển thị trên trang là mã tham chiếu lộ ra
test('sources.py: phụ lục dữ liệu (từ 50 mã chỉ nằm trong bảng) là mã của dữ liệu, không phải hệ mã; hệ mã yêu cầu dù chỉ trong bảng vẫn giữ', t => {
  const rows = Array.from({ length: 60 }, (_, i) => `| HS-${String(i + 1).padStart(4, '0')} | Học sinh ${i + 1} | 09${String(10000000 + i)} |`).join('\n');
  const data = `# Phụ lục dữ liệu\n\n## Danh sách học sinh\n| Mã | Họ tên | SĐT |\n|---|---|---|\n${rows}\n\n## Thu tiền\n| Ngày | Học sinh |\n|---|---|\n| 01/09 | HS-0001 |\n| 02/09 | HS-0002 |\n`;
  const { out, j } = run(t, { 'PHU-LUC-DU-LIEU.md': data, 'GHI-CHU.md': '# Ghi chú\n\nMã học sinh dạng HS-0001, không đổi.\n' });
  const ids = j('ids.json');
  assert.ok(!ids.systems.HS, `HS không phải hệ mã: ${JSON.stringify(Object.keys(ids.systems))}`);
  assert.deepEqual(ids.data_codes, { HS: 60 });
  assert.ok(!Object.keys(ids.ids).some(id => id.startsWith('HS-')));
  for (const p of ['UC', 'BR', 'TT']) assert.ok(ids.systems[p], p);
  assert.match(out, /^Mã của dữ liệu, không phải hệ mã yêu cầu [^\n]*: HS \(60 mã\)$/m);
  // TT chỉ có 3 mã trong bảng: dưới 50 thì vẫn là hệ mã
  assert.ok(ids.systems.TT.defs >= 3);
});

test('sources.py: cỡ nhỏ thì đề xuất đọc nguyên một lượt; vượt ngưỡng thì chia worker theo module', t => {
  assert.match(run(t).out, /^Cách đọc: đọc nguyên trong một lượt/m);
  const big = '# Phụ lục\n' + Array.from({ length: 4000 }, (_, i) => `## Mục ${i}\n${'Nội dung dài của mục để vượt ngưỡng đọc nguyên. '.repeat(2)}\n`).join('');
  assert.match(run(t, { 'PHU-LUC.md': big }).out, /^Cách đọc: chia worker/m);
});

test('sources.py: file không đọc được (pdf khi không có công cụ, định dạng lạ) được nêu tên, thoát 1', t => {
  const { r, out } = run(t, { 'so-do.vsdx': 'x' });
  assert.equal(r.status, 1, out);
  assert.match(out, /CẦN CHUYỂN TAY.*so-do\.vsdx/s);
});

test('sources.py: sai tham số thì thoát 2', () => {
  const r = spawnSync(PYTHON, [SOURCES], { encoding: 'utf8' });
  assert.equal(r.status, 2);
});

// Đo trên một dự án thật: quyết định viết trong backtick (`XD-48`) và định nghĩa ở thư mục khác: vẫn phải thành hệ mã (P24, kiểm kê cần biết)
test('sources.py: mã trong backtick ở đầu ô bảng là định nghĩa; từ 5 mã khác nhau thì thành hệ mã dù chỉ thấy chỗ nhắc', t => {
  const refs = '# Ghi chú\n' + ['01', '02', '03', '04', '05'].map(n => `Theo \`QD-${n}\` thì giữ nguyên.`).join('\n') + '\n\n| Mã | Nội dung |\n|---|---|\n| `GH-01` | Một |\n| `GH-02` | Hai |\nNhắc GH-01 lần nữa.\n';
  const { out, j } = run(t, { 'GHI-CHU.md': refs });
  const sys = j('ids.json').systems;
  assert.equal(sys.QD.defs, 0);
  assert.equal(sys.QD.ids, 5);
  assert.equal(sys.GH.defs, 2);
  assert.match(out, /QD \(5 mã, chỉ thấy chỗ nhắc\)/);
});

// Kiểm kê (map.mjs check) cần: mức ưu tiên của từng mã (Must…) từ file ưu tiên phạm vi, và use case bị loại (không cần chức năng)
test('sources.py: ids.json ghi mức ưu tiên MoSCoW theo file ưu tiên và use case bị loại', t => {
  const { j } = run(t, { 'USE-CASE-DEMO.md': USE_CASE + '\n## UC-04 · Đặt cọc online ⛔ (loại)\nKhông làm.\n' });
  const ids = j('ids.json');
  assert.equal(ids.ids['UC-01'].priority, 'Must');
  assert.equal(ids.ids['UC-03'].priority, 'Should');
  assert.equal(ids.ids['UC-02'].priority, undefined);
  assert.equal(ids.ids['UC-04'].dropped, true);
  assert.equal(ids.ids['UC-01'].dropped, undefined);
});

// Cách viết thứ hai của quy ước tiền tố: bảng Quy ước "| `M-nn` | Must — phải có |" (đề r7-map viết như vậy)
test('sources.py: quy ước tiền tố viết dạng bảng (`M-nn` | Must) cũng được đọc', t => {
  const prio = '# Ưu tiên\n\n## Quy ước\n\n| Tiền tố | Nghĩa |\n|---|---|\n| `M-nn` | Must — phải có |\n| `CO-nn` | Could — có thì tốt |\n\n| Mã | Hạng mục |\n|---|---|\n| M-01 | Đặt lịch |\n| CO-01 | Mã khuyến mãi |\n';
  const { j } = run(t, { 'UU-TIEN-PHAM-VI-v3.md': prio });
  const ids = j('ids.json').ids;
  assert.equal(ids['M-01'].priority, 'Must');
  assert.equal(ids['CO-01'].priority, 'Could');
});

// Một dự án thật ghi mức ưu tiên bằng tiền tố của mã ("23 Must `M-*` · 10 Should `S-*`"): dùng quy ước đó thay cho mức theo dòng
test('sources.py: file ưu tiên ghi mức theo tiền tố (Must `M-*`) thì mọi mã M- là Must; dòng nhắc mã khác không bị gán nhầm', t => {
  const prio = '# Ưu tiên phạm vi\n\n6 Must `M-*` · 2 Should `S-*` · 1 Won\'t `W-*`\n\n| Mã | Nội dung |\n|---|---|\n| `M-01` | Đặt lịch (UC-01) |\n| `M-02` | Thu tiền |\n| `S-01` | Báo cáo |\n| `W-01` | Thanh toán trong app |\n\n| `UC-03` câu hỏi | Must mới `M-02` |\n';
  const { j } = run(t, { 'UU-TIEN-PHAM-VI-v2.md': prio });
  const ids = j('ids.json').ids;
  assert.equal(ids['M-01'].priority, 'Must');
  assert.equal(ids['M-02'].priority, 'Must');
  assert.equal(ids['S-01'].priority, 'Should');
  assert.equal(ids['W-01'].dropped, true);
  assert.notEqual(ids['UC-03'].priority, 'Must');
});
