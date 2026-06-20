import "server-only";

import { prisma } from "@/lib/prisma";

export async function getShareLinkByToken(token: string) {
  return prisma.shareLink.findUnique({
    where: { token },
    include: { document: true },
  });
}

export async function getShareLinkForOwner(
  shareLinkId: string,
  ownerId: string,
) {
  const link = await prisma.shareLink.findFirst({
    where: { id: shareLinkId },
    include: { document: true },
  });

  if (!link || link.document.ownerId !== ownerId) {
    return null;
  }

  return link;
}

export async function createShareLinkRecord(
  documentId: string,
  recipientEmail: string,
) {
  return prisma.shareLink.create({
    data: { documentId, recipientEmail },
  });
}

export async function setShareLinkRevokedAt(
  shareLinkId: string,
  revokedAt: Date | null,
) {
  return prisma.shareLink.update({
    where: { id: shareLinkId },
    data: { revokedAt },
  });
}

export async function countActiveSharesForUser(ownerId: string) {
  return prisma.shareLink.count({
    where: {
      document: { ownerId },
      revokedAt: null,
    },
  });
}

export async function countRevokedSharesForUser(ownerId: string) {
  return prisma.shareLink.count({
    where: {
      document: { ownerId },
      revokedAt: { not: null },
    },
  });
}
