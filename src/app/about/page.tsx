import type { Metadata } from "next";
import { AboutHero, Numbers, Philosophy, Story } from "@/components/about/AboutSections";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About | Globus Developers",
  description: "Globus Developers crafts luxury real estate across Hyderabad’s prime growth corridors, guided by vision, precision and legacy.",
};

/* About the developer: hero → philosophy → story → numbers. (The projects are on the homepage and /projects.) */
export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <Philosophy />
      <Story />
      <Numbers />
      <Footer breadcrumb="About Globus" />
    </main>
  );
}
