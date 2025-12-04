// app/admin/layout.tsx - UPDATED WITH FIXED SIDEBAR
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";

import { Menu, X, Shield, ChevronRight, Home, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./Sidebar";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors, mounted } = useThemeColors();
  const { isAdmin, isChecking, adminRole } = useAdminCheck();
  const { isLoaded: userLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
  const router = useRouter();

  // Handle scroll for mobile header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 20);

          // Show/hide mobile header based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setMobileHeaderVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setMobileHeaderVisible(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect non-admins only after everything is loaded
  useEffect(() => {
    if (userLoaded && !isChecking && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [userLoaded, isChecking, isAdmin, router]);

  // Show loading while any check is in progress
  const isLoading = !mounted || !userLoaded || isChecking;

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          colors.background
        )}
      >
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
          </div>
          <div className={cn("text-lg mb-3 font-medium", colors.text)}>
            Loading Admin Panel
          </div>
          <div className={cn("text-sm space-y-1", colors.textMuted)}>
            <div>Verifying permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  // If not admin (after checks complete), don't render
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={cn("min-h-screen", colors.background)}>
      {/* Fixed Sidebar - Always visible on desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} isMobile={true} />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72 transition-all duration-300">
        {/* Mobile Header - Animated */}
        <header
          className={cn(
            "sticky top-0 z-30 lg:hidden transition-all duration-300",
            colors.navBackground,
            colors.navBorder,
            isScrolled ? "border-b shadow-xl" : "border-b",
            mobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-200",
                "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
                "hover:shadow-md active:scale-95"
              )}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1
                      className={cn(
                        "font-bold text-lg leading-tight",
                        colors.text
                      )}
                    >
                      Gigup Admin
                    </h1>
                    <p
                      className={cn("text-xs leading-tight", colors.textMuted)}
                    >
                      {adminRole?.toUpperCase() || "ADMIN"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
                  "hover:shadow-md"
                )}
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className={cn("px-4 pb-3 border-t pt-3", colors.border)}>
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-gray-500" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className={cn("font-medium", colors.text)}>
                {typeof window !== "undefined"
                  ? window.location.pathname
                      .split("/")
                      .pop()
                      ?.replace("-", " ") || "Dashboard"
                  : "Dashboard"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
