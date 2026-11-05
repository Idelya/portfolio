// Placeholder mountain layers (far, mid, near), each a full-width 1920×1080 canvas anchored to the
// bottom. Separate elements so the parallax step can move them at different speeds.
export function Mountains() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        data-layer="far-mountains"
      >
        <path
          d="M0 700 L240 520 L420 610 L640 430 L880 600 L1080 470 L1320 640 L1560 500 L1760 590 L1920 520 V1080 H0 Z"
          className="fill-midnight-600"
        />
      </svg>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        data-layer="mid-mountains"
      >
        <path
          d="M0 820 L200 700 L380 780 L600 640 L820 800 L1000 690 L1240 820 L1440 680 L1680 800 L1920 720 V1080 H0 Z"
          className="fill-iris-900"
        />
      </svg>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        data-layer="near-hills"
      >
        <path
          d="M0 960 Q480 880 960 950 T1920 920 V1080 H0 Z"
          className="fill-midnight-900"
        />
      </svg>
    </div>
  );
}
