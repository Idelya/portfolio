# Architecture

> Status: **target architecture**. As of 2026-11-02 the repo is a bare Next.js 13.4 scaffold.
> Phase 1 of [ROADMAP.md](ROADMAP.md) upgrades the stack and creates this structure.
> Update this doc whenever the real structure diverges.

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Static generation by default. |
| UI | **React 19** | Server Components by default, `"use client"` only where needed. |
| Language | **TypeScript 6.0**, `strict: true` | No `any` without a comment explaining why. Capped below 6.1 by `typescript-eslint`, see [DECISIONS.md](DECISIONS.md). |
| Styling | **Tailwind CSS 4** | Design tokens in CSS (`@theme`), no inline style objects for static styling. |
| i18n | **next-intl** | PL + EN, locale-prefixed routes. |
| Scene animation | **TBD** (see [GAME_DESIGN.md](GAME_DESIGN.md#technology-open-decision)) | DOM/SVG layers. Scroll: CSS scroll-driven animations, Motion or GSAP. Cat: Rive, Lottie or sprite sheet. |
| Contact form | Server Action + email service (**TBD**, e.g. Resend) | Validation with a schema library (e.g. Zod), spam protection (honeypot + rate limit). |
| Unit tests | **Vitest** + Testing Library | Logic, hooks, content validation. |
| E2E tests | **Playwright** | Multiple viewports and browsers, see [QUALITY.md](QUALITY.md). |
| Lint / format | **ESLint 9** flat config (`eslint.config.mjs`, `eslint-config-next`) + Prettier | Run directly with `eslint`; `next lint` no longer exists. |
| Hosting | **Vercel** | Preview deploy per PR, production from `master`. |
| Runtime | Node.js 20 LTS or newer | |

Exact versions live in `package.json`. Do not add a dependency without a reason; prefer the platform
and existing libraries. Record notable additions in [DECISIONS.md](DECISIONS.md).

## Rendering strategy

```
  /                    proxy.ts (next-intl): redirect to /en or /pl by Accept-Language

  /[locale]            Home scene (SSG)
  ├─ server-rendered:  opening frame (sky, mountains, tree, cat on branch, <h1> title, down arrow),
  │                    nav menu, and below it the hub with objects as real <a> links
  └─ client island:    scroll-driven parallax + cat animation + object hover/glow effects
                       (idle until the first scroll; without JS the static page with working links remains)

  /[locale]/about, /projects, /projects/[slug], /experience, /skills, /contact   (SSG)
  └─ plain content pages: indexed by search engines, minimal client JS

  /[locale]/contact    form → Server Action → email service
```

- All pages are statically generated (`generateStaticParams` for locales). Request-time code is limited to
  `src/proxy.ts` (next-intl locale redirect, matcher excludes `_next`, API and static files) and the contact
  form's Server Action. See [DECISIONS.md](DECISIONS.md).
- **The server renders the opening frame (`p = 0`)**, exactly what the client shows on hydration, so nothing
  jumps when JS loads. The opening frame is the LCP.
- **The hub is also in the server HTML**, below the first screen in normal document flow; the down arrow is
  an `<a href="#hub">`. No-JS visitors, reduced-motion visitors and crawlers get the full content and every
  link by scrolling or following the arrow.
- **The client island waits for the visitor.** After hydration nothing moves until the first scroll (or
  arrow click / keyboard scroll). Only then does the scroll-driven stage take over the part below the first
  screen, so the switch never shifts anything visible (no CLS).
- Animation libraries and the cat animation runtime load only on the home page, never on subpages. They
  start loading after the LCP (on idle), at the latest on the first scroll, and never delay the first paint.
- Images in the scene: SVG inline or `next/image` with explicit dimensions, so there is no layout shift.
- The first screen (sky, mountains, tree, cat, title) is the LCP: keep those layers small and preloaded;
  lower layers and objects can load lazily.

## Directory structure (target)

Code is organized **by feature**. `app/` only does routing; pages are thin and compose feature components.

```
src/
  proxy.ts                  # next-intl locale redirect for "/" (Next 16 name for middleware)
  app/
    [locale]/
      layout.tsx            # root for a locale: <html lang>, fonts, i18n provider, NavMenu, SkipLink
      not-found.tsx
      (scene)/              # route group: home scene layout (full-screen, no footer)
        page.tsx            # → features/scene
      (pages)/              # route group: content subpages layout
        layout.tsx          # themed header, "back to the scene", footer
        about/page.tsx
        projects/page.tsx
        projects/[slug]/page.tsx
        experience/page.tsx
        skills/page.tsx
        contact/page.tsx
    sitemap.ts              # sitemap with hreflang alternates
    robots.ts
    opengraph-image.tsx     # generated OG images
    globals.css             # Tailwind import + design tokens (@theme)
  features/
    scene/                  # home scene; imported only by app/[locale]/(scene)/page.tsx
      Scene.tsx             # server component: opening frame + hub below (static, linkable)
      SceneAnimator.tsx     # client island: scroll progress → layer transforms
      layers/               # Sky, Mountains, Tree, Ground… (inline SVG components)
      cat/                  # cat animation wrapper
      objects/              # interactive objects (Mailbox…) and easter eggs
      config.ts             # layer depths, aspect-ratio layouts, object positions, scroll keyframes
      *.test.ts             # pure logic tests (keyframe math, layout selection)
    projects/               # ProjectCard, ProjectList, ProjectDetail, getProjects.ts
    experience/
    skills/
    about/
    contact/
      ContactForm.tsx       # client component
      action.ts             # Server Action ("use server"): validate, send email
      schema.ts             # shared validation schema (client + server)
  components/
    ui/                     # generic primitives with no business logic (Button, Link, Card, Icon)
    layout/                 # NavMenu, PageHeader, Footer, LanguageSwitcher, SkipLink
  content/
    types.ts                # Project, Experience, Skill, Profile, Localized…
    profile.ts
    projects.ts             # structured project data
    projects/               # long project descriptions
      <slug>.en.mdx
      <slug>.pl.mdx
    experience.ts
    skills.ts
  i18n/
    routing.ts              # locales, default locale
    request.ts
  messages/
    en.json                 # UI strings (buttons, labels, aria-labels, scene object labels)
    pl.json
  lib/                      # framework-agnostic helpers (seo.ts, formatDate.ts, env.ts)
public/
  scene/                    # raster scene art (same file names for placeholder and final art)
  images/                   # project screenshots, photo
  cv/                       # approved CV PDFs per locale
tests/
  e2e/                      # Playwright specs (incl. scene viewport matrix)
```

### Module boundaries

| Module | May import from | Must not import from |
|---|---|---|
| `app/` | `features/`, `components/`, `content/`, `lib/`, `i18n/` | — |
| `features/<x>/` | `components/`, `content/`, `lib/`, `i18n/` | other `features/` (share via `components/` or `lib/` instead) |
| `components/` | `lib/`, `i18n/` | `features/`, `content/` (receive data via props) |
| `content/` | `content/types.ts` only | anything with React or Next.js |
| `lib/` | nothing app-specific | `features/`, `components/` |

Rules:
- `features/scene/**` is imported only by `app/[locale]/(scene)/page.tsx`. Animation libraries live only there,
  so subpages never ship scene code.
- No barrel files (`index.ts` re-exports); import from the file directly. Keeps tree-shaking and client/server boundaries obvious.
- A component starts in its feature. Move it to `components/ui` only when a second feature needs it and it has no business logic.
- Unit tests sit next to the code (`*.test.ts(x)`); end-to-end tests in `tests/e2e/`.
- Scene art that must be animated or styled in parts (glow, sway) is an inline SVG component in
  `features/scene/layers` or `objects`; large raster art goes to `public/scene/` via `next/image`.

## Content layer

Two kinds of text:

1. **UI strings** (labels, buttons, aria-labels, scene object labels): `src/messages/{en,pl}.json`, accessed via next-intl.
2. **Portfolio content**:
   - **Structured data** (projects list, experience, skills, profile): TypeScript in `src/content/*.ts`, with localized fields.
   - **Long-form text** (project case-study bodies, long bio): MDX, one file per locale
     (`src/content/projects/<slug>.en.mdx`, `<slug>.pl.mdx`), rendered with `@next/mdx` at build time.

```ts
type Localized<T = string> = { en: T; pl: T };

interface Project {
  slug: string;              // URL-safe, stable, English; also the MDX file name
  title: Localized;
  summary: Localized;        // 1–2 sentences, used in cards and meta descriptions
  hasBody: boolean;          // true → <slug>.en.mdx and <slug>.pl.mdx must exist
  stack: string[];
  links: { live?: string; repo?: string };
  image?: { src: string; alt: Localized };
  featured: boolean;
  period: { from: string; to?: string }; // ISO yyyy-mm
}
```

Missing translations must fail the build, never silently fall back: the `Localized` type enforces
both locales in TS data, and a content test checks that every project with `hasBody` has both MDX files
and that slugs are unique.

## i18n

- Locales: `en`, `pl`. Default locale: `en` (confirmed by the owner, see [DECISIONS.md](DECISIONS.md)).
- Routes are always prefixed: `/en/...`, `/pl/...`. `/` redirects based on `Accept-Language`, falling back to `en` (done in `src/proxy.ts`).
- Every page sets `<html lang>`, canonical URL and `hreflang` alternates (`en`, `pl`, `x-default` → `en`).
- Slugs are shared between locales (simpler, fine for a portfolio).
- The language switcher keeps the user on the equivalent page.

## SEO building blocks

See [QUALITY.md](QUALITY.md#seo) for the checklist. Implementation lives in:
- `generateMetadata` per page (title, description, canonical, alternates, Open Graph, Twitter).
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- JSON-LD: `Person` on home, `CreativeWork`/`SoftwareSourceCode` on project pages, helpers in `src/lib/seo.ts`.
- `NEXT_PUBLIC_SITE_URL` env var as the single source of the canonical origin (currently the Vercel domain).
