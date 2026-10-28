"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/*
  A camera move that plays as you scroll (like halobyraghava.com / Apple product pages).
  The section pins for two screens; each scroll position shows one still frame on a canvas,
  so scrolling down plays the shot forwards and scrolling up plays it back.

  Frames live in `<folder>/d/0001.webp …` (desktop, 16:9) and `<folder>/m/…` (upright phones),
  made by tools/scroll-sequence/extract.sh. The first frame loads straight away; the rest
  load when the section is about a screen and a half away, so other pages and the top of
  this one don't pay for them.
*/
export function ScrollSequence({ folder, frames }: { folder: string; frames: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Draw the wanted frame, or the closest earlier one that has finished loading.
  function draw(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = index; i >= 0; i--) {
      const image = imagesRef.current[i];
      if (image?.complete && image.naturalWidth > 0) {
        if (canvas.width !== image.naturalWidth) {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
        }
        canvas.getContext("2d")?.drawImage(image, 0, 0);
        return;
      }
    }
  }

  useEffect(() => {
    const set = window.matchMedia("(orientation: portrait)").matches ? "m" : "d";
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    function load(index: number) {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        // A newly arrived frame only matters if it is at or before the one we are on.
        if (index <= currentRef.current) draw(currentRef.current);
      };
      image.src = `${folder}/${set}/${String(index + 1).padStart(4, "0")}.webp`;
      images[index] = image;
    }

    load(0);
    const section = sectionRef.current;
    if (!section) return;
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearby.disconnect();
        for (let index = 1; index < frames; index++) load(index);
      },
      { rootMargin: "150% 0px" },
    );
    nearby.observe(section);
    return () => nearby.disconnect();
  }, [folder, frames]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.round(value * (frames - 1));
    if (index === currentRef.current) return;
    currentRef.current = index;
    draw(index);
  });

  return (
    <section ref={sectionRef} data-theme="dark" className="relative mt-[60px] h-[300svh] bg-black md:mt-[200px]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="size-full object-cover" />
      </div>
    </section>
  );
}
