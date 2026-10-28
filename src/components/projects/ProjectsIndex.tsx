import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

/*
  Projects page body, laid out like the "Services" section on findrealestate.com:
  a dark section with a label and a two-tone title, then one full-width row per project —
  a numbered circle, a short description, and the project name set very large.
  Hovering a row wipes the project's photo up behind it (dimmed, slowly settling from a slight zoom),
  underlines the name and slides in an arrow. The whole row links to the project page.
*/
const REVEAL = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const ongoing = projects.filter((project) => project.status === "Ongoing").length;
  const upcoming = projects.filter((project) => project.status === "Upcoming").length;

  return (
    <section data-theme="dark" className="bg-[#151717] py-[80px] text-white md:py-[112px]">
      {/* Label + title */}
      <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
        <p className="text-small md:col-span-5">Projects</p>
        <h2 className="text-h1 md:col-span-7 md:col-start-6">
          <span className="block">{ongoing} ongoing</span>
          <span className="block text-white/60">{upcoming} upcoming</span>
        </h2>
      </div>

      <ul className="mt-[60px] md:mt-[75px]">
        {projects.map((project, index) => (
          <li key={project.slug} className="border-t border-[#383a3a] last:border-b">
            <Link href={`/projects/${project.slug}`} className="group relative block overflow-hidden">
              {/* Photo: wipes up from the bottom on hover */}
              <div
                className={`absolute inset-0 scale-[1.05] opacity-0 [clip-path:inset(100%_0_0)] transition-[opacity,transform,clip-path] duration-[400ms,4000ms,1000ms] ${REVEAL} group-hover:scale-100 group-hover:opacity-40 group-hover:[clip-path:inset(0)] group-focus-visible:scale-100 group-focus-visible:opacity-40 group-focus-visible:[clip-path:inset(0)]`}
                aria-hidden="true"
              >
                <Image src={project.card.src} alt="" fill sizes="100vw" className="object-cover" />
              </div>

              <div className="relative grid grid-cols-[34px_1fr] gap-x-5 gap-y-8 px-5 py-[40px] md:min-h-[300px] md:grid-cols-12 md:py-[56px]">
                {/* Number in a circle */}
                <span className="text-small flex size-[34px] items-center justify-center rounded-full border border-white md:col-span-1">
                  {index + 1}
                </span>

                {/* Status + area, then a short description from the project's own copy */}
                <div className="md:col-span-3">
                  <p className="text-small text-white/60">
                    {project.status} · {project.area}
                  </p>
                  <p className="mt-3 line-clamp-6 text-[16px] leading-[24px] font-medium md:text-[18px] md:leading-[27px]">
                    {project.kind === "full" ? project.sections.tower.lead : project.description}
                  </p>
                </div>

                {/* Project name, very large, with an underline and an arrow on hover */}
                <div className="col-span-2 flex items-center justify-between md:col-span-7 md:col-start-6">
                  <span className="relative text-[64px] leading-[0.95] tracking-[-0.05em] md:text-[calc(180/1440*100vw)]">
                    {project.name}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-white transition-transform duration-1000 ${REVEAL} group-hover:scale-x-100 md:h-[5px]`}
                      aria-hidden="true"
                    />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="hidden size-[calc(140/1440*100vw)] -translate-x-[18px] opacity-0 transition-[opacity,transform] duration-[400ms,800ms] group-hover:translate-x-0 group-hover:opacity-100 md:block"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M3.315 10.996h16.623l-.884.707-8.084-8.135h2.526l8.261 8.337-8.286 8.337h-2.526l8.11-8.135.883.708H3.315z"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
