# -*- coding: utf-8 -*-
"""Bộ đọc DBML dùng chung cho mọi script soát — parser đếm ngoặc, không dùng regex.

Đọc: Project · Enum · TableGroup · Table (cột, indexes, checks, Note) · Ref
(dạng ngắn, dạng khối, inline, ghép nhiều cột, kèm delete/update). Ghi số dòng cho
mọi phần tử. Chuẩn hóa mỗi quan hệ thành {fk_table, fk_cols, pk_table, pk_cols, kind,
delete, update, inline, line}.

Dòng lệnh (đầu ra mặc định gọn; mã thoát 0 khi tra cứu):
  dbml_model.py F --stats
  dbml_model.py F --outline
  dbml_model.py F --show a,b [--full]
  dbml_model.py F --dictionary-md [--tables a,b]
  dbml_model.py F --json
"""
import difflib
import io
import json
import os
import re
import sys


def utf8_stdout():
    for s in (sys.stdout, sys.stderr):
        try:
            s.reconfigure(encoding='utf-8')
        except Exception:
            pass


# --------------------------------------------------------------------------- tokenizer
_ID = re.compile(r'(?:#|[^\W\d])[\w$#]*|\d+(?:\.\d+)?')
_PUNCT = set('{}[](),:.<>-~;=')


def tokenize(text):
    """Trả về danh sách token (kind, val, line, eline). Bỏ chú thích // và /* */."""
    toks = []
    i, n, line = 0, len(text), 1
    while i < n:
        c = text[i]
        if c == '\n':
            line += 1
            i += 1
        elif c in ' \t\r﻿':
            i += 1
        elif text.startswith('//', i):
            j = text.find('\n', i)
            i = n if j < 0 else j
        elif text.startswith('/*', i):
            j = text.find('*/', i + 2)
            j = n if j < 0 else j + 2
            line += text.count('\n', i, j)
            i = j
        elif text.startswith("'''", i):
            j = text.find("'''", i + 3)
            j = n if j < 0 else j
            val = text[i + 3:j]
            eline = line + val.count('\n')
            toks.append(('str', val, line, eline))
            line = eline
            i = min(n, j + 3)
        elif c == "'":
            j = i + 1
            buf = []
            while j < n and text[j] != "'":
                if text[j] == '\\' and j + 1 < n:
                    buf.append(text[j + 1])
                    j += 2
                    continue
                buf.append(text[j])
                j += 1
            val = ''.join(buf)
            eline = line + val.count('\n')
            toks.append(('str', val, line, eline))
            line = eline
            i = j + 1
        elif c == '"':
            j = text.find('"', i + 1)
            j = n if j < 0 else j
            toks.append(('qid', text[i + 1:j], line, line))
            i = j + 1
        elif c == '`':
            j = text.find('`', i + 1)
            j = n if j < 0 else j
            val = text[i + 1:j]
            eline = line + val.count('\n')
            toks.append(('bt', val, line, eline))
            line = eline
            i = j + 1
        elif c == '<' and text.startswith('<>', i):
            toks.append(('p', '<>', line, line))
            i += 2
        elif c in _PUNCT:
            toks.append(('p', c, line, line))
            i += 1
        else:
            m = _ID.match(text, i)
            if m:
                toks.append(('id', m.group(0), line, line))
                i = m.end()
            else:
                i += 1
    return toks


# --------------------------------------------------------------------------- parser
class _Parser:
    def __init__(self, text):
        self.t = tokenize(text)
        self.i = 0
        self.model = {
            'project': {'name': '', 'database_type': '', 'note': '', 'line': 0},
            'enums': {}, 'tables': {}, 'refs': [], 'groups': {},
            'order': [],
        }

    # ---- tiện ích
    def tok(self, k=0):
        j = self.i + k
        return self.t[j] if 0 <= j < len(self.t) else ('eof', '', 10 ** 9, 10 ** 9)

    def is_p(self, v, k=0):
        t = self.tok(k)
        return t[0] == 'p' and t[1] == v

    def is_kw(self, v, k=0):
        t = self.tok(k)
        return t[0] == 'id' and t[1].lower() == v

    def skip_block(self):
        """Đang đứng ở '{' → nhảy tới sau '}' khớp."""
        depth = 0
        while self.i < len(self.t):
            t = self.t[self.i]
            if t[0] == 'p' and t[1] == '{':
                depth += 1
            elif t[0] == 'p' and t[1] == '}':
                depth -= 1
                if depth == 0:
                    self.i += 1
                    return
            self.i += 1

    def block_end_index(self):
        """Đang ở '{' → chỉ số token '}' khớp (không di chuyển)."""
        depth, j = 0, self.i
        while j < len(self.t):
            t = self.t[j]
            if t[0] == 'p' and t[1] == '{':
                depth += 1
            elif t[0] == 'p' and t[1] == '}':
                depth -= 1
                if depth == 0:
                    return j
            j += 1
        return len(self.t) - 1

    def read_name(self):
        """Tên có thể kèm schema: a.b hoặc "a b"."""
        parts = []
        t = self.tok()
        if t[0] in ('id', 'qid'):
            parts.append(t[1])
            self.i += 1
        while self.is_p('.') and self.tok(1)[0] in ('id', 'qid'):
            parts.append(self.tok(1)[1])
            self.i += 2
        return parts

    @staticmethod
    def join_name(parts):
        if len(parts) >= 2 and parts[0].lower() == 'public':
            parts = parts[1:]
        return '.'.join(parts)

    # ---- cấp cao
    def parse(self):
        while self.i < len(self.t):
            t = self.tok()
            kw = t[1].lower() if t[0] == 'id' else None
            if kw == 'project':
                self.parse_project()
            elif kw == 'table':
                self.parse_table()
            elif kw == 'enum':
                self.parse_enum()
            elif kw == 'tablegroup':
                self.parse_group()
            elif kw == 'ref':
                self.parse_ref_top()
            elif kw in ('note', 'tablepartial', 'records') and self.i + 1 < len(self.t):
                self.i += 1
                while self.i < len(self.t) and not self.is_p('{') and self.tok()[2] == t[2]:
                    self.i += 1
                if self.is_p('{'):
                    self.skip_block()
            else:
                self.i += 1
        return self.model

    def parse_project(self):
        line = self.tok()[2]
        self.i += 1
        name = self.read_name()
        proj = self.model['project']
        proj['name'] = self.join_name(name)
        proj['line'] = line
        if not self.is_p('{'):
            return
        end = self.block_end_index()
        self.i += 1
        while self.i < end:
            t = self.tok()
            if t[0] == 'id' and t[1].lower() == 'note':
                self.i += 1
                if self.is_p(':'):
                    self.i += 1
                if self.is_p('{'):
                    self.i += 1
                if self.tok()[0] == 'str':
                    proj['note'] = self.tok()[1]
                    self.i += 1
            elif t[0] == 'id' and self.is_p(':', 1):
                key = t[1].lower()
                v = self.tok(2)
                if key == 'database_type':
                    proj['database_type'] = v[1]
                self.i += 3
            else:
                self.i += 1
        self.i = end + 1

    # ---- settings [a, b: c, ...]
    def parse_settings(self):
        """Đang ở '[' → trả (dict, vị trí sau ']'). Giá trị luôn là chuỗi; ref là dict."""
        out = {}
        self.i += 1
        items, cur, depth = [], [], 0
        while self.i < len(self.t):
            t = self.t[self.i]
            if t[0] == 'p':
                if t[1] in '([{':
                    depth += 1
                elif t[1] in ')]}':
                    if depth == 0 and t[1] == ']':
                        self.i += 1
                        break
                    depth -= 1
                elif t[1] == ',' and depth == 0:
                    items.append(cur)
                    cur = []
                    self.i += 1
                    continue
            cur.append(t)
            self.i += 1
        if cur:
            items.append(cur)
        for it in items:
            if not it:
                continue
            ci = next((k for k, x in enumerate(it) if x[0] == 'p' and x[1] == ':'), None)
            if ci is None:
                key = ' '.join(x[1].lower() for x in it if x[0] == 'id')
                out[key] = True
                continue
            key = ' '.join(x[1].lower() for x in it[:ci] if x[0] in ('id', 'qid'))
            val = it[ci + 1:]
            if key == 'ref':
                out['ref'] = self._ref_from_tokens(val)
            elif not val:
                out[key] = ''
            elif val[0][0] == 'str':
                out[key] = val[0][1]
                out[key + '__kind'] = 'str'
            elif val[0][0] == 'bt':
                out[key] = val[0][1]
                out[key + '__expr'] = True
                out[key + '__kind'] = 'expr'
            else:
                out[key] = self._join_value(val)
                out[key + '__kind'] = 'lit'
        return out

    @staticmethod
    def _join_value(val):
        """Ghép token giá trị: từ liền nhau cách một dấu cách (set null), dấu và số dính nhau (-1)."""
        out = ''
        for k, t in enumerate(val):
            if k and t[0] in ('id', 'qid') and val[k - 1][0] in ('id', 'qid'):
                out += ' '
            out += t[1]
        return out

    @staticmethod
    def _endpoint(toks):
        """tokens của vế phải/trái → (table, [cols]). Hỗ trợ schema.table.col và table.(a, b)."""
        names, cols, k = [], [], 0
        while k < len(toks):
            t = toks[k]
            if t[0] in ('id', 'qid'):
                names.append(t[1])
            elif t[0] == 'p' and t[1] == '(':
                k += 1
                while k < len(toks) and not (toks[k][0] == 'p' and toks[k][1] == ')'):
                    if toks[k][0] in ('id', 'qid'):
                        cols.append(toks[k][1])
                    k += 1
            k += 1
        if cols:
            table = _Parser.join_name(names)
        elif len(names) >= 3:
            table, cols = _Parser.join_name(names[:-1]), [names[-1]]
        elif len(names) == 2:
            table, cols = names[0], [names[1]]
        else:
            table, cols = (names[0] if names else ''), []
        return table, cols

    def _ref_from_tokens(self, toks):
        """[ref: > b.id] → {'op': '>', 'table': 'b', 'cols': ['id']}."""
        if not toks:
            return None
        op = toks[0][1] if toks[0][0] == 'p' else '>'
        rest = toks[1:] if toks[0][0] == 'p' else toks
        table, cols = self._endpoint(rest)
        return {'op': op, 'table': table, 'cols': cols}

    # ---- Table
    def parse_table(self):
        line = self.tok()[2]
        self.i += 1
        name_parts = self.read_name()
        schema = name_parts[0] if len(name_parts) >= 2 else ''
        name = self.join_name(name_parts)
        alias = ''
        if self.is_kw('as'):
            alias = self.tok(1)[1]
            self.i += 2
        opts = {}
        if self.is_p('['):
            opts = self.parse_settings()
        tbl = {
            'name': name, 'schema': schema, 'alias': alias, 'line': line, 'end_line': line,
            'color': opts.get('headercolor', ''), 'note': opts.get('note', ''),
            'cols': [], 'indexes': [], 'checks': [], 'settings': opts, 'group': '',
        }
        if not self.is_p('{'):
            self.model['tables'][name] = tbl
            return
        end = self.block_end_index()
        self.i += 1
        while self.i < end:
            self.parse_table_item(tbl, end)
        tbl['end_line'] = self.t[end][2]
        self.i = end + 1
        self.model['tables'][name] = tbl
        self.model['order'].append(name)
        # ref inline → quan hệ chuẩn hóa
        for c in tbl['cols']:
            r = c.get('ref')
            if r:
                self.model['refs'].append(self.norm_rel(
                    tbl['name'], [c['name']], r['op'], r['table'], r['cols'],
                    {'delete': c.get('delete', ''), 'update': c.get('update', ''), 'name': ''},
                    inline=True, line=c['line'], inline_action=bool(c.get('delete') or c.get('update'))))

    def parse_table_item(self, tbl, end):
        t = self.tok()
        low = t[1].lower() if t[0] == 'id' else ''
        if low == 'indexes' and self.is_p('{', 1):
            self.i += 1
            self.parse_indexes(tbl)
        elif low == 'checks' and self.is_p('{', 1):
            self.i += 1
            self.parse_checks(tbl)
        elif low == 'note' and (self.is_p(':', 1) or self.is_p('{', 1)):
            self.i += 1
            braced = self.is_p('{')
            self.i += 1
            if self.tok()[0] == 'str':
                tbl['note'] = self.tok()[1]
                self.i += 1
            if braced and self.is_p('}'):
                self.i += 1
        elif t[0] in ('id', 'qid'):
            self.parse_column(tbl)
        else:
            self.i += 1

    def parse_column(self, tbl):
        name_tok = self.tok()
        line = name_tok[2]
        self.i += 1
        # kiểu: id (. id)? ( '(' args ')' )? ([])?
        type_parts, args, array = [], [], ''
        last_line = name_tok[3]
        while self.i < len(self.t):
            t = self.tok()
            if t[2] > last_line and not (t[0] == 'p' and t[1] in '(['):
                break
            if t[0] in ('id', 'qid') and not (self.is_p('[') or False):
                type_parts.append(t[1])
                last_line = t[3]
                self.i += 1
                if self.is_p('.') and self.tok(1)[0] in ('id', 'qid'):
                    type_parts.append('.')
                    self.i += 1
                continue
            if t[0] == 'p' and t[1] == '.':
                type_parts.append('.')
                self.i += 1
                continue
            if t[0] == 'p' and t[1] == '(':
                self.i += 1
                cur = []
                while self.i < len(self.t) and not self.is_p(')'):
                    if self.tok()[0] != 'p':
                        cur.append(self.tok()[1])
                    self.i += 1
                self.i += 1
                args = cur
                last_line = self.t[self.i - 1][3]
                continue
            if t[0] == 'p' and t[1] == '[':
                # '[]' hoặc '[n]' = mảng; còn lại là settings
                if self.is_p(']', 1) or (self.tok(1)[0] == 'id' and self.tok(1)[1].isdigit() and self.is_p(']', 2)):
                    array += '[]'
                    self.i += 2 if self.is_p(']', 1) else 3
                    continue
                break
            break
        base = ''
        for part in type_parts:
            if part == '.' or base.endswith('.'):
                base += part
            else:
                base += (' ' if base else '') + part
        col = {
            'name': name_tok[1], 'base': base.lower(), 'args': args, 'array': bool(array),
            'type': base + ('(' + ','.join(args) + ')' if args else '') + array,
            'pk': False, 'not_null': False, 'unique': False, 'increment': False,
            'default': None, 'default_expr': False, 'default_kind': '', 'note': '', 'check': '', 'ref': None,
            'delete': '', 'update': '', 'line': line,
        }
        if self.is_p('['):
            s = self.parse_settings()
            col['pk'] = bool(s.get('pk') or s.get('primary key'))
            col['not_null'] = bool(s.get('not null')) or col['pk']
            col['unique'] = bool(s.get('unique'))
            col['increment'] = bool(s.get('increment'))
            if 'default' in s:
                col['default'] = s['default']
                col['default_expr'] = bool(s.get('default__expr'))
                col['default_kind'] = s.get('default__kind', 'lit')
            col['note'] = s.get('note', '') if isinstance(s.get('note', ''), str) else ''
            col['check'] = s.get('check', '')
            col['ref'] = s.get('ref')
            col['delete'] = s.get('delete', '')
            col['update'] = s.get('update', '')
        col['nullable'] = not col['not_null']
        tbl['cols'].append(col)
        # bỏ phần dư trên cùng dòng
        while self.i < len(self.t) and self.tok()[2] <= self.t[self.i - 1][3] and not self.is_p('}'):
            self.i += 1

    def parse_indexes(self, tbl):
        end = self.block_end_index()
        self.i += 1
        while self.i < end:
            t = self.tok()
            line = t[2]
            items = []
            if t[0] == 'p' and t[1] == '(':
                self.i += 1
                while self.i < end and not self.is_p(')'):
                    x = self.tok()
                    if x[0] in ('id', 'qid'):
                        items.append(x[1])
                    elif x[0] == 'bt':
                        items.append('`' + x[1] + '`')
                    self.i += 1
                self.i += 1
            elif t[0] in ('id', 'qid'):
                items.append(t[1])
                self.i += 1
            elif t[0] == 'bt':
                items.append('`' + t[1] + '`')
                self.i += 1
            else:
                self.i += 1
                continue
            s = self.parse_settings() if self.is_p('[') else {}
            tbl['indexes'].append({
                'cols': items, 'pk': bool(s.get('pk')), 'unique': bool(s.get('unique')),
                'type': (s.get('type') or '').lower(), 'name': s.get('name', ''),
                'note': s.get('note', ''), 'line': line,
            })
        self.i = end + 1

    def parse_checks(self, tbl):
        end = self.block_end_index()
        self.i += 1
        while self.i < end:
            t = self.tok()
            if t[0] == 'bt':
                self.i += 1
                s = self.parse_settings() if self.is_p('[') else {}
                tbl['checks'].append({'expr': t[1], 'name': s.get('name', ''), 'line': t[2]})
            else:
                self.i += 1
        self.i = end + 1

    # ---- Enum
    def parse_enum(self):
        line = self.tok()[2]
        self.i += 1
        name = self.join_name(self.read_name())
        enum = {'name': name, 'line': line, 'end_line': line, 'values': []}
        if not self.is_p('{'):
            return
        end = self.block_end_index()
        self.i += 1
        while self.i < end:
            t = self.tok()
            if t[0] in ('id', 'qid'):
                v = {'name': t[1], 'note': '', 'line': t[2]}
                self.i += 1
                if self.is_p('['):
                    s = self.parse_settings()
                    v['note'] = s.get('note', '') if isinstance(s.get('note', ''), str) else ''
                enum['values'].append(v)
            else:
                self.i += 1
        enum['end_line'] = self.t[end][2]
        self.i = end + 1
        self.model['enums'][name] = enum

    def parse_group(self):
        line = self.tok()[2]
        self.i += 1
        name = self.join_name(self.read_name())
        if self.is_p('['):
            self.parse_settings()
        g = {'name': name, 'line': line, 'tables': []}
        if self.is_p('{'):
            end = self.block_end_index()
            self.i += 1
            while self.i < end:
                if self.tok()[0] in ('id', 'qid') and self.tok()[1].lower() != 'note':
                    g['tables'].append(self.join_name(self.read_name()))
                else:
                    self.i += 1
            self.i = end + 1
        self.model['groups'][name] = g

    # ---- Ref
    def parse_ref_top(self):
        line = self.tok()[2]
        self.i += 1
        name = ''
        if self.tok()[0] in ('id', 'qid') and not self.is_p(':'):
            name = self.tok()[1]
            self.i += 1
        if self.is_p('{'):
            end = self.block_end_index()
            self.i += 1
            while self.i < end:
                self._parse_one_ref(name, self.tok()[2], end)
            self.i = end + 1
        elif self.is_p(':'):
            self.i += 1
            self._parse_one_ref(name, line, None)

    def _parse_one_ref(self, name, line, end):
        """Một quan hệ ngắn: a.x > b.y [settings]."""
        start = self.i
        toks = []
        while self.i < len(self.t) and (end is None or self.i < end):
            t = self.tok()
            if t[0] == 'p' and t[1] == '[':
                break
            if toks and t[2] > toks[-1][3] and not (t[0] == 'p' and t[1] in ('<', '>', '-', '<>')) \
                    and not (toks[-1][0] == 'p' and toks[-1][1] in ('<', '>', '-', '<>', '.', '(', ',')):
                break
            toks.append(t)
            self.i += 1
        if self.i == start:
            self.i += 1
            return
        s = self.parse_settings() if self.is_p('[') else {}
        oi = next((k for k, x in enumerate(toks) if x[0] == 'p' and x[1] in ('<', '>', '-', '<>')), None)
        if oi is None:
            return
        lt, lc = self._endpoint(toks[:oi])
        rt, rc = self._endpoint(toks[oi + 1:])
        self.model['refs'].append(self.norm_rel(
            lt, lc, toks[oi][1], rt, rc,
            {'delete': s.get('delete', ''), 'update': s.get('update', ''), 'name': name or s.get('name', '')},
            inline=False, line=line, inline_action=False))

    @staticmethod
    def norm_rel(lt, lc, op, rt, rc, extra, inline, line, inline_action):
        if op == '<':
            fk, pk, kind = (rt, rc), (lt, lc), 'm2o'
        elif op == '-':
            fk, pk, kind = (lt, lc), (rt, rc), 'o2o'
        elif op == '<>':
            fk, pk, kind = (lt, lc), (rt, rc), 'm2m'
        else:
            fk, pk, kind = (lt, lc), (rt, rc), 'm2o'
        return {
            'name': extra.get('name', ''), 'fk_table': fk[0], 'fk_cols': fk[1],
            'pk_table': pk[0], 'pk_cols': pk[1], 'kind': kind, 'op': op,
            'delete': extra.get('delete', ''), 'update': extra.get('update', ''),
            'inline': inline, 'inline_action': inline_action, 'line': line,
        }


def _fix_one_to_one(m):
    """`a.x - b.y` không nói phía nào là khóa ngoại: phía KHÔNG phải PK là phía FK."""
    def is_pk(table, cols):
        t = m['tables'].get(table)
        if not t or not cols:
            return False
        pk = {c['name'] for c in t['cols'] if c['pk']}
        for ix in t['indexes']:
            if ix['pk']:
                pk |= set(ix['cols'])
        return set(cols) <= pk
    for r in m['refs']:
        if r['kind'] == 'o2o' and not r['inline'] and r['op'] == '-':
            if is_pk(r['fk_table'], r['fk_cols']) and not is_pk(r['pk_table'], r['pk_cols']):
                r['fk_table'], r['pk_table'] = r['pk_table'], r['fk_table']
                r['fk_cols'], r['pk_cols'] = r['pk_cols'], r['fk_cols']


def parse(text):
    m = _Parser(text).parse()
    _fix_one_to_one(m)
    for g in m['groups'].values():
        for t in g['tables']:
            if t in m['tables']:
                m['tables'][t]['group'] = g['name']
    m['stats'] = stats(m)
    return m


def load(path):
    with io.open(path, encoding='utf-8-sig') as f:
        text = f.read()
    m = parse(text)
    m['path'] = path
    m['lines'] = text.split('\n')
    return m


def stats(m):
    return {
        'tables': len(m['tables']),
        'columns': sum(len(t['cols']) for t in m['tables'].values()),
        'enums': len(m['enums']),
        'enum_values': sum(len(e['values']) for e in m['enums'].values()),
        'refs': len(m['refs']),
        'indexes': sum(len(t['indexes']) for t in m['tables'].values()),
    }


def stats_line(s):
    return '{tables} bảng · {columns} cột · {enums} enum · {enum_values} giá trị enum · {refs} ref · {indexes} index'.format(**s)


# --------------------------------------------------------------------------- tiện ích dùng chung
def first_line(note, width=80):
    for ln in (note or '').splitlines():
        ln = ln.strip()
        if ln:
            return ln if len(ln) <= width else ln[:width - 1] + '…'
    return ''


def table_of(m, name):
    return m['tables'].get(name)


def col_of(tbl, name):
    for c in tbl['cols']:
        if c['name'] == name:
            return c
    return None


def unique_sets(tbl):
    """Các tập cột (có thứ tự) đảm bảo duy nhất: PK, unique cột, unique/pk index (bỏ biểu thức)."""
    out = []
    pk = [c['name'] for c in tbl['cols'] if c['pk']]
    if pk:
        out.append(tuple(pk))
    for c in tbl['cols']:
        if c['unique']:
            out.append((c['name'],))
    for ix in tbl['indexes']:
        if (ix['unique'] or ix['pk']) and not any(x.startswith('`') for x in ix['cols']):
            out.append(tuple(ix['cols']))
    return out


def index_lists(tbl):
    """Mọi index có thể phục vụ tra cứu: [(cols, unique, type, line)] gồm PK và unique cột."""
    out = []
    pk = [c['name'] for c in tbl['cols'] if c['pk']]
    if pk:
        out.append((tuple(pk), True, 'btree', tbl['line']))
    for c in tbl['cols']:
        if c['unique'] and not c['pk']:
            out.append(((c['name'],), True, 'btree', c['line']))
    for ix in tbl['indexes']:
        out.append((tuple(ix['cols']), ix['unique'] or ix['pk'], ix['type'] or 'btree', ix['line']))
    return out


# --------------------------------------------------------------------------- đầu ra
def cmd_outline(m):
    lines = []
    for name in m['order'] or m['tables']:
        t = m['tables'][name]
        lines.append('{:<34} {:>3} cột  d{}–{}  {}'.format(
            name, len(t['cols']), t['line'], t['end_line'], first_line(t['note'])))
    return '\n'.join(lines)


def _fk_text(m, tname, col):
    outs = []
    for r in m['refs']:
        if r['fk_table'] == tname and col in r['fk_cols']:
            tgt = '{}.{}'.format(r['pk_table'], '/'.join(r['pk_cols']))
            if r['delete']:
                tgt += ' xóa:' + r['delete']
            outs.append('→ ' + tgt)
    return ' '.join(outs)


def cmd_show(m, names, full=False):
    out = []
    for name in names:
        t = m['tables'].get(name)
        if not t:
            close = difflib.get_close_matches(name, list(m['tables']), n=3)
            out.append('Không có bảng {}.{}'.format(name, ' Gần giống: ' + ', '.join(close) if close else ''))
            continue
        out.append('## {}  (dòng {}–{} · {} cột · {} index)'.format(
            name, t['line'], t['end_line'], len(t['cols']), len(t['indexes'])))
        if t['note']:
            out.append('Note: ' + (t['note'].strip().replace('\n', ' ⏎ ') if full else first_line(t['note'], 110))
                       + ('' if full else ' …[{} dòng]'.format(len(t['note'].strip().splitlines()))))
        for c in t['cols']:
            flags = []
            if c['pk']:
                flags.append('PK')
            elif c['not_null']:
                flags.append('NOT NULL')
            if c['unique']:
                flags.append('UNIQUE')
            if c['default'] is not None:
                flags.append('default ' + ('`{}`'.format(c['default']) if c['default_expr']
                                                 else repr(c['default']) if c['default_kind'] == 'str' else str(c['default'])))
            if c['check']:
                flags.append('check ' + c['check'])
            fk = _fk_text(m, name, c['name'])
            note = c['note'].replace('\n', ' ')
            if not full and len(note) > 70:
                note = note[:69] + '…'
            out.append('  d{:<5} {} {} {}{}{}'.format(
                c['line'], c['name'], c['type'], ' '.join(flags), (' ' + fk) if fk else '',
                (' | ' + note) if note else ''))
        for ix in t['indexes']:
            kind = 'pk' if ix['pk'] else ('unique' if ix['unique'] else 'index')
            out.append('  d{:<5} {} ({}){}'.format(ix['line'], kind, ', '.join(ix['cols']),
                                                  ' type:' + ix['type'] if ix['type'] else ''))
        for ck in t['checks']:
            out.append('  d{:<5} check {}'.format(ck['line'], ck['expr']))
        out.append('')
    return '\n'.join(out).rstrip()


def cmd_dictionary_md(m, only=None):
    out = []
    for name in m['order'] or m['tables']:
        if only and name not in only:
            continue
        t = m['tables'][name]
        out.append('### `{}`'.format(name))
        if t['note']:
            out.append('')
            out.append(first_line(t['note'], 200))
        out.append('')
        out.append('| Cột | Kiểu dữ liệu | Nullable | Khóa / Constraint | Mặc định | Ý nghĩa nghiệp vụ |')
        out.append('| :--- | :--- | :--- | :--- | :--- | :--- |')
        for c in t['cols']:
            cons = []
            if c['pk']:
                cons.append('PK')
            fk = _fk_text(m, name, c['name'])
            if fk:
                cons.append(fk.replace('→ ', 'FK → '))
            if c['unique']:
                cons.append('UNIQUE')
            if c['check']:
                cons.append('CHECK ' + c['check'])
            d = '`{}`'.format(c['default']) if c['default'] is not None else ''
            note = c['note'].replace('\n', ' ').replace('|', '\\|').strip() or '—'
            out.append('| `{}` | `{}` | {} | {} | {} | {} |'.format(
                c['name'], c['type'], 'Yes' if c['nullable'] else 'No', ', '.join(cons), d, note))
        out.append('')
    return '\n'.join(out).rstrip()


def main(argv):
    utf8_stdout()
    if len(argv) < 2 or argv[1] in ('-h', '--help'):
        print(__doc__)
        return 0
    path = argv[1]
    if not os.path.isfile(path):
        print('Không thấy file: ' + path)
        return 2
    m = load(path)
    args = argv[2:]
    full = '--full' in args

    def opt(flag):
        return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else None

    if '--json' in args:
        slim = {k: v for k, v in m.items() if k != 'lines'}
        print(json.dumps(slim, ensure_ascii=False, indent=1))
    elif '--outline' in args:
        print(cmd_outline(m))
    elif '--show' in args:
        print(cmd_show(m, [x for x in (opt('--show') or '').split(',') if x], full))
    elif '--dictionary-md' in args:
        only = set(x for x in (opt('--tables') or '').split(',') if x) or None
        print(cmd_dictionary_md(m, only))
    else:
        print(stats_line(m['stats']))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
