# Chuẩn bị thư mục bắt đầu cho lần đo (không dùng cho dự án thật): python moc-lf.py <thư-mục-sample> …
# 1. File bước _qa/steps-*.json về xuống dòng LF. Python trên Windows ghi CRLF; git (core.autocrlf=input) lưu LF, nên sau một lần
#    checkout file thành LF mà mốc vẫn giữ dấu của bản CRLF: quick.py --dry báo file bước "đổi" dù không ai sửa (gặp ở r5, r6 ngày 05/10).
# 2. Dấu trong _qa/last-green/manifest.json và _qa/current/manifest.json: mọi khoá _qa/ đã có trong manifest lấy lại theo file hiện tại.
#    Dùng sau khi chuyển dòng (1) và sau qa_init.py --update của bộ kiểm mới (run.mjs, file bước _system), để thư mục bắt đầu như thể
#    đã dùng bộ kiểm đó từ đầu. Khoá chưa có trong manifest (file bước mới từ lần sửa sau mốc) giữ nguyên: đó là thay đổi thật.
#    Bộ kiểm mới không đổi nội dung report.json (chỉ thêm slices.json và số lát), nên không cần chạy lại các bộ.
import json, os, sys

for d in sys.argv[1:]:
    qa = os.path.join(d, '_qa')
    sys.path.insert(0, qa)
    import qalib as Q
    sys.path.pop(0)
    conv = []
    for n in sorted(os.listdir(qa)):
        if n.startswith('steps-') and n.endswith('.json'):
            p = os.path.join(qa, n)
            b = open(p, 'rb').read()
            if b'\r\n' in b:
                open(p, 'wb').write(b.replace(b'\r\n', b'\n')); conv.append(n)
    now = Q.manifest()
    print(f'{d}: LF {len(conv)} file ({", ".join(conv) or "không"})')
    for mf in ('last-green', 'current'):
        p = os.path.join(qa, mf, 'manifest.json')
        if not os.path.exists(p):
            print(f'  {mf}: không có'); continue
        m = json.load(open(p, encoding='utf-8'))
        fix = [k for k in m if k.startswith('_qa/') and k in now and m[k] != now[k]]
        for k in fix:
            m[k] = now[k]
        if fix:
            with open(p, 'w', encoding='utf-8', newline='\n') as f:
                json.dump(m, f, ensure_ascii=False, indent=1)
        print(f'  {mf}: cập nhật dấu {", ".join(fix) or "không"}')
    del sys.modules['qalib'], sys.modules['run_all']
