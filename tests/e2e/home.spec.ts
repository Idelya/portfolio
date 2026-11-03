import { expect, test } from "./fixtures";

test.describe("home page", () => {
  test("renders the main landmark", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("main")).toBeAttached();
  });

  test("has no WCAG A/AA violations", async ({ page, makeAxeBuilder }) => {
    await page.goto("/");

    const results = await makeAxeBuilder().analyze();

    expect(results.violations).toEqual([]);
  });
});
