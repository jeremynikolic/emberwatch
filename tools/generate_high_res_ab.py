#!/usr/bin/env python3
"""Generate true 2×-source A/B sprites for Emberwatch.

These sprites preserve the same gameplay footprints as the 1× set but contain
four times the addressable pixel area. No source sprite is resized or traced.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "sketches" / "002-high-res-ab" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

P = {
    "outline": "#14191b", "outline_hi": "#242b2d",
    "stone_0": "#343d41", "stone_1": "#525e62", "stone_2": "#758286", "stone_3": "#a5ada7",
    "wood_0": "#412b22", "wood_1": "#68452f", "wood_2": "#95623d", "wood_3": "#bd8150",
    "brass_0": "#65431f", "brass_1": "#97652f", "brass_2": "#c28c48", "brass_3": "#e4bc6c",
    "copper_0": "#713a2c", "copper_1": "#9f5335", "copper_2": "#cf7846",
    "ember_0": "#7f2929", "ember_1": "#b83b32", "ember_2": "#e35b37",
    "flame_0": "#ee7f35", "flame_1": "#f7ae50", "flame_2": "#ffe18a", "flame_3": "#fff3bf",
    "soot": "#242022",
}


def image(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def poly(d, points, fill, outline=None, width=1):
    d.polygon(points, fill=fill)
    if outline:
        d.line(points + [points[0]], fill=outline, width=width)


def watchfire_2x():
    im = image((96, 96)); d = ImageDraw.Draw(im)
    # Soft-edged pixel shadow, still made from hard integer shapes.
    poly(d, [(5, 72), (16, 61), (78, 61), (91, 72), (78, 92), (18, 92)], (10, 14, 15, 90))
    poly(d, [(9, 63), (20, 51), (77, 51), (89, 63), (78, 78), (20, 78)], P["stone_2"], P["outline"], 2)
    poly(d, [(20, 78), (78, 78), (78, 89), (20, 89)], P["stone_0"], P["outline"], 2)
    poly(d, [(78, 78), (89, 63), (89, 74), (78, 89)], P["outline_hi"], P["outline"], 2)
    # Individual masonry and bevels.
    d.line([(12, 63), (22, 55), (76, 55), (86, 63)], fill=P["stone_3"], width=2)
    d.line([(24, 78), (24, 88)], fill=P["outline_hi"], width=2); d.line([(51, 78), (51, 88)], fill=P["outline_hi"], width=2)
    d.rectangle((23, 80, 47, 83), fill=P["stone_1"]); d.rectangle((54, 80, 74, 83), fill=P["stone_1"])
    d.rectangle((13, 61, 28, 63), fill=P["stone_3"]); d.rectangle((66, 59, 82, 61), fill=P["stone_3"])
    # Timber scaffold, with visible front and side planes.
    for x, shade in ((18, P["wood_2"]), (72, P["wood_1"])):
        d.rectangle((x-2, 27, x+7, 68), fill=P["outline"])
        d.rectangle((x, 29, x+4, 67), fill=shade)
        d.rectangle((x+4, 30, x+5, 66), fill=P["wood_0"])
        d.rectangle((x+1, 35, x+2, 39), fill=P["wood_3"])
        d.rectangle((x+1, 52, x+2, 56), fill=P["wood_3"])
    d.rectangle((15, 24, 81, 33), fill=P["outline"])
    d.rectangle((18, 26, 78, 29), fill=P["wood_3"]); d.rectangle((18, 30, 78, 31), fill=P["wood_0"])
    # Brass joint plates and rivets.
    for x in (17, 72):
        d.rectangle((x, 25, x+8, 34), fill=P["brass_0"])
        d.rectangle((x+2, 26, x+6, 31), fill=P["brass_2"])
        d.point((x+3, 28), fill=P["brass_3"]); d.point((x+6, 28), fill=P["brass_3"])
    # Mast and relay cage.
    d.rectangle((46, 5, 52, 51), fill=P["outline"]); d.rectangle((48, 7, 50, 50), fill=P["brass_3"]); d.rectangle((51, 8, 52, 49), fill=P["brass_0"])
    d.rectangle((39, 12, 59, 17), fill=P["outline"]); d.rectangle((42, 13, 57, 15), fill=P["brass_2"])
    d.rectangle((41, 31, 44, 52), fill=P["brass_1"]); d.rectangle((56, 31, 59, 52), fill=P["brass_1"])
    d.rectangle((43, 34, 57, 36), fill=P["brass_3"])
    # Copper brazier with a stronger mechanical rim.
    poly(d, [(31, 56), (68, 56), (62, 72), (38, 72)], P["outline"], P["outline"], 2)
    poly(d, [(34, 57), (65, 57), (59, 68), (41, 68)], P["copper_1"])
    d.rectangle((36, 57, 63, 60), fill=P["copper_2"]); d.rectangle((40, 61, 59, 67), fill=P["soot"])
    for x in (36, 61):
        d.rectangle((x, 68, x+5, 75), fill=P["outline"]); d.rectangle((x+2, 69, x+3, 74), fill=P["brass_2"])
    # Layered beacon flame, now with enough resolution for shape and internal light.
    poly(d, [(42, 57), (39, 48), (44, 42), (43, 34), (49, 39), (52, 25), (57, 39), (64, 45), (60, 57)], P["flame_0"], P["ember_1"])
    poly(d, [(46, 57), (44, 49), (49, 45), (50, 36), (55, 43), (59, 48), (56, 57)], P["flame_1"])
    poly(d, [(49, 56), (48, 50), (52, 45), (55, 50), (54, 56)], P["flame_2"])
    d.rectangle((51, 50, 53, 55), fill=P["flame_3"])
    # Ash and tiny utility marks keep the larger sprite from feeling empty.
    d.rectangle((28, 70, 34, 72), fill=P["soot"]); d.rectangle((65, 70, 70, 72), fill=P["ember_0"])
    d.rectangle((14, 68, 17, 70), fill=P["brass_1"]); d.rectangle((80, 66, 83, 69), fill=P["brass_1"])
    return im


def bombard_2x():
    im = image((64, 64)); d = ImageDraw.Draw(im)
    poly(d, [(4, 48), (14, 39), (50, 39), (60, 48), (51, 61), (14, 61)], (10, 14, 15, 95))
    # Detailed two-plane stone emplacement.
    poly(d, [(5, 46), (16, 37), (49, 37), (59, 46), (50, 55), (15, 55)], P["stone_2"], P["outline"], 2)
    poly(d, [(15, 55), (50, 55), (50, 61), (15, 61)], P["stone_0"], P["outline"], 2)
    d.line([(9, 45), (18, 40), (47, 40), (55, 45)], fill=P["stone_3"], width=2)
    d.rectangle((18, 57, 30, 59), fill=P["stone_1"]); d.rectangle((37, 57, 47, 59), fill=P["stone_1"])
    # Brass-trimmed turntable and timber carriage.
    poly(d, [(15, 39), (23, 30), (46, 30), (55, 39), (46, 49), (23, 49)], P["brass_0"], P["outline"], 2)
    poly(d, [(19, 39), (25, 34), (43, 34), (50, 39), (43, 45), (25, 45)], P["wood_1"])
    d.line([(24, 34), (44, 34)], fill=P["wood_3"], width=2)
    d.rectangle((28, 31, 36, 49), fill=P["outline"]); d.rectangle((31, 32, 34, 48), fill=P["brass_3"])
    # Barrel: large muzzle and multiple metal planes, aimed north-west.
    poly(d, [(27, 38), (11, 22), (14, 13), (37, 32)], P["outline"], P["outline"], 2)
    poly(d, [(25, 35), (15, 23), (18, 17), (34, 32)], P["stone_1"])
    poly(d, [(18, 18), (23, 21), (32, 30), (29, 33), (18, 23)], P["stone_3"])
    d.line([(20, 24), (30, 34)], fill=P["stone_0"], width=2)
    d.rectangle((8, 9, 23, 24), fill=P["outline"])
    d.rectangle((10, 11, 21, 22), fill=P["stone_0"])
    d.rectangle((12, 13, 19, 20), fill=P["soot"])
    d.rectangle((14, 15, 18, 19), fill="#090d10")
    d.line([(10, 11), (20, 11)], fill=P["stone_3"], width=2)
    # Barrel band and firing hardware.
    poly(d, [(18, 24), (21, 20), (26, 25), (23, 29)], P["brass_2"], P["outline"])
    d.rectangle((40, 36, 51, 41), fill=P["wood_2"]); d.rectangle((42, 37, 49, 38), fill=P["wood_3"])
    d.rectangle((46, 33, 50, 45), fill=P["copper_0"]); d.rectangle((47, 34, 48, 42), fill=P["copper_2"])
    # Gear and fasteners visible only at 2× source resolution.
    d.ellipse((20, 40, 31, 51), fill=P["outline"]); d.ellipse((22, 42, 29, 49), fill=P["brass_2"]); d.rectangle((25, 43, 26, 48), fill=P["brass_0"])
    for x, y in ((18, 42), (39, 43), (45, 39), (31, 36)):
        d.rectangle((x, y, x+2, y+2), fill=P["brass_3"])
    return im


sprites = {"watchfire-2x": watchfire_2x(), "bombard-2x": bombard_2x()}
for name, sprite in sprites.items():
    sprite.save(OUT / f"{name}.png", optimize=False)

sheet = Image.new("RGBA", (640, 300), "#101923")
d = ImageDraw.Draw(sheet)
for i, (name, sprite) in enumerate(sprites.items()):
    x0 = 20 + i * 310
    d.rectangle((x0, 20, x0 + 290, 260), fill="#182534", outline="#b78845", width=2)
    x = x0 + (290 - sprite.width * 2) // 2
    y = 40 + (180 - sprite.height * 2) // 2
    sheet.alpha_composite(sprite.resize((sprite.width * 2, sprite.height * 2), Image.Resampling.NEAREST), (x, y))
    d.text((x0 + 145, 226), name.upper(), fill="#e8dfc8", anchor="mm")
    d.text((x0 + 145, 244), f"{sprite.width}x{sprite.height} native", fill="#93a0a6", anchor="mm")
sheet.save(OUT / "high-res-sprite-sheet.png", optimize=False)
print("generated", ", ".join(str(p.relative_to(ROOT)) for p in sorted(OUT.glob("*.png"))))
