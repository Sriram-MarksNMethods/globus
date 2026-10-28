"""
Colour grade for the silver Envato clips (hero towers + projects tunnel): Globus blue
blending into burgundy, the way the logo's G ring changes colour.

Writes:
  blue.cube, burgundy.cube  - each pixel's brightness picks a colour on a ramp:
                              deep shadow -> burgundy (logo #351530) -> accent -> white,
                              so light backgrounds stay white.
  mask-<w>x<h>.png          - which ramp to use where: blue top-left, burgundy
                              bottom-right, soft blend across the diagonal.

  python3 make_lut.py       (encode.sh runs this)
"""

from PIL import Image

SIZE = 33
WHITE = "#ffffff"
RAMPS = {
    "blue": [(0.00, "#160812"), (0.45, "#351530"), (0.68, "#2f5fd0"), (0.84, WHITE), (1.00, WHITE)],
    # Mid-tones a lighter plum so the burgundy side still reads as polished metal.
    "burgundy": [(0.00, "#160812"), (0.45, "#351530"), (0.68, "#6b2a5f"), (0.84, WHITE), (1.00, WHITE)],
}
FRAME_SIZES = [(720, 1280), (1920, 1012), (720, 1556), (1920, 1080)]


def rgb(hex_colour):
    return [int(hex_colour[i : i + 2], 16) / 255 for i in (1, 3, 5)]


def ramp(stops, t):
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        if a <= t <= b:
            k = (t - a) / (b - a)
            return [x + (y - x) * k for x, y in zip(rgb(ca), rgb(cb))]
    return rgb(stops[-1][1])


for name, stops in RAMPS.items():
    with open(f"{name}.cube", "w") as out:
        out.write(f"LUT_3D_SIZE {SIZE}\n")
        # .cube order: red changes fastest, then green, then blue.
        for b in range(SIZE):
            for g in range(SIZE):
                for r in range(SIZE):
                    luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / (SIZE - 1)
                    out.write("%.5f %.5f %.5f\n" % tuple(ramp(stops, luma)))

for w, h in FRAME_SIZES:
    mask = Image.new("L", (w, h))
    mask.putdata(
        [
            round(255 * min(1, max(0, ((x / w) * 0.6 + (y / h) * 0.4 - 0.35) / 0.3)))
            for y in range(h)
            for x in range(w)
        ]
    )
    mask.save(f"mask-{w}x{h}.png")
