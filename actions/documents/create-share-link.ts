"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
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

  const doc = await prisma.document.findFirst({
    where: { id: documentId, ownerId: userId },
  });
  if (!doc) throw new Error("Document not found");

  const link = await prisma.shareLink.create({
    data: {
      documentId,
      recipientEmail: email,
    },
  });

  const { buildShareUrl } = await import("@/lib/share-utils");

  return {
    shareUrl: buildShareUrl(link.token),
  };
}
