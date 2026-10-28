import Image from "next/image";
import Link from "next/link";
import { projects, fullProjects } from "@/content/projects";
import { showcase } from "@/content/home";
import { Button, PlusIcon } from "@/components/ui/Button";

/*
  The Globus projects. Each ongoing project fills the screen and stays put while the
  next one slides up over it (plain CSS `sticky`, no scroll scripts).
  The upcoming projects follow as two smaller cards.
*/
export function ProjectStack() {
  const upcoming = projects.filter((project) => project.kind === "upcoming");

  return (
    <section id="projects" className="relative z-10">
      <ul>
        {fullProjects.map((project, index) => {
          const photo = project.sections.tower.image;
          return (
            <li key={project.slug} data-theme="dark" className="sticky top-0 h-svh overflow-hidden bg-black text-white">
              <Image src={photo.src} alt={photo.alt} fill sizes="100vw" quality={90} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute inset-x-5 bottom-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-small text-white/70">
                    {String(index + 1).padStart(2, "0")} / {String(fullProjects.length).padStart(2, "0")} · {project.status}
                  </p>
                  <h3 className="text-h1 mt-3">{project.name}</h3>
                  <p className="text-body mt-2 text-white/80">
                    {project.area} · {project.tagline}
                  </p>
                </div>
                <Button href={`/projects/${project.slug}`} label={showcase.button} variant="light" onDark className="w-[217px]" />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Upcoming */}
      <div className="relative bg-white px-5 pt-5 pb-[120px] md:pb-[200px]">
        <h3 className="text-small text-grey">{showcase.upcoming}</h3>
        <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {upcoming.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[690/420] overflow-hidden rounded-[5px] bg-soft">
                  <Image
                    src={project.card.src}
                    alt={project.card.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-5">
                  <div>
                    <h4 className="text-h2">{project.name}</h4>
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
      </div>
    </section>
  );
}
