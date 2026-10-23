"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

/*
  Landing intro:
  1. The Globus logo film plays full screen (same film as globusdevelopers.com).
  2. When it ends, the logo flies from where it sits in the film to its place in the header,
     while the white background fades away.
  3. The header logo then takes over (see the `data-intro` attribute in Header.tsx).
*/

// Where the logo sits in the last frame of the 1920 × 1080 film:
// the box of the whole logo SVG (300 × 102 units), measured from the film.
const FILM = { width: 1920, height: 1080 };
const LOGO_IN_FILM = { x: 431.1, y: 338.2, width: 1100.8 };
const FLY_DURATION = 1.1; // seconds

type Box = { left: number; top: number; width: number };

export function Preloader() {
  const [phase, setPhase] = useState<"film" | "fly" | "done">("film");
  const [from, setFrom] = useState<Box | null>(null);
  const [to, setTo] = useState<Box | null>(null);
  const lenis = useLenis();
  // The flight must only ever start once (the film ending and the safety timer can both ask for it).
  const flightStarted = useRef(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // No scrolling while the film plays.
  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.stop();
  }, [lenis]);

  const startFly = useCallback(() => {
    if (flightStarted.current) return;
    flightStarted.current = true;
    if (safetyTimer.current) clearTimeout(safetyTimer.current);

    // Logo position on screen: the film is scaled to fit inside the window (object-contain).
    const scale = Math.min(window.innerWidth / FILM.width, window.innerHeight / FILM.height);
    const offsetX = (window.innerWidth - FILM.width * scale) / 2;
    const offsetY = (window.innerHeight - FILM.height * scale) / 2;
    setFrom({
      left: offsetX + LOGO_IN_FILM.x * scale,
      top: offsetY + LOGO_IN_FILM.y * scale,
      width: LOGO_IN_FILM.width * scale,
    });

    // Target: the header logo.
    const headerLogo = document.querySelector("[data-header-logo]");
    const box = headerLogo?.getBoundingClientRect();
    setTo(box ? { left: box.left, top: box.top, width: box.width } : { left: 20, top: 15, width: 118 });

    setPhase("fly");
  }, []);

  // Safety net: if the film can't play (blocked autoplay, slow network), move on anyway.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    safetyTimer.current = setTimeout(startFly, reduceMotion ? 300 : 8500);
    return () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [startFly]);

  function finish() {
    document.documentElement.dataset.intro = "done";
    lenis?.start();
    setPhase("done");
  }

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden="true">
      {/* White background, fades out while the logo flies */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: phase === "fly" ? 0 : 1 }}
        transition={{ duration: FLY_DURATION * 0.8, ease: "easeInOut" }}
      />

      {phase === "film" && (
        <video
          className="absolute inset-0 h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          onEnded={startFly}
          onError={startFly}
        >
          <source src="/brand/logo-intro.webm" type="video/webm" />
          <source src="/brand/logo-intro.mp4" type="video/mp4" onError={startFly} />
        </video>
      )}

      {phase === "fly" && from && to && (
        <motion.img
          src="/brand/globus-logo-dark.svg"
          alt=""
          className="absolute h-auto max-w-none"
          initial={from}
          animate={to}
          transition={{ duration: FLY_DURATION, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={finish}
        />
      )}
    </div>
  );
}
