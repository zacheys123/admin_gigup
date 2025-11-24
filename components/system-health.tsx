"use client";

import { useThemeColors } from "@/hooks/useTheme";
import {
  Activity,
  Database,
  Cpu,
  Shield,
  Clock,
  AlertTriangle,
  Users,
} from "lucide-react";

export function SystemHealth() {
  const { colors } = useThemeColors();

  const metrics = [
    {
      name: "API Response Time",
      value: "142ms",
      status: "healthy",
      icon: Activity,
      trend: "down",
    },
    {
      name: "Database Connections",
      value: "45/100",
      status: "healthy",
      icon: Database,
      trend: "stable",
    },
    {
      name: "Error Rate",
      value: "0.2%",
      status: "healthy",
      icon: AlertTriangle,
      trend: "down",
    },
    {
      name: "Active Users",
      value: "1,234",
      status: "healthy",
      icon: Users,
      trend: "up",
    },
    {
      name: "CPU Usage",
      value: "32%",
      status: "healthy",
      icon: Cpu,
      trend: "stable",
    },
    {
      name: "Memory Usage",
      value: "68%",
      status: "warning",
      icon: Shield,
      trend: "up",
    },
  ];

  const systemAlerts = [
    {
      type: "info",
      message: "Scheduled maintenance in 2 hours",
      time: "10 minutes ago",
    },
    {
      type: "warning",
      message: "Memory usage above 65%",
      time: "30 minutes ago",
    },
    {
      type: "success",
      message: "Backup completed successfully",
      time: "2 hours ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500 bg-green-100 border-green-200";
      case "warning":
        return "text-amber-500 bg-amber-100 border-amber-200";
      case "critical":
        return "text-red-500 bg-red-100 border-red-200";
      default:
        return "text-gray-500 bg-gray-100 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "→";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${colors.text}`}>System Health</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-sm ${colors.textMuted}`}>
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              className={`${colors.card} ${colors.border} border rounded-xl p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-sm font-medium ${getStatusColor(metric.status)} px-2 py-1 rounded-full border`}
                >
                  {metric.status.toUpperCase()}
                </span>
              </div>

              <h3 className={`font-semibold ${colors.text} mb-2`}>
                {metric.name}
              </h3>
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-bold ${colors.text}`}>
                  {metric.value}
                </div>
                <div className={`text-lg ${colors.textMuted}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>

              <div className="mt-4">
                <div
                  className={`w-full ${colors.backgroundMuted} rounded-full h-2`}
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      metric.status === "healthy"
                        ? "bg-green-500"
                        : metric.status === "warning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: metric.name.includes("Usage")
                        ? metric.value.replace("%", "") + "%"
                        : "100%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Alerts */}
      <div className={`${colors.card} ${colors.border} border rounded-xl p-6`}>
        <h3
          className={`text-xl font-semibold ${colors.text} mb-6 flex items-center gap-2`}
        >
          <Shield className="h-5 w-5" />
          System Alerts
        </h3>

        <div className="space-y-4">
          {systemAlerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                alert.type === "info"
                  ? `${colors.infoBg} ${colors.infoBorder}`
                  : alert.type === "warning"
                    ? `${colors.warningBg} ${colors.warningBorder}`
                    : `${colors.successBg} ${colors.successBorder}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    alert.type === "info"
                      ? "bg-blue-500"
                      : alert.type === "warning"
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                ></div>
                <div>
                  <p
                    className={`font-medium ${
                      alert.type === "info"
                        ? colors.infoText
                        : alert.type === "warning"
                          ? colors.warningText
                          : colors.successText
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className={`text-xs ${colors.textMuted} mt-1`}>
                    <Clock className="inline h-3 w-3 mr-1" />
                    {alert.time}
                  </p>
                </div>
              </div>
              <button
                className={`px-3 py-1 text-xs rounded-lg ${
                  alert.type === "info"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : alert.type === "warning"
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                } transition-colors`}
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>

        {/* No Alerts State */}
        {systemAlerts.length === 0 && (
          <div className="text-center py-8">
            <Shield className={`h-12 w-12 ${colors.textMuted} mx-auto mb-4`} />
            <h4 className={`font-semibold ${colors.text} mb-2`}>
              No Active Alerts
            </h4>
            <p className={`text-sm ${colors.textMuted}`}>
              All systems are running smoothly
            </p>
          </div>
        )}
      </div>

      {/* Uptime Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${colors.card} ${colors.border} border rounded-xl p-6 text-center`}
        >
          <div className={`text-3xl font-bold ${colors.text} mb-2`}>99.9%</div>
          <div className={`text-sm ${colors.textMuted}`}>Uptime (30 days)</div>
        </div>
        <div
          className={`${colors.card} ${colors.border} border rounded-xl p-6 text-center`}
        >
          <div className={`text-3xl font-bold ${colors.text} mb-2`}>0</div>
          <div className={`text-sm ${colors.textMuted}`}>Incidents (Today)</div>
        </div>
        <div
          className={`${colors.card} ${colors.border} border rounded-xl p-6 text-center`}
        >
          <div className={`text-3xl font-bold ${colors.text} mb-2`}>2.1s</div>
          <div className={`text-sm ${colors.textMuted}`}>Avg Response Time</div>
        </div>
      </div>
    </div>
  );
}
