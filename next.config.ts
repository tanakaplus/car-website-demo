import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The pipeline runs in a browser worker. Keep Node-only native addons
  // out of both the server bundle and the client worker graph.
  serverExternalPackages: ["@xenova/transformers", "onnxruntime-node", "sharp"],
  turbopack: {
    root: path.resolve(process.cwd()),
    resolveAlias: {
      fs: { browser: "./src/lib/empty.ts" },
      path: { browser: "./src/lib/empty.ts" },
      url: { browser: "./src/lib/empty.ts" },
      sharp: { browser: "./src/lib/empty.ts" },
      "onnxruntime-node": { browser: "./src/lib/empty.ts" },
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
