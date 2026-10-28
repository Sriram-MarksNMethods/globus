/*
  Neo's own words and images, used on its project page (/projects/neo).
  Facts come from globusdevelopers.com and the Neo floor plans.
  Lines marked DRAFT are written for this layout — confirm with the client.
*/

import type { CrownContent, FormatContent, HomesContent, LocationContent, TowerContent } from "./types";

export const mapsUrl = "https://maps.app.goo.gl/?q=NEO+by+Yula+Globus";

export const tower: TowerContent = {
  image: { src: "/neo/tower-dusk.webp", alt: "Neo tower rising above Kokapet at dusk" },
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
  image: { src: "/neo/aerial-decks.webp", alt: "Aerial view of the decks on Neo" },
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
  mapsUrl,
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
