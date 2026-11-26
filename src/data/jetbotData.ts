import { JetBotComponent, JetBotFunction } from '../types/jetbot';

export interface RealPhotoItem {
  url: string;
  title: string;
  desc: string;
}

export const REAL_PHOTOS_GALLERY: RealPhotoItem[] = [
  {
    url: '/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg',
    title: 'Góc chụp 3/4 thực tế: Robot JetBot ROS AI Kit hoàn chỉnh',
    desc: 'Hình ảnh thực tế trên bàn: Cụm RPLIDAR A1 có nắp logo khắc chữ, quạt làm mát 40mm bắt 4 ốc trên tấm deck, đế nhôm anodized xanh lá, mâm xanh 10 chấu mạ crom và bánh mắt trâu.',
  },
  {
    url: '/assets/aistudio/1793236899973_5870436072623479520_g1886750943568300472_16bf7651167fdbf1d8da1d81a2d459b9_d0011276.jpg',
    title: 'Ảnh tiêu chuẩn hãng: JetBot ROS AI Kit (Góc 3/4)',
    desc: 'Hình ảnh nhận diện tiêu chuẩn: Cáp bẹ trắng CSI uốn cong chữ U, giá đỡ camera màu xanh lá với 2 ốc khía rãnh, mâm xe xanh dương và cụm quét laser 360 độ.',
  },
  {
    url: '/assets/aistudio/1793236900029_5870436072623479520_g1886750943568300472_66c73f40bc03ab3e23367b78ebffdc29_0debb711.jpg',
    title: 'Cận cảnh cụm RPLIDAR A1: Motor truyền động & Dây curoa',
    desc: 'Góc chụp kỹ thuật bên hông: Motor kim loại phụ kéo puly và dây curoa cao su đen quay tháp laser, bên dưới có mạch cảm biến và dây cáp cắm về bo mạch.',
  },
  {
    url: '/assets/aistudio/1793236900919_5870436072623479520_g1886750943568300472_9cf1488022433e9767c7239e392b381a_a51c9178.jpg',
    title: 'Mặt đáy gầm xe: 2 động cơ kim loại & 2 bánh mắt trâu',
    desc: 'Cấu trúc gầm đối xứng chuẩn xác: 2 động cơ DC kim loại GA25 nằm ngang ở giữa, 1 bánh mắt trâu xoay ở trước và 1 bánh mắt trâu ở sau giúp robot tự cân bằng.',
  },
  {
    url: '/assets/aistudio/1793236900786_5870436072623479520_g1886750943568300472_1264e0e68822d3fffc961f2b9e6e3825_9d8e5505.jpg',
    title: 'Cận cảnh động cơ kim loại & khớp nối lục giác đồng',
    desc: 'Trục động cơ kết nối với mâm xe qua khớp nối lục giác bằng đồng siết ốc chí chắc chắn, kèm cụm dây tín hiệu encoder.',
  },
  {
    url: '/assets/aistudio/1793236900968_5870436072623479520_g1886750943568300472_c3b1e3c64d0ebc9bb6812da76c95d46a_77ec1397.jpg',
    title: 'Cụm cảm biến laser RPLIDAR A1 & Dây curoa',
    desc: 'Đầu quét laser xoay 360 độ được dẫn động bởi một motor phụ thông qua dây curoa cao su màu đen trên bệ đỡ hình giọt nước.',
  },
  {
    url: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
    title: 'Mặt trên bo mạch: Tản nhiệt, quạt làm mát & màn hình OLED',
    desc: 'Quạt tản nhiệt 40mm bắt 4 ốc vít kim loại vào khối tản nhiệt nhôm Jetson Nano, bên dưới là màn hình OLED hiển thị thông số hệ thống của Waveshare.',
  },
  {
    url: '/assets/aistudio/1793236900394_5870436072623479520_g1886750943568300472_294a585e4622eb53a165d0dd3369b352_6569300b.jpg',
    title: 'Cụm camera CSI trên giá đỡ nhôm xanh',
    desc: 'Giá đỡ nhôm xanh uốn gập chuyên dụng có 2 ốc siết khía rãnh kim loại cho phép tùy chỉnh góc nghiêng ngẩng/cúi của camera.',
  },
  {
    url: '/assets/aistudio/1793236900451_5870436072623479520_g1886750943568300472_eff07dde7ef09234bcc2fe8989d1e617_218f0b3f.jpg',
    title: 'Cụm cổng ngoại vi: 4x USB 3.0, Gigabit LAN & DC 5V',
    desc: 'Bo mạch mang Jetson Nano cung cấp đầy đủ các cổng giao tiếp tốc độ cao để gắn bàn phím, chuột, USB Wi-Fi và mạng nội bộ.',
  },
  {
    url: '/assets/aistudio/1793236899845_5870436072623479520_g1886750943568300472_88e6207bc4ef2cb56e8c7a46b816381e_67e497ae.jpg',
    title: 'Bánh xe bám đường vân gai chữ Z mâm xanh',
    desc: 'Lốp cao su đúc vân gai sâu chống trơn trượt kết hợp vành hợp kim mạ crom xanh dương nổi bật.',
  },
];

export const JETBOT_COMPONENTS: JetBotComponent[] = [
  {
    id: 'jetson-nano',
    nameVi: 'Bo mạch NVIDIA Jetson Nano',
    shortDesc: 'Bộ xử lý trung tâm, chạy chương trình AI và xử lý dữ liệu hình ảnh.',
    fullDesc: 'Trái tim của robot, trang bị GPU 128 nhân kiến trúc NVIDIA Maxwell và CPU Quad-core ARM. Đóng vai trò tính toán các thuật toán trí tuệ nhân tạo, thị giác máy tính và điều khiển toàn bộ robot.',
    roleVi: 'Bộ não AI & Trung tâm điều khiển',
    technicalTerm: 'NVIDIA Jetson Nano Developer Board',
    locationVi: 'Tầng giữa robot, gắn cố định trên cột đồng',
    connectionVi: 'Cổng CSI nối camera, cổng 40-pin GPIO nối mạch động cơ, cổng USB nối thiết bị ngoại vi',
    iconName: 'Cpu',
    color: '#10b981',
    anchorOffset: [0, 0.65, 0.05],
    explodedOffset: [0, 1.35, 0.05],
    primaryPhotoUrl: '/assets/aistudio/1793236901012_5870436072623479520_g1886750943568300472_e32b1d91ee2b2cfaa1159fe274f896f5_59fc177e.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế mặt trên bo mạch NVIDIA Jetson Nano: Khe cắm SO-DIMM 260-pin, khối tản nhiệt nhôm, cổng camera CSI và quạt làm mát.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236901012_5870436072623479520_g1886750943568300472_e32b1d91ee2b2cfaa1159fe274f896f5_59fc177e.jpg',
        caption: 'Mặt trên bo mạch vi xử lý NVIDIA Jetson Nano trên robot thực tế',
        tag: 'Cận cảnh đỉnh',
      },
      {
        url: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
        caption: 'Góc nghiêng 3D: Cụm tản nhiệt, quạt làm mát và màn hình OLED',
        tag: 'Góc nghiêng',
      },
      {
        url: '/assets/aistudio/1793236900451_5870436072623479520_g1886750943568300472_eff07dde7ef09234bcc2fe8989d1e617_218f0b3f.jpg',
        caption: 'Cụm cổng ngoại vi tốc độ cao: 4x USB 3.0, Gigabit LAN & DC 5V',
        tag: 'Cổng I/O',
      },
      {
        url: '/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg',
        caption: 'Vị trí bo mạch xử lý nằm ở tầng trung tâm của toàn bộ khối robot',
        tag: 'Toàn cảnh',
      },
    ],
    specs: [
      { label: 'Vi xử lý đồ họa (GPU)', value: '128 nhân NVIDIA Maxwell 472 GFLOPS' },
      { label: 'Bộ xử lý trung tâm (CPU)', value: 'Quad-core ARM Cortex-A57 @ 1.43 GHz' },
      { label: 'Bộ nhớ RAM', value: '4 GB 64-bit LPDDR4 25.6 GB/s' },
      { label: 'Lưu trữ hệ điều hành', value: 'Thẻ MicroSD 64GB (Ubuntu Linux 18.04 + JetPack)' },
      { label: 'Điện áp vận hành', value: '5V DC / 4A (nguồn dòng cao)' },
    ],
  },
  {
    id: 'camera',
    nameVi: 'Camera',
    shortDesc: 'Thu nhận hình ảnh và video để robot quan sát môi trường.',
    fullDesc: 'Mắt thần của robot JetBot, sử dụng cảm biến hình ảnh góc rộng kết nối trực tiếp với Jetson Nano qua cáp dẹp CSI ribbon. Cung cấp luồng khung hình độ phân giải cao theo thời gian thực cho mô hình AI.',
    roleVi: 'Thị giác robot (Computer Vision)',
    technicalTerm: 'CSI Camera Module (IMX219 / 160° FOV)',
    locationVi: 'Gắn trên giá đỡ nhôm xanh phía trước mũi xe',
    connectionVi: 'Cáp dẹp FPC kết nối trực tiếp vào khe cắm CSI trên bo mạch',
    iconName: 'Camera',
    color: '#06b6d4',
    anchorOffset: [0, 0.88, 1.55],
    explodedOffset: [0, 1.25, 1.95],
    primaryPhotoUrl: '/assets/aistudio/1793236900394_5870436072623479520_g1886750943568300472_294a585e4622eb53a165d0dd3369b352_6569300b.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế cụm camera CSI góc rộng 160° gắn trên giá đỡ nhôm xanh anodized, cáp bẹ CSI uốn cong chữ U và 2 ốc siết khía rãnh tùy chỉnh góc nghiêng.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900394_5870436072623479520_g1886750943568300472_294a585e4622eb53a165d0dd3369b352_6569300b.jpg',
        caption: 'Cận cảnh camera góc rộng trên giá đỡ nhôm xanh và cáp bẹ uốn chữ U',
        tag: 'Góc nghiêng',
      },
      {
        url: '/assets/aistudio/1793236900217_5870436072623479520_g1886750943568300472_bd55d0fde4a325ab83f5d5cd333892ef_f4ab3037.jpg',
        caption: 'Góc chụp trực diện mặt trước camera cùng 2 ốc siết điều chỉnh góc',
        tag: 'Trực diện',
      },
      {
        url: '/assets/aistudio/1793236900075_5870436072623479520_g1886750943568300472_daf07cc06a2640c8773faec56cb78a53_56def5aa.jpg',
        caption: 'Góc chụp từ dưới hất lên: Cụm giá đỡ nhôm xanh và chân bánh mắt trâu',
        tag: 'Cơ khí giá đỡ',
      },
      {
        url: '/assets/aistudio/1793236899973_5870436072623479520_g1886750943568300472_16bf7651167fdbf1d8da1d81a2d459b9_d0011276.jpg',
        caption: 'Hình ảnh nhận diện tiêu chuẩn cụm camera trong bộ kit hoàn chỉnh',
        tag: 'Toàn cảnh',
      },
    ],
    specs: [
      { label: 'Cảm biến hình ảnh', value: 'Sony IMX219 (8 Megapixel)' },
      { label: 'Góc nhìn trường quan sát (FOV)', value: '160 độ (ống kính mắt cá fisheye)' },
      { label: 'Giao tiếp tín hiệu', value: 'MIPI CSI-2 2-lane 15-pin FFC' },
      { label: 'Độ phân giải & Tốc độ', value: '1080p @ 30fps / 720p @ 60fps' },
      { label: 'Điều chỉnh cơ khí', value: 'Khớp xoay gập ngẩng/cúi 120 độ bằng 2 ốc khía rãnh' },
    ],
  },
  {
    id: 'dc-motors',
    nameVi: 'Động cơ DC giảm tốc',
    shortDesc: 'Tạo chuyển động cho bánh xe.',
    fullDesc: 'Hai động cơ điện một chiều vỏ kim loại (GA25) tích hợp hộp số giảm tốc bằng thép và đĩa encoder đo tốc độ quay, truyền động qua khớp nối lục giác đồng ra 2 bánh sau vững chắc.',
    roleVi: 'Hệ truyền động lực cơ học',
    technicalTerm: 'GA25 All-Metal Gear DC Motors + Encoders',
    locationVi: 'Gắn đối xứng dưới gầm đế xe, hướng trục ngang sang 2 bên',
    connectionVi: 'Dây đôi động cơ và cáp bẹ encoder kết nối trực tiếp vào bo mạch mở rộng',
    iconName: 'Gauge',
    color: '#f59e0b',
    anchorOffset: [0, -0.32, -0.05],
    explodedOffset: [0, -0.95, -0.05],
    primaryPhotoUrl: '/assets/aistudio/1793236900786_5870436072623479520_g1886750943568300472_1264e0e68822d3fffc961f2b9e6e3825_9d8e5505.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế động cơ DC giảm tốc kim loại GA25: Hộp số bánh răng thép, đĩa encoder từ tính và khớp nối lục giác bằng đồng siết ốc chí vào trục bánh xe.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900786_5870436072623479520_g1886750943568300472_1264e0e68822d3fffc961f2b9e6e3825_9d8e5505.jpg',
        caption: 'Cận cảnh động cơ kim loại GA25 và khớp nối đồng lục giác',
        tag: 'Cận cảnh',
      },
      {
        url: '/assets/aistudio/1793236900331_5870436072623479520_g1886750943568300472_b4ebfed7d508b80c6527feec6264ae05_7ce35d1e.jpg',
        caption: 'Cặp động cơ kim loại lắp đối xứng dưới gầm xe kèm giắc cắm encoder',
        tag: 'Gầm đáy',
      },
      {
        url: '/assets/aistudio/1793236900629_5870436072623479520_g1886750943568300472_4d87668be23f12ba77d7dd9287a9e920_76f4e137.jpg',
        caption: 'Góc chụp vuông góc đáy sàn: 2 động cơ GA25 truyền động vi sai',
        tag: 'Toàn cảnh gầm',
      },
      {
        url: '/assets/aistudio/1793236900919_5870436072623479520_g1886750943568300472_9cf1488022433e9767c7239e392b381a_a51c9178.jpg',
        caption: 'Vị trí động cơ gắn qua giá kẹp nhôm xanh vào tấm sàn khung xe',
        tag: 'Lắp ráp',
      },
    ],
    specs: [
      { label: 'Loại động cơ', value: 'Động cơ điện một chiều kim loại GA25-370' },
      { label: 'Điện áp danh định', value: '12V DC (dải hoạt động 6V - 12V)' },
      { label: 'Hộp số giảm tốc', value: 'Bánh răng hợp kim thép tỷ số 1:30' },
      { label: 'Cảm biến tốc độ (Encoder)', value: 'Encoder Hall 2 kênh AB đo xung góc quay' },
      { label: 'Khớp nối trục', value: 'Khớp lục giác đồng 4mm siết ốc chí M3' },
    ],
  },
  {
    id: 'motor-driver',
    nameVi: 'Mạch điều khiển động cơ',
    shortDesc: 'Điều khiển tốc độ và chiều quay của động cơ.',
    fullDesc: 'Bo mạch robot shield Waveshare chuyên dụng tích hợp mạch công suất H-Bridge kép, chip điều khiển I2C, màn hình OLED 0.91 inch hiển thị trạng thái và công tắc nguồn an toàn.',
    roleVi: 'Mạch mở rộng công suất & Hiển thị OLED',
    technicalTerm: 'Waveshare JetBot Expansion Shield + OLED',
    locationVi: 'Tầng trung gian kẹp giữa khối pin và bo mạch Jetson Nano',
    connectionVi: 'Khe cắm chân GPIO 40-pin, giắc nguồn DC 12.6V và cọc vít động cơ',
    iconName: 'Zap',
    color: '#8b5cf6',
    anchorOffset: [0, 0.35, 0],
    explodedOffset: [0, 0.65, 0],
    primaryPhotoUrl: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế bo mạch mở rộng driver Waveshare: Màn hình OLED hiển thị IP/pin, công tắc ON/OFF, phím RESET và cổng cấp nguồn động cơ A1 PWR.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
        caption: 'Mặt trên bo mạch driver Waveshare và màn hình OLED hiển thị thông số',
        tag: 'Mặt trên',
      },
      {
        url: '/assets/aistudio/1793236900840_5870436072623479520_g1886750943568300472_c978137fe5e63f53707d94c651c59767_b22acd79.jpg',
        caption: 'Góc nhìn nghiêng sườn xe: Bo mạch driver kẹp giữa các tầng trụ đồng',
        tag: 'Góc nghiêng',
      },
      {
        url: '/assets/aistudio/1793236899666_5870436072623479520_g1886750943568300472_d81b4cf262b03bcfbb460f7f3c478c22_5d89ca18.jpg',
        caption: 'Màn hình OLED phát sáng khi hệ thống robot được bật nguồn',
        tag: 'OLED hoạt động',
      },
      {
        url: '/assets/aistudio/1793236901012_5870436072623479520_g1886750943568300472_e32b1d91ee2b2cfaa1159fe274f896f5_59fc177e.jpg',
        caption: 'Bố trí linh kiện công tắc nguồn, nút gạt và cổng kết nối A1 PWR',
        tag: 'Chi tiết linh kiện',
      },
    ],
    specs: [
      { label: 'Chip phát xung PWM', value: 'PCA9685 16-channel 12-bit qua giao tiếp I2C' },
      { label: 'IC công suất Cầu H', value: 'Dual TB6612FNG (dòng đỉnh 3.2A / kênh)' },
      { label: 'Màn hình hiển thị', value: '0.91" I2C OLED (128x32 pixel hiển thị IP, Pin, CPU)' },
      { label: 'Mạch bảo vệ', value: 'Chống ngược cực, quá áp và ngắn mạch tự ngắt' },
      { label: 'Giao tiếp với Jetson', value: 'Header chân cắm GPIO 40-pin chuẩn Raspberry Pi' },
    ],
  },
  {
    id: 'wheels-chassis',
    nameVi: 'Bánh xe và khung xe',
    shortDesc: 'Nâng đỡ các bộ phận và giúp robot di chuyển.',
    fullDesc: 'Khung đế hợp kim nhôm anodized xanh lá có khoét 2 khe sườn, kết hợp 2 bánh xe cao su vân gai bám đường (mâm hợp kim xanh 10 chấu) cùng hệ thống 2 bánh xe mắt trâu xoay 360° (trước và sau) giúp robot tự cân bằng hoàn hảo.',
    roleVi: 'Khung gầm & Cơ cấu 4 điểm tựa',
    technicalTerm: 'Aluminum Plate, 10-Spoke Rims & Dual Swivel Casters',
    locationVi: 'Tấm sàn kim loại xanh lá và toàn bộ hệ thống bánh xe',
    connectionVi: 'Khớp nối lục giác đồng M4 bắt vào trục động cơ, ốc vít M3 cố định cột giàn tầng',
    iconName: 'Disc',
    color: '#3b82f6',
    anchorOffset: [0, -0.05, 0],
    explodedOffset: [0, -0.4, 0],
    primaryPhotoUrl: '/assets/aistudio/1793236899845_5870436072623479520_g1886750943568300472_88e6207bc4ef2cb56e8c7a46b816381e_67e497ae.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế bánh xe bám đường vân gai chữ Z chống trượt kết hợp vành mâm hợp kim 10 chấu mạ crom xanh dương nổi bật của bộ kit.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236899845_5870436072623479520_g1886750943568300472_88e6207bc4ef2cb56e8c7a46b816381e_67e497ae.jpg',
        caption: 'Cận cảnh lốp cao su gai chữ Z và mâm xe 10 chấu mạ crom xanh',
        tag: 'Bánh xe & Mâm',
      },
      {
        url: '/assets/aistudio/1793236900629_5870436072623479520_g1886750943568300472_4d87668be23f12ba77d7dd9287a9e920_76f4e137.jpg',
        caption: 'Khung đế nhôm tròn cắt CNC màu xanh lá kèm 2 bánh mắt trâu xoay',
        tag: 'Khung gầm CNC',
      },
      {
        url: '/assets/aistudio/1793236900277_5870436072623479520_g1886750943568300472_960b64f5f17e40a68550e4b1929f5770_0d36f7df.jpg',
        caption: 'Góc chụp vành mâm xanh dương óng ánh và trục bánh xe siết ốc',
        tag: 'Góc nghiêng bánh',
      },
      {
        url: '/assets/aistudio/1793236900147_5870436072623479520_g1886750943568300472_7ab3e6d69e1df41e0942aad58cc1a3c2_598d6d99.jpg',
        caption: 'Cơ cấu 4 điểm tựa: 2 bánh truyền động chính và 2 bánh mắt trâu',
        tag: '4 điểm tựa',
      },
    ],
    specs: [
      { label: 'Chất liệu khung sàn', value: 'Hợp kim nhôm 2.5mm Anodized màu xanh lá chống gỉ' },
      { label: 'Đường kính bánh xe', value: '65mm, bề rộng lốp 26mm' },
      { label: 'Mặt gai lốp xe', value: 'Cao su đúc hoa văn chữ Z tăng độ ma sát bám sàn' },
      { label: 'Bánh xe phụ trợ', value: '2 bánh xe mắt trâu xoay 360 độ (1 trước, 1 sau)' },
      { label: 'Khả năng chịu tải', value: 'Nâng đỡ an toàn khối lượng robot ~2.5 kg' },
    ],
  },
  {
    id: 'power-battery',
    nameVi: 'Nguồn điện hoặc pin',
    shortDesc: 'Cung cấp năng lượng cho robot.',
    fullDesc: 'Bộ 3 cell pin Li-ion 18650 (3S 12.6V) dòng xả cao kèm mạch bảo vệ pin BMS, cấp điện áp ổn định cho cả bo mạch tính toán Jetson Nano lẫn động cơ vận hành mạnh mẽ.',
    roleVi: 'Nguồn năng lượng di động 3S Li-ion',
    technicalTerm: '3S 18650 Li-ion Battery Pack (11.1V - 12.6V)',
    locationVi: 'Đặt ở khoang giữa đế xe và bo mạch mở rộng',
    connectionVi: 'Giắc cắm nguồn DC Jack cấp cho bo mạch và cổng sạc 12.6V ở đuôi xe',
    iconName: 'BatteryCharging',
    color: '#ef4444',
    anchorOffset: [0, 0.14, 0],
    explodedOffset: [0, -0.9, 0],
    primaryPhotoUrl: '/assets/aistudio/1793236900509_5870436072623479520_g1886750943568300472_dadf0937625772e1120f807535e5c85f_d1dcebdb.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế khoang chứa pin 3S Li-ion nằm kẹp giữa khung sàn nhôm và bo mạch robot, giúp hạ thấp trọng tâm xe giúp robot chuyển động cân bằng ổn định.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900509_5870436072623479520_g1886750943568300472_dadf0937625772e1120f807535e5c85f_d1dcebdb.jpg',
        caption: 'Vị trí lắp đặt khối pin ở khoang hạ tầng của xe',
        tag: 'Khoang chứa pin',
      },
      {
        url: '/assets/aistudio/1793236900840_5870436072623479520_g1886750943568300472_c978137fe5e63f53707d94c651c59767_b22acd79.jpg',
        caption: 'Cổng cắm sạc pin DC 12.6V và công tắc ngắt nguồn an toàn',
        tag: 'Cổng sạc & Công tắc',
      },
      {
        url: '/assets/aistudio/1793236900919_5870436072623479520_g1886750943568300472_9cf1488022433e9767c7239e392b381a_a51c9178.jpg',
        caption: 'Tấm sàn kim loại dưới đáy bảo vệ vỏ cell pin tránh va đập',
        tag: 'Mặt đáy bảo vệ',
      },
      {
        url: '/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg',
        caption: 'Nguồn pin cấp năng lượng độc lập giúp robot tự do lăn bánh không dây',
        tag: 'Vận hành độc lập',
      },
    ],
    specs: [
      { label: 'Cấu hình cell pin', value: '3S (3 cell 18650 mắc nối tiếp)' },
      { label: 'Điện áp danh định', value: '11.1V (Điện áp sạc đầy 12.6V)' },
      { label: 'Dung lượng danh định', value: '2600 mAh - 3000 mAh' },
      { label: 'Mạch bảo vệ tích hợp', value: 'BMS quản lý cân bằng cell, chống đoản mạch' },
      { label: 'Thời gian hoạt động', value: 'Khoảng 1.5 - 2 giờ chạy liên tục tác vụ AI' },
    ],
  },
  {
    id: 'cooling-fan',
    nameVi: 'Quạt tản nhiệt hoặc bộ tản nhiệt',
    shortDesc: 'Giúp làm mát bộ xử lý.',
    fullDesc: 'Khối tản nhiệt nhôm đen nguyên khối có các rãnh xẻ khí động học, kết hợp quạt làm mát 40mm điều tốc PWM bắt bằng 4 ốc vít kim loại giúp giữ GPU mát mẻ khi chạy mạng nơ-ron AI.',
    roleVi: 'Hệ thống làm mát cưỡng bức PWM',
    technicalTerm: 'Aluminum Heatsink + 40mm 5V PWM Cooling Fan',
    locationVi: 'Bắt trực tiếp trên lưng mô-đun Jetson Nano',
    connectionVi: 'Cáp nguồn 4-pin cắm vào giắc FAN trên bo mạch chính',
    iconName: 'Fan',
    color: '#14b8a6',
    anchorOffset: [-0.12, 1.12, 0.05],
    explodedOffset: [-0.12, 1.95, 0.05],
    primaryPhotoUrl: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế quạt tản nhiệt 40mm điều tốc PWM bắt bằng 4 ốc vít kim loại chắc chắn vào khối heatsink nhôm xẻ rãnh đen trên lưng bo mạch Jetson Nano.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900721_5870436072623479520_g1886750943568300472_5568d0ccd7f30cc2fbd5d67ab7a463b5_d5c92a30.jpg',
        caption: 'Cận cảnh quạt tản nhiệt 4 ốc bắt chặt vào khối heatsink nhôm xẻ rãnh',
        tag: 'Cận cảnh quạt',
      },
      {
        url: '/assets/aistudio/1793236901012_5870436072623479520_g1886750943568300472_e32b1d91ee2b2cfaa1159fe274f896f5_59fc177e.jpg',
        caption: 'Góc nhìn từ trên đỉnh: 4 ốc vít kim loại và cánh quạt làm mát',
        tag: 'Góc từ đỉnh',
      },
      {
        url: '/assets/aistudio/1793236900509_5870436072623479520_g1886750943568300472_dadf0937625772e1120f807535e5c85f_d1dcebdb.jpg',
        caption: 'Góc nhìn ngang các khe rãnh nhôm tản nhiệt đối lưu luồng khí',
        tag: 'Khe rãnh tản nhiệt',
      },
      {
        url: '/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg',
        caption: 'Quạt nằm ngay dưới tầng đỡ cảm biến LIDAR trên bộ khung robot',
        tag: 'Vị trí trong xe',
      },
    ],
    specs: [
      { label: 'Kích thước quạt gió', value: '40mm x 40mm x 10mm' },
      { label: 'Điện áp & Giắc cắm', value: '5V DC, giắc 4-pin có dây tín hiệu PWM' },
      { label: 'Điều khiển tốc độ', value: 'Tự động tăng tốc độ vòng quay theo nhiệt độ GPU' },
      { label: 'Chất liệu khối tản', value: 'Nhôm đúc nguyên khối Anodized đen mờ xẻ rãnh' },
      { label: 'Hiệu quả làm mát', value: 'Giữ nhiệt độ chip AI ổn định dưới 55°C' },
    ],
  },
  {
    id: 'cables-interfaces',
    nameVi: 'Dây kết nối và cổng giao tiếp',
    shortDesc: 'Kết nối camera, bo mạch, mạch điều khiển và nguồn điện.',
    fullDesc: 'Mạng lưới truyền dẫn gồm cáp dẹp CSI ribbon, 4x cổng USB 3.0 màu xanh, cổng Gigabit Ethernet, giắc nguồn DC, giắc SMA ren đồng và cặp ăng-ten không dây Wi-Fi kép.',
    roleVi: 'Giao tiếp dữ liệu, mạng & Kết nối liên tầng',
    technicalTerm: 'CSI Ribbon, Dual Wi-Fi Antennas & 4x USB 3.0 Ports',
    locationVi: 'Phân bố xuyên suốt trên các tầng bo mạch và đuôi xe',
    connectionVi: 'Cáp dẹp FFC, cáp đồng trục IPEX-SMA, bus GPIO và dây silicon',
    iconName: 'GitFork',
    color: '#eab308',
    anchorOffset: [0.74, 0.8, -0.2],
    explodedOffset: [1.25, 1.45, -0.2],
    primaryPhotoUrl: '/assets/aistudio/1793236900451_5870436072623479520_g1886750943568300472_eff07dde7ef09234bcc2fe8989d1e617_218f0b3f.jpg',
    primaryPhotoCaption: 'Hình chụp thực tế cụm cổng ngoại vi tốc độ cao: 4 cổng USB 3.0 Type-A xanh dương, cổng mạng LAN RJ45, giắc nguồn DC Jack và cặp ốc ren đồng gắn ăng-ten Wi-Fi.',
    galleryPhotos: [
      {
        url: '/assets/aistudio/1793236900451_5870436072623479520_g1886750943568300472_eff07dde7ef09234bcc2fe8989d1e617_218f0b3f.jpg',
        caption: 'Cận cảnh cụm cổng 4x USB 3.0 xanh dương và cổng mạng Ethernet',
        tag: 'Cổng USB & LAN',
      },
      {
        url: '/assets/aistudio/1793236900840_5870436072623479520_g1886750943568300472_c978137fe5e63f53707d94c651c59767_b22acd79.jpg',
        caption: 'Dây cáp đồng trục nối ra 2 ăng-ten Wi-Fi gắn trên sàn đuôi xe',
        tag: 'Ăng-ten Wi-Fi',
      },
      {
        url: '/assets/aistudio/1793236900029_5870436072623479520_g1886750943568300472_66c73f40bc03ab3e23367b78ebffdc29_0debb711.jpg',
        caption: 'Dây cáp bẹ cắm motor phụ RPLIDAR và cấp nguồn cho cảm biến',
        tag: 'Dây tín hiệu LIDAR',
      },
      {
        url: '/assets/aistudio/1793236900394_5870436072623479520_g1886750943568300472_294a585e4622eb53a165d0dd3369b352_6569300b.jpg',
        caption: 'Cáp dẹp FPC 15-pin kết nối dữ liệu hình ảnh trực tiếp vào chip Jetson',
        tag: 'Cáp dẹp CSI',
      },
    ],
    specs: [
      { label: 'Cổng USB ngoại vi', value: '4x USB 3.0 Type-A tốc độ truyền tải 5 Gbps' },
      { label: 'Cổng kết nối mạng LAN', value: '1x RJ45 Gigabit Ethernet 10/100/1000 Mbps' },
      { label: 'Mạng không dây', value: 'Mô-đun Wi-Fi Dual-Band 2.4/5GHz + 2 ăng-ten SMA ngoài' },
      { label: 'Cáp bẹ hình ảnh', value: 'Cáp dẹp FPC ribbon 15 chân chuẩn MIPI CSI' },
      { label: 'Cổng cấp nguồn', value: 'Giắc cắm DC Barrel Jack 5.5 x 2.1mm' },
    ],
  },
];

export const JETBOT_FUNCTIONS: JetBotFunction[] = [
  {
    id: 'image-recognition',
    number: 1,
    nameVi: 'Nhận diện hình ảnh',
    descVi: 'Sử dụng camera và mô hình AI để nhận biết vật thể hoặc đặc điểm hình ảnh.',
    howItWorksVi: 'Camera thu nhận luồng video liên tục. GPU Jetson Nano chạy mạng nơ-ron tích chập (CNN / SSD MobileNet) phát hiện vị trí vật thể và phân loại thành các nhãn như quả bóng, cốc nước, biển báo.',
    schoolContextVi: 'Học sinh có thể huấn luyện robot nhận diện màu sắc, biển báo giao thông trong lớp học STEM.',
    iconName: 'ScanEye',
    color: '#06b6d4',
    badgeVi: 'Trí tuệ nhân tạo (AI)',
    pythonSnippet: `# Nhận diện vật thể bằng mô hình AI
import jetbot
from jetbot import ObjectDetector

detector = ObjectDetector('ssd_mobilenet_v2_coco.engine')
detections = detector(camera.value)

for det in detections:
    print(f"Phát hiện: {det['label']} - Độ tin cậy: {det['confidence']:.2f}")`,
  },
  {
    id: 'collision-avoidance',
    number: 2,
    nameVi: 'Tránh vật cản',
    descVi: 'Phân tích hình ảnh để phát hiện chướng ngại vật và điều chỉnh hướng di chuyển khi phần mềm hỗ trợ.',
    howItWorksVi: 'Mô hình phân loại hình ảnh (ResNet-18) hoặc cảm biến laser RPLIDAR quét 360 độ xác định vùng không gian an toàn. Nếu phát hiện chướng ngại vật cự ly gần, phần mềm phát lệnh rẽ né tránh tức thì.',
    schoolContextVi: 'Ứng dụng trong bài thi xe tự hành vượt mê cung hoặc di chuyển an toàn giữa các chướng ngại vật trong phòng học.',
    iconName: 'ShieldAlert',
    color: '#ef4444',
    badgeVi: 'An toàn tự hành',
    pythonSnippet: `# Phán đoán vật cản an toàn
prob_blocked = collision_model(camera.value)

if prob_blocked > 0.5:
    robot.left(speed=0.3)  # Rẽ hướng khác để tránh
else:
    robot.forward(speed=0.3) # Tiếp tục đi thẳng an toàn`,
  },
  {
    id: 'autonomous-navigation',
    number: 3,
    nameVi: 'Di chuyển tự động',
    descVi: 'Sử dụng dữ liệu từ camera và chương trình điều khiển để di chuyển theo đường đi.',
    howItWorksVi: 'Mô hình hồi quy AI (Road Following) ước tính tọa độ tâm làn đường (X, Y). Bộ điều khiển tỷ lệ (P-controller) tự động bẻ lái bánh xe để giữ robot luôn đi chính giữa vạch kẻ đường.',
    schoolContextVi: 'Dự án phổ biến nhất trong các cuộc thi Robotics học sinh: xe bám vạch kẻ đường (Line Following) bằng AI thay vì cảm biến hồng ngoại truyền thống.',
    iconName: 'Navigation',
    color: '#10b981',
    badgeVi: 'Điều khiển tự động',
    pythonSnippet: `# Bám làn đường thông minh
x, y = road_model(camera.value)
steering = x * 0.8  # Tính góc lái

robot.left_motor.value = speed + steering
robot.right_motor.value = speed - steering`,
  },
  {
    id: 'remote-control',
    number: 4,
    nameVi: 'Điều khiển từ xa',
    descVi: 'Nhận lệnh từ máy tính thông qua giao diện hoặc kết nối được hỗ trợ.',
    howItWorksVi: 'Robot phát máy chủ web JupyterLab hoặc WebSocket qua sóng Wi-Fi. Học sinh dùng tay cầm Gamepad, điện thoại hoặc bàn phím máy tính để điều khiển trực tiếp mọi chuyển động và xem video truyền về.',
    schoolContextVi: 'Giúp học sinh làm quen với giao thức mạng không dây, điều khiển vi sai 2 bánh xe từ xa.',
    iconName: 'Gamepad2',
    color: '#8b5cf6',
    badgeVi: 'Giao tiếp Wi-Fi',
    pythonSnippet: `# Lắng nghe lệnh điều khiển từ xa
from ipywidgets import Controller

controller = Controller(index=0)
robot.left_motor.value = controller.axes[1].value
robot.right_motor.value = controller.axes[3].value`,
  },
  {
    id: 'realtime-processing',
    number: 5,
    nameVi: 'Xử lý hình ảnh thời gian thực',
    descVi: 'Sử dụng khả năng xử lý của Jetson Nano để phân tích hình ảnh từ camera.',
    howItWorksVi: 'Nhờ nhân tăng tốc TensorRT và CUDA trên GPU, hình ảnh độ nét cao được giải mã, tiền xử lý và suy luận AI ở tốc độ lên tới 30 khung hình/giây (FPS) với độ trễ cực thấp.',
    schoolContextVi: 'Minh họa cho học sinh sự khác biệt vượt trội giữa GPU xử lý song song và vi điều khiển đơn giản như Arduino.',
    iconName: 'Activity',
    color: '#f59e0b',
    badgeVi: 'Tăng tốc GPU',
    pythonSnippet: `# Xử lý khung hình thời gian thực 30 FPS
import cv2
import tensorrt as trt

# Chạy mô hình tối ưu hoá TensorRT trực tiếp trên GPU
engine = load_tensorrt_engine('model.engine')
output = engine.infer(camera_frame)`,
  },
  {
    id: 'python-programming',
    number: 6,
    nameVi: 'Lập trình robot',
    descVi: 'Chạy chương trình Python để thực hiện các bài toán AI và thị giác máy tính.',
    howItWorksVi: 'Môi trường lập trình mở với ngôn ngữ Python trên nền Linux Ubuntu. Học sinh dễ dàng nhập các thư viện hàng đầu như OpenCV, PyTorch, JetBot SDK để sáng tạo các thuật toán mới.',
    schoolContextVi: 'Nền tảng giáo dục lý tưởng dạy học sinh từ kiến thức lập trình cơ bản đến thị giác máy tính và trí tuệ nhân tạo hiện đại.',
    iconName: 'CodeXml',
    color: '#3b82f6',
    badgeVi: 'Mã nguồn mở',
    pythonSnippet: `# Khởi tạo robot JetBot bằng Python
from jetbot import Robot
import time

robot = Robot()
robot.forward(0.4)
time.sleep(1.0)
robot.stop()`,
  },
];

export const SCHOOL_PROJECT_META = {
  title: 'INFOGRAPHIC KỸ THUẬT: ROBOT JETBOT NVIDIA JETSON NANO',
  subtitle: 'Tài liệu trực quan kỹ thuật & Trí tuệ nhân tạo dành cho học sinh',
  schoolLevel: 'Dự án STEM / Robotics trường học Việt Nam',
  aiEngine: 'NVIDIA Maxwell 128-core GPU • ARM Cortex-A57 Quad-Core',
  frameworks: 'Python 3 • PyTorch • TensorRT • ROS (Robot Operating System)',
  referenceImage: '/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg',
};
