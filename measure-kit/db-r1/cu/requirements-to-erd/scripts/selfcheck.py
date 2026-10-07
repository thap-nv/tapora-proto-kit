# -*- coding: utf-8 -*-
"""Self-check 4.7 for docs/database/schema.html"""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

src = io.open(sys.argv[1], encoding='utf-8').read()
svg = src[src.index('<svg'):src.index('</svg>')+6]
fails, warns, oks = [], [], []
def ok(m): oks.append(m)
def bad(m): fails.append(m)
def warn(m): warns.append(m)

# ---- 1 & 2 accessibility ----
m = re.search(r'<svg[^>]*>', svg).group(0)
if 'role="img"' in m and 'aria-labelledby=' in m: ok('svg có role="img" + aria-labelledby')
else: bad('svg thiếu role/aria-labelledby')
ids = re.search(r'aria-labelledby="([^"]+)"', m).group(1).split()
if all(re.search(r'id="%s"' % i, svg) for i in ids): ok('aria-labelledby trỏ tới id tồn tại: ' + ' '.join(ids))
else: bad('aria-labelledby trỏ tới id không tồn tại')
if all(i not in ('title','desc') for i in ids): ok('id có tiền tố riêng, không dùng title/desc trần')
else: bad('id dùng title/desc trần')
after = svg[svg.index(m)+len(m):].lstrip()
if after.startswith('<title'): ok('<title> là con đầu tiên')
else: bad('<title> không phải con đầu tiên: ' + after[:40])

# ---- 3 no diagonals ----
diag = 0
for ln in re.finditer(r'<line ([^>]*)>', svg):
    a = dict(re.findall(r'(\w+)="([^"]*)"', ln.group(1)))
    if 'x1' not in a: continue
    if a['x1'] != a['x2'] and a['y1'] != a['y2']: diag += 1
paths = re.findall(r'<path d="([^"]+)"', svg)
badcmd = [d for d in paths if re.search(r'[LlCcSsQqTt]', d)]
if diag == 0 and not badcmd: ok('không có đường chéo — %d <line> trục + %d elbow (chỉ M/V/H/a)' % (
    len(re.findall(r'<line ', svg)), len(paths)))
else: bad('đường chéo: %d line, %d path có lệnh cong/xiên' % (diag, len(badcmd)))

# ---- parse table rects (the stroked one, 2nd of each pair) ----
boxes = []
for g in re.finditer(r'<g class="tbl" data-name="([^"]+)">(.*?)</g>', svg, re.S):
    name = g.group(1).split()[0]
    r = re.findall(r'<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"', g.group(2))
    x, y, w, h = map(int, r[0])
    boxes.append((name, x, y, x+w, y+h))
if boxes: ok('%d bảng có data-name (dùng cho lọc)' % len(boxes))
else: bad('không tìm thấy bảng nào')

# ---- 0 sơ đồ khớp schema.dbml: cùng tập bảng, cùng số cột từng bảng ----
import os
dbml_path = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), 'schema.dbml')
dbml = io.open(dbml_path, encoding='utf-8').read()
dcols = {}
for name, body in re.findall(r'^Table (\w+)[^{]*\{(.*?)^\}', dbml, re.S | re.M):
    b = re.sub(r'indexes\s*\{.*?\n\s*\}', '', body, flags=re.S)
    b = re.sub(r'indexes\s*\{[^}]*\}', '', b)
    b = re.sub(r"Note:\s*'''.*?'''", '', b, flags=re.S)
    b = re.sub(r"Note:\s*'[^\n]*'", '', b)
    dcols[name] = [re.match(r'\s+(\w+)\s', l).group(1) for l in b.splitlines() if re.match(r'\s+\w+\s+[\w(),]+', l)]
scols = {g.group(1).split()[0]: g.group(1).split()[1:]
         for g in re.finditer(r'<g class="tbl" data-name="([^"]+)">', svg)}
diff = []
for nm in sorted(set(dcols) | set(scols)):
    if nm not in scols: diff.append('%s thiếu trong sơ đồ' % nm)
    elif nm not in dcols: diff.append('%s thừa trong sơ đồ' % nm)
    elif dcols[nm] != scols[nm]: diff.append('%s lệch cột: dbml %s / sơ đồ %s' % (
        nm, sorted(set(dcols[nm]) - set(scols[nm])), sorted(set(scols[nm]) - set(dcols[nm]))) if set(dcols[nm]) != set(scols[nm])
        else '%s đúng cột nhưng sai thứ tự' % nm)
if not diff: ok('sơ đồ khớp schema.dbml: %d bảng · %d cột · %d enum' % (
    len(dcols), sum(len(v) for v in dcols.values()), len(re.findall(r'^Enum ', dbml, re.M))))
else: bad('sơ đồ lệch schema.dbml: ' + '; '.join(diff[:6]))

# ---- collect connector segments ----
segs = []   # (x1,y1,x2,y2)
for ln in re.finditer(r'<line ([^>]*)marker-end[^>]*>', svg):
    a = dict(re.findall(r'(\w+)="([^"]*)"', ln.group(1)))
    segs.append(tuple(float(a[k]) for k in ('x1','y1','x2','y2')))
for d in paths:
    toks = re.findall(r'([MVHa])\s*([-\d. ]*)', d)
    cx = cy = 0.0
    for cmd, arg in toks:
        n = [float(v) for v in arg.replace(',',' ').split() if v not in ('','-')]
        if cmd == 'M': cx, cy = n[0], n[1]
        elif cmd == 'V': segs.append((cx, cy, cx, n[0])); cy = n[0]
        elif cmd == 'H': segs.append((cx, cy, n[0], cy)); cx = n[0]
        elif cmd == 'a': cx += n[-2]; cy += n[-1]   # corner arc, ignore as segment

# ---- 6 no transit behind a non-endpoint box ----
viol = []
for (x1,y1,x2,y2) in segs:
    lo_x, hi_x = min(x1,x2), max(x1,x2)
    lo_y, hi_y = min(y1,y2), max(y1,y2)
    for (nm,bx1,by1,bx2,by2) in boxes:
        # strict overlap: segment interior inside box interior
        ox = min(hi_x,bx2) - max(lo_x,bx1)
        oy = min(hi_y,by2) - max(lo_y,by1)
        if ox > 1 and oy > 1:
            viol.append('%s qua (%g,%g)-(%g,%g)' % (nm,x1,y1,x2,y2))
if not viol: ok('không có đoạn nối nào xuyên qua thân bảng (%d đoạn kiểm tra)' % len(segs))
else: bad('xuyên bảng: ' + '; '.join(viol[:6]))

# ---- 5 parallel runs >= 12px ----
close = []
H = [s for s in segs if abs(s[1]-s[3]) < .5 and abs(s[0]-s[2]) > 5]
V = [s for s in segs if abs(s[0]-s[2]) < .5 and abs(s[1]-s[3]) > 5]
for grp, idx, oth in ((H,1,0),(V,0,1)):
    for i in range(len(grp)):
        for j in range(i+1, len(grp)):
            a, b = grp[i], grp[j]
            gap = abs(a[idx]-b[idx])
            # do they share span on the other axis?
            a1,a2 = sorted((a[oth],a[oth+2])); b1,b2 = sorted((b[oth],b[oth+2]))
            if min(a2,b2)-max(a1,b1) > 4 and gap < 12:
                close.append('%.0f px: %s / %s' % (gap, a, b))
if not close: ok('không có đoạn song song nào cách < 12px')
else: bad('song song quá sát: ' + '; '.join(close[:5]))

# ---- 7 accent: tran theo TRANG (SKILL 4.1) ----
# Mac dinh 2. Chi duoc nang khi trang co >=7 vung, cac accent cach nhau >=1 vung,
# va bang do thang fan-in trong vung (da loc *_by + cot tenancy). Tran cung la 4:
# can hon 4 mo neo thi TACH TRANG chu khong nang so nay.
ACCENT_CAP = 2
assert ACCENT_CAP <= 4, 'tran cung la 4 accent moi trang - can hon thi tach trang (SKILL 4.2)'

acc = re.findall(r'<g class="tbl" data-name="([^"]+)">.*?stroke="#eb6c36"', svg, re.S)
accs = [g.group(1).split()[0] for g in re.finditer(r'<g class="tbl" data-name="([^"]+)">(.*?)</g>', svg, re.S)
        if '#eb6c36' in g.group(2)]
if len(accs) <= ACCENT_CAP:
    ok('accent dùng cho %d/%d bảng cho phép mỗi trang: %s' % (len(accs), ACCENT_CAP, ', '.join(accs)))
else:
    bad('accent dùng cho %d bảng, trần trang là %d: %s' % (len(accs), ACCENT_CAP, ', '.join(accs)))

# ---- 7b moi bac bang phai co >=2 kenh, >=1 kenh phi-mau (SKILL 4.1b) ----
TAGS = {'#eb6c36': 'AXIS', '#2d3142': 'CORE', '#4f5d75': 'OPS', '#8a93a5': 'INFRA'}
BAND = {'AXIS': '#fbe2d7', 'CORE': '#e4e4e6', 'OPS': '#f4f4f6', 'INFRA': None}
RAIL = {'AXIS': '#eb6c36', 'CORE': '#2d3142', 'OPS': '#9ea6b3', 'INFRA': None}
tierbad, seen = [], set()
for g in re.finditer(r'<g class="tbl" data-name="([^"]+)">(.*?)</g>', svg, re.S):
    nm, body = g.group(1).split()[0], g.group(2)
    box = re.search(r'rx="6" fill="[^"]*" stroke="(#[0-9a-f]{6})"', body)
    tag = re.search(r'letter-spacing="0[.]08em">([A-Z]+)</text>', body)
    if not box or not tag:
        tierbad.append('%s: thieu vien hoac chip bac' % nm); continue
    want = TAGS.get(box.group(1))
    if want is None:
        tierbad.append('%s: mau vien %s khong thuoc bac nao' % (nm, box.group(1))); continue
    seen.add(want)
    if tag.group(1) != want:
        tierbad.append('%s: chip ghi "%s" nhung vien la bac %s' % (nm, tag.group(1), want))
    hasband = re.search(r'height="6" fill="(#[0-9a-f]{6})"', body)
    hasrail = re.search(r'width="4" height="\d+" fill="(#[0-9a-f]{6})"', body)
    if BAND[want] is None:
        if hasband: tierbad.append('%s: bac INFRA khong duoc co dai header' % nm)
        if hasrail: tierbad.append('%s: bac INFRA khong duoc co rail' % nm)
    else:
        if not hasband or hasband.group(1) != BAND[want]:
            tierbad.append('%s: bac %s thieu/sai dai header' % (nm, want))
        if not hasrail or hasrail.group(1) != RAIL[want]:
            tierbad.append('%s: bac %s thieu/sai rail trai' % (nm, want))
if 'TABLE</text>' in svg:
    tierbad.append('van con chip ghi TABLE - nhan giong nhau o moi bang la o trong')
leg = [x for x in TAGS.values() if (x + u' — ') in svg]
if len(leg) != 4:
    tierbad.append('chu giai chi day %d/4 bac: %s' % (len(leg), ', '.join(leg)))
if len(seen) != 4:
    tierbad.append('so do chi dung %d/4 bac' % len(seen))
if not tierbad:
    ok('4 bac bang deu du 3 kenh (dai header - rail - nhan chip), chu giai day du 4 bac: %s'
       % ', '.join(sorted(seen)))
else:
    bad('; '.join(tierbad[:6]))

# ---- 9 searchable text ----
texts = ' '.join(re.findall(r'<text[^>]*>([^<]*)</text>', svg))
for probe in ['assigned_coach_id','progress_note','can_join_adult_class','converted_to_course_id',
              'prioritize_extra_classes','external_session_block_id','old_value','is_oversize']:
    if probe not in texts: bad('Ctrl+F không tìm được: ' + probe); break
else: ok('Ctrl+F tìm được cột bất kỳ (mẫu 8 cột hiếm đều có trong <text>)')
if '<image' not in svg and 'textPath' not in svg: ok('không có ảnh/path thay chữ')

# ---- 10 JS off ----
if '<script' in src and 'display:none' not in src.split('<script')[0][-4000:]:
    ok('JS chỉ là lớp tăng cường — không có nội dung nào ẩn chờ JS bật')

# ---- 11 style gate ----
if 'box-shadow' not in src: ok('không có box-shadow')
else: bad('có box-shadow')
if 'JetBrains' not in src: ok('không dùng JetBrains Mono')
else: bad('dùng JetBrains Mono')
radii = set(re.findall(r'rx="(\d+)"', svg)) | set(re.findall(r'border-radius:\s*(\d+)px', src))
outb = [r for r in radii if not (0 <= int(r) <= 8)]
if not outb: ok('bo góc trong khoảng 0–8px: ' + ', '.join(sorted(radii, key=int)))
else: bad('bo góc ngoài khoảng: ' + ', '.join(outb))

# ---- 4 label masks ----
masks = len(re.findall(r'<rect[^>]*fill="#f5f5f5"/>', svg))
lbls = len(re.findall(r'letter-spacing="0.06em"', svg))
if masks >= lbls and lbls > 0: ok('%d nhãn đường nối, mỗi nhãn có 1 rect mask nền paper' % lbls)
else: warn('nhãn %d / mask %d — kiểm tra lại' % (lbls, masks))

# ---- 4b label mask must not be covered by a later-drawn table ----
head = svg[:svg.index('<g class="tbl"')]
badmask = []
for r in re.finditer(r'<rect x="(-?\d+)" y="(\d+)" width="(\d+)" height="12" rx="2" fill="#f5f5f5"/>', head):
    mx, my, mw = int(r.group(1)), int(r.group(2)), int(r.group(3))
    for (nm,bx1,by1,bx2,by2) in boxes:
        if min(mx+mw,bx2)-max(mx,bx1) > 0 and min(my+12,by2)-max(my,by1) > 0:
            badmask.append('mask (%d,%d) bị %s đè' % (mx,my,nm))
if not badmask: ok('mask nhãn không bị bảng vẽ sau đè lên')
else: bad('; '.join(badmask))

# ---- 4c label mask must clear its stroke by 6-10px ----
def rectdist(r1, r2):
    dx = max(r1[0]-r2[2], r2[0]-r1[2], 0.0)
    dy = max(r1[1]-r2[3], r2[1]-r1[3], 0.0)
    return (dx*dx+dy*dy) ** .5
segrects = [(min(a[0],a[2]), min(a[1],a[3]), max(a[0],a[2]), max(a[1],a[3])) for a in segs]
gaps, touching = [], []
for r in re.finditer(r'<rect x="(-?\d+)" y="(\d+)" width="(\d+)" height="12" rx="2" fill="#f5f5f5"/>', head):
    mx, my, mw = int(r.group(1)), int(r.group(2)), int(r.group(3))
    R = (mx, my, mx+mw, my+12)
    d = min(rectdist(R, sr) for sr in segrects)
    gaps.append(round(d, 1))
    if d < 6 or d > 10: touching.append('mask (%d,%d) cách nét %.1fpx' % (mx, my, d))
if not touching: ok('%d mask nhãn đều cách nét 6-10px (đo được: %s)' % (len(gaps), sorted(set(gaps))))
else: bad('; '.join(touching))

# ---- 4e arc sweep + displacement must match the turn ----
arcbad = []
for d in paths:
    toks = re.findall(r'([MVHa])\s*(-?[\d.]+(?:[ ,]+-?[\d.]+)*)', d)
    cx = cy = 0.0; head_v = None
    for cmd, arg in toks:
        n = [float(v) for v in re.split(r'[ ,]+', arg.strip()) if v]
        if cmd == 'M': cx, cy = n[0], n[1]
        elif cmd == 'V': head_v = (0.0, 1.0 if n[0] > cy else -1.0); cy = n[0]
        elif cmd == 'H': head_v = (1.0 if n[0] > cx else -1.0, 0.0); cx = n[0]
        elif cmd == 'a':
            rx, sweep, ddx, ddy = n[0], n[4], n[5], n[6]
            nxt = (ddx/rx - head_v[0], ddy/rx - head_v[1])
            if abs(abs(nxt[0])+abs(nxt[1]) - 1) > .01:
                arcbad.append('cung (%g,%g) không phải góc vuông 1/4' % (ddx, ddy)); continue
            z = head_v[0]*nxt[1] - head_v[1]*nxt[0]
            want = 1.0 if z > 0 else 0.0
            if sweep != want:
                arcbad.append('cung tại (%g,%g): sweep=%g nhưng khúc cua cần %g' % (cx, cy, sweep, want))
            cx += ddx; cy += ddy; head_v = nxt
if not arcbad: ok('mọi cung bo góc đúng chiều xoay và đúng 1/4 đường tròn')
else: bad('; '.join(arcbad))

# ---- 4d zone label must not collide with a connector lane ----
zc = []
for z in re.finditer(r'<text x="(\d+)" y="(\d+)"[^>]*letter-spacing="0.16em">([^<]+)</text>', svg):
    zx, zy, nm = int(z.group(1)), int(z.group(2)), z.group(3)
    zw = len(nm) * 6.4          # 8px mono + letter-spacing 0.16em
    for s2 in H:
        if min(s2[0],s2[2]) < zx+zw and max(s2[0],s2[2]) > zx and abs(s2[1]-(zy-3)) < 10:
            zc.append('%s vs lane y=%g' % (nm, s2[1]))
    for s2 in V:                # đường dọc cắt ngang chữ nhãn vùng (lỗi có từ v2, trước chỉ kiểm làn ngang)
        if zx - 4 < s2[0] < zx + zw + 4 and min(s2[1],s2[3]) < zy + 2 and max(s2[1],s2[3]) > zy - 10:
            zc.append('%s bị đường dọc x=%g cắt' % (nm, s2[0]))
if not zc: ok('nhãn vùng không đụng làn đường nối nào')
else: bad('; '.join(zc))

# ---- 8 legend strip ----
ly = re.search(r'<text x="40" y="(\d+)"[^>]*>CHÚ GIẢI</text>', svg)
maxy = max(b[4] for b in boxes)
if ly and int(ly.group(1)) > maxy: ok('chú giải là dải ngang dưới cùng (y=%s > đáy bảng %d)' % (ly.group(1), maxy))
else: bad('chú giải không nằm cuối')


# ---- 4f every loaded font family must ship the vietnamese subset ----
import subprocess
href = re.search(r'fonts\.googleapis\.com/css2\?([^"]+)"', src)
fams = []
if href:
    for part in href.group(1).split('&'):
        if part.startswith('family='):
            fams.append(part[len('family='):].split(':')[0])
declared = set(re.findall(r"font-family:\s*'([^']+)'", src)) | set(re.findall(r"font-family=\"'([^']+)'", svg))
generic = {'monospace','sans-serif','serif','Georgia','-apple-system','Segoe UI'}
unloaded = [d for d in declared if d not in generic and d.replace(' ','+') not in fams]
if not unloaded: ok('mọi font-family khai báo đều được nạp: %s' % ', '.join(sorted(fams)))
else: bad('font dùng nhưng không nạp: %s' % ', '.join(unloaded))

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')
novn, offline = [], False
for f in fams:
    try:
        out = subprocess.run(['curl','-s','-A',UA,
              'https://fonts.googleapis.com/css2?family=%s&display=swap' % f],
              capture_output=True, timeout=25).stdout.decode('utf8','replace')
    except Exception:
        offline = True; break
    if not out.strip(): offline = True; break
    if 'U+1EA0' not in out: novn.append(f)
if offline: warn('không kiểm tra được subset vietnamese (không có mạng) — phải kiểm tay')
elif novn: bad('font THIẾU subset vietnamese: %s' % ', '.join(novn))
else: ok('cả %d font đều có subset vietnamese (U+1EA0-1EF9)' % len(fams))

# ---- 4g stacked-diacritic smoke test ----
probes = ['Lược đồ', 'nghiệp vụ', 'huấn luyện']
missing = [t for t in probes if t not in src]
if not missing: ok('trang có sẵn chữ hai dấu chồng để soi mắt: %s' % ', '.join(probes[:3]))
else: warn('thiếu mẫu chữ hai dấu: %s' % ', '.join(missing))

print('\n'.join('  OK   ' + m for m in oks))
print('\n'.join('  WARN ' + m for m in warns))
print('\n'.join('  FAIL ' + m for m in fails))
print('\n%d OK · %d WARN · %d FAIL' % (len(oks), len(warns), len(fails)))
sys.exit(1 if fails else 0)
