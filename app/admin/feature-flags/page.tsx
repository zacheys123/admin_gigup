// app/admin/feature-flags/page.tsx - ENHANCED VERSION
"use client";

import { useState } from "react";
import { Plus, List } from "lucide-react";
import { AddNewFeature } from "@/components/add-new-feature";
import { FeatureFlagsManager } from "@/components/feature-flags-manager";

export default function FeatureFlagsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header with Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage feature releases and user access
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 lg:mt-0">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <List className="h-4 w-4" />
            View Flags
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "create"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "list" ? <FeatureFlagsManager /> : <AddNewFeature />}
    </div>
  );
}
