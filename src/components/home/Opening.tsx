"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gDashes } from "@/components/brand/gDashes";

/*
  Homepage opening (replaces the old logo film). The page starts at street level among the Globus G's
  dashes standing as plum and orange towers. Scrolling through this tall section (the screen stays put):
  1. the view rises and swings back above the G while the towers sink flat, until it is the logo's G seen from above;
  2. the view pulls back and the G slides left to make room, the rest of the logo fades in beside it
     (the 3D G hands over to the real logo file here, so the logo is exact);
  3. the whole logo shrinks and flies into its place in the header, which then takes over.
  Scrolling back up plays it in reverse, until the section has scrolled right off the top: then it is removed and the
  towers hero becomes the top of the page. It stays gone when coming back to the homepage from another page, and only
  plays again after a refresh or in a new tab.
  Without WebGL the logo simply sits in the middle and still flies to the header.
*/

// Lives as long as the page does: a refresh or a new tab starts it again.
let playedThisVisit = false;

// Middle of the G in the logo's own units: the G fills 3.18–103.18 across and 1–101 down of the
// 300 × 102 logo (the same box as src/app/icon.svg).
const CENTRE = { x: 53.18, y: 51 };
const LOGO = { width: 300, height: 102, gLeft: 3.18, gTop: 1 };
const GROW_ON_LOAD = 1800; // ms for the towers to rise when the page opens

// The steps, as parts of the scroll through the section (0..1).
const STEPS = { flatten: [0.04, 0.55], pullBack: [0.55, 0.75], handOver: [0.72, 0.8], fly: [0.8, 1] } as const;

// 0..1 between two points of the scroll, eased in and out.
function stage(progress: number, [from, to]: readonly [number, number]) {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return t * t * (3 - 2 * t);
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(playedThisVisit);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (gone) return;
    const section = sectionRef.current!;
    const holder = canvasHolderRef.current!;
    const logo = logoRef.current!;
    const hint = hintRef.current!;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The header logo stays hidden until our logo lands on it.
    delete root.dataset.intro;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      holder.appendChild(renderer.domElement);
    } catch {
      renderer = null; // no WebGL: the plain logo is shown instead (see below)
    }

    const scene = new THREE.Scene();
    const environment = renderer ? new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture : null;
    scene.environment = environment;
    scene.environmentIntensity = 0.6;
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 6000);

    // Sun from the top left, casting soft shadows onto an invisible ground.
    const sun = new THREE.DirectionalLight("#ffffff", 2.2);
    sun.position.set(-80, 160, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90 });
    scene.add(sun);
    const groundGeometry = new THREE.PlaneGeometry(400, 400);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.12 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const materials = {
      plum: new THREE.MeshStandardMaterial({ color: "#351530", roughness: 0.55 }),
      orange: new THREE.MeshStandardMaterial({ color: "#f04e37", roughness: 0.55 }),
    };

    // One block per dash, 1 unit tall; its height is set through scale.z. The logo is flipped (SVG y points down),
    // centred, then laid flat so the blocks grow upwards.
    const g = new THREE.Group();
    const loader = new SVGLoader();
    // stairs: the tower's full height, climbing clockwise from the low crossbar to the tall orange tip.
    const blocks: { mesh: THREE.Mesh; stairs: number }[] = [];
    gDashes.forEach((dash) => {
      const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${dash.d}"/></svg>`);
      paths[0].toShapes().forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
        geometry.computeBoundingBox();
        const middle = geometry.boundingBox!.getCenter(new THREE.Vector3());
        const mesh = new THREE.Mesh(geometry, materials[dash.color]);
        mesh.castShadow = true;
        g.add(mesh);
        // Counted from just above the crossbar, which sits a hair above the middle.
        const angle = Math.atan2(middle.y - CENTRE.y, middle.x - CENTRE.x);
        const order = ((angle + 0.35 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
        blocks.push({ mesh, stairs: 4 + 46 * order });
      });
    });
    g.scale.set(1, -1, 1);
    g.position.set(-CENTRE.x, CENTRE.y, 0);
    const plan = new THREE.Group();
    plan.add(g);
    plan.rotation.x = -Math.PI / 2;
    scene.add(plan);

    // Upright screens get a wider lens, so they see about as much across as a wide screen does.
    let tanHalf = Math.tan((15 * Math.PI) / 180);
    function resize() {
      const { width, height } = holder.getBoundingClientRect();
      renderer?.setSize(width, height);
      camera.aspect = width / height;
      camera.fov = camera.aspect < 1 ? (2 * Math.atan((Math.tan((15 * Math.PI) / 180) / camera.aspect) * 0.8) * 180) / Math.PI : 30;
      tanHalf = Math.tan((camera.fov * Math.PI) / 360);
      camera.updateProjectionMatrix();
    }

    // Camera and tower heights for a point in the scroll.
    // flatten: 0 = street level among the towers (the end of the "J10" trial), 1 = straight above the flat G.
    // pullBack: 0 = above the G, 1 = far enough back that the whole logo fits, centred on where the logo's middle will be.
    function pose(progress: number) {
      const flatten = stage(progress, STEPS.flatten);
      const up = 1 - stage(flatten, [0, 0.5]); // first the view climbs and swings back…
      const rise = 1 - stage(flatten, [0.5, 1]); // …then the towers sink and the view turns straight down
      const pullBack = stage(progress, STEPS.pullBack);
      // Fit the whole logo: 62% of the width and half the height of the screen.
      const fitDistance = Math.max(255, LOGO.width / (0.62 * 2 * tanHalf * camera.aspect), LOGO.height / (0.5 * 2 * tanHalf));
      const elevation = Math.PI / 2 - rise * (Math.PI / 2 - 0.73) - up * 0.6;
      const swing = up * (Math.PI / 2);
      const distance = mix(255 - up * 120, fitDistance, pullBack);
      const lookX = pullBack * (LOGO.width / 2 - CENTRE.x); // the logo's middle, to the right of the G
      return {
        rise,
        position: new THREE.Vector3(
          lookX + Math.sin(swing) * Math.cos(elevation) * distance,
          Math.sin(elevation) * distance,
          Math.cos(swing) * Math.cos(elevation) * distance + 0.01,
        ),
        look: new THREE.Vector3(lookX, 8 * rise + up * 22, 0),
      };
    }

    // Where the logo sits on screen once the view has pulled back: project the flat G's box (its top face, 3 units up).
    function centredLogoBox() {
      const final = camera.clone();
      const { position, look } = pose(STEPS.pullBack[1]);
      final.position.copy(position);
      final.lookAt(look);
      final.updateMatrixWorld();
      const { width, height } = holder.getBoundingClientRect();
      const toScreen = (x: number, z: number) => {
        const point = new THREE.Vector3(x, 3, z).project(final);
        return { x: ((point.x + 1) / 2) * width, y: ((1 - point.y) / 2) * height };
      };
      const topLeft = toScreen(-50, -50);
      const bottomRight = toScreen(50, 50);
      const pixelsPerUnit = (bottomRight.x - topLeft.x) / 100;
      return {
        left: topLeft.x - LOGO.gLeft * pixelsPerUnit,
        top: topLeft.y - LOGO.gTop * pixelsPerUnit,
        width: LOGO.width * pixelsPerUnit,
      };
    }

    resize();
    let centred = centredLogoBox();
    function onResize() {
      resize();
      centred = centredLogoBox();
    }
    window.addEventListener("resize", onResize);

    const openedAt = performance.now();
    let frame = 0;
    let docked = false;
    function draw() {
      const box = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -box.top / (box.height - window.innerHeight)));
      const grown = reduceMotion ? 1 : stage(performance.now() - openedAt, [0, GROW_ON_LOAD]);

      // 3D G
      if (renderer) {
        const { rise, position, look } = pose(progress);
        camera.position.copy(position);
        camera.lookAt(look);
        blocks.forEach((block) => (block.mesh.scale.z = 3 + (block.stairs - 3) * rise * grown));
        renderer.render(scene, camera);
        holder.style.opacity = String(1 - stage(progress, STEPS.handOver));
      }

      // The logo file: fades in over the 3D G (shown from the start without WebGL), then flies to the header.
      const handOver = renderer ? stage(progress, STEPS.handOver) : 1;
      const fly = stage(progress, STEPS.fly);
      const target = document.querySelector("[data-header-logo]")?.getBoundingClientRect();
      const to = target ? { left: target.left, top: target.top, width: target.width } : centred;
      logo.style.opacity = String(progress >= 1 ? 0 : handOver);
      logo.style.width = `${mix(centred.width, to.width, fly)}px`;
      logo.style.transform = `translate(${mix(centred.left, to.left, fly)}px, ${mix(centred.top, to.top, fly)}px)`;
      hint.style.opacity = String(1 - stage(progress, [0, 0.04]));

      // Hand over to the header logo once ours has landed (and take it back when scrolling up).
      if (progress >= 1 !== docked) {
        docked = progress >= 1;
        if (docked) root.dataset.intro = "done";
        else delete root.dataset.intro;
      }
      frame = requestAnimationFrame(draw);
    }

    // Only run while the section is on screen. Once it has scrolled right off the top, take it out of the page
    // and move the scroll up by its height in the same frame, so what is on screen doesn't move.
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) draw();
      else if (entry.boundingClientRect.top < 0) {
        root.dataset.intro = "done";
        logo.style.opacity = "0";
        const y = window.scrollY - section.offsetHeight;
        section.style.display = "none";
        lenisRef.current?.scrollTo(y, { immediate: true, force: true });
        window.scrollTo(0, y);
        playedThisVisit = true;
        setGone(true);
      }
    });
    visibility.observe(section);

    return () => {
      visibility.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      // Other pages show the header logo straight away.
      root.dataset.intro = "done";
      g.children.forEach((child) => (child as THREE.Mesh).geometry.dispose());
      [materials.plum, materials.orange, groundGeometry, groundMaterial].forEach((item) => item.dispose());
      environment?.dispose();
      if (renderer) {
        renderer.dispose();
        holder.removeChild(renderer.domElement);
      }
    };
  }, [gone]);

  if (gone) return null;

  return (
    <section ref={sectionRef} aria-label="Globus Developers" className="relative h-[400svh] bg-[#e2e2e2]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={canvasHolderRef} aria-hidden="true" className="absolute inset-0" />
        <div ref={hintRef} aria-hidden="true" className="absolute inset-x-0 bottom-5 flex justify-center">
          <span className="text-small rounded-[5px] bg-white/80 px-3 py-2">Scroll</span>
        </div>
      </div>
      {/* The logo file, fixed to the screen so it can fly up to the header */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src="/brand/globus-logo-dark.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-auto max-w-none opacity-0"
      />
    </section>
  );
}
