# -*- coding: utf-8 -*-
"""Chấm một lần chạy đề db-r1 theo key.json (bản 2, 07/10/2026).

  python score.py key.json <thư-mục-chạy> [--json] [--scripts <thư mục chứa dbml_model.py, dbml_lint.py, dbml_diff.py>]

Đọc <thư-mục-chạy>/docs/database/schema.dbml (kết quả), BAO-CAO-DO.md, CAU-HOI-BA.md và DATA-DICTIONARY.md (nếu có).
Phần máy kiểm được thì chấm bằng dbml_model/dbml_lint của bản **đóng băng** ở `lib/` cạnh file này (bản 2.0 của skill,
không đổi theo skill đang sửa); --scripts hay biến DB_SCRIPTS ghi đè. Phần còn lại in 'tay' kèm đoạn văn để người chấm đọc.
Kết quả mỗi bẫy: đạt · một phần · không · tay. Chạy luôn thoát 0.

Hai khối điểm:
  20 bẫy (D01–D15 thiết kế, R01–R05 requirement) theo key.json
  thước chất lượng M1, M2, M4, M5 (M3 — DDL nạp được vào PostgreSQL — ở pg_load.py vì cần dựng cụm PG tạm)

Bản 2 sửa tám lỗi của bản 1 (xem README, mục "Điểm tự động và điểm chấm tay lệch nhau"): D04 · D05 · D07 · D11 · D13 · D15 ·
R04 (tìm theo đoạn, không theo cửa sổ ký tự) · cột Ghi chú lệch một dòng. Bốn lần chạy 07/10 và `score-tests/{tot,naive}` là
dữ liệu hồi quy: `python test_score.py`.
"""
import io
import json
import os
import re
import sys

args = sys.argv[1:]
HERE = os.path.dirname(os.path.abspath(__file__))


def opt(flag, default=None):
    return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default


SCRIPTS = opt('--scripts') or os.environ.get('DB_SCRIPTS') or os.path.join(HERE, 'lib')
sys.path.insert(0, SCRIPTS)
import dbml_diff as dd  # noqa: E402
import dbml_lint as lint  # noqa: E402
import dbml_model as dm  # noqa: E402

dm.utf8_stdout()

HEAD = re.compile(r'^#{1,6}\s')
SEG_MAX = 2500


def read(path):
    try:
        with io.open(path, encoding='utf-8-sig') as f:
            return f.read()
    except OSError:
        return ''


def segments(text, pat):
    """Đoạn quanh mỗi chỗ khớp `pat` (regex đã biên dịch).

    Tiêu đề → cả mục tới tiêu đề kế · dòng bảng/gạch đầu dòng → dòng đó cộng các dòng thụt vào ·
    đoạn văn → tới dòng trống. Đoạn bắt đầu từ dòng khớp, nên đoạn trích hiện đúng chỗ cần đọc."""
    lines = text.split('\n')
    out = []
    for i, ln in enumerate(lines):
        if not pat.search(ln):
            continue
        seg = [ln]
        if HEAD.match(ln):
            n = len(ln)
            for nx in lines[i + 1:]:
                if HEAD.match(nx) or n > SEG_MAX:
                    break
                seg.append(nx)
                n += len(nx) + 1
        elif ln.lstrip().startswith(('|', '- ', '* ', '+ ')):      # gạch đầu dòng cần dấu cách: `**Q-03 …**` là đoạn văn đậm, không phải gạch đầu dòng
            for nx in lines[i + 1:]:
                if not (nx.startswith((' ', '\t')) and nx.strip()):
                    break
                seg.append(nx)
        else:
            for nx in lines[i + 1:]:
                if not nx.strip() or HEAD.match(nx):
                    break
                seg.append(nx)
        out.append('\n'.join(seg)[:SEG_MAX])
    return out


def word_pat(tok):
    return re.compile(r'(?<![\w-])' + re.escape(tok) + r'(?![\w])')


def code_pat(code):
    return re.compile(r'(?<![\w-])' + re.escape(code) + r'(?!\d)')


def default_findings(model):
    """Soát bằng cấu hình mặc định + tenant organization_id — cùng một cấu hình cho mọi lần chạy, không miễn trừ."""
    cfg, _ = lint.load_config(None)
    cfg['tenant_column'] = 'organization_id'
    return lint.run(model, cfg)[0]


class Run:
    def __init__(self, d):
        self.d = d
        db = os.path.join(d, 'docs', 'database')
        self.dbml = os.path.join(db, 'schema.dbml')
        self.model = dm.load(self.dbml) if os.path.isfile(self.dbml) else None
        self.report = read(os.path.join(db, 'BAO-CAO-DO.md'))
        self.questions = read(os.path.join(db, 'CAU-HOI-BA.md'))
        self.dictionary = read(os.path.join(db, 'DATA-DICTIONARY.md'))
        self.texts = [self.report, self.questions, self.dictionary]
        self.T = self.model['tables'] if self.model else {}
        self.findings = default_findings(self.model) if self.model else []

    # ---- tiện ích
    def tables_like(self, pat):
        return [t for t in self.T if re.search(pat, t)]

    def cols(self, t):
        return self.T[t]['cols'] if t in self.T else []

    def all_cols(self, pat):
        return [(t, c) for t, tbl in self.T.items() for c in tbl['cols'] if re.search(pat, c['name'])]

    def note(self, t):
        tbl = self.T.get(t)
        if not tbl:
            return ''
        return (tbl['note'] or '') + '\n' + '\n'.join(ix['note'] for ix in tbl['indexes'] if ix['note']) + '\n' + '\n'.join(c['note'] for c in tbl['cols'] if c['note'])

    def hit(self, rule, table=None, col=None):
        return [f for f in self.findings if f['rule'] == rule and (not table or f['table'] == table) and (not col or f['col'] == col)]

    def seg_all(self, pat):
        out = []
        for tx in self.texts:
            out.extend(segments(tx, pat))
        return out

    def mentions(self, need, words):
        """Đoạn trong báo cáo/câu hỏi/từ điển nhắc mã `need` (đúng mã, không dính N-160) kèm một trong `words`."""
        for seg in self.seg_all(code_pat(need)):
            if re.search(words, seg, re.I):
                return seg.replace('\n', ' ')[:300]
        return ''


def S(res, why=''):
    return (res, why)


def uniq_sets_norm(tbl):
    """Các tập cột duy nhất, kể cả index biểu thức lower(x)/upper(x)/trim(x) được coi như cột x."""
    out = list(dm.unique_sets(tbl))
    for ix in tbl['indexes']:
        if (ix['unique'] or ix['pk']) and any(x.startswith('`') for x in ix['cols']):
            cols = []
            for x in ix['cols']:
                m = re.match(r'^`\s*(lower|upper|trim|btrim|unaccent)\(\s*(\w+)\s*\)\s*`$', x, re.I) if x.startswith('`') else None
                cols.append(m.group(2) if m else x)
            out.append(tuple(cols))
    return out


# ----------------------------------------------------------------------------- bẫy thiết kế
def d01(r):
    for t in r.tables_like(r'invoice.*(line|item|detail)') + ['appointment_services']:
        for c in r.cols(t):
            if re.search(r'price|amount', c['name']) and t != 'services':
                return S('đạt', '{}.{}'.format(t, c['name']))
    return S('không', 'không thấy cột đơn giá chép lúc khám ngoài services')


def d02(r):
    a = r.cols('appointments')
    has_end = any(c['name'] in ('ends_at', 'end_at', 'end_time') for c in a)
    excl = 'EXCLUDE' in r.note('appointments').upper()
    if has_end and excl:
        return S('đạt', 'ends_at + EXCLUDE')
    if has_end:
        return S('một phần', 'có giờ kết thúc nhưng không thấy EXCLUDE trong Note appointments')
    return S('không', 'chưa có giờ kết thúc')


def d03(r):
    g = r.tables_like(r'guardian')
    if not g:
        return S('không', 'không thấy bảng bảo hộ')
    dup = [t for t in r.tables_like(r'^(staff|receptionists?|employees?|guardians)$') if any(c['name'] in ('full_name', 'phone') for c in r.cols(t))]
    if dup:
        return S('không', 'bảng {} lặp full_name/phone'.format(dup))
    return S('đạt', g[0])


def d04(r):
    """Mã hồ sơ: cột mã trên patients (đề N-04 không đặt tên cột) có index duy nhất MỘT PHẦN WHERE deleted_at IS NULL."""
    t = 'patients' if 'patients' in r.T else None
    col = None
    if t:
        col = next((c['name'] for c in r.cols(t) if re.search(r'(^|_)(code|number|no|mrn)$', c['name']) and not c['pk']), None)
    if not col:
        for tt, tbl in r.T.items():
            hit = next((c['name'] for c in tbl['cols'] if re.search(r'\bN-04\b', c['note'] or '')), None)
            if hit:
                t, col = tt, hit
                break
    if not col:
        return S('không', 'không thấy cột mã hồ sơ trên patients')
    lines = r.note(t).splitlines()
    partial = False
    for i, ln in enumerate(lines):
        if re.search(r'WHERE\s+deleted_at\s+IS\s+NULL', ln, re.I) and any(re.search(r'\b' + re.escape(col) + r'\b', w) for w in lines[max(0, i - 3):i + 1]):
            partial = True
    plain = [f for f in r.hit('DB-IDX-12', t) if col in f['target']]
    if partial and not plain:
        return S('đạt', '{}.{}: index một phần trong Note'.format(t, col))
    if partial:
        return S('một phần', 'có index một phần nhưng vẫn còn unique thường trên bảng xóa mềm')
    return S('không', '{}.{}: unique thường trên bảng có deleted_at'.format(t, col))


def d05(r):
    cs = r.all_cols(r'deposit')
    for t in r.tables_like(r'deposit'):
        for c in r.cols(t):
            if re.search(r'(^|_)(amount|value|sum|total)$', c['name']) and (t, c) not in cs:
                cs.append((t, c))
    if not cs:
        return S('không', 'không thấy cột đặt cọc')
    bad = [(t, c['name'], c['type']) for t, c in cs if c['base'] in ('float', 'double', 'real', 'money', 'float4', 'float8', 'double precision')]
    if bad:
        return S('không', 'kiểu {}'.format(bad))
    if any(c['base'] in ('numeric', 'decimal', 'bigint') for _t, c in cs):
        return S('đạt', 'numeric/bigint')
    return S('tay', 'kiểu cột đặt cọc: {}'.format([(t, c['type']) for t, c in cs]))


def d06(r):
    poly = [f for f in r.findings if f['rule'] == 'DB-MOD-06']
    notes = r.tables_like(r'note')
    if poly:
        return S('không', 'polymorphic ở {}'.format([f['target'] for f in poly]))
    if notes:
        return S('đạt', 'bảng {} không polymorphic'.format(notes))
    return S('tay', 'không thấy bảng ghi chú và không có polymorphic — ghi chú lưu ở đâu?')


def d07(r):
    inline = [(tt, c['name']) for tt, c in r.all_cols(r'allerg') if tt in ('patients', 'people')]
    if inline:
        return S('không', 'cột dị ứng nằm trên {}'.format(inline))
    t = [x for x in r.tables_like(r'allerg') if any(re.search(r'patient', c['name']) for c in r.cols(x))]
    if t:
        return S('đạt', t[0])
    return S('không', 'không thấy bảng dị ứng riêng')


def d08(r):
    spec = r.tables_like(r'specialt')
    enum = [e for e in r.model['enums'] if 'special' in e] if r.model else []
    inline = [(t, c['name']) for t, c in r.all_cols(r'^specialt') if t == 'doctors']
    if enum or inline:
        return S('không', 'enum/cột chuyên khoa: {}'.format(enum or inline))
    link = [t for t in spec if re.search(r'doctor', t)]
    if any(not re.search(r'doctor', t) for t in spec) and link:
        return S('đạt', 'bảng tra cứu + bảng nối')
    return S('một phần' if spec else 'không', '{}'.format(spec))


def d09(r):
    enum_vals = {v['name'] for e in r.model['enums'].values() for v in e['values']} if r.model else set()
    flags = [c['name'] for c in r.cols('appointments') if re.match(r'^is_(confirmed|arrived|cancelled|canceled|no_show|done)', c['name'])]
    if flags:
        return S('không', 'cờ trạng thái {}'.format(flags))
    need = {'confirmed'} & enum_vals and any(v in enum_vals for v in ('no_show', 'absent', 'missed')) and any(v in enum_vals for v in ('arrived', 'checked_in', 'attended'))
    if need:
        return S('đạt', 'enum đủ trạng thái')
    return S('một phần', 'enum thiếu giá trị: có {}'.format(sorted(enum_vals)))


def d10(r):
    cs = [(t, c['name']) for t, c in r.all_cols(r'(visit|appointment).*(count|total)|(total|count).*(visit|appointment)') if t in ('patients', 'people')]
    if not cs:
        return S('đạt', 'không lưu cột đếm')
    for t, n in cs:
        if re.search(r'suy ra|derived|đồng bộ|trigger', r.note(t), re.I):
            return S('đạt', 'có cột {} nhưng Note khai nguồn/đồng bộ'.format(n))
    return S('không', 'cột đếm {} không khai nguồn/đồng bộ'.format(cs))


def d11(r):
    t = 'services'
    code = [c for c in r.cols(t) if c['name'] == 'code']
    if not code:
        return S('không', 'không có services.code')
    sets = uniq_sets_norm(r.T[t])
    if any('code' in u and 'organization_id' in u for u in sets):
        return S('đạt', '(organization_id, code)')
    if any(u == ('code',) for u in sets):
        return S('không', 'unique toàn cục')
    return S('không', 'code không unique')


def d12(r):
    inv = r.T.get('invoices')
    if not inv:
        return S('không', 'không có invoices')
    miss = r.hit('DB-IDX-01', 'invoices')
    cols = {f['col'] for f in miss}
    if 'appointment_id' in cols:
        return S('không', 'invoices.appointment_id không có index')
    has_patient = any(c['name'] == 'patient_id' for c in inv['cols'])
    if has_patient and 'patient_id' in cols:
        return S('một phần', 'invoices.patient_id không index')
    return S('đạt', 'FK của invoices có index')


FIN_TABLE = re.compile(r'^(invoices?|payments?)$')


def d13(r):
    """Đáp án: hóa đơn/thanh toán không cascade; ẩn bệnh nhân = xóa mềm; hành vi xóa khai ở Ref rời. Cascade xuống bảng con khác không phạt."""
    refs = r.model['refs']
    casc = [(x['fk_table'], x['fk_cols'][0]) for x in refs if x['delete'] == 'cascade' and FIN_TABLE.match(x['fk_table'])]
    other = sum(1 for x in refs if x['delete'] == 'cascade' and not FIN_TABLE.match(x['fk_table']))
    soft = any(c['name'] == 'deleted_at' for c in r.cols('patients'))
    if casc:
        return S('không', 'cascade xuống hóa đơn/thanh toán: {}'.format(casc))
    declared = [x for x in refs if x['pk_table'] in ('patients', 'appointments', 'invoices') and not x['inline'] and x['delete']]
    if soft and declared:
        return S('đạt', 'xóa mềm + {} Ref rời có hành vi xóa; cascade chỉ xuống bảng con: {}'.format(len(declared), other))
    return S('một phần' if soft else 'không', 'xóa mềm: {} · Ref rời có delete tới bảng giao dịch: {}'.format(soft, len(declared)))


def d14(r):
    bad = [(t, c['name']) for t, c in r.all_cols(r'^(password|passwd|pwd|temp_password|password_plain|password_text)$')]
    if bad:
        return S('không', 'cột mật khẩu rõ {}'.format(bad))
    seg = r.mentions('N-14', r'đặt lại|reset|băm|hash|không (thể )?đọc|không lưu')
    if seg:
        return S('đạt', 'không cột mật khẩu rõ; báo cáo: ' + seg[:120])
    return S('một phần', 'không có cột mật khẩu rõ nhưng báo cáo không nói gì về N-14')


def d15(r):
    t = r.tables_like(r'insurance')
    if not t:
        return S('không', 'không thấy bảng bảo hiểm')
    sets = uniq_sets_norm(r.T[t[0]])
    for u in sets:
        if 'patient_id' in u and set(u) <= {'patient_id', 'organization_id'}:
            return S('đạt', '{}: duy nhất theo {}'.format(t[0], ', '.join(u)))
    return S('không', '{}.patient_id không unique'.format(t[0]))


# ----------------------------------------------------------------------------- bẫy requirement
def r01(r):
    seg = r.mentions('N-16', r'R-04|mâu thuẫn|đúng một|bản số|một bác sĩ')
    silent = bool(r.tables_like(r'appointment_doctors|appointment_.*doctor')) and not seg
    if seg and not silent:
        return S('đạt', seg[:140])
    return S('không', 'không nêu mâu thuẫn N-16 ↔ R-04' + ('; còn âm thầm thêm bảng nhiều bác sĩ' if silent else ''))


def r02(r):
    seg = r.mentions('N-17', r'thiếu|không có|không đủ|độ dài|thời lượng|kết thúc|phòng mổ chưa|hỏi')
    built = bool(r.tables_like(r'operating|surg'))
    if seg and not built:
        return S('đạt', seg[:140])
    if seg and built:
        return S('một phần', 'có nêu nhưng vẫn dựng bảng phòng mổ theo giả định')
    return S('không', 'không phản biện N-17' + ('; dựng bảng phòng mổ' if built else ''))


def r03(r):
    col = [(t, c['name']) for t, c in r.all_cols(r'(remaining|left).*(session|sessions|treatment)|(session|sessions).*(remaining|left)')]
    seg = r.mentions('N-18', r'suy ra|tính ra|derived|không lưu|lệch|tổng.*đã dùng')
    if col and not any(re.search(r'suy ra|derived|đồng bộ|trigger', r.note(t), re.I) for t, _n in col):
        return S('không', 'thêm cột còn lại {} không khai nguồn'.format(col))
    if seg:
        return S('đạt', seg[:140])
    return S('không', 'không phản biện N-18')


def r04(r):
    built = r.tables_like(r'^appointments_\w+$')
    seg = r.mentions('N-19', r'một bảng|clinic_id|phân vùng|partition|bảng riêng|index')
    if built:
        return S('không', 'dựng bảng theo chi nhánh: {}'.format(built))
    if seg:
        return S('đạt', seg[:140])
    return S('không', 'không dựng nhưng cũng không giải thích N-19')


def r05(r):
    seg = r.mentions('N-20', r'hạn lưu|trẻ em|dữ liệu cá nhân|sinh trắc|quy định|tối thiểu|đồng ý|quyền xem|nhạy cảm')
    photo = r.tables_like(r'photo|face')
    if photo:
        has_ret = any(re.search(r'expires|purge|retention', c['name']) for c in r.cols(photo[0]))
        if has_ret and seg:
            return S('đạt', 'nêu rủi ro + bảng có hạn lưu')
        return S('không' if not seg else 'một phần', 'dựng {} {}hạn lưu'.format(photo[0], '' if has_ret else 'không '))
    if seg:
        return S('đạt', seg[:140])
    return S('không', 'không phản biện N-20')


CHECKS = {'D01': d01, 'D02': d02, 'D03': d03, 'D04': d04, 'D05': d05, 'D06': d06, 'D07': d07, 'D08': d08, 'D09': d09, 'D10': d10,
          'D11': d11, 'D12': d12, 'D13': d13, 'D14': d14, 'D15': d15, 'R01': r01, 'R02': r02, 'R03': r03, 'R04': r04, 'R05': r05}

# ----------------------------------------------------------------------------- thước chất lượng
CODE = re.compile(r'(?<![\w-])(?:N|R|Q)-\d{2}(?!\d)')
PLAN = re.compile(r'backfill|điền|dữ liệu cũ|chuyển dữ liệu|NOT VALID|VALIDATE|trùng sẵn|dữ liệu hiện có|bản ghi cũ|migration|di chuyển|dọn', re.I)
NOT_BUILT = ['N-14', 'N-16', 'N-17', 'N-18', 'N-19', 'N-20']         # không được dựng theo chữ đề
MUST_APPLY = ['N-%02d' % i for i in list(range(1, 14)) + [15] if i != 10]   # phải áp; N-10 (giá trị suy ra) cố ý "không làm"


def _element_notes(model, ch):
    T, kind, name = model['tables'], ch['kind'], ch['name']
    out = []
    if kind == 'bảng':
        t = T.get(name)
        if t:
            out += [t['note'] or ''] + [c['note'] or '' for c in t['cols']]
    elif kind == 'cột':
        t, c = name.split('.', 1)
        col = dm.col_of(T[t], c) if t in T else None
        if col:
            out.append(col['note'] or '')
    elif kind == 'index':
        t = name.split('(')[0]
        if t in T:
            out += [ix['note'] or '' for ix in T[t]['indexes']]
    elif kind == 'ref':
        t = name.split('(')[0]
        m = re.search(r'\(([^)]*)\)', name)
        for c in (m.group(1).split(', ') if m else []):
            col = dm.col_of(T[t], c) if t in T else None
            if col:
                out.append(col['note'] or '')
    elif kind in ('enum', 'giá trị enum'):
        e = model['enums'].get(name.split('.')[0])
        if e:
            out.append(e.get('note') or '')
    return ' '.join(out)


def _tokens(ch):
    kind, name = ch['kind'], ch['name']
    if kind == 'cột' or kind == 'giá trị enum':
        return name.split('.', 1)
    if kind == 'index' or kind == 'ref':
        t = name.split('(')[0]
        m = re.search(r'\(([^)]*)\)', name)
        return [t] + ([m.group(1).split(', ')[0]] if m else [])
    return [name]


def m1(r, sample_model):
    base = {(f['rule'], f['target']) for f in default_findings(sample_model) if f['level'] in ('ERROR', 'WARN')}
    new = sorted({(f['rule'], f['target'], f['level']) for f in r.findings if f['level'] in ('ERROR', 'WARN') and (f['rule'], f['target']) not in base})
    return {'error': sum(1 for x in new if x[2] == 'ERROR'), 'warn': sum(1 for x in new if x[2] == 'WARN'), 'items': ['{} {}'.format(a, b) for a, b, _c in new]}


def m2(r, sample_model):
    d = dd.diff(sample_model, r.model)
    ch = d['changes']
    untraced = []
    for c in ch:
        if CODE.search(_element_notes(r.model, c)):
            continue
        toks = _tokens(c)
        if any(CODE.search(seg) for seg in r.seg_all(word_pat(toks[0])) if all(re.search(word_pat(t), seg) for t in toks[1:])):
            continue
        untraced.append('{} {} {}'.format(c['kind'], c['op'], c['name']))
    return {'changes': len(ch), 'untraced': len(untraced), 'breaking': sum(1 for c in ch if c['class'] == 'phá vỡ'), 'items': untraced}


def m4(r, sample_model):
    d = dd.diff(sample_model, r.model)
    risky = [c for c in d['changes'] if c['class'] in ('phá vỡ', 'dữ liệu')]
    planned = 0
    missing = []
    for c in risky:
        toks = _tokens(c)
        ok = any(PLAN.search(seg) for seg in r.seg_all(word_pat(toks[0])) if all(re.search(word_pat(t), seg) for t in toks[1:]))
        if ok:
            planned += 1
        else:
            missing.append('{} {} {}'.format(c['kind'], c['op'], c['name']))
    return {'risky': len(risky), 'planned': planned, 'items': missing}


def m5(r, results):
    ok = [c for c, tid in zip(NOT_BUILT, ('D14', 'R01', 'R02', 'R03', 'R04', 'R05')) if results.get(tid) == 'đạt']
    over = []
    rows = [ln for tx in (r.report, r.questions) for ln in tx.split('\n') if ln.lstrip().startswith(('|', '-', '*'))]
    for code in MUST_APPLY:
        # dòng mà `code` là chủ thể: `| N-xx |`, `- **N-xx**`, hoặc `| Q-nn | N-xx |` (bảng chỉ mục câu hỏi)
        pat = re.compile(r'^\s*(?:[|\-*]\s*)?(?:\*{0,2}Q-\d+\*{0,2}\s*\|\s*)?\*{0,2}' + re.escape(code) + r'(?!\d)')
        for ln in rows:
            if not pat.search(ln):
                continue
            low = ln.lower()
            pa = low.find('đã áp')
            pbs = [p for p in (low.find('đã hỏi'), low.find('không làm')) if p >= 0]
            pb = min(pbs) if pbs else -1
            if re.search(r'\bCHẶN\b', ln) or (pb >= 0 and (pa < 0 or pb < pa)):
                over.append(code)
                break
    nq = len(set(re.findall(r'(?m)^(?:#{1,6}\s*|\|\s*)Q-(\d+)', r.questions)))
    return {'not_built_ok': ok, 'over_blocked': over, 'questions': nq, 'questions_chars': len(r.questions)}


def main():
    if len(args) < 2:
        print(__doc__)
        return 0
    key = json.loads(read(args[0]))
    run = Run(args[1])
    if not run.model:
        print('Không thấy schema.dbml trong ' + args[1])
        return 0
    out, tally = [], {'thiết kế': [0, 0, 0], 'requirement': [0, 0, 0]}
    results = {}
    for t in key['traps']:
        res, why = CHECKS[t['id']](run)
        results[t['id']] = res
        out.append({'id': t['id'], 'loai': t['loai'], 'need': t['need'], 'bay': t['bay'], 'ket_qua': res, 'ghi_chu': why})
        row = tally[t['loai']]
        row[0] += res == 'đạt'
        row[1] += res == 'một phần'
        row[2] += res == 'tay'
    sample = os.path.join(os.path.dirname(os.path.abspath(args[0])), 'sample', 'docs', 'database', 'schema.dbml')
    quality = None
    if os.path.isfile(sample):
        sm = dm.load(sample)
        quality = {'M1': m1(run, sm), 'M2': m2(run, sm), 'M4': m4(run, sm), 'M5': m5(run, results)}
    if '--json' in args:
        print(json.dumps({'traps': out, 'tally': tally, 'quality': quality}, ensure_ascii=False, indent=1))
        return 0
    print('{:<4} {:<11} {:<5} {:<34} {:<9} {}'.format('Mã', 'Loại', 'Nhu cầu', 'Bẫy', 'Kết quả', 'Ghi chú'))
    for o in out:
        print('{:<4} {:<11} {:<5} {:<34} {:<9} {}'.format(o['id'], o['loai'], o['need'], o['bay'], o['ket_qua'], o['ghi_chu'][:90]))
    d, q = tally['thiết kế'], tally['requirement']
    print()
    print('Bẫy thiết kế: {}/15 đạt · {} một phần · {} chấm tay'.format(d[0], d[1], d[2]))
    print('Bẫy requirement: {}/5 đạt · {} một phần · {} chấm tay   (mục tiêu 5/5)'.format(q[0], q[1], q[2]))
    if quality:
        a, b, c, e = quality['M1'], quality['M2'], quality['M4'], quality['M5']
        print()
        print('Thước chất lượng (cùng cấu hình cho mọi lần chạy)')
        print('M1 nợ mới ERROR/WARN, cấu hình mặc định, không miễn trừ: {} ERROR · {} WARN'.format(a['error'], a['warn']))
        print('M2 vượt chữ đề: {}/{} thay đổi không truy được về mã N/R/Q · phá vỡ trên bảng cũ: {}'.format(b['untraced'], b['changes'], b['breaking']))
        print('M3 DDL nạp được vào PostgreSQL: chạy python pg_load.py <thư-mục-chạy>')
        print('M4 kế hoạch an toàn dữ liệu: {}/{} thay đổi phá vỡ hay chạm dữ liệu cũ có kế hoạch'.format(c['planned'], c['risky']))
        print('M5 câu chặn: {}/6 mã không dựng theo chữ có phản biện · chặn thừa: {} · {} câu hỏi · {} ký tự'.format(
            len(e['not_built_ok']), ','.join(e['over_blocked']) or 'không', e['questions'], e['questions_chars']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
