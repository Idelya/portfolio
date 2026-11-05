import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";

import { routing } from "./routing";

// The locale comes from the [locale] root segment via next/root-params, so pages and layouts don't
// pass it around. An explicit locale (e.g. getTranslations({ locale }) in a Server Action, where
// root params are not available yet) takes precedence.
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const requested = explicitLocale ?? (await rootParams.locale());
  // Unknown first segments (/de, /favicon.txt…) end up here: [locale] acts as a catch-all.
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: (await import(`../messages/${requested}.json`)).default,
  };
});
