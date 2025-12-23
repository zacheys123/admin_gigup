import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { AdminPermission, AdminRole } from "../adminTypes";

// Update the permission values to match your TypeScript types
const permissionValues = v.union(
  v.literal("all"),
  v.literal("content_management"),
  v.literal("feature_flags"),
  v.literal("user_management"),
  v.literal("analytics"),
  v.literal("content_moderation"),
  v.literal("payment_management"),
  v.literal("notification_management"),
  v.literal("support_management"),
  v.literal("system_settings"),
  v.literal("security"),
  v.literal("api_management"),
  v.literal("infrastructure"),
  v.literal("moderation"),
  v.literal("user_support"),
  v.literal("reports"),
  v.literal("data_export")
);

// convex/controllers/adminFuncs.ts - Update syncAdminUser handler
export const syncAdminUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.string(),
    picture: v.optional(v.string()),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    adminConfig: v.object({
      role: v.union(
        v.literal("super"),
        v.literal("content"),
        v.literal("support"),
        v.literal("analytics"),
        v.literal("admin"),
        v.literal("security"),
        v.literal("infrastructure")
      ),
      permissions: v.array(permissionValues),
      accessLevel: v.union(
        v.literal("full"),
        v.literal("limited"),
        v.literal("restricted")
      ),
    }),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    // Define permission-based access from admin config
    const canManageUsers =
      args.adminConfig.permissions.includes("user_management") ||
      args.adminConfig.permissions.includes("all");

    const canManageContent =
      args.adminConfig.permissions.includes("content_management") ||
      args.adminConfig.permissions.includes("all");

    const canManagePayments =
      args.adminConfig.permissions.includes("payment_management") ||
      args.adminConfig.permissions.includes("all");

    const canViewAnalytics =
      args.adminConfig.permissions.includes("analytics") ||
      args.adminConfig.permissions.includes("all");

    const adminUpdates = {
      // Basic profile updates
      email: args.email,
      username: args.username,
      picture: args.picture,
      firstname: args.firstname,
      lastname: args.lastname,
      lastActive: now,

      // Admin permissions
      isAdmin: true,
      adminRole: args.adminConfig.role,
      adminPermissions: args.adminConfig.permissions,
      adminAccessLevel: args.adminConfig.accessLevel,
      canManageUsers,
      canManageContent,
      canManagePayments,
      canViewAnalytics,
      adminDashboardAccess: true,
      tier: "elite" as const, // <-- FIX: Add 'as const' to specify literal type
      firstLogin: false,
      onboardingComplete: true,
    };

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, adminUpdates);
      return {
        success: true,
        userId: existingUser._id,
        action: "updated",
        adminRole: args.adminConfig.role,
        permissions: args.adminConfig.permissions,
      };
    } else {
      // Create new admin user - FIXED: Use correct tier type
      const adminUserData = {
        ...adminUpdates,
        // Add other required fields for new user
        clerkId: args.clerkId,
        isMusician: false,
        isClient: false,
        isBooker: false,
        isBoth: false,
        isBanned: false,
        earnings: 0,
        totalSpent: 0,
        monthlyGigsPosted: 0,
        monthlyMessages: 0,
        monthlyGigsBooked: 0,
        completedGigsCount: 0,
        reportsCount: 0,
        cancelgigCount: 0,
        renewalAttempts: 0,
        banReason: "",
        bannedAt: 0,
        followers: [],
        followings: [],
        refferences: [],
        mutualFollowers: 0,
        allreviews: [],
        myreviews: [],
        savedGigs: [],
        favoriteGigs: [],
        bookingHistory: [],
        adminNotes: "",
        badges: [],
        reliabilityScore: 100,
        avgRating: 0,
        performanceStats: {
          totalGigsCompleted: 0,
          onTimeRate: 100,
          clientSatisfaction: 100,
          lastUpdated: now,
        },
        badgeMilestones: {
          consecutiveGigs: 0,
          earlyCompletions: 0,
          perfectRatings: 0,
          cancellationFreeStreak: 0,
        },
        gigsBookedThisWeek: {
          count: 0,
          weekStart: now,
        },
        isPrivate: false,
        pendingFollowRequests: [],
        bookerSkills: [],
        managedBands: [],
        artistsManaged: [],
        theme: "system" as const, // <-- FIX: Add 'as const'
        firstTimeInProfile: false,
      };

      const userId = await ctx.db.insert("users", adminUserData);
      return {
        success: true,
        userId,
        action: "created",
        adminRole: args.adminConfig.role,
        permissions: args.adminConfig.permissions,
      };
    }
  },
});

export const updateUserAsAdmin = mutation({
  args: {
    clerkId: v.string(),
    updates: v.object({
      isAdmin: v.optional(v.boolean()),
      adminRole: v.optional(
        v.union(
          v.literal("super"),
          v.literal("content"),
          v.literal("support"),
          v.literal("analytics"),
          v.literal("admin"),
          v.literal("security"),
          v.literal("infrastructure")
        )
      ),
      adminPermissions: v.optional(v.array(permissionValues)),
      adminAccessLevel: v.optional(
        v.union(
          v.literal("full"),
          v.literal("limited"),
          v.literal("restricted")
        )
      ),
      canManageUsers: v.optional(v.boolean()),
      canManageContent: v.optional(v.boolean()),
      canManagePayments: v.optional(v.boolean()),
      canViewAnalytics: v.optional(v.boolean()),
      adminNotes: v.optional(v.string()),
      adminDashboardAccess: v.optional(v.boolean()),
      tier: v.optional(
        v.union(
          v.literal("free"),
          v.literal("pro"),
          v.literal("premium"),
          v.literal("elite")
        )
      ),
      firstLogin: v.optional(v.boolean()),
      lastActive: v.optional(v.number()),
      theme: v.optional(
        v.union(v.literal("light"), v.literal("dark"), v.literal("system"))
      ),
    }),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", args.clerkId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Filter out undefined values
      const cleanUpdates: any = {};
      for (const [key, value] of Object.entries(args.updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      // Create final updates with proper typing
      const finalUpdates: any = {
        ...cleanUpdates,
        lastActive: Date.now(),
      };

      // If setting as admin, ensure required fields are set
      if (args.updates.isAdmin === true) {
        // Ensure admin permissions array exists
        if (!finalUpdates.adminPermissions) {
          finalUpdates.adminPermissions = [];
        }

        // Ensure admin dashboard access is enabled
        if (finalUpdates.adminDashboardAccess === undefined) {
          finalUpdates.adminDashboardAccess = true;
        }

        // Set elite tier for admins if not specified
        if (!finalUpdates.tier) {
          finalUpdates.tier = "elite";
        }
      }

      await ctx.db.patch(user._id, finalUpdates);

      return {
        success: true,
        userId: user._id,
        adminRole: finalUpdates.adminRole || user.adminRole,
        permissions:
          finalUpdates.adminPermissions || user.adminPermissions || [],
      };
    } catch (error) {
      console.error("Error updating user as admin:", error);
      throw error;
    }
  },
});

// Get admin status
// convex/controllers/adminFuncs.ts - Update the getAdminStatus function

// Define a proper return type
interface AdminStatusResult {
  isAdmin: boolean;
  role: string | null;
  permissions: string[];
  exists: boolean;
  userId: string;
  timestamp: number;
  // Add these optional fields to match all conditions
  isAdminField?: boolean;
  error?: string;
  adminRole?: string; // This should actually be 'role', but let's fix the naming
}

export const getAdminStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log("🔍 getAdminStatus called for user:", args.userId);

    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
        .first();

      if (!user) {
        return {
          isAdmin: false,
          adminRole: null,
          permissions: [],
          exists: false,
          userId: args.userId,
          timestamp: Date.now(),
        };
      }

      // IMPORTANT: Check the correct field names from your schema
      const isAdmin = user.isAdmin === true;

      if (!isAdmin) {
        return {
          isAdmin: false,
          adminRole: null,
          permissions: [],
          exists: true,
          userId: user._id,
          timestamp: Date.now(),
        };
      }

      // Return adminRole from database (not role)
      return {
        isAdmin: true,
        adminRole: user.adminRole || null, // Use adminRole field
        permissions: user.adminPermissions || [],
        exists: true,
        userId: user._id,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("🔥 Error in getAdminStatus:", error);
      return {
        isAdmin: false,
        adminRole: null,
        permissions: [],
        exists: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
    }
  },
});

// Make a user an admin
export const makeUserAdmin = mutation({
  args: {
    clerkId: v.string(),
    adminRole: v.union(
      v.literal("super"),
      v.literal("content"),
      v.literal("support"),
      v.literal("analytics")
    ),
    permissions: v.array(permissionValues),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      isAdmin: true,
      adminRole: args.adminRole,
      adminPermissions: args.permissions as AdminPermission[],
      adminDashboardAccess: true,
      tier: "elite",
      lastActive: Date.now(),
    });

    return { success: true };
  },
});
