"use client";

import { useEffect, useRef } from "react";

/*
  A muted background video that loops forever (used behind hero headlines).
  Pass the file name without the extension: "/brand/hero-towers" loads
  hero-towers.webm, hero-towers.mp4 and hero-towers-poster.webp.
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
      {/* WebM plays in every modern browser; MP4 is the fallback. */}
      <source src={`${name}.webm`} type="video/webm" />
      <source src={`${name}.mp4`} type="video/mp4" />
    </video>
  );
}
