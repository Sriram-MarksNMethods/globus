"use client";

import { ReactLenis } from "lenis/react";

/* Smooth, weighted scrolling for the whole page, tuned to match aircenter.space
   (measured: one 100px wheel notch moves their page 48px and settles in ~0.7s).
   lerp: how quickly the page catches up with the wheel each frame; lower feels floatier.
   wheelMultiplier: how far one wheel notch moves the page; smaller steps look smoother.
   Touch scrolling stays native on phones. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 0.5 }}>
      {children}
    </ReactLenis>
  );
}
