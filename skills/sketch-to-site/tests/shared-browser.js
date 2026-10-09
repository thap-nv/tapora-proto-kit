// Một trình duyệt chung cho cả file test: mở browser.mjs trước test đầu, đặt QA_CDP cho mọi run.mjs con, tắt sau test cuối.
// Không có trình duyệt thì không đặt gì: run.mjs tự báo mã 4 và test tự skip như cũ. Test cần tự mở trình duyệt thì truyền env QA_CDP: ''
const { before, after } = require('node:test');
const { spawn } = require('node:child_process');
const path = require('node:path');

const BROWSER = path.resolve(__dirname, '..', 'templates', 'qa-kit', 'browser.mjs');

module.exports = function useSharedBrowser() {
  let p = null, exit = null;
  before(async () => {
    const flags = +process.versions.node.split('.')[0] < 22 ? ['--experimental-websocket'] : [];
    p = spawn(process.execPath, [...flags, BROWSER], { stdio: ['pipe', 'pipe', 'ignore'] });
    exit = new Promise(r => p.on('close', r));
    const url = await new Promise(r => {
      let out = '';
      p.stdout.on('data', d => { out += d; if (out.includes('\n')) r(out.split('\n')[0].trim()); });
      p.on('close', () => r(''));
      setTimeout(() => r(''), 20000).unref();
    });
    if (url) process.env.QA_CDP = url;
    else { try { p.kill(); } catch {} p = null; }
  });
  after(async () => {
    delete process.env.QA_CDP;
    if (p) { try { p.stdin.end(); } catch {} await exit; }
  });
};
