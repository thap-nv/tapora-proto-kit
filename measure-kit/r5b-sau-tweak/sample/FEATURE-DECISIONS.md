# Nhật ký phát triển tính năng — Lò Bánh Củi Cô Ba

> **Cấp 0, và Cấp 1 không cờ:** một dòng ở bảng *Nhật ký thay đổi nhỏ*.
> **Cấp 1 có cờ, Cấp 2, Cấp 3:** một khối *Tính năng* đầy đủ; cổng không đi thì ghi *không đi (Cấp n)*.
> **Đáp án và chỉ định của người dùng ghi nguyên văn**, kể cả lời miễn hỏi.

---

## Nhật ký thay đổi nhỏ

| Ngày | Khai báo *(Cấp · cờ · vì)* | Trang / file | Thay đổi | Nguồn yêu cầu | QA so mốc | Người dùng *(nguyên văn; Cấp 1: đáp án Cổng 3)* |
|---|---|---|---|---|---|---|
| 05/10/2026 | tweak · Cấp 1 · cờ: C · vì thêm một nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa; hàng nút `.info-cta` mới trong CSS chung, theo `.hero-cta` | `site/index.html:111-114` · `site/assets/site.css:175` | Bọc nút Xem đường đi và nút mới **Gọi 0909 123 456** (`.btn-ghost`, icon `ph-phone`, `tel:+84909123456`, số trong `.num`) vào `.info-cta` *(flex, xuống dòng, gap 12px, cách trên 20px)*; bỏ `.info-side .btn{margin-top:20px}` vì khoảng cách chuyển lên hàng nút | *câu lệnh* · số 0909 123 456 là nội dung thật ở `DECISIONS.md` *(người dùng nói; "nhắn hoặc gọi 0909 123 456")* | `quick · 2 file đổi · 6 bộ (dark) · 27 bước · preflight 0 lỗi · console 0 · FAIL 0 · tràn mới 0 · cắt mới 0 · tương phản mới 0 · ý định mới 0 · check đổi 0 → ĐẠT` · `0` lỗi mới | "Thêm nút gọi điện cạnh nút Xem đường đi ở khối giờ mở cửa cuối trang, gọi số 0909 123 456." |
