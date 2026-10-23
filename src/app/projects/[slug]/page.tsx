import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProject, projects } from "@/content/projects";
import { Intro } from "@/components/home/Intro";
import { Tower } from "@/components/home/Tower";
import { Format } from "@/components/home/Format";
import { Crown } from "@/components/home/Crown";
import { Location } from "@/components/home/Location";
import { People } from "@/components/home/People";
import { Views } from "@/components/home/Views";
import { Homes } from "@/components/home/Homes";
import { Choose } from "@/components/home/Choose";
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

/* A project page: the same sections as the homepage, filled with this project's content. */
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

  const { sections } = project;
  return (
    <main>
      <Intro content={sections.intro} />
      <Tower content={sections.tower} />
      <Format content={sections.format} />
      <Crown content={sections.crown} />
      <Location content={sections.location} />
      <People content={sections.people} />
      <Views content={sections.views} />
      <Homes content={sections.homes} />
      <Choose content={sections.choose} />
      <Footer />
    </main>
  );
}
