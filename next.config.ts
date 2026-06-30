import type { NextConfig } from "next";
import packageJson from "./package.json";

const { version } = packageJson as { version: string };
const repoName = "hollow-room";
const useSubpathDeployment = process.env.SITE_BASE_PATH === repoName;

const nextConfig: NextConfig = {
  output: "export",
  // Use directory-style URLs (/path/ → path/index.html). Keeps GitHub Pages and
  // Vercel in agreement so the embedded Unity build's relative asset paths
  // resolve identically on both (Vercel otherwise 404s /ns_web_build/index.html
  // and redirects the dir away, breaking the build's relative Build/ refs).
  trailingSlash: true,
  basePath: useSubpathDeployment ? `/${repoName}` : "",
  assetPrefix: useSubpathDeployment ? `/${repoName}` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: useSubpathDeployment ? `/${repoName}` : "",
    NEXT_PUBLIC_APP_VERSION: version ?? "0.0.0",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
