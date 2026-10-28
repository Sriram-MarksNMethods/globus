import type { Metadata } from "next";
import { contact, office, PROJECT_NAMES } from "@/content/company";
import { Consent, Field, LeadForm, SelectField } from "@/components/forms/LeadForm";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact | Globus Developers",
  description: "Enquire about a Globus home, book a site visit or reach our office in Puppalguda, Hyderabad.",
};

/* Contact: split headline, office details on the left, enquiry form on the right. */
export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 flex flex-col px-5 md:flex-row md:justify-between">
          <span>{contact.heading[0]}</span>
          <span className="self-end md:self-auto">{contact.heading[1]}</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-5 px-5 md:mt-[80px] md:grid-cols-12">
          {/* Office details */}
          <div className="flex flex-col gap-8 md:col-span-4">
            <p className="text-body text-grey">{contact.details}</p>

            <dl className="flex flex-col gap-6">
              <div>
                <dt className="text-small text-grey">Our address</dt>
                <dd className="text-body mt-2">{office.address}</dd>
              </div>
              <div>
                <dt className="text-small text-grey">Call us</dt>
                {office.phones.map((phone) => (
                  <dd key={phone.href} className="text-body mt-2">
                    <a href={phone.href} className="hover:text-grey">{phone.label}</a>
                  </dd>
                ))}
              </div>
              <div>
                <dt className="text-small text-grey">Email us</dt>
                <dd className="text-body mt-2">
                  <a href={`mailto:${office.email}`} className="hover:text-grey">{office.email}</a>
                </dd>
              </div>
            </dl>

            <Button href={office.mapUrl} label="Find us on the map" variant="light" className="w-[217px]" />
          </div>

          {/* Enquiry form */}
          <div className="rounded-[5px] bg-soft p-5 md:col-span-7 md:col-start-6 md:p-10">
            <h2 className="text-h2">Enquire now</h2>
            <p className="text-body mt-3 mb-8 text-grey">{contact.intro}</p>
            <LeadForm form="contact" submitLabel="Submit enquiry">
              <Field name="name" label="Full name" autoComplete="name" />
              <Field name="phone" label="Mobile number" type="tel" autoComplete="tel" />
              <Field name="email" label="Email" type="email" autoComplete="email" />
              <SelectField name="project" label="Project" options={PROJECT_NAMES} />
              <Consent text={contact.consent} />
            </LeadForm>
          </div>
        </div>
      </section>
      <Footer breadcrumb="Contact" />
    </main>
  );
}
