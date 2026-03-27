import type { NextConfig } from "next";

const repoName = "hollow-room";
const useSubpathDeployment = process.env.SITE_BASE_PATH === repoName;

const nextConfig: NextConfig = {
  output: "export",
  basePath: useSubpathDeployment ? `/${repoName}` : "",
  assetPrefix: useSubpathDeployment ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
