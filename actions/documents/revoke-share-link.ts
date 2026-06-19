"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseShareLinkId } from "@/lib/validators/documents";

export async function revokeShareLink(shareLinkIdRaw: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shareLinkId = parseShareLinkId(shareLinkIdRaw);

  const link = await prisma.shareLink.findFirst({
    where: { id: shareLinkId },
    include: { document: true },
  });

  if (!link || link.document.ownerId !== userId) {
    throw new Error("Not authorized to revoke this link");
  }

  await prisma.shareLink.update({
    where: { id: shareLinkId },
    data: { revokedAt: new Date() },
  });

  revalidatePath("/dashboard/documents");
}
