// Lượt kiểm sâu của run.mjs (QA_DEEP=1; handover.py bật cho mỗi trang một bộ khổ desktop, qalib.py chọn). Ba phép đo, mỗi phép một danh sách dòng lỗi:
//   states       chữ của control dưới ngưỡng tương phản khi di chuột (hover) hoặc khi focus bằng bàn phím
//   keyboard     control không Tab tới được · widget không có đường vào bằng bàn phím · widget roving (tablist, menu, listbox…)
//                mà phím mũi tên không chạy · control tự dựng mang trạng thái mà Enter và Space không đổi gì
//   interactive  control hứa trạng thái (aria-pressed/expanded/checked/selected/sort, role switch/tab/option…) mà bấm không đổi gì ·
//                trạng thái đổi mà nhìn không khác (thuộc tính lật, kiểu dáng y nguyên, icon con không đổi)
// Phần tử gắn data-demo-state là bản vẽ một trạng thái (trang _system.html), không phải control thật: không đo.
// Trần để lượt kiểm không quá lâu: 40 control (states), 8 widget và 10 control (keyboard), 15 control (interactive).
// Ý tưởng rút từ plugin87/ux-ui-agent-skills (verify_states, verify_keyboard, verify_interactive; MIT), viết lại cho CDP.
const KEYS = { Tab: [9, 'Tab'], Enter: [13, 'Enter'], ' ': [32, 'Space'], ArrowRight: [39, 'ArrowRight'], ArrowDown: [40, 'ArrowDown'] };

export async function deep({ send, sleep, reload, evaluate }) {
  const out = { states: [], keyboard: [], interactive: [] };
  const q = x => JSON.stringify(x);
  const key = async k => {
    const [code, id] = KEYS[k];
    const base = { key: k, code: id, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code };
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(k === 'Enter' ? { text: '\r' } : k === ' ' ? { text: ' ' } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    await sleep(60);
  };
  const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
  const center = s => evaluate(`(() => { const e = document.querySelector(${q(s)}); if (!e) return null;
    e.scrollIntoView({ block: 'center', inline: 'center' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  // Tắt chuyển động để đo đúng trạng thái cuối, không đo lúc màu còn đang chuyển
  const still = () => evaluate(`(() => { if (document.getElementById('__qa-still')) return; const s = document.createElement('style'); s.id = '__qa-still';
    s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.appendChild(s); })()`);

  // 1. Tương phản khi hover và khi focus bằng bàn phím
  await still();
  await key('Tab'); // bật chế độ bàn phím, để focus bằng mã cũng hiện :focus-visible
  for (const t of (await evaluate('__qa.targets(40)')) || []) {
    const p = await center(t.sel);
    if (!p) continue;
    await mouse('mouseMoved', p[0], p[1]);
    await sleep(60);
    const h = await evaluate(`__qa.contrastOf(${q(t.sel)})`);
    if (h) out.states.push('hover ' + h);
    await mouse('mouseMoved', 0, 0);
    const f = await evaluate(`(() => { const e = document.querySelector(${q(t.sel)}); if (!e) return ''; e.focus(); const r = __qa.contrastOf(${q(t.sel)}); e.blur(); return r; })()`);
    if (f) out.states.push('focus ' + f);
  }

  // 2a. Mọi control trong vòng Tab phải Tab tới được
  await reload();
  const want = (await evaluate('__qa.tabbables().length')) || 0;
  await evaluate('document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0)');
  let wrapped = false;
  for (let i = 0; i < Math.min(want + 10, 150); i++) {
    await key('Tab');
    if (await evaluate('__qa.markActive()')) { wrapped = true; break; }
  }
  // Đi hết trần mà chưa quay vòng thì không phân biệt được control không tới được với control chưa tới lượt, nên không báo
  if (wrapped) for (const x of (await evaluate('__qa.unreached()')) || []) out.keyboard.push('không Tab tới được ' + x);

  // 2b. Widget nhiều mục: phải có đường vào bằng bàn phím; hứa phím mũi tên (roving) thì mũi tên phải chạy
  for (const c of ((await evaluate('__qa.composites()')) || []).slice(0, 8)) {
    if (c.orphan) { out.keyboard.push('widget không có đường vào bằng bàn phím ' + c.name); continue; }
    if (!c.roving) continue;
    await reload();
    const before = await evaluate(`__qa.enterComposite(${q(c.sel)})`);
    if (before === null || before === undefined) continue;
    await key('ArrowRight');
    let after = await evaluate(`__qa.compositeState(${q(c.sel)})`);
    if (after === before) { await key('ArrowDown'); after = await evaluate(`__qa.compositeState(${q(c.sel)})`); }
    if (after === before) out.keyboard.push('phím mũi tên không chạy trong ' + c.name);
  }

  // 2c. Control tự dựng mang trạng thái: Enter hoặc Space phải đổi trạng thái
  for (const c of (await evaluate('__qa.customStateful(10)')) || []) {
    await reload();
    const s0 = await evaluate(`__qa.focusState(${q(c.sel)})`);
    if (s0 === null || s0 === undefined) continue;
    await key('Enter');
    let s1 = await evaluate(`__qa.focusState(${q(c.sel)}, true)`);
    if (s1 === s0) { await key(' '); s1 = await evaluate(`__qa.focusState(${q(c.sel)}, true)`); }
    if (s1 === s0) out.keyboard.push('Enter và Space không đổi trạng thái của ' + c.name);
  }

  // 3. Bấm thật từng control hứa trạng thái, mỗi control trên một lần tải mới: control này không che lỗi của control kia
  for (const c of (await evaluate('__qa.stateful(15)')) || []) {
    await reload();
    await still();
    const p = await center(c.sel);
    if (!p) continue;
    await mouse('mouseMoved', p[0], p[1]);
    await sleep(60);
    const before = await evaluate(`__qa.snap(${q(c.sel)})`);
    if (!before) continue;
    await mouse('mousePressed', p[0], p[1]);
    await mouse('mouseReleased', p[0], p[1]);
    await sleep(350);
    const after = await evaluate(`__qa.snap(${q(c.sel)})`);
    if (!after) continue; // phần tử biến mất hoặc trang đã chuyển: có đổi
    const same = after.own === before.own && after.look === before.look;
    if (!after.mut && after.focus === before.focus && same) out.interactive.push(`bấm mà không đổi gì ${c.name} (${c.state})`);
    else if (after.own !== before.own && after.look === before.look) out.interactive.push(`đổi trạng thái mà nhìn không khác ${c.name} (${before.own} → ${after.own})`);
  }
  return out;
}
