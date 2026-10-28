/*
  All the words and images on the homepage (the Globus brand page), one object per section.
  Edit text here; the components only handle layout and motion.
  Each project's own content lives in projects.ts (Neo's in neo.ts).

  Copy comes from globusdevelopers.com unless marked DRAFT — confirm DRAFT lines with the client.
*/

import type { ChooseContent, FormatContent, IntroContent, PeopleContent, ViewsContent } from "./types";

export const site = {
  project: "Neo",
  developer: "Globus Developers",
  url: "https://www.globusdevelopers.com", // live domain, used for the sitemap and share links
  phone: "+91 95 1978 1978",
  email: "info@globusdevelopers.com",
};

export const nav = {
  cta: "Enquire now", // live site's button label
  // Same labels and order as the live site's menu
  main: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Career", href: "/career" },
    { label: "Blogs", href: "/news" },
    { label: "Partner With Us", href: "/partner-with-us" },
    { label: "Contact Us", href: "/contact" },
  ],
  secondary: [
    { label: "Location", href: "/location" },
    { label: "Construction progress", href: "/progress" },
  ],
  tiles: [
    { label: "Enquire now", href: "/contact" },
    { label: "Book a site visit", href: "/contact" },
  ],
};

export const intro: IntroContent = {
  title: ["Globus Developers", "Hyderabad"], // DRAFT
  heading: ["Crafting skylines", "building futures"], // Globus tagline from the live site
  label: ["Villas, residences", "& townships", "Hyderabad"], // DRAFT
};

// "A legacy of landmarks": the photo that grows to full width, then two facts beside the counter.
export const format: FormatContent = {
  heading: ["A legacy", "of", "landmarks"],
  intro: "Our portfolio is a testament to our commitment to quality, innovation, and timeless design.",
  image: { src: "/neo/aerial-lake-4k.webp", alt: "Aerial view of Neo and the lake" },
  slides: [
    "Four ongoing landmarks across Kokapet, Kondapur and Kollur: Altus, Treasor, Neo and Floresta.", // DRAFT
    "Two upcoming addresses, Westlyn and Tukkuguda, are already taking shape.", // DRAFT
  ],
};

// The ongoing projects, one full screen each (cards come from projects.ts).
export const showcase = {
  button: "View project", // DRAFT
  upcoming: "Upcoming",
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

export const newsTeaser = {
  button: "All news and insights", // DRAFT
};

export const choose: ChooseContent = {
  heading: ["Choose", "your home"],
  buttons: [
    { label: "View all projects", href: "/projects", dark: true }, // live site label
    { label: "Book a site visit", href: "/contact", dark: false },
  ],
};

export const footer = {
  copyright: "© 2026 Globus Developers",
  credit: { label: "Website by marks+methods", href: "https://www.marksandmethods.com" },
  disclaimer:
    "All images are artist’s impressions for illustration only. Plans, sizes and specifications are indicative and subject to approval by the authorities. This website is not an offer or a contract. TG RERA: Neo P02400010006 · Altus P02400008439 · Treasor P02400003226 · Floresta P01100007551.",
};
