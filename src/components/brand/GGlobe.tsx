"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
  K: Globus as a globe. About 600 short dashes (the logo's dash, small) laid along the lines of latitude
  of a sphere: orange over the northern cap like the logo's top arc, plum below.
  It turns very slowly by itself; drag it to spin it, and it coasts to a stop. Only draws while on screen.
*/
export function GGlobe({ className = "" }: { className?: string }) {
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
    const sun = new THREE.DirectionalLight("#ffffff", 1.6);
    sun.position.set(-60, 80, 100);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);
    camera.position.set(0, 0, 230);

    // Place the dashes: rings every 11° of latitude, as many dashes per ring as fit at that width.
    const radius = 50;
    const placements: { matrix: THREE.Matrix4; north: boolean }[] = [];
    for (let latitude = -77; latitude <= 77; latitude += 11) {
      const lat = (latitude * Math.PI) / 180;
      const count = Math.max(6, Math.round(Math.cos(lat) * 44));
      for (let step = 0; step < count; step++) {
        const lon = (step / count) * Math.PI * 2 + (latitude / 11) * 0.12;
        const normal = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
        const east = new THREE.Vector3(Math.cos(lon), 0, -Math.sin(lon));
        const north = new THREE.Vector3().crossVectors(normal, east);
        const matrix = new THREE.Matrix4().makeBasis(east, north, normal).setPosition(normal.clone().multiplyScalar(radius));
        placements.push({ matrix, north: latitude > 0 });
      }
    }
    const dashes = new THREE.InstancedMesh(
      new THREE.BoxGeometry(4.2, 1.5, 1.5),
      new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.3 }),
      placements.length,
    );
    const plum = new THREE.Color("#351530");
    const orange = new THREE.Color("#f04e37");
    placements.forEach((placement, index) => {
      dashes.setMatrixAt(index, placement.matrix);
      dashes.setColorAt(index, placement.north ? orange : plum);
    });
    const globe = new THREE.Group();
    globe.add(dashes);
    globe.rotation.x = 0.35;
    scene.add(globe);

    // Drag to spin; the spin slows down by itself back to the slow idle turn.
    const idleSpin = 0.0015;
    let spin = idleSpin;
    let dragging = false;
    let lastX = 0;
    function onDown(event: PointerEvent) {
      dragging = true;
      lastX = event.clientX;
      mount.setPointerCapture(event.pointerId);
    }
    function onMove(event: PointerEvent) {
      if (!dragging) return;
      spin = (event.clientX - lastX) * 0.004;
      lastX = event.clientX;
    }
    function onUp() {
      dragging = false;
    }
    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("pointercancel", onUp);

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
      globe.rotation.y += spin;
      if (!dragging) spin += (idleSpin - spin) * 0.03;
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
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("pointercancel", onUp);
      renderer.dispose();
      environment.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`cursor-grab touch-pan-y active:cursor-grabbing ${className}`} />;
}
