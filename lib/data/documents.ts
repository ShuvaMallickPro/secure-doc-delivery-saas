import "server-only";

import { prisma } from "@/lib/prisma";
import {
  countActiveSharesForUser,
  countRevokedSharesForUser,
} from "@/lib/data/share-links";

export async function getDocumentsForUser(ownerId: string) {
  return prisma.document.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: {
      shares: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getDocumentForUser(ownerId: string, documentId: string) {
  return prisma.document.findFirst({
    where: { id: documentId, ownerId },
  });
}

export async function getRecentDocumentsForUser(ownerId: string, limit = 5) {
  return prisma.document.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { shares: { orderBy: { createdAt: "desc" } } },
  });
}

export async function countDocumentsForUser(ownerId: string) {
  return prisma.document.count({ where: { ownerId } });
}

export async function getDashboardStatsForUser(ownerId: string) {
  const [documentCount, activeShares, revokedShares, recentDocuments] =
    await Promise.all([
      countDocumentsForUser(ownerId),
      countActiveSharesForUser(ownerId),
      countRevokedSharesForUser(ownerId),
      getRecentDocumentsForUser(ownerId),
    ]);

  return { documentCount, activeShares, revokedShares, recentDocuments };
}

export async function createDocumentRecord(data: {
  name: string;
  s3Key: string;
  s3Url: string;
  ownerId: string;
  aiSummaryStatus: string;
}) {
  return prisma.document.create({ data });
}

export async function deleteDocumentById(documentId: string) {
  return prisma.document.delete({ where: { id: documentId } });
}
