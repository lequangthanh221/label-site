# label-site

Website tĩnh (Astro) cho công ty mới, dùng lại nội dung đã được đồng ý từ 4blabel.com.vn.
Nội dung và brand tách riêng: đổi brand không phải đụng vào nội dung.

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `src/content/pages/*.md` | 50 trang: tem nhãn theo ngành (`solution`), vật tư theo quy cách (`product`), dịch vụ (`service`), trang chung (`info`) |
| `src/content/posts/*.md` | Bài viết SEO |
| `public/uploads/` | Ảnh (đã nén WebP, giữ cấu trúc thư mục năm/tháng của WordPress) |
| `src/config/site.ts` | **Brand**: tên, pháp nhân, liên hệ, menu |
| `src/styles/tokens.css` | **Brand**: màu, font, bo góc, khoảng cách |
| `public/brand/` | Logo, favicon, ảnh chia sẻ mạng xã hội (đang là placeholder) |
| `scripts/` | Lấy dữ liệu, nén ảnh, đổi tên brand trong nội dung |

URL giữ nguyên như site gốc (vd. `/in-tem-nhan-thuc-pham/`, `/in-tem-nhan-ma-vach/giay-decal-…/`).

## Lấy lại dữ liệu từ site gốc

Cần Python 3 + `pip3 install --user beautifulsoup4 html5lib pillow`.

```bash
rm -rf src/content public/uploads
python3 scripts/extract.py          # REST API -> Markdown + tải ảnh gốc
python3 scripts/optimize_images.py  # resize 1600px + WebP, cập nhật đường dẫn
python3 scripts/clean_content.py    # bỏ khối liên hệ 4B lặp ở cuối mỗi trang
```

Sản phẩm WooCommerce (80) và portfolio (34) trên site gốc là dữ liệu demo của theme nên không lấy.

## Đổi brand

1. Sửa `src/config/site.ts` (mọi chỗ `TODO`) và `src/styles/tokens.css`.
2. Thay file trong `public/brand/`.
3. Điền tên/liên hệ mới vào `scripts/rebrand.json`, chạy `python3 scripts/rebrand.py` để xem trước, rồi thêm `--apply` để ghi.

## Chạy và build

Cần Node 20 trở lên.

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # ra thư mục dist/
```

GitHub Actions build lại sau mỗi lần push (`.github/workflows/build.yml`).

## Deploy lên Cloudflare Pages (repo private)

1. Vào dash.cloudflare.com → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
2. Cấp quyền GitHub cho Cloudflare, chọn repo `label-site`.
3. Cấu hình build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: `SITE_URL` = `https://<tên-project>.pages.dev`
4. **Save and Deploy**. Sau đó, mỗi lần push lên `main` site sẽ tự build lại.

Bản chạy thử có `noindex` và `robots.txt` chặn bot, để Google không index nội dung đang trùng 4B.

## Gắn tên miền

Trong project Cloudflare Pages → **Custom domains** → thêm tên miền. Sau đó đổi biến môi trường:
- `SITE_URL=https://ten-mien.vn` (dùng cho canonical, sitemap)
- `ALLOW_INDEX=true` (mở cho Google index; chỉ bật sau khi đã đổi brand và viết lại nội dung SEO)

**Lưu ý SEO:** nội dung trùng với 4blabel.com.vn. Trước khi bật `ALLOW_INDEX`, nên viết lại các bài SEO hoặc thống nhất với 4B về việc site nào giữ bản gốc.
