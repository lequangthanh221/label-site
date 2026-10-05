// Metadata dùng chung cho mọi trang.
import type { Metadata } from 'next';
import { site } from '@/config/site';

export const SITE_URL = process.env.SITE_URL || 'https://label-site.iamlequangthanh2201.workers.dev';
// Bản chạy thử không cho Google index (nội dung còn trùng site gốc). Bật ALLOW_INDEX=true khi lên tên miền thật.
export const ALLOW_INDEX = process.env.ALLOW_INDEX === 'true';

export function pageMeta({ title, description, path, image, type = 'website' }: {
  title?: string; description?: string; path: string; image?: string; type?: 'website' | 'article';
}): Metadata {
  const fullTitle = title ? `${title} - ${site.name}` : site.name;
  const desc = description || site.description;
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [image || site.ogImage],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export const breadcrumbLd = (crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.path, SITE_URL).toString() })),
});

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
