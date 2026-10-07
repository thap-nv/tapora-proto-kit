# -*- coding: utf-8 -*-
"""M3 — DDL của một lần chạy có nạp được vào PostgreSQL thật không.

  python pg_load.py <thư-mục-chạy> [--json] [--keep] [--scripts DIR]

Dựng cụm PostgreSQL tạm (initdb trong thư mục tạm, cổng trống ngẫu nhiên), rồi:
  1 dbml2sql --postgres schema.dbml → nạp bằng psql, đếm lỗi
  2 chạy riêng từng câu SQL khai trong Note (CREATE [UNIQUE] INDEX · ALTER TABLE · CREATE EXTENSION · ALTER TYPE),
    mỗi câu một lần psql → chạy được / tổng
Rồi dừng cụm và xóa thư mục tạm. Không thấy PostgreSQL hay npx thì in "không đo" và thoát 0.

Đã cài sẵn btree_gist (EXCLUDE chống chồng lịch cần nó); câu nào của lần chạy tự khai CREATE EXTENSION vẫn được chạy.
Tách câu SQL khỏi lời văn bằng bộ quét cân ngoặc (`take_statement`): dừng ở `;`, ở dấu chấm hết câu ngoài ngoặc, hoặc (với CREATE INDEX/
EXTENSION, ALTER TYPE) ở cuối dòng. Bỏ câu giữ chỗ có `...`/`…`; câu còn chữ có dấu thì đếm là "không tách được", không tính lỗi.
"""
import glob
import io
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import tempfile

args = sys.argv[1:]
HERE = os.path.dirname(os.path.abspath(__file__))


def opt(flag, default=None):
    return args[args.index(flag) + 1] if flag in args and args.index(flag) + 1 < len(args) else default


sys.path.insert(0, opt('--scripts') or os.environ.get('DB_SCRIPTS') or os.path.join(HERE, 'lib'))
import dbml_model as dm  # noqa: E402

dm.utf8_stdout()

START = re.compile(r'(?i)\b(?:CREATE\s+EXTENSION|ALTER\s+TYPE|CREATE\s+(?:UNIQUE\s+)?INDEX|ALTER\s+TABLE)\b')


def take_statement(n, i, newline_ends):
    """Từ vị trí i, lấy tới `;` hoặc dấu chấm hết câu ở ngoài ngoặc; CREATE INDEX/EXTENSION/ALTER TYPE còn dừng ở cuối dòng
    (câu một mệnh đề, dòng sau là lời văn). ALTER TABLE nhiều dòng (EXCLUDE …) chỉ dừng ở `;` hay dấu chấm."""
    depth, j = 0, i
    while j < len(n):
        ch = n[j]
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        elif depth <= 0:
            if ch == ';':
                return n[i:j]
            if ch == '.' and (j + 1 >= len(n) or n[j + 1] in ' \t\r\n'):
                return n[i:j]
            if ch == '\n' and newline_ends:
                return n[i:j]
        j += 1
    return n[i:j]


def find_pg_bin():
    env = os.environ.get('PG_BIN')
    if env and os.path.isfile(os.path.join(env, 'initdb.exe')) or env and os.path.isfile(os.path.join(env, 'initdb')):
        return env
    w = shutil.which('initdb')
    if w:
        return os.path.dirname(w)
    c = sorted(glob.glob('C:/Program Files/PostgreSQL/*/bin'))
    return c[-1] if c else None


def exe(pgbin, name):
    p = os.path.join(pgbin, name)
    return p + '.exe' if os.name == 'nt' and os.path.isfile(p + '.exe') else p


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', **kw)


SQL_FK = re.compile(r'ALTER TABLE "(\w+)" ADD (?:CONSTRAINT "[^"]+" )?FOREIGN KEY \(([^)]*)\) REFERENCES "(\w+)"')


def fk_reversed(model, sql_text):
    """Ref của DBML mà SQL do dbml2sql sinh KHÔNG có khóa ngoại đúng chiều (bảng con · cột con · bảng cha).

    Lỗi đã gặp: Ref khai bằng `-` (1–1) bị sinh ngược — `a.x - b.id` thành `b.id REFERENCES a(x)`; nạp được vào CSDL rỗng
    nhưng buộc mọi dòng b phải có dòng a ngay từ đầu. Ref `>` và `<` không bị."""
    sql = set()
    for m in SQL_FK.finditer(sql_text):
        sql.add((m.group(1), tuple(c.strip().strip('"') for c in m.group(2).split(',')), m.group(3)))
    bad, total = [], 0
    for r in model['refs']:
        if r['kind'] == 'm2m':
            continue
        total += 1
        if (r['fk_table'], tuple(r['fk_cols']), r['pk_table']) not in sql:
            bad.append('{}({}) → {}'.format(r['fk_table'], ', '.join(r['fk_cols']), r['pk_table']))
    return bad, total


def run_quiet(cmd, **kw):
    """Chạy lệnh KHÔNG qua pipe: `pg_ctl start` sinh tiến trình postgres con thừa hưởng pipe, nên `subprocess.run(capture_output=True)`
    chờ mãi tới khi máy chủ tắt (đã treo 10 phút ở lần thử đầu). Kết quả đọc từ log."""
    return subprocess.run(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, **kw)


def free_port():
    s = socket.socket()
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port


def note_sql(model):
    """Các câu SQL khai trong Note (bảng, index, cột, project), theo thứ tự xuất hiện; bỏ câu giữ chỗ có '...'."""
    notes = [model['project'].get('note') or ''] if isinstance(model.get('project'), dict) else []
    for t in model['tables'].values():
        notes.append(t['note'] or '')
        notes += [ix['note'] or '' for ix in t['indexes']]
        notes += [c['note'] or '' for c in t['cols']]
    out, skipped, seen = [], [], set()
    for n in notes:
        for m in START.finditer(n):
            s = re.sub(r'\s+', ' ', take_statement(n, m.start(), bool(re.match(r'(?i)CREATE|ALTER\s+TYPE', m.group(0))))).strip()
            if '..' in s or '…' in s:
                continue                              # câu giữ chỗ ("CREATE UNIQUE INDEX ... ON"), không phải SQL thật
            s = s.rstrip(';').strip() + ';'
            if s in seen:
                continue
            seen.add(s)
            if re.search(r'[^\x00-\x7f]', s):         # còn chữ có dấu: không tách được câu SQL ra khỏi lời văn
                skipped.append(s[:90])
                continue
            out.append(s)
    out.sort(key=lambda s: (0 if re.match(r'(?i)CREATE EXTENSION', s) else 1 if re.match(r'(?i)ALTER TYPE', s) else 2 if re.match(r'(?i)CREATE (UNIQUE )?INDEX', s) else 3))
    return out, skipped


def main():
    paths = [a for a in args if not a.startswith('--') and os.path.isdir(a)]
    if not paths:
        print(__doc__)
        return 0
    schema = os.path.join(paths[0], 'docs', 'database', 'schema.dbml')
    res = {'run': os.path.basename(os.path.normpath(paths[0]))}
    pgbin = find_pg_bin()
    npx = shutil.which('npx') or shutil.which('npx.cmd')
    if not os.path.isfile(schema) or not pgbin or not npx:
        res['measured'] = False
        res['why'] = 'không thấy schema.dbml' if not os.path.isfile(schema) else ('không thấy PostgreSQL' if not pgbin else 'không thấy npx')
        print(json.dumps(res, ensure_ascii=False) if '--json' in args else 'M3 DDL trên PostgreSQL: không đo — ' + res['why'])
        return 0
    model = dm.load(schema)
    tmp = tempfile.mkdtemp(prefix='pgload_')
    port = free_port()
    data = os.path.join(tmp, 'data')
    started = False
    try:
        shutil.copyfile(schema, os.path.join(tmp, 'schema.dbml'))
        g = run([npx, '-y', '-p', '@dbml/cli', 'dbml2sql', 'schema.dbml', '--postgres', '-o', 'out.sql'], cwd=tmp, timeout=240)
        sql_path = os.path.join(tmp, 'out.sql')
        if g.returncode != 0 or not os.path.isfile(sql_path):
            res.update(measured=True, dbml2sql_ok=False, ddl_errors=None, ddl_statements=None, note_ok=0, note_total=0,
                       errors=[(g.stderr or g.stdout)[-300:]])
        else:
            i = run([exe(pgbin, 'initdb'), '-D', data, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--locale=C'], timeout=240)
            if i.returncode != 0:
                res.update(measured=False, why='initdb lỗi: ' + (i.stderr or i.stdout)[-200:])
                raise RuntimeError(res['why'])
            started = True      # đặt trước: lỗi giữa chừng vẫn phải chạy pg_ctl stop ở finally
            s = run_quiet([exe(pgbin, 'pg_ctl'), '-D', data, '-o', '-p {} -c listen_addresses=127.0.0.1 -c fsync=off'.format(port),
                           '-l', os.path.join(tmp, 'pg.log'), '-w', 'start'], timeout=120)
            if s.returncode != 0:
                with io.open(os.path.join(tmp, 'pg.log'), encoding='utf-8', errors='replace') as f:
                    res.update(measured=False, why='pg_ctl start lỗi: ' + f.read()[-200:])
                raise RuntimeError(res['why'])
            base = [exe(pgbin, 'psql'), '-h', '127.0.0.1', '-p', str(port), '-U', 'postgres', '-d', 'postgres', '-X', '-q']
            run(base + ['-c', 'CREATE EXTENSION IF NOT EXISTS btree_gist'], timeout=60)
            ver = run(base + ['-At', '-c', 'SHOW server_version'], timeout=60).stdout.strip()
            p = run(base + ['-v', 'ON_ERROR_STOP=0', '-f', sql_path], timeout=240)
            errs = [ln.strip() for ln in (p.stderr or '').splitlines() if 'ERROR:' in ln]
            with io.open(sql_path, encoding='utf-8') as f:
                sql_text = f.read()
            n_stmt = sql_text.count(';\n')
            rev, n_refs = fk_reversed(model, sql_text)
            stm, skipped = note_sql(model)
            ok, bad = 0, []
            for k, q in enumerate(stm):
                qf = os.path.join(tmp, 'q{}.sql'.format(k))
                with io.open(qf, 'w', encoding='utf-8') as f:
                    f.write(q + '\n')
                r = run(base + ['-v', 'ON_ERROR_STOP=1', '-f', qf], timeout=120, env=dict(os.environ, PGCLIENTENCODING='UTF8'))
                if r.returncode == 0:
                    ok += 1
                else:
                    bad.append('{} → {}'.format(q[:90], next((ln.strip() for ln in (r.stderr or '').splitlines() if 'ERROR:' in ln), '?')[:120]))
            res.update(measured=True, version=ver, dbml2sql_ok=True, ddl_statements=n_stmt, ddl_errors=len(errs),
                       note_total=len(stm), note_ok=ok, note_skipped=len(skipped), fk_reversed=len(rev), fk_total=n_refs,
                       errors=errs[:5] + bad[:8] + ['FK sinh ngược chiều: ' + x for x in rev[:6]])
    except RuntimeError:
        pass
    finally:
        if started:
            run_quiet([exe(pgbin, 'pg_ctl'), '-D', data, '-m', 'immediate', '-w', 'stop'], timeout=120)
        if '--keep' not in args and os.path.basename(tmp).startswith('pgload_') and os.path.dirname(os.path.abspath(tmp)) == os.path.abspath(tempfile.gettempdir()):
            shutil.rmtree(tmp, ignore_errors=True)
    if '--json' in args:
        print(json.dumps(res, ensure_ascii=False))
    elif not res.get('measured'):
        print('M3 DDL trên PostgreSQL: không đo — ' + res.get('why', '?'))
    elif not res.get('dbml2sql_ok'):
        print('M3 DDL trên PostgreSQL: dbml2sql LỖI — ' + ' | '.join(res['errors']))
    else:
        print('M3 DDL trên PostgreSQL {}: {} lỗi / {} câu DDL · SQL trong Note chạy được {}/{} (không tách được: {}) · FK sinh ngược chiều {}/{}'.format(
            res['version'], res['ddl_errors'], res['ddl_statements'], res['note_ok'], res['note_total'], res.get('note_skipped', 0),
            res['fk_reversed'], res['fk_total']))
        for e in res['errors']:
            print('   ' + e)
    return 0


if __name__ == '__main__':
    sys.exit(main())
