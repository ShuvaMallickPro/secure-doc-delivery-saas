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
    <header className="sticky top-0 z-10 flex h-14 w-full min-w-0 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:gap-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="shrink-0 md:hidden" />
        <h1 className="min-w-0 truncate text-base font-semibold tracking-tight md:text-lg">
          {title}
        </h1>
      </div>

      <div className="relative hidden min-w-0 max-w-sm flex-1 md:block lg:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="h-9 w-full rounded-full border-border bg-muted/50 pl-9 shadow-none focus-visible:ring-primary/30"
          aria-label="Search documents"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <div className="relative z-50 flex size-9 shrink-0 items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 shrink-0 ",
                userButtonTrigger: "h-9 w-9 shrink-0 focus:shadow-none",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
