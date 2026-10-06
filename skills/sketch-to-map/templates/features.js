// Kiểm kê chức năng (M1). Khuôn từ sketch-to-map/templates/features.js: chép thành map/features.js rồi điền. Ví dụ đủ: features.example.js.
// - Một chức năng là một việc người dùng làm (động từ + đối tượng), kể cả việc chỉ được ngụ ý trong quy tắc, ma trận quyền, luồng lỗi,
//   thông báo tự động, cấu hình, báo cáo, xuất file, thao tác hàng loạt. Cách nhận ra: references/m1-kiem-ke.md.
// - Mỗi chức năng một dòng, spec khoảng 200 ký tự; chi tiết thì trỏ nguồn (src), không chép tài liệu.
// - Kiểm: node <skills>/sketch-to-map/scripts/map.mjs check <thư-mục-prototype>.
window.FEATURES = {
  project: '',
  features: [
    // id: F-01, F-02… không đổi sau khi đã có layout.js
    // name: tên việc theo lời người dùng, không chứa mã tham chiếu; cũng là nhãn trên màn
    // module: mã module (nhóm theo đối tượng); roles: mã vai làm việc này ([] khi hệ thống tự làm)
    // src: mã gốc (UC-01, BR-TT-02…) hay dải dòng của tài liệu (D2:120-140)
    // freq: ngay · tuan · hiem · evidence: ro (tài liệu nói rõ) · suy (suy ra; người dùng xác nhận ở cổng)
    // status: pham-vi · hoan (để đợt sau: vẫn có chỗ trong bản đồ và trang chờ trên prototype)
    // { id: 'F-01', name: '', module: '', src: [], roles: [], freq: 'ngay', evidence: 'ro', status: 'pham-vi', spec: '' },
  ],
  // Mục tài liệu cấp ≤ 3 không sinh chức năng nào, kèm lý do (giới thiệu, phụ lục thuật ngữ…)
  skip: [
    // { src: 'D1:1-20', why: '' },
  ],
};
