import { useTranslations } from "next-intl";

import { profile } from "@/content/profile";

import { SCENE_OBJECTS } from "./config";
import { Branch } from "./layers/Branch";
import { Ground } from "./layers/Ground";
import { FarMountains, MidMountains, NearForest } from "./layers/Mountains";
import { Sky } from "./layers/Sky";
import { SceneObject } from "./objects/SceneObject";
import { SceneAnimator } from "./SceneAnimator";

export const HUB_ID = "hub";

// Server-rendered composition: a sticky backdrop (sky, mountains, forest) behind two screens in
// normal document flow, the p = 0 opening frame and the hub. Parallax comes from the `parallax`
// utilities in globals.css (native CSS scroll timelines, with SceneAnimator as the JS fallback).
// All layer depths live here: backdrop layers rise slowly (negative), the branch scrolls away
// faster, the title lags and fades. With reduced motion nothing moves: the static composition.
export function Scene() {
  const t = useTranslations("scene");
  const tNav = useTranslations("nav.links");

  return (
    <div data-scene-root className="relative isolate overflow-clip">
      <SceneAnimator />
      <div aria-hidden="true" className="sticky top-header h-stage">
        <Sky className="parallax [--depth:-0.05]" />
        <FarMountains className="parallax [--depth:-0.28]" />
        <MidMountains className="parallax [--depth:-0.36]" />
        <NearForest className="parallax [--depth:-0.45]" />
      </div>

      <section className="relative -mt-stage h-stage overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 parallax [--depth:-0.25]"
        >
          <Branch />
        </div>
        <div className="relative flex h-full parallax-fade flex-col items-center justify-center px-4 pb-24 text-center [--depth:0.4]">
          <h1 className="font-display text-4xl font-semibold text-balance text-iris-50 [text-shadow:0_2px_16px_var(--color-midnight-950)] sm:text-6xl">
            <span className="block">{profile.name}</span>
            <span className="mt-2 block text-xl font-normal text-blush-200 sm:text-2xl">
              {t("titleSuffix")}
            </span>
          </h1>
        </div>
        <a
          href={`#${HUB_ID}`}
          aria-label={t("toHub")}
          className="absolute inset-x-0 bottom-6 mx-auto flex size-12 parallax-fade items-center justify-center rounded-full text-iris-50 hover:bg-midnight-800"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8 motion-safe:animate-bounce"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

      <section
        id={HUB_ID}
        aria-label={t("hubLabel")}
        className="relative h-below-header scroll-mt-header overflow-hidden"
      >
        <Ground />
        {/* Size container: objects are sized in cqw/cqh of the hub. */}
        <ul className="[container-type:size] absolute inset-0">
          {SCENE_OBJECTS.map((object) => (
            <SceneObject
              key={object.id}
              object={object}
              name={t(`objects.${object.id}`)}
              label={tNav(object.section)}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
