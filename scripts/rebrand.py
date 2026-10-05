#!/usr/bin/env python3
"""Thay tên/thông tin liên hệ của 4B trong nội dung bằng thông tin công ty mới.

1. Điền giá trị mới vào scripts/rebrand.json (khoá = chuỗi cũ, giá trị = chuỗi mới; để "" là bỏ qua)
2. python3 scripts/rebrand.py          # xem trước số chỗ sẽ đổi
   python3 scripts/rebrand.py --apply  # ghi thật

Không đụng dòng `path:` trong frontmatter (giữ URL cho SEO - đổi slug thì phải thêm redirect).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "src", "content")
mapping = {k: v for k, v in json.load(open(os.path.join(ROOT, "scripts", "rebrand.json"), encoding="utf-8")).items() if v}
apply = "--apply" in sys.argv

# chuỗi dài thay trước để "Công ty … 4B" không bị "4B" cắt ngang
keys = sorted(mapping, key=len, reverse=True)
pattern = re.compile("|".join(re.escape(k) for k in keys), re.IGNORECASE) if keys else None
lower = {k.lower(): v for k, v in mapping.items()}

total = 0
for dirpath, _, files in os.walk(CONTENT):
    for name in files:
        path = os.path.join(dirpath, name)
        lines = open(path, encoding="utf-8").read().split("\n")
        count = 0
        for i, line in enumerate(lines):
            if pattern is None or line.startswith("path:"):
                continue
            lines[i], n = pattern.subn(lambda m: lower[m.group(0).lower()], line)
            count += n
        if count:
            total += count
            print(f"{count:4d}  {os.path.relpath(path, ROOT)}")
            if apply:
                open(path, "w", encoding="utf-8").write("\n".join(lines))

print(f"{'Đã đổi' if apply else 'Sẽ đổi'} {total} chỗ." + ("" if apply else " Thêm --apply để ghi."))
