"use server";

import { auth } from "@clerk/nextjs/server";
import { getDocumentForUser } from "@/lib/data/documents";
import { createShareLinkRecord } from "@/lib/data/share-links";
import {
  parseDocumentId,
  parseRecipientEmail,
} from "@/lib/validators/documents";

export async function createShareLink(
  documentIdRaw: string,
  recipientEmailRaw: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const documentId = parseDocumentId(documentIdRaw);
  const email = parseRecipientEmail(recipientEmailRaw);

  const doc = await getDocumentForUser(userId, documentId);
  if (!doc) throw new Error("Document not found");

  const link = await createShareLinkRecord(documentId, email);

  const { buildShareUrl } = await import("@/lib/share-utils");

  return {
    shareUrl: buildShareUrl(link.token),
  };
}
