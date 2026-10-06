# Sổ tiến độ dựng — <Tên dự án>

> Mẫu từ `sketch-to-site/templates/BUILD-LOG.md`. Chép thành `BUILD-LOG.md` ở thư mục prototype.
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

**Phạm vi** *(Cổng 3, hay đợt đầu ở Cổng Bản đồ; nguyên văn)*: <…> · **Sơ đồ trang:** `DESIGN.md` mục 9 *(có bản đồ: `map/MAP.md`)* · **Bắt đầu:** <dd/mm/yyyy>

**Chỉ gồm trang trong phạm vi Cổng 3.** Trang ngoài phạm vi không ghi vào sổ.

| # | Trang / màn | File | Chức năng *(mã trong bản đồ, nếu có)* | Trạng thái | Kiểm *(dòng kết quả thật)* | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | <Trang chủ> | `site/index.html` | | chưa | | |

**Trạng thái:** `chưa` · `đang` *(đang dựng hay đang sửa, preflight chưa 0 lỗi)* · `xong` *(preflight 0 lỗi)* · `chặn` *(ghi lý do, cần người dùng)*

## Lần tiếp tục
| Lúc | Sổ ghi | Mở file thật thấy | Làm tiếp từ |
|---|---|---|---|

## Đợt `evolve-site` Cấp 3
> Mỗi đợt thêm một khối: tiêu đề `### <tên tính năng> · <dd/mm/yyyy>`, rồi một bảng cùng cột như bảng trên, mỗi file hay màn một dòng.
