import { AI_SUMMARY_STATUS } from "@/lib/ai-summary-status";

export function DocumentAiSummary({
  status,
  summary,
  error,
}: {
  status: string | null;
  summary: string | null;
  error: string | null;
}) {
  if (status === AI_SUMMARY_STATUS.READY && summary) {
    return (
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">
          AI summary
        </p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {summary}
        </div>
      </div>
    );
  }

  if (status === AI_SUMMARY_STATUS.PENDING) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        AI summary is being generated…
      </div>
    );
  }

  if (status === AI_SUMMARY_STATUS.FAILED) {
    return (
      <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
        AI summary unavailable{error ? `: ${error}` : "."}
      </div>
    );
  }

  return null;
}
