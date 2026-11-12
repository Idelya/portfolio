import type { CSSProperties } from "react";

import { Link } from "@/i18n/navigation";

import type { Placement, SceneObjectConfig } from "../config";
import { ObjectArt } from "./ObjectArt";

interface SceneObjectProps {
  object: SceneObjectConfig;
  /** Object name for screen readers, e.g. "Mailbox". */
  name: string;
  /** Visible label: the section it leads to, e.g. "Contact". */
  label: string;
}

// CSS variables for one layout's placement. Width uses container query units of the hub list:
// min(width % of the hub width, widthByHeight % of the hub height), see config.ts.
function placementVars(p: Placement, suffix: "l" | "p") {
  return {
    [`--x-${suffix}`]: `${p.x}%`,
    [`--y-${suffix}`]: `${p.y}%`,
    [`--w-${suffix}`]: `min(${p.width}cqw, ${p.widthByHeight}cqh)`,
  };
}

// A hub object: a real link (art + always-visible label). Position comes from config.ts per
// layout through CSS variables; Tailwind's portrait/landscape variants pick the set.
export function SceneObject({ object, name, label }: SceneObjectProps) {
  const style = {
    ...placementVars(object.placement.landscape, "l"),
    ...placementVars(object.placement.portrait, "p"),
    "--aspect": `1 / ${object.aspect}`,
  } as CSSProperties;

  return (
    <li
      style={style}
      className="absolute bottom-(--y-l) left-(--x-l) w-(--w-l) -translate-x-1/2 portrait:bottom-(--y-p) portrait:left-(--x-p) portrait:w-(--w-p)"
    >
      <Link
        href={`/${object.section}`}
        className="group flex flex-col items-center gap-1 rounded-2xl"
      >
        <span className="block aspect-(--aspect) w-full transition duration-300 group-hover:scale-105 group-hover:drop-shadow-glow group-focus-visible:scale-105 group-focus-visible:drop-shadow-glow motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100">
          <ObjectArt id={object.id} />
        </span>
        <span className="rounded-full bg-surface px-3 py-0.5 text-sm whitespace-nowrap text-ink">
          <span className="sr-only">{name} — </span>
          {label}
        </span>
      </Link>
    </li>
  );
}
