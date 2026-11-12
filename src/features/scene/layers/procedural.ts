// Deterministic generators for the placeholder scene art. Pure functions, run once at module load
// on the server, so every visit gets exactly the same SVG. Coordinates are in the layer canvas
// (see GAME_DESIGN.md "Asset specification").

/** Size of every full-scene layer canvas (the SVG viewBox). */
export const CANVAS = { width: 1920, height: 1080 } as const;
const { width: W, height: H } = CANVAS;

type Point = readonly [number, number];

/** Small seeded PRNG (mulberry32): same seed, same art. */
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Closed path through the points. Whole units are plenty at this canvas size and keep it small. */
function toPath(points: readonly Point[]): string {
  const [first, ...rest] = points;
  if (!first) return "";
  const at = ([x, y]: Point) => `${Math.round(x)} ${Math.round(y)}`;
  return `M${at(first)}${rest.map((p) => `L${at(p)}`).join("")}Z`;
}

const lerp = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

interface Peak {
  x: number;
  y: number;
}

interface MountainRange {
  /** Whole silhouette, closed down to the bottom of the canvas. */
  silhouette: string;
  /** Faces turned to the light (the moon is on the right), one path for all peaks. */
  litFaces: string;
  /** Snow caps, one path for all peaks with `snow`. */
  snow: string;
}

interface RangeOptions {
  peaks: readonly Peak[];
  /** y of the valleys between peaks (randomised a little). */
  valleyY: number;
  seed: number;
  /** Fraction of each slope (from the peak) covered by snow; 0 for none. */
  snow?: number;
}

/**
 * A faceted (low-poly) mountain range: peaks joined by jagged slopes, with a lit face on the right
 * of every peak and optional snow caps.
 */
export function mountainRange({
  peaks,
  valleyY,
  seed,
  snow = 0,
}: RangeOptions): MountainRange {
  const rand = random(seed);
  const sorted = [...peaks].sort((a, b) => a.x - b.x);

  // Valleys sit between neighbouring peaks, plus one beyond each canvas edge.
  const valleys: Point[] = [];
  for (let i = 0; i <= sorted.length; i++) {
    const left = sorted[i - 1]?.x ?? -W * 0.08;
    const right = sorted[i]?.x ?? W * 1.08;
    valleys.push([
      left + (right - left) * (0.4 + rand() * 0.2),
      valleyY + (rand() - 0.5) * 60,
    ]);
  }

  // Jagged slope from a to b: a few intermediate points nudged off the straight line.
  const slope = (a: Point, b: Point): Point[] => {
    const steps = 3;
    const points: Point[] = [];
    for (let s = 1; s < steps; s++) {
      const [x, y] = lerp(a, b, s / steps);
      points.push([x + (rand() - 0.5) * 30, y + (rand() - 0.3) * 24]);
    }
    return points;
  };

  const ridge: Point[] = [valleys[0]!];
  const lit: string[] = [];
  const caps: string[] = [];

  sorted.forEach((peak, i) => {
    const top: Point = [peak.x, peak.y];
    const leftValley = valleys[i]!;
    const rightValley = valleys[i + 1]!;
    const up = slope(leftValley, top);
    const down = slope(top, rightValley);
    ridge.push(...up, top, ...down, rightValley);

    // Lit face: from the peak down the right slope, back up through a point under the peak.
    const foot: Point = [
      peak.x + (rightValley[0] - peak.x) * 0.15,
      peak.y + (rightValley[1] - peak.y) * 0.95,
    ];
    lit.push(toPath([top, ...down, rightValley, foot]));

    if (snow > 0) {
      const l = lerp(top, leftValley, snow);
      const r = lerp(top, rightValley, snow);
      const mid = lerp(l, r, 0.5);
      caps.push(
        toPath([
          top,
          r,
          [r[0] - (r[0] - mid[0]) * 0.4, mid[1] - 6 + rand() * 14],
          [mid[0] + 8, mid[1] + 10 + rand() * 16],
          [mid[0] - 10, mid[1] - 4 + rand() * 10],
          [l[0] + (mid[0] - l[0]) * 0.4, mid[1] + 4 + rand() * 14],
          l,
        ]),
      );
    }
  });

  const silhouette = toPath([[-W * 0.1, H], ...ridge, [W * 1.1, H]]);

  return { silhouette, litFaces: lit.join(""), snow: caps.join("") };
}

interface ForestOptions {
  seed: number;
  /** Baseline height at x (the ground the trees stand on). */
  ground: (x: number) => number;
  minHeight: number;
  maxHeight: number;
  /** Average horizontal gap between trees. */
  spacing: number;
}

/**
 * A pine forest silhouette standing on a ground line, closed down to the bottom of the canvas:
 * one path, so it stays light in the HTML.
 */
export function forest({
  seed,
  ground,
  minHeight,
  maxHeight,
  spacing,
}: ForestOptions): string {
  const rand = random(seed);
  const points: Point[] = [
    [-20, H],
    [-20, ground(-20)],
  ];

  for (let x = -10; x < W + 40; x += spacing * (0.6 + rand() * 0.8)) {
    const h = minHeight + (maxHeight - minHeight) * rand();
    const w = h * (0.32 + rand() * 0.12);
    const y = ground(x);
    // Three tiers on each side give a pine shape.
    points.push(
      [x - w / 2, y],
      [x - w * 0.2, y - h * 0.42],
      [x - w * 0.36, y - h * 0.42],
      [x - w * 0.1, y - h * 0.72],
      [x - w * 0.22, y - h * 0.72],
      [x, y - h],
      [x + w * 0.22, y - h * 0.72],
      [x + w * 0.1, y - h * 0.72],
      [x + w * 0.36, y - h * 0.42],
      [x + w * 0.2, y - h * 0.42],
      [x + w / 2, y],
    );
  }

  points.push([W + 40, ground(W + 40)], [W + 40, H]);
  return toPath(points);
}

interface StarGroup {
  /** Dot diameter (stroke width of zero-length, round-capped segments). */
  size: number;
  opacity: number;
  /** One "M x y h0" segment per star. */
  d: string;
}

/**
 * Stars, denser towards the top of the sky, grouped by size and brightness so the sky is a handful
 * of paths instead of one element per star.
 */
export function starField(
  seed: number,
  count: number,
  maxY: number,
): StarGroup[] {
  const rand = random(seed);
  const groups = new Map<string, StarGroup>();

  for (let i = 0; i < count; i++) {
    const big = rand() > 0.92;
    const x = Math.round(rand() * W);
    const y = Math.round(rand() ** 1.6 * maxY);
    // Quantised: diameter in 1px steps, opacity in 0.2 steps.
    const size = Math.round(2 * (big ? 1.8 + rand() * 1.2 : 0.6 + rand()));
    const opacity = big ? 1 : Math.round((0.35 + rand() * 0.5) * 5) / 5;
    const key = `${size}-${opacity}`;
    const group = groups.get(key) ?? { size, opacity, d: "" };
    group.d += `M${x} ${y}h0`;
    groups.set(key, group);
  }

  return [...groups.values()];
}
