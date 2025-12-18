"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Menu,
  X,
  Shield,
  LogOut,
  Home,
  UsersRound,
  BarChart3,
  Flag,
  FileText,
  CreditCard,
  BellRing,
  HelpCircle,
  Settings,
  Key,
  Mail,
  FileCheck,
  ShieldCheck,
  Server,
  Palette,
  Monitor,
  Crown,
  Users,
  Activity,
  DollarSign,
  ChevronRight,
  Star,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AdminPermission } from "@/types";

// Define the permission type
type PermissionType = AdminPermission | null;

// Navigation items matching the sidebar
const mobileNavItems = [
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
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Star,
    permission: "content_management",
    description: "User testimonials",
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

interface AdminMobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminMobileNav({ isOpen, onToggle }: AdminMobileNavProps) {
  const { colors, isDarkMode, mounted } = useThemeColors();
  const { adminRole, adminPermissions } = useAdminCheck();
  const { signOut } = useClerk();
  const pathname = usePathname();

  // Filter navigation based on permissions
  const filteredNavItems = mobileNavItems.filter((item) => {
    if (item.permission === null) return true;
    if (adminPermissions.includes("all")) return true;
    return adminPermissions.includes(item.permission as AdminPermission);
  });

  // Group navigation items like the sidebar
  const groupedNavigation = {
    Platform: filteredNavItems.filter((item) =>
      ["dashboard", "analytics", "content", "billing"].includes(
        item.href.split("/")[2] || ""
      )
    ),
    Management: filteredNavItems.filter((item) =>
      [
        "users",
        "feature-flags",
        "notifications",
        "support",
        "testimonials",
      ].includes(item.href.split("/")[2] || "")
    ),
    System: filteredNavItems.filter((item) =>
      [
        "system",
        "api-keys",
        "security",
        "infrastructure",
        "appearance",
        "audit-logs",
      ].includes(item.href.split("/")[2] || "")
    ),
    Communication: filteredNavItems.filter((item) =>
      ["email-templates"].includes(item.href.split("/")[2] || "")
    ),
  };

  if (!mounted) {
    return (
      <div
        className={`lg:hidden ${colors.navBackground} ${colors.navBorder} border-b`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${colors.primaryBg} animate-pulse`}
            ></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Mobile Nav Bar */}
      <div
        className={`lg:hidden ${colors.navBackground} ${colors.navBorder} border-b shadow-sm`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 shadow-lg`}
            >
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${colors.navText}`}>
                GigUpp Admin
              </h1>
              <div className="flex items-center gap-1">
                <p className={`text-xs font-medium ${colors.textMuted}`}>
                  {adminRole?.toUpperCase() || "ADMIN"}
                </p>
                {adminPermissions.includes("all") && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full font-bold">
                    FULL
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onToggle}
              className={`p-2.5 rounded-lg ${colors.navHover} transition-all hover:scale-105`}
            >
              {isOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onToggle}
          />

          {/* Slide-out Menu */}
          <div
            className={`absolute right-0 top-0 h-full w-80 ${colors.navBackground} ${colors.navBorder} border-l transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header with admin info */}
              <div
                className={`p-6 border-b ${colors.border} bg-gradient-to-br ${isDarkMode ? "from-gray-900/80 to-gray-800/80" : "from-white/90 to-gray-50/90"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg`}
                    >
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${colors.navText}`}>
                        Admin Panel
                      </h2>
                      <p className={`text-xs ${colors.textMuted}`}>
                        {adminPermissions.length} permissions active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onToggle}
                    className={`p-2 rounded-lg ${colors.navHover} transition-colors hover:scale-105`}
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg ${colors.backgroundMuted}`}
                  >
                    <Users className="h-3.5 w-3.5 text-gray-500" />
                    <span className={`text-xs font-medium ${colors.text}`}>
                      Users
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg ${colors.backgroundMuted}`}
                  >
                    <Activity className="h-3.5 w-3.5 text-gray-500" />
                    <span className={`text-xs font-medium ${colors.text}`}>
                      Analytics
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items - Grouped */}
              <nav className="flex-1 p-4 overflow-y-auto">
                {Object.entries(groupedNavigation).map(
                  ([section, items]) =>
                    items.length > 0 && (
                      <div key={section} className="mb-6">
                        <div className="px-3 mb-3">
                          <h3
                            className={`text-xs font-semibold tracking-wider uppercase ${colors.textMuted}`}
                          >
                            {section}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={onToggle}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                  isActive
                                    ? "bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20"
                                    : cn(
                                        colors.text,
                                        colors.hoverBg,
                                        "border border-transparent"
                                      )
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-2 rounded-lg transition-all duration-200",
                                    isActive
                                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                      : cn(
                                          colors.backgroundMuted,
                                          "text-gray-500 group-hover:text-orange-500"
                                        )
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={cn(
                                        "font-medium",
                                        isActive ? "font-semibold" : ""
                                      )}
                                    >
                                      {item.name}
                                    </span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p
                                      className={`text-xs mt-0.5 ${colors.textMuted}`}
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight
                                  className={`h-4 w-4 ${colors.textMuted} opacity-60`}
                                />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )
                )}
              </nav>

              {/* Footer Actions */}
              <div
                className={`p-4 border-t ${colors.border} space-y-4 mt-auto`}
              >
                {/* Theme Toggle */}
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    colors.backgroundMuted
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.backgroundMuted}`}>
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${colors.text}`}>
                        Theme
                      </span>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Sign Out */}
                <button
                  onClick={() => {
                    onToggle();
                    signOut();
                  }}
                  className={`flex items-center justify-center gap-3 w-full p-3.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>

                {/* Version Info */}
                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <Monitor className="h-3 w-3 text-gray-500" />
                    <span className={`text-xs font-medium ${colors.textMuted}`}>
                      v2.1.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
