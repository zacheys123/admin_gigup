import { AccessLevel, AdminPermission, AdminRole } from "@/types";

export interface AdminConfig {
  role: AdminRole;
  permissions: AdminPermission[];
  accessLevel: AccessLevel;
}

// Define valid roles that match your Convex schema
export type ValidAdminRole =
  | "super"
  | "content"
  | "support"
  | "analytics"
  | "admin"
  | "security"
  | "infrastructure";

export const ADMIN_WHITELIST: Record<string, AdminConfig> = {
  "blessedzackeys@gmail.com": {
    role: "super",
    permissions: ["all"],
    accessLevel: "full",
  },
  "cto@company.com": {
    role: "super",
    permissions: ["all"],
    accessLevel: "full",
  },
  "bethmosho@gmail.com": {
    role: "content",
    permissions: ["content_management", "feature_flags", "content_moderation"],
    accessLevel: "restricted",
  },
  "features@company.com": {
    role: "content",
    permissions: ["feature_flags", "content_management"],
    accessLevel: "limited",
  },
  "support@company.com": {
    role: "support",
    permissions: [
      "user_management",
      "support_management",
      "content_moderation",
    ],
    accessLevel: "limited",
  },
  "help@company.com": {
    role: "support",
    permissions: ["support_management", "content_moderation"],
    accessLevel: "limited",
  },
  "analytics@company.com": {
    role: "analytics",
    permissions: ["analytics", "reports", "data_export"],
    accessLevel: "restricted",
  },
  "data@company.com": {
    role: "analytics",
    permissions: ["analytics", "reports"],
    accessLevel: "restricted",
  },
};

export const getAdminConfig = (email: string): AdminConfig | null => {
  const normalizedEmail = email.trim().toLowerCase();
  return ADMIN_WHITELIST[normalizedEmail] || null;
};

export const isAdminWhitelisted = (email: string): boolean => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail in ADMIN_WHITELIST;
};

export const getAllAdminEmails = (): string[] => {
  return Object.keys(ADMIN_WHITELIST);
};

// Helper to ensure permissions are valid for your schema
export const getValidPermissions = (
  permissions: AdminPermission[]
): AdminPermission[] => {
  const validPermissions: AdminPermission[] = [
    "all",
    "content_management",
    "feature_flags",
    "user_management",
    "analytics",
    "content_moderation",
    "payment_management",
    "notification_management",
    "support_management",
    "system_settings",
    "security",
    "api_management",
    "infrastructure",
    "moderation",
    "user_support",
    "reports",
    "data_export",
  ];

  return permissions.filter((permission) =>
    validPermissions.includes(permission)
  );
};
