#!/usr/bin/env bash
# Preserve the source artwork, geometry and alpha. Compress bright RGB values
# more than dark outlines, with a stronger shoulder for the dark theme.
# Requires ImageMagick 7 (exported with 7.1.2).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/cursors/dark
for name in default pointer text grab grabbing wait help not-allowed crosshair; do
  size=48
  if [[ "$name" == text ]]; then size=32; fi
  for theme in light dark; do
    shoulder=0.06
    output="assets/cursors/$name.png"
    if [[ "$theme" == dark ]]; then
      shoulder=0.16
      output="assets/cursors/dark/$name.png"
    fi
    magick "scripts/assets/cursors/$name.png" -resize "${size}x${size}" \
      -channel RGB -fx "u - $shoulder * u^3" +channel \
      -strip -define png:exclude-chunks=date,time "$output"
  done
done
