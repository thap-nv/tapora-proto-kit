// Mở và đóng trình duyệt headless cho bộ kiểm. run.mjs dùng khi chạy một mình; browser.mjs dùng để mở một trình duyệt chung cho cả lệnh.
// Trình duyệt: biến QA_BROWSER, rồi "browser" trong qa.config.json, rồi tự dò Edge/Chrome/Chromium theo hệ điều hành.
// launch() trả { port, browser, close }. Lỗi ném ra có .code: 4 không có trình duyệt, 3 CDP_PORT đã bị giữ, 2 trình duyệt không trả lời.
import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir, setPriority, constants } from 'node:os';
import { createServer } from 'node:net';
import { join, delimiter } from 'node:path';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fail = (code, msg) => Object.assign(new Error(msg), { code });

export function findBrowser(cfg = {}) {
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

// Hạ tiến trình này xuống Below normal (nice 10 trên Linux, macOS): trình duyệt mở từ đây nhận mức này, nên chỉ dùng CPU khi máy rảnh.
// Bộ test mở nhiều trình duyệt cùng lúc từng làm laptop lag. QA_PRIORITY=normal giữ mức thường
export const LOW = process.env.QA_PRIORITY !== 'normal';
export function lowerPriority() { if (LOW) try { setPriority(constants.priority.PRIORITY_BELOW_NORMAL); } catch {} }

// Hồ sơ mới mỗi lần mở nên trình duyệt làm lại việc của lần mở đầu: extension có sẵn, cập nhật thành phần, mạng nền, dịch, đồng bộ.
// Tắt hết: đo 09/10/2026 (Edge, trang 2 bước) từ 11,8 xuống 5,2 giây-lõi CPU mỗi lần chạy, renderer từ 8 xuống 2, thời gian như cũ
const LEAN = ['--disable-extensions', '--disable-component-extensions-with-background-pages', '--disable-component-update', '--disable-background-networking',
  '--disable-default-apps', '--disable-sync', '--disable-client-side-phishing-detection', '--disable-breakpad', '--metrics-recording-only', '--no-default-browser-check',
  '--disable-features=Translate,OptimizationHints,MediaRouter'];

export async function launch({ cfg = {} } = {}) {
  const BROWSER = findBrowser(cfg);
  if (!BROWSER) throw fail(4, 'Không tìm thấy Edge, Chrome hay Chromium. Đặt biến QA_BROWSER hoặc khoá "browser" trong _qa/qa.config.json.');
  lowerPriority();
  // QA_BROWSERS=n: tối đa n trình duyệt mở cùng lúc trên cả máy, mọi lệnh cộng lại (laptop: 2). Không đặt thì không giới hạn.
  // Mỗi chỗ là một cổng cục bộ 39217, 39218…, giữ tới khi tiến trình thoát. Tiến trình chết thì hệ điều hành nhả cổng, nên không chỗ nào kẹt lại
  const SLOTS = Math.floor(+process.env.QA_BROWSERS) || 0;
  let slot = null;
  const take = p => new Promise(ok => { const s = createServer(); s.once('error', () => ok(null)); s.listen(p, '127.0.0.1', () => ok(s.unref())); });
  while (SLOTS > 0 && !slot) {
    for (let i = 0; i < SLOTS && !slot; i++) slot = await take(39217 + i);
    if (!slot) await sleep(200 + Math.random() * 300);
  }
  // Hồ sơ (và thư mục tải cdp-dl-*) của lần chạy bị giết giữa chừng (hết giờ của bên gọi, cửa sổ bị tắt) không kịp xoá. Không lần chạy nào kéo dài 2 giờ, nên hồ sơ đúng
  // dạng tên của mkdtemp mà 2 giờ không đổi là đồ sót. Mỗi lần xoá tối đa 20 cái cho nhanh; file trình duyệt còn giữ thì để lần sau
  let swept = 0;
  try {
    for (const n of readdirSync(tmpdir())) {
      if (swept >= 20) break;
      if (!/^cdp-(dl-)?[A-Za-z0-9]{6}$/.test(n)) continue;
      try { const p = join(tmpdir(), n); if (Date.now() - statSync(p).mtimeMs > 2 * 3600e3) { swept++; rmSync(p, { recursive: true, force: true }); } } catch {}
    }
  } catch {}

  // CDP_PORT chỉ là cách ép cổng bằng tay (tuỳ chọn). Không đặt thì để hệ điều hành chọn cổng trống (--remote-debugging-port=0)
  // rồi đọc cổng thật từ DevToolsActivePort trong hồ sơ: nhiều lần chạy song song không bao giờ đụng cổng nhau
  const fixedPort = +process.env.CDP_PORT || 0;
  let port = fixedPort;
  // Ép cổng bằng tay mà cổng đã có trình duyệt khác (thường là trình duyệt sót từ lần chạy trước) thì dừng hẳn: chạy tiếp là điều khiển nhầm trình duyệt đó
  if (fixedPort) {
    let taken = false;
    try { await fetch(`http://127.0.0.1:${port}/json/version`); taken = true; } catch {}
    if (taken) throw fail(3, `Cổng ${port} đã có trình duyệt khác. Tắt trình duyệt còn sót (hồ sơ cdp-* trong thư mục tạm) rồi chạy lại.`);
  }
  const prof = mkdtempSync(join(tmpdir(), 'cdp-'));
  // Linux: /dev/shm của container thường chỉ 64 MB nên trình duyệt dễ sập; chạy bằng root (Docker, VPS) thì Chrome không khởi động nếu thiếu --no-sandbox.
  // QA_BROWSER_ARGS: cờ thêm cho trình duyệt, ví dụ "--no-sandbox" khi container không cho dùng sandbox dù không chạy bằng root
  const linux = process.platform === 'linux';
  const extraArgs = [...(linux ? ['--disable-dev-shm-usage'] : []), ...(linux && process.getuid?.() === 0 ? ['--no-sandbox'] : []),
    ...(process.env.QA_BROWSER_ARGS || '').split(/\s+/).filter(Boolean)];
  const proc = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${fixedPort}`, `--user-data-dir=${prof}`, '--no-first-run', ...LEAN, ...extraArgs, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  // Giữ phần cuối stderr của trình duyệt: không kết nối được thì in ra để biết lý do
  let berr = '';
  proc.stderr.on('data', d => { berr = (berr + d).slice(-2000); });
  proc.on('error', e => { berr += '\n' + e.message; });

  // Đóng trình duyệt và xoá hồ sơ tạm, đúng một lần. Lần chạy bị giết hẳn thì không kịp: hồ sơ đó do lần mở sau dọn (ở trên)
  let closing = null, browserWs = null, calmTimer = null;
  const close = () => closing ??= (async () => {
    clearInterval(calmTimer);
    // Đóng cả trình duyệt qua CDP. proc.kill() chỉ tắt tiến trình khởi động; trên Windows trình duyệt thật chạy tiếp, giữ cổng và hồ sơ
    if (port) try {
      const bws = browserWs || await openBrowserWs(port);
      bws.send(JSON.stringify({ id: 1e9, method: 'Browser.close' }));
      for (let i = 0; i < 20; i++) { await sleep(150); try { await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) }); } catch { break; } }
    } catch {}
    proc.kill();
    // Trình duyệt có lúc chưa nhả file ngay: thử lại tối đa 6 lần
    for (let i = 0; i < 6; i++) { await sleep(400); try { rmSync(prof, { recursive: true, force: true }); break; } catch {} }
  })();

  // Cổng do hệ điều hành chọn: đợi trình duyệt ghi DevToolsActivePort (dòng đầu là cổng), cùng ngân sách ~9 giây với vòng /json bên dưới
  if (!fixedPort) {
    for (let i = 0; i < 60 && !port; i++) {
      try { port = +readFileSync(join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0] || 0; } catch {}
      if (!port) await sleep(150);
    }
  }
  let ready = false;
  for (let i = 0; i < 60 && port && !ready; i++) { try { ready = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).some(t => t.type === 'page'); } catch {} if (!ready) await sleep(150); }
  if (!ready) {
    const why = berr.trim().split('\n').filter(l => l.trim()).slice(-2).join(' | ').slice(-300);
    await close();
    throw fail(2, `Không kết nối được trình duyệt ở cổng ${port}: ${BROWSER}` + (why ? `\n  ${why}` : ''));
  }

  // Trình duyệt mở ở Below normal vẫn tự nâng tiến trình vẽ trang (renderer) về Normal và tiến trình GPU lên Above normal (đo 09/10/2026, Edge),
  // và nâng lại hay mở thêm tiến trình bất cứ lúc nào: hạ cả cây mỗi giây tới khi đóng. Danh sách pid lấy qua SystemInfo.getProcessInfo trên kết nối
  // của trình duyệt (webSocketDebuggerUrl của /json/version), vì kết nối của trang không được gắn vào trình duyệt (attachToBrowserTarget: "Not allowed")
  if (LOW) {
    try { browserWs = await openBrowserWs(port); } catch {}
    if (browserWs) {
      let id = 0; const pend = new Map(), calmSock = browserWs;
      calmSock.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
      calmSock.addEventListener('close', () => { clearInterval(calmTimer); });
      const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); try { calmSock.send(JSON.stringify({ id: i, method, params })); } catch { pend.delete(i); r({}); } });
      let calming = false;
      const calm = async () => {
        if (calming || closing) return;
        calming = true;
        try {
          for (const p of (await send('SystemInfo.getProcessInfo')).result?.processInfo || []) try { setPriority(p.id, constants.priority.PRIORITY_BELOW_NORMAL); } catch {}
        } catch {}
        calming = false;
      };
      calmTimer = setInterval(calm, 1000).unref();
      await calm();
    }
  }
  return { port, browser: BROWSER, close };
}

// Kết nối cấp trình duyệt (webSocketDebuggerUrl của /json/version), đã mở
export async function openBrowserWs(port) {
  const ws = new WebSocket((await (await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(3000) })).json()).webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', () => j(new Error('WebSocket tới trình duyệt không mở được'))); });
  return ws;
}
