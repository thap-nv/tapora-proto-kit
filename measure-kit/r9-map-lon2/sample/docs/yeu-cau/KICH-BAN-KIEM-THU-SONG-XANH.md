# Kịch bản kiểm thử chi tiết · Trung tâm bơi Sóng Xanh

> Ngày: 2026-09-28 · Viết cho nhóm kiểm thử, phần 21 chức năng sau (gói học, thông báo, báo cáo, quản trị, phần mở rộng).

## Quy ước

Mỗi chức năng một mục. Mỗi kịch bản là một đoạn văn: tình huống, rồi kết quả phải thấy. Kịch bản không thay quy tắc: khi lệch với `BUSINESS-RULES-SONG-XANH.md`, `EDGE-CASES-SONG-XANH.md` hay `XUNG-DOT-SONG-XANH.md`, các tài liệu đó thắng. Mã `UC-`, `BR-`, `YC-`, `XD-` trỏ về tài liệu gốc.

## 1. Gói học và tiền

### Bán gói và thu tiền

Căn cứ: UC-02, YC-10. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "bán gói và thu tiền"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

2. Thời gian chờ. Khi "bán gói và thu tiền" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

3. Giữ lịch sử. Sau khi "bán gói và thu tiền" đổi hình thức thanh toán, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

4. Gộp với việc liên quan. Khi "bán gói và thu tiền" làm đổi hạn dùng, các màn đang hiển thị hạn dùng cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

5. Xác nhận trước việc khó hoàn lại. Trước khi "bán gói và thu tiền" thay đổi hình thức thanh toán đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

6. Đường chính. Khi quản lý làm "bán gói và thu tiền" với đủ số buổi và hạn dùng hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

7. Lùi một bước. Trong lúc làm "bán gói và thu tiền", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

8. Hai người cùng làm. Khi một lễ tân mở hai tab ở "bán gói và thu tiền", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hạn dùng và tự chọn giữ bản của mình hay lấy bản mới.

9. Bàn phím. Làm được toàn bộ "bán gói và thu tiền" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

10. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "bán gói và thu tiền" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

11. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "bán gói và thu tiền" thì thấy đúng từng giá trị của số buổi và số buổi còn lại, không bị đổi định dạng hay múi giờ.

12. Đối chiếu với dữ liệu hiện có. Khi mở "bán gói và thu tiền" lần đầu sau khi nhập dữ liệu cũ, số buổi của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu hình thức thanh toán.

13. Số liệu đi kèm. Con số hiển thị trong "bán gói và thu tiền" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

14. Sai khuôn dạng. quản lý nhập số tiền sai khuôn dạng ở "bán gói và thu tiền": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

15. Giải thích kết quả. Khi "bán gói và thu tiền" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-02.

16. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "bán gói và thu tiền" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-02 trên màn hình.

17. Thiếu hình thức thanh toán. quản lý bỏ trống hình thức thanh toán rồi bấm lưu: hệ thống không lưu, tô đỏ ô hình thức thanh toán, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

18. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "bán gói và thu tiền" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

19. Tìm và lọc. lễ tân gõ một phần số buổi không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "bán gói và thu tiền".

20. Giá trị biên. Với hạn dùng bằng 24 (gói lớn nhất), "bán gói và thu tiền" xử lý đúng theo quy tắc ở UC-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

21. Trên điện thoại. Ở màn hẹp 390 px, "bán gói và thu tiền" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số buổi còn lại đọc được không phải kéo ngang.

22. Hiển thị cho từng vai. Cùng một bản ghi của "bán gói và thu tiền", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

23. Thứ tự việc. "bán gói và thu tiền" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-02.

24. Danh sách rỗng. Khi chưa có dữ liệu nào để "bán gói và thu tiền", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

25. Đối chiếu với dữ liệu hiện có. Khi mở "bán gói và thu tiền" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số tiền.

26. Hiển thị cho từng vai. Cùng một bản ghi của "bán gói và thu tiền", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

27. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "bán gói và thu tiền"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

28. Ngày đặc biệt. Khi thao tác rơi vào ngày 29/02 của năm không nhuận, "bán gói và thu tiền" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

29. Lùi một bước. Trong lúc làm "bán gói và thu tiền", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

30. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "bán gói và thu tiền" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-02 trên màn hình.

31. Đường chính. Khi quản lý làm "bán gói và thu tiền" với đủ hình thức thanh toán và số buổi hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

32. Thứ tự việc. "bán gói và thu tiền" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-02.

33. Trên điện thoại. Ở màn hẹp 390 px, "bán gói và thu tiền" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, hình thức thanh toán đọc được không phải kéo ngang.

34. Thời gian chờ. Khi "bán gói và thu tiền" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

35. Tìm và lọc. quản lý gõ một phần số buổi không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "bán gói và thu tiền".

36. Thiếu số tiền. phụ huynh bỏ trống số tiền rồi bấm lưu: hệ thống không lưu, tô đỏ ô số tiền, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

### Lịch sử thanh toán và biên lai

Căn cứ: UC-02, UC-06. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Giải thích kết quả. Khi "lịch sử thanh toán và biên lai" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-02.

2. Hiển thị cho từng vai. Cùng một bản ghi của "lịch sử thanh toán và biên lai", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

3. Thiếu hình thức thanh toán. lễ tân bỏ trống hình thức thanh toán rồi bấm lưu: hệ thống không lưu, tô đỏ ô hình thức thanh toán, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

4. Gộp với việc liên quan. Khi "lịch sử thanh toán và biên lai" làm đổi hạn dùng, các màn đang hiển thị hạn dùng cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

5. Đối chiếu với dữ liệu hiện có. Khi mở "lịch sử thanh toán và biên lai" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số tiền.

6. Bàn phím. Làm được toàn bộ "lịch sử thanh toán và biên lai" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

7. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "lịch sử thanh toán và biên lai" thì thấy đúng từng giá trị của số buổi và số tiền, không bị đổi định dạng hay múi giờ.

8. Lùi một bước. Trong lúc làm "lịch sử thanh toán và biên lai", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

9. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch sử thanh toán và biên lai", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

10. Thứ tự việc. "lịch sử thanh toán và biên lai" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-02.

11. Giữ lịch sử. Sau khi "lịch sử thanh toán và biên lai" đổi hình thức thanh toán, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

12. Trên điện thoại. Ở màn hẹp 390 px, "lịch sử thanh toán và biên lai" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số tiền đọc được không phải kéo ngang.

13. Dữ liệu dài. Khi số tiền dài hơn chỗ hiển thị, "lịch sử thanh toán và biên lai" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

14. Tìm và lọc. lễ tân gõ một phần số tiền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lịch sử thanh toán và biên lai".

15. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "lịch sử thanh toán và biên lai" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

16. Đường chính. Khi quản lý làm "lịch sử thanh toán và biên lai" với đủ số tiền và hình thức thanh toán hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

17. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "lịch sử thanh toán và biên lai"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

18. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "lịch sử thanh toán và biên lai" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-02 trên màn hình.

19. Sai khuôn dạng. quản lý nhập số tiền sai khuôn dạng ở "lịch sử thanh toán và biên lai": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

20. Hai người cùng làm. Khi một lễ tân mở hai tab ở "lịch sử thanh toán và biên lai", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hình thức thanh toán và tự chọn giữ bản của mình hay lấy bản mới.

21. Giá trị biên. Với số tiền bằng âm, "lịch sử thanh toán và biên lai" xử lý đúng theo quy tắc ở UC-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

22. Thời gian chờ. Khi "lịch sử thanh toán và biên lai" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

23. Số liệu đi kèm. Con số hiển thị trong "lịch sử thanh toán và biên lai" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

24. Xác nhận trước việc khó hoàn lại. Trước khi "lịch sử thanh toán và biên lai" thay đổi số buổi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

25. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "lịch sử thanh toán và biên lai"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

26. Lùi một bước. Trong lúc làm "lịch sử thanh toán và biên lai", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

27. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "lịch sử thanh toán và biên lai", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số tiền và tự chọn giữ bản của mình hay lấy bản mới.

28. Số liệu đi kèm. Con số hiển thị trong "lịch sử thanh toán và biên lai" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

29. Thứ tự việc. "lịch sử thanh toán và biên lai" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-02.

30. Thời gian chờ. Khi "lịch sử thanh toán và biên lai" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

31. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch sử thanh toán và biên lai", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

32. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "lịch sử thanh toán và biên lai" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

33. Giải thích kết quả. Khi "lịch sử thanh toán và biên lai" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-02.

34. Thiếu số buổi. lễ tân bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

35. Tìm và lọc. lễ tân gõ một phần số buổi còn lại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lịch sử thanh toán và biên lai".

36. Đối chiếu với dữ liệu hiện có. Khi mở "lịch sử thanh toán và biên lai" lần đầu sau khi nhập dữ liệu cũ, số tiền của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số buổi.

### Phụ huynh xem gói học: số buổi còn lại, hạn dùng

Căn cứ: UC-06, YC-11. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh xem gói học: số buổi còn lại, hạn dùng" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-06 trên màn hình.

2. Giữ lịch sử. Sau khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" đổi hình thức thanh toán, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

3. Tìm và lọc. lễ tân gõ một phần số tiền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh xem gói học: số buổi còn lại, hạn dùng".

4. Thiếu số buổi. quản lý bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

5. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh xem gói học: số buổi còn lại, hạn dùng" thì thấy đúng từng giá trị của số buổi còn lại và hình thức thanh toán, không bị đổi định dạng hay múi giờ.

6. Lùi một bước. Trong lúc làm "phụ huynh xem gói học: số buổi còn lại, hạn dùng", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

7. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh xem gói học: số buổi còn lại, hạn dùng", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

8. Thời gian chờ. Khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

9. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "phụ huynh xem gói học: số buổi còn lại, hạn dùng", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số tiền và tự chọn giữ bản của mình hay lấy bản mới.

10. Số liệu đi kèm. Con số hiển thị trong "phụ huynh xem gói học: số buổi còn lại, hạn dùng" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

11. Giải thích kết quả. Khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-06.

12. Dữ liệu dài. Khi số buổi dài hơn chỗ hiển thị, "phụ huynh xem gói học: số buổi còn lại, hạn dùng" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

13. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" thay đổi hạn dùng đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

14. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh xem gói học: số buổi còn lại, hạn dùng", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

15. Thứ tự việc. "phụ huynh xem gói học: số buổi còn lại, hạn dùng" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-06.

16. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh xem gói học: số buổi còn lại, hạn dùng" lần đầu sau khi nhập dữ liệu cũ, hạn dùng của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số buổi còn lại.

17. Gộp với việc liên quan. Khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" làm đổi số buổi, các màn đang hiển thị số buổi cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

18. Giá trị biên. Với hình thức thanh toán bằng có phần thập phân, "phụ huynh xem gói học: số buổi còn lại, hạn dùng" xử lý đúng theo quy tắc ở UC-06: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

19. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh xem gói học: số buổi còn lại, hạn dùng"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

20. Sai khuôn dạng. phụ huynh nhập số tiền sai khuôn dạng ở "phụ huynh xem gói học: số buổi còn lại, hạn dùng": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

21. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "phụ huynh xem gói học: số buổi còn lại, hạn dùng" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

22. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh xem gói học: số buổi còn lại, hạn dùng" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số buổi còn lại đọc được không phải kéo ngang.

23. Bàn phím. Làm được toàn bộ "phụ huynh xem gói học: số buổi còn lại, hạn dùng" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

24. Đường chính. Khi lễ tân làm "phụ huynh xem gói học: số buổi còn lại, hạn dùng" với đủ hình thức thanh toán và số buổi còn lại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

25. Giữ lịch sử. Sau khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" đổi số tiền, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

26. Hai người cùng làm. Khi một lễ tân mở hai tab ở "phụ huynh xem gói học: số buổi còn lại, hạn dùng", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số tiền và tự chọn giữ bản của mình hay lấy bản mới.

27. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" thay đổi số tiền đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

28. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh xem gói học: số buổi còn lại, hạn dùng"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

29. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh xem gói học: số buổi còn lại, hạn dùng" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-06 trên màn hình.

30. Dữ liệu dài. Khi số buổi còn lại dài hơn chỗ hiển thị, "phụ huynh xem gói học: số buổi còn lại, hạn dùng" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

31. Thời gian chờ. Khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

32. Gộp với việc liên quan. Khi "phụ huynh xem gói học: số buổi còn lại, hạn dùng" làm đổi số buổi còn lại, các màn đang hiển thị số buổi còn lại cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

33. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh xem gói học: số buổi còn lại, hạn dùng" lần đầu sau khi nhập dữ liệu cũ, hạn dùng của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số tiền.

34. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh xem gói học: số buổi còn lại, hạn dùng" thì thấy đúng từng giá trị của số buổi và hình thức thanh toán, không bị đổi định dạng hay múi giờ.

35. Bàn phím. Làm được toàn bộ "phụ huynh xem gói học: số buổi còn lại, hạn dùng" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

36. Sai khuôn dạng. phụ huynh nhập số buổi còn lại sai khuôn dạng ở "phụ huynh xem gói học: số buổi còn lại, hạn dùng": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

### Bảo lưu gói

Căn cứ: UC-09, BR-TT-05, YC-09. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "bảo lưu gói" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

2. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "bảo lưu gói" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-09 trên màn hình.

3. Xác nhận trước việc khó hoàn lại. Trước khi "bảo lưu gói" thay đổi hạn dùng đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

4. Đường chính. Khi phụ huynh làm "bảo lưu gói" với đủ hình thức thanh toán và số tiền hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

5. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "bảo lưu gói", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số tiền và tự chọn giữ bản của mình hay lấy bản mới.

6. Bàn phím. Làm được toàn bộ "bảo lưu gói" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

7. Thời gian chờ. Khi "bảo lưu gói" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

8. Hiển thị cho từng vai. Cùng một bản ghi của "bảo lưu gói", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

9. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "bảo lưu gói"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

10. Tìm và lọc. phụ huynh gõ một phần hình thức thanh toán không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "bảo lưu gói".

11. Thiếu số buổi. quản lý bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

12. Giải thích kết quả. Khi "bảo lưu gói" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-09.

13. Lùi một bước. Trong lúc làm "bảo lưu gói", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

14. Giá trị biên. Với số tiền bằng 24 (gói lớn nhất), "bảo lưu gói" xử lý đúng theo quy tắc ở UC-09: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

15. Thứ tự việc. "bảo lưu gói" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-09.

16. Số liệu đi kèm. Con số hiển thị trong "bảo lưu gói" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

17. Dữ liệu dài. Khi hạn dùng dài hơn chỗ hiển thị, "bảo lưu gói" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

18. Danh sách rỗng. Khi chưa có dữ liệu nào để "bảo lưu gói", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

19. Đối chiếu với dữ liệu hiện có. Khi mở "bảo lưu gói" lần đầu sau khi nhập dữ liệu cũ, hạn dùng của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số buổi.

20. Gộp với việc liên quan. Khi "bảo lưu gói" làm đổi số buổi, các màn đang hiển thị số buổi cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

21. Sai khuôn dạng. phụ huynh nhập số buổi sai khuôn dạng ở "bảo lưu gói": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

22. Giữ lịch sử. Sau khi "bảo lưu gói" đổi số buổi, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

23. Trên điện thoại. Ở màn hẹp 390 px, "bảo lưu gói" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số tiền đọc được không phải kéo ngang.

24. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "bảo lưu gói" thì thấy đúng từng giá trị của số buổi và số tiền, không bị đổi định dạng hay múi giờ.

25. Sai khuôn dạng. phụ huynh nhập hình thức thanh toán sai khuôn dạng ở "bảo lưu gói": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

26. Trên điện thoại. Ở màn hẹp 390 px, "bảo lưu gói" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, hình thức thanh toán đọc được không phải kéo ngang.

27. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "bảo lưu gói" thì thấy đúng từng giá trị của hạn dùng và số buổi, không bị đổi định dạng hay múi giờ.

28. Gộp với việc liên quan. Khi "bảo lưu gói" làm đổi số buổi, các màn đang hiển thị số buổi cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

29. Thời gian chờ. Khi "bảo lưu gói" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

30. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "bảo lưu gói"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

31. Hiển thị cho từng vai. Cùng một bản ghi của "bảo lưu gói", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

32. Xác nhận trước việc khó hoàn lại. Trước khi "bảo lưu gói" thay đổi hình thức thanh toán đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

33. Danh sách rỗng. Khi chưa có dữ liệu nào để "bảo lưu gói", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

34. Tìm và lọc. phụ huynh gõ một phần số tiền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "bảo lưu gói".

35. Đối chiếu với dữ liệu hiện có. Khi mở "bảo lưu gói" lần đầu sau khi nhập dữ liệu cũ, số buổi của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu hình thức thanh toán.

36. Thứ tự việc. "bảo lưu gói" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-09.

### Cảnh báo hết buổi, hết hạn và gia hạn tại quầy

Căn cứ: A-05, BR-TT-04. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Giải thích kết quả. Khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo A-05.

2. Trên điện thoại. Ở màn hẹp 390 px, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, hình thức thanh toán đọc được không phải kéo ngang.

3. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" thì thấy đúng từng giá trị của số buổi và số tiền, không bị đổi định dạng hay múi giờ.

4. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "cảnh báo hết buổi, hết hạn và gia hạn tại quầy"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

5. Lùi một bước. Trong lúc làm "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

6. Giá trị biên. Với hạn dùng bằng âm, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" xử lý đúng theo quy tắc ở A-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Thời gian chờ. Khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

8. Số liệu đi kèm. Con số hiển thị trong "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

9. Sai khuôn dạng. lễ tân nhập hình thức thanh toán sai khuôn dạng ở "cảnh báo hết buổi, hết hạn và gia hạn tại quầy": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

10. Gộp với việc liên quan. Khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" làm đổi số buổi còn lại, các màn đang hiển thị số buổi còn lại cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

11. Thứ tự việc. "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo A-05.

12. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hạn dùng và tự chọn giữ bản của mình hay lấy bản mới.

13. Danh sách rỗng. Khi chưa có dữ liệu nào để "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

14. Thiếu số buổi. phụ huynh bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

15. Hiển thị cho từng vai. Cùng một bản ghi của "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

16. Xác nhận trước việc khó hoàn lại. Trước khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" thay đổi số buổi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

17. Đường chính. Khi quản lý làm "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" với đủ hình thức thanh toán và số tiền hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

18. Đối chiếu với dữ liệu hiện có. Khi mở "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số buổi còn lại.

19. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

20. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như A-05 trên màn hình.

21. Bàn phím. Làm được toàn bộ "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

22. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

23. Giữ lịch sử. Sau khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" đổi hình thức thanh toán, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

24. Tìm và lọc. lễ tân gõ một phần số buổi còn lại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "cảnh báo hết buổi, hết hạn và gia hạn tại quầy".

25. Danh sách rỗng. Khi chưa có dữ liệu nào để "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

26. Bàn phím. Làm được toàn bộ "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

27. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như A-05 trên màn hình.

28. Hai người cùng làm. Khi một lễ tân mở hai tab ở "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hạn dùng và tự chọn giữ bản của mình hay lấy bản mới.

29. Đường chính. Khi phụ huynh làm "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" với đủ số buổi và số buổi còn lại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

30. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

31. Giá trị biên. Với số buổi bằng âm, "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" xử lý đúng theo quy tắc ở A-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

32. Thứ tự việc. "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo A-05.

33. Tìm và lọc. lễ tân gõ một phần số buổi không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "cảnh báo hết buổi, hết hạn và gia hạn tại quầy".

34. Giữ lịch sử. Sau khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" đổi số tiền, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

35. Thời gian chờ. Khi "cảnh báo hết buổi, hết hạn và gia hạn tại quầy" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

36. Hiển thị cho từng vai. Cùng một bản ghi của "cảnh báo hết buổi, hết hạn và gia hạn tại quầy", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

### Danh sách sắp hết buổi để gọi mời gia hạn

Căn cứ: BR-TT-06, S-02. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Giữ lịch sử. Sau khi "danh sách sắp hết buổi để gọi mời gia hạn" đổi hình thức thanh toán, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

2. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách sắp hết buổi để gọi mời gia hạn" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TT-06 trên màn hình.

3. Số liệu đi kèm. Con số hiển thị trong "danh sách sắp hết buổi để gọi mời gia hạn" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

4. Thiếu số buổi còn lại. phụ huynh bỏ trống số buổi còn lại rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi còn lại, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

5. Thứ tự việc. "danh sách sắp hết buổi để gọi mời gia hạn" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TT-06.

6. Sai khuôn dạng. phụ huynh nhập hình thức thanh toán sai khuôn dạng ở "danh sách sắp hết buổi để gọi mời gia hạn": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

7. Giải thích kết quả. Khi "danh sách sắp hết buổi để gọi mời gia hạn" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo BR-TT-06.

8. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "danh sách sắp hết buổi để gọi mời gia hạn" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

9. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách sắp hết buổi để gọi mời gia hạn" thay đổi hình thức thanh toán đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

10. Đường chính. Khi quản lý làm "danh sách sắp hết buổi để gọi mời gia hạn" với đủ hình thức thanh toán và số buổi hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

11. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách sắp hết buổi để gọi mời gia hạn", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

12. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "danh sách sắp hết buổi để gọi mời gia hạn"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

13. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách sắp hết buổi để gọi mời gia hạn" thì thấy đúng từng giá trị của số buổi còn lại và hình thức thanh toán, không bị đổi định dạng hay múi giờ.

14. Thời gian chờ. Khi "danh sách sắp hết buổi để gọi mời gia hạn" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

15. Tìm và lọc. quản lý gõ một phần số tiền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách sắp hết buổi để gọi mời gia hạn".

16. Hai người cùng làm. Khi một lễ tân mở hai tab ở "danh sách sắp hết buổi để gọi mời gia hạn", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hình thức thanh toán và tự chọn giữ bản của mình hay lấy bản mới.

17. Hiển thị cho từng vai. Cùng một bản ghi của "danh sách sắp hết buổi để gọi mời gia hạn", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

18. Giá trị biên. Với số buổi còn lại bằng 0, "danh sách sắp hết buổi để gọi mời gia hạn" xử lý đúng theo quy tắc ở BR-TT-06: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

19. Bàn phím. Làm được toàn bộ "danh sách sắp hết buổi để gọi mời gia hạn" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

20. Trên điện thoại. Ở màn hẹp 390 px, "danh sách sắp hết buổi để gọi mời gia hạn" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số tiền đọc được không phải kéo ngang.

21. Lùi một bước. Trong lúc làm "danh sách sắp hết buổi để gọi mời gia hạn", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

22. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách sắp hết buổi để gọi mời gia hạn" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu hạn dùng.

23. Gộp với việc liên quan. Khi "danh sách sắp hết buổi để gọi mời gia hạn" làm đổi số buổi, các màn đang hiển thị số buổi cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

24. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "danh sách sắp hết buổi để gọi mời gia hạn" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

25. Dữ liệu dài. Khi hạn dùng dài hơn chỗ hiển thị, "danh sách sắp hết buổi để gọi mời gia hạn" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

26. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách sắp hết buổi để gọi mời gia hạn" thì thấy đúng từng giá trị của số tiền và số buổi, không bị đổi định dạng hay múi giờ.

27. Thứ tự việc. "danh sách sắp hết buổi để gọi mời gia hạn" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TT-06.

28. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách sắp hết buổi để gọi mời gia hạn", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

29. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách sắp hết buổi để gọi mời gia hạn" thay đổi số buổi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Sai khuôn dạng. phụ huynh nhập số buổi sai khuôn dạng ở "danh sách sắp hết buổi để gọi mời gia hạn": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

31. Gộp với việc liên quan. Khi "danh sách sắp hết buổi để gọi mời gia hạn" làm đổi số buổi, các màn đang hiển thị số buổi cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

32. Tìm và lọc. phụ huynh gõ một phần hình thức thanh toán không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách sắp hết buổi để gọi mời gia hạn".

33. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách sắp hết buổi để gọi mời gia hạn" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TT-06 trên màn hình.

34. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách sắp hết buổi để gọi mời gia hạn" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số tiền.

35. Giải thích kết quả. Khi "danh sách sắp hết buổi để gọi mời gia hạn" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo BR-TT-06.

36. Hiển thị cho từng vai. Cùng một bản ghi của "danh sách sắp hết buổi để gọi mời gia hạn", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

### Đề nghị và duyệt hoàn tiền

Căn cứ: BR-TT-08. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Gộp với việc liên quan. Khi "đề nghị và duyệt hoàn tiền" làm đổi hình thức thanh toán, các màn đang hiển thị hình thức thanh toán cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

2. Đối chiếu với dữ liệu hiện có. Khi mở "đề nghị và duyệt hoàn tiền" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số buổi.

3. Đường chính. Khi lễ tân làm "đề nghị và duyệt hoàn tiền" với đủ hình thức thanh toán và số buổi hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

4. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đề nghị và duyệt hoàn tiền"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

5. Hai người cùng làm. Khi một lễ tân mở hai tab ở "đề nghị và duyệt hoàn tiền", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số buổi còn lại và tự chọn giữ bản của mình hay lấy bản mới.

6. Giữ lịch sử. Sau khi "đề nghị và duyệt hoàn tiền" đổi số buổi còn lại, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

7. Trên điện thoại. Ở màn hẹp 390 px, "đề nghị và duyệt hoàn tiền" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, hình thức thanh toán đọc được không phải kéo ngang.

8. Thiếu số buổi. lễ tân bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

9. Thứ tự việc. "đề nghị và duyệt hoàn tiền" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TT-08.

10. Dữ liệu dài. Khi số tiền dài hơn chỗ hiển thị, "đề nghị và duyệt hoàn tiền" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

11. Hiển thị cho từng vai. Cùng một bản ghi của "đề nghị và duyệt hoàn tiền", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

12. Tìm và lọc. quản lý gõ một phần số buổi còn lại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đề nghị và duyệt hoàn tiền".

13. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đề nghị và duyệt hoàn tiền" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TT-08 trên màn hình.

14. Ngày đặc biệt. Khi thao tác rơi vào ngay sau 23:00, "đề nghị và duyệt hoàn tiền" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

15. Bàn phím. Làm được toàn bộ "đề nghị và duyệt hoàn tiền" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

16. Lùi một bước. Trong lúc làm "đề nghị và duyệt hoàn tiền", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

17. Giá trị biên. Với hạn dùng bằng 1, "đề nghị và duyệt hoàn tiền" xử lý đúng theo quy tắc ở BR-TT-08: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

18. Thời gian chờ. Khi "đề nghị và duyệt hoàn tiền" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

19. Giải thích kết quả. Khi "đề nghị và duyệt hoàn tiền" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo BR-TT-08.

20. Danh sách rỗng. Khi chưa có dữ liệu nào để "đề nghị và duyệt hoàn tiền", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

21. Số liệu đi kèm. Con số hiển thị trong "đề nghị và duyệt hoàn tiền" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

22. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đề nghị và duyệt hoàn tiền" thì thấy đúng từng giá trị của số buổi và số tiền, không bị đổi định dạng hay múi giờ.

23. Sai khuôn dạng. phụ huynh nhập hình thức thanh toán sai khuôn dạng ở "đề nghị và duyệt hoàn tiền": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

24. Xác nhận trước việc khó hoàn lại. Trước khi "đề nghị và duyệt hoàn tiền" thay đổi hạn dùng đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

25. Bàn phím. Làm được toàn bộ "đề nghị và duyệt hoàn tiền" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

26. Thời gian chờ. Khi "đề nghị và duyệt hoàn tiền" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

27. Dữ liệu dài. Khi số tiền dài hơn chỗ hiển thị, "đề nghị và duyệt hoàn tiền" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

28. Thiếu hình thức thanh toán. phụ huynh bỏ trống hình thức thanh toán rồi bấm lưu: hệ thống không lưu, tô đỏ ô hình thức thanh toán, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

29. Đường chính. Khi quản lý làm "đề nghị và duyệt hoàn tiền" với đủ số buổi còn lại và hạn dùng hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

30. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đề nghị và duyệt hoàn tiền" thì thấy đúng từng giá trị của số buổi còn lại và số tiền, không bị đổi định dạng hay múi giờ.

31. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "đề nghị và duyệt hoàn tiền", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số buổi còn lại và tự chọn giữ bản của mình hay lấy bản mới.

32. Hiển thị cho từng vai. Cùng một bản ghi của "đề nghị và duyệt hoàn tiền", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

33. Lùi một bước. Trong lúc làm "đề nghị và duyệt hoàn tiền", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

34. Giá trị biên. Với hạn dùng bằng 0, "đề nghị và duyệt hoàn tiền" xử lý đúng theo quy tắc ở BR-TT-08: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

35. Giải thích kết quả. Khi "đề nghị và duyệt hoàn tiền" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo BR-TT-08.

36. Sai khuôn dạng. quản lý nhập số buổi còn lại sai khuôn dạng ở "đề nghị và duyệt hoàn tiền": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

### Quản lý bảng giá

Căn cứ: BR-TT-03. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Bàn phím. Làm được toàn bộ "quản lý bảng giá" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

2. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "quản lý bảng giá" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

3. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "quản lý bảng giá" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

4. Lùi một bước. Trong lúc làm "quản lý bảng giá", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

5. Tìm và lọc. quản lý gõ một phần số buổi còn lại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "quản lý bảng giá".

6. Đối chiếu với dữ liệu hiện có. Khi mở "quản lý bảng giá" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu hạn dùng.

7. Đường chính. Khi phụ huynh làm "quản lý bảng giá" với đủ số tiền và số buổi còn lại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

8. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "quản lý bảng giá" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TT-03 trên màn hình.

9. Giải thích kết quả. Khi "quản lý bảng giá" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo BR-TT-03.

10. Thứ tự việc. "quản lý bảng giá" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TT-03.

11. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "quản lý bảng giá"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

12. Thời gian chờ. Khi "quản lý bảng giá" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

13. Sai khuôn dạng. phụ huynh nhập số buổi sai khuôn dạng ở "quản lý bảng giá": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

14. Hiển thị cho từng vai. Cùng một bản ghi của "quản lý bảng giá", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

15. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "quản lý bảng giá" thì thấy đúng từng giá trị của hình thức thanh toán và số buổi còn lại, không bị đổi định dạng hay múi giờ.

16. Gộp với việc liên quan. Khi "quản lý bảng giá" làm đổi số tiền, các màn đang hiển thị số tiền cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

17. Trên điện thoại. Ở màn hẹp 390 px, "quản lý bảng giá" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số buổi còn lại đọc được không phải kéo ngang.

18. Xác nhận trước việc khó hoàn lại. Trước khi "quản lý bảng giá" thay đổi số buổi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

19. Giữ lịch sử. Sau khi "quản lý bảng giá" đổi số tiền, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

20. Giá trị biên. Với số buổi bằng 0, "quản lý bảng giá" xử lý đúng theo quy tắc ở BR-TT-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

21. Số liệu đi kèm. Con số hiển thị trong "quản lý bảng giá" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

22. Danh sách rỗng. Khi chưa có dữ liệu nào để "quản lý bảng giá", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

23. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "quản lý bảng giá", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hạn dùng và tự chọn giữ bản của mình hay lấy bản mới.

24. Thiếu số tiền. phụ huynh bỏ trống số tiền rồi bấm lưu: hệ thống không lưu, tô đỏ ô số tiền, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

25. Giá trị biên. Với hạn dùng bằng 1, "quản lý bảng giá" xử lý đúng theo quy tắc ở BR-TT-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

26. Số liệu đi kèm. Con số hiển thị trong "quản lý bảng giá" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

27. Dữ liệu dài. Khi hình thức thanh toán dài hơn chỗ hiển thị, "quản lý bảng giá" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

28. Tìm và lọc. phụ huynh gõ một phần số buổi còn lại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "quản lý bảng giá".

29. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "quản lý bảng giá"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

30. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "quản lý bảng giá", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số buổi còn lại và tự chọn giữ bản của mình hay lấy bản mới.

31. Danh sách rỗng. Khi chưa có dữ liệu nào để "quản lý bảng giá", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

32. Thứ tự việc. "quản lý bảng giá" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TT-03.

33. Gộp với việc liên quan. Khi "quản lý bảng giá" làm đổi hình thức thanh toán, các màn đang hiển thị hình thức thanh toán cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

34. Bàn phím. Làm được toàn bộ "quản lý bảng giá" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

35. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "quản lý bảng giá" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

36. Lùi một bước. Trong lúc làm "quản lý bảng giá", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

### Mã khuyến mãi khi bán gói

Căn cứ: CO-01. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Danh sách rỗng. Khi chưa có dữ liệu nào để "mã khuyến mãi khi bán gói", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

2. Gộp với việc liên quan. Khi "mã khuyến mãi khi bán gói" làm đổi hình thức thanh toán, các màn đang hiển thị hình thức thanh toán cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

3. Bàn phím. Làm được toàn bộ "mã khuyến mãi khi bán gói" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

4. Tìm và lọc. phụ huynh gõ một phần hạn dùng không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "mã khuyến mãi khi bán gói".

5. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "mã khuyến mãi khi bán gói", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của hình thức thanh toán và tự chọn giữ bản của mình hay lấy bản mới.

6. Giá trị biên. Với số buổi bằng 0, "mã khuyến mãi khi bán gói" xử lý đúng theo quy tắc ở CO-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Giải thích kết quả. Khi "mã khuyến mãi khi bán gói" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo CO-01.

8. Lùi một bước. Trong lúc làm "mã khuyến mãi khi bán gói", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

9. Số liệu đi kèm. Con số hiển thị trong "mã khuyến mãi khi bán gói" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

10. Đường chính. Khi quản lý làm "mã khuyến mãi khi bán gói" với đủ số buổi và hạn dùng hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

11. Đối chiếu với dữ liệu hiện có. Khi mở "mã khuyến mãi khi bán gói" lần đầu sau khi nhập dữ liệu cũ, hình thức thanh toán của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số tiền.

12. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mã khuyến mãi khi bán gói" thì thấy đúng từng giá trị của số tiền và số buổi còn lại, không bị đổi định dạng hay múi giờ.

13. Hiển thị cho từng vai. Cùng một bản ghi của "mã khuyến mãi khi bán gói", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

14. Giữ lịch sử. Sau khi "mã khuyến mãi khi bán gói" đổi số buổi còn lại, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

15. Trên điện thoại. Ở màn hẹp 390 px, "mã khuyến mãi khi bán gói" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, hạn dùng đọc được không phải kéo ngang.

16. Xác nhận trước việc khó hoàn lại. Trước khi "mã khuyến mãi khi bán gói" thay đổi số buổi còn lại đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

17. Thứ tự việc. "mã khuyến mãi khi bán gói" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo CO-01.

18. Dữ liệu dài. Khi hạn dùng dài hơn chỗ hiển thị, "mã khuyến mãi khi bán gói" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

19. Thời gian chờ. Khi "mã khuyến mãi khi bán gói" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

20. Ngày đặc biệt. Khi thao tác rơi vào ngày 29/02 của năm không nhuận, "mã khuyến mãi khi bán gói" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

21. Sai khuôn dạng. lễ tân nhập số buổi sai khuôn dạng ở "mã khuyến mãi khi bán gói": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

22. Thiếu số tiền. quản lý bỏ trống số tiền rồi bấm lưu: hệ thống không lưu, tô đỏ ô số tiền, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

23. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "mã khuyến mãi khi bán gói"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

24. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "mã khuyến mãi khi bán gói" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như CO-01 trên màn hình.

25. Đối chiếu với dữ liệu hiện có. Khi mở "mã khuyến mãi khi bán gói" lần đầu sau khi nhập dữ liệu cũ, số tiền của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu hạn dùng.

26. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "mã khuyến mãi khi bán gói" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như CO-01 trên màn hình.

27. Lùi một bước. Trong lúc làm "mã khuyến mãi khi bán gói", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

28. Hiển thị cho từng vai. Cùng một bản ghi của "mã khuyến mãi khi bán gói", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

29. Giải thích kết quả. Khi "mã khuyến mãi khi bán gói" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo CO-01.

30. Thứ tự việc. "mã khuyến mãi khi bán gói" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo CO-01.

31. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mã khuyến mãi khi bán gói" thì thấy đúng từng giá trị của hạn dùng và số buổi còn lại, không bị đổi định dạng hay múi giờ.

32. Thiếu số buổi. phụ huynh bỏ trống số buổi rồi bấm lưu: hệ thống không lưu, tô đỏ ô số buổi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

33. Đường chính. Khi quản lý làm "mã khuyến mãi khi bán gói" với đủ hạn dùng và số buổi còn lại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

34. Giá trị biên. Với số buổi còn lại bằng 10 (sĩ số tối đa của lớp khác), "mã khuyến mãi khi bán gói" xử lý đúng theo quy tắc ở CO-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

35. Thời gian chờ. Khi "mã khuyến mãi khi bán gói" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

36. Số liệu đi kèm. Con số hiển thị trong "mã khuyến mãi khi bán gói" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

## 2. Thông báo

### Gửi thông báo cho phụ huynh

Căn cứ: UC-10, YC-12. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Sai khuôn dạng. quản lý nhập nhóm nhận sai khuôn dạng ở "gửi thông báo cho phụ huynh": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

2. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "gửi thông báo cho phụ huynh", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của kênh nhận và tự chọn giữ bản của mình hay lấy bản mới.

3. Trên điện thoại. Ở màn hẹp 390 px, "gửi thông báo cho phụ huynh" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, nhóm nhận đọc được không phải kéo ngang.

4. Thứ tự việc. "gửi thông báo cho phụ huynh" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-10.

5. Tìm và lọc. lễ tân gõ một phần nội dung không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "gửi thông báo cho phụ huynh".

6. Dữ liệu dài. Khi nội dung dài hơn chỗ hiển thị, "gửi thông báo cho phụ huynh" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

7. Thiếu nhóm nhận. lễ tân bỏ trống nhóm nhận rồi bấm lưu: hệ thống không lưu, tô đỏ ô nhóm nhận, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

8. Đối chiếu với dữ liệu hiện có. Khi mở "gửi thông báo cho phụ huynh" lần đầu sau khi nhập dữ liệu cũ, nội dung của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu kênh nhận.

9. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "gửi thông báo cho phụ huynh" thì thấy đúng từng giá trị của kênh nhận và nhóm nhận, không bị đổi định dạng hay múi giờ.

10. Giá trị biên. Với tiêu đề bằng 10 (sĩ số tối đa của lớp khác), "gửi thông báo cho phụ huynh" xử lý đúng theo quy tắc ở UC-10: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

11. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "gửi thông báo cho phụ huynh" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-10 trên màn hình.

12. Xác nhận trước việc khó hoàn lại. Trước khi "gửi thông báo cho phụ huynh" thay đổi kênh nhận đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

13. Danh sách rỗng. Khi chưa có dữ liệu nào để "gửi thông báo cho phụ huynh", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

14. Giải thích kết quả. Khi "gửi thông báo cho phụ huynh" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-10.

15. Bàn phím. Làm được toàn bộ "gửi thông báo cho phụ huynh" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

16. Đường chính. Khi lễ tân làm "gửi thông báo cho phụ huynh" với đủ tiêu đề và nội dung hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

17. Gộp với việc liên quan. Khi "gửi thông báo cho phụ huynh" làm đổi nhóm nhận, các màn đang hiển thị nhóm nhận cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

18. Lùi một bước. Trong lúc làm "gửi thông báo cho phụ huynh", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

19. Giữ lịch sử. Sau khi "gửi thông báo cho phụ huynh" đổi nội dung, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

20. Thời gian chờ. Khi "gửi thông báo cho phụ huynh" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

21. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "gửi thông báo cho phụ huynh" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

22. Số liệu đi kèm. Con số hiển thị trong "gửi thông báo cho phụ huynh" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

23. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "gửi thông báo cho phụ huynh"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

24. Hiển thị cho từng vai. Cùng một bản ghi của "gửi thông báo cho phụ huynh", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

25. Bàn phím. Làm được toàn bộ "gửi thông báo cho phụ huynh" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

26. Tìm và lọc. quản lý gõ một phần nội dung không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "gửi thông báo cho phụ huynh".

27. Đối chiếu với dữ liệu hiện có. Khi mở "gửi thông báo cho phụ huynh" lần đầu sau khi nhập dữ liệu cũ, kênh nhận của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu nhóm nhận.

28. Hiển thị cho từng vai. Cùng một bản ghi của "gửi thông báo cho phụ huynh", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

29. Hai người cùng làm. Khi một lễ tân mở hai tab ở "gửi thông báo cho phụ huynh", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của nội dung và tự chọn giữ bản của mình hay lấy bản mới.

30. Gộp với việc liên quan. Khi "gửi thông báo cho phụ huynh" làm đổi nội dung, các màn đang hiển thị nội dung cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

31. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "gửi thông báo cho phụ huynh" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

32. Xác nhận trước việc khó hoàn lại. Trước khi "gửi thông báo cho phụ huynh" thay đổi nhóm nhận đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

33. Thời gian chờ. Khi "gửi thông báo cho phụ huynh" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

34. Số liệu đi kèm. Con số hiển thị trong "gửi thông báo cho phụ huynh" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

35. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "gửi thông báo cho phụ huynh"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

36. Giữ lịch sử. Sau khi "gửi thông báo cho phụ huynh" đổi nội dung, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

### Mục thông báo trên app

Căn cứ: UC-10. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Gộp với việc liên quan. Khi "mục thông báo trên app" làm đổi nhóm nhận, các màn đang hiển thị nhóm nhận cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

2. Trên điện thoại. Ở màn hẹp 390 px, "mục thông báo trên app" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, nhóm nhận đọc được không phải kéo ngang.

3. Hiển thị cho từng vai. Cùng một bản ghi của "mục thông báo trên app", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

4. Số liệu đi kèm. Con số hiển thị trong "mục thông báo trên app" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

5. Thời gian chờ. Khi "mục thông báo trên app" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

6. Giá trị biên. Với tiêu đề bằng 9999, "mục thông báo trên app" xử lý đúng theo quy tắc ở UC-10: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Lùi một bước. Trong lúc làm "mục thông báo trên app", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

8. Đối chiếu với dữ liệu hiện có. Khi mở "mục thông báo trên app" lần đầu sau khi nhập dữ liệu cũ, tiêu đề của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu kênh nhận.

9. Bàn phím. Làm được toàn bộ "mục thông báo trên app" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

10. Xác nhận trước việc khó hoàn lại. Trước khi "mục thông báo trên app" thay đổi tiêu đề đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

11. Tìm và lọc. lễ tân gõ một phần nội dung không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "mục thông báo trên app".

12. Danh sách rỗng. Khi chưa có dữ liệu nào để "mục thông báo trên app", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

13. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "mục thông báo trên app" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-10 trên màn hình.

14. Đường chính. Khi phụ huynh làm "mục thông báo trên app" với đủ kênh nhận và nội dung hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

15. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mục thông báo trên app" thì thấy đúng từng giá trị của kênh nhận và nội dung, không bị đổi định dạng hay múi giờ.

16. Thứ tự việc. "mục thông báo trên app" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-10.

17. Dữ liệu dài. Khi thời điểm gửi dài hơn chỗ hiển thị, "mục thông báo trên app" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

18. Giữ lịch sử. Sau khi "mục thông báo trên app" đổi nhóm nhận, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

19. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "mục thông báo trên app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của kênh nhận và tự chọn giữ bản của mình hay lấy bản mới.

20. Giải thích kết quả. Khi "mục thông báo trên app" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-10.

21. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "mục thông báo trên app" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

22. Thiếu thời điểm gửi. quản lý bỏ trống thời điểm gửi rồi bấm lưu: hệ thống không lưu, tô đỏ ô thời điểm gửi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

23. Sai khuôn dạng. lễ tân nhập kênh nhận sai khuôn dạng ở "mục thông báo trên app": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

24. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "mục thông báo trên app"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

25. Xác nhận trước việc khó hoàn lại. Trước khi "mục thông báo trên app" thay đổi tiêu đề đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

26. Trên điện thoại. Ở màn hẹp 390 px, "mục thông báo trên app" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, nội dung đọc được không phải kéo ngang.

27. Giải thích kết quả. Khi "mục thông báo trên app" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-10.

28. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "mục thông báo trên app"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

29. Giá trị biên. Với nhóm nhận bằng âm, "mục thông báo trên app" xử lý đúng theo quy tắc ở UC-10: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

30. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "mục thông báo trên app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của kênh nhận và tự chọn giữ bản của mình hay lấy bản mới.

31. Giữ lịch sử. Sau khi "mục thông báo trên app" đổi nhóm nhận, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

32. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mục thông báo trên app" thì thấy đúng từng giá trị của nhóm nhận và thời điểm gửi, không bị đổi định dạng hay múi giờ.

33. Thời gian chờ. Khi "mục thông báo trên app" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

34. Thứ tự việc. "mục thông báo trên app" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-10.

35. Tìm và lọc. lễ tân gõ một phần tiêu đề không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "mục thông báo trên app".

36. Gộp với việc liên quan. Khi "mục thông báo trên app" làm đổi thời điểm gửi, các màn đang hiển thị thời điểm gửi cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

### Cấu hình nhắc lịch tự động

Căn cứ: BR-TB-02. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "cấu hình nhắc lịch tự động", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của tiêu đề và tự chọn giữ bản của mình hay lấy bản mới.

2. Lùi một bước. Trong lúc làm "cấu hình nhắc lịch tự động", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

3. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "cấu hình nhắc lịch tự động" thì thấy đúng từng giá trị của thời điểm gửi và nhóm nhận, không bị đổi định dạng hay múi giờ.

4. Danh sách rỗng. Khi chưa có dữ liệu nào để "cấu hình nhắc lịch tự động", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

5. Tìm và lọc. lễ tân gõ một phần thời điểm gửi không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "cấu hình nhắc lịch tự động".

6. Gộp với việc liên quan. Khi "cấu hình nhắc lịch tự động" làm đổi thời điểm gửi, các màn đang hiển thị thời điểm gửi cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

7. Hiển thị cho từng vai. Cùng một bản ghi của "cấu hình nhắc lịch tự động", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

8. Trên điện thoại. Ở màn hẹp 390 px, "cấu hình nhắc lịch tự động" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, nội dung đọc được không phải kéo ngang.

9. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "cấu hình nhắc lịch tự động"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

10. Dữ liệu dài. Khi thời điểm gửi dài hơn chỗ hiển thị, "cấu hình nhắc lịch tự động" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

11. Giữ lịch sử. Sau khi "cấu hình nhắc lịch tự động" đổi kênh nhận, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

12. Giá trị biên. Với kênh nhận bằng 10 (sĩ số tối đa của lớp khác), "cấu hình nhắc lịch tự động" xử lý đúng theo quy tắc ở BR-TB-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

13. Giải thích kết quả. Khi "cấu hình nhắc lịch tự động" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo BR-TB-02.

14. Số liệu đi kèm. Con số hiển thị trong "cấu hình nhắc lịch tự động" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

15. Thứ tự việc. "cấu hình nhắc lịch tự động" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TB-02.

16. Đường chính. Khi quản lý làm "cấu hình nhắc lịch tự động" với đủ thời điểm gửi và nhóm nhận hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

17. Sai khuôn dạng. lễ tân nhập nhóm nhận sai khuôn dạng ở "cấu hình nhắc lịch tự động": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

18. Bàn phím. Làm được toàn bộ "cấu hình nhắc lịch tự động" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

19. Xác nhận trước việc khó hoàn lại. Trước khi "cấu hình nhắc lịch tự động" thay đổi thời điểm gửi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

20. Thời gian chờ. Khi "cấu hình nhắc lịch tự động" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

21. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "cấu hình nhắc lịch tự động" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TB-02 trên màn hình.

22. Thiếu thời điểm gửi. lễ tân bỏ trống thời điểm gửi rồi bấm lưu: hệ thống không lưu, tô đỏ ô thời điểm gửi, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

23. Đối chiếu với dữ liệu hiện có. Khi mở "cấu hình nhắc lịch tự động" lần đầu sau khi nhập dữ liệu cũ, thời điểm gửi của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu nội dung.

24. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "cấu hình nhắc lịch tự động" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

25. Giá trị biên. Với tiêu đề bằng 24 (gói lớn nhất), "cấu hình nhắc lịch tự động" xử lý đúng theo quy tắc ở BR-TB-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

26. Bàn phím. Làm được toàn bộ "cấu hình nhắc lịch tự động" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

27. Thiếu nhóm nhận. lễ tân bỏ trống nhóm nhận rồi bấm lưu: hệ thống không lưu, tô đỏ ô nhóm nhận, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

28. Danh sách rỗng. Khi chưa có dữ liệu nào để "cấu hình nhắc lịch tự động", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

29. Lùi một bước. Trong lúc làm "cấu hình nhắc lịch tự động", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

30. Tìm và lọc. lễ tân gõ một phần kênh nhận không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "cấu hình nhắc lịch tự động".

31. Dữ liệu dài. Khi thời điểm gửi dài hơn chỗ hiển thị, "cấu hình nhắc lịch tự động" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

32. Trên điện thoại. Ở màn hẹp 390 px, "cấu hình nhắc lịch tự động" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, nội dung đọc được không phải kéo ngang.

33. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "cấu hình nhắc lịch tự động" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-TB-02 trên màn hình.

34. Số liệu đi kèm. Con số hiển thị trong "cấu hình nhắc lịch tự động" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

35. Thứ tự việc. "cấu hình nhắc lịch tự động" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-TB-02.

36. Thời gian chờ. Khi "cấu hình nhắc lịch tự động" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

### Gửi SMS cho phụ huynh chưa cài app

Căn cứ: CO-02. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Trên điện thoại. Ở màn hẹp 390 px, "gửi sms cho phụ huynh chưa cài app" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, tiêu đề đọc được không phải kéo ngang.

2. Bàn phím. Làm được toàn bộ "gửi sms cho phụ huynh chưa cài app" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

3. Thứ tự việc. "gửi sms cho phụ huynh chưa cài app" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo CO-02.

4. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "gửi sms cho phụ huynh chưa cài app" thì thấy đúng từng giá trị của thời điểm gửi và nội dung, không bị đổi định dạng hay múi giờ.

5. Giá trị biên. Với thời điểm gửi bằng 10 (sĩ số tối đa của lớp khác), "gửi sms cho phụ huynh chưa cài app" xử lý đúng theo quy tắc ở CO-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

6. Danh sách rỗng. Khi chưa có dữ liệu nào để "gửi sms cho phụ huynh chưa cài app", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

7. Lùi một bước. Trong lúc làm "gửi sms cho phụ huynh chưa cài app", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

8. Hiển thị cho từng vai. Cùng một bản ghi của "gửi sms cho phụ huynh chưa cài app", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

9. Giải thích kết quả. Khi "gửi sms cho phụ huynh chưa cài app" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo CO-02.

10. Đường chính. Khi lễ tân làm "gửi sms cho phụ huynh chưa cài app" với đủ tiêu đề và nhóm nhận hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

11. Dữ liệu dài. Khi tiêu đề dài hơn chỗ hiển thị, "gửi sms cho phụ huynh chưa cài app" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

12. Sai khuôn dạng. lễ tân nhập thời điểm gửi sai khuôn dạng ở "gửi sms cho phụ huynh chưa cài app": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

13. Thời gian chờ. Khi "gửi sms cho phụ huynh chưa cài app" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

14. Đối chiếu với dữ liệu hiện có. Khi mở "gửi sms cho phụ huynh chưa cài app" lần đầu sau khi nhập dữ liệu cũ, nội dung của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu nhóm nhận.

15. Xác nhận trước việc khó hoàn lại. Trước khi "gửi sms cho phụ huynh chưa cài app" thay đổi nội dung đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

16. Thiếu nhóm nhận. phụ huynh bỏ trống nhóm nhận rồi bấm lưu: hệ thống không lưu, tô đỏ ô nhóm nhận, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

17. Tìm và lọc. lễ tân gõ một phần nội dung không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "gửi sms cho phụ huynh chưa cài app".

18. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "gửi sms cho phụ huynh chưa cài app" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như CO-02 trên màn hình.

19. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "gửi sms cho phụ huynh chưa cài app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của nhóm nhận và tự chọn giữ bản của mình hay lấy bản mới.

20. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "gửi sms cho phụ huynh chưa cài app"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

21. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "gửi sms cho phụ huynh chưa cài app" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

22. Gộp với việc liên quan. Khi "gửi sms cho phụ huynh chưa cài app" làm đổi kênh nhận, các màn đang hiển thị kênh nhận cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

23. Số liệu đi kèm. Con số hiển thị trong "gửi sms cho phụ huynh chưa cài app" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

24. Giữ lịch sử. Sau khi "gửi sms cho phụ huynh chưa cài app" đổi nhóm nhận, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

25. Giá trị biên. Với nhóm nhận bằng 9999, "gửi sms cho phụ huynh chưa cài app" xử lý đúng theo quy tắc ở CO-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

26. Danh sách rỗng. Khi chưa có dữ liệu nào để "gửi sms cho phụ huynh chưa cài app", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

27. Dữ liệu dài. Khi nhóm nhận dài hơn chỗ hiển thị, "gửi sms cho phụ huynh chưa cài app" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

28. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối của tháng, "gửi sms cho phụ huynh chưa cài app" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

29. Xác nhận trước việc khó hoàn lại. Trước khi "gửi sms cho phụ huynh chưa cài app" thay đổi nội dung đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Số liệu đi kèm. Con số hiển thị trong "gửi sms cho phụ huynh chưa cài app" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

31. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "gửi sms cho phụ huynh chưa cài app" thì thấy đúng từng giá trị của tiêu đề và thời điểm gửi, không bị đổi định dạng hay múi giờ.

32. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "gửi sms cho phụ huynh chưa cài app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của nhóm nhận và tự chọn giữ bản của mình hay lấy bản mới.

33. Trên điện thoại. Ở màn hẹp 390 px, "gửi sms cho phụ huynh chưa cài app" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, thời điểm gửi đọc được không phải kéo ngang.

34. Gộp với việc liên quan. Khi "gửi sms cho phụ huynh chưa cài app" làm đổi tiêu đề, các màn đang hiển thị tiêu đề cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

35. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "gửi sms cho phụ huynh chưa cài app" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như CO-02 trên màn hình.

36. Sai khuôn dạng. quản lý nhập thời điểm gửi sai khuôn dạng ở "gửi sms cho phụ huynh chưa cài app": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

## 3. Báo cáo

### Báo cáo chuyên cần

Căn cứ: UC-11, YC-13. Vai liên quan: quản lý.

1. Đối chiếu với dữ liệu hiện có. Khi mở "báo cáo chuyên cần" lần đầu sau khi nhập dữ liệu cũ, gói học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

2. Gộp với việc liên quan. Khi "báo cáo chuyên cần" làm đổi khoảng ngày, các màn đang hiển thị khoảng ngày cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

3. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "báo cáo chuyên cần"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

4. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "báo cáo chuyên cần" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

5. Bàn phím. Làm được toàn bộ "báo cáo chuyên cần" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

6. Lùi một bước. Trong lúc làm "báo cáo chuyên cần", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

7. Thứ tự việc. "báo cáo chuyên cần" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-11.

8. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "báo cáo chuyên cần", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

9. Giải thích kết quả. Khi "báo cáo chuyên cần" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-11.

10. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "báo cáo chuyên cần" thì thấy đúng từng giá trị của khoảng ngày và gói học, không bị đổi định dạng hay múi giờ.

11. Giữ lịch sử. Sau khi "báo cáo chuyên cần" đổi gói học, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

12. Hiển thị cho từng vai. Cùng một bản ghi của "báo cáo chuyên cần", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

13. Số liệu đi kèm. Con số hiển thị trong "báo cáo chuyên cần" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

14. Đường chính. Khi quản lý làm "báo cáo chuyên cần" với đủ huấn luyện viên và gói học hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

15. Trên điện thoại. Ở màn hẹp 390 px, "báo cáo chuyên cần" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, lớp đọc được không phải kéo ngang.

16. Tìm và lọc. quản lý gõ một phần huấn luyện viên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "báo cáo chuyên cần".

17. Thời gian chờ. Khi "báo cáo chuyên cần" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

18. Thiếu huấn luyện viên. quản lý bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

19. Sai khuôn dạng. quản lý nhập gói học sai khuôn dạng ở "báo cáo chuyên cần": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

20. Xác nhận trước việc khó hoàn lại. Trước khi "báo cáo chuyên cần" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Giá trị biên. Với cấp độ bằng 0, "báo cáo chuyên cần" xử lý đúng theo quy tắc ở UC-11: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

22. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "báo cáo chuyên cần" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

23. Danh sách rỗng. Khi chưa có dữ liệu nào để "báo cáo chuyên cần", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

24. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "báo cáo chuyên cần" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-11 trên màn hình.

25. Bàn phím. Làm được toàn bộ "báo cáo chuyên cần" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

26. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "báo cáo chuyên cần" thì thấy đúng từng giá trị của khoảng ngày và lớp, không bị đổi định dạng hay múi giờ.

27. Trên điện thoại. Ở màn hẹp 390 px, "báo cáo chuyên cần" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, khoảng ngày đọc được không phải kéo ngang.

28. Đối chiếu với dữ liệu hiện có. Khi mở "báo cáo chuyên cần" lần đầu sau khi nhập dữ liệu cũ, gói học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu khoảng ngày.

29. Xác nhận trước việc khó hoàn lại. Trước khi "báo cáo chuyên cần" thay đổi lớp đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Lùi một bước. Trong lúc làm "báo cáo chuyên cần", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

31. Hai người cùng làm. Khi một lễ tân mở hai tab ở "báo cáo chuyên cần", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

32. Giữ lịch sử. Sau khi "báo cáo chuyên cần" đổi cấp độ, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

33. Số liệu đi kèm. Con số hiển thị trong "báo cáo chuyên cần" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

34. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "báo cáo chuyên cần" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-11 trên màn hình.

35. Thiếu lớp. quản lý bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

36. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "báo cáo chuyên cần"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

### Báo cáo doanh thu

Căn cứ: UC-11, YC-13. Vai liên quan: quản lý.

1. Tìm và lọc. quản lý gõ một phần lớp không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "báo cáo doanh thu".

2. Đường chính. Khi quản lý làm "báo cáo doanh thu" với đủ cấp độ và gói học hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "báo cáo doanh thu" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-11 trên màn hình.

4. Đối chiếu với dữ liệu hiện có. Khi mở "báo cáo doanh thu" lần đầu sau khi nhập dữ liệu cũ, huấn luyện viên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

5. Thứ tự việc. "báo cáo doanh thu" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-11.

6. Giá trị biên. Với khoảng ngày bằng 9999, "báo cáo doanh thu" xử lý đúng theo quy tắc ở UC-11: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "báo cáo doanh thu" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

8. Số liệu đi kèm. Con số hiển thị trong "báo cáo doanh thu" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

9. Dữ liệu dài. Khi gói học dài hơn chỗ hiển thị, "báo cáo doanh thu" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

10. Trên điện thoại. Ở màn hẹp 390 px, "báo cáo doanh thu" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, huấn luyện viên đọc được không phải kéo ngang.

11. Xác nhận trước việc khó hoàn lại. Trước khi "báo cáo doanh thu" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

12. Giải thích kết quả. Khi "báo cáo doanh thu" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-11.

13. Bàn phím. Làm được toàn bộ "báo cáo doanh thu" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

14. Giữ lịch sử. Sau khi "báo cáo doanh thu" đổi khoảng ngày, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

15. Hiển thị cho từng vai. Cùng một bản ghi của "báo cáo doanh thu", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

16. Thiếu gói học. quản lý bỏ trống gói học rồi bấm lưu: hệ thống không lưu, tô đỏ ô gói học, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

17. Thời gian chờ. Khi "báo cáo doanh thu" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

18. Gộp với việc liên quan. Khi "báo cáo doanh thu" làm đổi khoảng ngày, các màn đang hiển thị khoảng ngày cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

19. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "báo cáo doanh thu" thì thấy đúng từng giá trị của lớp và cấp độ, không bị đổi định dạng hay múi giờ.

20. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "báo cáo doanh thu"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

21. Lùi một bước. Trong lúc làm "báo cáo doanh thu", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

22. Sai khuôn dạng. quản lý nhập lớp sai khuôn dạng ở "báo cáo doanh thu": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

23. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "báo cáo doanh thu", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

24. Danh sách rỗng. Khi chưa có dữ liệu nào để "báo cáo doanh thu", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

25. Giải thích kết quả. Khi "báo cáo doanh thu" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-11.

26. Đối chiếu với dữ liệu hiện có. Khi mở "báo cáo doanh thu" lần đầu sau khi nhập dữ liệu cũ, gói học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lớp.

27. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "báo cáo doanh thu" thì thấy đúng từng giá trị của lớp và cấp độ, không bị đổi định dạng hay múi giờ.

28. Thời gian chờ. Khi "báo cáo doanh thu" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

29. Giữ lịch sử. Sau khi "báo cáo doanh thu" đổi khoảng ngày, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

30. Dữ liệu dài. Khi gói học dài hơn chỗ hiển thị, "báo cáo doanh thu" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

31. Thiếu khoảng ngày. quản lý bỏ trống khoảng ngày rồi bấm lưu: hệ thống không lưu, tô đỏ ô khoảng ngày, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

32. Lùi một bước. Trong lúc làm "báo cáo doanh thu", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

33. Số liệu đi kèm. Con số hiển thị trong "báo cáo doanh thu" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

34. Danh sách rỗng. Khi chưa có dữ liệu nào để "báo cáo doanh thu", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

35. Bàn phím. Làm được toàn bộ "báo cáo doanh thu" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

36. Đường chính. Khi quản lý làm "báo cáo doanh thu" với đủ gói học và cấp độ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

### Xuất báo cáo ra Excel

Căn cứ: các tài liệu yêu cầu. Vai liên quan: quản lý.

1. Danh sách rỗng. Khi chưa có dữ liệu nào để "xuất báo cáo ra excel", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

2. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "xuất báo cáo ra excel"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "xuất báo cáo ra excel" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như các tài liệu yêu cầu trên màn hình.

4. Tìm và lọc. quản lý gõ một phần khoảng ngày không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "xuất báo cáo ra excel".

5. Giá trị biên. Với khoảng ngày bằng có phần thập phân, "xuất báo cáo ra excel" xử lý đúng theo quy tắc ở các tài liệu yêu cầu: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

6. Gộp với việc liên quan. Khi "xuất báo cáo ra excel" làm đổi khoảng ngày, các màn đang hiển thị khoảng ngày cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

7. Sai khuôn dạng. quản lý nhập lớp sai khuôn dạng ở "xuất báo cáo ra excel": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

8. Dữ liệu dài. Khi khoảng ngày dài hơn chỗ hiển thị, "xuất báo cáo ra excel" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

9. Hiển thị cho từng vai. Cùng một bản ghi của "xuất báo cáo ra excel", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

10. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "xuất báo cáo ra excel" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

11. Thời gian chờ. Khi "xuất báo cáo ra excel" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

12. Đối chiếu với dữ liệu hiện có. Khi mở "xuất báo cáo ra excel" lần đầu sau khi nhập dữ liệu cũ, gói học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu khoảng ngày.

13. Số liệu đi kèm. Con số hiển thị trong "xuất báo cáo ra excel" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

14. Thứ tự việc. "xuất báo cáo ra excel" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo các tài liệu yêu cầu.

15. Xác nhận trước việc khó hoàn lại. Trước khi "xuất báo cáo ra excel" thay đổi khoảng ngày đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

16. Giải thích kết quả. Khi "xuất báo cáo ra excel" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo các tài liệu yêu cầu.

17. Lùi một bước. Trong lúc làm "xuất báo cáo ra excel", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

18. Trên điện thoại. Ở màn hẹp 390 px, "xuất báo cáo ra excel" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, lớp đọc được không phải kéo ngang.

19. Bàn phím. Làm được toàn bộ "xuất báo cáo ra excel" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

20. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "xuất báo cáo ra excel", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

21. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "xuất báo cáo ra excel" thì thấy đúng từng giá trị của cấp độ và lớp, không bị đổi định dạng hay múi giờ.

22. Đường chính. Khi quản lý làm "xuất báo cáo ra excel" với đủ khoảng ngày và cấp độ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

23. Thiếu cấp độ. quản lý bỏ trống cấp độ rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

24. Giữ lịch sử. Sau khi "xuất báo cáo ra excel" đổi khoảng ngày, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

25. Số liệu đi kèm. Con số hiển thị trong "xuất báo cáo ra excel" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

26. Xác nhận trước việc khó hoàn lại. Trước khi "xuất báo cáo ra excel" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

27. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "xuất báo cáo ra excel" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

28. Dữ liệu dài. Khi cấp độ dài hơn chỗ hiển thị, "xuất báo cáo ra excel" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

29. Hiển thị cho từng vai. Cùng một bản ghi của "xuất báo cáo ra excel", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

30. Đối chiếu với dữ liệu hiện có. Khi mở "xuất báo cáo ra excel" lần đầu sau khi nhập dữ liệu cũ, cấp độ của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu gói học.

31. Giá trị biên. Với huấn luyện viên bằng 6 (sĩ số tối đa của lớp Làm quen nước), "xuất báo cáo ra excel" xử lý đúng theo quy tắc ở các tài liệu yêu cầu: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

32. Bàn phím. Làm được toàn bộ "xuất báo cáo ra excel" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

33. Giữ lịch sử. Sau khi "xuất báo cáo ra excel" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

34. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "xuất báo cáo ra excel" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như các tài liệu yêu cầu trên màn hình.

35. Giải thích kết quả. Khi "xuất báo cáo ra excel" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo các tài liệu yêu cầu.

36. Gộp với việc liên quan. Khi "xuất báo cáo ra excel" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

## 4. Quản trị và quyền

### Tài khoản nhân viên và phân quyền

Căn cứ: UC-12, YC-14. Vai liên quan: quản lý, lễ tân.

1. Đường chính. Khi quản lý làm "tài khoản nhân viên và phân quyền" với đủ vai trò và tên đăng nhập hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

2. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "tài khoản nhân viên và phân quyền"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

3. Trên điện thoại. Ở màn hẹp 390 px, "tài khoản nhân viên và phân quyền" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, số điện thoại đọc được không phải kéo ngang.

4. Danh sách rỗng. Khi chưa có dữ liệu nào để "tài khoản nhân viên và phân quyền", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

5. Giữ lịch sử. Sau khi "tài khoản nhân viên và phân quyền" đổi số điện thoại, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

6. Thời gian chờ. Khi "tài khoản nhân viên và phân quyền" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

7. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "tài khoản nhân viên và phân quyền" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

8. Giải thích kết quả. Khi "tài khoản nhân viên và phân quyền" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-12.

9. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "tài khoản nhân viên và phân quyền" thì thấy đúng từng giá trị của quyền và số điện thoại, không bị đổi định dạng hay múi giờ.

10. Giá trị biên. Với tên đăng nhập bằng 24 (gói lớn nhất), "tài khoản nhân viên và phân quyền" xử lý đúng theo quy tắc ở UC-12: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

11. Bàn phím. Làm được toàn bộ "tài khoản nhân viên và phân quyền" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

12. Thiếu vai trò. quản lý bỏ trống vai trò rồi bấm lưu: hệ thống không lưu, tô đỏ ô vai trò, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

13. Xác nhận trước việc khó hoàn lại. Trước khi "tài khoản nhân viên và phân quyền" thay đổi trạng thái tài khoản đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

14. Sai khuôn dạng. quản lý nhập số điện thoại sai khuôn dạng ở "tài khoản nhân viên và phân quyền": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

15. Dữ liệu dài. Khi quyền dài hơn chỗ hiển thị, "tài khoản nhân viên và phân quyền" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

16. Hiển thị cho từng vai. Cùng một bản ghi của "tài khoản nhân viên và phân quyền", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

17. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "tài khoản nhân viên và phân quyền", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số điện thoại và tự chọn giữ bản của mình hay lấy bản mới.

18. Số liệu đi kèm. Con số hiển thị trong "tài khoản nhân viên và phân quyền" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

19. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "tài khoản nhân viên và phân quyền" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-12 trên màn hình.

20. Lùi một bước. Trong lúc làm "tài khoản nhân viên và phân quyền", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

21. Đối chiếu với dữ liệu hiện có. Khi mở "tài khoản nhân viên và phân quyền" lần đầu sau khi nhập dữ liệu cũ, trạng thái tài khoản của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu vai trò.

22. Gộp với việc liên quan. Khi "tài khoản nhân viên và phân quyền" làm đổi trạng thái tài khoản, các màn đang hiển thị trạng thái tài khoản cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

23. Thứ tự việc. "tài khoản nhân viên và phân quyền" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-12.

24. Tìm và lọc. lễ tân gõ một phần quyền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "tài khoản nhân viên và phân quyền".

25. Gộp với việc liên quan. Khi "tài khoản nhân viên và phân quyền" làm đổi số điện thoại, các màn đang hiển thị số điện thoại cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

26. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "tài khoản nhân viên và phân quyền"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

27. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "tài khoản nhân viên và phân quyền" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-12 trên màn hình.

28. Giữ lịch sử. Sau khi "tài khoản nhân viên và phân quyền" đổi quyền, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

29. Xác nhận trước việc khó hoàn lại. Trước khi "tài khoản nhân viên và phân quyền" thay đổi trạng thái tài khoản đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Lùi một bước. Trong lúc làm "tài khoản nhân viên và phân quyền", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

31. Sai khuôn dạng. lễ tân nhập trạng thái tài khoản sai khuôn dạng ở "tài khoản nhân viên và phân quyền": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

32. Giá trị biên. Với trạng thái tài khoản bằng 24 (gói lớn nhất), "tài khoản nhân viên và phân quyền" xử lý đúng theo quy tắc ở UC-12: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

33. Danh sách rỗng. Khi chưa có dữ liệu nào để "tài khoản nhân viên và phân quyền", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

34. Trên điện thoại. Ở màn hẹp 390 px, "tài khoản nhân viên và phân quyền" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, vai trò đọc được không phải kéo ngang.

35. Thiếu quyền. quản lý bỏ trống quyền rồi bấm lưu: hệ thống không lưu, tô đỏ ô quyền, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

36. Số liệu đi kèm. Con số hiển thị trong "tài khoản nhân viên và phân quyền" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

### Nhật ký thao tác

Căn cứ: BR-QT-04, M-08. Vai liên quan: quản lý, lễ tân.

1. Tìm và lọc. quản lý gõ một phần số điện thoại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "nhật ký thao tác".

2. Số liệu đi kèm. Con số hiển thị trong "nhật ký thao tác" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

3. Bàn phím. Làm được toàn bộ "nhật ký thao tác" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

4. Hiển thị cho từng vai. Cùng một bản ghi của "nhật ký thao tác", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

5. Lùi một bước. Trong lúc làm "nhật ký thao tác", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

6. Giải thích kết quả. Khi "nhật ký thao tác" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo BR-QT-04.

7. Dữ liệu dài. Khi quyền dài hơn chỗ hiển thị, "nhật ký thao tác" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

8. Danh sách rỗng. Khi chưa có dữ liệu nào để "nhật ký thao tác", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

9. Trên điện thoại. Ở màn hẹp 390 px, "nhật ký thao tác" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, trạng thái tài khoản đọc được không phải kéo ngang.

10. Đường chính. Khi lễ tân làm "nhật ký thao tác" với đủ quyền và số điện thoại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

11. Giá trị biên. Với vai trò bằng âm, "nhật ký thao tác" xử lý đúng theo quy tắc ở BR-QT-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

12. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "nhật ký thao tác"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

13. Giữ lịch sử. Sau khi "nhật ký thao tác" đổi vai trò, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

14. Gộp với việc liên quan. Khi "nhật ký thao tác" làm đổi số điện thoại, các màn đang hiển thị số điện thoại cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

15. Đối chiếu với dữ liệu hiện có. Khi mở "nhật ký thao tác" lần đầu sau khi nhập dữ liệu cũ, số điện thoại của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu trạng thái tài khoản.

16. Thời gian chờ. Khi "nhật ký thao tác" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

17. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "nhật ký thao tác" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

18. Thiếu tên đăng nhập. lễ tân bỏ trống tên đăng nhập rồi bấm lưu: hệ thống không lưu, tô đỏ ô tên đăng nhập, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

19. Sai khuôn dạng. lễ tân nhập số điện thoại sai khuôn dạng ở "nhật ký thao tác": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

20. Xác nhận trước việc khó hoàn lại. Trước khi "nhật ký thao tác" thay đổi số điện thoại đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "nhật ký thao tác" thì thấy đúng từng giá trị của quyền và tên đăng nhập, không bị đổi định dạng hay múi giờ.

22. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "nhật ký thao tác", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của trạng thái tài khoản và tự chọn giữ bản của mình hay lấy bản mới.

23. Thứ tự việc. "nhật ký thao tác" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-QT-04.

24. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "nhật ký thao tác" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-QT-04 trên màn hình.

25. Gộp với việc liên quan. Khi "nhật ký thao tác" làm đổi số điện thoại, các màn đang hiển thị số điện thoại cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

26. Tìm và lọc. lễ tân gõ một phần quyền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "nhật ký thao tác".

27. Sai khuôn dạng. quản lý nhập quyền sai khuôn dạng ở "nhật ký thao tác": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

28. Đối chiếu với dữ liệu hiện có. Khi mở "nhật ký thao tác" lần đầu sau khi nhập dữ liệu cũ, trạng thái tài khoản của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu vai trò.

29. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "nhật ký thao tác" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

30. Trên điện thoại. Ở màn hẹp 390 px, "nhật ký thao tác" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, tên đăng nhập đọc được không phải kéo ngang.

31. Danh sách rỗng. Khi chưa có dữ liệu nào để "nhật ký thao tác", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

32. Số liệu đi kèm. Con số hiển thị trong "nhật ký thao tác" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

33. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "nhật ký thao tác", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của quyền và tự chọn giữ bản của mình hay lấy bản mới.

34. Đường chính. Khi quản lý làm "nhật ký thao tác" với đủ quyền và vai trò hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

35. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "nhật ký thao tác"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

36. Thiếu trạng thái tài khoản. lễ tân bỏ trống trạng thái tài khoản rồi bấm lưu: hệ thống không lưu, tô đỏ ô trạng thái tài khoản, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

### Đăng nhập app bằng số điện thoại và OTP

Căn cứ: NF-05, UC-06. Vai liên quan: quản lý, lễ tân.

1. Thứ tự việc. "đăng nhập app bằng số điện thoại và otp" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo NF-05.

2. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đăng nhập app bằng số điện thoại và otp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như NF-05 trên màn hình.

3. Sai khuôn dạng. lễ tân nhập trạng thái tài khoản sai khuôn dạng ở "đăng nhập app bằng số điện thoại và otp": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

4. Thời gian chờ. Khi "đăng nhập app bằng số điện thoại và otp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

5. Giữ lịch sử. Sau khi "đăng nhập app bằng số điện thoại và otp" đổi trạng thái tài khoản, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

6. Số liệu đi kèm. Con số hiển thị trong "đăng nhập app bằng số điện thoại và otp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

7. Trên điện thoại. Ở màn hẹp 390 px, "đăng nhập app bằng số điện thoại và otp" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, tên đăng nhập đọc được không phải kéo ngang.

8. Đường chính. Khi quản lý làm "đăng nhập app bằng số điện thoại và otp" với đủ tên đăng nhập và quyền hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

9. Tìm và lọc. lễ tân gõ một phần số điện thoại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đăng nhập app bằng số điện thoại và otp".

10. Hiển thị cho từng vai. Cùng một bản ghi của "đăng nhập app bằng số điện thoại và otp", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

11. Lùi một bước. Trong lúc làm "đăng nhập app bằng số điện thoại và otp", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

12. Đối chiếu với dữ liệu hiện có. Khi mở "đăng nhập app bằng số điện thoại và otp" lần đầu sau khi nhập dữ liệu cũ, trạng thái tài khoản của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu vai trò.

13. Dữ liệu dài. Khi tên đăng nhập dài hơn chỗ hiển thị, "đăng nhập app bằng số điện thoại và otp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

14. Xác nhận trước việc khó hoàn lại. Trước khi "đăng nhập app bằng số điện thoại và otp" thay đổi tên đăng nhập đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

15. Thiếu vai trò. quản lý bỏ trống vai trò rồi bấm lưu: hệ thống không lưu, tô đỏ ô vai trò, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

16. Gộp với việc liên quan. Khi "đăng nhập app bằng số điện thoại và otp" làm đổi số điện thoại, các màn đang hiển thị số điện thoại cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

17. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "đăng nhập app bằng số điện thoại và otp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

18. Giải thích kết quả. Khi "đăng nhập app bằng số điện thoại và otp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo NF-05.

19. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "đăng nhập app bằng số điện thoại và otp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của trạng thái tài khoản và tự chọn giữ bản của mình hay lấy bản mới.

20. Danh sách rỗng. Khi chưa có dữ liệu nào để "đăng nhập app bằng số điện thoại và otp", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

21. Giá trị biên. Với tên đăng nhập bằng 10 (sĩ số tối đa của lớp khác), "đăng nhập app bằng số điện thoại và otp" xử lý đúng theo quy tắc ở NF-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

22. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đăng nhập app bằng số điện thoại và otp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

23. Bàn phím. Làm được toàn bộ "đăng nhập app bằng số điện thoại và otp" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

24. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đăng nhập app bằng số điện thoại và otp" thì thấy đúng từng giá trị của quyền và vai trò, không bị đổi định dạng hay múi giờ.

25. Giá trị biên. Với trạng thái tài khoản bằng âm, "đăng nhập app bằng số điện thoại và otp" xử lý đúng theo quy tắc ở NF-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

26. Đối chiếu với dữ liệu hiện có. Khi mở "đăng nhập app bằng số điện thoại và otp" lần đầu sau khi nhập dữ liệu cũ, tên đăng nhập của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu quyền.

27. Hiển thị cho từng vai. Cùng một bản ghi của "đăng nhập app bằng số điện thoại và otp", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

28. Thiếu vai trò. quản lý bỏ trống vai trò rồi bấm lưu: hệ thống không lưu, tô đỏ ô vai trò, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

29. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "đăng nhập app bằng số điện thoại và otp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của trạng thái tài khoản và tự chọn giữ bản của mình hay lấy bản mới.

30. Thời gian chờ. Khi "đăng nhập app bằng số điện thoại và otp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

31. Sai khuôn dạng. lễ tân nhập trạng thái tài khoản sai khuôn dạng ở "đăng nhập app bằng số điện thoại và otp": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

32. Giữ lịch sử. Sau khi "đăng nhập app bằng số điện thoại và otp" đổi quyền, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

33. Giải thích kết quả. Khi "đăng nhập app bằng số điện thoại và otp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo NF-05.

34. Gộp với việc liên quan. Khi "đăng nhập app bằng số điện thoại và otp" làm đổi quyền, các màn đang hiển thị quyền cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

35. Tìm và lọc. quản lý gõ một phần số điện thoại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đăng nhập app bằng số điện thoại và otp".

36. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "đăng nhập app bằng số điện thoại và otp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

### Danh sách ngày nghỉ lễ

Căn cứ: BR-LI-04. Vai liên quan: quản lý, lễ tân.

1. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách ngày nghỉ lễ" lần đầu sau khi nhập dữ liệu cũ, trạng thái tài khoản của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu vai trò.

2. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách ngày nghỉ lễ", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

3. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "danh sách ngày nghỉ lễ"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

4. Dữ liệu dài. Khi vai trò dài hơn chỗ hiển thị, "danh sách ngày nghỉ lễ" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

5. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "danh sách ngày nghỉ lễ" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

6. Đường chính. Khi quản lý làm "danh sách ngày nghỉ lễ" với đủ tên đăng nhập và trạng thái tài khoản hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

7. Bàn phím. Làm được toàn bộ "danh sách ngày nghỉ lễ" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

8. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách ngày nghỉ lễ" thay đổi quyền đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

9. Thời gian chờ. Khi "danh sách ngày nghỉ lễ" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

10. Giá trị biên. Với vai trò bằng 24 (gói lớn nhất), "danh sách ngày nghỉ lễ" xử lý đúng theo quy tắc ở BR-LI-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

11. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "danh sách ngày nghỉ lễ", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của vai trò và tự chọn giữ bản của mình hay lấy bản mới.

12. Lùi một bước. Trong lúc làm "danh sách ngày nghỉ lễ", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

13. Số liệu đi kèm. Con số hiển thị trong "danh sách ngày nghỉ lễ" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

14. Gộp với việc liên quan. Khi "danh sách ngày nghỉ lễ" làm đổi vai trò, các màn đang hiển thị vai trò cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

15. Hiển thị cho từng vai. Cùng một bản ghi của "danh sách ngày nghỉ lễ", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

16. Giữ lịch sử. Sau khi "danh sách ngày nghỉ lễ" đổi quyền, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

17. Thứ tự việc. "danh sách ngày nghỉ lễ" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-LI-04.

18. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách ngày nghỉ lễ" thì thấy đúng từng giá trị của quyền và trạng thái tài khoản, không bị đổi định dạng hay múi giờ.

19. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách ngày nghỉ lễ" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-LI-04 trên màn hình.

20. Sai khuôn dạng. lễ tân nhập tên đăng nhập sai khuôn dạng ở "danh sách ngày nghỉ lễ": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

21. Thiếu vai trò. quản lý bỏ trống vai trò rồi bấm lưu: hệ thống không lưu, tô đỏ ô vai trò, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

22. Giải thích kết quả. Khi "danh sách ngày nghỉ lễ" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo BR-LI-04.

23. Trên điện thoại. Ở màn hẹp 390 px, "danh sách ngày nghỉ lễ" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, trạng thái tài khoản đọc được không phải kéo ngang.

24. Tìm và lọc. quản lý gõ một phần quyền không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách ngày nghỉ lễ".

25. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách ngày nghỉ lễ", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

26. Đường chính. Khi lễ tân làm "danh sách ngày nghỉ lễ" với đủ quyền và vai trò hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

27. Tìm và lọc. lễ tân gõ một phần số điện thoại không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách ngày nghỉ lễ".

28. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách ngày nghỉ lễ" lần đầu sau khi nhập dữ liệu cũ, tên đăng nhập của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu số điện thoại.

29. Trên điện thoại. Ở màn hẹp 390 px, "danh sách ngày nghỉ lễ" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, vai trò đọc được không phải kéo ngang.

30. Sai khuôn dạng. lễ tân nhập trạng thái tài khoản sai khuôn dạng ở "danh sách ngày nghỉ lễ": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

31. Giữ lịch sử. Sau khi "danh sách ngày nghỉ lễ" đổi số điện thoại, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

32. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách ngày nghỉ lễ" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-LI-04 trên màn hình.

33. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "danh sách ngày nghỉ lễ", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của trạng thái tài khoản và tự chọn giữ bản của mình hay lấy bản mới.

34. Dữ liệu dài. Khi tên đăng nhập dài hơn chỗ hiển thị, "danh sách ngày nghỉ lễ" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

35. Lùi một bước. Trong lúc làm "danh sách ngày nghỉ lễ", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

36. Số liệu đi kèm. Con số hiển thị trong "danh sách ngày nghỉ lễ" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

## 5. Khoá học và lớp

### Đánh giá tiến bộ học viên

Căn cứ: S-04. Vai liên quan: lễ tân, quản lý.

1. Giá trị biên. Với khung giờ bằng 24 (gói lớn nhất), "đánh giá tiến bộ học viên" xử lý đúng theo quy tắc ở S-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

2. Thời gian chờ. Khi "đánh giá tiến bộ học viên" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đánh giá tiến bộ học viên" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như S-04 trên màn hình.

4. Đối chiếu với dữ liệu hiện có. Khi mở "đánh giá tiến bộ học viên" lần đầu sau khi nhập dữ liệu cũ, khung giờ của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

5. Danh sách rỗng. Khi chưa có dữ liệu nào để "đánh giá tiến bộ học viên", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

6. Trên điện thoại. Ở màn hẹp 390 px, "đánh giá tiến bộ học viên" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, bể và làn đọc được không phải kéo ngang.

7. Giữ lịch sử. Sau khi "đánh giá tiến bộ học viên" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

8. Sai khuôn dạng. quản lý nhập sĩ số tối đa sai khuôn dạng ở "đánh giá tiến bộ học viên": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

9. Số liệu đi kèm. Con số hiển thị trong "đánh giá tiến bộ học viên" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

10. Thứ tự việc. "đánh giá tiến bộ học viên" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo S-04.

11. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "đánh giá tiến bộ học viên", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của sĩ số tối đa và tự chọn giữ bản của mình hay lấy bản mới.

12. Xác nhận trước việc khó hoàn lại. Trước khi "đánh giá tiến bộ học viên" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

13. Tìm và lọc. quản lý gõ một phần sĩ số tối đa không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đánh giá tiến bộ học viên".

14. Đường chính. Khi lễ tân làm "đánh giá tiến bộ học viên" với đủ bể và làn và cấp độ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

15. Giải thích kết quả. Khi "đánh giá tiến bộ học viên" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo S-04.

16. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "đánh giá tiến bộ học viên" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

17. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đánh giá tiến bộ học viên" thì thấy đúng từng giá trị của cấp độ và khung giờ, không bị đổi định dạng hay múi giờ.

18. Lùi một bước. Trong lúc làm "đánh giá tiến bộ học viên", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

19. Thiếu sĩ số tối đa. lễ tân bỏ trống sĩ số tối đa rồi bấm lưu: hệ thống không lưu, tô đỏ ô sĩ số tối đa, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

20. Dữ liệu dài. Khi cấp độ dài hơn chỗ hiển thị, "đánh giá tiến bộ học viên" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

21. Hiển thị cho từng vai. Cùng một bản ghi của "đánh giá tiến bộ học viên", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

22. Gộp với việc liên quan. Khi "đánh giá tiến bộ học viên" làm đổi bể và làn, các màn đang hiển thị bể và làn cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

23. Bàn phím. Làm được toàn bộ "đánh giá tiến bộ học viên" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

24. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đánh giá tiến bộ học viên"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

25. Thời gian chờ. Khi "đánh giá tiến bộ học viên" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

26. Đường chính. Khi lễ tân làm "đánh giá tiến bộ học viên" với đủ bể và làn và khung giờ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

27. Thứ tự việc. "đánh giá tiến bộ học viên" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo S-04.

28. Hai người cùng làm. Khi một lễ tân mở hai tab ở "đánh giá tiến bộ học viên", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của khung giờ và tự chọn giữ bản của mình hay lấy bản mới.

29. Giải thích kết quả. Khi "đánh giá tiến bộ học viên" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo S-04.

30. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "đánh giá tiến bộ học viên"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

31. Thiếu huấn luyện viên. quản lý bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

32. Lùi một bước. Trong lúc làm "đánh giá tiến bộ học viên", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

33. Số liệu đi kèm. Con số hiển thị trong "đánh giá tiến bộ học viên" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

34. Giữ lịch sử. Sau khi "đánh giá tiến bộ học viên" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

35. Giá trị biên. Với bể và làn bằng 1, "đánh giá tiến bộ học viên" xử lý đúng theo quy tắc ở S-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

36. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đánh giá tiến bộ học viên" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như S-04 trên màn hình.
