import type { NextConfig } from "next";

const judgeApiUrl = process.env.JUDGE_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${judgeApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
