#!/usr/bin/env python3
"""Generate Emberwatch's complete five-sprite 2×-source set.

Every sprite is authored at true 2× source resolution — the same gameplay
footprints as the 1× set with four times the addressable pixel area. Nothing
is resized, traced, or interpolated. Deterministic prototype art, not final
production artwork.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "sketches" / "003-core-2x" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

P = {
    "outline": "#14191b", "outline_hi": "#242b2d",
    "stone_0": "#343d41", "stone_1": "#525e62", "stone_2": "#758286", "stone_3": "#a5ada7",
    "wood_0": "#412b22", "wood_1": "#68452f", "wood_2": "#95623d", "wood_3": "#bd8150",
    "brass_0": "#65431f", "brass_1": "#97652f", "brass_2": "#c28c48", "brass_3": "#e4bc6c",
    "copper_0": "#713a2c", "copper_1": "#9f5335", "copper_2": "#cf7846",
    "ember_0": "#7f2929", "ember_1": "#b83b32", "ember_2": "#e35b37",
    "flame_0": "#ee7f35", "flame_1": "#f7ae50", "flame_2": "#ffe18a", "flame_3": "#fff3bf",
    "steel_0": "#4e5a5e", "steel_1": "#77848a", "steel_2": "#9aa5ab",
    "ice_0": "#2a5d68", "ice_1": "#3f8891", "ice_2": "#74c3cc", "ice_3": "#bdf1ea",
    "soot": "#242022",
    "bark_0": "#33251d", "bark_1": "#4b3628", "bark_2": "#6e4a33", "bark_3": "#8a5f3e",
    "moss_0": "#45523c", "moss_1": "#5c6a47", "moss_2": "#7d8a5b",
    "crim_0": "#6e2434", "crim_1": "#9e3040", "crim_2": "#e1515d",
}


def image(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def poly(d, points, fill, outline=None, width=1):
    d.polygon(points, fill=fill)
    if outline:
        d.line(points + [points[0]], fill=outline, width=width)


def base2x(d):
    """Two-plane 2x2-tile stone plinth shared by the three towers."""
    poly(d, [(9, 63), (20, 51), (77, 51), (89, 63), (77, 78), (20, 78)], (10, 14, 15, 95))
    poly(d, [(5, 46), (16, 37), (49, 37), (59, 46), (50, 55), (15, 55)], P["stone_2"], P["outline"], 2)
    poly(d, [(15, 55), (50, 55), (50, 61), (15, 61)], P["stone_0"], P["outline"], 2)
    d.line([(9, 45), (18, 40), (47, 40), (55, 45)], fill=P["stone_3"], width=2)
    d.rectangle((18, 57, 30, 59), fill=P["stone_1"]); d.rectangle((37, 57, 47, 59), fill=P["stone_1"])
    d.line([(26, 38), (26, 54)], fill=P["stone_1"], width=1); d.line([(40, 38), (40, 54)], fill=P["stone_1"], width=1)


def watchfire_2x():
    im = image((96, 96)); d = ImageDraw.Draw(im)
    poly(d, [(5, 72), (16, 61), (78, 61), (91, 72), (78, 92), (18, 92)], (10, 14, 15, 90))
    poly(d, [(9, 63), (20, 51), (77, 51), (89, 63), (78, 78), (20, 78)], P["stone_2"], P["outline"], 2)
    poly(d, [(20, 78), (78, 78), (78, 89), (20, 89)], P["stone_0"], P["outline"], 2)
    poly(d, [(78, 78), (89, 63), (89, 74), (78, 89)], P["outline_hi"], P["outline"], 2)
    d.line([(12, 63), (22, 55), (76, 55), (86, 63)], fill=P["stone_3"], width=2)
    d.line([(24, 78), (24, 88)], fill=P["outline_hi"], width=2); d.line([(51, 78), (51, 88)], fill=P["outline_hi"], width=2)
    d.rectangle((23, 80, 47, 83), fill=P["stone_1"]); d.rectangle((54, 80, 74, 83), fill=P["stone_1"])
    d.rectangle((13, 61, 28, 63), fill=P["stone_3"]); d.rectangle((66, 59, 82, 61), fill=P["stone_3"])
    for x, shade in ((18, P["wood_2"]), (72, P["wood_1"])):
        d.rectangle((x - 2, 27, x + 7, 68), fill=P["outline"])
        d.rectangle((x, 29, x + 4, 67), fill=shade)
        d.rectangle((x + 4, 30, x + 5, 66), fill=P["wood_0"])
        d.rectangle((x + 1, 35, x + 2, 39), fill=P["wood_3"]); d.rectangle((x + 1, 52, x + 2, 56), fill=P["wood_3"])
    d.rectangle((15, 24, 81, 33), fill=P["outline"])
    d.rectangle((18, 26, 78, 29), fill=P["wood_3"]); d.rectangle((18, 30, 78, 31), fill=P["wood_0"])
    for x in (17, 72):
        d.rectangle((x, 25, x + 8, 34), fill=P["brass_0"])
        d.rectangle((x + 2, 26, x + 6, 31), fill=P["brass_2"])
        d.point((x + 3, 28), fill=P["brass_3"]); d.point((x + 6, 28), fill=P["brass_3"])
    d.rectangle((46, 5, 52, 51), fill=P["outline"]); d.rectangle((48, 7, 50, 50), fill=P["brass_3"]); d.rectangle((51, 8, 52, 49), fill=P["brass_0"])
    d.rectangle((39, 12, 59, 17), fill=P["outline"]); d.rectangle((42, 13, 57, 15), fill=P["brass_2"])
    d.rectangle((41, 31, 44, 52), fill=P["brass_1"]); d.rectangle((56, 31, 59, 52), fill=P["brass_1"])
    d.rectangle((43, 34, 57, 36), fill=P["brass_3"])
    poly(d, [(31, 56), (68, 56), (62, 72), (38, 72)], P["outline"], P["outline"], 2)
    poly(d, [(34, 57), (65, 57), (59, 68), (41, 68)], P["copper_1"])
    d.rectangle((36, 57, 63, 60), fill=P["copper_2"]); d.rectangle((40, 61, 59, 67), fill=P["soot"])
    for x in (36, 61):
        d.rectangle((x, 68, x + 5, 75), fill=P["outline"]); d.rectangle((x + 2, 69, x + 3, 74), fill=P["brass_2"])
    poly(d, [(42, 57), (39, 48), (44, 42), (43, 34), (49, 39), (52, 25), (57, 39), (64, 45), (60, 57)], P["flame_0"], P["ember_1"])
    poly(d, [(46, 57), (44, 49), (49, 45), (50, 36), (55, 43), (59, 48), (56, 57)], P["flame_1"])
    poly(d, [(49, 56), (48, 50), (52, 45), (55, 50), (54, 56)], P["flame_2"])
    d.rectangle((51, 50, 53, 55), fill=P["flame_3"])
    d.rectangle((28, 70, 34, 72), fill=P["soot"]); d.rectangle((65, 70, 70, 72), fill=P["ember_0"])
    d.rectangle((14, 68, 17, 70), fill=P["brass_1"]); d.rectangle((80, 66, 83, 69), fill=P["brass_1"])
    return im


def bolt_thrower_2x():
    im = image((64, 64)); d = ImageDraw.Draw(im); base2x(d)
    # Tall narrow timber carriage, front and side planes.
    d.rectangle((27, 15, 39, 48), fill=P["outline"]); d.rectangle((29, 17, 37, 47), fill=P["wood_2"])
    d.rectangle((35, 18, 36, 46), fill=P["wood_0"]); d.line([(30, 22), (30, 44)], fill=P["wood_3"], width=1)
    # Brass winding gear — readable at 2x with teeth.
    d.rectangle((21, 34, 45, 40), fill=P["outline"])
    d.ellipse((23, 35, 33, 43), fill=P["brass_2"], outline=P["outline"])
    d.point((28, 39), fill=P["brass_0"])
    for dx, dy in ((0, -4), (4, 0), (0, 4), (-4, 0), (3, 3), (-3, 3), (3, -3), (-3, -3)):
        d.rectangle((27 + dx, 38 + dy, 29 + dx, 40 + dy), fill=P["brass_3"])
    d.rectangle((34, 36, 42, 38), fill=P["brass_1"])
    # Crank handle (staffed-operator cue).
    d.line([(42, 38), (48, 38)], fill=P["outline"], width=3); d.line([(48, 35), (48, 41)], fill=P["outline"], width=3)
    d.line([(48, 38), (48, 41)], fill=P["brass_2"], width=1)
    # Steel bow limbs with visible recurve and taut double string.
    d.line([(7, 12), (13, 7), (20, 8), (31, 19)], fill=P["outline"], width=4)
    d.line([(31, 19), (42, 7), (49, 9), (56, 14)], fill=P["outline"], width=4)
    d.line([(7, 12), (13, 7), (20, 8), (31, 19)], fill=P["steel_1"], width=1)
    d.line([(31, 19), (42, 7), (49, 9), (56, 14)], fill=P["steel_1"], width=1)
    d.line([(7, 13), (31, 24), (56, 13)], fill=P["brass_3"], width=1)
    d.line([(7, 15), (31, 27), (56, 15)], fill=P["steel_2"], width=1)
    # Loaded steel bolt aimed north-west, brass head, feathered tail.
    d.line([(33, 27), (9, 5)], fill=P["outline"], width=4); d.line([(31, 25), (9, 5)], fill=P["steel_2"], width=1)
    poly(d, [(8, 2), (15, 5), (10, 9)], P["brass_2"], P["outline"])
    d.line([(31, 25), (36, 20), (41, 25)], fill=P["flame_0"], width=2)
    return im


def frost_condenser_2x():
    im = image((64, 64)); d = ImageDraw.Draw(im); base2x(d)
    # Copper coil assembly: rings around the reservoir, visible winding seams.
    d.rectangle((16, 25, 48, 47), fill=P["outline"])
    d.rectangle((18, 27, 46, 45), fill=P["ice_0"])
    for y0 in (29, 34, 39):
        d.line([(19, y0), (45, y0)], fill=P["copper_1"], width=2)
        d.line([(19, y0), (45, y0)], fill=P["copper_2"], width=1)
        d.rectangle((20, y0 + 1, 25, y0 + 1), fill=P["copper_2"])
    # Glass reservoir with internal crystal.
    poly(d, [(23, 14), (41, 14), (46, 26), (18, 26)], P["outline"], P["outline"], 2)
    poly(d, [(25, 16), (39, 16), (43, 24), (21, 24)], P["ice_3"])
    d.rectangle((27, 17, 37, 22), fill=P["ice_2"])
    poly(d, [(32, 11), (37, 18), (34, 25), (30, 25), (27, 18)], P["ice_2"], P["outline"])
    poly(d, [(32, 12), (34, 18), (32, 23), (30, 18)], P["ice_3"])
    d.line([(33, 13), (35, 19)], fill="#eafff9", width=1)
    # Copper crown/cap and frost vents.
    poly(d, [(32, 1), (42, 9), (39, 15), (25, 15), (22, 9)], P["copper_1"], P["outline"], 2)
    d.rectangle((26, 9, 38, 11), fill=P["copper_2"])
    d.line([(32, 2), (32, 9)], fill=P["copper_2"], width=2)
    for x, y, w, h in ((12, 20, 4, 2), (48, 22, 4, 2), (13, 43, 3, 2), (49, 41, 3, 2)):
        d.rectangle((x, y, x + w, y + h), fill=P["ice_2"])
    d.rectangle((29, 48, 35, 53), fill=P["brass_0"]); d.rectangle((30, 49, 34, 52), fill=P["brass_2"])
    return im


def bombard_2x():
    im = image((64, 64)); d = ImageDraw.Draw(im)
    poly(d, [(4, 48), (14, 39), (50, 39), (60, 48), (51, 61), (14, 61)], (10, 14, 15, 95))
    poly(d, [(5, 46), (16, 37), (49, 37), (59, 46), (50, 55), (15, 55)], P["stone_2"], P["outline"], 2)
    poly(d, [(15, 55), (50, 55), (50, 61), (15, 61)], P["stone_0"], P["outline"], 2)
    d.line([(9, 45), (18, 40), (47, 40), (55, 45)], fill=P["stone_3"], width=2)
    d.rectangle((18, 57, 30, 59), fill=P["stone_1"]); d.rectangle((37, 57, 47, 59), fill=P["stone_1"])
    poly(d, [(15, 39), (23, 30), (46, 30), (55, 39), (46, 49), (23, 49)], P["brass_0"], P["outline"], 2)
    poly(d, [(19, 39), (25, 34), (43, 34), (50, 39), (43, 45), (25, 45)], P["wood_1"])
    d.line([(24, 34), (44, 34)], fill=P["wood_3"], width=2)
    d.rectangle((28, 31, 36, 49), fill=P["outline"]); d.rectangle((31, 32, 34, 48), fill=P["brass_3"])
    poly(d, [(27, 38), (11, 22), (14, 13), (37, 32)], P["outline"], P["outline"], 2)
    poly(d, [(25, 35), (15, 23), (18, 17), (34, 32)], P["stone_1"])
    poly(d, [(18, 18), (23, 21), (32, 30), (29, 33), (18, 23)], P["stone_3"])
    d.line([(20, 24), (30, 34)], fill=P["stone_0"], width=2)
    d.rectangle((8, 9, 23, 24), fill=P["outline"])
    d.rectangle((10, 11, 21, 22), fill=P["stone_0"])
    d.rectangle((12, 13, 19, 20), fill=P["soot"])
    d.rectangle((14, 15, 18, 19), fill="#090d10")
    d.line([(10, 11), (20, 11)], fill=P["stone_3"], width=2)
    poly(d, [(18, 24), (21, 20), (26, 25), (23, 29)], P["brass_2"], P["outline"])
    d.rectangle((40, 36, 51, 41), fill=P["wood_2"]); d.rectangle((42, 37, 49, 38), fill=P["wood_3"])
    d.rectangle((46, 33, 50, 45), fill=P["copper_0"]); d.rectangle((47, 34, 48, 42), fill=P["copper_2"])
    d.ellipse((20, 40, 31, 51), fill=P["outline"]); d.ellipse((22, 42, 29, 49), fill=P["brass_2"]); d.rectangle((25, 43, 26, 48), fill=P["brass_0"])
    for x, y in ((18, 42), (39, 43), (45, 39), (31, 36)):
        d.rectangle((x, y, x + 2, y + 2), fill=P["brass_3"])
    return im


def root_crawler_2x():
    im = image((64, 64)); d = ImageDraw.Draw(im)
    poly(d, [(6, 40), (12, 38), (58, 38), (62, 40), (58, 56), (10, 56)], (10, 14, 15, 100))
    # Knot, not quadruped: asymmetrical central burl plus ground-hugging roots.
    poly(d, [(16, 20), (25, 12), (42, 15), (50, 26), (44, 40), (22, 40), (14, 31)], P["bark_1"], P["outline"], 2)
    poly(d, [(24, 15), (34, 10), (44, 18), (38, 24), (26, 24)], P["bark_3"], P["outline"], 2)
    # Bark fissures — only possible with 2x source area.
    d.line([(24, 26), (30, 34)], fill=P["bark_0"], width=2)
    d.line([(36, 22), (40, 30)], fill=P["bark_0"], width=2)
    d.line([(28, 16), (34, 21)], fill=P["bark_0"], width=1)
    # Thorn crown and moss.
    poly(d, [(24, 14), (22, 4), (30, 12), (34, 2), (38, 14), (48, 8), (44, 20)], P["moss_1"], P["outline"], 2)
    d.rectangle((28, 10, 32, 15), fill=P["moss_2"]); d.rectangle((40, 12, 44, 16), fill=P["moss_2"])
    d.point((23, 5), fill=P["moss_2"]); d.point((35, 3), fill=P["moss_2"])
    # Radial roots/tendrils, thicker outlines at 2x.
    for pts, hi in (
        ([(20, 34), (8, 40), (2, 48)], True),
        ([(26, 40), (18, 50), (10, 54)], False),
        ([(42, 36), (54, 42), (61, 38)], True),
        ([(38, 40), (46, 52), (56, 56)], False),
    ):
        d.line(pts, fill=P["outline"], width=4)
        d.line(pts, fill=P["bark_2"] if hi else P["bark_1"], width=1)
    # Corrupted ember core — crimson fracture with bright centre.
    d.rectangle((33, 24, 41, 32), fill=P["outline"]); d.rectangle((35, 26, 39, 30), fill=P["crim_2"])
    d.rectangle((36, 27, 38, 29), fill="#ffd0b0")
    # Sparse crimson sap fractures radiating from the core.
    d.line([(36, 24), (33, 18)], fill=P["crim_1"], width=1)
    d.line([(40, 32), (46, 38)], fill=P["crim_0"], width=1)
    return im


sprites = {
    "watchfire-2x": watchfire_2x(),
    "bolt-thrower-2x": bolt_thrower_2x(),
    "frost-condenser-2x": frost_condenser_2x(),
    "bombard-2x": bombard_2x(),
    "root-crawler-2x": root_crawler_2x(),
}
for name, sprite in sprites.items():
    sprite.save(OUT / f"{name}.png", optimize=False)

# Contact sheet at 2x nearest-neighbour scale for human review.
sheet = Image.new("RGBA", (1000, 300), "#101923")
d = ImageDraw.Draw(sheet)
labels = ["WATCHFIRE 96x96", "BOLT THROWER 64x64", "FROST CONDENSER 64x64", "BOMBARD 64x64", "ROOT CRAWLER 64x64"]
for index, ((name, sprite), label) in enumerate(zip(sprites.items(), labels)):
    cell_x = 12 + index * 197
    d.rectangle((cell_x, 12, cell_x + 185, 235), fill="#182534", outline="#b78845", width=2)
    scale = 2
    shown = sprite.resize((sprite.width * scale, sprite.height * scale), Image.Resampling.NEAREST)
    x = cell_x + (186 - shown.width) // 2
    y = 25 + (160 - shown.height) // 2
    sheet.alpha_composite(shown, (x, y))
    d.text((cell_x + 93, 248), label, fill="#e8dfc8", anchor="mm")
sheet.save(OUT / "core-2x-sprite-sheet.png", optimize=False)
print("generated", ", ".join(str(p.relative_to(ROOT)) for p in sorted(OUT.glob("*.png"))))