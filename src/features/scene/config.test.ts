import { describe, expect, it } from "vitest";

import {
  SCENE_OBJECTS,
  type SceneLayout,
  type SceneObjectConfig,
} from "./config";

// --spacing-header in globals.css (3.5rem): the hub is one screen below the nav bar.
const HEADER_PX = 56;
// Label under each object in SceneObject.tsx: text-sm line (20) + py-0.5 (4) + gap-1 (4),
// plus 4px of slack for font metrics. The e2e overlap test checks the real boxes.
const LABEL_HEIGHT_PX = 32;

interface Hub {
  width: number;
  height: number;
}

// Viewports per layout, from the matrix in GAME_DESIGN.md plus the extremes of each orientation
// (near-square windows, short phones).
const VIEWPORTS: Record<SceneLayout, Hub[]> = {
  portrait: [
    { width: 360, height: 740 },
    { width: 390, height: 844 },
    { width: 393, height: 659 }, // iPhone 15 in Playwright
    { width: 768, height: 1024 },
    { width: 700, height: 800 }, // near-square portrait window
  ],
  landscape: [
    { width: 740, height: 360 }, // phone
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1080 },
    { width: 800, height: 800 }, // near-square landscape window
  ],
};

// Keeps high objects clear of the nav menu area (GAME_DESIGN.md "safe zone at the top").
const SAFE_TOP_PX = 48;

interface Box {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function box(object: SceneObjectConfig, layout: SceneLayout, hub: Hub): Box {
  const { x, y, width, widthByHeight } = object.placement[layout];
  const artWidth = Math.min(
    (width / 100) * hub.width,
    (widthByHeight / 100) * hub.height,
  );
  const height = artWidth * object.aspect + LABEL_HEIGHT_PX;
  const bottom = hub.height - (y / 100) * hub.height;

  return {
    id: object.id,
    left: (x / 100) * hub.width - artWidth / 2,
    right: (x / 100) * hub.width + artWidth / 2,
    top: bottom - height,
    bottom,
  };
}

function overlaps(a: Box, b: Box) {
  return (
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  );
}

const cases = (["landscape", "portrait"] as const).flatMap((layout) =>
  VIEWPORTS[layout].map(({ width, height }) => ({
    layout,
    hub: { width, height: height - HEADER_PX },
  })),
);

describe.each(cases)(
  "$layout layout at $hub.width×$hub.height",
  ({ layout, hub }) => {
    const boxes = SCENE_OBJECTS.map((object) => box(object, layout, hub));

    it.each(boxes)("$id stays inside the hub", (b) => {
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(hub.width);
      expect(b.top).toBeGreaterThanOrEqual(SAFE_TOP_PX);
      expect(b.bottom).toBeLessThanOrEqual(hub.height);
    });

    it("has no overlapping objects", () => {
      for (const [i, a] of boxes.entries()) {
        for (const b of boxes.slice(i + 1)) {
          expect(overlaps(a, b), `${a.id} overlaps ${b.id}`).toBe(false);
        }
      }
    });

    it("keeps every art box at least 44px wide (tap target)", () => {
      for (const b of boxes)
        expect(b.right - b.left).toBeGreaterThanOrEqual(44);
    });
  },
);

it("orders objects left to right in the landscape layout (keyboard order)", () => {
  const xs = SCENE_OBJECTS.map((o) => o.placement.landscape.x);
  expect(xs).toEqual([...xs].sort((a, b) => a - b));
});

it("leads every object to a different section", () => {
  const sections = SCENE_OBJECTS.map((o) => o.section);
  expect(new Set(sections).size).toBe(sections.length);
});
