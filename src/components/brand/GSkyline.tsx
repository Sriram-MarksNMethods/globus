"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gDashes } from "./gDashes";

/*
  J: the G laid flat like a site plan, each dash a block, seen from above at an angle.

  look   colour = matte plum and orange blocks
         clay   = white architect's model; blocks take on the logo colours as they rise
         night  = dark blocks that glow in the logo colours as they rise
         glass  = tinted glass blocks
  rise   pointer = blocks near the pointer rise into towers and sink back
         stairs  = a fixed skyline climbing round the G from the crossbar; the view swings a little with the pointer
         scroll  = driven by scrolling through the (tall) parent section, told as one of these stories:
           rise     the flat plan seen from straight above grows into the stairs skyline as the view lowers to an angle
           orbit    the same, while the view also travels a third of the way round the G
           stagger  the view lowers first, then the towers go up one after another round the ring, like construction
           street   the skyline grows, then the view swings to the crossbar and drops close to the ground so the towers loom overhead
           finish   a white model grows, then the colour fills in tower by tower
           reverse  starts as the skyline at an angle and ends as the flat logo seen from straight above

  Only draws while on screen.
*/
type Look = "colour" | "clay" | "night" | "glass";
type Rise = "pointer" | "stairs" | "scroll";
type Story = "rise" | "orbit" | "stagger" | "street" | "finish" | "reverse";

// 0..1 between two points of the scroll, eased in and out.
function stage(progress: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

const PLUM = new THREE.Color("#351530");
const ORANGE = new THREE.Color("#f04e37");
const CLAY = new THREE.Color("#f3f0eb");
// Middle of the G in the logo's own units (the viewBox is 3.18 1 100 100).
const CENTRE = { x: 53.18, y: 51 };

function makeMaterial(look: Look, brand: THREE.Color) {
  if (look === "clay") return new THREE.MeshStandardMaterial({ color: CLAY.clone(), roughness: 0.9 });
  // Plum is too dark to glow, so night uses a lighter plum.
  if (look === "night")
    return new THREE.MeshStandardMaterial({ color: "#16161c", roughness: 0.6, emissive: brand === PLUM ? new THREE.Color("#8c3a7e") : brand.clone(), emissiveIntensity: 0.15 });
  // Glass: clear surface, the colour comes from inside (deeper blocks look darker).
  if (look === "glass")
    return new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.12, transmission: 1, thickness: 20, ior: 1.5, attenuationColor: brand.clone(), attenuationDistance: 14, clearcoat: 1 });
  return new THREE.MeshStandardMaterial({ color: brand.clone(), roughness: 0.55 });
}

export function GSkyline({
  look = "colour",
  rise = "pointer",
  story = "rise",
  className = "",
}: {
  look?: Look;
  rise?: Rise;
  story?: Story;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = look !== "night";
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = look === "night" ? 0.08 : look === "glass" ? 1.4 : 0.6;
    // Glass needs something behind it to bend: the section's own grey.
    if (look === "glass") scene.background = new THREE.Color("#e2e2e2");
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);

    // Sun from the top left, casting soft shadows onto an invisible ground.
    const sun = new THREE.DirectionalLight("#ffffff", look === "night" ? 0.3 : 2.2);
    sun.position.set(-80, 160, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90 });
    scene.add(sun);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: look === "clay" ? 0.18 : 0.12 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // One block per dash, 1 unit tall; its height is set through scale.z. The logo is flipped (SVG y points down),
    // centred, then laid flat so the blocks grow upwards.
    const logo = new THREE.Group();
    const loader = new SVGLoader();
    // order: 0 at the crossbar to 1 at the tip of the orange arc, going clockwise.
    type Block = { mesh: THREE.Mesh; material: THREE.MeshStandardMaterial; brand: THREE.Color; x: number; y: number; height: number; order: number; stairs: number };
    const blocks: Block[] = [];
    gDashes.forEach((dash) => {
      const brand = dash.color === "plum" ? PLUM : ORANGE;
      const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${dash.d}"/></svg>`);
      paths[0].toShapes().forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
        geometry.computeBoundingBox();
        const middle = geometry.boundingBox!.getCenter(new THREE.Vector3());
        const material = makeMaterial(look, brand);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        logo.add(mesh);
        // Stairs: lowest at the crossbar, climbing clockwise round the G to the tip of the orange arc
        // (counted from just above the crossbar, which sits a hair above the middle).
        const order = ((Math.atan2(middle.y - CENTRE.y, middle.x - CENTRE.x) + 0.35 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
        blocks.push({ mesh, material, brand, x: middle.x, y: middle.y, height: 3, order, stairs: 4 + 46 * order });
      });
    });
    logo.scale.set(1, -1, 1);
    logo.position.set(-53.18, 51, 0);
    const plan = new THREE.Group();
    plan.add(logo);
    plan.rotation.x = -Math.PI / 2;
    scene.add(plan);

    // Where the pointer meets the ground, in the logo's own units; and where it is across the box (-0.5..0.5).
    const raycaster = new THREE.Raycaster();
    const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    let pointer: { x: number; y: number } | null = null;
    const across = { x: 0, target: 0 };
    function onMove(event: PointerEvent) {
      const box = mount.getBoundingClientRect();
      const ndc = new THREE.Vector2(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
      across.target = ndc.x / 2;
      raycaster.setFromCamera(ndc, camera);
      pointer = raycaster.ray.intersectPlane(floor, hit) ? { x: hit.x + 53.18, y: hit.z + 51 } : null;
    }
    function onLeave() {
      pointer = null;
      across.target = 0;
    }
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    function resize() {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // Scroll mode: how far through the tall parent section we are, 0..1.
    function scrollProgress() {
      const section = mount.parentElement!.parentElement!;
      const box = section.getBoundingClientRect();
      return Math.min(1, Math.max(0, -box.top / (box.height - window.innerHeight)));
    }

    let frame = 0;
    function draw() {
      const progress = rise === "scroll" ? scrollProgress() : 1;

      // Camera, by default above and in front at an angle, swinging a little with the pointer in stairs mode.
      across.x += (across.target - across.x) * 0.04;
      let lowered = 1; // 0 = straight above, 1 = the usual angle
      let swing = rise === "stairs" ? across.x * 0.6 : 0;
      let distance = 255;
      let lookHeight = 8;
      if (rise === "scroll") {
        if (story === "stagger") lowered = stage(progress, 0, 0.3);
        else if (story === "reverse") lowered = 1 - stage(progress, 0.2, 1);
        else lowered = stage(progress, 0, story === "street" ? 0.5 : 1);
        if (story === "orbit") swing = -stage(progress, 0, 1) * ((Math.PI * 2) / 3);
        lookHeight = 8 * lowered;
        if (story === "street") {
          // Second half: swing round to the crossbar side (the low end, so the tall towers rise behind it)
          // and drop down close to the ground, looking up into the towers.
          const drop = stage(progress, 0.5, 1);
          swing = drop * (Math.PI / 2);
          distance = 255 - drop * 120;
          lookHeight += drop * 22;
        }
      }
      let elevation = Math.PI / 2 - lowered * (Math.PI / 2 - 0.73);
      if (rise === "scroll" && story === "street") elevation -= stage(progress, 0.5, 1) * 0.6;
      camera.position.set(Math.sin(swing) * Math.cos(elevation) * distance, Math.sin(elevation) * distance, Math.cos(swing) * Math.cos(elevation) * distance + 0.01);
      camera.lookAt(0, lookHeight, 0);

      blocks.forEach((block) => {
        const distanceToPointer = pointer ? Math.hypot(block.x - pointer.x, block.y - pointer.y) : Infinity;
        const near = Math.max(0, 1 - distanceToPointer / 35);
        let target: number;
        if (rise === "pointer") target = 3 + 37 * near;
        else if (rise === "stairs") target = block.stairs + 10 * near;
        else {
          // How grown this tower is in the scroll story, 0..1.
          let grown: number;
          if (story === "stagger") grown = stage(progress, 0.25 + block.order * 0.6, 0.4 + block.order * 0.6);
          else if (story === "street") grown = stage(progress, 0, 0.5);
          else if (story === "finish") grown = stage(progress, 0, 0.55);
          else if (story === "reverse") grown = 1 - stage(progress, 0, 0.8);
          else grown = stage(progress, 0, 1);
          target = 3 + (block.stairs - 3) * grown;
        }
        block.height += (target - block.height) * (rise === "scroll" ? 0.2 : 0.06);
        block.mesh.scale.z = block.height;

        // How risen this block is, 0..1, drives the colour in clay and the glow at night.
        const risen = Math.min(1, Math.max(0, (block.height - 3) / 37));
        if (look === "clay") {
          // Finish story: colour fills in tower by tower over the last part of the scroll.
          const colour = rise === "scroll" && story === "finish" ? stage(progress, 0.55 + block.order * 0.35, 0.65 + block.order * 0.35) : rise === "pointer" ? risen : near;
          block.material.color.copy(CLAY).lerp(block.brand, colour);
        }
        if (look === "night") block.material.emissiveIntensity = 0.15 + (rise === "pointer" ? risen : 0.35 + near * 0.65) * 1.6;
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    }
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) draw();
    });
    visibility.observe(mount);

    return () => {
      visibility.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      renderer.dispose();
      environment.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [look, rise, story]);

  return <div ref={mountRef} className={className} />;
}
