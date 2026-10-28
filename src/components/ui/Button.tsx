import Link from "next/link";

/*
  The two button shapes used everywhere:

  size "sm"   → 30px tall pill, label left, plus icon right (header, chips)
  size "tall" → 50px tall block, label top-left, plus icon bottom-right (in sections)

  variant "dark"  → black (or white when `onDark`)
  variant "light" → light grey
  On hover the background lightens and the plus icon turns a quarter.
*/

type Props = {
  href: string;
  label: string;
  variant?: "dark" | "light";
  size?: "sm" | "tall";
  onDark?: boolean; // the button sits on a black section
  className?: string;
};

export function Button({ href, label, variant = "dark", size = "tall", onDark = false, className = "" }: Props) {
  const colors = {
    dark: onDark ? "bg-white text-black hover:bg-[#d6d6d6]" : "bg-black text-white hover:bg-[#333]",
    light: onDark
      ? "bg-white/15 text-white hover:bg-white/25"
      : "bg-chip text-black hover:bg-[#dcdcdc]",
  }[variant];

  const shape =
    size === "sm"
      ? "h-[30px] flex-row items-center justify-between px-[10px]"
      : "h-[50px] flex-col justify-between p-[10px]";

  const isExternal = href.startsWith("http") || href.startsWith("tel:");

  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`group flex rounded-[5px] text-small transition-colors duration-[600ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] ${colors} ${shape} ${className}`}
    >
      <span className="leading-none">{label}</span>
      <PlusIcon className={size === "tall" ? "self-end" : ""} />
    </Link>
  );
}

export function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] group-hover:rotate-90 ${className}`}
    >
      <path d="M8 0v6.5M8 9.5V16M0 8h6.5M9.5 8H16" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
