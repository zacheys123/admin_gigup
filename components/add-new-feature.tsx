"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useThemeColors } from "@/hooks/useTheme";
import { Plus, Zap, Users, Target } from "lucide-react";

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

export function AddNewFeature() {
  const { colors } = useThemeColors();
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    targetUsers: "all" as const,
    targetRoles: [] as string[],
    rolloutPercentage: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          Add a new feature flag to control feature releases
        </p>
      </div>

      <div className={`${colors.card} ${colors.border} border rounded-xl p-8`}>
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
                placeholder="teacher_dashboard"
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
                placeholder="Teacher Dashboard"
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
                    targetUsers: e.target.value as any,
                  }))
                }
                className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
              >
                <option value="all">All Users</option>
                <option value="free">Free Tier Only</option>
                <option value="pro">Pro Tier Only</option>
                <option value="premium">Premium Tier Only</option>
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
            {isSubmitting ? "Creating Feature Flag..." : "Create Feature Flag"}
          </button>

          {/* Info Box */}
          <div
            className={`${colors.infoBg} ${colors.infoBorder} border rounded-lg p-6`}
          >
            <h4
              className={`font-semibold ${colors.infoText} mb-3 flex items-center gap-2`}
            >
              <Zap className="h-5 w-5" />
              What happens next?
            </h4>
            <ul className={`text-sm ${colors.infoText} space-y-2`}>
              <li>
                • Feature will be created in "DRAFT" mode (disabled by default)
              </li>
              <li>• Development team can build the feature behind this flag</li>
              <li>
                • You can enable and control rollout from the Feature Flags tab
              </li>
              <li>
                • Use gradual rollout (0% → 25% → 50% → 100%) for safe releases
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
