import type { Metadata } from "next";
import { office, privacy } from "@/content/company";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy policy | Globus Developers",
  description: "How Globus Developers collects, uses and protects the information you share on this website.",
};

/*
  Privacy policy, laid out like aircenter.space/privacy-policy:
  centred title, then one narrow centred column of plain text.
  Section numbers (1, 1.1, 1.2 …) hang in the left margin on desktop.
*/
const text = "text-[15px] leading-[21px] md:text-[16px] md:leading-[22px]";
// Hanging number: inline on phones, out in the margin on desktop.
const number = "mr-3 text-grey md:absolute md:right-full md:mr-0 md:w-[70px] md:pr-5 md:text-right";

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <article className="pt-[140px] pb-[160px] md:pt-[240px]">
        <h1 className="text-h1 mx-auto max-w-[730px] px-5 text-center">Privacy policy</h1>
        <p className="text-small mt-5 text-center text-grey">Last updated: {privacy.lastUpdated}</p>

        <div className={`${text} mx-auto mt-[100px] max-w-[730px] px-5 md:mt-[160px]`}>
          <p>{privacy.intro}</p>

          {privacy.sections.map((section, index) => (
            <section key={section.heading} className="relative mt-[56px] md:mt-[68px]">
              <h2 className="relative font-medium">
                <span className={number}>{index + 1}</span>
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph, line) => (
                <p key={paragraph.slice(0, 24)} className="relative mt-[28px]">
                  <span className={number}>
                    {index + 1}.{line + 1}
                  </span>
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="mt-[28px] flex list-disc flex-col gap-[10px] pl-5">
                  {section.list.map((item) => (
                    <li key={item.text.slice(0, 24)}>
                      {item.lead && <span className="font-medium">{item.lead} </span>}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}

              {section.contactBlock && (
                <p className="mt-[28px]">
                  Globus Developers
                  <br />
                  {office.address}
                  <br />
                  <a href={`mailto:${office.email}`} className="underline hover:text-grey">
                    {office.email}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </article>
      <Footer breadcrumb="Privacy policy" />
    </main>
  );
}
