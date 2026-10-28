"use client";

import type { ChooseContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { FinRibbon } from "@/components/brand/FinRibbon";

/*
  Last call to action above the footer: "Choose ... your home"
  with two buttons along the bottom and the slow 3D fin ribbon filling the screen behind it
  (a white fade at the bottom keeps the heading readable).
*/
export function Choose({ content: choose }: { content: ChooseContent }) {
  return (
    <section id="choose" className="relative z-10 flex h-[80svh] min-h-[520px] flex-col md:h-svh md:min-h-[560px] justify-end overflow-hidden bg-white px-5 pb-5">
      <FinRibbon fill className="absolute inset-0 size-full" />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-white via-white/70 to-transparent" />

      <div className="relative grid grid-cols-2 items-end gap-5 md:grid-cols-12">
        <h2 className="text-h1 col-span-2 md:col-span-4">
          {choose.heading[0]}
          <span className="md:hidden"> {choose.heading[1]}</span>
        </h2>
        {choose.buttons.map((button) => (
          <Button
            key={button.label}
            href={button.href}
            label={button.label}
            variant={button.dark ? "dark" : "light"}
            className="md:col-span-2"
          />
        ))}
        <p className="text-h1 col-span-4 hidden text-right md:block" aria-hidden="true">
          {choose.heading[1]}
        </p>
      </div>
    </section>
  );
}
