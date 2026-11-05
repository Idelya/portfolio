import { expect, test } from "./fixtures";

for (const locale of ["en", "pl"]) {
  test.describe(`home page (${locale})`, () => {
    test("renders the main landmark", async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.getByRole("main")).toBeAttached();
    });

    test("has no WCAG A/AA violations", async ({ page, makeAxeBuilder }) => {
      await page.goto(`/${locale}`);

      const results = await makeAxeBuilder().analyze();

      expect(results.violations).toEqual([]);
    });
  });
}
