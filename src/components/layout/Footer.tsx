import Link from "next/link";
import { footer, nav } from "@/content/home";
import { office } from "@/content/company";
import { projects } from "@/content/projects";
import { Button } from "@/components/ui/Button";

/*
  Black footer (same content as the live site's footer, in this site's style):
  1. Enquiry prompt with a button.
  2. Four columns: quick links, ongoing projects, contact details, social links.
  3. White Globus logo with copyright, privacy policy and credit; disclaimer below.
  Inner pages pass `breadcrumb` to show "Home / Page" along the top.
*/
const ongoing = projects.filter((project) => project.status === "Ongoing");

export function Footer({ breadcrumb }: { breadcrumb?: string }) {
  return (
    <footer data-theme="dark" className="relative z-10 bg-black px-5 pt-[90px] pb-5 text-white md:pt-[110px]">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="text-small absolute inset-x-5 top-5 flex gap-2 border-b border-white/15 pb-4 text-grey">
          <Link href="/" className="text-white hover:text-grey">Home</Link>
          <span>/</span>
          <span>{breadcrumb}</span>
        </nav>
      )}

      {/* 1. Enquiry prompt */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <h2 className="text-h1 md:col-span-7">{footer.cta.heading}</h2>
        <div className="flex flex-col gap-6 md:col-span-3 md:col-start-10 md:justify-end">
          <p className="text-body text-grey">{footer.cta.text}</p>
          <Button href={footer.cta.button.href} label={footer.cta.button.label} onDark />
        </div>
      </div>

      {/* 2. Columns */}
      <div className="mt-[48px] grid grid-cols-2 gap-x-5 gap-y-8 border-t border-white/15 pt-5 md:mt-[72px] md:grid-cols-12">
        <FooterColumn title={footer.columns.links} className="md:col-span-3">
          {nav.main.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="hover:text-grey">{link.label}</Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={footer.columns.projects} className="md:col-span-3">
          {ongoing.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="hover:text-grey">{project.name}</Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={footer.columns.contact} className="col-span-2 md:col-span-4">
          <li className="text-grey">{office.address}</li>
          <li>
            <a href={`mailto:${office.email}`} className="normal-case hover:text-grey">{office.email}</a>
          </li>
          {office.phones.map((phone) => (
            <li key={phone.href}>
              <a href={phone.href} className="hover:text-grey">{phone.label}</a>
            </li>
          ))}
        </FooterColumn>

        <ul className="text-body col-span-2 flex flex-wrap gap-x-5 gap-y-2 md:col-span-2 md:flex-col md:items-end">
          {footer.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="hover:text-grey">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Logo row + disclaimer */}
      <div className="mt-[48px] flex flex-col gap-3 md:mt-[72px] md:flex-row md:items-end md:justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/globus-logo-light.svg" alt="Globus Developers" className="mb-3 h-[70px] w-auto self-start md:mb-0 md:h-[110px]" />
        <p className="text-small text-grey md:mb-[12px]">{footer.copyright}</p>
        <Link href="/privacy-policy" className="text-small text-grey hover:text-white md:mb-[12px]">
          Privacy policy
        </Link>
        <Link
          href={footer.credit.href}
          target="_blank"
          rel="noreferrer"
          className="text-small text-grey hover:text-white md:mb-[12px]"
        >
          {footer.credit.label}
        </Link>
      </div>

      <p className="text-small mx-auto mt-8 max-w-[1100px] text-center text-white/30">{footer.disclaimer}</p>
    </footer>
  );
}

/* One footer column: small grey title, then a list of lines. */
function FooterColumn({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="text-small text-grey">{title}</p>
      <ul className="text-body mt-4 flex flex-col gap-2">{children}</ul>
    </div>
  );
}
