"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { locationPage } from "@/content/pages";

/* ------------------------------------------------------------------ Hero */
/* Full-screen city photo with the headline across the top, small label in between. */
export function LocationHero() {
  return (
    <section data-theme="dark" className="relative h-svh overflow-hidden bg-black text-white">
      <Image src={locationPage.hero.src} alt={locationPage.hero.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
      <h1 className="text-h1 absolute inset-x-5 top-[110px] flex flex-col md:top-[160px] md:flex-row md:justify-between">
        <span>{locationPage.heading[0]}</span>
        <span className="self-end md:self-auto">{locationPage.heading[1]}</span>
      </h1>
      <p className="text-body absolute top-[250px] left-5 md:top-[170px] md:left-[44vw]">
        {locationPage.label[0]}
        <br />
        {locationPage.label[1]}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ Intro */
export function LocationIntro() {
  return (
    <section className="bg-white py-[120px] md:py-[240px]">
      <div className="grid grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-6 md:col-start-7">{locationPage.intro}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Travel times */
/*
  Black section: dark map of the picked area on the left,
  a panel on the right listing the areas; the tiles below show that area's travel times.
*/
export function TravelTimes() {
  const [picked, setPicked] = useState(0);
  const area = locationPage.areas[picked];

  return (
    <section data-theme="dark" className="relative bg-black pt-5 pb-[120px] text-white">
      <h2 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
        <span>{locationPage.timesHeading[0]}</span>
        <span className="self-end md:self-auto">{locationPage.timesHeading[1]}</span>
      </h2>

      <div className="mt-[80px] grid grid-cols-1 gap-5 px-5 md:mt-[160px] md:grid-cols-12">
        {/* Map */}
        <div className="relative aspect-square overflow-hidden rounded-[5px] md:col-span-8 md:aspect-[927/620]">
          {locationPage.areas.map((item, index) => (
            <motion.div
              key={item.name}
              className="absolute inset-0"
              animate={{ opacity: index === picked ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={item.map.src}
                alt={item.map.alt}
                fill
                sizes="66vw"
                className="object-cover opacity-70 [filter:grayscale(1)_invert(1)_contrast(1.4)_brightness(0.55)]"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000_90%)]" />
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-2">
            <span className="text-h2 rounded-[5px] border border-white px-3 py-1">{area.name}</span>
            <span className="text-small text-grey">{area.projects}</span>
          </div>
        </div>

        {/* Area list */}
        <div className="flex flex-col justify-between rounded-[5px] bg-[#151515] p-5 md:col-span-4">
          <p className="text-small text-grey">Areas</p>
          <ul className="mt-10 flex flex-col gap-1">
            {locationPage.areas.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => setPicked(index)}
                  className={`text-h2 flex w-full items-baseline justify-between text-left transition-colors duration-500 ${
                    index === picked ? "text-white" : "text-white/35 hover:text-white/70"
                  }`}
                >
                  {item.name}
                  <span className="text-small text-grey">{item.projects}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tiles for the picked area */}
      <ul className="mt-5 grid grid-cols-2 gap-5 px-5 md:grid-cols-4">
        {area.times.map((time) => (
          <motion.li
            key={`${area.name}-${time.place}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex aspect-[335/300] flex-col justify-between rounded-[5px] bg-[#151515] p-5"
          >
            <div>
              <p className="text-h1">{time.value}</p>
              <p className="text-small mt-4 text-grey">{time.unit}</p>
            </div>
            <p className="text-h2 text-right">{time.place}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
