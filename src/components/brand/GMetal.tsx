"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gDashes } from "./gDashes";

/*
  D: the G as 22 solid metal blades (the logo's dashes, extruded).
  Plum blades are dark polished metal, the orange arc is copper. It turns slowly towards the pointer
  and catches the light; with no pointer it rests facing you, slightly angled.
  Only draws while on screen.
*/
export function GMetal({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);
    camera.position.set(0, 0, 230);

    const materials = {
      plum: new THREE.MeshPhysicalMaterial({ color: "#4a2342", metalness: 1, roughness: 0.28, clearcoat: 0.6 }),
      orange: new THREE.MeshPhysicalMaterial({ color: "#f0603f", metalness: 1, roughness: 0.25, clearcoat: 0.6 }),
    };

    // Build the blades from the logo paths. SVG y points down, so the group is flipped and centred on the G's middle.
    const logo = new THREE.Group();
    const loader = new SVGLoader();
    gDashes.forEach((dash) => {
      const { paths } = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${dash.d}"/></svg>`);
      paths[0].toShapes().forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 8, bevelEnabled: true, bevelSize: 0.6, bevelThickness: 0.8, bevelSegments: 3 });
        logo.add(new THREE.Mesh(geometry, materials[dash.color]));
      });
    });
    logo.scale.set(1, -1, 1);
    logo.position.set(-53.18, 51, -4);
    const pivot = new THREE.Group();
    pivot.add(logo);
    scene.add(pivot);

    // Pointer → target tilt (at most ~0.45 rad); the G eases towards it every frame.
    const target = { x: 0.12, y: -0.25 };
    function onMove(event: PointerEvent) {
      const box = mount.getBoundingClientRect();
      target.y = ((event.clientX - box.left) / box.width - 0.5) * 0.9;
      target.x = ((event.clientY - box.top) / box.height - 0.5) * 0.9;
    }
    function onLeave() {
      target.x = 0.12;
      target.y = -0.25;
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

    let frame = 0;
    function draw() {
      pivot.rotation.x += (target.x - pivot.rotation.x) * 0.04;
      pivot.rotation.y += (target.y - pivot.rotation.y) * 0.04;
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
  }, []);

  return <div ref={mountRef} className={className} />;
}
