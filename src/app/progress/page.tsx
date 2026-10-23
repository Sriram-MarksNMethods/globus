import type { Metadata } from "next";
import { progress } from "@/content/pages";
import { ProgressBoard } from "@/components/progress/ProgressBoard";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Construction progress | Globus Developers",
  description: "Site updates from Globus Developers’ ongoing projects in Hyderabad.",
};

/* Construction progress: headline with a hairline, project tabs, the latest update. */
export default function ProgressPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 relative flex flex-col border-b border-black/10 px-5 pb-5 md:mx-5 md:flex-row md:justify-between md:px-0">
          <span>{progress.heading[0]}</span>
          <span className="text-small my-3 text-grey md:absolute md:top-2 md:left-[calc(50vw-40px)] md:my-0">
            {progress.label[0]}
            <br />
            {progress.label[1]}
          </span>
          <span className="self-end md:self-auto">{progress.heading[1]}</span>
        </h1>
        <div className="mt-10">
          <ProgressBoard />
        </div>
      </section>
      <Footer breadcrumb="Construction progress" />
    </main>
  );
}
