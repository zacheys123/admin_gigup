// app/admin/feature-flags/page.tsx - UPDATED FOR FIXED SIDEBAR
"use client";

import { useState } from "react";
import {
  Plus,
  List,
  Shield,
  Zap,
  Palette,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AddNewFeature } from "@/components/add-new-feature";
import { FeatureFlagsManager } from "@/components/feature-flags-manager";
import { useThemeColors } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function FeatureFlagsPage() {
  const { colors } = useThemeColors();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Modern Header */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl p-8",
          "bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"
        )}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Feature Flags
              </h1>
              <p className="text-white/80">
                Control feature releases with precision
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
              <Zap className="h-4 w-4 inline mr-2" />
              Dynamic Rollout
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
              <Palette className="h-4 w-4 inline mr-2" />
              Role-Based Targeting
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
              <Sparkles className="h-4 w-4 inline mr-2" />
              A/B Testing
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Analytics
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div
          className={cn("flex gap-1 p-1 rounded-xl", colors.backgroundMuted)}
        >
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200",
              activeTab === "list"
                ? cn(colors.background, colors.text, "shadow-lg")
                : cn(colors.textMuted, "hover:text-orange-600")
            )}
          >
            <List className="h-5 w-5" />
            All Features
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200",
              activeTab === "create"
                ? cn(colors.background, "text-green-600", "shadow-lg")
                : cn(colors.textMuted, "hover:text-green-600")
            )}
          >
            <Plus className="h-5 w-5" />
            Create New
          </button>
        </div>

        <div
          className={cn("text-sm px-4 py-2 rounded-lg", colors.backgroundMuted)}
        >
          <span className={colors.textMuted}>
            {activeTab === "list"
              ? "Manage existing features"
              : "Create new feature flag"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === "list" ? <FeatureFlagsManager /> : <AddNewFeature />}
      </div>
    </div>
  );
}
