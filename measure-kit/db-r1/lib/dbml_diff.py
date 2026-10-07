# -*- coding: utf-8 -*-
"""So hai phiên bản schema DBML — in sẵn khối markdown "Thay đổi so với bản trước".

Mỗi thay đổi được phân loại:
  cộng thêm — an toàn (bảng/cột/enum/giá trị enum mới, nới lỏng)
  phá vỡ    — bỏ hoặc đổi kiểu cột, bỏ giá trị enum, bỏ bảng, thêm unique, đổi khóa chính, bỏ FK   (DB-EVO-05)
  dữ liệu   — cột NOT NULL không mặc định, NOT NULL mới, FK hay CHECK mới trên bảng đã có dữ liệu
  index     — thêm/bỏ index thường

  dbml_diff.py OLD NEW [--json OUT] [--limit N]     (luôn thoát 0)
"""
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dbml_model as dm  # noqa: E402

IMPLEMENTED = {'DB-EVO-01', 'DB-EVO-05'}
CLASSES = ['phá vỡ', 'dữ liệu', 'index', 'cộng thêm']


def _ref_key(r):
    return (r['fk_table'], tuple(r['fk_cols']), r['pk_table'], tuple(r['pk_cols']))


def _idx_key(ix):
    return (tuple(ix['cols']), bool(ix['unique'] or ix['pk']), ix['type'] or 'btree')


def _ctype(c):
    return c['type'].lower().replace(' ', '')


def diff(old, new):
    ch = []

    def add(kind, op, name, cls, detail='', rule=''):
        ch.append({'kind': kind, 'op': op, 'name': name, 'class': cls, 'detail': detail, 'rule': rule})

    ot, nt = old['tables'], new['tables']
    for t in nt:
        if t not in ot:
            add('bảng', '+', t, 'cộng thêm', '{} cột'.format(len(nt[t]['cols'])))
    for t in ot:
        if t not in nt:
            add('bảng', '-', t, 'phá vỡ', 'bảng bị bỏ ({} cột)'.format(len(ot[t]['cols'])))
    notes = 0
    for t in nt:
        if t not in ot:
            continue
        a, b = ot[t], nt[t]
        if (a['note'] or '').strip() != (b['note'] or '').strip():
            notes += 1
        ac = {c['name']: c for c in a['cols']}
        bc = {c['name']: c for c in b['cols']}
        for n, c in bc.items():
            if n not in ac:
                if c['not_null'] and c['default'] is None and not c['pk'] and not c['increment']:
                    add('cột', '+', t + '.' + n, 'dữ liệu', 'NOT NULL không mặc định — bảng đã có dòng thì phải backfill trước')
                else:
                    add('cột', '+', t + '.' + n, 'cộng thêm', c['type'])
        for n, c in ac.items():
            if n not in bc:
                add('cột', '-', t + '.' + n, 'phá vỡ', 'cột bị bỏ ({})'.format(c['type']))
                continue
            d = bc[n]
            if _ctype(c) != _ctype(d):
                add('cột', '~', t + '.' + n, 'phá vỡ', 'kiểu {} → {}'.format(c['type'], d['type']))
            if c['pk'] != d['pk']:
                add('cột', '~', t + '.' + n, 'phá vỡ', 'khóa chính đổi')
            if c['nullable'] and not d['nullable']:
                add('cột', '~', t + '.' + n, 'dữ liệu', 'NULL → NOT NULL')
            elif not c['nullable'] and d['nullable']:
                add('cột', '~', t + '.' + n, 'cộng thêm', 'NOT NULL → NULL')
            if not c['unique'] and d['unique']:
                add('cột', '~', t + '.' + n, 'phá vỡ', 'thêm UNIQUE')
            elif c['unique'] and not d['unique']:
                add('cột', '~', t + '.' + n, 'cộng thêm', 'bỏ UNIQUE')
            if not c['check'] and d['check']:
                add('cột', '~', t + '.' + n, 'dữ liệu', 'thêm CHECK')
            if (c['default'], c['default_kind']) != (d['default'], d['default_kind']):
                add('cột', '~', t + '.' + n, 'cộng thêm', 'mặc định {} → {}'.format(c['default'], d['default']))
        ai = {_idx_key(i): i for i in a['indexes']}
        bi = {_idx_key(i): i for i in b['indexes']}
        for k, i in bi.items():
            if k not in ai:
                add('index', '+', '{}({})'.format(t, ', '.join(k[0])), 'phá vỡ' if k[1] else 'index', 'thêm UNIQUE' if k[1] else '')
        for k in ai:
            if k not in bi:
                add('index', '-', '{}({})'.format(t, ', '.join(k[0])), 'cộng thêm' if k[1] else 'index', 'bỏ UNIQUE' if k[1] else '')
    for t in nt:                      # index của bảng mới không liệt kê riêng; chỉ đếm
        pass
    oe, ne = old['enums'], new['enums']
    for n, e in ne.items():
        if n not in oe:
            add('enum', '+', n, 'cộng thêm', '{} giá trị'.format(len(e['values'])))
            continue
        ov = {v['name'] for v in oe[n]['values']}
        nv = {v['name'] for v in e['values']}
        for v in sorted(nv - ov):
            add('giá trị enum', '+', '{}.{}'.format(n, v), 'cộng thêm')
        for v in sorted(ov - nv):
            add('giá trị enum', '-', '{}.{}'.format(n, v), 'phá vỡ', 'bỏ giá trị enum — mã, báo cáo, dữ liệu cũ đều có thể còn dùng', 'DB-EVO-05')
    for n, e in oe.items():
        if n not in ne:
            add('enum', '-', n, 'phá vỡ', 'bỏ cả Enum', 'DB-EVO-05')
    orf = {_ref_key(r): r for r in old['refs']}
    nrf = {_ref_key(r): r for r in new['refs']}
    for k, r in nrf.items():
        if k not in orf and k[0] in ot:
            add('ref', '+', '{}({}) → {}'.format(k[0], ', '.join(k[1]), k[2]), 'dữ liệu', 'FK mới trên bảng đã có dòng — kiểm dữ liệu cũ trước (NOT VALID rồi VALIDATE)')
        elif k in orf and (orf[k]['delete'] != r['delete']):
            add('ref', '~', '{}({}) → {}'.format(k[0], ', '.join(k[1]), k[2]), 'phá vỡ', 'hành vi xóa {} → {}'.format(orf[k]['delete'] or '—', r['delete'] or '—'))
    for k in orf:
        if k not in nrf and k[0] in nt:
            add('ref', '-', '{}({}) → {}'.format(k[0], ', '.join(k[1]), k[2]), 'phá vỡ', 'bỏ khóa ngoại')
    return {'old': old['stats'], 'new': new['stats'], 'changes': ch, 'notes_changed': notes}


def _count(ch, kind, op):
    return sum(1 for c in ch if c['kind'] == kind and c['op'] == op)


def to_markdown(d, limit=15, old_name='bản trước', new_name='bản này'):
    o, n, ch = d['old'], d['new'], d['changes']
    out = ['**Thay đổi so với bản trước** ({} → {})'.format(old_name, new_name), '',
           '{} bảng · {} cột · {} enum → **{} bảng · {} cột · {} enum**'.format(
               o['tables'], o['columns'], o['enums'], n['tables'], n['columns'], n['enums']), '']
    out.append('| | + | − | đổi |')
    out.append('| :--- | ---: | ---: | ---: |')
    for kind in ('bảng', 'cột', 'enum', 'giá trị enum', 'ref', 'index'):
        out.append('| {} | {} | {} | {} |'.format(kind, _count(ch, kind, '+'), _count(ch, kind, '-'), _count(ch, kind, '~')))
    by = {c: [x for x in ch if x['class'] == c and not (x['kind'] == 'cột' and x['op'] == '+' and c == 'cộng thêm')] for c in CLASSES}
    out.append('')
    out.append('Phân loại: **phá vỡ {}** · **dữ liệu {}** · index {} · cộng thêm {} · ghi chú bảng đổi {}'.format(
        len(by['phá vỡ']), len(by['dữ liệu']), len([x for x in ch if x['class'] == 'index']),
        len([x for x in ch if x['class'] == 'cộng thêm']), d['notes_changed']))
    for cls, title in (('phá vỡ', 'Thay đổi PHÁ VỠ (cần migration có kế hoạch)'), ('dữ liệu', 'Thay đổi chạm DỮ LIỆU ĐÃ CÓ (backfill/kiểm trước)')):
        items = by[cls]
        if not items:
            continue
        out.append('')
        out.append('{} — {}:'.format(title, len(items)))
        for x in items[:limit]:
            out.append('- {} `{}` {}{}'.format(x['kind'], x['name'], x['detail'], ' _(' + x['rule'] + ')_' if x['rule'] else ''))
        if len(items) > limit:
            out.append('- … +{} dòng nữa (--json)'.format(len(items) - limit))
    newt = [x['name'] for x in ch if x['kind'] == 'bảng' and x['op'] == '+']
    if newt:
        out.append('')
        out.append('Bảng mới ({}): {}'.format(len(newt), ', '.join('`{}`'.format(t) for t in newt[:20]) + (' …' if len(newt) > 20 else '')))
    return '\n'.join(out)


def main(argv):
    dm.utf8_stdout()
    args = argv[1:]
    if len(args) < 2 or args[0] in ('-h', '--help'):
        print(__doc__)
        return 0
    for p in args[:2]:
        if not os.path.isfile(p):
            print('Không thấy file: ' + p)
            return 2
    old, new = dm.load(args[0]), dm.load(args[1])
    d = diff(old, new)

    def val(flag, default=None):
        return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default

    print(to_markdown(d, int(val('--limit', 15)), os.path.basename(args[0]), os.path.basename(args[1])))
    if val('--json'):
        with io.open(val('--json'), 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
