# Temnhanmavach - website Công ty Hoàng Lộc

Next.js 16 (App Router, TypeScript), xuất **site tĩnh** ra `out/` và chạy trên Cloudflare Workers.
Nội dung lấy từ 4blabel.com.vn (đã được đồng ý), đã đổi sang brand Temnhanmavach.

## Chạy và build

Cần Node 20.9 trở lên.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # xuất tĩnh ra out/
npm run preview    # xem thử thư mục out/
npm run typecheck
```

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `src/app/page.tsx` | Trang chủ |
| `src/app/gioi-thieu/page.tsx` | Trang Giới thiệu (dựng riêng) |
| `src/app/[...slug]/page.tsx` | Mọi trang con + bài viết lấy từ `src/content` |
| `src/app/layout.tsx` | Header, footer, font, SEO chung |
| `src/components/` | Component; file có `'use client'` là phần chạy trên trình duyệt (accordion, header, hiệu ứng) |
| `src/config/site.ts` | **Brand**: tên, pháp nhân, liên hệ, menu |
| `src/config/home.ts`, `about.ts` | Chữ của trang chủ và trang Giới thiệu |
| `src/styles/tokens.css` | **Brand**: màu, font, độ đậm, bo góc, khoảng cách |
| `src/styles/components/`, `pages/` | CSS theo component / trang (tên class kiểu BEM) |
| `src/content/pages`, `posts` | Nội dung (frontmatter + HTML) |
| `public/uploads/` | Ảnh (WebP) |
| `scripts/` | Python: lấy dữ liệu, nén ảnh, dọn nội dung, đổi brand |

### Quy ước

- Tiêu đề có từ nhấn màu: viết `[[từ]]` trong config, `\n` để xuống dòng (component `<Words>`).
- Trong nội dung `.md`: `{{phone}}`, `{{company}}`, `{{brand}}` được thay bằng giá trị trong `site.ts` lúc build.
- Hiệu ứng: thêm `data-reveal` (hiện dần), `data-reveal="words"` (từng chữ), `data-count` (đếm số), `data-parallax` (trôi theo cuộn).
- Không dùng dấu gạch dài; dùng `-`.

## Lấy lại dữ liệu từ site gốc

Cần Python 3 + `pip3 install --user beautifulsoup4 html5lib pillow`.

```bash
python3 scripts/extract.py          # REST API -> Markdown + tải ảnh gốc
python3 scripts/optimize_images.py  # resize 1600px + WebP
python3 scripts/clean_content.py    # bỏ khối liên hệ cũ lặp ở cuối trang
python3 scripts/rebrand.py --apply  # đổi tên brand theo scripts/rebrand.json
```

## Deploy (Cloudflare Workers)

Cloudflare build mỗi lần push: build command `npm run build`, deploy `npx wrangler deploy` (phục vụ `out/`, xem `wrangler.jsonc`).
Nhánh khác `main` có link xem trước dạng `https://<tên-nhánh>-label-site.<tài-khoản>.workers.dev`.

Biến môi trường lúc build:
- `SITE_URL` - địa chỉ site (canonical, sitemap)
- `ALLOW_INDEX=true` - mở cho Google index. Chỉ bật khi đã có tên miền thật và đã viết lại nội dung SEO (nội dung đang trùng site gốc).

Sửa biến trên Cloudflare xong phải build lại (Retry build hoặc push) mới có tác dụng.
