#!/usr/bin/env python3
"""Generate Emberwatch's first five native-resolution pixel sprites.

The output is deterministic and uses only hard-edged integer-coordinate shapes.
It is a visual-prototyping pipeline, not a substitute for final authored art.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "sketches" / "001-style-lock" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

P = {
    "outline": "#171b1c",
    "deep": "#24272a",
    "stone_dark": "#4b5559",
    "stone": "#778488",
    "stone_hi": "#a8b0aa",
    "timber_dark": "#4a3025",
    "timber": "#6e4930",
    "timber_hi": "#a16b3e",
    "brass_dark": "#795328",
    "brass": "#b78845",
    "brass_hi": "#e3bb6a",
    "copper": "#a95d37",
    "copper_hi": "#d8894d",
    "ember_dark": "#a43b2f",
    "ember": "#e95d3d",
    "flame": "#f29a45",
    "flame_hi": "#ffe09a",
    "ice_dark": "#326b78",
    "ice": "#62b8c2",
    "ice_hi": "#b8f0e7",
    "bark_dark": "#382a23",
    "bark": "#573b2b",
    "bark_hi": "#7c5434",
    "moss": "#556447",
    "moss_hi": "#82905b",
    "crimson": "#9e3040",
    "crimson_hi": "#e1515d",
}


def image(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def rect(d, xy, fill, outline=None):
    d.rectangle(xy, fill=fill, outline=outline)


def poly(d, points, fill, outline=None):
    d.polygon(points, fill=fill)
    if outline:
        d.line(points + [points[0]], fill=outline, width=1)


def shadow(d, xy):
    poly(d, [(xy[0], xy[3] - 2), (xy[0] + 4, xy[1] + 1), (xy[2] - 4, xy[1] + 1), (xy[2], xy[3] - 2), (xy[2] - 5, xy[3]), (xy[0] + 5, xy[3])], (18, 22, 22, 135))


def watchfire():
    im = image((48, 48)); d = ImageDraw.Draw(im)
    shadow(d, (2, 29, 46, 47))
    # Three-tile stone plinth with readable top/front planes.
    poly(d, [(4, 31), (10, 25), (39, 25), (45, 31), (39, 39), (10, 39)], P["stone"], P["outline"])
    poly(d, [(10, 39), (39, 39), (39, 44), (10, 44)], P["stone_dark"], P["outline"])
    poly(d, [(39, 39), (45, 31), (45, 36), (39, 44)], P["deep"], P["outline"])
    rect(d, (12, 40, 20, 42), P["stone"]); rect(d, (29, 40, 36, 42), P["stone"])
    rect(d, (7, 30, 15, 31), P["stone_hi"]); rect(d, (34, 29, 41, 30), P["stone_hi"])
    # Timber beacon frame.
    rect(d, (9, 13, 13, 33), P["outline"]); rect(d, (10, 14, 12, 32), P["timber_hi"])
    rect(d, (36, 13, 40, 33), P["outline"]); rect(d, (37, 14, 39, 32), P["timber"])
    rect(d, (8, 12, 41, 16), P["outline"]); rect(d, (10, 13, 39, 14), P["timber_hi"])
    # Brass mast/cage gives the silhouette its progression hook.
    rect(d, (23, 3, 26, 25), P["outline"]); rect(d, (24, 4, 25, 24), P["brass_hi"])
    rect(d, (20, 7, 29, 9), P["outline"]); rect(d, (21, 7, 28, 7), P["brass"])
    rect(d, (21, 16, 22, 25), P["brass"]); rect(d, (27, 16, 28, 25), P["brass"])
    # Brazier and oversized readable flame.
    poly(d, [(16, 26), (33, 26), (30, 34), (20, 34)], P["outline"])
    poly(d, [(18, 27), (31, 27), (28, 32), (21, 32)], P["copper"])
    rect(d, (20, 25, 29, 28), P["ember_dark"])
    poly(d, [(21, 26), (20, 21), (23, 18), (24, 12), (27, 17), (29, 20), (28, 26)], P["flame"])
    poly(d, [(24, 25), (23, 21), (25, 17), (27, 21), (26, 25)], P["flame_hi"])
    rect(d, (17, 34, 20, 37), P["brass_dark"]); rect(d, (29, 34, 32, 37), P["brass_dark"])
    return im


def base(d):
    shadow(d, (2, 21, 30, 31))
    poly(d, [(3, 23), (8, 19), (25, 19), (29, 23), (25, 28), (8, 28)], P["stone"], P["outline"])
    poly(d, [(8, 28), (25, 28), (25, 31), (8, 31)], P["stone_dark"], P["outline"])
    rect(d, (6, 22, 11, 23), P["stone_hi"]); rect(d, (21, 21, 26, 22), P["stone_hi"])


def bolt_thrower():
    im = image((32, 32)); d = ImageDraw.Draw(im); base(d)
    # Tall narrow timber carriage.
    rect(d, (14, 9, 19, 23), P["outline"]); rect(d, (15, 10, 18, 22), P["timber_hi"])
    rect(d, (11, 18, 22, 21), P["outline"]); rect(d, (12, 18, 21, 19), P["brass"])
    # Bow limbs and taut string.
    d.line([(4, 7), (8, 4), (13, 5), (17, 10)], fill=P["outline"], width=3)
    d.line([(17, 10), (22, 5), (27, 7)], fill=P["outline"], width=3)
    d.line([(4, 7), (17, 10), (27, 7)], fill=P["brass_hi"], width=1)
    d.line([(4, 7), (17, 13), (27, 7)], fill=P["stone_hi"], width=1)
    # Loaded bolt aimed north-west.
    d.line([(18, 13), (7, 3)], fill=P["outline"], width=3); d.line([(17, 12), (7, 3)], fill=P["steel_hi"] if "steel_hi" in P else P["stone_hi"], width=1)
    poly(d, [(5, 1), (9, 3), (6, 5)], P["brass_hi"], P["outline"])
    rect(d, (12, 13, 21, 16), P["outline"]); rect(d, (13, 13, 20, 14), P["timber"])
    return im


def frost_condenser():
    im = image((32, 32)); d = ImageDraw.Draw(im); base(d)
    # Broad copper condenser with bright cyan glass reservoir.
    rect(d, (9, 8, 23, 22), P["outline"])
    rect(d, (11, 9, 21, 21), P["ice_dark"])
    rect(d, (12, 8, 20, 10), P["ice_hi"]); rect(d, (12, 11, 20, 18), P["ice"])
    rect(d, (14, 11, 16, 18), P["ice_hi"])
    rect(d, (9, 11, 23, 13), P["copper"]); rect(d, (9, 17, 23, 19), P["copper_hi"])
    rect(d, (7, 10, 9, 21), P["outline"]); rect(d, (7, 11, 7, 20), P["brass"])
    rect(d, (23, 10, 25, 21), P["outline"]); rect(d, (24, 11, 24, 20), P["brass"])
    # Condenser crown/crystal.
    poly(d, [(16, 1), (21, 6), (19, 10), (13, 10), (11, 6)], P["ice"], P["outline"])
    poly(d, [(16, 2), (17, 8), (14, 7)], P["ice_hi"])
    rect(d, (14, 21, 18, 24), P["brass_dark"])
    return im


def bombard():
    im = image((32, 32)); d = ImageDraw.Draw(im); base(d)
    # Squat circular turntable.
    poly(d, [(8, 18), (12, 14), (23, 14), (27, 18), (23, 23), (12, 23)], P["brass_dark"], P["outline"])
    rect(d, (13, 16, 22, 21), P["timber"]); rect(d, (16, 15, 19, 23), P["brass_hi"])
    # Heavy barrel aimed north-west, with clear dark muzzle.
    poly(d, [(13, 18), (6, 10), (8, 6), (18, 15)], P["outline"])
    poly(d, [(13, 16), (8, 10), (10, 8), (17, 15)], P["stone"])
    rect(d, (5, 5, 11, 11), P["outline"]); rect(d, (6, 6, 10, 10), P["stone_dark"]); rect(d, (7, 7, 9, 9), P["deep"])
    rect(d, (10, 11, 12, 13), P["brass_hi"]); rect(d, (20, 18, 25, 20), P["timber_hi"])
    return im


def root_crawler():
    im = image((32, 32)); d = ImageDraw.Draw(im)
    shadow(d, (3, 19, 29, 28))
    # Knot, not quadruped: asymmetrical central burl plus ground-hugging roots.
    poly(d, [(8, 11), (12, 7), (21, 8), (25, 13), (22, 20), (11, 20), (7, 16)], P["bark"], P["outline"])
    poly(d, [(12, 8), (17, 5), (22, 9), (19, 12), (13, 12)], P["bark_hi"], P["outline"])
    # Thorn crown and moss make the plant read immediate.
    poly(d, [(12, 7), (11, 2), (15, 6), (17, 1), (19, 7), (24, 4), (22, 10)], P["moss"], P["outline"])
    rect(d, (14, 5, 16, 8), P["moss_hi"]); rect(d, (20, 6, 22, 8), P["moss_hi"])
    # Radial roots/tendrils.
    d.line([(10, 17), (4, 20), (1, 24)], fill=P["outline"], width=3); d.line([(10, 18), (4, 20), (1, 24)], fill=P["bark_hi"], width=1)
    d.line([(13, 20), (9, 25), (5, 27)], fill=P["outline"], width=3); d.line([(13, 20), (9, 25), (5, 27)], fill=P["bark"], width=1)
    d.line([(21, 18), (27, 21), (30, 19)], fill=P["outline"], width=3); d.line([(21, 18), (27, 21), (30, 19)], fill=P["bark_hi"], width=1)
    d.line([(19, 20), (23, 26), (28, 28)], fill=P["outline"], width=3); d.line([(19, 20), (23, 26), (28, 28)], fill=P["bark"], width=1)
    # Corrupted ember eye/core.
    rect(d, (17, 12, 21, 16), P["outline"]); rect(d, (18, 13, 20, 15), P["crimson_hi"]); rect(d, (19, 13, 19, 13), "#ffd0b0")
    return im


SPRITES = {
    "watchfire": watchfire(),
    "bolt-thrower": bolt_thrower(),
    "frost-condenser": frost_condenser(),
    "bombard": bombard(),
    "root-crawler": root_crawler(),
}

for name, sprite in SPRITES.items():
    sprite.save(OUT / f"{name}.png", optimize=False)

# Contact sheet at 4x nearest-neighbour scale for human review.
sheet = Image.new("RGBA", (800, 220), "#101923")
d = ImageDraw.Draw(sheet)
labels = ["WATCHFIRE", "BOLT THROWER", "FROST CONDENSER", "BOMBARD", "ROOT CRAWLER"]
for index, ((name, sprite), label) in enumerate(zip(SPRITES.items(), labels)):
    cell_x = 12 + index * 157
    d.rectangle((cell_x, 12, cell_x + 143, 205), fill="#182534", outline="#b78845", width=2)
    scale = 3 if name == "watchfire" else 4
    shown = sprite.resize((sprite.width * scale, sprite.height * scale), Image.Resampling.NEAREST)
    x = cell_x + (144 - shown.width) // 2
    y = 31 + (132 - shown.height) // 2
    sheet.alpha_composite(shown, (x, y))
    d.text((cell_x + 72, 177), label, fill="#e8dfc8", anchor="mm")
    d.text((cell_x + 72, 192), f"{sprite.width}x{sprite.height} native", fill="#93a0a6", anchor="mm")
sheet.save(OUT / "core-sprite-sheet.png", optimize=False)
print("generated", ", ".join(str(p.relative_to(ROOT)) for p in sorted(OUT.glob("*.png"))))
