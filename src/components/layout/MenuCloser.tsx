"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

// Client-side navigation keeps the layout mounted, so an open menu popover would stay open:
// close it when a link inside it is followed and whenever the page changes (e.g. back button).
export function MenuCloser({ menuId }: { menuId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const close = () => {
      if (menu.matches(":popover-open")) menu.hidePopover();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) close();
    };

    close();
    menu.addEventListener("click", onClick);
    return () => menu.removeEventListener("click", onClick);
  }, [menuId, pathname]);

  return null;
}
