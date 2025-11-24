"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Database,
  Clock,
  Zap,
  Eye,
  Key,
  Server,
  Lock,
  Globe,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Code,
  GitBranch,
  Cloud,
  Smartphone,
  Monitor,
  Edit,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const systemFeatures = [
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description:
      "Multi-tier admin system with granular permissions for different admin roles and responsibilities.",
    capabilities: [
      "Super Admin",
      "Content Admin",
      "Support Admin",
      "Analytics Admin",
    ],
  },
  {
    icon: Database,
    title: "Real-time Data Management",
    description:
      "Live data synchronization with Convex backend for instant updates across all admin interfaces.",
    capabilities: [
      "Live Updates",
      "Offline Support",
      "Data Validation",
      "Backup Systems",
    ],
  },
  {
    icon: Zap,
    title: "Feature Flag System",
    description:
      "Dynamic feature management with targeted rollouts, A/B testing, and gradual deployment controls.",
    capabilities: [
      "Gradual Rollouts",
      "User Targeting",
      "A/B Testing",
      "Instant Toggles",
    ],
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Comprehensive analytics dashboard with real-time metrics, user behavior tracking, and performance insights.",
    capabilities: [
      "Real-time Metrics",
      "User Analytics",
      "Performance Tracking",
      "Custom Reports",
    ],
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Complete user lifecycle management with advanced filtering, bulk actions, and detailed user profiles.",
    capabilities: [
      "Bulk Operations",
      "Advanced Filtering",
      "User Profiles",
      "Activity Logs",
    ],
  },
  {
    icon: Settings,
    title: "System Configuration",
    description:
      "Centralized system settings with environment management and configuration presets.",
    capabilities: [
      "Environment Config",
      "Preset Management",
      "API Settings",
      "System Health",
    ],
  },
];

const technologyStack = [
  {
    category: "Frontend Framework",
    items: [
      { name: "Next.js 14", description: "React framework with App Router" },
      { name: "TypeScript", description: "Type-safe JavaScript" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    ],
  },
  {
    category: "Backend & Database",
    items: [
      { name: "Convex", description: "Real-time backend platform" },
      { name: "Clerk", description: "User authentication & management" },
      { name: "Sonner", description: "Toast notifications" },
    ],
  },
  {
    category: "Development Tools",
    items: [
      { name: "ESLint", description: "Code linting and quality" },
      { name: "Prettier", description: "Code formatting" },
      { name: "Git", description: "Version control" },
    ],
  },
];

const adminRoles = [
  {
    role: "Super Admin",
    icon: ShieldCheck,
    color: "from-purple-500 to-pink-500",
    permissions: [
      "Full system access",
      "User management",
      "Content moderation",
      "Billing management",
      "System configuration",
    ],
    description:
      "Complete administrative control over all platform features and settings.",
  },
  {
    role: "Content Admin",
    icon: Edit,
    color: "from-blue-500 to-cyan-500",
    permissions: [
      "Content management",
      "Feature flags",
      "User support",
      "Content moderation",
    ],
    description:
      "Manages platform content, features, and user-generated content moderation.",
  },
  {
    role: "Support Admin",
    icon: HelpCircle,
    color: "from-green-500 to-emerald-500",
    permissions: ["User support", "Content moderation", "Basic analytics"],
    description:
      "Focuses on user support, issue resolution, and content moderation tasks.",
  },
  {
    role: "Analytics Admin",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    permissions: ["Data analytics", "Reporting", "Performance metrics"],
    description:
      "Access to analytics, reports, and platform performance data only.",
  },
];

const systemRequirements = [
  {
    category: "Supported Browsers",
    requirements: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
    icon: Globe,
  },
  {
    category: "Device Support",
    requirements: ["Desktop computers", "Tablets", "Mobile devices"],
    icon: Smartphone,
  },
  {
    category: "Network",
    requirements: [
      "Internet connection required",
      "HTTPS encryption",
      "WebSocket support",
    ],
    icon: Cloud,
  },
  {
    category: "Performance",
    requirements: [
      "Modern JavaScript support",
      "CSS Grid/Flexbox",
      "ES6+ features",
    ],
    icon: Zap,
  },
];

export default function AdminAboutPage() {
  const { colors } = useThemeColors();
  const { isAdmin, isChecking, adminRole } = useAdminCheck();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [isAdmin, isChecking, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={`text-4xl font-bold ${colors.text}`}>
          Admin System Overview
        </h1>
        <p className={`text-xl ${colors.textMuted} max-w-3xl mx-auto`}>
          Comprehensive information about the Gigup Admin System, its
          capabilities, technology stack, and administrative roles.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/admin"
            className={`px-6 py-2 rounded-lg ${colors.primaryBg} ${colors.textInverted} hover:opacity-90 transition-opacity`}
          >
            Back to Dashboard
          </Link>
          <a
            href="/api/docs"
            className={`px-6 py-2 rounded-lg border ${colors.border} ${colors.text} hover:${colors.hoverBg} transition-colors`}
          >
            API Documentation
          </a>
        </div>
      </div>

      {/* System Overview */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
              Gigup Admin System
            </h2>
            <p className={`${colors.textMuted} mb-6 leading-relaxed`}>
              A comprehensive administrative platform built with modern web
              technologies to manage the Gigup talent booking ecosystem. The
              system provides real-time data management, advanced user controls,
              and scalable infrastructure for platform operations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className={colors.text}>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className={colors.text}>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className={colors.text}>Role-based Access</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className={colors.text}>Mobile Responsive</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <div className="text-center space-y-4">
              <Monitor className="h-16 w-16 mx-auto" />
              <h3 className="text-xl font-bold">Current Environment</h3>
              <div className="bg-white/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-semibold">2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Your Role:</span>
                  <span className="font-semibold capitalize">{adminRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <h2 className={`text-2xl font-bold ${colors.text} mb-8 text-center`}>
          System Features & Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-lg border ${colors.border} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className={`text-lg font-semibold ${colors.text}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-sm ${colors.textMuted} mb-4`}>
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.capabilities.map((capability, capIndex) => (
                    <div key={capIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className={`text-xs ${colors.textMuted}`}>
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Roles */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <h2 className={`text-2xl font-bold ${colors.text} mb-8 text-center`}>
          Admin Roles & Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-lg border ${colors.border} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`bg-gradient-to-r ${role.color} rounded-lg p-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text}`}>
                      {role.role}
                    </h3>
                    <p className={`text-sm ${colors.textMuted}`}>
                      {role.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {role.permissions.map((permission, permIndex) => (
                    <div key={permIndex} className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-green-500" />
                      <span className={`text-sm ${colors.text}`}>
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <h2 className={`text-2xl font-bold ${colors.text} mb-8 text-center`}>
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologyStack.map((stack, index) => (
            <div key={index} className="space-y-4">
              <h3
                className={`text-lg font-semibold ${colors.text} border-b ${colors.border} pb-2`}
              >
                {stack.category}
              </h3>
              <div className="space-y-3">
                {stack.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`p-3 rounded-lg ${colors.backgroundMuted}`}
                  >
                    <div className="font-medium text-sm mb-1">{item.name}</div>
                    <div className={`text-xs ${colors.textMuted}`}>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Requirements */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <h2 className={`text-2xl font-bold ${colors.text} mb-8 text-center`}>
          System Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemRequirements.map((requirement, index) => {
            const Icon = requirement.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-lg border ${colors.border} text-center`}
              >
                <Icon className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                <h3 className={`font-semibold ${colors.text} mb-4`}>
                  {requirement.category}
                </h3>
                <div className="space-y-2">
                  {requirement.requirements.map((req, reqIndex) => (
                    <div
                      key={reqIndex}
                      className={`text-sm ${colors.textMuted}`}
                    >
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support & Resources */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl p-8`}
      >
        <h2 className={`text-2xl font-bold ${colors.text} mb-6 text-center`}>
          Support & Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              Getting Help
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className={colors.text}>
                  Report issues to your system administrator
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-blue-500" />
                <span className={colors.text}>
                  System status and maintenance updates
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-500" />
                <span className={colors.text}>
                  Security and access control guidelines
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              Documentation
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-purple-500" />
                <span className={colors.text}>
                  API documentation and integration guides
                </span>
              </div>
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-orange-500" />
                <span className={colors.text}>
                  Development and deployment procedures
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className={colors.text}>
                  Change log and version history
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t ${colors.border}">
        <p className={`text-sm ${colors.textMuted}`}>
          Gigup Admin System v2.1.0 • Built with modern web technologies •
          Secure • Scalable • Maintainable
        </p>
        <p className={`text-xs ${colors.textMuted} mt-2`}>
          For technical support contact: admin-support@gigup.com
        </p>
      </div>
    </div>
  );
}
