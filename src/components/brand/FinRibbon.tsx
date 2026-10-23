"use client";

import { useEffect, useRef } from "react";

/*
  The Globus fin sculpture: a pre-rendered, seamless 16-second loop.

  It is a video (not live 3D) so it looks the same everywhere and costs almost nothing
  to play. The videos are rendered on white / black; the blend mode makes that
  background melt into the page, so no box edge ever shows.

  The video pauses while it is off screen.
*/

const SOURCES = {
  light: { name: "/brand/fins-light", blend: "mix-blend-multiply" },
  dark: { name: "/brand/fins-dark", blend: "mix-blend-screen" },
};

export function FinRibbon({ className = "", tone = "light" }: { className?: string; tone?: keyof typeof SOURCES }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect "reduce motion": show a still frame instead of the loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    visibility.observe(video);
    return () => visibility.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden="true"
      className={`pointer-events-none object-contain ${SOURCES[tone].blend} ${className}`}
    >
      {/* WebM plays in every modern browser; MP4 is the fallback. */}
      <source src={`${SOURCES[tone].name}.webm`} type="video/webm" />
      <source src={`${SOURCES[tone].name}.mp4`} type="video/mp4" />
    </video>
  );
}
