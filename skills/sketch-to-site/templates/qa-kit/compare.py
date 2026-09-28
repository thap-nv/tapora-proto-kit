# So kết quả 2 lần chạy run_all.py (hai thư mục có <bộ>/report.json), theo từng bước của từng bộ.
# Chạy từ thư mục prototype:  python _qa/compare.py _qa/last-green/<theme> _qa/handover/<ngày-giờ>/<theme>
# In: bộ mới, bộ mất, bước cũ bị mất, bước có giá trị check đổi, lỗi console và tràn ngang mới.
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')
a_dir, b_dir = sys.argv[1], sys.argv[2]


def load(d):
    out = {}
    for name in sorted(os.listdir(d)):
        f = os.path.join(d, name, 'report.json')
        if os.path.exists(f):
            out[name] = json.load(open(f, encoding='utf-8'))
    return out


A, B = load(a_dir), load(b_dir)
print('Bộ chỉ có ở sau:', [k for k in B if k not in A])
print('Bộ chỉ có ở trước:', [k for k in A if k not in B])
tot = {'steps_a': 0, 'steps_b': 0, 'lost': 0, 'changed': 0, 'err_new': 0, 'over_new': 0}
for k in A:
    if k not in B:
        continue
    ra = {s['step']: s for s in A[k]}
    rb = {s['step']: s for s in B[k]}
    tot['steps_a'] += len(A[k]) - 1
    tot['steps_b'] += len(B[k]) - 1
    lost = [n for n in ra if n not in rb]
    changed = [(n, ra[n].get('check'), rb[n].get('check')) for n in ra if n in rb and ra[n].get('check') != rb[n].get('check')]
    err = [(n, rb[n]['errors']) for n in rb if rb[n]['errors'] and not (n in ra and ra[n]['errors'])]
    over = [n for n in rb if rb[n].get('dims') and rb[n]['dims']['sw'] > rb[n]['dims']['cw'] and not (n in ra and ra[n].get('dims') and ra[n]['dims']['sw'] > ra[n]['dims']['cw'])]
    tot['lost'] += len(lost); tot['changed'] += len(changed); tot['err_new'] += len(err); tot['over_new'] += len(over)
    if lost or changed or err or over:
        print(f'== {k}: {len(A[k]) - 1} → {len(B[k]) - 1} bước')
        for n in lost: print('   mất bước', n)
        for n, x, y in changed: print('   đổi check', n, '|', str(x)[:160], '→', str(y)[:160])
        for n, e in err: print('   lỗi console mới', n, e[:2])
        for n in over: print('   tràn ngang mới', n)
print('Tổng (các bộ có ở cả hai):', tot)
