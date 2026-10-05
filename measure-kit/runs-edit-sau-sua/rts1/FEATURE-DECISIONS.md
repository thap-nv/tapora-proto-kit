# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | Cấp 1 · cờ: C · thêm một nút gọi điện cạnh "Xem đường đi" ở khối giờ mở; hàng flex nhỏ trong site.css theo tiền lệ `.hero-cta` | `site/index.html:111-114` · `site/assets/site.css:176-178` | Thêm nút ghost "Gọi 0909 123 456" (`tel:+84909123456`, icon Phosphor `ph-phone`) cạnh "Xem đường đi"; gói hai nút trong `.info-cta` (flex, xuống dòng khi hẹp, gap 12px như `.hero-cta`) | *câu lệnh* · số có trong `DECISIONS.md:25` (Zalo 0909 123 456) | `quick` ĐẠT · 6 bộ (dark) · `0` lỗi mới · check đổi 0 · nợ cũ 0 | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |

---

