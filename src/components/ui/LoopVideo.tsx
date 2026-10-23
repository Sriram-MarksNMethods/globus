"use client";

import { useEffect, useRef } from "react";

/*
  A muted background video that loops forever (used behind hero headlines).
  Pass the file name without the extension: "/brand/hero-towers" loads
  hero-towers.webm, hero-towers.mp4 and hero-towers-poster.webp.

  Upright screens (phones) get a smaller portrait cut of the same clip:
  hero-towers-portrait.webm / .mp4. It is sharper on a phone and a fraction of the download.
*/
export function LoopVideo({ name, className = "" }: { name: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // "Reduce motion": keep the first frame still instead of playing the loop.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) videoRef.current?.pause();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={`${name}-poster.webp`}
      aria-hidden="true"
      className={`pointer-events-none object-cover ${className}`}
    >
      {/* The browser plays the first source that fits: portrait cut on upright screens, then WebM, then MP4. */}
      <source src={`${name}-portrait.webm`} type="video/webm" media="(max-aspect-ratio: 1/1)" />
      <source src={`${name}-portrait.mp4`} type="video/mp4" media="(max-aspect-ratio: 1/1)" />
      <source src={`${name}.webm`} type="video/webm" />
      <source src={`${name}.mp4`} type="video/mp4" />
    </video>
  );
}
