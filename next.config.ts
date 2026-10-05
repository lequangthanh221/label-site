import type { NextConfig } from 'next';

// Xuất site tĩnh ra out/ - Cloudflare Workers phục vụ thư mục này (xem wrangler.jsonc)
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
