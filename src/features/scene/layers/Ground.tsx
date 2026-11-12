import { Layer } from "./Layer";
import { forest } from "./procedural";

// Placeholder hub ground, anchored to the bottom of the canvas: a forest edge (darker than
// the backdrop forest, it is closer) and the meadow in front. The top stays transparent, so the
// sky and mountains of the sticky backdrop show above the trees.
const TREELINE = forest({
  seed: 59,
  ground: (x) => 470 + 30 * Math.sin(x / 300 + 2) + 14 * Math.sin(x / 110),
  minHeight: 60,
  maxHeight: 170,
  spacing: 30,
});

export function Ground() {
  return (
    <Layer>
      <path d={TREELINE} className="fill-midnight-900" />
      <path
        d="M0 640 Q520 540 1040 620 T1920 590 V1080 H0 Z"
        className="fill-midnight-800"
      />
    </Layer>
  );
}
