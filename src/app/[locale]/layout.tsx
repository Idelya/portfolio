import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { NavMenu } from "@/components/layout/NavMenu";
import { SkipLink } from "@/components/layout/SkipLink";
import { profile } from "@/content/profile";
import { routing } from "@/i18n/routing";

import { fontVariables } from "../fonts";

import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
}

// Still required for static rendering; the locale itself is read via next/root-params in
// src/i18n/request.ts, which also rejects unknown locales with notFound().
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <NavMenu siteName={profile.name} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
