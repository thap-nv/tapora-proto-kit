# -*- coding: utf-8 -*-
"""Truy vết hai chiều giữa tài liệu requirement và schema DBML (DB-REQ-12). Lệnh tra cứu, luôn thoát 0.

  req_trace.py DIR[,DIR2] schema.dbml [--pattern REGEX] [--pending REGEX] [--config schema-lint.json] [--json OUT] [--limit N]

Requirement → schema:
  · định danh snake_case trong dấu backtick mà schema không có, đứng trong câu nói tới việc lưu/ghi/cột/bảng
  · câu tự nhận "chưa có chỗ chứa", và câu khớp `requirement_pending_pattern` (regex của dự án cho câu kiểu
    "chờ lượt thiết kế schema") — danh sách việc đang treo cho lượt kế tiếp
Schema → requirement (cần `requirement_code_pattern` — regex mã nguồn của dự án):
  · bảng có Note mà không trích mã nào khớp
  · mã được trích trong schema mà tài liệu không có (mã chết)
Dòng bị gạch ngang (~~…~~) coi như lịch sử, bỏ qua.
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dbml_model as dm  # noqa: E402

IMPLEMENTED = {'DB-REQ-12'}
_IDENT = re.compile(r'`([a-z][a-z0-9]*(?:_[a-z0-9]+)+(?:\.[a-z][a-z0-9_]*)?)`')
_STORE = re.compile(r'(lưu|ghi lại|ghi nhận|chỗ chứa|cột|bảng|trường|thêm|field|column|store|persist)', re.I)
_MISSING = re.compile(r'chưa có chỗ chứa|chưa có chỗ lưu|chưa có cột|chưa có bảng', re.I)
SKIP_DIRS = {'_check', 'node_modules', '__pycache__', '.git'}


def read_docs(dirs):
    docs = []
    for d in dirs:
        d = d.strip()
        if not d:
            continue
        if os.path.isfile(d):
            todo = [d]
        else:
            todo = []
            stack = [d]
            while stack:
                cur = stack.pop()
                try:
                    names = sorted(os.listdir(cur))
                except OSError:
                    continue
                for n in names:
                    full = os.path.join(cur, n)
                    if os.path.isdir(full):
                        if n not in SKIP_DIRS and not n.startswith('.'):
                            stack.append(full)
                    elif n.lower().endswith(('.md', '.txt')):
                        todo.append(full)
        for fp in todo:
            try:
                with io.open(fp, encoding='utf-8-sig') as f:
                    docs.append((fp, f.read().split('\n')))
            except (OSError, UnicodeDecodeError):
                continue
    return docs


def known_names(model):
    k = set()
    for t, tbl in model['tables'].items():
        k.add(t)
        for c in tbl['cols']:
            k.add(c['name'])
            k.add('{}.{}'.format(t, c['name']))
    for e, en in model['enums'].items():
        k.add(e)
        for v in en['values']:
            k.add(v['name'])
    return k


def strip_struck(line):
    return re.sub(r'~~.*?~~', '', line)


def trace(dirs, model, pattern='', ignore=(), pending=''):
    docs = read_docs(dirs)
    known = known_names(model)
    code_re = re.compile(pattern) if pattern else None
    pend_re = re.compile(pending) if pending else None
    unhoused, stated = {}, []
    doc_codes = set()
    for fp, lines in docs:
        base = os.path.basename(fp)
        for i, raw in enumerate(lines, 1):
            ln = strip_struck(raw)
            if code_re:
                doc_codes.update(m.group(0) for m in code_re.finditer(raw))
            if _MISSING.search(ln) or (pend_re and pend_re.search(ln)):
                stated.append({'rule': 'DB-REQ-12', 'where': '{}:{}'.format(base, i), 'text': ln.strip()[:160]})
            if not _STORE.search(ln):
                continue
            for m in _IDENT.finditer(ln):
                ident = m.group(1)
                if ident in known or ident in ignore or (code_re and code_re.fullmatch(ident)):
                    continue
                if '.' in ident and all(p in known for p in ident.split('.')):
                    continue
                unhoused.setdefault(ident, []).append({'where': '{}:{}'.format(base, i), 'text': ln.strip()[:160]})
    out = {'docs': len(docs), 'lines': sum(len(l) for _, l in docs), 'unhoused': [], 'stated': stated,
           'no_source': [], 'dead_codes': [], 'pattern': bool(pattern)}
    for ident, hits in sorted(unhoused.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        out['unhoused'].append({'rule': 'DB-REQ-12', 'ident': ident, 'count': len(hits), 'where': hits[0]['where'], 'text': hits[0]['text']})
    if code_re:
        cited = set()
        for t, tbl in model['tables'].items():
            text = (tbl['note'] or '') + '\n' + '\n'.join(c['note'] for c in tbl['cols']) + '\n' + '\n'.join(ix['note'] for ix in tbl['indexes'])
            codes = {m.group(0) for m in code_re.finditer(text)}
            cited |= codes
            if not codes:
                out['no_source'].append({'rule': 'DB-REQ-12', 'table': t, 'line': tbl['line']})
        for e, en in model['enums'].items():
            cited |= {m.group(0) for v in en['values'] for m in code_re.finditer(v['note'])}
        for c in sorted(cited - doc_codes):
            out['dead_codes'].append({'rule': 'DB-REQ-12', 'code': c})
    return out


def render(res, limit=15):
    out = ['Truy vết · {} tài liệu · {} dòng'.format(res['docs'], res['lines'])]
    out.append('Requirement → schema: {} định danh chưa có chỗ chứa · {} câu tự nhận "chưa có chỗ chứa"'.format(len(res['unhoused']), len(res['stated'])))
    for u in res['unhoused'][:limit]:
        out.append('  `{}` ×{} — {} — "{}"'.format(u['ident'], u['count'], u['where'], u['text'][:90]))
    if len(res['unhoused']) > limit:
        out.append('  … +{} định danh nữa (--json)'.format(len(res['unhoused']) - limit))
    for s in res['stated'][:limit]:
        out.append('  ⟲ {} — "{}"'.format(s['where'], s['text'][:100]))
    if len(res['stated']) > limit:
        out.append('  … +{} câu nữa (--json)'.format(len(res['stated']) - limit))
    if not res['pattern']:
        out.append('Schema → requirement: chưa chấm — chưa khai requirement_code_pattern')
    else:
        out.append('Schema → requirement: {} bảng không có nguồn · {} mã chết'.format(len(res['no_source']), len(res['dead_codes'])))
        if res['no_source']:
            out.append('  bảng không có nguồn: ' + ', '.join('{} (d{})'.format(x['table'], x['line']) for x in res['no_source'][:limit]) +
                       (' …' if len(res['no_source']) > limit else ''))
        if res['dead_codes']:
            out.append('  mã chết: ' + ', '.join(x['code'] for x in res['dead_codes'][:limit]) + (' …' if len(res['dead_codes']) > limit else ''))
    return '\n'.join(out)


def main(argv):
    dm.utf8_stdout()
    args = argv[1:]
    if len(args) < 2 or args[0] in ('-h', '--help'):
        print(__doc__)
        return 0

    def val(flag, default=None):
        return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default

    if not os.path.isfile(args[1]):
        print('Không thấy file: ' + args[1])
        return 0
    model = dm.load(args[1])
    pattern, ignore, pending = val('--pattern', ''), (), val('--pending', '')
    cfg = val('--config')
    if not cfg:
        guess = os.path.join(os.path.dirname(os.path.abspath(args[1])), 'schema-lint.json')
        cfg = guess if os.path.isfile(guess) else None
    if cfg:
        try:
            with io.open(cfg, encoding='utf-8-sig') as f:
                c = json.load(f)
            pattern = pattern or c.get('requirement_code_pattern', '')
            pending = pending or c.get('requirement_pending_pattern', '')
            ignore = tuple(c.get('ignore_identifiers', []))
        except Exception:  # noqa: BLE001
            pass
    res = trace(args[0].split(','), model, pattern, ignore, pending)
    print(render(res, int(val('--limit', 15))))
    if val('--json'):
        with io.open(val('--json'), 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
