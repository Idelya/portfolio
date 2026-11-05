// Placeholder hub ground: back hill and foreground meadow on a 1920×1080 canvas anchored to the
// bottom. The hub background continues the near-hills color of the opening frame.
export function Ground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-midnight-900">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        data-layer="ground"
      >
        <path
          d="M0 420 Q500 260 1000 390 T1920 340 V1080 H0 Z"
          className="fill-iris-950"
        />
        <path
          d="M0 780 Q600 650 1200 760 T1920 720 V1080 H0 Z"
          className="fill-midnight-800"
        />
      </svg>
    </div>
  );
}
