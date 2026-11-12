"use client";

import type { ComponentProps } from "react";

import { Link, usePathname } from "@/i18n/navigation";

// Locale-aware link that marks itself aria-current="page" on its section and its subpages.
// The only part of the nav menu that needs the client (usePathname).
export function NavLink({
  href,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      {...props}
    />
  );
}
