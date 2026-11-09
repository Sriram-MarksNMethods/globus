import type { FormatContent } from "@/content/types";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  Slides up over the hero (starts 50svh early, see Intro.tsx).
  Headline → intro, leading straight into the projects (ProjectStack.tsx).
*/
export function Format({ content: format }: { content: FormatContent }) {
  return (
    <section id="landmarks" className="relative z-10 -mt-[50svh] bg-white pt-[100px] pb-[60px] md:pt-[120px] md:pb-[40px]">
      <SplitHeading parts={format.heading} />

      <p className="text-copy mt-6 px-5 text-[#555] md:mx-auto md:mt-[240px] md:max-w-[340px] md:text-center md:text-grey">{format.intro}</p>
    </section>
  );
}
