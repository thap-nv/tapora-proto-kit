## Kiểm thử prototype

> Mẫu từ `sketch-to-site/templates/AGENTS-qa.md`. Chép vào `AGENTS.md` (Codex, nhiều agent) hoặc `CLAUDE.md` của dự án, thay `<thư-mục-prototype>`.

Chạy từ `<thư-mục-prototype>`, thư mục chứa `_qa/`. Cần Python 3, Node 20 trở lên, Edge hoặc Chrome.

- **Sau mỗi lần sửa:** `python _qa/quick.py --note "<sửa gì, ở đâu>"`.
  - Lệnh chạy preflight và chỉ các bộ của trang nạp file đã đổi, không chụp ảnh, rồi so với `_qa/current/`.
  - Yêu cầu: 0 lỗi console, 0 FAIL, 0 tràn ngang mới, 0 chữ tràn hoặc bị cắt mới trong khung *(cố ý thì gắn `data-clip-ok="<lý do>"` vào khung; không dùng để làm im lỗi)*. Mỗi `check` đổi giá trị phải giải thích được bằng chính thay đổi vừa làm.
  - `--dry` để xem bộ nào sẽ chạy; `--all` để chạy mọi bộ.
- **Trước khi bàn giao, gửi link hay commit:** skill `handover-check`.
  - `python _qa/handover.py run`: mọi bộ ở mọi theme, so với `_qa/last-green/`.
  - `python _qa/handover.py promote _qa/handover/<ngày-giờ>`: chỉ chạy sau khi người dùng chốt.
- **Chọn skill theo cỡ việc:** `tweak-site` cho sửa nhỏ không dính quyền, dữ liệu hay logic · `evolve-site` cho tính năng mới và thay đổi có rủi ro · `handover-check` trước bàn giao.
- **Cấu hình:** `_qa/qa.config.json` gồm trang, theme (theme đầu là mặc định), bộ kiểm, và các bước tự đổi giá trị giữa các lần chạy (`noisy`).
- **Màn app mobile** (`<html data-surface="app">`): bộ khói có bước `tap-targets` đo vùng chạm ở khổ 390; theme `android` (`?platform=android`) kiểm giao diện Android.
- **Thêm bộ kiểm:** viết `_qa/steps-<khoá>.json`, rồi khai báo `[tên, trang, khoá, khổ]` ở `suites`.
  - Trang mới: một bộ khói ở mỗi khổ `desktop`, `tablet`, `mobile` *(màn app bỏ `tablet`)*. Trang đọc `?id=` thì file bước có `"query": "?id=<mã>"`.
  - Mỗi bước có dạng `{name, js, wait, check, shot, jpeg}`; `check` là biểu thức JS.
  - Trả chuỗi bắt đầu bằng `FAIL` là lỗi. Có `check` mà không trả giá trị cũng tính là lỗi.
- **`run.mjs` thoát mã 2:** trình duyệt đã chạy nhưng không trả lời; dòng cuối của thông báo là lỗi của chính trình duyệt. Trên Linux hay container, thêm cờ qua `QA_BROWSER_ARGS`, ví dụ `QA_BROWSER_ARGS="--no-sandbox"`.
- **`run.mjs` thoát mã 3:** cổng gỡ lỗi đang bị một trình duyệt khác giữ. Tắt các trình duyệt headless còn sót (hồ sơ `cdp-*` trong thư mục tạm) rồi chạy lại.
