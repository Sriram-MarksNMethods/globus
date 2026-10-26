"use client";

import Image from "next/image";
import type { LocationContent } from "@/content/types";
import { Button } from "@/components/ui/Button";

/*
  Black section: headline → text + photo → four travel-time tiles → dark map.
*/
export function Location({ content: location }: { content: LocationContent }) {
  return (
    <section id="location" data-theme="dark" className="relative z-10 bg-black pt-5 text-white">
      {/* Headline with a small label in the middle */}
      <h2 className="text-h1 relative flex flex-col px-5 md:flex-row md:justify-between">
        <span>{location.heading[0]}</span>
        <span className="text-body my-3 text-white md:absolute md:top-0 md:left-[55.4vw] md:my-0">
          {location.label[0]}
          <br />
          {location.label[1]}
        </span>
        <span className="self-end md:self-auto">{location.heading[1]}</span>
      </h2>

      {/* Lead text, then photo + button + small text */}
      <div className="mt-[120px] grid grid-cols-1 gap-5 px-5 md:mt-[240px] md:grid-cols-12">
        <p className="text-h2 md:col-span-6 md:col-start-7">{location.lead}</p>

        <div className="relative aspect-[927/591] overflow-hidden rounded-[5px] md:col-span-8">
          <Image src={location.image.src} alt={location.image.alt} fill sizes="66vw" className="object-cover" />
        </div>

        <div className="flex flex-col gap-5 md:col-span-4">
          <Button href={location.button.href} label={location.button.label} variant="light" onDark className="w-[217px] md:mt-[17vw] md:self-end" />
          <p className="text-body text-grey md:mt-auto">{location.text}</p>
        </div>
      </div>

      {/* Travel-time tiles */}
      <div className="relative mt-[160px] md:mt-[320px]">
        <ul className="relative grid grid-cols-2 gap-5 px-5 md:grid-cols-4">
          {location.times.map((time) => (
            <li
              key={time.place}
              className="flex aspect-[335/414] flex-col justify-between rounded-[5px] bg-[#151515]/80 p-5 backdrop-blur-[20px]"
            >
              <div>
                <p className="text-h1">{time.minutes}</p>
                <p className="text-small mt-4 text-grey">
                  {time.unit[0]}
                  <br />
                  {time.unit[1]}
                </p>
              </div>
              <p className="text-h2 text-right">{time.place}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[120px] grid grid-cols-1 px-5 md:mt-[230px] md:grid-cols-12 md:gap-5">
        <p className="text-body text-grey md:col-span-4 md:col-start-7">{location.mapText}</p>
      </div>

      {/* Dark map with the Neo marker */}
      <div id="map" className="relative mt-10 h-[85vh] overflow-hidden">
        <Image
          src={location.map.src}
          alt={location.map.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-60 [filter:grayscale(1)_invert(1)_contrast(1.4)_brightness(0.55)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_85%)]" />
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-2">
          <span className="text-h2 rounded-[5px] border border-white px-3 py-1">{location.project}</span>
          <span className="text-small text-grey">Neopolis</span>
        </div>
        <Button
          href={location.mapsUrl}
          label={location.mapButton}
          variant="light"
          onDark
          className="absolute right-5 bottom-5 w-[217px]"
        />
      </div>
    </section>
  );
}
