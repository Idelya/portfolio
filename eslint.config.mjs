import { readdirSync } from "node:fs";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// Module boundaries from docs/ARCHITECTURE.md#module-boundaries. Each file group gets exactly one
// no-restricted-imports config (later configs would replace, not merge, earlier ones). Imports
// across modules use the `@/` alias, so the patterns only need to match it. Regexes, because
// gitignore-style negation cannot re-allow a path under an excluded parent.
const restrict = (files, regex, message, ignores = []) => ({
  files,
  ignores,
  rules: {
    "no-restricted-imports": ["error", { patterns: [{ regex, message }] }],
  },
});

const features = readdirSync("src/features", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const boundaries = [
  restrict(
    ["src/components/**"],
    "^@/(features|content|app)(/|$)",
    "components/ must not import features/ or content/: receive data via props.",
  ),
  restrict(
    ["src/content/**"],
    "^(@/(?!content/types$)|(react|next|next-intl)(/|$))",
    "content/ is plain data: import only from @/content/types.",
  ),
  restrict(
    ["src/lib/**"],
    "^@/(?!lib/)",
    "lib/ holds framework-agnostic helpers with no app-specific imports.",
  ),
  ...features.map((feature) =>
    restrict(
      [`src/features/${feature}/**`],
      `^@/(app(/|$)|features/(?!${feature}/))`,
      "Features must not import each other: share via components/ or lib/.",
    ),
  ),
  restrict(
    ["src/app/**"],
    "^@/features/scene(/|$)",
    "features/scene is imported only by app/[locale]/(scene)/page.tsx, so subpages never ship scene code.",
    ["src/app/\\[locale\\]/\\(scene\\)/page.tsx"],
  ),
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...boundaries,
  // Last, so it switches off every stylistic rule that would conflict with Prettier.
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
