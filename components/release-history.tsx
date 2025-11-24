"use client";

import { useThemeColors } from "@/hooks/useTheme";
import {
  Calendar,
  Users,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export function ReleaseHistory() {
  const { colors } = useThemeColors();

  const releases = [
    {
      id: 1,
      version: "v2.1.0",
      name: "Teacher Dashboard Launch",
      date: "2024-01-15",
      status: "completed",
      rollout: 100,
      description: "Full rollout of teacher dashboard to all users",
      impact: "high",
      usersAffected: "12,402",
    },
    {
      id: 2,
      version: "v2.0.5",
      name: "Booker Role Testing",
      date: "2024-01-10",
      status: "testing",
      rollout: 25,
      description: "Limited testing of booker role with select users",
      impact: "medium",
      usersAffected: "3,105",
    },
    {
      id: 3,
      version: "v2.0.0",
      name: "Platform Redesign",
      date: "2024-01-01",
      status: "completed",
      rollout: 100,
      description: "Complete platform redesign and feature restructure",
      impact: "high",
      usersAffected: "All",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "testing":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${colors.text}`}>Release History</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 ${colors.background} ${colors.border} border rounded-lg ${colors.hoverBg} transition-colors`}
          >
            Export
          </button>
          <button
            className={`px-4 py-2 ${colors.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity`}
          >
            New Release
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {releases.map((release) => (
          <div
            key={release.id}
            className={`${colors.card} ${colors.border} border rounded-xl p-6 hover:shadow-md transition-all`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {getStatusIcon(release.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-semibold text-lg ${colors.text}`}>
                        {release.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(release.impact)}`}
                      >
                        {release.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className={`text-sm ${colors.textMuted} mb-3`}>
                      {release.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={colors.textMuted}>{release.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className={colors.textMuted}>
                          {release.usersAffected} users
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span className={colors.textMuted}>
                          {release.rollout}% rollout
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className={`text-lg font-semibold ${colors.text}`}>
                    {release.rollout}%
                  </div>
                  <div className={`text-xs ${colors.textMuted}`}>Rollout</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    release.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : release.status === "testing"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {release.status.toUpperCase()}
                </div>
                <div className={`text-sm ${colors.textMuted}`}>
                  {release.version}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className={colors.textMuted}>Deployment Progress</span>
                <span className={colors.textMuted}>{release.rollout}%</span>
              </div>
              <div
                className={`w-full ${colors.backgroundMuted} rounded-full h-2`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    release.status === "completed"
                      ? "bg-green-500"
                      : release.status === "testing"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${release.rollout}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {releases.length === 0 && (
        <div
          className={`text-center py-12 ${colors.card} ${colors.border} border rounded-xl`}
        >
          <Calendar className={`h-12 w-12 ${colors.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
            No releases yet
          </h3>
          <p className={`text-sm ${colors.textMuted}`}>
            Create your first release to start deploying features
          </p>
        </div>
      )}
    </div>
  );
}
