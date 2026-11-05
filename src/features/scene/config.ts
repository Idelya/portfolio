// Scene composition data: which objects exist, where they lead and where they sit per layout.
// Positions live here, not in CSS, so layouts can be tuned (and tested) in one place.

export type SceneLayout = "landscape" | "portrait";

export type SceneObjectId =
  "signpost" | "skillTree" | "cat" | "chest" | "mailbox";

// Nav sections an object can lead to (keys of `nav.links` in the messages).
export type SceneSection =
  "about" | "projects" | "experience" | "skills" | "contact";

interface Placement {
  /** Horizontal center, % of the hub width. */
  x: number;
  /** Bottom edge of the object (label included), % of the hub height from the bottom. */
  y: number;
  /**
   * Art width is min(`width` % of the hub width, `widthByHeight` % of the hub height). Capping by
   * both keeps horizontal gaps (in % of width) and vertical gaps (in % of height) valid at every
   * aspect ratio within a layout.
   */
  width: number;
  widthByHeight: number;
}

export interface SceneObjectConfig {
  id: SceneObjectId;
  section: SceneSection;
  /** Art height / width; matches the viewBox of the object's SVG. */
  aspect: number;
  placement: Record<SceneLayout, Placement>;
}

/**
 * DOM order is the keyboard order: left to right in the landscape layout (GAME_DESIGN.md).
 * Levels: skill tree high; signpost, cat, mailbox middle; chest low (foreground).
 * Landscape: all objects are separated horizontally. Portrait: signpost left, mailbox right, and
 * tree, cat and chest stacked in the middle column.
 */
export const SCENE_OBJECTS: readonly SceneObjectConfig[] = [
  {
    id: "signpost",
    section: "experience",
    aspect: 1.4,
    placement: {
      landscape: { x: 14, y: 30, width: 9, widthByHeight: 15.5 },
      portrait: { x: 19, y: 30, width: 24, widthByHeight: 20 },
    },
  },
  {
    id: "skillTree",
    section: "skills",
    aspect: 1.1,
    placement: {
      landscape: { x: 33, y: 42, width: 16, widthByHeight: 27.5 },
      portrait: { x: 50, y: 58, width: 36, widthByHeight: 20 },
    },
  },
  {
    id: "cat",
    section: "about",
    aspect: 1,
    placement: {
      landscape: { x: 50, y: 26, width: 9, widthByHeight: 15.5 },
      portrait: { x: 52, y: 32, width: 24, widthByHeight: 16 },
    },
  },
  {
    id: "chest",
    section: "projects",
    aspect: 0.75,
    placement: {
      landscape: { x: 64, y: 6, width: 10, widthByHeight: 17 },
      portrait: { x: 50, y: 4, width: 30, widthByHeight: 16 },
    },
  },
  {
    id: "mailbox",
    section: "contact",
    aspect: 1.5,
    placement: {
      landscape: { x: 84, y: 20, width: 8, widthByHeight: 14.5 },
      portrait: { x: 81, y: 24, width: 24, widthByHeight: 16 },
    },
  },
];

/** Height of an object label in px (text-sm line + vertical padding + gap), used by layout checks. */
export const LABEL_HEIGHT_PX = 32;
