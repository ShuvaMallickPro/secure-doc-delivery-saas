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
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Documents</h1>
      <DocumentList documents={documents} />
    </div>
  );
}
