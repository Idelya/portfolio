import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import en from "./en.json";
import pl from "./pl.json";

const catalogues: Record<(typeof routing.locales)[number], unknown> = {
  en,
  pl,
};

// Flattens a message catalogue to "a.b.c" → value pairs.
function flatten(value: unknown, prefix = ""): Record<string, unknown> {
  if (typeof value !== "object" || value === null) return { [prefix]: value };
  return Object.entries(value).reduce<Record<string, unknown>>(
    (acc, [key, child]) => ({
      ...acc,
      ...flatten(child, prefix ? `${prefix}.${key}` : key),
    }),
    {},
  );
}

const reference = flatten(en);

describe.each(routing.locales)("%s messages", (locale) => {
  const messages = flatten(catalogues[locale]);

  it("has exactly the same keys as en.json", () => {
    expect(Object.keys(messages).sort()).toEqual(Object.keys(reference).sort());
  });

  it("has only non-empty strings", () => {
    for (const [key, value] of Object.entries(messages)) {
      expect(
        typeof value === "string" && value.trim() !== "",
        `${locale}: ${key}`,
      ).toBe(true);
    }
  });
});
