// components/add-new-feature.tsx - UPDATED WITH useThemeColors
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Plus,
  Zap,
  Users,
  Target,
  BookTemplate,
  Sparkles,
  Globe,
  Crown,
  Star,
  TrendingUp,
  Palette,
  CheckCircle,
  XCircle,
  Clock,
  Rocket,
  Info,
  Shield,
  Layers,
  Filter,
  BarChart,
} from "lucide-react";
import { FEATURE_FLAGS_CONFIG, FeatureFlagKey } from "@/lib/featureFlags";
import { useThemeColors } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

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

const getAvailableTemplateCategories = (existingFlags: any[]) => {
  const existingFlagIds = new Set(existingFlags.map((flag) => flag.id));

  const templates = Object.entries(FEATURE_FLAGS_CONFIG) as [
    FeatureFlagKey,
    (typeof FEATURE_FLAGS_CONFIG)[FeatureFlagKey],
  ][];

  const availableTemplates = templates.filter(
    ([key]) => !existingFlagIds.has(key)
  );

  const categories: Record<string, typeof availableTemplates> = {};

  availableTemplates.forEach(([key, config]) => {
    const primaryRole = config.targetRoles?.[0] || "general";
    if (!categories[primaryRole]) {
      categories[primaryRole] = [];
    }
    categories[primaryRole].push([key, config]);
  });

  return categories;
};

export function AddNewFeature() {
  const { colors, isDarkMode } = useThemeColors();
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const existingFlags = useQuery(api.controllers.featureFlags.getFeatureFlags);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    targetUsers: "all" as "all" | "free" | "premium" | "pro" | "elite",
    targetRoles: [] as string[],
    rolloutPercentage: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FeatureFlagKey | "">(
    ""
  );
  const [showTemplates, setShowTemplates] = useState(true);
  const [availableTemplateCategories, setAvailableTemplateCategories] =
    useState<Record<string, any[]>>({});

  useEffect(() => {
    if (existingFlags) {
      const categories = getAvailableTemplateCategories(existingFlags);
      setAvailableTemplateCategories(categories);
    }
  }, [existingFlags]);

  const createFeature = async () => {
    if (!form.id || !form.name) return;

    setIsSubmitting(true);
    try {
      await setFlag({
        flagId: form.id,
        enabled: false,
        targetUsers: form.targetUsers,
        targetRoles: form.targetRoles,
        rolloutPercentage: form.rolloutPercentage,
      });

      setForm({
        id: "",
        name: "",
        description: "",
        targetUsers: "all",
        targetRoles: [],
        rolloutPercentage: 0,
      });
      setSelectedTemplate("");
      setShowTemplates(false);
    } catch (error) {
      console.error("Failed to create feature:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const applyTemplate = (templateKey: FeatureFlagKey) => {
    const template = FEATURE_FLAGS_CONFIG[templateKey];
    setSelectedTemplate(templateKey);
    setForm({
      id: template.id,
      name: template.name,
      description: template.description,
      targetUsers: template.targetUsers || "all",
      targetRoles: template.targetRoles || [],
      rolloutPercentage: template.rolloutPercentage || 0,
    });
  };

  const clearTemplate = () => {
    setSelectedTemplate("");
    setForm({
      id: "",
      name: "",
      description: "",
      targetUsers: "all",
      targetRoles: [],
      rolloutPercentage: 0,
    });
  };

  const totalTemplates = Object.keys(FEATURE_FLAGS_CONFIG).length;
  const availableTemplateCount = Object.values(
    availableTemplateCategories
  ).flat().length;
  const existingTemplateCount = totalTemplates - availableTemplateCount;

  // Fixed tier icons with proper typing
  const tierIcons: Record<string, React.ReactNode> = {
    all: <Globe className="h-4 w-4" />,
    free: <Users className="h-4 w-4" />,
    premium: <Sparkles className="h-4 w-4" />,
    pro: <Target className="h-4 w-4" />,
    elite: <Crown className="h-4 w-4" />,
  };

  const tierColors: Record<string, string> = {
    all: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    premium:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    pro: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    elite:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div
        className={cn(
          "rounded-xl p-8 border",
          colors.gradientSecondary,
          colors.cardBorder
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h2 className={cn("text-3xl font-bold", colors.text)}>
                Create New Feature
              </h2>
            </div>
            <p className={cn("text-lg mb-6 max-w-2xl", colors.textMuted)}>
              Launch features with precision control. Start with a template or
              build custom.
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div
                className={cn(
                  "flex justify-between text-sm mb-2",
                  colors.textMuted
                )}
              >
                <span>Template Coverage</span>
                <span>
                  {Math.round((existingTemplateCount / totalTemplates) * 100)}%
                </span>
              </div>
              <div
                className={cn(
                  "w-full rounded-full h-2.5",
                  colors.backgroundMuted
                )}
              >
                <div
                  className="bg-gradient-to-r from-green-500 to-orange-500 h-2.5 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(existingTemplateCount / totalTemplates) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hidden lg:block space-y-4">
            <div
              className={cn(
                "p-4 rounded-xl border shadow-sm",
                colors.card,
                colors.cardBorder
              )}
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {availableTemplateCount}
              </div>
              <div className={cn("text-sm", colors.textMuted)}>
                Templates Available
              </div>
            </div>
            <div
              className={cn(
                "p-4 rounded-xl border shadow-sm",
                colors.card,
                colors.cardBorder
              )}
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {existingTemplateCount}
              </div>
              <div className={cn("text-sm", colors.textMuted)}>
                Already Created
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      {showTemplates && availableTemplateCount > 0 && (
        <div
          className={cn(
            "rounded-xl border shadow-lg",
            colors.card,
            colors.cardBorder
          )}
        >
          <div className={cn("p-6 border-b", colors.border)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <BookTemplate className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className={cn("text-xl font-bold", colors.text)}>
                    Template Library
                  </h3>
                  <p className={cn("text-sm", colors.textMuted)}>
                    Pre-configured feature templates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className={cn(
                  "px-4 py-2 font-medium rounded-lg transition-colors",
                  colors.textMuted,
                  colors.hoverBg
                )}
              >
                Skip templates
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
            {Object.entries(availableTemplateCategories).map(
              ([category, templates]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h4
                      className={cn(
                        "text-lg font-bold capitalize",
                        colors.text
                      )}
                    >
                      {category === "general"
                        ? "Core Features"
                        : `${category.replace(/_/g, " ")} Features`}
                    </h4>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        colors.backgroundMuted,
                        colors.textSecondary
                      )}
                    >
                      {templates.length} available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {templates.map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => applyTemplate(key)}
                        className={cn(
                          "group p-5 rounded-xl border text-left transition-all duration-200",
                          selectedTemplate === key
                            ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-500 shadow-lg"
                            : cn(
                                "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md",
                                colors.hoverBg
                              )
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5
                              className={cn(
                                "font-bold text-lg mb-1",
                                selectedTemplate === key
                                  ? "text-orange-700 dark:text-orange-400"
                                  : colors.text
                              )}
                            >
                              {template.name}
                            </h5>
                            <p
                              className={cn(
                                "text-sm mb-3",
                                selectedTemplate === key
                                  ? "text-orange-600 dark:text-orange-300"
                                  : colors.textMuted
                              )}
                            >
                              {template.description}
                            </p>
                          </div>
                          {selectedTemplate === key && (
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                              selectedTemplate === key
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                                : tierColors[template.targetUsers]
                            )}
                          >
                            {tierIcons[template.targetUsers]}
                            {template.targetUsers}
                          </span>

                          <span className={cn("text-xs", colors.textMuted)}>
                            {template.targetRoles?.length || 0} roles
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {selectedTemplate && (
            <div
              className={cn(
                "p-6 border-t",
                "bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/10 dark:to-orange-900/10",
                "border-green-200 dark:border-green-800"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl shadow-sm",
                      colors.background
                    )}
                  >
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300">
                      Template applied:{" "}
                      {FEATURE_FLAGS_CONFIG[selectedTemplate].name}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Customize settings below or{" "}
                      <button
                        onClick={clearTemplate}
                        className="underline hover:text-green-800 dark:hover:text-green-200 font-medium"
                      >
                        clear template
                      </button>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("feature-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className={cn(
                    "px-4 py-2 font-medium rounded-lg transition-colors",
                    "text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                  )}
                >
                  Customize ↓
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Creation Form */}
      <div
        id="feature-form"
        className={cn(
          "rounded-xl border shadow-lg p-8",
          colors.card,
          colors.cardBorder
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={cn("text-2xl font-bold mb-2", colors.text)}>
              {selectedTemplate ? "Customize Feature" : "Create Feature"}
            </h3>
            <p className={colors.textMuted}>
              Define feature details and targeting rules
            </p>
          </div>

          {!showTemplates && availableTemplateCount > 0 && (
            <button
              onClick={() => setShowTemplates(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors",
                colors.backgroundMuted,
                colors.textSecondary,
                colors.hoverBg
              )}
            >
              <BookTemplate className="h-4 w-4" />
              Browse Templates ({availableTemplateCount})
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label
                  className={cn(
                    "block text-sm font-semibold mb-2",
                    colors.text
                  )}
                >
                  Feature ID *
                </label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      id: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                    }))
                  }
                  className={cn(
                    "w-full p-3.5 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all",
                    colors.backgroundMuted,
                    colors.border,
                    colors.text
                  )}
                  placeholder="vocal_warmups"
                />
                <p className={cn("text-xs mt-2", colors.textMuted)}>
                  Unique identifier (snake_case)
                </p>
              </div>

              <div>
                <label
                  className={cn(
                    "block text-sm font-semibold mb-2",
                    colors.text
                  )}
                >
                  Feature Name *
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
                  placeholder="Vocal Warmups"
                />
              </div>
            </div>

            <div>
              <label
                className={cn("block text-sm font-semibold mb-2", colors.text)}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className={cn(
                  "w-full h-full p-3.5 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none",
                  colors.backgroundMuted,
                  colors.border,
                  colors.text
                )}
                rows={4}
                placeholder="Describe what this feature does and who it's for..."
              />
            </div>
          </div>

          {/* Targeting Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label
                className={cn(
                  "block text-sm font-semibold mb-2 flex items-center gap-2",
                  colors.text
                )}
              >
                <Target className="h-4 w-4" />
                Target User Tier
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(["all", "free", "premium", "pro", "elite"] as const).map(
                  (tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, targetUsers: tier }))
                      }
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                        form.targetUsers === tier
                          ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-500 text-orange-700 dark:text-orange-400 shadow-sm"
                          : cn(
                              "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                              colors.backgroundMuted
                            )
                      )}
                    >
                      {tierIcons[tier]}
                      <span className="text-sm font-medium capitalize">
                        {tier}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label
                className={cn(
                  "block text-sm font-semibold mb-2 flex items-center gap-2",
                  colors.text
                )}
              >
                <TrendingUp className="h-4 w-4" />
                Initial Rollout
              </label>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
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
                        "w-full h-2.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500",
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

                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          rolloutPercentage: value,
                        }))
                      }
                      className={cn(
                        "py-2 rounded-lg text-sm font-medium",
                        form.rolloutPercentage === value
                          ? "bg-orange-500 text-white"
                          : cn(
                              "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                              colors.backgroundMuted
                            )
                      )}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Role Targeting */}
          <div className="space-y-4">
            <label
              className={cn(
                "block text-sm font-semibold mb-2 flex items-center gap-2",
                colors.text
              )}
            >
              <Users className="h-4 w-4" />
              Target Roles
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {userRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    form.targetRoles.includes(role)
                      ? "bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400"
                      : cn(
                          "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                          colors.backgroundMuted
                        )
                  )}
                >
                  <span className="text-sm capitalize">
                    {role.replace(/_/g, " ")}
                  </span>
                  {form.targetRoles.includes(role) ? (
                    <CheckCircle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                  ) : (
                    <div
                      className={cn(
                        "h-4 w-4 rounded border",
                        colors.borderSecondary
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
            <p className={cn("text-sm", colors.textMuted)}>
              {form.targetRoles.length} roles selected
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={createFeature}
              disabled={!form.id || !form.name || isSubmitting}
              className={cn(
                "w-full py-4 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3",
                "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Feature Flag...
                </>
              ) : selectedTemplate ? (
                <>
                  <Rocket className="h-5 w-5" />
                  Create Feature from Template
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create Custom Feature Flag
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div
        className={cn(
          "rounded-xl border p-8",
          colors.gradientSecondary,
          colors.cardBorder
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg w-fit">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className={cn("font-bold", colors.text)}>Gradual Rollout</h4>
            <p className={cn("text-sm", colors.textMuted)}>
              Release features gradually to monitor performance and user
              feedback.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className={cn("font-bold", colors.text)}>Precise Targeting</h4>
            <p className={cn("text-sm", colors.textMuted)}>
              Control which users see features based on role, tier, and
              behavior.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-fit">
              <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className={cn("font-bold", colors.text)}>
              Feature Consistency
            </h4>
            <p className={cn("text-sm", colors.textMuted)}>
              Templates ensure consistent naming and targeting across all
              features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
