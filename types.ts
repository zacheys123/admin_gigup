// types/admin.types.ts
export type AdminPermission =
  | "all"
  | "content_management"
  | "feature_flags"
  | "user_management"
  | "analytics"
  | "content_moderation"
  | "payment_management"
  | "notification_management"
  | "support_management"
  | "system_settings"
  | "security"
  | "api_management"
  | "infrastructure"
  | "moderation"
  | "user_support"
  | "reports"
  | "data_export";

export type AdminRole =
  | "super"
  | "content"
  | "support"
  | "analytics"
  | "admin"
  | "security"
  | "infrastructure";
export type AccessLevel = "full" | "limited" | "restricted";
