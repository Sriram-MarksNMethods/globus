"use client";

import Link from "next/link";
import { nav } from "@/content/home";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { PlusIcon } from "@/components/ui/Button";

/*
  Full-screen menu: the silver tunnel film fills the screen, with a centred grey panel on top.
  Left: main links (large) and secondary links (small, at the bottom).
  Right: two tiles with a plus button each (tablets and desktops; phones show the links only).
*/
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-30 bg-white transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* Silver tunnel film behind the panel, only loaded and running while the menu is open */}
      {open && <LoopVideo name="/brand/menu-tunnel" eager className="absolute inset-0 size-full" />}

      <div className="absolute inset-x-5 top-[100px] bottom-5 flex md:inset-x-auto md:top-[141px] md:bottom-auto md:left-1/2 md:h-[640px] md:w-[690px] md:-translate-x-1/2 tablet:inset-x-auto tablet:top-[141px] tablet:bottom-auto tablet:left-1/2 tablet:h-[640px] tablet:w-[690px] tablet:-translate-x-1/2">
        {/* Left column (scrolls on its own if the screen is too short, e.g. a phone held sideways) */}
        <div data-lenis-prevent className="flex flex-1 flex-col justify-between gap-5 overflow-y-auto overscroll-contain rounded-l-[5px] bg-soft p-5">
          <ul>
            {nav.main.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={onClose} className="text-h2 block py-[2px] hover:text-grey md:text-[32px] md:leading-[35px] tablet:text-[32px] tablet:leading-[35px]">
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
        <div className="hidden w-[216px] flex-col border-l border-black/10 md:flex tablet:flex">
          {nav.tiles.map((tile, index) => (
            <Link
              key={tile.label}
              href={tile.href}
              onClick={onClose}
              className={`group flex flex-1 flex-col justify-between bg-soft p-5 ${
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
