"use client";

import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/*
  Projects page hero: Neo's towers at dusk, full screen, with the title in white along the bottom.
  It fades out as the page scrolls on.
*/
export function ProjectsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={sectionRef} data-theme="dark" className="relative h-svh min-h-[560px] bg-black">
      <motion.div style={{ opacity: fade }} className="absolute inset-0 overflow-hidden">
        <ParallaxImage
          src="/neo/towers-night-road.webp"
          alt="Neo's twin towers at dusk above the tree-lined road"
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <h1 className="text-h1 absolute inset-x-5 bottom-5 flex flex-col text-white">
          <span>Our</span>
          <span>projects</span>
        </h1>
      </motion.div>
    </section>
  );
}
