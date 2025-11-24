"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Shield,
  Settings,
  Users,
  BarChart3,
  Flag,
  Database,
  Bell,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  Crown,
  Edit,
  Eye,
  Zap,
  Info,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
type permissions =
  | "all"
  | "content_management"
  | "feature_flags"
  | "user_management"
  | "analytics"
  | "content_moderation"
  | "payment_management";
const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    permission: null, // Always visible to admins
  },
  {
    name: "Feature Flags",
    description: "Manage feature releases",
    href: "/admin/feature-flags",
    icon: Flag,
    permission: "feature_flags",
  },

  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
    permission: "user_management",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    permission: "analytics",
  },
  {
    name: "Content Moderation",
    href: "/admin/content",
    icon: FileText,
    permission: "content_moderation",
  },
  {
    name: "Billing & Payments",
    href: "/admin/billing",
    icon: CreditCard,
    permission: "payment_management",
  },
  {
    name: "About System",
    href: "/admin/about",
    icon: Info,
    permission: "all", // Or specific permission if needed
  },
  {
    name: "Database",
    href: "/admin/database",
    icon: Database,
    permission: "all", // Only super admins
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    permission: "content_management",
  },
  {
    name: "Support Tickets",
    href: "/admin/support",
    icon: HelpCircle,
    permission: "user_support",
  },
];

const roleIcons = {
  super: Crown,
  content: Edit,
  support: HelpCircle,
  analytics: Eye,
};

const roleColors = {
  super: "from-purple-500 to-pink-500",
  content: "from-blue-500 to-cyan-500",
  support: "from-green-500 to-emerald-500",
  analytics: "from-orange-500 to-red-500",
};

export function AdminSidebar({ onClose }: { onClose: () => void }) {
  const { colors, isDarkMode } = useThemeColors();
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

  // Filter navigation based on permissions
  const filteredNavigation = navigationItems.filter((item) => {
    if (item.permission === null) return true; // Always show items with null permission
    if (adminPermissions.includes("all")) return true; // Super admins see everything
    return adminPermissions.includes(item.permission as permissions);
  });

  const RoleIcon = roleIcons[adminRole as keyof typeof roleIcons] || Shield;

  return (
    <div
      className={`flex flex-col h-full ${colors.navBackground} ${colors.navBorder} border-r`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${
              roleColors[adminRole as keyof typeof roleColors] ||
              "from-gray-500 to-gray-600"
            } ${colors.textInverted}`}
          >
            <RoleIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Gigup Admin
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                  roleColors[adminRole as keyof typeof roleColors] ||
                  "from-gray-500 to-gray-600"
                } text-white`}
              >
                {adminRole?.toUpperCase() || "ADMIN"}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Control Panel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Quick View */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`flex items-center gap-1 p-1 rounded text-xs ${
              canManageUsers
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <Users className="h-3 w-3" />
            <span>Users</span>
          </div>
          <div
            className={`flex items-center gap-1 p-1 rounded text-xs ${
              canManageContent
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <Edit className="h-3 w-3" />
            <span>Content</span>
          </div>
          <div
            className={`flex items-center gap-1 p-1 rounded text-xs ${
              canManagePayments
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <Zap className="h-3 w-3" />
            <span>Payments</span>
          </div>
          <div
            className={`flex items-center gap-1 p-1 rounded text-xs ${
              canViewAnalytics
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Analytics</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? `${colors.primaryBg} ${colors.textInverted} shadow-md`
                    : `${colors.text} ${colors.hoverBg} hover:shadow-sm`
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.permission === "all" && (
                <Crown className="h-3 w-3 text-amber-500 ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg ",
            colors.backgroundMuted
          )}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Admin Info */}
        <div className={cn("px-3 py-2 rounded-lg ", colors.backgroundMuted)}>
          <p className={cn("text-xs", colors.primary)}>
            Access Level:{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {adminPermissions.includes("all") ? "Full" : "Limited"}
            </span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Permissions: {adminPermissions.length}
          </p>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
