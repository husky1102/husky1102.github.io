"""Export the high-density homepage portrait (requires Pillow 12.2.0).

The sidebar retains its existing 640px asset. Both homepage image layers must
use the same srcset and sizes so their upper/lower contours stay aligned.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def main():
    source = ROOT / "scripts/assets/images/avatar-gpt063-source.png"
    target = ROOT / "images/avatar-gpt063-1024.webp"
    with Image.open(source) as image:
        image = image.convert("RGBA").resize((1024, 1024), Image.Resampling.LANCZOS)
        image.save(target, format="WEBP", quality=82, method=6)
    if target.stat().st_size > 192 * 1024:
        raise RuntimeError("Homepage portrait exceeds the 192 KiB budget")
    print(f"Exported {target.relative_to(ROOT)} ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
