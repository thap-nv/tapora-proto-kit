# -*- coding: utf-8 -*-
"""Chấm một lần chạy đề db-r1 theo key.json.

  python score.py key.json <thư-mục-chạy> [--json] [--scripts <thư mục scripts của skill db-schema-design>]

Đọc <thư-mục-chạy>/docs/database/schema.dbml (kết quả), BAO-CAO-DO.md và CAU-HOI-BA.md (nếu có).
Phần máy kiểm được thì chấm bằng dbml_model/dbml_lint của skill; phần còn lại in 'tay' kèm đoạn văn để người chấm đọc.
Kết quả mỗi bẫy: đạt · một phần · không · tay. Chạy luôn thoát 0.
"""
import io
import json
import os
import re
import sys

args = sys.argv[1:]


def opt(flag, default=None):
    return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default


SCRIPTS = opt('--scripts') or os.environ.get('DB_SCRIPTS') or 'W:/Dummy/[Tool] Working/Bơi Đạt/dat-swimming-pool/.claude/skills/db-schema-design/scripts'
sys.path.insert(0, SCRIPTS)
import dbml_lint as lint  # noqa: E402
import dbml_model as dm  # noqa: E402

dm.utf8_stdout()


def read(path):
    try:
        with io.open(path, encoding='utf-8-sig') as f:
            return f.read()
    except OSError:
        return ''


class Run:
    def __init__(self, d):
        self.d = d
        self.dbml = os.path.join(d, 'docs', 'database', 'schema.dbml')
        self.model = dm.load(self.dbml) if os.path.isfile(self.dbml) else None
        self.report = read(os.path.join(d, 'docs', 'database', 'BAO-CAO-DO.md'))
        self.questions = read(os.path.join(d, 'docs', 'database', 'CAU-HOI-BA.md'))
        self.text = self.report + '\n' + self.questions + '\n' + read(os.path.join(d, 'docs', 'database', 'DATA-DICTIONARY.md'))
        self.T = self.model['tables'] if self.model else {}
        cfg_path = os.path.join(d, 'docs', 'database', 'schema-lint.json')
        cfg, _ = lint.load_config(cfg_path if os.path.isfile(cfg_path) else None)
        cfg.setdefault('tenant_column', 'organization_id')
        if not cfg.get('tenant_column'):
            cfg['tenant_column'] = 'organization_id'
        self.findings = lint.run(self.model, cfg)[0] if self.model else []

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
        return (tbl['note'] or '') + '\n' + '\n'.join(ix['note'] for ix in tbl['indexes']) + '\n' + '\n'.join(c['note'] for c in tbl['cols'])

    def hit(self, rule, table=None, col=None):
        return [f for f in self.findings if f['rule'] == rule and (not table or f['table'] == table) and (not col or f['col'] == col)]

    def mentions(self, need, words):
        """Đoạn văn trong báo cáo/câu hỏi nhắc `need` kèm một trong `words` (cách nhau tối đa 400 ký tự)."""
        for m in re.finditer(re.escape(need), self.text):
            seg = self.text[max(0, m.start() - 200):m.end() + 400]
            if re.search(words, seg, re.I):
                return seg.replace('\n', ' ')[:300]
        return ''


def S(res, why=''):
    return (res, why)


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
    code = [(t, c) for t, c in r.all_cols(r'^patient_code$')]
    if not code:
        return S('không', 'không có cột patient_code')
    t = code[0][0]
    partial = re.search(r'WHERE\s+deleted_at\s+IS\s+NULL', r.note(t), re.I)
    plain = [f for f in r.hit('DB-IDX-12', t) if 'patient_code' in f['target']]
    if partial and not plain:
        return S('đạt', 'index một phần trong Note')
    if partial:
        return S('một phần', 'có index một phần nhưng vẫn còn unique thường trên bảng xóa mềm')
    return S('không', 'unique thường trên bảng có deleted_at')


def d05(r):
    cs = r.all_cols(r'deposit')
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
    t = r.tables_like(r'allerg')
    inline = [(tt, c['name']) for tt, c in r.all_cols(r'allerg') if tt in ('patients', 'people')]
    if inline:
        return S('không', 'cột dị ứng nằm trên {}'.format(inline))
    if t and any(re.search(r'patient', c['name']) for c in r.cols(t[0])):
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
    sets = dm.unique_sets(r.T[t])
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


def d13(r):
    casc = [(x['fk_table'], x['fk_cols'][0]) for x in r.model['refs'] if x['delete'] == 'cascade' and x['pk_table'] in ('patients', 'appointments', 'invoices')]
    soft = any(c['name'] == 'deleted_at' for c in r.cols('patients'))
    inline_del = [x for x in r.model['refs'] if x['inline_action']]
    if casc:
        return S('không', 'cascade từ patients/appointments/invoices: {}'.format(casc))
    declared = [x for x in r.model['refs'] if x['pk_table'] in ('patients', 'appointments', 'invoices') and not x['inline'] and x['delete']]
    if soft and declared:
        return S('đạt', 'xóa mềm + {} Ref rời có hành vi xóa'.format(len(declared)))
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
    sets = dm.unique_sets(r.T[t[0]])
    if any(u == ('patient_id',) for u in sets):
        return S('đạt', '{}.patient_id unique'.format(t[0]))
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
    for t in key['traps']:
        res, why = CHECKS[t['id']](run)
        out.append({'id': t['id'], 'loai': t['loai'], 'need': t['need'], 'bay': t['bay'], 'ket_qua': res, 'ghi_chu': why})
        row = tally[t['loai']]
        row[0] += res == 'đạt'
        row[1] += res == 'một phần'
        row[2] += res == 'tay'
    # lỗi mới: phát hiện ERROR/WARN có mặt ở kết quả nhưng không có ở schema mẫu
    sample = os.path.join(os.path.dirname(os.path.abspath(args[0])), 'sample', 'docs', 'database', 'schema.dbml')
    new_debt = None
    if os.path.isfile(sample):
        m0 = dm.load(sample)
        cfg, _ = lint.load_config(None)
        cfg['tenant_column'] = 'organization_id'
        base = {(f['rule'], f['target']) for f in lint.run(m0, cfg)[0] if f['level'] in ('ERROR', 'WARN')}
        now = {(f['rule'], f['target']) for f in run.findings if f['level'] in ('ERROR', 'WARN')}
        new_debt = sorted(now - base)
    if '--json' in args:
        print(json.dumps({'traps': out, 'tally': tally, 'new_warn_error': new_debt}, ensure_ascii=False, indent=1))
        return 0
    print('{:<4} {:<11} {:<5} {:<34} {:<9} {}'.format('Mã', 'Loại', 'Nhu cầu', 'Bẫy', 'Kết quả', 'Ghi chú'))
    for o in out:
        print('{:<4} {:<11} {:<5} {:<34} {:<9} {}'.format(o['id'], o['loai'], o['need'], o['bay'], o['ket_qua'], o['ghi_chu'][:90]))
    d, q = tally['thiết kế'], tally['requirement']
    print()
    print('Bẫy thiết kế: {}/15 đạt · {} một phần · {} chấm tay'.format(d[0], d[1], d[2]))
    print('Bẫy requirement: {}/5 đạt · {} một phần · {} chấm tay   (mục tiêu 5/5)'.format(q[0], q[1], q[2]))
    if new_debt is not None:
        print('ERROR/WARN mới so với schema mẫu: {}'.format(len(new_debt)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
