import { useTranslations } from "next-intl";

import { profile } from "@/content/profile";

import { SCENE_OBJECTS } from "./config";
import { Branch } from "./layers/Branch";
import { Ground } from "./layers/Ground";
import { Mountains } from "./layers/Mountains";
import { Sky } from "./layers/Sky";
import { SceneObject } from "./objects/SceneObject";

export const HUB_ID = "hub";

// Server-rendered static composition: the p = 0 opening frame, then the hub in normal document
// flow. This is also the no-JS and reduced-motion version; the scroll animation (ROADMAP Phase 3)
// will enhance it on the client without changing what is rendered here.
export function Scene() {
  const t = useTranslations("scene");
  const tNav = useTranslations("nav.links");

  return (
    <>
      <section className="relative isolate h-[calc(100svh-var(--spacing-header))] min-h-[28rem] overflow-hidden">
        <Sky />
        <Mountains />
        <Branch />
        <div className="relative flex h-full flex-col items-center justify-center px-4 pb-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-balance text-iris-50 sm:text-6xl">
            <span className="block">{profile.name}</span>
            <span className="mt-2 block text-xl font-normal text-blush-200 sm:text-2xl">
              {t("titleSuffix")}
            </span>
          </h1>
        </div>
        <a
          href={`#${HUB_ID}`}
          aria-label={t("toHub")}
          className="absolute bottom-6 left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full text-iris-50 hover:bg-midnight-800"
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
        className="relative isolate h-[calc(100svh-var(--spacing-header))] scroll-mt-header overflow-hidden"
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
    </>
  );
}
