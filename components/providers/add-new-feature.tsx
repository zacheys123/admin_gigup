"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const setFlag = useMutation(api.featureFlags.setFeatureFlag);
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
        enabled: false, // Start as disabled
        targetUsers: form.targetUsers,
        targetRoles: form.targetRoles,
        rolloutPercentage: form.rolloutPercentage,
      });

      // Reset form
      setForm({
        id: "",
        name: "",
        description: "",
        targetUsers: "all",
        targetRoles: [],
        rolloutPercentage: 0,
      });

      alert("Feature flag created successfully!");
    } catch (error) {
      alert("Error creating feature flag");
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Feature
        </h2>
        <p className="text-gray-600">
          Add a new feature flag to control feature releases
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="teacher_dashboard"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier (auto-formatted to snake_case)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Teacher Dashboard"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe what this feature does and who it's for..."
          />
        </div>

        {/* Targeting Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Users</option>
              <option value="free">Free Tier Only</option>
              <option value="pro">Pro Tier Only</option>
              <option value="premium">Premium Tier Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Target Roles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {userRoles.map((role) => (
              <label
                key={role}
                className="flex items-center space-x-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.targetRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize">{role.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select "all" or specific roles. Leave empty to target all roles.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={createFeature}
          disabled={!form.id || !form.name || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Feature Flag"}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            What happens next?
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
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
  );
}
