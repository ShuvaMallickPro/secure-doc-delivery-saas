import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { FileText, Link2, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardStatsForUser } from "@/lib/data/documents";
import type { DocumentModel } from "@/generated/prisma/models/Document";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";

export const dynamic = "force-dynamic";

type DocumentWithShares = DocumentModel & { shares: ShareLinkModel[] };

type DashboardStats = {
  documentCount: number;
  activeShares: number;
  revokedShares: number;
  recentDocuments: DocumentWithShares[];
  dbError: string | null;
};

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

async function loadDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    const stats = await getDashboardStatsForUser(userId);

    return {
      ...stats,
      dbError: null,
    };
  } catch (error) {
    console.error("Dashboard database error:", error);
    return {
      documentCount: 0,
      activeShares: 0,
      revokedShares: 0,
      recentDocuments: [],
      dbError:
        "Could not reach the database. Check DATABASE_URL and try again in a moment.",
    };
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  const displayName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress ??
    "there";

  const {
    documentCount,
    activeShares,
    revokedShares,
    recentDocuments,
    dbError,
  } = await loadDashboardStats(userId);

  return (
    <div className="space-y-8">
      {dbError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {dbError}
        </div>
      ) : null}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, {displayName}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Upload documents and share them with revocable links. Use the sidebar
          to open Documents when you are ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Documents"
          value={documentCount.toLocaleString()}
          icon={FileText}
        />
        <StatCard
          title="Active Shares"
          value={activeShares.toLocaleString()}
          icon={Link2}
        />
        <StatCard
          title="Revoked"
          value={revokedShares.toLocaleString()}
          icon={ShieldOff}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">
            Recent Documents
          </h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/documents">View all</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {recentDocuments.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No documents yet.{" "}
              <Link
                href="/dashboard/documents"
                className="font-medium text-primary hover:underline"
              >
                Upload your first file
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {doc.shares.length > 0
                        ? ` · ${doc.shares.length} share${doc.shares.length === 1 ? "" : "s"}`
                        : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {doc.shares.some((s) => !s.revokedAt) ? "Active" : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
