"use client";

import { useEffect } from "react";

const PROGRESS_VAR = "--scene-progress";

// Fallback engine for the scene parallax in browsers without CSS scroll-driven animations
// (e.g. Firefox before 159): writes the scroll progress (0 → 1) to a CSS variable on the scene
// root, and the `parallax` utilities in globals.css turn it into the same movement as the native
// engine. Setting it on the scene root, not <html>, keeps each frame's style recalculation small.
// Does nothing where the native engine runs or the visitor prefers reduced motion.
export function SceneAnimator() {
  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    // The scene root in Scene.tsx carries this attribute.
    const scene = document.querySelector<HTMLElement>("[data-scene-root]");
    if (!scene) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    // Scroll range, measured on start and resize only: scroll frames do no layout reads.
    let maxScroll = 0;

    const update = () => {
      frame = 0;
      const progress =
        maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      scene.style.setProperty(PROGRESS_VAR, progress.toFixed(4));
    };
    // At most one update per frame, however many scroll events arrive.
    const schedule = () => {
      if (!frame && !reducedMotion.matches)
        frame = requestAnimationFrame(update);
    };
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - innerHeight;
      schedule();
    };

    measure();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", measure);
      reducedMotion.removeEventListener("change", schedule);
      scene.style.removeProperty(PROGRESS_VAR);
    };
  }, []);

  return null;
}
