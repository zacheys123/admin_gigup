"use client";

import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function AdminRoute({ children, requiredPermission }: AdminRouteProps) {
  const { isAdmin, isChecking, adminPermissions } = useAdminCheck();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && !isAdmin) {
      router.push("/unauthorized");
      return;
    }

    if (
      !isChecking &&
      requiredPermission &&
      !adminPermissions.includes(requiredPermission) &&
      !adminPermissions.includes("all")
    ) {
      router.push("/unauthorized");
      return;
    }
  }, [isAdmin, isChecking, adminPermissions, requiredPermission, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Checking admin permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Unauthorized access</div>
      </div>
    );
  }

  return <>{children}</>;
}
