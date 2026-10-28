import Image from "next/image";
import type { UpcomingProject } from "@/content/projects";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  Short page for a project that hasn't launched yet:
  full-bleed photo with the headline on its bottom edge, a description, and a register-interest call.
*/
export function UpcomingProjectPage({ project }: { project: UpcomingProject }) {
  return (
    <>
      <section data-theme="dark" className="relative h-svh overflow-hidden bg-black text-white">
        <Image src={project.hero.src} alt={project.hero.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 md:flex-row md:items-end">
          <p className="text-small md:w-[calc(2*(100vw-260px)/12+40px)] md:shrink-0">
            {project.name} · {project.status}
          </p>
          <h1 className="text-h1 flex flex-1 flex-col md:flex-row md:justify-between">
            <span>{project.heading[0]}</span>
            <span>{project.heading[1]}</span>
          </h1>
        </div>
      </section>

      <section className="bg-white pt-[60px] pb-[80px] md:pt-[240px]">
        <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
          <p className="text-h2 md:col-span-6 md:col-start-7">{project.description}</p>
        </div>
        <SplitHeading parts={["Register", "your interest"]} className="mt-[60px] md:mt-[240px]" />
        <div className="mt-5 flex gap-5 px-5">
          <Button href="tel:+919519781978" label="Call +91 95 1978 1978" className="w-[217px]" />
          <Button href="mailto:info@globusdevelopers.com" label="Email us" variant="light" className="w-[217px]" />
        </div>
      </section>
    </>
  );
}
