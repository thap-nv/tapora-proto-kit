# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | tweak · Cấp 1 · cờ: C · vì thêm một nút gọi điện (btn-ghost, icon Phosphor `phone`) cạnh Xem đường đi ở khối giờ mở, theo tiền lệ hàng hai nút ở màn đầu; sửa một dòng `site.css` dùng chung | `site/index.html:111-114` · `site/assets/site.css:175` | Bọc nút Xem đường đi và nút mới **Gọi điện** (`tel:+84909123456`) trong `.info-cta`; `.info-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}` thay `.info-side .btn{margin-top:20px}` | `DECISIONS.md:74` *(máy không có Zalo: "nhắn hoặc gọi 0909 123 456 từ điện thoại")*, số thật ở `DECISIONS.md:25` · *câu lệnh* | `0` lỗi mới: quick 6 bộ (dark), 27 bước, console 0 · FAIL 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT. Ảnh 390 khối `#duong-di`: hai nút cùng một hàng | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |
