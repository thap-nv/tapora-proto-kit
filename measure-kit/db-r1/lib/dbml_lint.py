# -*- coding: utf-8 -*-
"""Bộ soát schema DBML — mỗi hàm soát gắn một mã rule (xem rules.py --index).

Mức: ERROR chỉ cho rule CRITICAL phát hiện chắc chắn · WARN cho rule HIGH · INFO cho phát
hiện heuristic và rule MEDIUM/LOW. Mã thoát: 0 sạch · 1 còn ERROR mới · 2 lỗi công cụ/cấu hình.

  dbml_lint.py F [--config C] [--baseline B] [--json OUT] [--show-debt] [--limit N]
  dbml_lint.py F --fix DB-INT-05        in đoạn DBML sửa hàng loạt cho rule đó
  dbml_lint.py F --suggest-config       in bản nháp schema-lint.json (cột tenant, bảng toàn cục, hậu tố kiểm toán)

Cấu hình `schema-lint.json` (tự tìm cạnh file DBML): dialect · tenant_column · global_tables ·
audit_fk_suffixes · default_on_delete · volumes · max_indexes_per_table · money_pattern ·
access_patterns[] · waivers[] ({rule, target, reason}) · diagram.infra_columns ·
requirement_code_pattern.
"""
import fnmatch
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dbml_model as dm  # noqa: E402

DEFAULTS = {
    'dialect': None, 'tenant_column': None, 'global_tables': [], 'audit_fk_suffixes': ['_by'],
    'default_on_delete': 'restrict', 'volumes': {}, 'max_indexes_per_table': 8,
    'money_pattern': r'(^|_)(price|amount|total|cost|fee|balance|revenue|salary|payment|refund|tax|discount|charge)(_|$)',
    'access_patterns': [], 'waivers': [], 'diagram': {'infra_columns': []},
    'requirement_code_pattern': '', 'soft_delete_columns': ['deleted_at'],
    'audit_columns': ['created_at', 'updated_at'], 'max_columns_per_table': 40,
    'enum_max_values': 10, 'global_unique': [], 'non_fk_id_columns': [],
    'boolean_prefixes': ['is_', 'has_', 'can_', 'should_', 'allow_', 'allows_', 'requires_', 'uses_', 'needs_', 'was_'],
}

CHECKS = []
IMPLEMENTED = set()
RESERVED = set('''all analyse analyze and any array as asc asymmetric both case cast check collate column
constraint create current_catalog current_date current_role current_time current_timestamp current_user
default deferrable desc distinct do else end except false fetch for foreign from grant group having in
initially intersect into lateral leading limit localtime localtimestamp not null offset on only or order
placing primary references returning select session_user some symmetric table then to trailing true union
unique user using variadic when where window with'''.split())
BUILTIN = set('''smallint integer int int2 int4 int8 bigint serial bigserial smallserial decimal numeric real
float float4 float8 double double_precision money boolean bool char varchar character text citext bytea date
time timetz timestamp timestamptz datetime interval uuid json jsonb xml inet cidr macaddr point line lseg box
path polygon circle tsvector tsquery int4range int8range numrange tsrange tstzrange daterange bit varbit blob
longblob mediumblob tinyblob longtext mediumtext tinytext tinyint mediumint year binary varbinary nvarchar nchar
ntext datetime2 datetimeoffset smalldatetime sql_variant ltree hstore'''.split())
INT_FAMILY = {'smallint', 'integer', 'int', 'int2', 'int4', 'int8', 'bigint', 'serial', 'bigserial', 'smallserial',
              'tinyint', 'mediumint'}
INT32 = {'integer', 'int', 'int4', 'serial', 'smallint', 'int2', 'smallserial', 'tinyint', 'mediumint'}
TEXT_FAMILY = {'text', 'varchar', 'char', 'character', 'citext', 'character varying', 'nvarchar', 'nchar', 'ntext',
               'longtext', 'mediumtext', 'tinytext'}
TS_NAIVE = {'timestamp', 'datetime', 'timestamp without time zone', 'datetime2', 'smalldatetime'}


def check(*ids):
    def deco(fn):
        CHECKS.append((fn, ids))
        IMPLEMENTED.update(ids)
        return fn
    return deco


# --------------------------------------------------------------------------- cấu hình
def find_config(dbml_path):
    p = os.path.join(os.path.dirname(os.path.abspath(dbml_path)), 'schema-lint.json')
    return p if os.path.isfile(p) else None


def load_config(path):
    cfg = json.loads(json.dumps(DEFAULTS))
    errors = []
    if path:
        try:
            with io.open(path, encoding='utf-8-sig') as f:
                user = json.load(f)
        except Exception as e:  # noqa: BLE001
            return cfg, ['Không đọc được {}: {}'.format(path, e)]
        for k, v in user.items():
            if k.startswith('_'):
                continue
            if k == 'diagram' and isinstance(v, dict):
                cfg['diagram'].update(v)
            else:
                cfg[k] = v
    for i, w in enumerate(cfg['waivers']):
        if not isinstance(w, dict) or not w.get('rule') or not w.get('target') or not str(w.get('reason', '')).strip():
            errors.append('waivers[{}] phải có đủ rule, target và reason (lý do không được trống)'.format(i))
    return cfg, errors


# --------------------------------------------------------------------------- ngữ cảnh
class Ctx:
    def __init__(self, model, cfg):
        self.m = model
        self.cfg = cfg
        self.findings = []
        self.notes = []
        self.tables = model['tables']
        pt = (model['project'].get('database_type') or '').lower()
        d = (cfg.get('dialect') or pt or 'postgresql').lower()
        self.dialect = 'postgresql' if d.startswith('postgres') or d in ('pg', 'postgresql') else d
        self.pg = self.dialect == 'postgresql'
        self.tenant = cfg.get('tenant_column')
        self.global_tables = set(cfg.get('global_tables') or [])
        self.audit_suffixes = tuple(cfg.get('audit_fk_suffixes') or [])
        self.enum_names = {k.lower() for k in model['enums']}
        self.fk_cols = {}       # (table, col) → ref
        self.refs_of = {}       # table → [ref] (khóa ngoại của bảng)
        for r in model['refs']:
            if r['kind'] == 'm2m':
                continue
            self.refs_of.setdefault(r['fk_table'], []).append(r)
            for c in r['fk_cols']:
                self.fk_cols.setdefault((r['fk_table'], c), r)
        self.money_re = re.compile(cfg.get('money_pattern') or DEFAULTS['money_pattern'], re.I)
        self.soft_cols = set(cfg.get('soft_delete_columns') or [])

    # -- ghi phát hiện
    def add(self, rule, level, table, col=None, line=0, msg='', fix='', key=None):
        tgt = '{}.{}'.format(table, col) if col else (table or '')
        self.findings.append({'rule': rule, 'level': level, 'table': table or '', 'col': col or '',
                              'line': line, 'msg': msg, 'fix': fix, 'target': key or tgt})

    # -- tiện ích bảng
    def vol(self, t):
        return (self.cfg.get('volumes') or {}).get(t)

    def big(self, t):
        return self.vol(t) in ('L', 'XL')

    def is_audit(self, name):
        return bool(self.audit_suffixes) and name.endswith(self.audit_suffixes)

    def col_names(self, t):
        return [c['name'] for c in self.tables[t]['cols']]

    def pk_cols(self, t):
        pk = [c['name'] for c in self.tables[t]['cols'] if c['pk']]
        for ix in self.tables[t]['indexes']:
            if ix['pk']:
                pk = list(ix['cols'])
        return pk

    def fk_col_names(self, t):
        return {c for (tt, c) in self.fk_cols if tt == t}

    def is_junction(self, t):
        fks = self.fk_col_names(t)
        skip = {c for c in self.pk_cols(t) if c not in fks} | {'id', 'created_at', 'updated_at', 'deleted_at'}
        if self.tenant:
            skip.add(self.tenant)
        rest = [c for c in self.col_names(t) if c not in skip and not self.is_audit(c)]
        if len(rest) < 2 or not all(c in fks for c in rest):
            return False
        # bảng nối thật có khóa chính ghép hoặc unique phủ ít nhất hai cột khóa ngoại
        return any(len(set(u) & set(rest)) >= 2 for u in dm.unique_sets(self.tables[t]))

    def is_log_like(self, t):
        return bool(re.search(r'(^|_)(logs?|history|histories|events?|audit|audits|ledger)(_|$)', t))

    def covers(self, t, cols):
        """Có index nào bắt đầu bằng đúng tập cột này (không phân biệt thứ tự trong tiền tố)."""
        n = len(cols)
        for ix_cols, _u, typ, _l in dm.index_lists(self.tables[t]):
            pre = ix_cols[:n]
            if len(pre) == n and set(pre) == set(cols) and not any(x.startswith('`') for x in pre):
                return True
        return False

    def note_text(self, t):
        tbl = self.tables[t]
        return (tbl['note'] or '') + '\n' + '\n'.join(ix['note'] for ix in tbl['indexes'] if ix['note']) + '\n' + \
            '\n'.join(c['note'] for c in tbl['cols'] if c['note'])

    def type_family(self, c):
        b = c['base']
        if b in INT_FAMILY:
            return 'int'
        if b in TEXT_FAMILY or b.startswith('character'):
            return 'text'
        if b in ('numeric', 'decimal'):
            return 'numeric'
        if b in self.enum_names:
            return 'enum:' + b
        return b


IRREGULAR_PLURALS = {'people', 'children', 'data', 'media', 'staff', 'series', 'species', 'news'}


def _plural(w):
    return w in IRREGULAR_PLURALS or (w.endswith('s') and not w.endswith(('ss', 'us', 'is')))


def _last_word(name):
    toks = [t for t in name.split('.')[-1].split('_') if t]
    while len(toks) > 1 and toks[-1].isdigit():
        toks.pop()
    return toks[-1] if toks else name


def _forms(word):
    out = {word, word + 's', word + 'es'}
    if word.endswith('y'):
        out.add(word[:-1] + 'ies')
    if word.endswith('s'):
        out.add(word[:-1])
    return out


def _ref_endpoint(t, cols):
    return '{}.{}'.format(t, cols[0] if len(cols) == 1 else '(' + ', '.join(cols) + ')')


# --------------------------------------------------------------------------- INT
@check('DB-INT-01')
def c_pk(x):
    for t, tbl in x.tables.items():
        if not x.pk_cols(t):
            x.add('DB-INT-01', 'ERROR', t, line=tbl['line'], msg='bảng không có khóa chính',
                  fix='id bigint [pk, increment]')


@check('DB-INT-02')
def c_fk_real(x):
    skip = set(x.cfg.get('non_fk_id_columns') or []) | {'external_id', 'request_id', 'trace_id', 'correlation_id',
                                                       'session_id', 'idempotency_key'}
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            n = c['name']
            if not n.endswith('_id') or c['pk'] or (t, n) in x.fk_cols or n in skip or n.endswith(('_external_id', '_uuid')):
                continue
            toks = n[:-3].split('_')
            match, whole = None, False
            for k in range(len(toks)):
                forms = _forms('_'.join(toks[k:]))
                match = next((o for o in x.tables if o in forms), None)
                if match:
                    whole = k == 0
                    break
            if match:
                x.add('DB-INT-02', 'WARN' if whole else 'INFO', t, n, c['line'],
                      'cột trông như khóa ngoại tới {} nhưng không có Ref{}'.format(match, '' if whole else ' (khớp theo đuôi tên — định danh ngoài?)'),
                      'Ref: {}.{} > {}.id [delete: restrict]'.format(t, n, match))
            else:
                x.add('DB-INT-02', 'INFO', t, n, c['line'], 'cột *_id không có Ref và không khớp bảng nào — định danh ngoài? ghi vào non_fk_id_columns')


@check('DB-INT-03')
def c_ref_valid(x):
    for r in x.m['refs']:
        ft, pt = x.tables.get(r['fk_table']), x.tables.get(r['pk_table'])
        if not ft or not pt:
            miss = r['fk_table'] if not ft else r['pk_table']
            x.add('DB-INT-03', 'ERROR', r['fk_table'], line=r['line'], msg='Ref trỏ tới bảng không có: ' + miss,
                  key='{}|{}'.format(r['fk_table'], miss))
            continue
        bad = [c for c in r['fk_cols'] if not dm.col_of(ft, c)] + [c for c in r['pk_cols'] if not dm.col_of(pt, c)]
        if bad:
            x.add('DB-INT-03', 'ERROR', r['fk_table'], ','.join(r['fk_cols']), r['line'], 'Ref trỏ tới cột không có: ' + ', '.join(bad))
            continue
        if len(r['fk_cols']) != len(r['pk_cols']):
            x.add('DB-INT-03', 'ERROR', r['fk_table'], ','.join(r['fk_cols']), r['line'], 'số cột hai vế Ref không bằng nhau')
            continue
        if r['kind'] != 'm2m' and not any(set(u) == set(r['pk_cols']) for u in dm.unique_sets(pt)):
            x.add('DB-INT-03', 'ERROR', r['fk_table'], ','.join(r['fk_cols']), r['line'],
                  'Ref trỏ tới {} — không phải PK hay UNIQUE, SQL không tạo được khóa ngoại'.format(_ref_endpoint(r['pk_table'], r['pk_cols'])),
                  'thêm unique cho {}({})'.format(r['pk_table'], ', '.join(r['pk_cols'])))


@check('DB-INT-04')
def c_fk_type(x):
    for r in x.m['refs']:
        ft, pt = x.tables.get(r['fk_table']), x.tables.get(r['pk_table'])
        if not ft or not pt or r['kind'] == 'm2m' or len(r['fk_cols']) != len(r['pk_cols']):
            continue
        for a, b in zip(r['fk_cols'], r['pk_cols']):
            ca, cb = dm.col_of(ft, a), dm.col_of(pt, b)
            if not ca or not cb:
                continue
            fa, fb = x.type_family(ca), x.type_family(cb)
            if fa != fb:
                x.add('DB-INT-04', 'ERROR', r['fk_table'], a, ca['line'],
                      'kiểu {} khác kiểu {} của {}.{}'.format(ca['type'], cb['type'], r['pk_table'], b))
            elif fa == 'int' and ca['base'] != cb['base'] and not ({ca['base'], cb['base']} <= {'serial', 'integer', 'int', 'int4'}):
                x.add('DB-INT-04', 'WARN', r['fk_table'], a, ca['line'],
                      'độ rộng {} khác {} của {}.{}'.format(ca['type'], cb['type'], r['pk_table'], b))


def _suggest_delete(x, r):
    ft = x.tables.get(r['fk_table'])
    if not ft:
        return x.cfg['default_on_delete']
    col = dm.col_of(ft, r['fk_cols'][0])
    if x.is_audit(r['fk_cols'][0]):
        return 'set null' if col and col['nullable'] else 'restrict'
    if x.tenant and x.tenant in r['fk_cols']:
        return 'restrict'
    if x.is_junction(r['fk_table']) and r['fk_cols'][0] != x.tenant:
        return 'cascade'
    return x.cfg['default_on_delete']


def ref_fix_line(x, r):
    return 'Ref: {} > {} [delete: {}]'.format(_ref_endpoint(r['fk_table'], r['fk_cols']),
                                              _ref_endpoint(r['pk_table'], r['pk_cols']), _suggest_delete(x, r))


@check('DB-INT-05')
def c_delete(x):
    for r in x.m['refs']:
        if r['kind'] == 'm2m' or r['fk_table'] not in x.tables:
            continue
        key = '{}.{}'.format(r['fk_table'], '+'.join(r['fk_cols']))
        if r['inline_action']:
            x.add('DB-INT-05', 'WARN', r['fk_table'], r['fk_cols'][0], r['line'],
                  'ref inline mang delete/update — dbml2sql báo lỗi; chuyển sang Ref rời', ref_fix_line(x, r), key=key + '|inline')
        elif not r['delete']:
            x.add('DB-INT-05', 'WARN', r['fk_table'], r['fk_cols'][0], r['line'], 'khóa ngoại chưa khai hành vi xóa',
                  ref_fix_line(x, r), key=key)


@check('DB-INT-06')
def c_notnull(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['nullable'] and c['name'] in ('created_at', 'updated_at', 'status'):
                x.add('DB-INT-06', 'WARN', t, c['name'], c['line'], 'cột gần như chắc chắn bắt buộc mà cho NULL',
                      '{} {} [not null{}]'.format(c['name'], c['type'], ', default: `now()`' if c['name'].endswith('_at') else ''))
        n = len(tbl['cols'])
        nn = sum(1 for c in tbl['cols'] if c['nullable'])
        if n >= 8 and nn / n >= 0.6:
            x.add('DB-INT-06', 'INFO', t, line=tbl['line'], msg='{}/{} cột cho NULL — mỗi cột NULL là một nhánh logic'.format(nn, n))


_KEYISH = ('code', 'slug', 'email', 'username', 'sku', 'login_identifier')


@check('DB-INT-07')
def c_business_key(x):
    for t, tbl in x.tables.items():
        sets = dm.unique_sets(tbl)
        fks = x.fk_col_names(t)
        for c in tbl['cols']:
            n = c['name']
            if c['pk'] or n in fks:
                continue
            exact = n in _KEYISH
            suffix = n.endswith(('_code', '_slug', '_number', '_reference'))
            if not (exact or suffix) or any(n in u for u in sets):
                continue
            x.add('DB-INT-07', 'WARN' if exact else 'INFO', t, n, c['line'],
                  'trông như khóa nghiệp vụ nhưng chưa UNIQUE' + ('' if exact else ' (đoán theo tên)'),
                  'indexes {{ ({}{}) [unique] }}'.format((x.tenant + ', ') if x.tenant and x.tenant in x.col_names(t) else '', n))


@check('DB-INT-08')
def c_unique_tenant(x):
    if not x.tenant:
        return
    gu = x.cfg.get('global_unique') or []
    for t, tbl in x.tables.items():
        if t in x.global_tables or x.tenant not in x.col_names(t):
            continue
        pk = set(x.pk_cols(t))
        for u in dm.unique_sets(tbl):
            if len(u) == 1 and u[0] not in pk and u[0] != x.tenant:
                if (t, u[0]) in x.fk_cols:      # unique trên khóa ngoại = quan hệ 1–1; cha đã thuộc một tenant (DB-INT-14 lo phần này)
                    continue
                if any(fnmatch.fnmatch('{}.{}'.format(t, u[0]), g) for g in gu):
                    continue
                c = dm.col_of(tbl, u[0])
                x.add('DB-INT-08', 'WARN', t, u[0], c['line'] if c else tbl['line'],
                      'unique toàn cục trên bảng có {} — hai tenant không dùng chung giá trị được'.format(x.tenant),
                      'indexes {{ ({}, {}) [unique] }}'.format(x.tenant, u[0]))


@check('DB-INT-09')
def c_null_unique(x):
    for t, tbl in x.tables.items():
        nt = x.note_text(t)
        if re.search(r'NULLS\s+NOT\s+DISTINCT', nt, re.I):
            continue
        pk = set(x.pk_cols(t))
        seen = set()
        for u, line in [((c['name'],), c['line']) for c in tbl['cols'] if c['unique'] and not c['pk']] + \
                       [(tuple(ix['cols']), ix['line']) for ix in tbl['indexes'] if ix['unique'] and not ix['pk']]:
            for cn in u:
                c = dm.col_of(tbl, cn)
                if not c or not c['nullable'] or cn in pk or (u, cn) in seen:
                    continue
                if re.search(r'WHERE[^\n]*\b{}\b[^\n]*IS\s+(NOT\s+)?NULL'.format(re.escape(cn)), nt, re.I):
                    continue
                seen.add((u, cn))
                if len(u) == 1:   # unique đơn trên cột cho NULL = "tối đa một dòng có giá trị" — thường là chủ đích (1–1 tùy chọn)
                    x.add('DB-INT-09', 'INFO', t, cn, line,
                          'UNIQUE đơn trên cột cho NULL — nhiều dòng NULL vẫn hợp lệ; đúng nếu NULL nghĩa là "chưa có"',
                          key='{}.{}|{}'.format(t, cn, ','.join(u)))
                    continue
                x.add('DB-INT-09', 'WARN', t, cn, line,
                      'cột cho NULL nằm trong UNIQUE ({}) — mọi NULL đều "khác nhau", trùng vẫn lọt'.format(', '.join(u)),
                      'PG15+: NULLS NOT DISTINCT (ghi vào Note) hoặc hai index một phần', key='{}.{}|{}'.format(t, cn, ','.join(u)))


_BOUNDED = re.compile(r'(^|_)(quantity|qty|amount|price|total|percent|percentage|rate|count|minutes|seconds|hours|duration|age|score|capacity)(_|$)')


@check('DB-INT-10')
def c_check(x):
    for t, tbl in x.tables.items():
        covered = ' '.join(c['check'] for c in tbl['cols'] if c['check']) + ' ' + ' '.join(k['expr'] for k in tbl['checks'])
        for ln in (tbl['note'] or '').splitlines() + [ix['note'] for ix in tbl['indexes']]:
            if re.search(r'\bCHECK\b', ln or ''):
                covered += ' ' + ln
        for c in tbl['cols']:
            if c['check'] or c['name'] in covered:
                continue
            if x.type_family(c) in ('int', 'numeric') or c['base'] in ('float', 'double', 'real'):
                if _BOUNDED.search(c['name']) and not c['pk'] and (t, c['name']) not in x.fk_cols:
                    x.add('DB-INT-10', 'INFO', t, c['name'], c['line'], 'số có biên hợp lý mà chưa có CHECK',
                          '{} {} [check: `{} >= 0`]'.format(c['name'], c['type'], c['name']))


_RANGE_PAIRS = [('start_time', 'end_time'), ('starts_at', 'ends_at'), ('start_at', 'end_at'), ('valid_from', 'valid_to'),
                ('effective_from', 'effective_to'), ('from_date', 'to_date'), ('start_date', 'end_date'),
                ('started_at', 'ended_at')]


@check('DB-INT-11')
def c_exclude(x):
    if not x.pg:
        return
    for t, tbl in x.tables.items():
        names = set(x.col_names(t))
        for a, b in _RANGE_PAIRS:
            if a in names and b in names:
                nt = x.note_text(t)
                if re.search(r'EXCLUDE|tstzrange|daterange|tsrange', nt, re.I):
                    break
                x.add('DB-INT-11', 'INFO', t, a, dm.col_of(tbl, a)['line'],
                      'cặp {}/{} — nếu không được chồng nhau thì cần EXCLUDE (viết trong Note)'.format(a, b))
                break


@check('DB-INT-14')
def c_one_to_one(x):
    for r in x.m['refs']:
        ft = x.tables.get(r['fk_table'])
        if not ft:
            continue
        if r['kind'] == 'o2o' and not any(set(u) == set(r['fk_cols']) for u in dm.unique_sets(ft)):
            x.add('DB-INT-14', 'WARN', r['fk_table'], r['fk_cols'][0], r['line'], 'quan hệ 1–1 khai bằng "-" nhưng cột FK chưa UNIQUE',
                  'đặt unique cho ({})'.format(', '.join(r['fk_cols'])))
    for t, tbl in x.tables.items():
        if re.search(r'(profile|settings|preferences|detail|details)$', t):
            for r in x.refs_of.get(t, []):
                if r['kind'] == 'm2o' and len(r['fk_cols']) == 1 and not any(set(u) == set(r['fk_cols']) for u in dm.unique_sets(tbl)):
                    base = r['pk_table'].rstrip('s')
                    if t.startswith(base):
                        x.add('DB-INT-14', 'INFO', t, r['fk_cols'][0], r['line'], 'bảng mở rộng của {} nhưng FK chưa UNIQUE — thực sự 1–1?'.format(r['pk_table']))


@check('DB-INT-17')
def c_enum_used(x):
    used = set()
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            b = c['base'].split('.')[-1]
            used.add(b)
            if b not in BUILTIN and b not in x.enum_names and not c['array'] and b:
                x.add('DB-INT-17', 'WARN', t, c['name'], c['line'], 'kiểu {} không phải kiểu dựng sẵn và chưa khai Enum'.format(c['type']))
    for name, e in x.m['enums'].items():
        if name.lower().split('.')[-1] not in used:
            x.add('DB-INT-17', 'INFO', name, line=e['line'], msg='Enum đã khai mà không cột nào dùng', key='enum:' + name)


# --------------------------------------------------------------------------- TYP
@check('DB-TYP-01', 'DB-TYP-02', 'DB-TYP-03')
def c_pk_types(x):
    v4, incs = [], []
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if not c['pk'] and (t, c['name']) not in x.fk_cols:
                continue
            if c['base'] in INT32:
                x.add('DB-TYP-02', 'WARN', t, c['name'], c['line'], 'khóa dùng {} (32 bit, tràn ở ~2,1 tỷ)'.format(c['base']),
                      '{} bigint'.format(c['name']))
            if c['base'] in ('serial', 'bigserial', 'smallserial'):
                x.add('DB-TYP-03', 'WARN', t, c['name'], c['line'], '{} là cú pháp cũ'.format(c['base']),
                      'bigint GENERATED ALWAYS AS IDENTITY (migration)')
            elif c['increment'] and x.pg:
                incs.append(t)
            if c['pk'] and c['base'] == 'uuid' and c['default'] and re.search(r'gen_random_uuid|uuid_generate_v4|uuid4', str(c['default'])):
                v4.append(t)
                if x.big(t):
                    x.add('DB-TYP-01', 'WARN', t, c['name'], c['line'], 'PK UUIDv4 trên bảng cỡ {} — chèn rải khắp cây B-tree'.format(x.vol(t)),
                          'bigint identity hoặc uuidv7() (PG18+)')
    if incs:
        x.add('DB-TYP-03', 'INFO', incs[0], line=0, key='increment-summary',
              msg='{} cột increment ở {} bảng — dbml2sql dịch sang serial; migration thật dùng GENERATED … AS IDENTITY'.format(len(incs), len(set(incs))))
    small = [t for t in v4 if not x.big(t)]
    if small:
        x.add('DB-TYP-01', 'INFO', small[0], line=0, key='uuidv4-summary',
              msg='{} bảng PK UUIDv4 ({}…) — chấp nhận được ở cỡ S/M; bảng lớn lên thì đổi bigint hoặc uuidv7'.format(len(small), ', '.join(small[:3])))


@check('DB-TYP-04')
def c_timestamptz(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['base'] in TS_NAIVE and x.pg:
                x.add('DB-TYP-04', 'WARN', t, c['name'], c['line'], '{} không mang múi giờ'.format(c['type']), '{} timestamptz'.format(c['name']))
            elif c['name'].endswith('_at') and c['base'] == 'date':
                x.add('DB-TYP-04', 'INFO', t, c['name'], c['line'], 'tên *_at nhưng kiểu date — mốc thời điểm hay ngày?')


@check('DB-TYP-05')
def c_money(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if not x.money_re.search(c['name']) or re.search(r'(count|sessions|minutes|hours|days|items|quantity|qty|number|lines|rows|seats|slots)', c['name']):
                continue
            if c['base'] in ('float', 'float4', 'float8', 'double', 'double precision', 'real', 'money'):
                x.add('DB-TYP-05', 'ERROR', t, c['name'], c['line'], 'tiền kiểu {} — làm tròn nhị phân, cộng sai lệch'.format(c['base']),
                      '{} numeric(14,2)  // hoặc bigint tính theo đơn vị nhỏ nhất'.format(c['name']))
            elif c['base'] in ('numeric', 'decimal') and not c['args']:
                x.add('DB-TYP-05', 'WARN', t, c['name'], c['line'], 'numeric không khai độ chính xác', '{} numeric(14,2)'.format(c['name']))
            elif c['base'] in INT32 and not c['name'].endswith(('_id', '_count')):
                x.add('DB-TYP-05', 'INFO', t, c['name'], c['line'], 'tiền kiểu {} — đủ rộng cho đơn vị nhỏ nhất chưa?'.format(c['base']))


@check('DB-TYP-06')
def c_varchar(x):
    if not x.pg:
        return
    hit = [(t, c) for t, tbl in x.tables.items() for c in tbl['cols'] if c['base'] in ('varchar', 'character varying') and c['args']]
    if hit:
        x.add('DB-TYP-06', 'INFO', hit[0][0], line=0, key='varchar-summary',
              msg='{} cột varchar(n) ở {} bảng — PG không nhanh hơn text; nếu n là luật nghiệp vụ thì dùng CHECK'.format(
                  len(hit), len({t for t, _ in hit})))


@check('DB-TYP-07')
def c_bool(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['base'] in ('boolean', 'bool') and (c['nullable'] or c['default'] is None):
                x.add('DB-TYP-07', 'WARN', t, c['name'], c['line'], 'boolean {}'.format('cho NULL (ba trạng thái)' if c['nullable'] else 'không có mặc định'),
                      '{} boolean [not null, default: false]'.format(c['name']))


@check('DB-TYP-08')
def c_json(x):
    if not x.pg:
        return
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['base'] == 'json':
                x.add('DB-TYP-08', 'WARN', t, c['name'], c['line'], 'json (văn bản thô) — không index, không so sánh được', '{} jsonb'.format(c['name']))


@check('DB-TYP-09')
def c_blob(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['base'] in ('bytea', 'blob', 'longblob', 'mediumblob', 'tinyblob') or re.search(r'_(base64|blob|binary)$', c['name']):
                x.add('DB-TYP-09', 'WARN', t, c['name'], c['line'], 'lưu nội dung tệp trong bảng — phình bảng và bản sao lưu',
                      '{}_url text  // tệp để ở kho đối tượng'.format(c['name'].split('_')[0]))


_SENTINEL = re.compile(r"^(9999-12-31|1900-01-01|1970-01-01|0001-01-01|-1|n/?a|unknown|none|null|tbd)$", re.I)


@check('DB-TYP-10')
def c_sentinel(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            d = c['default']
            if d is None or c['default_expr']:
                continue
            ds = str(d).strip()
            if _SENTINEL.match(ds) or (ds in ('0', '') and (t, c['name']) in x.fk_cols):
                x.add('DB-TYP-10', 'WARN', t, c['name'], c['line'], 'mặc định {!r} là giá trị lính canh — dùng NULL'.format(ds))


@check('DB-TYP-11')
def c_phone_text(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if re.search(r'(^|_)(phone|mobile|zip|postal|zipcode|tax_code|tax_id)(_|$)', c['name']) and x.type_family(c) in ('int', 'numeric'):
                x.add('DB-TYP-11', 'WARN', t, c['name'], c['line'], 'số điện thoại/mã bưu chính kiểu số — mất số 0 đầu, không phải thứ để cộng',
                      '{} text'.format(c['name']))


@check('DB-TYP-12')
def c_duration_unit(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if re.search(r'(^|_)(duration|timeout|ttl|delay|interval|length)$', c['name']) and x.type_family(c) in ('int', 'numeric'):
                x.add('DB-TYP-12', 'INFO', t, c['name'], c['line'], 'thời lượng không ghi đơn vị trong tên', '{}_minutes'.format(c['name']))


# --------------------------------------------------------------------------- NAM
@check('DB-NAM-01')
def c_snake(x):
    snake = re.compile(r'^[a-z][a-z0-9_]*$')
    for t, tbl in x.tables.items():
        if not snake.match(t.split('.')[-1]):
            x.add('DB-NAM-01', 'WARN', t, line=tbl['line'], msg='tên bảng không phải snake_case ASCII')
        for c in tbl['cols']:
            if not snake.match(c['name']):
                x.add('DB-NAM-01', 'WARN', t, c['name'], c['line'], 'tên cột không phải snake_case ASCII')
    for n, e in x.m['enums'].items():
        if not snake.match(n.split('.')[-1]):
            x.add('DB-NAM-01', 'WARN', n, line=e['line'], msg='tên enum không phải snake_case ASCII', key='enum:' + n)


@check('DB-NAM-02')
def c_plural(x):
    names = [t.split('.')[-1] for t in x.tables]
    pl = [n for n in names if _plural(_last_word(n))]
    ratio = len(pl) / max(1, len(names))
    if ratio >= 0.7:
        for n in names:
            if n not in pl and not x.is_junction(n):
                x.add('DB-NAM-02', 'INFO', n, line=x.tables[n]['line'], msg='tên số ít trong schema đặt tên số nhiều')
    elif ratio <= 0.3 and len(names) >= 6:
        for n in pl:
            x.add('DB-NAM-02', 'INFO', n, line=x.tables[n]['line'], msg='tên số nhiều trong schema đặt tên số ít')


@check('DB-NAM-03')
def c_fk_name(x):
    for (t, c), r in x.fk_cols.items():
        if x.is_audit(c) or c.endswith('_id'):
            continue
        col = dm.col_of(x.tables[t], c) if t in x.tables else None
        x.add('DB-NAM-03', 'INFO', t, c, col['line'] if col else r['line'], 'khóa ngoại không tận cùng _id')


@check('DB-NAM-04')
def c_bool_prefix(x):
    pre = tuple(x.cfg.get('boolean_prefixes') or [])
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['base'] in ('boolean', 'bool') and not c['name'].startswith(pre):
                x.add('DB-NAM-04', 'INFO', t, c['name'], c['line'], 'boolean không có tiền tố is_/has_/can_')


@check('DB-NAM-05')
def c_time_suffix(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            n = c['name']
            rng = ('_from', '_to', '_until', '_since')
            if c['base'] in ('timestamptz', 'timestamp') and not n.endswith(('_at', '_time') + rng):
                x.add('DB-NAM-05', 'INFO', t, n, c['line'], 'mốc thời điểm không tận cùng _at')
            elif c['base'] == 'date' and not n.endswith(('_on', '_date', '_at') + rng):
                x.add('DB-NAM-05', 'INFO', t, n, c['line'], 'ngày không tận cùng _on/_date')


@check('DB-NAM-06')
def c_reserved(x):
    for t, tbl in x.tables.items():
        if t.split('.')[-1] in RESERVED:
            x.add('DB-NAM-06', 'WARN', t, line=tbl['line'], msg='tên bảng trùng từ khóa SQL — phải đặt trong dấu ngoặc kép mọi nơi')
        for c in tbl['cols']:
            if c['name'] in RESERVED:
                x.add('DB-NAM-06', 'WARN', t, c['name'], c['line'], 'tên cột trùng từ khóa SQL')


# --------------------------------------------------------------------------- IDX
@check('DB-IDX-01', 'DB-PERF-03')
def c_fk_index(x):
    if x.dialect.startswith('mysql') or x.dialect == 'mariadb':
        return
    for t, tbl in x.tables.items():
        junction = x.is_junction(t)
        for r in x.refs_of.get(t, []):
            cols = list(r['fk_cols'])
            if any(not dm.col_of(tbl, c) for c in cols) or x.covers(t, cols):
                continue
            c0 = dm.col_of(tbl, cols[0])
            fix = 'indexes {{ ({}) }}'.format(', '.join(cols))
            if junction and not (x.tenant and cols == [x.tenant]) and not all(x.is_audit(c) for c in cols):
                x.add('DB-PERF-03', 'WARN', t, '+'.join(cols), c0['line'], 'bảng nối thiếu index chiều ngược', fix)
            elif all(x.is_audit(c) for c in cols):
                x.add('DB-IDX-01', 'INFO', t, '+'.join(cols), c0['line'], 'khóa ngoại kiểm toán ({}) không index — chỉ cần khi xóa cứng dòng users'.format(cols[0]), fix)
            else:
                x.add('DB-IDX-01', 'WARN', t, '+'.join(cols), c0['line'], 'khóa ngoại chưa có index (JOIN và xóa dòng cha sẽ quét cả bảng)', fix)


def _pat_cols(v):
    return [str(s).split()[0] for s in (v or [])]


def score_pattern(tbl, eq, sort, rng):
    """Chấm một access pattern theo Equality → Sort → Range và tiền tố trái."""
    rank = {'đủ': 3, 'lọc được nhưng phải sắp xếp': 2, 'một phần': 1, 'không có': 0}
    best = 'không có'
    n = len(eq)
    for cols, _u, typ, _l in dm.index_lists(tbl):
        cols = [c for c in cols]
        res = 'không có'
        if n:
            pre = cols[:n]
            if set(pre) == set(eq):
                rest = cols[n:]
                if sort:
                    if rest[:len(sort)] == sort and (not rng or set(rest[len(sort):len(sort) + len(rng)]) == set(rng) or True):
                        res = 'đủ'
                    else:
                        res = 'lọc được nhưng phải sắp xếp'
                elif rng:
                    res = 'đủ' if set(rest[:len(rng)]) == set(rng) else 'một phần'
                else:
                    res = 'đủ'
            elif cols[0] in eq:
                res = 'một phần'
        else:
            lead = sort or rng
            if lead and cols[:len(lead)] == lead:
                res = 'đủ'
            elif lead and cols[0] == lead[0]:
                res = 'một phần'
        if rank[res] > rank[best]:
            best = res
    return best


@check('DB-IDX-02', 'DB-IDX-03')
def c_access(x):
    pats = x.cfg.get('access_patterns') or []
    if not pats:
        x.notes.append('DB-IDX-02 và DB-IDX-03 chưa chấm — schema-lint.json chưa khai access_patterns')
        return
    tally = {}
    for p in pats:
        t = p.get('table')
        tbl = x.tables.get(t)
        pid = p.get('id') or p.get('desc', '?')
        if not tbl:
            x.add('DB-IDX-02', 'WARN', t or '?', msg='access pattern {} trỏ tới bảng không có'.format(pid), key='pattern:' + str(pid))
            continue
        res = score_pattern(tbl, _pat_cols(p.get('eq')), _pat_cols(p.get('sort')), _pat_cols(p.get('range')))
        tally[res] = tally.get(res, 0) + 1
        hot = p.get('freq') in ('hot', 'high', 'cao')
        spec = 'eq({}) sort({}) range({})'.format(','.join(_pat_cols(p.get('eq'))), ','.join(_pat_cols(p.get('sort'))), ','.join(_pat_cols(p.get('range'))))
        fix = 'indexes {{ ({}) }}'.format(', '.join(_pat_cols(p.get('eq')) + _pat_cols(p.get('sort')) + _pat_cols(p.get('range'))))
        if res in ('không có', 'một phần'):
            x.add('DB-IDX-02', 'WARN' if (hot and res == 'không có') else 'INFO', t, line=tbl['line'], key='pattern:' + str(pid),
                  msg='{} [{}]: index {} — {}'.format(pid, p.get('desc', ''), res, spec), fix=fix)
        elif res.startswith('lọc được'):
            x.add('DB-IDX-03', 'WARN' if hot else 'INFO', t, line=tbl['line'], key='pattern:' + str(pid),
                  msg='{} [{}]: index {} — thứ tự cột chưa theo Equality→Sort→Range, {}'.format(pid, p.get('desc', ''), res, spec), fix=fix)
    x.notes.append('access pattern: ' + ' · '.join('{} {}'.format(v, k) for k, v in sorted(tally.items(), key=lambda kv: -kv[1])))


_RANGEY = re.compile(r'(_at|_on|_date|^created|^updated|price|amount|total)$')


@check('DB-IDX-03')
def c_index_order(x):
    for t, tbl in x.tables.items():
        for ix in tbl['indexes']:
            cs = ix['cols']
            if len(cs) >= 2 and not ix['unique'] and not ix['pk'] and _RANGEY.search(cs[0]) and not _RANGEY.search(cs[1]) \
                    and not cs[0].startswith('`'):
                x.add('DB-IDX-03', 'INFO', t, '+'.join(cs), ix['line'], 'cột dạng khoảng ({}) đứng trước cột so bằng ({})'.format(cs[0], cs[1]),
                      'indexes {{ ({}) }}'.format(', '.join(cs[1:] + cs[:1])), key='{}.{}|order'.format(t, '+'.join(cs)))


@check('DB-IDX-04')
def c_redundant(x):
    for t, tbl in x.tables.items():
        items = [(tuple(c), u, typ, l) for c, u, typ, l in dm.index_lists(tbl)]
        for i, (c1, u1, t1, l1) in enumerate(items):
            for j, (c2, u2, t2, l2) in enumerate(items):
                if i == j or t1 != t2:
                    continue
                if c1 == c2 and i < j:
                    x.add('DB-IDX-04', 'WARN', t, '+'.join(c1), l2, 'index trùng hệt index ở dòng {}'.format(l1), key='{}.{}|dup{}'.format(t, '+'.join(c1), l2))
                elif len(c1) < len(c2) and c2[:len(c1)] == c1 and not u1:
                    x.add('DB-IDX-04', 'INFO', t, '+'.join(c1), l1, 'index là tiền tố của index ({}) ở dòng {}'.format(', '.join(c2), l2),
                          key='{}.{}|prefix'.format(t, '+'.join(c1)))


@check('DB-IDX-07')
def c_expr_index(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if re.search(r'(^|_)(email|username|login_identifier)$', c['name']) and c['base'] != 'citext':
                has = c['unique'] or any(c['name'] in ix['cols'] and (ix['unique'] or True) for ix in tbl['indexes'])
                lowered = any(any('lower(' in z.lower() for z in ix['cols']) for ix in tbl['indexes']) or re.search(r'lower\(', x.note_text(t), re.I)
                if has and not lowered:
                    x.add('DB-IDX-07', 'INFO', t, c['name'], c['line'], 'định danh gõ tay có index/unique nhưng không phân biệt hoa thường — lower() hoặc citext?',
                          'indexes {{ (`lower({})`) [unique] }}'.format(c['name']))


@check('DB-IDX-08')
def c_index_type(x):
    for t, tbl in x.tables.items():
        for ix in tbl['indexes']:
            if ix['type'] == 'hash' and (ix['unique'] or ix['pk']):
                x.add('DB-IDX-08', 'WARN', t, '+'.join(ix['cols']), ix['line'], 'PG không hỗ trợ unique với hash', key='{}.{}|hash'.format(t, '+'.join(ix['cols'])))
            for cn in ix['cols']:
                c = dm.col_of(tbl, cn)
                if c and not ix['type'] and (c['base'] in ('jsonb', 'tsvector') or c['array']):
                    x.add('DB-IDX-08', 'WARN', t, cn, ix['line'], 'index btree trên {} — cần gin'.format(c['type']), 'indexes {{ {} [type: gin] }}'.format(cn),
                          key='{}.{}|gin'.format(t, cn))


@check('DB-IDX-09')
def c_budget(x):
    cap = int(x.cfg.get('max_indexes_per_table') or 8)
    for t, tbl in x.tables.items():
        n = len([ix for ix in tbl['indexes'] if not ix['pk']]) + len([c for c in tbl['cols'] if c['unique'] and not c['pk']])
        if n > cap:
            x.add('DB-IDX-09', 'WARN', t, line=tbl['line'], msg='{} index (trần {}) — mỗi index làm chậm mọi lần ghi'.format(n, cap))
        for ix in tbl['indexes']:
            if len(ix['cols']) > 4:
                x.add('DB-IDX-09', 'INFO', t, '+'.join(ix['cols']), ix['line'], 'index {} cột — thường chỉ 3–4 cột đầu có tác dụng'.format(len(ix['cols'])),
                      key='{}.{}|wide'.format(t, '+'.join(ix['cols'])))


@check('DB-IDX-10')
def c_low_card(x):
    for t, tbl in x.tables.items():
        for ix in tbl['indexes']:
            if len(ix['cols']) != 1 or ix['unique'] or ix['pk']:
                continue
            c = dm.col_of(tbl, ix['cols'][0])
            if c and (c['base'] in ('boolean', 'bool') or c['base'] in x.enum_names or c['name'] in ('status', 'type', 'state', 'kind')) \
                    and not re.search(r'WHERE', ix['note'] or '', re.I):
                x.add('DB-IDX-10', 'INFO', t, c['name'], ix['line'], 'index đơn trên cột ít giá trị — thường không được dùng; gộp vào index nhiều cột hoặc làm index một phần',
                      key='{}.{}|lowcard'.format(t, c['name']))


@check('DB-IDX-12')
def c_soft_unique(x):
    for t, tbl in x.tables.items():
        soft = [c['name'] for c in tbl['cols'] if c['name'] in x.soft_cols]
        if not soft:
            continue
        nt = x.note_text(t)
        pk = set(x.pk_cols(t))
        for u, line in [((c['name'],), c['line']) for c in tbl['cols'] if c['unique'] and not c['pk']] + \
                       [(tuple(ix['cols']), ix['line']) for ix in tbl['indexes'] if ix['unique'] and not ix['pk']]:
            if set(u) <= pk:
                continue
            ok = False
            lines = nt.splitlines()
            for i, ln in enumerate(lines):
                if re.search(r'WHERE[^\n]*\b{}\b[^\n]*IS\s+NULL'.format(soft[0]), ln, re.I):
                    window = ' '.join(lines[max(0, i - 3):i + 1])
                    if any(re.search(r'\b{}\b'.format(re.escape(cn)), window) for cn in u):
                        ok = True
            if not ok:
                x.add('DB-IDX-12', 'WARN', t, '+'.join(u), line, 'unique trên bảng xóa mềm — bản đã xóa vẫn chiếm chỗ, không tạo lại được',
                      'ghi vào Note: CREATE UNIQUE INDEX … ({}) WHERE {} IS NULL'.format(', '.join(u), soft[0]), key='{}.{}|soft'.format(t, '+'.join(u)))


# --------------------------------------------------------------------------- MOD
@check('DB-MOD-03')
def c_m2m(x):
    for r in x.m['refs']:
        if r['kind'] == 'm2m':
            x.add('DB-MOD-03', 'WARN', r['fk_table'], line=r['line'], msg='quan hệ nhiều–nhiều khai trực tiếp ({} <> {}) — dựng bảng nối rõ ràng'.format(r['fk_table'], r['pk_table']),
                  key='{}|{}|m2m'.format(r['fk_table'], r['pk_table']))
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if c['array'] and c['name'].endswith('_ids'):
                x.add('DB-MOD-03', 'WARN', t, c['name'], c['line'], 'mảng id thay bảng nối')


@check('DB-MOD-06')
def c_polymorphic(x):
    for t, tbl in x.tables.items():
        names = set(x.col_names(t))
        for c in tbl['cols']:
            n = c['name']
            if n.endswith('_id') and (t, n) not in x.fk_cols and not c['pk']:
                stem = n[:-3]
                if stem + '_type' in names or (stem == 'object' and 'object_type' in names):
                    x.add('DB-MOD-06', 'WARN', t, n, c['line'], 'cặp {0}_type + {0}_id (polymorphic) — không có FK thật'.format(stem),
                          'một bảng nối riêng cho từng loại đích, hoặc FK rỗng + CHECK đúng một')


@check('DB-MOD-07')
def c_eav(x):
    for t, tbl in x.tables.items():
        names = set(x.col_names(t))
        has_key = names & {'attribute', 'attribute_name', 'key', 'property', 'field_name', 'meta_key'}
        has_val = names & {'value', 'attribute_value', 'meta_value', 'field_value'}
        if has_key and has_val and any(n.endswith('_id') for n in names):
            x.add('DB-MOD-07', 'WARN', t, line=tbl['line'], msg='dạng EAV (thực thể–thuộc tính–giá trị): {} / {}'.format(sorted(has_key)[0], sorted(has_val)[0]))


_DERIVED = re.compile(r'^(total_|num_|remaining_|current_|sum_|avg_)|(_count|_total|_balance|_remaining)$|^(balance|age|count)$')


@check('DB-MOD-09')
def c_derived(x):
    for t, tbl in x.tables.items():
        nt = x.note_text(t)
        for c in tbl['cols']:
            if not _DERIVED.search(c['name']) or c['pk'] or (t, c['name']) in x.fk_cols:
                continue
            if any(re.search(r'suy ra|derived|denorm|phi chuẩn|snapshot|cache|đồng bộ|trigger', ln, re.I) and c['name'] in ln for ln in nt.splitlines()):
                continue
            x.add('DB-MOD-09', 'INFO', t, c['name'], c['line'], 'có thể là giá trị suy ra — nếu giữ, ghi nguồn sự thật + cơ chế đồng bộ trong Note')


_FLAG = re.compile(r'^is_(active|cancel+ed|paid|completed|approved|rejected|verified|closed|archived|published|confirmed|done|finished|expired|pending|deleted|locked|suspended|blocked)$')


@check('DB-MOD-10')
def c_state(x):
    for t, tbl in x.tables.items():
        flags = [c for c in tbl['cols'] if _FLAG.match(c['name'])]
        if len(flags) >= 3:
            x.add('DB-MOD-10', 'WARN', t, flags[0]['name'], flags[0]['line'], '{} cờ trạng thái ({}…) — gộp thành một cột status + máy trạng thái'.format(len(flags), ', '.join(f['name'] for f in flags[:3])))
        for c in tbl['cols']:
            if c['name'] in ('status', 'state') and x.type_family(c) == 'text' and not c['check']:
                x.add('DB-MOD-10', 'INFO', t, c['name'], c['line'], 'status kiểu chuỗi tự do — dùng Enum hoặc CHECK')


@check('DB-MOD-15')
def c_enum_vs_lookup(x):
    cap = int(x.cfg.get('enum_max_values') or 10)
    for n, e in x.m['enums'].items():
        if len(e['values']) > cap:
            x.add('DB-MOD-15', 'INFO', n, line=e['line'], key='enum:' + n, msg='Enum {} giá trị (> {}) — danh sách này có hay đổi không? bảng tra cứu cho người dùng quản lý'.format(len(e['values']), cap))
        elif len(e['values']) == 1:
            x.add('DB-MOD-15', 'INFO', n, line=e['line'], key='enum:' + n, msg='Enum một giá trị — chưa là enum')


@check('DB-MOD-18')
def c_audit(x):
    alt = {'created_on', 'inserted_at', 'created', 'created_date', 'recorded_at', 'occurred_at', 'logged_at', 'changed_at', 'sent_at', 'issued_at'}
    need = (x.cfg.get('audit_columns') or ['created_at'])[0]
    for t, tbl in x.tables.items():
        names = set(x.col_names(t))
        if len(tbl['cols']) <= 4 or x.is_junction(t) or need in names or names & alt:
            continue
        x.add('DB-MOD-18', 'INFO', t, line=tbl['line'], msg='không có cột {} hay mốc tương đương'.format(need), fix='{} timestamptz [not null, default: `now()`]'.format(need))


_NUMBERED = re.compile(r'^(.*?[a-z_])_?(\d+)$')


@check('DB-MOD-19')
def c_repeating(x):
    for t, tbl in x.tables.items():
        stems = {}
        for c in tbl['cols']:
            m = _NUMBERED.match(c['name'])
            if m:
                stems.setdefault(m.group(1).rstrip('_'), []).append(c)
        for stem, cs in stems.items():
            if len(cs) >= 2:
                x.add('DB-MOD-19', 'WARN', t, cs[0]['name'], cs[0]['line'], 'nhóm cột lặp {}1, {}2… — chuyển thành bảng con'.format(stem, stem), key='{}.{}*'.format(t, stem))
        fks = x.fk_col_names(t)
        pre = {}
        for c in tbl['cols']:
            if '_' in c['name'] and not c['pk'] and c['name'] not in fks and not x.is_audit(c['name']):
                pre.setdefault(c['name'].split('_')[0], []).append(c)
        for p, cs in pre.items():
            if len(cs) >= 3 and ((p + '_id') in fks or any(o in _forms(p) for o in x.tables)):
                if re.search(r'snapshot|chụp|lúc mua|tại thời điểm', x.note_text(t), re.I):
                    continue
                x.add('DB-MOD-19', 'INFO', t, cs[0]['name'], cs[0]['line'], '{} cột {}_* cùng thuộc về {} — phụ thuộc bắc cầu? (nếu là snapshot, ghi Note)'.format(len(cs), p, p), key='{}.{}_*'.format(t, p))


_LISTY = re.compile(r'(_ids|_list|_csv|_array)$|^(tags|roles|emails|phones|labels|categories)$')


@check('DB-MOD-20')
def c_list_in_col(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            if _LISTY.search(c['name']) and c['base'] not in x.enum_names:      # cột kiểu enum tên *_list là nhãn, không phải danh sách
                lvl = 'WARN' if c['name'].endswith(('_ids', '_csv', '_list')) or c['array'] else 'INFO'
                x.add('DB-MOD-20', lvl, t, c['name'], c['line'], 'có vẻ nhét danh sách vào một cột ({})'.format(c['type']))


# --------------------------------------------------------------------------- SCL
@check('DB-SCL-01')
def c_volumes(x):
    vols = x.cfg.get('volumes') or {}
    if not vols:
        x.add('DB-SCL-01', 'INFO', '', msg='chưa khai volumes — rule SCL-03, SCL-04, SCL-05, TYP-01 chạy ở chế độ không biết cỡ', key='volumes-missing')
        return
    miss = [t for t in x.tables if t not in vols]
    for t in vols:
        if t not in x.tables:
            x.add('DB-SCL-01', 'WARN', t, msg='volumes nhắc tới bảng không có', key='volumes:' + t)
    if miss:
        x.add('DB-SCL-01', 'INFO', miss[0], line=0, key='volumes-partial',
              msg='{} bảng chưa có cỡ ước lượng ({}…)'.format(len(miss), ', '.join(miss[:4])))


@check('DB-SCL-02')
def c_scope_key(x):
    if not x.tenant:
        x.notes.append('DB-SCL-02, DB-SCL-03 chưa chấm — chưa khai tenant_column')
        return
    for t, tbl in x.tables.items():
        if t in x.global_tables or x.tenant in x.col_names(t):
            continue
        x.add('DB-SCL-02', 'WARN' if x.big(t) else 'INFO', t, line=tbl['line'],
              msg='bảng không có {} — thêm tenant thì phải đi vòng qua bảng cha'.format(x.tenant), fix='{} uuid [not null, ref: > organizations.id]'.format(x.tenant))


@check('DB-SCL-03')
def c_scope_lead(x):
    if not x.tenant:
        return
    for t, tbl in x.tables.items():
        if not x.big(t) or x.tenant not in x.col_names(t):
            continue
        for ix in tbl['indexes']:
            if not ix['pk'] and ix['cols'] and ix['cols'][0] != x.tenant:
                x.add('DB-SCL-03', 'WARN', t, '+'.join(ix['cols']), ix['line'], 'bảng cỡ {}: index không dẫn đầu bằng {}'.format(x.vol(t), x.tenant),
                      'indexes {{ ({}, {}) }}'.format(x.tenant, ', '.join(ix['cols'])), key='{}.{}|lead'.format(t, '+'.join(ix['cols'])))


@check('DB-SCL-04', 'DB-SCL-05')
def c_partition_retention(x):
    for t, tbl in x.tables.items():
        nt = x.note_text(t)
        if x.vol(t) == 'XL' and not re.search(r'PARTITION|phân vùng', nt, re.I):
            x.add('DB-SCL-04', 'INFO', t, line=tbl['line'], msg='bảng cỡ XL chưa nói gì về phân vùng')
        if (x.big(t) or x.is_log_like(t)) and not re.search(r'hạn lưu|retention|TTL|purge|lưu trữ|archive|giữ \d', nt, re.I):
            x.add('DB-SCL-05', 'INFO', t, line=tbl['line'], msg='bảng tăng mãi ({}) chưa ghi hạn lưu'.format(x.vol(t) or 'log/lịch sử'))


@check('DB-SCL-06')
def c_unit_is_row(x):
    stems = {}
    for t in x.tables:
        m = re.match(r'^(.*?)_?(\d{2,4})$', t)
        if m and m.group(1):
            stems.setdefault(m.group(1), []).append(t)
    for stem, ts in stems.items():
        if len(ts) >= 2:
            x.add('DB-SCL-06', 'WARN', ts[0], line=x.tables[ts[0]]['line'], msg='các bảng {} cùng khuôn, khác hậu tố số — thêm một đơn vị lại thêm một bảng'.format(', '.join(ts[:3])), key='stem:' + stem)


# --------------------------------------------------------------------------- PERF · SEC
@check('DB-PERF-05')
def c_wide(x):
    cap = int(x.cfg.get('max_columns_per_table') or 40)
    for t, tbl in x.tables.items():
        n = len(tbl['cols'])
        big = [c for c in tbl['cols'] if c['base'] in ('text', 'jsonb', 'json', 'bytea')]
        if n > cap:
            x.add('DB-PERF-05', 'INFO', t, line=tbl['line'], msg='{} cột (> {}) — tách cột nóng/lạnh?'.format(n, cap))
        elif n > 25 and len(big) >= 4:
            x.add('DB-PERF-05', 'INFO', t, line=tbl['line'], msg='{} cột, {} cột text/jsonb lớn — tách phần lạnh sang bảng riêng?'.format(n, len(big)))


_PLAIN = re.compile(r'(^|_)(password|passwd|pwd|card_number|cvv|cvc)$')
_SECRET = re.compile(r'(^|_)(secret|api_key|apikey|token|access_token|refresh_token|private_key|pin|otp|otp_code)$')


@check('DB-SEC-04')
def c_secret(x):
    for t, tbl in x.tables.items():
        for c in tbl['cols']:
            n = c['name']
            if re.search(r'(_hash|_digest|_encrypted|_enc|_hmac)$', n):
                continue
            if x.type_family(c) not in ('text', 'bytea'):
                continue
            if _PLAIN.search(n):
                x.add('DB-SEC-04', 'ERROR', t, n, c['line'], 'bí mật/dữ liệu thẻ lưu nguyên văn', '{}_hash text [not null]'.format(n))
            elif _SECRET.search(n) and not re.search(r'băm|hash|mã hóa|encrypt|digest', c['note'] or '', re.I):
                x.add('DB-SEC-04', 'WARN', t, n, c['line'], 'trông như bí mật — ghi rõ là bản băm/mã hóa, hay đổi tên', '{}_hash'.format(n))


# --------------------------------------------------------------------------- chạy
def run(model, cfg):
    x = Ctx(model, cfg)
    for fn, _ids in CHECKS:
        fn(x)
    # dedupe (cùng rule + target + msg)
    seen, uniq = set(), []
    for f in x.findings:
        k = (f['rule'], f['target'], f['msg'])
        if k not in seen:
            seen.add(k)
            uniq.append(f)
    return uniq, x.notes, x


def apply_waivers(findings, cfg):
    kept, waived = [], []
    ws = [w for w in cfg.get('waivers', []) if w.get('reason')]
    for f in findings:
        hit = None
        for w in ws:
            if w['rule'] != f['rule'] and w['rule'] != '*':
                continue
            pat = w['target']
            if fnmatch.fnmatch(f['target'], pat) or fnmatch.fnmatch(f['table'], pat) or fnmatch.fnmatch(f['target'].split('|')[0], pat):
                hit = w
                break
        if hit:
            g = dict(f)
            g['waived_reason'] = hit['reason']
            waived.append(g)
        else:
            kept.append(f)
    return kept, waived


def split_baseline(findings, baseline_path):
    keys = set()
    if baseline_path and os.path.isfile(baseline_path):
        try:
            with io.open(baseline_path, encoding='utf-8') as f:
                keys = set(json.load(f).get('keys', []))
        except Exception:  # noqa: BLE001
            keys = set()
    for f in findings:
        f['debt'] = '{}|{}'.format(f['rule'], f['target']) in keys
    return keys


def finding_key(f):
    return '{}|{}'.format(f['rule'], f['target'])


def counts(findings):
    c = {'ERROR': 0, 'WARN': 0, 'INFO': 0}
    for f in findings:
        c[f['level']] += 1
    return c


def _clip(s, n):
    return s if len(s) <= n else s[:n - 1] + '…'


def _titles():
    try:
        import rules as _r
        return {k: v['title'] for k, v in _r.load_rules().items()}
    except Exception:  # noqa: BLE001
        return {}


def format_findings(findings, limit=15, width=210, collapse=True):
    """Gộp theo bảng (ERROR, WARN) hoặc theo rule (INFO); mỗi danh sách tối đa `limit` dòng.
    Rule có hơn 3 bảng bị gộp thành một dòng để `limit` dòng đầu không bị một rule chiếm hết."""
    titles = _titles()
    limit = limit or 10 ** 6
    out = []
    for lvl in ('ERROR', 'WARN', 'INFO'):
        fs = [f for f in findings if f['level'] == lvl]
        out.append('── {} ({})'.format(lvl, len(fs)))
        if not fs:
            continue
        groups = {}
        for f in fs:
            k = (f['rule'], f['table']) if lvl != 'INFO' else (f['rule'], '')
            groups.setdefault(k, []).append(f)
        lines = []
        per_rule = {}
        for (rule, table) in groups:
            per_rule.setdefault(rule, []).append(table)
        for (rule, table), g in sorted(groups.items()):
            if lvl == 'INFO':
                label = titles.get(rule) if len(g) > 1 and rule in titles else g[0]['msg']
                tg = ', '.join(dict.fromkeys((f['target'].split('|')[0]) for f in g[:4]))
                lines.append('{}  {} mục — {}  [{}{}]'.format(rule, len(g), _clip(label, 80), tg, ' …' if len(g) > 4 else ''))
            elif collapse and len(per_rule[rule]) > 3:
                if table != per_rule[rule][0]:
                    continue
                allg = [f for k, gg in groups.items() if k[0] == rule for f in gg]
                ex = ', '.join(per_rule[rule][:3])
                hint = '  ▸ --rule {0} liệt kê hết'.format(rule) + (' · --fix {0} in đoạn sửa hàng loạt'.format(rule) if any(f['fix'] for f in allg) else '')
                lines.append('{}  {} mục / {} bảng — {}  [{} …]{}'.format(rule, len(allg), len(per_rule[rule]), _clip(allg[0]['msg'], 70), ex, hint))
            else:
                cols = ', '.join('{}{}'.format(f['col'] or '·', ' d{}'.format(f['line']) if f['line'] else '') for f in g[:5])
                if len(g) > 5:
                    cols += ' +{}'.format(len(g) - 5)
                fix = ''
                if g[0]['fix']:
                    fix = '  ▸ ' + _clip(g[0]['fix'], 70) + (' …' if len(g) > 1 else '')
                lines.append('{}  {}: {} — {}{}'.format(rule, table or '·', cols, _clip(g[0]['msg'], 90), fix))
        for ln in lines[:limit]:
            out.append(' ' + _clip(ln, width))
        if len(lines) > limit:
            out.append(' … +{} dòng nữa (xem report.json)'.format(len(lines) - limit))
    return '\n'.join(out)


def summarize(findings):
    new = [f for f in findings if not f.get('debt')]
    debt = [f for f in findings if f.get('debt')]
    return new, debt


def render(res_findings, waived, notes, model, cfg, dialect, limit=15, show_debt=False, only_rule=None):
    new, debt = summarize(res_findings)
    cn, cd = counts(new), counts(debt)
    lines = ['Soát schema · dialect {} · {}'.format(dialect, dm.stats_line(model['stats']).split(' · ')[0] + ' · ' + dm.stats_line(model['stats']).split(' · ')[1])]
    lines.append('MỚI: ERROR {ERROR} · WARN {WARN} · INFO {INFO}'.format(**cn) +
                 ('   |   nợ cũ: ERROR {ERROR} · WARN {WARN} · INFO {INFO}'.format(**cd) if debt else '') +
                 ('   |   miễn trừ: {}'.format(len(waived)) if waived else ''))
    shown = debt if show_debt else new
    if only_rule:
        shown = [f for f in shown if f['rule'] == only_rule]
    lines.append(format_findings(shown, limit, collapse=not only_rule))
    for n in notes:
        lines.append('ℹ ' + n)
    return '\n'.join(lines)


def suggest_config(model):
    """Bản nháp cấu hình cho schema chưa có schema-lint.json — chỉ ĐỀ XUẤT, người dùng xác nhận."""
    tables = model['tables']
    n = len(tables)
    fk_count = {}
    for r in model['refs']:
        if r['kind'] != 'm2m':
            fk_count.setdefault(r['fk_cols'][0], set()).add(r['fk_table'])
    tenant = None
    for col, ts in sorted(fk_count.items(), key=lambda kv: -len(kv[1])):
        if col.endswith('_id') and len(ts) >= 0.8 * (n - 1) and n >= 4:
            tenant = col
            break
    glob = []
    if tenant:
        glob = sorted(t for t, tbl in tables.items() if not any(c['name'] == tenant for c in tbl['cols']))
    audit = sorted({c for c in fk_count if c.endswith('_by')})
    dbt = (model['project'].get('database_type') or 'PostgreSQL')
    return {
        '_ghi_chu': 'Bản nháp do dbml_lint.py --suggest-config; xác nhận từng khóa trước khi dùng',
        'dialect': 'postgresql' if dbt.lower().startswith('postgres') else dbt.lower(),
        'tenant_column': tenant,
        'global_tables': glob,
        'audit_fk_suffixes': ['_by'] if audit else [],
        'volumes': {},
        'access_patterns': [],
        'waivers': [],
        'diagram': {'infra_columns': [tenant] if tenant else []},
        'requirement_code_pattern': '',
    }


def build_fix(model, cfg, rule):
    cfgd, _ = cfg, None
    findings, _n, x = run(model, cfg)
    out = []
    for f in findings:
        if f['rule'] == rule and f['fix']:
            out.append(f['fix'])
    return '\n'.join(sorted(set(out)))


def main(argv):
    dm.utf8_stdout()
    args = argv[1:]
    if not args or args[0] in ('-h', '--help'):
        print(__doc__)
        return 0
    path = args[0]
    if not os.path.isfile(path):
        print('Không thấy file: ' + path)
        return 2

    def val(flag, default=None):
        return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default

    model = dm.load(path)
    cfg_path = val('--config') or find_config(path)
    cfg, errs = load_config(cfg_path)
    if errs:
        print('LỖI CẤU HÌNH:\n  ' + '\n  '.join(errs))
        return 2
    if '--suggest-config' in args:
        print(json.dumps(suggest_config(model), ensure_ascii=False, indent=2))
        return 0
    if '--fix' in args:
        print(build_fix(model, cfg, val('--fix').upper()))
        return 0
    findings, notes, x = run(model, cfg)
    findings, waived = apply_waivers(findings, cfg)
    base = val('--baseline') or os.path.join(os.path.dirname(os.path.abspath(path)), '_check', 'lint-baseline.json')
    split_baseline(findings, base)
    only = val('--rule')
    print(render(findings, waived, notes, model, cfg, x.dialect, int(val('--limit', 15 if not only else 0)),
                 '--show-debt' in args, only.upper() if only else None))
    if val('--json'):
        with io.open(val('--json'), 'w', encoding='utf-8') as f:
            json.dump({'findings': findings, 'waived': waived, 'notes': notes, 'summary': counts(findings)}, f, ensure_ascii=False, indent=1)
    return 1 if any(f['level'] == 'ERROR' and not f.get('debt') for f in findings) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
