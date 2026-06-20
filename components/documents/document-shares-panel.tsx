"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreShareLink, revokeShareLink } from "@/actions/documents";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShareStatus } from "@/lib/share-utils";
import { notifyError, notifySuccess } from "@/lib/toast";

function getClientShareUrl(token: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/view/${token}`;
}

function ShareStatusBadge({ share }: { share: ShareLinkModel }) {
  const status = getShareStatus(share);
  if (status === "active") {
    return (
      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
        Active
      </Badge>
    );
  }
  if (status === "revoked") {
    return <Badge variant="destructive">Revoked</Badge>;
  }
  return <Badge variant="secondary">Expired</Badge>;
}

export function DocumentSharesPanel({ shares }: { shares: ShareLinkModel[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleRevoke(shareId: string, recipientEmail: string) {
    setPendingId(shareId);
    try {
      await revokeShareLink(shareId);
      notifySuccess(
        "Access revoked",
        `The link for ${recipientEmail} no longer works.`,
      );
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      notifyError("Could not revoke link", error);
    } finally {
      setPendingId(null);
    }
  }

  async function handleRestore(shareId: string, recipientEmail: string) {
    setPendingId(shareId);
    try {
      await restoreShareLink(shareId);
      notifySuccess(
        "Access restored",
        `The link for ${recipientEmail} is active again.`,
      );
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      notifyError("Could not restore link", error);
    } finally {
      setPendingId(null);
    }
  }

  async function handleCopy(token: string) {
    try {
      await navigator.clipboard.writeText(getClientShareUrl(token));
      notifySuccess("Link copied", "The share link is on your clipboard.");
    } catch {
      notifyError(
        "Copy failed",
        "Could not copy the link. Please copy it manually.",
      );
    }
  }

  if (shares.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No share links yet. Use Share to create one.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
              Recipient
            </th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
              Created
            </th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-2 text-right font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {shares.map((share) => {
            const status = getShareStatus(share);
            const isPending = pendingId === share.id;
            return (
              <tr key={share.id}>
                <td className="px-4 py-3 font-medium">
                  {share.recipientEmail}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(share.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <ShareStatusBadge share={share} />
                </td>
                <td className="space-x-1 px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleCopy(share.token)}
                  >
                    Copy
                  </Button>
                  {status === "active" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive"
                      disabled={isPending}
                      onClick={() =>
                        handleRevoke(share.id, share.recipientEmail)
                      }
                    >
                      Revoke
                    </Button>
                  ) : status === "revoked" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      disabled={isPending}
                      onClick={() =>
                        handleRestore(share.id, share.recipientEmail)
                      }
                    >
                      Restore
                    </Button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
