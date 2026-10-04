"""Draw the Save Greenline icon from scratch and write it in every format the apps need.

    python3 packaging/make_icon.py          # writes into packaging/icon/

The mark: three stacked rounded layers (cyan, blue, violet: the Office Hours brand mark) on deep
navy, with a small green sprout growing out of the top layer. No text.

Writes:
    packaging/icon/save-greenline-1024.png   the master picture, Mac proportions (margin all round)
    packaging/icon/save-greenline.icns       for the Mac app (needs macOS's iconutil)
    packaging/icon/save-greenline.ico        for the Windows shortcuts, sizes 16 to 256

Needs Pillow. It is the only thing in this project that does; tools/build_apps.py falls back to
the icon files already in packaging/icon/ when Pillow is not installed."""
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
OUT = HERE / "icon"

NAVY = (15, 23, 42)          # 0F172A
NAVY_TOP = (27, 38, 66)      # a touch lighter at the top, so the tile is not flat
NAVY_BOTTOM = (11, 17, 32)
CYAN = (34, 211, 238)        # 22D3EE
BLUE = (59, 130, 246)        # 3B82F6
VIOLET = (139, 92, 246)      # 8B5CF6
LEAF = (34, 197, 94)         # 22C55E
LEAF_LIGHT = (74, 222, 128)  # 4ADE80

SUPERSAMPLE = 2              # draw at twice the size, then shrink: smooth edges without a big canvas
ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
ICONSET = [(16, 1), (16, 2), (32, 1), (32, 2), (128, 1), (128, 2), (256, 1), (256, 2), (512, 1), (512, 2)]


def _quad(p0, p1, p2, t):
    """A point on a quadratic curve from p0 to p2, pulled towards p1."""
    a, b, c = (1 - t) ** 2, 2 * (1 - t) * t, t ** 2
    return (a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1])


def _leaf(base, tip, upper, lower, steps=48):
    """A leaf outline from base to tip and back: two curves, each bulging out to one side."""
    mx, my = (base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2
    nx, ny = -(tip[1] - base[1]), tip[0] - base[0]          # at right angles to the leaf's spine
    c1 = (mx + nx * upper, my + ny * upper)
    c2 = (mx - nx * lower, my - ny * lower)
    out = [_quad(base, c1, tip, i / steps) for i in range(steps + 1)]
    out += [_quad(tip, c2, base, i / steps) for i in range(1, steps)]
    return out


def draw(size=1024, margin=0.0977, corner=0.225):
    """One icon, `size` pixels square. `margin` is the clear space round the navy tile as a share
    of the whole picture (Mac icons keep about a tenth; Windows icons fill the square).
    `corner` is the tile's corner radius as a share of the tile."""
    w = size * SUPERSAMPLE
    img = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    left = w * margin
    side = w - 2 * left

    def at(x, y):                                            # tile coordinates (0 to 1) to pixels
        return (left + x * side, left + y * side)

    # The navy tile, very slightly lighter at the top.
    column = Image.new("RGB", (1, 256))
    column.putdata([tuple(round(NAVY_TOP[k] + (NAVY_BOTTOM[k] - NAVY_TOP[k]) * i / 255) for k in range(3)) for i in range(256)])
    shade = column.resize((w, w), Image.BILINEAR)
    mask = Image.new("L", (w, w), 0)
    box = [left, left, left + side, left + side]
    ImageDraw.Draw(mask).rounded_rectangle(box, radius=side * corner, fill=255)
    img.paste(shade, (0, 0), mask)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(box, radius=side * corner, outline=(255, 255, 255, 26), width=max(1, round(side * 0.004)))

    x0, x1, height, gap, top = 0.225, 0.775, 0.108, 0.042, 0.452

    # The sprout first, so its stem tucks in behind the top layer: a stem and two leaves.
    # The stem is a run of overlapping dots along a gentle curve, which gives a smooth round stroke.
    node = (0.5, 0.325)
    r = side * 0.017
    for i in range(241):
        cx, cy = at(*_quad((0.5, top + 0.04), (0.488, 0.40), node, i / 240))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LEAF)
    d.polygon([at(*p) for p in _leaf(node, (0.292, 0.212), 0.30, 0.52)], fill=LEAF_LIGHT)
    d.polygon([at(*p) for p in _leaf(node, (0.735, 0.128), 0.50, 0.28)], fill=LEAF)

    # The three layers.
    for i, colour in enumerate((CYAN, BLUE, VIOLET)):
        y = top + i * (height + gap)
        d.rounded_rectangle([at(x0, y), at(x1, y + height)], radius=side * height * 0.5, fill=colour)

    return img.resize((size, size), Image.LANCZOS)


def build(out=OUT):
    """Write the PNG, the .icns and the .ico. Returns {"png": path, "icns": path or None, "ico": path}."""
    out.mkdir(parents=True, exist_ok=True)
    mac = draw(1024)                                         # with the margin a Mac icon keeps
    png = out / "save-greenline-1024.png"
    mac.save(png, optimize=True)

    icns = out / "save-greenline.icns"
    if shutil.which("iconutil"):
        iconset = out / "save-greenline.iconset"
        shutil.rmtree(iconset, ignore_errors=True)
        iconset.mkdir()
        for points, scale in ICONSET:
            name = f"icon_{points}x{points}{'@2x' if scale == 2 else ''}.png"
            mac.resize((points * scale, points * scale), Image.LANCZOS).save(iconset / name, optimize=True)
        subprocess.run(["iconutil", "-c", "icns", str(iconset), "-o", str(icns)], check=True)
        shutil.rmtree(iconset)
    elif not icns.exists():
        icns = None                                          # not on a Mac, and none made earlier

    win = draw(1024, margin=0.03, corner=0.225)              # Windows icons fill the square
    frames = [win.resize((s, s), Image.LANCZOS) for s in ICO_SIZES]
    ico = out / "save-greenline.ico"
    frames[-1].save(ico, format="ICO", sizes=[(s, s) for s in ICO_SIZES], append_images=frames[:-1])
    return {"png": png, "icns": icns, "ico": ico}


if __name__ == "__main__":
    made = build()
    for kind, path in made.items():
        print(f"{kind}: {path if path else 'skipped (iconutil is a macOS tool)'}")
    sys.exit(0)
