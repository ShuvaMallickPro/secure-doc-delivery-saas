"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getShareLinkForOwner,
  setShareLinkRevokedAt,
} from "@/lib/data/share-links";
import { parseShareLinkId } from "@/lib/validators/documents";

export async function restoreShareLink(shareLinkIdRaw: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const shareLinkId = parseShareLinkId(shareLinkIdRaw);

  const link = await getShareLinkForOwner(shareLinkId, userId);
  if (!link) throw new Error("Not authorized to restore this link");

  await setShareLinkRevokedAt(shareLinkId, null);

  revalidatePath("/dashboard/documents");
}
