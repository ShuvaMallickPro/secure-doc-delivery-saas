"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteObject } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { parseDocumentId } from "@/lib/validators/documents";

export async function deleteDocument(documentIdRaw: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const documentId = parseDocumentId(documentIdRaw);

  const doc = await prisma.document.findFirst({
    where: { id: documentId, ownerId: userId },
  });
  if (!doc) throw new Error("Document not found");

  await deleteObject(doc.s3Key);

  await prisma.document.delete({
    where: { id: documentId },
  });

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");
}
