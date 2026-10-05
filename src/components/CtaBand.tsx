import { site } from '@/config/site';
import { Words } from '@/lib/emph';
import Button from './Button';

export default function CtaBand({
  title = 'Cần tư vấn tem nhãn cho [[sản phẩm]] của bạn?',
  text = `Gọi ${site.contact.phone} hoặc gửi yêu cầu, chúng tôi phản hồi trong ngày.`,
}: { title?: string; text?: string }) {
  return (
    <section className="cta-band dark">
      <div className="container cta-band__inner">
        <div>
          <h2 data-reveal="words"><Words text={title} /></h2>
          <p data-reveal data-delay="200">{text}</p>
        </div>
        <div data-reveal data-delay="300"><Button href="/lien-he/">Liên hệ ngay</Button></div>
      </div>
    </section>
  );
}
