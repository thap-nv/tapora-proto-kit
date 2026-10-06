# So báo cáo của run.mjs với mốc, từng bước. Hàm thuần, không đọc cấu hình: qalib.py dùng cho quick.py và handover.py; test gọi thẳng.
# Mỗi phép đo là một danh sách dòng: ở dims của từng bước (cut, contrast, intent), hoặc ở bước giả "deep" (states, keyboard, interactive, shortcuts;
# chỉ handover.py chạy lượt sâu). Lỗi console của bước deep là phép đo deep_errors. Dòng khớp mốc sau khi bỏ số px, tỉ lệ tương phản,
# mã màu: lệch nhỏ giữa hai lần chạy không tính là khác.
# Mốc do bộ kiểm cũ ghi, chưa đo một phép (báo cáo không có khoá đó, không có bước deep): dòng của phép đó là NỢ CŨ, không phải lỗi mới, không chặn.
# Bộ mới (chưa có mốc): dòng đã có trong mốc ở bộ khác (known, component dùng chung) là nợ cũ; còn lại là mới.
# Cuối file: gộp nợ cũ để in (group_debt, debt_lines), cũng là hàm thuần.
import re

# codes (mã tham chiếu lộ ra chữ trên trang đã render, chỉ số 7 của sketch-to-map) chặn như tương phản. layout (chỉ số 3, 4, 8) chỉ
# cảnh báo nên không có ở đây: quick.py và handover.py in riêng (qalib.layout_warnings)
STEP_KEYS = ('cut', 'contrast', 'intent', 'codes')
DEEP_KEYS = ('states', 'keyboard', 'interactive', 'shortcuts')
DEEP_ERRORS = 'deep_errors'
ALL_KEYS = STEP_KEYS + DEEP_KEYS + (DEEP_ERRORS,)
# cut có từ v3.1: mốc thiếu khoá cut vẫn so như trước (mọi dòng là mới), không tính nợ cũ
DEBT_KEYS = ('contrast', 'intent', 'codes') + DEEP_KEYS + (DEEP_ERRORS,)
DEEP_STEP = 'deep'
_NORM = [(re.compile(r'\d+px'), 'px'), (re.compile(r'\d+(?:\.\d+)?<\d+(?:\.\d+)?'), '<'), (re.compile(r'#[0-9A-Fa-f]{6}\b'), '#')]


def _norm(s):
    for rx, rep in _NORM:
        s = rx.sub(rep, s)
    return s


# Tên công khai: qalib gom nợ cũ theo cùng cách bỏ số
norm = _norm


def _src(x, key):
    return (x.get('deep') or {}) if key in DEEP_KEYS else (x.get('dims') or {})


def _lines(x, key):
    # Dòng của một phép đo ở một bước; deep_errors: lỗi console của bước deep
    if key == DEEP_ERRORS:
        return (x.get('errors') or []) if x.get('step') == DEEP_STEP else []
    return _src(x, key).get(key) or []


def items(rep, key):
    # {(bước, dòng đã bỏ số): dòng gốc}
    return {(x['step'], _norm(c)): c for x in rep or [] for c in _lines(x, key)}


def measured(rep, key):
    if key == DEEP_ERRORS:
        return any(x.get('step') == DEEP_STEP for x in rep or [])
    return any(key in _src(x, key) for x in rep or [])


def known_lines(reports):
    # Mọi (phép đo, dòng đã bỏ số) có trong các báo cáo mốc (mọi bộ, mọi theme), không kể bước
    return frozenset((key, _norm(c)) for rep in reports for x in rep or [] for key in ALL_KEYS for c in _lines(x, key))


def over_steps(rep):
    return {x['step'] for x in rep or [] if x.get('dims') and x['dims']['sw'] > x['dims']['cw']}


def diff_report(base, rep, suite, noisy=frozenset(), known=frozenset()):
    # base None: bộ mới, không có gì để so: dòng có trong known là nợ cũ, còn lại là mới
    out = {'lost': [], 'new': [], 'changed': [], 'over_new': [], 'debt': []}
    for key in ALL_KEYS:
        cur = items(rep, key)
        if base is None:
            old = {k for k in cur if (key, k[1]) in known}
            out['debt'] += sorted((k[0], key, cur[k]) for k in old)
            new = set(cur) - old
        elif key in DEBT_KEYS and not measured(base, key):
            out['debt'] += sorted((k[0], key, cur[k]) for k in cur)
            new = set()
        else:
            new = set(cur) - set(items(base, key))
        out[key + '_new'] = sorted((k[0], cur[k]) for k in new)
    if base is None:
        out['over_new'] = sorted(over_steps(rep))
        return out
    # Bước giả "deep" chỉ có ở lần chạy của handover.py: không tính là bước mất hay bước mới
    ra = {s['step']: s for s in base if s['step'] != DEEP_STEP}
    rb = {s['step']: s for s in rep if s['step'] != DEEP_STEP}
    out['lost'] = [n for n in ra if n not in rb]
    out['new'] = [n for n in rb if n not in ra]
    out['changed'] = [(n, ra[n].get('check'), rb[n].get('check')) for n in ra
                      if n in rb and (suite, n) not in noisy and ra[n].get('check') != rb[n].get('check')]
    out['over_new'] = sorted(over_steps(rep) - over_steps(base))
    return out


# Nợ cũ in gộp cho quick.py và handover.py: mỗi mục (phép đo, dòng đã bỏ số) một dòng dù gặp ở nhiều bước, khổ, theme.
# Thứ tự in theo phép đo
DEBT_LABELS = (('contrast', 'tương phản'), ('intent', 'ý định'), ('codes', 'mã lộ'), ('states', 'trạng thái'), ('keyboard', 'bàn phím'),
               ('interactive', 'tương tác'), ('shortcuts', 'lối tắt'), (DEEP_ERRORS, 'console lượt sâu'), ('cut', 'trong khung'))


def group_debt(rows):
    # rows: (theme, bộ, bước, phép đo, dòng). Trả {phép đo: [{'line', 'n', 'places'}]}; mục gặp nhiều chỗ đứng trước
    groups = {}
    for th, name, step, key, line in rows:
        it = groups.setdefault(key, {}).setdefault(_norm(line), {'line': line, 'n': 0, 'places': []})
        it['n'] += 1
        it['places'].append(f'{th}/{name} · {step}')
    return {k: sorted(g.values(), key=lambda it: -it['n']) for k, g in groups.items()}


def debt_count(groups):
    # Số mục khác nhau (không phải số lần gặp)
    return sum(len(v) for v in groups.values())


def debt_lines(groups, indent='  ', limit=20):
    # Mỗi phép đo tối đa limit dòng; mục gặp n chỗ thì ghi ×n và chỗ đầu tiên (đủ danh sách ở handover.json)
    out = []
    labels = dict(DEBT_LABELS)
    for key in [k for k, _ in DEBT_LABELS] + sorted(k for k in groups if k not in labels):
        its = groups.get(key) or []
        if not its:
            continue
        out.append(f'{indent}{labels.get(key, key)} ({len(its)}):')
        for it in its[:limit]:
            line = it['line'].replace('\n', ' ')
            line = line if len(line) <= 200 else line[:200] + '…'
            out.append(f'{indent}  {line}' + (f' ×{it["n"]}' if it['n'] > 1 else '') + f' · {it["places"][0]}')
        if len(its) > limit:
            out.append(f'{indent}  … còn {len(its) - limit} mục')
    return out
