"use client";

import { useState } from "react";
import {
  createDocument,
  createShareLink,
  revokeShareLink,
} from "@/actions/documents";
import type { DocumentModel } from "@/generated/prisma/models/Document";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DocumentWithShares = DocumentModel & { shares: ShareLinkModel[] };

export function DocumentList({
  documents,
}: {
  documents: DocumentWithShares[];
}) {
  const [shareUrl, setShareUrl] = useState("");

  async function handleUpload(formData: FormData) {
    await createDocument(formData);
    window.location.reload();
  }

  async function handleShare(docId: string) {
    const result = await createShareLink(docId, "recipient@example.com");
    setShareUrl(result.shareUrl);
  }

  async function handleRevoke(shareId: string) {
    await revokeShareLink(shareId);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <form
        action={handleUpload}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold">Upload Document</h2>
        <input
          type="file"
          name="file"
          required
          className="mb-4 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
        />
        <Button type="submit">Upload</Button>
      </form>

      {shareUrl && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            Share link generated
          </p>
          <p className="mt-1 break-all font-mono text-sm text-muted-foreground">
            {shareUrl}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No documents yet. Upload your first file above.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium">{doc.name}</td>
                  <td className="px-6 py-4">
                    {doc.shares.length > 0 ? (
                      doc.shares[0].revokedAt ? (
                        <Badge variant="destructive">Revoked</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                          Active
                        </Badge>
                      )
                    ) : (
                      <Badge variant="secondary">No shares</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={() => handleShare(doc.id)}
                    >
                      Share
                    </Button>
                    {doc.shares.length > 0 && !doc.shares[0].revokedAt && (
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-destructive"
                        onClick={() => handleRevoke(doc.shares[0].id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
