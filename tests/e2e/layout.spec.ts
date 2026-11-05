import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const SECTIONS = ["About", "Projects", "Experience", "Skills", "Contact"];

// Below Tailwind's lg breakpoint the section links sit in a popover behind the menu button.
function isCompact(page: Page) {
  return (page.viewportSize()?.width ?? 0) < 1024;
}

test.describe("skip link", () => {
  test("is the first focusable element and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/en");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });
});

test.describe("navigation menu", () => {
  test("links to every section", async ({ page }) => {
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main" });

    if (isCompact(page)) {
      await expect(nav.getByRole("link", { name: "About" })).toBeHidden();
      await nav.getByRole("button", { name: "Menu" }).click();
    } else {
      await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
    }

    for (const name of SECTIONS) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/en/about",
    );
  });

  test("links back to the scene from the site name", async ({ page }) => {
    await page.goto("/pl");

    await expect(
      page.getByRole("link", { name: "Anna Papros-Matejuk" }),
    ).toHaveAttribute("href", "/pl");
  });

  test("mobile menu closes with Escape", async ({ page }) => {
    test.skip(!isCompact(page), "the menu button exists only below lg");
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main" });

    await nav.getByRole("button", { name: "Menu" }).click();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Contact" })).toBeHidden();
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("mobile menu still opens", async ({ page }) => {
      test.skip(!isCompact(page), "the menu button exists only below lg");
      await page.goto("/en");
      const nav = page.getByRole("navigation", { name: "Main" });

      await nav.getByRole("button", { name: "Menu" }).click();

      await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
    });
  });
});
