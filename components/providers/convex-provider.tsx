"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: "#667eea",
    colorText: "#1f2937",
    colorTextSecondary: "#6b7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc",
    colorDanger: "#ef4444",
    colorSuccess: "#10b981",
  },
  elements: {
    card: {
      backgroundColor: "#ffffff",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
    },
    headerTitle: {
      color: "#1f2937",
    },
    headerSubtitle: {
      color: "#6b7280",
    },
    formFieldInput: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
    },
    formButtonPrimary: {
      backgroundColor: "#667eea",
      borderRadius: "8px",
      color: "#ffffff",
    },
    userButtonPopoverCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
    },
  },
};

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        appearance={clerkAppearance}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              classNames: {
                toast:
                  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white",
                title: "text-gray-900 dark:text-white",
                description: "text-gray-600 dark:text-gray-400",
                actionButton: "bg-blue-600 text-white hover:bg-blue-700",
                cancelButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
                closeButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
              },
            }}
          />
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </NextThemeProvider>
  );
}
