// Pre-mapped admin emails to roles
export const ADMIN_WHITELIST: Record<
  string,
  {
    role: "super" | "content" | "support" | "analytics";
    permissions: string[];
    accessLevel: "full" | "limited" | "restricted";
  }
> = {
  // Super Admins - Full system access
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

  // Content Admins - Manage content and features
  "bethmosho@gmail.com": {
    role: "content",
    permissions: ["content_management", "feature_flags", "moderation"],
    accessLevel: "restricted",
  },
  "features@company.com": {
    role: "content",
    permissions: ["feature_flags", "content_management"],
    accessLevel: "limited",
  },

  // Support Admins - User management and support
  "support@company.com": {
    role: "support",
    permissions: ["user_support", "content_moderation", "user_management"],
    accessLevel: "limited",
  },
  "help@company.com": {
    role: "support",
    permissions: ["user_support", "content_moderation"],
    accessLevel: "limited",
  },

  // Analytics Admins - Data and reporting only
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

// Helper function to get admin config by email
export const getAdminConfig = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  return ADMIN_WHITELIST[normalizedEmail];
};

// Check if email is in admin whitelist
export const isAdminWhitelisted = (email: string): boolean => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail in ADMIN_WHITELIST;
};

// Get all admin emails for verification
export const getAllAdminEmails = (): string[] => {
  return Object.keys(ADMIN_WHITELIST);
};
