// Cột phải (dính khi cuộn): nội dung liên quan + ô báo giá.
import Link from 'next/link';
import { site } from '@/config/site';
import type { Related } from '@/lib/nav';
import BrandMark from './BrandMark';
import Button from './Button';

export default function RelatedPanel({ data }: { data: Related }) {
  return (
    <aside className="side" aria-label={data.title}>
      <div className="side__box">
        <h2 className="side__title">{data.title}</h2>
        <ul className="side__list">
          {data.items.map((p) => (
            <li key={p.id}>
              <Link href={p.path} className="side__item">
                <span className="side__thumb">{p.cover ? <img src={p.cover} alt="" loading="lazy" /> : <BrandMark size={22} />}</span>
                <span className="side__name">{p.title}</span>
                <svg className="side__go" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={data.more.href} className="side__more">{data.more.label} ↗</Link>
      </div>

      <div className="side__cta dark">
        <strong>Cần báo giá?</strong>
        <p>Gọi <a href={site.contact.phoneHref}>{site.contact.phone}</a> hoặc gửi yêu cầu, chúng tôi phản hồi trong ngày.</p>
        <Button href="/lien-he/">Liên hệ báo giá</Button>
      </div>
    </aside>
  );
}
