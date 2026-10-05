# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.
> File tạo ở lần sửa nhỏ đầu tiên sau bàn giao (05/10/2026), theo mẫu `evolve-site/templates/FEATURE-DECISIONS.md`.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | Cấp 1 · cờ: C · thêm một nút gọi điện cạnh nút "Xem đường đi" có sẵn, theo tiền lệ hàng nút `.hero-cta`; cần một quy tắc bố cục trong `site.css` dùng chung | `site/index.html:111-114` · `site/assets/site.css:175` | Khối giờ mở cửa (`#duong-di`): thêm nút ghost "Gọi điện" (`tel:0909123456`, icon Phosphor `ph-phone`) ngay sau "Xem đường đi"; hai nút bọc trong `.info-cta` (flex, xuống dòng, khoảng cách 12px, cách trên 20px), thay quy tắc `.info-side .btn` | *câu lệnh* · số 0909 123 456 có trong `DECISIONS.md` *(Nội dung thật: "Zalo 0909 123 456"; "nhắn hoặc gọi 0909 123 456")* | `quick` ĐẠT · 2 file · 6 bộ (dark) · 27 bước · 0 lỗi mới · check đổi 0 · đã xem ảnh 390 | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |
