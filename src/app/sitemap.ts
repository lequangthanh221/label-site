import type { MetadataRoute } from 'next';
import { getPages, getPosts } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, SITE_URL).toString();
  return [
    { url: url('/'), priority: 1 },
    ...getPages().map((p) => ({ url: url(p.path), lastModified: p.updated })),
    ...getPosts().map((p) => ({ url: url(p.path), lastModified: p.updated })),
  ];
}
