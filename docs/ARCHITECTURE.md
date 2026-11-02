# Architecture

> Status: **target architecture**. As of 2026-11-02 the repo is a bare Next.js 13.4 scaffold.
> Phase 1 of [ROADMAP.md](ROADMAP.md) upgrades the stack and creates this structure.
> Update this doc whenever the real structure diverges.

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Static generation by default. |
| UI | **React 19** | Server Components by default, `"use client"` only where needed. |
| Language | **TypeScript**, `strict: true` | No `any` without a comment explaining why. |
| Styling | **Tailwind CSS 4** | Design tokens in CSS (`@theme`), no inline style objects for static styling. |
| i18n | **next-intl** | PL + EN, locale-prefixed routes. |
| Scene animation | **TBD** (see [GAME_DESIGN.md](GAME_DESIGN.md#technology-open-decision)) | DOM/SVG layers. Scroll: CSS scroll-driven animations, Motion or GSAP. Cat: Rive, Lottie or sprite sheet. |
| Contact form | Server Action + email service (**TBD**, e.g. Resend) | Validation with a schema library (e.g. Zod), spam protection (honeypot + rate limit). |
| Unit tests | **Vitest** + Testing Library | Logic, hooks, content validation. |
| E2E tests | **Playwright** | Multiple viewports and browsers, see [QUALITY.md](QUALITY.md). |
| Lint / format | ESLint (next config) + Prettier | |
| Hosting | **Vercel** | Preview deploy per PR, production from `master`. |
| Runtime | Node.js 20 LTS or newer | |

Exact versions live in `package.json`. Do not add a dependency without a reason; prefer the platform
and existing libraries. Record notable additions in [DECISIONS.md](DECISIONS.md).

## Rendering strategy

```
  /[locale]            Home scene (SSG)
  ├─ server-rendered:  <h1> title, nav menu, layered scene art, objects as real <a> links
  └─ client island:    scroll-driven parallax + cat animation + object hover/glow effects
                       (hydrates on top; without JS the static hub with working links remains)

  /[locale]/about, /projects, /projects/[slug], /experience, /skills, /contact   (SSG)
  └─ plain content pages: indexed by search engines, minimal client JS

  /[locale]/contact    form → Server Action → email service (the only server-side code)
```

- All pages are statically generated (`generateStaticParams` for locales), except the contact form's Server Action.
- The scene's server-rendered markup is the **final hub state** (cat landed, objects visible), so
  no-JS, reduced-motion and crawlers all see a complete, linkable scene. The client island adds the
  scroll sequence on top.
- Animation libraries and the cat animation runtime load only on the home page, never on subpages.
- Images in the scene: SVG inline or `next/image` with explicit dimensions, so there is no layout shift.
- The first screen (sky, mountains, tree, cat, title) is the LCP: keep those layers small and preloaded;
  lower layers and objects can load lazily.

## Directory structure (target)

```
src/
  app/
    [locale]/
      layout.tsx          # html lang, metadata, fonts, providers, nav menu
      page.tsx            # home: the scene
      about/
      projects/           # list
      projects/[slug]/    # project detail pages (SEO-friendly, shareable)
      experience/
      skills/
      contact/            # form + Server Action
      not-found.tsx
    sitemap.ts            # generated sitemap with hreflang alternates
    robots.ts
    opengraph-image.tsx   # generated OG images (per locale / per project)
    globals.css           # Tailwind import + design tokens
  components/
    ui/                   # generic, reusable primitives (Button, Link, Card, Icon)
    sections/             # subpage building blocks (ProjectCard, ExperienceItem, ContactForm…)
    layout/               # Header, NavMenu, Footer, LanguageSwitcher, SkipLink
  scene/                  # everything for the home scene; imported only by app/[locale]/page.tsx
    Scene.tsx             # server component: static layered markup (final hub state)
    SceneAnimator.tsx     # client island: scroll progress → layer transforms
    layers/               # Sky, Mountains, Tree, Ground… (placeholder SVGs first)
    cat/                  # cat animation wrapper
    objects/              # interactive objects (Mailbox…) and easter eggs
    config.ts             # layer depths, object positions per breakpoint, scroll keyframes
  content/
    types.ts              # TypeScript types for all content (Project, Experience, Skill…)
    projects.ts           # localized content data, see "Content layer" below
    experience.ts
    profile.ts
  i18n/
    routing.ts            # locales, default locale
    request.ts
  messages/
    en.json               # UI strings (buttons, labels, aria-labels)
    pl.json
  lib/                    # framework-agnostic helpers (seo, formatting, utils)
public/
  scene/                  # scene art assets (same file names for placeholder and final art)
  images/                 # optimized source images; use next/image
  cv/                     # CV PDFs per locale
tests/
  e2e/                    # Playwright specs
```

Rules:
- `src/scene/**` is imported only by the home page; subpages must not pull in scene code or animation libraries.
- `src/content/**` has no React imports; it is plain typed data so pages, scene labels and tests can use it.
- Components are named exports, one component per file, file named like the component (`ProjectCard.tsx`).

## Content layer

Two kinds of text:

1. **UI strings** (labels, buttons, aria-labels, scene object labels): `src/messages/{en,pl}.json`, accessed via next-intl.
2. **Portfolio content** (projects, experience, bio, skills): typed data in `src/content/`, with
   localized fields:

```ts
type Localized<T = string> = { en: T; pl: T };

interface Project {
  slug: string;              // URL-safe, stable, English
  title: Localized;
  summary: Localized;        // 1–2 sentences, used in cards and meta descriptions
  body?: Localized;          // longer description for the detail page
  stack: string[];
  links: { live?: string; repo?: string };
  image?: { src: string; alt: Localized };
  featured: boolean;
  period: { from: string; to?: string }; // ISO yyyy-mm
}
```

Missing translations must fail the build (validated by a test or a type), never silently fall back.
If longer, rich content becomes necessary, switch project bodies to MDX and record it in [DECISIONS.md](DECISIONS.md).

## i18n

- Locales: `en`, `pl`. Default locale: `en` (decision in [DECISIONS.md](DECISIONS.md)).
- Routes are always prefixed: `/en/...`, `/pl/...`. `/` redirects based on `Accept-Language`, falling back to `en`.
- Every page sets `<html lang>`, canonical URL and `hreflang` alternates (`en`, `pl`, `x-default` → `en`).
- Slugs are shared between locales (simpler, fine for a portfolio).
- The language switcher keeps the user on the equivalent page.

## SEO building blocks

See [QUALITY.md](QUALITY.md#seo) for the checklist. Implementation lives in:
- `generateMetadata` per page (title, description, canonical, alternates, Open Graph, Twitter).
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- JSON-LD: `Person` on home, `CreativeWork`/`SoftwareSourceCode` on project pages, helpers in `src/lib/seo.ts`.
- `NEXT_PUBLIC_SITE_URL` env var as the single source of the canonical origin (currently the Vercel domain).
