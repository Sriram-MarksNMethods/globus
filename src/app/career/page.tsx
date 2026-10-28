import type { Metadata } from "next";
import { career } from "@/content/company";
import { Consent, Field, LeadForm } from "@/components/forms/LeadForm";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Careers | Globus Developers",
  description: "Join the Globus Developers talent pool and help build Hyderabad’s next landmarks.",
};

/* Careers: split headline with the invitation, then the talent pool note and the profile form. */
export default function CareerPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
          <span>{career.heading[0]}</span>
          <span className="self-end md:self-auto">{career.heading[1]}</span>
        </h1>
        <p className="text-body mt-5 px-5 text-grey md:ml-[50%] md:max-w-[453px]">{career.intro}</p>

        <div className="mt-[80px] grid grid-cols-1 gap-5 px-5 md:mt-[120px] md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-h2">{career.poolTitle}</h2>
            <p className="text-body mt-4 text-grey">{career.pool}</p>
          </div>

          <div className="rounded-[5px] bg-soft p-5 md:col-span-7 md:col-start-6 md:p-10">
            <h2 className="text-h2">{career.formTitle}</h2>
            <p className="text-body mt-3 mb-8 text-grey">{career.formNote}</p>
            <LeadForm form="career" submitLabel="Submit application">
              <Field name="name" label="Full name" autoComplete="name" />
              <Field name="phone" label="Mobile number" type="tel" autoComplete="tel" />
              <Field name="email" label="Email" type="email" autoComplete="email" />
              <Field name="role" label="Position applied for" />
              <Field name="resume" label="Link to your CV (Google Drive, LinkedIn…)" type="url" required={false} wide />
              <Consent text={career.consent} />
            </LeadForm>
          </div>
        </div>
      </section>
      <Footer breadcrumb="Careers" />
    </main>
  );
}
