import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "expense-flow-app";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  images: {
    unoptimized: isGithubPages,
  },
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
};

export default nextConfig;
