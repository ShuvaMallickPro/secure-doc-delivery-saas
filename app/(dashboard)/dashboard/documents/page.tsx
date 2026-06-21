import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DocumentList } from "@/components/documents/document-list";
import { getDocumentsForUser } from "@/lib/data/documents";
export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const documents = await getDocumentsForUser(userId);

  return (
    <div className="space-y-6">
      <DocumentList documents={documents} />
    </div>
  );
}
