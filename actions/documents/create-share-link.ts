"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function createShareLink(
  documentId: string,
  recipientEmail: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doc = await prisma.document.findFirst({
    where: { id: documentId, ownerId: userId },
  });
  if (!doc) throw new Error("Document not found");

  const email = recipientEmail.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("A valid recipient email is required");
  }

  const link = await prisma.shareLink.create({
    data: {
      documentId,
      recipientEmail: email,
    },
  });

  const { buildShareUrl } = await import("@/lib/share-utils");

  return {
    token: link.token,
    shareUrl: buildShareUrl(link.token),
  };
}
