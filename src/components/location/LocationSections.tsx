"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { locationPage } from "@/content/pages";
import { mapAreaLabels, mapAspect, mapPins } from "@/content/locationMap";

/* ------------------------------------------------------------------ Hero */
/* Full-screen city photo with the headline across the top, small label in between. */
export function LocationHero() {
  return (
    <section data-theme="dark" className="relative h-svh overflow-hidden bg-black text-white">
      <Image src={locationPage.hero.src} alt={locationPage.hero.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
      {/* Phones: headline, then the label under it. Desktop: one row, the label sits in the gap
          between the two halves of the headline, so a longer word can never run into it. */}
      <div className="absolute inset-x-5 top-[110px] flex flex-col gap-5 md:top-[160px] md:flex-row md:items-start md:justify-between">
        <h1 className="text-h1 flex flex-col md:contents">
          <span>{locationPage.heading[0]}</span>
          <span className="md:order-last">{locationPage.heading[1]}</span>
        </h1>
        <p className="text-body shrink-0 md:mt-[10px]">
          {locationPage.label[0]}
          <br />
          {locationPage.label[1]}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Intro */
export function LocationIntro() {
  return (
    <section className="bg-white py-[60px] md:py-[240px]">
      <div className="grid grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-6 md:col-start-7">{locationPage.intro}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Travel times */
/*
  Black section, like aircenter.space/location "Transport / Accessibility":
  a dark street map of west Hyderabad fills the screen (real OpenStreetMap data, see tools/location-map),
  the areas are listed in a panel on the right, and picking one slowly moves the map to that area's
  projects and shows its travel times on a white card next to them.
*/
const MAP_ZOOM = 1.25; // the map is drawn a bit larger than the window so it has room to move
const MOVE = { duration: 1.4, ease: [0.65, 0, 0.35, 1] as const }; // slow and steady

export function TravelTimes() {
  const [picked, setPicked] = useState(0);
  const area = locationPage.areas[picked];
  const pins = mapPins.filter((pin) => (area.pins as readonly string[]).includes(pin.slug));

  // Size of the visible map window, so the map can be centred on the picked area.
  const frameRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ width: 1440, height: 900, wide: true });
  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setFrame({ width: element.clientWidth, height: element.clientHeight, wide: window.innerWidth >= 1024 }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Map size: covers the window, then zoomed.
  const mapWidth = Math.max(frame.width, frame.height * mapAspect) * MAP_ZOOM;
  const mapHeight = mapWidth / mapAspect;
  // Where the picked projects should land: left of the panel on desktop, the middle on phones.
  const focusX = frame.wide ? frame.width * 0.36 : frame.width / 2;
  const focusY = frame.height * (frame.wide ? 0.4 : 0.5); // a little high on desktop, so the card below fits
  const pinX = pins.reduce((sum, pin) => sum + pin.x, 0) / pins.length / 100;
  const pinY = pins.reduce((sum, pin) => sum + pin.y, 0) / pins.length / 100;
  const clamp = (value: number, min: number) => Math.min(0, Math.max(min, value));
  const mapX = clamp(focusX - pinX * mapWidth, frame.width - mapWidth);
  const mapY = clamp(focusY - pinY * mapHeight, frame.height - mapHeight);

  return (
    <section data-theme="dark" className="relative bg-black pt-5 pb-[60px] text-white">
      <h2 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
        <span>{locationPage.timesHeading[0]}</span>
        <span>{locationPage.timesHeading[1]}</span>
      </h2>

      <div className="relative mt-10 md:mt-[120px]">
        {/* Map window */}
        <div ref={frameRef} className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-svh">
          <motion.div
            className="absolute top-0 left-0"
            style={{ width: mapWidth, height: mapHeight }}
            initial={false}
            animate={{ x: mapX, y: mapY }}
            transition={MOVE}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a vector map; next/image would only pass it through */}
            <img src="/location/west-hyderabad.svg" alt="" className="absolute inset-0 size-full" />

            {mapAreaLabels.map((label) => (
              <span
                key={label.name}
                className="text-small absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[#6b6b6b]"
                style={{ left: `${label.x}%`, top: `${label.y}%` }}
              >
                {label.name}
              </span>
            ))}

            {mapPins.map((pin) => {
              const active = pins.includes(pin);
              return (
                <Link
                  key={pin.slug}
                  href={`/projects/${pin.slug}`}
                  className={`absolute flex -translate-x-[11px] -translate-y-full items-end gap-1.5 pb-0 transition-opacity duration-700 ${
                    active ? "z-10 opacity-100" : "opacity-35 hover:opacity-70"
                  }`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  {/* Square pin on the exact spot, name in an outlined box above it */}
                  <span className="mb-0 size-[22px] translate-y-1/2 rounded-[3px] bg-white" />
                  <span className="text-body md:text-h2 mb-3 rounded-[5px] border border-white px-2 py-1 md:px-3">{pin.label}</span>
                </Link>
              );
            })}

            {/* Travel times card, below-left of the area's first project (phones show it under the map) */}
            <motion.div
              key={area.name}
              className="absolute z-20 hidden -translate-x-full md:block"
              style={{ left: `calc(${pins[0].x}% + 11px)`, top: `${pins[0].y}%` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <TimesCard times={area.times} className="mt-6 w-[300px]" />
            </motion.div>
          </motion.div>

          {/* Soft edges so the map fades into the black page */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,transparent_14%,transparent_86%,#000_100%)]" />
        </div>

        {/* Area list: a panel over the map's right side on desktop, under the map on phones */}
        <div className="mx-5 mt-5 flex flex-col justify-between rounded-[5px] bg-[#151515] p-5 md:absolute md:top-[90px] md:right-0 md:bottom-5 md:mt-0 md:w-[calc((100%-260px)/3+60px)]">
          <p className="text-small text-grey">Areas</p>
          <ul className="mt-10 flex flex-col gap-1">
            {locationPage.areas.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => setPicked(index)}
                  aria-pressed={index === picked}
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

        <TimesCard key={area.name} times={area.times} className="mx-5 mt-5 md:hidden" />

        <p className="text-small mt-5 px-5 text-grey">
          Map data ©{" "}
          <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>{" "}
          contributors
        </p>
      </div>
    </section>
  );
}

/* White card: the picked area's travel times, one row each. */
function TimesCard({
  times,
  className = "",
}: {
  times: readonly { value: string; unit: string; place: string }[];
  className?: string;
}) {
  return (
    <ul className={`rounded-[5px] bg-white p-5 text-black ${className}`}>
      {times.map((time) => (
        <li key={time.place} className="flex items-baseline justify-between gap-5 border-b border-black/10 py-2 first:pt-0 last:border-0 last:pb-0">
          <span className="text-h2 whitespace-nowrap">
            {time.value} <span className="text-small text-grey">{time.unit}</span>
          </span>
          <span className="text-small text-right">{time.place}</span>
        </li>
      ))}
    </ul>
  );
}
