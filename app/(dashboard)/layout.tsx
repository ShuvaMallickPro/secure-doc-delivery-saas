import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 bg-muted/30">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card md:w-64">
        <div className="border-b border-border p-5">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight"
          >
            SecureDoc
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/documents"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Documents
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8">
          <span className="text-sm font-medium text-muted-foreground md:text-base">
            Workspace
          </span>
          <UserButton />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
