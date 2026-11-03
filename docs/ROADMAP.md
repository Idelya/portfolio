# Roadmap

Work in phases; finish and verify a phase before the next one. Tick items as they are completed.
Each item should be a small, reviewable change (one branch / PR).

## Phase 0 — Foundations for AI-assisted work (in progress)
- [x] `CLAUDE.md` with rules and docs map
- [x] Docs: project, architecture, conventions, quality, game design, content, decisions, roadmap
- [ ] Owner reviews docs and answers open questions (DECISIONS.md "Pending", GAME_DESIGN.md, CONTENT.md)
- [ ] Shared Claude Code settings in `.claude/settings.json` (allowed commands); keep `.claude/settings.local.json` git-ignored
- [x] Replace boilerplate `README.md`

## Phase 1 — Stack upgrade and tooling
- [x] Upgrade to Next 16, React 19, TypeScript (latest supported by Next), ESLint (flat config).
      `next lint` is removed in Next 16: change the `lint` script to `eslint . --max-warnings 0` and update CLAUDE.md
- [ ] Migrate Tailwind 3 → 4 (CSS-first config, `@tailwindcss/postcss`)
- [ ] Remove scaffold leftovers (`public/next.svg`, `public/vercel.svg`, placeholder header)
- [ ] Add Prettier (+ Tailwind class sorting plugin)
- [ ] Add scripts: `typecheck`, `format`, `test`, `test:e2e`; update CLAUDE.md commands
- [ ] Vitest + Testing Library setup
- [ ] Playwright setup with mobile/desktop projects and axe
- [ ] GitHub Actions CI: lint, typecheck, unit, build, e2e
- [ ] Secret protection: GitHub secret scanning + push protection, gitleaks in pre-commit hook and CI, `.env.example`
- [ ] Connect Vercel; preview deploys `noindex`; set `NEXT_PUBLIC_SITE_URL`
- [ ] Pin Node version (`.nvmrc` + `engines`)

## Phase 2 — Skeleton: i18n, layout, SEO base
- [ ] next-intl with `en`/`pl`, locale routing (`src/proxy.ts` redirect for `/`), language switcher
- [ ] Design tokens (fairy-tale palette, typography, spacing) + fonts via `next/font`
- [ ] Root layout: persistent nav menu (mobile menu button), footer, skip link
- [ ] Metadata helpers, `sitemap.ts`, `robots.ts`, OG image, JSON-LD `Person`
- [ ] Folder structure per ARCHITECTURE.md: `features/`, route groups `(scene)` and `(pages)`, ESLint import-boundary rule
- [ ] Content types + `@next/mdx` + validation test (all locales filled, MDX files present, unique slugs)
- [ ] 404 page

## Phase 3 — Scene prototype (placeholder art)
- [ ] Owner answers GAME_DESIGN.md open questions (object → section mapping first)
- [ ] Spike: scroll technology (CSS scroll-driven vs Motion vs GSAP) on a real mid-range phone + iOS Safari; record decision
- [ ] Static scene (server-rendered): `p = 0` opening frame + hub below, placeholder SVG layers, objects as links, reduced-motion / no-JS version
- [ ] Scroll sequence: descent + parallax layers
- [ ] Cat placeholder animation: idle on branch → jump → land → idle (scrubbed by scroll)
- [ ] Interactive objects: idle glow/motion, hover/focus state, click reaction + navigation
- [ ] Aspect-ratio layouts (tall portrait, portrait, landscape, ultra-wide) with rearranged objects; start this early, it is the hardest part
- [ ] Viewport-matrix screenshot tests + "all objects in viewport, no overlap" check
- [ ] One easter egg end-to-end

## Phase 4 — Content subpages (MVP, shippable)
- [ ] About
- [ ] Projects list + project detail pages
- [ ] Experience
- [ ] Skills
- [ ] Contact page with form (Server Action, email service, validation, spam protection)
- [ ] CV download
- [ ] Shared themed page header + "back to the scene"
- [ ] Real content from owner (see CONTENT.md)
- [ ] Lighthouse ≥ 95 on mobile, axe clean, cross-browser + device check
- [ ] **Launch v1** on Vercel (placeholder art acceptable only if it looks intentional)

## Phase 5 — Final art and polish
- [ ] Final illustrations and cat animation replace placeholders (see GAME_DESIGN.md asset spec)
- [ ] Page transitions between scene and subpages
- [ ] Remaining easter eggs, ambient animations, optional sound
- [ ] Cat mascot on subpages
- [ ] Performance tuning of art assets on mobile

## Later

Postponed items and ideas live in [BACKLOG.md](BACKLOG.md).
