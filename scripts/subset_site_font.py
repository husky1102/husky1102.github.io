#!/usr/bin/env python3
"""Generate and verify the published LXGW subset used by this site."""

from __future__ import annotations

import argparse
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FONT = ROOT / "scripts" / "assets" / "fonts" / "LXGWWenKaiGBScreen-full.woff2"
PUBLIC_FONT = ROOT / "assets" / "fonts" / "LXGWWenKaiGBScreen-subset.woff2"
SOURCE_DIRS = (
    ROOT / "_data",
    ROOT / "_includes",
    ROOT / "_layouts",
    ROOT / "_pages",
    ROOT / "_posts",
    ROOT / "_portfolio",
    ROOT / "_publications",
    ROOT / "_talks",
    ROOT / "_teaching",
    ROOT / "assets" / "js",
)
SOURCE_FILES = (ROOT / "_config.yml",)
TEXT_SUFFIXES = {".html", ".js", ".json", ".md", ".markdown", ".yaml", ".yml"}
ALWAYS_INCLUDE = "，。！？：；（）《》〈〉【】“”‘’、·—…￥"
MAX_PUBLIC_BYTES = 512 * 1024


def is_site_character(character: str) -> bool:
    codepoint = ord(character)
    return (
        0x3000 <= codepoint <= 0x303F
        or 0x3400 <= codepoint <= 0x4DBF
        or 0x4E00 <= codepoint <= 0x9FFF
        or 0xFF00 <= codepoint <= 0xFFEF
    )


def iter_text_files() -> list[Path]:
    files = [path for path in SOURCE_FILES if path.exists()]
    for directory in SOURCE_DIRS:
        if not directory.exists():
            continue
        files.extend(
            path
            for path in directory.rglob("*")
            if path.is_file() and path.suffix.lower() in TEXT_SUFFIXES
        )
    return sorted(set(files))


def collect_codepoints() -> set[int]:
    characters = set(ALWAYS_INCLUDE)
    for path in iter_text_files():
        characters.update(character for character in path.read_text(encoding="utf-8") if is_site_character(character))
    return {ord(character) for character in characters}


def font_codepoints(path: Path) -> set[int]:
    with TTFont(path, recalcTimestamp=False, lazy=True) as font:
        return set(font.getBestCmap() or {})


def verify(expected: set[int]) -> None:
    if not PUBLIC_FONT.exists():
        raise SystemExit(f"missing public font: {PUBLIC_FONT.relative_to(ROOT)}")

    missing = expected - font_codepoints(PUBLIC_FONT)
    if missing:
        formatted = ", ".join(f"U+{codepoint:04X}" for codepoint in sorted(missing))
        raise SystemExit(f"public font is missing site characters: {formatted}")

    size = PUBLIC_FONT.stat().st_size
    if size > MAX_PUBLIC_BYTES:
        raise SystemExit(f"public font exceeds {MAX_PUBLIC_BYTES} bytes: {size}")

    print(f"verified {len(expected)} codepoints in {PUBLIC_FONT.relative_to(ROOT)} ({size} bytes)")


def generate(expected: set[int]) -> None:
    if not SOURCE_FONT.exists():
        raise SystemExit(f"missing source font: {SOURCE_FONT.relative_to(ROOT)}")

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    options.notdef_glyph = True
    options.notdef_outline = True
    options.recommended_glyphs = True

    font = TTFont(SOURCE_FONT, recalcTimestamp=False)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=expected)
    subsetter.subset(font)

    PUBLIC_FONT.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(PUBLIC_FONT, reorderTables=True)
    font.close()

    verify(expected)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify the committed subset without regenerating it")
    args = parser.parse_args()

    expected = collect_codepoints()
    if args.check:
        verify(expected)
    else:
        generate(expected)


if __name__ == "__main__":
    main()
