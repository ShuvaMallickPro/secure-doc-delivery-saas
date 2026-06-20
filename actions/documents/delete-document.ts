"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  deleteDocumentById,
  getDocumentForUser,
} from "@/lib/data/documents";
import { deleteObject } from "@/lib/s3";
import { parseDocumentId } from "@/lib/validators/documents";

export async function deleteDocument(documentIdRaw: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const documentId = parseDocumentId(documentIdRaw);

  const doc = await getDocumentForUser(userId, documentId);
  if (!doc) throw new Error("Document not found");

  await deleteObject(doc.s3Key);
  await deleteDocumentById(documentId);

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");
}
