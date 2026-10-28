"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { INTRO_SEEN_KEY } from "./introSeen";

/*
  Landing intro:
  1. The Globus logo film plays full screen (same film as globusdevelopers.com).
  2. When it ends, the logo flies from where it sits in the film to its place in the header,
     while the white background fades away.
  3. The header logo then takes over (see the `data-intro` attribute in Header.tsx).
  It plays once a day per device (see introSeen.ts): it counts as seen as soon as it starts, so
  refreshing halfway through doesn't restart it. The script in layout.tsx marks the page as
  done before it is drawn, so a skipped intro never flashes white.
*/

// Where the logo sits in the last frame of the 1920 × 1080 film:
// the box of the whole logo SVG (300 × 102 units), measured from the film.
const FILM = { width: 1920, height: 1080 };
const LOGO_IN_FILM = { x: 431.1, y: 338.2, width: 1100.8 };
const FLY_DURATION = 1.1; // seconds
// The film is shown smaller than the window so the logo doesn't feel zoomed in (1 = fill the window).
const FILM_ZOOM = 0.45;

type Box = { left: number; top: number; width: number };

// The "already seen" flag never changes while the page is open, so there is nothing to listen to.
const noSubscription = () => () => {};

export function Preloader() {
  const [phase, setPhase] = useState<"film" | "fly" | "done">("film");
  const [from, setFrom] = useState<Box | null>(null);
  const [to, setTo] = useState<Box | null>(null);
  const lenis = useLenis();
  // The flight must only ever start once (the film ending and the safety timer can both ask for it).
  const flightStarted = useRef(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Already played this visit (set by the script in layout.tsx): skip straight to the site.
  // On the server, and while hydrating, this reads false.
  const alreadySeen = useSyncExternalStore(
    noSubscription,
    () => document.documentElement.dataset.intro === "done",
    () => false,
  );

  // No scrolling while the film plays. Remember right away that it has been seen.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") return;
    try {
      localStorage.setItem(INTRO_SEEN_KEY, String(Date.now()));
    } catch {
      // Storage blocked (private mode): the intro will simply play again next time.
    }
    window.scrollTo(0, 0);
    lenis?.stop();
  }, [lenis]);

  const startFly = useCallback(() => {
    if (flightStarted.current) return;
    flightStarted.current = true;
    if (safetyTimer.current) clearTimeout(safetyTimer.current);

    // Logo position on screen: the film is scaled to fit inside the window (object-contain),
    // then shrunk by FILM_ZOOM around the centre.
    const scale = Math.min(window.innerWidth / FILM.width, window.innerHeight / FILM.height) * FILM_ZOOM;
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

  if (alreadySeen || phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50 [html[data-intro=done]_&]:hidden" aria-hidden="true">
      {/* White background, fades out while the logo flies */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: phase === "fly" ? 0 : 1 }}
        transition={{ duration: FLY_DURATION * 0.8, ease: "easeInOut" }}
      />

      {phase === "film" && (
        <video
          className="absolute inset-0 m-auto object-contain"
          style={{ width: `${FILM_ZOOM * 100}%`, height: `${FILM_ZOOM * 100}%` }}
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
