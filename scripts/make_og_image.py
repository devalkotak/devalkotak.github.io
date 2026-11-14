#!/usr/bin/env python3
"""Render the social preview card to app/opengraph-image.png.

The card used to be drawn at build time by next/og, but its bundled renderer
crashes on Windows with Node 24 ("TypeError: Invalid URL" in fileURLToPath),
which breaks local builds. A static PNG in app/ is served at the same
/opengraph-image URL, so this script draws it once with Pillow.

It mirrors the site's design: obsidian base, Instrument Sans, blue for the
action colour and pink for the live-status dot. The font is the same
variable Instrument Sans the site ships (OFL licence), kept in
scripts/fonts so the card renders the same on any machine. Re-run after
changing the copy or palette below.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "opengraph-image.png"
FONT = ROOT / "scripts" / "fonts" / "InstrumentSans.ttf"

WIDTH, HEIGHT = 1200, 630
PAD_X, PAD_Y = 72, 60

BACKGROUND = (9, 9, 11)
FOREGROUND = (244, 244, 246)
BODY = (200, 200, 209)
MUTED = (150, 150, 162)
ACCENT = (76, 125, 255)
SIGNAL = (255, 79, 158)
RULE = (38, 38, 46)


def font(size: int, weight: int) -> ImageFont.FreeTypeFont:
    face = ImageFont.truetype(str(FONT), size)
    face.set_variation_by_axes([weight])
    return face


def glow(image: Image.Image) -> Image.Image:
    """Blue light from the top right, the same corner the site's glass panels catch it."""
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse([700, -330, 1400, 330], fill=(*ACCENT, 120))
    layer = layer.filter(ImageFilter.GaussianBlur(110))
    return Image.alpha_composite(image.convert("RGBA"), layer)


def main() -> None:
    image = glow(Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND))
    draw = ImageDraw.Draw(image)

    draw.text((PAD_X, PAD_Y), "Deval Kotak, security engineering, Mumbai", font=font(26, 500), fill=MUTED)

    headline = font(84, 650)
    top, step = 150, 92
    draw.text((PAD_X, top), "I break systems", font=headline, fill=FOREGROUND)
    draw.text((PAD_X, top + step), "to understand them.", font=headline, fill=FOREGROUND)
    draw.text((PAD_X, top + 2 * step), "And build stronger ones.", font=headline, fill=MUTED)

    rule_y = HEIGHT - PAD_Y - 62
    draw.line([(PAD_X, rule_y), (WIDTH - PAD_X, rule_y)], fill=RULE, width=1)

    footer = font(26, 500)
    text_y = rule_y + 26
    dot = 12
    draw.ellipse([(PAD_X, text_y + 9), (PAD_X + dot, text_y + 9 + dot)], fill=SIGNAL)
    draw.text((PAD_X + dot + 16, text_y), "Open to security engineering roles", font=footer, fill=BODY)
    domain = "devalkotak.github.io"
    draw.text((WIDTH - PAD_X - draw.textlength(domain, font=footer), text_y), domain, font=footer, fill=ACCENT)

    image.convert("RGB").save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
