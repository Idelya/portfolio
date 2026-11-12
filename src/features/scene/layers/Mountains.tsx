import { useId } from "react";

import { Layer } from "./Layer";
import { forest, mountainRange } from "./procedural";

// Placeholder landscape of the opening frame, back to front. Each layer is a full 1920×1080 canvas
// anchored to the bottom and cropped (never stretched), in its own element so the parallax can
// move it at its own speed (`--depth`, see the `parallax` utility in globals.css).
// Atmospheric perspective: far layers are lighter and bluer, near layers darker and more violet.

const FAR = mountainRange({
  seed: 11,
  valleyY: 690,
  snow: 0.16,
  peaks: [
    { x: 110, y: 570 },
    { x: 420, y: 505 },
    { x: 700, y: 585 },
    { x: 960, y: 470 },
    { x: 1240, y: 560 },
    { x: 1510, y: 495 },
    { x: 1810, y: 575 },
  ],
});

const MID = mountainRange({
  seed: 23,
  valleyY: 820,
  snow: 0.22,
  peaks: [
    { x: 240, y: 650 },
    { x: 640, y: 565 },
    { x: 1080, y: 620 },
    { x: 1430, y: 545 },
    { x: 1770, y: 660 },
  ],
});

const NEAR_FOREST = forest({
  seed: 31,
  ground: (x) => 900 + 34 * Math.sin(x / 260) + 18 * Math.sin(x / 90),
  minHeight: 40,
  maxHeight: 120,
  spacing: 24,
});

interface LayerProps {
  /** Positioning and parallax depth, set by Scene.tsx (all depths live there). */
  className?: string;
}

// Backdrop layers: they sit in the sticky stage and rise as the visitor descends.

export function FarMountains({ className }: LayerProps) {
  const hazeId = useId();
  return (
    <Layer className={className}>
      <defs>
        <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            className="[stop-color:var(--color-iris-300)]"
            stopOpacity="0"
          />
          <stop
            offset="1"
            className="[stop-color:var(--color-blush-300)]"
            stopOpacity="0.45"
          />
        </linearGradient>
      </defs>
      <path d={FAR.silhouette} className="fill-midnight-500" />
      <path d={FAR.litFaces} className="fill-midnight-400" />
      <path d={FAR.snow} className="fill-midnight-200" opacity="0.85" />
      <rect
        x="-200"
        y="600"
        width="2320"
        height="480"
        fill={`url(#${hazeId})`}
      />
    </Layer>
  );
}

export function MidMountains({ className }: LayerProps) {
  const hazeId = useId();
  return (
    // The e2e parallax test measures this layer.
    <Layer className={className} data-testid="mid-mountains">
      <defs>
        <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            className="[stop-color:var(--color-iris-400)]"
            stopOpacity="0"
          />
          <stop
            offset="1"
            className="[stop-color:var(--color-iris-300)]"
            stopOpacity="0.4"
          />
        </linearGradient>
      </defs>
      <path d={MID.silhouette} className="fill-iris-800" />
      <path d={MID.litFaces} className="fill-iris-700" />
      <path d={MID.snow} className="fill-iris-200" />
      {/* Mist band between the mountains and the forest. */}
      <rect
        x="-200"
        y="740"
        width="2320"
        height="220"
        fill={`url(#${hazeId})`}
      />
    </Layer>
  );
}

export function NearForest({ className = "" }: LayerProps) {
  // The frontmost backdrop layer rises the most, so it carries a solid bleed below its canvas:
  // the bottom of the screen is never left empty while the hub scrolls in.
  return (
    <div aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <Layer>
        <path d={NEAR_FOREST} className="fill-iris-950" />
      </Layer>
      <div className="absolute inset-x-0 top-full h-full bg-iris-950" />
    </div>
  );
}
