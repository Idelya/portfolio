import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";

// WCAG 2.2 AA is the target (QUALITY.md); axe tags are cumulative per version and level.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

interface Fixtures {
  makeAxeBuilder: () => AxeBuilder;
}

export const test = base.extend<Fixtures>({
  // Not named `use`: react-hooks/rules-of-hooks would mistake it for React's `use()`.
  makeAxeBuilder: async ({ page }, provide) => {
    await provide(() => new AxeBuilder({ page }).withTags(WCAG_TAGS));
  },
});

export { expect } from "@playwright/test";
