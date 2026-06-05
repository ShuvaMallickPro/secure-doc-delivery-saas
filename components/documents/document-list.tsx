"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createDocument } from "@/actions/documents";
import type { DocumentModel } from "@/generated/prisma/models/Document";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";
import { DocumentSharesPanel } from "@/components/documents/document-shares-panel";
import { ShareLinkDialog } from "@/components/documents/share-link-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDocumentShareSummary } from "@/lib/share-utils";

type DocumentWithShares = DocumentModel & { shares: ShareLinkModel[] };

export function DocumentList({
  documents,
}: {
  documents: DocumentWithShares[];
}) {
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [shareDialogDoc, setShareDialogDoc] = useState<{
    id: string;
    name: string;
  } | null>(null);

  async function handleUpload(formData: FormData) {
    await createDocument(formData);
    window.location.reload();
  }

  function toggleExpanded(docId: string) {
    setExpandedDocId((current) => (current === docId ? null : docId));
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

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Access
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Uploaded
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
              documents.map((doc) => {
                const summary = getDocumentShareSummary(doc.shares);
                const isExpanded = expandedDocId === doc.id;

                return (
                  <Fragment key={doc.id}>
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={summary.variant}
                          className={
                            summary.variant === "default"
                              ? "bg-primary/10 text-primary hover:bg-primary/10"
                              : undefined
                          }
                        >
                          {summary.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="space-x-2 px-6 py-4">
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-primary"
                          onClick={() =>
                            setShareDialogDoc({ id: doc.id, name: doc.name })
                          }
                        >
                          Share
                        </Button>
                        {doc.shares.length > 0 ? (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-muted-foreground"
                            onClick={() => toggleExpanded(doc.id)}
                          >
                            {isExpanded ? (
                              <span className="inline-flex items-center gap-1">
                                <ChevronDown className="size-3.5" />
                                Hide links
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <ChevronRight className="size-3.5" />
                                Manage ({doc.shares.length})
                              </span>
                            )}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr key={`${doc.id}-shares`}>
                        <td colSpan={4} className="bg-muted/20 px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Share links for {doc.name}
                            </p>
                            <DocumentSharesPanel shares={doc.shares} />
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ShareLinkDialog
        documentId={shareDialogDoc?.id ?? null}
        documentName={shareDialogDoc?.name ?? ""}
        open={shareDialogDoc !== null}
        onOpenChange={(open) => {
          if (!open) setShareDialogDoc(null);
        }}
        onCreated={() => {}}
      />
    </div>
  );
}
