# -*- coding: utf-8 -*-
"""
DBML Parser for requirements-to-erd skill.
Parses schema.dbml to extract Project, Enums, Tables, Columns, Refs, and TableGroups.
"""
import re, io

def parse_dbml(dbml_text):
    data = {
        'project': {'name': 'Database Schema', 'note': ''},
        'enums': {},
        'tables': {},
        'refs': [],
        'table_groups': {},
        'derived_values': [],
        'name_mappings': []
    }

    # 1. Project
    proj_m = re.search(r'Project\s+(\w+)\s*\{([^}]*(?:Note:\s*(?:\'\'\'[\s\S]*?\'\'\'|\'[^\']*\'))?[^}]*)\}', dbml_text)
    if proj_m:
        data['project']['name'] = proj_m.group(1)
        pbody = proj_m.group(2)
        pnote = re.search(r"Note:\s*(?:'''([\s\S]*?)'''|'([^']*)')", pbody)
        if pnote:
            data['project']['note'] = (pnote.group(1) or pnote.group(2) or '').strip()

    # 2. Enums
    for em in re.finditer(r'Enum\s+(\w+)\s*\{([^}]*)\}', dbml_text):
        ename = em.group(1)
        evals = [line.strip().split()[0] for line in em.group(2).strip().splitlines() if line.strip() and not line.strip().startswith('//')]
        data['enums'][ename] = evals

    # 3. TableGroups
    for tgm in re.finditer(r'TableGroup\s+(\w+)\s*\{([^}]*)\}', dbml_text):
        gname = tgm.group(1)
        gtables = [line.strip() for line in tgm.group(2).strip().splitlines() if line.strip() and not line.strip().startswith('//')]
        data['table_groups'][gname] = gtables

    # 4. Tables
    # Pattern to match Table table_name [headercolor: #hex] { ... }
    tbl_regex = re.compile(r'Table\s+(\w+)(?:\s*\[([^\]]*)\])?\s*\{([\s\S]*?)\n\}', re.M)
    for tm in tbl_regex.finditer(dbml_text):
        tname = tm.group(1)
        opts_str = tm.group(2) or ''
        tbody = tm.group(3)

        # Header color
        color_m = re.search(r'headercolor:\s*(#[0-9a-fA-F]{3,6})', opts_str)
        header_color = color_m.group(1).lower() if color_m else None

        # Table Note
        tnote = ''
        note_m = re.search(r"Note:\s*(?:'''([\s\S]*?)'''|'([^']*)')", tbody)
        if note_m:
            tnote = (note_m.group(1) or note_m.group(2) or '').strip()

        # Indexes removal before column parsing
        clean_body = re.sub(r'indexes\s*\{[\s\S]*?\}', '', tbody)
        clean_body = re.sub(r"Note:\s*(?:'''[\s\S]*?'''|'[^\n]*')", '', clean_body)

        cols = []
        for line in clean_body.splitlines():
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            # Column syntax: col_name type [settings]
            col_m = re.match(r'^(\w+)\s+([\w(),.]+)(?:\s*\[(.*)\])?', line)
            if col_m:
                cname = col_m.group(1)
                ctype = col_m.group(2)
                csettings = col_m.group(3) or ''

                is_pk = 'pk' in csettings
                is_fk = 'ref:' in csettings
                is_null = 'not null' not in csettings and not is_pk

                # Check inline ref
                ref_m = re.search(r'ref:\s*([><\-])\s*(\w+)\.(\w+)', csettings)
                if ref_m:
                    op, rtable, rcol = ref_m.group(1), ref_m.group(2), ref_m.group(3)
                    data['refs'].append({
                        'from_table': tname,
                        'from_col': cname,
                        'op': op,
                        'to_table': rtable,
                        'to_col': rcol
                    })

                # Check rule importance (empirical/rule marker: not null + key or business logic)
                emp = 1 if (is_pk or is_fk or 'status' in cname or 'type' in cname or 'price' in cname or 'amount' in cname) else 0

                cols.append({
                    'name': cname,
                    'type': ctype,
                    'pk': is_pk,
                    'fk': is_fk,
                    'emp': emp,
                    'settings': csettings
                })

        data['tables'][tname] = {
            'name': tname,
            'color': header_color,
            'note': tnote,
            'cols': cols
        }

    # 5. Standalone Refs: Ref [name]: table1.col1 <op> table2.col2
    for rm in re.finditer(r'Ref(?:\s+\w+)?:\s*(\w+)\.(\w+)\s*([><\-]|<>)\s*(\w+)\.(\w+)', dbml_text):
        data['refs'].append({
            'from_table': rm.group(1),
            'from_col': rm.group(2),
            'op': rm.group(3),
            'to_table': rm.group(4),
            'to_col': rm.group(5)
        })

    return data

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        text = io.open(sys.argv[1], encoding='utf-8').read()
        res = parse_dbml(text)
        print(f"Parsed {len(res['tables'])} tables, {len(res['enums'])} enums, {len(res['refs'])} refs.")
