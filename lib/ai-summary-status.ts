/** Client-safe status constants for AI summary (no server imports). */
export const AI_SUMMARY_STATUS = {
  PENDING: "pending",
  READY: "ready",
  FAILED: "failed",
  SKIPPED: "skipped",
} as const;

export type AiSummaryStatus =
  (typeof AI_SUMMARY_STATUS)[keyof typeof AI_SUMMARY_STATUS];
