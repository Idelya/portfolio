import { expect, test } from "./fixtures";

test.describe("locale redirect from /", () => {
  test.describe("English browser", () => {
    test.use({ locale: "en-US" });

    test("redirects to /en", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveURL("/en");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test.describe("Polish browser", () => {
    test.use({ locale: "pl-PL" });

    test("redirects to /pl", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveURL("/pl");
      await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    });
  });

  test.describe("unsupported browser language", () => {
    test.use({ locale: "de-DE" });

    test("falls back to /en", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveURL("/en");
    });
  });
});

test.describe("language switcher", () => {
  test("switches to Polish and back", async ({ page }) => {
    await page.goto("/en");
    const switcher = page.getByRole("navigation", { name: "Language" });
    await expect(
      switcher.getByRole("link", { name: "English" }),
    ).toHaveAttribute("aria-current", "page");

    await switcher.getByRole("link", { name: "Polski" }).click();

    await expect(page).toHaveURL("/pl");
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    const polishSwitcher = page.getByRole("navigation", { name: "Język" });
    await expect(
      polishSwitcher.getByRole("link", { name: "Polski" }),
    ).toHaveAttribute("aria-current", "page");

    await polishSwitcher.getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL("/en");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("still links to the other language", async ({ page }) => {
      await page.goto("/en");

      await page.getByRole("link", { name: "Polski" }).click();

      await expect(page).toHaveURL("/pl");
    });
  });
});
