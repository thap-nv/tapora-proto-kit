// Kiểm các luật chung của kit nằm đúng chỗ trong tài liệu các skill.
// Chạy: node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..', '..');
const read = rel => fs.readFileSync(path.join(REPO, rel), 'utf8').replace(/\r\n/g, '\n');
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
  const md = read('skills/sketch-to-site/SKILL.md');
  assert.match(section(md, '### B0 · Nhận concept', '### B1'), /`BUILD-LOG\.md`/);
  const b3 = section(md, '### B3 · Dựng đầy đủ', '### B4');
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
  assert.match(section(read('skills/sketch-to-site/SKILL.md'), '### B4 · Tự kiểm', '### 🛑 Cổng 4'), /`references\/qa-gate\.md` mục 6/);
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
  const b4 = section(read('skills/sketch-to-site/SKILL.md'), '### B4 · Tự kiểm', '### 🛑 Cổng 4');
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
  assert.match(section(read('skills/sketch-to-site/SKILL.md'), '### 🛑 Cổng 4', '\n---'), /`references\/rules-and-conflicts\.md` mục F/);
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
  const md = read('skills/sketch-to-site/SKILL.md');
  const b0 = section(md, '### B0 · Nhận concept', '### B1');
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
  assert.match(log, /giờ sửa file/);
  assert.match(section(read('skills/sketch-to-site/SKILL.md'), '### B3 · Dựng đầy đủ', '### B4'), /chạy lại `preflight\.py`/);
});

test('chạy thử: đầu run_all.py tả đủ trường của file bước, như evolve-site B3 hứa', () => {
  // README của kit không được chép vào _qa/ của prototype; agent ở evolve-site chỉ có run_all.py để đọc
  const lines = read('skills/sketch-to-site/templates/qa-kit/run_all.py').split(String.fromCharCode(10));
  const head = lines.slice(0, lines.findIndex(l => !l.startsWith('#'))).join(' ');
  for (const f of ['"query"', '"name"', '"js"', '"wait"', '"check"', '"shot"', '"jpeg"', '"clip"']) assert.ok(head.includes(f), `đầu run_all.py thiếu ${f}`);
  assert.match(head, /FAIL:/);
  assert.match(read('skills/evolve-site/SKILL.md'), /định dạng ghi ở đầu file `_qa\/run_all\.py`/);
});

test('chạy thử: cột Kiểm là nguyên dòng cuối preflight, giờ sửa có cả ngày', () => {
  // Dòng cắt bớt thì so nguyên văn sẽ chặn nhầm; giờ không ngày thì bản sửa tay hôm sau trông cũ hơn sổ.
  const log = read('skills/sketch-to-site/templates/BUILD-LOG.md');
  assert.match(log, /nguyên dòng cuối `preflight\.py` in ra/);
  assert.match(log, /`dd\/mm\/yyyy hh:mm:ss`/);
  assert.doesNotMatch(log, /giờ ghi ở Ghi chú/);
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
  const b4 = section(read('skills/sketch-to-site/SKILL.md'), '### B4 · Tự kiểm', '### 🛑 Cổng 4');
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
  assert.match(read('skills/sketch-to-site/SKILL.md'), /^> \*\*v4\.1 [^\n]*`qa-gate\.md` mục 7/m);
  assert.match(read('skills/sketch-to-concept/references/subagent-prompts.md'), /Concept làm lại thì gửi lại prompt mục 2 cho riêng concept đó/);
});

test('mọi đường dẫn {skills}/… trong prompt và tài liệu đều có thật', () => {
  const files = [];
  const walk = d => { for (const e of fs.readdirSync(path.join(REPO, d), { withFileTypes: true })) {
    if (e.isDirectory()) { if (e.name !== 'tests') walk(`${d}/${e.name}`); } else if (e.name.endsWith('.md')) files.push(`${d}/${e.name}`);
  } };
  walk('skills');
  const missing = [];
  for (const f of files) {
    for (const m of read(f).matchAll(/\{skills\}\/([^\s)`,:;*]+)/g)) {
      const p = m[1].replace(/[.]+$/, '');
      if (!/[<>{}]/.test(p) && !fs.existsSync(path.join(REPO, 'skills', p))) missing.push(`${f}: ${p}`);
    }
  }
  assert.deepEqual(missing, []);
});
