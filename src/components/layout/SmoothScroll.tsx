"use client";

import { ReactLenis } from "lenis/react";

/* Smooth, weighted scrolling for the whole page (like the reference). */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9 }}>
      {children}
    </ReactLenis>
  );
}
