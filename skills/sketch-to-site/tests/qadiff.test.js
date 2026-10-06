// Kiểm hàm so mốc qa-kit/qadiff.py (Python, không cần trình duyệt). Chạy: node --test skills/sketch-to-site/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const QAKIT = path.resolve(__dirname, '..', 'templates', 'qa-kit');
const PY = String.raw`
import json, sys
sys.path.insert(0, sys.argv[1])
import qadiff as D

def rep(contrast=None, intent=None, deep=None, steps=('view',), deep_errors=(), codes=None):
    out = [{'step': 'load', 'errors': [], 'check': None, 'dims': None}]
    for s in steps:
        dims = {'sw': 100, 'cw': 100, 'cut': []}
        if contrast is not None: dims['contrast'] = contrast
        if intent is not None: dims['intent'] = intent
        if codes is not None: dims['codes'] = codes
        out.append({'step': s, 'errors': [], 'check': 'T', 'dims': dims})
    if deep is not None:
        out.append({'step': 'deep', 'errors': list(deep_errors), 'check': None, 'dims': None, 'deep': deep})
    return out

A = 'span.chip "Điện lạnh" 3.95<4.5 (#FFFFFF trên #D7581F)'
A2 = 'span.chip "Điện lạnh" 3.91<4.5 (#FFFFFF trên #D8591F)'
EMPTY = {'states': [], 'keyboard': [], 'interactive': []}
# Chip ở header dùng chung: có trong mốc của bộ khác (số đo lệch chút); dòng A chưa có ở đâu
CHIP = 'a.chip "Gọi thợ" 3.84<4.5 (#FFFFFF trên #E06A2B)'
CHIP2 = 'a.chip "Gọi thợ" 3.86<4.5 (#FFFFFF trên #E06B2B)'
KNOWN = D.known_lines([rep(contrast=[CHIP]), rep(contrast=[], deep=EMPTY, deep_errors=['EXC lỗi cũ'])])
# Nợ cũ in gộp: cùng một chip ở 3 chỗ (lệch số đo) là một mục ×3; 25 dòng bàn phím thì in 20 và đuôi "còn 5 mục"
ROWS = [('light', 'a-1440', 'view', 'contrast', CHIP), ('dark', 'a-390', 'view', 'contrast', CHIP2), ('light', 'b-1440', 'mo', 'contrast', CHIP)]
ROWS += [('light', 'a-1440', 'deep', 'keyboard', 'không Tab tới được a "mục %d"' % i) for i in range(25)]
G = D.group_debt(ROWS)
print(json.dumps({
    'debt_count': D.debt_count(G),
    'debt_lines': D.debt_lines(G),
    'new_suite': D.diff_report(None, rep(contrast=[A]), 's'),
    'old_kit': D.diff_report(rep(), rep(contrast=[A], intent=[]), 's'),
    'jitter': D.diff_report(rep(contrast=[A]), rep(contrast=[A2]), 's'),
    'really_new': D.diff_report(rep(contrast=[]), rep(contrast=[A]), 's'),
    'quick_vs_green': D.diff_report(rep(contrast=[], deep=EMPTY), rep(contrast=[]), 's'),
    'deep_new': D.diff_report(rep(contrast=[], deep=EMPTY), rep(contrast=[], deep=dict(EMPTY, keyboard=['không Tab tới được button.x'])), 's'),
    'deep_debt': D.diff_report(rep(contrast=[]), rep(contrast=[], deep=dict(EMPTY, keyboard=['k'])), 's'),
    'known_new_suite': D.diff_report(None, rep(contrast=[CHIP2, A]), 's', known=KNOWN),
    'known_deep_err': D.diff_report(None, rep(contrast=[], deep=EMPTY, deep_errors=['EXC lỗi cũ', 'EXC lỗi mới']), 's', known=KNOWN),
    'deep_err_new': D.diff_report(rep(contrast=[], deep=EMPTY, deep_errors=['EXC a']), rep(contrast=[], deep=EMPTY, deep_errors=['EXC a', 'EXC b']), 's'),
    'deep_err_old_kit': D.diff_report(rep(contrast=[]), rep(contrast=[], deep=EMPTY, deep_errors=['EXC a']), 's'),
    'codes_new': D.diff_report(rep(contrast=[], codes=[]), rep(contrast=[], codes=['p: «UC-12»']), 's'),
    'codes_old_kit': D.diff_report(rep(contrast=[]), rep(contrast=[], codes=['p: «UC-12»']), 's'),
    'codes_label': D.debt_lines(D.group_debt([('light', 'a-1440', 'view', 'codes', 'p: «UC-12»')])),
}, ensure_ascii=False))
`;

const R = (() => {
  const r = spawnSync(PYTHON, ['-c', PY, QAKIT], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
})();
const A = 'span.chip "Điện lạnh" 3.95<4.5 (#FFFFFF trên #D7581F)';

test('bộ mới (chưa có mốc): mọi dòng là mới, không có nợ cũ', () => {
  assert.deepEqual(R.new_suite.contrast_new, [['view', A]]);
  assert.deepEqual(R.new_suite.debt, []);
});

test('mốc do bộ kiểm cũ ghi (chưa đo tương phản): dòng là nợ cũ, không phải lỗi mới', () => {
  assert.deepEqual(R.old_kit.contrast_new, []);
  assert.deepEqual(R.old_kit.debt, [['view', 'contrast', A]]);
});

test('lệch số nhỏ giữa hai lần chạy (tỉ lệ, mã màu) không tính là lỗi mới', () => {
  assert.deepEqual(R.jitter.contrast_new, []);
});

test('mốc đã đo mà lần này có dòng mới: lỗi mới', () => {
  assert.deepEqual(R.really_new.contrast_new, [['view', A]]);
});

test('kiểm nhanh không chạy lượt sâu: bước deep của mốc không thành bước mất, không thành lỗi', () => {
  assert.deepEqual(R.quick_vs_green.lost, []);
  assert.deepEqual(R.quick_vs_green.new, []);
  assert.deepEqual(R.quick_vs_green.keyboard_new, []);
  assert.deepEqual(R.quick_vs_green.debt, []);
});

test('lượt sâu: dòng mới so với mốc đã có lượt sâu là lỗi mới; mốc chưa có lượt sâu là nợ cũ', () => {
  assert.deepEqual(R.deep_new.keyboard_new, [['deep', 'không Tab tới được button.x']]);
  assert.deepEqual(R.deep_debt.debt, [['deep', 'keyboard', 'k']]);
});

test('bộ mới (chưa có mốc): dòng đã có trong mốc ở bộ khác là nợ cũ; dòng chưa có ở đâu vẫn là mới', () => {
  assert.deepEqual(R.known_new_suite.debt, [['view', 'contrast', 'a.chip "Gọi thợ" 3.86<4.5 (#FFFFFF trên #E06B2B)']]);
  assert.deepEqual(R.known_new_suite.contrast_new, [['view', A]]);
  assert.deepEqual(R.known_deep_err.debt, [['deep', 'deep_errors', 'EXC lỗi cũ']]);
  assert.deepEqual(R.known_deep_err.deep_errors_new, [['deep', 'EXC lỗi mới']]);
});

test('lỗi console của lượt sâu: mốc có lượt sâu thì lỗi chưa có trong mốc là mới; mốc chưa có lượt sâu thì là nợ cũ', () => {
  assert.deepEqual(R.deep_err_new.deep_errors_new, [['deep', 'EXC b']]);
  assert.deepEqual(R.deep_err_new.debt, []);
  assert.deepEqual(R.deep_err_old_kit.deep_errors_new, []);
  assert.deepEqual(R.deep_err_old_kit.debt, [['deep', 'deep_errors', 'EXC a']]);
});

test('nợ cũ in gộp: một mục mỗi dòng kèm ×n và chỗ đầu tiên; mỗi phép đo tối đa 20 dòng, có đuôi "còn n mục"', () => {
  assert.equal(R.debt_count, 26);
  const L = R.debt_lines;
  assert.deepEqual(L.slice(0, 3), ['  tương phản (1):', '    a.chip "Gọi thợ" 3.84<4.5 (#FFFFFF trên #E06A2B) ×3 · light/a-1440 · view', '  bàn phím (25):']);
  assert.equal(L.length, 24);
  assert.equal(L[L.length - 1], '    … còn 5 mục');
});

// Mã tham chiếu trên trang đã render (probes.js codes, chỉ số 7 của sketch-to-map): mới thì chặn như tương phản;
// mốc do bộ kiểm cũ ghi (chưa đo codes) thì là nợ cũ, không làm dự án đang chạy bỗng đỏ
test('codes: dòng mới so với mốc là mới; mốc chưa đo codes thì là nợ cũ; nợ cũ in nhãn "mã lộ"', () => {
  assert.deepEqual(R.codes_new.codes_new, [['view', 'p: «UC-12»']]);
  assert.deepEqual(R.codes_old_kit.codes_new, []);
  assert.deepEqual(R.codes_old_kit.debt, [['view', 'codes', 'p: «UC-12»']]);
  assert.match(R.codes_label[0], /^ {2}mã lộ \(1\):/);
});
