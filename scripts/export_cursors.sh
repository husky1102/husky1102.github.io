#!/usr/bin/env bash
# Preserve the supplied artwork and alpha; only resize for native CSS cursors.
# Requires ImageMagick 7 (exported with 7.1.2).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/cursors
for name in default pointer text grab grabbing wait help not-allowed crosshair; do
  size=48
  if [[ "$name" == text ]]; then size=32; fi
  magick "scripts/assets/cursors/$name.png" -resize "${size}x${size}" \
    -strip -define png:exclude-chunks=date,time "assets/cursors/$name.png"
done
