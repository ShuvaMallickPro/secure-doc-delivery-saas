"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex min-h-svh flex-col bg-muted/30">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
