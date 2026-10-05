#!/usr/bin/env python3
"""Dọn phần đuôi lặp lại trong nội dung lấy từ site gốc:
khối "Để được tư vấn trực tiếp" + 2 blockquote liên hệ của 4B, logo 4B,
nút "LIÊN HỆ" viết hoa. Layout mới đã có dải liên hệ riêng ở cuối trang.

Chạy sau extract.py (an toàn khi chạy lại nhiều lần):
    python3 scripts/clean_content.py
"""
import glob
import os
import re

from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Gặp node nào chứa một trong các câu này ở nửa sau bài -> cắt từ đó đến hết
TAIL_MARKERS = [
    "Để được tư vấn trực tiếp",
    "Bạn đang tìm sản phẩm tem nhãn",
    "Công ty TNHH Sản xuất và Thương mại 4B",
    "Nếu bạn đang tìm kiếm loại tem nhãn",
    "HÃY LIÊN HỆ VỚI CHÚNG TÔI",
]


def clean(body):
    soup = BeautifulSoup(f"<div id='root'>{body}</div>", "html5lib")
    root = soup.find(id="root")
    for img in root.find_all("img", src=re.compile(r"/Logo-")):
        (img.find_parent("figure") or img).decompose()
    nodes = [n for n in root.children if getattr(n, "name", None)]
    half = len(nodes) // 2
    for i, node in enumerate(nodes):
        if i >= half and any(m in node.get_text(" ") for m in TAIL_MARKERS):
            for n in nodes[i:]:
                n.decompose()
            break
    for a in root.find_all("a", class_="readon"):
        (a.find_parent("p") or a).decompose()
    for p in root.find_all(["p", "h2", "h3", "h4", "strong"]):
        if not p.get_text(strip=True) and not p.find(["img", "iframe"]):
            p.decompose()
    return "\n".join(str(c).strip() for c in root.children if str(c).strip())


def first_text(html_body, n=160):
    t = re.sub(r"<[^>]+>", " ", html_body)
    t = re.sub(r"\s+", " ", t).strip()
    return (t[: n - 1].rsplit(" ", 1)[0] + "…") if len(t) > n else t


def fix_description(front, body):
    """Mô tả SEO tự sinh từ nội dung cũ có thể dính chữ của khối liên hệ - sinh lại."""
    m = re.search(r'^description: "(.*)"$', front, re.M)
    if m and any(k.lower() in m.group(1).lower() for k in TAIL_MARKERS + ["LIÊN HỆ", "Liên hệ ngay"]):
        new = first_text(body).replace('"', "'")
        front = front.replace(m.group(0), f'description: "{new}"')
    return front


def main():
    changed = 0
    for path in glob.glob(os.path.join(ROOT, "src", "content", "*", "*.md")):
        text = open(path, encoding="utf-8").read()
        _, front, body = text.split("---", 2)
        new = clean(body.strip())
        front_new = fix_description(front, new)
        if new != body.strip() or front_new != front:
            front = front_new
            changed += 1
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"---{front}---\n\n{new}\n")
    print(f"Đã dọn {changed} file")


if __name__ == "__main__":
    main()
