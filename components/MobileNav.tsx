"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Menu, X, Shield, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface AdminMobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

const mobileNavItems = [
  { name: "Dashboard", href: "/admin", icon: Shield },
  { name: "Feature Flags", href: "/admin/feature-flags", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Shield },
  { name: "Analytics", href: "/admin/analytics", icon: Shield },
  { name: "About", href: "/admin/about", icon: Shield },
];

export function AdminMobileNav({ isOpen, onToggle }: AdminMobileNavProps) {
  const { colors } = useThemeColors();
  const { adminRole, adminPermissions } = useAdminCheck();
  const { signOut } = useClerk();
  const pathname = usePathname();

  const filteredNavItems = mobileNavItems.filter((item) => true); // Add permission logic as needed

  return (
    <>
      {/* Main Mobile Nav Bar */}
      <div
        className={`lg:hidden ${colors.navBackground} ${colors.navBorder} border-b`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${colors.primaryBg} ${colors.textInverted}`}
            >
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${colors.navText}`}>
                Gigup Admin
              </h1>
              <p className={`text-xs ${colors.textMuted}`}>
                {adminRole?.toUpperCase() || "ADMIN"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onToggle}
              className={`p-2 rounded-lg ${colors.navHover} transition-colors`}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onToggle}
          />

          {/* Slide-out Menu */}
          <div
            className={`absolute right-0 top-0 h-full w-64 ${colors.navBackground} ${colors.navBorder} border-l transform transition-transform duration-300 ease-in-out`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className={`p-4 border-b ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${colors.navText}`}>
                    Navigation
                  </h2>
                  <button
                    onClick={onToggle}
                    className={`p-2 rounded-lg ${colors.navHover} transition-colors`}
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onToggle}
                      className={`
                        flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? `${colors.primaryBg} ${colors.textInverted} shadow-md`
                            : `${colors.navText} ${colors.navHover} hover:shadow-sm`
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer Actions */}
              <div className={`p-4 border-t ${colors.border} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${colors.textMuted}`}>Theme</span>
                  <ThemeToggle />
                </div>

                <button
                  onClick={() => signOut()}
                  className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium ${colors.destructive} ${colors.destructiveHover} transition-colors`}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
