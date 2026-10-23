import type { Metadata } from "next";
import { HomeSelection } from "@/components/homes/HomeSelection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Home selection | Globus Developers",
  description: "Every Globus home type in one list: filter by project, 3 BHK, 4 BHK or villa, and size.",
};

/* Home selection: title, then filters + list. */
export default function HomesPage() {
  return (
    <main className="bg-white">
      <section className="pt-[110px] pb-[160px] md:pt-[160px]">
        <h1 className="text-h1 px-5">Home selection</h1>
        <div className="mt-10">
          <HomeSelection />
        </div>
      </section>
      <Footer breadcrumb="Home selection" />
    </main>
  );
}
