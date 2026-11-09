"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/*
  A photo that drifts slowly inside its frame as it passes through the screen (the Aceternity "Parallax Scroll"
  movement, applied to each image). Use it in place of <Image fill> inside a frame that is `relative` and
  `overflow-hidden`: the photo is drawn a little taller than the frame and slides from slightly above to slightly
  below as the frame travels from the bottom of the screen to the top.
  With "reduce motion" switched on, the photo stays still.
*/
const DRIFT = 8; // percent of the photo's height, each way

export function ParallaxImage({ className = "", ...image }: Omit<ImageProps, "fill">) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // 0 when the frame's top reaches the bottom of the screen, 1 when its bottom leaves the top.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  // Function form on purpose: the range form can hand off to the browser's own scroll timeline, which loses track
  // of sticky frames (the homepage project cards).
  const y = useTransform(scrollYProgress, (value) => `${(value - 0.5) * 2 * DRIFT}%`);

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden">
      <motion.div style={reduceMotion ? undefined : { y }} className="absolute inset-x-0 -top-[10%] -bottom-[10%]">
        <Image {...image} alt={image.alt} fill className={className} />
      </motion.div>
    </div>
  );
}
