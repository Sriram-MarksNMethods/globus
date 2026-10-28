import { choose, format, intro, people, views } from "@/content/home";
import { Intro } from "@/components/home/Intro";
import { Format } from "@/components/home/Format";
import { ProjectStack } from "@/components/home/ProjectStack";
import { People } from "@/components/home/People";
import { Views } from "@/components/home/Views";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { Choose } from "@/components/home/Choose";
import { Footer } from "@/components/layout/Footer";

/* Homepage (Globus brand page): sections in the order they appear, content from content/home.ts. */
export default function HomePage() {
  return (
    <main>
      <Intro content={intro} />
      <Format content={format} />
      <ProjectStack />
      <People content={people} />
      <Views content={views} />
      <NewsTeaser />
      <Choose content={choose} />
      <Footer />
    </main>
  );
}
