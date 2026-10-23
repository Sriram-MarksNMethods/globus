import { choose, crown, format, homes, intro, location, people, tower, views } from "@/content/home";
import { Intro } from "@/components/home/Intro";
import { Tower } from "@/components/home/Tower";
import { Format } from "@/components/home/Format";
import { Crown } from "@/components/home/Crown";
import { Location } from "@/components/home/Location";
import { People } from "@/components/home/People";
import { Views } from "@/components/home/Views";
import { Homes } from "@/components/home/Homes";
import { Choose } from "@/components/home/Choose";
import { Footer } from "@/components/layout/Footer";

/* Homepage: sections in the order they appear, each with its content from content/home.ts. */
export default function HomePage() {
  return (
    <main>
      <Intro content={intro} />
      <Tower content={tower} />
      <Format content={format} />
      <Crown content={crown} />
      <Location content={location} />
      <People content={people} />
      <Views content={views} />
      <Homes content={homes} />
      <Choose content={choose} />
      <Footer />
    </main>
  );
}
