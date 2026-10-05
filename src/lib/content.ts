// Đọc nội dung trong src/content (file .md: frontmatter + thân là HTML lấy từ site gốc).
// Chỉ chạy lúc build (server) - trang được xuất tĩnh.
import fs from 'node:fs';
import path from 'node:path';
import { site } from '@/config/site';

export type PageKind = 'solution' | 'product' | 'service' | 'info';

export type Page = {
  id: string;
  title: string;
  kind: PageKind;
  path: string;
  parent: string;
  order: number;
  seoTitle: string;
  description: string;
  cover: string;
  updated: string;
  html: string;
};

export type Post = {
  id: string;
  title: string;
  path: string;
  date: string;
  updated: string;
  seoTitle: string;
  description: string;
  cover: string;
  html: string;
};

const ROOT = path.join(process.cwd(), 'src', 'content');

// Ký hiệu trong nội dung -> thông tin brand hiện tại
const tokens: Record<string, string> = {
  phone: site.contact.phone,
  company: site.legalName,
  brand: site.name,
};
const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => tokens[k] ?? m);

function parse(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const [, front, ...rest] = raw.split(/^---$/m);
  const data: Record<string, unknown> = {};
  for (const line of front.trim().split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = JSON.parse(line.slice(i + 1).trim());
  }
  return { id: path.basename(file, '.md'), ...data, html: fill(rest.join('---').trim()) };
}

function load<T>(dir: string): T[] {
  const full = path.join(ROOT, dir);
  return fs.readdirSync(full).filter((f) => f.endsWith('.md')).map((f) => parse(path.join(full, f)) as T);
}

let pagesCache: Page[] | undefined;
let postsCache: Post[] | undefined;

export const getPages = () => (pagesCache ??= load<Page>('pages'));
export const getPosts = () =>
  (postsCache ??= load<Post>('posts').sort((a, b) => b.date.localeCompare(a.date)));

export const byOrder = (a: Page, b: Page) => a.order - b.order || a.title.localeCompare(b.title, 'vi');

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });

/** "/in-tem-nhan-ma-vach/giay-decal/" -> ["in-tem-nhan-ma-vach", "giay-decal"] */
export const toSlug = (p: string) => p.replace(/^\/|\/$/g, '').split('/');
