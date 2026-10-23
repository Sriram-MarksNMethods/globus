"""
Turns the transparent Blender frames into the two site videos.

  python3 encode.py <frames_dir> <public_brand_dir>

- light: frames placed on pure white  → fins-light.webm / .mp4
- dark:  the same frames, slightly dimmed, on pure black → fins-dark.webm / .mp4
"""

import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageEnhance

frames_dir, out_dir = sys.argv[1], sys.argv[2]
frames = sorted(f for f in os.listdir(frames_dir) if f.endswith(".png"))
print(len(frames), "frames")

with tempfile.TemporaryDirectory() as work:
    for tone in ("light", "dark"):
        tone_dir = os.path.join(work, tone)
        os.makedirs(tone_dir)
        for name in frames:
            frame = Image.open(os.path.join(frames_dir, name)).convert("RGBA")
            if tone == "light":
                background = Image.new("RGBA", frame.size, (255, 255, 255, 255))
            else:
                # Slightly dimmed so the colours sit calmly behind the tiles; keep the transparency.
                rgb = ImageEnhance.Brightness(frame.convert("RGB")).enhance(0.8)
                frame = Image.merge("RGBA", (*rgb.split(), frame.split()[3]))
                background = Image.new("RGBA", frame.size, (0, 0, 0, 255))
            background.alpha_composite(frame)
            background.convert("RGB").save(os.path.join(tone_dir, name))

        pattern = os.path.join(tone_dir, "f%04d.png")
        mp4 = os.path.join(out_dir, f"fins-{tone}.mp4")
        webm = os.path.join(out_dir, f"fins-{tone}.webm")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "24", "-i", pattern,
                        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
                        "-movflags", "+faststart", mp4], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-c:v", "libvpx-vp9", "-b:v", "0",
                        "-crf", "34", "-row-mt", "1", "-an", webm], check=True)
        print(tone, os.path.getsize(mp4) // 1024, "KB mp4,", os.path.getsize(webm) // 1024, "KB webm")
