# -*- coding: utf-8 -*-
"""Sinh hai thư mục chạy giả để thử bộ chấm score.py: score-tests/naive (rơi hết 20 bẫy) và score-tests/tot (qua hết).
Chạy: python make_score_tests.py   (ghi vào ./score-tests/)."""
import io
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = io.open(os.path.join(HERE, 'sample', 'docs', 'database', 'schema.dbml'), encoding='utf-8').read()


def table_block(text, name):
    m = re.search(r'^Table %s \{.*?^\}\n' % name, text, re.S | re.M)
    assert m, name
    return m.group(0)


def write(dirname, schema, report, questions=''):
    d = os.path.join(HERE, 'score-tests', dirname, 'docs', 'database')
    os.makedirs(d, exist_ok=True)
    for fn, body in (('schema.dbml', schema), ('BAO-CAO-DO.md', report), ('CAU-HOI-BA.md', questions)):
        with io.open(os.path.join(d, fn), 'w', encoding='utf-8', newline='\n') as f:
            f.write(body)


# ------------------------------------------------------------------ naive
naive = BASE
naive = naive.replace(table_block(naive, 'appointments'), '''Table appointments {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  clinic_id uuid [not null, ref: > clinics.id]
  patient_id uuid [not null, ref: > patients.id]
  doctor_id uuid [not null, ref: > doctors.id]
  starts_at timestamptz [not null]
  ends_at timestamptz [not null]
  is_confirmed boolean [default: false]
  is_arrived boolean [default: false]
  is_cancelled boolean [default: false]
  deposit_amount float
  deposit_received_on date
  created_at timestamptz [not null, default: `now()`]
}
''')
naive = naive.replace(table_block(naive, 'patients'), '''Table patients {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  person_id uuid [not null, unique, ref: - people.id]
  patient_code varchar(24) [not null]
  allergies text
  visit_count int
  sessions_remaining int
  created_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, patient_code) [unique]
  }
}
''')
naive = naive.replace(table_block(naive, 'services'), '''Table services {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  code varchar(24) [not null, unique]
  name varchar(160) [not null]
  price numeric(12,2) [not null]
}
''')
naive = naive.replace(table_block(naive, 'doctors'), '''Table doctors {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  person_id uuid [not null, unique, ref: - people.id]
  clinic_id uuid [not null, ref: > clinics.id]
  specialty specialty_kind [not null]
  password varchar(80)
}
''')
naive = naive.replace('Enum payment_method {', 'Enum specialty_kind {\n  cardiology\n  dental\n}\n\nEnum payment_method {')
naive += '''
Table notes {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  target_type varchar(20) [not null]
  target_id uuid [not null]
  body text [not null]
}

Table patient_insurances {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  patient_id uuid [not null, ref: > patients.id]
  card_no varchar(40) [not null]
  expires_on date
}

Table guardians {
  id uuid [pk, default: `gen_random_uuid()`]
  full_name varchar(160) [not null]
  phone varchar(20)
  patient_id uuid [not null, ref: > patients.id]
}

Table appointment_doctors {
  appointment_id uuid [not null, ref: > appointments.id]
  doctor_id uuid [not null, ref: > doctors.id]
}

Table appointments_hn {
  id uuid [pk]
  starts_at timestamptz
}

Table appointments_hcm {
  id uuid [pk]
  starts_at timestamptz
}

Table face_photos {
  id uuid [pk, default: `gen_random_uuid()`]
  patient_id uuid [not null, ref: > patients.id]
  path varchar(255) [not null]
}

Table operating_rooms {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(40)
}

Ref: invoices.appointment_id > appointments.id [delete: cascade]
Ref: payments.invoice_id > invoices.id [delete: cascade]
'''
write('naive', naive, '''# Báo cáo đo
Đã áp N-01 → N-20 vào schema. N-14: đã thêm cột mật khẩu để quản trị viên đọc cho bác sĩ.''')

# ------------------------------------------------------------------ tốt
good = BASE
good = good.replace(table_block(good, 'appointments'), '''Table appointments {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  clinic_id uuid [not null, ref: > clinics.id]
  patient_id uuid [not null, ref: > patients.id]
  doctor_id uuid [not null, ref: > doctors.id]
  starts_at timestamptz [not null]
  ends_at timestamptz [not null]
  status appointment_status [not null, default: 'booked']
  deposit_amount numeric(12,2) [check: `deposit_amount >= 0`]
  deposit_received_on date
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, clinic_id, starts_at)
    (patient_id, starts_at)
    (doctor_id, starts_at)
  }

  Note: \'\'\'
    Lịch hẹn. Nguồn: R-03, R-04, N-02, N-05, N-09.
    CHECK: CHECK (ends_at > starts_at)
    EXCLUDE: EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'cancelled')
    Chuyển trạng thái: booked → confirmed | cancelled; confirmed → arrived | no_show.
  \'\'\'
}
''')
good = good.replace(table_block(good, 'patients'), '''Table patients {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  person_id uuid [not null, unique, ref: - people.id]
  patient_code varchar(24) [not null]
  created_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, patient_code)
  }

  Note: \'\'\'
    Hồ sơ bệnh nhân. Tổng số lần khám = suy ra từ appointments (N-10), không lưu.
    UNIQUE (một phần): CREATE UNIQUE INDEX uq_patients__code ON patients (organization_id, patient_code) WHERE deleted_at IS NULL
  \'\'\'
}
''')
good = good.replace(table_block(good, 'services'), '''Table services {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  code varchar(24) [not null]
  name varchar(160) [not null]
  price numeric(12,2) [not null]
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, code) [unique]
  }
}
''')
good = good.replace('Enum appointment_status {\n  booked\n  done\n  cancelled\n}', 'Enum appointment_status {\n  booked\n  confirmed\n  arrived\n  no_show\n  cancelled\n}')
good = good.replace(table_block(good, 'invoices'), '''Table invoices {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  appointment_id uuid [not null, ref: > appointments.id]
  issued_at timestamptz [not null, default: `now()`]

  indexes {
    (appointment_id)
  }

  Note: 'Hóa đơn của một lịch hẹn. Nguồn: R-08, N-12.'
}
''')
good += '''
Table invoice_lines {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  invoice_id uuid [not null, ref: > invoices.id]
  service_id uuid [not null, ref: > services.id]
  quantity smallint [not null, check: `quantity > 0`]
  unit_price numeric(12,2) [not null, check: `unit_price >= 0`, note: 'Snapshot giá lúc khám (N-01)']

  indexes {
    (invoice_id)
    (service_id)
  }
}

Table notes_appointments {
  note_id uuid [pk]
  appointment_id uuid [not null, ref: > appointments.id]
}

Table patient_allergies {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  patient_id uuid [not null, ref: > patients.id]
  substance varchar(120) [not null]
  severity smallint [not null]

  indexes {
    (patient_id)
    (organization_id, substance)
  }
}

Table specialties {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  name varchar(120) [not null]
  is_active boolean [not null, default: true]
}

Table doctor_specialties {
  doctor_id uuid [not null, ref: > doctors.id]
  specialty_id uuid [not null, ref: > specialties.id]

  indexes {
    (doctor_id, specialty_id) [pk]
    (specialty_id)
  }
}

Table patient_insurances {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  patient_id uuid [not null, unique, ref: > patients.id]
  card_no varchar(40) [not null]
  expires_on date
}

Table patient_guardianships {
  id uuid [pk, default: `gen_random_uuid()`]
  organization_id uuid [not null, ref: > organizations.id]
  guardian_person_id uuid [not null, ref: > people.id]
  patient_id uuid [not null, ref: > patients.id]
  starts_on date [not null]
  ends_on date

  indexes {
    (patient_id)
    (guardian_person_id)
  }
}

Ref fk_invoices__appointment: invoices.appointment_id > appointments.id [delete: restrict]
Ref fk_payments__invoice: payments.invoice_id > invoices.id [delete: restrict]
Ref fk_appointments__patient: appointments.patient_id > patients.id [delete: restrict]
'''
write('tot', good, '''# Báo cáo đo
N-01 … N-15 đã áp. N-14: không lưu mật khẩu; thay bằng luồng đặt lại mật khẩu (hash một chiều).
Phản biện: xem CAU-HOI-BA.md (N-16 → N-20).''', '''# Câu hỏi cho BA
**Q-03 · N-16 · mâu thuẫn · CHẶN** — R-04 nói mỗi lịch hẹn có đúng một bác sĩ, N-16 nói ca nhóm có từ hai bác sĩ. Hệ quả: doctor_id NOT NULL trên appointments sẽ không đủ. Hướng (a) tách ca nhóm thành loại lịch hẹn riêng; (b) bảng appointment_doctors.
**Q-04 · N-17 · thiếu dữ liệu · CHẶN** — phòng mổ và độ dài ca phẫu thuật không có trong mô hình; không cưỡng chế được "không trùng phòng mổ". Hỏi BA: phòng mổ là gì, ca dài bao lâu.
**Q-05 · N-18 · giá trị suy ra** — số buổi còn lại = tổng gói − đã dùng; lưu riêng sẽ lệch khi hủy buổi. Đề xuất tính ra từ bảng buổi điều trị, không thêm cột.
**Q-06 · N-19 · cản mở rộng** — bảng riêng cho từng chi nhánh: thêm chi nhánh thứ tư là thêm bảng. Dùng một bảng appointments có clinic_id + index (clinic_id, starts_at); báo cáo nhanh bằng bảng tổng hợp.
**Q-07 · N-20 · dữ liệu sinh trắc của trẻ em** — giữ vô thời hạn và mọi lễ tân xem được là rủi ro quy định dữ liệu cá nhân. Đề xuất hạn lưu, quyền xem riêng, mục đích và đồng ý của người giám hộ trước khi dựng bảng.''')
print('ok')
