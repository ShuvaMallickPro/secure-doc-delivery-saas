"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { runDocumentSummaryJob } from "@/lib/document-summary";
import { prisma } from "@/lib/prisma";

export async function generateDocumentSummary(documentId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const document = await prisma.document.findFirst({
    where: { id: documentId, ownerId: userId },
  });
  if (!document) throw new Error("Document not found");

  await runDocumentSummaryJob(documentId);
  revalidatePath("/dashboard/documents");
}
