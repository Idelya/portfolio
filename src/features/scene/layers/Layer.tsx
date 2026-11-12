import type { ReactNode, SVGProps } from "react";

import { CANVAS } from "./procedural";

interface LayerProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Which edge of the canvas stays in view when the screen crops it (never stretched). */
  anchor?: "top" | "bottom";
  className?: string;
  children: ReactNode;
}

// One full-scene art layer: the shared canvas, filling its positioned parent and cropped to it.
// Final art keeps the same canvas (GAME_DESIGN.md "Asset specification").
export function Layer({
  anchor = "bottom",
  className = "",
  children,
  ...props
}: LayerProps) {
  return (
    <svg
      {...props}
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      preserveAspectRatio={
        anchor === "top" ? "xMidYMin slice" : "xMidYMax slice"
      }
      aria-hidden="true"
      className={`absolute inset-0 size-full ${className}`}
    >
      {children}
    </svg>
  );
}
