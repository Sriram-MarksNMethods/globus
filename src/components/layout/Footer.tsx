import Link from "next/link";
import { footer } from "@/content/home";

/*
  Black footer: white Globus logo, copyright and credit on one row, disclaimer below.
  Inner pages pass `breadcrumb` to show "Home / Page" along the top.
*/
export function Footer({ breadcrumb }: { breadcrumb?: string }) {
  return (
    <footer data-theme="dark" className="relative z-10 flex min-h-[664px] flex-col justify-between bg-black px-5 pt-[200px] pb-5 text-white md:pt-[330px]">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="text-small absolute inset-x-5 top-5 flex gap-2 border-b border-white/15 pb-4 text-grey">
          <Link href="/" className="text-white hover:text-grey">Home</Link>
          <span>/</span>
          <span>{breadcrumb}</span>
        </nav>
      )}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/globus-logo-light.svg" alt="Globus Developers" className="h-[90px] w-auto self-start md:h-[150px]" />
        <p className="text-small text-grey md:mb-[18px]">{footer.copyright}</p>
        <Link
          href={footer.credit.href}
          target="_blank"
          rel="noreferrer"
          className="text-small text-grey hover:text-white md:mb-[18px]"
        >
          {footer.credit.label}
        </Link>
      </div>

      <p className="text-small mx-auto mt-10 max-w-[1100px] text-center text-white/30">{footer.disclaimer}</p>
    </footer>
  );
}
