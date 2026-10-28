#!/usr/bin/env bash
# Frames for the scroll-scrubbed aerial on the Altus page (see src/components/project/ScrollSequence.tsx).
# Source: Globus's own 4K Altus walkthrough (globusdevelopers.com). The closing aerial, 189.1s-194.8s,
# is one continuous shot rising up the tower to the city; no captions. The film is letterboxed
# (3840x1624 picture inside 3840x2160), so the picture is cropped first.
#   ./extract.sh path/to/altus.mp4      (run from tools/scroll-sequence)
set -euo pipefail
SRC=$1
OUT=../../public/projects/altus/sequence
CUT="crop=3840:1624:0:268,fps=24"
rm -rf "$OUT" && mkdir -p "$OUT/d" "$OUT/m"

# d = desktop (16:9 centre crop, 1600x900), m = phones (upright centre crop, 720x1280)
ffmpeg -v error -ss 189.1 -to 194.8 -i "$SRC" -vf "$CUT,crop=2887:1624,scale=1600:900" -threads 2 \
  -c:v libwebp -quality 72 -compression_level 6 "$OUT/d/%04d.webp"
ffmpeg -v error -ss 189.1 -to 194.8 -i "$SRC" -vf "$CUT,crop=914:1624,scale=720:1280" -threads 2 \
  -c:v libwebp -quality 70 -compression_level 6 "$OUT/m/%04d.webp"

echo "$(ls "$OUT/d" | wc -l) frames, desktop $(du -sh "$OUT/d" | cut -f1), phones $(du -sh "$OUT/m" | cut -f1)"
