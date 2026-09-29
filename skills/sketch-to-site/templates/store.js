// Store dữ liệu dùng chung cho mọi trang của prototype: tạo đơn ở trang này thì trang khác thấy ngay, F5 không mất.
// Mẫu từ sketch-to-site/templates/store.js. Chép vào site/assets/store.js, nạp sau data.js ở mọi trang dùng dữ liệu:
//   <script src="assets/data.js"></script><script src="assets/store.js"></script>
// data.js khai báo dữ liệu mẫu: window.SEED = { orders: [...], customers: [...] }.
// Không fetch('data.json'): trang mở bằng file:// thì trình duyệt chặn.
// Bản làm việc lưu ở localStorage theo KEY. Thêm bộ dữ liệu mới vào SEED thì store tự bổ sung khi nạp.
// Đổi cấu trúc bản ghi đã có (đổi tên, đổi kiểu, bỏ trường): tăng số phiên bản trong KEY để bỏ bản cũ.
// Thêm ?reset vào URL của một trang bất kỳ để quay về dữ liệu mẫu, ví dụ trước buổi demo.
(() => {
  const KEY = 'proto:v1'; // đổi "proto" thành slug của dự án: mọi trang mở từ file:// dùng chung một localStorage
  const copy = x => x === undefined ? x : JSON.parse(JSON.stringify(x));
  const subs = [];
  let data = null;
  const load = () => {
    if (data) return data;
    const seed = window.SEED || {};
    try {
      if (/[?&]reset\b/.test(location.search)) localStorage.removeItem(KEY);
      data = JSON.parse(localStorage.getItem(KEY)) || copy(seed);
    } catch { data = copy(seed); } // localStorage bị chặn hoặc hỏng: chạy trong bộ nhớ, không báo lỗi console
    for (const k in seed) if (!(k in data)) data[k] = copy(seed[k]);
    return data;
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
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
