import { useTranslations } from "next-intl";

interface FooterProps {
  siteName: string;
  githubUrl: string;
}

export function Footer({ siteName, githubUrl }: FooterProps) {
  const t = useTranslations("footer");
  // Static build: the year is fixed at build time, which is fine for a site redeployed regularly.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-sm text-ink-muted">
        <p>{t("copyright", { year, name: siteName })}</p>
        <a
          href={githubUrl}
          className="flex min-h-11 items-center text-link underline-offset-4 hover:underline"
        >
          {t("github")}
        </a>
      </div>
    </footer>
  );
}
