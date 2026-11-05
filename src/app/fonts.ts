import { Fraunces, Nunito } from "next/font/google";

// Placeholder pairing: a soft, storybook serif for headings and a rounded sans for body text.
// Both include latin-ext for Polish diacritics. Self-hosted at build time by next/font.
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${nunito.variable}`;
