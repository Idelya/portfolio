import type { CSSProperties } from "react";

import { Link } from "@/i18n/navigation";

import type { SceneObjectConfig } from "../config";
import { ObjectArt } from "./ObjectArt";

interface SceneObjectProps {
  object: SceneObjectConfig;
  /** Object name for screen readers, e.g. "Mailbox". */
  name: string;
  /** Visible label: the section it leads to, e.g. "Contact". */
  label: string;
}

// A hub object: a real link (art + always-visible label). Position comes from config.ts per
// layout through CSS variables; Tailwind's portrait/landscape variants pick the set. Sizes use
// container query units of the hub list (cqw/cqh), see the width rule in config.ts.
export function SceneObject({ object, name, label }: SceneObjectProps) {
  const { landscape, portrait } = object.placement;
  const position = {
    "--x-l": `${landscape.x}%`,
    "--y-l": `${landscape.y}%`,
    "--w-l": landscape.width,
    "--wh-l": landscape.widthByHeight,
    "--x-p": `${portrait.x}%`,
    "--y-p": `${portrait.y}%`,
    "--w-p": portrait.width,
    "--wh-p": portrait.widthByHeight,
    "--aspect": `1 / ${object.aspect}`,
  } as CSSProperties;

  return (
    <li
      style={position}
      className="absolute bottom-(--y-l) left-(--x-l) w-[min(calc(var(--w-l)*1cqw),calc(var(--wh-l)*1cqh))] -translate-x-1/2 portrait:bottom-(--y-p) portrait:left-(--x-p) portrait:w-[min(calc(var(--w-p)*1cqw),calc(var(--wh-p)*1cqh))]"
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
