"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Menu } from "./Menu";

/*
  Fixed header: menu button on the left, main CTA on the right.
  It turns white-on-black while a section marked data-theme="dark" sits under it.
*/
export function Header() {
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function checkTheme() {
      const headerMiddle = 35;
      const darkSections = document.querySelectorAll('[data-theme="dark"]');
      let dark = false;
      darkSections.forEach((section) => {
        const box = section.getBoundingClientRect();
        if (box.top <= headerMiddle && box.bottom >= headerMiddle) dark = true;
      });
      setOnDark(dark);
    }
    checkTheme();
    window.addEventListener("scroll", checkTheme, { passive: true });
    return () => window.removeEventListener("scroll", checkTheme);
  }, []);

  const dark = onDark && !menuOpen;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-5">
        <div className="pointer-events-auto flex gap-[10px]">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`flex h-[30px] w-[60px] items-center justify-center rounded-[5px] transition-colors duration-[600ms] ${
              menuOpen ? "bg-[#333] text-white" : dark ? "bg-white text-black" : "bg-black text-white hover:bg-[#333]"
            }`}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Globus logo: dark on light sections, white on dark ones */}
        <Link href="/" aria-label="Globus Developers, home" className="pointer-events-auto absolute top-[15px] left-[100px] md:left-[calc(2*20px+2*(100vw-220px)/12)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dark ? "/brand/globus-logo-light.svg" : "/brand/globus-logo-dark.svg"}
            alt="Globus Developers"
            width={118}
            height={40}
            data-header-logo
            // Hidden until the landing intro has flown its logo into this spot.
            className="h-10 w-auto opacity-0 [html[data-intro=done]_&]:opacity-100"
          />
        </Link>

        <Button
          href="/homes"
          label={nav.cta}
          size="sm"
          onDark={dark}
          className="pointer-events-auto hidden w-[217px] md:flex"
        />
      </header>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="40" height="6" viewBox="0 0 40 6" aria-hidden="true">
      <path d="M0 .5h40M10 5.5h20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 4l5.3 5.3M10.7 10.7L16 16M16 4l-5.3 5.3M9.3 10.7L4 16" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

