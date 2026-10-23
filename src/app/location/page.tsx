import type { Metadata } from "next";
import { LocationHero, LocationIntro, TravelTimes } from "@/components/location/LocationSections";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Location | Globus Developers",
  description: "Globus homes in Kokapet, Kondapur and Kollur, along Hyderabad’s western growth corridor, with travel times for each area.",
};

/* Location: city hero → intro → travel times by area. */
export default function LocationPage() {
  return (
    <main>
      <LocationHero />
      <LocationIntro />
      <TravelTimes />
      <Footer breadcrumb="Location" />
    </main>
  );
}
