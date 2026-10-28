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

  // Photo grows from 8 columns wide to the full width of the window.
  const column = (width - 260) / 12;
  const smallScale = (column * 8 + 7 * 20) / width;
  const fullScale = 1;
  const { scrollYProgress: growProgress } = useScroll({ target: growRef, offset: ["start end", "start 0.3"] });
  const growScale = useTransform(growProgress, [0, 1], [smallScale, fullScale]);
  const photoScale = useTransform(growProgress, [0, 1], [1.25, 1]);
  // Rounded while it is a card, square once it reaches the window edges.
  const radius = useTransform(growProgress, [0.7, 1], [14, 0]);

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

      <p className="text-body mx-auto mt-[120px] max-w-[340px] px-5 text-center text-grey md:mt-[240px]">{format.intro}</p>

      <div ref={growRef} className="relative z-10 mt-[80px] md:mt-[166px]">
        <motion.div
          style={{ scale: growScale, originY: 0, borderRadius: radius }}
          className="relative aspect-[1440/1058] w-full overflow-hidden"
        >
          <motion.div style={{ scale: photoScale, originY: 0 }} className="absolute inset-0">
            <Image src={format.image.src} alt={format.image.alt} fill sizes="100vw" quality={90} className="object-cover" />
          </motion.div>
        </motion.div>
      </div>

      {/* Pinned two facts */}
      <div ref={factsRef} className="relative -mt-[22vw] h-[260vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
          {/* The spiral only moves inside its own video; the section itself stays still.
              Always full width, centred; height follows the clip's own shape.
              Below desktop it is kept within the screen height, so on a tablet the whole tunnel
              shows instead of being cropped to its empty middle; its side edges fade into the page. */}
          <LoopVideo
            name="/brand/projects-tunnel"
            className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2 max-md:inset-x-auto max-md:left-1/2 max-md:h-svh max-md:w-auto max-md:max-w-full max-md:-translate-x-1/2 max-md:object-contain sm:max-md:[mask-image:linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)]"
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
