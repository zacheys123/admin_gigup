"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useState } from "react";
import { FeatureFlagsManager } from "@/components/feature-flags-manager";
import { AddNewFeature } from "@/components/add-new-feature";
import { ReleaseHistory } from "@/components/release-history";
import { SystemHealth } from "@/components/system-health";
import { toast } from "sonner";

export default function SystemUpdates() {
  const { colors } = useThemeColors();
  const { initializeFlags } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState("feature-flags");
  const [isInitializing, setIsInitializing] = useState(false);

  const tabs = [
    { id: "feature-flags", name: "Feature Flags", icon: "🚀" },
    { id: "new-features", name: "Create Feature", icon: "🆕" },
    { id: "release-history", name: "Release History", icon: "📚" },
    { id: "system-health", name: "System Health", icon: "❤️" },
  ];

  const handleInitializeFlags = async () => {
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
            System Updates
          </h1>
          <p className={`text-lg ${colors.textMuted}`}>
            Manage feature releases and system configuration
          </p>
        </div>

        <button
          onClick={handleInitializeFlags}
          disabled={isInitializing}
          className={`mt-4 lg:mt-0 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200`}
        >
          {isInitializing ? "Initializing..." : "Initialize Feature Flags"}
        </button>
      </div>

      {/* Tabs */}
      <div
        className={`${colors.card} ${colors.cardBorder} border rounded-xl shadow-sm`}
      >
        <nav className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${
                  activeTab === tab.id
                    ? `border-blue-500 text-blue-600 ${colors.activeBg}`
                    : `border-transparent ${colors.text} ${colors.hoverBg}`
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "release-history" && <ReleaseHistory />}
          {activeTab === "system-health" && <SystemHealth />}
        </div>
      </div>
    </div>
  );
}
