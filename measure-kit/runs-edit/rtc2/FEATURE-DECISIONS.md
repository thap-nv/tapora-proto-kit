# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | tweak · Cấp 1 · cờ: C · vì thêm một nút trong khối giờ mở cửa, chỗ đặt do câu lệnh chỉ, theo nút `.btn-ghost` Xem đường đi; hàng nút mới nằm trong `site.css` dùng chung | `site/index.html:111-114` · `site/assets/site.css:175` | Thêm nút viền "Gọi điện" (icon `ph-phone`, `tel:+84909123456`) cạnh nút Xem đường đi; gói hai nút vào `.info-cta` (flex, xuống dòng khi hẹp, khe 12px như `.hero-cta`, cách trên 20px), thay luật `.info-side .btn{margin-top:20px}` | DECISIONS.md B1 *("nhắn hoặc gọi 0909 123 456 từ điện thoại")* · *câu lệnh* | quick: 6 bộ (dark) · 27 bước · console 0 · FAIL 0 · tràn/cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT · ảnh 390: hai nút cùng hàng | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |
