# -*- coding: utf-8 -*-
"""Chấm một lần chạy db-schema-review: python score_review.py <DIR> [--json] [--report TÊN.md]

<DIR> là thư mục một lần chạy (có docs/database/). Báo cáo mặc định: docs/database/SCHEMA-REVIEW-v4.4.md.
Chấm bằng golden.json: 5 phát hiện cốt lõi G1-G5 (đã kiểm chứng bằng lệnh trước khi đo), 5 phát hiện phụ X1-X5 (chỉ ghi),
kiểm số (tên số bảng/cột đúng), kiểm chỉ-đọc (file schema, cấu hình, từ điển, sơ đồ, bản đã duyệt không bị sửa).
Regex chỉ là đại diện — đọc báo cáo để biết lời có đúng không.
"""
import hashlib
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def load_golden():
    with io.open(os.path.join(HERE, 'golden.json'), encoding='utf-8') as f:
        return json.load(f)


def has(text, spec, window):
    """Có một cửa sổ `window` ký tự chứa đủ mọi mẫu của spec (và đủ n trong any_n)?"""
    pats = [re.compile(p, re.I) for p in spec.get('all', [])]
    anyn = spec.get('any_n')
    anyc = [re.compile(p, re.I) for p in anyn['of']] if anyn else []
    first = pats[0] if pats else anyc[0]
    for m in first.finditer(text):
        lo = max(0, m.start() - window // 2)
        win = text[lo:lo + window]
        if all(p.search(win) for p in pats) and (not anyn or sum(1 for p in anyc if p.search(win)) >= anyn['n']):
            return True
    if anyn and not pats:
        return any(sum(1 for p in anyc if p.search(text[i:i + window])) >= anyn['n'] for i in range(0, max(1, len(text) - window), window // 3))
    return False


def has_any_n_global(text, spec, window):
    """any_n có thể trải qua vài đoạn (danh sách cột nằm trong bảng): chấp nhận khi đủ n cột trong CẢ báo cáo và rule được nhắc ở đâu đó."""
    pats = [re.compile(p, re.I) for p in spec.get('all', [])]
    anyn = spec.get('any_n')
    if not anyn:
        return False
    return all(p.search(text) for p in pats) and sum(1 for p in anyn['of'] if re.search(p, text, re.I)) >= anyn['n']


def score_text(text, golden):
    w = golden.get('window', 900)
    core, extra = {}, {}
    for k, spec in golden['core'].items():
        core[k] = has(text, spec, w) or (k == 'G4' and has_any_n_global(text, spec, w))
    for k, spec in golden['extra'].items():
        extra[k] = has(text, spec, w)
    nums = golden['numbers']
    miss = [s for s in nums['must_contain'] if s not in text]
    head = '\n'.join(text.split('\n')[:80])
    odd = sorted({int(n) for n in re.findall(r'(\d+) bảng · \d+ cột', head)} - set(nums['allowed_table_counts']))
    return core, extra, miss, odd


def read_only(d, golden):
    bad = []
    for rel, want in golden['read_only_sha256'].items():
        p = os.path.join(d, 'docs', 'database', *rel.split('/'))
        if not os.path.isfile(p):
            bad.append('{} (mất)'.format(rel))
            continue
        with io.open(p, 'rb') as f:
            if hashlib.sha256(f.read()).hexdigest() != want:
                bad.append(rel)
    return bad


def main(argv):
    args = argv[1:]
    if not args:
        print(__doc__)
        return 2
    d = args[0]
    name = args[args.index('--report') + 1] if '--report' in args else 'SCHEMA-REVIEW-v4.4.md'
    g = load_golden()
    rp = os.path.join(d, 'docs', 'database', name)
    if not os.path.isfile(rp):
        res = {'dir': d, 'report': None, 'error': 'không có ' + name}
    else:
        with io.open(rp, encoding='utf-8') as f:
            text = f.read()
        core, extra, miss, odd = score_text(text, g)
        res = {'dir': d, 'report': name, 'chars': len(text), 'lines': text.count('\n') + 1,
               'blocks': len(re.findall(r'^#{3,4} ', text, re.M)),
               'core': core, 'core_score': '{}/{}'.format(sum(core.values()), len(core)),
               'extra': extra, 'extra_score': '{}/{}'.format(sum(extra.values()), len(extra)),
               'numbers_missing': miss, 'numbers_odd_table_counts': odd, 'modified_readonly': read_only(d, g)}
    if '--json' in args:
        print(json.dumps(res, ensure_ascii=False, indent=1))
    else:
        if res.get('error'):
            print('{}: {}'.format(d, res['error']))
            return 1
        print('{}  {}  {} ký tự · {} khối  ·  phát hiện cốt lõi {}  ·  phụ {}'.format(
            os.path.basename(os.path.normpath(d)), name, res['chars'], res['blocks'], res['core_score'], res['extra_score']))
        for k, v in res['core'].items():
            print('  {} {}  {}'.format(k, 'đạt' if v else 'RƠI', g['core'][k]['title']))
        for k, v in res['extra'].items():
            print('  {} {}  {}'.format(k, 'có ' if v else '—  ', g['extra'][k]['title']))
        print('  số liệu: thiếu {} · số bảng lạ {} · file chỉ-đọc bị sửa {}'.format(res['numbers_missing'] or 'không', res['numbers_odd_table_counts'] or 'không', res['modified_readonly'] or 'không'))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
