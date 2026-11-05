import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  // The locale layout has already rejected unknown locales with notFound().
  setRequestLocale(locale as Locale);

  return <main />;
}
