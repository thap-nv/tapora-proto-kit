// Dữ liệu của bảng concept. Mẫu từ sketch-to-concept/templates/concepts.js.
// Chép vào concept/concepts.js rồi THAY TOÀN BỘ dữ liệu mẫu bằng dữ liệu của dự án, và xoá dòng "example: true".
// Còn dòng đó thì bảng hiện dải cảnh báo "dữ liệu mẫu".
// - Nạp bằng <script>, không fetch: trang mở bằng file:// thì trình duyệt chặn fetch file cục bộ.
// - Vai trò màu theo cột của ui-ux-pro-max/data/colors.csv, viết kebab-case. Màu viết mã hex hoặc oklch(); bảng đo cả màu dẫn xuất (hover, nền nhạt, viền control, vòng focus) như themes.mjs sẽ sinh.
//   tokens.js xuất biến CSS theo tên chung của kit: background → --bg, card → --surface, foreground → --ink,
//   muted-foreground → --muted, border → --line, muted → --muted-bg; vai trò khác giữ tên (--primary, --on-primary…).
//   Concept khoá một nền thì chỉ khai "light" hoặc chỉ "dark".
// - id: chữ thường a-z, số, dấu gạch ngang (dùng trong mã trộn, tên file màn a.html, selector). Bảng báo lỗi nếu sai.
// - Font khai trong fontFamily: { … } để preflight.py kiểm dấu tiếng Việt (P07). fontWeights ghi độ đậm font thật sự có.
//   body: 'system-ui' = thân chữ theo font nền tảng (app: SF Pro, Roboto qua --app-font); khi đó không sinh --brand-font.
// - shape.texture: none · grid · dots · grain.
// - axes: 6 trục để so (SKILL.md, A2). Mỗi cặp concept phải khác nhau >= 3 trục, trong đó có khung bố cục.
// - content: nội dung DÙNG CHUNG cho cả 3 màn then chốt, để người dùng so concept chứ không so nội dung.
window.CONCEPTS = {
  example: true,
  project: 'Hạt Mây, nhà rang cà phê đặc sản ở Đà Lạt',
  brief: [
    { label: 'Sản phẩm', text: 'Site giới thiệu và bán hạt rang của một nhà rang nhỏ. Web, xem nhiều trên điện thoại.', source: 'người dùng nói' },
    { label: 'Cho ai', text: 'Người tự pha cà phê ở nhà, đọc kỹ trước khi mua, lướt điện thoại buổi tối.', source: 'đoán' },
    { label: 'Việc chính', text: 'Chọn hạt theo gu vị, đặt mua theo tuần. Màn chiếm nhiều nhất: trang một lô hạt (6/11 chức năng).', source: 'tài liệu yêu cầu, mục 2' },
    { label: 'Khác biệt', text: 'Mỗi lô công khai đủ nhật ký rang: nhiệt độ, thời gian, người rang.', source: 'người dùng nói' },
    { label: 'Định hướng', text: 'Tĩnh, chính xác, ấm. Thích sổ tay pha chế. Ghét kiểu quán cổ điển gỗ nâu.', source: 'người dùng nói' },
    { label: 'Ràng buộc', text: 'Đã có logo chữ, chưa có màu thương hiệu. Không dùng ảnh người.', source: 'người dùng nói' },
  ],
  content: {
    badge: 'Rang sáng',
    headline: 'Lô Xuân Trường 07: rang sáng, hậu vị mận chín',
    body: 'Rang ngày 21/09 bởi Trần Minh Khoa. Đường nhiệt đầy đủ ở bên dưới, để bạn pha đúng như chúng tôi đã nếm.',
    cta: 'Đặt 250 g',
    secondary: 'Xem nhật ký rang',
    inputLabel: 'Bạn pha bằng gì?',
    inputPlaceholder: 'V60, phin, espresso',
    numbers: '205 °C · 11 phút 40 giây · 185.000 ₫',
    cardTitle: 'Gợi ý pha',
    cardText: '15 g cà phê, 250 ml nước 92 °C, 2 phút 45 giây.',
  },
  concepts: [
    {
      id: 'a',
      name: 'Sổ tay rang',
      recommended: true,
      source: { kind: 'hợp nhất', ref: 'Họ Editorial · Tạp chí (style-catalogue.md, họ 2).' },
      family: 'Editorial · Tạp chí',
      dial: '6/3/3',
      idea: 'Mỗi lô hạt là một trang sổ tay của người rang: số liệu ghi lề cạnh chữ in.',
      metaphor: 'Sổ tay pha chế',
      formFrom: 'Nhật ký rang có thật của từng lô (dòng Khác biệt): đường nhiệt thành đường kẻ trang, con số thành ghi chú lề.',
      signature: 'Kéo thanh thời gian trên đường nhiệt để xem hạt ở từng mốc rang.',
      axes: { nen: 'Sáng tinh', chatNen: 'Giấy', chu: 'Serif biên tập + sans', yTuong: 'Hồ sơ lưu trữ', khoanhKhac: 'Ghi chú dọc lề', khung: 'Cột chữ 65ch, ghi chú lề phải' },
      colors: {
        light: { background: '#F3F4F1', foreground: '#1F2A24', card: '#FFFFFF', 'card-foreground': '#1F2A24', muted: '#E6E8E3', 'muted-foreground': '#56615A',
                 border: '#D5D9D2', primary: '#1F2A24', 'on-primary': '#F3F4F1', accent: '#B3261E', 'on-accent': '#FFFFFF',
                 destructive: '#B3261E', 'on-destructive': '#FFFFFF', ring: '#B3261E' },
        dark: { background: '#121714', foreground: '#E7EBE6', card: '#1A201C', 'card-foreground': '#E7EBE6', muted: '#232A25', 'muted-foreground': '#A3ADA6',
                border: '#2E3631', primary: '#E7EBE6', 'on-primary': '#121714', accent: '#E0574D', 'on-accent': '#121714',
                destructive: '#E0574D', 'on-destructive': '#121714', ring: '#E0574D' },
      },
      fontFamily: { display: 'Newsreader', body: 'Be Vietnam Pro', mono: 'JetBrains Mono' },
      fontWeights: { display: '400;600', body: '400;500;600', mono: '400;500' },
      shape: { radius: { sm: '4px', md: '6px', lg: '10px' }, shadow: 'none', borderWidth: '1px', texture: 'grain' },
    },
    {
      id: 'b',
      name: 'Phiếu thông số',
      source: { kind: 'chuẩn thật', ref: 'Trang sản phẩm dạng phiếu thông số của một nhà rang có thật. Ghi tên thật sau khi đã kiểm bằng WebSearch.' },
      family: 'SaaS · Công nghệ cao cấp',
      dial: '7/4/5',
      idea: 'Hạt rang trình bày như một thiết bị đo: mọi con số đều đúng và đọc được ngay.',
      metaphor: 'Bảng thông số máy rang',
      formFrom: 'Số liệu rang là nội dung chính của trang lô hạt, nên con số làm nhân vật, chữ đi sau.',
      signature: 'Bấm một thông số để xem nó đổi hương vị thế nào.',
      axes: { nen: 'Tối sâu', chatNen: 'Lưới kỹ thuật', chu: 'Grotesk tinh + mono', yTuong: 'Dụng cụ chính xác', khoanhKhac: 'Một con số khổng lồ làm cấu trúc', khung: 'Bảng thông số hai cột, số bên trái' },
      colors: {
        dark: { background: '#14110F', foreground: '#EDE8E3', card: '#1C1815', 'card-foreground': '#EDE8E3', muted: '#26211D', 'muted-foreground': '#A89F97',
                border: '#332C27', primary: '#FF6A3D', 'on-primary': '#14110F', accent: '#FF6A3D', 'on-accent': '#14110F',
                destructive: '#FF5A5A', 'on-destructive': '#14110F', ring: '#FF6A3D' },
      },
      fontFamily: { display: 'Archivo', body: 'Be Vietnam Pro', mono: 'IBM Plex Mono' },
      fontWeights: { display: '500;700', body: '400;500', mono: '400;600' },
      shape: { radius: { sm: '2px', md: '4px', lg: '6px' }, shadow: 'none', borderWidth: '1px', texture: 'grid' },
    },
    {
      id: 'c',
      name: 'Mùa hoa cà phê',
      source: { kind: 'lăng kính studio', ref: 'Tư duy của một studio nhận diện: chọn một ý thị giác rồi đẩy tới cùng. Ghi tên studio đã chọn và lý do.' },
      family: 'Awwwards · Trải nghiệm điện ảnh',
      dial: '8/7/3',
      idea: 'Kể lô hạt theo mùa vụ: từ hoa trắng tháng Ba tới quả chín tháng Mười Một.',
      metaphor: 'Lịch mùa vụ',
      formFrom: 'Lô hạt gắn với mùa thu hoạch ở Đà Lạt: màu lấy từ lá, hoa và quả của chính cây cà phê.',
      signature: 'Vuốt dải 12 tháng để thấy lô hạt nằm ở đâu trong mùa vụ.',
      axes: { nen: 'Khối màu đặc', chatNen: 'Giấy', chu: 'Display cá tính', yTuong: 'Hành trình', khoanhKhac: 'Tràn lề có chủ đích', khung: 'Dải ngang 12 tháng, nội dung theo mốc' },
      colors: {
        light: { background: '#1F3B2D', foreground: '#F2F5EE', card: '#27473A', 'card-foreground': '#F2F5EE', muted: '#2F5243', 'muted-foreground': '#C9D6CC',
                 border: '#3D6353', primary: '#F2C14E', 'on-primary': '#1F3B2D', accent: '#F2C14E', 'on-accent': '#1F3B2D',
                 destructive: '#FF8A80', 'on-destructive': '#1F3B2D', ring: '#F2C14E' },
        dark: { background: '#12231B', foreground: '#EEF3EA', card: '#1A3025', 'card-foreground': '#EEF3EA', muted: '#213A2E', 'muted-foreground': '#B7C6BB',
                border: '#2C4A3C', primary: '#F2C14E', 'on-primary': '#12231B', accent: '#F2C14E', 'on-accent': '#12231B',
                destructive: '#FF8A80', 'on-destructive': '#12231B', ring: '#F2C14E' },
      },
      fontFamily: { display: 'Bricolage Grotesque', body: 'Be Vietnam Pro' },
      fontWeights: { display: '600;800', body: '400;500;600' },
      shape: { radius: { sm: '999px', md: '20px', lg: '28px' }, shadow: '0 12px 32px -12px rgba(18,35,27,.45)', borderWidth: '0px', texture: 'grain' },
    },
  ],
};
