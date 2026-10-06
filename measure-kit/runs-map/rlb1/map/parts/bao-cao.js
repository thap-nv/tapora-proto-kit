window.PART = {
  module: 'bao-cao',
  features: [
    { name: 'Xem báo cáo chuyên cần', src: ['UC-11', 'S-01', 'YC-13', 'D6:115', 'D6:390', 'D3:1003-1077'], roles: ['quan-ly', 'le-tan'], freq: 'tuan', evidence: 'ro', status: 'pham-vi', spec: 'Chọn khoảng thời gian (mặc định tháng hiện tại); xem tỉ lệ đi học theo lớp và theo HLV, kèm số buổi vắng không phép. Quản lý và lễ tân xem được; HLV không.' },
    { name: 'Xem báo cáo doanh thu', src: ['UC-11', 'S-01', 'YC-13', 'BR-QT-03', 'D6:116', 'D3:1079-1153'], roles: ['quan-ly'], freq: 'tuan', evidence: 'ro', status: 'pham-vi', spec: 'Chọn khoảng thời gian (mặc định tháng hiện tại); xem tổng thu theo tháng, theo loại gói, theo hình thức thanh toán. Chỉ quản lý: lễ tân và HLV không thấy doanh thu.' },
    { name: 'Xuất báo cáo ra Excel', src: ['D6:117', 'YC-13', 'D3:1155-1229'], roles: ['quan-ly'], freq: 'hiem', evidence: 'ro', status: 'pham-vi', spec: 'Tải báo cáo đang xem, theo khoảng thời gian đã chọn, ra file Excel để gửi kế toán. Chỉ quản lý.' },
  ],
  skip: [],
};
