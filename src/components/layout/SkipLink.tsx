import { useTranslations } from "next-intl";

// Every page renders its <main> with this id (and tabIndex={-1}, so focus can land on it).
export const MAIN_CONTENT_ID = "main-content";

export function SkipLink() {
  const t = useTranslations("skipLink");

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-lg bg-primary px-4 py-3 font-bold text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      {t("label")}
    </a>
  );
}
