import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { profile } from "@/content/profile";

interface PagesLayoutProps {
  children: ReactNode;
}

// Content subpages: the scene has no footer, so it lives here and not in the locale layout.
export default function PagesLayout({ children }: PagesLayoutProps) {
  return (
    <>
      {children}
      <Footer siteName={profile.name} githubUrl={profile.links.github} />
    </>
  );
}
