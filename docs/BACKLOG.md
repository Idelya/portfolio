# Backlog

Ideas and postponed work that are **not** part of the current [ROADMAP.md](ROADMAP.md). This repo has
no external issue tracker; this file is the tracker. Agents: do not start backlog items unless the owner
asks. When an item is scheduled, move it into a roadmap phase.

Priority: **P1** next after v1 · **P2** nice to have · **P3** someday

| Item                           | Priority | Notes                                                                                                                                                                                                           |
| ------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Talking AI cat**             | P2       | Visitors can chat with the cat mascot, backed by an LLM. Needs: API route, system prompt grounded in `src/content/` (no invented facts), rate limiting and cost cap, abuse handling, EN/PL, accessible chat UI. |
| **Time-of-day scene variants** | P3       | Night/dusk sky depending on the visitor's local time, as an easter egg. Requires a second set of illustrations; layers must keep the same names/anchors so variants are drop-in.                                |
| Seasonal variants              | P3       | Same mechanism as time of day (snow, autumn leaves).                                                                                                                                                            |
| Custom domain                  | P1       | Change `NEXT_PUBLIC_SITE_URL`, redirect from the Vercel domain.                                                                                                                                                 |
| Privacy-friendly analytics     | P2       | Vercel Analytics or Plausible; no cookie banner needed if cookieless.                                                                                                                                           |
| Blog / case studies            | P3       | MDX-based, linked from a scene object.                                                                                                                                                                          |
