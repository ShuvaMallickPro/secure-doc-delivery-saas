import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";

export function buildShareUrl(token: string) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${appUrl}/view/${token}`;
}

export function getShareStatus(
  share: ShareLinkModel,
): "active" | "revoked" | "expired" {
  if (share.revokedAt) return "revoked";
  if (share.expiresAt && share.expiresAt < new Date()) return "expired";
  return "active";
}

export function getDocumentShareSummary(shares: ShareLinkModel[]) {
  if (shares.length === 0) {
    return { label: "No shares", variant: "secondary" as const };
  }

  let active = 0;
  let revoked = 0;
  let expired = 0;

  for (const share of shares) {
    const status = getShareStatus(share);
    if (status === "active") active++;
    else if (status === "revoked") revoked++;
    else expired++;
  }

  if (active === 0 && revoked > 0 && expired === 0) {
    return { label: "All revoked", variant: "destructive" as const };
  }

  if (active === shares.length) {
    return {
      label: `${active} active link${active === 1 ? "" : "s"}`,
      variant: "default" as const,
    };
  }

  const parts: string[] = [];
  if (active > 0) parts.push(`${active} active`);
  if (revoked > 0) parts.push(`${revoked} revoked`);
  if (expired > 0) parts.push(`${expired} expired`);

  return { label: parts.join(" · "), variant: "outline" as const };
}
