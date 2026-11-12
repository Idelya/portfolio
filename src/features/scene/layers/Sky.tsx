import { useId } from "react";

import { Layer } from "./Layer";
import { starField } from "./procedural";

// Placeholder sky: night gradient (CSS) plus stars, a haloed moon and a pink glow over the horizon.
// Anchored to the top of the canvas.
const STARS = starField(7, 170, 720);

export function Sky({ className = "" }: { className?: string }) {
  // Gradient ids are document-global: useId keeps them unique if the layer is ever reused.
  const glowId = useId();
  const haloId = useId();

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-linear-to-b from-midnight-950 via-iris-950 to-iris-800 ${className}`}
    >
      <Layer anchor="top">
        <defs>
          <radialGradient id={glowId}>
            <stop
              offset="0"
              className="[stop-color:var(--color-blush-500)]"
              stopOpacity="0.55"
            />
            <stop
              offset="0.5"
              className="[stop-color:var(--color-blush-600)]"
              stopOpacity="0.2"
            />
            <stop
              offset="1"
              className="[stop-color:var(--color-blush-600)]"
              stopOpacity="0"
            />
          </radialGradient>
          <radialGradient id={haloId}>
            <stop
              offset="0.3"
              className="[stop-color:var(--color-glow-100)]"
              stopOpacity="0.45"
            />
            <stop
              offset="1"
              className="[stop-color:var(--color-glow-100)]"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        <ellipse
          cx="960"
          cy="760"
          rx="1100"
          ry="380"
          fill={`url(#${glowId})`}
        />

        <g className="stroke-iris-50" strokeLinecap="round">
          {STARS.map((group) => (
            <path
              key={`${group.size}-${group.opacity}`}
              d={group.d}
              strokeWidth={group.size}
              opacity={group.opacity}
            />
          ))}
        </g>

        <circle cx="1480" cy="230" r="190" fill={`url(#${haloId})`} />
        <circle cx="1480" cy="230" r="64" className="fill-glow-50" />
        {/* Soft craters keep the moon from reading as a flat disc. */}
        <circle cx="1458" cy="212" r="12" className="fill-glow-100" />
        <circle cx="1502" cy="250" r="8" className="fill-glow-100" />
        <circle cx="1490" cy="204" r="5" className="fill-glow-100" />
      </Layer>
    </div>
  );
}
