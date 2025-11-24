export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  // Get the whitelist from environment variables
  const whitelist = process.env.ADMIN_EMAILS?.split(",") || [];

  // In development, you might want to allow all emails or have a different behavior
  if (process.env.NODE_ENV === "development") {
    // Option 1: Allow any email in development
    // return true;

    // Option 2: Use a development-specific whitelist
    const devWhitelist = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
    return devWhitelist.includes(email.trim().toLowerCase());

    // Option 3: Fall back to production whitelist if no dev whitelist
    // const effectiveWhitelist = devWhitelist.length > 0 ? devWhitelist : whitelist;
    // return effectiveWhitelist.includes(email.trim().toLowerCase());
  }

  // In production, use the strict whitelist
  return whitelist.includes(email.trim().toLowerCase());
}
