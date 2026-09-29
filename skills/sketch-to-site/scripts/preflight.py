#!/usr/bin/env python3
"""Kiểm cơ giới cho prototype HTML của sketch-to-site (bước B4) và bảng concept của sketch-to-concept (A3).

Cách dùng:
    python preflight.py <file.html | thư-mục> [...] [--kind site|app]
    python preflight.py <thư-mục> --save _qa/truoc/preflight.json      # lưu mốc trước khi sửa (evolve-site B1)
    python preflight.py <thư-mục> --compare _qa/truoc/preflight.json   # chỉ in lỗi mới so với mốc (evolve-site B4)
    python preflight.py --font "Be Vietnam Pro" "Outfit"
    python preflight.py --selftest
    python preflight.py --deps          # skill phụ thuộc có đủ chưa (SKILL.md mục 9)

Thoát mã 1 khi còn LỖI. Mã kiểm và ý nghĩa: references/qa-gate.md mục 1.
Chỉ dùng thư viện chuẩn. Duyệt thư mục bằng os.walk, không glob (đường dẫn có
dấu [ ] như "[Tool]" làm glob trả rỗng mà không báo gì).
"""
import argparse
import collections
import contextlib
import csv
import io
import json
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
    ("🔴 bắt buộc", "sketch-to-concept", ["SKILL.md", "templates/concept-board.html"]),
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
        self.viewport_content = ""
        self.surface = ""        # data-surface của <html>: "app" là màn app mobile (references/mobile-app.md)
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
        if tag == "html":
            self.surface = (a.get("data-surface") or "").lower()
        if tag == "meta" and (a.get("name") or "").lower() == "viewport":
            self.viewport = True
            self.viewport_content = a.get("content") or ""
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
    # Chuỗi trong ngoặc không được vượt < >: style="font-family:system-ui" không có ; thì dấu " đóng thuộc tính
    # không được ghép với dấu " kế tiếp trong HTML thành một "tên font"
    for m in re.finditer(r"font-family\s*:\s*((?:\"[^\"<>]*\"|'[^'<>]*'|[^;}\"'<>])+)", src):
        # var(--x, dự phòng) không phải tên font: bỏ cả cụm, kể cả var lồng nhau, trước khi tách theo dấu phẩy
        value = re.sub(r"var\([^)]*\)+", "", m.group(1))
        for fam in value.split(","):
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

    app_screen = p.surface == "app"
    if app_screen and p.viewport:
        vp = p.viewport_content.lower().replace(" ", "")
        if "viewport-fit=cover" not in vp:
            add("P16", WARN, 1, "Màn app thiếu viewport-fit=cover trong viewport: safe-area không chạy trên iPhone thật", p.viewport_content)
        if re.search(r"user-scalable=(no|0)|maximum-scale=1(\.0*)?(,|$)", vp):
            add("P17", WARN, 1, "Màn app chặn phóng to; người nhìn kém không phóng được", p.viewport_content)

    if kind == "site" and not app_screen:            # eyebrow là luật của site giới thiệu, không áp cho màn app
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


def shown(path):
    # Đường dẫn tương đối cho gọn. Windows: file khác ổ đĩa với thư mục hiện tại thì relpath lỗi, in đường dẫn đầy đủ
    try:
        return os.path.relpath(path)
    except ValueError:
        return os.path.abspath(path)


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
            print(f"{shown(path)}:{line}  {code}  {level:8}  {msg}{tail}")
        n_err = sum(1 for x in findings if x[3] == ERROR)
        n_warn = len(findings) - n_err
        print(f"\n{len(files)} file · {n_err} lỗi · {n_warn} cảnh báo · kiểu kiểm: {kind}")
    return (1 if any(x[3] == ERROR for x in findings) else 0), findings


def base_dir(paths):
    ab = [os.path.abspath(p) for p in paths]
    try:
        d = os.path.commonpath(ab)
    except ValueError:                                  # khác ổ đĩa: không có gốc chung
        return None
    return d if os.path.isdir(d) else os.path.dirname(d)


def finding_key(x, base):
    # Khớp theo file + mã + đoạn trích, bỏ số dòng: sửa file làm dòng xê dịch mà lỗi cũ vẫn là lỗi cũ
    path, _, code, _, _, snip = x
    try:
        rel = os.path.relpath(os.path.abspath(path), base) if base else os.path.abspath(path)
    except ValueError:
        rel = os.path.abspath(path)
    return rel.replace("\\", "/"), code, " ".join(str(snip).split())


def save_baseline(paths, findings, out):
    base = base_dir(paths)
    rows = [dict(zip(("file", "code", "snip"), finding_key(x, base)), level=x[3], msg=x[4]) for x in findings]
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(sorted(rows, key=lambda r: (r["file"], r["code"], r["snip"])), fh, ensure_ascii=False, indent=1)
    n_err = sum(1 for r in rows if r["level"] == ERROR)
    print(f"Đã lưu mốc: {len(rows)} mục ({n_err} lỗi có sẵn) → {out}")


def compare_baseline(paths, kind, baseline, quiet=False):
    # Chỉ in mục MỚI so với mốc; thoát mã 1 khi có lỗi mới. Lỗi cũ không tính, kể cả khi dòng đã xê dịch
    with open(baseline, encoding="utf-8") as fh:
        old = collections.Counter((r["file"], r["code"], r["snip"]) for r in json.load(fh))
    code, findings = run(paths, kind, quiet=True)
    if code == 2:
        return 2, []
    base, left, new = base_dir(paths), old.copy(), []
    for x in sorted(findings, key=lambda x: (x[0], x[1], x[2])):
        k = finding_key(x, base)
        if left[k] > 0:
            left[k] -= 1
        else:
            new.append(x)
    gone = sum(left.values())
    if not quiet:
        for path, line, c, level, msg, snip in new:
            snip = " ".join(str(snip).split())
            print(f"{shown(path)}:{line}  {c}  {level:8}  {msg}" + (f"  «{snip}»" if snip else ""))
        n_err = sum(1 for x in new if x[3] == ERROR)
        print(f"\nSo với mốc {baseline}: {n_err} lỗi mới · {len(new) - n_err} cảnh báo mới · "
              f"{sum(old.values()) - gone} mục cũ còn · {gone} mục cũ đã hết")
    return (1 if any(x[3] == ERROR for x in new) else 0), new


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
<style>.hero{min-height:100dvh;transition: opacity .3s} body{color:#18181B;font-family:'Be Vietnam Pro',system-ui,sans-serif} code{font-family:var(--mono, monospace)} .b{font-family:var(--brand, var(--app))}
@media (prefers-reduced-motion: reduce){*{transition:none!important}}</style>
</head><body>
<section><p class="uppercase tracking-widest">Giới thiệu</p><h2>Bơi cùng Trần Minh Khoa</h2>
<p>Lớp 4 học viên, 45 phút mỗi buổi. Giá 1.250.000 ₫ cho 12 buổi.</p><img src="a.jpg" alt="Bể bơi trong nhà"><a href="/lich">Xem lịch</a></section>
<section><h2>Lịch học</h2><p>Ca 08:00-09:00, thứ Hai đến thứ Sáu.</p></section>
<section><h2>Đăng ký</h2><img src="b.jpg" alt=""></section>
</body></html>"""


APP_PAGE = """<!doctype html><html lang="vi" data-surface="app" data-platform="ios"><head>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>body{color:#18181B;font-family:-apple-system,system-ui,sans-serif}</style>
</head><body>
<section><p class="uppercase tracking-widest">Hôm nay</p><h2>Đơn của bạn</h2><p>3 đơn đang giao, tổng 485.000 ₫.</p></section>
<section><p class="uppercase tracking-widest">Gợi ý</p><h2>Món quen</h2></section>
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
        # Màn app: 2 eyebrow trên 2 section vẫn không kêu P11; viewport thiếu viewport-fit và chặn phóng to thì kêu P16, P17
        app_dir = os.path.join(d, "app")
        os.makedirs(app_dir)
        with open(os.path.join(app_dir, "clean.html"), "w", encoding="utf-8") as fh:
            fh.write(APP_PAGE)
        _, f_app_clean = run([app_dir], "site", quiet=True)
        with open(os.path.join(app_dir, "bad.html"), "w", encoding="utf-8") as fh:
            fh.write(APP_PAGE.replace("viewport-fit=cover", "maximum-scale=1, user-scalable=no"))
        _, f_app = run([os.path.join(app_dir, "bad.html")], "site", quiet=True)
        # Mốc: dòng xê dịch không thành lỗi mới; thêm một emoji thì đúng 1 lỗi mới
        base_dir_ = os.path.join(d, "base")
        os.makedirs(base_dir_)
        page = os.path.join(base_dir_, "p.html")
        with open(page, "w", encoding="utf-8") as fh:
            fh.write(BAD_PAGE)
        _, f_base = run([base_dir_], "site", quiet=True)
        mark = os.path.join(d, "mark", "preflight.json")
        with contextlib.redirect_stdout(io.StringIO()):
            save_baseline([base_dir_], f_base, mark)
        with open(page, "w", encoding="utf-8") as fh:
            fh.write("\n\n" + BAD_PAGE)
        c_same, n_same = compare_baseline([base_dir_], "site", mark, quiet=True)
        with open(page, "w", encoding="utf-8") as fh:
            fh.write("\n\n" + BAD_PAGE.replace("<h2>Lịch học</h2>", "<h2>Lịch học ⭐</h2>"))
        c_new, n_new = compare_baseline([base_dir_], "site", mark, quiet=True)
    linked_codes = [x[2] for x in f_linked]
    app_codes = {x[2] for x in f_app}
    app_rules_ok = not f_app_clean and {"P16", "P17"} <= app_codes and "P11" not in app_codes
    mark_ok = c_same == 0 and not n_same and c_new == 1 and [x[2] for x in n_new] == ["P01"]
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
    print("Màn app (P16, P17 kêu; màn sạch im; không P11): " + ("✓" if app_rules_ok else
          f"KHÔNG — sạch kêu {sorted({x[2] for x in f_app_clean})}, hỏng kêu {sorted(app_codes)}"))
    print("Mốc --save/--compare (dòng xê dịch không tính; emoji mới = 1 lỗi mới): " + ("✓" if mark_ok else
          f"KHÔNG — giữ nguyên: mã {c_same}, {len(n_same)} mới; thêm emoji: mã {c_new}, {[x[2] for x in n_new]}"))
    for x in f_clean:
        print("  nhầm:", x[2], x[4], x[5])
    return 0 if not missing and not noisy and app_ok and linked_ok and app_rules_ok and mark_ok else 1


def main():
    ap = argparse.ArgumentParser(description="Kiểm cơ giới prototype HTML (sketch-to-site B4, sketch-to-concept A3)")
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--kind", choices=["site", "app"], default="site")
    ap.add_argument("--font", nargs="+", metavar="TÊN")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--deps", action="store_true", help="kiểm các skill mà sketch-to-site phụ thuộc")
    ap.add_argument("--save", metavar="FILE.json", help="lưu kết quả làm mốc; lỗi có sẵn không làm thoát mã 1")
    ap.add_argument("--compare", metavar="FILE.json", help="so với mốc đã lưu, chỉ in và chỉ tính lỗi mới")
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
    if a.compare:
        sys.exit(compare_baseline(a.paths, a.kind, a.compare)[0])
    code, findings = run(a.paths, a.kind)
    if a.save and code != 2:
        save_baseline(a.paths, findings, a.save)
        code = 0
    sys.exit(code)


if __name__ == "__main__":
    main()
