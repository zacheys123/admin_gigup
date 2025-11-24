"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminMobileNav } from "./MobileNav";
import { AdminSidebar } from "./Sidebar";
import { Header } from "./Heaser";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors, mounted } = useThemeColors();
  const { isAdmin, isChecking, adminRole } = useAdminCheck();
  const { isLoaded: userLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  console.log("🔍 AdminLayoutWrapper State:", {
    userLoaded,
    user: user
      ? { id: user.id, email: user.primaryEmailAddress?.emailAddress }
      : null,
    mounted,
    isChecking,
    isAdmin,
    adminRole,
  });

  // Redirect non-admins only after everything is loaded
  useEffect(() => {
    if (userLoaded && !isChecking && !isAdmin) {
      console.log(
        "🚫 AdminLayoutWrapper - User is not admin, redirecting to unauthorized"
      );
      router.push("/unauthorized");
    }
  }, [userLoaded, isChecking, isAdmin, router]);

  // Show loading while any check is in progress
  const isLoading = !mounted || !userLoaded || isChecking;

  if (isLoading) {
    console.log("🌀 AdminLayoutWrapper - Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Verifying admin access...
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <div>User Loaded: {userLoaded ? "✅" : "❌"}</div>
            <div>Theme Mounted: {mounted ? "✅" : "❌"}</div>
            <div>Admin Check: {isChecking ? "🔄" : "✅"}</div>
            <div>Is Admin: {isAdmin ? "✅" : "❌"}</div>
            {user && <div>User: {user.primaryEmailAddress?.emailAddress}</div>}
          </div>
        </div>
      </div>
    );
  }

  // If not admin (after checks complete), don't render
  if (!isAdmin) {
    console.log("⏸️ AdminLayoutWrapper - Blocking render: User is not admin");
    return null;
  }

  console.log(
    "✅ AdminLayoutWrapper - Rendering admin content for:",
    adminRole
  );
  return (
    <div
      className={`min-h-screen ${colors.background} transition-colors duration-200`}
    >
      <AdminMobileNav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <div
          className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 lg:ml-0">
          <main className="flex-1 pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
