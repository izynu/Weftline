import type { NextConfig } from "next";

// BUILD_STATIC=1 switches the build to a GitHub Pages compatible static
// export: everything is prerendered at build time and the base path matches
// the repository name under izynu.github.io. The static build only ever runs
// on GitHub Actions (or a throwaway local test), never beside the dev server.
const staticExport = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export",
        basePath: "/weftline",
        trailingSlash: true,
      }
    : {
        output: "standalone",
      }),
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
