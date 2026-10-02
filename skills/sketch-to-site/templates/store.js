// Store dữ liệu dùng chung cho mọi trang của prototype: tạo đơn ở trang này thì trang khác thấy ngay, F5 không mất.
// Mẫu từ sketch-to-site/templates/store.js. Chép vào site/assets/store.js, nạp sau data.js ở mọi trang dùng dữ liệu:
//   <script src="assets/data.js"></script><script src="assets/store.js"></script>
// data.js khai báo dữ liệu mẫu: window.SEED = { orders: [...], customers: [...] }.
// Không fetch('data.json'): trang mở bằng file:// thì trình duyệt chặn.
// Bản làm việc lưu ở localStorage theo KEY. Thêm bộ dữ liệu mới vào SEED thì store tự bổ sung khi nạp.
// Đổi cấu trúc bản ghi đã có (đổi tên, đổi kiểu, bỏ trường): tăng số phiên bản trong KEY để bỏ bản cũ.
// Thêm ?reset vào URL của một trang bất kỳ để quay về dữ liệu mẫu, ví dụ trước buổi demo.
// ?data=empty: mọi danh sách rỗng · ?data=stress: danh sách dài, chữ dài, số lớn (window.SEED_STRESS nếu data.js khai, không thì tự sinh).
// Hai kịch bản này cho bộ kiểm và buổi demo; chỉ sống trong bộ nhớ của trang: không đọc, không ghi localStorage, không đụng dữ liệu demo.
(() => {
  const KEY = 'proto:v1'; // đổi "proto" thành slug của dự án: mọi trang mở từ file:// dùng chung một localStorage
  const copy = x => x === undefined ? x : JSON.parse(JSON.stringify(x));
  const SCENARIO = (new URLSearchParams(location.search).get('data') || '').toLowerCase();
  const LONG = ' Công ty Trách nhiệm Hữu hạn Thương mại Dịch vụ Kỹ thuật Xây dựng Miền Nam';
  const TEXT_KEY = /name|ten|title|tieu_?de|label|nhan|mo_?ta|desc|note|ghi_?chu|address|dia_?chi/i;
  const NUM_KEY = /amount|total|tong|price|gia|tien|value|so_?luong|qty/i;
  // Tự sinh dữ liệu dài: mỗi danh sách bản ghi thành ≥ 40 mục (mã thêm hậu tố để không trùng); mục đầu có chữ dài và số lớn
  function grow(seed) {
    const o = {};
    for (const k in seed) {
      const v = seed[k];
      if (!Array.isArray(v) || !v.length || typeof v[0] !== 'object') { o[k] = copy(v); continue; }
      o[k] = [];
      for (let i = 0; i < Math.max(40, v.length); i++) {
        const x = copy(v[i % v.length]);
        if (i >= v.length) for (const f of ['id', 'code', 'ma']) if (f in x) x[f] = typeof x[f] === 'number' ? x[f] + 100000 + i : `${x[f]}-s${i}`;
        if (i === 0) for (const f in x) {
          if (typeof x[f] === 'string' && TEXT_KEY.test(f)) x[f] += LONG;
          if (typeof x[f] === 'number' && NUM_KEY.test(f)) x[f] = 987654321;
        }
        o[k].push(x);
      }
    }
    return o;
  }
  function scenario(seed) {
    if (SCENARIO === 'empty') { const o = {}; for (const k in seed) o[k] = Array.isArray(seed[k]) ? [] : copy(seed[k]); return o; }
    if (SCENARIO === 'stress') return copy(window.SEED_STRESS || grow(seed));
    return null;
  }
  const subs = [];
  let data = null;
  const load = () => {
    if (data) return data;
    const seed = window.SEED || {};
    const scen = scenario(seed); if (scen) return (data = scen);
    try {
      if (/[?&]reset\b/.test(location.search)) localStorage.removeItem(KEY);
      data = JSON.parse(localStorage.getItem(KEY)) || copy(seed);
    } catch { data = copy(seed); } // localStorage bị chặn hoặc hỏng: chạy trong bộ nhớ, không báo lỗi console
    for (const k in seed) if (!(k in data)) data[k] = copy(seed[k]);
    return data;
  };
  const save = () => { if (SCENARIO === 'empty' || SCENARIO === 'stress') return; try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
  const emit = k => subs.forEach(f => f(k));
  window.store = {
    // Trả bản sao: sửa bản sao không lưu gì, muốn lưu thì dùng set hoặc update
    get: k => copy(load()[k]),
    set: (k, v) => { load()[k] = copy(v); save(); emit(k); },
    update: (k, fn) => window.store.set(k, fn(window.store.get(k))),
    reset: () => { try { localStorage.removeItem(KEY); } catch {} data = null; emit(null); },
    // f(k) chạy khi dữ liệu đổi, ở trang này hoặc ở tab khác; k là null khi mọi thứ có thể đã đổi
    on: f => { subs.push(f); },
  };
  addEventListener('storage', e => { if (e.key === KEY || e.key === null) { data = null; emit(null); } });
})();
