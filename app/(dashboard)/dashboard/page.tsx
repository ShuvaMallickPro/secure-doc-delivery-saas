import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  const name =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress ??
    "there";

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome{name ? `, ${name}` : ""}
      </h1>
      <p className="text-muted-foreground">
        Upload documents and share them with revocable links. Use the sidebar to
        open Documents when you are ready.
      </p>
    </div>
  );
}
