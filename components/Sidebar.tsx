// components/admin-sidebar.tsx - COMPLETE FIXED VERSION
"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Shield,
  Settings,
  Users,
  BarChart3,
  Flag,
  CreditCard,
  HelpCircle,
  LogOut,
  Crown,
  Edit,
  Eye,
  Home,
  BellRing,
  FileText,
  Key,
  Mail,
  FileCheck,
  DollarSign,
  Globe,
  ShieldCheck,
  Server,
  Palette,
  Activity,
  UsersRound,
  Monitor,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AdminPermission } from "@/types";

// Define the permission type
type PermissionType = AdminPermission | null;

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: PermissionType;
  description?: string;
  badge?: string;
}

// Update navigation items with proper typing
const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
    permission: null,
    description: "Overview & insights",
  },
  {
    name: "Feature Flags",
    href: "/admin/feature-flags",
    icon: Flag,
    permission: "feature_flags",
    description: "Control feature releases",
    badge: "NEW",
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UsersRound,
    permission: "user_management",
    description: "Manage users & roles",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    permission: "analytics",
    description: "Platform insights",
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    permission: "content_management",
    description: "Content moderation",
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    permission: "payment_management",
    description: "Payments & invoices",
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: BellRing,
    permission: "notification_management",
    description: "Push & email alerts",
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: HelpCircle,
    permission: "support_management",
    description: "Customer support",
  },
  {
    name: "System",
    href: "/admin/system",
    icon: Settings,
    permission: "system_settings",
    description: "System configuration",
  },
  {
    name: "API Keys",
    href: "/admin/api-keys",
    icon: Key,
    permission: "api_management",
    description: "API keys & access",
  },
  {
    name: "Email Templates",
    href: "/admin/email-templates",
    icon: Mail,
    permission: "content_management",
    description: "Email campaigns",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Mail,
    permission: "content_management",
    description: "User Testimonials",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileCheck,
    permission: "analytics",
    description: "Activity tracking",
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: ShieldCheck,
    permission: "security",
    description: "Security settings",
  },
  {
    name: "Infrastructure",
    href: "/admin/infrastructure",
    icon: Server,
    permission: "infrastructure",
    description: "System resources",
  },
  {
    name: "Appearance",
    href: "/admin/appearance",
    icon: Palette,
    permission: "system_settings",
    description: "UI customization",
  },
];

const roleIcons = {
  super: Crown,
  content: Edit,
  support: HelpCircle,
  analytics: Eye,
  admin: Shield,
  security: ShieldCheck,
  infrastructure: Server,
};

const roleColors: Record<string, { light: string; dark: string }> = {
  super: {
    light: "from-purple-600 via-pink-600 to-rose-600",
    dark: "dark:from-purple-500 dark:via-pink-500 dark:to-rose-500",
  },
  content: {
    light: "from-blue-600 via-cyan-600 to-sky-600",
    dark: "dark:from-blue-500 dark:via-cyan-500 dark:to-sky-500",
  },
  support: {
    light: "from-emerald-600 via-green-600 to-teal-600",
    dark: "dark:from-emerald-500 dark:via-green-500 dark:to-teal-500",
  },
  analytics: {
    light: "from-orange-600 via-amber-600 to-yellow-600",
    dark: "dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500",
  },
  admin: {
    light: "from-gray-700 via-gray-800 to-black",
    dark: "dark:from-gray-600 dark:via-gray-700 dark:to-gray-800",
  },
  security: {
    light: "from-red-600 via-rose-600 to-pink-600",
    dark: "dark:from-red-500 dark:via-rose-500 dark:to-pink-500",
  },
  infrastructure: {
    light: "from-indigo-600 via-violet-600 to-purple-600",
    dark: "dark:from-indigo-500 dark:via-violet-500 dark:to-purple-500",
  },
};

const permissionColors = {
  all: "bg-gradient-to-r from-yellow-500 to-amber-500",
  content_management: "bg-gradient-to-r from-blue-500 to-cyan-500",
  feature_flags: "bg-gradient-to-r from-purple-500 to-pink-500",
  user_management: "bg-gradient-to-r from-green-500 to-emerald-500",
  analytics: "bg-gradient-to-r from-orange-500 to-red-500",
  content_moderation: "bg-gradient-to-r from-indigo-500 to-violet-500",
  payment_management: "bg-gradient-to-r from-rose-500 to-red-500",
  notification_management: "bg-gradient-to-r from-teal-500 to-cyan-500",
  support_management: "bg-gradient-to-r from-lime-500 to-green-500",
  system_settings: "bg-gradient-to-r from-gray-600 to-gray-800",
  security: "bg-gradient-to-r from-red-500 to-orange-500",
  api_management: "bg-gradient-to-r from-violet-500 to-purple-500",
  infrastructure: "bg-gradient-to-r from-slate-600 to-gray-700",
};

interface AdminSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function AdminSidebar({ onClose, isMobile = false }: AdminSidebarProps) {
  const { colors, isDarkMode, mounted } = useThemeColors();
  const {
    isAdmin,
    adminRole,
    adminPermissions,
    canManageUsers,
    canManageContent,
    canManagePayments,
    canViewAnalytics,
  } = useAdminCheck();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Filter navigation based on permissions
  const filteredNavigation = navigationItems.filter((item) => {
    if (item.permission === null) return true;
    if (adminPermissions.includes("all")) return true;
    return adminPermissions.includes(item.permission as AdminPermission);
  });

  const RoleIcon = roleIcons[adminRole as keyof typeof roleIcons] || Shield;
  const roleColor =
    roleColors[adminRole as keyof typeof roleColors] || roleColors.admin;

  // Calculate permission badges
  const permissionCount = adminPermissions.length;
  const isFullAdmin = adminPermissions.includes("all");
  const permissionPercentage = Math.min(100, (permissionCount / 12) * 100);

  // Determine active section based on pathname
  useEffect(() => {
    const section = pathname.split("/")[2] || "dashboard";
    setActiveSection(section);
  }, [pathname]);

  // Group navigation items by category
  const groupedNavigation = {
    Platform: filteredNavigation.filter((item) =>
      ["dashboard", "analytics", "content", "billing"].includes(
        item.href.split("/")[2] || ""
      )
    ),
    Management: filteredNavigation.filter((item) =>
      [
        "users",
        "feature-flags",
        "notifications",
        "support",
        "testimonials",
      ].includes(item.href.split("/")[2] || "")
    ),
    System: filteredNavigation.filter((item) =>
      [
        "system",
        "api-keys",
        "security",
        "infrastructure",
        "appearance",
        "audit-logs",
      ].includes(item.href.split("/")[2] || "")
    ),
    Communication: filteredNavigation.filter((item) =>
      ["email-templates"].includes(item.href.split("/")[2] || "")
    ),
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex flex-col h-full border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
          "fixed left-0 top-0 h-screen w-72 overflow-y-auto z-50"
        )}
      >
        <div className="p-8 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r",
        colors.navBackground,
        colors.navBorder,
        "fixed left-0 top-0 h-screen w-72 overflow-y-auto z-50",
        "transition-all duration-300",
        "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      )}
    >
      {/* Header with Animated Background */}
      <div
        className={cn("p-6 border-b relative overflow-hidden", colors.border)}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 animate-gradient" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "p-3 rounded-xl bg-gradient-to-r shadow-lg",
                roleColor.light,
                roleColor.dark,
                "relative group"
              )}
            >
              <RoleIcon className="h-7 w-7 text-white" />
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className={cn(
                  "text-xl font-bold tracking-tight truncate",
                  colors.text
                )}
              >
                Gigup Admin
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r",
                    roleColor.light,
                    roleColor.dark,
                    "text-white shadow-sm"
                  )}
                >
                  {adminRole?.toUpperCase() || "ADMIN"}
                </span>
                {isFullAdmin && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-sm"
                    )}
                  >
                    FULL ACCESS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Permission Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-gray-500" />
                <span className={cn("text-xs font-medium", colors.textMuted)}>
                  Permissions
                </span>
              </div>
              <span className={cn("text-xs font-bold", colors.primary)}>
                {permissionCount}/12
              </span>
            </div>
            <div className="relative">
              <div
                className={cn(
                  "w-full rounded-full h-1.5",
                  colors.backgroundMuted
                )}
              >
                <div
                  className={cn(
                    "h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700",
                    "shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                  )}
                  style={{ width: `${permissionPercentage}%` }}
                />
              </div>
              <div className="absolute -top-2 left-0 w-full flex justify-between">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div
                    key={percent}
                    className="relative"
                    style={{ left: `${percent}%` }}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full -translate-x-1/2",
                        permissionPercentage >= percent
                          ? "bg-orange-500"
                          : colors.backgroundMuted
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={cn("px-4 py-3 border-b", colors.border)}>
        <div className="grid grid-cols-2 gap-2">
          <div
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-xl transition-all hover:scale-105",
              canManageUsers
                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                : cn(colors.backgroundMuted, "border border-transparent")
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg",
                canManageUsers
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : colors.backgroundMuted
              )}
            >
              <Users className="h-3.5 w-3.5 text-white" />
            </div>
            <span className={cn("text-xs font-medium", colors.text)}>
              Users
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-xl transition-all hover:scale-105",
              canManageContent
                ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                : cn(colors.backgroundMuted, "border border-transparent")
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg",
                canManageContent
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                  : colors.backgroundMuted
              )}
            >
              <Edit className="h-3.5 w-3.5 text-white" />
            </div>
            <span className={cn("text-xs font-medium", colors.text)}>
              Content
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-xl transition-all hover:scale-105",
              canManagePayments
                ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                : cn(colors.backgroundMuted, "border border-transparent")
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg",
                canManagePayments
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : colors.backgroundMuted
              )}
            >
              <DollarSign className="h-3.5 w-3.5 text-white" />
            </div>
            <span className={cn("text-xs font-medium", colors.text)}>
              Payments
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-xl transition-all hover:scale-105",
              canViewAnalytics
                ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                : cn(colors.backgroundMuted, "border border-transparent")
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg",
                canViewAnalytics
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : colors.backgroundMuted
              )}
            >
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <span className={cn("text-xs font-medium", colors.text)}>
              Analytics
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {Object.entries(groupedNavigation).map(
          ([section, items]) =>
            items.length > 0 && (
              <div key={section} className="mb-4">
                <div className="px-3 mb-2">
                  <h3
                    className={cn(
                      "text-xs font-semibold tracking-wider uppercase",
                      colors.textMuted
                    )}
                  >
                    {section}
                  </h3>
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    const isSectionActive =
                      activeSection === item.href.split("/")[2];

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                          isActive
                            ? cn(
                                "bg-gradient-to-r from-orange-500/15 to-red-500/15",
                                "border border-orange-500/30 shadow-lg shadow-orange-500/10"
                              )
                            : cn(
                                colors.text,
                                colors.hoverBg,
                                "border border-transparent hover:border-orange-500/10 hover:shadow-md"
                              )
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-all duration-200 relative",
                            isActive
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                              : cn(
                                  colors.backgroundMuted,
                                  "text-gray-500 group-hover:text-orange-500 group-hover:scale-110"
                                )
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "truncate",
                                isActive ? "font-bold" : "font-medium"
                              )}
                            >
                              {item.name}
                            </span>
                            {item.badge && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                                  "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p
                              className={cn(
                                "text-xs truncate mt-0.5",
                                isActive
                                  ? "text-orange-600 dark:text-orange-400"
                                  : colors.textMuted
                              )}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <div className="absolute right-3 w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse" />
                        )}
                        {!isActive && (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
        )}
      </nav>

      {/* Footer */}
      <div className={cn("p-4 border-t space-y-3 mt-auto", colors.border)}>
        {/* Theme Toggle */}
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-xl",
            colors.backgroundMuted,
            "hover:shadow-md transition-shadow"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
              )}
            >
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <span className={cn("text-sm font-medium", colors.text)}>
                Theme
              </span>
              <p className={cn("text-xs", colors.textMuted)}>
                Switch appearance
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Admin Info */}
        <div
          className={cn(
            "p-3 rounded-xl",
            colors.backgroundMuted,
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={cn("text-xs font-medium", colors.text)}>
              Access Level
            </span>
            <span
              className={cn(
                "px-2 py-0.5 text-xs font-bold rounded-full",
                isFullAdmin
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              )}
            >
              {isFullAdmin ? "FULL" : "LIMITED"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-1 rounded",
                  "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                )}
              >
                <Shield className="h-3 w-3 text-gray-500" />
              </div>
              <span className={colors.textMuted}>
                {permissionCount} permissions
              </span>
            </div>
            <span className={cn("font-bold", colors.primary)}>
              {Math.round(permissionPercentage)}%
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center justify-center gap-3 w-full p-3 rounded-xl text-sm font-medium transition-all duration-200 group",
            "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
            "text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
          )}
        >
          <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>

        {/* Version Info */}
        <div className="pt-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-300">
            <Monitor className="h-3 w-3 text-gray-500" />
            <span className={cn("text-xs font-medium", colors.textMuted)}>
              Admin Panel v2.1.0
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
