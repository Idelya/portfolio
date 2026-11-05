"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Client component only for usePathname: links keep the visitor on the same page in the other
// language. They are rendered on the server too, so switching works without JavaScript.
export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")}>
      <ul className="flex">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === currentLocale ? "page" : undefined}
              className="flex size-11 items-center justify-center rounded-lg text-sm text-ink-muted uppercase hover:bg-surface aria-[current=page]:font-bold aria-[current=page]:text-ink"
            >
              {/* Locale codes keep the header narrow at 360px. The full name is added for screen
                  readers; the visible code stays part of the accessible name (WCAG 2.5.3). */}
              {locale}
              <span className="sr-only"> {t(`locales.${locale}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
