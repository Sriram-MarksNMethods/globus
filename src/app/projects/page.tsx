import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Projects | Globus Developers",
  description: "Ongoing and upcoming homes by Globus Developers in Hyderabad: Neo, Altus, Treasor, Floresta, Westlyn and Tukkuguda.",
};

/* Projects page: tunnel hero with the title, then one large row per project. */
export default function ProjectsPage() {
  return (
    <main className="bg-white">
      <ProjectsHero />

      <ProjectsIndex projects={projects} />

      <Footer />
    </main>
  );
}
