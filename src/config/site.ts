// ============================================================
// BRAND - mọi thông tin nhận diện của công ty mới nằm ở đây.
// Màu sắc / font nằm ở src/styles/tokens.css.
// Các giá trị "TODO" là placeholder, cần thay trước khi lên tên miền.
// ============================================================

export const site = {
  name: 'Temnhanmavach',
  legalName: 'Công ty Hoàng Lộc', // TODO: tên pháp nhân đầy đủ (TNHH / Cổ phần …)
  tagline: 'In tem nhãn, decal mã vạch và bao bì theo yêu cầu',
  description:
    'Hỗ trợ từ lên ý tưởng, thiết kế tem nhãn bao bì, chọn vật liệu phù hợp đến in ấn, cắt bế thành phẩm đẹp và chuẩn xác.',
  logo: '/brand/logo.svg',
  ogImage: '/brand/og.png',
  locale: 'vi_VN',
  contact: {
    phone: 'TODO 0900 000 000',
    phoneHref: 'tel:+84900000000',
    email: 'todo@example.com',
    address: 'TODO địa chỉ',
    mapEmbed: '', // URL nhúng Google Maps (tuỳ chọn)
  },
  // Form liên hệ: site tĩnh không có backend. Gắn Formspree / Web3Forms / Cloudflare… vào đây.
  formAction: '',
  social: {
    facebook: '',
    zalo: '',
  },
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

// Giữ đúng cấu trúc menu của site gốc
export const nav: NavItem[] = [
  { label: 'Giới thiệu', href: '/gioi-thieu/' },
  {
    label: 'Sản phẩm',
    href: '/san-pham/',
    children: [
      { label: 'In tem nhãn mã vạch', href: '/in-tem-nhan-ma-vach/' },
      { label: 'In tem nhãn thực phẩm', href: '/in-tem-nhan-thuc-pham/' },
      { label: 'In tem nhãn đông lạnh', href: '/in-tem-nhan-dong-lanh/' },
      { label: 'In tem nhãn nước đóng chai', href: '/in-tem-nhan-chai-nuoc/' },
      { label: 'In tem nhãn mỹ phẩm', href: '/in-tem-nhan-my-pham/' },
      { label: 'In tem nhãn dược phẩm', href: '/in-tem-nhan-duoc-pham/' },
      { label: 'In tem nhãn lưu hóa cao su', href: '/in-tem-nhan-luu-hoa-cao-su/' },
      { label: 'In tem nhãn Logistic', href: '/in-tem-nhan-logistic/' },
      { label: 'In tem nhãn ngành thép', href: '/in-tem-nhan-nganh-thep/' },
      { label: 'In tem nhãn quảng cáo', href: '/in-tem-nhan-khu-keo-quang-cao/' },
      { label: 'In tem nhãn hoá phẩm', href: '/in-tem-nhan-hoa-pham/' },
      { label: 'In tem nhãn đặc biệt', href: '/tem-nhan-dac-biet/' },
      { label: 'Mực in mã vạch', href: '/muc-in-ma-vach/' },
    ],
  },
  {
    label: 'Dịch vụ',
    href: '/dich-vu/',
    children: [
      { label: 'Thiết kế tem nhãn, bao bì', href: '/thiet-ke-tem-nhan-bao-bi/' },
      { label: 'Tư vấn chất liệu tem nhãn', href: '/tu-van-chat-lieu-tem-nhan/' },
      { label: 'Gia công in ấn tem nhãn', href: '/gia-cong-in-an-tem-nhan/' },
    ],
  },
  { label: 'Tin tức & Sự kiện', href: '/tin-tuc-su-kien/' },
  { label: 'Liên hệ', href: '/lien-he/' },
];
