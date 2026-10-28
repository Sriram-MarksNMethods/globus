"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import type { ViewsContent } from "@/content/types";

/*
  White section: lead text → a row of photos turning in 3D as you scroll → note.
*/
export function Views({ content: views }: { content: ViewsContent }) {
  const rowRef = useRef<HTMLDivElement>(null);

  // 0 when the row enters the screen, 1 when it leaves.
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start end", "end start"] });
  // Which photo is in the middle: slides from the 1st to the last.
  const position = useTransform(scrollYProgress, [0.1, 0.9], [0.5, views.images.length - 1.5]);

  return (
    <section className="relative z-10 overflow-hidden bg-white pt-[120px] pb-[120px] md:pt-[240px] md:pb-[200px]">
      <div className="grid grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-6 md:col-start-7">{views.lead}</p>
      </div>

      <div ref={rowRef} className="relative mt-[80px] h-[60vw] [perspective:1400px] md:mt-[120px] md:h-[34vw]">
        {views.images.map((image, index) => (
          <ViewCard key={image.src} index={index} position={position} src={image.src} alt={image.alt} />
        ))}
      </div>

      <p className="text-body mx-auto mt-[80px] max-w-[453px] px-5 text-center text-grey md:mt-[120px]">{views.text}</p>
    </section>
  );
}

type CardProps = { index: number; position: MotionValue<number>; src: string; alt: string };

function ViewCard({ index, position, src, alt }: CardProps) {
  // Distance from the middle of the screen, in "cards".
  const offset = useTransform(position, (value) => index - value);
  const x = useTransform(offset, (value) => `calc(-50% + ${value * 52}vw)`);
  const rotateY = useTransform(offset, (value) => Math.max(-1, Math.min(1, value)) * -38);
  const z = useTransform(offset, (value) => -Math.abs(value) * 180);
  const opacity = useTransform(offset, (value) => (Math.abs(value) > 1.6 ? 0 : 1));

  return (
    <motion.div
      style={{ x, rotateY, z, opacity }}
      className="absolute top-0 left-1/2 aspect-[670/450] h-full overflow-hidden rounded-[5px]"
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 51vw, 90vw" className="object-cover" />
    </motion.div>
  );
}
