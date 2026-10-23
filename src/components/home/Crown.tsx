"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { CrownContent } from "@/content/types";
import { Button } from "@/components/ui/Button";

/*
  Full-bleed dusk photo with a frosted card in the bottom-right corner.
*/
export function Crown({ content: crown }: { content: CrownContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-40vh", "40vh"]);

  return (
    <section ref={sectionRef} data-theme="dark" className="relative z-10 h-[175vh] overflow-hidden bg-black">
      <motion.div style={{ y: photoY }} className="absolute inset-x-0 -top-[40vh] h-[calc(100%+80vh)]">
        <Image src={crown.background.src} alt={crown.background.alt} fill sizes="100vw" className="object-cover" />
      </motion.div>

      <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-5 rounded-[5px] bg-[rgba(141,141,141,0.7)] p-5 text-white backdrop-blur-[20px] md:left-auto md:w-[453px]">
        <h2 className="text-h2 max-w-[305px]">{crown.title}</h2>
        <div className="relative aspect-square overflow-hidden rounded-[5px]">
          <Image src={crown.image.src} alt={crown.image.alt} fill sizes="413px" className="object-cover" />
        </div>
        <Button href={crown.button.href} label={crown.button.label} variant="light" onDark />
      </div>
    </section>
  );
}
