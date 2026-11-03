import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so a stray lockfile in a parent directory is never picked up.
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
