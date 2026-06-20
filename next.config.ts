import type { NextConfig } from "next";

const clerkDomain = "https://*.clerk.accounts.dev https://*.clerk.com";
const awsDomain = "https://*.amazonaws.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
  `connect-src 'self' ${clerkDomain} ${awsDomain} https://challenges.cloudflare.com`,
  `img-src 'self' data: blob: ${clerkDomain} ${awsDomain}`,
  "style-src 'self' 'unsafe-inline'",
  `frame-src 'self' ${clerkDomain} https://challenges.cloudflare.com`,
  "font-src 'self' data:",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
