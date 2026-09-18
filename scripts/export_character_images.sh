#!/usr/bin/env bash
# Requires libwebp's cwebp. Originals stay outside the published site.
set -euo pipefail
cd "$(dirname "$0")/.."

for width in 480 640 1024; do
  cwebp -quiet -q 82 -m 6 -alpha_q 100 -resize "$width" 0 \
    scripts/assets/images/gpt091-source.png \
    -o "images/character-welcome-${width}.webp"
done
for width in 320 640; do
  cwebp -quiet -q 82 -m 6 -alpha_q 100 -resize "$width" 0 \
    scripts/assets/images/gpt093-source.png \
    -o "images/character-lost-${width}.webp"
done
for width in 320 640; do
  cwebp -quiet -q 82 -m 6 -alpha_q 100 -resize "$width" 0 \
    scripts/assets/images/gpt092-source.png \
    -o "images/character-reading-${width}.webp"
done
