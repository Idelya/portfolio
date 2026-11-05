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
      <ul className="flex gap-3">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === currentLocale ? "page" : undefined}
              className="underline-offset-4 hover:underline aria-[current=page]:font-bold"
            >
              {t(`locales.${locale}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
