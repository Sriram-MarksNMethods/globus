"use client";

import { useEffect, useRef } from "react";

/*
  The Globus fin sculpture: a pre-rendered, seamless 16-second loop.

  It is a video (not live 3D) so it looks the same everywhere and costs almost nothing
  to play. The videos are rendered on white / black; the blend mode makes that
  background melt into the page. The render is a close-up, so the fins run off the
  frame; a soft radial mask fades them out before the video's square edge.

  The light video is only ever shown on white, so it needs no blend mode (multiplying
  by white changes nothing, but still costs a full repaint of every frame).

  The video pauses while it is off screen.
  `fill`: cover the whole box edge to edge instead (no circular mask), for full-screen use.
*/

const SOURCES = {
  light: { name: "/brand/fins-light", blend: "" },
  dark: { name: "/brand/fins-dark", blend: "mix-blend-screen" },
};

export function FinRibbon({
  className = "",
  tone = "light",
  fill = false,
}: {
  className?: string;
  tone?: keyof typeof SOURCES;
  fill?: boolean;
}) {
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
      className={`pointer-events-none ${fill ? "object-cover" : "object-contain [mask-image:radial-gradient(closest-side,black_60%,transparent)]"} ${SOURCES[tone].blend} ${className}`}
    >
      {/* WebM plays in every modern browser; MP4 is the fallback. */}
      <source src={`${SOURCES[tone].name}.webm`} type="video/webm" />
      <source src={`${SOURCES[tone].name}.mp4`} type="video/mp4" />
    </video>
  );
}
