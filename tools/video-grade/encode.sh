#!/usr/bin/env bash
# Re-encodes the hero towers and the projects tunnel from the ORIGINAL downloads, not from
# earlier web copies (compressing an already-compressed copy is what made them blocky).
#   ./encode.sh <hero original> <tunnel original>      (run from tools/video-grade)
#
# hero:   Envato "elegant metallic geometric spirals reveal" (4096x2160 ProRes, blue glass)
#         -> silver (colour removed)
# tunnel: Envato "abstract geometric tunnel reveal" (1920x1080)
#         -> blue blending into burgundy, like the logo's G ring (see make_lut.py), for /projects
#         -> and as shot (silver) for the menu background
# Each gets a desktop cut 1920 wide and an upright cut for phones, at 24 fps.
set -euo pipefail
HERO=$1
TUNNEL=$2
python3 make_lut.py
OUT=../../public/brand
GRADE="format=gbrp,split[a][b];[a]lut3d=blue.cube[blue];[b]lut3d=burgundy.cube[burgundy];[1:v]format=gbrp[mask];[blue][burgundy][mask]maskedmerge"

# encode <name> <filter> <ffmpeg inputs...>
# Quality-based compression (CRF) capped at 4 Mbps (the tunnel original is only ~6 Mbps, so
# more than that just adds file size): every frame gets the data it needs, so the smooth metal
# gradients stay clean instead of breaking into blocks.
encode() {
  local name=$1 filter=$2
  shift 2
  ffmpeg -v error -y "$@" -filter_complex "$filter,setsar=1,format=yuv420p" -an -threads 2 \
    -c:v libx264 -preset slow -crf 20 -maxrate 4M -bufsize 8M -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y "$@" -filter_complex "$filter,setsar=1,format=yuv420p" -an -threads 2 \
    -c:v libvpx-vp9 -crf 30 -b:v 4M -row-mt 1 -deadline good -cpu-used 2 "$OUT/$name.webm"
  ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -quality 80 "$OUT/$name-poster.webp"
  echo "$name done"
}

encode hero-towers "[0:v]fps=24,hue=s=0,scale=1920:1012" -i "$HERO"
encode hero-towers-portrait "[0:v]fps=24,hue=s=0,crop=1000:2160:1000:0,scale=720:1556" -i "$HERO"

duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TUNNEL")
encode projects-tunnel "[0:v]fps=24,$GRADE" -i "$TUNNEL" -loop 1 -t "$duration" -i mask-1920x1080.png
encode projects-tunnel-portrait "[0:v]fps=24,crop=500:1080,scale=600:1296,$GRADE" -i "$TUNNEL" -loop 1 -t "$duration" -i mask-600x1296.png
# menu: the same tunnel in its original silver (no grade), behind the menu panel
encode menu-tunnel "[0:v]fps=24" -i "$TUNNEL"
encode menu-tunnel-portrait "[0:v]fps=24,crop=500:1080,scale=600:1296" -i "$TUNNEL"
echo all done
