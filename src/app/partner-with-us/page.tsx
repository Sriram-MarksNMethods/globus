import type { Metadata } from "next";
import { office, partner } from "@/content/company";
import { Consent, Field, LeadForm, MessageField } from "@/components/forms/LeadForm";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Partner with us | Globus Developers",
  description: "Register as a Globus Developers channel partner in Hyderabad.",
};

/* Partner with us: split headline, the invitation on the left, registration form on the right. */
export default function PartnerPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
          <span>{partner.heading[0]}</span>
          <span className="self-end md:self-auto">{partner.heading[1]}</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-5 px-5 md:mt-[80px] md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-4">
            <p className="text-h2">{partner.intro}</p>
            <a href={`mailto:${office.email}`} className="text-body text-grey hover:text-black">
              {office.email}
            </a>
          </div>

          <div className="rounded-[5px] bg-soft p-5 md:col-span-7 md:col-start-6 md:p-10">
            <h2 className="text-h2">{partner.formTitle}</h2>
            <p className="text-body mt-3 mb-8 text-grey">{partner.formNote}</p>
            <LeadForm form="partner" submitLabel="Submit application">
              <Field name="name" label="Full name" autoComplete="name" />
              <Field name="company" label="Company name" autoComplete="organization" required={false} />
              <Field name="email" label="Email" type="email" autoComplete="email" />
              <Field name="phone" label="Mobile number" type="tel" autoComplete="tel" />
              <MessageField name="message" label="Your message" />
              <Consent text={partner.consent} />
            </LeadForm>
          </div>
        </div>
      </section>
      <Footer breadcrumb="Partner with us" />
    </main>
  );
}
