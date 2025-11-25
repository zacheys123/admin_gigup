"use client";
import { api } from "@/convex/_generated/api";
import { getAdminConfig, isAdminWhitelisted } from "@/lib/admin-whitelist";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthSync() {
  const { user, isLoaded } = useUser();
  const syncAdminUser = useMutation(api.controllers.adminFuncs.syncAdminUser);
  const [hasSynced, setHasSynced] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user && !hasSynced) {
      const userEmail =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        "";

      // Check if user is in admin whitelist
      const isAdminUser = isAdminWhitelisted(userEmail);
      const adminConfig = isAdminUser ? getAdminConfig(userEmail) : null;

      if (isAdminUser && adminConfig) {
        // Sync admin user with unified function
        syncAdminUser({
          clerkId: user.id,
          email: userEmail,
          username:
            user.username ||
            userEmail.split("@")[0] ||
            `admin_${user.id.slice(0, 8)}`,
          picture: user.imageUrl,
          firstname: user.firstName || "",
          lastname: user.lastName || "",
          adminConfig: {
            role: adminConfig.role,
            permissions: adminConfig.permissions,
            accessLevel: adminConfig.accessLevel,
          },
        })
          .then((result) => {
            console.log(
              `✅ Admin user ${result.action} successfully with role: ${result.adminRole}`
            );
            console.log(`🔑 Permissions: ${result.permissions.join(", ")}`);
            setHasSynced(true);
          })
          .catch((error) => {
            console.error("❌ Error syncing admin user:", error);
            setHasSynced(true); // Mark as synced to avoid infinite retries
          });
      } else {
        // User is not in admin whitelist - redirect to unauthorized
        console.warn("🚫 User not in admin whitelist, redirecting...");
        setHasSynced(true);
        router.push("/unauthorized");
      }
    }
  }, [user, isLoaded, syncAdminUser, hasSynced, router]);

  // Show loading state while checking/syncing
  if (isLoaded && user && !hasSynced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your admin access...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
