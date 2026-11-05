import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  localePrefix: "always",
  // "/" is redirected by Accept-Language only; the site sets no cookies (see DECISIONS.md).
  localeCookie: false,
  // hreflang alternates come from page metadata, a single source instead of a Link header too.
  alternateLinks: false,
});
