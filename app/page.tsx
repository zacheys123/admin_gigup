"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Users,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Database,
  Server,
  Bell,
  FileText,
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Crown,
  Sparkles,
  Lock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, JSX } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Types based on your backend
type AdminRole = "super" | "content" | "support" | "analytics";
type AdminPermission =
  | "user_management"
  | "content_management"
  | "payment_management"
  | "analytics"
  | "feature_flags"
  | "content_moderation"
  | "all";
type AccessLevel = "full" | "limited" | "restricted";

interface AdminStatus {
  isAdmin: boolean;
  role: AdminRole | null;
  permissions: AdminPermission[];
}

interface AdminModule {
  icon: JSX.Element;
  title: string;
  description: string;
  stats: string;
  status: string;
  path: string;
  color: string;
  requiredRole?: AdminRole[];
  requiredPermissions?: AdminPermission[];
  minAccessLevel?: AccessLevel;
}

export default function AdminPortal() {
  const { isLoaded, user, isSignedIn } = useUser();
  const [systemStatus, setSystemStatus] = useState<
    "healthy" | "degraded" | "maintenance"
  >("healthy");
  const [activeUsers, setActiveUsers] = useState(0);

  // Get admin status from Convex
  const adminStatus = useQuery(
    api.controllers.adminFuncs.getAdminStatus,
    isSignedIn && user ? { userId: user.id } : "skip"
  ) as AdminStatus | undefined;

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      setActiveUsers((prev) => Math.floor(Math.random() * 500) + 2400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check if user has required permissions for a module
  const hasPermission = (module: AdminModule): boolean => {
    if (!adminStatus?.isAdmin) return false;

    // Super admins have access to everything
    if (adminStatus.role === "super") return true;

    // Check role restrictions
    if (
      module.requiredRole &&
      !module.requiredRole.includes(adminStatus.role!)
    ) {
      return false;
    }

    // Check permission requirements
    if (module.requiredPermissions) {
      const hasRequiredPermission = module.requiredPermissions.some(
        (permission) =>
          adminStatus.permissions.includes(permission) ||
          adminStatus.permissions.includes("all")
      );
      if (!hasRequiredPermission) return false;
    }

    return true;
  };

  // Get accessible modules based on user role
  const getAccessibleModules = (): AdminModule[] => {
    return adminModules.filter((module) => hasPermission(module));
  };

  // Check if user can view system metrics
  const canViewMetrics =
    adminStatus?.isAdmin &&
    (adminStatus.role === "super" ||
      adminStatus.permissions.includes("analytics") ||
      adminStatus.permissions.includes("all"));

  // Check if user can view recent activity
  const canViewActivity = adminStatus?.isAdmin;

  if (!isLoaded || (isSignedIn && adminStatus === undefined)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <Crown className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-lg text-gray-400 font-medium">
            {isSignedIn
              ? "Verifying Admin Access"
              : "Initializing Admin Portal"}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {isSignedIn ? "Checking permissions..." : "Securing connection..."}
          </div>
        </div>
      </div>
    );
  }

  const adminModules: AdminModule[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Center",
      description:
        "Real-time threat monitoring, access logs, and security policy management",
      stats: "98.7% Secure",
      status: "optimal",
      path: "/admin/security",
      color: "emerald",
      requiredRole: ["super"],
      requiredPermissions: ["user_management", "content_moderation"],
      minAccessLevel: "full",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Governance",
      description:
        "Comprehensive user management with advanced analytics and moderation tools",
      stats: "2,847 Users",
      status: "active",
      path: "/admin/users",
      color: "blue",
      requiredPermissions: ["user_management"],
      minAccessLevel: "limited",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Feature Control",
      description:
        "Advanced feature flag system with gradual rollouts and A/B testing capabilities",
      stats: "42 Flags Active",
      status: "active",
      path: "/admin/feature-flags",
      color: "amber",
      requiredRole: ["super", "content"],
      requiredPermissions: ["feature_flags"],
      minAccessLevel: "full",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Intelligence",
      description:
        "Real-time analytics, performance metrics, and revenue intelligence dashboards",
      stats: "12.4K Events",
      status: "processing",
      path: "/admin/analytics",
      color: "purple",
      requiredRole: ["super", "analytics"],
      requiredPermissions: ["analytics"],
      minAccessLevel: "limited",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Management",
      description:
        "Database operations, backup management, and data integrity monitoring",
      stats: "99.99% Uptime",
      status: "optimal",
      path: "/admin/database",
      color: "indigo",
      requiredRole: ["super"],
      minAccessLevel: "full",
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Infrastructure",
      description:
        "System health monitoring, performance metrics, and resource allocation",
      stats: "All Systems Go",
      status: "optimal",
      path: "/admin/infrastructure",
      color: "green",
      requiredRole: ["super"],
      minAccessLevel: "full",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Platform Config",
      description:
        "Global settings, third-party integrations, and system-wide configurations",
      stats: "23 Integrations",
      status: "active",
      path: "/admin/configuration",
      color: "cyan",
      requiredRole: ["super"],
      minAccessLevel: "full",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Audit & Compliance",
      description:
        "Activity logs, compliance reporting, and regulatory documentation",
      stats: "100% Compliant",
      status: "optimal",
      path: "/admin/compliance",
      color: "orange",
      requiredPermissions: ["content_moderation", "user_management"],
      minAccessLevel: "limited",
    },
  ];

  const systemMetrics = [
    { label: "API Response Time", value: "124ms", status: "good" },
    { label: "Database Latency", value: "8ms", status: "excellent" },
    {
      label: "Active Sessions",
      value: activeUsers.toLocaleString(),
      status: "normal",
    },
    { label: "Error Rate", value: "0.02%", status: "good" },
    { label: "Memory Usage", value: "64%", status: "warning" },
    { label: "CPU Load", value: "42%", status: "good" },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      optimal: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      active: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      processing: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      good: "text-emerald-400",
      excellent: "text-emerald-300",
      normal: "text-blue-400",
      warning: "text-amber-400",
      restricted: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    };
    return colors[status as keyof typeof colors] || colors.normal;
  };

  const getModuleColor = (color: string) => {
    const colors = {
      emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
      blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      amber: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
      purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
      indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
      green: "from-green-500/10 to-green-600/5 border-green-500/20",
      cyan: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
      orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
      gray: "from-gray-500/10 to-gray-600/5 border-gray-500/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const accessibleModules = getAccessibleModules();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Enhanced Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    GigUp Enterprise
                  </h1>
                  <p className="text-xs text-gray-400">Admin Portal</p>
                </div>
              </div>

              {isSignedIn && adminStatus?.isAdmin && (
                <div className="hidden md:flex items-center space-x-6 ml-8">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor("optimal")} border`}
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>System Optimal</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-gray-300">
                      {activeUsers.toLocaleString()}
                    </span>{" "}
                    active users
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor("active")} border`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{adminStatus.role} Admin</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <>
                  <div className="hidden sm:flex items-center space-x-3 text-right">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {adminStatus?.isAdmin
                          ? `${adminStatus.role} Administrator`
                          : "User"}
                      </p>
                    </div>
                  </div>

                  {adminStatus?.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 text-sm font-medium shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  <SignOutButton>
                    <button className="text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                      <Lock className="w-4 h-4" />
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 text-sm font-medium shadow-lg">
                    <Shield className="w-4 h-4" />
                    <span>Admin Access</span>
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm font-medium">
              Enterprise Administration Portal
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Platform
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Command Center
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive administration suite for monitoring, managing, and
            optimizing the GigUp platform ecosystem with enterprise-grade
            security and reliability.
          </p>
        </div>

        {/* Authentication Gateway */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Administrative Access
                </h2>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("optimal")} border`}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>System Ready</span>
                </div>
              </div>

              {!isSignedIn ? (
                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-8 h-8 text-blue-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-400 mb-1">
                          Authentication Required
                        </h3>
                        <p className="text-blue-300/80 text-sm">
                          Administrator credentials are required to access the
                          platform management console. Multi-factor
                          authentication is enforced for all administrative
                          sessions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <SignInButton mode="modal">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group">
                      <Shield className="w-5 h-5" />
                      <span>Authenticate as Administrator</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignInButton>
                </div>
              ) : !adminStatus?.isAdmin ? (
                <div className="space-y-6">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-400 mb-1">
                          Access Restricted
                        </h3>
                        <p className="text-amber-300/80 text-sm">
                          Your account does not have administrative privileges.
                          Please contact a system administrator if you believe
                          this is an error.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-gray-400 text-sm">
                    Signed in as {user.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-1">
                          Access Granted
                        </h3>
                        <p className="text-emerald-300/80 text-sm">
                          Authenticated as{" "}
                          <span className="font-semibold text-white">
                            {user.primaryEmailAddress?.emailAddress}
                          </span>
                          with{" "}
                          <span className="font-semibold text-white">
                            {adminStatus.role}
                          </span>{" "}
                          administrative privileges. Session is secured and
                          monitored.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/admin/dashboard"
                      className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-between shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <BarChart3 className="w-8 h-8 text-blue-200" />
                        <div className="text-left">
                          <div className="font-semibold text-lg">
                            Executive Dashboard
                          </div>
                          <div className="text-blue-200/80 text-sm">
                            Platform overview & analytics
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/admin/feature-flags"
                      className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-between shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <Zap className="w-8 h-8 text-purple-200" />
                        <div className="text-left">
                          <div className="font-semibold text-lg">
                            Feature Control
                          </div>
                          <div className="text-purple-200/80 text-sm">
                            Manage releases & flags
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-200 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Metrics - Only show for authorized admins */}
        {isSignedIn && adminStatus?.isAdmin && canViewMetrics && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              System Health
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {systemMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                >
                  <div
                    className={`text-2xl font-bold mb-1 ${getStatusColor(metric.status)}`}
                  >
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Modules Grid - Filtered by permissions */}
        {isSignedIn && adminStatus?.isAdmin && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Administration Modules
              </h3>
              <div className="text-gray-400 text-sm">
                {accessibleModules.length} of {adminModules.length} modules
                accessible
              </div>
            </div>

            {accessibleModules.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  No Accessible Modules
                </h4>
                <p className="text-gray-400">
                  Your current role and permissions don't grant access to any
                  administration modules.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {accessibleModules.map((module, index) => (
                  <Link
                    key={index}
                    href={module.path}
                    className={`group bg-gradient-to-br ${getModuleColor(module.color)} rounded-xl p-6 border transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br from-${module.color}-500/20 to-${module.color}-600/10`}
                      >
                        {module.icon}
                      </div>
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)} border`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            module.status === "optimal"
                              ? "bg-emerald-400"
                              : module.status === "active"
                                ? "bg-blue-400"
                                : "bg-purple-400"
                          }`}
                        ></div>
                        <span>{module.stats}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {module.description}
                    </p>

                    <div className="flex items-center space-x-1 mt-4 text-gray-500 group-hover:text-gray-400 transition-colors">
                      <span className="text-xs font-medium">Access Module</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity - Only show for admins */}
        {isSignedIn && adminStatus?.isAdmin && canViewActivity && (
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  action: "Feature flag updated",
                  user: "System",
                  time: "2 minutes ago",
                  type: "configuration",
                },
                {
                  action: "User session terminated",
                  user: "Security System",
                  time: "5 minutes ago",
                  type: "security",
                },
                {
                  action: "Database backup completed",
                  user: "Automation",
                  time: "12 minutes ago",
                  type: "maintenance",
                },
                {
                  action: "New admin user registered",
                  user: "System",
                  time: "1 hour ago",
                  type: "user",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "security"
                        ? "bg-red-400"
                        : activity.type === "configuration"
                          ? "bg-blue-400"
                          : activity.type === "maintenance"
                            ? "bg-amber-400"
                            : "bg-green-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {activity.action}
                    </div>
                    <div className="text-gray-400 text-sm">
                      By {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  GigUp Enterprise Administration
                </p>
                <p className="text-xs text-gray-500">
                  v2.1.0 • Production Environment
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>All Systems Operational</span>
              </div>
              <div>© 2024 GigUp Technologies</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
