// Renders frames of the fin sculpture: node renderframes.cjs <tone> <outDir> <frames> [size]
// frames = 1 → just a preview pair (phase 0 and 0.5).
const { chromium } = require('playwright');
(async () => {
  const [tone, out, framesArg, sizeArg] = process.argv.slice(2);
  const frames = +framesArg, size = +(sizeArg || 1200);
  const b = await chromium.launch({ args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: size, height: size } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(`http://127.0.0.1:8765/index.html?tone=${tone}&size=${size}`);
  await p.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
  const canvas = await p.$('canvas');
  const phases = frames === 1 ? [0, 0.5] : Array.from({ length: frames }, (_, i) => i / frames);
  for (let i = 0; i < phases.length; i++) {
    await p.evaluate(ph => window.renderFrame(ph), phases[i]);
    await canvas.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.png` });
  }
  console.log('done', phases.length, 'errors', JSON.stringify(errors));
  await b.close();
})();
