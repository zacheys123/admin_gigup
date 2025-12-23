"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  isAdminWhitelisted,
  getAdminConfig,
  getValidPermissions,
} from "@/lib/admin-whitelist";
import { AdminAuth } from "@/utils/adminCache";

export function AdminStatusManager() {
  const { user } = useUser();
  const syncAdmin = useMutation(api.controllers.adminFuncs.syncAdminUser);
  const removeAdmin = useMutation(api.controllers.adminFuncs.updateUserAsAdmin);

  useEffect(() => {
    if (!user?.id) return;

    const userEmail =
      user.primaryEmailAddress?.emailAddress?.toLowerCase() ||
      user.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!userEmail) {
      console.log("❌ No email found for user");
      return;
    }

    // Check whitelist
    if (isAdminWhitelisted(userEmail)) {
      const adminConfig = getAdminConfig(userEmail);

      if (!adminConfig) {
        console.log("❌ No admin config found for email:", userEmail);
        return;
      }

      // Ensure permissions are valid
      const validPermissions = getValidPermissions(adminConfig.permissions);

      // Immediately cache admin status for instant access
      AdminAuth.set({
        isAdmin: true,
        adminRole: adminConfig.role,
        permissions: validPermissions,
        timestamp: Date.now(),
        email: userEmail,
      });

      // Sync with Convex in background
      syncAdmin({
        clerkId: user.id,
        email: userEmail,
        username: user.username || user.firstName || "admin",
        picture: user.imageUrl,
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        adminConfig: {
          role: adminConfig.role,
          permissions: validPermissions,
          accessLevel: adminConfig.accessLevel,
        },
      }).catch((error) => {
        console.error("❌ Failed to sync admin:", error);
      });
    } else {
      // User not in whitelist - remove admin status if they have it
      removeAdmin({
        clerkId: user.id,
        updates: { isAdmin: false },
      })
        .then(() => {
          AdminAuth.clear();
        })
        .catch((error) => {
          console.error("❌ Failed to remove admin status:", error);
        });
    }
  }, [user, syncAdmin, removeAdmin]);

  return null;
}
