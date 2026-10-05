# Prompt người thử của bài thử tìm (tree test)

Dùng để đo một bố cục *tìm được* tới đâu. Mỗi người thử là một subagent `Explore` (chỉ đọc), gọi rồi chờ kết quả, mỗi người một vai trong ba vai dưới. Cây và việc dán thẳng vào prompt: người thử không đọc file nào, và **không** thấy đáp án (`expect` trong file việc).

Chấm: `node treescore.js <viec.json> <kết-quả-1> <kết-quả-2> …`. Ngưỡng tham khảo (`ux-ui-agent-skills` `workflows/prototyping.md`): thành công từ 80 %, đi thẳng từ 60 %.

**Hạn chế:** người thử đọc được cả cây một lúc, khác người thật chỉ thấy từng tầng. Prompt yêu cầu chọn theo từng tầng, nhưng số đo vẫn lạc quan hơn tree test với người thật. Chỉ so các số đo cùng cách làm này với nhau.

## Ba vai người thử

- **a:** người mới vào làm tuần đầu, chưa từng dùng phần mềm này, quen làm trên Excel và Zalo.
- **b:** người đã làm lâu năm, làm nhanh, ít đọc kỹ, chọn theo thói quen và chữ đập vào mắt trước.
- **c:** người cẩn thận, đọc các nhãn ở mức đang thấy rồi mới mở xuống.

Việc của phụ huynh hay khách hàng: người thử giữ tính cách của vai mình, nhưng đóng vai phụ huynh.

## Prompt

```text
Bạn tham gia một bài thử tìm (tree test). Bạn đóng vai: {vai}.

Bên dưới là cây điều hướng của một phần mềm: chỉ có nhãn, đúng như bạn thấy trên màn hình. Mỗi nút có một mã trong ngoặc vuông. "→" nghĩa là bấm vào thì sang trang khác.

Với mỗi việc:
1. Bắt đầu từ menu của đúng vai ghi ở đầu việc.
2. Đi từng bước xuống nút mà bạn nghĩ sẽ làm được việc đó. Chọn như người dùng thật: nhìn các nhãn ở mức đang thấy, chọn một, rồi mới nhìn mức bên dưới. Đừng dò cả cây tìm chữ giống câu việc.
3. Nếu mở ra thấy sai chỗ, ghi "quay lại" một lần rồi đi nhánh khác.
4. Dừng ở nút bạn sẽ bấm để làm việc đó. Không tìm được thì trả lời "bỏ cuộc".

Không đọc hay mở file nào. Trả về đúng một khối JSON, không viết gì khác:
[{"viec": "T1", "duong": ["mã", "mã", "..."], "quay_lai": 0, "chac": "cao | vừa | thấp"}, ...]
"duong" là các mã theo thứ tự bạn mở, kể cả nhánh đã quay lại; mã cuối là nút bạn dừng. Bỏ cuộc thì "duong" kết thúc bằng "bỏ cuộc".

CÂY
{cây}

VIỆC
{việc: mỗi dòng "T1 · vai: … · câu việc"}
```
