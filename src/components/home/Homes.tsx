"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import type { HomesContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  Full-bleed photo → headline → pinned floor-plan slider.
  Scrolling moves through the plans; the bars at the top of the card fill up.
*/
export function Homes({ content: homes }: { content: HomesContent }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoProgress, [0, 1], ["-14vh", "14vh"]);

  const { scrollYProgress } = useScroll({ target: sliderRef, offset: ["start start", "end end"] });
  const count = homes.slides.length;
  const current = useTransform(scrollYProgress, (value) => Math.min(count - 1, Math.floor(value * count)));
  const currentLabel = useTransform(current, (value) => String(value + 1));

  return (
    <>
      <div ref={photoRef} data-theme="dark" className="relative z-10 h-[105vh] overflow-hidden bg-black">
        <motion.div style={{ y: photoY }} className="absolute inset-x-0 -top-[14vh] h-[calc(100%+28vh)]">
          <Image src={homes.background.src} alt={homes.background.alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
      </div>

      <section id="plans" className="relative z-10 bg-white pt-5">
        <SplitHeading parts={homes.heading} />
        <p className="text-body mx-auto mt-[120px] max-w-[340px] px-5 text-center text-grey md:mt-[180px]">{homes.intro}</p>

        <div ref={sliderRef} className="relative h-[320vh]">
          <div className="sticky top-0 grid h-screen grid-cols-1 gap-5 px-5 pt-[90px] pb-5 md:grid-cols-12 md:pt-[103px]">
            {/* Plan images, cross-fading */}
            <div className="relative overflow-hidden rounded-[5px] bg-white md:col-span-8">
              {homes.slides.map((slide, index) => (
                <Slide key={slide.image.src} index={index} current={current}>
                  <Image src={slide.image.src} alt={slide.image.alt} fill sizes="66vw" className={slide.photo ? "object-cover" : "object-contain"} />
                </Slide>
              ))}
            </div>

            {/* Grey card */}
            <div className="relative flex flex-col rounded-[5px] bg-soft p-5 md:col-span-4">
              <div className="flex gap-5">
                {homes.slides.map((slide, index) => (
                  <Bar key={slide.image.src} index={index} count={count} progress={scrollYProgress} />
                ))}
              </div>

              <div className="mt-[35px] flex items-start justify-between">
                <motion.p className="text-h1">{currentLabel}</motion.p>
                <p className="text-small text-grey">/ {count}</p>
              </div>

              <div className="relative mt-auto mb-auto min-h-[90px]">
                {homes.slides.map((slide, index) => (
                  <Slide key={slide.text} index={index} current={current}>
                    <p className="text-body text-grey">{slide.text}</p>
                  </Slide>
                ))}
              </div>

              <Button href={homes.button.href} label={homes.button.label} variant="light" className="w-[196px] bg-[#e4e4e4]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Shows its children only while it is the current slide. */
function Slide({ index, current, children }: { index: number; current: MotionValue<number>; children: React.ReactNode }) {
  const opacity = useTransform(current, (value) => (value === index ? 1 : 0));
  return (
    <motion.div style={{ opacity }} transition={{ duration: 0.5 }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

/* One progress bar per slide. */
function Bar({ index, count, progress }: { index: number; count: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
  return (
    <div className="h-[2px] flex-1 bg-black/10">
      <motion.div style={{ scaleX: fill, originX: 0 }} className="h-full bg-black" />
    </div>
  );
}
