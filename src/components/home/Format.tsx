"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import type { FormatContent } from "@/content/types";
import { FinRibbon } from "@/components/brand/FinRibbon";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { useViewport } from "@/components/ui/useViewport";

/*
  Slides up over the pinned tower block.
  Headline → intro → a photo that grows from 8 columns to full width →
  a pinned fin sculpture with two short facts (blur reveal) and a "1 / 2" counter.
*/
export function Format({ content: format }: { content: FormatContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const growRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const { width } = useViewport();

  // Darken the section underneath while this one slides over it.
  const { scrollYProgress: coverProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const shade = useTransform(coverProgress, [0, 1], [0, 0.45]);

  // Photo grows from 8 columns wide to the full width (minus 20px each side).
  const column = (width - 260) / 12;
  const smallScale = (column * 8 + 7 * 20) / width;
  const fullScale = (width - 40) / width;
  const { scrollYProgress: growProgress } = useScroll({ target: growRef, offset: ["start end", "start 0.3"] });
  const growScale = useTransform(growProgress, [0, 1], [smallScale, fullScale]);
  const photoScale = useTransform(growProgress, [0, 1], [1.25, 1]);

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
    <>
      {/* Shade over the previous section (sits just above it) */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: shade }}
        className="pointer-events-none sticky top-0 z-[5] -mt-[100vh] h-screen bg-black"
      />

      <section ref={sectionRef} className="relative z-10 bg-white pt-5">
        <SplitHeading parts={format.heading} />

        <p className="text-body mx-auto mt-[120px] max-w-[340px] px-5 text-center text-grey md:mt-[240px]">{format.intro}</p>

        <div ref={growRef} className="relative z-10 mt-[80px] md:mt-[166px]">
          <motion.div
            style={{ scale: growScale, originY: 0 }}
            className="relative aspect-[1440/1058] w-full overflow-hidden rounded-[14px]"
          >
            <motion.div style={{ scale: photoScale, originY: 0 }} className="absolute inset-0">
              <Image src={format.image.src} alt={format.image.alt} fill sizes="100vw" className="object-cover" />
            </motion.div>
          </motion.div>
        </div>

        {/* Pinned G with two facts */}
        <div ref={factsRef} className="relative -mt-[22vw] h-[260vh]">
          <div
            onPointerMove={followPointer}
            onPointerLeave={returnToCentre}
            className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [@media(pointer:fine)]:cursor-none"
          >
            {/* The sculpture only moves inside its own video; the section itself stays still. */}
            <FinRibbon className="absolute h-[120vh] w-[120vh]" />

            <div className="relative grid w-full grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
              <div className="relative md:col-span-4 md:col-start-7">
                <BlurReveal text={format.slides[0]} show={activeSlide === 0} className="text-body absolute inset-x-0 top-0 text-grey" />
                <BlurReveal text={format.slides[1]} show={activeSlide === 1} className="text-body text-grey" />
              </div>
            </div>

            {/* Counter card = the cursor (see followPointer above) */}
            <motion.div
              style={{ x: cardX, y: cardY }}
              className="pointer-events-none absolute top-[calc(50%-51px)] left-[calc(50%-51px)] flex size-[102px] flex-col rounded-[5px] bg-[#efefef]/80 p-[10px] backdrop-blur-[10px]"
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
    </>
  );
}
