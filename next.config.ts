import type { NextConfig } from "next";
import packageJson from "./package.json";

const { version } = packageJson as { version: string };
const repoName = "hollow-room";
const useSubpathDeployment = process.env.SITE_BASE_PATH === repoName;

const nextConfig: NextConfig = {
  output: "export",
  basePath: useSubpathDeployment ? `/${repoName}` : "",
  assetPrefix: useSubpathDeployment ? `/${repoName}` : "",
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
