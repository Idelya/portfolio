import { Cat } from "../cat/Cat";
import type { SceneObjectId } from "../config";

// Placeholder art per hub object. Each viewBox matches the object's `aspect` in config.ts
// (height / width), so swapping in final art keeps the layout and the overlap checks valid.

function SkillTree() {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" className="size-full">
      <rect
        x="44"
        y="60"
        width="12"
        height="50"
        rx="4"
        className="fill-midnight-950"
      />
      <circle cx="50" cy="40" r="32" className="fill-iris-700" />
      <circle cx="28" cy="52" r="20" className="fill-iris-600" />
      <circle cx="72" cy="52" r="20" className="fill-iris-600" />
      {[
        [36, 30],
        [60, 24],
        [50, 50],
        [24, 56],
        [76, 58],
        [66, 40],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="4"
          className="fill-glow-300"
        />
      ))}
    </svg>
  );
}

function CatOnBoulder() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full">
      <ellipse cx="50" cy="86" rx="46" ry="14" className="fill-midnight-600" />
      <Cat x={22} y={4} width={56} height={76} className="text-midnight-950" />
    </svg>
  );
}

function Signpost() {
  return (
    <svg viewBox="0 0 100 140" aria-hidden="true" className="size-full">
      <rect
        x="45"
        y="20"
        width="10"
        height="120"
        rx="3"
        className="fill-iris-800"
      />
      <path d="M8 30 H72 L86 42 L72 54 H8 Z" className="fill-blush-400" />
      <path d="M92 66 H28 L14 78 L28 90 H92 Z" className="fill-azure-400" />
    </svg>
  );
}

function Mailbox() {
  return (
    <svg viewBox="0 0 100 150" aria-hidden="true" className="size-full">
      <rect
        x="44"
        y="64"
        width="12"
        height="86"
        rx="3"
        className="fill-iris-800"
      />
      <rect
        x="12"
        y="28"
        width="72"
        height="42"
        rx="21"
        className="fill-azure-500"
      />
      <rect x="80" y="10" width="5" height="34" className="fill-midnight-950" />
      <rect x="80" y="10" width="18" height="11" className="fill-blush-500" />
    </svg>
  );
}

function Chest() {
  return (
    <svg viewBox="0 0 100 75" aria-hidden="true" className="size-full">
      <rect
        x="8"
        y="34"
        width="84"
        height="38"
        rx="4"
        className="fill-glow-700"
      />
      <path d="M8 36 V26 Q50 -2 92 26 V36 Z" className="fill-glow-600" />
      <rect
        x="44"
        y="34"
        width="12"
        height="14"
        rx="2"
        className="fill-glow-300"
      />
    </svg>
  );
}

const ART: Record<SceneObjectId, () => React.JSX.Element> = {
  signpost: Signpost,
  skillTree: SkillTree,
  cat: CatOnBoulder,
  chest: Chest,
  mailbox: Mailbox,
};

export function ObjectArt({ id }: { id: SceneObjectId }) {
  const Art = ART[id];
  return <Art />;
}
