"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { homeTypes, type HomeKind } from "@/content/pages";
import { PlusIcon } from "@/components/ui/Button";

/*
  Home selection: filters on the left, matching home types on the right.
  Filters: project, home type, and a size range (sft). The list can be sorted by size.
*/
const PROJECTS = ["All", ...Array.from(new Set(homeTypes.map((home) => home.project)))];
const KINDS: ("All" | HomeKind)[] = ["All", "3 BHK", "4 BHK", "Villa"];
const SMALLEST = Math.min(...homeTypes.map((home) => home.minSft));
const LARGEST = Math.max(...homeTypes.map((home) => home.maxSft));

const formatSft = (value: number) => value.toLocaleString("en-IN");

export function HomeSelection() {
  const [project, setProject] = useState("All");
  const [kind, setKind] = useState<"All" | HomeKind>("All");
  const [minSize, setMinSize] = useState(SMALLEST);
  const [maxSize, setMaxSize] = useState(LARGEST);
  const [ascending, setAscending] = useState(true);

  const found = homeTypes
    .filter((home) => project === "All" || home.project === project)
    .filter((home) => kind === "All" || home.kind === kind)
    // A home type matches if any of its sizes falls inside the chosen range.
    .filter((home) => home.maxSft >= minSize && home.minSft <= maxSize)
    .sort((a, b) => (ascending ? a.minSft - b.minSft : b.minSft - a.minSft));

  function clearFilters() {
    setProject("All");
    setKind("All");
    setMinSize(SMALLEST);
    setMaxSize(LARGEST);
  }

  return (
    <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
      {/* ---------------- Filters */}
      <aside className="md:col-span-4 lg:col-span-3">
        <p className="text-small text-grey">Found {found.length}</p>
        <div className="mt-3 flex flex-col gap-6 rounded-[5px] bg-soft p-5 md:sticky md:top-[80px]">
          <button type="button" onClick={clearFilters} className="text-small h-[30px] self-start rounded-[5px] bg-chip px-[10px] hover:bg-[#dcdcdc]">
            Clear
          </button>

          <FilterGroup label="Project">
            {PROJECTS.map((name) => (
              <Chip key={name} active={project === name} onClick={() => setProject(name)}>
                {name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Home type">
            {KINDS.map((name) => (
              <Chip key={name} active={kind === name} onClick={() => setKind(name)}>
                {name}
              </Chip>
            ))}
          </FilterGroup>

          <div>
            <p className="text-small text-grey">Size, sft</p>
            <div className="mt-2 flex justify-between rounded-[5px] bg-white px-3 py-2">
              <span className="text-body">{formatSft(minSize)}</span>
              <span className="text-body">{formatSft(maxSize)}</span>
            </div>
            <label className="text-small mt-3 block text-grey">
              From
              <input
                type="range"
                min={SMALLEST}
                max={LARGEST}
                step={5}
                value={minSize}
                onChange={(event) => setMinSize(Math.min(Number(event.target.value), maxSize))}
                className="mt-1 block w-full accent-black"
              />
            </label>
            <label className="text-small mt-2 block text-grey">
              To
              <input
                type="range"
                min={SMALLEST}
                max={LARGEST}
                step={5}
                value={maxSize}
                onChange={(event) => setMaxSize(Math.max(Number(event.target.value), minSize))}
                className="mt-1 block w-full accent-black"
              />
            </label>
          </div>
        </div>
      </aside>

      {/* ---------------- Results */}
      <div className="md:col-span-8 lg:col-span-9">
        <div className="flex justify-between">
          <button type="button" onClick={() => setAscending(!ascending)} className="text-small hover:text-grey">
            {ascending ? "Smallest first ↑" : "Largest first ↓"}
          </button>
          <p className="text-small text-grey">List</p>
        </div>

        {found.length === 0 ? (
          <p className="text-body mt-3 rounded-[5px] bg-soft p-10 text-center text-grey">No homes match these filters.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-[10px]">
            {found.map((home) => (
              <li key={`${home.project}-${home.name}`}>
                <Link
                  href={`/projects/${home.slug}#plans`}
                  className="grid grid-cols-[64px_1fr_auto] items-center gap-5 rounded-[5px] bg-soft p-[10px] transition-colors duration-500 hover:bg-chip md:grid-cols-[64px_2fr_1.4fr_1fr_auto]"
                >
                  <div className="relative size-16 overflow-hidden rounded-[5px] bg-white">
                    <Image src={home.plan} alt={`${home.name} plan`} fill sizes="64px" className="object-contain" />
                  </div>
                  <div>
                    <p className="text-body">{home.name}</p>
                    <p className="text-small mt-1 text-grey">{home.detail}</p>
                  </div>
                  <p className="text-small hidden text-grey md:block">
                    {home.project} · {home.area}
                  </p>
                  <p className="text-body hidden text-right md:block">
                    {home.minSft === home.maxSft ? formatSft(home.minSft) : `${formatSft(home.minSft)}–${formatSft(home.maxSft)}`} sft
                  </p>
                  <span className="flex size-[30px] items-center justify-center rounded-[5px] bg-white">
                    <PlusIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small text-grey">{label}</p>
      <div className="mt-2 flex flex-wrap gap-[6px]">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-small h-[30px] rounded-[5px] px-[10px] transition-colors duration-500 ${
        active ? "bg-black text-white" : "bg-white text-black hover:bg-chip"
      }`}
    >
      {children}
    </button>
  );
}
