import Image from "next/image";
import Link from "next/link";
import type { FullProject } from "@/content/projects";
import { fullProjects } from "@/content/projects";
import { contact, office } from "@/content/company";
import { Consent, Field, LeadForm } from "@/components/forms/LeadForm";
import { Button, PlusIcon } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/*
  The sections of a project page, top to bottom.
  A project page is a buyer's page: facts, homes, plans, location and an enquiry form.
  It deliberately looks different from the homepage (no pinned scroll scenes) and
  costs little to scroll: plain images and CSS, the only moving parts are the
  gallery slider (Gallery.tsx) and the plan switcher (PlanViewer.tsx).
*/

type Props = { project: FullProject };

/* ------------------------------------------------------------------ Hero */
/* Full-screen photo, the project name very large on its bottom edge, key details on the right. */
export function ProjectHero({ project }: Props) {
  const { intro, tower } = project.sections;
  return (
    <section data-theme="dark" className="relative h-svh min-h-[560px] overflow-hidden bg-black text-white">
      <Image src={tower.image.src} alt={tower.image.alt} fill priority sizes="100vw" quality={90} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <nav aria-label="Breadcrumb" className="text-small absolute top-[80px] left-5 flex gap-2 text-white/60">
        <Link href="/projects" className="hover:text-white">
          Projects
        </Link>
        <span>/</span>
        <span className="text-white">{project.name}</span>
      </nav>

      <div className="absolute inset-x-5 bottom-5 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-5">
        <div className="md:col-span-8">
          <p className="text-small text-white/60">
            {project.status} · {project.area}
          </p>
          <h1 className="mt-3 text-[16vw] leading-[0.82] font-normal tracking-[-0.05em] uppercase md:text-[13vw]">{project.name}</h1>
          <p className="text-h2 mt-5">
            {intro.heading[0]} {intro.heading[1]}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-5 border-t border-white/20 pt-4 md:col-span-3 md:col-start-10 md:grid-cols-1 md:gap-4">
          <div>
            <dt className="text-small text-white/60">Homes</dt>
            <dd className="text-body mt-1">{project.tagline}</dd>
          </div>
          {project.rera && (
            <div>
              <dt className="text-small text-white/60">TG RERA</dt>
              <dd className="text-body mt-1">{project.rera}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Facts */
/* The key numbers in a row of cells divided by hairlines. */
export function KeyFacts({ project }: Props) {
  return (
    <section className="bg-white px-5 pt-5">
      <dl className="grid grid-cols-2 border-t border-black/10 md:grid-cols-5">
        {project.facts.map((fact) => (
          <div key={fact.label} className="border-b border-black/10 py-5 pr-5 md:border-b-0">
            <dd className="text-h2">{fact.value}</dd>
            <dt className="text-small mt-2 text-grey">{fact.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ Overview */
/* Headline, lead text and intro side by side, then two photos of different sizes. */
export function Overview({ project }: Props) {
  const { tower } = project.sections;
  return (
    <section className="bg-white pt-[120px] md:pt-[200px]">
      <SplitHeading parts={tower.heading} />

      <div className="mt-10 grid grid-cols-1 gap-5 px-5 md:mt-[80px] md:grid-cols-12">
        <p className="text-h2 md:col-span-6">{tower.lead}</p>
        <p className="text-body text-grey md:col-span-4 md:col-start-9">{tower.intro}</p>
      </div>

      <div className="mt-[60px] grid grid-cols-1 gap-5 px-5 md:mt-[120px] md:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px] md:col-span-7">
          <Image src={tower.images[0].src} alt={tower.images[0].alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] md:col-span-5 md:mt-[18vw]">
          <Image src={tower.images[1].src} alt={tower.images[1].alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Highlights */
/* A full-bleed photo under its headline, then the intro and two numbered highlights. */
export function Highlights({ project }: Props) {
  const { format } = project.sections;
  return (
    <section className="bg-white pt-[120px] md:pt-[200px]">
      <h2 className="text-h1 px-5 md:max-w-[60vw]">{format.heading.join(" ")}</h2>

      <div className="relative mt-10 aspect-[4/3] w-full md:mt-[60px] md:aspect-[1440/720]">
        <Image src={format.image.src} alt={format.image.alt} fill sizes="100vw" className="object-cover" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 px-5 md:mt-[60px] md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-5">{format.intro}</p>
        {format.slides.map((slide, index) => (
          <div key={slide} className="border-t border-black/10 pt-4 md:col-span-3 md:first-of-type:col-start-7">
            <p className="text-small text-grey">{String(index + 1).padStart(2, "0")}</p>
            <p className="text-body mt-3">{slide}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Amenities */
/* Black section: headline, a large clubhouse photo with a smaller one and the amenity title beside it. */
export function Amenities({ project }: Props) {
  const { crown, people } = project.sections;
  return (
    <section data-theme="dark" className="mt-[120px] bg-black pt-5 pb-[120px] text-white md:mt-[200px] md:pb-[200px]">
      <p className="text-small px-5 text-grey">{people.label}</p>
      <SplitHeading parts={people.heading} className="mt-3" />

      <div className="mt-[60px] grid grid-cols-1 gap-5 px-5 md:mt-[120px] md:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px] md:col-span-8">
          <Image src={crown.background.src} alt={crown.background.alt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-5 md:col-span-4">
          <h3 className="text-h2">{crown.title}</h3>
          <div className="relative aspect-square overflow-hidden rounded-[5px] md:mt-auto">
            <Image src={crown.image.src} alt={crown.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-[5px] md:col-span-12 md:aspect-[1400/560]">
          <Image src={people.image.src} alt={people.image.alt} fill sizes="100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Location */
/* Black section: lead text and travel times on the left, the map on the right. */
export function ProjectLocation({ project }: Props) {
  const { location } = project.sections;
  return (
    <section id="location" data-theme="dark" className="bg-black pt-5 pb-[120px] text-white md:pb-[200px]">
      <SplitHeading parts={location.heading} />

      <div className="mt-[60px] grid grid-cols-1 gap-10 px-5 md:mt-[120px] md:grid-cols-12 md:gap-5">
        <div className="md:col-span-5">
          <p className="text-h2">{location.lead}</p>
          <ul className="mt-10">
            {location.times.map((time) => (
              <li key={time.place} className="flex items-baseline justify-between gap-5 border-t border-white/15 py-4">
                <span className="text-body">{time.place}</span>
                <span className="text-h2 shrink-0">
                  {time.minutes} <span className="text-small text-grey">{time.unit.join(" ")}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-body mt-5 text-grey">{location.mapText}</p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px] md:col-span-7 md:aspect-auto md:min-h-[560px]">
          <Image
            src={location.map.src}
            alt={location.map.alt}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover opacity-60 [filter:grayscale(1)_invert(1)_contrast(1.4)_brightness(0.55)]"
          />
          <span className="text-h2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[5px] border border-white px-3 py-1">
            {location.project}
          </span>
          <Button href={location.mapsUrl} label={location.mapButton} variant="light" onDark className="absolute right-5 bottom-5 w-[217px]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Enquire */
/* Headline and phone on the left, the enquiry form (this project already picked) on the right. */
export function Enquire({ project }: Props) {
  return (
    <section id="enquire" className="bg-white pt-[120px] pb-[160px] md:pt-[200px]">
      <div className="grid grid-cols-1 gap-10 px-5 md:grid-cols-12 md:gap-5">
        <div className="flex flex-col gap-5 md:col-span-5">
          <h2 className="text-h1">
            Enquire about
            <br />
            {project.name}
          </h2>
          <p className="text-body text-grey">{contact.intro}</p>
          <div className="flex flex-col gap-1 md:mt-auto">
            {office.phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="text-h2 hover:text-grey">
                {phone.label}
              </a>
            ))}
            <a href={`mailto:${office.email}`} className="text-body mt-2 text-grey hover:text-black">
              {office.email}
            </a>
          </div>
        </div>

        <div className="rounded-[5px] bg-soft p-5 md:col-span-7 md:p-10">
          <LeadForm form="contact" submitLabel="Submit enquiry">
            <input type="hidden" name="project" value={project.name} />
            <Field name="name" label="Full name" autoComplete="name" />
            <Field name="phone" label="Mobile number" type="tel" autoComplete="tel" />
            <Field name="email" label="Email" type="email" autoComplete="email" wide />
            <Consent text={contact.consent} />
          </LeadForm>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ More projects */
/* The other ongoing projects as cards. */
export function MoreProjects({ project }: Props) {
  const others = fullProjects.filter((other) => other.slug !== project.slug);
  return (
    <section className="border-t border-black/10 bg-white px-5 pt-5 pb-[160px]">
      <h2 className="text-small text-grey">Other landmarks</h2>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {others.map((other) => (
          <li key={other.slug}>
            <Link href={`/projects/${other.slug}`} className="group block">
              <div className="relative aspect-[453/340] overflow-hidden rounded-[5px] bg-soft">
                <Image
                  src={other.card.src}
                  alt={other.card.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-h2">{other.name}</h3>
                  <p className="text-body mt-2 text-grey">
                    {other.area} · {other.tagline}
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
    </section>
  );
}
