import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
      <p className="text-muted-foreground">
        Document upload and sharing will live here.
      </p>
    </div>
  );
}
