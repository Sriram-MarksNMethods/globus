"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gDashes } from "./gDashes";

/*
  The Globus G as towers, told by scrolling through the (tall) section this sits in (sticky inside it):
  1. The flat logo seen from straight above; the view lowers to an angle as the towers rise,
     climbing round the G from the low crossbar to the tall orange tip.
  2. The view swings round to the crossbar and drops to the ground, looking up through a wider lens,
     while the towers keep growing past the top of the screen.
  A low sun behind the towers leaves their faces in shadow and throws long shadows towards you.

  mood  day  = light grey haze
        dusk = dark, warm low sun

  Only draws while on screen.
*/
type Mood = "day" | "dusk";

const PLUM = new THREE.Color("#351530");
const ORANGE = new THREE.Color("#f04e37");
// Middle of the G in the logo's own units (the viewBox is 3.18 1 100 100).
const CENTRE = { x: 53.18, y: 51 };

const MOODS = {
  day: { sky: "#e2e2e2", sun: "#ffffff", sunStrength: 2.6, fill: 0.45, fogNear: 260, fogFar: 700 },
  dusk: { sky: "#121116", sun: "#ff9a5c", sunStrength: 4.5, fill: 0.12, fogNear: 200, fogFar: 520 },
};

// 0..1 between two points of the scroll, eased in and out.
function stage(progress: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export function GTowers({ mood = "day", className = "" }: { mood?: Mood; className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const settings = MOODS[mood];
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.sky);
    scene.fog = new THREE.Fog(settings.sky, settings.fogNear, settings.fogFar);
    const environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = settings.fill;
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);

    // Low sun behind the towers (the camera ends up on the opposite side), long soft shadows.
    const sun = new THREE.DirectionalLight(settings.sun, settings.sunStrength);
    sun.position.set(-260, 150, -110);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -240, right: 240, top: 240, bottom: -240, near: 1, far: 900 });
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // Ground: only shadows in the day; a dark floor that catches the warm light at dusk.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      mood === "day" ? new THREE.ShadowMaterial({ opacity: 0.22 }) : new THREE.MeshStandardMaterial({ color: "#1d1b21", roughness: 0.95 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // One block per dash, 1 unit tall; its height is set through scale.z. The logo is flipped (SVG y points down),
    // centred, then laid flat so the blocks grow upwards.
    const logo = new THREE.Group();
    const loader = new SVGLoader();
    // order: 0 at the crossbar to 1 at the tip of the orange arc, going clockwise.
    const blocks: { mesh: THREE.Mesh; height: number; order: number }[] = [];
    const materials = {
      plum: new THREE.MeshStandardMaterial({ color: PLUM, roughness: 0.5 }),
      orange: new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.5 }),
    };
    gDashes.forEach((dash) => {
      const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${dash.d}"/></svg>`);
      paths[0].toShapes().forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
        geometry.computeBoundingBox();
        const middle = geometry.boundingBox!.getCenter(new THREE.Vector3());
        const mesh = new THREE.Mesh(geometry, materials[dash.color]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        logo.add(mesh);
        // Counted from just above the crossbar, which sits a hair above the middle.
        const order = ((Math.atan2(middle.y - CENTRE.y, middle.x - CENTRE.x) + 0.35 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
        blocks.push({ mesh, height: 3, order });
      });
    });
    logo.scale.set(1, -1, 1);
    logo.position.set(-53.18, 51, 0);
    const plan = new THREE.Group();
    plan.add(logo);
    plan.rotation.x = -Math.PI / 2;
    scene.add(plan);

    function resize() {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // How far through the tall section we are, 0..1 (this sits in a sticky box inside it).
    function scrollProgress() {
      const section = mount.parentElement!.parentElement!;
      const box = section.getBoundingClientRect();
      return Math.min(1, Math.max(0, -box.top / (box.height - window.innerHeight)));
    }

    let frame = 0;
    function draw() {
      const progress = scrollProgress();
      const rise = stage(progress, 0, 0.4); // towers up to the stairs skyline, view lowers to an angle
      const drop = stage(progress, 0.4, 1); // view swings to the crossbar and drops to the ground; towers keep growing

      const elevation = Math.PI / 2 - rise * (Math.PI / 2 - 0.73) - drop * 0.7;
      const swing = drop * (Math.PI / 2);
      const distance = 255 - drop * 160;
      camera.fov = 30 + drop * 32;
      camera.updateProjectionMatrix();
      camera.position.set(Math.sin(swing) * Math.cos(elevation) * distance, Math.sin(elevation) * distance, Math.cos(swing) * Math.cos(elevation) * distance + 0.01);
      camera.lookAt(0, 8 * rise + drop * 62, 0);

      const growth = 1 + drop * 1.7;
      blocks.forEach((block) => {
        const target = 3 + (4 + 46 * block.order - 3) * rise * growth;
        block.height += (target - block.height) * 0.2;
        block.mesh.scale.z = block.height;
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
      renderer.dispose();
      environment.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [mood]);

  return <div ref={mountRef} className={className} />;
}
