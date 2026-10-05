// Nội dung trang chủ - rút từ các trang Giới thiệu / Dịch vụ / Tư vấn chất liệu của site gốc.
// Sửa chữ ở đây, không cần đụng vào giao diện.

export const hero = {
  title: 'In tem nhãn chuẩn xác\ncho mọi [[ngành hàng]]',
  lead: 'Chúng tôi đồng hành từ lên ý tưởng, thiết kế tem nhãn bao bì, chọn vật liệu phù hợp đến in ấn và cắt bế thành phẩm.',
  image: '/uploads/2018/08/125598e0122ded73b43c.webp',
  imageCaption: 'Xưởng in tem nhãn cuộn',
};

// Dải chữ chạy ngang dưới hero
export const materials = ['Decal giấy', 'Decal nhựa PP', 'Decal PE', 'Decal PET', 'Giấy cảm nhiệt', 'Keo hot-melt', 'Keo remove', 'Đế glassine', 'Đế kraft', 'Mực Wax/Resin'];
export const industries = ['Thực phẩm', 'Dược phẩm', 'Mỹ phẩm', 'Logistic', 'Đông lạnh', 'Nước đóng chai', 'Ngành thép', 'Hoá phẩm', 'Cao su'];

export const about = {
  tag: 'Về chúng tôi',
  title: 'Tìm [[“chiếc áo”]] đẹp nhất và phù hợp nhất cho sản phẩm của bạn',
  body: 'Thị trường ngày càng cạnh tranh với nhiều quy chuẩn khắt khe. Bao bì đạt chuẩn, đẹp và thu hút là một trong những khó khăn của doanh nghiệp Việt. Chúng tôi không ngừng nâng cao kỹ thuật và công nghệ in để đồng hành cùng doanh nghiệp trên con đường định hình thương hiệu.',
  image: '/uploads/2020/09/757ef3584595bacbe384.webp',
};

// TODO: số liệu đang là của 4B Label - thay bằng số của công ty mới
export const stats = [
  { value: 10, suffix: '+', label: 'Năm kinh nghiệm' },
  { value: 300, suffix: '+', label: 'Khách hàng hài lòng' },
  { value: 1000, suffix: '+', label: 'Sản phẩm hoàn thành' },
  { value: 100, suffix: '%', label: 'Kiểm soát chất lượng' },
];

export const values = {
  tag: 'Dịch vụ',
  title: 'Trọn quy trình tem nhãn [[dưới một mái nhà]]',
  lead: 'Tất cả những gì chúng tôi thực hiện đều nhằm mang đến dịch vụ tốt nhất cho khách hàng.',
  image: '/uploads/2020/09/Picture13-2.webp',
  items: [
    { icon: 'pen', title: 'Thiết kế tem nhãn, bao bì', text: 'Thiết kế phù hợp loại sản phẩm, phân khúc và định hướng thương hiệu - vừa đúng chuẩn, vừa tạo ấn tượng mới lạ.', href: '/thiet-ke-tem-nhan-bao-bi/' },
    { icon: 'layers', title: 'Tư vấn chất liệu', text: 'Hàng trăm tổ hợp lớp bề mặt, lớp keo, lớp đế - chọn đúng loại decal cho môi trường sử dụng thực tế.', href: '/tu-van-chat-lieu-tem-nhan/' },
    { icon: 'print', title: 'Gia công in ấn', text: 'Nhận in số lượng lớn, tem nhãn trắng, tem in màu với nhiều công nghệ in khác nhau.', href: '/gia-cong-in-an-tem-nhan/' },
    { icon: 'roll', title: 'Vật tư in mã vạch', text: 'Giấy decal, giấy cảm nhiệt và mực in Wax, Wax/Resin đủ quy cách cho máy in mã vạch.', href: '/in-tem-nhan-ma-vach/' },
  ],
};

export const process = {
  tag: 'Quy trình',
  title: 'Từ ý tưởng đến [[cuộn tem]] thành phẩm',
  lead: 'Ý tưởng thiết kế và tem nhãn thực tế luôn có khác biệt. Quy trình bốn bước giúp bạn có tem nhãn phù hợp nhất ngay từ lô đầu tiên.',
  steps: [
    { id: 'y-tuong', label: 'Ý tưởng', title: 'Lên ý tưởng & thiết kế', text: 'Vẽ bản thiết kế tem nhãn theo kích thước vật chứa, màu sắc nổi bật trên nền bao bì và nội dung đầy đủ theo quy định pháp luật.', image: '/uploads/2020/09/Picture19.webp' },
    { id: 'vat-lieu', label: 'Vật liệu', title: 'Chọn vật liệu & báo giá', text: 'Giấy hay nhựa PP, PE, PET; keo acrylic hay hot-melt; đế giấy hay glassine - tư vấn theo điều kiện sử dụng, kèm báo giá rõ ràng.', image: '/uploads/2020/09/33e115f2a63f5961002e-scaled.webp' },
    { id: 'in-thu', label: 'In thử', title: 'In thử, kiểm tra màu và kích thước', text: 'Công nghệ in ảnh hưởng không nhỏ đến màu sắc hiển thị. In mẫu thử trước để chắc chắn tem nhãn đúng như mong đợi.', image: '/uploads/2020/09/ee750b7bb8b647e81ea7.webp' },
    { id: 'san-xuat', label: 'Sản xuất', title: 'In ấn & sản xuất hàng loạt', text: 'In, cắt bế thành phẩm chuẩn xác - đúng hẹn, sạch sẽ, không trầy vết, chạy đủ nhãn và đủ kích thước.', image: '/uploads/2020/09/Picture20.webp' },
  ],
};

export const commitments = {
  tag: 'Cam kết',
  title: 'Điều chúng tôi [[đảm bảo]] trên mỗi cuộn tem',
  lead: 'Trân quý từng con nhãn, chiếc tem, cái hộp, cái túi - vì tem nhãn quyết định cách thương hiệu của bạn xuất hiện trên kệ hàng.',
  items: [
    { title: 'Đúng hẹn giao hàng', text: 'Luôn đúng thời gian giao hàng đã thống nhất.' },
    { title: 'Đạt chuẩn chất lượng', text: 'Vật liệu có chứng chỉ phù hợp, kể cả loại dán trực tiếp lên thực phẩm.' },
    { title: 'Sạch sẽ, không trầy vết', text: 'Bề mặt tem sạch, không trầy xước khi đến tay bạn.' },
    { title: 'Đủ nhãn, đủ kích thước', text: 'Chạy đúng số lượng, cắt bế chuẩn xác theo bản thiết kế.' },
  ],
};

export const faqs = [
  { q: 'Tem nhãn decal gồm những lớp nào?', a: 'Nhìn bằng mắt thường, decal có 3 lớp: lớp bề mặt (giấy hoặc nhựa), lớp keo và lớp đế. Mỗi tổ hợp ba lớp này cho ra một loại decal khác nhau, phù hợp từng nhu cầu sử dụng.' },
  { q: 'Nên chọn decal giấy hay decal nhựa?', a: 'Decal giấy (mặt bóng hoặc mờ) giá rẻ, thông dụng nhưng độ bền không cao - hợp môi trường không khắc nghiệt. Decal nhựa PP, PE, PET, PO kháng nước, dai và bền, dùng tốt trong kho lạnh hay nhiệt độ cao, giá thành cao hơn.' },
  { q: 'Tem nhãn dán trực tiếp lên thực phẩm có an toàn không?', a: 'Có loại tem nhãn đạt chứng chỉ FDA, dán trực tiếp lên thực phẩm mà vẫn đảm bảo vệ sinh an toàn thực phẩm. Mực in nên dùng mực ECO và cán màng sau khi in để an toàn hơn.' },
  { q: 'Dán nhãn bằng máy tự động thì nên dùng loại đế nào?', a: 'Tem nhãn dạng cuộn cho máy dán nhãn tự động nên dùng đế glassine. Nếu dán nhãn bằng tay, đế giấy là lựa chọn kinh tế hơn.' },
  { q: 'Có nên in thử trước khi in hàng loạt?', a: 'Nên. Chất liệu và công nghệ in đều ảnh hưởng đến màu sắc thực tế, nhiều trường hợp bản in khác bản thiết kế. In mẫu thử giúp kiểm tra màu và kích thước trước khi sản xuất số lượng lớn.' },
];

export const cta = {
  title: 'Tem nhãn chuẩn xác.\n[[Thương hiệu nổi bật.]]',
  lead: 'Gửi yêu cầu để được tư vấn chất liệu và báo giá cho sản phẩm của bạn.',
  image: '/uploads/2020/10/Picture7-1-e1603291876807.webp',
};
