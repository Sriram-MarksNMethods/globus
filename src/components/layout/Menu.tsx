"use client";

import Link from "next/link";
import { nav } from "@/content/home";
import { FinRibbon } from "@/components/brand/FinRibbon";
import { PlusIcon } from "@/components/ui/Button";

/*
  Full-screen menu: a centred grey panel.
  Left: main links (large) and secondary links (small, at the bottom).
  Right: two tiles with a plus button each.
*/
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-30 bg-white transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* 3D G behind the panel, only running while the menu is open */}
      {open && <FinRibbon className="absolute -top-[10vh] right-[10vw] hidden aspect-square w-[44vw] md:block" />}

      <div className="absolute inset-x-5 top-[100px] bottom-5 flex md:inset-x-auto md:top-[141px] md:bottom-auto md:left-1/2 md:h-[640px] md:w-[690px] md:-translate-x-1/2">
        {/* Left column */}
        <div className="flex flex-1 flex-col justify-between rounded-l-[5px] bg-soft/90 p-5 backdrop-blur-[20px]">
          <ul>
            {nav.main.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={onClose} className="text-h2 block py-[2px] hover:text-grey md:text-[32px] md:leading-[35px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {nav.secondary.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={onClose} className="text-small block py-[2px] hover:text-grey">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: two tiles */}
        <div className="hidden w-[216px] flex-col border-l border-black/10 md:flex">
          {nav.tiles.map((tile, index) => (
            <Link
              key={tile.label}
              href={tile.href}
              onClick={onClose}
              className={`group flex flex-1 flex-col justify-between bg-soft/90 p-5 backdrop-blur-[20px] ${
                index === 0 ? "rounded-tr-[5px] border-b border-black/10" : "rounded-br-[5px]"
              }`}
            >
              <span className="text-small">{tile.label}</span>
              <span className="flex size-[30px] items-center justify-center self-end rounded-[5px] bg-chip">
                <PlusIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
