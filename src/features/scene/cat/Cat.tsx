import type { SVGProps } from "react";

// Placeholder cat silhouette (sitting), viewBox 100×100, feet on the bottom edge. Body color comes
// from `currentColor`. Accepts SVG props so it can be nested in another SVG (x, y, width, height).
export function Cat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <path
        d="M72 94 C94 92 98 70 86 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="76" rx="24" ry="24" fill="currentColor" />
      <circle cx="50" cy="42" r="18" fill="currentColor" />
      <path
        d="M34 34 L35 14 L47 26 Z M66 34 L65 14 L53 26 Z"
        fill="currentColor"
      />
      <circle cx="43" cy="42" r="3.5" className="fill-glow-300" />
      <circle cx="57" cy="42" r="3.5" className="fill-glow-300" />
    </svg>
  );
}
