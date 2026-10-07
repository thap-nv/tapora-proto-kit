# -*- coding: utf-8 -*-
"""Test hồi quy cho bộ chấm db-r1: điểm tự động phải bằng điểm chấm tay ghi ở expected.json.

  python -m unittest test_score -v            (chạy ở thư mục db-r1/)
  RUN_PG=1 python -m unittest test_score -v   (thêm M3: dựng PostgreSQL tạm, mỗi lần ~12 giây)

Bốn lần chạy 07/10/2026 (../runs-db-r1/) cùng `score-tests/tot` và `naive` là dữ liệu hồi quy. Sửa score.py mà một bẫy lệch điểm tay
thì phải sửa score.py, không sửa expected.json. Đổi expected.json chỉ khi có điểm chấm tay mới, kèm lý do ở README.
"""
import json
import os
import re
import subprocess
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
EXP = json.load(open(os.path.join(HERE, 'expected.json'), encoding='utf-8'))
KEY = os.path.join(HERE, 'key.json')


def run_json(script, *a):
    p = subprocess.run([sys.executable, os.path.join(HERE, script)] + list(a), capture_output=True, text=True,
                       encoding='utf-8', cwd=HERE, env=dict(os.environ, PYTHONIOENCODING='utf-8'))
    return json.loads(p.stdout), p


class ScoreRuns(unittest.TestCase):
    def test_each_trap_matches_hand_score(self):
        for name, e in EXP['runs'].items():
            with self.subTest(run=name):
                if not os.path.isdir(os.path.join(HERE, e['dir'])):
                    self.skipTest('thiếu thư mục ' + e['dir'])
                j, _ = run_json('score.py', KEY, e['dir'], '--json')
                got = {t['id']: t['ket_qua'] for t in j['traps']}
                want = {t: e['except'].get(t, e['default']) for t in got}
                self.assertEqual(want, got)
                self.assertEqual(e['tally'], j['tally'])

    def test_quality_measures_pinned(self):
        for name, e in EXP['runs'].items():
            if 'quality' not in e:
                continue
            with self.subTest(run=name):
                j, _ = run_json('score.py', KEY, e['dir'], '--json')
                q = j['quality']
                for k in ('M1', 'M2', 'M4'):
                    got = {x: q[k][x] for x in e['quality'][k]}
                    self.assertEqual(e['quality'][k], got, k)
                self.assertEqual(e['quality']['M5']['over_blocked'], q['M5']['over_blocked'])
                self.assertEqual(e['quality']['M5']['not_built'], len(q['M5']['not_built_ok']))

    def test_exit_zero_and_output_is_text(self):
        _, p = run_json('score.py', KEY, EXP['runs']['rdc1']['dir'], '--json')
        self.assertEqual(0, p.returncode)


class Segments(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import score
        cls.score = score

    def test_code_does_not_match_longer_number(self):
        s = self.score
        self.assertEqual([], s.segments('| N-160 | xong |', s.code_pat('N-16')))
        self.assertEqual(1, len(s.segments('| N-16 | xong |', s.code_pat('N-16'))))

    def test_heading_section_runs_to_next_heading(self):
        s = self.score
        txt = '### Q-14 · N-19 bảng riêng\nnguồn: x\nđã làm: giữ một bảng\n### Q-15 · N-03\nkhác'
        seg = s.segments(txt, s.code_pat('N-19'))
        self.assertEqual(1, len(seg))
        self.assertIn('giữ một bảng', seg[0])
        self.assertNotIn('Q-15', seg[0])

    def test_table_row_is_one_line_and_starts_at_match(self):
        s = self.score
        txt = '| N-16 | đã hỏi: Q-03 |\n| N-17 | đã hỏi: Q-04 |'
        seg = s.segments(txt, s.code_pat('N-16'))
        self.assertEqual(['| N-16 | đã hỏi: Q-03 |'], seg)

    def test_expression_unique_counts_as_column(self):
        s = self.score
        import dbml_model as dm
        m = dm.parse('Table services {\n  id uuid [pk]\n  organization_id uuid\n  code text\n  indexes {\n    (organization_id, `lower(code)`) [unique]\n  }\n}')
        sets = s.uniq_sets_norm(m['tables']['services'])
        self.assertIn(('organization_id', 'code'), sets)


@unittest.skipUnless(os.environ.get('RUN_PG') == '1', 'đặt RUN_PG=1 để dựng PostgreSQL tạm')
class PgLoad(unittest.TestCase):
    def test_ddl_errors_match(self):
        for name, want in EXP['pg'].items():
            with self.subTest(run=name):
                j, _ = run_json('pg_load.py', EXP['runs'][name]['dir'], '--json')
                if not j.get('measured'):
                    self.skipTest(j.get('why', 'không đo'))
                self.assertEqual(want, {'ddl_errors': j['ddl_errors'], 'fk_reversed': j['fk_reversed']})


if __name__ == '__main__':
    unittest.main()
