# Tiêu chí nghiệm thu · Trung tâm bơi Sóng Xanh

> Ngày: 2026-09-26 · Viết cho nhóm kiểm thử và chủ trung tâm duyệt từng chức năng của 22 chức năng đầu (học viên, lớp, lịch, điểm danh).

## Quy ước

Mỗi chức năng một mục. Mỗi kịch bản là một đoạn văn: tình huống, rồi kết quả phải thấy. Kịch bản không thay quy tắc: khi lệch với `BUSINESS-RULES-SONG-XANH.md`, `EDGE-CASES-SONG-XANH.md` hay `XUNG-DOT-SONG-XANH.md`, các tài liệu đó thắng. Mã `UC-`, `BR-`, `YC-`, `XD-` trỏ về tài liệu gốc.

## 1. Học viên và phụ huynh

### Đăng ký học viên mới

Căn cứ: UC-01, YC-01. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Gộp với việc liên quan. Khi "đăng ký học viên mới" làm đổi cấp độ hiện tại, các màn đang hiển thị cấp độ hiện tại cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

2. Giải thích kết quả. Khi "đăng ký học viên mới" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-01.

3. Xác nhận trước việc khó hoàn lại. Trước khi "đăng ký học viên mới" thay đổi cấp độ hiện tại đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

4. Tìm và lọc. lễ tân gõ một phần họ tên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đăng ký học viên mới".

5. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đăng ký học viên mới" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-01 trên màn hình.

6. Giữ lịch sử. Sau khi "đăng ký học viên mới" đổi ghi chú sức khoẻ, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

7. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đăng ký học viên mới"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

8. Bàn phím. Làm được toàn bộ "đăng ký học viên mới" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

9. Đường chính. Khi lễ tân làm "đăng ký học viên mới" với đủ số điện thoại phụ huynh và cấp độ hiện tại hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

10. Đối chiếu với dữ liệu hiện có. Khi mở "đăng ký học viên mới" lần đầu sau khi nhập dữ liệu cũ, ngày sinh của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu họ tên.

11. Số liệu đi kèm. Con số hiển thị trong "đăng ký học viên mới" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

12. Thiếu ghi chú sức khoẻ. lễ tân bỏ trống ghi chú sức khoẻ rồi bấm lưu: hệ thống không lưu, tô đỏ ô ghi chú sức khoẻ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

13. Thứ tự việc. "đăng ký học viên mới" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-01.

14. Hiển thị cho từng vai. Cùng một bản ghi của "đăng ký học viên mới", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

15. Lùi một bước. Trong lúc làm "đăng ký học viên mới", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

16. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "đăng ký học viên mới" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

17. Danh sách rỗng. Khi chưa có dữ liệu nào để "đăng ký học viên mới", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

18. Giá trị biên. Với cấp độ hiện tại bằng có phần thập phân, "đăng ký học viên mới" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

19. Thời gian chờ. Khi "đăng ký học viên mới" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

20. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đăng ký học viên mới" thì thấy đúng từng giá trị của ngày sinh và số điện thoại phụ huynh, không bị đổi định dạng hay múi giờ.

21. Dữ liệu dài. Khi số điện thoại phụ huynh dài hơn chỗ hiển thị, "đăng ký học viên mới" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

22. Sai khuôn dạng. lễ tân nhập họ tên sai khuôn dạng ở "đăng ký học viên mới": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

23. Trên điện thoại. Ở màn hẹp 390 px, "đăng ký học viên mới" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, ngày sinh đọc được không phải kéo ngang.

24. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "đăng ký học viên mới", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của họ tên và tự chọn giữ bản của mình hay lấy bản mới.

25. Thiếu ngày sinh. lễ tân bỏ trống ngày sinh rồi bấm lưu: hệ thống không lưu, tô đỏ ô ngày sinh, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

26. Sai khuôn dạng. lễ tân nhập ghi chú sức khoẻ sai khuôn dạng ở "đăng ký học viên mới": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

27. Dữ liệu dài. Khi ghi chú sức khoẻ dài hơn chỗ hiển thị, "đăng ký học viên mới" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

28. Hiển thị cho từng vai. Cùng một bản ghi của "đăng ký học viên mới", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

29. Giải thích kết quả. Khi "đăng ký học viên mới" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-01.

30. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đăng ký học viên mới"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

31. Bàn phím. Làm được toàn bộ "đăng ký học viên mới" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

32. Giữ lịch sử. Sau khi "đăng ký học viên mới" đổi ghi chú sức khoẻ, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

33. Thứ tự việc. "đăng ký học viên mới" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-01.

34. Giá trị biên. Với cấp độ hiện tại bằng 9999, "đăng ký học viên mới" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

35. Lùi một bước. Trong lúc làm "đăng ký học viên mới", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

36. Thời gian chờ. Khi "đăng ký học viên mới" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

### Tìm kiếm và danh sách học viên

Căn cứ: UC-01, BR-HV-01, YC-01. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "tìm kiếm và danh sách học viên", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số điện thoại phụ huynh và tự chọn giữ bản của mình hay lấy bản mới.

2. Gộp với việc liên quan. Khi "tìm kiếm và danh sách học viên" làm đổi ghi chú sức khoẻ, các màn đang hiển thị ghi chú sức khoẻ cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

3. Danh sách rỗng. Khi chưa có dữ liệu nào để "tìm kiếm và danh sách học viên", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

4. Giải thích kết quả. Khi "tìm kiếm và danh sách học viên" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-01.

5. Xác nhận trước việc khó hoàn lại. Trước khi "tìm kiếm và danh sách học viên" thay đổi họ tên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

6. Đường chính. Khi quản lý làm "tìm kiếm và danh sách học viên" với đủ ghi chú sức khoẻ và họ tên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

7. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "tìm kiếm và danh sách học viên"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

8. Hiển thị cho từng vai. Cùng một bản ghi của "tìm kiếm và danh sách học viên", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

9. Đối chiếu với dữ liệu hiện có. Khi mở "tìm kiếm và danh sách học viên" lần đầu sau khi nhập dữ liệu cũ, họ tên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ghi chú sức khoẻ.

10. Bàn phím. Làm được toàn bộ "tìm kiếm và danh sách học viên" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

11. Tìm và lọc. quản lý gõ một phần số điện thoại phụ huynh không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "tìm kiếm và danh sách học viên".

12. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "tìm kiếm và danh sách học viên" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

13. Thời gian chờ. Khi "tìm kiếm và danh sách học viên" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

14. Số liệu đi kèm. Con số hiển thị trong "tìm kiếm và danh sách học viên" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

15. Trên điện thoại. Ở màn hẹp 390 px, "tìm kiếm và danh sách học viên" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, họ tên đọc được không phải kéo ngang.

16. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "tìm kiếm và danh sách học viên" thì thấy đúng từng giá trị của cấp độ hiện tại và số điện thoại phụ huynh, không bị đổi định dạng hay múi giờ.

17. Lùi một bước. Trong lúc làm "tìm kiếm và danh sách học viên", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

18. Giá trị biên. Với họ tên bằng 10 (sĩ số tối đa của lớp khác), "tìm kiếm và danh sách học viên" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

19. Sai khuôn dạng. lễ tân nhập cấp độ hiện tại sai khuôn dạng ở "tìm kiếm và danh sách học viên": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

20. Thứ tự việc. "tìm kiếm và danh sách học viên" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-01.

21. Dữ liệu dài. Khi cấp độ hiện tại dài hơn chỗ hiển thị, "tìm kiếm và danh sách học viên" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

22. Giữ lịch sử. Sau khi "tìm kiếm và danh sách học viên" đổi ghi chú sức khoẻ, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

23. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "tìm kiếm và danh sách học viên" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-01 trên màn hình.

24. Thiếu cấp độ hiện tại. phụ huynh bỏ trống cấp độ hiện tại rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ hiện tại, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

25. Giá trị biên. Với cấp độ hiện tại bằng 10 (sĩ số tối đa của lớp khác), "tìm kiếm và danh sách học viên" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

26. Gộp với việc liên quan. Khi "tìm kiếm và danh sách học viên" làm đổi ngày sinh, các màn đang hiển thị ngày sinh cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

27. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối của tháng, "tìm kiếm và danh sách học viên" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

28. Trên điện thoại. Ở màn hẹp 390 px, "tìm kiếm và danh sách học viên" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, họ tên đọc được không phải kéo ngang.

29. Sai khuôn dạng. lễ tân nhập ngày sinh sai khuôn dạng ở "tìm kiếm và danh sách học viên": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

30. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "tìm kiếm và danh sách học viên", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của họ tên và tự chọn giữ bản của mình hay lấy bản mới.

31. Dữ liệu dài. Khi cấp độ hiện tại dài hơn chỗ hiển thị, "tìm kiếm và danh sách học viên" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

32. Danh sách rỗng. Khi chưa có dữ liệu nào để "tìm kiếm và danh sách học viên", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

33. Giữ lịch sử. Sau khi "tìm kiếm và danh sách học viên" đổi số điện thoại phụ huynh, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

34. Thiếu cấp độ hiện tại. quản lý bỏ trống cấp độ hiện tại rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ hiện tại, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

35. Xác nhận trước việc khó hoàn lại. Trước khi "tìm kiếm và danh sách học viên" thay đổi số điện thoại phụ huynh đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

36. Đối chiếu với dữ liệu hiện có. Khi mở "tìm kiếm và danh sách học viên" lần đầu sau khi nhập dữ liệu cũ, cấp độ hiện tại của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ngày sinh.

### Hồ sơ chi tiết học viên

Căn cứ: UC-01. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Giải thích kết quả. Khi "hồ sơ chi tiết học viên" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-01.

2. Trên điện thoại. Ở màn hẹp 390 px, "hồ sơ chi tiết học viên" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, họ tên đọc được không phải kéo ngang.

3. Đối chiếu với dữ liệu hiện có. Khi mở "hồ sơ chi tiết học viên" lần đầu sau khi nhập dữ liệu cũ, ngày sinh của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu họ tên.

4. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "hồ sơ chi tiết học viên" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

5. Lùi một bước. Trong lúc làm "hồ sơ chi tiết học viên", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

6. Bàn phím. Làm được toàn bộ "hồ sơ chi tiết học viên" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

7. Số liệu đi kèm. Con số hiển thị trong "hồ sơ chi tiết học viên" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

8. Dữ liệu dài. Khi họ tên dài hơn chỗ hiển thị, "hồ sơ chi tiết học viên" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

9. Thứ tự việc. "hồ sơ chi tiết học viên" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-01.

10. Danh sách rỗng. Khi chưa có dữ liệu nào để "hồ sơ chi tiết học viên", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

11. Sai khuôn dạng. lễ tân nhập cấp độ hiện tại sai khuôn dạng ở "hồ sơ chi tiết học viên": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

12. Giá trị biên. Với ngày sinh bằng 0, "hồ sơ chi tiết học viên" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

13. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "hồ sơ chi tiết học viên"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

14. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "hồ sơ chi tiết học viên" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-01 trên màn hình.

15. Gộp với việc liên quan. Khi "hồ sơ chi tiết học viên" làm đổi cấp độ hiện tại, các màn đang hiển thị cấp độ hiện tại cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

16. Tìm và lọc. phụ huynh gõ một phần số điện thoại phụ huynh không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "hồ sơ chi tiết học viên".

17. Hiển thị cho từng vai. Cùng một bản ghi của "hồ sơ chi tiết học viên", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

18. Giữ lịch sử. Sau khi "hồ sơ chi tiết học viên" đổi ngày sinh, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

19. Đường chính. Khi quản lý làm "hồ sơ chi tiết học viên" với đủ ghi chú sức khoẻ và họ tên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

20. Thời gian chờ. Khi "hồ sơ chi tiết học viên" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

21. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "hồ sơ chi tiết học viên", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của ghi chú sức khoẻ và tự chọn giữ bản của mình hay lấy bản mới.

22. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "hồ sơ chi tiết học viên" thì thấy đúng từng giá trị của ngày sinh và họ tên, không bị đổi định dạng hay múi giờ.

23. Thiếu ghi chú sức khoẻ. phụ huynh bỏ trống ghi chú sức khoẻ rồi bấm lưu: hệ thống không lưu, tô đỏ ô ghi chú sức khoẻ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

24. Xác nhận trước việc khó hoàn lại. Trước khi "hồ sơ chi tiết học viên" thay đổi họ tên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

25. Thời gian chờ. Khi "hồ sơ chi tiết học viên" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

26. Tìm và lọc. quản lý gõ một phần ngày sinh không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "hồ sơ chi tiết học viên".

27. Trên điện thoại. Ở màn hẹp 390 px, "hồ sơ chi tiết học viên" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, ngày sinh đọc được không phải kéo ngang.

28. Đối chiếu với dữ liệu hiện có. Khi mở "hồ sơ chi tiết học viên" lần đầu sau khi nhập dữ liệu cũ, số điện thoại phụ huynh của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ngày sinh.

29. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "hồ sơ chi tiết học viên" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

30. Thứ tự việc. "hồ sơ chi tiết học viên" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-01.

31. Lùi một bước. Trong lúc làm "hồ sơ chi tiết học viên", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

32. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "hồ sơ chi tiết học viên" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-01 trên màn hình.

33. Giá trị biên. Với cấp độ hiện tại bằng 24 (gói lớn nhất), "hồ sơ chi tiết học viên" xử lý đúng theo quy tắc ở UC-01: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

34. Bàn phím. Làm được toàn bộ "hồ sơ chi tiết học viên" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

35. Dữ liệu dài. Khi số điện thoại phụ huynh dài hơn chỗ hiển thị, "hồ sơ chi tiết học viên" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

36. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "hồ sơ chi tiết học viên" thì thấy đúng từng giá trị của số điện thoại phụ huynh và cấp độ hiện tại, không bị đổi định dạng hay múi giờ.

### Phụ huynh chọn con trên app

Căn cứ: BR-HV-03. Vai liên quan: lễ tân, quản lý, phụ huynh.

1. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh chọn con trên app", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

2. Giải thích kết quả. Khi "phụ huynh chọn con trên app" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo BR-HV-03.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh chọn con trên app" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-HV-03 trên màn hình.

4. Giữ lịch sử. Sau khi "phụ huynh chọn con trên app" đổi họ tên, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

5. Tìm và lọc. lễ tân gõ một phần ghi chú sức khoẻ không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh chọn con trên app".

6. Giá trị biên. Với cấp độ hiện tại bằng 24 (gói lớn nhất), "phụ huynh chọn con trên app" xử lý đúng theo quy tắc ở BR-HV-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh chọn con trên app" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, họ tên đọc được không phải kéo ngang.

8. Thiếu ngày sinh. lễ tân bỏ trống ngày sinh rồi bấm lưu: hệ thống không lưu, tô đỏ ô ngày sinh, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

9. Số liệu đi kèm. Con số hiển thị trong "phụ huynh chọn con trên app" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

10. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "phụ huynh chọn con trên app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của số điện thoại phụ huynh và tự chọn giữ bản của mình hay lấy bản mới.

11. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh chọn con trên app", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

12. Đường chính. Khi quản lý làm "phụ huynh chọn con trên app" với đủ số điện thoại phụ huynh và ngày sinh hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

13. Dữ liệu dài. Khi ngày sinh dài hơn chỗ hiển thị, "phụ huynh chọn con trên app" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

14. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "phụ huynh chọn con trên app" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

15. Lùi một bước. Trong lúc làm "phụ huynh chọn con trên app", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

16. Sai khuôn dạng. phụ huynh nhập họ tên sai khuôn dạng ở "phụ huynh chọn con trên app": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

17. Thứ tự việc. "phụ huynh chọn con trên app" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-HV-03.

18. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh chọn con trên app" thay đổi số điện thoại phụ huynh đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

19. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh chọn con trên app" lần đầu sau khi nhập dữ liệu cũ, số điện thoại phụ huynh của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ghi chú sức khoẻ.

20. Bàn phím. Làm được toàn bộ "phụ huynh chọn con trên app" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

21. Thời gian chờ. Khi "phụ huynh chọn con trên app" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

22. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh chọn con trên app" thì thấy đúng từng giá trị của số điện thoại phụ huynh và ghi chú sức khoẻ, không bị đổi định dạng hay múi giờ.

23. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh chọn con trên app"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

24. Gộp với việc liên quan. Khi "phụ huynh chọn con trên app" làm đổi cấp độ hiện tại, các màn đang hiển thị cấp độ hiện tại cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

25. Sai khuôn dạng. phụ huynh nhập họ tên sai khuôn dạng ở "phụ huynh chọn con trên app": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

26. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh chọn con trên app" lần đầu sau khi nhập dữ liệu cũ, số điện thoại phụ huynh của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu họ tên.

27. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "phụ huynh chọn con trên app", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của ghi chú sức khoẻ và tự chọn giữ bản của mình hay lấy bản mới.

28. Tìm và lọc. phụ huynh gõ một phần họ tên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh chọn con trên app".

29. Đường chính. Khi lễ tân làm "phụ huynh chọn con trên app" với đủ họ tên và số điện thoại phụ huynh hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

30. Thứ tự việc. "phụ huynh chọn con trên app" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-HV-03.

31. Gộp với việc liên quan. Khi "phụ huynh chọn con trên app" làm đổi ghi chú sức khoẻ, các màn đang hiển thị ghi chú sức khoẻ cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

32. Số liệu đi kèm. Con số hiển thị trong "phụ huynh chọn con trên app" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

33. Lùi một bước. Trong lúc làm "phụ huynh chọn con trên app", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

34. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh chọn con trên app", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

35. Bàn phím. Làm được toàn bộ "phụ huynh chọn con trên app" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

36. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh chọn con trên app"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

## 2. Khoá học và lớp

### Quản lý khoá học

Căn cứ: UC-03, YC-02. Vai liên quan: lễ tân, quản lý.

1. Danh sách rỗng. Khi chưa có dữ liệu nào để "quản lý khoá học", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

2. Hai người cùng làm. Khi một lễ tân mở hai tab ở "quản lý khoá học", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

3. Ngày đặc biệt. Khi thao tác rơi vào ngay sau 23:00, "quản lý khoá học" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

4. Tìm và lọc. quản lý gõ một phần bể và làn không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "quản lý khoá học".

5. Giải thích kết quả. Khi "quản lý khoá học" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-03.

6. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "quản lý khoá học" thì thấy đúng từng giá trị của cấp độ và sĩ số tối đa, không bị đổi định dạng hay múi giờ.

7. Đường chính. Khi quản lý làm "quản lý khoá học" với đủ cấp độ và sĩ số tối đa hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

8. Giữ lịch sử. Sau khi "quản lý khoá học" đổi sĩ số tối đa, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

9. Thứ tự việc. "quản lý khoá học" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-03.

10. Bàn phím. Làm được toàn bộ "quản lý khoá học" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

11. Giá trị biên. Với khung giờ bằng 10 (sĩ số tối đa của lớp khác), "quản lý khoá học" xử lý đúng theo quy tắc ở UC-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

12. Hiển thị cho từng vai. Cùng một bản ghi của "quản lý khoá học", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

13. Gộp với việc liên quan. Khi "quản lý khoá học" làm đổi bể và làn, các màn đang hiển thị bể và làn cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

14. Xác nhận trước việc khó hoàn lại. Trước khi "quản lý khoá học" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

15. Lùi một bước. Trong lúc làm "quản lý khoá học", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

16. Thời gian chờ. Khi "quản lý khoá học" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

17. Dữ liệu dài. Khi khung giờ dài hơn chỗ hiển thị, "quản lý khoá học" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

18. Thiếu bể và làn. lễ tân bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

19. Trên điện thoại. Ở màn hẹp 390 px, "quản lý khoá học" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, sĩ số tối đa đọc được không phải kéo ngang.

20. Đối chiếu với dữ liệu hiện có. Khi mở "quản lý khoá học" lần đầu sau khi nhập dữ liệu cũ, khung giờ của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

21. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "quản lý khoá học"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

22. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "quản lý khoá học" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-03 trên màn hình.

23. Sai khuôn dạng. lễ tân nhập bể và làn sai khuôn dạng ở "quản lý khoá học": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

24. Số liệu đi kèm. Con số hiển thị trong "quản lý khoá học" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

25. Sai khuôn dạng. lễ tân nhập sĩ số tối đa sai khuôn dạng ở "quản lý khoá học": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

26. Số liệu đi kèm. Con số hiển thị trong "quản lý khoá học" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

27. Gộp với việc liên quan. Khi "quản lý khoá học" làm đổi cấp độ, các màn đang hiển thị cấp độ cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

28. Giá trị biên. Với khung giờ bằng âm, "quản lý khoá học" xử lý đúng theo quy tắc ở UC-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

29. Tìm và lọc. quản lý gõ một phần cấp độ không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "quản lý khoá học".

30. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "quản lý khoá học", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của sĩ số tối đa và tự chọn giữ bản của mình hay lấy bản mới.

31. Lùi một bước. Trong lúc làm "quản lý khoá học", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

32. Thứ tự việc. "quản lý khoá học" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-03.

33. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "quản lý khoá học"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

34. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "quản lý khoá học" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

35. Đối chiếu với dữ liệu hiện có. Khi mở "quản lý khoá học" lần đầu sau khi nhập dữ liệu cũ, sĩ số tối đa của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

36. Đường chính. Khi quản lý làm "quản lý khoá học" với đủ sĩ số tối đa và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

### Mở lớp: HLV, khung giờ, bể và làn

Căn cứ: UC-03, BR-LH-02. Vai liên quan: lễ tân, quản lý.

1. Xác nhận trước việc khó hoàn lại. Trước khi "mở lớp: hlv, khung giờ, bể và làn" thay đổi khung giờ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

2. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "mở lớp: hlv, khung giờ, bể và làn"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

3. Thứ tự việc. "mở lớp: hlv, khung giờ, bể và làn" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-03.

4. Lùi một bước. Trong lúc làm "mở lớp: hlv, khung giờ, bể và làn", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

5. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mở lớp: hlv, khung giờ, bể và làn" thì thấy đúng từng giá trị của sĩ số tối đa và huấn luyện viên, không bị đổi định dạng hay múi giờ.

6. Đường chính. Khi lễ tân làm "mở lớp: hlv, khung giờ, bể và làn" với đủ cấp độ và khung giờ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

7. Bàn phím. Làm được toàn bộ "mở lớp: hlv, khung giờ, bể và làn" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

8. Số liệu đi kèm. Con số hiển thị trong "mở lớp: hlv, khung giờ, bể và làn" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

9. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "mở lớp: hlv, khung giờ, bể và làn", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

10. Thời gian chờ. Khi "mở lớp: hlv, khung giờ, bể và làn" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

11. Giải thích kết quả. Khi "mở lớp: hlv, khung giờ, bể và làn" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-03.

12. Hiển thị cho từng vai. Cùng một bản ghi của "mở lớp: hlv, khung giờ, bể và làn", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

13. Gộp với việc liên quan. Khi "mở lớp: hlv, khung giờ, bể và làn" làm đổi huấn luyện viên, các màn đang hiển thị huấn luyện viên cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

14. Danh sách rỗng. Khi chưa có dữ liệu nào để "mở lớp: hlv, khung giờ, bể và làn", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

15. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "mở lớp: hlv, khung giờ, bể và làn" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

16. Giá trị biên. Với khung giờ bằng 10 (sĩ số tối đa của lớp khác), "mở lớp: hlv, khung giờ, bể và làn" xử lý đúng theo quy tắc ở UC-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

17. Thiếu cấp độ. quản lý bỏ trống cấp độ rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

18. Giữ lịch sử. Sau khi "mở lớp: hlv, khung giờ, bể và làn" đổi khung giờ, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

19. Sai khuôn dạng. quản lý nhập sĩ số tối đa sai khuôn dạng ở "mở lớp: hlv, khung giờ, bể và làn": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

20. Đối chiếu với dữ liệu hiện có. Khi mở "mở lớp: hlv, khung giờ, bể và làn" lần đầu sau khi nhập dữ liệu cũ, bể và làn của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

21. Tìm và lọc. lễ tân gõ một phần cấp độ không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "mở lớp: hlv, khung giờ, bể và làn".

22. Dữ liệu dài. Khi sĩ số tối đa dài hơn chỗ hiển thị, "mở lớp: hlv, khung giờ, bể và làn" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

23. Trên điện thoại. Ở màn hẹp 390 px, "mở lớp: hlv, khung giờ, bể và làn" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, khung giờ đọc được không phải kéo ngang.

24. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "mở lớp: hlv, khung giờ, bể và làn" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-03 trên màn hình.

25. Tìm và lọc. quản lý gõ một phần sĩ số tối đa không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "mở lớp: hlv, khung giờ, bể và làn".

26. Xác nhận trước việc khó hoàn lại. Trước khi "mở lớp: hlv, khung giờ, bể và làn" thay đổi sĩ số tối đa đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

27. Giữ lịch sử. Sau khi "mở lớp: hlv, khung giờ, bể và làn" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

28. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "mở lớp: hlv, khung giờ, bể và làn"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

29. Thời gian chờ. Khi "mở lớp: hlv, khung giờ, bể và làn" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

30. Trên điện thoại. Ở màn hẹp 390 px, "mở lớp: hlv, khung giờ, bể và làn" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, sĩ số tối đa đọc được không phải kéo ngang.

31. Thiếu huấn luyện viên. lễ tân bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

32. Bàn phím. Làm được toàn bộ "mở lớp: hlv, khung giờ, bể và làn" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

33. Đường chính. Khi quản lý làm "mở lớp: hlv, khung giờ, bể và làn" với đủ sĩ số tối đa và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

34. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "mở lớp: hlv, khung giờ, bể và làn" thì thấy đúng từng giá trị của khung giờ và sĩ số tối đa, không bị đổi định dạng hay múi giờ.

35. Danh sách rỗng. Khi chưa có dữ liệu nào để "mở lớp: hlv, khung giờ, bể và làn", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

36. Sai khuôn dạng. quản lý nhập huấn luyện viên sai khuôn dạng ở "mở lớp: hlv, khung giờ, bể và làn": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

### Danh sách lớp, sĩ số và chỗ trống

Căn cứ: UC-04. Vai liên quan: lễ tân, quản lý.

1. Thời gian chờ. Khi "danh sách lớp, sĩ số và chỗ trống" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

2. Trên điện thoại. Ở màn hẹp 390 px, "danh sách lớp, sĩ số và chỗ trống" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, bể và làn đọc được không phải kéo ngang.

3. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "danh sách lớp, sĩ số và chỗ trống"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

4. Thứ tự việc. "danh sách lớp, sĩ số và chỗ trống" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-04.

5. Giải thích kết quả. Khi "danh sách lớp, sĩ số và chỗ trống" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-04.

6. Giữ lịch sử. Sau khi "danh sách lớp, sĩ số và chỗ trống" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

7. Bàn phím. Làm được toàn bộ "danh sách lớp, sĩ số và chỗ trống" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

8. Ngày đặc biệt. Khi thao tác rơi vào ngay sau 23:00, "danh sách lớp, sĩ số và chỗ trống" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

9. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách lớp, sĩ số và chỗ trống" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-04 trên màn hình.

10. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "danh sách lớp, sĩ số và chỗ trống", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của sĩ số tối đa và tự chọn giữ bản của mình hay lấy bản mới.

11. Tìm và lọc. lễ tân gõ một phần cấp độ không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách lớp, sĩ số và chỗ trống".

12. Số liệu đi kèm. Con số hiển thị trong "danh sách lớp, sĩ số và chỗ trống" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

13. Hiển thị cho từng vai. Cùng một bản ghi của "danh sách lớp, sĩ số và chỗ trống", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

14. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách lớp, sĩ số và chỗ trống" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

15. Gộp với việc liên quan. Khi "danh sách lớp, sĩ số và chỗ trống" làm đổi huấn luyện viên, các màn đang hiển thị huấn luyện viên cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

16. Sai khuôn dạng. quản lý nhập bể và làn sai khuôn dạng ở "danh sách lớp, sĩ số và chỗ trống": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

17. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách lớp, sĩ số và chỗ trống" lần đầu sau khi nhập dữ liệu cũ, huấn luyện viên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu khung giờ.

18. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách lớp, sĩ số và chỗ trống", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

19. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách lớp, sĩ số và chỗ trống" thì thấy đúng từng giá trị của cấp độ và bể và làn, không bị đổi định dạng hay múi giờ.

20. Thiếu sĩ số tối đa. quản lý bỏ trống sĩ số tối đa rồi bấm lưu: hệ thống không lưu, tô đỏ ô sĩ số tối đa, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

21. Đường chính. Khi lễ tân làm "danh sách lớp, sĩ số và chỗ trống" với đủ bể và làn và sĩ số tối đa hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

22. Lùi một bước. Trong lúc làm "danh sách lớp, sĩ số và chỗ trống", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

23. Giá trị biên. Với huấn luyện viên bằng 10 (sĩ số tối đa của lớp khác), "danh sách lớp, sĩ số và chỗ trống" xử lý đúng theo quy tắc ở UC-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

24. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "danh sách lớp, sĩ số và chỗ trống" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

25. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "danh sách lớp, sĩ số và chỗ trống", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

26. Thời gian chờ. Khi "danh sách lớp, sĩ số và chỗ trống" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

27. Số liệu đi kèm. Con số hiển thị trong "danh sách lớp, sĩ số và chỗ trống" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

28. Trên điện thoại. Ở màn hẹp 390 px, "danh sách lớp, sĩ số và chỗ trống" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, khung giờ đọc được không phải kéo ngang.

29. Thiếu cấp độ. lễ tân bỏ trống cấp độ rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

30. Lùi một bước. Trong lúc làm "danh sách lớp, sĩ số và chỗ trống", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

31. Tìm và lọc. quản lý gõ một phần sĩ số tối đa không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách lớp, sĩ số và chỗ trống".

32. Gộp với việc liên quan. Khi "danh sách lớp, sĩ số và chỗ trống" làm đổi sĩ số tối đa, các màn đang hiển thị sĩ số tối đa cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

33. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách lớp, sĩ số và chỗ trống", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

34. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "danh sách lớp, sĩ số và chỗ trống" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

35. Đường chính. Khi lễ tân làm "danh sách lớp, sĩ số và chỗ trống" với đủ huấn luyện viên và cấp độ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

36. Bàn phím. Làm được toàn bộ "danh sách lớp, sĩ số và chỗ trống" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

### Xếp học viên vào lớp

Căn cứ: UC-04, YC-03. Vai liên quan: lễ tân, quản lý.

1. Bàn phím. Làm được toàn bộ "xếp học viên vào lớp" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

2. Thứ tự việc. "xếp học viên vào lớp" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-04.

3. Giải thích kết quả. Khi "xếp học viên vào lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-04.

4. Lùi một bước. Trong lúc làm "xếp học viên vào lớp", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

5. Sai khuôn dạng. lễ tân nhập cấp độ sai khuôn dạng ở "xếp học viên vào lớp": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

6. Đường chính. Khi quản lý làm "xếp học viên vào lớp" với đủ sĩ số tối đa và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

7. Tìm và lọc. quản lý gõ một phần sĩ số tối đa không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "xếp học viên vào lớp".

8. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "xếp học viên vào lớp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

9. Giá trị biên. Với cấp độ bằng 6 (sĩ số tối đa của lớp Làm quen nước), "xếp học viên vào lớp" xử lý đúng theo quy tắc ở UC-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

10. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "xếp học viên vào lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-04 trên màn hình.

11. Giữ lịch sử. Sau khi "xếp học viên vào lớp" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

12. Gộp với việc liên quan. Khi "xếp học viên vào lớp" làm đổi cấp độ, các màn đang hiển thị cấp độ cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

13. Trên điện thoại. Ở màn hẹp 390 px, "xếp học viên vào lớp" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, cấp độ đọc được không phải kéo ngang.

14. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "xếp học viên vào lớp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

15. Thiếu cấp độ. lễ tân bỏ trống cấp độ rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

16. Danh sách rỗng. Khi chưa có dữ liệu nào để "xếp học viên vào lớp", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

17. Số liệu đi kèm. Con số hiển thị trong "xếp học viên vào lớp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

18. Dữ liệu dài. Khi cấp độ dài hơn chỗ hiển thị, "xếp học viên vào lớp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

19. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "xếp học viên vào lớp" thì thấy đúng từng giá trị của khung giờ và sĩ số tối đa, không bị đổi định dạng hay múi giờ.

20. Xác nhận trước việc khó hoàn lại. Trước khi "xếp học viên vào lớp" thay đổi sĩ số tối đa đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Đối chiếu với dữ liệu hiện có. Khi mở "xếp học viên vào lớp" lần đầu sau khi nhập dữ liệu cũ, cấp độ của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu khung giờ.

22. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "xếp học viên vào lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

23. Hiển thị cho từng vai. Cùng một bản ghi của "xếp học viên vào lớp", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

24. Thời gian chờ. Khi "xếp học viên vào lớp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

25. Hiển thị cho từng vai. Cùng một bản ghi của "xếp học viên vào lớp", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

26. Xác nhận trước việc khó hoàn lại. Trước khi "xếp học viên vào lớp" thay đổi sĩ số tối đa đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

27. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "xếp học viên vào lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

28. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "xếp học viên vào lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-04 trên màn hình.

29. Giữ lịch sử. Sau khi "xếp học viên vào lớp" đổi sĩ số tối đa, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

30. Thiếu bể và làn. quản lý bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

31. Thời gian chờ. Khi "xếp học viên vào lớp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

32. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "xếp học viên vào lớp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

33. Đường chính. Khi quản lý làm "xếp học viên vào lớp" với đủ huấn luyện viên và khung giờ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

34. Giải thích kết quả. Khi "xếp học viên vào lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-04.

35. Dữ liệu dài. Khi sĩ số tối đa dài hơn chỗ hiển thị, "xếp học viên vào lớp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

36. Đối chiếu với dữ liệu hiện có. Khi mở "xếp học viên vào lớp" lần đầu sau khi nhập dữ liệu cũ, sĩ số tối đa của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu khung giờ.

### Danh sách chờ của lớp

Căn cứ: BR-LH-04, M-02. Vai liên quan: lễ tân, quản lý.

1. Giữ lịch sử. Sau khi "danh sách chờ của lớp" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

2. Số liệu đi kèm. Con số hiển thị trong "danh sách chờ của lớp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách chờ của lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-LH-04 trên màn hình.

4. Lùi một bước. Trong lúc làm "danh sách chờ của lớp", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

5. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách chờ của lớp" thay đổi khung giờ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

6. Gộp với việc liên quan. Khi "danh sách chờ của lớp" làm đổi khung giờ, các màn đang hiển thị khung giờ cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

7. Thứ tự việc. "danh sách chờ của lớp" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-LH-04.

8. Giá trị biên. Với bể và làn bằng 0, "danh sách chờ của lớp" xử lý đúng theo quy tắc ở BR-LH-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

9. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "danh sách chờ của lớp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

10. Danh sách rỗng. Khi chưa có dữ liệu nào để "danh sách chờ của lớp", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

11. Đối chiếu với dữ liệu hiện có. Khi mở "danh sách chờ của lớp" lần đầu sau khi nhập dữ liệu cũ, cấp độ của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu huấn luyện viên.

12. Dữ liệu dài. Khi cấp độ dài hơn chỗ hiển thị, "danh sách chờ của lớp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

13. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách chờ của lớp" thì thấy đúng từng giá trị của bể và làn và khung giờ, không bị đổi định dạng hay múi giờ.

14. Thời gian chờ. Khi "danh sách chờ của lớp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

15. Trên điện thoại. Ở màn hẹp 390 px, "danh sách chờ của lớp" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, khung giờ đọc được không phải kéo ngang.

16. Hiển thị cho từng vai. Cùng một bản ghi của "danh sách chờ của lớp", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

17. Bàn phím. Làm được toàn bộ "danh sách chờ của lớp" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

18. Thiếu huấn luyện viên. quản lý bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

19. Đường chính. Khi quản lý làm "danh sách chờ của lớp" với đủ cấp độ và khung giờ hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

20. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "danh sách chờ của lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

21. Sai khuôn dạng. quản lý nhập bể và làn sai khuôn dạng ở "danh sách chờ của lớp": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

22. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "danh sách chờ của lớp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của cấp độ và tự chọn giữ bản của mình hay lấy bản mới.

23. Giải thích kết quả. Khi "danh sách chờ của lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo BR-LH-04.

24. Tìm và lọc. quản lý gõ một phần huấn luyện viên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "danh sách chờ của lớp".

25. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "danh sách chờ của lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-LH-04 trên màn hình.

26. Trên điện thoại. Ở màn hẹp 390 px, "danh sách chờ của lớp" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, bể và làn đọc được không phải kéo ngang.

27. Giá trị biên. Với bể và làn bằng âm, "danh sách chờ của lớp" xử lý đúng theo quy tắc ở BR-LH-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

28. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "danh sách chờ của lớp" thì thấy đúng từng giá trị của huấn luyện viên và sĩ số tối đa, không bị đổi định dạng hay múi giờ.

29. Lùi một bước. Trong lúc làm "danh sách chờ của lớp", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

30. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "danh sách chờ của lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

31. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối của tháng, "danh sách chờ của lớp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

32. Gộp với việc liên quan. Khi "danh sách chờ của lớp" làm đổi sĩ số tối đa, các màn đang hiển thị sĩ số tối đa cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

33. Xác nhận trước việc khó hoàn lại. Trước khi "danh sách chờ của lớp" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

34. Giải thích kết quả. Khi "danh sách chờ của lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo BR-LH-04.

35. Giữ lịch sử. Sau khi "danh sách chờ của lớp" đổi khung giờ, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

36. Số liệu đi kèm. Con số hiển thị trong "danh sách chờ của lớp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

### Học thử miễn phí

Căn cứ: YC-05, BR-LH-06, S-03. Vai liên quan: lễ tân, quản lý.

1. Trên điện thoại. Ở màn hẹp 390 px, "học thử miễn phí" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, huấn luyện viên đọc được không phải kéo ngang.

2. Giữ lịch sử. Sau khi "học thử miễn phí" đổi cấp độ, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

3. Đối chiếu với dữ liệu hiện có. Khi mở "học thử miễn phí" lần đầu sau khi nhập dữ liệu cũ, sĩ số tối đa của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu cấp độ.

4. Giải thích kết quả. Khi "học thử miễn phí" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo YC-05.

5. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "học thử miễn phí" thì thấy đúng từng giá trị của bể và làn và huấn luyện viên, không bị đổi định dạng hay múi giờ.

6. Tìm và lọc. quản lý gõ một phần cấp độ không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "học thử miễn phí".

7. Thiếu cấp độ. quản lý bỏ trống cấp độ rồi bấm lưu: hệ thống không lưu, tô đỏ ô cấp độ, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

8. Lùi một bước. Trong lúc làm "học thử miễn phí", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

9. Thứ tự việc. "học thử miễn phí" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo YC-05.

10. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "học thử miễn phí", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của sĩ số tối đa và tự chọn giữ bản của mình hay lấy bản mới.

11. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "học thử miễn phí"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

12. Gộp với việc liên quan. Khi "học thử miễn phí" làm đổi sĩ số tối đa, các màn đang hiển thị sĩ số tối đa cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

13. Xác nhận trước việc khó hoàn lại. Trước khi "học thử miễn phí" thay đổi cấp độ đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

14. Ngày đặc biệt. Khi thao tác rơi vào ngay sau 23:00, "học thử miễn phí" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

15. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "học thử miễn phí" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như YC-05 trên màn hình.

16. Thời gian chờ. Khi "học thử miễn phí" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

17. Đường chính. Khi lễ tân làm "học thử miễn phí" với đủ cấp độ và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

18. Giá trị biên. Với sĩ số tối đa bằng 9999, "học thử miễn phí" xử lý đúng theo quy tắc ở YC-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

19. Hiển thị cho từng vai. Cùng một bản ghi của "học thử miễn phí", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

20. Bàn phím. Làm được toàn bộ "học thử miễn phí" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

21. Danh sách rỗng. Khi chưa có dữ liệu nào để "học thử miễn phí", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

22. Số liệu đi kèm. Con số hiển thị trong "học thử miễn phí" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

23. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "học thử miễn phí" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

24. Sai khuôn dạng. lễ tân nhập cấp độ sai khuôn dạng ở "học thử miễn phí": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

25. Số liệu đi kèm. Con số hiển thị trong "học thử miễn phí" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

26. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "học thử miễn phí", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

27. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "học thử miễn phí" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như YC-05 trên màn hình.

28. Giữ lịch sử. Sau khi "học thử miễn phí" đổi sĩ số tối đa, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

29. Xác nhận trước việc khó hoàn lại. Trước khi "học thử miễn phí" thay đổi sĩ số tối đa đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "học thử miễn phí"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

31. Thiếu sĩ số tối đa. lễ tân bỏ trống sĩ số tối đa rồi bấm lưu: hệ thống không lưu, tô đỏ ô sĩ số tối đa, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

32. Trên điện thoại. Ở màn hẹp 390 px, "học thử miễn phí" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, huấn luyện viên đọc được không phải kéo ngang.

33. Giá trị biên. Với sĩ số tối đa bằng 9999, "học thử miễn phí" xử lý đúng theo quy tắc ở YC-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

34. Lùi một bước. Trong lúc làm "học thử miễn phí", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

35. Đường chính. Khi quản lý làm "học thử miễn phí" với đủ huấn luyện viên và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

36. Thời gian chờ. Khi "học thử miễn phí" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

## 3. Lịch và buổi học

### Lịch toàn trung tâm theo ngày và tuần

Căn cứ: YC-04. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Xác nhận trước việc khó hoàn lại. Trước khi "lịch toàn trung tâm theo ngày và tuần" thay đổi lớp đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

2. Đối chiếu với dữ liệu hiện có. Khi mở "lịch toàn trung tâm theo ngày và tuần" lần đầu sau khi nhập dữ liệu cũ, ngày học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu bể và làn.

3. Giải thích kết quả. Khi "lịch toàn trung tâm theo ngày và tuần" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo YC-04.

4. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "lịch toàn trung tâm theo ngày và tuần" thì thấy đúng từng giá trị của lớp và giờ bắt đầu, không bị đổi định dạng hay múi giờ.

5. Hiển thị cho từng vai. Cùng một bản ghi của "lịch toàn trung tâm theo ngày và tuần", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

6. Bàn phím. Làm được toàn bộ "lịch toàn trung tâm theo ngày và tuần" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

7. Thời gian chờ. Khi "lịch toàn trung tâm theo ngày và tuần" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

8. Tìm và lọc. phụ huynh gõ một phần huấn luyện viên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lịch toàn trung tâm theo ngày và tuần".

9. Đường chính. Khi huấn luyện viên làm "lịch toàn trung tâm theo ngày và tuần" với đủ lớp và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ huấn luyện viên vừa đứng.

10. Giữ lịch sử. Sau khi "lịch toàn trung tâm theo ngày và tuần" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và huấn luyện viên có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

11. Trên điện thoại. Ở màn hẹp 390 px, "lịch toàn trung tâm theo ngày và tuần" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, bể và làn đọc được không phải kéo ngang.

12. Sai khuôn dạng. lễ tân nhập ngày học sai khuôn dạng ở "lịch toàn trung tâm theo ngày và tuần": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

13. Thiếu lớp. quản lý bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

14. Thứ tự việc. "lịch toàn trung tâm theo ngày và tuần" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo YC-04.

15. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "lịch toàn trung tâm theo ngày và tuần" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

16. Gộp với việc liên quan. Khi "lịch toàn trung tâm theo ngày và tuần" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

17. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "lịch toàn trung tâm theo ngày và tuần"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

18. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "lịch toàn trung tâm theo ngày và tuần", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

19. Lùi một bước. Trong lúc làm "lịch toàn trung tâm theo ngày và tuần", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

20. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch toàn trung tâm theo ngày và tuần", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

21. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "lịch toàn trung tâm theo ngày và tuần" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như YC-04 trên màn hình.

22. Số liệu đi kèm. Con số hiển thị trong "lịch toàn trung tâm theo ngày và tuần" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

23. Dữ liệu dài. Khi lớp dài hơn chỗ hiển thị, "lịch toàn trung tâm theo ngày và tuần" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

24. Giá trị biên. Với ngày học bằng 1, "lịch toàn trung tâm theo ngày và tuần" xử lý đúng theo quy tắc ở YC-04: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

25. Dữ liệu dài. Khi ngày học dài hơn chỗ hiển thị, "lịch toàn trung tâm theo ngày và tuần" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

26. Xác nhận trước việc khó hoàn lại. Trước khi "lịch toàn trung tâm theo ngày và tuần" thay đổi ngày học đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

27. Giải thích kết quả. Khi "lịch toàn trung tâm theo ngày và tuần" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo YC-04.

28. Giữ lịch sử. Sau khi "lịch toàn trung tâm theo ngày và tuần" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

29. Đường chính. Khi quản lý làm "lịch toàn trung tâm theo ngày và tuần" với đủ ngày học và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

30. Lùi một bước. Trong lúc làm "lịch toàn trung tâm theo ngày và tuần", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

31. Thiếu bể và làn. lễ tân bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

32. Gộp với việc liên quan. Khi "lịch toàn trung tâm theo ngày và tuần" làm đổi giờ bắt đầu, các màn đang hiển thị giờ bắt đầu cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

33. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "lịch toàn trung tâm theo ngày và tuần", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

34. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch toàn trung tâm theo ngày và tuần", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

35. Thời gian chờ. Khi "lịch toàn trung tâm theo ngày và tuần" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

36. Quyền. Chỉ huấn luyện viên và các vai được ma trận quyền cho phép mới thấy nút của "lịch toàn trung tâm theo ngày và tuần"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

### Lịch dạy của HLV, chỉ lớp mình

Căn cứ: BR-QT-02. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch dạy của hlv, chỉ lớp mình", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

2. Hiển thị cho từng vai. Cùng một bản ghi của "lịch dạy của hlv, chỉ lớp mình", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

3. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "lịch dạy của hlv, chỉ lớp mình" thì thấy đúng từng giá trị của giờ bắt đầu và lớp, không bị đổi định dạng hay múi giờ.

4. Đối chiếu với dữ liệu hiện có. Khi mở "lịch dạy của hlv, chỉ lớp mình" lần đầu sau khi nhập dữ liệu cũ, ngày học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu bể và làn.

5. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "lịch dạy của hlv, chỉ lớp mình" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

6. Đường chính. Khi phụ huynh làm "lịch dạy của hlv, chỉ lớp mình" với đủ bể và làn và ngày học hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

7. Gộp với việc liên quan. Khi "lịch dạy của hlv, chỉ lớp mình" làm đổi giờ bắt đầu, các màn đang hiển thị giờ bắt đầu cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

8. Sai khuôn dạng. phụ huynh nhập bể và làn sai khuôn dạng ở "lịch dạy của hlv, chỉ lớp mình": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

9. Số liệu đi kèm. Con số hiển thị trong "lịch dạy của hlv, chỉ lớp mình" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

10. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "lịch dạy của hlv, chỉ lớp mình" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-QT-02 trên màn hình.

11. Giải thích kết quả. Khi "lịch dạy của hlv, chỉ lớp mình" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo BR-QT-02.

12. Giá trị biên. Với huấn luyện viên bằng 9999, "lịch dạy của hlv, chỉ lớp mình" xử lý đúng theo quy tắc ở BR-QT-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

13. Thiếu huấn luyện viên. huấn luyện viên bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

14. Thời gian chờ. Khi "lịch dạy của hlv, chỉ lớp mình" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

15. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "lịch dạy của hlv, chỉ lớp mình" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

16. Bàn phím. Làm được toàn bộ "lịch dạy của hlv, chỉ lớp mình" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

17. Lùi một bước. Trong lúc làm "lịch dạy của hlv, chỉ lớp mình", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

18. Trên điện thoại. Ở màn hẹp 390 px, "lịch dạy của hlv, chỉ lớp mình" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, lớp đọc được không phải kéo ngang.

19. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "lịch dạy của hlv, chỉ lớp mình"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

20. Giữ lịch sử. Sau khi "lịch dạy của hlv, chỉ lớp mình" đổi giờ bắt đầu, bản ghi giữ giá trị cũ để đối chiếu, và huấn luyện viên có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

21. Xác nhận trước việc khó hoàn lại. Trước khi "lịch dạy của hlv, chỉ lớp mình" thay đổi bể và làn đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

22. Thứ tự việc. "lịch dạy của hlv, chỉ lớp mình" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-QT-02.

23. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "lịch dạy của hlv, chỉ lớp mình", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

24. Tìm và lọc. lễ tân gõ một phần bể và làn không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lịch dạy của hlv, chỉ lớp mình".

25. Xác nhận trước việc khó hoàn lại. Trước khi "lịch dạy của hlv, chỉ lớp mình" thay đổi ngày học đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

26. Sai khuôn dạng. lễ tân nhập ngày học sai khuôn dạng ở "lịch dạy của hlv, chỉ lớp mình": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

27. Gộp với việc liên quan. Khi "lịch dạy của hlv, chỉ lớp mình" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

28. Bàn phím. Làm được toàn bộ "lịch dạy của hlv, chỉ lớp mình" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

29. Danh sách rỗng. Khi chưa có dữ liệu nào để "lịch dạy của hlv, chỉ lớp mình", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

30. Hiển thị cho từng vai. Cùng một bản ghi của "lịch dạy của hlv, chỉ lớp mình", huấn luyện viên thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

31. Số liệu đi kèm. Con số hiển thị trong "lịch dạy của hlv, chỉ lớp mình" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

32. Lùi một bước. Trong lúc làm "lịch dạy của hlv, chỉ lớp mình", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

33. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "lịch dạy của hlv, chỉ lớp mình" thì thấy đúng từng giá trị của bể và làn và huấn luyện viên, không bị đổi định dạng hay múi giờ.

34. Giải thích kết quả. Khi "lịch dạy của hlv, chỉ lớp mình" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo BR-QT-02.

35. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "lịch dạy của hlv, chỉ lớp mình", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ bắt đầu và tự chọn giữ bản của mình hay lấy bản mới.

36. Ngày đặc biệt. Khi thao tác rơi vào ngày 29/02 của năm không nhuận, "lịch dạy của hlv, chỉ lớp mình" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

### Đổi lịch và chuyển lớp

Căn cứ: UC-08. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Lùi một bước. Trong lúc làm "đổi lịch và chuyển lớp", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

2. Giải thích kết quả. Khi "đổi lịch và chuyển lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo UC-08.

3. Trên điện thoại. Ở màn hẹp 390 px, "đổi lịch và chuyển lớp" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, giờ bắt đầu đọc được không phải kéo ngang.

4. Giá trị biên. Với huấn luyện viên bằng 0, "đổi lịch và chuyển lớp" xử lý đúng theo quy tắc ở UC-08: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

5. Đường chính. Khi huấn luyện viên làm "đổi lịch và chuyển lớp" với đủ huấn luyện viên và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ huấn luyện viên vừa đứng.

6. Thứ tự việc. "đổi lịch và chuyển lớp" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-08.

7. Tìm và lọc. lễ tân gõ một phần lớp không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đổi lịch và chuyển lớp".

8. Giữ lịch sử. Sau khi "đổi lịch và chuyển lớp" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

9. Gộp với việc liên quan. Khi "đổi lịch và chuyển lớp" làm đổi ngày học, các màn đang hiển thị ngày học cập nhật theo ở lần mở kế tiếp, không cần huấn luyện viên tải lại trang bằng tay.

10. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đổi lịch và chuyển lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-08 trên màn hình.

11. Danh sách rỗng. Khi chưa có dữ liệu nào để "đổi lịch và chuyển lớp", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

12. Thời gian chờ. Khi "đổi lịch và chuyển lớp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

13. Ngày đặc biệt. Khi thao tác rơi vào ngày 29/02 của năm không nhuận, "đổi lịch và chuyển lớp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

14. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "đổi lịch và chuyển lớp", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của ngày học và tự chọn giữ bản của mình hay lấy bản mới.

15. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "đổi lịch và chuyển lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

16. Sai khuôn dạng. quản lý nhập lớp sai khuôn dạng ở "đổi lịch và chuyển lớp": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

17. Số liệu đi kèm. Con số hiển thị trong "đổi lịch và chuyển lớp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

18. Dữ liệu dài. Khi bể và làn dài hơn chỗ hiển thị, "đổi lịch và chuyển lớp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

19. Hiển thị cho từng vai. Cùng một bản ghi của "đổi lịch và chuyển lớp", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

20. Bàn phím. Làm được toàn bộ "đổi lịch và chuyển lớp" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

21. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "đổi lịch và chuyển lớp" thì thấy đúng từng giá trị của bể và làn và ngày học, không bị đổi định dạng hay múi giờ.

22. Xác nhận trước việc khó hoàn lại. Trước khi "đổi lịch và chuyển lớp" thay đổi lớp đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

23. Đối chiếu với dữ liệu hiện có. Khi mở "đổi lịch và chuyển lớp" lần đầu sau khi nhập dữ liệu cũ, giờ bắt đầu của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu huấn luyện viên.

24. Thiếu giờ bắt đầu. huấn luyện viên bỏ trống giờ bắt đầu rồi bấm lưu: hệ thống không lưu, tô đỏ ô giờ bắt đầu, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

25. Thời gian chờ. Khi "đổi lịch và chuyển lớp" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

26. Thứ tự việc. "đổi lịch và chuyển lớp" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-08.

27. Thiếu bể và làn. huấn luyện viên bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

28. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "đổi lịch và chuyển lớp" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-08 trên màn hình.

29. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "đổi lịch và chuyển lớp"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

30. Giải thích kết quả. Khi "đổi lịch và chuyển lớp" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo UC-08.

31. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "đổi lịch và chuyển lớp" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

32. Lùi một bước. Trong lúc làm "đổi lịch và chuyển lớp", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

33. Dữ liệu dài. Khi giờ bắt đầu dài hơn chỗ hiển thị, "đổi lịch và chuyển lớp" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

34. Tìm và lọc. quản lý gõ một phần giờ bắt đầu không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "đổi lịch và chuyển lớp".

35. Giữ lịch sử. Sau khi "đổi lịch và chuyển lớp" đổi giờ bắt đầu, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

36. Số liệu đi kèm. Con số hiển thị trong "đổi lịch và chuyển lớp" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

### Phụ huynh gửi yêu cầu đổi lịch

Căn cứ: XD-02, M-06. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh gửi yêu cầu đổi lịch" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như XD-02 trên màn hình.

2. Bàn phím. Làm được toàn bộ "phụ huynh gửi yêu cầu đổi lịch" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

3. Thiếu huấn luyện viên. huấn luyện viên bỏ trống huấn luyện viên rồi bấm lưu: hệ thống không lưu, tô đỏ ô huấn luyện viên, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

4. Giá trị biên. Với bể và làn bằng 0, "phụ huynh gửi yêu cầu đổi lịch" xử lý đúng theo quy tắc ở XD-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

5. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh gửi yêu cầu đổi lịch", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

6. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "phụ huynh gửi yêu cầu đổi lịch" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

7. Dữ liệu dài. Khi lớp dài hơn chỗ hiển thị, "phụ huynh gửi yêu cầu đổi lịch" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

8. Thời gian chờ. Khi "phụ huynh gửi yêu cầu đổi lịch" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

9. Đường chính. Khi lễ tân làm "phụ huynh gửi yêu cầu đổi lịch" với đủ ngày học và giờ bắt đầu hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

10. Tìm và lọc. huấn luyện viên gõ một phần huấn luyện viên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh gửi yêu cầu đổi lịch".

11. Sai khuôn dạng. huấn luyện viên nhập huấn luyện viên sai khuôn dạng ở "phụ huynh gửi yêu cầu đổi lịch": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

12. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh gửi yêu cầu đổi lịch" thì thấy đúng từng giá trị của ngày học và bể và làn, không bị đổi định dạng hay múi giờ.

13. Lùi một bước. Trong lúc làm "phụ huynh gửi yêu cầu đổi lịch", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

14. Giải thích kết quả. Khi "phụ huynh gửi yêu cầu đổi lịch" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo XD-02.

15. Gộp với việc liên quan. Khi "phụ huynh gửi yêu cầu đổi lịch" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

16. Thứ tự việc. "phụ huynh gửi yêu cầu đổi lịch" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo XD-02.

17. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh gửi yêu cầu đổi lịch" thay đổi bể và làn đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

18. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh gửi yêu cầu đổi lịch" lần đầu sau khi nhập dữ liệu cũ, huấn luyện viên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lớp.

19. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh gửi yêu cầu đổi lịch" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, bể và làn đọc được không phải kéo ngang.

20. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh gửi yêu cầu đổi lịch"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

21. Giữ lịch sử. Sau khi "phụ huynh gửi yêu cầu đổi lịch" đổi ngày học, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

22. Số liệu đi kèm. Con số hiển thị trong "phụ huynh gửi yêu cầu đổi lịch" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

23. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "phụ huynh gửi yêu cầu đổi lịch", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ bắt đầu và tự chọn giữ bản của mình hay lấy bản mới.

24. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh gửi yêu cầu đổi lịch", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

25. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh gửi yêu cầu đổi lịch" lần đầu sau khi nhập dữ liệu cũ, ngày học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lớp.

26. Dữ liệu dài. Khi bể và làn dài hơn chỗ hiển thị, "phụ huynh gửi yêu cầu đổi lịch" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

27. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh gửi yêu cầu đổi lịch"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

28. Sai khuôn dạng. quản lý nhập bể và làn sai khuôn dạng ở "phụ huynh gửi yêu cầu đổi lịch": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

29. Giá trị biên. Với giờ bắt đầu bằng âm, "phụ huynh gửi yêu cầu đổi lịch" xử lý đúng theo quy tắc ở XD-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

30. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh gửi yêu cầu đổi lịch" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, ngày học đọc được không phải kéo ngang.

31. Số liệu đi kèm. Con số hiển thị trong "phụ huynh gửi yêu cầu đổi lịch" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

32. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh gửi yêu cầu đổi lịch", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

33. Thứ tự việc. "phụ huynh gửi yêu cầu đổi lịch" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo XD-02.

34. Giữ lịch sử. Sau khi "phụ huynh gửi yêu cầu đổi lịch" đổi lớp, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

35. Thời gian chờ. Khi "phụ huynh gửi yêu cầu đổi lịch" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

36. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh gửi yêu cầu đổi lịch" thì thấy đúng từng giá trị của lớp và bể và làn, không bị đổi định dạng hay múi giờ.

### Lễ tân xử lý yêu cầu đổi lịch

Căn cứ: XD-02. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Gộp với việc liên quan. Khi "lễ tân xử lý yêu cầu đổi lịch" làm đổi huấn luyện viên, các màn đang hiển thị huấn luyện viên cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

2. Đối chiếu với dữ liệu hiện có. Khi mở "lễ tân xử lý yêu cầu đổi lịch" lần đầu sau khi nhập dữ liệu cũ, huấn luyện viên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lớp.

3. Thứ tự việc. "lễ tân xử lý yêu cầu đổi lịch" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo XD-02.

4. Số liệu đi kèm. Con số hiển thị trong "lễ tân xử lý yêu cầu đổi lịch" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

5. Danh sách rỗng. Khi chưa có dữ liệu nào để "lễ tân xử lý yêu cầu đổi lịch", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

6. Dữ liệu dài. Khi ngày học dài hơn chỗ hiển thị, "lễ tân xử lý yêu cầu đổi lịch" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

7. Trên điện thoại. Ở màn hẹp 390 px, "lễ tân xử lý yêu cầu đổi lịch" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, giờ bắt đầu đọc được không phải kéo ngang.

8. Thiếu ngày học. phụ huynh bỏ trống ngày học rồi bấm lưu: hệ thống không lưu, tô đỏ ô ngày học, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

9. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "lễ tân xử lý yêu cầu đổi lịch" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như XD-02 trên màn hình.

10. Tìm và lọc. phụ huynh gõ một phần lớp không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lễ tân xử lý yêu cầu đổi lịch".

11. Sai khuôn dạng. phụ huynh nhập ngày học sai khuôn dạng ở "lễ tân xử lý yêu cầu đổi lịch": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

12. Giải thích kết quả. Khi "lễ tân xử lý yêu cầu đổi lịch" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo XD-02.

13. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "lễ tân xử lý yêu cầu đổi lịch" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

14. Thời gian chờ. Khi "lễ tân xử lý yêu cầu đổi lịch" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

15. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "lễ tân xử lý yêu cầu đổi lịch" thì thấy đúng từng giá trị của ngày học và bể và làn, không bị đổi định dạng hay múi giờ.

16. Giá trị biên. Với lớp bằng 6 (sĩ số tối đa của lớp Làm quen nước), "lễ tân xử lý yêu cầu đổi lịch" xử lý đúng theo quy tắc ở XD-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

17. Bàn phím. Làm được toàn bộ "lễ tân xử lý yêu cầu đổi lịch" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

18. Quyền. Chỉ huấn luyện viên và các vai được ma trận quyền cho phép mới thấy nút của "lễ tân xử lý yêu cầu đổi lịch"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

19. Đường chính. Khi lễ tân làm "lễ tân xử lý yêu cầu đổi lịch" với đủ huấn luyện viên và lớp hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

20. Xác nhận trước việc khó hoàn lại. Trước khi "lễ tân xử lý yêu cầu đổi lịch" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Giữ lịch sử. Sau khi "lễ tân xử lý yêu cầu đổi lịch" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và huấn luyện viên có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

22. Lùi một bước. Trong lúc làm "lễ tân xử lý yêu cầu đổi lịch", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

23. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "lễ tân xử lý yêu cầu đổi lịch", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

24. Hiển thị cho từng vai. Cùng một bản ghi của "lễ tân xử lý yêu cầu đổi lịch", huấn luyện viên thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

25. Giải thích kết quả. Khi "lễ tân xử lý yêu cầu đổi lịch" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo XD-02.

26. Thứ tự việc. "lễ tân xử lý yêu cầu đổi lịch" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo XD-02.

27. Tìm và lọc. lễ tân gõ một phần huấn luyện viên không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "lễ tân xử lý yêu cầu đổi lịch".

28. Bàn phím. Làm được toàn bộ "lễ tân xử lý yêu cầu đổi lịch" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

29. Sai khuôn dạng. huấn luyện viên nhập huấn luyện viên sai khuôn dạng ở "lễ tân xử lý yêu cầu đổi lịch": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

30. Thời gian chờ. Khi "lễ tân xử lý yêu cầu đổi lịch" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

31. Xác nhận trước việc khó hoàn lại. Trước khi "lễ tân xử lý yêu cầu đổi lịch" thay đổi giờ bắt đầu đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

32. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "lễ tân xử lý yêu cầu đổi lịch"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

33. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "lễ tân xử lý yêu cầu đổi lịch" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

34. Thiếu lớp. phụ huynh bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

35. Gộp với việc liên quan. Khi "lễ tân xử lý yêu cầu đổi lịch" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

36. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối cùng của gói, "lễ tân xử lý yêu cầu đổi lịch" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

### Xếp buổi học bù

Căn cứ: các tài liệu yêu cầu. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Giữ lịch sử. Sau khi "xếp buổi học bù" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và huấn luyện viên có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

2. Tìm và lọc. lễ tân gõ một phần giờ bắt đầu không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "xếp buổi học bù".

3. Trên điện thoại. Ở màn hẹp 390 px, "xếp buổi học bù" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, huấn luyện viên đọc được không phải kéo ngang.

4. Gộp với việc liên quan. Khi "xếp buổi học bù" làm đổi huấn luyện viên, các màn đang hiển thị huấn luyện viên cập nhật theo ở lần mở kế tiếp, không cần huấn luyện viên tải lại trang bằng tay.

5. Bàn phím. Làm được toàn bộ "xếp buổi học bù" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

6. Đối chiếu với dữ liệu hiện có. Khi mở "xếp buổi học bù" lần đầu sau khi nhập dữ liệu cũ, ngày học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu huấn luyện viên.

7. Thời gian chờ. Khi "xếp buổi học bù" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

8. Lùi một bước. Trong lúc làm "xếp buổi học bù", phụ huynh bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

9. Hiển thị cho từng vai. Cùng một bản ghi của "xếp buổi học bù", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

10. Số liệu đi kèm. Con số hiển thị trong "xếp buổi học bù" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

11. Thứ tự việc. "xếp buổi học bù" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo các tài liệu yêu cầu.

12. Giá trị biên. Với ngày học bằng 10 (sĩ số tối đa của lớp khác), "xếp buổi học bù" xử lý đúng theo quy tắc ở các tài liệu yêu cầu: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

13. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "xếp buổi học bù" thì thấy đúng từng giá trị của ngày học và lớp, không bị đổi định dạng hay múi giờ.

14. Dữ liệu dài. Khi giờ bắt đầu dài hơn chỗ hiển thị, "xếp buổi học bù" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

15. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "xếp buổi học bù" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

16. Giải thích kết quả. Khi "xếp buổi học bù" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo các tài liệu yêu cầu.

17. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "xếp buổi học bù", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

18. Thiếu bể và làn. lễ tân bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

19. Đường chính. Khi phụ huynh làm "xếp buổi học bù" với đủ ngày học và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

20. Danh sách rỗng. Khi chưa có dữ liệu nào để "xếp buổi học bù", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

21. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "xếp buổi học bù"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

22. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "xếp buổi học bù" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như các tài liệu yêu cầu trên màn hình.

23. Sai khuôn dạng. huấn luyện viên nhập giờ bắt đầu sai khuôn dạng ở "xếp buổi học bù": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

24. Xác nhận trước việc khó hoàn lại. Trước khi "xếp buổi học bù" thay đổi bể và làn đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

25. Dữ liệu dài. Khi ngày học dài hơn chỗ hiển thị, "xếp buổi học bù" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

26. Giải thích kết quả. Khi "xếp buổi học bù" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc phụ huynh có thể làm tiếp, theo các tài liệu yêu cầu.

27. Sai khuôn dạng. huấn luyện viên nhập giờ bắt đầu sai khuôn dạng ở "xếp buổi học bù": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

28. Gộp với việc liên quan. Khi "xếp buổi học bù" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

29. Hai người cùng làm. Khi một lễ tân mở hai tab ở "xếp buổi học bù", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

30. Ngày đặc biệt. Khi thao tác rơi vào đúng 00:00 sáng thứ Hai, "xếp buổi học bù" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

31. Đối chiếu với dữ liệu hiện có. Khi mở "xếp buổi học bù" lần đầu sau khi nhập dữ liệu cũ, ngày học của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu bể và làn.

32. Xác nhận trước việc khó hoàn lại. Trước khi "xếp buổi học bù" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

33. Giá trị biên. Với giờ bắt đầu bằng có phần thập phân, "xếp buổi học bù" xử lý đúng theo quy tắc ở các tài liệu yêu cầu: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

34. Thời gian chờ. Khi "xếp buổi học bù" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

35. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "xếp buổi học bù" thì thấy đúng từng giá trị của lớp và huấn luyện viên, không bị đổi định dạng hay múi giờ.

36. Đường chính. Khi quản lý làm "xếp buổi học bù" với đủ lớp và bể và làn hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

### Huỷ hàng loạt buổi khi bể sự cố

Căn cứ: A-03, XD-04, BR-TT-07. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Sai khuôn dạng. lễ tân nhập huấn luyện viên sai khuôn dạng ở "huỷ hàng loạt buổi khi bể sự cố": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

2. Dữ liệu dài. Khi giờ bắt đầu dài hơn chỗ hiển thị, "huỷ hàng loạt buổi khi bể sự cố" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

3. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "huỷ hàng loạt buổi khi bể sự cố" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như A-03 trên màn hình.

4. Xác nhận trước việc khó hoàn lại. Trước khi "huỷ hàng loạt buổi khi bể sự cố" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

5. Số liệu đi kèm. Con số hiển thị trong "huỷ hàng loạt buổi khi bể sự cố" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

6. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "huỷ hàng loạt buổi khi bể sự cố", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ bắt đầu và tự chọn giữ bản của mình hay lấy bản mới.

7. Tìm và lọc. phụ huynh gõ một phần ngày học không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "huỷ hàng loạt buổi khi bể sự cố".

8. Đường chính. Khi phụ huynh làm "huỷ hàng loạt buổi khi bể sự cố" với đủ huấn luyện viên và ngày học hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

9. Hiển thị cho từng vai. Cùng một bản ghi của "huỷ hàng loạt buổi khi bể sự cố", huấn luyện viên thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

10. Bàn phím. Làm được toàn bộ "huỷ hàng loạt buổi khi bể sự cố" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

11. Thiếu bể và làn. phụ huynh bỏ trống bể và làn rồi bấm lưu: hệ thống không lưu, tô đỏ ô bể và làn, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

12. Ngày đặc biệt. Khi thao tác rơi vào buổi đầu tiên của gói, "huỷ hàng loạt buổi khi bể sự cố" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

13. Quyền. Chỉ huấn luyện viên và các vai được ma trận quyền cho phép mới thấy nút của "huỷ hàng loạt buổi khi bể sự cố"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

14. Giữ lịch sử. Sau khi "huỷ hàng loạt buổi khi bể sự cố" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

15. Thời gian chờ. Khi "huỷ hàng loạt buổi khi bể sự cố" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

16. Đối chiếu với dữ liệu hiện có. Khi mở "huỷ hàng loạt buổi khi bể sự cố" lần đầu sau khi nhập dữ liệu cũ, giờ bắt đầu của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ngày học.

17. Gộp với việc liên quan. Khi "huỷ hàng loạt buổi khi bể sự cố" làm đổi bể và làn, các màn đang hiển thị bể và làn cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

18. Giải thích kết quả. Khi "huỷ hàng loạt buổi khi bể sự cố" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo A-03.

19. Danh sách rỗng. Khi chưa có dữ liệu nào để "huỷ hàng loạt buổi khi bể sự cố", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

20. Giá trị biên. Với giờ bắt đầu bằng 6 (sĩ số tối đa của lớp Làm quen nước), "huỷ hàng loạt buổi khi bể sự cố" xử lý đúng theo quy tắc ở A-03: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

21. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "huỷ hàng loạt buổi khi bể sự cố" thì thấy đúng từng giá trị của huấn luyện viên và ngày học, không bị đổi định dạng hay múi giờ.

22. Lùi một bước. Trong lúc làm "huỷ hàng loạt buổi khi bể sự cố", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

23. Trên điện thoại. Ở màn hẹp 390 px, "huỷ hàng loạt buổi khi bể sự cố" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, lớp đọc được không phải kéo ngang.

24. Thứ tự việc. "huỷ hàng loạt buổi khi bể sự cố" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo A-03.

25. Thứ tự việc. "huỷ hàng loạt buổi khi bể sự cố" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo A-03.

26. Đường chính. Khi quản lý làm "huỷ hàng loạt buổi khi bể sự cố" với đủ huấn luyện viên và lớp hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

27. Tìm và lọc. quản lý gõ một phần ngày học không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "huỷ hàng loạt buổi khi bể sự cố".

28. Lùi một bước. Trong lúc làm "huỷ hàng loạt buổi khi bể sự cố", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

29. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "huỷ hàng loạt buổi khi bể sự cố" thì thấy đúng từng giá trị của huấn luyện viên và lớp, không bị đổi định dạng hay múi giờ.

30. Giữ lịch sử. Sau khi "huỷ hàng loạt buổi khi bể sự cố" đổi giờ bắt đầu, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

31. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "huỷ hàng loạt buổi khi bể sự cố" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

32. Xác nhận trước việc khó hoàn lại. Trước khi "huỷ hàng loạt buổi khi bể sự cố" thay đổi huấn luyện viên đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

33. Sai khuôn dạng. lễ tân nhập bể và làn sai khuôn dạng ở "huỷ hàng loạt buổi khi bể sự cố": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

34. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "huỷ hàng loạt buổi khi bể sự cố"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

35. Đối chiếu với dữ liệu hiện có. Khi mở "huỷ hàng loạt buổi khi bể sự cố" lần đầu sau khi nhập dữ liệu cũ, giờ bắt đầu của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu huấn luyện viên.

36. Gộp với việc liên quan. Khi "huỷ hàng loạt buổi khi bể sự cố" làm đổi bể và làn, các màn đang hiển thị bể và làn cập nhật theo ở lần mở kế tiếp, không cần lễ tân tải lại trang bằng tay.

### HLV dạy thay

Căn cứ: A-02. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Lùi một bước. Trong lúc làm "hlv dạy thay", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

2. Danh sách rỗng. Khi chưa có dữ liệu nào để "hlv dạy thay", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

3. Giải thích kết quả. Khi "hlv dạy thay" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo A-02.

4. Giữ lịch sử. Sau khi "hlv dạy thay" đổi ngày học, bản ghi giữ giá trị cũ để đối chiếu, và phụ huynh có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

5. Hiển thị cho từng vai. Cùng một bản ghi của "hlv dạy thay", phụ huynh thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

6. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "hlv dạy thay" thì thấy đúng từng giá trị của bể và làn và ngày học, không bị đổi định dạng hay múi giờ.

7. Giá trị biên. Với huấn luyện viên bằng âm, "hlv dạy thay" xử lý đúng theo quy tắc ở A-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

8. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "hlv dạy thay"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

9. Bàn phím. Làm được toàn bộ "hlv dạy thay" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

10. Sai khuôn dạng. quản lý nhập lớp sai khuôn dạng ở "hlv dạy thay": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

11. Tìm và lọc. lễ tân gõ một phần giờ bắt đầu không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "hlv dạy thay".

12. Đối chiếu với dữ liệu hiện có. Khi mở "hlv dạy thay" lần đầu sau khi nhập dữ liệu cũ, giờ bắt đầu của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ngày học.

13. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "hlv dạy thay", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ bắt đầu và tự chọn giữ bản của mình hay lấy bản mới.

14. Thiếu lớp. phụ huynh bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

15. Thứ tự việc. "hlv dạy thay" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo A-02.

16. Số liệu đi kèm. Con số hiển thị trong "hlv dạy thay" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

17. Trên điện thoại. Ở màn hẹp 390 px, "hlv dạy thay" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, huấn luyện viên đọc được không phải kéo ngang.

18. Đường chính. Khi lễ tân làm "hlv dạy thay" với đủ huấn luyện viên và giờ bắt đầu hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ lễ tân vừa đứng.

19. Dữ liệu dài. Khi lớp dài hơn chỗ hiển thị, "hlv dạy thay" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

20. Xác nhận trước việc khó hoàn lại. Trước khi "hlv dạy thay" thay đổi giờ bắt đầu đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "hlv dạy thay" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như A-02 trên màn hình.

22. Thời gian chờ. Khi "hlv dạy thay" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

23. Gộp với việc liên quan. Khi "hlv dạy thay" làm đổi ngày học, các màn đang hiển thị ngày học cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

24. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "hlv dạy thay" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

25. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "hlv dạy thay", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

26. Bàn phím. Làm được toàn bộ "hlv dạy thay" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

27. Giá trị biên. Với huấn luyện viên bằng âm, "hlv dạy thay" xử lý đúng theo quy tắc ở A-02: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

28. Giải thích kết quả. Khi "hlv dạy thay" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo A-02.

29. Danh sách rỗng. Khi chưa có dữ liệu nào để "hlv dạy thay", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

30. Gộp với việc liên quan. Khi "hlv dạy thay" làm đổi giờ bắt đầu, các màn đang hiển thị giờ bắt đầu cập nhật theo ở lần mở kế tiếp, không cần phụ huynh tải lại trang bằng tay.

31. Giữ lịch sử. Sau khi "hlv dạy thay" đổi huấn luyện viên, bản ghi giữ giá trị cũ để đối chiếu, và lễ tân có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

32. Thiếu lớp. phụ huynh bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

33. Thời gian chờ. Khi "hlv dạy thay" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

34. Hiển thị cho từng vai. Cùng một bản ghi của "hlv dạy thay", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

35. Dữ liệu dài. Khi bể và làn dài hơn chỗ hiển thị, "hlv dạy thay" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

36. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "hlv dạy thay" thì thấy đúng từng giá trị của lớp và bể và làn, không bị đổi định dạng hay múi giờ.

### Phụ huynh xem lịch học của con

Căn cứ: UC-06. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Giải thích kết quả. Khi "phụ huynh xem lịch học của con" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-06.

2. Thời gian chờ. Khi "phụ huynh xem lịch học của con" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

3. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh xem lịch học của con" thì thấy đúng từng giá trị của bể và làn và ngày học, không bị đổi định dạng hay múi giờ.

4. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh xem lịch học của con" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-06 trên màn hình.

5. Giữ lịch sử. Sau khi "phụ huynh xem lịch học của con" đổi lớp, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

6. Giá trị biên. Với huấn luyện viên bằng 24 (gói lớn nhất), "phụ huynh xem lịch học của con" xử lý đúng theo quy tắc ở UC-06: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

7. Ngày đặc biệt. Khi thao tác rơi vào ngày 29/02 của năm không nhuận, "phụ huynh xem lịch học của con" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

8. Thứ tự việc. "phụ huynh xem lịch học của con" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-06.

9. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh xem lịch học của con", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

10. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "phụ huynh xem lịch học của con", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của huấn luyện viên và tự chọn giữ bản của mình hay lấy bản mới.

11. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh xem lịch học của con" thay đổi bể và làn đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

12. Quyền. Chỉ lễ tân và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh xem lịch học của con"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

13. Gộp với việc liên quan. Khi "phụ huynh xem lịch học của con" làm đổi ngày học, các màn đang hiển thị ngày học cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

14. Bàn phím. Làm được toàn bộ "phụ huynh xem lịch học của con" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

15. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh xem lịch học của con" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, giờ bắt đầu đọc được không phải kéo ngang.

16. Thiếu lớp. phụ huynh bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

17. Tìm và lọc. quản lý gõ một phần bể và làn không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh xem lịch học của con".

18. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh xem lịch học của con" lần đầu sau khi nhập dữ liệu cũ, giờ bắt đầu của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu bể và làn.

19. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh xem lịch học của con", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

20. Lùi một bước. Trong lúc làm "phụ huynh xem lịch học của con", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

21. Dữ liệu dài. Khi giờ bắt đầu dài hơn chỗ hiển thị, "phụ huynh xem lịch học của con" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

22. Số liệu đi kèm. Con số hiển thị trong "phụ huynh xem lịch học của con" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

23. Sai khuôn dạng. quản lý nhập ngày học sai khuôn dạng ở "phụ huynh xem lịch học của con": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

24. Đường chính. Khi phụ huynh làm "phụ huynh xem lịch học của con" với đủ ngày học và giờ bắt đầu hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

25. Giữ lịch sử. Sau khi "phụ huynh xem lịch học của con" đổi giờ bắt đầu, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

26. Số liệu đi kèm. Con số hiển thị trong "phụ huynh xem lịch học của con" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

27. Gộp với việc liên quan. Khi "phụ huynh xem lịch học của con" làm đổi bể và làn, các màn đang hiển thị bể và làn cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

28. Dữ liệu dài. Khi ngày học dài hơn chỗ hiển thị, "phụ huynh xem lịch học của con" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

29. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh xem lịch học của con" thay đổi bể và làn đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

30. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh xem lịch học của con", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho lễ tân, không để bảng trắng.

31. Quyền. Chỉ phụ huynh và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh xem lịch học của con"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

32. Đường chính. Khi huấn luyện viên làm "phụ huynh xem lịch học của con" với đủ lớp và ngày học hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ huấn luyện viên vừa đứng.

33. Thứ tự việc. "phụ huynh xem lịch học của con" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-06.

34. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh xem lịch học của con", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

35. Tìm và lọc. lễ tân gõ một phần bể và làn không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh xem lịch học của con".

36. Giá trị biên. Với huấn luyện viên bằng 0, "phụ huynh xem lịch học của con" xử lý đúng theo quy tắc ở UC-06: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

### Phụ huynh báo nghỉ

Căn cứ: UC-07, YC-08. Vai liên quan: lễ tân, huấn luyện viên, quản lý, phụ huynh.

1. Giá trị biên. Với giờ bắt đầu bằng 24 (gói lớn nhất), "phụ huynh báo nghỉ" xử lý đúng theo quy tắc ở UC-07: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

2. Ngày đặc biệt. Khi thao tác rơi vào giờ cao điểm 17:00 đến 19:00, "phụ huynh báo nghỉ" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

3. Đường chính. Khi quản lý làm "phụ huynh báo nghỉ" với đủ lớp và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

4. Trên điện thoại. Ở màn hẹp 390 px, "phụ huynh báo nghỉ" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, ngày học đọc được không phải kéo ngang.

5. Sai khuôn dạng. quản lý nhập ngày học sai khuôn dạng ở "phụ huynh báo nghỉ": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

6. Dữ liệu dài. Khi huấn luyện viên dài hơn chỗ hiển thị, "phụ huynh báo nghỉ" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

7. Giữ lịch sử. Sau khi "phụ huynh báo nghỉ" đổi bể và làn, bản ghi giữ giá trị cũ để đối chiếu, và huấn luyện viên có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

8. Số liệu đi kèm. Con số hiển thị trong "phụ huynh báo nghỉ" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

9. Bàn phím. Làm được toàn bộ "phụ huynh báo nghỉ" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

10. Tìm và lọc. quản lý gõ một phần bể và làn không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "phụ huynh báo nghỉ".

11. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh báo nghỉ" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-07 trên màn hình.

12. Gộp với việc liên quan. Khi "phụ huynh báo nghỉ" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần huấn luyện viên tải lại trang bằng tay.

13. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh báo nghỉ" thay đổi ngày học đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

14. Quyền. Chỉ huấn luyện viên và các vai được ma trận quyền cho phép mới thấy nút của "phụ huynh báo nghỉ"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

15. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "phụ huynh báo nghỉ" thì thấy đúng từng giá trị của giờ bắt đầu và bể và làn, không bị đổi định dạng hay múi giờ.

16. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh báo nghỉ", lễ tân thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

17. Thiếu ngày học. quản lý bỏ trống ngày học rồi bấm lưu: hệ thống không lưu, tô đỏ ô ngày học, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

18. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh báo nghỉ" lần đầu sau khi nhập dữ liệu cũ, huấn luyện viên của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu ngày học.

19. Lùi một bước. Trong lúc làm "phụ huynh báo nghỉ", lễ tân bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

20. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "phụ huynh báo nghỉ", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của bể và làn và tự chọn giữ bản của mình hay lấy bản mới.

21. Thời gian chờ. Khi "phụ huynh báo nghỉ" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

22. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh báo nghỉ", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

23. Giải thích kết quả. Khi "phụ huynh báo nghỉ" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo UC-07.

24. Thứ tự việc. "phụ huynh báo nghỉ" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-07.

25. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "phụ huynh báo nghỉ" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-07 trên màn hình.

26. Danh sách rỗng. Khi chưa có dữ liệu nào để "phụ huynh báo nghỉ", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho phụ huynh, không để bảng trắng.

27. Đối chiếu với dữ liệu hiện có. Khi mở "phụ huynh báo nghỉ" lần đầu sau khi nhập dữ liệu cũ, bể và làn của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu huấn luyện viên.

28. Hai người cùng làm. Khi quản lý và lễ tân cùng sửa một dòng ở "phụ huynh báo nghỉ", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ bắt đầu và tự chọn giữ bản của mình hay lấy bản mới.

29. Đường chính. Khi phụ huynh làm "phụ huynh báo nghỉ" với đủ giờ bắt đầu và huấn luyện viên hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ phụ huynh vừa đứng.

30. Số liệu đi kèm. Con số hiển thị trong "phụ huynh báo nghỉ" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

31. Hiển thị cho từng vai. Cùng một bản ghi của "phụ huynh báo nghỉ", huấn luyện viên thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

32. Giải thích kết quả. Khi "phụ huynh báo nghỉ" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc lễ tân có thể làm tiếp, theo UC-07.

33. Lùi một bước. Trong lúc làm "phụ huynh báo nghỉ", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

34. Sai khuôn dạng. quản lý nhập ngày học sai khuôn dạng ở "phụ huynh báo nghỉ": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

35. Giá trị biên. Với ngày học bằng 9999, "phụ huynh báo nghỉ" xử lý đúng theo quy tắc ở UC-07: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

36. Xác nhận trước việc khó hoàn lại. Trước khi "phụ huynh báo nghỉ" thay đổi giờ bắt đầu đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

## 4. Điểm danh

### Điểm danh buổi học

Căn cứ: UC-05, YC-06. Vai liên quan: huấn luyện viên, quản lý.

1. Thời gian chờ. Khi "điểm danh buổi học" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

2. Lùi một bước. Trong lúc làm "điểm danh buổi học", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

3. Quyền. Chỉ huấn luyện viên và các vai được ma trận quyền cho phép mới thấy nút của "điểm danh buổi học"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

4. Thứ tự việc. "điểm danh buổi học" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-05.

5. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "điểm danh buổi học" thì thấy đúng từng giá trị của lớp và người ghi, không bị đổi định dạng hay múi giờ.

6. Gộp với việc liên quan. Khi "điểm danh buổi học" làm đổi trạng thái có mặt, các màn đang hiển thị trạng thái có mặt cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

7. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "điểm danh buổi học", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của người ghi và tự chọn giữ bản của mình hay lấy bản mới.

8. Thiếu trạng thái có mặt. quản lý bỏ trống trạng thái có mặt rồi bấm lưu: hệ thống không lưu, tô đỏ ô trạng thái có mặt, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

9. Sai khuôn dạng. huấn luyện viên nhập lý do vắng sai khuôn dạng ở "điểm danh buổi học": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

10. Dữ liệu dài. Khi giờ ghi dài hơn chỗ hiển thị, "điểm danh buổi học" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

11. Bàn phím. Làm được toàn bộ "điểm danh buổi học" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

12. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "điểm danh buổi học" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như UC-05 trên màn hình.

13. Ngày đặc biệt. Khi thao tác rơi vào buổi cuối của tháng, "điểm danh buổi học" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

14. Số liệu đi kèm. Con số hiển thị trong "điểm danh buổi học" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

15. Đối chiếu với dữ liệu hiện có. Khi mở "điểm danh buổi học" lần đầu sau khi nhập dữ liệu cũ, lớp của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu trạng thái có mặt.

16. Tìm và lọc. huấn luyện viên gõ một phần lớp không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "điểm danh buổi học".

17. Đường chính. Khi quản lý làm "điểm danh buổi học" với đủ giờ ghi và người ghi hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

18. Hiển thị cho từng vai. Cùng một bản ghi của "điểm danh buổi học", huấn luyện viên thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

19. Giá trị biên. Với trạng thái có mặt bằng 24 (gói lớn nhất), "điểm danh buổi học" xử lý đúng theo quy tắc ở UC-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

20. Xác nhận trước việc khó hoàn lại. Trước khi "điểm danh buổi học" thay đổi người ghi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

21. Danh sách rỗng. Khi chưa có dữ liệu nào để "điểm danh buổi học", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

22. Giữ lịch sử. Sau khi "điểm danh buổi học" đổi trạng thái có mặt, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

23. Trên điện thoại. Ở màn hẹp 390 px, "điểm danh buổi học" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, giờ ghi đọc được không phải kéo ngang.

24. Giải thích kết quả. Khi "điểm danh buổi học" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo UC-05.

25. Thứ tự việc. "điểm danh buổi học" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo UC-05.

26. Tìm và lọc. huấn luyện viên gõ một phần giờ ghi không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "điểm danh buổi học".

27. Bàn phím. Làm được toàn bộ "điểm danh buổi học" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

28. Giá trị biên. Với lớp bằng có phần thập phân, "điểm danh buổi học" xử lý đúng theo quy tắc ở UC-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

29. Ngày đặc biệt. Khi thao tác rơi vào ngày lễ đã khai trong danh sách nghỉ, "điểm danh buổi học" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

30. Đường chính. Khi quản lý làm "điểm danh buổi học" với đủ giờ ghi và trạng thái có mặt hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

31. Gộp với việc liên quan. Khi "điểm danh buổi học" làm đổi lý do vắng, các màn đang hiển thị lý do vắng cập nhật theo ở lần mở kế tiếp, không cần quản lý tải lại trang bằng tay.

32. Giải thích kết quả. Khi "điểm danh buổi học" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc huấn luyện viên có thể làm tiếp, theo UC-05.

33. Thiếu lý do vắng. huấn luyện viên bỏ trống lý do vắng rồi bấm lưu: hệ thống không lưu, tô đỏ ô lý do vắng, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

34. Lùi một bước. Trong lúc làm "điểm danh buổi học", quản lý bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

35. Danh sách rỗng. Khi chưa có dữ liệu nào để "điểm danh buổi học", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho quản lý, không để bảng trắng.

36. Số liệu đi kèm. Con số hiển thị trong "điểm danh buổi học" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

### Sửa điểm danh

Căn cứ: BR-DD-05. Vai liên quan: huấn luyện viên, quản lý.

1. Tìm và lọc. quản lý gõ một phần trạng thái có mặt không dấu vẫn tìm ra kết quả có dấu; kết quả giữ nguyên bộ lọc khi quay lại từ màn chi tiết của "sửa điểm danh".

2. Đối chiếu với dữ liệu hiện có. Khi mở "sửa điểm danh" lần đầu sau khi nhập dữ liệu cũ, giờ ghi của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lý do vắng.

3. Giải thích kết quả. Khi "sửa điểm danh" từ chối một thao tác, câu trả lời nêu quy tắc đã chặn bằng lời thường, kèm việc quản lý có thể làm tiếp, theo BR-DD-05.

4. Dữ liệu dài. Khi trạng thái có mặt dài hơn chỗ hiển thị, "sửa điểm danh" cắt gọn bằng dấu ba chấm, giữ đủ giá trị khi mở chi tiết, và không làm vỡ bố cục ở điện thoại.

5. Thứ tự việc. "sửa điểm danh" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-DD-05.

6. Đọc lại sau khi lưu. Mở lại bản ghi vừa lưu bằng "sửa điểm danh" thì thấy đúng từng giá trị của lớp và trạng thái có mặt, không bị đổi định dạng hay múi giờ.

7. Giữ lịch sử. Sau khi "sửa điểm danh" đổi người ghi, bản ghi giữ giá trị cũ để đối chiếu, và quản lý có quyền xem được ai đổi, lúc nào, từ giá trị nào sang giá trị nào.

8. Giá trị biên. Với lớp bằng âm, "sửa điểm danh" xử lý đúng theo quy tắc ở BR-DD-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

9. Bàn phím. Làm được toàn bộ "sửa điểm danh" bằng bàn phím: thứ tự Tab đi theo thứ tự việc, Enter lưu ở ô cuối, Esc đóng hộp thoại và trả con trỏ về nút đã mở nó.

10. Ngày đặc biệt. Khi thao tác rơi vào ngay sau 23:00, "sửa điểm danh" vẫn cho kết quả đúng; nếu quy tắc không cho phép thì nêu rõ ngày nào bị chặn và vì sao.

11. Số liệu đi kèm. Con số hiển thị trong "sửa điểm danh" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

12. Gộp với việc liên quan. Khi "sửa điểm danh" làm đổi lớp, các màn đang hiển thị lớp cập nhật theo ở lần mở kế tiếp, không cần huấn luyện viên tải lại trang bằng tay.

13. Hiển thị cho từng vai. Cùng một bản ghi của "sửa điểm danh", quản lý thấy các trường theo đúng quyền của vai mình; trường không thuộc vai thì ẩn hẳn, không để ô trống.

14. Sai khuôn dạng. huấn luyện viên nhập người ghi sai khuôn dạng ở "sửa điểm danh": thông báo lỗi nói đúng điều cần sửa bằng tiếng Việt, không dùng mã lỗi, không xoá phần đã nhập.

15. Xác nhận trước việc khó hoàn lại. Trước khi "sửa điểm danh" thay đổi giờ ghi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

16. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "sửa điểm danh" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-DD-05 trên màn hình.

17. Trên điện thoại. Ở màn hẹp 390 px, "sửa điểm danh" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, người ghi đọc được không phải kéo ngang.

18. Lùi một bước. Trong lúc làm "sửa điểm danh", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

19. Đường chính. Khi quản lý làm "sửa điểm danh" với đủ người ghi và lý do vắng hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

20. Thời gian chờ. Khi "sửa điểm danh" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

21. Danh sách rỗng. Khi chưa có dữ liệu nào để "sửa điểm danh", màn hình nói rõ chưa có gì và chỉ lối làm tiếp theo cho huấn luyện viên, không để bảng trắng.

22. Thiếu lớp. quản lý bỏ trống lớp rồi bấm lưu: hệ thống không lưu, tô đỏ ô lớp, giữ nguyên mọi ô đã nhập và đặt con trỏ vào ô lỗi đầu tiên.

23. Quyền. Chỉ quản lý và các vai được ma trận quyền cho phép mới thấy nút của "sửa điểm danh"; vai khác không thấy nút và mở thẳng đường dẫn thì được báo không đủ quyền, không lộ dữ liệu.

24. Hai người cùng làm. Khi huấn luyện viên đổi sang lớp khác giữa chừng ở "sửa điểm danh", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của giờ ghi và tự chọn giữ bản của mình hay lấy bản mới.

25. Lùi một bước. Trong lúc làm "sửa điểm danh", huấn luyện viên bấm quay lại ở giữa chừng thì không mất phần đã nhập; rời hẳn màn hình thì được hỏi có bỏ phần đang nhập không.

26. Giá trị biên. Với lý do vắng bằng 10 (sĩ số tối đa của lớp khác), "sửa điểm danh" xử lý đúng theo quy tắc ở BR-DD-05: chấp nhận khi trong giới hạn, từ chối kèm lý do khi ngoài giới hạn.

27. Trên điện thoại. Ở màn hẹp 390 px, "sửa điểm danh" vẫn làm được bằng một tay: nút chính trong tầm ngón cái, ô nhập không bị bàn phím che, trạng thái có mặt đọc được không phải kéo ngang.

28. Đường chính. Khi quản lý làm "sửa điểm danh" với đủ giờ ghi và lý do vắng hợp lệ thì hệ thống lưu ngay, báo đã xong bằng một dòng, và màn hình quay về chỗ quản lý vừa đứng.

29. Đối chiếu với dữ liệu hiện có. Khi mở "sửa điểm danh" lần đầu sau khi nhập dữ liệu cũ, trạng thái có mặt của các bản ghi cũ hiển thị đúng như bản đã nhập, kể cả bản ghi thiếu lý do vắng.

30. Gộp với việc liên quan. Khi "sửa điểm danh" làm đổi người ghi, các màn đang hiển thị người ghi cập nhật theo ở lần mở kế tiếp, không cần huấn luyện viên tải lại trang bằng tay.

31. Thứ tự việc. "sửa điểm danh" chỉ chạy khi các điều kiện đứng trước đã đủ; thiếu điều kiện thì nút mờ đi và dòng giải thích bên cạnh nói còn thiếu gì, theo BR-DD-05.

32. Thời gian chờ. Khi "sửa điểm danh" mất hơn hai giây, hệ thống hiện trạng thái đang xử lý ngay ở nút bấm và khoá nút để khỏi bấm lại; xong thì bỏ trạng thái và báo kết quả.

33. Hai người cùng làm. Khi hai lễ tân thao tác cùng lúc ở "sửa điểm danh", người lưu sau được báo bản ghi vừa đổi, xem được giá trị mới của lớp và tự chọn giữ bản của mình hay lấy bản mới.

34. Số liệu đi kèm. Con số hiển thị trong "sửa điểm danh" (đếm, tổng, còn lại) khớp với danh sách bên dưới; bấm vào con số thì mở đúng danh sách tạo ra nó.

35. Xác nhận trước việc khó hoàn lại. Trước khi "sửa điểm danh" thay đổi người ghi đã có dữ liệu liên quan, hệ thống hỏi lại một lần, nêu số bản ghi bị ảnh hưởng; chọn Huỷ thì không đổi gì.

36. Chữ Việt. Mọi thông báo, nhãn nút và tiêu đề trong "sửa điểm danh" dùng đúng tiếng Việt có dấu, viết hoa đầu câu, và không để lộ mã như BR-DD-05 trên màn hình.
