# Sổ tiến độ dựng — <Tên dự án>

> Mẫu từ `sketch-to-site/templates/BUILD-LOG.md`. Chép thành `BUILD-LOG.md` ở thư mục prototype.
> Sổ này là nơi ghi thật việc đã dựng xong. Dòng `[TẠM DỪNG …]` trong chat mất khi ngữ cảnh bị nén hay sang phiên mới; sổ thì không.
> **Luật làm tiếp:** đọc sổ trước tiên. Với từng trang ghi `xong`, **mở file thật** và chạy lại `preflight.py` cho trang đó:
>  - File không còn → đổi về `chưa`.
>  - Kết quả preflight khác cột Kiểm, hoặc ngày giờ sửa file mới hơn ngày giờ ở Ghi chú → đổi thành `chặn` và hỏi người dùng trước khi đụng vào: có thể người dùng đã sửa tay.
>  - Khớp → giữ `xong`. Không dựng lại trang đã `xong`.
>
> Làm từ trang đầu tiên chưa `xong`. Ghi một dòng vào *Lần tiếp tục*.
> **Luật ghi:** chỉ đổi thành `xong` khi `preflight.py` của trang đó được **0 lỗi**; dán nguyên dòng cuối `preflight.py` in ra vào cột Kiểm *(không cắt bớt, để lần sau so nguyên văn)* và ghi ngày giờ sửa file vào Ghi chú, dạng `dd/mm/yyyy hh:mm:ss`.

**Phạm vi** *(Cổng 3, nguyên văn)*: <…> · **Sơ đồ trang:** `DESIGN.md` mục 9 · **Bắt đầu:** <dd/mm/yyyy>

**Chỉ gồm trang trong phạm vi Cổng 3.** Trang ngoài phạm vi không ghi vào sổ.

| # | Trang / màn | File | Trạng thái | Kiểm *(dòng kết quả thật)* | Ghi chú |
|---|---|---|---|---|---|
| 1 | <Trang chủ> | `site/index.html` | chưa | | |

**Trạng thái:** `chưa` · `đang` *(đã mở file, chưa kiểm)* · `xong` *(preflight 0 lỗi)* · `chặn` *(ghi lý do, cần người dùng)*

## Lần tiếp tục
| Lúc | Sổ ghi | Mở file thật thấy | Làm tiếp từ |
|---|---|---|---|

## Đợt `evolve-site` Cấp 3
> Mỗi đợt thêm một khối: tiêu đề `### <tên tính năng> · <dd/mm/yyyy>`, rồi một bảng cùng cột như bảng trên, mỗi file hay màn một dòng.
