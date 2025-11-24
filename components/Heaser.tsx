"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useUser } from "@clerk/nextjs";

export function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gigup
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isSignedIn ? (
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
