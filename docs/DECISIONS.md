# Decision log

Lightweight ADRs. Newest first. Add an entry whenever a choice is made that a future agent might
otherwise question or redo. Format: date, decision, why, consequences.

---

### 2026-11-02 — Default locale `en`, always-prefixed routes
- **Decision:** `/en/...` and `/pl/...`; `/` redirects by `Accept-Language`, fallback `en`; `x-default` → `en`.
- **Why:** English reaches the widest recruiter/client audience; explicit prefixes are simplest for hreflang and caching.
- **Status:** proposed by agent, confirm with owner.

### 2026-11-02 — Hosting on Vercel, no custom domain yet
- **Decision:** Deploy to Vercel (`*.vercel.app`). Canonical origin comes from `NEXT_PUBLIC_SITE_URL`.
- **Consequences:** When a domain is bought, change only the env var and set up a redirect from the Vercel domain.

### 2026-11-02 — Same scene experience at every resolution
- **Decision:** On different screen shapes the hub objects are rearranged (per aspect-ratio layout), not panned or cropped.
- **Why:** Every visitor should get the same effect regardless of device.
- **Consequences:** Layout data per aspect-ratio class in `src/scene/config.ts`; viewport-matrix screenshot tests. See [GAME_DESIGN.md](GAME_DESIGN.md#responsive-composition).

### 2026-11-02 — Backlog kept in the repo
- **Decision:** No external tracker; postponed ideas go to [BACKLOG.md](BACKLOG.md).

### 2026-11-02 — Contact via a form on a dedicated page
- **Decision:** The mailbox object leads to `/[locale]/contact` with a form that sends an email.
- **Consequences:** Needs a Server Action and an email service (choice pending), plus spam protection.

### 2026-11-02 — Home is a scroll-driven illustrated scene; content lives on subpages
- **Decision:** 2D fairy-tale scene (sky, mountains, cat jumping from a tree) animated by scroll with
  parallax. No player control; the visitor clicks objects that lead to static subpages or trigger easter eggs.
  A persistent nav menu is the recruiter's shortcut. Placeholder art until final illustrations exist.
- **Why:** Playful, memorable first impression that stays fast, indexable and accessible; simpler and
  lighter than a walkable world (no WebGL, no controls).
- **Supersedes:** the earlier "explorable world + separate Classic mode" idea from the same day.
- **Consequences:** No mode switcher. Scene code lives in `src/scene/` and loads only on the home page.
  Server-rendered markup is the final hub state. See [GAME_DESIGN.md](GAME_DESIGN.md).

### 2026-11-02 — Bilingual site: PL + EN
- **Decision:** Full content in Polish and English with next-intl.
- **Consequences:** Every string and content field needs both translations; build fails on missing ones.

### 2026-11-02 — Upgrade stack to latest before building
- **Decision:** Move from Next 13.4 / React 18 / Tailwind 3 to Next 16 / React 19 / Tailwind 4 (and current ESLint, TypeScript).
- **Why:** Almost no code exists yet, so migration cost is minimal; docs describe the target stack.

### 2026-11-02 — Docs in English, conversation in Polish
- **Decision:** Repo content (code, docs, commits) in English; the owner talks to agents in Polish.

---

## Pending decisions

- Scene animation technology: scroll library and cat animation format ([GAME_DESIGN.md](GAME_DESIGN.md#technology-open-decision)).
- Scene open questions ([GAME_DESIGN.md](GAME_DESIGN.md#open-questions-owner-to-answer)).
- Source of final illustrations (own, commissioned, generated/packs).
- Email service for the contact form (e.g. Resend) and destination address.
- Dark mode: system-following only, or with a manual toggle? (May instead be a night version of the scene.)
- Analytics: none, or privacy-friendly (Vercel Analytics / Plausible)? Affects cookie banner needs.
- Custom domain name.
