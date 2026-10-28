"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomesContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  Floor plans: the plan on the left, the list of home types on the right.
  Clicking a home type cross-fades to its plan.
*/
export function PlanViewer({ content: homes }: { content: HomesContent }) {
  const [active, setActive] = useState(0);

  return (
    <section id="plans" className="bg-white pt-[120px] pb-[120px] md:pt-[200px] md:pb-[200px]">
      <SplitHeading parts={homes.heading} />
      <p className="text-body mx-auto mt-5 max-w-[340px] px-5 text-center text-grey">{homes.intro}</p>

      <div className="mt-[60px] grid grid-cols-1 gap-5 px-5 md:mt-[100px] md:grid-cols-12">
        {/* All plans stacked; only the picked one is visible */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px] bg-soft md:col-span-8">
          {homes.slides.map((slide, index) => (
            <Image
              key={slide.image.src}
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className={`transition-opacity duration-500 ${slide.photo ? "object-cover" : "object-contain p-5"} ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col md:col-span-4">
          <ul role="tablist" aria-label="Home types">
            {homes.slides.map((slide, index) => (
              <li key={slide.text}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  onClick={() => setActive(index)}
                  className={`flex w-full gap-5 border-t border-black/10 py-4 text-left transition-colors duration-500 ${
                    index === active ? "text-black" : "text-grey hover:text-black"
                  }`}
                >
                  <span className="text-small shrink-0 pt-[2px]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-body">{slide.text}</span>
                </button>
              </li>
            ))}
          </ul>
          <Button href="#enquire" label="Enquire" className="mt-5 w-[217px] md:mt-auto" />
        </div>
      </div>
    </section>
  );
}
