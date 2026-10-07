# -*- coding: utf-8 -*-
"""Thước chấm db-rv1 phải phân biệt báo cáo tốt với báo cáo chung chung, và bắt được việc sửa file chỉ-đọc."""
import hashlib
import json
import os
import shutil
import tempfile
import unittest

import score_review as sr

G = sr.load_golden()

GOOD = """
# SOÁT SCHEMA v4.4
56 bảng · 612 cột · 37 enum · 211 ref · 109 index

### 1.1 · 211 khóa ngoại chưa khai hành vi xóa — DB-INT-05
cả 211 ref inline, 0 `delete:`; 46 mới, 165 cũ.

### 1.2 · Khóa ngoại ghép chỉ có trên giấy — DB-INT-12 · DB-MOD-14
33 ghi chú viết composite FK để chặn lệch tenant, nhưng schema có 0 Ref nhiều cột.

### 1.3 · DB-IDX-01
users.role_id, role_permissions.permission_id, coach_certificates.certificate_type_id chưa có index.

### 1.4 · roles
organization_id NULL cho dòng master, hai unique coi NULL là khác nhau (DB-INT-09) nên chèn hai master vẫn lọt.

### Phản biện
USE-CASE còn viết can_check_in, cột này đã bỏ ở v4.4.
"""

GENERIC = """
# SOÁT SCHEMA
Schema nhìn chung tốt. Có một số khóa ngoại cần index và một số rule cần xem lại. Nên làm trước các việc cơ học.
"""


def make_run(tmp, mutate=None):
    d = os.path.join(tmp, 'run')
    os.makedirs(os.path.join(d, 'docs', 'database', '_check'))
    for rel in G['read_only_sha256']:
        p = os.path.join(d, 'docs', 'database', *rel.split('/'))
        with open(p, 'w', encoding='utf-8') as f:
            f.write('x')
    return d


class ScoreReview(unittest.TestCase):
    def test_a_report_with_all_five_findings_scores_5_of_5(self):
        core, extra, miss, odd = sr.score_text(GOOD, G)
        self.assertEqual({'G1', 'G2', 'G3', 'G4', 'G5'}, {k for k, v in core.items() if v})
        self.assertEqual([], miss)
        self.assertEqual([], odd)

    def test_a_generic_report_scores_0_and_misses_the_numbers(self):
        core, extra, miss, odd = sr.score_text(GENERIC, G)
        self.assertEqual(0, sum(core.values()))
        self.assertEqual(['56 bảng', '612 cột'], miss)

    def test_each_finding_needs_its_own_evidence_not_just_the_rule_name(self):
        only_rule = 'DB-INT-05 DB-IDX-01 DB-INT-12 và roles, master.'
        core, *_ = sr.score_text(only_rule, G)
        self.assertFalse(core['G1'] or core['G3'] or core['G4'] or core['G5'])

    def test_g4_needs_three_named_columns(self):
        two = 'DB-IDX-01: users.role_id và persons.age_group_id chưa có index.'
        three = two + ' Thêm students.customer_source_id.'
        self.assertFalse(sr.score_text(two, G)[0]['G4'])
        self.assertTrue(sr.score_text(three, G)[0]['G4'])

    def test_a_strange_table_count_in_the_head_is_flagged(self):
        core, extra, miss, odd = sr.score_text('Schema: 99 bảng · 5 cột; 45 bảng S trong cỡ bảng; 56 bảng · 612 cột', G)
        self.assertEqual([99], odd)

    def test_read_only_check_catches_an_edited_file(self):
        tmp = tempfile.mkdtemp(prefix='dbrv_')
        try:
            d = make_run(tmp)
            # băm của file giả 'x' không khớp băm thật → mọi file bị coi là đã sửa
            self.assertEqual(sorted(G['read_only_sha256']), sorted(sr.read_only(d, G)))
            # đổi băm kỳ vọng thành băm của 'x' thì sạch; sửa một file thì bắt đúng file đó
            g2 = json.loads(json.dumps(G))
            for k in g2['read_only_sha256']:
                g2['read_only_sha256'][k] = hashlib.sha256(b'x').hexdigest()
            self.assertEqual([], sr.read_only(d, g2))
            with open(os.path.join(d, 'docs', 'database', 'schema.dbml'), 'w', encoding='utf-8') as f:
                f.write('đổi')
            self.assertEqual(['schema.dbml'], sr.read_only(d, g2))
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    unittest.main()
