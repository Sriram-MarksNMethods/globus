import type { Metadata } from "next";
import { GStreet } from "@/components/brand/GStreet";

export const metadata: Metadata = {
  title: "G street level (trial) | Globus Developers",
  robots: { index: false, follow: false },
};

/* Trial page: J10 street level, the plain G. Scroll through it. */
export default function GStreetPage() {
  return (
    <main className="bg-[#e2e2e2]">
      <section className="relative h-[300vh]">
        <div className="sticky top-0 h-svh">
          <GStreet className="absolute inset-0" />
        </div>
      </section>
      <div className="h-svh" />
    </main>
  );
}
