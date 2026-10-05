import { site } from '@/config/site';

export default function ContactBlock() {
  const { contact, formAction } = site;
  return (
    <div className="contact">
      <div>
        <h2>Mọi yêu cầu hợp tác vui lòng liên hệ với chúng tôi</h2>
        <dl>
          <dt>Điện thoại</dt><dd><a href={contact.phoneHref}>{contact.phone}</a></dd>
          <dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
          <dt>Địa chỉ</dt><dd>{contact.address}</dd>
        </dl>
        {contact.mapEmbed && <iframe src={contact.mapEmbed} title="Bản đồ" loading="lazy" className="map" />}
      </div>
      {/* Site tĩnh không có backend: gắn Formspree / Web3Forms vào site.formAction */}
      <form method="post" action={formAction || `mailto:${contact.email}`} encType={formAction ? undefined : 'text/plain'}>
        <label>Tên của bạn <input name="name" required autoComplete="name" /></label>
        <label>Email <input name="email" type="email" required autoComplete="email" /></label>
        <label>Số điện thoại <input name="phone" type="tel" autoComplete="tel" /></label>
        <label>Nội dung <textarea name="message" rows={6} required /></label>
        <button className="btn" type="submit"><span>Gửi yêu cầu</span></button>
      </form>
    </div>
  );
}
