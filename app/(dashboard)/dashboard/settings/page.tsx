import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <PageHeader
      title="Settings"
      description="Account and workspace settings will be available here soon."
    />
  );
}
