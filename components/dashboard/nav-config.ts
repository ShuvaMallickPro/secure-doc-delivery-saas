import {
  FileText,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Exact match only (e.g. /dashboard) */
  exact?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/documents")) return "Documents";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  return "Dashboard";
}

export function isNavItemActive(
  pathname: string,
  item: DashboardNavItem,
): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
