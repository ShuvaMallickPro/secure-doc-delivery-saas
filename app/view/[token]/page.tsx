import { getDownloadUrl } from "@/lib/s3";
import { getShareLinkByToken } from "@/lib/data/share-links";
import { DocumentAiSummary } from "@/components/documents/document-ai-summary";
import { shareTokenSchema } from "@/lib/validators/share";

type ViewPageProps = {
  params: Promise<{ token: string }>;
};

function getFileKind(name: string): "pdf" | "image" | "other" {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext ?? "")) {
    return "image";
  }
  return "other";
}

function UnavailableMessage({
  reason,
}: {
  reason: "missing" | "revoked" | "expired";
}) {
  const copy = {
    missing: {
      title: "Link not found",
      body: "This share link is invalid or no longer exists.",
    },
    revoked: {
      title: "Document unavailable",
      body: "The sender has revoked access. This link no longer works.",
    },
    expired: {
      title: "Link expired",
      body: "This share link has expired. Ask the sender for a new link.",
    },
  }[reason];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-destructive">
          {copy.title}
        </h1>
        <p className="text-muted-foreground">{copy.body}</p>
      </div>
    </div>
  );
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { token } = await params;

  const parsed = shareTokenSchema.safeParse(token);
  if (!parsed.success) {
    return <UnavailableMessage reason="missing" />;
  }

  const link = await getShareLinkByToken(parsed.data);

  if (!link) {
    return <UnavailableMessage reason="missing" />;
  }

  if (link.revokedAt) {
    return <UnavailableMessage reason="revoked" />;
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return <UnavailableMessage reason="expired" />;
  }

  const downloadUrl = await getDownloadUrl(link.document.s3Key);
  const fileKind = getFileKind(link.document.name);
  const viewedAt = new Date().toLocaleString();

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 rounded-lg border border-border bg-muted px-4 py-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Viewed by {link.recipientEmail} — {viewedAt}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">
            {link.document.name}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Shared securely. Download only while access is active.
          </p>

          <DocumentAiSummary
            status={link.document.aiSummaryStatus}
            summary={link.document.aiSummary}
            error={link.document.aiSummaryError}
          />

          <div className="mb-6 overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
            {fileKind === "pdf" ? (
              <iframe
                src={downloadUrl}
                title={link.document.name}
                className="h-[min(70vh,520px)] w-full"
              />
            ) : fileKind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={downloadUrl}
                alt={link.document.name}
                className="mx-auto max-h-[min(70vh,520px)] w-full object-contain p-4"
              />
            ) : (
              <div className="flex h-64 items-center justify-center p-6 text-center text-muted-foreground">
                <p>
                  Preview is not available for this file type. Use the download
                  button below.
                </p>
              </div>
            )}
          </div>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Download document
          </a>
        </div>
      </div>
    </div>
  );
}
