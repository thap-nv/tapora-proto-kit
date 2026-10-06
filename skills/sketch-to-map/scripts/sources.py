#!/usr/bin/env python3
"""M0 của sketch-to-map: chuẩn bị tài liệu yêu cầu để đọc theo mã và theo dải dòng.

Cách dùng:
    python <skills>/sketch-to-map/scripts/sources.py <thư-mục-tài-liệu> <thư-mục-prototype>

Ghi vào <thư-mục-prototype>/map/:
    _src/D1.txt, D2.txt…  mỗi tài liệu thành chữ, số dòng cố định (.md, .txt giữ nguyên từng dòng): trỏ nguồn bằng "D2:120-140"
    sources.json          mỗi tài liệu: đường dẫn, loại, cỡ, file của bộ BA, mục lục (tiêu đề, cấp, dòng đầu–cuối, số byte),
                          mục Quy ước, số câu user story và Given/When/Then; tổng cỡ và cách đọc đề xuất
    ids.json              hệ mã tự dò: tiền tố [A-Z]{1,4} (kèm miền như BR-LH-01) xuất hiện từ 3 lần và được định nghĩa ở tiêu đề,
                          cột đầu của bảng hay đầu dòng; mỗi mã một chỗ định nghĩa và các chỗ nhắc tới
    states.json           schema.dbml: Enum (trạng thái) và bước chuyển ghi trong note ("a -> b", "a → b")
Đọc được: .md .markdown .txt .dbml .json .csv .yaml .yml .html .htm, .docx và .xlsx (zipfile + XML), .pdf khi có pdftotext hay pypdf.
In: mỗi tài liệu một dòng, bộ BA, hệ mã, Quy ước, trạng thái, mục dài nhất, cách đọc, file cần chuyển tay.
Thoát 0 khi đọc được hết, 1 khi có file cần chuyển tay, 2 khi sai tham số hay thư mục không có tài liệu.
Chỉ dùng thư viện chuẩn; tự đặt stdout UTF-8 (console Windows cp1252 dừng giữa chừng khi in tiếng Việt).
"""
import io
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

READ_WHOLE = 300_000          # byte UTF-8: dưới ngưỡng thì ngữ cảnh chính đọc nguyên một lượt (mốc cũ r7-map: 48 KB, sót 1/43)
TEXT_EXT = {".md", ".markdown", ".txt", ".dbml", ".json", ".csv", ".yaml", ".yml"}
BA_FILES = ["USE-CASE", "BUSINESS-RULES", "EDGE-CASES", "TO-BE", "MA-TRAN-TRUY-VET", "UU-TIEN-PHAM-VI", "TIEU-CHI-NGHIEM-THU"]
CODE = re.compile(r"(?<![\w-])([A-Z]{1,4})-(?:([A-Z]{1,4})-)?(\d{1,4}[a-z]?)(?![\w-])")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$")
CONVENTION = re.compile(r"quy ước|quy uoc|ký hiệu|chú giải|thuật ngữ|convention|legend|glossary", re.I)
STORY = re.compile(r"\b(là|với vai trò)\b.{0,80}\btôi muốn\b|\bas an?\b.{0,80}\bI want\b", re.I)
MOSCOW = re.compile(r"\b(Must|Should|Could|Won't|Wont)\b", re.I)
# Quy ước mức theo tiền tố, hai cách viết: "23 Must `M-*`" (dự án thật) · "| `M-nn` | Must — phải có |" (bảng Quy ước)
PREFIX_LEVEL = re.compile(r"\b(Must|Should|Could|Won'?t)\W{0,4}([A-Z]{1,4})-\*", re.I)
PREFIX_LEVEL2 = re.compile(r"(?<![\w-])([A-Z]{1,4})-(?:nn|n|xx|x|\*|\d*n)(?![\w-])\W{0,8}(Must|Should|Could|Won'?t)\b", re.I)
DROPPED = re.compile(r"⛔|\(loại\)|bị loại|loại bỏ|\bwon'?t\b", re.I)
GWT = re.compile(r"^\s*(?:[-*]\s*)?(?:\*\*)?(Given|Cho trước|Giả sử)\b", re.I)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def plain(s):
    # Tên file so với BA_FILES: bỏ dấu, chữ hoa, dấu cách và gạch dưới thành gạch ngang
    s = unicodedata.normalize("NFD", s).replace("đ", "d").replace("Đ", "D")
    return re.sub(r"[\s_]+", "-", "".join(c for c in s if unicodedata.category(c) != "Mn")).upper()


class HtmlText(HTMLParser):
    BLOCK = {"p", "div", "li", "tr", "br", "section", "article", "table", "ul", "ol", "dt", "dd", "pre", "blockquote"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lines, self.cur, self.skip, self.head = [], [], 0, 0

    def flush(self):
        t = " ".join(" ".join(self.cur).split())
        if t:
            self.lines.append(("#" * self.head + " " if self.head else "") + t)
        self.cur = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
        elif re.fullmatch(r"h[1-6]", tag):
            self.flush()
            self.head = int(tag[1])
        elif tag in self.BLOCK:
            self.flush()
        elif tag in ("td", "th"):
            self.cur.append("|")

    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.skip:
            self.skip -= 1
        elif re.fullmatch(r"h[1-6]", tag):
            self.flush()
            self.head = 0
        elif tag in self.BLOCK:
            self.flush()

    def handle_data(self, data):
        if not self.skip:
            self.cur.append(data)


def docx_text(path):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    body = root.find(f"{W}body")
    out = []

    def para(p):
        style = p.find(f"{W}pPr/{W}pStyle")
        text = "".join(t.text or "" for t in p.iter(f"{W}t")).strip()
        m = re.match(r"(?:Heading|heading)\s*(\d)|Title", style.get(f"{W}val")) if style is not None else None
        level = int(m.group(1)) if m and m.group(1) else (1 if m else 0)
        return ("#" * level + " " + text) if level and text else text

    for el in body if body is not None else []:
        if el.tag == f"{W}p":
            out.append(para(el))
        elif el.tag == f"{W}tbl":
            for tr in el.iter(f"{W}tr"):
                cells = [" ".join(para(p) for p in tc.iter(f"{W}p")).strip() for tc in tr.iter(f"{W}tc")]
                out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out) + "\n"


def xlsx_text(path):
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist())
        shared = []
        if "xl/sharedStrings.xml" in names:
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).iter(f"{S}si"):
                shared.append("".join(t.text or "" for t in si.iter(f"{S}t")))
        rels = {}
        if "xl/_rels/workbook.xml.rels" in names:
            for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels")):
                rels[r.get("Id")] = r.get("Target")
        out = []
        for sh in ET.fromstring(z.read("xl/workbook.xml")).iter(f"{S}sheet"):
            target = rels.get(sh.get(f"{R}id"), "")
            target = target.lstrip("/") if target.startswith("/") else "xl/" + target
            if target not in names:
                continue
            out.append(f"## {sh.get('name')}")
            for row in ET.fromstring(z.read(target)).iter(f"{S}row"):
                cells = []
                for c in row.iter(f"{S}c"):
                    v = c.find(f"{S}v")
                    if c.get("t") == "s" and v is not None:
                        cells.append(shared[int(v.text)])
                    elif c.get("t") == "inlineStr":
                        cells.append("".join(t.text or "" for t in c.iter(f"{S}t")))
                    else:
                        cells.append(v.text if v is not None and v.text else "")
                if any(x.strip() for x in cells):
                    out.append("| " + " | ".join(x.strip() for x in cells) + " |")
    return "\n".join(out) + "\n"


def pdf_text(path):
    if shutil.which("pdftotext"):
        r = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode == 0:
            return r.stdout
    try:
        import pypdf
        return "\n".join(p.extract_text() or "" for p in pypdf.PdfReader(path).pages)
    except Exception:
        return None


def to_text(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in TEXT_EXT:
        with open(path, encoding="utf-8", errors="replace") as fh:
            return fh.read()
    if ext in (".html", ".htm"):
        h = HtmlText()
        with open(path, encoding="utf-8", errors="replace") as fh:
            h.feed(fh.read())
        h.flush()
        return "\n".join(h.lines) + "\n"
    try:
        if ext == ".docx":
            return docx_text(path)
        if ext == ".xlsx":
            return xlsx_text(path)
    except (zipfile.BadZipFile, KeyError, ET.ParseError):
        return None
    if ext == ".pdf":
        return pdf_text(path)
    return None


def toc(lines, is_dbml):
    """[(tiêu đề, cấp, dòng đầu, dòng cuối, byte)]: tiêu đề Markdown (bỏ khối ```), hay Table/Enum của dbml."""
    heads, fence = [], False
    for i, line in enumerate(lines, 1):
        if line.lstrip().startswith("```"):
            fence = not fence
            continue
        if fence:
            continue
        m = HEADING.match(line)
        if m:
            heads.append([m.group(2).strip(), len(m.group(1)), i])
        elif is_dbml:
            m = re.match(r"^(Table|Enum|TableGroup)\s+([\w.\"]+)", line)
            if m:
                heads.append([f"{m.group(1)} {m.group(2)}", 2, i])
    out = []
    for k, (title, level, start) in enumerate(heads):
        end = len(lines)
        for t2, l2, s2 in heads[k + 1:]:
            if l2 <= level:
                end = s2 - 1
                break
        if is_dbml:
            end = next((j for j in range(start, end + 1) if lines[j - 1].startswith("}")), end)
        out.append({"title": title, "level": level, "start": start, "end": end, "bytes": sum(len(x.encode("utf-8")) + 1 for x in lines[start - 1:end])})
    return out


def dbml_states(lines, doc_id):
    enums, transitions, cur = {}, [], None
    used = {}
    table = None
    for i, line in enumerate(lines, 1):
        s = line.strip()
        m = re.match(r"^Enum\s+([\w.]+)\s*\{", s)
        if m:
            cur = m.group(1)
            enums[cur] = {"values": [], "line": i, "used_by": []}
            continue
        m = re.match(r"^Table\s+([\w.]+)", s)
        if m:
            table = m.group(1)
            continue
        if s.startswith("}"):
            cur = table = None
            continue
        if cur:
            m = re.match(r"^\"?([\w]+)\"?\s*(\[(.*)\])?", s)
            if m:
                enums[cur]["values"].append(m.group(1))
                note = m.group(3) or ""
                for a, b in re.findall(r"([a-z_][\w]*)\s*(?:->|→)\s*([a-z_][\w]*)", note):
                    transitions.append({"enum": cur, "from": a, "to": b, "note": re.sub(r"^note:\s*'|'$", "", note.strip()), "src": f"{doc_id}:{i}"})
        elif table:
            m = re.match(r"^(\w+)\s+([\w.]+)", s)
            if m:
                used.setdefault(m.group(2), []).append(f"{table}.{m.group(1)}")
    for name, e in enums.items():
        e["used_by"] = used.get(name, [])
    return enums, transitions


def code_scan(docs):
    """Hệ mã: {tiền tố: {...}} và {mã: {def, refs}}. Định nghĩa: mã đứng đầu tiêu đề (hạng 3), đầu ô đầu của bảng (2), đầu dòng (1)."""
    occ = {}
    for d in docs:
        for i, line in enumerate(d["lines"], 1):
            for m in CODE.finditer(line):
                cid = m.group(0)
                lead = line[:m.start()]
                # Mã có thể nằm trong ** ** hay ` ` (dự án thật viết `XD-48`)
                rank = (3 if re.fullmatch(r"\s*#{1,6}\s*(\*\*|`)?", lead) else 2 if re.fullmatch(r"\s*\|\s*(\*\*|`)?", lead)
                        else 1 if re.fullmatch(r"\s*([-*+]\s*)?(\*\*|`)?", lead) else 0)
                occ.setdefault(cid, []).append((d["id"], i, rank, m.group(1), m.group(2)))
    by_prefix = {}
    for cid, xs in occ.items():
        by_prefix.setdefault(xs[0][3], []).append((cid, xs))
    # Quy ước mức theo tiền tố trong file ưu tiên phạm vi (dự án thật: "23 Must `M-*` · 10 Should `S-*`"): tiền tố đó là hệ mã, mọi mã mang mức đó
    level = lambda w: {"must": "Must", "should": "Should", "could": "Could"}.get(w.lower(), "Won't")
    prio_docs = [d for d in docs if d.get("ba") == "UU-TIEN-PHAM-VI"]
    by_level = {p: level(w) for d in prio_docs for line in d["lines"] for w, p in PREFIX_LEVEL.findall(line)}
    by_level.update({p: level(w) for d in prio_docs for line in d["lines"] for p, w in PREFIX_LEVEL2.findall(line) if p not in by_level})
    systems, ids = {}, {}
    for prefix, items in by_prefix.items():
        n = sum(len(xs) for _, xs in items)
        defined = [cid for cid, xs in items if max(x[2] for x in xs) > 0]
        # Hệ mã: từ 3 lần nhắc và có chỗ định nghĩa; hoặc từ 5 mã khác nhau dù định nghĩa nằm ngoài thư mục (dự án thật: XD- ở file khác);
        # hoặc tiền tố có trong quy ước mức
        if not ((n >= 3 and defined) or len(items) >= 5 or prefix in by_level):
            continue
        systems[prefix] = {"count": n, "ids": len(items), "defs": len(defined), "domains": sorted({x[4] for _, xs in items for x in xs if x[4]})}
        for cid, xs in items:
            best = max(xs, key=lambda x: x[2])
            ids[cid] = {"def": f"{best[0]}:{best[1]}" if best[2] else None,
                        "refs": [f"{x[0]}:{x[1]}" for x in xs if not (best[2] and x is best)]}
            if prefix in by_level:
                ids[cid]["priority"] = by_level[prefix]
    # Không có quy ước tiền tố: dòng của file ưu tiên có chữ Must/Should/Could/Won't thì mã ĐẦU dòng (mục của dòng; mã sau là chỗ nhắc)
    # mang mức đó, gặp trước giữ trước. Bị loại: dòng định nghĩa có ⛔, "(loại)", "bị loại", "loại bỏ", hay mức Won't
    lines_of = {d["id"]: d["lines"] for d in docs}
    for d in prio_docs:
        if any(PREFIX_LEVEL.search(line) or PREFIX_LEVEL2.search(line) for line in d["lines"]):
            continue
        for line in d["lines"]:
            m = MOSCOW.search(line)
            c = next((c for c in CODE.finditer(line) if c.group(0) in ids), None) if m else None
            if c:
                ids[c.group(0)].setdefault("priority", level(m.group(1)))
    for x in ids.values():
        did, ln = x["def"].split(":") if x["def"] else (None, 0)
        if (did and DROPPED.search(lines_of[did][int(ln) - 1])) or x.get("priority") == "Won't":
            x["dropped"] = True
    order = sorted(systems, key=lambda p: (p != "UC", -systems[p]["ids"], p))
    return {p: systems[p] for p in order}, dict(sorted(ids.items()))


def kb(n):
    return f"{n / 1000:.1f}".replace(".", ",") + " KB"


def main():
    if len(sys.argv) != 3 or not os.path.isdir(sys.argv[1]):
        print("Cách dùng: python sources.py <thư-mục-tài-liệu> <thư-mục-prototype>", file=sys.stderr)
        return 2
    src_dir, proto = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
    files = []
    for root, dirs, names in os.walk(src_dir):
        dirs[:] = sorted(d for d in dirs if not d.startswith(".") and d not in ("node_modules", "_archive"))
        files += [os.path.join(root, n) for n in sorted(names) if not n.startswith((".", "~$"))]
    if not files:
        print(f"Không có tài liệu nào trong {src_dir}", file=sys.stderr)
        return 2
    out_dir = os.path.join(proto, "map")
    src_out = os.path.join(out_dir, "_src")
    os.makedirs(src_out, exist_ok=True)
    for f in os.listdir(src_out):
        if re.fullmatch(r"D\d+\.txt", f):
            os.remove(os.path.join(src_out, f))
    docs, manual = [], []
    for path in files:
        rel = os.path.relpath(path, src_dir).replace("\\", "/")
        text = to_text(path)
        if text is None:
            manual.append(rel)
            continue
        doc_id = f"D{len(docs) + 1}"
        with open(os.path.join(src_out, doc_id + ".txt"), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(text)
        lines = text.split("\n")
        if lines and lines[-1] == "":
            lines = lines[:-1]
        name = plain(os.path.basename(rel))
        ba = next((b for b in BA_FILES if b in name), None)
        if os.path.basename(rel).lower() == "schema.dbml":
            ba = "schema.dbml"
        elif "/flows/" in "/" + rel and rel.endswith(".json"):
            ba = "flows"
        is_dbml = rel.lower().endswith(".dbml")
        t = toc(lines, is_dbml)
        docs.append({"id": doc_id, "path": rel, "kind": os.path.splitext(rel)[1].lower().lstrip("."), "bytes": len(text.encode("utf-8")), "lines": lines,
                     "ba": ba, "toc": t, "conventions": [x for x in t if CONVENTION.search(x["title"])],
                     "stories": sum(1 for x in lines if STORY.search(x)), "gwt": sum(1 for x in lines if GWT.match(x))})
    systems, ids = code_scan(docs)
    enums, transitions = {}, []
    for d in docs:
        if d["path"].lower().endswith(".dbml"):
            e, tr = dbml_states(d["lines"], d["id"])
            enums.update(e)
            transitions += tr
    total = sum(d["bytes"] for d in docs)
    whole = total <= READ_WHOLE
    recommend = "doc-nguyen" if whole else "chia-worker"
    meta = [{k: v for k, v in d.items() if k != "lines"} | {"lines": len(d["lines"])} for d in docs]
    with open(os.path.join(out_dir, "sources.json"), "w", encoding="utf-8") as fh:
        json.dump({"dir": src_dir.replace("\\", "/"), "total": total, "recommend": recommend, "threshold": READ_WHOLE, "docs": meta, "manual": manual},
                  fh, ensure_ascii=False, indent=1)
    with open(os.path.join(out_dir, "ids.json"), "w", encoding="utf-8") as fh:
        json.dump({"systems": systems, "ids": ids}, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(out_dir, "states.json"), "w", encoding="utf-8") as fh:
        json.dump({"enums": enums, "transitions": transitions}, fh, ensure_ascii=False, indent=1)

    # In gọn
    print(f"Tài liệu: {len(docs)} · {kb(total)} · {src_dir.replace(chr(92), '/')}")
    for d in meta:
        print(f"  {d['id']} {d['path']} · {kb(d['bytes'])} · {d['lines']} dòng · {len(d['toc'])} mục" + (f" · bộ BA: {d['ba']}" if d["ba"] else ""))
    has = {d["ba"] for d in meta if d["ba"]}
    if has:
        miss = [b for b in BA_FILES if b not in has]
        print(f"Bộ BA: {', '.join(b for b in BA_FILES + ['schema.dbml', 'flows'] if b in has)}" + (f" (không có: {', '.join(miss)})" if miss else ""))
    else:
        print(f"Tài liệu thô (không có file của bộ BA): {sum(d['stories'] for d in meta)} câu user story · {sum(d['gwt'] for d in meta)} Given/When/Then")
    if systems:
        dom = lambda ds: ", ".join(ds[:6]) + (f"… {len(ds)} miền" if len(ds) > 6 else "")
        one = lambda p, s: f"{p} ({s['defs']} định nghĩa" if s["defs"] else f"{p} ({s['ids']} mã, chỉ thấy chỗ nhắc"
        shown = [one(p, s) + (f", miền {dom(s['domains'])}" if s["domains"] else "") + ")" for p, s in list(systems.items())[:12]]
        print("Hệ mã: " + " · ".join(shown) + (f" · và {len(systems) - 12} hệ ít gặp (ids.json)" if len(systems) > 12 else ""))
    else:
        print("Hệ mã: không dò được (không tiền tố nào xuất hiện từ 3 lần và có chỗ định nghĩa)")
    conv = [f"{d['id']}:{c['start']}-{c['end']} ({c['title']})" for d in meta for c in d["conventions"]]
    if conv:
        print("Quy ước (đọc trước): " + " · ".join(conv))
    if enums:
        print(f"Trạng thái: {len(enums)} enum · {sum(len(e['values']) for e in enums.values())} trạng thái · {len(transitions)} bước chuyển (states.json)")
    longest = max(((d, x) for d in meta for x in d["toc"] if x["level"] >= 2), key=lambda p: p[1]["bytes"], default=None)
    if longest:
        d, x = longest
        print(f"Mục dài nhất: {d['id']}:{x['start']}-{x['end']} {x['title'][:60]} ({kb(x['bytes'])})")
    if whole:
        print(f"Cách đọc: đọc nguyên trong một lượt ({kb(total)} ≤ {kb(READ_WHOLE)}): Read " + ", ".join(f"map/_src/{d['id']}.txt" for d in meta))
    else:
        print(f"Cách đọc: chia worker theo module ({kb(total)} > {kb(READ_WHOLE)}): mỗi worker đọc đúng dải dòng của module (mục lục ở map/sources.json), tự ghi map/parts/<module>.js")
    print("Đã ghi: map/_src/ · map/sources.json · map/ids.json · map/states.json")
    if manual:
        print(f"CẦN CHUYỂN TAY ({len(manual)}): " + " · ".join(manual) + " · lưu thành .md hay .txt cạnh file gốc rồi chạy lại")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
