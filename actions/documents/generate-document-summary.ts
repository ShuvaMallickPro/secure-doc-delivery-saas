"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDocumentForUser } from "@/lib/data/documents";
import { runDocumentSummaryJob } from "@/lib/document-summary";
import { parseDocumentId } from "@/lib/validators/documents";

export async function generateDocumentSummary(documentIdRaw: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const documentId = parseDocumentId(documentIdRaw);

  const document = await getDocumentForUser(userId, documentId);
  if (!document) throw new Error("Document not found");

  await runDocumentSummaryJob(documentId);
  revalidatePath("/dashboard/documents");
}
