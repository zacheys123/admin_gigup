// convex/notificationHelpers.ts
import { v } from "convex/values";

// Constants
const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

/**
 * Check if a user can send or receive notifications
 * Users must be either Pro tier OR in grace period
 */
export const canUserSendOrReceiveNotifications = (user: any): boolean => {
  if (!user || !user.tier || !user._creationTime) {
    console.log("❌ [NOTIFICATION HELPER] User missing required fields:", {
      hasUser: !!user,
      hasTier: !!user?.tier,
      hasCreationTime: !!user?._creationTime,
    });
    return false;
  }

  const isPro = user.tier === "pro";
  const creationTime = user._creationTime;
  const trialEndTime = creationTime + TRIAL_DURATION_MS;
  const isInGracePeriod = Date.now() < trialEndTime;

  const canSendReceive = isPro || isInGracePeriod;

  console.log("🔍 [NOTIFICATION HELPER] User notification check:", {
    username: user.username,
    tier: user.tier,
    isPro,
    creationTime: new Date(creationTime).toISOString(),
    trialEndTime: new Date(trialEndTime).toISOString(),
    isInGracePeriod,
    canSendReceive,
  });

  return canSendReceive;
};

/**
 * Get detailed user notification status for debugging
 */
export const getUserNotificationStatus = (user: any) => {
  if (!user || !user.tier || !user._creationTime) {
    return { canSendReceive: false, error: "Missing user data" };
  }

  const isPro = user.tier === "pro";
  const creationTime = user._creationTime;
  const trialEndTime = creationTime + TRIAL_DURATION_MS;
  const currentTime = Date.now();
  const isInGracePeriod = currentTime < trialEndTime;
  const canSendReceive = isPro || isInGracePeriod;

  return {
    username: user.username,
    tier: user.tier,
    isPro,
    creationTime: new Date(creationTime).toISOString(),
    trialEndTime: new Date(trialEndTime).toISOString(),
    currentTime: new Date(currentTime).toISOString(),
    isInGracePeriod,
    canSendReceive,
    daysLeftInTrial: isInGracePeriod
      ? Math.ceil((trialEndTime - currentTime) / (1000 * 60 * 60 * 24))
      : 0,
  };
};
