"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project, ProjectStatus } from "@/content/projects";
import { PlusIcon } from "@/components/ui/Button";

/*
  Projects page body: status tabs, then a grid of project cards.
  A tab with no projects shows a short note instead of an empty grid.
*/
const TABS: ProjectStatus[] = ["Ongoing", "Upcoming", "Completed"];

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectStatus>("Ongoing");
  const shown = projects.filter((project) => project.status === active);

  return (
    <div className="px-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-[10px]" role="tablist" aria-label="Project status">
        {TABS.map((tab) => {
          const count = projects.filter((project) => project.status === tab).length;
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={`text-small flex h-[30px] items-center gap-3 rounded-[5px] px-[10px] transition-colors duration-500 ${
                isActive ? "bg-black text-white" : "bg-chip text-black hover:bg-[#dcdcdc]"
              }`}
            >
              {tab}
              <span className={isActive ? "text-white/50" : "text-grey"}>{String(count).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {shown.length === 0 ? (
        <p className="text-body mt-[120px] mb-[120px] max-w-[453px] text-grey">
          No completed projects are listed yet. Completed Globus homes will appear here as each project is handed over.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {shown.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[690/520] overflow-hidden rounded-[5px] bg-soft">
                  <Image
                    src={project.card.src}
                    alt={project.card.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] group-hover:scale-[1.03]"
                  />
                  <span className="text-small absolute top-[10px] left-[10px] rounded-[5px] bg-white/80 px-[10px] py-[8px] backdrop-blur-[20px]">
                    {project.status}
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-5">
                  <div>
                    <h2 className="text-h2">{project.name}</h2>
                    <p className="text-body mt-2 text-grey">
                      {project.area} · {project.tagline}
                    </p>
                  </div>
                  <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[5px] bg-chip">
                    <PlusIcon />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
