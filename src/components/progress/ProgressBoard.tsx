"use client";

import { useState } from "react";
import { progress } from "@/content/pages";
import { projects } from "@/content/projects";

/*
  Construction progress: one tab per ongoing project.
  A project with a published update shows it (Neo's site video); the others say so plainly.
*/
const ongoing = projects.filter((project) => project.status === "Ongoing");

export function ProgressBoard() {
  const [picked, setPicked] = useState(ongoing[0].name);
  const update = progress.updates.find((item) => item.project === picked);

  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-[10px]" role="tablist" aria-label="Project">
        {ongoing.map((project) => (
          <button
            key={project.slug}
            type="button"
            role="tab"
            aria-selected={project.name === picked}
            onClick={() => setPicked(project.name)}
            className={`text-small h-[30px] rounded-[5px] px-[10px] transition-colors duration-500 ${
              project.name === picked ? "bg-black text-white" : "bg-chip text-black hover:bg-[#dcdcdc]"
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-[927px]">
        {update ? (
          <>
            <div className="relative aspect-video overflow-hidden rounded-[5px] bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${update.youtubeId}?rel=0`}
                title={`${update.project} construction update`}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-small mx-auto mt-5 flex h-[50px] w-[217px] items-center justify-center rounded-[5px] bg-chip">
              {update.project} · {update.when}
            </p>
          </>
        ) : (
          <p className="text-copy md:mx-auto md:max-w-[453px] py-[60px] md:text-center text-[#555] md:text-grey">{progress.emptyNote}</p>
        )}
      </div>
    </div>
  );
}
