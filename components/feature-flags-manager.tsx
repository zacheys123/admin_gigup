"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useThemeColors } from "@/hooks/useTheme";
import { Search, Filter, Download, Upload } from "lucide-react";

export function FeatureFlagsManager() {
  const { colors } = useThemeColors();
  const flags = useQuery(api.controllers.featureFlags.getFeatureFlags);
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");

  if (!flags) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`text-lg ${colors.textMuted}`}>
          Loading feature flags...
        </div>
      </div>
    );
  }

  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flag.description &&
        flag.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "enabled" && flag.enabled) ||
      (statusFilter === "disabled" && !flag.enabled);
    return matchesSearch && matchesStatus;
  });

  const enabledCount = flags.filter((f) => f.enabled).length;
  const disabledCount = flags.length - enabledCount;

  return (
    <div>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`${colors.card} border ${colors.border} rounded-xl p-4`}
        >
          <div className={`text-2xl font-bold ${colors.text}`}>
            {enabledCount}
          </div>
          <div className={`text-sm ${colors.textMuted}`}>Live Features</div>
        </div>
        <div
          className={`${colors.card} border ${colors.border} rounded-xl p-4`}
        >
          <div className={`text-2xl font-bold ${colors.text}`}>
            {disabledCount}
          </div>
          <div className={`text-sm ${colors.textMuted}`}>Draft Features</div>
        </div>
        <div
          className={`${colors.card} border ${colors.border} rounded-xl p-4`}
        >
          <div className={`text-2xl font-bold ${colors.text}`}>
            {flags.length}
          </div>
          <div className={`text-sm ${colors.textMuted}`}>Total Features</div>
        </div>
        <div
          className={`${colors.card} border ${colors.border} rounded-xl p-4`}
        >
          <div className={`text-2xl font-bold ${colors.text}`}>
            {Math.round((enabledCount / flags.length) * 100)}%
          </div>
          <div className={`text-sm ${colors.textMuted}`}>Adoption Rate</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.textMuted}`}
          />
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className={`px-4 py-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
        >
          <option value="all">All Status</option>
          <option value="enabled">Enabled Only</option>
          <option value="disabled">Disabled Only</option>
        </select>
        <div className="flex gap-2">
          <button
            className={`px-4 py-3 ${colors.background} ${colors.border} border rounded-lg ${colors.hoverBg} transition-colors`}
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            className={`px-4 py-3 ${colors.background} ${colors.border} border rounded-lg ${colors.hoverBg} transition-colors`}
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFlags.map((flag) => (
          <div
            key={flag.id}
            className={`${colors.card} ${colors.border} border rounded-xl p-5 hover:shadow-md transition-all`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className={`font-semibold text-lg ${colors.text}`}>
                  {flag.name}
                </h3>
                <p className={`text-sm ${colors.textMuted} mt-1`}>
                  {flag.description}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  flag.enabled
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {flag.enabled ? "LIVE" : "DRAFT"}
              </span>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${colors.textMuted}`}>
                  Target:
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${colors.infoBg} ${colors.infoText}`}
                >
                  {flag.targetUsers}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${colors.textMuted}`}>
                  Roles:
                </span>
                <span className={`text-xs ${colors.textMuted}`}>
                  {flag.targetRoles?.join(", ") || "All roles"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${colors.textMuted}`}>
                  Rollout:
                </span>
                <div className="flex-1">
                  <div
                    className={`w-full ${colors.backgroundMuted} rounded-full h-2`}
                  >
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${flag.rolloutPercentage}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs ${colors.textMuted} mt-1`}>
                    {flag.rolloutPercentage}% of users
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFlag({
                    flagId: flag.id,
                    enabled: !flag.enabled,
                  })
                }
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  flag.enabled
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {flag.enabled ? "Disable" : "Enable"}
              </button>

              {flag.enabled && (
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setFlag({
                        flagId: flag.id,
                        rolloutPercentage: Math.max(
                          0,
                          flag.rolloutPercentage - 25
                        ),
                      })
                    }
                    className={`px-3 py-2 ${colors.backgroundMuted} ${colors.text} rounded-lg ${colors.hoverBg} text-sm`}
                  >
                    -25%
                  </button>
                  <button
                    onClick={() =>
                      setFlag({
                        flagId: flag.id,
                        rolloutPercentage: Math.min(
                          100,
                          flag.rolloutPercentage + 25
                        ),
                      })
                    }
                    className={`px-3 py-2 ${colors.backgroundMuted} ${colors.text} rounded-lg ${colors.hoverBg} text-sm`}
                  >
                    +25%
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {flag.enabled && flag.rolloutPercentage < 100 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() =>
                    setFlag({
                      flagId: flag.id,
                      rolloutPercentage: 100,
                    })
                  }
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 text-sm font-medium transition-all"
                >
                  Rollout to 100%
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFlags.length === 0 && (
        <div className="text-center py-12">
          <div className={`text-lg ${colors.textMuted}`}>No features found</div>
          <div className={`text-sm ${colors.textMuted} mt-2`}>
            Try adjusting your search or filters
          </div>
        </div>
      )}
    </div>
  );
}
