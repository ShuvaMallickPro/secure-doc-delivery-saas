import type { NextConfig } from "next";

/**
 * Clerk FAPI hosts clerk.browser.js — must appear in script-src.
 * @see https://clerk.com/docs/guides/secure/best-practices/csp-headers
 */
const clerkScriptSrc =
  "https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com";
const clerkConnectSrc =
  "https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://challenges.cloudflare.com";
const awsDomain = "https://*.amazonaws.com";

const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  // Clerk loads clerk.browser.js from your FAPI hostname (e.g. *.clerk.accounts.dev).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${clerkScriptSrc}`,
  `connect-src 'self' ${clerkConnectSrc} ${awsDomain}`,
  `img-src 'self' data: blob: https://img.clerk.com ${awsDomain}`,
  "style-src 'self' 'unsafe-inline'",
  `frame-src 'self' ${clerkScriptSrc}`,
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
