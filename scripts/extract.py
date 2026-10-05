#!/usr/bin/env python3
"""Lấy nội dung thật từ 4blabel.com.vn (WordPress REST API) thành file Markdown
cho Astro content collections, kèm tải ảnh gốc về public/uploads/.

Chạy lại được nhiều lần: ảnh đã tải sẽ bỏ qua.
    python3 scripts/extract.py
"""
import html
import json
import os
import re
import urllib.parse
import urllib.request

SRC = "https://4blabel.com.vn"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "src", "content")
PUBLIC = os.path.join(ROOT, "public")
UA = {"User-Agent": "Mozilla/5.0 (content migration)"}

# Trang thuộc nhóm "sản phẩm" (vật tư bán theo quy cách) — là trang con của 2 trang này
PRODUCT_PARENTS = {"in-tem-nhan-ma-vach", "muc-in-ma-vach"}
# Trang dịch vụ (menu "Dịch vụ")
SERVICE_SLUGS = {"dich-vu", "thiet-ke-tem-nhan-bao-bi", "tu-van-chat-lieu-tem-nhan", "gia-cong-in-an-tem-nhan"}
# Trang thông tin chung
INFO_SLUGS = {"gioi-thieu-4b-label", "lien-he", "tin-tuc-su-kien", "san-pham-4b-label"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def get_json(path):
    return json.loads(get(SRC + path))


def get_all(endpoint, fields):
    out, page = [], 1
    while True:
        batch = get_json(f"/wp-json/wp/v2/{endpoint}?per_page=100&page={page}&_fields={fields}")
        out += batch
        if len(batch) < 100:
            return out
        page += 1


# ---------- ảnh ----------
media_cache = {}


def local_upload_path(url):
    """https://4blabel.com.vn/wp-content/uploads/2020/08/a-300x225.jpg -> /uploads/2020/08/a.jpg (bản gốc)."""
    path = urllib.parse.urlparse(url).path
    path = urllib.parse.unquote(path.split("/wp-content", 1)[-1])
    return re.sub(r"-\d+x\d+(\.\w+)$", r"\1", path)


def download(url):
    local = local_upload_path(url)
    dest = os.path.join(PUBLIC, local.lstrip("/"))
    if not os.path.exists(dest):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        original = SRC + "/wp-content" + urllib.parse.quote(local)
        try:
            data = get(original)
        except Exception:
            data = get(url)  # bản gốc không còn thì lấy bản đã resize
        with open(dest, "wb") as f:
            f.write(data)
    return local


def resolve_media(ids):
    need = [i for i in ids if i not in media_cache]
    for k in range(0, len(need), 100):
        chunk = ",".join(need[k:k + 100])
        for m in get_json(f"/wp-json/wp/v2/media?include={chunk}&per_page=100&_fields=id,source_url,alt_text,title"):
            media_cache[str(m["id"])] = {
                "src": download(m["source_url"]),
                "alt": m["alt_text"] or html.unescape(m["title"]["rendered"]),
            }
    return [media_cache[i] for i in ids if i in media_cache]


# ---------- shortcode WPBakery -> HTML sạch ----------
SC = re.compile(r"\[(/?)(\w+)((?:[^\]\[]|\[[^\]]*\])*)\]")
ATTR = re.compile(r'(\w+)\s*=\s*"([^"]*)"')


def attrs(raw):
    raw = html.unescape(raw).replace("”", '"').replace("″", '"').replace("“", '"').replace("′", "'")
    return dict(ATTR.findall(raw))


def img_tag(m, cls=""):
    alt = html.escape(m["alt"], quote=True)
    c = f' class="{cls}"' if cls else ""
    return f'<img src="{m["src"]}" alt="{alt}" loading="lazy"{c}>'


def convert(content):
    images = []

    def repl(mt):
        closing, name, raw = mt.group(1), mt.group(2), mt.group(3)
        if closing:
            return ""
        a = attrs(raw)
        if name == "vc_single_image" and a.get("image"):
            ms = resolve_media([a["image"]])
            images.extend(ms)
            return f"<figure>{img_tag(ms[0])}</figure>" if ms else ""
        if name in ("vc_gallery", "vc_images_carousel") and a.get("images"):
            ms = resolve_media(a["images"].split(","))
            images.extend(ms)
            return '<div class="gallery">' + "".join(img_tag(m) for m in ms) + "</div>"
        if name == "vc_custom_heading" and a.get("text"):
            return f"<h2>{html.escape(a['text'])}</h2>"
        if name == "vc_btn" and a.get("title"):
            link = urllib.parse.unquote(a.get("link", "")).split("url:", 1)[-1].split("|", 1)[0]
            if not link or "lien-he" in link:  # CTA sidebar — template mới tự có
                return ""
            return f'<p><a class="btn" href="{link}">{html.escape(a["title"])}</a></p>'
        return ""  # vc_row, vc_column, widget, sidebar... bỏ

    out = SC.sub(repl, content)

    # ảnh nhúng trực tiếp trong text
    def inline_img(mt):
        local = download(mt.group(2))
        images.append({"src": local, "alt": ""})
        return mt.group(1) + local + mt.group(3)

    out = re.sub(r'(<img[^>]*?src=")(https?://4blabel\.com\.vn/wp-content/uploads/[^"]+)(")', inline_img, out)
    out = re.sub(r'\s(srcset|sizes)="[^"]*"', "", out)
    # link nội bộ -> đường dẫn tương đối, link ảnh -> local
    out = re.sub(r'https?://4blabel\.com\.vn(/wp-content/uploads/[^"\s]+)', lambda m: local_upload_path(m.group(0)), out)
    out = re.sub(r'https?://(?:www\.)?4blabel\.com\.vn(/[^"\s]*)?', lambda m: m.group(1) or "/", out)
    return tidy(out), images


BLOCKS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "table", "figure", "div", "blockquote", "hr", "iframe"}


def tidy(fragment):
    """Sửa lồng thẻ sai (html5lib), gom chữ trôi nổi vào <p>, bỏ thẻ rỗng và style inline."""
    from bs4 import BeautifulSoup, NavigableString

    soup = BeautifulSoup(f"<div id='root'>{fragment}</div>", "html5lib")
    root = soup.find(id="root")
    for t in root.select("form, script, style, #gtx-trans, .wpcf7, .screen-reader-response"):
        t.decompose()
    for t in root.find_all("div"):  # div bọc của theme -> bỏ vỏ, chỉ giữ gallery
        if "gallery" not in (t.get("class") or []) and t is not root:
            t.unwrap()
    for t in root.find_all(True):
        for a in ("style", "class", "id", "width", "height", "align") if t.name not in ("img", "div", "a") else ("style", "width", "height"):
            t.attrs.pop(a, None)
    for t in root.find_all(["span", "font"]):
        t.unwrap()
    # gom các node inline nằm trực tiếp dưới root vào <p>
    run = []
    def flush():
        if run and any(str(n).strip() for n in run):
            p = soup.new_tag("p")
            run[0].insert_before(p)
            for n in run:
                p.append(n.extract())
        run.clear()
    for node in list(root.children):
        if isinstance(node, NavigableString) or node.name not in BLOCKS:
            run.append(node)
        else:
            flush()
    flush()
    for p in root.find_all(["p", "h2", "h3", "h4", "strong"]):
        if not p.get_text(strip=True) and not p.find(["img", "iframe"]):
            p.decompose()
    for p in root.find_all("p"):  # bỏ <br> thừa ở đầu/cuối đoạn
        while p.contents and getattr(p.contents[-1], "name", None) == "br":
            p.contents[-1].extract()
        while p.contents and getattr(p.contents[0], "name", None) == "br":
            p.contents[0].extract()
    out = "\n".join(str(c) for c in root.children if str(c).strip())
    return re.sub(r"\n{3,}", "\n\n", out).strip()


def head_meta(url):
    """Lấy title/description/og:image từ HTML đã render (Yoast)."""
    try:
        doc = get(url).decode("utf-8", "replace")
    except Exception:
        return {}
    def meta(pat):
        m = re.search(pat, doc)
        return html.unescape(m.group(1)).strip() if m else ""
    return {
        "seoTitle": meta(r"<title>([^<]+)"),
        "seoDescription": meta(r'<meta name="description" content="([^"]*)"'),
    }


def yaml_str(s):
    return json.dumps(s or "", ensure_ascii=False)


def write(collection, slug, front, body):
    d = os.path.join(CONTENT, collection)
    os.makedirs(d, exist_ok=True)
    lines = ["---"]
    for k, v in front.items():
        if isinstance(v, list):
            lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
        elif isinstance(v, (int, float)):
            lines.append(f"{k}: {v}")
        else:
            lines.append(f"{k}: {yaml_str(v)}")
    lines.append("---")
    # một khối HTML liền (không dòng trống / thụt lề) để Markdown không hiểu nhầm thành code block
    body = re.sub(r"\n\s*", "\n", body.strip())
    with open(os.path.join(d, slug + ".md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n\n" + body + "\n")


def first_text(body, n=160):
    t = re.sub(r"<[^>]+>", " ", body)
    t = re.sub(r"\s+", " ", html.unescape(t)).strip()
    return (t[: n - 1].rsplit(" ", 1)[0] + "…") if len(t) > n else t


def main():
    fields = "id,slug,parent,link,title,content,excerpt,date,modified,menu_order,featured_media"
    pages = get_all("pages", fields)
    by_id = {p["id"]: p for p in pages}
    report = {}

    for p in pages:
        slug = p["slug"]
        parent = by_id.get(p["parent"], {}).get("slug", "")
        if slug in INFO_SLUGS:
            kind = "info"
        elif parent in PRODUCT_PARENTS:
            kind = "product"
        elif slug in SERVICE_SLUGS:
            kind = "service"
        else:
            kind = "solution"  # in tem nhãn theo ngành + nhóm sản phẩm
        body, imgs = convert(p["content"]["rendered"])
        path = urllib.parse.urlparse(p["link"]).path
        seo = head_meta(p["link"])
        front = {
            "title": html.unescape(p["title"]["rendered"]),
            "kind": kind,
            "path": path,
            "parent": parent,
            "order": p["menu_order"],
            "seoTitle": seo.get("seoTitle", ""),
            "description": seo.get("seoDescription") or first_text(body),
            "cover": imgs[0]["src"] if imgs else "",
            "updated": p["modified"][:10],
        }
        write("pages", slug, front, body)
        report[kind] = report.get(kind, 0) + 1

    for p in get_all("posts", fields + ",categories"):
        body, imgs = convert(p["content"]["rendered"])
        cover = resolve_media([str(p["featured_media"])]) if p["featured_media"] else []
        seo = head_meta(p["link"])
        write("posts", p["slug"], {
            "title": html.unescape(p["title"]["rendered"]),
            "path": urllib.parse.urlparse(p["link"]).path,
            "date": p["date"][:10],
            "updated": p["modified"][:10],
            "seoTitle": seo.get("seoTitle", ""),
            "description": seo.get("seoDescription") or first_text(re.sub(r"<[^>]+>", "", p["excerpt"]["rendered"]) or body),
            "cover": (cover[0]["src"] if cover else (imgs[0]["src"] if imgs else "")),
        }, body)
        report["post"] = report.get("post", 0) + 1

    with open(os.path.join(ROOT, "scripts", "media-map.json"), "w", encoding="utf-8") as f:
        json.dump(media_cache, f, ensure_ascii=False, indent=1)
    print(report, "images:", len(media_cache))


if __name__ == "__main__":
    main()
