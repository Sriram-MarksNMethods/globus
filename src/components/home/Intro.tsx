"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { IntroContent } from "@/content/types";
import { LoopVideo } from "@/components/ui/LoopVideo";

/*
  Hero: a full-screen loop of two slowly twisting fin towers (silver),
  a two-line title at the top and the headline in the open space between the towers.
  The tower photo (next section) slides up over it during the first screen of scrolling.
*/
export function Intro({ content: intro }: { content: IntroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <motion.div style={{ opacity: fade }} className="sticky top-0 h-screen overflow-hidden bg-[#e2e2e2]">
        <motion.div style={{ y: drift }} className="absolute -inset-y-[5%] inset-x-0">
          {/* On phones the towers sit wider than the screen, so show the left tower and the gap. */}
          <LoopVideo name="/brand/hero-towers" className="size-full object-[30%_50%] md:object-center" />
        </motion.div>

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
          href="#about"
          aria-label="Scroll down"
          className="absolute right-5 bottom-5 flex size-[30px] items-center justify-center rounded-[5px] bg-white/80"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M6 0v13M1 8l5 5 5-5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
