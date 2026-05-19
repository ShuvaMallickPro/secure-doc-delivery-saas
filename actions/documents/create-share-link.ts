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

  const link = await prisma.shareLink.create({
    data: {
      documentId,
      recipientEmail,
    },
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  return {
    token: link.token,
    shareUrl: `${appUrl}/view/${link.token}`,
  };
}
