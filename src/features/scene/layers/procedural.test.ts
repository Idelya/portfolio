import { describe, expect, it } from "vitest";

import { forest, mountainRange, random, starField } from "./procedural";

const range = () =>
  mountainRange({
    seed: 1,
    valleyY: 700,
    snow: 0.2,
    peaks: [
      { x: 400, y: 500 },
      { x: 1200, y: 450 },
    ],
  });

describe("procedural scene art", () => {
  it("is deterministic, so server and client render the same SVG", () => {
    expect(range()).toEqual(range());
    expect(starField(3, 20, 500)).toEqual(starField(3, 20, 500));
  });

  it("produces closed SVG paths", () => {
    const { silhouette, litFaces, snow } = range();
    for (const d of [silhouette, litFaces, snow]) {
      expect(d).toMatch(/^M-?\d+ -?\d+(L-?\d+ -?\d+)+Z/);
    }
    const trees = forest({
      seed: 2,
      ground: () => 900,
      minHeight: 40,
      maxHeight: 80,
      spacing: 30,
    });
    expect(trees.startsWith("M")).toBe(true);
    expect(trees.endsWith("Z")).toBe(true);
  });

  it("keeps the silhouette below the highest peak", () => {
    const ys = [...range().silhouette.matchAll(/-?\d+ (-?\d+)/g)].map(([, y]) =>
      Number(y),
    );
    expect(ys.length).toBeGreaterThan(0);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(450);
  });

  it("draws every star once, grouped into a few paths", () => {
    const groups = starField(5, 120, 600);
    const dots = groups.flatMap((g) => g.d.match(/M\d+ \d+h0/g) ?? []);
    expect(dots).toHaveLength(120);
    expect(groups.length).toBeLessThan(20);
  });

  it("draws random numbers in [0, 1)", () => {
    const next = random(42);
    for (let i = 0; i < 1000; i++) {
      const n = next();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});
