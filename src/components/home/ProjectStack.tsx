"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { projects } from "@/content/projects";
import { showcase } from "@/content/home";
import { PlusIcon } from "@/components/ui/Button";

/*
  Homepage projects section (from the "(Home)wise" clients screen): a dark full-screen section,
  "Our projects" in thin brackets, then all six projects.

  Desktop: a row of landscape cards drifting left on its own; drag it either way; hovering a card stops the
  row, shrinks the photo to the top and slides up a panel with the details.
  Phones and portrait tablets: one tall card at a time, already showing its details, with a big
  "View project" button; the next card slides in every few seconds or on a swipe.
*/
const all = projects.map((project) => ({
  slug: project.slug,
  href: `/projects/${project.slug}`,
  name: project.name,
  area: project.area,
  status: project.status,
  tagline: project.tagline,
  photo: project.kind === "full" ? project.sections.tower.image : project.card,
}));

const DRIFT_MS = 90000; // time for the row to travel one full set of cards

/*
  The row drifts left on its own and can be dragged (mouse or finger) either way; after a drag it keeps
  gliding with the throw and slows back into the drift. Hovering a card stops the drift.
  The cards are listed twice: when the row has travelled one set's width it jumps back by that width,
  which looks seamless because the second set is identical.
*/
export function ProjectStack() {
  const row = [...all, ...all];
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const state = useRef({ hovered: false, dragging: false, startX: 0, startPointer: 0, lastPointer: 0, lastTime: 0, velocity: 0, moved: 0 });

  const setWrapped = (value: number) => {
    const setWidth = (trackRef.current?.scrollWidth ?? 0) / 2;
    if (!setWidth) return x.set(value);
    let v = value % setWidth;
    if (v > 0) v -= setWidth;
    x.set(v);
  };

  useAnimationFrame((_, delta) => {
    const st = state.current;
    if (st.dragging) return;
    const setWidth = (trackRef.current?.scrollWidth ?? 0) / 2;
    const drift = reduceMotion || st.hovered ? 0 : -setWidth / DRIFT_MS; // px per ms
    // After a throw, the velocity eases back to the drift speed.
    st.velocity += (drift - st.velocity) * Math.min(1, delta / 400);
    setWrapped(x.get() + st.velocity * delta);
  });

  const onPointerDown = (event: React.PointerEvent) => {
    const st = state.current;
    st.dragging = true;
    st.startX = x.get();
    st.startPointer = st.lastPointer = event.clientX;
    st.lastTime = performance.now();
    st.moved = 0;
    st.velocity = 0;
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const st = state.current;
    if (!st.dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - st.lastTime);
    st.velocity = (event.clientX - st.lastPointer) / dt;
    st.lastPointer = event.clientX;
    st.lastTime = now;
    st.moved = Math.max(st.moved, Math.abs(event.clientX - st.startPointer));
    // Only take over the pointer once it's clearly a drag, so a plain click still reaches the link.
    const track = event.currentTarget as HTMLElement;
    if (st.moved > 6 && !track.hasPointerCapture(event.pointerId)) track.setPointerCapture(event.pointerId);
    setWrapped(st.startX + event.clientX - st.startPointer);
  };
  const onPointerUp = () => {
    state.current.dragging = false;
  };
  // A drag shouldn't also open the project under the pointer.
  const onClickCapture = (event: React.MouseEvent) => {
    if (state.current.moved > 6) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <section id="projects" data-theme="dark" className="relative z-10 flex h-svh min-h-[640px] flex-col justify-center overflow-hidden bg-[#111111] text-white">
      <div className="mb-[40px] flex justify-center">
        <h2 className="text-h1 relative px-5">
          <span className="absolute inset-y-0 left-0 w-3 border-y border-l border-white/50" aria-hidden="true" />
          {showcase.heading}
          <span className="absolute inset-y-0 right-0 w-3 border-y border-r border-white/50" aria-hidden="true" />
        </h2>
      </div>
      <motion.div
        ref={trackRef}
        style={{ x }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => (state.current.hovered = true)}
        onMouseLeave={() => (state.current.hovered = false)}
        onClickCapture={onClickCapture}
        className="hidden w-max cursor-grab touch-pan-y gap-5 select-none active:cursor-grabbing md:flex"
      >
        {row.map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            href={project.href}
            draggable={false}
            aria-hidden={i >= all.length ? true : undefined}
            tabIndex={i >= all.length ? -1 : undefined}
            className="group relative block aspect-[3/2] w-[82vw] shrink-0 overflow-hidden rounded-[10px] bg-[#222] md:w-[min(36vw,80svh)]"
          >
            {/* Photo: fills the card, shrinks to the top 45% on hover */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-[10px] transition-[height] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:h-[45%] group-focus-visible:h-[45%]">
              <Image src={project.photo.src} alt={project.photo.alt} fill sizes="(min-width: 1024px) 36vw, 82vw" quality={90} draggable={false} className="object-cover" />
            </div>
            {/* Panel underneath */}
            <div className="absolute inset-x-0 bottom-0 flex h-[55%] translate-y-6 flex-col justify-between p-4 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <div>
                <p className="text-small text-white/50">
                  {project.status} · {project.area}
                </p>
                <p className="text-h2 mt-2">{project.name}</p>
                <p className="text-body mt-2 text-white/60">{project.tagline}</p>
              </div>
              <p className="text-small text-orange">{showcase.button} →</p>
            </div>
            {/* Name tag shown when the panel is closed (and always on touch screens) */}
            <p className="text-small absolute bottom-3 left-3 rounded-[5px] bg-black/60 px-2 py-1 transition-opacity duration-500 group-hover:opacity-0">
              {project.name}
            </p>
          </Link>
        ))}
      </motion.div>

      {/* Phones and portrait tablets: no hover, so one tall card at a time, already open */}
      <PhoneSlider />

      <p className="text-small absolute bottom-5 left-5 text-white/50">{showcase.corner}</p>
      <p className="text-small absolute right-5 bottom-5 hidden text-white/50 md:block">{showcase.hintDesktop}</p>
      <p className="text-small absolute right-5 bottom-5 text-white/50 md:hidden">{showcase.hintPhone}</p>
    </section>
  );
}

// True only in the browser. Swiper reads the clock while it renders, which can't happen
// while Next pre-builds the page, so the server sends the first card on its own instead.
const noSubscribe = () => () => {};
function useInBrowser() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

/* Phones: one card fills the width, the next slides in every few seconds (or on a swipe). */
function PhoneSlider() {
  const inBrowser = useInBrowser();

  if (!inBrowser) {
    return (
      <div className="px-5 md:hidden">
        <OpenCard project={all[0]} />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      loop
      speed={900}
      slidesPerView={1}
      spaceBetween={20}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      className="w-full !px-5 md:!hidden"
    >
      {all.map((project) => (
        <SwiperSlide key={project.slug}>
          <OpenCard project={project} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

/* The desktop card as it looks while hovered: photo on top, panel underneath, big button at the bottom. */
function OpenCard({ project }: { project: (typeof all)[number] }) {
  return (
    <div className="flex h-[min(64svh,560px)] flex-col overflow-hidden rounded-[10px] bg-[#222]">
      <Link href={project.href} tabIndex={-1} aria-hidden="true" className="relative block h-[45%] overflow-hidden rounded-[10px]">
        <Image src={project.photo.src} alt={project.photo.alt} fill sizes="100vw" quality={90} className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-small text-white/50">
            {project.status} · {project.area}
          </p>
          <p className="text-h2 mt-2">{project.name}</p>
          <p className="text-copy mt-2 text-white/60">{project.tagline}</p>
        </div>
        <Link
          href={project.href}
          className="flex h-[60px] items-center justify-between rounded-[5px] bg-white px-5 text-[17px] font-medium text-black active:bg-[#d6d6d6]"
        >
          {showcase.button}
          <PlusIcon />
        </Link>
      </div>
    </div>
  );
}
