"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createDocument, generateDocumentSummary } from "@/actions/documents";
import { AI_SUMMARY_STATUS } from "@/lib/ai-summary-status";
import type { DocumentModel } from "@/generated/prisma/models/Document";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";
import { DeleteDocumentDialog } from "@/components/documents/delete-document-dialog";
import { DocumentSharesPanel } from "@/components/documents/document-shares-panel";
import { ShareLinkDialog } from "@/components/documents/share-link-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDocumentShareSummary } from "@/lib/share-utils";
import { notifyError, notifySuccess } from "@/lib/toast";
import { getUploadFileValidationError } from "@/lib/validators/documents";

type DocumentWithShares = DocumentModel & { shares: ShareLinkModel[] };

function getAiSummaryBadge(status: string | null) {
  switch (status) {
    case AI_SUMMARY_STATUS.READY:
      return { label: "AI summary ready", variant: "default" as const };
    case AI_SUMMARY_STATUS.PENDING:
      return { label: "AI generating…", variant: "secondary" as const };
    case AI_SUMMARY_STATUS.FAILED:
      return { label: "AI failed", variant: "destructive" as const };
    case AI_SUMMARY_STATUS.SKIPPED:
      return { label: "AI skipped", variant: "outline" as const };
    default:
      return null;
  }
}

export function DocumentList({
  documents,
}: {
  documents: DocumentWithShares[];
}) {
  const router = useRouter();
  const [isUploadPending, startUploadTransition] = useTransition();
  const [isRetryPending, startRetryTransition] = useTransition();
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [shareDialogDoc, setShareDialogDoc] = useState<{
    id: string;
    name: string;
  } | null>(null);

  async function handleUpload(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");

    const validationError = getUploadFileValidationError(file);
    if (validationError) {
      notifyError("Upload failed", validationError);
      return;
    }

    try {
      const result = await createDocument(formData);
      form.reset();
      notifySuccess(
        "Document uploaded",
        `${result.name} was uploaded successfully.`,
      );
      startUploadTransition(() => {
        router.refresh();
      });
    } catch (error) {
      notifyError("Upload failed", error);
    }
  }

  function toggleExpanded(docId: string) {
    setExpandedDocId((current) => (current === docId ? null : docId));
  }

  async function handleRetrySummary(documentId: string) {
    try {
      await generateDocumentSummary(documentId);
      notifySuccess(
        "AI summary started",
        "We are generating a new summary for this document.",
      );
      startRetryTransition(() => {
        router.refresh();
      });
    } catch (error) {
      notifyError("AI summary failed", error);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleUpload}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="mb-1 text-lg font-semibold">Upload Document</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          PDF, TXT, or common images up to 10 MB.
        </p>
        <input
          type="file"
          name="file"
          required
          accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.webp,application/pdf,text/plain,image/*"
          disabled={isUploadPending}
          className="mb-4 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground disabled:opacity-50 cursor-pointer"
        />
        <Button type="submit" disabled={isUploadPending}>
          {isUploadPending ? "Uploading…" : "Upload"}
        </Button>
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
              <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">
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
                const aiBadge = getAiSummaryBadge(doc.aiSummaryStatus);
                const isExpanded = expandedDocId === doc.id;

                return (
                  <Fragment key={doc.id}>
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium">{doc.name}</p>
                          {aiBadge ? (
                            <Badge
                              variant={aiBadge.variant}
                              className={
                                aiBadge.variant === "default"
                                  ? "bg-primary/10 text-primary hover:bg-primary/10"
                                  : undefined
                              }
                            >
                              {aiBadge.label}
                            </Badge>
                          ) : null}
                        </div>
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
                      <td className="flex items-center justify-center gap-3 px-6 py-4 mt-2">
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
                        <DeleteDocumentDialog
                          documentId={doc.id}
                          documentName={doc.name}
                        />
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr key={`${doc.id}-shares`}>
                        <td colSpan={4} className="bg-muted/20 px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Share links for {doc.name}
                            </p>
                            {doc.aiSummaryStatus ===
                            AI_SUMMARY_STATUS.FAILED ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isRetryPending}
                                onClick={() => handleRetrySummary(doc.id)}
                              >
                                {isRetryPending
                                  ? "Retrying…"
                                  : "Retry AI summary"}
                              </Button>
                            ) : null}
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
        onCreated={() => {
          startUploadTransition(() => {
            router.refresh();
          });
        }}
      />
    </div>
  );
}
