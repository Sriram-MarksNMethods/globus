"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import type { FormatContent } from "@/content/types";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { useViewportWidth } from "@/components/ui/useViewport";
import { LoopVideo } from "@/components/ui/LoopVideo";

/*
  Slides up over the hero (starts 50svh early, see Intro.tsx).
  Headline → intro → a photo that grows from 8 columns to full width →
  a pinned tunnel video with two short facts (blur reveal) and a "1 / 2" counter.
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
  const bar = useTransform(factsProgress, [0, 1], [0, 1]);
  const current = useTransform(factsProgress, (value): string => (value < 0.5 ? "1" : "2"));

  // The counter card is the mouse cursor in this section: it follows the pointer (softly)
  // and glides back to the middle when the pointer leaves. Measured as an offset from the centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cardX = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.6 });
  const cardY = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.6 });

  function followPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return; // touch screens keep the card in the middle
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - (box.left + box.width / 2));
    pointerY.set(event.clientY - (box.top + box.height / 2));
  }
  function returnToCentre() {
    pointerX.set(0);
    pointerY.set(0);
  }

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
        <div
          onPointerMove={followPointer}
          onPointerLeave={returnToCentre}
          className="sticky top-0 flex h-svh items-center justify-center overflow-hidden [@media(pointer:fine)]:cursor-none"
        >
          {/* The spiral only moves inside its own video; the section itself stays still.
              Always full width, centred; height follows the clip's own shape. */}
          <LoopVideo name="/brand/projects-tunnel" className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2" />

          <div className="relative grid w-full grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
            <div className="relative md:col-span-4 md:col-start-7">
              <BlurReveal text={format.slides[0]} show={activeSlide === 0} className="text-body absolute inset-x-0 top-0 text-grey" />
              <BlurReveal text={format.slides[1]} show={activeSlide === 1} className="text-body text-grey" />
            </div>
          </div>

          {/* Counter card = the cursor (see followPointer above). On phones it sits above the text. */}
          <motion.div
            style={{ x: cardX, y: cardY }}
            className="pointer-events-none absolute top-[calc(50%-170px)] left-[calc(50%-51px)] md:top-[calc(50%-51px)] flex size-[102px] flex-col rounded-[5px] bg-[#efefef]/95 p-[10px]"
          >
            <div className="h-[2px] w-full bg-black/10">
              <motion.div style={{ scaleX: bar, originX: 0 }} className="h-full bg-black" />
            </div>
            <p className="text-small m-auto">
              <motion.span>{current}</motion.span>
              <span className="text-grey"> / {format.slides.length}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
