import { z } from "zod";
import { formatZodError } from "./documents";

/** Matches Prisma ShareLink.token (@default(uuid())). */
export const shareTokenSchema = z.uuid("Invalid share link");

export function parseShareToken(raw: unknown): string {
  const result = shareTokenSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
}
