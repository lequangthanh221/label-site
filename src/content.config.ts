import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Nội dung lấy từ 4blabel.com.vn bằng scripts/extract.py — không sửa tay cấu trúc frontmatter
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    // solution = in tem nhãn theo ngành, product = vật tư theo quy cách, service = dịch vụ, info = trang chung
    kind: z.enum(['solution', 'product', 'service', 'info']),
    path: z.string(),
    parent: z.string(),
    order: z.number(),
    seoTitle: z.string(),
    description: z.string(),
    cover: z.string(),
    updated: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    date: z.string(),
    updated: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    cover: z.string(),
  }),
});

export const collections = { pages, posts };
