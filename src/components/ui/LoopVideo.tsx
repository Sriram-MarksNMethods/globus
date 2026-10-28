"use client";

import { useEffect, useRef } from "react";

/*
  A muted background video that loops forever (used behind hero headlines).
  Pass the file name without the extension: "/brand/hero-towers" loads
  hero-towers.webm, hero-towers.mp4 and hero-towers-poster.webp.

  Upright screens (phones) get a smaller portrait cut of the same clip:
  hero-towers-portrait.webm / .mp4. It is sharper on a phone and a fraction of the download.

  It only plays while it is on screen (a playing video costs CPU even when nobody sees it).
  `eager`: start downloading straight away (the first screen's video). Otherwise the
  download waits until the video is about to scroll into view.
*/
// H.264 High profile, so browsers that cannot decode it skip straight to the WebM.
export const MP4 = 'video/mp4; codecs="avc1.640028"';

export function LoopVideo({ name, eager = false, className = "" }: { name: string; eager?: boolean; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Upright screens get the portrait cut's first frame as the still (the wide one is cropped to
    // its empty middle there). It shows until the video starts, and instead of it in iOS Low Power Mode.
    if (window.matchMedia("(max-aspect-ratio: 1/1)").matches) video.poster = `${name}-portrait-poster.webp`;

    // "Reduce motion": keep the poster still instead of playing the loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      // Start a little before it comes into view, so it is already moving when it appears.
      { rootMargin: "50% 0px" },
    );
    visibility.observe(video);
    return () => visibility.disconnect();
  }, [name]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      poster={`${name}-poster.webp`}
      aria-hidden="true"
      className={`pointer-events-none object-cover ${className}`}
    >
      {/* The browser plays the first source that fits: portrait cut on upright screens, then MP4, then WebM.
          MP4 (H.264) first: iPhones and iPads decode it in hardware; WebM is for browsers without H.264. */}
      <source src={`${name}-portrait.mp4`} type={MP4} media="(max-aspect-ratio: 1/1)" />
      <source src={`${name}-portrait.webm`} type="video/webm" media="(max-aspect-ratio: 1/1)" />
      <source src={`${name}.mp4`} type={MP4} />
      <source src={`${name}.webm`} type="video/webm" />
    </video>
  );
}
