import Link from 'next/link';
import Button from '@/components/Button';
import CarouselArrows from '@/components/CarouselArrows';
import FaqAccordion from '@/components/FaqAccordion';
import HeroWaves from '@/components/HeroWaves';
import ProcessAccordion from '@/components/ProcessAccordion';
import Stats from '@/components/Stats';
import { about, commitments, cta, faqs, hero, industries, materials, process, values } from '@/config/home';
import { site } from '@/config/site';
import { byOrder, fmtDate, getPages, getPosts } from '@/lib/content';
import { Words } from '@/lib/emph';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ path: '/' });

const icons: Record<string, React.ReactNode> = {
  pen: <><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  print: <><path d="M7 9V3h10v6" /><rect x="3" y="9" width="18" height="8" rx="1" /><path d="M7 14h10v7H7z" /></>,
  roll: <><circle cx="9" cy="12" r="6" /><circle cx="9" cy="12" r="2" /><path d="M9 6h10v12H9" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
};
const Icon = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
);

function Marquee({ items, label, className }: { items: string[]; label: string; className?: string }) {
  return (
    <div className={className} aria-label={label}>
      <div className="marquee">
        <div className="marquee__track">
          {[0, 1].map((n) => (
            <ul key={n} aria-hidden={n === 1 ? true : undefined}>
              {items.map((m) => <li key={m}>{m}</li>)}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const pages = getPages();
  const posts = getPosts();
  const solutions = pages.filter((p) => p.kind === 'solution' && !p.parent && p.cover).sort(byOrder);
  const count = (parent: string) => pages.filter((p) => p.parent === parent).length;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <HeroWaves />
        <div className="container hero__inner">
          <h1 className="h-display hero__title" data-reveal="words"><Words text={hero.title} /></h1>
          <div className="hero__bottom">
            <div className="hero__left">
              <p className="lead" data-reveal data-delay="500">{hero.lead}</p>
              <div className="hero__rule" data-reveal data-delay="650" />
              <div data-reveal data-delay="750"><Button href="/lien-he/">Nhận tư vấn & báo giá</Button></div>
            </div>
            <figure className="hero__media" data-reveal data-delay="900">
              <img src={hero.image} alt={hero.imageCaption} width={1200} height={1600} />
              <figcaption><span className="hero__dot" />{hero.imageCaption}</figcaption>
            </figure>
          </div>
        </div>
        <Marquee items={materials} label="Vật liệu" className="ticker" />
      </section>

      {/* ============ DẢI NGÀNH HÀNG ============ */}
      <section className="bigmarq" aria-label="Ngành hàng">
        <Marquee items={industries} label="Ngành hàng" />
      </section>

      {/* ============ VỀ CHÚNG TÔI ============ */}
      <section className="section about">
        <div className="container">
          <div className="about__top">
            <div>
              <span className="tag" data-reveal>{about.tag}</span>
              <h2 className="h-section" data-reveal="words"><Words text={about.title} /></h2>
            </div>
            <div className="about__right">
              <p className="lead muted" data-reveal data-delay="200">{about.body}</p>
              <div data-reveal data-delay="300"><Button href="/gioi-thieu/" variant="dark">Câu chuyện của chúng tôi</Button></div>
            </div>
          </div>
          <div className="about__img" data-reveal><img src={about.image} alt="Các cuộn tem nhãn thành phẩm" loading="lazy" /></div>
        </div>
      </section>

      <Stats />

      {/* ============ TEM NHÃN THEO NGÀNH (carousel) ============ */}
      <section className="section solutions">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="tag" data-reveal>Sản phẩm</span>
              <h2 className="h-section" data-reveal="words"><Words text={'Tem nhãn cho từng\n[[ngành hàng]]'} /></h2>
            </div>
            <CarouselArrows trackId="solutions-track" />
          </div>
        </div>
        <div className="track" id="solutions-track">
          {solutions.map((p, i) => (
            <Link key={p.id} className="scard" href={p.path} data-reveal data-delay={String(Math.min(i, 4) * 90)}>
              <img src={p.cover} alt="" loading="lazy" />
              <div className="scard__body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="container sec-foot">
          <p className="muted">Tem nhãn đạt chuẩn cho {solutions.length} nhóm ngành hàng và ứng dụng đặc biệt.</p>
          <Link href="/san-pham/" className="link-arrow">Xem tất cả sản phẩm ↗</Link>
        </div>
      </section>

      {/* ============ DỊCH VỤ (nền tối) ============ */}
      <section className="section dark values">
        <div className="container">
          <div className="center-head">
            <span className="tag" data-reveal>{values.tag}</span>
            <h2 className="h-section" data-reveal="words"><Words text={values.title} /></h2>
            <p className="lead muted" data-reveal data-delay="200">{values.lead}</p>
          </div>
          <div className="values__grid">
            {values.items.map((v, i) => (
              <Link key={v.title} className={`vcard vcard--${i}`} href={v.href} data-reveal data-delay={String(i * 100)}>
                <span className="vcard__icon"><Icon name={v.icon} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Link>
            ))}
            <div className="values__img" data-reveal><img src={values.image} alt="Máy in tem nhãn cuộn" loading="lazy" /></div>
          </div>
        </div>
      </section>

      {/* ============ QUY TRÌNH (accordion) ============ */}
      <section className="section process">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="tag" data-reveal>{process.tag}</span>
              <h2 className="h-section" data-reveal="words"><Words text={process.title} /></h2>
            </div>
            <p className="lead muted process__lead" data-reveal data-delay="200">{process.lead}</p>
          </div>
          <ProcessAccordion steps={process.steps} />
        </div>
      </section>

      {/* ============ CAM KẾT (thẻ trôi) ============ */}
      <section className="section commit">
        <div className="commit__float" aria-hidden="true">
          {commitments.items.map((c, i) => (
            <div key={c.title} className={`fcard fcard--${i}`}>
              <div data-parallax={['0.18', '-0.12', '0.1', '-0.2'][i]}>
                <span className="fcard__icon"><Icon name="check" /></span>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="container center-head commit__head">
          <span className="tag" data-reveal>{commitments.tag}</span>
          <h2 className="h-section" data-reveal="words"><Words text={commitments.title} /></h2>
          <p className="lead muted" data-reveal data-delay="200">{commitments.lead}</p>
          <div data-reveal data-delay="300"><Button href="/lien-he/">Bắt đầu dự án tem nhãn</Button></div>
        </div>
        {/* mobile: thẻ xếp lưới, không trôi */}
        <ul className="container commit__list">
          {commitments.items.map((c) => (
            <li key={c.title} data-reveal><span className="fcard__icon"><Icon name="check" /></span><strong>{c.title}</strong><span>{c.text}</span></li>
          ))}
        </ul>
      </section>

      {/* ============ VẬT TƯ (nền tối) ============ */}
      <section className="section dark supplies">
        <div className="container">
          <div className="center-head">
            <span className="tag" data-reveal>Vật tư in mã vạch</span>
            <h2 className="h-section" data-reveal="words"><Words text="Đủ quy cách cho [[máy in mã vạch]]" /></h2>
          </div>
          <div className="supplies__grid">
            <Link className="sup" href="/in-tem-nhan-ma-vach/" data-reveal>
              <span className="sup__count"><span data-count={count('in-tem-nhan-ma-vach')}>{count('in-tem-nhan-ma-vach')}</span> quy cách</span>
              <h3>Giấy decal in tem mã vạch</h3>
              <p>Từ 35×22mm đến A6 100×150mm - decal trắng, decal màu đỏ, vàng, xanh ngọc, giấy in màu.</p>
              <span className="sup__go">Xem quy cách ↗</span>
            </Link>
            <Link className="sup" href="/muc-in-ma-vach/" data-reveal data-delay="120">
              <span className="sup__count"><span data-count={count('muc-in-ma-vach')}>{count('muc-in-ma-vach')}</span> quy cách</span>
              <h3>Mực in mã vạch (ribbon)</h3>
              <p>Wax Premium và Wax/Resin, khổ 80mm, 90mm, 110mm × 300m cho máy in mã vạch phổ biến.</p>
              <span className="sup__go">Xem quy cách ↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TIN TỨC ============ */}
      <section className="section blog">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="tag" data-reveal>Kiến thức</span>
              <h2 className="h-section" data-reveal="words"><Words text={'Tin tức & kinh nghiệm\n[[tem nhãn]]'} /></h2>
            </div>
            <div data-reveal><Button href="/tin-tuc-su-kien/">Xem tất cả bài viết</Button></div>
          </div>
          <div className="blog__grid">
            {posts.map((p, i) => (
              <Link key={p.id} className="post" href={p.path} data-reveal data-delay={String(i * 120)}>
                <div className="post__img">{p.cover && <img src={p.cover} alt="" loading="lazy" />}</div>
                <span className="post__meta">{fmtDate(p.date)}</span>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HỎI ĐÁP ============ */}
      <section className="section faq">
        <div className="container faq__grid">
          <div className="faq__left">
            <span className="tag" data-reveal>Hỏi đáp</span>
            <h2 className="h-section" data-reveal="words"><Words text="Câu hỏi [[thường gặp]]" /></h2>
            <div className="faq__help" data-reveal data-delay="200">
              <strong>Cần tư vấn chất liệu?</strong>
              <p className="muted">Gọi <a href={site.contact.phoneHref}>{site.contact.phone}</a> hoặc gửi yêu cầu, chúng tôi phản hồi sớm nhất.</p>
              <Button href="/lien-he/" variant="dark">Liên hệ</Button>
            </div>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-wrap">
        <div className="container">
          <div className="cta">
            <img src={cta.image} alt="" loading="lazy" className="cta__bg" />
            <div className="cta__inner">
              <h2 className="h-section" data-reveal="words"><Words text={cta.title} /></h2>
              <p className="lead" data-reveal data-delay="200">{cta.lead}</p>
              <div data-reveal data-delay="300"><Button href="/lien-he/">Nhận báo giá</Button></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
