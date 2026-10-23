"use client";

import type { ChooseContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { FinRibbon } from "@/components/brand/FinRibbon";

/*
  Last call to action above the footer: "Choose ... your home"
  with two buttons in the middle and the slow 3D fin ribbon behind it.
*/
export function Choose({ content: choose }: { content: ChooseContent }) {
  return (
    <section id="choose" className="relative z-10 flex h-[60vh] min-h-[420px] flex-col justify-end overflow-hidden bg-white px-5 pb-5">
      <FinRibbon className="absolute -top-[16vh] left-1/2 aspect-square h-[85vh] -translate-x-1/2" />

      <div className="relative grid grid-cols-2 items-end gap-5 md:grid-cols-12">
        <h2 className="text-h1 col-span-2 md:col-span-4">{choose.heading[0]}</h2>
        {choose.buttons.map((button) => (
          <Button
            key={button.label}
            href={button.href}
            label={button.label}
            variant={button.dark ? "dark" : "light"}
            className="md:col-span-2"
          />
        ))}
        <p className="text-h1 col-span-2 text-right md:col-span-4" aria-hidden="true">
          {choose.heading[1]}
        </p>
      </div>
    </section>
  );
}
