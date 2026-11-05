"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Link, usePathname } from "@/i18n/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";

const SECTIONS = [
  "about",
  "projects",
  "experience",
  "skills",
  "contact",
] as const;

const MENU_ID = "site-menu";

interface NavMenuProps {
  siteName: string;
}

// Client component for usePathname (aria-current) and closing the mobile menu after a link is
// followed. Everything is server-rendered: the mobile menu is a native popover opened by
// popovertarget, so it also works without JavaScript (Esc and tapping outside close it).
export function NavMenu({ siteName }: NavMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Client-side navigation keeps this layout mounted, so the open popover must be closed by hand.
  function closeMenu() {
    const menu = menuRef.current;
    if (menu?.matches(":popover-open")) menu.hidePopover();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-header max-w-6xl items-center gap-1 px-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="mr-auto flex min-h-11 items-center rounded-lg font-display text-lg font-semibold whitespace-nowrap"
        >
          {siteName}
        </Link>

        <nav aria-label={t("label")} className="order-last lg:order-none">
          <button
            type="button"
            popoverTarget={MENU_ID}
            aria-label={t("menu")}
            className="flex size-11 items-center justify-center rounded-lg hover:bg-surface lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* Popover below lg; plain inline list from lg up (author styles override the
              UA rule that hides closed popovers). */}
          <div
            id={MENU_ID}
            ref={menuRef}
            popover="auto"
            className="inset-x-0 top-header bottom-auto m-0 w-full border-0 border-b border-line bg-surface p-4 text-ink shadow-lg lg:static lg:block lg:w-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
          >
            <ul className="flex flex-col gap-1 lg:flex-row">
              {SECTIONS.map((section) => {
                const href = `/${section}`;
                const isCurrent =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <li key={section}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      aria-current={isCurrent ? "page" : undefined}
                      className="flex min-h-11 items-center rounded-lg px-3 hover:bg-surface aria-[current=page]:font-bold aria-[current=page]:text-accent"
                    >
                      {t(`links.${section}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
