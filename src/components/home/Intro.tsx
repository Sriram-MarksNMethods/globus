"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { IntroContent } from "@/content/types";
import { LoopVideo } from "@/components/ui/LoopVideo";

/*
  Hero: a full-screen loop of two slowly twisting fin towers,
  a two-line title at the top and the headline in the open space between the towers.
  It holds still for half a screen while "A legacy of landmarks" slides up over it
  (Format.tsx starts 50svh early), darkening slightly as it is covered.
*/
export function Intro({ content: intro }: { content: IntroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.45]);

  return (
    <section ref={sectionRef} className="relative h-[150svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#e2e2e2]">
        <LoopVideo name="/brand/hero-towers" eager className="size-full" />

        <p className="text-h2 absolute inset-x-0 top-[80px] text-center md:top-5">
          {intro.title[0]}
          <br />
          {intro.title[1]}
        </p>

        <h1 className="text-h1 absolute inset-x-5 top-1/2 flex -translate-y-1/2 flex-col items-center text-center">
          <span>{intro.heading[0]}</span>
          <span>{intro.heading[1]}</span>
        </h1>

        <p className="text-body absolute top-[calc(50%+110px)] inset-x-5 text-center text-ink/60 md:top-[calc(50%+100px)]">
          {intro.label.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <a
          href="#landmarks"
          aria-label="Scroll down"
          className="absolute right-5 bottom-5 flex size-[30px] items-center justify-center rounded-[5px] bg-white/80"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M6 0v13M1 8l5 5 5-5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </a>

        {/* Shade while the next section covers the hero */}
        <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />
      </div>
    </section>
  );
}
