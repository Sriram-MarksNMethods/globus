"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LoopVideo } from "@/components/ui/LoopVideo";

/*
  Projects page hero: a silver tunnel of fins moving slowly forward, full screen,
  with the title in the light opening at its centre. It fades out as the page scrolls on.
*/
export function ProjectsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[560px]">
      <motion.div style={{ opacity: fade }} className="absolute inset-0 overflow-hidden bg-[#e5e5e5]">
        <LoopVideo name="/brand/projects-tunnel" className="size-full" />

        <h1 className="text-h1 absolute inset-x-5 top-1/2 flex -translate-y-1/2 flex-col items-center text-center">
          <span>Our</span>
          <span>projects</span>
        </h1>
      </motion.div>
    </section>
  );
}
