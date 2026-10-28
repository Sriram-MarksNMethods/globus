"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { FormatContent } from "@/content/types";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { useViewportWidth } from "@/components/ui/useViewport";
import { LoopVideo } from "@/components/ui/LoopVideo";

/*
  Slides up over the hero (starts 50svh early, see Intro.tsx).
  Headline → intro → a photo that grows from 8 columns to full width →
  a pinned tunnel video with two short facts (blur reveal), centred.
*/
export function Format({ content: format }: { content: FormatContent }) {
  const growRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const width = useViewportWidth();

  // Photo grows from 8 columns wide to the full width of the window (desktop only;
  // on phones and portrait tablets it is simply full width from the start).
  const column = (width - 260) / 12;
  const smallScale = width >= 1024 ? (column * 8 + 7 * 20) / width : 1;
  const fullScale = 1;
  const { scrollYProgress: growProgress } = useScroll({ target: growRef, offset: ["start end", "start 0.3"] });
  const growScale = useTransform(growProgress, [0, 1], [smallScale, fullScale]);
  const photoScale = useTransform(growProgress, [0, 1], [1.25, 1]);
  // Rounded while it is a card, square once it reaches the window edges.
  const radius = useTransform(growProgress, [0.7, 1], [width >= 1024 ? 14 : 0, 0]);

  // Pinned facts.
  const { scrollYProgress: factsProgress } = useScroll({ target: factsRef, offset: ["start start", "end end"] });
  // Which fact is showing: none before the section pins, then the 1st, then the 2nd half way through.
  const [activeSlide, setActiveSlide] = useState(-1);
  useMotionValueEvent(factsProgress, "change", (value) => {
    setActiveSlide(value <= 0.01 ? -1 : value < 0.5 ? 0 : 1);
  });

  return (
    <section id="landmarks" className="relative z-10 -mt-[50svh] bg-white pt-[100px] md:pt-[120px]">
      <SplitHeading parts={format.heading} />

      <p className="text-copy mt-6 px-5 text-[#555] md:mx-auto md:mt-[240px] md:max-w-[340px] md:text-center md:text-grey">{format.intro}</p>

      <div ref={growRef} className="relative z-10 mt-10 md:mt-[166px]">
        <motion.div
          style={{ scale: growScale, originY: 0, borderRadius: radius }}
          className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[1440/1058]"
        >
          <motion.div style={{ scale: photoScale, originY: 0 }} className="absolute inset-0">
            <Image src={format.image.src} alt={format.image.alt} fill sizes="100vw" quality={90} className="object-cover" />
          </motion.div>
        </motion.div>
      </div>

      {/* Pinned two facts */}
      <div ref={factsRef} className="relative h-[180vh] md:-mt-[22vw] md:h-[260vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
          {/* The spiral only moves inside its own video; the section itself stays still.
              Desktop: full width, centred; height follows the clip's own shape.
              Below desktop it fills the screen (upright screens get the upright cut of the tunnel). */}
          <LoopVideo
            name="/brand/projects-tunnel"
            className="absolute inset-0 size-full md:top-1/2 md:bottom-auto md:h-auto md:-translate-y-1/2"
          />

          {/* Both facts share one centred box; the first is laid over the second. */}
          <div className="relative grid w-full grid-cols-1 px-5 text-center md:grid-cols-12 md:gap-5">
            <div className="relative md:col-span-6 md:col-start-4">
              <BlurReveal text={format.slides[0]} show={activeSlide === 0} className="text-h2 absolute inset-x-0 top-0 text-black" />
              <BlurReveal text={format.slides[1]} show={activeSlide === 1} className="text-h2 text-black" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
