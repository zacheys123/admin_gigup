// types/admin.types.ts
export type AdminPermission =
  | "all"
  | "super"
  | "user_management"
  | "content_management"
  | "payment_management"
  | "analytics"
  | "feature_flags"
  | "content_moderation"
  | "notification_management"
  | "system_settings"
  | "api_access"
  | "data_export"
  | "billing_management"
  | "support_tickets"
  | "marketing"
  | "reports"
  | "support_management"; // Add any missing ones
export type AdminRole =
  | "super"
  | "content"
  | "support"
  | "analytics"
  | "admin"
  | "security"
  | "infrastructure";
export type AccessLevel = "full" | "limited" | "restricted";
