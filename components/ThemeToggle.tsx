"use client";

import { useThemeColors, useThemeToggle } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { toggleDarkMode, isDarkMode, mounted } = useThemeToggle();
  const { colors } = useThemeColors();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        `
        flex items-center justify-center w-10 h-10 rounded-lg
 
        transition-all duration-200 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `,
        colors.backgroundMuted,
        colors.text
      )}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

// Enhanced ThemeToggle with dropdown using your theme system
export function ThemeToggleDropdown() {
  const { setTheme, currentTheme, mounted } = useThemeToggle();

  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-32 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const currentThemeConfig =
    themes.find((t) => t.value === currentTheme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => {
          /* You can add dropdown logic here */
        }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
          text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        <currentThemeConfig.icon className="h-4 w-4" />
        <span className="text-sm font-medium">{currentThemeConfig.label}</span>
      </button>
    </div>
  );
}

// Simple Theme Indicator (shows current theme)
export function ThemeIndicator() {
  const { isDarkMode, mounted } = useThemeToggle();

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <div
        className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-blue-500" : "bg-amber-500"}`}
      />
      <span>{isDarkMode ? "Dark" : "Light"} Mode</span>
    </div>
  );
}
