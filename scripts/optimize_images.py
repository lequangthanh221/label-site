#!/usr/bin/env python3
"""Nén ảnh trong public/uploads: resize cạnh dài tối đa 1600px, chuyển sang WebP,
rồi cập nhật đường dẫn trong src/content. Chạy sau extract.py.
    python3 scripts/optimize_images.py
"""
import os
import re

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS = os.path.join(ROOT, "public", "uploads")
CONTENT = os.path.join(ROOT, "src", "content")
MAX = 1600

renamed = {}
before = after = 0
for dirpath, _, files in os.walk(UPLOADS):
    for name in files:
        src = os.path.join(dirpath, name)
        base, ext = os.path.splitext(name)
        if ext.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        before += os.path.getsize(src)
        dst = os.path.join(dirpath, base + ".webp")
        with Image.open(src) as im:
            im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
            im.thumbnail((MAX, MAX), Image.LANCZOS)
            im.save(dst, "WEBP", quality=80, method=6)
        after += os.path.getsize(dst)
        os.remove(src)
        rel = "/" + os.path.relpath(src, os.path.join(ROOT, "public"))
        renamed[rel] = os.path.splitext(rel)[0] + ".webp"

for dirpath, _, files in os.walk(CONTENT):
    for name in files:
        path = os.path.join(dirpath, name)
        with open(path, encoding="utf-8") as f:
            text = f.read()
        new = re.sub(r"/uploads/[^\"'\s)]+", lambda m: renamed.get(m.group(0), m.group(0)), text)
        if new != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new)

print(f"{len(renamed)} ảnh: {before / 1e6:.1f}MB -> {after / 1e6:.1f}MB")
