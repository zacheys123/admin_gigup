"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Flag,
  Database,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Clock,
  Crown,
  Eye,
  HelpCircle,
  Zap,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type permissions =
  | "all"
  | "content_management"
  | "feature_flags"
  | "user_management"
  | "analytics"
  | "content_moderation"
  | "payment_management";

const stats = [
  {
    name: "Total Users",
    value: "12,402",
    icon: Users,
    change: "+12%",
    changeType: "positive",
  },
  {
    name: "Active Features",
    value: "8",
    icon: Flag,
    change: "+2",
    changeType: "positive",
  },
  {
    name: "System Health",
    value: "100%",
    icon: BarChart3,
    change: "Stable",
    changeType: "neutral",
  },
  {
    name: "Pending Tasks",
    value: "3",
    icon: Clock,
    change: "-2",
    changeType: "negative",
  },
];

const quickActions = [
  {
    name: "Feature Flags",
    description: "Manage feature releases",
    href: "/admin/feature-flags",
    icon: Flag,
    permission: "feature_flags",
  },
  {
    name: "User Management",
    description: "View and manage users",
    href: "/admin/users",
    icon: Users,
    permission: "user_management",
  },
  {
    name: "System Updates",
    description: "Deploy system changes",
    href: "/admin/system-updates",
    icon: Settings,
    permission: "content_management",
  },
  {
    name: "Analytics",
    description: "View platform metrics",
    href: "/admin/analytics",
    icon: BarChart3,
    permission: "analytics",
  },
  {
    name: "Content Moderation",
    description: "Manage platform content",
    href: "/admin/content",
    icon: Edit,
    permission: "content_moderation",
  },
  {
    name: "Billing & Payments",
    description: "Manage payments and billing",
    href: "/admin/billing",
    icon: Zap,
    permission: "payment_management",
  },
];

const roleIcons = {
  super: Crown,
  content: Edit,
  support: HelpCircle,
  analytics: BarChart3,
};

const roleColors = {
  super: "from-purple-500 to-pink-500",
  content: "from-blue-500 to-cyan-500",
  support: "from-green-500 to-emerald-500",
  analytics: "from-orange-500 to-red-500",
};

const roleDescriptions = {
  super: "Full system access with all permissions",
  content: "Manage content, features, and moderation",
  support: "User support and content moderation",
  analytics: "Data analytics and reporting only",
};

export default function AdminDashboard() {
  const { colors } = useThemeColors();
  const { initializeFlags, flags } = useFeatureFlags();
  const {
    isAdmin,
    isChecking,
    adminRole,
    adminPermissions,
    canManageUsers,
    canManageContent,
    canManagePayments,
    canViewAnalytics,
  } = useAdminCheck();
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();

  // Redirect non-admins
  useEffect(() => {
    if (!isChecking && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isChecking, router]);

  const handleInitializeFeatures = async () => {
    setIsInitializing(true);
    try {
      await initializeFlags();
      toast.success("Feature flags initialized successfully!");
    } catch (error) {
      toast.error("Failed to initialize feature flags");
    } finally {
      setIsInitializing(false);
    }
  };

  const enabledFeatures = flags?.filter((f) => f.enabled).length || 0;
  const totalFeatures = flags?.length || 0;

  // Filter quick actions based on permissions
  const filteredQuickActions = quickActions.filter(
    (action) =>
      adminPermissions.includes("all") ||
      adminPermissions.includes(action.permission as permissions)
  );

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Unauthorized access</div>
      </div>
    );
  }

  const RoleIcon = roleIcons[adminRole as keyof typeof roleIcons] || Shield;

  return (
    <div className="space-y-8 p-6">
      {/* Header with Role Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`bg-gradient-to-r ${
                roleColors[adminRole as keyof typeof roleColors]
              } rounded-xl p-3`}
            >
              <RoleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${
                    roleColors[adminRole as keyof typeof roleColors]
                  } text-white`}
                >
                  {adminRole?.toUpperCase()} ADMIN
                </span>
                <span className={`text-sm ${colors.textMuted}`}>
                  {roleDescriptions[adminRole as keyof typeof roleDescriptions]}
                </span>
              </div>
            </div>
          </div>
          <p className={`text-lg ${colors.textMuted}`}>
            Welcome to your platform control center
          </p>
        </div>

        {/* Initialize Button - Only for super/content admins */}
        {(adminPermissions.includes("all") ||
          adminPermissions.includes("feature_flags")) && (
          <div className="mt-4 lg:mt-0">
            <button
              onClick={handleInitializeFeatures}
              disabled={isInitializing}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                shadow-lg hover:shadow-xl transform hover:scale-105
              `}
            >
              <Rocket className="h-5 w-5" />
              <span>
                {isInitializing ? "Initializing..." : "Initialize Features"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Permission Summary */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
          Your Permissions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              canManageUsers
                ? `${colors.successBg} ${colors.successText}`
                : `${colors.backgroundMuted} ${colors.textMuted}`
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Users</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              canManageContent
                ? `${colors.successBg} ${colors.successText}`
                : `${colors.backgroundMuted} ${colors.textMuted}`
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Content</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              canManagePayments
                ? `${colors.successBg} ${colors.successText}`
                : `${colors.backgroundMuted} ${colors.textMuted}`
            }`}
          >
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Payments</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              canViewAnalytics
                ? `${colors.successBg} ${colors.successText}`
                : `${colors.backgroundMuted} ${colors.textMuted}`
            }`}
          >
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`${colors.card} ${colors.cardBorder} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${colors.textMuted}`}>
                    {stat.name}
                  </p>
                  <p className={`text-2xl font-bold ${colors.text} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.changeType === "positive"
                      ? `${colors.successBg} ${colors.successText}`
                      : stat.changeType === "negative"
                        ? `${colors.destructiveBg} ${colors.destructive}`
                        : `${colors.infoBg} ${colors.infoText}`
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div
                className={`mt-4 text-sm ${
                  stat.changeType === "positive"
                    ? `${colors.successText}`
                    : stat.changeType === "negative"
                      ? `${colors.destructive}`
                      : `${colors.infoText}`
                }`}
              >
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-6`}
      >
        <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className={`
                  flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200
                  ${colors.hoverBg} ${colors.border} hover:shadow-md hover:scale-105
                `}
              >
                <div
                  className={`p-2 rounded-lg ${colors.primaryBg} ${colors.textInverted}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-semibold ${colors.text}`}>
                    {action.name}
                  </h3>
                  <p className={`text-sm ${colors.textMuted}`}>
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredQuickActions.length === 0 && (
          <div className="text-center py-8">
            <Shield className={`h-12 w-12 ${colors.textMuted} mx-auto mb-4`} />
            <h4 className={`font-semibold ${colors.text} mb-2`}>
              No Actions Available
            </h4>
            <p className={`text-sm ${colors.textMuted}`}>
              Your current role doesn't have access to any admin actions.
            </p>
          </div>
        )}
      </div>

      {/* System Status */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-6`}
      >
        <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>
          System Status
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className={`h-5 w-5 ${colors.successText}`} />
              <span className={colors.text}>Platform Status</span>
            </div>
            <span
              className={`px-2 py-1 ${colors.successBg} ${colors.successText} text-xs font-medium rounded-full`}
            >
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flag className={`h-5 w-5 ${colors.infoText}`} />
              <span className={colors.text}>Feature Flags</span>
            </div>
            <span
              className={`px-2 py-1 ${colors.infoBg} ${colors.infoText} text-xs font-medium rounded-full`}
            >
              {enabledFeatures}/{totalFeatures} Enabled
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className={`h-5 w-5 ${colors.successText}`} />
              <span className={colors.text}>Database</span>
            </div>
            <span
              className={`px-2 py-1 ${colors.successBg} ${colors.successText} text-xs font-medium rounded-full`}
            >
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-5 w-5 ${colors.warningText}`} />
              <span className={colors.text}>Last Backup</span>
            </div>
            <span
              className={`px-2 py-1 ${colors.warningBg} ${colors.warningText} text-xs font-medium rounded-full`}
            >
              2 hours ago
            </span>
          </div>
        </div>

        {/* Feature Progress */}
        {(adminPermissions.includes("all") ||
          adminPermissions.includes("analytics")) && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className={colors.text}>Feature Rollout Progress</span>
              <span className={colors.textMuted}>
                {Math.round((enabledFeatures / totalFeatures) * 100)}%
              </span>
            </div>
            <div
              className={`w-full ${colors.backgroundMuted} rounded-full h-2`}
            >
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(enabledFeatures / totalFeatures) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {(adminPermissions.includes("all") ||
        adminPermissions.includes("analytics")) && (
        <div
          className={`${colors.card} ${colors.cardBorder} border rounded-xl p-6`}
        >
          <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "Feature flag updated",
                description: "teacher_role enabled",
                time: "2 minutes ago",
                type: "success",
              },
              {
                action: "User registered",
                description: "New talent joined platform",
                time: "5 minutes ago",
                type: "info",
              },
              {
                action: "System backup",
                description: "Nightly backup completed",
                time: "2 hours ago",
                type: "success",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-lg ${colors.backgroundMuted}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? `${colors.successBg.replace("bg-", "bg-")}`
                      : `${colors.infoBg.replace("bg-", "bg-")}`
                  }`}
                ></div>
                <div className="flex-1">
                  <p className={`font-medium ${colors.text}`}>
                    {activity.action}
                  </p>
                  <p className={`text-sm ${colors.textMuted}`}>
                    {activity.description}
                  </p>
                </div>
                <span className={`text-sm ${colors.textMuted}`}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
