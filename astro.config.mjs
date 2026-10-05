import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Đổi SITE_URL khi gắn tên miền (biến môi trường lúc build, hoặc sửa mặc định dưới đây)
export default defineConfig({
  site: process.env.SITE_URL || 'https://label-site.iamlequangthanh2201.workers.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
