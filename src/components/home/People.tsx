"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { PeopleContent } from "@/content/types";

/*
  Full-bleed aerial photo with the headline sitting on its bottom edge.
*/
export function People({ content: people }: { content: PeopleContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-40vh", "40vh"]);

  return (
    <section ref={sectionRef} data-theme="dark" className="relative z-10 h-[105vh] overflow-hidden bg-black text-white">
      <motion.div style={{ y: photoY }} className="absolute inset-x-0 -top-[40vh] h-[calc(100%+80vh)]">
        <Image src={people.image.src} alt={people.image.alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 md:flex-row md:items-end">
        <p className="text-small md:w-[calc(2*(100vw-260px)/12+40px)] md:shrink-0">{people.label}</p>
        <h2 className="text-h1 flex flex-1 flex-col md:flex-row md:justify-between">
          <span>{people.heading[0]}</span>
          <span>{people.heading[1]}</span>
        </h2>
      </div>
    </section>
  );
}
