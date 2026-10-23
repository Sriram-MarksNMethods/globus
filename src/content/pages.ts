/*
  Words and images for the inner pages: About, Location, Construction progress, News, Home selection.
  Copy comes from globusdevelopers.com unless marked DRAFT.
*/

// ---------------------------------------------------------------- About
export const about = {
  heading: ["Globus", "Developers"],
  label: ["Crafting luxury", "real estate", "in Hyderabad"],
  philosophy: {
    caption: ["Our foundation is built on three", "unwavering pillars"],
    pillars: [
      {
        name: "Vision",
        text: "To see beyond the blueprint, envisioning spaces that define generations and inspire human connection.",
        image: { src: "/about/vision-towers-dusk.webp", alt: "Globus towers lit up at dusk above the city" },
      },
      {
        name: "Precision",
        text: "A relentless pursuit of perfection, where every detail is meticulously crafted to the highest standard of quality.",
        image: { src: "/about/precision-water-garden.webp", alt: "Water garden and planting at the foot of Treasor" },
      },
      {
        name: "Legacy",
        text: "Creating enduring landmarks that stand as a testament to timeless design and unwavering integrity.",
        image: { src: "/about/legacy-clubhouse.webp", alt: "The Altus clubhouse lit up at dusk" },
      },
    ],
  },
  story: {
    lead: "We sculpt landmarks and forge legacies through a relentless pursuit of excellence, shaping environments that inspire and endure.",
    image: { src: "/about/story-model.webp", alt: "Architectural model of a Globus development" },
    paragraphs: [
      "From villa estates and integrated townships to contemporary residences across Hyderabad’s prime growth corridors, our projects reflect a vision that blends luxury with long-term value. Every landmark stands as a testament to precision, innovation, and the timeless art of fine living.",
      "Rooted in a relentless pursuit of excellence, our ethos is to merge visionary design with meticulous craftsmanship, creating spaces that are not just built, but thoughtfully brought to life.",
    ],
  },
  numbers: [
    { value: "04", label: ["Ongoing", "landmarks"], note: "Altus, Treasor, Neo and Floresta" },
    { value: "02", label: ["Upcoming", "addresses"], note: "Westlyn and Tukkuguda" },
    { value: "58+", label: ["Floors at", "Neo"], note: "Neopolis, Kokapet" },
  ],
  landmarks: {
    heading: ["A legacy", "of landmarks"],
    text: "Our portfolio is a testament to our commitment to quality, innovation, and timeless design.",
  },
};

// ---------------------------------------------------------------- Location
export const locationPage = {
  hero: { src: "/location/hyderabad-bridge.webp", alt: "Aerial view of a Hyderabad lake and cable bridge" },
  heading: ["Hyderabad’s", "growth corridors"], // DRAFT
  label: ["West", "Hyderabad"],
  intro: "Globus homes sit along the city’s western growth corridor, in Kondapur, Kokapet and Kollur, minutes from the Financial District, Gachibowli and the Outer Ring Road.", // DRAFT
  timesHeading: ["Travel", "times"],
  // One entry per area; the map and tiles switch when an area is picked.
  areas: [
    {
      name: "Kokapet",
      projects: "Neo · Treasor",
      map: { src: "/neo/map-kokapet.webp", alt: "Street map of Kokapet" },
      times: [
        { value: "5", unit: "min", place: "ORR exit, Kokapet" },
        { value: "10", unit: "min", place: "Financial District" },
        { value: "10", unit: "min", place: "Gachibowli" },
        { value: "15", unit: "min", place: "HITEC City" },
      ],
    },
    {
      name: "Kondapur",
      projects: "Altus",
      map: { src: "/projects/altus/map.webp", alt: "Street map of Kondapur" },
      times: [
        { value: "0.6", unit: "km", place: "CHIREC School" },
        { value: "4.7", unit: "km", place: "DLF Cybercity" },
        { value: "5.5", unit: "km", place: "KIMS Hospitals" },
        { value: "7.3", unit: "km", place: "Raidurg Metro" },
      ],
    },
    {
      name: "Kollur",
      projects: "Floresta",
      map: { src: "/projects/floresta/map.webp", alt: "Street map of Kollur" },
      times: [
        { value: "03", unit: "min", place: "ORR Kolluru exit" },
        { value: "05", unit: "min", place: "Nagulapalli station" },
        { value: "10", unit: "min", place: "Neopolis" },
        { value: "35", unit: "min", place: "Airport" },
      ],
    },
  ],
};

// ---------------------------------------------------------------- Construction progress
export const progress = {
  heading: ["Construction", "progress"],
  label: ["Updates", "from site"],
  updates: [
    {
      project: "Neo",
      when: "Latest update",
      youtubeId: "nSnKY_HT1xM",
    },
  ],
  emptyNote: "No site update has been published for this project yet. Updates will appear here as construction moves ahead.",
};

// ---------------------------------------------------------------- News
export const news = {
  heading: ["News", "and insights"],
  posts: [
    {
      slug: "south-hyderabad-2035",
      title: "South Hyderabad 2035: The Next Gachibowli Is Already Underway",
      category: "Market Insights",
      date: "04 November 2025",
      cover: { src: "/news/south-hyderabad-2035.webp", alt: "South Hyderabad skyline along the Airport Expressway corridor" },
      body: [
        { heading: "The South Takes the Lead", paragraphs: [
          "If Hyderabad’s west defined the last decade of real estate growth, the next belongs to the south. And not in theory, but on the ground. Drive past the Airport Expressway today, and you’ll see what data has been hinting at: cranes, trucks, and signboards announcing the future. Tukkuguda, Maheshwaram, and Shamshabad have crossed the speculative stage, they’re now in construction mode.",
        ] },
        { heading: "Infrastructure First, Speculation Later", paragraphs: [
          "The Regional Ring Road (RRR) has changed everything. It’s not just a boundary, it’s a catalyst. Combine that with the Aerospace and Pharma SEZs, the expanding Airport City, and direct connectivity to the proposed “Future City”, and you have a corridor where jobs, logistics, and housing are forming in perfect sync.",
          "Land that once sold for ₹10,000 per sq.yd now trades above ₹25,000–₹30,000. And this demand isn’t coming from short-term flippers, it’s end–users, NRIs, and corporate-backed investors betting on long-term urban gravity and government-led infrastructure.",
        ] },
        { heading: "From Peripheral to Prime", paragraphs: [
          "Once, South Hyderabad was considered “too far.” Now, it’s simply “far enough”, away from congestion yet seamlessly connected through expressways, metro extensions, and RRR corridors.",
          "The airport zone, once seen as fringe, has evolved into a full-fledged economic hub. Aerospace units, pharma labs, warehousing clusters, educational campuses, and the upcoming Future City Township by HMDA have given this region an employment and lifestyle backbone.",
          "Residential absorption is following naturally. From plotted developments to high-rise clusters and villa townships, the region is seeing an ecosystem take shape. Developers are acquiring large contiguous parcels, a clear sign that this isn’t a passing phase, but a structured growth cycle.",
        ] },
        { heading: "Why the South Will Define the Next Decade", paragraphs: [
          "For the long-term investor, the story feels familiar, because it is. Gachibowli circa 2010: undervalued, infrastructure-heavy, and poised for explosive growth once social amenities catch up.",
          "Only this time, lessons have been learned, planning precedes popularity. South Hyderabad 2035 won’t just be another real estate hub; it’ll be Hyderabad’s most balanced urban stretch, with Future City, Airport City, Pharma City, and Aerospace Park converging into a single, world-class development zone.",
          "The city isn’t just expandin, it’s evolving. And the south is where evolution finds its shape, skyline, and spirit.",
        ] },
      ],
    },
  ],
};

// ---------------------------------------------------------------- Home selection
export type HomeKind = "3 BHK" | "4 BHK" | "Villa";

export const homeTypes: {
  name: string;
  kind: HomeKind;
  project: string;
  slug: string;
  area: string;
  minSft: number;
  maxSft: number;
  detail: string;
  plan: string;
}[] = [
  { name: "3 BHK · Tower A", kind: "3 BHK", project: "Neo", slug: "neo", area: "Neopolis, Kokapet", minSft: 2235, maxSft: 2300, detail: "North and west facing, 11 ft ceilings", plan: "/neo/plan-3bhk-tower-a.webp" },
  { name: "4 BHK · Tower A", kind: "4 BHK", project: "Neo", slug: "neo", area: "Neopolis, Kokapet", minSft: 3095, maxSft: 3460, detail: "East and west facing, four sizes", plan: "/neo/plan-4bhk-tower-a.webp" },
  { name: "4 BHK + Maid · Tower B", kind: "4 BHK", project: "Neo", slug: "neo", area: "Neopolis, Kokapet", minSft: 3430, maxSft: 4565, detail: "Maid room in every home; home theatre in the largest", plan: "/neo/plan-4bhk-maid-tower-b.webp" },
  { name: "3 BHK · Block B", kind: "3 BHK", project: "Altus", slug: "altus", area: "Kondapur", minSft: 1760, maxSft: 2975, detail: "Five sizes across the north and south wings", plan: "/projects/altus/masterplan.webp" },
  { name: "4 BHK · Block B", kind: "4 BHK", project: "Altus", slug: "altus", area: "Kondapur", minSft: 3270, maxSft: 3270, detail: "Two homes on each floor, facing the courts", plan: "/projects/altus/masterplan.webp" },
  { name: "4 BHK + H.T · Block A", kind: "4 BHK", project: "Altus", slug: "altus", area: "Kondapur", minSft: 4575, maxSft: 4685, detail: "Just two homes on each floor", plan: "/projects/altus/masterplan.webp" },
  { name: "3 BHK", kind: "3 BHK", project: "Treasor", slug: "treasor", area: "Kokapet", minSft: 1765, maxSft: 2540, detail: "Three sizes, east and west facing", plan: "/projects/treasor/plan-3a.webp" },
  { name: "3 BHK · Flat 09", kind: "3 BHK", project: "Treasor", slug: "treasor", area: "Kokapet", minSft: 3830, maxSft: 3830, detail: "Home theatre and maid room", plan: "/projects/treasor/plan-3b.webp" },
  { name: "4 BHK Duplex", kind: "4 BHK", project: "Treasor", slug: "treasor", area: "Kokapet", minSft: 3530, maxSft: 5080, detail: "Two floors with a home theatre upstairs", plan: "/projects/treasor/plan-d1.webp" },
  { name: "233 Sq. Yds Villa", kind: "Villa", project: "Floresta", slug: "floresta", area: "Pati, Kollur", minSft: 3750, maxSft: 3775, detail: "G+2 with lift, east or west facing", plan: "/projects/floresta/plan-233e.webp" },
  { name: "266 Sq. Yds Villa", kind: "Villa", project: "Floresta", slug: "floresta", area: "Pati, Kollur", minSft: 4090, maxSft: 4120, detail: "G+2 with lift, home theatre and lounge", plan: "/projects/floresta/plan-266e.webp" },
  { name: "300 Sq. Yds Villa", kind: "Villa", project: "Floresta", slug: "floresta", area: "Pati, Kollur", minSft: 4605, maxSft: 4605, detail: "G+2 with lift, the largest villa plan", plan: "/projects/floresta/plan-300e.webp" },
];
