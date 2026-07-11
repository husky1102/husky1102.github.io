#!/usr/bin/env python3
"""Generate and verify the published LXGW subset used by this site."""

from __future__ import annotations

import argparse
import hashlib
import tempfile
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


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def verify(expected: set[int], public_font: Path = PUBLIC_FONT) -> None:
    if not public_font.exists():
        raise SystemExit(f"missing public font: {display_path(public_font)}")

    missing = expected - font_codepoints(public_font)
    if missing:
        formatted = ", ".join(f"U+{codepoint:04X}" for codepoint in sorted(missing))
        raise SystemExit(f"public font is missing site characters: {formatted}")

    size = public_font.stat().st_size
    if size > MAX_PUBLIC_BYTES:
        raise SystemExit(f"public font exceeds {MAX_PUBLIC_BYTES} bytes: {size}")

    print(f"verified {len(expected)} codepoints in {display_path(public_font)} ({size} bytes)")


def generate(expected: set[int], target: Path = PUBLIC_FONT, source_font: Path = SOURCE_FONT) -> None:
    if not source_font.exists():
        raise SystemExit(f"missing source font: {display_path(source_font)}")

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    options.notdef_glyph = True
    options.notdef_outline = True
    options.recommended_glyphs = True

    font = TTFont(source_font, recalcTimestamp=False)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=expected)
    subsetter.subset(font)

    target.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(target, reorderTables=True)
    font.close()

    verify(expected, target)


def check_generated(
    expected: set[int],
    public_font: Path = PUBLIC_FONT,
    source_font: Path = SOURCE_FONT,
) -> None:
    verify(expected, public_font)
    with tempfile.TemporaryDirectory(prefix="lxgw-font-check-") as temp_dir:
        generated_font = Path(temp_dir) / public_font.name
        generate(expected, generated_font, source_font)

        committed_bytes = public_font.read_bytes()
        generated_bytes = generated_font.read_bytes()
        if generated_bytes != committed_bytes:
            committed_hash = hashlib.sha256(committed_bytes).hexdigest()
            generated_hash = hashlib.sha256(generated_bytes).hexdigest()
            raise SystemExit(
                "generated font differs from committed font: "
                f"committed sha256={committed_hash}, generated sha256={generated_hash}"
            )

    print(f"generated font matches {display_path(public_font)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    checks = parser.add_mutually_exclusive_group()
    checks.add_argument("--check", action="store_true", help="verify the committed subset without regenerating it")
    checks.add_argument(
        "--check-generated",
        action="store_true",
        help="regenerate in a temporary directory and compare with the committed subset",
    )
    args = parser.parse_args()

    expected = collect_codepoints()
    if args.check_generated:
        check_generated(expected)
    elif args.check:
        verify(expected)
    else:
        generate(expected)


if __name__ == "__main__":
    main()
