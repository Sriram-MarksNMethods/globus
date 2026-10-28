import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // 90 is used for full-screen photos (sharper on big screens); everything else stays at the default 75.
  images: { qualities: [75, 90] },
  // Old globusdevelopers.com addresses → their pages on this site, so links and Google results keep working.
  async redirects() {
    return [
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/blog/:slug", destination: "/news/:slug", permanent: true },
      { source: "/project/Neo", destination: "/projects/neo", permanent: true },
      { source: "/project/Altus", destination: "/projects/altus", permanent: true },
      { source: "/project/Treasor", destination: "/projects/treasor", permanent: true },
      { source: "/project/Floresta", destination: "/projects/floresta", permanent: true },
      { source: "/project/Tukkuguda", destination: "/projects/tukkuguda", permanent: true },
      { source: "/project/Westlyn", destination: "/projects/westlyn", permanent: true },
      { source: "/board-of-directors", destination: "/about", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
