#!/usr/bin/env python3
"""Kiểm cơ giới cho prototype HTML của sketch-to-site (bước B7).

Cách dùng:
    python preflight.py <file.html | thư-mục> [...] [--kind site|app]
    python preflight.py --font "Be Vietnam Pro" "Outfit"
    python preflight.py --selftest
    python preflight.py --deps          # skill phụ thuộc có đủ chưa (SKILL.md mục 9)

Thoát mã 1 khi còn LỖI. Mã kiểm và ý nghĩa: references/qa-gate.md mục 1.
Chỉ dùng thư viện chuẩn. Duyệt thư mục bằng os.walk, không glob (đường dẫn có
dấu [ ] như "[Tool]" làm glob trả rỗng mà không báo gì).
"""
import argparse
import csv
import io
import math
import os
import re
import sys
import tempfile
from html.parser import HTMLParser
from urllib.parse import unquote_plus

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
SKILLS_DIR = os.path.normpath(os.path.join(HERE, "..", ".."))


def skill_roots():
    # Nơi một skill có thể được cài: cạnh sketch-to-site (cùng plugin hay cùng thư mục skills), thư mục skills của dự án
    # (đi ngược từ thư mục đang đứng), của người dùng, và plugin đã cài của Claude Code
    roots = [SKILLS_DIR]
    d = os.getcwd()
    while True:
        roots += [os.path.join(d, s) for s in (".claude/skills", ".agents/skills", ".codex/skills")]
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    home = os.path.expanduser("~")
    roots += [os.path.join(home, s) for s in (".claude/skills", ".agents/skills", ".codex/skills")]
    cache = os.path.join(home, ".claude", "plugins", "cache")
    if os.path.isdir(cache):
        for mk in os.listdir(cache):
            for pl in os.listdir(os.path.join(cache, mk)) if os.path.isdir(os.path.join(cache, mk)) else []:
                vdir = os.path.join(cache, mk, pl)
                for ver in sorted(os.listdir(vdir), reverse=True) if os.path.isdir(vdir) else []:
                    roots.append(os.path.join(vdir, ver, "skills"))
    seen, out = set(), []
    for r in roots:
        r = os.path.normpath(r)
        if r not in seen and os.path.isdir(r):
            seen.add(r)
            out.append(r)
    return out


def find_skill(name):
    return next((os.path.join(r, name) for r in skill_roots() if os.path.isdir(os.path.join(r, name))), None)


_UIUX = find_skill("ui-ux-pro-max")
FONTS_CSV = os.path.join(_UIUX or os.path.join(SKILLS_DIR, "ui-ux-pro-max"), "data", "google-fonts.csv")

ERROR, WARN = "LỖI", "CẢNH BÁO"

# Đồng bộ với SKILL.md mục 9. (mức, skill, file bắt buộc phải có bên trong)
DEPS = [
    ("🔴 bắt buộc", "ui-ux-pro-max", ["scripts/search.py", "data/google-fonts.csv"]),
    ("🟠 nên chép", "laws-of-ux-checklist", ["SKILL.md"]),
    ("🟠 nên chép", "laws-of-ux-review", ["SKILL.md"]),
    ("🟠 nên chép", "laws-of-ux", ["references/ux-laws-complete.md", "references/code-patterns.md"]),
    ("🟠 nên chép", "design-taste-frontend", ["SKILL.md"]),
    ("🟠 nên chép", "huashu-design", ["references/brand-asset-protocol.md", "references/design-styles.md"]),
    ("🟡 theo phong cách", "high-end-visual-design", ["SKILL.md"]),
    ("🟡 theo phong cách", "minimalist-ui", ["SKILL.md"]),
    ("🟡 theo phong cách", "industrial-brutalist-ui", ["SKILL.md"]),
    ("🟡 theo phong cách", "gpt-taste", ["SKILL.md"]),
    ("⚪ tuỳ chọn", "stitch-design-taste", ["SKILL.md"]),
    ("⚪ tuỳ chọn", "redesign-existing-projects", ["SKILL.md"]),
    ("⚪ tuỳ chọn", "full-output-enforcement", ["SKILL.md"]),
]

VI_CHARS = re.compile(r"[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", re.I)
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF☀-⛿✀-✒✙-➿⬀-⯿️]"
)
DASHES = re.compile("[—–]")
PLACEHOLDER_NAMES = re.compile(r"lorem ipsum|john doe|jane doe|nguyễn văn a\b|\bacme\b|\bnexus\b", re.I)
CLICHES = re.compile(
    r"nâng tầm|liền mạch|đột phá|kỷ nguyên mới|giải phóng tiềm năng|cách mạng hoá|cách mạng hóa|"
    r"\belevate\b|\bseamless\b|\bunleash\b|next-gen|game-changer|revolutioni[sz]e|\bdelve\b|\btapestry\b",
    re.I,
)
RAW_RULES = [
    ("P03", ERROR, re.compile(r"\bh-screen\b|height\s*:\s*100vh"), "Dùng min-h-[100dvh] thay h-screen/100vh (iOS Safari nhảy khung)"),
    ("P04", ERROR, re.compile(r"addEventListener\(\s*['\"]scroll['\"]|\.onscroll\s*="), "Cấm lắng nghe scroll; dùng IntersectionObserver hoặc CSS scroll-driven"),
    ("P05", ERROR, re.compile(r"#000000\b|#000(?![0-9a-fA-F])|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|\bbg-black\b|\btext-black\b"), "Đen thuần; dùng off-black (#0A0A0A, zinc-950)"),
    ("P13", WARN, re.compile(r"href\s*=\s*['\"]#['\"]"), "Link trơn href=\"#\"; trỏ tới đích thật hoặc aria-disabled"),
    ("P14", WARN, re.compile(r"z-\[9999\]|z-index\s*:\s*9999"), "z-index tuỳ tiện; dùng thang lớp của hệ thống"),
]
MOTION = re.compile(r"@keyframes|\banimation\s*:|\btransition\s*:|\btransition(-\w+)?\b|\banimate-\w+|gsap|\.animate\(")
REDUCED = re.compile(r"prefers-reduced-motion|motion-reduce:|motion-safe:")
GENERIC_FONTS = {
    "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded", "sans-serif", "serif", "monospace",
    "cursive", "fantasy", "inherit", "initial", "unset", "-apple-system", "blinkmacsystemfont", "segoe ui",
    "helvetica neue", "helvetica", "arial", "apple color emoji", "segoe ui emoji", "segoe ui symbol",
    "noto color emoji", "sf pro display", "sf pro text", "sf mono", "menlo", "monaco", "consolas",
    "courier new", "courier", "times new roman", "georgia", "phosphor", "lucide",
}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


def load_fonts():
    if not os.path.exists(FONTS_CSV):
        return None
    with open(FONTS_CSV, encoding="utf-8") as fh:
        return {r["Family"].lower(): r for r in csv.DictReader(fh)}


def line_of(src, idx):
    return src.count("\n", 0, idx) + 1


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.texts = []          # (line, text) — chữ hiển thị
        self.alts = []           # (line, alt)
        self.img_no_alt = []     # line
        self.skip = 0
        self.sections = 0
        self.eyebrows = []       # line
        self.html_lang = False
        self.viewport = False
        self.stack = []
        self.candidate = None    # (tag, depth, line)
        self.pending = None      # line của eyebrow vừa đóng, chờ xem thẻ kế là heading

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if self.pending is not None:
            if tag in ("h1", "h2", "h3"):
                self.eyebrows.append(self.pending)
            self.pending = None
        if tag in ("script", "style", "noscript", "template"):
            self.skip += 1
        if tag == "html" and a.get("lang"):
            self.html_lang = True
        if tag == "meta" and (a.get("name") or "").lower() == "viewport":
            self.viewport = True
        if tag == "section":
            self.sections += 1
        if tag == "img":
            if "alt" not in a:
                self.img_no_alt.append(line)
            elif a.get("alt"):
                self.alts.append((line, a["alt"]))
        cls = a.get("class") or ""
        if (self.candidate is None and tag in ("p", "span", "div", "small", "strong")
                and re.search(r"\buppercase\b", cls) and re.search(r"\btracking-", cls)):
            self.candidate = (tag, len(self.stack), line)
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "template") and self.skip:
            self.skip -= 1
        if tag in VOID:
            return
        while self.stack:
            top = self.stack.pop()
            if top == tag:
                break
        if self.candidate and self.candidate[0] == tag and len(self.stack) == self.candidate[1]:
            self.pending = self.candidate[2]
            self.candidate = None

    def handle_data(self, data):
        if not self.skip and data.strip():
            self.texts.append((self.getpos()[0], data.strip()))


def font_names(src):
    names = set()
    for m in re.finditer(r"fonts\.googleapis\.com/css2?\?([^\"')\s>]+)", src):
        q = m.group(1).replace("&amp;", "&")
        for part in re.findall(r"family=([^&]+)", q):
            for fam in part.split("|"):
                names.add(("google", unquote_plus(fam.split(":")[0]).strip()))
    for m in re.finditer(r"font-family\s*:\s*((?:\"[^\"]*\"|'[^']*'|[^;}\"'<>])+)", src):
        for fam in m.group(1).split(","):
            names.add(("css", fam.strip().strip("'\"").strip()))
    for m in re.finditer(r"fontFamily\s*:\s*\{([^}]*)\}", src):
        for a, b in re.findall(r"'([^']*)'|\"([^\"]*)\"", m.group(1)):   # ['"Be Vietnam Pro"', 'system-ui']
            names.add(("css", (a or b).strip().strip("'\"").strip()))
    return {(kind, n) for kind, n in names if re.search(r"[A-Za-z]", n) and not n.startswith("var(")}


def linked_assets(path, src):
    """CSS/JS cục bộ mà trang nạp (bỏ qua http/https/CDN)."""
    base = os.path.dirname(path)
    refs = re.findall(r"<link[^>]+rel=['\"]?stylesheet['\"]?[^>]*href=['\"]([^'\"]+)['\"]", src, re.I)
    refs += re.findall(r"<link[^>]+href=['\"]([^'\"]+\.css)['\"]", src, re.I)
    refs += re.findall(r"<script[^>]+src=['\"]([^'\"]+)['\"]", src, re.I)
    out = []
    for r in refs:
        if re.match(r"^(https?:)?//|^data:", r):
            continue
        f = os.path.normpath(os.path.join(base, r.split("?")[0].split("#")[0]))
        if os.path.isfile(f) and f not in out:
            out.append(f)
    return out


def read(path):
    with open(path, encoding="utf-8", errors="replace") as fh:
        return fh.read()


def check_file(path, kind, fonts, seen_assets):
    src = read(path)
    out = []

    def add(code, level, line, msg, snip="", where=None):
        out.append((where or path, line, code, level, msg, snip))

    assets = [(a, read(a)) for a in linked_assets(path, src)]
    bundle = src + "\n".join(t for _, t in assets)   # để xét chuyển động + reduced-motion trên cả trang

    p = PageParser()
    p.feed(src)
    visible = p.texts + p.alts
    has_vi = any(VI_CHARS.search(t) for _, t in p.texts)

    for line, t in visible:
        if EMOJI.search(t):
            add("P01", ERROR, line, "Emoji trong chữ hiển thị/alt; dùng icon SVG", t[:60])
        if DASHES.search(t):
            add("P02", ERROR, line, "Gạch dài — hoặc – trong chữ hiển thị; dùng chấm, phẩy, hai chấm hoặc '-'", t[:60])
        if PLACEHOLDER_NAMES.search(t):
            add("P06", ERROR, line, "Nội dung giữ chỗ/tên chung chung", PLACEHOLDER_NAMES.search(t).group(0))
        if CLICHES.search(t):
            add("P12", WARN, line, "Sáo ngữ AI", CLICHES.search(t).group(0))

    for code, level, rx, msg in RAW_RULES:
        for m in rx.finditer(src):
            add(code, level, line_of(src, m.start()), msg, m.group(0))
        for a, text in assets:                      # file dùng chung chỉ báo một lần
            if a in seen_assets:
                continue
            for m in rx.finditer(text):
                add(code, level, line_of(text, m.start()), msg, m.group(0), where=a)
    seen_assets.update(a for a, _ in assets)

    for line in p.img_no_alt:
        add("P08", ERROR, line, "<img> thiếu thuộc tính alt")

    if MOTION.search(bundle) and not REDUCED.search(bundle):
        m = MOTION.search(src)
        where, text = (path, src) if m else next(((a, t) for a, t in assets if MOTION.search(t)), (path, src))
        m = MOTION.search(text)
        add("P09", ERROR, line_of(text, m.start()), "Có chuyển động nhưng cả trang (kể cả CSS/JS nạp kèm) không có nhánh prefers-reduced-motion", m.group(0), where=where)

    if not p.html_lang:
        add("P10", ERROR, 1, "Thiếu <html lang=\"…\">")
    if not p.viewport:
        add("P10", ERROR, 1, "Thiếu <meta name=\"viewport\">")

    if kind == "site":
        limit = max(1, math.ceil(max(p.sections, 1) / 3))
        if len(p.eyebrows) > limit:
            add("P11", WARN, p.eyebrows[limit], f"Eyebrow {len(p.eyebrows)} cái > trần {limit} (= ⌈{p.sections} section / 3⌉)")

    for src_kind, name in sorted(font_names(bundle)):
        key = name.lower()
        if key in GENERIC_FONTS:
            continue
        row = fonts.get(key) if fonts else None
        if row is None:
            if src_kind == "google" or fonts is None:
                add("P15", WARN, 1, "Không tra được font trong dữ liệu Google Fonts; kiểm dấu tiếng Việt bằng tay", name)
            else:
                add("P15", WARN, 1, "Font không phải Google Fonts (Fontshare/tự host?); kiểm dấu tiếng Việt bằng tay", name)
        elif has_vi and "vietnamese" not in row["Subsets"]:
            add("P07", ERROR, 1, f"Font không có subset vietnamese (có: {row['Subsets']})", name)
    return out


def collect(paths):
    files = []
    for p in paths:
        if os.path.isdir(p):
            for root, dirs, names in os.walk(p):
                dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "_archive")]
                files += [os.path.join(root, n) for n in sorted(names) if n.lower().endswith((".html", ".htm"))]
        elif os.path.isfile(p):
            files.append(p)
        else:
            print(f"Không thấy: {p}")
    return files


def run(paths, kind, quiet=False):
    fonts = load_fonts()
    files = collect(paths)
    if not files:
        print("Không có file HTML nào để kiểm — kiểm lại đường dẫn.")
        return 2, []
    findings, seen_assets, keys = [], set(), set()
    for f in files:
        for x in check_file(f, kind, fonts, seen_assets):
            k = (x[0], x[1], x[2], x[4])            # cùng chỗ, cùng mã: chỉ báo một lần
            if k not in keys:
                keys.add(k)
                findings.append(x)
    if not quiet:
        if fonts is None:
            print(f"⚠ Không thấy dữ liệu font ở {FONTS_CSV}; P07 không chạy được, mọi font thành P15.")
        for path, line, code, level, msg, snip in sorted(findings, key=lambda x: (x[0], x[1], x[2])):
            snip = " ".join(str(snip).split())
            tail = f"  «{snip}»" if snip else ""
            print(f"{os.path.relpath(path)}:{line}  {code}  {level:8}  {msg}{tail}")
        n_err = sum(1 for x in findings if x[3] == ERROR)
        n_warn = len(findings) - n_err
        print(f"\n{len(files)} file · {n_err} lỗi · {n_warn} cảnh báo · kiểu kiểm: {kind}")
    return (1 if any(x[3] == ERROR for x in findings) else 0), findings


def font_lookup(names):
    fonts = load_fonts()
    if fonts is None:
        print(f"Không thấy {FONTS_CSV}")
        return 2
    bad = 0
    for n in names:
        row = fonts.get(n.lower())
        if row is None:
            print(f"{n:28} ?   không có trong dữ liệu Google Fonts — kiểm tay")
            bad = 1
        elif "vietnamese" in row["Subsets"]:
            print(f"{n:28} VI  {row['Category']}")
        else:
            print(f"{n:28} --  KHÔNG có dấu tiếng Việt (có: {row['Subsets']})")
            bad = 1
    return bad


def check_deps():
    print("Tìm skill ở:\n  " + "\n  ".join(skill_roots()) + "\n")
    missing_hard, n_missing = False, 0
    for level, name, must in DEPS:
        base = find_skill(name)
        lack = [m for m in must if not (base and os.path.isfile(os.path.join(base, m)))]
        if not base:
            state = "THIẾU"
        elif lack:
            state = "THIẾU FILE " + ", ".join(lack)
        else:
            state = "✓ " + os.path.dirname(base)
        if not state.startswith("✓"):
            n_missing += 1
            missing_hard |= level.startswith("🔴")
        print(f"{level:20} {name:28} {state}")
    print(f"\n{len(DEPS) - n_missing}/{len(DEPS)} có đủ." + (" Thiếu mức 🔴: sketch-to-site KHÔNG chạy đủ được." if missing_hard else ""))
    return 1 if missing_hard else 0


BAD_PAGE = """<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
<style>.hero{height:100vh;transition: opacity .3s} body{color:#000} .x{font-family:'Satoshi',sans-serif} .m{z-index:9999}</style>
</head><body>
<section><p class="uppercase tracking-widest">Giới thiệu</p><h2>Bơi cùng chúng tôi 🏊</h2>
<p>Nâng tầm trải nghiệm — học bơi liền mạch cho John Doe</p><img src="a.jpg"><a href="#">Xem</a></section>
<section><span class="uppercase tracking-[0.2em]">Khoá học</span><h2>Lịch học</h2></section>
<section><h2>Lorem ipsum</h2></section>
<script>window.addEventListener('scroll', () => {});</script>
</body></html>"""

CLEAN_PAGE = """<!doctype html><html lang="vi"><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap" rel="stylesheet">
<script>tailwind.config={theme:{extend:{fontFamily:{sans:['"Be Vietnam Pro"', 'system-ui']}}}}</script>
<style>.hero{min-height:100dvh;transition: opacity .3s} body{color:#18181B;font-family:'Be Vietnam Pro',system-ui,sans-serif}
@media (prefers-reduced-motion: reduce){*{transition:none!important}}</style>
</head><body>
<section><p class="uppercase tracking-widest">Giới thiệu</p><h2>Bơi cùng Trần Minh Khoa</h2>
<p>Lớp 4 học viên, 45 phút mỗi buổi. Giá 1.250.000 ₫ cho 12 buổi.</p><img src="a.jpg" alt="Bể bơi trong nhà"><a href="/lich">Xem lịch</a></section>
<section><h2>Lịch học</h2><p>Ca 08:00-09:00, thứ Hai đến thứ Sáu.</p></section>
<section><h2>Đăng ký</h2><img src="b.jpg" alt=""></section>
</body></html>"""


def selftest():
    if not os.path.exists(FONTS_CSV):
        print(f"THIẾU PHỤ THUỘC: không thấy {FONTS_CSV}\n"
              "sketch-to-site cần skill ui-ux-pro-max nằm cùng thư mục skills (P07 tra dấu tiếng Việt từ đó).")
        return 1
    expected = {"P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14", "P15"}
    with tempfile.TemporaryDirectory() as d:
        bad, clean = os.path.join(d, "bad.html"), os.path.join(d, "clean.html")
        with open(bad, "w", encoding="utf-8") as fh:
            fh.write(BAD_PAGE)
        with open(clean, "w", encoding="utf-8") as fh:
            fh.write(CLEAN_PAGE)
        _, f_bad = run([bad], "site", quiet=True)
        _, f_clean = run([clean], "site", quiet=True)
        _, f_bad_app = run([bad], "app", quiet=True)
        # CSS nạp kèm: lỗi nằm trong file .css phải bị bắt, và báo một lần dù hai trang cùng nạp
        linked_dir = os.path.join(d, "linked")
        os.makedirs(linked_dir)
        with open(os.path.join(linked_dir, "app.css"), "w", encoding="utf-8") as fh:
            fh.write(".btn{transition: transform .2s}\n.ink{color:#000}\n")
        for name in ("a.html", "b.html"):
            with open(os.path.join(linked_dir, name), "w", encoding="utf-8") as fh:
                fh.write(CLEAN_PAGE.replace("@media (prefers-reduced-motion: reduce){*{transition:none!important}}", "")
                         .replace(".hero{min-height:100dvh;transition: opacity .3s}", "")
                         .replace("</head>", '<link rel="stylesheet" href="app.css"></head>'))
        _, f_linked = run([linked_dir], "site", quiet=True)
    linked_codes = [x[2] for x in f_linked]
    linked_ok = linked_codes.count("P09") == 1 and linked_codes.count("P05") == 1
    got = {x[2] for x in f_bad}
    missing = sorted(expected - got)
    noisy = sorted({x[2] for x in f_clean})
    app_ok = "P11" not in {x[2] for x in f_bad_app}
    print(f"Trang hỏng: {len(got)}/{len(expected)} mã kêu" + (f" — THIẾU {missing}" if missing else " ✓"))
    print("Trang sạch: " + (f"kêu nhầm {noisy}" if noisy else "im ✓"))
    print("--kind app bỏ P11: " + ("✓" if app_ok else "KHÔNG"))
    if not app_ok:
        print("  (P11 vẫn kêu ở chế độ app)")
    print("CSS nạp kèm (P09, P05 báo đúng 1 lần cho file dùng chung): " + ("✓" if linked_ok else f"KHÔNG — được {linked_codes}"))
    for x in f_clean:
        print("  nhầm:", x[2], x[4], x[5])
    return 0 if not missing and not noisy and app_ok and linked_ok else 1


def main():
    ap = argparse.ArgumentParser(description="Kiểm cơ giới prototype HTML (sketch-to-site B7)")
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--kind", choices=["site", "app"], default="site")
    ap.add_argument("--font", nargs="+", metavar="TÊN")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--deps", action="store_true", help="kiểm các skill mà sketch-to-site phụ thuộc")
    a = ap.parse_args()
    if a.selftest:
        sys.exit(selftest())
    if a.deps:
        sys.exit(check_deps())
    if a.font:
        sys.exit(font_lookup(a.font))
    if not a.paths:
        ap.print_help()
        sys.exit(2)
    code, _ = run(a.paths, a.kind)
    sys.exit(code)


if __name__ == "__main__":
    main()
