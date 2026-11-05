import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Guards WCAG AA contrast of the semantic color tokens in both themes, so the palette can be
// tweaked freely in globals.css without silently breaking readability.
const css = readFileSync(join(__dirname, "globals.css"), "utf8");

const raw = new Map(
  [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6});/gi)].map(
    ([, name, hex]) => [name, hex],
  ),
);

const semantic = new Map(
  [
    ...css.matchAll(
      /--color-([\w-]+):\s*light-dark\(\s*var\(--color-([\w-]+)\),\s*var\(--color-([\w-]+)\)\s*\);/g,
    ),
  ].map(([, name, light, dark]) => [name, { light, dark }]),
);

type Theme = "light" | "dark";

function resolve(token: string, theme: Theme): string {
  const pair = semantic.get(token);
  if (!pair) throw new Error(`Unknown semantic token: ${token}`);
  const hex = raw.get(pair[theme]);
  if (!hex) throw new Error(`Unknown raw color: ${pair[theme]}`);
  return hex;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio]: 4.5 for text, 3 for UI indicators (focus ring).
const pairs: [string, string, number][] = [
  ["ink", "canvas", 4.5],
  ["ink", "surface", 4.5],
  ["ink-muted", "canvas", 4.5],
  ["ink-muted", "surface", 4.5],
  ["link", "canvas", 4.5],
  ["link", "surface", 4.5],
  ["accent", "canvas", 4.5],
  ["accent", "surface", 4.5],
  ["on-primary", "primary", 4.5],
  ["focus", "canvas", 3],
  ["focus", "surface", 3],
];

describe("design tokens", () => {
  it("parses the palette from globals.css", () => {
    expect(raw.size).toBeGreaterThan(0);
    expect(semantic.size).toBeGreaterThan(0);
  });

  describe.each<Theme>(["light", "dark"])("%s theme", (theme) => {
    it.each(pairs)("%s on %s meets %d:1", (fg, bg, min) => {
      expect(
        contrast(resolve(fg, theme), resolve(bg, theme)),
      ).toBeGreaterThanOrEqual(min);
    });
  });
});
