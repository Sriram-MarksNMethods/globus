/*
  All the words and images on the homepage, one object per section.
  Edit text here; the components only handle layout and motion.

  Facts come from globusdevelopers.com and the Neo floor plans.
  Headlines marked DRAFT are new lines written for this layout — confirm with the client.
*/

import type {
  ChooseContent, CrownContent, FormatContent, HomesContent, IntroContent,
  LocationContent, PeopleContent, TowerContent, ViewsContent,
} from "./types";

export const site = {
  project: "Neo",
  developer: "Globus Developers",
  url: "https://www.globusdevelopers.com", // live domain, used for the sitemap and share links
  phone: "+91 95 1978 1978",
  email: "info@globusdevelopers.com",
  rera: "TG RERA P02400010006",
  mapsUrl: "https://maps.app.goo.gl/?q=NEO+by+Yula+Globus",
};

export const nav = {
  cta: "Choose a home",
  main: [
    { label: "Projects", href: "/projects" },
    { label: "Home selection", href: "/homes" },
    { label: "Location", href: "/location" },
    { label: "About Globus", href: "/about" },
  ],
  secondary: [
    { label: "Construction progress", href: "/progress" },
    { label: "News and insights", href: "/news" },
    { label: "Careers", href: "/career" },
    { label: "Partner with us", href: "/partner-with-us" },
    { label: "Contact", href: "/contact" },
  ],
  tiles: [
    { label: "Choose a home", href: "/homes" },
    { label: "Book a site visit", href: "/contact" },
  ],
};

export const intro: IntroContent = {
  title: ["Two towers", "above Neopolis"], // DRAFT
  heading: ["Crafting skylines", "building futures"], // Globus tagline from the live site
  label: ["3 & 4 BHK", "residences", "Kokapet"],
};

export const tower: TowerContent = {
  image: { src: "/neo/tower-sky.webp", alt: "Neo tower rising above Kokapet" },
  heading: ["Fifty-eight floors", "of open sky"], // DRAFT
  intro:
    "Neopolis, located in Kokapet, Hyderabad, is a master-planned urban hub by HMDA, offering top-tier infrastructure and strategic connectivity near the Financial District and Gachibowli.",
  lead: "Tower A and Tower B rise side by side, with 3 and 4 BHK homes from 2,235 to 4,565 sft and landscaped decks at the crown of each tower.", // DRAFT
  note: ["TG RERA", "P02400010006"],
  button: { label: "About the project", href: "#about" },
  images: [
    { src: "/neo/facade-front.webp", alt: "Front elevation of Neo" },
    { src: "/neo/crown-decks.webp", alt: "Landscaped decks at the crown of Neo" },
  ],
};

export const format: FormatContent = {
  heading: ["The new", "Kokapet", "landmark"], // DRAFT
  intro:
    "It features wide roads, underground cabling, and zoned development, planned as a whole before the first tower rose.",
  image: { src: "/neo/aerial-lake.webp", alt: "Aerial view of Neo and the lake" },
  slides: [
    "Every home has an 11 ft ceiling height, so each room feels open and full of light from the moment you walk in.", // DRAFT
    "Each tower opens onto a grand lobby at ground level, a calm double-height welcome at the foot of fifty-eight floors.", // DRAFT
  ],
};

export const crown: CrownContent = {
  background: { src: "/neo/tower-dusk.webp", alt: "Neo at dusk" },
  title: "Landscaped decks crown both towers of Neo", // DRAFT
  image: { src: "/neo/crown-decks.webp", alt: "Crown of Neo with landscaped decks" },
  button: { label: "See the floor plans", href: "#plans" },
};

export const location: LocationContent = {
  project: "Neo",
  mapsUrl: site.mapsUrl,
  heading: ["Close to", "everything"], // DRAFT
  label: ["Neopolis,", "Kokapet"],
  lead: "Neo sits in Neopolis, minutes from the Outer Ring Road, the Financial District and the offices of Gachibowli and HITEC City.", // DRAFT
  image: { src: "/neo/towers-night-road.webp", alt: "Neo towers beside the road at night" },
  button: { label: "Location", href: "#map" },
  text: "Combining sustainable planning with investment potential, Neopolis represents Hyderabad’s future in premium real estate and modern urban living.",
  times: [
    { minutes: "5", unit: ["min", "drive"], place: "ORR exit" },
    { minutes: "10", unit: ["min", "drive"], place: "Financial District" },
    { minutes: "10", unit: ["min", "drive"], place: "RGI Airport" },
    { minutes: "15", unit: ["min", "drive"], place: "HITEC City" },
  ],
  mapText: "Reputed schools and hospitals are five to ten minutes away, and the Gachibowli business district is a short drive along the ORR.", // DRAFT
  map: { src: "/neo/map-kokapet.webp", alt: "Map of Kokapet with Neo marked" },
  mapButton: "Open in Google Maps",
};

export const people: PeopleContent = {
  image: { src: "/projects/altus/am-sky.webp", alt: "A couple on the sky garden at Altus, above the city" },
  label: "Life at Globus",
  heading: ["Room to", "breathe, high up"], // DRAFT
};

export const views: ViewsContent = {
  lead: "Light-filled living rooms, balconies above the city, pools, gardens and calm corners to unwind, across every Globus home.", // DRAFT
  images: [
    { src: "/projects/altus/in-living.webp", alt: "Living room at Altus" },
    { src: "/projects/treasor/in-balcony.webp", alt: "A couple on a balcony at Treasor at dusk" },
    { src: "/projects/floresta/am-pool.webp", alt: "Swimming pool at Floresta" },
    { src: "/projects/treasor/club-yoga.webp", alt: "Yoga studio in the Treasor clubhouse" },
    { src: "/projects/altus/in-dining.webp", alt: "Dining room at Altus" },
  ],
  text: "Interiors and amenities at Altus, Treasor and Floresta, as rendered for Globus Developers.", // DRAFT
}

export const homes: HomesContent = {
  background: { src: "/neo/facade-front.webp", alt: "Neo front elevation" },
  heading: ["Homes made", "to measure"], // DRAFT
  intro: "Three home types across two towers, each laid out for light, privacy and room to grow.", // DRAFT
  slides: [
    {
      image: { src: "/neo/plan-3bhk-tower-a.webp", alt: "3 BHK floor plan, Tower A" },
      text: "3 BHK in Tower A, from 2,235 sft north facing to 2,300 sft west facing, with 11 ft ceilings throughout.",
    },
    {
      image: { src: "/neo/plan-4bhk-tower-a.webp", alt: "4 BHK floor plan, Tower A" },
      text: "4 BHK in Tower A in four sizes: 3,095, 3,215, 3,220 and 3,460 sft, facing east and west.",
    },
    {
      image: { src: "/neo/plan-4bhk-maid-tower-b.webp", alt: "4 BHK with maid room floor plan, Tower B" },
      text: "4 BHK with maid room in Tower B, from 3,430 to 4,565 sft. The 4,160 and 4,565 sft homes add a home theatre.",
    },
  ],
  button: { label: "Enquire", href: "#choose" },
};

export const choose: ChooseContent = {
  heading: ["Choose", "your home"],
  buttons: [
    { label: "By size", href: "#plans", dark: true },
    { label: "On the master plan", href: "/neo/master-plan.webp", dark: false },
  ],
};

export const footer = {
  copyright: "© 2026 Globus Developers",
  credit: { label: "Website by marks+methods", href: "https://www.marksandmethods.com" },
  disclaimer:
    "All images are artist’s impressions for illustration only. Plans, sizes and specifications are indicative and subject to approval by the authorities. This website is not an offer or a contract. TG RERA: Neo P02400010006 · Altus P02400008439 · Treasor P02400003226 · Floresta P01100007551.",
};
