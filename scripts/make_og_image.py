#!/usr/bin/env python3
"""Render the social preview card to app/opengraph-image.png.

The card used to be drawn at build time by next/og, but its bundled renderer
crashes on Windows with Node 24 ("TypeError: Invalid URL" in fileURLToPath),
which breaks local builds. A static PNG in app/ is served at the same
/opengraph-image URL, so this script draws the same layout once with Pillow.
Re-run it after changing the copy or palette below.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "opengraph-image.png"

WIDTH, HEIGHT = 1200, 630
PAD_X, PAD_Y = 72, 64

BACKGROUND = "#101113"
FOREGROUND = "#e8eaed"
MUTED = "#8b9096"
ACCENT = "#9fb8d0"
OK = "#85b892"
RULE = "#26292e"

FONT_DIR = Path("C:/Windows/Fonts")
REGULAR = FONT_DIR / "segoeui.ttf"
BOLD = FONT_DIR / "segoeuib.ttf"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def draw_runs(draw: ImageDraw.ImageDraw, x: int, y: int, runs: list[tuple[str, str]], face) -> int:
    """Draw (text, colour) pieces left to right; return the x after the last one."""
    for text, colour in runs:
        draw.text((x, y), text, font=face, fill=colour)
        x += int(draw.textlength(text, font=face))
    return x


def main() -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)

    small = font(REGULAR, 24)
    slash = [(" / ", ACCENT)]
    draw_runs(
        draw,
        PAD_X,
        PAD_Y,
        [("deval kotak", MUTED), *slash, ("mumbai", MUTED), *slash, ("security engineering", MUTED)],
        small,
    )

    headline = font(BOLD, 64)
    line_height = 78
    top = PAD_Y + 24 + 56
    draw.text((PAD_X, top), "I break systems", font=headline, fill=FOREGROUND)
    draw.text((PAD_X, top + line_height), "to understand them.", font=headline, fill=MUTED)
    draw_runs(
        draw,
        PAD_X,
        top + 2 * line_height,
        [("And build ", FOREGROUND), ("stronger ones.", ACCENT)],
        headline,
    )

    footer = font(REGULAR, 22)
    rule_y = HEIGHT - PAD_Y - 28 - 30
    draw.line([(PAD_X, rule_y), (WIDTH - PAD_X, rule_y)], fill=RULE, width=1)
    text_y = rule_y + 28
    dot = 10
    dot_top = text_y + 9
    draw.ellipse([(PAD_X, dot_top), (PAD_X + dot, dot_top + dot)], fill=OK)
    draw.text((PAD_X + dot + 14, text_y), "open to security engineering roles", font=footer, fill=MUTED)
    domain = "devalkotak.github.io"
    draw.text(
        (WIDTH - PAD_X - draw.textlength(domain, font=footer), text_y),
        domain,
        font=footer,
        fill=ACCENT,
    )

    image.save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
