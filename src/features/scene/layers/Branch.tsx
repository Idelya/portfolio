import { Cat } from "../cat/Cat";

// Placeholder branch reaching in from the left edge with the cat sitting on it (decorative: the
// cat link lives in the hub). Canvas 600×240, anchored to the left edge.
export function Branch() {
  return (
    <svg
      viewBox="0 0 600 240"
      aria-hidden="true"
      data-layer="branch"
      className="absolute top-[14%] left-0 w-[min(70vw,36rem)] text-midnight-950"
    >
      <path
        d="M0 150 C150 130 300 140 600 118 L600 134 C300 158 150 156 0 178 Z"
        fill="currentColor"
      />
      <path
        d="M210 140 C240 110 270 100 300 96"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
      <circle cx="300" cy="94" r="14" className="fill-iris-800" />
      <circle cx="120" cy="140" r="18" className="fill-iris-800" />
      <circle cx="560" cy="116" r="12" className="fill-iris-800" />
      <Cat
        className="text-midnight-950"
        x={400}
        y={30}
        width={110}
        height={110}
      />
    </svg>
  );
}
