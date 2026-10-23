"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { TowerContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  The tower photo slides up over the hero, then:
  headline → short intro → a pinned two-column block
  (text on the left, photo on the right that wipes to a second photo).
*/
export function Tower({ content: tower }: { content: TowerContent }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Full-bleed photo moves slower than the page.
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoProgress, [0, 1], ["-16.666%", "16.666%"]);

  // Pinned block: second photo wipes in from the bottom.
  const { scrollYProgress: pinProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const wipe = useTransform(pinProgress, [0.15, 0.75], [100, 0]);
  const clipPath = useTransform(wipe, (value) => `inset(${value}% 0% 0% 0%)`);
  const firstY = useTransform(pinProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section id="about" className="relative z-10 -mt-[100vh] bg-white">
      <div ref={photoRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y: photoY }} className="absolute inset-x-0 -top-[16.666%] h-[133.333%]">
          <Image src={tower.image.src} alt={tower.image.alt} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </div>

      <SplitHeading parts={tower.heading} className="pt-5" />

      <p className="text-body mx-auto mt-[120px] max-w-[575px] px-5 text-center text-grey md:mt-[180px]">{tower.intro}</p>

      {/* Pinned two-column block */}
      <div ref={pinRef} className="relative mt-[120px] h-[calc(41.7vw+160vh)] md:mt-[210px]">
        <div className="sticky top-[calc(100vh-20px-41.7vw)] grid grid-cols-1 gap-5 px-5 md:grid-cols-2">
          <div className="flex flex-col md:pr-[10px]">
            <p className="text-h2">{tower.lead}</p>
            <p className="text-body mt-4 text-grey md:mt-auto md:mb-auto">
              {tower.note[0]}
              <br />
              {tower.note[1]}
            </p>
            <Button href={tower.button.href} label={tower.button.label} className="mt-5 w-[217px] md:ml-auto" />
          </div>

          <div className="relative aspect-[690/575] overflow-hidden rounded-[5px]">
            <motion.div style={{ y: firstY }} className="absolute inset-x-0 top-0 h-[108%]">
              <Image src={tower.images[0].src} alt={tower.images[0].alt} fill sizes="50vw" className="object-cover" />
            </motion.div>
            <motion.div style={{ clipPath }} className="absolute inset-0">
              <Image src={tower.images[1].src} alt={tower.images[1].alt} fill sizes="50vw" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
