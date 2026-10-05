// Bộ chạy thử: mở 1 trang, thực hiện chuỗi bước (JS), chụp ảnh từng bước, gom lỗi console.
// node run.mjs <file.html> <steps.json> <outdir> [w] [h] [mobile]
// Mỗi bước còn đo tương phản và màu theo ý định (probes.js, cần color.js cạnh file này); QA_DEEP=1 thêm lượt kiểm sâu (deep.mjs).
// Node 20 cần cờ --experimental-websocket: thiếu cờ thì script tự chạy lại chính nó với cờ. Node 22 trở lên có sẵn WebSocket.
// Trình duyệt: biến QA_BROWSER, rồi "browser" trong qa.config.json, rồi tự dò Edge/Chrome/Chromium theo hệ điều hành.
// Bước có "shot": chụp khung nhìn vào <shot>.png (.jpg khi "jpeg"); "clip": "<selector>" chỉ chụp một khối;
// "full": true chụp cả trang thành một ảnh; "slices": n chụp cả trang theo từng màn cao bằng khung nhìn: <shot>, <shot>-2, … tối đa n ảnh.
// Trước khi chụp "full"/"slices", trang được cuộn qua phần sẽ chụp rồi về chỗ cũ, để phần hiện dần khi cuộn tới có trong ảnh.
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, delimiter } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

if (typeof WebSocket === 'undefined' && !process.env.QA_WS_FLAG) {
  const r = spawnSync(process.execPath, ['--experimental-websocket', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...process.env, QA_WS_FLAG: '1' } });
  process.exit(r.status ?? 1);
}

const [file, stepsFile, outdir, w = '1440', h = '900', mobile = '0'] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(stepsFile, 'utf8'));
mkdirSync(outdir, { recursive: true });
const HERE = dirname(fileURLToPath(import.meta.url));
let cfg = {};
try { cfg = JSON.parse(readFileSync(join(HERE, 'qa.config.json'), 'utf8')); } catch {}
// Lõi màu và phép đo trong trang: _qa/color.js và _qa/probes.js (qa_init.py chép). Chạy thẳng từ khuôn của skill thì color.js ở thư mục cha
const kitFile = f => [join(HERE, f), join(HERE, '..', f)].find(p => existsSync(p));
const PROBE_FILES = ['color.js', 'probes.js'].map(kitFile);
const PROBE_SRC = PROBE_FILES.every(Boolean) ? PROBE_FILES.map(p => readFileSync(p, 'utf8')) : null;

function findBrowser() {
  const pick = [process.env.QA_BROWSER, cfg.browser].filter(Boolean);
  for (const p of pick) if (existsSync(p)) return p;
  const la = process.env.LOCALAPPDATA || '';
  const byOs = {
    win32: ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      join(la, 'Google/Chrome/Application/chrome.exe')],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'],
  }[process.platform] || [];
  for (const p of byOs) if (existsSync(p)) return p;
  // Linux, hoặc cài ngoài chỗ mặc định: tìm theo PATH
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'msedge', 'chrome']) {
    for (const d of (process.env.PATH || '').split(delimiter)) {
      for (const ext of process.platform === 'win32' ? ['.exe', ''] : ['']) {
        const p = join(d, name + ext);
        if (existsSync(p)) return p;
      }
    }
  }
  return null;
}

// Chạy trong trang ở mỗi bước. Bắt phần tràn nằm TRONG trang mà phép đo tràn ngang của cả trang không thấy, theo chiều ngang:
//   chữ tràn ra ngoài hộp của nó (ô bảng, nút, thẻ bị ép hẹp: chữ đè lên ô bên cạnh);
//   chữ hoặc nút bị khung overflow:hidden cắt mất một phần (bảng rộng hơn khung bo góc).
// Bỏ qua: chữ có dấu ba chấm, phần tử ẩn, trong suốt hoặc 1px (.sr-only), phần tử nằm hẳn ngoài khung (ngăn kéo đang đóng, slide khác),
// phần khuất trong khung cuộn ngang (overflow auto/scroll), và vùng gắn data-clip-ok (cố ý tràn lề, marquee, slide ló).
function layoutCheck() {
  const out = [], seen = new Set(), range = document.createRange();
  const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const label = e => (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
  const faded = e => { for (let p = e; p; p = p.parentElement) if (getComputedStyle(p).opacity === '0') return true; return false; };
  // Hộp tí hon giấu phần tràn là .sr-only: bỏ qua. Hộp bị ép về 0 mà chữ vẫn hiện ra ngoài (cột lưới minmax(0, 1fr) hết chỗ) thì vẫn đo
  const tiny = (w, h, s) => (w < 2 || h < 2) && s.overflowX !== 'visible';
  const add = (e, msg) => { if (!seen.has(e) && !faded(e)) { seen.add(e); out.push(`${name(e)} "${label(e)}": ${msg}`); } };
  for (const e of document.body.querySelectorAll('*')) {
    if (out.length >= 8) break;
    if (e.closest('[data-clip-ok], [aria-hidden="true"], [inert], svg, script, style, template, noscript')) continue;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.display === 'contents' || cs.visibility !== 'visible') continue;
    const r = e.getBoundingClientRect();
    if ((!r.width && !r.height) || tiny(r.width, r.height, cs)) continue;
    let lo = Infinity, hi = -Infinity;
    for (const n of e.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.width) { lo = Math.min(lo, q.left); hi = Math.max(hi, q.right); }
    }
    const text = hi > lo;
    if (text && !/^(INPUT|TEXTAREA|SELECT|OPTION)$/.test(e.tagName)) {
      // Chữ của phần tử inline thuộc hộp của khối gần nhất chứa nó
      let box = e, bs = cs;
      while (bs.display === 'inline' && box.parentElement) { box = box.parentElement; bs = getComputedStyle(box); }
      const b = box === e ? r : box.getBoundingClientRect();
      const over = Math.max(hi - (b.right - parseFloat(bs.borderRightWidth)), (b.left + parseFloat(bs.borderLeftWidth)) - lo);
      if (over > 2 && !tiny(b.width, b.height, bs) && bs.textOverflow !== 'ellipsis') add(box, `chữ tràn khung ${Math.round(over)}px`);
    }
    // Hộp tràn khỏi khối cha (cha không cắt, overflow visible): cột lưới 1fr giãn theo min-content, flex item không co, ảnh aspect-ratio giãn theo hàng.
    // Chữ vẫn nằm trong hộp của nó nên phép đo chữ ở trên không thấy; ảnh thì thấy hộp đè sang hàng xóm. Đo 4.5: cả hai lần B2 chỉ thấy khi mở ảnh.
    // Bỏ qua phần tử định vị tuyệt đối, có transform hay lề âm (tràn lề cố ý), và cha inline hoặc display:contents (không có hộp riêng)
    const par = e.parentElement;
    if (par && par !== document.body && !/^(absolute|fixed)$/.test(cs.position) && cs.transform === 'none' && cs.display !== 'inline' && !/^table/.test(cs.display)
      && parseFloat(cs.marginLeft) >= 0 && parseFloat(cs.marginRight) >= 0) {
      const ps = getComputedStyle(par);
      if (ps.overflowX === 'visible' && !/^(inline|contents)$/.test(ps.display) && !/^table/.test(ps.display)) {
        const pr = par.getBoundingClientRect();
        const inner = [pr.left + parseFloat(ps.borderLeftWidth) + parseFloat(ps.paddingLeft), pr.right - parseFloat(ps.borderRightWidth) - parseFloat(ps.paddingRight)];
        const over = Math.max(r.right - inner[1], inner[0] - r.left);
        if (over > 2 && pr.width >= 2) add(e, `tràn khỏi khối cha ${name(par)} ${Math.round(over)}px`);
      }
    }
    if (text || e.matches('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab]')) {
      for (let p = e.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'visible') continue;
        if (ox !== 'hidden' && ox !== 'clip') break;
        const pr = p.getBoundingClientRect();
        if (tiny(pr.width, pr.height, getComputedStyle(p)) || r.right <= pr.left || r.left >= pr.right) break;
        const cut = Math.max(r.right - pr.right, pr.left - r.left);
        if (cut > 2) { add(e, `bị cắt ${Math.round(cut)}px (khung ${name(p)})`); break; }
      }
    }
  }
  return out;
}
// Trang rộng hơn khung: tìm phần tử gây ra, là phần tử đầu tiên vượt mép phải trên đường từ body xuống (cha còn trong khung), không bị khối nào cắt.
// Đo 4.5: chỉ báo "trang rộng 2540px" nên cả hai lần B2 phải tự dò phần tử (trang thử, mở ảnh cả trang)
function wideCheck() {
  const W = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth <= W) return [];
  const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const right = e => e.getBoundingClientRect().right + scrollX;
  const clipped = e => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).overflowX !== 'visible') return true; return false; };
  const out = [];
  for (const e of document.body.querySelectorAll('*')) {
    if (out.length >= 3) break;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.position === 'fixed' || right(e) <= W + 1) continue;
    if (e.parentElement !== document.body && right(e.parentElement) > W + 1) continue;
    if (clipped(e)) continue;
    out.push(`${name(e)} tới ${Math.round(right(e))}px`);
  }
  return out;
}
const BROWSER = findBrowser();
if (!BROWSER) { console.error('Không tìm thấy Edge, Chrome hay Chromium. Đặt biến QA_BROWSER hoặc khoá "browser" trong _qa/qa.config.json.'); process.exit(4); }

// CDP_PORT chỉ là cách ép cổng bằng tay (tuỳ chọn). Không đặt thì để hệ điều hành chọn cổng trống (--remote-debugging-port=0)
// rồi đọc cổng thật từ DevToolsActivePort trong hồ sơ: nhiều lần chạy song song không bao giờ đụng cổng nhau
const fixedPort = +process.env.CDP_PORT || 0;
let port = fixedPort;
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Ép cổng bằng tay mà cổng đã có trình duyệt khác (thường là trình duyệt sót từ lần chạy trước) thì dừng hẳn: chạy tiếp là điều khiển nhầm trình duyệt đó
if (fixedPort) try { await fetch(`http://127.0.0.1:${port}/json/version`); console.error(`Cổng ${port} đã có trình duyệt khác. Tắt trình duyệt còn sót (hồ sơ cdp-* trong thư mục tạm) rồi chạy lại.`); process.exit(3); } catch {}
const prof = mkdtempSync(join(tmpdir(), 'cdp-'));
// Linux: /dev/shm của container thường chỉ 64 MB nên trình duyệt dễ sập; chạy bằng root (Docker, VPS) thì Chrome không khởi động nếu thiếu --no-sandbox.
// QA_BROWSER_ARGS: cờ thêm cho trình duyệt, ví dụ "--no-sandbox" khi container không cho dùng sandbox dù không chạy bằng root
const linux = process.platform === 'linux';
const extraArgs = [...(linux ? ['--disable-dev-shm-usage'] : []), ...(linux && process.getuid?.() === 0 ? ['--no-sandbox'] : []),
  ...(process.env.QA_BROWSER_ARGS || '').split(/\s+/).filter(Boolean)];
const proc = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${fixedPort}`, `--user-data-dir=${prof}`, '--no-first-run', ...extraArgs, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
// Giữ phần cuối stderr của trình duyệt: không kết nối được thì in ra để biết lý do
let berr = '';
proc.stderr.on('data', d => { berr = (berr + d).slice(-2000); });
proc.on('error', e => { berr += '\n' + e.message; });
// Cổng do hệ điều hành chọn: đợi trình duyệt ghi DevToolsActivePort (dòng đầu là cổng), cùng ngân sách ~9 giây với vòng /json bên dưới
if (!fixedPort) {
  for (let i = 0; i < 60 && !port; i++) {
    try { port = +readFileSync(join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0] || 0; } catch {}
    if (!port) await sleep(150);
  }
}
let target;
for (let i = 0; i < 60 && port && !target; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = l.find(t => t.type === 'page'); } catch {} await sleep(150); }
if (!target) {
  const why = berr.trim().split('\n').filter(l => l.trim()).slice(-2).join(' | ').slice(-300);
  console.error(`Không kết nối được trình duyệt ở cổng ${port}: ${BROWSER}` + (why ? `\n  ${why}` : ''));
  proc.kill();
  try { rmSync(prof, { recursive: true, force: true }); } catch {}
  process.exit(2);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); let errors = [];
// Theo dõi lúc trang tải xong (Page.loadEventFired) để không đo khi trang chưa dựng xong hay đang chuyển trang.
// QA_LOAD_TIMEOUT: trần đợi một lần tải, tính bằng ms (mặc định 20000)
let navigating = false, mainFrame = null;
const loadWaiters = [];
const LOAD_TIMEOUT = +process.env.QA_LOAD_TIMEOUT || 20000;
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method === 'Page.frameStartedLoading' && m.params.frameId === mainFrame) navigating = true;
  // Chuyển trong cùng tài liệu (link #, location.hash, pushState, tel:, mailto:) chỉ có frameStoppedLoading, không có loadEventFired
  if (m.method === 'Page.loadEventFired' || (m.method === 'Page.frameStoppedLoading' && m.params.frameId === mainFrame)) { navigating = false; loadWaiters.splice(0).forEach(f => f()); }
  if (m.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n').slice(0, 3).join(' | '));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('ERR ' + m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) errors.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const waitLoad = ms => new Promise(r => { const t = setTimeout(r, ms); loadWaiters.push(() => { clearTimeout(t); r(); }); });
// Bơm lõi màu và phép đo vào trang trước mỗi lần đo: trang có thể vừa chuyển. probes.js tự bỏ qua khi đã có
const inject = async () => { if (!PROBE_SRC) return false; for (const src of PROBE_SRC) await send('Runtime.evaluate', { expression: src }); return true; };
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
// File tải xuống (nút xuất) lưu trong hồ sơ tạm, xoá cùng hồ sơ khi chạy xong; mặc định headless lưu vào Downloads của máy
await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: join(prof, 'downloads') });
mainFrame = (await send('Page.getFrameTree')).result?.frameTree?.frame?.id ?? null;
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === '1' });
// QA_QUERY: tham số thêm cho mọi bộ, ví dụ ?theme=dark để chạy lại các bộ trên một theme khác
const extra = (process.env.QA_QUERY || '').replace(/^\?/, '');
// Tham số mẫu: "query" của file bước nếu có (bộ viết tay); không thì <meta name="qa-query"> của trang, đọc ở mỗi lần chạy nên sửa thẻ meta là
// bộ khói nhận ngay (đo 4.5: qa_init.py chép query vào file bước lúc cài, sửa trang sau đó không có tác dụng), cộng "query_add" (?data= của bộ dữ liệu)
const pageQuery = () => {
  const tag = (readFileSync(file, 'utf8').match(/<meta\b[^>]*\bname\s*=\s*["']qa-query["'][^>]*>/i) || [''])[0];
  const c = (tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i) || [])[1] || '';
  return c.trim() ? '?' + c.trim().replace(/&amp;/g, '&').replace(/^\?/, '') : '';
};
const baseQuery = steps.query !== undefined ? steps.query : pageQuery();
const addQuery = [steps.query_add, extra].filter(Boolean).join('&');
const qs = baseQuery ? baseQuery + (addQuery ? '&' + addQuery : '') : (addQuery ? '?' + addQuery : '');
// Nền sáng/tối không theo máy đang chạy: ép prefers-color-scheme theo tham số của lần chạy (có theme=dark thì tối, còn lại sáng)
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: /[?&]theme=dark(&|$)/.test(qs) ? 'dark' : 'light' }] });
// Đợi trang tải xong rồi mới chạy bước: script trong <head> tải chậm (CDN) chặn dựng trang, đo sớm thì document.body còn null.
// Vẫn đợi tối thiểu 2,2 giây như trước để font và CSS nạp muộn kịp áp.
const loaded = waitLoad(LOAD_TIMEOUT);
await send('Page.navigate', { url: pathToFileURL(resolve(file)).href + qs });
await Promise.all([loaded, sleep(2200)]);
navigating = false; // tài nguyên treo không bao giờ tải xong: chỉ đợi một lần, không đợi lại ở mọi bước
// Theme theo tên (?theme=<tên>, themes.css): prefers-color-scheme theo --theme-mode của theme đang bật, để phần theo media của trang khớp theme
const tm = (await send('Runtime.evaluate', { expression: `getComputedStyle(document.documentElement).getPropertyValue('--theme-mode').replace(/["'\\s]/g, '')`, returnByValue: true })).result?.result?.value;
if (tm === 'dark' || tm === 'light') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: tm }] });
const report = [{ step: 'load', errors: errors.slice().concat(PROBE_SRC ? [] : ['PROBES thiếu color.js hoặc probes.js cạnh run.mjs: chạy qa_init.py --update']), check: null, dims: null }];
for (const s of steps.steps) {
  errors = [];
  if (s.js) { const r = await send('Runtime.evaluate', { expression: s.js, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('STEP ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text).split('\n')[0]); }
  await sleep(s.wait || 450);
  if (navigating) { await waitLoad(LOAD_TIMEOUT); navigating = false; } // bước vừa chuyển trang: đợi trang mới tải xong rồi mới kiểm
  let val = null;
  if (s.check) { const r = await send('Runtime.evaluate', { expression: s.check, returnByValue: true }); val = r.result?.result?.value; }
  // Đo tương phản và màu theo ý định ở mọi bước (probes.js); lỗi của phép đo thành một dòng, không làm hỏng cả bước
  const probed = await inject();
  const safe = f => `(()=>{try{return __qa.${f}()}catch(e){return ['LỖI ĐO '+e.message]}})()`;
  const measure = probed ? `,contrast:${safe('contrast')},intent:${safe('intent')}` : '';
  const dimsReply = await send('Runtime.evaluate', { expression: `JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,cut:(${layoutCheck})(),wide:(${wideCheck})()${measure}})`, returnByValue: true });
  const dims = dimsReply.result?.result?.value;
  // Không đo được (trang chưa có body, đang chuyển trang): báo lỗi ở bước này, không làm sập cả bộ
  if (dims === undefined) errors.push('EVAL không đo được bố cục: ' + String(dimsReply.result?.exceptionDetails?.exception?.description || dimsReply.error?.message || 'không có giá trị').split('\n')[0]);
  // QA_NOSHOT: bỏ chụp ảnh (quick.py); bước vẫn chạy và vẫn kiểm như cũ
  if (s.shot && !process.env.QA_NOSHOT) {
    const opt = { format: s.jpeg ? 'jpeg' : 'png' };
    if (s.jpeg) opt.quality = 82;
    let box = null;
    if (s.clip) {
      // clip của Page.captureScreenshot tính theo toạ độ tài liệu, getBoundingClientRect theo khung nhìn: cộng phần đã cuộn,
      // không thì trang đã cuộn (bước cuộn tới một khối) cho ảnh lệch đúng bằng khoảng cuộn, phía trên trống
      const r = await send('Runtime.evaluate', { expression: `JSON.stringify((function(){var e=document.querySelector(${JSON.stringify(s.clip)});if(!e)return null;var b=e.getBoundingClientRect();return {x:b.left+scrollX,y:b.top+scrollY,width:b.width,height:b.height}})())`, returnByValue: true });
      box = JSON.parse(r.result?.result?.value ?? 'null');
      if (box) opt.clip = Object.assign(box, { scale: s.scale || 1 });
      // Khung chưa có (pha "thấy đỏ" của evolve-site) hay selector sai: báo lỗi ở bước này, không sập cả bộ
      else errors.push('SHOT không thấy khung clip ' + s.clip);
    }
    const ext = s.jpeg ? '.jpg' : '.png';
    if (!s.clip && (s.full || s.slices)) {
      // Cả trang: chụp theo toạ độ tài liệu, vượt khung nhìn. Trình duyệt giới hạn ảnh khoảng 16 000px nên cắt ở 15 000px
      const m = (await send('Page.getLayoutMetrics')).result || {};
      const size = m.cssContentSize || m.contentSize || { width: +w, height: +h };
      const vw = (await send('Runtime.evaluate', { expression: 'document.documentElement.clientWidth', returnByValue: true })).result?.result?.value || +w;
      const total = Math.min(Math.ceil(size.height), 15000);
      // captureBeyondViewport không cuộn trang: phần hiện dần khi cuộn tới (IntersectionObserver + opacity) ra ảnh trống mà phép đo vẫn sạch
      // (đo 4.5: cả hai lần B4 vấp). Cuộn qua cả phần sẽ chụp từng nửa màn như người xem, đợi chuyển động chạy xong, rồi về chỗ cũ mới chụp.
      // behavior 'instant' để scroll-behavior:smooth của trang không làm chậm từng lần cuộn
      const upto = s.full ? total : Math.min(total, (s.slices === true ? 12 : +s.slices) * +h);
      const at = (await send('Runtime.evaluate', { expression: 'scrollY', returnByValue: true })).result?.result?.value || 0;
      for (let y = 0; y < upto; y += Math.ceil(+h / 2)) {
        await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${y}, behavior: 'instant' })` });
        await sleep(120);
      }
      await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${at}, behavior: 'instant' })` });
      await sleep(700);
      const shoot = async (y, height, name) => {
        const sh = await send('Page.captureScreenshot', { ...opt, captureBeyondViewport: true, clip: { x: 0, y, width: vw, height, scale: 1 } });
        writeFileSync(join(outdir, name + ext), Buffer.from(sh.result.data, 'base64'));
      };
      if (s.full) await shoot(0, total, s.shot);
      else {
        const n = Math.min(Math.ceil(total / +h), s.slices === true ? 12 : +s.slices);
        for (let i = 0; i < n; i++) await shoot(i * +h, Math.min(+h, total - i * +h), s.shot + (i ? '-' + (i + 1) : ''));
      }
    } else if (!s.clip || box) {
      const sh = await send('Page.captureScreenshot', opt);
      writeFileSync(join(outdir, s.shot + ext), Buffer.from(sh.result.data, 'base64'));
    }
  }
  report.push({ step: s.name, errors, check: val, dims: dims === undefined ? null : JSON.parse(dims) });
}
// Lượt kiểm sâu (deep.mjs): chỉ khi QA_DEEP=1. Tải lại trang giữa các phép đo để phép này không làm lệch phép kia.
// Lỗi console trong lượt sâu (bấm một control làm trang ném lỗi) ghi vào bước deep; handover.py so với mốc (qadiff deep_errors).
// Lỗi lúc tải trang lặp lại ở mỗi lần tải lại: đã ghi ở bước load nên không ghi lại; lỗi trùng trong lượt sâu chỉ ghi một lần
if (process.env.QA_DEEP === '1') {
  const url = pathToFileURL(resolve(file)).href + qs;
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
  const reload = async () => { const l = waitLoad(LOAD_TIMEOUT); await send('Page.navigate', { url }); await Promise.all([l, sleep(1200)]); navigating = false; await inject(); };
  errors = [];
  let d = null;
  try {
    await reload();
    const { deep } = await import(pathToFileURL(join(HERE, 'deep.mjs')).href);
    d = await deep({ send, sleep, reload, evaluate });
  } catch (e) { errors.push('DEEP ' + String(e && e.message || e).split('\n')[0]); }
  const seen = new Set(report[0].errors);
  report.push({ step: 'deep', errors: errors.filter(x => !seen.has(x) && seen.add(x)), check: null, dims: null, deep: d });
}
console.log(JSON.stringify(report, null, 1));
ws.close();
// Đóng cả trình duyệt qua CDP. proc.kill() chỉ tắt tiến trình khởi động; trên Windows trình duyệt thật chạy tiếp, giữ cổng và hồ sơ
try {
  const bws = new WebSocket((await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl);
  await new Promise(r => bws.addEventListener('open', r));
  bws.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  for (let i = 0; i < 20; i++) { await sleep(150); try { await fetch(`http://127.0.0.1:${port}/json/version`); } catch { break; } }
} catch {}
proc.kill();
// Xoá hồ sơ trình duyệt tạm của lần chạy này; trình duyệt có lúc chưa nhả file ngay: thử lại tối đa 6 lần
for (let i = 0; i < 6; i++) { await sleep(400); try { rmSync(prof, { recursive: true, force: true }); break; } catch {} }
process.exit(0);
