# -*- coding: utf-8 -*-
"""
HTML Assembler for requirements-to-erd skill.
Packages the SVG diagram and metadata into a standalone, interactive HTML file.
"""
import html

def esc(s):
    return html.escape(str(s), quote=True)

def assemble_html(layout_data, connectors_svg, metadata):
    tables = layout_data['tables']
    zones = layout_data['zones']
    canvas = layout_data['canvas']
    W, H = canvas['width'], canvas['height']
    proj_name = metadata.get('project', {}).get('name', 'Database Schema')

    out = []
    A = out.append

    # Render Zones
    zones_svg = []
    for z in zones:
        zx, zy, zw, zh, tone, zn = z['x'], z['y'], z['w'], z['h'], z['tone'], z['name']
        op = '0.05' if tone == '#eb6c36' else '0.025'
        zones_svg.append(f'<rect x="{zx}" y="{zy}" width="{zw}" height="{zh}" rx="8" fill="{tone}" fill-opacity="{op}" stroke="{tone}" stroke-opacity="0.18" stroke-width="1"/>')
        zones_svg.append(f'<text x="{zx + 14}" y="{zy + 17}" fill="{tone}" font-size="8" font-family="\'Geist Mono\',monospace" letter-spacing="0.16em">{esc(zn.upper())}</text>')

    # Render Tables
    tables_svg = []
    from layout_builder import TIERS, HDR, PAD, LH, PAPER, INK, MUTED, SOFT, ACCENT
    for t in tables.values():
        x, y, w, h, tone = t['x'], t['y'], t['w'], t['h'], t['tone']
        tr = TIERS.get(tone, TIERS[INK])
        cols_text = ' '.join(c[1] for c in t['cols'])
        tables_svg.append(f'<g class="tbl" data-name="{esc(t["name"])} {esc(cols_text)}">')
        tables_svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PAPER}"/>')
        tables_svg.append(f'<rect class="tbl-frame" x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{tr["body"]}" stroke="{tone}" stroke-width="{tr["bw"]}"/>')
        if tr['band']:
            tables_svg.append(f'<rect x="{x+1}" y="{y+1}" width="{w-2}" height="{HDR-1}" rx="5" fill="{tr["band"]}"/>')
            tables_svg.append(f'<rect x="{x+1}" y="{y+HDR-6}" width="{w-2}" height="6" fill="{tr["band"]}"/>')
        tables_svg.append(f'<line x1="{x}" y1="{y+HDR}" x2="{x+w}" y2="{y+HDR}" stroke="{tone}" stroke-opacity="0.25" stroke-width="1"/>')
        if tr['rail']:
            tables_svg.append(f'<rect x="{x+1}" y="{y+7}" width="4" height="{h-14}" fill="{tr["rail"]}"/>')
        tables_svg.append(f'<rect x="{x+8}" y="{y+8}" width="38" height="12" rx="2" fill="{tr["chipfill"]}" stroke="{tone}" stroke-opacity="{tr["chipop"]}" stroke-width="0.8"/>')
        tables_svg.append(f'<text x="{x+27}" y="{y+17}" fill="{tr["chiptxt"]}" font-size="7" font-family="\'Geist Mono\',monospace" text-anchor="middle" letter-spacing="0.08em">{tr["tag"]}</text>')
        tables_svg.append(f'<text x="{x+54}" y="{y+18}" fill="{tr["nm"]}" font-size="12" font-weight="600" font-family="\'Geist\',sans-serif">{esc(t["name"])}</text>')

        for i, (mk, col, typ, emp) in enumerate(t['cols']):
            yy = y + HDR + 14 + i * LH
            c = INK if emp else MUTED
            col_cls = 'col-key' if mk in ('#', '→') else 'col-attr'
            if mk:
                tables_svg.append(f'<text class="{col_cls}" x="{x+9}" y="{yy}" fill="{c}" font-size="9" font-family="\'Geist Mono\',monospace">{esc(mk)}</text>')
            tables_svg.append(f'<text class="{col_cls}" x="{x+21}" y="{yy}" fill="{c}" font-size="9" font-family="\'Geist Mono\',monospace">{esc(col)}</text>')
            tables_svg.append(f'<text class="{col_cls}" x="{x+w-9}" y="{yy}" fill="{SOFT}" font-size="8" font-family="\'Geist Mono\',monospace" text-anchor="end">{esc(typ)}</text>')
        tables_svg.append('</g>')

    # Legend Strip
    legend_svg = []
    LY = H - 170
    legend_svg.append(f'<line x1="40" y1="{LY}" x2="{W-40}" y2="{LY}" stroke="rgba(45,49,66,0.10)" stroke-width="0.8"/>')
    legend_svg.append(f'<text x="40" y="{LY+16}" fill="{MUTED}" font-size="8" font-family="\'Geist Mono\',monospace" letter-spacing="0.14em">CHÚ GIẢI</text>')
    litems = [
        (40, ACCENT, 'Trục chính · gốc mô hình'),
        (340, INK, 'Nghiệp vụ lõi'),
        (590, MUTED, 'Vận hành'),
        (810, SOFT, 'Hạ tầng · phụ trợ'),
    ]
    for bx, st, txt in litems:
        tr = TIERS[st]
        txt = tr['tag'] + ' — ' + txt
        legend_svg.append(f'<rect x="{bx}" y="{LY+26}" width="34" height="18" rx="4" fill="{tr["body"]}" stroke="{st}" stroke-width="{tr["bw"]}"/>')
        if tr['band']:
            legend_svg.append(f'<rect x="{bx+1}" y="{LY+27}" width="32" height="8" rx="3" fill="{tr["band"]}"/>')
            legend_svg.append(f'<rect x="{bx+1}" y="{LY+32}" width="32" height="3" fill="{tr["band"]}"/>')
        if tr['rail']:
            legend_svg.append(f'<rect x="{bx+1}" y="{LY+29}" width="4" height="12" fill="{tr["rail"]}"/>')
        legend_svg.append(f'<text x="{bx+42}" y="{LY+40}" fill="{MUTED}" font-size="9" font-family="\'Geist\',sans-serif">{esc(txt)}</text>')

    legend_svg.append(f'<line x1="1080" y1="{LY+36}" x2="1116" y2="{LY+36}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="5,4"/>')
    legend_svg.append(f'<text x="1124" y="{LY+40}" fill="{MUTED}" font-size="9" font-family="\'Geist\',sans-serif">Có thể khác HLV gốc — dạy thay</text>')
    legend_svg.append(f'<text x="40" y="{LY+64}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\',monospace"># khóa chính   → khóa ngoại</text>')
    legend_svg.append(f'<text x="260" y="{LY+64}" fill="{MUTED}" font-size="9" font-family="\'Geist\',sans-serif">Cột tô đậm = mang rule nghiệp vụ</text>')
    legend_svg.append(f'<text x="40" y="{LY+86}" fill="{SOFT}" font-size="9" font-family="\'Geist\',sans-serif" font-style="italic">Tất cả quan hệ chính giữa các phân hệ được thể hiện trực quan bằng đường nối 2 chiều.</text>')
    legend_svg.append(f'<text x="40" y="{LY+102}" fill="{SOFT}" font-size="9" font-family="\'Geist\',sans-serif" font-style="italic">Mọi cột *_by trỏ về users; organization_id · facility_id có ở hầu hết bảng — đều là FK thật trong schema.dbml.</text>')

    # Complete SVG Body
    full_svg = f'''<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="erd-schema-title erd-schema-desc">
<title id="erd-schema-title">Lược đồ cơ sở dữ liệu {esc(proj_name)}</title>
<desc id="erd-schema-desc">Lược đồ quan hệ {len(tables)} bảng chia thành {len(zones)} vùng theo bố cục ma trận 2 chiều.</desc>
<defs>
<marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
<polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/>
</marker>
<marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
<polygon points="0 0, 8 3, 0 6" fill="{ACCENT}"/>
</marker>
</defs>
<g id="scene">
<rect width="100%" height="100%" fill="{PAPER}"/>
{' '.join(zones_svg)}
{connectors_svg}
{' '.join(tables_svg)}
{' '.join(legend_svg)}
</g>
</svg>'''

    # Table of Contents
    toc = []
    for z in zones:
        zn = z['name']
        tables_in_z = z['tables']
        toc.append('    <div class="toc-zone">')
        toc.append(f'      <div class="toc-zone-name">{esc(zn)}</div>')
        toc.append('      <ul>')
        for t in tables_in_z:
            toc.append(f'        <li><a href="#" data-goto="{esc(t)}">{esc(t)}</a></li>')
        toc.append('      </ul>')
        toc.append('    </div>')
    TOC_HTML = '\n'.join(toc)

    # Pills
    pills = ['<button class="pill active" data-zone="all">Toàn cảnh</button>']
    for z in zones:
        zn = z['name'].split('·')[0].strip()
        pills.append(f'<button class="pill" data-zone="{esc(z["name"])}">{esc(zn)}</button>')
    PILLS_HTML = '\n'.join(pills)

    # Derived Values rows
    drows = ''
    derived = metadata.get('derived_values', [])
    if derived:
        drows = '\n'.join(f'      <tr><td class="mono strong">{esc(a)}</td><td class="mono soft">{esc(b)}</td><td>{c}</td><td class="mono soft">{esc(d)}</td></tr>' for a, b, c, d in derived)

    # HTML Shell
    html_page = f'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lược đồ CSDL {esc(proj_name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {{
    --paper: #f5f5f5;
    --paper-card: #ffffff;
    --ink: #2d3142;
    --muted: #4f5d75;
    --soft: #8a93a5;
    --accent: #eb6c36;
    --rule: rgba(45, 49, 66, 0.12);
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: var(--paper);
    color: var(--ink);
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.55;
    padding: 32px 24px 80px;
  }}
  .container {{ max-width: 1400px; margin: 0 auto; }}
  header.masthead {{
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
  }}
  .masthead h1 {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 32px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--ink);
    line-height: 1.2;
  }}
  .masthead .meta {{
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.04em;
    margin-top: 6px;
  }}
  .canvas-card {{
    background: var(--paper-card);
    border: 1px solid var(--rule);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 40px;
  }}
  .canvas-header {{
    padding: 10px 16px;
    background: #fafafa;
    border-bottom: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }}
  .canvas-header-left, .canvas-header-right {{
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }}
  .pill {{
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid var(--rule);
    background: white;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }}
  .pill:hover {{ border-color: var(--muted); color: var(--ink); }}
  .pill.active {{
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    font-weight: 500;
  }}
  .zoom-btn {{
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid var(--rule);
    background: white;
    color: var(--ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }}
  .zoom-btn:hover {{ background: #f0f0f0; border-color: var(--muted); }}
  .zoom-btn.btn-text {{ width: auto; padding: 0 10px; font-size: 11px; }}
  .canvas-container {{
    position: relative;
    width: 100%;
    height: 780px;
    overflow: hidden;
    cursor: grab;
    user-select: none;
    background: var(--paper);
  }}
  .canvas-container:active {{ cursor: grabbing; }}
  .canvas-container svg {{
    width: 100%;
    height: 100%;
    display: block;
    transform-origin: 0 0;
  }}
  .canvas-card.fullscreen {{
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    z-index: 9999;
    border-radius: 0;
    margin: 0;
    border: none;
  }}
  .canvas-card.fullscreen .canvas-container {{ height: calc(100vh - 49px); }}
  .spotlight-hud {{
    display: none;
    position: absolute;
    top: 12px; left: 16px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(8px);
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 8px 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    z-index: 10;
    font-size: 12px;
    align-items: center;
    gap: 12px;
  }}
  .spotlight-hud.active {{ display: flex; }}
  .spotlight-badge {{
    font-family: 'Geist Mono', monospace;
    font-weight: 600;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .spotlight-links {{ display: flex; gap: 6px; flex-wrap: wrap; }}
  .spotlight-chip {{
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    padding: 2px 8px;
    background: #f0f0f2;
    border-radius: 3px;
    color: var(--ink);
    cursor: pointer;
    text-decoration: none;
  }}
  .spotlight-chip:hover {{ background: var(--accent); color: white; }}
  .spotlight-close {{
    margin-left: 8px;
    background: none;
    border: none;
    color: var(--soft);
    font-size: 16px;
    cursor: pointer;
    padding: 0 4px;
  }}
  .spotlight-close:hover {{ color: var(--ink); }}
  svg g.tbl {{ cursor: pointer; }}
  body.spotlight-active svg #scene g.tbl,
  body.spotlight-active svg #scene g.rel {{
    opacity: 0.12;
    transition: opacity 0.2s ease;
  }}
  body.spotlight-active svg #scene g.tbl.spotlight-focused,
  body.spotlight-active svg #scene g.tbl.spotlight-neighbor,
  body.spotlight-active svg #scene g.rel.spotlight-edge {{
    opacity: 1 !important;
  }}
  body.spotlight-active svg #scene g.tbl.spotlight-focused .tbl-frame {{
    stroke: var(--accent) !important;
    stroke-width: 2.4 !important;
  }}
  body.spotlight-active svg #scene g.tbl.spotlight-neighbor .tbl-frame {{
    stroke: var(--accent) !important;
    stroke-width: 1.8 !important;
  }}
  .sec-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px;
    margin: 32px 0 16px;
    color: var(--ink);
  }}
  .toc-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }}
  .toc-zone {{
    background: white;
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 12px 16px;
  }}
  .toc-zone-name {{
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
  }}
  .toc-zone ul {{ list-style: none; }}
  .toc-zone li {{ margin-bottom: 4px; }}
  .toc-zone a {{
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    color: var(--ink);
    text-decoration: none;
  }}
  .toc-zone a:hover {{ text-decoration: underline; color: var(--accent); }}
  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    background: white;
    border: 1px solid var(--rule);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 32px;
    font-size: 13px;
  }}
  table.data-table th, table.data-table td {{
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--rule);
  }}
  table.data-table th {{ background: #fafafa; font-weight: 600; font-size: 12px; color: var(--muted); }}
  table.data-table tr:last-child td {{ border-bottom: none; }}
  .mono {{ font-family: 'Geist Mono', monospace; }}
  .soft {{ color: var(--soft); }}
  .strong {{ font-weight: 600; color: var(--ink); }}
</style>
</head>
<body>
<div class="container">
  <header class="masthead">
    <div>
      <h1>Lược đồ Cơ sở Dữ liệu {esc(proj_name)}</h1>
      <div class="meta">{len(tables)} BẢNG · {len(zones)} VÙNG · ĐỒNG BỘ 100% SCHEMA.DBML</div>
    </div>
  </header>

  <div class="canvas-card" id="canvas-card">
    <div class="canvas-header">
      <div class="canvas-header-left">
        <span style="font-family:'Geist Mono',monospace; font-size:11px; color:var(--soft); margin-right:4px;">VÙNG:</span>
        {PILLS_HTML}
      </div>
      <div class="canvas-header-right">
        <input type="text" id="filter-input" placeholder="Lọc bảng..." class="pill" style="width:130px; cursor:text; padding:4px 8px;">
        <button class="zoom-btn btn-text" id="btn-fullscreen" title="Toàn màn hình (F)">⛶ Toàn màn hình</button>
        <button class="zoom-btn" id="btn-zoom-in" title="Phóng to">+</button>
        <button class="zoom-btn" id="btn-zoom-out" title="Thu nhỏ">−</button>
        <button class="zoom-btn btn-text" id="btn-zoom-reset" title="Vừa khung">Fit</button>
      </div>
    </div>
    <div class="canvas-container" id="canvas-container">
      <div class="spotlight-hud" id="spotlight-hud">
        <span class="spotlight-badge" id="spotlight-name">table_name</span>
        <span style="color:var(--soft); font-size:11px;" id="spotlight-count">0 liên kết:</span>
        <div class="spotlight-links" id="spotlight-links"></div>
        <button class="spotlight-close" id="spotlight-close" title="Đóng (Esc)">×</button>
      </div>
      {full_svg}
    </div>
  </div>

  <h2 class="sec-title">Mục lục Phân hệ & Bảng</h2>
  <div class="toc-grid">
{TOC_HTML}
  </div>

  {f'''<h2 class="sec-title">Giá trị suy ra — cố ý không lưu</h2>
  <table class="data-table">
    <thead>
      <tr><th>Giá trị nghiệp vụ</th><th>Bảng liên quan</th><th>Quy tắc tính toán & Lý do không lưu sẵn</th><th>Mã Rule</th></tr>
    </thead>
    <tbody>
{drows}
    </tbody>
  </table>''' if drows else ''}
</div>

<script>
(function() {{
  const container = document.getElementById('canvas-container');
  const card = document.getElementById('canvas-card');
  const svg = container.querySelector('svg');
  const scene = document.getElementById('scene');
  const hud = document.getElementById('spotlight-hud');
  const hudName = document.getElementById('spotlight-name');
  const hudCount = document.getElementById('spotlight-count');
  const hudLinks = document.getElementById('spotlight-links');
  const hudClose = document.getElementById('spotlight-close');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const filterInput = document.getElementById('filter-input');

  const VB_W = {W}, VB_H = {H};
  let scale = 1, panX = 0, panY = 0;
  let isDragging = false, startX = 0, startY = 0;

  function fitToContainer() {{
    const cw = container.clientWidth, ch = container.clientHeight;
    scale = Math.min(cw / VB_W, ch / VB_H) * 0.96;
    panX = (cw - VB_W * scale) / 2;
    panY = (ch - VB_H * scale) / 2;
    applyTransform();
  }}

  function applyTransform() {{
    scene.setAttribute('transform', `matrix(${{scale}} 0 0 ${{scale}} ${{panX}} ${{panY}})`);
  }}

  container.addEventListener('mousedown', e => {{
    if (e.target.closest('#spotlight-hud') || e.target.closest('button')) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  }});

  window.addEventListener('mousemove', e => {{
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  }});

  window.addEventListener('mouseup', () => isDragging = false);

  container.addEventListener('wheel', e => {{
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.max(0.15, Math.min(3.5, scale * factor));
    panX = mouseX - (mouseX - panX) * (newScale / scale);
    panY = mouseY - (mouseY - panY) * (newScale / scale);
    scale = newScale;
    applyTransform();
  }}, {{ passive: false }});

  document.getElementById('btn-zoom-in').onclick = () => {{
    scale = Math.min(3.5, scale * 1.25);
    applyTransform();
  }};
  document.getElementById('btn-zoom-out').onclick = () => {{
    scale = Math.max(0.15, scale / 1.25);
    applyTransform();
  }};
  document.getElementById('btn-zoom-reset').onclick = fitToContainer;

  btnFullscreen.onclick = toggleFullscreen;
  function toggleFullscreen() {{
    const isFull = card.classList.toggle('fullscreen');
    btnFullscreen.textContent = isFull ? '✕ Thu nhỏ' : '⛶ Toàn màn hình';
    setTimeout(fitToContainer, 60);
  }}

  // Build Adjacency Graph for Spotlight
  const graph = {{}};
  document.querySelectorAll('g.tbl').forEach(g => {{
    const nm = g.getAttribute('data-name').split(' ')[0];
    graph[nm] = new Set();
  }});

  document.querySelectorAll('g.rel').forEach(g => {{
    const from = g.getAttribute('data-from');
    const to = g.getAttribute('data-to');
    if (graph[from]) graph[from].add(to);
    if (graph[to]) graph[to].add(from);
  }});

  let activeTable = null;
  function setSpotlight(tblName) {{
    if (!tblName || activeTable === tblName) {{
      clearSpotlight();
      return;
    }}
    activeTable = tblName;
    document.body.classList.add('spotlight-active');

    const neighbors = graph[tblName] || new Set();
    document.querySelectorAll('g.tbl').forEach(g => {{
      const nm = g.getAttribute('data-name').split(' ')[0];
      g.classList.remove('spotlight-focused', 'spotlight-neighbor');
      if (nm === tblName) g.classList.add('spotlight-focused');
      else if (neighbors.has(nm)) g.classList.add('spotlight-neighbor');
    }});

    document.querySelectorAll('g.rel').forEach(g => {{
      const from = g.getAttribute('data-from');
      const to = g.getAttribute('data-to');
      if (from === tblName || to === tblName) g.classList.add('spotlight-edge');
      else g.classList.remove('spotlight-edge');
    }});

    // Update HUD
    hudName.textContent = tblName;
    hudCount.textContent = `${{neighbors.size}} liên kết trực tiếp:`;
    hudLinks.innerHTML = '';
    neighbors.forEach(nb => {{
      const chip = document.createElement('span');
      chip.className = 'spotlight-chip';
      chip.textContent = nb;
      chip.onclick = e => {{
        e.stopPropagation();
        setSpotlight(nb);
        zoomToTable(nb);
      }};
      hudLinks.appendChild(chip);
    }});
    hud.classList.add('active');
  }}

  function clearSpotlight() {{
    activeTable = null;
    document.body.classList.remove('spotlight-active');
    document.querySelectorAll('g.tbl').forEach(g => g.classList.remove('spotlight-focused', 'spotlight-neighbor'));
    document.querySelectorAll('g.rel').forEach(g => g.classList.remove('spotlight-edge'));
    hud.classList.remove('active');
  }}

  hudClose.onclick = clearSpotlight;

  document.querySelectorAll('g.tbl').forEach(g => {{
    g.onclick = e => {{
      e.stopPropagation();
      const nm = g.getAttribute('data-name').split(' ')[0];
      setSpotlight(nm);
    }};
  }});

  container.onclick = e => {{
    if (!e.target.closest('g.tbl') && !e.target.closest('#spotlight-hud')) {{
      clearSpotlight();
    }}
  }};

  function zoomToTable(tblName) {{
    const g = Array.from(document.querySelectorAll('g.tbl')).find(el => el.getAttribute('data-name').split(' ')[0] === tblName);
    if (!g) return;
    const r = g.querySelector('rect');
    const x = parseFloat(r.getAttribute('x')), y = parseFloat(r.getAttribute('y'));
    const w = parseFloat(r.getAttribute('width')), h = parseFloat(r.getAttribute('height'));
    const cw = container.clientWidth, ch = container.clientHeight;
    scale = 1.3;
    panX = cw / 2 - (x + w / 2) * scale;
    panY = ch / 2 - (y + h / 2) * scale;
    applyTransform();
  }}

  // Domain Focus Pills
  document.querySelectorAll('.pill[data-zone]').forEach(btn => {{
    btn.onclick = () => {{
      document.querySelectorAll('.pill[data-zone]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const zName = btn.getAttribute('data-zone');
      if (zName === 'all') {{
        fitToContainer();
      }} else {{
        zoomToZone(zName);
      }}
    }};
  }});

  const ZONES_DATA = {zones};
  function zoomToZone(zName) {{
    const z = ZONES_DATA.find(item => item.name === zName || item.name.includes(zName));
    if (!z) return;
    const cw = container.clientWidth, ch = container.clientHeight;
    scale = Math.min(cw / (z.w + 60), ch / (z.h + 60)) * 0.92;
    panX = (cw - z.w * scale) / 2 - z.x * scale;
    panY = (ch - z.h * scale) / 2 - z.y * scale;
    applyTransform();
  }}

  // Search filter
  filterInput.oninput = () => {{
    const q = filterInput.value.toLowerCase().trim();
    if (!q) {{
      document.querySelectorAll('g.tbl').forEach(g => g.style.opacity = '');
      return;
    }}
    document.querySelectorAll('g.tbl').forEach(g => {{
      const text = g.getAttribute('data-name').toLowerCase();
      g.style.opacity = text.includes(q) ? '1' : '0.12';
    }});
  }};

  // Jump from TOC
  document.querySelectorAll('a[data-goto]').forEach(a => {{
    a.onclick = e => {{
      e.preventDefault();
      const t = a.getAttribute('data-goto');
      setSpotlight(t);
      zoomToTable(t);
      card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
    }};
  }});

  window.addEventListener('keydown', e => {{
    if (e.key === 'Escape') {{
      if (card.classList.contains('fullscreen')) toggleFullscreen();
      clearSpotlight();
    }}
    if (e.key === 'f' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {{
      toggleFullscreen();
    }}
  }});

  window.addEventListener('resize', fitToContainer);
  setTimeout(fitToContainer, 50);
}})();
</script>
</body>
</html>'''

    return html_page
