/*
  Every Globus project, one object each.
  - Ongoing projects get a full page built from the same sections as the homepage.
  - Upcoming projects get a short page (hero, intro, register interest).

  Facts and long descriptions come from globusdevelopers.com.
  Lines marked DRAFT are written for this layout — confirm with the client.
*/

import * as neo from "./home";
import type {
  ChooseContent, CrownContent, FormatContent, HomesContent, IntroContent,
  LocationContent, PeopleContent, TowerContent, ViewsContent,
} from "./types";

export type ProjectStatus = "Ongoing" | "Upcoming" | "Completed";

type ProjectBase = {
  slug: string;
  name: string;
  area: string; // e.g. "Kondapur"
  status: ProjectStatus;
  tagline: string; // e.g. "3 & 4 BHK Apartments"
  rera?: string;
  card: { src: string; alt: string }; // image on the Projects page
};

export type FullProject = ProjectBase & {
  kind: "full";
  sections: {
    intro: IntroContent;
    tower: TowerContent;
    format: FormatContent;
    crown: CrownContent;
    location: LocationContent;
    people: PeopleContent;
    views: ViewsContent;
    homes: HomesContent;
    choose: ChooseContent;
  };
};

export type UpcomingProject = ProjectBase & {
  kind: "upcoming";
  heading: string[];
  description: string;
  hero: { src: string; alt: string };
};

export type Project = FullProject | UpcomingProject;

const chooseHome = (projectName: string): ChooseContent => ({
  heading: ["Choose", "your home"],
  buttons: [
    { label: "See the plans", href: "#plans", dark: true },
    { label: `Enquire about ${projectName}`, href: "tel:+919519781978", dark: false },
  ],
});

export const projects: Project[] = [
  // ---------------------------------------------------------------- Neo
  {
    kind: "full",
    slug: "neo",
    name: "Neo",
    area: "Neopolis, Kokapet",
    status: "Ongoing",
    tagline: "3 & 4 BHK Apartments",
    rera: "P02400010006",
    card: { src: "/neo/tower-dusk.webp", alt: "Neo at dusk" },
    sections: {
      intro: { title: ["Neo", "Neopolis, Kokapet"], heading: ["Neopolis’", "emerging landmark"], label: neo.intro.label },
      tower: neo.tower,
      format: neo.format,
      crown: neo.crown,
      location: neo.location,
      people: { ...neo.people, image: { src: "/neo/aerial-decks.webp", alt: "Aerial view of the decks on Neo" }, label: "Neo by Globus" },
      views: {
        lead: "Two slender towers with wide balconies, green terraces and glass on every side, so the city stays in view from every home.", // DRAFT
        images: [
          { src: "/neo/tower-sky.webp", alt: "Neo against the sky" },
          { src: "/neo/facade-front.webp", alt: "Front elevation" },
          { src: "/neo/towers-night-road.webp", alt: "Neo at night" },
          { src: "/neo/crown-decks.webp", alt: "Crown decks" },
          { src: "/neo/aerial-lake.webp", alt: "Aerial view" },
        ],
        text: "Views of Neo from every side, from the street to the sky decks, as rendered for Globus Developers.", // DRAFT
      },
      homes: neo.homes,
      choose: chooseHome("Neo"),
    },
  },

  // ---------------------------------------------------------------- Altus
  {
    kind: "full",
    slug: "altus",
    name: "Altus",
    area: "Kondapur",
    status: "Ongoing",
    tagline: "3 & 4 BHK Apartments",
    rera: "P02400008439",
    card: { src: "/projects/altus/in-balcony.webp", alt: "Balcony at Altus with a glass railing over the city" },
    sections: {
      intro: {
        title: ["Altus", "Kondapur"],
        heading: ["A towering expression", "of aspiration"],
        label: ["3 & 4 BHK", "residences", "Kondapur"],
      },
      tower: {
        image: { src: "/projects/altus/hero.jpg", alt: "Altus towers at dusk" },
        heading: ["A new horizon", "over Kondapur"],
        intro: "A new horizon over Kondapur. Rising above the city’s most dynamic corridor.",
        lead: "Block A and Block B rise over the green, low-rise streets of Kondapur, with homes from 1,760 to 4,685 sft and deep balconies on every floor.",
        note: ["TG RERA", "P02400008439"],
        button: { label: "See the homes", href: "#plans" },
        images: [
          { src: "/projects/altus/in-living.webp", alt: "Altus living room with sofa, marble wall and dining beyond" },
          { src: "/projects/altus/in-balcony.webp", alt: "Altus balcony with glass railing over the city" },
        ],
      },
      format: {
        heading: ["The art", "of", "interiors"],
        intro: "Light-filled living and dining, a fitted kitchen and calm bedrooms, finished in warm timber and stone.",
        image: { src: "/projects/altus/in-dining.webp", alt: "Altus dining area with a table for six" },
        slides: [
          "Two blocks, three home types: 3 BHK, 4 BHK and 4 BHK with a home theatre, from 1,760 to 4,685 sft.",
          "Covering 50,800 sq. ft., the Altus Clubhouse blends elegance and comfort, offering spaces for both socializing and serene retreat.",
        ],
      },
      crown: {
        background: { src: "/projects/altus/club-ext.webp", alt: "The Altus clubhouse lit up at dusk" },
        title: "A private world of comfort and class",
        image: { src: "/projects/altus/club-yoga.webp", alt: "Clubhouse yoga studio with mats" },
        button: { label: "See the homes", href: "#plans" },
      },
      location: {
        project: "Altus",
        heading: ["Strategically", "located"],
        label: ["Kondapur,", "Hyderabad"],
        lead: "Located in vibrant Kondapur, Altus offers seamless access to Hyderabad’s business districts, premier schools, healthcare, and retail hubs.",
        image: { src: "/projects/altus/h2.jpg", alt: "Altus towers above Kondapur" },
        button: { label: "Location", href: "#map" },
        text: "Placing every urban convenience within easy reach.",
        times: [
          { minutes: "0.6", unit: ["km", "away"], place: "CHIREC School" },
          { minutes: "4.7", unit: ["km", "away"], place: "DLF Cybercity" },
          { minutes: "5.5", unit: ["km", "away"], place: "KIMS Hospitals" },
          { minutes: "5.6", unit: ["km", "away"], place: "Gachibowli ORR" },
        ],
        mapText: "Lingampalli railway station is 3 km away, Raidurg Metro 7.3 km and Rajiv Gandhi International Airport 34 km.",
        map: { src: "/projects/altus/map.webp", alt: "Street map of Kondapur with Altus marked" },
        mapButton: "Open in Google Maps",
        mapsUrl: "https://maps.google.com/?q=Hallmark+Altus+Kondapur",
      },
      people: {
        image: { src: "/projects/altus/am-sky.webp", alt: "A couple on the sky garden above the city" },
        label: "Altus by Globus",
        heading: ["Perks, curated", "for all ages"],
      },
      views: {
        lead: "Indulge in the exclusive amenities at Altus, meticulously crafted to elevate your lifestyle and enrich every moment with comfort, luxury, and refinement.",
        images: [
          { src: "/projects/altus/am-sky.webp", alt: "Sky garden" },
          { src: "/projects/altus/am-theatre.webp", alt: "Rooftop theatre" },
          { src: "/projects/altus/am-cowork.webp", alt: "Co-working space" },
          { src: "/projects/altus/club-pool.webp", alt: "Pool deck beside the towers" },
          { src: "/projects/altus/in-bedroom.webp", alt: "Bedroom" },
        ],
        text: "Sky garden, rooftop theatre, co-working space, biophilic garden, pickle ball, toddlers’ play area, senior citizen area and creche.",
      },
      homes: {
        background: { src: "/projects/altus/h4.jpg", alt: "Altus towers" },
        heading: ["Find your", "home"],
        intro: "Three home types across Block A and Block B.", // DRAFT
        slides: [
          { image: { src: "/projects/altus/in-living.webp", alt: "Altus living room" }, photo: true, text: "3 BHK in Block B, in five sizes: 1,760, 1,950, 2,265, 2,540 and 2,975 sft, across the north and south wings." },
          { image: { src: "/projects/altus/in-bedroom.webp", alt: "Altus bedroom" }, photo: true, text: "4 BHK in Block B: two homes on each floor, 3,270 sft, facing the tennis and basketball courts." },
          { image: { src: "/projects/altus/masterplan.webp", alt: "Altus master plan" }, text: "4 BHK with a home theatre in Block A: just two homes on each floor, 4,575 and 4,685 sft." },
        ],
        button: { label: "Enquire", href: "tel:+919519781978" },
      },
      choose: chooseHome("Altus"),
    },
  },

  // ---------------------------------------------------------------- Treasor
  {
    kind: "full",
    slug: "treasor",
    name: "Treasor",
    area: "Kokapet",
    status: "Ongoing",
    tagline: "3 & 4 BHK Apartments",
    rera: "P02400003226",
    card: { src: "/projects/treasor/in-balcony.webp", alt: "A couple on a balcony at Treasor at dusk" },
    sections: {
      intro: {
        title: ["Treasor", "Kokapet"],
        heading: ["Live the art of", "timeless living"],
        label: ["3 & 4 BHK", "G+29 floors", "20 acres"],
      },
      tower: {
        image: { src: "/projects/treasor/hero.jpg", alt: "Treasor towers at sunset" },
        heading: ["Soaring up to", "G+29 floors"],
        intro: "Soaring up to G+29 floors, the towering landmark features meticulously engineered homes with expansive balconies that invite the sky in. Some luxuries are admired from afar. Others? You live in them.",
        lead: "Hallmark Treasor rises with strength and precision, built using next-gen MIVAN monolithic construction technology, renowned worldwide for its structural integrity, accuracy, and speed.",
        note: ["TG RERA", "P02400003226"],
        button: { label: "See the homes", href: "#plans" },
        images: [
          { src: "/projects/treasor/in-living.webp", alt: "Living room with white sofas and a forest mural" },
          { src: "/projects/treasor/in-balcony.webp", alt: "Couple on a balcony at dusk above the city" },
        ],
      },
      format: {
        heading: ["A glimpse", "of Treasor", "living"],
        intro: "Open your windows to panoramic views that blend the charm of the past with the promise of the present: lush greens, shimmering waters, and the timeless legacy of the land.",
        image: { src: "/projects/treasor/in-dining.webp", alt: "Lounge with a curved sofa beside the dining area" },
        slides: [
          "Indulge in everyday grandeur. Step into a world where the grace of the past meets the elegance of the present.",
          "Where play meets the horizon. Let vibrant greens bring life to your view, and watch your little ones explore, right from your balcony.",
        ],
      },
      crown: {
        background: { src: "/projects/treasor/club-lounge.webp", alt: "Clubhouse lounge with art and sculpture" },
        title: "Amenities that define indulgence",
        image: { src: "/projects/treasor/club-yoga.webp", alt: "Yoga studio with mats and a green wall" },
        button: { label: "See the homes", href: "#plans" },
      },
      location: {
        project: "Treasor",
        heading: ["A coveted", "address"],
        label: ["Kokapet,", "Hyderabad"],
        lead: "A coveted address in the heart of progress, minutes from Gachibowli, HITEC City and Wipro Circle.",
        image: { src: "/projects/treasor/hl-2.webp", alt: "Treasor towers" },
        button: { label: "Location", href: "#map" },
        text: "Sunsets drape the skyline in gold while tranquil waters mirror the sky.",
        times: [
          { minutes: "10", unit: ["min", "drive"], place: "Gachibowli" },
          { minutes: "15", unit: ["min", "drive"], place: "HITEC City" },
          { minutes: "15", unit: ["min", "drive"], place: "Wipro Circle" },
          { minutes: "25", unit: ["min", "drive"], place: "Airport" },
        ],
        mapText: "Jubilee Hills is 20 minutes away.",
        map: { src: "/projects/treasor/map.webp", alt: "Street map of Kokapet with Treasor marked" },
        mapButton: "Open in Google Maps",
        mapsUrl: "https://maps.google.com/?q=Hallmark+Treasor+Kokapet",
      },
      people: {
        image: { src: "/projects/treasor/am-pool.webp", alt: "Swimming pool between the towers" },
        label: "Treasor by Globus",
        heading: ["Views that speak", "in silhouettes"],
      },
      views: {
        lead: "Thirteen amenities, from a gymnasium, library and yoga-meditation centre to a spa, preview theatre, guest rooms and a swimming pool.",
        images: [
          { src: "/projects/treasor/club-gym.webp", alt: "Gymnasium" },
          { src: "/projects/treasor/am-pool.webp", alt: "Swimming pool" },
          { src: "/projects/treasor/in-kids.webp", alt: "Children’s bedroom with terrazzo walls" },
          { src: "/projects/treasor/club-yoga.webp", alt: "Yoga-meditation centre" },
          { src: "/projects/treasor/in-balcony.webp", alt: "Balcony at dusk" },
        ],
        text: "Every view is a canvas, and every day, a masterpiece.",
      },
      homes: {
        background: { src: "/projects/treasor/hl-1.webp", alt: "Treasor towers" },
        heading: ["Find your", "home"],
        intro: "3 BHK homes and 4 BHK duplexes, each with an open living and dining room.", // DRAFT
        slides: [
          { image: { src: "/projects/treasor/plan-3a.webp", alt: "Floor plans for 3 BHK homes of 1,765 and 2,040 sft" }, text: "3 BHK in three sizes: 1,765, 2,040 and 2,540 sft, each in east and west facing." },
          { image: { src: "/projects/treasor/plan-3b.webp", alt: "Floor plans for 3 BHK homes of 2,540 and 3,830 sft" }, text: "Flat 09: the largest 3 BHK, 3,830 sft east facing, with a home theatre and a maid room." },
          { image: { src: "/projects/treasor/plan-d1.webp", alt: "Lower and upper floor plans for the 3,530 sft duplex" }, text: "4 BHK duplexes of 3,530, 4,080 and 5,080 sft: living below, family lounge and home theatre above." },
        ],
        button: { label: "Enquire", href: "tel:+919519781978" },
      },
      choose: chooseHome("Treasor"),
    },
  },

  // ---------------------------------------------------------------- Floresta
  {
    kind: "full",
    slug: "floresta",
    name: "Floresta",
    area: "Pati, Kollur",
    status: "Ongoing",
    tagline: "3 & 4 BHK Apartments & G+2 Triplex Villas",
    rera: "P01100007551",
    card: { src: "/projects/floresta/g-pergola.webp", alt: "Pergola walk beside the Floresta villas" },
    sections: {
      intro: {
        title: ["Floresta", "Pati, Kollur"],
        heading: ["A home cradled", "by green"],
        label: ["G+2 triplex villas", "& apartments", "Kollur"],
      },
      tower: {
        image: { src: "/projects/floresta/hero.jpg", alt: "Floresta villas among trees" },
        heading: ["Embrace", "radiant living"],
        intro: "Nestled amidst lush greenery, Floresta offers an exquisite blend of urban sophistication and natural serenity.",
        lead: "These ultra-luxury G+2 villas are enveloped by 3,475 acres of ICRISAT green fields, providing a rare sanctuary away from the city’s chaos.",
        note: ["TG RERA", "P01100007551"],
        button: { label: "See the villas", href: "#plans" },
        images: [
          { src: "/projects/floresta/g-pergola.webp", alt: "Pergola walk beside the villas" },
          { src: "/projects/floresta/g-avenue.webp", alt: "Avenue of villas under flowering trees" },
        ],
      },
      format: {
        heading: ["Nature", "meets", "urban access"],
        intro: "A lush sanctuary near the evolving residential and ITIR hub by Kollur, just 15 minutes from the Financial District.",
        image: { src: "/projects/floresta/g-villa.webp", alt: "A villa facade with timber and white planes" },
        slides: [
          "Three floors and a lift in every villa, with a home theatre on the second floor beside a large terrace.",
          "Water softening, sewage treatment, uninterrupted power, CCTV security and smart hardware for seamless home control.",
        ],
      },
      crown: {
        background: { src: "/projects/floresta/club-lobby.webp", alt: "Clubhouse lobby with a spiral stair" },
        title: "A 22,820 sq ft clubhouse of immersive leisure",
        image: { src: "/projects/floresta/club-gym.webp", alt: "Gymnasium with glass walls" },
        button: { label: "See the villas", href: "#plans" },
      },
      location: {
        project: "Floresta",
        heading: ["An address that", "speaks for itself"],
        label: ["Pati,", "Kollur"],
        lead: "Floresta offers serene escape just 15 minutes from the Financial District. Schools, healthcare, and recreation are all conveniently close.",
        image: { src: "/projects/floresta/hl-2.webp", alt: "Floresta villa streets among trees" },
        button: { label: "Location", href: "#map" },
        text: "Close to the ORR, the Hyderabad–Mumbai highway and Neopolis.",
        times: [
          { minutes: "03", unit: ["min", "drive"], place: "ORR Kolluru exit" },
          { minutes: "05", unit: ["min", "drive"], place: "The Gaudium School" },
          { minutes: "10", unit: ["min", "drive"], place: "Neopolis" },
          { minutes: "25", unit: ["min", "drive"], place: "Financial District" },
        ],
        mapText: "Aparna Mall in Nallagandla is 15 minutes away and Rajiv Gandhi International Airport 35 minutes.",
        map: { src: "/projects/floresta/map.webp", alt: "Street map of Kollur with Floresta marked" },
        mapButton: "Open in Google Maps",
        mapsUrl: "https://maps.google.com/?q=Hallmark+Floresta+Villas+Kollur",
      },
      people: {
        image: { src: "/projects/floresta/am-pool.webp", alt: "Swimming pool with loungers, wrapped in green" },
        label: "Floresta by Globus",
        heading: ["Curated comforts,", "crafted for you"],
      },
      views: {
        lead: "Nineteen amenities, from a cricket ground, skating rink and rock climbing to an amphitheatre, pet park, nature walk and swimming pool.",
        images: [
          { src: "/projects/floresta/am-amphi.webp", alt: "Sunken lawn amphitheatre" },
          { src: "/projects/floresta/am-garden.webp", alt: "Landscaped walk with stepping stones" },
          { src: "/projects/floresta/g-avenue.webp", alt: "Villa avenue" },
          { src: "/projects/floresta/am-pool.webp", alt: "Swimming pool" },
          { src: "/projects/floresta/club-lobby.webp", alt: "Clubhouse lobby" },
        ],
        text: "Thoughtfully crafted for luxury, comfort, and function, set against a backdrop of verdant beauty.",
      },
      homes: {
        background: { src: "/projects/floresta/hl-1.webp", alt: "Floresta villas" },
        heading: ["Find your", "villa"],
        intro: "Three villa sizes, each over three floors with a lift.", // DRAFT
        slides: [
          { image: { src: "/projects/floresta/plan-233e.webp", alt: "233 sq. yds east-facing villa floor plans" }, text: "233 sq. yds villa: 3,750 sft east facing or 3,775 sft west facing, with a home theatre on the second floor." },
          { image: { src: "/projects/floresta/plan-266e.webp", alt: "266 sq. yds east-facing villa floor plans" }, text: "266 sq. yds villa: 4,120 sft east facing or 4,090 sft west facing, with a home theatre, lounge and bar counter." },
          { image: { src: "/projects/floresta/plan-300e.webp", alt: "300 sq. yds east-facing villa floor plans" }, text: "300 sq. yds villa: 4,605 sft east facing, the largest plan, with a home theatre, study, pantry and sit-out." },
        ],
        button: { label: "Enquire", href: "tel:+919519781978" },
      },
      choose: { ...chooseHome("Floresta"), heading: ["Choose", "your villa"] },
    },
  },

  // ---------------------------------------------------------------- Upcoming
  {
    kind: "upcoming",
    slug: "westlyn",
    name: "Westlyn",
    area: "Hyderabad",
    status: "Upcoming",
    tagline: "Villas",
    card: { src: "/projects/westlyn/hero.webp", alt: "Westlyn villas" },
    hero: { src: "/projects/westlyn/hero.webp", alt: "Westlyn villas" },
    heading: ["Hyderabad’s most", "affluent address"],
    description: "Westlyn is Globus Developers’ next address in Hyderabad. Register your interest to hear first about plans, prices and the launch.", // DRAFT
  },
  {
    kind: "upcoming",
    slug: "tukkuguda",
    name: "Tukkuguda",
    area: "South Hyderabad",
    status: "Upcoming",
    tagline: "Globus Township",
    card: { src: "/projects/tukkuguda/forest.webp", alt: "Forest canopy in morning mist" },
    hero: { src: "/projects/tukkuguda/forest.webp", alt: "Forest canopy in morning mist" },
    heading: ["Hyderabad’s next", "premium address"],
    description:
      "A visionary address rising in Tukkuguda, Globus Township redefines community living with world-class design, seamless connectivity, and the quiet assurance of long-term value. Just minutes from the Rajiv Gandhi International Airport and surrounded by GMR AeroCity, World Trade Center Shamshabad, Pharma City, and Bharat Future City, this is where South Hyderabad’s future takes shape.",
  },
];

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
