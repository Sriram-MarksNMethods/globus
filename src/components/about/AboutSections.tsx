"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { about } from "@/content/pages";
import { FinRibbon } from "@/components/brand/FinRibbon";
import { BlurReveal } from "@/components/ui/BlurReveal";

/* ------------------------------------------------------------------ Hero */
/* Headline split to both edges over the fin sculpture, small label in between.
   Phones and tablets: headline near the top and label near the bottom, so neither sits on the fins' busy middle. */
export function AboutHero() {
  return (
    <section className="relative h-svh overflow-hidden bg-white">
      <FinRibbon className="absolute top-1/2 left-1/2 h-[115vh] w-[115vh] -translate-x-1/2 -translate-y-1/2" />
      <h1 className="text-h1 absolute inset-x-5 top-[100px] flex flex-col md:top-1/2 md:-translate-y-1/2 md:flex-row md:justify-between">
        <span>{about.heading[0]}</span>
        <span className="self-end md:self-auto">{about.heading[1]}</span>
      </h1>
      <p className="text-body absolute right-5 bottom-10 left-5 text-center text-grey md:top-[calc(50%-60px)] md:bottom-auto md:left-[33vw] md:right-auto md:w-[200px]">
        {about.label.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ Philosophy */
/*
  Pinned full-screen photo with a frosted card on the right (along the bottom on phones and tablets).
  Scrolling steps through Vision → Precision → Legacy: the photo cross-fades,
  the card's bars fill and its text blurs in.
*/
export function Philosophy() {
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const pillars = about.philosophy.pillars;
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(pillars.length - 1, Math.floor(value * pillars.length)));
  });

  return (
    <section ref={pinRef} data-theme="dark" className="relative h-[320vh] bg-black text-white">
      <div className="sticky top-0 h-svh overflow-hidden">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.name}
            className="absolute inset-0"
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <Image src={pillar.image.src} alt={pillar.image.alt} fill sizes="100vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <p className="text-h2 absolute top-[100px] left-5 max-w-[453px] pr-5 md:top-auto md:bottom-5 md:pr-0">
          {about.philosophy.caption[0]}
          <br />
          {about.philosophy.caption[1]}
        </p>

        <div className="absolute inset-x-5 bottom-5 flex flex-col rounded-[5px] bg-[rgba(80,80,80,0.85)] p-5 md:top-[103px] md:right-5 md:left-auto md:w-[453px]">
          <div className="flex gap-5">
            {pillars.map((pillar, index) => (
              <Bar key={pillar.name} index={index} count={pillars.length} progress={scrollYProgress} />
            ))}
          </div>
          <div className="mt-5 flex items-start justify-between md:mt-[35px]">
            <p className="text-h1">{active + 1}</p>
            <p className="text-small text-white/60">/ {pillars.length}</p>
          </div>
          <div className="relative mt-8 min-h-[130px] md:mt-auto md:mb-auto md:min-h-[110px]">
            {pillars.map((pillar, index) => (
              <div key={pillar.name} className="absolute inset-x-0 top-0">
                <BlurReveal text={pillar.name} show={index === active} className="text-h2" />
                <BlurReveal text={pillar.text} show={index === active} className="text-body mt-4 text-white/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Bar({ index, count, progress }: { index: number; count: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
  return (
    <div className="h-[2px] flex-1 bg-white/25">
      <motion.div style={{ scaleX: fill, originX: 0 }} className="h-full bg-white" />
    </div>
  );
}

/* ------------------------------------------------------------------ Story */
/* Lead line on the right, photo left, two paragraphs beside it. */
export function Story() {
  return (
    <section className="bg-white pt-[120px] md:pt-[240px]">
      <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
        <p className="text-h2 md:col-span-6 md:col-start-7">{about.story.lead}</p>
        <div className="relative aspect-[927/618] overflow-hidden rounded-[5px] md:col-span-8">
          <Image src={about.story.image.src} alt={about.story.image.alt} fill sizes="66vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-4 md:col-span-4 md:justify-end">
          {about.story.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 20)} className="text-body text-grey">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Numbers */
/* Three grey tiles: big number top-left, label bottom-right. */
export function Numbers() {
  return (
    <section className="bg-white pt-[120px] md:pt-[240px]">
      <ul className="grid grid-cols-1 gap-5 px-5 md:grid-cols-3">
        {about.numbers.map((number) => (
          <li key={number.value} className="flex min-h-[190px] flex-col justify-between rounded-[5px] bg-soft p-5 md:aspect-[453/414] md:min-h-0">
            <div>
              <p className="text-h1">{number.value}</p>
              <p className="text-small mt-4 text-grey">{number.note}</p>
            </div>
            <p className="text-h2 text-right">
              {number.label[0]}
              <br />
              {number.label[1]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

