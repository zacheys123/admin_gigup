"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAdminCheck() {
  const { user, isLoaded: userLoaded } = useUser();

  console.log("👤 useAdminCheck - Clerk user state:", {
    userLoaded,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          hasImage: user.hasImage,
        }
      : null,
  });

  const adminData = useQuery(
    api.controllers.adminFuncs.getAdminStatus,
    user?.id ? { userId: user.id } : "skip"
  );

  console.log("🔐 useAdminCheck - Convex query result:", {
    adminData,
    hasUserId: !!user?.id,
    querySkipped: !user?.id,
  });

  // Add loading states with logging
  const isChecking = !userLoaded || (user?.id && adminData === undefined);

  console.log("⚡ useAdminCheck - Final computed state:", {
    isChecking,
    isAdmin: adminData?.isAdmin ?? false,
    adminRole: adminData?.role,
    adminPermissions: adminData?.permissions,
  });

  return {
    isAdmin: adminData?.isAdmin ?? false,
    isChecking,
    adminRole: adminData?.role,
    adminPermissions: adminData?.permissions || [],
    canManageUsers:
      adminData?.permissions?.includes("user_management") ?? false,
    canManageContent:
      adminData?.permissions?.includes("content_management") ?? false,
    canManagePayments:
      adminData?.permissions?.includes("payment_management") ?? false,
    canViewAnalytics: adminData?.permissions?.includes("analytics") ?? false,
  };
}
