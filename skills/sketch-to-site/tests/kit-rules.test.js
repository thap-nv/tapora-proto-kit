// Kiểm các luật chung của kit nằm đúng chỗ trong tài liệu các skill.
// Chạy: node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..', '..');
const read = rel => fs.readFileSync(path.join(REPO, rel), 'utf8').replace(/\r\n/g, '\n');
// 4.5: các bước tách khỏi SKILL.md sang hai file theo giai đoạn
const SITE = 'skills/sketch-to-site/SKILL.md';
const R1 = 'skills/sketch-to-site/references/b0-b2.md';
const R2 = 'skills/sketch-to-site/references/b3-b4.md';
// Đoạn từ chỗ có chuỗi `start` tới chỗ có chuỗi `end` kế tiếp (không gồm `end`)
function section(md, start, end) {
  const i = md.indexOf(start);
  assert.ok(i >= 0, `không thấy "${start}"`);
  const j = md.indexOf(end, i + start.length);
  return md.slice(i, j < 0 ? undefined : j);
}

test('khuôn BUILD-LOG có cột và luật làm tiếp', () => {
  const md = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(md, /^\| # \| Trang \/ màn \| File \| Trạng thái \| Kiểm \*\(dòng kết quả thật\)\* \| Ghi chú \|$/m);
  assert.match(md, /Không dựng lại trang đã `xong`/);
  assert.match(md, /mở file thật/);
  assert.match(md, /^## Lần tiếp tục$/m);
});

test('sketch-to-site đọc và ghi BUILD-LOG ở B0, B3, mục 3 và mục 7', () => {
  const md = read(SITE), r2 = read(R2);
  assert.match(section(r2, '### B0 · Làm tiếp', '### B3'), /`BUILD-LOG\.md`/);
  const b3 = section(r2, '### B3 · Dựng đầy đủ', '### B4');
  assert.match(b3, /`templates\/BUILD-LOG\.md`/);
  assert.match(b3, /mở file thật/);
  assert.match(b3, /Không dựng lại trang đã `xong`/);
  assert.match(section(md, '- **Viết đủ, không cắt**', '\n'), /BUILD-LOG\.md/);
  assert.match(section(md, '## 7. Thư mục đầu ra', '## 8.'), /BUILD-LOG\.md/);
});

test('evolve-site Cấp 3 ghi BUILD-LOG', () => {
  const md = read('skills/evolve-site/SKILL.md');
  assert.match(section(md, '### B3 · Dựng tính năng', '### B4'), /- \*\*Cấp 3:\*\*[^\n]*`BUILD-LOG\.md`/);
  assert.match(section(md, 'Sắp hết độ dài thì **không nén**', '\n'), /BUILD-LOG\.md/);
});

test('mọi chỗ nhắc data-clip-ok trong kit đều đòi ghi lý do', () => {
  // Quét mọi tài liệu .md trong skills (trừ test), script Python của bộ kiểm và README; preflight.py là nơi định nghĩa luật nên bỏ qua
  const files = ['README.md'];
  const walk = d => { for (const e of fs.readdirSync(path.join(REPO, d), { withFileTypes: true })) {
    const rel = `${d}/${e.name}`;
    if (e.isDirectory()) { if (e.name !== 'tests') walk(rel); }
    else if (e.name.endsWith('.md') || (d.endsWith('qa-kit') && e.name.endsWith('.py'))) files.push(rel);
  } };
  walk('skills');
  const bad = [];
  for (const f of files) {
    read(f).split(String.fromCharCode(10)).forEach((line, i) => {
      if (line.includes('data-clip-ok') && !/lý do|reason/.test(line)) bad.push(`${f}:${i + 1}`);
    });
  }
  assert.ok(files.length > 20, `chỉ quét được ${files.length} file`);
  assert.deepEqual(bad, []);
  assert.match(read('skills/sketch-to-site/references/qa-gate.md'), /^\| `P18` \| CẢNH BÁO \|/m);
});

test('qa-gate mục 6: nguyên nhân gốc, bảng cấm làm im, dừng sau ba lần', () => {
  const s6 = section(read('skills/sketch-to-site/references/qa-gate.md'), '## 6. Lỗi kiểm: tìm nguyên nhân gốc, không làm im', '\n## 7.');
  assert.match(s6, /python _qa\/run_all\.py _qa\/\.recheck <tên bộ>/);
  assert.match(s6, /^\| Cách làm im \| Làm thay \|$/m);
  for (const cheat of ['`data-clip-ok`', '`overflow: hidden`', '`check`', '`noisy`', '`try {} catch {}`']) assert.ok(s6.includes(cheat), `thiếu ${cheat}`);
  assert.match(s6, /\*\*Ba lần sửa chưa xong thì dừng\.\*\*/);
  assert.match(s6, /lần chạy \*\*sau\*\* khi sửa/);
});

test('B4 của sketch-to-site, evolve-site và bước kiểm của tweak-site trỏ tới qa-gate mục 6', () => {
  assert.match(section(read(R2), '### B4 · Tự kiểm', '### 🛑 Cổng 4'), /`references\/qa-gate\.md` mục 6/);
  assert.match(read('skills/evolve-site/SKILL.md'), /^\| 6 \| [^\n]*qa-gate\.md` mục 6/m);
  assert.match(section(read('skills/tweak-site/SKILL.md'), '4. **Kiểm nhanh**', '5. **'), /qa-gate\.md` mục 6/);
});

test('bảng cớ bỏ cổng giống hệt ở sketch-to-site và sketch-to-concept', () => {
  const block = f => {
    const md = read(f);
    const m = /<!-- luat-dung:co:bat-dau -->\n([\s\S]*?)\n<!-- luat-dung:co:ket-thuc -->/.exec(md);
    assert.ok(m, `${f} thiếu khối bảng cớ`);
    return m[1];
  };
  const site = block('skills/sketch-to-site/SKILL.md');
  assert.equal(block('skills/sketch-to-concept/SKILL.md'), site);
  assert.ok((site.match(/^\| "/gm) || []).length >= 6, 'cần ít nhất 6 cớ');
  assert.match(site, /\*\*Dấu hiệu phải dừng lại:\*\*/);
});

test('evolve-site: kiểm trước, dựng sau ở đầu B3; bẻ thử bước phủ định ở B4', () => {
  const md = read('skills/evolve-site/SKILL.md');
  const b3 = section(md, '### B3 · Dựng tính năng', '### B4');
  assert.match(b3, /\*\*Kiểm trước, dựng sau\*\*/);
  assert.match(b3, /python _qa\/run_all\.py _qa\/\.tdd tinh-nang-<tên>/);
  assert.match(b3, /phủ định/);
  assert.match(md, /^\| 9 \| [^\n]*Kiểm trước, dựng sau[^\n]*phủ định/m);
  const s3 = section(read('skills/evolve-site/references/regression-qa.md'), '## 3. Cho QA lớn theo tính năng', '\n## ');
  assert.match(s3, /trước khi dựng/);
  assert.match(s3, /\*\*Bẻ thử các bước phủ định\*\*/);
});

test('sketch-to-site B4 có review bằng góc nhìn mới, prompt ở qa-gate mục 7', () => {
  const b4 = section(read(R2), '### B4 · Tự kiểm', '### 🛑 Cổng 4');
  assert.match(b4, /5\. \*\*Review bằng góc nhìn mới\*\*[^\n]*`references\/qa-gate\.md` mục 7/);
  assert.match(b4, /không có review độc lập/);
  const s7 = section(read('skills/sketch-to-site/references/qa-gate.md'), '## 7. Review bằng góc nhìn mới', '\n## 8.');
  assert.match(s7, /Chỉ đọc, không sửa file nào/);
  assert.match(s7, /Chặn nghiệm thu · Nên sửa · Nhỏ/);
});

test('rules-and-conflicts mục F và bốn skill trỏ tới nó', () => {
  const f = section(read('skills/sketch-to-site/references/rules-and-conflicts.md'), '## F. Nhận góp ý và yêu cầu sửa', '\n## G.');
  for (let i = 1; i <= 6; i++) assert.match(f, new RegExp(`^${i}[.] [*][*]`, 'm'), `thiếu điểm ${i}`);
  assert.match(f, /Trái \*\*sàn\*\*/);
  assert.match(f, /\*\*đã khoá\*\*/);
  assert.match(section(read(R2), '### 🛑 Cổng 4', '\n---'), /`references\/rules-and-conflicts\.md` mục F/);
  assert.match(section(read('skills/evolve-site/SKILL.md'), '### 🛑 Cổng 3', '\n## '), /rules-and-conflicts\.md` mục F/);
  assert.match(section(read('skills/tweak-site/SKILL.md'), '## 2. Luật không bỏ', '## 3.'), /rules-and-conflicts\.md` mục F/);
  assert.match(read('skills/handover-check/SKILL.md'), /^- \*\*Sửa\*\* → soát danh sách theo `[^`]*rules-and-conflicts\.md` mục F/m);
});

test('sửa sau review: bộ kiểm của tính năng đặt tên theo khổ, không trùng tên', () => {
  const b3 = section(read('skills/evolve-site/SKILL.md'), '### B3 · Dựng tính năng', '### B4');
  assert.match(b3, /"tinh-nang-<tên>-1440"/);
  assert.match(b3, /"tinh-nang-<tên>-390"/);
  assert.doesNotMatch(b3, /\["tinh-nang-<tên>", /);
});

test('sửa sau review: BUILD-LOG theo phạm vi Cổng 3; B0 có đường làm tiếp B3 và đường sang B4', () => {
  const md = read(R2);
  const b0 = section(md, '### B0 · Làm tiếp', '### B3');
  assert.match(b0, /trang trong phạm vi[^\n]*chưa `xong`[^\n]*B3/);
  assert.match(b0, /`xong` hết[^\n]*Cổng 4[^\n]*B4/);
  assert.match(b0, /vẫn làm các dòng còn lại của B0/);
  assert.match(section(md, '### B3 · Dựng đầy đủ', '### B4'), /mỗi trang trong phạm vi đã chốt ở Cổng 3 một dòng/);
  assert.match(read('skills/sketch-to-site/templates/BUILD-LOG.md'), /Chỉ gồm trang trong phạm vi Cổng 3/);
});

test('sửa sau review: xác nhận sổ khi làm tiếp có cách xử khi file mất hay đã bị sửa', () => {
  const log = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(log, /chạy lại `preflight\.py`/);
  assert.match(log, /File không còn[^\n]*`chưa`/);
  assert.match(log, /`chặn`[^\n]*hỏi người dùng/);
  assert.match(log, /dấu nội dung/);
  assert.match(section(read(R2), '### B3 · Dựng đầy đủ', '### B4'), /chạy lại `preflight\.py`/);
});

test('chạy thử: đầu run_all.py tả đủ trường của file bước, như evolve-site B3 hứa', () => {
  // README của kit không được chép vào _qa/ của prototype; agent ở evolve-site chỉ có run_all.py để đọc
  const lines = read('skills/sketch-to-site/templates/qa-kit/run_all.py').split(String.fromCharCode(10));
  const head = lines.slice(0, lines.findIndex(l => !l.startsWith('#'))).join(' ');
  for (const f of ['"query"', '"name"', '"js"', '"wait"', '"check"', '"shot"', '"jpeg"', '"clip"']) assert.ok(head.includes(f), `đầu run_all.py thiếu ${f}`);
  assert.match(head, /FAIL:/);
  assert.match(read('skills/evolve-site/SKILL.md'), /định dạng ghi ở đầu file `_qa\/run_all\.py`/);
});

test('dự án đã có _qa/ chạy qa_init.py --update trước lần kiểm đầu của phiên, ở cả bốn skill dùng bộ kiểm', () => {
  // Dự án cài bộ kiểm từ kit cũ vẫn chạy run.mjs cũ (lỗi sập, đợi 20 s) cho tới khi có người chạy --update
  const cmd = /qa_init\.py <thư-mục-prototype> --update/;
  assert.match(section(read(R2), '### B4 · Tự kiểm', '3. **`laws-of-ux-checklist`**'), cmd);
  assert.match(section(read('skills/evolve-site/SKILL.md'), '- **Mốc trước khi sửa**', '* **Lỗi có sẵn'), cmd);
  assert.match(section(read('skills/tweak-site/SKILL.md'), '4. **Kiểm nhanh**', '5. **Cấp 1'), cmd);
  assert.match(section(read('skills/handover-check/SKILL.md'), '### B0', '### B1'), cmd);
});

test('review 2: làm tiếp so dấu nội dung, không so giờ sửa hay nguyên văn dòng Kiểm', () => {
  // git clone, checkout, chép thư mục đổi giờ sửa của mọi file; sửa CSS dùng chung đổi số cảnh báo của trang trước.
  // Dấu nội dung bỏ CRLF để git autocrlf trên Windows không làm lệch dấu.
  const log = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(log, /nguyên dòng cuối `preflight\.py` in ra/);
  assert.ok(log.includes("hashlib.sha1(open(sys.argv[1], 'rb').read().replace(b'\\r\\n', b'\\n')).hexdigest()[:10]"), 'thiếu lệnh tính dấu nội dung');
  assert.match(log, /Dấu nội dung khác dấu ở Ghi chú[^\n]*`chặn`/);
  assert.match(log, /[Cc]òn lỗi[^\n]*`đang`/);
  assert.doesNotMatch(log, /giờ sửa|dd\/mm\/yyyy hh:mm:ss|Kết quả preflight khác cột Kiểm/);
});

test('review 2: trang bị chặn hỏi một lần, có lựa chọn giữ bản hiện tại', () => {
  const log = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(log, /`chặn` thì hỏi người dùng \*\*một lần\*\*/);
  assert.match(log, /Giữ bản hiện tại, coi là `xong`/);
  assert.match(log, /Xem lại trang/);
});

test('review 2: tự sửa trang đã xong thì ghi lại dòng đó ngay, ở B4 và ở evolve-site Cấp 3', () => {
  const log = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(log, /\*\*Tự sửa một trang đã `xong`\*\*/);
  assert.match(section(read(R2), '### B4 · Tự kiểm', '### 🛑 Cổng 4'), /`BUILD-LOG\.md`[^\n]*dấu nội dung/);
  assert.match(section(read('skills/evolve-site/SKILL.md'), '- **Cấp 3:** ghi tiến độ', '\n'), /dấu nội dung/);
});

test('sửa sau review: evolve-site B1 nhận đợt Cấp 3 đang dựng dở từ BUILD-LOG', () => {
  const b1 = section(read('skills/evolve-site/SKILL.md'), '### B1 · Hấp thụ DNA', '### 🛑 Cổng 1');
  assert.match(b1, /`BUILD-LOG\.md`[^\n]*chưa `xong`/);
  assert.match(b1, /không hỏi lại cổng đã có đáp án/);
  assert.match(b1, /bỏ bước mốc trước khi sửa/);
});

test('sửa sau review: bảng cớ không biến "Tuỳ bạn" thành lý do hỏi lại', () => {
  const md = read('skills/sketch-to-site/SKILL.md');
  const block = /<!-- luat-dung:co:bat-dau -->\n([\s\S]*?)\n<!-- luat-dung:co:ket-thuc -->/.exec(md)[1];
  assert.match(block, /Người dùng trả lời \*Tuỳ bạn\* cho một câu hỏi ở cổng/);
  assert.match(block, /không có khuyến nghị thì chọn lựa chọn đầu/);
  assert.match(block, /khi người dùng chưa giao câu đó/);
});

test('sửa sau review: review ở B4 soát theo mục F, không tự sửa thứ đã khoá; reviewer đọc DECISIONS.md và site/', () => {
  const b4 = section(read(R2), '### B4 · Tự kiểm', '### 🛑 Cổng 4');
  assert.match(b4, /5\. \*\*Review bằng góc nhìn mới\*\*[^\n]*`references\/rules-and-conflicts\.md` mục F/);
  assert.match(b4, /đụng thứ đã khoá hay ngoài phạm vi thì không sửa, đưa lên Cổng 4/);
  const s7 = section(read('skills/sketch-to-site/references/qa-gate.md'), '## 7. Review bằng góc nhìn mới', '\n## 8.');
  assert.match(s7, /\{thư mục prototype\}\/DECISIONS\.md/);
  assert.match(s7, /\{thư mục prototype\}\/site\//);
});

test('sửa sau review: tweak-site nói rõ hỏi mục chưa rõ là ngoại lệ của "không hỏi"', () => {
  const t = section(read('skills/tweak-site/SKILL.md'), '## 2. Luật không bỏ', '## 3.');
  assert.match(t, /Mục chưa rõ thì hỏi[^\n]*ngoại lệ duy nhất của "không hỏi"/);
});

test('sau review: evolve-site B3 đặt tiền tố cho bước phủ định, trỏ tới đầu file run_all.py, có dòng cho việc bỏ tính năng', () => {
  const b3 = section(read('skills/evolve-site/SKILL.md'), '### B3 · Dựng tính năng', '### B4');
  assert.match(b3, /`phu-dinh-`/);
  assert.match(b3, /đầu file `_qa\/run_all\.py`/);
  assert.match(b3, /\*\*Bỏ tính năng:\*\*[^\n]*lối vào đã mất/);
  assert.match(section(read('skills/evolve-site/references/regression-qa.md'), '## 3. Cho QA lớn theo tính năng', '\n## '), /`phu-dinh-`/);
});

test('sau review: khuôn báo cáo Cổng 4 có chỗ cho review độc lập; mục F trỏ về sàn ở sketch-to-site mục 2', () => {
  assert.match(section(read('skills/sketch-to-site/references/qa-gate.md'), '## 5. Báo cáo ở Cổng 4', '\n## 6.'), /\*\*Review độc lập:\*\*/);
  const f = section(read('skills/sketch-to-site/references/rules-and-conflicts.md'), '## F. Nhận góp ý và yêu cầu sửa', '\n## G.');
  assert.match(f, /sàn không thương lượng ở `sketch-to-site` mục 2/);
  // SKILL.md chỉ giữ ghi chú phiên bản đang chạy (4.5); ghi chú 4.1 ở CHANGELOG
  const v110 = read('CHANGELOG.md').split(/^## /m).find(s => s.startsWith('1.1.0 ('));
  assert.match(v110, /`sketch-to-site` 4\.1/);
  assert.match(v110, /`sketch-to-site` B4 adds a fresh-context review/);
  // v1.3: chấm trên dữ liệu một lần; concept sửa ý thì được soát lại trên ảnh, không chấm lại bằng prompt mục 2
  assert.match(read('skills/sketch-to-concept/references/subagent-prompts.md'), /Do not re-score on the data: the image check/);
});

test('mọi đường dẫn {skills}/… trong prompt và tài liệu đều có thật', () => {
  const files = [];
  const walk = d => { for (const e of fs.readdirSync(path.join(REPO, d), { withFileTypes: true })) {
    if (e.isDirectory()) { if (e.name !== 'tests') walk(`${d}/${e.name}`); } else if (e.name.endsWith('.md')) files.push(`${d}/${e.name}`);
  } };
  walk('skills');
  const missing = [];
  for (const f of files) {
    for (const m of read(f).matchAll(/\{skills\}\/([^\s)`,:;*"']+)/g)) {
      const p = m[1].replace(/[.]+$/, '');
      if (!/[<>{}]/.test(p) && !fs.existsSync(path.join(REPO, 'skills', p))) missing.push(`${f}: ${p}`);
    }
  }
  assert.deepEqual(missing, []);
});

// ---- v4.2: design system theo theme, trang _system.html, đo trên trang render ----
test('v4.2: B2 dựng theme bằng themes.json và themes.mjs, có trang _system.html; Cổng 3 xem ảnh _system ở mọi theme', () => {
  const md = read(R1);
  const b2 = section(md, '### B2 · Design system', '### 🛑 Cổng 3');
  for (const s of ['templates/themes.json', 'scripts/themes.mjs', 'templates/tokens.css', 'templates/system.html', 'site/_system.html', 'data-system-demo', 'SÁT'])
    assert.ok(b2.includes(s), `B2 thiếu ${s}`);
  assert.match(section(md, '### 🛑 Cổng 3', '### B3'), /_system\.html[^\n]*mỗi theme/);
  assert.match(read('CHANGELOG.md').split(/^## /m).find(s => s.startsWith('1.2.0 (')), /`sketch-to-site` 4\.2/);
});

test('B1 ghi giả định Thực tế nội dung, mỗi dòng có giá phải trả nếu sai; khuôn DECISIONS.md có mục Giả định', () => {
  const b1 = section(read(R1), '### B1 ·', '### B2');
  assert.match(b1, /\*\*Thực tế nội dung\*\*/);
  assert.match(b1, /giá phải trả nếu sai/);
  assert.match(read('skills/sketch-to-site/templates/DECISIONS.md'), /^## Giả định/m);
});

test('D.2 liệt kê đúng màu gốc và vai dẫn xuất của color.js; mọi theme là một data-theme; có cách thêm theme', () => {
  const C = require('../templates/color.js');
  const d2 = section(read('skills/sketch-to-site/references/rules-and-conflicts.md'), '### D.2', '### D.3');
  for (const k of C.SEEDS.concat(C.OPTIONAL, C.DERIVED)) assert.ok(d2.includes(`--${k}`), `D.2 thiếu --${k}`);
  assert.match(d2, /mọi theme[^\n]*là một giá trị của `data-theme`/i);
  assert.match(d2, /\*\*Thêm theme:\*\*/);
});

test('khuôn DESIGN.md: bảng 8 trạng thái, thang chữ, bóng theo độ cao, theme, biểu đồ, kết quả themes.mjs', () => {
  const md = read('skills/sketch-to-site/templates/DESIGN.md');
  assert.match(md, /\| Component \| Mặc định \| Hover \| Focus \| Nhấn \| Tắt \| Đang tải \| Lỗi \| Đang chọn \|/);
  for (const s of ['--shadow-4', '--text-4xl', '## 2b. Theme', '## 11. Biểu đồ', 'themes.mjs']) assert.ok(md.includes(s), s);
});

test('qa-gate: mục 1 có P19–P21; mục 2 có phép đo trong trang, lượt sâu, nợ cũ; từ điển nhãn khớp probes.js', () => {
  const qg = read('skills/sketch-to-site/references/qa-gate.md');
  const s1 = section(qg, '## 1.', '## 2.');
  for (const c of ['P19', 'P20', 'P21']) assert.ok(s1.includes('`' + c + '`'), c);
  const s2 = section(qg, '## 2.', '## 3.');
  for (const s of ['data-contrast-bg', 'data-demo-state', 'nợ cũ', 'Lượt kiểm sâu']) assert.ok(s2.includes(s), s);
  const probes = read('skills/sketch-to-site/templates/qa-kit/probes.js');
  const words = /Nhãn nguy hiểm: \*([^*]+)\*/.exec(s2)[1].split(',').map(w => w.trim()).filter(w => !w.includes('+'));
  assert.ok(words.length >= 8);
  for (const w of words) assert.ok(probes.includes(w), `probes.js thiếu "${w}"`);
});

test('qa-gate mục 7: xem ảnh trước khi nói, mỗi vấn đề có bằng chứng, có kết luận và mục không đánh giá được', () => {
  const s7 = section(read('skills/sketch-to-site/references/qa-gate.md'), '## 7. Review bằng góc nhìn mới', '\n## 8.');
  for (const s of ['Xem trước khi nói', 'Mỗi vấn đề phải có bằng chứng', 'KẾT LUẬN: chặn · làm lại · giao', 'Không đánh giá được', 'Chịu tải', 'Tương tác thật'])
    assert.ok(s7.includes(s), s);
});

test('A.3 có 8 trạng thái; A.5 câu chữ giao diện; D.5 kịch bản dữ liệu; D.7 biểu đồ; ghi nguồn plugin87', () => {
  const r = read('skills/sketch-to-site/references/rules-and-conflicts.md');
  assert.match(section(r, '### A.3', '### A.4'), /8 trạng thái/);
  assert.match(r, /^### A\.5 Câu chữ giao diện/m);
  assert.match(section(r, '### D.5', '### D.6'), /\?data=empty[^\n]*\?data=stress/);
  assert.match(r, /^### D\.7 Biểu đồ và dashboard/m);
  assert.match(r, /plugin87\/ux-ui-agent-skills/);
});

test('khuôn AGENTS-qa.md nói lệnh themes.mjs, trang _system.html, tương phản và nợ cũ', () => {
  const a = read('skills/sketch-to-site/templates/AGENTS-qa.md');
  for (const s of ['scripts/themes.mjs', '_system.html', 'tương phản mới', 'nợ cũ']) assert.ok(a.includes(s), s);
});

test('evolve-site 1.8: cờ T thêm màu vào themes.json, component vào _system.html; phần mới đọc được ở mọi theme', () => {
  const md = read('skills/evolve-site/SKILL.md');
  assert.match(md, /^> \*\*v1\.8 \(/m);
  assert.match(md, /\*\*T · Token, component\*\*[^\n]*themes\.json[^\n]*_system\.html/);
  assert.match(md, /đọc được ở \*\*mọi theme\*\*/);
});

test('tweak-site 1.2: đổi màu qua themes.json và themes.mjs; nợ cũ không tự sửa', () => {
  const md = read('skills/tweak-site/SKILL.md');
  assert.match(md, /^> \*\*v1\.2 \(/m);
  assert.match(section(md, '## 2. Luật không bỏ', '## 3.'), /themes\.json[^\n]*themes\.mjs/);
  assert.match(section(md, '## 3. Quy trình', '## 4.'), /`nợ cũ`[^\n]*không tự sửa/);
});

test('handover-check 1.2: bảng đọc kết quả có phép đo mới và nợ cũ; cổng hỏi nợ cũ', () => {
  const md = read('skills/handover-check/SKILL.md');
  assert.match(md, /^> \*\*v1\.2 \(/m);
  const b4 = section(md, '### B4 · Đọc kết quả', '### B5');
  assert.match(b4, /\*\*Tương phản, ý định, sâu\*\*/);
  assert.match(b4, /\*\*Nợ cũ\*\*/);
  assert.match(section(md, '### 🛑 Cổng', '### B7'), /\*\*Nhận nợ cũ vào mốc\*\*/);
});

// SKILL.md của sketch-to-concept chỉ giữ bản đang chạy; lịch sử phiên bản ở CHANGELOG
test('sketch-to-concept 1.2 (lõi màu chung color.js) có trong CHANGELOG', () => {
  const v120 = read('CHANGELOG.md').split(/^## /m).find(s => s.startsWith('1.2.0 ('));
  assert.match(v120, /`sketch-to-concept` 1\.2/);
  assert.match(v120, /color\.js/);
});

test('chế độ tối chỉ khi người dùng xin: không mặc định theo hệ thống; B2 thêm theme thứ hai chỉ khi Cổng 2 ghi người dùng xin', () => {
  const row = read('skills/sketch-to-site/references/rules-and-conflicts.md').split('\n').find(l => l.startsWith('| 11 |'));
  assert.doesNotMatch(row, /theo hệ thống/);
  assert.match(row, /một nền/);
  assert.match(row, /người dùng xin/);
  const app = read('skills/sketch-to-site/references/mobile-app.md');
  assert.doesNotMatch(app, /mặc định \*theo hệ thống\*/);
  assert.match(section(app, '**Nền tối:**', '\n'), /người dùng xin/);
  assert.match(section(read(R1), '### B2 · Design system', '### 🛑 Cổng 3'), /theme thứ hai[^\n]*người dùng xin/);
  const design = read('skills/sketch-to-site/templates/DESIGN.md');
  assert.doesNotMatch(design, /<sáng \| tối \| theo hệ thống>/);
  assert.match(design, /`<dark>` \*\(chỉ khi người dùng xin/);
});
