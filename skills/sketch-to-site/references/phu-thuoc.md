# Phụ thuộc — chép sang dự án khác thì chép kèm

> Tách từ `sketch-to-site` SKILL.md mục 9 *(bản 4.5)*. Thêm một chỗ trỏ tới skill mới thì **thêm dòng ở đây và ở `DEPS` trong `preflight.py`**.

Kiểm nhanh: `python <skills>/sketch-to-site/scripts/preflight.py --deps` *(liệt kê skill thiếu theo mức; thoát mã 1 nếu thiếu mức 🔴)*. Script tìm skill ở thư mục cạnh `sketch-to-site`, ở `.claude/skills`, `.agents/skills`, `.codex/skills` của dự án và của thư mục người dùng, và trong plugin đã cài.
Gói `tapora-proto-kit` đã kèm mọi skill trong bảng. `huashu-design` trong gói là bản rút gọn, đã bỏ slide, animation, video và âm thanh.
Danh sách này **đo bằng grep** mọi tên skill xuất hiện trong thư mục `sketch-to-site/` (29/09, thêm `sketch-to-map` 06/10): 15 skill. Thêm một chỗ trỏ tới skill mới thì **thêm dòng ở đây và ở `DEPS` trong `preflight.py`**.

| Mức | Skill | Dùng ở | Thiếu thì sao |
|---|---|---|---|
| 🔴 **Bắt buộc** | `sketch-to-concept` | B0 *(Phần A: Cổng 1–2, `CONCEPT.md`)* | **Hỏng** khi dự án chưa có `CONCEPT.md`: không có bước lên concept |
| 🔴 | `ui-ux-pro-max` | `sketch-to-concept` A2 *(script tra token)* · B1 *(luật app)* · `preflight.py` P07 *(dữ liệu font, kiểm dấu tiếng Việt)* | **Hỏng**: không tra được, P07 thành P15, `--selftest` trả mã 1 |
| 🟠 **Nên chép** | `sketch-to-map` | Dự án lớn *(ngưỡng ở mục 0 của nó)*: bản đồ chức năng trước B2 *(`map/`)* · B3 `map.mjs slice` · B4 độ phủ trong `qa-check.py` | Dự án lớn không có bước bản đồ, không theo dõi chức năng hoãn; `qa-check.py` in dòng bỏ qua độ phủ |
| 🟠 | `laws-of-ux-checklist` | B4 bước 3 | Nhẹ: 12 điểm đã chép sẵn vào `qa-gate.md` mục 3 |
| 🟠 | `laws-of-ux-review` | Cổng 4 | Mất lựa chọn soát sâu 0–60 |
| 🟠 | `laws-of-ux` | Cổng 4, qua `laws-of-ux-review` | Review **không chạy được**: nó đọc `laws-of-ux/references/ux-laws-complete.md`. **Luôn chép cả ba `laws-of-ux*` cùng nhau** |
| 🟠 | `design-taste-frontend` | Site giới thiệu: luật bố cục §4.7, dấu hiệu AI §9, soát §14 · stack React §3 · soát site cũ §11 | Mất bản đầy đủ của luật bố cục. Bản tóm tắt ở `qa-gate.md` mục 4 vẫn dùng được |
| 🟠 | `huashu-design` | `sketch-to-concept`: tham chiếu là **thương hiệu có thật** *(`huashu-design/references/brand-asset-protocol.md`)*, nguồn chuẩn thật và kho 60 phong cách *(`huashu-design/references/design-styles.md`)*, tự chấm concept | Mất giao thức lấy logo/ảnh từ nguồn chính thức. Bản trong gói *(~0,3 MB)* giữ quy trình 3 hướng, giao thức tài sản thương hiệu, thư viện phong cách, khung thiết bị, `fetch_images.py`, `verify.py`; đã bỏ nhạc, âm thanh, video, slide *(31 MB)* |
| 🟡 **Theo phong cách** | `high-end-visual-design` | Họ *SaaS cao cấp* · *Hàng hiệu* · *Mềm mại* | Mất phần đọc sâu. Luật chính đã có trong `style-catalogue.md` |
| 🟡 | `minimalist-ui` | Họ *Tối giản* · *Editorial* | như trên |
| 🟡 | `industrial-brutalist-ui` | Họ *Brutalist* · *Cyberpunk* | như trên |
| 🟡 | `gpt-taste` | Họ *Awwwards* | như trên |
| ⚪ **Tuỳ chọn** *(đã nhúng sẵn)* | `stitch-design-taste` | B2: khuôn `DESIGN.md` *(cách viết tên + mã màu + vai trò)*. Skill gốc viết cho **Google Stitch**; các luật còn lại đã thua ở bảng mâu thuẫn dòng 2, 3, 4, 6, 9 | Không sao, khuôn ở `templates/DESIGN.md` |
| ⚪ | `redesign-existing-projects` | `sketch-to-concept` A2 khi tham chiếu là site cũ · điều hướng *(mục 0)* | Mất danh sách soát đầy đủ |
| ⚪ | `full-output-enforcement` | B3 | Không sao, luật đã ở mục 3 |

**Không phải skill mà vẫn cần:** Python 3 *(`preflight.py` và `ui-ux-pro-max` chỉ dùng thư viện chuẩn)* · Playwright **hoặc** Edge/Chrome headless để chụp màn hình · mạng *(Google Fonts, Tailwind CDN, Phosphor)* · công cụ `AskUserQuestion` cho các cổng *(không có thì viết câu hỏi ra và kết thúc lượt)* · `WebSearch`/`WebFetch` khi tham chiếu là brand hoặc URL.
