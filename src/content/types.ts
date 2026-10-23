/*
  The shape of the content each section expects.
  The homepage (home.ts) and every project (projects.ts) fill these in.
*/

export type Picture = { src: string; alt: string };
export type Link = { label: string; href: string };

export type IntroContent = {
  title: string[]; // two short lines at the top
  heading: string[]; // big headline, split left / right
  label: string[]; // small grey lines under the headline
};

export type TowerContent = {
  image: Picture; // full-bleed photo that slides over the hero
  heading: string[];
  intro: string;
  lead: string;
  note: string[];
  button: Link;
  images: Picture[]; // two photos: the second wipes in over the first
};

export type FormatContent = {
  heading: string[]; // three parts
  intro: string;
  image: Picture; // grows to full width
  slides: string[]; // two short facts beside the counter
};

export type CrownContent = {
  background: Picture;
  title: string;
  image: Picture;
  button: Link;
};

export type LocationContent = {
  project: string; // name shown on the map marker
  heading: string[];
  label: string[];
  lead: string;
  image: Picture;
  button: Link;
  text: string;
  times: { minutes: string; unit: string[]; place: string }[];
  mapText: string;
  map: Picture;
  mapButton: string;
  mapsUrl: string;
};

export type PeopleContent = {
  image: Picture;
  label: string;
  heading: string[];
};

export type ViewsContent = {
  lead: string;
  images: Picture[];
  text: string;
};

export type HomesContent = {
  background: Picture;
  heading: string[];
  intro: string;
  slides: { image: Picture; text: string; photo?: boolean }[]; // photo: true → fill the frame (plans are shown whole)
  button: Link;
};

export type ChooseContent = {
  heading: string[];
  buttons: { label: string; href: string; dark: boolean }[];
};
