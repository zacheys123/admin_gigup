"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useCallback } from "react";
import { useThemeColors } from "@/hooks/useTheme";
import {
  Search,
  Download,
  Upload,
  Edit,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  Target,
  Globe,
  Crown,
  Sparkles,
  Star,
  Zap,
  Filter,
  CheckCircle,
  AlertCircle,
  Shield,
  Rocket,
  X,
  Save,
  Plus,
  BarChart,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================
interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  targetUsers?: "all" | "free" | "premium" | "pro" | "elite";
  targetRoles?: string[];
  rolloutPercentage: number;
  createdAt: number;
  updatedAt: number;
}

interface EditFeatureModalProps {
  flag: FeatureFlag;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: {
    flagId: string;
    name: string;
    description?: string;
    targetUsers: "all" | "free" | "premium" | "pro" | "elite";
    targetRoles: string[];
    rolloutPercentage: number;
  }) => void;
}

// ==================== EDIT MODAL ====================
export function EditFeatureModal({
  flag,
  isOpen,
  onClose,
  onSave,
}: EditFeatureModalProps) {
  const { colors } = useThemeColors();
  const [form, setForm] = useState({
    name: flag.name,
    description: flag.description || "",
    targetUsers:
      flag.targetUsers ||
      ("all" as "all" | "free" | "premium" | "pro" | "elite"),
    targetRoles: flag.targetRoles || [],
    rolloutPercentage: flag.rolloutPercentage || 0,
  });

  const userRoles = [
    "all",
    "teacher",
    "instrumentalist",
    "vocalist",
    "dj",
    "mc",
    "individual_client",
    "event_planner_client",
    "venue_client",
    "corporate_client",
    "talent_agent",
    "booking_manager",
  ] as const;

  const tierIcons = {
    all: <Globe className="h-4 w-4" />,
    free: <Users className="h-4 w-4" />,
    premium: <Sparkles className="h-4 w-4" />,
    pro: <Target className="h-4 w-4" />,
    elite: <Crown className="h-4 w-4" />,
  };

  const tierColors = {
    all: "bg-blue-100 text-blue-800 border-blue-200",
    free: "bg-gray-100 text-gray-800 border-gray-200",
    premium: "bg-purple-100 text-purple-800 border-purple-200",
    pro: "bg-green-100 text-green-800 border-green-200",
    elite: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const darkTierColors = {
    all: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    free: "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    premium:
      "dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    pro: "dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    elite: "dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  };

  const handleSave = () => {
    onSave({
      flagId: flag.id,
      name: form.name,
      description: form.description,
      targetUsers: form.targetUsers,
      targetRoles: form.targetRoles,
      rolloutPercentage: form.rolloutPercentage,
    });
    onClose();
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl",
          colors.background,
          colors.border,
          "border"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b",
            colors.border
          )}
        >
          <div>
            <h2 className={cn("text-2xl font-bold", colors.text)}>
              Edit Feature
            </h2>
            <p className={cn("text-sm mt-1", colors.textMuted)}>
              ID: {flag.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn("p-2 rounded-lg transition-colors", colors.hoverBg)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label
                className={cn("block text-sm font-semibold mb-3", colors.text)}
              >
                Feature Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className={cn(
                  "w-full p-3.5 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all",
                  colors.backgroundMuted,
                  colors.border,
                  colors.text
                )}
              />
            </div>

            <div>
              <label
                className={cn("block text-sm font-semibold mb-3", colors.text)}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className={cn(
                  "w-full p-3.5 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none",
                  colors.backgroundMuted,
                  colors.border,
                  colors.text
                )}
                placeholder="Describe what this feature does..."
              />
            </div>
          </div>

          {/* Targeting Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                className={cn(
                  "block text-sm font-semibold mb-3 flex items-center gap-2",
                  colors.text
                )}
              >
                <Target className="h-4 w-4" />
                Target User Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["all", "free", "premium", "pro", "elite"] as const).map(
                  (tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, targetUsers: tier }))
                      }
                      className={cn(
                        "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                        form.targetUsers === tier
                          ? cn(
                              tierColors[tier],
                              darkTierColors[tier],
                              "shadow-sm"
                            )
                          : cn(
                              "border-gray-300 dark:border-gray-700",
                              colors.hoverBg
                            )
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          form.targetUsers === tier
                            ? "bg-white dark:bg-gray-800"
                            : colors.backgroundMuted
                        )}
                      >
                        {tierIcons[tier]}
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {tier}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label
                className={cn("block text-sm font-semibold mb-3", colors.text)}
              >
                Rollout Percentage
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={cn("text-3xl font-bold", colors.primary)}>
                    {form.rolloutPercentage}%
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={form.rolloutPercentage}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          rolloutPercentage: parseInt(e.target.value),
                        }))
                      }
                      className={cn(
                        "w-full h-2 rounded-lg appearance-none cursor-pointer",
                        "[&::-webkit-slider-thumb]:appearance-none",
                        "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                        "[&::-webkit-slider-thumb]:rounded-full",
                        "[&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-red-500",
                        colors.backgroundMuted
                      )}
                    />
                    <div
                      className={cn(
                        "flex justify-between text-xs mt-2",
                        colors.textMuted
                      )}
                    >
                      {[0, 25, 50, 75, 100].map((value) => (
                        <span key={value}>{value}%</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Targeting */}
          <div>
            <label
              className={cn(
                "block text-sm font-semibold mb-3 flex items-center gap-2",
                colors.text
              )}
            >
              <Users className="h-4 w-4" />
              Target Roles ({form.targetRoles.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 rounded-xl border border-gray-300 dark:border-gray-700">
              {userRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    form.targetRoles.includes(role)
                      ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700"
                      : cn(
                          "border-gray-300 dark:border-gray-700",
                          colors.hoverBg
                        )
                  )}
                >
                  <span className="text-sm capitalize">
                    {role.replace(/_/g, " ")}
                  </span>
                  {form.targetRoles.includes(role) ? (
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <div
                      className={cn("h-4 w-4 rounded border", colors.border)}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn("flex gap-3 justify-end p-6 border-t", colors.border)}
        >
          <button
            onClick={onClose}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-colors",
              colors.border,
              colors.hoverBg
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeatureFlagsManager() {
  const { colors, isDarkMode } = useThemeColors();

  // ALL HOOKS MUST BE CALLED AT THE TOP, BEFORE ANY CONDITIONAL LOGIC
  const flags = useQuery(
    api.controllers.featureFlags.getFeatureFlags
  ) as FeatureFlag[];
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const updateFlag = useMutation(
    api.controllers.featureFlags.updateFeatureFlag
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Tier icons and colors - these are NOT hooks, they're just objects
  const tierIcons = {
    all: <Globe className="h-4 w-4" />,
    free: <Users className="h-4 w-4" />,
    premium: <Sparkles className="h-4 w-4" />,
    pro: <Target className="h-4 w-4" />,
    elite: <Crown className="h-4 w-4" />,
  };

  const tierColors = {
    all: "bg-blue-100 text-blue-800 border-blue-200",
    free: "bg-gray-100 text-gray-800 border-gray-200",
    premium: "bg-purple-100 text-purple-800 border-purple-200",
    pro: "bg-green-100 text-green-800 border-green-200",
    elite: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const darkTierColors = {
    all: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    free: "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    premium:
      "dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    pro: "dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    elite: "dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  };

  // useMemo hooks - these MUST be called on every render
  const filteredFlags = useMemo(() => {
    if (!flags) return [];
    return flags.filter((flag) => {
      const targetUsers = flag.targetUsers || "all";
      const matchesSearch =
        flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flag.description &&
          flag.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "enabled" && flag.enabled) ||
        (statusFilter === "disabled" && !flag.enabled);
      const matchesTier = tierFilter === "all" || targetUsers === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [flags, searchTerm, statusFilter, tierFilter]);

  const stats = useMemo(() => {
    if (!flags) {
      return {
        enabledCount: 0,
        disabledCount: 0,
        avgRollout: 0,
        tierStats: {},
      };
    }
    const enabledCount = flags.filter((f) => f.enabled).length;
    const disabledCount = flags.length - enabledCount;
    const avgRollout = Math.round(
      flags.reduce((sum, flag) => sum + (flag.rolloutPercentage || 0), 0) /
        flags.length
    );
    const tierStats = flags.reduce(
      (acc, flag) => {
        const tier = flag.targetUsers || "all";
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { enabledCount, disabledCount, avgRollout, tierStats };
  }, [flags]);

  // useCallback for event handlers
  const handleEdit = useCallback((flag: FeatureFlag) => {
    setEditingFlag(flag);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (updates: any) => {
      try {
        await updateFlag(updates);
      } catch (error) {
        console.error("Failed to update feature flag:", error);
      }
    },
    [updateFlag]
  );

  // Now you can check for loading state
  if (!flags) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className={cn("text-lg", colors.textMuted)}>
            Loading feature flags...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={cn(
            "rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl",
            colors.card,
            colors.cardBorder
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {stats.enabledCount}
              </div>
              <div className={cn("text-sm mt-2", colors.textMuted)}>
                Live Features
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
              <Eye className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(stats.enabledCount / flags.length) * 100}%`,
                }}
              />
            </div>
            <span className={cn("text-xs font-medium", colors.textMuted)}>
              {Math.round((stats.enabledCount / flags.length) * 100)}%
            </span>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl",
            colors.card,
            colors.cardBorder
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.disabledCount}
              </div>
              <div className={cn("text-sm mt-2", colors.textMuted)}>
                Draft Features
              </div>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <EyeOff className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transition-all duration-500"
                style={{
                  width: `${(stats.disabledCount / flags.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl",
            colors.card,
            colors.cardBorder
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {flags.length}
              </div>
              <div className={cn("text-sm mt-2", colors.textMuted)}>
                Total Features
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className={cn("mt-4 text-sm", colors.textMuted)}>
            <span className="font-medium text-green-600 dark:text-green-400">
              {Math.round((stats.enabledCount / flags.length) * 100)}%
            </span>{" "}
            adoption rate
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl",
            colors.card,
            colors.cardBorder
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.avgRollout}%
              </div>
              <div className={cn("text-sm mt-2", colors.textMuted)}>
                Avg. Rollout
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className={cn("mt-4 text-sm", colors.textMuted)}>
            Average rollout percentage
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={cn(
          "rounded-2xl p-6 shadow-lg border",
          colors.card,
          colors.cardBorder
        )}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search
              className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5",
                colors.textMuted
              )}
            />
            <input
              type="text"
              placeholder="Search features by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all",
                colors.backgroundMuted,
                colors.border,
                colors.text
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <Filter className={cn("h-5 w-5", colors.textMuted)} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={cn(
                  "px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                  colors.backgroundMuted,
                  colors.border,
                  colors.text
                )}
              >
                <option value="all">All Status</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                  colors.backgroundMuted,
                  colors.border,
                  colors.text
                )}
              >
                <option value="all">All Tiers</option>
                {Object.keys(tierIcons).map((tier) => (
                  <option key={tier} value={tier}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                className={cn(
                  "px-4 py-3.5 rounded-xl transition-all hover:shadow-md",
                  colors.backgroundMuted,
                  colors.border,
                  colors.hoverBg
                )}
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "px-4 py-3.5 rounded-xl transition-all hover:shadow-md",
                  colors.backgroundMuted,
                  colors.border,
                  colors.hoverBg
                )}
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tier Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setTierFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105",
              tierFilter === "all"
                ? cn(tierColors.all, darkTierColors.all, "shadow-md")
                : cn(colors.backgroundMuted, colors.textMuted, colors.hoverBg)
            )}
          >
            <Globe className="h-3 w-3" />
            All Tiers
          </button>
          {Object.entries(stats.tierStats).map(([tier, count]) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105",
                tierFilter === tier
                  ? cn(
                      tierColors[tier as keyof typeof tierColors],
                      darkTierColors[tier as keyof typeof darkTierColors],
                      "shadow-md"
                    )
                  : cn(colors.backgroundMuted, colors.textMuted, colors.hoverBg)
              )}
            >
              {tierIcons[tier as keyof typeof tierIcons]}
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20 dark:bg-black/20">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFlags.map((flag) => {
          const targetUsers = flag.targetUsers || "all";
          const Icon = tierIcons[targetUsers as keyof typeof tierIcons];
          const colorClass = tierColors[targetUsers as keyof typeof tierColors];
          const darkColorClass =
            darkTierColors[targetUsers as keyof typeof darkTierColors];
          const rolloutPercentage = flag.rolloutPercentage || 0;

          return (
            <div
              key={flag.id}
              className={cn(
                "group rounded-2xl p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
                colors.card,
                colors.cardBorder,
                "hover:scale-[1.02]"
              )}
            >
              {/* Status Indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2",
                  flag.enabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                )}
              >
                {flag.enabled ? (
                  <>
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </>
                ) : (
                  "DRAFT"
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => handleEdit(flag)}
                className={cn(
                  "absolute top-4 left-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200",
                  "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg",
                  colors.border
                )}
                title="Edit feature"
              >
                <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Feature Header */}
              <div className="flex items-start gap-4 mb-5 pr-20">
                <div
                  className={cn(
                    "p-3 rounded-xl flex-shrink-0",
                    flag.enabled
                      ? "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                      : colors.backgroundMuted
                  )}
                >
                  <Settings
                    className={
                      flag.enabled ? "text-orange-500" : colors.textMuted
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-bold text-lg truncate mb-2",
                      colors.text
                    )}
                  >
                    {flag.name}
                  </h3>
                  <p className={cn("text-sm line-clamp-2", colors.textMuted)}>
                    {flag.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4 mb-6">
                {/* Tier & Rollout */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                      colorClass,
                      darkColorClass
                    )}
                  >
                    {Icon}
                    {targetUsers}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className={cn("text-lg font-bold", colors.text)}>
                      {rolloutPercentage}%
                    </div>
                    <div className="w-28">
                      <div
                        className={cn(
                          "w-full h-2 rounded-full overflow-hidden",
                          colors.backgroundMuted
                        )}
                      >
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            rolloutPercentage < 30
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : rolloutPercentage < 70
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                          )}
                          style={{ width: `${rolloutPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Roles */}
                {flag.targetRoles && flag.targetRoles.length > 0 && (
                  <div>
                    <div
                      className={cn(
                        "text-xs font-medium mb-2 flex items-center gap-2",
                        colors.textMuted
                      )}
                    >
                      <Users className="h-3 w-3" />
                      Target Roles
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flag.targetRoles.slice(0, 3).map((role) => (
                        <span
                          key={role}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs truncate max-w-[120px]",
                            "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
                            "border border-gray-200 dark:border-gray-700"
                          )}
                        >
                          {role.replace(/_/g, " ")}
                        </span>
                      ))}
                      {flag.targetRoles.length > 3 && (
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs",
                            colors.backgroundMuted,
                            colors.textMuted
                          )}
                        >
                          +{flag.targetRoles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() =>
                    setFlag({
                      flagId: flag.id,
                      enabled: !flag.enabled,
                    })
                  }
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md",
                    flag.enabled
                      ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 hover:from-red-100 hover:to-orange-100 dark:from-red-900/10 dark:to-orange-900/10 dark:text-red-400"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:text-green-400"
                  )}
                >
                  {flag.enabled ? "Disable Feature" : "Enable Feature"}
                </button>

                {flag.enabled && rolloutPercentage < 100 && (
                  <button
                    onClick={() =>
                      setFlag({
                        flagId: flag.id,
                        rolloutPercentage: Math.min(
                          100,
                          rolloutPercentage + 10
                        ),
                      })
                    }
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md",
                      "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700",
                      "hover:from-orange-100 hover:to-red-100",
                      "dark:from-orange-900/10 dark:to-red-900/10 dark:text-orange-400"
                    )}
                  >
                    +10%
                  </button>
                )}
              </div>

              {/* Quick Rollout to 100% */}
              {flag.enabled && rolloutPercentage < 100 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      setFlag({
                        flagId: flag.id,
                        rolloutPercentage: 100,
                      })
                    }
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    Rollout to 100%
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFlags.length === 0 && (
        <div className="text-center py-16">
          <div
            className={cn(
              "p-8 rounded-2xl inline-block mb-6",
              "bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800",
              "border border-gray-200 dark:border-gray-700"
            )}
          >
            <Search className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h3 className={cn("text-2xl font-bold mb-3", colors.text)}>
            No features found
          </h3>
          <p className={cn("text-lg mb-6 max-w-md mx-auto", colors.textMuted)}>
            {searchTerm || statusFilter !== "all" || tierFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No feature flags have been created yet"}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTierFilter("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 font-medium transition-all"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingFlag && (
        <EditFeatureModal
          flag={editingFlag}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFlag(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
