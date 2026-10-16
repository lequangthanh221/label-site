#!/usr/bin/env python3
"""Chuyển logo PNG (nền trong suốt, chỉ có cạnh thẳng) thành SVG vector.
    python3 scripts/trace_logo.py <logo.png> <out.svg>
Dò ranh giới pixel -> vòng khép kín -> Douglas-Peucker làm thẳng bậc thang.
"""
import sys
from PIL import Image, ImageChops, ImageDraw

EPS = 1.6  # sai số cho phép khi làm thẳng (px)


def trace(path):
    im = Image.open(path).convert("RGBA")
    W, H = im.size
    a = im.split()[3].load()
    inside = lambda x, y: 0 <= x < W and 0 <= y < H and a[x, y] >= 128
    edges = {}
    for y in range(H):
        for x in range(W):
            if not inside(x, y):
                continue
            # cạnh có hướng, phần "trong" nằm bên phải (y hướng xuống)
            if not inside(x, y - 1): edges.setdefault((x, y), []).append((x + 1, y))
            if not inside(x + 1, y): edges.setdefault((x + 1, y), []).append((x + 1, y + 1))
            if not inside(x, y + 1): edges.setdefault((x + 1, y + 1), []).append((x, y + 1))
            if not inside(x - 1, y): edges.setdefault((x, y + 1), []).append((x, y))
    loops = []
    while edges:
        start = next(iter(edges))
        loop = [start]
        cur = start
        while True:
            nxt = edges[cur].pop()
            if not edges[cur]:
                del edges[cur]
            if nxt == start:
                break
            loop.append(nxt)
            cur = nxt
        loops.append(loop)
    return (W, H), loops


def dp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = (dx * dx + dy * dy) ** 0.5 or 1
    idx, dmax = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / norm
        if d > dmax:
            idx, dmax = i, d
    if dmax <= eps:
        return [pts[0], pts[-1]]
    return dp(pts[: idx + 1], eps)[:-1] + dp(pts[idx:], eps)


def simplify(loop):
    # tách vòng tại điểm xa nhất để DP chạy trên 2 đường hở
    p0 = loop[0]
    far = max(range(len(loop)), key=lambda i: (loop[i][0] - p0[0]) ** 2 + (loop[i][1] - p0[1]) ** 2)
    a = dp(loop[: far + 1], EPS)
    b = dp(loop[far:] + [loop[0]], EPS)
    return a[:-1] + b[:-1]


def main(src, out):
    (W, H), loops = trace(src)
    loops = [simplify(l) for l in loops if len(l) > 12]
    # khung nhìn bám sát logo
    xs = [p[0] for l in loops for p in l]; ys = [p[1] for l in loops for p in l]
    minx, miny, maxx, maxy = min(xs), min(ys), max(xs), max(ys)
    d = " ".join("M" + " L".join(f"{x - minx} {y - miny}" for x, y in l) + "Z" for l in loops)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {maxx - minx} {maxy - miny}">'
           f'<path fill="currentColor" fill-rule="evenodd" d="{d}"/></svg>\n')
    open(out, "w").write(svg)
    # kiểm tra: vẽ lại SVG rồi so với ảnh gốc
    ref = Image.open(src).convert("RGBA").split()[3].point(lambda v: 255 if v >= 128 else 0)
    canvas = Image.new("L", (W, H), 0)
    for l in loops:
        m = Image.new("L", (W, H), 0)
        ImageDraw.Draw(m).polygon(l, fill=255)
        canvas = ImageChops.logical_xor(canvas.convert("1"), m.convert("1")).convert("L")
    diff = ImageChops.difference(ref, canvas)
    bad = sum(1 for v in diff.getdata() if v)
    area = sum(1 for v in ref.getdata() if v)
    print(f"{len(loops)} vòng, {sum(len(l) for l in loops)} điểm, lệch {bad / area:.2%} so với ảnh gốc, viewBox {maxx - minx}x{maxy - miny}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
