import { expect, test } from "./fixtures";

const OBJECTS = [
  { name: "Signpost — Experience", href: "/en/experience" },
  { name: "Skill tree — Skills", href: "/en/skills" },
  { name: "Cat — About", href: "/en/about" },
  { name: "Treasure chest — Projects", href: "/en/projects" },
  { name: "Mailbox — Contact", href: "/en/contact" },
];

function sceneTests() {
  test("shows the title in the first screen", async ({ page }) => {
    await page.goto("/en");
    const title = page.getByRole("heading", { level: 1 });

    await expect(title).toHaveText(/Anna Papros-Matejuk/);
    await expect(title).toBeInViewport();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("down arrow leads to the hub, where every object is a visible link", async ({
    page,
  }) => {
    await page.goto("/en");

    await page.getByRole("link", { name: "Go down to the meadow" }).click();
    await expect(page).toHaveURL(/#hub$/);

    const hub = page.getByRole("region", { name: "Meadow" });
    for (const { name, href } of OBJECTS) {
      const link = hub.getByRole("link", { name });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toBeInViewport({ ratio: 1 });
    }
  });

  test("hub objects do not overlap", async ({ page }) => {
    await page.goto("/en#hub");
    // Measured in one call: with smooth scrolling the page may still move between measurements.
    const boxes = await page
      .getByRole("region", { name: "Meadow" })
      .getByRole("link")
      .evaluateAll((links) =>
        links.map((link) => {
          const { left, right, top, bottom } = link.getBoundingClientRect();
          return { name: link.textContent, left, right, top, bottom };
        }),
      );

    expect(boxes).toHaveLength(OBJECTS.length);
    for (const [i, a] of boxes.entries()) {
      for (const b of boxes.slice(i + 1)) {
        const overlap =
          a.left < b.right &&
          b.left < a.right &&
          a.top < b.bottom &&
          b.top < a.bottom;
        expect(overlap, `${a.name} overlaps ${b.name}`).toBe(false);
      }
    }
  });
}

test.describe("scene", sceneTests);

test.describe("scene without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  sceneTests();
});

test.describe("scene with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  sceneTests();
});
