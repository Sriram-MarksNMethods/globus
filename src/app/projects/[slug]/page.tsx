import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProject, projects } from "@/content/projects";
import {
  Amenities, Enquire, Highlights, KeyFacts, MoreProjects, Overview, ProjectHero, ProjectLocation,
} from "@/components/project/ProjectSections";
import { Gallery } from "@/components/project/Gallery";
import { PlanViewer } from "@/components/project/PlanViewer";
import { ScrollSequence } from "@/components/project/ScrollSequence";
import { UpcomingProjectPage } from "@/components/projects/UpcomingProjectPage";
import { Footer } from "@/components/layout/Footer";

type Props = { params: Promise<{ slug: string }> };

// One page per project, built at build time.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: `${project.name}, ${project.area} | Globus Developers`,
    description: `${project.name} by Globus Developers: ${project.tagline} in ${project.area}.${project.rera ? ` TG RERA ${project.rera}.` : ""}`,
  };
}

/* A project page: a buyer's page with its own sections (not the homepage's), filled with this project's content. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  if (project.kind === "upcoming") {
    return (
      <main>
        <UpcomingProjectPage project={project} />
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <ProjectHero project={project} />
      <KeyFacts project={project} />
      <Overview project={project} />
      {project.sequence && <ScrollSequence folder={project.sequence.folder} frames={project.sequence.frames} />}
      <Highlights project={project} />
      <Gallery content={project.sections.views} />
      <Amenities project={project} />
      <PlanViewer content={project.sections.homes} />
      <ProjectLocation project={project} />
      <Enquire project={project} />
      <MoreProjects project={project} />
      <Footer breadcrumb={project.name} />
    </main>
  );
}
