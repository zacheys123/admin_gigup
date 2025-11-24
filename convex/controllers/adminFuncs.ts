import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAdminStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log("🔍 getAdminStatus called for user:", args.userId);

    // Check if user is admin in your database
    const adminUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();

    console.log("📊 getAdminStatus result:", adminUser);

    if (!adminUser) {
      return { isAdmin: false, role: null, permissions: [] };
    }

    return {
      isAdmin: true,
      role: adminUser.adminRole,
      permissions: adminUser.adminPermissions,
    };
  },
});
