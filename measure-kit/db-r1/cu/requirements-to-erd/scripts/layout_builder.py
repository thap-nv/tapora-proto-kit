# -*- coding: utf-8 -*-
"""
Layout Builder for requirements-to-erd skill.
Computes 2D matrix grid layouts for tables and zones with customizable dimensions (N x M).
"""
import math

# Design tokens
INK = '#2d3142'
MUTED = '#4f5d75'
SOFT = '#8a93a5'
ACCENT = '#eb6c36'
PAPER = '#f5f5f5'

LH = 13
HDR = 30
PAD = 12

TIERS = {
    ACCENT: dict(tag='AXIS',  band='#fbe2d7', rail=ACCENT,    bw=1.6,
                 body='rgba(235,108,54,0.07)', nm=INK,   chipfill=ACCENT, chiptxt='#ffffff', chipop=1.0),
    INK:    dict(tag='CORE',  band='#e4e4e6', rail=INK,       bw=1.3,
                 body='#ffffff',               nm=INK,   chipfill='none', chiptxt=INK,       chipop=0.60),
    MUTED:  dict(tag='OPS',   band='#f4f4f6', rail='#9ea6b3', bw=1.0,
                 body='#ffffff',               nm=INK,   chipfill='none', chiptxt=MUTED,     chipop=0.45),
    SOFT:   dict(tag='INFRA', band=None,      rail=None,      bw=1.0,
                 body='#ffffff',               nm=MUTED, chipfill='none', chiptxt=SOFT,      chipop=0.35),
}

COLOR_MAP = {
    '#eb6c36': ACCENT,
    '#2d3142': INK,
    '#4f5d75': MUTED,
    '#8a93a5': SOFT,
    'accent': ACCENT,
    'ink': INK,
    'core': INK,
    'ops': MUTED,
    'muted': MUTED,
    'infra': SOFT,
    'soft': SOFT,
}

def determine_table_tone(tname, tinfo, fan_in=0):
    if tinfo.get('color'):
        c = tinfo['color'].lower()
        if c in COLOR_MAP:
            return COLOR_MAP[c]
    # Heuristics based on name or role
    if tname in ('persons', 'class_occurrences'):
        return ACCENT
    if any(k in tname for k in ('logs', 'history', 'organizations', 'facilities', 'users', 'tickets', 'acknowledgements')):
        return SOFT
    if any(k in tname for k in ('coaches', 'journals', 'units', 'discrepancies', 'availabilities', 'evaluations', 'external')):
        return MUTED
    return INK

def build_layout(parsed_data, layout_spec=None, cols=None):
    """
    Builds the 2D layout.
    layout_spec can contain:
    - cols: int (e.g. 2, 3, 4)
    - zones: list of dicts: [{'name': '...', 'grid': [c, r], 'tables': [...], 'tone': '...'}]
    """
    tables_dict = parsed_data['tables']

    # 1. Determine Zones
    zones_spec = []
    if layout_spec and 'zones' in layout_spec:
        zones_spec = layout_spec['zones']
        grid_cols = layout_spec.get('cols', cols or 3)
    elif parsed_data.get('table_groups'):
        # Use DBML TableGroups
        g_names = list(parsed_data['table_groups'].keys())
        grid_cols = cols or (3 if len(g_names) >= 7 else (2 if len(g_names) <= 4 else 3))
        for i, gname in enumerate(g_names):
            c = i % grid_cols
            r = i // grid_cols
            zones_spec.append({
                'name': gname,
                'grid': [c, r],
                'tables': parsed_data['table_groups'][gname]
            })
    else:
        # Default fallback / Auto clustering
        grid_cols = cols or 3

    # If no zones given at all, assign all tables to default zones or grid
    if not zones_spec:
        all_tables = list(tables_dict.keys())
        chunk_size = max(1, math.ceil(len(all_tables) / (grid_cols * 2)))
        r = 0
        c = 0
        for i in range(0, len(all_tables), chunk_size):
            chunk = all_tables[i:i+chunk_size]
            zones_spec.append({
                'name': f'VÙNG {r*grid_cols + c + 1}',
                'grid': [c, r],
                'tables': chunk
            })
            c += 1
            if c >= grid_cols:
                c = 0
                r += 1

    # Map tables to tone and size
    placed_tables = {}
    for tname, tinfo in tables_dict.items():
        cols_count = len(tinfo['cols'])
        h = HDR + PAD + cols_count * LH
        tone = determine_table_tone(tname, tinfo)

        # Standard width: 240 to 280 based on column name lengths
        max_col_len = max([len(c['name']) + len(c['type']) for c in tinfo['cols']] or [15])
        w = 260 if max_col_len < 26 else (270 if max_col_len < 32 else 280)

        placed_tables[tname] = {
            'name': tname,
            'w': w,
            'h': h,
            'tone': tone,
            'cols': [(
                '#' if c['pk'] else ('→' if c['fk'] else ''),
                c['name'],
                c['type'],
                c['emp']
            ) for c in tinfo['cols']],
            'note': tinfo.get('note', '')
        }

    # Position Zones on Grid
    # Calculate column widths and row heights
    num_cols = max(z['grid'][0] for z in zones_spec) + 1
    num_rows = max(z['grid'][1] for z in zones_spec) + 1

    col_widths = [640] * num_cols
    # Allow middle columns to be wider if they contain more tables
    for z in zones_spec:
        c, r = z['grid']
        tbl_count = len(z['tables'])
        if tbl_count >= 4 and col_widths[c] < 1020:
            col_widths[c] = 1020

    row_heights = [290] * num_rows
    for z in zones_spec:
        c, r = z['grid']
        tbl_count = len(z['tables'])
        if tbl_count >= 4 and row_heights[r] < 590:
            row_heights[r] = 590

    # Margin offsets
    MARGIN_X = 40
    MARGIN_Y = 50
    ZONE_GAP_X = 40
    ZONE_GAP_Y = 20

    col_x = []
    curr_x = MARGIN_X
    for w in col_widths:
        col_x.append(curr_x)
        curr_x += w + ZONE_GAP_X

    row_y = []
    curr_y = MARGIN_Y
    for h in row_heights:
        row_y.append(curr_y)
        curr_y += h + ZONE_GAP_Y

    # Compute Zone Rectangles and Table Positions inside Zones
    zones = []
    for z in zones_spec:
        c, r = z['grid']
        zx = col_x[c]
        zy = row_y[r]
        zw = col_widths[c]
        zh = row_heights[r]

        # Determine zone tone
        ztone = COLOR_MAP.get(z.get('tone', 'ink'), INK)
        if any(placed_tables.get(t, {}).get('tone') == ACCENT for t in z['tables']):
            ztone = ACCENT
        elif any(placed_tables.get(t, {}).get('tone') == MUTED for t in z['tables']):
            ztone = MUTED
        elif all(placed_tables.get(t, {}).get('tone') == SOFT for t in z['tables']):
            ztone = SOFT

        zones.append({
            'name': z['name'],
            'x': zx, 'y': zy, 'w': zw, 'h': zh,
            'tone': ztone,
            'tables': z['tables']
        })

        # Arrange tables inside this zone
        z_tables = z['tables']
        t_pad = 20
        top_offset = 40 # room for zone title

        if len(z_tables) == 1:
            t = placed_tables.get(z_tables[0])
            if t:
                t['x'] = zx + t_pad
                t['y'] = zy + top_offset
        elif len(z_tables) == 2:
            # Check if zone is wider than taller
            if zw >= 550: # Side by side
                for i, tn in enumerate(z_tables):
                    t = placed_tables.get(tn)
                    if t:
                        t['x'] = zx + t_pad + i * (t['w'] + 30)
                        t['y'] = zy + top_offset
            else: # Stacked
                curr_ty = zy + top_offset
                for tn in z_tables:
                    t = placed_tables.get(tn)
                    if t:
                        t['x'] = zx + t_pad
                        t['y'] = curr_ty
                        curr_ty += t['h'] + 20
        elif len(z_tables) <= 4:
            # 2 columns inside zone
            col_offset = 0
            row_offset = 0
            for i, tn in enumerate(z_tables):
                t = placed_tables.get(tn)
                if t:
                    col_idx = i % 2
                    row_idx = i // 2
                    t['x'] = zx + t_pad + col_idx * (t['w'] + 40)
                    t['y'] = zy + top_offset + row_idx * 230
        else:
            # 5+ tables: multi-column or custom
            col_offset = 0
            row_offset = 0
            for i, tn in enumerate(z_tables):
                t = placed_tables.get(tn)
                if t:
                    col_idx = i % 3 if zw > 900 else i % 2
                    row_idx = i // (3 if zw > 900 else 2)
                    t['x'] = zx + t_pad + col_idx * (t['w'] + 40)
                    t['y'] = zy + top_offset + row_idx * 220

    # Calculate Canvas Total Width and Height
    canvas_w = curr_x - ZONE_GAP_X + MARGIN_X
    canvas_h = curr_y - ZONE_GAP_Y + 180 # Extra space for Legend strip

    return {
        'canvas': {'width': canvas_w, 'height': canvas_h},
        'zones': zones,
        'tables': placed_tables,
        'grid': {'cols': num_cols, 'rows': num_rows}
    }
