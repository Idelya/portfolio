# Scene design

> Status: **concept agreed, details open** (2026-11-02). Final illustrations do not exist yet;
> build with placeholder art (see [Placeholder art](#placeholder-art)). Items marked **(proposal)**
> are agent suggestions awaiting the owner's confirmation.

## Concept

The home page is an illustrated, **scroll-driven scene**: a fairy-tale, magical, hand-drawn 2D world.
The visitor does not control a character. Scrolling moves the "camera" down from the sky to the
ground, and a cat jumps down from a tree along the way. At the bottom, the visitor explores by
**clicking objects in the world**. Most objects lead to static content subpages (the portfolio
information); some are just playful easter eggs.

The game feeling comes from discovery, motion and reactive objects, not from controls.

## Art direction

- 2D, cartoon / illustrated, fairy-tale, magical.
- Soft, painterly sky and mountains; a warm, inviting palette; subtle magical details
  (sparkles, fireflies, glow) to signal interactivity.
- The **cat** is the mascot and guide. It appears on every subpage too (e.g. small idle animation in the header or footer) **(proposal)**.
- Subpages use the same visual language (palette, typography, decorative edges) but put readability first.

## The scroll sequence (home page)

The scene is a sticky, full-viewport stage. Scroll progress `p` (0 → 1) over roughly **3 viewport
heights (proposal)** drives all animation. After `p = 1` the page stops scrolling: the ground hub is the end.

| Progress | Camera / background | Cat | Foreground | UI |
|---|---|---|---|---|
| **0** (landing) | Sky and mountain range, camera high up | Sits on a tree branch in the foreground, idle animation (tail swish, blink) | Tree | Site title ("Anna Papros-Matejuk — Portfolio") and a pulsing **down arrow** |
| **0 → 0.6** | Camera descends smoothly. Parallax: far mountains move slowest, nearer layers faster, giving a real perspective change | Jumps from the tree (anticipation → leap → fall) | Tree slides up and out; ground layers rise into view | Title and arrow fade out |
| **0.6 → 1** | Settles on the ground level | Lands (squash, small dust puff), then idles on the ground | Interactive objects appear; they **glow or move** to signal they are clickable | Navigation stays available |
| **1** (hub) | Static ground scene, ambient animation only | Idle; may look towards the hovered object **(proposal)** | All objects interactive | |

Rules:
- Animation is **scrubbed by scroll** (scrolling back up reverses it), never on a timer, so the visitor is in control.
- The cat's jump plays as a scroll-scrubbed animation; the landing may finish with a short time-based settle.
- The down arrow scrolls to the hub when clicked.
- Revisiting the home page from a subpage via "back" restores the hub position, not the top **(proposal)**.

## Interactive objects (ground hub)

Each object is a real link or button in the DOM (not a canvas hit area), with an accessible label.

| Object | Leads to | Type |
|---|---|---|
| **Mailbox** | `/[locale]/contact`: contact page with a form to send an email | Content |
| TBD | About me | Content |
| TBD | Projects (list → project detail pages) | Content |
| TBD | Experience | Content |
| TBD | Skills | Content |
| TBD | CV download | Content |
| TBD | e.g. a firefly swarm, a sleeping owl, a magic flower | Easter egg |

Interactivity signals:
- **Idle:** a gentle glow pulse or small looped motion, staggered so not everything pulses at once.
- **Hover / focus:** stronger glow, slight scale-up, cursor pointer, tooltip-like label with the section name.
- **Touch devices:** there is no hover, so labels are shown permanently or after first tap **(proposal: always visible small labels on mobile)**.
- **Click / tap:** short reaction animation (≤ 300 ms), then navigation with a page transition.

Easter eggs play an animation or sound in place and do not navigate.

## Subpages

- Static, content-first pages (About, Projects, Project detail, Experience, Skills, Contact).
- Server-rendered, fast, readable, fully indexable. This is where the SEO content lives.
- Themed header/background in the scene style, plain readable body.
- Clear way back to the scene (back to hub) plus the global navigation.

## Navigation for recruiters

- A **persistent navigation menu** is visible on the scene and all subpages: About, Projects,
  Experience, Contact, CV, language switch. On mobile it collapses into a menu button.
- The menu works without scrolling through the animation. Recruiters never have to play.

## Accessibility and fallbacks

- **Reduced motion** (`prefers-reduced-motion: reduce`): no scroll-scrubbed animation. Show a static
  composition (proposal: the ground hub with the cat already landed, title visible) where all objects are immediately available.
- **Keyboard:** objects are focusable in a logical order (left → right); visible focus ring styled to the scene.
- **Screen readers:** decorative layers are `aria-hidden`; each object has a descriptive label
  ("Mailbox — contact me"). The page has one `<h1>` (the title).
- **No JS:** the hub renders as static layered images with working links.

## Responsive composition

**Goal: the same experience at every resolution.** A phone in portrait, a laptop and an ultra-wide
monitor must all show the full sequence (sky → descent → cat lands → hub with every object visible
and reachable) with the same feel. No horizontal panning, nothing cut off. This is one of the hardest
parts of the project: plan for it from the first prototype, do not bolt it on later.

Approach:
- **Aspect-ratio layouts, not just width breakpoints.** Define compositions per aspect-ratio class,
  e.g. tall portrait (≤ 9:16), portrait (≈ 3:4), landscape (≈ 16:10 / 16:9) and ultra-wide (≥ 21:9).
  Pick the layout from `aspect-ratio` media queries (and `min-height` for very short landscape phones).
- **Objects are rearranged per layout.** Each layout has its own object positions, sizes and order
  (e.g. landscape: one row along the ground; portrait: two or three tiers on the hillside). All of it
  lives in data in `src/features/scene/config.ts`, not scattered across CSS.
- **Normalized scene coordinates.** Positions use a coordinate space relative to the stage
  (percentages or a fixed design grid scaled to the viewport), so art and objects scale together.
- **Layers anchor and crop, never stretch.** Sky anchors top, ground anchors bottom; layers have bleed
  for wide/tall screens. Use `svh`/`dvh` units so mobile browser toolbars do not break the stage height.
- **Scroll distance and parallax depth may differ per layout** so the descent feels the same on a tall phone and a wide monitor.
- **Tap targets ≥ 44×44 px** regardless of artwork size; labels never overlap each other or the cat.
- **Verification:** Playwright screenshot tests of the hub at a fixed viewport matrix
  (360×740, 390×844, 768×1024, 1024×768, 1280×800, 1920×1080, 2560×1080, 740×360 landscape phone),
  plus an automated check that every object is inside the viewport and objects do not overlap.

## Placeholder art

Until final illustrations exist, build with simple SVG shapes in the final palette: gradient sky,
layered mountain silhouettes, a tree shape, a cat silhouette, simple object shapes. Placeholder layers
use the same dimensions, anchors and file names as the final art, so swapping assets requires no code changes.

## Asset specification (for whoever draws the final art)

- Separate layers per depth: sky, far mountains, mid mountains, near hills, tree, ground, each object, cat.
- Vector (SVG) where the style allows; otherwise PNG/WebP at 2× the largest display size, transparent background.
- Each layer wider/taller than the viewport, with bleed for parallax movement and portrait cropping.
- Cat animation delivered as a rigged animation (Rive or Lottie) or a sprite sheet: idle-on-branch, jump, fall, land, idle-on-ground.
- Interactive objects: base state plus glow/highlight state (or glow done in code).

## Technology (open decision)

The scene is DOM/SVG based (no WebGL needed). To be decided with a spike:

| Concern | Candidates |
|---|---|
| Scroll-driven parallax | CSS scroll-driven animations (`animation-timeline`, no JS, check Safari support) · Motion (`useScroll`/`useTransform`) · GSAP ScrollTrigger |
| Cat animation | Rive (state machines, scrubbable, small files) · Lottie · CSS sprite sheet |
| Page transitions | View Transitions API (Next.js support) · Motion |

Record the choice in [DECISIONS.md](DECISIONS.md).

## Open questions (owner to answer)

1. Which objects stand for About, Projects, Experience, Skills, CV? Any ideas for easter eggs?
2. Is the cat a specific cat (your own? a name?) or a generic mascot? Does it show speech-bubble hints?
   (A chatting AI cat is in the [backlog](BACKLOG.md), not v1.)
3. Sound: ambient music / effects? If yes, muted by default with a toggle.
4. Exact title text and whether a subtitle (job title) sits under it on the first screen.

Resolved: phone composition → objects are rearranged per layout (see [Responsive composition](#responsive-composition)).
Time-of-day variants → [backlog](BACKLOG.md).
