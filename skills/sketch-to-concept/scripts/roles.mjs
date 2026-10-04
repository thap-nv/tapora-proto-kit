// Bản đồ vai của màn then chốt: vai màu nào tô phần nào, vai chữ nào dùng độ đậm nào, bo góc, bóng, chất nền ở đâu.
// node <skills>/sketch-to-concept/scripts/roles.mjs <thư-mục-concept> [id …]
//   Mỗi màn có file riêng (<id>.html) một khối, kèm các concept mượn màn đó (screen). Có id thì chỉ in màn của các id đó.
//   Dùng ở vòng mới: concept chỉ đổi dữ liệu mượn màn của concept khác, cần biết màn đó dùng vai nào ở đâu và chữ đậm bao nhiêu.
//   Đọc tĩnh style inline, lớp và CSS trong file (cả chuỗi HTML trong script), chưa tính kế thừa: chữ không khai vai tính là body.
// check.mjs dùng screenRoles() để báo đậm giả. Thoát 0, hoặc 2 khi sai tham số hay không đọc được concepts.js.
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const COLOR_ROLES = ['bg', 'surface', 'ink', 'muted', 'muted-bg', 'line', 'primary', 'on-primary', 'secondary', 'on-secondary',
  'accent', 'on-accent', 'destructive', 'on-destructive', 'ring'];
export const SHAPE_VARS = ['radius-sm', 'radius', 'radius-lg', 'shadow', 'texture', 'border-width'];
export const TYPE_ROLES = ['display', 'body', 'mono'];
const WEIGHT_CLASS = { 'font-thin': 100, 'font-extralight': 200, 'font-light': 300, 'font-normal': 400, 'font-medium': 500,
  'font-semibold': 600, 'font-bold': 700, 'font-extrabold': 800, 'font-black': 900 };
const UTIL = ['bg', 'text', 'border', 'border-[trblxy]', 'divide', 'ring', 'ring-offset', 'outline', 'from', 'via', 'to', 'fill', 'stroke',
  'decoration', 'placeholder', 'accent', 'caret', 'shadow'];
const alt = list => [...list].sort((a, b) => b.length - a.length).join('|');
const COLOR_CLASS = new RegExp(`^(?:[\\w-]+:)*(?:${UTIL.join('|')})-(${alt(COLOR_ROLES)})(?:\\/\\d+)?$`);
const RADIUS_CLASS = /^(?:[\w-]+:)*rounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|es|ee))?(?:-(sm|lg))?$/;
const VAR = /var\(--([\w-]+)/g;
const HEAD_TAGS = new Set(['html', 'head', 'meta', 'link', 'script', 'style', 'title', 'base']);

const weightOf = v => {
  const s = String(v).trim().toLowerCase();
  return /^\d{3}$/.test(s) ? +s : s === 'bold' ? 700 : s === 'normal' ? 400 : null;
};

// Luật CSS trong <style>: bộ chọn và khai báo. @media chỉ bỏ phần đầu, luật bên trong vẫn đọc
function cssRules(html) {
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/@[^{;]+\{/g, '');
  const rules = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = m[2].split(';').map(d => d.trim()).filter(d => d.includes(':'))
      .map(d => [d.slice(0, d.indexOf(':')).trim().toLowerCase(), d.slice(d.indexOf(':') + 1).trim()]);
    rules.push({ sel: m[1].trim().replace(/\s+/g, ' '), decls });
  }
  return rules;
}

// Phần cuối của mỗi bộ chọn (".door .t" → thẻ không có, lớp t): đủ để khớp phần tử theo thẻ và lớp
function compounds(sel) {
  return sel.split(',').map(s => {
    const last = s.trim().split(/\s*[>+~]\s*|\s+/).pop().replace(/::?[\w-]+(\([^)]*\))?/g, '').replace(/\[[^\]]*\]/g, '');
    if (/#/.test(last)) return null;
    const tag = (/^[a-zA-Z][\w-]*/.exec(last) || [])[0];
    const classes = [...last.matchAll(/\.([\w-]+)/g)].map(m => m[1]);
    return tag || classes.length ? { tag: tag && tag.toLowerCase(), classes } : null;
  }).filter(Boolean);
}
const matches = (rule, tag, cls) => compounds(rule.sel).some(c => (!c.tag || c.tag === tag) && c.classes.every(k => cls.has(k)) && !['html', 'body'].includes(c.tag));

function add(map, key, where, extra = {}) {
  const list = map[key] || (map[key] = []);
  const hit = list.find(x => x.where === where && Object.keys(extra).every(k => x[k] === extra[k]));
  if (hit) hit.n++;
  else list.push({ where, n: 1, ...extra });
}

export function screenRoles(source) {
  const html = source.replace(/<!--[\s\S]*?-->/g, '');   // chú thích của khuôn có chữ "<body>"
  const colors = {}, shape = {}, type = { display: [], body: [], mono: [] };
  const rules = cssRules(html);
  for (const r of rules) {
    for (const [prop, val] of r.decls) {
      for (const m of val.matchAll(VAR)) {
        const v = m[1];
        if (COLOR_ROLES.includes(v)) add(colors, v, `${r.sel} (${prop})`);
        else if (SHAPE_VARS.includes(v)) add(shape, v, `${r.sel} (${prop})`);
      }
    }
    // Luật đặt cả vai chữ lẫn độ đậm (".door .t{font-family:var(--font-display);font-weight:600}") là một chỗ dùng
    const fam = r.decls.find(([p, v]) => p === 'font-family' && /var\(--font-(display|body|mono)\)/.test(v));
    const w = r.decls.find(([p]) => p === 'font-weight');
    if (fam && w && weightOf(w[1])) {
      const role = /var\(--font-(display|body|mono)\)/.exec(fam[1])[1];
      add(type, role, r.sel, { w: weightOf(w[1]), explicit: true });
    }
  }
  for (const m of html.matchAll(/<([a-zA-Z][\w-]*)\b([^<>]*?)\/?>/g)) {
    const tag = m[1].toLowerCase();
    if (HEAD_TAGS.has(tag)) continue;
    const attrs = m[2];
    const clsText = (/\bclass\s*=\s*(["'])(.*?)\1/.exec(attrs) || [])[2] || '';
    const style = (/\bstyle\s*=\s*(["'])(.*?)\1/.exec(attrs) || [])[2] || '';
    const tokens = clsText.split(/\s+/).filter(Boolean);
    const cls = new Set(tokens);
    let text = html.slice(m.index + m[0].length, m.index + m[0].length + 160).split('<')[0].replace(/\s+/g, ' ').trim();
    if (/['"`+$]/.test(text)) text = 'chữ từ script';
    const el = `<${tag}>${text ? ` «${text.length > 28 ? text.slice(0, 27) + '…' : text}»` : ''}`;
    for (const k of tokens) {
      const c = COLOR_CLASS.exec(k);
      if (c) add(colors, c[1], `${k} ${el}`);
      const rr = RADIUS_CLASS.exec(k);
      if (rr) add(shape, rr[1] ? `radius-${rr[1]}` : 'radius', `${k} ${el}`);
      if (k === 'shadow') add(shape, 'shadow', `${k} ${el}`);
    }
    for (const v of style.matchAll(VAR)) {
      if (COLOR_ROLES.includes(v[1])) add(colors, v[1], `style ${el}`);
      else if (SHAPE_VARS.includes(v[1])) add(shape, v[1], `style ${el}`);
    }
    // Vai chữ: style inline, rồi lớp font-display|body|mono, rồi luật CSS khớp thẻ và lớp; không có thì là body không khai
    const hit = rules.filter(r => matches(r, tag, cls));
    let role = /font-family\s*:\s*var\(--font-(display|body|mono)\)/i.exec(style)?.[1]
      || tokens.map(k => /^font-(display|body|mono)$/.exec(k)).find(Boolean)?.[1];
    let via = role ? null : hit.map(r => [r, r.decls.find(([p, v]) => p === 'font-family' && /var\(--font-(display|body|mono)\)/.test(v))]).find(x => x[1]);
    if (via) role = /var\(--font-(display|body|mono)\)/.exec(via[1][1])[1];
    const explicit = !!role;
    role = role || 'body';
    let w = weightOf((/font-weight\s*:\s*([^;]+)/i.exec(style) || [])[1] ?? '')
      || tokens.map(k => WEIGHT_CLASS[k.replace(/^(?:[\w-]+:)*/, '')]).find(Boolean);
    const ruleW = hit.map(r => r.decls.find(([p]) => p === 'font-weight')).filter(Boolean).map(d => weightOf(d[1])).find(Boolean);
    w = w || ruleW;
    if (!w && !explicit && !text) continue;
    add(type, role, via && !text ? via[0].sel : el, { w: w || 400, explicit });
  }
  return { colors, shape, type };
}

// Độ đậm màn dùng cho một vai chữ: [{ w, explicit, where }]
export const weightsUsed = (roles, role) => roles.type[role] || [];

const short = (list, max = 4) => {
  const s = [...list].sort((a, b) => b.n - a.n);
  return s.slice(0, max).map(x => x.n > 1 ? x.where.replace(/^(\S+)/, `$1 ×${x.n}`) : x.where).join(' · ') + (s.length > max ? ` · và ${s.length - max} chỗ nữa` : '');
};

export function formatRoles(file, r, borrowers = []) {
  const out = [`${file}${borrowers.length ? ` · mượn bởi: ${borrowers.join(', ')}` : ''}`, '  Màu:'];
  for (const role of COLOR_ROLES) if (r.colors[role]) out.push(`    ${role}: ${short(r.colors[role])}`);
  out.push('  Chữ (độ đậm theo lớp và CSS; chữ không khai vai tính là body):');
  for (const role of TYPE_ROLES) {
    const by = new Map();
    for (const x of r.type[role]) {
      const k = x.w;
      const g = by.get(k) || { n: 0, where: [] };
      g.n += x.n;
      if (g.where.length < 2 && (x.explicit || role === 'body')) g.where.push(x.where);
      by.set(k, g);
    }
    if (by.size) out.push(`    ${role}: ` + [...by].sort((a, b) => a[0] - b[0]).map(([w, g]) => `${w}${g.n > 1 ? ` ×${g.n}` : ''}${g.where.length ? ` (${g.where.join(', ')})` : ''}`).join(' · '));
  }
  const sh = SHAPE_VARS.filter(v => r.shape[v]).map(v => `${v}: ${short(r.shape[v], 3)}`);
  if (sh.length) out.push(`  Hình: ${sh.join(' · ')}`);
  const unused = COLOR_ROLES.filter(role => !r.colors[role]);
  if (unused.length) out.push(`  Không dùng: ${unused.join(', ')}`);
  return out.join('\n');
}

export function loadConcepts(dir) {
  const ctx = {};
  ctx.window = ctx;
  vm.runInNewContext(readFileSync(join(dir, 'concepts.js'), 'utf8'), ctx);
  return ctx.CONCEPTS;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [d, ...ids] = process.argv.slice(2);
  const dir = d && resolve(d);
  if (!dir || !existsSync(dir)) {
    console.error('Cách dùng: node roles.mjs <thư-mục-concept> [id …]');
    process.exit(2);
  }
  let D;
  try { D = loadConcepts(dir); } catch (e) { console.error(`Không đọc được concepts.js: ${e.message}`); process.exit(2); }
  const list = (D.concepts || []).filter(c => !c.screen && existsSync(join(dir, `${c.id}.html`)) && (!ids.length || ids.includes(c.id)));
  const blocks = list.map(c => formatRoles(`${c.id}.html`, screenRoles(readFileSync(join(dir, `${c.id}.html`), 'utf8')),
    D.concepts.filter(x => x.screen === c.id).map(x => x.id)));
  console.log(blocks.join('\n\n') || 'Không có màn nào.');
}
