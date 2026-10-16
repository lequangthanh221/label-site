// Một route cho toàn bộ trang + bài viết lấy từ site gốc, giữ nguyên URL.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Card, { type CardData } from '@/components/Card';
import ContactBlock from '@/components/ContactBlock';
import CtaBand from '@/components/CtaBand';
import RelatedPanel from '@/components/RelatedPanel';
import { site } from '@/config/site';
import { byOrder, fmtDate, getPages, getPosts, toSlug, type Page, type Post } from '@/lib/content';
import { Words } from '@/lib/emph';
import { breadcrumb, related } from '@/lib/nav';
import { breadcrumbLd, JsonLd, pageMeta, SITE_URL } from '@/lib/seo';

// Trang có route riêng (src/app/<tên>/page.tsx) không đi qua đây
const OWN_ROUTE = new Set(['gioi-thieu']);

type Entry = { type: 'page'; data: Page } | { type: 'post'; data: Post };

function allEntries(): Entry[] {
  return [
    ...getPages().filter((p) => !OWN_ROUTE.has(p.id)).map((data) => ({ type: 'page' as const, data })),
    ...getPosts().map((data) => ({ type: 'post' as const, data })),
  ];
}

function find(slug: string[]) {
  const path = `/${slug.map(decodeURIComponent).join('/')}/`;
  return allEntries().find((e) => e.data.path === path);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return allEntries().map((e) => ({ slug: toSlug(e.data.path) }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const entry = find((await params).slug);
  if (!entry) return {};
  const d = entry.data;
  return pageMeta({ title: d.title, description: d.description, path: d.path, image: d.cover || undefined, type: entry.type === 'post' ? 'article' : 'website' });
}

export default async function EntryPage({ params }: Props) {
  const entry = find((await params).slug);
  if (!entry) notFound();

  const pages = getPages();
  const posts = getPosts();
  const page = entry.type === 'page' ? entry.data : null;
  const post = entry.type === 'post' ? entry.data : null;
  const toCard = (p: Page | Post): CardData => ({ href: p.path, title: p.title, image: p.cover || undefined, text: p.description });

  // danh sách hiển thị dưới nội dung
  let listing: CardData[] = [];
  let listingTitle = '';
  if (page?.id === 'san-pham') {
    listing = pages.filter((p) => p.kind === 'solution' && !p.parent).sort(byOrder).map(toCard);
  } else if (page?.id === 'dich-vu') {
    listing = pages.filter((p) => p.kind === 'service' && p.id !== 'dich-vu').sort(byOrder).map(toCard);
    listingTitle = 'Các dịch vụ';
  } else if (page?.id === 'tin-tuc-su-kien') {
    listing = posts.map(toCard);
  } else if (page) {
    listing = pages.filter((p) => p.parent === page.id).sort(byOrder).map(toCard);
    if (page.kind === 'solution') listingTitle = 'Quy cách sẵn có';
  }

  const isContact = page?.id === 'lien-he';
  const showBody = !isContact && entry.data.html.trim() !== '';
  // đoạn giới thiệu dưới tiêu đề chỉ dùng cho trang không có nội dung riêng (tránh lặp câu mở đầu)
  const intro = page && page.kind !== 'info' && !showBody ? page.description : '';

  const crumbs = breadcrumb(entry.data, !!post, pages);
  // cột phải chỉ cho trang có nội dung riêng (sản phẩm, dịch vụ, bài viết)
  const side = showBody ? related(entry.data, !!post, pages, posts) : null;

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {post && (
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          datePublished: post.date,
          dateModified: post.updated,
          image: post.cover ? new URL(post.cover, SITE_URL).toString() : undefined,
          publisher: { '@type': 'Organization', name: site.name },
        }} />
      )}

      <div className="page-head">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb" data-reveal>
            <ol>
              {crumbs.map((c, i) =>
                i < crumbs.length - 1 ? (
                  <li key={c.path}><Link href={c.path}>{c.name}</Link></li>
                ) : (
                  <li key={c.path} aria-current="page">{c.name}</li>
                ),
              )}
            </ol>
          </nav>
          <h1 className="page-title" data-reveal="words"><Words text={entry.data.title} /></h1>
          {post && <p className="page-meta" data-reveal data-delay="300">{fmtDate(post.date)}</p>}
          {intro && <p className="page-meta lead" data-reveal data-delay="300">{intro}</p>}
        </div>
      </div>

      <div className="page-body">
        <div className="container">
          {isContact && <ContactBlock />}
          <div className={side ? 'detail' : undefined}>
            <div className="detail__main">
              {showBody && <article className="prose" dangerouslySetInnerHTML={{ __html: entry.data.html }} />}
              {listing.length > 0 && (
                <section className={showBody ? 'listing' : 'listing listing--solo'}>
                  {listingTitle && <h2>{listingTitle}</h2>}
                  <div className="grid">{listing.map((c) => <Card key={c.href} {...c} />)}</div>
                </section>
              )}
            </div>
            {side && <RelatedPanel data={side} />}
          </div>
        </div>
      </div>

      {!isContact && <CtaBand />}
    </>
  );
}
