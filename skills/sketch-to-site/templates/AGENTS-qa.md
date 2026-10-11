## Kiểm thử prototype

> Mẫu từ `sketch-to-site/templates/AGENTS-qa.md`. Chép vào `AGENTS.md` (Codex, nhiều agent) hoặc `CLAUDE.md` của dự án, thay `<thư-mục-prototype>`.

Chạy từ `<thư-mục-prototype>`, thư mục chứa `_qa/`. Cần Python 3, Node 20 trở lên, Edge hoặc Chrome.

- **Sau mỗi lần sửa:** `python _qa/quick.py --note "<sửa gì, ở đâu>"`.
  - Lệnh chạy preflight và chỉ các bộ của trang nạp file đã đổi, không chụp ảnh, rồi so với `_qa/current/`.
  - Yêu cầu: 0 lỗi console, 0 FAIL, 0 tràn ngang mới, 0 chữ tràn hoặc bị cắt mới trong khung *(cố ý thì gắn `data-clip-ok="<lý do>"` vào khung; không dùng để làm im lỗi)*, 0 tương phản mới, 0 màu sai ý định mới *(dòng `nợ cũ` chỉ in ra, không chặn)*. Mỗi `check` đổi giá trị phải giải thích được bằng chính thay đổi vừa làm.
  - `--shots` chụp thêm ảnh các bộ đã chạy và in thư mục cùng tên từng ảnh *(lát của trang dài kèm tiêu đề trong lát; dòng cuối nêu ảnh nào đổi so với lần `--shots` trước)*; `--dry` để xem bộ nào sẽ chạy; `--all` để chạy mọi bộ.
- **Bẻ thử bước phủ định** của bộ kiểm tính năng: `python _qa/breaktest.py <bộ> <file> "<chuỗi cũ>" "<chuỗi mới>"`. Lệnh tạm thay chuỗi, chạy bộ, trả file lại như cũ rồi chạy lại; bộ phải kêu khi bẻ và im khi trả lại.
- **Windows:** lệnh `python` tự viết mà in tiếng Việt thì đặt `PYTHONIOENCODING=utf-8` trước lệnh, không thì console (cp1252) dừng giữa chừng với `UnicodeEncodeError`.
- **Trước khi bàn giao, gửi link hay commit:** skill `handover-check`.
  - `python _qa/handover.py ledger`: in gọn các lần sửa từ lần bàn giao trước.
  - `python _qa/handover.py run --dry`: in ước lượng *(bộ chạy, bộ lấy lại từ mốc, phút, ảnh)* và checklist trước lệnh dài; không mở trình duyệt.
  - `python _qa/handover.py run`: mọi bộ ở mọi theme, so với `_qa/last-green/`. Có mốc thì chỉ chạy bộ có file đổi, bộ khác lấy lại báo cáo của mốc *(dòng `Lấy lại từ last-green`, không có ảnh mới)*; `--full` chạy hết. Ảnh ghi ra thư mục tạm của máy, chỉ về `_qa/handover/<ngày-giờ>/` khi xong; lần chạy cũ tự bị bỏ ảnh *(giữ 2 lần gần nhất, giữ mọi báo cáo)*.
  - **Ước lượng từ 8 phút: chạy nền ngay từ đầu**, kết quả ra file *(`> _qa/qa-check.log 2>&1`)*, chờ báo xong rồi đọc file. Không gọi thường với `timeout` rồi đợi hết giờ: lệnh bị cắt để lại trình duyệt sót.
  - `python _qa/handover.py promote _qa/handover/<ngày-giờ>`: chỉ chạy sau khi người dùng chốt.
- **Chọn skill theo cỡ việc:** `tweak-site` cho sửa nhỏ không dính quyền, dữ liệu hay logic · `evolve-site` cho tính năng mới và thay đổi có rủi ro · `handover-check` trước bàn giao.
- **Cấu hình:** `_qa/qa.config.json` gồm trang, theme (theme đầu là mặc định), bộ kiểm, các bước tự đổi giá trị giữa các lần chạy (`noisy`), `workers` *(số bộ chạy song song)*, và `page_themes` *(`{"<trang hay thư mục bề mặt>": [theme…]}`: trang chỉ dùng một theme thì không chạy theme kia)*.
- **Màu và theme:** sửa `site/assets/themes.json` rồi chạy `node <skills>/sketch-to-site/scripts/themes.mjs <thư-mục-prototype>`; không sửa `themes.css` bằng tay. Thêm theme: thêm một mục vào `themes`, chạy lệnh, rồi `qa_init.py --update` in dòng cần thêm vào `qa.config.json`.
- **Trang design system:** `site/_system.html`. Component mới thêm vào đó, đủ trạng thái; bộ khói của trang này đo mọi cặp màu ở mọi theme.
- **Màn app mobile** (`<html data-surface="app">`): bộ khói có bước `tap-targets` đo vùng chạm ở khổ 390; theme `android` (`?platform=android`) kiểm giao diện Android.
- **Thêm bộ kiểm:** viết `_qa/steps-<khoá>.json`, rồi khai báo `[tên, trang, khoá, khổ]` ở `suites`.
  - Trang mới: một bộ khói ở mỗi khổ `desktop`, `tablet`, `mobile` *(màn app bỏ `tablet`)*. Trang đọc `?id=` thì trang có `<meta name="qa-query" content="?id=<mã>">`: `run.mjs` đọc thẻ đó ở mỗi lần chạy, file bước chỉ ghi `"query"` khi cần tham số khác.
  - Mỗi bước có dạng `{name, js, wait, check, shot, jpeg}`; `check` là biểu thức JS.
  - Trả chuỗi bắt đầu bằng `FAIL` là lỗi. Có `check` mà không trả giá trị cũng tính là lỗi.
- **`run.mjs` thoát mã 2:** trình duyệt đã chạy nhưng không trả lời; dòng cuối của thông báo là lỗi của chính trình duyệt. Trên Linux hay container, thêm cờ qua `QA_BROWSER_ARGS`, ví dụ `QA_BROWSER_ARGS="--no-sandbox"`.
- **Máy lag khi chạy bộ kiểm:** mỗi lệnh (`quick.py`, `handover.py`, `breaktest.py`, `run_all.py`) chỉ mở một trình duyệt headless cho mọi bộ của nó, mỗi bộ một ngữ cảnh riêng; cả Python, node và trình duyệt chạy ở ưu tiên thấp. `QA_WORKERS=2` *(hay `"workers"` trong cấu hình)* giảm số bộ chạy song song; `QA_BROWSERS=2` để cả máy chỉ mở tối đa 2 trình duyệt cùng lúc. RAM trống dưới ngưỡng *(`QA_MIN_FREE_MB`, mặc định 4 GB hay 15 %)* thì bộ kiểm tạm nghỉ, quá 2 phút thì dừng với dòng `máy thiếu bộ nhớ, k bộ chưa chạy`: đóng bớt chương trình rồi chạy lại, không có bộ "lỗi chạy" rỗng.
  - `qa_init.py` đã loại thư mục ảnh và mốc của bộ kiểm khỏi `files.watcherExclude` và `search.exclude` trong `.vscode/settings.json` của workspace; lệnh báo *đã thêm mẫu* thì **mở lại cửa sổ VS Code** trước khi chạy tổng. Windows: VS Code còn sinh nhiều `rg.exe` khi bộ kiểm ghi file *(checklist của `--dry` đếm)*; chất đống thì `taskkill /IM rg.exe /F`, hoặc chạy tổng với `QA_RG_WATCHDOG=1` *(mỗi 15 giây dừng `rg.exe` của VS Code sống quá 20 giây, chỉ `rg`)*.
- **`run.mjs` thoát mã 3:** chỉ gặp khi đặt `CDP_PORT` bằng tay mà cổng đó đang bị một trình duyệt khác giữ (không đặt thì hệ điều hành tự chọn cổng). Tắt các trình duyệt headless còn sót (hồ sơ `cdp-*` trong thư mục tạm) rồi chạy lại.
