// Kiểm scripts/roles.mjs (bản đồ vai của màn then chốt) và phần báo đậm giả của check.mjs.
// Đo 1.4 sau đợt sửa cuối: cả hai lần vòng 2 mất 1–2 lượt grep màn mượn vì `uniq -c` chỉ đếm số lần dùng, không nói vai nào tô phần nào
// hay chữ đậm bao nhiêu; một lần chọn Patrick Hand (chỉ có 400) cho màn đặt tiêu đề 600, trình duyệt tô đậm giả.
// Chạy: node --test skills/sketch-to-concept/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const SKILL = path.resolve(__dirname, '..');
const S2S = path.resolve(SKILL, '..', 'sketch-to-site');
const ROLES = path.join(SKILL, 'scripts', 'roles.mjs');
const CHECK = path.join(SKILL, 'scripts', 'check.mjs');

const SCREEN = `<!doctype html><html lang="vi"><head>
<!-- Thay <body> bằng màn thật -->
<script>tailwind.config={theme:{extend:{colors:{primary:'var(--primary)'}}}}</script>
<style>
  body{background-color:var(--bg);background-image:var(--texture);color:var(--ink);font-family:var(--font-body)}
  h1,h2{font-family:var(--font-display)}
  .fire{background:radial-gradient(var(--primary),var(--accent))}
  .door .t{font-family:var(--font-display);font-weight:600}
  .num{font-family:var(--font-mono)}
  .arch{border-radius:var(--radius-lg)}
  @media (prefers-reduced-motion: reduce){*{animation:none}}
</style></head><body>
<p class="font-display text-[2rem] font-semibold text-primary">Lò Bánh Củi</p>
<h1 class="font-bold">Mẻ kế</h1>
<div class="door"><span class="t">9:30</span></div>
<span class="num font-semibold">0909 123 456</span>
<a class="btn bg-primary text-on-primary rounded-lg font-semibold">Nhắn Zalo</a>
<div class="border-t-4 border-accent hover:bg-muted-bg"></div>
<script>const card = b => '<p class="text-muted">' + b.note + '</p>';</script>
</body></html>`;

const load = () => import(pathToFileURL(ROLES).href);

test('roles.mjs: vai màu ghi chỗ dùng (bộ chọn CSS kèm thuộc tính, lớp Tailwind kèm thẻ và chữ)', async () => {
  const { screenRoles } = await load();
  const r = screenRoles(SCREEN);
  const where = role => (r.colors[role] || []).map(x => x.where);
  assert.ok(where('primary').includes('.fire (background)'), where('primary').join(' | '));
  assert.ok(where('primary').some(w => /^text-primary <p> «Lò Bánh Củi»$/.test(w)), where('primary').join(' | '));
  assert.ok(where('primary').some(w => /^bg-primary <a> «Nhắn Zalo»$/.test(w)), where('primary').join(' | '));
  assert.ok(where('accent').includes('.fire (background)'));
  assert.ok(where('accent').some(w => w.startsWith('border-accent <div>')));
  assert.ok(where('muted-bg').some(w => w.startsWith('hover:bg-muted-bg <div>')));
  assert.ok(where('muted').some(w => w.startsWith('text-muted <p>')), 'lớp trong chuỗi script cũng tính');
  assert.ok(where('bg').includes('body (background-color)'));
  assert.equal(where('primary').filter(w => /tailwind/.test(w)).length, 0, 'cấu hình Tailwind không phải chỗ dùng');
  assert.ok((r.shape['radius-lg'] || []).map(x => x.where).includes('.arch (border-radius)'));
  assert.ok((r.shape['radius-lg'] || []).some(x => x.where.startsWith('rounded-lg <a>')));
  assert.ok((r.shape.texture || []).map(x => x.where).includes('body (background-image)'));
});

test('roles.mjs: độ đậm theo vai chữ; vai khai bằng lớp hay CSS là rõ, chữ không khai vai tính body', async () => {
  const { screenRoles } = await load();
  const t = screenRoles(SCREEN).type;
  const has = (role, w, explicit) => t[role].some(x => x.w === w && x.explicit === explicit);
  assert.ok(has('display', 600, true), JSON.stringify(t.display));   // <p class="font-display font-semibold"> và .door .t
  assert.ok(has('display', 700, true), JSON.stringify(t.display));   // h1 nhận vai qua luật h1,h2
  assert.ok(has('mono', 600, true), JSON.stringify(t.mono));
  assert.ok(has('body', 600, false), JSON.stringify(t.body));        // nút không khai vai
  assert.ok(!t.display.some(x => x.w === 400 && /Lò Bánh/.test(x.where)));
  assert.ok(!t.body.some(x => /bằng màn thật/.test(x.where)), 'chữ trong chú thích HTML không phải phần tử');
});

// Đo 1.4 đợt năm: <h1 class="font-bold" style="font-family:var(--font-body)"> bị tính theo luật h1 là display Vina Sans 700,
// check.mjs báo nhầm đậm giả, agent mất một lượt sửa và chụp lại
test('roles.mjs: font-family và font-weight viết inline thắng lớp và luật CSS của thẻ', async () => {
  const { screenRoles } = await load();
  const t = screenRoles(SCREEN.replace('</body>', `<h2 class="font-bold" style="font-family:var(--font-body)">Bánh mì nướng lò củi</h2>
<span class="num font-semibold" style="font-weight: 800">5:30</span>
</body>`)).type;
  assert.ok(t.body.some(x => x.w === 700 && x.explicit && /Bánh mì nướng/.test(x.where)), JSON.stringify(t.body));
  assert.ok(!t.display.some(x => /Bánh mì nướng/.test(x.where)), JSON.stringify(t.display));
  assert.ok(t.mono.some(x => x.w === 800 && /5:30/.test(x.where)), JSON.stringify(t.mono));
  assert.ok(!t.mono.some(x => x.w === 600 && /5:30/.test(x.where)), JSON.stringify(t.mono));
});

// Dựng thư mục concept/ như cost.test.js, thêm concept d mượn màn c
function fixture(extra = '') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'concept-roles-'));
  const t = f => path.join(SKILL, 'templates', f);
  fs.copyFileSync(t('concept-board.html'), path.join(dir, 'index.html'));
  fs.copyFileSync(t('tokens.js'), path.join(dir, 'tokens.js'));
  fs.writeFileSync(path.join(dir, 'concepts.js'), fs.readFileSync(t('concepts.example.js'), 'utf8').replace(/^\s*example: true,\r?\n/m, '') + `
CONCEPTS.rounds = [{ n: 1, note: '' }, { n: 2, note: 'chưa hợp ở Màu và Chữ, gần đúng nhất là C' }];
CONCEPTS.concepts.push(Object.assign(JSON.parse(JSON.stringify(CONCEPTS.concepts[1])), { id: 'd', name: 'Than lạnh', round: 2, screen: 'c',
  recommended: false, axes: Object.assign({}, CONCEPTS.concepts[2].axes, { nen: 'Sáng tinh', chatNen: 'Giấy', chu: 'Viết tay' }), colors: { light: CONCEPTS.concepts[0].colors.light } }));
` + extra);
  for (const f of ['color.js', 'theme.js']) fs.copyFileSync(path.join(S2S, 'templates', f), path.join(dir, f));
  const screen = fs.readFileSync(t('key-screen.html'), 'utf8');
  for (const id of ['a', 'b', 'c']) fs.writeFileSync(path.join(dir, `${id}.html`), screen.replace('data-concept="a"', `data-concept="${id}"`));
  // Màn c đặt tên tiệm ở vai display, độ đậm 600
  const c = path.join(dir, 'c.html');
  fs.writeFileSync(c, fs.readFileSync(c, 'utf8').replace('<main class="mx-auto max-w-3xl px-6 py-16">', '<main class="mx-auto max-w-3xl px-6 py-16">\n  <p class="font-display text-2xl font-semibold">Lò Bánh Củi Cô Ba</p>'));
  return dir;
}

test('roles.mjs: mỗi màn có file riêng một khối, ghi concept mượn màn; lọc được theo id', t => {
  const dir = fixture();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const r = spawnSync(process.execPath, [ROLES, dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const heads = r.stdout.split(/\r?\n/).filter(l => /^\S+\.html/.test(l));
  assert.deepEqual(heads.map(l => l.split(' ')[0]), ['a.html', 'b.html', 'c.html']);
  assert.match(heads[2], /mượn bởi: d/);
  assert.match(r.stdout, /^ {2}Màu:/m);
  assert.match(r.stdout, /^ {4}primary: /m);
  assert.match(r.stdout, /^ {2}Chữ[^\n]*:\n {4}display: [^\n]*600/m);
  assert.match(r.stdout, /^ {2}Không dùng: /m);
  const one = spawnSync(process.execPath, [ROLES, dir, 'c'], { encoding: 'utf8' });
  assert.deepEqual(one.stdout.split(/\r?\n/).filter(l => /^\S+\.html/.test(l)).map(l => l.split(' ')[0]), ['c.html']);
  assert.equal(spawnSync(process.execPath, [ROLES, path.join(dir, 'khong-co')], { encoding: 'utf8' }).status, 2);
});

const check = (dir, ...a) => spawnSync(process.execPath, [CHECK, dir, ...a], { encoding: 'utf8', timeout: 60000 });

test('check.mjs: font chỉ có độ đậm dưới 600 trên vai mà màn đặt chữ đậm là lỗi đậm giả', t => {
  const dir = fixture("\nCONCEPTS.concepts[3].fontFamily.display = 'Patrick Hand'; CONCEPTS.concepts[3].fontWeights.display = '400';\n");
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const r = check(dir, '--round', '2');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^d: [^\n]*đậm giả: display Patrick Hand chỉ có độ đậm 400, màn c\.html dùng 600/m, r.stdout);
});

test('check.mjs: font có độ đậm mà fontWeights không khai thì cũng đậm giả; khai đủ thì OK', t => {
  const bad = fixture("\nCONCEPTS.concepts[3].fontFamily.display = 'Archivo'; CONCEPTS.concepts[3].fontWeights.display = '400';\n");
  t.after(() => fs.rmSync(bad, { recursive: true, force: true }));
  const r = check(bad, '--round', '2');
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^d: [^\n]*đậm giả: fontWeights\.display "400" thiếu 600 mà màn c\.html dùng/m, r.stdout);
  const ok = fixture("\nCONCEPTS.concepts[3].fontFamily.display = 'Archivo'; CONCEPTS.concepts[3].fontWeights.display = '400;600';\n");
  t.after(() => fs.rmSync(ok, { recursive: true, force: true }));
  const r2 = check(ok, '--round', '2');
  assert.match(r2.stdout, /^d: OK$/m, r2.stdout);
  // Màn của vòng 1 không đặt chữ đậm ở vai display thì không báo gì
  const all = check(ok);
  for (const id of ['a', 'b', 'c']) assert.match(all.stdout, new RegExp(`^${id}: OK$`, 'm'), all.stdout);
});
