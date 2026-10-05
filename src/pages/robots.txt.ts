import type { APIRoute } from 'astro';

// Chặn bot khi chưa bật ALLOW_INDEX=true (xem Base.astro)
export const GET: APIRoute = ({ site }) =>
  new Response(
    process.env.ALLOW_INDEX === 'true'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
      : 'User-agent: *\nDisallow: /\n',
  );
