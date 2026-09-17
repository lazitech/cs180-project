import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? '/cs180-project' : '';

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: isGitHubPages,
};

export default nextConfig;
