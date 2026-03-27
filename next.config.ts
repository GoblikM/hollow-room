import type { NextConfig } from "next";

const repoName = "hollow-room";
const useSubpathDeployment = process.env.SITE_BASE_PATH === repoName;

const nextConfig: NextConfig = {
  output: "export",
  basePath: useSubpathDeployment ? `/${repoName}` : "",
  assetPrefix: useSubpathDeployment ? `/${repoName}` : "",
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version ?? "0.0.0",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
