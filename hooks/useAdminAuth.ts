"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { isAdminWhitelisted, getAdminConfig } from "@/lib/admin-whitelist";
import { AdminAuth } from "@/utils/adminCache";

interface UseAdminAuthReturn {
  isAdmin: boolean;
  isChecking: boolean;
  adminRole: string | null;
  adminPermissions: string[];
  source: "cache" | "convex" | "whitelist"; // Fixed type
  refreshAdminStatus: () => void;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManagePayments: boolean;
  canViewAnalytics: boolean;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const { user, isLoaded: userLoaded } = useUser();
  const [forceRefresh, setForceRefresh] = useState(0);
  const [localAdminState, setLocalAdminState] = useState<{
    isAdmin: boolean;
    adminRole: string | null;
    permissions: string[];
    source: "cache" | "convex" | "whitelist"; // Fixed here too
  }>({
    isAdmin: false,
    adminRole: null,
    permissions: [],
    source: "cache", // Default to "cache" instead of "none"
  });

  // Check cache first for immediate access
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = AdminAuth.get();
    if (cached?.isAdmin) {
      setLocalAdminState({
        isAdmin: true,
        adminRole: cached.adminRole,
        permissions: cached.permissions,
        source: "cache",
      });
    }
  }, []);

  // Check whitelist when user loads
  useEffect(() => {
    if (!user?.id || !userLoaded) return;

    const userEmail =
      user.primaryEmailAddress?.emailAddress?.toLowerCase() ||
      user.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!userEmail) {
      setLocalAdminState((prev) => ({
        ...prev,
        source: "cache", // Fallback to cache
      }));
      return;
    }

    // Check if user is in whitelist
    if (isAdminWhitelisted(userEmail)) {
      const config = getAdminConfig(userEmail);
      if (config) {
        const newState = {
          isAdmin: true,
          adminRole: config.role,
          permissions: config.permissions,
          source: "whitelist" as const,
        };

        setLocalAdminState(newState);

        // Cache this in localStorage for immediate access
        AdminAuth.set({
          isAdmin: true,
          adminRole: config.role,
          permissions: config.permissions,
          timestamp: Date.now(),
          email: userEmail,
        });
      }
    }
  }, [user, userLoaded, forceRefresh]);

  // Check Convex for additional admin data
  const convexData = useQuery(
    api.controllers.adminFuncs.getAdminStatus,
    user?.id ? { userId: user.id } : "skip"
  );

  // Determine source based on what data we have
  let source: "cache" | "convex" | "whitelist" = "cache";

  if (convexData?.isAdmin === true) {
    source = "convex";
  } else if (
    localAdminState.source === "whitelist" &&
    localAdminState.isAdmin
  ) {
    source = "whitelist";
  }

  // Combine all data sources
  const isAdmin = convexData?.isAdmin === true || localAdminState.isAdmin;
  const adminRole = convexData?.adminRole || localAdminState.adminRole;
  const permissions = convexData?.permissions || localAdminState.permissions;

  // Refresh function
  const refreshAdminStatus = useCallback(() => {
    AdminAuth.clear();
    setForceRefresh((prev) => prev + 1);
    console.log("🔄 Admin status refreshed");
  }, []);

  // Auto-refresh cache when user changes
  useEffect(() => {
    if (user?.id && localAdminState.source === "whitelist") {
      const cached = AdminAuth.get();
      if (
        !cached ||
        cached.email !== user.primaryEmailAddress?.emailAddress?.toLowerCase()
      ) {
        refreshAdminStatus();
      }
    }
  }, [user, localAdminState.source, refreshAdminStatus]);

  // Helper functions for permissions
  const canManageUsers =
    permissions.includes("user_management") || permissions.includes("all");
  const canManageContent =
    permissions.includes("content_management") || permissions.includes("all");
  const canManagePayments =
    permissions.includes("payment_management") || permissions.includes("all");
  const canViewAnalytics =
    permissions.includes("analytics") || permissions.includes("all");

  return {
    isAdmin,
    isChecking: !userLoaded || convexData === undefined,
    adminRole,
    adminPermissions: permissions,
    source,
    refreshAdminStatus,
    canManageUsers,
    canManageContent,
    canManagePayments,
    canViewAnalytics,
  };
}
