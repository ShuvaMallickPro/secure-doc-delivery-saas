"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  dashboardNavItems,
  isNavItemActive,
} from "@/components/dashboard/nav-config";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu className="my-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  S
                </span>
                <span className="truncate text-base font-semibold tracking-tight">
                  SecureDoc
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-3 ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNavItems.map((item) => {
                const active = isNavItemActive(pathname, item);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link href={item.href} className="py-5 px-4">
                        <Icon
                          className={
                            active ? "text-primary " : "text-muted-foreground"
                          }
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
      <div className="hidden border-t border-sidebar-border p-2 md:flex">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}
