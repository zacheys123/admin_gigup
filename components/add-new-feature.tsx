"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useThemeColors } from "@/hooks/useTheme";
import { Plus, Zap, Users, Target, BookTemplate, Sparkles } from "lucide-react";
import { FEATURE_FLAGS_CONFIG, FeatureFlagKey } from "@/lib/featureFlags";

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

// Group templates by role for better organization
const getTemplateCategories = () => {
  const templates = Object.entries(FEATURE_FLAGS_CONFIG) as [
    FeatureFlagKey,
    (typeof FEATURE_FLAGS_CONFIG)[FeatureFlagKey],
  ][];

  const categories: Record<string, typeof templates> = {};

  templates.forEach(([key, config]) => {
    const primaryRole = config.targetRoles?.[0] || "general";
    if (!categories[primaryRole]) {
      categories[primaryRole] = [];
    }
    categories[primaryRole].push([key, config]);
  });

  return categories;
};

export function AddNewFeature() {
  const { colors } = useThemeColors();
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    targetUsers: "all" as "all" | "free" | "premium" | "pro" | "elite", // Add all possible values
    targetRoles: [] as string[],
    rolloutPercentage: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FeatureFlagKey | "">(
    ""
  );
  const [showTemplates, setShowTemplates] = useState(true);

  const templateCategories = getTemplateCategories();

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

      // Show success message
    } catch (error) {
      // Show error message
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.primaryBg} mb-4`}
        >
          <Plus className="h-8 w-8 text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
          Create New Feature
        </h2>
        <p className={`text-lg ${colors.textMuted}`}>
          Start from a template or create a custom feature flag
        </p>
      </div>

      {/* Template Selection Section */}
      {showTemplates && (
        <div
          className={`${colors.card} ${colors.border} border rounded-xl p-6 mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${colors.text} flex items-center gap-2`}
            >
              <BookTemplate className="h-5 w-5" />
              Start from Template
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className={`text-sm ${colors.textMuted} hover:${colors.text} transition-colors`}
            >
              Skip templates
            </button>
          </div>

          <p className={`text-sm ${colors.textMuted} mb-4`}>
            Choose a pre-configured template for consistent feature targeting
          </p>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(templateCategories).map(([category, templates]) => (
              <div key={category}>
                <h4 className={`font-medium ${colors.text} mb-2 capitalize`}>
                  {category === "general"
                    ? "General Features"
                    : `${category} Features`}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selectedTemplate === key
                          ? `${colors.primaryBg} ${colors.primaryBg} border-2`
                          : `${colors.border} ${colors.hoverBg} hover:border-blue-300`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5
                          className={`font-semibold ${
                            selectedTemplate === key
                              ? "text-white"
                              : colors.text
                          }`}
                        >
                          {template.name}
                        </h5>
                        {selectedTemplate === key && (
                          <Sparkles className="h-4 w-4 text-yellow-300" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          selectedTemplate === key
                            ? "text-blue-100"
                            : colors.textMuted
                        } mb-2`}
                      >
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded ${
                            selectedTemplate === key
                              ? "bg-blue-600 text-white"
                              : `${colors.infoBg} ${colors.infoText}`
                          }`}
                        >
                          {template.targetUsers}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            selectedTemplate === key
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {template.targetRoles?.join(", ") || "all roles"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div
              className={
                "mt-4 p-4  border border-green-200 dark:border-green-800 rounded-lg" +
                colors.successBg
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={" text-sm" + colors.warning}>
                    <strong className={colors.textMuted}>
                      Template applied:
                    </strong>{" "}
                    {FEATURE_FLAGS_CONFIG[selectedTemplate].name}
                  </p>
                  <p className="text-red-600 dark:text-red-300 text-xs">
                    You can customize the settings below
                  </p>
                </div>
                <button
                  onClick={clearTemplate}
                  className="text-red-700 dark:text-red-300 hover:text-green-900 dark:hover:text-green-100 text-sm"
                >
                  Clear template
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Creation Section */}
      <div className={`${colors.card} ${colors.border} border rounded-xl p-8`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${colors.text}`}>
            {selectedTemplate ? "Customize Feature" : "Create Custom Feature"}
          </h3>
          {!showTemplates && (
            <button
              onClick={() => setShowTemplates(true)}
              className={`flex items-center gap-2 text-sm ${colors.primary} hover:underline`}
            >
              <BookTemplate className="h-4 w-4" />
              Browse templates
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-sm font-medium ${colors.text} mb-2`}
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
                className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
                placeholder="vocal_warmups"
              />
              <p className={`text-xs ${colors.textMuted} mt-1`}>
                Unique identifier (auto-formatted to snake_case)
              </p>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${colors.text} mb-2`}
              >
                Feature Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
                placeholder="Vocal Warmups"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
              rows={3}
              placeholder="Describe what this feature does and who it's for..."
            />
          </div>

          {/* Targeting Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                className={`block text-sm font-medium ${colors.text} mb-4 flex items-center gap-2`}
              >
                <Target className="h-4 w-4" />
                Target User Tier
              </label>
              <select
                value={form.targetUsers}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    targetUsers: e.target.value as
                      | "all"
                      | "free"
                      | "premium"
                      | "pro" // ✅ Correct type
                      | "elite",
                  }))
                }
                className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
              >
                <option value="all">All Users</option>
                <option value="free">Free Tier Only</option>
                <option value="premium">Premium Tier Only</option>
                <option value="pro">Pro Tier Only</option>
                <option value="elite">Elite Tier Only</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${colors.text} mb-4 flex items-center gap-2`}
              >
                <Zap className="h-4 w-4" />
                Initial Rollout: {form.rolloutPercentage}%
              </label>
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
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Role Targeting */}
          <div>
            <label
              className={`block text-sm font-medium ${colors.text} mb-4 flex items-center gap-2`}
            >
              <Users className="h-4 w-4" />
              Target Roles
            </label>
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto ${colors.backgroundMuted} border ${colors.border} rounded-lg p-4`}
            >
              {userRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.targetRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className={`rounded ${colors.border} text-blue-600 focus:ring-blue-500`}
                  />
                  <span className={`capitalize ${colors.text}`}>
                    {role.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
            <p className={`text-xs ${colors.textMuted} mt-2`}>
              Select "all" or specific roles. Leave empty to target all roles.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={createFeature}
            disabled={!form.id || !form.name || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSubmitting
              ? "Creating Feature Flag..."
              : selectedTemplate
                ? "Create Feature from Template"
                : "Create Custom Feature Flag"}
          </button>

          {/* Info Box */}
          <div
            className={`${colors.infoBg} ${colors.infoBorder} border rounded-lg p-6`}
          >
            <h4
              className={`font-semibold ${colors.infoText} mb-3 flex items-center gap-2`}
            >
              <Zap className="h-5 w-5" />
              {selectedTemplate ? "Template Benefits" : "What happens next?"}
            </h4>
            <ul className={`text-sm ${colors.infoText} space-y-2`}>
              {selectedTemplate ? (
                <>
                  <li>
                    • Using templates ensures consistency with existing features
                  </li>
                  <li>• Pre-configured targeting based on best practices</li>
                  <li>• You can still customize all settings as needed</li>
                  <li>
                    • Feature will be created in "DRAFT" mode (disabled by
                    default)
                  </li>
                </>
              ) : (
                <>
                  <li>
                    • Feature will be created in "DRAFT" mode (disabled by
                    default)
                  </li>
                  <li>
                    • Development team can build the feature behind this flag
                  </li>
                  <li>
                    • You can enable and control rollout from the Feature Flags
                    tab
                  </li>
                  <li>
                    • Use gradual rollout (0% → 25% → 50% → 100%) for safe
                    releases
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
