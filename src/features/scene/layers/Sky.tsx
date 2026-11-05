// Placeholder sky layer: night gradient (CSS) plus stars. Anchored to the top, cropped, never
// stretched. Final art: same 1920×1080 canvas.
const STARS = [
  [120, 90, 2],
  [260, 210, 1.5],
  [410, 60, 2.5],
  [560, 160, 1.5],
  [700, 300, 2],
  [820, 80, 1.5],
  [960, 190, 3],
  [1090, 70, 1.5],
  [1210, 260, 2],
  [1340, 130, 2.5],
  [1480, 40, 1.5],
  [1600, 220, 2],
  [1740, 110, 1.5],
  [1850, 300, 2],
  [330, 380, 1.5],
  [1420, 400, 1.5],
] as const;

export function Sky() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-linear-to-b from-midnight-950 via-iris-900 to-blush-800"
    >
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMin slice"
        className="size-full"
      >
        {STARS.map(([cx, cy, r]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            className="fill-iris-50"
          />
        ))}
        <circle
          cx="1500"
          cy="200"
          r="60"
          className="fill-glow-100 opacity-90"
        />
      </svg>
    </div>
  );
}
