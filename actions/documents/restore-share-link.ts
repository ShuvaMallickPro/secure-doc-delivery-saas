"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseShareLinkId } from "@/lib/validators/documents";

export async function restoreShareLink(shareLinkIdRaw: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shareLinkId = parseShareLinkId(shareLinkIdRaw);

  const link = await prisma.shareLink.findFirst({
    where: { id: shareLinkId },
    include: { document: true },
  });

  if (!link || link.document.ownerId !== userId) {
    throw new Error("Not authorized to restore this link");
  }

  await prisma.shareLink.update({
    where: { id: shareLinkId },
    data: { revokedAt: null },
  });

  revalidatePath("/dashboard/documents");
}
