import type { Metadata } from "next";
import { GBuild, GCompass, GDots, GDrag, GLouvres, GRipple, GSpotlight, GWindow } from "@/components/brand/GOptions";
import { GGlobe } from "@/components/brand/GGlobe";
import { GMetal } from "@/components/brand/GMetal";
import { GSkyline } from "@/components/brand/GSkyline";
import { GTowers } from "@/components/brand/GTowers";

export const metadata: Metadata = {
  title: "G options (trial) | Globus Developers",
  robots: { index: false, follow: false },
};

/* Trial page: different interactive versions of the Globus G, one per screen (D–N). */
function Label({ letter, name, note, dark = false }: { letter: string; name: string; note: string; dark?: boolean }) {
  return (
    <div className={`pointer-events-none absolute bottom-5 left-5 max-w-[320px] ${dark ? "text-white" : ""}`}>
      <p className="text-h2">
        {letter}. {name}
      </p>
      <p className="text-body mt-2 text-grey">{note}</p>
    </div>
  );
}

export default function GOptionsPage() {
  return (
    <main className="bg-white">

      <section className="relative h-svh bg-[#e2e2e2]">
        <GMetal className="absolute inset-0" />
        <Label letter="D" name="Metal" note="Solid 3D blades, plum metal and copper; turns slowly towards the pointer and catches the light." />
      </section>

      <section className="relative h-svh">
        <GCompass className="absolute inset-0" />
        <Label letter="E" name="Compass" note="Every dash turns to point at the pointer, then swings back into the G when it leaves." />
      </section>

      <section className="relative bg-soft">
        <GBuild />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-svh">
          <Label letter="F" name="Build" note="Keep scrolling: the dashes slide in from outside and lock into the G." />
        </div>
      </section>

      <section className="relative h-svh">
        <GDots className="absolute inset-0" />
        <Label letter="G" name="Dots" note="The G drawn in fine dots; they drift away from the pointer and ease back into place." />
      </section>

      <section className="relative h-svh bg-soft">
        <GRipple className="absolute inset-0" />
        <Label letter="H" name="Ripple" note="Move onto the G: a ripple runs round the ring from the nearest dash." />
      </section>

      <section className="relative h-svh">
        <GSpotlight className="absolute inset-0" />
        <Label letter="I" name="Spotlight" note="A fine outline of the G; a soft spotlight follows the pointer and shows it in colour." />
      </section>

<section className="relative h-svh bg-[#e2e2e2]">
        <GSkyline className="absolute inset-0" />
        <Label letter="J" name="Skyline" note="The G laid flat like a site plan; blocks near the pointer rise into towers and sink back." />
      </section>

      <section className="relative h-svh bg-[#ebe8e3]">
        <GSkyline look="clay" className="absolute inset-0" />
        <Label letter="J2" name="Clay model" note="A white architect's model of the G; blocks near the pointer rise and take on the logo colours." />
      </section>

      <section data-theme="dark" className="relative h-svh bg-[#0b0b10] text-white">
        <GSkyline look="night" className="absolute inset-0" />
        <Label letter="J3" name="Night" note="The G as a city at night; blocks near the pointer rise and glow in the logo colours." />
      </section>

      <section className="relative h-svh bg-[#e2e2e2]">
        <GSkyline look="glass" className="absolute inset-0" />
        <Label letter="J4" name="Glass" note="Tinted glass blocks; the ones near the pointer rise into glass towers." />
      </section>

      <section className="relative h-svh bg-[#e2e2e2]">
        <GSkyline rise="stairs" className="absolute inset-0" />
        <Label letter="J5" name="Stairs" note="A fixed skyline climbing round the G from the crossbar; the view swings a little with the pointer, the block under it lifts." />
      </section>

      <section className="relative h-svh bg-[#ebe8e3]">
        <GSkyline look="clay" rise="stairs" className="absolute inset-0" />
        <Label letter="J6" name="Stairs, clay" note="The same climbing skyline as a white model; blocks near the pointer show their colour." />
      </section>

<section className="relative h-[300vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="rise" className="absolute inset-0" />
          <Label letter="J7" name="Scroll" note="Keep scrolling: the flat G seen from above rises into the climbing skyline as the view lowers." />
        </div>
      </section>

      <section className="relative h-[300vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="orbit" className="absolute inset-0" />
          <Label letter="J8" name="Scroll, orbit" note="As J7, while the view also travels a third of the way round the G." />
        </div>
      </section>

      <section className="relative h-[300vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="stagger" className="absolute inset-0" />
          <Label letter="J9" name="Scroll, construction" note="The view lowers, then the towers go up one after another round the ring, from the crossbar to the orange tip." />
        </div>
      </section>

      <section className="relative h-[300vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="street" className="absolute inset-0" />
          <Label letter="J10" name="Scroll, street level" note="The skyline grows, then the view drops close to the ground so the towers loom overhead." />
        </div>
      </section>

      <section className="relative h-[400vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GTowers className="absolute inset-0" />
          <Label letter="J10+" name="Towering, day" note="J10, more imposing: the towers keep growing as you drop to the ground; low sun behind them, long shadows, wide lens looking up." />
        </div>
      </section>

      <section data-theme="dark" className="relative h-[400vh] bg-[#121116]">
        <div className="sticky top-0 h-svh">
          <GTowers mood="dusk" className="absolute inset-0" />
          <Label letter="J10+" name="Towering, dusk" note="The same at dusk: dark sky, warm low sun behind the towers, their faces in shadow." dark />
        </div>
      </section>

      <section className="relative h-[300vh] bg-[#ebe8e3]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="finish" look="clay" className="absolute inset-0" />
          <Label letter="J11" name="Scroll, model to colour" note="A white architect's model grows, then the logo colours fill in tower by tower." />
        </div>
      </section>

      <section className="relative h-[300vh] bg-[#e2e2e2]">
        <div className="sticky top-0 h-svh">
          <GSkyline rise="scroll" story="reverse" className="absolute inset-0" />
          <Label letter="J12" name="Scroll, reverse" note="Starts as the skyline at an angle; scrolling flattens it into the logo seen from straight above." />
        </div>
      </section>

      <section className="relative h-svh">
        <GGlobe className="absolute inset-0" />
        <Label letter="K" name="Globe" note="Globus as a globe of small dashes, orange cap like the logo. Turns slowly; drag to spin it." />
      </section>

      <section className="relative h-svh bg-soft">
        <GLouvres className="absolute inset-0" />
        <Label letter="L" name="Louvres" note="Each dash is a fin that turns on its own axis, like louvres on a facade, as the pointer passes." />
      </section>

      <section className="relative h-svh">
        <GWindow className="absolute inset-0" />
        <Label letter="M" name="Window" note="Project renders seen through the G, drifting against the pointer and changing every few seconds." />
      </section>

      <section className="relative h-svh bg-soft">
        <GDrag className="absolute inset-0" />
        <Label letter="N" name="Drag" note="Grab any dash and pull it out; let go and it springs back into the G." />
      </section>
    </main>
  );
}
