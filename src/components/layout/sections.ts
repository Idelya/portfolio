// The site's content sections, in menu order. Single source for the nav menu and the scene
// objects; each is a route (/[locale]/<section>) and a key of `nav.links` in the messages.
export const SECTIONS = [
  "about",
  "projects",
  "experience",
  "skills",
  "contact",
] as const;

export type Section = (typeof SECTIONS)[number];
