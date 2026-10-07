# -*- coding: utf-8 -*-
"""
Router for requirements-to-erd skill.
Routes orthogonal elbow connectors (r=8) between tables, radiates anchors,
and places label masks with clearance.
"""
import math

MUTED = '#4f5d75'
ACCENT = '#eb6c36'
PAPER = '#f5f5f5'
SOFT = '#8a93a5'

INFRA_COLS = {
    'organization_id', 'facility_id',
    'created_by', 'updated_by', 'deleted_by', 'sold_by', 'purged_by',
    'changed_by', 'approved_by', 'matched_by', 'written_by', 'reviewed_by',
    'reported_by', 'resolved_by', 'deducted_by'
}

def filter_domain_refs(refs):
    """Filter out infrastructure super-node references according to Relationship Rendering Policy."""
    domain_refs = []
    for r in refs:
        fcol = r['from_col'].lower()
        if fcol in INFRA_COLS or fcol.endswith('_by'):
            continue
        domain_refs.append(r)
    return domain_refs

def compute_arc_sweep(head_v, nxt_v):
    """Compute SVG arc sweep flag based on cross product."""
    z = head_v[0] * nxt_v[1] - head_v[1] * nxt_v[0]
    return 1 if z > 0 else 0

def make_elbow_path(points, r=8):
    """
    Given a list of orthogonal points [(x0, y0), (x1, y1), ...],
    generates an SVG path string with rounded corners of radius r.
    """
    if len(points) < 2:
        return ""
    if len(points) == 2:
        return f"M {points[0][0]} {points[0][1]} L {points[1][0]} {points[1][1]}"

    path_parts = [f"M {points[0][0]} {points[0][1]}"]
    cx, cy = points[0]

    for i in range(1, len(points) - 1):
        prev_p = points[i - 1]
        curr_p = points[i]
        next_p = points[i + 1]

        # In-vector
        dx1 = curr_p[0] - prev_p[0]
        dy1 = curr_p[1] - prev_p[1]
        v1 = (1 if dx1 > 0 else (-1 if dx1 < 0 else 0), 1 if dy1 > 0 else (-1 if dy1 < 0 else 0))

        # Out-vector
        dx2 = next_p[0] - curr_p[0]
        dy2 = next_p[1] - curr_p[1]
        v2 = (1 if dx2 > 0 else (-1 if dx2 < 0 else 0), 1 if dy2 > 0 else (-1 if dy2 < 0 else 0))

        # Turn point stops r before curr_p
        stop_x = curr_p[0] - v1[0] * r
        stop_y = curr_p[1] - v1[1] * r

        if v1[0] != 0:
            path_parts.append(f"H {stop_x}")
        else:
            path_parts.append(f"V {stop_y}")

        sweep = compute_arc_sweep(v1, v2)
        arc_dx = v1[0] * r + v2[0] * r
        arc_dy = v1[1] * r + v2[1] * r
        path_parts.append(f"a {r} {r} 0 0 {sweep} {arc_dx} {arc_dy}")

    last_p = points[-1]
    dx = last_p[0] - points[-2][0]
    if dx != 0:
        path_parts.append(f"H {last_p[0]}")
    else:
        path_parts.append(f"V {last_p[1]}")

    return " ".join(path_parts)

def build_connectors_svg(tables, refs, route_overrides=None):
    """
    Renders all connectors as SVG elements.
    Supports manual route_overrides or automatic routing.
    """
    out = []
    A = out.append

    # If overrides provided, render them
    if route_overrides:
        for ro in route_overrides:
            from_t = ro.get('from', '')
            to_t = ro.get('to', '')
            color = ro.get('color', MUTED)
            dash = ro.get('dash', False)
            mk = ro.get('marker', 'arrow' if color == MUTED else 'arrow-accent')
            ds = ' stroke-dasharray="5,4"' if dash else ''

            A(f'<g class="rel" data-from="{from_t}" data-to="{to_t}">')
            if ro.get('type') == 'line':
                x1, y1, x2, y2 = ro['points']
                A(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="1"{ds} marker-end="url(#{mk})"/>')
            elif ro.get('type') == 'path':
                d = ro['d']
                A(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1"{ds} marker-end="url(#{mk})"/>')

            # Cardinality text
            for ct in ro.get('cards', []):
                A(f'<text x="{ct["x"]}" y="{ct["y"]}" fill="{MUTED}" font-size="8" font-family="\'Geist Mono\',monospace">{ct["t"]}</text>')

            # Label
            lbl = ro.get('label')
            if lbl:
                txt = lbl['text']
                w = lbl.get('w', len(txt) * 5.4 + 10)
                lcolor = lbl.get('color', color)
                if lbl.get('orient') == 'v':
                    x0 = lbl['x']
                    my = lbl['y']
                    pos = lbl.get('pos', 'right')
                    mx = (x0 + 8 + w / 2) if pos == 'right' else (x0 - 8 - w / 2)
                    A(f'<rect x="{mx - w / 2:.0f}" y="{my - 10}" width="{w}" height="12" rx="2" fill="{PAPER}"/>')
                    A(f'<text x="{mx:.0f}" y="{my - 1}" fill="{lcolor}" font-size="8" font-family="\'Geist Mono\',monospace" text-anchor="middle" letter-spacing="0.06em">{txt}</text>')
                else:
                    mx = lbl['x']
                    y0 = lbl['y']
                    pos = lbl.get('pos', 'above')
                    my = (y0 - 10) if pos == 'above' else (y0 + 18)
                    A(f'<rect x="{mx - w / 2:.0f}" y="{my - 10}" width="{w}" height="12" rx="2" fill="{PAPER}"/>')
                    A(f'<text x="{mx:.0f}" y="{my - 1}" fill="{lcolor}" font-size="8" font-family="\'Geist Mono\',monospace" text-anchor="middle" letter-spacing="0.06em">{txt}</text>')

            A('</g>')
        return '\n'.join(out)

    # Automatic routing for domain refs
    domain_refs = filter_domain_refs(refs)
    seen_pairs = set()

    for r in domain_refs:
        ft, tt = r['from_table'], r['to_table']
        pair_key = (min(ft, tt), max(ft, tt))
        if pair_key in seen_pairs:
            continue
        seen_pairs.add(pair_key)

        t1 = tables.get(ft)
        t2 = tables.get(tt)
        if not t1 or not t2:
            continue

        color = ACCENT if (t1.get('tone') == ACCENT or t2.get('tone') == ACCENT) else MUTED
        mk = 'arrow-accent' if color == ACCENT else 'arrow'

        # Calculate bounding box centers
        cx1, cy1 = t1['x'] + t1['w'] / 2, t1['y'] + t1['h'] / 2
        cx2, cy2 = t2['x'] + t2['w'] / 2, t2['y'] + t2['h'] / 2

        A(f'<g class="rel" data-from="{ft}" data-to="{tt}">')

        # Check horizontal or vertical adjacency
        if abs(cy1 - cy2) < 40:
            # Horizontal straight line
            if cx1 < cx2:
                x1, y1 = t1['x'] + t1['w'], cy1
                x2, y2 = t2['x'] - 6, cy2
            else:
                x1, y1 = t1['x'], cy1
                x2, y2 = t2['x'] + t2['w'] + 6, cy2
            A(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{color}" stroke-width="1" marker-end="url(#{mk})"/>')
        elif abs(cx1 - cx2) < 40:
            # Vertical straight line
            if cy1 < cy2:
                x1, y1 = cx1, t1['y'] + t1['h']
                x2, y2 = cx2, t2['y'] - 6
            else:
                x1, y1 = cx1, t1['y']
                x2, y2 = cx2, t2['y'] + t2['h'] + 6
            A(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{color}" stroke-width="1" marker-end="url(#{mk})"/>')
        else:
            # Simple 1-elbow Manhattan routing
            mid_y = (cy1 + cy2) / 2
            x1, y1 = cx1, t1['y'] + (t1['h'] if cy2 > cy1 else 0)
            x2, y2 = cx2, t2['y'] + (0 if cy2 > cy1 else t2['h'])
            pts = [(x1, y1), (x1, mid_y), (x2, mid_y), (x2, y2)]
            path_d = make_elbow_path(pts, r=8)
            A(f'<path d="{path_d}" fill="none" stroke="{color}" stroke-width="1" marker-end="url(#{mk})"/>')

        A('</g>')

    return '\n'.join(out)
