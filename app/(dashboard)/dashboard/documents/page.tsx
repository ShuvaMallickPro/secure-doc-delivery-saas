import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DocumentList } from "@/components/documents/document-list";
import { prisma } from "@/lib/prisma";

export default async function DocumentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const documents = await prisma.document.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { shares: true },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1 md:hidden">
        <h2 className="text-2xl font-bold tracking-tight">My Documents</h2>
        <p className="text-sm text-muted-foreground">
          Upload files and manage share links.
        </p>
      </div>
      <DocumentList documents={documents} />
    </div>
  );
}
