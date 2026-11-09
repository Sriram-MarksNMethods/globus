"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gDashes } from "./gDashes";

/*
  The Globus G as plain plum and orange blocks, told by scrolling through the (tall) section this sits in
  (sticky inside it):
  1. The flat logo seen from straight above; the view lowers to an angle as the blocks rise,
     climbing round the G from the low crossbar to the tall orange tip.
  2. The view swings round to the crossbar and drops close to the ground, looking up into the towers.

  Only draws while on screen.
*/

// Middle of the G in the logo's own units (the viewBox is 3.18 1 100 100).
const CENTRE = { x: 53.18, y: 51 };

// 0..1 between two points of the scroll, eased in and out.
function stage(progress: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export function GStreet({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.6;
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);

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
    const logo = new THREE.Group();
    const loader = new SVGLoader();
    // order: 0 at the crossbar to 1 at the tip of the orange arc, going clockwise.
    const blocks: { mesh: THREE.Mesh; height: number; order: number }[] = [];
    gDashes.forEach((dash) => {
      const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${dash.d}"/></svg>`);
      paths[0].toShapes().forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
        geometry.computeBoundingBox();
        const middle = geometry.boundingBox!.getCenter(new THREE.Vector3());
        const mesh = new THREE.Mesh(geometry, materials[dash.color]);
        mesh.castShadow = true;
        logo.add(mesh);
        // Counted from just above the crossbar, which sits a hair above the middle.
        const angle = Math.atan2(middle.y - CENTRE.y, middle.x - CENTRE.x);
        blocks.push({ mesh, height: 3, order: ((angle + 0.35 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) });
      });
    });
    logo.scale.set(1, -1, 1);
    logo.position.set(-CENTRE.x, CENTRE.y, 0);
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
      const rise = stage(progress, 0, 0.5); // blocks grow, view lowers to an angle
      const drop = stage(progress, 0.5, 1); // view swings to the crossbar and drops close to the ground

      const elevation = Math.PI / 2 - rise * (Math.PI / 2 - 0.73) - drop * 0.6;
      const swing = drop * (Math.PI / 2);
      const distance = 255 - drop * 120;
      camera.position.set(Math.sin(swing) * Math.cos(elevation) * distance, Math.sin(elevation) * distance, Math.cos(swing) * Math.cos(elevation) * distance + 0.01);
      camera.lookAt(0, 8 * rise + drop * 22, 0);

      blocks.forEach((block) => {
        const target = 3 + (4 + 46 * block.order - 3) * rise;
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
      logo.children.forEach((child) => (child as THREE.Mesh).geometry.dispose());
      [materials.plum, materials.orange, groundGeometry, groundMaterial, environment].forEach((item) => item.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
