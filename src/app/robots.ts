import type { MetadataRoute } from 'next';
import { ALLOW_INDEX, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

// Chặn bot khi chưa bật ALLOW_INDEX=true
export default function robots(): MetadataRoute.Robots {
  return ALLOW_INDEX
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: new URL('/sitemap.xml', SITE_URL).toString() }
    : { rules: { userAgent: '*', disallow: '/' } };
}
