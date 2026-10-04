// SAMPLE concept board data (fictional project Hạt Mây), every field filled. Only the tests use this file.
// The skeleton agents fill is templates/concepts.js. The board shows a "sample data" banner while example: true remains.
// - Loaded with <script>, not fetch: a page opened from file:// cannot fetch local files.
// - Colour roles follow the columns of ui-ux-pro-max/data/colors.csv, in kebab-case. Colours in hex or oklch(); the board also measures derived colours (hover, soft background, control border, focus ring) as themes.mjs will generate them.
//   tokens.js emits CSS variables with the kit's shared names: background → --bg, card → --surface, foreground → --ink,
//   muted-foreground → --muted, border → --line, muted → --muted-bg; other roles keep their names (--primary, --on-primary…).
//   Each concept declares ONE palette: "light" when the concept's background is light, "dark" when it is dark. Never add a second
//   palette for dark (or light) mode on your own: declare both only when the user asked (in the brief, or Gate 2 question 2).
// - id: lowercase a-z, digits, hyphen (used in the mix code, screen file names like a.html, selectors). The board reports a bad id.
//   Letters are only creation order: a, b, c in round 1, then d, e… in later rounds. They carry no safe or bold role.
// - Declare fonts in fontFamily: { … } so preflight.py and scripts/check.mjs check Vietnamese support (P07). fontWeights lists the weights the font really has.
//   body: 'system-ui' = body text in the platform font (app: SF Pro, Roboto via --app-font); no --brand-font is emitted then.
// - shape.texture: none · grid · dots · grain.
// - axes: 6 axes to compare (concept-method.md §4). Each pair differs on >= 3 axes, layout skeleton included;
//   a pair sharing one screen differs on >= 2 of the 3 axes nen, chatNen, chu.
// - why: one sentence of reason from the content for each form choice: mau, chu, hinh (radius and shadow), chatNen. Missing ones get a label on the board.
// - round: the concept's round (default 1). rounds: one line per round; note = the user's verbatim feedback that opened it.
// - screen: a concept that changes only the form layer gives the id of the concept whose screen it reuses, and has no screen file.
// - recommended: true on exactly one concept, after building and checking.
// - Text the user reads on the board (name, idea, axes values, why, content) is in the user's language.
// - content: content SHARED by every key screen, so the user compares concepts, not content.
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
  rounds: [{ n: 1, note: '' }],
  concepts: [
    {
      id: 'a',
      name: 'Sổ tay rang',
      round: 1,
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
      },
      fontFamily: { display: 'Newsreader', body: 'Be Vietnam Pro', mono: 'JetBrains Mono' },
      fontWeights: { display: '400;600', body: '400;500;600', mono: '400;500' },
      shape: { radius: { sm: '4px', md: '6px', lg: '10px' }, shadow: 'none', borderWidth: '1px', texture: 'grain' },
      why: { mau: 'Mực xanh rêu của sổ tay và đỏ son của bút chấm điểm khi nếm thử.', chu: 'Serif biên tập cho chữ in của sổ tay, mono cho số liệu rang ghi lề.',
             hinh: 'Góc gần vuông như mép trang giấy, không bóng: sổ tay nằm phẳng trên bàn.', chatNen: 'Hạt giấy mịn của trang sổ.' },
    },
    {
      id: 'b',
      name: 'Phiếu thông số',
      round: 1,
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
      why: { mau: 'Nền tối của bảng điều khiển máy rang, cam là màu đèn báo nhiệt.', chu: 'Grotesk tinh và mono như nhãn in trên thiết bị đo.',
             hinh: 'Góc 2 đến 6px như khung đồng hồ kim loại, viền mảnh thay cho bóng.', chatNen: 'Lưới kỹ thuật của giấy vẽ máy.' },
    },
    {
      id: 'c',
      name: 'Mùa hoa cà phê',
      round: 1,
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
      },
      fontFamily: { display: 'Bricolage Grotesque', body: 'Be Vietnam Pro' },
      fontWeights: { display: '600;800', body: '400;500;600' },
      shape: { radius: { sm: '999px', md: '20px', lg: '28px' }, shadow: '0 12px 32px -12px rgba(18,35,27,.45)', borderWidth: '0px', texture: 'grain' },
      why: { mau: 'Xanh lá, vàng hoa và đỏ quả lấy từ chính cây cà phê theo mùa.', chu: 'Display cá tính cho tên mùa, đọc được từ xa trên dải tháng.',
             hinh: 'Bo tròn lớn như cánh hoa và quả chín, bóng mềm như nắng chiều.', chatNen: 'Hạt giấy như tờ lịch mùa vụ in.' },
    },
  ],
};
