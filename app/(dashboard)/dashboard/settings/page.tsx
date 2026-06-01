import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">
        Account and workspace settings will be available here soon.
      </p>
    </div>
  );
}
