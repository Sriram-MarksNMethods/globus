"use client";

import { motion } from "motion/react";

/*
  Text that appears word by word out of a soft blur ("blur reveal"),
  and blurs away again when `show` turns false.
*/
type Props = {
  text: string;
  show: boolean;
  className?: string;
};

const EASE = [0.25, 0.74, 0.22, 0.99] as const;

export function BlurReveal({ text, show, className = "" }: Props) {
  const words = text.split(" ");

  return (
    <p className={className} aria-hidden={!show}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, filter: "blur(10px)", y: 8 }}
          animate={show ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(10px)", y: -6 }}
          transition={{
            duration: show ? 0.8 : 0.4,
            ease: EASE,
            // Words come in one after another; they leave almost together.
            delay: show ? index * 0.035 : index * 0.008,
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}
