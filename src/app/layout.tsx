import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { INTRO_REPLAY_AFTER_MS, INTRO_SEEN_KEY } from "@/components/layout/introSeen";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/content/home";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  // The live address, so share images and links point to the real site.
  metadataBase: new URL(site.url),
  title: "Globus Developers | Luxury Real Estate in Hyderabad", // DRAFT
  description:
    "Globus Developers crafts luxury villas, residences and townships across Hyderabad: Neo, Altus, Treasor and Floresta, with Westlyn and Tukkuguda coming next.", // DRAFT
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning on <html>: the script below may add data-intro before React loads.
    <html lang="en" className={onest.variable} suppressHydrationWarning>
      <head>
        {/* If the intro played in the last 24 hours, mark it done before the page is drawn. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=+localStorage.getItem("${INTRO_SEEN_KEY}");if(t&&Date.now()-t<${INTRO_REPLAY_AFTER_MS})document.documentElement.dataset.intro="done"}catch(e){}`,
          }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) add attributes to <body>
          before React loads; this ignores those, and only on this one tag. */}
      <body id="top" suppressHydrationWarning>
        <SmoothScroll>
          <Preloader />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
