# Fin sculpture video

The spiral on the site is a pre-rendered video (`public/brand/fins-light.*`, `fins-dark.*`),
not live 3D, so it plays smoothly everywhere. This folder re-creates those videos.

1. Put three.js next to `index.html`:
   `npm i three@0.180.0` in a scratch folder, then copy `node_modules/three/build/three.module.js`,
   `three.core.js` into `three/build/`, and `examples/jsm/geometries/RoundedBoxGeometry.js`,
   `examples/jsm/environments/RoomEnvironment.js` into `three/jsm/...` (same paths as the imports).
2. Serve this folder: `python3 -m http.server 8765 --bind 127.0.0.1`
3. Render frames (needs Playwright): `node render-frames.cjs light ./frames-light 384 1080`
   (and `dark ./frames-dark`). 384 frames at 24 fps = a 16 s loop; fins turn half a turn, so it loops seamlessly.
4. Encode, from each frames folder:
   `ffmpeg -framerate 24 -i frames-light/f%04d.png -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart fins-light.mp4`
   `ffmpeg -i fins-light.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an fins-light.webm`

Shape settings (fin count, height, twist, spine curve) are at the top of the script in `index.html`.
