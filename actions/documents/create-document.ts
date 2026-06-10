"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { AI_SUMMARY_STATUS } from "@/lib/ai-summary-status";
import { runDocumentSummaryJob } from "@/lib/document-summary";
import { getPublicUrl, getUploadUrl } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export async function createDocument(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const key = `uploads/${userId}/${Date.now()}-${file.name}`;
  const uploadUrl = await getUploadUrl(
    key,
    file.type || "application/octet-stream",
  );

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to storage");
  }

  const doc = await prisma.document.create({
    data: {
      name: file.name,
      s3Key: key,
      s3Url: getPublicUrl(key),
      ownerId: userId,
      aiSummaryStatus: AI_SUMMARY_STATUS.PENDING,
    },
  });

  after(() => {
    void runDocumentSummaryJob(doc.id);
  });

  revalidatePath("/dashboard/documents");
  return doc;
}
