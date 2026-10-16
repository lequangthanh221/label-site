// Trang Giới thiệu dựng riêng. Nội dung ở src/config/about.ts.
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Stats from '@/components/Stats';
import { aboutPage as a } from '@/config/about';
import { Words } from '@/lib/emph';
import { breadcrumbLd, JsonLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Giới thiệu', description: a.lead, path: '/gioi-thieu/', image: a.mosaic[0].src });

const icons: Record<string, React.ReactNode> = {
  idea: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12.5 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  print: <><path d="M7 8V3h10v5" /><rect x="3" y="8" width="18" height="9" rx="1.5" /><path d="M7 13h10v8H7z" /></>,
  cut: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.2 7.8 20 19M8.2 16.2 20 5" /></>,
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Trang chủ', path: '/' }, { name: 'Giới thiệu', path: '/gioi-thieu/' }])} />

      {/* ===== đầu trang ===== */}
      <section className="ab-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb" data-reveal>
            <ol><li><Link href="/">Trang chủ</Link></li><li aria-current="page">Giới thiệu</li></ol>
          </nav>
          <div className="ab-hero__grid">
            <h1 className="h-display ab-hero__title" data-reveal="words"><Words text={a.title} /></h1>
            <p className="lead ab-hero__lead" data-reveal data-delay="400">{a.lead}</p>
          </div>
        </div>
      </section>

      {/* ===== ghép ảnh tràn lên đầu trang ===== */}
      <div className="mosaic-wrap">
        <div className="container mosaic">
          {a.mosaic.map((m, i) => (
            <figure key={m.src} className={`mosaic__item mosaic__item--${i}`} data-reveal data-delay={String(i * 140)}>
              <div data-parallax={['0', '-0.08', '0.06'][i]}><img src={m.src} alt={m.alt} loading={i === 0 ? 'eager' : 'lazy'} /></div>
            </figure>
          ))}
        </div>
      </div>

      {/* ===== câu chuyện ===== */}
      <section className="section story">
        <div className="container story__grid">
          <div className="story__head">
            <span className="tag" data-reveal>{a.story.tag}</span>
            <h2 className="h-section" data-reveal="words"><Words text={a.story.title} /></h2>
          </div>
          <div className="story__body">
            {a.story.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'story__first' : undefined} data-reveal data-delay={String(i * 120)}>{p}</p>
            ))}
            <div className="story__imgs">
              {a.story.images.map((m, i) => (
                <figure key={m.src} className="js-pimg" data-reveal data-delay={String(i * 140)}><img src={m.src} alt={m.alt} loading="lazy" /></figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ra đời + trích dẫn ===== */}
      <section className="section origin">
        <div className="container origin__grid">
          <figure className="origin__img js-pimg" data-reveal><img src={a.origin.image.src} alt={a.origin.image.alt} loading="lazy" /></figure>
          <div className="origin__text">
            <h2 className="h-section" data-reveal="words"><Words text={a.origin.title} /></h2>
            {a.origin.paragraphs.map((p, i) => <p key={i} className="lead muted" data-reveal data-delay="150">{p}</p>)}
            <blockquote className="origin__quote" data-reveal data-delay="250">
              <svg viewBox="0 0 32 24" aria-hidden="true">
                <path d="M0 24V13.7C0 5.9 4.2 1.3 12.5 0l1.3 3.6C9.1 4.9 6.9 7.6 6.6 11.5H12V24H0Zm18 0V13.7C18 5.9 22.2 1.3 30.5 0l1.3 3.6c-4.7 1.3-6.9 4-7.2 7.9H30V24H18Z" fill="currentColor" />
              </svg>
              <p><Words text={a.origin.quote} /></p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ===== 4 bước ===== */}
      <section className="section svc">
        <div className="container">
          <div className="svc__head">
            <span className="tag" data-reveal>{a.services.tag}</span>
            <h2 className="h-section" data-reveal="words"><Words text={a.services.title} /></h2>
          </div>
          <ol className="svc__list">
            {a.services.items.map((s, i) => (
              <li key={s.title} data-reveal data-delay={String(i * 120)}>
                <Link href={s.href} className="svc__item">
                  <span className="svc__top">
                    <span className="svc__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[s.icon]}</svg>
                    </span>
                    <span className="svc__step">Bước {i + 1}</span>
                  </span>
                  <span className="svc__title">{s.title}</span>
                  <span className="svc__go">Tìm hiểu thêm <span aria-hidden="true">↗</span></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Stats title="[[Con số]] sau mỗi cuộn tem" />

      {/* ===== giá trị ===== */}
      <section className="section ab-values">
        <div className="container ab-values__grid">
          <div className="ab-values__head">
            <span className="tag" data-reveal>{a.values.tag}</span>
            <h2 className="h-section" data-reveal="words"><Words text={a.values.title} /></h2>
            <figure className="ab-values__img js-pimg" data-reveal><img src={a.values.image.src} alt={a.values.image.alt} loading="lazy" /></figure>
          </div>
          <ul className="ab-values__list">
            {a.values.items.map((v, i) => (
              <li key={v.title} data-reveal data-delay={String(i * 120)}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={a.cta.title} text={a.cta.text} />
    </>
  );
}
