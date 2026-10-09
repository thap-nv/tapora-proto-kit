// Một trình duyệt chung cho cả lệnh. Mở một lần, các lần run.mjs gắn vào qua biến QA_CDP (mỗi lần một ngữ cảnh riêng: localStorage, cookie trống),
// thay vì mỗi lần mở một trình duyệt mới: khởi động cộng tạo và xoá hồ sơ chiếm hơn nửa CPU của một lần chạy (đo 09/10/2026).
// Chạy CLI: node browser.mjs → in một dòng http://127.0.0.1:<cổng> rồi giữ tới khi stdin đóng (bên gọi xong việc, hoặc chết) → đóng trình duyệt, xoá hồ sơ, thoát 0.
// Không có trình duyệt: thoát 4. Từ JS: import { startBrowser } → { url, close() }.
// Node 20 cần cờ --experimental-websocket: thiếu cờ thì script tự chạy lại chính nó với cờ. Node 22 trở lên có sẵn WebSocket.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './launch.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// Lệnh cha đã mở trình duyệt chung (QA_CDP, ví dụ check.mjs gọi shots.mjs, hay bộ test) thì dùng lại, close() không làm gì; CLI thì luôn mở mới.
// Node 20 chưa có WebSocket trong tiến trình này: mở chính file này làm tiến trình con (tự thêm cờ), đóng bằng cách đóng stdin của nó
export async function startBrowser({ reuse = true } = {}) {
  if (reuse && process.env.QA_CDP) return { url: process.env.QA_CDP, port: +new URL(process.env.QA_CDP).port, close: async () => {}, shared: true };
  if (typeof WebSocket === 'undefined') {
    const p = spawn(process.execPath, ['--experimental-websocket', fileURLToPath(import.meta.url)], { stdio: ['pipe', 'pipe', 'inherit'] });
    const exit = new Promise(r => p.on('close', r));
    const url = await new Promise(r => { let o = ''; p.stdout.on('data', d => { o += d; if (o.includes('\n')) r(o.split('\n')[0].trim()); }); p.on('close', () => r('')); });
    if (!url) throw Object.assign(new Error('Không mở được trình duyệt chung'), { code: 4 });
    return { url, port: +new URL(url).port, close: async () => { try { p.stdin.end(); } catch {} await exit; } };
  }
  let cfg = {};
  try { cfg = JSON.parse(readFileSync(join(HERE, 'qa.config.json'), 'utf8')); } catch {}
  const b = await launch({ cfg });
  return { url: `http://127.0.0.1:${b.port}`, port: b.port, close: b.close };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  if (typeof WebSocket === 'undefined' && !process.env.QA_WS_FLAG) {
    const r = spawnSync(process.execPath, ['--experimental-websocket', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
      { stdio: 'inherit', env: { ...process.env, QA_WS_FLAG: '1' } });
    process.exit(r.status ?? 1);
  }
  let b;
  try { b = await startBrowser({ reuse: false }); } catch (e) { console.error(e.message); process.exit(e.code || 1); }
  let closing = null;
  const stop = code => closing ??= b.close().then(() => process.exit(code));
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) process.on(sig, () => stop(130));
  process.on('uncaughtException', e => { console.error(e?.stack || e); stop(1); });
  // stdin đóng khi bên gọi đóng ống hoặc chết (kể cả bị giết trên Windows): không có trình duyệt mồ côi
  process.stdin.on('end', () => stop(0));
  process.stdin.on('close', () => stop(0));
  process.stdin.on('error', () => stop(0));
  process.stdin.resume();
  process.stdout.write(b.url + '\n');
}
