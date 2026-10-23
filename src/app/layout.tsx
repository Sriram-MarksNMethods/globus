import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Neo by Globus Developers | 3 & 4 BHK Residences in Neopolis, Kokapet",
  description:
    "Neo by Globus Developers: two towers of 58+ floors in Neopolis, Kokapet, with 3 and 4 BHK homes from 2,235 to 4,565 sft. TG RERA P02400010006.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable}>
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
