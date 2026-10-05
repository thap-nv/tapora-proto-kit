# Sổ tiến độ dựng — Lò Bánh Củi Cô Ba

> Mẫu từ `sketch-to-site/templates/BUILD-LOG.md`.
> Sổ này là nơi ghi thật việc đã dựng xong. Dòng `[TẠM DỪNG …]` trong chat mất khi ngữ cảnh bị nén hay sang phiên mới; sổ thì không.
> **Luật làm tiếp:** đọc sổ trước tiên. Với từng trang ghi `xong`, **mở file thật**, tính lại dấu nội dung và chạy lại `preflight.py` cho trang đó:
>  - File không còn → đổi về `chưa`.
>  - Dấu nội dung khác dấu ở Ghi chú → đổi thành `chặn`: file đã đổi mà sổ không ghi *(người dùng sửa tay, hay chính agent sửa mà quên ghi)*.
>  - Dấu khớp mà preflight còn lỗi *(CSS dùng chung vừa đổi, kit có luật mới)* → đổi thành `đang` và sửa, không cần hỏi.
>  - Dấu khớp, preflight 0 lỗi → giữ `xong`. Không dựng lại trang đã `xong`.
>
> Có trang `chặn` thì hỏi người dùng **một lần** cho mọi trang đó, trước khi đụng vào: *Giữ bản hiện tại, coi là `xong`* *(chạy lại preflight, ghi dấu mới)* · *Xem lại trang* *(mở từng trang, so với sơ đồ trang và concept, rồi làm như trang `đang`)*.
> Làm từ trang đầu tiên chưa `xong`. Ghi một dòng vào *Lần tiếp tục*.
> **Luật ghi:** chỉ đổi thành `xong` khi `preflight.py` của trang đó được **0 lỗi**; dán nguyên dòng cuối `preflight.py` in ra vào cột Kiểm *(làm bằng chứng)* và ghi dấu nội dung vào Ghi chú, dạng `dấu 1a2b3c4d5e`. Tính dấu:
> `python -c "import hashlib, sys; print(hashlib.sha1(open(sys.argv[1], 'rb').read().replace(b'\r\n', b'\n')).hexdigest()[:10])" site/index.html`
> Dấu chỉ đổi khi nội dung file đổi: `git clone`, checkout, chép thư mục không làm lệch dấu.
> **Tự sửa một trang đã `xong`** *(B4, sửa theo review hay góp ý, `evolve-site` thêm lối vào menu)*: chạy lại `preflight.py`, rồi ghi lại cột Kiểm và dấu của dòng đó ngay trong lượt sửa.

**Phạm vi** *(Cổng 3, nguyên văn)*: "Phạm vi: 1 trang chủ." · **Sơ đồ trang:** `DESIGN.md` mục 9 · **Bắt đầu:** 05/10/2026

**Chỉ gồm trang trong phạm vi Cổng 3.** Trang ngoài phạm vi không ghi vào sổ.

| # | Trang / màn | File | Trạng thái | Kiểm *(dòng kết quả thật)* | Ghi chú |
|---|---|---|---|---|---|
| 1 | Trang chủ *(5 section theo `DESIGN.md` mục 9; 6 trạng thái trong ngày qua `?gio=`, `?thu=`)* | `site/index.html` | xong | `1 file · 0 lỗi · 0 cảnh báo · kiểu kiểm: site` *(chạy lại 05/10 sau sửa theo review B4)* | dấu 646868ff9a *(trước sửa: 815f79eb81 → 1f6da9b134; sửa: nhãn nút giữ bánh mẻ hôm sau có ngày, dãy giờ mỗi giờ kèm dấu "·" một `.num`)* · CSS dùng chung `site/assets/site.css` · không nạp Tailwind *(preflight của Tailwind `[type=button]` ngang độ ưu tiên với `.fire`/`.brick` và nạp sau, sẽ xoá nền ô cửa)* |

**Trạng thái:** `chưa` · `đang` *(đang dựng hay đang sửa, preflight chưa 0 lỗi)* · `xong` *(preflight 0 lỗi)* · `chặn` *(ghi lý do, cần người dùng)*

## Lần tiếp tục
| Lúc | Sổ ghi | Mở file thật thấy | Làm tiếp từ |
|---|---|---|---|

## Đợt `evolve-site` Cấp 3
> Mỗi đợt thêm một khối: tiêu đề `### <tên tính năng> · <dd/mm/yyyy>`, rồi một bảng cùng cột như bảng trên, mỗi file hay màn một dòng.
