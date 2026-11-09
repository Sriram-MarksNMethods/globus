"use client";

import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { useEffect, useRef, useState } from "react";
import { animate, motion, MotionValue, useMotionValue, useTransform } from "motion/react";
import type { ViewsContent } from "@/content/types";

const AUTOPLAY = 2000; // ms between photos

/*
  White section: lead text → a looping row of photos turning in 3D → arrow buttons → note.
  The row moves on by itself every 2 seconds (paused while the pointer is over it);
  the arrows step back and forth and restart the timer.
*/
export function Views({ content: views }: { content: ViewsContent }) {
  const count = views.images.length;
  // Which photo is in the middle; counts up for ever, each photo's place is worked out round the loop.
  const position = useMotionValue(1);
  const target = useRef(1);
  const [paused, setPaused] = useState(false);
  // Bumped by the arrows so the timer starts again from zero.
  const [timerKey, setTimerKey] = useState(0);

  function step(direction: 1 | -1) {
    target.current += direction;
    animate(position, target.current, { duration: 0.9, ease: [0.25, 0.74, 0.22, 0.99] });
  }

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => step(1), AUTOPLAY);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- step only touches refs and a motion value
  }, [paused, timerKey]);

  function onArrow(direction: 1 | -1) {
    step(direction);
    setTimerKey((key) => key + 1);
  }

  return (
    <section className="relative z-10 overflow-hidden bg-white pt-[60px] pb-[60px] md:pt-[240px] md:pb-[200px]">
      <div className="grid grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-6 md:col-start-7">{views.lead}</p>
      </div>

      <div
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className="relative mt-8 h-[60vw] [perspective:1400px] md:mt-[120px] md:h-[34vw]"
      >
        {views.images.map((image, index) => (
          <ViewCard key={image.src} index={index} count={count} position={position} src={image.src} alt={image.alt} />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-[10px] md:mt-10">
        <ArrowButton direction={-1} onClick={() => onArrow(-1)} />
        <ArrowButton direction={1} onClick={() => onArrow(1)} />
      </div>

      <p className="text-copy mt-8 px-5 text-[#555] md:mx-auto md:mt-[120px] md:max-w-[453px] md:text-center md:text-grey">{views.text}</p>
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? "Next photo" : "Previous photo"}
      className="flex size-[50px] items-center justify-center rounded-[5px] bg-chip transition-colors duration-[600ms] hover:bg-[#dcdcdc]"
    >
      <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true" className={direction === -1 ? "rotate-180" : ""}>
        <path d="M0 7h15M9 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    </button>
  );
}

type CardProps = { index: number; count: number; position: MotionValue<number>; src: string; alt: string };

function ViewCard({ index, count, position, src, alt }: CardProps) {
  // Distance from the middle of the screen, in "cards", the short way round the loop
  // (cards jump from one end to the other while hidden, beyond 1.6 cards out).
  const offset = useTransform(position, (value) => {
    const away = (((index - value) % count) + count) % count;
    return away > count / 2 ? away - count : away;
  });
  const x = useTransform(offset, (value) => `calc(-50% + ${value * 52}vw)`);
  const rotateY = useTransform(offset, (value) => Math.max(-1, Math.min(1, value)) * -38);
  const z = useTransform(offset, (value) => -Math.abs(value) * 180);
  const opacity = useTransform(offset, (value) => (Math.abs(value) > 1.6 ? 0 : 1));

  return (
    <motion.div
      style={{ x, rotateY, z, opacity }}
      className="absolute top-0 left-1/2 aspect-[670/450] h-full overflow-hidden rounded-[5px]"
    >
      <ParallaxImage src={src} alt={alt} sizes="(min-width: 1024px) 51vw, 90vw" className="object-cover" />
    </motion.div>
  );
}
