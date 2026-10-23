import type { Metadata } from "next";
import { office, privacy } from "@/content/company";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy policy | Globus Developers",
  description: "How Globus Developers collects, uses and protects the information you share on this website.",
};

/* Privacy policy: title, a sticky list of contents on the left, the policy text on the right. */
export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <article className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 px-5">Privacy policy</h1>
        <p className="text-small mt-5 px-5 text-grey">Last updated: {privacy.lastUpdated}</p>

        <div className="mt-[80px] grid grid-cols-1 gap-5 px-5 md:grid-cols-12">
          <nav aria-label="Contents" className="hidden md:col-span-3 md:block">
            <ol className="sticky top-[100px] flex flex-col gap-2">
              {privacy.sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#section-${index + 1}`} className="text-small text-grey hover:text-black">
                    {String(index + 1).padStart(2, "0")} {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-10 md:col-span-7 md:col-start-5">
            <p className="text-body text-grey">{privacy.intro}</p>

            {privacy.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-[100px]">
                <h2 className="text-h2">
                  {index + 1}. {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-body mt-4 text-grey">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="text-body mt-4 flex list-disc flex-col gap-2 pl-5 text-grey">
                    {section.list.map((item) => (
                      <li key={item.text.slice(0, 24)}>
                        {item.lead && <strong className="font-medium text-black">{item.lead} </strong>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
                {section.contactBlock && (
                  <p className="text-body mt-4">
                    Globus Developers
                    <br />
                    {office.address}
                    <br />
                    <a href={`mailto:${office.email}`} className="hover:text-grey">{office.email}</a>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
      <Footer breadcrumb="Privacy policy" />
    </main>
  );
}
