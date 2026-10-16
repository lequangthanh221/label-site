// Breadcrumb và nội dung liên quan cho trang con / bài viết.
import { byOrder, type Page, type Post } from './content';

export type Crumb = { name: string; path: string };
export type Related = { title: string; items: (Page | Post)[]; more: { label: string; href: string } };

const HOME: Crumb = { name: 'Trang chủ', path: '/' };
const PRODUCTS: Crumb = { name: 'Sản phẩm', path: '/san-pham/' };
const SERVICES: Crumb = { name: 'Dịch vụ', path: '/dich-vu/' };
const NEWS: Crumb = { name: 'Tin tức & Sự kiện', path: '/tin-tuc-su-kien/' };

const isProduct = (p: Page) => p.kind === 'solution' || p.kind === 'product';

/** Trang chủ / <nhóm> / <các trang cha> / <trang hiện tại> */
export function breadcrumb(entry: Page | Post, isPost: boolean, pages: Page[]): Crumb[] {
  const crumbs: Crumb[] = [HOME];
  if (isPost) {
    crumbs.push(NEWS);
  } else {
    const page = entry as Page;
    if (isProduct(page)) crumbs.push(PRODUCTS);
    else if (page.kind === 'service' && page.id !== 'dich-vu') crumbs.push(SERVICES);
    const chain: Page[] = [];
    let parent = pages.find((p) => p.id === page.parent);
    while (parent) {
      chain.unshift(parent);
      parent = pages.find((p) => p.id === parent!.parent);
    }
    chain.forEach((a) => crumbs.push({ name: a.title, path: a.path }));
  }
  crumbs.push({ name: entry.title, path: entry.path });
  return crumbs;
}

/** Xoay vòng danh sách bắt đầu sau phần tử hiện tại, để mỗi trang gợi ý khác nhau. */
function after<T extends { id: string }>(list: T[], id: string) {
  const i = list.findIndex((x) => x.id === id);
  return i < 0 ? list : [...list.slice(i + 1), ...list.slice(0, i)];
}

const LIMIT = 5;

export function related(entry: Page | Post, isPost: boolean, pages: Page[], posts: Post[]): Related | null {
  if (isPost) {
    const items = after(posts, entry.id).slice(0, LIMIT);
    return items.length ? { title: 'Bài viết liên quan', items, more: { label: 'Tất cả bài viết', href: NEWS.path } } : null;
  }
  const page = entry as Page;
  if (page.kind === 'service' && page.id !== 'dich-vu') {
    const items = after(pages.filter((p) => p.kind === 'service' && p.id !== 'dich-vu').sort(byOrder), page.id).slice(0, LIMIT);
    return { title: 'Dịch vụ khác', items, more: { label: 'Tất cả dịch vụ', href: SERVICES.path } };
  }
  if (isProduct(page)) {
    // ưu tiên cùng nhóm (cùng trang cha), rồi đến nhóm cha, rồi các ngành khác
    const siblings = page.parent ? after(pages.filter((p) => p.parent === page.parent).sort(byOrder), page.id) : [];
    const parent = pages.find((p) => p.id === page.parent);
    const tops = after(pages.filter((p) => p.kind === 'solution' && !p.parent).sort(byOrder), page.parent || page.id);
    const seen = new Set<string>([page.id]);
    const items = [...siblings, ...(parent ? [parent] : []), ...tops].filter((p) => !seen.has(p.id) && seen.add(p.id)).slice(0, LIMIT);
    const more = parent && siblings.length ? { label: `Xem tất cả quy cách`, href: parent.path } : { label: 'Tất cả sản phẩm', href: PRODUCTS.path };
    return { title: 'Sản phẩm liên quan', items, more };
  }
  return null;
}
