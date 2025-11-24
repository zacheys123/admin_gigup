"use client";

import { useThemeColors } from "@/hooks/useTheme";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Unauthorized() {
  const { colors } = useThemeColors();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div
        className={`${colors.card} ${colors.border} border rounded-xl p-8 max-w-md w-full text-center`}
      >
        <div
          className={`w-16 h-16 ${colors.primaryBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Shield className="h-8 w-8 text-white" />
        </div>

        <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>
          Access Denied
        </h1>

        <p className={`text-sm ${colors.textMuted} mb-6`}>
          You don't have permission to access the admin panel. Please contact
          your administrator if you believe this is an error.
        </p>

        <Link
          href="/"
          className={`inline-flex items-center gap-2 px-4 py-2 ${colors.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
