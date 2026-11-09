"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { G_VIEWBOX, gDashes } from "./gDashes";

/*
  Trial versions of an interactive Globus G (see /g-options).
  E: dashes point at the pointer like compass needles. F: the G builds itself as you scroll.
  G: the G as fine dots that scatter from the pointer. H: a ripple runs round the ring.
  I: a spotlight reveals the coloured G over an outline. L: dashes flip like a building's louvres.
  M: project renders seen through the G. N: dashes you can drag out; they spring back.
  (D, the 3D metal G, lives in GMetal.tsx; J, the 3D towers, in GSkyline.tsx; K, the globe, in GGlobe.tsx.)
*/

const COLORS = { plum: "#351530", orange: "#f04e37" };
// Middle of the G in the logo's own units (the viewBox is 3.18 1 100 100).
const CENTRE = { x: 53.18, y: 51 };

/* Where each dash sits (its middle), measured once from the drawn paths. */
function useDashCentres(svgRef: React.RefObject<SVGSVGElement | null>) {
  const [centres, setCentres] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll("path");
    if (!paths) return;
    setCentres(
      Array.from(paths).map((path) => {
        const box = path.getBBox();
        return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      }),
    );
  }, [svgRef]);
  return centres;
}

/* Angle (degrees) of a point seen from the middle of the G. */
function angleFrom(from: { x: number; y: number }, to: { x: number; y: number }) {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}

/* ------------------------------------------------------------------ E: Compass */
/* Every dash turns on its own middle to point at the pointer; when the pointer leaves they all swing back into the G. */
export function GCompass({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const centres = useDashCentres(svgRef);
  const [turns, setTurns] = useState<number[]>([]);

  function onMove(event: React.PointerEvent) {
    const box = svgRef.current!.getBoundingClientRect();
    const pointer = {
      x: 3.18 + ((event.clientX - box.left) / box.width) * 100,
      y: 1 + ((event.clientY - box.top) / box.height) * 100,
    };
    setTurns(
      centres.map((centre) => {
        // How far the dash must turn from its own direction (out from the middle) to face the pointer, -180..180.
        const turn = angleFrom(centre, pointer) - angleFrom(CENTRE, centre);
        return ((turn + 540) % 360) - 180;
      }),
    );
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={() => setTurns([])} className={`flex items-center justify-center ${className}`}>
      <svg ref={svgRef} viewBox={G_VIEWBOX} aria-hidden="true" className="aspect-square h-[min(60vh,80vw)] overflow-visible">
        {gDashes.map((dash, index) => (
          <path
            key={dash.d}
            d={dash.d}
            fill={COLORS[dash.color]}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: `rotate(${turns[index] ?? 0}deg)`,
              transition: "transform 900ms cubic-bezier(0.25, 0.74, 0.22, 0.99)",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ F: Build on scroll */
/* Pinned screen: the dashes start scattered far outside the G and slide into place, one after another, as you scroll. */
export function GBuild({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const centres = useDashCentres(svgRef);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  return (
    <div ref={sectionRef} className={`relative h-[250vh] ${className}`}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <svg ref={svgRef} viewBox={G_VIEWBOX} aria-hidden="true" className="aspect-square h-[min(60vh,80vw)] overflow-visible">
          {gDashes.map((dash, index) => (
            <BuildDash
              key={dash.d}
              d={dash.d}
              color={COLORS[dash.color]}
              progress={scrollYProgress}
              // Dashes arrive in the logo's order; the last one has landed at 80% of the scroll.
              start={(index / gDashes.length) * 0.5}
              outwards={centres[index] ? angleFrom(CENTRE, centres[index]) : 0}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function BuildDash({ d, color, progress, start, outwards }: { d: string; color: string; progress: MotionValue<number>; start: number; outwards: number }) {
  const travel = useTransform(progress, [start, start + 0.3], [80, 0], { clamp: true });
  const opacity = useTransform(progress, [start, start + 0.15], [0, 1], { clamp: true });
  const radians = (outwards * Math.PI) / 180;
  const x = useTransform(travel, (value) => Math.cos(radians) * value);
  const y = useTransform(travel, (value) => Math.sin(radians) * value);
  return <motion.path d={d} fill={color} style={{ x, y, opacity }} />;
}

/* ------------------------------------------------------------------ G: Dots */
/* The G drawn as ~2,000 fine dots. Dots near the pointer drift away and ease back home. Canvas, only while on screen. */
export function GDots({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    const ratio = Math.min(window.devicePixelRatio, 2);
    type Dot = { homeX: number; homeY: number; x: number; y: number; color: string };
    let dots: Dot[] = [];
    let size = 0;
    const pointer = { x: -9999, y: -9999 };

    // Paint the G once off screen, then put a dot on every lit grid point.
    function layout() {
      const box = canvas.getBoundingClientRect();
      canvas.width = box.width * ratio;
      canvas.height = box.height * ratio;
      size = Math.min(box.height * 0.6, box.width * 0.8);
      const left = (box.width - size) / 2;
      const top = (box.height - size) / 2;
      const scratch = document.createElement("canvas");
      scratch.width = scratch.height = Math.round(size);
      const paint = scratch.getContext("2d")!;
      paint.scale(size / 100, size / 100);
      paint.translate(-3.18, -1);
      gDashes.forEach((dash) => {
        paint.fillStyle = COLORS[dash.color];
        paint.fill(new Path2D(dash.d));
      });
      const pixels = paint.getImageData(0, 0, scratch.width, scratch.height).data;
      const step = Math.max(4, Math.round(size / 110));
      dots = [];
      for (let y = 0; y < scratch.height; y += step) {
        for (let x = 0; x < scratch.width; x += step) {
          const at = (y * scratch.width + x) * 4;
          if (pixels[at + 3] < 128) continue;
          const color = `rgb(${pixels[at]},${pixels[at + 1]},${pixels[at + 2]})`;
          dots.push({ homeX: left + x, homeY: top + y, x: left + x, y: top + y, color });
        }
      }
    }

    let frame = 0;
    function draw() {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      const reach = size * 0.18;
      const radius = Math.max(1.2, size / 300);
      dots.forEach((dot) => {
        // Pushed away from the pointer, pulled back home; both gentle.
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < reach && distance > 0) {
          const push = (1 - distance / reach) * 6;
          dot.x += (dx / distance) * push;
          dot.y += (dy / distance) * push;
        }
        dot.x += (dot.homeX - dot.x) * 0.06;
        dot.y += (dot.homeY - dot.y) * 0.06;
        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    }

    function onMove(event: PointerEvent) {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    }
    function onLeave() {
      pointer.x = pointer.y = -9999;
    }

    layout();
    window.addEventListener("resize", layout);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) draw();
    });
    visibility.observe(canvas);
    return () => {
      visibility.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layout);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`size-full ${className}`} />;
}

/* ------------------------------------------------------------------ H: Ripple */
/* Moving onto the G sends one ripple round the ring, starting from the dash nearest the pointer:
   each dash slides out a little and back, one after another. */
export function GRipple({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const centres = useDashCentres(svgRef);
  const [ripple, setRipple] = useState<{ from: number; id: number } | null>(null);
  const busy = useRef(false);

  function onEnter(event: React.PointerEvent) {
    if (busy.current || centres.length === 0) return;
    const box = svgRef.current!.getBoundingClientRect();
    const pointer = {
      x: 3.18 + ((event.clientX - box.left) / box.width) * 100,
      y: 1 + ((event.clientY - box.top) / box.height) * 100,
    };
    let nearest = 0;
    centres.forEach((centre, index) => {
      if (Math.hypot(centre.x - pointer.x, centre.y - pointer.y) < Math.hypot(centres[nearest].x - pointer.x, centres[nearest].y - pointer.y)) nearest = index;
    });
    busy.current = true;
    setRipple({ from: nearest, id: Date.now() });
    setTimeout(() => (busy.current = false), 1600);
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg ref={svgRef} onPointerEnter={onEnter} viewBox={G_VIEWBOX} aria-hidden="true" className="aspect-square h-[min(60vh,80vw)] overflow-visible">
        {gDashes.map((dash, index) => {
          const centre = centres[index];
          const radians = centre ? Math.atan2(centre.y - CENTRE.y, centre.x - CENTRE.x) : 0;
          // Steps away from the starting dash, counted both ways round the ring.
          const steps = ripple ? Math.min(Math.abs(index - ripple.from), gDashes.length - Math.abs(index - ripple.from)) : 0;
          return (
            <motion.path
              key={`${dash.d}-${ripple?.id ?? 0}`}
              d={dash.d}
              fill={COLORS[dash.color]}
              // A new key per ripple remounts the dashes, so every ripple plays from the start.
              animate={ripple ? { x: [0, Math.cos(radians) * 6, 0], y: [0, Math.sin(radians) * 6, 0] } : undefined}
              transition={{ duration: 0.9, delay: steps * 0.06, ease: "easeInOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ I: Spotlight */
/* A fine grey outline of the G; a soft round spotlight follows the pointer and shows the full-colour G inside it. */
export function GSpotlight({ className = "" }: { className?: string }) {
  const areaRef = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent) {
    const box = areaRef.current!.getBoundingClientRect();
    areaRef.current!.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    areaRef.current!.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    areaRef.current!.style.setProperty("--spot-size", "22vmin");
  }

  return (
    <div
      ref={areaRef}
      onPointerMove={onMove}
      onPointerLeave={() => areaRef.current!.style.setProperty("--spot-size", "0vmin")}
      className={`[--spot-size:0vmin] ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox={G_VIEWBOX} aria-hidden="true" className="aspect-square h-[min(60vh,80vw)]">
          {gDashes.map((dash) => (
            <path key={dash.d} d={dash.d} fill="none" stroke="#b5b5b5" strokeWidth="0.25" />
          ))}
        </svg>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(circle var(--spot-size) at var(--spot-x) var(--spot-y), #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle var(--spot-size) at var(--spot-x) var(--spot-y), #000 55%, transparent 100%)",
        }}
      >
        <svg viewBox={G_VIEWBOX} aria-hidden="true" className="aspect-square h-[min(60vh,80vw)]">
          {gDashes.map((dash) => (
            <path key={dash.d} d={dash.d} fill={COLORS[dash.color]} />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ L: Louvres */
/* Each dash is a fin that turns on its own long axis, like the louvres on a facade.
   Fins near the pointer turn edge-on and show their darker side, then turn back. */
export function GLouvres({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const centres = useDashCentres(svgRef);
  const [turns, setTurns] = useState<number[]>([]);

  function onMove(event: React.PointerEvent) {
    const box = svgRef.current!.getBoundingClientRect();
    const pointer = {
      x: 3.18 + ((event.clientX - box.left) / box.width) * 100,
      y: 1 + ((event.clientY - box.top) / box.height) * 100,
    };
    setTurns(centres.map((centre) => 160 * Math.max(0, 1 - Math.hypot(centre.x - pointer.x, centre.y - pointer.y) / 28)));
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={() => setTurns([])} className={`flex items-center justify-center ${className}`}>
      <div className="relative aspect-square h-[min(60vh,80vw)] [perspective:900px]">
        {/* Hidden copy, only used to measure where each dash sits. */}
        <svg ref={svgRef} viewBox={G_VIEWBOX} aria-hidden="true" className="absolute inset-0 size-full opacity-0">
          {gDashes.map((dash) => (
            <path key={dash.d} d={dash.d} />
          ))}
        </svg>
        {gDashes.map((dash, index) => {
          const centre = centres[index];
          if (!centre) return null;
          // The fin's long axis points out from the middle of the G; it turns around that line.
          const radians = Math.atan2(centre.y - CENTRE.y, centre.x - CENTRE.x);
          const turn = turns[index] ?? 0;
          return (
            <svg
              key={dash.d}
              viewBox={G_VIEWBOX}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              style={{
                transformOrigin: `${centre.x - 3.18}% ${centre.y - 1}%`,
                transform: `rotate3d(${Math.cos(radians)}, ${Math.sin(radians)}, 0, ${turn}deg)`,
                transition: "transform 900ms cubic-bezier(0.25, 0.74, 0.22, 0.99)",
              }}
            >
              <path d={dash.d} fill={COLORS[dash.color]} style={{ filter: `brightness(${1 - (turn / 160) * 0.45})` }} />
            </svg>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ M: Window */
/* A large G cut out of the page like a window: Globus project renders show through the dashes,
   drifting gently against the pointer, and change every few seconds. */
const WINDOW_RENDERS = [
  { src: "/neo/towers-night-road.webp", alt: "Neo at dusk" },
  { src: "/projects/altus/towers-dusk.webp", alt: "Altus at dusk" },
  { src: "/projects/treasor/towers-dusk.webp", alt: "Treasor at dusk" },
  { src: "/projects/floresta/villa-front.webp", alt: "A villa at Floresta" },
];

export function GWindow({ className = "" }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const driftX = useSpring(0, { stiffness: 30, damping: 20 });
  const driftY = useSpring(0, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const timer = setInterval(() => setCurrent((index) => (index + 1) % WINDOW_RENDERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    driftX.set(-((event.clientX - box.left) / box.width - 0.5) * 60);
    driftY.set(-((event.clientY - box.top) / box.height - 0.5) * 60);
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={() => (driftX.set(0), driftY.set(0))} className={`flex items-center justify-center ${className}`}>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <clipPath id="g-window" clipPathUnits="objectBoundingBox" transform="scale(0.01) translate(-3.18 -1)">
          {gDashes.map((dash) => (
            <path key={dash.d} d={dash.d} />
          ))}
        </clipPath>
      </svg>
      <div className="relative aspect-square h-[min(75vh,90vw)] overflow-hidden [clip-path:url(#g-window)]">
        <motion.div style={{ x: driftX, y: driftY }} className="absolute -inset-[40px]">
          {WINDOW_RENDERS.map((render, index) => (
            <motion.div key={render.src} className="absolute inset-0" animate={{ opacity: index === current ? 1 : 0 }} transition={{ duration: 1.2 }}>
              <Image src={render.src} alt={render.alt} fill sizes="75vh" className="object-cover" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ N: Drag */
/* Every dash can be pulled out with the mouse or a finger; let go and it springs back into the G. */
export function GDrag({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* One full-size layer per dash, so a drag moves it in screen pixels; only the dash itself catches the pointer. */}
      <div className="relative aspect-square h-[min(60vh,80vw)]">
        {gDashes.map((dash) => (
          <motion.div
            key={dash.d}
            className="pointer-events-none absolute inset-0 touch-none"
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            dragTransition={{ bounceStiffness: 120, bounceDamping: 14 }}
            whileDrag={{ zIndex: 1 }}
          >
            <svg viewBox={G_VIEWBOX} aria-hidden="true" className="size-full">
              <path d={dash.d} fill={COLORS[dash.color]} className="pointer-events-auto cursor-grab active:cursor-grabbing" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
