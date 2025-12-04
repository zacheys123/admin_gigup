"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useThemeColors } from "@/hooks/useTheme";
import { Search, Filter, Download, Upload, Edit, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

// Add this interface for the edit modal
interface EditFeatureModalProps {
  flag: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: any) => void;
}

// Edit Modal Component
function EditFeatureModal({
  flag,
  isOpen,
  onClose,
  onSave,
}: EditFeatureModalProps) {
  const { colors } = useThemeColors();
  const [form, setForm] = useState({
    name: flag.name,
    description: flag.description || "",
    targetUsers: flag.targetUsers || "all",
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
        ? prev.targetRoles.filter((r: string) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${colors.card} ${colors.border} border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${colors.text}`}>
            Edit Feature: {flag.id}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 ${colors.hoverBg} rounded-lg transition-colors`}
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Feature Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
            />
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
              rows={3}
              className={`w-full p-3 ${colors.background} ${colors.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${colors.text}`}
            />
          </div>

          {/* Targeting Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-sm font-medium ${colors.text} mb-2`}
              >
                Target User Tier
              </label>
              <select
                value={form.targetUsers}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, targetUsers: e.target.value }))
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
                className={`block text-sm font-medium ${colors.text} mb-2`}
              >
                Rollout: {form.rolloutPercentage}%
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
            <label className={`block text-sm font-medium ${colors.text} mb-3`}>
              Target Roles
            </label>
            <div
              className={`grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto ${colors.backgroundMuted} border ${colors.border} rounded-lg p-3`}
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${colors.border} border rounded-lg ${colors.hoverBg} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeatureFlagsManager() {
  const { colors } = useThemeColors();
  const flags = useQuery(api.controllers.featureFlags.getFeatureFlags);
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const updateFlag = useMutation(
    api.controllers.featureFlags.updateFeatureFlag
  ); // You'll need to create this mutation

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");
  const [editingFlag, setEditingFlag] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEdit = (flag: any) => {
    setEditingFlag(flag);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updates: any) => {
    try {
      console.log("🚀 [FRONTEND] Sending update:", updates);
      await updateFlag(updates);
      // The data will refresh automatically due to useQuery
    } catch (error) {
      console.error("Failed to update feature flag:", error);
    }
  };

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
            className={`${colors.card} ${colors.border} border rounded-xl p-5 hover:shadow-md transition-all group relative`}
          >
            {/* Edit Icon - Top Right */}
            <button
              onClick={() => handleEdit(flag)}
              className={`absolute top-4 right-4 p-2 ${colors.hoverBg} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}
              title="Edit feature"
            >
              <Edit
                className={cn("h-4 w-4 text-red-300 bg", colors.primaryBg)}
              />
            </button>

            {/* Header */}
            <div className="flex justify-between items-start mb-3 pr-8">
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
                          flag.rolloutPercentage - 10
                        ),
                      })
                    }
                    className={`px-3 py-2 ${colors.backgroundMuted} ${colors.text} rounded-lg ${colors.hoverBg} text-sm`}
                  >
                    -10%
                  </button>
                  <button
                    onClick={() =>
                      setFlag({
                        flagId: flag.id,
                        rolloutPercentage: Math.min(
                          100,
                          flag.rolloutPercentage + 10
                        ),
                      })
                    }
                    className={`px-3 py-2 ${colors.backgroundMuted} ${colors.text} rounded-lg ${colors.hoverBg} text-sm`}
                  >
                    +10%
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
