"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/components/dashboard/nav-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 justify-between items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:gap-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <h1 className="min-w-0 truncate text-base font-semibold tracking-tight md:text-lg">
        {title}
      </h1>

      <div className="relative min-w-0 flex-1 md:max-w-md md:flex-none">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="h-9 rounded-full border-border bg-muted/50 pl-9 shadow-none focus-visible:ring-primary/30"
          aria-label="Search documents"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9",
            },
          }}
        />
      </div>
    </header>
  );
}
