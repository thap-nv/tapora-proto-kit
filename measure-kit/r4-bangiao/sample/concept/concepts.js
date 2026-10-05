// Dữ liệu của bảng concept. Khung từ sketch-to-concept/templates/concepts.js: chép vào concept/concepts.js rồi điền.
// - Nạp bằng <script>, không fetch: trang mở bằng file:// thì trình duyệt chặn fetch file cục bộ.
// - Vai trò màu theo cột của ui-ux-pro-max/data/colors.csv, viết kebab-case. Màu viết mã hex hoặc oklch(); bảng đo cả màu dẫn xuất (hover, nền nhạt, viền control, vòng focus) như themes.mjs sẽ sinh.
//   tokens.js xuất biến CSS theo tên chung của kit: background → --bg, card → --surface, foreground → --ink,
//   muted-foreground → --muted, border → --line, muted → --muted-bg; vai trò khác giữ tên (--primary, --on-primary…).
//   Concept khoá một nền thì chỉ khai "light" hoặc chỉ "dark".
// - id: chữ thường a-z, số, dấu gạch ngang (dùng trong mã trộn, tên file màn a.html, selector). Bảng báo lỗi nếu sai.
//   Chữ cái chỉ là thứ tự tạo: a, b, c ở vòng 1, rồi d, e… ở vòng sau. Không mang vai an toàn hay táo bạo.
// - Font khai trong fontFamily: { … } để preflight.py kiểm dấu tiếng Việt (P07). fontWeights ghi độ đậm font thật sự có.
//   body: 'system-ui' = thân chữ theo font nền tảng (app: SF Pro, Roboto qua --app-font); khi đó không sinh --brand-font.
// - shape.texture: none · grid · dots · grain.
// - axes: 6 trục để so (concept-method.md mục 4). Mỗi cặp khác nhau >= 3 trục, trong đó có khung bố cục;
//   cặp dùng chung một màn khác nhau >= 2 trong 3 trục nen, chatNen, chu.
// - why: một câu lý do từ nội dung cho mỗi lựa chọn Hình: mau, chu, hinh (bo góc và bóng), chatNen. Thiếu thì bảng gắn nhãn.
// - round: vòng của concept (mặc định 1). rounds: mỗi vòng một dòng; note = góp ý nguyên văn của người dùng mở vòng đó.
// - screen: concept chỉ đổi lớp Hình thì ghi id của concept có màn để dùng lại, và không viết file màn riêng.
// - recommended: true ở đúng một concept, sau khi dựng và soát xong.
// - content: nội dung DÙNG CHUNG cho mọi màn then chốt, để người dùng so concept chứ không so nội dung.
window.CONCEPTS = {
  project: 'Lò Bánh Củi Cô Ba',
  brief: [
    { label: 'Sản phẩm', text: 'Site giới thiệu một trang, chỉ web, một bề mặt.', source: 'người dùng nói' },
    { label: 'Cho ai', text: 'Khách du lịch và người địa phương ở Đà Lạt, lướt điện thoại tìm chỗ ăn sáng.', source: 'người dùng nói' },
    { label: 'Việc chính', text: 'Xem mẻ bánh sắp ra lò · xem giờ mở và đường đi · đặt giữ bánh qua Zalo. Loại màn: giới thiệu, 1/1 màn.', source: 'người dùng nói · số màn đếm từ "site giới thiệu một trang"' },
    { label: 'Khác biệt', text: 'Bánh nướng lò củi, 4 mẻ cố định mỗi ngày (6:00, 9:30, 15:00, 17:30), mẻ nào hết là hết.', source: 'người dùng nói' },
    { label: 'Định hướng', text: 'Ấm, mộc, đáng tin · ghét sến, kiểu quán cà phê sống ảo.', source: 'người dùng nói' },
    { label: 'Ràng buộc', text: 'Chưa có logo hay màu brand, không có tham chiếu.', source: 'người dùng nói' },
  ],
  content: {
    badge: 'Lò củi · 4 mẻ mỗi ngày',
    headline: 'Bốn mẻ bánh lò củi mỗi ngày. Mẻ nào hết là hết.',
    body: 'Lò Bánh Củi Cô Ba nướng bánh bằng lò củi, ra lò lúc 6:00, 9:30, 15:00 và 17:30. Nhắn Zalo để giữ bánh trước khi tới.',
    cta: 'Giữ bánh qua Zalo',
    secondary: 'Xem đường đi',
    inputLabel: 'Giữ bánh mẻ',
    inputPlaceholder: 'Chọn mẻ 6:00, 9:30, 15:00 hoặc 17:30',
    numbers: '6:00 · 9:30 · 15:00 · 17:30',
    cardTitle: 'Mở 5:30 đến 19:00, nghỉ thứ Hai',
    cardText: '14 Hai Bà Trưng, Phường 1, Đà Lạt · Zalo 0909 123 456',
    batches: ['6:00', '9:30', '15:00', '17:30'],
    products: [
      { name: 'Bánh mì que củi', price: '8.000 ₫' },
      { name: 'Bánh mì đặc ruột', price: '6.000 ₫' },
      { name: 'Bánh sừng bò bơ Đà Lạt', price: '22.000 ₫' },
      { name: 'Bánh nho Bảo Lộc', price: '18.000 ₫' },
    ],
    address: '14 Hai Bà Trưng, Phường 1, Đà Lạt',
    hours: 'Mở 5:30 đến 19:00 · nghỉ thứ Hai',
    zalo: '0909 123 456',
    illustrative: 'Giờ hiện tại 8:40 và trạng thái từng mẻ là minh hoạ, chưa nối dữ liệu thật. Mỗi mẻ ra đủ 4 món: giả định, chờ Cô Ba xác nhận.',
  },
  rounds: [{ n: 1, note: '' }],
  concepts: [
    {
      id: 'a', name: 'Dấu giờ ra lò', round: 1,
      source: { kind: 'lăng kính studio', ref: 'Rice Creative (Sài Gòn), bao bì Marou: lấy đồ in thủ công đời thường của Việt Nam (dấu cao su, in lụa ở Chợ Lớn) làm hệ nhận diện. Mượn cách nghĩ, không mô phỏng bao bì' },
      family: 'Brutalist · Swiss công nghiệp, bản in thủ công ấm', dial: '6/3/5',
      idea: 'Mỗi mẻ bánh rời lò mang một con dấu giờ: trang web là tờ giấy gói bánh của Cô Ba, đóng dấu đúng mẻ bạn giữ.',
      metaphor: 'Con dấu ngày giờ bằng cao su và tờ giấy kraft gói bánh ở quầy.',
      formFrom: 'Bốn mốc giờ cố định là thứ tiệm này có mà tiệm khác không, và việc chính là giữ bánh theo mẻ: bốn mốc thành bốn ô dấu giờ 6:00, 9:30, 15:00, 17:30 in sẵn trên tờ phiếu giữ bánh; khách đóng dấu vào đúng mẻ mình giữ, mẻ đã hết thì ô dấu bị gạch chéo bằng mực.',
      signature: 'Đóng dấu phiếu giữ bánh: chọn mẻ và số bánh từng món, bấm con dấu, phiếu hiện tin nhắn soạn sẵn kèm nút mở Zalo 0909 123 456.',
      axes: {
        nen: 'Khối giấy kraft đặc',
        chatNen: 'Sợi giấy kraft',
        chu: 'Slab khắc gỗ của bảng hiệu + mono của con dấu ngày',
        yTuong: 'Hiện vật: tờ phiếu và con dấu',
        khoanhKhac: 'Một con dấu giờ khổng lồ đóng nghiêng, lấn ra mép tờ phiếu',
        khung: 'Một cột phiếu dọc như cuống biên nhận, màn đầu đã là phiếu giữ bánh (món, số lượng, ô dấu giờ); giờ mở và đường đi in ở mặt sau tờ phiếu, cuối cột',
      },
      colors: {
        light: {
          background: '#E2D3B7', foreground: '#241C14', card: '#F2EADA', 'card-foreground': '#241C14',
          muted: '#D6C5A6', 'muted-foreground': '#594834', border: '#6E5B43',
          primary: '#A8261C', 'on-primary': '#FBF4E6', accent: '#2F3A8F', 'on-accent': '#FBF4E6',
          destructive: '#8E1F17', 'on-destructive': '#FBF4E6', ring: '#2F3A8F',
        },
      },
      fontFamily: { display: 'Alfa Slab One', body: 'Aleo', mono: 'Chivo Mono' },
      fontWeights: { display: '400', body: '400;500;700', mono: '400;600' },
      shape: { radius: { sm: '0px', md: '0px', lg: '2px' }, shadow: 'none', borderWidth: '2px', texture: 'grain' },
      why: {
        mau: 'Nâu kraft của giấy gói bánh mì làm nền, đỏ son của mực dấu cao su cho nút giữ bánh, xanh tím của mực dấu ngày cho bốn mốc giờ: ba thứ có sẵn trên quầy bánh.',
        chu: 'Alfa Slab One như chữ khắc gỗ của bảng hiệu và tem in cũ; Chivo Mono cho số giờ như mặt số của con dấu ngày; Aleo là slab mềm cho thân chữ, cùng họ chữ in mà vẫn dễ đọc trên điện thoại.',
        hinh: 'Góc vuông như mép phiếu xé và mặt con dấu; không bóng vì giấy nằm phẳng trên quầy; viền 2px như nét mực in.',
        chatNen: 'Sợi giấy kraft, vì cả trang là tờ giấy gói bánh.',
      },
    },
    {
      id: 'b', name: 'Một ngày, bốn vết rạch', round: 1,
      source: { kind: 'hợp nhất', ref: 'Họ Hiện đại tối giản + ui-ux-pro-max (bakery, dial 5/3/3): giữ kỷ luật viền 1px, một màu cho hành động; bỏ bảng nâu kem #92400E/#FEF3C7 của dữ liệu' },
      family: 'Hiện đại tối giản', dial: '5/3/3',
      idea: 'Một ngày của lò là một thanh giờ 5:30 đến 19:00 có bốn vết rạch; nhìn một lần là biết mẻ kế còn cách bạn bao xa.',
      metaphor: 'Vết dao rạch trên mặt bánh trước khi vào lò: mỗi vết là một mẻ trên thân một ngày.',
      formFrom: 'Khác biệt của tiệm nằm trên một trục là giờ: giờ mở 5:30 đến 19:00 thành một thanh ngang, bốn mẻ là bốn vết rạch xiên đặt đúng tỉ lệ thời gian, nên 6:00 nằm sát đầu thanh và khoảng trống dài giữa 9:30 và 15:00 là lúc lò không ra mẻ nào.',
      signature: 'Kéo mốc "Tôi tới lúc…" dọc thanh ngày: màn báo mẻ bạn bắt kịp, mẻ đã qua, còn bao lâu tới giờ ra lò, rồi giữ bánh đúng mẻ đó qua Zalo.',
      axes: {
        nen: 'Sáng màu sương sớm, xám xanh rất nhạt',
        chatNen: 'Trơn, phẳng',
        chu: 'Grotesk tinh + mono cho số giờ',
        yTuong: 'Dụng cụ chính xác: thước đo một ngày',
        khoanhKhac: 'Thanh ngày tràn qua hai mép màn hình',
        khung: 'Màn đầu là câu trạng thái lớn về mẻ kế, đặt trên thanh ngày tràn mép; section là bảng giờ dọc, khoảng cách giữa các dòng tỉ lệ với khoảng thời gian giữa các mẻ',
      },
      colors: {
        light: {
          background: '#EDF0ED', foreground: '#18201C', card: '#FFFFFF', 'card-foreground': '#18201C',
          muted: '#DFE4E0', 'muted-foreground': '#4A5650', border: '#C4CCC6',
          primary: '#1B6349', 'on-primary': '#F4F7F5', accent: '#9A5216', 'on-accent': '#FFF8F0',
          destructive: '#B42318', 'on-destructive': '#FFF8F6', ring: '#1B6349',
        },
      },
      fontFamily: { display: 'Familjen Grotesk', body: 'Hanken Grotesk', mono: 'Geist Mono' },
      fontWeights: { display: '500;600;700', body: '400;500;600', mono: '400;500' },
      shape: { radius: { sm: '4px', md: '6px', lg: '999px' }, shadow: 'none', borderWidth: '1px', texture: 'none' },
      why: {
        mau: 'Xám xanh của sương sớm Đà Lạt lúc mẻ 6:00 ra lò làm nền; nâu vỏ bánh nướng cho bốn vết rạch; xanh lá thông Đà Lạt cho mốc "bây giờ" và nút giữ bánh.',
        chu: 'Familjen Grotesk gọn như chữ khắc trên thước đo; Geist Mono có số rộng đều để 6:00, 9:30, 15:00, 17:30 thẳng cột; Hanken Grotesk rõ ở cỡ nhỏ khi khách đứng ngoài trời đọc trên điện thoại.',
        hinh: 'Bo 6px, viền 1px, không bóng như một dụng cụ đo nằm phẳng; thanh ngày bo tròn hai đầu như thanh trượt; vết rạch là nét xiên duy nhất trên màn.',
        chatNen: 'Trơn, vì sương là một mặt phẳng và thanh ngày phải là hình duy nhất trên màn.',
      },
    },
    {
      id: 'c', name: 'Cửa lò mở bốn lần', round: 1, recommended: true,
      source: { kind: 'chuẩn thật', ref: 'Lune Croissanterie (Melbourne, site do A Friend of Mine làm, đã kiểm bằng WebSearch): nền tối, sản phẩm làm nhân vật, luật mua nói thẳng (đặt trước, hết là hết). Mượn cách bày luật và dẫn tới đặt trước, không chép giao diện, ảnh hay chữ' },
      family: 'Awwwards · Trải nghiệm điện ảnh, tiết chế', dial: '7/4/3',
      idea: 'Cửa lò củi chỉ mở bốn lần một ngày; trang web là cái cửa lò ấy: vòm tối, mở ra là thấy mẻ bánh.',
      metaphor: 'Miệng vòm lò gạch nung củi.',
      formFrom: 'Lò củi xây vòm gạch là thứ làm nên tiệm: bốn mẻ thành bốn ô cửa vòm; vòm của mẻ đang nướng sáng màu than hồng, vòm đã hết tối lại; câu "mẻ nào hết là hết" viết thẳng như nội quy treo cạnh lò.',
      signature: 'Bấm một ô cửa vòm để mở mẻ đó: thấy món trong khay, giá, trạng thái (đã hết, đang nướng, chưa vào lò) và nút giữ bánh của đúng mẻ.',
      axes: {
        nen: 'Tối muội than củi',
        chatNen: 'Trơn tối, ánh lửa chỉ trong lòng vòm',
        chu: 'Serif mềm cỡ lớn + sans chân loe ấm',
        yTuong: 'Sân khấu: cửa lò mở ra',
        khoanhKhac: 'Đổi chất liệu một lần: vòm của mẻ đang nướng chuyển từ gạch tối sang than hồng',
        khung: 'Màn đầu là một vòm lớn căn giữa ôm giờ mẻ kế, chữ tiết chế; section là hàng bốn ô cửa vòm, dưới là nội quy ba dòng',
      },
      colors: {
        dark: {
          background: '#16100C', foreground: '#F3E9DC', card: '#241A14', 'card-foreground': '#F3E9DC',
          muted: '#2E231C', 'muted-foreground': '#B8A693', border: '#5A4638',
          primary: '#F08A3C', 'on-primary': '#1A0F08', accent: '#6B2D1C', 'on-accent': '#FFF1E4',
          destructive: '#F0705F', 'on-destructive': '#1A0F08', ring: '#F08A3C',
        },
      },
      fontFamily: { display: 'Fraunces', body: 'Commissioner', mono: 'IBM Plex Mono' },
      fontWeights: { display: '400;600', body: '400;500;600', mono: '400;500' },
      shape: { radius: { sm: '2px', md: '4px', lg: '999px' }, shadow: 'none', borderWidth: '1px', texture: 'none' },
      why: {
        mau: 'Nâu đen của muội than củi làm nền; cam than hồng của lửa trong lò cho mẻ đang nướng và nút giữ bánh; đỏ gạch chịu lửa cho các vòm đang đóng.',
        chu: 'Fraunces nét tròn mềm như mép bánh nở trong lò; Commissioner chân loe nhẹ, ấm hơn grotesk mà vẫn rõ trên nền tối; IBM Plex Mono cho giờ và giá.',
        hinh: 'Vòm cung là miệng lò gạch; ngoài vòm thì góc gần vuông như viên gạch; không bóng, ánh sáng chỉ đến từ lòng vòm đang mở.',
        chatNen: 'Không vân: nền là bóng tối trước miệng lò, để vòm đang nướng là chỗ sáng duy nhất.',
      },
    },
  ],
};
